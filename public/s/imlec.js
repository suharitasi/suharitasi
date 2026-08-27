// [M4, 29.07.2026] Aşağıdaki CSS dizesinden bir blok yorum BURAYA
// taşındı. Sebep ölçüldü: esbuild dize İÇİNDEKİ yorumu küçültemez,
// bu yüzden tek Türkçe yorum küçültmeden sonra da canlıya çıkıyordu.
// JS yorumu olarak burada kalır (kayıt korunur), dizeye girmez.
// Ton: krem sayfada koyu-akuamarin, koyu sayfada açık-akuamarin.
// ÖLÜ DAL KALKTI (2026-07-27): "html.sv-menu-goruntude" kuralları
// tam-ekran menü katmanı (sv-menu / menu.js) içindi; o sistem 27.07'de
// kaldırıldı, sınıfı ekleyen tek kod menu.js'ti. Üç kanal kanıtı:
// (1) sınıfı ekleyen 0 — kaynakta, dist'te ve canlı 4 sayfada
// classList.add/toggle/className/setAttribute eşleşmesi yok;
// (2) dinleyici 0 — imlec.js'in 5 dinleyicisinin hiçbiri bu sınıfa
// bağlı değil, hepsi baslat() içinde ve baslat() koşullu çağrılıyor;
// (3) koşulsuz yan etki 0 — baslat() dışında yalnız iki matchMedia
// okuması var; kurallar hiç eşleşmeyen bir seçiciyi hedefliyordu. */
/* Su damlası imleç (sv-imlec)
   Landing + içerik sayfalarında yüklenir; /harita/ bu dosyayı hiç çağırmaz.
   Form: inline SVG damla — net kenar, üstte sivri / altta dolgun asimetrik
   siluet, iç parlaklık + ince dış hat; blur yok. Zemine göre otomatik ton:
   html[data-sv-ton="krem"] → koyu-akuamarin, koyu zemin → açık-akuamarin.
   Dokunmatik cihazda ve prefers-reduced-motion'da hiç başlamaz.
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
      opacity: 0; transition: opacity 0.25s var(--e-akinti, cubic-bezier(0.45, 0.05, 0.55, 0.95));
    }
    #sv-imlec.sv-gorunur { opacity: 1; }
    #sv-imlec .sv-damla {
      width: 16px; height: 20px;
      margin: -2px 0 0 -8px; /* sivri uç ~pointer noktası */
      transform-origin: 50% 35%;
      transform: scale(1);
      /* K31 (27.08): taşmalı yay eğrisi (y=1.56) DESIGN.md "su aniden
         fırlamaz" ilkesiyle çelişiyordu; sözlükteki KABARMA eğrisine
         çevrildi (--e-kabar, taşmasız). */
      transition: transform 0.22s var(--e-kabar, cubic-bezier(0.35, 0, 0.15, 1));
    }
    #sv-imlec .sv-damla svg { display: block; width: 100%; height: 100%; }

    #sv-imlec .sv-v-${krem ? 'koyu' : 'krem'} { display: none; }
    #sv-imlec.sv-buyuk .sv-damla {
      transform: scale(1.65);
      animation: sv-yuzey 0.2s var(--e-kabar, cubic-bezier(0.35, 0, 0.15, 1));
    }
    #sv-imlec.sv-bas .sv-damla { transform: scale(0.85); }
    #sv-imlec.sv-buyuk.sv-bas .sv-damla { transform: scale(1.35); }
    @keyframes sv-yuzey {
      0%   { transform: scale(1); }
      45%  { transform: scale(1.5) scaleX(1.16) scaleY(0.88); }
      100% { transform: scale(1.65); }
    }
  `;
  document.head.appendChild(stil);

  const el = document.createElement('div');
  el.id = 'sv-imlec';
  el.setAttribute('aria-hidden', 'true');
  // Asimetrik damla: üst sivri, alt dolgun; sağ omuz solundan hafif geniş.
  // .sv-v-krem: krem zemin için koyu gövde; .sv-v-koyu: koyu zemin için açık.
  const YOL = `M8 1.1
    C 8 1.1 3.9 7.3 2.8 11.1
    C 1.9 14.4 4.2 18.7 8.3 18.7
    C 12.8 18.7 14.6 14.1 13.4 10.7
    C 12.2 7.1 8 1.1 8 1.1 Z`;
  el.innerHTML = `
    <div class="sv-damla">
      <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sv-dg-krem" x1="0.3" y1="0" x2="0.62" y2="1">
            <stop offset="0" stop-color="#2E8FB8"/>
            <stop offset="1" stop-color="#0C5A7C"/>
          </linearGradient>
          <linearGradient id="sv-dg-koyu" x1="0.3" y1="0" x2="0.62" y2="1">
            <stop offset="0" stop-color="#93D8F5"/>
            <stop offset="1" stop-color="#57BAE0"/>
          </linearGradient>
        </defs>
        <g class="sv-v-krem">
          <path d="${YOL}" fill="url(#sv-dg-krem)" stroke="rgba(10,39,64,0.9)" stroke-width="1"/>
          <ellipse cx="5.9" cy="12.6" rx="1.5" ry="2.3"
            fill="rgba(255,255,255,0.6)" transform="rotate(-16 5.9 12.6)"/>
        </g>
        <g class="sv-v-koyu">
          <path d="${YOL}" fill="url(#sv-dg-koyu)" stroke="rgba(230,249,252,0.8)" stroke-width="1"/>
          <ellipse cx="5.9" cy="12.6" rx="1.5" ry="2.3"
            fill="rgba(255,255,255,0.8)" transform="rotate(-16 5.9 12.6)"/>
        </g>
      </svg>
    </div>`;
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
