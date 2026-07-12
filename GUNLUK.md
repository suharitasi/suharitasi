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
- Faz 1 görsel düzeltme: pitch ~57°, kadraj dolduruldu, abartma 4.2x, alçak
  açılı ışık + NeutralToneMapping, kenarlar alphaMap+vignette ile suya
  çözünüyor. WebGL yoksa statik atlas yedeği eklendi.
- "Canlı model" turu: animasyonlu deniz/göl shader'ı (atlas maskesi, güneş
  parıltısı, kıyı geçişi), bulut gölgeleri (fragment enjeksiyonu), kamera
  idle drift, güneş salınımı, sürekli yaşayan gayzerler (işaret ışımaları +
  periyodik kendiliğinden fışkırma), kenar eteği geometrisi (alphaMap/vignette
  kaldırıldı), exposure 1.32. Geometri sağlığı denetlendi: 4.2x'te artefakt yok.
- Faz 2: gayzer etkileşimi — 7 su noktasında (göller/barajlar) hover/dokunma
  ile additive partikül sütunu + taban ışıması; reduced-motion'da statik
  işaret. 60 FPS doğrulaması gerçek GPU bekliyor (FAZ2 bitti tanımının
  açık kalemi).
- Faz 3A: giriş animasyonu (kamera uzaktan kadraja süzülür, reduced-motion
  atlar), mobil portre kadraj sığdırma (dinamik fov+mesafe), göl geometrileri
  tek mesh'e birleştirildi, mobil pixelRatio 1.5, FPS logu 5 örnekle sınırlı.
  3B (koreografi, seçim etkileşimi, son cila) kullanıcı yorumunu bekliyor.
- VIZYON.md oluşturuldu (Sondaj Anı + ileri teknikler envanteri); madde 1
  prototipi eklendi: gayzer tepe noktasında cam sıçraması (cam.js).
- Faz 3B: kamera koreografisi — su noktasına tıklayınca sinematik dalış,
  boşluğa/aynı noktaya tıklayınca kadraja dönüş; uçuşlar duvar saatiyle
  (yavaş cihazda süre sabit), uçuş sırasında OrbitControls devre dışı.
- Landing turu: Arslan kalkan logosu (arslanhukuk.tr assets'ten, currentColor)
  bakır imza olarak footer'a işlendi (tamamı arslanhukuk.tr'ye link);
  koreografiye imza dokunuşu eklendi — son kelime otururken altından tek
  akuamarin damar ışıyıp geçiyor.
- Nesne turu (v5): Türkiye sınırla kesilmiş extrude blok (üst rölyef +
  katman çizgili yan kesit + kapalı taban; sinir.py il birleşimi).
  Maskedeki il-arası sliver delikleri kapatıldı. Atlas doygun kalibre
  edildi (poster referans dosyası bulunamadı, hex bantlarına göre).
  Gayzerler haritadan kalktı, kenar fıskiyelerine dönüştü; su noktaları
  iki katman işaret (var/potansiyel) + krem etiket. Deniz ayrı yüzey,
  ufukta koyuya çözünüyor. EffectComposer bloom + ACES; orbit yaw ±60.
- Nihai sahne kurgusu (v6): deniz tepsisi kaldırıldı — Türkiye kütlesi koyu
  derin-su zeminde boşlukta, altında siluet ışıma havuzu. Kamera sabitlendi
  (orbit kapalı; dalış koreografisi kurgu gereği kaldırıldı), idle nefes +
  ±1° paralaks. Kenar gayzerleri ekran alt kenarına nefesli zamanlamayla
  yerleşti; yukarıdan 5-8 sn'de bir süzülen damlalar + çarpma parıltısı.
  İşaretler belirginleştirildi, kesit yumuşak sıcak toprağa çekildi.
