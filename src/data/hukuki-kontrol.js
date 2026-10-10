// SON HUKUKİ KONTROL (KARARLAR §73, 10.10.2026): önizleme kalktı; sahibin hukuki onayıyla canlıya
// giren hukuki metin taşıyan sayfalarda "Son hukuki kontrol" tarihi yazılır. Tarih tek yerde;
// bir ailenin hukuki metni yeniden kontrol edilince burada güncellenir.
export const SON_HUKUKI_KONTROL = '10.10.2026';

/** Hukuki metin taşıyan sayfa aileleri (yol öneki). '/' yalnız tam eşleşme (ana sayfa). */
export const HUKUKI_AILELER = [
  '/mevzuat/', '/rehberler/', '/emsal-kararlar/', '/kuyu-ruhsati/', '/durumum/', '/hesaplayicilar/',
  '/kuyu-karar-motoru/', '/su-hukuku/', '/sektor/', '/islem-matrisi/', '/hangi-kurum/', '/ilimde-kim-yetkili/',
  '/kapatma-kaydi/', '/kuyu-kisit-sorgu/', '/gizlilik/', '/hakkinda/', '/sozluk/', '/su-kanunu/', '/hizmetler/',
  '/vaka/', '/hizli-danisma/',
];

export function hukukiSayfa(yol) {
  let y = String(yol ?? '/').split('?')[0].split('#')[0];
  if (!y.endsWith('/')) y += '/';
  return HUKUKI_AILELER.some((a) => y.startsWith(a));
}
