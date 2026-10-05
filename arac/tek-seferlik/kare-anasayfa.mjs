import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const hedef = process.argv[2];            // anasayfa-once | anasayfa-sonra
const KOK = '/home/suha/projeler/suharitasi-donusum';
const dizin = `${KOK}/denetim/kare/${hedef}`;
mkdirSync(dizin, { recursive: true });

const olcu = [['masaustu', 1440, 900], ['mobil', 390, 844]];
const tarayici = await chromium.launch({ args: ['--no-sandbox'] });

for (const [etiket, w, h] of olcu) {
  const sayfa = await tarayici.newPage({ viewport: { width: w, height: h } });
  const hatalar = [];
  sayfa.on('console', (m) => { if (m.type() === 'error') hatalar.push(m.text()); });
  try {
    await sayfa.goto('http://127.0.0.1:8899/', { waitUntil: 'networkidle', timeout: 30000 });
    await sayfa.waitForTimeout(1500);
    await sayfa.screenshot({ path: `${dizin}/${etiket}-0sn.png`, fullPage: false });
    await sayfa.waitForTimeout(5000);
    await sayfa.screenshot({ path: `${dizin}/${etiket}-5sn.png`, fullPage: false });
    await sayfa.screenshot({ path: `${dizin}/${etiket}-tamsayfa.png`, fullPage: true });
    console.log(`OK   ${etiket} · konsol hata ${hatalar.length}`);
    if (hatalar.length) console.log('     ' + hatalar.slice(0, 3).join(' | '));
  } catch (e) {
    console.log(`HATA ${etiket}: ${e.message.split('\n')[0]}`);
  }
  await sayfa.close();
}
await tarayici.close();
