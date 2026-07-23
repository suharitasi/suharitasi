/* Faz başına ÖNCE/SONRA kareleri + rota etiketi görünürlük ölçümü.
   Kullanım: node arac/duzeltme-kare.mjs <adres> <onek>
     örn: node arac/duzeltme-kare.mjs https://suharitasi.com/ faz1-once      */
import pw from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.js';
import { writeFileSync, mkdirSync } from 'node:fs';

const { chromium } = pw;
const KOK = '/home/suha/projeler/suharitasi';
const CIKTI = `${KOK}/cikti/denetim/anasayfa-duzeltme`;
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const ADRES = process.argv[2];
const ONEK = process.argv[3];
if (!ADRES || !ONEK) throw new Error('kullanım: node arac/duzeltme-kare.mjs <adres> <onek>');
mkdirSync(CIKTI, { recursive: true });

const NOKTALAR = [0, 0.25, 0.5, 0.75, 1];
const rapor = { adres: ADRES, onek: ONEK, kirilimlar: {} };

const browser = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

for (const k of [{ ad: '1440', viewport: { width: 1440, height: 900 } },
                 { ad: '375', viewport: { width: 375, height: 667 } }]) {
  const ctx = await browser.newContext({ viewport: k.viewport });
  const page = await ctx.newPage();
  await page.goto(ADRES, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const uz = await page.evaluate(() => {
    const t = document.querySelector('#world .sw-track');
    return t ? t.offsetHeight - innerHeight : 0;
  });

  for (const p of NOKTALAR) {
    await page.evaluate((y) => scrollTo(0, y), Math.round(uz * p));
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${CIKTI}/${ONEK}-${k.ad}-p${Math.round(p * 100)}.png` });
  }

  // Rota etiketi: AKTİF olanın gerçekten çizilen kutusu (clip sonrası 1×1 olmalı)
  await page.evaluate((y) => scrollTo(0, y), 0);
  await page.waitForTimeout(700);
  rapor.kirilimlar[k.ad] = await page.evaluate(() => {
    const aktif = document.querySelector('.sw-route__dot.is-active .sw-route__label');
    const r = aktif ? aktif.getBoundingClientRect() : null;
    // Kadraj (contain ile çizilen görüntü alanı) ve şerit ilişkisi
    const img = document.querySelector('#world .sw-scene__still');
    const s = document.querySelector('.soru-serit');
    const sahne = document.querySelector('#world .sw-stage');
    const kutu = (e) => { const b = e.getBoundingClientRect();
      return { top: Math.round(b.top), bottom: Math.round(b.bottom), yukseklik: Math.round(b.height) }; };
    // contain ile gerçek çizilen kadraj: kabın içinde en-boy oranına göre
    const sb = sahne.getBoundingClientRect();
    const oran = (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : 832 / 464;
    const cizilenEn = Math.min(sb.width, sb.height * oran);
    const cizilenBoy = cizilenEn / oran;
    const kadrajAlt = sb.top + (sb.height + cizilenBoy) / 2;
    const sk = s.getBoundingClientRect();
    return {
      rota_aktif_etiket_kutusu: r ? { en: Math.round(r.width), boy: Math.round(r.height) } : null,
      rota_aktif_etiket_metni: aktif ? aktif.textContent : null,
      sahne_kabi: kutu(sahne),
      kadraj_alt_kenari_px: Math.round(kadrajAlt),
      serit: kutu(s),
      kadraj_ile_serit_arasi_px: Math.round(sk.top - kadrajAlt),
      serit_kadraji_ortuyor_mu: sk.top < kadrajAlt,
      viewport: innerHeight,
    };
  });
  await ctx.close();
}

await browser.close();
writeFileSync(`${CIKTI}/${ONEK}-olcum.json`, JSON.stringify(rapor, null, 2));
console.log(JSON.stringify(rapor.kirilimlar, null, 2));
