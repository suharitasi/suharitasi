// RG SAYI TÜRETİMİ — Resmî Gazete arşiv URL'sinden gazete sayısı.
//
// NEDEN: 419 RG kaydının 310'u (ilan/pasaj taramasından gelenler) `rg_sayi`
// alanı TAŞIMIYOR; 109 başlık kaydında API'den geliyor. Künyeler bu yüzden
// "tarih + sayı" standardını uygulayamıyordu (SIRADAKILER 28.07 iş kalemi).
//
// YÖNTEM: RG arşivinde dosya adı gazete sayısıdır — `/arsiv/11581.pdf` → 11581.
//
// BU BİR ÇIKARIMDIR; iki BAĞIMSIZ kontrolle doğrulandı (28.07 ölçümü):
//   K1 — Zemin doğruluğu: 109 başlık kaydında hem `rg_sayi` (API alanı
//        `resmiGazeteSayisi`) hem `kaynak_url` (API alanı `url`) var. İkisi
//        AYRI alanlardan gelir (arac/rg-tara.py:111 ve :114) — yani kıyas
//        DÖNGÜSEL DEĞİLDİR. Sonuç: 109/109 eşleşti, çelişen 0.
//   K2 — Tarih monotonluğu: gazete sayısı tarihle artar. 109 bilinen çiftte
//        ihlal 0; URL'den türetilen 254 sayının 254'ü bu eğriye oturdu.
//
// REDDEDİLEN YÖNTEM — pasajdan "Sayı: NNNNN" çıkarımı: URL ile örtüşen 30
// kayıtta 29'u uyuştu, 1'i çatıştı (26.07.1977 — URL 16008, pasaj 18001).
// Tarih eğrisi 1977 için ~16000 diyor (18001 ≈ 1983); iki sütunlu taramanın
// OCR'ı sayıyı bozmuş. Tek bir doğrulanamayan çatışma bile alanı
// güvenilmez kılar (GUNLUK 28.07 kuralı) → pasaj çıkarımı KULLANILMIYOR.
//
// K1 HER BUILD'DE YENİDEN KOŞAR (aşağıda): RG arşiv URL şeması değişirse
// ya da veri bozulursa build DÜŞER — çıkarım sessizce yanlışlanmaz.
import isletme from '../../veri/potansiyel/isletme-sahalari.json';

/** Arşiv URL'sinden gazete sayısı; çıkaramazsa null. */
export function rgSayiTuret(kaynakUrl) {
  const m = /\/arsiv\/(\d+)\.pdf(?:$|[?#])/.exec(kaynakUrl || '');
  return m ? Number(m[1]) : null;
}

// — K1: zemin doğruluğu, build-time —
{
  let esles = 0;
  const celisen = [];
  for (const k of isletme.kayitlar) {
    const turetilen = rgSayiTuret(k.kaynak_url);
    if (turetilen == null || k.rg_sayi == null) continue;
    if (Number(turetilen) === Number(k.rg_sayi)) esles++;
    else celisen.push(`${k.rg_tarih}: url=${turetilen} api=${k.rg_sayi}`);
  }
  if (celisen.length) {
    throw new Error(
      `rg-sayi: URL→sayı türetimi zemin doğruluğunda ÇELİŞTİ (${celisen.length} kayıt). ` +
      `RG arşiv şeması değişmiş olabilir; çıkarım yayımlanmamalı.\n  ` + celisen.slice(0, 5).join('\n  ')
    );
  }
  if (esles < 100) {
    throw new Error(`rg-sayi: zemin doğruluğu örneklemi beklenenden küçük (${esles}); veri kaybı olabilir.`);
  }
}

/**
 * Kayda sayı iliştirir. Dönen `sayiKaynak`:
 *   'api'     — kaydın kendi rg_sayi alanı (başlık kayıtları)
 *   'cikarim' — arşiv URL'sinden türetildi (doğrulanmış yöntem)
 *   null      — sayı yok (ilan sayfası URL'si sayı taşımaz)
 */
export function sayiIle(kayit) {
  if (kayit.rg_sayi != null) return { sayi: Number(kayit.rg_sayi), sayiKaynak: 'api' };
  const t = rgSayiTuret(kayit.kaynak_url);
  return t == null ? { sayi: null, sayiKaynak: null } : { sayi: t, sayiKaynak: 'cikarim' };
}
