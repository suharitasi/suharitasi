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
// ETİKET DÜRÜSTLÜĞÜ: hedef etiketleri mevcut doğrulanmış içerikten türetilir
// (TamEkranMenu künyeleri + sayfaların gerçekten taşıdığı bölümler) — yeni
// iddia üretilmez.
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
    // 375'te ölçüldü: "KUYU TAŞIMA" ile soru metni 254px istiyor, 235px yer
    // var → 19px kırpılıyordu (7 soruda tek kırpılan). Etiket kısaltıldı.
    etiketMobil: 'TAŞIMA',
  },
  {
    soru: 'Ruhsatsız kuyu cezası aldım, ne yapmalıyım?',
    hedef: '/rehberler/kuyu-ruhsati/',
    etiket: 'REHBER · KUYU RUHSATI',
    etiketMobil: 'KUYU RUHSATI',
  },
  {
    // 23.07 kullanıcı kararı: hedef /harita/ değil /havzalar/. Gerekçe: baraj
    // doluluk verisi havza sayfalarındadır (BarajDoluluk bileşeni,
    // /havzalar/<slug>/ — canlı kanıt: "Baraj doluluk — günlük kayıt"),
    // /harita/ panelinde YOKTUR. Etiket artık gerçeği gösteriyor.
    soru: 'Barajlarımızda ne kadar su var?',
    hedef: '/havzalar/',
    etiket: 'HAVZALAR · BARAJ DOLULUĞU',
    etiketMobil: 'BARAJ DOLULUĞU',
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

// Build-time assert: sessiz hata yasağı.
// v3 (soru güvertesi, 2026-07-23): eski "döngüde komşu aynı hedef olamaz"
// kuralı R2 iki-yuvalı süzülen şerit içindi; şerit KALKTI. Güvertede 7 soru
// TAM LİSTE olarak aynı anda görünür ve iki soru aynı sayfaya (ör. iki
// /rehberler/kuyu-ruhsati/) gitmesi MEŞRUdur (farklı soru, tek doğru hedef).
// Bu yüzden komşuluk assert'i geçersizleşti. Yerine: her soru gerçek bir yerel
// yola ("/..." ile başlayan) çözülüyor mu + zorunlu alanlar tam mı.
for (const s of SORULAR) {
  for (const alan of ['soru', 'hedef', 'etiket', 'etiketMobil']) {
    if (!s[alan]) throw new Error(`anasayfa-sorular: "${s.soru ?? '?'}" — zorunlu alan "${alan}" boş.`);
  }
  if (!s.hedef.startsWith('/')) {
    throw new Error(`anasayfa-sorular: "${s.soru}" hedefi yerel yol değil (${s.hedef}).`);
  }
}
if (SORULAR.length !== 7) {
  throw new Error(`anasayfa-sorular: 7 soru bekleniyor, ${SORULAR.length} bulundu.`);
}
