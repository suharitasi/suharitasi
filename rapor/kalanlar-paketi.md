# KALAN TÜM MAKİNE İŞLERİ — TEK PAKET — kapanış raporu

Brief: `cikti/brief/2026-08-25T08-42-39Z-kalanlar-paketi.md`
(düzeltilmiş: `...-duzeltilmis.md`) · Worktree: `suharitasi-kalanlar`
(dal `kalanlar-2026-08-25`) · Model: Fable 5 · Sınıf: BÜYÜK İŞ (beyan
brief'te) · Başlangıç: 2026-08-25T08:42Z.

## 0. Rejim kapısı (denetim + düşman geçişi + amaç özeti)

### 0a. Brief denetçisi
Orijinal koşum: **1 ENGEL + 2 UYARI** (T5 commit+push anılmamış; T1×1 +
T6). Yalnız-ekleme düzeltmesi (E1-E3) sonrası: **ENGEL 0, 2 UYARI** —
ikisi de T1 referans uyarısı ve açıklamalı: `rapor/kalanlar-paketi.md`
bu işin YENİ çıktısıdır; `surum.json` build/canlı ürünüdür, repo dosyası
değildir. Denetim raporları: `cikti/denetim/brief/2026-08-25T08-43-36Z.md`
ve `...T08-43-53Z.md`.

### 0b. Amaç özeti
- **Amaç:** biriken makine işlerinin tek pakette, madde başına ayrı
  merge'le kapanması: veri hattı dayanıklılığı · görünür güncellik
  damgası (C5 №5) · C/SIRADAKILER envanter ve küçük işler · sağlık son
  durum · belge hijyeni.
- **Dokunulmazlar:** hukuki metin (içerik gövdesi değişmedi; damga yalnız
  künye/şema) · yeni renk/font/desen (damga MEVCUT SayfaBasi künye
  satırı) · yeni özellik (AY) · arslanhukuk.tr ve BIST dosyaları
  (dokunulmadı) · build saati damga olamaz (uydurma yasağı).
- **Bitti-tanımı:** Faz 0 envanteri + madde başına kanıt + merge/deploy
  teyidi + canlı --tam + bu rapor.
- **Kanıtlar:** falsifikasyon message_id'leri · sha256 bit-eşitlik ·
  izole --hizli çıktısı · canlı içerik imzası · SEO/GEO denetçi sayıları
  · önce/sonra kareler.

### 0c. Düşman geçişi (D1-D4)
- **D1 — FAIL yolu:** site-geneli görünür damga eklemenin md14 G1-G6 /
  dokunma / taşma tabanlarını kırması. Karşı şart: izole kapı merge
  ÖNCESİ koşuldu — sonuç TAM YEŞİL (md14 sapma 0; taban yenileme bile
  gerekmedi). İkincil FAIL: damganın build saatinden basılıp her
  deploy'da oynaması (sahte tazelik) — karşı şart: tarih yalnız veri
  kaydından; biçimsiz tarih null → basılmaz (ölçüldü). Üçüncül: uyarı
  yaması pipeline'ı düşürür — karşı şart: her uyarı çağrısı `|| true`,
  yeşil yol koşumlarla kanıtlı (baraj exit 0 · grace "değişiklik yok" ·
  nhyp A/B yeşil · yedek gerçek koşum başarılı).
- **D2 — boş çıkabilecek varsayımlar:** (i) "SYGM taşıması NHYP
  sondasını da kırdı" — ÖLÇÜLDÜ ve YANLIŞLANDI (12/12 eski yolda 200);
  (ii) "arşivden çıkarılan kayıt taramada döner" — ilk iki denemede
  yanlıştı (1963 kaydı sonuçlarda yok; aynı URL'yi paylaşan ikinci kayıt
  kimliği ayakta), üçüncü denemede taranan-satırdan seçilerek doğrulandı;
  (iii) "Cloudflare Pages'te git geçmişi var" — varsayılMADI, guncelleme
  alanı frontmatter'a yazıldı.
- **D3 — değen maddeler:** damga ↔ md14 tabanı (ölçümle çözüldü, sapma
  0) · rg-nobetci "git'e dokunmaz" sözleşmesi ↔ çıktının commit'lenmesi
  gereği (çözüm: taşıyıcı su-izleme, nöbetçi git'siz kaldı — §27 K1).
- **D4 — yarıda kesilme:** her madde ayrı merge edildi; kesilme anında
  main hep yayınlanabilir durumda kaldı (damga merge'i tek adım, öncesi
  ve sonrası kapılı).

## 1. Faz 0 — envanter ve bütçe

Bütçe önden ölçüldü: en pahalı adımlar canlı `--tam` (~8-10 dk) ve izole
kapı (~75-90 sn); tüm paket tek koşuma sığdı — "sıradaki koşuma" kalan
YOK (SIRADAKILER kürasyonunun kalan kısmı hariç, aşağıda).

### C listesi üçlü sınıflaması (C5 №1-10)

| № | Kalem | Sınıf | Durum |
|---|---|---|---|
| 1 | GSC sitemap + dizin isteği | (b) kullanıcı | bekliyor |
| 2 | Veri gazetecisi teması | (b) kullanıcı | bekliyor |
| 3 | LinkedIn/GBP/Wikidata → sameAs | (b) kullanıcı (kod 5 dk, profil doğunca) | bekliyor |
| 4 | md17 GET-düşümü | (a) makine | **25.08 sabahı kapanmıştı** (96c7813) |
| 5 | Görünür güncellik damgası | (a) makine | **BU PAKETTE KAPANDI** (bölüm 3) |
| 6 | /goller/ + /nehirler/ hub | (c) yeni özellik | kuyruk (AY) |
| 7 | Baraj/GRACE tarihçe bölümleri | (c) yeni özellik | kuyruk (AY) |
| 8 | 948 ilçe statik sayfası | (c) yeni özellik | kuyruk (AY; ince-içerik riski şerhli) |
| 9 | 11 title + 11 öz-cevap + H2 soru biçimi | (b) [SERDAR-HUKUK] | bekliyor |
| 10 | isletme-sahalari-yeni.json akıbeti | (b) kullanıcı kararı | bekliyor — EK BULGU: dosya 18-24.08'de tüm hatların push'unu tıkamıştı (bölüm 2) |

(a) grubundan bu koşuda uygulanacak tek kalem №5'ti — uygulandı.

### SIRADAKILER üçlü sınıflaması (açık kalemler)

**Makine yapabilir → bu pakette YAPILDI:** www-200 sağlık kalemi (md24) ·
--test 7/7 doğrulaması · veri hattı uyarı yolları (5.3) · kirli-ağaç kök
nedeni · yedek geri-alma denemesi · damga (C5 №5) · belge hijyeni (kısmi
kürasyon dahil).

**Kapanmış ama işaretlenmemiş → ÖLÇÜLEREK kapatıldı:** md14 taban
yenileme (taban 24.08 + son --tam yeşil) · nöbetçi canlılık kalemi
(bekçi satır 107, M13) · "rg/nhyp hiç koşmamış" (state: 25.08 / 19.08) ·
www-522 (custom domain 29.07 + md24 sürekli izleme) · --test 6/7 (7/7
ölçüldü) · K1 Faz D (ölçüm yapıldı; pull hatası bulunup kök nedeni
giderildi) · BRIEF.md yol haritası (zaten güncellenmiş — Aşama 0a-4 [x],
4C/8GB düzeltilmiş; eski şikâyet kalemi bayattı).

**Kullanıcı bekliyor:** kapanış listesi bölüm 7'de.

### Kapsam dışı — "ayrı brief ister"
Astro 5→7 (+ maplibre 6) · TWI havza-bazlı D8 · üyelik/ödeme (satış
katmanını yeniden açma) · hub sayfaları (C6) · tarihçe bölümleri (C7) ·
948 ilçe (C8) · WebGL sahne · GRACE değişim haritası · 3a dokunma borcu
(90 öğe, desen kararı) · D2 kontrast ≥7:1 (görsel kimlik, tam rejim).

## 2. Madde 5 — veri hatları, nöbetçiler, yedek [VERİ]

### 2.1 Hat durumu (state'lerden ölçüldü, 25.08)
| Hat | Son başarılı | Not |
|---|---|---|
| baraj (günlük 15:05) | 24.08 commit d063e00, origin'de | 18-24.08 pull tıkalıydı — aşağıda |
| GRACE (haftalık Pzt) | koşuyor; kaynak Last-Modified 17.06.2026 | kaynak 69 gündür yeni yayın vermedi — DIŞ |
| su-izleme (2×gün) | 25.08 05:45 + entegrasyon koşumu 09:01 | sağlıklı |
| rg-nobetci (Salı) | 25.08 04:20, 109 satır, hata 0 | sağlıklı |
| nhyp-nobetci (Çar) | 19.08, A/B yeşil | sağlıklı; sonda 12/12 ölçüldü |
| saglik-bekcisi (günlük) | 25.08 "sağlık OK" | sağlıklı |
| yedek (gecelik 02:10) | 25.08 başarılı, 1.218 MB | geri alma denemesi bugün tazelendi |
| keşif botu (günlük 05:00) | 25.08 exit 0; 22 öneri / 3 mesaj (4659-4661) | sağlıklı |
| site-saglik cron (2×gün) | 25.08 06:51 --tam | bölüm 6 |

### 2.2 KÖK BULGU — kirli ağaç, 41 bekleyen commit (bizim arızamız)
Belirti → hipotez → kontrol → bulgu: baraj cron'unda 22-24.08 "cannot
pull with rebase" → cron-hata.log "kirli dosyalar: M
veri/potansiyel/isletme-sahalari-yeni.json" (18-24.08 her gün; bekleyen
commit 23→41) → rg-nobetci `--kosum` HER koşumda dosyaya `son_kosum`
damgası basıyor → dosya `izleme/` DIŞINDA, hiçbir otomatik commit'çi
almıyor → her salı ağaç kirleniyor, tüm hatların pull/push'u tıkanıyor;
24-25.08 merge'leri dosyayı commit'leyince kendiliğinden açılmıştı ama
gelecek salı yeniden başlayacaktı. **Onarım (KARARLAR §27 K1):**
nöbetçi çıktıya yalnız YENİ KAYITTA yazar (+Telegram bildirimi);
su-izleme dosyayı koşullu git add ile taşır. **Kanıt:** 0-yeni koşumda
sha256 bit-eşit (`584216db…` önce=sonra) + "DOKUNULMADI" çıktısı;
sahte-yeni koşumda (falsifikasyon kancalarıyla, gerçek dosyaya
dokunmadan) +1 kayıt yazımı + Telegram message_id 4666; su-izleme
entegrasyon koşumu d2608e4 (exit 0, ağaç temiz).

### 2.3 Telegram uyarı yolu (5.3) — 4 hatta genişletildi
Ölçülen boşluk: uyari-gonder yalnız bekçi + su-izleme + rg-nobetci +
esik-denetim'de vardı; baraj/grace/yedek/nhyp hatlarının kırmızısı
yalnız log dosyasında kalıyordu (2.2'deki 7 günlük körlük bu sınıftı).
Bağlandı ve HER BİRİ kasıtlı bozmayla kanıtlandı:

| Hat | Kasıtlı bozma | Kırmızı kanıtı | Yeşil kanıtı |
|---|---|---|---|
| baraj | `BARAJ_CEK_KOMUT=false` | message_id **4662**, exit 1 | `=true` → exit 0, mesaj 0 |
| grace | `GRACE_URL_EZME=invalid` | message_id **4663**, ardışık 1 | gerçek koşum → "değişiklik yok", ardisikHata 0 |
| nhyp | `NHYP_NOBETCI_SYGM_EZME=invalid` | message_id **4664** (A🔴 B🔴) | gerçek koşum → A🟢 B🟢, mesaj 0 |
| yedek | git'siz `YEDEK_KOK` | message_id **4665** | gerçek koşum (scratch hedefe, 226 sn, "basarili") |
| rg-nobetci yeni-kayıt | arşiv-eksiltme kancası | message_id **4666** + scratch dosyaya +1 | 0-yeni koşumda dosya bit-eşit |

Yedek falsifikasyonu gerçek bir kusur da yakaladı: uyarıcı `$KOK`
üzerinden çözülüyordu ve `YEDEK_KOK` ezmesiyle kopuyordu — script-yerel
yola alındı. NOT: 4662-4666 mesajları falsifikasyon TESTİDİR, gerçek
arıza değildir.

### 2.4 Yedek (5.4)
Son yedek: 25.08 02:10, "basarili", 1.218.536.987 bayt, sha256
doğrulaması yazım-sonrası (script sözleşmesi). Geri alma denemesi BUGÜN
tazelendi: `guncel/depo.bundle`dan klon başarılı + `git fsck` temiz
(exit 0), HEAD bundle anındaki geçmişle tutarlı. SINIR (değişmedi):
ikinci konum AYNI makinede — makine-dışı konum kullanıcı kararı (★4).

### 2.5 Merge durumu
Bu madde ana ağaçta yapıldı (KARARLAR §24 emsali: cron'un koştuğu gerçek
dosyalar üzerinde uçtan uca falsifikasyon gerekiyordu; site build'ine
dokunmaz). Commit `3fcb5f8`, push edildi.

## 3. Madde 1 — görünür güncellik damgası (C5 №5) [VERİ]

### 3.1 Kapsam ölçümü (önce)
Görünür damga yalnız 4 içerik şablonunda vardı ve BAYATTI (sabit
frontmatter tarihi 14.07; dateModified=datePublished — eeat-audit №1
bulgusu); hangi-kurum kendi desteğiyle sağlıklıydı; 500+ veri
sayfasında damga da dateModified da yoktu.

### 3.2 Uygulama
- **Tarih kaynağı yalnız veri kaydı** (`src/data/guncellik.js`): baraj
  künye `sonGuncelleme` 24.08 · GRACE `islemeTarihi` 16.07 · DSİ/SYGM
  künyeleri (en yeni: doğrulama 25.08) · il potansiyel `uretim_tarihi`
  27.07 · göl/nehir OSM çekimi 04.08 · persona `kayitTarihi` 21.07 ·
  ilçe-morfoloji 04.08 · RG son tarama 25.08. Biçimsiz tarih → null →
  damga BASILMAZ (ölçüldü: `trTarih('bugün') = null`).
- **İçerik sayfaları:** koleksiyonlara opsiyonel `guncelleme` alanı; 36
  md dosyasına git geçmişinden ÖLÇÜLEN son gerçek değişiklik günü
  yazıldı (rehberler 25-26.07, yeralti-suyu-isletme-sahasi 25.08, 21
  havza 25.08 SYGM onarımı, vaka 21.07, taslak-takibi 25.07; 2 dosya
  tarih=guncelleme olduğundan alansız). Build-time git türetimi
  REDDEDİLDİ: Cloudflare Pages sığ klonunda güvenilmez. Süreç kuralı
  KARARLAR §27 K3'te.
- **Görünür desen:** SayfaBasi'nın MEVCUT künye satırı (`tarih` prop'u,
  mono katman) — yeni desen icat edilmedi. Şema: dateModified =
  guncelleme ?? veri tarihi; datePublished DEĞİŞMEDİ; göl/nehirde tarih
  FAQPage düğümünde (BodyOfWater Place'tir, tarih alamaz); su-kanunu
  sayfalarına tekil WebPage düğümü eklendi (sayfada başka WebPage yoktu
  — çift düğüm kirliliği yok).

### 3.3 Kanıt (1.5)
- **Basılan:** görünür damga **149 → 509 sayfa**; şema dateModified
  **4 → 508 sayfa** (hangi-kurum kendi deseniyle fiili görünür kapsam
  510/522). Örnek canlı değerler: havza 25.08 · il 27.07 · göl/nehir
  04.08 · rehber kuyu-ruhsati 26.07 · kapatma/arşiv 25.08.
- **Basılmayan 13:** ana sayfa (öz-cevap muafiyeti emsali §8 — landing
  ayrı yüzey) + 12 hub/indeks (hakkinda, harita, havzalar, kuyu-ruhsati,
  rehberler, su-kanunu, vaka indeksleri, havza-riski, kullanilanlar,
  pilotlar) — tekil veri kaydına dayanmayan liste sayfaları; ayrıca
  ilce-sorgu ve ilimde-kim-yetkili görünür damga taşır ama sayfa şeması
  olmadığından dateModified taşımaz (şemasızlık önceden beri; bilinçli
  bırakıldı).
- **Şema geçerliliği:** json-ld-gecersiz **0** (seo+geo denetçileri);
  SEO bulgu **26** / GEO **23** — canlı tabanla birebir, gerileme 0.
- **Kapılar:** build temiz 522 · sitemap 519 · izole `--hizli` **TAM
  YEŞİL 11/11** — md14 G1-G6 sapma **0** (görsel taban yenileme
  GEREKMEDİ) · dokunma 201=201 · konsol 0 · 375 taşma 0 · altın örnek
  23/23 · ana sayfaya dokunulmadı (ağırlık değişmedi).
- **Önce/sonra kareler:** `cikti/denetim/kalanlar/` (canlı=önce,
  yerel=sonra; sakarya + kuyu-ruhsati, 1440px).
- **Merge + deploy:** b95151d → main merge `3637fc1`, push; canlı
  İÇERİK İMZASIYLA teyit: `surum.json = 3637fc1` + canlı Gediz görünür
  damga `2026-08-25` + canlı rehber dateModified `2026-07-26`.

## 4. Madde 2+3 — C makine kısmı ve küçük işler

- C (a) grubu = yalnız №5 (bölüm 3). Diğer 9 kalem: 4 kullanıcı, 3
  kuyruk, 1 zaten kapalı, 1 kullanıcı kararı (tablo bölüm 1).
- **md24 www kalemi** (SIRADAKILER www-522 açık kalemi): 200 + canonical
  apex; adres TABAN'dan bağımsız (izole koşumda da canlı www ölçülür).
  Falsifikasyon 2/2: ölü URL ezmesi → `24-www KIRMIZI (404)`; normal →
  `GEÇTİ www 200 + canonical apex` (genel YEŞİL 12 kalem). Commit
  `880863f` (küçük iş, ana ağaç — md17 emsali).
- **--test:** 7/7 senaryo beklenen davranışı üretti (koşum çıktısı
  kaydedildi) — eski "6/7 senaryo (i)" kalemi ölçümle kapandı.
- **robots/AI bot panel doğrulaması** (eski DÖNÜŞÜM kalemi): canlı
  robots.txt 25.08'de Tier-1 5/5 ölçülmüştü (GEO/SEO B6). Cloudflare
  panel tarafı BURADAN ÖLÇÜLEMEZ; bot-UA taklidi de kanıt değildir
  (Cloudflare gerçek bot IP doğrular — 29.07 "tek vantaj noktası" dersi).
  Kalan kısım kullanıcı listesinde.

## 5. Madde 6 — belge hijyeni

- KARARLAR **§27** (4 karar) · GUNLUK 25.08 3. seans · DEVIR §4 dış
  bildirim bloğu · SIRADAKILER: üste kapanış bloğu + 8 kalem ölçüm
  kanıtıyla işaretlendi.
- **SIRADAKILER kürasyonu (kısmi):** içinde açık madde kalmamış 7 blok
  `arsiv/SIRADAKILER-ARSIV-1.md`'ye TAŞINDI (silinmedi; bütünlük
  ölçüldü: her blok ana=0/arşiv=1). Dosya 1362→1293 satır. Kalan karışık
  blokların (açık+kapalı iç içe) kürasyonu ayrı tur ister — kalem
  SIRADAKILER'de.
- **/kullanilanlar/ sayıları:** ölçüldü — `src/data/kullanilanlar.js`
  "hepsi BUILD'DE SAYILIR" sözleşmesiyle üretiyor, elle rakam 0; sayfa
  öz-cevabı 280 bekçili. Sabit rakam bulunmadı → bekçiye ek iş çıkmadı.
- **kaynak-takvimi:** cron takvimi değişmedi (yeni/taşınan koşum yok) —
  güncelleme gerekmedi.

## 6. Madde 4 — sağlık sisteminin kapanış durumu

Canlı `--tam` (taze build ile, 25.08 öğle koşumu):

**GENEL: SARI — kırmızı 0 · sarı 1 · geçti 22** (md24 dahil; koşum
2026-08-25 öğle, taze build, canlı hedef).

| Sonuç | Kalem | Sınıf |
|---|---|---|
| 🟡 | 17-dis-baglanti: 18 bağlantı 5xx/zaman-aşımı (52/1037 örneklem, **ölü 0**) | **DIŞ** — resmigazete/mevzuat eksik ara-sertifika ailesi + handle.net 500'leri (25.08 sabah koşusuyla aynı sınıflama; kurum tarafı, düzeltilmeye çalışılmadı — brief 4.3) |
| 🟢 ×22 | erişim 519/519 · yönlendirme 6/6 · **24-www yeşil** · medya 6/6 · konsol 0 · taşma 0 · kontrast AA · md7 13/14+muaf · iç link kırık 0 · etkileşim 4/4 · md14 sapma 0 (taban 24.08) · dokunma 201=201 · a11y 14×100 · Lighthouse 14/14 eşik üstü · veri bütünlüğü · md16 bulgu 20 = taban 20 · md18 13 dosya · başlık/OG/CTA · altyapı · altın örnek 23/23 | — |

- Bizim arızamız: **0** (öncelik-1 sınıfı boş çıktı; paketin 2.2 bulgusu
  zaten kapatılmıştı).
- Bayat taban: **yok** — md16 taban 20 birebir; md14 taban 24.08 yeşil;
  yenileme gerekmedi (4.4).
- Not: ana sayfa Lighthouse mobil 82 (eşik 70 üstü) — bilinen tek-atış
  oynaklığı (82-99 bandı; "3 tur medyan" kararı kullanıcı listesinde).

## 7. KULLANICI KARARI / ELİ BEKLEYENLER (öncelik sıralı, tek liste)

1. **GSC: sitemap yeniden gönder + ~20 sayfaya tekil dizin isteği**
   (C5 №1; ~30 dk) — taramanın başlaması için en ucuz kaldıraç.
2. **Veri gazetecisi teması** (C5 №2; temas-listesi §3) — dış bağlantının
   (tarama bütçesinin) gerçek anahtarı.
3. **LinkedIn/GBP/Wikidata profilleri → sameAs** (C5 №3; ~2 saat +5 dk kod).
4. **.env kopyası şifre yöneticisine** (★3; ~5 dk) — kurtarma darboğazı.
5. **Makine-dışı yedek konumu** (★4; R2 önerisi hazır) — yedek AYNI
   makinede, disk ölümüne karşı korumasız.
6. **[SERDAR-HUKUK] içerik kararları:** 11 içerik title'ı + 11 uzun
   öz-cevap + rehber H2 soru biçimi (C5 №9) · KVKK metni.
7. **isletme-sahalari-yeni.json akıbeti** (C5 №10) — dosya şu an boş ve
   commit'li; yeni kayıt düşerse Telegram bildirimi gelecek.
8. **GitHub Actions dış nabzı** (★7) — sunucudan bağımsız tek izleme.
9. **D2 kontrast ≥7:1** (DESIGN §18.2) — ayrı BÜYÜK brief.
10. **Astro 5→7 + maplibre 6** — ayrı BÜYÜK brief (npm-acik-degerlendirmesi §4).
11. **Lighthouse 3-tur medyan kararı** (tek atış oynaklığı 82-99).
12. **Sunucu kararları (root):** bellek tavanı / swappiness / suha'ya
    journal erişimi; /root'taki eski keşif botu kopyasının silinmesi.
13. **Cloudflare panel doğrulamaları:** AI botlarına Managed-block var mı;
    Web Analytics API erişimi ("son 24 saatte olay>0" kalemi için).
14. **Küçük kararlar:** öksüz bileşen silme (M10) · logo dosyası ·
    telefon/konum bilgisi · il seçici 2-kolon kapsamı · Sakarya harita
    katmanı konumu · D2-A/D4-A referans görsel seçimi · eski 3 LinkedIn
    kartının C paletiyle yeniden üretimi · WhatsApp satış paketi
    (bekletilen) · Buttondown hesabı.

## 8. GEO/SEO değerlendirme notu (kıdemli analist çerçevesi)

Bu paketin GEO/SEO omurgası damgaydı ve bilinçli olarak MUHAFAZAKÂR
kuruldu: dateModified yalnız gerçek veri/içerik olayında oynar — Google
"sahte tazelik"i sıralama sinyali saymadığı gibi güveni de düşürür;
YMYL'de görünür-ve-dürüst güncellik damgası E-E-A-T'nin en ucuz
sinyalidir (eeat-audit №1 kapanmıştır). Sıradaki en yüksek kaldıraç
KOD DEĞİL dağıtımdır: dizin 0 iken içerik-yüzeyi optimizasyonlarının
getirisi sıfıra yakındır — kullanıcı listesinin 1-2-3'ü (GSC + dış
bağlantı + varlık grafiği) her kod işinden önce gelir. Kuyruktaki hub
sayfaları (C6) ve tarihçe bölümleri (C7) tarama başladıktan SONRA anlam
kazanır; 948 ilçe (C8) dış bağlantı gelmeden ZARARLI olabilir (ince
içerik × kıt tarama bütçesi). Bu sıralama raporun C5 sıralamasıyla
uyumludur; değişiklik önerilmez.
