"""Türkiye dış sınırı: 81 il poligonunun birleşimi.

Çıktılar:
- src/data/tr-sinir.json : sadeleştirilmiş dış halkalar (ada dahil), lon/lat
- src/assets/tr-maske.png : 2048x1024 kesim maskesi (iç=beyaz, dış=siyah),
  heightmap/atlas ile aynı mercator kapsamda (kapsam: indir.py z9 kenarları)
"""
import json
import math

from PIL import Image, ImageDraw
from shapely.geometry import Polygon, shape
from shapely.ops import unary_union

KAPSAM = dict(bati=24.609375, dogu=45.703125,
              guney=34.885930940753155, kuzey=43.06888777416962)

iller = json.load(open("/home/suha/projeler/suharitasi/src/data/tr-iller.json"))
birlik = unary_union([shape(f["geometry"]).buffer(0) for f in iller["features"]])
birlik = birlik.simplify(0.015, preserve_topology=True)

geoms = list(birlik.geoms) if birlik.geom_type == "MultiPolygon" else [birlik]
# Kıymıksı artıkları at: çok küçük parçalar (adalar kalsın diye eşik düşük)
geoms = [g for g in geoms if g.area > 0.003]
# İl sınırlarının tam örtüşmemesinden doğan sliver iç halkaları DOLDUR
# (Türkiye'nin gerçek deliği yok) — aksi halde maskede iğne deliği açılıyor
geoms = [Polygon(g.exterior) for g in geoms]
print("parça sayısı:", len(geoms), "| toplam nokta:",
      sum(len(g.exterior.coords) for g in geoms))

halkalar = [[[round(x, 4), round(y, 4)] for x, y in g.exterior.coords] for g in geoms]
json.dump({"halkalar": halkalar},
          open("/home/suha/projeler/suharitasi/src/data/tr-sinir.json", "w"),
          separators=(",", ":"))

# Maske: mercator uv (heightmap ile birebir aynı projeksiyon)
GEN, YUK = 2048, 1024
def mercY(lat):
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))
yK, yG = mercY(KAPSAM["kuzey"]), mercY(KAPSAM["guney"])

def uv(lon, lat):
    u = (lon - KAPSAM["bati"]) / (KAPSAM["dogu"] - KAPSAM["bati"])
    v = (yK - mercY(lat)) / (yK - yG)
    return (u * GEN, v * YUK)

im = Image.new("L", (GEN, YUK), 0)
ciz = ImageDraw.Draw(im)
for g in geoms:
    ciz.polygon([uv(x, y) for x, y in g.exterior.coords], fill=255)
im.save("/home/suha/projeler/suharitasi/src/assets/tr-maske.png")
print("tr-sinir.json + tr-maske.png yazıldı")
