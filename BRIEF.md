# suharitasi.com — Proje Brief'i
*12 Temmuz 2026*

## Ne
Türkiye'nin su verisini, havzalarını ve su mevzuatını tek haritada birleştiren portal. Türkiye'de örneği yok; DSİ miktar verisi yayınlıyor, kimse veri + kalite + hukuk sentezini tek yerde sunmuyor.

## Neden şimdi
Su Kanunu Taslağı Nisan 2026'da görüşe açıldı, bu yıl yasalaşması bekleniyor — tahsis belgesi, su verimliliği belgesi, idari para cezaları geliyor. Kanun çıktığında binlerce şirkete uyum ihtiyacı doğacak; erken konumlanan kazanır.

## Kim için
Sanayi/OSB/otel/tarım işletmeleri ve hukukçuları, sondaj-arıtma sektörü, su yatırımcıları; ikincil olarak konuya ilgili genel okur.

## Gelir modeli (öncelik sırasıyla)
1. Büroya su hukuku müvekkili çeken otorite vitrini.
2. B2B bölgesel raporlar (5-25k TL bandı).
3. Sondaj/arıtma firmalarına lead-sponsorluk.
4. İleride uyum SaaS'i.

Reklam yok. Site TBB uyumu için "bilgilendirme portalı" tavrında; büro bağlantısı yalnızca künyede ve rehber sonlarındaki tek satırda. "Bize ulaşın, dava alırız" dili asla kullanılmaz.

## Yapı
Menü: Harita / Havzalar / Rehberler / Su Kanunu / Hakkında.
- **Harita:** 25 su havzası, hover'da suyla dolma etkisi, tıklayınca havza sayfası.
- **Havza sayfası:** rezerv-tahsis-risk verisi + hemen altında "Bu havzada hukuki durum" bloğu (kapalı havza kısıtı, yetkili DSİ bölge müdürlüğü, havzaya özgü kısıtlar). Veriyle hukuku aynı ekranda evlendiren bu blok sitenin taklit edilmesi en zor parçası.
- **Rehberler:** pratik süreç sayfaları (kuyu ruhsatı, tahsis belgesi, kaynak suyu kiralama) — SEO omurgası.
- **Su Kanunu:** taslak metin takibi, madde madde analiz, yasalaşma süreci, yükümlülük takvimi.
- **Künye:** "Bu portalın hukuki içeriği Av. Serdar Arslan tarafından hazırlanmaktadır."

## Tasarım
"Derin su" — gece denizi zemini (#04121F), akuamarin ışıma (#4FC3D0), Cormorant italik başlıklar + Manrope gövde. İtkan ilkesi: kusursuz işçilik, cesur sahne — hedef ödül (Awwwards) seviyesi; zengin animasyon, sinematik derinlik ve imza etkileşimler istenir, yasak olan kalabalık değil özensizliktir. Damla ikonu, stok görsel, kurumsal mavi, emoji yasak. Bağlayıcı belge: DESIGN.md.

İstisna — harita adası: sayfa koyu kalır, harita alanı aydınlık hipsometrik atlas estetiğidir (adaçayı deniz, yeşil-hardal-kahve yükselti bantları, krem lejant kartı); ayrıntı DESIGN.md "Harita adası" bölümünde.

## Teknik
- Vanilla JS + Vite; harita MapLibre (harici tile servisi yok); içerik katmanı Astro; hero ileride Three.js. React/Next kullanılmaz.
- Barındırma: Cloudflare Pages (statik, ücretsiz). Site sunucuya yük bindirmez.
- Veri pipeline'ı: Hetzner VPS (2 vCPU/4GB — yeterli; yükseltme tetiği: müvekkil paneli canlı trafiği). Depo: SQLite.
- Domainler: suharitasi.com (ana) + suharitasi.tr (301 → .com). Alındı.
- Proje hafızası: BRIEF.md + CLAUDE.md + DESIGN.md + KAYNAKLAR.md + GUNLUK.md.

## Çalışma disiplini
Acele yok. Her aşamanın yazılı "bitti tanımı" var; karşılanmadan sonraki aşamaya geçilmez. Günlük 3-4 saatlik seanslar; seans başında tek hedef, seans sonunda commit + GUNLUK.md'ye iki satır not.

## Yol haritası
- [x] Aşama 0a — Repo: index (derin su), DESIGN.md, CLAUDE.md, _headers, robots.txt, 404, favicon, og meta.
- [ ] Aşama 0b — Yayın: Gmail 2FA, Cloudflare hesabı, nameserver taşıma, Pages deploy, .tr→.com 301, SSL/başlık testleri (SSL Labs A+, securityheaders.com yeşil), Search Console + sitemap.
- [x] Harita prototipi — il GeoJSON'uyla etkileşim mekaniği (hover'da canlanma, bilgi kartı, mobil dokunma). İller geçici; havza sınırları bulununca veri değişir, mekanik kalır.
- [x] Harita v2 — koyu rölyef + su/etkileşim katmanları
- [ ] **Harita v3 — atlas boyaması + su atmosferi (şu an)**
- [ ] Aşama 1 — Derin kazı: GitHub + açık veri + literatür (havza GeoJSON, DSİ/MGM araçları, MODFLOW ekosistemi, uydudan su tespiti, OpenAlex/DergiPark). Çıktı: KAYNAKLAR.md. Bitti tanımı: her veri kaleminin doğrulanmış kaynağı ve lisans notu var.
- [ ] Aşama 2 — Veri modeli + pipeline: havza şeması, SQLite, ilk DSİ/SYGM çekimleri.
- [ ] Aşama 3 — Gerçek havza haritası: 25 havza + rezerv/tahsis/risk katmanları.
- [ ] Aşama 4 — Hukuk/içerik katmanı: rehberler, Su Kanunu merkezi, havza hukuk blokları (Serdar'ın kalemi).
- [ ] Aşama 5 — Hero (Three.js terrain) + cila → yayın.

## Riskler
- Su Kanunu gecikirse talep dalgası ötelenir — maliyet düşük, pozisyon bozulmaz.
- Havza GeoJSON'u hazır bulunamazsa DSİ kaynaklarından türetilir (Aşama 1 çözer).
- Tek kişilik yürütme — panzehiri disiplin dosyaları ve bitti tanımları.
