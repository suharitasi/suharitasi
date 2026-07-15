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

// Kurumsal e-posta: kullanıcı kutuyu kurana dek yalnız künyede görünür.
export const EPOSTA = 'bilgi@suharitasi.com';

export const OG_GORSEL = '/og-suharitasi.v1.png';
