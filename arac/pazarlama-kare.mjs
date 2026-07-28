/* DIŞ GÖZ DENETİMİ — kanıt kareleri + ilk-ekran ölçümü (pazarlama briefi FAZ B).
   CANLI site üzerinde koşar (canlı-koşul ilkesinin en güçlü hali).
   Ölçülenler [VERİ]: yük süresi (load event), ilk ekranda (scroll 0) görünen
   metin blokları, tıklanabilir öğe sayısı, konsol hataları, kare.
   Persona yorumu ÜRETMEZ — o katman raporda [VARSAYIM] etiketiyle elle yazılır.
   Kullanım: node arac/pazarlama-kare.mjs */
import { chromium } from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TABAN = 'https://suharitasi.com';
const CIKTI = '/home/suha/projeler/suharitasi/cikti/denetim/pazarlama';
const EXE = '/home/suha/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';
const GURULTU = /GL Driver Message .*(Performance|GPU stall)/;

const SAYFALAR = [
  ['anasayfa', '/'],
  ['nerede-su-cikar', '/nerede-su-cikar/'],
  ['il-konya', '/kuyu-ruhsati/konya/'],
  ['rehber-kuyu-ruhsati', '/rehberler/kuyu-ruhsati/'],
];

mkdirSync(CIKTI, { recursive: true });
const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

const rapor = { taban: TABAN, zaman: new Date().toISOString(), sayfalar: {} };

for (const [genislik, etiket] of [[1440, 'md'], [375, 'mobil']]) {
  const baglam = await tarayici.newContext({
    viewport: { width: genislik, height: genislik === 375 ? 812 : 900 },
    deviceScaleFactor: genislik === 375 ? 2 : 1,
  });
  for (const [ad, yol] of SAYFALAR) {
    const s = await baglam.newPage();
    const konsol = [];
    s.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !GURULTU.test(m.text())) konsol.push(`${m.type()}: ${m.text()}`); });
    s.on('pageerror', (e) => konsol.push(`pageerror: ${e.message}`));
    const t0 = Date.now();
    const c = await s.goto(TABAN + yol, { waitUntil: 'load', timeout: 45000 });
    const yukMs = Date.now() - t0;
    await s.waitForTimeout(1500); // giriş koreografisi otursun

    // İLK EKRAN (scroll 0): görünen metin blokları sırayla — "5 saniyede ne
    // görüyorum" sorusunun ölçülebilir yarısı.
    const ilkEkran = await s.evaluate(() => {
      const vh = innerHeight, vw = innerWidth;
      const gorunur = [];
      const secici = 'h1,h2,h3,p,a,button,summary,[class*="soru"],[class*="kart"]';
      for (const el of document.querySelectorAll(secici)) {
        const r = el.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw) continue;
        const st = getComputedStyle(el);
        if (st.visibility === 'hidden' || st.display === 'none') continue;
        let o = 1; let x = el;
        while (x) { o *= parseFloat(getComputedStyle(x).opacity); x = x.parentElement; }
        if (o < 0.05) continue;
        const metin = (el.childNodes.length ? [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('') : el.textContent).replace(/\s+/g, ' ').trim();
        if (metin.length < 3) continue;
        gorunur.push({
          etiket: el.tagName.toLowerCase(),
          tiklanabilir: Boolean(el.closest('a,button,summary')),
          metin: metin.slice(0, 70),
          ust: Math.round(r.top),
        });
      }
      gorunur.sort((a, b) => a.ust - b.ust);
      // aynı metni bir kez say
      const gorulen = new Set();
      const tekil = gorunur.filter((g) => !gorulen.has(g.metin) && gorulen.add(g.metin));
      return {
        blokSayisi: tekil.length,
        tiklanabilirSayisi: tekil.filter((g) => g.tiklanabilir).length,
        ilk12: tekil.slice(0, 12),
      };
    });

    await s.screenshot({ path: join(CIKTI, `${ad}-${genislik}.png`), fullPage: false });
    await s.screenshot({ path: join(CIKTI, `${ad}-${genislik}-tam.png`), fullPage: true });

    rapor.sayfalar[`${ad}-${genislik}`] = { yol, http: c.status(), yukMs, konsol, ilkEkran };
    console.log(`${ad}-${genislik}: HTTP ${c.status()} · yük ${yukMs}ms · ilk ekranda ${ilkEkran.blokSayisi} blok (${ilkEkran.tiklanabilirSayisi} tıklanabilir) · konsol ${konsol.length}`);
    await s.close();
  }
  await baglam.close();
}
await tarayici.close();
writeFileSync(join(CIKTI, 'ilk-ekran-olcum.json'), JSON.stringify(rapor, null, 2) + '\n', 'utf8');
console.log('yazıldı: ' + join(CIKTI, 'ilk-ekran-olcum.json'));
