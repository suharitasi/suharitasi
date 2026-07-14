/* Tam ekran menü denetleyicisi (sv-menu)
   - Açılış: overlay opacity+scale, sonra öğeler kademeli; en son simülasyon fade-in.
   - Su simülasyonu (/s/su-sim.js) İLK açılışta lazy import edilir.
   - Fallback zinciri: WebGL2 yok / reduced-motion / düşük FPS → statik derinlik
     zemini (CSS'te hazır; canvas hiç görünmez). Boş düz lacivert asla görünmez.
   - Erişilebilirlik: scroll kilidi, ESC, tab trap, focus iadesi, aria-expanded. */

const overlay = document.getElementById('sv-menu');
const aclar = document.querySelectorAll('.sv-menu-ac');

if (overlay && aclar.length) kur();

function kur() {
  const kapat = overlay.querySelector('.sv-menu-kapat');
  const azHareket = window.matchMedia('(prefers-reduced-motion: reduce)');
  const dokunmatik = window.matchMedia('(hover: none), (pointer: coarse)');

  let acan = null;         // focus iadesi için
  let sim = null;          // su-sim modül örneği
  let simDurum = 'yok';    // yok | yukleniyor | hazir | basarisiz
  let canvas = null;
  let kilitScroll = 0;

  const disAlanlar = [document.querySelector('main'), document.querySelector('footer'), document.querySelector('header.ust')].filter(Boolean);

  function odaklanabilir() {
    return overlay.querySelectorAll('a[href], button:not([disabled])');
  }

  async function simYukle() {
    if (simDurum !== 'yok' || azHareket.matches) return;
    simDurum = 'yukleniyor';
    try {
      const m = await import('/s/su-sim.js');
      canvas = document.createElement('canvas');
      canvas.className = 'sv-menu-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      overlay.insertBefore(canvas, overlay.firstChild);
      sim = m.baslat(canvas, {
        hata() {
          // Context loss / düşük FPS: canvas yumuşak söner, statik zemin kalır.
          simDurum = 'basarisiz';
          if (canvas) { canvas.classList.remove('sv-canli'); setTimeout(() => canvas.remove(), 600); canvas = null; }
          sim = null;
        },
      });
      if (!sim) {
        simDurum = 'basarisiz';
        canvas.remove(); canvas = null;
        return;
      }
      simDurum = 'hazir';
      if (overlay.classList.contains('sv-acik')) {
        sim.ac(); canvas.classList.add('sv-canli');
      }
    } catch {
      simDurum = 'basarisiz';
      if (canvas) { canvas.remove(); canvas = null; }
    }
  }

  function ac(dugme) {
    acan = dugme;
    kilitScroll = window.scrollY;
    document.body.style.overflow = 'hidden';
    overlay.hidden = false;
    // Reflow sonrası sınıf: geçiş tetiklenir
    void overlay.offsetWidth;
    overlay.classList.add('sv-acik');
    dugme.setAttribute('aria-expanded', 'true');
    disAlanlar.forEach((a) => a.setAttribute('aria-hidden', 'true'));

    const ilkOge = overlay.querySelector('nav a');
    if (azHareket.matches) {
      if (ilkOge) ilkOge.focus();
    } else {
      // Overlay girişi (~350ms) + öğe kademesi bittikten sonra sim
      setTimeout(() => { if (ilkOge) ilkOge.focus(); }, 380);
      setTimeout(() => {
        if (!overlay.classList.contains('sv-acik')) return;
        if (simDurum === 'yok') simYukle();
        else if (simDurum === 'hazir' && sim) { sim.ac(); canvas.classList.add('sv-canli'); }
      }, 820);
    }
  }

  function kapa() {
    overlay.classList.remove('sv-acik');
    disAlanlar.forEach((a) => a.removeAttribute('aria-hidden'));
    if (sim) { sim.kapa(); if (canvas) canvas.classList.remove('sv-canli'); }
    document.body.style.overflow = '';
    window.scrollTo(0, kilitScroll);
    const bitir = () => { overlay.hidden = true; };
    if (azHareket.matches) bitir();
    else setTimeout(bitir, 420);
    if (acan) { acan.setAttribute('aria-expanded', 'false'); acan.focus(); acan = null; }
  }

  aclar.forEach((d) => d.addEventListener('click', () => ac(d)));
  kapat.addEventListener('click', kapa);

  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { kapa(); return; }
    if (e.key !== 'Tab') return;
    const odak = odaklanabilir();
    const ilk = odak[0], son = odak[odak.length - 1];
    if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus(); }
    else if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus(); }
  });

  /* İmleç/parmak hareketi → ripple. Canvas pointer-events:none;
     koordinat overlay dinleyicisinden alınır, menü tap/scroll bozulmaz. */
  let sonHareket = 0;
  overlay.addEventListener('pointermove', (e) => {
    if (!sim || !sim.calisiyorMu()) return;
    const t = performance.now();
    if (t - sonHareket < 28) return; // ~35 damla/sn üst sınır
    sonHareket = t;
    sim.damla(e.clientX / overlay.clientWidth, e.clientY / overlay.clientHeight, 0.035);
  }, { passive: true });

  if (dokunmatik.matches) {
    overlay.addEventListener('touchmove', (e) => {
      if (!sim || !sim.calisiyorMu() || !e.touches[0]) return;
      const d = e.touches[0];
      sim.damla(d.clientX / overlay.clientWidth, d.clientY / overlay.clientHeight, 0.045);
    }, { passive: true });
  }

  /* Menü öğesi hover: o anda imleç konumuna ekstra damla (imleç-su-menü bağı) */
  overlay.querySelectorAll('nav a').forEach((a) => {
    a.addEventListener('pointerenter', (e) => {
      if (sim && sim.calisiyorMu()) {
        sim.damla(e.clientX / overlay.clientWidth, e.clientY / overlay.clientHeight, 0.09);
      }
    });
  });
}
