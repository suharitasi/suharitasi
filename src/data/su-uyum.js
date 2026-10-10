// İŞLETMEYE ÖZEL SU UYU M DOSYASI — VERİ KATMANI (Adım 4, 24.09.2026).
// Bu modül yalnız DOĞRULANMIŞ kaynakları birleştirir; yeni hukuki cümle
// ÜRETMEZ. Belge metnini istemci (public/s/su-uyum.js) kurar; buradaki sayılar
// ve künyeler build anında okunur ve assert edilir.
//
// ONAY KAPISI (K6): ONAYLANDI=false iken üretilen belge "TASLAK" damgalıdır ve
// sayfa noindex'tir. [SERDAR-HUKUK] onayı sonrası tek satır açılır.
import maddeler from '../../data/kamu/mevzuat-maddeleri.json';
import { EMSAL_YAYIN } from './emsal.js';
import ilKurum from '../../data/il-kurum.json';
import havzaVeri from '../../data/havza-veri.json';
import { personalar } from './persona.js';
import { ISLEMLER, tumIller } from './islem-matrisi.js';
import { KAYITLAR } from './rg-zaman.js';
import { ilSlug } from './il-profil.js';

// [SERDAR-HUKUK] ONAYI VERİLDİ (24.09.2026): bayrak true → sayfa indexlenir,
// sitemap'e girer, üretilen belgedeki "TASLAK" damgası kalkar.
export const ONAYLANDI = true;

// — HUKUKİ ÇERÇEVE: onaylanan 23 künye (metin/künye mevzuat deposundan) —
const CERCEVE_SECIM = [
  ['167', 'Madde 8'], ['167', 'Madde 10'], ['167', 'Madde 11'], ['167', 'Madde 13'], ['167', 'Madde 18'],
  ['YAS Tüzüğü', 'Madde 2'], ['YAS Tüzüğü', 'Madde 3'], ['YAS Tüzüğü', 'Madde 4'],
  ['Su Tahsisleri Yön.', 'Madde 8'], ['Su Tahsisleri Yön.', 'Madde 9'], ['Su Tahsisleri Yön.', 'Madde 10'],
  ['831', 'Madde 1'], ['831', 'Ek Madde 1'],
  ['5393', 'Madde 15'],
  ['5686', 'Madde 4'], ['5686', 'Madde 5'], ['5686', 'Madde 6'],
  ['6200', 'Ek Madde 2'], ['6200', 'Geçici Madde 12'], ['6200', 'Geçici Madde 13'],
  ['2942', 'Madde 1'], ['2942', 'Ek Madde 1'],
  ['2886', 'Madde 1'],
];

export const CERCEVE = CERCEVE_SECIM.map(([kanunKisa, madde]) => {
  const r = maddeler.maddeler.find((x) => x.kanunKisa === kanunKisa && x.madde === madde);
  if (!r) throw new Error(`su-uyum: çerçeve künyesi bulunamadı — ${kanunKisa} ${madde}`);
  return {
    kanunKisa,
    kanun: r.kanun,
    madde,
    baslik: r.baslik || '',
    merci: r.merci || null,
    sure: r.sure || null,
    kaynakUrl: r.kaynakUrl || null,
  };
});

// — FAALİYETLER (42 persona) —
export const FAALIYETLER = personalar.map((p) => ({
  slug: p.slug,
  ad: p.ad,
  kaynak: p.kaynak,
  nace: p.nace || null,
  yukumluluk: p.yukumluluk,
  dayanak: p.dayanak || [],
  sonTarih: p.sonTarih || null,
  sonTarihMetin: p.sonTarihMetni || null,
  ilgiliIcerik: p.ilgiliIcerik || [],
  kapsam: p.sonTarihDurum === 'dogrulandi' ? 'dogrulandi' : 'dogrulanamadi',
}));

// — İŞLEMLER (20) —
export const ISLEMLER_UYUM = ISLEMLER.map((i) => ({
  id: i.id,
  ad: i.ad,
  dayanak: i.dayanak || null,
  yetkili: i.yetkiliKurumlar.map((k) => k.ad),
  kanal: i.basvuruKanali || null,
  rehber: i.ilgiliRehber || null,
}));

// Çekirdek işlemler: her su kullanan işletmeyi ilgilendiren belge/tahsis seti.
export const CEKIRDEK_ISLEM = [
  'yas-arama-belgesi',
  'yas-kullanma-belgesi',
  'yas-islah-tadil-belgesi',
  'su-tahsis-talebi',
  'su-verimliligi-belgesi',
];

// — EMSALLER — yalnız resmî karar arama sunucusunda doğrulanan künyeler (DURAK 1 A-d, 10.10.2026);
// ozet alanı karar metnindeki dava konusu isteminin birebir alıntısıdır (src/data/emsal.js).
export const EMSALLER = EMSAL_YAYIN('https://suharitasi.com');

// — İL ÇERÇEVESİ (81 il) —
const havzaSlugSet = new Set(havzaVeri.havzalar.map((h) => ilSlug(h.ad.replace(/\s*Havzası\s*$/, ''))));
function havzaLink(ad) {
  const s = ilSlug(ad.replace(/\s*Havzası\s*$/, ''));
  return havzaSlugSet.has(s) ? `/havzalar/${s}/` : null;
}

const ilBolgeMap = {};
for (const [no, b] of Object.entries(ilKurum.dsiBolgeleri)) {
  for (const il of b.iller) (ilBolgeMap[il] = ilBolgeMap[il] || []).push({ no, merkez: b.merkez });
}
const ilHavzaMap = {};
for (const [no, h] of Object.entries(ilKurum.havzaIlleri)) {
  for (const il of h.iller) {
    const ad = (havzaVeri.havzalar.find((v) => v.no === no) || {}).ad || `Havza ${no}`;
    (ilHavzaMap[il] = ilHavzaMap[il] || []).push({ no, ad, link: havzaLink(ad) });
  }
}

export const ILLER = {};
for (const il of tumIller()) {
  const rg = KAYITLAR.filter((k) => k.il.includes(il)).map((k) => ({
    tarih: k.tarih,
    saha: k.saha,
    durum: k.durum,
    sayi: k.sayi,
    kaynak: k.kaynak,
    ilce: k.ilce,
  }));
  ILLER[il] = {
    dsi: ilBolgeMap[il] || [],
    havzalar: ilHavzaMap[il] || [],
    suIdaresi: (ilKurum.suIdareleri || {})[il] || null,
    rg,
  };
}

// — Build-time assert (sessiz hata yasağı) —
{
  if (FAALIYETLER.length !== 42) throw new Error(`su-uyum: 42 faaliyet beklenirken ${FAALIYETLER.length} bulundu.`);
  if (ISLEMLER_UYUM.length !== 20) throw new Error(`su-uyum: 20 işlem beklenirken ${ISLEMLER_UYUM.length} bulundu.`);
  if (!EMSALLER.length) throw new Error('su-uyum: doğrulanmış emsal künyesi bulunamadı.');
  if (CERCEVE.length !== CERCEVE_SECIM.length) throw new Error('su-uyum: çerçeve künyesi eksik.');
  const ilSayisi = Object.keys(ILLER).length;
  if (ilSayisi !== 81) throw new Error(`su-uyum: 81 il beklenirken ${ilSayisi} bulundu.`);
  const havzaSluglar = Object.values(ILLER).flatMap((v) => v.havzalar.map((h) => h.link)).filter(Boolean);
  if (!havzaSluglar.length) throw new Error('su-uyum: il-havza bağlantısı üretilemedi.');
  for (const f of FAALIYETLER) {
    if (!f.slug || !f.yukumluluk) throw new Error(`su-uyum: faaliyet eksik — ${f.ad || '?'}`);
  }
}
