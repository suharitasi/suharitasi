/* REFERANS GÖRSEL TURU — havza konumlandırıcı SVG üreticisi (26 Tem 2026).
   DURUM: ONAY BEKLİYOR. Build'e BAĞLI DEĞİL, hiçbir sayfa bunu kullanmıyor.
   ODUL-USTU D3 "referans görsel onayı" kapısı geçilmeden siteye bağlanmaz.

   ÖNEMLİ VERİ NOTU: depoda HAVZA SINIR GEOMETRİSİ YOKTUR. Bu üretici havza
   sınırı çizmez; havzanın KAPSADIĞI İLLERİ (data/il-kurum.json havzaIlleri)
   boyar. Etiket de bunu söylemek zorundadır — "havza sınırı" demek veri
   dürüstlüğü ihlali olur (iller havzalara kısmen girer).

   Çıktı: cikti/denetim/referans-gorsel/d3-{a,b,c}.svg
   Kullanım: node arac/referans-havza-harita.mjs                            */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const KOK = '/home/suha/projeler/suharitasi';
const CIKTI = `${KOK}/cikti/denetim/referans-gorsel`;
mkdirSync(CIKTI, { recursive: true });

const iller = JSON.parse(readFileSync(`${KOK}/src/data/tr-iller.json`, 'utf8'));
const sinir = JSON.parse(readFileSync(`${KOK}/src/data/tr-sinir.json`, 'utf8')).halkalar;
const nehir = JSON.parse(readFileSync(`${KOK}/src/data/tr-nehirler.json`, 'utf8'));
const ilKurum = JSON.parse(readFileSync(`${KOK}/data/il-kurum.json`, 'utf8'));

// Türkiye bbox — eşdikdörtgen, enlem düzeltmeli (basit, sabit; harita
// projeksiyon iddiası taşımaz, KONUMLANDIRICIDIR).
const LON0 = 25.6, LON1 = 45.1, LAT0 = 35.7, LAT1 = 42.3;
const W = 320, H = 150;
const K = Math.cos(((LAT0 + LAT1) / 2) * Math.PI / 180);
const sx = W / ((LON1 - LON0) * K);
const sy = H / (LAT1 - LAT0);
const s = Math.min(sx, sy);
const ox = (W - (LON1 - LON0) * K * s) / 2;
const oy = (H - (LAT1 - LAT0) * s) / 2;
const P = ([lon, lat]) => [
  (ox + (lon - LON0) * K * s).toFixed(0),
  (oy + (LAT1 - lat) * s).toFixed(0),
];
// Nokta seyreltme: ardışık noktalar <MIN px ise atılır. Sebep ölçüldü —
// ham geometri havza başına 16-135 KB inline SVG üretiyordu; sayfa ortalaması
// 26,9 KB olan bir sitede bu Lighthouse tabanını (Korunacaklar) bozar.
const MIN = 1.6;
const seyrelt = (pts) => {
  const o = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = o[o.length - 1];
    if (Math.abs(pts[i][0] - a[0]) + Math.abs(pts[i][1] - a[1]) >= MIN) o.push(pts[i]);
  }
  o.push(pts[pts.length - 1]);
  return o;
};
const halkaYol = (r) => {
  const pts = seyrelt(r.map(P).map(([x, y]) => [+x, +y]));
  if (pts.length < 4) return '';
  return 'M' + pts.map((c) => c.join(',')).join('L') + 'Z';
};
const cokgenYol = (g) => {
  const p = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  return p.map((poly) => poly.map(halkaYol).join('')).join('');
};
const cizgiYol = (g) => {
  const l = g.type === 'LineString' ? [g.coordinates] : g.coordinates;
  return l.map((ln) => {
    const pts = seyrelt(ln.map(P).map(([x, y]) => [+x, +y]));
    return pts.length < 2 ? '' : 'M' + pts.map((c) => c.join(',')).join('L');
  }).join('');
};

const ulke = sinir.map(halkaYol).join('');
const nehirYol = (nehir.features ?? []).map((f) => cizgiYol(f.geometry)).join('');
const ilYol = {};
for (const f of iller.features) ilYol[f.properties.name] = cokgenYol(f.geometry);

// Sakarya havzası (no 12) — kapsadığı iller, il-kurum.json'dan.
const HAVZA_NO = '12';
// il-kurum.json "Afyonkarahisar" der, tr-iller.json "Afyon" — eşleme tablosu.
const AD_ESLEME = { Afyonkarahisar: 'Afyon' };
const havzaIller = ilKurum.havzaIlleri[HAVZA_NO].iller.map((n) => AD_ESLEME[n] ?? n);
const secili = havzaIller.map((n) => ilYol[n]).filter(Boolean).join('');
const eksik = havzaIller.filter((n) => !ilYol[n]);

const svg = (ic, w = W, h = H) =>
  `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" xmlns="http://www.w3.org/2000/svg">${ic}</svg>`;

// ——— D3-A: KONUMLANDIRICI (tek hue, sade) ———
const d3a = svg(`
  <path d="${ulke}" fill="#DFE9F0" stroke="#B9CEDC" stroke-width="0.5"/>
  <path d="${secili}" fill="#0C5A7C" fill-opacity="0.88" stroke="#08405A" stroke-width="0.6" stroke-linejoin="round"/>
`);

// ——— D3-B: SU AĞI (nehirler görünür) ———
const d3b = svg(`
  <path d="${ulke}" fill="#DFE9F0" stroke="#B9CEDC" stroke-width="0.5"/>
  <path d="${secili}" fill="#0C5A7C" fill-opacity="0.14" stroke="#0C5A7C" stroke-width="0.7" stroke-linejoin="round"/>
  <g clip-path="url(#kirp)"><path d="${nehirYol}" fill="none" stroke="#2E7EA0" stroke-width="0.55" stroke-opacity="0.85"/></g>
  <defs><clipPath id="kirp"><path d="${secili}"/></clipPath></defs>
`);

// ——— D3-C: KATMANLI (ülke nehirleri soluk + havza dolu) ———
const d3c = svg(`
  <path d="${ulke}" fill="#E9F0F4" stroke="#C6D8E4" stroke-width="0.5"/>
  <path d="${nehirYol}" fill="none" stroke="#B9CEDC" stroke-width="0.4"/>
  <path d="${secili}" fill="#0C5A7C" fill-opacity="0.92" stroke="#08405A" stroke-width="0.6" stroke-linejoin="round"/>
  <g clip-path="url(#kirp2)"><path d="${nehirYol}" fill="none" stroke="#DBEAF4" stroke-width="0.6" stroke-opacity="0.9"/></g>
  <defs><clipPath id="kirp2"><path d="${secili}"/></clipPath></defs>
`);

writeFileSync(`${CIKTI}/d3-a.svg`, d3a);
writeFileSync(`${CIKTI}/d3-b.svg`, d3b);
writeFileSync(`${CIKTI}/d3-c.svg`, d3c);
console.log('havza iller:', havzaIller.join(', '));
console.log('eslesmeyen il:', eksik.length ? eksik.join(', ') : 'yok');
console.log('svg bayt: a=%d b=%d c=%d', d3a.length, d3b.length, d3c.length);
