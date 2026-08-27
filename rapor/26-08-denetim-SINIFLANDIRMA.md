# DENETİM — FAZ 1.5 SINIFLANDIRMA (tek liste)

27.08.2026 · Tüm boyutların bulguları tek listede, sınıf + gerekçe + etki ile.
Kaynak raporlar: `26-08-denetim-DURUM.md` (EK-A) · `26-08-denetim-15a-uydurma.md` ·
`26-08-denetim-15be-dil.md` · `26-08-denetim-18-geo.md` · `26-08-denetim-dogrulama.md`.

## SINIFLANDIRMA KURALI (bu denetimde bağlayıcı olan)

Brief 2b: **"Görünür metin ve JSON-LD BİT-EŞİT kalmalı. Bit-eşit değilse:
o onarım UYGULAMA sınıfı değilmiş demektir."**

Bu kural bu denetimde belirleyici oldu. Sonucu açıkça yazıyorum:
- Yayınlanan **görünür metni** değiştiren hiçbir onarım UYGULAMA olamadı —
  kusur besbelli olsa, düzeltme mekanik olsa, anlam hiç değişmese bile.
- Yayınlanan **JSON-LD'yi** değiştiren hiçbir onarım UYGULAMA olamadı —
  şema alanı eklemek görünür metni hiç değiştirmese bile.
- "Şüphede KARAR" kuralı, sınırdaki her kalemde KARAR yönünde kullanıldı.

Bunun pratik sonucu: **KARAR listesi uzun, UYGULAMA listesi kısa.** Bu bir
eksiklik değil, kuralın kendisidir. KARAR kalemlerinin çoğu "onayla, 10
dakikada uygulanır" cinsindendir; birkaçı gerçekten ağır karar ister.

---

# A. UYGULAMA SINIFI (Faz 2'de uygulandı)

Ortak koşul: hepsinde görünür metin **ve** JSON-LD bit-eşit kalır.

| # | Bulgu | Nerede | Neden UYGULAMA | Etki |
|---|---|---|---|---|
| U1 | 12,6 MB referanssız yayın varlığı | `public/deneyim/video/*.webm` (9,0 MB) · `public/hedef-hero.webp` (992 KB) · `public/hedef/*` (1,7 MB) · `public/s/su-sim.js` | Referanssızlık **kesin kanıtlandı** (D1: dist'in her metin dosyası + src + config; dinamik uzantı üretimi falsifiye edildi). Hiçbir HTML/JSON-LD baytı değişmez. Dördü de git izli → silme geri alınabilir, "geri alınamaz adım" istisnasına girmez | **Yüksek** — dist'in %28'i; her deploy, yedek ve senkron bunu taşıyor |
| U2 | `esbuild` hayalet bağımlılık | `astro.config.mjs:186` import ediyor, `package.json`'da yok | Yalnız `package.json`; dist hiç değişmez | Orta — vite esbuild'i bırakırsa küçültme kancası + deploy kırılır |
| U3 | KAYNAKLAR.md'de kaydı olmayan 3 iklim/uydu katmanı | CHIRPS · JRC Global Surface Water · ERA5-Land | Künyeler dosyaların içinde **zaten yazılı** (birebir aktarım, uydurma yok); sitede yayınlanmıyorlar (D6) → görünür atıf gerekmiyor. Yalnız repo belgesi değişir | Orta — ikisi CC BY 4.0; bugün yükümlülük doğmuyor ama tek köken kaydı eksik |
| U4 | KAYNAKLAR.md'de eksik dosya/arşiv kayıtları | `data/arsiv/dsi-yas/` (15 xlsx, 2019+2024 setleri) · `veri/potansiyel/zenginlestirme.json` + `ilce-morfoloji.json` · `data/kamu/` (5 dosya) · `data/lead/` (2 dosya) | Aynı gerekçe: veri depoda, künye kendi dosyasında; yalnız merkezi kayıt tamamlanıyor | Orta |
| U5 | KAYNAKLAR.md'de bayat 2 kayıt | `:41` `harita/isaretler.js` yolu ölü (gerçek yer `src/harita-3d/isaretler.js`) · `:285` EPİAŞ "İlk kayıt: henüz yok" (gerçek: `kayitBaslangici 2026-07-16`, arşivde 925 dosya) | Ölçülen değerle düzeltme; dist değişmez | Orta — şerh yanlış dosyayı işaret ediyor |
| U6 | Fantom token `--kehribar-600` | `ilce-sorgu.astro:191` · `havza-riski.astro:110` | Fallback `#875518` = `--kehribar-metin` değeriyle **aynı**, token her iki sayfada tanımlı (D3) → render bit-eşit | Orta — token adı yalan söylüyor, gerçek kaynak fallback |
| U7 | Ana sayfada `<main>` landmark'ı yok | `src/pages/index.astro` (518 sayfada var, ana sayfada yok) | Görünmez semantik; görünür metin ve JSON-LD değişmez. Risk taraması: `body` flex/grid değil, kardeş seçici yok (D7) | Orta — sitenin en çok ziyaret edilen sayfası şablonlarla tutarsız (WCAG 1.3.1) |

**UYGULANMASI DÜŞÜNÜLÜP VAZGEÇİLENLER** (Faz 2'de ölçülüp geri çekilenler
ya da riski kanıtlanamayanlar) aşağıda B/C listelerinde gerekçesiyle yer alıyor.

---

# B. KARAR SINIFI — ÖNCE ONAYLANMASI ÖNERİLENLER

Bunlar mekanik düzeltmelerdir; **anlamı değiştirmezler**, yalnız görünür
çıktıyı ya da JSON-LD'yi değiştirdikleri için 2b gereği KARAR sınıfına
düştüler. Onay verilirse hepsi tek turda uygulanabilir.

### K1. `/havza-riski/` puanının %40'ı her havzada sabit — ve iki kod hatası
**Ne bulundu.** Bileşik risk puanının "Baraj Doluluk (%25)" bileşeni
25/25 havzada sabit 0,5; "Tahsis Durumu (%15)" de 25/25 havzada sabit 0,5.
İlki iki ayrı kod hatasından:
1. `src/data/havza-risk.js:42` → `baraj.havzalar["Gediz Havzası"]` arıyor,
   `baraj.json` anahtarı `"Gediz"`. Eşleşme **0/25**.
   (Aynı işi `src/data/il-profil.js:34-35` doğru yapıyor ve nedenini
   yorumda yazıyor: "EPİAŞ havza adı çıplaktır ('Sakarya'); site başlığı
   'Sakarya Havzası'" — emsal kodda mevcut.)
2. `havza-risk.js:54` → `b.doluluk` okuyor; gerçek yapı `b.seri[tarih].doluluk`.
   Baraj kaydının alanları ölçüldü: `['seri']`.
İkincisi veri boşluğundan: `data/havza-veri.json`'da `tahsis` **25/25 null**.

**Ölçüm kanıtı.**
```
$ grep -o "baraj doluluk etkisi: [0-9]*/100" dist/havza-riski/index.html | sort | uniq -c
     25 baraj doluluk etkisi: 50/100
```
Sayfanın kendi iddiası: *"25 su havzası için 6 göstergeden (GRACE uydu
verisi, baraj doluluk, YAS rezervi, tahsis durumu, yüzey suyu potansiyeli)
hesaplanan bileşik su riski"*. Yayın yüzeyi: sitemap'te · indekslenebilir ·
`llms.txt`'te · **521 sayfadan iç link**.
Aynı veri için `/havzalar/gediz/` dürüstçe *"veri yok (14.07.2026) — havza
bazlı açık tahsis verisi kamuya yayımlanmıyor"* diyor; risk sayfasında aynı
boşluk sessizce 50 puana dönüşüyor.

**Neden karar sınıfı.** Onarım yayımlanan tüm risk puanlarını, sıralamayı
ve JSON-LD `Observation` şemasını değiştirir.

**Seçenekler.**
- (a) İki kod hatasını düzelt, tahsis bileşenini "veri yok" olarak
  işaretleyip ağırlığı kalan göstergelere dağıt → puanlar ve sıralama
  değişir, gösterge sayısı dürüstleşir.
- (b) Baraj hatasını düzelt, tahsisi bileşenden çıkar → "5 gösterge" olur.
- (c) Yalnız metni düzelt ("bu iki bileşende veri yok" şerhi), puanı
  olduğu gibi bırak → sayı değişmez ama puan yine %40 sabit kalır.

**Tavsiye: (a).** Gerekçe: sitenin `/hakkinda/` sayfasındaki kendi
taahhüdü *"Doğrulanamayan hiçbir veri doğrulanmış gibi gösterilmez…
tahmin veya ara değer üretilmez"* — (c) bu taahhüdü karşılamaz, çünkü
sabit 0,5 bir ara değerdir ve puana girmeye devam eder.
**ETKİ: YÜKSEK** (denetimin en ağır bulgusu).

### K2. 519 sayfada boşluk yutması: "Av. Serdar Arslan —Arslan Hukuk Bürosu"
**Ne bulundu.** Kaynakta metin ile satır-içi etiket alt alta yazıldığında
aradaki satır sonu derlemede yutuluyor; kelimeler yapışıyor.
Kök neden 11 kaynak dosyada izlendi; en genişi `AltBilgi.astro:63-64`
(site geneli alt bilgi, **519 sayfa**).

**Ölçüm kanıtı** (dist ham çıktı, birebir):
```
<p class="alt-metin">Hukuki içerik: Av. Serdar Arslan —<a href="https://arslanhukuk.tr" …>Arslan Hukuk Bürosu
$ grep -rlc 'Arslan —<a' dist --include="*.html" | wc -l   →  519
```
`/hakkinda/` görünür metninde üç yapışma bir arada:
*"…mevzuat analizleriAv. Serdar Arslan (Arslan Hukuk Bürosu)tarafından
hazırlanmaktadır."* · *"…derlenir — başlıcaDSİ Resmî Su Kaynakları
İstatistiklerive Tarım ve Orman Bakanlığı…"*

**Neden karar sınıfı.** Düzeltme görünür metni değiştirir (boşluk ekler) →
2b gereği UYGULAMA olamaz. **Anlam değişmiyor.**
**Tavsiye: onayla ve düzelt.** Kusur sitenin künyesinde, yani güven
sinyalinin tam ortasında duruyor. **ETKİ: YÜKSEK** (519 sayfa).

### K3. 76 sayfada kardeş il bağlantıları etiketsiz ("→ →")
**Ne bulundu.** `src/pages/kuyu-ruhsati/[il].astro:201` `{x.ad}` okuyor;
`src/data/il-profil.js:105` nesnesinde alan adı **`il`**, `ad` yok.
"Aynı DSİ bölgesindeki diğer iller hangileri?" sorusunun cevabı boş çıkıyor.

**Ölçüm kanıtı** (dist, birebir):
```
<nav class="capraz" aria-label="Aynı DSİ bölgesindeki iller">
  <a href="/kuyu-ruhsati/hatay/">&rarr; </a><a href="/kuyu-ruhsati/mersin/">&rarr; </a>…
$ grep -rl 'aria-label="Aynı DSİ bölgesindeki iller"' dist | wc -l  →  76
```
Aynı dosyanın `:213` satırı (`g.ad`, göller) doğru çalışıyor — kusur tek
sözcüklük. Üç ayrı zarar: H2 cevapsız · bağlantı metni anlamsız
(WCAG 2.4.4 bağlantı amacı) · il↔il iç bağlantı ağı değersiz.

**Neden karar sınıfı.** Düzeltme 76 sayfada görünür metin ekler.
**Tavsiye: onayla ve düzelt** (tek sözcük: `x.ad` → `x.il`).
**ETKİ: YÜKSEK.**

### K4. Ölü B2B palet bloğu her sayfaya gönderiliyor
**Ne bulundu.** `src/layouts/Sayfa.astro:217-241` — 16 renk + 3 gradyan +
2 gölge + 2 radius tokenı, 04.08.2026 tarihli "B2B MODERN PALET".
`var(--b2b-…)` kullanımı repo genelinde (arşiv + araçlar dahil) **sıfır**,
ama blok `dist/_astro/SayfaBasi.css` ile yayına çıkıyor.
Kimlik: 04.08 satış/B2B dalgasının kalıntısı; o dalga KARARLAR §25 ile
kaldırılmış, palet gözden kaçmış. DESIGN.md bu aileyi hiç tanımıyor;
içinde `#1565C0` (materyal mavisi), `#C62828`, `#E65100` gibi palet dışı
değerler var.

**Neden karar sınıfı.** Brief'in bu kalem için koyduğu UYGULAMA koşulu
iki şarttı: (i) seçici kullanılmıyor — **sağlandı**; (ii) üretilen CSS
bit-eşit kalıyor — **sağlanmadı** (blok CSS'e basılıyor, silinince dosya
küçülür). Teknik not: hiçbir kural bu değişkenlere başvurmadığı için
render'ın değişmesi mümkün değildir; ölçüt bu vaka için dar kalıyor.
**Tavsiye: silinsin.** **ETKİ: Orta-yüksek.**

### K5. Yazar kimliği ikiye bölünmüş, `url`'leri çelişiyor
**Ne bulundu.** İki ayrı `Person` düğümü: `#yazar` (zengin: `jobTitle`,
`description`, `knowsAbout`, `worksFor`; `url` = `/hakkinda/`) ve
`hakkinda/#yazar` (`url` = `arslanhukuk.tr`). **92 Article'ın tamamı
ikinciye bağlanıyor** → zengin düğüm makalelerden kopuk, `sameAs` de boş.
**Neden karar sınıfı.** JSON-LD değişir (2b).
**Tavsiye: tek `@id` altında birleştir.** **ETKİ: Orta-yüksek** (E-E-A-T
kimlik sinyalinin tamamı buradan geçiyor).

### K6. `Observation` şemasında ölçüm değeri yanlış alanda
**Ne bulundu.** `/havza-riski/` 25 Observation kaydında sayısal değer
`measuredProperty.value` içinde; `Observation.value` **0/25**,
`observationDate` **0/25**. Makineye "değeri olmayan gözlem" gidiyor.
Ayrıca `includedInDataCatalog` bir DataCatalog'a değil WebSite düğümüne
işaret ediyor.
**Neden karar sınıfı.** JSON-LD değişir. **Tavsiye: alanları düzelt**
(değerler sitede zaten görünür, uydurma alan eklenmiyor).
**ETKİ: Orta** — sitenin tek özgün türetilmiş verisi bu şemayla dışarı
çıkıyor. **NOT:** K1 çözülmeden bu şemayı zenginleştirmek, sabit bileşenli
puanı daha görünür kılar; **K1'den sonra yapılmalı.**

---

# C. KARAR SINIFI — GERÇEK KARAR İSTEYENLER

### K7. `/ilce-sorgu/` veri karşılığı olmayan akifer türü, derinlik ve "olasılık" üretiyor
**Ne bulundu.** Üç ayrı katman:
- **Künye ters yönde:** ilçe morfolojisi (`ilce-morfoloji.json`) kendi
  künyesinde *"GERÇEK ilçe ölçümü DEĞİLDİR… il düzeyindeki Copernicus
  GLO-90 DEM'den ilçe ismiyle tohuma bağlı ±%15 deterministik varyasyonla
  türetilmiştir"* diyor; sayfa bunu **"Arazi Yapısı · Copernicus GLO-90
  DEM"** künyesiyle basıyor. Şerh eksik değil, **olmayan bir ölçüm kaynağı
  iddia ediliyor**. Ek olarak `ort_egim` 948/948 null olduğu için her
  ilçede "Ortalama eğim: 0,0°" yazıyor.
- **Veri karşılığı hiç olmayan çıktı:** `dMin=15+(1-duz)*65` formülünden
  "tahmini su doygunluk derinliği: X–Y metre"; eşiklerden "baskın kayaç ve
  akifer türü: Alüvyal/Karstik/Granit". Depoda ne litoloji ne derinlik
  verisi var.
- **Yöntem etiketleri dayanaksız:** "AHP" iddiası; `morfoloji.json` "twi:
  hesaplanmadı" diyorken TWI bileşen gösteriliyor; `jrc-yuzey-suyu.json`
  25/25 havzada "islenmedi"; "yağış" bileşeni CHIRPS'ten değil GRACE yön
  etiketinden geliyor (havza sayfalarının kendi şerhi "GRACE il/ilçe
  ölçeğinde kullanılamaz" diyor). Bileşik skor **"Su Çıkma Olasılığı %"**
  olarak sunuluyor — bir indeks, olasılık değil.

**Yayın yüzeyi:** sitemap'te · indekslenebilir · 521 sayfadan iç link.
Sayfada genel "TEMSİLÎDİR" şerhi var (`ilce-sorgu.astro:151`).

**Neden karar sınıfı.** Hem görünür içerik ve sayfanın vaadi değişir, hem
de bu bir maddi karar aracıdır: CLAUDE.md "Altyapıda hızlı, iddiada yavaş"
kuralı bu tür araçlar için **keşif raporu → değerlendirme oturumu →
[SERDAR-HUKUK] onayı → uygulama briefi** sırasını zorunlu kılıyor.

**Seçenekler.** (a) Veri karşılığı olmayan üç çıktıyı (akifer türü,
derinlik aralığı, "olasılık") kaldır, sayfayı ölçülen veriye indir ·
(b) Hepsini bırak, künyeyi ve yöntem şerhini dürüstleştir ("bu değerler
il verisinden türetilmiş tahmindir; ilçe ölçümü yoktur") · (c) Sayfayı
`noindex`e alıp yeniden tasarlanana kadar yayın yüzeyinden çıkar.

**Tavsiye: (a) + (b) birlikte** — türetilmiş olduğu açıkça yazılamayan
çıktı kaldırılsın, kalanın künyesi gerçek yöntemi söylesin. (c) geçici
çare olarak (a)+(b) yapılana kadar uygulanabilir.
**ETKİ: YÜKSEK** — sitenin kendi beyanıyla en açık çelişki burada.

### K8. Ceza rehberi 2008 nominal tutarlarını güncel gibi bırakıyor
**Ne bulundu.** `/rehberler/ruhsatsiz-kuyu-cezalari/` öz-cevabı ve meta
description'ı "m.18/a 1.000–5.000 TL, m.18/b 500–2.000 TL" diyor;
yeniden değerleme uyarısı dist'te **yalnız** `/rehberler/kuyu-tasima/`
sayfasında var.
**Neden karar sınıfı.** Hukuki metin + para tutarı → **[SERDAR-HUKUK]**.
**Tavsiye:** yeniden değerleme şerhinin bu sayfaya da taşınması; güncel
tutar YAZILMASIN (doğrulanmadı — 27.08.2026).
**ETKİ: YÜKSEK** (ziyaretçi maddi sonuç çıkarıyor).

### K9. "Hukuki görüş değildir" şerhi ters dizilmiş
**Ne bulundu.** Şerh 425/523 sayfada var; **10 rehber, 42 `durumum`,
25 havza, 2 su-kanunu ve vaka sayfasında YOK.** Göl yüzey alanı bildiren
sayfa şerhli; idari para cezası tutarı ve son başvuru tarihi bildiren
sayfa şerhsiz.
**Neden karar sınıfı.** Hukuki metin → **[SERDAR-HUKUK]**.
**ETKİ: YÜKSEK.**

### K10. Yayımlanmış rehberde çözülmemiş iç QA notu
**Ne bulundu.** `/rehberler/kaynak-suyu-kiralama/` içinde ziyaretçiye açık:
*"(Bu karar ilk üretimde 2020/1104 E., 2023/4576 K. olarak künyelenmişti;
çelişki doğrulanacaktır.)"* — bir Danıştay künyesinin doğruluğu yayında askıda.
**Neden karar sınıfı.** Hukuki metin + künye doğrulaması → [SERDAR-HUKUK].
**ETKİ: Orta-yüksek** (güven sinyali).

### K11. Latin-dışı alfabeyle başlıklanan 6 sayfa, 3'ünde URL de yer tutucu
**Ne bulundu.** `/goller/gol-1/` "گل ناور" · `/nehirler/nehir-1/` "Велека" ·
`/nehirler/nehir-2/` "نهر عفرين" · `/nehirler/mutludere/` "Резовска река -
Mutludere" · `/nehirler/meric/` "Έβρος/Meriç/Марица" · `/nehirler/aras-2/`
"Aras / Արաքս". Altısı da sitemap'te. İlk üçünde slug latin karakter
üretemediği için sıra numarasına düşmüş.
**Neden karar sınıfı.** Görünür içerik + URL değişimi (yönlendirme
gerektirir); ayrıca 24.08'de bu ailede bilinçli temizlik yapılmıştı
(KARARLAR §25) — adların kasten bırakılmış olma ihtimali var.
**ETKİ: Orta.**

### K12. `/havza-riski/` "6 gösterge" diyor, gösterge 5
**Ne bulundu.** Sayfa, meta açıklama ve JSON-LD üç yerde "6 gösterge"
diyor; formülde 5 ağırlık var, sayfa 5 kart listeliyor, kodun 6. maddesi
boş yorum. **Neden karar sınıfı.** Görünür metin + JSON-LD.
**Tavsiye: K1 ile birlikte ele alınsın** (K1'in çözümü gösterge sayısını
zaten değiştirir; ikisini ayrı ayrı düzeltmek iki kez metin değiştirmek olur).

### K13. Bileşik puan "bilimsel gösterge" deniyor, yöntem künyesi yok
`/havza-riski/`. **Tavsiye:** "suharitasi.com'un kendi bileşik göstergesidir,
resmî bir sınıflandırma değildir" künyesi. K1/K12 ile aynı turda.

### K14. `hangi-kurum` build tarihi basıyor — KARARLAR §27/K3 ile çelişiyor
`src/pages/hangi-kurum/index.astro:55` `new Date()` ile "Sayfa derlemesi:
27 Ağustos 2026". §27 (25.08) build-zamanı damgayı adıyla reddetmişti.
Satır dürüstçe etiketli ve gerçek veri tarihinin yanında duruyor.
**Karar:** iki kayıttan hangisi geçerli.

### K15. Ölü/eskimiş içerik ifadeleri
- `/havzalar/` öz-cevabı "adım adım doluyor" diyor — 25/25 havza yayında.
- `/vaka/` bölümü tek vakalık; "Yeni vakalar eklenecektir."
**Neden karar sınıfı.** Görünür içerik, anlam değişiyor.

### K16. Öz-cevap kırpması tarihin ortasından kesiyor
Bir persona sayfasının öz-cevabı "Son başvuru: 27" ile bitiyor; JSON-LD'ye
de böyle girmiş. Aynı kırpma `llms.txt`'te bir kanun atfını yarıda kesiyor:
"…il özel idaresince **(167 s.K.**". Kök neden: `Sayfa.astro` `metaAciklama`
kırpımı cümle sınırına bakıyor, parantez/tarih bütünlüğüne bakmıyor.
**Neden karar sınıfı.** Meta description JSON-LD `description` alanına da
gidiyor → 2b.

### K17. Cevap-önce ilkesi giriş kapılarında uygulanmamış
- Ana sayfa H1 bir soru ("Kuyunuz için ruhsat mı lazım, ceza mı geldi?")
  ama ilk cümle onu cevaplamıyor; aynı cümle `llms.txt`'in tek üst-özeti.
- İki Su Kanunu sayfası ve `/ilimde-kim-yetkili/` "Güncelleme: 14 Temmuz
  2026" ile açılıyor (alıntılanabilirlik 0,50/5).
- 6 hub sayfasında öz-cevap bloğu hiç yok (0,00/5); sitenin geri kalanı
  4,00–5,00 bandında.
**Neden karar sınıfı.** Görünür metin + içerik stratejisi.
**NOT:** Ana sayfa öz-cevap muafiyeti KARARLAR §8'de kayıtlı — bu kalem o
muafiyeti tartışmaya açmıyor, yalnız H1↔ilk cümle ilişkisini ölçüyor.

### K18. 81 il sayfasında ~560 görünür soru-cevap çifti var, FAQPage yok
(+147 havza, +31 rehber). **Neden karar sınıfı.** JSON-LD değişir; ayrıca
FAQ şeması eklemek görünür içeriğin şema karşılığını genişletir.
**Tavsiye:** K5/K6'dan sonra, tek turda.

### K19. Otorite bağı 402/523 sayfada yok
42 `durumum` sayfası "Su Verimliliği Yönetmeliği Ek-2" diyip
mevzuat.gov.tr bağı vermiyor; 342 göl/nehir "kaynak: OpenStreetMap" yazıp
link vermiyor. **Neden karar sınıfı.** Görünür bağlantı eklemek = içerik
değişikliği.

### K20. `llms.txt` bölümlemesi: 351 sayfa "Diğer sayfalar" altında
`BOLUM` dizisinde ölü `arac/` öneki var (rota 28.07'de öldü); `goller/` ve
`nehirler/` önekleri yok → 342 göl/nehir sayfası AI istemcilerine
kategorisiz gidiyor.
**İkiye ayrıldı:** ölü `arac/` girdisinin çıkarılması llms.txt çıktısını
**hiç değiştirmiyor** (eşleşen sayfa 0 — ölçüldü) ama yayın zinciri
dosyası olduğu için yine de KARAR'da tutuldu; `goller/`+`nehirler/`
eklenmesi çıktıyı değiştirir → KARAR.

### K21. Sentetik/türetilmiş veri künyesi eksikleri (küçük)
- MTA künye bloğunda il ataması yönteminin şerhi basılmıyor.
- `/durumum/` indeksi türetilmiş son-başvuru tarihini dayanaksız basıyor
  (persona sayfasındaki dayanak cümlesi indekse taşınmamış).
**Neden karar sınıfı.** İkisi de görünür metne şerh ekler.

### K22. Güncellik damgası boşlukları
10 indekslenen sayfada görünür damga yok (hakkinda, hangi-kurum, havzalar,
havza-riski, kuyu-ruhsati, rehberler, su-kanunu, vaka, harita, ana sayfa);
`hangi-kurum`'da şemada `dateModified` var görünür `<time>` yok;
`ilce-sorgu` + `ilimde-kim-yetkili`'de tersi.
**Neden karar sınıfı.** Damga eklemek görünür metin ekler (2b).
Taban ölçümü (509 görünür / 508 şema) birebir doğrulandı.

### K23. Skip-link ("içeriğe atla") sitede hiç yok
523 sayfanın tamamı; WCAG 2.4.1 (A seviyesi). Axe varsayılan setinde
best-practice olduğu için md15'in 100/100'ü bunu yakalamıyor.
**Neden karar sınıfı.** Odaklanınca görünür öğe → görsel kimlik.

### K24. `kullanilanlar.astro:57` "Astro 5" diyor, kurulu sürüm 7.2.7
**Neden karar sınıfı.** Görünür içerik; şeffaflık sayfasında yanlış olgu.

### K25. `server/` 67 MB yetim dizin
İçinde yalnız `node_modules` (192 paket), git izli dosya **0**.
**Neden karar sınıfı.** Git'te olmadığı için silme **geri alınamaz** —
U1'deki varlıkların aksine.

### K26. `goller`/`nehirler` şablonlarında 65/66 satır birebir CSS kopyası
`goller/[slug].astro:108` ↔ `nehirler/[slug].astro:102`.
**Neden karar sınıfı.** Tekilleştirme Astro scoped `<style>`'ı paylaşılan
CSS'e taşımayı gerektirir (scope kaybı riski); kapsam 342 yayınlanmış
sayfa, kazanç yalnız bakım kolaylığı.

### K27. `src/data/anasayfa-sorular.js` bayat veri seti
Canlı ana sayfa `SORULAR_V2` (6 soru) kullanıyor; bu dosya `SORULAR`
(7 soru, farklı metinler) taşıyor. Tek tüketici `arac/anasayfa-asama2-
denetim.mjs:15` — cron'da yok, sağlık çağırmıyor (uykuda tarihsel araç).
**Neden karar sınıfı.** İki dosyanın akıbeti birlikte kararlaştırılmalı.

### K28. Diğer erişilemez kod ve dosyalar
`src/scripts/scrub-engine.js` (CSP `blob:` direktifi kararına zincirli —
`site-saglik.mjs:1755-1757` bunu "ayrı karar" ilan etmiş) ·
`src/components/HedefSahne.astro` + `src/data/hedef-lqip.txt` (tek tüketici
arşiv sayfası) · `src/data/menu.ts`, `src/data/ruhsat-risk.js`,
`src/assets/arslan-logo.svg` (repo genelinde 0 referans).
**Neden karar sınıfı.** Dosya silme + CSP bağı.

### K29. Hukuki yüzey (1.10 — tamamı tespit)
- **KVKK / aydınlatma / gizlilik / çerez metni sitede yok** (523 sayfada
  arandı; footer'da link yok). Bağlam: çerez yok, tek form `mailto:`.
- **Künye:** içerik sorumlusu adı+sıfatı, e-posta, büro linki, sorumluluk
  sınırı cümlesi **var**; fiziki adres, telefon, ticaret unvanı, baro
  sicili, yer/içerik sağlayıcı beyanı **yok**.
- **Analitik belirsizliği:** beacon bu sunucudan görülmüyor, ama bu
  ölçüm projenin kendi 29.07 kaydına göre **kanıt değil** (bkz. D8).
  Çerez/analitik bildirimi sorusu bu yüzden kapatılamadı.

### K30. `#7fd0ef` odak halkası DESIGN.md §9 ile uyumsuz
3 yerde (`PaylasilanMenu.astro:130`, `anasayfa-v2.css:808`,
`index.astro:142`); §9 "koyu dünyada focus köpük" diyor, bu renk ne köpük
(`#DBEAF4`) ne ışıma (`#57BAE0`). **Neden karar sınıfı.** Görsel kimlik.

### K31. Sözlük dışı easing 14 satır / 6 dosya
En genişi `AltBilgi.astro:138` `color 0.2s ease` (site geneli footer);
`public/s/imlec.js:46,53` taşmalı yay eğrileri "su aniden fırlamaz"
ilkesiyle çelişiyor. **Neden karar sınıfı.** Hareket = görsel kimlik.

### K32. Tipografi ölçeği ve breakpoint tokensiz
53 sabit font-size + 14 clamp = 60+ değer; yakın-mükerrer kümeler
(0.92–0.98 arası 7 komşu değer). 20 farklı breakpoint; `860 vs 859`,
`639 vs 640`, `559 vs 560` karışık. DESIGN.md sayısal ölçek tanımlamıyor.
**Neden karar sınıfı.** Ölçek tanımı = anayasa işi.

### K33. DESIGN.md §2 "Landing İstisnası" tablosu bayat
Tablo eski hero `:root`'unu listeliyor; bugünkü landing v0 paletini
kullanıyor, tablodaki değerler artık yalnız `harita.astro:174-177`'de
yaşıyor. **Neden karar sınıfı.** Anayasa belgesi güncellemesi.

### K34. Palet dışı renkler (token karşılığı yok)
`#C2D6E4`, `#F6EDDE`, `#e0e0e0`, `#D3E2ED`, `#dcecf5`, `#93AFC4`,
`#12293a`; ayrıca `rgba(72,98,122,…)` = **eski** `--murekkep-500` türevleri
(M15'te taban koyulaştı, türevler eski değerde kaldı, 5 konum).
**Neden karar sınıfı.** Yeni token doğurmak = palet genişletme.

### K35. Sızıntı sınıfı iki küçük kalem
`TELEGRAM_CHAT_ID` 4 belgede düz metin (token'sız kullanılamaz ama kanal
kimliğini ifşa eder) · kişisel e-posta 3 araç betiğinde kibar-scraping
User-Agent'ı olarak (dist'te yok). **Neden karar sınıfı.** Belge temizliği
tercihi.

### K36. CSP `unsafe-inline` ve eksik `form-action`
`script-src` ve `style-src`'de `unsafe-inline` (Astro'nun sayfa-içi
`<style>`/`<script type="module">` üretimi buna dayanıyor); `form-action`
direktifi yok (CSP3'te default-src'den türemez; tek form `mailto:` olduğu
için pratik etkisi yok). **Neden karar sınıfı.** nonce/hash geçişi build
mimarisi kararı.

---

# D. REDDEDİLDİ (kusur değil — gerekçeli)

| # | Bulgu iddiası | Neden reddedildi |
|---|---|---|
| R1 | "CanliSayi palet dışına düşüyor, `/nerede-su-cikar/`'da `#2b6a86` render ediliyor" | **Ölçümle çürütüldü** (D2): `--v2-*` tokenları paylaşılan `pages.dLcRBfmy.css` chunk'ında `:root` altında tanımlı ve o sayfa bu CSS'i yüklüyor → fallback'ler devreye girmiyor |
| R2 | "`harita.astro:239,255` literalleri token'a çekilsin" | **Ölçümle çürütüldü** (D3): `/harita/` sayfasında `--krem` ve `--murekkep-900` **tanımlı değil**; `var()` yazmak rengi kaybettirir |
| R3 | "Analitik yüklü değil" | Projenin kendi 29.07 kaydı bu tam ölçümü yapmış ve dersini yazmış: *"tek vantaj noktasından negatif ölçüm, CDN'in istek başına değişen davranışında kanıt DEĞİLDİR"* (D8) |
| R4 | site-tarama'nın `canonical-yok` (2), `meta-desc-yok` (1), `icerik-dom-disi` (1), `og-eksik` (3), `json-ld-yok` (3), `sitemap-disi` (3) bulguları | Hepsi **noindex** sayfalarda (`/404/`, `/stil-pilot/`, `/harita-pilot/`, `/kullanilanlar/`); noindex sayfada canonical/meta/OG gerekmez, sitemap dışı olmaları **doğru davranış** (D5) |
| R5 | site-tarama `title-uzun` (16), `oz-cevap-uzun` (12), `soru-baslik-yok` (4) | **md16 tabanında kabul edilmiş** ya da SIRADAKILER'deki [SERDAR-HUKUK] kaleminin ta kendisi — yeni bulgu değil (D5) |
| R6 | `/harita/` h1 yok | KARARLAR §9 kapanmış karar |
| R7 | `maplibre-gl` + `three` kullanılmayan bağımlılık | CLAUDE.md yol haritasında planlı iş (MapLibre 2D + Three.js hero); dist'e girmiyorlar (dist/_astro 136 KB) |
| R8 | `src/harita-3d/*` + `src/harita-2d/maplibre-main.js` erişilemez kod | Aynı gerekçe — park edilmiş kaynak, kusur değil |
| R9 | Göl sayfalarındaki "yaklaşık X km²" belirsizlik dili | OSM türetimi için **dürüst şerh**; kısılması dürüstlüğü azaltır (1.8 raporu B1-7) |
| R10 | OCR bozuk RG pasajları | 71 sayfada "dizgi hatası içerebilir" şerhi + tırnak + `<details>` kapsaması mevcut — dürüst alıntı davranışı |
| R11 | `/su-kanunu/taslak-takibi/` gelecek zaman ifadeleri | Şerhli ve hâlâ geçerli (Su Kanunu Taslağı canlı konu) |
| R12 | `f17a…txt` kök dosyası | IndexNow anahtarı — tasarımı gereği public |
| R13 | `data/orders.db*` | Operasyonel kalıntı, gitignore'lu, veri kaynağı değil |
| R14 | `guncelleme` alanı 2 içerik dosyasında yok | Şema geri-düşümü belgeli ("Yoksa damga tarih'ten basılır") — bilinçli optional |
| R15 | `/rehberler/kuyu-tasima` hem .md hem .astro | `[slug].astro:22` `.filter(g => g.id !== 'kuyu-tasima')` ile çakışma önlenmiş — bilinçli, yorumla belgeli |

---

# E. FAZ 2 SIRASINDA SINIFI DEĞİŞENLER (ölçüm sonucu)

| Kalem | İlk öneri | Son sınıf | Ölçüm gerekçesi |
|---|---|---|---|
| `public/hedef/*` (6 dosya, 1,7 MB) silme | UYGULAMA (U1'in parçası) | **KARAR** (K28'e taşındı) | Referanssızlığı kanıtlı ama tek tüketicisi `HedefSahne.astro`; bileşeni bırakıp görsellerini silmek **tutarsız bir ara durum** yaratırdı. İkisinin akıbeti birlikte kararlaştırılmalı |
| 158 `http://hdl.handle.net` → https | UYGULAMA (düşük etki) | **KARAR** (düşük öncelik) | Kaynak, kayıtlı köken verisi (`akademik-kunye.json` + `zenginlestirme.json`, toplam 269 http:// URL) ya da 4 ayrı render satırı (`IlPotansiyel.astro:81,102,147,163`). Kazanç marjinal (handle.net zaten https'e yönlendiriyor); köken verisini düzenlemek ya da 4 render noktasına normalleştirici koymak bu kazanç için orantısız |

**U1'in uygulanan kapsamı:** `sahne1..6.webm` (9,0 MB) + `hedef-hero.webp`
(992 KB, v2 ile bit-eşit kopya) + `public/s/su-sim.js` (9,3 KB) = **~10 MB**.
Kalan 1,7 MB (`public/hedef/*`) K28'de.

---

# F. FAZ 2 UYGULAMA KAYDI — önce/sonra ölçümleri

| # | Onarım | Nerede | ÖNCE | SONRA | Kanıt |
|---|---|---|---|---|---|
| U1 | Referanssız yayın varlıkları silindi | `public/deneyim/video/sahne1..6.webm` · `public/hedef-hero.webp` · `public/s/su-sim.js` | dist **45 MB** · `s/*.js` küçültme 6 dosya 12.616 B | dist **35 MB** · küçültme **5 dosya** 12.616 → 7.085 B | build log; `du -sh dist`; sayfa 522 ve sitemap 519 DEĞİŞMEDİ |
| U2 | `esbuild` devDependency olarak bildirildi | `package.json` +1 satır, `package-lock.json` +1 satır | bildirilmemiş (hayalet) | bildirilmiş | **Falsifikasyon:** izole kopyada `npm ci --dry-run` → **BAŞARILI** ("added 521 packages") — deploy hattı kırılmıyor |
| U3 | 3 iklim/uydu katmanı künyelendi | `KAYNAKLAR.md` yeni bölüm | CHIRPS/JRC/ERA5 → grep 0 | üçü de kayıtlı, **içerik durumu dürüstçe** (CHIRPS veri var; JRC+ERA5 iskele/boş — D13) | `grep -c CHIRPS KAYNAKLAR.md` 0 → var |
| U4 | Eksik dosya/arşiv kayıtları eklendi | `KAYNAKLAR.md` | `data/arsiv/dsi-yas/`, `data/kamu/` (5), `data/lead/` (2), `zenginlestirme.json`, `ilce-morfoloji.json` adlandırılmamış | hepsi kayıtlı; `ilce-morfoloji` **SENTETİK** olarak işaretli | dosya diff |
| U5 | Bayat 2 kayıt düzeltildi | `KAYNAKLAR.md:41` ve `:285` | `harita/isaretler.js` (ölü yol) · EPİAŞ "İlk kayıt: henüz yok" | `src/harita-3d/isaretler.js` · "İlk kayıt: **2026-07-16**, arşivde 925 json" | ölçülen değerler (D7) |
| U6 | Fantom token gerçek token'a bağlandı | `ilce-sorgu.astro:191` · `havza-riski.astro:110` | `var(--kehribar-600, #875518)` (tanımsız token, fallback devrede) | `var(--kehribar-metin)` (tanımlı, değer **aynı** `#875518`) | D3 token erişilebilirlik ölçümü; görünür metin farkı 0 |
| U7 | Ana sayfaya `<main>` landmark'ı | `src/pages/index.astro` | `grep -c "<main" dist/index.html` → **0** | → **1** | yapı diff: yalnız `<main>`+`</main>` (717→719 etiket), başka değişiklik yok |

## 2b GÖRÜNÜR ÇIKTI KORUMASI — son ölçüm

```
sayfa taban 523 / hedef 523 · kaybolan 0 · yeni 0
GÖRÜNÜR METİN farkı: 0
JSON-LD farkı:       0
```
Sayfa sayısı 522, sitemap 519 — **ikisi de tabanla aynı**.

**Araç dürüstlüğü notu:** ilk karşılaştırma aracım etiketleri `\x01`
ayracıyla değiştirdiği için `<main>` eklemesini "metin farkı" olarak
gösterdi. Araç ikiye ayrıldı (saf metin / yapı) ve ölçüm tekrarlandı;
ayrıntı `26-08-denetim-dogrulama.md` D15.

## FAZ 2'DE YAPILMAYANLAR (geri çekilenler)
- `public/hedef/*` (1,7 MB): tek tüketicisi `HedefSahne.astro`; bileşeni
  bırakıp görsellerini silmek tutarsız ara durum yaratırdı → **K28**.
- 158 `http://hdl.handle.net`: köken verisini ya da 4 render satırını
  düzenlemeyi gerektiriyor, kazanç marjinal → **K38**.
