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

