# DENETİM — KULLANICI KARARI BEKLEYEN KALEMLER

Tam denetim (27.08.2026). Kural gereği iş sırasında hiç soru sorulmadı;
karar sınıfına giren her bulgu buraya yazıldı ve iş kesintisiz sürdü.

**Kanıt dosyaları:** `26-08-denetim-SINIFLANDIRMA.md` (tek liste, tüm
sınıflar) · `26-08-denetim-dogrulama.md` (bağımsız doğrulamalar D1-D13) ·
`26-08-denetim-15a-uydurma.md` · `26-08-denetim-15be-dil.md` ·
`26-08-denetim-18-geo.md` · `26-08-denetim-DURUM.md` (EK-A).

**Neden bu liste uzun:** brief 2b kuralı — *"görünür metin ve JSON-LD
bit-eşit kalmalı, kalmıyorsa o onarım UYGULAMA sınıfı değildir"*. Bu
kural gereği, kusur ne kadar belli ve düzeltme ne kadar mekanik olursa
olsun, **yayınlanan metni ya da şemayı değiştiren hiçbir onarım kendi
başıma uygulanmadı.** Aşağıdaki kalemlerin çoğu "onayla, tek turda
uygulanır" cinsindendir.

---

# 0. DEVRALINAN ÜÇ AÇIK KARAR (denetim öncesinden)

Üçü de 26.08.2026 hero düzeltmesi oturumundan. Bekleyen değişiklikler
çalışma ağacında duruyor (`src/components/anasayfa/Hero.astro` +
`src/data/anasayfa-satis.js`) — bu denetimde **dokunulmadı, commit
edilmedi, geri alınmadı**; taban ölçümü bu değişiklikler dahilken alındı.

### 0.1 · Rozet "DANIŞMANLIK"
Hero'daki rozet metni kararı. Bu denetim kapsamında yeniden açılmadı.

### 0.2 · Logo seçimi
Logo alternatifleri arasından seçim. Bu denetim kapsamında açılmadı.

### 0.3 · Hero kıyas kareleri onayı
Bekleyen hero düzeltmesi: birincil CTA ("Ücretsiz Ön Görüşme Alın")
kaldırıldı; `HERO_ALT` dört-sayılı veri-envanteri cümlesine döndü (dört
sayı build-zamanı bekçili). Kareler: `cikti/denetim/hero-duzeltme/
kiyas-1440.png` ve `kiyas-430.png`. Onaylanırsa commit edilir; nihai
kanıt canlı testtir (İş kapanış kuralı).

---

# 1. ÖNCE BUNLAR — dürüstlük sınırına dokunan üç kalem

## K1 · `/havza-riski/` puanının %40'ı her havzada aynı sabit

**Ne bulundu.** Bileşik risk puanının iki bileşeni 25 havzanın 25'inde de
sabit: "Baraj Doluluk (%25)" iki kod hatası yüzünden, "Tahsis Durumu
(%15)" veri boşluğu yüzünden. Sayfa ikisini de çalışan gösterge olarak
anlatıyor.

**Ölçüm kanıtı.**
- Kod hatası 1 — `src/data/havza-risk.js:42` `baraj.havzalar["Gediz
  Havzası"]` arıyor; `data/canli/baraj.json` anahtarı `"Gediz"`.
  Ölçülen eşleşme: **0/25**. (Aynı işi `src/data/il-profil.js:34-35`
  doğru yapıyor ve **nedenini yorumda yazıyor**: *"EPİAŞ havza adı
  çıplaktır ('Sakarya'); site başlığı 'Sakarya Havzası'"* →
  `const ad = havzaBaslik.replace(/\s*Havzası\s*$/, '')`. Yani depo bu
  uyuşmazlığı BİLİYOR ve bir yerde doğru çözüyor, risk hesabında çözmüyor.)
- Kod hatası 2 — `havza-risk.js:54` `b.doluluk` okuyor; baraj kaydının
  gerçek alanları `['seri']`, doluluk `b.seri[tarih].doluluk` altında.
- Veri boşluğu — `data/havza-veri.json`'da `tahsis` **25/25 null**.
- Yayınlanmış sonuç:
  `grep -o "baraj doluluk etkisi: [0-9]*/100" dist/havza-riski/index.html
  | sort | uniq -c` → **`25  baraj doluluk etkisi: 50/100`**
- Yayın yüzeyi: sitemap'te · robots meta yok (indekslenebilir) ·
  `llms.txt`'te · **521 sayfadan iç link**.
- Sayfanın kendi iddiası: *"25 su havzası için 6 göstergeden (GRACE uydu
  verisi, baraj doluluk, YAS rezervi, tahsis durumu, yüzey suyu
  potansiyeli) hesaplanan bileşik su riski"*.
- Aynı veri için `/havzalar/gediz/` dürüstçe *"veri yok (14.07.2026) —
  havza bazlı açık tahsis verisi kamuya yayımlanmıyor"* diyor.

**Neden karar sınıfı.** Onarım yayımlanan tüm risk puanlarını, havza
sıralamasını ve JSON-LD `Observation` şemasını değiştirir.

**Seçenekler ve sonuçları.**
- **(a) İki kod hatasını düzelt + tahsisi "veri yok" olarak işaretleyip
  ağırlığı kalan göstergelere dağıt.** Sonuç: puanlar ve sıralama
  değişir; gösterge sayısı ve künye dürüstleşir. K12 (6↔5 gösterge) ve
  K13 (yöntem künyesi) bu turda birlikte kapanır.
- **(b) Baraj hatasını düzelt, tahsis bileşenini tümden çıkar.** Sonuç:
  "5 gösterge" olur; puanlar değişir; tahsis verisi geldiğinde geri
  eklemek yeni iş olur.
- **(c) Yalnız metni düzelt, puanı olduğu gibi bırak** ("bu iki
  bileşende veri yok" şerhi). Sonuç: sayılar değişmez, ama puanın %40'ı
  sabit 0,5 olarak puana girmeye devam eder.

**Tavsiye: (a).** Gerekçe: sitenin `/hakkinda/` sayfasındaki kendi
taahhüdü *"Doğrulanamayan hiçbir veri doğrulanmış gibi gösterilmez…
tahmin veya ara değer üretilmez."* (c) bu taahhüdü karşılamaz, çünkü
sabit 0,5 tam olarak bir ara değerdir. **ETKİ: YÜKSEK.**

## K7 · `/ilce-sorgu/` veri karşılığı olmayan akifer türü, derinlik ve "olasılık" üretiyor

**Ne bulundu.** Üç katman:
1. **Künye ters yönde.** `veri/potansiyel/ilce-morfoloji.json` kendi
   künyesinde *"Bu veri GERÇEK ilçe ölçümü DEĞİLDİR. İl düzeyindeki
   Copernicus GLO-90 DEM verisinden ilçe ismiyle tohuma bağlı
   varyasyonla türetilmiştir (±%15 deterministik varyasyon)"* diyor;
   sayfa bunu **"Arazi Yapısı · Copernicus GLO-90 DEM"** künyesiyle
   basıyor. Şerh eksik değil — **olmayan bir ölçüm kaynağı iddia
   ediliyor.** Ayrıca `ort_egim` 948/948 null olduğu için her ilçede
   "Ortalama eğim: 0,0°" yazıyor.
2. **Veri karşılığı hiç olmayan çıktı.** `dMin = 15 + (1-duz)*65`
   formülünden "tahmini su doygunluk derinliği: X–Y metre"; eşiklerden
   "baskın kayaç ve akifer türü: Alüvyal / Karstik / Granit". Depoda ne
   litoloji ne derinlik verisi var.
3. **Yöntem etiketleri dayanaksız.** "AHP" iddiası; `morfoloji.json`
   "twi: hesaplanmadı" derken TWI bileşen olarak gösteriliyor;
   `jrc-yuzey-suyu.json` 25/25 havzada `"islenmedi"`; "yağış" bileşeni
   CHIRPS'ten değil GRACE yön etiketinden geliyor — oysa havza
   sayfalarının kendi şerhi "GRACE il/ilçe ölçeğinde kullanılamaz"
   diyor. Bileşik skor **"Su Çıkma Olasılığı %"** olarak sunuluyor; bu
   bir indeks, olasılık değil.

**Ölçüm kanıtı.** `src/pages/ilce-sorgu.astro:14` (import), `:41-62`,
`:121`, `:347-348`, `:353-355`; künye alıntıları birebir yukarıda.
Sayfada genel "TEMSİLÎDİR" şerhi var (`:151`) ama türetme yöntemini
söylemiyor. Yayın yüzeyi: sitemap'te · indekslenebilir · 521 iç link.

**Neden karar sınıfı.** Görünür içerik ve sayfanın vaadi değişir; ayrıca
bu bir **maddi karar aracıdır** — CLAUDE.md "Altyapıda hızlı, iddiada
yavaş" kuralı bu tür araçlarda keşif raporu → değerlendirme oturumu →
[SERDAR-HUKUK] onayı → uygulama briefi sırasını zorunlu kılıyor.

**Seçenekler ve sonuçları.**
- **(a) Veri karşılığı olmayan üç çıktıyı kaldır** (akifer türü, derinlik
  aralığı, "olasılık"), sayfayı ölçülen veriye indir. Sonuç: sayfa
  küçülür ama söylediği her şey doğrulanabilir olur.
- **(b) Künye ve yöntem şerhini dürüstleştir** ("bu değerler il
  verisinden türetilmiş tahmindir; ilçe ölçümü yoktur"; "AHP" ve "TWI"
  etiketlerini gerçek yönteme çevir). Sonuç: çıktı kalır, iddia küçülür.
- **(c) Sayfayı `noindex`e al**, yeniden tasarlanana kadar yayın
  yüzeyinden çıkar. Sonuç: geçici, tersine çevrilebilir.

**Tavsiye: (a) + (b) birlikte.** Türetilmiş olduğu açıkça yazılamayan
çıktı kaldırılsın, kalanın künyesi gerçek yöntemi söylesin. (c) bunlar
yapılana kadar geçici çare olarak uygulanabilir. **ETKİ: YÜKSEK.**

## K8 · Ceza rehberi 2008 nominal tutarlarını güncel gibi bırakıyor · [SERDAR-HUKUK]

**Ne bulundu.** `/rehberler/ruhsatsiz-kuyu-cezalari/` öz-cevabı ve meta
description'ı "167 s.K. m.18/a 1.000–5.000 TL, m.18/b 500–2.000 TL"
diyor. Yeniden değerleme uyarısı dist'te **yalnız**
`/rehberler/kuyu-tasima/` sayfasında var.

**Neden karar sınıfı.** Hukuki metin + para tutarı — kara liste.

**Seçenekler.** (a) Yeniden değerleme şerhini bu sayfaya da taşı ·
(b) güncel tutarı yaz · (c) dokunma.

**Tavsiye: (a).** **(b) YAPILMADI ve yapılmamalı** — güncel yeniden
değerleme oranıyla hesaplanmış tutar bu denetimde **doğrulanmadı
(27.08.2026)**; doğrulanmamış rakam yazmak uydurma olur.
**ETKİ: YÜKSEK** (ziyaretçi maddi sonuç çıkarıyor).

---

# 2. ONAYLA-VE-UYGULA — mekanik, anlamı değiştirmeyen düzeltmeler

## K2 · 519 sayfada boşluk yutması: "Av. Serdar Arslan —Arslan Hukuk Bürosu"
**Ne bulundu.** Kaynakta metin ile satır-içi etiket alt alta yazıldığında
aradaki satır sonu derlemede yutuluyor. Kök neden 11 kaynak dosyada
izlendi; en genişi `src/components/AltBilgi.astro:63-64` (site geneli
alt bilgi).
**Ölçüm kanıtı.** dist ham çıktı: `…Av. Serdar Arslan —<a href=
"https://arslanhukuk.tr" …>Arslan Hukuk Bürosu`; `grep -rlc 'Arslan —<a'
dist --include="*.html" | wc -l` → **519**. `/hakkinda/` görünür
metninde üç yapışma bir arada: *"…mevzuat analizleriAv. Serdar Arslan
(Arslan Hukuk Bürosu)tarafından hazırlanmaktadır."*
**Neden karar sınıfı.** Düzeltme görünür metni değiştirir (boşluk ekler).
**Anlam değişmiyor.**
**Tavsiye: onayla.** Kusur sitenin künyesinde, güven sinyalinin tam
ortasında. **ETKİ: YÜKSEK (519 sayfa).**

## K3 · 76 sayfada kardeş il bağlantıları etiketsiz ("→ →")
**Ne bulundu.** `src/pages/kuyu-ruhsati/[il].astro:201` `{x.ad}` okuyor;
`src/data/il-profil.js:105` nesnesinde alan adı **`il`** — `ad` yok.
"Aynı DSİ bölgesindeki diğer iller hangileri?" sorusunun cevabı boş.
**Ölçüm kanıtı.** dist: `<a href="/kuyu-ruhsati/hatay/">&rarr; </a>`;
`grep -rl 'aria-label="Aynı DSİ bölgesindeki iller"' dist | wc -l` → **76**.
Aynı dosyanın `:213` satırı (`g.ad`, göller) doğru çalışıyor.
**Üç ayrı zarar:** H2 cevapsız · bağlantı metni anlamsız (WCAG 2.4.4) ·
il↔il iç bağlantı ağı değersiz.
**Tavsiye: onayla** — tek sözcük (`x.ad` → `x.il`). **ETKİ: YÜKSEK.**

## K4 · Ölü B2B palet bloğu her sayfaya gönderiliyor
**Ne bulundu.** `src/layouts/Sayfa.astro:217-241` — 16 renk + 3 gradyan +
2 gölge + 2 radius. `var(--b2b-…)` kullanımı repo genelinde (arşiv ve
araçlar dahil) **sıfır**; blok `dist/_astro/SayfaBasi.css` ile yayına
çıkıyor. Kimlik: 04.08 satış/B2B dalgasının kalıntısı — o dalga
KARARLAR §25 ile kaldırılmış, palet gözden kaçmış. DESIGN.md bu aileyi
tanımıyor; içinde `#1565C0`, `#C62828`, `#E65100` gibi palet dışı
değerler var.
**Neden karar sınıfı.** Brief'in bu kalem için koyduğu iki şarttan
(i) "seçici kullanılmıyor" sağlandı, (ii) "üretilen CSS bit-eşit kalıyor"
**sağlanmadı** (blok CSS'e basılıyor). Teknik not: hiçbir kural bu
değişkenlere başvurmadığı için render'ın değişmesi mümkün değildir.
**Tavsiye: silinsin.** **ETKİ: Orta-yüksek.**

## K5 · Yazar kimliği ikiye bölünmüş, `url`'leri çelişiyor
**Ne bulundu.** İki `Person` düğümü: `#yazar` (zengin: `jobTitle`,
`description`, `knowsAbout`, `worksFor`; `url` = `/hakkinda/`) ve
`hakkinda/#yazar` (`url` = `arslanhukuk.tr`). **92 Article'ın tamamı
ikinciye bağlanıyor**; `sameAs` boş.
**Neden karar sınıfı.** JSON-LD değişir.
**Tavsiye: tek `@id` altında birleştir.** **ETKİ: Orta-yüksek** —
E-E-A-T kimlik sinyalinin tamamı buradan geçiyor.

## K6 · `Observation` şemasında ölçüm değeri yanlış alanda
**Ne bulundu.** 25 kayıtta değer `measuredProperty.value` içinde;
`Observation.value` **0/25**, `observationDate` **0/25**. Ayrıca
`includedInDataCatalog` bir DataCatalog'a değil WebSite düğümüne
işaret ediyor.
**Tavsiye: alanları düzelt** — ama **K1'den SONRA**; K1 çözülmeden şemayı
zenginleştirmek sabit bileşenli puanı daha görünür kılar. **ETKİ: Orta.**

## K9 · "Hukuki görüş değildir" şerhi ters dizilmiş · [SERDAR-HUKUK]

**Ne bulundu.** Şerh sitede var ama **en çok gerektiği yerlerde yok.**

**Ölçüm kanıtı** (27.08, 522 sayfa tarandı — bu denetimde bağımsız
yeniden ölçüldü): **şerhli 425 · şerhsiz 97.** Şerhsizlerin dağılımı:

| Bölüm | Şerhsiz sayfa |
|---|---:|
| `/durumum/` (sektör yükümlülüğü + son başvuru tarihi) | **43** |
| `/havzalar/` | **26** |
| `/rehberler/` (hukuk rehberleri) | **11** |
| `/su-kanunu/` | 3 |
| `/vaka/` | 2 |
| ana sayfa · `/kuyu-ruhsati/` · `/nerede-su-cikar/` · `/arsiv/` · `/kapatma-kaydi/` · `/ilimde-kim-yetkili/` · `/harita/` · `/kullanilanlar/` | 1'er |
| **`/ilce-sorgu/`** ve **`/havza-riski/`** | **1'er** |

**Ters dizilim iki yerde en görünür:**
1. Göl yüzey alanı bildiren sayfa şerhli; **idari para cezası tutarı ve
   27.12.2029 son başvuru tarihi bildiren sayfa şerhsiz.**
2. Sitenin en iddialı iki türetilmiş çıktısını üreten sayfalar —
   `/ilce-sorgu/` ("su çıkma olasılığı", akifer türü, kuyu derinliği) ve
   `/havza-riski/` (bileşik risk puanı, K1) — **ikisi de şerhsiz.**

**Neden karar sınıfı.** Hukuki metin — kara liste, [SERDAR-HUKUK].
**Tavsiye:** şerh önceliği "hukuki sonuç doğurabilecek çıktı üreten
sayfa" ölçütüne göre yeniden dizilsin; `/durumum/` (43), rehberler (11)
ve iki araç sayfası önce gelsin. **ETKİ: YÜKSEK.**

## K10 · Yayımlanmış rehberde çözülmemiş iç QA notu · [SERDAR-HUKUK]
`/rehberler/kaynak-suyu-kiralama/` içinde ziyaretçiye açık: *"(Bu karar
ilk üretimde 2020/1104 E., 2023/4576 K. olarak künyelenmişti; çelişki
doğrulanacaktır.)"* Bir Danıştay künyesinin doğruluğu yayında askıda.
**ETKİ: Orta-yüksek.**

## K12 · `/havza-riski/` "6 gösterge" diyor, gösterge 5
Sayfa, meta açıklama ve JSON-LD üç yerde "6 gösterge" diyor; formülde 5
ağırlık var, sayfa 5 kart listeliyor, kodun 6. maddesi boş yorum.
**Tavsiye: K1 ile birlikte** — K1'in çözümü gösterge sayısını zaten
değiştirir; ayrı düzeltmek metni iki kez değiştirmek olur.

## K13 · Bileşik puan "bilimsel gösterge" deniyor, yöntem künyesi yok
`/havza-riski/`. **Tavsiye:** "suharitasi.com'un kendi bileşik
göstergesidir; resmî bir sınıflandırma değildir" künyesi. K1/K12 turunda.

## K16 · Öz-cevap kırpması tarihin ve kanun atfının ortasından kesiyor
Bir persona sayfasının öz-cevabı "Son başvuru: 27" ile bitiyor (JSON-LD'ye
de böyle girmiş); `llms.txt`'te bir satır "…il özel idaresince **(167
s.K.**" ile kesiliyor. Kök neden: `Sayfa.astro` `metaAciklama` kırpımı
cümle sınırına bakıyor, parantez/tarih bütünlüğüne bakmıyor.
**Neden karar sınıfı.** Meta description JSON-LD `description` alanına da
gidiyor.

## K21 · Türetilmiş veri künyesi eksikleri (küçük)
MTA künye bloğunda il ataması yönteminin şerhi basılmıyor ·
`/durumum/` indeksi türetilmiş son-başvuru tarihini dayanaksız basıyor
(persona sayfasındaki dayanak cümlesi indekse taşınmamış).

## K22 · Güncellik damgası boşlukları
10 indekslenen sayfada görünür damga yok (hakkinda, hangi-kurum,
havzalar, havza-riski, kuyu-ruhsati, rehberler, su-kanunu, vaka, harita,
ana sayfa); `hangi-kurum`'da şemada `dateModified` var görünür `<time>`
yok; `ilce-sorgu` + `ilimde-kim-yetkili`'de tersi. 8'inde `SayfaBasi`
deseni ve tarih verisi hazır, yalnız `tarih` prop'u geçirilmiyor.

## K24 · `kullanilanlar.astro:57` "Astro 5" diyor, kurulu sürüm 7.2.7
Şeffaflık sayfasında yanlış olgu.

---

# 3. İÇERİK VE YAPI KARARLARI

## K11 · Latin-dışı alfabeyle başlıklanan 6 sayfa, 3'ünde URL de yer tutucu
`/goller/gol-1/` "گل ناور" · `/nehirler/nehir-1/` "Велека" ·
`/nehirler/nehir-2/` "نهر عفرين" · `/nehirler/mutludere/` "Резовска река
- Mutludere" · `/nehirler/meric/` "Έβρος/Meriç/Марица" ·
`/nehirler/aras-2/` "Aras / Արաքս". Altısı da sitemap'te. İlk üçünde slug
latin karakter üretemediği için sıra numarasına düşmüş.
**Neden karar sınıfı.** Görünür içerik + URL değişimi (yönlendirme
gerektirir); ayrıca 24.08'de bu ailede bilinçli temizlik yapılmıştı
(KARARLAR §25) — adların kasten bırakılmış olma ihtimali var.
**Seçenekler.** Türkçe ad ver · sayfayı yayından çıkar · slug'ı düzelt +
301. **ETKİ: Orta.**

## K14 · `hangi-kurum` build tarihi basıyor — KARARLAR §27/K3 ile çelişiyor
`src/pages/hangi-kurum/index.astro:55` `new Date()` ile "Sayfa derlemesi:
27 Ağustos 2026". §27 (25.08) build-zamanı damgayı adıyla reddetmişti.
Satır dürüstçe etiketli ve gerçek veri tarihinin yanında duruyor.
**Karar:** iki kayıttan hangisi geçerli.

## K15 · Ölü/eskimiş içerik ifadeleri
`/havzalar/` öz-cevabı "adım adım doluyor" diyor — 25/25 havza yayında ·
`/vaka/` bölümü tek vakalık, "Yeni vakalar eklenecektir."

## K17 · Cevap-önce ilkesi giriş kapılarında uygulanmamış
Ana sayfa H1 bir soru ama ilk cümle onu cevaplamıyor (aynı cümle
`llms.txt`'in tek üst-özeti) · iki Su Kanunu sayfası ve
`/ilimde-kim-yetkili/` "Güncelleme: 14 Temmuz 2026" ile açılıyor
(alıntılanabilirlik 0,50/5) · 6 hub sayfasında öz-cevap bloğu yok
(0,00/5); sitenin geri kalanı 4,00–5,00 bandında.
**NOT:** Ana sayfa öz-cevap muafiyeti KARARLAR §8'de kayıtlı; bu kalem o
muafiyeti tartışmıyor, yalnız H1↔ilk cümle ilişkisini ölçüyor.

## K18 · 81 il sayfasında ~560 görünür soru-cevap çifti var, FAQPage yok
(+147 havza, +31 rehber). **Tavsiye:** K5/K6'dan sonra tek turda.

## K19 · Otorite bağı 402/523 sayfada yok
42 `durumum` sayfası "Su Verimliliği Yönetmeliği Ek-2" deyip
mevzuat.gov.tr bağı vermiyor; 342 göl/nehir "kaynak: OpenStreetMap"
yazıp link vermiyor.

## K20 · `llms.txt` bölümlemesi: 351 sayfa "Diğer sayfalar" altında
`BOLUM` dizisinde ölü `arac/` öneki var (rota 28.07'de öldü — çıkarılması
llms.txt çıktısını hiç değiştirmiyor, eşleşen sayfa 0 ölçüldü);
`goller/` ve `nehirler/` önekleri yok → 342 sayfa AI istemcilerine
kategorisiz gidiyor. Yayın zinciri dosyası olduğu için KARAR'da tutuldu.

## K23 · Skip-link ("içeriğe atla") sitede hiç yok
523 sayfanın tamamı; WCAG 2.4.1 (A). Axe varsayılan setinde
best-practice olduğu için md15'in 100/100'ü bunu yakalamıyor.
**Neden karar sınıfı.** Odaklanınca görünür öğe → görsel kimlik.

---

# 4. KOD, DOSYA VE ALTYAPI KARARLARI

## K25 · `server/` 67 MB yetim dizin
İçinde yalnız `node_modules` (192 paket), **git izli dosya 0**.
**Neden karar sınıfı.** Git'te olmadığı için silme **geri alınamaz** —
Faz 2'de silinen varlıkların aksine.

## K26 · `goller`/`nehirler` şablonlarında 65/66 satır birebir CSS kopyası
`goller/[slug].astro:108` ↔ `nehirler/[slug].astro:102`. Tekilleştirme
Astro scoped `<style>`'ı paylaşılan CSS'e taşımayı gerektirir (scope
kaybı riski); kapsam 342 yayınlanmış sayfa, kazanç yalnız bakım kolaylığı.

## K27 · `src/data/anasayfa-sorular.js` bayat veri seti
Canlı ana sayfa `SORULAR_V2` (6 soru) kullanıyor; bu dosya `SORULAR`
(7 soru, farklı metinler) taşıyor. Tek tüketici
`arac/anasayfa-asama2-denetim.mjs:15` — cron'da yok, sağlık çağırmıyor.
Yani uykuda bir araç, bayat veriyi denetliyor.

## K28 · Diğer erişilemez kod ve dosyalar
`src/scripts/scrub-engine.js` (CSP `blob:` direktifi kararına zincirli;
`arac/site-saglik.mjs:1755-1757` bunu açıkça "ayrı karar" ilan etmiş) ·
`src/components/HedefSahne.astro` + `src/data/hedef-lqip.txt` (tek
tüketici arşiv sayfası) · `src/data/menu.ts`, `src/data/ruhsat-risk.js`,
`src/assets/arslan-logo.svg` (repo genelinde 0 referans).

## K30 · `#7fd0ef` odak halkası DESIGN.md §9 ile uyumsuz
3 yerde (`PaylasilanMenu.astro:130`, `anasayfa-v2.css:808`,
`index.astro:142`); §9 "koyu dünyada focus köpük" diyor — bu renk ne
köpük (`#DBEAF4`) ne ışıma (`#57BAE0`). Muhtemelen kontrast için
seçilmiş; hangisinin kazanacağı görsel kimlik kararı.

## K31 · Sözlük dışı easing 14 satır / 6 dosya
En genişi `AltBilgi.astro:138` `color 0.2s ease` (site geneli footer);
`public/s/imlec.js:46,53` taşmalı yay eğrileri (`0.34,1.56` / `0.34,1.8`)
"su aniden fırlamaz" ilkesiyle çelişiyor. Ayrıca `hareket.css:6-7`'deki
istisna beyanı "landing hero + /deneyim/" diyor ama `anasayfa-v2.css`
tüm ana sayfayı kapsıyor — istisnanın yazılı kapsamı ile fiilî kapsam
ayrışık.

## K32 · Tipografi ölçeği ve breakpoint tokensiz
53 sabit font-size + 14 clamp = 60+ değer; yakın-mükerrer kümeler
(0.92–0.98 arası 7 komşu değer, 1.02–1.18 arası 10). 20 farklı
breakpoint; `860 vs 859`, `639 vs 640`, `559 vs 560` karışık. DESIGN.md
sayısal ölçek tanımlamıyor, `--fs-*` tokenı yok.

## K33 · DESIGN.md §2 "Landing İstisnası" tablosu bayat
Tablo eski hero `:root`'unu listeliyor; bugünkü landing v0 paletini
kullanıyor. Tablodaki değerler artık yalnız `harita.astro:174-177`'de
yaşıyor — istisnanın adresi landing'den harita adasına kaymış.

## K34 · Palet dışı renkler (token karşılığı yok)
`#C2D6E4`, `#F6EDDE`, `#e0e0e0`, `#D3E2ED`, `#dcecf5`, `#93AFC4`,
`#12293a`; ayrıca `rgba(72,98,122,…)` = **eski** `--murekkep-500`
türevleri (M15'te taban koyulaştı, türevler eski değerde kaldı, 5 konum).

## K35 · Sızıntı sınıfı iki küçük kalem
`TELEGRAM_CHAT_ID` 4 belgede düz metin (token'sız kullanılamaz ama kanal
kimliğini ifşa eder) · kişisel e-posta 3 araç betiğinde kibar-scraping
User-Agent'ı olarak (dist'te **yok**).

## K36 · CSP `unsafe-inline` ve eksik `form-action`
`script-src` ve `style-src`'de `unsafe-inline` — Astro'nun sayfa-içi
`<style>` / `<script type="module">` üretimi buna dayanıyor; nonce/hash'e
geçiş build mimarisi kararı. `form-action` direktifi yok (CSP3'te
default-src'den türemez); tek form `mailto:` olduğu için pratik etkisi
yok.


## K37 · GERİ ÇEKİLDİ — ana sayfa performans bulgusu ÖLÇÜM ARACIMIN KUSURUYDU

**Bu kalem karar değildir; kayda dürüstlük için bırakıldı.**

İlk ölçümde ana sayfa mobil performansı **81** (LCP 4325 ms) çıkmış ve
"sitenin en yavaş şablonu" diye bulgu açılmıştı. md9 sağlık kalemi aynı
gün aynı sayfayı **94** ölçünce fark araştırıldı.

**Kök neden bulundu:** benim ölçüm betiğim **tek bir Chrome örneğini tüm
turlarda paylaşıyordu**. `arac/site-saglik.mjs:1117` bunu açıkça yasaklıyor:
*"PARALEL YASAK: her ölçüm kendi tarayıcısını açar ve kapatır."*

**Projenin kendi protokolüyle (her tur için yeni tarayıcı) yeniden ölçüm:**
```
tur 1: perf 94 · LCP 2478 ms
tur 2: perf 90 · LCP 2932 ms
tur 3: perf 81 · LCP 3679 ms
MEDYAN: perf 90 · LCP 2932 ms
```
Yani ana sayfa diğer şablonlarla **aynı bantta** (2681-2932 ms). Bulgu
yok. **SINIF: REDDEDİLDİ (ölçüm aracı kusuru).**

Performans denetimi md9'a devredildi: md9 doğru protokolü kullanıyor ve
27.08 koşumunda 14 sayfanın **14'ü de eşiği geçti**
(`/ 100/94 · /harita/ 93/75 · /havzalar/sakarya/ 100/93 · …`).

## K38 · 158 `http://hdl.handle.net` bağlantısı (düşük öncelik)

**Ne bulundu.** Akademik künye bağlantılarının 158'i `http://`;
https karşılıkları sınandı, **3/3 HTTP 200**. Görünür bağlantı metni
"yayın" (URL değil), JSON-LD'de geçmiyor.
**Neden karar sınıfı.** Kaynak, kayıtlı köken verisi
(`veri/potansiyel/akademik-kunye.json` + `zenginlestirme.json`; toplam
269 `http://` URL) ya da 4 ayrı render satırı
(`IlPotansiyel.astro:81,102,147,163`). Köken verisini düzenlemek ya da
4 render noktasına normalleştirici koymak, marjinal kazanç için
(handle.net zaten https'e yönlendiriyor) orantısız görüldü.
**Tavsiye:** düşük öncelik; başka bir veri turunda birlikte yapılsın.

---

# 5. HUKUKİ YÜZEY — yalnız tespit (K29)

Bu bölümde hiçbir şey yazılmadı, düzeltilmedi; brief gereği yalnız
durum tespiti.

- **KVKK / aydınlatma / gizlilik / çerez metni sitede YOK.** 523 sayfada
  arandı; sitemap'te 0; footer'da link yok. Tek kelime eşleşmesi
  `/vaka/meysu/`'daki "Kamuyu Aydınlatma Platformu" (alakasız).
  Bağlamsal olgu (yorumsuz): sitede çerez yok, tek form `mailto:` ile
  çalışıyor — sunucuya kişisel veri gönderen uç yok.
- **Künye — ne var:** içerik sorumlusu adı ve sıfatı ("Hukuki içerik:
  Av. Serdar Arslan — Arslan Hukuk Bürosu"), `bilgi@suharitasi.com`,
  büro sitesi linki, yöntem/kaynak politikası, güncelleme taahhüdü ve
  sorumluluk sınırı cümlesi ("bilgilendirme amaçlıdır; hukuki görüş veya
  tavsiye niteliği taşımaz").
  **Ne yok:** fiziki adres, telefon, ticaret unvanı, baro sicili,
  yer/içerik sağlayıcı beyanı.
- **Analitik belirsizliği KAPATILAMADI.** Cloudflare beacon'ı bu
  sunucudan yapılan ölçümde ne dist'te ne canlıda görünüyor — **ama bu
  kanıt değildir:** projenin kendi 29.07 kaydı aynı ölçümü yapmış ve
  dersini yazmış (*"tek vantaj noktasından negatif ölçüm, CDN'in istek
  başına değişen davranışında kanıt DEĞİLDİR"*). Fiilî durum ancak
  Cloudflare panelinden ya da Web Analytics API'sinden doğrulanabilir.
  Çerez/analitik bildirimi sorusu bu yüzden açık kaldı.
- **Yönlendirici dil envanteri (yorumsuz).** "yapmalısınız" → 42 sayfa,
  hepsi `durumum/*` şablonunun tek cümlesi ("İlk adımda ne
  yapmalısınız?" + 3 genel adım + "Somut usul/süre için ilgili mevzuat
  esastır"). "başvurmalısınız / hakkınız var / dava açın / itiraz edin /
  dava alırız / danışın / öneririz / tavsiye ederiz" → **0**.
  Sınır vakaları: `durumum/*` CTA "Uyum planlaması için iletişim …
  ulaşın" · ana sayfa formu "Ön görüşme talebi" · menüde "İletişim /
  Uzman Görüşü" · footer "Arslan Hukuk Bürosu güvencesiyle".
