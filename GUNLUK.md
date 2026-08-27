# GUNLUK.md — seans notları

## 27.08.2026 (11. seans, üçüncü tur) — KARAR DOSYASI KAPATMA (tek geçiş)

Rapor: `rapor/27-08-kapatma.md` · Karar: KARARLAR **§35** · Durum tablosu:
`rapor/26-08-denetim-KARARLAR-BEKLEYEN.md`.

Kullanıcı talimatı "sorma, düzelt" idi. **23 kalem uygulandı**
(K4·K5·K6·K11·K14·K15·K16·K17·K18·K19·K20·K21·K22·K23·K24·K27·K28·K30·
K31·K33·K34·K35·K36·K38 + K7-A..E), **8 kalem** dört istisna sınıfı
gereği KULLANICI KALEMİ'ne ayrıldı, **3 kalem** ölçümle gerekçelendirilip
açık bırakıldı (K26 · K36-unsafe-inline · K37-zaten-geri-çekilmiş).

**DERS 1 — kendi düzeltmen regresyon üretebilir; sistemi koş.** İki
regresyon doğdu, ikisini de sağlık `--tam` yakaladı: (a) K23'ün eklediği
skip-link **124×42 px** çıktı, 44 px dokunma eşiğinin altında — 5 sayfada
ihlal +1; (b) K11'in ad ayıklaması `Aras / Արաքս` kaydını "Aras" yapınca
OSM'deki mevcut "Aras" ile `<title>` tekrarı doğdu. İkisi de onarıldı.
Kural: görünür öğe ekleyen her düzeltme, eklediği öğeyi kendi ölçütleriyle
(dokunma hedefi, başlık benzersizliği) tekrar ölçmelidir.

**DERS 2 — denetim kaydı da yanlış olabilir; ölç.** Karar dosyası
`menu.ts` için "repo genelinde 0 referans" diyordu; ölçüm **9 referans**
buldu (silinseydi menü kırılırdı). `scrub-engine.js` "erişilemez"
sanılıyordu — **2 referans**. `TELEGRAM_CHAT_ID` sızıntısı iddiası:
belgelerde yalnız DEĞİŞKEN ADI geçiyor, kanal kimliği hiçbir yerde yok.
Üç kayıt da ölçümle düzeltildi.

**DERS 3 — doğrulanamayan adres yazılmaz.** K19'da otorite bağı
eklenirken URL'ler sunucudan sınandı: OSM copyright ve Natural Earth 200
verdi → link eklendi. mevzuat.gov.tr ve Resmî Gazete HTTP 000 verdi →
**link EKLENMEDİ**, yerine veri künyesindeki doğrulanmış yayım tarihi
basıldı. Aynı disiplin K38'de de işledi: http ve https AYNI yanıtı
verdiği ölçüldükten sonra normalleştirme yapıldı.

**HARCANAN ZAMAN NOTU:** deploy bekleme döngüsü `surum.json`'da olmayan
bir anahtarı (`surum`) okuduğu için 10 dakika boşa döndü; dosyadaki
alanlar `commit`/`kisa`. Bekleme döngüsü yazarken hedef alanın varlığı
önce doğrulanmalı.

## 27.08.2026 (11. seans, ikinci tur) — K7 UYGULAMASI (a)+(b)

Rapor: `rapor/27-08-K7-uygulama.md` · Karar: KARARLAR **§34** · Brief:
`cikti/brief/k7-uygulama{,-duzeltilmis}.md` (denetçi 1 ENGEL + 2 UYARI →
yalnız ekleme ile TEMİZ).

`/ilce-sorgu/` sayfasından veri karşılığı olmayan üç çıktı ve hesapları
kaldırıldı (derinlik tahmini · akifer türü · "Su Çıkma Olasılığı %");
kalan çıktıların künyesi türetme yolunu söylüyor. (c) noindex
uygulanmadı — sayfa yayında, 521 iç link korundu. `ort_egim` 948/948
null olduğu hâlde basılan "0,0°" → **"veri yok"**.

Ölçüm: `doygunluk`·`akifer`·`olasılığı`·`\bTWI\b`·`\bAHP\b`·`ahp-`·
`Alüvyon`·`Karstik`·`Granit` → HTML **0** + JS chunk **0** (taban: 3/6,
4/1, 1/3, 1/3, 10/0, .../1). `Copernicus` **4** (kaynak gerçek,
silinmedi). Sayfa 523, sitemap 519 — taban ile küme-eş.

**DÜŞMAN GEÇİŞİ DERSİ (yeni kural adayı):** "TWI dist'te 0 olmalı"
şartı büyük/küçük harf duyarsız aramayla **her sayfada yanlış-pozitif
verir** — `<meta name="twitter:card">` içindeki `twi` eşleşir. Ölçüm
tabanla doğrulanıp bitti-tanımı **kelime sınırlı + harf duyarlı**
(`\bTWI\b`) hâle getirildi. DERS: kısa büyük-harfli kısaltma
(TWI/AHP/DSİ/RG) üzerine kurulu "sıfır olmalı" şartlarında arama deseni
her zaman kelime sınırlı yazılır; aksi hâlde şart ya hiç geçmez ya
sahte geçer.

**İKİNCİ DERS (D2, kendi metnimi kendi ölçütümle denetleme):**
`morfoloji.json`'un dürüst etiketi *"akifer varlığının kanıtı değildir"*
cümlesini içeriyor. Bu cümleyi yeni şerhe alıntılasaydım kendi
"akifer = 0" şartımı ihlal ederdim. K1'de aynı sınıf hata (yeni yazılan
metinde eski kusurun tekrarı) yaşandığı için yeni her cümle yazıldıktan
sonra bitti-tanımına karşı tekrar tarandı.

K7 uygulamasından **6 yeni karar kalemi** doğdu ve
`rapor/26-08-denetim-KARARLAR-BEKLEYEN.md` §6'ya yazıldı: **K7-A** kalan
çıktı hâlâ "su çıkma ihtimali" diyor (öneri metniyle) · **K7-B** hiçbir
eşik geçilmediğinde yer tutucu bölge basılıyor (Ankara/Polatlı ölçümü) ·
**K7-C** öz-cevaptaki "sondaj" · **K7-D** 1 CTA'daki "sondaj analizi" ·
**K7-E** `jrc-yuzey-suyu.json` artık tümüyle ölü · **K7-F** 2b taraması
temiz.


## 26.08.2026 (10. seans) — ALTYAPI KUYRUĞU KAPATMA (üç faz)

Rapor: rapor/26-08-kuyruk-kapatma.md · Karar: KARARLAR §33. BÜYÜK rejim
(denetçi ilk tur 1 ENGEL + 3 UYARI → yalnız ekleme ile 0 ENGEL).
Faz A: md17 varlık-kaçışı onarıldı (falsifikasyon 4/4 + körleştirme
sınaması; commit d4c4f86). Faz B: çıkış-kaydı sözleşmesi node+python'a
taşındı, 9/9 betik bağlandı, yedek/bekçi körlükleri kapandı (B6/B7/B8
falsifikasyonları ham çıktıyla). Faz C: 4 kalem karara bağlandı.

**HATA KAYDI + DERS (yeniden doğdu, aynı gün yakalandı):** python
betiğine eklenen `from cikis_kaydi import ...` yalnız betik doğrudan
çalıştırılınca işliyordu; altin-ornek.mjs betiği `python3 -c` ile BAŞKA
çalışma dizininden yükleyince ModuleNotFoundError → md23 KIRMIZI (16:16
--tam). DERS: bir betiğe modül bağımlılığı eklerken betiğin TÜM çağrılma
yolları (doğrudan · cron · başka araçtan gömülü) ölçülmeli; sys.path
güvencesi (`sys.path.insert(0, dirname(__file__))`) bu depoda python
import'larının ön şartıdır. Sağlık sistemi kendi işini yaptı: hatayı
--tam koşumu yakaladı, elle fark edilmedi.

## 26.08.2026 (9. seans) — ASTRO 5 → 7 YÜKSELTMESİ: keşif, düzeltme, YAYIN

Raporlar: rapor/26-08-astro7-faz1.md (build'i geçirmek) +
rapor/26-08-astro7-faz2-yayin.md (yayına alma). Karar: KARARLAR §32.
İki BÜYÜK iş rejimi ayrı ayrı uygulandı; Faz 1 denetçisi 1 ENGEL + 4
UYARI, Faz 2 denetçisi 0 ENGEL + 3 UYARI verdi, ikisi de yalnız EKLEME
ile kapatıldı. Sonuç: **astro@7.2.7 canlıda** (commit eaa951d).

**ÜÇ KUSUR, ÜÇ FARKLI CİNS.** Yükseltmenin bize çıkardığı iş tek bir
"breaking change" değildi:
1. *Sert hata* — ENOENT. `vitrin.js`/`kullanilanlar.js` proje kökünü
   `import.meta.url`'den türetiyordu; Astro 7 bundle'ı
   `dist/.prerender/chunks/`e taşıyınca kök bir seviye kaydı ve
   `dist/data/arsiv/baraj` diye olmayan bir yol doğdu. Build düştü,
   yani KENDİNİ GÖSTERDİ.
2. *Sessiz hata* — boşluk-yutma. Build GEÇİYORDU ama 453 sayfada
   kelimeler bitişmişti ("Havzasırezerv"). Hiçbir test, hiçbir kalem
   bunu yakalamazdı; yalnız referansla metin kıyası yakaladı.
3. *Kararsızlık* — getCollection sırası. Ne hata ne bozulma; sıra
   değişti.

**ASIL DERS: REFERANS ALMADAN YÜKSELTME YAPILMAZ.** 2 numaralı kusur
build'i geçiriyordu. "Build geçti, 522 sayfa üretildi, sitemap 519"
diyerek push edilseydi 453 sayfa bitişik kelimelerle yayına girecekti.
Yakalayan şey testler değil, işin İLK adımında alınan Astro 5 dist
kopyasıydı (brief bunu "kıyasın ön koşulu, atlanamaz" diye yazmıştı;
doğru yazılmış).

**VEKİL KRİTER TUZAĞI — "diff" ölçmek istediğim şeyi ölçmüyordu.**
İlk kıyas denemesi satır-diff'iydi: 5 sayfada 45-113 satır fark çıktı,
hepsi minify üslubu ve hash'li dosya adlarıydı. Sayısı büyük ama
anlamı sıfır. Ölçmek istediğim "içerik kaybı var mı"ydı; onu ölçmek
için üç katman ayrıldı — görünür metin, JSON-LD, script. Ayrılınca
gerçek sinyal göründü: JSON-LD 523/523 bit-eşit, metin farkı 453
sayfa. Aynı ham veri, doğru kriterle okununca teşhis oldu.

**FALSİFİKASYON, KORUMAYI HAKLI ÇIKARMAK YERİNE ONU ÇÜRÜTTÜ.** Sıra
değişimini "Astro 5 davranışına geri döndürmek" için önce havza-no
sırası denendi (referansla eşleşiyordu) — 22 sayfada tutmadı. Sonra
asıl soru soruldu: *Astro 5 gerçekten kararlı mıydı?* Deney: yamalar
stash'lendi, Astro 5 yeniden kuruldu, art arda iki build alındı. A=B
ama ikisi de sabahki referanstan FARKLI. Yani korunmaya çalışılan
"Astro 5 sırası" diye bir şey yoktu — store durumundan gelen tarihsel
bir kazaydı. Doğru çözüm taklit değil, eşitliği açıkça bozmak oldu.
KARARLAR §32/2: getCollection dönüş sırasına yaslanmak yasak.

**KULLANICI KARARI KENDİ GEREKÇESİNİ AŞTI.** konya-kapali komşu
listesinde Burdur yerine Akarçay görünmesi kullanıcıya soruldu; kabul
edildi (resmî komşu listesinde Burdur yok). Yayın doğrulamasında
şu ölçüldü: **yükseltme ÖNCESİ canlı sayfa da Akarçay gösteriyordu.**
Cloudflare'ın Astro 5 build'i benim yerel referansımdan farklı sıra
üretmiş. Yani karar hiçbir sayfayı değiştirmedi — zaten yayında olan
davranışı onayladı. Yerel referansı "canlının aynısı" sanmak bir
varsayımdı; ölçülünce yanlış çıktı. (NOT.txt'ye şerh olarak işlendi.)

**DENETLENEMEZ ŞART, DAHA GÜÇLÜ KANITA ÇEVRİLDİ.** Faz 2 briefi "build
log'unda Node 22'yi göster" diyordu. Ölçüldü: bu makinede Cloudflare
build log'u okunamıyor (yalnız CF_DEPLOY_HOOK var, API token yok).
Şart terk edilmedi: astro@7'nin bin'i `>=22.12.0` istiyor ve düşük
sürümde HİÇ BUILD ETMEDEN exit 1 veriyor. Sahte `process.versions.node
= 20.11.0` ile kapı yerelde falsifiye edildi. Dolayısıyla canlıda YENİ
çıktı üretilmiş olması Node 22'nin kanıtı — log bir beyandır, bu bir
kapı testidir. KALICI ÖN KOŞUL: NODE_VERSION=22 silinirse build kırılır.

**YAN BULGU: yerel build ile canlı build aynı sayıyı basmıyor.**
/arsiv/ ve /kullanilanlar/ baraj dosya sayısı yerelde 946, canlıda 903.
Kök neden: 43 dosya `data/arsiv/baraj/log/*.log` ve bilinçli gitignore'lu
(F4-7 bulgusu). Astro'dan bağımsız, yükseltmeden önce de böyleydi —
ama bu iş olmasa görülmezdi. Kıyas tabanı temiz git worktree build'ine
eşitlendi; sonra 5/5 sayfada metin + JSON-LD birebir tuttu.
SIRADAKILER'e karar kalemi olarak yazıldı, ONARILMADI.

**Yayın ölçümleri:** push 13:18Z → deploy 13:19:28Z (~45 sn) · 5 sayfa
içerik imzası 5/5 · /arsiv/ canlıda 23 pasaj / 24 tarih / 53 li
(birebir) · boşluk canlıda düzgün · apex 200 · www 301 → apex tek hop.

**SAĞLIK KIRMIZI VERDİ — VE KIRMIZI HAKLI DEĞİLDİ.** `--tam` sonucu:
kırmızı 1 · sarı 1 · geçti 21; taban taşıyan yedi kalemin (md14 görsel
G1-G6, md21, md15, md16, md18, md23, md11) hepsi geçti, **taban
gerilemesi 0**. Kırmızı md17'den geldi: 5 "ölü" dış bağlantı.
Log satırındaki URL kesik görünüyordu ("...product/product&") ve ilk
akla gelen "yükseltme URL'leri bozdu" oldu. Belirtiden nedene
atlanmadı: dist'teki tam URL okundu (`&amp;product_id=10069` — kesik
değil, log 60 karakterde kırpıyor), sonra referansla sayıldı —
**Astro 5: ham `&` 376 / `&amp;` 0 · Astro 7: ham `&` 0 / `&amp;` 376**.
Astro 7 `href` içindeki `&`'i kaçırıyor, ki DOĞRU HTML budur; Astro 5
eksik kaçırıyormuş. Sunucu ölçüldü: ham `&` → **200**, `&amp;` → **404**.
Aracın kodu okundu (`kapsam-kalemleri.mjs:37`): ham HTML üzerinde regex,
**varlık kaçışını çözmüyor**. Son olarak gerçek kullanıcı ölçüldü —
canlı sayfada headless tarayıcı DOM'unda href ham `&`'e çözülüyor ve
istek **200** dönüyor.

Yani araç, yıllardır HTML'in EKSİK kaçırılmasına bağımlıymış; site
doğrulaşınca denetim yanlış alarma geçti. Ziyaretçi etkilenmiyor.
ONARILMADI (brief "gerileme varsa DUR, kendi başına onarma" + denetim
altyapısı kara listede) — SIRADAKILER'e tek satırlık düzeltme önerisi
ve falsifikasyonlu bitti-tanımıyla yazıldı. Asıl risk performans değil
**alarm körelmesi**: her koşumda yanlış kırmızı yanarsa gerçek ölü
bağlantı bu gürültünün altında kaybolur.

**SARI (md9 /harita/ mobil 68) GERİLEME DEĞİL — geçmişe bakılarak
ayrıldı.** 92 ölçümlük tarihçe çıkarıldı: band 68-75, medyanın 70 altına
düşmesi 3 kez olmuş ve **ikisi Astro 5 döneminde**; 68 turu yükseltmeden
bir saat önceki koşumda da var ([68,75,75]). Masaüstü 93→94 ile hafif
İYİLEŞTİ. Şerh kayda geçti: üç turun ikisi 68 bandın alt ucudur, tek
koşumluk örneklem küçük bir kaymayı kesin dışlayamaz — aracın kendi
"iki ardışık koşu = kırmızı" kuralı gerçek kaymayı yakalar.

## 26.08.2026 (8. seans, 3. iş) — K1 YAYGINLAŞTIRMASI FAZ 1: yedek-al.sh

Rapor: rapor/26-08-k1-faz1-yedek-al.md. BÜYÜK iş rejimi uygulandı:
brief cikti/brief/'e yazıldı, denetçi 1 ENGEL + 2 UYARI verdi, ENGEL
yalnız EKLEME ile kapatıldı (E1-E4), ikinci turda 2 UYARI kaldı ve
kabul edildi (cikis-kaydi.sh bu işin ÜRETTİĞİ dosya, girdi değil).

**NE YAPILDI.** Ortak yardımcı arac/cikis-kaydi.sh yazıldı ve YALNIZ
yedek-al.sh'e bağlandı. Envanterde öncelik-1 seçilmişti çünkü makinedeki
tek veri kaybı koruması ve saglik-bekcisi.sh onu KAPSAMIYOR — "hiç
koşmama" hâli tamamen kör. Sözleşme gsc-haftalik'le AYNI:
`<ISO-8601 UTC> <ad>: ÇIKIŞ · exit=<kod> · dosya=<yol> · bayt=<n>`,
üretilmemişse "-". Çıktı alanı için son-yedek.json seçildi: o dosya
ANCAK manifest doğrulamasından SONRA yazılır, yani varlığı yedeğin
doğrulandığının kanıtıdır.

**YARDIMCI, TRAP'İ EZMEZ — ZİNCİRLER.** Envanterde ölçülmüştü: bash'te
ikinci `trap ... EXIT` birincisini SESSİZCE ezer (node process.on('exit')
ve python atexit YIĞILIR; sorun bash'e özgü). Yardımcı `trap -p EXIT` ile
mevcut trap'i okuyup zincirliyor. Sinyal trap'leri de yalnız o sinyalde
trap YOKSA kuruluyor.

**E1 KAPISI BİR VEKİL KRİTERİ YAKALADI.** Envanter iddiaları yeniden
ölçüldü. `grep -c "TAVAN|döndür|tail -c" arac/yedek-al.sh` → 2 döndü,
yani "log döndürme YOK" iddiası yanlışlanmış GİBİ göründü. Satırlar
okundu: ikisi de (77, 81) YEDEK PAKETİ kuşak döndürmesi, log döndürmesi
değil. Grep'in kendisi vekil kriterdi; satır okunmadan sonuç yazılsaydı
envanteri yanlış yere düzeltmiş olacaktık. İddia ayakta.

**FALSİFİKASYON 4a-4g.** 4a başarı (exit=0 · dosya · 1218971523 bayt) ·
4b erken hata, betiğin KENDİ test kancasıyla, betik dosyası hiç
değişmeden (exit=1, alanlar "-", md5 önce=sonra) · 4c geç hata, durum
dosyası yazma anında — vekil kriter DEĞİL (exit=1, çıktı md5 bozulmadı) ·
4d sinyal (exit=143) · 4e yedek-al.sh'de UYGULANAMAZ (mevcut trap yok,
ölçüldü: grep 0) — uydurma test kurulmadı, zincirleme yardımcının kendi
birim sınamasıyla kanıtlandı · 4f döndürme 6 tur (.1=TUR-6 .. .5=TUR-2,
TUR-1 silindi, .6 hiç doğmadı, kırpma yok) · 4g gerçek yedek + geri okuma.

**4d'DE ÖLÇÜLEN SINIR.** TERM 11:30:16'da gönderildi, ÇIKIŞ satırı
11:34:01'de yazıldı — 3 dk 45 sn gecikme. Sinyal, çalışan `git bundle
create` alt komutu bitene kadar işlenmedi (bash trap'i foreground komut
bittikten sonra işler). Kayıt GARANTİ ama sinyal ANINDA değil. Uzun alt
komutu olan her betikte geçerli; Faz 2'de akılda tutulacak.

**4g'DE HASH FARKI ÇIKTI, GİZLENMEDİ.** depo.bundle sha256'sı testlerden
öncekinden farklıydı. Nedeni ölçüldü: `git bundle` DETERMİNİSTİK DEĞİL
(aynı depodan iki bundle farklı hash verdi). Sağlamlık hash'le değil
GERÇEK KLONLA kanıtlandı: bundle'dan klonlanan HEAD canlı depo HEAD'iyle
eşleşti (545 commit, 10 ref). Varlık paketi bit-eşit korundu (E4 kapısı).

**K2 BEDAVAYA GELDİ + CRON `>>` KALDIRILDI.** Yardımcı 512 KB tavan +
en fazla 5 kayan arşiv getirdi (kırpma yok). Ayrıca cron satırındaki
`>>` kaldırıldı ve tavansız log/yedek-cron.log silindi (29 satırı
"[taşındı]" etiketiyle tek log'a geçti). ŞERH: brief bunu açıkça
istemedi; madde 3'ün ("K2 bedavaya geliyor, ayrı iş açma") gereği olarak
yapıldı — aksi halde tavansız ikinci log kalırdı. Karar itiraza açık,
geri alma bloğu raporda.

**YAN BULGU, ONARILMADI (kapsam dışı).** 4d'de sinyalle ölünce
.depo.bundle.tmp (925 MB) ve .imza-yeni kaldı — yedek-al.sh'de temizlik
trap'i yok. Test artığı temizlendi, kusur SIRADAKILER'e yazıldı.
Ayrıca site-saglik.mjs SIGTERM ile ölünce kilidini bırakmıyor (betik
bayat kilidi kendisi devralıyor, o yüzden arıza değil ama kayıtta).

KAPSAM DIŞI, DOKUNULMADI: diğer 9 betik · Telegram yolu · arslanhukuk.tr
ve bist-*. Faz 2 kalemleri SIRADAKILER'e yazıldı.


## 26.08.2026 (8. seans) — CRON DOĞRULAMASI + K1/K2 LOG ONARIMI

Rapor: rapor/26-08-k1-k2-log-onarimi.md. Adım 0 konum kapısı TEMİZ
geçildi (doğru dizin + doğru remote); arslanhukuk.tr ve bist-* dizinlerine
girilmedi.

**BÖLÜM 1 — İLK GERÇEK CRON KOŞUMU DOĞRULANDI (yalnız ölçüm, onarım yok).**
25.08'de kurulan GSC haftalık cron'unun ilk gerçek koşumu 2026-08-26
10:30:01 UTC'de düştü ve GERÇEKTEN çalıştı — yalnız tetiklenmedi.
Kanıt zinciri: syslog CRON[2009304] · çıktı /home/suha/gsc-cikti/
2026-08-23.md 2531 bayt 10:30:02 · içerik dolu (49 satır) · exit 0 ·
Telegram'a hata yok. "Eski çıktının tekrarı" ihtimali ÜÇ ölçümle elendi:
pencere ilerledi (08-16..08-22 → 08-17..08-23), veri değişti (tık 35→41
iken 31→45; md5 farklı; 69 satır farklı), önbellek yok
(`cache_discovery=False`, canlı searchanalytics().query().execute()).
Sunucu UTC — TR farkı yok. md24 yeniden ölçüldü: www 301 → apex, hedef
200 + canonical apex → **SARI'DAN YEŞİLE DÖNDÜ** (izole --hizli: kırmızı
0 · sarı 0 · geçti 12; ağaç önce ve sonra temiz).

**BÖLÜM 2 — DOĞRULAMANIN AÇTIĞI İKİ KUSUR ONARILDI.**
- **K1** — çıkış satırı betiğin SON SATIRINDAKİ echo'ydu; set -euo
  pipefail altında erken düşüşte hiç çalışmıyordu, yani "hangi çıkışla
  bitti?" log'dan cevaplanamıyordu (26.08 doğrulamasında exit 0'a ancak
  dolaylı akıl yürütmeyle varılabildi). Çözüm son satıra echo eklemek
  DEĞİL: `trap cikis_kaydi EXIT` + sinyalin exit'e çevrilmesi
  (TERM/INT/HUP) — bash'te sinyalle ölürken EXIT trap'i garanti değildir.
  Biçim: `<ISO-8601 UTC> ... ÇIKIŞ · exit=<kod> · dosya=<yol> · bayt=<n>`;
  dosya üretilmemişse alanlar "-", satır yine yazılır.
- **K2** — iki log vardı ve TAVANI OLAN YANLIŞ LOG'du: sarmalayıcının
  kendi log'u 512 KB kuralına tabiydi, cron'un `>>` ile yazdığı
  gsc-haftalik-cron.log sınırsız büyüyordu. Cron satırındaki `>>`
  kaldırıldı; sarmalayıcı TTY yoksa stdout+stderr'i kendi log'una
  yönlendiriyor (`exec >> "$LOG" 2>&1`), böylece cron mail'i üretilmiyor
  ve bash'in kendi hata mesajları dahil hiçbir çıktı kaybolmuyor —
  /dev/null KULLANILMADI. İkinci log silindi, iki satırı "[taşındı]"
  etiketiyle tek log'a geçti.

**3a BEYAN DENETİMİ — beyan kısmen doğruydu, örtmediği kusur bulundu.**
512 KB eşiği KODDA DOĞRULANDI (`LOG_TAVAN=$((512 * 1024))` = 524288
bayt). ANCAK döndürme ARŞİVSİZDİ ve VERİ KAYBEDİYORDU: `tail -c
$((LOG_TAVAN / 2))` ile log'un ilk yarısı kalıcı atılıyordu. "Boyut
sınırıyla döndürülür" doğruydu ama döndürme = kırpmaydı. Arşiv
mekanizması sıfırdan kuruldu: en fazla 5 arşiv (.1..5), 6.'sı silinir,
hiçbir satır kırpılmaz.

**FALSİFİKASYON 5/5 + 1 EK.** 5a başarı (exit=0 + dosya + boyut) ·
5b erken hata, ön kapıda (exit=1, alanlar "-", betik md5 bit-eşit geri
alındı) · 5c geç hata, python yazma anında (exit=1, traceback log'a
düştü, çıktı md5 bozulmadı) · 5d döndürme (6 tur; .1=TUR-6 ... .5=TUR-2,
TUR-1 silindi, .6 hiç doğmadı) · 5e crontab'da `>>` yok. EK: sinyal
(TERM → exit=143 satırı yazıldı).

**HATA KAYDI — VEKİL KRİTER.** 5c'nin ilk denemesi GEÇERSİZDİ: çıktı
DİZİNİNİ yazılamaz yaptım (chmod 500), koşum exit 0 döndü. Neden: hedef
dosya zaten vardı ve mevcut dosyaya yazmak dizin yazma izni gerektirmez.
Ölçmek istediğim şeyin (yazma başarısızlığı) yerine ölçmesi kolay bir
vekili (dizin izni) seçmiştim. Gerçek kriterle tekrarlandı: çıktı
DOSYASI chmod 400. Kural zaten yazılıydı (CLAUDE.md "Brief yazarı
öz-denetim" md.3) — uygulamada kaçtı, kayda geçiriliyor.

**KENDİ YORUMUMU DÜZELTTİM.** Arşiv üst sınırını koda "(1+5)×512 KB
≈ 3 MB" diye yazmıştım; 5d bunu YANLIŞLADI — arşiv, döndürme ANINDAKİ
boyutu dondurur, tavanı aşabilir (sınamada 726 KB). Yorum düzeltildi:
garanti edilen tek şey arşiv SAYISININ sınırlı olması.

**ŞERH — BRIEF SINIFI.** Brief "KÜÇÜK İŞ" beyan etti; CLAUDE.md ölçütüne
göre iş BÜYÜK sınıfına düşüyor (tek dosya değil + mimari: cron satırı ve
script çıktı sözleşmesi). İş durdurulmadı — brief zaten bitti-tanımı,
falsifikasyon matrisi ve kapsam-dışı listesi taşıdığı için BÜYÜK rejimin
içeriğini fiilen sağlıyordu. Uyuşmazlık kayda geçirildi.

KAPSAM DIŞI, DOKUNULMADI: Telegram yolu (uyari-gonder.sh — git status
boş), K3/md17 (dış sunucu kaynaklı), gsc-haftalik.py. K4 not olarak
kaldı (koşum ~1 sn; içerik farkı gerçek veriyi kanıtlıyor).


## 25.08.2026 (7. seans) — 25.08 ALARM TEŞHİSİ + GSC HAFTALIK CRON BAĞI

Rapor: rapor/25-08-alarm-teshisi.md. **ŞERH: adım 0 konum kapısı elle
geçildi** — oturum /var/www/arslanhukuk.tr'de açılmıştı, kapı kırmızı
verdi, kullanıcı mutlak yollarla çalışmayı açıkça yetkilendirdi;
arslanhukuk.tr ve bist-* dizinlerine girilmedi.

BULGU: 25.08'in ALARMLARININ ÇOĞU GERÇEK ARIZA DEĞİL. 08:56-08:57
arasındaki dört kırmızı (baraj 4662 · grace 4663 · nhyp 4664 · yedek
4665) ile 10:05 IndexNow 500 (4667) ve 10:07 bekçi ikilisi (4668/4669),
dünkü seansın kendi falsifikasyon testleridir. Kayda güvenilmedi:
dört kancanın dördü de KODDA tek tek doğrulandı (BARAJ_CEK_KOMUT,
GRACE_URL_EZME, NHYP_NOBETCI_SYGM_EZME, INDEXNOW_UC_NOKTA). Yedek
alarmının belirleyici kanıtı: kırmızı koşumun satırı log/yedek.log'da
YOK — LOG yolu $KOK'a bağlı olduğundan o koşumda YEDEK_KOK ezilmişti.
1d ORTAK NEDEN: tek olay, ama ağ kesintisi DEĞİL — 08:56:28'de baraj
deploy hook HTTP 200 aldı, 08:57:07'de nhyp SYGM'den 191076 bayt çekti;
bellek 6413 MB boştu; alarmlar eşzamanlı değil 11 sn arayla sıralıydı.

GERÇEK OLAN TEK KALEM 16:23'ün 5 hatasıydı ve o da KAYNAK TARAFLI:
9 × curl(28) zaman aşımı / 0 bayt (TLS/DNS hatası yok, -k kullanılmadı,
KARARLAR §24 korundu). Bizim taraf üç ölçümle elendi — bellek 6467 MB,
aynı koşumun ortasında dsi.gov.tr başarıyla çekildi ve dsi,
suverimliligi ile AYNI IP'de (212.175.143.60). Şu an beşi de 200/~1 sn;
gerçek koşum tekrarlandı: 480 sn/5 hata → 61 sn/0 hata (563bf95).
Emsal: izleme/log/hata.log tüm ömürde yalnız 2 ağ olayı (03.08 dsi,
25.08 bu beşi) — ikisi de kendiliğinden kapandı. ONARIM YAPILMADI.

YEDEK: envanter ile disk BİREBİR uyuşuyor (3/3 varlık yerinde).
Gerçek yedek üretim hedefine alındı (214 sn, 1162 MB) ve GERİ OKUNDU:
bundle klonu HEAD=563bf95 (yedekten 6 dk önceki commit), fsck temiz,
537 commit/10 ref; varlık paketinden çıkarılan tr-atlas-master.png
sha256'sı diskle birebir; manifest OK.

SAĞLIK: 19:30 cron koşumu bir kalem geriletti (9-lighthouse /harita/
mobil 72→68). NEDEN BENDİM — yedek koşumum (19:32-19:36) --tam
penceresiyle çakıştı. Boş makinede yeniden ölçüm: /harita/ mobil
[75,75,75] → GEÇTİ; 19:59 koşumu 🔴0 🟡2 🟢21 = 15:28 tabanıyla birebir.
TABAN GERİLEMESİ 0.

DURDURULDU (adım 2): Telegram kanalı PAYLAŞIMLI. Bot 8549777437
(TraderBOT/@TraderSerdar_BOT) + chat 1490086481 ikilisini
/home/suha/araclar/kesif-botu (systemd kesif-botu.timer, 08:00 TR)
AYNEN kullanıyor; ayrıca uyari.log'da message_id dizisinde 4659-4661
boşluğu var (o üç mesajı suharitasi göndermedi). BIST tarafı
DOĞRULANMADI — bist-* dizinlerine girme yasağı gereği okunmadı; bot adı
karinedir, kanıt değildir. Cron bağı (adım 3) ve falsifikasyon (adım 4)
BAŞLATILMADI: 3g yeni işin hata yolunu bu paylaşımlı kanala bağlayacak,
4b oraya kasıtlı test uyarısı düşürecekti. Proje sınırı kullanıcının
kararıdır. DUR kapısında kullanıcıya kanıt sunuldu ve soruldu; KARAR:
"paylaşımlı kalsın, cron bağını kur". Bunun üzerine adım 3-4 koşuldu.

CRON BAĞI (KARARLAR §31): arac/gsc-haftalik.sh sarmalayıcısı yazıldı
(set -euo pipefail · yorum dışında 2>/dev/null SIFIR · mutlak yollar ·
flock -n tek örnek · log 512 KB tavanla döndürülür · başarı ölçütü exit
kodu DEĞİL çıktı dosyasının varlığı+doluluğu). Satır: `30 10 * * 3`
(Çar 10:30 UTC = 13:30 TR), kullanıcı suha, root'a dokunulmadı.
Rapordaki hazır satır (Pzt 06:25) OLDUĞU GİBİ KURULMADI: 06:00'a 25 dk,
06:40 --tam'a 15 dk — 3f'i çiğniyordu; komut gövdesi rapordan alındı,
yalnız zamanlama değişti. GÜN ölçümle seçildi: yedi günden yalnız
ÇARŞAMBA iki pencereyi de tam takvim haftasına (Pzt-Paz) oturtuyor,
bitiş her zaman bugün-3 (≈2 günlük GSC gecikmesinin bir gün üstünde).
SAAT: arslan-analytics hourly :00 → 10:00 ve 11:00'e tam 30 dk; 10.
saatte indexnow yok. 30 dk kuralı dışı tutulanların maliyeti ÖLÇÜLDÜ
(bellek-log tek `free -m`, muvekkil-saglik 0,06 sn, arslan-monitor
0,66 sn, sysstat-collect 0,01 sn). ŞERH: apt-daily rastgele gecikmeli.
ÇIKTI KADERİ (a): depo DIŞINA /home/suha/gsc-cikti — git hiç görmez,
commit atılmaz; betiğe eklemeli GSC_CIKTI_DIZIN ezmesi kondu, ezme
yokken eski davranış uçtan uca sınandı ve bit-eşit çıktı.

FALSİFİKASYON 3/3: (4a) satır 2 dk sonrasına kuruldu, çıktı silindi,
cron kısıtlı PATH'te tetikledi — syslog CRON[1912897] (suha) CMD, çıktı
üretildi, sonra gerçek zamanlamaya çevrildi ve geçici satırın kalktığı
ölçüldü · (4b) anahtar yolu kasten bozuldu → exit 1 + Telegram msg 4671
→ geri alındı, sha256 BİREBİR aynı → yeşil · (4c) iki koşum aynı anda →
ikincisi flock'a takılıp "ATLANDI" ile exit 0. 1a/1b'de ONARIM
YAPILMADIĞI için orada boz-ölç-geri al uygulanacak değişiklik yoktu —
uydurma onarım+uydurma falsifikasyon yazılmadı.


## 25.08.2026 (6. seans) — GSC MCP + SEO/GEO tam optimizasyon (worktree suharitasi-gsc-mcp)

main 23f35ac → 0e626ff (merge; canlı 7f13d60 baraj commit'iyle). Rapor:
rapor/gsc-mcp-optimizasyon.md; KARARLAR §30. KURULUM: google-seo-mcp
v0.8.5 (inceleme→kur→sabitle; `mcp<2` pini gerekti), kullanıcı-kapsam
kayıt, salt-okunur; çapraz doğrulama 4/4 BİREBİR (37/761 · 2/2701 ·
8/110 · 0/2255, aralık 27.07-23.08). İLK KEZ ÖLÇÜLEN: pozisyonlar
(Ergene ailesi poz 10,5 = 2. sayfa başı; "dsi su havzaları haritası"
poz 5,1 CTR %22,7) ve TAM İNDEKS HARİTASI (519 URL tek tek: 170
indeksli — omurga TAM; 349 dışarıda, 340'ı göl/nehir = tarama bütçesi).
UYGULANAN (bulgulu): 81 il <title> il-önce ("malatya kuyu" bulgusu) ·
Dataset/DataCatalog (/arsiv/+/kapatma-kaydi/) · kuyu-tasima iç bağ 5→7,
taslak-takibi 1→2 (ikisi de "Google'a bilinmiyor/keşfedildi" + zayıf
bağ ölçümüyle) · haftalık koşum arac/gsc-haftalik.py (CRON'SUZ, test
çıktısı depoda). YAPILMAYAN (gerekçeli): Ergene yamyamlığına müdahale
(dünkü iş izlenmeden kör atış; /havzalar/ dokunulmaz) · snippet
optimizasyonu (tek 1-5 sorgusu zaten en yüksek CTR) · kalan 23 GEO
bulgusu (muaf/içerik kararı — yeniden ölçümle doğrulandı). Kapılar:
izole --hizli kırmızı 0 · SEO 26=taban · GEO 23=taban · canlı --tam
KIRMIZI 0/SARI 2(md24+md17, ikisi de işten bağımsız)/GEÇTİ 21 ·
IndexNow 88 URL HTTP 200 (15:15Z). ŞERH: Knowatoa "0$ katman" dünkü
kayda rağmen bugün sayfada DOĞRULANAMADI (Start free trial + 59/199$
planlar); Bing tarafı panel erişimsiz doğrulanmadı. DERS: GSC ekran
sayılarını API'yle tutturmak için aralığı kaydırmak gerekti (veri
gecikmesi ~2 gün) — çapraz doğrulama tarih-aralığı duyarlıdır.

## 25.08.2026 (5. seans) — Havza sayfaları arama talebine uyduruldu (worktree suharitasi-havza-talep)

main 890dc1a → 55cd794 → 7e3740b (+kapanış kayıtları). Rapor:
rapor/havza-talep.md; KARARLAR §29. GSC ölçümü (kullanıcı): 146 sorgu /
~3.900 gösterim / 19 tıklama; "ergene havzası nerede" 2.255/0 →
/havzalar/meric-ergene/. Hipotez (a)(b)(c) ölçümle kanıtlandı; (d)
sıralama ölçülmedi (sunucu TR'de değil). 25 sayfada: title "[Ad]
Nerede? Kapsadığı İller ve Haritası" (≤60 guard) · H1 soru · öz-cevap
konum cümlesiyle başlıyor (yalnız il-kurum resmî listesi; bölge/yön
iddiası yok) · iller+konum haritası öz-cevabın altına taşındı · SSS 3
soru (açık/kapalı KONULMADI — 25/25 tahsis=null) · Meriç-Ergene'ye
künyeli RG "Ergene Havzası" bölümü (kayıt 36: RG 05.11.2009/27397).
E4: /havzalar/ bit-eşit (fark yalnız CDN e-posta yeniden yazımı).
İzole kapı: 11 GEÇTİ, md24 kırmızısı = geçiş penceresi teşhisi.
HATA + DÜZELTME: _redirects'e host'lu www kuralı yazdım — canlıda
etkisiz ÖLÇÜLDÜ; resmî belge Pages'in alan-düzeyi yönlendirme
DESTEKLEMEDİĞİNİ söylüyor (25.08 okundu). Kural kaldırıldı; www 301
panel Redirect Rule = kullanıcı adımı; md24 üç durumlu (301 yeşil ·
200+canonical apex SARI · diğer kırmızı; falsifikasyon: .tr 301 yeşil,
404 kırmızı, canlı sarı). IndexNow: değişen 25 sayfa elle bildirildi
(13:26Z, HTTP 200) — lastmod veri-tarihli olduğundan İÇERİK
değişikliğini yakalamıyor; olağan döngü yarınki veri güncellemesinde.
DERS: "Nihai biçim ölçümle belirlenir" kuralı title'da hayat kurtardı
(60 bütçesi md16 tabanını korudu); merkezî desc kırpımı yarım sayı
bırakabiliyor — cümle-bütünlüklü bütçe gerekti.

## 25.08.2026 (4. seans) — Otomatik dizin bildirimi: IndexNow canlıda (worktree suharitasi-indeks)

main 6b57769 → fa5fd95 (+kapanış kayıtları). Rapor: rapor/indeks-bildirimi.md;
KARARLAR §28. Kurulan: arac/indexnow-bildir.mjs (tetik = CANLI sitemap
farkı + surum.json imzası; anahtar public/'te, SIR DEĞİL) · cron 6×/gün
:25 · bekçi (d2) iki eşik (koşum >26s, bildirim >96s) · sitemap lastmod
artık JSON-LD dateModified'dan (build günü damgası SAHTE TAZELİKTİ,
kalktı; 508/519 tarihli, 11'i dürüstçe boş; loc kümesi diff FARK 0).
İlk kademeli bildirim: çekirdek 20 (202) → 250+249 (200); 519/519.
Falsifikasyon 5/5: anahtar-canlıda-yok DUR · geçersiz anahtar 202'de
kalıyor (senkron red YOK — resmî davranış; host uyuşmazlığı 422 ölçüldü)
· sahte uç nokta 500 → exit 1 + Telegram msg 4667 + state yazılmadı ·
ikinci koşum fark=0 · bekçi eski-tarih 2/2 ateşledi, gerçek state yeşil.
Google Indexing API: resmî kapsam yalnız JobPosting/BroadcastEvent →
UYGUN DEĞİL ile kapandı (şema uydurulmaz). Bing kaydı + Crawler Hints
panel işleri → SIRADAKILER kullanıcı adımları. Ders: IndexNow uç noktası
geçersiz anahtarı ANINDA reddetmez (202 bekletir); "202 aldım" başarı
kanıtı değildir — kanıt, anahtarın canlı dosyayla birebir eşleşmesi +
sonraki koşumların 200'e geçmesidir.

## 25.08.2026 (3. seans) — KALANLAR PAKETİ (tek koşum, madde başına ayrı merge)
Brief tam rejimden geçti (denetçi: 1 ENGEL yalnız-ekleme ile kapandı, 2 T1
uyarısı açıklamalı). İKİ KÖK BULGU: (1) rg-nobetci her salı
isletme-sahalari-yeni.json'a son_kosum damgası basıyor, dosya izleme/
dışında olduğundan kimse commit etmiyor → 18-24.08 arası ağaç kirli,
TÜM hatların pull/push'u tıkalı (41 bekleyen commit; cron-hata.log kanıtı).
Onarım: yalnız-yeni-kayıtta yazım + su-izleme koşullu add + Telegram
(KARARLAR §27 K1). (2) Baraj/grace/yedek/nhyp hatlarının kırmızısı yalnız
log'da kalıyordu — §24 Telegram yolu 4 hatta genişletildi, falsifikasyon
message_id 4662-4666 (yedek falsifikasyonu gerçek kusur da yakaladı:
uyarıcı yolu KOK'a bağlıydı). GÖRÜNÜR GÜNCELLİK DAMGASI (C5 №5): 509
sayfada görünür + 508 sayfada dateModified — tarih YALNIZ veri kaydından
(guncellik.js); 36 md'ye git-ölçümlü guncelleme alanı; izole kapı TAM
YEŞİL, md14 sapma 0 (taban yenileme gerekmedi), canlıda içerik imzasıyla
teyit. md24 www kalemi kuruldu (falsifikasyon 2/2). --test 7/7. Yedek
geri-alma denemesi tazelendi (bundle klon + fsck temiz). NHYP sonda
URL'leri ölçüldü: 12/12 eski yolda 200 (SYGM taşıması NHYP'yi kapsamamış
— negatif sonuç kayıtlı). Rapor: rapor/kalanlar-paketi.md.


## 25.08.2026 (2. seans) — md17 GET-düşümü (C5 №4, KÜÇÜK İŞ)
`disLinkDenetle` artık başarısız HEAD'de (4xx/5xx/zaman aşımı) aynı
adrese tarayıcı-UA'lı TEK GET atar; geçerse bağlantı SAĞLAM +
"HEAD reddetti, GET geçti" notlu (md17 mesajında sayaç). Falsifikasyon
2/2: eski-yol Gediz PDF'i hâlâ KIRMIZI; doi mcd.386171 (HEAD 404 /
GET 200) artık notlu-sağlam. Sabah onarılan 37+2 bağlantı yeni mantıkla
ölü 0 — mufbed/bmre DOI'leri düşümle kendiliğinden sağlam çıktı (sabah
elle bulunan sınıfın otomasyonu). Süre: aynı 52 örneklemde 106,9→142,7 sn
(+%33 kalem içi; --tam bütçesinde ≈+%8, %50 kapısının altında — düşüm
--tam'da kaldı; --hizli'de md17 yok, +0). DERS (yanlış-negatif ikizi de
kayıtlı): 200 dönen adresin BAŞKA yayın çıkabildiği gibi (trdizin vakası),
404 dönen adres de UA/yöntem artefaktı olabilir — HTTP kodu tek başına
içerik kanıtı değildir; künye güncellerken başlık/metin eşleşmesi,
tarayıcı temizlerken otoriter kaynak (handle API / tarayıcı-GET) şart.

## 25.08.2026 — GEO/SEO temizlik + tam denetim turu (worktree suharitasi-geo)
Brief BÜYÜK İŞ rejiminden geçti (denetçi: 2 ENGEL yalnız-ekleme ile
kapatıldı, D1-D4 + amaç özeti raporda). A: 1039 dış link TAM tarandı —
37 gerçek ölü onarıldı (21 SYGM→BelgelerArsiv, Last-Modified birebir
kanıtlı; 12 kayıtsız DOI + 2 ölü-hedefli DOI → başlık-eşleşmeli DergiPark;
2 İÜC kitabı "doğrulanamadı" etiketiyle kaldı), tarayıcının 3 yanlış-pozitifi
(HEAD/nöbetçi-UA) otoriter handle API + tarayıcı-UA GET ile ayıklandı ve
geri alındı. /su-hukuku/ rota kapanışı (KARARLAR §26). B: seo-geo-ortak
tırnak hatası bulundu (94 sahte nehir bulgusu) — falsifikasyonlu düzeltme;
SEO bulgusu 303→26, GEO 59→23; il öz-cevapları 280 altına veriden indirildi;
md21 Manisa borcu kapandı (12→7=taban); izole --hizli kapısı TAM YEŞİL.
DERS: md17'nin HEAD-404'te GET'e düşmemesi + nöbetçi UA'sı kurum sitelerinde
(TBMM, DergiPark) sahte ölü üretiyor — C-listesi №4. Ölçüm sürprizi:
"video mobilde iki kez iniyor" iddiası 0-baytlık range-sondası çıktı
(site kusuru değil); "3,1 MB" yeniden üretilemedi (1,91-1,99 MB ölçüldü).
Rapor: rapor/geo-seo-katma-deger.md (skill koşumları + C listesi orada).

## 24.08.2026 — 4 Ağustos dalgasının yakalanışı ve kurallara uydurulması
Kayıtsız dalga NASIL fark edildi: kullanıcı brief'iyle koşulan SİTE DURUM
DENETİMİ (rapor/site-durum-kazi.md) — sitemap tip envanteri 279 göl + 131
nehri gösterdi, git log 02-04.08 commit'lerini kayıtlarla eşleştiremedi
(KARARLAR/GUNLUK/SIRADAKILER'de sıfır iz), md14 kırmızısının başlangıcı
dalga gününe denk düştü. YAKALAYAN MEKANİZMA = periyodik durum denetimi +
kayıt disiplini çapraz kontrolü; sağlık sistemi tek başına yakalayamazdı
(sayfalar 200 dönüyordu). Uygulama ve ölçümler: rapor/agustos-uyum.md;
karar: KARARLAR §25. Ders: "MERGE = YAYIN" kuralı işlerken kayıtsız merge,
denetim setine girmeyen sayfa tipleri ve taban yenilenmeden kalan md16/md18
sarıları 20 gün görünmez kaldı; yeni tip → çekirdek sete kuralı bu turda
göl/nehir/ilçe-sorgu için işletildi.

## 2026-07-29 (akşam) — panel sonrası doğrulama

**www 522 KAPANDI.** Pages custom domain eklendi; 3/3 ölçüm **200**
(dün 9/9 → 522). Mükerrer içerik riski ölçümle elendi: www ve apex aynı
sürümü sunuyor (`081bdfa`), www'nin canonical'ı apex'i gösteriyor; iki
HTML arasındaki tek fark CF e-posta gizlemesinin dönen XOR anahtarı.

**ANALYTICS — [DÜZELTME, aynı gün] ÇALIŞIYOR.** Aşağıdaki ilk sonuç
YANLIŞTI; panelde gerçek RUM verisi var (7 ziyaret, Core Web Vitals LCP
%100 Good, yükleme 1.314 ms, apex+www). CWV **yalnız tarayıcıdaki
beacon'dan** üretilebilir — sunucu tarafı metrik bunu veremez, dolayısıyla
beacon gerçek ziyaretçilerde çalışıyor.
Ölçümüm tekrarlandı ve hâlâ 0 gösteriyor: 0/20 istek, tam tarayıcı başlık
seti, otomasyon bayrakları gizli, headless kapalı (Xvfb), 4 ek yol,
apex+www. Bu sunucu Cloudflare'in **ARN** PoP'una düşüyor (3/3 `cf-ray`);
enjeksiyonun bakış açısına göre değişmesi muhtemel ama **doğrulanmadı**.
**YENİ KURAL (28.07 kuralının karşılığı):** "panelin aktif demesi kanıt
değildir" doğruydu; bugün öğrenilen — **tek vantaj noktasından NEGATİF
ölçüm de kanıt değildir**, ölçülen şey CDN'in istek başına değişen
davranışıysa. RUM için belirleyici kanıt TOPLANAN VERİDİR.
İkisi birlikte: beyan tek başına yetmez, tek noktadan negatif de yetmez;
**veri akıyorsa çalışıyordur.**

*(aşağısı ilk, yanlış çıkan sonucun kaydı — silinmedi)*
**ANALYTICS — panel açıldı denildi ama BEACON YOK (ölçüm).** 3 sayfa,
gerçek tarayıcı: DOM'da beacon 0, cloudflareinsights isteği 0, CSP
ihlali 0; ham HTML'de de 0 (apex + www). AYIRT EDİCİ KANIT: Cloudflare'in
HTML yeniden yazıcısı bu yanıtlarda **çalışıyor** (`/cdn-cgi/l/email-protection`
2 isabet — e-posta gizlemesi aktif), yani "bir şey beacon'ı engelliyor"
değil, **beacon hiç enjekte edilmiyor**. Sonuç: zone tarafındaki Web
Analytics "Automatic Setup" devrede değil; Pages → Metrics sekmesi
sunucu-tarafı metriktir, beacon ENJEKTE ETMEZ. DERS (28.07'nin ikizi):
**panelin/kullanıcının "açtım" demesi kanıt değildir; kanıt canlı ağ
ölçümüdür.** İki kez aynı yerde takıldık; ölçüm iki kez de yakaladı.

**M12 keşif botu taşındı (kullanıcı root olarak koştu) ve bağımsız
doğrulandı.** Root gerekmeden `systemctl`/dosya sistemiyle ölçülen:
kesif-botu.timer **enabled**, sonraki koşum **30.07 05:00 UTC**,
`User=suha`, `.kesif.env` **0600**, venv suha altında (Python 3.12.3),
eski `bist-kesif.timer` **disabled** (`0 timers listed`). BIST bozulmadı:
`bist-api` **active**, `8001/health` → **403** (28.07 tabanıyla aynı).
Doğrulanamayanlar açıkça işaretlendi: /root kopyasının durduğu ve
Telegram `message_id 4449` — ikisi de kullanıcı beyanı, /root okunamıyor.


## 2026-07-29 (öğle) — BEKLEYEN İŞLER PAKETİ (M1-M16)

16 kalem; 14'ü kapandı, 2'si gerekçeli açık kaldı. Ayrıntı: SIRADAKILER.

**UYDURMADAN KIL PAYI DÖNÜŞ (M1).** trdizin.gov.tr'nin ölü URL'indeki
base64 kimlik (`TXpFNE5ETXo=`) "318433" diye çözülüyor ve
`search.trdizin.gov.tr/tr/yayin/detay/318433` **HTTP 200 dönüyor**. Sadece
kodu doğrulasaydım künyeye yanlış yayın yazacaktım — o sayfa "Use of
geosynthetics…" (2018), bizimki "Berke Barajı karstlaşma" (2002). Doğru
kayıt aramayla bulundu: **31843**. DERS: **200 yetmez; sayfanın AYNI
yayın olduğu içerikten doğrulanır.** Üç bağlantının üçü de başlık+yazar
metinde aranarak kapatıldı.

**KAYIT YANLIŞLANDI (M3).** `--test` aylardır 6/7 veriyordu ve bu "bilinen
bir eksik" sanılıyordu. Ölçüm: senaryo (i) `#world .sw-scene video`
seçicisini kullanıyordu — o DOM 27.07 ana sayfa revizyonunda kalktı.
Seçici hiçbir şey bulamıyor, readyState null dönüyor, senaryo BOZUK
OLMADIĞI HALDE "KALDI" diyordu. İkinci katman: mutasyon `media-src`
silmekti; yeni motor videoyu blob değil doğrudan src ile yüklüyor
(ölçüldü: 6 videonun 0'ı blob), bu yüzden silmek artık hiçbir şeyi
kırmıyordu. Seçici tek kaynağa (izleme/medya-beklenen.json) bağlandı,
mutasyon `media-src 'none'` yapıldı → **7/7**.

**VEKİL KRİTER REDDİ (M8, M14).** İkisinde de kolay ama yanlış bir ölçüt
vardı: M8'de "kütle adının çevresinde hangi il çok geçiyor" (Kemer için
Antalya 58 / Burdur 3 — bu kütlenin yerini değil, raporun genelini
gösterir), M14'te "site genelinde hangi hiza yaygın" (sola 42 / orta 3 —
içerik sayfalarını sayıp landing sorusuna cevap vermek). İkisi de
kullanılmadı; M8 **sıfır atama** ile kapandı, M14 kod değişmeden
KARARLAR §21'e kural olarak yazıldı.

**M5 — birincil kaynak yöntemi.** Brief pasajdan "Sayı: NNNNN" çıkarımını
öneriyordu; o yöntem projede zaten ölçülüp ELENMİŞTİ (1/30 çatışma,
src/data/rg-sayi.js). Yerine RG'nin kendi tarih sayfası başlığı kullanıldı.
Yol boyunca bir ayrıştırıcı hatası doğrulama tarafından yakalandı: sayfa
ÖNCEKİ sayının başlığını da taşıyor, ilk eşleşme alınınca 22.08.2006 için
26263 okunuyordu (doğrusu 26267). Tarih eşleştirmeli hale getirildi →
K3a 34 eşleşme / **0 çatışma**, K3b monotonluk **0 ihlal**.
rg_sayi kapsamı: **363/419 → 417/419 (%99,5)**.

**M13 — bekçiye ikinci tanık.** rg/nhyp nöbetçileri md20'de izleniyordu
ama md20 sağlık sisteminin İÇİNDE koşuyor; sağlık durursa nöbetçinin ölümü
de görünmezdi. Bekçiye (pipeline'dan bağımsız) eklendi. Eklerken `set -e`
tuzağı çıktı: `[ test ] && ekle` fonksiyonun son komutuysa yanlış test
fonksiyonu 1 döndürüyor ve script SESSİZCE duruyor (ölçüldü — bekçi hiç
çıktı vermeden exit 1). Açık `if`e çevrildi. Ayrıca yeni kurulan haftalık
cron'un state dosyası doğmadan alarm üretmesin diye `ilkKosumBeklenen`
eklendi (rg-nobetci cron'u 28.07 21:00'de kuruldu, koşum saati Salı 04:20
→ ilk koşum 04.08).

**M12 DUR.** Keşif botu taşıması root ister; `/root/…` okunamıyor, sudo
parola istiyor. BIST bağı ölçüldü: **teknik bağ YOK** (kendi venv'i, BIST
dizinine/portuna/birimine referans yok); tek bağ birim ADI. Plan + BIST
taban ölçümü (bist-api active, 127.0.0.1:8001 → 403) hazır:
rapor/kesif-botu-tasima.md.


## 2026-07-29 — marka sıfatı kararı + NHYP kaynak geri getirme

**Kullanıcı kararları:** marka sıfatı **"emin"** (KARARLAR §18 + DESIGN §18;
gerekçe: ziyaretçi ceza/ruhsat derdiyle geliyor, aranan his "doğru yere
geldim"; reddedilenler "çarpıcı" ve "resmî") · sayım animasyonu **kalır**
(§19) · NHYP PDF'leri **yeniden indirilsin** (§20).
Sıfatın uygulaması ayrı iş: **D2 kontrast ≥7:1** kuyruğa girdi (BÜYÜK İŞ).

**NHYP geri getirme (BÜYÜK İŞ, kendi rejimimden geçirildi):** brief
denetçisi 1 ENGEL + 3 UYARI → eklemeyle 0 ENGEL. 41/41 dosya indi, 1,1 GB,
0 hata. **Asıl kazanç dosyalar değil, zincirin yeniden üretilebilir hâle
gelmesi:** manifest oturum scratchpad'indeydi (kaybolmuştu) ve PDF→metin
adımı hiç kayda geçmemişti; ikisi de artık depoda.

**UÇTAN UCA TEKRAR — BİT-EŞİT.** 12/12 YEŞİL, 472 kütle; çıktı depodaki
yas-kutleleri.json ile alan alan aynı. Yani 27.07'nin çıkarımı bugün
kaynaktan birebir doğrulanabiliyor — tek sayı değil, 472 kütlenin her alanı.
`NHYP_CIKTI` ortam değişkeni eklendi (yalnız test; üretim dosyası
üzerine yazılmadı — `git diff` boş).

**Süreklilik:** altın örnek NHYP kalemi "donmuş çıktı bekçisi"nden çıkıp
kaynak varlığını da ölçüyor. Kural: 12/12 var → yeşil · 0/12 (temiz klon)
→ yeşil · **kısmen eksik → KIRMIZI**. 27.07'deki sessiz kayıp bir daha
sessiz kalamaz. Falsifikasyon: 1 dosya gizlendi → 🔴 11/12, geri kondu → 🟢.

**ALTI YOL-HATASI kayda geçti** (hepsi loglanarak yakalandı, hiçbiri
sessiz geçmedi): manifest TSV üretildi ama indirici JSON okuyor (0 satır) ·
ham URL yazıldı, HEAD kendi kodladığı için 200 dönüyordu ama curl'e ham
gidiyordu (41/41 HATA) · havza sabit dizinden çıkarıldı, yol derinlikleri
farklı (25 dosya sahte havzaya) · slug yalnız "Havzası" siliyor, klasörler
"HAVZASI" yazıyor · eleme kuralı "YÜS" kısaltmasını kaçırdı (87 MB boşuna) ·
metne çevirme indirme sürerken koşuldu (yarım dosyada hata).
**Ders:** "HEAD 200 döndü" ile "indirici bu dizeyi kullanabilir" AYNI ŞEY
DEĞİLDİR — doğrulama, tüketicinin kullandığı biçim üzerinden yapılmalı.


## 2026-07-28 (gece) — YAPISAL REVİZYON (B0-B4, worktree suharitasi-yapisal)

**Ne yapıldı:** beş uzman eleştirisinin uygulanması. 20 madde; hepsi ayrı
ayrı raporlandı (`rapor/` altında 8 yeni belge).

**Yeni kalıcı belge:** `KARARLAR.md` (17 kalıcı karar, gerekçe + reddedilen
alternatifle; bulunamayan gerekçe "kayıtta yok" işaretli) · `DEVIR.md`
(bus factor: erişim, dizin haritası, cron envanteri, acil durum adımları;
sır YAZILMADI) · `izleme/kaynak-takvimi.md` (tüm cron/timer UTC).

**CLAUDE.md'ye iki kural:** iki kademeli brief rejimi (KÜÇÜK/BÜYÜK, sınıf
baştan beyan edilir; şüphede BÜYÜK) · AY İLKESİ (bu dönem yeni ÖZELLİK
açılmaz; öncelik dağıtım + dayanıklılık).

**Dayanıklılık:** `arac/yedek-al.sh` gecelik yedek (02:10 UTC) — GitHub'a
gitmeyen varlıklar + tam depo `git bundle`; ölçüldü 27 sn / 446 MB, geri
alma KANITLANDI (bundle'dan clone → 341 commit). Sağlık kalemi M11 "son
yedek yaşı" (falsifikasyon 6/6). **SINIR açıkça yazıldı: ikinci konum aynı
makinede, makine ölümüne karşı korumaz.**

**KAYIP TESPİTİ:** `veri/ham/nhyp/` (38 PDF, 892 MB) DİSKTE YOK. Sebep:
gitignore'lu dizin worktree silinirken gitti — GUNLUK 25.07'de kaydedilmiş
hatanın ikizi. Site etkilenmedi (türetilmiş JSON git'te, 12/12 kalite kapısı
yeşil); kaybolan kaynağa geri dönme imkânı. Yedek scripti artık envanterdeki
eksik varlığı log'a UYARI yazıyor.

**ALTIN ÖRNEK TESTLERİ** (`arac/altin-ornek.mjs`, md23): baraj · RG · GRACE ·
NHYP için bilinen girdi → bilinen çıktı, 22 kalem. Falsifikasyon 4/4: her
ayrıştırıcı tek satırla bozuldu → kırmızı → geri alındı → yeşil. İki
ayrıştırma dikişi saf işleve çıkarıldı (`arac/baraj-birlestir.mjs`,
`arac/grace_geometri.py`) — davranış değişmedi, test edilebilir oldu.

**KAYNAK TAKVİMİ:** 4 çakışma ölçülüp dağıtıldı (GRACE 06:00→02:40 Pzt —
40 dk sonra --tam 1.917 MB ile üst üste binebiliyordu · su-izleme 05:30→05:45
ve 16:00→16:15 · baraj 15:00→15:05). Bellek log'u (1.012 ölçüm, 7 gün):
24.07'den beri kullanılabilir RAM hiç 5 GB altına inmedi; swap 6 GB var,
132 MB kullanılıyor → **swap önerisi YOK**, sistem ayarı değiştirilmedi.

**HATA KAYDI — KAYIT YANLIŞLANDI:** SIRADAKILER "CF Web Analytics KURULU"
diyordu. Gerçek tarayıcıyla ölçüldü: canlı ana sayfada 22 ağ isteğinin
**0'ı analitik**, DOM'da beacon yok, dış konak yalnız suharitasi.com +
Google Fonts. **Ziyaretçi verisi toplanmıyor.** Ayrıca gizli ikinci engel:
CSP `script-src`/`connect-src` beacon'ı panel açılsa bile sessizce
engelleyecekti — iki konak eklendi (izin ATIL, panel açılmadan istek yok).
DERS: **panelin "aktif" demesi kanıt değildir; kanıt canlı ağ ölçümüdür.**

**GÖRSEL BULGU:** Cormorant'ın varsayılan rakamları eski-stil (oldstyle).
Canvas mürekkep taraması (200px): 3/5/7/9 taban çizgisinin 54px ALTINA
sarkıyor, 6 ise 132px yükseliyor (0/1: 79px). Ana sayfadaki **"472" ekranda
"47²" gibi okunuyordu.** `lining-nums tabular-nums` ile düzeltildi; yeni
`CanliSayi` bileşeninde. Yedek font Georgia zaten lining kullanıyordu →
font yüklenene kadar rakam BİÇİMİ değişiyordu, o da kapandı.

**Ölçüm aracının kendi hatası (kayda geçti):** dikiş teşhisi ilk koşumda
tüm aydınlık bölümleri KOYU raporladı — palet `oklch()` kullanıyor,
regex ilk üç sayıyı RGB sandı. Renk çözümü canvas'a taşındı.

**Kapılar:** gerileme 0 (174 ortak URL) · sitemap 174→175 KAYIP 0 ·
md14 G1-G6 sapma YOK (taban yenilemesi gerekmedi) · altın örnek 22/22 ·
konsol 0 · 375 taşma 0 · kontrast en dar 5,45 ihlal 0.

**Kısıt aşıldı, raporlandı:** brief "ağırlık artmaz" diyordu ama
"animasyonlu sayım" da istiyordu — ikisi aynı anda sağlanamaz. Ölçülen:
index.html +322 B gzip (%2,98), kapı sayfası +522 B (%4,54; büyük kısmı
yeni içerik). Motor ayrı bileşene alınarak 3 kopya → 1 kopyaya indirildi.


## 2026-07-28 (öğleden sonra) — görünmeyen varlık teşhiri + FAZ 3 durdurma

**Merge:** `29dbc9c` — /arsiv/ künye sayfası (8 set) + ana sayfa kanıt bandı
(472 kütle · 419 RG kaydı · 155 kurum). Gerileme 0/173, S1 korundu.
Tam döküm: `VITRIN-RAPORU.md`.

### Günün asıl bulgusu: keyword eşleşmesi il ataması üretemez
Brief 23 "tahsise kapatma/kısıt" RG kaydının il sayfalarında gösterilmesini
istedi. Kayıtların sınıflandırması doğruydu (23/23'ünde gerçek yasak dili
var) ama **hangi ile ait olduğu** güvenilmezdi. Bağımsız kontrol (pasaj
metnine karşı doğrulama + ilçe dizini + bağlam okuması) 30 il-kayıt
eşleşmesinin en az 7'sini dayanaksız ya da sahte gösterdi (~%23):

| Atama | Eşleşen dizge | Gerçek |
|---|---|---|
| Van | "A. ÖZALP" | bakan imzası; ilan Antalya sahası |
| Samsun | "Gölü Havzaları" | ortak isim "havza"; ilan Ankara sahası |
| Denizli | "Çardak Köyleri" | Nevşehir'e bağlı köy |
| Gümüşhane | "Kürtün Irmağı" | Samsun ilanındaki akarsu |
| Burdur | krom madeni kararnamesi | RG fihrist sayfası, su ilanı değil |

Kök neden: pasajlar iki sütunlu RG sayfalarının OCR'ı; satırlar komşu
sütundan sızıyor ve bir "kayıt" birden çok ilanın parçasını taşıyabiliyor.

**KURAL (yeni):** bir veri alanı türetilmişse (keyword/dizin eşleşmesi),
YAYINDAN ÖNCE kendi kaynak metnine karşı doğrulanır. Doğrulama oranı
raporlanır; %100 değilse ya alan düzeltilir ya yayımlanmaz. Özellikle
il/ilçe adları ortak isim ("havza", "güney", "çardak") ve kişi soyadı
("Özalp") olabilir — eşleşme tek başına dayanak değildir.

### Aynı gün, kapsam daraltmasıyla yayımlandı
Kullanıcı FAZ 3 kanıtını görüp kapsamı daralttı: kayıtlar **il iddiası
olmadan** /arsiv/'de tek liste + "hangi ile ait olduğu doğrulanmadı" şerhi.
Riskli alan (il ataması) düştü, kaydın kendisi görünür oldu — durdurmanın
doğru cevabı "hiç yayımlama" değil, **iddiayı taşıyan alanı çıkarmak**mış.

Aynı tuzak "saha adı"nda da çıktı: `saha_adi` alanı 0/23, pasajdan çıkarım
11/23 ama temiz yalnız 6/23 (%26) — kalanlar bakan soyadı öneki ("ÖZDEMİR
Erzurum Ovası…", "UYSAL SAMSUN…") ya da tarih parçası taşıyordu. Alan
üretilmedi; RG'nin kendi metni alıntılandı.

### Görsel kalem kurmanın ön koşulu: ölçümü önce deterministik yap
Hero'da 6 sahne döndüğü için "kalem kur" demeden önce ölçüm anını
sabitlemek gerekti. Çözüm: `reducedMotion: 'reduce'` — Hero motoru zaten
`if (!AZALT)` ile korumalı olduğundan sahne 0'da donuyor; üstüne animasyon/
geçiş dondurma CSS'i ve sabit viewport+DPR. 8 ölçüm 3 turda bit-eşit çıktı.

Bu sabitleme aynı turda **gerçek bir arıza** buldu: reduced-motion'da
`.v2-videolar { display:none }` (bugünkü hero yazımından kalan ölü kural)
kadrajı tamamen gizliyordu — hareket-azaltma kullanan ziyaretçi sahneleri
hiç görmüyormuş. Determinizm için seçilen mod, kendi başına bir denetim
yüzeyi oldu.

**Vekil kriter yakalandı (G5):** ilk tasarım "tüm başlıkların sol kenarı
aynı olsun" diyordu ve ana sayfada 240px "sapma" verdi — oysa bu v0'ın iki
meşru hizalama ailesiydi (ortalı 384 / sola dayalı 144). Ölçü gerçek
değişmeze çevrildi: "`margin:0 auto` ile ortalanan blok gerçekten ortada
mı?" Bugünkü arıza da tam buydu.

**Eşikler dayatılmadı, ölçüldü:** 13 sayfa × 2 kırılımda doğal varyans
hesaplandı (G1/G5 doğal 0; G4 aynı şablonun farklı sayfalarında değişiyor →
taban sayfa-başına). Her eşik doğal varyansın üstünde, gerçek arızanın çok
altında.

**KURAL (yeni):** görsel/düzen kalemi kurmadan önce (a) ölçüm 3 tekrarda
bit-eşit olmalı, (b) eşik doğal varyanstan türetilmeli, (c) her kalem
kasıtlı bozmayla KIRMIZI verdiği ölçülerek gösterilmeli. Falsifikasyonu
geçmeyen kalem yayına girmez — G2'nin ilk sabotajı kalemi ateşleyemedi,
sebep kalem değil sabotaj yoluydu (ızgara sütunu genişlemeyi engelliyordu);
sabotaj düzeltilip kalem doğrulandı.

### Hero işinde kanıt kaybı (benim hatam) + kurtarma
Merge sonrası hero worktree'sini KAREKANIT klasörünü arşivlemeden sildim;
deploy yeni hero'yu bastığı için ÖNCE kare dizisi kalıcı kayboldu (yeniden
üretilemez). Kurtarılan: SONRA dizisi main dist'inden deterministik olarak
yeniden üretildi (cikti/denetim/hero/sonra/, 7 kare); ÖNCE'nin ölçüm
SAYILARI raporda yazılı; en yakın vekil kareler cikti/denetim/pazarlama/
(bugünkü eski-hero kareleri). KURAL (pekiştirme): worktree silinmeden önce
cikti/ altındaki kanıt klasörleri ana depoya kopyalanır — "silme öncesi
bakma" kuralı kanıt klasörlerini de kapsar.

### Hero "saha kadrajı": şikâyetin kökü tasarımda değil reset'teydi
Kullanıcının üç şikâyeti ölçümle üç köke indi: (1) H1 72px + başlık bloğu
sahnenin %19'unu örtüyor; (2) 832×464 kaynak ×1,77 upscale; (3) `.v2-sayfa
* {margin:0;padding:0}` reseti 0-2-0 özgüllükle TÜM tekil-sınıf kurallarını
eziyor — v0'ın bölüm padding'i ve ortalaması aylardır hiç uygulanmamış,
"dağılmış" görünümün nedeni buymuş. Reset `:where()`e alınınca v0 ritmi ilk
kez devreye girdi ve mobil boşluklar büyüyünce S1 bozuldu (830) — üç sıkma
turuyla 736'ya çekildi.

**KURAL (yeni):** sayfa-kapsamlı `* { margin:0 }` reseti yazılacaksa
`:where()` içinde yazılır (özgüllük 0) — aksi hâlde sonra yazılan her
tekil-sınıf boşluk kuralı sessizce ölür ve "uygulandı sanılan" tasarım
hiç render olmaz. Belirtisi: computed padding/margin'lerin kural varken 0
ölçülmesi.

### Satış raporlarının uygulanması: "harfiyen" ile "sabit sayı yazılmaz" barışı
Üç satış raporunun metinleri (H1, alt satır, öz-cevap, rehber kapanışı)
brief gereği HARFIYEN uygulandı. Çelişen kural: sabit sayı yazılmaz.
Çözüm deseni: onaylı cümle sabit durur, içindeki her sayı build'de veriden
sayılıp cümledekiyle KARŞILAŞTIRILIR; tutmazsa build düşer. Böylece ne
sessiz bayatlama olur ne onaysız metin değişimi — veri değişince insan
karar verir. (anasayfa-satis.js, kapi.js U3 bekçileri, RehberKapanis.)
U2'de brief'in öngördüğü mobil kırılma ölçümle doğrulandı (ilk soru
716→1502) ve istisna CSS order ile çözüldü; masaüstü DOM sırası değişti,
mobil görsel sıra korundu.

### RG sayı çıkarımı: türetilmiş alan nasıl yayımlanır
Aynı gün açılan iş kalemi kapatıldı — gazete sayısı künyeli kayıt 109 → 363/419.
Yöntem basitti (arşiv URL dosya adı = gazete sayısı), asıl mesele **çıkarımı
yayımlanabilir kılan disiplin**:

1. **Hipotezi yanlışlanabilir yerde sına.** 109 başlık kaydında hem sayı hem
   URL var → türetim orada test edilebilir. 109/109 eşleşti.
2. **Döngüsellik kontrolü.** %100 eşleşme, pipeline sayıyı zaten URL'den
   üretiyorsa anlamsız olurdu. Üretici okundu: `rg_sayi` API'nin
   `resmiGazeteSayisi`, `kaynak_url` ayrı `url` alanından geliyor —
   bağımsız, kıyas geçerli.
3. **İkinci, farklı türden kontrol.** Gazete sayısı tarihle artar; 109
   bilinen çiftte ihlal 0, türetilen 254 sayının 254'ü eğriye oturdu.
4. **Rakip yöntemi ele.** Pasajdan "Sayı: NNNNN" çıkarımı 30 örtüşen kayıtta
   29 uyuştu, 1 çatıştı (26.07.1977: URL 16008 / pasaj 18001 — eğri 1977 için
   ~16000 der, 18001 ≈ 1983; iki sütunlu tarama OCR'ı bozmuş). Tek
   doğrulanamayan çatışma alanı güvenilmez kılar → pasaj yöntemi reddedildi.
5. **Kontrolü kalıcılaştır.** K1 her build'de koşuyor; RG arşiv şeması
   değişirse build düşer. Falsifikasyon: türetime +1 sapma → exit 1.
6. **Türetilmiş olduğunu göster.** Sayılar `*` ile işaretli ve yöntem şerhi
   sayfada; türetilemeyen 56 kayıtta alan BOŞ bırakıldı, doldurulmadı.

**KURAL:** türetilmiş alan yayımlanabilir — ama ancak (a) bağımsız zeminde
doğrulanır, (b) doğrulama döngüsel değildir, (c) ikinci bir kontrol türü
geçer, (d) kontrol build'e gömülür, (e) türetim olduğu okuyucuya görünür.
Beşi eksikse alan boş kalır.

### Ölçüm aracının kendi körlüğü
Kontrast ölçeri yalnız `rgb()` ayrıştırıyordu; v2 paleti `oklch()` olduğu
için ana sayfada 14 metin düğümünün 13'ü **sessizce** atlandı ve "kontrast
temiz" görüntüsü doğdu. Düzeltme: CSS Color 4 dönüşümü + **çözülemeyen renk
sayacı** (atlanan düğüm artık build'i düşürüyor). Aynı turda "sağ taşan öğe"
sayacının da yanlış alarm ürettiği ölçüldü (main tabanında da 12 öğe — hero
poster/video scale, overflow:hidden ile kırpılıyor); eşik yatay kaydırmaya
çevrildi.

**KURAL (pekiştirme):** bir ölçüm "temiz" diyorsa, ölçemediği düğüm sayısını
da söylemeli. Sessiz atlama, geçen testten daha tehlikelidir.


## 2026-07-28 — gece paketi + kullanıcı kararları (K1-K9)

**Merge:** 19 commit, canlıda doğrulandı. Tam döküm: `GECE-RAPORU.md`.

### Gecenin asıl bulgusu: izleme yapılandırması siteden geri kalıyor
Üç bağımsız kontrol aynı sebeple yanlış alarm veriyordu — DOM/tasarım
değişti, ona bağlı yapılandırma güncellenmedi:
- **md4** (dün teşhis edildi) `#world .sw-scene` arıyordu, v2 hero
  `#v2-videolar` kullanıyor.
- **md12** silinmiş `#sv-menu`/`.sv-menu-ac` arıyordu → **menü aylardır hiç
  test edilmemiş**; 24.07 menü arızasının senaryosu açıkta kalmış. Kontrol
  her koşuda kırmızı verdiği için "bilinen arıza" sayılmaya başlamıştı.
  PaylasilanMenu DOM'una revizyondan sonra 4/4 geçiyor.
- **md10** GRACE tazeliği yapısal olarak imkânsız bir şart koşuyordu:
  `grace-turkiye.json` cron koştuğunda değil GSFC yeni MASCON sürümü
  yayımladığında (~aylık) değişir; 8 günden eski olması sağlıklı sistemde de
  normaldir. md10 tümden kaldırıldı — veri tazeliği bekçinin işi.
- İkinci sıra etki: tek bir kırmızı `sonBasariliKosu` damgasını donduruyor,
  bekçi de "sağlık sistemi koşmuyor" diye **ikinci** bir yanlış alarm
  üretiyordu (27.07 sabahki UYARI-SAGLIK.md tam olarak buydu).

**KURAL (yeni):** her DOM/yeniden-tasarım işi, ona bağlı izleme
yapılandırmasını da günceller. Bir kontrol üst üste kırmızı veriyorsa önce
"kontrol mü bayat" sorulur; "bilinen arıza" etiketi kontrolü köreltir.

### Ölçümün varsayımı çürüttüğü üç yer
1. **TWI** — dizi sayımıyla 5,76 GB / 5,9 GB "kıl payı sığıyor" çıkmıştı.
   Kabul edilmedi, gerçek ölçek testi koşuldu (1x1/2x2/3x3 karo): maliyet
   süperlineer, bellek marjinali 54,3 MB/Mpx → mozaik **~12,6 GB**. Kapı
   geçmedi. Bayat "2C/4GB" gerekçesi de ölçülen değerle değiştirildi.
2. **OpenAlex** — "birkaç saat sonra tek koşu tamamlar" varsayımı yanlıştı.
   Gerçek: kredi tabanlı kota (1000 kredi, 10/istek, `retry-after: 4174`).
   Saniyelik merdiven bu pencereyi asla aşamazdı. `Retry-After` başlığı
   okunur oldu → 32 il tek koşuda indi, 81/81.
3. **Faz I koordinat eşlemesi** — ±2 satır penceresi komşu kuyunun
   koordinatını kapıyordu (TR04050208'e tablo 2. satırının koordinatı
   atanmıştı). Aynı-satır kuralına geçildi. UTM dilimi de PDF'lerin çoğunda
   beyan edilmiyor; havzanın doğrulanmış il kümesine düşme şartıyla seçildi.
   Dönüşüm, PDF'in kendi ondalık derecesini taşıyan 224 satıra karşı
   doğrulandı: sapma ortanca 191,9 m (ED50↔WGS84 datum farkı).

### Vekil kriter yasağı üç kez devreye girdi
- Gerileme denetiminde "iç link" ham `href` sayıyordu → 10 rehber sayfasında
  **yanlış gerileme**; kaybolan "link" Cloudflare'in enjekte ettiği
  `/cdn-cgi/l/email-protection` idi. Süzüldü → gerileme 0.
- llms.txt URL sayacı satır başı arıyordu → iki tarafta da 0 sayıyordu
  (sahte eşitlik). Metnin tamamı: 173 = 173.
- md13 sayfa başına 400 düğüm sınırına dayanınca **susuyordu** (sessiz kap
  yasağı ihlali, kendi denetimimizde yakalandı). Kırpma gerçekti: rehber
  sayfasında 143 düğüm ölçülmüyordu. Sınır 1500'e çıkarıldı.

### Hukuki kalem
Nisan 2026 Su Kanunu Taslağı bulundu (TOBB üst yazısı 24.04.2026, 17 sayfa
taslak metni). **Üst yazı kamuya açık yayımı men ediyor.** Kullanıcı kararı:
yalnız izleme — belge depoya girmez (veri/ham/, gitignore), siteye içerik
basılmaz, istek görgüsü değişmez. İlk taban elle alındı ki ilk canlı koşum
sahte "yeni belge" alarmı üretmesin (kanıt: gerçek `izle_pdfhead` metni
canlıya karşı koşuldu → 🟢 tamam, olay 0).
Yan bulgu: izlenen eski hedef 2019 sürümünü gösteriyor (Last-Modified
31 Eki 2019) — yeni taslağı asla göremezdi. F4-8 kapandı.

### Kapanan kuyruk maddeleri
md4/md12/md10 yanlış alarmları · K2 sağlık paketi · F4-3 (Last-Modified) ·
F4-8 (taslak izleme) · OpenAlex 32 il · ilçe dizini çapraz doğrulama (0 fark,
TÜİK engeli kalkmış) · imlec.js kalıntısı · RG izleme cron'u (kuruldu) ·
NHYP yayın nöbetçisi (kuruldu) · md13 kontrast bulguları.

### Açılan kalemler
Ana sayfa öz-cevap kararı · /harita/ h1 yok · public/s/*.js build hattı
dışında (kopyalanma direnci m.1-2) · SIRADAKILER hijyeni (910 satır) ·
BRIEF.md yol haritası bayat · nöbetçilerin bekçiye bağlanması · havza-bazlı
TWI briefi.

## 2026-07-14
- İş 1 (önceki oturum): 25 havza sayfasının tamamı havza-veri.json
  künyelerinden üretildi (commit 6aa5117).
- İş 2: il/kurum katmanı — data/il-kurum.json derlendi: 81 il → 26 DSİ
  bölgesi (her bölgenin resmî görev alanı sayfasından; 16. Bölge Ilısu
  Projesi'yle sınırlı, il ataması yok) + 25 havzanın il listeleri (SYGM
  tanıtım PDF'leri; eksik kalan Meriç-Ergene/Marmara/Batı Akdeniz/Batı
  Karadeniz/Asi doğru dosya adlarıyla SharePoint REST üzerinden bulundu;
  Fırat-Dicle listesi Fırat+Dicle alt havzası taşkın yönetim planlarından,
  Seyhan ve Konya Kapalı TÜBİTAK MAM HKEP il tablolarından) + 30
  büyükşehir su idaresi. Havza sayfalarına "İller ve yetkili kurumlar"
  bloğu, kuyu-ruhsati rehberine 81 il tablosu (IlKurumTablosu.astro)
  eklendi.
- İş 4: menü + içerik sayfaları görsel yenileme (su hissi) — public/s/
  altında 4 modül: imlec.js (damla imleç, lerp+durumlar, /harita/ hariç),
  su-sim.js (raw WebGL2 dalga simülasyonu, RG16F ping-pong; FPS<45 grid
  yarıya, <30 fallback; three.js gerekmedi), menu.js (tam ekran overlay,
  lazy sim, focus trap, ESC, scroll kilidi), sayfa.js (tek-observer
  reveal + sentinel'li yüzen nav). UstMenu tam ekran menü kazandı;
  Sayfa.astro'ya hero şeridi + blockquote/tablo/ayraç rötuşları; üç
  indeks "dergi" satır anatomisine geçti (numara + havzalarda veri
  rozeti). Landing'e tek satır imleç script'i; landing/harita görsel
  olarak korundu. Doğrulama (arac/tasarim-dogrula.mjs): 0 konsol hatası,
  sim canlı ~62 FPS, ESC/focus/reduced-motion/no-JS geçti, 42 iç link
  0 kırık, Lighthouse performans 96 (CLS 0.02). Yeni JS toplam 7,1 KB
  gzip (sim dahil). Kullanıcı onayı bekliyor.
- DERS (canlı test başarısızlığı): menü su simülasyonu, imleç ve hero
  şeridi headless denetimden geçti ama canlıda başarısız bulundu.
  Kök nedenler: (1) GPU'suz headless'a bakıp "çalışıyor" denmesi — oysa
  simülasyon fark edilmeyecek kadar kısıktı (ambient g=0.012/1.6s) ve
  FPS ölçümü menü giriş animasyonu sırasındaki karelerle yapılıp gerçek
  tarayıcıda erken+kalıcı fallback'e düşebiliyordu; (2) imleç CSS
  gradient'inin yumuşak alfa kenarı 12px'te "bulanık gri topak" görünümü
  vermesi; (3) hero degrade/konturunun görünmezlik sınırında kısılması.
  Düzeltme b32f7fa; üç yeni kural CLAUDE.md'de (GPU, görünürlük, iş
  kapanış).
- İş 5: tarayıcı öz-denetim altyapısı — @playwright/mcp@0.0.78 global
  kuruldu (18 MB; tarayıcı önbelleği zaten mevcuttu, 646 MB); .mcp.json
  headless chromium_headless_shell'e --executable-path ile bağlandı
  (MCP varsayılanı Chrome arıyor, yok). stdio smoke-test geçti; çalışır
  durumda RAM ~560 MB (MCP node ~210 + chromium süreçleri ~350).
  Protokol CLAUDE.md'ye eklendi; MCP'siz oturumlar için arac/oz-denetim.mjs
  (konsol + iç link + tam sayfa görüntü + menü etkileşim testi; headless
  yazılımsal-GL sürücü uyarıları etiketlenip ayrı sayılır). Deneme
  denetimi: 3 sayfa, 0 hata/uyarı, 31 iç link 0 kırık.
- İş 3: mevzuat rehberleri paketi — Apilex çıktısı (14.07.2026)
  kaynak/apilex-sumevzuat.md olarak kaydedildi; 9 rehber üretildi
  (kuyu-ruhsati, ruhsatsiz-kuyu-cezalari, kaynak-suyu-kiralama,
  su-tahsisi-oncelik-sirasi, yeralti-suyu-isletme-sahasi,
  kaynak-hakki-komsu-su, kuyu-belgesi-iptal-davalari, jeotermal-ruhsat,
  baraj-kamulastirmasi); taslak-takibi'ne Bölüm 12 tespiti ("su tahsis
  belgesi"/"su verimliliği belgesi" yürürlükte yok) eklendi. Karar
  künyeleri DOĞRULANMADI — yayın kilidi SIRADAKILER 17'de.

## 2026-07-12
- Repo sıfırdan kuruldu (önceki oturumun dosyaları kaydedilmemişti): derin-su
  landing, DESIGN.md, deploy dosyaları (_headers, robots, 404, favicon, og).
- Harita v1: Vite + MapLibre, il GeoJSON'u, hover/dokunma + bilgi kartı.
- Harita v2: AWS terrarium DEM ile koyu hillshade, Natural Earth nehir/göl
  katmanı, yükleme durumu.
- Kullanıcı atlas stilini seçti: v3 başladı — offline hipsometrik boyama
  (gdaldem, arac/atlas/), harita adası düzeni, atlas dili kart, kabarcık
  atmosferi (yoğuşma varyantı elendi). Canlı S3 tile bağımlılığı kaldırıldı.
- Harita v4 Faz 1: Three.js gerçek 3D arazi — heightmap (16-bit PNG + bin),
  CPU displacement, atlas dokusu, sınırlı orbit + paralaks, şeffaf sahne.
  MapLibre kodu src/harita-2d/ arşivinde. Faz 2 (gayzer) ve Faz 3 (cila)
  FAZ2.md/FAZ3.md'de tanımlı. Not: headless FPS ölçümü yazılım render'ı,
  gerçek GPU'da doğrulanacak.
- Faz 1 görsel düzeltme: pitch ~57°, kadraj dolduruldu, abartma 4.2x, alçak
  açılı ışık + NeutralToneMapping, kenarlar alphaMap+vignette ile suya
  çözünüyor. WebGL yoksa statik atlas yedeği eklendi.
- "Canlı model" turu: animasyonlu deniz/göl shader'ı (atlas maskesi, güneş
  parıltısı, kıyı geçişi), bulut gölgeleri (fragment enjeksiyonu), kamera
  idle drift, güneş salınımı, sürekli yaşayan gayzerler (işaret ışımaları +
  periyodik kendiliğinden fışkırma), kenar eteği geometrisi (alphaMap/vignette
  kaldırıldı), exposure 1.32. Geometri sağlığı denetlendi: 4.2x'te artefakt yok.
- Faz 2: gayzer etkileşimi — 7 su noktasında (göller/barajlar) hover/dokunma
  ile additive partikül sütunu + taban ışıması; reduced-motion'da statik
  işaret. 60 FPS doğrulaması gerçek GPU bekliyor (FAZ2 bitti tanımının
  açık kalemi).
- Faz 3A: giriş animasyonu (kamera uzaktan kadraja süzülür, reduced-motion
  atlar), mobil portre kadraj sığdırma (dinamik fov+mesafe), göl geometrileri
  tek mesh'e birleştirildi, mobil pixelRatio 1.5, FPS logu 5 örnekle sınırlı.
  3B (koreografi, seçim etkileşimi, son cila) kullanıcı yorumunu bekliyor.
- VIZYON.md oluşturuldu (Sondaj Anı + ileri teknikler envanteri); madde 1
  prototipi eklendi: gayzer tepe noktasında cam sıçraması (cam.js).
- Faz 3B: kamera koreografisi — su noktasına tıklayınca sinematik dalış,
  boşluğa/aynı noktaya tıklayınca kadraja dönüş; uçuşlar duvar saatiyle
  (yavaş cihazda süre sabit), uçuş sırasında OrbitControls devre dışı.
- Landing turu: Arslan kalkan logosu (arslanhukuk.tr assets'ten, currentColor)
  bakır imza olarak footer'a işlendi (tamamı arslanhukuk.tr'ye link);
  koreografiye imza dokunuşu eklendi — son kelime otururken altından tek
  akuamarin damar ışıyıp geçiyor.
- Nesne turu (v5): Türkiye sınırla kesilmiş extrude blok (üst rölyef +
  katman çizgili yan kesit + kapalı taban; sinir.py il birleşimi).
  Maskedeki il-arası sliver delikleri kapatıldı. Atlas doygun kalibre
  edildi (poster referans dosyası bulunamadı, hex bantlarına göre).
  Gayzerler haritadan kalktı, kenar fıskiyelerine dönüştü; su noktaları
  iki katman işaret (var/potansiyel) + krem etiket. Deniz ayrı yüzey,
  ufukta koyuya çözünüyor. EffectComposer bloom + ACES; orbit yaw ±60.
- Nihai sahne kurgusu (v6): deniz tepsisi kaldırıldı — Türkiye kütlesi koyu
  derin-su zeminde boşlukta, altında siluet ışıma havuzu. Kamera sabitlendi
  (orbit kapalı; dalış koreografisi kurgu gereği kaldırıldı), idle nefes +
  ±1° paralaks. Kenar gayzerleri ekran alt kenarına nefesli zamanlamayla
  yerleşti; yukarıdan 5-8 sn'de bir süzülen damlalar + çarpma parıltısı.
  İşaretler belirginleştirildi, kesit yumuşak sıcak toprağa çekildi.
- HEDEF.png atmosfer turu (7 iterasyon, kiyas-1..7 + kiyas-son):
  tüm karalar geri (kara maskesi), mat gri-yeşil su + güney teal, sıcak
  alçak ışık + altın çekirdek (radyal), yeşil kıyı/zeytin/altın/kızıl
  bantlar + orman benekleri, gölge + DOF + asılı damla bulutları + cam
  kavis gayzerleri; sonda-imleç spot ışığı eklendi. Mobil portre kadraj
  ortalandı.
- Yön değişikliği: 3D sahne src/harita-3d/ altına arşivlendi; /harita/
  hero'su artık HEDEF.png'nin kendisi (public/hedef-hero.webp q90, dokunulmadan,
  fade-in + preload; orijinal PNG referans/ altında repoda).
- Bant sorununa kesin çözüm: ImageMagick ile gerçek blur zemin dosyası
  (hedef-zemin.v1.webp) üretildi; koyu body zemini kaldırıldı; sürümlü
  dosya adlarıyla cache-bust. 1440x900 + 1280x1024 + mobil doğrulandı.

## 2026-07-14 (pazarlama danışmanlığı)
- GitHub skill kazısı: 25 aday puanlandı; marketingskills (39k★) +
  claude-seo (11k★) ~/.claude/skills/ altına kuruldu ve doğrulandı.
- 3 persona tanımlandı, 11 sayfa canlıda tarandı (0 hata, 0 kırık link),
  rapor/pazarlama-danismanligi.md yazıldı — salt analiz, site değişmedi.

## 2026-07-15 (Dalga 1: pazarlama raporu uygulaması)
- Landing çıkmaz sokaktan çıktı: üst nav + üç kapı; "Yakında" kalktı,
  sahne/koreografi korundu (kapı zemini damarlar metni kesiyordu, koyultuldu).
- E-E-A-T: künye satırı, yazar kutusu, Article/Person/Breadcrumb/Organization/
  WebSite JSON-LD (130 nesne, schema.org sözlüğüne karşı doğrulandı), og:image
  (marka fontlarıyla Playwright'ta üretildi, arac/og-uret.mjs).
- Rehber ağı: ilgili rehberler + süreç/uyuşmazlık kümeleri; Sakarya hukuk
  bloğu pilotu (havzaya özgü kısıt: doğrulanmadı — uydurulmadı).
- Yazdırma düzeltmesi kanıtlandı: print medyasında gizli .sv-reveal = 0/36.
  Not: PDF metin çıkarımı görünürlük kanıtı DEĞİL (saydam metni de çıkarır);
  yük taşıyan ölçüt hesaplanmış opaklık.
- AÇIK: bülten (Buttondown hesabı kullanıcıda), FAQPage (görünür SSS yok).

## 2026-07-15 (Dalga 2: menü vitrini)
- Tam ekran menü "5 çıplak link"ten keşif yüzeyine: sol bölümler +
  alt-etiketler, sağ vitrin (son rehberler, kanun son durumu, öne çıkan
  havza) — tümü build-time türetilir, elle metin yok (kanıt: kaynak→menü
  eşlemesi 5/5). Kademeli giriş tek sekans (75ms), KAPAT belirginleşti.
- İki menü kodu tekilleşti: /harita/ Astro sayfası oldu, ortak TamEkranMenu +
  menu.js kullanıyor; sayfanın kendi görünümü aynen. Kod incelemesinde kendi
  hatam yakalandı: transform'lu overlay içinde fixed katmanlar kaydırmada
  kayardı — kaydırma iç sarmalayıcıya alındı, KAPAT sabitliği testle kanıtlı.

## 2026-07-16 (HENDEK FAZ 1: EPİAŞ baraj pipeline)
- EPİAŞ dams endpoint'leri doğrulandı (aktif doluluk % + kot + hacim,
  havza parametreli; auth=TGT; 401 auth'suz teyitli; lisans "kaynak
  göstererek" — girişli ekran teyidi kullanıcıda). Pipeline sıfır
  bağımlılık: ham arşiv değiştirilmeden + normalize seri + günlük cron.
- Uydurma yasağı koda gömüldü: geriye dönük veri üretilmez, başarısız gün
  "veri alınamadı" işaretlenir, ortalama yalnız gerçek kayıttan "N gün"
  ibaresiyle. Mock testte iki yol da kanıtlandı; görsel kanıt alınıp test
  verisi iskelete döndürüldü. Gerçek çekim kullanıcının .env'ine kilitli.
- Kimlik geldi → İLK GERÇEK ÇEKİM: TGT 201, 17 havza / 116 baraj / 64 kayıt;
  kayıt başlangıcı 16.07.2026. EPİAŞ seti sitedeki 25 havzanın 17'sini
  kapsıyor (Fırat-Dicle yok — kaynak şerhi düşüldü). Cron yarın 18:00 TR'de
  devralır.

## 2026-07-16 (HENDEK FAZ 1-B: GRACE su nabzı)
- Kaynak yarışı test edildi: GSFC mascon AÇIK (200, tokensız) kazandı;
  JPL 302→login, CSR 000, UNL yalnız PNG. 530MB NetCDF indirildi (sha256
  git'te; ham dosya GitHub 100MB limiti nedeniyle sunucu arşivinde).
- 25 havza alan-ağırlıklı TWS anomali serisi çıkarıldı (254 gerçek ay;
  34 eksik ay dolgusuz). Sakarya son 5 yıl: -0,70 cm/yıl (60 aydan).
  Havza sayfalarına eğilim göstergesi + tam şerh seti; haftalık cron.
- VARSAYIM DÜZELTMESİ: GRACE "yeraltı suyu" değil TOPLAM su depolaması
  değişimi ölçer; site dili ve başlık buna göre kuruldu (dur/sor yerine
  raporla kuralı gereği not düşüldü).

## 2026-07-16 (280 karakter öz-cevap katmanı)
- "Cevap önce, dayanak sonra" (CLAUDE.md) 9 rehber + 25 havza sayfasına
  geriye dönük uygulandı: başlık altında damıtılmış öz-cevap kutusu
  (akuamarin kenar, su-tonlu zemin). Rehber özleri elle her sayfanın
  DOĞRULANMIŞ metninden damıtıldı (madde no korundu, künye no verilmedi —
  hepsi "doğrulama sürecinde"); havza özleri havza-veri.json + GRACE
  eğiliminden otomatik türedi (eksik alan jenerikle doldurulmadı).
- Meta description'lar artık öz-cevaptan türüyor (rehberde Article JSON-LD
  description de). Kanıt: meta==kutu 34/34; uydurma kontrolü — öz-cevaptaki
  her madde/kanun no kaynak metinde mevcut, hiçbirinde dava künyesi yok;
  liste/statik sayfalara sızıntı yok; build temiz.

## 2026-07-16 (HENDEK FAZ 2: il rejimi — araç + 81 il sayfası)
- Tek mimari kuruldu: il-profil.js üreticisi hem /arac/il-rejimi/ aracını
  hem /kuyu-ruhsati/[il]/ statik sayfalarını besliyor (çift bakım yok);
  GRACE eğim hesabı da grace-hesap.js'te tekilleşti.
- İnce içerik eşiği dürüst uygulandı: 81/81 il 3+ gerçek unsurla geçti.
  Duplicate/uydurma/sitemap/JSON-LD kontrolleri temiz; JS'siz erişim
  kanıtlı. Build 125 sayfa.

## 2026-07-16 (Tasarım anayasası FAZ 0)
- DESIGN.md 2.0: zanaat sistemleri eklendi (font üçlüsü + mono öneri
  gerekçeli, kicker imzası, kart kimlikleri düz-ton kararıyla, tanımlı
  easing/durum sözlüğü, veri bandı, iki hız sınıfı, başarısızlık listesi).
  Eski "akuamarin aydınlıkta yasak" kuralı çift-ton kuralına evrildi.
- /stil-pilot/ örnek sayfası yayında (noindex): kuyu ruhsatı rehberi yeni
  dille. Cormorant'ta ₺ glifi yok bulgusu → veri bandında rakam "0"a
  çevrildi. FAZ 1-3 kullanıcı onay kapısının arkasında.

## 2026-07-16 (Yön yükseltmesi: SU-DİLİ FAZ 0 tamamlandı)
- Anayasa 3.0: dil suyun kendisinden — derinlik skalası HEDEF görselinden
  px-örneklemeli (yüzey #E9EBE7 / sığ #4F7B78 / derin #175E56 / dip
  #0C332C), akuamarin kıyasta elendi; 4 su-ivmesi eğrisi; kırılma
  vurgusu; kot cetveli; TEK MOD; kıyaslar (2 skala + 2 tipografi) kayıtlı.
- HEDEF sahnelendi: 1x/2x AVIF(85/179KB)+WebP+JPEG + 488B LQIP; iki menü
  varyantı (A sol-üst dikey / B alt-kenar yatay), renkler görselden,
  AA kanıtlı, overlay çalışır. Denetimde 2 başarısızlık yakalanıp
  düzeltildi: dokunma hedefleri 37→47px; A'nın alt linkleri kara
  dokusuna taşıyordu → kolon gök bandına sıkıştı, mobilde denize inip
  köpüğe döndü. WebGL rafa.

## 2026-07-17 (SU-DİLİ FAZ 1: 116 iş sayfası giydirildi)
- 5 tür 5 commit'te (kesinti dayanıklılığı): çekirdek token seti v3
  skalasına (Sayfa.astro — tüm sayfalar tek merkezden), kicker/BÖLÜM/
  kırılma vurgusu/kot cetveli/kart aileleri türlere yayıldı; koyu dünya
  (menü+su-sim shader) DİP paletine geçti.
- Denetim 4 başarısızlık yakaladı, dördü düzeltildi (çifte bant, scrim
  z-index, 26px dokunma hedefi, 4.42:1 kontrast). Lighthouse: il sayfası
  4×100, rehber 97/100. Görsel slotlar tek-config sözleşmesiyle hazır.

## 2026-07-17 (CC root→suha taşıma)
- Proje mv+chown ile /home/suha altına (güvenlik-doğru: /root'a traverse
  izni açmak yerine tam izolasyon). Tüm hardcoded /root/ yolları güncellendi
  (grep=0), playwright cache kopyalandı. suha: sudo+SSH+CC bypassPermissions.
- Pipeline suha'da uçtan uca kanıtlandı; baraj-gunluk.sh'te önceden var olan
  bir bug bulundu (git add UYARI-BARAJ.md yokken exit 128 → günlük veri hiç
  commit edilmiyordu) ve düzeltildi. Cron suha'ya taşındı, root boşaltıldı.
- Güvenlik: token remote URL'den credential store'a alındı (borç kapatıldı)
  AMA token çıktıya sızdı → İPTAL+yenileme kullanıcıda.

## 2026-07-21 (HATA KAYDI + KURAL: brief ön-denetim kontrol listesi)
- HATA: Menü reformu brief'inin ilk sürümü denetlenemez/belirsiz şartlar
  taşıyordu (bit-kıyas beklentisi, gerçek cihaz testi, tanımsız breakpoint,
  "mock bulunur" varsayımı). DERS: denetlenemez şart briefe yazılmaz —
  ölçülebilir kritere çevrilir ya da açık şerhle kullanıcıya devredilir.
- YENİ KURAL (her brief tesliminden ÖNCE zorunlu ön-denetim listesi):
  1. Her referans (dosya, mock, commit, yol) somut mu, yoksa "bulunur
     varsayımı" mı?
  2. Her bitti-tanımı/şart ortamda GERÇEKTEN denetlenebilir mi?
     (denetlenemezler ölçülebilire çevrilir ya da kullanıcıya devredilir)
  3. Belirsiz parametre kaldı mı? (breakpoint, eşik, tolerans — tanımsızsa
     "dur ve sor")
  4. Kapsam dışı liste tam mı, brief kendi içinde çelişiyor mu?
  Bu liste geçilmeden brief teslim edilmez; geçemeyen brief düzeltilir.

## 2026-07-21 (FAZ A-ÖN: landing header birleştirme — tek kaynak)
- Landing public/index.html → src/pages/index.astro; header tek kaynağa
  indi: UstMenu.astro tema varyantı (aydinlik/koyu). Eski dosya silinmedi,
  arsiv/landing-statik/'e taşındı (route çakışması çözümü).
- Görsel değişmezlik kanıtla: pixelmatch %0,000 fark (1440+375, reduced-motion
  deterministik kare), computed-style birebir, canlı↔yerel SEO/GEO diff eşit,
  kelime animasyonu frame dizisiyle aynı. Denetimde 1 gerçek sızıntı yakalandı
  ve düzeltildi (çıplak `nav` seçicisi koyu dala scoped-cid ile sızıp şeridi
  büyütüyordu → `.ust nav`).
- Kanıt: cikti/denetim/faz-a-on/. FAZ A (menü reformu) kullanıcı onayı
  bekliyor; push yok.

## 2026-07-21 (FAZ A+B: site-geneli mobil menü reformu — dar şerit)
- Mock (faz2-sakarya-mobil-menumock.jpeg) tek kaynaktan koda: ≤640px'te
  header tek dar şerit (marka + MENÜ; içerik 226,4→85,8px, landing
  104,6→84,8px, hedef 85±4). Satır-içi linkler yalnız görsel katmandan
  çekildi (DOM'da gerçek <a>, JS'siz crawl); gezinme tam-ekran panelde.
  Yeni JS 0 bayt (davranış mevcut menu.js).
- Denetim CANLIDA DA VAR OLAN bir hata yakaladı: landing'de <main>
  (translateY) header'a binip masaüstünde 5/5 nav linkinin tıklamasını
  yutuyordu → header.koyu z-index düzeltmesi (görsel fark 0 piksel,
  elementFromPoint + pixelmatch kanıtlı).
- Lighthouse ilk ölçümde 85 görüldü → A/B analizi (reform ↔ eski build
  eşzamanlı 3'er tur) dalgalanmanın her iki build'de aynı olduğunu
  gösterdi (medyan 96): localhost gürültüsünü eşik ihlali sanma —
  A/B'siz karar verme. Kanıt: cikti/denetim/menu/. PUSH YOK, onay kapısı.

## 2026-07-21 (FAZ 3: /harita/ canlı veri paneli — 25 havza kartı)
- Hero altına build-time statik panel (HavzaPaneli): kartlar GRACE
  son-5-yıl eğimine göre sıralı ("veri seçer"), eşik A (≤-1,5 → 5 kritik,
  kullanıcı onaylı), mobil iki kolon (onaylı), YAS rezerv satırı dosya
  kanıtıyla havza-bazlı çıktı ve kaldı (brief'in "ulusaldır" tespiti
  dosya doğrulamasıyla düzeltildi). Tahsis 0/25 ve baraj 17/25+5gün
  karta girmedi (veri dürüstlüğü).
- Hero dokunulmazlığı pixel kanıtlı (%0,000, 1440+375); Lighthouse
  medyan 74→75. Doğrulama yine gerçek kusur yakaladı: sparkline düzlük
  ölçüsüne sıfır-çapası karışıyordu (sabit seri "oynak" sanılırdı) —
  seri-yayılımı/çizim-ölçeği ayrıldı, sentetik seriyle test edildi.
- Yön dili mock'taki ara eşikten TEK bakım noktasına (grace-hesap ±0,5)
  çekildi — sayfalar arası dil tutarlılığı mock sadakatinden önce gelir
  (raporda gerekçeli sapma). PUSH YOK; kanıt: cikti/denetim/faz3/.

## 2026-07-21 (KAPANIŞ: sunum reformu zinciri canlı onayı)
- 21.07 push d2fea9d..fd4ec5e canlı; kullanıcı canlı testini bu kaydın
  yapıştırıldığı mesajla onayladı (zincir: 2b, 2c, A-ÖN, FAZ A menü,
  FAZ 3 panel).
- Fable periyodik denetim sayacı: sunum reformu zinciri iş briefi sayımı
  (2b+2c birleşik=2, A-ÖN+A birleşik=2, FAZ 3=1 → +5; önceki 2/5 → 7,
  eşik 5 AŞILDI — yeni tur denetim Fable'da beklemede).

## 2026-07-21 (Opus tarafı: izleme v3 + belge arşivi + Opus paketi A-E)
- Su Kanunu izleme sistemi v3 KURULDU: izleme/ (su-izleme.sh + lib/motor.py +
  hedefler.conf + anahtar-kelimeler.txt), 11 hedef (M1 RG deterministik + M2
  TBMM + M3 Bakanlık/DSİ fark motoru). T1-T5 kanıtlı (KURULUM.md
  cikti/denetim/su-izleme/). Cron 05:30+16:00 UTC kuruldu; saglik-bekcisi'ne
  su-izleme tazelik kontrolü (DURUM.md ≥14s) eklendi. İlk GERÇEK cron fire
  16:00 UTC — canlı teyit beklemede.
- Opus periyodik denetim sayacı: denetim-2 (2ba78e5) sonrası BİTMİŞ işler —
  toparlama v2, kaynak keşfi v2, izleme kurulumu v3 → **+3**. Eşik 5;
  **mevcut 3/5 — henüz aşılmadı.** NOT: Opus paketi (A-E, 5 bölüm) SÜRÜYOR;
  bölüm sayımı PAKET SONU'nda yapılacak (yalnız TAMAM biten bölümler eklenir).

## 2026-07-21 (KAPANIŞ: Opus paketi A-E)
- 5 bölüm tamamlandı (her biri kendi commit'i): A belge arşivi (7abccc1) ·
  B kayıt (5313961) · C UYAP künye teyidi (4a597db) · D SEO/GEO denetim skill
  (b1dcd3e) · E NACE Ek-2 + KAP (f7696d5).
- Şerhler (dürüst kısmi sonuç, uydurma yok): C — meysu taslağında künye yok
  (UYAP sorgusu gereksiz). E — Ek-2 ayrı TARANMIŞ ekte (OCR'sız ayrıştırılamaz,
  liste üretilmedi); KAP API Next.js'e taşınmış, eski byCriteria 500 → erişilemedi
  (sahte kayıt yok). D — ilk taramada 131 sayfa/215 bulgu tespit edildi (düzeltme yok).
- Opus periyodik denetim sayacı: önceki 3/5 + paketin 5 TAMAM bölümü (A-E; hepsi
  deliverable üretti — E şerhli ama tespit/rapor deliverable'ı tam) → **8/5**.
  **Eşik 5 AŞILDI → yeni tur Opus denetimi beklemede.**

## 2026-07-21 (Ödül-üstü Faz 1 + Toplu Canlı v3)
- **Ödül-üstü Faz 1 (Sözlük ve Borç v2)** yapıldı+push (68e340a): koreografi/
  sözlük tek kaynağa (src/styles/hareket.css; .gk kopyası 0), --e-suzul yayılımı
  (HavzaPaneli/harita/Bulten/su-kanunu; istisna adayları landing-shared chrome +
  hero reveal + pilotlar, karar kullanıcıda), sayı-canlanma (public/s/canlan.js,
  opt-in [data-canlan], yalnız gerçek büyüklükler — yıl/küçük sayım hariç,
  kullanıcı kararı). Kanıt: piksel regresyon %0,0000 (12/12), Lighthouse A/B
  düşüş yok (sakarya 87→91, kuyu 82→92, harita 68→70), konsol 0, 375px taşma 0,
  JS bütçe ham gzip 992B/min+gzip 473B ≤1KB (cikti/denetim/faz1-odul/RAPOR.md).
- **21.07 kullanıcı kararı:** bekleyen işler peşin onaylı canlıya; /deneyim/
  menüye; bu kapsam için canlı-öncesi onay kapısı kaldırıldı, kanıt üretimi
  devam eder (İş kapanış kuralı bu brief kapsamında askıya alındı, peşin onay).
- **/deneyim/ menüye** (ayrı commit, Faz-1-sonrası ayrı iş): UstMenu +
  TamEkranMenu tek kaynaklarına "Deneyim" kalemi (mevcutların sonuna). Landing
  masaüstü nav birebir (Deneyim/Vakalar landing'de gizli, A-ÖN şartı; pixel
  1440 %0,0000). Kanıt: 375px kapalı şerit landing 85px/içerik 86px (85±4),
  açık panel yatay taşma 0, panel taşma 0, Deneyim panelde; içerik nav 7 kalem
  700px'te bile taşma 0; /deneyim/ 200. (cikti/denetim/deneyim-menu/)
- src/harita-3d/: arşivde kalır — hiçbir sayfadan import edilmiyor, route
  üretmiyor (teyit edildi); deneyim.astro harita-3d kullanmıyor.

## 2026-07-21 (Ödül-üstü FAZ 7 — Sonuç Zinciri, AŞAMA 0+1+2)
- **AŞAMA 0** (162d182): ODUL-USTU FAZ 7 çatısı (zincir + sektör kapıları +
  pazarlama kanalları) + uygulama sırası 1→7→2→3→4→5 + DİL NOTU (TBB-çekingen
  dil kaldırıldı). data/lead/persona.json (11 persona; yeşil belge son başvuru
  27.12.2029 doğrulandı — yönetmelik md.3 "5 yıl" + yürürlük 2024-12-27).
  NACE Ek-2 (taranmış PDF) + KAP (API taşınmış) uydurulmadı → kullanıcı görevi.
  rapor/: sorgu-haritasi, geo-nabiz-plan, persona-turetme.
- **AŞAMA 1** (88c7a72): 12 madde mock/şablon/iskelet — sektör kapısı+persona
  mock, ceza iskeleti, bülten HTML, Türkiye Su Raporu iskelet, LinkedIn kart
  altyapısı+3 kart, webinar, iç bağlantı planı, künye şema, soru havuzu 40,
  vaka adayları. Kullanıcı onayı: rota /durumum/ + risk dili.
- **AŞAMA 2** (27dd472): /durumum/ giriş (persona ızgara + arama durumum.js
  ≤2KB progressive + eş-anlam) + 11 persona sonuç sayfası (hüküm + sabit tarih
  27.12.2029 + kalan-gün progressive + risk bloğu onaylı dil + ilk adımlar +
  çapraz bağ + iletişim + FAQPage). Menüye Durumum (landing nav birebir). İçerik
  yalnız persona.json (uydurma yok; hukuki [APILEX]). Kanıt: öz-cevap+FAQPage+
  sabit tarih JS'siz DOM; konsol 0; nav/375 taşma 0. Palet ayrı iş (mevcut
  SU-DİLİ değişkenleriyle). Push+canlı; kullanıcı canlı testi açık.

## 2026-07-22/23 (kayıt: palet, güvenlik, cache)
- FAZ 8 palet C canlıda (adc56f2); kullanıcı canlı testi ERTELENDİ — nihai
  görsel onay beklemede.
- Güvenlik taraması (claude-security, tüm repo, medium): doğrulamayı geçen
  bulgu YOK; rapor CLAUDE-SECURITY-20260722-195547/, commit dışı.
- Cache/purge işleri gündem dışı (site inşaat halinde, ziyaretçi yok) —
  canlı kontrolde hard refresh yeter.

## 2026-07-23 (Ana sayfa AŞAMA 1 — 6 sahne + 7 süzülen soru mock'u)
- Kod yok, DUR'lu. Çıktı: cikti/denetim/anasayfa-sahne/ (mock.html + RAPOR.md +
  1440/375 ekran + kıyas kareleri + 3 JSON ham veri).
- ÖLÇÜM: ana sayfa LH tabanı masaüstü 99 / mobil 89 (3 tur medyan, commit
  3900461); LCP elemanı h1, transfer 187KB. Taban yüksek — sahne akışı bunu
  koruyamaz, düşüş seviyesi kullanıcı kararına bırakıldı.
- ÖLÇÜM: kartçık okunaklılığı 6 kare × 3 bölge. A (YÜZEY plakası α.90) en kötü
  11,82:1; B (koyu tül α.75) 6,24:1; brief'te önerilen "yalnız gölge/kenarlık"
  hali 1,07:1 → ELENDİ, B "koyu tüllü" olarak yeniden tanımlandı.
- TESPİT: palet-video uyumsuzluğu gerçek — kare ortanca ton açıları 60/38/147/
  177/21/88°, C ekseni 198°. Kartçık sahneye ait olmayan "enstrüman katmanı"
  olarak tasarlandı; köprü unsuru kehribar.
- 7 hedef link canlıda 200 (3. sorunun hedefi ceza sayfası çıkınca güncellenir).
- Kartçık revizyonu v3 (aynı gün, geri bildirim üzerine): R1 küçültülmüş kartçık
  (%40→%26) ↔ R2 alt şerit üçlü kıyası; çıktı cikti/denetim/anasayfa-sahne/rev1/.
  ÖLÇÜM 1: hedef satırı (kehribar #875518) plaka α .70/.75/.80/.90'da sırasıyla
  2,70/3,06/3,48/4,41 — hiçbirinde AA yok; eşik α≈0,92. Koyu kehribar #6B4412
  α.80'de 4,64 (yeni hex = onay ister). Soru metni her alfada geçiyor.
  ÖLÇÜM 2: yuva haritası — 6 sahne × 5 kare × 20 aday yuva detay enerjisi;
  sahne 2'de tek sakin yuva var → Y2 orada uygulanamaz.
  ÖLÇÜM 3: dokunma — görünmez pad'in ilk hali (::before z-index:-1) hit-test'te
  ÇALIŞMADI, saydam ::after ile düzeltildi; şerit 31px görsel → 44px etkin.
  375'te R1 tüm sorular tek satır; R2'de 7'de 1 soru 4px kırpılıyor.

## 23 Temmuz 2026 — Ana sayfa AŞAMA 2 (kod): 6 sahne + 7 süzülen soru

Ana sayfa yeniden yazıldı. Koyu hero + kelime koreografisi kalktı; 6 sahnelik
scroll-scrub akışı sayfanın açılışı oldu. Sorular R2 alt şeritte: 1440'ta tek
şerit iki yuva (aynı anda 2 soru), 375'te tek yuva; ritim kaydırma yüzdesinden
türer (7 eşit dilim), zamanlayıcı yok. Şerit zemini α.80, hedef satırı yeni
`--kehribar-koyu #6B4412` (DESIGN.md §2'ye eklendi; kritik-vurgu `#875518`
değişmedi). Akış sonunda iniş bölümü: h1 + öz-cevap + 6 persona kartı +
/durumum/ bağı. `/deneyim/` rotası kapandı (301 → /), menüden kalktı; eski
landing ve deneyim sayfası `arsiv/` altına taşındı (geri dönüş yolu açık).

Ölçüm: LH 3-tur medyan masaüstü 99 / mobil 85 (eşikler 85 ve 70). Şerit
kontrastı en kötü karede soru 8,17:1, hedef 4,75:1 — α.80 + `#6B4412`
bileşiminin AA'yı geçen tek bileşim olduğu rev1 bulgusu doğrulandı.

**Ders (yükleme):** motorun `loading="lazy"` posterleri iş görmüyordu — tüm
sahne `<img>`'leri sabit ve kadraj içinde olduğu için tarayıcı hepsini
"görünür" sayıyor. Ölçmeden "lazy" demek yanlış olurdu: ilk yük 8 dosya /
3972 KB çıktı. Poster erteleme + `diveScroll` 1,4→1,6 ile ilk yük 2 dosya /
1657 KB'ye indi. Vendor'a dokunulmadı.

**Ders (denetim):** altı görsel hata yalnız ekran görüntüsüne BAKARAK
yakalandı (krem letterbox, boş rota etiketi, belirsiz şerit okunuşu, ipucu
kontrastı, footer boşluğundan sızan sahne, sabit menünün footer'ı örtmesi).
Sayısal öz-denetim hepsinde "0 hata" diyordu. Ölçüm bakmanın yerini tutmuyor.

## 23 Temmuz 2026 (2) — Canlı test düzeltmeleri: CSP, kadraj, hedef

Kullanıcı canlıda üç belirti bildirdi: sahneler açılmıyor, sağda sahne adları
görünüyor, soru şeridi görülmüyor. Üçü de ayrı arıza çıktı, üç ayrı commit'le
kapatıldı (385be5a, aff6fd2, a45e786).

**Ders (asıl olan):** ana sayfayı "kanıtlanmış" ilan ettim, ama tüm ölçümü
`python3 -m http.server` üzerinde yapmıştım — o sunucu `_headers`'ı
UYGULAMIYOR. Sitenin CSP'sinde `media-src` yoktu; `default-src 'self'` motorun
`blob:` video kaynağını reddediyordu ve 6 sahnenin hiçbiri canlıda oynamıyordu.
Yerelde her ölçüm yeşildi. Üstelik `fetch` 200 dönüyordu (connect-src izinli),
engellenen yalnız decode'du — yani "videolar iniyor" diyen ağ ölçümü de beni
doğruluyordu. Artık `arac/dist-sun.mjs` var: dist'i CSP + _redirects ile
servis eder. **Kural: üretim başlıklarını taşımayan ortamda alınan kanıt,
kanıt değildir.**

**Ders (teşhis):** brief "(a) ve (b) tek arıza olabilir, alt metin görünüyordur"
diye bir hipotez veriyordu. Ölçtüm, çürüdü: tüm sahne `<img>`'lerinde `alt=""`.
Görünen şey motorun rota etiketiydi. Hipotezi doğrulamadan uygulasaydım yanlış
yeri düzeltirdim.

**Ders (iki yönlü hata):** şerit görünürlüğü tek bir "aşağıda kalmış" sorunu
değildi — 1440'ta kadrajı 11px ÖRTÜYOR, 375'te 181px KOPUYORDU. Tek kırılımda
bakıp düzeltmek diğerini bozardı. Çözüm sahne kabını kadrajın kendisi kadar
yapmak oldu; şerit artık her kırılımda kadrajın 12px altında.

**Kaza (kayıt):** revert'lerin temiz uygulandığını sınarken `git reset --hard`
kullandım ve commit'lenmemiş iki cron log dosyasındaki 23.07 satırları gitti
(`data/arsiv/baraj/log/cron.log`, `data/arsiv/grace/log-2026-07.log`).
Veri dosyaları etkilenmedi, loglar sonraki koşuda yeniden yazılacak. Sınama
için ayrı bir worktree kullanmalıydım.

## 23 Temmuz 2026 (3) — Sürekli site sağlık sistemi

Tek script (`arac/site-saglik.mjs`), üç mod, 10 kontrol, iki cron (07:30 +
19:30 UTC). Sınırlı otomatik onarım: CSP direktifi (yalnız izinli-kaynaklar
listesinden), kaybolan 301, sitemap'te 404. Performans, tasarım, içerik,
JSON-LD şeması, veri kaynağı, mimari = kara liste, DUR + bildir.

**Sistem daha ilk koşusunda işe yaradı:** persona.json'da üç rehber bağı
yanlış slug'a gidiyordu, canlıda 404'tü. Kimse fark etmemişti. Sistem
bunları otomatik onarmadı (hedef 301 zinciriyle bulunamıyor → devret) ve
doğru davrandı; elle düzelttim.

**Ders (ölçüm aracı da yanlış ölçer):** `--test` senaryolarını yazarken iki
kez kendi aracım beni yanılttı. (1) Sanal sunucu sabit port kullanıyordu;
çöken bir koşudan kalan zombi süreç portu tutunca yeni sunucu SESSİZCE
bağlanamadı ve 7 senaryonun 5'i eski kopyayı ölçüp "kaldı" dedi. (2) Senaryo
regex'i `_headers`'ın YORUM bloğundaki `media-src` ifadesini yakalayıp gerçek
direktifi bırakıyordu. İkisi de "kanıt üreten aracın kendisi kanıtlanmalı"
dersinin örneği; ikisi de rapora yazıldı. Artık sunucu imza dosyasıyla
doğrulanıyor, doğrulanamazsa koşu hata ile duruyor.

**Kayıt (brief varsayımı düzeltildi):** brief "5 otomatik commit'çi" diyordu;
depoda 3 vardı (baraj, GRACE, su-izleme), site-saglik 4. oldu.
`saglik-bekcisi.sh` git işlemi yapmıyor — kilit takılmadı, gerekçesi yazıldı.

Açık kalan: /harita/ öz-cevap + JSON-LD yok (kara liste, kullanıcı kararı);
SMTP bilgileri beklemede.

## 23 Temmuz 2026 (4) — /hangi-kurum/ yetkili kurum rehberi + brief-denetci ön kapı
- Brief denetçisi (arac/brief-denetci.mjs, T1-T8) KURULDU; her brief artık dosyaya
  yazılıp denetçiden geçer + düşman geçişi (D1-D4) + amaç özeti (3b). Öz-denetimde
  use/mention meta-artefaktı belgelendi (rapor/brief-denetci.md).
- /hangi-kurum/ sayfası: build-time hangi-kapi.json (20 işlem) + su-birimleri.json
  (155 kurum) + su-islemleri.json'dan üretildi; üstte tek-tık filtre (details,
  progressive), altta JS'siz tam tablo (GEO). İçerik uydurulmadı; kurum id çözümü
  0 kırık, durum 11/5/3/1 JSON'la birebir. FAQPage yalnız doğrulanmış 11 satır.
- Kanıt: masaüstü LH 98 / mobil 85 (eşik ≥90/≥70 geçti), kontrast tümü AA, konsol 0,
  375 yatay taşma 0, iç link 0 kırık. cikti/denetim/hangi-kurum/RAPOR.md.
- SÜREKLİLİK: site-saglik.mjs'e md11-veri-butunlugu (JSON geçerli mi + kayıt azaldı
  mı🟡 + şema tanınıyor mu); /hangi-kurum/ çekirdek sayfa listesine eklendi.
- KARAR/UYDURMA: brief "tel" istedi ama doğrulanmış numara yok — icat edilmedi,
  onaylı e-posta+künye kalıbı kullanıldı (numara verilirse eklenir).
- DURUM: KULLANICI ONAYI BEKLİYOR (canlı test). Menü iki kaynağa da eklendi.

## 2026-07-24 (ana sayfa: menü arızası FAZ 1 + iki ders)
- MENÜ ARIZASI DÜZELTİLDİ (v3 FAZ 1, tek commit). Kök neden REGRESYON DEĞİL,
  eski arıza: `html.akis-bitti .ust-sabit{opacity:0;pointer-events:none}` —
  kaydırma dibe ulaşınca (akis-bitti) menü şeridi ölüyordu; tetik tarayıcı
  scroll-restorasyonu (dipteyken ana sayfaya dönünce menü açılışta ölü).
  Scroll 0'da çalıştığı için gözden kaçmıştı. Düzeltme: menü akış dibinde
  söndürülmez, aydınlık iniş üstünde okunaklı+açılır kalır (token aydınlığa
  çevrilir; C paleti). Kanıt: cikti/denetim/menu-arizasi/RAPOR.md.
- DERS 1 (HATA KAYDI + KURAL): "Hareket kararı STATİK kareden onaylanamaz.
  Süzülme/animasyon içeren her mock kare dizisi (0/0.5/1/1.5/2/3 sn) ile
  sunulur; tek kare yeterli sayılmaz." Aşama 2 A-güverte kararı statik
  karelerle alınmıştı → kullanıcının istediği hareket/albeni görünmedi.
  FAZ 2 mock'u bu kurala uyar.
- DERS 2 (HATA KAYDI + KURAL): "Sağlık sistemi VARLIK denetler; İŞLEV
  denetlenmezse arıza kullanıcıya kalır." site-saglik'in 10 kontrolü de
  varlık (200/link/konsol/medya) test ediyordu; hiçbiri etkileşim denemiyordu
  → menü arızası sistemden kaçtı. EKLENDİ: md12 ETKİLEŞİM DENETİMİ (headless
  tıklama, config izleme/etkilesim-beklenen.json). Kural: "Her yeni etkileşimli
  öğe md12'ye bir kontrol satırı ekler." Falsifikasyonla kanıtlandı (bozuk
  menüde md12(i) KIRMIZI verir).

## 25 Tem 2026 — Denetim seansı: brief yazarı hataları

Bu seansta brief yazarı (sohbet tarafı) 4 hata yaptı, 3'ünü Claude Code
yakaladı, 1'ini kullanıcı yakaladı.

H1. md.1.3'e "git status --porcelain boş olmalı" şartı yazıldı. Bu projede
    canlı cron'lar git'te izlenen log dosyalarına yazar; ağaç asla temiz
    olmaz. Şart uygulanamazdı. Claude Code Faz 0'da durdu, doğaçlamadı,
    seçenek sundu. → md.1.3 ve md.9.1 fark-karşılaştırmasıyla değiştirildi.
    Neden: genel iyi-uygulama, projenin bilinen gerçeğiyle karşılaştırılmadan
    yazıldı.

H2. md.3.9'da `--test` bayrağı için kriter "yerel mi okuyor" diye kondu.
    Doğru kriter "Faz 5'te değiştirdiğimiz şeyi mi doğruluyor" idi.
    --test sağlık sisteminin kendi onarım beyaz listesini sınıyor; Faz 5'in
    A düzeltmeleriyle alakasız. → karar geri alındı, Faz 5 doğrulaması
    yalnız `npm run build` + taban kıyası.
    Neden: ölçmesi kolay vekil kriter, doğru kriterin yerine kondu.

H3. F0-1 bulgusu "üç cron.log tutarsız izleniyor" diye yazdırıldı.
    .gitignore'daki /log/ deseninin yorumu ("arşiv altındakiler tracked
    kalır") bunun bilinçli bir karar olduğunu gösteriyor. Gerçek tutarsızlık
    yalnız data/arsiv/grace/cron.log (ne izlenen ne ignore'lu).
    → bulgu 🟡'den ⚪'ya düşürüldü, kapsamı daraltıldı. Faz 4'ün bulduğu
    farklı bulgu F4-7 olarak ayrı numarayla açıldı.
    Neden: belirtiden nedene atlandı, kanıt (gitignore) kontrol edilmedi.

H4. Faz 2 sonrası "Claude Code Faz 3'e kendiliğinden geçmiş" denildi.
    Geçmemişti; "geçiyorum" yazıp turu kapatmıştı. Ekranda `Worked for
    1m 49s` + boş prompt = durmuş. Kullanıcı 14 dk boşuna bekledi.
    → S9 hatırlatması verildi: faz sonu satırı "FAZ N BİTTİ — DUR + ONAY
    BEKLİYOR" olacak, niyet beyanı onay yerine geçmez.
    Neden: beyan okundu, kanıt okunmadı.
    Ek not: bu dersten çıkarılan faz-kapısı kuralı BRIEF DÜZEYİNDEDİR,
    kalıcı değildir. Kalıcı yetki kuralı (tam otomatik mod) yürürlükte
    kalır; faz kapısı yalnız denetim gibi çok fazlı işlerde, o briefte
    açıkça yazılarak uygulanır.

ORTAK KÖK: dördünde de kontrol edilebilir bir olgu kontrol edilmek yerine
makul görünen yüzey sinyali kabul edildi. Claude Code'a yazılan kanıt
disiplini (exit koduna güvenme · kanıtsız bulgu yok · çıktıyla doğrula)
brief yazarının kendisine uygulanmadı.

İKİNCİ ÖRÜNTÜ: 4 hatanın 3'ü (H1, H2, H4) fazlar arası hızlı yazılan ek
madde / onay mesajlarında çıktı. Asıl brief (v3) ayakta kaldı. Hata
briefte değil, briefin etrafındaki kısa turlarda.

DOĞRU ÇALIŞAN: Claude Code doğaçlama yasağına 7 fazda da uydu; durdu,
sordu, kendi başına düzeltmedi. Üç hatalı brief maddesini kanıtla çürüttü.
Üç katmanlı yapı (icra / eleştiri / karar) işledi.

## 25 Tem 2026 — Düzeltme turu 1: arşiv ve temizlik

Denetim (main = ed889fb) sonrası ilk düzeltme turu. 21 B maddesinden
üç konu ele alındı, 18'i beklemede.

YAPILANLAR
- /mock-kure/ rotası ve atlas seti arsiv/mock-kure/'ye alındı. Silme
  yok. Gerekçe: WebGL yüzey-sarma yolu kapandı (sahneler tanınmıyor),
  küre işi tek-parça Midjourney görseli yönüne döndü. Etki: dist 33 MB
  → ~27 MB, 176 → 175 sayfa, three chunk artık üretilmiyor.
- izleme/link-istisna.json'daki mock-kure istisnası kaldırıldı (rota
  kalkınca ölü kayıt).
- Kök dizindeki 4 menü denetim ekran karesi arsiv/menu-denetim/'e alındı.
- icerik-taslak/kuyu-tasima-kaynak.md commit edildi (24 KB, izlenmiyordu,
  kayıp riski vardı).
- Astro/maplibre ana sürüm yükseltmesi ERTELENDİ, kuyruğa yazıldı.
- Yan kazanç: three chunk'ı üretilmediği için taban build'deki tek
  gerçek uyarı ([WARN] [vite] chunk-size) da ortadan kalktı. Build
  artık uyarısız.

BRIEF YAZARI HATASI (5.)
Faz A'da "paylaşılan bileşen import ediyorsa taşıma" kuralı kondu.
Claude Code kuralı literal uyguladı ve durdu — doğru davranış. Ama
kural yanlış hedefi koruyordu: taşıma anasayfa-sorular.js'e dokunmuyor,
ana sayfa etkilenmiyor; kırılan yalnız taşınan dosyanın kendi göreli
yolu, ki mevcut arşiv teamülü (arsiv/harita-stil, arsiv/landing-koyu)
bunu zaten kabul etmiş. Yani "paylaşılan import var mı" ölçmesi kolay
bir vekildi; doğru soru "taşıma paylaşılan tarafı etkiler mi" idi.
Bu, aynı seansta kayda geçen H2 hatasının (vekil kriter) tekrarıydı;
CLAUDE.md'deki öz-denetim kuralı 3 yürürlükte olmasına rağmen ihlal
edildi. Kural doğru, uygulaması eksik kaldı.

KAYIP (kuyruğa yazıldı)
mock-kure.astro:21'deki build-zamanı soru doğrulaması, sayfa
derlenmediği için artık çalışmıyor. Ana sayfada eşdeğeri var mı
DOĞRULANMADI.

## 25 Tem 2026 — K1: git/log hijyeni

Denetim bulguları F4-2, F0-1, F4-7 kapsamında dört script düzeltildi.
Log'lar git izlemesinden çıkarıldı (YOL A).

YAPILAN: commit, pull'dan öne alındı; push, pull başarısına bağlandı.
`git add` ve kapı koşulu yerinde bırakıldı (B1.9 write-set ⊆ add-set
kanıtladı — kalıcı tıkanma imkânsız). --autostash kullanılmadı.

GEREKÇE (YOL A): .gitignore yorumundaki niyet "hata günlüğü kaybolmasın"
idi. F4-7 reflog kanıtı (23.07 11:14 git reset, 20.07 GRACE kaydı
kayboldu) git'te tutmanın log'u KORUMADIĞINI, SİLDİĞİNİ gösterdi.

TEST: scratch repoda beş senaryo. Senaryo 1 (önceki turda) falsifikasyon:
eski sıranın gerçekten koptuğu kanıtlandı. Bu turda 9a-9e: 5/5 geçti —
9a'da conflict marker commit'lenmedi ve veri kaybolmadı, 9b'de kirli-ağaç
ile rebase-çatışması ayrı log verdi ve bekleyen commit 1→2→3 birikti.

MERGE ANINDA DOĞRULANAN RİSK: `git rm --cached` sonrası ff-only merge, 13
log dosyasının HEPSİNİ ana ağacın diskinden sildi (git için "silinmiş
dosya"). C0.2 yedeği olmasa veri kaybıydı; 13/13 yedekten geri kondu,
satır sayıları birebir doğrulandı. Bu, F4-7'nin ("git işlemleri log'u
siler") canlı tekrarıdır ve YOL A'yı ayrıca haklı çıkarır.

BRIEF YAZARI HATALARI:
 (1) A0'da "YOL A seçilirse --autostash gerekmez" denmişti; o an yanlış
     gerekçeyle doğruydu — B1.9 gerçek gerekçeyi verdi.
 (2) Faz B gövdesi geçersiz ilan edilip üstüne yama gönderildi; Claude
     Code tanımsız referanslar nedeniyle durdu. Üç kez tekrarlandı.
     Kural: yön değişiminde brief TEK BİRLEŞİK METİN olarak verilir.
 (3) KARAR 1 (add'i kilide taşı) B3.2 tıkanmasını çözmek için kondu ama
     kapıyı da taşımayı gerektiriyordu; Senaryo 5 bu yapının autostash
     ile birlikte conflict-marker commit ürettiğini kanıtladı. Yapı
     canlıya girmeden falsifiye edildi. B1.9 sonrası KARAR 1'in tamamen
     gereksiz olduğu anlaşıldı.
 (4) C10.1'de origin/main tazelenmeden karşılaştırma yazılmıştı; bayat
     referans uzaktaki commit'i sildirebilirdi. fetch eklendi.
 (5) YENİ (bu tur): Senaryo 9b ve 9e döngüleri, çağırdıkları s9a.sh'in
     durum.json'a SABİT içerik yazdığını gözden kaçırdı. 9b'de döngünün
     yazdığı {"v":31i} üzerine binildiği için kapı kapandı ("KAPI KAPALI")
     ve senaryo hiç koşmadı; 9e ikinci koşumda aynı nedenle beklenen
     çıktıyı veremezdi. İçeriği parametre alan s9b.sh varyantıyla
     düzeltildi. Ders: senaryo betiği ile onu çağıran döngü aynı durumu
     yazıyorsa, beklenen çıktı yazılmadan önce ikisinin etkileşimi
     kontrol edilir.
 (6) YENİ (bu tur): C1 ff-only merge, ana ağaçta YEREL DEĞİŞİK iki log
     (baraj/cron.log, izleme/cron.log) yüzünden reddedildi ("local
     changes would be overwritten"). Brief bu durumu öngörmemişti.
     Çözüm silmeden yapıldı: iki log `mv` ile kenara alındı, merge
     koştu, 13 dosya yedekten geri kondu.

K1'E EKLENEN (kapsam genişlemesi, bilinçli): push-birikimi uyarı sayacı.
Gerekçe: yeni yapıda rebase çakışırsa commit yerelde kalır; çakışma
kronikleşirse sessizce birikir. Eşik >5 commit.

KAPSAM DIŞI KALAN: kilit veri yazımını kapsamıyor (B1.8a) · site-saglik
pull sonrası karışık commit/revert kapsamı (B1.8b) · grace dosya-dosya
add kırılganlığı (yeni dosya eklenirse listeden düşer).

AYRINTI: denetim/K1-ILERLEME.md (B1 keşif tabloları, 5 senaryo kanıtı,
B3.6 yapısal diff, verilen kararlar).

## 26 Tem 2026 — Dönüşüm uygulaması (dal: donusum-2026-07-26)

denetim/DONUSUM-ANALIZ.md'nin öncelik tablosu uygulandı. İş worktree'de
kaldı; main'e MERGE EDİLMEDİ, push YAPILMADI, ana ağacın HEAD'i main'de.

GÖRSEL ONAY KURALI BU İŞ İÇİN ASKIYA ALINDI (kullanıcı kararı). Gerekçe: iş
dalda kalıyor, canlıya çıkmıyor; beğenilmezse dal tek komutla siliniyor.
Askı yalnız bu brief için geçerliydi; kalıcı kural değişmedi.

SAYIM HATASI (kendi raporumda): öncelik tablosu 22 satır (0-21), özet "21"
diyordu — 0 numaralı satır (analitik) [VERİ] toplamına katılmamış. Doğrusu
17 [VERİ] + 5 [VARSAYIM] = 22. Brief "21 değilse DUR" diyordu ama kapanış
listesi "ZORUNLU DURAK — yalnız bunlar" ifadesiyle tüketiciydi ve bunu
içermiyordu; hata kayda geçirilip 22 madde üzerinden devam edildi.

UYGULANAN 4 MADDE (M13 öncelik sırasının dördü de tamamlandı):
 (3) Menü vitrin başlıkları h2 → p. Ölçüm: H1'den önce H2 gelen sayfa
     171/174 → 0/174. Görünüm değişmedi (stil sınıf tabanlı), erişilebilir
     ad <section aria-label> ile korundu. Skill: geo-citability Kategori 3.
 (5) Persona yatay bağları. Ölçüm: tam 1 iç link alan sayfa 42 → 2 (kalan
     ikisi persona değil). Üç tur gerekti: (a) ortak rehber ölçütü 42→32,
     (b) simetri 32→30, (c) kök sebep bulundu — 42 personanın 35'i
     ilgiliIcerik'inde /su-kanunu/ hub'ını taşıyor, bu konu değil gezinme;
     hub yolları sinyalden çıkarılıp grup-içi döngüsel halka eklenince
     42→2 ve yığılma (3 sayfa × 35 link) da kayboldu. Skill:
     site-architecture (yetim yasağı + spoke↔spoke).
 (9) Ana sayfa JS'siz sahne yedeği. #world boş bir div, 6 sahne JS ile
     monte ediliyordu; statik HTML'de <img>/<video> sıfırdı. <noscript>
     içine motorun ZATEN kullandığı 6 poster karesi + alt metni kondu.
     Yeni görsel ÜRETİLMEDİ, video dosyalarına dokunulmadı (M7). Ölçüm:
     img'li sayfa 1 → 2, toplam img 1 → 7, hepsi alt'li.
 (4) Rehber sonu "Sonraki adım" bloğu. Ölçüm: /durumum/ ve /hangi-kurum/
     rehber gövdesinde hiç geçmiyordu (yalnız menüde). Yeni bileşen
     SonrakiAdim.astro: kendi durumun → yetkili kurum → insan muhatap.
     Skill: cro adım 3 (CTA hiyerarşisi) + content-strategy (rehberi
     bitiren ziyaretçi "uygulama" aşamasındadır, ona sonraki MAKALE değil
     sonraki ADIM gerekir — kurul oturumunda Handley'in itirazı).

MADDE 16 — DEĞİŞİKLİK GEREKMEDİ: iki yetim sayfanın (/stil-pilot/,
/harita-pilot/) ikisinde de `robots: noindex` ZATEN vardı ve sitemap dışılar.
Yetimlik kasıtlı ve doğru; dev pilot sayfalarını gezinmeye sokmak yanlış
olurdu. Brief 2-B "yetim 2 sayfayı bağla" diyordu, kaynak rapor ise "ya iç
linkle ya noindex" seçeneğini veriyordu — ikinci seçeneğin zaten sağlandığı
ölçümle doğrulandı.

YENİDEN PUANLAMA (geo-citability, aynı 4 sayfa):
 kuyu-ruhsati 76→80 · hangi-kurum 71→75 · persona 71→75 · ana sayfa 53→57.
 Kritik kontrol: raporun tespiti "dördünde de en düşük kategori yapısal
 okunabilirlik, kayıp içerikte değil iskelette" idi. O kategori dördünde de
 yükseldi (55→75, 60→78, 55→75, 40→60) — yapısal işler amacına ULAŞTI.
 Ama tavan yapmadı: soru-başlıkları (madde 6) uygulanamadı, Kategori 3'ün
 kalan boşluğu odur.

DURDURMA SEBEBİ: bağlam sınırı (M12). M13'ün dört önceliği (2-A, 2-B, 2-C,
2-F) tamamlandıktan sonra durduruldu. Yetişmeyen 9 SINIF A maddesi
SIRADAKILER'e yazıldı.

KULLANILAN SKILL'LER: geo-citability (puanlama + Kategori 3 tanısı) ·
site-architecture (link mimarisi) · cro (CTA hiyerarşisi) · content-strategy
(alıcı aşaması) · marketing-council (önceki turun sentezi "bağlayıcı kısıt
dağıtım, mesaj değil" bu turda uygulama sırasını belirledi — uygulanan 4
maddenin 4'ü de dağıtım/iskelet, hiçbiri mesaj değiştirmedi).

M6 DOĞRULAMASI: dört maddenin dördünde de kaybolan kelime SIFIR. Hukuki
içerik metni değişmedi; yalnız kelime eklendi (922 + 20 + 420 satır).

---

## 26.07.2026 (gece) — DÖNÜŞÜM TUR 2: SINIF A'da kalan 9 madde

Dal `donusum-2026-07-26`, worktree `../suharitasi-donusum`. Ana ağaç `main`
= `6d0e209`, DEĞİŞMEDİ. Merge yok, push yok. 7 commit.

**9 maddenin 8'i ele alındı: 6 uygulandı, 1 SINIF B (madde 1), 1 kısmen geri
alındı (madde 6 / kuyu-ruhsati), 1 sıraya gelmedi (madde 11, M14 eşiği).**

### KULLANICI KARARI — başlık metni yeniden yazılabilir

Kullanıcı bu turda h1–h6 metninin değiştirilebileceğine karar verdi (gerekçe:
başlık gezinme öğesidir, hukuki iddia değil); gövde metni dokunulmaz kaldı.
**85 başlık tanımı değiştirildi**, hepsi ÖNCE→SONRA olarak
`denetim/DONUSUM-ILERLEME.md` FAZ 2.3'te tek tek yazılı. Kanun numarası
taşıyan iki başlık (`5686 rejimi`, `İdari para cezası (167 m.18)`) hukuki
iddia riski nedeniyle bilerek çevrilmedi.

### HATA KAYDI + KURAL — "başlık değişikliği gövdeyi de değiştirebilir"

Madde 6'yı `/rehberler/kuyu-ruhsati/` sayfasına uygularken build geçti, ama
gövde parmak izi 9 kelime kaybı gösterdi. Sebep: kalıp-2 sayfasının
"İçindekiler" menüsü başlık metnini `<h2>` DIŞINDA tekrar basıyor. Başlık
değişince menü metni de değişiyor — yani `<h1>–<h6>` sınırı, DOM'da başlığın
yankılandığı yerleri kapsamıyor.

**KURAL (yeni):** başlık metni değiştirilebilen bir işte, başlığın türetilmiş
kopyaları (içindekiler, breadcrumb, `aria-label`, kart etiketi, menü vitrini)
ÖNCEDEN aranır. Parmak izi doğrulaması bunu yakalar ama iş yapıldıktan sonra
yakalar; önce aranırsa boşa iş olmaz.

**İKİNCİ GİZLİ BAĞ:** `TamEkranMenu.astro` markdown gövdesini `## Gelişmeler`
başlığına göre ayrıştırıyordu; başlık değişince build SESSİZCE DEĞİL, gürültülü
düştü (sessiz hata yasağına uygun `throw`). Bağ güncellendi. Aynı türden ikinci
bağ `rehberler/[slug].astro`'daki kalıp-2 bölüm listesiydi; o da güncellendi
ama sayfa yine de geri alındı (gövde kaybı sebebiyle).

### Uygulananlar

| Madde | Commit | Ne oldu |
|---|---|---|
| 6 | `e74f540` | Soru başlıkları: 85 tanım. Soru biçimli h2/h3 **3 → 458**, kapsayan sayfa **3 → 161** |
| 2 | `c91aa57` | Ana sayfaya Organization + Person; `kurum` şemasına `knowsAbout` + `email`; `Person` düğümü 172 sayfada `@id` ile paylaşılıyor |
| 7 | `f71f490` | robots.txt'e 13 adlı bot bloğu (Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended…). Erişim genişlemedi — niyet beyanı |
| 10 | `16fde8d` | `llms.txt` build entegrasyonu; içerik dist'ten (title + meta description) üretiliyor, elle yazılmış metin yok → bayatlamaz. 172 sayfa, 61 KB |
| 12 | `0a84dd4` | Ana sayfa öz-cevabına envanter sayıları (25 havza, 81 il, 42 sektör, 20 işlem, 10 rehber). 269 karakter, 280 sınırı altında. Sayıların hepsi build çıktısından sayıldı |
| 8 | `5a14a15` | 9 hub sayfasının mevcut `ozet`'i `class="oz-cevap"` + `role="doc-abstract"` ile öz-cevap olarak işaretlendi. **Yeni metin üretilmedi, görünüm değişmedi.** Öz-cevapsız indekslenebilir sayfa 9 → 0 |
| 13 | `0f3e00e` | `HowTo` şeması: kuyu-ruhsati 4 adım, kuyu-tasima 7 adım. Adım metinleri sayfadaki `adimlar[]` dizisinden birebir |

### SÜREKLİLİK

`llms.txt` bir build entegrasyonudur (`astro.config.mjs`), elle bakım
istemez; `<title>` eksikse build düşer. Sayfa/sitemap tutarsızlığı çözüldü ve
belgelendi: **175 dosya = 174 Astro rotası + public/404.html**, **172 sitemap
= 174 − 2 noindex pilot**. Önceki raporlardaki 174 ve 175 sayılarının ikisi de
doğruydu, farklı şeyleri sayıyorlardı.

Bağlam: madde 13 sonunda M14 eşiği (%70) aşıldı → madde 11 bırakıldı, Faz 2
puanlaması yapıldı, kayıt tamamlandı, duruldu.

### 26.07.2026 (sabah) — TUR 2 kapanışı: madde 11

Bağlam eşiği sonrası kalan tek SINIF A maddesi tamamlandı (`fb27d9d`).
**Böylece 9 maddenin 9'u ele alındı: 7 uygulandı, 1 SINIF B (madde 1,
`sameAs`), 1 kısmen geri alındı (madde 6 / kuyu-ruhsati).**

Madde 11 iki parçaydı ve ikisi ayrı sonuçlandı: **B3 (rehber → il) zaten
karşılanmıştı** — `/rehberler/kuyu-ruhsati/` 81 il sayfasına link veriyor,
diğer rehberlerde il tablosu olmadığı için hüküm doğmuyor; yeni kod yazılmadı.
**C2 (rehber → persona) uygulandı:** 0 → 13 link, 8 rehberde.

**Yöntem notu (uydurma yasağı):** hangi personanın hangi rehberi
ilgilendirdiği ELLE EŞLEŞTİRİLMEDİ. `data/lead/persona.json`'daki mevcut
`ilgiliIcerik` alanı tersine çevrildi. Eşleşmesi olmayan rehberde satır hiç
basılmıyor. `data/` yalnız okundu (M10).

**Öz-denetim:** `arac/dist-sun.mjs` üzerinden 7 sayfa — konsol 0, 113 tekil
iç link 0 kırık, 7/7 etkileşim, 7 tam sayfa kare. Ana sayfa alınamadı (menü
düğmesi kaydırma-sahnesi arkasında; aracın bilinen sınırı, kuyruğa yazıldı).

**M6:** eklenen 26 kelime, kaybolan 1 — o da `/hangi-kurum/` sayfasındaki
build tarihinin 25 → 26 Temmuz dönmesi. İçerik kaybı yok.

### 26.07.2026 (sabah, 2. blok) — ÖDÜL-ÜSTÜ: 9 skill'in uygulaması

Kullanıcı: "son 24 saatte yüklediğin skilleri kullan, menüler dahil yerlerini
önceliklerini değiştir, ödül üzeri bir site olsun."

**Brief ön kapısı işletildi:** brief `cikti/brief/` altına olduğu gibi yazıldı,
denetçi 3 ENGEL verdi (T5: DUR kapısı, kapsam mührü, commit+push kuralı —
üçü de mekanik eksik), madde 4e gereği yalnız EKLEME ile tamamlandı,
`-duzeltilmis.md` TEMİZ geçti. Orijinal korundu.

**En büyük bulgu — şema dürüstlüğü açığı:** `BreadcrumbList` JSON-LD 171
sayfada yayınlanıyordu ama sitede GÖRÜNÜR breadcrumb YOKTU (0 sayfa). Yani
site, arama motorlarına sayfada karşılığı olmayan bir gezinme yapısı beyan
ediyordu. Görünür breadcrumb aynı `kirintilar` dizisinden üretildi — iki
kaynak artık ayrışamaz.

**İkinci bulgu — hub'ın kendisi yetimdi:** 81 il sayfasının giriş kapısı
`/kuyu-ruhsati/` yalnız **1** iç link alıyordu ve hiçbir menüde yoktu.
Breadcrumb + menü + footer ile **82**'ye çıktı.

**Üçüncü bulgu — iki küme yatay bağsızdı:** havza 0/25, il 0/81. Kardeşlik
ölçütü UYDURULMADI; sayfanın zaten yazdığı olgudan türetildi (aynı DSİ
bölgesi / aynı illeri kapsamak). Coğrafi komşuluk iddiası YOK.

**Kurul kararının izi:** menü niyet-önce sıralandı ama Sharp'ın (muhalif)
kısıtı korundu — hiçbir veri kapısı kaldırılmadı, yalnız sıra değişti.
Handley'in "etiketler soru olsun" önerisi UYGULANMADI: onaylı gövde metnini
silmeyi gerektiriyordu (M6). Skill önerisi ile proje kuralı çatıştığında
proje kuralı kazandı.

**cro'da öz-düzeltme:** persona sayfasında "iletişim bloğu yok" diye başladım,
ölçünce blok VARDI (sektöre özel mailto konusuyla). Eksik olan iletişim değil
operasyonel sonraki adımdı. Bulgu düzeltildi, brief kuralı "belirtiden nedene
atlanmaz" burada işledi.

**Kanıt:** build hata 0 · 175/172 değişmedi · gövde parmak izinde kayıp yok
(tek fark build tarihinin gün dönmesi) · öz-denetim 8 sayfa konsol 0, 114
tekil link 0 kırık · LH erişilebilirlik 3 sayfa × 3 tur medyan **100** ·
mobil 375/390 px taşma 0.

**Açık bıraktığım:** ortalama sayfa ağırlığı 24,1 → 26,9 KB (+%11,6) —
Lighthouse PERFORMANS yeniden ölçülmedi (yerel/canlı kıyası geçersiz olurdu),
DENETLENEMEDİ'ye yazıldı. CCBot engellensin mi kararı kullanıcıya bırakıldı.

## 2026-07-27 — Ana sayfa v2: emilkowalski/skills + v0 spesifikasyonu (worktree)

**Ne yapıldı:** suharitasi-donusum worktree'sinde ana sayfa v0 spesifikasyonuna
göre yeniden kuruldu: sayfaya özel UstBar (Veriler açılır listesi, 9 rota) +
iki fazlı hero (6 poster harmanı 3800ms → 6 video sırayla 5000ms, geçiş
1400ms) + deterministik su fışkırması (90/30 damla, v0 rand formülü) + 6
uçuşan soru (gerçek <a>; mobilde hero altı dikey liste) + Hizmetler(6) +
Süreç(4) + Hakkında + İletişim(mailto form) + paylaşılan AltBilgi (token
kabıyla, bilesene dokunulmadan). Eski sayfa arsiv/anasayfa-guverte-v3/.
emilkowalski/skills kuruldu (7 skill; .agents/skills gerçek + .claude/skills
symlink düzenine taşındı, gitignore'lu — repo temiz).

**Kararlar ve gerekçeleri:**
- K-1 (animasyon ikiye ayrılır): etkileşim (menü/dropdown/hover/basış)
  emil-design-eng kurallarıyla — <300ms, güçlü ease-out cubic-bezier(0.23,1,
  0.32,1), çıkış girişten hızlı (200/150ms), :active scale(0.97),
  transform-origin tetikte, hover (hover:hover) kapılı. Atmosfer (süzülme 9s,
  fışkırma, harman 3.8s, sahne geçişi 1.4s) v0 süreleriyle KORUNDU; skill'in
  300ms kuralı uygulanmadı — skill'in kendi tablosu "Marketing/explanatory:
  can be longer" diyor, itiraz yalnız raporlandı.
- K-2 (kütüphane yok): spring/Motion önerileri uygulanmadı; saf CSS karşılığı
  (güçlü cubic-bezier + @starting-style + CSS transition) kullanıldı. npm
  install çalıştırılmadı (M5).
- K-3 (öz-cevap hero'da): GEO için yazılmış 280'lik kanonik metin hero alt
  metni oldu; pazarlama gözden geçirmesi kuyrukta.
- M7 süzgeci: v0'ın "15+ yıl/500+ dosya/%98 memnuniyet" uydurmaları atıldı;
  yerine build'de sayılan 25 havza · 81 il · 10 rehber. Telefon + İstanbul
  doğrulanamadı → bloklar konmadı.

**Denetimin yakaladığı 3 arıza (kod düzeltildi):** (1) Esc, imleç düğme
üstündeyken menüyü kapatamıyordu — CSS :hover JS'i eziyordu → .kapali sınıfı;
(2) .v2-nav ul kuralı iç içe açılır listeye sızıp yatay şerit yapıyordu →
doğrudan-çocuk seçici; (3) AltBilgi tokenları tanımsız kalıp koyu-üstü-koyu
çıkıyordu → .v2-altkap aydınlık token kabı.

**Kanıt:** build hata 0, yeni uyarı tipi 0; dist/index.html üzerinde: 6 soru
<a> + hedefleri dist'te VAR, Veriler 9/9 VAR, poster 6+6 (hero alt boş-
dekoratif, noscript alt dolu), ilk yüklemede src dolu video 1, noscript +
JSON-LD (Org+Person+WebSite) AYNEN, h1 h2'den önce, uydurma taraması TEMİZ.
CSP'li sunucuda (dist-sun) video ölçümü: readyState 4, currentTime 1.9s,
oynuyor; konsol 0 (masaüstü+mobil), 390 taşma 0, hamburger+Esc çalışıyor.
Ağırlık: index.html 24K→36K (sınır 3×), dist 28M sabit. Kareler:
denetim/kare/anasayfa-once/ + anasayfa-sonra/. GPU kuralı: scrub/oynatma
akıcılığı headless'ta kanıt sayılmaz — nihai onay kullanıcının canlı testi.

## 2026-07-27 (2. seans) — v0 ince ayar + CANLIYA ÇIKIŞ

**Yayınlanan:** main c7fbe40 → de01fbd (ff-only, 15 commit / 80 dosya /
+2545/−8072): ana sayfa v2 (v0 tasarımı + A=28 ince ayar farkı) + önceki
turların 13 GEO commit'i (soru başlıkları, şemalar, llms.txt, robots,
yatay bağlar, h1/h2). Rebase'de SIRADAKILER.md çakışması kullanıcı onayıyla
"iki blok da korunur" kuralıyla çözüldü — grep doğrulaması: SAGLIK SISTEMI
(s.5) + ANA SAYFA v2 (s.21) ikisi de duruyor, işaret 0.

**v0 ince ayar (AŞAMA A):** kıyas A=28 uygulandı / B=12 brief kazandı /
C=9 taşınamaz (cikti/denetim/v0-kiyas.md, commit'li). Tailwind kurulu
değil — utility'ler vanilla CSS'e çevrildi. oklch tema sayfa kapsamında
(--v2-*, global ezilmedi). unzip yoktu → python3 zipfile. v0'ın "yalnızca
su hukuku" ve "güçlü sicil" beyanları künyeyle çeliştiğinden alınmadı;
uydurma değerler (tel/adres/istatistik) geri getirilmedi.

**Canlı doğrulama (önbellek kırarak, M11):** surum.json ilk denemede
de01fbd; 7/7 rota + 5 soru hedefi + llms.txt 200; cf-cache-status DYNAMIC
(HIT yok — doğrulama geçerli); canlıda video readyState 4 / currentTime
3,3 sn / oynuyor; konsol 0 (1440+390), taşma 0, Veriler menüsü + Esc +
hamburger çalışıyor; uydurma taraması TEMİZ. Ağırlık: index.html 36.470 →
39.682 bayt (sınır 2×=72.940). Kareler: denetim/kare/anasayfa-v0kiyas/ +
canli-sonrasi/. ÖNBELLEK: ziyaretçi YENİ sayfayı görüyor — purge gerekmedi.

**Geri alma yapılmadı** (B5 gerekmedi). Geri dönüş noktası:
/tmp/canli-oncesi-main.txt = c7fbe40; gerekirse git revert c7fbe40..HEAD
(13 GEO commit'i de geri alır). Worktree + dal duruyor (B6.4).

## 2026-07-27 (3. seans) — Sondaj hedefi + menü birleştirme CANLIDA

main d346607 → ac63806 (+52e59bd boş yeniden-tetik). İŞ 1: Sondaj kartı +
"su nerelerde çıkabilir" → /havzalar/ (YAS potansiyeli havza sayfalarında
basılı; 0.8 kararı). İŞ 2: PaylasilanMenu 174 sayfada — koşullu çapa
(ana # / diğer /#), içerik sayfalarında sticky-koyu, /harita/'da yüzer
varyant (öksüz "menü" tetikleyicisi kaldırıldı), Veriler 10 rota, vitrin
menü paneline taşındı (kayıp-0). Eski UstMenu/TamEkranMenu/UstBar dosyaları
DURUYOR (M10). GERİLEME 0: h2-ters 0 · soru başlığı 567/162 · şema 172 ·
llms.txt ✓ (taban=sonuç); h1'siz tek sayfa /harita/ (önceden vardı).
Ağırlık ort 44.483→44.560 B (+%0,2); ana sayfa 39.682→43.912 (vitrin
bedeli). Rebase yok — ff-only ilk denemede. ARIZA: Cloudflare Pages
"unable to submit build job" (platform) — build ~50 dk askıda kaldı,
kullanıcı panelden teşhis etti, boş commit ile yeniden tetiklendi, eski
kuyruk açıldı ve ac63806 yayınlandı. Canlı doğrulama (M11): 10 rota 200,
Veriler+/# 5 tipte, h1<h2 ana+rehber, cf-cache-status DYNAMIC, ziyaretçi
YENİ menüyü görüyor (purge gerekmedi). Kareler: denetim/kare/menu-birlesik/
+ menu-canli/. Kanıt sayfası: cikti/denetim/menu-mimari.md.

## 2026-07-27 (4. seans) — Eski menü dosyaları silindi

main 7c7b62f → ee0d81e (+kayıt). Kullanıcı canlı menü onayı verdi, M10
kaldırıldı. İteratif eleme: TUR 1 UstBar+UstMenu (ref 0), TUR 2
TamEkranMenu (tek ref TUR-1 öksüzü UstMenu'den), TUR 3 boş — dairesel
referans kuralı tam bu vakayı yakaladı. KORUNAN: menu.ts (PaylasilanMenu),
/s/menu.js (dist'te script etiketi çağırıyor — 2.4). dist 30M→30M
DEĞİŞMEDİ (beklenen: kullanılmayan bileşen dist'e girmiyordu; kazanç depo
hijyeni). Gerileme 0: h2ters 0 · soru 567/162 · şema 172 · llms ✓.
Silme scripti ilk koşuda grep-exit tuzağıyla üçünü yanlış geri aldı —
düzeltilip tekrarlandı (build'ler temizdi). Canlı: ee0d81e ilk denemede,
9 rota 200, Veriler+h1<h2 ✓, DYNAMIC, ziyaretçi yeni sürümde. Kareler:
temizlik-sonrasi/ + temizlik-canli/.

## 2026-07-27 (5. seans) — Kontrast arızası: teşhis T1, chunk sızıntısı

Kullanıcı bildirimi doğrulandı: rehber gövdesi koyu zeminde okunmuyordu.
TEŞHİS (ölçümle): index.astro is:global bloğu (body{background:#061824} +
* reset + html scroll) PaylasilanMenu yayılımıyla Vite ortak CSS chunk'ına
(index.B9Q6o20O.css) girdi ve 173 sayfaya sızdı — menü turunun yan etkisi
(2.5=A). DESIGN.md niyeti açık zemin (#E9F0F4). ÖNCE oranlar: il/persona/
durumum/hangi-kurum 1.16 · rehber/su-kanunu/vaka/hakkinda 2.84 · havza 5.16
(kendi zemin bildirimi kurtarmış) · ana 12.33. DÜZELTME: kurallar
html.v2-sayfa kapsamına; SONRA canlıda: 5.16–12.33, 10/10 AA. Menü barı
8.30 AA. Gerileme 0 (h2ters/soru/şema/llms taban=sonra). İtiraflar:
(1) koyu gövde menü karelerinde de vardı, konsol/taşma ölçüp zemine gözle
bakmadım; (2) ölçüm scripti ilk sürümde menünün gizli <p>'sini yakaladı,
görünürlük süzgeciyle düzeltildi. Kareler: kontrast-sonrasi/ + kontrast-canli/.

## 2026-07-27 (6. seans) — menu.js etiket temizliği

main 5fa6c25 → aff52eb. NO-OP analizi (üç kanal, brief düzeltmesi gereği):
(a) sv-menu id'si dist'te 0 (guard `overlay && aclar.length` çift koşul —
harita-pilot'ta gizli kalan 1 tetik düğmesi tek başına yetmiyordu);
(b) modül kökünde document/window dinleyicisi yok (hepsi kur() içinde);
(c) koşulsuz yan etki yok (import/timer/atama hepsi guard arkasında).
Kaldırılan: 3 script etiketi + harita-pilot öksüz tetik (menü turu regex'i
tek-satır formatı kaçırmıştı — itiraf) + .sv-menu-ac CSS blokları +
public/s/menu.js (silme, ayrı commit hedeflenmişti, b41d4aa'da birleşti).
/harita/ ayrı doğrulama: pm-yuzer bar + Veriler açılıyor, eski tetik yok,
konsol/ağ hatası 0. Gerileme 0 (taban=sonra). Canlı: aff52eb, menu.js 404,
sayfalarda referans 0, DYNAMIC. Kalıntı: imlec.js'te ölü sınıf okuması.

## 2026-07-27 — Su potansiyeli katmanı (worktree: suharitasi-potansiyel)
Faz 0-6 tek seansta: NHYP 472 kütle (kalite kapısı 12/12), kütle→il
314 eşli (OSM ilçe dizini + havza filtreleri; 6 tuzak sınıfı kanıtla
düzeltildi), RG 109+310 kayıt (kaynaksız 0), zenginleştirme (MTA 356,
OpenAlex 1.226 — DergiPark Turnstile ikamesi onaylı, TÜİK dürüst
veri-yok), GLO-90 morfoloji 81/81. Blok 81 il sayfasında; pilot
(Manisa+Çanakkale) kanıt paketiyle onaylandı; gerileme 0. Dersler:
sunucu 8GB (CLAUDE.md'ye işlendi), tr-iller atfı Apache-2.0 (düzeltildi),
resmî TR kaynaklarına yurtdışı IP engelleri (raporlarda). MERGE BEKLİYOR.

## 28.07.2026 — HATA KAYDI + KURAL: yerelde doğrulanan kalem canlıda yalan söyleyebilir
md19 (başlık+OG+CTA) yerel `dist` üzerinde kuruldu ve orada 17 `mailto:`
sayıp geçti. İlk gerçek `--tam` koşumunda canlıda **KIRMIZI** verdi:
"hiçbir sayfada mailto CTA bulunamadı". Site bozuk değildi — Cloudflare
e-posta gizlemesi canlıda her `mailto:`yi `/cdn-cgi/l/email-protection#HEX`
yapıyor. Kalem, olguyu değil yerel ortamın tesadüfünü ölçüyordu.

**KURAL:** Yeni bir sağlık kalemi yerel `dist` üzerinde doğrulanmışsa,
yayına girmeden ÖNCE canlı üzerinde de bir kez koşturulur. CDN yeniden
yazması (e-posta gizleme, link rewrite, HTML minify, bot yönetimi) yerelde
GÖRÜNMEZ. "dist-sun ile ölçtüm" yeterli değildir — CANLI KOŞUL İLKESİ'nin
zorunlu uzantısı.

Düzeltme vekil kritere kaçmadı: gizli biçim çözülüyor (`cfEpostaCoz`) ve
adres aynı testten geçiyor; CTA gerçekten silinirse iki biçim de kaybolur
ve kalem yine ateşler (falsifikasyonla doğrulandı).
