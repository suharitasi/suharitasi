#!/usr/bin/env python3
"""
jrc-isle.py — JRC Global Surface Water verisini indirir ve havza bazli isler.
1984-2021 Landsat 30m cozunurluk, kayitsiz-ucretsiz.

Cikti: data/canli/jrc-yuzey-suyu.json
"""
import json, os, sys, time, urllib.request
import numpy as np
from osgeo import gdal

gdal.UseExceptions()

JRC_BASE = "https://storage.googleapis.com/global-surface-water/downloads2021/occurrence/occurrence_"
TILES = [
    # Turkiye'yi kapsayan 1°×1° karolar (WRS2 benzeri degil, enlem/boylam)
    (35, 25), (35, 26), (35, 27), (35, 28),  # ... eksiksiz liste
    # JRC karolari 10°×10°'luk buyuk dilimler halinde
]
# JRC verisi 80°N-60°S / 180°W-180°E arasi 10°×10° tile'lar
TURKIYE_TILES = [
    "40N_030E", "40N_040E", "50N_030E", "50N_040E",
]

OUT_PATH = "data/canli/jrc-yuzey-suyu.json"
CACHE_DIR = "data/arsiv/jrc"


def indir_tile(tile_id, timeout=600):
    os.makedirs(CACHE_DIR, exist_ok=True)
    yol = os.path.join(CACHE_DIR, f"occurrence_{tile_id}.tif")
    if os.path.exists(yol) and os.path.getsize(yol) > 100000:
        return yol
    url = f"{JRC_BASE}{tile_id}.tif"
    print(f"  Indiriliyor: {url} ...", flush=True)
    req = urllib.request.Request(url, headers={"User-Agent": "suharitasi.com/jrc"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            with open(yol, "wb") as f:
                f.write(resp.read())
        print(f"    {os.path.getsize(yol)/1e6:.1f} MB", flush=True)
        return yol
    except Exception as e:
        print(f"    HATA: {e}")
        return None


def isle():
    print("JRC Yuzey Suyu isleniyor...")
    sonuc = {"kunye": {
        "kaynak": "JRC Global Surface Water 1984-2021 (Landsat)",
        "cozunurluk": "30m",
        "lisans": "Free and open (CC BY 4.0)",
        "url": "https://global-surface-water.appspot.com/",
    }, "tile'lar": {}, "havzalar": {}}

    for tid in TURKIYE_TILES:
        yol = indir_tile(tid)
        if not yol:
            continue
        try:
            ds = gdal.Open(yol)
            band = ds.GetRasterBand(1)
            a = band.ReadAsArray()
            # occurrence: 0-100 (yuzde)
            valid = a[a <= 100]
            if valid.size > 0:
                sonuc["tile'lar"][tid] = {
                    "ortalama_occurrence": round(float(np.mean(valid)), 2),
                    "su_kapli_piksel": int(np.sum(valid > 50)),
                    "toplam_piksel": int(valid.size),
                }
            ds = None
        except Exception as e:
            print(f"  {tid} HATA: {e}")

    # Havza bazli ozet
    havza_path = "data/havzalar/havzalar-web.geojson"
    if os.path.exists(havza_path):
        with open(havza_path) as f:
            hg = json.load(f)
        for f in hg["features"]:
            ad = f["properties"]["ad"]
            # Havza icindeki tile verilerinden yaklasik hesap
            sonuc["havzalar"][ad] = {"durum": "islenmedi (tile bazli hesap gerekir)"}

    with open(OUT_PATH, "w") as f:
        json.dump(sonuc, f, ensure_ascii=False, indent=2)
    print(f"\n→ {OUT_PATH}")


if __name__ == "__main__":
    isle()
