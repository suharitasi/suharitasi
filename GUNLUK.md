# GUNLUK.md — seans notları

## 2026-07-14
- İş 1 (önceki oturum): 25 havza sayfasının tamamı havza-veri.json
  künyelerinden üretildi (commit 6aa5117).
- İş 2: il/kurum katmanı — data/il-kurum.json derlendi: 81 il → 26 DSİ
  bölgesi (her bölgenin resmî görev alanı sayfasından; 16. Bölge Ilısu
  Projesi'yle sınırlı, il ataması yok) + 25 havzanın il listeleri (SYGM
  tanıtım PDF'leri; eksik kalan Meriç-Ergene/Marmara/Batı Akdeniz/Batı
  Karadeniz/Asi doğru dosya adlarıyla SharePoint REST üzerinden bulundu;
  Fırat-Dicle listesi Fırat+Dicle alt havzası taşkın yönetim planlarından,
  Seyhan ve Konya Kapalı TÜBİTAK MAM HKEP il tablolarından) + 30
  büyükşehir su idaresi. Havza sayfalarına "İller ve yetkili kurumlar"
  bloğu, kuyu-ruhsati rehberine 81 il tablosu (IlKurumTablosu.astro)
  eklendi.
- İş 4: menü + içerik sayfaları görsel yenileme (su hissi) — public/s/
  altında 4 modül: imlec.js (damla imleç, lerp+durumlar, /harita/ hariç),
  su-sim.js (raw WebGL2 dalga simülasyonu, RG16F ping-pong; FPS<45 grid
  yarıya, <30 fallback; three.js gerekmedi), menu.js (tam ekran overlay,
  lazy sim, focus trap, ESC, scroll kilidi), sayfa.js (tek-observer
  reveal + sentinel'li yüzen nav). UstMenu tam ekran menü kazandı;
  Sayfa.astro'ya hero şeridi + blockquote/tablo/ayraç rötuşları; üç
  indeks "dergi" satır anatomisine geçti (numara + havzalarda veri
  rozeti). Landing'e tek satır imleç script'i; landing/harita görsel
  olarak korundu. Doğrulama (arac/tasarim-dogrula.mjs): 0 konsol hatası,
  sim canlı ~62 FPS, ESC/focus/reduced-motion/no-JS geçti, 42 iç link
  0 kırık, Lighthouse performans 96 (CLS 0.02). Yeni JS toplam 7,1 KB
  gzip (sim dahil). Kullanıcı onayı bekliyor.
- DERS (canlı test başarısızlığı): menü su simülasyonu, imleç ve hero
  şeridi headless denetimden geçti ama canlıda başarısız bulundu.
  Kök nedenler: (1) GPU'suz headless'a bakıp "çalışıyor" denmesi — oysa
  simülasyon fark edilmeyecek kadar kısıktı (ambient g=0.012/1.6s) ve
  FPS ölçümü menü giriş animasyonu sırasındaki karelerle yapılıp gerçek
  tarayıcıda erken+kalıcı fallback'e düşebiliyordu; (2) imleç CSS
  gradient'inin yumuşak alfa kenarı 12px'te "bulanık gri topak" görünümü
  vermesi; (3) hero degrade/konturunun görünmezlik sınırında kısılması.
  Düzeltme b32f7fa; üç yeni kural CLAUDE.md'de (GPU, görünürlük, iş
  kapanış).
- İş 5: tarayıcı öz-denetim altyapısı — @playwright/mcp@0.0.78 global
  kuruldu (18 MB; tarayıcı önbelleği zaten mevcuttu, 646 MB); .mcp.json
  headless chromium_headless_shell'e --executable-path ile bağlandı
  (MCP varsayılanı Chrome arıyor, yok). stdio smoke-test geçti; çalışır
  durumda RAM ~560 MB (MCP node ~210 + chromium süreçleri ~350).
  Protokol CLAUDE.md'ye eklendi; MCP'siz oturumlar için arac/oz-denetim.mjs
  (konsol + iç link + tam sayfa görüntü + menü etkileşim testi; headless
  yazılımsal-GL sürücü uyarıları etiketlenip ayrı sayılır). Deneme
  denetimi: 3 sayfa, 0 hata/uyarı, 31 iç link 0 kırık.
- İş 3: mevzuat rehberleri paketi — Apilex çıktısı (14.07.2026)
  kaynak/apilex-sumevzuat.md olarak kaydedildi; 9 rehber üretildi
  (kuyu-ruhsati, ruhsatsiz-kuyu-cezalari, kaynak-suyu-kiralama,
  su-tahsisi-oncelik-sirasi, yeralti-suyu-isletme-sahasi,
  kaynak-hakki-komsu-su, kuyu-belgesi-iptal-davalari, jeotermal-ruhsat,
  baraj-kamulastirmasi); taslak-takibi'ne Bölüm 12 tespiti ("su tahsis
  belgesi"/"su verimliliği belgesi" yürürlükte yok) eklendi. Karar
  künyeleri DOĞRULANMADI — yayın kilidi SIRADAKILER 17'de.

## 2026-07-12
- Repo sıfırdan kuruldu (önceki oturumun dosyaları kaydedilmemişti): derin-su
  landing, DESIGN.md, deploy dosyaları (_headers, robots, 404, favicon, og).
- Harita v1: Vite + MapLibre, il GeoJSON'u, hover/dokunma + bilgi kartı.
- Harita v2: AWS terrarium DEM ile koyu hillshade, Natural Earth nehir/göl
  katmanı, yükleme durumu.
- Kullanıcı atlas stilini seçti: v3 başladı — offline hipsometrik boyama
  (gdaldem, arac/atlas/), harita adası düzeni, atlas dili kart, kabarcık
  atmosferi (yoğuşma varyantı elendi). Canlı S3 tile bağımlılığı kaldırıldı.
- Harita v4 Faz 1: Three.js gerçek 3D arazi — heightmap (16-bit PNG + bin),
  CPU displacement, atlas dokusu, sınırlı orbit + paralaks, şeffaf sahne.
  MapLibre kodu src/harita-2d/ arşivinde. Faz 2 (gayzer) ve Faz 3 (cila)
  FAZ2.md/FAZ3.md'de tanımlı. Not: headless FPS ölçümü yazılım render'ı,
  gerçek GPU'da doğrulanacak.
- Faz 1 görsel düzeltme: pitch ~57°, kadraj dolduruldu, abartma 4.2x, alçak
  açılı ışık + NeutralToneMapping, kenarlar alphaMap+vignette ile suya
  çözünüyor. WebGL yoksa statik atlas yedeği eklendi.
- "Canlı model" turu: animasyonlu deniz/göl shader'ı (atlas maskesi, güneş
  parıltısı, kıyı geçişi), bulut gölgeleri (fragment enjeksiyonu), kamera
  idle drift, güneş salınımı, sürekli yaşayan gayzerler (işaret ışımaları +
  periyodik kendiliğinden fışkırma), kenar eteği geometrisi (alphaMap/vignette
  kaldırıldı), exposure 1.32. Geometri sağlığı denetlendi: 4.2x'te artefakt yok.
- Faz 2: gayzer etkileşimi — 7 su noktasında (göller/barajlar) hover/dokunma
  ile additive partikül sütunu + taban ışıması; reduced-motion'da statik
  işaret. 60 FPS doğrulaması gerçek GPU bekliyor (FAZ2 bitti tanımının
  açık kalemi).
- Faz 3A: giriş animasyonu (kamera uzaktan kadraja süzülür, reduced-motion
  atlar), mobil portre kadraj sığdırma (dinamik fov+mesafe), göl geometrileri
  tek mesh'e birleştirildi, mobil pixelRatio 1.5, FPS logu 5 örnekle sınırlı.
  3B (koreografi, seçim etkileşimi, son cila) kullanıcı yorumunu bekliyor.
- VIZYON.md oluşturuldu (Sondaj Anı + ileri teknikler envanteri); madde 1
  prototipi eklendi: gayzer tepe noktasında cam sıçraması (cam.js).
- Faz 3B: kamera koreografisi — su noktasına tıklayınca sinematik dalış,
  boşluğa/aynı noktaya tıklayınca kadraja dönüş; uçuşlar duvar saatiyle
  (yavaş cihazda süre sabit), uçuş sırasında OrbitControls devre dışı.
- Landing turu: Arslan kalkan logosu (arslanhukuk.tr assets'ten, currentColor)
  bakır imza olarak footer'a işlendi (tamamı arslanhukuk.tr'ye link);
  koreografiye imza dokunuşu eklendi — son kelime otururken altından tek
  akuamarin damar ışıyıp geçiyor.
- Nesne turu (v5): Türkiye sınırla kesilmiş extrude blok (üst rölyef +
  katman çizgili yan kesit + kapalı taban; sinir.py il birleşimi).
  Maskedeki il-arası sliver delikleri kapatıldı. Atlas doygun kalibre
  edildi (poster referans dosyası bulunamadı, hex bantlarına göre).
  Gayzerler haritadan kalktı, kenar fıskiyelerine dönüştü; su noktaları
  iki katman işaret (var/potansiyel) + krem etiket. Deniz ayrı yüzey,
  ufukta koyuya çözünüyor. EffectComposer bloom + ACES; orbit yaw ±60.
- Nihai sahne kurgusu (v6): deniz tepsisi kaldırıldı — Türkiye kütlesi koyu
  derin-su zeminde boşlukta, altında siluet ışıma havuzu. Kamera sabitlendi
  (orbit kapalı; dalış koreografisi kurgu gereği kaldırıldı), idle nefes +
  ±1° paralaks. Kenar gayzerleri ekran alt kenarına nefesli zamanlamayla
  yerleşti; yukarıdan 5-8 sn'de bir süzülen damlalar + çarpma parıltısı.
  İşaretler belirginleştirildi, kesit yumuşak sıcak toprağa çekildi.
- HEDEF.png atmosfer turu (7 iterasyon, kiyas-1..7 + kiyas-son):
  tüm karalar geri (kara maskesi), mat gri-yeşil su + güney teal, sıcak
  alçak ışık + altın çekirdek (radyal), yeşil kıyı/zeytin/altın/kızıl
  bantlar + orman benekleri, gölge + DOF + asılı damla bulutları + cam
  kavis gayzerleri; sonda-imleç spot ışığı eklendi. Mobil portre kadraj
  ortalandı.
- Yön değişikliği: 3D sahne src/harita-3d/ altına arşivlendi; /harita/
  hero'su artık HEDEF.png'nin kendisi (public/hedef-hero.webp q90, dokunulmadan,
  fade-in + preload; orijinal PNG referans/ altında repoda).
- Bant sorununa kesin çözüm: ImageMagick ile gerçek blur zemin dosyası
  (hedef-zemin.v1.webp) üretildi; koyu body zemini kaldırıldı; sürümlü
  dosya adlarıyla cache-bust. 1440x900 + 1280x1024 + mobil doğrulandı.

## 2026-07-14 (pazarlama danışmanlığı)
- GitHub skill kazısı: 25 aday puanlandı; marketingskills (39k★) +
  claude-seo (11k★) ~/.claude/skills/ altına kuruldu ve doğrulandı.
- 3 persona tanımlandı, 11 sayfa canlıda tarandı (0 hata, 0 kırık link),
  rapor/pazarlama-danismanligi.md yazıldı — salt analiz, site değişmedi.

## 2026-07-15 (Dalga 1: pazarlama raporu uygulaması)
- Landing çıkmaz sokaktan çıktı: üst nav + üç kapı; "Yakında" kalktı,
  sahne/koreografi korundu (kapı zemini damarlar metni kesiyordu, koyultuldu).
- E-E-A-T: künye satırı, yazar kutusu, Article/Person/Breadcrumb/Organization/
  WebSite JSON-LD (130 nesne, schema.org sözlüğüne karşı doğrulandı), og:image
  (marka fontlarıyla Playwright'ta üretildi, arac/og-uret.mjs).
- Rehber ağı: ilgili rehberler + süreç/uyuşmazlık kümeleri; Sakarya hukuk
  bloğu pilotu (havzaya özgü kısıt: doğrulanmadı — uydurulmadı).
- Yazdırma düzeltmesi kanıtlandı: print medyasında gizli .sv-reveal = 0/36.
  Not: PDF metin çıkarımı görünürlük kanıtı DEĞİL (saydam metni de çıkarır);
  yük taşıyan ölçüt hesaplanmış opaklık.
- AÇIK: bülten (Buttondown hesabı kullanıcıda), FAQPage (görünür SSS yok).

## 2026-07-15 (Dalga 2: menü vitrini)
- Tam ekran menü "5 çıplak link"ten keşif yüzeyine: sol bölümler +
  alt-etiketler, sağ vitrin (son rehberler, kanun son durumu, öne çıkan
  havza) — tümü build-time türetilir, elle metin yok (kanıt: kaynak→menü
  eşlemesi 5/5). Kademeli giriş tek sekans (75ms), KAPAT belirginleşti.
- İki menü kodu tekilleşti: /harita/ Astro sayfası oldu, ortak TamEkranMenu +
  menu.js kullanıyor; sayfanın kendi görünümü aynen. Kod incelemesinde kendi
  hatam yakalandı: transform'lu overlay içinde fixed katmanlar kaydırmada
  kayardı — kaydırma iç sarmalayıcıya alındı, KAPAT sabitliği testle kanıtlı.

## 2026-07-16 (HENDEK FAZ 1: EPİAŞ baraj pipeline)
- EPİAŞ dams endpoint'leri doğrulandı (aktif doluluk % + kot + hacim,
  havza parametreli; auth=TGT; 401 auth'suz teyitli; lisans "kaynak
  göstererek" — girişli ekran teyidi kullanıcıda). Pipeline sıfır
  bağımlılık: ham arşiv değiştirilmeden + normalize seri + günlük cron.
- Uydurma yasağı koda gömüldü: geriye dönük veri üretilmez, başarısız gün
  "veri alınamadı" işaretlenir, ortalama yalnız gerçek kayıttan "N gün"
  ibaresiyle. Mock testte iki yol da kanıtlandı; görsel kanıt alınıp test
  verisi iskelete döndürüldü. Gerçek çekim kullanıcının .env'ine kilitli.
- Kimlik geldi → İLK GERÇEK ÇEKİM: TGT 201, 17 havza / 116 baraj / 64 kayıt;
  kayıt başlangıcı 16.07.2026. EPİAŞ seti sitedeki 25 havzanın 17'sini
  kapsıyor (Fırat-Dicle yok — kaynak şerhi düşüldü). Cron yarın 18:00 TR'de
  devralır.

## 2026-07-16 (HENDEK FAZ 1-B: GRACE su nabzı)
- Kaynak yarışı test edildi: GSFC mascon AÇIK (200, tokensız) kazandı;
  JPL 302→login, CSR 000, UNL yalnız PNG. 530MB NetCDF indirildi (sha256
  git'te; ham dosya GitHub 100MB limiti nedeniyle sunucu arşivinde).
- 25 havza alan-ağırlıklı TWS anomali serisi çıkarıldı (254 gerçek ay;
  34 eksik ay dolgusuz). Sakarya son 5 yıl: -0,70 cm/yıl (60 aydan).
  Havza sayfalarına eğilim göstergesi + tam şerh seti; haftalık cron.
- VARSAYIM DÜZELTMESİ: GRACE "yeraltı suyu" değil TOPLAM su depolaması
  değişimi ölçer; site dili ve başlık buna göre kuruldu (dur/sor yerine
  raporla kuralı gereği not düşüldü).

## 2026-07-16 (280 karakter öz-cevap katmanı)
- "Cevap önce, dayanak sonra" (CLAUDE.md) 9 rehber + 25 havza sayfasına
  geriye dönük uygulandı: başlık altında damıtılmış öz-cevap kutusu
  (akuamarin kenar, su-tonlu zemin). Rehber özleri elle her sayfanın
  DOĞRULANMIŞ metninden damıtıldı (madde no korundu, künye no verilmedi —
  hepsi "doğrulama sürecinde"); havza özleri havza-veri.json + GRACE
  eğiliminden otomatik türedi (eksik alan jenerikle doldurulmadı).
- Meta description'lar artık öz-cevaptan türüyor (rehberde Article JSON-LD
  description de). Kanıt: meta==kutu 34/34; uydurma kontrolü — öz-cevaptaki
  her madde/kanun no kaynak metinde mevcut, hiçbirinde dava künyesi yok;
  liste/statik sayfalara sızıntı yok; build temiz.

## 2026-07-16 (HENDEK FAZ 2: il rejimi — araç + 81 il sayfası)
- Tek mimari kuruldu: il-profil.js üreticisi hem /arac/il-rejimi/ aracını
  hem /kuyu-ruhsati/[il]/ statik sayfalarını besliyor (çift bakım yok);
  GRACE eğim hesabı da grace-hesap.js'te tekilleşti.
- İnce içerik eşiği dürüst uygulandı: 81/81 il 3+ gerçek unsurla geçti.
  Duplicate/uydurma/sitemap/JSON-LD kontrolleri temiz; JS'siz erişim
  kanıtlı. Build 125 sayfa.

## 2026-07-16 (Tasarım anayasası FAZ 0)
- DESIGN.md 2.0: zanaat sistemleri eklendi (font üçlüsü + mono öneri
  gerekçeli, kicker imzası, kart kimlikleri düz-ton kararıyla, tanımlı
  easing/durum sözlüğü, veri bandı, iki hız sınıfı, başarısızlık listesi).
  Eski "akuamarin aydınlıkta yasak" kuralı çift-ton kuralına evrildi.
- /stil-pilot/ örnek sayfası yayında (noindex): kuyu ruhsatı rehberi yeni
  dille. Cormorant'ta ₺ glifi yok bulgusu → veri bandında rakam "0"a
  çevrildi. FAZ 1-3 kullanıcı onay kapısının arkasında.

## 2026-07-16 (Yön yükseltmesi: SU-DİLİ FAZ 0 tamamlandı)
- Anayasa 3.0: dil suyun kendisinden — derinlik skalası HEDEF görselinden
  px-örneklemeli (yüzey #E9EBE7 / sığ #4F7B78 / derin #175E56 / dip
  #0C332C), akuamarin kıyasta elendi; 4 su-ivmesi eğrisi; kırılma
  vurgusu; kot cetveli; TEK MOD; kıyaslar (2 skala + 2 tipografi) kayıtlı.
- HEDEF sahnelendi: 1x/2x AVIF(85/179KB)+WebP+JPEG + 488B LQIP; iki menü
  varyantı (A sol-üst dikey / B alt-kenar yatay), renkler görselden,
  AA kanıtlı, overlay çalışır. Denetimde 2 başarısızlık yakalanıp
  düzeltildi: dokunma hedefleri 37→47px; A'nın alt linkleri kara
  dokusuna taşıyordu → kolon gök bandına sıkıştı, mobilde denize inip
  köpüğe döndü. WebGL rafa.

## 2026-07-17 (SU-DİLİ FAZ 1: 116 iş sayfası giydirildi)
- 5 tür 5 commit'te (kesinti dayanıklılığı): çekirdek token seti v3
  skalasına (Sayfa.astro — tüm sayfalar tek merkezden), kicker/BÖLÜM/
  kırılma vurgusu/kot cetveli/kart aileleri türlere yayıldı; koyu dünya
  (menü+su-sim shader) DİP paletine geçti.
- Denetim 4 başarısızlık yakaladı, dördü düzeltildi (çifte bant, scrim
  z-index, 26px dokunma hedefi, 4.42:1 kontrast). Lighthouse: il sayfası
  4×100, rehber 97/100. Görsel slotlar tek-config sözleşmesiyle hazır.

## 2026-07-17 (CC root→suha taşıma)
- Proje mv+chown ile /home/suha altına (güvenlik-doğru: /root'a traverse
  izni açmak yerine tam izolasyon). Tüm hardcoded /root/ yolları güncellendi
  (grep=0), playwright cache kopyalandı. suha: sudo+SSH+CC bypassPermissions.
- Pipeline suha'da uçtan uca kanıtlandı; baraj-gunluk.sh'te önceden var olan
  bir bug bulundu (git add UYARI-BARAJ.md yokken exit 128 → günlük veri hiç
  commit edilmiyordu) ve düzeltildi. Cron suha'ya taşındı, root boşaltıldı.
- Güvenlik: token remote URL'den credential store'a alındı (borç kapatıldı)
  AMA token çıktıya sızdı → İPTAL+yenileme kullanıcıda.

## 2026-07-21 (HATA KAYDI + KURAL: brief ön-denetim kontrol listesi)
- HATA: Menü reformu brief'inin ilk sürümü denetlenemez/belirsiz şartlar
  taşıyordu (bit-kıyas beklentisi, gerçek cihaz testi, tanımsız breakpoint,
  "mock bulunur" varsayımı). DERS: denetlenemez şart briefe yazılmaz —
  ölçülebilir kritere çevrilir ya da açık şerhle kullanıcıya devredilir.
- YENİ KURAL (her brief tesliminden ÖNCE zorunlu ön-denetim listesi):
  1. Her referans (dosya, mock, commit, yol) somut mu, yoksa "bulunur
     varsayımı" mı?
  2. Her bitti-tanımı/şart ortamda GERÇEKTEN denetlenebilir mi?
     (denetlenemezler ölçülebilire çevrilir ya da kullanıcıya devredilir)
  3. Belirsiz parametre kaldı mı? (breakpoint, eşik, tolerans — tanımsızsa
     "dur ve sor")
  4. Kapsam dışı liste tam mı, brief kendi içinde çelişiyor mu?
  Bu liste geçilmeden brief teslim edilmez; geçemeyen brief düzeltilir.

## 2026-07-21 (FAZ A-ÖN: landing header birleştirme — tek kaynak)
- Landing public/index.html → src/pages/index.astro; header tek kaynağa
  indi: UstMenu.astro tema varyantı (aydinlik/koyu). Eski dosya silinmedi,
  arsiv/landing-statik/'e taşındı (route çakışması çözümü).
- Görsel değişmezlik kanıtla: pixelmatch %0,000 fark (1440+375, reduced-motion
  deterministik kare), computed-style birebir, canlı↔yerel SEO/GEO diff eşit,
  kelime animasyonu frame dizisiyle aynı. Denetimde 1 gerçek sızıntı yakalandı
  ve düzeltildi (çıplak `nav` seçicisi koyu dala scoped-cid ile sızıp şeridi
  büyütüyordu → `.ust nav`).
- Kanıt: cikti/denetim/faz-a-on/. FAZ A (menü reformu) kullanıcı onayı
  bekliyor; push yok.

## 2026-07-21 (FAZ A+B: site-geneli mobil menü reformu — dar şerit)
- Mock (faz2-sakarya-mobil-menumock.jpeg) tek kaynaktan koda: ≤640px'te
  header tek dar şerit (marka + MENÜ; içerik 226,4→85,8px, landing
  104,6→84,8px, hedef 85±4). Satır-içi linkler yalnız görsel katmandan
  çekildi (DOM'da gerçek <a>, JS'siz crawl); gezinme tam-ekran panelde.
  Yeni JS 0 bayt (davranış mevcut menu.js).
- Denetim CANLIDA DA VAR OLAN bir hata yakaladı: landing'de <main>
  (translateY) header'a binip masaüstünde 5/5 nav linkinin tıklamasını
  yutuyordu → header.koyu z-index düzeltmesi (görsel fark 0 piksel,
  elementFromPoint + pixelmatch kanıtlı).
- Lighthouse ilk ölçümde 85 görüldü → A/B analizi (reform ↔ eski build
  eşzamanlı 3'er tur) dalgalanmanın her iki build'de aynı olduğunu
  gösterdi (medyan 96): localhost gürültüsünü eşik ihlali sanma —
  A/B'siz karar verme. Kanıt: cikti/denetim/menu/. PUSH YOK, onay kapısı.

## 2026-07-21 (FAZ 3: /harita/ canlı veri paneli — 25 havza kartı)
- Hero altına build-time statik panel (HavzaPaneli): kartlar GRACE
  son-5-yıl eğimine göre sıralı ("veri seçer"), eşik A (≤-1,5 → 5 kritik,
  kullanıcı onaylı), mobil iki kolon (onaylı), YAS rezerv satırı dosya
  kanıtıyla havza-bazlı çıktı ve kaldı (brief'in "ulusaldır" tespiti
  dosya doğrulamasıyla düzeltildi). Tahsis 0/25 ve baraj 17/25+5gün
  karta girmedi (veri dürüstlüğü).
- Hero dokunulmazlığı pixel kanıtlı (%0,000, 1440+375); Lighthouse
  medyan 74→75. Doğrulama yine gerçek kusur yakaladı: sparkline düzlük
  ölçüsüne sıfır-çapası karışıyordu (sabit seri "oynak" sanılırdı) —
  seri-yayılımı/çizim-ölçeği ayrıldı, sentetik seriyle test edildi.
- Yön dili mock'taki ara eşikten TEK bakım noktasına (grace-hesap ±0,5)
  çekildi — sayfalar arası dil tutarlılığı mock sadakatinden önce gelir
  (raporda gerekçeli sapma). PUSH YOK; kanıt: cikti/denetim/faz3/.

## 2026-07-21 (KAPANIŞ: sunum reformu zinciri canlı onayı)
- 21.07 push d2fea9d..fd4ec5e canlı; kullanıcı canlı testini bu kaydın
  yapıştırıldığı mesajla onayladı (zincir: 2b, 2c, A-ÖN, FAZ A menü,
  FAZ 3 panel).
- Fable periyodik denetim sayacı: sunum reformu zinciri iş briefi sayımı
  (2b+2c birleşik=2, A-ÖN+A birleşik=2, FAZ 3=1 → +5; önceki 2/5 → 7,
  eşik 5 AŞILDI — yeni tur denetim Fable'da beklemede).

## 2026-07-21 (Opus tarafı: izleme v3 + belge arşivi + Opus paketi A-E)
- Su Kanunu izleme sistemi v3 KURULDU: izleme/ (su-izleme.sh + lib/motor.py +
  hedefler.conf + anahtar-kelimeler.txt), 11 hedef (M1 RG deterministik + M2
  TBMM + M3 Bakanlık/DSİ fark motoru). T1-T5 kanıtlı (KURULUM.md
  cikti/denetim/su-izleme/). Cron 05:30+16:00 UTC kuruldu; saglik-bekcisi'ne
  su-izleme tazelik kontrolü (DURUM.md ≥14s) eklendi. İlk GERÇEK cron fire
  16:00 UTC — canlı teyit beklemede.
- Opus periyodik denetim sayacı: denetim-2 (2ba78e5) sonrası BİTMİŞ işler —
  toparlama v2, kaynak keşfi v2, izleme kurulumu v3 → **+3**. Eşik 5;
  **mevcut 3/5 — henüz aşılmadı.** NOT: Opus paketi (A-E, 5 bölüm) SÜRÜYOR;
  bölüm sayımı PAKET SONU'nda yapılacak (yalnız TAMAM biten bölümler eklenir).

## 2026-07-21 (KAPANIŞ: Opus paketi A-E)
- 5 bölüm tamamlandı (her biri kendi commit'i): A belge arşivi (7abccc1) ·
  B kayıt (5313961) · C UYAP künye teyidi (4a597db) · D SEO/GEO denetim skill
  (b1dcd3e) · E NACE Ek-2 + KAP (f7696d5).
- Şerhler (dürüst kısmi sonuç, uydurma yok): C — meysu taslağında künye yok
  (UYAP sorgusu gereksiz). E — Ek-2 ayrı TARANMIŞ ekte (OCR'sız ayrıştırılamaz,
  liste üretilmedi); KAP API Next.js'e taşınmış, eski byCriteria 500 → erişilemedi
  (sahte kayıt yok). D — ilk taramada 131 sayfa/215 bulgu tespit edildi (düzeltme yok).
- Opus periyodik denetim sayacı: önceki 3/5 + paketin 5 TAMAM bölümü (A-E; hepsi
  deliverable üretti — E şerhli ama tespit/rapor deliverable'ı tam) → **8/5**.
  **Eşik 5 AŞILDI → yeni tur Opus denetimi beklemede.**

## 2026-07-21 (Ödül-üstü Faz 1 + Toplu Canlı v3)
- **Ödül-üstü Faz 1 (Sözlük ve Borç v2)** yapıldı+push (68e340a): koreografi/
  sözlük tek kaynağa (src/styles/hareket.css; .gk kopyası 0), --e-suzul yayılımı
  (HavzaPaneli/harita/Bulten/su-kanunu; istisna adayları landing-shared chrome +
  hero reveal + pilotlar, karar kullanıcıda), sayı-canlanma (public/s/canlan.js,
  opt-in [data-canlan], yalnız gerçek büyüklükler — yıl/küçük sayım hariç,
  kullanıcı kararı). Kanıt: piksel regresyon %0,0000 (12/12), Lighthouse A/B
  düşüş yok (sakarya 87→91, kuyu 82→92, harita 68→70), konsol 0, 375px taşma 0,
  JS bütçe ham gzip 992B/min+gzip 473B ≤1KB (cikti/denetim/faz1-odul/RAPOR.md).
- **21.07 kullanıcı kararı:** bekleyen işler peşin onaylı canlıya; /deneyim/
  menüye; bu kapsam için canlı-öncesi onay kapısı kaldırıldı, kanıt üretimi
  devam eder (İş kapanış kuralı bu brief kapsamında askıya alındı, peşin onay).
- **/deneyim/ menüye** (ayrı commit, Faz-1-sonrası ayrı iş): UstMenu +
  TamEkranMenu tek kaynaklarına "Deneyim" kalemi (mevcutların sonuna). Landing
  masaüstü nav birebir (Deneyim/Vakalar landing'de gizli, A-ÖN şartı; pixel
  1440 %0,0000). Kanıt: 375px kapalı şerit landing 85px/içerik 86px (85±4),
  açık panel yatay taşma 0, panel taşma 0, Deneyim panelde; içerik nav 7 kalem
  700px'te bile taşma 0; /deneyim/ 200. (cikti/denetim/deneyim-menu/)
- src/harita-3d/: arşivde kalır — hiçbir sayfadan import edilmiyor, route
  üretmiyor (teyit edildi); deneyim.astro harita-3d kullanmıyor.

## 2026-07-21 (Ödül-üstü FAZ 7 — Sonuç Zinciri, AŞAMA 0+1+2)
- **AŞAMA 0** (162d182): ODUL-USTU FAZ 7 çatısı (zincir + sektör kapıları +
  pazarlama kanalları) + uygulama sırası 1→7→2→3→4→5 + DİL NOTU (TBB-çekingen
  dil kaldırıldı). data/lead/persona.json (11 persona; yeşil belge son başvuru
  27.12.2029 doğrulandı — yönetmelik md.3 "5 yıl" + yürürlük 2024-12-27).
  NACE Ek-2 (taranmış PDF) + KAP (API taşınmış) uydurulmadı → kullanıcı görevi.
  rapor/: sorgu-haritasi, geo-nabiz-plan, persona-turetme.
- **AŞAMA 1** (88c7a72): 12 madde mock/şablon/iskelet — sektör kapısı+persona
  mock, ceza iskeleti, bülten HTML, Türkiye Su Raporu iskelet, LinkedIn kart
  altyapısı+3 kart, webinar, iç bağlantı planı, künye şema, soru havuzu 40,
  vaka adayları. Kullanıcı onayı: rota /durumum/ + risk dili.
- **AŞAMA 2** (27dd472): /durumum/ giriş (persona ızgara + arama durumum.js
  ≤2KB progressive + eş-anlam) + 11 persona sonuç sayfası (hüküm + sabit tarih
  27.12.2029 + kalan-gün progressive + risk bloğu onaylı dil + ilk adımlar +
  çapraz bağ + iletişim + FAQPage). Menüye Durumum (landing nav birebir). İçerik
  yalnız persona.json (uydurma yok; hukuki [APILEX]). Kanıt: öz-cevap+FAQPage+
  sabit tarih JS'siz DOM; konsol 0; nav/375 taşma 0. Palet ayrı iş (mevcut
  SU-DİLİ değişkenleriyle). Push+canlı; kullanıcı canlı testi açık.

## 2026-07-22/23 (kayıt: palet, güvenlik, cache)
- FAZ 8 palet C canlıda (adc56f2); kullanıcı canlı testi ERTELENDİ — nihai
  görsel onay beklemede.
- Güvenlik taraması (claude-security, tüm repo, medium): doğrulamayı geçen
  bulgu YOK; rapor CLAUDE-SECURITY-20260722-195547/, commit dışı.
- Cache/purge işleri gündem dışı (site inşaat halinde, ziyaretçi yok) —
  canlı kontrolde hard refresh yeter.

## 2026-07-23 (Ana sayfa AŞAMA 1 — 6 sahne + 7 süzülen soru mock'u)
- Kod yok, DUR'lu. Çıktı: cikti/denetim/anasayfa-sahne/ (mock.html + RAPOR.md +
  1440/375 ekran + kıyas kareleri + 3 JSON ham veri).
- ÖLÇÜM: ana sayfa LH tabanı masaüstü 99 / mobil 89 (3 tur medyan, commit
  3900461); LCP elemanı h1, transfer 187KB. Taban yüksek — sahne akışı bunu
  koruyamaz, düşüş seviyesi kullanıcı kararına bırakıldı.
- ÖLÇÜM: kartçık okunaklılığı 6 kare × 3 bölge. A (YÜZEY plakası α.90) en kötü
  11,82:1; B (koyu tül α.75) 6,24:1; brief'te önerilen "yalnız gölge/kenarlık"
  hali 1,07:1 → ELENDİ, B "koyu tüllü" olarak yeniden tanımlandı.
- TESPİT: palet-video uyumsuzluğu gerçek — kare ortanca ton açıları 60/38/147/
  177/21/88°, C ekseni 198°. Kartçık sahneye ait olmayan "enstrüman katmanı"
  olarak tasarlandı; köprü unsuru kehribar.
- 7 hedef link canlıda 200 (3. sorunun hedefi ceza sayfası çıkınca güncellenir).
- Kartçık revizyonu v3 (aynı gün, geri bildirim üzerine): R1 küçültülmüş kartçık
  (%40→%26) ↔ R2 alt şerit üçlü kıyası; çıktı cikti/denetim/anasayfa-sahne/rev1/.
  ÖLÇÜM 1: hedef satırı (kehribar #875518) plaka α .70/.75/.80/.90'da sırasıyla
  2,70/3,06/3,48/4,41 — hiçbirinde AA yok; eşik α≈0,92. Koyu kehribar #6B4412
  α.80'de 4,64 (yeni hex = onay ister). Soru metni her alfada geçiyor.
  ÖLÇÜM 2: yuva haritası — 6 sahne × 5 kare × 20 aday yuva detay enerjisi;
  sahne 2'de tek sakin yuva var → Y2 orada uygulanamaz.
  ÖLÇÜM 3: dokunma — görünmez pad'in ilk hali (::before z-index:-1) hit-test'te
  ÇALIŞMADI, saydam ::after ile düzeltildi; şerit 31px görsel → 44px etkin.
  375'te R1 tüm sorular tek satır; R2'de 7'de 1 soru 4px kırpılıyor.

## 23 Temmuz 2026 — Ana sayfa AŞAMA 2 (kod): 6 sahne + 7 süzülen soru

Ana sayfa yeniden yazıldı. Koyu hero + kelime koreografisi kalktı; 6 sahnelik
scroll-scrub akışı sayfanın açılışı oldu. Sorular R2 alt şeritte: 1440'ta tek
şerit iki yuva (aynı anda 2 soru), 375'te tek yuva; ritim kaydırma yüzdesinden
türer (7 eşit dilim), zamanlayıcı yok. Şerit zemini α.80, hedef satırı yeni
`--kehribar-koyu #6B4412` (DESIGN.md §2'ye eklendi; kritik-vurgu `#875518`
değişmedi). Akış sonunda iniş bölümü: h1 + öz-cevap + 6 persona kartı +
/durumum/ bağı. `/deneyim/` rotası kapandı (301 → /), menüden kalktı; eski
landing ve deneyim sayfası `arsiv/` altına taşındı (geri dönüş yolu açık).

Ölçüm: LH 3-tur medyan masaüstü 99 / mobil 85 (eşikler 85 ve 70). Şerit
kontrastı en kötü karede soru 8,17:1, hedef 4,75:1 — α.80 + `#6B4412`
bileşiminin AA'yı geçen tek bileşim olduğu rev1 bulgusu doğrulandı.

**Ders (yükleme):** motorun `loading="lazy"` posterleri iş görmüyordu — tüm
sahne `<img>`'leri sabit ve kadraj içinde olduğu için tarayıcı hepsini
"görünür" sayıyor. Ölçmeden "lazy" demek yanlış olurdu: ilk yük 8 dosya /
3972 KB çıktı. Poster erteleme + `diveScroll` 1,4→1,6 ile ilk yük 2 dosya /
1657 KB'ye indi. Vendor'a dokunulmadı.

**Ders (denetim):** altı görsel hata yalnız ekran görüntüsüne BAKARAK
yakalandı (krem letterbox, boş rota etiketi, belirsiz şerit okunuşu, ipucu
kontrastı, footer boşluğundan sızan sahne, sabit menünün footer'ı örtmesi).
Sayısal öz-denetim hepsinde "0 hata" diyordu. Ölçüm bakmanın yerini tutmuyor.

## 23 Temmuz 2026 (2) — Canlı test düzeltmeleri: CSP, kadraj, hedef

Kullanıcı canlıda üç belirti bildirdi: sahneler açılmıyor, sağda sahne adları
görünüyor, soru şeridi görülmüyor. Üçü de ayrı arıza çıktı, üç ayrı commit'le
kapatıldı (385be5a, aff6fd2, a45e786).

**Ders (asıl olan):** ana sayfayı "kanıtlanmış" ilan ettim, ama tüm ölçümü
`python3 -m http.server` üzerinde yapmıştım — o sunucu `_headers`'ı
UYGULAMIYOR. Sitenin CSP'sinde `media-src` yoktu; `default-src 'self'` motorun
`blob:` video kaynağını reddediyordu ve 6 sahnenin hiçbiri canlıda oynamıyordu.
Yerelde her ölçüm yeşildi. Üstelik `fetch` 200 dönüyordu (connect-src izinli),
engellenen yalnız decode'du — yani "videolar iniyor" diyen ağ ölçümü de beni
doğruluyordu. Artık `arac/dist-sun.mjs` var: dist'i CSP + _redirects ile
servis eder. **Kural: üretim başlıklarını taşımayan ortamda alınan kanıt,
kanıt değildir.**

**Ders (teşhis):** brief "(a) ve (b) tek arıza olabilir, alt metin görünüyordur"
diye bir hipotez veriyordu. Ölçtüm, çürüdü: tüm sahne `<img>`'lerinde `alt=""`.
Görünen şey motorun rota etiketiydi. Hipotezi doğrulamadan uygulasaydım yanlış
yeri düzeltirdim.

**Ders (iki yönlü hata):** şerit görünürlüğü tek bir "aşağıda kalmış" sorunu
değildi — 1440'ta kadrajı 11px ÖRTÜYOR, 375'te 181px KOPUYORDU. Tek kırılımda
bakıp düzeltmek diğerini bozardı. Çözüm sahne kabını kadrajın kendisi kadar
yapmak oldu; şerit artık her kırılımda kadrajın 12px altında.

**Kaza (kayıt):** revert'lerin temiz uygulandığını sınarken `git reset --hard`
kullandım ve commit'lenmemiş iki cron log dosyasındaki 23.07 satırları gitti
(`data/arsiv/baraj/log/cron.log`, `data/arsiv/grace/log-2026-07.log`).
Veri dosyaları etkilenmedi, loglar sonraki koşuda yeniden yazılacak. Sınama
için ayrı bir worktree kullanmalıydım.

## 23 Temmuz 2026 (3) — Sürekli site sağlık sistemi

Tek script (`arac/site-saglik.mjs`), üç mod, 10 kontrol, iki cron (07:30 +
19:30 UTC). Sınırlı otomatik onarım: CSP direktifi (yalnız izinli-kaynaklar
listesinden), kaybolan 301, sitemap'te 404. Performans, tasarım, içerik,
JSON-LD şeması, veri kaynağı, mimari = kara liste, DUR + bildir.

**Sistem daha ilk koşusunda işe yaradı:** persona.json'da üç rehber bağı
yanlış slug'a gidiyordu, canlıda 404'tü. Kimse fark etmemişti. Sistem
bunları otomatik onarmadı (hedef 301 zinciriyle bulunamıyor → devret) ve
doğru davrandı; elle düzelttim.

**Ders (ölçüm aracı da yanlış ölçer):** `--test` senaryolarını yazarken iki
kez kendi aracım beni yanılttı. (1) Sanal sunucu sabit port kullanıyordu;
çöken bir koşudan kalan zombi süreç portu tutunca yeni sunucu SESSİZCE
bağlanamadı ve 7 senaryonun 5'i eski kopyayı ölçüp "kaldı" dedi. (2) Senaryo
regex'i `_headers`'ın YORUM bloğundaki `media-src` ifadesini yakalayıp gerçek
direktifi bırakıyordu. İkisi de "kanıt üreten aracın kendisi kanıtlanmalı"
dersinin örneği; ikisi de rapora yazıldı. Artık sunucu imza dosyasıyla
doğrulanıyor, doğrulanamazsa koşu hata ile duruyor.

**Kayıt (brief varsayımı düzeltildi):** brief "5 otomatik commit'çi" diyordu;
depoda 3 vardı (baraj, GRACE, su-izleme), site-saglik 4. oldu.
`saglik-bekcisi.sh` git işlemi yapmıyor — kilit takılmadı, gerekçesi yazıldı.

Açık kalan: /harita/ öz-cevap + JSON-LD yok (kara liste, kullanıcı kararı);
SMTP bilgileri beklemede.

## 23 Temmuz 2026 (4) — /hangi-kurum/ yetkili kurum rehberi + brief-denetci ön kapı
- Brief denetçisi (arac/brief-denetci.mjs, T1-T8) KURULDU; her brief artık dosyaya
  yazılıp denetçiden geçer + düşman geçişi (D1-D4) + amaç özeti (3b). Öz-denetimde
  use/mention meta-artefaktı belgelendi (rapor/brief-denetci.md).
- /hangi-kurum/ sayfası: build-time hangi-kapi.json (20 işlem) + su-birimleri.json
  (155 kurum) + su-islemleri.json'dan üretildi; üstte tek-tık filtre (details,
  progressive), altta JS'siz tam tablo (GEO). İçerik uydurulmadı; kurum id çözümü
  0 kırık, durum 11/5/3/1 JSON'la birebir. FAQPage yalnız doğrulanmış 11 satır.
- Kanıt: masaüstü LH 98 / mobil 85 (eşik ≥90/≥70 geçti), kontrast tümü AA, konsol 0,
  375 yatay taşma 0, iç link 0 kırık. cikti/denetim/hangi-kurum/RAPOR.md.
- SÜREKLİLİK: site-saglik.mjs'e md11-veri-butunlugu (JSON geçerli mi + kayıt azaldı
  mı🟡 + şema tanınıyor mu); /hangi-kurum/ çekirdek sayfa listesine eklendi.
- KARAR/UYDURMA: brief "tel" istedi ama doğrulanmış numara yok — icat edilmedi,
  onaylı e-posta+künye kalıbı kullanıldı (numara verilirse eklenir).
- DURUM: KULLANICI ONAYI BEKLİYOR (canlı test). Menü iki kaynağa da eklendi.

## 2026-07-24 (ana sayfa: menü arızası FAZ 1 + iki ders)
- MENÜ ARIZASI DÜZELTİLDİ (v3 FAZ 1, tek commit). Kök neden REGRESYON DEĞİL,
  eski arıza: `html.akis-bitti .ust-sabit{opacity:0;pointer-events:none}` —
  kaydırma dibe ulaşınca (akis-bitti) menü şeridi ölüyordu; tetik tarayıcı
  scroll-restorasyonu (dipteyken ana sayfaya dönünce menü açılışta ölü).
  Scroll 0'da çalıştığı için gözden kaçmıştı. Düzeltme: menü akış dibinde
  söndürülmez, aydınlık iniş üstünde okunaklı+açılır kalır (token aydınlığa
  çevrilir; C paleti). Kanıt: cikti/denetim/menu-arizasi/RAPOR.md.
- DERS 1 (HATA KAYDI + KURAL): "Hareket kararı STATİK kareden onaylanamaz.
  Süzülme/animasyon içeren her mock kare dizisi (0/0.5/1/1.5/2/3 sn) ile
  sunulur; tek kare yeterli sayılmaz." Aşama 2 A-güverte kararı statik
  karelerle alınmıştı → kullanıcının istediği hareket/albeni görünmedi.
  FAZ 2 mock'u bu kurala uyar.
- DERS 2 (HATA KAYDI + KURAL): "Sağlık sistemi VARLIK denetler; İŞLEV
  denetlenmezse arıza kullanıcıya kalır." site-saglik'in 10 kontrolü de
  varlık (200/link/konsol/medya) test ediyordu; hiçbiri etkileşim denemiyordu
  → menü arızası sistemden kaçtı. EKLENDİ: md12 ETKİLEŞİM DENETİMİ (headless
  tıklama, config izleme/etkilesim-beklenen.json). Kural: "Her yeni etkileşimli
  öğe md12'ye bir kontrol satırı ekler." Falsifikasyonla kanıtlandı (bozuk
  menüde md12(i) KIRMIZI verir).

## 25 Tem 2026 — Denetim seansı: brief yazarı hataları

Bu seansta brief yazarı (sohbet tarafı) 4 hata yaptı, 3'ünü Claude Code
yakaladı, 1'ini kullanıcı yakaladı.

H1. md.1.3'e "git status --porcelain boş olmalı" şartı yazıldı. Bu projede
    canlı cron'lar git'te izlenen log dosyalarına yazar; ağaç asla temiz
    olmaz. Şart uygulanamazdı. Claude Code Faz 0'da durdu, doğaçlamadı,
    seçenek sundu. → md.1.3 ve md.9.1 fark-karşılaştırmasıyla değiştirildi.
    Neden: genel iyi-uygulama, projenin bilinen gerçeğiyle karşılaştırılmadan
    yazıldı.

H2. md.3.9'da `--test` bayrağı için kriter "yerel mi okuyor" diye kondu.
    Doğru kriter "Faz 5'te değiştirdiğimiz şeyi mi doğruluyor" idi.
    --test sağlık sisteminin kendi onarım beyaz listesini sınıyor; Faz 5'in
    A düzeltmeleriyle alakasız. → karar geri alındı, Faz 5 doğrulaması
    yalnız `npm run build` + taban kıyası.
    Neden: ölçmesi kolay vekil kriter, doğru kriterin yerine kondu.

H3. F0-1 bulgusu "üç cron.log tutarsız izleniyor" diye yazdırıldı.
    .gitignore'daki /log/ deseninin yorumu ("arşiv altındakiler tracked
    kalır") bunun bilinçli bir karar olduğunu gösteriyor. Gerçek tutarsızlık
    yalnız data/arsiv/grace/cron.log (ne izlenen ne ignore'lu).
    → bulgu 🟡'den ⚪'ya düşürüldü, kapsamı daraltıldı. Faz 4'ün bulduğu
    farklı bulgu F4-7 olarak ayrı numarayla açıldı.
    Neden: belirtiden nedene atlandı, kanıt (gitignore) kontrol edilmedi.

H4. Faz 2 sonrası "Claude Code Faz 3'e kendiliğinden geçmiş" denildi.
    Geçmemişti; "geçiyorum" yazıp turu kapatmıştı. Ekranda `Worked for
    1m 49s` + boş prompt = durmuş. Kullanıcı 14 dk boşuna bekledi.
    → S9 hatırlatması verildi: faz sonu satırı "FAZ N BİTTİ — DUR + ONAY
    BEKLİYOR" olacak, niyet beyanı onay yerine geçmez.
    Neden: beyan okundu, kanıt okunmadı.
    Ek not: bu dersten çıkarılan faz-kapısı kuralı BRIEF DÜZEYİNDEDİR,
    kalıcı değildir. Kalıcı yetki kuralı (tam otomatik mod) yürürlükte
    kalır; faz kapısı yalnız denetim gibi çok fazlı işlerde, o briefte
    açıkça yazılarak uygulanır.

ORTAK KÖK: dördünde de kontrol edilebilir bir olgu kontrol edilmek yerine
makul görünen yüzey sinyali kabul edildi. Claude Code'a yazılan kanıt
disiplini (exit koduna güvenme · kanıtsız bulgu yok · çıktıyla doğrula)
brief yazarının kendisine uygulanmadı.

İKİNCİ ÖRÜNTÜ: 4 hatanın 3'ü (H1, H2, H4) fazlar arası hızlı yazılan ek
madde / onay mesajlarında çıktı. Asıl brief (v3) ayakta kaldı. Hata
briefte değil, briefin etrafındaki kısa turlarda.

DOĞRU ÇALIŞAN: Claude Code doğaçlama yasağına 7 fazda da uydu; durdu,
sordu, kendi başına düzeltmedi. Üç hatalı brief maddesini kanıtla çürüttü.
Üç katmanlı yapı (icra / eleştiri / karar) işledi.

## 25 Tem 2026 — Düzeltme turu 1: arşiv ve temizlik

Denetim (main = ed889fb) sonrası ilk düzeltme turu. 21 B maddesinden
üç konu ele alındı, 18'i beklemede.

YAPILANLAR
- /mock-kure/ rotası ve atlas seti arsiv/mock-kure/'ye alındı. Silme
  yok. Gerekçe: WebGL yüzey-sarma yolu kapandı (sahneler tanınmıyor),
  küre işi tek-parça Midjourney görseli yönüne döndü. Etki: dist 33 MB
  → ~27 MB, 176 → 175 sayfa, three chunk artık üretilmiyor.
- izleme/link-istisna.json'daki mock-kure istisnası kaldırıldı (rota
  kalkınca ölü kayıt).
- Kök dizindeki 4 menü denetim ekran karesi arsiv/menu-denetim/'e alındı.
- icerik-taslak/kuyu-tasima-kaynak.md commit edildi (24 KB, izlenmiyordu,
  kayıp riski vardı).
- Astro/maplibre ana sürüm yükseltmesi ERTELENDİ, kuyruğa yazıldı.
- Yan kazanç: three chunk'ı üretilmediği için taban build'deki tek
  gerçek uyarı ([WARN] [vite] chunk-size) da ortadan kalktı. Build
  artık uyarısız.

BRIEF YAZARI HATASI (5.)
Faz A'da "paylaşılan bileşen import ediyorsa taşıma" kuralı kondu.
Claude Code kuralı literal uyguladı ve durdu — doğru davranış. Ama
kural yanlış hedefi koruyordu: taşıma anasayfa-sorular.js'e dokunmuyor,
ana sayfa etkilenmiyor; kırılan yalnız taşınan dosyanın kendi göreli
yolu, ki mevcut arşiv teamülü (arsiv/harita-stil, arsiv/landing-koyu)
bunu zaten kabul etmiş. Yani "paylaşılan import var mı" ölçmesi kolay
bir vekildi; doğru soru "taşıma paylaşılan tarafı etkiler mi" idi.
Bu, aynı seansta kayda geçen H2 hatasının (vekil kriter) tekrarıydı;
CLAUDE.md'deki öz-denetim kuralı 3 yürürlükte olmasına rağmen ihlal
edildi. Kural doğru, uygulaması eksik kaldı.

KAYIP (kuyruğa yazıldı)
mock-kure.astro:21'deki build-zamanı soru doğrulaması, sayfa
derlenmediği için artık çalışmıyor. Ana sayfada eşdeğeri var mı
DOĞRULANMADI.

## 25 Tem 2026 — K1: git/log hijyeni

Denetim bulguları F4-2, F0-1, F4-7 kapsamında dört script düzeltildi.
Log'lar git izlemesinden çıkarıldı (YOL A).

YAPILAN: commit, pull'dan öne alındı; push, pull başarısına bağlandı.
`git add` ve kapı koşulu yerinde bırakıldı (B1.9 write-set ⊆ add-set
kanıtladı — kalıcı tıkanma imkânsız). --autostash kullanılmadı.

GEREKÇE (YOL A): .gitignore yorumundaki niyet "hata günlüğü kaybolmasın"
idi. F4-7 reflog kanıtı (23.07 11:14 git reset, 20.07 GRACE kaydı
kayboldu) git'te tutmanın log'u KORUMADIĞINI, SİLDİĞİNİ gösterdi.

TEST: scratch repoda beş senaryo. Senaryo 1 (önceki turda) falsifikasyon:
eski sıranın gerçekten koptuğu kanıtlandı. Bu turda 9a-9e: 5/5 geçti —
9a'da conflict marker commit'lenmedi ve veri kaybolmadı, 9b'de kirli-ağaç
ile rebase-çatışması ayrı log verdi ve bekleyen commit 1→2→3 birikti.

MERGE ANINDA DOĞRULANAN RİSK: `git rm --cached` sonrası ff-only merge, 13
log dosyasının HEPSİNİ ana ağacın diskinden sildi (git için "silinmiş
dosya"). C0.2 yedeği olmasa veri kaybıydı; 13/13 yedekten geri kondu,
satır sayıları birebir doğrulandı. Bu, F4-7'nin ("git işlemleri log'u
siler") canlı tekrarıdır ve YOL A'yı ayrıca haklı çıkarır.

BRIEF YAZARI HATALARI:
 (1) A0'da "YOL A seçilirse --autostash gerekmez" denmişti; o an yanlış
     gerekçeyle doğruydu — B1.9 gerçek gerekçeyi verdi.
 (2) Faz B gövdesi geçersiz ilan edilip üstüne yama gönderildi; Claude
     Code tanımsız referanslar nedeniyle durdu. Üç kez tekrarlandı.
     Kural: yön değişiminde brief TEK BİRLEŞİK METİN olarak verilir.
 (3) KARAR 1 (add'i kilide taşı) B3.2 tıkanmasını çözmek için kondu ama
     kapıyı da taşımayı gerektiriyordu; Senaryo 5 bu yapının autostash
     ile birlikte conflict-marker commit ürettiğini kanıtladı. Yapı
     canlıya girmeden falsifiye edildi. B1.9 sonrası KARAR 1'in tamamen
     gereksiz olduğu anlaşıldı.
 (4) C10.1'de origin/main tazelenmeden karşılaştırma yazılmıştı; bayat
     referans uzaktaki commit'i sildirebilirdi. fetch eklendi.
 (5) YENİ (bu tur): Senaryo 9b ve 9e döngüleri, çağırdıkları s9a.sh'in
     durum.json'a SABİT içerik yazdığını gözden kaçırdı. 9b'de döngünün
     yazdığı {"v":31i} üzerine binildiği için kapı kapandı ("KAPI KAPALI")
     ve senaryo hiç koşmadı; 9e ikinci koşumda aynı nedenle beklenen
     çıktıyı veremezdi. İçeriği parametre alan s9b.sh varyantıyla
     düzeltildi. Ders: senaryo betiği ile onu çağıran döngü aynı durumu
     yazıyorsa, beklenen çıktı yazılmadan önce ikisinin etkileşimi
     kontrol edilir.
 (6) YENİ (bu tur): C1 ff-only merge, ana ağaçta YEREL DEĞİŞİK iki log
     (baraj/cron.log, izleme/cron.log) yüzünden reddedildi ("local
     changes would be overwritten"). Brief bu durumu öngörmemişti.
     Çözüm silmeden yapıldı: iki log `mv` ile kenara alındı, merge
     koştu, 13 dosya yedekten geri kondu.

K1'E EKLENEN (kapsam genişlemesi, bilinçli): push-birikimi uyarı sayacı.
Gerekçe: yeni yapıda rebase çakışırsa commit yerelde kalır; çakışma
kronikleşirse sessizce birikir. Eşik >5 commit.

KAPSAM DIŞI KALAN: kilit veri yazımını kapsamıyor (B1.8a) · site-saglik
pull sonrası karışık commit/revert kapsamı (B1.8b) · grace dosya-dosya
add kırılganlığı (yeni dosya eklenirse listeden düşer).

AYRINTI: denetim/K1-ILERLEME.md (B1 keşif tabloları, 5 senaryo kanıtı,
B3.6 yapısal diff, verilen kararlar).

## 26 Tem 2026 — Dönüşüm uygulaması (dal: donusum-2026-07-26)

denetim/DONUSUM-ANALIZ.md'nin öncelik tablosu uygulandı. İş worktree'de
kaldı; main'e MERGE EDİLMEDİ, push YAPILMADI, ana ağacın HEAD'i main'de.

GÖRSEL ONAY KURALI BU İŞ İÇİN ASKIYA ALINDI (kullanıcı kararı). Gerekçe: iş
dalda kalıyor, canlıya çıkmıyor; beğenilmezse dal tek komutla siliniyor.
Askı yalnız bu brief için geçerliydi; kalıcı kural değişmedi.

SAYIM HATASI (kendi raporumda): öncelik tablosu 22 satır (0-21), özet "21"
diyordu — 0 numaralı satır (analitik) [VERİ] toplamına katılmamış. Doğrusu
17 [VERİ] + 5 [VARSAYIM] = 22. Brief "21 değilse DUR" diyordu ama kapanış
listesi "ZORUNLU DURAK — yalnız bunlar" ifadesiyle tüketiciydi ve bunu
içermiyordu; hata kayda geçirilip 22 madde üzerinden devam edildi.

UYGULANAN 4 MADDE (M13 öncelik sırasının dördü de tamamlandı):
 (3) Menü vitrin başlıkları h2 → p. Ölçüm: H1'den önce H2 gelen sayfa
     171/174 → 0/174. Görünüm değişmedi (stil sınıf tabanlı), erişilebilir
     ad <section aria-label> ile korundu. Skill: geo-citability Kategori 3.
 (5) Persona yatay bağları. Ölçüm: tam 1 iç link alan sayfa 42 → 2 (kalan
     ikisi persona değil). Üç tur gerekti: (a) ortak rehber ölçütü 42→32,
     (b) simetri 32→30, (c) kök sebep bulundu — 42 personanın 35'i
     ilgiliIcerik'inde /su-kanunu/ hub'ını taşıyor, bu konu değil gezinme;
     hub yolları sinyalden çıkarılıp grup-içi döngüsel halka eklenince
     42→2 ve yığılma (3 sayfa × 35 link) da kayboldu. Skill:
     site-architecture (yetim yasağı + spoke↔spoke).
 (9) Ana sayfa JS'siz sahne yedeği. #world boş bir div, 6 sahne JS ile
     monte ediliyordu; statik HTML'de <img>/<video> sıfırdı. <noscript>
     içine motorun ZATEN kullandığı 6 poster karesi + alt metni kondu.
     Yeni görsel ÜRETİLMEDİ, video dosyalarına dokunulmadı (M7). Ölçüm:
     img'li sayfa 1 → 2, toplam img 1 → 7, hepsi alt'li.
 (4) Rehber sonu "Sonraki adım" bloğu. Ölçüm: /durumum/ ve /hangi-kurum/
     rehber gövdesinde hiç geçmiyordu (yalnız menüde). Yeni bileşen
     SonrakiAdim.astro: kendi durumun → yetkili kurum → insan muhatap.
     Skill: cro adım 3 (CTA hiyerarşisi) + content-strategy (rehberi
     bitiren ziyaretçi "uygulama" aşamasındadır, ona sonraki MAKALE değil
     sonraki ADIM gerekir — kurul oturumunda Handley'in itirazı).

MADDE 16 — DEĞİŞİKLİK GEREKMEDİ: iki yetim sayfanın (/stil-pilot/,
/harita-pilot/) ikisinde de `robots: noindex` ZATEN vardı ve sitemap dışılar.
Yetimlik kasıtlı ve doğru; dev pilot sayfalarını gezinmeye sokmak yanlış
olurdu. Brief 2-B "yetim 2 sayfayı bağla" diyordu, kaynak rapor ise "ya iç
linkle ya noindex" seçeneğini veriyordu — ikinci seçeneğin zaten sağlandığı
ölçümle doğrulandı.

YENİDEN PUANLAMA (geo-citability, aynı 4 sayfa):
 kuyu-ruhsati 76→80 · hangi-kurum 71→75 · persona 71→75 · ana sayfa 53→57.
 Kritik kontrol: raporun tespiti "dördünde de en düşük kategori yapısal
 okunabilirlik, kayıp içerikte değil iskelette" idi. O kategori dördünde de
 yükseldi (55→75, 60→78, 55→75, 40→60) — yapısal işler amacına ULAŞTI.
 Ama tavan yapmadı: soru-başlıkları (madde 6) uygulanamadı, Kategori 3'ün
 kalan boşluğu odur.

DURDURMA SEBEBİ: bağlam sınırı (M12). M13'ün dört önceliği (2-A, 2-B, 2-C,
2-F) tamamlandıktan sonra durduruldu. Yetişmeyen 9 SINIF A maddesi
SIRADAKILER'e yazıldı.

KULLANILAN SKILL'LER: geo-citability (puanlama + Kategori 3 tanısı) ·
site-architecture (link mimarisi) · cro (CTA hiyerarşisi) · content-strategy
(alıcı aşaması) · marketing-council (önceki turun sentezi "bağlayıcı kısıt
dağıtım, mesaj değil" bu turda uygulama sırasını belirledi — uygulanan 4
maddenin 4'ü de dağıtım/iskelet, hiçbiri mesaj değiştirmedi).

M6 DOĞRULAMASI: dört maddenin dördünde de kaybolan kelime SIFIR. Hukuki
içerik metni değişmedi; yalnız kelime eklendi (922 + 20 + 420 satır).

---

## 26.07.2026 (gece) — DÖNÜŞÜM TUR 2: SINIF A'da kalan 9 madde

Dal `donusum-2026-07-26`, worktree `../suharitasi-donusum`. Ana ağaç `main`
= `6d0e209`, DEĞİŞMEDİ. Merge yok, push yok. 7 commit.

**9 maddenin 8'i ele alındı: 6 uygulandı, 1 SINIF B (madde 1), 1 kısmen geri
alındı (madde 6 / kuyu-ruhsati), 1 sıraya gelmedi (madde 11, M14 eşiği).**

### KULLANICI KARARI — başlık metni yeniden yazılabilir

Kullanıcı bu turda h1–h6 metninin değiştirilebileceğine karar verdi (gerekçe:
başlık gezinme öğesidir, hukuki iddia değil); gövde metni dokunulmaz kaldı.
**85 başlık tanımı değiştirildi**, hepsi ÖNCE→SONRA olarak
`denetim/DONUSUM-ILERLEME.md` FAZ 2.3'te tek tek yazılı. Kanun numarası
taşıyan iki başlık (`5686 rejimi`, `İdari para cezası (167 m.18)`) hukuki
iddia riski nedeniyle bilerek çevrilmedi.

### HATA KAYDI + KURAL — "başlık değişikliği gövdeyi de değiştirebilir"

Madde 6'yı `/rehberler/kuyu-ruhsati/` sayfasına uygularken build geçti, ama
gövde parmak izi 9 kelime kaybı gösterdi. Sebep: kalıp-2 sayfasının
"İçindekiler" menüsü başlık metnini `<h2>` DIŞINDA tekrar basıyor. Başlık
değişince menü metni de değişiyor — yani `<h1>–<h6>` sınırı, DOM'da başlığın
yankılandığı yerleri kapsamıyor.

**KURAL (yeni):** başlık metni değiştirilebilen bir işte, başlığın türetilmiş
kopyaları (içindekiler, breadcrumb, `aria-label`, kart etiketi, menü vitrini)
ÖNCEDEN aranır. Parmak izi doğrulaması bunu yakalar ama iş yapıldıktan sonra
yakalar; önce aranırsa boşa iş olmaz.

**İKİNCİ GİZLİ BAĞ:** `TamEkranMenu.astro` markdown gövdesini `## Gelişmeler`
başlığına göre ayrıştırıyordu; başlık değişince build SESSİZCE DEĞİL, gürültülü
düştü (sessiz hata yasağına uygun `throw`). Bağ güncellendi. Aynı türden ikinci
bağ `rehberler/[slug].astro`'daki kalıp-2 bölüm listesiydi; o da güncellendi
ama sayfa yine de geri alındı (gövde kaybı sebebiyle).

### Uygulananlar

| Madde | Commit | Ne oldu |
|---|---|---|
| 6 | `e74f540` | Soru başlıkları: 85 tanım. Soru biçimli h2/h3 **3 → 458**, kapsayan sayfa **3 → 161** |
| 2 | `c91aa57` | Ana sayfaya Organization + Person; `kurum` şemasına `knowsAbout` + `email`; `Person` düğümü 172 sayfada `@id` ile paylaşılıyor |
| 7 | `f71f490` | robots.txt'e 13 adlı bot bloğu (Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended…). Erişim genişlemedi — niyet beyanı |
| 10 | `16fde8d` | `llms.txt` build entegrasyonu; içerik dist'ten (title + meta description) üretiliyor, elle yazılmış metin yok → bayatlamaz. 172 sayfa, 61 KB |
| 12 | `0a84dd4` | Ana sayfa öz-cevabına envanter sayıları (25 havza, 81 il, 42 sektör, 20 işlem, 10 rehber). 269 karakter, 280 sınırı altında. Sayıların hepsi build çıktısından sayıldı |
| 8 | `5a14a15` | 9 hub sayfasının mevcut `ozet`'i `class="oz-cevap"` + `role="doc-abstract"` ile öz-cevap olarak işaretlendi. **Yeni metin üretilmedi, görünüm değişmedi.** Öz-cevapsız indekslenebilir sayfa 9 → 0 |
| 13 | `0f3e00e` | `HowTo` şeması: kuyu-ruhsati 4 adım, kuyu-tasima 7 adım. Adım metinleri sayfadaki `adimlar[]` dizisinden birebir |

### SÜREKLİLİK

`llms.txt` bir build entegrasyonudur (`astro.config.mjs`), elle bakım
istemez; `<title>` eksikse build düşer. Sayfa/sitemap tutarsızlığı çözüldü ve
belgelendi: **175 dosya = 174 Astro rotası + public/404.html**, **172 sitemap
= 174 − 2 noindex pilot**. Önceki raporlardaki 174 ve 175 sayılarının ikisi de
doğruydu, farklı şeyleri sayıyorlardı.

Bağlam: madde 13 sonunda M14 eşiği (%70) aşıldı → madde 11 bırakıldı, Faz 2
puanlaması yapıldı, kayıt tamamlandı, duruldu.

### 26.07.2026 (sabah) — TUR 2 kapanışı: madde 11

Bağlam eşiği sonrası kalan tek SINIF A maddesi tamamlandı (`fb27d9d`).
**Böylece 9 maddenin 9'u ele alındı: 7 uygulandı, 1 SINIF B (madde 1,
`sameAs`), 1 kısmen geri alındı (madde 6 / kuyu-ruhsati).**

Madde 11 iki parçaydı ve ikisi ayrı sonuçlandı: **B3 (rehber → il) zaten
karşılanmıştı** — `/rehberler/kuyu-ruhsati/` 81 il sayfasına link veriyor,
diğer rehberlerde il tablosu olmadığı için hüküm doğmuyor; yeni kod yazılmadı.
**C2 (rehber → persona) uygulandı:** 0 → 13 link, 8 rehberde.

**Yöntem notu (uydurma yasağı):** hangi personanın hangi rehberi
ilgilendirdiği ELLE EŞLEŞTİRİLMEDİ. `data/lead/persona.json`'daki mevcut
`ilgiliIcerik` alanı tersine çevrildi. Eşleşmesi olmayan rehberde satır hiç
basılmıyor. `data/` yalnız okundu (M10).

**Öz-denetim:** `arac/dist-sun.mjs` üzerinden 7 sayfa — konsol 0, 113 tekil
iç link 0 kırık, 7/7 etkileşim, 7 tam sayfa kare. Ana sayfa alınamadı (menü
düğmesi kaydırma-sahnesi arkasında; aracın bilinen sınırı, kuyruğa yazıldı).

**M6:** eklenen 26 kelime, kaybolan 1 — o da `/hangi-kurum/` sayfasındaki
build tarihinin 25 → 26 Temmuz dönmesi. İçerik kaybı yok.

### 26.07.2026 (sabah, 2. blok) — ÖDÜL-ÜSTÜ: 9 skill'in uygulaması

Kullanıcı: "son 24 saatte yüklediğin skilleri kullan, menüler dahil yerlerini
önceliklerini değiştir, ödül üzeri bir site olsun."

**Brief ön kapısı işletildi:** brief `cikti/brief/` altına olduğu gibi yazıldı,
denetçi 3 ENGEL verdi (T5: DUR kapısı, kapsam mührü, commit+push kuralı —
üçü de mekanik eksik), madde 4e gereği yalnız EKLEME ile tamamlandı,
`-duzeltilmis.md` TEMİZ geçti. Orijinal korundu.

**En büyük bulgu — şema dürüstlüğü açığı:** `BreadcrumbList` JSON-LD 171
sayfada yayınlanıyordu ama sitede GÖRÜNÜR breadcrumb YOKTU (0 sayfa). Yani
site, arama motorlarına sayfada karşılığı olmayan bir gezinme yapısı beyan
ediyordu. Görünür breadcrumb aynı `kirintilar` dizisinden üretildi — iki
kaynak artık ayrışamaz.

**İkinci bulgu — hub'ın kendisi yetimdi:** 81 il sayfasının giriş kapısı
`/kuyu-ruhsati/` yalnız **1** iç link alıyordu ve hiçbir menüde yoktu.
Breadcrumb + menü + footer ile **82**'ye çıktı.

**Üçüncü bulgu — iki küme yatay bağsızdı:** havza 0/25, il 0/81. Kardeşlik
ölçütü UYDURULMADI; sayfanın zaten yazdığı olgudan türetildi (aynı DSİ
bölgesi / aynı illeri kapsamak). Coğrafi komşuluk iddiası YOK.

**Kurul kararının izi:** menü niyet-önce sıralandı ama Sharp'ın (muhalif)
kısıtı korundu — hiçbir veri kapısı kaldırılmadı, yalnız sıra değişti.
Handley'in "etiketler soru olsun" önerisi UYGULANMADI: onaylı gövde metnini
silmeyi gerektiriyordu (M6). Skill önerisi ile proje kuralı çatıştığında
proje kuralı kazandı.

**cro'da öz-düzeltme:** persona sayfasında "iletişim bloğu yok" diye başladım,
ölçünce blok VARDI (sektöre özel mailto konusuyla). Eksik olan iletişim değil
operasyonel sonraki adımdı. Bulgu düzeltildi, brief kuralı "belirtiden nedene
atlanmaz" burada işledi.

**Kanıt:** build hata 0 · 175/172 değişmedi · gövde parmak izinde kayıp yok
(tek fark build tarihinin gün dönmesi) · öz-denetim 8 sayfa konsol 0, 114
tekil link 0 kırık · LH erişilebilirlik 3 sayfa × 3 tur medyan **100** ·
mobil 375/390 px taşma 0.

**Açık bıraktığım:** ortalama sayfa ağırlığı 24,1 → 26,9 KB (+%11,6) —
Lighthouse PERFORMANS yeniden ölçülmedi (yerel/canlı kıyası geçersiz olurdu),
DENETLENEMEDİ'ye yazıldı. CCBot engellensin mi kararı kullanıcıya bırakıldı.

## 2026-07-27 — Ana sayfa v2: emilkowalski/skills + v0 spesifikasyonu (worktree)

**Ne yapıldı:** suharitasi-donusum worktree'sinde ana sayfa v0 spesifikasyonuna
göre yeniden kuruldu: sayfaya özel UstBar (Veriler açılır listesi, 9 rota) +
iki fazlı hero (6 poster harmanı 3800ms → 6 video sırayla 5000ms, geçiş
1400ms) + deterministik su fışkırması (90/30 damla, v0 rand formülü) + 6
uçuşan soru (gerçek <a>; mobilde hero altı dikey liste) + Hizmetler(6) +
Süreç(4) + Hakkında + İletişim(mailto form) + paylaşılan AltBilgi (token
kabıyla, bilesene dokunulmadan). Eski sayfa arsiv/anasayfa-guverte-v3/.
emilkowalski/skills kuruldu (7 skill; .agents/skills gerçek + .claude/skills
symlink düzenine taşındı, gitignore'lu — repo temiz).

**Kararlar ve gerekçeleri:**
- K-1 (animasyon ikiye ayrılır): etkileşim (menü/dropdown/hover/basış)
  emil-design-eng kurallarıyla — <300ms, güçlü ease-out cubic-bezier(0.23,1,
  0.32,1), çıkış girişten hızlı (200/150ms), :active scale(0.97),
  transform-origin tetikte, hover (hover:hover) kapılı. Atmosfer (süzülme 9s,
  fışkırma, harman 3.8s, sahne geçişi 1.4s) v0 süreleriyle KORUNDU; skill'in
  300ms kuralı uygulanmadı — skill'in kendi tablosu "Marketing/explanatory:
  can be longer" diyor, itiraz yalnız raporlandı.
- K-2 (kütüphane yok): spring/Motion önerileri uygulanmadı; saf CSS karşılığı
  (güçlü cubic-bezier + @starting-style + CSS transition) kullanıldı. npm
  install çalıştırılmadı (M5).
- K-3 (öz-cevap hero'da): GEO için yazılmış 280'lik kanonik metin hero alt
  metni oldu; pazarlama gözden geçirmesi kuyrukta.
- M7 süzgeci: v0'ın "15+ yıl/500+ dosya/%98 memnuniyet" uydurmaları atıldı;
  yerine build'de sayılan 25 havza · 81 il · 10 rehber. Telefon + İstanbul
  doğrulanamadı → bloklar konmadı.

**Denetimin yakaladığı 3 arıza (kod düzeltildi):** (1) Esc, imleç düğme
üstündeyken menüyü kapatamıyordu — CSS :hover JS'i eziyordu → .kapali sınıfı;
(2) .v2-nav ul kuralı iç içe açılır listeye sızıp yatay şerit yapıyordu →
doğrudan-çocuk seçici; (3) AltBilgi tokenları tanımsız kalıp koyu-üstü-koyu
çıkıyordu → .v2-altkap aydınlık token kabı.

**Kanıt:** build hata 0, yeni uyarı tipi 0; dist/index.html üzerinde: 6 soru
<a> + hedefleri dist'te VAR, Veriler 9/9 VAR, poster 6+6 (hero alt boş-
dekoratif, noscript alt dolu), ilk yüklemede src dolu video 1, noscript +
JSON-LD (Org+Person+WebSite) AYNEN, h1 h2'den önce, uydurma taraması TEMİZ.
CSP'li sunucuda (dist-sun) video ölçümü: readyState 4, currentTime 1.9s,
oynuyor; konsol 0 (masaüstü+mobil), 390 taşma 0, hamburger+Esc çalışıyor.
Ağırlık: index.html 24K→36K (sınır 3×), dist 28M sabit. Kareler:
denetim/kare/anasayfa-once/ + anasayfa-sonra/. GPU kuralı: scrub/oynatma
akıcılığı headless'ta kanıt sayılmaz — nihai onay kullanıcının canlı testi.

## 2026-07-27 (2. seans) — v0 ince ayar + CANLIYA ÇIKIŞ

**Yayınlanan:** main c7fbe40 → de01fbd (ff-only, 15 commit / 80 dosya /
+2545/−8072): ana sayfa v2 (v0 tasarımı + A=28 ince ayar farkı) + önceki
turların 13 GEO commit'i (soru başlıkları, şemalar, llms.txt, robots,
yatay bağlar, h1/h2). Rebase'de SIRADAKILER.md çakışması kullanıcı onayıyla
"iki blok da korunur" kuralıyla çözüldü — grep doğrulaması: SAGLIK SISTEMI
(s.5) + ANA SAYFA v2 (s.21) ikisi de duruyor, işaret 0.

**v0 ince ayar (AŞAMA A):** kıyas A=28 uygulandı / B=12 brief kazandı /
C=9 taşınamaz (cikti/denetim/v0-kiyas.md, commit'li). Tailwind kurulu
değil — utility'ler vanilla CSS'e çevrildi. oklch tema sayfa kapsamında
(--v2-*, global ezilmedi). unzip yoktu → python3 zipfile. v0'ın "yalnızca
su hukuku" ve "güçlü sicil" beyanları künyeyle çeliştiğinden alınmadı;
uydurma değerler (tel/adres/istatistik) geri getirilmedi.

**Canlı doğrulama (önbellek kırarak, M11):** surum.json ilk denemede
de01fbd; 7/7 rota + 5 soru hedefi + llms.txt 200; cf-cache-status DYNAMIC
(HIT yok — doğrulama geçerli); canlıda video readyState 4 / currentTime
3,3 sn / oynuyor; konsol 0 (1440+390), taşma 0, Veriler menüsü + Esc +
hamburger çalışıyor; uydurma taraması TEMİZ. Ağırlık: index.html 36.470 →
39.682 bayt (sınır 2×=72.940). Kareler: denetim/kare/anasayfa-v0kiyas/ +
canli-sonrasi/. ÖNBELLEK: ziyaretçi YENİ sayfayı görüyor — purge gerekmedi.

**Geri alma yapılmadı** (B5 gerekmedi). Geri dönüş noktası:
/tmp/canli-oncesi-main.txt = c7fbe40; gerekirse git revert c7fbe40..HEAD
(13 GEO commit'i de geri alır). Worktree + dal duruyor (B6.4).
