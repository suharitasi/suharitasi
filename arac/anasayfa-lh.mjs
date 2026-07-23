/* ANA SAYFA (/) Lighthouse performans TABANI — 3 tur medyan, masaüstü + mobil.
   Amaç: "6 sahne + süzülen sorular" dönüşümü öncesi BUGÜNKÜ kodun tabanı
   (palet C sonrası). Kod değiştirmez, salt ölçüm.
   Kullanım: dist 127.0.0.1:5197'de servis edilirken  node arac/anasayfa-lh.mjs  */
import lighthouse from '/home/suha/projeler/suharitasi/node_modules/lighthouse/core/index.js';
import { launch } from '/home/suha/projeler/suharitasi/node_modules/chrome-launcher/dist/index.js';
import { writeFileSync, mkdirSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const PORT = process.env.PORT || '5197';
const CIKTI = `${KOK}/cikti/denetim/anasayfa-sahne`;
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
mkdirSync(CIKTI, { recursive: true });

const medyan = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];

// Masaüstü profili: Lighthouse'un kendi desktop preset'i (mobil varsayılan).
const MASAUSTU = {
  formFactor: 'desktop',
  screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
  throttling: { rttMs: 40, throughputKbps: 10 * 1024, cpuSlowdownMultiplier: 1,
                requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 },
};

const chrome = await launch({
  chromePath: EXE,
  chromeFlags: ['--headless=new', '--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

const sonuc = {};
for (const [ad, ayar] of [['masaustu', MASAUSTU], ['mobil', {}]]) {
  const turlar = [];
  for (let i = 0; i < 3; i++) {
    const r = await lighthouse(`http://127.0.0.1:${PORT}/`, {
      port: chrome.port, onlyCategories: ['performance'], output: 'json', logLevel: 'error',
      ...ayar,
    });
    const a = r.lhr.audits;
    turlar.push({
      perf: Math.round(r.lhr.categories.performance.score * 100),
      fcp: a['first-contentful-paint'].numericValue,
      lcp: a['largest-contentful-paint'].numericValue,
      tbt: a['total-blocking-time'].numericValue,
      cls: a['cumulative-layout-shift'].numericValue,
      transferKB: Math.round((a['total-byte-weight'].numericValue || 0) / 1024),
      lcpEleman: (a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet) || '—',
    });
  }
  sonuc[ad] = {
    turlar,
    medyan: {
      perf: medyan(turlar.map(t => t.perf)),
      fcp: +(medyan(turlar.map(t => t.fcp)) / 1000).toFixed(2),
      lcp: +(medyan(turlar.map(t => t.lcp)) / 1000).toFixed(2),
      tbt: Math.round(medyan(turlar.map(t => t.tbt))),
      cls: +medyan(turlar.map(t => t.cls)).toFixed(3),
      transferKB: medyan(turlar.map(t => t.transferKB)),
    },
    lcpEleman: turlar[0].lcpEleman,
  };
  const m = sonuc[ad].medyan;
  console.log(`${ad.padEnd(9)} perf=[${turlar.map(t => t.perf)}] medyan=${m.perf} ` +
    `FCP=${m.fcp}s LCP=${m.lcp}s TBT=${m.tbt}ms CLS=${m.cls} transfer=${m.transferKB}KB`);
  console.log(`          LCP elemanı: ${sonuc[ad].lcpEleman}`);
}

await chrome.kill();
writeFileSync(`${CIKTI}/lighthouse-taban.json`, JSON.stringify(sonuc, null, 2) + '\n');
console.log('Yazıldı: cikti/denetim/anasayfa-sahne/lighthouse-taban.json');
