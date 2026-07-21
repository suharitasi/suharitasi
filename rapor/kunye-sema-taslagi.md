# ORGANIZATION / LEGALSERVICE JSON-LD TASLAĞI
*ODUL-USTU FAZ 7 AŞAMA 1 · madde 10 · alan değerleri [KULLANICI] · uygulama onayla*

**Bağlam:** DİL NOTU ile TBB-çekingen kısıt gevşedi → büro kimliği/hizmet
şeması artık eklenebilir. Aşağıdaki taslak `hakkinda` sayfasına (ve site geneli
`@graph`'a) girecek; **alan değerleri [KULLANICI] işaretli BOŞTUR** — büro
bilgilerini kullanıcı verir, sonra uygulanır. Uydurma yasağı: ad/tel/adres
Claude Code tarafından DOLDURULMAZ.

## Mevcut durum
Sayfalarda `Organization` (#kurum) + `WebSite` (#site) şeması VAR (Sayfa.astro).
`LegalService` YOK. Bu taslak `LegalService` + genişletilmiş iletişim ekler.

## Taslak (@graph parçası)
```json
{
  "@type": "LegalService",
  "@id": "https://suharitasi.com/#hukukburosu",
  "name": "[KULLANICI: Arslan Hukuk Bürosu]",
  "description": "Su hukuku alanında danışmanlık ve dava vekilliği: kuyu ruhsatı, su tahsisi, su verimliliği belgesi uyumu, kaynak suyu, kamulaştırma.",
  "areaServed": { "@type": "Country", "name": "Türkiye" },
  "knowsAbout": [
    "su hukuku", "yeraltı suyu ruhsatı", "su tahsisi",
    "su verimliliği belgesi", "kaynak suyu işletme ruhsatı",
    "baraj kamulaştırması", "jeotermal kaynak ruhsatı"
  ],
  "founder": { "@type": "Person", "name": "[KULLANICI: Av. Serdar Arslan]" },
  "url": "https://suharitasi.com/hakkinda/",
  "telephone": "[KULLANICI: +90 ...]",
  "email": "[KULLANICI: ...]",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "TR",
    "addressLocality": "[KULLANICI: il/ilçe]",
    "streetAddress": "[KULLANICI: açık adres — gösterim kararı kullanıcıda]"
  },
  "sameAs": ["[KULLANICI: LinkedIn / baro profili / web]"]
}
```

## Notlar / kullanıcı kararları
- **areaServed:** "Türkiye" ulusal portal diliyle uyumlu; il bazlı hedefleme
  isteniyorsa `[il]` eklenir.
- **address gösterimi:** adres sayfada görünsün mü / yalnız şemada mı — karar
  kullanıcıda (madde 10 kullanıcı görevi).
- **telephone/email:** GBP (Google Business Profile) ile tutarlı olmalı (NAP
  tutarlılığı yerel SEO şartı).
- **TBB uyumu:** LegalService şeması bilgilendirme amaçlı; vaat/reklam dili
  içermez (knowsAbout = uzmanlık alanı, "en iyi/garanti" YOK).
- **Uygulama:** değerler gelince Sayfa.astro `@graph`'a eklenir + JSON-LD
  geçerlilik testi + curl kanıtı (AŞAMA 2).
