// Kamera: sabit kompozisyon + sınırlı orbit + hafif imleç paralaksı.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const DERECE = Math.PI / 180;

export function kameraKur(renderer, enBoy) {
  const kamera = new THREE.PerspectiveCamera(45, enBoy, 0.1, 200);
  // ~57° pitch, tepeden kuşbakışına yakın; güneyden bakış (kuzey yukarıda)
  kamera.position.set(0, 10.8, 7.0);

  const kontrol = new OrbitControls(kamera, renderer.domElement);
  kontrol.target.set(0, 0, -0.4);
  kontrol.enablePan = false;
  kontrol.enableDamping = true;
  kontrol.dampingFactor = 0.08;
  // pitch 40-70° -> polar (dikeyden) 20-50°
  kontrol.minPolarAngle = 20 * DERECE;
  kontrol.maxPolarAngle = 50 * DERECE;
  kontrol.minAzimuthAngle = -30 * DERECE;
  kontrol.maxAzimuthAngle = 30 * DERECE;
  // Türkiye kadrajından çıkılamaz
  kontrol.minDistance = 8;
  kontrol.maxDistance = 17;
  kontrol.update();

  return { kamera, kontrol };
}

// Kamera nefesi: çok yavaş idle drift + imleç paralaksı üstüne biner
export function paralaksKur(rig, mobil) {
  const hedef = { x: 0, y: 0 };
  const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doz = mobil ? 0.5 : 1;
  let t = 0;

  if (!azHareket) {
    addEventListener('pointermove', (e) => {
      hedef.y = (e.clientX / innerWidth - 0.5) * 2 * (1.5 * DERECE);
      hedef.x = (e.clientY / innerHeight - 0.5) * 2 * (1.0 * DERECE);
    }, { passive: true });
  }

  return function guncelle(dt) {
    let dY = 0;
    let dX = 0;
    if (!azHareket) {
      t += dt;
      dY = Math.sin(t * 0.06) * 0.020 * doz;
      dX = Math.cos(t * 0.043) * 0.011 * doz;
    }
    rig.rotation.y += (hedef.y + dY - rig.rotation.y) * 0.04;
    rig.rotation.x += (hedef.x + dX - rig.rotation.x) * 0.04;
  };
}
