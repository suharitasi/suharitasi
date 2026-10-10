// RESMÎ GAZETE İŞLETME SAHASI KAYITLARI — TEK KAYNAK (10.10.2026; brif 1.2 / 2.1 / 2.6,
// sahibin 4-A kararı: il eşlemesi tahminle değil resmî metinle).
//
// İki dosya: başlık kayıtları (RG fihrist başlıkları, 1963–1980, isletme-sahalari.json)
// + ilan kayıtları (isletme-sahalari-v2.json: DSİ ilan BLOĞU kaynaktan yeniden
// ayrıştırıldı; il yalnız bloktaki il/ilçe adından, durum yalnız bloktaki hükümden —
// arac/rg-ilan-ayristir.py). Eski pasaj dosyası (isletme-sahalari-ek.json) silinmedi,
// yalnız artık okunmuyor: pencereleri ilgisiz ilanlardan il topluyordu
// (rapor/rg-il-eslemesi-20261010.md).
import ana from '../../veri/potansiyel/isletme-sahalari.json';
import v2 from '../../veri/potansiyel/isletme-sahalari-v2.json';
import { rgGruplari } from './ortak-normalize.js';

// Fihrist başlık kayıtlarının ili de kaynak metinden yeniden türetildi (v2.basliklar; eski il alanı
// eski_il'de saklı). Ana dosya yalnız künye sayımı ve rg-sayi.js zemin doğruluğu için okunur.
export const RG_BASLIK = v2.basliklar.map((b) => ({
  saha_adi: b.saha_adi || '',
  il: Array.isArray(b.il) ? b.il : [],
  ilceler: {},
  durum: b.durum,
  rg_tarih: b.rg_tarih || '',
  rg_sayi: b.rg_sayi ?? null,
  kaynak_url: b.kaynak_url,
  pasaj: '',
  il_kaynagi: b.il_kaynagi,
  il_notu: b.il_notu || '',
  kaynak_turu: 'rg-fihrist-basligi',
  mevzuat_turu: b.mevzuat_turu ?? null,
}));

/** İlan kayıtları, eski pasaj kaydıyla aynı alan adlarında (tüketiciler değişmesin). */
export const RG_ILAN = v2.kayitlar.map((k) => ({
  saha_adi: k.saha_adi || '',
  il: Array.isArray(k.il) ? k.il : [],
  ilceler: {},
  durum: k.durum,
  rg_tarih: k.rg_tarih || '',
  rg_sayi: k.rg_sayi ?? null,
  kaynak_url: k.kaynak_url,
  pasaj: k.pasaj,
  il_kaynagi: k.il_kaynagi,
  durum_dayanak: k.durum_dayanak || '',
  il_notu: k.il_notu || '',
  kaynak_turu: k.kaynak_turu,
  mevzuat_turu: null,
}));

export const RG_HAM = [...RG_BASLIK, ...RG_ILAN];

/** Tekil ilanlar (gazete sayısı + durum); il'siz gruplar ilNotu taşır. */
export const RG_GRUPLAR = rgGruplari(RG_BASLIK, RG_ILAN);
export const RG_ILSIZ = RG_GRUPLAR.filter((g) => !g.il.length);

export const RG_SAYIM = {
  baslik: RG_BASLIK.length,
  ilan: RG_ILAN.length,
  toplam: RG_BASLIK.length + RG_ILAN.length,
  ilanIlDogrulanamadi: RG_ILAN.filter((k) => !k.il.length).length,
  ilanKisit: RG_ILAN.filter((k) => /kapatma|kısıt/i.test(k.durum)).length,
  tekil: 0,
  tekilIlli: 0,
  tekilIlsiz: 0,
  uretim: v2.uretim_tarihi,
};

export const RG_ILAN_NOTU =
  'İl eşlemesi ilan metnindeki il adından ya da ilçe adının resmî ilçe–il dizinindeki ' +
  'karşılığından yapılmıştır; il adı geçmeyen kayıtlar il\'siz listelenir (sınırı ekli haritada olanlar ' +
  'bunu belirterek), tahmin edilmez.';

// — Build-time assert (sessiz hata yasağı): dosya künyesi ile içerik tutarlı —
{
  RG_SAYIM.tekil = RG_GRUPLAR.length;
  RG_SAYIM.tekilIlsiz = RG_ILSIZ.length;
  RG_SAYIM.tekilIlli = RG_GRUPLAR.length - RG_ILSIZ.length;
  if (ana.kayit_sayisi !== RG_BASLIK.length) throw new Error(`rg-kaynak: başlık kaydı künyesi ${ana.kayit_sayisi} ≠ ${RG_BASLIK.length}.`);
  if (v2.sayimlar.kayit !== RG_ILAN.length) throw new Error(`rg-kaynak: ilan kaydı künyesi ${v2.sayimlar.kayit} ≠ ${RG_ILAN.length}.`);
  if (v2.sayimlar.il_dogrulanamadi !== RG_SAYIM.ilanIlDogrulanamadi) throw new Error('rg-kaynak: il doğrulanamadı sayımı künyeyle çelişiyor.');
  const kaynaksiz = RG_HAM.filter((k) => !k.kaynak_url).length;
  if (kaynaksiz) throw new Error(`rg-kaynak: ${kaynaksiz} kaydın resmî kaynak URL'si yok.`);
}
