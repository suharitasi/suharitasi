# GEO-SCHEMA BRIEF V2 — UYGULAMA LOG RAPORU

*Tarih: 10.09.2026 · Kapsam: Teknik SEO + GEO (AI search) + Schema markup*

## Özet

Brief V2'nin dört maddesi kod tabanına tarandı. Mevcut durumun büyük bölümü
zaten uygulanmıştı; eksikler dört kullanıcı kararıyla kapatıldı. Yapı
(route/template/veri modeli) bozulmadı, hiçbir çalışan harita/UI bileşeni
kırılmadı. Build **0 hata** ile tamamlandı (522 sayfa, sitemap 519).

## Kullanıcı kararları (sorulan 4 kalem)

| Kalem | Karar |
|---|---|
| Hukuki nitelik | **LegalService ekle, GovernmentService atla** (site devlet hizmeti değil) |
| robots direktifleri | **index,follow + googlebot + bingbot** ekle |
| `/rehberler/[kategori]/[slug]` | **Mevcut `/rehberler/[slug]` koru** (yeni rota AÇILMAZ) |
| Dataset license | **publisher + kamu-verisi kaynaklı lisans** ekle |

## Yapılan değişiklikler

### 1. Schema markup — LegalService
- `src/layouts/Sayfa.astro` → `kurum` düğümü `@type` → `["Organization", "LegalService"]`
  + `areaServed: { Country: Türkiye }`. (~518 layout sayfasını kapsar.)
- `src/pages/index.astro` → ana sayfa inline Organization düğümüne aynı iki alan.
- `src/pages/harita.astro` → harita sayfası Organization düğümüne aynı iki alan.
- **GovernmentService BİLİNÇLİ EKLENMEDİ** (uydurma yasağı): site özel bilgi
  portalı, devlet hizmeti değil. Kamusal veri niteliği zaten Dataset + DataCatalog
  düğümleriyle temsil ediliyor.
- `areaServed` LegalService'in hizmet alanını Türkiye olarak işaretler (ulusal kapsam).

### 2. Meta tag / dyn-SEO — robots direktifleri
- `Sayfa.astro`: `robots` prop'u verilmediğinde artık
  `<meta name="robots" content="index, follow">` + `googlebot` + `bingbot`
  basılır. `robots` (noindex) verilirse YALNIZ o direktif basılır — çelişki yok.
- `index.astro` ve `harita.astro` (standalone sayfalar) aynı üç etiketi aldı.
- Noindex pilot sayfalar (`/harita-pilot/`, `/stil-pilot/`) **değişmedi**
  (googlebot/bingbot 0, yalnız noindex).
- Meta Title / Description / OG / canonical zaten dinamikti (Sayfa.astro
  `tarayiciBaslik`, `metaAciklama`, `canonical`) — eksik yok, doğrulandı.

### 3. Programatik SEO / iç linkleme
- **Durum kontrolü:** 25 havza (`/havzalar/[slug]`) + 81 il (`/kuyu-ruhsati/[il]`)
  + rehberler/göller/nehirler/su-kanunu/vaka rotalarının tamamı mevcut ve dinamik.
  Eksik rota yok. `/rehberler/[kategori]/[slug]` kullanıcı kararıyla AÇILMADI
  (çift içerik + 519 URL riski).
- **Çapraz link bloğu:** `havzalar/[slug].astro` sayfa altına "İlgili su mevzuatı"
  bloğu eklendi (→ Su Kanunu ve mevzuat kütüphanesi · → Su hukuku rehberleri).
  "İlişkili Havzalar" zaten `kesisenHavzalar` bloğunda vardı. Yalnız genel
  bağlantılar kullanıldı (uydurma yok); havzaya özgü rehberler hukuk bloğunda kalır.

### 4. Teknik GEO — Dataset yayımlayan/publisher + license
- `harita.astro` Dataset düğümüne `publisher: { @id: #kurum }` eklendi.
- `license` TEK URL uydurulmadan, kaynakların lisans niteliği dürüst metinle
  yazıldı: NASA GRACE/GRACE-FO kamu malı; DSİ/SYGM/EPİAŞ/Resmî Gazete kamuya
  açık resmî kaynak (kaynak başına ayrı açık lisans etiketi doğrulanmamış).
- `spatialCoverage` + `variableMeasured` zaten mevcuttu (dokunulmadı).
- **Canvas/WebGL okunabilirliği:** /harita/ paneli (HavzaPaneli) 25 havza
  kartını zaten **statik semantik HTML** olarak sunuyor (JS kapalıyken de DOM'da).
  Ayrıca gizli döküm gerektirmedi — veri zaten LLM-crawler okur durumda.

## Doğrulama

- **Build:** `npm run build` → `522 page(s) built` · 0 hata · sitemap 519 · llms.txt 519.
- **JSON-LD validasyonu** (özel script, `dist/` taraması):
  `JSON-LD blok: 520 · JSON parse hatası: 0 · @context bozuk: 0 · @type yok: 0`.
- **Yerinde doğrulama:** LegalService 520 dosyada · robots index,follow + googlebot +
  bingbot örnek sayfalarda 1'er · harita Dataset'inde publisher+license mevcut ·
  havza sayfasında "İlgili su mevzuatı" bloğu mevcut · noindex pilotlar değişmemiş.

## Dokunulmayanlar (bilinçli)

- `/rehberler/[kategori]/[slug]` rotası (kullanıcı kararı).
- GovernmentService şema tipi (uydurma yasağı).
- `arsiv.astro` / `kapatma-kaydi.astro` Dataset lisansları (kaynak bazlı,
  mevcut "bilinmiyor" kararı korundu).
- Harita/UI/veri dosyaları, DESIGN.md kimliği.
