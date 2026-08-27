# DENETİM ÖZETİ — suharitasi.com tam denetimi (27.08.2026)

On boyut denetlendi. Bu belge kapanış özetidir; kanıtlar ayrı dosyalarda:

| Dosya | İçerik |
|---|---|
| `26-08-denetim-SINIFLANDIRMA.md` | Tek liste: her bulgu + sınıf + gerekçe + etki; Faz 2 uygulama kaydı |
| `26-08-denetim-KARARLAR-BEKLEYEN.md` | Kullanıcıya giden karar listesi (devralınan 3 + 37 kalem) |
| `26-08-denetim-dogrulama.md` | Bağımsız doğrulamalar D1-D18 (üç bulgu çürütüldü) |
| `26-08-denetim-15a-uydurma.md` | Uydurma denetimi (11 bulgu) |
| `26-08-denetim-15be-dil.md` | Dil, ölü bilgi, damga, öz-cevap (14 bulgu) |
| `26-08-denetim-18-geo.md` | GEO derin analiz (27 bulgu) |
| `26-08-denetim-DURUM.md` | Kesinti sonrası devralma raporu + EK-A (ilk turun bulguları) |

---

## 1. BOYUT BAŞINA BULGU VE SONUÇ DAĞILIMI

Toplam **60 bulgu**: **7 ONARILDI** · **37 KARAR DOSYASINA YAZILDI** ·
**16 REDDEDİLDİ (gerekçeli)**. "Bekliyor" durumunda bulgu **yok**.

| Boyut | Bulgu | Onarıldı | Karar | Reddedildi |
|---|---:|---:|---:|---:|
| 1.1 Mimari ve kod | 12 | 2 (U1, U2) | 6 (K25, K26, K27, K28, K24, K4) | 4 (R7, R8, R14, R15) |
| 1.2 Tasarım / DESIGN.md | 9 | 1 (U6) | 6 (K30-K34, K4) | 2 (R1, R2) |
| 1.3 Erişilebilirlik | 2 | 1 (U7) | 1 (K23) | — |
| 1.4 Performans | 1 | — | — | 1 (K37 — kendi ölçüm aracımın kusuru, geri çekildi) |
| 1.5 İçerik ve dil | 14 | — | 13 (K1-K3, K7-K10, K12-K16, K21) | 3 (R9, R10, R11) |
| 1.6 Veri bütünlüğü | 6 | 3 (U3, U4, U5) | 1 (K7 ile birleşti) | 2 (R13, R14) |
| 1.7 SEO | 8 | — | 2 (K11, K38) | 6 (R4, R5, R6, R12 + ölü link 0) |
| 1.8 GEO | 6 | — | 6 (K5, K6, K17-K20) | — |
| 1.9 Güvenlik ve başlıklar | 2 | — | 2 (K35, K36) | — |
| 1.10 Hukuki yüzey | 1 | — | 1 (K29 — yalnız tespit) | — |

(Bir bulgu birden çok boyuta değdiğinde ana boyutunda sayıldı; bu yüzden
satır toplamları 60'ı birebir vermez.)

---

## 2. EN YÜKSEK ETKİLİ BEŞ BULGU VE NE YAPILDI

### 1) `/havza-riski/` puanının %40'ı her havzada aynı sabit → **KARAR (K1)**
Bileşik risk puanının "Baraj Doluluk (%25)" bileşeni **iki ayrı kod
hatası** yüzünden hiç okunmuyor (`havza-risk.js:42` havza adı eşleşmesi
**0/25**; `:54` `b.doluluk` alanı kayıtta yok), "Tahsis Durumu (%15)"
bileşeni de veri boşluğu yüzünden nötr. Yayınlanmış kanıt: 25 havzanın
25'inde `baraj doluluk etkisi: 50/100`. Sayfa bunları "6 göstergeden
hesaplanan" diye ilan ediyor ve `/hakkinda/`'daki *"tahmin veya ara değer
üretilmez"* taahhüdüyle doğrudan çelişiyor. Sayfa sitemap'te,
indekslenebilir, `llms.txt`'te ve 521 sayfadan link alıyor.
**Yapıldı:** bağımsız doğrulandı (D11), üç seçenekli kararla dosyaya
yazıldı; onarım yayımlanan sayıları değiştireceği için uygulanmadı.

### 2) `/ilce-sorgu/` veri karşılığı olmayan çıktı üretiyor → **KARAR (K7)**
Sentetik ilçe morfolojisi (`±%15 varyasyonla türetilmiş`) sayfada
**"Copernicus GLO-90 DEM"** künyesiyle basılıyor — şerh eksik değil, ters
yönde. Ayrıca depoda karşılığı olmayan "akifer türü" ve "su doygunluk
derinliği" üretiliyor, bileşik indeks "Su Çıkma Olasılığı %" diye
sunuluyor, "AHP"/"TWI"/"JRC" yöntem etiketleri dayanaksız (kaynak dosyalar
"hesaplanmadı" / "islenmedi" diyor).
**Yapıldı:** karar dosyasına üç seçenekle yazıldı; ayrıca `KAYNAKLAR.md`'ye
verinin **sentetik olduğu** kayda geçirildi (U4).

### 3) 519 sayfada boşluk yutması → **KARAR (K2)**
Site geneli alt bilgide "Av. Serdar Arslan**—Arslan** Hukuk Bürosu";
`/hakkinda/`'da üç yapışma bir arada. Kök neden 11 kaynak dosyada izlendi.
Kusur sitenin künyesinde — güven sinyalinin tam ortasında.
**Yapıldı:** doğrulandı (519 sayfa ölçüldü), karar dosyasına yazıldı.
Anlam değişmediği için "onayla-ve-uygula" grubunda.

### 4) 12,6 MB referanssız yayın varlığı → **~10 MB'ı ONARILDI (U1)**
6 `.webm` (9,0 MB) hiçbir HTML/JS/CSS tarafından istenmiyor;
`hedef-hero.webp` (992 KB) v2 ile **bit-eşit kopya**; `su-sim.js`
hiçbir sayfadan yüklenmiyor ama her build'de küçültülüyordu.
**Yapıldı:** referanssızlık kesin kanıtlandı (dinamik uzantı üretimi
falsifiye edildi), silindi. **dist 45 MB → 35 MB.** Kalan 1,7 MB
(`public/hedef/*`) bilinçli olarak K28'e bırakıldı — tek tüketicisi
`HedefSahne.astro`, ikisinin akıbeti birlikte kararlaştırılmalı.

### 5) 76 sayfada kardeş il bağlantıları etiketsiz → **KARAR (K3)**
`[il].astro:201` `x.ad` okuyor, veri nesnesinde alan adı `il`. "Aynı DSİ
bölgesindeki diğer iller hangileri?" sorusunun cevabı `→ →` olarak
çıkıyor. Üç zarar bir arada: H2 cevapsız, bağlantı metni anlamsız
(WCAG 2.4.4), il↔il iç bağlantı ağı değersiz. Düzeltme tek sözcük.

---

## 3. ÖLÇÜLEMEYENLER — sebebiyle

| Ne | Neden ölçülemedi |
|---|---|
| **Gerçek-kullanıcı Core Web Vitals (CrUX)** | `crux_current` Google API anahtarı istiyor (`CRUX_API_KEY` yok). Hesap açma/ücretli adım yasak → ölçülemedi |
| **PageSpeed Insights saha verisi** | API günlük kotası dolu (**HTTP 429**) → ölçülemedi |
| **INP (Interaction to Next Paint)** | Saha metriğidir, laboratuvarda ölçülmez. TBT vekil olarak **kullanılmadı** (vekil kriter yasağı) |
| **Analitiğin fiilen çalışıp çalışmadığı** | Beacon bu sunucudan görünmüyor — ama projenin kendi 29.07 kaydı bu ölçümün **kanıt olmadığını** yazmış (CDN PoP farkı). Cloudflare paneli / Web Analytics API gerekiyor |
| **Mevzuat madde ve kanun numaralarının doğruluğu** | Çevrimdışı denetim; hiçbir madde/kanun numarası doğrulanmadı — **"doğrulanmadı (27.08.2026)"** olarak işaretlendi |
| **Ruhsatsız kuyu cezalarının güncel tutarı** | Yeniden değerleme oranıyla hesaplanmış güncel tutar doğrulanamadı → **rakam YAZILMADI** (uydurma yasağı) |
| **Gerçek AI motorlarında görünürlük** | GEO analizi sayfa yapısını ölçer; ChatGPT/Perplexity/Gemini'de fiilî alıntılanma test edilmedi |
| **Tarayıcı çalışma zamanı erişilebilirliği** | Odak sırası, klavye tuzağı, ekran okuyucu okuma sırası, `prefers-reduced-motion`'ın fiilî davranışı — statik analizle ölçülemez |
| **`data/arsiv/` 926 anlık görüntü, `kaynak/dsi-arsiv/` 233 xls, `veri/ham/nhyp/` 84 belge** | Örneklem + altın örnek (23/23 🟢) ile geçildi; kaynak→JSON adımı tek tek denetlenmedi |

---

## 4. DENETİMİN KAPSAMADIĞI ALANLAR (dürüstlük bölümü)

1. **`arslanhukuk.tr` ve `bist-*` dizinleri** — brief gereği kesin yasak;
   hiç açılmadı. Cron envanterindeki 4 satır onlara ait, ölçülmedi.
2. **Sunucu/altyapı güvenliği** — SSH, firewall, kullanıcı yetkileri, açık
   portlar denetlenmedi. Denetim depo + yayınlanan site yüzeyiyle sınırlı.
3. **Cloudflare panel yapılandırması** — WAF kuralları, rate-limit, bot
   yönetimi, Crawler Hints, deploy komutu panelde tanımlı ve okunamadı.
   `npm ci` uyumluluğu izole kopyada test edilerek dolaylı doğrulandı.
4. **Git geçmişinin tamamı** — sızıntı taraması bilinen sır değerleriyle
   `git log -S` üzerinden yapıldı; her blob tek tek taranmadı.
5. **İçeriğin hukuki doğruluğu** — bu bir hukuk denetimi değildir. Mevzuat
   atıflarının *kaynak zinciri* denetlendi, *hukuki isabeti* denetlenmedi.
   [SERDAR-HUKUK] etiketli kalemler bu yüzden karar dosyasında.
6. **Veri değerlerinin gerçekliği** — DSİ/EPİAŞ/GRACE sayılarının kaynakla
   birebir doğruluğu altın örnek sistemine (23/23 🟢) devredildi; bu
   denetim künye/şerh/sunum katmanını ölçtü.
7. **Tasarımın estetik yargısı** — DESIGN.md'ye *uyum* ölçüldü; "güzel mi"
   sorusu denetim konusu değil. GPU'suz sunucuda görsel kalite kanıtı
   zaten alınamaz (CLAUDE.md GPU kuralı).
8. **Yük/dayanıklılık testi** — eşzamanlı ziyaretçi, CDN önbellek
   davranışı, kaynak tükenme senaryoları denetlenmedi.

---

## 5. ÖLÇÜM DÜRÜSTLÜĞÜ — bu denetimde yakalanan kendi hatalarım

Denetim boyunca **dört** ölçüm hatası kendi kontrollerimle yakalandı ve
düzeltildi. Üçü rapora yanlış bulgu olarak girmeden yakalandı; biri
(K37) bulgu olarak yazıldıktan sonra çürütülüp geri çekildi:

1. **Karşılaştırma aracı yapıyı metin sanıyordu.** İlk bit-eşitlik aracı
   HTML etiketlerini `\x01` ayracıyla değiştiriyordu; eklediğim `<main>`
   "görünür metin farkı" gibi göründü. Araç saf-metin ve yapı olarak
   ikiye ayrıldı; sonuç: **metin farkı 0, yapı farkı yalnız `<main>`**.
2. **Performans turunda yanlış URL.** İl şablonu için
   `/nerede-su-cikar/adana/` kullanılmıştı — o rota **404**. Araç bunu
   "ÖLÇÜLEMEDİ" diye dürüstçe raporladı (null-güvenli medyan), ölçüm
   doğru URL ile (`/kuyu-ruhsati/adana/`) tekrarlandı.
3. **Performans turu projenin kendi protokolünü ihlal ediyordu (en ağır
   hatam).** Betiğim tek Chrome örneğini tüm turlarda paylaşıyordu; oysa
   `site-saglik.mjs:1117` açıkça *"PARALEL YASAK: her ölçüm kendi
   tarayıcısını açar ve kapatır"* diyor. Sonuç: ana sayfa mobil 81
   ölçülüp "sitenin en yavaş şablonu" diye **K37 bulgusu açıldı**.
   md9'un aynı gün 94 ölçmesi şüphe doğurdu; doğru protokolle tekrar
   ölçüm **medyan 90 · LCP 2932 ms** verdi — diğer şablonlarla aynı bant.
   **K37 geri çekildi**, D16 tablosu geçersiz ilan edildi, 1.4 boyutu
   md9'a devredildi (14/14 sayfa eşiği geçiyor).
4. **Bekleme döngüleri kendilerini sayıyordu.** `pgrep -f "dis-link-tam"`
   bekçilerin kendi komut satırlarını eşleştiriyordu; döngüler hiç
   çıkmayacaktı. Fark edilip durduruldu, çıktı dosyasına bakan doğru
   bekleme kuruldu.

Ayrıca **iki bulgu ölçümle çürütüldü** ve rapordan düşürüldü:
- "CanliSayi palet dışına düşüyor" → `--v2-*` tokenları paylaşılan CSS
  chunk'ında `:root` altında tanımlı; fallback'ler devreye girmiyor (D2).
- "`harita.astro` literalleri token'a çekilsin" → o sayfada `--krem` ve
  `--murekkep-900` **tanımlı değil**; öneri uygulansa renk kaybolurdu (D3).

Ve bir bulgu **kasten açılmadı**: "analitik çalışmıyor" — projenin kendi
29.07 kaydı bu ölçümün tek vantaj noktasından kanıt olmadığını yazmış (D8).

---

## 6. KAPANIŞ KANITLARI

| Bitti-tanımı maddesi | Sonuç |
|---|---|
| Kapı (dizin · remote · node) | ✓ `/home/suha/projeler/suharitasi` · `suharitasi/suharitasi` · v22.23.2 |
| Taban dizini NOT.txt'li duruyor | ✓ `/home/suha/denetim-taban/` · commit 22e3e86 · Astro 7.2.7 |
| 1.5'in beş alt kalemi (a-e) | ✓ `26-08-denetim-15a-uydurma.md` (a) + `26-08-denetim-15be-dil.md` (b-e) |
| 1.4 / 1.7 / 1.8 eksik turları | ✓ 1.7 tam tarama (1037/1037, ölü 0) · 1.8 derin analiz (27 bulgu) · **1.4 kendi aracımın protokol hatası yüzünden geçersiz ilan edildi, md9'a devredildi** |
| Her bulgu sınıflandırıldı, "bekliyor" yok | ✓ 7 onarıldı · 37 karar · 16 reddedildi |
| Faz 2'de her onarımın önce/sonra ölçümü | ✓ `26-08-denetim-SINIFLANDIRMA.md` §F tablosu |
| 2b bit-eşitlik her onarım grubunda | ✓ görünür metin 0 fark · JSON-LD 0 fark (523 sayfa) |
| Sağlık `--tam` taban gerilemesi 0 | ✓ taban 🔴0/🟡1/🟢22 → Faz 3 🔴0/🟡1/🟢22 |
| Karar dosyası tam, devralınan 3 kalem başında | ✓ `26-08-denetim-KARARLAR-BEKLEYEN.md` §0 |
| SIRADAKILER'de denetim bulgusu yok | ✓ dosya hiç değiştirilmedi (`git diff` boş) |
| Faz commit'leri push'landı | ✓ 7746ed8 (Faz 0) · c394420 (Faz 1) · 4a6ad62 (Faz 2) |
| Hero değişikliğine dokunulmadı | ✓ çalışma ağacında duruyor, commit edilmedi |

## 7. GERİ ALMA BLOKLARI (faz başına)

**Faz 0 — `7746ed8`** (yalnız karar dosyası iskeleti)
```
git revert 7746ed8
```

**Faz 1 — `c394420`** (yalnız rapor dosyaları; kod/veri değişikliği yok)
```
git revert c394420
```

**Faz 2 — `4a6ad62`** (7 onarım + raporlar)
```
git revert 4a6ad62 && npm run build && git push origin main
```
Tek tek geri alma:
```
# U1 silinen varlıklar (git izli — kayıp yok)
git checkout c394420 -- public/deneyim/video public/hedef-hero.webp public/s/su-sim.js
# U2 esbuild bildirimi
git checkout c394420 -- package.json package-lock.json
# U6 token · U7 main
git checkout c394420 -- src/pages/ilce-sorgu.astro src/pages/havza-riski.astro src/pages/index.astro
# U3/U4/U5 künye kayıtları
git checkout c394420 -- KAYNAKLAR.md
```
Her geri almadan sonra `npm run build` + `node arac/site-saglik.mjs --tam`.
