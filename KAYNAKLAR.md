# KAYNAKLAR.md — veri kaynakları ve lisanslar

## Türkiye il sınırları (GEÇİCİ VERİ)

- Dosya: `src/data/tr-iller.json` (81 il, MultiPolygon, `name` + `number` property'leri)
- Kaynak: https://github.com/alpers/Turkey-Maps-GeoJSON — `tr-cities.json`, master dalı
- Lisans: Apache-2.0
- İndirme tarihi: 2026-07-12

> NOT: İl sınırları geçici yer tutucudur. Asıl hedef 25 su havzası
> (DSİ havza sınırları) — güvenilir açık kaynaklı havza GeoJSON'u
> bulunduğunda bu veri değiştirilecek ve bu dosyaya işlenecek.

## Arazi yükseklik verisi (DEM / hillshade)

- Kaynak: AWS Open Data — Terrain Tiles (Mapzen mirası), `elevation-tiles-prod`
  S3 kovası, terrarium PNG formatı:
  `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`
- Lisans: veri kamusal kaynaklardan derlenmiştir (SRTM/NASA, USGS vd.);
  kullanım ücretsiz, atıf gerekli — haritada attribution kontrolüyle veriliyor.
  Ayrıntı: https://registry.opendata.aws/terrain-tiles/
- Kullanım tarihi: 2026-07-12
- YAYIN ÖNCESİ NOT: Dış bağımlılığı azaltmak için Türkiye kapsamındaki
  tile'ların kendi Cloudflare R2 kovamıza kopyalanması seçeneği
  değerlendirilecek.

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
