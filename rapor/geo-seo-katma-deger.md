# TEMİZLİK + SEO/GEO TAM DENETİMİ + KATMA DEĞER — rapor

Brief: `cikti/brief/2026-08-25T03-29-43Z-geo-seo-katma-deger.md`
(düzeltilmiş: `...-duzeltilmis.md`) · Dal: `geo-seo` (worktree
`suharitasi-geo`) · Başlangıç: 2026-08-25T03:30Z · Model: Fable 5 ·
Sınıf: BÜYÜK İŞ (beyan brief'te).

## 0. Denetim + düşman geçişi + amaç özeti (rejim kapısı)

### 0a. Brief denetçisi
- Orijinal koşum: **2 ENGEL + 3 UYARI** (T5 commit+push anılmamış,
  T7 hukuk kapısı anılmamış; T1×2 referans, T6 canlı-koşul).
- Yalnız-ekleme düzeltmesi (E1-E4) sonrası: **ENGEL 0, 2 UYARI.**
  Kalan uyarılar T1 referans uyarısıdır ve E4'te açıklanmıştır:
  `llms.txt` build ÇIKTISIDIR (dist/ + yayında mevcut, repo kökünde
  aranması beklenmez); `rapor/geo-seo-katma-deger.md` bu işin YENİ
  çıktısıdır. Denetim raporları: `cikti/denetim/brief/2026-08-25T03-30-38Z.md`
  ve `...T03-30-58Z.md`.

### 0b. Amaç özeti
- **Amaç:** (A) ölü kurum kaynaklarının onarımı + /su-hukuku/
  kaldırma; (B) 500+ sayfalık sitenin SEO/GEO hazırlığını tarama
  başlamadan tamamlamak (meta, şema, öz-cevap, iç ağ, AI yüzeyi);
  (C) kullanılmayan değerin karar listesi. GSC gerçeği: 168 sayfa
  "keşfedildi — dizine eklenmedi" — B tek başına sıralama getirmez,
  tarama başladığında etkili olacak hazırlıktır.
- **Dokunulmazlar:** hukuki metinler (E2 — hüküm yazılmaz, B7
  düzeltmeleri uygulanmaz) · veri kaydında karşılığı olmayan ifade
  (B4 sert sınır) · renk/font/desen icadı · sayfa ağırlığı artışı ·
  AY İLKESİ (yeni özellik yok) · e-posta gönderimi (C3 yalnız öneri) ·
  A5'te hukuki vaat taşıyan sayfaya 301 yasak.
- **Bitti-tanımı:** A6 kanıt paketi tam · B fazları kapılardan geçti
  + merge + deploy teyidi + canlı `--tam` koşusu · C sıralı listesi
  KARAR YAZMADAN raporda · bu rapor tam.
- **Kanıtlar:** önce/sonra link tablosu · md17/md13/md14/md21
  ölçümleri · sitemap diff ("diğer fark: 0") · canlı 301 ölçümü ·
  sağlık `--tam` çıktısı · öz-cevap sayı bekçisi bağları.

### 0c. Düşman geçişi (D1-D4)
- **D1 — FAIL yolu:** En kritik risk: site-geneli otomatik meta/link
  düzeltmesinin tabanları geriletmesi (md13 kontrast, md14 G1-G6,
  S1, ağırlık) — karşı şart: her faz sonunda kapı listesi koşar, faz
  bağımsız merge edilir, gerileme = faz geri alınır. İkincil FAIL:
  A2'de 200 dönen ama başka yayına giden "yeni adres" (kayıtlı vaka:
  trdizin /318433) — karşı şart: içerik kontrolü zorunlu, başlık/metin
  eşleşmesi kanıt. Üçüncül: B4'te veriden türetme kisvesi altında
  hukuki/hidrolojik ifade sızması — karşı şart: yalnız veri kaydı
  alanları; yazılamayan sayfa öz-cevapsız kalır ve sayılır.
- **D2 — boş çıkabilecek varsayımlar:** (i) "su-kanunu-taslak-pdf"
  izleyici hedefi olarak repoda var mı — koşumda doğrulanacak;
  (ii) GSC sayıları (168+1) kullanıcı beyanı [VERİ-kullanıcı], bu
  ortamdan GSC'ye erişim yok, yeniden ölçülemez — rapora şerhle;
  (iii) **`seo-audit` skill'i KURULU DEĞİL** (ne proje
  `.agents/skills/` ne oturum envanteri; `skills-lock.json`da yok) —
  föydeki 8 skill'den 7'si koşulabilir, seo-audit satırı raporda
  "kurulu değil" olarak kalır, işlevi md16/md7 bekçi ölçütleri +
  diğer skill'lerle karşılanır; (iv) A5'e "nötr 301 hedefi bulunur"
  varsayımı — bulunamazsa brief'in kendi DUR kapısı işler.
- **D3 — değen maddeler:** (i) B5 "her sayfa tematik komşuya bağlanır"
  ↔ "dokunma hedefi kötüleşmez": çözüm — Manisa 7→12 borcu AYNI turda
  kapatılır, önce/sonra md21 ölçümü kanıttır; (ii) B1 "metin veriden
  türetilir" ↔ B4 sert sınır: B1 türetmeleri de B4'ün veri-alanı
  sınırına tabidir; (iii) A5 sayfa düşüşü ↔ "taban gerileme 0" kapısı:
  brief kendisi çözmüş — A5 düşüşü birebir listeyle istisnadır;
  (iv) kopyalanma direnci (bot koruması) ↔ B6 AI bot erişimi:
  CLAUDE.md istisnası açık — arama/AI botları engellenmez, çelişki yok.
- **D4 — yarıda kesilme:** İş `geo-seo` dalında, fazlar kendi içinde
  merge edilebilir; brief + denetim raporları + bu rapor diskte;
  taban anlık görüntüleri değişiklikten ÖNCE alınır (A4). Kesilirse
  main yayında ve sağlıklı kalır; tamamlanmış fazlar kaybolmaz.

### 0d. Oturum açılışı notu
`izleme/SITE-DURUM.md` okundu: **🔴 var** — md17, 4 ölü SYGM dış
bağlantısı (bu işin A bölümünün konusu). 🟡: md21 dokunma (Manisa
7→12, B5'te kapatılacak borç), md16 SEO/GEO 199→207, md18 yeni veri
dosyaları (SIRADAKILER'de kayıtlı).

---

## A. Temizlik ve kaynak onarımı — YAPILDI

### A1. Envanter [VERİ]
Tam dış-link taraması: **1039 benzersiz `<a href>` dış bağlantısı**
(taze worktree build'i, `disLinkleriTopla` + konak-sıralı tam koşum,
400 ms görgü; ham sonuç `cikti/`e değil oturum çalışma dizinine yazıldı,
özet burada). Sonuç: **801 sağlam · 40 tarayıcı-ölü (404) · 198 şüphe**.

40 "ölü"nün otoriter yeniden sınıflaması (handle API + tarayıcı-UA GET):
| Sınıf | Adet | Ayrıntı |
|---|---|---|
| Gerçek ölü — SYGM | 21 | 20 havza koruma eylem planı + Meriç-Ergene NHYP; kaynak: `data/havza-veri.json` + `src/content/havzalar/*.md` (21'i de her iki yerde) |
| Gerçek ölü — kayıtsız DOI | 12 | handle `responseCode:100` (hiç kayıtlı değil; OpenAlex kalıntısı): mcd.00426/24288/52670 · huyuamd.37951/58427/82329 · sdufbed.69661/70687 · gefd.77285 · tjf.80186 · jffiu.60849 (+52670'in handle.net url'ü 500) |
| Gerçek ölü — hedefi ölü DOI | 4 | mta.376765 (→ dergipark ttt/376765 404) · makufebed.206616 · 10.5152/0010 · 10.5152/1100 (ikisi squarespace PDF 404'üne çözülüyor) |
| **Tarayıcı yanlış-pozitifi** | 3 | mcd.386171 · bmre.74700 · mufbed.79713 — nöbetçi UA + HEAD ile 404, tarayıcı UA + GET ile **200 ve başlık birebir**. Değişiklik geri alındı. |

Şüphe (198) sınıflaması [VERİ]: resmigazete ×141 + mevzuat ×22 →
**eksik ara-sertifika zinciri** (kurum sunucusu; `-k` ile 200 +
application/pdf ölçüldü — ziyaretçi tarayıcıları AIA ile açıyor, RG
arızasının ikizi, bizim onaracağımız şey değil) · hdl.handle.net ×18
(örneklemde bir kısmı kalıcı 500 — C listesine izleme önerisi) ·
avesis ×8 (tekrar ölçümde 200, geçici) · doi 5xx ×9.

### A2-A3. Yeni adresler — hepsi İÇERİK KONTROLLÜ [VERİ]
- **SYGM 21 PDF**: kalıp `/SYGM/Belgeler/…` → `/SYGM/BelgelerArsiv/Belgeler/…`
  (kalıbı SYGM'nin kendi Detay sayfası verdi, SayfaId=6). 21/21 yeni adres
  HEAD ile **200 + application/pdf**. `data/havza-veri.json` (21 URL +
  künye `dogrulamaTarihi` 2026-08-25 + not) ve `src/content/havzalar/*.md`
  (21 URL) güncellendi. NOT: `/SYGM/Belgeler/havza tanıtım …` ailesi
  TAŞINMADI (200 ölçüldü) — il-kurum.json'a dokunulmadı.
- **Su Kanunu Taslağı (izleyici hedefi)**: yeni adres aynı kalıpta;
  içerik kanıtı **birebir**: yeni adresin `Last-Modified: Thu, 31 Oct
  2019 08:20:54 GMT` = `izleme/state/su-kanunu-taslak-pdf.lastmod`
  değeriyle aynı (aynı belge). `izleme/hedefler.conf` güncellendi.
- **12 kayıtsız DOI**: künyenin kendi DergiPark sayfası canlı + başlık
  kapsaması 1.0 ölçüldü → `doi` → `doi_olu` taşındı (silinmedi),
  `kunye_notu` eklendi; bağ artık doğrulanmış DergiPark sayfasına.
- **mta.376765**: Türkçe basım (MTA Dergisi) hiçbir adreste
  doğrulanamadı; aynı çalışmanın İngilizce basımı bulundu ve doğrulandı
  (`bulletinofmre/376767`, citation_title birebir; DOI
  10.19111/bulletinofmre.376767 canlı çözülüyor) — künyeye notla yazıldı.
- **makufebed.206616**: DergiPark sayfası bulundu, citation_title birebir.
- **2 İÜC kitabı** (Peyzaj Sulama Tasarımı · Şehir ve Bölge Planlama):
  DOI'ler kayıtlı ama squarespace 404'üne çözülüyor; yayınevi sayfaları
  da 404 (Playwright ile JS'li ölçüldü). **"Kaynak taşındı, yeni adres
  doğrulanamadı (2026-08-25)"** etiketiyle veri kaydında duruyor
  (`url_olu` + `kunye_notu`); sayfa üretim filtresi (`potansiyel.js:98`,
  bağlantısız kaydı zaten dışlar) gereği bu iki künye il sayfalarının
  "akademik yayınlar" listesinden kendiliğinden düştü — veri SİLİNMEDİ.

### A4. İzleyici tabanı [VERİ]
State değeri yeni adresin Last-Modified'ıyla birebir aynı olduğundan
URL değişimi sahte "yeni belge" olayı üretemez; ayrıca taban dosyasına
dokunulmadı. İzleyicinin kendisi Firefox UA kullandığından TBMM
hedefleri onda sağlıklı (nöbetçi-UA 404'leri yanlış alarmdı, ölçüldü).

### A5. /su-hukuku/ kaldırma — YAPILDI [VERİ]
- `src/pages/su-hukuku.astro` → `arsiv/su-hukuku-rota/` (kopya değil
  taşıma; içerik olduğu gibi duruyor + NOT.md).
- 301 hedefi: `/rehberler/ruhsatsiz-kuyu-cezalari/` — en yakın nötr
  içerik: aynı konu (kuyu cezaları) salt mevzuat anlatımı; hukuki vaat
  ölçümü 0 ("avukat/dava aç/itiraz ed" isabeti 0). `_redirects` +
  `izleme/beklenen-301.json` (md3 canlı kanıtını kalıcılaştırır).
- Gelen iç bağlar ÖLÇÜLDÜ: 1046 bağ, 3 kaynak: menü kalemi
  (`anasayfa-v2.js` VERI_ROTALARI → `/rehberler/` kalemiyle değiştirildi,
  menü geometrisi korundu) · ana sayfa CTA kartı (hedef `/rehberler/`,
  metin hedef sayfanın kendi meta-description'ından) · ilce-sorgu bağı
  (kaldırıldı; JS `setT` güncelleyicisi de).
- Kanıt: yerel dist-sun (CSP+_redirects) ölçümü `/su-hukuku/` → **301 →
  /rehberler/ruhsatsiz-kuyu-cezalari/ → 200** · dist'te kalan iç bağ **0** ·
  sitemap diff **tek satır** (`/su-hukuku/` düştü), **diğer fark: 0** ·
  llms.txt 520→519, tek düşen aynı sayfa. CANLI 301 kanıtı deploy
  sonrası bölümde.

### A6. Kanıt paketi ve B tabanı
- A sonrası sayfa: **sitemap 519 URL** (build 522 sayfa = 519 + /404/ +
  noindex 2 pilot). B'nin tabanı budur.
- Yeni dist dış-link kümesi: 1037 benzersiz; **gerçek-ölü kümeden kalan 0**
  (ölçüldü, aile aile grep + küme kesişimi).
- md17/izleyici canlı teyidi deploy sonrası koşulacak (kapı bölümü).
- Tarayıcı yanlış-pozitif dersi (karar maddesi C'de): md17 HEAD-404'te
  GET'e düşmüyor ve nöbetçi UA'sı DergiPark/TBMM'de 404 yiyebiliyor.

---

## B0. Kaynak ve faz kapısı [VERİ — hepsi bu koşumda ölçüldü]

| Ölçüm | Değer |
|---|---|
| A sonrası sayfa | sitemap **519** URL (build 522 = 519 + /404/ + 2 noindex pilot) |
| Build | 10,7 sn duvar / ~16 sn CPU |
| seo-audit + geo-audit (523 sayfa) | ~5 sn |
| İzole faz kapısı (`--hizli --kok <worktree> --taban yerel dist-sun`) | **75 sn**, bellek tavan altı (boş 6441 MB) |
| `--tam` (kayıtlı ölçüm, kaynak yorumu) | 452 sn / 1917 MB |

Sonuç: iş tek oturumda sığar; **fazlar = ayrı commit'ler** (her biri
kendi içinde merge edilebilir), her faz sonunda izole `--hizli` kapısı +
seo/geo denetçileri; kapanışta merge → deploy teyidi → canlı `--tam`.
Zaman aşımı riski yok (en pahalı adım 75 sn'lik kapı).

Faz kapısı TABAN koşusu (A sonrası, düzeltme öncesi): kırmızı 0 ·
sarı 1 (md21 Manisa 7→12 — bilinen borç, B-iv'te kapanacak) · geçti 10 ·
md14 G1-G6 sapma YOK (menü kalemi değişimi tabanı kırmadı) · yeni
su-hukuku 301'leri dahil 6/6 yönlendirme yerelde çalışıyor.

---

## B. SEO/GEO tam denetimi — YAPILDI (faz i-iv, ayrı commit'ler)

### B1-B2. Meta ve başlıklar [VERİ]
- **Ölçüm aracı hatası bulundu ve düzeltildi** (`seo-geo-ortak.mjs`
  metaIcerik/ogEtiket): `content=["']…["']` deseni İLK tırnak türünde
  kesiyordu — "Havzası'ndan" içindeki kesme işareti 94 nehir sayfasında
  sahte "meta-desc-uzunluk" bulgusu üretmişti (gerçek 95 kr, ölçülen 26).
  Falsifikasyon testi kanıtlı. md16 taban sayısı bu yüzden yeniden
  yorumlanmalı (aşağıda taban notu).
- Merkezî meta-description kırpımı `Sayfa.astro`'ya kondu (50-160 bandı,
  cümle→kelime sınırı, metin sayfanın kendi aciklama'sından türetilir).
- durumum başlıkları veriden türetildi (37/42 sayfa 60 altına indi;
  5'i sektör adı gereği 62-68'de kalıyor — ad veridir, kısaltılamaz),
  ilce-sorgu başlığı kendi H1'inden kısaltıldı.
- Sonuç: **SEO bulgusu 303 → 26** (kalan: 16 title-uzun [11'i içerik
  başlığı → karar listesi, 5'i sektör adı] + noindex/404 kalemleri).
- title-tekrar: **0** (519 sayfada başlık benzersizliği tam).

### B3. Yapılandırılmış veri [VERİ]
Sayfa tipi başına @type envanteri çıkarıldı: göl/nehir sayfaları
ŞEMASIZ DEĞİL (BodyOfWater + Place + GeoCoordinates + FAQPage +
PropertyValue tam); rehber Article(+HowTo), havza/durumum/kapatma/
hangi-kurum/nerede FAQPage, il Article, arşiv ItemList; sitewide
Organization + Person + WebSite + BreadcrumbList @graph. json-ld-gecersiz
0. Eklenen: Organization `logo` (mevcut favicon.svg). **speakable
bilinçli eklenmedi**: 16 şablona dokunma + @graph'ta çift WebPage düğümü
kirliliği karşısında zayıf/beta sinyal; öz-cevap zaten
`role="doc-abstract"` ile işaretli. SearchAction eklenmedi (sitede
arama kutusu yok — uydurma yasak). sameAs boş ve DOĞRU (profil yok;
profil açmak C listesinde kullanıcı kararı).

### B4. Öz-cevap [VERİ]
- Öz-cevapsız içerik sayfası: **0** (muaf: ana sayfa — 28.07 kullanıcı
  kararı; noindex pilotlar). "İçerik kararı gerekli" (veriyle
  yazılamayan) listesi: **boş** — tüm içerik sayfalarında öz-cevap var.
- 280 üstü öz-cevap 48 → **12**: il şablonu veriden yeniden türetildi
  (havza adı kısaltma + belge parantezi gövdeye + cümle-düşürme; hiçbir
  yeni coğrafi/hukuki ifade yazılmadı). Kalan 12'nin 11'i ELLE YAZILMIŞ
  içerik özeti (282-298 kr; 10 rehber + vaka/meysu — hukuki metin
  dokunulmazı → karar listesi), 1'i noindex stil-pilot.

### B5. İç bağ ağı [VERİ]
- Mutlak yetim: 3 — üçü de noindex (2 pilot + /kullanilanlar/) → SEO
  yüzeyinde yetim **0**.
- Çift yönlülük ölçüldü: göl 247/247 · nehir 95/95 · il 81/81 ·
  havza 25/25 — **tam**.
- Ortalama gelen bağ 19,3; en zayıf sayfalar: /kapatma-kaydi/ (1 gövde
  bağı), /su-kanunu/mevzuat-kutuphanesi/ ve /taslak-takibi/ (1'er),
  /arsiv/ (2), göl uzun kuyruğu (2'şer, ağ deseni gereği normal).
  Eklenen: kapatma-kaydi ↔ yeralti-suyu-isletme-sahasi rehberi çift
  yönlü tematik bağ (satır-içi metin bağı — dokunma ölçümünden muaf
  desen; kapatma sayfasının gerçek kapsam şerhine sadık metinle).
- **Dokunma borcu kapandı:** `.capraz` bağlarına 44px min-height
  ([il].astro scoped — md14 taban sayfalarına dokunmaz). Kanıt:
  Manisa ihlal **12 → 7 = taban** (375px, DOKUNMA_OLC ile önce/sonra);
  kapı koşusunda "6 sayfada taban korundu (201=201)". Kalan 7, açık
  3a borcudur (90 öğe, ayrı kalem).

### B6. AI/GEO yüzeyi [VERİ]
- robots.txt geo-crawlers matrisiyle birebir: Tier-1 5/5 açık (GPTBot,
  OAI-SearchBot, ChatGPT-User, ClaudeBot+Claude-User+Claude-SearchBot,
  PerplexityBot+Perplexity-User), Tier-2 açık; Bytespider + CCBot
  gerekçeli kapalı (kayıtlı kullanıcı kararı 26.07). Değişiklik gereksiz.
- llms.txt build ürünü, canlıda 200; A5 sonrası 519 sayfa, tek düşen
  su-hukuku.
- Alıntılanabilirlik (geo-citability ölçütleriyle örneklem ölçümü):
  cevap-önce yapı tüm tiplerde (öz-cevap tanım kalıbında, ilk cümle
  kendi kendine yeterli); istatistik yoğunluğu il 5/500k · havza 14/500k
  (rubrik üst bandı); soru-H2 oranı il 6/7, havza 7/10; künyeli iddia
  deseni yerleşik. Mekanik iyileştirme gereksiz — rehber H2'lerinin
  soru biçimine çevrilmesi içerik kararı (C listesinde).

### B7. E-E-A-T (yalnız liste — uygulama YOK, karar maddeleri)
Ölçülen mevcut: yazar kutusu her rehberde (Av. Serdar Arslan + büro +
"içerik kendisi tarafından hazırlanır" beyanı) · Person şeması sitewide
(jobTitle/worksFor/knowsAbout) · içtihat/kaynakça bölümleri · Organization.
Eksik listesi (YMYL çıtasına göre):
1. Görünür güncellik damgası yok; `dateModified` = `datePublished`
   (2026-07-14 sabit) — içerik güncelleme süreci + damga kararı.
2. Person/Organization `sameAs` boş — LinkedIn/GBP/Wikidata profili
   açmak kullanıcı işi (dagitim-durumu §4 kaydıyla uyumlu).
3. Birinci-elden deneyim sinyali (vaka anlatısı, "büromuzda şu dosyada…")
   yok — hukuki iddia/avukat kimliği gerektirir, [SERDAR-HUKUK] kapısı.
4. /hakkinda/ yazar sayfası var; dış doğrulama bağlantısı (baro kaydı,
   yayın listesi) yok — karar.

### B8. Teknik [VERİ]
- Sitemap 519/519 içerik sayfası (+noindex'ler doğru biçimde dışarıda);
  robots tutarlı; sitemap-disi 3 bulgunun 3'ü de noindex — doğru davranış.
- Mobil ana sayfa ağırlığı ÖLÇÜLDÜ (390px, ağ günlüğü): yerel 1,91 MB /
  22 istek; canlı 1,99 MB / 30 istek (ilk 12 sn). Föydeki "3,1 MB"
  bu ölçümde YENİDEN ÜRETİLEMEDİ.
- "Video mobilde iki kez iniyor" iddiası: canlıda aynı mp4'e çoklu istek
  VAR ama içerik tek kez iniyor — fazla istekler 0-baytlık range
  sondaları (sahne2: 3×0 KB + 1×1104 KB). Bu Chromium medya yığınının
  normal davranışı; site kusuru değil, düzeltilecek şey yok. Ağırlık
  artışı: 0 (değişiklikler metin kırpma + birkaç satır CSS).
- Core Web Vitals: canlı --tam koşusunun Lighthouse kalemiyle kapı
  bölümünde raporlanır (son taban: / 99/87).

### md16 taban notu
Araç düzeltmesi (tırnak hatası) md16'nın tarihsel sayımını değiştirir:
eski 199-207 bandının önemli kısmı sahte nehir bulgusuydu. Deploy
sonrası canlı --tam'ın ölçtüğü yeni değer taban yapılır (kapsam-taban
güncellemesi, md18 emsalindeki gibi küçük-iş kaydıyla).

---

## Skill koşumları — hangisi ne dedi (föy zorunluluğu)

| Skill | Durum | Ne dedi / ne yapıldı |
|---|---|---|
| geo-schema | koşuldu | Şema envanteri tipe göre çıkarıldı; göl/nehir ŞEMASIZ DEĞİL (BodyOfWater+Geo+FAQ). Önerilerinden uygulanan: Organization `logo`. Bilinçli uygulanmayan: `speakable` (çift WebPage düğümü kirliliği vs beta sinyal; öz-cevap zaten role=doc-abstract), `SearchAction` (arama kutusu yok — uydurma yasak), `sameAs` doldurma (profil yok; C-listesi). |
| geo-crawlers | koşuldu | robots.txt skill'in azami-görünürlük matrisiyle BİREBİR (Tier-1 5/5 + Claude/Perplexity kullanıcı botları; Bytespider+CCBot gerekçeli kapalı). Değişiklik gerekmedi. |
| geo-citability | koşuldu | Örneklem ölçümü: cevap-önce tanım kalıbı + yüksek istatistik yoğunluğu (il 5/500k, havza 14/500k) + soru-H2'ler zaten yerleşik; mekanik iyileştirme gereksiz. Rehber H2 soru-oranı artışı içerik kararı → C. |
| featured-snippet-optimizer | koşuldu | Kendi ön-koşulu: sıralama 1-5 yoksa uygulanmaz. GSC'de sıfır dizin → bugün uygulanamaz; yapı (soru-H2 + 40-60 kelimelik öz-cevap) snippet-uyumlu. Tarama başlayınca yeniden değerlendirilecek. |
| eeat-audit | koşuldu | Mevcut: yazar kutusu + Person şeması + içtihat/kaynakça. Eksik listesi (YMYL çıtası, UYGULANMADI): görünür güncellik damgası, sabit dateModified, boş sameAs, birinci-elden deneyim anlatısı, dış doğrulama bağı — B7 bölümünde. |
| site-architecture | koşuldu | Hub-and-spoke + kırıntı + URL düzeni ölçütlere uygun; yetim 0, çift yönlülük tam. Bulgu: /goller/ ve /nehirler/ KATEGORİ HUB'I YOK (342 spoke doğrudan; kırıntıda ara halka doğru şekilde linksiz) → C önerisi. |
| content-strategy | koşuldu | Pillar yapısı fiilen mevcut (su hukuku rehberleri · il potansiyeli · hidrografya · mevzuat izleme). Arama-talebi verisi ÖLÇÜLEMİYOR (GSC'de sorgu verisi yok) → C2 kalemleri varsayım etiketiyle sınırlı tutuldu. |
| seo-audit | **KURULU DEĞİL** | Ne proje `.agents/skills/` ne oturum envanterinde (skills-lock.json'da da yok). İşlevi projenin KENDİ ölçerleriyle karşılandı: `arac/seo-audit.mjs` + `arac/geo-audit.mjs` + md16 (bu koşumda araç hatası da bulunup düzeltildi). |

## GSC tarama bütçesi şerhi (föyden, aynen)

GSC: 168 sayfa "keşfedildi — dizine eklenmedi", 1 "tarandı — eklenmedi"
[VERİ-kullanıcı beyanı; bu ortamdan GSC'ye erişim yok, yeniden
ölçülemedi]. Teknik engel değil, tarama bütçesi darlığı; sebep yeni
alan adı + sıfır dış bağlantı. **B bölümü tarama başladığında etkili
olacak hazırlıktır, tek başına sıralama getirmez.** Tarama bütçesinin
gerçek anahtarı dış bağlantıdır (C3).

---

## C. Katma değer raporu (UYGULAMA YOK — sıralı öneri listesi, karar yazılmadı)

### C1. Veri kalemleri — kullanım ölçümüyle [VERİ]

| Kalem | Ölçülen kullanım | Hangi soruyu cevaplar (kullanılmayan kısmıyla) |
|---|---|---|
| `ilce-morfoloji.json` (948 ilçe) | yalnız /ilce-sorgu/ (istemci-yanı) | "İlçemin yüzey şekli/eğimi kuyu açmaya elverişli mi?" — 948 ilçelik STATİK sayfa üretimi yapılmıyor; ilçe sayfaları doğsa uzun kuyruk sorgu yüzeyi 519→~1.400'e çıkar |
| GRACE arşivi (`data/arsiv/grace`) | canlı eğilim (havza sayfası bandı) | "X havzası son N yılda ne kadar su kaybetti?" — tarihsel seri sayfalarda GRAFİKSİZ; yıl-yıl anlatı yok |
| Baraj arşivi (`data/arsiv/baraj`) | yalnız güncel doluluk | "Barajlar geçen yıl bu ay ne durumdaydı?" — mevsimsel karşılaştırma cevaplanmıyor |
| MTA katalog (64) + akademik künyeler (81 il) | il sayfalarında künye listesi | Kullanılıyor; A fazında 37 ölü bağ onarıldı. Alıntı-başına özet çıkarımı yapılmıyor ("bu ilde hangi etüt ne bulmuş") |
| 23 kapatma kaydı | /kapatma-kaydi/ sorgusu | Kullanılıyor; il eşlemesi YOK (sayfanın kendi şerhi) — il sayfalarına bağlanamıyor |
| Göl/nehir seti (247+95) | detay sayfaları + coğrafya ağı | Kullanılıyor; kategori hub'ı yok (site-architecture bulgusu) |
| DSİ istatistik arşivi (`data/arsiv/dsi-yas`) | dolaylı (YAS verileri) | "Türkiye'de yıllara göre YAS tahsisi nasıl değişti?" — seri anlatısı yok |
| `isletme-sahalari-yeni.json` | **0 kullanım, kayıt 0** (md18'de yeni dosya) | Atıl/boş — değerlendirme ya da kaldırma kararı gerekiyor |

### C2. Arama talebi
Ölçülebilen: YOK — GSC'de dizin 0 olduğundan sorgu verisi de yok;
başka sıralama aracı kurulu değil. [VARSAYIM] etiketiyle, sitenin
cevaplamadığı muhtemel talep aileleri: "kuyu ruhsatı ne kadar / harç"
(maliyet verisi sitede yok) · "kuyu ruhsatı cezası itiraz dilekçe
örneği" (şablon/dilekçe yok — hukuki belge, [SERDAR-HUKUK] kapısı) ·
"[ilçe] su çıkar mı" (948 ilçe statik sayfası yok, yalnız interaktif
sorgu) · "baraj doluluk oranları bugün" (var ama tarihçesiz). Bunlar
ölçümsüz olduğundan sıralamaya girerken düşük güvenle işaretlendi.

### C3. Dış bağlantı (tarama bütçesinin gerçek anahtarı)
- Mevcut durum: bilinen dış bağlantı **0** [VERİ-kullanıcı beyanı;
  bağımsız backlink aracıyla doğrulanamadı — araç yok].
- HAZIR envanter (e-posta ATILMADI, atılmayacak — yalnız durum):
  `rapor/temas-listesi.md` (28.07; JMO/TMMOB, akademik kurumsal
  kapılar, veri gazetecisi kanalı §3 — dagitim-durumu.md #5 bunu "en
  yüksek getirili dış bağlantı kanalı" olarak kaydetmiş) ·
  `rapor/linkedin-sablonlar.md` · `icerik-taslak/su-kanunu-gunu-paketi.md`
  (**BEKLEMEDE**, tetiklenmedi — izleyici K1/K4 hatları canlı ve bu tur
  onarıldı: su-kanunu-taslak-pdf hedefi yeniden ölçülebilir durumda).

### C4. Dönüşüm
- Bekletilen satış kalemleri: PayTR mağazası 24.08'de kaldırıldı
  (31×301); hazırlık dosyası `rapor/satis/TEKLIF-KATMANI-HAZIRLIK.md`
  duruyor — yeniden açma kararı kullanıcıda (AY İLKESİ).
- Lead-mailto birleşmesi: SIRADAKILER'deki açık kalem A5 ile FİİLEN
  KAPANDI [VERİ]: `serdar@arslanhukuk.com` src'de 0 isabet (su-hukuku
  arşive taşındı); canlı yüzeyde tek adres `iletisim@suharitasi.com`
  (md19: 22 mailto CTA geçerli).
- Çağrı tutarlılığı: md19 ölçümü yeşil; ana sayfa 4 mailto.

### C5. Sıralı öneri listesi (dayanak · iş büyüklüğü · AY sınıfı · tahmini etki)

1. **GSC'de sitemap yeniden gönder + öncelikli ~20 sayfaya tekil dizin
   isteği** — dayanak: 168 keşfedildi-eklenmedi [VERİ-kullanıcı];
   büyüklük: ~30 dk kullanıcı işi; AY: DAĞITIM ✓; etki: taramanın
   başlaması için en ucuz kaldıraç (B hazırlığı ancak taramayla değer üretir).
2. **Veri gazetecisi temas hattını çalıştır** (temas-listesi §3'ten
   1-2 tekil, konuya özel temas; gönderim kullanıcının) — dayanak:
   dagitim-durumu #5 + dış bağlantı 0; büyüklük: kullanıcı-saatleri;
   AY: DAĞITIM ✓; etki: tarama bütçesinin gerçek anahtarı.
3. **Kurum/yazar profilleri (LinkedIn şirket + Google Business +
   Wikidata) açıp `sameAs` doldurmak** — dayanak: geo-schema/eeat-audit
   boşluk listesi + site.ts aday sırası; büyüklük: ~2 saat kullanıcı +
   5 dk kod; AY: DAĞITIM ✓; etki: varlık grafı + E-E-A-T.
4. **md17 tarayıcısına GET-düşümü + UA esnekliği** — dayanak: bu turda
   kanıtlanan 3 yanlış-pozitif (DergiPark HEAD/UA 404'ü) + TBMM dersi;
   büyüklük: küçük (tek fonksiyon + falsifikasyon); AY: DAYANIKLILIK ✓
   (yanlış alarm gürültüsünü keser); etki: md17 güvenilirliği.
5. **Görünür güncellik damgası + dateModified süreci** — dayanak:
   eeat-audit №1; büyüklük: orta (frontmatter alanı + şablon satırı +
   süreç kuralı); AY: bakım sınırında; etki: YMYL güven sinyali.
6. **/goller/ + /nehirler/ kategori hub sayfaları** — dayanak:
   site-architecture bulgusu (342 spoke hub'sız); büyüklük: orta;
   AY: **YENİ ÖZELLİK → kuyruğa, iki bacak hizalanmadan başlamaz**;
   etki: gezinme + iç bağ eşitliği.
7. **Baraj/GRACE arşivinden tarihçe bölümleri** (havza sayfalarına
   yıl-yıl seri) — dayanak: C1 kullanılmayan seri verisi; büyüklük:
   orta-büyük; AY: **YENİ ÖZELLİK → kuyruğa**; etki: özgün-veri
   alıntılanabilirliği (geo-citability "uniqueness" ekseni).
8. **948 ilçe statik sayfası** — dayanak: C1 morfoloji + C2 varsayımı;
   büyüklük: büyük; AY: **YENİ ÖZELLİK → kuyruğa**; etki: uzun kuyruk;
   risk: ince-içerik/tarama bütçesi — dış bağlantı gelmeden ZARARLI
   olabilir (mevcut 519 sayfa bile taranmıyor).
9. **11 uzun öz-cevap + rehber H2 soru biçimi + 11 içerik title'ı**
   — dayanak: B4/B1 kalanları; büyüklük: küçük ama İÇERİK;
   AY: bakım; etki: düşük-orta; [SERDAR-HUKUK] onayı ister.
10. **isletme-sahalari-yeni.json kararı** (boş dosya: doldur ya da
    kaldır) — dayanak: C1 ölçümü + md18 sarı kaydı; büyüklük: küçük;
    AY: DAYANIKLILIK (veri hijyeni); etki: iç düzen.

### Kullanıcı kararı bekleyenler (özet)
- C5 №1-3 (GSC + temas + profiller) — hepsi kullanıcı eliyle.
- 11 içerik title'ı + 11 uzun öz-cevap + rehber H2 soru biçimi
  ([SERDAR-HUKUK]).
- E-E-A-T listesi (B7 №1-4).
- isletme-sahalari-yeni.json'un akıbeti.
- Satış katmanının yeniden açılıp açılmayacağı (AY İLKESİ kalkınca).

---

## Kapılar · merge · deploy · canlı --tam (kapanış kanıtları) [VERİ]

- **Faz kapıları (izole `--hizli`, worktree):** her fazdan sonra koşuldu;
  son koşum **TAM YEŞİL (kırmızı 0 · sarı 0 · geçti 11)** — md13 ihlal 0 ·
  md14 G1-G6 sapma 0 · md21 taban korundu (201=201; Manisa 12→7) ·
  konsol 0 · 375 taşma 0 · altın örnek 23/23 · build temiz.
- **Merge:** `geo-seo` → main `94bd91b` (39 dosya; A5 istisnası dışında
  taban gerilemesi 0).
- **Deploy teyidi:** canlı `surum.json` = 94bd91b (04:29:25Z'de yayında).
- **Canlı 301:** `/su-hukuku/` ve `/su-hukuku` → 301 →
  `/rehberler/ruhsatsiz-kuyu-cezalari/` → 200 (önbellek atlanarak ölçüldü);
  canlı sitemap 519, su-hukuku isabeti 0.
- **Canlı `--tam` (taze dist ile): KIRMIZI 0 · SARI 1 · GEÇTİ 21.**
  - **md17 kırmızısı KAPANDI:** 52/1037 örneklem, **ölü 0** (haftalardır
    süren SYGM kırmızısıydı). Kalan tek SARI: 18 bağlantı 5xx/zaman-aşımı
    — RG/mevzuat eksik ara-sertifika ailesi + handle.net 500'leri
    (kurum tarafı; raporun A1 şüphe sınıflaması).
  - md16: **bulgu 20** (eski taban 199) → taban gerekçeyle 20'ye yenilendi
    (KARARLAR §26 Karar 4; kalan 20 = 16 title-uzun + 4 soru-baslik-yok,
    tamamı içerik/veri kararı).
  - md18: 13 dosya yeşil (yeni iki dosya tabana alındı).
  - Lighthouse canlı: ana sayfa **99/93** (önceki 99/87); 14 sayfa hepsi
    eşik üstü.
  - Not: ilk --tam koşusu main'deki 4 Ağustos bayat dist'ini taradığından
    eski kırmızıyı tekrarladı; taze build ile ikinci koşum esas alındı
    (iki çıktı da kayıtlı).
- **İzleyici canlı teyidi (A6):** `su-izleme.sh` koşuldu —
  `su-kanunu-taslak-pdf` **🔴 HTTP 404 → 🟢 tamam**, Last-Modified
  birebir (Thu, 31 Oct 2019 08:20:54 GMT), sahte "yeni belge" olayı 0
  (A4 tabanı doğrulandı). Koşum kendi commit'ini attı (b9b3472).

Kapanış: brief'in A ve B bölümleri uygulandı ve kanıtlandı; C yalnız
rapor. Kayıtlar: KARARLAR §26 · GUNLUK 25.08 · SIRADAKILER (4 kalem
kapandı + GEO/SEO kapanış bloğu).
