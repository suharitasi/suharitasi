"""GRACE GEOMETRİ ÇEKİRDEĞİ — saf işlevler (B1.3, 2026-07-28).

NEDEN AYRI DOSYA: `grace-isle.py` baştan sona üst-seviye script'tir
(import edilince 507 MB NetCDF açar, GDAL ister). Havza ağırlıklarını
belirleyen iki işlev — halka çıkarımı ve nokta-poligon testi — bu yüzden
test edilemiyordu. Buraya AYNEN taşındılar; `grace-isle.py` artık
buradan import eder. Davranış değişmedi.

SAF: dosya yok, ağ yok, GDAL yok, numpy yok. `arac/altin-ornek.mjs`
bunları bilinen girdi → bilinen çıktı ile koşar.
"""


def halkalar(geom):
    """Polygon → tek dış halka; MultiPolygon → her parçanın dış halkası."""
    if geom['type'] == 'Polygon':
        return [geom['coordinates'][0]]
    return [p[0] for p in geom['coordinates']]  # MultiPolygon dış halkaları


def icinde(x, y, halka):
    """Işın atma (ray casting) — nokta halkanın içinde mi."""
    ic = False
    n = len(halka)
    for i in range(n):
        x1, y1 = halka[i][0], halka[i][1]
        x2, y2 = halka[(i + 1) % n][0], halka[(i + 1) % n][1]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            ic = not ic
    return ic
