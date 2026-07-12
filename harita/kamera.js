// Kamera: sabit kompozisyon + sınırlı orbit + hafif imleç paralaksı.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const DERECE = Math.PI / 180;

// Kahraman açısı: ~50° pitch + hafif yaw; kamera SABİT (orbit yok)
export const BAKIS_YON = new THREE.Vector3(-0.089, 0.766, 0.637).normalize();
export const EV_HEDEF = new THREE.Vector3(0, 0, -0.4); // kadraj odağı
const TABAN_MESAFE = 15.6; // kütlenin etrafında nefes payı

export function kameraKur(renderer, enBoy) {
  const kamera = new THREE.PerspectiveCamera(45, enBoy, 0.1, 200);

  // Kamera sabit: orbit/drag/zoom tamamen kapalı; OrbitControls yalnızca
  // hedefe bakışı yönetmek için duruyor
  const kontrol = new OrbitControls(kamera, renderer.domElement);
  kontrol.target.copy(EV_HEDEF);
  kontrol.enableRotate = false;
  kontrol.enableZoom = false;
  kontrol.enablePan = false;

  // Kadraj: yatayda 20 birimlik plaka sığar; portrede fov + mesafe uyarlanır
  function kadrajOtur() {
    let fov = 45;
    let mesafe = TABAN_MESAFE;
    if (kamera.aspect < 0.9) {
      fov = 50;
      const yatayTan = Math.tan((fov * DERECE) / 2) * kamera.aspect;
      mesafe = Math.max(TABAN_MESAFE, (10 * 1.06) / yatayTan);
    }
    kamera.fov = fov;
    kamera.updateProjectionMatrix();
    return BAKIS_YON.clone().multiplyScalar(mesafe).add(EV_HEDEF);
  }

  kamera.position.copy(kadrajOtur());
  kontrol.update();

  return { kamera, kontrol, kadrajOtur };
}

// Kamera nefesi: çok yavaş idle drift + imleç paralaksı üstüne biner
export function paralaksKur(rig, mobil) {
  const hedef = { x: 0, y: 0 };
  const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doz = mobil ? 0.5 : 1;
  let t = 0;

  if (!azHareket) {
    addEventListener('pointermove', (e) => {
      hedef.y = (e.clientX / innerWidth - 0.5) * 2 * (1.0 * DERECE);
      hedef.x = (e.clientY / innerHeight - 0.5) * 2 * (0.7 * DERECE);
    }, { passive: true });
  }

  return function guncelle(dt) {
    let dY = 0;
    let dX = 0;
    if (!azHareket) {
      t += dt;
      // idle nefes: fark edilir-edilmez
      dY = Math.sin(t * 0.06) * 0.012 * doz;
      dX = Math.cos(t * 0.043) * 0.007 * doz;
    }
    rig.rotation.y += (hedef.y + dY - rig.rotation.y) * 0.04;
    rig.rotation.x += (hedef.x + dX - rig.rotation.x) * 0.04;
  };
}
