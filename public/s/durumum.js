/* /durumum/ istemci davranışı (FAZ 7). İki iş, ikisi de progressive:
   - Sektör araması (index): #durumum-ara yoksa atlanır; JS kapalıysa kartların
     tamamı zaten görünür (server-render).
   - "Kalan gün" (persona sonuç): .kalan[data-son] yoksa atlanır; JS kapalıysa
     sabit tarih görünür, "kalan" eklenmez.
   Bağımsız, ≤2KB. */
const tr = (s) =>
  s.toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .trim();

/* — Arama — */
const kutu = document.getElementById('durumum-ara');
const kartlar = [...document.querySelectorAll('#durumum-izgara .pk, #durumum-izgara .pk-satir')];
const bos = document.getElementById('durumum-bos');
if (kutu && kartlar.length) {
  kutu.addEventListener('input', () => {
    const q = tr(kutu.value);
    let gorunen = 0;
    for (const k of kartlar) {
      const esles = !q || tr(k.dataset.ara || '').includes(q);
      k.hidden = !esles;
      if (esles) gorunen++;
    }
    if (bos) bos.hidden = gorunen > 0 || !q;
  });
}

/* — Kalan gün (sabit tarihten) — */
const kel = document.querySelector('.kalan[data-son]');
if (kel) {
  const hedef = new Date(kel.dataset.son + 'T00:00:00');
  const gun = Math.ceil((hedef - Date.now()) / 86400000);
  if (gun > 0) {
    const yil = Math.floor(gun / 365);
    const ay = Math.floor((gun % 365) / 30);
    kel.textContent = '· ~' + (yil ? yil + ' yıl ' : '') + (ay ? ay + ' ay ' : '') + 'kaldı';
    kel.hidden = false;
  }
}
