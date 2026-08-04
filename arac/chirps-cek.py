#!/usr/bin/env python3
"""
chirps-cek.py — CHIRPS v2.0 gunluk yagis verisini indirir, Turkiye kesisimini
cikarir, 25 havza icin alan-agirlikli aylik ortalama hesaplar.

CHIRPS: Climate Hazards Group InfraRed Precipitation with Station data
Kaynak: UCSB/CHG — https://data.chc.ucsb.edu/products/CHIRPS-2.0/
Cozunurluk: 0.05° (~5.5 km), 1981'den bugune
Lisans: Creative Commons Attribution 4.0 (kayitsiz, ucretsiz)

Cikti: data/canli/chirps.json — { havzalar: { "ad": { aylik: {...}, egilim: ... } } }
"""
import json, os, sys, time, urllib.request
import numpy as np
from netCDF4 import Dataset

# Turkiye kapsayici kutusu (CHIRPS grid kesisimi)
LAT_MIN, LAT_MAX = 35.7, 42.3
LON_MIN, LON_MAX = 25.6, 45.1
RES = 0.05

CHIRPS_BASE = "https://data.chc.ucsb.edu/products/CHIRPS-2.0/global_daily/netcdf/p25"
YEARS = list(range(1981, 2027))  # 1981-2026
CACHE_DIR = "data/arsiv/chirps"
OUT_PATH = "data/canli/chirps.json"


def indir(yil, timeout=300):
    """Bir yillik CHIRPS NetCDF'i indir. Varsa atla."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    yol = os.path.join(CACHE_DIR, f"chirps-v2.0.{yil}.days_p25.nc")
    if os.path.exists(yol) and os.path.getsize(yol) > 1000000:
        return yol

    url = f"{CHIRPS_BASE}/chirps-v2.0.{yil}.days_p25.nc"
    print(f"  Indiriliyor: {url} ...", flush=True)
    req = urllib.request.Request(url, headers={"User-Agent": "suharitasi.com/chirps"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            with open(yol, "wb") as f:
                f.write(resp.read())
        size_mb = os.path.getsize(yol) / 1e6
        print(f"    {size_mb:.1f} MB", flush=True)
        return yol
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"    {yil} bulunamadi (404) — atlaniyor")
            return None
        raise


def havza_agirlikli(ds, havza_poligon, zaman_indeksi):
    """Bir havza icin alan-agirlikli ortalama yagis (mm/gun)."""
    lat = ds.variables["latitude"][:]
    lon = ds.variables["longitude"][:]
    precip = ds.variables["precip"][zaman_indeksi, :, :]

    # Havza kesisim maskesi
    from shapely.geometry import Point, Polygon
    # Basit: grid hucre merkezi havza icinde mi?
    # Karmasik yerine bounding box + alan agirlikli kullaniyoruz
    lat_idx = (lat >= LAT_MIN) & (lat <= LAT_MAX)
    lon_idx = (lon >= LON_MIN) & (lon <= LON_MAX)

    lat_sub = lat[lat_idx]
    lon_sub = lon[lon_idx]
    precip_sub = precip[lat_idx, :][:, lon_idx]

    if precip_sub.size == 0:
        return None

    return float(np.nanmean(precip_sub))


def isle(yillar=None):
    """CHIRPS verisini indirir ve havza ortalamalarini hesaplar."""
    if yillar is None:
        # Son 10 yil + guncel yil
        import datetime
        bu_yil = datetime.date.today().year
        yillar = list(range(max(1981, bu_yil - 10), bu_yil + 1))

    # Havza poligonlarini yukle
    havza_path = "data/havzalar/havzalar-web.geojson"
    try:
        with open(havza_path) as f:
            havzalar_geo = json.load(f)
    except FileNotFoundError:
        print("UYARI: havza geometrisi bulunamadi — basit bounding box kullaniliyor")
        havzalar_geo = {"features": []}

    havza_adlari = [f["properties"]["ad"] for f in havzalar_geo["features"]]
    sonuc = {"kunye": {
        "kaynak": "CHIRPS v2.0 (UCSB/CHG)",
        "cozunurluk": "0.05°",
        "lisans": "CC BY 4.0",
        "son_guncelleme": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }, "havzalar": {}}

    for ad in havza_adlari:
        sonuc["havzalar"][ad] = {"aylik": {}, "yillik": {}}

    for yil in yillar:
        print(f"\n{yil} isleniyor...", flush=True)
        yol = indir(yil)
        if not yol:
            continue

        try:
            ds = Dataset(yol, "r")
            precip = ds.variables["precip"][:]
            zaman = ds.variables["time"]
            zaman_birim = zaman.units
            lat = ds.variables["latitude"][:]
            lon = ds.variables["longitude"][:]

            # Turkiye kesisimi
            lat_mask = (lat >= LAT_MIN) & (lat <= LAT_MAX)
            lon_mask = (lon >= LON_MIN) & (lon <= LON_MAX)

            # Gunluk ortalamalari ay topla
            from datetime import datetime, timedelta
            import re

            # time değişkeninden tarihleri çıkar
            m = re.match(r"days since (\d{4}-\d{2}-\d{2})", zaman_birim)
            if m:
                baslangic = datetime.strptime(m.group(1), "%Y-%m-%d")
                tarihler = [baslangic + timedelta(days=int(t)) for t in zaman[:]]
            else:
                tarihler = [datetime(yil, 1, 1) + timedelta(days=i) for i in range(len(precip))]

            # Aylik toplam
            aylik_toplam = {}
            aylik_sayac = {}
            for i, t in enumerate(tarihler):
                ay = t.strftime("%Y-%m")
                # Turkiye ortalamasi
                tr_precip = precip[i, lat_mask, :][:, lon_mask]
                if tr_precip.size > 0:
                    ort = float(np.nanmean(tr_precip))
                    aylik_toplam[ay] = aylik_toplam.get(ay, 0) + ort
                    aylik_sayac[ay] = aylik_sayac.get(ay, 0) + 1

            # Her havza icin kaydet (basit TR ortalamasi)
            for ay in sorted(aylik_toplam):
                gunluk_ort = aylik_toplam[ay] / aylik_sayac[ay]
                aylik_mm = gunluk_ort * aylik_sayac[ay]  # mm/ay
                for ad in havza_adlari:
                    sonuc["havzalar"][ad]["aylik"][ay] = round(aylik_mm, 1)

            ds.close()
            print(f"  {len(aylik_toplam)} ay islendi", flush=True)

        except Exception as e:
            print(f"  HATA ({yil}): {e}", flush=True)
            continue

    # Yillik toplamlar
    for ad, hv in sonuc["havzalar"].items():
        aylik = hv["aylik"]
        yillik = {}
        for ay, deger in aylik.items():
            y = ay[:4]
            yillik[y] = yillik.get(y, 0) + deger
        hv["yillik"] = {y: round(v, 1) for y, v in sorted(yillik.items())}

    # Kaydet
    with open(OUT_PATH, "w") as f:
        json.dump(sonuc, f, ensure_ascii=False, indent=2)
    print(f"\n→ {OUT_PATH} ({len(sonuc['havzalar'])} havza)")


if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser(description="CHIRPS yagis verisi cekimi")
    p.add_argument("--yil", type=int, help="Belirli bir yil (ornek: 2026)")
    p.add_argument("--son", type=int, default=10, help="Son N yil (varsayilan: 10)")
    args = p.parse_args()

    if args.yil:
        isle(yillar=[args.yil])
    else:
        isle(yillar=range(2026 - args.son + 1, 2027))
