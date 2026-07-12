// Faz 2: su noktalarında gayzer — hover'da yerden yükselen ışıltılı su
// sütunu. Ses yok, abartısız; additive noktalar + tabanda yumuşak ışıma.
// Su tonu atlas diline uygun (#5E8A87 -> beyaza), akuamarin değil.
import * as THREE from 'three';
import goller from '../src/data/tr-goller.json';
import { lonLatKonum } from './arazi.js';

const SU_DIP = new THREE.Color('#5E8A87');
const SU_UC = new THREE.Color('#EAF6F3');
const ESIK = 0.55; // su noktası yakalama yarıçapı (dünya birimi)

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
  g.addColorStop(0, 'rgba(234, 246, 243, 0.9)');
  g.addColorStop(0.4, 'rgba(126, 178, 173, 0.35)');
  g.addColorStop(1, 'rgba(126, 178, 173, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function gayzerKur(rig, kamera, arazi, mobil) {
  const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const noktalar = goller.features
    .filter((f) => f.properties.ad)
    .map((f) => {
      const [lon, lat] = merkez(f);
      return { ad: f.properties.ad, poz: lonLatKonum(lon, lat) };
    });

  // --- Partikül havuzu (tek geometri, tek aktif sütun) ---
  const MAX = mobil ? 160 : 320;
  const geo = new THREE.BufferGeometry();
  const pozlar = new Float32Array(MAX * 3);
  const renkler = new Float32Array(MAX * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pozlar, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(renkler, 3));
  const puanlar = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.065,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  }));
  puanlar.frustumCulled = false;
  puanlar.visible = false;
  rig.add(puanlar);

  // Tabanda yumuşak ışıma (reduced-motion'da tek başına gösterge)
  const isilti = new THREE.Sprite(new THREE.SpriteMaterial({
    map: isiltiDokusu(),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0,
  }));
  isilti.scale.set(0.9, 0.45, 1);
  rig.add(isilti);

  const parcacik = Array.from({ length: MAX }, () => ({
    yas: 0, omur: 0, hiz: new THREE.Vector3(), canli: false,
  }));

  let aktif = null; // nokta
  let acilma = 0;   // 0-1 yumuşak aç/kapa

  function hedefle(nokta) {
    if (aktif === nokta) return;
    aktif = nokta;
    if (nokta) {
      isilti.position.copy(nokta.poz).y += 0.02;
      puanlar.visible = !azHareket;
    }
  }

  // --- İşaretçi: hover (masaüstü) + dokunma (mobil) ---
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 0;
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

  if (!mobil) {
    addEventListener('pointermove', (e) => hedefle(noktaBul(e.clientX, e.clientY)), { passive: true });
  }
  addEventListener('click', (e) => {
    const n = noktaBul(e.clientX, e.clientY);
    hedefle(aktif && n === aktif ? null : n); // ikinci dokunuş söndürür
  });

  function dogur(p) {
    p.canli = true;
    p.yas = 0;
    p.omur = 1.1 + Math.random() * 0.6;
    const aci = Math.random() * Math.PI * 2;
    const sac = 0.04 + Math.random() * 0.12; // radyal saçılma
    p.hiz.set(Math.cos(aci) * sac, 1.35 + Math.random() * 0.55, Math.sin(aci) * sac);
    const i = parcacik.indexOf(p) * 3;
    pozlar[i] = aktifPoz.x + (Math.random() - 0.5) * 0.05;
    pozlar[i + 1] = aktifPoz.y;
    pozlar[i + 2] = aktifPoz.z + (Math.random() - 0.5) * 0.05;
  }

  const aktifPoz = new THREE.Vector3();
  const G = 2.1; // yumuşak yerçekimi
  const renk = new THREE.Color();

  // Konsoldan / testten erişim
  window.gayzer = { noktalar, hedefle };

  return function guncelle(dt) {
    acilma += ((aktif ? 1 : 0) - acilma) * Math.min(1, dt * 3);
    isilti.material.opacity = acilma * (azHareket ? 0.55 : 0.48);

    if (azHareket) return; // statik ışıma yeterli
    if (!puanlar.visible && acilma < 0.02) return;

    if (aktif) aktifPoz.copy(aktif.poz);

    let canliSayisi = 0;
    for (let j = 0; j < MAX; j++) {
      const p = parcacik[j];
      const i = j * 3;
      if (p.canli) {
        p.yas += dt;
        if (p.yas >= p.omur) {
          p.canli = false;
          renkler[i] = renkler[i + 1] = renkler[i + 2] = 0;
          continue;
        }
        p.hiz.y -= G * dt;
        pozlar[i] += p.hiz.x * dt;
        pozlar[i + 1] += p.hiz.y * dt;
        pozlar[i + 2] += p.hiz.z * dt;
        const n = p.yas / p.omur;
        const parlaklik = Math.sin(Math.PI * n) * acilma;
        renk.lerpColors(SU_DIP, SU_UC, Math.min(1, (pozlar[i + 1] - aktifPoz.y) / 0.9));
        renkler[i] = renk.r * parlaklik;
        renkler[i + 1] = renk.g * parlaklik;
        renkler[i + 2] = renk.b * parlaklik;
        canliSayisi++;
      } else if (aktif && acilma > 0.05 && Math.random() < acilma * 0.12) {
        dogur(p);
      }
    }
    if (!aktif && canliSayisi === 0) puanlar.visible = false;

    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  };
}
