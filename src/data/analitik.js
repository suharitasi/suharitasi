// GA4 ÖLÇÜM KİMLİĞİ (13.09.2026).
//
// BOŞ BIRAKILDI → site çerezsiz kalır, GA4 yüklenmez. GA4 aktif etmek için
// Google Analytics'te bir property oluşturup ölçüm kimliğini (G-XXXXXXX)
// buraya yaz. O andan itibaren:
//   - KVKK onay banner'ı görünür (src/components/Analitik.astro),
//   - kullanıcı onay verirse GA4 + olaylar yüklenir,
//   - olcum.js zaten window.dataLayer'a 'temas' olayı itiyor; GA4 bunu alır.
//
// NOT: GA4 çerez kullandığı için KVKK aydınlatma metni (/gizlilik/) ve açık
// onay ZORUNLUDUR — bu bileşen onu uygular.
export const GA4_ID = '';
