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
import havzaVeri from '../../data/havza-veri.json';

export const HERO_H1 = 'Kuyunuz için ruhsat mı lazım, ceza mı geldi?';

// 26.08.2026 kullanıcı talimatı (hero düzeltmesi): çağrı dili kaldırıldı,
// yerine veri-envanteri cümlesi. Dört sayı yazılmadan önce veriden
// DOĞRULANDI: 472 = yas-kutleleri toplamı · 25 = havza-veri.json havzaları
// (= 25 havza sayfası = geojson 25 feature) · 419 = isletme-sahalari
// 109 başlık + 310 pasaj · 1963 = en eski rg_tarih yılı (419/419 tarihli).
export const HERO_ALT =
  "472 yeraltısuyu kütlesi, 25 havza ve 1963'e uzanan 419 Resmî Gazete " +
  'kaydı — hepsi kaynağı gösterilmiş tek haritada.';

// — Bekçi: cümledeki DÖRT sayı == veriden sayılan değerler (sayı disiplini
//   aynen sürer; veri değişirse build DÜŞER, cümle bilinçli güncellenir) —
{
  const m = /^(\d+) yeraltısuyu kütlesi, (\d+) havza ve (\d+)'e uzanan (\d+) Resmî Gazete/.exec(HERO_ALT);
  if (!m) throw new Error('anasayfa-satis: HERO_ALT dört-sayı kalıbına uymuyor.');
  const beklenen = [
    ['kütle', Number(m[1]), SAYILAR.kutleToplam],
    ['havza', Number(m[2]), Object.keys(havzaVeri.havzalar).length],
    ['ilk RG yılı', Number(m[3]), SAYILAR.rgYilIlk],
    ['RG kaydı', Number(m[4]), SAYILAR.rgToplam],
  ];
  for (const [ad, cumledeki, sayilan] of beklenen) {
    if (cumledeki !== sayilan) {
      throw new Error(
        `anasayfa-satis: onaylı cümledeki ${ad} (${cumledeki}) veriden sayılan ` +
        `değerle (${sayilan}) çelişiyor. Veri değişti — cümle ancak ` +
        `bilinçli kararla güncellenebilir (kullanıcı talimatı 26.08.2026).`
      );
    }
  }
}
