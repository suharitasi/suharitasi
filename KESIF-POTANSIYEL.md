# KESIF-POTANSIYEL.md — Faz 0 erişim ve envanter keşfi

Tarih: 2026-07-27 · Worktree: suharitasi-potansiyel (potansiyel-2026-07-27, main=ebf419a)
Brief: cikti/brief/2026-07-27T12-44-su-potansiyeli.md (denetçi: 1 ENGEL kapatıldı,
2 UYARI açık — T1 bağlamları düzeltilmiş kopyada E2/E3 ile cevaplandı)

## 0.1 Disk + il sayfası veri kaynağı

- df -h (ölçülen): `/` 75G toplam, **49G boş** (%33 dolu).
- İl sayfaları: `src/pages/kuyu-ruhsati/[il].astro` — **dist'te ölçülen 81 il
  sayfası + 1 indeks (82 giriş)**.
- Üretici: `src/data/il-profil.js` (TEK kaynak, iki tüketici: [il].astro +
  /arac/il-rejimi/). Okuduğu veriler:
  - `data/il-kurum.json` — dsiBolgeleri (26), havzaIlleri (25), suIdareleri (30 il)
  - `data/havza-veri.json` — havza künyeleri (DSİ 2024)
  - `data/canli/grace-havza.json`, `data/canli/baraj.json` — canlı seriler
- İnce içerik kuralı: sayfa ancak 5 unsurdan ≥3 doluysa üretilir (şu an 81/81
  geçiyor). **Faz 6 bloğu bu yapıya EK veri dosyalarıyla girer**
  (veri/potansiyel/*.json → il-profil.js'te yeni alanlar); mevcut şema bozulmaz.
- 6.1(c) notu: il sayfasının kendisi kuyu-ruhsatı sayfası; iç link hedefi ana
  rehber `/rehberler/kuyu-ruhsati/` + ceza içeriği olacak (öz-döngü link yok).

## 0.2 Erişim tablosu (curl -sI/-s, UA "suharitasi.com veri derleme", ×3, ≥1 sn ara)

| Kaynak | Sonuç | Kanıt |
|---|---|---|
| SYGM ana (tarimorman.gov.tr/SYGM) | İNİYOR | 200 200 200 |
| SYGM NHYP liste sayfası (SayfaId=49) | İNİYOR | 200, 131.644 B HTML, 55 PDF linki parse edildi |
| Örnek NHYP PDF (Büyük Menderes) | İNİYOR | 200 ×3, application/pdf, content-length 14.005.091 |
| resmigazete.gov.tr arama | İNİYOR (GET+JSON POST) | HEAD 405; GET 200 (198 KB); /Home/Filter JSON POST 200 |
| dsi.gov.tr | İNİYOR | 200 200 200 |
| eticaret.mta.gov.tr | İNİYOR | 200 200 200 |
| dergipark.org.tr | İNİYOR | 200 200 200 |
| TÜİK (data.tuik.gov.tr → veriportali) | İNİYOR (SPA) | 302→200; bülten HTML JS-kabuk (3,7 KB) — tablo listesi curl'la görünmüyor |
| TÜİK MEDAS (biruni.tuik.gov.tr/medas) | İNİYOR | 200 200 200 (API ucu keşfedilmedi, 404) |
| tez.yok.gov.tr | ENGELLİ (otomasyon) | Sayfa 200 ×3; SearchTez POST (çerezli) → "Hata Oluştu" + E-Devlet girişi |
| overpass-api.de | İNİYOR | 200 200 200 (api/status) |
| GLO-90 — prism-dem-open.copernicus.eu | ENGELLİ | 000/ERR ×3 (bağlantı yok) |
| GLO-90 — AWS aynası (copernicus-dem-90m.s3.amazonaws.com) | İNİYOR | 200 ×3 (resmî açık dağıtım aynası) |

- tarimorman.gov.tr robots.txt: `/SYGM/Belgeler/` yasak DEĞİL (yalnız
  /_layouts/, /_vti_bin/, /_catalogs/, /BIDB/Yonetim engelli).

## 0.3 NHYP envanteri — ölçülen N = 12 yayımlı plan (55 PDF linki)

Kaynak sayfa: https://www.tarimorman.gov.tr/SYGM/Sayfalar/Detay.aspx?SayfaId=49
(ham HTML + tam link listesi scratchpad'de; Faz 1'de veri/ham/nhyp/ manifestine dönüşür)

Yayımlı 12 havza (sitedeki 25 havza adlarıyla eşlendi):
| Havza | Ana plan PDF | YAS'a özgü ek |
|---|---|---|
| Akarçay | Akarçay NHYP.pdf | EK 10 — YAS Tedbirler Programı |
| Batı Akdeniz | Batı Akdeniz NHYP.pdf | EK 10 — YAS Tedbirler Programı |
| Burdur | BUN_NHYP Nihai Raporu.pdf | (tedbirler nihai raporu) |
| Büyük Menderes | OUT_27_2.2.9_RBMP_FINAL_BM | YAS Tedbirler Programı Özeti |
| Gediz | Gediz Havzası NHYP.pdf | Önlemler Nihai Raporu 1-4. cilt |
| Konya Kapalı | OUT_27_2.2.9_RBMP_FINAL_KO | YAS Tedbirler Programı Özeti |
| Küçük Menderes | Nehir Havza Yönetim Planı Raporu.pdf | **EK-8 KMN YAS Künyeleri** |
| Kuzey Ege | NHYP_Raporu.pdf | **YAS_Kütle Bazlı Tedbirler.pdf** |
| Meriç-Ergene | OUT_27_2.2.9_RBMP_FINAL_ME | YAS Tedbirler Programı Özeti |
| Sakarya | Sakarya Havzası NHYP.pdf | **Yeraltı Su Kütleleri Künyesi 1-3** |
| Susurluk | OUT_27_2.2.9_RBMP_FINAL_SU | YAS Tedbirler Programı Özeti |
| Yeşilırmak | Yeşilırmak NHYP.pdf | EK 10 — YAS Tedbirler Programı |

Eksik 13 havza:
- **Hazırlıkta (6 NHYP AB projesi; SÇD raporları 2024'te yayımlı, planlar liste
  sayfasında YOK):** Antalya, Batı Karadeniz, Doğu Akdeniz, Doğu Karadeniz,
  Kızılırmak, Marmara — durum etiketi: "plan yayımlanmadı (doğrulandı 2026-07-27)".
- **Yayımlı plan izi bulunamadı:** Seyhan, Ceyhan, Asi, Fırat-Dicle, Aras,
  Çoruh, Van Gölü — etiket: "veri yok (2026-07-27)".

Not (Faz 1 planlaması): kütle tabloları havzadan havzaya FARKLI belgelerde
(kimi ana planda, kimi EK-8/EK-10/künye PDF'lerinde). Faz 1 indirme listesi ana
plan + YAS eklerini birlikte kapsamalı.

## 0.4 Resmî Gazete arama otomasyonu — ÇALIŞIYOR

Uç: `POST https://www.resmigazete.gov.tr/Home/Filter` — Content-Type:
application/json; DataTables gövdesi `{draw,start,length,parameters:{searchtype:
"1",genelaranacakkelime:"..."}}`; searchtype 1=başlık, 4=içerik. JSON cevap:
recordsTotal + data[konu, url, resmiGazeteTarihiFormatted, resmiGazeteSayisi,
mukerrer]. start/length ile sayfalanır.

| Varyant | İsabet (başlık) |
|---|---|
| "yeraltısuyu işletme sahası" (bitişik) | **93** |
| "yeraltı suyu işletme sahası" (ayrı) | **16** |
| "YAS işletme sahası" | 0 |

Örnek kayıtlar 1978-1980 dönemine iniyor (eski ilanlar taranabilir). Faz 3'te
iki isabetli varyant + içerik araması (searchtype 4) birlikte kullanılır;
form-urlencoded POST 415, düz JSON (parameters'sız) 500 döner — çalışan tek
biçim yukarıdaki.

## 0.5 TÜİK belediye su istatistikleri il kırılımı — BELİRSİZ

- Bülten: "Su ve Atıksu İstatistikleri" (son: 2022 bülteni + 2024 haber
  verileri). Ulusal kırılım yayımlı (kuyu %29,8 vb.); İL kırılımlı xls'in
  varlığı bu oturumda DOĞRULANAMADI (2026-07-27): veriportali SPA, curl'la
  tablo listesi gelmiyor; MEDAS arayüzü açık (200) ama API ucu keşfedilmedi.
- Karar: Faz 4.C'de MEDAS/bülten tablosu headless tarayıcıyla denenir;
  bulunamazsa kalem "veri yok" kapanır (brief 4.C kuralı).

## 0.6 DSİ listeleri — açık resmî liste BULUNAMADI → bilgi edinme adayı

- "Kapalı ova/YAS işletme sahası" güncel konsolide listesi dsi.gov.tr'de açık
  yayımlı bulunamadı (Yeraltısuları Dairesi sayfası Detay/1628 yalnız görev
  tanımı). → **Bilgi edinme adayı** (yeraltisulari@dsi.gov.tr). RG taraması
  (0.4 çalışıyor) Faz 3'ün birincil kaynağı olur.
- YAS sulama kooperatifleri: il listesi açık bulunamadı; kısmi kaynak:
  "Türkiye'de Yeraltısuyu Sulama Faaliyetleri" (cdniys.tarimorman.gov.tr PDF,
  künye adayı). → **Bilgi edinme adayı**.

## 0.7 YÖK tez — otomasyona UYGUN DEĞİL (düz HTTP)

tarama.jsp 200 açılıyor, captcha izi 0; ama SearchTez POST (çerezli, referer'lı)
"Hata Oluştu" sayfası döndürüyor, sitede E-Devlet giriş akışı var. Düz curl
otomasyonu çalışmıyor; gerekirse headless tarayıcı denenir. Brief'in sonraki
fazları YÖK'e bağımlı değil (4.B DergiPark ile karşılanıyor — DergiPark İNİYOR).

## İNDİRME MANİFESTİ (kullanıcıya)

**BOŞ — bu aşamada kullanıcıdan indirme gerekmiyor.** Gerekçe: NHYP PDF'leri
İNİYOR; GLO-90 için resmî AWS aynası İNİYOR (prism engeli aşıldı); TÜİK
BELİRSİZ kalemi Faz 4.C'de çözülür ya da "veri yok" kapanır; YÖK tez sonraki
fazlarda kullanılmıyor; DSİ listeleri "bilgi edinme adayı" (istenirse dilekçeyi
kullanıcı atar — CLAUDE.md "avukat yetkisiyle elde edilen özel veri" HENDEK
fırsatı).

## G4 çelişki kontrolü

Brief varsayımlarıyla çelişki YOK. Tek kapsam bulgusu: NHYP 25 havzanın
12'sinde var — Faz 1-2 çıktısı doğal olarak kısmi kapsama olacak; kalan iller
Faz 6'da "resmî kütle verisi yayımlanmadı" görünümünü alır (uydurma yok).
