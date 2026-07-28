# PAZARLAMA-KAZI.md — pazarlama kazısı + dış göz denetimi + URL dili

Brief: 2026-07-28 (`cikti/brief/2026-07-28-pazarlama-kazi.md`, düzeltilmiş:
`-duzeltilmis.md`) · Salt-okunur + rapor işi — **site koduna dokunulmadı** ·
Kanıt: `cikti/denetim/pazarlama/` (16 kare + `ilk-ekran-olcum.json`).
Etiketler: **[VERİ]** ölçüldü · **[YÖNTEM]** okunan kaynaktan aktarım ·
**[VARSAYIM]** persona yorumu/çıkarım.

## 0. Brief ön kapısı (zorunlu ilk bölüm)

**Denetim:** ilk koşu 2 ENGEL (T5 commit kuralı, T7 hukuk kapısı) + 2 UYARI →
ekleme-yalnız düzeltmeyle ikinci koşu **ENGEL 0, 2 UYARI**. Kalan UYARI'lar:
(i) T1 `cikti/denetim/pazarlama/` "repoda yok" — bu işin ÜRETİM klasörü,
iş başında oluşturuldu; (ii) T1 "rapor/kan" — düzeltme ekindeki "rapor/kanıt"
sözcüğünün alt dizgisi, yanlış pozitif. İkisi de engel değil.

**Amaç özeti (3b):** Amaç = kullanıcının pazarlama kararlarını (öne çıkarma,
üyelik, URL taşıma) verebileceği kanıtlı rapor. Dokunulmazlar = site kodu,
canlı site, cron/izlenen state. Bitti-tanımı = 5 fazın çıktısı + kanıt
kareleri + basıma hazır brief taslakları, her iddia etiketli. Kanıtlar =
kare/JSON ölçümleri, klonlanan depoların okunmuş içeriği.

**Düşman geçişi (D1-D4):**
- D1 çelişki: "salt-okunur" vs "commit+push" → çözüm: commit yalnız rapor
  dosyaları; "TBB kısıtı yoktur" vs sitenin mevcut temkinli duruşu → brief
  hükmü uygulandı, TBB'ye bu raporda kısıt atfı yapılmadı.
- D2 geçilemeyecek test: GitHub aramaları kimliksiz API limitine takıldı →
  bekleme + tekrar ile 11 arama tamamlandı (≥10 şartı sağlandı) [VERİ].
- D3 boş referans: "229 DSİ dosyası" ölçümde **230** çıktı; "9 skill" listesi
  doğrulandı (9/9). Sayılar ölçülen değerle rapor edildi.
- D4: persona yorumları [VARSAYIM] etiketiyle ayrıldı; ölçülebilenler [VERİ].

---

## FAZ A — GitHub derin kazı

**[YÖNTEM]** 11 arama (copywriting frameworks · landing page teardown ·
positioning · messaging strategy · pricing page patterns · SaaS marketing
checklist · conversion copywriting · brand voice guide · storybrand · jtbd ·
awesome marketing), yıldız+güncellik+içerik süzgeci. **8 depo klonlanıp
İÇERİĞİ okundu**; 2'si okuma sonrası elendi (aşağıda), tavan korunarak yerine
2 klon alındı. GitHub'da pazarlama içeriğinin büyük kısmı ya link listesi ya
yapay-zekâ dolgusudur — derin okuma bu yüzden şarttı.

**Mükerrerlik tabanı [VERİ]:** kurulu 9 pazarlama skill'i: `content-strategy ·
cro · eeat-audit · featured-snippet-optimizer · geo-citability · geo-crawlers ·
geo-schema · marketing-council · site-architecture`. Kurulu olan hiçbir alan
yeniden önerilmedi.

### Okunan depolar ve suharitasi'ye uygulama notları

**1. EdoStra/Marketing-for-Founders (6.645★, güncel 2026-07)** — küratörlü
pratik kaynak; en değerli bölümleri okundu.
- "Free-Tool Marketing / Engineering as Marketing": sitenin zaten yaptığı şeyin
  (hangi-kurum, il-rejimi, nerede-su-cikar) pazarlama literatüründeki adı; bu
  araçlar backlink/PR mıknatısı olarak KONUMLANDIRILMALI, sadece içerik değil.
- "LLM SEO / AEO / GEO" ayrı başlık olarak yükselişte — sitenin GEO yatırımı
  (öz-cevap, llms.txt, FAQPage) doğru ata oynuyor; yeni iş çıkmadı (kurulu
  geo-* skill'leri kapsıyor).
- Landing bölümündeki ortak teşhis: "kim için + ne + neden daha iyi" 5 saniyede
  cevaplanmalı — FAZ B'nin test çerçevesi buradan alındı [YÖNTEM].

**2. Fearofsnakes/pmm-skillset (25★, 2026-04)** — 10 SKILL.md'li ciddi PMM
sistemi; `positioning-audit` tam okundu.
- Fletch 4-sütun modeli (kategori · kitle · rakip alternatif · farklılaşma) ve
  "10 saniyede ayırt edilebilir mi?" testi suharitasi'ye uyarlanabilir:
  alternatif "rakip site" değil, "avukata sormak / DSİ'yi aramak / Google'da
  dağınık arama" — farklılaşma: künyeli resmî veri + hukuk tek yerde.
- "Positioning debt" kavramı: site büyüdükçe (172 sayfa) tek cümlelik konum
  netliği korunmalı; ana sayfa H1 bunu hukuk tarafına sabitlemiş, veri tarafı
  alt metinde. FAZ C değer önermeleri bu boşluğu dolduruyor.
- marketing-council/content-strategy ile kısmen örtüşür ama "audit + skor"
  yaklaşımı kurulularda yok — İSTENİRSE kurulabilir (karar kullanıcıda).

**3. vjanma/storybrand (2026-07, Claude skill)** — StoryBrand 7 öğe + denetim
listeleri; framework.md ve checklists.md tam okundu. Kalitesi yüksek.
- "Müşteri kahraman, marka rehber": site dili buna zaten yakın (soru-başlıklar
  ziyaretçinin sorusu); ana sayfa H1 "Tek Bir Uzmanda" marka-kahraman kokusu
  taşıyor [VARSAYIM] — rehber-konumlu alternatif FAZ E'de taslakta.
- "Grunt test" (5 sn: ne sunuyorsun / hayatımı nasıl iyileştirir / nasıl
  alırım) FAZ B'de uygulandı [YÖNTEM].
- Somut kural — "kanıt noktası asla uydurulmaz; gerçek sayı yoksa köşeli
  parantezli SLOT bırakılır": sitenin M7 kuralıyla birebir aynı ilke; v0'ın
  "15+ yıl" uydurmasına karşı kurumsallaşmış çözüm.
- Kurulu 9 skill'de StoryBrand YOK — mükerrer değil; kurulum adayı.

**4. karausab590-ops/copywriting-guru-skills (9★)** — Schwartz/Ogilvy/Halbert/
Kennedy/Sugarman SKILL'leri; Schwartz tam okundu.
- Değerli tek parça: **pazar bilinç düzeyi (5 aşama)**. Sitenin ziyaretçisi
  çoğunlukla "problem-aware" (ceza geldi, kuyu kurudu) — bu aşamaya doğru
  başlık: çözüm vaadi değil problemin adı. Rehber başlıkları zaten böyle;
  /durumum/ kapısı "solution-aware" dili konuşuyor [VARSAYIM].
- Gerisi marketing-council'ın kişilik kanalıyla MÜKERRER — kurulmaz.

**5. matt-kenyon/claude-code-copywriting-skill (2026-01)** — AIDA/PAS/PASTOR/
FAB/BAB/ACCA/4P seçici + bilinç düzeyi eşleme. Kompakt ve sağlam.
- Kurulularda çerçeve-seçici yok; ama tek başına kurulum gerektirmeyecek kadar
  küçük — çerçeve eşlemesi bu rapora alındı: sayfa türü → çerçeve önerisi
  brief taslaklarında kullanıldı [YÖNTEM].

**6. itsebastienrankin/product-marketing-os (7★, 2026-04)** — pazarlama
stratejisini versiyon-kontrollü depoya kodlayan altyapı (55 md).
- Fikir suharitasi'de ZATEN kurulu (BRIEF/DESIGN/KAYNAKLAR/CLAUDE.md = aynı
  desen). Alınacak tek parça: `product-marketing-context.md` benzeri TEK
  pazarlama-bağlam dosyası (konum + persona + kanıt havuzu) — turkish-
  copywriting skill'i de bu dosyayı arıyor. FAZ E taslak-1.
- Prompt kütüphanesi (ads üreticileri) şimdilik ilgisiz (reklam bütçesi yok).

**7. BerkinSi/turkish-copywriting-skill (2026-03)** — TÜRKÇE pazarlama metni
skill'i; SKILL.md + frameworks referansı tam okundu. **Kazının en doğrudan
uygulanabilir bulgusu.**
- Türkçe karakter/dilbilgisi kuralları + sen/siz kararı + Türkçe başlık
  kalıpları ({Sonuç}, {acı nokta} olmadan · {Kitle} için {değer} ·
  "Hâlâ {eski yöntem} mi?") — sitenin metin işlerinde kurulu 9 skill'in
  hiçbiri Türkçe'ye özgü değil; MÜKERRER DEĞİL, kurulum adayı #1.
- "Kanıt noktaları: yalnızca gerçek rakamlar" kuralı sitenin M7'siyle uyumlu.
- Pricing bölümü Türkiye pazarına özgü (KDV, TL psikolojik eşikler) — üyelik
  kararı verilirse işe yarar.

**8. brianrhea/awesome-jtbd (110★)** — JTBD kaynak listesi (2018, bayat ama
kanonik). Forces/Timeline mülakat şablonları işaretlendi.
- Uygulama: sitenin "iş"i çoğu ziyaretçi için "hukuki riskimi bugün öğren" —
  içerik zaten JTBD-şekilli (soru-başlık = job statement). Yeni iş çıkmadı;
  B2B rapor ürünü tasarlanırken müşteri mülakatı şablonu olarak kullanılır.

### Elenenler (okundu, değersiz/ilgisiz bulundu)

- **niranjanbala/brand-marketing-frameworks** — "Quantum Brand Paradigm",
  "Brand Consciousness Architecture": içeriksiz yapay-zekâ dolgusu [VERİ:
  brand-strategy-foundation.md okundu]. Elendi.
- **YunyueLi/design-teardowns** — 22 MB tasarım-token galerisi, dokümanlar
  Çince; pazarlama değil tasarım-mühendisliği işi. Tek alınan ilke: "facts,
  not vibes — her değer canlı siteden ölçülür" (projenin zaten anayasası).

---

## FAZ B — dış göz denetimi ("waaw mı?")

**[YÖNTEM]** Canlı site (https://suharitasi.com), headless Chromium, 1440 +
375, sayfa başına kadraj + tam kare (16 kare) + ilk-ekran blok ölçümü
(`arac/pazarlama-kare.mjs` → `ilk-ekran-olcum.json`). Test çerçevesi: StoryBrand
grunt testi + M4F 5-saniye teşhisi. GPU'suz sunucu — kareler yerleşim kanıtı,
görsel kalite yargısı değil.

**Taban ölçümler [VERİ]:** 8 sayfa-kırılım kombinasyonunda HTTP 200, konsol 0.
Yük (load): 199-499 ms. İlk ekranda tekil metin bloğu: 1440'ta 15-29 (10-24
tıklanabilir), 375'te 6-8 (3-4 tıklanabilir).

### Persona 1 — kuyu ruhsatı/ceza derdi olan işletme sahibi [müvekkil adayı]

Rota: ana sayfa → rehber. **İlk 5 saniye (1440):** H1 "Suyla İlgili Her Hukuki
Mesele Tek Bir Uzmanda" 323px'te, iki CTA 612px'te [VERİ]. Ne anladım: su
hukuku uzmanı var; bana ne: sağ blokta 360px'te "**Ruhsatsız kuyu cezası
aldım, ne yapmalıyım?**" — ziyaretçinin cümlesi kelimesi kelimesine ekranda
[VERİ konum]. **Waaw anı bu**: derdimi benden önce söylemiş [VARSAYIM]. Ne
yapmalıyım: "Ücretsiz Ön Görüşme Alın" net.
- **Takılma (mobil):** 375'te ilk ekranda uçuşan sorular YOK — 6 blok var,
  ilk tıklanabilir hedefler 534px'teki iki CTA [VERİ]. Derdi-adlandıran cümle
  mobilde ilk ekrana girmiyor; en güçlü kanca kaydırma altında [VARSAYIM].
- **Takılma (1440):** kare anında sahne çok soluk/sisli; sorular küçük punto
  ve düşük belirginlikte [VERİ: anasayfa-1440.png] — Görünürlük kuralı
  ("İLK BAKIŞTA fark edilir") açısından sınırda [VARSAYIM; GPU'suz kare,
  canlı görsel yargı kullanıcıda].

### Persona 2 — bölgesel rapor isteyebilecek şirket yöneticisi [B2B]

Rota: ana sayfa → il sayfası. Alt metindeki "Portalda 25 havza, 81 il, 42
sektör profili, 20 su işlemi, 10 rehber var" veri genişliği sinyali [VERİ].
Konya il sayfası: öz-cevap kutusu havza + DSİ bölgesi + KOSKİ + uydu eğilimini
tek paragrafta veriyor — kurumsal göz için "bu adamlar veriyi tutuyor" anı
[VARSAYIM; VERİ: il-konya-1440.png 385-565px bölgesi].
- **Takılma:** sitede B2B teklifin KENDİSİ yok — sitemap'te rapor/kurumsal
  hizmet sayfası yok [VERİ: 172 rota tarandı]. Bu persona parasını bırakacak
  kapı bulamıyor; "Randevu Al" müvekkil dili, tedarikçi dili değil [VARSAYIM].
  BRIEF.md gelir ayağı 2'nin sayfası hiç açılmamış. → FAZ E taslak-3.

### Persona 3 — sondaj/arıtma firması sahibi [lead]

Rota: /nerede-su-cikar/ → il. Kapı sayfası ilk ekranda soru-H1 + 255
karakterlik sayılı cevap + il seçici başlangıcı [VERİ: 29 blok, 24
tıklanabilir — sitenin en yoğun ilk ekranı]. "Cevap nasıl üretiliyor" katman
kartları (SYGM/RG/DEM/künyeler) firmaya "müşterime gösterebileceğim resmî
dayanak" veriyor — waaw [VARSAYIM].
- **Takılma:** sayfada firmaya dönük hiçbir tutma mekanizması yok — bülten
  formu sitede kapalı (Buttondown hesabı bekliyor, SIRADAKILER m.22 [VERİ]).
  Bu personadan tekrar ziyaret alınamıyor; e-posta yakalama sıfır. → taslak-4.

### Persona 4 — su verisi arayan mühendis/gazeteci [otorite yayıcı]

Rota: il → havza → /harita/. Künye disiplini (RG tarih+sayı+URL, DSİ 2024,
NASA GRACE serh'li) alıntılanabilirlik açısından güçlü; öz-cevaplar
kopyala-yapıştır alıntı cümlesi [VERİ: yapı; VARSAYIM: davranış].
- **Takılma:** ham veri İNDİRİLEMİYOR — 472 kütle, RG 419 kayıt, GRACE serisi
  sitede tablo olarak var ama CSV/JSON dışa verme yok [VERİ: sayfalarda
  indirme bağlantısı 0]. Gazeteci/mühendis atıf verirken "veriyi nereden
  alayım" sorusunda kopuyor; oysa indirilebilir veri = backlink mıknatısı
  (M4F Free-Tool bölümü) [YÖNTEM]. → taslak-5, karar kullanıcıda (kopyalanma
  direnci ilkesiyle gerilim var — hendek tartışması).

---

## FAZ C — öne çıkarılacaklar + üyelik katmanı

### "Türkiye'de başka yerde yok" envanteri (hepsi ölçüldü)

| # | Varlık | Ölçüm [VERİ] | Tek cümlelik değer önermesi taslağı (kanıta bağlı) |
|---|---|---|---|
| 1 | RG işletme sahası arşivi | **419 kayıt, 1963-2017, 70 il**, hepsi RG tarih+sayı+URL künyeli | "1963'ten bu yana Resmî Gazete'de ilan edilmiş yeraltı suyu işletme sahalarının il il taranabilir tek derlemesi." |
| 2 | YAS kütlesi × il eşlemesi | 12 NHYP planı → **472 kütle**, 347'si il eşlemeli | "12 resmî havza planına dağılmış 472 yeraltı suyu kütlesini tek makine-okunur envanterde il sınırına eşleyen tek kaynak." |
| 3 | GRACE Türkiye serisi | **254 ay, 2002-04 → 2026-03**, NASA mascon, Türkçe şerhli | "Türkiye'nin uydudan ölçülen su depolaması eğilimini 24 yıllık seriyle Türkçe yorumlayan tek sayfa." |
| 4 | Günlük baraj arşivi | EPİAŞ, **12 günlük anlık görüntü** (16-27 Tem), gün başına 22 dosya, büyüyor | (Genç — iddia HENÜZ kurulmaz; 90+ gün birikince "havza bazında günlük doluluk arşivi" iddiası açılır.) |
| 5 | DSİ istatistik yerel arşivi | **230 dosya** (brief 229 demişti; ölçülen esas) | "DSİ'nin dağınık istatistik yayınları tek arşivde — künyesiyle." |
| 6 | Kurum-işlem matrisi | **155 kurum × 20 işlem**, 11'i doğrulanmış dayanaklı | "Su işleminizin muhatabını mevzuat dayanağıyla söyleyen tek tablo." |
| 7 | Akademik künye havuzu | **1.979 açık-erişim künye, 81/81 il** | "Her il için yeraltı suyu literatürünü DOI'li listeleyen tek dizin." |

**Öne çıkarma önerisi [VARSAYIM]:** bu 7 satır sitede hiçbir yerde TOPLU
anlatılmıyor; ana sayfa alt metni sayıyor ama iddialaştırmıyor. "Neden bu
site?" tek bölüm/sayfa (taslak-2) 1. gelir ayağını (otorite) doğrudan besler.

### Üyelik katmanı — BRIEF.md sırasına (1 otorite > 2 B2B > 3 lead > 4 SaaS) hizalı

Bağlayıcı ilke: **1. önceliği zayıflatan paywall yok** — içerik sayfaları
(rehber/il/havza/kapı) HER senaryoda açık ve botlara taranabilir kalır
(aksi GEO yatırımını ve otoriteyi keser). Fiyat yazılmadı (brief şartı).

| Senaryo | Ne kapanır | Artı | Eksi | Gelir ayağı |
|---|---|---|---|---|
| A. Tam açık (bugünkü) | Hiçbir şey | Otorite/GEO maksimum; bakım 0 | Tekrar ziyaret ve gelir yakalama 0 | 1 |
| B. Yumuşak kapı: türetilmiş varlıklar e-postayla | PDF il raporu, kontrol listesi, aylık su bülteni | İçerik açık kalır; lead listesi doğar; ölçülebilir talep sinyali | Üretim işi; KVKK aydınlatma gerekir; bülten altyapısı (Buttondown) hâlâ kullanıcıda | 3→2 |
| C. B2B rapor talebi (ürünleşmiş hizmet) | Hiçbir sayfa — "kurumsal rapor isteyin" formu + örnek rapor | Persona-2 kapısı açılır; paywall değil, teklif | Örnek rapor üretimi + fiyatlama kararı; talep belirsiz | 2 |
| D. Üyelikli panel (SaaS: uyarılar, izleme) | Yeni işlev (mevcut içerik değil) | Tekrarlayan gelir potansiyeli | Altyapı+destek yükü; statik-site ilkesiyle gerilim; BRIEF sırasında SON | 4 |

**Öneri sırası [VARSAYIM]:** B + C birlikte (ikisi de 1'i zayıflatmaz),
D erteленир. Karar tümüyle kullanıcıda.

---

## FAZ D — URL / bilgi mimarisi dili

**[YÖNTEM]** Canlı sitemap'teki 173 rota gruplandı; her grup "hangi arama
sorusuna karşılık geliyor" testinden geçirildi. Kural seti: numaralı/türev
slug yasak (yeni öneriler için) · her araç tek soruya cevap ·
/nerede-su-cikar/ otoritesi bölünmez.

### Karşılığı OLAN rotalar (dokunulmaz) [VERİ+VARSAYIM]

| Rota (adet) | Karşılık gelen arama sorusu |
|---|---|
| /kuyu-ruhsati/ + 81 il | "konya kuyu ruhsatı", "ilimde kuyu ruhsatını kim verir" |
| /havzalar/ + 25 | "sakarya havzası su durumu" |
| /rehberler/* (10) | "kuyu ruhsatı nasıl alınır", "ruhsatsız kuyu cezası" — slug'lar arama dilinde |
| /nerede-su-cikar/ | "nerede su çıkar" — kapı, otorite burada toplanıyor |
| /hangi-kurum/ | "su işi hangi kuruma" |
| /su-kanunu/ + taslak-takibi | "su kanunu taslağı son durum" |
| /harita/, /hakkinda/ | doğrudan karşılık |

### Karşılıksız / zayıf rotalar + öneri tablosu (UYGULANMADI)

| Rota | Sorun | Öneri | 301 planı | Kapıdan besleme |
|---|---|---|---|---|
| `/arac/il-rejimi/` | "il rejimi" hukukçu jargonu; kimse böyle aramaz [VARSAYIM]. Ayrıca /arac/ tek üyeli bölüm [VERİ] | `/ilimde-kim-yetkili/` (soru: "ilimde su işinden kim sorumlu?") — tek soru kuralına uyar, /nerede-su-cikar/ ile çakışmaz (o "nerede", bu "kim") | Eski → yeni tek 301; iç 6 link güncellenir (ölçüm: menü+kuyu-ruhsati index+kapı) | Kapıdan link ZATEN yok — eklenmez; /kuyu-ruhsati/ indeksinden beslenmeye devam |
| `/durumum/` + 42 persona | "durumum" arama dili değil [VARSAYIM]; 31 slug `-nace-XX` ekli = numaralı/türev [VERİ] | İndeks: `/sektorunuz/` DEĞERLENDİRİLİR; ALTERNATİF: ad kalır, yalnız menü etiketi "Sektörünüze göre" olur (301 çalkantısı sıfır). NACE ekleri: mevcutta bırakılır — 43 sayfalık 301 zinciri riski faydasını aşar [VARSAYIM] | Yalnız indeks taşınırsa 1 kayıt; personalar taşınMAZ | Kapı ile ilgisiz — beslenmez (farklı eksen) |
| `/vaka/meysu/` | Slug tek kelime; arama "meysu neden kapandı / meysu su krizi" [VARSAYIM] | Gelecek vakalarda zengin slug (`/vaka/meysu-su-krizi/` deseni); meysu TAŞINMAZ (tek vaka, 301 gereksiz) | Yeni vakalar için kural, geriye dönük yok | — |

**Net karar önerisi:** tek gerçek taşıma adayı `/arac/il-rejimi/`. Gerisi
"kural koy, geriye dönük dokunma". Uygulama briefi taslak-6'da.

---

## FAZ E — sentez: tek sayfa eylem planı

### 1. Hemen / ücretsiz (brief taslağı hazır — `rapor/pazarlama-brief-taslaklari.md`)

| # | İş | Taslak |
|---|---|---|
| E1 | `pazarlama-baglam.md` tek bağlam dosyası (konum 4-sütun + 4 persona + kanıtlı sayı havuzu) — tüm gelecek metin işlerinin girdisi | taslak-1 |
| E2 | "Neden bu site?" otorite bölümü/sayfası — FAZ C tablosundaki 7 kanıtlı iddia | taslak-2 |
| E3 | turkish-copywriting + storybrand skill kurulumu (ikisi de mükerrer değil) | tek satır: kullanıcı onayı → kurulur |
| E4 | Mobil ana sayfada derdi-adlandıran 1 sorunun ilk ekrana alınması (Persona-1 bulgusu) | taslak-7 (görsel iş — DUR'lu, pilot kanıtlı) |

### 2. Kullanıcı kararı bekleyen

| # | Karar | Girdi |
|---|---|---|
| K1 | Üyelik senaryosu B/C/D (FAZ C tablosu) — fiyatlama dahil | FAZ C |
| K2 | `/arac/il-rejimi/` → `/ilimde-kim-yetkili/` taşıması | taslak-6 |
| K3 | Ham veri indirme (CSV/JSON) — kopyalanma direnciyle gerilim: hendek "veri arşivi"nde, kod gizlemede değil; indirilebilir veri otorite/backlink getirir ama toplu kopyayı kolaylaştırır | taslak-5 |
| K4 | B2B "kurumsal rapor" sayfası (Persona-2 kapısı) | taslak-3 |
| K5 | Bülten: Buttondown hesabı (SIRADAKILER m.22'de bekliyor) — Persona-3 tutma mekanizmasının ön koşulu | taslak-4 |

### 3. Panel ön koşulları (tek satır adımlar)

- **Cloudflare Web Analytics**: panelden aç (ücretsiz, çerezsiz) — dönüşüm
  ölçümü olmadan FAZ B bulguları doğrulanamaz. [Kullanıcı paneli]
- **robots.txt AI botları**: ZATEN TAM [VERİ — canlıdan okundu: Tier-1 AI
  botları açık, Bytespider/CCBot gerekçeli kapalı]. İş yok.
- **Search Console**: kurulu (2026-07-14) — /nerede-su-cikar/ için Performans
  raporunda "nerede su çıkar" sorgu ailesini 4-6 hafta sonra kontrol et.

---

## Bu işte üretilen kalıcı araç

`arac/pazarlama-kare.mjs` — canlı sitede kadraj+tam kare + ilk-ekran blok
ölçümü (persona denetimlerinin tekrarlanabilir tabanı).

**DUR** — hiçbir değişiklik uygulanmadı; tüm uygulamalar yukarıdaki karar
tablolarında kullanıcı onayı bekliyor.
