# GUNLUK.md — seans notları

## 2026-07-12
- Repo sıfırdan kuruldu (önceki oturumun dosyaları kaydedilmemişti): derin-su
  landing, DESIGN.md, deploy dosyaları (_headers, robots, 404, favicon, og).
- Harita v1: Vite + MapLibre, il GeoJSON'u, hover/dokunma + bilgi kartı.
- Harita v2: AWS terrarium DEM ile koyu hillshade, Natural Earth nehir/göl
  katmanı, yükleme durumu.
- Kullanıcı atlas stilini seçti: v3 başladı — offline hipsometrik boyama
  (gdaldem, arac/atlas/), harita adası düzeni, atlas dili kart, kabarcık
  atmosferi (yoğuşma varyantı elendi). Canlı S3 tile bağımlılığı kaldırıldı.
- Harita v4 Faz 1: Three.js gerçek 3D arazi — heightmap (16-bit PNG + bin),
  CPU displacement, atlas dokusu, sınırlı orbit + paralaks, şeffaf sahne.
  MapLibre kodu src/harita-2d/ arşivinde. Faz 2 (gayzer) ve Faz 3 (cila)
  FAZ2.md/FAZ3.md'de tanımlı. Not: headless FPS ölçümü yazılım render'ı,
  gerçek GPU'da doğrulanacak.
