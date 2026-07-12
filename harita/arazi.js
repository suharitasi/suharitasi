// Arazi: Türkiye 3D NESNE — sınırla kesilmiş extrude blok.
// Üst yüzey: heightmap rölyefi + atlas dokusu, sınır maskesiyle kesilir.
// Yan yüzey: sınır halkalarından örülen kesit duvarı (koyu toprak, katman
// çizgileri). Alt: kapalı taban. His: denizden yükselen müze maketi.
import * as THREE from 'three';
import atlasUrl from '../src/assets/tr-atlas.webp';
import maskeUrl from '../src/assets/tr-maske.png';
import yukseklikBinUrl from '../src/assets/tr-yukseklik.bin?url';
import meta from '../src/assets/tr-yukseklik.json';
import sinir from '../src/data/tr-sinir.json';

// Sahne ölçüleri: atlas kapsamı 2:1 (7680x3840 mercator mozaik)
export const PLAN_GEN = 20;
export const PLAN_DER = 10;
export const KALDIRMA = 0.14; // blok denizden belirgin yükseklikte
export const TABAN_Y = -0.3;  // kesit tabanı

// Gerçek dünya genişliği (merc kapsam ~21.09°, ~39N'de ≈ 1.825.000 m)
const GERCEK_GEN_M = 1_825_000;

export const AYAR = {
  abartma: 4.2, // dikey abartı katsayısı
};

// Atlas/heightmap coğrafi kapsamı (z9 tile kenarları)
const KAPSAM = {
  bati: 24.609375,
  dogu: 45.703125,
  guney: 34.885930940753155,
  kuzey: 43.06888777416962,
};

let geometriRef = null;
let normalYukseklik = null;
let yukseklikVerisi = null;

function birimYukseklik() {
  return (PLAN_GEN / GERCEK_GEN_M) * meta.maksYukseltiM;
}

function yukseklikOku(u, v) {
  if (!yukseklikVerisi) return 0;
  const px = Math.min(meta.binGen - 1, Math.max(0, Math.round(u * (meta.binGen - 1))));
  const py = Math.min(meta.binYuk - 1, Math.max(0, Math.round(v * (meta.binYuk - 1))));
  return (yukseklikVerisi[py * meta.binGen + px] / 65535) * birimYukseklik() * AYAR.abartma;
}

export async function araziOlustur(mobil) {
  const yukleyici = new THREE.TextureLoader();
  const [bin, doku, maske] = await Promise.all([
    fetch(yukseklikBinUrl).then((r) => r.arrayBuffer()),
    yukleyici.loadAsync(atlasUrl),
    yukleyici.loadAsync(maskeUrl),
  ]);
  yukseklikVerisi = new Uint16Array(bin);

  doku.colorSpace = THREE.SRGBColorSpace;
  doku.anisotropy = 4;

  const seg = mobil ? [256, 128] : [512, 256];
  const geo = new THREE.PlaneGeometry(PLAN_GEN, PLAN_DER, seg[0], seg[1]);
  geo.rotateX(-Math.PI / 2);

  const poz = geo.attributes.position;
  const n = poz.count;
  normalYukseklik = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u = poz.getX(i) / PLAN_GEN + 0.5;
    const v = poz.getZ(i) / PLAN_DER + 0.5;
    const px = Math.min(meta.binGen - 1, Math.round(u * (meta.binGen - 1)));
    const py = Math.min(meta.binYuk - 1, Math.round(v * (meta.binYuk - 1)));
    normalYukseklik[i] = yukseklikVerisi[py * meta.binGen + px] / 65535;
  }
  geometriRef = geo;
  abartmaUygula(AYAR.abartma);

  // Üst yüzey: sınır maskesiyle piksel hassasiyetinde kesim
  const ust = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    map: doku,
    roughness: 0.95,
    metalness: 0,
    alphaMap: maske,
    alphaTest: 0.5,
  }));

  const grup = new THREE.Group();
  grup.add(ust, kesitOlustur(), tabanOlustur());
  return { grup, ust };
}

// Yan kesit duvarı: sınır halkaları boyunca üstten tabana örülür
function kesitOlustur() {
  const pozlar = [];
  const uvler = [];
  const indeksler = [];
  let taban = 0;
  for (const halka of sinir.halkalar) {
    let mesafe = 0;
    for (let i = 0; i < halka.length; i++) {
      const k = lonLatKonum(halka[i][0], halka[i][1]);
      if (i > 0) {
        const o = lonLatKonum(halka[i - 1][0], halka[i - 1][1]);
        mesafe += Math.hypot(k.x - o.x, k.z - o.z);
      }
      pozlar.push(k.x, k.y + 0.004, k.z, k.x, TABAN_Y, k.z);
      uvler.push(mesafe * 2, 1, mesafe * 2, 0);
      if (i > 0) {
        const a = taban + (i - 1) * 2;
        indeksler.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    taban += halka.length * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pozlar, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvler, 2));
  geo.setIndex(indeksler);
  geo.computeVertexNormals();

  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    map: katmanDokusu(),
    color: '#CBA57B', // doku ile çarpılır -> posterdeki yumuşak sıcak toprak
    emissive: '#5A4430', // gölgedeki yüzler de ışık alıyormuş gibi
    roughness: 0.9,
    metalness: 0,
    side: THREE.DoubleSide,
  }));
}

// Kesit dokusu: ince yatay katman çizgileri (jeolojik tabaka hissi)
function katmanDokusu() {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#8A6B47';
  ctx.fillRect(0, 0, 8, 128);
  ctx.fillStyle = 'rgba(46, 32, 20, 0.28)';
  for (let y = 10; y < 128; y += 14) {
    ctx.fillRect(0, y, 8, 2);
  }
  const d = new THREE.CanvasTexture(c);
  d.wrapS = THREE.RepeatWrapping;
  d.colorSpace = THREE.SRGBColorSpace;
  return d;
}

// Kapalı taban
function tabanOlustur() {
  const geolar = [];
  for (const halka of sinir.halkalar) {
    const sekil = new THREE.Shape();
    halka.forEach((p, i) => {
      const k = lonLatKonum(p[0], p[1]);
      if (i === 0) sekil.moveTo(k.x, -k.z);
      else sekil.lineTo(k.x, -k.z);
    });
    geolar.push(new THREE.ShapeGeometry(sekil).rotateX(-Math.PI / 2).translate(0, TABAN_Y, 0));
  }
  const grup = new THREE.Group();
  const malzeme = new THREE.MeshStandardMaterial({
    color: '#2A1E14',
    roughness: 1,
    side: THREE.DoubleSide,
  });
  for (const g of geolar) grup.add(new THREE.Mesh(g, malzeme));
  return grup;
}

// lon/lat -> sahne konumu (y: arazi yüzeyi + blok kaldırması)
function mercY(lat) {
  return Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
}

export function lonLatKonum(lon, lat) {
  const u = (lon - KAPSAM.bati) / (KAPSAM.dogu - KAPSAM.bati);
  const yK = mercY(KAPSAM.kuzey);
  const yG = mercY(KAPSAM.guney);
  const v = (yK - mercY(lat)) / (yK - yG);
  const x = (u - 0.5) * PLAN_GEN;
  const z = (v - 0.5) * PLAN_DER;
  return new THREE.Vector3(x, yukseklikOku(u, v) + KALDIRMA, z);
}

export function abartmaUygula(katsayi) {
  if (!geometriRef) return;
  AYAR.abartma = katsayi;
  const olcek = birimYukseklik() * katsayi;
  const poz = geometriRef.attributes.position;
  for (let i = 0; i < poz.count; i++) {
    poz.setY(i, normalYukseklik[i] * olcek + KALDIRMA);
  }
  poz.needsUpdate = true;
  geometriRef.computeVertexNormals();
}
