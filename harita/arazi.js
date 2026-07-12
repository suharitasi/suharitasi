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
  abartma: 2.5, // dikey abartı katsayısı
};

let geometriRef = null;
let normalYukseklik = null; // 0-1 normalize vertex yükseklikleri

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
  });

  return new THREE.Mesh(geo, malzeme);
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
