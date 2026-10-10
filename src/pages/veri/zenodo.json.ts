// /veri/zenodo.json — ZENODO/DATACITE YÜKLEME METAVERİSİ (Adım 3).
// Amaç: veri setini Zenodo'da DOI ile mühürlemek için hazır metadata.
// UYDURMA YASAĞI: DOI atanmadan identifier yazılmaz; lisans kullanıcı
// tarafından seçilmeden iddia edilmez. Sayılar build-time veriden gelir.
import type { APIRoute } from 'astro';
import { SAYILAR } from '../../data/kapi.js';
import { ANA_SAYI, DETAY_SAYI } from '../../data/su-verimliligi.js';
import { IL_SAYISI } from '../../data/istihbarat.js';

const SITE = 'https://suharitasi.com';

export const GET: APIRoute = () => {
  const metadata: Record<string, unknown> = {
    title: 'Su Haritası — Türkiye Su Verisi ve Su Hukuku Açık Veri Tabanı',
    upload_type: 'dataset',
    description:
      `Türkiye su verisi ve su mevzuatı arşivi. ${SAYILAR.havzaPlan} yayımlı nehir havza ` +
      `yönetim planından ${SAYILAR.kutleToplam} yeraltı suyu kütlesi; ` +
      `${SAYILAR.rgYilIlk}–${SAYILAR.rgYilSon} arası ${SAYILAR.rgToplam} Resmî Gazete ` +
      `yeraltı suyu işletme sahası kaydı; ${IL_SAYISI} il; günlük baraj doluluk arşivi; ` +
      `Su Verimliliği Yönetmeliği Ek-2 için ${ANA_SAYI} ana faaliyet ve ${DETAY_SAYI} ` +
      `NACE kodu. Her kalem kaynağı gösterilmiş biçimde yayımlanır.`,
    creators: [
      { name: 'Arslan, Serdar', affiliation: 'Arslan Hukuk Bürosu' },
    ],
    keywords: ['su hukuku', 'yeraltı suyu', 'Resmî Gazete', 'GRACE', 'baraj doluluk', 'su havzaları', 'Türkiye'],
    access_right: 'open',
    language: 'tur',
    related_identifiers: [
      { identifier: SITE, relation: 'isAlternateIdentifier', scheme: 'url' },
      { identifier: `${SITE}/llms.txt`, relation: 'isDocumentedBy', scheme: 'url' },
    ],
    // 10.10.2026: hukuki son tarih notu metaveriden çıkarıldı (hukuki metin onaysız yayımlanmaz);
    // eski yazılım kaydının DOI'si yeni sürüme yazılmaz — Zenodo yeni sürüme kendi DOI'sini verir.
  };

  const govde = {
    _not:
      'Zenodo yükleme paketi. Yüklemeden önce lisansı seçin ve Zenodo arayüzünde ' +
      'DOI damgalayın; DOI alındığında src/data/doi.js güncellenip bu dosya yeniden üretilir.',
    metadata,
  };
  return new Response(JSON.stringify(govde, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
