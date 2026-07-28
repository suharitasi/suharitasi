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

---

## Bu dosyaya kayıt ekleme kuralı
Bir karar "kalıcı" ise (geri dönülürse iş yeniden yapılır, ya da 3 ay sonra
biri "neden böyle?" diye soracaksa) buraya yazılır. Geçici tercihler ve tek
seferlik işler GUNLUK.md'ye, açık işler SIRADAKILER.md'ye gider.
