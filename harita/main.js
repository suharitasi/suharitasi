// Harita v4: Three.js 3D arazi. Modüler kurulum — güncellenecekler
// listesine eklenen her fonksiyon karede çağrılır (Faz 2 partikül
// sistemi buraya takılacak).
import * as THREE from 'three';
import { araziOlustur, abartmaUygula, AYAR } from './arazi.js';
import { kameraKur, paralaksKur } from './kamera.js';
import { atmosferKur } from './atmosfer.js';
import { gayzerKur } from './gayzer.js';
import { suKur } from './su.js';

atmosferKur();

const kap = document.getElementById('harita');
const mobil = matchMedia('(pointer: coarse)').matches || innerWidth < 768;

// WebGL yoksa (kapalı/engelli tarayıcı) sahne sessizce boş kalıyordu:
// statik atlas görseline düş
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
renderer.setClearColor(0x000000, 0); // şeffaf: sayfa zemini görünsün
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.32; // atlas renkleri canlı okunsun
kap.appendChild(renderer.domElement);

const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
const uZaman = { value: 0 };
const uIsikYon = { value: new THREE.Vector3(-9, 4.5, -5) };

const sahne = new THREE.Scene();
const rig = new THREE.Group(); // paralaks bu grubu salındırır
sahne.add(rig);

// Işık: kuzeybatıdan alçak açıyla — gölgeler derinlik versin; sert gölge yok
const gunes = new THREE.DirectionalLight(0xfff2dc, 2.6);
gunes.position.set(-9, 4.5, -5);
sahne.add(gunes);
sahne.add(new THREE.AmbientLight(0xdce9ed, 0.65));

// Güneş salınımı: ışık açısı dakikalar içinde hafifçe kayar
const GUNES_TABAN = gunes.position.clone();
function gunesSalinimi() {
  if (azHareket) return;
  const a = Math.sin(uZaman.value * 0.03) * 0.18; // ~±10°, periyot ~3.5 dk
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
kamera.userData.kap = kap; // raycast için piksel->NDC dönüşümünde kullanılır
const paralaks = paralaksKur(rig, mobil);

// Arazi üstünde süzülen hacimli bulut gölgeleri (fragment'ta 2-3 yumuşak leke)
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

// Faz 2+ için genişleme noktası
const guncellenecekler = [paralaks];

const yukleniyor = document.getElementById('yukleniyor');

// Giriş animasyonu: kamera uzaktan süzülerek kadraja oturur
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
  giris = { t: 0, sure: 2.6, basla, hedef };
}

araziOlustur(mobil).then((arazi) => {
  bulutGolgesi(arazi.material);
  rig.add(arazi);
  suKur(rig, arazi.material.map, uZaman, uIsikYon);
  guncellenecekler.push(gayzerKur(rig, kamera, arazi, mobil));
  girisBaslat();
  yukleniyor.classList.add('bitti');
});
setTimeout(() => yukleniyor.classList.add('bitti'), 8000);

addEventListener('resize', () => {
  kamera.aspect = kap.clientWidth / kap.clientHeight;
  renderer.setSize(kap.clientWidth, kap.clientHeight);
  // Kadrajı yeni en-boy oranına oturt (yön değişiminde kompozisyon korunur)
  if (!giris) kamera.position.copy(kadrajOtur());
  else kamera.updateProjectionMatrix();
});

// FPS ölçümü
let kare = 0;
let fpsZaman = performance.now();
const saat = new THREE.Clock();

let fpsKalan = 5; // konsolu kirletme: ilk 5 örnek yeter

renderer.setAnimationLoop(() => {
  const dt = Math.min(saat.getDelta(), 0.05);
  if (!azHareket) uZaman.value += dt; // su/bulut/güneş animasyon saati
  gunesSalinimi();

  if (giris) {
    giris.t += dt;
    const k = Math.min(1, giris.t / giris.sure);
    const e = 1 - Math.pow(1 - k, 3); // ease-out cubic
    kamera.position.lerpVectors(giris.basla, giris.hedef, e);
    if (k >= 1) {
      giris = null;
      kontrol.enabled = true;
    }
  }

  kontrol.update();
  for (const g of guncellenecekler) g(dt);
  renderer.render(sahne, kamera);

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

// Konsoldan ayar: abartmaAyarla(2.5)
window.abartmaAyarla = abartmaUygula;
window.sahneAyar = AYAR;
