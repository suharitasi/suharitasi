/* REV1 — kartçık yuvası + kontrast ölçümü (salt ölçüm, siteye dokunmaz).
   Girdi: rev1/kareler/sahneN-p{0,25,50,75,100}.jpg  (6 sahne × 5 kare)
   Üretir:
     1) YUVA HARİTASI — her sahne için 20 aday yuvanın "detay enerjisi"
        (Sobel benzeri gradyan büyüklüğü ortalaması). Yuva enerjisi kare
        ortancasına oranla düşükse "boş"; yüksekse ana özne biniyor demektir.
        Enerji 5 karenin EN KÖTÜSÜ (max) üzerinden alınır — bir karede bile
        binme varsa yuva elenir.
     2) KONTRAST — seçilen yuvada iki metin katmanı ayrı ayrı:
        soru (#132A3F) ve hedef satırı (kehribar #875518), plaka α .70/.75/.80/.90.
        Ayrıca R2 alt şeridi (video alt kenarı) aynı alfalarla.
   Kullanım: node arac/rev1-yuva-kontrast.mjs                                   */
import pw from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.js';
const { chromium } = pw;
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const KARE = `${KOK}/cikti/denetim/anasayfa-sahne/rev1/kareler`;
const CIKTI = `${KOK}/cikti/denetim/anasayfa-sahne/rev1`;
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
mkdirSync(CIKTI, { recursive: true });

const KARE_YUZDE = [0, 25, 50, 75, 100];
const YUVA_EN = 0.27, YUVA_BOY = 0.17;               // R1 kartçık oranı (kare içinde)
const X_ADIM = [0.04, 0.20, 0.36, 0.52, 0.69];
const Y_ADIM = [0.08, 0.28, 0.48, 0.68];
const SERIT = [0.04, 0.86, 0.92, 0.10];               // R2 alt şerit: x,y,w,h

const ALFALAR = [0.70, 0.75, 0.80, 0.90];
const PLAKA = [0xE9, 0xF0, 0xF4];
const SORU = [0x13, 0x2A, 0x3F];      // Mürekkep
const HEDEF = [0x87, 0x55, 0x18];     // kehribar-metin

const srgb = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const kontrast = (a, b) => { const l1 = lum(a), l2 = lum(b); const [h, d] = l1 > l2 ? [l1, l2] : [l2, l1]; return (h + 0.05) / (d + 0.05); };
const kompozit = (ust, alt, alfa) => ust.map((u, i) => Math.round(u * alfa + alt[i] * (1 - alfa)));
const r2 = (x) => Math.round(x * 100) / 100;

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const page = await browser.newPage();

// Tarayıcıda tek seferde: gri tonlama + gradyan büyüklüğü + bölge istatistikleri
async function kareOku(dosya) {
  const b64 = readFileSync(dosya).toString('base64');
  return page.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const { data, width: W, height: H } = ctx.getImageData(0, 0, c.width, c.height);
    const gri = new Float32Array(W * H);
    for (let i = 0, p = 0; i < data.length; i += 4, p++) gri[p] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    // gradyan büyüklüğü (merkezi fark)
    const grad = new Float32Array(W * H);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const gx = gri[i + 1] - gri[i - 1], gy = gri[i + W] - gri[i - W];
      grad[i] = Math.hypot(gx, gy);
    }
    return { W, H, gri: Array.from(gri), grad: Array.from(grad),
             rgb: Array.from(data).filter((_, k) => k % 4 !== 3) };
  }, `data:image/jpeg;base64,${b64}`);
}

function bolgeIstatistik(k, [x0f, y0f, wf, hf]) {
  const x0 = Math.floor(x0f * k.W), y0 = Math.floor(y0f * k.H);
  const w = Math.floor(wf * k.W), h = Math.floor(hf * k.H);
  let enerji = 0, n = 0;
  const pikseller = [];
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
    const i = y * k.W + x;
    enerji += k.grad[i]; n++;
    pikseller.push([k.rgb[i * 3], k.rgb[i * 3 + 1], k.rgb[i * 3 + 2]]);
  }
  const sirali = pikseller.map(p => ({ p, L: lum(p) })).sort((a, b) => a.L - b.L);
  return {
    enerji: enerji / n,
    p95: sirali[Math.floor(sirali.length * 0.95)].p,
    p05: sirali[Math.floor(sirali.length * 0.05)].p,
    ortanca: sirali[Math.floor(sirali.length / 2)].p,
    enAcik: sirali[sirali.length - 1].p,
    enKoyu: sirali[0].p,
  };
}

const sonuc = { yuvalar: {}, kontrast: {}, ozet: {} };

for (let n = 1; n <= 6; n++) {
  const kareler = [];
  for (const p of KARE_YUZDE) kareler.push(await kareOku(`${KARE}/sahne${n}-p${p}.jpg`));

  // kare geneli enerji ortancası (referans eşik)
  const genelEnerji = kareler.map(k => bolgeIstatistik(k, [0, 0, 1, 1]).enerji);
  const genelOrt = genelEnerji.reduce((a, b) => a + b, 0) / genelEnerji.length;

  const yuvalar = [];
  for (const yx of X_ADIM) for (const yy of Y_ADIM) {
    const kutu = [yx, yy, YUVA_EN, YUVA_BOY];
    const perKare = kareler.map(k => bolgeIstatistik(k, kutu));
    const enKotuEnerji = Math.max(...perKare.map(s => s.enerji));
    yuvalar.push({
      ad: `x${Math.round(yx * 100)}-y${Math.round(yy * 100)}`,
      kutu,
      enerji_max: r2(enKotuEnerji),
      enerji_orani: r2(enKotuEnerji / genelOrt),   // <1 = kare ortalamasından sakin
      binme: enKotuEnerji / genelOrt > 1.0,        // ana özne binme kriteri
      kare_enerjileri: perKare.map(s => r2(s.enerji)),
      // kontrast için en kötü (en açık) kare örneği
      p95: perKare.map(s => s.p95).sort((a, b) => lum(b) - lum(a))[0],
      enAcik: perKare.map(s => s.enAcik).sort((a, b) => lum(b) - lum(a))[0],
      p05: perKare.map(s => s.p05).sort((a, b) => lum(a) - lum(b))[0],
      enKoyu: perKare.map(s => s.enKoyu).sort((a, b) => lum(a) - lum(b))[0],
    });
  }
  yuvalar.sort((a, b) => a.enerji_orani - b.enerji_orani);
  sonuc.yuvalar[`sahne${n}`] = { genel_enerji_ort: r2(genelOrt), yuvalar };

  // — kontrast: en sakin 2 yuva (Y2 için) + R2 alt şeridi —
  const secilen = [yuvalar[0], yuvalar.find(y => y !== yuvalar[0] &&
    !(Math.abs(y.kutu[0] - yuvalar[0].kutu[0]) < YUVA_EN && Math.abs(y.kutu[1] - yuvalar[0].kutu[1]) < YUVA_BOY))];
  const seritIst = kareler.map(k => bolgeIstatistik(k, SERIT));
  const seritP95 = seritIst.map(s => s.p95).sort((a, b) => lum(b) - lum(a))[0];
  const seritEnAcik = seritIst.map(s => s.enAcik).sort((a, b) => lum(b) - lum(a))[0];
  const seritP05 = seritIst.map(s => s.p05).sort((a, b) => lum(a) - lum(b))[0];
  const seritEnKoyu = seritIst.map(s => s.enKoyu).sort((a, b) => lum(a) - lum(b))[0];

  // NOT: koyu zemin (p05/enKoyu) koyu metin için EN KÖTÜ haldir — plaka koyulaşır,
  // koyu metinle arasındaki fark kapanır. Açık zemin (p95) ise en iyi hal.
  const olc = (zeminler) => {
    const o = {};
    for (const a of ALFALAR) {
      o[a] = {
        soru_p95: r2(kontrast(SORU, kompozit(PLAKA, zeminler.p95, a))),
        soru_enacik: r2(kontrast(SORU, kompozit(PLAKA, zeminler.enAcik, a))),
        soru_p05: r2(kontrast(SORU, kompozit(PLAKA, zeminler.p05, a))),
        soru_enkoyu: r2(kontrast(SORU, kompozit(PLAKA, zeminler.enKoyu, a))),
        hedef_p95: r2(kontrast(HEDEF, kompozit(PLAKA, zeminler.p95, a))),
        hedef_enacik: r2(kontrast(HEDEF, kompozit(PLAKA, zeminler.enAcik, a))),
        hedef_p05: r2(kontrast(HEDEF, kompozit(PLAKA, zeminler.p05, a))),
        hedef_enkoyu: r2(kontrast(HEDEF, kompozit(PLAKA, zeminler.enKoyu, a))),
      };
    }
    return o;
  };

  sonuc.kontrast[`sahne${n}`] = {
    yuva1: { ad: secilen[0].ad, ...olc(secilen[0]) },
    yuva2: secilen[1] ? { ad: secilen[1].ad, ...olc(secilen[1]) } : null,
    r2_serit: olc({ p95: seritP95, enAcik: seritEnAcik, p05: seritP05, enKoyu: seritEnKoyu }),
  };
}

await browser.close();

// özet: her alfa için TÜM sahne/yuva/şeritte en kötü değerler
for (const a of ALFALAR) {
  const hepsi = [];
  for (const s of Object.values(sonuc.kontrast)) {
    for (const k of [s.yuva1, s.yuva2, s.r2_serit]) if (k) hepsi.push(k[a]);
  }
  sonuc.ozet[`alfa_${a}`] = {
    soru_en_kotu_p: r2(Math.min(...hepsi.map(h => Math.min(h.soru_p95, h.soru_p05)))),
    soru_en_kotu_mutlak: r2(Math.min(...hepsi.map(h => Math.min(h.soru_enacik, h.soru_enkoyu)))),
    hedef_en_kotu_p: r2(Math.min(...hepsi.map(h => Math.min(h.hedef_p95, h.hedef_p05)))),
    hedef_en_kotu_mutlak: r2(Math.min(...hepsi.map(h => Math.min(h.hedef_enacik, h.hedef_enkoyu)))),
  };
}
sonuc.ozet.yuva_secimi = Object.fromEntries(Object.entries(sonuc.yuvalar).map(([s, v]) => [s,
  { en_sakin: v.yuvalar.slice(0, 3).map(y => `${y.ad} (oran ${y.enerji_orani}${y.binme ? ' BİNME' : ''})`),
    en_yogun: v.yuvalar.slice(-1).map(y => `${y.ad} (oran ${y.enerji_orani})`) }]));

writeFileSync(`${CIKTI}/yuva-kontrast.json`, JSON.stringify(sonuc, null, 2) + '\n');
console.log(JSON.stringify(sonuc.ozet, null, 2));
console.log('Yazıldı: cikti/denetim/anasayfa-sahne/rev1/yuva-kontrast.json');
