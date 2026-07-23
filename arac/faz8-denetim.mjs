/* FAZ 8 (palet C) yapısal regresyon + ekran seti.
   Aranan: 375 yatay taşma 0, konsol hata/uyarı 0, kırık iç link 0.
   RENK farkı BEKLENİR — bu script piksel kıyası YAPMAZ, yapıyı ölçer.
   reduced-motion açık; 6 sayfa × {1440, 375}.
   Kullanım: dist servis edildikten sonra  node arac/faz8-denetim.mjs        */
import { chromium } from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';

const TABAN = process.env.TABAN || 'http://localhost:5197';
const CIKTI = '/home/suha/projeler/suharitasi/cikti/denetim/faz8-uygulama';
const EXE = '/home/suha/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';

const SAYFALAR = [
  ['ana', '/'],
  ['harita', '/harita/'],
  ['sakarya', '/havzalar/sakarya/'],
  ['kuyu-ruhsati', '/kuyu-ruhsati/'],
  ['durumum', '/durumum/'],
  ['meysu', '/vaka/meysu/'],
];
const GORUNUMLER = [['1440', 1440, 900], ['375', 375, 812]];

// Headless yazılımsal GL sürücüsünün kendi mesajları (sitede karşılığı yok).
const GURULTU = /GL Driver Message .*(Performance|GPU stall)|Automatic fallback to software WebGL/;

mkdirSync(CIKTI, { recursive: true });

const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

const konsol = [];
const gurultu = [];
const tasma = [];
const kirikLink = [];
const icLinkler = new Set();
const satirlar = [];

for (const [ad, yol] of SAYFALAR) {
  for (const [etiket, w, h] of GORUNUMLER) {
    const baglam = await tarayici.newContext({
      viewport: { width: w, height: h },
      reducedMotion: 'reduce',
      deviceScaleFactor: 1,
    });
    const s = await baglam.newPage();
    s.on('console', (m) => {
      if (m.type() !== 'error' && m.type() !== 'warning') return;
      const kayit = `[${m.type()}] ${yol} @${etiket}: ${m.text()}`;
      (GURULTU.test(m.text()) ? gurultu : konsol).push(kayit);
    });
    s.on('pageerror', (e) => konsol.push(`[pageerror] ${yol} @${etiket}: ${e.message}`));

    await s.goto(TABAN + yol, { waitUntil: 'networkidle' });
    await s.waitForTimeout(1400);

    // Yatay taşma: belge genişliği görünüm genişliğini aşıyor mu?
    const olcum = await s.evaluate(() => ({
      belge: document.documentElement.scrollWidth,
      govde: document.body.scrollWidth,
      gorunum: window.innerWidth,
    }));
    const asim = Math.max(olcum.belge, olcum.govde) - olcum.gorunum;
    if (asim > 0) tasma.push(`${yol} @${etiket}: ${asim}px taşma (belge ${olcum.belge} / görünüm ${olcum.gorunum})`);

    // İç linkleri topla (kırık link taraması için)
    for (const h of await s.evaluate(() =>
      [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href'))
    )) icLinkler.add(h.split('#')[0]);

    await s.screenshot({ path: `${CIKTI}/${ad}_${etiket}.png`, fullPage: true });
    satirlar.push(`${ad}_${etiket}.png  taşma:${asim > 0 ? asim + 'px' : '0'}`);
    console.log(`GÖRÜNTÜ: ${ad}_${etiket}.png  (taşma ${asim > 0 ? asim + 'px' : '0'})`);

    await baglam.close();
  }
}

// Kırık iç link taraması
const kontrolBaglam = await tarayici.newContext();
for (const link of [...icLinkler].sort()) {
  if (!link || link.startsWith('//')) continue;
  const y = await kontrolBaglam.request.get(TABAN + link).catch(() => null);
  if (!y || y.status() >= 400) kirikLink.push(`${link} -> ${y ? y.status() : 'istek başarısız'}`);
}
await kontrolBaglam.close();
await tarayici.close();

const rapor = [
  'FAZ 8 — PALET C YAPISAL REGRESYON',
  `Taban: ${TABAN} · reduced-motion: açık · ${SAYFALAR.length} sayfa × ${GORUNUMLER.length} görünüm`,
  'NOT: renk farkı beklenir; bu denetim yapıyı ölçer (taşma/konsol/link).',
  '',
  'Ekran seti:',
  ...satirlar.map((s) => '  ' + s),
  '',
  `375 yatay taşma: ${tasma.length}`,
  ...tasma.map((t) => '  ' + t),
  `Konsol hata/uyarı: ${konsol.length}`,
  ...konsol.map((k) => '  ' + k),
  `Kırık iç link: ${kirikLink.length} (taranan ${icLinkler.size})`,
  ...kirikLink.map((k) => '  ' + k),
  '',
  `Ortam gürültüsü (yazılımsal GL — sayılmaz): ${gurultu.length}`,
  ...gurultu.slice(0, 5).map((g) => '  ' + g),
].join('\n');

writeFileSync(`${CIKTI}/yapisal-regresyon.txt`, rapor + '\n');
console.log('\n' + rapor);

const basarisiz = tasma.length + konsol.length + kirikLink.length;
if (basarisiz > 0) {
  console.error(`\nYapısal bozulma bulundu: ${basarisiz} kalem.`);
  process.exit(1);
}
console.log('\nYapısal bozulma yok: taşma 0, konsol 0, kırık link 0.');
