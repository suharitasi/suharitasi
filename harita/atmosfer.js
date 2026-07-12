// Sayfa zemini su atmosferi: yavaş yükselen kabarcıklar.
// (Yoğuşma varyantı denendi ve elendi — statik lekeler koyu zeminde
// kir gibi okunuyordu; kabarcık harekette yaşayan bir doku veriyor.)

export function atmosferKur() {
  const kap = document.createElement('div');
  kap.className = 'atmosfer';
  kap.setAttribute('aria-hidden', 'true');
  document.body.prepend(kap);

  const SAYI = 20;
  for (let i = 0; i < SAYI; i++) {
    const b = document.createElement('span');
    const boy = 3 + (i % 6); // 3-8px
    const sol = (i * 47 + 13) % 100; // dağınık ama deterministik
    const sure = 14 + ((i * 7) % 16); // 14-29s
    const gecikme = -((i * 5.3) % sure);
    const opaklik = 0.08 + ((i % 4) * 0.04); // 0.08-0.20
    b.className = 'kabarcik';
    b.style.cssText = `left:${sol}vw;width:${boy}px;height:${boy}px;` +
      `animation-duration:${sure}s;animation-delay:${gecikme}s;opacity:${opaklik};`;
    kap.appendChild(b);
  }
}
