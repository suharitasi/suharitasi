/* Faz 1 (ödül-üstü) görsel regresyon çekimi — deterministik REDUCED-MOTION.
   Aynı script hem TABAN hem SONRASI için: MOD=taban|sonra ile klasör seçilir.
   6 temsili sayfa × {1440, 375} tam sayfa PNG.
   Kullanım: dist bir portta servis edildikten sonra
     MOD=taban PORT=5401 node arac/faz1-goruntu.mjs                          */
import { chromium } from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const MOD = process.env.MOD || 'taban';
const PORT = process.env.PORT || '5401';
const TABAN = `http://localhost:${PORT}`;
const CIKTI = `${KOK}/cikti/denetim/faz1-odul/${MOD}`;
const EXE =
  '/home/suha/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';

const YOLLAR = [
  ['/', 'ana'],
  ['/harita/', 'harita'],
  ['/havzalar/sakarya/', 'sakarya'],
  ['/rehberler/kuyu-ruhsati/', 'kuyu-ruhsati'],
  ['/vaka/meysu/', 'meysu'],
  ['/kuyu-ruhsati/konya/', 'il-konya'],
];
const GENISLIKLER = [
  [1440, 'w1440'],
  [375, 'w375'],
];

mkdirSync(CIKTI, { recursive: true });

const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

// reducedMotion:'reduce' → .gk koreografisi, sayı-canlanma ve landing sonsuz
// animasyonları KURULMAZ; çekim resting-state, kare-bağımsız deterministik.
const ctx = await tarayici.newContext({
  reducedMotion: 'reduce',
  deviceScaleFactor: 1,
});

let hata = 0;
for (const [yol, ad] of YOLLAR) {
  for (const [gen, getiket] of GENISLIKLER) {
    const sayfa = await ctx.newPage();
    await sayfa.setViewportSize({ width: gen, height: 900 });
    const yanit = await sayfa.goto(`${TABAN}${yol}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    if (!yanit || !yanit.ok()) {
      console.error(`HATA ${yol} ${getiket}: HTTP ${yanit ? yanit.status() : 'yok'}`);
      hata++;
    }
    // Fontlar yerleşsin — deterministik metin ölçüsü için
    await sayfa.evaluate(() => document.fonts.ready);
    const dosya = `${CIKTI}/${ad}-${getiket}.png`;
    await sayfa.screenshot({ path: dosya, fullPage: true });
    console.log(`✓ ${MOD}/${ad}-${getiket}.png`);
    await sayfa.close();
  }
}

await tarayici.close();
if (hata > 0) {
  console.error(`\n${hata} sayfa HTTP hatası — çekim eksik.`);
  process.exit(1);
}
console.log(`\n${MOD}: ${YOLLAR.length * GENISLIKLER.length} görüntü tamam → ${CIKTI}`);
