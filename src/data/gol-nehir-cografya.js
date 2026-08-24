// GÖL/NEHİR COĞRAFYA EŞLEMESİ (24.08.2026, agustos-uyum M5.7 + M5.2).
// NEDEN: 04.08 Overpass çekimi bbox tabanlıydı ve SINIR ÖTESİ gölleri de
// aldı (ölçüm: 29 gölün adı Gürcüce/Farsça/Arapça — Hançalı Gölü/Gürcistan,
// Sioni Barajı/Gürcistan vb.). Bu sayfalar "Türkiye Gölleri" başlığıyla
// yayındaydı = veri kaynağı olmayan coğrafya iddiası. Bu modül:
//   1) Türkiye kapsamı testi: özniteliğin ÖRNEKLENMİŞ geometri noktalarından
//      en az biri 81 il çokgeninden (src/data/tr-iller.json, MultiPolygon)
//      birinin içinde mi — değilse sayfa ÜRETİLMEZ (elenenler loglanır).
//   2) İl eşlemesi: içeride kalan ilk örnek noktanın ili.
//   3) Havza eşlemesi: data/havzalar/havzalar-web.geojson (25 havza) ile
//      aynı testin havza karşılığı; nehirlerde GEÇTİĞİ TÜM havzalar.
// Yöntem şerhi (sayfada da basılır): eşleme geometrik örneklemedir,
// idari/hidrografik tescil DEĞİLDİR.
import { readFileSync } from 'node:fs';

// JSON'lar fs ile okunur (Vite build + çıplak node testinde AYNI davranış;
// import-attribute farkı iki ortamda ayrışıyordu).
// Yol, PROJE KÖKÜNE göredir (process.cwd()): Astro build sırasında modül
// dist/chunks'a paketlenir ve import.meta.url oraya işaret eder (ölçüldü:
// ENOENT dist/chunks/tr-iller.json) — cwd tabanlı okuma iki ortamda da doğru.
const iller = JSON.parse(readFileSync('src/data/tr-iller.json', 'utf8'));
const havzalarGeo = JSON.parse(readFileSync('data/havzalar/havzalar-web.geojson', 'utf8'));

const TR_ASCII = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
                   Ç: 'C', Ğ: 'G', I: 'I', İ: 'i', Ö: 'O', Ş: 'S', Ü: 'U' };
const slugla = (ad) => ad.split('').map((c) => TR_ASCII[c] ?? c).join('')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Işın sayımı — [lon,lat] noktası tek halka içinde mi
function halkaIcinde([x, y], halka) {
  let icinde = false;
  for (let i = 0, j = halka.length - 1; i < halka.length; j = i++) {
    const [xi, yi] = halka[i], [xj, yj] = halka[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) icinde = !icinde;
  }
  return icinde;
}
function geomIcinde(nokta, geometry) {
  const cokgenler = geometry.type === 'Polygon' ? [geometry.coordinates]
    : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
  for (const cg of cokgenler) {
    if (!halkaIcinde(nokta, cg[0])) continue;          // dış halka
    if (cg.slice(1).some((delik) => halkaIcinde(nokta, delik))) continue;
    return true;
  }
  return false;
}

// tr-iller.json 'Afyon' taşıyor; ilin resmî adı ve sitedeki sayfa slug'ı
// Afyonkarahisar'dır (il-profil ile ölçülerek eşitlendi — kırık bağ önlenir).
const IL_AD_DUZELT = { Afyon: 'Afyonkarahisar' };
const ilListesi = iller.features.map((f) => {
  const ad = IL_AD_DUZELT[f.properties.name] ?? f.properties.name;
  return { ad, slug: slugla(ad), geometry: f.geometry };
});
const havzaListesi = havzalarGeo.features.map((f) => ({
  ad: f.properties.ad, no: f.properties.no,
  slug: slugla(f.properties.ad.replace(/\s*Havzası\s*$/, '')), geometry: f.geometry }));

export function ilBul(nokta) {
  return ilListesi.find((i) => geomIcinde(nokta, i.geometry)) ?? null;
}
export function havzaBul(nokta) {
  return havzaListesi.find((h) => geomIcinde(nokta, h.geometry)) ?? null;
}

// Geometriden örnek noktalar (her tipte [lon,lat] listesi; en çok `adet`)
export function ornekNoktalar(geometry, adet = 24) {
  let noktalar = [];
  if (geometry.type === 'LineString') noktalar = geometry.coordinates;
  else if (geometry.type === 'MultiLineString') noktalar = geometry.coordinates.flat();
  else if (geometry.type === 'Polygon') noktalar = geometry.coordinates[0];
  else if (geometry.type === 'MultiPolygon') noktalar = geometry.coordinates.map((c) => c[0]).flat();
  if (noktalar.length <= adet) return noktalar;
  const adim = Math.floor(noktalar.length / adet);
  return noktalar.filter((_, i) => i % adim === 0).slice(0, adet);
}

/** Özniteliğin Türkiye kapsam/il/havza eşlemesi.
 *  { turkiyede, il: {ad,slug}|null, havzalar: [{ad,no,slug}...] } */
export function cografyaEsle(geometry) {
  const noktalar = ornekNoktalar(geometry);
  let il = null;
  const havzaSet = new Map();
  for (const n of noktalar) {
    if (!il) il = ilBul(n);
    const h = havzaBul(n);
    if (h && !havzaSet.has(h.slug)) havzaSet.set(h.slug, h);
  }
  return { turkiyede: il !== null, il, havzalar: [...havzaSet.values()] };
}
