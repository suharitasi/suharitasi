# mock-kure — arşiv (2026-07-25)

Ana sayfa küre denemesinin FAZ 1 mock'u. WebGL yüzey-sarma yolu
kapandı: küreye sarılan videolarda sahneler tanınmıyor, bu "6 sahne
de tanınacak" şartıyla geometrik olarak çelişiyor.

SİLİNMEDİ. Küre işi tek-parça Midjourney görseli yönüne döndü;
bu dosya referans olarak saklanıyor.

İçerik:
- mock-kure.astro — rota kaynağı (eskiden /mock-kure/)
- atlas-6.mp4 + atlas-6-poster.jpg — 6 sahnenin 3×2 atlas dokusu
  (2496×928), yalnız bu mock tarafından kullanılıyordu

GERİ GETİRİLİRSE DİKKAT:
- mock-kure.astro:7 import yolu '../data/anasayfa-sorular.js' —
  bu konumdan çözülmez, geri getirilirken düzeltilmeli
- mock-kure.astro:159 ve :228 atlas dosyalarına public/ yolu ile
  referans veriyor, o yollar da güncellenmeli
- mock-kure.astro:21'deki build-zamanı doğrulaması (brief sırasındaki
  soru yoksa throw) bu sayfa derlenmediği için artık çalışmıyor
