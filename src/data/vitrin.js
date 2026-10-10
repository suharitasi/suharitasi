// VİTRİN — görünmeyen varlıkların sayım kaynağı (vitrin briefi FAZ 2).
// KURAL: bu dosyada SABİT SAYI YAZILMAZ. Ana sayfa kanıt bandındaki ve
// /arsiv/ sayfasındaki her rakam build anında gerçek dosyalardan SAYILIR;
// veri büyür/küçülürse sayfa kendiliğinden düzelir (kapi.js ile aynı disiplin).
//
// UYDURMA YASAĞI: künye metinleri KAYNAKLAR.md'deki kaynak adlarından ve
// veri dosyalarının kendi `kaynak`/`kunye` alanlarından kurulur; yeni
// jeoloji/hukuk cümlesi yazılmaz.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import yasKutleleri from '../../veri/potansiyel/yas-kutleleri.json';
import kutleIl from '../../veri/potansiyel/kutle-il.json';
import isletme from '../../veri/potansiyel/isletme-sahalari.json';
import { RG_ILAN, RG_SAYIM, RG_ILAN_NOTU } from './rg-kaynak.js';
import zengin from '../../veri/potansiyel/zenginlestirme.json';
import { AKADEMIK_SAYIM } from './potansiyel.js';
import graceTurkiye from '../../data/canli/grace-turkiye.json';
import graceHavza from '../../data/canli/grace-havza.json';
import havzaYas from '../../data/canli/havza-yas.json';
import baraj from '../../data/canli/baraj.json';
import suBirimleri from '../../data/kamu/su-birimleri.json';
import suIslemleri from '../../data/kamu/su-islemleri.json';
import { sayiIle } from './rg-sayi.js';

// KOK, import.meta.url'den TÜRETİLMEZ: bundle'ın dizin derinliği Astro
// sürümüyle değişiyor (5: dist/chunks → ../../ = kök; 7: dist/.prerender/
// chunks → ../../ = dist, ENOENT). Build hep proje kökünden koşar
// (gol-nehir-cografya.js'teki ölçülmüş desenle aynı).
const KOK = process.cwd();

function pozitif(n, ad) {
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`vitrin: "${ad}" sayıya çözülmedi ya da sıfır (${n}) — veri kaybı olabilir.`);
  }
  return n;
}

/** Dizin ağacındaki dosya sayısı; dizin yoksa hata (sessiz sıfır yasak). */
function dosyaSay(gorece) {
  const kok = join(KOK, gorece);
  let n = 0;
  const gez = (d) => {
    for (const g of readdirSync(d, { withFileTypes: true })) {
      const y = join(d, g.name);
      if (g.isDirectory()) gez(y);
      else n++;
    }
  };
  if (!statSync(kok).isDirectory()) throw new Error(`vitrin: ${gorece} dizin değil.`);
  gez(kok);
  return pozitif(n, gorece);
}

// — RG işletme sahası arşivi —
const rgKayitlar = [...isletme.kayitlar, ...RG_ILAN];
const rgToplam = pozitif(rgKayitlar.length, 'RG kaydı');
const rgYillar = rgKayitlar
  .map((k) => /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(k.rg_tarih || ''))
  .filter(Boolean).map((m) => Number(m[3])).sort((a, b) => a - b);
if (rgYillar.length !== rgToplam) {
  throw new Error(`vitrin: ${rgToplam} RG kaydının ${rgYillar.length} tanesi tarihli.`);
}
const rgIlk = rgYillar[0];
const rgSon = rgYillar[rgYillar.length - 1];
const rgIl = pozitif(new Set(rgKayitlar.flatMap((k) => (Array.isArray(k.il) ? k.il : []))).size, 'RG ili');
// Gazete sayısı künyeli kayıt (API alanı + doğrulanmış URL çıkarımı)
const rgSayiliToplam = pozitif(rgKayitlar.filter((k) => sayiIle(k).sayi != null).length, 'sayısı bilinen RG kaydı');

// — YAS kütleleri —
const havzalar = Object.values(yasKutleleri.havzalar);
const havzaPlan = pozitif(havzalar.length, 'havza planı');
const kutleToplam = pozitif(havzalar.reduce((t, h) => t + h.kutleler.length, 0), 'kütle');
const kutleEslesti = pozitif(kutleIl.kutleler.filter((k) => k.durum === 'eslesti').length, 'eşleşmiş kütle');

// — Kurum × işlem matrisi —
const kurumSayisi = pozitif(suBirimleri.kayitlar.length, 'su birimi');
const islemSayisi = pozitif(suIslemleri.islemler.length, 'su işlemi');

// — GRACE —
const graceAy = pozitif(Object.keys(graceTurkiye.seri).length, 'GRACE ayı');
const graceAylar = Object.keys(graceTurkiye.seri).sort();
const graceIlk = graceAylar[0];
const graceSon = graceAylar[graceAylar.length - 1];
const graceHavzaSayisi = pozitif(Object.keys(graceHavza.havzalar).length, 'GRACE havzası');

// — Baraj arşivi (günlük anlık görüntüler) —
const barajGunDizin = readdirSync(join(KOK, 'data/arsiv/baraj'), { withFileTypes: true })
  .filter((g) => g.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(g.name)).map((g) => g.name).sort();
const barajGun = pozitif(barajGunDizin.length, 'baraj arşiv günü');
const barajDosya = pozitif(dosyaSay('data/arsiv/baraj'), 'baraj arşiv dosyası');
const barajSeriGun = pozitif(Object.keys(baraj.gunler).length, 'baraj seri günü');

// — DSİ istatistik arşivi —
const dsiDosya = pozitif(dosyaSay('kaynak/dsi-arsiv'), 'DSİ arşiv dosyası');

// — Havza YAS serisi —
const yasHavza = pozitif(Object.keys(havzaYas.havzalar).length, 'YAS havzası');
const yasYil = pozitif(havzaYas.yillar.length, 'YAS yılı');

// — Zenginleştirme künyeleri —
const oz = zengin.ozet;

/* ——— ANA SAYFA KANIT BANDI ———
   Brief'in ÜÇ ölçülebilir şartı (hepsi aynı anda sağlanmalı):
     (a) başka kaynakta TOPLU bulunmaz — dağınık kaynaktan derlenmiştir;
     (b) kayıt sayısı yüksek (aday havuzunda sıralanır);
     (c) ticari omurgaya (ruhsat / ceza / potansiyel) DOĞRUDAN bağlı.
   Elenenler ve gerekçesi (kayda geçsin diye burada):
     · akademik künye (1.979) — (a) DÜŞER: OpenAlex'te toplu sorgulanabilir.
     · MTA katalog (356)      — (a) DÜŞER: MTA e-ticaret katalogunda toplu.
     · GRACE serisi (254 ay, 2002-04 – 2026-03)  — (a) ve (c) DÜŞER: NASA yayını + ruhsata dolaylı.
     · morfoloji (81 il)      — (c) DÜŞER: türev gösterge, işleme dolaylı bağlı.
   Üç şartı da sağlayan ilk üç, kayıt sayısına göre: kütleler > RG > kurum. */
export const KANIT_BANDI = [
  {
    sayi: kutleToplam,
    birim: 'yeraltı suyu kütlesi',
    metin: `${havzaPlan} yayımlı havza planından derlendi, ${kutleEslesti}'si il sınırına eşlendi.`,
    yol: '/nerede-su-cikar/',
  },
  {
    sayi: rgToplam,
    birim: 'Resmî Gazete kaydı',
    metin: `${rgIlk}-${rgSon} arası yeraltı suyu işletme sahası ilanları; ${rgIl} ile eşlendi.`,
    yol: '/nerede-su-cikar/',
  },
  {
    sayi: kurumSayisi,
    birim: 'su kurumu',
    metin: `${islemSayisi} su işleminde muhatap kurum, mevzuat dayanağıyla eşleştirildi.`,
    yol: '/hangi-kurum/',
  },
];

/* ——— /arsiv/ SETLERİ ———
   Yalnız künye: kaynak adı + kapsam + sayım + erişim biçimi. Editoryal
   metin YAZILMAZ (brief). "erisim" alanı dürüsttür: indirme yoksa
   "yalnız görüntüleme" der ve nerede görüntülendiğini gösterir. */
export const ARSIV_SETLERI = [
  {
    ad: 'Resmî Gazete — yeraltı suyu işletme sahası ilanları',
    kaynak: 'T.C. Resmî Gazete (resmigazete.gov.tr) — başlık araması + ilan/arşiv metninden yeniden ayrıştırma (10.10.2026)',
    kapsam: `${rgIlk}-${rgSon}`,
    sayim: `${rgToplam} kayıt (${isletme.kayitlar.length} başlık + ${RG_ILAN.length} ilan kaydı; ${RG_SAYIM.ilanIlDogrulanamadi} ilan kaydında il doğrulanamadı) · ${rgIl} ile eşlendi · ${rgSayiliToplam}'inde gazete sayısı künyeli`,
    erisim: 'Her kayıt il sayfalarında künyesiyle görüntülenir; kaynak bağlantısı Resmî Gazete arşivine gider.',
    yol: '/nerede-su-cikar/',
  },
  {
    ad: 'Nehir havza yönetim planları — yeraltı suyu kütleleri',
    kaynak: 'T.C. Tarım ve Orman Bakanlığı SYGM — Nehir Havza Yönetim Planları (NHYP) ve YAS ekleri',
    kapsam: `${havzaPlan} yayımlı havza planı`,
    sayim: `${kutleToplam} kütle · ${kutleEslesti}'si il eşlemeli`,
    erisim: 'İl sayfalarında kütle kırılımı tablo olarak görüntülenir.',
    yol: '/nerede-su-cikar/',
  },
  {
    ad: 'Uydu su depolaması anomalisi',
    kaynak: graceTurkiye.kunye.kaynak.replace('GRACE/GRACE-FO', 'yerçekimi uydu ölçümleri'),
    kapsam: `${graceIlk} – ${graceSon}`,
    sayim: `${graceAy} aylık kayıt (Türkiye geneli) · ${graceHavzaSayisi} havza kırılımı`,
    erisim: 'Havza kırılımı havza sayfalarında eğilim grafiği olarak görüntülenir; ülke geneli seri yalnız görüntüleme (indirme yok).',
    yol: '/havzalar/',
  },
  {
    ad: 'Baraj doluluk arşivi (günlük anlık görüntüler)',
    kaynak: baraj.kunye.kaynak,
    kapsam: `${barajGunDizin[0]} – ${barajGunDizin[barajGunDizin.length - 1]}`,
    sayim: `${barajGun} günlük anlık görüntü (${barajDosya} dosya) · işlenmiş seride ${barajSeriGun} gün`,
    erisim: 'Havza sayfalarında güncel doluluk görüntülenir; günlük arşiv yalnız görüntüleme (indirme yok).',
    yol: '/havzalar/',
  },
  {
    ad: 'Havza bazında yeraltı suyu tahsis/rezerv serisi',
    kaynak: havzaYas.kaynak.havzaPotansiyelRezerv.ad,
    kapsam: `${yasYil} yıl`,
    sayim: `${yasHavza} havza`,
    erisim: 'Havza sayfalarında YAS bandında görüntülenir.',
    yol: '/havzalar/',
  },
  {
    ad: 'DSİ istatistik yayınları — yerel arşiv',
    kaynak: 'Devlet Su İşleri Genel Müdürlüğü — resmî su kaynakları istatistik yayınları',
    kapsam: 'Havza künyeleri ve su kaynakları tabloları',
    sayim: `${dsiDosya} dosya`,
    erisim: 'Havza künyeleri havza sayfalarında görüntülenir; arşivin tamamı yalnız kaynak olarak tutulur (indirme yok).',
    yol: '/havzalar/',
  },
  {
    ad: 'Kurum × işlem yetki matrisi',
    kaynak: 'Mevzuat metinleri (ikincil araştırma çıktısı; resmî doğrulama bekliyor) + kurum kuruluş düzenlemeleri',
    kapsam: `${islemSayisi} su işlemi`,
    sayim: `${kurumSayisi} kurum kaydı`,
    erisim: 'Tamamı "Hangi kurum?" sayfasında tablo olarak görüntülenir.',
    yol: '/hangi-kurum/',
  },
  {
    ad: 'Rapor ve yayın künyeleri',
    kaynak: 'MTA e-ticaret katalog metaverisi · OpenAlex API (CC0) · OpenStreetMap/Overpass (ODbL, © OpenStreetMap katkıcıları)',
    kapsam: '81 il',
    // Faz D (08.09.2026): süzgeç sonrası sayı + toplanan; potansiyel.js AKADEMIK_SAYIM.
    sayim: `${oz.mta_kunye_toplam} MTA künyesi (${oz.mta_il_kapsami} il) · ${AKADEMIK_SAYIM.kalan} su konulu açık erişim yayın (${AKADEMIK_SAYIM.il} il; ${AKADEMIK_SAYIM.toplanan} toplanan, alaka süzgeci) · ${oz.osm_spring_toplam} kaynak + ${oz.osm_well_toplam} kuyu işareti`,
    erisim: 'İl sayfalarında künye listeleri olarak görüntülenir.',
    yol: '/nerede-su-cikar/',
  },
];

export const ARSIV_OZET = {
  setSayisi: ARSIV_SETLERI.length,
  rgToplam, rgIlk, rgSon, kutleToplam, havzaPlan, graceAy, barajGun, dsiDosya,
};

// Arşiv sayfasının öz-cevabı — şablon + sayım (≤280 bağlayıcı).
export const ARSIV_OZ_CEVAP = [
  `Sitedeki sayıların dayandığı ${ARSIV_SETLERI.length} veri seti tek listede:`,
  `${rgIlk}'ten bu yana ${rgToplam} Resmî Gazete kaydı, ${havzaPlan} havza planından ${kutleToplam} yeraltı suyu kütlesi,`,
  `${graceAy} aylık uydu serisi ve DSİ istatistik arşivi.`,
  `Her set kaynağı ve kapsamıyla künyelidir.`,
].join(' ');
if (ARSIV_OZ_CEVAP.length > 280) {
  throw new Error(`vitrin: arşiv öz-cevabı ${ARSIV_OZ_CEVAP.length} karakter — 280 sınırı aşıldı.`);
}

/* ——— TAHSİSE KAPATMA / KISIT KAYITLARI (28.07 kullanıcı kararı) ———
   Bu alt küme VITRIN-RAPORU.md §FAZ 3'te ölçülen nedenle il sayfalarına
   BASILMAZ ve İL İDDİASI TAŞIMAZ: kayıtların il ataması pasajlardan türetilmiş
   ve ~%23'ü dayanaksız/sahte çıkmıştır (Van←"A. ÖZALP" bakan imzası,
   Samsun←"Gölü Havzaları" ortak ismi vb.). Kullanıcı kararı: kayıtlar
   il iddiası OLMADAN, tek liste hâlinde /arsiv/ içinde yayımlanır.

   SAHA ADI ALANI KULLANILMADI — ölçüm: kayıtların 0/23'ünde `saha_adi` alanı
   var; pasajdan düzenli ifadeyle çıkarım 11/23 sonuç veriyor ama bunların
   yalnız 6'sı temiz (kalanlar bakan soyadı öneki "ÖZDEMIR/UYSAL" ya da tarih
   parçası taşıyor = %26 temizlik). Türetilmiş alan kendi kaynağına karşı
   %100 doğrulanamıyorsa yayımlanmaz (GUNLUK 28.07 kuralı). Bunun yerine RG
   pasajının KENDİSİ alıntılanır — sitede zaten kullanılan desen
   (IlPotansiyel "RG ilan pasajları … dizgi hatası içerebilir"). */
// 10.10.2026: kaynak v2 ilan kayıtları (il kaynaktan doğrulanmış; rg-kaynak.js).
const kapatmaHam = RG_ILAN.filter((k) => /tahsise kapatma/i.test(k.durum || ''));
if (!kapatmaHam.length) throw new Error('vitrin: tahsise kapatma kaydı bulunamadı.');
for (const k of kapatmaHam) {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(k.rg_tarih || '')) {
    throw new Error(`vitrin: kapatma kaydında geçersiz RG tarihi (${k.rg_tarih}).`);
  }
  if (!k.kaynak_url) throw new Error(`vitrin: ${k.rg_tarih} kapatma kaydında kaynak URL yok.`);
  if (!k.pasaj || k.pasaj.trim().length < 40) throw new Error(`vitrin: ${k.rg_tarih} kapatma kaydında pasaj yok.`);
}
const gunSirala = (t) => t.split('.').reverse().join('');
export const KAPATMA_KAYITLARI = kapatmaHam
  .map((k) => ({
    tarih: k.rg_tarih,
    durum: k.durum,
    url: k.kaynak_url,
    il: k.il,
    ilNotu: k.il_notu || '',
    ilKaynagi: k.il_kaynagi,
    saha: k.saha_adi,
    // Gazete sayısı: ilan kayıtları API'den sayı taşımaz, arşiv URL'sinden
    // türetilir (yöntem + iki bağımsız doğrulama: src/data/rg-sayi.js).
    // Türetilemeyende alan yok — uydurulmaz.
    ...sayiIle(k),
    // Pasaj OLDUĞU GİBİ alınır (kırpma yalnız uzunluk için, sonuna …).
    pasaj: k.pasaj.replace(/\s+/g, ' ').trim().slice(0, 300),
  }))
  .sort((a, b) => gunSirala(b.tarih).localeCompare(gunSirala(a.tarih)));

export const KAPATMA_OZET = {
  sayi: KAPATMA_KAYITLARI.length,
  ilkYil: Number(KAPATMA_KAYITLARI[KAPATMA_KAYITLARI.length - 1].tarih.slice(6)),
  sonYil: Number(KAPATMA_KAYITLARI[0].tarih.slice(6)),
};

// Şerh METNİ tek kaynak: sayfada da, şemada da bu kullanılır — sapmasın.
export const KAPATMA_SERHI =
  RG_ILAN_NOTU + ' ' +
  'Kayıtlar Resmî Gazete ilan ve arşiv sayfalarının metninden derlenmiştir; eski ' +
  'sayıların pasajları dizgi hatası içerebilir. İlan tarihi itibarıyla verilen ' +
  'bilgidir; güncel durum Devlet Su İşleri\'nden teyit edilmelidir.';
