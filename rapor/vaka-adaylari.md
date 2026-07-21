# VAKA GENİŞLEME ADAYLARI
*ODUL-ÜSTÜ FAZ 7 AŞAMA 1 · madde 12*

## Kaynak durumu: KAP taraması ERİŞİLEMEDİ → aday listelenemedi
`rapor/kap-su-taramasi.md` (2026-07-21) sonucu: **KAP JSON API'sine
erişilemedi** — KAP sitesi Next.js'e taşınmış, eski `byCriteria` ucu HTTP 500;
hiçbir bildirim/aday listelenmedi. Bu bir TR-IP engeli değil, API yolu değişimi.

**Uydurma yasağı:** KAP verisi olmadan MEYSU kalıbına "5 aday" ÜRETİLMEDİ.
Sahte KAP künyesi / şirket adı yazmak yasaktır. Bu belge, kaynak açılınca
doldurulacak iskelettir.

## Elde doğrulanmış tek vaka (mevcut)
- **Meysu Gıda** — İncesu Subaşı mineralli su işletme ruhsatı (KAP 1604957 +
  1597446 + 1599068). Yayında: /vaka/meysu/. Kalıp referansı.

## Aday üretimi için gereken (KULLANICI GÖREVİ)
Aşağıdakilerden biriyle 5 aday türetilir (hepsi mevcut MEYSU kalıbına uyarlı —
"su güvencesi / ruhsat / tahsis" içeren KAP özel durum açıklamaları):
1. Yeni KAP API ucu: bildirim-sorgu sayfasında bir sorgu çalıştırıp DevTools
   ağ sekmesinden XHR/fetch isteğini (uç + payload + başlık) kopyalayın →
   `arac/` taraması güncellenir, HAM ADAY listesi (şirket | tarih | özet | link)
   otomatik çıkar.
2. Ya da elle: KAP'ta "su verimliliği / arıtma / sondaj / kaynak suyu / baraj"
   anahtar kelimeleriyle son 90 gün özel durum açıklamalarından 5-10 bildirim
   künyesi paylaşın → her biri tek paragraf gerekçeyle MEYSU kalıbına oturur.

## Aday kalıbı (doldurulacak — her aday)
```
- ad: "[şirket] — [tek cümle: hangi su hakkı/ruhsat/uyuşmazlık]"
  gerekce: "[neden MEYSU kalıbına uygun — su güvencesi/ruhsat/tahsis boyutu]"
  kap: ["bildirim no + tarih", ...]   # yalnız gerçek KAP künyeleri
```
Sayfa üretimi kullanıcı aday seçimi sonrası (uydurma yok; her sayı KAP künyeli).
