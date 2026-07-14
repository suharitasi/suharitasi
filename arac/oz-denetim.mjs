/* Tarayıcı öz-denetimi (CLAUDE.md protokolü): konsol hataları, kırık iç
   link, tam sayfa görüntüler (cikti/denetim/), temel etkileşim testi.
   Kullanım: dist'i bir portta servis et, sonra:
     node arac/oz-denetim.mjs [yol1 yol2 ...]   (varsayılan: / /havzalar/ /rehberler/kuyu-ruhsati/) */
import { chromium } from '/root/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';

const TABAN = process.env.TABAN || 'http://localhost:5197';
const CIKTI = '/root/projeler/suharitasi/cikti/denetim';
const EXE = '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';
const yollar = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/havzalar/', '/rehberler/kuyu-ruhsati/'];

mkdirSync(CIKTI, { recursive: true });

const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});
const baglam = await tarayici.newContext({ viewport: { width: 1600, height: 900 } });

const konsol = [];
const ortamGurultusu = []; // headless yazılımsal GL sürücü mesajları (sitede yok)
const linkler = new Set();
let sonuc = 0;

const GURULTU = /GL Driver Message .*(Performance|GPU stall)/;

for (const yol of yollar) {
  const s = await baglam.newPage();
  s.on('console', (m) => {
    if (m.type() !== 'error' && m.type() !== 'warning') return;
    const kayit = `[${m.type()}] ${yol}: ${m.text()}`;
    if (GURULTU.test(m.text())) ortamGurultusu.push(kayit);
    else konsol.push(kayit);
  });
  s.on('pageerror', (e) => konsol.push(`[pageerror] ${yol}: ${e.message}`));
  await s.goto(TABAN + yol, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1200);

  const ad = yol === '/' ? 'landing' : yol.replaceAll('/', '-').replace(/^-|-$/g, '');
  await s.screenshot({ path: `${CIKTI}/${ad}.png`, fullPage: true });
  console.log(`GÖRÜNTÜ: cikti/denetim/${ad}.png`);

  (await s.evaluate(() =>
    [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href'))
  )).forEach((h) => linkler.add(h.split('#')[0]));

  // Etkileşim: menü varsa aç/ESC ile kapat
  const menuVar = await s.$('.sv-menu-ac');
  if (menuVar) {
    await s.click('.sv-menu-ac');
    await s.waitForTimeout(900);
    const acik = await s.evaluate(() => !document.getElementById('sv-menu').hidden);
    await s.keyboard.press('Escape');
    await s.waitForTimeout(600);
    const kapali = await s.evaluate(() => document.getElementById('sv-menu').hidden);
    console.log(`ETKİLEŞİM ${yol}: menü aç=${acik} ESC-kapat=${kapali}`);
    if (!acik || !kapali) sonuc = 1;
  }
  await s.close();
}

let kirik = 0;
const s = await baglam.newPage();
for (const h of linkler) {
  const r = await s.request.get(TABAN + h);
  if (r.status() >= 400) { kirik++; console.log('KIRIK LİNK:', h, r.status()); }
}

console.log(`KONSOL HATA/UYARI: ${konsol.length}`);
konsol.forEach((k) => console.log(' ', k));
if (ortamGurultusu.length)
  console.log(`(yoksayıldı: ${ortamGurultusu.length} yazılımsal-GL sürücü performans mesajı — headless ortam gürültüsü)`);
console.log(`İÇ LİNK: ${linkler.size} tekil, ${kirik} kırık`);
if (konsol.length || kirik) sonuc = 1;

await tarayici.close();
process.exit(sonuc);
