/* /hangi-kurum/ istemci filtresi. Progressive: #hk-ara yoksa atlanır;
   JS kapalıysa kartların tamamı zaten görünür (server-render) ve tam tablo
   JS'siz DOM'da durur. Kartlar <details> — açma/kapama native, JS gerektirmez;
   bu dosya YALNIZ aramayla daraltır. Bağımsız, ≤2KB. */
const tr = (s) =>
  s.toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .trim();

const kutu = document.getElementById('hk-ara');
const kartlar = [...document.querySelectorAll('#hk-kartlar .ik-kart')];
const bos = document.getElementById('hk-bos');

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
