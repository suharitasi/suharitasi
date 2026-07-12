// Arazi: heightmap'ten gerçek geometri (CPU displacement).
// Not: 16-bit PNG tarayıcı canvas'ında 8-bit'e düştüğü için yükselti
// ham Uint16 .bin'den okunur; PNG arşiv/işleme içindir.
import * as THREE from 'three';
import atlasUrl from '../src/assets/tr-atlas.webp';
import yukseklikBinUrl from '../src/assets/tr-yukseklik.bin?url';
import meta from '../src/assets/tr-yukseklik.json';

// Sahne ölçüleri: atlas kapsamı 2:1 (7680x3840 mercator mozaik)
export const PLAN_GEN = 20;
export const PLAN_DER = 10;

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
let normalYukseklik = null; // 0-1 normalize vertex yükseklikleri
let yukseklikVerisi = null; // ham Uint16 grid (lon/lat sorguları için)

function birimYukseklik() {
  // 1 m yükseltinin sahne birimi karşılığı
  return (PLAN_GEN / GERCEK_GEN_M) * meta.maksYukseltiM;
}

export async function araziOlustur(mobil) {
  const [bin, doku] = await Promise.all([
    fetch(yukseklikBinUrl).then((r) => r.arrayBuffer()),
    new THREE.TextureLoader().loadAsync(atlasUrl),
  ]);
  const yukseklik = new Uint16Array(bin);
  yukseklikVerisi = yukseklik;

  doku.colorSpace = THREE.SRGBColorSpace;
  doku.anisotropy = 4;

  const seg = mobil ? [256, 128] : [512, 256];
  const geo = new THREE.PlaneGeometry(PLAN_GEN, PLAN_DER, seg[0], seg[1]);
  geo.rotateX(-Math.PI / 2); // XZ düzlemine yatır (+z güney)

  const poz = geo.attributes.position;
  const n = poz.count;
  normalYukseklik = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u = poz.getX(i) / PLAN_GEN + 0.5;
    const v = poz.getZ(i) / PLAN_DER + 0.5;
    const px = Math.min(meta.binGen - 1, Math.round(u * (meta.binGen - 1)));
    const py = Math.min(meta.binYuk - 1, Math.round(v * (meta.binYuk - 1)));
    normalYukseklik[i] = yukseklik[py * meta.binGen + px] / 65535;
  }
  geometriRef = geo;
  abartmaUygula(AYAR.abartma);

  const malzeme = new THREE.MeshStandardMaterial({
    map: doku,
    roughness: 0.95,
    metalness: 0,
    // Kenarlar karanlık suya çözünsün: "havada yüzen dikdörtgen" hissi kalkar
    alphaMap: kenarAlfaDokusu(),
    transparent: true,
  });

  return new THREE.Mesh(geo, malzeme);
}

// lon/lat -> sahne konumu (y: arazi yüzeyi, mevcut abartmayla)
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
  let y = 0;
  if (yukseklikVerisi) {
    const px = Math.min(meta.binGen - 1, Math.max(0, Math.round(u * (meta.binGen - 1))));
    const py = Math.min(meta.binYuk - 1, Math.max(0, Math.round(v * (meta.binYuk - 1))));
    y = (yukseklikVerisi[py * meta.binGen + px] / 65535) * birimYukseklik() * AYAR.abartma;
  }
  return new THREE.Vector3(x, y, z);
}

// Kenarlarda yumuşak alfa düşüşü (%9 bant)
function kenarAlfaDokusu() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');
  const veri = ctx.createImageData(c.width, c.height);
  const bant = 0.09;
  const duz = (t) => Math.min(1, Math.max(0, t));
  const yumusak = (t) => { const k = duz(t); return k * k * (3 - 2 * k); };
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      const ax = yumusak(Math.min(x, c.width - 1 - x) / (c.width * bant));
      const ay = yumusak(Math.min(y, c.height - 1 - y) / (c.height * bant));
      const a = Math.round(ax * ay * 255);
      const i = (y * c.width + x) * 4;
      veri.data[i] = a; veri.data[i + 1] = a; veri.data[i + 2] = a; veri.data[i + 3] = 255;
    }
  }
  ctx.putImageData(veri, 0, 0);
  const doku = new THREE.CanvasTexture(c);
  return doku;
}

export function abartmaUygula(katsayi) {
  if (!geometriRef) return;
  AYAR.abartma = katsayi;
  const olcek = birimYukseklik() * katsayi;
  const poz = geometriRef.attributes.position;
  for (let i = 0; i < poz.count; i++) {
    poz.setY(i, normalYukseklik[i] * olcek);
  }
  poz.needsUpdate = true;
  geometriRef.computeVertexNormals();
}
