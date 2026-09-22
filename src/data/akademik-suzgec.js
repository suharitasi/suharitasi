// AKADEMİK KÜNYE ALAKA SÜZGECİ (karar-kapatma Faz D, 08.09.2026; karar
// dosyası §A seçenek 3). Veri dosyası DEĞİŞMEZ; süzgeç yalnız basım
// katmanında (src/data/potansiyel.js) çalışır — geri alınabilir.
//
// ÖLÇÜT (tekrar üretilebilir, elle seçme yok):
// Başlık + dergi adı normalize edilir (İ/I→i, küçük harf, ı→i, NFKD ile
// aksan atma, [a-z0-9] dışı → boşluk) ve aşağıdaki SU-TERİMİ sözlüğünden en
// az biri KELİME SINIRINDA eşleşirse künye basılır. Sözlük iki kaynaktan:
//   (a) toplama betiğinin sorgu terimleri (arac/akademik-kunye.py:91 —
//       "yeraltı suyu", "hidrojeoloji"; "potansiyel" ve çıplak "yeraltı"
//       veride konu dışı eşleştiği için ALINMADI: ısı pompası / turizm
//       potansiyeli, yeraltı çarşısı / madenciliği),
//   (b) hidroloji-hidrojeoloji alan sözlüğü: su kökü (yalnız Türkçe çekim
//       ekleriyle: suyu/suları/sular/suya/sulu/susuz; sunum/suç/sultan/
//       Şubat/sürdürülebilir EŞLEŞMEZ) ve bileşikleri (yeraltısuyu, atıksu,
//       içmesuyu, akarsu), hidro-/hydro- (hidroterapi/hidrokarbon/hidrojen
//       hariç), water, akifer/aquifer, kuyu, havza/basin, sulama/sulak/
//       irrigation, yağış/yağmur/precipitation/rainfall, kurak/drought,
//       baraj/dam, göl/lake, akarsu/nehir/çay/dere/river/stream/spring/
//       şelale/çağlayan, taşkın/sel/flood, jeotermal/geothermal, karst,
//       kaplıca, drenaj/drainage.
// VERİYLE ELENEN adaylar (tek başına eşleşmeleri konu dışı çıktı): jeoloji,
// iklim, kaynak, kirlilik, sondaj, sediman, deniz, ova, termal (çıplak).
// Sınama: arac/test/akademik-suzgec.test.mjs (sayılar + 4×10 örnek + sınır
// sözcük testi + Python paritesi). Rapor: rapor/08-09-karar-kapatma.md §D.
export const SU_TERIMI = new RegExp(
  '\\b(?:yeralti|atik|icme|tatli|akar)?su(?:y[uau][a-z]*|yla|lar[a-z]*|suz[a-z]*|lu)?\\b'
  // `jen\\b` yerine `jen`: aksi hâlde "hidrojenli" sınır-dışı kalıp eşleşiyordu.
  + '|\\b(?:paleo|jeo|geo)?(?:hidro|hydro)(?!terap|karbon|carbon|jen|gen)[a-z]*\\b'
  // `kuyu` su kuyusu içindir; "kuyumcu/kuyumculuk" (mücevher) dışlanır.
  + '|\\b[a-z]*water[a-z]*\\b|\\b(?:akifer|aquifer)[a-z]*\\b|\\bkuyu(?!mcu|mculuk)[a-z]*\\b'
  + '|\\bhavza[a-z]*\\b|\\bbasins?\\b|\\bsula(?:ma|nan|nmis|nabilir)[a-z]*\\b|\\birrigat[a-z]*\\b|\\bsulak\\b'
  + '|\\byagis[a-z]*\\b|\\byagmur[a-z]*\\b|\\b(?:precipitation|rainfall)[a-z]*\\b'
  + '|\\bkurak[a-z]*\\b|\\bdrought[a-z]*\\b|\\bbaraj[a-z]*\\b|\\bdams?\\b'
  + '|\\bgol(?:u|un|unun|une|unde|unden|ler[a-z]*|de|den|e)?\\b|\\blakes?\\b'
  + '|\\bakarsu[a-z]*\\b|\\bnehir[a-z]*\\b|\\bnehr[a-z]*\\b|\\bcay(?:i|inin|ina|inda|indan|lar[a-z]*)?\\b'
  + '|\\bdere(?:si|sinin|sinde|sine|ler[a-z]*)?\\b|\\b(?:river|stream)s?\\b|\\bsprings?\\b'
  + '|\\bselale[a-z]*\\b|\\bcaglayan[a-z]*\\b|\\btaskin[a-z]*\\b|\\bsel(?:ler[a-z]*|i|in|e|de|den)?\\b|\\bflood[a-z]*\\b'
  + '|\\b(?:jeoterm|geotherm)[a-z]*\\b|\\bkarst[a-z]*\\b|\\bkaplica[a-z]*\\b|\\bdrenaj[a-z]*\\b|\\bdrainage\\b'
);

// Yerel-bağımsız normalizasyon (Türkçe İ/ı tuzağı: 'İ'.toLowerCase() → 'i̇'
// iki kod birimi; 'I'.toLocaleLowerCase('tr') → 'ı' NFKD ile ayrışmaz).
export const suNorm = (s) => String(s ?? '')
  .replace(/I/g, 'i').replace(/İ/g, 'i')
  .toLowerCase().replace(/ı/g, 'i')
  .normalize('NFKD').replace(/\p{M}/gu, '')
  .replace(/[^a-z0-9]+/g, ' ').trim();

/** Künye su konulu mu? (başlık + dergi) */
export function suKonulu(k) {
  return SU_TERIMI.test(suNorm(`${k?.baslik ?? ''} | ${k?.dergi ?? ''}`));
}

/** Basım şartlarının tamamı: baski_uygun, DOI/URL var, başlık boş değil, su konulu. */
export function akademikBasilir(k) {
  return k && k.baski_uygun !== false && Boolean(k.doi || k.url)
    && Boolean(String(k.baslik ?? '').trim()) && suKonulu(k);
}
