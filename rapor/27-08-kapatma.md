# KARAR DOSYASI KAPATMA TURU — 27.08.2026

Tek geçiş. Kullanıcı talimatı: bulunan her eksik düzeltilir; yalnız dört
istisna sınıfı (hukuki metin · ücretli adım · geri alınamaz · marka
kimliği) uygulanmaz.

Bu dosya **kesinti sigortasıdır**: her grup bittiğinde buraya yazılır ve
commit edilir.

## GRUP 1 — K7 artıkları + JSON-LD/şema (K7-A..E, K5, K6, K16, K20)

| Kalem | Yapılan | Ölçüm (taban → yeni) |
|---|---|---|
| **K7-A** | "su çıkma ihtimalinin en yüksek olduğu bölgeler" → "düz arazi ve vadi tabanı oranı en yüksek kesimler" | ifade dist'te 1 → 0 |
| **K7-B** | Eşik geçilmiyorsa yer tutucu basılmıyor; "…oranları eşiklerin altında — belirgin kesim yok." | `if (!yk.length) yk.push('vadi içi alçak kesimler')` kaldırıldı |
| **K7-C** | "sondaj lokasyon analizi" vaadi öz-cevaptan çıktı; öz-cevap sayfanın fiilen sunduğu 5 çıktıyı sayıyor (YAS kütlesi, RG sahası, DSİ bölgesi, su idaresi, morfoloji) | — |
| **K7-D** | Ana sayfa CTA: "su potansiyeli ve sondaj analizi alın" → "su potansiyeli ve yetkili kurum bilgisi alın" | — |
| **K7-E** | `jrc-yuzey-suyu.json` + `arac/jrc-isle.py` → `arsiv/jrc-yuzey-suyu/` + NOT.md. Ölçüm: src'de import 0, cron 0, izleme json 0 | ölü yüzey kapandı |
| **K5** | İkinci `hakkinda/#yazar` Person düğümü kaldırıldı; 4 şablon + hakkinda + index tek kanonik `#yazar`'a bağlandı. Ek alanlar (image, genişletilmiş knowsAbout) kanonik düğüme taşındı — bilgi kaybı yok | Person düğüm türü 2 → **1**; Article author `hakkinda/#yazar` **92 → 0**, `#yazar` referansı **0 → 92** |
| **K6** | `Observation.value` + `unitText` + `observationDate` eklendi; `observationDate` UYDURULMADI — baraj serisinin gerçek son ölçüm günü, o veri yoksa alan hiç yazılmıyor. `includedInDataCatalog` WebSite yerine yeni kanonik `DataCatalog` düğümüne (`site.ts` → `VERI_KATALOGU`) bağlandı | `value` **0/25 → 25/25**; `observationDate` **0/25 → 17/25** (8'inde baraj verisi yok) |
| **K16** | `Sayfa.astro` kırpımına bütünlük onarımı: dengesiz parantez, yarım tarih, yarım kısaltmalı atıf | kusurlu meta description **1 → 0**; llms.txt kusurlu satır **1 → 0** |
| **K20** | `BOLUM`'dan ölü `arac/` çıkarıldı, `goller/` + `nehirler/` eklendi | "Diğer sayfalar" **351 → 9** satır |

**Öz-denetim:** yeni yazılan tek metin `VERI_KATALOGU` künyesi ve
`Observation` alanları — ikisi de mevcut veri kaynağı adlarından ve
gerçek seri tarihinden türetildi; `observationDate` verisi olmayan
8 havzada yazılmadı.

## GRUP 2 — içerik, künye ve ölü kod (K4, K14, K15, K21, K22, K24, K27, K28)

| Kalem | Yapılan | Ölçüm (taban → yeni) |
|---|---|---|
| **K4** | `Sayfa.astro`'daki ölü B2B paleti (16 renk + 3 gradyan + 2 gölge + 2 radius, 1549 bayt) kaldırıldı. `var(--b2b-…)` kullanımı repo genelinde 0 idi | b2b değişkeni taşıyan dist dosyası **1 → 0** |
| **K14** | `hangi-kurum` build tarihi damgası kaldırıldı. **Hangi kayıt geçerli:** KARARLAR §27/Karar 3 — *"build saati damga DEĞİLDİR (her deploy'da oynayan tarih sahte tazelik sinyalidir)"*. Görünür tarih artık yalnız `hangi-kapi.json` künyesinden | "Sayfa derlemesi" **1 → 0** |
| **K15** | `/havzalar/` "adım adım doluyor" → 25/25 havza yayında olduğu ölçülüp metin gerçek duruma çevrildi · `/vaka/` "Yeni vakalar eklenecektir" (doğrulanamaz gelecek vaadi) kaldırıldı | ifadeler **1 → 0** |
| **K21-a** | MTA künye bloğuna il ataması yöntemi şerhi eklendi. Metin `mta-katalog.json` `not` + `toplam_kunye` + `il_atanamayan_sayisi` alanlarından **birebir** türetildi | şerh 0 → 81 il sayfasında |
| **K21-b** | `/durumum/` indeksi son-başvuru tarihini dayanaksız basıyordu. Dayanak cümlesi persona verisinden indekse taşındı; tarih artık sabit yazılmıyor, `persona.json`'dan okunuyor (tek tarih yoksa metin hiç basılmaz) | "Dayanak: …" **0 → 1** |
| **K22** | 7 hub sayfasına görünür güncellik damgası (`havzalar`, `kuyu-ruhsati`, `havza-riski`, `hangi-kurum`, `rehberler`, `su-kanunu`, `vaka`). Her tarih o sayfanın kendi veri künyesinden. Ayrıca `Sayfa.astro`'ya `WebPage` düğümü + `dateModified` prop'u eklendi; `ilce-sorgu` ve `ilimde-kim-yetkili`'deki ters vaka (görünür var, şema yok) kapatıldı | görünür damga **0/10 → 7/10**; `WebPage` düğümü **0 → 519 sayfa** |
| **K24** | `kullanilanlar.astro` "Astro 5" → **"Astro 7"** (kurulu sürüm ölçüldü: 7.2.7) | yanlış olgu **1 → 0** |
| **K27 + K28** | 5 ölü dosya `arsiv/olu-kod-2708/` altına taşındı (silinmedi): `anasayfa-sorular.js`, `anasayfa-asama2-denetim.mjs`, `ruhsat-risk.js`, `HedefSahne.astro`, `hedef-lqip.txt` | referans ölçümü 0 |

**K28 kaydında ölçümle bulunan HATA:** karar dosyası `src/data/menu.ts`
için *"repo genelinde 0 referans"* diyordu — gerçek **9 referans**
(`PaylasilanMenu.astro`, `Sayfa.astro`, `harita.astro` + 6 araç).
`scrub-engine.js` de ölü değil (**2 referans**). İkisine de dokunulmadı.

**K22 ATLANAN 3 sayfa (gerekçeli):** `/hakkinda/` (içerik sayfası, veri
künyesi yok — §27: *"Tarihi belirsiz sayfada damga BASILMAZ"*),
`/harita/` ve `/` (kendi layout'larını kullanıyorlar, `SayfaBasi`
deseni yok).

## GRUP 3 — erişilebilirlik, otorite ve GEO (K23, K19, K17, K18)

| Kalem | Yapılan | Ölçüm (taban → yeni) |
|---|---|---|
| **K23** | "İçeriğe atla" bağlantısı (WCAG 2.4.1 A) `Sayfa.astro`'ya global, `index.astro` ve `harita.astro`'ya elle eklendi. `<main>` artık `id="ana-icerik"` taşıyor. Renk/boşluk yalnız mevcut tokenlardan; odaklanınca görünür, `prefers-reduced-motion` desteği var | skip-link **0 → 520/523** sayfa (kalan 3: `404.html`, 2 noindex pilot) |
| **K19-a** | 342 göl/nehir sayfasında kaynak ADI artık resmî adresine bağlanıyor. **Adresler bu sunucudan sınandı:** `openstreetmap.org/copyright` 200, `naturalearthdata.com/…/10m-physical-vectors/` 200. Bilinmeyen kaynak adı düz metin kalır (`kaynakBagi()` null döner) | kaynak bağı **0 → 342/342** |
| **K19-b** | 42 `durumum` sayfasına yönetmeliğin yayım künyesi eklendi. **mevzuat.gov.tr / Resmî Gazete ADRESİ YAZILMADI:** iki adres de sınandı, bu sunucudan yanıt gelmedi (HTTP 000) — doğrulanamayan adres yazmak uydurma olurdu. Yerine `persona.json` → `yonetmelik.rgTarih` künyesi basıldı | künye **0 → 42/43** |
| **K17** | *Cevap önce, dayanak sonra* (CLAUDE.md): `SayfaBasi`'da künye satırı ("Güncelleme: …") başlıkla öz-cevap ARASINDAN öz-cevabın ALTINA alındı. Sayfanın ilk cümlesi artık tarih değil, alıntılanabilir cevap. Sınıf adları ve su hattının konumu değişmedi | 4 sayfa "Güncelleme:" ile açılıyordu → **0** |
| **K18** | 81 il sayfasına `FAQPage` eklendi. Cevaplar sayfadaki GÖRÜNÜR soru-H2'lerin kendi verisinden düz metne çevrildi; verisi olmayan soru şemaya girmez (Google şartı: FAQ içeriği sayfada görünür olmalı) | FAQPage'li il sayfası **0 → 81**, toplam **395 soru** |

**K17'nin ana sayfa bacağı UYGULANMADI:** H1 bir soru ("Kuyunuz için
ruhsat mı lazım, ceza mı geldi?"), ilk cümle onu cevaplamıyor — ama o
cümle `HERO_ALT` (`src/data/anasayfa-satis.js`) ve o dosya **ağaçta
kullanıcı onayı bekleyen hero değişikliğinin parçası**, dokunulmaz.
KULLANICI KALEMİ'ne yazıldı.

**K17'nin "6 hub sayfasında öz-cevap yok" bacağı zaten kapanmış:** ölçüm
(27.08) — öz-cevap bloğu olmayan indekslenen sayfa **1** (yalnız ana
sayfa, muafiyeti KARARLAR §8'de kayıtlı).

## GRUP 4 — tasarım sözlüğü, palet ve güvenlik başlığı (K30, K31, K33, K34, K35, K36)

| Kalem | Yapılan | Ölçüm (taban → yeni) |
|---|---|---|
| **K30** | `#7fd0ef` odak halkası → DESIGN.md §9 sözlüğündeki **KÖPÜK** (`--kopuk` #DBEAF4). §9: *":focus-visible … koyu dünyada köpük"*. Sözlük değeri aynı zamanda daha erişilebilir çıktı: koyu zeminde kontrast **8,84 → 12,41** | `#7fd0ef` **3 → 0** kullanım |
| **K31** | Sözlük dışı easing'in tamamı sözlük eğrilerine bağlandı. `imlec.js`'teki **taşmalı yay eğrileri** (y=1,56 / y=1,8 — *"su aniden fırlamaz"* ilkesiyle çelişiyordu) `--e-kabar`'a çevrildi. `hareket.css` istisna beyanı gerçek kapsamla eşlendi: beyan "landing hero + /deneyim/" diyordu, ölçüm ana sayfanın TAMAMININ kendi sözlüğünü taşıdığını gösterdi | sözlük dışı easing **14 → 0** |
| **K33** | DESIGN.md §2 "Landing İstisnası" tablosu bayattı. Ölçüldü: eski `:root` bugün **yalnız `harita.astro`**'da; ana sayfa kendi v0 ailesini kullanıyor. Tablo iki adaya bölündü ve **depoda hiç kullanılmayan 6 değer** (`--yukselti`, `--akis-sonuk`, `--akis-canli`, `--metin`, `--bakir`, en dip gölge — hepsi 0 kullanım ölçüldü) çıkarıldı | tablo gerçek kapsamla eş |
| **K34** | Palet dışı 7 renk ölçüldü. Palet komşusuna **pratik olarak eşit** olan 3'ü tokene bağlandı (`#12293a`→`--murekkep-900` Δ5, `#dcecf5`→`--kopuk` Δ2 ×2). Gerçekten farklı 4'ü **değeri değişmeden** türev token olarak palete kaydedildi (`--kopuk-koyu`, `--kehribar-zemin`, `--nötr-cubuk`, `--mavi-soluk`). Ayrıca **M15 koyulaştırmasının ulaşmadığı 5 konum** düzeltildi: `rgba(72,98,122,…)` → `rgba(60,82,102,…)` | palet dışı ham hex **7 → 0**; eski türev **5 → 0** |
| **K35** | Kişisel e-posta 3 araç betiğinin kibar-scraping User-Agent'ından kurumsal adrese çevrildi (4 konum). **`TELEGRAM_CHAT_ID` bulgusu ölçümle düştü:** belgelerde yalnız DEĞİŞKEN ADI geçiyor, gerçek kanal kimliği (sayı) hiçbir yerde yok — ifşa yok | kişisel adres `arac/` içinde **4 → 0** |
| **K36** | `form-action 'self'` CSP'ye eklendi (CSP3'te `default-src`'den türemez). `izleme/csp-izinli-kaynaklar.json` da güncellendi (**SÜREKLİLİK İLKESİ**). `unsafe-inline` KALDIRILMADI — Astro'nun sayfa-içi `<style>`/`<script type="module">` üretimi buna dayanıyor, nonce/hash'e geçiş build mimarisi kararı (ayrı iş) | `form-action` **yok → var**; `--test` 7/7 geçti |

