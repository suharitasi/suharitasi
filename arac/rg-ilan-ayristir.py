#!/usr/bin/env python3
"""Resmî Gazete DSİ yeraltısuyu işletme sahası ilanlarını KAYNAK METİNDEN yeniden ayrıştırır
(10.10.2026; brif 1.2, 2.6 ve sahibin 4-A kararı: il eşlemesi tahminle değil resmî metinle).

Girdi : cikti/rg-ham/ (arac/rg-ilan-indir.py önbelleği), veri/potansiyel/isletme-sahalari{,-ek}.json
        (tarih/sayı/başlık künyesi için), src/data/tr-iller.json (81 il adı),
        veri/potansiyel/ilce-il-dizini.json (ilçe→il; TÜİK ile çapraz doğrulanmış).
Çıktı : veri/potansiyel/isletme-sahalari-v2.json  +  rapor/rg-il-eslemesi-YYYYMMDD.md
Kural : il yalnız DSİ ilan BLOĞUNUN içinde geçen il adından (ya da bloktaki ilçe adının TÜİK dizinindeki
        tek ilinden) alınır; bulunamazsa 'doğrulanamadı' — tahmin yok. Durum yalnız bloktaki hüküm
        ifadesinden: geçmiş/şimdiki zaman yasak-kapatma ifadesi → 'tahsise kapatma/kısıt'; standart
        "rezerve erişildiğinde ... izin verilmeyecektir" koşullu cümlesi kısıt SAYILMAZ.
"""
import json, re, os, sys, hashlib, html, subprocess, datetime, collections

KOK = os.getcwd()
HAM = os.path.join(KOK, 'cikti/rg-ham')
BUGUN = datetime.date.today().isoformat()
# tr-iller.json Afyonkarahisar'ı 'Afyon' diye taşır; çıktıda ilin resmî adı kullanılır (sitedeki 81 il listesiyle aynı).
iller = [('Afyonkarahisar' if f['properties']['name'] == 'Afyon' else f['properties']['name']) for f in json.load(open('src/data/tr-iller.json'))['features']]
ILCE = json.load(open('veri/potansiyel/ilce-il-dizini.json'))['ilceler']
ESKI_AD = {'İçel': 'Mersin', 'Afyon': 'Afyonkarahisar', 'Urfa': 'Şanlıurfa', 'Maraş': 'Kahramanmaraş', 'Antep': 'Gaziantep', 'Hakkâri': 'Hakkari'}

def buyuk(s):  # Türkçe büyük harf
    return s.replace('i', 'İ').replace('ı', 'I').upper()

IL_DESEN = {}
for il in iller + list(ESKI_AD):
    IL_DESEN[il] = re.compile(r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])(' + re.escape(il) + '|' + re.escape(buyuk(il)) + r')(?![A-Za-zÇĞİÖŞÜçğıöşü])')
# Genel sözcüklerle çakışan ilçe adları il kanıtı sayılmaz.
# Sözlük sözcüğü / ay adı / meslek adı olan ilçe adları il kanıtı sayılmaz; kalanlar da yalnız
# "… İlçesi / Kazası / Ovası / Nahiyesi" gibi idari bağlamda sayılır (eski RG metninde
# "Aralık" ay, "Maden" cevher, "Demirci" meslek olarak geçiyor — 10.10.2026 ölçüldü).
ILCE_YASAK = {'Merkez', 'Kale', 'Göle', 'Çay', 'Ova', 'Orta', 'Yeni', 'Ulus', 'Sur', 'Bor', 'Han', 'Kaş', 'Of', 'Kemer', 'Köprü', 'Çan', 'Bala', 'Ağın', 'Gölbaşı', 'Ulaş',
              'Ergene', 'Menderes', 'Gediz', 'Seyhan', 'Dicle', 'Kızılırmak', 'Meriç', 'Halkapınar', 'Aralık', 'Maden', 'Akdeniz', 'Menteşe', 'Demirci', 'Kargı', 'Hacılar', 'Yeşilova', 'Yenişehir', 'Karadeniz', 'Çiftlik', 'Çayırlı', 'Sultanbeyli', 'Cumayeri', 'Bahçe', 'Kozan', 'Tarsus', 'Selim', 'Ayvacık', 'Alaca', 'Dursunbey', 'Kurucaşile', 'Pazar', 'Araç', 'Gemerek', 'Akyurt', 'Keçiören', 'Gürün', 'Suluova', 'Ceyhan', 'Eğil', 'Karataş', 'Onikişubat', 'Dulkadiroğlu'}
# "(Cide) Ovası", "Çatalca - Yalıkavak (Podima) Ovası", "Seydişehir - İçeri Kışlak Vadisi" gibi
# ova/vadi adına tire ya da parantezle bağlanan ilçe adları da idari bağlamdır (10.10.2026 ölçüldü).
HARF_SINIR = r'(?![A-Za-zÇĞİÖŞÜçğıöşü])'
ZINCIR_SON = r'(?:Yeraltı|YERALTI|Ova|ova|OVA|Vadi|vadi|VADİ|Sahil|sahil|SAHİL|Havza|havza|HAVZA|arası|ARASI|Kaynağ|kaynağ|KAYNAĞ|Kaynak|kaynak|KAYNAK|Koruma|KORUMA|Gölü|GÖLÜ|Deresi|DERESİ)'
# İlçe adı yalnız idari sözcükle (İlçe/Kaza/Nahiye/Bucak) ya da doğrudan ova/vadi adıyla kanıt sayılır.
# Tire zincirinde ("Korkuteli - Bozova - Kestel - Çeltikçi ovaları") yalnız İLK ad ilçe olarak okunur;
# aradaki adlar köy/ova adı olabilir (Bozova, Kestel burada köy; 10.10.2026 ölçüldü). "Köy" bağlamı
# kanıt değildir (Akyaka Köyü ≠ Akyaka ilçesi).
ILCE_BAGLAM_DOGRUDAN = r'\)?\s*(?:İlçe|ilçe|İLÇE|Kaza|kaza|KAZA|Nahiye|nahiye|NAHİYE|Bucağ|bucağ|BUCAĞ|Ova|ova|OVA|Vadi|vadi|VADİ)[A-Za-zÇĞİÖŞÜçğıöşü]*'
ILCE_BAGLAM_ZINCIR = r'\s*[-–]\s*[A-ZÇĞİÖŞÜ(][^.;:«»,]{0,45}?' + ZINCIR_SON
def _ilce_desen(ad):
    ad_r = '(' + re.escape(ad) + '|' + re.escape(buyuk(ad)) + ')'
    dogrudan = r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])' + ad_r + ILCE_BAGLAM_DOGRUDAN
    zincir_ilk = r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])(?<![-–]\s)(?<![-–])' + ad_r + ILCE_BAGLAM_ZINCIR
    return re.compile(dogrudan + '|' + zincir_ilk)
ILCE_DESEN = {ad: _ilce_desen(ad)
              for ad, ilsz in ILCE.items() if len(ilsz) == 1 and ad not in ILCE_YASAK and len(ad) >= 4}
# Temiz HTML ilan bloğunda (alt havza listeleri: "1-3 Lüleburgaz") ilçe adı bağlamsız da sayılır;
# yalnız ≥ 6 harfli, tek ile ait ve durak listesinde olmayan adlar.
ILCE_DESEN_SERBEST = {ad: re.compile(r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])(' + re.escape(ad) + '|' + re.escape(buyuk(ad)) + r')(?![A-Za-zÇĞİÖŞÜçğıöşü])')
              for ad, ilsz in ILCE.items() if len(ilsz) == 1 and ad not in ILCE_YASAK and len(ad) >= 6}
# Arşiv PDF pencereleri iki sütunlu sayfadan komşu ilanları da alır: il adı yalnız idari
# bağlamda ("Konya İli", "KONYA - ÇUMRA OVASI", "İzmir Vilâyeti") kanıt sayılır.
# İl adı idari sözcükle ya da ova/vadi/havza adına bağlı olarak kanıt sayılır; virgül ve kapanış
# parantezi bağlam değildir (bakan imza listelerinde "S. Aydın," gibi kişi adları).
IL_BAGLAM = r'(?:\s*(?:İli|ili|İLİ|İlin|ilin|İLİN|Vilâyet|Vilayet|VİLÂYET|VİLAYET|Ova|OVA|ova|Havza|HAVZA|Vadi|VADİ|Merkez|MERKEZ|Sahil|SAHİL)[A-Za-zÇĞİÖŞÜçğıöşü]*'
IL_BAGLAM += r"|['’][a-zçğıöşü]{1,4}\s+bağlı"
IL_BAGLAM += r'|\s+[A-ZÇĞİÖŞÜ][A-Za-zÇĞİÖŞÜçğıöşü]{2,}\s+' + ZINCIR_SON
IL_BAGLAM += r'|\s*(?:[-–]|ve|,)\s*[A-ZÇĞİÖŞÜ(][^.;:«»]{0,45}?' + ZINCIR_SON + ')'
IL_DESEN_PDF = {il: re.compile(r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])(' + re.escape(il) + '|' + re.escape(buyuk(il)) + r')' + IL_BAGLAM) for il in iller + list(ESKI_AD)}

# 'kapatılır' (belgesiz kuyuların kapatılması) yaptırım kuralıdır; sahanın tahsise kapatılması değildir.
KISIT = re.compile(r'yasaktır|yasaklanmıştır|yasaklanmış|yasaklanan|yasaklanır|tahsise kapat[ıi]lm|tahsise kapalı|kapatılmıştır|kısıtlanmıştır|kısıtlama getirilmiştir|izin verilmemektedir|yasak bölge|YASAK BÖLGE', re.I)
KISIT_BAGLAM = re.compile(r'kuyu|sondaj|yeraltı ?suyu|yeraltısuyu|tahsis|belge|galeri|tünel|kaptaj|çukur', re.I)
# Cümle sınırı: büyük harf/madde numarasıyla başlayan yeni cümle ('8. maddesi' sınır değildir).
CUMLE_SINIRI = re.compile(r'(?:\.\s+(?=[A-ZÇĞİÖŞÜ])|\s\d{1,2}\s*[-–—]\s+(?=[A-ZÇĞİÖŞÜ0-9]))')
KOSUL = re.compile(r'(?:erişildiğinde|ulaşıldığında|eriştiğinde|ulaştığında|erişilince|ulaşılınca|erişmesi halinde|ulaşması halinde)(?!n)', re.I)
KISIT_NEDENSEL = re.compile(r'(erişildiğinden|ulaştığından|eriştiğinden|çekildiğinden|ulaşıldığından|tahsis edildiğinden)[^.]{0,220}?(yapılmayacaktır|verilmeyecektir|yapılmaz|verilmez)', re.I)
# Çoğul ("işletme sahaları") ve "işletme alanı" biçimleri de (10.10.2026: 1966 kararnameleri kaçıyordu).
ANAHTAR = re.compile(r'(YERALTI ?SUYU|Yeraltı ?[Ss]uyu|yeraltı ?suyu|YERALTISULARI|yeraltısuları)\s+(İŞLETME\s*SAHA[SL]|[İi]şletme\s*[Ss]aha[sl]|İŞLETME\s*ALAN|[İi]şletme\s*alan)', re.I)
BASLIK = re.compile(r"([A-ZÇĞİÖŞÜ0-9][A-ZÇĞİÖŞÜ0-9 ()\-–/,.'’]{3,160}?)\s+(YERALTISUYU|YERALTI SUYU)\s+İŞLETME SAHAS[IİÂ]\w*\s*(İL[AÂ]NI|DEĞİŞİKLİĞİ|KARARI)?")

SAPKA = str.maketrans('âîûÂÎÛ', 'aiuAİU')
def html_metin(raw):
    m = re.search(rb'charset=["\']?([\w-]+)', raw[:4000]); enc = m.group(1).decode() if m else 'utf-8'
    try: t = raw.decode(enc)
    except Exception: t = raw.decode('cp1254', 'replace')
    t = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', t, flags=re.S | re.I)
    t = html.unescape(re.sub(r'<[^>]+>', ' ', t))
    return re.sub(r'\s+', ' ', t).translate(SAPKA)

HARF = r'[^\W\d_]'
def harf_birlestir(tx):
    # "k u y u" / "A n k a r a" biçiminde boşluklanmış sözcükler (eski RG dizgisi) birleştirilir;
    # yalnız 3+ tek harfin boşlukla dizilişi hedeflenir, normal metin değişmez.
    return re.sub(r'(?<!' + HARF + r')((?:' + HARF + r' ){2,}' + HARF + r')(?!' + HARF + r')', lambda m: m.group(1).replace(' ', ''), tx)

BUYUK_I_ADLAR = sorted({a for a in list(ILCE) + iller if a.startswith('İ') and len(a) >= 5}, key=len, reverse=True)
BUYUK_I_DESEN = re.compile(r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])i(' + '|'.join(re.escape(a[1:]) for a in BUYUK_I_ADLAR) + r')(?![a-zçğıöşü])')
def pdf_metin(yol):
    r = subprocess.run(['pdftotext', '-enc', 'UTF-8', yol, '-'], capture_output=True)
    tx = re.sub(r'\s+', ' ', r.stdout.decode('utf-8', 'replace'))
    tx = re.sub(r'(\w)[\u00ad\u00AD]\s*', r'\1', tx)  # tire ile bölünen heceler
    tx = harf_birlestir(tx).translate(SAPKA)
    # OCR büyük İ'yi küçük i okuyabiliyor ("iskenderun", "istanbul"): yalnız il/ilçe adlarında düzeltilir.
    return BUYUK_I_DESEN.sub(lambda m: 'İ' + m.group(1), tx)

SONRAKI_BASLIK = re.compile(r'(?<=[.;:!)\d\s])[A-ZÇĞİÖŞÜ][^:▲]{3,140}?(Başkanlığından|Müdürlüğünden|Bakanlığından|Rektörlüğünden|Belediyesinden|Belediye Başkanlığından|Valiliğinden|Genel Müdürlüğünden|Kurumundan|Odasından|Dairesinden)\s*:')
ILAN_KODU = re.compile(r'\b\d{3,6}/\d-\d\b')
DSI_BASLIK = re.compile(r'(Devlet Su İşleri|DSİ|D\.S\.İ\.)[^▲]{0,200}?(Başkanlığından|Müdürlüğünden|Müdürlüğü)\s*:')
def bloklar_html(tx):
    out = []
    for m in DSI_BASLIK.finditer(tx):
        s = m.start(); kalan = tx[m.end(): m.end() + 8000]
        adaylar = [kalan.find('▲')]
        n = SONRAKI_BASLIK.search(kalan, 40)
        if n: adaylar.append(n.start())
        k = ILAN_KODU.search(kalan, 200)
        if k: adaylar.append(k.end())
        adaylar = [a for a in adaylar if a and a > 0]
        e = min(adaylar) if adaylar else 6000
        blok = tx[s: m.end() + e]
        if len(blok) < 250 or not ANAHTAR.search(blok): continue
        ilk = ANAHTAR.search(blok).start()
        kodlar = [k.end() for k in ILAN_KODU.finditer(blok, 0, ilk)]
        if kodlar: blok = blok[kodlar[-1]:].lstrip()
        out.append(blok)
    if not out:  # başlıksız sayfa: anahtar çevresi
        for m in ANAHTAR.finditer(tx):
            out.append(tx[max(0, m.start() - 600): m.end() + 2500])
    return tekille(out)

def bloklar_pdf(tx):
    aralik = []
    for m in ANAHTAR.finditer(tx):
        s, e = max(0, m.start() - 400), m.end() + 1800
        if aralik and s <= aralik[-1][1]: aralik[-1][1] = max(aralik[-1][1], e)
        else: aralik.append([s, e])
    return [tx[s:e] for s, e in aralik]

def tekille(bloklar):
    out = []
    for b in bloklar:
        if not any(b[:300] in o or o[:300] in b for o in out): out.append(b)
    return out

# Pencere gerçek bir DSİ ilanı mı? Fihrist/İÇİNDEKİLER satırı, bilanço ya da kabine listesi
# anahtar sözcüğü taşısa da kuyu/rezerv/akifer/sondaj gibi teknik sözcük taşımaz.
ALAN_SOZ = re.compile(r'kuyu|rezerv|akifer|sondaj|hm\s*3|m\s*3\s*/\s*yıl|m³|galeri|kaptaj|emniyetli', re.I)
FIHRIST = re.compile(r'İÇİNDEKİLER|(?:\b\d/\d{3,5}\s+[A-ZÇĞİÖŞÜ][^/]{10,160}?\s(?:Karar|Kararname|Tüzük|Yönetmelik)\w*\s+\d{1,3}\b.*){2,}')
ILAN_IZI = re.compile(r'kabul ve ilan|Batıdan\s*:|Doğudan\s*:|Kuzeyden\s*:|Güneyden\s*:|ova sınırı|saha sınırı|[İi]şletmeye açıl|İŞLETMEYE AÇIL|sınırları ve karakteristikleri|sınırları ve özellikleri')
def dsi_ilani_mi(blok):
    puan = len(ALAN_SOZ.findall(blok)) + len(ILAN_IZI.findall(blok))
    if FIHRIST.search(blok):
        return puan >= 5
    return puan >= 2

BASLIK_EK = r"(?:['’]?(?:de|da|te|ta|deki|daki|nin|nın|in|ın|e|a|ye|ya))?"
IL_DESEN_BASLIK = {il: re.compile(r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])(' + re.escape(il) + '|' + re.escape(buyuk(il)) + r')' + BASLIK_EK + r'(?![A-Za-zÇĞİÖŞÜçğıöşü])') for il in iller + list(ESKI_AD)}
BASLIK_DURAK = {'yeraltı', 'yeraltısuyu', 'sahalar', 'hakkındaki', 'olan', 'kabulü', 'yerlerinin', 'sahaları', 'işletme', 'kabul', 'yer', 'altı', 'olarak', 'yeraltısularının', 'suyu', 'sulari', 'yeraltisulari', 'işletme', 'sahası', 'sahaları', 'sahasının', 'sahalarının', 'ovası', 'ovaları', 'ovalarının', 'ovasının',
                'hakkında', 'karar', 'kararname', 'kabul', 'kabulü', 'ilanı', 'ilânı', 'olarak', 'edilen', 'dair', 'bazı', 'yerlerin', 'sahil', 'havzası', 'ilişik', 'metin', 'haritalarda',
                'sınırları', 'özellikleri', 'gösterilen', 'emniyetli', 'değiştirilmesi', 'alanlarının', 'sahasına', 'vadisi', 'vadisinin', 'ilan', 'edilmesi', 'çevresi', 'çevresinin',
                'köyleri', 'arası', 'yeraltisuyu', 'sahasi', 'tarih', 'sayılı', 'ilişkin', 'karakteristiklerini', 'tespit', 'eden', 'metnin', 'maddesi', 'değiştirilmesine'}
def tr_kucuk(s):
    return s.replace('İ', 'i').replace('I', 'ı').lower()
IL_ADLARI = {tr_kucuk(x) for x in iller + list(ESKI_AD)}
ILCE_ADLARI = {tr_kucuk(x) for x in ILCE}

def baslik_uyar_mi(baslik, pencere):
    """Fihrist başlığı bu pencereye ait mi? Başlığın il dışı ayırt edici sözcüklerinden biri pencerede
    geçmeli; ilçe olmayan yer adı (ova/köy adı) varsa onlardan biri aranır (ilçe adları başka
    kararnamelerde de geçebilir)."""
    sozler = [w for w in re.findall(r'[A-Za-zÇĞİÖŞÜçğıöşüâîû]{4,}', baslik)
              if tr_kucuk(w) not in BASLIK_DURAK and tr_kucuk(w) not in IL_ADLARI]
    ozel = [w for w in sozler if tr_kucuk(w) not in ILCE_ADLARI]
    aday = ozel or sozler
    kucuk = tr_kucuk(pencere)
    return bool(aday) and any(tr_kucuk(w) in kucuk for w in aday)

def baslik_genel_mi(baslik):
    """Yer adı taşımayan başlık ("Yeraltısuyu İşletme Sahası Hakkında Karar")."""
    return not [w for w in re.findall(r'[A-Za-zÇĞİÖŞÜçğıöşüâîû]{4,}', baslik) if tr_kucuk(w) not in BASLIK_DURAK]

OLUMSUZ = re.compile(r'kütü|nüfus|doğumlu|(?<![A-Za-zÇĞİÖŞÜçğıöşü])(?:oğlu|kızı)(?![A-Za-zçğıöşü])|sanık|davalı|davacı|[Mm]ahkeme|ilanen|tebliğ olunur|vekil|mirasçı|[Ss]eçim|Bucağına bağlı|bucağına bağlı|köyünün adı|adının|olarak değiştiril')
# Harita künyesi: "… YERALTISULARI DAİRESİ BAŞKANLIĞI ANKARA FETHİYE OVASI" — Ankara DSİ merkezinin yeridir.
HARITA_KUNYESI = re.compile(r'(?:BAŞKANL[IİI]?[ĞG][IİI]|BAŞKANLIĞI|BAŞKANLİĞİ|MÜDÜRLÜĞÜ|DAİRESİ)\s*$')
def olumsuz_mu(metin, m):
    if HARITA_KUNYESI.search(metin[max(0, m.start() - 40): m.start()]): return True
    # Kişi adı: önünde baş harf var ("Bakanı S. BİNGÖL", "S. Aydın").
    if re.search(r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])[A-ZÇĞİÖŞÜ]\s?[.-]\s*$', metin[max(0, m.start() - 4): m.start()]): return True
    # DSİ bölge müdürlüğünün adı ("Devlet Su İşleri Adana VI nci Bölge Müdürlüğü") ilin kendisi değildir.
    if re.match(r'\s+(?:[IVX]+\s*\.?\s*(?:n[cç][ıiuü])?\s*Bölge|Bölge|Devlet Su İşleri)', metin[m.end(): m.end() + 30]): return True
    if re.search(r'(?:Su İşleri|DSİ)\s+$', metin[max(0, m.start() - 15): m.start()]): return True
    return bool(OLUMSUZ.search(metin[max(0, m.start() - 150): m.end() + 150]))

def kanit(metin, m):
    return '…' + metin[max(0, m.start() - 50): m.end() + 30].strip() + '…'

# Eski gazete sayfalarında birden çok karar/ilan yan yanadır (iki sütunlu dizgi). Pencere bu
# işaretlerden bölünür; il yalnız yeraltı suyu sözcüğü taşıyan bölümlerde aranır (10.10.2026:
# İçişleri köy adı kararları, nüfus ilanları ve afyon ekim kararı il kirletiyordu).
SINIR_TARIFI = re.compile(r'Batıdan\s*:|Doğudan\s*:|Kuzeyden\s*:|Güneyden\s*:')
BOLUM_SINIRI = re.compile(r'(?=Karar Sayısı\s*:|Karar Sayısı\s*\d|İçişleri Bakanlığından|Bakanlığından\s*:|Müdürlüğünden\s*:|Başkanlığından\s*:|'
                          r'Mahkemesinden\s*:|Hakimliğinden\s*:|Hâkimliğinden\s*:|Savcılığından\s*:|Rektörlüğünden\s*:|İLANLAR|İLÂNLAR|Sayısı\s*:\s*\d{3,5}\s+1\s*[—-])')
def ilgili_bolumler(pencere):
    return [b for b in BOLUM_SINIRI.split(pencere) if ANAHTAR.search(b) or len(ALAN_SOZ.findall(b)) >= 2 or SINIR_TARIFI.search(b)]

# Ova/vadi zinciri: "İzmit - Sapanca - Gölcük Ovaları", "Hoyran ve Gelendost - Yalvaç Ovaları",
# "Dörtyol - Yeşilkent (Erzin) ovaları". Zincirdeki ilçe adları hepsi aynı ile düşüyorsa o il;
# düşmüyorsa yalnız zincirin İLK adı ilçe olarak okunur (aradakiler köy/kasaba adı olabilir:
# "Korkuteli - Bozova - Kestel - Çeltikçi", "Ayvalık ve Altınova"). Zincir bir il adıyla başlıyorsa
# ("Niğde - Gölcük ovası") içindeki adlar o ilin yerleridir; ilçe dizinine bakılmaz.
JETON = r"[A-ZÇĞİÖŞÜ][A-Za-zÇĞİÖŞÜçğıöşüâîû'’]+(?:\s+[A-ZÇĞİÖŞÜ][A-Za-zÇĞİÖŞÜçğıöşüâîû'’]+){0,2}(?:\s*\([^)]{1,30}\))?"
ZINCIR_SON_ILCE = r'(?:Ova|ova|OVA|Vadi|vadi|VADİ|Sahil|sahil|SAHİL)'
ZINCIR = re.compile(r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])(' + JETON + r'(?:\s*(?:[-–]|,|\bve\b)\s*' + JETON + r'){0,6})\s*(?:sahil\s+|Sahil\s+|SAHİL\s+)?' + ZINCIR_SON_ILCE)
ILCE_ACIK = re.compile(r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])(' + JETON + r')\s+(?:İlçe|ilçe|İLÇE|Kaza|kaza|KAZA)[A-Za-zÇĞİÖŞÜçğıöşü]*')

def _jeton_adi(j):
    return re.sub(r"\s*\(.*$", '', j).strip("'’ ")

def _ilce_ili(ad):
    for k in (ad, ad.title() if ad.isupper() else ad):
        for anahtar in (k, k.replace('I', 'ı') if False else k):
            if anahtar in ILCE and len(ILCE[anahtar]) == 1 and anahtar not in ILCE_YASAK and len(anahtar) >= 4:
                return ILCE[anahtar][0], anahtar
    # büyük harfli metin: TÜİK adlarıyla büyük harf karşılaştırması
    for ilce_adi, ilsz in ILCE.items():
        if buyuk(ilce_adi) == ad and len(ilsz) == 1 and ilce_adi not in ILCE_YASAK and len(ilce_adi) >= 4:
            return ilsz[0], ilce_adi
    return None, None

def _il_adi(ad):
    for il in iller + list(ESKI_AD):
        if ad == il or ad == buyuk(il):
            return ESKI_AD.get(il, il)
    return None

def ilce_kanitlari(metin):
    """{il: kanıt} — açık "X İlçesi/Kazası" ya da ova zinciri kuralı."""
    out = {}
    for m in ILCE_ACIK.finditer(metin):
        if olumsuz_mu(metin, m): continue
        il, ad = _ilce_ili(_jeton_adi(m.group(1)).split()[-1])
        if il: out.setdefault(il, f'ilçe {ad} ({il}, TÜİK dizini): ' + kanit(metin, m))
    for m in ZINCIR.finditer(metin):
        if olumsuz_mu(metin, m): continue
        # Zincirin ortasından başlanmaz ("…Manisa - Muradiye - Göksu": OCR bitişik yazınca Manisa kaçıyordu).
        if re.search(r'(?:[-–,]|\bve)\s*$', metin[max(0, m.start() - 4): m.start()]): continue
        jetonlar = [_jeton_adi(j) for j in re.split(r'\s*(?:[-–]|,|\bve\b)\s*', m.group(1)) if j.strip()]
        # Zincir bir il adıyla başlıyorsa (ilk jetonun herhangi bir sözcüğü il) içindeki adlar o ilin yerleridir.
        if not jetonlar or any(_il_adi(w) for w in jetonlar[0].split()):
            continue
        # Nehir/ova sıfatıyla başlayan ad ("Büyük Menderes", "Aşağı Susurluk") ilçe değildir; düşer, sonraki jeton ilk sayılır.
        while jetonlar and re.match(r'(?:Büyük|Küçük|Aşağı|Yukarı|Orta|Aş\.|BÜYÜK|KÜÇÜK|AŞAĞI|YUKARI|ORTA)\b', jetonlar[0]):
            jetonlar = jetonlar[1:]
        if not jetonlar: continue
        ham = [j for j in re.split(r'\s*(?:[-–]|,|\bve\b)\s*', m.group(1)) if j.strip()]
        ham = ham[len(ham) - len(jetonlar):]
        takma = [(re.search(r'\(([^)]+)\)', j).group(1).strip() if re.search(r'\(([^)]+)\)', j) else '') for j in ham]
        eslesen = []
        for j, tk in zip(jetonlar, takma):
            il_, ad_ = _ilce_ili(j)
            if not il_ and tk: il_, ad_ = _ilce_ili(tk)
            eslesen.append((j, il_, ad_))
        eslesen = [(j, il, ad) for j, il, ad in eslesen if il]
        if not eslesen: continue
        iller_kume = {il for _, il, _ in eslesen}
        if len(iller_kume) == 1:
            secilen = eslesen
        elif eslesen[0][0] == jetonlar[0]:
            secilen = [eslesen[0]]
        else:
            continue
        for _, il, ad in secilen:
            out.setdefault(il, f'ilçe {ad} ({il}, TÜİK dizini; ova zinciri): ' + kanit(metin, m))
    return out

def il_bul(blok, pdf=False, basliklar=()):
    """(iller, kaynak, kanitlar) döner; kanitlar = {il: metin parçası}."""
    kanitlar = {}
    kaynaklar = []
    if not pdf:
        bas = saha_adi(blok)
        for il, d in IL_DESEN.items():
            if bas and d.search(bas): kanitlar.setdefault(ESKI_AD.get(il, il), 'ilan başlığı: ' + bas[:120])
        if kanitlar: return sorted(kanitlar), 'ilan başlığında il adı', kanitlar
    bolumler = ilgili_bolumler(blok) if pdf else [blok[:1500]]
    for b in bolumler:
        for il, d in IL_DESEN_PDF.items():
            m = next((x for x in d.finditer(b) if not olumsuz_mu(b, x)), None)
            if m: kanitlar.setdefault(ESKI_AD.get(il, il), kanit(b, m))
    if kanitlar: kaynaklar.append('ilan metninde il adı (idari bağlamda)')
    if pdf:
        # RG fihrist başlığı da resmî metindir; yalnız bu pencereye ait olduğu görülen başlık uygulanır.
        for bsl in basliklar:
            if not baslik_uyar_mi(bsl, blok): continue
            for il, d in IL_DESEN_BASLIK.items():
                if any(not olumsuz_mu(bsl, x) for x in d.finditer(bsl)):
                    if ESKI_AD.get(il, il) not in kanitlar: kaynaklar.append('RG fihrist başlığı')
                    kanitlar.setdefault(ESKI_AD.get(il, il), 'RG fihrist başlığı: ' + bsl[:120])
    # İlçe kanıtı: arşivde (çok kararnameli sayfa) her zaman birleştirilir; güncel ilanda yalnız il yoksa.
    if pdf or not kanitlar:
        alan = ' '.join(bolumler) if pdf else blok[:3000]
        ik = ilce_kanitlari(alan)
        if not pdf and not ik:
            for ad, d in ILCE_DESEN_SERBEST.items():
                m = d.search(alan)
                if m and ad not in ILCE_YASAK and not olumsuz_mu(alan, m): ik.setdefault(ILCE[ad][0], f'ilçe {ad} ({ILCE[ad][0]}, TÜİK dizini; ilan metni): ' + kanit(alan, m))
        yeni = {il: k for il, k in ik.items() if il not in kanitlar}
        if yeni:
            kanitlar.update(yeni)
            kaynaklar.append('ilan metnindeki ilçe adı → TÜİK ilçe-il dizini')
    if kanitlar:
        return sorted(kanitlar), ' + '.join(dict.fromkeys(kaynaklar)), kanitlar
    return [], 'doğrulanamadı (ilan metninde il/ilçe adı yok)', {}

def durum_bul(blok, baslik=''):
    kosullu = None
    for m in KISIT.finditer(blok):
        cevre = blok[max(0, m.start() - 160): m.end() + 60]
        if not KISIT_BAGLAM.search(cevre): continue
        # Cümle başından eşleşmeye: "rezerve erişildiğinde … yasaklanmıştır" KOŞULLU kuraldır (rezerv dolunca
        # uygulanır) — fiilî kapatma sayılmaz. "erişildiğinden" (dolduğu için) fiilîdir (10.10.2026).
        sinirlar = [x.end() for x in CUMLE_SINIRI.finditer(blok, max(0, m.start() - 500), m.start())]
        bas = sinirlar[-1] if sinirlar else max(0, m.start() - 400)
        cumle = blok[bas: m.end()]
        if KOSUL.search(cumle):
            kosullu = kosullu or f"[koşullu: {KOSUL.search(cumle).group(0)} … {m.group(0)}] " + cevre.strip()
            continue
        return 'tahsise kapatma/kısıt', f"[{m.group(0)}] " + cevre.strip()
    m = KISIT_NEDENSEL.search(blok)
    if m:
        return 'tahsise kapatma/kısıt', f"[nedensel: {m.group(1)} … {m.group(2)}] " + blok[max(0, m.start() - 80): m.end() + 20].strip()
    if re.search(r'tespit edilmiştir|tesbit edilmiştir|belirlenmiştir|ilan edilmiştir|işletme sahası olarak|kabulü|kabul ve ilan|değiştiril|genişletil|sınırları|kararlaştırılmıştır|Kararname|KARARNAME|Karar Sayısı|kabul edilmiştir', blok, re.I):
        return 'işletme sahası ilanı/değişikliği', (kosullu or '')
    if baslik and re.search(r'İşletme Sahası|işletme sahası', baslik) and re.search(r'Kabul|İlan|Hakkında|Değiştir', baslik):
        return 'işletme sahası ilanı/değişikliği', 'RG fihrist başlığı: ' + baslik[:160]
    return 'belirsiz (bloktan sınıflanamadı)', ''

def saha_adi(blok):
    m = BASLIK.search(blok[:400])
    if m:
        return re.sub(r'\s+', ' ', m.group(0)).strip()[:200]
    return ''

ILSIZ_NOT_HAVZA = re.compile(r'([A-ZÇĞİÖŞÜ][a-zçğıöşü]+|[A-ZÇĞİÖŞÜ]{3,})\s+(?:Havza|HAVZA)')
def il_notu(metin):
    """İl adı geçmeyen kayıt için gösterim notu (sahip kararı B, 10.10.2026): sınır ekli haritadaysa
    "<Havza> havzası — il belirtilmemiş; sınır kararnamenin ekli haritasında"."""
    if not re.search(r'(?:[Ee]kli|[İi]lişik)\s+harita', metin): return ''
    m = ILSIZ_NOT_HAVZA.search(metin)
    if not m: return 'il belirtilmemiş; sınır kararnamenin ekli haritasında'
    ad = m.group(1)
    ad = ad.title() if ad.isupper() else ad
    return f'{ad} havzası — il belirtilmemiş; sınır kararnamenin ekli haritasında'

def baslik_ili(baslik):
    """Fihrist başlığından il: il adı (Türkçe ek toleranslı) ya da ilçe kuralı (açık ilçe / ova zinciri)."""
    kanitlar = {}
    for il, d in IL_DESEN_BASLIK.items():
        if any(not olumsuz_mu(baslik, x) for x in d.finditer(baslik)): kanitlar.setdefault(ESKI_AD.get(il, il), 'RG fihrist başlığı: ' + baslik[:120])
    if kanitlar: return kanitlar, 'RG fihrist başlığında il adı'
    ik = ilce_kanitlari(baslik)
    if ik: return ik, 'RG fihrist başlığındaki ilçe adı → TÜİK ilçe-il dizini'
    return {}, ''

def main():
    urls = [u.strip() for u in open(os.path.join(HAM, 'urls.txt')) if u.strip()]
    kunye = {}
    for f in ('veri/potansiyel/isletme-sahalari.json', 'veri/potansiyel/isletme-sahalari-ek.json'):
        d = json.load(open(f))
        for r in d['kayitlar']:
            k = kunye.setdefault(r.get('kaynak_url'), {'rg_tarih': r.get('rg_tarih'), 'rg_sayi': r.get('rg_sayi'), 'eski': []})
            k['eski'].append({'dosya': os.path.basename(f), 'il': r.get('il'), 'durum': r.get('durum'), 'saha_adi': (r.get('saha_adi') or '')[:120]})
    kayitlar, eksik_dosya, bloksuz, elenen = [], [], [], []
    for u in urls:
        ad = u.rsplit('/', 1)[-1]
        yol = os.path.join(HAM, f"{hashlib.sha1(u.encode()).hexdigest()[:8]}-{ad}")
        if not os.path.exists(yol): eksik_dosya.append(u); continue
        if yol.lower().endswith('.pdf'):
            tx = pdf_metin(yol); bl = bloklar_pdf(tx); tur = 'rg-arsiv-pdf'
        else:
            tx = html_metin(open(yol, 'rb').read()); bl = bloklar_html(tx); tur = 'rg-ilan-html'
        if not bl: bloksuz.append(u); continue
        k = kunye.get(u, {})
        for b in bl:
            if not dsi_ilani_mi(b):
                elenen.append({'kaynak_url': u, 'neden': 'pencere DSİ ilanı değil (alan sözcüğü < 4)', 'pasaj': b[:160]}); continue
            basliklar = [e.get('saha_adi') for e in k.get('eski', []) if e.get('dosya') == 'isletme-sahalari.json' and e.get('saha_adi')]
            baslik = ' '.join(basliklar)
            il, il_kaynagi, il_kanit = il_bul(b, pdf=(tur == 'rg-arsiv-pdf'), basliklar=basliklar)
            durum, dayanak = durum_bul(b, baslik)
            kayitlar.append({
                # Saha adı: ilan bloğundaki başlık; yoksa YALNIZ bu pencereye ait olduğu görülen RG fihrist başlığı.
                'saha_adi': saha_adi(b) or next((x for x in basliklar if baslik_uyar_mi(x, b)), ''),
                'il': il, 'il_kaynagi': il_kaynagi, 'il_kanit': il_kanit,
                'il_notu': '' if il else il_notu(b),
                'durum': durum, 'durum_dayanak': dayanak,
                'rg_tarih': k.get('rg_tarih'), 'rg_sayi': k.get('rg_sayi'),
                'kaynak_url': u, 'kaynak_turu': tur,
                # Gösterilen alıntı ilk 'işletme sahası' geçişinin hemen öncesinden başlar (sayfa başı artığı değil).
                'pasaj': b[max(0, (ANAHTAR.search(b).start() if ANAHTAR.search(b) else 0) - 300):][:900],
                'eski_kayitlar': k.get('eski', []),
                '_tam': b,
            })
    # Fihrist başlık kayıtları (isletme-sahalari.json, 109): il eski yöntemle (başlık + ilçe dizini) atanmıştı;
    # aynı kurallarla yeniden türetilir. Başlıkta il yoksa aynı sayıda bu başlığa ait olduğu görülen ilan
    # penceresinin illeri alınır; o da yoksa il'siz kalır (il_notu ile).
    basliklar = []
    for r in json.load(open('veri/potansiyel/isletme-sahalari.json'))['kayitlar']:
        bsl = re.sub(r'\s+', ' ', r.get('saha_adi') or '').strip()
        kanit_b, kaynak_b = baslik_ili(bsl)
        if not kanit_b:
            genel = baslik_genel_mi(bsl)
            for k in kayitlar:
                if k['kaynak_url'] == r.get('kaynak_url') and k['il'] and (genel or baslik_uyar_mi(bsl, k['_tam'])):
                    for il_, kn in k['il_kanit'].items(): kanit_b.setdefault(il_, 'aynı sayıdaki ilan metni: ' + kn)
            if kanit_b: kaynak_b = 'aynı gazete sayısındaki ilan metni'
        basliklar.append({
            'saha_adi': bsl, 'il': sorted(kanit_b), 'il_kaynagi': kaynak_b or 'doğrulanamadı (başlıkta ve ilan metninde il/ilçe adı yok)',
            'il_kanit': kanit_b, 'il_notu': '' if kanit_b else next((k['il_notu'] for k in kayitlar if k['kaynak_url'] == r.get('kaynak_url') and k['il_notu']), '') or il_notu(' '.join(k['_tam'] for k in kayitlar if k['kaynak_url'] == r.get('kaynak_url'))),
            'eski_il': r.get('il'), 'durum': r.get('durum'), 'rg_tarih': r.get('rg_tarih'), 'rg_sayi': r.get('rg_sayi'),
            'kaynak_url': r.get('kaynak_url'), 'mevzuat_turu': r.get('mevzuat_turu'),
        })
    for k in kayitlar: k.pop('_tam', None)
    cikti = {
        'uretim_tarihi': BUGUN,
        'kaynak': 'T.C. Resmî Gazete — ilan sayfaları (ilanlar/eskiilanlar) ve arşiv PDF (arsiv/*.pdf); metin kaynaktan yeniden ayrıştırıldı',
        'yontem': __doc__.strip(),
        'il_listesi_kaynagi': 'src/data/tr-iller.json (81 il) + tarihî adlar (İçel→Mersin, Afyon→Afyonkarahisar, Urfa→Şanlıurfa, Maraş→Kahramanmaraş, Antep→Gaziantep)',
        'ilce_dizini_kaynagi': 'veri/potansiyel/ilce-il-dizini.json (OSM, TÜİK ADNKS 31.12.2021 listesiyle çapraz doğrulanmış 27.07.2026); yalnız tek ile ait ilçe adları',
        'sayimlar': {
            'url': len(urls), 'indirilemeyen': len(eksik_dosya), 'bloksuz_sayfa': len(bloksuz), 'kayit': len(kayitlar),
            'il_metinden': sum(1 for r in kayitlar if r['il_kaynagi'].startswith('ilan metninde il')),
            'il_ilceden': sum(1 for r in kayitlar if r['il_kaynagi'].startswith('ilan metnindeki ilçe')),
            'il_dogrulanamadi': sum(1 for r in kayitlar if not r['il']),
            'elenen_pencere': len(elenen),
            'baslik_kayit': len(basliklar),
            'baslik_il_dogrulanamadi': sum(1 for b in basliklar if not b['il']),
            'baslik_il_eskiden_farkli': sum(1 for b in basliklar if sorted([x for x in (b['eski_il'] if isinstance(b['eski_il'], list) else []) ]) != b['il']),
            'durum': dict(collections.Counter(r['durum'] for r in kayitlar)),
        },
        'indirilemeyen': eksik_dosya, 'bloksuz_sayfa': bloksuz, 'elenen_pencere': elenen,
        'basliklar': basliklar,
        'kayitlar': kayitlar,
    }
    hedef = sys.argv[1] if len(sys.argv) > 1 else 'veri/potansiyel/isletme-sahalari-v2.json'
    json.dump(cikti, open(hedef, 'w'), ensure_ascii=False, indent=1)
    print(json.dumps(cikti['sayimlar'], ensure_ascii=False))

if __name__ == '__main__':
    main()
