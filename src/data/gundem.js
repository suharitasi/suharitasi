// VERİ GÜNDEMİ — otomatik veri gazeteciliği modülü (13.09.2026).
// Mevcut doğrulanmış veriden otomatik özet/hikâye üretir. Uydurma yok.
import { HAVZA_RISK } from './su-riski.js';
// Kısıt/kapatma kayıtları TEK KAYNAKTAN: /kuyu-kisit-sorgu/ ile aynı normalize
// edilmiş küme. Eskiden burada ham `isletme-sahalari-ek.json` sayılıyordu ve
// aynı kaynak iki sayfada FARKLI sayı veriyordu (gündem 23, kısıt paneli 7).
import { KAYITLAR } from './kisit-sorgu.js';
import chirps from '../../data/canli/chirps.json';

const sayi = (v) => (v == null ? null : Math.round(v * 10) / 10);

// rg_tarih "DD.MM.YYYY" biçimindedir; sözlük sırası GÜN'e göre olur ve tarihi
// bozar (30.01.1968 > 01.11.2007). Karşılaştırmadan önce YYYYMMDD'ye çevrilir.
const tarihAnahtar = (t) => String(t || '').split('.').reverse().join('');

// Son 12 ayda yağış değişimi (%) — negatif = kuruma
function yagisDegisim(ad) {
  const c = chirps.havzalar?.[ad];
  if (!c || !c.aylik) return null;
  const aylar = Object.keys(c.aylik).sort();
  if (aylar.length < 24) return null;
  const top = (arr) => arr.reduce((t, a) => t + (c.aylik[a] || 0), 0);
  const son = top(aylar.slice(-12)), onceki = top(aylar.slice(-24, -12));
  if (!onceki) return null;
  return sayi(((son - onceki) / onceki) * 100);
}

// En yüksek riskli havzalar
export const EN_RISKLI = HAVZA_RISK.filter((h) => h.puan != null).slice(0, 5);

// Rezervi en hızlı azalan (GRACE eğimi en negatif)
export const REZERV_AZALAN = [...HAVZA_RISK]
  .filter((h) => h.ham.graceEgim != null)
  .sort((a, b) => a.ham.graceEgim - b.ham.graceEgim)
  .slice(0, 5);

// Son 12 ayda yağışı en çok düşen (kuraklık sinyali)
export const EN_KURAK = HAVZA_RISK
  .map((h) => ({ no: h.no, ad: h.ad, degisim: yagisDegisim(h.ad) }))
  .filter((x) => x.degisim != null)
  .sort((a, b) => a.degisim - b.degisim)
  .slice(0, 5);

// Tahsise kapatma/kısıt kayıtları (normalize edilmiş TEK kaynak).
const KAPATMA = KAYITLAR.filter((r) => /tahsise kapatma|kısıt|kisit/i.test(r.durum || ''));

// En çok tahsise kapatma/kısıt kaydı olan iller
const ilSayac = {};
for (const r of KAPATMA) for (const il of r.il) ilSayac[il] = (ilSayac[il] || 0) + 1;
export const KISIT_ILLER = Object.entries(ilSayac).map(([il, n]) => ({ il, n })).sort((a, b) => b.n - a.n).slice(0, 8);

// En yeni tahsise kapatma/kısıt kayıtları
export const SON_KAPATMA = KAPATMA
  .map((r) => ({
    tarih: r.tarih || '',
    il: r.il.join(', '),
    saha: (r.saha || '').replace(/\s+/g, ' ').trim().slice(0, 120),
    kaynak: r.kaynak || '',
  }))
  .sort((a, b) => tarihAnahtar(b.tarih).localeCompare(tarihAnahtar(a.tarih)))
  .slice(0, 8);

export const GUNDEM_SAYI = {
  izlenenHavza: HAVZA_RISK.length,
  kapatmaKaydi: KAPATMA.length,
};
