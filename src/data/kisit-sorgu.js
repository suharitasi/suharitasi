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

const BELIRSIZ = /belirsiz/i;

function normalize(k) {
  const ilHam = k.il;
  const iller = Array.isArray(ilHam) ? ilHam : (ilHam ? [ilHam] : []);
  const gecerli = iller.filter((x) => x && !BELIRSIZ.test(x));
  return {
    saha: (k.saha_adi || '').replace(/\s+/g, ' ').trim().slice(0, 200),
    iller: gecerli,
    ilceler: k.ilceler && typeof k.ilceler === 'object' ? Object.keys(k.ilceler) : [],
    durum: k.durum || 'belirsiz',
    tarih: k.rg_tarih || '',
    kaynak: k.kaynak_url || '',
    rg: k.rg_sayi || '',
  };
}

// İki dosyayı birleştir, mükerrerleri (kaynak + tarih + saha) ele.
const hepsi = [...(ana.kayitlar ?? []), ...(ek.kayitlar ?? [])].map(normalize);
const gorulen = new Set();
const KAYITLAR = [];
for (const r of hepsi) {
  const anahtar = `${r.kaynak}|${r.tarih}|${r.saha.slice(0, 60)}`;
  if (gorulen.has(anahtar)) continue;
  gorulen.add(anahtar);
  KAYITLAR.push(r);
}
KAYITLAR.sort((a, b) => (b.tarih || '').localeCompare(a.tarih || ''));

/** Bir ile ait RG kayıtları (il eşlemesi doğrulanmış olanlar). */
export function ilKayitlari(il) {
  return KAYITLAR.filter((r) => r.iller.includes(il));
}

/** Kısıt (tahsise kapatma) kayıtları. */
export function kisitKayitlari(il) {
  return ilKayitlari(il).filter((r) => /kapatma|kısıt|kisit/i.test(r.durum));
}

/** Kayıt bulunan illerin alfabetik listesi. */
export function kayitliIller() {
  const set = new Set();
  for (const r of KAYITLAR) for (const il of r.iller) set.add(il);
  return [...set].sort((a, b) => a.localeCompare(b, 'tr'));
}

export const TOPLAM = KAYITLAR.length;
export const KISIT_TOPLAM = KAYITLAR.filter((r) => /kapatma|kısıt|kisit/i.test(r.durum)).length;
export const KAYNAK_NOTU =
  'Bu panel DSİ Resmî Gazete işletme sahası ve tahsise kapatma/kısıt ilanlarını ' +
  'il bazında listeler. "Açık/kapalı/kısıtlı/yasak" biçiminde resmî bir tahsis ' +
  'sınıflaması kamuya açık yayımlanmadığından panel böyle bir sınıflama ÜRETMEZ; ' +
  'yalnızca ilgili resmî ilanı ve linkini gösterir.';
