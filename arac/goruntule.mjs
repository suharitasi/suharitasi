import { chromium } from '/root/projeler/suharitasi/node_modules/playwright-core/index.mjs';

const TABAN = 'http://localhost:5197';
const CIKTI = '/root/projeler/suharitasi/screenshots';

const sayfalar = [
  ['/', 'yeni-landing'],
  ['/harita/', 'yeni-harita'],
  ['/havzalar/', 'sayfa-havzalar'],
  ['/havzalar/sakarya/', 'sayfa-havza-sakarya'],
  ['/rehberler/', 'sayfa-rehberler'],
  ['/rehberler/kuyu-ruhsati/', 'sayfa-rehber-kuyu'],
  ['/su-kanunu/', 'sayfa-su-kanunu'],
  ['/su-kanunu/taslak-takibi/', 'sayfa-taslak-takibi'],
  ['/hakkinda/', 'sayfa-hakkinda'],
];

const tarayici = await chromium.launch({
  executablePath: '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell',
  args: ['--no-sandbox'],
});
const baglam = await tarayici.newContext({
  viewport: { width: 1600, height: 900 },
  reducedMotion: 'reduce',
});
const sekme = await baglam.newPage();

for (const [yol, ad] of sayfalar) {
  await sekme.goto(TABAN + yol, { waitUntil: 'networkidle' });
  await sekme.waitForTimeout(400);
  await sekme.screenshot({ path: `${CIKTI}/${ad}.png` });
  console.log(ad, 'ok');
}

// Harita: menü açık hali
await sekme.goto(TABAN + '/harita/', { waitUntil: 'networkidle' });
await sekme.click('.menu-ac');
await sekme.waitForTimeout(500);
await sekme.screenshot({ path: `${CIKTI}/yeni-harita-menu-acik.png` });
console.log('yeni-harita-menu-acik ok');

// Mobil örnek: içerik sayfası
await sekme.setViewportSize({ width: 390, height: 844 });
await sekme.goto(TABAN + '/havzalar/sakarya/', { waitUntil: 'networkidle' });
await sekme.screenshot({ path: `${CIKTI}/sayfa-havza-sakarya-mobil.png`, fullPage: true });
console.log('mobil ok');

await tarayici.close();
