// SU RİSKİ ENDEKSİ — ŞEFFAF FORMÜLLÜ HESAPLAMA MOTORU (13.09.2026).
//
// Bileşenler (her biri 0-100, YÜKSEK = risk):
//   %40 Baraj doluluk düşüklüğü  (100 − ortalama doluluk %)
//   %25 GRACE yerçekimi eğilimi   (azalma → risk; egim cm/ay)
//   %25 Yağış trendi (CHIRPS)     (son 12 ay < önceki 12 ay → risk)
//   %10 Yönetim baskısı           (havza illerindeki RG tahsise kapatma/kısıt kaydı)
// Eksik bileşen varsa ağırlıklar yeniden normalize edilir.
//
// UYDURMA YASAĞI: hiçbir değer üretilmez; hepsi mevcut resmî veriden türetilir.
// Bu, resmî bir sınıflama DEĞİL, Su Haritası'nın şeffaf bileşik göstergesidir.
import baraj from '../../data/canli/baraj.json';
import graceHavza from '../../data/canli/grace-havza.json';
import chirps from '../../data/canli/chirps.json';
import havzaVeri from '../../data/havza-veri.json';
import ilKurum from '../../data/il-kurum.json';
import isletmeEk from '../../veri/potansiyel/isletme-sahalari-ek.json';
import { graceEgilim } from './grace-hesap.js';

const clamp = (x, a = 0, b = 100) => Math.max(a, Math.min(b, x));
const yuvarla = (x) => (x == null ? null : Math.round(x * 10) / 10);

export const AGIRLIK = { doluluk: 0.4, grace: 0.25, yagis: 0.25, kisit: 0.1 };
export const FORMUL =
  'Su Riski = 0,40·(100 − baraj doluluk%) + 0,25·GRACE risk + 0,25·yağış risk + 0,10·yönetim baskısı. ' +
  'Bileşenler 0-100 (yüksek=risk); eksik bileşende ağırlıklar normalize edilir. ' +
  'Kategori: 0-25 Düşük · 25-50 Orta · 50-75 Yüksek · 75-100 Kritik.';

// — 1) Baraj doluluk —
function barajOrtalama(havzaAd) {
  const ad = havzaAd.replace(/\s*Havzası\s*$/, '');
  const h = baraj.havzalar?.[ad];
  if (!h) return null;
  const d = [];
  for (const b of Object.values(h.barajlar || {})) {
    const gunler = Object.keys(b.seri || {}).sort();
    if (!gunler.length) continue;
    const son = b.seri[gunler[gunler.length - 1]];
    if (son && son.doluluk != null) d.push(son.doluluk);
  }
  return d.length ? d.reduce((t, v) => t + v, 0) / d.length : null;
}

// — 2) GRACE —
function graceRisk(havzaAd) {
  const g = graceHavza.havzalar?.[havzaAd];
  if (!g || !g.seri) return { risk: null, egim: null };
  const e = graceEgilim(g.seri);
  if (!e) return { risk: null, egim: null };
  return { risk: clamp(50 - e.egim * 50, 0, 100), egim: yuvarla(e.egim) };
}

// — 3) Yağış trendi —
function yagisRisk(havzaAd) {
  const c = chirps.havzalar?.[havzaAd];
  if (!c || !c.aylik) return { risk: null, degisim: null };
  const aylar = Object.keys(c.aylik).sort();
  if (aylar.length < 24) return { risk: null, degisim: null };
  const topla = (arr) => arr.reduce((t, a) => t + (c.aylik[a] || 0), 0);
  const son = topla(aylar.slice(-12));
  const onceki = topla(aylar.slice(-24, -12));
  if (!onceki) return { risk: null, degisim: null };
  const degisim = ((son - onceki) / onceki) * 100;
  return { risk: clamp(-degisim * 2, 0, 100), degisim: yuvarla(degisim) };
}

// — 4) Yönetim baskısı (RG tahsise kapatma/kısıt) —
const kisitIl = {};
for (const k of isletmeEk.kayitlar || []) {
  if (!/tahsise kapatma|kısıt|kisit/i.test(k.durum || '')) continue;
  const iller = Array.isArray(k.il) ? k.il : (k.il ? [k.il] : []);
  for (const il of iller) if (il && !/belirsiz/i.test(il)) kisitIl[il] = (kisitIl[il] || 0) + 1;
}
const maxKisit = Math.max(1, ...Object.values(kisitIl));
function kisitRisk(havzaAd) {
  const hv = havzaVeri.havzalar.find((h) => h.ad === havzaAd);
  if (!hv) return { risk: null, sayi: 0 };
  const iller = ilKurum.havzaIlleri[hv.no]?.iller || [];
  const sayi = iller.reduce((t, il) => t + (kisitIl[il] || 0), 0);
  return { risk: clamp((sayi / maxKisit) * 100, 0, 100), sayi };
}

function kategori(p) {
  if (p == null) return 'Veri yok';
  if (p < 25) return 'Düşük';
  if (p < 50) return 'Orta';
  if (p < 75) return 'Yüksek';
  return 'Kritik';
}

// — Havza riski —
export const HAVZA_RISK = havzaVeri.havzalar.map((hv) => {
  const b = barajOrtalama(hv.ad);
  const g = graceRisk(hv.ad);
  const y = yagisRisk(hv.ad);
  const k = kisitRisk(hv.ad);
  const parcalar = {
    doluluk: b == null ? null : clamp(100 - b, 0, 100),
    grace: g.risk, yagis: y.risk, kisit: k.risk,
  };
  let t = 0, w = 0;
  for (const [ad, v] of Object.entries(parcalar)) if (v != null) { t += v * AGIRLIK[ad]; w += AGIRLIK[ad]; }
  const puan = w ? yuvarla(t / w) : null;
  return {
    no: hv.no, ad: hv.ad, puan, kategori: kategori(puan),
    bilesenler: { doluluk: yuvarla(parcalar.doluluk), grace: yuvarla(g.risk), yagis: yuvarla(y.risk), kisit: yuvarla(k.risk) },
    ham: { barajDoluluk: yuvarla(b), graceEgim: g.egim, yagisDegisim: y.degisim, kisitSayi: k.sayi },
  };
}).sort((a, b) => (b.puan ?? -1) - (a.puan ?? -1));

// — İl riski (illerin havzalarının ortalaması) —
const havzaByAd = Object.fromEntries(HAVZA_RISK.map((h) => [h.ad, h]));
const ilHavzaAd = {}; // il → [havzaAd]
const havzaAdByNo = Object.fromEntries(havzaVeri.havzalar.map((h) => [h.no, h.ad]));
for (const [no, h] of Object.entries(ilKurum.havzaIlleri)) {
  const ad = havzaAdByNo[no];
  for (const il of h.iller) (ilHavzaAd[il] = ilHavzaAd[il] || []).push(ad);
}
const illerSet = new Set([...Object.keys(ilHavzaAd), ...Object.keys(ilKurum.suIdareleri)]);
export const IL_RISK = [...illerSet].sort((a, b) => a.localeCompare(b, 'tr')).map((il) => {
  const adlar = ilHavzaAd[il] || [];
  const puanlar = adlar.map((a) => havzaByAd[a]?.puan).filter((x) => x != null);
  const puan = puanlar.length ? yuvarla(puanlar.reduce((t, v) => t + v, 0) / puanlar.length) : null;
  return { il, puan, kategori: kategori(puan), havzalar: adlar };
}).sort((a, b) => (b.puan ?? -1) - (a.puan ?? -1));

export const OZET = {
  havzaSayisi: HAVZA_RISK.length,
  ilSayisi: IL_RISK.length,
  kritik: HAVZA_RISK.filter((h) => h.kategori === 'Kritik').length,
  yuksek: HAVZA_RISK.filter((h) => h.kategori === 'Yüksek').length,
};

// — Zaman serileri (kuraklık/taşkın görünümü + su bütçesi) —
function barajSeri(havzaAd, n = 30) {
  const ad = havzaAd.replace(/\s*Havzası\s*$/, '');
  const h = baraj.havzalar?.[ad];
  if (!h) return [];
  const gunluk = {};
  for (const b of Object.values(h.barajlar || {})) {
    for (const [gun, v] of Object.entries(b.seri || {})) {
      if (v && v.doluluk != null) (gunluk[gun] = gunluk[gun] || []).push(v.doluluk);
    }
  }
  return Object.keys(gunluk).sort().slice(-n).map((g) => yuvarla(gunluk[g].reduce((t, v) => t + v, 0) / gunluk[g].length));
}
function chirpsSeri(havzaAd, n = 36) {
  const c = chirps.havzalar?.[havzaAd];
  if (!c || !c.aylik) return [];
  return Object.keys(c.aylik).sort().slice(-n).map((a) => yuvarla(c.aylik[a]));
}
export const SERILER = Object.fromEntries(
  havzaVeri.havzalar.map((hv) => [hv.ad, { baraj: barajSeri(hv.ad), chirps: chirpsSeri(hv.ad) }])
);

// Su bütçesi göstergeleri (YAS beslenimi vs işletme rezervi) — havza-veri'den.
export const BUTCE = Object.fromEntries(
  havzaVeri.havzalar.map((hv) => [hv.ad, {
    beslenim_hm3: hv.yasBeslenimi_hm3 ?? null,
    rezerv_hm3: hv.yasIsletmeRezervi_hm3 ?? null,
    yuzeyPotansiyeli_km3: hv.yuzeysuyuPotansiyeli_km3 ?? null,
    yagisAlani_km2: hv.yagisAlani_km2 ?? null,
  }])
);
