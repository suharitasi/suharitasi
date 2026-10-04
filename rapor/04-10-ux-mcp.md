# 04.10.2026 — UX SADELEŞTİRME · KVKK GÜNCELLEMESİ · MCP TRAFİK RAPORU

**Sınıf:** BÜYÜK İŞ · **Brief:** `cikti/brief/2026-10-04T1735-ux-kvkk-mcp.md`
(brief-denetci: TEMİZ) · **Kaynak:** sahip talimatı (CMO/UX/SEO turu).

---

## 1. UX SADELEŞTİRME — EKLENEN SADE KARŞILIKLAR

Teknik veri, yöntem adı ve JSON-LD alanları **SİLİNMEDİ**; yanlarına son
kullanıcının okuyacağı meal eklendi. `measurementTechnique` birebir korundu
(build çıktısından doğrulandı).

### 1.1 `/tahmin/` — tablo başlığı altı açıklamalar (8 adet `.th-meal`)
| Teknik başlık | Eklenen sade karşılık |
|---|---|
| Son ölçüm | en güncel aylık değer |
| Eğilim (cm/ay) | su seviyesi ayda kaç cm değişiyor |
| 6 ay sonra (tahmin) | beklenen değer, olası bantla |
| Anlamlı | bu eğilim tesadüf mü? |
| Son (%) | bugünkü ortalama doluluk |
| Eğilim (puan/gün) | doluluk günde kaç puan değişiyor |
| 30. gün (tahmin) | bir ay sonra beklenen doluluk |
| 80% aralık | olası alt–üst sınır |

### 1.2 `/tahmin/` — "Terimlerin sade karşılığı" blokı (4 terim)
- **GRACE (cm):** NASA'nın yerçekimi uydusu; yeraltı suyu + yüzey suyu +
  toprak nemi + karın toplamındaki aylık değişimi ölçer. Değer, 2004–2009
  ortalamasına göre **değişimdir**; toplam su miktarı değildir.
- **OLS trend (cm/ay · puan/gün):** Geçmiş değerlere en uygun düz çizgi.
  "Ayda kaç cm" ya da "günde kaç puan" değiştiğini söyler; negatif = azalış.
- **Mann-Kendall (MK):** Bu eğilimin tesadüfi dalgalanma değil gerçek bir yön
  olduğunu sınayan istatistiksel test. "Anlamlı: evet" = tesadüf olma
  olasılığı düşük.
- **Tahmin aralığı (80%/95%):** Modelin öngördüğü olası alt–üst bant;
  gerçekleşme garanti edilmez.

### 1.3 Diğer yüzeyler
- `/tahmin/` iki bölüm notuna "**Yani:** …" cümlesi eklendi (azalış mı,
  artış mı + değişim tesadüf mü; bir ay sonra doluluk hangi bantta).
- `SayfaBasi` özetine "(terimlerin sade karşılığı aşağıda)" işaretçisi.
- `/api-dokumantasyonu/` bilimsel ayrım paragrafına OLS+Mann-Kendall sade
  parantezi: "mevsimlik dalgalanmayı ayırıp düz bir eğilim çizgisi çıkarma
  ve bu eğilimin tesadüf olup olmadığını sınama".
- Tipografi: `.th-meal` tablo başlığının mono-büyük-harf dilini bozmaz
  (normal-case sans, 0,66rem, alt satır); sözlük bloğu serif h2 + 2 kolon dl
  (mobilde tek kolon).

**Kanıt:** build EXIT 0 · `.th-meal` 8 · `dt/dd` 4/4 · `measurementTechnique`
birebir · yerel `site-saglik --hizli` 8-mobil taşma 0 · 5-konsol 0 ·
14-gorsel sapma 0.

## 2. KVKK AYDINLATMA GÜNCELLEMESİ

`/gizlilik/` metnine sahibin verdiği ibare **birebir** eklendi (madde 2,
yeni madde işareti):

> Sistem güvenliği ve API kötüye kullanımının önlenmesi amacıyla, ziyaretçi
> erişim günlükleri (IP adresi, erişilen uç nokta ve HTTP durum kodları) 30
> gün süreyle kayıt altına alınmaktadır.

Ek uyum düzeltmeleri:
- **ÖZ-CEVAP** fiilî pratikle hizalandı ("yalnızca gönderdiğiniz bilgiler"
  ifadesi artık erişim günlüğünü de anıyor; ~255 karakter).
- **Madde 4 (saklama):** süre listesine "teknik erişim günlükleri için
  **30 gün**" eklendi.
- "Çerezsiz ölçüm" maddesiyle çelişki yok: o madde temas tıklama
  sayaçlarını (IP'siz) tarif eder; erişim günlüğü ayrı madde.

**Kanıt:** `dist/gizlilik/index.html` içinde ibare 1 kez birebir grep'lendi;
`30 günlük teknik erişim günlükleri` özette mevcut.

## 3. GOOGLE MCP — ORGANİK TRAFİK VE İNDEKS ANALİZİ

**Kaynak:** GSC MCP (`webmasters.*`), mülk `sc-domain:suharitasi.com`
(siteFullUser). Dönem: **2026-09-04 → 2026-10-01** (önceki: 08-07 → 09-03).
GA4 Admin API kapalı (403) → oturum/ziyaretçi akışı **ölçülemedi**.

### 3.1 28 günlük özet (GSC `gsc_site_snapshot`)
| Metrik | Güncel | Önceki | Değişim |
|---|---|---|---|
| Tıklama | **329** | 179 | **+150 (+%83,8)** |
| Gösterim | **25.984** | 11.368 | **+%128,6** |
| CTR | %1,27 | %1,57 | −%19,6 (gösterim patlaması seyreltti) |
| Ort. pozisyon | **8,93** | 9,51 | **−0,58 (iyileşme)** |

### 3.2 Günlük akış (GSC `gsc_search_analytics`, boyut `date`)
- Eylül başı: 5–8 tıklama/gün, pozisyon ~10.
- Eylül sonu: **14–21 tıklama/gün**, pozisyon ~7,7–8,5.
- 06.09'da 4.354 gösterimlik tek günlük sıçrama (yeni sayfa grubunun
  dizine girişi); sonrasında günlük ~600–1.000 gösterim bandı.
- **Yorum:** trafik artışı reklam değil, indeksleşen uzun kuyruk sayfaları
  (nehir/göl) kaynaklı; pozisyon iyileşiyor, CTR düşüşü ranking değil
  ölçek etkisi.

### 3.3 En çok tıklanan sorgular (top, `query`)
| Sorgu | Tık | Gösterim | Poz. |
|---|---|---|---|
| dsi su havzaları haritası | 5 | 38 | 4,8 |
| ulusal su bilgi sistemi harita | 4 | 20 | 5,8 |
| yeraltı su haritası | 3 | 24 | 9,5 |
| dsi havza haritası | 2 | 7 | 2,1 |
| dsi su haritası | 2 | 31 | 9,4 |
| dsi yeraltı su haritası | 2 | 59 | 7,2 |
| + gökırmak / ergene / göller (uzun kuyruk) | 1'er | 100–1.400 | 5–14 |

Harita niyeti ("harita/havza/yeraltı suyu") baskın; marka-dışı keşif
sağlıklı.

### 3.4 En çok tıklanan sayfalar (`page`)
| Sayfa | Tık | Gösterim | CTR | Poz. |
|---|---|---|---|---|
| /nerede-su-cikar/ | 56 | 644 | %8,7 | 6,9 |
| /havzalar/ | 42 | 920 | %4,6 | 6,4 |
| /en/ | 14 | 122 | %11,5 | 7,2 |
| /goller/akyay-golu/ | 7 | 47 | %14,9 | 3,8 |
| /havzalar/kizilirmak/ | 5 | 274 | %1,8 | 7,1 |
| /mevzuat/2886/madde-51/ · 5393 ailesi | 4'er | 7–145 | %3–57 | 2,6–7,7 |
| /rehberler/kaynak-suyu-kiralama/ | 4 | 36 | %11,1 | 4,7 |

### 3.5 FIRSAT LİSTESİ — nehir/göl CTR çöküşü (en büyük kaldıraç)
`gsc_quick_wins` + `gsc_ctr_opportunities` (dönem 09-04 → 10-01):

| Sayfa | Gösterim | CTR | Poz. | Tahmini ek tık |
|---|---|---|---|---|
| /nehirler/gokirmak/ | **5.449** | **%0,02** | 9,5 | **+108** |
| /nehirler/esen-cayi/ | 2.406 | %0,04 | 7,8 | +81 |
| /nehirler/kelkit-cayi/ | 604 | %0,17 | 6,9 | +26 |
| /nehirler/hezil-cayi/ | 670 | %0 | 9,6 | +13 |
| /rehberler/su-tahsisi-oncelik-sirasi/ | 205 | %0,98 | 5,8 | +10 |
| /nehirler/bakircay/ · harsit-cayi · asi-nehri | 177–473 | %0–0,33 | 9,1–9,9 | +5'er |
| /goller/degirmenkoy-goleti/ · arin-golu · konak-goleti · dalama | 86–367 | %0–0,8 | 5,7–9,9 | +5'er |

Sorgu tarafında: "gökırmak nerede/hangi akarsuyun kolu" ailesi ~3.700
gösterim, ~1 tık; "eşen çayı/akarsuyu nerede" ~1.670 gösterim, 0 tık;
"zap suyu nerede" 730, 1 tık. **Teşhis:** sayfalar "nerede / hangi
akarsuyun kolu" sorusunda 7–11. sırada ama başlık/meta sorunun cevabını
vermiyor → SERP'te tıklanmıyor. **Öneri (ayrı BÜYÜK İŞ, DUR-1):** nehir
şablonunda title'ı soru kalıbına çekmek ("Gökırmak nerede? Hangi akarsuyun
kolu?") + öz-cevap ilk cümlede konum/kol bilgisi + iç bağ güçlendirme.

### 3.6 Sitemap ve indeks doğrulaması
- `gsc_list_sitemaps`: `https://suharitasi.com/sitemap.xml` — son gönderim
  24.09, son indirme **03.10**, **0 hata · 0 uyarı**, 1017 URL (canlı sitemap
  bugün 1023; bir sonraki taramada tazelenir). **Onarım gerekmedi.**
- `gsc_inspect_url` — ana sayfa: **PASS**, "Submitted and indexed",
  robots ALLOWED, canonical birebir, son tarama 02.10, Breadcrumbs zengin
  sonuç geçerli.
- `gsc_inspect_url` — /mevzuat/: **PASS**, indeksli, canonical birebir,
  Breadcrumbs geçerli (son tarama 14.09; dünkü optimizasyon sonraki
  taramada işlenecek).
- Genel kapsam: API, mülk düzeyinde toplam indeks sayısı vermiyor; örneklem
  URL denetimleri PASS ve sitemap temiz — **kırmızı kalem yok**.

## 4. DOĞRULAMA

| Ölçüm | Sonuç |
|---|---|
| `npm run build` | EXIT 0 · 1109 page(s) · HTML sayısı değişmedi |
| `/tahmin/` | `.th-meal` 8 · terim 4/4 · `measurementTechnique` birebir |
| `/gizlilik/` | İbare birebir (1) · özet + saklama güncel |
| Yerel `site-saglik --hizli` | kırmızı 0 · sarı 1 (yerelde Function yok, beklenen) · G1-G6 sapma 0 |

## 5. DUR / OPERATÖR

1. **Nehir/göl CTR optimizasyonu** (gökırmak ailesi): title/meta + öz-cevap
   yeniden yazımı — ayrı BÜYÜK İŞ, içerik kararı (DUR-1).
2. **GA4 Admin API** etkinleştirme → oturum/ziyaretçi akışı ancak o zaman
   ölçülür (şu an 403; bu rapor yalnız GSC arama verisi içerir).
3. `SAYAC_ANAHTAR` panel eşleşmesi: `.env` değeriyle `/api/loglar` bu turda
   da 401 döndü; panel secret'ı `.env` ile eşleşmiyor olabilir.
4. Bu turun içerik/görsel canlı onayı (İş kapanış kuralı).

---

*Üreten: 04.10.2026 UX/SEO turu. Karar kaydı §54 ve SIRADAKILER
güncellemesiyle commit edilmiştir.*
