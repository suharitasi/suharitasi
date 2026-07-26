// HAVZA KONUMLANDIRICI — build-time SVG yolu üreticisi (D3-A, 26 Tem 2026).
// Referans görsel turunda kullanıcı D3-A'yı seçti (kıyas: cikti/denetim/
// referans-gorsel/). Tek iş: "bu havza Türkiye'nin neresi?" — büyüklük,
// yoğunluk veya herhangi bir veri BOYAMAZ (dataviz: iş = kimlik/konum,
// dolayısıyla konumlandırıcı; choropleth DEĞİL, lejant gerekmez).
//
// ⚠ VERİ DÜRÜSTLÜĞÜ — BAĞLAYICI: depoda HAVZA SINIR GEOMETRİSİ YOKTUR.
// Bu modül havza sınırı çizmez; havzanın KAPSADIĞI İLLERİ boyar
// (data/il-kurum.json → havzaIlleri). Sayfadaki etiket de bunu söylemek
// ZORUNDADIR. "Havza sınırı" demek yanlış olur — iller havzalara kısmen
// girer ve sayfanın kendi veri künyesi bunu zaten yazıyor.
//
// Palet: tek hue. #0C5A7C ile #2E7EA0 yan yana iki veri kategorisi olarak
// KULLANILAMAZ (dataviz doğrulayıcı: normal görüş ΔE 11,8 · eşik 15).
// Burada tek seri var, ayrım renkle değil dolu/boş ile yapılıyor.
import iller from './tr-iller.json';
import sinirVeri from './tr-sinir.json';
import ilKurum from '../../data/il-kurum.json';

export const EN = 320;
export const BOY = 150;

// Eşdikdörtgen, sabit enlem düzeltmeli. Projeksiyon iddiası taşımaz —
// konumlandırıcıdır, ölçüm yüzeyi değildir.
const LON0 = 25.6, LON1 = 45.1, LAT0 = 35.7, LAT1 = 42.3;
const K = Math.cos(((LAT0 + LAT1) / 2) * Math.PI / 180);
const ol = Math.min(EN / ((LON1 - LON0) * K), BOY / (LAT1 - LAT0));
const ox = (EN - (LON1 - LON0) * K * ol) / 2;
const oy = (BOY - (LAT1 - LAT0) * ol) / 2;
const P = ([lon, lat]) => [
  Math.round(ox + (lon - LON0) * K * ol),
  Math.round(oy + (LAT1 - lat) * ol),
];

// Nokta seyreltme. Sebep ÖLÇÜLDÜ: ham geometriyle tek harita 135 KB inline
// SVG üretiyordu; ortalama sayfası ~27 KB olan bir sitede bu Lighthouse
// tabanını (ODUL-USTU "Korunacaklar") bozardı. 1.6 px eşiğinde 320×150
// ölçekte gözle fark edilmiyor, boyut 7 KB'a iniyor.
const MIN = 1.6;
// Ülke silueti BAĞLAMDIR, içerik değil: daha kaba seyreltilir ve 320 px
// genişlikte zaten görünmeyen küçük adalar atılır. Ölçüldü: silueti 4,1 KB'dan
// 2,2 KB'a indiriyor ve 25 sayfanın hepsinde tekrarlandığı için en büyük
// tasarruf burada. Havza illeri (içerik) ince eşikte kalır.
const MIN_ULKE = 3.2;
const MIN_ADA_PX = 6; // bu kadar dar bir halka 320×150'de nokta bile değil
const seyreltEsik = (p, esik) => {
  const o = [p[0]];
  for (let i = 1; i < p.length - 1; i++) {
    const a = o[o.length - 1];
    if (Math.abs(p[i][0] - a[0]) + Math.abs(p[i][1] - a[1]) >= esik) o.push(p[i]);
  }
  o.push(p[p.length - 1]);
  return o;
};
const yoldan = (p) => 'M' + p.map((c) => c.join(',')).join('L') + 'Z';
const halka = (r) => {
  const p = seyreltEsik(r.map(P), MIN);
  return p.length < 4 ? '' : yoldan(p);
};
const halkaKaba = (r) => {
  const ham = r.map(P);
  const xs = ham.map((c) => c[0]), ys = ham.map((c) => c[1]);
  if (Math.max(...xs) - Math.min(...xs) < MIN_ADA_PX &&
      Math.max(...ys) - Math.min(...ys) < MIN_ADA_PX) return '';
  const p = seyreltEsik(ham, MIN_ULKE);
  return p.length < 4 ? '' : yoldan(p);
};
const cokgen = (g) =>
  (g.type === 'Polygon' ? [g.coordinates] : g.coordinates)
    .map((poly) => poly.map(halka).join(''))
    .join('');

export const ULKE_YOLU = sinirVeri.halkalar.map(halkaKaba).join('');

// il-kurum.json "Afyonkarahisar", tr-iller.json "Afyon" der. Eşleme AÇIK
// yazılır; sessizce eşleşmeyen il atlanmaz (aşağıda hata fırlatılır).
const AD_ESLEME = { Afyonkarahisar: 'Afyon' };
const ilYolu = {};
for (const f of iller.features) ilYolu[f.properties.name] = cokgen(f.geometry);

/** Havza no → { yol, iller } | null. Veri yoksa null döner, uydurulmaz. */
export function havzaKonum(no) {
  const kayit = no ? ilKurum.havzaIlleri[no] : undefined;
  if (!kayit?.iller?.length) return null;
  const adlar = kayit.iller.map((n) => AD_ESLEME[n] ?? n);
  const eksik = adlar.filter((n) => !ilYolu[n]);
  // Sessiz hata yasağı: eşleşmeyen il varsa build DÜŞER, harita eksik çizilmez.
  if (eksik.length) {
    throw new Error(
      `havza-harita: havza ${no} — il geometrisi bulunamadı: ${eksik.join(', ')}`
    );
  }
  return { yol: adlar.map((n) => ilYolu[n]).join(''), iller: kayit.iller };
}
