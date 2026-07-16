// GRACE eğim hesabı — TEK bakım noktası.
// Kullananlar: GraceEgilim.astro, havzalar/[slug].astro (öz-cevap),
// il-profil.js (araç + il sayfaları). Mantık her yerde AYNI olmak zorunda:
// son 5 yılın YALNIZ gerçek aylarından en küçük kareler eğimi (cm/yıl);
// 24 gerçek aydan azsa eğim hesaplanmaz (null) — uydurma yasağı.

/** @param {Record<string, number>} seri  "YYYY-MM" → cm anomali */
export function graceEgilim(seri) {
  const aylar = Object.keys(seri).sort();
  if (!aylar.length) return null;
  const sonAy = aylar[aylar.length - 1];
  const [sy, sm] = sonAy.split('-').map(Number);
  const esik = `${sy - 5}-${String(sm).padStart(2, '0')}`;
  const son5 = aylar.filter((a) => a > esik);
  if (son5.length < 24) return null;

  const x = son5.map((a) => Number(a.slice(0, 4)) + (Number(a.slice(5, 7)) - 0.5) / 12);
  const y = son5.map((a) => seri[a]);
  const n = x.length;
  const xo = x.reduce((t, v) => t + v, 0) / n;
  const yo = y.reduce((t, v) => t + v, 0) / n;
  let pay = 0, payda = 0;
  for (let i = 0; i < n; i++) {
    pay += (x[i] - xo) * (y[i] - yo);
    payda += (x[i] - xo) ** 2;
  }
  const egim = pay / payda;
  return {
    egim,
    yon: egim <= -0.5 ? 'azalma' : egim >= 0.5 ? 'toparlanma' : 'sabit',
    aySayisi: n,
    aralik: `${son5[0]} – ${sonAy}`,
    sonAy,
    sonDeger: seri[sonAy],
  };
}
