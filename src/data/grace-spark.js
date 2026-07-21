// GRACE son-5-yıl sparkline noktaları — pencere mantığı grace-hesap.js ile
// aynı (son 5 yılın gerçek ayları). Kullanan: HavzaPaneli.astro.
// GÖRSEL DÜRÜSTLÜK (HavzaYasBandi kuralıyla AYNI eşik): serinin yayılımı,
// mutlak tepe değerin %0,5'inin altındaysa çizgi DÜZ çizilir ve şablon
// "aynı değer" dilini kullanır — mikro oynama eğim gibi gösterilmez.

/** @param {Record<string, number>} seri  "YYYY-MM" → cm anomali */
export function graceSpark(seri) {
  const aylar = Object.keys(seri).sort();
  if (!aylar.length) return null;
  const sonAy = aylar[aylar.length - 1];
  const [sy, sm] = sonAy.split('-').map(Number);
  const esik = `${sy - 5}-${String(sm).padStart(2, '0')}`;
  const son5 = aylar.filter((a) => a > esik);
  if (son5.length < 2) return null;

  const degerler = son5.map((a) => seri[a]);
  // Düzlük SERİNİN kendi yayılımından ölçülür; sıfır çizgisi çapası
  // (aşağıda) ölçeğe karışırsa sabit seri "oynak" sanılır — ilk doğrulama
  // testinde yakalandı.
  const seriMin = Math.min(...degerler);
  const seriMax = Math.max(...degerler);
  const seriYayilim = seriMax - seriMin;
  const tepe = Math.max(Math.abs(seriMin), Math.abs(seriMax));
  const duz = tepe === 0 || seriYayilim <= tepe * 0.005;

  // Çizim ölçeği: sıfır çizgisi görünür kalsın diye 0 çapalı (HavzaKahraman
  // ile aynı yaklaşım). Düz seride tüm noktalar zaten aynı y'ye düşer.
  const min = Math.min(seriMin, 0);
  const max = Math.max(seriMax, 0);
  const yayilim = max - min;

  const W = 100, H = 26, P = 2;
  const yHesap = (v) => P + ((max - v) / (yayilim || 1)) * (H - 2 * P);
  return {
    duz,
    cizgi: son5
      .map((a, i) => `${((i / (son5.length - 1)) * W).toFixed(1)},${yHesap(seri[a]).toFixed(1)}`)
      .join(' '),
    sifirY: +yHesap(0).toFixed(1),
    aySayisi: son5.length,
  };
}
