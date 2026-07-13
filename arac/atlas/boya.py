"""color-relief + hillshade harmanı, deniz düz boya, master PNG + web WebP."""
import subprocess

import numpy as np
from PIL import Image, ImageEnhance
from osgeo import gdal

gdal.UseExceptions()
Image.MAX_IMAGE_PIXELS = None

# Hipsometrik bantlar (HEDEF.png dili: koyu yeşil kıyılar, altın platolar,
# kızıl-kahve sıradağlar)
open("renk.txt", "w").write(
    "0 74 104 58\n"        # kıyı/ova koyu yeşil #4A683A
    "700 104 122 58\n"     # zeytin (geniş yeşil kuşak)
    "1000 156 142 64\n"    # zeytin-hardal geçiş
    "1200 210 170 76\n"    # altın plato (dar çekirdek)
    "1500 192 140 68\n"
    "1800 156 94 52\n"     # kızıl kahve
    "2400 130 74 46\n"
    "3200 106 62 40\n"
    "4400 92 54 34\n"
)

subprocess.run(["gdaldem", "color-relief", "dem.tif", "renk.txt", "renk.tif",
                "-co", "COMPRESS=LZW", "-q"], check=True)
subprocess.run(["gdaldem", "hillshade", "dem.tif", "golge.tif",
                "-z", "1.8", "-az", "300", "-alt", "38",
                "-compute_edges", "-co", "COMPRESS=LZW", "-q"], check=True)

renk = gdal.Open("renk.tif").ReadAsArray().astype(np.float32)  # (3,H,W)
golge = gdal.Open("golge.tif").ReadAsArray().astype(np.float32) / 255.0
elev = gdal.Open("dem.tif").ReadAsArray()

# Yumuşak harman: gölge rengin koyusu olur, sert siyah yok; aydınlık yamaç hafif açılır
# (v2 kalibrasyon: soluk/gri kalmasın — gölge tabanı yukarı, renkler doygun ve sıcak)
f = np.clip(0.70 + 0.46 * golge, 0.70, 1.14)
img = np.clip(renk * f[None, :, :], 0, 255).astype(np.uint8)
img = np.moveaxis(img, 0, -1)  # (H,W,3)

# Deniz: adaçayı yeşili düz boya
DENIZ = np.array([169, 195, 180], dtype=np.uint8)  # #A9C3B4
img[elev <= 0] = DENIZ

# Altın çekirdek (HEDEF): altın yalnız İç Anadolu'da parlar; merkezden
# uzaklaştıkça sıcak tonlar zeytine soğur (radyal ağırlık)
H, W = elev.shape
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
mx, my = W * 0.44, H * 0.44  # İç Anadolu merkezi (u~0.44, v~0.44)
r = np.sqrt(((xx - mx) / (W * 0.30)) ** 2 + ((yy - my) / (H * 0.42)) ** 2)
cekirdek = np.clip(1.0 - r, 0.0, 1.0) ** 1.2
ZEYTIN = np.array([112, 122, 62], dtype=np.float32)
sicaklik = np.clip((img[:, :, 0].astype(np.float32) - img[:, :, 2]) / 255, 0, 1)
kaydir = (1.0 - cekirdek[:, :, None]) * sicaklik[:, :, None] * 0.55
img = (img * (1 - kaydir) + ZEYTIN[None, None, :] * kaydir).astype(np.uint8)

# Orman noktasal dokusu: alçak yeşil kuşakta iri koyu benekler
# (web'e küçülünce kaybolmasın diye 2x2 blok bazında)
rng = np.random.default_rng(7)
blokH, blokW = elev.shape[0] // 2, elev.shape[1] // 2
benekBlok = rng.random((blokH, blokW)) < 0.07
benek = np.kron(benekBlok, np.ones((2, 2), dtype=bool))
benek &= (elev > 0) & (elev < 600)
img[benek] = (img[benek] * 0.58).astype(np.uint8)

master = Image.fromarray(img)
master = ImageEnhance.Color(master).enhance(1.18)      # doygunluk
master = ImageEnhance.Brightness(master).enhance(1.02)
master = ImageEnhance.Contrast(master).enhance(1.05)
master.save("tr-atlas-master.png", optimize=True)

web = master.resize((3840, master.height * 3840 // master.width), Image.LANCZOS)
web.save("/root/projeler/suharitasi/src/assets/tr-atlas.webp", "WEBP", quality=82, method=6)
print("master:", master.size, "| web: 3840px webp yazıldı")
