// GRACE EĞİLİM SINIFLAMASI — TEK KURAL (07.10.2026 denetimi, sahip kararı EK-2/2).
// Önceden üç ayrı yerde üç ayrı sözlük vardı: grace-hesap.js (±0,5 → azalma/sabit/
// toparlanma), akifer-egilim-uret.mjs (±0,5 → "Kritik Düşüş"/Dengeli/Yükseliş) ve
// HavzaPaneli.astro (≤ −1,5 → KRİTİK). Aynı eğim için iki farklı sınıf adı
// basılıyordu (Yeşilırmak −0,66: il sayfasında "Kritik Düşüş", harita panelinde
// kritik değil). Eşikler değişmedi; yalnız tek sözlükte toplandı.
export const ESIK_YON = 0.5;        // cm/yıl — yön eşiği (grace-hesap.js ile aynı)
export const ESIK_KRITIK = -1.5;    // cm/yıl — kritik düşüş eşiği (HavzaPaneli, kullanıcı onayı 21.07.2026)

/** egim (cm/yıl) → { kod, etiket, yon, kritik }.
 *  kod: 'kritik-dusus' | 'dusus' | 'dengeli' | 'yukselis'
 *  yon: 'azalma' | 'sabit' | 'toparlanma' (mevcut tüketicilerin sözlüğü) */
export function egilimSinifi(egim) {
  if (egim == null || Number.isNaN(Number(egim))) return null;
  const e = Number(egim);
  if (e <= ESIK_KRITIK) return { kod: 'kritik-dusus', etiket: 'Kritik düşüş', yon: 'azalma', kritik: true };
  if (e <= -ESIK_YON) return { kod: 'dusus', etiket: 'Düşüş', yon: 'azalma', kritik: false };
  if (e >= ESIK_YON) return { kod: 'yukselis', etiket: 'Yükseliş', yon: 'toparlanma', kritik: false };
  return { kod: 'dengeli', etiket: 'Dengeli', yon: 'sabit', kritik: false };
}

/** Pencere etiketi: aynı gösterge farklı pencerelerle gösterildiğinde açıkça yazılır. */
export function pencereEtiketi(yil) {
  return `${yil} yıllık pencere`;
}
