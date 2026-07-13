// VIZYON.md madde 1 prototipi: gayzer tepe noktasındayken fışkırma ekranın
// "camına" taşar — damla sıçraması + ağır süzülen yoğuşma damlaları.
// Işık kırılması backdrop-filter ile; DOM/CSS animasyonu, GPU-dostu.
export function camKur(cerceve) {
  const kat = document.createElement('div');
  kat.className = 'cam';
  kat.setAttribute('aria-hidden', 'true');
  cerceve.appendChild(kat);

  return function sicrat(x, y, mobil) {
    const sayi = mobil ? 5 : 9;
    for (let i = 0; i < sayi; i++) {
      const d = document.createElement('span');
      const suzulen = i < (mobil ? 1 : 2); // birkaçı camda ağır süzülür
      d.className = suzulen ? 'damla damla--suzulen' : 'damla';
      const boy = suzulen ? 10 + Math.random() * 14 : 3 + Math.random() * 7;
      const dx = (Math.random() - 0.5) * 170;
      const dy = 20 - Math.random() * 95;
      d.style.left = `${x + dx}px`;
      d.style.top = `${y + dy}px`;
      d.style.width = `${boy}px`;
      d.style.height = `${boy * (suzulen ? 1.25 : 1)}px`;
      if (suzulen) d.style.animationDuration = `${5 + Math.random() * 4}s`;
      d.addEventListener('animationend', () => d.remove());
      kat.appendChild(d);
    }
  };
}
