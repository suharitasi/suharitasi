/* ANA SAYFA AŞAMA 2 — öz-denetim ve kanıt üretimi (salt ölçüm, kod değiştirmez).
   Kapsam (brief KANIT a/b/c/e):
     a. 1440 + 375 ekran görüntüleri: akışın 0/25/50/75/100% noktaları + iniş.
     b. Kontrast: soru metni (#132A3F) + hedef satırı (#6B4412), şerit plakası
        α.80 ile birleştirilmiş EN KÖTÜ (en koyu) sahne pikseli üstünde.
        Yöntem rev1 ile aynı: plaka gizlenir, şerit bandındaki sahne pikselleri
        okunur, p05 ve mutlak en koyu piksel üzerinden blend hesaplanır.
     e. Konsol hata/uyarı, kırık iç link, 375 yatay taşma, reduced-motion,
        dokunma hedefi (elementFromPoint), "aynı hedef aynı anda yok" tablosu.
   Kullanım: dist 127.0.0.1:5197'de servis edilirken  node arac/anasayfa-asama2-denetim.mjs
*/
import pw from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.js';
import { PNG } from '/home/suha/projeler/suharitasi/node_modules/pngjs/lib/png.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { SORULAR } from '../src/data/anasayfa-sorular.js';

const { chromium } = pw;
const KOK = '/home/suha/projeler/suharitasi';
const CIKTI = `${KOK}/cikti/denetim/anasayfa-asama2`;
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const PORT = process.env.PORT || '5197';
const ADRES = `http://127.0.0.1:${PORT}/`;
mkdirSync(CIKTI, { recursive: true });

const NOKTALAR = [0, 0.25, 0.5, 0.75, 1];
const KIRILIMLAR = [
  { ad: '1440', viewport: { width: 1440, height: 900 } },
  { ad: '375', viewport: { width: 375, height: 667 } },
];

// — renk yardımcıları (WCAG) —
const kanal = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
const oran = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const blend = (ust, alt, a) => ust.map((c, i) => Math.round(c * a + alt[i] * (1 - a)));

const PLAKA = hex('#E9F0F4');
const ALFA = 0.80;
const METIN = { soru: hex('#132A3F'), hedef: hex('#6B4412'), hedef_eski: hex('#875518') };

const rapor = {
  uretim: 'arac/anasayfa-asama2-denetim.mjs',
  url: ADRES,
  konsol: {}, kirik_link: {}, tasma: {}, kontrast: {}, dokunma: {},
  reduced_motion: {}, serit_sira: {}, ekranlar: [],
};

const browser = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

// ——— 1) Şerit sırası: dilim tablosu + "aynı hedef aynı anda" denetimi ———
{
  const N = SORULAR.length;
  const tablo = [];
  let ihlal = 0;
  for (let d = 0; d < N; d++) {
    const sol = SORULAR[d];
    const sag = SORULAR[(d + 1) % N];
    const ayni = sol.hedef === sag.hedef;
    if (ayni) ihlal++;
    tablo.push({
      dilim: `${Math.round((d / N) * 100)}–${Math.round(((d + 1) / N) * 100)}%`,
      sol_yuva: sol.soru, sol_hedef: sol.hedef,
      sag_yuva: sag.soru, sag_hedef: sag.hedef,
      ayni_hedef: ayni,
    });
  }
  rapor.serit_sira = { tablo, ayni_hedef_ihlali: ihlal, sonuc: ihlal === 0 ? 'GEÇTİ' : 'KALDI' };
}

// ——— 2) Kırılım bazlı denetim ———
for (const k of KIRILIMLAR) {
  const ctx = await browser.newContext({ viewport: k.viewport, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const konsol = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') konsol.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => konsol.push(`pageerror: ${e.message}`));
  await page.goto(ADRES, { waitUntil: 'load' });
  await page.waitForTimeout(1200);

  const akisUz = await page.evaluate(() => {
    const t = document.querySelector('#world .sw-track');
    return t ? t.offsetHeight - innerHeight : 0;
  });

  // — ekranlar + kontrast (her noktada) —
  const kontrastNokta = [];
  for (const p of NOKTALAR) {
    await page.evaluate((y) => scrollTo(0, y), Math.round(akisUz * p));
    await page.waitForTimeout(900);
    const dosya = `${CIKTI}/akis-${k.ad}-p${Math.round(p * 100)}.png`;
    await page.screenshot({ path: dosya });
    rapor.ekranlar.push(dosya.replace(`${KOK}/`, ''));

    // Şerit bandındaki SAHNE pikselleri (plaka gizli) — en kötü hal ölçümü
    const kutu = await page.evaluate(() => {
      const s = document.querySelector('.soru-serit');
      const r = s.getBoundingClientRect();
      s.style.visibility = 'hidden';
      return { x: Math.round(r.x), y: Math.round(r.y),
               width: Math.round(r.width), height: Math.max(1, Math.round(r.height)) };
    });
    const ham = await page.screenshot({ clip: kutu });
    await page.evaluate(() => { document.querySelector('.soru-serit').style.visibility = ''; });

    const png = PNG.sync.read(ham);
    const pikseller = [];
    for (let i = 0; i < png.data.length; i += 4) pikseller.push([png.data[i], png.data[i + 1], png.data[i + 2]]);
    pikseller.sort((a, b) => lum(a) - lum(b));
    const enKoyu = pikseller[0];
    const p05 = pikseller[Math.floor(pikseller.length * 0.05)];

    const olc = (zemin) => {
      const z = blend(PLAKA, zemin, ALFA);
      return {
        zemin_hex: '#' + zemin.map((c) => c.toString(16).padStart(2, '0')).join(''),
        plaka_hex: '#' + z.map((c) => c.toString(16).padStart(2, '0')).join(''),
        soru: +oran(METIN.soru, z).toFixed(2),
        hedef_6B4412: +oran(METIN.hedef, z).toFixed(2),
        hedef_875518_kiyas: +oran(METIN.hedef_eski, z).toFixed(2),
      };
    };
    kontrastNokta.push({ nokta: `${Math.round(p * 100)}%`, en_koyu: olc(enKoyu), p05: olc(p05) });
  }
  rapor.kontrast[k.ad] = kontrastNokta;

  // — iniş bölümü ekranı —
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(700);
  const inisDosya = `${CIKTI}/inis-${k.ad}.png`;
  await page.screenshot({ path: inisDosya });
  rapor.ekranlar.push(inisDosya.replace(`${KOK}/`, ''));

  // — yatay taşma —
  rapor.tasma[k.ad] = await page.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - window.innerWidth));

  // — dokunma hedefi: görünür bandın 6px ÜSTÜ hâlâ <a> mı —
  await page.evaluate((y) => scrollTo(0, y), Math.round(akisUz * 0.5));
  await page.waitForTimeout(600);
  rapor.dokunma[k.ad] = await page.evaluate(() => {
    const a = [...document.querySelectorAll('.soru-serit .soru')].find(
      (e) => getComputedStyle(e).opacity === '1');
    if (!a) return { hata: 'görünür soru yok' };
    const r = a.getBoundingClientRect();
    const ust = document.elementFromPoint(r.x + r.width / 2, r.y - 6);
    const alt = document.elementFromPoint(r.x + r.width / 2, r.bottom + 6);
    return {
      gorsel: { en: Math.round(r.width), boy: Math.round(r.height) },
      etkin_boy: Math.round(getComputedStyle(a, '::after').height.replace('px', '')) || null,
      ust_6px_link_mi: !!(ust && ust.closest('.soru')),
      alt_6px_link_mi: !!(alt && alt.closest('.soru')),
    };
  });

  // — konsol —
  rapor.konsol[k.ad] = konsol;

  // — iç linkler: sayfadaki tüm site-içi bağlar —
  const linkler = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')))]);
  const kirik = [];
  for (const l of linkler) {
    const r = await page.request.get(new URL(l, ADRES).href, { maxRedirects: 0 });
    if (r.status() >= 400) kirik.push({ yol: l, kod: r.status() });
  }
  rapor.kirik_link[k.ad] = { toplam: linkler.length, kirik, linkler };

  await ctx.close();
}

// ——— 3) reduced-motion: şerit statik, 7 soru da erişilebilir ———
for (const k of KIRILIMLAR) {
  const ctx = await browser.newContext({ viewport: k.viewport, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(ADRES, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  rapor.reduced_motion[k.ad] = await page.evaluate(() => {
    const ogeler = [...document.querySelectorAll('.soru-serit .soru')];
    const gorunur = ogeler.filter((a) => {
      const st = getComputedStyle(a);
      const r = a.getBoundingClientRect();
      return st.opacity === '1' && st.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    });
    return {
      js_serit_sinifi: document.documentElement.classList.contains('js-serit'),
      soru_sayisi: ogeler.length,
      gorunur_soru: gorunur.length,
      tiklanabilir: gorunur.every((a) => getComputedStyle(a).pointerEvents !== 'none'),
      gecis_kapali: ogeler.every((a) => getComputedStyle(a).transitionDuration === '0s'),
    };
  });
  const d = `${CIKTI}/reduced-motion-${k.ad}.png`;
  await page.screenshot({ path: d });
  rapor.ekranlar.push(d.replace(`${KOK}/`, ''));
  await ctx.close();
}

// ——— 4) JS'siz DOM: öz-cevap + 7 link ———
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(ADRES, { waitUntil: 'load' });
  rapor.jssiz = await page.evaluate(() => ({
    oz_cevap: document.querySelector('[role="doc-abstract"]')?.textContent?.trim() ?? null,
    oz_cevap_uzunluk: document.querySelector('[role="doc-abstract"]')?.textContent?.trim().length ?? 0,
    h1: document.querySelector('h1')?.textContent?.trim() ?? null,
    soru_sayisi: document.querySelectorAll('.soru-serit .soru').length,
    gorunur_soru: [...document.querySelectorAll('.soru-serit .soru')]
      .filter((a) => getComputedStyle(a).opacity === '1').length,
  }));
  const d = `${CIKTI}/jssiz-1440.png`;
  await page.screenshot({ path: d, fullPage: true });
  rapor.ekranlar.push(d.replace(`${KOK}/`, ''));
  await ctx.close();
}

await browser.close();
writeFileSync(`${CIKTI}/oz-denetim.json`, JSON.stringify(rapor, null, 2));
console.log(JSON.stringify({
  serit_sira: rapor.serit_sira.sonuc,
  konsol: Object.fromEntries(Object.entries(rapor.konsol).map(([k, v]) => [k, v.length])),
  kirik_link: Object.fromEntries(Object.entries(rapor.kirik_link).map(([k, v]) => [k, v.kirik.length])),
  tasma: rapor.tasma,
  dokunma: rapor.dokunma,
  reduced_motion: rapor.reduced_motion,
  jssiz: rapor.jssiz,
  kontrast_en_kotu: Object.fromEntries(Object.entries(rapor.kontrast).map(([k, v]) => [k, {
    soru: Math.min(...v.map((x) => x.en_koyu.soru)),
    hedef: Math.min(...v.map((x) => x.en_koyu.hedef_6B4412)),
  }])),
}, null, 2));
