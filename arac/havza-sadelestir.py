#!/usr/bin/env python3
"""25 havza sınırını web için sadeleştirir.

Girdi:  data/havzalar/havzalar-ham.geojson (ArcGIS'ten indirilen ham veri)
Çıktı:  data/havzalar/havzalar-web.geojson (<1MB, havza başına tek feature)

Aynı havza numaralı parçalar (Marmara 3 parça) MultiPolygon'da birleşir;
ad düzeltmeleri uygulanır (Meriç-Erhene -> Meriç-Ergene vb.).
"""
import json
from collections import defaultdict

from shapely.geometry import shape, mapping
from shapely.ops import unary_union

HAM = 'data/havzalar/havzalar-ham.geojson'
CIKTI = 'data/havzalar/havzalar-web.geojson'
TOLERANS = 0.01  # derece; ~1 km — hover/harita ölçeği için yeterli

AD_DUZELT = {
    'Meriç-Erhene Havzası': 'Meriç-Ergene Havzası',
    'Fırat Dicle havzası': 'Fırat-Dicle Havzası',
}

# Kaynak veri eski numaralandırmayla Fırat-Dicle'ye 26 vermiş;
# DSİ 2024 resmi istatistik tablolarında Fırat-Dicle 21'dir.
NO_DUZELT = {'26': '21'}

d = json.load(open(HAM, encoding='utf-8'))
gruplar = defaultdict(list)
adlar = {}
for f in d['features']:
    no = NO_DUZELT.get(f['properties']['Havza_No'], f['properties']['Havza_No'])
    ad = f['properties']['Havza_Ad'].strip()
    adlar[no] = AD_DUZELT.get(ad, ad)
    gruplar[no].append(shape(f['geometry']))

ozellikler = []
for no in sorted(gruplar):
    geom = unary_union(gruplar[no])
    sade = geom.simplify(TOLERANS, preserve_topology=True)
    # koordinatları 4 haneye yuvarla (~11 m) — dosya boyutunu düşürür
    g = mapping(sade)

    def yuvarla(k):
        if isinstance(k, (list, tuple)):
            if k and isinstance(k[0], float):
                return [round(x, 4) for x in k]
            return [yuvarla(x) for x in k]
        return k

    g['coordinates'] = yuvarla(g['coordinates'])
    ozellikler.append({
        'type': 'Feature',
        'properties': {'no': no, 'ad': adlar[no]},
        'geometry': g,
    })

sonuc = {'type': 'FeatureCollection', 'features': ozellikler}
metin = json.dumps(sonuc, ensure_ascii=False, separators=(',', ':'))
open(CIKTI, 'w', encoding='utf-8').write(metin)
print(f'havza sayısı: {len(ozellikler)}')
print(f'boyut: {len(metin.encode("utf-8"))/1e6:.2f} MB')
for o in ozellikler:
    print(o['properties']['no'], o['properties']['ad'])
