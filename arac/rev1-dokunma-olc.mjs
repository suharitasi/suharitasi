/* REV1 — dokunma hedefi + satır/kırpma ölçümü (salt ölçüm).
   1) Mock'taki gerçek kartçık/şerit kutularının görsel boyutu.
   2) Tıklanabilirlik: görsel kutunun DIŞINDA ama görünmez pad içinde bir noktada
      elementFromPoint gerçekten <a>'yı döndürüyor mu (pad iddiası kanıtlanır).
   3) 375'te 7 sorunun R2 şeridinde kırpılıp kırpılmadığı + R1'de satır sayısı.
   Kullanım: node arac/rev1-dokunma-olc.mjs                                      */
import pw from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.js';
const { chromium } = pw;
import { writeFileSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const CIKTI = `${KOK}/cikti/denetim/anasayfa-sahne/rev1`;
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const URL = `file://${CIKTI}/mock.html`;

const SORULAR = [
  'Su nerelerde çıkar?',
  'Kuyu ruhsatı almak için ne yapmalıyım?',
  'Ruhsatsız kuyu cezası aldım, ne yapmalıyım?',
  'Kuyum kurudu — aynı ruhsatla taşıyabilir miyim?',
  'Su verimliliği belgesi almak zorunda mıyım?',
  'Barajlarımızda ne kadar su var?',
  'Bölgemde yeraltı suyu azalıyor mu?',
];

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const rapor = { kutular: {}, dokunma: {}, mobil_satir: {} };

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });

rapor.kutular['1440'] = await page.evaluate(() => {
  const oku = (sec) => { const e = document.querySelector(sec); if (!e) return null;
    const r = e.getBoundingClientRect(); const p = e.closest('.pencere').getBoundingClientRect();
    return { en: Math.round(r.width), boy: Math.round(r.height),
             pencere_eni: Math.round(p.width), oran_yuzde: Math.round(r.width / p.width * 100),
             alan_yuzde: Math.round((r.width * r.height) / (p.width * p.height) * 100) }; };
  return { mevcut: oku('.kart--mevcut'), r1: oku('.kart--r1'), r2_serit: oku('.serit') };
});

// Tıklanabilirlik kanıtı: görsel kutunun 6px ÜSTÜNDE bir nokta hâlâ <a> mı?
rapor.dokunma['1440'] = await page.evaluate(() => {
  const dene = (sec) => {
    const e = document.querySelector(sec);
    e.scrollIntoView({ block: 'center' });   // elementFromPoint yalnız görünür alanda çalışır
    const r = e.getBoundingClientRect();
    const x = Math.round(r.left + r.width / 2);
    const sonuc = {};
    for (const [ad, y] of [['gorsel-ici', Math.round(r.top + r.height / 2)],
                           ['gorsel-ustu-6px', Math.round(r.top - 6)],
                           ['gorsel-alti-6px', Math.round(r.bottom + 6)]]) {
      const hedef = document.elementFromPoint(x, y);
      sonuc[ad] = hedef ? (hedef === e || e.contains(hedef) ? 'KART' : hedef.tagName.toLowerCase() + '.' + (hedef.className || '')) : 'yok';
    }
    // etkin tıklama yüksekliği: kartın üstünden aşağı doğru tara
    let ust = Math.round(r.top), alt = Math.round(r.bottom);
    for (let y = Math.round(r.top) - 30; y < r.top; y++) { const h = document.elementFromPoint(x, y); if (h && (h === e || e.contains(h))) { ust = y; break; } }
    for (let y = Math.round(r.bottom) + 30; y > r.bottom; y--) { const h = document.elementFromPoint(x, y); if (h && (h === e || e.contains(h))) { alt = y; break; } }
    return { ...sonuc, gorsel_yukseklik: Math.round(r.height), etkin_yukseklik: alt - ust, genislik: Math.round(r.width) };
  };
  return { mevcut: dene('.kart--mevcut'), r1: dene('.kart--r1'), r2_serit: dene('.serit') };
});
await page.close();

// —— 375 kırılımı: mock'taki sabit 375 kutuları üzerinden ——
const p375 = await browser.newPage({ viewport: { width: 420, height: 900 } });
await p375.goto(URL, { waitUntil: 'networkidle' });
rapor.kutular['375'] = await p375.evaluate(() => {
  const oku = (sec) => { const e = document.querySelector(sec); if (!e) return null;
    const r = e.getBoundingClientRect(); const p = e.closest('.pencere').getBoundingClientRect();
    return { en: Math.round(r.width), boy: Math.round(r.height), pencere_eni: Math.round(p.width) }; };
  return { mevcut: oku('.mobil-kutu .kart--mevcut'), r1: oku('.mobil-kutu .kart--r1'), r2_serit: oku('.mobil-kutu .serit') };
});
rapor.dokunma['375'] = await p375.evaluate(() => {
  const dene = (sec) => { const e = document.querySelector(sec);
    e.scrollIntoView({ block: 'center' });
    const r = e.getBoundingClientRect();
    const x = Math.round(r.left + r.width / 2);
    let ust = Math.round(r.top), alt = Math.round(r.bottom);
    for (let y = Math.round(r.top) - 30; y < r.top; y++) { const h = document.elementFromPoint(x, y); if (h && (h === e || e.contains(h))) { ust = y; break; } }
    for (let y = Math.round(r.bottom) + 30; y > r.bottom; y--) { const h = document.elementFromPoint(x, y); if (h && (h === e || e.contains(h))) { alt = y; break; } }
    return { gorsel_yukseklik: Math.round(r.height), etkin_yukseklik: alt - ust, genislik: Math.round(r.width) }; };
  return { mevcut: dene('.mobil-kutu .kart--mevcut'), r1: dene('.mobil-kutu .kart--r1'), r2_serit: dene('.mobil-kutu .serit') };
});

// 7 sorunun 375'te R2 şeridinde kırpılması + R1'de satır sayısı
rapor.mobil_satir = await p375.evaluate((sorular) => {
  const serit = document.querySelector('.mobil-kutu .serit .soru');
  const r1 = document.querySelector('.mobil-kutu .kart--r1 .soru');
  const eski = { s: serit.textContent, r: r1.textContent };
  const sonuc = [];
  for (const q of sorular) {
    serit.textContent = q;
    const kirpik = serit.scrollWidth > serit.clientWidth + 1;
    const gorunen = serit.clientWidth;
    r1.textContent = q;
    const satirYuk = parseFloat(getComputedStyle(r1).lineHeight);
    const satir = Math.round(r1.getBoundingClientRect().height / satirYuk);
    sonuc.push({ soru: q, r2_kirpildi: kirpik, r2_gorunur_px: Math.round(gorunen),
                 r2_gereken_px: Math.round(serit.scrollWidth), r1_satir: satir });
  }
  serit.textContent = eski.s; r1.textContent = eski.r;
  return sonuc;
}, SORULAR);
await p375.close();

await browser.close();
writeFileSync(`${CIKTI}/dokunma.json`, JSON.stringify(rapor, null, 2) + '\n');
console.log(JSON.stringify(rapor.kutular, null, 1));
console.log('DOKUNMA 1440:', JSON.stringify(rapor.dokunma['1440'], null, 1));
console.log('DOKUNMA 375:', JSON.stringify(rapor.dokunma['375'], null, 1));
console.log('375 SATIR/KIRPMA:');
for (const s of rapor.mobil_satir) console.log(` ${s.r2_kirpildi ? 'KIRPILDI' : 'sığdı   '} r1satır=${s.r1_satir} gereken=${s.r2_gereken_px}px görünür=${s.r2_gorunur_px}px · ${s.soru}`);
