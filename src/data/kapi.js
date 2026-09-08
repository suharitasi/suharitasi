// GİRİŞ KAPISI — /nerede-su-cikar/ sayfasının sayı kaynağı (brief FAZ 1).
// KURAL: bu dosyada SABİT SAYI YAZILMAZ. Sayfadaki her rakam burada, build
// anında veri/potansiyel/*.json'dan SAYILIR. Veri büyüyünce sayfa kendiliğinden
// güncellenir; kimsenin metni elle düzeltmesi gerekmez (bayat künye hatasının
// ikizi doğmasın — bkz. KAYNAKLAR.md OpenAlex satırı, 28.07 düzeltmesi).
//
// UYDURMA YASAĞI: burada üretilen cümleler yalnız (i) veri alanlarından ve
// (ii) KAYNAKLAR.md'deki künye adlarından kurulur. Jeoloji/hukuk iddiası
// üretilmez; SSS metinleri mevcut sayfalardan BİREBİR alınır (kapi-sss.js).
import yasKutleleri from '../../veri/potansiyel/yas-kutleleri.json';
import kutleIl from '../../veri/potansiyel/kutle-il.json';
import isletme from '../../veri/potansiyel/isletme-sahalari.json';
import isletmeEk from '../../veri/potansiyel/isletme-sahalari-ek.json';
import zengin from '../../veri/potansiyel/zenginlestirme.json';
import morfoloji from '../../veri/potansiyel/morfoloji.json';
import { yayinlananIller } from './il-profil.js';
import { ilPotansiyel, AKADEMIK_SAYIM } from './potansiyel.js';

function say(n, ad) {
  if (!Number.isFinite(n)) throw new Error(`kapi: "${ad}" sayıya çözülmedi (${n}).`);
  if (n <= 0) throw new Error(`kapi: "${ad}" sıfır/negatif (${n}) — veri kaybı olabilir.`);
  return n;
}

// — 1. katman: yeraltı suyu kütleleri (NHYP) —
const havzalar = Object.values(yasKutleleri.havzalar);
const havzaPlan = say(havzalar.length, 'havza planı');
const kutleToplam = say(
  havzalar.reduce((t, h) => t + h.kutleler.length, 0), 'toplam kütle'
);
const eslesmisKutleler = kutleIl.kutleler.filter((k) => k.durum === 'eslesti');
const kutleEslesti = say(eslesmisKutleler.length, 'eşleşmiş kütle');
const kutleIlKapsami = say(
  new Set(eslesmisKutleler.flatMap((k) => k.iller)).size, 'kütlenin dokunduğu il'
);

// — 2. katman: Resmî Gazete işletme sahaları —
const rgKayitlar = [...isletme.kayitlar, ...isletmeEk.kayitlar];
const rgBaslik = say(isletme.kayitlar.length, 'RG başlık kaydı');
const rgPasaj = say(isletmeEk.kayitlar.length, 'RG pasaj kaydı');
const rgToplam = rgBaslik + rgPasaj;
// Tarih biçimi GG.AA.YYYY — dizge sıralaması YANLIŞ yıl verir (Faz 0 hatası),
// bu yüzden yıl ayrıştırılıp sayısal karşılaştırılır.
const rgYillar = rgKayitlar
  .map((k) => /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(k.rg_tarih || ''))
  .filter(Boolean)
  .map((m) => Number(m[3]))
  .sort((a, b) => a - b);
if (rgYillar.length !== rgToplam) {
  throw new Error(
    `kapi: ${rgToplam} RG kaydının ${rgYillar.length} tanesi tarihli — tarihsiz kayıt aralığı bozar.`
  );
}
const rgYilIlk = say(rgYillar[0], 'RG ilk yıl');
const rgYilSon = say(rgYillar[rgYillar.length - 1], 'RG son yıl');
const rgIlKapsami = say(
  new Set(rgKayitlar.flatMap((k) => (Array.isArray(k.il) ? k.il : []))).size,
  'RG kaydının dokunduğu il'
);

// — 3. katman: arazi biçimi (DEM morfolojisi) —
const morfKaro = say(morfoloji.karo_sayisi, 'DEM karosu');
const morfIl = say(Object.keys(morfoloji.iller).length, 'morfoloji ili');

// — 4. katman: künyeler —
const oz = zengin.ozet;
const mtaKunye = say(oz.mta_kunye_toplam, 'MTA künyesi');
const mtaIl = say(oz.mta_il_kapsami, 'MTA ili');
// Faz D (08.09.2026): sayı artık alaka süzgecinden geçen künyedir; toplanan
// ayrıca yazılır (AKADEMIK_SAYIM, potansiyel.js) — "1.979 yayın" iddiası
// süzgeç sonrası yanlış olurdu.
const akademikKunye = say(AKADEMIK_SAYIM.kalan, 'akademik künye (süzgeç sonrası)');
const akademikToplanan = say(AKADEMIK_SAYIM.toplanan, 'akademik künye (toplanan)');
const akademikIl = say(AKADEMIK_SAYIM.il, 'akademik künye ili');
const osmKaynak = say(oz.osm_spring_toplam, 'OSM su kaynağı');
const osmKuyu = say(oz.osm_well_toplam, 'OSM kuyusu');

// — İl seçici —
const iller = yayinlananIller()
  .map((p) => ({ il: p.il, slug: p.slug, yol: `/kuyu-ruhsati/${p.slug}/` }))
  .sort((a, b) => a.il.localeCompare(b.il, 'tr'));
const ilSayisi = say(iller.length, 'il sayfası');

// — Öz-cevap: U3 (satis-uygula 28.07) — R2-Sayfa2 metni HARFIYEN
// (rapor/satis/02-copy-that-sells.md). Cümledeki sayılar bugünkü ölçülü
// değerlerdir; aşağıdaki bekçiler her build'de veriden sayıp karşılaştırır.
// Veri değişirse build DÜŞER → onaylı cümle ancak bilinçli güncellenir.
// (R3-Line5 komut-kipi kapanışı son cümlede zaten var; ek yapılmadı.)
export const OZ_CEVAP =
  'Nerede su çıkar? Cevap il il, resmî veriyle: 12 havza planından 472 ' +
  "yeraltı suyu kütlesi, 347'si il sınırına eşlendi. 1963'ten bu yana 419 " +
  'Resmî Gazete kaydı tarandı. İlinizi seçin.';
{
  const beklenen = [
    ['havza planı', 12, havzaPlan],
    ['kütle', 472, kutleToplam],
    ['eşleşme', 347, kutleEslesti],
    ['ilk RG yılı', 1963, rgYilIlk],
    ['RG kaydı', 419, rgToplam],
  ];
  for (const [ad, cumledeki, sayilan] of beklenen) {
    if (cumledeki !== sayilan) {
      throw new Error(
        `kapi: onaylı öz-cevaptaki ${ad} (${cumledeki}) veriden sayılan değerle ` +
        `(${sayilan}) çelişiyor — cümle bilinçli kararla güncellenmeli (kaynak: rapor/satis/ R2-Sayfa2).`
      );
    }
  }
}
if (OZ_CEVAP.length > 280) {
  throw new Error(`kapi: öz-cevap ${OZ_CEVAP.length} karakter — 280 sınırı aşıldı.`);
}

// Dürüstlük etiketi: il bloklarındakiyle AYNEN (brief 1.2e). Kopyalanmaz —
// il bloğunu üreten fonksiyondan OKUNUR, böylece etiket orada değişirse
// burası da değişir (iki yerde sapma imkânsız). İl adı etiketi etkilemez.
export const DURUSTLUK_ETIKETI = ilPotansiyel(iller[0].il).durustlukEtiketi;
if (!DURUSTLUK_ETIKETI || DURUSTLUK_ETIKETI.length < 80) {
  throw new Error('kapi: dürüstlük etiketi potansiyel.js üzerinden okunamadı.');
}

// — "Cevap nasıl üretiliyor": dört katman. Her katman KAYNAKLAR.md'deki
//   künyeye bağlıdır; kunye alanı o başlığın birebir adıdır. —
export const KATMANLAR = [
  {
    ad: 'Resmî havza planlarındaki yeraltı suyu kütleleri',
    kunye: 'SYGM Nehir Havza Yönetim Planları (NHYP)',
    kaynakNot: 'tarimorman.gov.tr/SYGM — kamu belgesi, künyeli alıntı',
    olcum: `${havzaPlan} yayımlı havza planı · ${kutleToplam} kütle · ` +
      `${kutleEslesti}'si ${kutleIlKapsami} ilin sınırına eşlendi`,
    aciklama: `Kütlelerin miktar ve kimyasal durum sınıflaması plan verisinden ` +
      `olduğu gibi aktarılır; il ortalaması alınmaz, kırılım listelenir.`,
  },
  {
    ad: "Resmî Gazete'de ilan edilmiş işletme sahaları",
    kunye: 'T.C. Resmî Gazete',
    kaynakNot: 'her kayıt RG tarih + sayı + arşiv URL künyeli',
    olcum: `${rgToplam} kayıt (${rgBaslik} başlık + ${rgPasaj} ilan pasajı) · ` +
      `${rgYilIlk}-${rgYilSon} · ${rgIlKapsami} ile atanmış`,
    aciklama: `Başlık araması ve taranmış arşiv ilanları ayrı tutulur; pasaj ` +
      `kayıtları dizgi hatası içerebildiği için ayrı katmanda gösterilir.`,
  },
  {
    ad: 'Arazi biçimi (sayısal yükseklik modeli)',
    kunye: 'Copernicus GLO-90 DEM',
    kaynakNot: 'ESA/Airbus — atıfla ücretsiz kullanım',
    olcum: `${morfKaro} karo · ${morfIl} il için düşük eğim ve vadi tabanı oranı`,
    aciklama: `Morfolojik göstergedir: düşük eğim ve yerel çukurluk oranını ` +
      `verir, akifer varlığının kanıtı değildir.`,
  },
  {
    ad: 'Rapor ve yayın künyeleri',
    kunye: 'MTA e-ticaret katalog metaverisi · OpenAlex API · OpenStreetMap / Overpass API',
    kaynakNot: 'OpenAlex metadata CC0 · OpenStreetMap ODbL 1.0, © OpenStreetMap katkıcıları',
    olcum: `${mtaKunye} MTA rapor künyesi (${mtaIl} il) · ${akademikKunye} su konulu açık ` +
      `erişim yayın künyesi (${akademikIl} il; ${akademikToplanan} toplanan, alaka süzgecinden geçen basılır) · ` +
      `${osmKaynak} su kaynağı, ${osmKuyu} kuyu işareti`,
    aciklama: `Yalnız künye ve bağlantı basılır; rapor içeriği alınmaz ve ` +
      `DOI/açık erişim bağlantısı olmayan yayın yayımlanmaz.`,
  },
];

// TÜİK kalemi bilerek katman DEĞİL: il kırılımı yayımlanmadığı için sitede
// "veri yok" olarak durur (KAYNAKLAR.md). Boş katman gösterilmez.
export const VERI_YOK_NOTU =
  'Belediye suyunda yeraltı suyu payının il kırılımı TÜİK tarafından ' +
  'yayımlanmadığı için bu kalem "veri yok" olarak durur.';

export const SAYILAR = {
  havzaPlan, kutleToplam, kutleEslesti, kutleIlKapsami,
  rgBaslik, rgPasaj, rgToplam, rgYilIlk, rgYilSon, rgIlKapsami,
  morfKaro, morfIl, mtaKunye, mtaIl, akademikKunye, akademikIl,
  osmKaynak, osmKuyu, ilSayisi,
};

export { iller };
