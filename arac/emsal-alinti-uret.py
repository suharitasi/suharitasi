#!/usr/bin/env python3
# EMSAL KARAR ALINTILARI — brif 4.4, DURAK 1 A-d (10.10.2026).
# Karar sayfasındaki "üç parçalı özet" yazılmaz, resmî karar metninden BİREBİR kesilir:
# her parça için başlangıç ve bitiş ifadesi verilir, betik metinden dilimi alır.
# Ham metin (karararama.danistay.gov.tr getDokuman çıktısı) depoya GİRMEZ: bazı resmî
# metinlerde anonimleştirilmemiş kişi adı bulunur. Ham metin cikti/emsal-resmi/ altında
# (gitignore) durur; depoya yalnız seçilen alıntılar yazılır.
# Kullanım:
#   python3 arac/emsal-alinti-uret.py --ham <getDokuman .htm klasörü>   # ham metni üret + alıntıla
#   python3 arac/emsal-alinti-uret.py                                    # cikti/emsal-resmi'den alıntıla
import argparse, html, json, os, re, sys, urllib.parse

KOK = os.getcwd()
KARARLAR = os.path.join(KOK, 'data/kamu/emsal-kararlar.json')
MADDELER = os.path.join(KOK, 'data/kamu/mevzuat-maddeleri.json')
HAM_DIZIN = os.path.join(KOK, 'cikti/emsal-resmi')
CIKTI = os.path.join(KOK, 'data/kamu/emsal-alinti.json')
ERISIM = '2026-10-10'

HD = 'HUKUKİ DEĞERLENDİRME'
IDM = 'İlk Derece Mahkemesi kararının özeti'
KS = 'KARAR SONUCU'
ISKI_SONUC = [('Temyiz isteminin reddine,', None, KS),
              ('Bölge İdare Mahkemesi ... İdari Dava Dairesinin', 'ONANMASINA,', KS),
              ('Kesin olarak, 26/06/2025', 'karar verildi.', KS)]
MUGLA_GEREKCE = [('bu durumda, mevzuat uyarınca il genel meclisinde', 'sonucuna varılmıştır.', IDM)]

def onama(son):
    return [('temyiz isteminin reddine,', None, KS), ('temyiz istemlerinin reddine,', None, KS),
            ('sayılı temyize konu kararında', 'ONANMASINA,', KS), (son, 'karar verildi.', KS)]

SECIM = {
    'danistay-8-daire-2025-5198-2025-10204': {
        'gerekce_bolum': 'hd',
        'gerekce': [("Davalı idarece ''yeraltı suyu kullanım belgesi''", 'sonucuna varılmıştır.', HD),
                    ('Ayrıca 5686 sayılı Kanun uyarınca', 'bulunmamaktadır.', HD)],
        'sonuc': [('Temyiz isteminin kısmen kabulüne, kısmen reddine,', None, KS),
                  ('a) Dava konusu işlemin, davacı site adına', 'BOZULMASINA,', KS),
                  ('b) Dava konusu işlemin, davacı sitenin kullandığı suyun', 'ONANMASINA,', KS),
                  ('Kesin olarak, 23/12/2025', 'karar verildi.', KS)]},
    'danistay-8-daire-2024-2630-2025-6289': {'gerekce_bolum': 'idm',
        'gerekce': [('dava konusu yazı ve ekindeki ihtarnamenin', 'incelenmeksizin reddine karar verilmiştir.', IDM)], 'sonuc': ISKI_SONUC},
    'danistay-8-daire-2024-532-2025-6286': {'gerekce_bolum': 'idm',
        'gerekce': [('herhangi bir yaptırım öngörmeyen', 'incelenmeksizin reddine karar verilmiştir.', IDM)], 'sonuc': ISKI_SONUC},
    'danistay-8-daire-2024-2635-2025-6285': {'gerekce_bolum': 'idm',
        'gerekce': [('ön bildirim niteliğinde bir işlem olduğu', 'incelenmeksizin reddine karar verilmiştir.', IDM)], 'sonuc': ISKI_SONUC},
    'danistay-8-daire-2024-2079-2025-6287': {'gerekce_bolum': 'idm',
        'gerekce': [('ön bildirim niteliğinde bir işlem olduğu', 'incelenmeksizin reddine karar verilmiştir.', IDM)], 'sonuc': ISKI_SONUC},
    'danistay-8-daire-2024-4487-2025-6288': {'gerekce_bolum': 'idm',
        'gerekce': [('ön bildirim niteliğinde bir işlem olduğu', 'incelenmeksizin reddine karar verilmiştir.', IDM)], 'sonuc': ISKI_SONUC},
    'danistay-13-daire-2025-44-2025-778': {'gerekce_bolum': 'idm',
        'gerekce': [('dolayısıyla ihaleden 21/04/2022', 'sonucuna varılmıştır.', IDM)],
        'sonuc': onama('2577 sayılı Kanun\'un 20/A maddesinin ikinci fıkrasının (i) bendi')},
    'danistay-8d-2018-6147': {'gerekce_bolum': 'hd',
        'gerekce': [('Bu durumda, davacılar tarafından', 'hukuki isabet bulunmamaktadır.', HD)],
        'sonuc': [('Temyiz isteminin kabulüne,', None, KS), ('Bölge İdare Mahkemesi ...İdari Dava Dairesinin', 'BOZULMASINA,', KS),
                  ('Kesin olarak, 17/01/2024', 'karar verildi.', KS)]},
    'danistay-8d-2023-663': {'gerekce_bolum': 'hd',
        'gerekce': [('Bu durumda; Bölge İdare Mahkemesi kararına karşı', 'sonucuna ulaşılmaktadır.', HD)],
        'sonuc': [('TEMYİZ İSTEMİNİN SÜRE AŞIMI NEDENİYLE REDDİNE,', None, KS), ('kesin olarak, 24/02/2023', 'karar verildi.', KS)]},
    'danistay-8d-2021-5225': {'gerekce_bolum': 'hd',
        'gerekce': [('Uyuşmazlıkta dava konusu suların niteliği için', 'sağlıklı olmadığı sonucuna varılmıştır.', HD),
                    ('Bu nedenle davacı site tarafından', 'gerektiği açıktır.', HD)],
        'sonuc': [('Bölge İdare Mahkemesi ... İdari Dava Dairesinin', 'BOZULMASINA,', KS), ('Kesin olarak 23/11/2023', 'karar verildi.', KS)]},
    'danistay-13d-2020-1093': {'gerekce_bolum': 'idm', 'gerekce': MUGLA_GEREKCE,
        'sonuc': onama('2577 sayılı Kanun\'un Geçici 8. maddesi uyarınca')},
    'danistay-13-daire-2020-1104-2023-4576': {'gerekce_bolum': 'idm', 'gerekce': MUGLA_GEREKCE,
        'sonuc': onama('2577 sayılı Kanun\'un Geçici 8. maddesi uyarınca')},
    'danistay-13-daire-2020-1499-2023-2585': {'gerekce_bolum': 'idm', 'gerekce': MUGLA_GEREKCE,
        'sonuc': onama('2577 sayılı Kanun\'un Geçici 8. maddesi uyarınca')},
    'danistay-13-daire-2021-2712-2023-4291': {'gerekce_bolum': 'idm',
        'gerekce': [('dava konusu kaynak suyunun bulunduğu ormanlık alanda', 'sonucuna varılmıştır.', IDM)],
        'sonuc': onama('2577 sayılı Kanun\'un 20/A maddesinin ikinci fıkrasının (i) bendi')},
    'danistay-13-daire-2022-1487-2023-870': {'gerekce_bolum': 'idm',
        'gerekce': [('işbu davaya konu ihalenin ise planlama değil', 'ibaret olduğu', IDM),
                    ('dava konusu ihalede hukuka aykırılık bulunmadığı', 'sonucuna varılmıştır.', IDM)],
        'sonuc': onama('2577 sayılı Kanun\'un 20/A maddesinin ikinci fıkrasının (i) bendi')},
    'danistay-10d-2017-40': {'gerekce_bolum': 'hd',
        'gerekce': [('Uyuşmazlıkta, İdare Mahkemesince, davacının açmak istediği kuyunun', 'aykırı görülmüştür.', HD),
                    ('Bu itibarla, İdare Mahkemesince keşif', 'bulunmamaktadır.', HD)],
        'sonuc': [('Dava konusu işlemin iptaline ilişkin temyize konu', 'BOZULMASINA,', KS), ('07/10/2021 tarihinde', 'karar verildi.', KS)]},
    'danistay-13d-2015-4133': {'gerekce_bolum': 'hd',
        'gerekce': [('Dava konusu su kaynağının, kullanışının özelliği', 'hukuka aykırılık bulunmamaktadır.', HD)],
        'sonuc': onama('2577 sayılı Kanun\'un 20/A maddesinin ikinci fıkrasının (i) bendi')},
    'danistay-8d-2018-2016': {'gerekce_bolum': 'metin', 'uyusmazlik_bolum': 'Danıştay kararının dava konusunu anlatan kısmı',
        'sonuc_bolum': 'Danıştay kararının hüküm kısmı',
        'uyusmazlik': [('Dava; 25/12/2014', 'iptali istemiyle açılmıştır.', None)],
        'gerekce': [('Olayda, yeraltı suları ile kaynak sularının', 'hukuka uyarlık bulunmamaktadır.', None)],
        'sonuc': [('karar düzeltme istemi kabul edilerek', 'işin esası yeniden incelendi.', None),
                  ('Açıklanan nedenlerle, ... İdare Mahkemesinin', 'karar verildi.', None)]},
    'danistay-13d-2013-263': {'gerekce_bolum': 'hd',
        'gerekce': [('Aktarılan mevzuat hükümleri uyarınca, 4916 sayılı', 'hukuka uygunluk bulunmamaktadır.', HD)],
        'sonuc': onama('2577 sayılı Kanun\'un 20/A maddesinin ikinci fıkrasının (i) bendi')},
    'danistay-13d-2012-253': {'gerekce_bolum': 'idm',
        'gerekce': [('167 sayılı Yeraltı Suları Hakkında Kanunun 4. maddesine göre', 'kiralama yapılması olanağının bulunmadığı', IDM),
                    ('davacıya ait taşınmazdan çıkan suyun niteliği ortaya konulmadan', 'iptaline karar verilmiştir.', IDM)],
        'sonuc': onama('Bu kararın tebliğ tarihini izleyen 15 (on beş) gün')},
}
BOLUM_AD = {'hd': 'Danıştay kararının "Hukuki değerlendirme" bölümü',
            'idm': 'Danıştay kararında aktarılan "İlk Derece Mahkemesi kararının özeti" bölümü',
            'metin': 'Danıştay kararının gerekçe kısmı'}

def duz(t):
    for _ in range(2):
        t = re.sub(r'(?is)<(script|style).*?</\1>', '', t)
        t = re.sub(r'(?i)<br\s*/?>|</p>|</div>|</li>|</tr>', '\n', t)
        t = re.sub(r'<[^>]+>', '', t); t = html.unescape(t)
    t = t.replace('\xa0', ' ')
    t = re.sub(r'[ \t]+', ' ', t); t = re.sub(r' *\n *', '\n', t); t = re.sub(r'\n{2,}', '\n\n', t)
    return re.sub(r'^Karar İçeriği\s*', '', t.strip())

def ham_uret(ham, kararlar):
    os.makedirs(HAM_DIZIN, exist_ok=True)
    for k in kararlar:
        i = k['id']
        kaynak = next((p for p in (f'{ham}/{i}.htm', f'{ham}/dok-{i}.htm') if os.path.exists(p)), None)
        if not kaynak: sys.exit(f'HAM YOK: {i}')
        t = duz(open(kaynak, encoding='utf-8', errors='replace').read())
        ak = urllib.parse.parse_qs(urllib.parse.urlparse(k['resmi_dogrulama']['url']).query).get('arananKelime', [''])[0]
        if ak and t.endswith(ak): t = t[: -len(ak)].rstrip()
        open(f'{HAM_DIZIN}/{i}.txt', 'w', encoding='utf-8').write(t + '\n')

def kes(t, bas, son, bolum):
    o = 0
    if bolum:
        o = t.find(bolum)
        if o < 0: raise ValueError(f'bölüm yok: {bolum}')
    a = t.find(bas, o)
    if a < 0: return None
    if son is None:
        e = t.find('\n', a); e = len(t) if e < 0 else e
    else:
        e = t.find(son, a)
        if e < 0: raise ValueError(f'bitiş yok: {son!r} (başlangıç {bas!r})')
        e += len(son)
    if '\n\n' in t[a:e] or t[a:e].count('\n') > 2: raise ValueError(f'parça paragraf aştı: {bas!r}')
    return a, e

def satir_basi(t, a):
    s = t.rfind('\n', 0, a) + 1
    on = t[s:a]
    m = re.match(r'^\s*(?:\d+\.|[a-zçğıöşü]\))?\s*', on)
    return s + (m.end() if m else 0)

def parca(t, bas, son, bolum):
    r = kes(t, bas, son, bolum)
    if not r: return None
    a, e = r
    if bolum == KS: a = satir_basi(t, a)
    metin = re.sub(r'\s+', ' ', t[a:e]).strip()
    on = t[t.rfind('\n', 0, a) + 1:a]
    if re.fullmatch(r'\s*(?:\d+\.|[a-zçğıöşü]\))?\s*', on):
        bas_kesik = False
    else:
        bas_kesik = on.rstrip()[-1:] not in '.:;'
    return {'metin': metin, 'bas_kesik': bas_kesik, 'son_kesik': metin[-1:] not in '.,;:'}

KANUN_SAYFA = {'167', '2886', '2942', '5393', '5686', '6200', '831'}
MADDE_RE = re.compile(r"(\d{3,4}) sayılı(?:[^.;:\n]{0,140}?)\b(?:Kanun|Kanunu|Kanununun|Kanunun|Yasa|Yasanın)['’]?(?:n?[uıiü]n)?\s+"
                      r"(?:(geçici|Geçici|ek|Ek)\s+)?(\d+)\s*(?:/\s*[a-zçğıöşü0-9]+)?\s*\.?\s*(?:ve\s+(\d+)\s*\.\s*)?madde", re.U)

def maddeler(t, sayfalar):
    bul = []
    for m in MADDE_RE.finditer(t):
        kanun, tur, n1, n2 = m.group(1), (m.group(2) or '').lower(), m.group(3), m.group(4)
        if kanun not in KANUN_SAYFA: continue
        for n in [n1] + ([n2] if n2 else []):
            ad = {'geçici': f'Geçici Madde {n}', 'ek': f'Ek Madde {n}'}.get(tur, f'Madde {n}')
            if (kanun, ad) in sayfalar and (kanun, ad) not in bul: bul.append((kanun, ad))
    return [{'kanun': k, 'madde': a} for k, a in bul]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--ham'); a = ap.parse_args()
    kararlar = [k for k in json.load(open(KARARLAR))['kararlar'] if k['resmi_dogrulama']['durum'] == 'dogrulandi']
    if a.ham: ham_uret(a.ham, kararlar)
    sayfalar = {(m['kanunKisa'], m['madde']) for m in json.load(open(MADDELER))['maddeler']}
    cikti, hata = {}, []
    for k in kararlar:
        i = k['id']; s = SECIM.get(i)
        if not s: hata.append(f'{i}: seçim yok'); continue
        p = f'{HAM_DIZIN}/{i}.txt'
        if not os.path.exists(p): hata.append(f'{i}: ham metin yok ({p})'); continue
        t = open(p, encoding='utf-8').read()
        kayit = {'uyusmazlik_bolum': s.get('uyusmazlik_bolum', 'Danıştay kararının "Yargılama süreci" bölümündeki "Dava konusu istem" kısmı'),
                 'gerekce_bolum': BOLUM_AD[s['gerekce_bolum']],
                 'sonuc_bolum': s.get('sonuc_bolum', 'Danıştay kararının "Karar sonucu" bölümü')}
        uy = s.get('uyusmazlik')
        if not uy:
            m = re.search(r'Dava konusu istem[\s:]+', t)
            if not m: hata.append(f'{i}: dava konusu istem yok'); continue
            sat = t[m.end():].split('\n', 1)[0].strip()
            uy = [(sat[:40], sat[-25:], None)]
        for alan, liste in (('uyusmazlik', uy), ('gerekce', s['gerekce']), ('sonuc', s['sonuc'])):
            ps = []
            for bas, son, bolum in liste:
                try:
                    r = parca(t, bas, son, bolum)
                except ValueError as e:
                    hata.append(f'{i}/{alan}: {e}'); continue
                if r: ps.append(r)
            if not ps: hata.append(f'{i}/{alan}: parça bulunamadı')
            kayit[alan] = ps
        kayit['anilan_maddeler'] = maddeler(t, sayfalar)
        cikti[i] = kayit
    if hata:
        print('\n'.join(hata)); sys.exit(1)
    veri = {'_not': 'Emsal karar sayfalarındaki alıntılar (brif 4.4). Her parça resmî karar metninden birebir kesilmiştir '
                     '(arac/emsal-alinti-uret.py); bu sitenin yorumu ya da özeti değildir. anilan_maddeler: karar metninde '
                     'kanun numarası ve madde numarasıyla açıkça anılan ve sitede metni bulunan maddeler.',
            'erisim': ERISIM, 'kaynak_sunucu': 'karararama.danistay.gov.tr', 'kararlar': cikti}
    json.dump(veri, open(CIKTI, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    open(CIKTI, 'a').write('\n')
    print(f'{len(cikti)} karar yazıldı → {os.path.relpath(CIKTI, KOK)}')

if __name__ == '__main__':
    main()
