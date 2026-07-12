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

// Paralaks: sahne rig'i imlece doğru 1-2 derece salınır
export function paralaksKur(rig) {
  const hedef = { x: 0, y: 0 };
  const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!azHareket) {
    addEventListener('pointermove', (e) => {
      hedef.y = (e.clientX / innerWidth - 0.5) * 2 * (1.5 * DERECE);
      hedef.x = (e.clientY / innerHeight - 0.5) * 2 * (1.0 * DERECE);
    }, { passive: true });
  }

  return function guncelle() {
    rig.rotation.y += (hedef.y - rig.rotation.y) * 0.04;
    rig.rotation.x += (hedef.x - rig.rotation.x) * 0.04;
  };
}
