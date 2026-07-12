// Harita v5 "nesne": Türkiye extrude blok + sinematik render.
// Modüler kurulum — guncellenecekler listesine eklenen her fonksiyon
// karede çağrılır.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { araziOlustur, abartmaUygula, AYAR } from './arazi.js';
import { kameraKur, paralaksKur, BAKIS_YON, EV_HEDEF } from './kamera.js';
import { atmosferKur } from './atmosfer.js';
import { kenarGayzerKur } from './gayzer.js';
import { isaretlerKur } from './isaretler.js';
import { suKur } from './su.js';
import { damlaKur } from './damla.js';

atmosferKur();

const kap = document.getElementById('harita');
const mobil = matchMedia('(pointer: coarse)').matches || innerWidth < 768;

function yedegeDus() {
  document.getElementById('yukleniyor').classList.add('bitti');
  document.getElementById('yedek').classList.add('acik');
}

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
} catch {
  yedegeDus();
  throw new Error('WebGL kullanılamıyor — statik atlas görünümüne geçildi');
}
renderer.setPixelRatio(Math.min(devicePixelRatio, mobil ? 1.5 : 2));
renderer.setSize(kap.clientWidth, kap.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35; // atlas ACES altında da doygun kalsın
kap.appendChild(renderer.domElement);

const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
const uZaman = { value: 0 };
const uIsikYon = { value: new THREE.Vector3(-9, 4.5, -5) };

const sahne = new THREE.Scene();
const rig = new THREE.Group();
sahne.add(rig);

// Zemin: sayfanın derin-su degradesi sahne içinde (bloom şeffaf arka planla
// uyumsuz olduğundan degrade tam ekran quad olarak çizilir)
const zemin = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    depthWrite: false,
    depthTest: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }',
    // Hedef ekran renkleri #04121F -> #061A2E (composer linear->sRGB çevirdiğinden linear yazıldı)
    fragmentShader: 'varying vec2 vUv; void main(){ gl_FragColor = vec4(mix(vec3(0.0013,0.0068,0.0148), vec3(0.0021,0.0128,0.0271), vUv.y), 1.0); }',
  }),
);
zemin.frustumCulled = false;
zemin.renderOrder = -1;
sahne.add(zemin);

// Işık: kuzeybatıdan alçak açıyla; sert gölge yok
const gunes = new THREE.DirectionalLight(0xfff2dc, 2.6);
gunes.position.set(-9, 4.5, -5);
sahne.add(gunes);
sahne.add(new THREE.AmbientLight(0xdce9ed, 0.65));

const GUNES_TABAN = gunes.position.clone();
function gunesSalinimi() {
  if (azHareket) return;
  const a = Math.sin(uZaman.value * 0.03) * 0.18;
  const c = Math.cos(a);
  const s = Math.sin(a);
  gunes.position.set(
    GUNES_TABAN.x * c - GUNES_TABAN.z * s,
    GUNES_TABAN.y + Math.sin(uZaman.value * 0.021) * 0.9,
    GUNES_TABAN.x * s + GUNES_TABAN.z * c,
  );
  uIsikYon.value.copy(gunes.position);
}

const { kamera, kontrol, kadrajOtur } = kameraKur(renderer, kap.clientWidth / kap.clientHeight);
kamera.userData.kap = kap;
const paralaks = paralaksKur(rig, mobil);

// Sinematik: bloom + ACES
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(sahne, kamera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(kap.clientWidth, kap.clientHeight),
  mobil ? 0.4 : 0.55, // güç
  0.4,                // yarıçap
  0.8,                // eşik: yalnız ışıma noktaları/fıskiyeler
);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// Bulut gölgeleri: arazi malzemesine fragment enjeksiyonu
function bulutGolgesi(malzeme) {
  malzeme.onBeforeCompile = (shader) => {
    shader.uniforms.uZaman = uZaman;
    shader.defines = { ...shader.defines, BULUT: mobil ? 2 : 3 };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBulutDunya;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBulutDunya = (modelMatrix * vec4(position, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float uZaman;
        varying vec3 vBulutDunya;
        float bulutLeke(vec2 p, vec2 m, float r) {
          return smoothstep(r, r * 0.3, distance(p, m));
        }`)
      .replace('#include <map_fragment>', `#include <map_fragment>
        {
          float bt = uZaman;
          vec2 bq = vBulutDunya.xz;
          float bg = 0.0;
          bg += bulutLeke(bq, vec2(mod(bt * 0.10, 34.0) - 17.0, -1.8 + sin(bt * 0.05) * 0.8), 3.2);
          bg += bulutLeke(bq, vec2(mod(bt * 0.065 + 14.0, 34.0) - 17.0, 1.6 + cos(bt * 0.04)), 2.4);
          #if BULUT > 2
          bg += bulutLeke(bq, vec2(mod(bt * 0.045 + 25.0, 34.0) - 17.0, 0.2 + sin(bt * 0.033) * 1.4), 4.0);
          #endif
          diffuseColor.rgb *= 1.0 - min(bg, 1.0) * 0.14;
        }`);
  };
}

// Faz 2+ genişleme noktası
const guncellenecekler = [paralaks];

const yukleniyor = document.getElementById('yukleniyor');

// Kamera sabit (nihai sahne kurgusu): dalış koreografisi kaldırıldı,
// tek hareket idle nefes + paralaks + giriş animasyonu.

// Sayfa alt kenarı/köşeleri için ekran->dünya yerleşimi (sabit kadraja göre)
function ekranZemin(ndcX, ndcY, hedefPoz, y) {
  const k = kamera.clone();
  k.position.copy(hedefPoz);
  k.lookAt(EV_HEDEF);
  k.updateMatrixWorld();
  const rc = new THREE.Raycaster();
  rc.setFromCamera(new THREE.Vector2(ndcX, ndcY), k);
  const t = (y - rc.ray.origin.y) / rc.ray.direction.y;
  return rc.ray.origin.clone().add(rc.ray.direction.clone().multiplyScalar(t));
}

// Giriş animasyonu
let giris = null;
function girisBaslat() {
  const hedef = kadrajOtur();
  if (azHareket) {
    kamera.position.copy(hedef);
    return;
  }
  const basla = kontrol.target.clone()
    .add(hedef.clone().sub(kontrol.target).multiplyScalar(1.85))
    .add(new THREE.Vector3(-2.4, 1.6, 0));
  kamera.position.copy(basla);
  kontrol.enabled = false;
  giris = { baslangic: performance.now(), sure: 2.6, basla, hedef };
}

araziOlustur(mobil).then(({ grup, ust }) => {
  bulutGolgesi(ust.material);
  rig.add(grup);
  suKur(rig, ust.material.alphaMap, uZaman, uIsikYon);
  guncellenecekler.push(isaretlerKur(rig, kamera, ust, mobil));

  // Kenar gayzerleri: sayfanın alt kenarına ekran-uzayından yerleştirilir
  const kadrajPoz = kadrajOtur();
  const ndcListe = mobil
    ? [[-0.6, -0.9], [0.05, -0.97], [0.65, -0.9]]
    : [[-0.8, -0.85], [-0.35, -0.97], [0.3, -0.93], [0.82, -0.86]];
  const emitorlar = ndcListe.map(([x, y]) => ekranZemin(x, y, kadrajPoz, -0.55));
  guncellenecekler.push(kenarGayzerKur(rig, mobil, emitorlar));
  guncellenecekler.push(damlaKur(rig, mobil));

  girisBaslat();
  yukleniyor.classList.add('bitti');
});
setTimeout(() => yukleniyor.classList.add('bitti'), 8000);

addEventListener('resize', () => {
  kamera.aspect = kap.clientWidth / kap.clientHeight;
  renderer.setSize(kap.clientWidth, kap.clientHeight);
  composer.setSize(kap.clientWidth, kap.clientHeight);
  if (!giris) kamera.position.copy(kadrajOtur());
  else kamera.updateProjectionMatrix();
});

let kare = 0;
let fpsZaman = performance.now();
let fpsKalan = 5;
let sonZaman = performance.now();

renderer.setAnimationLoop(() => {
  const simdiMs = performance.now();
  const dt = Math.min((simdiMs - sonZaman) / 1000, 0.05);
  sonZaman = simdiMs;

  if (!azHareket) uZaman.value += dt;
  gunesSalinimi();

  if (giris) {
    const k = Math.min(1, (performance.now() - giris.baslangic) / 1000 / giris.sure);
    const e = 1 - Math.pow(1 - k, 3);
    kamera.position.lerpVectors(giris.basla, giris.hedef, e);
    if (k >= 1) giris = null;
  }
  kamera.lookAt(kontrol.target); // kamera sabit: kontrol girdisi kapalı

  for (const g of guncellenecekler) g(dt);
  composer.render();

  kare++;
  const simdi = performance.now();
  if (simdi - fpsZaman >= 2000) {
    if (fpsKalan > 0) {
      fpsKalan--;
      console.log(`FPS: ${Math.round((kare * 1000) / (simdi - fpsZaman))}`);
    }
    kare = 0;
    fpsZaman = simdi;
  }
});

// Konsoldan ayar
window.abartmaAyarla = abartmaUygula;
window.sahneAyar = AYAR;
window.kamera3d = kamera;
window.rig3d = rig;
