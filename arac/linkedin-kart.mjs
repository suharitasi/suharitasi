/* LinkedIn kart üretici (ODUL-USTU FAZ 7 AŞAMA 1, madde 7).
   Girdi: kart tanımı (kategori, büyük değer, birim, başlık, kaynak).
   Çıktı: 1200×627 PNG (SU-DİLİ atlas: krem zemin + kot cetveli hairline +
   alt su-degrade; hero-number dataviz kuralı — tek büyük değer, grafik değil).
   SVG → PNG: sharp (librsvg). Fontlar sistem fallback'ine düşer (Cormorant/
   Manrope kurulu değilse serif/sans); üretimde marka fontu gömülebilir —
   rapor notu. Değerler YALNIZ doğrulanmış veriden (uydurma yasağı).
   Kullanım: node arac/linkedin-kart.mjs */
import sharp from '/home/suha/projeler/suharitasi/node_modules/sharp/lib/index.js';
import { mkdirSync } from 'node:fs';

const CIKTI = '/home/suha/projeler/suharitasi/cikti/pazarlama';
mkdirSync(CIKTI, { recursive: true });

// SU-DİLİ paleti (DESIGN.md 3.0 — skill varsayılan paletini geçersiz kılar)
const P = {
  zemin: '#E9F0F4', kart: '#DFE9F0', metin: '#132A3F', soluk: '#48627A',
  derin: '#0C5A7C', sig: '#2E7EA0', kehribar: '#C0883A', kehribarM: '#875518',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Basit sözcük sarımı: satır başına ~maks karakter; en çok 2 satır (fazlası …)
function sar(metin, maks = 40) {
  const kel = metin.split(' ');
  const satir = [];
  let s = '';
  for (const k of kel) {
    if ((s + ' ' + k).trim().length > maks) { satir.push(s.trim()); s = k; }
    else s = (s + ' ' + k).trim();
  }
  if (s) satir.push(s);
  if (satir.length > 2) { satir[1] = satir[1].replace(/.{0,3}$/, '…'); satir.length = 2; }
  return satir;
}

function svgKart({ kategori, deger, birim, baslik, kaynak, vurgu = P.derin }) {
  const W = 1200, H = 627;
  // Değer genişliğine göre font: uzun sayı taşmasın (108..1130 = ~1022px alan)
  const uzun = (deger + birim).length;
  const dFont = uzun > 8 ? 150 : uzun > 6 ? 168 : 184;
  const bSatir = sar(baslik, 42);
  const bY = 430;
  const baslikSvg = bSatir
    .map((l, i) => `<text x="112" y="${bY + i * 62}" font-family="'Cormorant Garamond','Cormorant',Georgia,serif" font-size="50" font-weight="500" fill="${P.metin}">${esc(l)}</text>`)
    .join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="suband" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="${P.sig}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${P.sig}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="kot" width="7" height="7" patternUnits="userSpaceOnUse">
      <rect width="7" height="1" fill="${P.sig}" opacity="0.4"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${P.zemin}"/>
  <rect x="0" y="${H - 150}" width="${W}" height="150" fill="url(#suband)"/>
  <rect x="0" y="0" width="4" height="${H}" fill="${vurgu}"/>
  <rect x="70" y="96" width="6" height="${H - 200}" fill="url(#kot)"/>
  <text x="112" y="132" font-family="'IBM Plex Mono',monospace" font-size="26" letter-spacing="6" fill="${vurgu}" font-weight="500">${esc(kategori)}</text>
  <text x="108" y="322" font-family="'Cormorant Garamond','Cormorant',Georgia,serif" font-size="${dFont}" font-weight="600" fill="${P.metin}">${esc(deger)}<tspan font-family="'IBM Plex Mono',monospace" font-size="42" fill="${P.soluk}" dx="16">${esc(birim)}</tspan></text>
  ${baslikSvg}
  <text x="112" y="562" font-family="'IBM Plex Mono',monospace" font-size="23" fill="${P.soluk}">${esc(kaynak.length > 50 ? kaynak.slice(0, 49) + '…' : kaynak)}</text>
  <text x="${W - 70}" y="562" text-anchor="end" font-family="'IBM Plex Mono',monospace" font-size="23" letter-spacing="2" fill="${vurgu}" font-weight="500">suharitasi.com</text>
</svg>`;
}

// ——— Üç örnek kart: YALNIZ doğrulanmış veriden ———
const KARTLAR = [
  {
    dosya: 'linkedin-meysu.png', vurgu: P.derin,
    kategori: 'VAKA · KAP KÜNYELİ',
    deger: '3.395,33', birim: 'hektar',
    baslik: 'Meysu, mineralli su sahasını 2056’ya dek güvenceye aldı',
    kaynak: 'Kaynak: KAP bildirimi 1604957 · 11.05.2026',
  },
  {
    dosya: 'linkedin-asi-havzasi.png', vurgu: P.kehribarM,
    kategori: 'SU DEPOLAMASI · KRİTİK',
    deger: '−2,34', birim: 'cm/yıl',
    baslik: 'Asi Havzası, son 5 yılda en hızlı azalan su deposu',
    kaynak: 'Kaynak: NASA GRACE/GRACE-FO · 60 ay (değişim)',
  },
  {
    dosya: 'linkedin-aslantas-baraj.png', vurgu: P.derin,
    kategori: 'BARAJ DOLULUK · GÜNLÜK',
    deger: '%73,16', birim: '',
    baslik: 'Aslantaş Barajı (Ceyhan havzası) güncel doluluk',
    kaynak: 'Kaynak: EPİAŞ Şeffaflık Platformu · 21.07.2026',
  },
];

// --ornek: yalnız TEK kart, ayrı dosya adıyla üretilir. Mevcut kartların
// üzerine yazılmaz (FAZ 8: eski kartların yeniden üretimi kullanıcı kararı).
const SADECE_ORNEK = process.argv.includes('--ornek');
const URETILECEK = SADECE_ORNEK
  ? [{ ...KARTLAR[1], dosya: 'linkedin-palet-c-ornek.png' }]
  : KARTLAR;

for (const k of URETILECEK) {
  const svg = svgKart(k);
  await sharp(Buffer.from(svg)).png().toFile(`${CIKTI}/${k.dosya}`);
  const meta = await sharp(`${CIKTI}/${k.dosya}`).metadata();
  console.log(`  ✓ ${k.dosya} (${meta.width}×${meta.height})`);
}
console.log(`\n  ${URETILECEK.length} kart → ${CIKTI}`);
