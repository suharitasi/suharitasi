// Canlı su: deniz + göller. Deniz artık blok altında her yere uzanan ayrı
// alçak yüzey; kara bloğu (KALDIRMA) denizden belirgin yükseklikte durur.
// Dalgalar fragment'ta animasyonlu normal (GPU-dostu), güneş parıltısı,
// kıyıya doğru renk geçişi (bulanık sınır maskesinden).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import goller from '../src/data/tr-goller.json';
import { PLAN_GEN, PLAN_DER, lonLatKonum } from './arazi.js';

const DENIZ_GEN = 100;
const DENIZ_DER = 60;

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

  // Hedef ekran renkleri (composer linear->sRGB çevirir; değerler linear):
  // kıyı #A9C3B4 adaçayı, açık deniz bir ton derin adaçayı
  const vec3 DERIN = vec3(0.196, 0.331, 0.272);
  const vec3 KIYI  = vec3(0.404, 0.549, 0.456);

  void main() {
    float karaYakin = 0.35;
    if (uDeniz > 0.5) {
      // dünya konumundan plaka uv'si; plaka dışı derin okunur
      vec2 tuv = vec2(vDunya.x / ${PLAN_GEN.toFixed(1)} + 0.5,
                      vDunya.z / ${PLAN_DER.toFixed(1)} + 0.5);
      karaYakin = texture2D(uKiyi, clamp(tuv, 0.0, 1.0)).g * 0.9;
    }

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
    float parilti = pow(max(dot(N, H), 0.0), 110.0) * 0.45;
    float sacilim = pow(max(dot(N, H), 0.0), 8.0) * 0.035;
    float dif = 0.90 + 0.10 * max(dot(N, L), 0.0);

    vec3 renk = mix(DERIN, KIYI, karaYakin) * dif
              + (parilti + sacilim) * vec3(1.0, 0.98, 0.92);

    float alfa = 1.0;
    if (uDeniz > 0.5) {
      float kx = smoothstep(0.0, 0.06, min(vUv.x, 1.0 - vUv.x));
      float ky = smoothstep(0.0, 0.06, min(vUv.y, 1.0 - vUv.y));
      // uzak deniz ufukta koyu zemine çözünür (beyaz sis değil)
      float uzak = 1.0 - smoothstep(17.0, 28.0, distance(cameraPosition, vDunya));
      alfa = kx * ky * uzak;
    }
    gl_FragColor = vec4(renk, alfa);
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

  const deniz = new THREE.Mesh(
    new THREE.PlaneGeometry(DENIZ_GEN, DENIZ_DER, 1, 1).rotateX(-Math.PI / 2),
    malzemeYap(ortak, 1),
  );
  deniz.position.y = 0;
  deniz.renderOrder = 1;
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
