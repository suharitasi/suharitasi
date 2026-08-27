# BOYUT 1.5a — UYDURMA DENETİMİ

Tarih: 27.08.2026 · Kip: SALT-OKUNUR (hiçbir kaynak/dist dosyası değiştirilmedi, build alınmadı, tarayıcı açılmadı)
Kapsam: TARAMA 1 (türetilmiş/sentetik verinin gerçek ölçüm gibi sunulması) + TARAMA 2 (kaynağı gösterilmemiş olgusal iddia)

## YÖNETİCİ ÖZETİ

11 bulgu. Genel tablo **iki uçlu**: sitenin ana gövdesi (havza, göl, nehir, il, rehber,
hangi-kurum, arşiv, kapatma-kaydı, vaka şablonları) uydurma denetiminden **temiz** çıkıyor —
her türetilmiş alanın künyesi de sayfada basılan şerhi de yerinde. Buna karşılık **iki araç
sayfası** (`/ilce-sorgu/` ve `/havza-riski/`) sitenin kendi ilan ettiği politikayı doğrudan
ihlal ediyor; ağırlığın tamamı bu iki sayfada toplanıyor.

İhlallerin ölçüldüğü referans, sitenin kendi beyanıdır (`/hakkinda/`, dist'te birebir):

> "Doğrulanamayan hiçbir veri doğrulanmış gibi gösterilmez. Kamuya açık kaynağı bulunmayan
> alanlar 'veri yok' olarak, derleme tarihiyle birlikte işaretlenir — **tahmin veya ara değer
> üretilmez.**"

`/ilce-sorgu/` akifer türü, derinlik aralığı ve "su çıkma olasılığı" üretiyor; hiçbirinin
veri karşılığı depoda yok. `/havza-riski/` puanının %40'ı (baraj %25 + tahsis %15) her 25
havzada aynı sabit 0,5 değeri; sayfa bunu iki gerçek gösterge gibi anlatıyor.

---

## TARAMA 1 — TÜRETİLMİŞ/SENTETİK VERİNİN GERÇEK ÖLÇÜM GİBİ SUNULMASI

### Sınıflandırma tablosu (taranan tüm türetilmiş veri kalemleri)

| # | Veri kalemi | Tüketen sayfa | Sınıf |
|---|---|---|---|
| 1 | `veri/potansiyel/ilce-morfoloji.json` | `/ilce-sorgu/` | **TAM İHLAL** (şerh yanlış yönde: kaynak DEM diye ilan ediliyor) |
| 2 | `src/data/havza-risk.js` (bileşik puan) | `/havza-riski/` | **TAM İHLAL** (bileşen sabitleri gizli) |
| 3 | `/ilce-sorgu/` akifer + derinlik + AHP çıktıları | `/ilce-sorgu/` | **TAM İHLAL** (veri kaynağı hiç yok) |
| 4 | `veri/potansiyel/morfoloji.json` (il DEM) | `/kuyu-ruhsati/[il]/` | TEMİZ |
| 5 | `veri/potansiyel/osm-su-noktalari.json` | `/kuyu-ruhsati/[il]/` (81/81) | TEMİZ |
| 6 | `src/data/gol-nehir-cografya.js` (geometrik örnekleme) | `/goller/*`, `/nehirler/*`, `/havzalar/*` | TEMİZ |
| 7 | `src/data/rg-sayi.js` (RG sayısı URL'den türetimi) | `/kuyu-ruhsati/[il]/` | TEMİZ |
| 8 | `src/data/vitrin.js` (kapatma kayıtları, il ataması yok) | `/kapatma-kaydi/` | TEMİZ |
| 9 | `data/canli/grace-*.json` (TWS anomalisi) | havza + il + harita | TEMİZ |
| 10 | `veri/potansiyel/kutle-il.json` (kısmi eşleme) | il sayfaları | TEMİZ (yalnız `eslesti` basılıyor) |
| 11 | `veri/potansiyel/mta-katalog.json` (il ataması rapor adından) | `/kuyu-ruhsati/[il]/` | KISMİ (bkz. B-08) |
| 12 | `data/lead/persona.json` (27.12.2029 aritmetik türetme) | `/durumum/*` | KISMİ (bkz. B-09) |
| 13 | `veri/potansiyel/akademik-kunye.json` | il sayfaları | TEMİZ (DOI/OA süzgeci) |

---

### B-01 · `/ilce-sorgu/` ilçe morfolojisini "Copernicus GLO-90 DEM" diye künyeliyor

**NE** — İlçe düzeyinde `duz_oran`/`vadi_oran` değerleri il verisinden isim-tohumlu ±%15
varyasyonla üretilmiştir; sayfa bunları "Arazi Yapısı · **Copernicus GLO-90 DEM**" künyesi
altında basıyor. Şerh eksik değil, **ters yönde**: olmayan bir ölçüm kaynağı iddia ediliyor.

**NEREDE** — `veri/potansiyel/ilce-morfoloji.json` → `src/pages/ilce-sorgu.astro:14, 41-62, 121, 353-355` → `/ilce-sorgu/`

**KANIT**

Künyedeki gerçek ifade (birebir, `ilce-morfoloji.json:4-6`):

```
"yontem": "il morfoloji verisinden deterministik varyasyon (±%15)",
"not": "Bu veri GERCEK ilce olcumu DEGiLDiR. Il duzeyindeki Copernicus GLO-90 DEM
        verisinden ilce ismiyle tohuma bagli varyasyonla turetIlMiStiR."
```

948 ilçe kaydının her birinde ayrıca (birebir):

```
"kaynak": "il duzeyindeki Copernicus GLO-90 DEM verisinden ilce adi bazli deterministik
           varyasyonla TÜRETiLMiSTiR — gercek ilce olcumu DEGiLDiR"
```

Sayfadaki görünür künye (birebir, `ilce-sorgu.astro:121`):

```html
<Katman baslik="Arazi Yapısı" ipucu="Copernicus GLO-90 DEM">
  <dt>Düz arazi (&lt;%2 eğim)</dt> ... <dt>Vadi tabanı</dt> ... <dt>Ortalama eğim</dt>
```

Sayfadaki tek şerh (birebir, `ilce-sorgu.astro:151`):

```
Veri kaynakları: DSİ, SYGM NHYP, GRACE NASA GSFC, EPİAŞ, Copernicus GLO-90 DEM,
OSM (ODbL). Tüm veri TEMSİLÎDİR.
```

Türetilmiş değerler dist'e ham olarak gömülü (`dist/ilce-sorgu/index.html`, `#veri-paketi`):

```json
{"adana":{"ad":"Adana","ilceler":[{"ad":"Aladağ","slug":"aladag",
"duz_oran":0.21496321999999998,"vadi_oran":0.21789612000000003,"ort_egim":null}, ...
```

Ek ölçüm (`node` ile `ilce-morfoloji.json` üzerinde):

```
ilce sayisi 948
ort_egim null olan: 948
duz_oran null: 0
```

→ `ort_egim` **948/948 null**; sayfa `fmt(egim||0,1)+'°'` yazdığı için (`ilce-sorgu.astro:355`)
her ilçede "Ortalama eğim: **0,0°**" basılıyor. Veri yok, ama "veri yok" değil, **sıfır derece**
gösteriliyor.

**SINIF ÖNERİSİ** — KARAR. Görünür künye metninin anlamı değişiyor ("Copernicus GLO-90 DEM"
ibaresinin kaldırılması/nitelenmesi), ve bu sayfa bir sondaj kararına yönlendiriyor
(CLAUDE.md "Altyapıda hızlı, iddiada yavaş").

**SINIF GEREKÇESİ** — Salt şerh eklemek yetmez: sayfa yanlış bir kaynak künyesi *iddia ediyor*.
Doğru kararın seçenekleri (ilçe katmanını kaldırıp il katmanına düşmek / künyeyi
"il verisinden türetilmiş" diye değiştirmek / veriyi gerçekten ilçe DEM'inden üretmek)
site metninin anlamını değiştiriyor.

**ETKİ** — **Yüksek.** Sayfa sitemap'te (`dist/sitemap.xml`) ve `llms.txt:447`'de yayında;
948 ilçe için "gerçek ölçüm" görüntüsü veriyor. `ort_egim: 0,0°` ölçülebilir ve doğrudan yanlış.

---

### B-02 · `/ilce-sorgu/` veri karşılığı olmayan akifer türü ve kuyu derinliği üretiyor

**NE** — Sayfa, tek girdisi türetilmiş `duz_oran`/`vadi_oran` olan iki eşikli formülden
(i) ilçenin **baskın kayaç ve akifer türünü**, (ii) **tahmini su doygunluk derinliğini (metre)**
üretiyor. Depoda ne jeoloji/litoloji verisi ne de kuyu derinliği verisi var.

**NEREDE** — `src/pages/ilce-sorgu.astro:344-348` (+ `:113-114` görünür başlıklar) → `/ilce-sorgu/`

**KANIT** (kaynak kod, birebir)

```js
const akf = duz>.5?'Alüvyon / Alüvyal Akifer (geçirgen kum-çakıl)'
          :vadi>.3?'Karstik Kireçtaşı Akiferi (çatlaklı-erimiş yapı)'
                  :'Gözenekli Granit / Kırıklı Kaya Akiferi (çatlak suyu)';
setT('akifer-yapisi', d.ilceAd+' ilçesinde baskın kayaç ve akifer türü: '+akf+'.');

const dMin = Math.round(15+(1-duz)*65), dMax = Math.round(dMin+40);
setT('derinlik-tahmini', d.ilceAd+' ilçesinde tahmini su doygunluk derinliği: '+dMin+' – '+dMax+' metre arası.');
```

Yayına girdiğinin kanıtı (`dist/_astro/ilce-sorgu.astro_astro_type_script_index_0_lang.CmXBUc3q.js`):

```
ilçesinde tahmini su doygunluk derinliği: `+E+` – `+D+` metre arası.`)
baskın kayaç ve akifer türü: `+T+`.`);let E=Mat
Alüvyon / Alüvyal Akifer (geçirgen kum-çakıl)`:l>.3?`K
```

Sayfadaki görünür başlıklar (dist, birebir): `Jeolojik / Akifer Yapısı` · `Tahmini Derinlik Aralığı`

Sayfadaki şerh (birebir, `ilce-sorgu.astro:117`):

```
Bu analiz Copernicus GLO-90 DEM, DSİ 2024, NHYP ve GRACE verilerinden turetilen
BILIMSEL BIR GOSTERGEDIR. Saha etudu veya hidrojeolojik rapor YERINE GECMEZ.
```

Bu şerh, kaynak iddiasını **onaylıyor** — oysa listelenen dört kaynağın hiçbiri litoloji ya da
su tablası derinliği içermiyor. Karşı-kanıt, projenin kendi künyesi
(`veri/potansiyel/morfoloji.json`, `etiket`, birebir):

```
Sayısal yükseklik modelinden türetilmiş morfolojik göstergedir;
akifer varlığının kanıtı değildir.
```

**SINIF ÖNERİSİ** — KARAR. Görünür içeriğin anlamı ve sayfanın vaadi değişiyor; ayrıca maddi
karara (sondaj) yönlendiren iddia.

**SINIF GEREKÇESİ** — Şerh eklemek bu iki kutuyu kurtarmaz: üretilen cümlelerin arkasında
*hiçbir* veri yok. Seçenek kaldırmak ya da gerçek veri bağlamaktır — ikisi de karar işi.

**ETKİ** — **Yüksek.** "Kuyumu kaç metrede bulurum" sorusunun cevabı uydurma bir doğrusal
formülden geliyor (15 + (1−düz)×65). Sondaj maliyeti karara bağlanan bir sayı.
(Not: SIRADAKILER.md:349'da bu kalem "yöntem şerhi ... yeterlilik kararı" olarak açık —
ancak orada sorun *şerhin yetersizliği* diye kaydedilmiş; ölçüm gösteriyor ki sorun
şerh değil, **veri kaynağının hiç olmaması**.)

---

### B-03 · `/ilce-sorgu/` hesaplanmamış TWI ve işlenmemiş JRC'yi bileşen diye gösteriyor; "AHP" iddiası dayanaksız

**NE** — Skor kutusu "AHP ağırlıklı · **TWI** + YAS + yağış + **yüzey suyu**" diyor ve
"AHP: YAS %.. · TWI %.. · Yağış %.. · Yüzey Suyu %.." satırını basıyor. Projenin künyeleri
TWI'nin **hesaplanmadığını**, JRC yüzey suyunun **işlenmediğini** yazıyor; "yağış" bileşeni ise
yağış verisinden değil GRACE su-depolaması yönünden geliyor. "AHP" (Analytic Hierarchy Process)
için ikili karşılaştırma matrisi/tutarlılık oranı yok — ağırlıklar elle yazılmış.

**NEREDE** — `src/pages/ilce-sorgu.astro:105, 316-324, 350` → `/ilce-sorgu/`

**KANIT**

Sayfa (birebir, `:105`): `<Katman baslik="Su Çıkma Olasılığı ve Bilimsel Analiz" ipucu="AHP ağırlıklı · TWI + YAS + yağış + yüzey suyu">`

Kod (birebir, `:318-321`):

```js
const twiS = (duz + vadi)/2 || 0.3;                     // TWI değil, iki DEM oranının ortalaması
const yagS = d.graceYon === 'azalma' ? 0.3 : 0.6;       // "yağış" değil, GRACE yön etiketi
const jrcS = Math.min(1, duz*1.5) || 0.3;               // JRC değil, düz oranın 1,5 katı
const ahp = Math.round((yasS*.35 + twiS*.3 + yagS*.2 + jrcS*.15)*100);
```

`veri/potansiyel/morfoloji.json` → `yontem.twi` (birebir, baş kısmı):

```
"twi": "hesaplanmadı — 2026-07-27 ÖLÇÜMÜ: sunucu 4C/8GB ... Tüm-Türkiye mozaiği
        (230 M piksel) D8 akış birikimi ölçülen bellek ölçeğiyle ~12,6 GB ister;
        kullanılabilir 5,9 GB."
```

`data/canli/jrc-yuzey-suyu.json` (birebir): 25 havzanın tamamı

```
{"durum":"islenmedi (tile bazli hesap gerekir)"}
```

`data/canli/chirps.json` (gerçek yağış verisi) **hiçbir sayfada tüketilmiyor**
(`grep -rn "chirps" src/ --include='*.astro' --include='*.js'` → 0 sonuç).

GRACE künyesinin kendi şerhi (`data/canli/grace-havza.json`, birebir):

```
"DEĞİŞİM verisidir: yeraltı suyu + toprak nemi + kar + yüzey suyunun TOPLAM değişimini
 gösterir; mutlak su miktarı DEĞİLDİR."
```

ve havza sayfalarında basılan şerh (birebir): "Uydunun gerçek çözünürlüğü ~300 km olduğundan
havza değeri yaklaşıktır; **il/ilçe ölçeğinde kullanılamaz.**" — `/ilce-sorgu/` tam olarak bunu
ilçe ölçeğinde kullanıyor.

**SINIF ÖNERİSİ** — KARAR. Yöntem adları (AHP, TWI, JRC/yüzey suyu, yağış) görünür içerik ve
sayfanın otorite iddiasının çekirdeği.

**SINIF GEREKÇESİ** — Etiketleri düzeltmek metnin anlamını ve sayfanın vaadini değiştirir;
üstelik "AHP" ve "TWI" iddiaları kaldırılırsa geriye kalan skorun ne olduğu yeniden tanımlanmalı.

**ETKİ** — **Yüksek.** `llms.txt:447` ve sitemap üzerinden AI-arama yüzeyine "AHP ağırlıklı,
TWI tabanlı bilimsel analiz" olarak sunuluyor; hiçbiri doğru değil. Ayrıca sitenin kendi
"il/ilçe ölçeğinde kullanılamaz" şerhini ihlal ediyor.

---

### B-04 · `/havza-riski/` puanının %40'ı her havzada aynı sabit; sayfa bunu iki gerçek gösterge gibi anlatıyor

**NE** — Bileşik risk puanının "Baraj Doluluk (%25)" bileşeni **25/25 havzada 50/100 sabit**
(iki ayrı kod hatası nedeniyle veri hiç okunmuyor), "Tahsis Durumu (%15)" bileşeni ise veri
kaynağı boş olduğu için **25/25 havzada nötr 0,5**. Sayfa her ikisini de çalışan gösterge
olarak tarif ediyor.

**NEREDE** — `src/data/havza-risk.js:42, 51-60, 69-82` → `src/pages/havza-riski.astro` → `/havza-riski/`

**KANIT**

Hata 1 — anahtar uyuşmazlığı (`havza-risk.js:42`):

```js
const bHavza = baraj.havzalar?.[vd?.ad];   // vd.ad = "Gediz Havzası"
```

`data/canli/baraj.json` anahtarları (ölçüldü, birebir):

```
Doğu Akdeniz | Ceyhan | Batı Karadeniz | Antalya | Van Gölü | Seyhan | Marmara |
Batı Akdeniz | Yeşilırmak | Asi | Susurluk | Kuzey Ege | Doğu Karadeniz | Sakarya |
Kızılırmak | Büyük Menderes | Gediz
```

```
baraj.havzalar["Gediz Havzası"] = undefined
```

(Karşılaştırma: `src/data/il-profil.js:34-35` aynı işi doğru yapıyor —
**[27.08 doğrulama düzeltmesi: ajan raporunda satır 553 yazıyordu; dosya 127
satır. Doğru konum 34-35 ve orada nedeni yorumda yazılı.]** —
`havzaBaslik.replace(/\s*Havzası\s*$/, '')`.)

Hata 2 — yol uyuşmazlığı (`havza-risk.js:54`): kod `b.doluluk` okuyor, veri
`barajlar[AD].seri[TARİH].doluluk` biçiminde:

```
barajlar["DEMİRKÖPRÜ"] anahtarlari: [ 'seri' ]
.doluluk dogrudan var mi? undefined
```

Sonuç, dist'te birebir ölçüldü:

```
$ grep -o 'baraj doluluk etkisi: [0-9]*/100' dist/havza-riski/index.html | sort | uniq -c
     25 baraj doluluk etkisi: 50/100
```

Tahsis bileşeni (`havza-risk.js:70-82`): `tahsis == null` ise skor 0,5 kalıyor.
`data/havza-veri.json` ölçümü:

```
havza sayisi 25 · tahsis null olan: 25 · tahsis dolu: []
```

Sayfadaki görünür iddia (dist, birebir):

```
Baraj Doluluk (%25)
EPİAŞ günlük verisinden havzadaki enerji barajlarının anlık doluluk yüzdesi.
Düşük doluluk = yüksek risk.

Tahsis Durumu (%15)
Havzanın su tahsisine açık/kapalı olması. Kapalı/kısıtlı havza = yüksek risk.
```

Sitenin kendi havza sayfası ise (dist `/havzalar/gediz/`, birebir) tahsis için
"**veri yok** (14.07.2026) — havza bazlı açık tahsis verisi kamuya yayımlanmıyor" diyor.
Aynı veri, risk sayfasında sessizce 50 puana dönüşüyor.

**SINIF ÖNERİSİ** — KARAR. İki kod hatasının onarımı **yayımlanan tüm risk puanlarını ve
sıralamayı değiştirir** (görünür içerik + JSON-LD Observation); ayrıca tahsis bileşeninin
akıbeti (kaldırmak / "veri yok" diye göstermek / ağırlıkları yeniden dağıtmak) karar işidir.

**SINIF GEREKÇESİ** — Bu bir "künye ekleme" işi değil: sayısal çıktı ve sıralama değişecek,
25 havza sayfası ve AI-arama yüzeyine giden Observation şeması etkilenecek.

**ETKİ** — **Yüksek.** Yayımlanan sıralama, puanın %40'ı sabit olduğu için gerçekte yalnız
GRACE (%30) + YAS (%20) + yüzeysuyu (%10) üzerinden ayrışıyor; puan aralığının 39–63'e
sıkışması bunun görünür sonucu. `llms.txt:446` üzerinden dışarıya "6 göstergeden hesaplanan
bileşik risk" olarak gidiyor.

---

### B-05 · `/havza-riski/` "6 gösterge" diyor, gösterge sayısı 5 (altıncısı kodda hiç hesaplanmıyor)

**NE** — Sayfa, meta açıklaması ve JSON-LD üç ayrı yerde "6 gösterge/6 bileşen" diyor;
formülde 5 ağırlık var, sayfa 5 kart listeliyor, kodun 6. maddesi boş bir yorum.

**NEREDE** — `src/pages/havza-riski.astro:13, 50` · `src/data/havza-risk.js:90-92, 134` → `/havza-riski/`

**KANIT**

`havza-risk.js:44-51` ağırlıkları (toplam 1,0): `grace .30 · baraj .25 · yas .20 · tahsis .15 · yuzeysuyu .10` → **5 bileşen**.

`havza-risk.js:90-92` (birebir):

```js
// 6. YAS beslenimi — düşük = yüksek risk (yedek gösterge)
// Zaten YAS oranı var, bu ek destek
```

— hesaba giren tek satır yok.

Sayfa metni (`havza-riski.astro:13`, birebir):

```
'Türkiye\'nin 25 su havzası için 6 göstergeden (GRACE uydu verisi, baraj doluluk, '
```

(parantez içi **beş** gösterge sayıyor)

Katman ipucu (`:50`, birebir): `ipucu="6 bileşen · her birinin anlamı"`

JSON-LD (dist, birebir):

```
"description":"Asi Havzası için bileşik su riski puanı 63/100 (yuksek risk).
GRACE eğilim: azalma, baraj doluluk etkisi: 50/100. 6 göstergeden hesaplanmıştır."
```

**SINIF ÖNERİSİ** — UYGULAMA. Sayının 5'e düzeltilmesi görünür metnin *anlamını* değiştirmiyor
(zaten 5 kart listeleniyor, parantez içi zaten 5 sayıyor); veri sitede aynen duruyor.

**SINIF GEREKÇESİ** — Tek bir olgusal sayının kendi kaynağına (kod) uydurulması. Ancak
B-04 ile aynı dosyada olduğu için pratikte B-04 kararıyla birlikte ele alınmalı.

**ETKİ** — Orta. Doğrulanabilir yanlış sayı; meta description ve `llms.txt`'e kadar taşınıyor.

---

### B-06 · `/havza-riski/` bileşik puanı "bilimsel gösterge" diye niteliyor, yöntem künyesi yok

**NE** — Ağırlıklar (%30/25/20/15/10) ve normalizasyon sınırları elle seçilmiş; sayfada
ne bunların kimin/hangi kaynağın ağırlıkları olduğu, ne kalibrasyonun kanıtı yer alıyor.
Sayfa yine de "bilimsel bir GÖSTERGEDİR" diyor.

**NEREDE** — `src/pages/havza-riski.astro:74` · `src/data/havza-risk.js:44-62`

**KANIT**

Sayfa (birebir): `Risk puanı bilimsel bir GÖSTERGEDİR; yatırım kararı veya hukuki bağlayıcılığı YOKTUR. Saha etüdü ve hidrojeolojik raporla doğrulanmalıdır.`

Kod yorumu (birebir, `havza-risk.js:52`): `// Normalizasyon sınırları (Türkiye havzalarından kalibre edildi)`
— kalibrasyona ait bir çıktı dosyası/rapor referansı yok (karşılaştırma: `morfoloji.json`'un
TWI kaleminde `Kanıt: cikti/denetim/faz-f/twi-kapi-olcum.json` gibi somut kanıt yolu var).

Sayfada eksik olan tek cümle: puanın **bu sitenin kendi bileşik göstergesi** olduğu, kabul
görmüş bir indeks (ör. WRI Aqueduct, WEI+) olmadığı.

**SINIF ÖNERİSİ** — UYGULAMA. "Bu puan suharitasi.com'un kendi bileşik göstergesidir;
ağırlıklar portal tarafından seçilmiştir, resmî bir sınıflandırma değildir" nitelemesinin
eklenmesi; mevcut sayıların anlamı değişmiyor, veri de aynen duruyor.

**SINIF GEREKÇESİ** — Künye/şerh ekleme işi; görünür metnin ANLAMI değil, *sahipliği*
açıklığa kavuşuyor. (B-04/B-05 çözülmeden bu şerhi eklemek yalnız yarım çözüm olur.)

**ETKİ** — Orta. "Bilimsel" sıfatı, ağırlıkları portalın seçtiği bir skora dış otorite
görüntüsü veriyor.

---

### B-07 · `/ilce-sorgu/` bileşik skoru "Su Çıkma Olasılığı" (%) olarak sunuyor

**NE** — 0-100 arası ağırlıklı bir indeks, ekranda yüzde işaretiyle ve "Su Çıkma Olasılığı"
başlığıyla basılıyor. Bu bir olasılık değil; kalibrasyonu, temel oranı ve doğrulama kümesi yok.

**NEREDE** — `src/pages/ilce-sorgu.astro:74, 105, 333-334`

**KANIT** (birebir)

```js
setT('skor-degeri', ahp+'%');
setH('skor-etiket', sev+' — '+d.ilAd+' / '+d.ilceAd+' İlçe Genel Su Çıkma Olasılığı');
```

öz-cevap/meta (`:74`, birebir):

```
İl ve ilçe seçerek bölgenizdeki su çıkma olasılığını hesaplayın.
```

**SINIF ÖNERİSİ** — KARAR. "Olasılık" sözcüğü sayfanın vaadi ve H1/öz-cevap/meta açıklamasının
çekirdeği; değiştirilmesi görünür içeriğin anlamını değiştirir.

**SINIF GEREKÇESİ** — Terim düzeltmesi (olasılık → gösterge/puan) sayfanın satış vaadini
değiştirdiği için mekanik onarım değildir.

**ETKİ** — Orta-yüksek. B-02 ve B-03 ile birlikte, ölçülmemiş bir sayıya olasılık statüsü veriyor.

---

### B-08 · MTA künye bloğunda il ataması yönteminin şerhi basılmıyor

**NE** — `mta-katalog.json` künyesi il atamasının rapor **adından** tam-kelime çıkarımı
olduğunu ve çok-illi ilçe adlarının atlandığını yazıyor; il sayfasındaki "MTA rapor kataloğu
künyeleri (N)" bloğunda bu yöntem notu yer almıyor.

**NEREDE** — `veri/potansiyel/mta-katalog.json:97` → `veri/potansiyel/zenginlestirme.json` →
`src/data/potansiyel.js:94-95` → `src/components/IlPotansiyel.astro:139-149` → `/kuyu-ruhsati/[il]/` (81 sayfa)

**KANIT**

Künye (birebir):

```
"not": "Rapor satın alınmadı, içerik kopyalanmadı. İl ataması rapor ADINDAN tam-kelime
        çıkarımıdır; çok-illi ilçe adları atlanır; il çıkarılamayanlar ayrı listede."
```

(`il_atanamayan_sayisi: 32` / `toplam_kunye: 356`)

Sayfada basılan (dist `/kuyu-ruhsati/manisa/`, birebir): `MTA rapor kataloğu künyeleri (11)`
ve altında yalnız rapor adı + katalog bağlantısı. Yöntem/kapsam notu yok.

Karşılaştırma — aynı bileşendeki OSM kalemi bu işi **doğru** yapıyor (81/81 il sayfasında
ölçüldü, birebir): `Topluluk haritasında (OpenStreetMap) işaretli 4 su kaynağı, 5 kuyu —
topluluk verisi, resmî doğrulanmadı.`

**SINIF ÖNERİSİ** — UYGULAMA. OSM kalemindeki `etiket` deseninin aynısıyla tek satırlık künye
notu eklemek; künyeler zaten sitede, görünür metnin anlamı değişmiyor.

**SINIF GEREKÇESİ** — Saf künye/şerh ekleme; veri ve liste aynen kalıyor.

**ETKİ** — Düşük. Künyeler kaynağa bağlantılı ve Manisa örneğinde rapor adları ili zaten
içeriyor; risk, adında il geçtiği için yanlış ile atanmış kayıtlarla sınırlı.

---

### B-09 · `/durumum/` indeksi türetilmiş son-başvuru tarihini dayanaksız basıyor

**NE** — "27 Aralık 2029" tarihi yönetmelikte yazmıyor; yönetmeliğin "en fazla beş yıl içinde"
ifadesinden RG tarihi (27.12.2024) üzerine aritmetik olarak türetilmiş. Persona **sayfalarında**
bu dayanak künyeli basılıyor; **indeks** sayfası tarihi çıplak veriyor.

**NEREDE** — `data/lead/persona.json` → `dist/durumum/index.html`

**KANIT**

Veri künyesi (birebir, `persona.json`):

```
"Yükümlülükler ve son tarihler YALNIZ doğrulanmış kaynaktan ... Aritmetik türetme:
 rapor/persona-turetme.md."
```

İndeks sayfası (dist, birebir): `Yeşil su verimliliği belgesi yükümlüsü sektörler için son başvuru 27 Aralık 2029.`
(dayanak/madde atfı yok)

Persona sayfası (dist, birebir — burada **doğru**):

```
Son başvuru (sabit tarih) 27 Aralık 2029
Dayanak: Su Verimliliği Yönetmeliği md.(3) — Ek-2 NACE kodu bazında faaliyetler
'en fazla beş yıl içinde' yeşil su verimliliği belgesi başvurusu · Ek-2 NACE listesi,
sıra 13 · kod 16 (OCR doğrulaması: data/lead/nace-ek2.json)
```

**SINIF ÖNERİSİ** — UYGULAMA. İndekse persona sayfasındaki dayanak cümlesinin kısaltılmış
halini eklemek; tarih ve anlam değişmiyor, kaynak zinciri görünür oluyor.

**SINIF GEREKÇESİ** — Kaynak künyesinin eksik yüzeye taşınması; hukuki metnin içeriği değişmiyor.

**ETKİ** — Düşük-orta. Tarih doğru türetilmiş ve alt sayfalarda künyeli; yalnız giriş
sayfasında zincir görünmüyor.

---

## TARAMA 2 — KAYNAĞI GÖSTERİLMEMİŞ OLGUSAL İDDİA

### Şablon başına denetim tablosu (21 şablon)

Meşru kaynak zinciri: **(i)** rakam build'de veriden sayılıyor (sayı bekçisi) · **(ii)** KAYNAKLAR.md künyesi · **(iii)** sayfada görünür künye/bağlantı.

| # | Şablon / örnek sayfa | İncelenen olgusal iddia | Zincir | Sonuç |
|---|---|---|---|---|
| 1 | `/` (ana sayfa) | 472 kütle · 25 havza · 419 RG · 1963 · 347 eşleme · 70 il · 155 kurum · 20 işlem · 25/81/10 envanter | (i) — hepsi doğrulandı, aşağıya bkz. | temiz |
| 2 | `/harita/` | 25 havza kartı, km³/hm³/cm-yıl değerleri + kaynak künyesi | (iii) | temiz |
| 3 | `/havzalar/` | 25 havza yağış alanı + potansiyel, "(DSİ 2024)" | (iii) | temiz |
| 4 | `/havzalar/[slug]` (gediz) | 17.137 km² · 1,45 km³ · 1.155,9/866,9 hm³ · %108,3 · −1,05 cm/yıl | (i)+(iii) — veriden doğrulandı | temiz |
| 5 | `/nerede-su-cikar/` | 12 plan · 472 · 347 · 419 · 1963 | (i) | temiz |
| 6 | `/rehberler/` | 5686/167/5393/831/2886/2942 atıfları | (iii) | temiz (madde no doğrulanmadı) |
| 7 | `/rehberler/ruhsatsiz-kuyu-cezalari/` | 167 m.18/a-b · 1.000–5.000 TL · 500–2.000 TL · 3 emsal karar | (iii) | **B-10** |
| 8 | `/rehberler/jeotermal-ruhsat/` | 5686 m.5-6 · 3 yıl · 30 yıl · 5.000 ha | (iii) | temiz (madde no doğrulanmadı) |
| 9 | `/rehberler/kuyu-tasima/` | 167 m.18 tutarları + yeniden değerleme notu | (iii) | temiz |
| 10 | `/kuyu-ruhsati/` | 81 il | (i) | temiz |
| 11 | `/kuyu-ruhsati/[il]` (manisa) | 15 kütle · 5 havza · RG 13048 · %16,0/%14,9 · MTA 11 | (i)+(iii) | B-08 |
| 12 | `/durumum/` | 42 sektör · 27.12.2029 | (i)/(ii) | B-09 |
| 13 | `/durumum/[persona]` | NACE 16 · md.(3) · sıra 13 | (iii) | **B-11** (kırpılma) |
| 14 | `/goller/[slug]` (abant) | 1,13 km² · koordinat · il/havza eşlemesi | (iii) | temiz |
| 15 | `/nehirler/[slug]` (aksu) | koordinat · havza · örneklenen il | (iii) | temiz |
| 16 | `/vaka/meysu` | 3.395,33 ha · 05.03.2056 · KAP 1597446/1599068/1604957 | (iii) | temiz |
| 17 | `/hangi-kurum/` | 20 işlem · 155 kurum · madde atıfları · 11/5/3/1 dağılımı | (i)+(iii) | temiz |
| 18 | `/ilimde-kim-yetkili/` | 81 il · DSİ bölge eşlemesi | (iii) | temiz |
| 19 | `/arsiv/` | 8 set · 419/109/310 · 417 · 472/347 · 254 ay · 42 gün/969 dosya | (i) | temiz |
| 20 | `/kapatma-kaydi/` | 23 pasaj · 1966-2014 · RG tarih+sayı | (iii) | temiz |
| 21 | `/hakkinda/` · `/su-kanunu/*` · `/kullanilanlar/` · `/havza-riski/` · `/ilce-sorgu/` | politika + mevzuat envanteri + altyapı sayıları + risk + araç | (i)/(iii) | B-01…B-07 |

### Ana sayfa / arşiv rakamlarının doğrulaması (ölçüldü, `node`)

```
RG toplam 419 = 109 + 310        ✓ (ana sayfa "419")
yil araligi 1963 - 2017          ✓ ("1963-2017", "1963'e uzanan")
tarihli kayit 419                ✓ ("419/419 tarihli")
eslesen il (dizi) 70             ✓ ("70 ile eşlendi")
rg_sayi kunyeli 417              ✓ ("417'inde gazete sayısı künyeli")
havza plani 12 · kutle 472       ✓ ("12 yayımlı havza planından 472")
kutle-il eslesti 347             ✓ ("347'si il sınırına eşlendi")
su birimi 155 · su islemi 20     ✓ ("155 su kurumu", "20 su işlemi")
grace ay 254                     ✓ ("254 aylık uydu serisi")
havza-veri havza sayisi 25       ✓
```

`il` alanı dizi olmayan 57 kaydın tamamı açıkça `"belirsiz (başlıktan çıkarılamadı)"` /
`"belirsiz (pasajdan çıkarılamadı)"` — sayıma girmemeleri **doğru** davranış, bulgu değil.

Gediz çapraz kontrolü: `potansiyel 2013=555 → 2024=1155,9` = %108,3 ✓ ·
`rezerv 2013=248 → 2024=866,9` = %249,6 ✓ — sayfadaki iki yüzde de veriden birebir çıkıyor.

---

### B-10 · Ceza rehberi 2008 nominal tutarlarını güncel tutar gibi bırakıyor (aynı sitenin başka sayfası uyarıyor)

**NE** — `/rehberler/ruhsatsiz-kuyu-cezalari/` öz-cevabı ve tablosu "1.000–5.000 TL" ve
"500–2.000 TL" diyor; idari para cezalarının her yıl yeniden değerleme oranıyla arttığı
uyarısı bu sayfada yok. Aynı bilgi `/rehberler/kuyu-tasima/` sayfasında **var**.

**NEREDE** — `src/content/rehberler/ruhsatsiz-kuyu-cezalari.md:7 (ozCevap), 33-42` → `/rehberler/ruhsatsiz-kuyu-cezalari/`

**KANIT**

Bu sayfadaki tek niteleme (dist, birebir):

```
Tablodaki tutarlar 2008 tarihli 5728 sayılı Kanun'la belirlenen kanuni
alt ve üst sınırlardır.
```

Öz-cevap ve meta description (birebir — nitelemesiz):

```
Belgesiz kuyu açmak veya belge dışına çıkmak 167 s.K. m.18 uyarınca idari para cezası
doğurur: m.18/a kapsamında 1.000–5.000 TL, m.18/b kapsamında 500–2.000 TL.
```

Sitenin kendi başka sayfası (`src/pages/rehberler/kuyu-tasima.astro:416-420`, dist'te de var —
birebir):

```
Yukarıdaki tutarlar 2008 metnindeki tabandır; idari para cezaları her yıl yeniden
değerleme oranıyla artmaktadır. Güncel tutar için: [APILEX teyit].
```

Ölçüm: `grep -rl "yeniden değerleme" dist --include='*.html'` → **yalnız 1 dosya**
(`dist/rehberler/kuyu-tasima/index.html`).

**SINIF ÖNERİSİ** — KARAR. Hukuki metin ve para tutarı; öz-cevap + meta description +
FAQPage alıntısı etkilenir. [SERDAR-HUKUK].

**SINIF GEREKÇESİ** — CLAUDE.md'ye göre hukuki metin ve görünür içerik değişikliği kara liste;
ayrıca hangi ifadenin kullanılacağı (yeniden değerleme oranına atıf, güncel tutar verilip
verilmeyeceği) avukat kararıdır.

**ETKİ** — **Yüksek.** Öz-cevap, sitenin "AI-arama alıntı cümlesi kaynağı" (CLAUDE.md içerik
ilkesi); ziyaretçi 2026'da 2008 nominal tutarını güncel ceza sanabilir. Maddi karara
(itiraz/ödeme) yönelen bir sayı.

**NOT — doğrulanmadı (27.08.2026):** 167 s.K. m.18'in 5728 s.K. m.270 ile değiştirildiği ve
tutarların "bin–beşbin" / "beşyüz–ikibin" TL olduğu iddiası sayfadaki birebir madde alıntısıyla
tutarlıdır; ancak madde/kanun numaraları ve güncel yeniden değerlemeli tutarlar bu denetimde
resmî kaynaktan doğrulanmadı (çevrimdışı denetim).

---

### B-11 · Bir persona sayfasının öz-cevabı tarihin ortasından kırpılmış ("Son başvuru: 27")

**NE** — 280 karakter kuralı uygulanırken cümle sayının ortasında kesiliyor; sayfa, meta
description ve JSON-LD "Son başvuru: 27" diye bitiyor.

**NEREDE** — `dist/durumum/agac-ve-agac-urunleri-imalati-nace-16/` (42 persona sayfasından 1'i)

**KANIT** (ölçüldü)

```
$ grep -o 'Son başvuru: [^<]\{0,20\}' dist/durumum/*/index.html | sort -u | grep -v "27 Aralık 2029"
agac-ve-agac-urunleri-imalati-nace-16:Son başvuru: 27
agac-ve-agac-urunleri-imalati-nace-16:Son başvuru: 27 "}}]}]}
```

(ikinci satır JSON-LD gövdesinden — şemaya da kırpık girmiş)

Diğer 41 persona sayfasında (ölçüldü) `Son başvuru: 27 Aralık 2029.` tam.

**SINIF ÖNERİSİ** — UYGULAMA. Kırpmanın cümle/sözcük sınırında yapılması (mevcut il öz-cevap
üreticisinde — `src/data/potansiyel.js:132-139` — zaten cümle sınırından kırpma deseni var).
Veri ve anlam değişmiyor; eksik yarım cümle tamamlanıyor.

**SINIF GEREKÇESİ** — Görünür metnin ANLAMI değişmiyor; hâlihazırda bozuk olan çıktı
düzeltiliyor. Kırpma mantığı tek yerde olduğu için diğer 41 sayfa etkilenmez.

**ETKİ** — Orta. Tek sayfa, ama etkilenen alan meta description + FAQ şeması, yani doğrudan
arama/AI-arama alıntı yüzeyi; "Son başvuru: 27" anlamsız bir tarih parçası.

---

## RED EDİLEN ADAYLAR (kusur değil — gerekçeli)

| Aday | Gerekçe |
|---|---|
| `morfoloji.json` (il DEM, "türetilmiş") | Şerh sayfada **birebir** basılıyor: "Sayısal yükseklik modelinden türetilmiş morfolojik göstergedir; akifer varlığının kanıtı değildir." → TEMİZ |
| `osm-su-noktalari` ("resmî doğrulanmadı") | `etiket` alanı 81/81 il sayfasında basılıyor (ölçüldü) → TEMİZ |
| `gol-nehir-cografya.js` (geometrik örnekleme) | Göl/nehir/havza sayfalarında şerh var: "İl ve havza eşlemesi ... örneklenmiş noktalarından türetilmiştir ... idari/hidrografik tescil yerine geçmez." → TEMİZ |
| `rg-sayi.js` (RG sayısı URL'den türetimi) | Sayfada yıldız + dipnot: "* işaretli sayılar Resmî Gazete arşiv bağlantısından türetilmiştir ... yöntem 109 künyeli kayıtta doğrulanmıştır." → TEMİZ |
| `kutle-il.json` `belirsiz`/`dogrulanamadi` kayıtları | `potansiyel.js:46` yalnız `durum === 'eslesti'` basıyor; 125 kayıt yayına hiç girmiyor → TEMİZ |
| `vitrin.js` kapatma kayıtları | Sayfada birebir: "Bu kayıtların hangi ile ait olduğu doğrulanmadı; il eşlemesi yapılmamıştır." → TEMİZ |
| GRACE serileri | Her tüketen sayfada "DEĞİŞİM verisidir ... mutlak su miktarı değildir" + "~300 km ... il/ilçe ölçeğinde kullanılamaz" → TEMİZ (ihlal B-03'te, GRACE'in kendisinde değil) |
| `hangi-kurum` "doğrulanmadı" etiketleri | Doğrulanmamış kanal/madde açıkça "kanal doğrulanmadı" / "Madde numarası doğrulanmadı" yazıyor → örnek uygulama |
| Ana sayfa "Su hukuku ve yeraltı suyu mevzuatında uzmanlık" / "DSİ ve idari kurum süreçlerinde deneyim" | Veri iddiası değil, mesleki nitelik beyanı; TARAMA 2 kapsamında "kaynak zinciri" aranacak bir olgu değil. (Ayrı bir boyutta — avukat reklam mevzuatı — değerlendirilmesi gerekebilir; bu denetimin konusu değil, **bulgu yazılmadı**.) |
| `isletme-sahalari.json` `il: "belirsiz (...)"` kayıtları | 57/419 kayıt açıkça belirsiz etiketli, sayıma girmiyor → doğru davranış |
| Ana sayfa "15+ yıl / 500+ dosya" tipi rakamlar | `Hakkinda.astro:2-5` yorumunda "v0'daki ... UYDURMA → YAZILMADI" kaydı; yerine build'de sayılan envanter → örnek uygulama |
| `chirps.json` / `era5-toprak.json` / `jrc-yuzey-suyu.json` | Hiçbir sayfada tüketilmiyor (grep 0) → yayın yüzeyinde iddia yok. (Ancak B-03'te bu setlerin *adı* iddia olarak kullanılıyor.) |

---

## KAPANMIŞ KARARLARA DOKUNULMADI

Brief gereği şunlar bulgu yazılmadı: göl/nehir sınır-ötesi öznitelik temizliği (§25) ·
`/su-hukuku/` 301 (§26) · 2 İÜC kitabı "doğrulanamadı" künyesi · havza title/öz-cevap
kalıpları ve havza FAQ DOM'u (§29) · ana sayfa öz-cevap muafiyeti (§8) · `/harita/` H1'sizliği
(§9) · [SERDAR-HUKUK] bekleyen 11 title + uzun öz-cevap · `Hero.astro` + `anasayfa-satis.js`
çalışma ağacı durumu.

---

## SAYIM VE YÖNTEM

**Taranan veri dosyası: 59** (künyesi/başlık yorumu okundu)

- `veri/potansiyel/*.json` — 13
- `data/canli/*.json` — 7
- `data/kamu/*.json` — 5
- `data/lead/*.json` — 2
- `data/*.json` (kök: `havza-veri.json`, `il-kurum.json`) — 2
- `data/havzalar/*.geojson` — 2
- `src/data/*.js|*.ts` — 24
- `src/data/*.json` — 4

**Taranan şablon: 21** (yukarıdaki TARAMA 2 tablosu; 522 sayfanın tamamı bu 21 şablondan üretiliyor)

**Kullanılan komutlar (özet)**

```bash
grep -rniE "türetil|tahmin|sentetik|temsil|varyasyon|interpolasyon|modellen|yaklaşık|
  hesaplan|örneklem|DEĞİLDİR|doğrulanmad|resmî değil|estimate|derived|synthetic|
  proxy|vekil" --include='*.json' --include='*.js' --include='*.ts' \
  src/data veri/potansiyel data/canli data/kamu data/lead data/havza-veri.json data/il-kurum.json

node -e "…"                       # her JSON'un üst-düzey künye alanlarının dökümü
head -45 src/data/*.js src/data/*.ts   # başlık yorum blokları

grep -rn "ilce-morfoloji|potansiyel/morfoloji|osm-su-noktalari|kutle-il|gol-nehir-cografya|
  havza-risk|ruhsat-risk|vitrin|rg-sayi|grace|zenginlestirme|jrc-yuzey|chirps|era5" src/

node scratchpad/metin.mjs dist/<yol>/index.html      # dist HTML → görünür metin (script/style çıkarılır)
grep -o 'baraj doluluk etkisi: [0-9]*/100' dist/havza-riski/index.html | sort | uniq -c
grep -o 'Son başvuru: [^<]\{0,20\}' dist/durumum/*/index.html | sort -u
grep -rl "yeniden değerleme" dist --include='*.html'
grep -rho "ilçesinde tahmini su doygunluk derinliği[^\"']\{0,30\}" dist/
node -e "…"                       # 419/472/347/70/417/254/155/20 sayı doğrulamaları
```

**TARANAMAYAN YÜZEY (dürüstçe)**

1. **`data/arsiv/` — 926 günlük anlık görüntü JSON'u** okunmadı. Yalnız üst künye
   (`baraj.json`) ve `/arsiv/` sayfasındaki sayım (42 gün / 969 dosya) doğrulandı.
   Günlük anlık görüntülerin içerik doğruluğu bu denetimin dışında.
2. **`kaynak/dsi-arsiv/` — 233 xls/xlsx/docx** açılmadı. Yani "DSİ 2024 Tablo 1.2/1.3/1.6"
   değerlerinin **kaynak dosyadaki** karşılığı doğrulanmadı; yalnız `data/*.json` ↔ dist
   zinciri doğrulandı. Kaynak → JSON adımı denetlenmedi.
3. **`veri/ham/nhyp/` — 84 PDF/TXT** okunmadı. 472 kütlenin ve `alinti` beyanlarının
   NHYP metnindeki karşılığı doğrulanmadı (kalite kapısı `yas-kutleleri.json` içindeki
   `beyan`/`kalite_kapisi` alanlarına güvenildi).
4. **Mevzuat doğruluğu.** Hiçbir madde/kanun numarası resmî kaynaktan teyit edilmedi
   (çevrimdışı denetim). Tabloda "madde no doğrulanmadı" yazan her satır ve B-10'daki
   167 m.18 atfı **doğrulanmadı (27.08.2026)** olarak işaretlidir. Emsal karar künyeleri
   (Yargıtay 7. HD 2011/3727 E. 2012/3244 K. · Danıştay 8.D 2023/663 E. 2023/829 K. ·
   Danıştay 8.D 2022/3005 E. 2022/3470 K.) da **doğrulanmadı (27.08.2026)** — sitenin
   kendisi bunları zaten "Karar künyeleri yayın öncesi doğrulama sürecindedir" şerhiyle
   yayımlıyor (`/hakkinda/` politikası ile tutarlı).
5. **`/ilce-sorgu/` çalışma-anı çıktıları tarayıcıda görülmedi** (brief: tarayıcı açma).
   Kanıt kaynak koddan ve dist bundle'ındaki minified dizgelerden alındı; üretilen cümlelerin
   ekrandaki tam hâli ölçülmedi.
6. **Göl/nehir sayfalarının 247+95 örneği tek tek açılmadı** — şablon başına birer örnek
   incelendi (`abant-golu`, `aksu-cayi`). Şablon ortak olduğu için şerh varlığı şablon
   düzeyinde geçerli; öznitelik-özel sapmalar taranmadı.
7. **`data/orders.db`** (SQLite) açılmadı — yayın yüzeyinde tüketilmiyor.
8. **`harita-pilot` / `stil-pilot`** sayfaları uydurma açısından incelenmedi (pilot/deneme
   yüzeyleri; sitemap'te de yoklar).

---

## ÖNCELİK SIRASI (en ağırdan)

1. **B-04** — `/havza-riski/` puanının %40'ı sabit (baraj bileşeni iki kod hatasıyla ölü) · KARAR
2. **B-02** — `/ilce-sorgu/` veri karşılığı olmayan akifer türü + kuyu derinliği üretiyor · KARAR
3. **B-01** — `/ilce-sorgu/` türetilmiş ilçe morfolojisini "Copernicus GLO-90 DEM" diye künyeliyor · KARAR
4. **B-03** — `/ilce-sorgu/` hesaplanmamış TWI + işlenmemiş JRC + dayanaksız "AHP" iddiası · KARAR
5. **B-10** — Ceza rehberi 2008 tutarlarını yeniden değerleme uyarısı olmadan basıyor · KARAR [SERDAR-HUKUK]
6. B-07 · B-06 · B-05 · B-11 · B-09 · B-08
