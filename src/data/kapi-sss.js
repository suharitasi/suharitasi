// GİRİŞ KAPISI — sık sorulanlar (brief 1.2f).
//
// BAĞLAYICI KURAL: buradaki hiçbir cevap YENİ metin değildir. Her cevap
// sitede ZATEN yayımlanmış, doğrulanmış bir sayfadan birebir alınmıştır.
// Yeni hukuk/jeoloji cümlesi yazılmaz, kaynaksız soru eklenmez.
//
// SESSİZ BAYATLAMA KORUMASI: kaynak metin değişir de buradaki kopya eskirse
// kimse fark etmez (KAYNAKLAR.md OpenAlex satırının başına gelen buydu).
// Bu yüzden her alıntı, kaynak dosyanın HAM metnine karşı build anında
// doğrulanır; eşleşme kopunca build DÜŞER, sessizce bayat metin yayımlanmaz.
import { ilPotansiyel } from './potansiyel.js';

// Ham kaynak: bileşenin kendisi (Vite ?raw). Alıntı bu metinde aranır.
const HAM = import.meta.glob('../components/IlPotansiyel.astro', {
  query: '?raw', import: 'default', eager: true,
});
const ilPotansiyelHam = Object.values(HAM)[0];
if (typeof ilPotansiyelHam !== 'string' || !ilPotansiyelHam.length) {
  throw new Error('kapi-sss: IlPotansiyel.astro ham metni okunamadı — alıntılar doğrulanamaz.');
}

// Karşılaştırma için normalize: etiketler düşer, boşluklar tekleşir.
// (JSX metni satır sonlarıyla bölündüğü için düz substring aramaz.)
const norm = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const HAM_NORM = norm(ilPotansiyelHam);

function alinti(metin, nereden) {
  if (!HAM_NORM.includes(norm(metin))) {
    throw new Error(
      `kapi-sss: alıntı kaynağında bulunamadı (${nereden}). ` +
      `Kaynak metin değişmiş olabilir — kopya elle güncellenmeli:\n  "${metin}"`
    );
  }
  return metin;
}

// Dürüstlük etiketi tek üreticiden okunur (kopya değil, aynı nesne).
// İl adı sonucu etkilemez; etiket sabittir.
const DURUSTLUK = ilPotansiyel('Ankara').durustlukEtiketi;
if (!DURUSTLUK || DURUSTLUK.length < 80) {
  throw new Error('kapi-sss: dürüstlük etiketi potansiyel.js üzerinden okunamadı.');
}

/**
 * Sık sorulanlar. `rehberOzCevap` içerik koleksiyonundan (kuyu-ruhsati.md
 * frontmatter `ozCevap`) gelir — sayfada okunur, burada elle yazılmaz.
 */
export function sssListesi(rehberOzCevap) {
  if (typeof rehberOzCevap !== 'string' || rehberOzCevap.length < 120) {
    throw new Error('kapi-sss: kuyu ruhsatı rehberinin öz-cevabı okunamadı.');
  }
  return [
    {
      soru: 'Bu veriler parselimde su çıkıp çıkmayacağını söyler mi?',
      cevap: DURUSTLUK,
      kaynakAd: 'Dürüstlük etiketi — il su potansiyeli blokları',
      kaynakYol: null,
    },
    {
      soru: 'İlimde yeraltı suyu kütlesi kaydı yoksa su yok mu demektir?',
      // Kaynak cümle il adıyla parametrelidir ("… {il} iline eşlenmiş …");
      // burada il adı olmadan, kalan kısım BİREBİR alınmıştır.
      cevap: alinti(
        'Bu, suyun olmadığı anlamına gelmez; ilin havzası için plan ' +
        'yayımlanmamış veya kütle-il eşlemesi doğrulanamamış olabilir.',
        'IlPotansiyel.astro — kütle bulunamadı paragrafı'
      ),
      kaynakAd: 'İl sayfalarındaki su potansiyeli bloğu',
      kaynakYol: null,
    },
    {
      soru: 'Tablolardaki "veri yok" ne anlama geliyor?',
      cevap: alinti(
        'satırları: ilgili havza planında İyi/Zayıf durum sınıflaması ' +
        'yayımlanmamıştır; kütle kaydı yine de resmîdir.',
        'IlPotansiyel.astro — durum dipnotu'
      ).replace(/^satırları:/, '"veri yok" satırlarında'),
      kaynakAd: 'İl sayfalarındaki su potansiyeli bloğu',
      kaynakYol: null,
    },
    {
      soru: 'Arazi biçimi göstergesi neyi ölçer?',
      cevap:
        'Vadi tabanı göstergesi ' +
        alinti('düşük eğim + 1 km pencerede yerel çukurluk',
          'IlPotansiyel.astro — vadi tabanı tanımı') + ' demektir. ' +
        alinti('Sayısal yükseklik modelinden türetilmiş morfolojik ' +
          'göstergedir; akifer varlığının kanıtı değildir.',
          'IlPotansiyel.astro — morfoloji dipnotu'),
      kaynakAd: 'İl sayfalarındaki arazi biçimi bloğu',
      kaynakYol: null,
    },
    {
      soru: 'Kuyu açmak için hangi belgeler gerekir?',
      // Rehberin kendi frontmatter öz-cevabı — sayfada getCollection ile
      // okunur, burada kopyası tutulmaz (bayatlayamaz).
      cevap: rehberOzCevap,
      kaynakAd: 'Kuyu ruhsatı rehberi',
      kaynakYol: '/rehberler/kuyu-ruhsati/',
    },
  ];
}
