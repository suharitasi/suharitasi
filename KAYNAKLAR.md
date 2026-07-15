# KAYNAKLAR.md — veri kaynakları ve lisanslar

## Türkiye il sınırları (GEÇİCİ VERİ)

- Dosya: `src/data/tr-iller.json` (81 il, MultiPolygon, `name` + `number` property'leri)
- Kaynak: https://github.com/alpers/Turkey-Maps-GeoJSON — `tr-cities.json`, master dalı
- Lisans: Apache-2.0
- İndirme tarihi: 2026-07-12

> NOT: İl sınırları geçici yer tutucudur. Asıl hedef 25 su havzası
> (DSİ havza sınırları) — güvenilir açık kaynaklı havza GeoJSON'u
> bulunduğunda bu veri değiştirilecek ve bu dosyaya işlenecek.

## Arazi görseli (hipsometrik atlas rölyefi)

- Dosyalar: `src/assets/tr-atlas.webp` (web, 3840px) +
  `kaynak/tr-atlas-master.png` (master, 7680px — git dışında, yeniden
  üretilebilir).
- Üretim: `arac/atlas/indir.py` (terrarium tile'ları z9'da mozaikler,
  EPSG:3857 DEM yazar) + `arac/atlas/boya.py` (gdaldem color-relief +
  hillshade harmanı, deniz düz #A9C3B4). Kapsam: 24.61E–45.70E /
  35.46N–42.55N (z9 tile kenarları).
- Ham veri kaynağı: AWS Open Data — Terrain Tiles (Mapzen mirası),
  `elevation-tiles-prod`, terrarium formatı. Lisans: kamusal kaynaklardan
  derlenmiştir (SRTM/NASA, USGS vd.); atıf gerekli — haritada attribution
  kontrolüyle veriliyor. Ayrıntı: https://registry.opendata.aws/terrain-tiles/
- Üretim tarihi: 2026-07-12
- Canlı S3 tile bağımlılığı KALDIRILDI (2026-07-12): rölyef artık repo
  içindeki statik görselden servis ediliyor; R2 kopyalama notu geçersiz.

## Türkiye dış sınırı + kesim maskesi

- Dosyalar: `src/data/tr-sinir.json` (sadeleştirilmiş halkalar) +
  `src/assets/tr-maske.png` (2048x1024 kesim maskesi).
- Üretim: `arac/atlas/sinir.py` — 81 il poligonunun shapely birleşimi,
  0.015° sadeleştirme; kaynak veri il sınırlarıyla aynı (Apache-2.0).
- Üretim tarihi: 2026-07-12

## "Su bulunabilecek alanlar" işaretleri (TEMSİLİ — YER TUTUCU)

- `harita/isaretler.js` içindeki 9 nokta (Taşeli, Kırkgöz, Konya kapalı
  havzası, Gökova, Harran, Develi, Ergene, Bafra, Iğdır) TEMSİLİDİR;
  hidrojeolojik veriye dayanmaz. Aşama 1 kazısında gerçek karst/akifer
  verisiyle değiştirilecek.

## Atlas renk kalibrasyonu notu

- Kullanıcının verdiği poster referansı (`referans/atlas-stili.jpg`)
  projede BULUNAMADI (2026-07-12); kalibrasyon brief'teki hex bantlarına
  göre yapıldı, karşılaştırma görseli: `screenshots/atlas-renk-karsilastirma.png`.
  Poster eklenirse yeniden kalibre edilecek.

## Nehirler ve göller (GEÇİCİ/BAŞLANGIÇ VERİSİ)

- Dosyalar: `src/data/tr-nehirler.json`, `src/data/tr-goller.json`
- Kaynak: Natural Earth 10m — `ne_10m_rivers_lake_centerlines` +
  `ne_10m_rivers_europe` (nehirler), `ne_10m_lakes` (göller);
  https://github.com/nvkelso/natural-earth-vector üzerinden indirildi,
  il poligonlarıyla Türkiye'ye kesişenler filtrelendi.
- Lisans: Natural Earth — kamu malı (public domain).
- İndirme tarihi: 2026-07-12
- Ad düzeltmeleri: NE'nin bozuk/İngilizce etiketleri Türkçeleştirildi
  ("Kiz?lirmak"→Kızılırmak, "Lake Van"→Van Gölü, "Ataturk Barajt"→Atatürk
  Baraj Gölü vb.). DİKKAT: NE'de (38.4E, 38.5N) konumundaki rezervuar
  "Saksak Dagi" etiketliydi; koordinat Karakaya Baraj Gölü'ne karşılık
  geldiğinden bu ad verildi — resmi kaynaktan DOĞRULANMADI.
- NOT: Beyşehir, Eğirdir, Tuz, Van, Keban, Atatürk, Karakaya mevcut;
  İznik/Burdur/Uluabat gibi orta boy göller NE 10m'de Türkiye için yok —
  Aşama 1'de daha zengin hidrografi kaynağıyla (ör. DSİ/HydroSHEDS)
  değiştirilmesi değerlendirilecek.

## 25 havza sınırları (data/havzalar/)

- Dosyalar: `data/havzalar/havzalar-ham.geojson` (2,7 MB, 27 poligon) +
  `data/havzalar/havzalar-web.geojson` (90 KB, 25 havza — Marmara
  parçaları birleştirildi, 0.01° sadeleştirme, `arac/havza-sadelestir.py`).
- Kaynak: ArcGIS Online feature service "Türkiye Havzalar"
  (services-eu1.arcgis.com/LHwUjP01iDaGy6Hk/.../Türkiye_Havzalar),
  öğe: arcgis.com item 8bb6457512914c359fc6be676f0aa391 (sahibi:
  esra_aydin, Aralık 2023).
- Lisans: öğede lisans BELİRTİLMEMİŞ; topluluk verisi, resmî kaynak
  değil. Kullanım: web görselleştirme; sınırlar "temsilî" etiketiyle
  gösterilmeli.
- DOĞRULAMA DURUMU: 25 havza adı/numarası DSİ 2024 tablolarıyla eşleşti
  (Fırat-Dicle: kaynakta 26 → DSİ standardı 21'e çevrildi; "Meriç-Erhene"
  yazım hatası düzeltildi). Geometri resmî kaynakla DOĞRULANMADI — resmî
  CBS uçları (geodata.tarimorman.gov.tr, cbs.dsi.gov.tr) yurt dışından
  erişilemedi (000, denetim 2026-07-14).
- İndirme tarihi: 2026-07-14. Kullanım yeri: 2D havza haritası (Faz 2)
  + havza sayfaları.

## DSİ 2024 resmî su kaynakları istatistikleri (data/havza-veri.json)

- Kaynak sayfa: https://www.dsi.gov.tr/Sayfa/Detay/2186
  (DSİ 2024 Yılı Resmi Su Kaynakları İstatistikleri, yayım 11.12.2025).
- İndirilen dosyalar (kaynak/dsi/ — gitignore'da, yeniden indirilebilir):
  - Tablo 1.2 havzalara göre yıllık ortalama yüzeysuyu potansiyeli
    (2013–2024) — cdniys.tarimorman.gov.tr/api/File/GetGaleriFile/425/DosyaGaleri/8848/1.2.havzalara_gore_yillik_ortalama_yuzeysuyu_su_potansiyeli_20132024.xlsx
  - Tablo 1.3 havzalara göre yıllık yeraltısuyu potansiyeli (2013–2024)
    — .../1.3.havzalara_gore_yillik_yeraltisuyu_potansiyeli_20132024.xlsx
  - Tablo 1.5 yeraltısuyu işletme rezervi (1995–2024) — .../1.5....xlsx
  - Tablo 4.7 havza bazında baraj doluluk oranları (2010–2024) —
    .../4.7....xls (İLERİDE: VIZYON-5 canlı doluluk işinde kullanılacak)
- Lisans/kullanım: kamu kurumu resmî istatistik yayını; kaynak
  gösterilerek kullanılıyor.
- İndirme tarihi: 2026-07-14. Türetilen dosya: `data/havza-veri.json`
  (`arac/havza-veri-cikar.py`; 2024 sütunları esas alındı).
- NOT: DSİ numaralandırmasında Fırat-Dicle 21'dir; sitede bu standart
  kullanılıyor.

## DSİ istatistik arşivi yerel kopyası (kaynak/dsi-arsiv/)

- İndirme 15.07.2026; silinme riskine karşı arşivlendi. DSİ Resmî Su Kaynakları
  İstatistikleri 2014–2024 baskıları (2021–2022 zaten silinmiş, yok): 229 dosya,
  54,5 MB, xlsx/xls/docx. Kaynak: cdniys.tarimorman.gov.tr CDN (2020/2023
  baskıları web.archive.org galeri snapshot'larından kurtarıldı — DSİ sayfa
  linkleri kırık/boşaltılmış).
- .gitignore'da `kaynak/` yok sayılıyor ama `kaynak/dsi-arsiv/` istisna ile
  izleniyor (repoya dahil — 55 MB; arşiv değeri için bilinçli tercih).
- Her dosya HTTP 200 + dosya imzası + sha256 ile doğrulandı; künye:
  `kaynak/dsi-arsiv/MANIFEST.md`. İndirilemeyen 6 dosya (WAF 246 reddi + arşiv
  de reddi kopyalamış) ikincil tablolardır (baraj/gölet/HES inşa, sulama alanı);
  çekirdek su verisi (yüzeysuyu/YAS potansiyeli, işletme rezervi, baraj doluluk)
  9 baskının tamamında mevcut.
- rapor/kaynak-haritasi.md madde 5 "acil arşiv uyarısı" bu işle kapatıldı.

## scroll-world motoru (pilot — /harita-pilot/)

- Kaynak: github.com/oso95/scroll-world, `skills/scroll-world/references/
  scrub-engine.js` (MIT, telif 2026 cyw). Pilotta bu motorun scroll-scrub
  grameri (smoothstep, lingerEase, segment eşlemesi, bölüm-copy koreografisi,
  route rail, rAF yumuşatma) `src/pages/harita-pilot.astro`'ya porta edildi.
- Higgsfield / AI video / ücretli hiçbir adım kullanılmadı: motorun video
  katmanı yerine tek onaylı görselden (HEDEF.png → /hedef-hero.v2.webp) CSS
  kamera transformu sürülüyor. Sunucuda ffmpeg olmadığından ken-burns MP4
  üretilemedi; CSS-only parallax yolu seçildi (near-sıfır ek ağırlık).
- Lisans: MIT — atıf bu satır + sayfa başındaki yorum bloğuyla veriliyor.
- Pilot tarihi: 2026-07-15. noindex; sitemap dışı (astro.config.mjs noindex
  filtresi). Nihai görsel yargı kullanıcının canlı scroll testinde.

## SYGM havza koruma eylem planları

- Giriş sayfası: https://www.tarimorman.gov.tr/SYGM/Sayfalar/Detay.aspx?SayfaId=6
- 21/25 havzanın PDF bağlantısı HTTP 200 ile doğrulandı (2026-07-14);
  tam liste `data/havza-veri.json` içinde havza bazında.
- BULUNAMADI (2026-07-14): Asi, Çoruh, Aras, Fırat-Dicle HKEP PDF'leri
  (ad varyasyonları denendi). Meriç-Ergene için HKEP yerine Nehir
  Havzası Yönetim Planı bulundu:
  https://www.tarimorman.gov.tr/SYGM/Belgeler/NHYP%20DENİZ/MERİÇ-ERGENE%20NEHİR%20HAVZASI%20YÖNETİM%20PLANI.pdf

## Su mevzuatı tam metin bağlantıları

- mevzuat.gov.tr üzerindeki tüm bağlantılar (831, 167, 6200, 5686
  sayılı kanunlar; Yeraltı Suları Tüzüğü; 6 yönetmelik/tebliğ)
  14.07.2026'da HTTP 200 + içerik başlığı kontrolüyle doğrulandı.
  Liste: `src/content/su-kanunu/mevzuat-kutuphanesi.md`.

## Su Kanunu taslağı takip kaynakları

- Tarım Dünyası (Ali Ekber Yıldırım), 08.05.2026: "Su Kanunu Taslağı 13
  yıl sonra bir kez daha görüşe açıldı" —
  https://www.tarimdunyasi.net/haber/su-kanunu-taslagi-13-yil-sonra-bir-kez-daha-goruse-acildi/
  (15.04.2026'da 268 kuruma görüş; 5 bölüm 19 madde; Aralık 2025
  Ulusal Su Kurulu 5. toplantısı aktarımı).
- Dünya Gazetesi (Prof. Dr. Aykut Gül), 12.05.2026 köşe yazısı —
  içerik analizi, somut süreç bilgisi YOK; yalnızca bağlam.
- TBMM'ye sevk kaydı BULUNAMADI (tarama 14.07.2026).

## İl-kurum katmanı (data/il-kurum.json)

- İl → DSİ bölge eşlemesi: 26 bölgenin resmî "Görev Alanı ve Tarihçe"
  sayfaları (bolgeXX.dsi.gov.tr), sayfa bazında kaynak URL'leri JSON
  içinde. Tarama araçları: `arac/dsi-bolge-tara.py` (ham cümleler) +
  elle derleme. 16. Bölge (Mardin) Ilısu Projesi ile sınırlı; il
  ataması yok. 17. Bölge (Van) il adları "4 il" ifadesi + kuruluş
  kapsamı + sınır tarifinden çıkarıldı (JSON'da not alanında).
- Havza → il listeleri: SYGM havza tanıtım PDF'leri
  (tarimorman.gov.tr/SYGM/Belgeler/, iki klasör; `arac/havza-il-tara.py`
  + elle tamamlama). Fırat-Dicle: tanıtım PDF'lerinde il listesi YOK;
  liste Fırat ve Dicle alt havzası Taşkın Yönetim Planı yönetici
  özetlerinden (Taşkın Yönetim Planları 26.12.2022 klasörü) birleşim
  olarak derlendi; broşürdeki "22 il" özeti ile aradaki fark JSON'da
  not edildi. Seyhan ve Konya Kapalı: TÜBİTAK MAM Havza Koruma Eylem
  Planı raporlarındaki il tabloları esas alındı.
- Su/kanalizasyon idareleri: 2560 sayılı Kanun rejimi; 30 büyükşehir
  idaresinin ad/kısaltmaları listelendi, diğer 51 ilde İl Özel
  İdaresi / belediye gösterimi kullanılıyor.
- Derleme tarihi: 2026-07-14. Kullanım yeri: havza sayfaları "İller ve
  yetkili kurumlar" bloğu + kuyu-ruhsati rehberindeki 81 il tablosu
  (`src/components/IlKurumTablosu.astro`).

## Apilex hukuki araştırma çıktısı (kaynak/apilex-sumevzuat.md)

- Tarih: 14.07.2026. Kapsam: yeraltı suyu kuyu rejimi, yaptırımlar,
  kaynak suyu kiralama, su tahsisi, işletme sahası, kaynak hakkı,
  belge ret/iptal davaları, baraj kamulaştırması, jeotermal ruhsat,
  taslak kavramlar (Bölüm 12).
- KARAR KÜNYELERİ DOĞRULANMADI — yayın öncesi doğrulama zorunlu
  (SIRADAKILER.md'de yayın kilidi olarak kayıtlı). Çelişkili künye:
  Danıştay 13. D. 2020/1104 E.-2023/4576 K. vs 2020/1093 E.-2023/2584 K.
- Kullanım yeri: src/content/rehberler/ altındaki 9 mevzuat rehberi +
  su-kanunu/taslak-takibi.md Bölüm 12 tespiti. Rehberlere bu metin
  dışından hukuki iddia eklenmez.

## Mevzuat rehberleri — VERİ YOK, ayrı kanaldan tamamlanacak

- Su kirliliği cezaları (2872 sayılı Çevre Kanunu / SKKY): Apilex
  çıktısında bu bölüm yer almadı; rehber üretilmedi.
- İçme suyu koruma alanı yasak listesi (mutlak/kısa/orta/uzun mesafe):
  veri yok.
- TBB reklam yasağı uyumu (rehber sayfa altlıkları için): veri yok.

## Havza tahsis durumu — BULUNAMADI

- Havza bazlı su tahsis verisi (sektörel tahsis/kullanım) kamuya açık
  bir veri seti olarak BULUNAMADI (2026-07-14). DSİ istatistikleri
  sektörel kullanımı ülke toplamında veriyor, havza kırılımı yok.
  USBS (usbs.tarimorman.gov.tr) portal arayüzü var; anonim REST ucu
  bulunamadı. Alan tüm havzalarda "veri yok" işaretli.
