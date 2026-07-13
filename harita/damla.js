// Yukarıdan süzülen damlalar: 5-8 sn'de bir tek tük, ince akuamarin izli,
// düştüğü yerde minik parıltıyla sönen. Az ve zarif.
import * as THREE from 'three';

const IZ = 4; // damla başına iz noktası

export function damlaKur(rig, mobil) {
  const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAKS = mobil ? 1 : 2; // eşzamanlı damla

  const geo = new THREE.BufferGeometry();
  const pozlar = new Float32Array(MAKS * IZ * 3);
  const renkler = new Float32Array(MAKS * IZ * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pozlar, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(renkler, 3));
  const puanlar = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  }));
  puanlar.frustumCulled = false;
  puanlar.visible = !azHareket;
  rig.add(puanlar);

  // Çarpma parıltısı
  const parlamaDoku = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(220, 250, 252, 0.95)');
    g.addColorStop(1, 'rgba(79, 195, 208, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();

  const damlalar = Array.from({ length: MAKS }, () => {
    const parlama = new THREE.Sprite(new THREE.SpriteMaterial({
      map: parlamaDoku,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    }));
    parlama.scale.set(0.3, 0.15, 1);
    rig.add(parlama);
    return { aktif: false, x: 0, y: 0, z: 0, hiz: 0, parlama, parlamaT: 1 };
  });

  // HEDEF: havada asılı, ışıkta parıldayan damla bulutları (üst bölge)
  const BULUT_SAYI = mobil ? 30 : 80;
  const bulutGeo = new THREE.BufferGeometry();
  const bulutPoz = new Float32Array(BULUT_SAYI * 3);
  const bulutRenk = new Float32Array(BULUT_SAYI * 3);
  const bulutFaz = new Float32Array(BULUT_SAYI);
  for (let i = 0; i < BULUT_SAYI; i++) {
    // iki küme: sol-üst ve orta-üst
    const kume = i % 2;
    bulutPoz[i * 3] = (kume ? -0.5 : -5.5) + (Math.random() - 0.5) * 4.5;
    bulutPoz[i * 3 + 1] = 1.6 + Math.random() * 2.2;
    bulutPoz[i * 3 + 2] = -1 + Math.random() * 3.5;
    bulutFaz[i] = Math.random() * Math.PI * 2;
  }
  bulutGeo.setAttribute('position', new THREE.BufferAttribute(bulutPoz, 3));
  bulutGeo.setAttribute('color', new THREE.BufferAttribute(bulutRenk, 3));
  const bulut = new THREE.Points(bulutGeo, new THREE.PointsMaterial({
    size: 0.065,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  }));
  bulut.frustumCulled = false;
  bulut.visible = !azHareket;
  rig.add(bulut);
  const BULUT_RENK = new THREE.Color('#FFF2DC'); // ışıkta parıldar (sıcak)

  let sonraki = 2.5; // ilk damla erken gelsin
  const RENK = new THREE.Color('#A8DDE0');
  let bt = 0;

  return function guncelle(dt) {
    if (azHareket) return;

    // asılı bulut: yavaş süzülme + fazlı parıldama
    bt += dt;
    for (let i = 0; i < BULUT_SAYI; i++) {
      bulutPoz[i * 3 + 1] -= dt * 0.055;
      if (bulutPoz[i * 3 + 1] < 1.2) bulutPoz[i * 3 + 1] = 3.8;
      const p = (0.3 + 0.9 * Math.pow(0.5 + 0.5 * Math.sin(bt * 1.8 + bulutFaz[i]), 3.0)) * 1.2;
      bulutRenk[i * 3] = BULUT_RENK.r * p;
      bulutRenk[i * 3 + 1] = BULUT_RENK.g * p;
      bulutRenk[i * 3 + 2] = BULUT_RENK.b * p;
    }
    bulutGeo.attributes.position.needsUpdate = true;
    bulutGeo.attributes.color.needsUpdate = true;

    sonraki -= dt;
    if (sonraki <= 0) {
      const bos = damlalar.find((d) => !d.aktif);
      if (bos) {
        bos.aktif = true;
        bos.x = (Math.random() - 0.5) * 15;
        bos.z = (Math.random() - 0.5) * 7;
        bos.y = 4.2; // kadrajın üstünden girer
        bos.hiz = 0;
      }
      sonraki = 5 + Math.random() * 3;
    }

    damlalar.forEach((d, di) => {
      // çarpma parıltısı sönümü
      if (d.parlamaT < 1) {
        d.parlamaT += dt * 2.2;
        d.parlama.material.opacity = Math.max(0, 0.8 * (1 - d.parlamaT));
        d.parlama.scale.setScalar(0.25 + d.parlamaT * 0.35);
        d.parlama.scale.y *= 0.5;
      }
      const taban = di * IZ * 3;
      if (!d.aktif) {
        for (let k = 0; k < IZ; k++) {
          renkler[taban + k * 3] = renkler[taban + k * 3 + 1] = renkler[taban + k * 3 + 2] = 0;
        }
        return;
      }
      d.hiz += 2.6 * dt;
      d.y -= d.hiz * dt;

      // kütle üstüne mi boşluğa mı düştü — ikisi de minik parıltı
      const zeminY = (Math.abs(d.x) < 9 && Math.abs(d.z) < 4.3) ? 0.3 : -0.62;
      if (d.y <= zeminY) {
        d.aktif = false;
        d.parlama.position.set(d.x, zeminY + 0.04, d.z);
        d.parlamaT = 0;
        return;
      }

      // ince iz: arkada sönerek uzayan noktalar
      for (let k = 0; k < IZ; k++) {
        const i = taban + k * 3;
        pozlar[i] = d.x;
        pozlar[i + 1] = d.y + k * 0.09;
        pozlar[i + 2] = d.z;
        const parlaklik = (1 - k / IZ) * 0.9;
        renkler[i] = RENK.r * parlaklik;
        renkler[i + 1] = RENK.g * parlaklik;
        renkler[i + 2] = RENK.b * parlaklik;
      }
    });

    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  };
}
