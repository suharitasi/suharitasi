/* SORU KARTÇIKLARI — video üzeri okunaklılık ölçümü (salt ölçüm, kod değiştirmez).
   6 sahne karesi (cikti/denetim/harita-donusum/kareler/sahne1-6.jpg) üzerinde
   kartçığın oturacağı bölgelerin piksel istatistiği alınır; iki alternatif için
   WCAG kontrast oranı hesaplanır:
     ALT A — yarı saydam YÜZEY plakası (#E9F0F4 @ alfa) + mürekkep metin (#132A3F)
     ALT B — plakasız: Köpük metin (#DBEAF4) + gölge/kenarlık, doğrudan video üstünde
   Kullanım: node arac/kartcik-kontrast.mjs
   Not: alfa kompozisyonu sRGB uzayında yapılır (tarayıcı davranışı; backdrop-filter
   YOK sayılır — blur ortalamayı yumuşatır, en kötü hali gizlemez).                */
import pw from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.js';
const { chromium } = pw;
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const KARE = `${KOK}/cikti/denetim/harita-donusum/kareler`;
const CIKTI = `${KOK}/cikti/denetim/anasayfa-sahne`;
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
mkdirSync(CIKTI, { recursive: true });

// Kartçık bölgeleri — karenin oranlı koordinatları (x0,y0,x1,y1)
const BOLGELER = {
  'sag-kolon (masaüstü kartçık şeridi)': [0.55, 0.10, 0.97, 0.90],
  'sol-kolon (sahne metni bölgesi)': [0.03, 0.20, 0.45, 0.80],
  'alt-bant (mobil kartçık bölgesi)': [0.05, 0.55, 0.95, 0.95],
};

const ALFALAR = [0.86, 0.90, 0.94];
const PLAKA = [0xE9, 0xF0, 0xF4];   // YÜZEY
const METIN_KOYU = [0x13, 0x2A, 0x3F]; // Mürekkep
const METIN_ACIK = [0xDB, 0xEA, 0xF4]; // Köpük
const TUL = [0x0A, 0x27, 0x40];        // DİP — koyu tül (scrim)
const TUL_ALFALAR = [0.45, 0.55, 0.65, 0.75, 0.82];

const srgb = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const kontrast = (a, b) => { const l1 = lum(a), l2 = lum(b); const [h, d] = l1 > l2 ? [l1, l2] : [l2, l1]; return (h + 0.05) / (d + 0.05); };
const kompozit = (ust, alt, alfa) => ust.map((u, i) => Math.round(u * alfa + alt[i] * (1 - alfa)));
const r2 = (x) => Math.round(x * 100) / 100;

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const page = await browser.newPage();

const sonuc = { bolgeler: {}, ozet: {} };

for (const [ad, kutu] of Object.entries(BOLGELER)) {
  sonuc.bolgeler[ad] = {};
  for (let n = 1; n <= 6; n++) {
    const b64 = readFileSync(`${KARE}/sahne${n}.jpg`).toString('base64');
    const veri = await page.evaluate(async ([yol, k]) => {
      const img = new Image();
      img.src = yol;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const x0 = Math.floor(k[0] * c.width), y0 = Math.floor(k[1] * c.height);
      const w = Math.floor((k[2] - k[0]) * c.width), h = Math.floor((k[3] - k[1]) * c.height);
      const d = ctx.getImageData(x0, y0, w, h).data;
      // Piksel başına göreli parlaklık (WCAG) hesabı burada değil — ham RGB
      // örnekleri döndürülüp Node tarafında hesaplanır (tek kaynak formül).
      const px = [];
      for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]]);
      return px;
    }, [`data:image/jpeg;base64,${b64}`, kutu]);

    const parlak = veri.map(p => ({ p, L: lum(p) })).sort((a, b) => a.L - b.L);
    const en_koyu = parlak[0].p;
    const ortanca = parlak[Math.floor(parlak.length / 2)].p;
    const en_acik = parlak[parlak.length - 1].p;
    // p95: tekil parlak pikselin (spekülar nokta) en kötü halini abartmamak için
    const p95 = parlak[Math.floor(parlak.length * 0.95)].p;
    const p05 = parlak[Math.floor(parlak.length * 0.05)].p;

    const altA = {};
    for (const a of ALFALAR) {
      altA[a] = {
        'en-kotu (p95 acik zemin)': r2(kontrast(METIN_KOYU, kompozit(PLAKA, p95, a))),
        'ortanca': r2(kontrast(METIN_KOYU, kompozit(PLAKA, ortanca, a))),
        'en-kotu (p05 koyu zemin)': r2(kontrast(METIN_KOYU, kompozit(PLAKA, p05, a))),
        'mutlak-en-acik': r2(kontrast(METIN_KOYU, kompozit(PLAKA, en_acik, a))),
        'mutlak-en-koyu': r2(kontrast(METIN_KOYU, kompozit(PLAKA, en_koyu, a))),
      };
    }
    const altB2 = {};
    for (const a of TUL_ALFALAR) {
      altB2[a] = {
        'en-kotu (p95 acik zemin)': r2(kontrast(METIN_ACIK, kompozit(TUL, p95, a))),
        'ortanca': r2(kontrast(METIN_ACIK, kompozit(TUL, ortanca, a))),
        'mutlak-en-acik': r2(kontrast(METIN_ACIK, kompozit(TUL, en_acik, a))),
      };
    }
    const altB = {
      'ortanca': r2(kontrast(METIN_ACIK, ortanca)),
      'p95 (acik zemin)': r2(kontrast(METIN_ACIK, p95)),
      'p05 (koyu zemin)': r2(kontrast(METIN_ACIK, p05)),
      'mutlak-en-acik': r2(kontrast(METIN_ACIK, en_acik)),
    };
    sonuc.bolgeler[ad][`sahne${n}`] = {
      ornek_piksel: { p05, ortanca, p95 },
      altA_plaka: altA,
      altB_plakasiz: altB,
      altB2_koyu_tul: altB2,
    };
  }
}

await browser.close();

// Özet: her alternatifin TÜM sahne+bölge üzerindeki en kötü değeri
const hepsi = Object.values(sonuc.bolgeler).flatMap(b => Object.values(b));
for (const a of ALFALAR) {
  sonuc.ozet[`altA_alfa_${a}_en_kotu`] = r2(Math.min(...hepsi.map(s =>
    Math.min(s.altA_plaka[a]['en-kotu (p95 acik zemin)'], s.altA_plaka[a]['mutlak-en-acik']))));
}
sonuc.ozet.altB_en_kotu_p95 = r2(Math.min(...hepsi.map(s => s.altB_plakasiz['p95 (acik zemin)'])));
sonuc.ozet.altB_ortanca_en_kotu = r2(Math.min(...hepsi.map(s => s.altB_plakasiz['ortanca'])));
for (const a of TUL_ALFALAR) {
  sonuc.ozet[`altB2_tul_${a}_en_kotu`] = r2(Math.min(...hepsi.map(s =>
    Math.min(s.altB2_koyu_tul[a]['en-kotu (p95 acik zemin)'], s.altB2_koyu_tul[a]['mutlak-en-acik']))));
}
sonuc.ozet.altB_mutlak_en_acik = r2(Math.min(...hepsi.map(s => s.altB_plakasiz['mutlak-en-acik'])));

writeFileSync(`${CIKTI}/kontrast.json`, JSON.stringify(sonuc, null, 2) + '\n');
console.log(JSON.stringify(sonuc.ozet, null, 2));
console.log('Yazıldı: cikti/denetim/anasayfa-sahne/kontrast.json');
