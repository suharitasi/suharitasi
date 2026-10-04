// SU RİSKİ ENDEKSİ — TEK KAYNAK (birleşik, 13.09.2026).
//
// ÇELİŞKİ ÇÖZÜMÜ: Önceden iki ayrı risk formülü vardı (havza-risk.js ve
// bu dosya) ve aynı havza için farklı puan üretiyordu (Marmara 60 vs 63,7).
// Artık HAVZA PUANI TEK YERDEN gelir: `havza-risk.js` → `havzaRisk(no)`.
// Bu dosya yalnızca İL toplaması + zaman serileri + su bütçesi ekler;
// havza puanını YENİDEN HESAPLAMAZ.
//
// UYDURMA YASAĞI: hiçbir değer üretilmez; hepsi resmî veriden türetilir.
import havzaVeri from '../../data/havza-veri.json';
import ilKurum from '../../data/il-kurum.json';
import baraj from '../../data/canli/baraj.json';
import chirps from '../../data/canli/chirps.json';
import { havzaRisk, W as HAVZA_W } from './havza-risk.js';

const yuvarla = (x) => (x == null ? null : Math.round(x * 10) / 10);
const katSinif = (seviye) => ({ dusuk: 'Düşük', orta: 'Orta', yuksek: 'Yüksek' }[seviye] || 'Veri yok');

export const AGIRLIK = HAVZA_W;
export const FORMUL =
  'Tek formül (havza-risk.js): %30 uydu su ölçümü eğilimi + %25 baraj doluluk + ' +
  '%20 YAS rezerv/beslenim + %15 tahsis durumu + %10 yüzey suyu potansiyeli. ' +
  'Verisi olmayan gösterge puana katılmaz; ağırlıklar katkı verenler arasında normalize edilir. ' +
  'Kategori: <35 Düşük · 35-59 Orta · ≥60 Yüksek.';

// — Havza riski: TEK kaynak havza-risk.js —
export const HAVZA_RISK = havzaVeri.havzalar.map((hv) => {
  const r = havzaRisk(hv.no);
  return {
    no: hv.no, ad: hv.ad, puan: r.puan, kategori: katSinif(r.seviye),
    bilesenler: {
      grace: r.detay.grace.skor, baraj: r.detay.baraj.skor, yas: r.detay.yas.skor,
      tahsis: r.detay.tahsis.skor, yuzeysuyu: r.detay.yuzeysuyu.skor,
    },
    ham: {
      graceEgim: r.detay.grace.egim ?? null,
      barajDoluluk: r.detay.baraj.ortalamaDoluluk ?? null,
      yasBeslenim: r.detay.yas.beslenim ?? null,
      yasRezerv: r.detay.yas.rezerv ?? null,
      yuzyPotansiyel: r.detay.yuzeysuyu.potansiyel ?? null,
    },
  };
}).sort((a, b) => (b.puan ?? -1) - (a.puan ?? -1));

// — İl riski (illerin havzalarının ortalaması) —
const havzaByAd = Object.fromEntries(HAVZA_RISK.map((h) => [h.ad, h]));
const havzaAdByNo = Object.fromEntries(havzaVeri.havzalar.map((h) => [h.no, h.ad]));
const ilHavzaAd = {};
for (const [no, h] of Object.entries(ilKurum.havzaIlleri)) {
  const ad = havzaAdByNo[no];
  for (const il of h.iller) (ilHavzaAd[il] = ilHavzaAd[il] || []).push(ad);
}
const illerSet = new Set([...Object.keys(ilHavzaAd), ...Object.keys(ilKurum.suIdareleri)]);
export const IL_RISK = [...illerSet].sort((a, b) => a.localeCompare(b, 'tr')).map((il) => {
  const adlar = ilHavzaAd[il] || [];
  const puanlar = adlar.map((a) => havzaByAd[a]?.puan).filter((x) => x != null);
  const puan = puanlar.length ? yuvarla(puanlar.reduce((t, v) => t + v, 0) / puanlar.length) : null;
  const kategori = puan == null ? 'Veri yok' : puan >= 60 ? 'Yüksek' : puan >= 35 ? 'Orta' : 'Düşük';
  return { il, puan, kategori, havzalar: adlar };
}).sort((a, b) => (b.puan ?? -1) - (a.puan ?? -1));

export const OZET = {
  havzaSayisi: HAVZA_RISK.length,
  ilSayisi: IL_RISK.length,
  kritik: HAVZA_RISK.filter((h) => (h.puan ?? 0) >= 80).length,
  yuksek: HAVZA_RISK.filter((h) => h.kategori === 'Yüksek').length,
};

// — Zaman serileri (kuraklık/taşkın görünümü) —
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

// — Su bütçesi göstergeleri (YAS beslenimi vs işletme rezervi) —
export const BUTCE = Object.fromEntries(
  havzaVeri.havzalar.map((hv) => [hv.ad, {
    beslenim_hm3: hv.yasBeslenimi_hm3 ?? null,
    rezerv_hm3: hv.yasIsletmeRezervi_hm3 ?? null,
    yuzeyPotansiyeli_km3: hv.yuzeysuyuPotansiyeli_km3 ?? null,
    yagisAlani_km2: hv.yagisAlani_km2 ?? null,
  }])
);
