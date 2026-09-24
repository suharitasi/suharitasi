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

// CLOUDFLARE WEB ANALYTICS TOKEN (24.09.2026, P1 Faz 1).
//
// GA4 Admin API kotaya/403'e takıldığı için çerezsiz/hafif resmî Cloudflare
// Web Analytics beacon'ı şablona eklendi. TOKEN BOŞ BIRAKILDI → beacon
// yüklenmez (site davranışı değişmez). Aktif etmek için:
//   Cloudflare paneli → Web Analytics → Add site → suharitasi.com (JS snippet)
//   → snippet içindeki "token" değerini buraya yaz.
// Beacon resmî ve çerezsizdir; CSP (public/_headers) zaten
// static.cloudflareinsights.com + cloudflareinsights.com izinli.
export const CF_ANALYTICS_TOKEN = '';
