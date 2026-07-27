#!/usr/bin/env python3
# FAZ 2 — kütle→il eşlemesi.
# Girdi: veri/potansiyel/yas-kutleleri.json + veri/ham/nhyp/*.txt + data/il-kurum.json
# Çıktı: veri/potansiyel/kutle-il.json
#
# Yöntem katmanları (her kayıtta "yontem" + "kanit" alanı):
#   kunye-il      : Sakarya künyesinde kütle bloğu içindeki "İl <ad>" satırları
#                   (PDF beyanı — en güçlü kanıt).
#   il-adi-tam    : kütle adındaki yer adı bir İL adıyla TAM KELİME eşleşiyor.
#   metin-baglami : NHYP metninde kütle adının geçtiği satır ±2 satırda tek
#                   bir il adı geçiyor (tur 2).
#   (İlçe dizini YOK — resmî liste bu sunucudan indirilemedi; rapora bakınız.
#    Bu yüzden ilçe-adı eşleşmesi bu sürümde YAPILMAMIŞTIR.)
# Çözülmeyen: durum="belirsiz" (aday listesiyle) ya da "dogrulanamadi".
# UYDURMA YOK: havza-il kesişimi gibi türetimler EŞLEME OLARAK KULLANILMAZ;
# yalnız rapor analizi için ayrı alanda sunulur (oneri_havza_illeri).
import json, re, sys
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HAM = KOK / "veri" / "ham" / "nhyp"
KUTLELER = json.loads((KOK / "veri/potansiyel/yas-kutleleri.json").read_text())
ILKURUM = json.loads((KOK / "data/il-kurum.json").read_text())
CIKTI = KOK / "veri/potansiyel/kutle-il.json"

# 81 il adı (il-kurum.json DSİ bölge listelerinden — künyeli mevcut veri)
ILLER = sorted({il for b in ILKURUM["dsiBolgeleri"].values() for il in b["iller"]})
assert len(ILLER) == 81, f"il sayısı 81 değil: {len(ILLER)}"

# Havza → il listesi (yalnız RAPOR analizi için; eşlemede KULLANILMAZ).
# havzaIlleri no-anahtarlı; no→ad eşlemesi havza-veri.json'dan.
HAVZAVERI = json.loads((KOK / "data/havza-veri.json").read_text())
NO_AD = {h["no"]: h["ad"] for h in HAVZAVERI["havzalar"]}
def havza_illeri(resmi_ad):
    for no, h in ILKURUM["havzaIlleri"].items():
        ad = NO_AD.get(no, "")
        if ad == resmi_ad or ad.replace(" Havzası", "") == resmi_ad.replace(" Havzası", ""):
            return h["iller"]
    return []

TR_KUCUK = str.maketrans("ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ",
                          "abcçdefgğhıijklmnoöprsştuüvyz")
def norm(s):
    return s.translate(TR_KUCUK).strip()

IL_NORM = {norm(il): il for il in ILLER}

# Jeolojik/generik ekler — yer adı sayılmaz
GENERIK = {"alüvyonu", "alüvyon", "kayaçları", "kayalıkları", "kireçtaşı",
           "proterozoyik", "pliyosen", "devoniyen", "ysk", "havzası", "ovası",
           "vadisi", "kanalı", "gölü", "arası", "kuzey", "güney", "doğu",
           "batı", "merkez", "yas", "kütlesi", "alüvyonlar", "neojen",
           "karstik", "kütle", "mermerleri"}

def yer_adaylari(kutle_adi):
    """Kütle adından yer-adı adayları: tam ad + tire/boşluk parçaları."""
    ad = re.sub(r"\s+", " ", kutle_adi).strip()
    adaylar = {ad}
    for parca in re.split(r"[-–]", ad):
        adaylar.add(parca.strip())
    for kelime in re.split(r"[\s\-–]+", ad):
        adaylar.add(kelime.strip())
    return {a for a in adaylar if a and norm(a) not in GENERIK}

# ---------- Katman 1: Sakarya künyesindeki İl alanları --------------------
def sakarya_kunye_il():
    sonuc = {}
    for n in (1, 2, 3):
        yol = HAM / "sakarya" / f"Sakarya Havzası Yeraltı Su Kütleleri Künyesi_{n}.txt"
        aktif = None
        for i, s in enumerate(yol.read_text(encoding="utf-8", errors="replace").split("\n")):
            m = re.search(r"YAS Kütle Kodu\s+(TR\d{8})", s)
            if m:
                aktif = m.group(1)
                sonuc.setdefault(aktif, {"iller": set(), "kanit": []})
                continue
            if aktif is None:
                continue
            m = re.match(r"^\s*İl\s{2,}(\S.*?)(?:\s{3,}|$)", s)
            if m:
                deger = m.group(1).strip()
                for parca in re.split(r"[,/]| ve ", deger):
                    parca = parca.strip()
                    if norm(parca) in IL_NORM:
                        il = IL_NORM[norm(parca)]
                        sonuc[aktif]["iller"].add(il)
                        sonuc[aktif]["kanit"].append(
                            {"dosya": yol.name, "satir": i + 1, "deger": deger})
    return sonuc

# ---------- Katman 2: il/ilçe adı TAM KELİME ----------------------------
# İlçe dizini: OSM Overpass (ODbL) — kullanıcı kararı A (2026-07-27);
# resmî listeyle çapraz doğrulama SIRADAKILER'de açık madde.
ILCE_YOL = KOK / "veri/potansiyel/ilce-il-dizini.json"
ILCE_NORM = {}
if ILCE_YOL.exists():
    _d = json.loads(ILCE_YOL.read_text())
    for _ilce, _iller in _d["ilceler"].items():
        ILCE_NORM.setdefault(norm(_ilce), (_ilce, _iller))

def il_adi_esle(kutle_adi):
    bulunan = {}
    for aday in yer_adaylari(kutle_adi):
        if norm(aday) in IL_NORM:
            bulunan[IL_NORM[norm(aday)]] = aday
    return bulunan  # il → eşleşen parça

def ilce_adi_esle(kutle_adi):
    """Yer adayları ilçe diziniyle TAM KELİME; ilçe→il listesi (çok-illi
    ilçe adı = belirsizlik kaynağı, brief 2.2)."""
    bulunan = {}
    for aday in yer_adaylari(kutle_adi):
        if norm(aday) in ILCE_NORM:
            ilce, iller = ILCE_NORM[norm(aday)]
            bulunan[ilce] = iller
    return bulunan  # ilçe → il listesi

# ---------- Katman 3 (tur 2): NHYP metninde bağlam ----------------------
# SIKI KURAL (ilk sürüm ±2 satır bağlamıyla yanlış pozitif üretti — Yatağan→
# "Aydın", Gümelönü→"Çorum" vakaları denetimde yakalandı): il adı, kütlenin
# KENDİ kodunun geçtiği satırın İÇİNDE olmalı; satırda BAŞKA kütle kodu
# bulunmamalı.
def il_tokenlari(s):
    """Satırdaki il adları; 'X Havzası' kalıbındaki X il kanıtı DEĞİLDİR
    (belge üstbilgisi 'SAKARYA HAVZASI' sahte aday üretti — ölçülen)."""
    temiz = re.sub(r"\S+\s+Havza\w*", " ", s, flags=re.IGNORECASE)
    return {IL_NORM[norm(k)] for k in re.split(r"[^A-Za-zÇĞİÖŞÜçğıöşü]+", temiz)
            if norm(k) in IL_NORM}

def metin_baglami(havza, kutle):
    """Kanıt şartları (ilk sürüm ±2 satır bağlamıyla yanlış pozitif üretti —
    Yatağan→'Aydın', Gümelönü→'Çorum' denetimde yakalandı; ikinci sürümde
    'TR12050005 Sakarya Orta' havza-sütunu gürültüsü çıktı):
    (1) kütlenin KENDİ kodu satırda, (2) satırda BAŞKA kütle kodu yok,
    (3) adın generik-olmayan bir yer parçası da AYNI satırda."""
    kod = kutle["kutle_kodu"]
    diger_kod = re.compile(r"TR\d{2}YAS\d{5}|TR\d{8}")
    parcalar = yer_adaylari(kutle["kutle_adi"])
    iller = {}
    for yol in sorted((HAM / havza).glob("*.txt")):
        satirlar = yol.read_text(encoding="utf-8", errors="replace").split("\n")
        for i, s in enumerate(satirlar):
            if kod not in s:
                continue
            if any(k != kod for k in diger_kod.findall(s)):
                continue  # satırda başka kütle kodu var — kanıt kirlenir
            if not any(p in s for p in parcalar):
                continue  # ad parçası yok — havza/durum sütunu gürültüsü
            for il in il_tokenlari(s):
                iller.setdefault(il, {"dosya": yol.name, "satir": i + 1,
                                      "alinti": " ".join(s.split())[:120]})
    return iller

# ---------- Katman 0 (yalnız Sakarya): "Kapsadığı İller" tablosu ----------
# Ana planda YSK_Kodu|YSK_Adı|Kapsadığı İller tablosu 71 kütlenin resmî il
# listesini verir (s.~39500+). İl sütunu bir ÜST satıra sarabilir (ölçülen:
# TR12050003 'Ankara, Konya, Afyonkarahisar,' üst satırda) — üst satır da
# taranır.
def sakarya_kapsadigi_iller():
    yol = HAM / "sakarya" / "Sakarya Havzası Nehir Havza Yönetim Planı.txt"
    satirlar = yol.read_text(encoding="utf-8", errors="replace").split("\n")
    # Tablo bölgesi: ilk "Kapsadığı İl" başlığından sonrası
    bas = next(i for i, s in enumerate(satirlar) if "Kapsadığı İl" in s)
    # Kütlenin KENDİ ADI il tokenı sanılmasın diye satırdan çıkarılır
    # (ölçülen: "Osmaniye Alüvyonu" → sahte 'Osmaniye' ili)
    kutle_ad = {k["kutle_kodu"]: k["kutle_adi"]
                for k in KUTLELER["havzalar"]["sakarya"]["kutleler"]}
    sonuc = {}
    r = re.compile(r"^\s*(TR\d{8})\s+(\S.*)$")
    for i in range(bas, len(satirlar)):
        m = r.match(satirlar[i])
        if not m:
            continue
        kod = m.group(1)
        # sarma her iki yöne olabiliyor (ölçülen: TR12050003 'Eskişehir' alt
        # satırda; üst/alt komşu satırlar bu bloğa aittir — blok düzeni
        # üst-desc / kod / alt-desc)
        kod_satiri = satirlar[i]
        if kod in kutle_ad:
            kod_satiri = kod_satiri.replace(kutle_ad[kod], " ")
        iller = (il_tokenlari(kod_satiri) | il_tokenlari(satirlar[i - 1])
                 | (il_tokenlari(satirlar[i + 1]) if i + 1 < len(satirlar) else set()))
        if iller and kod not in sonuc:
            sonuc[kod] = {"iller": sorted(iller),
                          "kanit": {"dosya": yol.name, "satir": i + 1,
                                    "alinti": " ".join(satirlar[i].split())[:120]}}
    return sonuc

def main():
    sk_il = sakarya_kunye_il()
    sk_kapsam = sakarya_kapsadigi_iller()
    kayitlar = []
    say = {"eslesti": 0, "belirsiz": 0, "dogrulanamadi": 0}
    for havza, hv in KUTLELER["havzalar"].items():
        for k in hv["kutleler"]:
            kayit = {"kutle_kodu": k["kutle_kodu"], "kutle_adi": k["kutle_adi"],
                     "havza": havza, "iller": [], "durum": None,
                     "yontem": None, "kanit": None,
                     "oneri_havza_illeri": havza_illeri(hv["resmi_ad"])}
            # Katman 0 — Sakarya "Kapsadığı İller" tablosu (resmî tam kırılım)
            kapsam = sk_kapsam.get(k["kutle_kodu"])
            sk = sk_il.get(k["kutle_kodu"])
            if kapsam:
                kayit.update(iller=kapsam["iller"], durum="eslesti",
                             yontem="kapsadigi-iller", kanit=kapsam["kanit"])
                # künye İl alanıyla çapraz kontrol (varsa) — çelişki notu
                if sk and sk["iller"] and not sk["iller"] <= set(kapsam["iller"]):
                    kayit["capraz_kontrol"] = {
                        "kunye_il": sorted(sk["iller"]),
                        "not": "künye İl alanı Kapsadığı İller tablosuyla birebir örtüşmüyor"}
            # Katman 1 — künye İl beyanı (yalnız sakarya'da var)
            elif sk and sk["iller"]:
                kayit.update(iller=sorted(sk["iller"]), durum="eslesti",
                             yontem="kunye-il", kanit=sk["kanit"][:3])
            else:
                # Katman 2 — il/ilçe adı tam kelime (tur 1).
                # HAVZA-TUTARLILIK FİLTRESİ: adaylardan havza illeri dışında
                # kalanlar ad-çakışması sayılır ve elenir (ölçülen 17 vaka:
                # Çavdarlı köyü→Kars ilçesi, KAYAPINAR→Diyarbakır, Hatay
                # köyü→Hatay ili...). Tüm adaylar havza-dışıysa bu katman
                # kanıt ÜRETMEZ, metin katmanına düşülür.
                il_esler = il_adi_esle(k["kutle_adi"])
                ilce_esler = ilce_adi_esle(k["kutle_adi"])
                adaylar = set(il_esler)
                for iller in ilce_esler.values():
                    adaylar |= set(iller)
                hav = set(kayit["oneri_havza_illeri"])
                adaylar_f = (adaylar & hav) if hav else adaylar
                elenen = sorted(adaylar - adaylar_f)
                if len(adaylar_f) == 1:
                    kayit.update(iller=sorted(adaylar_f), durum="eslesti",
                                 yontem="ad-dizin",
                                 kanit={"il_parca": il_esler or None,
                                        "ilce_parca": ilce_esler or None,
                                        "havza_disi_elenen": elenen or None})
                elif len(adaylar_f) > 1:
                    kayit.update(durum="belirsiz", yontem="ad-dizin",
                                 kanit={"adaylar": sorted(adaylar_f),
                                        "ilce_parca": ilce_esler or None,
                                        "havza_disi_elenen": elenen or None})
                else:
                    # Katman 3 — tur 2 metin bağlamı (havza-tutarlılık
                    # filtresi burada da geçerli — ölçülen: KM "Hatay"
                    # kütlesi [İzmir'deki semt] il adı sanılıyordu)
                    iller = metin_baglami(havza, k)
                    if hav:
                        iller = {il: v for il, v in iller.items() if il in hav}
                    if len(iller) == 1:
                        il, kanit = next(iter(iller.items()))
                        kayit.update(iller=[il], durum="eslesti",
                                     yontem="metin-baglami", kanit=kanit)
                    elif len(iller) > 1:
                        kayit.update(durum="belirsiz", yontem="metin-baglami",
                                     kanit={il: v for il, v in list(iller.items())[:5]})
                    else:
                        kayit.update(durum="dogrulanamadi",
                                     yontem="hicbiri",
                                     kanit="il/ilçe adı eşleşmedi; metinde "
                                           "kod+ad satırında il bulunamadı")
            # Karar 2 (2026-07-27): belirsiz adaylar havza-il kesişimiyle
            # çözülür; tek il kalırsa eşleşir, kalanı belirsiz kalır.
            if kayit["durum"] == "belirsiz":
                hav = set(kayit["oneri_havza_illeri"])
                aday_seti = (set(kayit["kanit"].get("adaylar", []))
                             if isinstance(kayit["kanit"], dict) and "adaylar" in kayit["kanit"]
                             else set(kayit["kanit"].keys()))
                kesisim = sorted(aday_seti & hav)
                if len(kesisim) == 1:
                    kayit.update(iller=kesisim, durum="eslesti",
                                 yontem=kayit["yontem"] + "+havza-kesisim",
                                 kanit={"adaylar": sorted(aday_seti),
                                        "havza_kesisimi": kesisim,
                                        "karar": "kullanıcı kararı 2, 2026-07-27"})
                else:
                    kayit["kanit"] = {"adaylar": sorted(aday_seti),
                                      "havza_kesisimi": kesisim,
                                      "not": "kesişim tekilleştirmedi — belirsiz kaldı"}
            say[kayit["durum"]] += 1
            kayitlar.append(kayit)
    sonuc = {"uretim_tarihi": "2026-07-27",
             "yontem_notu": ("İlçe dizini olmadan üretilmiş KISMİ eşleme. "
                             "Etiketler: eslesti (kanıtlı), belirsiz (aday listeli), "
                             "dogrulanamadi (il sayfasına BASILMAZ). "
                             "oneri_havza_illeri yalnız analiz içindir, eşleme değildir."),
             "ozet": say, "kutleler": kayitlar}
    CIKTI.write_text(json.dumps(sonuc, ensure_ascii=False, indent=1), encoding="utf-8")
    print("özet:", say, "| toplam:", len(kayitlar))
    print("yazıldı:", CIKTI)
    # yöntem kırılımı
    from collections import Counter
    print("yöntem kırılımı:", Counter((r["durum"], r["yontem"]) for r in kayitlar))

if __name__ == "__main__":
    sys.exit(main())
