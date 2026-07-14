#!/usr/bin/env python3
"""SYGM havza tanıtım PDF'lerinden havza-il listelerini çıkarır.

İki kaynak dizin denenir: "Havzalarımızı Tanıyalım/" ve
"havza tanıtım 23.03.2023/türkçe/"; dosya adları "X Havzası Tanıtım.pdf",
"X Broşür.pdf" vb. varyantlarla aranır. İl çıkarımı Türkçe harf
dönüşümüyle (İ->i, I->ı) küçük harf üzerinden, "iller ... yer almaktadır"
cümlesi ya da il tablosu bölümünden yapılır.
Çıktı: scratchpad/havza-il-ham.json
"""
import json
import re
import subprocess
import sys
from urllib.parse import quote

ILLER = ['Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin','Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Isparta','Mersin','İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla','Muş','Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat','Zonguldak','Aksaray','Bayburt','Karaman','Kırıkkale','Batman','Şırnak','Bartın','Ardahan','Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce']

DIZINLER = [
    'https://www.tarimorman.gov.tr/SYGM/Belgeler/Havzalarımızı Tanıyalım/',
    'https://www.tarimorman.gov.tr/SYGM/Belgeler/havza tanıtım 23.03.2023/türkçe/',
]

ADLAR = {
    '01': 'Meriç Ergene', '02': 'Marmara', '03': 'Susurluk', '04': 'Kuzey Ege',
    '05': 'Gediz', '06': 'Küçük Menderes', '07': 'Büyük Menderes',
    '08': 'Batı Akdeniz', '09': 'Antalya', '10': 'Burdur', '11': 'Akarçay',
    '12': 'Sakarya', '13': 'Batı Karadeniz', '14': 'Yeşilırmak',
    '15': 'Kızılırmak', '16': 'Konya Kapalı', '17': 'Doğu Akdeniz',
    '18': 'Seyhan', '19': 'Asi', '20': 'Ceyhan', '21': 'Fırat-Dicle',
    '22': 'Doğu Karadeniz', '23': 'Çoruh', '24': 'Aras', '25': 'Van Gölü',
}


def tr_kucult(s):
    return s.replace('İ', 'i').replace('I', 'ı').lower()


IL_KUCUK = {tr_kucult(il): il for il in ILLER}
IL_DESEN = re.compile(r'(?<![a-zçğıöşü])(' + '|'.join(map(re.escape, sorted(IL_KUCUK, key=len, reverse=True))) + r')(?![a-zçğıöşü])')


def indir(url, hedef):
    r = subprocess.run(['curl', '-skLm', '90', '-A', 'Mozilla/5.0', '-o', hedef,
                        '-w', '%{http_code}', url], capture_output=True, text=True)
    return r.stdout.strip()


def iller_cikar(metin):
    kucuk = tr_kucult(metin)
    # 1) "... illeri (kısmen)? yer almaktadır" cümlesi
    for m in re.finditer(r'[^.]{0,400}?iller[iı][^.]{0,80}?yer al[^.]{0,60}\.', kucuk):
        adaylar = [IL_KUCUK[x] for x in dict.fromkeys(IL_DESEN.findall(m.group(0)))]
        if len(adaylar) >= 1:
            return adaylar
    # 2) il tablosu: "il adı" başlığından "toplam"a kadar
    i = kucuk.find('il adı')
    if i < 0:
        i = kucuk.find('yer alan iller')
    if i >= 0:
        son = kucuk.find('toplam', i)
        parca = kucuk[i:son if son > i else i + 4000]
        adaylar = [IL_KUCUK[x] for x in dict.fromkeys(IL_DESEN.findall(parca))]
        if adaylar:
            return adaylar
    return []


sonuc = {}
for no, ad in ADLAR.items():
    pdf = f'/tmp/claude-0/-root-projeler-suharitasi/5bbeeebc-ed92-4ed8-8b1f-2e75eb86cf58/scratchpad/h{no}.pdf'
    url_ok, iller = None, []
    dosyalar = [f'{ad} Havzası Tanıtım.pdf', f'{ad} Broşür.pdf',
                f'{ad} Havzası.pdf', f'{ad} Havzası Broşür.pdf',
                f'{ad}-Broşür.pdf', f'{ad} Tanıtım.pdf']
    if no == '21':
        dosyalar = ['Fırat-Dicle Broşür.pdf', 'Fırat-Dicle Havzası Tanıtım.pdf', 'Fırat Dicle Broşür.pdf']
    for dizin in DIZINLER:
        for dosya in dosyalar:
            url = quote(dizin + dosya, safe=':/')
            if indir(url, pdf) == '200':
                metin = subprocess.run(['pdftotext', pdf, '-'], capture_output=True, text=True).stdout
                if len(metin) < 500:
                    continue
                adaylar = iller_cikar(metin)
                if adaylar:
                    url_ok, iller = url, adaylar
                    break
        if url_ok:
            break
    sonuc[no] = {'ad': ad, 'kaynak': url_ok, 'iller': iller}
    print(f"{no} {ad}: {', '.join(iller) if iller else 'BULUNAMADI'}", file=sys.stderr)

json.dump(sonuc, open('/tmp/claude-0/-root-projeler-suharitasi/5bbeeebc-ed92-4ed8-8b1f-2e75eb86cf58/scratchpad/havza-il-ham.json', 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)
