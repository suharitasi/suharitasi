/* Faz 1 piksel regresyon: taban ↔ sonra, sayfa başına fark oranı.
   Eşik: ≤ %0,5. Aşan sayfa için fark-maskesi PNG'si üretilir.
   pixelmatch ESM: pixelmatch(img1,img2,out,w,h,opts) → farklı piksel sayısı. */
import pixelmatch from '/home/suha/projeler/suharitasi/node_modules/pixelmatch/index.js';
import { PNG } from '/home/suha/projeler/suharitasi/node_modules/pngjs/lib/png.js';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const DIZIN = `${KOK}/cikti/denetim/faz1-odul`;
const ESIK = 0.5; // yüzde

const dosyalar = readdirSync(`${DIZIN}/taban`).filter((f) => f.endsWith('.png'));
let enBuyuk = 0;
let asan = 0;
const satirlar = [];

for (const ad of dosyalar) {
  const a = PNG.sync.read(readFileSync(`${DIZIN}/taban/${ad}`));
  const b = PNG.sync.read(readFileSync(`${DIZIN}/sonra/${ad}`));
  if (a.width !== b.width || a.height !== b.height) {
    satirlar.push(`${ad.padEnd(22)} BOYUT FARKI ${a.width}x${a.height} ↔ ${b.width}x${b.height}`);
    asan++;
    continue;
  }
  const { width, height } = a;
  const diff = new PNG({ width, height });
  const farkli = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 });
  const oran = (farkli / (width * height)) * 100;
  enBuyuk = Math.max(enBuyuk, oran);
  const durum = oran <= ESIK ? 'GEÇ' : 'AŞTI';
  if (oran > ESIK) {
    asan++;
    writeFileSync(`${DIZIN}/fark-${ad}`, PNG.sync.write(diff));
  }
  satirlar.push(`${ad.padEnd(22)} ${oran.toFixed(4).padStart(9)}%  ${durum}${oran > ESIK ? '  → fark-' + ad : ''}`);
}

console.log(`\nPİKSEL REGRESYON (taban ↔ sonra, reduced-motion, eşik %${ESIK}):\n`);
for (const s of satirlar) console.log('  ' + s);
console.log(`\n  En büyük fark: %${enBuyuk.toFixed(4)} · aşan sayfa: ${asan}/${dosyalar.length}`);
process.exit(asan > 0 ? 1 : 0);
