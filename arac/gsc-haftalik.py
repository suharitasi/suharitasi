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
  resmî limit belgesi 25.08.2026 okundu); URL denetimi KULLANILMAZ.
"""
import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

SITE = "sc-domain:suharitasi.com"
KOK = Path(__file__).resolve().parent.parent

anahtar = os.environ.get("GOOGLE_SEO_SERVICE_ACCOUNT_FILE")
if not anahtar or not os.path.isfile(anahtar):
    sys.exit("HATA: GOOGLE_SEO_SERVICE_ACCOUNT_FILE ortam değişkeni yok ya da dosya bulunamadı.")

kimlik = Credentials.from_service_account_file(
    anahtar, scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
)
servis = build("webmasters", "v3", credentials=kimlik, cache_discovery=False)


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
cikti.write_text("\n".join(satirlar), encoding="utf-8")
print(f"yazıldı: {cikti}")
