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
