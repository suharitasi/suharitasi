// Havza YAS "GEO/öz-cevap" cümlesi — TEK kaynak (hem bant üstü paragraf hem
// FAQPage JSON-LD bundan üretilir). Değerler yalnız data/canli/havza-yas.json;
// trend ifadesi HavzaYasBandi sparkline'ındaki %0,5 "düz" eşiğiyle TUTARLI.
// Verisi olmayan havzada null döner — cümle KURULMAZ (uydurma yok).
import yasVeri from '../../data/canli/havza-yas.json';

const tr = (n, o = 1) =>
  n.toLocaleString('tr-TR', { minimumFractionDigits: o, maximumFractionDigits: o });

export function havzaYasGeo(no) {
  const h = no ? yasVeri.havzalar[no] : undefined;
  if (!h) return null;
  const dolu = yasVeri.yillar.filter((y) => h.potansiyel[String(y)] != null);
  if (!dolu.length) return null;

  const deg = dolu.map((y) => h.potansiyel[String(y)]);
  const ilk = deg[0];
  const son = deg[deg.length - 1];
  const min = Math.min(...deg);
  const max = Math.max(...deg);
  const duz = max - min <= max * 0.005; // bant sparkline eşiğiyle aynı
  const degisim = ilk === 0 ? 0 : ((son - ilk) / ilk) * 100;
  const ilkYil = dolu[0];
  const sonYil = dolu[dolu.length - 1];

  let trend;
  if (duz) trend = 'kayda değer değişim göstermedi';
  else if (degisim > 0) trend = `%${tr(Math.abs(degisim))} arttı`;
  else trend = `%${tr(Math.abs(degisim))} azaldı`;

  const cumle =
    `${h.ad}'nın yıllık yeraltı suyu (YAS) potansiyeli ${sonYil} itibarıyla ` +
    `${tr(son)} hm³'tür (DSİ). ${ilkYil}-${sonYil} döneminde ${trend}.`;

  return { cumle, sonYil, deger: son, trend, duz, degisim, ad: h.ad };
}
