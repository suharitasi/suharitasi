#!/usr/bin/env python3
"""DSİ 26 bölge müdürlüğü sitesinden görev alanı sayfasını bulur ve
il adı geçen anahtar cümleleri çıkarır.

Sayfa tespiti: ana sayfadaki /Sayfa/Detay/N linkleri gezilir; <h1>'i
"Görev Alanı" olan sayfa alınır. Tam metin yerine "kapsar/görev
alanı/sorumluluk/il" geçen cümleler yazılır — nihai il->bölge eşlemesi
bu cümlelerden ELLE derlenir (tarihçe cümleleri il sayısını şişirir).
"""
import html
import json
import re
import subprocess
import sys

ILLER = ['Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin','Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Isparta','Mersin','İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla','Muş','Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat','Zonguldak','Aksaray','Bayburt','Karaman','Kırıkkale','Batman','Şırnak','Bartın','Ardahan','Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce']


def indir(url):
    r = subprocess.run(['curl', '-skLm', '25', '-A', 'Mozilla/5.0', url],
                       capture_output=True, text=True)
    return r.stdout


def metinlestir(h):
    h = re.sub(r'<(script|style).*?</\1>', ' ', h, flags=re.S | re.I)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h)))


def il_gecen(cumle):
    return [il for il in ILLER
            if re.search(r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])' + re.escape(il) + r'(?![a-zçğıöşü])', cumle)]


sonuc = {}
for no in range(1, 27):
    kok = f'https://bolge{no:02d}.dsi.gov.tr'
    ana = indir(kok)
    linkler = sorted(set(re.findall(r'href="(/Sayfa/Detay/\d+)"', ana)),
                     key=lambda x: int(x.rsplit('/', 1)[1]))
    hedef, metin = None, ''
    for l in linkler[:18]:
        h = indir(kok + l)
        h1 = ' '.join(re.findall(r'<h1[^>]*>(.*?)</h1>', h, re.S | re.I))
        if re.search(r'g[öÖ]rev\s*alan', html.unescape(h1), re.I):
            hedef, metin = kok + l, metinlestir(h)
            break
    cumleler = []
    for c in re.split(r'(?<=[.;])\s+', metin):
        if re.search(r'kapsa|görev alan|sorumluluk|il sınır|ilinde|illeri', c, re.I) and il_gecen(c):
            cumleler.append(c.strip()[:400])
    sonuc[f'{no:02d}'] = {'sayfa': hedef, 'cumleler': cumleler}
    print(f"== {no:02d} {hedef or 'SAYFA BULUNAMADI'}", file=sys.stderr)
    for c in cumleler[:6]:
        print('   ', c[:260], file=sys.stderr)

json.dump(sonuc, open('/tmp/claude-0/-root-projeler-suharitasi/5bbeeebc-ed92-4ed8-8b1f-2e75eb86cf58/scratchpad/dsi-bolge-ham.json', 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)
