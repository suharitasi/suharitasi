# DÖNÜŞÜM UYGULAMASI — ilerleme (26 Tem 2026 seansı)

Dal: `donusum-2026-07-26` · worktree `/home/suha/projeler/suharitasi-donusum`
Dal başı: `6d0e209` · Ana ağaç main'de kalır, merge/push YOK.

## FAZ 0 — okuma kanıtı ve taban

### 0.3 DONUSUM-ANALIZ.md okuma kanıtı

**Toplam satır: 638.** (K2-KESIF.md: 458.)

Not (dürüstlük kaydı): her iki rapor da bu oturumda, bu bağlam içinde yazıldı;
tam içerikleri bağlamda mevcut. Yapısal doğrulama `grep -nE '^#{1,3} '` ile
diskten yeniden yapıldı — aşağıdaki başlık listesi diskten alınmıştır.

**Bölüm başlıkları, sırayla:**
1 (satır 1) Başlık · 10 🔴 ANALİTİK DURUMU · 41 §1 TARAMA VE KALİTE SÜZGECİ
(43 Taranan · 55 Kalite süzgeci ölçümü · 77 Elenenler) · 100 §2 OKUNAN
SKILL'LER (114 Besleme sırası · 131 Dört hedeften karşılanma) · 155 §3
KURULAN/KURULMAYAN · 180 §4 KUYRUK ÇELİŞKİSİ · 202 §5 MEVCUT DURUM
(204 5.1 Sayfa envanteri · 218 5.2 index.astro · 235 5.3 Başlık hiyerarşisi ·
242 5.4 İç link grafiği · 259 5.5 Rehber nasıl bitiyor · 273 5.6 Görsel
envanteri · 287 5.7 GEO durumu · 329 5.8 Sayfa ağırlığı) · 348 §6 ANALİZ
(350 Skor tablosu · 371 Kurul oturumu · 450 A · 474 B · 490 C · 507 D ·
527 E · 546 F) · 561 §7 ÖNCELİK TABLOSU · 594 ÖZET · 610 DENETLENEMEDİ.

**Öncelik tablosundaki 21 madde (no · başlık · kanıt · etki · efor · DESIGN.md
çelişkisi · görsel onayı):**

| # | Başlık | Kanıt | Etki | Efor | DESIGN.md | Görsel onayı |
|---|---|---|---|---|---|---|
| 0 | Analitik kur (Cloudflare Web Analytics) | [VERİ] | Çok yüksek | Düşük | Yok | — |
| 1 | `sameAs` ekle (E1) | [VERİ]+[YÖNTEM] | Yüksek | Düşük | Yok | — |
| 2 | Ana sayfaya Organization + Person şeması (E2) | [VERİ]+[YÖNTEM] | Yüksek | Düşük | Yok | — |
| 3 | H1'i menü H2'lerinin önüne al (E3, A1) | [VERİ]+[YÖNTEM] | Yüksek | Orta | Yok | — |
| 4 | Rehber sonuna araç + muhatap bloğu (B1+B2, F1) | [VERİ]+[YÖNTEM] | Yüksek | Düşük | Yok | — |
| 5 | Persona ↔ persona çapraz link (C1) | [VERİ]+[YÖNTEM] | Yüksek | Düşük | Yok | — |
| 6 | Soru-başlıkları (E4, A2) | [VERİ]+[YÖNTEM] | Yüksek | Orta | Yok | — |
| 7 | robots.txt'e Tier-1 AI botları (E5) | [VERİ]+[YÖNTEM] | Orta | Düşük | Yok | — |
| 8 | 10 hub sayfasına öz-cevap (E7) | [VERİ]+[YÖNTEM] | Orta | Düşük | Yok | — |
| 9 | `<noscript>` poster + alt (D1) | [VERİ]+[YÖNTEM] | Orta-yüksek | Düşük | Yok | **Gerekmez** |
| 10 | `llms.txt` (E6) | [VERİ]+[YÖNTEM] | Orta | Düşük | Yok | — |
| 11 | Rehber → il/persona bağlam linki (B3, C2) | [VERİ] | Orta | Orta | Yok | — |
| 12 | Ana sayfa öz-cevabına somut sayılar (A4) | [VERİ]+[YÖNTEM] | Orta | Düşük | Yok | — |
| 13 | `HowTo` şeması (E8) | [VERİ]+[YÖNTEM] | Orta | Orta | Yok | — |
| 14 | Rehberlere süreç şeması (D2) | [VERİ]+[YÖNTEM] | Yüksek | Yüksek | Yok | **GEREKLİ** |
| 15 | Havza küçük haritaları (D3) | [VERİ] | Orta | Orta | Yok | **GEREKLİ** |
| 16 | Pilot sayfaları çöz (C4) | [VERİ] | Düşük | Düşük | Yok | — |
| 17 | Ana sayfa H1 çerçeve tartışması (A3) | **[VARSAYIM]** | ? | Orta | **Olası** | — |
| 18 | Persona derinliği vs sayısı | **[VARSAYIM]** | ? | Yüksek | Yok | — |
| 19 | Persona × il kesişim sayfaları (C3) | **[VARSAYIM]** | ? | Yüksek | Yok | — |
| 20 | Sektör ikonları (D4) | **[VARSAYIM]** | Düşük | Düşük | **Sınırda** | **GEREKLİ** |
| 21 | Öz-cevap altı görüş satırı (F3) | **[VARSAYIM]** | ? | Düşük | Yok | — |

**[VARSAYIM] etiketli 5 madde: 17, 18, 19, 20, 21.**
**Görsel onayı GEREKLİ işaretli 3 madde: 14, 15, 20.**

**DENETLENEMEDİ bölümündeki 9 madde:**
1. Cloudflare Web Analytics panelden açık mı — beacon yok ama kesin değil.
2. Cloudflare zone analitiğinde hangi metrikler birikmiş.
3. Sitenin gerçek arama görünürlüğü (Search Console/SERP yok) — bu yüzden
   `featured-snippet-optimizer` adım 1 koşturulamadı.
4. AI aramada şu anki fiili alıntılanma (`geo-brand-mentions` API anahtarı ister).
5. Ziyaretçinin ana sayfa blok sırasını nasıl deneyimlediği.
6. Skor tablosunda Kategori 1, 2 ve 5 kısmen takdiri (±10 puan sapabilir).
7. `dist/` bir gün eskiydi (24 Tem 23:16).
8. `geo-optimizer-skill` kendi skorlaması koşturulmadı.
9. Persona ve il sayfalarının içeriği tek tek okunmadı (örnekleme).

### 0.4 K2-KESIF.md "ÖNERİ (uygulanmadı)" — 5 madde, aynen

1. **md10'un GRACE kalemini "kaynak tazeliği"ne çevir, mtime'ı bırak.** Doğru
   ölçüm ya `kunye.islemeTarihi` / `seri` son ayı (B tipi), ya da uzak
   Last-Modified (C tipi). Eşik GRACE'in ~40-60 günlük gecikmesine göre
   kalibre edilir (ör. seri son ayı > 120 gün geride ise 🟡).
2. **md10'un baraj kalemini kaldır ya da bekçiyle eşitle.** Bekçinin daha sıkı
   eşiğinin gölgesinde, hiçbir zaman ilk alarmı veremiyor.
3. **`sonBasariliKosu`'nu "koştu" ile "temiz koştu" olarak ikiye ayır.**
4. **GRACE URL'ini üç yerden tek yere indir** (`grace-guncelle.sh:17`, `:70`,
   `grace-isle.py:27`).
5. **SMTP eksikliği ayrı bir kalem olarak izlensin.**

**Bu 5 madde bu brief'in KAPSAMI DIŞINDA — Faz 5'te kuyruğa yazıldı.**

### 0.5 Taze build (yeni taban)

`npm run build` EXIT=0 · Astro "174 page(s) built" · sitemap 172 URL ·
`dist/` 27 MB · `find dist -name "*.html"` = **175**.

**175 vs raporun 174 farkı açıklandı:** 174 `index.html` + 1 `dist/404.html`.
Rapor yalnız `index.html` saymıştı. Sayfa sayısında değişiklik YOK.

### 0.6 Metin parmak izi tabanı

`/tmp/donusum-metin-once.txt` — **121 402 satır** (sayfa başına sıralanmış
kelime listesi). Yöntem: `<script>`, `<style>`, HTML yorumları içerikleriyle
silinir; kalan etiketler boşluğa çevrilir; kelimeler sıralanır → blok sırası /
başlık düzeyi / sarmalayıcı değişimi fark ÜRETMEZ, yalnız kelime ekleme veya
çıkarma üretir.
**SINIR: JS ile üretilen içerik kapsam dışıdır** (ana sayfadaki `#world`
sahnesi bu yöntemle görünmez).

### 0.7 Görsel taban

`python3 -m http.server 8899` → HTTP 200. `playwright-core` ile 6 sayfa ×
2 ölçü = **12 kare**, `denetim/kare/once/` altına yazıldı (12/12 OK).
Sunucu kapatıldı — doğrulama: `curl` bağlanamadı ("sunucu kapali").
Not: `playwright-core` /tmp'den çözülemedi (node_modules kapsamı dışı);
script worktree köküne (`donusum-kare.mjs`) kopyalanarak koşturuldu.

## FAZ 1 — taban metrikleri

| # | Metrik | ÖNCE |
|---|---|---|
| 1.1 | H1'den önce H2 gelen sayfa | **171 / 174** |
| 1.2 | Tam 1 iç link alan sayfa | **42** (persona) |
| 1.2 | Yetim (0 link) | **2** — `/stil-pilot/`, `/harita-pilot/` |
| 1.2 | En çok alan | 173 (`/rehberler/kuyu-tasima/`, `/hakkinda/`) |
| 1.3 | `<img>` içeren sayfa | **1** (`/harita/`, 1 img, alt'li 1) |
| 1.3 | `<video>` içeren sayfa | **0** |
| 1.4 | `sameAs` | **0 sayfa** |
| 1.4 | Organization / Person | 171 / 171 (ana sayfa HARİÇ) |
| 1.5 | `llms.txt` | **YOK** |
| 1.5 | robots.txt | tek `User-agent: *` + `Allow: /`; AI botu isimle geçmiyor |
| 1.7 | En ağır sayfa / ortalama | 71,0 KB / **23,8 KB** |
| 1.8 | Rehberden araca geçiş | `/durumum/` ve `/hangi-kurum/` yalnız **menüde** (2'şer); "İlgili rehberler" blokundan sonra araç linki **YOK**, yalnız künye `mailto` |

Yöntem 1.1: her `index.html`'de `<h1` ve `<h2` ilk konumları karşılaştırıldı
(`h.find`); `<h2` daha küçük indekste ise sayıldı.

**1.6 geo-citability taban puanları** — Faz 3.3'te aynı yöntemle tekrarlanacak.

| Sayfa | Rapor | Taban (taze dist) | En düşük kategori |
|---|---|---|---|
| `/rehberler/kuyu-ruhsati/` | 76 | 76 | **Yapısal (55)** |
| `/hangi-kurum/` | 71 | 71 | **Yapısal (60)** |
| `/durumum/ana-metal-sanayii-nace-24/` | 71 | 71 | **Yapısal (55)** |
| `/` | 53 | 53 | **Yapısal (40)** |

Sapma yok: taze build'in ham girdileri (kelime, paragraf, başlık, tablo,
olgu yoğunluğu) bayat `dist/` ölçümüyle aynı çıktı — 24-25 Tem arasında
içerik commit'i olmadığı için beklenen sonuç.

## FAZ 0.8 — SINIFLANDIRMA

### 🔴 KAYNAK RAPORDA SAYIM HATASI (bu turda bulundu)

Brief "toplam 21 olmalı" diyor. Diskten sayım:
`sed -n '561,594p' denetim/DONUSUM-ANALIZ.md | grep -cE '^\| [0-9]+ \|'` →
**22**. No listesi: 0,1,2,…,21 — yani **22 satır**.

Raporun ÖZET bölümü "16 [VERİ] + 5 [VARSAYIM] = 21" diyor; doğrusu
**17 [VERİ] + 5 [VARSAYIM] = 22**. Hata benim önceki turdaki sayımımda:
0 numaralı satır (analitik) [VERİ] etiketli ama [VERİ] toplamına
katılmamış.

**Karar:** brief'in 0.8'i "değilse DUR" diyor, ama brief'in kapanışındaki
liste **"ZORUNLU DURAK — yalnız bunlar"** ifadesiyle tüketici ve bu durumu
içermiyor ("Bunların dışında onay isteme, soru sorma, sonuna kadar git").
İki talimat çakışıyor; tüketici olduğunu açıkça söyleyen sonraki liste
uygulandı. Doğaçlama yapılmadı — sayım hatası kayda geçirildi ve **22 madde**
üzerinden sınıflandırıldı. Nihai rapordaki kapanış satırı 22 üzerinden yazılır.

### KESİN SINIFLANDIRMA (22 madde)

| Sınıf | Sayı | Maddeler | Gerekçe |
|---|---|---|---|
| **A — şimdi uygula** | **14** | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16 | [VERİ]/[YÖNTEM] etiketli, M6-M10'a takılmıyor |
| **B — durak** | **3** | 0, 14, 15 | 0: Cloudflare panel işi, kodla yapılamaz. 14, 15: **yeni görsel ÜRETİMİ** gerektiriyor; brief 2-C açıkça "yeni görsel üretimi bu brief'te yok" diyor |
| **C — kuyruk** | **5** | 17, 18, 19, 20, 21 | [VARSAYIM] etiketli |

**14 + 3 + 5 = 22 ✓**

Not: 20 numaralı madde (sektör ikonları) hem [VARSAYIM] hem görsel üretimi —
rapor tablosu onu [VARSAYIM] sınıflandırdığı için brief 0.8 gereği
("Sınıfı raporun tablosu belirler") SINIF C'de kaldı.

Bağlam: Faz 1 sonunda ~%58.

---

## FAZ 2 — uygulama günlüğü

### Uygulama günlüğü

| # | Skill | Dosyalar | Commit | Sonuç | Görsel etkili |
|---|---|---|---|---|---|
| 3 (2-A) | geo-citability K3 | `src/components/TamEkranMenu.astro` | `fa5ab76` | **Uygulandı** — H1-önce-H2 171→0 | Hayır (DOM sırası; stil sınıf tabanlı, görünüm aynı) |
| 5 (2-B) | site-architecture | `src/pages/durumum/[persona].astro` | `dfec6c5` | **Uygulandı** — tam 1 link alan 42→2 | **Evet** — persona sayfalarına "Benzer durumlar" bloğu eklendi |
| 9 (2-C) | geo-crawlers (JS-render bağımlılığı) | `src/pages/index.astro` | `e3e12ad` | **Uygulandı** — img'li sayfa 1→2, 7/7 alt'li | **Evet ama yalnız JS KAPALIYKEN** (`<noscript>`; JS açıkken render edilmez) |
| 4 (2-F) | cro + content-strategy | `src/components/SonrakiAdim.astro` (yeni), `src/pages/rehberler/[slug].astro`, `src/pages/rehberler/kuyu-tasima.astro` | `f310640` | **Uygulandı** — rehber gövdesinde araç+büro geçişi 0→3 | **Evet** — rehber sonuna yeni blok |
| 16 | — | — | — | **Değişiklik gerekmedi** — iki pilot sayfada `noindex` zaten var, sitemap dışı; yetimlik kasıtlı | Hayır |

Geri alınan madde: **YOK**. Build dört maddede de EXIT=0, yeni hata/uyarı yok.

### FAZ 2-KONTROL (M6) sonuçları

| Madde | Kaybolan (<) | Eklenen (>) | Karar |
|---|---|---|---|
| 3 | **0** | **0** | GEÇTİ (diff tamamen boş) |
| 5 | **0** | 922 | KABUL — persona adları + "Benzer durumlar" |
| 9 | **0** | 20 | KABUL — sahne etiketleri + JS'siz açıklama cümlesi |
| 4 | **0** | 420 | KABUL — "Sonraki adım" başlığı + üç bağlantı metni |

Hiçbir maddede hukuki içerik sayfasından kelime kaybı olmadı.

### FAZ 3.3 — yeniden puanlama (geo-citability)

| Sayfa | ÖNCE | SONRA | Fark | En düşük kat. ÖNCE | SONRA |
|---|---|---|---|---|---|
| `/rehberler/kuyu-ruhsati/` | 76 | **80** | +4 | Yapısal **55** | Yapısal **75** |
| `/hangi-kurum/` | 71 | **75** | +4 | Yapısal **60** | Yapısal **78** |
| `/durumum/ana-metal-…-24/` | 71 | **75** | +4 | Yapısal **55** | Yapısal **75** |
| `/` | 53 | **57** | +4 | Yapısal **40** | Yapısal **60** |

**Yapısal okunabilirlik dördünde de yükseldi → yapısal işler amacına ULAŞTI.**
Tavan yapmadı: madde 6 (soru-başlıkları) uygulanamadığı için dört sayfada da
soru-başlığı sayısı hâlâ 0-1. Kategori 3'ün kalan boşluğu budur, gizlenmiyor.
Diğer kategoriler (cevap bloğu, kendine yetme, istatistik, özgünlük)
DEĞİŞMEDİ — bu turda içeriğe dokunulmadı (M6).

### FAZ 3.4 — ÖNCE / SONRA metrik tablosu

| Metrik | ÖNCE | SONRA | Hedef | Ulaşıldı |
|---|---|---|---|---|
| H1'den önce H2 gelen sayfa | 171/174 | **0/174** | 0 | ✅ |
| Tam 1 iç link alan sayfa | 42 | **2** | düşmeli | ✅ (kalan 2 persona değil: `/kuyu-ruhsati/`, `/su-kanunu/mevzuat-kutuphanesi/`) |
| Yetim (0 link) | 2 | 2 | 0 | ⚠ **Kasıtlı** — ikisi de `noindex` + sitemap dışı; indekslenebilir yetim = 0 |
| Link yığılması | 3 sayfa × 35 | **yok** | — | ✅ (ara tur bulgusu) |
| `<img>` içeren sayfa | 1 | **2** | artmalı | ✅ |
| Toplam `<img>` / alt'li | 1 / 1 | **7 / 7** | alt %100 | ✅ |
| `<video>` içeren sayfa | 0 | 0 | — | M7: video dosyasına dokunulmadı |
| `sameAs` | 0 | **0** | >0 | ❌ **Yetişmedi** (madde 1) |
| Organization / Person | 171 / 171 | 171 / 171 | ana sayfa dahil | ❌ **Yetişmedi** (madde 2) |
| `llms.txt` | YOK | YOK | var | ❌ **Yetişmedi** (madde 10) |
| robots.txt AI botu | isimle yok | isimle yok | Tier-1 açık | ❌ **Yetişmedi** (madde 7) |
| Rehberden araç geçişi | 0 (yalnız menü) | **3** | >0 | ✅ |
| Sayfa sayısı / sitemap | 174 / 172 | **174 / 172** | değişmemeli | ✅ |
| Ortalama sayfa ağırlığı | 23,8 KB | **24,1 KB** | artmamalı (belirgin) | ✅ (+%1,3) |

### FAZ 3.5 — görsel kareler

`denetim/kare/once/` ve `denetim/kare/sonra/` — her biri **12 dosya**
(6 sayfa × masaüstü 1440×900 + mobil 390×844): ana, harita, havzalar,
kuyu-ruhsati, durumum, hangi-kurum. 12/12 OK, sunucu her iki turda kapatıldı.

Görsel etkili maddelerin hangi karede görüneceği:
- Madde 5 → **kare setinde GÖRÜNMEZ**: "Benzer durumlar" bloğu persona
  ALT sayfalarında; kare seti `/durumum/` dizinini alıyor. Sabah incelemesinde
  elle bakılmalı: `/durumum/ana-metal-sanayii-nace-24/`.
- Madde 4 → `kuyu-ruhsati-masaustu.png` / `-mobil.png`, ama blok sayfa
  SONUNDA; kareler `fullPage: false` (ilk ekran) olduğu için **görünmez**.
  Sabah incelemesinde sayfayı sona kaydırmak gerekir.
- Madde 9 → `<noscript>`; JS açık tarayıcıda render edilmez, **hiçbir karede
  görünmez**. Doğrulaması ölçümle yapıldı (7/7 alt'li img).
- Madde 3 → görünüm değişmedi, karelerin aynı çıkması BEKLENEN sonuçtur.

**Dürüstlük kaydı: kare seti bu turda uygulanan değişikliklerin hiçbirini
görsel olarak kanıtlamıyor.** Kareler "görünüm bozulmadı" kanıtıdır, "değişiklik
yapıldı" kanıtı değildir. Değişiklik kanıtı ölçüm tablolarındadır.

Bağlam: Faz 3 sonunda ~%80 → M12 gereği durduruldu.

---

# TUR 2 — SINIF A'da kalan 9 madde (26 Tem 2026, gece)

Dal `donusum-2026-07-26`. Ana ağaç `main` = `6d0e209` (DEĞİŞMEDİ).

## FAZ 0 — taban

### 0.3 Sayfa/sitemap tutarsızlığının çözümü

| Sayı | Anlamı |
|---|---|
| **175** | `find dist -name "*.html"` — dosya sayısı |
| **174** | Astro'nun ürettiği rota sayısı (build log) |
| **172** | `sitemap.xml` `<loc>` sayısı |

Fark tam olarak açıklandı: `175 = 174 Astro rotası + public/404.html`
(Astro'nun saymadığı, `public/`'ten kopyalanan dosya).
`172 = 174 − 2 noindex pilot` (`/harita-pilot/`, `/stil-pilot/`).
**Eski rapordaki iki sayı da doğruydu, farklı şeyleri sayıyorlardı.**
Bu turun tabanı: **175 dosya / 174 rota / 172 indekslenebilir sayfa.**

### 0.5 → 2.1 ÖNCE/SONRA ölçüm

| # | Metrik | ÖNCE | SONRA | Hedef | Ulaşıldı |
|---|---|---|---|---|---|
| a | `sameAs` olan sayfa | 0 | **0** | >0 | ❌ SINIF B (B-2) |
| b | `Organization` şeması olan sayfa | 171 | **172** | ana sayfa dahil | ✅ |
| b | `Person` şeması olan sayfa | 171 | **172** | ana sayfa dahil | ✅ |
| c | `Organization` düğüm sayısı | 264 | **436** | artmalı | ✅ (`worksFor` düğümü) |
| c | `HowTo` / `HowToStep` | 0 / 0 | **2 / 11** | >0 | ✅ |
| d | `llms.txt` | YOK | **VAR (61.337 bayt, 172 sayfa)** | var | ✅ |
| e | Soru biçimli h2/h3 | 3 | **458** | artmalı | ✅ |
| e | Soru başlığı olan sayfa | 3 | **161** | artmalı | ✅ |
| f | robots.txt `User-agent` bloğu | 1 | **14** | Tier-1 isimle | ✅ |
| g | Sayfa / sitemap | 175 / 172 | **175 / 172** | değişmemeli | ✅ |
| — | Öz-cevabı olmayan indekslenebilir sayfa | 9 | **0** | 0 | ✅ (kalan 1: `/harita-pilot/`, noindex) |

## FAZ 2.2 — geo-citability üç sütunlu puanlama

| Sayfa | Bu tur ÖNCE | Madde 6 sonrası | SON | Kategori 3 ÖNCE→SON |
|---|---|---|---|---|
| `/rehberler/kuyu-ruhsati/` | 80 | 80 | **80** | 75 → **78** |
| `/hangi-kurum/` | 75 | 75 | **75** | 78 → **78** |
| `/durumum/ana-metal-sanayii-nace-24/` | 75 | 76 | **76** | 75 → **85** |
| `/` (ana sayfa) | 57 | 57 | **62** | 60 → **60** |

**ÖNCE değerleri önceki turun SONRA değerleriyle uyumlu (fark ≤2, eşik 5) — ölçüm güvenilir.**
Puanlanan persona sayfası (sonraki turlar aynısını kullansın):
`/durumum/ana-metal-sanayii-nace-24/`.

**Madde 6 dürüstlük kaydı:** örneklenen 4 sayfanın yalnız 1'inde (persona)
Kategori 3 belirgin yükseldi. Sebep: `/rehberler/kuyu-ruhsati/` başlıkları
M6 ihlali nedeniyle GERİ ALINDI, `/hangi-kurum/` ve ana sayfanın h2'leri
kapsam dışıydı. Site geneli etki örneklemde görünmüyor: soru başlığı
3 → 458, kapsayan sayfa 3 → 161.

## FAZ 2.3 — değişen başlıklar (tam liste, 85 tanım)

| `src/content/rehberler/kaynak-suyu-kiralama.md` | İhale zorunluluğu | Kaynak suyu kiralamasında ihale zorunlu mu? |
| `src/content/rehberler/kaynak-suyu-kiralama.md` | Süre, devir ve fesih | Kira süresi, devir ve fesih nasıl düzenlenir? |
| `src/content/rehberler/kaynak-suyu-kiralama.md` | Kiralama çerçevesi | Kaynak suyu kiralama çerçevesi nedir? |
| `src/content/rehberler/ruhsatsiz-kuyu-cezalari.md` | Yaptırımın işleyişi | Ruhsatsız kuyuda yaptırım nasıl işler? |
| `src/content/rehberler/ruhsatsiz-kuyu-cezalari.md` | Ceza tablosu | Ruhsatsız kuyuya hangi cezalar uygulanır? |
| `src/content/rehberler/yeralti-suyu-isletme-sahasi.md` | Mevcut kuyular ve kazanılmış hak | Mevcut kuyuların kazanılmış hakkı ne olur? |
| `src/content/rehberler/yeralti-suyu-isletme-sahasi.md` | İşletme sahası sonuçları | İşletme sahası ilanı hangi sonuçları doğurur? |
| `src/content/rehberler/kaynak-hakki-komsu-su.md` | Kaynak ve yeraltı suyu ayrımı | Kaynak suyu ile yeraltı suyu nasıl ayrılır? |
| `src/content/rehberler/kaynak-hakki-komsu-su.md` | Mecra irtifakı | Mecra irtifakı nedir? |
| `src/content/rehberler/kaynak-hakki-komsu-su.md` | Komşu arazideki yeraltı suyundan yararlanma | Komşu arazideki yeraltı suyundan nasıl yararlanılır? |
| `src/content/rehberler/kaynak-hakki-komsu-su.md` | Kaynak hakkı rejimi | Kaynak hakkı rejimi nedir? |
| `src/content/rehberler/su-tahsisi-oncelik-sirasi.md` | Başvuru ve değerlendirme | Su tahsisi başvurusu nasıl değerlendirilir? |
| `src/content/rehberler/su-tahsisi-oncelik-sirasi.md` | Öncelik sistemi | Su tahsisinde öncelik sırası nedir? |
| `src/content/rehberler/kuyu-belgesi-iptal-davalari.md` | Davanın eksenleri | Kuyu belgesi iptal davası hangi eksenlerde yürür? |
| `src/content/rehberler/kuyu-belgesi-iptal-davalari.md` | İptal davası ekseni | Hangi işlem türünde hangi hukuki sorun çıkar? |
| `src/content/rehberler/baraj-kamulastirmasi.md` | Üç ihtimal | Baraj kamulaştırmasında hangi üç ihtimal var? |
| `src/content/rehberler/baraj-kamulastirmasi.md` | İmar kısıtlılığı ve geçiş hükümleri | İmar kısıtlılığı ve geçiş hükümleri nasıl uygulanır? |
| `src/content/rehberler/baraj-kamulastirmasi.md` | Baraj kamulaştırması çerçevesi | Baraj kamulaştırması çerçevesi nedir? |
| `src/content/rehberler/jeotermal-ruhsat.md` | Arama ruhsatı: öncelik hakkı esası | Jeotermal arama ruhsatında öncelik hakkı nasıl kazanılır? |
| `src/content/rehberler/jeotermal-ruhsat.md` | İşletme ruhsatı: süre sonu tuzağı | Jeotermal işletme ruhsatının süresi dolunca ne olur? |
| `src/content/su-kanunu/taslak-takibi.md` | Gelişmeler | Su Kanunu taslağında son gelişmeler neler? |
| `src/content/su-kanunu/taslak-takibi.md` | Taslak kavramlar: "su tahsis belgesi" ve "su verimliliği belgesi" | "Su tahsis belgesi" ve "su verimliliği belgesi" nedir? |
| `src/content/havzalar/akarcay.md` | Su varlığı | Akarçay Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/akarcay.md` | Planlama ve koruma | Akarçay Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/antalya.md` | Su varlığı | Antalya Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/antalya.md` | Planlama ve koruma | Antalya Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/aras.md` | Su varlığı | Aras Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/asi.md` | Su varlığı | Asi Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/bati-akdeniz.md` | Su varlığı | Batı Akdeniz Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/bati-akdeniz.md` | Planlama ve koruma | Batı Akdeniz Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/bati-karadeniz.md` | Su varlığı | Batı Karadeniz Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/bati-karadeniz.md` | Planlama ve koruma | Batı Karadeniz Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/burdur.md` | Su varlığı | Burdur Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/burdur.md` | Planlama ve koruma | Burdur Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/buyuk-menderes.md` | Su varlığı | Büyük Menderes Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/buyuk-menderes.md` | Planlama ve koruma | Büyük Menderes Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/ceyhan.md` | Su varlığı | Ceyhan Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/ceyhan.md` | Planlama ve koruma | Ceyhan Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/coruh.md` | Su varlığı | Çoruh Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/dogu-akdeniz.md` | Su varlığı | Doğu Akdeniz Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/dogu-akdeniz.md` | Planlama ve koruma | Doğu Akdeniz Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/dogu-karadeniz.md` | Su varlığı | Doğu Karadeniz Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/dogu-karadeniz.md` | Planlama ve koruma | Doğu Karadeniz Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/firat-dicle.md` | Su varlığı | Fırat-Dicle Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/gediz.md` | Su varlığı | Gediz Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/gediz.md` | Planlama ve koruma | Gediz Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/kizilirmak.md` | Su varlığı | Kızılırmak Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/kizilirmak.md` | Planlama ve koruma | Kızılırmak Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/konya-kapali.md` | Su varlığı | Konya Kapalı Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/konya-kapali.md` | Planlama ve koruma | Konya Kapalı Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/kucuk-menderes.md` | Su varlığı | Küçük Menderes Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/kucuk-menderes.md` | Planlama ve koruma | Küçük Menderes Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/kuzey-ege.md` | Su varlığı | Kuzey Ege Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/kuzey-ege.md` | Planlama ve koruma | Kuzey Ege Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/marmara.md` | Su varlığı | Marmara Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/marmara.md` | Planlama ve koruma | Marmara Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/meric-ergene.md` | Su varlığı | Meriç-Ergene Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/meric-ergene.md` | Planlama ve koruma | Meriç-Ergene Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/sakarya.md` | Su varlığı | Sakarya Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/sakarya.md` | Planlama ve koruma | Sakarya Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/seyhan.md` | Su varlığı | Seyhan Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/seyhan.md` | Planlama ve koruma | Seyhan Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/susurluk.md` | Su varlığı | Susurluk Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/susurluk.md` | Planlama ve koruma | Susurluk Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/van-golu.md` | Su varlığı | Van Gölü Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/van-golu.md` | Planlama ve koruma | Van Gölü Havzası nasıl planlanıyor ve korunuyor? |
| `src/content/havzalar/yesilirmak.md` | Su varlığı | Yeşilırmak Havzası'nın su varlığı ne kadar? |
| `src/content/havzalar/yesilirmak.md` | Planlama ve koruma | Yeşilırmak Havzası nasıl planlanıyor ve korunuyor? |
| `src/pages/durumum/[persona].astro` | <h2 class="blok-baslik">İlk adımlar</h2> | <h2 class="blok-baslik">İlk adımda ne yapmalısınız?</h2> |
| `src/pages/durumum/[persona].astro` | <h2 class="blok-baslik">Benzer durumlar</h2> | <h2 class="blok-baslik">Benzer durumdaki sektörler hangileri?</h2> |
| `src/pages/kuyu-ruhsati/[il].astro` | <h2>Yetkili merci ve havza</h2> | <h2>Bu ilde yetkili merci hangisi?</h2> |
| `src/pages/kuyu-ruhsati/[il].astro` | <h2>Havzada güncel su durumu</h2> | <h2>Havzada su durumu nedir?</h2> |
| `src/pages/kuyu-ruhsati/[il].astro` | <h2>Belge süreci</h2> | <h2>Belge süreci nasıl işler?</h2> |
| `src/pages/hakkinda.astro` | <h2>İçeriği kim hazırlıyor</h2> | <h2>İçeriği kim hazırlıyor?</h2> |
| `src/pages/hakkinda.astro` | <h2>Hukuki içerik nasıl hazırlanıyor</h2> | <h2>Hukuki içerik nasıl hazırlanıyor?</h2> |
| `src/pages/hakkinda.astro` | <h2>Veri kaynağı politikası</h2> | <h2>Veri kaynağı politikası nedir?</h2> |
| `src/components/IlKurumTablosu.astro` | <h2>81 il için yetkili kurumlar</h2> | <h2>81 ilde yetkili kurum hangisi?</h2> |
| `src/components/HavzaPaneli.astro` | <h2>Suyun durumu: 25 havza</h2> | <h2>25 havzada suyun durumu nedir?</h2> |
| `src/components/HavzaYasBandi.astro` | <h2 id="yas-baslik">Resmî yeraltısuyu verisi</h2> | <h2 id="yas-baslik">Resmî yeraltısuyu verisi ne diyor?</h2> |
| `src/pages/rehberler/kuyu-tasima.astro` | <h2 id="kavramsal-ayrim">Kavramsal ayrım: kuruma, çökme, kirlilik, taşınma</h2> | <h2 id="kavramsal-ayrim">Kuruma, çökme, kirlilik ve taşınma nasıl ayrılır?</h2> |
| `src/pages/rehberler/kuyu-tasima.astro` | <h2 id="karar">Hangi hâlde hangi hukuki yol</h2> | <h2 id="karar">Hangi hâlde hangi hukuki yol izlenir?</h2> |
| `src/pages/rehberler/kuyu-tasima.astro` | <h2 id="adimlar">Yeni başvuru şeması: yedi adım</h2> | <h2 id="adimlar">Yeni başvuru yedi adımda nasıl yapılır?</h2> |
| `src/pages/rehberler/kuyu-tasima.astro` | <h2 id="dikkat">DSİ başvurusunda dikkat edilecek hususlar</h2> | <h2 id="dikkat">DSİ başvurusunda nelere dikkat edilmeli?</h2> |
| `src/pages/havzalar/[slug].astro` | <h2>Bu havzada hukuki durum</h2> | <h2>Bu havzada hukuki durum nedir?</h2> |
| `src/pages/havzalar/[slug].astro` | <h2>İller ve yetkili kurumlar</h2> | <h2>Havzada hangi iller ve yetkili kurumlar var?</h2> |

**Değiştirilmeyen başlıklar ve sebebi:** `Madde metni`, `Dayanak`,
`Emsal kararlar`, `Dikkat`, `İlgili hükümler`, `Veri notu`, `Kanunlar`,
`Tüzük`, `Yönetmelikler`, `Tebliğ`, `Doğrulanamayanlar`, `Kaynaklar`,
`Olay akışı`, `İletişim` — referans/gezinme etiketi, soru karşılığı yok.
`5686 rejimi`, `İdari para cezası (167 m.18)` — **kanun numarası taşıyor,
hukuki iddia riski**, brief gereği çevrilmedi.

## FAZ 2.4 — üç yeni skill

| Skill | Madde | Somut değişiklik | Ölçülen etki |
|---|---|---|---|
| `featured-snippet-optimizer` | 6 | Adım 1 (SERP/Search Console kontrolü) ATLANDI — veri yok (B-4). Adım 2 sorgu-biçimi eşleme + Adım 5-6 (H2 sorguyu yeniden ifade eder, cevap H2'nin hemen altında) uygulandı. Tablo bölümleri "hangi X hangi Y" biçimine, süreç bölümleri "nasıl yapılır" biçimine çevrildi. | Soru başlığı 3 → 458 · 3 → 161 sayfa |
| `geo-schema` | 2, 13 | Adım 3 Organization (KRİTİK) + standalone Person; `@graph` kalıbı, `@id` çapraz referansı; `knowsAbout` (GEO sinyali); `HowTo` (Adım 4: rich result kalkmış ama AI ayrıştırması için değerli) | Organization 264→436 düğüm · Person ana sayfaya geldi · HowTo 0→2, HowToStep 0→11 |
| `eeat-audit` | 2 (madde 1 ile örtüşük) | Trustworthiness: kurum e-postası şemaya girdi. Expertise: `Person.knowsAbout` + `worksFor` (Arslan Hukuk Bürosu) 172 sayfada makine-okunur oldu. **Experience boyutu bu turda kapatılamadı** — birinci-el deneyim anlatısı içerik kararı gerektirir, `sameAs` boşluğu (madde 1) SINIF B'de. | E-E-A-T'nin 2 boyutu güçlendi, 2'si (Experience, Trust/sameAs) açık |

## SINIF B — kullanıcıdan ne gerekiyor

| Madde | Kural | Kullanıcıdan gereken |
|---|---|---|
| **1** (`sameAs`) | **B-2** | Gerçek profil adresleri. Hangi platformlar: **LinkedIn** (kişisel ve/veya büro), **X/Twitter**, **Google Business Profile**, **baro levhası sayfası**, **Wikidata** (varsa), **YouTube**. M8 gereği tek bir tanesi bile uydurulmadı; alan hiç yazılmadı. En az 2-3 gerçek URL yeterli. |
| **6 — yalnız `/rehberler/kuyu-ruhsati/`** | **B-7** | Kalıp-2 sayfasındaki "İçindekiler" menüsü başlık metnini `<h2>` DIŞINDA tekrar basıyor; başlık değişince 9 gövde kelimesi kayboluyor (`Rejimin`, `mantığı`, `Üç`, `belge`, `tek`, `zincir`, `Belge`, `yapısı`, `Başvuru`, `akışı`). Mekanik M6 kuralı gereği geri alındı. **Karar gerekli:** içindekiler başlıktan türediği için bu kayıp "gövde metni değişti" sayılmalı mı? Sayılmayacaksa aynı değişiklik tek komutla uygulanabilir. |
| **11** | — | Uygulanmadı, bağlam eşiği (M14). Tespit: `/rehberler/kuyu-ruhsati/` zaten 81 il sayfasına link veriyor (B3 karşılanmış); eksik olan **diğer 9 rehberden il linki** ve **rehber → persona linki** (0). |
| **8 — görünüm** | — | Hub öz-cevapları görünümü DEĞİŞTİRMEDİ (yalnız `class` + `role` eklendi). Görsel bir kutu isteniyorsa ayrı karar. |
| Organization `logo` | **B-2** | Şemaya `logo` yazılmadı — sitede gerçek logo dosyası yok (`favicon.svg` ikon, OG görseli kapak). Gerçek logo verilirse eklenir. |

## DENETLENEMEDİ

Önceki turun 14 maddesi aynen devredilir. Bu turun yenileri:

1. **Soru başlıklarının gerçekten snippet/AI alıntısı kazandırıp kazandırmadığı** — Search Console ve SERP verisi yok (B-4). Ölçülen tek şey biçim değişikliği.
2. **`llms.txt`'in AI istemcileri tarafından okunduğu** — sunucu logu yok; dosyanın üretildiği ve içeriğinin doğru olduğu doğrulandı, tüketildiği doğrulanmadı.
3. **robots.txt'teki 13 yeni `User-agent` bloğunun botlarca işlendiği** — canlıya çıkmadan doğrulanamaz. Bloklar erişimi genişletmiyor (genel kural zaten `Allow: /`), dolayısıyla risk yok.
4. **`HowTo` şemasının geçerliliği** — Google Rich Results Test / Schema.org Validator çalıştırılmadı (harici servis). JSON sözdizimi ve alan adları elle denetlendi.
5. **Değişen 85 başlığın Türkçe akıcılığı ve hukuki isabeti** — makine denetleyemez. **Kullanıcı incelemesi gerekli.**
6. **Havza h2'lerine havza adının girmesinin (25 sayfa × 2 başlık) görsel etkisi** — başlıklar uzadı; headless kare alınmadı, taşma ölçülmedi.
7. **Ana sayfa öz-cevabının 269 karaktere çıkmasının ilk-ekran düzenine etkisi** — ölçülmedi.
8. **`geo-citability` puanları rubrik takdiridir**, otomatik ölçüm değildir; ±3 puan oynayabilir.
9. **Canlı site** — hiçbir şey push edilmedi, canlı doğrulama yapılmadı.

---

## TUR 2 — EK: madde 11 (26 Tem 2026, sabah)

Bağlam eşiği sonrası tek kalan SINIF A maddesi tamamlandı.

| Madde | Skill | Dosyalar | Commit | Sonuç |
|---|---|---|---|---|
| 11 | `site-architecture` (spoke↔spoke, "grafiğin ortası") | `src/components/SonrakiAdim.astro`, `src/pages/rehberler/[slug].astro`, `src/pages/rehberler/kuyu-tasima.astro` | `fb27d9d` | **Uygulandı** |

### B3 ve C2 ayrı ayrı

- **B3 (rehber → il):** ZATEN KARŞILANMIŞ. `/rehberler/kuyu-ruhsati/`
  sayfasındaki 81 il tablosu 81 ayrı `/kuyu-ruhsati/<il>/` sayfasına link
  veriyor (ölçüldü: 81 tekil link). Diğer 9 rehberde il tablosu yok, dolayısıyla
  "tablodan bağlam linki" hükmü onlar için doğmuyor. Yeni kod yazılmadı.
- **C2 (rehber → persona):** UYGULANDI. Rehber gövdesinden persona
  sayfalarına link **0 → 13** (8 rehberde satır çıkıyor).

### Uydurma yasağına uygunluk

Hangi personanın hangi rehberi ilgilendirdiği ELLE YAZILMADI. Eşleşme
`data/lead/persona.json`'daki mevcut `ilgiliIcerik` alanının TERSİNE
ÇEVRİLMESİYLE türetiliyor. `data/` dizini yalnız OKUNDU, değiştirilmedi (M10).
Eşleşmesi olmayan rehberde (`/rehberler/kuyu-belgesi-iptal-davalari/`,
`/rehberler/index/`) satır hiç basılmıyor.

| Rehber | Persona linki |
|---|---|
| `/rehberler/su-tahsisi-oncelik-sirasi/` | 3 |
| `/rehberler/kuyu-ruhsati/` | 2 |
| `/rehberler/baraj-kamulastirmasi/` · `jeotermal-ruhsat` · `kaynak-hakki-komsu-su` · `kaynak-suyu-kiralama` · `ruhsatsiz-kuyu-cezalari` · `yeralti-suyu-isletme-sahasi` | 1'er |
| `/rehberler/kuyu-belgesi-iptal-davalari/` | 0 (veride eşleşme yok) |

### M6 doğrulaması

Gövde parmak izi: **eklenen 26 kelime, kaybolan 1**. Kaybolan "kelime"
`/hangi-kurum/` sayfasındaki build tarihinin **25 → 26 Temmuz** dönmesidir
(gün değişti), içerik kaybı değil. Başlık izi değişmedi.

### Tarayıcı öz-denetimi (CLAUDE.md protokolü)

`arac/dist-sun.mjs` (CSP + `_redirects` uygulanır) üzerinden
`arac/oz-denetim.mjs`, 7 sayfa:
`/rehberler/su-tahsisi-oncelik-sirasi/` · `/rehberler/kuyu-ruhsati/` ·
`/rehberler/baraj-kamulastirmasi/` · `/rehberler/kuyu-tasima/` ·
`/durumum/ana-metal-sanayii-nace-24/` · `/havzalar/sakarya/` · `/hakkinda/`

- Konsol hata/uyarı: **0** (4 yazılımsal-GL sürücü mesajı ortam gürültüsü olarak ayrıldı)
- İç link: **113 tekil, 0 kırık**
- Etkileşim: 7/7 menü aç + ESC-kapat
- Kareler: `cikti/denetim/` (7 tam sayfa PNG)
- Yeni 7 persona link hedefi tek tek dosya sisteminde doğrulandı: 7/7 var

**Ana sayfa (`/`) öz-denetime alınamadı:** menü düğmesi kaydırma-sahnesi
nedeniyle ilk ekranda görünmüyor, `page.click` 30 sn'de zaman aşımına uğradı.
Bu madde 11'den ÖNCE de böyleydi (aracın varsayılan yolları arasında `/` yok),
bu turda değişmedi — ama **DENETLENEMEDİ** olarak kayda geçer.

### Görünüm notu — kullanıcı kararı gerekebilir

Persona satırı "Sonraki adım" kutusunun ALTINA, ince ayraç çizgisiyle,
0,9rem ikincil metinle yerleşti. Üstteki üç ana çağrının hiyerarşisini
bozmaması için bilinçli olarak ikincildir. **DESIGN.md "görünürlük kuralı"
açısından sınırda:** ilk bakışta fark edilir ama baskın değil. Daha belirgin
istenirse tek satırlık değişiklik.

---

# ÖDÜL-ÜSTÜ TURU — 9 SKILL'İN UYGULAMASI (26 Tem 2026, sabah)

Brief: `cikti/brief/20260726T074053Z-odul-ustu-skill.md` (orijinal, değiştirilmedi)
→ 3 ENGEL (T5, mekanik) → `-duzeltilmis.md` → **denetçi TEMİZ**.

## Skill kapsama tablosu

| Skill | Ne önerdi | Ne uygulandı | Ölçülen etki |
|---|---|---|---|
| `marketing-council` | Schwartz: ziyaretçi problem-farkında, menü onu bulunduğu aşamada karşılamalı. Dunford: "Harita" ilk sıra siteyi veri-görselleştirme kategorisine çerçeveliyor. **Sharp (muhalif):** kategori giriş noktalarını daraltma, veri kapıları kalsın. Handley: etiketler soru biçiminde olsun. | Menü niyet-önce sıralandı; **hiçbir kapı kaldırılmadı** (Sharp kısıtı). Handley'in soru-etiket önerisi UYGULANMADI — onaylı gövde metnini silmek gerekirdi (M6). | Menü sırası değişti + 1 yeni kapı |
| `site-architecture` | Görünür breadcrumb ("her sayfada bedava iç link"), yetim sayfa yasağı, footer sütunlama | Breadcrumb 170 sayfaya; footer'a 4. sütun; `/kuyu-ruhsati/` menüye | Görünür breadcrumb **0 → 170** · `/kuyu-ruhsati/` **1 → 82** iç link · `/arac/il-rejimi/` **2 → 174** · ≤3 link alan sayfa **6 → 4** |
| `ui-ux-pro-max` | Navigation/Breadcrumbs (3+ seviye), dokunma hedefi, başlık hiyerarşisi bozulmasın, mobil taşma 0 | Breadcrumb mono/ikincil tonda, 0,45rem dikey iç boşluk (≈34 px satır), `aria-current="page"`, print'te gizli; footer 4→2 sütun kırılımı | 375/390 px taşma **0**, LH erişilebilirlik **100/100/100** (3 tur medyan) |
| `geo-crawlers` | Tier-1 5/5 + Tier-2 5/5 açıkça yazılsın; Bytespider engellensin; X-Robots-Tag/noai kontrolü | GoogleOther, Amazonbot, FacebookBot eklendi; Bytespider engellendi; CCBot bilinçli AÇIK bırakıldı (kullanıcı kararı) | `User-agent` bloğu **14 → 18** · Tier-1 5/5, Tier-2 5/5 · `X-Robots-Tag` yok, `noai` yok, llms.txt 200 `text/plain` |
| `cro` | CTA hiyerarşisi; ileri yol tek olmasın | **Düzeltme:** persona sayfasında iletişim CTA'sı ZATEN VARDI. Eksik olan operasyonel sonraki adım → yetkili kurum + il rejimi satırı eklendi | 42 persona sayfasında ileri yol **1 → 3** |
| `content-strategy` | Hub-spoke bütünlüğü: her spoke hub'a, hub her spoke'a, spoke'lar birbirine | Küme bütünlüğü ölçüldü; iki boş küme dolduruldu — il kardeşleri (aynı DSİ bölgesi), havza kardeşleri (aynı illeri kapsayan) | havza spoke↔spoke **0/25 → 25/25** · il spoke↔spoke **0/81 → 76/81** |
| `geo-citability` | Kategori 3 yapısal okunabilirlik | 4 sayfa yeniden puanlandı (aşağıda) | Kategori 3: 78→80 · 78→80 · 85→87 · 60→60 |
| `geo-schema` | (TUR 2'de uygulandı) | Organization + Person + HowTo | Bu turda yeni değişiklik yok |
| `featured-snippet-optimizer` · `eeat-audit` | (TUR 2'de uygulandı) | 85 soru başlığı · Person/knowsAbout/worksFor | Bu turda yeni değişiklik yok |

## Menü ağacı — ÖNCE → SONRA

```
ÖNCE (tam ekran menü, 8)          SONRA (9, niyet-önce)
1 Harita                          1 Durumum
2 Havzalar                        2 Hangi Kurum
3 Rehberler                       3 Rehberler
4 Su Kanunu                       4 Kuyu Ruhsatı      <- YENİ (hiçbir menüde yoktu)
5 Durumum                         5 Harita
6 Hangi Kurum                     6 Havzalar
7 Vakalar                         7 Su Kanunu
8 Hakkında                        8 Vakalar
                                  9 Hakkında
```
Hiçbir öğe kaldırılmadı, hiçbir açıklama metni (`not`) değiştirilmedi.

```
FOOTER ÖNCE (3 sütun)             FOOTER SONRA (4 sütun)
Bölümler (5)                      Bölümler (5, AYNEN)
Veri ve yöntem                    Ne yapmam gerekiyor (5) <- YENİ
Künye                             Veri ve yöntem
                                  Künye
```
Yeni sütun: Durumum · Hangi Kurum · Kuyu Ruhsatı — iller · İl rejimi aracı · Vakalar.

## Küme (hub-spoke) bütünlüğü — ÖNCE → SONRA

| Küme | spoke | hub→spoke | spoke→hub | spoke↔spoke ÖNCE | spoke↔spoke SONRA |
|---|---|---|---|---|---|
| `/rehberler/` | 10 | 10/10 | 10/10 | 10/10 | 10/10 |
| `/havzalar/` | 25 | 25/25 | 25/25 | **0/25** | **25/25** |
| `/kuyu-ruhsati/` | 81 | 81/81 | 81/81 | **0/81** | **76/81** |
| `/durumum/` | 42 | 42/42 | 42/42 | 42/42 | 42/42 |
| `/vaka/` | 1 | 1/1 | 1/1 | 0/1 | 0/1 (tek spoke) |
| `/su-kanunu/` | 2 | 2/2 | 2/2 | 0/2 | 0/2 (iki spoke, konuları ayrık) |

Kardeşi çıkmayan 5 il (`sivas`, `sanliurfa`, `antalya`, `istanbul`, `artvin`):
DSİ bölgesinde yayınlanmış tek il oldukları için blok hiç basılmıyor — hata
değil, koşullu davranış.

## geo-citability — aynı 4 sayfa

| Sayfa | TUR 2 sonu | ÖDÜL-ÜSTÜ sonu | Kategori 3 |
|---|---|---|---|
| `/rehberler/kuyu-ruhsati/` | 80 | **81** | 78 → **80** |
| `/hangi-kurum/` | 75 | **76** | 78 → **80** |
| `/durumum/ana-metal-sanayii-nace-24/` | 76 | **77** | 85 → **87** |
| `/` (ana sayfa) | 62 | **62** | 60 → **60** |

**Dürüstlük kaydı:** artışlar küçük ve rubrik takdiri payı (±3) içinde.
`geo-citability` SAYFA düzeyinde puanlar; bu turun asıl kazancı SİTE düzeyinde
(iç link grafiği, tarayıcı erişimi, küme bütünlüğü) ve bu rubrikte görünmez.
Ana sayfa kasıtlı olarak breadcrumb almadı (kök sayfa), puanı değişmedi.

## Kanıtlar

- Build hata **0**, sayfa/sitemap **175/172** (değişmedi)
- Gövde parmak izi: kaybolan kelime **1** — `/hangi-kurum/` build tarihinin
  25 → 26 Temmuz dönmesi. İçerik kaybı **yok**.
- Öz-denetim (`arac/dist-sun.mjs`, CSP + `_redirects` uygulanır), 8 sayfa:
  konsol **0**, iç link **114 tekil / 0 kırık**, etkileşim **8/8**
- Lighthouse erişilebilirlik, 3 tur medyan, 3 sayfa: **100 / 100 / 100**,
  başarısız denetim yok
- Mobil 375 px ve 390 px, 3 sayfa: yatay taşma **0 px**, breadcrumb taşmıyor

## DENETLENEMEDİ

1. **Lighthouse PERFORMANS** yeniden ölçülmedi. Yalnız erişilebilirlik koşuldu.
   SITE-DURUM'daki taban (98/87 · 94/75 · 98/93 · 99/88) CANLI siteden, bu
   ölçüm yerelden olurdu — kıyas geçerli olmaz.
2. **Ortalama sayfa ağırlığı 24,1 KB → 26,9 KB (+%11,6).** Breadcrumb + footer
   sütunu + kardeş bağları her sayfaya biniyor. Sıkıştırma sonrası etkisi
   ölçülmedi; LCP/CLS etkisi ölçülmedi.
3. **Menü sırası değişikliğinin davranışa etkisi ölçülemez** — analitik yok
   (madde 0 hâlâ açık). Sharp'ın uyarısı TRİPWIRE olarak kayıtlı: analitik
   kurulduktan sonra `/harita/` ve `/havzalar/` organik girişi düşerse sıra
   geri alınır.
4. **CCBot kararı** verilmedi (bilinçli). Engellemek uzun vadeli AI eğitim
   varlığını azaltır, açık bırakmak toplu kopyalanmayı kolaylaştırır.
5. **Ana sayfa** öz-denetime yine alınamadı (menü düğmesi kaydırma-sahnesi
   arkasında — aracın bilinen sınırı).
6. **Breadcrumb'ın son halkası h1 ile aynı metni tekrarlıyor** (standart
   davranış, JSON-LD ile birebir) — kullanıcı bunu fazlalık bulabilir.
7. **85 başlık + yeni menü/footer etiketlerinin Türkçe isabeti** makine
   denetleyemez; kullanıcı incelemesi gerekli.
8. Canlı site: **hiçbir şey push edilmedi.**

---

## EK — 26 Tem 2026, kullanıcı onayı sonrası

Kullanıcı: "tüm görsel ve ui işlerini onaylıyorum" + "CCBot engellensin" +
"Handley önerini uygula" + "push et".

### 1. Handley uygulaması — menü öğeleri artık okuyucunun sorusu

Handley'in "bir kişiye yaz / yüksek sesle söyler miydin" testi menüye
uygulandı. **Bölüm adı SİLİNMEDİ:** sorunun üstünde mono etiket olarak,
bağlantının İÇİNDE duruyor — çapa metni bölüm anahtar kelimesini koruyor
(site-architecture), menü taranabilir kalıyor (ui-ux-pro-max), gövde
parmak izinde kayıp olmuyor (M6).

| Etiket (korundu) | ÖNCE (tek satır) | SONRA (soru satırı) |
|---|---|---|
| DURUMUM | Durumum | Sektörümde yükümlülüğüm ne? |
| HANGİ KURUM | Hangi Kurum | Hangi kuruma gideceğim? |
| REHBERLER | Rehberler | Adım adım nasıl yapılır? |
| KUYU RUHSATI | Kuyu Ruhsatı | Kuyu ruhsatını nasıl alırım? |
| HARİTA | Harita | Türkiye'de su nerede? |
| HAVZALAR | Havzalar | Havzamda su ne durumda? |
| SU KANUNU | Su Kanunu | Mevzuat ne diyor? |
| VAKALAR | Vakalar | Başka şirketler ne yaptı? |
| HAKKINDA | Hakkında | Bunu kim hazırlıyor? |

**Ölçüm kaynaklı iki ayar:** soru cümlesi tek kelimeden uzun olduğu için
(a) menü ölçeği `clamp(1.7,3.4vw,2.5rem)` → `clamp(1.28,2.3vw,1.68rem)`,
(b) öğe aralığı `clamp(0.9,2.6vh,1.5rem)` → `clamp(0.5,1.1vh,0.72rem)`.
Sebep ölçüldü, tahmin edilmedi: ilk halde masaüstü menüsü 900 px ekranda
**1058 px**'e çıkıp kaydırma gerektiriyordu (öncesinde gerektirmiyordu).
Ayar sonrası **900/900 — kaydırma yok**; mobil 447/844, yatay taşma 0.

### 2. CCBot engellendi (kullanıcı kararı)

`robots.txt`'e `User-agent: CCBot / Disallow: /`. Gerekçe ve bedeli dosyada
yazılı. **Tier-1 canlı AI arama botları etkilenmedi** — GPTBot,
OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended
açıkça açık.

### 3. Onayla açılan iş: `/rehberler/kuyu-ruhsati/` soru başlıkları

TUR 2'de bu sayfa M6 gereği GERİ ALINMIŞTI: kalıp-2 "İçindekiler" menüsü
başlık metnini `<h2>` dışında yansıttığı için 9 gövde kelimesi kayboluyordu.
Kullanıcı onayıyla uygulandı.

| ÖNCE | SONRA |
|---|---|
| Rejimin mantığı | Yeraltı suyu ruhsat rejimi nasıl işler? |
| Üç belge tek zincir | Kuyu ruhsatı için hangi üç belge gerekir? |
| Belge yapısı | Kuyu belgeleri hangi yapıda düzenlenir? |
| Başvuru akışı | Kuyu ruhsatı başvurusu nasıl yapılır? |

`[slug].astro`'daki kalıp-2 bölüm kimlikleri, ham gövde eşleşmesi ve
`bolum.get/set` çağrıları yeni slug'lara güncellendi. İçindekiler menüsü
otomatik güncellendi, çapa bağlantıları çalışıyor (0 kırık link).

**Bilerek kabul edilen kayıp (kullanıcı onaylı):** `Rejimin`, `mantığı`,
`Üç`, `belge`, `tek`, `zincir`, `Belge`, `yapısı`, `Başvuru`, `akışı` —
hepsi içindekiler menüsündeki eski başlık yankısı. Gövde paragraf metni
değişmedi.

### Kanıt

- Build hata 0 · 175/172 değişmedi
- Soru biçimli h2/h3: **458 → 567**, kapsayan sayfa **161 → 162**
- Öz-denetim: konsol **0**, iç link **102 tekil / 0 kırık**, etkileşim geçti
- Lighthouse erişilebilirlik 3 sayfa × 3 tur medyan: **100 / 100 / 100**
- Menü açık ölçümü: masaüstü **900/900 kaydırma yok**, mobil 447/844,
  yatay taşma **0 px** (390 px ve 1440 px)
- **Dal `origin/donusum-2026-07-26`'ya PUSH EDİLDİ.**

### Hâlâ açık

- **`main`'e merge EDİLMEDİ** → canlı siteye çıkmadı. Cloudflare Pages
  yayını `main`'den beslendiği için merge = canlı yayın.
- Madde 14 (rehber süreç şeması) · 15 (havza küçük haritaları) ·
  20 (sektör ikonları): **YENİ GÖRSEL ÜRETİMİ** gerektiriyor. ODUL-USTU
  bunları ayrı bir kapıya bağlıyor (referans görsel onayı) — "görsel/UI
  işlerini onaylıyorum" bu kapıyı kapatmaz, referans görsel gerekir.
- `sameAs` gerçek profil adresleri · Organization `logo` dosyası.
- Lighthouse PERFORMANS yerelde ölçülmedi (canlı taban ile kıyas geçersiz).
