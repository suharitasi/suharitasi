// FAZ 7 AŞAMA 2 — persona (sektör kapısı) veri katmanı.
// TEK KAYNAK: data/lead/persona.json (AŞAMA 0'da doğrulanmış). Bu modül
// slug + build-time assert sağlar; içerik sayfaları buradan türetir.
// Sessiz hata yasağı: eksik/yanlış alan build'i DÜŞÜRÜR (assert), sessizce
// kaybolmaz. Uydurma yasağı: yeni yükümlülük/tarih ÜRETİLMEZ — yalnız JSON'dan.
import veri from '../../data/lead/persona.json';

const TR_ASCII = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
                   Ç: 'c', Ğ: 'g', I: 'i', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u' };

export function personaSlug(ad) {
  return ad
    .split('')
    .map((c) => TR_ASCII[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// tr-TR tarih: "2029-12-27" → "27 Aralık 2029"
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz',
               'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export function tarihTR(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  if (!m) return null;
  return `${Number(m[3])} ${AYLAR[Number(m[2]) - 1]} ${m[1]}`;
}

// Zorunlu alan denetimi (assert) — eksikse build düşer.
const ZORUNLU = ['ad', 'kaynak', 'yukumluluk', 'sonTarihDurum', 'dayanak', 'ilgiliIcerik'];
const slugler = new Set();

export const personalar = veri.personalar.map((p, i) => {
  for (const alan of ZORUNLU) {
    if (p[alan] == null) throw new Error(`persona[${i}] "${p.ad ?? '?'}": zorunlu alan "${alan}" yok.`);
  }
  const slug = personaSlug(p.ad);
  if (slugler.has(slug)) throw new Error(`persona slug çakışması: "${slug}" (${p.ad}).`);
  slugler.add(slug);
  // sonTarih doğrulandıysa geçerli ISO olmalı (aksi halde tarih gösterilmez).
  const sonTarihMetni = p.sonTarihDurum === 'dogrulandi' ? tarihTR(p.sonTarih) : null;
  if (p.sonTarihDurum === 'dogrulandi' && !sonTarihMetni)
    throw new Error(`persona "${p.ad}": sonTarihDurum=dogrulandi ama sonTarih geçersiz (${p.sonTarih}).`);
  // brif 2.5 (10.10.2026): NACE Ek-2 faaliyetleri ayrı sayfa değil, /durumum/ tablosunda bir satır.
  const yol = p.kaynak === 'nace-ek2' ? `/durumum/#nace-${p.nace}` : `/durumum/${slug}/`;
  return { ...p, slug, sonTarihMetni, yol };
});
export const sayfaliPersonalar = personalar.filter((p) => p.kaynak !== 'nace-ek2');

export const yonetmelik = veri.yonetmelik;
export const naceEk2 = veri.naceEk2;
