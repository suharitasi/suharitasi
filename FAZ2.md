# FAZ 2 — Su fışkırması / gayzer partikül etkileşimi

Kullanıcı "faz 2" dediğinde bu dosya okunur ve uygulanır.

## Hedef
Haritadaki su noktalarında (göller, ileride havza merkezleri) hover'da
yerden yükselen ışıltılı bir su sütunu — gayzer. Ses yok. Abartısız,
sinematik: parlama patlaması değil, zarif bir ışık/su dikitleri demeti.

## Davranış
- Masaüstü: imleç su noktasının üzerine gelince sütun 0.5-1 sn'de yükselir,
  imleç ayrılınca yumuşakça söner (damla ikonu/klipart YOK).
- Mobil: dokunma aynı etkiyi verir; ikinci dokunuş veya boşluğa dokunma söndürür.
- prefers-reduced-motion: partikül animasyonu yerine statik, soluk bir
  ışıma işareti.

## Teknik çerçeve
- main.js'teki `guncellenecekler` dizisine takılan bağımsız bir modül
  (harita/gayzer.js): `gayzerKur(rig, kamera)` → update fonksiyonu döner.
- Partiküller: THREE.Points + custom shader ya da InstancedMesh;
  200-400 partikül/sütun, additive blending, akuamarin değil —
  atlas diline uygun soğuk su tonu (#5E8A87 → beyaza doğru).
- Su noktaları: src/data/tr-goller.json centroid'leri; lon/lat → plane
  koordinatı dönüşümü için arazi.js'e yardımcı fonksiyon eklenir
  (atlas kapsam sabitleri orada).
- Hover tespiti: raycaster ile plane üzerinde nokta; su noktasına
  yakınlık eşiği (ekran-uzayı değil dünya-uzayı, ~0.3 birim).
- Performans: tek geometri havuzu, aynı anda en fazla 1-2 aktif sütun;
  mob遍de partikül sayısı yarıya iner.

## Bitti tanımı
Van/Tuz/Beyşehir/Keban/Atatürk üzerinde hover→sütun çalışır, 60 FPS
korunur (gerçek GPU'da), reduced-motion yolu var, mobil dokunma çalışır,
ekran görüntüleriyle doğrulanmış ve commit'lenmiştir.
