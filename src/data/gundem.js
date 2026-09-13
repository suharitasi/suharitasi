// VERİ GÜNDEMİ — otomatik veri gazeteciliği modülü (13.09.2026).
// Mevcut doğrulanmış veriden otomatik özet/hikâye üretir. Uydurma yok.
import { HAVZA_RISK } from './su-riski.js';
import isletmeEk from '../../veri/potansiyel/isletme-sahalari-ek.json';

const sayi = (v) => (v == null ? null : Math.round(v * 10) / 10);

// En yüksek riskli havzalar
export const EN_RISKLI = HAVZA_RISK.filter((h) => h.puan != null).slice(0, 5);

// Rezervi en hızlı azalan (GRACE eğimi en negatif)
export const REZERV_AZALAN = [...HAVZA_RISK]
  .filter((h) => h.ham.graceEgim != null)
  .sort((a, b) => a.ham.graceEgim - b.ham.graceEgim)
  .slice(0, 5);

// Son 12 ayda yağışı en çok düşen (kuraklık sinyali)
export const EN_KURAK = [...HAVZA_RISK]
  .filter((h) => h.ham.yagisDegisim != null)
  .sort((a, b) => a.ham.yagisDegisim - b.ham.yagisDegisim)
  .slice(0, 5);

// En çok tahsise kapatma/kısıt kaydı olan iller
const ilSayac = {};
for (const k of isletmeEk.kayitlar || []) {
  if (!/tahsise kapatma|kısıt|kisit/i.test(k.durum || '')) continue;
  const iller = Array.isArray(k.il) ? k.il : (k.il ? [k.il] : []);
  for (const il of iller) if (il && !/belirsiz/i.test(il)) ilSayac[il] = (ilSayac[il] || 0) + 1;
}
export const KISIT_ILLER = Object.entries(ilSayac).map(([il, n]) => ({ il, n })).sort((a, b) => b.n - a.n).slice(0, 8);

// En yeni tahsise kapatma/kısıt kayıtları
export const SON_KAPATMA = (isletmeEk.kayitlar || [])
  .filter((k) => /tahsise kapatma|kısıt|kisit/i.test(k.durum || ''))
  .map((k) => ({
    tarih: k.rg_tarih || '',
    il: (Array.isArray(k.il) ? k.il : [k.il]).filter(Boolean).filter((x) => !/belirsiz/i.test(x)).join(', '),
    saha: (k.saha_adi || '').replace(/\s+/g, ' ').trim().slice(0, 120),
    kaynak: k.kaynak_url || '',
  }))
  .sort((a, b) => (b.tarih || '').localeCompare(a.tarih || ''))
  .slice(0, 8);

export const GUNDEM_SAYI = {
  izlenenHavza: HAVZA_RISK.length,
  kapatmaKaydi: (isletmeEk.kayitlar || []).filter((k) => /tahsise kapatma|kısıt|kisit/i.test(k.durum || '')).length,
};
