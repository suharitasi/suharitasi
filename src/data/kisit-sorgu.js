// KISIT SORGU VERİ KATMANI (13.09.2026) — DATA MOAT çekirdeği.
//
// Kaynak: DSİ Resmî Gazete işletme sahası ilanları + tahsise kapatma/kısıt
// kayıtları (veri/potansiyel/isletme-sahalari.json + -ek.json). Her kayıt
// il/ilçe, durum, tarih ve resmî RG URL'si taşır.
//
// UYDURMA YASAĞI: bu katman "açık/kapalı/kısıtlı/yasak" SINIFLAMASI ÜRETMEZ
// (böyle bir resmî sınıflama kamuya açık yayımlanmamıştır). Yalnızca gerçek
// RG ilanlarını ile göre gruplar. Kullanıcı kaydın kendisini ve resmî linkini
// görür; yorumu uzman yapar.
import ana from '../../veri/potansiyel/isletme-sahalari.json';
import ek from '../../veri/potansiyel/isletme-sahalari-ek.json';
import { kisitNormalize } from './ortak-normalize.js';

// Normalizasyon + mükerrer eleme TEK KAYNAK: ortak-normalize.js
// (aynı mantık astro.config'teki kisit-json kancasında da kullanılır).
export const KAYITLAR = kisitNormalize(ana.kayitlar, ek.kayitlar);

/** Bir ile ait RG kayıtları (il eşlemesi doğrulanmış olanlar). */
export function ilKayitlari(il) {
  return KAYITLAR.filter((r) => r.il.includes(il));
}

// ÖLÜ KOD SİLİNDİ (04.10.2026 denetimi): kisitKayitlari — 0 çağrı (ölçüldü).

/** Kayıt bulunan illerin alfabetik listesi. */
export function kayitliIller() {
  const set = new Set();
  for (const r of KAYITLAR) for (const il of r.il) set.add(il);
  return [...set].sort((a, b) => a.localeCompare(b, 'tr'));
}

export const TOPLAM = KAYITLAR.length;
export const KISIT_TOPLAM = KAYITLAR.filter((r) => /kapatma|kısıt|kisit/i.test(r.durum)).length;
export const KAYNAK_NOTU =
  'Bu panel DSİ Resmî Gazete işletme sahası ve tahsise kapatma/kısıt ilanlarını ' +
  'il bazında listeler. "Açık/kapalı/kısıtlı/yasak" biçiminde resmî bir tahsis ' +
  'sınıflaması kamuya açık yayımlanmadığından panel böyle bir sınıflama ÜRETMEZ; ' +
  'yalnızca ilgili resmî ilanı ve linkini gösterir.';
