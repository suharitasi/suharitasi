// GOL/NEHiR VERi MODULU — GeoJSON verisinden slug → detay eslemesi.
// Goller ve nehirler icin ortak slug uretimi, ozet metin olusturma,
// ve getStaticPaths verisi.
import goller from './tr-goller.json';
import nehirler from './tr-nehirler.json';

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

let _adsizSayacGol = 0;
let _adsizSayacNehir = 0;

/** Tum goller icin { slug, ad, alan_km2, tip, kaynak, bbox, merkez } */
export function tumGoller() {
  _adsizSayacGol = 0;
  const seen = new Set();
  return goller.features.map((f) => {
    const p = f.properties;
    const b = f.bbox || [0, 0, 0, 0];
    let slug = golNehirSlug(p.ad);
    if (slug === 'isimsiz') slug = `gol-${++_adsizSayacGol}`;
    // Cakisan slug'lara ek ekle (ayni adli iki gol olursa)
    if (seen.has(slug)) {
      let i = 2;
      while (seen.has(`${slug}-${i}`)) i++;
      slug = `${slug}-${i}`;
    }
    seen.add(slug);
    return {
      slug,
      ad: p.ad,
      alan_km2: p.alan_km2,
      tip: p.tip,
      kaynak: p.kaynak,
      bbox: b,
      merkez: [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2],
      geometry: f.geometry,
    };
  });
}

/** Tum nehirler icin { slug, ad, noktaSayisi, kaynak, bbox, merkez } */
export function tumNehirler() {
  _adsizSayacNehir = 0;
  const seen = new Set();
  return nehirler.features.map((f) => {
    const p = f.properties;
    const b = f.bbox || [0, 0, 0, 0];
    let slug = golNehirSlug(p.ad);
    if (slug === 'isimsiz') slug = `nehir-${++_adsizSayacNehir}`;
    if (seen.has(slug)) {
      let i = 2;
      while (seen.has(`${slug}-${i}`)) i++;
      slug = `${slug}-${i}`;
    }
    seen.add(slug);
    return {
      slug,
      ad: p.ad,
      noktaSayisi: f.geometry.coordinates.length,
      kaynak: p.kaynak,
      bbox: b,
      merkez: [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2],
      geometry: f.geometry,
    };
  });
}

/** Gol icin ozet metin (oz-cevap) */
export function golOzet(gol) {
  const parcalar = [];
  parcalar.push(`${gol.ad}`);
  if (gol.tip === 'reservoir' || gol.ad.includes('Baraj')) {
    parcalar.push('bir baraj gölüdür');
  } else {
    parcalar.push('bir doğal göldür');
  }
  if (gol.alan_km2 != null) {
    parcalar.push(`ve yaklaşık ${gol.alan_km2.toLocaleString('tr-TR')} km² yüzey alanına sahiptir`);
  }
  parcalar.push(`(kaynak: ${gol.kaynak}).`);
  return parcalar.join(', ').replace('bir, ', 'bir ');
}

/** Nehir icin ozet metin */
export function nehirOzet(nehir) {
  const parcalar = [];
  parcalar.push(`${nehir.ad}`);
  parcalar.push('Türkiye akarsu ağında yer alan bir nehirdir');
  if (nehir.noktaSayisi) {
    // Nokta sayisindan yaklasik uzunluk tahmini (her nokta ~0.5-1 km)
    const tahminiKm = Math.round(nehir.noktaSayisi * 0.7);
    parcalar.push(`(kaynak: ${nehir.kaynak}).`);
  } else {
    parcalar.push(`(kaynak: ${nehir.kaynak}).`);
  }
  return parcalar.join(', ').replace('bir, ', 'bir ');
}
