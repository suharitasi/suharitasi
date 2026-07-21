/* Faz 1 sayı-canlanma kanıtı + konsol/taşma denetimi.
   (a) NORMAL motion: sakarya kahraman değerinin frame dizisi (0/300/600/1000ms)
       — değer ~%80'den son değere dolar (0'dan değil).
   (b) REDUCED motion: aynı değer anında son hâlde (animasyonsuz kanıt).
   (c) Konsol hata/uyarı = 0; 375px yatay taşma = 0 (üç showcase sayfası). */
import { chromium } from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const PORT = process.env.PORT || '5403';
const TABAN = `http://localhost:${PORT}`;
const CIKTI = `${KOK}/cikti/denetim/faz1-odul/canlanma`;
const EXE =
  '/home/suha/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';
mkdirSync(CIKTI, { recursive: true });

const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

// (a) NORMAL motion — canlanma frame dizisi (sakarya kahraman değeri)
const ctxN = await tarayici.newContext({ reducedMotion: 'no-preference', deviceScaleFactor: 2 });
const s = await ctxN.newPage();
await s.setViewportSize({ width: 1440, height: 900 });
await s.goto(`${TABAN}/havzalar/sakarya/`, { waitUntil: 'domcontentloaded' });
const oge = s.locator('.kahraman-deger').first();
await oge.waitFor();
// t=0 hemen sonra; sonra 300/600/1000ms. Kare-yakalama basit setTimeout ile.
for (const t of [0, 300, 600, 1000]) {
  if (t > 0) await s.waitForTimeout(t === 300 ? 300 : 300);
  const metin = await oge.innerText();
  await oge.screenshot({ path: `${CIKTI}/canlanma-${String(t).padStart(4, '0')}ms.png` });
  console.log(`  normal t=${t}ms → "${metin.replace(/\n/g, ' ')}"`);
}
await s.close();

// (b) REDUCED motion — anında son değer (animasyon kurulmaz)
const ctxR = await tarayici.newContext({ reducedMotion: 'reduce', deviceScaleFactor: 2 });
const r = await ctxR.newPage();
await r.setViewportSize({ width: 1440, height: 900 });
await r.goto(`${TABAN}/havzalar/sakarya/`, { waitUntil: 'networkidle' });
const ogeR = r.locator('.kahraman-deger').first();
await ogeR.waitFor();
const metinR = await ogeR.innerText();
await ogeR.screenshot({ path: `${CIKTI}/reduced-aninda.png` });
console.log(`  reduced (anında) → "${metinR.replace(/\n/g, ' ')}"`);
await r.close();

// (c) Konsol + 375px taşma — üç showcase sayfası
const SAYFALAR = ['/harita/', '/havzalar/sakarya/', '/vaka/meysu/'];
let konsolHata = 0;
let tasmaHata = 0;
const ctxC = await tarayici.newContext({ reducedMotion: 'no-preference', deviceScaleFactor: 1 });
for (const yol of SAYFALAR) {
  const p = await ctxC.newPage();
  const mesajlar = [];
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') mesajlar.push(`${m.type()}: ${m.text()}`); });
  p.on('pageerror', (e) => mesajlar.push(`pageerror: ${e.message}`));
  await p.setViewportSize({ width: 375, height: 812 });
  await p.goto(`${TABAN}${yol}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200); // canlanma bitene dek dinle
  const tasma = await p.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  if (mesajlar.length) { konsolHata += mesajlar.length; console.log(`  KONSOL ${yol}:`, mesajlar.join(' | ')); }
  if (tasma > 0) { tasmaHata++; console.log(`  TAŞMA ${yol}: ${tasma}px`); }
  console.log(`  ${yol.padEnd(22)} konsol=${mesajlar.length} taşma375=${tasma}px`);
  await p.close();
}

await tarayici.close();
console.log(`\n  Konsol hata/uyarı: ${konsolHata} · 375px taşma sayfası: ${tasmaHata}/${SAYFALAR.length}`);
process.exit(konsolHata > 0 || tasmaHata > 0 ? 1 : 0);
