import { chromium } from '/root/projeler/suharitasi/node_modules/playwright-core/index.mjs';

const CIKTI = '/root/projeler/suharitasi/screenshots';
const isler = [
  ['http://localhost:5196/', 'adil-once-landing'],
  ['http://localhost:5196/harita/', 'adil-once-harita'],
  ['http://localhost:5197/', 'adil-yeni-landing'],
  ['http://localhost:5197/harita/', 'adil-yeni-harita'],
];

const tarayici = await chromium.launch({
  executablePath: '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell',
  args: ['--no-sandbox', '--force-color-profile=srgb', '--disable-lcd-text'],
});
const baglam = await tarayici.newContext({
  viewport: { width: 1600, height: 900 },
  reducedMotion: 'reduce',
});
const sekme = await baglam.newPage();

for (const [url, ad] of isler) {
  await sekme.goto(url, { waitUntil: 'networkidle' });
  await sekme.waitForTimeout(600);
  await sekme.screenshot({ path: `${CIKTI}/${ad}.png` });
  console.log(ad, 'ok');
}
await tarayici.close();
