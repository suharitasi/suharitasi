// Sayfa zemini su atmosferi. İki varyant: 'kabarcik' | 'yogusma'.
// Karşılaştırma için ?doku= parametresiyle seçilebilir; varsayılan kabarcık.

function kabarcikKur(kap) {
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

function yogusmaKur(kap) {
  const lekeler = [];
  for (let i = 0; i < 34; i++) {
    const x = (i * 37 + 11) % 100;
    const y = (i * 61 + 29) % 100;
    const r = 5 + ((i * 13) % 30); // 5-34px
    const a = 0.035 + ((i % 3) * 0.02);
    lekeler.push(
      `radial-gradient(circle ${r}px at ${x}vw ${y}vh, rgba(168,221,224,${a}) 0%, rgba(168,221,224,${a * 0.5}) 55%, transparent 72%)`
    );
  }
  kap.style.backgroundImage = lekeler.join(',');
}

export function atmosferKur() {
  const kap = document.createElement('div');
  kap.className = 'atmosfer';
  kap.setAttribute('aria-hidden', 'true');
  document.body.prepend(kap);

  const doku = new URLSearchParams(location.search).get('doku') || 'kabarcik';
  if (doku === 'yogusma') {
    yogusmaKur(kap);
  } else {
    kabarcikKur(kap);
  }
}
