#!/usr/bin/env python3
# FAZ 4.D — OSM'den il başına natural=spring ve man_made=water_well sayıları.
# Yöntem: TR genelinde İKİ toplu Overpass sorgusu (rate-limit dersi: Faz 2'de
# il-başına sorgular 429/504 yedi) → nokta koordinatları repo'daki il
# poligonlarıyla (src/data/tr-iller.json) ışın-testi ile il'e atanır.
# Etiket (brief 4.D): "topluluk verisi, resmî doğrulanmadı". ODbL atfı
# KAYNAKLAR.md'ye Faz 6.5'te.
# Ham cevaplar veri/ham/osm/ (gitignore).
import json, sys, time, urllib.parse, urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HAM = KOK / "veri/ham/osm"
CIKTI_YOL = KOK / "veri/potansiyel/osm-su-noktalari.json"
UA = "suharitasi.com veri derleme"
AYNALAR = ["https://overpass-api.de/api/interpreter",
           "https://overpass.kumi.systems/api/interpreter"]

ILLER_GEO = json.loads((KOK / "src/data/tr-iller.json").read_text())

def kos(q):
    son = None
    for tur in range(3):
        for uc in AYNALAR:
            veri = urllib.parse.urlencode({"data": q}).encode()
            istek = urllib.request.Request(uc, data=veri, headers={"User-Agent": UA})
            try:
                with urllib.request.urlopen(istek, timeout=300) as c:
                    return json.load(c)
            except Exception as e:
                son = e
                print(f"deneme tur={tur+1} uc={uc}: {e}", file=sys.stderr)
                time.sleep(20 * (tur + 1))
    raise son

# TR-geneli tek sorgu 504/502 yedi (ölçülen) → bbox karoları (2°×4° ızgara).
# Karo TR sınırını taşabilir; TR dışı noktalar il poligon atamasında zaten
# elenir (il_bul None → 'poligon dışı').
KAROLAR = [(lat, lon, lat + 2, lon + 4)
           for lat in (35, 37, 39, 41)
           for lon in (25, 29, 33, 37, 41)]

def sorgu(anahtar, deger, bbox):
    return f"""
[out:json][timeout:120];
node["{anahtar}"="{deger}"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
out skel qt;
"""

def icinde(x, y, halka):
    """Işın testi (ray casting)."""
    n = len(halka)
    ic = False
    j = n - 1
    for i in range(n):
        xi, yi = halka[i][0], halka[i][1]
        xj, yj = halka[j][0], halka[j][1]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            ic = not ic
        j = i
    return ic

# bbox ön-elemesi + dış halka / delik testi
IL_POLY = []
for f in ILLER_GEO["features"]:
    ad = f["properties"]["name"]
    parcalar = []
    geo = f["geometry"]
    polys = geo["coordinates"] if geo["type"] == "MultiPolygon" else [geo["coordinates"]]
    for poly in polys:
        dis = poly[0]
        delikler = poly[1:]
        xs = [p[0] for p in dis]; ys = [p[1] for p in dis]
        parcalar.append((min(xs), min(ys), max(xs), max(ys), dis, delikler))
    IL_POLY.append((ad, parcalar))

# tr-iller.json tek farkla eski adı kullanıyor (ölçüldü: Afyon)
AD_DUZELT = {"Afyon": "Afyonkarahisar"}

def il_bul(x, y):
    for ad, parcalar in IL_POLY:
        for (x0, y0, x1, y1, dis, delikler) in parcalar:
            if not (x0 <= x <= x1 and y0 <= y <= y1):
                continue
            if icinde(x, y, dis) and not any(icinde(x, y, d) for d in delikler):
                return AD_DUZELT.get(ad, ad)
    return None

def say(anahtar, deger, etiket):
    noktalar = []
    gorulen = set()  # karo sınırında çift sayım olmasın (bbox uçları kapsayıcı)
    for k, bbox in enumerate(KAROLAR):
        ham_yol = HAM / f"{etiket}-karo{k}.json"
        if ham_yol.exists():
            cevap = json.loads(ham_yol.read_text())
        else:
            cevap = kos(sorgu(anahtar, deger, bbox))
            ham_yol.write_text(json.dumps(cevap), encoding="utf-8")
            time.sleep(2)
        karo_n = 0
        for e in cevap["elements"]:
            if "lon" in e and "lat" in e and e.get("id") not in gorulen:
                gorulen.add(e.get("id"))
                noktalar.append((e["lon"], e["lat"]))
                karo_n += 1
        print(f"{etiket} karo {k+1}/{len(KAROLAR)}: {karo_n} nokta")
    sayim = {}
    disarida = 0
    for x, y in noktalar:
        il = il_bul(x, y)
        if il:
            sayim[il] = sayim.get(il, 0) + 1
        else:
            disarida += 1
    print(f"{etiket}: toplam nokta {len(noktalar)}, il'e atanan "
          f"{len(noktalar)-disarida}, poligon dışı {disarida}")
    return sayim, len(noktalar), disarida

def main():
    HAM.mkdir(parents=True, exist_ok=True)
    kaynak_sayim, kaynak_n, kaynak_dis = say("natural", "spring", "spring")
    kuyu_sayim, kuyu_n, kuyu_dis = say("man_made", "water_well", "water_well")
    iller = sorted({AD_DUZELT.get(f["properties"]["name"], f["properties"]["name"])
                    for f in ILLER_GEO["features"]})
    sonuc = {
        "uretim_tarihi": "2026-07-27",
        "kaynak": "OpenStreetMap (Overpass API) — node natural=spring / man_made=water_well",
        "lisans": "ODbL 1.0 — © OpenStreetMap katkıcıları",
        "etiket": "topluluk verisi, resmî doğrulanmadı",
        "yontem": ("TR-geneli iki sorgu; noktalar src/data/tr-iller.json il "
                   "poligonlarına ışın-testiyle atandı (sınır poligonu OSM "
                   "kökenli, yaklaşıktır)"),
        "toplamlar": {"spring": kaynak_n, "spring_poligon_disi": kaynak_dis,
                      "water_well": kuyu_n, "water_well_poligon_disi": kuyu_dis},
        "iller": {il: {"kaynak_spring": kaynak_sayim.get(il, 0),
                       "kuyu_water_well": kuyu_sayim.get(il, 0)}
                  for il in iller},
    }
    CIKTI_YOL.write_text(json.dumps(sonuc, ensure_ascii=False, indent=1),
                         encoding="utf-8")
    print("yazıldı:", CIKTI_YOL)

if __name__ == "__main__":
    sys.exit(main())
