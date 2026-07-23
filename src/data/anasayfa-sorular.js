// ANA SAYFA — 7 süzülen soru (brief 23.07, "7 SORU VE HEDEFLERİ: değiştirme yok").
// Soru metinleri ve hedefleri brief'te SABİT; burada yalnız akış SIRASI ve
// hedef etiketleri tanımlanır.
//
// SIRA KURALI (brief "AYNI HEDEF KURALI"): 1440'ta şerit iki yuvaya bölünür ve
// dilim i'de yuvalar (i, i+1 mod 7) sorularını gösterir. Bu yüzden DÖNGÜSEL
// olarak yan yana gelen iki sorunun hedefi AYNI OLAMAZ. Aşağıdaki sıra bu
// koşulu sağlar (kanıt: arac/serit-sira-dogrula.mjs — komşu çift sayısı 7,
// aynı hedefli komşu 0).
//
// ETİKET DÜRÜSTLÜĞÜ: hedef etiketleri mevcut doğrulanmış menü künyelerinden
// türetilir (TamEkranMenu notları) — yeni iddia üretilmez. Örn. baraj doluluk
// verisi havza sayfalarındadır; /harita/ etiketi "SU ATLASI" der, "baraj
// doluluğu" DEMEZ.
// Mobil (≤860px) etiketi kısadır (brief: "REHBER ·" düşer).

export const SORULAR = [
  {
    soru: 'Su nerelerde çıkar?',
    hedef: '/harita/',
    etiket: 'HARİTA · SU ATLASI',
    etiketMobil: 'HARİTA',
  },
  {
    soru: 'Kuyu ruhsatı almak için ne yapmalıyım?',
    hedef: '/rehberler/kuyu-ruhsati/',
    etiket: 'REHBER · KUYU RUHSATI',
    etiketMobil: 'KUYU RUHSATI',
  },
  {
    soru: 'Kuyum kurudu — aynı ruhsatla taşıyabilir miyim?',
    hedef: '/rehberler/kuyu-tasima/',
    etiket: 'REHBER · KUYU TAŞIMA',
    etiketMobil: 'KUYU TAŞIMA',
  },
  {
    soru: 'Ruhsatsız kuyu cezası aldım, ne yapmalıyım?',
    hedef: '/rehberler/kuyu-ruhsati/',
    etiket: 'REHBER · KUYU RUHSATI',
    etiketMobil: 'KUYU RUHSATI',
  },
  {
    soru: 'Barajlarımızda ne kadar su var?',
    hedef: '/harita/',
    etiket: 'HARİTA · SU ATLASI',
    etiketMobil: 'HARİTA',
  },
  {
    soru: 'Su verimliliği belgesi almak zorunda mıyım?',
    hedef: '/durumum/',
    etiket: 'DURUMUM · SEKTÖR KAPISI',
    etiketMobil: 'DURUMUM',
  },
  {
    soru: 'Bölgemde yeraltı suyu azalıyor mu?',
    hedef: '/havzalar/',
    etiket: 'HAVZALAR · HAVZA KÜNYELERİ',
    etiketMobil: 'HAVZALAR',
  },
];

// Build-time assert: sessiz hata yasağı — sıra bozulursa build DÜŞER,
// "aynı hedef yan yana" hatası canlıya sessizce sızmaz.
for (let i = 0; i < SORULAR.length; i++) {
  const a = SORULAR[i];
  const b = SORULAR[(i + 1) % SORULAR.length];
  if (a.hedef === b.hedef) {
    throw new Error(
      `anasayfa-sorular: "${a.soru}" ile "${b.soru}" döngüde komşu ve hedefleri aynı ` +
        `(${a.hedef}). 1440'ta iki yuvada aynı hedef gösterilemez — sırayı değiştirin.`,
    );
  }
}
if (SORULAR.length !== 7) {
  throw new Error(`anasayfa-sorular: 7 soru bekleniyor, ${SORULAR.length} bulundu.`);
}
