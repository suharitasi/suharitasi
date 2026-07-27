#!/usr/bin/env python3
# FAZ 1.2-1.4 — NHYP YAS kütle çıkarıcı.
# Girdi: veri/ham/nhyp/<havza>/*.txt (pdftotext -layout çıktıları)
# Çıktı: veri/potansiyel/yas-kutleleri.json
# İlke (G3): yalnız PDF metninde YAZAN alan çıkarılır; türetme/tahmin YOK.
# Kalite kapısı (1.3): PDF'in beyan ettiği kütle sayısı == çıkarılan satır
# sayısı değilse havza KIRMIZI.
import json, re, sys, unicodedata
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HAM = KOK / "veri" / "ham" / "nhyp"
CIKTI = KOK / "veri" / "potansiyel" / "yas-kutleleri.json"

# Kuzey Ege PDF'inin font kodlaması İ/ş/Ş'yi Ġ/Ģ/ġ basıyor (ölçüldü).
def ke_duzelt(s):
    return s.replace("Ġ", "İ").replace("ġ", "Ş").replace("Ģ", "ş")

def sayfa_indeksi(metin):
    """Her satır için sayfa no (1 tabanlı; \f sayarak)."""
    sayfalar, sayfa = [], 1
    for satir in metin.split("\n"):
        sayfalar.append(sayfa)
        sayfa += satir.count("\f")
    return sayfalar

def oku(yol):
    metin = yol.read_text(encoding="utf-8", errors="replace")
    return metin.split("\n"), sayfa_indeksi(metin)

def num_tr(s):
    return float(s.replace(".", "").replace(",", "."))

def kutle(havza, kod, ad, miktar, kimyasal, nihai, dosya, satir, sayfa,
          alan=None, akifer=None, ek=None):
    k = {
        "kutle_kodu": kod,
        "kutle_adi": re.sub(r"\s+", " ", ad).strip(),
        "havza": havza,
        "alan_km2": alan,
        "miktar_durumu": miktar,
        "kimyasal_durum": kimyasal,
        "nihai_durum": nihai,
        "akifer_tipi": akifer,
        "kaynak": {"dosya": dosya, "satir": satir, "sayfa": sayfa},
    }
    if ek:
        k["ek"] = ek
    return k

VERI_YOK = "veri yok"

# ---------------- OUT_27 (AB projesi) formatı: bm, konya, me, su ----------
def cikar_out27(havza, dosya_adi):
    yol = HAM / havza / dosya_adi
    satirlar, sayfalar = oku(yol)
    # "durum*" yıldızı Konya'da dipnot işaretidir (mühendis görüşü kaydı,
    # s.2144) — değere değil ek.dipnot alanına gider.
    DUR = r"(İyi|Zayıf) durum(\*)?"
    r5 = re.compile(rf"^\s*(TR\d{{2}}YAS\d{{5}})\s+(.*?)\s*{DUR}\s+{DUR}\s+{DUR}\s*$")
    r4 = re.compile(rf"^\s*(TR\d{{2}}YAS\d{{5}})\s+(.*?)\s*{DUR}\s+{DUR}\s*$")
    bulunan = {}
    for i, s in enumerate(satirlar):
        m = r5.match(s) or r4.match(s)
        if not m:
            continue
        g = m.groups()  # kod, ad, (durum, yıldız) × 2-3
        kod, ad = g[0], g[1]
        if not ad:  # ad satır kaydırmalı: önceki+sonraki dolu satırlar
            once = satirlar[i - 1].strip() if i > 0 else ""
            sonra = satirlar[i + 1].strip() if i + 1 < len(satirlar) else ""
            parcalar = [p for p in (once, sonra)
                        if p and not re.match(r"^TR\d", p) and "durum" not in p.lower()
                        and "Sayfa" not in p]
            ad = " ".join(parcalar)
        dipnotlu = any(y == "*" for y in g[3::2] if y)
        yeni = kutle(havza, kod, ad, g[2] + " durum", g[4] + " durum",
                     (g[6] + " durum") if len(g) > 6 and g[6] else None,
                     dosya_adi, i + 1, sayfalar[i],
                     ek={"dipnot": "miktar durumu yıldızlı (PDF dipnotu: DSİ/OSİB "
                                   "uzman görüşü, 19.02.2018 teknik notu)"} if dipnotlu else None)
        # 5 kolonlu (nihai'li) satır 4 kolonluyu ezer; tersi ezmez
        if kod not in bulunan or (yeni["nihai_durum"] and not bulunan[kod]["nihai_durum"]):
            bulunan[kod] = yeni
    return list(bulunan.values())

# ---------------- 3-Pilot formatı: akarcay (BÜYÜK harf durumlar) ----------
def cikar_akarcay():
    yol = HAM / "akarcay" / "Akarçay NHYP.txt"
    satirlar, sayfalar = oku(yol)
    r = re.compile(r"^\s*(TR\d{8})\s+(.+?)\s+(İYİ|ZAYIF)\s+(İYİ|ZAYIF)\s+(İYİ|ZAYIF)\s*$")
    bulunan = {}
    for i, s in enumerate(satirlar):
        m = r.match(s)
        if m and m.group(1) not in bulunan:
            bulunan[m.group(1)] = kutle("akarcay", m.group(1), m.group(2),
                m.group(3), m.group(4), m.group(5), yol.name, i + 1, sayfalar[i])
    return list(bulunan.values())

# ------- 3-Pilot formatı: bati-akdeniz / yesilirmak ("İyi Durum" vb.) -----
def cikar_pilot_durum(havza, dosya_adi):
    yol = HAM / havza / dosya_adi
    satirlar, sayfalar = oku(yol)
    D = r"(İyi Durum|Zayıf Durum|Yetersiz Veri)"
    r = re.compile(rf"^\s*(TR\d{{8}})\s+(.+?)\s+{D}\s+{D}\s+{D}\s*$")
    bulunan = {}
    for i, s in enumerate(satirlar):
        m = r.match(s)
        if m and m.group(1) not in bulunan:
            bulunan[m.group(1)] = kutle(havza, m.group(1), m.group(2),
                m.group(3), m.group(4), m.group(5), yol.name, i + 1, sayfalar[i])
    return list(bulunan.values())

# ---------------- Kuzey Ege: Tablo 6.20 (ad önce, kod sonra) --------------
def cikar_kuzey_ege():
    yol = HAM / "kuzey-ege" / "NHYP_Raporu.txt"
    satirlar, sayfalar = oku(yol)
    D = r"(İYİ|ZAYIF)"
    r = re.compile(rf"^\s*(.+?)\s+(TR\d{{8}})\s+{D}\s+{D}\s+{D}\s+(GEÇTİ|KALDI)\s+{D}\s*$")
    # Yalnız Tablo 6.20 bölgesi (6.16 miktar tablosuyla karışmasın)
    # SON geçiş alınır (ilk geçiş İçindekiler'e denk gelir — ölçülen hata)
    bas = max(i for i, s in enumerate(satirlar) if "Tablo 6.20." in ke_duzelt(s))
    son = next((i for i in range(bas + 1, len(satirlar))
                if "Tablo 6.21." in ke_duzelt(satirlar[i])), len(satirlar))
    bulunan = {}
    for i in range(bas or 0, son or len(satirlar)):
        m = r.match(ke_duzelt(satirlar[i]))
        if m and m.group(2) not in bulunan:
            bulunan[m.group(2)] = kutle("kuzey-ege", m.group(2), m.group(1),
                m.group(3), m.group(4), m.group(5), yol.name, i + 1, sayfalar[i],
                ek={"cevresel_durum": m.group(6)})
    return list(bulunan.values())

# ---------------- Küçük Menderes: Tablo 5.8 -------------------------------
def cikar_kucuk_menderes():
    yol = HAM / "kucuk-menderes" / "Nehir Havza Yönetim Planı Raporu.txt"
    satirlar, sayfalar = oku(yol)
    D = r"(İyi|Zayıf) [Dd]urum"
    r = re.compile(rf"^\s*(.*?)\s*(TR\d{{8}})\s+{D}\s+{D}\s+{D}\s*$")
    # Tam başlık aranır ("Tablo 5.8" tek başına SKKY tablolarına da çarpıyor
    # — ölçülen); İçindekiler'i atlamak için son geçiş alınır.
    bas = max(i for i, s in enumerate(satirlar)
              if "Tablo 5.8 Kütlelerin Nihai" in s)
    son = next((i for i in range(bas + 1, len(satirlar))
                if "Şekil 5.6" in satirlar[i] or re.match(r"^\s*5\.6\s", satirlar[i])),
               len(satirlar))
    bulunan = {}
    for i in range(bas or 0, son or len(satirlar)):
        m = r.match(satirlar[i])
        if not m:
            continue
        kod, ad = m.group(2), m.group(1)
        if not ad:  # ad tümüyle kaydırmalı
            once = satirlar[i - 1].strip() if i > 0 else ""
            sonra = satirlar[i + 1].strip() if i + 1 < len(satirlar) else ""
            parcalar = [p for p in (once, sonra)
                        if p and not re.search(r"TR\d{8}|Durum|Tablo|Sayfa", p)]
            ad = " ".join(parcalar)
        else:
            # ad kısmen kaydırmalı: devam parçası bir alt satırda tek başına
            # durur ("Çeşme-" / "Dalyanköy" — ölçülen vaka)
            sonra = satirlar[i + 1].strip() if i + 1 < len(satirlar) else ""
            if (sonra and len(sonra) <= 30
                    and not re.search(r"TR\d{8}|Durum|Tablo|Sayfa|T\.C\.", sonra)
                    and not r.match(satirlar[i + 1])):
                ad = ad + sonra if ad.endswith("-") else ad + " " + sonra
        if kod not in bulunan:
            bulunan[kod] = kutle("kucuk-menderes", kod, ad,
                m.group(3) + " Durum", m.group(4) + " Durum", m.group(5) + " Durum",
                yol.name, i + 1, sayfalar[i])
    return list(bulunan.values())

# ---------------- Burdur: Tablo 5.4 ---------------------------------------
def cikar_burdur():
    yol = HAM / "burdur" / "BUN_NHYP Nihai Raporu.txt"
    satirlar, sayfalar = oku(yol)
    D = r"(İyi|Zayıf) Durumda"
    r = re.compile(rf"^\s*(TR\d{{8}})\s+(.+?)\s+{D}\s+{D}\s+{D}\s*$")
    bas = max(i for i, s in enumerate(satirlar) if "Tablo 5.4 Burdur" in s)
    son = next((i for i in range(bas + 1, len(satirlar))
                if "Tablo 6" in satirlar[i]
                or re.match(r"^\s*6\s+[A-ZÇĞİÖŞÜ]", satirlar[i])), len(satirlar))
    bulunan = {}
    for i in range(bas or 0, son or len(satirlar)):
        m = r.match(satirlar[i])
        if m and m.group(1) not in bulunan:
            bulunan[m.group(1)] = kutle("burdur", m.group(1), m.group(2),
                m.group(3) + " Durumda", m.group(4) + " Durumda", m.group(5) + " Durumda",
                yol.name, i + 1, sayfalar[i])
    return list(bulunan.values())

# ---------------- Gediz: durum sınıflaması YOK; risk tabloları VAR --------
def cikar_gediz():
    yol = HAM / "gediz" / "Gediz Havzası Nehir Havza Yönetim Planı.txt"
    satirlar, sayfalar = oku(yol)
    # Tablo 3.26: kod ad çekim beslenim oran baskı risk
    r_miktar = re.compile(
        r"^\s*(TR05YAS\d{5})\s+(.+?)\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,%]+)\s+"
        r"(Önemli Baskı Altında|Baskı Altında Degil|Baskı Altında)\s+(.+?)\s*$")
    # Tablo 3.27: son kolon risk sınıfı
    r_kalite = re.compile(r"^\s*(TR05YAS\d{5})\s+(.+?)\s{2,}.*\s(Yüksek Risk Altında|Düşük Risk Altında|Risk Altında Değil)\s*$")
    bulunan, kalite_risk = {}, {}
    for i, s in enumerate(satirlar):
        m = r_miktar.match(s)
        if m and m.group(1) not in bulunan:
            bulunan[m.group(1)] = kutle("gediz", m.group(1), m.group(2),
                VERI_YOK, VERI_YOK, None, yol.name, i + 1, sayfalar[i],
                ek={"miktar_baski_sinifi": m.group(6),
                    "miktar_risk_sinifi": m.group(7).strip(),
                    "not": "Planda İyi/Zayıf durum sınıflaması yayımlanmamış; "
                           "yalnız baskı/risk sınıfları var (SYGM, 2017)."})
        m2 = r_kalite.match(s)
        if m2 and m2.group(1) not in kalite_risk:
            kalite_risk[m2.group(1)] = m2.group(3)
    for kod, risk in kalite_risk.items():
        if kod in bulunan:
            bulunan[kod]["ek"]["kirletici_risk_sinifi"] = risk
    return list(bulunan.values())

# ---------------- Sakarya: künye PDF'leri (3 dosya) -----------------------
def cikar_sakarya():
    bulunan = {}
    for n in (1, 2, 3):
        yol = HAM / "sakarya" / f"Sakarya Havzası Yeraltı Su Kütleleri Künyesi_{n}.txt"
        satirlar, sayfalar = oku(yol)
        aktif = None
        for i, s in enumerate(satirlar):
            m = re.search(r"YAS Kütle Kodu\s+(TR\d{8})\s+.*YAS Kütle Adı\s+(\S.*?)\s*$", s)
            if m:
                kod = m.group(1)
                if kod not in bulunan:
                    bulunan[kod] = kutle("sakarya", kod, m.group(2), None, None,
                                         None, yol.name, i + 1, sayfalar[i])
                aktif = bulunan[kod]
                continue
            if aktif is None:
                continue
            m = re.search(r"YAS Kütle Alanı \(km2\)\s+([\d.,]+)", s)
            if m and aktif["alan_km2"] is None:
                aktif["alan_km2"] = num_tr(m.group(1))
            m = re.search(r"^\s*Akifer Tipi\s+(\S.*?)(?:\s{3,}|$)", s)
            if m and aktif["akifer_tipi"] is None:
                aktif["akifer_tipi"] = m.group(1).strip()
            m = re.search(r"Miktar Durum\b(?!u)\s+(İyi|Zayıf)", s)
            if m and aktif["miktar_durumu"] is None:
                aktif["miktar_durumu"] = m.group(1)
            # "Tedbirler Öncesi" bloğu sütun-hizalıdır (ölçülen): başlıktaki
            # Kalite/Miktar/Nihai sütun ofsetlerine göre değer eşlenir;
            # değerler "Öncesi" satırı + bir alt satıra yayılabilir.
            if ("Kalite Durumu" in s and "Miktar Durumu" in s
                    and "Nihai Durum" in s and aktif["kimyasal_durum"] is None):
                kol = {"kalite": s.index("Kalite Durumu"),
                       "miktar": s.index("Miktar Durumu"),
                       "nihai": s.index("Nihai Durum")}
                degerler = {}
                basladi = False
                for j in range(i + 1, min(i + 8, len(satirlar))):
                    sj = satirlar[j]
                    if "Tedbirler Sonrası" in sj:
                        break
                    if "Tedbirler Öncesi" in sj:
                        basladi = True
                    if not basladi:
                        continue
                    for mv in re.finditer(r"İyi|Zayıf", sj):
                        ad_kol = min(kol, key=lambda k: abs(kol[k] - mv.start()))
                        degerler.setdefault(ad_kol, mv.group(0))
                if "kalite" in degerler:
                    aktif["kimyasal_durum"] = degerler["kalite"]
                if "nihai" in degerler and aktif["nihai_durum"] is None:
                    aktif["nihai_durum"] = degerler["nihai"]
    for k in bulunan.values():
        for alan in ("miktar_durumu", "kimyasal_durum"):
            if k[alan] is None:
                k[alan] = VERI_YOK
    return list(bulunan.values())

# ---------------- Beyan sayıları (kalite kapısı) --------------------------
def beyan_bul(havza, dosya_adi, kalip, hesap):
    """kalip: regex (satırda aranır); hesap: eşleşmelerden sayı üreten fn."""
    yol = HAM / havza / dosya_adi
    satirlar, sayfalar = oku(yol)
    for i, s in enumerate(satirlar):
        m = re.search(kalip, ke_duzelt(s))
        if m:
            return {"sayi": hesap(m), "dosya": dosya_adi, "satir": i + 1,
                    "sayfa": sayfalar[i], "alinti": re.sub(r"\s+", " ", s.strip())[:160]}
    return None

def out27_beyan(havza, dosya_adi):
    """İstatistik tablosu: İyi n + Zayıf m = toplam."""
    yol = HAM / havza / dosya_adi
    satirlar, sayfalar = oku(yol)
    iyi = zayif = None
    konum = None
    for i, s in enumerate(satirlar):
        if "istatistik" in s and ("Nihai durum" in s or "nihai durum" in s):
            for j in range(i + 1, min(i + 8, len(satirlar))):
                mi = re.match(r"^\s*İyi durum\s+(\d+)\s+%", satirlar[j])
                mz = re.match(r"^\s*Zayıf durum\s+(\d+)\s+%", satirlar[j])
                if mi:
                    iyi, konum = int(mi.group(1)), (j + 1, sayfalar[j])
                if mz:
                    zayif = int(mz.group(1))
            if iyi is not None and zayif is not None:
                return {"sayi": iyi + zayif, "dosya": dosya_adi,
                        "satir": konum[0], "sayfa": konum[1],
                        "alinti": f"Nihai durum istatistikleri: İyi {iyi} + Zayıf {zayif}"}
    return None

HAVZA_AD = {
    "akarcay": "Akarçay Havzası", "bati-akdeniz": "Batı Akdeniz Havzası",
    "burdur": "Burdur Havzası", "buyuk-menderes": "Büyük Menderes Havzası",
    "gediz": "Gediz Havzası", "konya": "Konya Kapalı Havzası",
    "kucuk-menderes": "Küçük Menderes Havzası", "kuzey-ege": "Kuzey Ege Havzası",
    "meric-ergene": "Meriç-Ergene Havzası", "sakarya": "Sakarya Havzası",
    "susurluk": "Susurluk Havzası", "yesilirmak": "Yeşilırmak Havzası",
}

def main():
    isler = {
        "akarcay": (cikar_akarcay, lambda: beyan_bul("akarcay", "Akarçay NHYP.txt",
            r"(\d+) YAS kütlesi genel durum açısından iyi durumdayken (\d+) YAS kütlesi zayıf",
            lambda m: int(m.group(1)) + int(m.group(2)))),
        "bati-akdeniz": (lambda: cikar_pilot_durum("bati-akdeniz", "Batı Akdeniz NHYP.txt"),
            lambda: out27_pilot_toplam("bati-akdeniz", "Batı Akdeniz NHYP.txt")),
        "yesilirmak": (lambda: cikar_pilot_durum("yesilirmak", "Yeşilırmak NHYP.txt"),
            lambda: out27_pilot_toplam("yesilirmak", "Yeşilırmak NHYP.txt")),
        "gediz": (cikar_gediz, lambda: beyan_bul("gediz",
            "Gediz Havzası Nehir Havza Yönetim Planı.txt",
            r"havzada yer alan (\d+) adet yeraltı suyu kütlesi", lambda m: int(m.group(1)))),
        "kuzey-ege": (cikar_kuzey_ege, lambda: beyan_bul("kuzey-ege", "NHYP_Raporu.txt",
            r"(\d+) adet yeraltı suyu kütlesi tespit edil", lambda m: int(m.group(1)))),
        "kucuk-menderes": (cikar_kucuk_menderes, lambda: beyan_bul("kucuk-menderes",
            "Nehir Havza Yönetim Planı Raporu.txt",
            r"toplam (\d+) yeraltı suyu kütlesinden", lambda m: int(m.group(1)))),
        "burdur": (cikar_burdur, lambda: beyan_bul("burdur", "BUN_NHYP Nihai Raporu.txt",
            r"(\d+) adet yeraltısuyu kütlesi belirlen", lambda m: int(m.group(1)))),
        "buyuk-menderes": (lambda: cikar_out27("buyuk-menderes",
            "OUT_27_2.2.9_RBMP_FINAL_BM_TR_V00_R06.txt"),
            lambda: out27_beyan("buyuk-menderes", "OUT_27_2.2.9_RBMP_FINAL_BM_TR_V00_R06.txt")),
        "konya": (lambda: cikar_out27("konya", "OUT_27_2.2.9_RBMP_FINAL_KO_TR_V00_R06.txt"),
            lambda: out27_beyan("konya", "OUT_27_2.2.9_RBMP_FINAL_KO_TR_V00_R06.txt")),
        "meric-ergene": (lambda: cikar_out27("meric-ergene",
            "OUT_27_2.2.9_RBMP_FINAL_ME_TR_V00_R06.txt"),
            lambda: out27_beyan("meric-ergene", "OUT_27_2.2.9_RBMP_FINAL_ME_TR_V00_R06.txt")),
        "susurluk": (lambda: cikar_out27("susurluk",
            "OUT_27_2.2.9_RBMP_FINAL_SU_TR_V00_R06.txt"),
            lambda: out27_beyan("susurluk", "OUT_27_2.2.9_RBMP_FINAL_SU_TR_V00_R06.txt")),
        "sakarya": (cikar_sakarya, lambda: beyan_bul("sakarya",
            "Sakarya Havzası Nehir Havza Yönetim Planı.txt",
            r"Havzası’nda (\d+) adet YAS kütlesi belirlen", lambda m: int(m.group(1)))),
    }
    sonuc = {"uretim_tarihi": "2026-07-27",
             "kaynak_seti": "SYGM Nehir Havza Yönetim Planları (yayımlı 12 havza)",
             "not": ("Yalnız PDF metninde yazan alanlar çıkarılmıştır; null/'veri yok' "
                     "= kaynakta yok. KIRMIZI havza verisi yayına girmez."),
             "havzalar": {}}
    toplam = 0
    kirmizi = []
    for havza, (cikar, beyan) in isler.items():
        kutleler = sorted(cikar(), key=lambda k: k["kutle_kodu"])
        b = beyan()
        durum = "YESIL" if (b and b["sayi"] == len(kutleler)) else "KIRMIZI"
        if durum == "KIRMIZI":
            kirmizi.append(havza)
        sonuc["havzalar"][havza] = {
            "resmi_ad": HAVZA_AD[havza],
            "beyan": b, "cikarilan_sayi": len(kutleler),
            "kalite_kapisi": durum, "kutleler": kutleler,
        }
        toplam += len(kutleler)
        print(f"{havza:16s} beyan={b['sayi'] if b else '?':>3} "
              f"çıkarılan={len(kutleler):3d}  {durum}")
    print(f"TOPLAM kütle: {toplam} | KIRMIZI: {len(kirmizi)} {kirmizi}")
    CIKTI.parent.mkdir(parents=True, exist_ok=True)
    CIKTI.write_text(json.dumps(sonuc, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"yazıldı: {CIKTI}")
    return 0 if not kirmizi else 3

def out27_pilot_toplam(havza, dosya_adi):
    """3-Pilot Genel Durum satırları: 'N YAS kütlesi iyi' + 'M YAS kütlesi zayıf'
    (Genel Durum kolonundaki son çift alınır — Tablo TOPLAM bloğu)."""
    yol = HAM / havza / dosya_adi
    satirlar, sayfalar = oku(yol)
    for i, s in enumerate(satirlar):
        if "Durum Değerlendirmesi, Yeraltı Suları" in s and "Tablo" in s:
            for j in range(i, min(i + 120, len(satirlar))):
                # Soldaki İLK çift = Miktar sütunu (Yetersiz Veri satırı
                # Genel sütun toplamını beyandan düşürüyor — ölçülen).
                m = re.search(r"(\d+) YAS kütlesi iyi", satirlar[j])
                if m:
                    iyi = int(m.group(1))
                    for k in range(j, min(j + 6, len(satirlar))):
                        mz = re.search(r"(\d+) YAS kütlesi zayıf", satirlar[k])
                        if mz:
                            return {"sayi": iyi + int(mz.group(1)), "dosya": dosya_adi,
                                    "satir": j + 1, "sayfa": sayfalar[j],
                                    "alinti": f"Miktar sütunu: iyi {iyi} + zayıf {mz.group(1)}"}
    return None

if __name__ == "__main__":
    sys.exit(main())
