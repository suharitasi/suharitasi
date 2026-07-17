// GÖRSEL SLOT SÖZLEŞMESİ (DESIGN.md §14) — tek bakım noktası.
//
// Kullanıcı Midjourney görsellerini üretince yapılacak TEK şey:
//   1. Dosyaları public/gorsel/ altına koy (ör. public/gorsel/rehber-hero.jpg
//      — jpg/webp/avif hangisi verilirse).
//   2. Aşağıdaki null değerini yol ile değiştir: '/gorsel/rehber-hero.jpg'
// Build sonrası görsel TÜM ilgili slotlara oturur; sayfa sayfa elle
// yerleştirme YOKTUR (GorselSlot.astro bu config'i okur).
//
// null olduğu sürece slot, derinlik-skalası tonlarından zarif degrade
// placeholder gösterir (boş gri kutu yasak — DESIGN.md §14).
export const GORSELLER = {
  // 3:1 — rehber sayfası üst hero bandı (önerilen kaynak ≥2400×800)
  'rehber-hero': null,
  // 16:9 — havza indeks kartlarının zemini (önerilen ≥1200×675)
  'havza-kart-zemini': null,
  // 4:1 — bölüm/indeks vinyeti: hakkında + su-kanunu üstü (önerilen ≥1600×400)
  'bolum-vinyeti': null,
};
