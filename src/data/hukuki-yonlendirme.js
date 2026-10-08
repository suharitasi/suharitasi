// HUKUKİ YÖNLENDİRME BLOKLARININ GÖRÜNÜRLÜĞÜ (sahip kararı EK-2/3, 08.10.2026).
// AcilDestekBar · CtaBlok · HukukDanismanlik bu tek kuraldan okur. Metinler
// değişmez; yalnız bloğun gösterilip gösterilmeyeceği sayfa ailesine göre
// belirlenir. Menü/altbilgi İletişim bağlantısı ve künye bu kuralın dışındadır.

/** Bu ailelerde hukuki yönlendirme blokları GÖSTERİLMEZ. */
export const KALDIR = [
  '/mevzuat/', '/veri/', '/acik-veri/', '/api-dokumantasyonu/', '/ajan-erisimi/',
  '/havzalar/', '/nehirler/', '/goller/', '/tahmin/', '/sozluk/', '/arsiv/', '/en/',
];

/** Bu ailelerde bloklar KALIR (sahip listesi). */
export const KALSIN = ['/', '/rehberler/', '/kuyu-ruhsati/', '/hizmetler/', '/hizli-danisma/', '/whatsapp/'];

function normalle(yol) {
  let y = String(yol ?? '/').split('?')[0].split('#')[0];
  if (!y.startsWith('/')) y = `/${y}`;
  if (!y.endsWith('/')) y = `${y}/`;
  return y;
}

/** 'kaldir' | 'kalsin' | 'degistirme' — liste dışı aileler mevcut davranışı korur. */
export function hukukiYonlendirme(yol) {
  const y = normalle(yol);
  if (y === '/') return 'kalsin';
  if (KALDIR.some((k) => y.startsWith(k))) return 'kaldir';
  if (KALSIN.filter((k) => k !== '/').some((k) => y.startsWith(k))) return 'kalsin';
  return 'degistirme';
}

/** Blok bu sayfada render edilsin mi? Yalnız 'kaldir' ailelerinde false. */
export function hukukiYonlendirmeGoster(yol) {
  return hukukiYonlendirme(yol) !== 'kaldir';
}
