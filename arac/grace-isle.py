#!/usr/bin/env python3
"""HENDEK FAZ 1-B — GRACE mascon işleme: Türkiye kırpma + havza serileri.

Girdi : data/arsiv/grace/ham/gsfc...halfdegree.nc (GSFC, açık kaynak, ham)
Çıktı : data/canli/grace-turkiye.json  (ülke geneli aylık anomali serisi)
        data/canli/grace-havza.json    (25 havza alan-ağırlıklı seri)

DÜRÜSTLÜK KURALLARI (mutlak):
- Veri TOPLAM su depolaması (TWS) ANOMALİSİDİR (yeraltı suyu + toprak nemi +
  kar + yüzey suyu; cm sıvı su eşdeğeri, 2004-2009 ortalamasına göre) —
  mutlak rezerv DEĞİLDİR; site dili buna göre yazılır.
- GRACE→GRACE-FO boşluğu (2017-2018) ve eksik aylar OLDUĞU GİBİ bırakılır;
  interpolasyon/tahminle doldurulmaz. Seride yalnız gerçek aylar vardır.
- Mascon gerçek çözünürlüğü ~3°; 0,5° grid yazımıdır. Havza ortalaması
  YAKLAŞIKTIR; her çıktı bu şerhi künyesinde taşır.

Bağımlılık: python3-gdal (sistemde mevcut) + numpy. pip kurulumu YOK.
"""
import json, sys, math
from datetime import date, timedelta
import numpy as np
from osgeo import gdal

gdal.UseExceptions()

KOK = '/home/suha/projeler/suharitasi'
HAM = f'{KOK}/data/arsiv/grace/ham/gsfc.glb_.200204_202603_rl06v2.0_obp-ice6gd_halfdegree.nc'
HAVZA_GEO = f'{KOK}/data/havzalar/havzalar-web.geojson'

# Türkiye sınır kutusu (brief): 36-42K, 26-45D — pay bırakılmış hali
LAT0, LAT1, LON0, LON1 = 35.5, 42.5, 25.5, 45.5

# ── NetCDF oku ──────────────────────────────────────────────────────────
ds = gdal.Open(f'NETCDF:"{HAM}":lwe_thickness')
md = ds.GetMetadata()
zaman_gunleri = [float(x) for x in
                 md['NETCDF_DIM_time_VALUES'].strip('{}').split(',')]
BASLANGIC = date(2002, 1, 1)  # time#units = days since 2002-01-01
aylar = [(BASLANGIC + timedelta(days=g)).strftime('%Y-%m') for g in zaman_gunleri]
assert len(aylar) == ds.RasterCount, 'zaman ekseni ile bant sayısı uyumsuz'

# Grid: lat 90→-90 (0,5°), lon 0→360 (0,5°)
r0 = int((90.0 - LAT1) / 0.5)          # üst satır
r1 = int((90.0 - LAT0) / 0.5)          # alt satır (hariç)
c0 = int(LON0 / 0.5)
c1 = int(math.ceil(LON1 / 0.5))
enlemler = np.array([90.0 - 0.5 * (r + 0.5) for r in range(r0, r1)])
boylamlar = np.array([0.5 * (c + 0.5) for c in range(c0, c1)])

maske_ds = gdal.Open(f'NETCDF:"{HAM}":land_mask')
kara = maske_ds.GetRasterBand(1).ReadAsArray()[r0:r1, c0:c1] > 0.5

kup = np.empty((len(aylar), r1 - r0, c1 - c0))
for i in range(ds.RasterCount):
    kup[i] = ds.GetRasterBand(i + 1).ReadAsArray()[r0:r1, c0:c1]

# ── Havza poligonları + ışın testi (saf python; ek bağımlılık yok) ──────
geo = json.load(open(HAVZA_GEO))

def halkalar(geom):
    if geom['type'] == 'Polygon':
        return [geom['coordinates'][0]]
    return [p[0] for p in geom['coordinates']]  # MultiPolygon dış halkaları

def icinde(x, y, halka):
    ic = False
    n = len(halka)
    for i in range(n):
        x1, y1 = halka[i][0], halka[i][1]
        x2, y2 = halka[(i + 1) % n][0], halka[(i + 1) % n][1]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            ic = not ic
    return ic

def havza_agirliklari(geom):
    """Hücre ağırlığı: hücre içinde 4x4 alt-örnekle poligon kesri × cos(enlem).
    Kaba grid + temsilî sınırlar → sonuç YAKLAŞIK (künyeye yazılır)."""
    hs = halkalar(geom)
    w = np.zeros((len(enlemler), len(boylamlar)))
    for ri, lat in enumerate(enlemler):
        for ci, lon in enumerate(boylamlar):
            if not kara[ri, ci]:
                continue
            say = 0
            for dy in (-0.1875, -0.0625, 0.0625, 0.1875):
                for dx in (-0.1875, -0.0625, 0.0625, 0.1875):
                    px, py = lon + dx * 1.0, lat + dy * 1.0
                    if any(icinde(px, py, h) for h in hs):
                        say += 1
            if say:
                w[ri, ci] = (say / 16.0) * math.cos(math.radians(lat))
    return w

def seri_cikar(w):
    tw = w.sum()
    if tw == 0:
        return None, 0
    seri = {}
    for i, ay in enumerate(aylar):
        kat = kup[i]
        gecerli = ~np.isnan(kat) & (w > 0)
        if not gecerli.any():
            continue  # o ay hiç hücre yoksa yazılMAZ ("veri yok" = yokluk)
        seri[ay] = round(float((kat[gecerli] * w[gecerli]).sum() / w[gecerli].sum()), 2)
    return seri, int((w > 0).sum())

KUNYE_ORTAK = {
    'kaynak': 'NASA GSFC GRACE/GRACE-FO mascon RL06 v2.0 (yarım-derece grid; açık erişim, earth.gsfc.nasa.gov)',
    'degisken': 'Toplam su depolaması (TWS) anomalisi — cm sıvı su eşdeğeri, 2004-2009 ortalamasına göre',
    'onemliSerh': [
        'DEĞİŞİM verisidir: yeraltı suyu + toprak nemi + kar + yüzey suyunun TOPLAM değişimini gösterir; mutlak su miktarı DEĞİLDİR.',
        'Mascon gerçek çözünürlüğü ~3° (~300 km); havza ortalamaları YAKLAŞIKTIR, il/ilçe ölçeğinde kullanılamaz.',
        'GRACE ile GRACE-FO arasındaki 2017-2018 boşluğu ve eksik aylar gerçek haliyle bırakılmıştır; doldurma/tahmin yapılmamıştır.',
        'Havza sınırları temsilîdir (KAYNAKLAR.md).',
    ],
}

# ── Ülke geneli ─────────────────────────────────────────────────────────
w_tr = np.where(kara, np.cos(np.radians(enlemler))[:, None], 0.0)
tr_seri, tr_hucre = seri_cikar(w_tr)
json.dump({
    'kunye': {**KUNYE_ORTAK,
              'kapsam': f'Türkiye kara hücreleri, kutu {LAT0}-{LAT1}K {LON0}-{LON1}D ({tr_hucre} hücre)',
              'islemeTarihi': date.today().isoformat(),
              'aySayisi': len(tr_seri)},
    'seri': tr_seri,
}, open(f'{KOK}/data/canli/grace-turkiye.json', 'w'), ensure_ascii=False, indent=1)

# ── Havzalar ────────────────────────────────────────────────────────────
havzalar = {}
atlanan = []
for f in geo['features']:
    ad = f['properties'].get('ad') or f['properties'].get('name') or f['properties'].get('AD')
    no = f['properties'].get('no') or f['properties'].get('NO')
    w = havza_agirliklari(f['geometry'])
    seri, hucre = seri_cikar(w)
    if not seri:
        atlanan.append(ad)
        continue
    havzalar[ad] = {'no': no, 'hucreSayisi': hucre, 'seri': seri}
    print(f'  {ad}: {hucre} hücre, {len(seri)} ay', file=sys.stderr)

json.dump({
    'kunye': {**KUNYE_ORTAK,
              'islemeTarihi': date.today().isoformat(),
              'havzaSayisi': len(havzalar),
              'atlanan': atlanan},
    'havzalar': havzalar,
}, open(f'{KOK}/data/canli/grace-havza.json', 'w'), ensure_ascii=False, indent=1)

print(f'TAMAM: {len(havzalar)} havza + ülke serisi ({len(tr_seri)} ay) yazıldı', file=sys.stderr)
if atlanan:
    print(f'ATLANAN (hücre çıkmadı): {atlanan}', file=sys.stderr)
