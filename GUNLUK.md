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
