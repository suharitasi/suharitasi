// ANA SAYFA SATIŞ KATMANI — U1 (satis-uygula briefi, 2026-07-28).
// Metinler rapor/satis/BIRLESIK-SATIS-RAPORU.md'den alınmıştır. 13.09.2026
// hero güncellemesi (denetim bulgusu 10): H1 yalnız hukuk sorusu değil, veri
// + harita kimliğini de taşır; sayı disiplini bekçisi aynen korunur.
//
// SAYI DİSİPLİNİ (düzeltilmiş brief eki): cümledeki 472 bugünkü ölçülü
// değerdir. Cümle SABİT durur (harfiyen şartı) ama aşağıdaki bekçi, sayıyı
// her build'de veriden SAYIP cümledekiyle karşılaştırır. Veri değişirse
// build DÜŞER ve onaylı cümlenin bilinçli güncellenmesi gerekir — sessiz
// bayatlama da, onaysız metin değişimi de imkânsız.
import { SAYILAR } from './kapi.js';
import havzaVeri from '../../data/havza-veri.json';

// 04.10.2026 (Faz 4 vitrin, sahip talimatı): H1 özellik değil FAYDA odaklı.
// Kanıt cümlesi HERO_ALT'ta kalır (dört sayı bekçisi korunur); H1 kısa ve
// harekete geçiricidir. İddia yok: "kanıt" = sayfa altındaki kaynaklı veri.
export const HERO_H1 = 'Su riskini önceden görün, kararlarınızı kanıta dayandırın';

// Meta description (≤160 karakter; hero alt satırından ayrıdır ki title/desc
// ölçüleri sınırda kalmasın). SEO denetimi title/desc uzunluğunu ölçer.
// 04.10.2026 (KARARLAR §55, sahip talimatı — growth turu): CTR hedefiyle
// CTA'lı meta geri geldi. Sayılar ve kaynak iddiası AYNI veri envanterinden;
// "Ulusal Su Bilgi Sistemi" veri kaynağı olarak YAZILMAZ (USBS entegrasyonu
// yok; NHYP = Nehir Havza Yönetim Planı) — uydurma yasağı.
export const META_ACIKLAMA =
  "Türkiye'nin 25 su havzası, yeraltı suyu verileri ve günlük baraj durumu tek " +
  'haritada. İlinizi seçin; kuraklık eğilimini resmî kaynaklardan sorgulayın.';

// 26.08.2026 kullanıcı talimatı (hero düzeltmesi): çağrı dili kaldırıldı,
// yerine veri-envanteri cümlesi. Dört sayı yazılmadan önce veriden
// DOĞRULANDI: 472 = yas-kutleleri toplamı · 25 = havza-veri.json havzaları
// (= 25 havza sayfası = geojson 25 feature) · 419 = isletme-sahalari
// 109 başlık + 310 pasaj · 1963 = en eski rg_tarih yılı (419/419 tarihli).
export const HERO_ALT =
  "472 yeraltısuyu kütlesi, 25 havza ve 1963'e uzanan 419 Resmî Gazete " +
  'kaydı — hepsi kaynağı gösterilmiş tek haritada. Kuyu ruhsatı, su davası, ' +
  'tahsis ve mevzuat da aynı çatıda: hangi işlem, hangi kurum, hangi süre.';

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
