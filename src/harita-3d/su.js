// Su (HEDEF.png dili): mat, gri-yeşil, hafif kırışık su zemini — parlama
// abartısız; Akdeniz tarafı derin teal. Göller blok üstünde soluk yüzeyler.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import goller from '../src/data/tr-goller.json';
import { lonLatKonum } from './arazi.js';

const VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vDunya;
  void main() {
    vUv = uv;
    vec4 d = modelMatrix * vec4(position, 1.0);
    vDunya = d.xyz;
    gl_Position = projectionMatrix * viewMatrix * d;
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uKiyi; // bulanık Türkiye maskesi (kıyı yakınlığı)
  uniform float uZaman;
  uniform vec3 uIsikYon;
  uniform float uDeniz; // 1: deniz (kıyı geçişi + kenar solması), 0: göl
  varying vec2 vUv;
  varying vec3 vDunya;

  // Ekran hedefleri (linear yazıldı): gri-yeşil mat su, güneyde derin teal
  const vec3 GRIYESIL = vec3(0.278, 0.360, 0.298); // gri-yeşil, doygun
  const vec3 DERINTEAL = vec3(0.012, 0.072, 0.081); // ~#1E4C50
  const vec3 UZAK = vec3(0.355, 0.425, 0.345);      // ufka doğru hafif açılma

  void main() {
    // Akdeniz/güney: derin teal; kuzey/ege: açık gri-yeşil
    float guney = smoothstep(1.2, 5.5, vDunya.z) * (1.0 - smoothstep(9.0, 12.0, vDunya.x));
    vec3 taban = mix(GRIYESIL, DERINTEAL, guney * 0.9);

    // İnce dalga kırışıkları — mat yüzey, abartısız parlama
    vec2 p = vDunya.xz * 11.0;
    float t = uZaman;
    float nx = sin(p.x * 1.35 + t * 0.4) * 0.5
             + sin(p.x * 0.57 + p.y * 0.83 - t * 0.3) * 0.5;
    float nz = sin(p.y * 1.22 - t * 0.35) * 0.5
             + sin((p.x + p.y) * 0.74 + t * 0.45) * 0.5;
    vec3 N = normalize(vec3(nx * 0.09, 1.0, nz * 0.09));

    vec3 L = normalize(uIsikYon);
    vec3 V = normalize(cameraPosition - vDunya);
    vec3 H = normalize(L + V);
    float parilti = pow(max(dot(N, H), 0.0), 90.0) * 0.10;
    float dif = 0.86 + 0.14 * max(dot(N, L), 0.0);

    vec3 renk = taban * dif + parilti * vec3(1.0, 0.95, 0.85);
    // uzak su hafif açılır (hava perspektifi)
    renk = mix(renk, UZAK, smoothstep(17.0, 30.0, distance(cameraPosition, vDunya)));

    gl_FragColor = vec4(renk, 1.0);
  }
`;

// Maske görüntüsünü küçük tuvale bulanık indirger (kıyı yakınlık alanı)
function kiyiAlani(maskeDoku) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.filter = 'blur(3px)';
  ctx.drawImage(maskeDoku.image, 0, 0, 128, 64);
  return new THREE.CanvasTexture(c);
}

function malzemeYap(uniforms, deniz) {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: { ...uniforms, uDeniz: { value: deniz } },
    transparent: true,
    depthWrite: false,
  });
}

export function suKur(rig, maskeDoku, uZaman, uIsikYon) {
  const ortak = {
    uKiyi: { value: kiyiAlani(maskeDoku) },
    uZaman,
    uIsikYon,
  };

  // Su zemini: sahnenin tamamını kaplayan mat yüzey
  const deniz = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 60, 1, 1).rotateX(-Math.PI / 2),
    malzemeYap(ortak, 1),
  );
  deniz.position.y = 0;
  rig.add(deniz);

  // Göller: blok üstünde, kendi rakımlarında parlayan yüzeyler (tek mesh)
  const golGeolar = [];
  for (const f of goller.features) {
    const g = f.geometry;
    const halkalar = g.type === 'Polygon' ? [g.coordinates[0]] : g.coordinates.map((p) => p[0]);
    for (const halka of halkalar) {
      const sekil = new THREE.Shape();
      let tabanY = Infinity;
      halka.forEach((p, i) => {
        const k = lonLatKonum(p[0], p[1]);
        tabanY = Math.min(tabanY, k.y);
        if (i === 0) sekil.moveTo(k.x, -k.z);
        else sekil.lineTo(k.x, -k.z);
      });
      const geo = new THREE.ShapeGeometry(sekil).rotateX(-Math.PI / 2);
      geo.translate(0, tabanY + 0.006, 0);
      golGeolar.push(geo);
    }
  }
  const golMesh = new THREE.Mesh(mergeGeometries(golGeolar), malzemeYap(ortak, 0));
  golMesh.renderOrder = 1;
  rig.add(golMesh);
}
