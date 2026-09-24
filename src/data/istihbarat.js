// KİŞİSEL SU İSTİHBARATI — İL AKIŞLARI (Adım 3, 24.09.2026).
// Her il için: o ile eşlenmiş Resmî Gazete yeraltı suyu kayıtları + ulusal
// mevzuat değişiklik kayıtları. RSS ve e-posta aboneliğinin veri kaynağı.
// UYDURMA YASAĞI: item'lar yalnız doğrulanmış kayıtlardan (rg-zaman.js,
// mevzuat-degisiklik.json) kurulur; "yeni kayıt var" iddiası üretilmez.
import { KAYITLAR, IL_DAGILIM } from './rg-zaman.js';
import { tumIller } from './islem-matrisi.js';
import { ilSlug } from './il-profil.js';
import mevzuatLog from '../../data/kamu/mevzuat-degisiklik.json';

const SITE = 'https://suharitasi.com';

function tarihCoz(ddmmyyyy) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(ddmmyyyy || '');
  if (!m) return null;
  return new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1])));
}

/** Ulusal mevzuat değişiklik item'ları (bugün boş olabilir). */
export function ulusalMevzuatItemlari() {
  return (mevzuatLog.kayitlar || []).map((k) => ({
    title: `Mevzuat değişikliği: ${k.kanun} ${k.madde} (${k.tip})`,
    link: `${SITE}/mevzuat/degisiklikler/`,
    desc: `${k.kanun} ${k.madde} hükmü değişti (${k.tip}). Resmî metin farkı — Su Haritası mevzuat radarı.`,
    date: k.tarih ? new Date(k.tarih) : new Date(),
  }));
}

const IL_RG = new Map(IL_DAGILIM.map((x) => [x.il, x.sayi]));

export const AKISLAR = tumIller().map((il) => {
  const slug = ilSlug(il);
  const kayitlar = KAYITLAR.filter((k) => k.il.includes(il));
  const rgItemlar = kayitlar.map((k) => {
    const yer = [k.il.join(', '), k.ilce.length ? `İlçe: ${k.ilce.join(', ')}` : ''].filter(Boolean).join(' · ');
    return {
      title: `${k.saha || 'Resmî Gazete ilanı'} — ${k.durum}`,
      link: k.kaynak,
      desc: `${yer}. Resmî Gazete ${k.tarih}${k.sayi != null ? ` · Sayı ${k.sayi}` : ''}. Yeraltı suyu işletme sahası kaydı.`,
      date: tarihCoz(k.tarih) || new Date(),
    };
  });
  const sonTarih = rgItemlar.length
    ? new Date(Math.max(...rgItemlar.map((i) => i.date.getTime())))
    : null;
  return { il, slug, rgSayi: IL_RG.get(il) || 0, sonTarih, rgItemlar };
});

export const IL_SAYISI = AKISLAR.length;
export const RG_TOPLAM = KAYITLAR.length;
export const RG_ILLI_TOPLAM = AKISLAR.reduce((t, a) => t + a.rgSayi, 0);
export const KAYITLI_IL_SAYISI = AKISLAR.filter((a) => a.rgSayi > 0).length;

/** Bir ilin RSS item'ları (il kayıtları + ulusal mevzuat), en yeni önce, ≤50. */
export function ilItemlari(il) {
  const a = AKISLAR.find((x) => x.il === il);
  const items = [...(a ? a.rgItemlar : []), ...ulusalMevzuatItemlari()];
  items.sort((x, y) => y.date - x.date);
  return items.slice(0, 50);
}

/** Birleşik akış item'ları (tüm RG kayıtları + ulusal), ≤50. */
export function tumItemlari() {
  const items = KAYITLAR.map((k) => ({
    title: `${k.saha || 'Resmî Gazete ilanı'} — ${k.durum}`,
    link: k.kaynak,
    desc: `${k.il.length ? k.il.join(', ') + '. ' : ''}Resmî Gazete ${k.tarih}${k.sayi != null ? ` · Sayı ${k.sayi}` : ''}.`,
    date: tarihCoz(k.tarih) || new Date(),
  }));
  const birlesik = [...items, ...ulusalMevzuatItemlari()];
  birlesik.sort((x, y) => y.date - x.date);
  return birlesik.slice(0, 50);
}

// — Build-time assert (sessiz hata yasağı) —
{
  if (IL_SAYISI !== 81) throw new Error(`istihbarat: 81 il beklenirken ${IL_SAYISI} bulundu.`);
  const sluglar = new Set(AKISLAR.map((a) => a.slug));
  if (sluglar.size !== IL_SAYISI) throw new Error('istihbarat: il slug çakışması var.');
  if (RG_ILLI_TOPLAM !== IL_DAGILIM.reduce((t, x) => t + x.sayi, 0)) {
    throw new Error('istihbarat: il kayıt toplamı IL_DAGILIM ile çelişiyor.');
  }
}
