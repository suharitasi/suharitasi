/* Sayı-canlanma (ödül-üstü Faz 1): görünüme giren [data-canlan] büyük değeri
   son ~%20'yi doldurur (0'dan değil — sahte-yükleniyor yasak). Tek IO;
   reduced-motion/no-JS'te değer zaten son hâlinde DOM'dadır (GEO/curl etkilenmez);
   ara kareler Intl tr-TR, son kare özgün metne birebir döner (regresyon güvenli).
   İşaret opt-in: yalnız gerçek büyüklükler; script asla yanlış değeri seçmez. */
const az = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ogeler = document.querySelectorAll('[data-canlan]');

if (!az && ogeler.length) {
  const SURE = 900;
  const cikis = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic ~ --e-suzul

  const io = new IntersectionObserver((girisler) => {
    for (const g of girisler) {
      if (!g.isIntersecting) continue;
      io.unobserve(g.target);
      const el = g.target;
      const son = el.textContent;                 // son hâl — birebir geri dönülür
      const hedef = parseFloat(el.dataset.canlan); // ham sayı (build-time)
      if (!isFinite(hedef)) continue;
      const ond = +el.dataset.ond || 0;
      const grup = /\d[.\s ]\d{3}/.test(son);      // binlik ayracı var mı
      const bicim = new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: ond, maximumFractionDigits: ond, useGrouping: grup,
      });
      const bas = hedef * 0.8;
      let t0 = 0;
      const adim = (zaman) => {
        if (!t0) t0 = zaman;
        const p = Math.min((zaman - t0) / SURE, 1);
        if (p >= 1) { el.textContent = son; return; }
        el.textContent = bicim.format(bas + (hedef - bas) * cikis(p));
        requestAnimationFrame(adim);
      };
      requestAnimationFrame(adim);
    }
  }, { threshold: 0.5 });

  ogeler.forEach((el) => io.observe(el));
}
