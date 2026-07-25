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
