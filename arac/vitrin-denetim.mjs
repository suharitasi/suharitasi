/* VİTRİN DENETİMİ — kanıt bandı + /arsiv/ (vitrin briefi FAZ 4).
   Ölçtükleri: konsol · WCAG AA kontrast (yeni bloklardaki tüm metin düğümleri)
   · 375 sağ taşma · S1 KAZANIMI (mobil ilk soru kadraj içinde mi) · kareler.
   Taban arac/dist-sun.mjs olmalıdır (CSP + _redirects) — CANLI KOŞUL İLKESİ.
   Kullanım: node arac/vitrin-denetim.mjs [taban] [ciktiDizini] */
import { chromium } from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TABAN = (process.argv[2] || 'http://127.0.0.1:5197').replace(/\/$/, '');
const CIKTI = process.argv[3] || 'cikti/denetim/vitrin';
const EXE = '/home/suha/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';
const GURULTU = /GL Driver Message .*(Performance|GPU stall)/;

mkdirSync(CIKTI, { recursive: true });

// Sayfa bağlamında koşar — yardımcılar İÇERİDE tanımlı olmalı.
const KONTRAST = (secici) => {
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const oran = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  // RENK AYIRICI — oklch() DE ÇÖZÜLMELİ.
  // Hata kaydı (28.07): ilk sürüm yalnız rgb()/rgba() ayrıştırıyordu; v2
  // paleti oklch() kullandığı için 14 metin düğümünün 13'ü SESSİZCE atlandı
  // ve "kontrast temiz" görüntüsü doğdu. Artık tanınmayan biçimler canvas'ta
  // normalize edilir; yine çözülemezse düğüm ÇÖZÜLEMEDİ olarak sayılır ve
  // rapora girer (sessiz atlama yasağı).
  // oklch() → sRGB (CSS Color 4 tanımlı dönüşüm; tarayıcının canvas
  // normalizasyonu bu headless sürümde oklch'i kabul etmiyor, ölçüldü).
  const oklchSrgb = (L, C, Hderece, alfa) => {
    const h = (Hderece * Math.PI) / 180;
    const a = C * Math.cos(h);
    const b2 = C * Math.sin(h);
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b2;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b2;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b2;
    const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
    const lin = [
      +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    ];
    const gama = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
    return [...lin.map((c) => Math.max(0, Math.min(255, Math.round(gama(c) * 255)))), alfa];
  };
  const ayik = (s) => {
    const t = String(s).trim();
    const dogrudan = t.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    if (dogrudan) return [+dogrudan[1], +dogrudan[2], +dogrudan[3], dogrudan[4] === undefined ? 1 : +dogrudan[4]];
    const ok = t.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i);
    if (ok) {
      const yuzde = (v, tam) => (v.endsWith('%') ? parseFloat(v) / 100 * tam : parseFloat(v));
      return oklchSrgb(yuzde(ok[1], 1), yuzde(ok[2], 0.4), parseFloat(ok[3]), ok[4] ? yuzde(ok[4], 1) : 1);
    }
    if (/^transparent$/i.test(t)) return [0, 0, 0, 0];
    return null;
  };
  const zop = (el) => { let o = 1, x = el; while (x) { o *= parseFloat(getComputedStyle(x).opacity); x = x.parentElement; } return o; };
  const zem = (el) => {
    const k = []; let x = el;
    while (x) { const b = ayik(getComputedStyle(x).backgroundColor); if (b && b[3] > 0) { k.push(b); if (b[3] === 1) break; } x = x.parentElement; }
    if (!k.length) return [255, 255, 255];
    let t = k[k.length - 1].slice(0, 3);
    for (let i = k.length - 2; i >= 0; i--) { const c = k[i]; t = t.map((v, j) => Math.round(c[j] * c[3] + v * (1 - c[3]))); }
    return t;
  };
  const out = [];
  let cozulemeyen = 0;
  for (const el of document.querySelectorAll(secici)) {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    if (own.length < 2) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const st = getComputedStyle(el); if (st.display === 'none' || st.visibility === 'hidden') continue;
    const op = zop(el); if (op < 0.05) continue;
    const m = ayik(st.color); if (!m) { cozulemeyen++; continue; }
    const z = zem(el); const a = (m[3] ?? 1) * op;
    const e = m.slice(0, 3).map((c, j) => Math.round(c * a + z[j] * (1 - a)));
    const px = parseFloat(st.fontSize); const kalin = parseInt(st.fontWeight, 10) >= 700;
    const buyuk = px >= 24 || (px >= 18.66 && kalin);
    out.push({
      etiket: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : ''),
      px: Math.round(px * 10) / 10, esik: buyuk ? 3 : 4.5,
      oran: Math.round(oran(e, z) * 100) / 100, ornek: own.slice(0, 34),
    });
  }
  out.cozulemeyen = cozulemeyen;
  return { dugumler: out, cozulemeyen };
};

const YERLESIM = () => {
  const kok = document.documentElement;
  let sag = 0;
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width && r.right > kok.clientWidth + 1) sag++;
  }
  const liste = [...document.querySelectorAll('.v2-mobil-sorular a')]
    .map((a) => { const r = a.getBoundingClientRect(); return { metin: a.textContent.trim().slice(0, 44), ust: Math.round(r.top), alt: Math.round(r.bottom) }; })
    .sort((x, y) => x.ust - y.ust);
  return {
    yatayTasma: Math.max(0, kok.scrollWidth - kok.clientWidth),
    sagTasan: sag,
    ilkSoru: liste[0] || null,
    kanitBandiVar: Boolean(document.querySelector('.v2-kanit')),
  };
};

const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

const SECICI = '.v2-kanit *, .ar-liste *, .ar-serh, .ar-kunye *, .ar-kapatma *, .ar-kapatma-serh, .ar-kapatma-giris';
const rapor = { taban: TABAN, zaman: new Date().toISOString(), sayfalar: {} };
const hatalar = [];

for (const [genislik, yukseklik] of [[1440, 900], [375, 812]]) {
  const baglam = await tarayici.newContext({
    viewport: { width: genislik, height: yukseklik },
    deviceScaleFactor: genislik === 375 ? 2 : 1,
  });
  for (const [ad, yol] of [['anasayfa', '/'], ['arsiv', '/arsiv/']]) {
    const s = await baglam.newPage();
    const konsol = [];
    s.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !GURULTU.test(m.text())) konsol.push(`${m.type()}: ${m.text()}`); });
    s.on('pageerror', (e) => konsol.push(`pageerror: ${e.message}`));
    const c = await s.goto(TABAN + yol, { waitUntil: 'load', timeout: 45000 });
    await s.waitForTimeout(1400);

    const kontrast = await s.evaluate(KONTRAST, SECICI);
    const yerlesim = await s.evaluate(YERLESIM);
    await s.screenshot({ path: join(CIKTI, `${ad}-${genislik}.png`), fullPage: false });
    await s.screenshot({ path: join(CIKTI, `${ad}-${genislik}-tam.png`), fullPage: true });

    const ihlal = kontrast.dugumler.filter((x) => x.oran < x.esik);
    const anahtar = `${ad}-${genislik}`;
    rapor.sayfalar[anahtar] = { yol, http: c.status(), konsol, kontrastOlculen: kontrast.dugumler.length, cozulemeyenRenk: kontrast.cozulemeyen, ihlal, yerlesim, hepsi: kontrast.dugumler };

    // S1 KAZANIMI: yalnız 375 ana sayfada anlamlı — ilk soru kadraj içinde mi
    const s1 = ad === 'anasayfa' && genislik === 375 && yerlesim.ilkSoru
      ? yerlesim.ilkSoru.alt <= yukseklik : null;

    console.log(`${anahtar}: HTTP ${c.status()} · konsol ${konsol.length} · kontrast ${kontrast.dugumler.length} ölçüldü (çözülemeyen renk ${kontrast.cozulemeyen}), ihlal ${ihlal.length}`
      + ` · yatay taşma ${yerlesim.yatayTasma}px, sağ taşan ${yerlesim.sagTasan}`
      + (s1 === null ? '' : ` · S1 ilk soru ${yerlesim.ilkSoru.ust}-${yerlesim.ilkSoru.alt} ${s1 ? 'KADRAJ İÇİNDE' : 'ALTTA'} "${yerlesim.ilkSoru.metin}"`));
    ihlal.forEach((x) => console.log(`   İHLAL ${x.etiket} ${x.px}px ${x.oran} < ${x.esik} "${x.ornek}"`));

    if (c.status() !== 200) hatalar.push(`${anahtar} HTTP ${c.status()}`);
    if (konsol.length) hatalar.push(`${anahtar} konsol ${konsol.length}`);
    if (ihlal.length) hatalar.push(`${anahtar} kontrast ihlali ${ihlal.length}`);
    if (kontrast.cozulemeyen > 0) hatalar.push(`${anahtar} çözülemeyen renk ${kontrast.cozulemeyen} — ölçüm eksik sayılır`);
    // Sağ taşan öğe TEK BAŞINA hata değildir: ana sayfa hero'sunda poster
    // (scale 1.04) ve video (scale 1.02) kadrajı taşar ve .v2-hero
    // overflow:hidden ile kırpılır — main tabanında da 12 öğe ölçüldü
    // (28.07). Kullanıcının gördüğü arıza YATAY KAYDIRMA'dır; eşik odur.
    if (yerlesim.yatayTasma > 0) hatalar.push(`${anahtar} yatay kaydırma ${yerlesim.yatayTasma}px`);
    if (s1 === false) hatalar.push('S1 KAZANIMI BOZULDU — ilk soru kadraj dışında');
    if (ad === 'anasayfa' && !yerlesim.kanitBandiVar) hatalar.push(`${anahtar} kanıt bandı DOM'da yok`);

    await s.close();
  }
  await baglam.close();
}

await tarayici.close();
writeFileSync(join(CIKTI, 'vitrin-denetim.json'), JSON.stringify(rapor, null, 2) + '\n', 'utf8');
console.log(`kareler + ölçüm: ${CIKTI}`);
if (hatalar.length) { console.error('DENETİM DÜŞTÜ: ' + hatalar.join(' · ')); process.exit(1); }
console.log('DENETİM GEÇTİ');
