# DESIGN.md — suharitasi.com TASARIM ANAYASASI

Bu belge bağlayıcıdır. Tasarım kararı bu belgeyle çelişiyorsa belge kazanır.
Sürüm: 2.0 (2026-07-16) — tek anayasa, tek el, tek zanaat: sitenin HER
sayfası aynı dili konuşur; sahne ayrı bir dil KONUŞMAZ, ailenin en görkemli
üyesidir.

## 1. Ruh

İtkan — kusursuz işçilik, cesur sahne. Hedef ödül-üstü (Awwwards) seviye:
zengin animasyon, sinematik derinlik ve imza etkileşimler İSTENİR; sadelik
amaç değildir. Yasak olan kalabalık değil, özensizliktir: her öğe bilinçli,
her hareket anlamlı, hiçbir etkileşim "default" bırakılmış olamaz.

## 2. Konsept: Derin su + aydınlık atlas

İki dünya, tek aile:
- **Koyu dünya** (landing, menü katmanı, deneyim sahneleri): gece denizinin
  içinden bakış. Yukarısı görece aydınlık, aşağı indikçe koyulaşan katmanlar.
  Çizgiler yatay, uzun, yumuşak dalga eğrileri; keskin tepe yok.
- **Aydınlık dünya** (içerik/iş sayfaları): koyu suyun üstünde yüzen atlas
  parçası. Krem kâğıt, mürekkep metin, su-yeşili çizgi dili.

## 3. İki hız sınıfı (kesin sınır)

| Sınıf | Sayfalar | Rejim |
|---|---|---|
| **Deneyim** | `/` (landing), `/harita/`, `/deneyim-pilot/`, tam ekran menü katmanı | Ağır/büyüleyici serbest: WebGL, çok katmanlı koreografi. Lighthouse hedefi YOK; tek şart akıcılık (takılan sahne başarısızlıktır) + reduced-motion'da statik ayakta durur. |
| **İş** | Diğer HER sayfa (rehber, havza, il, araç, indeks, hakkında, su-kanunu) | Hafif: çalışma anı JS ~0 (yalnız araç sayfasında gömülü-veri paneli serbest), Lighthouse ≥ 90, animasyon "az ve anlamlı". |

Bir sayfanın sınıfı değişecekse önce bu tablo değişir.

## 4. Palet

### Koyu dünya
| Rol | Hex |
|---|---|
| Zemin (derin deniz) | `#04121F` |
| Yükselti / panel | `#071D2E` |
| Akış çizgileri — sönük / canlanan | `#0E3247` / `#1E5A78` |
| Ana vurgu (akuamarin) | `#4FC3D0` |
| İkincil ışıma (köpük) | `#A8DDE0` |
| Metin / soluk metin | `#DCE9ED` / `#6C8A96` |
| Bakır | `#C08A4F` — YALNIZ landing ayraç çizgileri. |

### Aydınlık dünya
| Rol | Hex |
|---|---|
| Zemin / kart zemini | `#F3EEE2` / `#E8EDE6` |
| Metin / soluk metin | `#232E2B` / `#5C6B66` |
| Bağlantı | `#2F5D59` |
| Dekoratif su çizgisi | `#5E8A87` |
| **Derin akuamarin (vurgu)** | `#0F7A8A` — krem üzerinde AA (≈4.6:1) |
| Kehribar | `#D9A05B` — küçük işaretler; metin rengi olarak yasak |

**Vurgu kuralı (2.0 değişikliği):** Sitenin altını AKUAMARİNDİR ve iki
dünyada da konuşur: koyu zeminde `#4FC3D0`, aydınlık zeminde `#0F7A8A`
(aynı ailenin derin tonu — parlak tonun krem üstünde kontrastı yetmez,
başka renge kaçmak kimliği böler). Eski "akuamarin aydınlık sayfada
kullanılmaz" kuralı KALKTI; yerine bu çift-ton kuralı geçti. Mevcut
bileşenlerdeki `#4FC3D0` kenarlar dekoratif hairline olarak kalabilir;
METİN olarak akuamarin aydınlık zeminde daima `#0F7A8A`.

### Harita adası (istisna — aynen korunur)
Sayfa koyu kalır, harita alanı aydınlık hipsometrik atlas estetiğidir
(adaçayı `#A9C3B4`, yeşil `#7C9B6E`, hardal `#C7B27B`, kahve
`#8A6B47`/`#6E5238`; kart krem `#F3EEE2`). Harita içinde su öğeleri
`#5E8A87`, vurgu kehribar `#D9A05B`; akuamarin ışıma haritanın değil
sitenin dilidir.

## 5. Tipografi — ÜÇ FONT HİYERARŞİSİ

| Katman | Font | Görev |
|---|---|---|
| Display | **Cormorant** 400–500 (+italik) | Başlıklar, vurgu kelimeleri. KORUNDU: iki dünyada da oturmuş kimlik. |
| Gövde | **Manrope** 400–600 | Paragraf, arayüz metni. Satır 1.75, ölçü ≤ 68ch. |
| **Etiket (YENİ)** | **IBM Plex Mono** 400–500 | Kicker, meta, künye, tablo başlığı, veri bandı rakam etiketleri. |

Mono gerekçesi: IBM Plex Mono — latin-ext tam (Türkçe zorunlu), cetvel/
künye karakteri sitenin "resmî veri + hukuk" omurgasıyla örtüşür, Manrope
ile x-yüksekliği uyumlu. Alternatif JetBrains Mono daha "kod editörü"
kokar; elendi. Üçüncü font yalnız etiket boyutlarında (0.62–0.8rem)
kullanılır; gövde metni asla mono olmaz.

## 6. Kicker sistemi (bölüm imzası)

Her önemli bölüm üçlü imza taşır:

```
[KICKER]      mono, uppercase, letter-spacing .22em, akuamarin
              (koyuda #4FC3D0, aydınlıkta #0F7A8A), önünde 1.6rem
              akuamarin hairline
[kicker-sub]  opsiyonel; mono, soluk metin rengi, küçük (0.68rem)
[Başlık]      Cormorant; başlıkta EN FAZLA BİR kelime italik + akuamarin
              vurgu ("suyun *nabzı*") — vurgu kelimesi anlam taşıyan
              kelimedir, rastgele seçilmez
```

Kicker metni İÇERİKTEN gelir (bölümün türü/numarası); süs metni uydurulmaz.

## 7. Kart kimlik sistemi (altı ton ailesi)

**Karar: aydınlık dünyada DÜZ ton + tür-renkli detay; gradyan yok.**
Gerekçe: atlas estetiği kâğıt düzlüğüne dayanır; gradyan kart "SaaS
vitrini" kokar ve iki dünya ayrımını bulandırır. Gradyan yalnız koyu
dünyada (deneyim/menü zeminleri) yaşar.

Kart kimliği üç yerden okunur: üst hairline (2px, tür rengi) + kicker
rengi + hover'da zeminin türe boyanmış çok açık tonu (%6-8 doygunluk).

| Aile | Ton | İçerik türü |
|---|---|---|
| Derin su | `#0E3247` | Su Kanunu / mevzuat kütüphanesi |
| Akuamarin | `#0F7A8A` | Canlı veri (baraj, GRACE, araç, veri bandı) |
| Adaçayı | `#6E8F7C` | Havzalar |
| Su yeşili | `#2F5D59` | Süreç rehberleri |
| Kehribar | `#B9853F` | Uyuşmazlık rehberleri |
| Mürekkep | `#232E2B` | Kurumsal (hakkında, künye, yazar) |

## 8. Kararlaştırılmışlık — tanımlı etkileşim sözlüğü

"Default" bırakılmış tek etkileşim olamaz. Ölçüler:

**Easing (üç eğri, başkası kullanılmaz):**
- `--e-su:    cubic-bezier(0.16, 1, 0.3, 1)`  — imza çıkış (hover, panel, reveal)
- `--e-dalga: cubic-bezier(0.33, 1, 0.68, 1)` — giriş koreografisi
- `--e-akis:  cubic-bezier(0.4, 0, 0.2, 1)`   — renk/opaklık geçişleri

**Süre ölçeği:** 120ms (mikro: renk, alt çizgi) · 240ms (standart: hover
kalkışı) · 420ms (panel/katman) · 700ms+ (yalnız deneyim sınıfı).

**Durumlar:**
- Link hover: renk → vurgu, 120ms `--e-akis`; gövde linklerinde alt çizgi
  kalınlaşması (1px→2px).
- Kart hover: `translateY(-2px)` 240ms `--e-su` + zemin tür tonu + üst
  hairline parlar. Gölge YOK (kâğıt dünyası gölgeyle değil tonla konuşur).
- Buton/kart press (`:active`): `translateY(0) scale(0.985)` 120ms — basış
  hissedilir.
- `:focus-visible`: 2px akuamarin dış çerçeve, offset 3px — İKİ dünyada da
  aynı; asla `outline: none` bırakılmaz.
- Form odağı: kenar akuamarin + `box-shadow: 0 0 0 3px` vurgu %18 (glow).
- Menü linki hover: `translateX(7px)` 240ms `--e-su` (mevcut imza korunur).

## 9. Sayı / veri bandı dili

Gerçek verinin (baraj doluluk, GRACE, havza/il sayıları) sunumu:
- Rakam: Cormorant 500 büyük punto VEYA mono — ikisi de `tabular-nums`;
  bir bantta tek seçim.
- Etiket: mono uppercase, soluk renk; altında kaynak+tarih künyesi
  (mono, 0.68rem) — künyesiz sayı bandı yayınlanmaz.
- Sayaç animasyonu: yalnız İLK görünümde, 700ms `--e-su`, yalnız gerçek
  veriyle; `prefers-reduced-motion`'da anında yazılır. İş sayfalarında
  sayaç build-time statik de olabilir (JS bütçesi önce gelir).
- Uydurma yasağı burada da mutlak: bandın her sayısı kaynaklı.

## 10. Animasyon felsefesi — iki rejim, tek anayasa

- **İş sayfaları: "az ve anlamlı".** Scroll-reveal (mevcut), hover/focus
  sözlüğü, en fazla bir sayaç bandı. Süs animasyonu eklenmez; var olan
  her hareket bir bilgiyi sahneler.
- **Deneyim sayfaları: "büyüleyici ama akıcı".** Katmanlı koreografi,
  WebGL, imleç-su bağı serbest; şart akıcılık ve reduced-motion'da
  eksiksiz statik kompozisyon.
- Her iki rejimde `prefers-reduced-motion: reduce` → geçiş/koreografi
  kapanır, İÇERİK ASLA GİZLİ KALMAZ.

## 11. Başarısızlık kriterleri — "bunlar varsa geri git"

Bir faz, aşağıdakilerden herhangi biri doğruysa BİTMEMİŞTİR:
1. Kartlar donuk: hover'da hiçbir şey olmuyor ya da default görünüm var.
2. Fontlar düşmüş: mono/serif yüklenmeden fallback ile ekran görüntüsü
   alınmış; `document.fonts.ready` beklenmeden kanıt üretilmiş.
3. CTA/sonraki adım kaybolmuş: sayfanın devam yolu ilk bakışta görünmüyor.
4. Menü takılıyor ya da koreografi kesik.
5. Bir bölüm/tablo görünmüyor (reveal kilitli kalmış, print boş basıyor).
6. Kicker'sız önemli bölüm ya da vurgu kelimesiz ana başlık kalmış.
7. Aydınlık zeminde parlak akuamarin (#4FC3D0) METİN olarak kullanılmış
   (kontrast ihlali).
8. Etkileşimlerden herhangi biri easing/süre sözlüğü dışında.
9. İş sayfası Lighthouse < 90'a düşmüş ya da çalışma anı JS bütçesi aşılmış.
10. Emoji, damla ikonu, royal-blue, keskin tepe konturu görünmüş.
11. Veri bandında künyesiz sayı ya da uydurulmuş değer var.

## 12. Kırmızı çizgiler (değişmedi)

- Su damlası ikonu yok. Emoji yok. Arayüz dili Türkçe.
- Klişe "kurumsal su firması mavisi" (parlak royal blue) yok.
- Dağ silüeti, keskin tepeli kontur, topografya klişesi yok.
- Bakır yalnız landing ayracı. Kehribar metin rengi olamaz.
- Veri dürüstlüğü: boş alan "veri yok (tarih)" — uydurma değer yazılmaz.
- Kopyalanma direnci ilkesi (CLAUDE.md) her yeni yüzeyde geçerli.
