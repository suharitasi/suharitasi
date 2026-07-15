/* İçerik sayfası davranışları: scroll reveal + yüzen nav zemini.
   - Reveal sınıfını JS ekler: no-JS'te içerik hiç gizlenmez.
   - Tek IntersectionObserver tüm hedeflere bağlanır (25 havza = 25 observer değil).
   - prefers-reduced-motion: reveal hiç kurulmaz, her şey anında görünür.
   - Nav zemini: scroll dinleyicisi yerine üstte 40px'lik sentinel + IO. */

const azHareket = window.matchMedia('(prefers-reduced-motion: reduce)');

/* --- Yüzen nav (40px eşik) --- */
const ust = document.querySelector('header.ust');
if (ust) {
  const nobetci = document.createElement('div');
  nobetci.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:40px;pointer-events:none;';
  document.body.prepend(nobetci);
  new IntersectionObserver(([giris]) => {
    ust.classList.toggle('sv-yuzer', !giris.isIntersecting);
  }).observe(nobetci);
}

/* --- Yazdırma: gizli kalmış içeriği aç ---
   Kâğıda/PDF'e basarken henüz görünür alana girmemiş tablolar ve kartlar
   boş basılmasın (rapor KOD-5). CSS'teki @media print kuralı da aynı işi
   yapar; bu dinleyici sınıfı da açarak reveal'ı geri döndürülemez kılar. */
addEventListener('beforeprint', () => {
  document
    .querySelectorAll('.sv-reveal:not(.sv-goster)')
    .forEach((e) => e.classList.add('sv-goster'));
});

/* --- Scroll reveal --- */
if (!azHareket.matches) {
  const hedefler = document.querySelectorAll(
    '.sv-liste > li, .icerik h2, .icerik table, .il-kurum, .il-kurum-tablosu'
  );
  if (hedefler.length) {
    let siraNo = 0;
    let sonZaman = 0;
    const izleyici = new IntersectionObserver((girisler) => {
      for (const g of girisler) {
        if (!g.isIntersecting) continue;
        // Aynı anda görünen satırlar 50ms kademelenir; yeni parti sıfırdan başlar.
        const simdi = performance.now();
        if (simdi - sonZaman > 300) siraNo = 0;
        sonZaman = simdi;
        g.target.style.transitionDelay = `${Math.min(siraNo++ * 50, 400)}ms`;
        g.target.classList.add('sv-goster');
        izleyici.unobserve(g.target); // her hedef bir kez
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    hedefler.forEach((h) => {
      h.classList.add('sv-reveal'); // gizleme sınıfını JS ekler
      izleyici.observe(h);
    });
  }
}
