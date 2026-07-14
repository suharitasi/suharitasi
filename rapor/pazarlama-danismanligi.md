# suharitasi.com — Pazarlama / CRO Danışmanlık Raporu

Tarih: 14 Temmuz 2026
Kapsam: salt analiz — bu raporla birlikte sitede hiçbir değişiklik yapılmamıştır.
Hedefler: (1) Arslan Hukuk'a su hukuku müvekkili, (2) B2B bölgesel rapor satışı, (3) sondaj/arıtma lead'i.
Bağlayıcı kısıt: TBB reklam yasağı — "bize ulaşın, dava alırız" dili yasak; bilgilendirme portalı tavrı korunur. Bu rapordaki her öneri bu süzgeçten geçirilmiştir.

**ŞERH (tüm görsel değerlendirmeler için):** İnceleme GPU'suz headless tarayıcıda yapıldı. Menü su simülasyonu, landing giriş koreografisi ve tüm WebGL/animasyon katmanları GÖRÜLEMEDİ; hareket içeren öğeler hakkındaki değerlendirmeler "headless sınırlı, nihai görsel yargı kullanıcının" kaydıyla okunmalıdır. Simülasyonun pazarlama etkisi hakkında bu raporda kesin hüküm kurulmamıştır.

---

## FAZ 1 — Skill kazısı: aday tablosu ve kurulum

Yöntem: iki paralel ajanla GitHub kazısı (repo search API + web araması + awesome-liste takibi + anthropics/skills kontrolü). Her adayın SKILL.md içeriği raw.githubusercontent üzerinden gerçekten okundu; kopya/türev repolar diff ile ayıklandı. Puan: yıldız + güncellik + içerik derinliği + bu projeye (hukuk + veri portalı, müvekkil kazanımı) uygunluk.

| # | Repo | Yıldız | Son push | Derinlik notu | Puan/10 |
|---|------|--------|----------|---------------|---------|
| 1 | **coreyhaines31/marketingskills** | 39.153 | 2026-07-13 | 47 skill; cro 187, copywriting 252, seo-audit 497, lead-magnets 310, marketing-psychology 455 satır — alanın en olgun seti | **9.5 — KURULDU** |
| 2 | **AgriciDaniel/claude-seo** | 11.362 | 2026-07-06 | 25 skill + 18 agent; seo-technical 202, seo-local 317, seo-content 198 satır; E-E-A-T + schema + teknik denetim | **9.0 — KURULDU** |
| 3 | blader/humanizer | 29.175 | 2026-06-29 | Tek skill 622 satır; AI yazı kalıpları temizliği — kalıplar İngilizce odaklı, Türkçe'ye kısmi transfer | 7.5 |
| 4 | zubair-trabzada/geo-seo-claude | 8.978 | 2026-05-27 | 16 skill; geo-citability 319 satır (AI aramada alıntılanma, llms.txt) | 7.5 |
| 5 | zubair-trabzada/ai-marketing-claude | 2.101 | 2026-03-02 | market-landing 328 satır, "consultation booking" benchmark'ları hukuk randevusuna birebir; Mart'tan beri durgun | 7.0 |
| 6 | AgriciDaniel/claude-blog | 1.377 | 2026-07-10 | 472 satır + 30 sub-skill; kapılı içerik üretim hattı | 7.0 |
| 7 | OpenClaudia/openclaudia-skills | 567 | 2026-07-13 | 68 skill; write-landing 547 satır, danışmanlık/finans dönüşüm benchmark'ları; 1 no'lu ile örtüşüyor | 7.0 |
| 8 | nowork-studio/NotFair | 3.130 | 2026-07-14 | 18 skill; content-writer 338, keyword-research 303 satır — derli ama dar | 6.5 |
| 9 | rampstackco/claude-skills | 431 | 2026-07-12 | ~100 skill; cro-optimization 271 satır, dürüst "düşük trafikte A/B test yapma" bölümü | 6.5 |
| 10 | YuanASI/landing-page-doctor | 13 | 2026-03-19 | Tek skill 206 satır + Playwright scripti; küçük ama araç destekli, projedeki öz-denetim altyapısıyla uyumlu | 6.0 |
| 11 | aitytech/agentkits-marketing | 564 | 2026-03-10 | 32 skill; page-cro 364 satır özgün; durgunlaşmış | 6.0 |
| 12 | boraoztunc/skills | 172 | 2026-07-09 | page-cro/copywriting = coreyhaines kopyası (diff doğrulandı); ogilvy/SKILL.md 208 satır ÖZGÜN — "reklam değil bilgi" yaklaşımı TBB tonuna uygun | 6.0 |
| 13 | ComposioHQ/awesome-claude-skills | 67.719 | 2026-05-22 | content-research-writer 538 satır somut; **lisans yok** — kurumsal kullanımda pürüz | 5.5 |
| 14 | CosmoBlk/email-marketing-bible | 243 | 2026-06-30 | 322 satır + geniş referans; yalnız e-posta, CRO yok | 5.0 |
| 15 | kostja94/marketing-skills | 735 | 2026-06-09 | 172 skill ama skill başına sığ (landing-page 136, copywriting 110 satır); bileşen skill'leri (cta, trust-badges) fikir verir | 5.0 |
| 16 | BrianRWagner/ai-marketing-claude-code-skills | 367 | 2026-03-19 | homepage-audit 235 satır fena değil; **lisanssız** | 4.5 |
| 17 | aaron-he-zhu/aaron-marketing-skills | 2.382 | 2026-07-14 | 120 skill, örneklenen 87-99 satır — hacim var derinlik yok | 4.0 |
| 18 | marcobiedermann/search-engine-optimization | 2.749 | 2025-02 | Skill değil; 259 satır SEO checklist — claude-seo kapsıyor, durgun | 3.5 |
| 19 | goabstract/Marketing-for-Engineers | 13.175 | 2020 | Ölü küratasyon listesi, link çürümesi yüksek — skill'e dönüştürmeye değmez | 2.5 |
| 20 | gtmagents/gtm-agents | 332 | 2026-04-03 | 244 SKILL.md ama örneklenen 31 satır jenerik madde listesi | 2.5 |
| 21 | Cesarjoquin/Marketing-Skills | 139 | — | coreyhaines eski sürüm klonu | 2.0 |
| 22 | rediumvex/ai-marketing-claude | 44 | — | zubair-trabzada kopyası | 2.0 |
| 23 | ajmedick/claude-cro-skills | 0 | — | page-cro coreyhaines kopyası | 1.5 |
| 24 | philippkrabatsch-prog/claude-code-cro-toolkit | 0 | — | Almanca, 105 satır, niş | 1.5 |
| 25 | sparanoid/chinese-copywriting-guidelines | 15.574 | — | Çince dizgi kuralları — alakasız, elendi | 0 |

Not: anthropics/skills resmî reposunda pazarlama skill'i yok (18 skill'in tümü üretim/mühendislik — doğrulandı). obra/superpowers'ta da yok.

**Kurulum (doğrulandı):** `~/.claude/skills/` altına iki reponun tamamı kuruldu — marketingskills'ten 47, claude-seo'dan 25 skill dizini (`seo-audit` ad çakışması `seo-audit-teknik` olarak yeniden adlandırıldı). 77 skill dizininin tümünde SKILL.md frontmatter'ı doğrulandı; skill'ler bu oturumda aktif olarak yüklendi ve Faz 3-4 değerlendirmesi cro / lead-magnets / seo-technical / seo-local / seo-content çerçeveleriyle yapıldı. Kaynak klonlar scratchpad'de; kurulum repo dışında olduğundan bu commit'e girmez.

---

## FAZ 2 — Hedef kitle: üç persona

### P1 — DSİ ile ihtilaflı şirket yöneticisi (birincil müvekkil adayı)
- **Hangi aramayla düşer:** "kuyu kullanma belgesi iptal edildi", "DSİ idari para cezası itiraz", "ruhsatsız kuyu cezası 2026", "yeraltı suyu tahsisi iptali dava", "su tahsis belgesi reddi"
- **Hangi sayfaya iner:** /rehberler/kuyu-belgesi-iptal-davalari/, /rehberler/ruhsatsiz-kuyu-cezalari/, /rehberler/su-tahsisi-oncelik-sirasi/
- **İlk 5 saniyede ne görmeli:** Sorununun tam adını taşıyan başlık + bu metnin bir avukat tarafından yazıldığını gösteren görünür yazar kimliği + güncellik tarihi + mevzuat dayanağı sinyali. (Bugün: başlık var; yazar kimliği sayfa sonunda tek satır, tarih sayfada hiç görünmüyor.)
- **Sonraki adımı ne olmalı:** Rehberi okur → yazarın kim olduğunu merak eder → yazar kutusu/hakkında → arslanhukuk.tr'ye kendi iradesiyle geçer. TBB uyumu: davet yok, yalnızca kimlik ve erişilebilirlik. (Bugün: köprü zayıf — hakkında sayfası 3 cümle, künye/iletişim sayfası yok.)

### P2 — Bölgesel su verisi/raporu arayan kurumsal alıcı (B2B rapor müşterisi)
- **Hangi aramayla düşer:** "Sakarya havzası su potansiyeli", "[il] yeraltı suyu rezervi", "Türkiye havza bazında su verisi", "havza koruma eylem planı [havza]" — ya da yatırım/ÇED sürecinde danışman tavsiyesiyle doğrudan gelir
- **Hangi sayfaya iner:** /havzalar/[slug]/ veya /havzalar/
- **İlk 5 saniyede ne görmeli:** Verinin resmî kaynaklı ve tarihli olduğu (bugün iyi yapılıyor) + bu verinin derinleştirilmiş halinin (bölgesel rapor) alınabildiği sinyali. (Bugün: rapor hizmetinin sitede HİÇ izi yok — gelir modeli 2 görünmez durumda.)
- **Sonraki adımı ne olmalı:** "Bu havzanın kapsamlı raporu hazırlanabilir — kapsam ve künye" sayfasına geçiş → kurumsal e-posta. (Bugün: sitede tek bir mailto/iletişim kanalı yok.)

### P3 — Kuyu açtırmak isteyen birey/çiftçi (hacim + sondaj lead kaynağı)
- **Hangi aramayla düşer:** "kuyu açtırmak için izin gerekli mi", "sondaj ruhsatı nasıl alınır", "tarla kuyusu ruhsatı", "kuyu ruhsatı nereden alınır [il]"
- **Hangi sayfaya iner:** /rehberler/kuyu-ruhsati/
- **İlk 5 saniyede ne görmeli:** "Üç belge, mercii DSİ, süre bir ay" netliğinde özet + kendi ilinin nereye bağlı olduğunu bulacağı işaret. (Bugün: içerik güçlü, 81 il tablosu var; ama özet kutusu yok, il tablosu 10.000 piksellik sayfanın en dibinde.)
- **Sonraki adımı ne olmalı:** İlini bulur → ruhsatsız kuyu cezaları rehberine geçer (risk farkındalığı) → sayfayı PDF alır/yer imler; ileride sondaj sponsorluk katmanının doğal zemini burası. (Bugün: rehberler arası köprü kısmen var, PDF/yazdırma bozuk — aşağıda.)

---

## FAZ 3 — Canlı site incelemesi (sayfa sayfa, persona gözüyle)

Denetim: 11 sayfa, konsol hata/uyarı 0, kırık iç link 0/42. Görüntüler: `cikti/pazarlama/` (13 dosya). Değerlendirme kurulu skill'lerin çerçevesiyle yapıldı (cro: 7 boyut; seo-content: E-E-A-T).

### / (landing) — `landing.png`, `landing-mobil.png`
- **Değer önerisi:** "Su, yerin altında konuşur." + tek alt cümle. Şiirsel ve marka kuran; ama cro çerçevesinin 5 saniye testinde eksik kalan taraf "ben burada ne YAPABİLİRİM" cevabı. Sitede 25 havza sayfası + 9 rehber + Su Kanunu takibi YAYINDA — landing bunların hiçbirini söylemiyor, hâlâ "Yakında" diyor.
- **Yönlendirme:** Tek çıkış, gövdedeki soluk "keşfet →" linki (yalnız /harita/'ya). Menü yok, nav yok, rehberlere/havzalara hiçbir kapı yok.
- **Çıkmaz sokak hükmü:** ÜÇ PERSONA İÇİN DE ÇIKMAZ SOKAK. Marka aramasıyla veya arslanhukuk.tr'den gelen P1 rehberlere ulaşamıyor.
- Meta description "— tek haritada. Yakında." → Google sonucunda siteyi boş vitrin gibi gösteriyor; CTR kaybı.
- *Şerh: giriş koreografisi ve imleç maskesi headless'ta görülemedi; estetik yargı kullanıcının.*

### /harita/ — `harita.png`
- h1 yok, metin içeriği yok, footer yok → arama motoru için boş sayfa; "Harita" menüde birinci sırada ama şu an salt görsel (bilinen geçici durum, SIRADAKILER 7).
- Menü sistemi diğer sayfalardan farklı sınıflarla (`.menu-ac` / `.menu-katman` vs `.sv-menu-ac` / `.sv-menu`) — iki ayrı menü kod tabanı yaşıyor.
- P2 buraya inerse: veri yok, havzalara link yok görünürde (yalnız menüden). Çıkmaz sokağa yakın.
- *Şerh: WebGL sahnesi GPU'suz değerlendirilemez.*

### /havzalar/ — `havzalar.png`
- 25 kart, her kartta yağış alanı + potansiyel + DSİ 2024 kaynağı: P2 için doğru ilk izlenim, güven veriyor.
- Kartlarda hukuk katmanının hiçbir sinyali yok ("bu havzada kısıt var" gibi) — P1 bu listede kendi derdini göremiyor.
- Tam sayfa görüntüde 25 karttan yalnız 4'ü görünüyor: scroll-reveal (`sayfa.js`) öğeleri `opacity:0` başlatıyor (aşağıda KOD-5).

### /havzalar/sakarya/ — `havza-sakarya.png`
- Veri künyesi + kaynak linkleri + "veri yok" dürüstlüğü: P2'ye güven veren, sitenin en güçlü kalıbı.
- **BRIEF'in "taklit edilmesi en zor parça" dediği "Bu havzada hukuki durum" bloğu henüz yok.** Veri ile hukuk aynı ekranda buluşmuyor; P1 için havza sayfası nötr bir veri sayfası.
- Rehberlere tek iç link yok: Sakarya'daki kuyu sahibi P3, iki tık ötedeki kuyu-ruhsati rehberinin varlığını bilemiyor.
- B2B rapor teklifi sinyali yok (P2 çıkmaz sokağı: okur, kapatır).

### /rehberler/ — `rehberler.png`
- 9 rehber, hepsi "14 Temmuz 2026" — tek günde doğmuş arşiv görüntüsü otorite sinyalini zayıflatıyor (dürüst ama vitrine yansıtılmak zorunda değil; sıralamayı tarihten konuya çevirmek yeter).
- Gruplama yok: P1'in dava rehberleri (iptal davaları, cezalar) ile P3'ün süreç rehberleri (ruhsat, tahsis) aynı düz listede.

### /rehberler/kuyu-ruhsati/ ve /rehberler/kaynak-suyu-kiralama/ — `rehber-*.png`
- İçerik kalitesi: mevzuat dayanağı + madde metni + tablo + emsal karar + "doğrulama sürecindedir" şerhi — E-E-A-T'nin "uzmanlık/dürüstlük" ayağı güçlü. Bu sitenin gerçek varlığı bu sayfalar.
- **Görünür yazar kimliği yok:** "Av. Serdar Arslan" yalnız sayfanın en dibinde tek satır. seo-content çerçevesinde YMYL (hukuk) içerikte yazar kutusu + tarih ilk ekranda/başlık altında olmalı. Yayın/güncelleme tarihi sayfada hiç render edilmiyor (frontmatter'da var).
- ~10.000 piksel tek kolon; içindekiler (TOC) yok; P1/P3 aradığı bölüme atlayamıyor.
- Sayfa sonu: imza satırı var ama "sonraki adım" yok — ilgili rehber önerisi, havza köprüsü, hiçbir devam yolu sunulmuyor. Blog-CRO ilkesi (içerik sonu bağlamsal yönlendirme) tümüyle boş.
- FAQ formatında hiçbir bölüm yok → FAQPage schema ve AI-arama alıntılanabilirlik fırsatı kullanılmamış.

### /su-kanunu/ — `su-kanunu.png`
- İki kart (kütüphane + taslak takibi). Taslak takibi, BRIEF'teki "kanun çıktığında binlerce şirkete uyum ihtiyacı" tezinin sitedeki tek karşılığı ve P1/P2 için en yüksek potansiyelli varlık.
- "Yasalaştığında haberdar olun" mekanizması yok — sitenin tamamında tek bir e-posta yakalama noktası yok. Kanun çıktığı gün elde hazır ilgili-kişi listesi olmayacak; bu, zamanlama avantajının boşa gitmesi riski.

### /hakkinda/ — `hakkinda.png`
- 3 paragraf. "Bağımsız portal + Av. Serdar Arslan hazırlıyor + veri dürüstlüğü taahhüdü" çekirdeği doğru ve TBB uyumlu.
- P1'in güven kararını besleyecek içerik yok: hazırlayanın uzmanlık alanı, yöntemi, veri kaynakları politikası, künye/iletişim. Özgeçmiş ve kimlik bilgisi TBB'de reklam sayılmaz; burası korkulduğundan daha fazla genişletilebilir.
- Sitede hiçbir sayfada e-posta/iletişim kanalı yok (mailto/tel: 0 adet — tarama bulgusu).

### Site geneli
- og:image tanımlı değil (landing `twitter:card summary_large_image` ilan ediyor ama görsel yok) — sosyal/WhatsApp paylaşımlarında boş kart.
- JSON-LD yapılandırılmış veri: 0 satır (Article, FAQPage, BreadcrumbList, Organization, Dataset — hiçbiri).
- Footer tüm sitede tek satır (arslanhukuk.tr'ye dış link); site içi footer navigasyonu yok — her sayfanın dibi dış kapıya açılıyor, iç dolaşıma değil.

---

## FAZ 4a — KOD (dosya bazında)

Her madde: sorun → öneri → persona → beklenen etki → efor.

**KOD-1. `public/index.html:7` — meta description "Yakında" diyor.**
Site dolu; açıklama onu boş gösteriyor. → "Türkiye'nin 25 su havzası: DSİ verisi, kuyu ruhsatı ve su mevzuatı rehberleri, Su Kanunu taslak takibi — tek portalda." benzeri, envanteri sayan açıklama. → P1+P2+P3. → Marka/genel aramalarda CTR artışı; tek satır değişiklik. → Efor: dakikalar.

**KOD-2. `public/index.html` — landing'de navigasyon yok.**
→ Landing sahnesini bozmadan üstte `UstMenu`'nün sade eşdeğeri (5 link) + h1 altına üç kapı: Harita · Rehberler · Su Kanunu. "Yakında" rozeti kaldırılır ya da "Harita: yapım aşamasında"ya daraltılır. → P1+P2+P3 (çıkmaz sokak eliminasyonu). → Landing'e inen herkesin içeriğe akabilmesi; hemen-çıkma düşüşü. → Efor: yarım gün (koreografiyle uyum dahil; canlı görsel onay kullanıcıda).

**KOD-3. `src/layouts/Sayfa.astro` — og:image ve JSON-LD yok.**
→ (a) Tek statik og-image (koyu zemin + "su haritası" + damar çizgisi, 1200×630) tüm sayfalara; (b) `Organization` + `WebSite` JSON-LD layout'a; (c) `BreadcrumbList` etiket zincirinden üretilir. → P1+P2 (paylaşım ve SERP görünümü). → Sosyalde boş kart sorunu biter; zengin sonuç zemini. → Efor: yarım gün.

**KOD-4. `src/pages/rehberler/[slug].astro` — yazar/tarih/schema/sonraki-adım katmanları yok.**
→ (a) Başlık altına tarih + "Hukuki içerik: Av. Serdar Arslan" satırı (SayfaBasi'ye prop); (b) sayfa sonuna yazar kutusu (kısa nesnel bio + arslanhukuk.tr + /hakkinda linki — davet cümlesi YOK); (c) `Article` (author: Person) JSON-LD; (d) frontmatter'a `ilgili: [slug]` alanı + "İlgili rehberler" bloğu; (e) "Dikkat" bölümlerinin soru-cevaba dönüştüğü rehberlerde `FAQPage` JSON-LD. → P1 (E-E-A-T + güven), P3 (devam yolu). → YMYL içerikte sıralama sinyali + rehber→rehber→hakkında hunisi. → Efor: 1 gün (9 rehberin frontmatter'ı dahil).

**KOD-5. `public/s/sayfa.js:22-46` — scroll-reveal, render edilmemiş içeriği `opacity:0` bırakıyor.**
Yazdırma/PDF'te henüz "reveal" olmamış tablolar ve havza kartları BOŞ basılıyor (tam sayfa görüntülerde doğrulandı: 25 karttan 21'i, rehber tablolarının tamamı görünmez). P1/P2'nin rehberi dosyasına PDF olarak koyması gerçek senaryo. → Layout'a `@media print { .sv-reveal { opacity: 1 !important; transform: none !important; } }` + `beforeprint` dinleyicisiyle tüm hedeflere `sv-goster`. → P1+P2. → PDF/yazdırma bütünlüğü. → Efor: dakikalar.

**KOD-6. `src/pages/havzalar/[slug].astro:47` — boş veri "veri yükleniyor" diye etiketleniyor.**
Statik sitede hiçbir şey yüklenmiyor; Sakarya'daki dürüst "veri yok" kalıbıyla da çelişiyor. → `veri yok` + tarih kalıbına çevrilsin. → P2 (veri güvenilirliği algısı). → Tutarlı dürüstlük dili. → Efor: dakikalar.

**KOD-7. `src/pages/havzalar/[slug].astro` — "Bu havzada hukuki durum" bloğu yok (BRIEF taahhüdü).**
→ Havza frontmatter'ına `hukuk:` alanı (kapalı havza/kısıt durumu, yetkili DSİ bölgesi zaten var, havzaya özgü notlar + ilgili rehber slug'ları); şablonda künyenin hemen altında "Bu havzada hukuki durum" bölümü. İçerik Serdar'ın kaleminden, kaynak atıflı. → P1 (asıl bağlanma noktası) + P2. → Sitenin farklılaşma tezi ("veri + hukuk aynı ekranda") ilk kez gerçekleşir; taklit edilmesi en zor katman. → Efor: şablon yarım gün + 25 havza içeriği kademeli (Sakarya pilotuyla başlanır).

**KOD-8. `public/harita/index.html` — h1/metin/footer yok, ikinci bir menü kodu yaşıyor.**
→ Görseli bozmayan bir `h1` + tek paragraf açıklama (ekran dışı değil, alta bant) + standart footer; menü `UstMenu`/`menu.js` ile birleştirilir. → P2+P3 (menüde 1. sıradaki sayfanın boş sayfa olmaması). → Kod tekilleşir, SEO'da boş sayfa kapanır. → Efor: yarım gün.

**KOD-9. `dist/` çıktısında `suharitasi-dist.zip` ve `screenshots/` gibi yayın dışı dosyalar repo kökünde.**
Yayına sızma riski ve depo hijyeni. → `.gitignore` gözden geçirilsin; zip silinsin. → (iç düzen). → Efor: dakikalar.

**KOD-10. `public/robots.txt` — AI crawler politikası bilinçli seçilmemiş durumda.**
GEO stratejisi (TAKTİK-6) "alıntılanmak" üzerine kurulacaksa GPTBot/ClaudeBot/PerplexityBot engellenmemeli; mevcut dosyada bilinçli bir izin/engel satırı yok (varsayılan izin — fiilen doğru, ama kayda geçsin). → llms.txt eklenince robots.txt'ye yorum satırıyla politika notu. → P1+P2. → Efor: dakikalar.

---

## FAZ 4b — GÖRSEL (tasarım / hiyerarşi / yönlendirme)

**GÖRSEL-1. Tam ekran menünün pazarlama işlevi (kullanıcı memnuniyetsizliği kayıtlı).**
*Şerh: su simülasyonu headless'ta görülemedi; buradaki değerlendirme menünün BİLGİ MİMARİSİ hakkındadır, görsel kalitesi hakkında değil.*
Sorun: Overlay, masaüstünde zaten görünen 5 linkin aynısını tam ekran tekrar gösteriyor — tıklayana yeni hiçbir şey vermiyor; pazarlama işlevi sıfır, yalnız sahne değeri var. Ayrıca inline nav + "menü" butonu ikiliği kararsız bir desen.
Alternatifler (öncelik sırasıyla):
- **(a) Menüyü "sitenin vitrini"ne dönüştür:** 5 çıplak link yerine iki kolon — solda bölümler, sağda canlı içerik: son 3 rehber, "Su Kanunu taslağında son durum" satırı, öne çıkan havza. Su sahnesi zemin olarak kalır; menü her açılışta sitenin dolu olduğunu satar. → P1+P2+P3. → Menü, dekor olmaktan çıkıp keşif yüzeyi olur. → Efor: 1-2 gün.
- **(b) Overlay'i kaldır, inline nav'a "Rehberler" açılır listesi ekle:** 9 rehber tek tıkta görünür; su simülasyonu landing/hero'ya taşınır (sahne, araç olan menüden çıkar). → Efor: 1 gün.
- **(c) Mevcut overlay kalır, yalnız mobilde kullanılır;** masaüstünde buton gizlenir (bugün iki sistem yarışıyor). → Efor: saatler.
Karar kullanıcının; (a) pazarlama hedefine en çok hizmet eden seçenek.

**GÖRSEL-2. Sitede tek bir "buton" yok — CTA görsel dili tanımsız.**
Tüm eylem çağrıları çizgi/metin linki (keşfet →, kaynak linkleri). DESIGN diline uygun tek bir birincil CTA kalıbı (ör. akuamarin konturlu, kehribar hover'lı hap) tanımlanıp az ve stratejik kullanılmalı: havza sayfasında "havza raporu kapsamı", rehber sonunda "ilgili rehber", su-kanunu'nda "gelişmelerden haberdar ol". → P1+P2+P3. → Sonraki adımın İLK BAKIŞTA fark edilirliği (görünürlük kuralı). → Efor: yarım gün tasarım + yayılım.

**GÖRSEL-3. Rehber sayfalarında hiyerarşi tek düze: 10.000 piksel kesintisiz metin.**
→ (a) Başlık altına 3 maddelik "Özet kutusu" (kim/nereye/ne kadar sürede — P3'ün 5 saniyesi); (b) sağda yapışkan içindekiler (masaüstü) / üstte açılır TOC (mobil); (c) 81 il tablosu varsayılan katlanmış (`<details>`) — sayfa dibi yükü azalır. → P1+P3. → Uzun içerikte tutunma ve bölüme atlama. → Efor: 1 gün.

**GÖRSEL-4. Havzalar listesi salt metin; haritanın kendisi listede yok.**
Eldeki 25 havza GeoJSON'undan (data/havzalar/, 90KB) her kart için mini SVG siluet üretilebilir (build-time, statik). → P2 (görsel tarama hızı) + marka imzası. → "Su haritası" adlı sitenin havza listesi haritalı olur; kartlara tıklama iştahı. → Efor: 1-2 gün (build script).

**GÖRSEL-5. Footer tek satır ve yalnız dışa (arslanhukuk.tr) bağlanıyor.**
→ Üç kolonlu sakin footer: bölüm linkleri / veri kaynağı-yöntem linki / künye ("Hukuki içerik: Av. Serdar Arslan — Arslan Hukuk Bürosu" + kurumsal e-posta). TBB uyumu: künye bilgisi reklam değildir. → P1+P2. → Her sayfa dibi iç dolaşıma ve tek meşru iletişim kanalına açılır. → Efor: yarım gün.

**GÖRSEL-6. Landing'in "Yakında" sahnesi ile sitenin dolu gerçeği çelişiyor.**
Sahne (gece denizi, tipografi) marka olarak güçlü — korunmalı; ama kompozisyona "portalda bugün ne var" katmanı eklenmeli (üç kapı: GÖRSEL/KOD-2). *Şerh: koreografi headless'ta izlenemedi; kapıların animasyona nasıl gireceği canlı onayla.* → P1+P2+P3. → Efor: KOD-2 ile birlikte.

---

## FAZ 4c — TAKTİK (içerik / SEO / dönüşüm — öncelik sıralı)

**TAKTİK-1. E-E-A-T paketini tamamla (KOD-4 + hakkında genişletmesi).**
Sorun: YMYL (hukuk) içerikte Google'ın aradığı yazar kimliği/tarih/kurum sinyalleri eksik. → Rehberlerde yazar kutusu + tarih + Article schema; /hakkinda/'ya "içeriği kim, hangi yöntemle hazırlıyor, veri politikası nedir" bölümleri + `Person` JSON-LD; footer künyesi. TBB: tamamı bilgilendirme, davet cümlesi yok. → P1 (birincil), P2. → Beklenen etki: rehberlerin "kuyu ruhsatı iptal" tipi YMYL aramalarında sıralanabilmesinin ön şartı; mevcut içerik kalitesinin karşılığını alması. → Efor: 1-2 gün.

**TAKTİK-2. Su Kanunu bülteni — sitenin tek zaman-kritik varlığını lead'e çevir.**
Sorun: "Kanun bu yıl yasalaşacak" tezi sitenin kuruluş gerekçesi ama yasalaştığı gün haber verilecek tek bir kayıtlı kişi yok. → /su-kanunu/ ve taslak-takibi sayfalarına tek alanlı form: "Su Kanunu yasalaştığında ve taslak değiştiğinde e-postayla bilgilendirilmek istiyorum." Statik kısıt: Buttondown/Mailerlite embed veya Cloudflare Pages Function + Turnstile. TBB: hizmet pazarlaması değil, mevzuat değişikliği bildirimi — uyumlu. → P1+P2. → Kanun çıktığı gün: uyum ihtiyacı doğmuş şirketlerden oluşan sıcak liste — sitenin en değerli tekil varlığı olur. → Efor: 1 gün.

**TAKTİK-3. "Bölgesel su raporları" hizmet sayfası — gelir modeli 2'yi görünür kıl.**
Sorun: B2B rapor hizmeti (5-25k TL bandı) sitede hiç anlatılmıyor; P2 çıkmaz sokakta. → /raporlar/ sayfası: raporun kapsamı (rezerv, tahsis rejimi, kısıtlar, mevzuat riski), anonim örnek şablon/içindekiler, teslim süresi, kurumsal e-posta. Havza sayfalarından tek satır köprü: "Bu havza için kapsamlı veri-hukuk raporu hazırlanabilir →". TBB: veri/danışmanlık ürünü, avukatlık reklamı değil; dil "rapor kapsamı" üzerine kurulur. → P2 (birincil), P1. → İlk B2B talep kanalı açılır; havza sayfaları satış hunisine bağlanır. → Efor: 1-2 gün.

**TAKTİK-4. Rehber ağını içeriden ör: ilgili rehber + havza köprüleri + rehber gruplama.**
Sorun: 9 kaliteli rehber birbirinden ve 25 havza sayfasından kopuk; /rehberler/ düz liste. → (a) Her rehbere 2-3 "ilgili rehber" (KOD-4d); (b) rehber içinde geçen havza/il kavramlarından havza sayfalarına link; (c) /rehberler/ listesinde iki grup: "Süreç rehberleri" (P3) / "Uyuşmazlık rehberleri" (P1). → P1+P3. → Oturum başına sayfa sayısı ve konu otoritesi (topic cluster) sinyali. → Efor: 1 gün.

**TAKTİK-5. Kontrol listesi lead magnet'i: "Kuyu Ruhsatı Başvuru Kontrol Listesi (PDF)".**
lead-magnets çerçevesi: tek soruna dar çözüm + 10 dakikada tüketilir + e-posta karşılığı. Kuyu-ruhsati rehberinin zaten içerdiği akış tek sayfalık PDF kontrol listesine damıtılır; rehber içinden "listeyi indir" (content upgrade — jenerik popup'tan 2-5× iyi dönüşüm). E-posta yalnız (tek alan). TBB: bilgilendirme dokümanı. → P3 (hacim) + P1. → E-posta listesinin ikinci besleme kanalı; sondaj lead katmanının (gelir modeli 3) altyapısı. → Efor: 1 gün.

**TAKTİK-6. AI-arama (GEO) katmanı: llms.txt + alıntılanabilir tanım blokları.**
Sorun: "kuyu ruhsatı nasıl alınır" sorusu giderek ChatGPT/Perplexity'ye soruluyor; site alıntılanabilirlik için yapılandırılmamış. → llms.txt (site tanımı + önemli sayfalar); her rehberin ilk paragrafını bağımsız-alıntılanabilir tanım cümlesi olarak koru (mevcut yazım buna yakın); FAQPage schema (TAKTİK-1 ile); robots.txt'te AI crawler'lara bilinçli izin (KOD-10). → P1+P3. → AI cevaplarında "kaynak: suharitasi.com" — otorite hedefinin 2026 kanalı. → Efor: yarım gün.

**TAKTİK-7. Programatik il sayfaları: "kuyu ruhsatı [il]" × 81.**
Eldeki `data/il-kurum.json` (81 il × DSİ bölgesi × havza) zaten sayfa başına gereken veriyi içeriyor. → /kuyu-ruhsati/[il]/ şablonu: ilin DSİ bölge müdürlüğü, bağlı havza(lar) + havza sayfası linki, başvuru mercii, il özelinde kısıt notu + ana rehbere gövde linki. İnce içerik riskine karşı: her sayfada il-özgü veri bloğu şart, yoksa yayınlanmaz. → P3 (birincil, yerel aramalar) + P1 (yerel "avukat aramadan önceki" trafik). → Uzun kuyruk Türkçe aramalarda ölçekli görünürlük; sitenin veri varlığı SEO'ya dönüşür. → Efor: 2-3 gün (şablon + veri kontrolü), kademeli yayın.

**TAKTİK-8. Search Console'u haftalık döngüye bağla + Su Kanunu haber takvimi.**
Sorun: Search Console kuruldu (SIRADAKILER 6) ama sorgu verisi karar döngüsüne bağlı değil; Su Kanunu süreci (komisyon, Meclis, RG) öngörülebilir haber anları üretecek. → Haftalık: hangi sorgular gösterim alıyor → başlık/description ayarı; taslak-takibi her gelişmede güncellenip tarih damgası yenilenir (Google'a "canlı takip sayfası" sinyali). → P1+P2. → Efor: süreklilik, seans başına saatler.

---

## İLK 5 HAMLE (etki/efor oranı en yüksek)

| # | Hamle | Neden ilk 5 | Efor |
|---|-------|-------------|------|
| 1 | **Landing'i çıkmaz sokaktan çıkar** (KOD-1 + KOD-2 + GÖRSEL-6): meta description + nav + üç kapı | Üç personanın da ilk teması; bugün %100'ü duvara çarpıyor | Yarım gün |
| 2 | **E-E-A-T paketi** (TAKTİK-1 / KOD-4): yazar kutusu, tarih, Article+FAQ+Breadcrumb JSON-LD, hakkında genişletme | Mevcut 9 rehberin sıralama önündeki ana engeli; içerik hazır, ambalaj eksik | 1-2 gün |
| 3 | **Su Kanunu bülteni** (TAKTİK-2): tek alanlı e-posta kaydı | Zaman-kritik: kanun yasalaşmadan kurulmazsa fırsat kaçar; sitenin ilk dönüşüm mekanizması | 1 gün |
| 4 | **Rehber ağı + sonraki adım blokları** (TAKTİK-4 / KOD-4d): ilgili rehberler, havza köprüleri, gruplu liste | Her sayfanın çıkmaz sokaklığını bitirir; sıfır yeni içerikle dolaşım kazanır | 1 gün |
| 5 | **"Bu havzada hukuki durum" bloğu — Sakarya pilotu** (KOD-7) | Sitenin varlık tezi ve taklit edilemez katmanı; pilotla format oturur, 25'e yayılır | Yarım gün şablon + pilot içerik |

Sonraki dalga: bölgesel rapor sayfası (TAKTİK-3), kontrol listesi PDF (TAKTİK-5), menü vitrini (GÖRSEL-1a), il sayfaları (TAKTİK-7).

---

*Bu rapor cro, lead-magnets, copywriting (coreyhaines31/marketingskills) ve seo-technical, seo-content, seo-local (AgriciDaniel/claude-seo) skill çerçeveleri aktifken hazırlanmıştır. Görsel yargılar GPU'suz headless şerhine tabidir; nihai görsel onay kullanıcınındır.*
