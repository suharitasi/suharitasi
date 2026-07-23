/* Ana sayfa AŞAMA 1 mock'u — öz-denetim + ekran görüntüsü (1440 / 375).
   Konsol hatası ve kırık yerel görsel referansı 0 olmalı.
   Kullanım: node arac/anasayfa-mock-cek.mjs                                   */
import pw from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.js';
const { chromium } = pw;
import { writeFileSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const CIKTI = `${KOK}/cikti/denetim/anasayfa-sahne`;
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const URL = `file://${CIKTI}/mock.html`;

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const rapor = { konsol: [], basarisiz_istek: [], gorunumler: {} };

for (const [ad, en, boy] of [['1440', 1440, 900], ['375', 375, 812]]) {
  const page = await browser.newPage({ viewport: { width: en, height: boy } });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') rapor.konsol.push(`${ad}:${m.type()}:${m.text()}`); });
  page.on('pageerror', (e) => rapor.konsol.push(`${ad}:pageerror:${e.message}`));
  page.on('requestfailed', (r) => rapor.basarisiz_istek.push(`${ad}:${r.url()}`));
  await page.goto(URL, { waitUntil: 'networkidle' });
  // Görsellerin gerçekten yüklendiğini teyit et (kırık <img> sessizce geçmesin).
  const gorseller = await page.evaluate(() =>
    [...document.images].map(i => ({ src: i.getAttribute('src'), yuklendi: i.complete && i.naturalWidth > 0 })));
  const kirik = gorseller.filter(g => !g.yuklendi);
  // Yatay taşma kontrolü
  const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.screenshot({ path: `${CIKTI}/mock-${ad}.png`, fullPage: true });
  rapor.gorunumler[ad] = { gorsel_sayisi: gorseller.length, kirik_gorsel: kirik, yatay_tasma_px: tasma };
  console.log(`${ad}: görsel=${gorseller.length} kırık=${kirik.length} yatay taşma=${tasma}px`);
  await page.close();
}

await browser.close();
writeFileSync(`${CIKTI}/oz-denetim.json`, JSON.stringify(rapor, null, 2) + '\n');
console.log(`konsol hata/uyarı=${rapor.konsol.length} başarısız istek=${rapor.basarisiz_istek.length}`);
if (rapor.konsol.length) console.log(rapor.konsol.join('\n'));
if (rapor.basarisiz_istek.length) console.log(rapor.basarisiz_istek.join('\n'));
