/* FAZ 8 (palet C) Lighthouse erişilebilirlik denetimi — 3 tur medyan
   (localhost gürültüsü tek ölçümle karar verdirmesin; CLAUDE.md kuralı).
   Yalnız a11y kategorisi; eşik 100. Tam chromium gerekir (headless shell yetmez).
   Kullanım: dist servis edildikten sonra  node arac/faz8-lh.mjs               */
import lighthouse from '/home/suha/projeler/suharitasi/node_modules/lighthouse/core/index.js';
import { launch } from '/home/suha/projeler/suharitasi/node_modules/chrome-launcher/dist/index.js';
import { writeFileSync, mkdirSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const PORT = process.env.PORT || '5197';
const CIKTI = `${KOK}/cikti/denetim/faz8-uygulama`;
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
mkdirSync(CIKTI, { recursive: true });

// Palet değişiminden en çok etkilenen örnek sayfalar (metin/zemin yoğun).
const SAYFALAR = [
  ['/havzalar/sakarya/', 'sakarya'],
  ['/kuyu-ruhsati/', 'kuyu-ruhsati'],
  ['/vaka/meysu/', 'meysu'],
];

const medyan = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];

const chrome = await launch({
  chromePath: EXE,
  chromeFlags: ['--headless=new', '--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});
const opts = { port: chrome.port, onlyCategories: ['accessibility'], output: 'json', logLevel: 'error' };

const sonuc = {};
let dusuk = 0;

for (const [yol, ad] of SAYFALAR) {
  const turlar = [];
  const basarisizDenetimler = new Set();
  for (let i = 0; i < 3; i++) {
    const r = await lighthouse(`http://localhost:${PORT}${yol}`, opts);
    turlar.push(Math.round(r.lhr.categories.accessibility.score * 100));
    for (const ref of r.lhr.categories.accessibility.auditRefs) {
      const a = r.lhr.audits[ref.id];
      if (a && a.score !== null && a.score < 1) basarisizDenetimler.add(ref.id);
    }
  }
  const m = medyan(turlar);
  sonuc[ad] = { yol, turlar, medyan: m, basarisiz: [...basarisizDenetimler] };
  if (m < 100) dusuk++;
  console.log(`${ad.padEnd(14)} a11y turlar=[${turlar}] medyan=${m}` +
    (basarisizDenetimler.size ? `  başarısız: ${[...basarisizDenetimler].join(', ')}` : ''));
}

await chrome.kill();
writeFileSync(`${CIKTI}/lighthouse-a11y.json`, JSON.stringify(sonuc, null, 2) + '\n');
console.log(`\nYazıldı: cikti/denetim/faz8-uygulama/lighthouse-a11y.json`);

if (dusuk > 0) {
  console.error(`\nEşik ihlali: ${dusuk} sayfada a11y medyanı 100'ün altında.`);
  process.exit(1);
}
console.log('Tüm örnek sayfalarda a11y medyanı 100.');
