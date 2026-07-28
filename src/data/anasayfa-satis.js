// ANA SAYFA SATIŞ KATMANI — U1 (satis-uygula briefi, 2026-07-28).
// Metinler rapor/satis/BIRLESIK-SATIS-RAPORU.md'den HARFIYEN alınmıştır
// (H1: R2/Bly-Question kategorisi; alt satır: R3/master formula). Yeniden
// yazılmaz, "iyileştirilmez" — brief şartı.
//
// SAYI DİSİPLİNİ (düzeltilmiş brief eki): cümledeki 472 bugünkü ölçülü
// değerdir. Cümle SABİT durur (harfiyen şartı) ama aşağıdaki bekçi, sayıyı
// her build'de veriden SAYIP cümledekiyle karşılaştırır. Veri değişirse
// build DÜŞER ve onaylı cümlenin bilinçli güncellenmesi gerekir — sessiz
// bayatlama da, onaysız metin değişimi de imkânsız.
import { SAYILAR } from './kapi.js';

export const HERO_H1 = 'Kuyunuz için ruhsat mı lazım, ceza mı geldi?';

export const HERO_ALT =
  'Kuyunuzun ilindeki 472 kütleden hangisinde olduğunu bilen avukatla ' +
  'konuşun — tahminle değil, resmî veriyle.';

// — Bekçi: cümledeki sayı == veriden sayılan değer —
{
  const m = /(\d+) kütleden/.exec(HERO_ALT);
  if (!m) throw new Error('anasayfa-satis: HERO_ALT içinde "N kütleden" kalıbı bulunamadı.');
  if (Number(m[1]) !== SAYILAR.kutleToplam) {
    throw new Error(
      `anasayfa-satis: onaylı cümledeki kütle sayısı (${m[1]}) veriden sayılan ` +
      `değerle (${SAYILAR.kutleToplam}) çelişiyor. Veri değişti — cümle ancak ` +
      `bilinçli kararla güncellenebilir (kaynak: rapor/satis/, R3-Line1).`
    );
  }
}
