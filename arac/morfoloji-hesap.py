#!/usr/bin/env python3
# FAZ 5 — GLO-90 morfoloji göstergeleri (il başına).
# Kaynak: Copernicus GLO-90 DEM (AWS açık dağıtımı copernicus-dem-90m).
# Kapı ölçümü (5.1): 122 karo × ~4 MB ≈ ~0,5 GB; disk 48G boş → geçti.
# Yöntem: karo karo (RAM ~6 MB/karo):
#   - eğim% = 100·√((dz/dx)²+(dz/dy)²), 3-arcsec adım (dx lat'a göre)
#   - düşük eğim oranı: eğim < %2 piksellerin il alanına oranı
#   - vadi tabanı göstergesi: eğim < %2 VE (yükseklik − 11×11 pencere
#     minimumu) < 10 m  (≈1 km yerel çukurluk — akış birikimi DEĞİLDİR)
#   - TWI: HESAPLANMADI — akış birikimi tüm-DEM işlem ister, 2C/4GB sunucu
#     bütçesini aşar (brief 5.3 "yalnız kaynak yeterse").
# İl maskesi: src/data/tr-iller.json (OSM/ODbL) scanline-rasterize.
# Çıktı: veri/potansiyel/morfoloji.json — brief 5.4 sabit etiketiyle.
import json, math, sys, time, urllib.request
from pathlib import Path
import numpy as np
import tifffile

KOK = Path(__file__).resolve().parent.parent
HAM = KOK / "veri/ham/dem"
CIKTI = KOK / "veri/potansiyel/morfoloji.json"
UA = "suharitasi.com veri derleme"
PX = 1200                      # 1° / 3 arcsec
ARC3_M = 92.66                 # 3 arcsec'in metre karşılığı (enlemde)
AD_DUZELT = {"Afyon": "Afyonkarahisar"}

geo = json.loads((KOK / "src/data/tr-iller.json").read_text())
KAROLAR = json.loads(Path(
    "/tmp/claude-1000/-home-suha-projeler-suharitasi/59bbb60e-d332-428b-af43-50ecd590f62c/scratchpad/karolar.json"
).read_text())

# il → halkalar (dış + delik; even-odd doldurma hepsini birlikte işler)
ILLER = {}
for f in geo["features"]:
    ad = AD_DUZELT.get(f["properties"]["name"], f["properties"]["name"])
    g = f["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    halkalar = [np.array(h) for poly in polys for h in poly]
    xs = np.concatenate([h[:, 0] for h in halkalar])
    ys = np.concatenate([h[:, 1] for h in halkalar])
    ILLER[ad] = {"halkalar": halkalar,
                 "bbox": (xs.min(), ys.min(), xs.max(), ys.max())}

def indir(lat, lon):
    ad = f"Copernicus_DSM_COG_30_N{lat:02d}_00_E{lon:03d}_00_DEM"
    yol = HAM / f"{ad}.tif"
    if yol.exists():
        return yol
    url = f"https://copernicus-dem-90m.s3.amazonaws.com/{ad}/{ad}.tif"
    istek = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(istek, timeout=120) as c:
            yol.write_bytes(c.read())
        time.sleep(1)
        return yol
    except urllib.error.HTTPError as e:
        if e.code == 404:      # tam-deniz karosu dağıtımda yok
            return None
        raise

def maske(il, lat, lon):
    """Karo (lat..lat+1, lon..lon+1) için il maskesi — scanline even-odd."""
    b = ILLER[il]["bbox"]
    if b[0] > lon + 1 or b[2] < lon or b[1] > lat + 1 or b[3] < lat:
        return None
    m = np.zeros((PX, PX), dtype=bool)
    # piksel merkezleri: satır i → lat+1 - (i+0.5)/PX ; sütun j → lon + (j+0.5)/PX
    kolon_lon = lon + (np.arange(PX) + 0.5) / PX
    for i in range(PX):
        y = lat + 1 - (i + 0.5) / PX
        kesisimler = []
        for h in ILLER[il]["halkalar"]:
            x0, y0 = h[:-1, 0], h[:-1, 1]
            x1, y1 = h[1:, 0], h[1:, 1]
            gecen = (y0 > y) != (y1 > y)
            if gecen.any():
                t = (y - y0[gecen]) / (y1[gecen] - y0[gecen])
                kesisimler.append(x0[gecen] + t * (x1[gecen] - x0[gecen]))
        if not kesisimler:
            continue
        xs = np.sort(np.concatenate(kesisimler))
        icinde = np.searchsorted(xs, kolon_lon) % 2 == 1
        m[i] = icinde
    return m if m.any() else None

def pencere_min(z, k=11):
    """Ayrıştırılabilir kayan-pencere minimumu (k×k)."""
    p = k // 2
    zp = np.pad(z, p, mode="edge")
    from numpy.lib.stride_tricks import sliding_window_view
    m1 = sliding_window_view(zp, k, axis=0).min(axis=-1)   # dikey
    return sliding_window_view(m1, k, axis=1).min(axis=-1)  # yatay

def main():
    HAM.mkdir(parents=True, exist_ok=True)
    bir = {il: {"alan": 0.0, "egim2": 0.0, "vadi": 0.0} for il in ILLER}
    yok_karo = 0
    for n, (lat, lon) in enumerate(KAROLAR, 1):
        ilgili = [il for il in ILLER
                  if not (ILLER[il]["bbox"][0] > lon + 1 or ILLER[il]["bbox"][2] < lon
                          or ILLER[il]["bbox"][1] > lat + 1 or ILLER[il]["bbox"][3] < lat)]
        if not ilgili:
            continue
        yol = indir(lat, lon)
        if yol is None:
            yok_karo += 1
            continue
        z = tifffile.imread(yol).astype(np.float32)
        dy_m = ARC3_M
        dx_m = ARC3_M * math.cos(math.radians(lat + 0.5))
        gy, gx = np.gradient(z, dy_m, dx_m)
        egim = 100.0 * np.hypot(gx, gy)
        cukur = (z - pencere_min(z)) < 10.0
        dusuk = egim < 2.0
        vadi = dusuk & cukur
        px_km2 = (ARC3_M * dx_m) / 1e6   # piksel alanı (km²), karo enlemine göre
        for il in ilgili:
            m = maske(il, lat, lon)
            if m is None:
                continue
            bir[il]["alan"] += m.sum() * px_km2
            bir[il]["egim2"] += (dusuk & m).sum() * px_km2
            bir[il]["vadi"] += (vadi & m).sum() * px_km2
        print(f"{n}/{len(KAROLAR)} N{lat}E{lon}: il={len(ilgili)}", flush=True)
    iller = {}
    for il, v in sorted(bir.items()):
        if v["alan"] > 0:
            iller[il] = {
                "hesaplanan_alan_km2": round(v["alan"], 1),
                "dusuk_egim_orani_yuzde": round(100 * v["egim2"] / v["alan"], 1),
                "vadi_tabani_orani_yuzde": round(100 * v["vadi"] / v["alan"], 1),
            }
        else:
            iller[il] = {"durum": "hesaplanamadı (karo verisi yok)"}
    sonuc = {
        "uretim_tarihi": "2026-07-27",
        "etiket": ("Sayısal yükseklik modelinden türetilmiş morfolojik "
                   "göstergedir; akifer varlığının kanıtı değildir."),
        "kaynaklar": {
            "dem": "Copernicus GLO-90 (ESA/Airbus; AWS açık dağıtımı) — atıfla serbest",
            "il_sinirlari": "OpenStreetMap türevi (src/data/tr-iller.json) — ODbL",
        },
        "yontem": {
            "dusuk_egim": "eğim < %2 alan oranı (3-arcsec merkezî fark)",
            "vadi_tabani": ("eğim < %2 VE 1 km pencerede yerel çukurluk < 10 m "
                            "— akış birikimi değildir, yaklaşık göstergedir"),
            "twi": "hesaplanmadı (akış birikimi 2C/4GB sunucu bütçesini aşıyor)",
        },
        "karo_sayisi": len(KAROLAR), "bulunamayan_karo": yok_karo,
        "iller": iller,
    }
    CIKTI.write_text(json.dumps(sonuc, ensure_ascii=False, indent=1), encoding="utf-8")
    hesapli = sum(1 for v in iller.values() if "dusuk_egim_orani_yuzde" in v)
    print(f"il: {hesapli} hesaplı / {81 - hesapli} hesaplanamadı | 404 karo: {yok_karo}")
    print("yazıldı:", CIKTI)

if __name__ == "__main__":
    sys.exit(main())
