import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const dizin = '/home/suha/projeler/suharitasi-kontrast/denetim/kare/kontrast-sonrasi';
mkdirSync(dizin, { recursive: true });
const SAYFALAR = [['ana','/'],['rehber','/rehberler/kuyu-ruhsati/'],['havza','/havzalar/sakarya/'],['il','/kuyu-ruhsati/konya/'],['persona','/durumum/agac-ve-agac-urunleri-imalati-nace-16/']];
const t = await chromium.launch({ args: ['--no-sandbox'] });
for (const [ad, yol] of SAYFALAR) {
  for (const [etiket, w, h] of [['masaustu',1440,900],['mobil',390,844]]) {
    const s = await t.newPage({ viewport: { width: w, height: h } });
    const hatalar = [];
    s.on('console', (m) => { if (m.type() === 'error') hatalar.push(m.text()); });
    await s.goto('http://127.0.0.1:8899' + yol, { waitUntil: 'networkidle', timeout: 30000 });
    await s.waitForTimeout(800);
    await s.screenshot({ path: `${dizin}/${ad}-${etiket}-kapali.png` });
    if (etiket === 'masaustu') { await s.hover('.pm-veri-dugme'); await s.waitForTimeout(350); }
    else { await s.click('#pm-menu-dugme'); await s.waitForTimeout(350); }
    await s.screenshot({ path: `${dizin}/${ad}-${etiket}-acik.png` });
    const tasma = await s.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
    console.log(`${ad}-${etiket}: konsol ${hatalar.length} tasma ${tasma}` + (hatalar.length ? ' | ' + hatalar[0] : ''));
    await s.close();
  }
}
await t.close();
