// Sitenin tek künye kaynağı: JSON-LD, yazar kutusu ve footer buradan beslenir.
// Tek yerde değişir, her sayfada tutarlı çıkar.

export const SITE = 'https://suharitasi.com';
export const SITE_ADI = 'Su Haritası';

export const YAZAR = {
  ad: 'Av. Serdar Arslan',
  // JSON-LD Person.name: unvan alana değil ada gömülmez.
  adSade: 'Serdar Arslan',
  unvan: 'Avukat',
  buro: 'Arslan Hukuk Bürosu',
  buroUrl: 'https://arslanhukuk.tr',
  // Nesnel, davetsiz: TBB reklam yasağı uyumu — hizmet vaadi/çağrı yok.
  // uzmanlik: hazırlayanın kim olduğu zaten söylenmişse tek başına kullanılır
  // (/hakkinda/). bio: kutunun tek başına durduğu yerde tam hali (YazarKutusu).
  uzmanlik: 'Su hukuku, idari yargı ve şirketler hukuku alanlarında çalışan avukat.',
  bio:
    'Su hukuku, idari yargı ve şirketler hukuku alanlarında çalışan avukat. ' +
    'Bu portaldaki hukuki içerik ve mevzuat analizleri kendisi tarafından ' +
    'hazırlanmaktadır.',
};

/* SOSYAL / ATIF ADRESLERİ — JSON-LD `sameAs` tek kaynağı (B4.3, 28.07.2026).
 *
 * NE İŞE YARAR: `sameAs`, arama motorlarına ve AI yanıt motorlarına
 * "bu kurum/kişi başka nerelerde var" der. Aynı varlığın dağınık
 * profillerini tek kimliğe bağlar; atıf ve bilgi paneli için gereken
 * temel sinyaldir.
 *
 * BUGÜN BOŞ — hiçbir profil AÇILMADI (brief kapsamı: altyapı hazırlanır,
 * hesap açılmaz). Boş kaldığı sürece `sameAs` alanı şemaya HİÇ
 * yazılmaz; boş dizi yayımlamak "profilim yok" demektir ve zarar verir.
 *
 * PROFİL AÇILINCA: yalnız bu diziye satır eklenir — Organization ve
 * Person şemaları, künye ve altbilgi buradan beslenir, başka hiçbir
 * dosyaya dokunulmaz.
 *
 * KURAL: buraya YALNIZ sahibi doğrulanmış, canlı ve sitenin konusuyla
 * ilgili adresler yazılır. Var olmayan/terk edilmiş profil `sameAs`'e
 * konursa sinyal güvenilirliğini düşürür (uydurma yasağı).
 *
 * Aday sıralaması (rapor/dagitim-durumu.md §4):
 *   1. LinkedIn şirket sayfası  2. Google Business Profile
 *   3. X (Twitter)  4. YouTube  5. Wikidata kaydı
 */
export const KURUM_SOSYAL: string[] = [
  // ör: 'https://www.linkedin.com/company/suharitasi',
];

export const YAZAR_SOSYAL: string[] = [
  // ör: 'https://www.linkedin.com/in/serdararslan',
];

// Kurumsal e-posta: kullanıcı kutuyu kurana dek yalnız künyede görünür.
export const EPOSTA = 'bilgi@suharitasi.com';

export const OG_GORSEL = '/og-suharitasi.v1.png';

/**
 * VERİ KATALOĞU — Schema.org DataCatalog düğümü (K6, 27.08.2026).
 *
 * Neden: `Dataset.includedInDataCatalog` ve `Observation` düğümleri
 * önceden `#site` (WebSite) düğümüne işaret ediyordu; WebSite bir
 * DataCatalog değildir. Tek kanonik katalog düğümü burada tanımlanır ve
 * ona referans verilir.
 *
 * Alanlar sitenin GERÇEK durumundan türetilmiştir: yayın erişimi
 * ücretsiz, dil tr-TR, sahibi kurum düğümü.
 */
export const VERI_KATALOGU = {
  '@type': 'DataCatalog',
  '@id': `${SITE}/#veri-katalogu`,
  name: `${SITE_ADI} veri kataloğu`,
  url: `${SITE}/kullanilanlar/`,
  description:
    'Türkiye su verisinin kamuya açık kaynaklardan derlenmiş kayıtları: ' +
    'DSİ, SYGM Nehir Havza Yönetim Planları, NASA GRACE/GRACE-FO, EPİAŞ, ' +
    'Copernicus GLO-90 DEM, Resmî Gazete ve OpenStreetMap.',
  inLanguage: 'tr-TR',
  isAccessibleForFree: true,
  publisher: { '@id': `${SITE}/#kurum` },
};
