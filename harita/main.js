// Harita v4: Three.js 3D arazi. Modüler kurulum — güncellenecekler
// listesine eklenen her fonksiyon karede çağrılır (Faz 2 partikül
// sistemi buraya takılacak).
import * as THREE from 'three';
import { araziOlustur, abartmaUygula, AYAR } from './arazi.js';
import { kameraKur, paralaksKur } from './kamera.js';
import { atmosferKur } from './atmosfer.js';

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
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(kap.clientWidth, kap.clientHeight);
renderer.setClearColor(0x000000, 0); // şeffaf: sayfa zemini görünsün
kap.appendChild(renderer.domElement);

const sahne = new THREE.Scene();
const rig = new THREE.Group(); // paralaks bu grubu salındırır
sahne.add(rig);

// Işık: yumuşak, kuzeybatıdan (atlas gölgeleriyle uyumlu), sert gölge yok
const gunes = new THREE.DirectionalLight(0xfff4e0, 1.7);
gunes.position.set(-7, 9, -6);
sahne.add(gunes);
sahne.add(new THREE.AmbientLight(0xdce9ed, 0.75));

const { kamera, kontrol } = kameraKur(renderer, kap.clientWidth / kap.clientHeight);
const paralaks = paralaksKur(rig);

// Faz 2+ için genişleme noktası
const guncellenecekler = [paralaks];

const yukleniyor = document.getElementById('yukleniyor');

araziOlustur(mobil).then((arazi) => {
  rig.add(arazi);
  yukleniyor.classList.add('bitti');
});
setTimeout(() => yukleniyor.classList.add('bitti'), 8000);

addEventListener('resize', () => {
  kamera.aspect = kap.clientWidth / kap.clientHeight;
  kamera.updateProjectionMatrix();
  renderer.setSize(kap.clientWidth, kap.clientHeight);
});

// FPS ölçümü
let kare = 0;
let fpsZaman = performance.now();

renderer.setAnimationLoop(() => {
  kontrol.update();
  for (const g of guncellenecekler) g();
  renderer.render(sahne, kamera);

  kare++;
  const simdi = performance.now();
  if (simdi - fpsZaman >= 2000) {
    console.log(`FPS: ${Math.round((kare * 1000) / (simdi - fpsZaman))}`);
    kare = 0;
    fpsZaman = simdi;
  }
});

// Konsoldan ayar: abartmaAyarla(2.5)
window.abartmaAyarla = abartmaUygula;
window.sahneAyar = AYAR;
