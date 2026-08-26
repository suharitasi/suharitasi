#!/usr/bin/env python3
"""NHYP YAYIN NÖBETÇİSİ — eksik havza planlarını haftalık yoklar (Faz N, 2026-07-27).

NEDEN: 25 havzanın YALNIZ 12'sinin Nehir Havza Yönetim Planı elde
(veri/ham/nhyp altında 12 havza — ölçüldü). Kalan 13 havza yayımlandığında
bunu kimse fark etmiyor; su potansiyeli katmanı o havzalarda kalıcı olarak
eksik kalıyor (SÜREKLİLİK İLKESİ).

İKİ KANAL — ve her ikisinin de KENDİ ÇALIŞTIĞINI kanıtlaması şartı:

  Kanal A — BELGE SONDASI: elde olan 12 havzanın NHYP PDF URL'i HEAD ile
    yoklanır. 12/12 → 200 gelmiyorsa belge sunucusu/yol düzeni değişmiştir;
    o koşumun "yeni yayın yok" sonucu KANIT SAYILMAZ (🔴 sonda bozuk).
    Ayrıca eksik 13 havza için bilinen yol deseni denenir.
  Kanal B — DUYURU/HABER: SYGM ana sayfası duyuru+haber başlıklarını
    sunucu tarafında basıyor (ölçüldü). Başlıklarda havza adı + NHYP /
    "Nehir Havza Yönetim Plan" aranır. Yapı denetimi: sayfadan en az 5
    duyuru/haber bağlantısı çıkmalı; çıkmıyorsa 🔴 sonda bozuk.

BİLİNEN SINIR (rapora yazılır): Kanal A yeni bir havzayı ancak MEVCUT yol
desenine konursa görür; Bakanlık yeni bir klasör düzeni kullanırsa yalnız
Kanal B yakalar. Bu yüzden iki kanal birlikte koşar ve tek kanalın sessiz
kalması "yayın yok" demek değildir.

MODLAR
  --test    yalnız yoklama kanıtı; hiçbir dosyaya yazmaz, indirme yapmaz.
            Varsayılan.
  --kosum   durum damgasını (izleme/state/nhyp-yayin-durum.json) günceller.

CRONTAB'A EKLENMEZ — kurulum satırı raporda, kullanıcı onayıyla.
İndirme YAPMAZ: yalnız varlık yoklaması. PDF indirme ayrı, bilinçli iştir
(arac/nhyp-indir.sh).
"""
import argparse, html, json, os, re, subprocess, sys, time, unicodedata
import urllib.error, urllib.parse, urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HAVZA_VERI = KOK / "data/havza-veri.json"
DURUM = KOK / "izleme/state/nhyp-yayin-durum.json"
# ORTAK ÇIKIŞ KAYDI (K1, 26.08.2026 Faz B): başarı/hata/sinyalde tek satır.
# Sözleşme arac/cikis-kaydi.sh ile aynı; python uygulaması arac/cikis_kaydi.py
# (atexit YIĞILIR — mevcut davranış ezilmez, envanter §4 ölçümü).
# sys.path güvencesi ZORUNLU: altin-ornek.mjs bu betiği başka çalışma
# dizininden yükleyebilir — sys.path[0] o zaman arac/ değildir (26.08 --tam
# md23 kırmızısıyla rg-nobetci'de ölçülen hata; aynı desen burada da).
sys.path.insert(0, str(Path(__file__).resolve().parent))
from cikis_kaydi import kur as _cikis_kur, dosya_bildir as _cikis_dosya
_cikis_kur("nhyp-nobetci", str(KOK / "log/nhyp-nobetci.log"))
# NHYP_NOBETCI_SYGM_EZME: falsifikasyon kancası (SU_IZLEME_RG_CA emsali) —
# üretimde ayarlanmaz; kasıtlı bozma testi sondaları gerçek SYGM'ye
# gitmeden düşürür (2026-08-25, kalanlar paketi 5.3).
SYGM = os.environ.get("NHYP_NOBETCI_SYGM_EZME", "https://www.tarimorman.gov.tr/SYGM")
UYARICI = KOK / "arac/uyari-gonder.sh"


def uyari_gonder(konu, govde):
    """Telegram bildirimi (rg-nobetci deseni, 2026-08-25 kalanlar paketi 5.3).
    Haftalık kadans → imza-mükerrer koruması gerekmez. Gönderim hatası
    koşuyu düşürmez; stderr'e yazılır (sessiz hata yasağı)."""
    try:
        r = subprocess.run([str(UYARICI), konu, govde],
                           capture_output=True, text=True, timeout=30)
        if r.returncode != 0:
            print(f"UYARI: Telegram bildirimi gönderilemedi (exit {r.returncode}): "
                  f"{(r.stderr or r.stdout).strip()[:200]}", file=sys.stderr)
        else:
            print(f"Telegram bildirimi: {(r.stdout or '').strip()[:120]}")
    except (OSError, subprocess.TimeoutExpired) as e:
        print(f"UYARI: Telegram bildirimi çağrılamadı: {e}", file=sys.stderr)
BELGE_KOK = SYGM + "/Belgeler"
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0 Safari/537.36 suharitasi.com-veri-derleme")

# Kanal A sonda tabanı: elde olan 12 havzanın DOĞRULANMIŞ PDF yolu.
# (arac/nhyp-indir.sh manifestinden; 27.07'de 12/12 HTTP 200 ölçüldü.)
BILINEN = {
    "akarcay": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/AKARÇAY HAVZASI NHYP 28.12.2022/Akarçay NHYP.pdf",
    "bati-akdeniz": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/Batı Akdeniz Havzası NHYP 28.12.2022/Batı Akdeniz NHYP.pdf",
    "burdur": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/Burdur Havzası NHYP 28.12.2018/BUN_NHYP Nihai Raporu.pdf",
    "buyuk-menderes": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/Büyük Menderes Havzası NHYP 28.12.2022/Büyük Menderes Havzası Yeraltı Suyu Tedbirler Programı Özeti.pdf",
    "gediz": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/Gediz Havzası NHYP 28.12.2022/Gediz Havzası Nehir Havza Yönetim Planı.pdf",
    "konya-kapali": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/Konya Havzası NHYP 28.12.2022/Konya Havzası Yeraltı Suyu Tedbirler Programı Özeti - Kopya.pdf",
    "kucuk-menderes": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/Küçük Menderes Havzası NHYP 28.12.2022/EK-8 KMN YAS Künyeleri.pdf",
    "kuzey-ege": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/Kuzey Ege Havzası NHYP 28.12.2022/6) Tedbirler Programı Raporu.pdf",
    "meric-ergene": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/Meriç Ergene Havzası NHYP 28.12.2022/Meriç-Ergene Havzası Yeraltı Suları Tedbirler Programı Özeti.pdf",
    "sakarya": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/sakarya havzası/Sakarya Havzası Nehir Havza Yönetim Planı.pdf",
    "susurluk": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/Susurluk Havzası NHYP 28.12.2022/OUT_27_2.2.9_RBMP_FINAL_SU_TR_V00_R06.pdf",
    "yesilirmak": "NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/Yeşilırmak Havzası NHYP 28.12.2022/EK 1-8.pdf",
}
NHYP_ANAHTAR = re.compile(r"nhyp|nehir\s*havza\s*y[öo]netim\s*plan", re.I)


def slug(ad):
    s = ad.replace("Havzası", "").strip()
    tr = {"ı": "i", "İ": "i", "ş": "s", "Ş": "s", "ğ": "g", "Ğ": "g",
          "ü": "u", "Ü": "u", "ö": "o", "Ö": "o", "ç": "c", "Ç": "c"}
    s = "".join(tr.get(c, c) for c in s).lower()
    s = "".join(c for c in unicodedata.normalize("NFD", s)
                if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def head(url, zaman=25):
    q = urllib.parse.quote(url, safe=":/?&=%#")
    istek = urllib.request.Request(q, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(istek, timeout=zaman) as c:
            return c.status, None
    except urllib.error.HTTPError as e:
        return e.code, None
    except Exception as e:                       # ağ/TLS — yutulmaz, döner
        return None, str(e)


def main():
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--test", action="store_true", help="yalnız kanıt; YAZMA YOK (varsayılan)")
    g.add_argument("--kosum", action="store_true", help="durum damgasını güncelle")
    a = ap.parse_args()
    kosum = a.kosum
    print(f"NHYP YAYIN NÖBETÇİSİ — kip: {'KOŞUM' if kosum else 'TEST'}"
          + ("" if kosum else "  (hiçbir dosyaya YAZILMAZ, indirme YOK)"))

    havzalar = json.loads(HAVZA_VERI.read_text())["havzalar"]
    tum = {slug(h["ad"]): h["ad"] for h in havzalar}
    eksik = {s: ad for s, ad in tum.items() if s not in BILINEN}
    print(f"toplam havza : {len(tum)} · eldeki plan : {len(BILINEN)} · EKSİK : {len(eksik)}")
    hata, bulgu = [], []

    # ————————————————— Kanal A: belge sondası —————————————————
    print("\n[Kanal A] belge sondası — bilinen 12 NHYP PDF'i")
    gecen = 0
    for s, yol in sorted(BILINEN.items()):
        kod, ag = head(f"{BELGE_KOK}/{yol}")
        if ag:
            hata.append({"kanal": "A", "havza": s, "hata": ag})
            print(f"   {s:16s} AĞ HATASI {ag}", file=sys.stderr)
        elif kod == 200:
            gecen += 1
        else:
            print(f"   {s:16s} HTTP {kod}")
        time.sleep(0.3)
    print(f"   SONDA DENETİMİ: {gecen}/{len(BILINEN)} → "
          + ("🟢 kanal çalışıyor" if gecen == len(BILINEN)
             else "🔴 SONDA BOZUK — bu koşumun 'yayın yok' sonucu KANIT DEĞİL"))
    kanal_a_saglam = gecen == len(BILINEN)

    if kanal_a_saglam:
        print("   eksik havzalar bilinen yol deseninde deneniyor:")
        for s, ad in sorted(eksik.items()):
            cek = ad.replace("Havzası", "").strip()
            aday = (f"{BELGE_KOK}/NEHİR HAVZA YÖNETİM PLANLARI 28.12.2022/"
                    f"{cek} Havzası NHYP 28.12.2022/{cek} NHYP.pdf")
            kod, ag = head(aday)
            if kod == 200:
                bulgu.append({"kanal": "A", "havza": ad, "url": aday})
                print(f"      ✳ {ad} → 200  {aday}")
            time.sleep(0.3)
        if not bulgu:
            print("      (desen eşleşmesi yok — beklenen; yeni plan yeni klasöre konabilir)")

    # ————————————————— Kanal B: duyuru/haber —————————————————
    print("\n[Kanal B] SYGM duyuru/haber başlıkları")
    sayfa = ""
    try:
        istek = urllib.request.Request(SYGM, headers={"User-Agent": UA})
        with urllib.request.urlopen(istek, timeout=45) as c:
            sayfa = c.read().decode("utf-8", errors="replace")
        print(f"   {SYGM} → HTTP {c.status}, {len(sayfa)} bayt")
    except Exception as e:
        hata.append({"kanal": "B", "hata": str(e)})
        print(f"   HATA: {e}", file=sys.stderr)

    basliklar = []
    for m in re.finditer(r'<a[^>]*href="([^"]*/(?:Haber|Duyuru)/[^"]*)"[^>]*>(.*?)</a>',
                         sayfa, re.S | re.I):
        t = html.unescape(re.sub(r"<[^>]+>", " ", m.group(2)))
        basliklar.append((re.sub(r"\s+", " ", t).strip(), m.group(1)))
    print(f"   YAPI DENETİMİ: {len(basliklar)} duyuru/haber bağlantısı → "
          + ("🟢 kanal çalışıyor" if len(basliklar) >= 5
             else "🔴 SONDA BOZUK — sayfa yapısı değişmiş olabilir"))
    kanal_b_saglam = len(basliklar) >= 5
    if kanal_b_saglam:
        for baslik, url in basliklar:
            if not NHYP_ANAHTAR.search(baslik):
                continue
            for s, ad in eksik.items():
                cekirdek = ad.replace("Havzası", "").strip().split("-")[0]
                if cekirdek.lower() in baslik.lower():
                    bulgu.append({"kanal": "B", "havza": ad, "baslik": baslik, "url": url})
                    print(f"      ✳ {ad} — {baslik[:70]}")
        if not any(b["kanal"] == "B" for b in bulgu):
            print("      (eksik havzalarla ilgili NHYP duyurusu yok)")

    # ————————————————— sonuç —————————————————
    saglam = kanal_a_saglam or kanal_b_saglam
    print(f"\nSONUÇ: yeni yayın bulgusu {len(bulgu)} · "
          f"kanal sağlığı A={'🟢' if kanal_a_saglam else '🔴'} "
          f"B={'🟢' if kanal_b_saglam else '🔴'} · ağ hatası {len(hata)}")
    if not saglam:
        print("🔴 HER İKİ KANAL DA BOZUK — bu koşum hiçbir şey kanıtlamaz.")
    if not kosum:
        print("\nTEST kipi — hiçbir dosya yazılmadı, indirme yapılmadı.")
        return 0 if (saglam and not hata) else 3

    onceki = json.loads(DURUM.read_text()) if DURUM.exists() else {}
    gorulmus = {b.get("url") for b in onceki.get("bulgu", [])}
    yeni = [b for b in bulgu if b.get("url") not in gorulmus]
    DURUM.parent.mkdir(parents=True, exist_ok=True)
    DURUM.write_text(json.dumps({
        "son_kosum": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "eksik_havza": len(eksik),
        "kanal_a_saglam": kanal_a_saglam, "kanal_b_saglam": kanal_b_saglam,
        "bulgu": bulgu, "yeni_bu_kosumda": yeni, "ag_hatasi": len(hata),
    }, ensure_ascii=False, indent=1) + "\n")
    _cikis_dosya(str(DURUM), DURUM.stat().st_size)
    print(f"\nyazıldı: {DURUM} · YENİ: {len(yeni)}")
    # TELEGRAM (yalnız --kosum; --test "hiçbir yere gönderim yapmaz" sözünü
    # tutar): nöbetçinin körlüğü (sonda bozuk / ağ hatası) ve asıl olay
    # (yeni NHYP yayını) dışarı bildirilir — rg-nobetci deseni.
    if yeni:
        uyari_gonder(f"nhyp-nobetci: {len(yeni)} YENİ NHYP yayın bulgusu",
                     "\n".join(f"• {b['havza']} — {b['baslik'][:90]}" for b in yeni[:5]))
    if (not saglam) or hata:
        uyari_gonder(f"veri hattı nhyp-nobetci: sonda/ağ arızası "
                     f"(A={'🟢' if kanal_a_saglam else '🔴'} B={'🟢' if kanal_b_saglam else '🔴'} "
                     f"ağ hatası {len(hata)})",
                     "Bu koşumun 'yeni yayın yok' sonucu kanıt sayılmaz. Log: log/nhyp-nobetci.log")
    return 0 if (saglam and not hata) else 3


if __name__ == "__main__":
    sys.exit(main())
