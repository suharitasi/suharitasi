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

