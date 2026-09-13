# DENETİM 1.5 (b–e) — DİL, ÖLÜ BİLGİ, GÜNCELLİK DAMGASI, ÖZ-CEVAP

**Tarih:** 27.08.2026 · **Kapsam:** BOYUT 1.5'in b, c, d, e alt kalemleri
**Rejim:** SALT-OKUNUR. Hiçbir dosya değiştirilmedi/silinmedi, build alınmadı,
tarayıcı açılmadı, `arslanhukuk*` / `bist-*` dizinlerine girilmedi.
**Kaynak yüzey:** `dist/` 523 HTML görünür metni + `src/` kaynakları.

Bu belge YALNIZ tespittir. Hiçbir onarım yapılmamış, hiçbir karar
uygulanmamıştır.

---

## 0. KAPI

| Kontrol | Ölçülen | Sonuç |
|---|---|---|
| Çalışma ağacı (denetim öncesi = sonrası) | `M src/components/anasayfa/Hero.astro`, `M src/data/anasayfa-satis.js` | ✓ değişmedi |
| Bu turda yazılan dosya | yalnız bu rapor | ✓ |
| `dist/` HTML sayısı | 523 | ✓ (taban ile bit-eşit, dokunulmadı) |
| Dokunulmazlar | Hero.astro + anasayfa-satis.js — **bulgu yazılmadı** | ✓ |

**Yöntem.** `dist/*.html`'den script/style/noscript/svg/template/head ve HTML
yorumları çıkarılıp, blok etiketleri satır sonuna çevrilerek, HTML varlıkları
çözülerek görünür metin üretildi (523/523 sayfa). Bitişik-kelime adayları
**ham HTML'e geri götürülüp** aradaki işaretleme incelendi: blok etiket
(p/li/dt/dd/h*/div…) ya da `display:block`/`flex` taşıyan span geçişleri
**yanlış-pozitif olarak elendi**; yalnız gerçekten satır-içi kalan yapışmalar
bulgu sayıldı. Her bulgu ayrıca `src/`'de kök nedenine kadar izlendi.

---

## 1. ÖZET — BULGU TABLOSU

| # | Bulgu | Etkilenen sayfa | Sınıf |
|---|---|---|---|
| B1 | Astro 7 boşluk-yutması: satır-içi bağlantı/etiket sınırında kelimeler yapışıyor | **520 / 523** | KARAR (anlam değişmiyor) |
| B2 | `kardesIller` `.ad` alanı yok → kardeş il bağlantıları **etiketsiz** ("→ →") | **76** (230 link) | KARAR |
| B3 | Akademik künyede çift nokta (`…area.. Çukurova…`) | 24 | KARAR (anlam değişmiyor) |
| B4 | MTA katalog başlıklarında çift boşluk | 6 | KARAR (anlam değişmiyor) |
| C1 | Yayımlanmış hukuk rehberinde çözülmemiş iç QA notu ("çelişki doğrulanacaktır") | 1 | KARAR |
| C2 | `/havzalar/` öz-cevabı "adım adım doluyor" diyor — 25/25 havza yayında | 1 | KARAR |
| C3 | `/vaka/` bölümü tek vakalık; "Yeni vakalar eklenecektir." | 1 | KARAR |
| D1 | 10 indekslenen sayfada görünür güncellik damgası yok | 10 | UYGULAMA (8) + KARAR (2) |
| D2 | `hangi-kurum`: şemada `dateModified` var, görünür `<time>` yok | 1 | UYGULAMA |
| D3 | `ilce-sorgu`, `ilimde-kim-yetkili`: görünür `<time>` var, şemada `dateModified` yok | 2 | UYGULAMA |
| D4 | `hangi-kurum` sayfasında **build tarihi** basılıyor — KARARLAR §27/K3 ile çelişki | 1 | KARAR |
| E1 | `/hakkinda/` öz-cevabı içindekiler listesi, cevap değil | 1 | KARAR |
| E2 | `/su-kanunu/taslak-takibi/` öz-cevabı "güncel durum"u vermiyor, yöntemi anlatıyor | 1 | KARAR |
| E3 | `/nerede-su-cikar/` öz-cevabı H1'i aynen tekrarlayıp cevabı erteliyor | 1 | KARAR (düşük) |

**Toplam 14 bulgu.** Ayrıca 6 kalem "denetlendi, bulgu yok" olarak §6'da
kayıtlıdır (yanlış bulgu üretmemek için açıkça yazıldı).

---

## 2. (b) BOZUK TÜRKÇE / İMLA / BİTİŞİK KELİME

### Önce: TEMİZ ÇIKANLAR

| Tarama | Sonuç |
|---|---|
| Mojibake (`Ã¼`, `Ä±`, `â€`, `ï»¿` vb.) | **0 sayfa** |
| "yanlız", "herşey", "birşey", "hiçbirşey", "bir kaç", "farketmez", "heryer", "birsürü" | **0 sayfa** |
| "yada", "buda", "oda" (kelime sınırıyla) | **0 gerçek isabet** — ilk taramadaki 3 isabet `dosyada`/`odası` alt-dizesiydi, yanlış-pozitif |
| Üç nokta yerine `..` (cümle içi) | aşağıda B3 |

24.08'de 410 sayfada yapılan 0-isabetli tarama **yeniden koşuldu**; bu
kalemlerde sonuç yine 0'dır. Aşağıdaki bulgular o taramanın kapsamadığı
başka bir kusur sınıfındandır (satır-içi boşluk yutması).

---

### B1 — ASTRO 7 BOŞLUK-YUTMASI: 520 SAYFADA YAPIŞIK KELİME

**NE.** Kaynakta metin satırı bir satır-içi etiketle (`<a>`, `<strong>`)
alt alta yazıldığında, aradaki satır-sonu boşluğu derlemede yutuluyor ve
kelimeler görünür metinde yapışıyor. Brief "Astro 7 boşluk-yutması
düzeltildi" diyor — **düzeltme bu vakaları kapsamamış.**

**NEREDE (kök neden, tümü doğrulandı):**

| Kaynak | Etkilenen sayfa |
|---|---|
| `src/components/AltBilgi.astro:63-64` | **519** (site geneli alt bilgi) |
| `src/components/IlPotansiyel.astro:115-117` | 81 |
| `src/pages/kuyu-ruhsati/[il].astro:186-187` | 81 |
| `src/components/HavzaYasBandi.astro:138` ve `:140-141` | 25 |
| `src/pages/hakkinda.astro:54-55`, `:66-67`, `:89` | 1 |
| `src/pages/kapatma-kaydi.astro:121`, `:128-131` | 1 |
| `src/pages/arsiv.astro:93`, `:122` | 1 |
| `src/pages/kuyu-ruhsati/index.astro:24` | 1 |
| `src/pages/nerede-su-cikar.astro:83` | 1 |
| `src/components/anasayfa/KanitBandi.astro:44` | 1 |
| `src/components/IlKurumTablosu.astro:46` | 1 |

**KANIT — kaynak (`src/components/AltBilgi.astro:61-65`):**

```astro
      <p class="alt-metin">
        Hukuki içerik: {YAZAR.ad} —
        <a href={YAZAR.buroUrl} target="_blank" rel="noopener">{YAZAR.buro}</a>
      </p>
```

**dist ham çıktı** (`dist/kapatma-kaydi/index.html`):

```html
<p class="alt-metin" ...>Hukuki içerik: Av. Serdar Arslan —<a href="https://arslanhukuk.tr" ...>Arslan Hukuk Bürosu
```

**görünür metin** (çıkarılmış, 519 sayfanın hepsinde birebir):

```
Hukuki içerik: Av. Serdar Arslan —Arslan Hukuk Bürosu
```

**KANIT — `dist/hakkinda/index.html` görünür metni (üç kusur bir arada):**

```
Portaldaki hukuki içerik ve mevzuat analizleriAv. Serdar Arslan (Arslan Hukuk Bürosu)tarafından hazırlanmaktadır.
Her rehber, dayandığı kanun, tüzük veya yönetmeliğinmevzuat.gov.trüzerindeki resmî tam metnine bağlantı verir.
Sayısal veriler kamu kurumlarının açık kaynaklarından derlenir — başlıcaDSİ Resmî Su Kaynakları İstatistiklerive Tarım ve Orman Bakanlığı Su Yönetimi Genel Müdürlüğü (SYGM) havza koruma eylem planları.
Portaldaki veri veya kaynak hatalarını bildirmek için:avserdararslan@hotmail.com
```

**KANIT — `dist/kuyu-ruhsati/yalova/index.html` (81 il sayfasının hepsinde):**

```
İşletme sahası ilanının kuyu ruhsatına etkisi ve yaptırımlar için:kuyu ruhsatı rehberi ·ruhsatsız kuyu cezaları.
… madde metinleri ve başvuru akışıkuyu ruhsatı rehberindetek merkezde anlatılır.
```

**KANIT — `dist/havzalar/gediz/index.html` (25 havza sayfası):**

```
Kaynak: DSİ Resmî Su Kaynakları İstatistikleri — potansiyel/rezervTablo 1.3, tahsis Tablo 1.6(indirme 20.07.2026).
```

Bu satır kusurun **kendi içinde kanıtını** taşıyor: aynı cümlede
`tahsis <a>` (boşluk satır içinde, korundu) ile `rezerv\n<a>` (boşluk satır
sonunda, yutuldu) yan yana duruyor. Yani sorun içerikte değil, satır
sonundaki boşluğun derlemede düşmesinde.

**KANIT — `dist/kapatma-kaydi/index.html` (`</strong>` sınırı):**

```
Bu, orada tahsise kapatma olmadığı anlamına gelmez.Liste Resmî Gazete taramasından derlenmiş sınırlı bir kümedir…
```

**Etkilenen sayfa sayısı (ölçüm):** kusur dizgelerinin birleşimiyle
**520 / 523 sayfa**. Dışarıda kalan 3 sayfa: `404.html`, `harita-pilot`,
`stil-pilot`.

**SINIF ÖNERİSİ:** KARAR — düzeltme görünür metni değiştirir, bu yüzden
karar kaydı gerekir. **Anlam DEĞİŞMİYOR** (yalnız eksik boşluk konur);
"anlam değişmez" istisnası olarak ayrıca işaretlenmiştir.

**GEREKÇE.** Kusur `hakkinda` sayfasında yazarın adının ve mevzuat
kaynağının okunmasını bozuyor; bunlar E-E-A-T'nin taşıyıcı cümleleri.
Alt bilgi kusuru 519 sayfada, yani sitenin tamamında görünüyor.

**ETKİ + dayanak.** (i) CLAUDE.md **Görünürlük kuralı** — "İLK BAKIŞTA fark
edilir" eşiği burada aleyhte çalışıyor: kusur da ilk bakışta fark ediliyor.
(ii) CLAUDE.md **İçerik ilkesi** — öz-cevap bloğu meta-description ve
AI-arama alıntı cümlesi kaynağıdır; `hakkinda` ve il sayfalarındaki yapışık
cümleler alıntılandığında bozuk çıkar. (iii) KARARLAR §32 (Astro 7'ye
yükseltme) — yükseltmenin bilinen yan etkisi bu; kayıt tamamlanmamış.

---

### B2 — KARDEŞ İL BAĞLANTILARI ETİKETSİZ: 76 SAYFA, 230 LİNK

**NE.** `kuyu-ruhsati/[il]` şablonunda "Aynı DSİ bölgesindeki diğer iller
hangileri?" başlığının altındaki bağlantılar **yalnız ok işaretinden ibaret**;
il adı basılmıyor. Başlık bir soru soruyor, sayfa cevabı "→ →" olarak
veriyor.

**NEREDE.** `src/pages/kuyu-ruhsati/[il].astro:201`

```astro
{kardesIller.map((x) => <a href={`/kuyu-ruhsati/${x.slug}/`}>&rarr; {x.ad}</a>)}
```

**Kök neden.** `kardesIller`, `yayinlananIller()` (→ `src/data/il-profil.js:125`
→ `tumIlProfilleri()`) çıktısıdır. O nesnenin il adı alanı **`il`**'dir,
`ad` DEĞİLDİR (`src/data/il-profil.js:105-107`):

```js
    return {
      il,
      slug: ilSlug(il),
      dsiBolgeleri: ilBolge[il] ?? [],
```

`{x.ad}` bu yüzden `undefined` dönüyor ve boş basılıyor. Aynı dosyanın
`:213` satırındaki `{g.ad}` (göller) DOĞRUDUR — göl nesnesinde `ad` alanı
gerçekten var; kusur `:201`'e özgüdür, tek satırlık bir sözleşme uyuşmazlığı.

**KANIT — `dist/kuyu-ruhsati/bursa/index.html`:**

```html
<nav class="capraz" aria-label="Aynı DSİ bölgesindeki iller" ...><a href="/kuyu-ruhsati/kocaeli/" ...>&rarr; </a><a href="/kuyu-ruhsati/yalova/" ...>&rarr; </a></nav>
```

**KANIT — `dist/kuyu-ruhsati/yalova/index.html` görünür metni:**

```
Aynı DSİ bölgesindeki diğer iller hangileri?
→ →
Bu ilde hangi göller ve akarsular örnekleniyor?
→ Gökçe Baraj Gölü
```

Hemen altındaki göl bloğunun ("→ Gökçe Baraj Gölü") doğru basılması,
kusurun şablonun tamamında değil bu tek satırda olduğunu gösteriyor.

**Ölçüm:** 76 sayfa, 230 boş etiketli bağlantı.

**SINIF ÖNERİSİ:** KARAR — görünür metne il adları eklenir, anlam değişir
(boş bağlantı → adlandırılmış bağlantı).

**GEREKÇE.** Üç ayrı yükümlülük birden düşüyor: (i) sayfa kendi H2
sorusuna cevap vermiyor; (ii) bağlantı metni boş — erişilebilirlikte
bağlantı amacı okunamıyor, ekran okuyucu yalnız "→" duyurur; (iii)
KARARLAR/K3-3 kapsamında kurulan spoke↔spoke iç bağlantı ağı, 230 linkin
tamamı etiketsiz olduğu için SEO değeri üretmiyor.

**ETKİ + dayanak.** Kaynak yorumun kendisi (`[il].astro:31-34`) bu bloğun
"81 il sayfasının HİÇBİRİNİN kardeş il sayfasına link vermediği" ÖLÇÜMÜ
üzerine kurulduğunu yazıyor; iş yapıldı ama çıktı sessizce boş. Faz 1.3
(erişilebilirlik, statik) 2 bulgu ile kapanmıştı — bu kalem o taramada
görünmemiş; boş bağlantı metni sınıfı ayrıca denetlenmeli.

---

### B3 — AKADEMİK KÜNYEDE ÇİFT NOKTA (24 SAYFA)

**NE.** Şablon başlık ve dergi adından sonra koşulsuz `.` ekliyor; veri
değeri zaten `.` ile bitiyorsa `..` çıkıyor.

**NEREDE.** `src/components/IlPotansiyel.astro:161-162`

```astro
                {k.yazarlar.length > 3 && ' vd.'} ({k.yil}). {k.baslik}.
                {k.dergi && ` ${k.dergi}.`}{' '}
```

**KANIT — `dist/kuyu-ruhsati/aydin/index.html`:**

```
Tuba Cebe, Canan SEYFELİ (2026). Caynizm'de Ölüm Sonrası Yaşam. Din ve insan dergisi.. yayın
```

`dist/kuyu-ruhsati/kastamonu/index.html`:

```
Samet Sabri Aksu (2020). Geology and related porphyry Cu mineralization in Karacaören (Sandikli / Afyonkarahisar) area.. Çukurova University Institutional Repository. yayın
```

**Ölçüm:** 24 sayfa.

**SINIF ÖNERİSİ:** KARAR (görünür metin değişir) — **anlam DEĞİŞMİYOR**,
noktalama düzeltmesidir.

**GEREKÇE + ETKİ.** Künye satırı sitenin kaynak-gösterme disiplininin
vitrinidir; dizgi kusuru tam orada duruyor. Düzeltme veri dosyasında değil
şablonda yapılmalı (veri kaynağı üstten geliyor, oradaki nokta meşru).

---

### B4 — MTA KATALOG BAŞLIKLARINDA ÇİFT BOŞLUK (6 SAYFA)

**NE.** Katalog kayıt başlıklarında kelime arasında iki boşluk.

**NEREDE.** Veriden geliyor (MTA e-ticaret katalog metaverisi), şablon
normalleştirmiyor.

**KANIT:**

```
dist/kuyu-ruhsati/karaman/  : KONYA/KARAPINAR-KARAMAN/AYRANCI KÖMÜR SAHASI İLAVE HİDROJEOLOJİ  SONDAJ ÇALIŞMASI RAPORU — katalog kaydı
dist/kuyu-ruhsati/tekirdag/ : TEKİRDAĞ MERKEZ  VE MALKARA  KÖMÜR SAHALARI HİDROJEOLOJİ ETÜT RAPORU (PROJE NO: 2018-33-37) — katalog kaydı
dist/kuyu-ruhsati/malatya/  : HASANÇELEBİ HEKİMHAN JEOLOJİK-JEOFİZİK  ETÜTLER — katalog kaydı
```

`dist/kuyu-ruhsati/mugla/` ayrıca **B1 ile birleşik** bir kusur taşıyor:

```
…Yeraltısuyu İşletme  Sahası Olarak Tespiti Hakkında KararıRG 05.09.1970 · Sayı 13600 …
```

**Ölçüm:** 6 sayfa, 6 satır.

**SINIF ÖNERİSİ:** KARAR — **anlam DEĞİŞMİYOR** (boşluk normalleştirme).
Not: kaynak veri kayıt başlığı OLDUĞU GİBİ alıntılanıyor; normalleştirme
"alıntıyı düzeltmek" sayılır mı, karar kalemidir.

---

## 3. (c) ÖLÜ / ESKİMİŞ BİLGİ

### Önce: TEMİZ ÇIKANLAR

| Tarama | Sonuç |
|---|---|
| "yakında", "çok yakında", "coming soon", "yapım aşamasında", "Lorem", "placeholder", "yayımlanacak" | **0** |
| `href="#"` (boş bağlantı) | **0 sayfa** |
| "TODO" | 2 isabet — ikisi de RG tarama metnindeki `todola` alt-dizesi, **yanlış-pozitif** |
| Boş bölüm (başlık var, içerik yok) | 3 aday incelendi; 2'si yanlış-pozitif (h2→h3 geçişi), 1'i gerçek → **B2** |
| Tarihi geçmiş gelecek-zaman iddiası (yıl × gelecek eki kesişimi) | 22.352 satır, 3.059'u yıl içeriyor, 208'i gelecek eki içeriyor; **kesişimde eskimiş iddia yok** |

208 ileriye dönük ifadenin tamamı elden geçirildi: ezici çoğunluğu (i) RG
tarama metnindeki normatif hukuk dili ("açılacak kuyular için belge almak
zaruridir"), (ii) yürürlükteki mevzuat alıntısı ("yürürlüğe girdiği"),
(iii) meşru editoryal not. **Bugün (27.08.2026) itibarıyla geçmişte kalmış
bir gelecek iddiası bulunamadı.**

`/su-kanunu/taslak-takibi/` özellikle incelendi ve **temiz** bulundu:
sayfa "hedef, kanunun 2026 yılı içinde TBMM'de yasalaşması olarak ifade
edildi" diyor ve altında açıkça şerh düşüyor: *"Taslağın TBMM'ye sevk
edildiğine dair resmî bir kayıt bulunamadı (son tarama: 14.07.2026).
'2026'da yasalaşır' ifadesi hedef beyanıdır, takvim taahhüdü değildir."*
Bu, brief'in uyardığı "hâlâ geçerli" sınıfıdır — bulgu yazılmadı.

---

### C1 — YAYIMLANMIŞ HUKUK REHBERİNDE ÇÖZÜLMEMİŞ İÇ QA NOTU

**NE.** Bir Danıştay kararının künyesinde çelişki olduğu, sayfanın kendi
gövdesinde ziyaretçiye açık biçimde yazılı; çelişki hâlâ çözülmemiş.

**NEREDE.** `dist/rehberler/kaynak-suyu-kiralama/index.html`

**KANIT (görünür metin, satır 112-115):**

```
Danıştay 13. Daire 2020/1093 E., 2023/2584 K. — su kaynağının
kiralanmasına ilişkin encümen kararı ve 2886'ya dayalı sözleşmeden
doğan uyuşmazlıkta aynı eksen. (Bu karar ilk üretimde 2020/1104 E.,
2023/4576 K. olarak künyelenmişti; çelişki doğrulanacaktır.)
```

**SINIF ÖNERİSİ:** KARAR — hukuki metin; hem içerik kararı hem doğrulama
işi gerektirir. CLAUDE.md "BÜYÜK İŞ" ölçütü (hukuki metin) devrededir.

**GEREKÇE.** İki okuma da mümkün ve ikisi de sorunlu: (i) not dürüstlük
etiketi ise (KARARLAR §13), ziyaretçiye hangi künyenin doğru olduğunu
söylemiyor — cevapsız bir uyarı; (ii) üretim artığı ise, iç QA notu
yayına sızmış demektir. Her hâlükârda bir Danıştay künyesinin
doğruluğu **açıkça askıda** ve site su hukuku otoritesi iddiasındadır.

**ETKİ + dayanak.** CLAUDE.md "Altyapıda hızlı, iddiada yavaş" — künyesi
doğrulanmamış içtihat, kullanıcıyı maddi karara yönlendiren en riskli
içerik türüdür. Not tek sayfada, dolayısıyla onarım maliyeti düşük;
gecikmenin maliyeti düşük değil.

---

### C2 — `/havzalar/` ÖZ-CEVABI SAYFALARIN "DOLMAKTA" OLDUĞUNU SÖYLÜYOR

**NE.** Havza hub'ının öz-cevabı bölümün henüz tamamlanmadığını ima ediyor;
oysa 25 havzanın 25'i de yayında.

**NEREDE.** `src/pages/havzalar/index.astro:26` → `dist/havzalar/index.html`

**KANIT (kaynak, birebir):**

```astro
    ozet="Türkiye'nin 25 su havzası, havza bazında veri künyeleriyle. Sayfalar açık kaynaklardan doğrulanmış veriyle adım adım doluyor."
```

**Karşı ölçüm:** `ls -d dist/havzalar/*/ | wc -l` → **25**; sitemap'te 26
havza URL'i (hub + 25 havza). Yani "adım adım doluyor" ifadesinin
karşılığı yok.

**SINIF ÖNERİSİ:** KARAR — görünür metnin anlamı değişir ("dolmakta" →
"tamam"), ayrıca bu blok `class="sayfa-ozet oz-cevap"` ile öz-cevap olarak
işaretli, yani meta-description ve AI-alıntı kaynağıdır.

**ETKİ + dayanak.** CLAUDE.md İçerik ilkesi: öz-cevap "ziyaretçinin
sorusunun cevabını 10 saniyede veren damıtılmış özet"tir. "Adım adım
doluyor", tamamlanmış bir bölümü eksik gösteren bir tazelik-karşıtı
sinyaldir ve AI-arama alıntısına bu hâliyle girer.

---

### C3 — `/vaka/` BÖLÜMÜ TEK VAKALIK, "YENİ VAKALAR EKLENECEKTİR" DİYOR

**NE.** "Vakalar" hub'ı çoğul kuruluyor, öz-cevap çoğul konuşuyor, ama
bölümde tek vaka var; sayfa sonunda açık bir "eklenecek" vaadi duruyor.

**NEREDE.** `dist/vaka/index.html`

**KANIT:**

```
H1: Vakalar
ÖZ (129 krk): Şirketlerin su kaynağını güvenceye alma süreçleri — yalnız kamuya açık, doğrulanmış KAP bildirimlerine dayanan olgu incelemeleri.
…
Yeni vakalar eklenecektir.
```

**Karşı ölçüm:** `ls -d dist/vaka/*/` → yalnız `dist/vaka/meysu/`. Sitemap'te
2 URL (hub + 1 vaka).

**SINIF ÖNERİSİ:** KARAR — içerik/kuyruk kararıdır (vaka eklemek mi, hub'ı
sadeleştirmek mi). CLAUDE.md **AY İLKESİ** gereği yeni vaka üretimi
"yeni özellik" sayılmasa da içerik üretimidir; kuyruğa yazılması gerekir.

**GEREKÇE + ETKİ.** Tek üyeli çoğul hub, hem ince içerik (thin content)
sinyali hem de ziyaretçide karşılıksız beklenti üretiyor. Not: "Yeni
vakalar eklenecektir" ifadesi kendi başına dürüsttür — bulgu, ifadenin
yanlışlığı değil, **hub'ın çoğul kurgusuyla tek üyeli gerçeğin
açıklığıdır**.

---

## 4. (d) GÖRÜNÜR GÜNCELLİK DAMGASI OLMAYAN SAYFALAR

**Taban doğrulandı.** 25.08 ölçümü (509 görünür damga + 508 şema
`dateModified`) bu turda birebir yeniden üretildi:

| Ölçüm | Sonuç | Taban |
|---|---|---|
| `<time>` taşıyan sayfa | 523 − 14 = **509** | 509 ✓ |
| `dateModified` taşıyan sayfa | 523 − 15 = **508** | 508 ✓ |

### D1 — DAMGASIZ 10 İNDEKSLENEN SAYFA (İSİM İSİM)

`<time>` taşımayan 14 sayfa; muaflar düşülünce **10 indekslenen sayfa**:

| Sayfa | Sitemap | Şablon `SayfaBasi` | `tarih` prop | Veri kaynağı var mı? | Sınıf |
|---|---|---|---|---|---|
| `hakkinda/` | ✓ | ✓ | **yok** | belirgin veri tarihi yok | KARAR |
| `hangi-kurum/` | ✓ | ✓ | **yok** | ✓ `kapiVeri.son_guncelleme` (=2026-07-23, şemada zaten basılı) | UYGULAMA |
| `havzalar/` | ✓ | ✓ | **yok** | ✓ `TARIH.havzaVeri` (guncellik.js) | UYGULAMA |
| `havza-riski/` | ✓ | ✓ | **yok** | ✓ `TARIH.grace` / `TARIH.baraj` | UYGULAMA |
| `kuyu-ruhsati/` | ✓ | ✓ | **yok** | ✓ `TARIH.potansiyel` | UYGULAMA |
| `rehberler/` | ✓ | ✓ | **yok** | ✓ koleksiyon `data.tarih` (kaynak yorumu: "9 rehber de aynı tarihli") | UYGULAMA |
| `su-kanunu/` | ✓ | ✓ | **yok** | ✓ `g.data.tarih` (sayfa zaten alt satırlarda basıyor) | UYGULAMA |
| `vaka/` | ✓ | ✓ | **yok** | ✓ koleksiyon `data.tarih` | UYGULAMA |
| `harita/` | ✓ | **kullanmıyor** | — | §9 gereği H1 yok; damga deseni ayrı | KARAR |
| `index.html` (ana sayfa) | — | **kullanmıyor** | — | ayrı şablon | KARAR |

Muaf tutulanlar (bulgu yazılmadı): `404.html`, `stil-pilot/`,
`harita-pilot/`, `kullanilanlar/` — dördü de `noindex`, sitemap'te yok.

**KANIT — bileşen zaten destekliyor** (`src/components/SayfaBasi.astro:29-35`):

```astro
  {(tarih || yazarli) && (
    <p class="sayfa-kunye">
      {tarih && (
        <span>
          Güncelleme: <time datetime={tarih.toISOString().slice(0, 10)}>{tarihYaz(tarih)}</time>
        </span>
      )}
```

Yani 8 sayfada eksik olan **desen değil, yalnız `tarih` prop'unun
geçirilmesidir**; veri de mevcut (`src/data/guncellik.js` 11 şablonda
kullanılıyor, bu hub'larda kullanılmıyor).

**SINIF ÖNERİSİ:** 8 sayfa **UYGULAMA** (damga/künye eksiği, veri zaten
var); `hakkinda/`, `harita/`, `index.html` **KARAR** (tarih kaynağı
belirsiz — KARARLAR §27/K3: *"Tarihi belirsiz sayfada damga BASILMAZ"*
bu üçü için geçerli olabilir, kasıtlı mı değil mi karar kalemidir).

**ETKİ + dayanak.** KARARLAR §27 Karar 3 (eeat-audit №1 + C5 №5): görünür
güncellik damgası E-E-A-T tazelik sinyalidir ve deseni SayfaBasi'nın mevcut
künye satırıdır. Damgasız 10 sayfanın 8'i hub — yani tarama derinliğinde
üst sırada duran, iç bağlantı yoğunluğu en yüksek sayfalar.

---

### D2 — `hangi-kurum`: ŞEMA VAR, GÖRÜNÜR DAMGA YOK

**KANIT:**

```
dist/hangi-kurum/index.html
  <time>        : (yok)
  dateModified  : "dateModified":"2026-07-23"
  şema tipleri  : Answer BreadcrumbList FAQPage ListItem Organization Person Question WebPage WebSite
```

Veri tarihi sayfanın dibinde düz metin olarak görünüyor ("Kaynak veri:
hangi-kapi.json (2026-07-23)") ama `<time>` değil, künye satırı değil.

**SINIF ÖNERİSİ:** UYGULAMA — veri (`kapiVeri.son_guncelleme`) zaten
hesaplanmış (`src/pages/hangi-kurum/index.astro:53`) ve şemaya basılıyor;
görünür desene bağlanması kalıyor.

---

### D3 — `ilce-sorgu` + `ilimde-kim-yetkili`: GÖRÜNÜR DAMGA VAR, ŞEMA YOK

**KANIT:**

```
dist/ilce-sorgu/index.html
  <time>        : <time datetime="2026-08-04">4 Ağustos 2026</time>
  dateModified  : (yok)
  şema tipleri  : BreadcrumbList ListItem Organization Person WebSite   ← WebPage YOK

dist/ilimde-kim-yetkili/index.html
  <time>        : <time datetime="2026-07-27">27 Temmuz 2026</time>
  dateModified  : (yok)
  şema tipleri  : BreadcrumbList ListItem Organization Person WebSite   ← WebPage YOK
```

Kök neden: bu iki sayfada `WebPage` düğümü hiç yok, dolayısıyla
`dateModified` basılacak yer yok. İkisi de `guncellik.js` kullanıyor,
yani tarih elde.

**SINIF ÖNERİSİ:** UYGULAMA — veri var, yalnız şema düğümü eksik.
(Not: KARARLAR §27/K3 "şemada dateModified = guncelleme ?? tarih" diyor;
şema tipi seçimi JSON-LD şeması alanına girer, otomatik onarım KARA
LİSTE'dir — el ile uygulanmalı.)

---

### D4 — `hangi-kurum` SAYFASI BUILD TARİHİ BASIYOR (KARARLAR §27 İLE ÇELİŞKİ)

**NE.** Sayfa, her derlemede değişen bir tarihi görünür metne basıyor.

**NEREDE.** `src/pages/hangi-kurum/index.astro:54-55`

```js
// Sayfa derleme tarihi (brief madde 5: son güncelleme build tarihinden basılır).
const derlemeTarihi = new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
```

**KANIT — `dist/hangi-kurum/index.html` görünür metni:**

```
… Kaynak veri: hangi-kapi.json (2026-07-23). Sayfa derlemesi: 27 Ağustos 2026.
```

("27 Ağustos 2026" = bugün, yani bu değer build anında üretiliyor.)

**Çelişen kayıt — KARARLAR §27, Karar 3 (2026-08-25):**

> damga tarihi YALNIZ veri kaydının kendi künyesinden gelir … **build saati
> damga DEĞİLDİR** (her deploy'da oynayan tarih sahte tazelik sinyalidir).
> … **Reddedilenler:** build-time git türetimi …; "bugün" basmak (uydurma
> yasağı).

**SINIF ÖNERİSİ:** KARAR.

**GEREKÇE — iki yönlü, tek taraflı yazılmadı.** Lehte: satır dürüstçe
etiketli ("Sayfa derlemesi", "Güncelleme" değil) ve gerçek veri tarihi
(2026-07-23) hemen yanında ayrıca veriliyor; yani okur yanıltılmıyor ve
kod yorumu bunun bir brief maddesine dayandığını söylüyor. Aleyhte: §27
kaydı **tarih olarak daha yenidir (25.08)** ve build-zamanı tarih basmayı
adıyla reddetmiştir; ayrıca değer her deploy'da oynadığından, sayfada
görünen en taze tarih içerikle ilgisiz olanıdır.

**ETKİ + dayanak.** Karar kalemi, iki kaydın hangisinin geçerli olduğudur:
`hangi-kurum` briefinin 5. maddesi mi, KARARLAR §27/K3 mü. Otomatik
onarılamaz — CLAUDE.md sağlık sistemi "içerik" ve "veri kaynağı değişimi"ni
KARA LİSTE'ye koyar.

---

## 5. (e) ÖZ-CEVAP KONTROLÜ

**Yöntem.** Her sayfa şablonundan örnek alındı; H1 ile ilk öz-cevap bloğu
(`class="…oz-cevap"`) yan yana konup "başlıktaki soruya cevap veriyor mu"
diye değerlendirildi.

**Muaf tutulanlar (bulgu yazılmadı):** ana sayfa (KARARLAR §8), `/harita/`
(§9, H1 yok), `noindex` sayfalar (`/stil-pilot/`, `/harita-pilot/`,
`/kullanilanlar/`), ve 280 karakteri aşan 12 sayfa (ayrı bilinen bulgu,
tekrarlanmadı).

### CEVAP VEREN ŞABLONLAR (bulgu yok)

| Şablon | Örnek | Değerlendirme |
|---|---|---|
| `rehberler/[slug]` | `rehberler/kuyu-ruhsati/` — H1: "Kuyu ruhsatı: … belgeleri" · ÖZ (285): "Su temini için kuyu açmadan önce DSİ'den belge şart (167 s.K. m.8). Üç belge: arama, kullanma, ıslah-tadil…" | Cevap ilk cümlede, dayanak madde numarasıyla ✓ |
| `rehberler/kuyu-tasima` | ÖZ (284): "Kuyu taşınması hukuken çoğu kez 'aynı ruhsatı başka yere götürmek' değildir…" | Yaygın yanlışı doğrudan düzelten cevap ✓ |
| `havzalar/[slug]` | `havzalar/gediz/` — H1: "Gediz Havzası nerede, hangi illeri kapsar?" · ÖZ (165): "Gediz Havzası İzmir, Kütahya, Manisa ve Uşak illerini kapsar…" | Soru→cevap birebir ✓ |
| `kuyu-ruhsati/[il]` | `yalova` — ÖZ (193): "Yalova ili Marmara Havzası sınırları içindedir; … muhatabı DSİ 1. Bölge Müdürlüğü (Bursa)'dür." | Muhatap merci ilk cümlede ✓ |
| `durumum/[persona]` + `durumum/` | ÖZ (207): "Sektörünüzü seçin; … son başvuru 27 Aralık 2029." | Somut tarih veriyor ✓ |
| `vaka/[slug]` | `vaka/meysu/` — ÖZ (286): "Meysu Gıda, mineralli su kaynağını … işletme ruhsatını alarak güvenceye aldı." | Sonuç önce ✓ |
| `goller/[slug]`, `nehirler/[slug]` | "Gölcük, İzmir ili sınırlarında bir doğal göldür; yaklaşık 0,74 km²…" | Tanım+ölçü+kaynak ✓ |
| `kapatma-kaydi`, `arsiv`, `havza-riski`, `hangi-kurum`, `ilimde-kim-yetkili` | ÖZ 164-274 krk, hepsi sayı/merci veriyor | ✓ |

### E1 — `/hakkinda/` ÖZ-CEVABI İÇİNDEKİLER LİSTESİ

**KANIT:**

```
H1: Hakkında
ÖZ (86 krk): Bu portalın ne olduğu, içeriği kimin hazırladığı ve verinin hangi yöntemle derlendiği.
```

Blok `class="sayfa-ozet oz-cevap"` ile öz-cevap olarak işaretli.

**NE.** Cümle sayfanın **neyi anlattığını** sayıyor, sorulara **cevap
vermiyor**: portal nedir, içeriği kim hazırlıyor, veri nasıl derleniyor —
üçünün de cevabı sayfada var ama öz-cevapta yok.

**SINIF ÖNERİSİ:** KARAR — görünür metnin anlamı değişir.

**GEREKÇE + ETKİ.** CLAUDE.md İçerik ilkesi: öz-cevap "cevabını 10 saniyede
veren damıtılmış özet"tir ve "meta-description ve FAQPage/AI-arama alıntı
cümlesi kaynağıdır". `hakkinda` sayfası E-E-A-T'nin kimlik sayfasıdır;
"içeriği kimin hazırladığı" sorusunun cevabı (Av. Serdar Arslan / Arslan
Hukuk Bürosu) tam da alıntılanması istenen cümledir — şu hâlde alıntıya
girmiyor. Not: aynı sayfa **B1**'den de etkileniyor (yazarın adı yapışık
basılıyor); iki bulgu birlikte değerlendirilmelidir.

### E2 — `/su-kanunu/taslak-takibi/` ÖZ-CEVABI "GÜNCEL DURUM"U VERMİYOR

**KANIT:**

```
H1: Su Kanunu taslağı: güncel durum takibi
ÖZ (107 krk): Su Kanunu taslağının yasalaşma sürecindeki somut gelişmeler; tarih ve kaynak bağlantısıyla, spekülasyonsuz.
```

**NE.** Başlık "güncel durum" vaat ediyor; öz-cevap **yöntemi** anlatıyor
("tarih ve kaynak bağlantısıyla, spekülasyonsuz"), durumu söylemiyor.
Cevap sayfada mevcut ve iyi yazılmış, ama öz-cevap bloğunun altında:

```
15 Nisan 2026 — Taslak 268 kurum ve kuruluşun görüşüne açıldı.
…
Taslağın TBMM'ye sevk edildiğine dair resmî bir kayıt bulunamadı (son tarama: 14.07.2026).
```

**SINIF ÖNERİSİ:** KARAR — görünür metnin anlamı değişir; ayrıca hukuki
konu olduğundan ifade CLAUDE.md "yeni hukuki iddia üretilmez" sınırına
dikkat ederek **mevcut doğrulanmış metinden damıtılmalıdır**.

**GEREKÇE + ETKİ.** Bu sayfa sitenin en yüksek arama niyeti taşıyan
sayfalarından biri ("su kanunu ne durumda") ve AI-arama alıntısına en açık
olanı. Şu hâliyle alıntılanan cümle soruyu cevaplamıyor. Onarım maliyeti
düşük: iki mevcut cümlenin damıtılması yeterli, yeni iddia gerekmiyor.

### E3 — `/nerede-su-cikar/` ÖZ-CEVABI SORUYU TEKRARLIYOR (düşük)

**KANIT:**

```
H1: Nerede su çıkar?
ÖZ (181 krk): Nerede su çıkar? Cevap il il, resmî veriyle: 12 havza planından 472 yeraltı suyu kütlesi, 347'si il sınırına eşlendi. 1963'ten bu yana 419 Resmî Gazete kaydı tarandı. İlinizi seçin.
```

**NE.** Blok H1'i **kelimesi kelimesine tekrar ediyor**, ardından cevabı
veri künyesine ve araca erteliyor ("Cevap il il…", "İlinizi seçin").

**SINIF ÖNERİSİ:** KARAR (düşük öncelik) — anlam değişir.

**GEREKÇE.** Araç sayfası olduğu için erteleme kısmen meşrudur; bulgu
"cevap yok" değil, **soru tekrarı + 181 karakterin ~20'sinin tekrara
gitmesi**dir. Karşılaştırma: `hangi-kurum` da araç sayfasıdır ama öz-cevabı
soruyu tekrarlamadan ne verdiğini söyler ("20 su işlemi için yetkili kurum,
dayanak madde ve başvuru kanalı tek tabloda").

**Hub'lar hakkında not (bulgu yazılmadı).** `rehberler/`, `havzalar/`,
`vaka/`, `su-kanunu/`, `kuyu-ruhsati/` hub'larının H1'leri soru değil,
öz-cevapları katalog tarifidir. Katalog sayfasında katalog tarifi meşru
kabul edildi ve bulgu yazılmadı — **istisnası C2**'dir (`/havzalar/`,
tarifin kendisi yanlış olduğu için).

---

## 6. DENETLENDİ — BULGU YOK (yanlış bulgu üretmemek için kayda geçirildi)

1. **RG pasajlarındaki OCR bozulması (58 sayfa).** `kuyu-ruhsati/*` ve
   `kapatma-kaydi` sayfaları taranmış RG metinlerini ham hâliyle taşıyor
   ("A A S L A N", "rnilyon", "em:..yetle", "mVyıl"). **Bulgu yazılmadı:**
   pasajlar (i) tırnak içinde ve italik (`pot-pasaj`), (ii) `<details>`
   içinde kapalı, (iii) başlığında şerhli — `IlPotansiyel.astro:88-89`:
   *"RG ilan pasajları (N) — taranmış arşivden, dizgi hatası içerebilir"*,
   (iv) `kapatma-kaydi`'nda ayrıca *"pasajlar dizgi hatası içerebilir"*.
   71 sayfada bu şerh mevcut. Bu, uydurma yasağına uygun **dürüst alıntı
   davranışıdır**, dil kusuru değildir.
2. **`.adim-alt` / `.sv-baslik` / `.pot-kod` / `.katman-ipucu` yapışmaları.**
   Ham metinde bitişik görünen ~40 aday, CSS'te `display:block` ya da
   `display:flex; gap:` taşıdığı için ekranda ayrık. Yanlış-pozitif.
3. **`rehberi</a>ne bakın`** (`kuyu-ruhsati/index.html`). Türkçe ek
   bağlantı metnine kasten bitişik yazılmış ("rehberine bakın") — doğru.
4. **`&rarr;` göl/nehir bağlantıları** (`[il].astro:213,216`): `g.ad`/`n.ad`
   alanları gerçekten var, doğru basılıyor. Kusur yalnız `:201`'de.
5. **`href="#"` boş bağlantı:** 0 sayfa.
6. **`/su-kanunu/taslak-takibi/` gelecek-zaman ifadeleri:** brief'in
   uyardığı "hâlâ geçerli" sınıfı; şerhli ve doğrulanabilir. Temiz.

---

## 7. KAPANIŞ

**Taranan sayfa:** 523 / 523 (dist'teki tüm HTML). Taranamayan sayfa **yok**.
**Şablon sayısı:** 28 `.astro` sayfa şablonu; öz-cevap için 20 indekslenen
şablon türünden örnek alındı (8 muaf/noindex).
**Üretilen bulgu:** 14 (KARAR 11 · UYGULAMA 3 · bunların 3'ü "anlam
değişmiyor" işaretli).
**Bulgu yok kaydı:** 6 kalem (§6).

### Etkilenen sayfa büyüklüğü sıralaması

| Bulgu | Sayfa |
|---|---|
| B1 boşluk-yutması | 520 |
| B2 etiketsiz kardeş il linki | 76 (230 link) |
| B3 çift nokta | 24 |
| D1 damgasız indekslenen sayfa | 10 |
| B4 çift boşluk | 6 |
| D3 şemasız damga | 2 |
| C1, C2, C3, D2, D4, E1, E2, E3 | 1'er |

### Kullanılan komutlar (özet)

```
# görünür metin çıkarma (523 sayfa)
node cikar.mjs metin        # script/style/svg/head/yorum çıkar, blok etiket→satır sonu,
                            # HTML varlıkları çöz

# bitişik kelime adayları
grep -rhoE '[a-zçğıöşü][A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}' metin/ | sort | uniq -c | sort -rn

# adayları ham HTML'de doğrula (blok etiket geçişlerini ele)
node dogrula.mjs            # etiket-içi boşluk sayılmaz; blok etiket → yanlış-pozitif
node inline.mjs             # yalnız satır-içi etiket sınırında kalan yapışmalar

# kök neden: kaynakta desen + dist'te yutulma doğrulaması
node kaynak-tara.mjs        # src/*.astro satır-sonu boşluk deseni → dist'te kanıt dizgesi

# imla / noktalama
grep -rlE 'Ã¼|Ä±|â€|ï»¿' metin/                    # mojibake → 0
grep -rnwE 'yada|buda|oda' metin/                    # kelime sınırıyla → 0
grep -rlE '[A-Za-zÇĞİÖŞÜçğıöşü]\.\.[^.]' metin/      # çift nokta → 24
grep -rlE '[^ ]  +[^ ]' metin/                       # çift boşluk → 6

# ölü/eskimiş bilgi
grep -rl 'href="#"' dist --include=*.html            # → 0
node (yıl × gelecek-eki kesişimi, 22.352 satır)      # → eskimiş iddia yok
node (h2/h3 sonrası boş içerik taraması)             # → 3 aday, 1 gerçek (B2)

# güncellik damgası
for f in $(find dist -name '*.html'); do grep -q '<time' "$f" || echo "$f"; done       # 14
for f in $(find dist -name '*.html'); do grep -q 'dateModified' "$f" || echo "$f"; done # 15

# öz-cevap
node (H1 + class="…oz-cevap" ilk <p> çıkarımı, şablon başına 1-2 örnek)

# ağaç bütünlüğü
git status --short           # denetim öncesi = sonrası
```

### Kapsam dışı tutulanlar

- `src/components/anasayfa/Hero.astro` ve `src/data/anasayfa-satis.js`
  (bekleyen kullanıcı onayı — **hiç incelenmedi, bulgu yazılmadı**).
- Kapanmış kararlar yeniden açılmadı: göl/nehir sayfaları (§25),
  `/su-hukuku/` (§26), 11 içerik title'ı ([SERDAR-HUKUK] kararında),
  280 karakteri aşan 12 öz-cevap (bilinen ayrı bulgu).
- Tarayıcı açılmadı; bu rapordaki hiçbir iddia görsel/render ölçümüne
  değil, **dist çıktısının metnine ve kaynak koda** dayanır. B1 ve B2'nin
  ekrandaki görünümü, CSS `display` değerleri kaynaktan okunarak
  gerekçelendirilmiştir (canlı doğrulama yapılmadı).
