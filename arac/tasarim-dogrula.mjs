/* Tasarım yenileme doğrulaması: konsol hataları, menü etkileşimi,
   su simülasyonu ripple kareleri, FPS, reduced-motion ve no-JS senaryoları. */
import { chromium } from '/root/projeler/suharitasi/node_modules/playwright-core/index.mjs';

const TABAN = 'http://localhost:5197';
const CIKTI = '/root/projeler/suharitasi/screenshots';
const EXE = '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';

const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

const konsol = [];
async function sayfaAc(baglam, yol) {
  const s = await baglam.newPage();
  s.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning')
      konsol.push(`[${m.type()}] ${yol}: ${m.text()}`);
  });
  s.on('pageerror', (e) => konsol.push(`[pageerror] ${yol}: ${e.message}`));
  await s.goto(TABAN + yol, { waitUntil: 'networkidle' });
  return s;
}

// ---- 1) Konsol taraması: temel sayfalar ----
const b1 = await tarayici.newContext({ viewport: { width: 1600, height: 900 } });
for (const yol of ['/', '/harita/', '/havzalar/', '/rehberler/', '/rehberler/kuyu-ruhsati/', '/su-kanunu/', '/havzalar/sakarya/', '/hakkinda/']) {
  const s = await sayfaAc(b1, yol);
  await s.waitForTimeout(600);
  await s.close();
}
console.log('KONSOL HATA/UYARI SAYISI:', konsol.length);
konsol.forEach((k) => console.log(' ', k));

// ---- 2) Sayfa görüntüleri (sonra-halleri) ----
const s2 = await sayfaAc(b1, '/havzalar/');
await s2.waitForTimeout(900);
await s2.screenshot({ path: `${CIKTI}/sv-havzalar.png`, fullPage: false });
// scroll ile reveal + yüzen nav
await s2.mouse.wheel(0, 500);
await s2.waitForTimeout(800);
await s2.screenshot({ path: `${CIKTI}/sv-havzalar-scroll.png` });
await s2.close();

const s3 = await sayfaAc(b1, '/rehberler/kuyu-ruhsati/');
await s3.waitForTimeout(600);
await s3.screenshot({ path: `${CIKTI}/sv-rehber-kuyu-hero.png` });
// blockquote + tablo görünür kare
await s3.evaluate(() => document.querySelector('.icerik blockquote')?.scrollIntoView({ block: 'center' }));
await s3.waitForTimeout(800);
await s3.screenshot({ path: `${CIKTI}/sv-rehber-kuyu-madde.png` });
await s3.close();

const sLand = await sayfaAc(b1, '/');
await sLand.waitForTimeout(2500);
await sLand.screenshot({ path: `${CIKTI}/sv-landing-sonra.png`, fullPage: false });
await sLand.close();

const sHar = await sayfaAc(b1, '/harita/');
await sHar.waitForTimeout(1500);
await sHar.screenshot({ path: `${CIKTI}/sv-harita-sonra.png` });
await sHar.close();

// ---- 3) Menü + su simülasyonu etkileşimi ----
const sM = await sayfaAc(b1, '/havzalar/');
await sM.click('.sv-menu-ac');
await sM.waitForTimeout(2600); // giriş + sim yükleme + fade-in
const simVar = await sM.evaluate(() => {
  const c = document.querySelector('.sv-menu-canvas');
  return c ? { canli: c.classList.contains('sv-canli'), w: c.width, h: c.height } : null;
});
console.log('SİMÜLASYON:', JSON.stringify(simVar));
await sM.screenshot({ path: `${CIKTI}/sv-menu-acik.png` });

// İmleçle dalga: ardışık 3 kare
const yol = [[400, 450], [700, 430], [1000, 480], [1250, 500]];
for (let i = 0; i < 3; i++) {
  for (const [x, y] of yol) {
    await sM.mouse.move(x + i * 40, y + i * 25, { steps: 8 });
  }
  await sM.waitForTimeout(120);
  await sM.screenshot({ path: `${CIKTI}/sv-menu-dalga-${i + 1}.png` });
}

// FPS ölçümü (menü açıkken 1 sn rAF sayımı)
const fps = await sM.evaluate(() => new Promise((coz) => {
  let n = 0; const t0 = performance.now();
  (function f() { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(f); else coz(n); })();
}));
console.log('MENÜ AÇIKKEN FPS ~', fps);

// ESC ile kapanış + focus iadesi + aria
await sM.keyboard.press('Escape');
await sM.waitForTimeout(600);
const kapanis = await sM.evaluate(() => ({
  gizli: document.getElementById('sv-menu').hidden,
  expanded: document.querySelector('.sv-menu-ac').getAttribute('aria-expanded'),
  odak: document.activeElement?.className,
}));
console.log('ESC KAPANIŞ:', JSON.stringify(kapanis));
await sM.close();
await b1.close();

// ---- 4) prefers-reduced-motion: fallback zemin ----
const b2 = await tarayici.newContext({ viewport: { width: 1600, height: 900 }, reducedMotion: 'reduce' });
const sR = await b2.newPage();
await sR.goto(TABAN + '/havzalar/', { waitUntil: 'networkidle' });
const imlecYok = await sR.evaluate(() => !document.getElementById('sv-imlec'));
await sR.click('.sv-menu-ac');
await sR.waitForTimeout(1200);
const rmSim = await sR.evaluate(() => !document.querySelector('.sv-menu-canvas'));
await sR.screenshot({ path: `${CIKTI}/sv-menu-fallback.png` });
const rmGorunur = await sR.evaluate(() =>
  [...document.querySelectorAll('#sv-menu nav a')].every((a) => getComputedStyle(a.closest('li')).opacity === '1'));
console.log('REDUCED-MOTION: imleç yok =', imlecYok, '| sim yüklenmedi =', rmSim, '| öğeler anında görünür =', rmGorunur);
await b2.close();

// ---- 5) no-JS: içerik gizli kalmıyor ----
const b3 = await tarayici.newContext({ viewport: { width: 1600, height: 900 }, javaScriptEnabled: false });
const sN = await b3.newPage();
await sN.goto(TABAN + '/havzalar/', { waitUntil: 'load' });
const noJs = await sN.evaluate(() => {
  const ilk = document.querySelector('.sv-liste li');
  return { satir: document.querySelectorAll('.sv-liste li').length,
           gorunur: ilk ? getComputedStyle(ilk).opacity : null };
});
console.log('NO-JS: satır =', noJs.satir, '| opacity =', noJs.gorunur);
await b3.close();

// ---- 6) İç link taraması (içerik sayfalarında 404 yok) ----
const b4 = await tarayici.newContext();
const sL = await b4.newPage();
const linkler = new Set();
for (const yol of ['/havzalar/', '/rehberler/', '/su-kanunu/', '/rehberler/kuyu-ruhsati/']) {
  await sL.goto(TABAN + yol, { waitUntil: 'load' });
  (await sL.evaluate(() => [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href'))))
    .forEach((h) => linkler.add(h.split('#')[0]));
}
let kirik = 0;
for (const h of linkler) {
  const r = await sL.request.get(TABAN + h);
  if (r.status() >= 400) { kirik++; console.log('KIRIK LİNK:', h, r.status()); }
}
console.log(`İÇ LİNK: ${linkler.size} tekil, ${kirik} kırık`);
await b4.close();

await tarayici.close();
console.log('BİTTİ');
