# KARARLAR.md — kalıcı kararların tek kaydı

Bu dosya "neden böyle yapılmış?" sorusunun tek adresidir. Bir karar burada
yazılıysa TARTIŞMA KAPANMIŞTIR; yeniden açmak için yeni bir kayıt eklenir
(eski kayıt SİLİNMEZ, "ters çevrildi" notu düşülür).

Biçim — her karar dört satır:
- **Tarih** · **Karar** (ne yapılıyor) · **Gerekçe** (neden) · **Reddedilen
  alternatif** (ne yapılmadı).

Kural: gerekçe kayıtlarda (CLAUDE.md, BRIEF.md, GUNLUK.md, SIRADAKILER.md,
rapor/, denetim/) bulunamadıysa **"gerekçe kayıtta yok"** yazılır — sonradan
akla yatkın bir gerekçe UYDURULMAZ. Bu dosya 2026-07-28'de geçmişten geriye
dönük çıkarıldı; o yüzden bazı satırlarda bu işaret vardır.

---

## VERİ

### 1. Yükseklik verisi: Copernicus GLO-90, GLO-30 değil
- **Tarih:** 2026-07-27 (su potansiyeli katmanı, Faz 5)
- **Karar:** Morfoloji/eğim hesapları 90 m çözünürlüklü Copernicus GLO-90
  DEM'den üretilir. 81/81 il kapsandı.
- **Gerekçe:** Kayıt: "GLO-30 elenmişti — 2C/4GB + il ölçeği için 90 m
  yeterli" (rapor/potansiyel-faz5.md:12). Yani (a) çıktı il ölçeğinde
  sunuluyor, 30 m'nin ek bilgisi bu ölçekte görünmüyor; (b) o günkü
  ölçülen sunucu bütçesi 30 m'yi kaldırmıyordu. **Not:** sunucu kaydı
  sonradan düzeltildi (gerçek: 4 çekirdek / 8 GB, CLAUDE.md 2026-07-27).
  Kaynak ölçeği argümanı düştü; **il-ölçeği argümanı ayakta.** GLO-30'a
  geçiş il ölçeğinden ince bir çıktı gerekirse yeniden değerlendirilir.
- **Reddedilen alternatif:** GLO-30 (30 m) — ~9× veri hacmi, il ölçeğinde
  görünür kazanç yok. Ayrıca prism-dem-open.copernicus.eu erişimi ENGELLİ
  ölçüldü (000/ERR ×3); GLO-90 resmî AWS aynasından İNİYOR (200 ×3,
  KESIF-POTANSIYEL.md:38-39).

### 2. İl/ilçe sınırlarında GADM YASAK — OSM türevi kullanılır
- **Tarih:** 2026-07-27 (brief yasağı; uygulama Faz 5)
- **Karar:** İl sınırları `src/data/tr-iller.json` (OSM türevi), ilçe→il
  dizini Overpass'tan (`veri/potansiyel/ilce-il-dizini.json`). GADM
  kullanılmaz.
- **Gerekçe:** Lisans. GADM akademik-olmayan/ticari kullanıma kapalıdır;
  site ticari bir hukuk bürosunun otorite altyapısıdır. Kayıt:
  "GADM değildir (brief yasağı ihlal edilmedi) ve lisans ticari kullanıma
  **açık**" (rapor/potansiyel-faz5.md:45).
- **Reddedilen alternatif:** GADM (daha derli toplu idari sınır seti) —
  lisans engeli.

### 3. OSM verisi ODbL atfıyla kullanılır
- **Tarih:** 2026-07-27
- **Karar:** OSM türevi her veri kümesinde (il sınırı, ilçe dizini, su
  noktaları) ODbL 1.0 atfı KAYNAKLAR.md'de açıkça yazılır:
  "© OpenStreetMap katkıcıları" (KAYNAKLAR.md:313).
- **Gerekçe:** ODbL paylaşımlı-veritabanı lisansı atıf ZORUNLU kılar; atıfsız
  kullanım lisans ihlalidir. Site sahibi avukattır, lisans ihlali riski
  taşınmaz.
- **Reddedilen alternatif:** Atfı yalnız kaynak koda gömmek — kullanıcıya
  görünmeyen atıf ODbL'i karşılamaz.

### 4. Kırılım korunur, ORTALAMA verilmez
- **Tarih:** 2026-07-27 (su potansiyeli Faz 2)
- **Karar:** Birden çok ile yayılan yeraltı suyu kütlelerinde tek bir
  "il ortalaması" ÜRETİLMEZ; kırılım olduğu gibi taşınır. Kayıt:
  "Çok-illi kütle: 25 (kırılım korunuyor, **ortalama yok**)"
  (rapor/potansiyel-faz2.md:117).
- **Gerekçe:** Bir kütlenin verisi il sınırına göre bölünmemiştir; ile
  ortalama atamak ölçülmemiş bir sayı ÜRETMEK olur (uydurma yasağı). Ayrıca
  ziyaretçi maddi karar alıyor — yanlış hassasiyet gösteren tek sayı,
  kırılımdan daha tehlikelidir.
- **Reddedilen alternatif:** Alan-ağırlıklı il ortalaması — hesaplanabilirdi,
  ama kaynakta karşılığı olmayan türetilmiş sayı olurdu.

### 5. İl EŞLEMESİ DURDURULDU (işletme sahaları / RG kayıtları)
- **Tarih:** 2026-07-27 · pekiştirme 2026-07-28 (/arsiv/ künyesi)
- **Karar:** Resmî Gazete taramasından gelen işletme sahası kayıtlarına il
  ataması YAPILMAZ. Kayıt: "il eşlemesi yapılmamıştır. Kayıtlar Resmî Gazete
  arşivinin taranmasıyla…" (VITRIN-RAPORU.md:218).
- **Gerekçe:** Kaynak metinde il alanı yok; eşleme ancak ilçe adı üzerinden
  tahminle yapılabilirdi. Çapraz doğrulama yapıldı (OSM dizini: adlı ilçe
  ortak 897 → eşleme AYNI 897, çatışan 0 — SIRADAKILER.md:284), yani teknik
  olarak MÜMKÜNDÜ; yine de durduruldu çünkü %100 örtüşmeyen kalan kuyrukta
  yanlış il ataması hukuki iddiaya dönüşür.
- **Reddedilen alternatif:** İlçe adı eşleşmesiyle il atamak — 897 kayıtta
  çalışıyordu, kalanında sessizce yanlış olurdu.

### 6. Sayı bekçisi: metindeki her rakam build'de veriden sayılır
- **Tarih:** 2026-07-28 (satış raporları uygulaması U1-U4)
- **Karar:** Onaylı satış cümlelerindeki sayılar (472 / 12 / 347 / 419 /
  1963 / 42) her build'de veriden yeniden sayılır ve karşılaştırılır; sapma
  varsa **build exit 1** (src/data/anasayfa-satis.js).
- **Gerekçe:** Sessiz bayatlama. Metne elle yazılmış bir sayı, veri
  değiştiğinde yanlış olur ve kimse fark etmez; bir hukuk sitesinde yanlış
  sayı otorite kaybıdır. Bekçi bunu imkânsız kılar.
- **Reddedilen alternatif:** Sayıları elle güncellemek / periyodik gözden
  geçirmek — insan hafızasına bağlı, kaçırılır.

---

## YAYIN

### 7. MERGE = YAYIN
- **Tarih:** kayıtta tarihli tek bir karar yok; uygulama 2026-07 boyunca
  sabit (CLAUDE.md "Kurallar": her işin sonunda commit + push OTOMATİK).
- **Karar:** `main`'e merge, canlıya yayın DEMEKTİR. Cloudflare Pages
  main'den otomatik deploy eder; ayrı bir "yayınla" adımı YOKTUR.
- **Gerekçe:** **Gerekçe kayıtta yok** (kararın kendisi uygulamadan
  çıkarıldı). Pratik sonucu kayıtlı: bu yüzden her iş worktree'de yapılır ve
  main'e ancak taban gerilemesi 0 ölçüldükten sonra girer.
- **Reddedilen alternatif:** Ayrı bir `yayin` dalı / manuel deploy —
  kullanılmıyor; **gerekçe kayıtta yok.**

### 8. Ana sayfada ÖZ-CEVAP bloğu muafiyeti
- **Tarih:** 2026-07-28
- **Karar:** `/` sayfası "cevap önce, dayanak sonra" öz-cevap bloğu
  kuralından MUAF; muafiyet `izleme/cekirdek-sayfalar.json`'da
  `"muaf": ["ozCevap"]` olarak gerekçesiyle kayıtlı ve sağlık raporunda
  AÇIKÇA görünür ("muaf: /(ozCevap)").
- **Gerekçe:** Ana sayfanın meta-description'ı ve JSON-LD'si AI-alıntı
  yüzeyini zaten karşılıyor (ölçüldü: title/meta-desc/canonical/JSON-LD/OG
  5/5) — SIRADAKILER.md:303-309.
- **Reddedilen alternatif:** Muafiyeti sessizce koda gömmek — reddedildi;
  muafiyet raporda görünür olmalı, yoksa kural erozyona uğrar.

### 9. /harita/ sayfasında H1 YOKTUR — arıza değil, karar
- **Tarih:** 2026-07-28 (kullanıcı kararı)
- **Karar:** Sayfa SALT HERO'dur, üstünde öğe yoktur; hiyerarşi `<h2>` ile
  başlar, `<h1>` hiç yoktur. Kural `src/pages/harita.astro` başlığına yazıldı
  ki denetim tekrar bulgu açmasın (SIRADAKILER.md:311-315).
- **Gerekçe:** Tasarım kararı — harita tam ekran deneyimdir, üstüne başlık
  koymak deneyimi bozar.
- **Reddedilen alternatif:** Görsel olarak gizli `<h1>` (sr-only) eklemek —
  denetimi susturur ama sayfaya yalan bir hiyerarşi ekler.

### 10. İletişim: mailto — form/backend değil
- **Tarih:** kayıt 2026-07-26 çevresi (GUNLUK.md:1091 "İletişim(mailto form)")
- **Karar:** Tüm dönüşüm CTA'ları `mailto:` bağlantısıdır (canlıda 17 adet,
  md19 ölçümü). Sunucu tarafı form YOK.
- **Gerekçe:** "Site statik kalır" ilkesi (CLAUDE.md:194) — form, Cloudflare
  Function + KV/D1 bağımlılığı demek olurdu; kıyas kayıtlı
  (README-BULTEN.md:38: "Site statik kalır mı → Evet, saf HTML POST · Hayır —
  Function + KV/D1 bağımlılığı (CLAUDE.md'ye aykırı)"). Ayrıca form KVKK
  yükümlülüğü doğurur, mailto doğurmaz.
- **Reddedilen alternatif:** Cloudflare Function + KV form işleyicisi;
  üçüncü taraf form servisi (ücretli/veri aktarımı).
- **Bilinen tuzak:** Cloudflare "e-posta gizleme" özelliği mailto'ları
  şifreliyordu → md19 canlı yanlış pozitifi (8dded71). Çözüldü.

### 11. Site STATİK kalır — sunucudan bağımsız
- **Tarih:** proje başından beri (CLAUDE.md:194)
- **Karar:** Barındırma Cloudflare Pages; ağır sunucu bağımlılığı EKLENMEZ.
  Hetzner VPS yalnız VERİ ÜRETİR (pipeline, sağlık koşusu); siteyi
  SUNMAZ.
- **Gerekçe:** Ayrışma. Sunucu ölse bile site ayakta kalır — yalnız veri
  tazelenmesi durur. Bu ayrım DEVIR.md ve B1.4 kurtarma planının temelidir.
- **Reddedilen alternatif:** Kendi sunucusunda barındırma / SSR — tek
  arıza noktası yaratırdı.

---

## SÜREÇ / MİMARİ

### 12. Her yapısal iş kendi WORKTREE'sinde yapılır
- **Tarih:** uygulama 2026-07-26'dan itibaren sabit (GUNLUK.md:960, 1084,
  1219 — donusum / potansiyel / hero worktree'leri)
- **Karar:** Yapısal iş `../suharitasi-<konu>` worktree'sinde ayrı dalda
  yürür; main'e ancak taban gerilemesi 0 ölçülünce merge edilir.
- **Gerekçe:** Merge = yayın olduğu için (bkz. 7), main'de yarım iş
  canlıya çıkardı. Ayrıca kayıtlı bir hata dersi var: "…için ayrı bir
  worktree kullanmalıydım" (GUNLUK.md:673).
- **Reddedilen alternatif:** main üzerinde doğrudan çalışmak.
- **Ek kural (GUNLUK.md:75-80, hata dersi):** worktree SİLİNMEDEN ÖNCE
  kare/kanıt klasörleri arşivlenir — bir kez kanıt kaybedildi.

### 13. Dürüstlük etiketi / uydurma yasağı
- **Tarih:** proje ilkesi; brief-denetci kuralı T7 olarak makineleştirildi
  (2026-07-23)
- **Karar:** Doğrulanamayan hiçbir şey olgu gibi yazılmaz;
  **"doğrulanmadı"** / **"üretilemedi"** açıkça işaretlenir. Kaynaksız kurum
  iddiası yazılmaz. Ölçülemeyen kalem boş bırakılmaz, ölçülemediği yazılır.
- **Gerekçe:** Site bir hukuk otoritesi kurma aracıdır; tek uydurma sayı
  otoriteyi bitirir. Ayrıca kural makineleşmiş: `arac/brief-kurallari.json`
  T7 bu kapıyı ENGEL seviyesinde denetler.
- **Reddedilen alternatif:** "Makul tahmin" yazıp dipnot düşmek.

### 14. Model ayrımı: Opus / Fable
- **Tarih:** uygulama 2026-07-21'den itibaren kayıtlı
- **Karar:** Fable uygulama brieflerini yazar ve periyodik denetim yürütür;
  Opus paket/derinlik işlerini yürütür. Her fazın uygulama briefi Fable'dan
  gelir (ODUL-USTU.md:55, 149). Her iki tarafta 5 biten-iş eşiğinde periyodik
  denetim turu tetiklenir (GUNLUK.md:517-519, 528-543).
- **Gerekçe:** **Gerekçe kayıtta yok** — ayrım kayıtlarda uygulanıyor ama
  "neden bu bölüşüm" yazılı değil. Gözlenen işlev: brief yazan ile uygulayan
  ayrı olduğunda ön-denetim gerçekten bağımsız oluyor.
- **Reddedilen alternatif:** Tek modelin hem brief yazıp hem uygulaması —
  **gerekçe kayıtta yok.**

### 15. md14 görsel tabanı: kilitlenmez, GEREKÇEYLE yenilenir
- **Tarih:** 2026-07-28 (md14 kurulumu, merge 0bcbc18)
- **Karar:** Görsel/düzen kalemleri (G1-G6) SALT-OKUMA'dır, otomatik onarım
  YOKTUR. Bilinçli tasarım değişikliğinde taban
  `node arac/site-saglik.mjs --gorsel-taban-yenile --gerekce "..."` ile
  yenilenir; **gerekçe ZORUNLUDUR**, yenilenmezse kalem KIRMIZI kalır ve
  taban tarihi SITE-DURUM'da görünür.
- **Gerekçe:** İki uçlu risk: taban hiç yenilenmezse her kasıtlı tasarım
  değişikliği kalemi kırmızıda kilitler ve kalem anlamsızlaşır; gerekçesiz
  yenilenirse bekçi kendi kendini susturur. Zorunlu gerekçe + görünür tarih
  ikisini de engeller.
- **Reddedilen alternatif:** Otomatik taban yenileme (bekçi anlamsızlaşır);
  taban dondurma (kalem kilitlenir).

### 16. İki kademeli brief rejimi
- **Tarih:** 2026-07-28 (bu revizyon)
- **Karar:** KÜÇÜK İŞ (tek dosya · geri alınabilir · veri/yayın/mimari/görsel
  kimliğe dokunmaz) → tek paragraf brief, denetim turu yok. BÜYÜK İŞ →
  tam rejim. Sınıf baştan beyan edilir; beyan yoksa BÜYÜK. Ayrıntı:
  CLAUDE.md "İki kademeli brief rejimi".
- **Gerekçe:** Tam rejim her işe uygulandığında tek satırlık düzeltmeler de
  denetim turu maliyeti taşıyor ve rejim erozyona uğruyordu (kaçınma
  eğilimi). Kademeli rejim, ağırlığı gerçekten risk taşıyan işe yığar.
- **Reddedilen alternatif:** Tek rejim (her işe tam denetim) — erozyon
  riski; rejimin tamamen kaldırılması — denetimsiz yayın riski.

### 17. AY İLKESİ — yeni özellik açılmaz
- **Tarih:** 2026-07-28 (bu revizyon)
- **Karar:** Bu dönemde yeni ÖZELLİK açılmaz; öncelik dağıtım +
  dayanıklılıktır. Yeni özellik talebi kuyruğa yazılır, başlatılmaz.
  Bakım/onarım kapsam dışıdır.
- **Gerekçe:** Site 174 sayfaya ulaştı ama ziyaretçi verisi YOK (analitik
  kurulu değil — denetim/DONUSUM-ANALIZ.md), veri arşivinin depo dışı
  yedeği kısmen YOK (B1.1). Özellik eklemek bu iki boşluğu büyütür.
- **Reddedilen alternatif:** Paralel yürütmek (özellik + dağıtım) — dikkat
  bölünür, iki bacak da yarım kalır.

### 18. MARKA SIFATI: "EMİN"
- **Tarih:** 2026-07-29 (kullanıcı kararı; öneri `rapor/tasarim-kimligi.md` B3.2)
- **Karar:** Sitenin tek marka sıfatı **"emin"**dir. Tipografi/renk/hareket
  sonuçları **DESIGN.md §18**'e yazıldı; uygulama ayrı iş olarak kuyrukta.
- **Gerekçe (kullanıcının kendi ifadesi):** ziyaretçi **ceza/ruhsat derdiyle**
  geliyor; aradığı his **"doğru yere geldim"**. Sıfat var olan davranışın
  adıdır, sonradan takılan etiket değil: sayı bekçisi, künye zorunluluğu,
  "doğrulanmadı" etiketi, il eşlemesinin durdurulması — hepsi zaten bu.
- **Reddedilen alternatifler:** **"çarpıcı"** — malzeme yetersiz, dikkat
  dağıtır · **"resmî"** — soğuk, müvekkil çekmez. (Öneri turunda ayrıca
  elenmişti: *güvenilir* herkes böyle der, ayırt etmez · *şeffaf* bir
  yöntem, sıfat değil · *titiz* içe dönük, kullanıcının derdi değil.)
- **İlk somut sonucu:** rakamlarda lining figür zorunluluğu (Cormorant'ın
  eski-stil rakamları "472"yi "47²" gibi gösteriyordu — ölçüm 28.07).
  Bu, karardan ÖNCE B3.3'te uygulanmıştı; karar onu kurala bağladı.

### 19. SAYIM ANİMASYONU KALIR
- **Tarih:** 2026-07-29 (kullanıcı kararı)
- **Karar:** `CanliSayi` sayım animasyonu (görünürlükte bir kez, 900 ms,
  ease-out) **kalır**. Motor `CanliSayiMotor.astro`'da, sayfada tek kopya.
- **Gerekçe:** DESIGN.md §18.3 "hareket bir şeyi KANITLAMALI" kuralını
  geçen örnek — sayım, rakamın *sayıldığını* gösterir. Ölçülen maliyet
  kabul edildi: ana sayfa **+322 B gzip (%2,98)**, kapı sayfası **+522 B
  (%4,54)**; hareket-azaltmada animasyon hiç başlamaz (ölçüldü: 0 ara değer).
- **Reddedilen alternatif:** motoru kaldırıp yalnız lining düzeltmesini
  bırakmak (ağırlık artmazdı) — hareketin taşıdığı anlam ağırlığa değer
  bulundu.

### 20. NHYP HAM PDF'LERİ YENİDEN İNDİRİLİR
- **Tarih:** 2026-07-29 (kullanıcı kararı)
- **Karar:** Worktree silinirken kaybolan NHYP kaynak PDF'leri yeniden
  indirilir (`veri/ham/nhyp/`, gitignore'da kalır).
- **Gerekçe:** Türetilmiş `yas-kutleleri.json` git'te ve site etkilenmiyor;
  ama kaynağa geri dönme imkânı yoktu — bir kütle sayısı sorgulanırsa
  JSON'daki sayfa numarası elde PDF olmadan doğrulanamıyordu. Ayrıca
  kaynak elde olunca NHYP altın örneği "donmuş çıktı bekçisi" olmaktan
  çıkıp **uçtan uca tekrar** olabilir.
- **Reddedilen alternatif:** türetilmiş JSON'la yetinmek — kaynak
  doğrulanabilirliği bir hukuk sitesinde vazgeçilmez sayıldı.

### 21. ANA SAYFADA İKİ BAŞLIK HİZASI — kural, tutarsızlık değil
- **Tarih:** 2026-07-29 (D1 açık bulgusu ÖLÇÜMLE kapandı)
- **Karar:** Ana sayfadaki `<h2>` hizası **bölüm tipine bağlıdır** ve
  DEĞİŞTİRİLMEZ: tam genişlikli tek sütunlu bölümler (kanıt bandı,
  hizmetler, süreç) `.v2-bolum-bas` ile **ORTALI**; iki sütunlu/ızgaralı
  bölümler (hakkında, iletişim) **SOLA**.
- **Gerekçe:** D1 "3 ortalı / 2 sola = tutarsızlık" diye açılmıştı. Ölçüm
  bunu yanlışladı: (a) `Iletisim.astro:14` kaynak yorumu **"v0 yapısı:
  kicker+h2+intro solda (kıyas A2-3)"** diyor — sola hiza kasıtlı;
  (b) `.v2-bolum-bas` ortalaması 28.07'de v0 spesifikasyonuna göre bilinçle
  geri getirildi; (c) iki grup **farklı düzen tipidir** — ortalı başlık tek
  sütunlu bloğun, sola başlık ızgaranın dilidir.
- **Site geneli sayımın neden ölçüt OLMADIĞI:** 14 sayfada h2 hizası
  ölçüldü — sola 42, orta 3 (üçü de ana sayfada). Bu sayıyla karar vermek
  **vekil kriterdir**: içerik sayfalarını sayıp landing sorusuna cevap
  vermek olurdu. Ana sayfa zaten ayrı bir yüzeydir (KARARLAR §8, öz-cevap
  muafiyeti aynı gerekçeyle verilmişti).
- **Reddedilen alternatif:** hepsini sola çevirmek — 28.07'de bilinçle
  geri getirilen v0 ritmini geri alır ve md14 G5 (ortalanmış başlığın
  kayması) tabanını geçersiz kılardı.
- **Sonuç:** kod DEĞİŞMEDİ. Kural burada yazılı ki bulgu tekrar açılmasın
  (emsal: /harita/ h1 kararı, §9).

### 22. İKİNCİL METİN KOYULAŞTIRILDI (--murekkep-500)
- **Tarih:** 2026-07-29 (D2 açık bulgusu, DESIGN.md §18.2 hedefi)
- **Karar:** `--murekkep-500` **#48627A → #3C5266**. `/hangi-kurum/`daki
  yerel `#3C5266` çatalı da global tokene bağlandı.
- **Gerekçe:** Ölçüldü — ikincil metin zeminlere göre 5,16-6,36; gövde
  metni aynı zeminlerde 11,92-14,68. Şerh/künye/"doğrulanmadı" satırları
  bu yüzden soluk kalıyordu. DESIGN.md §18 ("emin"): belirsizlik dili
  soluklaştırılmaz. Yeni ölçüm: **5,52 → 7,04** (#E9F0F4) · **5,16 → 6,58**
  (#DFE9F0) · 6,36 → 8,11 (#FFFFFF).
- **Yeni renk İCAT EDİLMEDİ:** #3C5266 zaten depodaydı — 28.07'de
  `/hangi-kurum/`da bir kontrast ihlali düzeltilirken ölçülüp seçilmişti.
- **DÜRÜST SINIR:** #DFE9F0 zemininde 6,58 — §18.2'nin ≥7 hedefinin
  ALTINDA. 7'yi orada da geçmek yeni bir palet değeri ister; o bir
  DESIGN.md değişikliğidir ve **kullanıcı kararıdır**.
- **Reddedilen alternatif:** #34495C (her iki zeminde ≥7) — palette yok,
  icat olurdu.

### 23. `public/s/*.js` BUILD HATTINA ALINDI — taşınarak değil, küçültülerek
- **Tarih:** 2026-07-29
- **Karar:** Altı dosya `public/`de KALIR; `astro:build:done` kancası
  (`sKlasoruKucult`) dist'teki kopyaları esbuild ile küçültür.
  Ölçüldü: 21.766 → 12.783 bayt (%41), sourcemap 0, Türkçe yorum 0.
- **Gerekçe:** Dosyalar dist'e **bit-eşit** kopyalanıyordu (`cmp` ile
  doğrulandı) ve 28 Türkçe yorum satırı yayımlanıyordu — "Kopyalanma
  direnci" m.1-2 ihlali. Kaynağı `src/scripts/`e taşımak Sayfa.astro'daki
  yükleme biçimini (`is:inline`) ve 175 sayfanın çıktısını değiştirirdi;
  kanca yalnız dosya İÇERİĞİNİ değiştirir, HTML aynı kalır.
- **Reddedilen alternatif:** `src/scripts/`e taşıma — 175 sayfada gerileme
  riski, kazanç aynı.
- **Yan bulgu:** `imlec.js`te bir Türkçe yorum CSS DİZESİNİN içindeydi;
  esbuild dize içini küçültemez, yorum JS tarafına taşındı.

### 24. RG erişimi: ara sertifika YERELDE tamamlanır; veri hattı kırmızısı TELEGRAM'a çıkar
- **Tarih:** 2026-08-24
- **Karar:** (a) resmigazete.gov.tr'nin zincirde göndermediği ara sertifika
  (`GeoTrust TLS RSA CA G1`, AIA'dan indirilmiş, `openssl verify` ile
  köke zincirlenmiş, SHA-256 parmak izi dosya başında) depoda tutulur:
  `izleme/lib/rg-ara-sertifika.pem`; koşumda sistem demetiyle birleştirilip
  (`izleme/state/.rg-ca-demeti.pem`, gitignore) yalnız RG çekimlerine
  `cafile` olarak verilir. TLS doğrulaması HİÇBİR yerde kapatılmaz.
  (b) Veri hattı hataları (su-izleme `HATA_SAYAC>0`, rg-nobetci `--kosum`
  sorgu hatası) `arac/uyari-gonder.sh` ile Telegram'a bildirilir — SMTP'den
  ve LLM'den bağımsız; su-izleme'de aynı-imza-24-saat mükerrer koruması.
  (c) `su-izleme.sh --rg-tarih YYYY-MM-DD` telafi kipi: yalnız M1, DURUM.md'ye
  dokunmaz, tarihi zaten analizli günü atlar.
- **Gerekçe:** RG 2026-08-06'dan beri zincirde yalnız leaf gönderiyor;
  fihrist 38 ardışık koşum, nöbetçi 2 hafta kördü ve SMTP boş olduğu için
  hiçbir kırmızı dışarı çıkmıyordu. Falsifikasyon kanıtı: kasıtlı bozmada
  Telegram message_id 4656 (su-izleme) ve 4657 (rg-nobetci); onarımla
  nöbetçi 0→109 satır. Ayrıntı: rapor/rg-onarim.md.
- **Reddedilen alternatifler:** TLS doğrulamasını kapatmak (`-k`) — MITM
  yüzeyi, uydurma yasağının ağ karşılığı; sistem geneli
  `update-ca-certificates` — kapsamı tüm sistem, izi proje deposunda
  görünmez; karşı tarafın (RG) düzeltmesini beklemek — 18 gün beklendi,
  veri kaybı büyüyor. Worktree'de çalışmak (§12) — cron'un koştuğu gerçek
  state ağacında uçtan uca falsifikasyon gerekiyordu; değişiklik site yayın
  hattına girmiyor, sapma gerekçesiyle kayıtlandı.
- **Süre kalemi:** ara sertifika 2027-11-02'de dolar — SIRADAKILER'e
  tarihli yenileme kalemi yazıldı; ayrıca RG kendi zincirini düzeltirse
  demet zararsız fazlalık olur (kaldırma kararı o gün verilir).

### 25. 4 AĞUSTOS DALGASI: göl/nehir KALDI (kurallara uyduruldu), satış katmanı KALDIRILDI
- **Tarih:** 2026-08-24 (dalga: 2026-08-02..04, kayıtsız girmişti)
- **Ne girmişti:** 279 göl + 131 nehir sayfası; PayTR'li B2B satış katmanı
  (/rapor-satin-al/, /raporlar/, /rapor-indir/, 25 örnek PDF, server/
  ödeme backend'i, menü/hero/havza/ilçe-sorgu CTA'ları); /ilce-sorgu/ +
  /su-hukuku/; yeni üst gezinme; logo-lockup.svg. KARARLAR/GUNLUK/
  SIRADAKILER kaydı YOKTU; durum denetimi (rapor/site-durum-kazi.md,
  fe1fba3) yakaladı.
- **Karar (kullanıcı, 2026-08-24):** göl/nehir sayfaları KALIR ve kurallara
  uydurulur; satış sayfaları KALDIRILIR (PayTR mağazası kapandı);
  bozukluklar düzeltilir. Uygulama: rapor/agustos-uyum.md (worktree
  suharitasi-agustos).
- **Uygulanan (ölçümleriyle raporda):** satış yüzeyi sıfırlandı + 31 adet
  301; mobil ilk ekran S1'e döndü (ilk soru 1383→785px); emoji CTA'lar
  kalktı (BRIEF.md yasağı + md13 1.92:1); md13 aracının oklch körlüğü
  giderildi (falsifikasyonlu); 6.908 bozuk-Türkçe isabeti 0'a indi;
  UYDURMA DENETİMİ: Türkiye dışındaki 32 göl + 36 nehir (Gürcü/Ermeni/
  Bulgar/İran/Irak/Yunan öznitelikleri "Türkiye Gölleri" başlığıyla
  yayındaydı) veri filtresiyle yayından düştü; künye/dürüstlük şerhi/
  il-havza iç bağları kuruldu; göl/nehir/ilçe-sorgu denetim setine girdi.
- **Gerekçe:** AY İLKESİ döneminde kayıtsız giren dalga hem karar
  disiplinini hem ölçülen tabanları (md13/md14/md16) kırmıştı; satış
  katmanı ise canlıda zaten ÇALIŞMIYORDU (ölçüm: CSP'de PayTR/api konağı
  yok + api.suharitasi.com DNS kaydı yok — ödeme akışı tarayıcıda
  engelliydi) ve mağaza kapandı.
- **Reddedilen alternatifler:** (a) göl/nehir sayfalarını toptan kaldırmak —
  kullanıcı kararıyla reddedildi; içerik veriye bağlanınca kurallara
  uyuyor. (b) Satış sayfalarını "gizlemek" (noindex/link kaldırma) —
  ölü ödeme altyapısı kalıntı bırakır; tam kaldırma + 301 seçildi.
  (c) Sınır ötesi öznitelikleri "yabancı göller" diye etiketleyip tutmak —
  site kapsamı Türkiye; kapsam dışı sayfa tutmanın veri değeri yok.

---

### 26. GEO/SEO TURU: /su-hukuku/ rota kapanışı · ölü-kaynak onarım deseni · merkezî meta kırpımı
- **Tarih:** 2026-08-25 (brief: cikti/brief/2026-08-25T03-29-43Z-geo-seo-katma-deger.md; rapor: rapor/geo-seo-katma-deger.md)
- **Karar 1 — /su-hukuku/ KALDIRILDI (kullanıcı kararı, brief A5):** sayfa
  `arsiv/su-hukuku-rota/`ya taşındı (silinmedi); 301 hedefi en yakın NÖTR
  içerik: `/rehberler/ruhsatsiz-kuyu-cezalari/` (hukuki vaat ölçümü 0).
  Arşivden geri getirilirse [SERDAR-HUKUK] onay kapısından geçmek zorunda
  (içerik o kapıdan hiç geçmemişti). Canlı kanıt: 301 iki varyantta da
  ölçüldü, sitemap 520→519 "diğer fark: 0".
- **Karar 2 — ölü dış kaynak onarım deseni:** ölü ölçülen künye bağı
  (a) otoriter kaynakla sınıflanır (handle API / tarayıcı-UA GET — HEAD
  ve nöbetçi-UA 404'ü TEK BAŞINA kanıt DEĞİL; bu turda 3 yanlış-pozitif
  çıktı), (b) doğrulanmış yeni adres başlık eşleşmesiyle yazılır,
  (c) bulunamayan `url_olu`/`doi_olu` + `kunye_notu` "kaynak taşındı,
  yeni adres doğrulanamadı (tarih)" ile KALIR (silinmez). SYGM tüm
  /SYGM/Belgeler/ eylem-planı/NHYP/HİE ağacını /SYGM/BelgelerArsiv/
  altına taşıdı (21 künye güncellendi; havza tanıtım ailesi TAŞINMADI).
- **Karar 3 — meta description tek noktadan:** `Sayfa.astro` 50-160
  bandına kırpar (cümle→kelime sınırı); şablonlar ham `aciklama` geçmeye
  devam eder. Sayfa-tekil override gerekirse şablonda kısa metin üretilir.
- **Karar 4 — ölçüm aracı tırnak düzeltmesi:** `seo-geo-ortak.mjs`
  metaIcerik/ogEtiket artık açılış tırnağıyla eşleşen kapanışı arar
  (falsifikasyon testli). ESKİ md16 tabanı (199) bu hatayla ölçülmüştü;
  yeni taban deploy sonrası canlı --tam değeriyle yazılır.
- **Reddedilen alternatifler:** (a) speakable şeması — 16 şablon +
  @graph kirliliği vs beta sinyal, öz-cevap zaten role=doc-abstract;
  (b) SearchAction — sitede arama kutusu yok, uydurma olurdu; (c) ölü
  DOI'de linki "yayın (erişilemez)" diye bırakmak — üretim filtresi
  (potansiyel.js) bağlantısız kaydı zaten düşürüyor, veri katmanında
  etiketle çözüldü.

---

### 27. KALANLAR PAKETİ: veri hattı uyarı yolu tamamlandı · kirli-ağaç kuralı · güncellik damgası süreci · md24
- **Tarih:** 2026-08-25 (brief: cikti/brief/2026-08-25T08-42-39Z-kalanlar-paketi.md; rapor: rapor/kalanlar-paketi.md)
- **Karar 1 — nöbetçi çıktısı yalnız YENİ KAYITTA yazılır:** rg-nobetci
  `--kosum`, isletme-sahalari-yeni.json'a yalnız yeni kayıt bulunca dokunur;
  kalp atışı zaten izleme/state'tedir. Yeni kayıt yazıldığında dosyayı bir
  sonraki su-izleme commit'i taşır (koşullu git add) ve Telegram bildirimi
  düşer. **Gerekçe:** her salı basılan son_kosum damgası izleme/ dışında
  kaldığından hiçbir commit'çi almıyor, ağaç kirli kalıyor ve TÜM hatların
  pull/push'u tıkanıyordu — ölçülen vaka: 18-24.08, 41 bekleyen commit
  (data/arsiv/baraj/log/cron-hata.log). **Reddedilenler:** git_pull_rebase'e
  --autostash (arızayı tamamen görünmez kılar); nöbetçiye commit yetkisi
  ("git'e dokunmaz" test sözleşmesini bulanıklaştırır).
- **Karar 2 — §24 uyarı yolu TÜM hatlara genişletildi:** baraj-gunluk
  (çekim/kilit/pull-push), grace-guncelle (hata_say), yedek-al (olduc),
  nhyp-yayin-nobetci (sonda/ağ + yeni yayın), rg-nobetci (yeni kayıt).
  Falsifikasyon message_id kanıtları: 4662 (baraj) · 4663 (grace) ·
  4664 (nhyp) · 4665 (yedek) · 4666 (rg yeni-kayıt); yeşil yolda mesaj 0.
  Falsifikasyon ayrıca gerçek bir kusur yakaladı: yedek-al uyarıcıyı
  KOK'tan çözüyordu, script-yerel yola alındı.
- **Karar 3 — güncellik damgası süreci (C5 №5, eeat-audit №1):** damga
  tarihi YALNIZ veri kaydının kendi künyesinden gelir (uretim_tarihi /
  sonGuncelleme / indirmeTarihi / kayitTarihi / OSM çekimi / nöbetçi son
  taraması — kaynak: src/data/guncellik.js); build saati damga DEĞİLDİR
  (her deploy'da oynayan tarih sahte tazelik sinyalidir). İçerik
  koleksiyonlarında opsiyonel `guncelleme:` frontmatter alanı; ilk değerler
  git geçmişinden ölçüldü, bundan sonra İÇERİK değişen md'de bu alan da
  güncellenir. Görünür desen SayfaBasi'nın MEVCUT künye satırı; şemada
  dateModified = guncelleme ?? tarih, datePublished değişmez. Tarihi
  belirsiz sayfada damga BASILMAZ. **Reddedilenler:** build-time git
  türetimi (Cloudflare Pages sığ klonunda güvenilmez); "bugün" basmak
  (uydurma yasağı).
- **Karar 4 — md24 www kalemi:** www.suharitasi.com kendi kalemiyle izlenir
  (200 + canonical apex); beklenen-301'e yazılmaz çünkü www yönlendirmez,
  sunar. Falsifikasyon 2/2 (SAGLIK_WWW_EZME).

### 28. OTOMATİK DİZİN BİLDİRİMİ: IndexNow kuruldu · tetik = sitemap farkı · lastmod veri tarihinden · Google Indexing API uygun değil
- **Tarih:** 2026-08-25 (rapor/indeks-bildirimi.md)
- **Karar (4 parça):**
  1. **IndexNow bildiricisi** `arac/indexnow-bildir.mjs` cron'la koşar
     (6×/gün, :25). Anahtar `public/{anahtar}.txt` — SIR DEĞİLDİR
     (protokol gereği herkese açık; .env'e konmaz). Uç nokta
     `api.indexnow.org` (tüm katılımcı motorlara paylaşır; Google üye
     değil). Başarısızlık log + Telegram'a çıkar; bekçide iki eşik
     (koşum >26s, başarılı bildirim >96s).
  2. **Yayın tetiği = CANLI sitemap farkı** (loc+lastmod), canlı
     surum.json imzası kayıtla. Deploy hangi aktörden gelirse gelsin
     yakalanır; bildirim tanım gereği canlıda VAR OLAN sayfa için çıkar.
  3. **Sitemap lastmod sayfanın JSON-LD dateModified'ından** (o da
     guncellik.js ile veri kaydından); tarihi belirsiz sayfada lastmod
     BASILMAZ. Build günü damgası kaldırıldı (sahte tazelikti).
  4. **State git dışında** (`izleme/state/indexnow-durum.json`,
     .gitignore): commit'lense her koşum boş deploy tetiklerdi.
     Kaybolursa betik ilk-koşum moduna döner (tek koşumda ≤20 URL).
- **Gerekçe:** GSC'de 168 sayfa "keşfedildi — taranmadı"; tarama
  bütçesi bildirimle desteklenir. Kanıt: 519/519 URL bildirildi,
  yanıtlar 202→200; falsifikasyon 5/5 (rapor §5, Telegram msg 4667).
- **Reddedilen alternatifler:** (a) deploy-doğrulama akışına kanca —
  akış tek değil (4+ cron + elle merge), hepsine dokunmak gerekirdi;
  (b) Cloudflare Crawler Hints'e yaslanmak — panel işi + hangi URL'nin
  ne zaman bildirildiği ölçülemez (kanıt disiplinine kapalı; kullanıcı
  isterse EK olarak açabilir); (c) Google Indexing API — resmî kapsam
  yalnız JobPosting/BroadcastEvent, bu siteye uygun değil (uydurma şema
  eklemek yasak).

### 29. HAVZA SAYFALARI TALEP UYUMU: sorgu-kalıplı title/H1/öz-cevap · iller önce · md24 üç durumlu (www panel adımı)
- **Tarih:** 2026-08-25 (rapor/havza-talep.md; GSC verisi kullanıcıdan)
- **Karar (4 parça):**
  1. Havza sayfası şablonu ölçülen sorgu ailesine göre: title
     "[Ad] Nerede? Kapsadığı İller ve Haritası" (≤60 guard, aşım
     build'i düşürür) · H1 soru biçimi · öz-cevap KONUM CÜMLESİYLE
     başlar (yalnız il-kurum.json resmî il listesinden; bölge/yön
     iddiası yazılmaz) · iller+konum haritası öz-cevabın hemen altında.
  2. SSS şemasına yalnız veriyle cevaplanan sorular girer: nerede ·
     hangi iller · YAS. "Açık/kapalı havza" sorusu KONULMAZ (25/25
     tahsis=null ölçüldü); görünür dürüst şerh basılır.
  3. Meta description havza sayfalarında cümle-bütünlüklü 160
     bütçesiyle kurulur (merkezî kırpım yarım sayı bırakıyordu).
  4. **md24 www kalemi üç durumlu** (§27'deki md24 kaydının yerine
     geçer): www 301→apex = yeşil · 200+canonical apex = SARI ("panel
     Redirect Rule bekleniyor") · diğer = kırmızı. Sebep: GSC sinyal
     bölünmesi ölçüldü; Pages _redirects alan-düzeyi yönlendirmeyi
     DESTEKLEMİYOR (resmî belge 25.08) → 301 ancak panelden kurulur
     (kullanıcı adımı).
- **Gerekçe:** GSC 146 sorgu / ~3.900 gösterim / 19 tıklama; en büyük
  kayıp "ergene havzası nerede" 2.255 gösterim / 0 tıklama →
  /havzalar/meric-ergene/. Hipotezler (a)(b)(c) ölçümle kanıtlandı;
  sıralama hipotezi ölçülemez ve karar dayanağı yapılmadı.
- **Reddedilen alternatifler:** Ergene'ye ayrı sayfa (resmî ad
  Meriç-Ergene; RG arşivindeki künyeli "Ergene Havzası" bölümüyle
  çözüldü) · açık/kapalı tahmini yazmak (veri yok) · "havza nedir"
  tanımı uydurmak (içerik kararı, kullanıcıda) · _redirects host
  kuralı (denendi, canlıda etkisiz ölçüldü, kaldırıldı).

### 30. GSC ERİŞİMİ: MCP salt-okunur kuruldu · il title sorgu kalıbı · Dataset şeması · yamyamlık izlemede
- **Tarih:** 2026-08-25 (rapor/gsc-mcp-optimizasyon.md)
- **Karar (4 parça):**
  1. GSC verisi programatik olarak **google-seo-mcp v0.8.5** ile okunur
     (kaynak+venv /home/suha/araclar/google-seo-mcp, sürüm sabit
     b0e9dee; `mcp<2` pini zorunlu — 2.x fastmcp'yi kaldırdı). Kayıt
     kullanıcı kapsamında (`claude mcp add --scope user`), anahtar
     YALNIZ ortam değişkeni yoluyla (/home/suha/gsc-anahtar.json, 600).
     `GSC_ALLOW_DESTRUCTIVE` AYARLANMAZ — sitemap gönderme/Indexing
     dahil yıkıcı işlemler kapalı; panel işleri kullanıcıda. Güven
     kapısı: kurulum öncesi kod incelemesi + 25.08 çapraz doğrulaması
     4/4 birebir (27.07-23.08 aralığı).
  2. İl sayfalarında `<title>` sorgu kalıbında il-önce ("[İl] Kuyu
     Ruhsatı — Yetkili Merci ve Başvuru", tarayiciBaslik); H1 ve
     og:title DEĞİŞMEZ.
  3. Dataset/DataCatalog şeması yalnız KAYITLI veri alanlarından
     üretilir (/arsiv/, /kapatma-kaydi/); lisans alanı bilinmeden
     YAZILMAZ; havza sayfalarına tekil Dataset basılmaz (katalog
     temsil eder).
  4. Ergene "harita" yamyamlığına MÜDAHALE EDİLMEZ — asıl hedef
     /havzalar/meric-ergene/ belirlendi, dünkü title değişikliğinin
     etkisi 1-4 hafta İZLENİR; /havzalar/ dokunulmazdır.
- **Gerekçe:** İlk kez ölçülen pozisyon verisi (site ort. 9,2; Ergene
  ailesi 10,5) ve ilk tam indeks haritası (170 indeksli / 349 dışarıda,
  dışarıdakilerin 340'ı göl/nehir kuyruğu — tarama bütçesi, teknik
  engel değil). "malatya kuyu" 23 göst/poz 8,3/0 tık il-title bulgusu.
- **Reddedilen alternatifler:** sıfırdan kendi GSC scripti (MCP'nin
  102 aracı + `_meta` kaynak damgası hazır) · yıkıcı-yetkili kurulum ·
  /havzalar/ başlığını Ergene'den ayrıştırmak (en iyi sayfayı riske
  atar, bulgu yetersiz) · haftalık koşumu cron'a bağlamak (kota/maliyet
  kararı kullanıcının; script hazır, satır raporda).

### 31. GSC HAFTALIK KOŞUMU CRON'A BAĞLANDI · çıktı depo DIŞINA · uyarı kanalı bilinçli olarak PAYLAŞIMLI
- **Tarih:** 2026-08-25 (rapor/25-08-alarm-teshisi.md; §30'un "cron'a
  bağlamak" reddini YÜRÜRLÜKTEN KALDIRIR — kullanıcı kararı alındı)
- **Karar (3 parça):**
  1. `arac/gsc-haftalik.py` **Çar 10:30 UTC (13:30 TR)** koşar,
     sarmalayıcı `arac/gsc-haftalik.sh` üzerinden, kullanıcı **suha**
     (root'a ASLA — anahtar 600/suha). GÜN ölçümle seçildi: betiğin
     `bugün-9..bugün-3` / `bugün-16..bugün-10` penceresi YALNIZ
     çarşamba koşumunda iki tarafta da tam takvim haftasına (Pzt-Paz)
     oturur; bitiş her zaman `bugün-3`, GSC'nin ~2 günlük gecikmesinin
     bir gün üstünde. SAAT ölçümle seçildi: en yakın komşu
     `arslan-analytics` (hourly, :00) → 10:00 ve 11:00, ikisi de tam
     30 dk; 10. saatte indexnow yok.
  2. **ÇIKTI DEPO DIŞINA** — `/home/suha/gsc-cikti/<bitiş>.md`; git
     hiç görmez, commit atılmaz. Betiğe eklemeli `GSC_CIKTI_DIZIN`
     ezmesi kondu; ezme yoksa eski davranış (rapor/gsc-haftalik/)
     AYNEN korunur. Gerekçe: rapor sitede yayımlanmaz, yalnız teşhis/
     izleme içindir. "Depo içine yaz, ne yok say ne commit et" tuzağı
     yapısal olarak doğamaz (18-24.08'de 41 commit'i bu tıkamıştı).
  3. **UYARI KANALI PAYLAŞIMLI KALIR** — bilinçli kullanıcı kararı.
     Bot 8549777437 (TraderBOT/@TraderSerdar_BOT) + chat 1490086481
     ikilisini `/home/suha/araclar/kesif-botu` de kullanıyor
     (systemd kesif-botu.timer, 08:00 TR); `log/uyari.log` message_id
     dizisindeki 4659-4661 boşluğu da başka gönderen olduğunu gösterir.
     Yeni işin hata yolu MEVCUT `arac/uyari-gonder.sh` ile bu kanala
     bağlandı; yeni bildirim yolu yazılmadı.
- **Gerekçe:** haftalık koşum §30'da hazır ama cron'suz bırakılmıştı
  (kota/maliyet kullanıcı kararı). Maliyet ölçüldü: koşum başına 4
  Search Analytics sorgusu, sınır 1.200 QPM/site — ücretsiz. Kullanıcı
  25.08'de hem bağlanmasına hem kanalın paylaşımlı kalmasına karar
  verdi. Falsifikasyon 3/3: cron ortamı (syslog CRON[1912897], kısıtlı
  PATH, çıktı üretildi) · kimlik hatası (exit 1 + Telegram msg 4671 +
  bit-eşit geri alma) · flock (ikinci koşum ATLANDI, exit 0).
- **Reddedilen alternatifler:** rapordaki hazır satırı olduğu gibi
  kurmak (`25 6 * * 1` — 06:00'a 25 dk, 06:40 `--tam`'a 15 dk; 30 dk
  kuralını çiğniyordu) · çıktıyı depo içinde tutup commit'lemek (site
  yayını yok, git geçmişini haftalık teşhis dosyasıyla şişirir) ·
  çıktıyı depo içinde tutup .gitignore'lamak (kabul edilebilirdi ama
  (a) daha net: git hiç görmez) · suharitasi'ye ayrı Telegram botu
  açmak (kullanıcı paylaşımlıyı seçti) · 30 dk kuralını `*/10`
  bellek-log ve 5 dk'lık monitörlere de uygulamak (imkânsız; maliyet
  ölçüldü: 0,01-0,66 sn, saniye altı — kural bunlar için anlamsız).
- **ŞERH:** `apt-daily.timer` rastgele gecikmelidir; hiçbir saat ona
  karşı garanti edilemez.

### 32. ASTRO 7'YE YÜKSELTME · getCollection eşitlik sırası ARTIK AÇIKÇA BOZULUR · konya-kapali komşu listesi ALFABETİK eşitlik bozucuyla kabul
- **Tarih:** 2026-08-26 (rapor/26-08-astro7-faz1.md + rapor/26-08-astro7-faz2-yayin.md;
  §"9. astro 5→7 yükseltmesi yapılsın mı" kalemini KAPATIR — kullanıcı kararı alındı)
- **Karar (3 parça):**
  1. **Astro 5.18.2 → 7.2.7 yayına alındı** (commit eaa951d). Sürüm
     kapısı sert: astro@7'nin kendi bin'i `>=22.12.0` istiyor ve
     düşük sürümde HİÇ BUILD ETMEDEN exit 1 veriyor (yerel
     falsifikasyon: sahte `process.versions.node=20.11.0` →
     "Node.js v20.11.0 is not supported by Astro!"). Bu yüzden
     Cloudflare Pages'te **NODE_VERSION=22 kalıcı bir ön koşuldur**;
     değişken silinirse yayın build'i sessizce eskimez, KIRILIR.
  2. **getCollection'ın dönüş sırasına yaslanmak YASAK.** Sıralamada
     eşitlik her zaman açıkça bozulur (`|| (a.id < b.id ? -1 : 1)`).
     Gerekçe ölçümle kuruldu: sıra Astro 7'de id-alfabetik, Astro 5'te
     content-layer store'unun durumuna bağlıydı — Astro 5 yeniden
     kurulup art arda iki build alındığında ikisi birbirine eşit ama
     sabahki referans kopyadan FARKLI çıktı. Yani "Astro 5 davranışı"
     diye korunacak kararlı bir sıra hiç yoktu.
  3. **konya-kapali komşu listesi: alfabetik eşitlik bozucu KALIR,
     Akarçay görünür** (kullanıcı kararı 26.08). "Aynı illeri kapsayan
     havzalar" listesi il örtüşmesiyle hesaplanır ve ilk 5 gösterilir;
     eşit ortak-il sayısında sıra alfabetiktir.
- **Gerekçe (3. parça — kullanıcı):** resmî kaynaklar Konya Kapalı
  Havzası'nın komşularını kuzeyde Sakarya-Kızılırmak, doğuda
  Kızılırmak-Seyhan, güneyde Doğu Akdeniz, batıda Antalya-Akarçay
  olarak sayıyor; **Burdur bu komşu listesinde YOK** (Göller Yöresi
  kapalı havza grubunda). Liste il örtüşmesiyle hesaplansa da,
  eşitlikte hidrolojik komşuluğu olan havzanın görünmesi okuyucu için
  doğrudur. Kaynaklar: SYGM havza tanıtım belgeleri + Konya Havzası
  Kuraklık Yönetim Planı (künyeler KAYNAKLAR.md'de).
- **ÖLÇÜM NOTU (kararı güçlendiren):** bu karar canlıda GÖRÜNÜR bir
  değişiklik YARATMADI — yükseltme öncesi canlı sayfa da Akarçay
  gösteriyordu (26.08 13:18Z ölçümü, Astro 5 build'i commit 858b1c5).
  Yerel Astro 5 referans kopyasının Burdur göstermesi, 2. parçadaki
  store-bağımlılığının bir sonucuydu. Yani kabul edilen davranış,
  zaten yayında olan davranıştır.
- **Reddedilen alternatif:** ortak-il **eşiğiyle** sıralama (ör. "N
  ortak ilden azını gösterme") — liste uzunluğunu öngörülemez kılıyor,
  bazı havzalarda blok tamamen boşalabilirdi. REDDEDİLDİ.
- **Kod değişmedi:** karar mevcut davranışı onaylar; 26.08'de yalnız
  kayıt yapıldı (KARARLAR + KAYNAKLAR + SIRADAKILER).
- **ŞERH:** komşuluk listesi bir HİDROLOJİK KOMŞULUK İDDİASI DEĞİLDİR;
  başlık ve blok metni "aynı illeri kapsayan havzalar" der ve ölçüt
  budur. Resmî komşuluk yalnız eşitlik bozucunun gerekçesidir, sayfada
  komşuluk iddiası olarak yazılmaz.

### 33. ALTYAPI KUYRUĞU KAPANIŞI: çıkış-kaydı sözleşmesi üç dilde · bekçi ölü-adam anahtarı · Astro 7 bulgu kararları · npm açıkları build-zamanı

- **Tarih:** 2026-08-26 (kuyruk kapatma briefi; rapor/26-08-kuyruk-kapatma.md)

**K1 — Çıkış kaydı sözleşmesi artık üç dilde, 13/13 cron kalemi kapsandı.**
Sözleşme TEK (ISO-8601 UTC · exit kodu · üretilen dosya · bayt; yoksa "-",
512 KB tavan + 5 kayan arşiv, kırpmasız), uygulama DİL BAŞINA:
`arac/cikis-kaydi.sh` (bash, Faz 1'den) · `arac/cikis-kaydi.mjs` (node,
process.on('exit') yığılır) · `arac/cikis_kaydi.py` (python, atexit yığılır).
Bash'te trap ZİNCİRLENİR (`trap -p EXIT`), asla ezilmez — su-izleme'nin
temizlik trap'i korunarak kanıtlandı. Python tarafında sys.path güvencesi
ZORUNLU (altin-ornek `python3 -c` ile başka dizinden yükler; 26.08 --tam
md23 kırmızısıyla ölçüldü).

**K2 — Bekçi ölü-adam anahtarı: izleyici indexnow-bildir.mjs seçildi.**
Bekçi her koşum başında `izleme/state/bekci-damga.txt` basar; damga >26s
(günlük koşum + 2s pay) ise indexnow-bildir Telegram'a düşürür (24s
baskılama ile). Seçim gerekçesi: (1) yedek-al OLAMAZ — B6'da bekçi yedeği
izlemeye başladı, karşılıklı izleme çifti ikisi birden ölünce susar;
(2) 6×/gün koşan en sık bağımsız kalem → ≤4s tespit gecikmesi; (3) işlevi
sağlık/yedek zincirinden bağımsız. **BİLİNEN ORTAK HATA NOKTASI (çözülmedi,
bilinçli kapsam dışı): cron'un kendisi ölürse hiçbir kalem koşmaz ve hiçbir
alarm düşmez.** Bekçi ayrıca yedeği izler: son-yedek.json >26s ya da YOK →
kırmızı + Telegram (hem "başarısız" hem "hiç koşmadı" körlüğü kapandı).

**K3 — Sayfa.astro:362 `is:global` içinde `:global()` — Astro 7'de de
BİLEREK DÜZELTİLMEDİ.** Düzeltilirse bugüne dek hiç uygulanmamış
`height:100%` kuralı AKTİFLEŞİR ve görsel değişir; görsel değişiklik kıyas
karesi + kullanıcı onayı ister. Düzeltme ancak ayrı, onaylı bir görsel işle
yapılır.

**K4 — stil-pilot ilgili-kart sırası koleksiyon sırasına bağlı kalır.**
Sayfa noindex + sitemap dışı pilot; sıralamanın kararlılığı yayın yüzeyini
etkilemiyor. İstenirse frontmatter sırasına sabitleme ayrı küçük iştir.
KARARLA KAPATILDI.

**K5 — npm açıkları (24: 16 orta + 8 yüksek) TAMAMI build/ölçüm-zamanı;
yayınlanan çıktıya giren SIFIR. KARARLA KAPATILDI, onarım yapılmadı.**
Ölçüm 26.08: 22/24 lighthouse zinciri (opentelemetry ailesi 15 + sentry +
puppeteer-core + @puppeteer/browsers + extract-zip + ip-address +
brace-expansion + lighthouse'un kendisi) — lighthouse yalnız md9 ölçümünde
sunucuda koşar, siteye kod göndermez. nanoid: astro→vite→postcss (build
CSS işleme). sharp: astro görsel işleme (build). Kanıt: dist/ içinde
nanoid/opentelemetry/sentry imzası 0 eşleşme. `npm audit fix`
ÇALIŞTIRILMADI (lighthouse sürüm düşürmesi md9 tabanını bozar — §M9
kararıyla tutarlı). Yeni açık doğarsa md20 zaten kırmızı verir (taban
dedektörü).

---

## §34 · K7 — `/ilce-sorgu/` veri karşılığı olmayan üç çıktı kaldırıldı,
## künye türetme yolunu söylüyor (27.08.2026, kullanıcı onaylı)

**Karar: (a) + (b) birlikte uygulandı. (c) REDDEDİLDİ.**

**(c) neden reddedildi.** Sayfa `noindex`e ALINMADI, sitemap'te kaldı,
521 iç link korundu. Gerekçe: (a)+(b) uygulandıktan sonra sayfada kalan
her çıktının veri karşılığı var; yayın yüzeyinden çıkarmayı gerektiren
bir kusur kalmadı. `noindex` kalıcı bir çare değil, ertelemeydi.

**(a) — kaldırılan üç çıktı ve hesapları.** Depoda karşılığı olmayan
veri üretiyorlardı:
- *"tahmini su doygunluk derinliği: X–Y metre"* — `dMin = 15+(1-duz)*65`;
  depoda derinlik verisi YOK.
- *"baskın kayaç ve akifer türü: Alüvyal / Karstik / Granit"* — `duz>.5` /
  `vadi>.3` eşiklerinden; depoda litoloji verisi YOK.
- *"Su Çıkma Olasılığı %"* — `yasS*.35+twiS*.3+yagS*.2+jrcS*.15` bileşik
  indeksi; indeks olasılık DEĞİLDİR.
Hesaplayan kod, bileşen dökümü kartı, `graceYon` veri yolu, `setS`
yardımcısı ve `.ahp-*` CSS kuralları da kaldırıldı — ölü kod bırakılmadı.

**(b) — künye ve yöntem etiketleri.** Ölçülen gerçek durum:
- **AHP değil.** Kodda pairwise karşılaştırma matrisi, özvektör ve
  tutarlılık oranı yok; sabit ağırlıklı doğrusal toplam vardı. Etiket
  bileşik indeksle birlikte kaldırıldı.
- **TWI hesaplanmıyor.** `morfoloji.json` `yontem.twi = "hesaplanmadı"`;
  sayfadaki "TWI" bileşeni `(duz+vadi)/2` idi. Bileşen listesinden ÇIKTI.
- **"Yağış" bileşeni CHIRPS'ten gelmiyordu**, `graceYon` etiketinden
  geliyordu — havza sayfalarının kendi şerhi "GRACE il/ilçe ölçeğinde
  kullanılamaz" dediği için iç çelişkiydi. Gerçek kaynağıyla
  etiketlemek yerine ÇIKARILDI: GRACE bu ölçekte kullanılamaz olduğuna
  göre etiketi düzeltmek de bileşeni meşrulaştırırdı.
- **"Yüzey Suyu" bileşeni boştu.** `jrc-yuzey-suyu.json` 25/25 havzada
  `"islenmedi"` ve `src/` içinde HİÇ import edilmiyordu; bileşen
  `min(1, duz*1.5)` ile `duz_oran`'dan üretiliyordu. K1 kuralı gereği
  (verisi olmayan gösterge puana girmez) ÇIKARILDI.
- **Ters künye düzeltildi.** "Arazi Yapısı · Copernicus GLO-90 DEM" →
  "il düzeyi Copernicus GLO-90 DEM'den türetilmiş — ilçe ölçümü
  değildir". Kaynağın ADI silinmedi (kaynak gerçek); türetme YOLU
  eklendi. Metin `ilce-morfoloji.json` `kunye.not` ve `kunye.yontem`
  alanlarından türetildi.
- **`ort_egim` 948/948 null** olduğu hâlde her ilçede "Ortalama eğim:
  0,0°" basılıyordu (K1'de kapatılan kusurun ikizi). Artık null ise
  değer basılmıyor, "veri yok" yazıyor.

**Kaynak listesi ölçülene indirildi.** Kapsam şerhindeki GRACE NASA GSFC
ve EPİAŞ silindi: ikisinin de bu sayfada veri yolu YOK (EPİAŞ hiç
olmamıştı). Kalanlar sayfanın fiilen okuduğu kaynaklar.

**Bağlayıcı ilke (K1 ile aynı).** Bu depoda türetilmiş veri, türetildiği
söylenmeden yayınlanmaz; verisi olmayan gösterge puana girmez; yöntem
adı (AHP, TWI) kodda karşılığı yoksa yazılmaz.

---

## Bu dosyaya kayıt ekleme kuralı
Bir karar "kalıcı" ise (geri dönülürse iş yeniden yapılır, ya da 3 ay sonra
biri "neden böyle?" diye soracaksa) buraya yazılır. Geçici tercihler ve tek
seferlik işler GUNLUK.md'ye, açık işler SIRADAKILER.md'ye gider.
