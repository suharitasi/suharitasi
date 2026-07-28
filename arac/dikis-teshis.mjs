/* DİKİŞ TEŞHİSİ (B3.1, 2026-07-28) — koyu hero → aydınlık içerik geçişi
 * kimlik kararı mı, kaza mı?
 *
 * NE ÖLÇER: ana sayfanın bölüm bölüm zemin rengi, metin rengi, kontrast,
 * başlık tipografisi (aile/boyut/ağırlık), dikey ritim (bölüm padding'i),
 * ve geçiş sınırının ne kadar keskin olduğu. Ayrıca sınırın etrafından
 * kare dizisi alır.
 *
 * NEDEN ÖLÇÜM: "dikiş var mı" sorusu göz kararıyla cevaplanırsa tartışma
 * bitmez. Süreklilik ölçülebilir: aynı token ailesi kullanılıyor mu, ritim
 * bölümden bölüme sapıyor mu, kicker/h2 boyutları tutuyor mu.
 *
 * Kullanım: node arac/dikis-teshis.mjs [taban-url] [cikti-dizini]
 * Varsayılan: http://127.0.0.1:5197  ·  cikti/denetim/dikis
 */
// playwright-core + sabit chromium yolu (site-saglik.mjs ile AYNI kaynak —
// iki farklı tarayıcı sürümü iki farklı ölçüm demektir)
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const { chromium } = (await import('/home/suha/projeler/suharitasi/node_modules/playwright-core/index.js')).default;
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TABAN = process.argv[2] || 'http://127.0.0.1:5197';
const CIKTI = process.argv[3] || 'cikti/denetim/dikis';
const VIEWPORTLAR = [
  { ad: 'md', w: 1440, h: 900, dpr: 1 },
  { ad: 'mobil', w: 375, h: 812, dpr: 2 },
];

// gorsel-olc.mjs ile AYNI dondurma: ölçüm ara-kareye düşmesin.
const DONDUR = `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;
  animation-play-state:paused!important;transition-duration:0s!important;transition-delay:0s!important}
  html{scroll-behavior:auto!important}`;

const OLC = () => {
  /* Renk çözümü CANVAS ile yapılır, regex ile DEĞİL.
     Ölçüm hatası kaydı (28.07, ilk koşum): palet `oklch()` kullanıyor ve
     getComputedStyle bunu oklch olarak döndürüyor; regex ilk üç sayıyı
     (0.985 0.006 220) RGB sanıp aydınlık bölümleri KOYU raporladı.
     Canvas her CSS renk sözdizimini gerçek piksele çevirir. */
  const tuval = document.createElement('canvas');
  tuval.width = tuval.height = 1;
  const ctx2 = tuval.getContext('2d', { willReadFrequently: true });
  const rgb = (s) => {
    if (!s || s === 'transparent') return [];
    ctx2.clearRect(0, 0, 1, 1);
    ctx2.fillStyle = '#000';
    ctx2.fillStyle = s;
    ctx2.fillRect(0, 0, 1, 1);
    const d = ctx2.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const saydamMi = (s) => {
    if (!s || s === 'transparent') return true;
    ctx2.clearRect(0, 0, 1, 1);
    ctx2.fillStyle = s;
    ctx2.fillRect(0, 0, 1, 1);
    return ctx2.getImageData(0, 0, 1, 1).data[3] === 0;
  };
  const lum = (c) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const kontrast = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return +((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
  };
  // Zemin: şeffafsa üst öğelere tırman (gerçek görünen renk).
  const gercekZemin = (el) => {
    let n = el;
    while (n) {
      const bg = getComputedStyle(n).backgroundColor;
      if (!saydamMi(bg)) return rgb(bg);
      n = n.parentElement;
    }
    return [255, 255, 255];
  };

  const bolumler = [...document.querySelectorAll('section, header, footer')]
    .filter((s) => s.getBoundingClientRect().height > 80);

  return bolumler.map((s) => {
    const r = s.getBoundingClientRect();
    const st = getComputedStyle(s);
    const zemin = gercekZemin(s);
    const metinEl = s.querySelector('p, li, h2, h3') || s;
    const metin = rgb(getComputedStyle(metinEl).color);
    const h = s.querySelector('h1, h2');
    const hs = h ? getComputedStyle(h) : null;
    const kicker = s.querySelector('[class*="kicker"]');
    const ks = kicker ? getComputedStyle(kicker) : null;
    return {
      sinif: s.className || s.tagName.toLowerCase(),
      ust: Math.round(r.top + scrollY),
      yukseklik: Math.round(r.height),
      zemin, zeminHex: '#' + zemin.map((v) => v.toString(16).padStart(2, '0')).join(''),
      koyuMu: lum(zemin) < 0.5,
      metinRenk: metin,
      kontrast: kontrast(zemin, metin),
      padUst: parseFloat(st.paddingTop), padAlt: parseFloat(st.paddingBottom),
      basY: h ? h.tagName : null,
      basAile: hs ? hs.fontFamily.split(',')[0].replace(/["']/g, '') : null,
      basBoyut: hs ? +parseFloat(hs.fontSize).toFixed(1) : null,
      basAgirlik: hs ? hs.fontWeight : null,
      basHiza: hs ? hs.textAlign : null,
      kickerAile: ks ? ks.fontFamily.split(',')[0].replace(/["']/g, '') : null,
      kickerBoyut: ks ? +parseFloat(ks.fontSize).toFixed(1) : null,
      kickerHarfAra: ks ? ks.letterSpacing : null,
    };
  });
};

const tarayici = await chromium.launch({ executablePath: EXE });
const rapor = {};
mkdirSync(CIKTI, { recursive: true });

for (const v of VIEWPORTLAR) {
  const ctx = await tarayici.newContext({
    viewport: { width: v.w, height: v.h }, deviceScaleFactor: v.dpr,
    reducedMotion: 'reduce',   // hero sahnesi 0'da donar (gorsel-olc dersi)
  });
  const s = await ctx.newPage();
  await s.goto(`${TABAN}/`, { waitUntil: 'networkidle' });
  await s.addStyleTag({ content: DONDUR });
  await s.waitForTimeout(300);

  /* GÖRSEL SIRAYA göre sırala, DOM sırasına göre değil.
     Ölçüm hatası kaydı (28.07): mobilde kanıt bandı CSS `order` ile
     yeniden konumlanıyor (S1 korunsun diye — SIRADAKILER, satış
     uygulaması U1-U4). DOM sırası kullanılınca sınır listesi
     "aydınlık→koyu@670" gibi geriye giden bir sıra üretiyordu. */
  const bolumler = (await s.evaluate(OLC)).sort((a, b) => a.ust - b.ust);
  rapor[v.ad] = bolumler;

  // Geçiş sınırları: koyu→aydınlık ya da aydınlık→koyu her değişim
  const sinirlar = [];
  for (let i = 1; i < bolumler.length; i++) {
    if (bolumler[i].koyuMu !== bolumler[i - 1].koyuMu) {
      sinirlar.push({ i, y: bolumler[i].ust, yon: bolumler[i - 1].koyuMu ? 'koyu→aydınlık' : 'aydınlık→koyu' });
    }
  }
  rapor[`${v.ad}_sinirlar`] = sinirlar;

  // Kare dizisi: her sınırın 200px üstünden 200px altına
  for (const [n, sn] of sinirlar.entries()) {
    await s.evaluate((y) => scrollTo(0, Math.max(0, y - 260)), sn.y);
    await s.waitForTimeout(200);
    await s.screenshot({ path: join(CIKTI, `${v.ad}-sinir${n + 1}-${sn.yon.replace(/[^a-zçğıöşü]/gi, '')}.png`) });
  }
  // Tam sayfa referans
  await s.evaluate(() => scrollTo(0, 0));
  await s.waitForTimeout(200);
  await s.screenshot({ path: join(CIKTI, `${v.ad}-tam.png`), fullPage: true });
  await ctx.close();
}
await tarayici.close();

writeFileSync(join(CIKTI, 'olcum.json'), JSON.stringify(rapor, null, 1));

// ── Konsol özeti ──
for (const v of VIEWPORTLAR) {
  console.log(`\n═══ ${v.ad} (${v.w}px) ═══`);
  console.log('bölüm'.padEnd(30), 'zemin'.padEnd(9), 'koyu', 'kontrast', 'padÜ/A'.padEnd(9), 'başlık');
  for (const b of rapor[v.ad]) {
    console.log(
      String(b.sinif).slice(0, 29).padEnd(30),
      b.zeminHex.padEnd(9),
      (b.koyuMu ? ' ●  ' : ' ○  '),
      String(b.kontrast).padEnd(8),
      `${b.padUst}/${b.padAlt}`.padEnd(9),
      b.basY ? `${b.basY} ${b.basAile} ${b.basBoyut}px w${b.basAgirlik} ${b.basHiza}` : '—');
  }
  console.log('SINIRLAR:', rapor[`${v.ad}_sinirlar`].map((s) => `${s.yon}@${s.y}px`).join(' · ') || 'yok');
}
console.log(`\nkareler + olcum.json → ${CIKTI}`);
