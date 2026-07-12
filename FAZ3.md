# FAZ 3 — Cila

Faz 2 bittikten sonra uygulanır.

## Kapsam
1. **Kamera giriş animasyonu**: sayfa açılışında kamera yüksekten/uzaktan
   mevcut kompozisyona sinematik iner (2-3 sn, ease-out; reduced-motion'da
   atlanır). OrbitControls animasyon bitene dek kilitli.
2. **Yükleme sekansı**: "harita derinleşiyor…" satırı korunur; arazi
   yüklenince overlay sönerken kamera girişi başlar — tek akışkan sekans.
3. **İl/havza seçim etkileşiminin 3D'ye uyarlanması**: raycaster ile
   il (ileride havza) tespiti; seçili bölgenin sınır çizgisi 3D yüzeye
   yansıtılır (Line2 / yükseltilmiş çizgi), krem lejant kartı geri gelir
   (src/harita-2d/ arşivindeki kart dili). Mobilde dokunma.
4. **Performans optimizasyonu**: draw call sayımı, geometri LOD
   (uzaklaşınca segment düşür), texture boyut denetimi, mobilde
   pixelRatio 1.5 sınırı, FPS logunun kaldırılıp gerçek telemetriye
   çevrilmesi ya da tamamen susturulması.
5. **Mobil kadraj**: portrede kompozisyon iyileştirmesi (Faz 1 notu —
   plane portrede bandı dolduruyor; kamera/fov mobile göre ayarlanacak).

## Bitti tanımı
Giriş animasyonu + seçim etkileşimi + mobil kadraj tamam; gerçek cihazda
60 FPS; Lighthouse performans regresyonu yok; ekran görüntüleri yenilenmiş,
GUNLUK.md güncellenmiş, commit atılmıştır.
