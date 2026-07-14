/* Su damlası imleç (sv-imlec)
   Landing + içerik sayfalarında yüklenir; /harita/ bu dosyayı hiç çağırmaz.
   Dokunmatik cihazda ve prefers-reduced-motion'da hiç başlamaz: native imleç kalır.
   Bilinen sınır: iframe/embed üstünde damla kaybolur (şu an sitede iframe yok). */

const kaba = window.matchMedia('(hover: none), (pointer: coarse)');
const azHareket = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!kaba.matches && !azHareket.matches) baslat();

function baslat() {
  const kok = document.documentElement;
  const krem = kok.dataset.svTon === 'krem';

  const stil = document.createElement('style');
  stil.textContent = `
    html.sv-imlec-gizli, html.sv-imlec-gizli * { cursor: none !important; }
    #sv-imlec {
      position: fixed; left: 0; top: 0; z-index: 2147483000;
      pointer-events: none; will-change: transform;
      opacity: 0; transition: opacity 0.25s ease;
    }
    #sv-imlec.sv-gorunur { opacity: 1; }
    #sv-imlec .sv-damla {
      width: 12px; height: 12px;
      margin: -6px 0 0 -6px;
      border-radius: 52% 48% 56% 44% / 62% 58% 42% 38%;
      background:
        radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 42%),
        ${krem
          ? 'radial-gradient(circle at 50% 55%, rgba(47,138,151,0.85) 0%, rgba(47,93,89,0.72) 78%)'
          : 'radial-gradient(circle at 50% 55%, rgba(79,195,208,0.78) 0%, rgba(79,195,208,0.58) 78%)'};
      transform: scale(1);
      transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                  border-radius 0.3s ease;
    }
    #sv-imlec.sv-buyuk .sv-damla {
      transform: scale(1.7);
      animation: sv-yuzey 0.2s cubic-bezier(0.34, 1.8, 0.64, 1);
    }
    #sv-imlec.sv-bas .sv-damla { transform: scale(0.85); }
    #sv-imlec.sv-buyuk.sv-bas .sv-damla { transform: scale(1.4); }
    @keyframes sv-yuzey {
      0%   { transform: scale(1) scaleX(1); }
      45%  { transform: scale(1.55) scaleX(1.18) scaleY(0.86); }
      100% { transform: scale(1.7); }
    }
  `;
  document.head.appendChild(stil);

  const el = document.createElement('div');
  el.id = 'sv-imlec';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<div class="sv-damla"></div>';
  document.body.appendChild(el);
  kok.classList.add('sv-imlec-gizli');

  let hx = -100, hy = -100; // hedef
  let x = -100, y = -100;   // mevcut (lerp)
  let ilk = true;

  const METIN = 'input[type="text"], input[type="search"], input[type="email"], input[type="url"], input[type="tel"], input[type="number"], input[type="password"], textarea, [contenteditable]';
  const ETKILESIM = 'a, button, [role="button"], summary, label, input[type="submit"]';

  document.addEventListener('pointermove', (e) => {
    hx = e.clientX; hy = e.clientY;
    if (ilk) { x = hx; y = hy; ilk = false; }
    el.classList.add('sv-gorunur');
    const h = e.target instanceof Element ? e.target : null;
    if (h && h.closest(METIN)) {
      // Metin alanı: damla söner, native text imleci geri gelir.
      kok.classList.remove('sv-imlec-gizli');
      el.classList.remove('sv-gorunur');
    } else {
      kok.classList.add('sv-imlec-gizli');
      el.classList.toggle('sv-buyuk', !!(h && h.closest(ETKILESIM)));
    }
  }, { passive: true });

  document.addEventListener('pointerdown', () => el.classList.add('sv-bas'), { passive: true });
  document.addEventListener('pointerup', () => el.classList.remove('sv-bas'), { passive: true });

  // Pencere dışına çıkış / dönüş
  document.documentElement.addEventListener('mouseleave', () => el.classList.remove('sv-gorunur'));
  document.documentElement.addEventListener('mouseenter', () => el.classList.add('sv-gorunur'));

  (function dongu() {
    x += (hx - x) * 0.15;
    y += (hy - y) * 0.15;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(dongu);
  })();
}
