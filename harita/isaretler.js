// Su noktaları — iki katman işaret:
// (a) SU BULUNAN: göller/barajlar — dolgun akuamarin ışıma
// (b) SU BULUNABİLECEK: temsili karst/havza noktaları — soluk, nabız gibi
//     (Aşama 1 kazısında gerçek veriyle değişecek; KAYNAKLAR.md'de not)
// Hover'da nokta büyür + krem lejant dilinde ad etiketi; tıklamada göllere dalış.
import * as THREE from 'three';
import goller from '../src/data/tr-goller.json';
import { lonLatKonum } from './arazi.js';

const ESIK = 0.55;

// Temsili "su bulunabilecek" alanlar (karst/kapalı havza) — YER TUTUCU
const POTANSIYEL = [
  { ad: 'Taşeli karst platosu', lon: 32.9, lat: 36.8 },
  { ad: 'Kırkgöz kaynakları', lon: 30.6, lat: 37.1 },
  { ad: 'Konya kapalı havzası', lon: 32.6, lat: 37.9 },
  { ad: 'Gökova karstı', lon: 28.4, lat: 37.05 },
  { ad: 'Harran ovası', lon: 39.0, lat: 36.9 },
  { ad: 'Develi kapalı havzası', lon: 35.4, lat: 38.4 },
  { ad: 'Ergene havzası', lon: 27.5, lat: 41.2 },
  { ad: 'Bafra ovası', lon: 35.9, lat: 41.5 },
  { ad: 'Iğdır ovası', lon: 44.0, lat: 39.9 },
];

function merkez(f) {
  const g = f.geometry;
  const halka = g.type === 'Polygon' ? g.coordinates[0] : g.coordinates[0][0];
  let sx = 0;
  let sy = 0;
  for (const p of halka) { sx += p[0]; sy += p[1]; }
  return [sx / halka.length, sy / halka.length];
}

function isiltiDokusu() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(220, 250, 252, 0.95)');
  g.addColorStop(0.35, 'rgba(79, 195, 208, 0.55)');
  g.addColorStop(1, 'rgba(79, 195, 208, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function isaretlerKur(rig, kamera, arazi, mobil, dal) {
  const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doku = isiltiDokusu();

  function spriteYap(renk, opaklik, olcek) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: doku,
      color: renk,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: opaklik,
    }));
    s.scale.set(olcek, olcek, 1);
    return s;
  }

  const noktalar = [];

  // (a) su bulunan — dolgun
  for (const f of goller.features) {
    if (!f.properties.ad) continue;
    const [lon, lat] = merkez(f);
    const poz = lonLatKonum(lon, lat);
    const s = spriteYap('#E8FEFF', 1, 0.34);
    s.position.copy(poz).y += 0.04;
    rig.add(s);
    noktalar.push({ ad: f.properties.ad, poz, sprite: s, tabanOlcek: 0.34, tabanOpaklik: 1, tur: 'var' });
  }

  // (b) su bulunabilecek — soluk, nabızlı
  for (const p of POTANSIYEL) {
    const poz = lonLatKonum(p.lon, p.lat);
    const s = spriteYap('#9FE2E8', 0.45, 0.24);
    s.position.copy(poz).y += 0.04;
    rig.add(s);
    noktalar.push({ ad: p.ad, poz, sprite: s, tabanOlcek: 0.24, tabanOpaklik: 0.45, tur: 'potansiyel' });
  }

  // Etiket: krem lejant dili (DOM)
  const etiket = document.createElement('div');
  etiket.className = 'etiket';
  document.querySelector('.cerceve').appendChild(etiket);

  let aktif = null;

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  function noktaBul(clientX, clientY) {
    const r = kamera.userData.kap.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, kamera);
    const kesisim = raycaster.intersectObject(arazi, false);
    if (!kesisim.length) return null;
    const p = kesisim[0].point;
    let enYakin = null;
    let enKisa = ESIK;
    for (const n of noktalar) {
      const d = Math.hypot(n.poz.x - p.x, n.poz.z - p.z);
      if (d < enKisa) { enKisa = d; enYakin = n; }
    }
    return enYakin;
  }

  function hedefle(n) {
    if (aktif === n) return;
    aktif = n;
    if (n) {
      etiket.textContent = n.ad;
      etiket.classList.add('acik');
    } else {
      etiket.classList.remove('acik');
    }
  }

  if (!mobil) {
    addEventListener('pointermove', (e) => {
      const n = noktaBul(e.clientX, e.clientY);
      hedefle(n);
      document.body.style.cursor = n ? 'pointer' : '';
    }, { passive: true });
  }
  addEventListener('click', (e) => {
    const n = noktaBul(e.clientX, e.clientY);
    hedefle(n);
    if (dal) dal(n && n.tur === 'var' ? n : null); // dalış yalnız mevcut suya
  });

  // Konsoldan / testten erişim
  window.suNoktalari = { noktalar, hedefle };

  const v = new THREE.Vector3();
  let t = 0;

  return function guncelle(dt) {
    t += dt;
    for (let i = 0; i < noktalar.length; i++) {
      const n = noktalar[i];
      let olcek = n.tabanOlcek;
      let opaklik = n.tabanOpaklik;
      if (!azHareket && n.tur === 'potansiyel') {
        const nabiz = 0.5 + 0.5 * Math.sin(t * 1.6 + i * 1.3);
        opaklik = 0.22 + 0.42 * nabiz;
        olcek *= 0.88 + 0.24 * nabiz;
      }
      if (n === aktif) {
        olcek *= 1.55;
        opaklik = Math.min(1, opaklik + 0.3);
      }
      n.sprite.scale.x += (olcek - n.sprite.scale.x) * Math.min(1, dt * 8);
      n.sprite.scale.y = n.sprite.scale.x;
      n.sprite.material.opacity += (opaklik - n.sprite.material.opacity) * Math.min(1, dt * 8);
    }

    // Etiket aktif noktanın ekran izdüşümünü izler
    if (aktif) {
      v.copy(aktif.poz).y += 0.06;
      v.project(kamera);
      const r = kamera.userData.kap.getBoundingClientRect();
      etiket.style.left = `${(v.x * 0.5 + 0.5) * r.width}px`;
      etiket.style.top = `${(-v.y * 0.5 + 0.5) * r.height}px`;
    }
  };
}
