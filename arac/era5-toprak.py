#!/usr/bin/env python3
"""
era5-toprak.py — ERA5-Land toprak nemi verisini CDS API uzerinden ceker.
ECMWF Copernicus CDS (Climate Data Store) hesabi gerektirir.
Ucretsiz (non-commercial), CDS API anahtari ile.

Kurulum: pip install cdsapi
CDS API anahtari: ~/.cdsapirc dosyasina yazilir.

Cikti: data/canli/era5-toprak.json
"""
import json, os, sys
import numpy as np
from datetime import datetime

try:
    import cdsapi
except ImportError:
    print("HATA: cdsapi yuklu degil. pip install cdsapi")
    print("CDS API anahtari: https://cds.climate.copernicus.eu/api-how-to")
    sys.exit(1)

# ERA5-Land: saatlik, 0.1° (~9 km), 4 toprak katmani (0-7, 7-28, 28-100, 100-289 cm)
# Turkiye icin bounding box
BBOX = [35.7, 25.6, 42.3, 45.1]  # N, W, S, E (CDS format)

OUT_PATH = "data/canli/era5-toprak.json"


def cek(yil, ay, cikti_netcdf=None):
    """Bir ay icin ERA5-Land toprak nemi indir."""
    import tempfile
    if cikti_netcdf is None:
        cikti_netcdf = os.path.join(tempfile.gettempdir(), f"era5-land-{yil}{ay:02d}.nc")

    client = cdsapi.Client()
    client.retrieve(
        'reanalysis-era5-land-monthly-means',
        {
            'variable': 'volumetric_soil_water_layer',
            'year': str(yil),
            'month': f'{ay:02d}',
            'time': '00:00',
            'area': BBOX,  # N, W, S, E
            'format': 'netcdf',
        },
        cikti_netcdf
    )
    return cikti_netcdf


def isle(yil, ay):
    """Tek aylik veriyi isle ve havza ortalamalarini dondur."""
    from netCDF4 import Dataset
    yol = cek(yil, ay)
    ds = Dataset(yol, "r")

    # swvl1-4: 4 toprak katmani
    sonuc = {}
    for katman in range(1, 5):
        var_ad = f"swvl{katman}"
        if var_ad in ds.variables:
            veri = ds.variables[var_ad][:]
            # NaN'leri temizle, ortalama al
            valid = veri[~np.isnan(veri)]
            if valid.size > 0:
                sonuc[var_ad] = round(float(np.mean(valid)), 4)
                sonuc[f"{var_ad}_aciklama"] = {
                    1: "0-7 cm yuzey",
                    2: "7-28 cm sig",
                    3: "28-100 cm orta",
                    4: "100-289 cm derin",
                }.get(katman, "")

    ds.close()
    os.remove(yol)  # Gecici dosyayi temizle
    return sonuc


def aylik_seri_uret(yillar=None):
    """Belirtilen yillar icin aylik toprak nemi serisi olustur."""
    if yillar is None:
        bu_yil = datetime.now().year
        yillar = range(max(1950, bu_yil - 5), bu_yil + 1)

    sonuc = {"kunye": {
        "kaynak": "ERA5-Land (ECMWF/Copernicus)",
        "cozunurluk": "0.1° (~9 km)",
        "lisans": "Copernicus License (ucretsiz, kayitli)",
        "degisken": "Volumetric soil water layer (m³/m³)",
        "son_guncelleme": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
    }, "aylik": {}}

    for yil in yillar:
        for ay in range(1, 13):
            if yil == datetime.now().year and ay > datetime.now().month:
                continue
            anahtar = f"{yil}-{ay:02d}"
            print(f"  {anahtar} isleniyor...", flush=True)
            try:
                sonuc["aylik"][anahtar] = isle(yil, ay)
            except Exception as e:
                print(f"    HATA: {e}")
                continue

    with open(OUT_PATH, "w") as f:
        json.dump(sonuc, f, ensure_ascii=False, indent=2)
    print(f"\n→ {OUT_PATH} ({len(sonuc['aylik'])} ay)")


if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser(description="ERA5-Land toprak nemi cekimi")
    p.add_argument("--yil", type=int, help="Tek yil")
    p.add_argument("--ay", type=int, help="Tek ay (--yil ile)")
    p.add_argument("--son", type=int, default=5, help="Son N yil (varsayilan: 5)")
    args = p.parse_args()

    if args.yil and args.ay:
        sonuc = isle(args.yil, args.ay)
        print(json.dumps(sonuc, indent=2))
    else:
        aylik_seri_uret(range(datetime.now().year - args.son + 1, datetime.now().year + 1))
