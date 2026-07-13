// Kamera: sabit kompozisyon + sınırlı orbit + hafif imleç paralaksı.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const DERECE = Math.PI / 180;

// HEDEF.png açısı: alçak sinematik (~34° pitch), güneybatıdan hafif çapraz
export const BAKIS_YON = new THREE.Vector3(-0.17, 0.56, 0.81).normalize();
export const EV_HEDEF = new THREE.Vector3(0.2, 0, -0.5);
const TABAN_MESAFE = 13.6; // tüm ülke + çevre denizler kadrajda

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
    const portre = kamera.aspect < 0.9;
    if (portre) {
      fov = 50;
      const yatayTan = Math.tan((fov * DERECE) / 2) * kamera.aspect;
      mesafe = Math.max(TABAN_MESAFE, 8.8 / yatayTan);
    }
    kamera.fov = fov;
    kamera.updateProjectionMatrix();
    // Portrede odak güneye kayar: kütle ekranda ortalanır
    kontrol.target.copy(EV_HEDEF);
    if (portre) kontrol.target.z = 2.6;
    return BAKIS_YON.clone().multiplyScalar(mesafe).add(kontrol.target);
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
