// GA4 ÖLÇÜM KİMLİĞİ (13.09.2026; ETKİNLEŞTİRİLDİ 05.10.2026, P6-A).
//
// AKTİF: GA4_ID dolu → onay banner'ı görünür; kullanıcı ONAY VERİRSE GA4 +
// olaylar yüklenir (Analitik.astro; onay öncesi sıfır istek — ölçüldü).
//   - KVKK onay banner'ı (src/components/Analitik.astro) zorunlu kapıdır,
//   - anonymize_ip açık; reklam sinyalleri (ad_storage) kapalı,
//   - /gizlilik/ metni bu gerçekle uyumlandı (P6-A).
export const GA4_ID = 'G-NRJZLX0CPR';

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
