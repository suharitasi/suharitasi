/* /deneyim/ menü eklemesi ölçümü: 375px kapalı-şerit yüksekliği (hedef 85±4),
   açık panel yatay taşma (0 olmalı), Deneyim linkinin panelde varlığı.
   Ölçüm iki bağlam: landing (koyu) + içerik sayfası (aydınlık). */
import { chromium } from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const PORT = process.env.PORT || '5406';
const TABAN = `http://localhost:${PORT}`;
const CIKTI = `${KOK}/cikti/denetim/deneyim-menu`;
const EXE = '/home/suha/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';
mkdirSync(CIKTI, { recursive: true });

const tarayici = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'] });
const ctx = await tarayici.newContext({ deviceScaleFactor: 2 });

const SAYFALAR = [['/', 'landing'], ['/rehberler/kuyu-ruhsati/', 'icerik']];
let sorun = 0;

for (const [yol, ad] of SAYFALAR) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 375, height: 812 });
  await p.goto(`${TABAN}${yol}`, { waitUntil: 'networkidle' });

  // Kapalı şerit: görünür header yüksekliği
  const serit = await p.evaluate(() => {
    const h = document.querySelector('header.koyu, header.ust');
    return h ? Math.round(h.getBoundingClientRect().height) : -1;
  });

  // Menüyü aç
  await p.locator('.sv-menu-ac').first().click();
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${CIKTI}/${ad}-375-acik.png`, fullPage: false });

  const olcum = await p.evaluate(() => {
    const de = document.documentElement;
    const tasma = Math.max(0, de.scrollWidth - de.clientWidth);
    const panel = document.querySelector('#sv-menu');
    const panelTasma = panel ? Math.max(0, panel.scrollWidth - panel.clientWidth) : -1;
    const deneyimVar = !!document.querySelector('#sv-menu a[href="/deneyim/"]');
    return { tasma, panelTasma, deneyimVar };
  });

  // Kapat + kapalı şerit görüntüsü
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${CIKTI}/${ad}-375-kapali.png`, fullPage: false });

  const seritOk = serit >= 81 && serit <= 89;
  const tasmaOk = olcum.tasma === 0 && olcum.panelTasma <= 0;
  if (!seritOk || !tasmaOk || !olcum.deneyimVar) sorun++;
  console.log(`  ${ad.padEnd(8)} şerit=${serit}px (${seritOk ? 'OK 85±4' : 'DIŞI'})  yatayTaşma=${olcum.tasma}px  panelTaşma=${olcum.panelTasma}px  Deneyim-panelde=${olcum.deneyimVar}`);
  await p.close();
}

await tarayici.close();
console.log(sorun === 0 ? '\n  TÜM ÖLÇÜMLER GEÇTİ' : `\n  ${sorun} bağlamda sorun`);
process.exit(sorun > 0 ? 1 : 0);
