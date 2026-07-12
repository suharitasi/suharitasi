"""Terrarium tile'larını z9'da indir, mozaikle, EPSG:3857 GeoTIFF DEM yaz."""
import math
import os
import io
import json
from concurrent.futures import ThreadPoolExecutor
from urllib.request import urlopen

import numpy as np
from PIL import Image
from osgeo import gdal, osr

Z = 9
N = 2 ** Z
# Kapsam: 25E-45.5E, 35.5N-42.5N — tile sınırlarına genişler
W_LON, E_LON, S_LAT, N_LAT = 25.0, 45.5, 35.5, 42.5

def lon2x(lon): return int((lon + 180) / 360 * N)
def lat2y(lat):
    r = math.radians(lat)
    return int((1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * N)

X0, X1 = lon2x(W_LON), lon2x(E_LON)
Y0, Y1 = lat2y(N_LAT), lat2y(S_LAT)  # y kuzeyden büyür
GEN, YUK = (X1 - X0 + 1) * 256, (Y1 - Y0 + 1) * 256
print(f"z{Z}: x {X0}-{X1}, y {Y0}-{Y1} -> {GEN}x{YUK}px, {(X1-X0+1)*(Y1-Y0+1)} tile")

elev = np.zeros((YUK, GEN), dtype=np.float32)

def tile_al(xy):
    x, y = xy
    url = f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{x}/{y}.png"
    for deneme in range(3):
        try:
            veri = urlopen(url, timeout=30).read()
            im = np.asarray(Image.open(io.BytesIO(veri)).convert("RGB"), dtype=np.float32)
            e = im[:, :, 0] * 256 + im[:, :, 1] + im[:, :, 2] / 256 - 32768
            elev[(y - Y0) * 256:(y - Y0 + 1) * 256, (x - X0) * 256:(x - X0 + 1) * 256] = e
            return True
        except Exception as ex:
            if deneme == 2:
                print("HATA", x, y, ex)
                return False

isler = [(x, y) for x in range(X0, X1 + 1) for y in range(Y0, Y1 + 1)]
with ThreadPoolExecutor(max_workers=16) as ex:
    sonuc = list(ex.map(tile_al, isler))
print("indirilen:", sum(sonuc), "/", len(isler))
assert all(sonuc), "eksik tile var"

# Mercator geotransform
R = 6378137.0
def merc_x(lon): return math.radians(lon) * R
def merc_y(lat): return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) * R

tile_lon = lambda x: x / N * 360 - 180
tile_lat = lambda y: math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / N))))

BATI, DOGU = tile_lon(X0), tile_lon(X1 + 1)
KUZEY, GUNEY = tile_lat(Y0), tile_lat(Y1 + 1)
print("coğrafi kapsam:", BATI, DOGU, GUNEY, KUZEY)

x0m, y0m = merc_x(BATI), merc_y(KUZEY)
piksel = (merc_x(DOGU) - x0m) / GEN

drv = gdal.GetDriverByName("GTiff")
ds = drv.Create("dem.tif", GEN, YUK, 1, gdal.GDT_Float32, ["COMPRESS=LZW"])
ds.SetGeoTransform([x0m, piksel, 0, y0m, 0, -piksel])
srs = osr.SpatialReference(); srs.ImportFromEPSG(3857)
ds.SetProjection(srs.ExportToWkt())
ds.GetRasterBand(1).WriteArray(elev)
ds = None
json.dump({"bati": BATI, "dogu": DOGU, "guney": GUNEY, "kuzey": KUZEY,
           "gen": GEN, "yuk": YUK}, open("kapsam.json", "w"))
print("dem.tif yazıldı")
