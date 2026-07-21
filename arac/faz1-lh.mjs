/* Faz 1 Lighthouse: 3 tur medyan performans skoru (localhost gürültüsü için).
   ETIKET (taban|sonra) ile sonuç JSON'a yazılır; ayrı çağrılarla A/B.
   Tam chromium (headless) kullanılır — headless shell Lighthouse'a yetmez. */
import lighthouse from '/home/suha/projeler/suharitasi/node_modules/lighthouse/core/index.js';
import { launch } from '/home/suha/projeler/suharitasi/node_modules/chrome-launcher/dist/index.js';
import { writeFileSync, mkdirSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const PORT = process.env.PORT || '5404';
const ETIKET = process.env.ETIKET || 'sonra';
const CIKTI = `${KOK}/cikti/denetim/faz1-odul`;
mkdirSync(CIKTI, { recursive: true });

const SAYFALAR = [
  ['/havzalar/sakarya/', 'sakarya'],
  ['/rehberler/kuyu-ruhsati/', 'kuyu-ruhsati'],
  ['/harita/', 'harita'],
];
const CHROME = `${KOK}/node_modules/.cache/nonexistent`; // kullanılmaz; chrome-launcher bulur
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';

const medyan = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
const sonuc = {};

const chrome = await launch({
  chromePath: EXE,
  chromeFlags: ['--headless=new', '--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});
const opts = { port: chrome.port, onlyCategories: ['performance'], output: 'json', logLevel: 'error' };

for (const [yol, ad] of SAYFALAR) {
  const skorlar = [];
  for (let t = 0; t < 3; t++) {
    const r = await lighthouse(`http://localhost:${PORT}${yol}`, opts);
    skorlar.push(Math.round(r.lhr.categories.performance.score * 100));
  }
  sonuc[ad] = { turlar: skorlar, medyan: medyan(skorlar) };
  console.log(`  ${ad.padEnd(14)} turlar=${skorlar.join('/')}  medyan=${medyan(skorlar)}`);
}

await chrome.kill();
writeFileSync(`${CIKTI}/lh-${ETIKET}.json`, JSON.stringify(sonuc, null, 2));
console.log(`\n  ${ETIKET} → lh-${ETIKET}.json`);
