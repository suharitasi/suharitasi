// ANA SAYFA HİZMET VİTRİNİ — "Hizmet ve İstihbarat Merkezi" (Adım 1).
// Dört kolonun metni + hedefi TEK KAYNAK. KURAL (DESIGN.md §5, kapi.js deseni):
// metindeki her sayı burada, build anında veriden SAYILIR ve assert edilir.
// Uydurma yasağı: kolon metnindeki rakam, aşağıdaki kaynakla çelişirse build
// DÜŞER; sayı değişince metin ancak bilinçli kararla güncellenir.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { SAYILAR } from './kapi.js';
import naceEk2 from '../../data/lead/nace-ek2.json';
import personaVeri from '../../data/lead/persona.json';

// — Doğrulanmış değerler (tek kaynak) —
const RG_TOPLAM = SAYILAR.rgToplam;        // 419 (109 başlık + 310 pasaj)
const RG_YIL_ILK = SAYILAR.rgYilIlk;       // 1963
const RG_YIL_SON = SAYILAR.rgYilSon;       // 2017 (arşivin bugünkü son yılı)
const NACE_ANA = naceEk2.sayimlar.anaFaaliyet_toplam;        // 31
const NACE_DETAY = naceEk2.sayimlar.detay_yakalanan;         // 90
const YONETMELIK_TARIH =
  personaVeri.yonetmelik?.dogrulanmisSureler?.yesilBelgeSonBasvuru?.tarih; // 2029-12-27
const YONETMELIK_YIL = (YONETMELIK_TARIH || '').slice(0, 4); // 2029

// — Kolon ikonları (elle inline SVG; paket yok) —
export const VITRIN_IKONLARI = {
  dosya:
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>' +
    '<path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>',
  harita:
    '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14"/>' +
    '<path d="M15 6v14"/>',
  takvim:
    '<path d="M3 6h18v15H3z"/><path d="M3 10h18"/><path d="M8 3v4"/>' +
    '<path d="M16 3v4"/><path d="M12 14v3l2 1"/>',
  alarm:
    '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>' +
    '<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
};

export const VITRIN_KOLONLARI = [
  {
    no: '01',
    kicker: 'B2B Hukuki Uyum',
    ad: 'İşletmelere Özel Su Uyum Dosyası',
    metin:
      'NACE sektörünüzü ve ilinizi seçin; yasal izinleri, yaptırım dayanaklarını ' +
      've merci listesini içeren Su Uyum Dosyasını yazdırıp PDF olarak kaydedin.',
    cta: 'Uyum Dosyası Oluştur',
    hedef: '/hizmetler/su-uyum-dosyasi/',
    ikon: 'dosya',
    aksan: '#57BAE0',
  },
  {
    no: '02',
    kicker: 'Tarihi Karar Arşivi',
    ad: `Yeraltı Suyu Kararları Kütüğü (${RG_YIL_ILK}–${RG_YIL_SON})`,
    metin:
      `${RG_TOPLAM} Resmî Gazete kaydını zaman cetvelinde ve il dökümünde yıl ` +
      'yıl inceleyin; arazinizdeki kuyu ve su tahsis kısıtlarını tespit edin.',
    cta: 'Kararları Haritada Gör',
    hedef: '/arsiv/resmi-gazete/',
    ikon: 'harita',
    aksan: '#2E7EA0',
  },
  {
    no: '03',
    kicker: 'Yönetmelik Geri Sayım',
    ad: `Su Verimliliği Uyum Sayacı (${YONETMELIK_YIL})`,
    metin:
      `${NACE_ANA} ana faaliyet ve ${NACE_DETAY} NACE kodu için zorunlu belge ` +
      'takvimi ve kontrol listesi. Takviminize otomatik .ics hatırlatıcısı ekleyin.',
    cta: 'Sektörel Sayacı Aç',
    hedef: '/mevzuat/su-verimliligi-sayaci/',
    ikon: 'takvim',
    aksan: '#C0883A',
  },
  {
    no: '04',
    kicker: 'Bölgesel Su Alarmı',
    ad: 'Kişiselleştirilmiş Su Alarmı',
    metin:
      'Baraj düşüşleri, yeni Resmî Gazete kısıtları ve GRACE uydu rezerv ' +
      'değişimleri anında e-postanıza ve RSS akışınıza gelsin.',
    cta: 'İstihbarata Abone Ol',
    hedef: '/istihbarat/',
    ikon: 'alarm',
    aksan: '#57BAE0',
  },
];

// — Build-time assert: yapı + sayı disiplini (sessiz hata yasağı) —
if (VITRIN_KOLONLARI.length !== 4) {
  throw new Error(`hizmet-vitrini: 4 kolon bekleniyor, ${VITRIN_KOLONLARI.length} bulundu.`);
}
const noSet = new Set();
for (const k of VITRIN_KOLONLARI) {
  for (const alan of ['no', 'kicker', 'ad', 'metin', 'cta', 'hedef', 'ikon']) {
    if (!k[alan]) throw new Error(`hizmet-vitrini: "${k.ad ?? '?'}" — zorunlu alan "${alan}" boş.`);
  }
  if (!(k.hedef.startsWith('/') || k.hedef.startsWith('#')))
    throw new Error(`hizmet-vitrini: "${k.ad}" hedefi yerel yol ya da çapa değil (${k.hedef}).`);
  if (!VITRIN_IKONLARI[k.ikon])
    throw new Error(`hizmet-vitrini: "${k.ad}" ikonu tanımsız (${k.ikon}).`);
  // SÜREKLİLİK: yerel hedefin kaynak sayfası GERÇEKTEN var mı? Sayfa silinir/
  // adı değişirse vitrin kırık link basmasın diye build DÜŞER (kırık link
  // nöbeti kalıcı kontrol maddesi). Çapa (#...) hedefleri bu denetim dışıdır.
  if (k.hedef.startsWith('/')) {
    const rel = k.hedef.replace(/^\//, '').replace(/\/$/, '');
    // Astro build cwd = proje kökü; yol mutlak kurulur (chunk'ta import.meta.url
    // dist'e kaydığı için o kullanılmaz).
    const kaynak = join(process.cwd(), 'src', 'pages', `${rel}.astro`);
    if (!existsSync(kaynak))
      throw new Error(`hizmet-vitrini: "${k.ad}" hedefi için kaynak sayfa yok (${kaynak}).`);
  }
  if (noSet.has(k.no)) throw new Error(`hizmet-vitrini: kolon numarası çakıştı (${k.no}).`);
  noSet.add(k.no);
}
if (!YONETMELIK_TARIH) {
  throw new Error('hizmet-vitrini: Su Verimliliği son başvuru tarihi veriden okunamadı.');
}
{
  const beklenen = [
    ['RG kaydı', String(RG_TOPLAM), VITRIN_KOLONLARI[1].metin],
    ['RG ilk yıl', String(RG_YIL_ILK), VITRIN_KOLONLARI[1].ad],
    ['RG son yıl', String(RG_YIL_SON), VITRIN_KOLONLARI[1].ad],
    ['NACE ana faaliyet', String(NACE_ANA), VITRIN_KOLONLARI[2].metin],
    ['NACE detay kod', String(NACE_DETAY), VITRIN_KOLONLARI[2].metin],
    ['yönetmelik yılı', YONETMELIK_YIL, VITRIN_KOLONLARI[2].ad],
  ];
  for (const [ad, deger, hedefMetin] of beklenen) {
    if (!hedefMetin.includes(deger)) {
      throw new Error(
        `hizmet-vitrini: "${ad}" (${deger}) ilgili kolon metninde yok — ` +
        'veri değişti, metin bilinçli kararla güncellenmeli.'
      );
    }
  }
}
