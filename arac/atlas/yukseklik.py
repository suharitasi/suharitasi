"""dem.tif'ten Three.js için heightmap üretir.

Çıktılar:
- src/assets/tr-yukseklik-2048.png : 2048x1024, 16-bit gri PNG (arşiv/işleme)
- src/assets/tr-yukseklik.bin      : 1024x512 Uint16 little-endian (runtime;
  tarayıcı canvas'ı PNG'yi 8-bit'e indirdiği için ham veri ayrıca veriliyor)

dem.tif, indir.py'nin yazdığı EPSG:3857 mozaiktir (7680x3840).
Çalıştırma: dem.tif'in bulunduğu dizinde `python3 yukseklik.py`.
"""
import json

import numpy as np
from PIL import Image
from osgeo import gdal

gdal.UseExceptions()
Image.MAX_IMAGE_PIXELS = None

elev = gdal.Open("dem.tif").ReadAsArray()
elev = np.maximum(elev, 0)  # deniz ve çukurlar 0'a sabitlenir
maks = float(elev.max())
print(f"kaynak: {elev.shape[1]}x{elev.shape[0]}, maks yükselti {maks:.0f} m")

f = Image.fromarray(elev, mode="F")  # float modunda LANCZOS küçültme

def olcekle(gen, yuk):
    kucuk = np.asarray(f.resize((gen, yuk), Image.LANCZOS), dtype=np.float32)
    return np.clip(kucuk / maks * 65535, 0, 65535).astype(np.uint16)

png16 = olcekle(2048, 1024)
Image.fromarray(png16).save("/root/projeler/suharitasi/src/assets/tr-yukseklik-2048.png")

binv = olcekle(1024, 512)
binv.tofile("/root/projeler/suharitasi/src/assets/tr-yukseklik.bin")

json.dump({"maksYukseltiM": maks, "binGen": 1024, "binYuk": 512},
          open("/root/projeler/suharitasi/src/assets/tr-yukseklik.json", "w"))
print("yazıldı: tr-yukseklik-2048.png, tr-yukseklik.bin, tr-yukseklik.json")
