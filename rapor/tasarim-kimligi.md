# TASARIM KİMLİĞİ — dikiş teşhisi, sıfat önerisi, canlı sayı (B3)

Tarih: 2026-07-28 · Ölçüm aracı: `arac/dikis-teshis.mjs` (yeni) ·
Kanıtlar: `cikti/denetim/dikis/`, `cikti/denetim/sayi/`

**Skill kaydı (CLAUDE.md tasarım kuralı):** `ui-ux-pro-max` iş başlamadan
çağrıldı. Verdiği ilgili kurallar: (a) *Number Formatting* — büyük sayılar
binlik ayraçla, (b) *Motion Sensitivity* — `prefers-reduced-motion`
zorunlu, (c) *Animation* — hareket anlam taşımalı, 150-300 ms mikro,
(d) *Touch* — min 44×44. Uygulananlar: (a) `Intl.NumberFormat('tr-TR')`,
(b) hareket-azaltmada animasyon HİÇ başlamıyor (ölçüldü), (c) sayım
900 ms — mikro-etkileşim değil *anlatı* olduğu için 300 ms'ten uzun
seçildi (sapma bilinçli), (d) kutular 371×187 / 327×173 ölçüldü.
`frontend-design` ve `dataviz` çağrılmadı: yeni görsel yön ya da grafik
üretilmedi, mevcut kimliğin içinde kalındı.

---

## B3.1 — DİKİŞ TEŞHİSİ: kimlik kararı mı, kaza mı?

### Cevap: **KİMLİK KARARI.** Kaza değil.

Üç bağımsız kanıt:

**1) Ritim kasıtlı ve kayıtlı.** Bölüm bölüm ölçüldü (1440 px, görsel
sıraya göre):

| # | Bölüm | Zemin | Ton | Kontrast | pad Ü/A | Başlık |
|---|---|---|---|---|---|---|
| 1 | `v2-hero` | `#08202f` | ● koyu | 16,69 | 88/56 | H1 Cormorant 41,6px w600 sola |
| 2 | `pm-vitrin` | `#061824` | ● koyu | 18,04 | 5,6/0 | — |
| 3 | `v2-kanit` | `#f6fbfd` | ○ aydınlık | 5,52 | **96/96** | H2 Cormorant 36px w600 orta |
| 4 | `v2-hizmetler` | `#f6fbfd` | ○ aydınlık | 5,52 | **96/96** | H2 Cormorant 36px w600 orta |
| 5 | `v2-surec` | `#08202f` | ● koyu | 8,67 | **96/96** | H2 Cormorant 36px w600 orta |
| 6 | `v2-hakkinda` | `#f6fbfd` | ○ aydınlık | 5,52 | **96/96** | H2 Cormorant 36px w600 **sola** |
| 7 | `v2-iletisim` | `#061824` | ● koyu | 9,37 | **96/96** | H2 Cormorant 36px w600 **sola** |
| 8 | `alt` (altbilgi) | `#e9f0f4` | ○ aydınlık | 12,75 | 44,8/22,4 | — |

Desen: **● ● ○ ○ ● ○ ● ○** — düzenli alternasyon. Ve bu desen kodda
YAZILI: `KanitBandi.astro:20-21` → *"ritim dark(hero+sorular) →
light(kanıt+hizmetler) → dark(süreç) olarak korunur"*. Yani geçiş bir
kalıntı değil, sürdürülen bir karar.

**2) Süreklilik ölçüleri geçiyor.** Dikiş "kaza" olsaydı geçişin iki
yakasında tipografi ve ritim ayrışırdı. Ölçüm:

| Ölçü | Sonuç |
|---|---|
| Bölüm dikey ritmi | **8 bölümün 6'sında 96/96 px — sapma sıfır.** Hero (88/56) ve altbilgi (44,8/22,4) kasten farklı; ikisi de "bölüm" değil. |
| H2 tipografisi | **Tüm bölümlerde Cormorant 36 px w600** (mobilde 30 px). Koyu/aydınlık ayrımı YOK. |
| Kicker | Tüm bölümlerde aynı mono ailesi ve harf aralığı |
| Kontrast | Her bölüm AA'yı geçiyor (en dar 5,52) |

**3) İki kırılımda aynı.** 375 px'te de aynı ritim ve aynı tipografi
ölçüldü; tek fark `v2-mobil-sorular` bloğunun CSS `order` ile yer
değiştirmesi — bu da kayıtlı bir karar (S1 korunsun diye, satış
uygulaması U1-U4).

### Yine de üç bulgu

| # | Bulgu | Şiddet | Not |
|---|---|---|---|
| **D1** | **Başlık hizası tutarsız:** kanıt/hizmetler/süreç **ortalı**, hakkında/iletişim **sola**. Aynı `v2-bolum` ailesinde iki farklı hiza. | orta | Kaydedilmiş bir gerekçe BULUNAMADI (**doğrulanmadı**). Bilinçliyse KARARLAR.md'ye yazılmalı; değilse tek kural yeter. **DEĞİŞTİRİLMEDİ** — görsel kimlik kararı, kullanıcıya ait. |
| **D2** | **Aydınlık bölümler koyu bölümlerden belirgin daha düşük kontrastlı** (5,52 · 8,67-18,04). İkisi de AA'yı geçiyor ama aydınlık taraf görsel olarak "daha soluk". | düşük | DESIGN.md "sadelik amaç değildir" ilkesiyle gerilimde. Ölçüm kaydı olarak bırakıldı. |
| **D3** | Geçiş **sert kesme** — degrade/doku/kenar öğesi yok. | bilgi | Bu bir kusur değil; kasıtlı sert kesme de bir dildir. Yumuşatma önerilmedi çünkü ritmin okunaklılığı sert kesmeden geliyor. |

**Kareler:** `cikti/denetim/dikis/md-sinir{1..5}-*.png`,
`mobil-sinir{1..5}-*.png`, `md-tam.png`, `mobil-tam.png`.

### Ölçüm aracının kendi hata kaydı (dürüstlük)
İlk koşumda araç **tüm aydınlık bölümleri KOYU raporladı.** Sebep: palet
`oklch()` kullanıyor, `getComputedStyle` bunu `oklch(0.985 0.006 220)`
olarak döndürüyor ve ilk sürümdeki regex bu üç sayıyı RGB sandı. Düzeltme:
renk çözümü canvas'a taşındı (her CSS renk sözdizimi gerçek piksele
çevriliyor). İkinci hata: sınırlar DOM sırasına göre hesaplanıyordu, mobilde
CSS `order` yüzünden geriye giden sınır listesi çıktı; görsel sıraya göre
sıralama eklendi. Her ikisi de kodda yorum olarak kayıtlı.

---

## B3.2 — MARKA SIFATI ÖNERİSİ · **KULLANICI KARARI, DUR**

### Öneri: **"EMİN"**

Tek sıfat. Diğer adaylar elendi: *güvenilir* (herkes böyle der, ayırt
etmez), *şeffaf* (bir yöntem, sıfat değil), *otoriter* (Türkçede olumsuz
çağrışım), *titiz* (içe dönük — kullanıcının derdi değil).

**Neden "emin":** Sitenin ziyaretçisi maddi bir karar eşiğinde
("kuyu açsam çıkar mı", "ceza geldi ne yapacağım"). O eşikteki insanın
aradığı duygu heyecan ya da sadelik değil, **emin olma**. Site zaten bunu
YAPIYOR ama ADLANDIRMIYOR: her sayı veriden sayılıyor, her kayıt künyeli,
ölçülemeyen "doğrulanmadı" diye işaretleniyor, il eşlemesi tahmine
dayanacağı için durduruldu. "Emin", var olan davranışın adıdır —
sonradan takılan bir etiket değil.

Ayrıca "emin" iki yönlüdür: hem *ziyaretçi emin olur*, hem *site emin
konuşur* (abartmaz, uydurmaz, bilmediğini söyler).

### Sıfat seçilirse üç sonuç

| Alan | Bugün | "Emin" ne gerektirir |
|---|---|---|
| **Tipografi** | Cormorant başlık + Manrope gövde + IBM Plex Mono kicker | **Değişmez.** Serif başlık zaten kurumsal-emin dili taşıyor. Tek gereklilik: **rakamlar lining figür** (B3.3'te uygulandı) — sarkık rakam "emin" değil "el yazması" hissi verir. |
| **Renk** | Lacivert `#08202f` / aydınlık `#f6fbfd` / vurgu `--v2-primary` | **Palet değişmez.** Tek öneri: aydınlık bölümlerin kontrastını (D2, 5,52) koyu tarafa yaklaştırmak — "emin" soluk konuşmaz. Ölçülebilir hedef: gövde metni ≥ 7:1. |
| **Hareket** | 200 ms geçişler, hero sahne döngüsü, yeni sayım animasyonu | **Kural: hareket bir şeyi KANITLAMALI.** Sayım animasyonu buna uyar (rakamın sayıldığını gösterir). Dekoratif hareket eklenmez. Mevcut hiçbir hareket bu kuralı ihlal etmiyor. |

**DUR.** Sıfat seçimi marka kararıdır; hiçbir uygulama yapılmadı.
Onaylarsanız KARARLAR.md'ye kayıt düşülür ve D2 (kontrast) ayrı bir iş
olarak kuyruğa girer.

---

## B3.3 — CANLI SAYI BİLEŞENİ (uygulandı)

`src/components/CanliSayi.astro` + `src/components/CanliSayiMotor.astro`

### Yol açan bulgu: rakamlar eski-stil figürle basılıyordu

Cormorant'ın **varsayılan rakamları oldstyle (text figures)**. Canvas
mürekkep taramasıyla ölçüldü (200 px, taban çizgisine göre üst/alt):

| Rakam | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| üst | 79 | 79 | 82 | 82 | 79 | 84 | **132** | 83 | **114** | 80 |
| alt (sarkma) | 2 | 0 | 0 | **54** | **37** | **54** | 2 | **54** | 2 | **54** |

Yani `3 5 7 9` taban çizgisinin **%27'si kadar aşağı sarkıyor**, `6` ve `8`
diğerlerinden çok daha yüksek. Sonuç: ana sayfadaki **"472" ekranda
"47²" gibi** okunuyordu (kare kanıtı: `cikti/denetim/dikis/md-sinir1-*.png`).
Üstelik yedek font **Georgia lining figür kullanıyor** (ölçüldü: 10 rakamın
onu da 29/0) — font yüklenene kadar rakamların BİÇİMİ değişiyordu.

Sayıların otoritenin görünen yüzü olduğu bir sitede bu ciddi bir kusur.
Düzeltme tek satır: `font-variant-numeric: lining-nums tabular-nums`.
**Cormorant'ın `lnum` özelliği desteklediği kare karşılaştırmasıyla
doğrulandı** (aynı dizgi, iki varyant, farklı çıktı).

### Bileşen

| Özellik | Uygulama |
|---|---|
| Rakam | Cormorant, `clamp(2rem,4vw,2.8rem)` (bant) / `clamp(2.6rem,6vw,4rem)` (geniş) |
| Figür | `lining-nums tabular-nums` + `font-feature-settings` yedeği |
| Biçim | `Intl.NumberFormat('tr-TR')` — binlik ayraç |
| Bağlam | Altında mono birim etiketi + tek satır açıklama |
| Sayım | Görünürlükte **bir kez**, 900 ms, ease-out kübik |
| Hareket azaltma | Animasyon **hiç başlamaz**; sunucudan gelen son değer kalır |
| JS yoksa | Rakam zaten son değeriyle basılı — ilerleyici geliştirme |
| Erişilebilirlik | `aria-live` YOK (her ara değeri okumasın); ekran okuyucu son değeri okur |
| Sayı disiplini | Bileşen sayı ÜRETMEZ; `vitrin.js` / `kapi.js` bekçilerinden gelir |

### Taşınan yerler
1. **Ana sayfa kanıt bandı** — 3 rakam (472 / 419 / 155).
2. **`/nerede-su-cikar/`** — yeni kanıt bandı (472 / 419 / 81), "Cevap
   nasıl üretiliyor?" başlığının altında. **Bant başlık verir, altındaki
   katman listesi şerhli kırılımı verir** (içerik ilkesi: cevap önce,
   dayanak sonra). Şerhler listede kaldı, bantta şerhsiz iddia yok.

### Animasyon KANITI — ölçümle (görüntü kanıt değildir)

| Ölçüm | `no-preference` | `reduce` |
|---|---|---|
| Sunucudan gelen ilk metin | 472 | 472 |
| DOM'a yazılan ara değer sayısı | **55** | **0** |
| Ara değer örnekleri | `13 → 39 → 63 → … → 472` | — |
| Varış değeri | **472** | 472 |
| İkinci görünürlükte adım | **0** (tekrar yok) | 0 |

### Gerileme ölçümleri

| Kapı | Sonuç |
|---|---|
| `gerileme-denetim.mjs` (canlıya karşı, 174 ortak URL) | **GERİLEME 0** · sitemap 174→174, KAYIP 0 · llms 175→175 |
| **md14 G1-G6** (22 ölçüm, taban 28.07) | **🟢 sapma YOK** — taban yenilemesi GEREKMEDİ |
| S1 (G6, 375 ilk-ekran dert-sorusu) | G1-G6 içinde — korundu |
| Konsol hatası (2 sayfa × 2 kırılım) | **0** |
| 375 yatay taşma | **0 px** |
| Yeni bileşen kontrastı | en dar **5,45** · ihlal **0** |
| Dokunma hedefi | 371×187 (1440) · 327×173 (375) — eşik 44×44 |

### AĞIRLIK — kısıt AŞILDI, ölçülüp raporlanıyor

Brief "ağırlık artmaz" diyordu; **animasyonlu sayım istendiği için
ağırlık ARTTI.** Bu iki şart aynı anda sağlanamaz. Ölçülen:

| Sayfa | Ham | gzip |
|---|---|---|
| `index.html` | 47.503 → 48.281 B (**+778**, %1,64) | 10.802 → 11.124 B (**+322**, %2,98) |
| `nerede-su-cikar/index.html` | 58.145 → 60.164 B (**+2.019**, %3,47) | 11.503 → 12.025 B (**+522**, %4,54) |

Artışın kaynağı ayrıştırıldı: **657 B (ham) sayım motoru**, kalanı
işaretleme. İki gereksiz maliyet ölçülüp kaldırıldı:
1. Script `CanliSayi.astro` içindeyken Astro onu **her örnek için ayrı
   gömüyordu** (3 kart = 3 kopya). `CanliSayiMotor.astro`'ya ayrıldı →
   sayfada bir kopya.
2. Gereksiz sarmalayıcı `<div>` kaldırıldı → ~150 B.

Kapı sayfasındaki artışın büyük kısmı (2.019 B ham) **yeni içeriktir**
(üç kart, metinleriyle) — motor değil.

**Karar sizin:** animasyon +322/+522 B gzip'e değmiyorsa motor tek satır
silmeyle kaldırılır; lining figür düzeltmesi ve bileşen bütünleştirmesi
ağırlıksız kalır (o kısım net kazanç).
