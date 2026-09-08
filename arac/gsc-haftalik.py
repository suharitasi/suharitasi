#!/usr/bin/env python3
"""Haftalık GSC analiz koşumu — sorgu/sayfa/pozisyon çekimi + önceki
haftayla karşılaştırma + değişim raporu.

Kuruluş: gsc-mcp turu (25.08.2026, rapor/gsc-mcp-optimizasyon.md Faz 6.1).
CRON'A BAĞLI DEĞİLDİR — karar kullanıcının (kota + kredi maliyeti).
Önerilen kurulum satırı raporda.

Çalıştırma:
  GOOGLE_SEO_SERVICE_ACCOUNT_FILE=/home/suha/gsc-anahtar.json \
    /home/suha/araclar/google-seo-mcp/venv/bin/python3 arac/gsc-haftalik.py

- Anahtar YALNIZ ortam değişkeninden okunur; bu dosyaya ve rapora yol
  dışında hiçbir sır yazılmaz (güvenlik kapısı).
- GSC verisi ~2 gün gecikmelidir: "bu hafta" = bugün-9 .. bugün-3,
  "önceki hafta" = bugün-16 .. bugün-10.
- Çıktı: <GSC_CIKTI_DIZIN>/<bitiş-tarihi>.md; ezme yoksa
  rapor/gsc-haftalik/. Cron koşumu depo DIŞINA yazar (bkz. sarmalayıcı
  arac/gsc-haftalik.sh). Script commit ATMAZ.
- Kota: koşum başına 4 Search Analytics sorgusu (sınır 1.200 QPM/site —
  resmî limit belgesi 25.08.2026 okundu) + 3 URL denetimi/hafta (F1b,
  08.09.2026; URL Inspection kotası 2.000/gün, 600/dk — mülk başına).
- --kuru: indeks izleme denetler + farkı gösterir; durum dosyasına YAZMAZ,
  Telegram'a GÖNDERMEZ (sarmalayıcı bayrağı python'a aynen geçirir).
"""
import json
import os
import subprocess
import sys
import time
from datetime import date, timedelta
from pathlib import Path

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SITE = "sc-domain:suharitasi.com"
KOK = Path(__file__).resolve().parent.parent

# ── İNDEKS İZLEME (F1b, karar-kapatma 08.09.2026; rapor/08-09-karar-kapatma.md §F) ──
# Ticari omurganın üç rehberi. 08.09.2026 08:43Z tabanı (rapor/08-09-gsc-ticari-
# whatsapp.md B6a): kuyu-ruhsati "tarandı, eklenmedi" (son tarama 18.07) ·
# su-tahsisi "keşfedildi, eklenmedi" · kuyu-tasima "URL bilinmiyor". Kullanıcı
# elle dizin isteği yaptı; 11:52Z ölçümünde üçü de "Gönderildi ve dizine
# eklendi" (tarama 11:38Z). İzlenen sonraki eşik: ilk gösterim / ilk tıklama.
# Search Analytics sorgusu ARTMAZ: tık/gösterim zaten çekilen bu_sayfa'dan.
# GSC_IZLENEN_EZME: falsifikasyon kancası — üretimde ayarlanmaz; virgülle
# ayrılmış URL listesi.
IZLENEN = [u for u in os.environ.get("GSC_IZLENEN_EZME", "").split(",") if u] or [
    "https://suharitasi.com/rehberler/kuyu-ruhsati/",
    "https://suharitasi.com/rehberler/su-tahsisi-oncelik-sirasi/",
    "https://suharitasi.com/rehberler/kuyu-tasima/",
]
# coverageState YERELLEŞTİRİLMİŞ metindir: dil değişirse her hafta "değişti"
# görünür → sabit. verdict enum'u dilden bağımsız; ikisi birlikte kıyas anahtarı.
DIL = "tr-TR"
UYARICI = KOK / "arac" / "uyari-gonder.sh"
KURU = "--kuru" in sys.argv[1:]

anahtar = os.environ.get("GOOGLE_SEO_SERVICE_ACCOUNT_FILE")
if not anahtar or not os.path.isfile(anahtar):
    sys.exit("HATA: GOOGLE_SEO_SERVICE_ACCOUNT_FILE ortam değişkeni yok ya da dosya bulunamadı.")

kimlik = Credentials.from_service_account_file(
    anahtar, scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
)
servis = build("webmasters", "v3", credentials=kimlik, cache_discovery=False)
# URL Inspection yalnız searchconsole v1'de (webmasters v3 kaynakları:
# searchanalytics/sitemaps/sites). Aynı kimlik, aynı readonly kapsam yeterli
# (inspect scopes: webmasters, webmasters.readonly). Keşif belgesi
# kütüphaneyle geliyor → ek ağ isteği yok.
denetim = build("searchconsole", "v1", credentials=kimlik, cache_discovery=False)


def cek(baslangic: date, bitis: date, boyutlar: list[str]) -> list[dict]:
    yanit = servis.searchanalytics().query(
        siteUrl=SITE,
        body={
            "startDate": baslangic.isoformat(),
            "endDate": bitis.isoformat(),
            "dimensions": boyutlar,
            "rowLimit": 25000,
        },
    ).execute()
    return yanit.get("rows", [])


def stderr(*a) -> None:
    # SARMALAYICI KISITI: gsc-haftalik.sh stdout'un TAMAMINI "yazıldı: <yol>"
    # diye ayrıştırır — stdout'a eklenen her satır koşumu "çıktı dosyası
    # diskte YOK"a düşürür (kuru simülasyonla ölçüldü, keşif §1.8). Bu yüzden
    # izleme çıktısının tamamı stderr'e; sarmalayıcı onu log'a akıtır.
    print("gsc-haftalik(py):", *a, file=sys.stderr)


def uyari_gonder(konu: str, govde: str) -> None:
    """Telegram — mevcut yol arac/uyari-gonder.sh (nhyp-yayin-nobetci deseni).
    Gönderim hatası koşumu düşürmez."""
    try:
        r = subprocess.run([str(UYARICI), konu, govde], capture_output=True, text=True, timeout=30)
        if r.returncode != 0:
            stderr(f"UYARI: Telegram gönderilemedi (exit {r.returncode}): {(r.stderr or r.stdout).strip()[:200]}")
        else:
            stderr(f"Telegram: {(r.stdout or '').strip()[:120]}")
    except (OSError, subprocess.TimeoutExpired) as e:
        stderr(f"UYARI: Telegram çağrılamadı: {e}")


def denetle(url: str) -> dict:
    """URL Inspection — tek istek; yalnız indexStatusResult alanları saklanır."""
    y = denetim.urlInspection().index().inspect(body={
        "inspectionUrl": url, "siteUrl": SITE, "languageCode": DIL,
    }).execute()
    i = y.get("inspectionResult", {}).get("indexStatusResult", {})
    return {k: i.get(k) for k in (
        "verdict", "coverageState", "indexingState", "pageFetchState",
        "robotsTxtState", "lastCrawlTime", "googleCanonical", "sitemap")}


bugun = date.today()
bu_b, bu_s = bugun - timedelta(days=9), bugun - timedelta(days=3)
on_b, on_s = bugun - timedelta(days=16), bugun - timedelta(days=10)

bu_sorgu = cek(bu_b, bu_s, ["query"])
on_sorgu = cek(on_b, on_s, ["query"])
bu_sayfa = cek(bu_b, bu_s, ["page"])
on_sayfa = cek(on_b, on_s, ["page"])


def esle(bu: list[dict], on: list[dict]) -> list[dict]:
    onceki = {r["keys"][0]: r for r in on}
    satirlar = []
    for r in bu:
        k = r["keys"][0]
        o = onceki.pop(k, None)
        satirlar.append({
            "anahtar": k,
            "tik": r["clicks"], "gost": r["impressions"], "poz": r["position"],
            "tik_once": o["clicks"] if o else 0,
            "gost_once": o["impressions"] if o else 0,
            "poz_once": o["position"] if o else None,
        })
    for k, o in onceki.items():  # bu hafta kaybolanlar
        satirlar.append({
            "anahtar": k, "tik": 0, "gost": 0, "poz": None,
            "tik_once": o["clicks"], "gost_once": o["impressions"], "poz_once": o["position"],
        })
    satirlar.sort(key=lambda s: -(s["gost"] + s["gost_once"]))
    return satirlar


def tablo(satirlar: list[dict], esik: int, ad: str) -> list[str]:
    p = [f"## {ad} (göst. toplamı ≥ {esik})", "",
         "| anahtar | tık (önce→şimdi) | göst (önce→şimdi) | poz (önce→şimdi) |", "|---|---|---|---|"]
    for s in satirlar:
        if s["gost"] + s["gost_once"] < esik:
            continue
        poz = f"{s['poz_once']:.1f}" if s["poz_once"] is not None else "—"
        poz2 = f"{s['poz']:.1f}" if s["poz"] is not None else "—"
        ada = s["anahtar"].replace("https://suharitasi.com", "")
        p.append(f"| {ada} | {s['tik_once']}→{s['tik']} | {s['gost_once']}→{s['gost']} | {poz}→{poz2} |")
    p.append("")
    return p


toplam = {
    "tik": sum(r["clicks"] for r in bu_sayfa), "gost": sum(r["impressions"] for r in bu_sayfa),
    "tik_once": sum(r["clicks"] for r in on_sayfa), "gost_once": sum(r["impressions"] for r in on_sayfa),
}
# ÇIKTI DİZİNİ (25.08.2026, 7. seans — cron bağı 3e kararı): çıktı sitede
# YAYIMLANMAZ, yalnız teşhis/izleme içindir → cron koşumu depo DIŞINA yazar
# (/home/suha/gsc-cikti). Böylece git ağacı hiç kirlenmez; 18-24.08'de 41
# commit'i tıkayan "depo içine yaz, ne yok say ne commit et" tuzağı doğmaz.
# Ezme YOKSA davranış AYNEN eskisi gibi (rapor/gsc-haftalik/) — elle koşum
# ve mevcut test çıktısı etkilenmez.
cikti_dizin = Path(os.environ.get("GSC_CIKTI_DIZIN") or (KOK / "rapor" / "gsc-haftalik"))
cikti = cikti_dizin / f"{bu_s.isoformat()}.md"
cikti.parent.mkdir(parents=True, exist_ok=True)
satirlar = [
    f"# GSC haftalık değişim — {bu_b} .. {bu_s} (önceki: {on_b} .. {on_s})", "",
    f"Üretim: arac/gsc-haftalik.py · mülk {SITE} · veri gecikmesi ~2 gün varsayımıyla.", "",
    f"**Toplam:** tık {toplam['tik_once']}→{toplam['tik']} · gösterim {toplam['gost_once']}→{toplam['gost']}", "",
]
satirlar += tablo(esle(bu_sorgu, on_sorgu), 20, "Sorgular")
satirlar += tablo(esle(bu_sayfa, on_sayfa), 20, "Sayfalar")

# ── İNDEKS İZLEME (F1b) ──────────────────────────────────────────────
# Durum dosyası çıktı diziniyle AYNI yerde (cron'da /home/suha/gsc-cikti —
# depo dışı, git hiç görmez; KARARLAR §31). Tık/gösterim bu_sayfa'dan: EK
# SORGU YOK. Dilim try içinde: denetim düşerse haftalık rapor DÜŞMEZ, ama
# sessiz de kalmaz (stderr + Telegram). Durum değişmezse Telegram YOK.
durum_yol = cikti_dizin / "indeks-durum.json"
onceki = json.loads(durum_yol.read_text(encoding="utf-8")) if durum_yol.exists() \
    else {"surum": 1, "mulk": SITE, "dil": DIL, "urller": {}, "gecmis": []}
sayfa_bu = {r["keys"][0]: r for r in bu_sayfa}
bugun_iso = bugun.isoformat()
urller, notlar, hatali, gecmis = {}, [], [], list(onceki.get("gecmis", []))
for url in IZLENEN:
    eski = onceki.get("urller", {}).get(url, {})
    kisa = url.replace("https://suharitasi.com", "")
    try:
        simdi = denetle(url)
    except HttpError as e:
        kod = getattr(e, "status_code", None) or getattr(getattr(e, "resp", None), "status", "?")
        hatali.append(f"• {kisa}: HTTP {kod}")
        urller[url] = {**eski, "denetim_hatasi": f"{bugun_iso} HTTP {kod}"}
        continue
    # www satırı sc-domain mülkünde ayrı gelir — ikisi toplanır.
    s = sayfa_bu.get(url, {}); w = sayfa_bu.get(url.replace("https://", "https://www."), {})
    simdi.update({
        "tik": s.get("clicks", 0) + w.get("clicks", 0),
        "gost": s.get("impressions", 0) + w.get("impressions", 0),
        "poz": s.get("position"), "denetim_hatasi": None,
        "ilk_gorulme": eski.get("ilk_gorulme", bugun_iso),
        "son_degisim": eski.get("son_degisim", bugun_iso),
        "ilk_gost_tarihi": eski.get("ilk_gost_tarihi"),
        "ilk_tik_tarihi": eski.get("ilk_tik_tarihi"),
    })
    if not eski:
        notlar.append(f"• {kisa}: İLK KAYIT — {simdi['coverageState']} ({simdi['verdict']}) · son tarama {(simdi.get('lastCrawlTime') or '—')[:10]}")
    elif (eski.get("coverageState"), eski.get("verdict")) != (simdi["coverageState"], simdi["verdict"]):
        notlar.append(f"• {kisa}: {eski.get('coverageState')} → {simdi['coverageState']} "
                      f"(verdict {eski.get('verdict')}→{simdi['verdict']}) · son tarama "
                      f"{(simdi.get('lastCrawlTime') or '—')[:10]} · tık {eski.get('tik', 0)}→{simdi['tik']} "
                      f"· göst {eski.get('gost', 0)}→{simdi['gost']}")
        simdi["son_degisim"] = bugun_iso
        gecmis.append({"tarih": bugun_iso, "url": url, "alan": "coverageState",
                       "eski": eski.get("coverageState"), "yeni": simdi["coverageState"]})
    if simdi["gost"] > 0 and not simdi["ilk_gost_tarihi"]:
        simdi["ilk_gost_tarihi"] = bu_s.isoformat()
        notlar.append(f"• {kisa}: İLK GÖSTERİM {simdi['gost']} (pencere {bu_b}..{bu_s}) · durum: {simdi['coverageState']}")
    if simdi["tik"] > 0 and not simdi["ilk_tik_tarihi"]:
        simdi["ilk_tik_tarihi"] = bu_s.isoformat()
        notlar.append(f"• {kisa}: İLK TIKLAMA {simdi['tik']} (pencere {bu_b}..{bu_s})")
    urller[url] = simdi
    stderr(f"indeks {kisa}: {simdi['verdict']} · {simdi['coverageState']} · tık {simdi['tik']} göst {simdi['gost']}")

satirlar += ["## İndeks durumu (3 rehber — URL Inspection, tr-TR)", "",
             "| sayfa | verdict | coverageState | son tarama | tık | göst |", "|---|---|---|---|---|---|"]
for url, k in urller.items():
    satirlar.append(f"| {url.replace('https://suharitasi.com', '')} | {k.get('verdict') or '—'} | "
                    f"{k.get('coverageState') or '—'} | {(k.get('lastCrawlTime') or '—')[:10]} | "
                    f"{k.get('tik', 0)} | {k.get('gost', 0)} |")
satirlar.append("")

if KURU:
    stderr("KURU kip — durum dosyası YAZILMADI, Telegram GÖNDERİLMEDİ. Fark:",
           "\n".join(notlar + hatali) or "(yok)")
else:
    durum_yol.write_text(json.dumps({
        "surum": 1, "mulk": SITE, "dil": DIL,
        "son_kosum": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "son_pencere": {"baslangic": bu_b.isoformat(), "bitis": bu_s.isoformat()},
        "urller": urller, "gecmis": gecmis[-50:],
    }, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    stderr(f"durum yazıldı: {durum_yol}")
    if notlar:
        uyari_gonder(f"GSC indeks izleme: {len(notlar)} değişiklik", "\n".join(notlar))
    if hatali:
        uyari_gonder(f"GSC indeks izleme: {len(hatali)} URL denetlenemedi",
                     "\n".join(hatali) + "\nRapor yazıldı; durum dosyası bu URL'ler için eski değeri korur. Log: log/gsc-haftalik.log")

cikti.write_text("\n".join(satirlar), encoding="utf-8")
print(f"yazıldı: {cikti}")
