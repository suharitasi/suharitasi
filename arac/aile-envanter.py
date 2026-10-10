#!/usr/bin/env python3
# AİLE ENVANTERİ — brif DURAK 2 (önce/sonra sayfa sayıları + 30 örnek adres), 10.10.2026.
# dist/ üzerinden: aile (ilk yol parçası; mevzuat kanun bazında) başına sayfa, dizinlenebilir
# (robots noindex yok), site haritasındaki, yönlendirme (_redirects) sayısı. Örnek adreslerde
# durum, başlık, H1, robots, canonical ve görünür kelime sayısı.
# Kullanım: python3 arac/aile-envanter.py ETİKET   → rapor/olcum/aile-envanter-ETİKET.json
import glob, html, json, os, re, sys
from collections import defaultdict

ETIKET = sys.argv[1] if len(sys.argv) > 1 else 'olcum'
DIST = 'dist'
ORNEK = ['/', '/harita/', '/mevzuat/', '/mevzuat/5393/madde-39/', '/mevzuat/5393/madde-81/', '/mevzuat/2886/madde-77/',
         '/mevzuat/2886/madde-80/', '/mevzuat/167/madde-18/', '/mevzuat/167/madde-4/', '/kuyu-ruhsati/', '/kuyu-ruhsati/konya/',
         '/yeralti-suyu/konya/', '/yeralti-suyu/izmir/', '/goller/van-golu/', '/goller/hatap-baraj-golu/', '/nehirler/', '/sektor/',
         '/durumum/', '/islem-matrisi/', '/hangi-kurum/', '/ilimde-kim-yetkili/', '/kapatma-kaydi/', '/kuyu-kisit-sorgu/',
         '/nerede-su-cikar/', '/ilce-sorgu/', '/hesaplayicilar/', '/hesaplayicilar/mecra-irtifaki-simulasyonu/', '/sozluk/',
         '/en/', '/havzalar/konya-kapali/', '/durumum/gida-urunleri-imalati-nace-10/', '/durumum/maden-isletmecisi/']

def sayfa_yolu(f):
    y = '/' + os.path.relpath(f, DIST).replace(os.sep, '/')
    return y[:-len('index.html')] if y.endswith('index.html') else y

def aile(y):
    p = [x for x in y.split('/') if x]
    if not p: return '(ana sayfa)'
    if p[0] == 'mevzuat' and len(p) >= 3: return f'mevzuat/{p[1]}'
    return p[0] + ('/*' if len(p) > 1 else '')

def oku(f):
    return open(f, encoding='utf-8', errors='replace').read()

def ozellik(t):
    g = lambda r: (m.group(1).strip() if (m := re.search(r, t, re.I | re.S)) else '')
    robots = g(r'<meta[^>]+name="robots"[^>]+content="([^"]*)"')
    govde = re.sub(r'(?is)<(script|style|noscript|header|footer|nav)[^>]*>.*?</\1>', ' ', t)
    govde = html.unescape(re.sub(r'<[^>]+>', ' ', govde))
    return {
        'title': html.unescape(g(r'<title>(.*?)</title>')),
        'h1': html.unescape(re.sub(r'<[^>]+>', '', g(r'<h1[^>]*>(.*?)</h1>'))).strip(),
        'robots': robots,
        'canonical': g(r'<link[^>]+rel="canonical"[^>]+href="([^"]*)"'),
        'kelime': len(re.findall(r'\w+', govde)),
    }

harita = set(re.findall(r'<loc>https?://[^/]+(/[^<]*)</loc>', oku(f'{DIST}/sitemap.xml')))
yon = {}
for satir in oku(f'{DIST}/_redirects').splitlines():
    s = satir.split()
    if len(s) >= 2 and not satir.lstrip().startswith('#'): yon[s[0]] = (s[1], s[2] if len(s) > 2 else '302')

aileler = defaultdict(lambda: {'sayfa': 0, 'dizinlenebilir': 0, 'site_haritasi': 0, 'yonlendirme': 0})
sayfalar = {}
for f in glob.glob(f'{DIST}/**/index.html', recursive=True):
    y = sayfa_yolu(f); t = oku(f)
    rb = (re.search(r'<meta[^>]+name="robots"[^>]+content="([^"]*)"', t, re.I) or [None, ''])[1]
    a = aileler[aile(y)]
    a['sayfa'] += 1
    if 'noindex' not in rb.lower(): a['dizinlenebilir'] += 1
    if y in harita: a['site_haritasi'] += 1
    sayfalar[y] = 'noindex' not in rb.lower()
for kaynak in yon: aileler[aile(kaynak)]['yonlendirme'] += 1

ornek = {}
for y in ORNEK:
    f = f'{DIST}{y}index.html' if y.endswith('/') else f'{DIST}{y}'
    if y in yon: ornek[y] = {'durum': int(yon[y][1]) if yon[y][1].isdigit() else yon[y][1], 'hedef': yon[y][0]}
    elif os.path.exists(f): ornek[y] = {'durum': 200, **ozellik(oku(f))}
    else: ornek[y] = {'durum': 404}

cikti = {'etiket': ETIKET, 'toplam_sayfa': sum(a['sayfa'] for a in aileler.values()),
         'dizinlenebilir': sum(a['dizinlenebilir'] for a in aileler.values()), 'site_haritasi': len(harita),
         'yonlendirme': len(yon), 'aileler': dict(sorted(aileler.items())), 'ornek': ornek}
os.makedirs('rapor/olcum', exist_ok=True)
json.dump(cikti, open(f'rapor/olcum/aile-envanter-{ETIKET}.json', 'w'), ensure_ascii=False, indent=1)
print(f"{ETIKET}: {cikti['toplam_sayfa']} sayfa · {cikti['dizinlenebilir']} dizinlenebilir · site haritası {cikti['site_haritasi']} · yönlendirme {cikti['yonlendirme']}")
for k, v in sorted(aileler.items(), key=lambda x: -x[1]['sayfa'])[:30]:
    print(f"  {k:32s} {v['sayfa']:5d} {v['dizinlenebilir']:5d} {v['site_haritasi']:5d} {v['yonlendirme']:3d}")
