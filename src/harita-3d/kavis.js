// HEDEF.png gayzerleri: denizden yükselip kıvrılan ince, cam gibi su
// kavisleri. Gerçek zamanlı yorum: parabolik tüp (yarı saydam) + üstünde
// ince parlak damar + tepe/iniş noktalarında köpük partikülleri.
import * as THREE from 'three';

function kavisEgrisi(yukseklik, genislik) {
  const noktalar = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    noktalar.push(new THREE.Vector3(
      t * genislik,
      yukseklik * 4 * t * (1 - t), // parabol
      Math.sin(t * Math.PI) * genislik * 0.12,
    ));
  }
  return new THREE.CatmullRomCurve3(noktalar);
}

export function kavisKur(rig, mobil, konumlar) {
  const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const grup = new THREE.Group();
  rig.add(grup);

  const govdeMalzeme = new THREE.MeshPhysicalMaterial({
    color: '#C7E4DD',
    transparent: true,
    opacity: 0.2, // cam hissi: bedeni silik, damarı ince parlak
    roughness: 0.15,
    metalness: 0,
    depthWrite: false,
  });
  const damarMalzeme = new THREE.MeshBasicMaterial({
    color: '#EAFBF6',
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const kavisler = konumlar.map((k, i) => {
    const egri = kavisEgrisi(k.boy, k.gen);
    const govde = new THREE.Mesh(
      new THREE.TubeGeometry(egri, 32, k.kalinlik, 8, false),
      govdeMalzeme,
    );
    const damar = new THREE.Mesh(
      new THREE.TubeGeometry(egri, 32, k.kalinlik * 0.35, 6, false),
      damarMalzeme,
    );
    const tek = new THREE.Group();
    tek.add(govde, damar);
    tek.position.set(k.x, k.y, k.z);
    tek.rotation.y = k.don;
    grup.add(tek);
    return { tek, faz: i * 1.9, hiz: 0.4 + i * 0.13 };
  });

  let t = 0;
  return function guncelle(dt) {
    if (azHareket) return;
    t += dt;
    for (const k of kavisler) {
      // cam kavis nefes alır: hafif salınım + ölçek soluması
      k.tek.rotation.z = Math.sin(t * k.hiz + k.faz) * 0.05;
      const s = 1 + Math.sin(t * k.hiz * 1.7 + k.faz) * 0.06;
      k.tek.scale.set(1, s, 1);
    }
  };
}
