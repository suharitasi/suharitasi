/* FAZ 2 doğrulaması: kadraj kutusu değişti → ZİNCİRİN TAMAMI yeniden ölçülür.
   1) scrub eşlemesi (track yüksekliği, akış kaydırma mesafesi)
   2) 7 dilimlik ritim (dilim uzunluğu + her dilimde görünen sorular)
   3) crossfade (sahne opacity geçiş genişliği — CROSSFADE*vh)
   4) preload eşikleri (hangi kaydırmada hangi klip/poster iniyor)
   5) 5 kare örtüşme doğrulaması (şerit kadraja giriyor mu)
   Kullanım: node arac/faz2-dogrula.mjs <adres> <onek>                        */
import pw from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.js';
import { writeFileSync, mkdirSync } from 'node:fs';

const { chromium } = pw;
const KOK = '/home/suha/projeler/suharitasi';
const CIKTI = `${KOK}/cikti/denetim/anasayfa-duzeltme`;
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const ADRES = process.argv[2];
const ONEK = process.argv[3] || 'faz2';
if (!ADRES) throw new Error('kullanım: node arac/faz2-dogrula.mjs <adres> <onek>');
mkdirSync(CIKTI, { recursive: true });

const browser = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});
const rapor = { adres: ADRES, kirilimlar: {} };

for (const k of [{ ad: '1440', viewport: { width: 1440, height: 900 } },
                 { ad: '375', viewport: { width: 375, height: 667 } }]) {
  const ctx = await browser.newContext({ viewport: k.viewport });
  const page = await ctx.newPage();
  const ag = [];
  page.on('response', (r) => {
    const u = new URL(r.url()).pathname;
    if (/sahne\d+\.(mp4|jpg)$/.test(u)) ag.push({ yol: u, kod: r.status() });
  });
  await page.goto(ADRES, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const r = { scrub: {}, ritim: [], crossfade: {}, preload: {}, ortusme: [] };

  // 1) scrub eşlemesi
  r.scrub = await page.evaluate(() => {
    const t = document.querySelector('#world .sw-track');
    return {
      vh: innerHeight,
      track_px: t.offsetHeight,
      akis_px: t.offsetHeight - innerHeight,
      akis_vh: +((t.offsetHeight - innerHeight) / innerHeight).toFixed(3),
      belge_px: document.documentElement.scrollHeight,
    };
  });
  r.ritim_dilim_px = Math.round(r.scrub.akis_px / 7);

  // 4) preload: ilk yükte inenler
  r.preload.ilk_yuk = [...new Set(ag.map((a) => a.yol))];

  // 2 + 5) her dilimin ORTASINDA: görünen sorular + örtüşme
  for (let d = 0; d < 7; d++) {
    const y = Math.round(r.scrub.akis_px * ((d + 0.5) / 7));
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(700);
    const o = await page.evaluate(() => {
      const s = document.querySelector('.soru-serit');
      const sk = s.getBoundingClientRect();
      const sahne = document.querySelector('#world .sw-stage').getBoundingClientRect();
      return {
        gorunur: [...s.querySelectorAll('.soru')]
          .filter((a) => getComputedStyle(a).opacity === '1')
          .map((a) => ({ soru: a.querySelector('.soru-metin').textContent.trim(),
                         hedef: a.getAttribute('href'),
                         yuva: a.classList.contains('sag') ? 'sağ' : 'sol' })),
        kadraj_alt: Math.round(sahne.bottom),
        serit_ust: Math.round(sk.top),
        ara_px: Math.round(sk.top - sahne.bottom),
      };
    });
    r.ritim.push({ dilim: d, kaydirma_px: y, gorunur: o.gorunur });
    r.ortusme.push({ dilim: d, kadraj_alt: o.kadraj_alt, serit_ust: o.serit_ust,
                     ara_px: o.ara_px, ortusuyor: o.ara_px < 0 });
  }

  // 3) crossfade genişliği: sahne 1→2 dikişinde opacity'nin 1→0 olduğu bant
  const dikis = Math.round(1.6 * r.scrub.vh);
  const orneklem = [];
  for (const d of [-0.20, -0.14, -0.07, 0, 0.07, 0.14, 0.20]) {
    await page.evaluate((v) => scrollTo(0, v), Math.round(dikis + d * r.scrub.vh));
    await page.waitForTimeout(400);
    const op = await page.evaluate(() => {
      const s = [...document.querySelectorAll('#world .sw-scene')];
      return { s1: +(+getComputedStyle(s[0]).opacity).toFixed(3),
               s2: +(+getComputedStyle(s[1]).opacity).toFixed(3) };
    });
    orneklem.push({ dikise_uzaklik_vh: d, ...op });
  }
  r.crossfade = { dikis_px: dikis, orneklem,
                  beklenen_yari_genislik_vh: 0.14 };

  // 4b) preload: kaydırdıkça inenler
  r.preload.kaydirinca = [...new Set(ag.map((a) => a.yol))]
    .filter((u) => !r.preload.ilk_yuk.includes(u));

  rapor.kirilimlar[k.ad] = r;
  await ctx.close();
}

await browser.close();
writeFileSync(`${CIKTI}/${ONEK}-zincir.json`, JSON.stringify(rapor, null, 2));

for (const [ad, r] of Object.entries(rapor.kirilimlar)) {
  console.log(`\n===== ${ad} =====`);
  console.log('SCRUB:', JSON.stringify(r.scrub), '| dilim_px:', r.ritim_dilim_px);
  console.log('RİTİM:');
  console.table(r.ritim.map((x) => ({
    dilim: x.dilim,
    sol: x.gorunur.find((g) => g.yuva === 'sol')?.soru ?? '—',
    sag: x.gorunur.find((g) => g.yuva === 'sağ')?.soru ?? '—',
    ayni_hedef: x.gorunur.length === 2 &&
      x.gorunur[0].hedef === x.gorunur[1].hedef,
  })));
  console.log('ÖRTÜŞME (5+ kare):');
  console.table(r.ortusme);
  console.log('CROSSFADE:', JSON.stringify(r.crossfade.orneklem));
  console.log('PRELOAD ilk yük:', JSON.stringify(r.preload.ilk_yuk));
}
