#!/usr/bin/env python3
"""FAZ I — 153 'doğrulanamadı' kütle için NHYP PDF'lerinde KOORDİNAT ikinci geçişi.

Yöntem (G3 ilkesi: yalnız metinde YAZAN alınır, türetme yok):
  1. Her kütlenin KODU (ör. TR11050073) havzasının metinlerinde aranır.
     NHYP izleme tablolarında KUYU KODU kütle kodunu İÇERİR
     (TR04050204 + '0147' → TR040502040147) — yani kuyunun koordinatı
     kütlenin içindeki bir noktadır. Bu, geçerli bir konum kanıtıdır.
  2. Koordinat YALNIZ AYNI SATIRDA aranır.
     ±satır penceresi DENENDİ VE ÇÜRÜTÜLDÜ (27.07 ölçümü): pdftotext
     -layout çıktısında tablo satırları arasında boş satır var; ±2
     penceresi KOMŞU KUYUNUN koordinatını kapıyordu — TR04050208'e
     tablo 2. satırının (TR04050206 kuyusu) koordinatı atanmıştı.
     Aynı-satır kuralı bu sızıntıyı yapısal olarak imkânsız kılar.
  3. UTM → WGS84 lat/lon; tr-iller.json il poligonlarında IŞIN TESTİ.
  4. Bir kütlenin TÜM kuyuları aynı ili göstermezse → 'belirsiz',
     atama YAPILMAZ. Tek il çıkarsa atanır.
  5. Her eşleme kanıt taşır: dosya + satır + ham koordinat + kuyu kodu.
Koordinatsız kütle 'doğrulanamadı' KALIR — tahmin ataması YOK.
"""
import json, math, re, sys
from pathlib import Path
import numpy as np

KOK = Path(__file__).resolve().parent.parent
METIN = KOK / "cikti/denetim/faz-i/metin"
KUTLE = KOK / "veri/potansiyel/kutle-il.json"
ILLER_GEO = KOK / "src/data/tr-iller.json"
CIKTI = KOK / "cikti/denetim/faz-i/koordinat-ikinci-gecis.json"
KOMSU = 2                       # ± satır penceresi

UTM_RE   = re.compile(r"\b(\d{6})(?:[.,]\d+)?\s+(\d{7})(?:[.,]\d+)?\b")
DER_RE   = re.compile(r"(\d{1,2})°\s*(\d{1,2})['′]\s*([\d.,]+)[\"″]?\s*([NEKD])", re.I)
ONDALIK_RE = re.compile(r"\b(3[6-9]|4[0-2])[.,](\d{2,6})\s+(2[5-9]|3\d|4[0-4])[.,](\d{2,6})\b")
PAFTA_RE = re.compile(r"\b([A-L]\d{2}[-]?[a-dA-D]\d?)\b")


def utm_to_wgs84(e, n, zone):
    """UTM → enlem/boylam (WGS84 elipsoidi; ED50 farkı ~<100 m, il ölçeğinde önemsiz)."""
    a, f = 6378137.0, 1/298.257223563
    e2 = f*(2-f); e1 = (1-math.sqrt(1-e2))/(1+math.sqrt(1-e2))
    x = e - 500000.0; y = n
    k0 = 0.9996; M = y/k0
    mu = M/(a*(1-e2/4-3*e2**2/64-5*e2**3/256))
    phi1 = (mu + (3*e1/2-27*e1**3/32)*math.sin(2*mu)
            + (21*e1**2/16-55*e1**4/32)*math.sin(4*mu)
            + (151*e1**3/96)*math.sin(6*mu))
    ep2 = e2/(1-e2)
    C1 = ep2*math.cos(phi1)**2
    T1 = math.tan(phi1)**2
    N1 = a/math.sqrt(1-e2*math.sin(phi1)**2)
    R1 = a*(1-e2)/(1-e2*math.sin(phi1)**2)**1.5
    D = x/(N1*k0)
    lat = phi1 - (N1*math.tan(phi1)/R1)*(D**2/2 - (5+3*T1+10*C1-4*C1**2-9*ep2)*D**4/24
          + (61+90*T1+298*C1+45*T1**2-252*ep2-3*C1**2)*D**6/720)
    lon = ((D - (1+2*T1+C1)*D**3/6
            + (5-2*C1+28*T1-3*C1**2+8*ep2+24*T1**2)*D**5/120)/math.cos(phi1))
    lon0 = math.radians(zone*6-183)
    return math.degrees(lat), math.degrees(lon)+math.degrees(lon0)


def il_bul(lon, lat, iller):
    """Işın testi (even-odd) — nokta hangi il poligonunda?"""
    for ad, halkalar in iller.items():
        icinde = False
        for h in halkalar:
            x, y = h[:, 0], h[:, 1]
            j = len(x)-1; ic = False
            for i in range(len(x)):
                if ((y[i] > lat) != (y[j] > lat)) and \
                   (lon < (x[j]-x[i])*(lat-y[i])/(y[j]-y[i]+1e-15)+x[i]):
                    ic = not ic
                j = i
            if ic: icinde = not icinde
        if icinde:
            return ad
    return None


def main():
    geo = json.loads(ILLER_GEO.read_text())
    AD_D = {"Afyon": "Afyonkarahisar"}
    iller = {}
    for f in geo["features"]:
        ad = AD_D.get(f["properties"]["name"], f["properties"]["name"])
        g = f["geometry"]
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        iller[ad] = [np.array(h) for p in polys for h in p]

    d = json.loads(KUTLE.read_text())
    hedef = [k for k in d["kutleler"] if k.get("yontem") == "hicbiri"]
    print(f"hedef kütle (doğrulanamadı): {len(hedef)}")

    # UTM DİLİM BELİRSİZLİĞİ — veriden çözülür, tahminle DEĞİL.
    # Aynı (easting, northing) çifti 35/36/37 diliminde farklı boylamlar
    # verir; PDF'lerin çoğu dilimi BEYAN ETMİYOR (yalnız Gediz "Zone 35"
    # yazıyor — ölçüldü). Bu yüzden her havzanın DOĞRULANMIŞ illeri
    # (aynı dosyadaki 314 eşleşmiş kütleden) referans alınır: bir dilim
    # çözümü ancak havzanın bilinen bir iline düşerse kabul edilir.
    # Birden çok dilim kabul edilirse → belirsiz, atama YOK.
    havza_illeri = {}
    for k in d["kutleler"]:
        if k.get("yontem") in ("kapsadigi-iller", "ad-dizin", "metin-baglami"):
            havza_illeri.setdefault(k["havza"], set()).update(k.get("iller") or [])
    print("havzaların doğrulanmış il kümesi:",
          {h: len(v) for h, v in sorted(havza_illeri.items())})

    # havza -> [(dosya, satırlar)]
    havza_metin = {}
    for t in sorted(METIN.glob("*.txt")):
        havza = t.name.split("__")[0]
        havza_metin.setdefault(havza, []).append(
            (t.name, t.read_text(encoding="utf-8", errors="replace").split("\n")))
    print("havza metin dosyası:", {h: len(v) for h, v in sorted(havza_metin.items())})

    sonuc, istat = [], {"kod_gecti": 0, "koordinat_bulundu": 0, "il_eslesti": 0,
                        "pafta_bulundu": 0, "hic_gecmedi": 0,
                        "cok_il_belirsiz": 0, "cozulemedi": 0}
    for k in hedef:
        kod, ad, havza = k["kutle_kodu"], k["kutle_adi"], k["havza"]
        kayit = {"kutle_kodu": kod, "kutle_adi": ad, "havza": havza,
                 "kod_gecisleri": 0, "koordinatlar": [], "paftalar": [], "il": None}
        for dosya, satirlar in havza_metin.get(havza, []):
            for i, s in enumerate(satirlar):
                if kod not in s:
                    continue
                kayit["kod_gecisleri"] += 1
                # SADECE AYNI SATIR — komşu satır sızıntısı yapısal olarak yasak
                for m in UTM_RE.finditer(s):
                    e, n = int(m.group(1)), int(m.group(2))
                    if not (150000 < e < 850000 and 3900000 < n < 4700000):
                        continue
                    kuyu = re.search(rf"\b({kod}\d+)\b", s)
                    kayit["koordinatlar"].append(
                        {"tur": "UTM", "ham": m.group(0), "dosya": dosya,
                         "satir": i+1, "kuyu_kodu": kuyu.group(1) if kuyu else None,
                         "satir_metni": re.sub(r"\s+", " ", s.strip())[:160]})
                for m in DER_RE.finditer(s):
                    kayit["koordinatlar"].append(
                        {"tur": "derece", "ham": m.group(0), "dosya": dosya, "satir": i+1,
                         "satir_metni": re.sub(r"\s+", " ", s.strip())[:160]})
                for m in PAFTA_RE.finditer(s):
                    kayit["paftalar"].append({"pafta": m.group(1), "dosya": dosya, "satir": i+1})
        if kayit["kod_gecisleri"] == 0:
            istat["hic_gecmedi"] += 1
        else:
            istat["kod_gecti"] += 1
        if kayit["paftalar"]:
            istat["pafta_bulundu"] += 1
        if kayit["koordinatlar"]:
            istat["koordinat_bulundu"] += 1
            # HER koordinatı ile çevir; hepsi aynı ili göstermezse ATAMA YOK
            iller_bulunan = {}
            referans = havza_illeri.get(havza, set())
            for c in kayit["koordinatlar"]:
                if c["tur"] != "UTM":
                    continue
                m = UTM_RE.search(c["ham"])
                kabul = []
                for zone in (35, 36, 37):
                    lat, lon = utm_to_wgs84(int(m.group(1)), int(m.group(2)), zone)
                    if not (35 < lat < 43 and 25 < lon < 45):
                        continue
                    il = il_bul(lon, lat, iller)
                    # DİLİM KAPISI: çözüm havzanın doğrulanmış illerinden
                    # birine düşmeli. Düşmüyorsa yanlış dilimdir, atılır.
                    if il and il in referans:
                        kabul.append({"zone": zone, "lat": round(lat, 5),
                                      "lon": round(lon, 5), "il": il})
                if len(kabul) == 1:
                    c["cozum"] = kabul[0]
                    iller_bulunan.setdefault(kabul[0]["il"], []).append(c)
                elif len(kabul) > 1:
                    c["cozum_belirsiz"] = kabul   # birden çok dilim geçerli → kullanılmaz
            kayit["il_adaylari"] = {k: len(v) for k, v in iller_bulunan.items()}
            if len(iller_bulunan) == 1:
                il = next(iter(iller_bulunan))
                c = iller_bulunan[il][0]
                kayit["il"] = il
                kayit["kanit"] = (
                    f"{c['dosya']} s.{c['satir']} — kuyu {c.get('kuyu_kodu') or '(kod satırda)'} "
                    f"UTM zone {c['cozum']['zone']} '{c['ham']}' → "
                    f"{c['cozum']['lat']},{c['cozum']['lon']} → {il} (ışın testi); "
                    f"aynı kütlede {len(iller_bulunan[il])} koordinat, hepsi aynı il")
                istat["il_eslesti"] += 1
            elif len(iller_bulunan) > 1:
                kayit["durum"] = "belirsiz — koordinatlar birden çok il gösteriyor"
                istat["cok_il_belirsiz"] += 1
            else:
                istat["cozulemedi"] += 1
        sonuc.append(kayit)

    print("\n=== SONUÇ ===")
    for k, v in istat.items():
        print(f"  {k:22s}: {v}")
    CIKTI.parent.mkdir(parents=True, exist_ok=True)
    CIKTI.write_text(json.dumps(
        {"tarih": "2026-07-27", "hedef_kutle": len(hedef), "istat": istat,
         "kayitlar": sonuc}, ensure_ascii=False, indent=1))
    print("yazıldı:", CIKTI)
    esleseneler = [s for s in sonuc if s["il"]]
    for s in esleseneler[:15]:
        print(f"  + {s['kutle_kodu']} {s['kutle_adi'][:32]:32s} → {s['il']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
