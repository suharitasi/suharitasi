// GÖL/NEHİR VERİ MODÜLÜ — GeoJSON verisinden slug → detay eşlemesi.
// 24.08.2026 (agustos-uyum M4+M5): 04.08 sürümünün üç kusuru ölçülerek
// düzeltildi:
//   1) KAPSAM: Overpass bbox çekimi sınır ötesi öznitelikleri de almıştı
//      (ölçüm: 32 göl + 36 nehir Türkiye dışında — Gürcü/Ermeni/Bulgar/
//      İran/Irak/Yunan adlarıyla). Bunlar "Türkiye Gölleri" başlığıyla
//      yayındaydı = kaynağı olmayan coğrafya iddiası. Artık geometri
//      örneklemi 81 il çokgeninin (tr-iller.json) dışında kalanlar
//      ÜRETİLMEZ; elenenler elenenGoller()/elenenNehirler() ile raporlanır.
//   2) TÜRKÇE: şablon metinleri aksansızdı ("Dogal gol", "Turkiye") ve
//      özet cümlesi virgül dizimiyle bozuktu ("bir doğal göldür, ve ...").
//   3) UYDURMA ADAYI: nokta sayısından "tahmini uzunluk" üreten ÖLÜ KOD
//      (tahminiKm) silindi — hiç basılmamıştı, veri karşılığı yoktu.
// Erişim/kapsam künyesi KAYNAKLAR.md kaydından: Overpass çekimi 04.08.2026,
// göllerde 0,5 km² üstü filtre; OSM verisi ODbL 1.0.
import { readFileSync } from 'node:fs';
import { cografyaEsle } from './gol-nehir-cografya.js';

// JSON'lar fs ile okunur (Vite + çıplak node testinde aynı davranış).
const goller = JSON.parse(readFileSync('src/data/tr-goller.json', 'utf8'));
const nehirler = JSON.parse(readFileSync('src/data/tr-nehirler.json', 'utf8'));

export const GOLNEHIR_ERISIM = '04.08.2026';
export const GOLNEHIR_KAPSAM_GOL = 'OpenStreetMap (natural=water) + Natural Earth 10m; 0,5 km² üstü';
export const GOLNEHIR_KAPSAM_NEHIR = 'OpenStreetMap (waterway=river) ana akarsu hatları';
export const GOLNEHIR_LISANS = '© OpenStreetMap katkıcıları (ODbL 1.0) · Natural Earth kamu malı';

// K19 (27.08.2026): otorite bağı — 342 göl/nehir sayfası kaynak ADINI
// yazıp bağ vermiyordu. URL'ler bu sunucudan sınandı (HTTP 200):
//   openstreetmap.org/copyright · naturalearthdata.com 10m fiziki vektörler
// Doğrulanamayan hiçbir adres yazılmadı.
export const KAYNAK_BAGLARI = {
  'OpenStreetMap': 'https://www.openstreetmap.org/copyright',
  'Natural Earth (10m)': 'https://www.naturalearthdata.com/downloads/10m-physical-vectors/',
  'Natural Earth': 'https://www.naturalearthdata.com/downloads/10m-physical-vectors/',
};
/** Kaynak adına karşılık gelen resmî adres; bilinmiyorsa null (uydurma yasağı). */
export function kaynakBagi(ad) {
  return KAYNAK_BAGLARI[ad] ?? null;
}

const TR_ASCII = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
                   Ç: 'C', Ğ: 'G', I: 'I', İ: 'i', Ö: 'O', Ş: 'S', Ü: 'U' };

export function golNehirSlug(ad) {
  const slug = ad
    .split('')
    .map((c) => TR_ASCII[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'isimsiz';
}

// Göl türü: veri alanı `tip` → çekimli Türkçe karşılık. Veri tip taşımıyorsa
// genel "göl" denir — tahmin YAZILMAZ.
const TIP_METNI = {
  reservoir: { ad: 'Baraj gölü', cekim: 'bir baraj gölüdür' },
  lake:      { ad: 'Doğal göl',  cekim: 'bir doğal göldür' },
  lagoon:    { ad: 'Lagün',      cekim: 'bir lagündür' },
  pond:      { ad: 'Gölet',      cekim: 'bir gölettir' },
};
export function golTipi(gol) {
  return TIP_METNI[gol.tip] ?? { ad: 'Göl', cekim: 'bir göldür' };
}

function insaEt(features, onek) {
  const seen = new Set();
/** K11 (27.08.2026): OSM `name` alanı sınır sularında ÇOK DİLLİ gelir
 *  ("Έβρος/Meriç/Марица", "Резовска река - Mutludere", "Aras / Արաքս").
 *  Sayfa başlığı bu ham dizeyi basıyordu. Burada latin-harfli bileşen
 *  AYIKLANIR — çeviri YAPILMAZ, ad UYDURULMAZ: yalnız kaynakta zaten
 *  yazan parça seçilir. Latin bileşen yoksa ham ad korunur.
 *  Tam ad künyede `ad_kaynakta` olarak saklanır. */
/** Ayıklanmış ad başka bir kayıtla ÇAKIŞIYORSA ham ad korunur — aksi
 *  halde iki ayrı su kütlesi aynı başlığı taşır (ölçülen vaka: OSM'de
 *  "Aras" ve "Aras / Արաքս" iki ayrı kayıt; ayıklama ikisini de "Aras"
 *  yapıp <title> tekrarı üretmişti). */
function benzersizAd(ham, gorulen) {
  const ad = gorunenAd(ham);
  const secim = gorulen.has(ad) ? ham : ad;
  gorulen.add(secim);
  return secim;
}

function gorunenAd(ham) {
  const parcalar = String(ham ?? '').split(/\s*[/|·]\s*|\s+-\s+/).map((x) => x.trim()).filter(Boolean);
  if (parcalar.length < 2) return ham;
  const latin = parcalar.filter((x) => /^[A-Za-zÇĞİIÖŞÜçğıiöşü0-9\s.'-]+$/u.test(x));
  return latin.length ? latin[0] : ham;
}

  const icinde = [], elenen = [];
  const adlar = new Set();
  let adsiz = 0;
  for (const f of features) {
    const p = f.properties;
    const b = f.bbox || [0, 0, 0, 0];
    const cografya = cografyaEsle(f.geometry);
    if (!cografya.turkiyede) { elenen.push({ ad: p.ad, kaynak: p.kaynak }); continue; }
    let slug = golNehirSlug(p.ad);
    if (slug === 'isimsiz') slug = `${onek}-${++adsiz}`;
    if (seen.has(slug)) { let i = 2; while (seen.has(`${slug}-${i}`)) i++; slug = `${slug}-${i}`; }
    seen.add(slug);
    icinde.push({
      slug, ad: benzersizAd(p.ad, adlar), ad_kaynakta: p.ad, kaynak: p.kaynak,
      alan_km2: p.alan_km2 ?? null, tip: p.tip ?? null,
      bbox: b, merkez: [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2],
      geometry: f.geometry, cografya,
    });
  }
  return { icinde, elenen };
}

let _gol = null, _nehir = null;
function golVeri() { if (!_gol) _gol = insaEt(goller.features, 'gol'); return _gol; }
function nehirVeri() { if (!_nehir) _nehir = insaEt(nehirler.features, 'nehir'); return _nehir; }

/** Türkiye kapsamındaki göller (il/havza eşlemeli) */
export function tumGoller() { return golVeri().icinde; }
/** Türkiye kapsamındaki nehirler */
export function tumNehirler() { return nehirVeri().icinde; }
/** Kapsam dışı bırakılanlar (rapor + /kullanilanlar şerhi için) */
export function elenenGoller() { return golVeri().elenen; }
export function elenenNehirler() { return nehirVeri().elenen; }

/** Göl için özet metin (öz-cevap + meta description) — her parça VERİDEN. */
export function golOzet(gol) {
  const tur = golTipi(gol);
  const yer = gol.cografya.il ? `${gol.cografya.il.ad} ili sınırlarında ` : '';
  const gövde = `${gol.ad}, ${yer}${tur.cekim}`;
  const alan = gol.alan_km2 != null
    ? `; yaklaşık ${gol.alan_km2.toLocaleString('tr-TR')} km² yüzey alanına sahiptir`
    : '';
  return `${gövde}${alan} (kaynak: ${gol.kaynak}, erişim ${GOLNEHIR_ERISIM}).`;
}

/** Nehir için özet metin — havza bilgisi geometrik örneklemden. */
export function nehirOzet(nehir) {
  const h = nehir.cografya.havzalar;
  const havzaMetni = h.length === 0
    ? `Türkiye sınırları içinde akan bir akarsudur`
    : h.length === 1
      ? `${h[0].ad.replace(/\s*Havzası\s*$/, '')} Havzası'ndan geçen bir akarsudur`
      : `${h.map((x) => x.ad.replace(/\s*Havzası\s*$/, '')).join(', ')} havzalarından geçen bir akarsudur`;
  return `${nehir.ad}, ${havzaMetni} (kaynak: ${nehir.kaynak}, erişim ${GOLNEHIR_ERISIM}).`;
}

/** Ters eşleme (il/havza sayfalarının "geri bağı" — M5.7 ada-kalmaz kuralı). */
export function ilinGolleri(ilSlug) {
  return tumGoller().filter((g) => g.cografya.il?.slug === ilSlug);
}
export function ilinNehirleri(ilSlug) {
  return tumNehirler().filter((n) => n.cografya.il?.slug === ilSlug);
}
export function havzaninGolleri(havzaSlug) {
  return tumGoller().filter((g) => g.cografya.havzalar.some((h) => h.slug === havzaSlug));
}
export function havzaninNehirleri(havzaSlug) {
  return tumNehirler().filter((n) => n.cografya.havzalar.some((h) => h.slug === havzaSlug));
}
