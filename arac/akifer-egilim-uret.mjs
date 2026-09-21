#!/usr/bin/env node
/* ============================================================================
   AKİFER EĞİLİM MATRİSİ ÜRETİCİ — ADIM 2 (v6.0), 21.09.2026.
   ----------------------------------------------------------------------------
   NE YAPAR: 25 hidrolojik havza için gerçek veriden yeraltı su tablası eğilim
   matrisini üretir ve `src/data/akifer-egilim-matrisi.json`'a yazar.

   K7 (UYDURMA YASAĞI):
   - DSİ KUYU RASAT (gözlem) serisi depoda YOKTUR → uydurulmaz. Eğilim, GERÇEK
     iki kaynaktan türetilir:
       (a) NASA/DLR GRACE/GRACE-FO mascon TWS anomalisi (cm, aylık) — su tablası
           değişiminin uydu gözlemi; havza başına 254 ay.
       (b) DSİ Resmî Su Kaynakları İstatistikleri Tablo 1.3 — YAS potansiyeli ve
           işletme rezervi (2013-2024), bağlam künyesi olarak.
   - "Kısıtlı İşletme" sınıflaması ÜRETİLMEZ: havza düzeyinde resmî bir kısıt
     işletme sınıflaması kamuya açık yayımlı DEĞİLDİR (bkz. src/data/kisit-sorgu.js
     kararı). Alan `veri yok` olarak kalır.
   - Serisi yetersiz/olmayan havzada durum deterministik fallback metnidir:
     "Bölge Akifer Rasat Kaydı Bulunmuyor (DSİ Etüdü Gerekir)".

   YÖNTEM: son 120 ayın (10 yıl) en küçük kareler eğimi (cm/yıl). Kategori eşiği
   ±0,5 cm/yıl — src/data/grace-hesap.js ile AYNI. <24 gerçek ayda eğim = null.

   KULLANIM:  node arac/akifer-egilim-uret.mjs
   ========================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';

const AY = 120;                                   // son 10 yıl (aylık)
const ESIK = 0.5;                                 // cm/yıl — grace-hesap.js ile aynı
const FALLBACK = 'Bölge Akifer Rasat Kaydı Bulunmuyor (DSİ Etüdü Gerekir)';

const grace = JSON.parse(readFileSync('data/canli/grace-havza.json', 'utf8'));
const havzaVeri = JSON.parse(readFileSync('data/havza-veri.json', 'utf8'));
const yas = JSON.parse(readFileSync('data/canli/havza-yas.json', 'utf8'));

/** Son `ayAdet` ayın en küçük kareler eğimi (cm/yıl). <24 ayda null. */
function egim(seri, ayAdet = AY) {
  const aylar = Object.keys(seri).sort();
  const son = aylar.slice(-ayAdet);
  if (son.length < 24) return null;
  const x = son.map((a) => Number(a.slice(0, 4)) + (Number(a.slice(5, 7)) - 0.5) / 12);
  const y = son.map((a) => seri[a]);
  const n = x.length;
  const xo = x.reduce((t, v) => t + v, 0) / n;
  const yo = y.reduce((t, v) => t + v, 0) / n;
  let pay = 0, payda = 0;
  for (let i = 0; i < n; i++) { pay += (x[i] - xo) * (y[i] - yo); payda += (x[i] - xo) ** 2; }
  return {
    egim: pay / payda,
    aySayisi: n,
    aralik: `${son[0]} – ${son[son.length - 1]}`,
    sonAy: son[son.length - 1],
    seri: Object.fromEntries(son.map((a) => [a, seri[a]])),
  };
}

const kategori = (e) => (e <= -ESIK ? 'Kritik Düşüş' : e >= ESIK ? 'Yükseliş' : 'Dengeli');

const havzalar = havzaVeri.havzalar.map((h) => {
  const gm = grace.havzalar?.[h.ad];
  const s = gm?.seri ? egim(gm.seri) : null;
  const yh = yas.havzalar?.[h.no] ?? null;
  const veriVar = s != null;
  return {
    no: h.no,
    ad: h.ad,
    durum: veriVar ? 'veri var' : FALLBACK,
    kategori: veriVar ? kategori(s.egim) : null,
    egilim_cm_yil: veriVar ? Math.round(s.egim * 100) / 100 : null,
    aralik: s?.aralik ?? null,
    ay_sayisi: s?.aySayisi ?? 0,
    seri: s?.seri ?? null,
    seri_birimi: 'cm sıvı su eşdeğeri (TWS anomalisi)',
    dsi_yas: yh
      ? {
          rezerv_hm3: yh.rezerv?.['2024'] ?? null,
          potansiyel_hm3: yh.potansiyel?.['2024'] ?? null,
          yil: 2024,
        }
      : null,
    // Havza düzeyinde resmî "kısıtlı işletme" sınıflaması yayımlı değildir.
    isletme_durumu: 'veri yok',
  };
});

const out = {
  _not:
    '25 hidrolojik havza için yeraltı su tablası eğilim matrisi (ADIM 2, v6.0). '
    + 'Seri ve kategori GERÇEK veriden türetilir; DSİ kuyu rasat (gözlem) serisi '
    + 'depoda bulunmadığından UYDURULMAZ (K7). Serisi olmayan havzada durum '
    + `deterministik fallback'tir ("${FALLBACK}").`,
  _kaynaklar: {
    egilim: grace.kunye?.kaynak ?? 'NASA GSFC GRACE/GRACE-FO mascon RL06',
    dsi_yas:
      yas.kaynak?.havzaPotansiyelRezerv?.ad
      ?? 'DSİ Resmî Su Kaynakları İstatistikleri, Tablo 1.3',
  },
  _yontem:
    `Son ${AY} ayın (10 yıl) en küçük kareler eğimi (cm/yıl); kategori eşiği ±${ESIK} cm/yıl `
    + '(src/data/grace-hesap.js ile aynı). 24 gerçek aydan azsa eğim hesaplanmaz.',
  _dur:
    '"Kısıtlı İşletme" sınıflaması ÜRETİLMEDİ: havza düzeyinde resmî kısıt/işletme '
    + 'sınıflaması kamuya açık yayımlı değildir (src/data/kisit-sorgu.js kararı). '
    + 'DUR: kullanıcı onaylı bir kaynak (NHYP YAS kütle durumu veya RG işletme '
    + 'sahası) verilirse bu alan doldurulur.',
  uretim: '2026-09-21',
  havzalar,
};

writeFileSync('src/data/akifer-egilim-matrisi.json', JSON.stringify(out, null, 1) + '\n');

const dagilim = {};
for (const h of havzalar) dagilim[h.kategori ?? 'FALLBACK'] = (dagilim[h.kategori ?? 'FALLBACK'] || 0) + 1;
console.log(`[akifer] ${havzalar.length} havza · kategori dağılımı: ${JSON.stringify(dagilim)}`);
console.log(`[akifer] yazıldı: src/data/akifer-egilim-matrisi.json`);
