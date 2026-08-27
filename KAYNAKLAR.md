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

- `src/harita-3d/isaretler.js` içindeki 9 nokta (Taşeli, Kırkgöz, Konya kapalı
  havzası, Gökova, Harran, Develi, Ergene, Bafra, Iğdır) TEMSİLİDİR;
  hidrojeolojik veriye dayanmaz. Aşama 1 kazısında gerçek karst/akifer
  verisiyle değiştirilecek.

## Atlas renk kalibrasyonu notu

- Kullanıcının verdiği poster referansı (`referans/atlas-stili.jpg`)
  projede BULUNAMADI (2026-07-12); kalibrasyon brief'teki hex bantlarına
  göre yapıldı, karşılaştırma görseli: `screenshots/atlas-renk-karsilastirma.png`.
  Poster eklenirse yeniden kalibre edilecek.

## Nehirler ve göller (OSM + Natural Earth hibrit)

- Dosyalar: `src/data/tr-nehirler.json` (131 akarsu, 92 KB),
  `src/data/tr-goller.json` (279 göl, 122 KB)
- Projeksiyon: EPSG:4326 (WGS84) — tüm dosyalarda CRS alanı mevcut
- **Göller:** İki kaynak birleşimi:
  - **OpenStreetMap** — `natural=water` yolları (`water=lake/reservoir`),
    Overpass API üzerinden 04.08.2026'da çekildi. 0,5 km² üstü filtrelendi,
    0.005° shapely basitleştirme. 279 göl içerir (Van, Salda, Kovada, Abant,
    Uzungöl dahil).
  - **Natural Earth 10m** (yedekten) — OSM'de multipolygon relation olarak
    parçalı gelen mega-göller (Tuz, Van, Beyşehir, Eğirdir, Keban, Atatürk,
    Karakaya Baraj gölleri) NE verisiyle tamamlandı. NE 10m kamu malı (public
    domain).
  - Lisans: OSM verisi **ODbL 1.0 — © OpenStreetMap katkıcıları**.
    Natural Earth parçası kamu malı. Atıf: harita kenarında OSM telifi
    + KAYNAKLAR.md.
- **Akarsular:** OpenStreetMap `waterway=river` yolları, Overpass API
  üzerinden 04.08.2026'da çekildi. Shapely linemerge ile isme göre
  birleştirildi, 0.008° basitleştirme, en uzun 150 akarsu (131'i 12+
  noktadan oluşuyor). Kızılırmak, Dicle, Sakarya, Büyük Menderes, Ceyhan,
  Fırat kolları, Yeşilırmak, Çoruh dahil.
  - Lisans: **ODbL 1.0 — © OpenStreetMap katkıcıları.**
- Çekim aracı: `arac/fetch_hydro.py` (tekrar çalıştırılabilir)
- ÖNCEKİ VERİ (2026-07-12): Natural Earth 10m — 7 göl, 69 akarsu (32 adlı,
  37 adsız). OSM verisine geçişle göl sayısı 7→279, adlı akarsu 32→131 oldu.

## 25 havza sınırları (data/havzalar/)

- Dosyalar: `data/havzalar/havzalar-ham.geojson` (2,7 MB, 27 poligon) +
  `data/havzalar/havzalar-web.geojson` (90 KB, 25 havza — Marmara
  parçaları birleştirildi, 0.01° sadeleştirme, `arac/havza-sadelestir.py`).
- Projeksiyon: EPSG:4326 (WGS84)
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
- DEĞERLENDİRİLEN ALTERNATİFLER (04.08.2026):
  - **HydroBASINS** (HydroSHEDS, Level 5-6): fizyografik su havzaları;
    DSİ'nin 25 idari havza sistemiyle BİREBİR ÖRTÜŞMEZ. Ör: DSİ'de tek
    havza olan Fırat-Dicle, HydroBASINS'te 10+ alt havzaya ayrılır.
    Yönetimsel değil hidrolojik sınıflamadır — sitenin idari havza
    modeline uymaz.
  - **DSİ resmî CBS** (geodata.tarimorman.gov.tr, cbs.dsi.gov.tr): TR
    IP'sinden erişimle alınabilir. Bu sunucudan erişilemedi (2026-07-14).
    En yetkili kaynak; TR IP'siyle denenmeli.
  - **Sonuç:** Mevcut ArcGIS verisi, DSİ 25-havza adlandırmasıyla tam
    eşleştiği ve alternatifler idari havza sınırı sunmadığı için KORUNDU.
    Resmî kaynağa erişilene kadar en iyi mevcut veridir.
- İndirme tarihi: 2026-07-14. Kullanım yeri: 2D havza haritası (Faz 2)
  + havza sayfaları.
- NOT: `src/data/havza-harita.js` havza konumlandırıcısı, havza poligonu
  yerine havzanın KAPSADIĞI İLLERİ gösterir. Bu bilinçli bir tercihtir:
  havza sınır geometrisi resmî kaynaktan doğrulanmadığı için haritada il
  poligonu proxy'si kullanılır. Havza poligonları `havzalar-web.geojson`'da
  mevcuttur; resmî doğrulama sonrası haritaya alınabilir.

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

## SYGM kuraklık yönetim planları (havza komşuluğu dayanağı)

Kayıt nedeni: KARARLAR §32/3 — "aynı illeri kapsayan havzalar" listesinde
eşitlik bozucunun gerekçesi. SİTEDE KOMŞULUK İDDİASI OLARAK KULLANILMAZ;
yalnız karar dayanağıdır (sayfadaki ölçüt il örtüşmesidir).

- Giriş sayfası: https://www.tarimorman.gov.tr/SYGM/Sayfalar/Detay.aspx?SayfaId=61
  — HTTP 200 doğrulandı (2026-08-26). 20 havzanın kuraklık yönetim planını
  listeler; **Konya Havzası** dahil (Cilt 1, Cilt 2, Cilt 3, Yönetici Özeti).
  Belge klasörü: `/SYGM/Belgeler/KURAKLIK%20YÖNETİM%20PLANLARI%2009.01.2023/`.
- DOĞRUDAN CİLT BAĞLANTISI KAYDEDİLMEDİ: arama sonucundan gelen
  `.../Kuraklık%20Yönetim%20Planları/Konya%20Havzası%20Kuraklık%20Yönetim%20Plan%C4%B1%20Cilt%203.pdf`
  adresi **HTTP 404** döndü (2026-08-26 ölçümü; klasör adı bayat). Belgeye
  giriş sayfasından inilir — ölü bağlantı kaydedilmez.
- Konya Havzası tanıtım belgesi (havza → il listesi kaynağının Konya
  parçası; genel künye "İl-kurum katmanı" bölümünde zaten kayıtlı):
  https://www.tarimorman.gov.tr/SYGM/Belgeler/havza%20tan%C4%B1t%C4%B1m%2023.03.2023/t%C3%BCrk%C3%A7e/Konya%20Havzas%C4%B1%20Tan%C4%B1t%C4%B1m.pdf
  — HTTP 200 + `application/pdf` doğrulandı (2026-08-26).

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

## EPİAŞ günlük baraj verisi (data/arsiv/baraj/ + data/canli/baraj.json)

- Kaynak: EPİAŞ Şeffaflık Platformu — https://seffaflik.epias.com.tr
  (electricity-service, markets-dams-controller: aktif doluluk %, günlük
  kot, günlük hacim; havza parametreli)
- Erişim: üyelik + CAS TGT bileti (kimlik yalnız sunucuda .env'de;
  repoya girmez). Çekim: arac/baraj-cek.mjs, günlük cron 18:00 TR.
- Lisans: "İçerik ve veriler kaynak gösterilmek suretiyle çoğaltılabilir
  ve kullanılabilir" — EPİAŞ platform beyanı; ifade web aramasıyla
  EPİAŞ'ın kendi sayfası kaynaklı teyit edildi (2026-07-16), canlı sayfa
  bu sunucudan açılamadığı için kesin teyit girişli ekrandan yapılacak
  (kullanıcıda). Yeniden-satış izni AYRICA teyit edilmeden ücretli
  katmanda kullanılmaz.
- Kapsam şerhi: EPİAŞ enerji piyasası platformudur — kapsam enerji
  üretimiyle ilişkili rezervuarlardır; içme suyu barajları kapsam dışı
  olabilir (ilk gerçek çekimde doğrulanacak).
- KRİTİK: EPİAŞ geriye dönük veri VERMEZ ("Geriye dönük veri
  bulunmamaktadır" — teknik doküman). Arşiv kayıt başlangıcından itibaren
  gün gün birikir; başlangıç öncesi için veri yoktur ve üretilmez.
- İlk kayıt tarihi: **2026-07-16** (data/canli/baraj.json künyesindeki
  `kayitBaslangici` alanından; 27.08.2026 denetiminde ölçüldü — kayıt
  "henüz yok" diyordu, hat 40+ gündür çalışıyordu). Arşiv o tarihten
  itibaren gün gün birikiyor: `data/arsiv/baraj/` altında 925 json
  (27.08.2026 sayımı), künye `sonDurum: "ok"`.

## GRACE su depolaması anomalisi (data/canli/grace-*.json + arşiv)

- Kaynak: NASA GSFC GRACE/GRACE-FO mascon RL06 v2.0, yarım-derece grid —
  earth.gsfc.nasa.gov/geo/data/grace-mascons (açık, KAYITSIZ; test
  2026-07-16: HTTP 200, 530.877.840 bayt indirildi, sha256 kaydı
  data/arsiv/grace/ham-sha256.txt). Karşılaştırılan alternatifler:
  JPL/PO.DAAC (302→Earthdata login), CSR Texas (bu sunucudan 000),
  UNL nasagrace.unl.edu (yalnız PNG/PDF — sayısal değil). "Kayıtsız >
  tokenlı" kuralıyla GSFC seçildi; EARTHDATA_TOKEN şu an GEREKMİYOR.
- İçerik: lwe_thickness — TOPLAM su depolaması (TWS) anomalisi, cm sıvı su
  eşdeğeri, 2004-2009 ortalamasına göre; 255 gerçek ay (2002-04→2026-03),
  34 eksik ay (2017-18 GRACE/GRACE-FO boşluğu dahil) DOLDURULMADAN taşınır.
- ÖNEMLİ: bu veri yeraltı suyu + toprak nemi + kar + yüzey suyu TOPLAMININ
  değişimidir — "yeraltı suyu miktarı" olarak sunulamaz; mutlak rezerv
  vermez. Mascon gerçek çözünürlüğü ~3° (~300 km) → havza ortalamaları
  YAKLAŞIK (0,25° iddiası yalnız UNL görsel ürünü içindi).
- İşleme: arac/grace-isle.py (python3-gdal + numpy, pip kurulumu YOK) —
  Türkiye kırpma + 25 havza alan-ağırlıklı seri (havza sınırları temsilî,
  bkz. yukarıdaki havza kaydı). Güncelleme: arac/grace-guncelle.sh,
  haftalık cron (Pzt 06:00 UTC), Last-Modified karşılaştırmalı.
- Ham 530MB NetCDF GitHub 100MB limiti nedeniyle sunucu arşivinde
  (gitignore); bütünlük kanıtı sha256 + Last-Modified damgası git'te.
- Lisans: NASA verisi kamu malı (ABD federal); kaynak atfı sayfada.

## İl rejimi katmanı (src/data/il-profil.js — türetilmiş, yeni kaynak yok)

- /arac/il-rejimi/ aracı ve /kuyu-ruhsati/[il]/ statik sayfaları TEK
  üreticiden türetilir; kaynaklar bu dosyada zaten künyeli olan
  il-kurum.json + havza-veri.json + grace-havza.json + baraj.json'dur.
  Yeni veri girişi yapılmamıştır.
- İnce içerik kuralı: il sayfası yalnız 5 il-özgü unsurdan (DSİ bölge,
  havza künyesi, GRACE eğilimi, baraj durumu, açık su idaresi kaydı) en
  az 3'ü doluysa üretilir. 2026-07-16 denetimi: 81/81 il eşiği geçti
  (14 il 3 unsur, 43 il 4, 24 il 5). Jenerik fallback unsur SAYILMAZ.
- Duplicate önlemi: genel kuyu ruhsatı süreci il sayfalarına
  kopyalanmaz; ana rehbere gövde linki verilir.

## Mevzuat belge arşivi (Su Kanunu bağlamı)

- Dosyalar: `data/arsiv/mevzuat/ulusal-su-plani-2026-2035.pdf` (22.2 MB) +
  `data/arsiv/mevzuat/su-verimliligi-yonetmeligi-20241227.htm` (RG 27.12.2024/32765).
- Kaynak URL'ler:
  - Ulusal Su Planı (2026-2035): https://www.tarimorman.gov.tr/SYGM/Belgeler/Ulusal%20Su%20Plan%C4%B1%20%20Resmi%20Gazete/Ulusal%20Su%20Plan%C4%B1%20(2026-2035).pdf
  - Su Verimliliği Yönetmeliği: https://www.resmigazete.gov.tr/eskiler/2024/12/20241227-3.htm
- Erişim tarihi: 2026-07-21 (curl, HTTP 200, imza doğrulandı; sha256 → `data/arsiv/mevzuat/sha256.txt`).
- Lisans: resmî kaynak, açık lisans beyanı yok — arşiv + atıf amaçlı; yayın/türetme
  kararı kullanıcıda (Av. Serdar Arslan). Manifest: `data/arsiv/mevzuat/manifest.md`.

## Su potansiyeli katmanı (Faz 1-6, erişim: 2026-07-27)

- **SYGM Nehir Havza Yönetim Planları (NHYP)** — 12 yayımlı havza planı +
  YAS ekleri (38 PDF). Kaynak: tarimorman.gov.tr/SYGM (Sayfalar/Detay.aspx?
  SayfaId=49). Kamu belgesi; künyeli alıntı. Türetilmiş:
  veri/potansiyel/yas-kutleleri.json (472 kütle), kutle-il.json.
- **T.C. Resmî Gazete** — başlık araması 109 kayıt + içerik/ilan taraması
  310 pasaj kaydı (isletme-sahalari*.json). Her kayıt RG tarih+sayı+URL
  künyeli. Kamu.
- **DSİ duyuru/haber arşivi** — dsi.gov.tr; 328 giriş tarandı, 2 kayıt
  (dsi-duyurular.json). Kamu.
- **MTA e-ticaret katalog metaverisi** — eticaret.mta.gov.tr; 356 rapor
  künyesi (mta-katalog.json). Yalnız katalog adı+URL; rapor içeriği
  alınmadı.
- **OpenAlex API** — akademik künyeler (akademik-kunye.json; 1.979 künye,
  81/81 il — kota kalemi 2026-07-28'de kapandı, hata 0). Metadata lisansı
  CC0. DergiPark arama arayüzü Turnstile korumalı olduğundan ikame
  (kullanıcı onayı 2026-07-27; basılan her künye DOI/açık-erişim URL'li).
- **OpenStreetMap / Overpass API** — (1) ilçe→il dizini
  (ilce-il-dizini.json; resmî listeyle çapraz doğrulama SIRADAKILER'de),
  (2) natural=spring / man_made=water_well sayıları (osm-su-noktalari.json,
  sitede "topluluk verisi, resmî doğrulanmadı" etiketiyle).
  Lisans: **ODbL 1.0 — © OpenStreetMap katkıcıları**.
- **Copernicus GLO-90 DEM** — ESA/Airbus; AWS açık dağıtımı
  (copernicus-dem-90m). 122 karo; morfoloji.json türetildi. Lisans:
  atıfla ücretsiz kullanım (Copernicus DEM lisans koşulları).
- **TÜİK belediye su istatistikleri** — il düzeyinde kaynak-türü kırılımı
  YAYIMLANMIYOR (MEDAS gösterge listesi incelemesi, 2026-07-27) → sitede
  "veri yok".
- İl sınırı poligonu (morfoloji + OSM nokta ataması): yukarıdaki
  tr-iller.json girişi (alpers/Turkey-Maps-GeoJSON, Apache-2.0).

## Veri arşivi sayfası (/arsiv/) — teşhir edilen setler (28.07.2026)

Aşağıdaki setler bu tarihe kadar YALNIZ türev sayı olarak görünüyordu; künye
listesi olarak da yayımlandı (`/arsiv/`, üretici `src/data/vitrin.js`).
Setlerin kendi künyeleri bu belgede kendi başlıkları altında durur; burada
yalnız TEŞHİR KAYDI tutulur — yeni kaynak eklenmedi.

- **Resmî Gazete işletme sahası ilanları** — bkz. "Su potansiyeli katmanı".
  Teşhir: /arsiv/ künye kartı + il sayfaları (kayıt bazında).
- **NHYP yeraltı suyu kütleleri** — bkz. "Su potansiyeli katmanı".
  Teşhir: /arsiv/ + il sayfaları + /nerede-su-cikar/.
- **GRACE/GRACE-FO** — bkz. "GRACE su depolaması anomalisi". ÜLKE GENELİ seri
  (aylık) bu tarihe kadar sitede HİÇ görünmüyordu; artık /arsiv/'de kapsam ve
  kayıt sayısıyla künyeli. Havza kırılımı havza sayfalarında zaten görünürdü.
- **EPİAŞ günlük baraj arşivi** — bkz. "EPİAŞ günlük baraj verisi". Günlük
  anlık görüntü arşivi görünmüyordu; artık /arsiv/'de künyeli (yalnız
  görüntüleme; indirme sunulmuyor).
- **DSİ istatistik arşivi** — bkz. "DSİ istatistik arşivi yerel kopyası".
  Arşivin varlığı sitede yazılı değildi; artık /arsiv/'de dosya sayısıyla
  künyeli (yalnız kaynak olarak tutulur).
- **Havza YAS tahsis/rezerv serisi** — bkz. DSİ istatistikleri; havza
  sayfalarında görünüyordu, artık /arsiv/'de de künyeli.
- **Kurum × işlem yetki matrisi** — bkz. "Apilex hukuki araştırma çıktısı";
  /hangi-kurum/ sayfasında görünür, /arsiv/'de künyeli.
- **MTA / OpenAlex / OpenStreetMap künyeleri** — bkz. "Su potansiyeli
  katmanı"; il sayfalarında görünür, /arsiv/'de toplu künyeli.

SAYIM KURALI: /arsiv/ ve ana sayfa kanıt bandındaki her rakam build anında
veri dosyalarından sayılır (`src/data/vitrin.js`); bu belgeye sabit sayı
yazılmaz — bayatlamasın (28.07 OpenAlex satırı dersi).

GÖRÜNMEZ KALANLAR (gerekçeli, bilinçli): ilçe→il dizini ve CT3 kuyruğu
(iç türetme araçları, yayın değeri yok) · su terim havuzu (iç sözlük) ·
DSİ duyuru taraması (2 kayıt, OCR gürültüsü — yayına değmez) ·
RG "tahsise kapatma/kısıt" alt kümesi (il ataması doğrulanamadı; ayrıntı
VITRIN-RAPORU.md FAZ 3).

## Künye bağlantı bakımı (29 Tem 2026)

Üç akademik künye bağlantısı ölü bulunmuş (md17) ve **içerik doğrulamalı**
olarak onarılmıştır. Ölçüt: HTTP 200 **yetmez** — açılan sayfada kaydın
başlığı ve yazarı aranır.

| Eski | Yeni | Doğrulama |
|---|---|---|
| `dergipark.gov.tr/pajes/issue/26682/286528` | `dergipark.org.tr/tr/pub/pajes/issue/26682/286528` | 200 · "Gölhisar" + "Davraz" sayfada |
| `trdizin.gov.tr/publication/paper/detail/TXpFNE5ETXo=` | `search.trdizin.gov.tr/tr/yayin/detay/31843/...` | 200 · "Berke" + "Özcan" sayfada |
| `doi.org/10.17341/gummfd.60377` | — (DOI çözülmüyor, 404) | `doi` alanı boşaltıldı, `doi_olu` alanında ölçüm tarihiyle KORUNDU; kaydın çalışan yayın sayfası kullanılıyor |

**TUZAK KAYDI:** TR Dizin'in eski base64 kimliği (`TXpFNE5ETXo=`)
"318433" olarak çözülür ve `.../yayin/detay/318433` **HTTP 200 döner** —
ama o sayfa BAŞKA bir yayındır. Yalnız durum koduna bakan bir onarım
künyeye yanlış kaynak yazardı. Doğru kayıt (31843) arama üzerinden
bulunmuştur.

Alan adı taşınması: `dergipark.gov.tr` → `dergipark.org.tr`,
`www.trdizin.gov.tr` → `search.trdizin.gov.tr`.

## İklim/uydu yardımcı katmanları — ÇEKİLDİ, SİTEDE YAYINLANMIYOR (27.08.2026 denetimi)

Bu üç katman 04.08.2026'da çekilmiş ama merkezî künye kaydına hiç
girmemişti (27.08 tam denetimi bulgusu U3). **Üçü de sitede
YAYINLANMIYOR** — `src/` içinde hiçbir yerden import edilmiyorlar,
`dist/`'te adları geçmiyor (ölçüldü: "CHIRPS" 0 sayfa, "Global Surface
Water" 0 sayfa; "ERA5" geçen 12 sayfa OpenAlex'ten gelen akademik yayın
BAŞLIKLARIdır, bizim verimiz değil). Bu yüzden bugün sayfada görünür
atıf yükümlülüğü doğmuyor; depo da herkese açık değil (ölçüldü:
github.com/suharitasi/suharitasi → 404).
**ŞERH: bu katmanlardan biri ileride bir sayfada yayımlanırsa, CC BY 4.0
gereği görünür atıf ZORUNLU olur.**

- **CHIRPS v2.0 (UCSB/CHG) — yağış.** Künye dosyanın kendisinde
  (`data/canli/chirps.json` → `kunye`): çözünürlük 0.05°, lisans
  **CC BY 4.0**, son güncelleme 2026-08-04T10:18:54Z. İçerik: 25 havza ×
  aylık yağış serisi (2017-…). Ham arşiv: `data/arsiv/chirps/`
  (10 NetCDF, gitignore'lu). Üretici: `arac/chirps-cek.py`.
  **Durum: gerçek veri var, yayınlanmıyor.**
- **JRC Global Surface Water 1984-2021 (Landsat).** Künye:
  `data/canli/jrc-yuzey-suyu.json` → çözünürlük 30 m, lisans
  "Free and open (CC BY 4.0)", url global-surface-water.appspot.com.
  **Durum: İSKELE DOSYA — veri YOK.** Ölçüldü: `tile'lar` boş; 25/25
  havza `"durum": "islenmedi (tile bazli hesap gerekir)"`.
  Üretici: `arac/jrc-isle.py`.
- **ERA5-Land (ECMWF/Copernicus) — toprak nemi.** Künye:
  `data/canli/era5-toprak.json` → çözünürlük 0.1° (~9 km), değişken
  "Volumetric soil water layer (m³/m³)", lisans "Copernicus License
  (ücretsiz, kayıtlı)". **Durum: İSKELE DOSYA — veri YOK** (`aylik` boş,
  dosya 274 bayt). Üretici: `arac/era5-toprak.py`.

## DSİ YAS seri dosyaları (data/arsiv/dsi-yas/) — dosya kaydı (27.08.2026)

Kaynak künyesi yukarıdaki "DSİ 2024 resmî su kaynakları istatistikleri"
girişindedir; burada YALNIZ dosya/arşiv yolu kaydı tutulur (27.08 denetimi
bulgusu U4 — dosyalar izliydi ama hiçbir girişte adlandırılmamıştı).

- `data/arsiv/dsi-yas/2024-seti/` ve `data/arsiv/dsi-yas/2019-seti/` —
  toplam 15 xlsx, git izli. 2019 seti 2013-2019 tablolarını taşır.
- Türetilen: `data/canli/havza-yas.json` (havza YAS rezerv/beslenim
  serisi; `/havzalar/*` YAS bandını besler).

## data/kamu/ katmanı — mevzuat türevi iç veri (27.08.2026 kaydı)

Kaynak: doğrudan mevzuat tam metinleri (mevzuat.gov.tr); kayıt bazında
`kaynak_url`/dayanak alanları dosyaların içindedir. Apilex çıktısı bu
katmanın kaynağı DEĞİLDİR (27.08 denetimi U4: atıf yanlış yöne
gösteriyordu). Oluşturma/son güncelleme: 2026-07-23.

- `hangi-kapi.json` (20 satır) — kurum × işlem yetki eşlemesi.
  Dosya beyanı: *"Yalnız mevzuatta yazan yetki atfı aktarılır; hukuki
  yorum YAPILMAZ. Başvuru kanalı yalnız mevzuatta açıkça yazıyorsa
  doldurulur, aksi halde 'kanal doğrulanmadı'. Tahmin yasak."*
- `su-islemleri.json` (20 işlem) — 41 mevzuat belgesinde işlem sözcüğü
  taranarak 1001 ham adaydan süzüldü.
- `su-birimleri.json` (155 kayıt) — su idaresi/kurum birimleri.
- `su-terim-havuzu.json`, `ct3-kuyruk.json` — iç üretim araçları,
  yayın değeri yok (bkz. "Görünmez kalanlar").

## data/lead/ katmanı — Su Verimliliği Yönetmeliği türevi (27.08.2026 kaydı)

- `nace-ek2.json` — Su Verimliliği Yönetmeliği **Ek-2** (NACE bazında
  faaliyetler). Kaynak: resmigazete.gov.tr/eskiler/2024/12/20241227-3-1.pdf
  (arşiv: `data/arsiv/mevzuat/su-verimliligi-yonetmeligi-ekler-20241227-3-1.pdf`,
  sha256 dosyada). **OCR TÜRETİMİDİR:** tesseract 5.3.4 (tur) +
  pdftoppm 600 dpi + ImageMagick ön-işleme; kaynak ek taranmış/görüntü
  tabanlıdır. OCR hata payı dosyanın kendi `aciklama` alanında yazılıdır.
- `persona.json` — sektör kapıları/persona veri temeli. Yönetmelik künyesi
  dosyada (RG 2024-12-27; arşiv
  `data/arsiv/mevzuat/su-verimliligi-yonetmeligi-20241227.htm`).
  Dosya beyanı: *"Yükümlülükler ve son tarihler YALNIZ doğrulanmış
  kaynaktan."*

## veri/potansiyel — kayda eklenen iki dosya (27.08.2026)

Yukarıdaki "Su potansiyeli katmanı" girişi 11 dosya sayıyordu; dizinde 13
var. Eksik ikisi:

- `zenginlestirme.json` — MTA / OpenAlex / TÜİK / OSM türevlerinin
  birleşik çıktısı; kaynak künyeleri dosyanın içinde ve yukarıdaki
  katman girişinde.
- `ilce-morfoloji.json` — **SENTETİK TÜRETME, gerçek ilçe ölçümü
  DEĞİLDİR.** Dosyanın kendi künyesi (birebir): *"Bu veri GERÇEK ilçe
  ölçümü DEĞİLDİR. İl düzeyindeki Copernicus GLO-90 DEM verisinden ilçe
  ismiyle tohuma bağlı varyasyonla türetilmiştir (±%15 deterministik
  varyasyon)."* 948 ilçe. `/ilce-sorgu/` sayfası bunu tüketiyor.
  **AÇIK KARAR:** sayfadaki sunumu bu künyeyle çelişiyor (27.08 denetimi
  K7; rapor/26-08-denetim-KARARLAR-BEKLEYEN.md).
