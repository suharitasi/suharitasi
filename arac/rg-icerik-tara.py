#!/usr/bin/env python3
# EK İŞ (kullanıcı onayı 2026-07-27) — RG gazete-günü İÇERİK taraması.
# Kanal 1: searchtype=5 (ilan) → HTML ilan sayfaları (2003-2017) — pasaj çıkar.
# Kanal 2: searchtype=4 (içerik) → arşiv PDF'leri; yalnız 01.01.1981 SONRASI
#   olanlar işlenir (öncesi başlık taramasında zaten kayıtlı; PDF'ler
#   veri/ham/rg-pdf/ altına, gitignore).
# Kayıt kuralı (kullanıcı: "aynı kanıt kuralları"): her kayıtta tarih +
# kaynak URL + AYNEN alıntı pasaj; pasajı çıkarılamayan sayfa/PDF kayda
# DÖNÜŞMEZ, "islenemeyen" listesinde raporlanır. Çıktı AYRI dosyada
# (isletme-sahalari-ek.json) — Faz 3 çıktısı ezilmez.
import json, re, subprocess, sys, time, urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HAM = KOK / "veri/ham/rg-pdf"
CIKTI = KOK / "veri/potansiyel/isletme-sahalari-ek.json"
UA = "suharitasi.com veri derleme"
UC = "https://www.resmigazete.gov.tr/Home/Filter"

ILKURUM = json.loads((KOK / "data/il-kurum.json").read_text())
ILLER = sorted({il for b in ILKURUM["dsiBolgeleri"].values() for il in b["iller"]})
ILCE = json.loads((KOK / "veri/potansiyel/ilce-il-dizini.json").read_text())["ilceler"]
TR_KUCUK = str.maketrans("ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ",
                          "abcçdefgğhıijklmnoöprsştuüvyz")
def norm(s):
    return s.translate(TR_KUCUK).strip()
IL_NORM = {norm(il): il for il in ILLER}
ILCE_NORM = {}
for _ilce, _iller in ILCE.items():
    ILCE_NORM.setdefault(norm(_ilce), (_ilce, _iller))

PASAJ_RE = re.compile(
    r"(yeraltı ?su(?:yu|ları)?[^.]{0,120}işletme saha|işletme sahas[ıi])", re.I)

def liste_cek(searchtype):
    kayitlar = []
    start = 0
    while True:
        govde = json.dumps({"draw": 1, "start": start, "length": 25,
                            "parameters": {"searchtype": searchtype,
                                           "genelaranacakkelime": "yeraltısuyu işletme sahası",
                                           "genelbaslangictarihi": "",
                                           "genelbitistarihi": "", "genelsayi": ""}})
        istek = urllib.request.Request(UC, data=govde.encode(),
            headers={"User-Agent": UA,
                     "Content-Type": "application/json; charset=utf-8"})
        with urllib.request.urlopen(istek, timeout=60) as c:
            cevap = json.load(c)
        veri = cevap.get("data", [])
        if not veri:
            break
        kayitlar += [{"konu": r.get("konu"), "url": r.get("url")} for r in veri]
        start += len(veri)
        time.sleep(1)
        if start >= cevap.get("recordsTotal", 0):
            break
    return kayitlar

def getir_ham(url):
    istek = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(istek, timeout=120) as c:
        return c.read()

def yer_cikar(metin):
    kelimeler = re.split(r"[^A-Za-zÇĞİÖŞÜçğıöşü]+", metin)
    adaylar = list(kelimeler) + [" ".join(p) for p in zip(kelimeler, kelimeler[1:])]
    iller, ilceler = set(), {}
    for a in adaylar:
        n = norm(a)
        if n in IL_NORM:
            iller.add(IL_NORM[n])
        elif n in ILCE_NORM:
            ad, hangi = ILCE_NORM[n]
            ilceler[ad] = hangi
    ilce_il = {il for ils in ilceler.values() if len(ils) == 1 for il in ils}
    return sorted(iller | ilce_il), ilceler

def durum_sinifla(pasaj):
    b = re.sub(r"\s+", " ", norm(pasaj))
    if "kapalı ova" in b:
        return "kapalı ova"
    if any(k in b for k in ("yasak", "kapatıl", "kapatma", "tahsise kapal",
                            "durdurul", "sondaj kuyusu açılması", "açılamaz")):
        return "tahsise kapatma/kısıt"
    if any(k in b for k in ("kabul", "ilan", "ilân", "tespit", "belirlen")):
        return "işletme sahası ilanı/değişikliği"
    return "belirsiz (pasajdan sınıflanamadı)"

def pasajlar(metin):
    # eşleşme aralıkları birleştirilir (ilk sürümde çakışan pencereler aynı
    # ilanı 2+ kayda bölüyordu — ölçülen: Korkuteli çift kaydı)
    araliklar = []
    for m in PASAJ_RE.finditer(metin):
        b, s = max(0, m.start() - 350), min(len(metin), m.end() + 350)
        if araliklar and b <= araliklar[-1][1] + 400:
            araliklar[-1] = (araliklar[-1][0], s)
        else:
            araliklar.append((b, s))
    return [re.sub(r"\s+", " ", metin[b:s]).strip()[:900]
            for b, s in araliklar[:8]]

def html_metin(ham):
    """meta charset'e göre çöz (ilk sürüm hep windows-1254 varsayıyordu)."""
    bas = ham[:2048].decode("ascii", errors="ignore").lower()
    m = re.search(r"charset=[\"']?([a-z0-9-]+)", bas)
    kod = (m.group(1) if m else "windows-1254")
    if kod in ("iso-8859-9",):
        kod = "windows-1254"
    try:
        metin = ham.decode(kod, errors="replace")
    except LookupError:
        metin = ham.decode("windows-1254", errors="replace")
    return re.sub(r"<[^>]+>", " ", metin)

def pdf_metin(url, ad):
    pdf_yol = HAM / ad
    if not pdf_yol.exists():
        pdf_yol.write_bytes(getir_ham(url))
        time.sleep(1)
    return subprocess.run(["pdftotext", "-layout", str(pdf_yol), "-"],
                          capture_output=True, text=True, timeout=180).stdout

def tarih_al(konu):
    m = re.search(r"(\d{2})\.(\d{2})\.(\d{4})", konu or "")
    return m.group(0) if m else None

def main():
    HAM.mkdir(parents=True, exist_ok=True)
    ek_kayitlar = []
    islenemeyen = []
    # ---- Kanal 1: ilan HTML sayfaları (st=5)
    ilan_listesi = liste_cek("5")
    print(f"ilan (st=5) gazete-günü: {len(ilan_listesi)}")
    for i, g in enumerate(ilan_listesi, 1):
        # st=5 listesi eski yıllar için ARŞİV PDF URL'si döndürüyor (ölçülen
        # kök neden: 83 'pasaj bulunamadı' kaydının çoğu PDF'in HTML gibi
        # çözülmesiydi) — uzantıya göre yol ayrımı.
        pdf_mi = g["url"].lower().endswith(".pdf")
        try:
            if pdf_mi:
                metin = pdf_metin(g["url"], g["url"].rstrip("/").split("/")[-1])
            else:
                metin = html_metin(getir_ham(g["url"]))
        except Exception as e:
            islenemeyen.append({**g, "neden": f"indirilemedi/işlenemedi: {e}"})
            time.sleep(1)
            continue
        ps = pasajlar(metin)
        if not ps:
            islenemeyen.append({**g, "neden": ("PDF metin katmanında pasaj yok (OCR)"
                                               if pdf_mi else "pasaj bulunamadı")})
        for p in ps:
            iller, ilceler = yer_cikar(p)
            ek_kayitlar.append({
                "kaynak_turu": "rg-ilan-pdf" if pdf_mi else "rg-ilan-icerik",
                "rg_tarih": tarih_al(g["konu"]),
                "kaynak_url": g["url"],
                "pasaj": p[:700],
                "il": iller if iller else "belirsiz (pasajdan çıkarılamadı)",
                "ilceler": ilceler,
                "durum": durum_sinifla(p),
            })
        if i % 20 == 0:
            print(f"  ilan {i}/{len(ilan_listesi)} işlendi, kayıt {len(ek_kayitlar)}")
        time.sleep(1)
    # ---- Kanal 2: arşiv PDF'leri (st=4), yalnız 1981+
    icerik_listesi = liste_cek("4")
    hedef_pdf = [g for g in icerik_listesi
                 if (tarih_al(g["konu"]) or "")[-4:] >= "1981"]
    print(f"içerik (st=4) gazete-günü: {len(icerik_listesi)}, 1981+ olan: {len(hedef_pdf)}")
    for i, g in enumerate(hedef_pdf, 1):
        ad = g["url"].rstrip("/").split("/")[-1]
        try:
            metin = pdf_metin(g["url"], ad)
        except Exception as e:
            islenemeyen.append({**g, "neden": f"pdf işlenemedi: {e}"})
            continue
        ps = pasajlar(metin)
        if not ps:
            islenemeyen.append({**g, "neden": "PDF metin katmanında pasaj yok (OCR)"})
        for p in ps:
            iller, ilceler = yer_cikar(p)
            ek_kayitlar.append({
                "kaynak_turu": "rg-arsiv-pdf",
                "rg_tarih": tarih_al(g["konu"]),
                "kaynak_url": g["url"],
                "pasaj": p[:700],
                "il": iller if iller else "belirsiz (pasajdan çıkarılamadı)",
                "ilceler": ilceler,
                "durum": durum_sinifla(p),
            })
        print(f"  pdf {i}/{len(hedef_pdf)}: {ad} → pasaj {len(ps)}")
    kaynaksiz = [k for k in ek_kayitlar if not (k["rg_tarih"] and k["kaynak_url"])]
    sonuc = {
        "uretim_tarihi": "2026-07-27",
        "kaynak": "T.C. Resmî Gazete — ilan sayfaları (st=5) + arşiv PDF içerik (st=4, 1981+)",
        "not": ("Kullanıcı onaylı ek tarama (2026-07-27). Kayıt=pasaj alıntısı+tarih+URL; "
                "pasaj çıkarılamayan günler 'islenemeyen' listesinde. 1963-1980 "
                "başlık kayıtları isletme-sahalari.json'da (bu dosya EK'tir)."),
        "kayit_sayisi": len(ek_kayitlar),
        "kaynaksiz_kayit": len(kaynaksiz),
        "islenemeyen_sayisi": len(islenemeyen),
        "islenemeyen": islenemeyen,
        "kayitlar": ek_kayitlar,
    }
    CIKTI.write_text(json.dumps(sonuc, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"ek kayıt: {len(ek_kayitlar)} | kaynaksız: {len(kaynaksiz)} | işlenemeyen: {len(islenemeyen)}")
    print("yazıldı:", CIKTI)
    return 0 if not kaynaksiz else 3

if __name__ == "__main__":
    sys.exit(main())
