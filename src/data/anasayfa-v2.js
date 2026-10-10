import { ARAC } from './arac-adlari.js';
// ANA SAYFA v2 (emil + v0 spesifikasyonu, brief 2026-07-27).
// Altı uçuşan soru + altı hizmet kartı + "Veriler" menü rotaları.
// HEDEF KURALI (brief FAZ 1): her hedef build çıktısında (dist) GERÇEKTEN
// var olan bir rotadır; uydurma URL yasak. Birebir sayfası olmayan soru
// için en yakın gerçek sayfa seçildi, gerekçesi yorumda.
// HUKUK KURALI (brief M7b): metinler hizmet TANIMIDIR; hüküm, ceza tutarı,
// madde numarası içermez. Yeni hukuki iddia üretilmez.

// — ALTI SORU (hero'da uçuşan; mobilde dikey liste) —
// Konum/gecikme değerleri v0 spesifikasyonundan (atmosfer, K-1).
export const SORULAR_V2 = [
  {
    // 28.07 karar (kapı briefi 2.1): hedef /nerede-su-cikar/ — bu sorunun
    // TEK kanonik kapısı. Cevap havza değil İL ölçeğinde veriliyor (81 il
    // su potansiyeli bloğu); kapı sayfası ziyaretçiyi kendi iline yollar.
    // [ESKİ] 27.07: /havzalar/ — YAS potansiyeli 25 havza sayfasında da
    // basılıyor, ama havza ızgarası "benim yerimde" sorusunu cevaplamıyordu.
    soru: "Türkiye'de su nerelerde çıkabilir?",
    hedef: '/nerede-su-cikar/',
    ust: '14%', sol: '2%', gecikme: '0s',
  },
  {
    soru: 'Kuyu ruhsatı başvurusu nasıl yapılır?',
    hedef: '/rehberler/kuyu-ruhsati/',
    ust: '17%', sol: '70%', gecikme: '1.2s',
  },
  {
    soru: 'Ruhsatsız kuyu cezası aldım, ne yapmalıyım?',
    hedef: '/rehberler/ruhsatsiz-kuyu-cezalari/',
    ust: '40%', sol: '72%', gecikme: '1.8s',
  },
  {
    soru: 'Kuyum kurudu, çöktü; ne yapmalıyım?',
    hedef: '/rehberler/kuyu-tasima/',
    ust: '62%', sol: '2%', gecikme: '2.4s',
  },
  {
    // Birebir "sondaj" sayfası YOK. Sondaj öncesi hukuki adım (arama
    // belgesi, DSİ süreci) kuyu ruhsatı rehberinde anlatılır — en yakın
    // gerçek sayfa. İki sorunun aynı hedefe gitmesi meşru (güverte emsali).
    soru: 'Sondaj ile alakalı neler yapılmalı?',
    hedef: '/rehberler/kuyu-ruhsati/',
    ust: '66%', sol: '68%', gecikme: '0.8s',
  },
  {
    // "Nerede su var" = mevcut durum → havza künyeleri + baraj doluluğu.
    // Soru 1 (/harita/) potansiyeli, bu soru mevcut envanteri hedefler.
    soru: "Türkiye'de nerede su var?",
    hedef: '/havzalar/',
    ust: '40%', sol: '1%', gecikme: '3.2s',
  },
];

// — ALTI HİZMET KARTI (v0 metinleri; hedefler dist'ten doğrulandı) —
// hedef: null → kart LİNKSİZ (brief: dist'te birebir sayfası olmayan kart).
export const HIZMETLER = [
  {
    ad: 'Kuyu Ruhsatı ve İzinler',
    metin: 'Yeraltı suyu kuyu ruhsatı başvurusu, belge hazırlığı ve DSİ süreçlerinin uçtan uca takibi.',
    hedef: '/rehberler/kuyu-ruhsati/',
    ikon: 'kuyu',
  },
  {
    // 28.07 (kapı briefi 2.2): kart soruyla birlikte /nerede-su-cikar/'a
    // taşındı. Aynı sayfada soru + kart aynı hedefe çıkar — kasıtlı, iki
    // farklı giriş noktası (27.07'de kurulan desen korunuyor, hedef değişti).
    ad: 'Sondaj İşlemleri',
    metin: 'Sondaj öncesi hukuki uygunluk, izin süreçleri ve yükleniciyle sözleşme danışmanlığı.',
    hedef: '/nerede-su-cikar/',
    ikon: 'sondaj',
  },
  {
    ad: 'Yeraltı Suyu Tahsisi',
    metin: 'Su tahsis belgeleri, kullanım hakları ve tahsis miktarına ilişkin itiraz ve düzenlemeler.',
    hedef: '/rehberler/su-tahsisi-oncelik-sirasi/',
    ikon: 'tahsis',
  },
  {
    ad: 'Su Anlaşmazlıkları',
    metin: 'Komşu, sulama birliği ve kurumlarla yaşanan su kullanım uyuşmazlıklarında dava ve uzlaşma.',
    hedef: '/rehberler/kaynak-hakki-komsu-su/',
    ikon: 'uyusmazlik',
  },
  {
    ad: 'İdari Başvuru ve Davalar',
    metin: 'İdari para cezaları, ruhsat iptali ve kurum işlemlerine karşı idari yargıda temsil.',
    hedef: '/rehberler/kuyu-belgesi-iptal-davalari/',
    ikon: 'idari',
  },
  {
    ad: 'Kuruyan / Çöken Kuyular',
    metin: 'Kuyunun kuruması veya çökmesi durumunda hak kaybını önleyecek hukuki adımlar ve tazminat.',
    hedef: '/rehberler/kuyu-tasima/',
    ikon: 'kuruyan',
  },
];

// — DÖRT SÜREÇ ADIMI (v0 metinleri) —
export const SUREC = [
  { no: '01', ad: 'Ön Görüşme',
    metin: 'Durumunuzu dinliyor, belgelerinizi inceliyor ve hukuki tabloyu netleştiriyoruz.' },
  { no: '02', ad: 'Strateji ve Yol Haritası',
    metin: 'Başvuru, uzlaşma veya dava; sizin için en doğru yolu birlikte belirliyoruz.' },
  { no: '03', ad: 'Süreç Takibi',
    metin: 'İdari başvuruları, evrakları ve duruşmaları baştan sona sizin adınıza yürütüyoruz.' },
  { no: '04', ad: 'Sonuç ve Koruma',
    metin: 'Hakkınızı güvence altına alıyor, gelecekteki riskler için de yol gösteriyoruz.' },
];

// — "VERİLER" MENÜSÜ → 4 ANA BAŞLIĞA iNDiRGENDi (04.08.2026 mimari refactor).
//   Eski rotalar (/harita/, /rehberler/, vb.) URL'lerinde hâlâ canlıdır,
//   sadece ana menüden kaldırılmıştır. Alt sayfalardan ve site içi linklerden
//   erişilebilir.
export const VERI_ROTALARI = [
  // BRİF 3.2 + DURAK 1 D (10.10.2026): menü en çok altı madde; araç adları tek kaynaktan.
  // Çıkan bölümler (/rehberler/, /havza-riski/, /tahmin/, /nehirler/, /goller/, /api-dokumantasyonu/)
  // /su-hukuku/ ve /veri/ sayfalarından ve alt bilgiden bağlıdır (ölçüldü). Kuyu Cezası ve Süreler
  // Tebliğ Aldım akışında, Su Hukuku'nda ve alt bilgide. /harita/ brif 2.9 gereği menüde.
  { ad: ARAC.teblig.ad, yol: ARAC.teblig.yol },
  { ad: ARAC.tarla.ad, yol: ARAC.tarla.yol },
  { ad: 'Su Hukuku', yol: '/su-hukuku/' },
  { ad: 'Harita', yol: '/harita/' },
  { ad: 'Veri', yol: '/veri/' },
  { ad: 'İletişim', yol: '/#iletisim' },
];
if (VERI_ROTALARI.length > 6) throw new Error('anasayfa-v2: menü en çok altı madde (brif 3.2).');

// Build-time assert (sessiz hata yasağı): zorunlu alanlar + yerel yol biçimi.
for (const s of SORULAR_V2) {
  for (const alan of ['soru', 'hedef', 'ust', 'sol', 'gecikme']) {
    if (!s[alan]) throw new Error(`anasayfa-v2: "${s.soru ?? '?'}" — zorunlu alan "${alan}" boş.`);
  }
  if (!s.hedef.startsWith('/')) throw new Error(`anasayfa-v2: "${s.soru}" hedefi yerel yol değil.`);
}
if (SORULAR_V2.length !== 6) throw new Error(`anasayfa-v2: 6 soru bekleniyor, ${SORULAR_V2.length} bulundu.`);
for (const h of HIZMETLER) {
  if (!h.ad || !h.metin) throw new Error(`anasayfa-v2: hizmet kartı eksik (${h.ad ?? '?'}).`);
  if (h.hedef !== null && !h.hedef.startsWith('/')) throw new Error(`anasayfa-v2: "${h.ad}" hedefi yerel yol değil.`);
}
if (HIZMETLER.length !== 6) throw new Error(`anasayfa-v2: 6 hizmet bekleniyor, ${HIZMETLER.length} bulundu.`);
for (const r of VERI_ROTALARI) {
  if (!r.yol.startsWith('/')) throw new Error(`anasayfa-v2: Veriler rotası yerel yol değil (${r.ad}).`);
  if (r.yol.includes('pilot')) throw new Error(`anasayfa-v2: noindex pilot rotası Veriler menüsüne giremez (${r.yol}).`);
}
