"""color-relief + hillshade harmanı, deniz düz boya, master PNG + web WebP."""
import subprocess

import numpy as np
from PIL import Image
from osgeo import gdal

gdal.UseExceptions()
Image.MAX_IMAGE_PIXELS = None

# Hipsometrik bantlar (vintage atlas)
open("renk.txt", "w").write(
    "0 124 155 110\n"      # alçak ova #7C9B6E
    "500 148 163 112\n"
    "900 199 178 123\n"    # hardal #C7B27B
    "1500 178 149 95\n"
    "2100 138 107 71\n"    # toprak kahvesi #8A6B47
    "3000 110 82 56\n"     # zirve #6E5238
    "4400 94 69 46\n"
)

subprocess.run(["gdaldem", "color-relief", "dem.tif", "renk.txt", "renk.tif",
                "-co", "COMPRESS=LZW", "-q"], check=True)
subprocess.run(["gdaldem", "hillshade", "dem.tif", "golge.tif",
                "-z", "1.4", "-az", "315", "-alt", "45",
                "-compute_edges", "-co", "COMPRESS=LZW", "-q"], check=True)

renk = gdal.Open("renk.tif").ReadAsArray().astype(np.float32)  # (3,H,W)
golge = gdal.Open("golge.tif").ReadAsArray().astype(np.float32) / 255.0
elev = gdal.Open("dem.tif").ReadAsArray()

# Yumuşak harman: gölge rengin koyusu olur, sert siyah yok; aydınlık yamaç hafif açılır
f = np.clip(0.55 + 0.55 * golge, 0.55, 1.12)
img = np.clip(renk * f[None, :, :], 0, 255).astype(np.uint8)
img = np.moveaxis(img, 0, -1)  # (H,W,3)

# Deniz: adaçayı yeşili düz boya
DENIZ = np.array([169, 195, 180], dtype=np.uint8)  # #A9C3B4
img[elev <= 0] = DENIZ

master = Image.fromarray(img)
master.save("tr-atlas-master.png", optimize=True)

web = master.resize((3840, master.height * 3840 // master.width), Image.LANCZOS)
web.save("/root/projeler/suharitasi/src/assets/tr-atlas.webp", "WEBP", quality=82, method=6)
print("master:", master.size, "| web: 3840px webp yazıldı")
