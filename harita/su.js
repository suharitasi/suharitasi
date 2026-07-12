// Canlı su: deniz + göller. Vertex dalgalanma bu ölçekte kıyıları basacağı
// için dalgalar fragment'ta animasyonlu normal olarak üretilir (GPU-dostu):
// güneş parıltısı + kıyıya doğru renk geçişi. Deniz maskesi atlas
// dokusundaki düz deniz renginden (#A9C3B4) piksel hassasiyetinde çıkarılır.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import goller from '../src/data/tr-goller.json';
import { PLAN_GEN, PLAN_DER, lonLatKonum } from './arazi.js';

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
  uniform sampler2D uAtlas;
  uniform sampler2D uAtlasBulanik;
  uniform float uZaman;
  uniform vec3 uIsikYon;
  uniform float uMaskKullan; // 1: deniz (atlas maskesi + kenar solması), 0: göl
  varying vec2 vUv;
  varying vec3 vDunya;

  // sRGB dokular shader'da LINEAR okunur; referans da linear uzayda
  const vec3 DENIZ_REF = vec3(0.404, 0.549, 0.456); // #A9C3B4 linear
  const vec3 DERIN = vec3(0.086, 0.243, 0.278);     // açık deniz
  const vec3 KIYI  = vec3(0.259, 0.427, 0.408);     // kıyı sığlığı

  void main() {
    float suMask = 1.0;
    float karaYakin = 0.35;
    if (uMaskKullan > 0.5) {
      vec3 keskin = texture2D(uAtlas, vUv).rgb;
      suMask = 1.0 - smoothstep(0.03, 0.08, distance(keskin, DENIZ_REF));
      if (suMask < 0.02) discard;
      vec3 bulanik = texture2D(uAtlasBulanik, vUv).rgb;
      karaYakin = clamp(distance(bulanik, DENIZ_REF) * 2.2, 0.0, 0.85);
    }

    // Animasyonlu dalga normalleri (üç yönlü sinüs karışımı)
    vec2 p = vDunya.xz * 7.0;
    float t = uZaman;
    float nx = sin(p.x * 1.35 + t * 0.55) * 0.5
             + sin(p.x * 0.62 + p.y * 0.74 - t * 0.38) * 0.5;
    float nz = sin(p.y * 1.18 - t * 0.47) * 0.5
             + sin((p.x + p.y) * 0.81 + t * 0.62) * 0.5;
    vec3 N = normalize(vec3(nx * 0.05, 1.0, nz * 0.05));

    vec3 L = normalize(uIsikYon);
    vec3 V = normalize(cameraPosition - vDunya);
    vec3 H = normalize(L + V);
    float parilti = pow(max(dot(N, H), 0.0), 110.0) * 0.6; // güneş parıltısı
    float sacilim = pow(max(dot(N, H), 0.0), 8.0) * 0.05;
    float dif = 0.90 + 0.10 * max(dot(N, L), 0.0);

    vec3 renk = mix(DERIN, KIYI, karaYakin) * dif
              + (parilti + sacilim) * vec3(1.0, 0.98, 0.92);

    float alfa = suMask;
    if (uMaskKullan > 0.5) {
      // plaka kenarında karanlık suya çözünme
      float kx = smoothstep(0.0, 0.055, min(vUv.x, 1.0 - vUv.x));
      float ky = smoothstep(0.0, 0.055, min(vUv.y, 1.0 - vUv.y));
      alfa *= kx * ky;
    }
    gl_FragColor = vec4(renk, alfa);
  }
`;

function bulanikAtlas(atlasDoku) {
  const c = document.createElement('canvas');
  c.width = 96;
  c.height = 48;
  const ctx = c.getContext('2d');
  ctx.filter = 'blur(2px)';
  ctx.drawImage(atlasDoku.image, 0, 0, 96, 48);
  const d = new THREE.CanvasTexture(c);
  d.colorSpace = THREE.SRGBColorSpace;
  return d;
}

function malzemeYap(uniforms, maskKullan) {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      ...uniforms,
      uMaskKullan: { value: maskKullan },
    },
    transparent: true,
    depthWrite: false,
  });
}

export function suKur(rig, atlasDoku, uZaman, uIsikYon) {
  const ortak = {
    uAtlas: { value: atlasDoku },
    uAtlasBulanik: { value: bulanikAtlas(atlasDoku) },
    uZaman,
    uIsikYon,
  };

  // Deniz: tüm plakayı kaplar, atlas maskesiyle sadece deniz piksellerinde
  const deniz = new THREE.Mesh(
    new THREE.PlaneGeometry(PLAN_GEN, PLAN_DER, 1, 1).rotateX(-Math.PI / 2),
    malzemeYap(ortak, 1),
  );
  deniz.position.y = 0.004;
  deniz.renderOrder = 1;
  rig.add(deniz);

  // Göller: geojson halkalarından yüzey seviyesinde parlayan yüzeyler.
  // Tek mesh'te birleştirilir (draw call tasarrufu).
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
