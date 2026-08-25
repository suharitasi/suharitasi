# GSC MCP + SEO/GEO TAM OPTİMİZASYON — kapanış raporu

Brief: `cikti/brief/2026-08-25T13-50-29Z-gsc-mcp.md` (düzeltilmiş:
`...-duzeltilmis.md`) · Worktree: `suharitasi-gsc-mcp` (dal `gsc-mcp`) ·
Model: Fable 5 · Sınıf: BÜYÜK İŞ (beyan brief'te) · Başlangıç:
2026-08-25T13:50Z.

## 0. Rejim kapısı

### 0a. Brief denetçisi
- Orijinal koşum: **2 ENGEL + 5 UYARI** (T5 commit+push anılmamış, T7
  hukuk kapısı anılmamış; T1×3 referans, T6×2 tetik).
- Yalnız-ekleme düzeltmesi (E1-E5) sonrası: **ENGEL 0, 3 UYARI** —
  üçü de T1 referans uyarısı ve E4'te açıklamalı (SITE-DURUM.md git
  dışı girdi · llms.txt build çıktısı · bu rapor yeni çıktı).
- Denetimler: `cikti/denetim/brief/2026-08-25T13-51-37Z.md` + `...T13-52-10Z.md`.

### 0b. Amaç özeti
- **Amaç:** GSC verisine programatik erişim (MCP, salt-okunur) kurmak;
  ilk kez ölçülebilen sorgu/pozisyon verisiyle teşhis koymak; yalnız
  bulguya dayanan SEO düzeltmeleri + tüm sayfa tiplerinde GEO denetimi;
  haftalık analiz koşumunu hazırlamak (cron'suz).
- **Dokunulmazlar:** anahtar depoya/rapora girmez (yalnız yol) ·
  uydurma yasağı · hüküm yazılmaz (hukuki/kimlik düzeltmeleri karar
  maddesi) · /havzalar/ yapısı · havza brief'inin kazanımları · yeni
  özellik yok (AY) · yıkıcı GSC işlemi yok (GSC_ALLOW_DESTRUCTIVE
  ayarlanmadı) · sağlık bekçisine kalem eklenmez (6.2).
- **Bitti-tanımı:** MCP araç listesi kanıtlı · çapraz doğrulama tuttu ·
  Faz 3 teşhis tabloları ölçümlü · Faz 4/5 değişiklikleri bulgu-dayanaklı ·
  KAPI yeşil · IndexNow doğrulanmış · bu rapor.
- **Kanıtlar:** tools/list çıktısı · 4/4 çapraz değer birebir · izole
  kapı çıktısı · önce/sonra ölçümler · uydurma denetimi tablosu.

### 0c. Düşman geçişi (D1-D4)
- **D1 — FAIL yolları:** (i) MCP deposunda kötü niyetli kod — karşı
  şart: kurulum ÖNCESİ satır satır inceleme yapıldı (§2); şüpheli bulgu
  0. (ii) Anahtar sızması — karşı şart: yapılandırma yalnız ortam
  değişkeni; commit öncesi değişen dosyalarda `private_key/client_email`
  taraması 0 isabet. (iii) MCP sayıları GSC ekranıyla tutmaz —
  karşı şart: Faz 2.2 DUR kapısı; 4/4 değer birebir TUTTU. (iv) bulgusuz
  değişiklik — karşı şart: Faz 4'teki her değişiklik bu rapora ölçülen
  bulgusuyla yazıldı. (v) havza kazanımlarının ezilmesi — karşı şart:
  25 havza sayfasına ve /havzalar/'a DOKUNULMADI (git diff kanıtı:
  değişen sayfa dosyaları yalnız [il].astro, arsiv.astro,
  kapatma-kaydi.astro).
- **D2 — boş çıkabilecek varsayımlar:** (i) "MCP araçları bu oturumda
  görünür" — Claude Code MCP kayıtlarını oturum başında yükler; kanıt
  stdio JSON-RPC el sıkışması + `tools/list` (102 araç) + `claude mcp
  list` sağlık kontrolü ✔ Connected ile verildi. (ii) "kalan 23 GEO
  bulgusu raporda listelidir" — listeli değildi; `arac/geo-audit.mjs`
  yeniden koşuldu, 23 bulgu birebir üretildi (§7.6). (iii) "Knowatoa
  ücretsiz katman (10 soru)" — 25.08 ölçümünde SAYFADA GÖRÜNMÜYOR;
  görünen "Start free trial" + 59$/199$ planlar (§7.7, çelişki şerhli).
  (iv) "Bing'e bugün kaydolundu" — kullanıcı beyanı; panel erişimi yok,
  Bing tarafı doğrulanmadı (25.08).
- **D3 — değen maddeler:** (i) Faz 4 title/desc ↔ havza brief'i:
  çakışan kalemde havza brief'i esas — 25 havza sayfası ve /havzalar/
  atlandı (0.1 listesi §1). (ii) FAQPage hizalama ↔ havza SSS'si:
  ölçüm SSS'nin sorgu aileleriyle ZATEN hizalı olduğunu gösterdi,
  dokunulmadı. (iii) 6.2 "bekçiye kalem eklenmez" ↔ CLAUDE.md
  süreklilik ilkesi: brief'in açık istisnası uygulandı (kota gerekçesi);
  süreklilik 6.1 haftalık koşumla, cron'suz, karşılandı. (iv) kopyalanma
  direnci ↔ AI botları: robots.txt mevcut istisna düzeni korundu.
- **D4 — yarıda kesilme:** fazlar ayrı commit; MCP kurulumu depo DIŞI
  (~/araclar + kullanıcı-kapsam kayıt), site yayını etkilenmez;
  kesilme anında main hep yayınlanabilirdi.

## 1. FAZ 0 — çakışma, kaynak, bütçe

**"Tekrar yapma" listesi** (rapor/havza-talep.md + geo-seo-katma-deger.md
okundu):
- 25 havza sayfası title/H1/desc/öz-cevap/sıra/SSS — DÜN YAPILDI, dokunulmadı.
- /havzalar/ indeksi — E4 dokunulmazı, dokunulmadı.
- www→apex 301 — `_redirects` yolu ÇÜRÜTÜLDÜ (Pages desteklemiyor);
  panel Redirect Rule kullanıcı adımı; yeniden denenmedi.
- Ergene ayrıştırması (künyeli RG bölümü) — yapıldı, üzerine yazılmadı.
- Açık/kapalı sınıflaması + "havza nedir" tanımı — veri yok / içerik
  kararı; yeniden açılmadı.
- Meta/öz-cevap şablon kırpımları, robots.txt matrisi, speakable/
  SearchAction/sameAs kararları — sabahki turda kapalı, yeniden açılmadı.

**Bütçe ölçümü:** GSC veri hacmi küçük çıktı (28 günde 165 sorgu-sayfa
çifti, 140 sayfa satırı) — Search Analytics çekimleri dakikalar
mertebesinde. Tek büyük kalem 519 URL'lik indeks denetimi (~2,7 sn/URL
≈ 23 dk; kota 2.000/gün sınırının içinde). İş TEK koşumda bitti; bölme
gerekmedi.

## 2. FAZ 1 — MCP kurulumu ve depo incelemesi

- Depo: github.com/mario-hernandez/google-seo-mcp-claude-code.
  **Kurulum ÖNCESİ inceleme (25.08):** MIT lisans · son sürüm v0.8.5
  (commit b0e9dee, 2026-05-04) · 11.160 satır Python · bağımlılıklar
  standart Google API istemcileri + bilinen analiz paketleri (extruct,
  pytrends, advertools, waybackpy, rapidfuzz, defusedxml).
- Güvenlik bulguları: kimlik `GOOGLE_SEO_SERVICE_ACCOUNT_FILE` ortam
  değişkeninden; kapsam varsayılan SALT-OKUNUR (`webmasters.readonly`);
  yıkıcı araçlar (sitemap gönder, Indexing API) `GSC_ALLOW_DESTRUCTIVE=true`
  bayrağı arkasında — bayrak AYARLANMADI; dosya yazımı yalnız OAuth
  token önbelleği (bizim yolda kullanılmıyor); `subprocess/eval/exec`
  gerçek kullanımı 0; Google dışı dış uç nokta 0; SSRF koruması +
  güvenilmeyen-içerik sarmalayıcı + her yanıtta `_meta` kaynak damgası
  var. ŞÜPHELİ BULGU 0 → kurulum onaylandı.
- **Kurulum (sürüm sabitli):** kaynak `/home/suha/araclar/google-seo-mcp/kaynak`
  (git, v0.8.5 = b0e9dee sabit) · venv `/home/suha/araclar/google-seo-mcp/venv` ·
  paket 0.8.5. Uyum düzeltmesi: `mcp` bağımlılığı 2.1.0 kuruldu ve
  `mcp.server.fastmcp` 2.x'te yok — `mcp<2` (1.29.1) sabitlendi, import
  ölçümle doğrulandı.
- **Claude Code kaydı (kullanıcı kapsamı, depoya dosya girmedi):**
  `claude mcp add google-seo --scope user --env
  GOOGLE_SEO_SERVICE_ACCOUNT_FILE=/home/suha/gsc-anahtar.json --
  /home/suha/araclar/google-seo-mcp/venv/bin/google-seo-mcp`
  → `claude mcp list`: **✔ Connected**.
- **Araç listesi kanıtı:** stdio JSON-RPC `tools/list` → **102 araç**
  (gsc_search_analytics, gsc_quick_wins, gsc_cannibalization,
  gsc_content_decay, gsc_ctr_opportunities, gsc_inspect_url, ...).
- Not: GA4 araçları çalışmaz (sitede GA4 yok — analitik Cloudflare Web
  Analytics; `get_capabilities` ga4 hatasını dürüstçe raporluyor). Engel
  değil; GSC yetkisi `ok: true`.

## 3. FAZ 2 — doğrulama

- **2.1 Mülk:** `gsc_list_sites` → tek mülk `sc-domain:suharitasi.com`,
  yetki `siteFullUser` ("Tam" ✓).
- **2.2 ÇAPRAZ DOĞRULAMA — TUTTU.** 25.08 GSC ekran değerleri,
  27.07–23.08 aralığında DÖRDÜ DE birebir üretildi:

  | Referans | Ekran | MCP (27.07-23.08) |
  |---|---|---|
  | /havzalar/ | 37 / 761 | **37 / 761** (poz 7,9) |
  | /havzalar/meric-ergene/ | 2 / 2.701 | **2 / 2.701** (poz 10,4) |
  | /nerede-su-cikar/ | 8 / 110 | **8 / 110** (poz 6,9) |
  | "ergene havzası nerede" | 0 / 2.255 | **0 / 2.255** (poz 10,5) |

  (GSC "son 28 gün" ekranı veri gecikmesiyle 27.07–23.08'e denk geliyor;
  28.07–24.08 aralığı aynı sayıların bir tık üstünü veriyor — tarih
  kayması, tutarsızlık değil.) Alet güvenilir sayıldı.
- **2.3 İndeks denetimi:** `gsc_inspect_url` /havzalar/meric-ergene/ →
  PASS · "Submitted and indexed" · son tarama 22.08 · canonical apex ·
  MOBILE olarak tarandı · rich result: Breadcrumbs.
- **2.4 Kota (resmî limit belgesi, 25.08 okundu):** Search Analytics
  1.200 sorgu/dk (site başına) · URL Inspection 2.000/gün + 600/dk
  (site başına). Bu işin tüketimi: ~25 Search Analytics sorgusu +
  520 URL denetimi (günlük sınırın %26'sı). MCP sunucusu sayısal kota
  raporlamıyor; tüketim izleme Google Cloud Console kota sekmesinde.

## 4. FAZ 3 — teşhis (28g = 28.07–24.08; tüm sayılar MCP ölçümü)

**ÖNEMLİ ŞERH:** GSC verisi 24.08'e kadardır; dünkü havza düzeltmeleri
13:19Z'de (25.08) yayına girdi — teşhis, havza işinin ÖNCESİNİ ölçer.
Bu yüzden havza sayfalarına dair bulguların çoğunun cevabı "dün
uygulandı"dır; tekrar uygulanmadı.

- **Site özeti (28g):** 104 tık / 5.493 gösterim / ort. poz 9,2 —
  önceki 28 güne göre gösterim 46→5.493. Günlük seri: sitenin anlamlı
  gösterimi ~28.07'de başlıyor (3 ay çekimi 28g ile aynı sayıları verdi).
- **3.1/3.2 Sorgu-sayfa-pozisyon (gösterim ≥20):**

  | Göst | Tık | Poz | Sorgu → sayfa | Sınıf |
  |---|---|---|---|---|
  | 2.267 | 0 | 10,5 | ergene havzası nerede → meric-ergene | 2. sayfa sınırı — DÜN müdahale edildi |
  | 110 | 0 | 7,7 | ergene havzası harita → /havzalar/ | ilk sayfa, tıklamasız + YAMYAMLIK |
  | 93 | 0 | 10,9 | kızılırmak havzası illeri → kizilirmak | DÜN müdahale edildi (title "İller") |
  | 90 | 0 | 7,9 | ergene havzası harita → meric-ergene | YAMYAMLIK eşi |
  | 83 | 0 | 10,3 | ergene havzası nerde → meric-ergene | DÜN müdahale edildi |
  | 62 | 0 | 8,2 | ergene havzası nerede harita → /havzalar/ | YAMYAMLIK |
  | 54 | 0 | 8,6 | havzalar → /havzalar/ | indeksin kendi ailesi |
  | 44 | 10 | 5,1 | dsi su havzaları haritası → /havzalar/ | ÇALIŞIYOR (CTR %22,7) |
  | 41 | 0 | 10,7 | asi havzası nerede → asi | DÜN müdahale edildi |
  | 23 | 0 | 8,3 | malatya kuyu → /kuyu-ruhsati/malatya/ | ilk sayfa, tıklamasız → **BU İŞTE uygulandı** (§5.1) |
  | 22 | 0 | 28,9 | su kanunu → /su-kanunu/ | içerik/otorite sınıfı — title işi değil |

  Sınıflama: ilk sayfada 0 tıklama (≥20 göst) 8 çift; 11-20 arası 4 çift;
  20+ tek sorgu ("su kanunu").
- **3.3 Yamyamlık (gsc_cannibalization):** 2 sorguda — "ergene havzası
  harita" (/havzalar/ 90 göst poz 7,9 ↔ meric-ergene 88 göst poz 8,0)
  ve "ergene havzası nerede harita" (59↔10). Karar §5.2.
- **3.4 Kolay kazançlar (gsc_quick_wins):** "ergene havzası nerede"
  (2.167 göst, poz 10,5; 3. sıraya çıkarsa tahmini +238 tık/28g) ve
  "ergene havzası harita" (178 göst, poz 8,0). İkisi de dünkü havza
  işinin hedefi — bu işte İZLENİR, tekrar uygulanmaz.
- **3.5 İçerik çürümesi + düşüş:** gsc_content_decay 0 · gsc_traffic_drops
  0 — site 28 günlük; kaybedecek tarih yok. Negatif sonuç kayıtlı.
- **CTR boşluğu:** /havzalar/kizilirmak/ poz 9,1'de CTR %1,3 (beklenen
  %2) — dünkü title değişikliğinin tam hedefi; beklemede.
- **www bulgusu:** "gediz havzası nerede/harita" ailesi (20 göst)
  https://www.suharitasi.com/havzalar/gediz/ satırına düşüyor — E3
  sinyal bölünmesinin GSC'deki görünür kanıtı; çözüm panel Redirect
  Rule (kullanıcı adımı, SIRADAKILER'de).
- **3.6 İndeks durumu (519 URL, URL denetim API'siyle tek tek — sitenin
  İLK tam indeks haritası):**

  | Durum | Adet | Dağılım |
  |---|---|---|
  | Submitted and indexed | **170** | il 80/81 · havza 25/25 · durumum 42/42 · hub/araç 14 · rehber 6/10 · su-kanunu 2/3 · vaka 1 |
  | Discovered — currently not indexed | **175** | göl 126 · nehir 46 · /harita/ · 1 rehber · taslak-takibi |
  | URL is unknown to Google | **172** | göl 121 · nehir 49 · 2 rehber |
  | Crawled — currently not indexed | **2** | /rehberler/kuyu-ruhsati/ (son tarama 18.07 — tüm SEO düzeltmelerinden ÖNCE) · /kuyu-ruhsati/burdur/ |

  Okuma: **ticari/hukuki omurga tamamen indekste** (81 il + 25 havza +
  42 NACE + hublar); indekslenmeyen kütle NEREDEYSE TAMAMEN göl/nehir
  uzun kuyruğu (342 sayfanın 340'ı). GSC'nin "168 keşfedildi" sayısının
  bugünkü karşılığı 175 + görünmeyen 172 "bilinmiyor". Sebep sınıfı:
  teknik engel DEĞİL (robots/noindex/canonical temiz, sitemap'te
  hepsi var) — yeni alan adı + dış bağlantı 0 = tarama bütçesi darlığı;
  Google sitemap'i biliyor ama kuyruk sayfalarını taramaya değer
  bulmuyor. İstisna bulgular: /rehberler/kuyu-tasima/ ve
  /rehberler/ruhsatsiz-kuyu-cezalari/ "bilinmiyor" (aşağıda §5.5) ·
  /rehberler/kuyu-belgesi-iptal-davalari/ 25.08 sabahı YENİDEN taranmış
  (canlı tarama sürüyor).

## 5. FAZ 4 — SEO uygulaması (yalnız bulguya)

### 5.1 İl sayfası title'ı (commit 28a264c)
- **Bulgu:** "malatya kuyu" 23 göst / poz 8,3 / 0 tık; mevcut title
  "Kuyu ruhsatı — Malatya — Su Haritası" sorgu diliyle ters sırada.
- **Uygulama:** 81 il sayfasında yalnız `<title>` (tarayiciBaslik,
  havza deseninin aynısı): "[İl] Kuyu Ruhsatı — Yetkili Merci ve
  Başvuru". H1, og:title, açıklama, düzen DEĞİŞMEDİ. Kelimeler sayfanın
  kendi bölüm başlıklarından ("yetkili merci", "başvuru").
- **Ölçüm:** 81/81 yeni biçim, en uzun 54 kr, 60 üstü 0; seo-audit
  bulgu 26 = taban 26 (yeni bulgu 0).

### 5.2 Yamyamlık — karar: MÜDAHALE YOK, izleme
- Asıl hedef sayfa BELİRLENDİ: /havzalar/meric-ergene/ ("harita"
  ailesi dahil — dünkü title zaten "... İller ve Haritası").
- /havzalar/ tarafında ayrıştırma YAPILMADI, gerekçe: (i) /havzalar/
  title'ı zaten Ergene hedeflemiyor ("Havzalar — Su Haritası");
  yarışma sayfa içeriğinden (25 havza adı) geliyor. (ii) KAPI kuralı:
  sitenin en iyi sayfası, kötüleşme merge engeli; site-geneli "haritası"
  sorgularında (dsi/türkiye su havzaları haritası) tıklama kazanan
  sayfa bu. (iii) Dünkü meric-ergene değişikliği Google'a yeni sinyal
  verdi; birleşme 1-4 haftada ölçülmeden ikinci müdahale kör atıştır.
- Sayfa birleştirme/silme YOK (brief 4.2 gereği zaten yasak).
- İzleme kancası: haftalık koşum (§8) iki sayfanın "ergene ... harita"
  pozisyonlarını zaten tablolar.

### 5.3 Kolay kazançlar (4.3) — dünkü işin kapsamında
"ergene havzası nerede/harita" öz-cevap + soru başlıkları dün kuruldu;
bu işte tekrar YAPILMADI (0.1 listesi). "su kanunu" (poz 28,9)
içerik/otorite sınıfı: title/öz-cevap işi değil; dış bağlantı kısıtına
bağlı, karar listesinde.

### 5.4 FAQPage hizalama (4.4) — ölçüldü, değişiklik gereksiz
meric-ergene SSS'si: "nerede?" · "hangi illeri kapsar?" · "YAS
potansiyeli nedir?" — ölçülen üç sorgu ailesiyle ("nerede" 2.350,
"iller" 93, "harita" H1+başlıkta) hizalı. Diğer tiplerde FAQ-sorgu
uyuşmazlığı gösterecek sorgu hacmi yok (il/durumum kuyruğu ≤23 göst).

### 5.5 Taranmayan sayfalar (4.5) — commit 265a45c
- **Öz-cevap koşulu:** taranmayan sayfaların tamamında öz-cevap ZATEN
  var (B4 ölçümü: içerik sayfalarında öz-cevapsız 0) — ekleme gerekmedi.
- **İç bağ ölçümü:** /rehberler/ruhsatsiz-kuyu-cezalari/ 91 gelen bağla
  "bilinmiyor" → iç bağ sorunu DEĞİL, bütçe sorunu; dokunulmadı.
  /rehberler/kuyu-tasima/ **5** gelen bağ (site ort. 19,3) + bilinmiyor
  → BULGU: `ilgili:` listeleriyle çift yönlü bağ (kuyu-belgesi-iptal-
  davalari [indeksli, 25.08 taranmış] + yeralti-suyu-isletme-sahasi
  [indeksli]); 5→**7**. /su-kanunu/taslak-takibi/ **1** gelen bağ +
  keşfedildi-eklenmedi → kardeş-sayfa satır-içi bağı (mevzuat-
  kutuphanesi [indeksli] ↔ taslak-takibi, başlık koleksiyon verisinden);
  1→**2**. Hukuki gövde metnine dokunulmadı (bağlar frontmatter listesi
  + gezinme cümlesi).
- **Göl/nehir kütlesi (340 sayfa):** iç bağ deseni tam (çift yönlülük
  247/247 · 95/95, sabah ölçümü); zayıf-bağ bulgusu yok → kod değişikliği
  YAPILMADI. Kalıcı çözüm adayları içerik/AY kararı: §12.
- **"İçerik kararı gerekli" listesi:** göl/nehir kuyruğunun
  indekslenmesi içerik derinliği + dış bağlantı meselesi (kategori hub
  önerisi C5 №6 bu ölçümle GÜÇLENDİ ama AY gereği kuyrukta).

### 5.6 IndexNow (4.6)
{{INDEXNOW_SONUC}}

## 6. Uydurma denetimi — eklenen her ifadenin veri karşılığı

| Eklenen ifade | Kaynak |
|---|---|
| "[İl] Kuyu Ruhsatı — Yetkili Merci ve Başvuru" (title) | sorgu dili GSC ölçümü ("malatya kuyu"); "yetkili merci"/"başvuru" sayfanın MEVCUT H2'leri ve öz-cevabı |
| Dataset name/description alanları (/arsiv/) | ARSIV_SETLERI kayıtlı alanları (ad · sayim · kaynak · erisim · kapsam) — yeni metin üretilmedi, alan birleştirme |
| Dataset (/kapatma-kaydi/) | KAPATMA_OZET (sayı/yıllar) + KAPATMA_SERHI (şerh metni AYNEN — il eşlemesi yapılmadığı şemada da görünür) |
| temporalCoverage değerleri | kapsam alanı yalnız yıl-aralığı biçimindeyse basılır; değilse YAZILMAZ |
| lisans alanı | kaynak lisansları bilinmiyor → Dataset'e license YAZILMADI |

## 7. FAZ 5 — GEO

### 7.1 Alıntılanabilirlik (geo-citability ölçütleri; 17 temsilci, 14 tip)
Matris ölçümü (dist, taze build): öz-cevap İLK içerik bloğu ve ilk
H2'den önce **16/17** (istisna: ana sayfa — kayıtlı muafiyet KARARLAR
§8); tanım-kalıbı girişi 16/16; görünür güncellik damgası sitede
**509 sayfa**, damgasızlar tarihçesi olmayan 14 hub/araç sayfası
(dürüst tasarım, kalanlar-paketi kaydıyla aynı); belirsizlik dili
gövdede görünür (hangi-kurum 17, nerede-su-cikar 6 "doğrulanmadı/veri
yok" ifadesi — dipnota itilmiş örnek 0). İddia-kanıt mesafesi: örnek
/havzalar/ kartlarında her sayı AYNI cümlede "(DSİ 2024)" künyeli;
havza-riski/su-kanunu'nda çıplak sayısal iddia 0. **Mekanik eksik
bulunamadı; düzeltme listesi BOŞ.**

### 7.2 E-E-A-T (eeat-audit, YMYL çıtası)
Yeni ölçüm: görünür damga ↔ şema tutarlılığı — **507 sayfada görünür
tarih = dateModified, sapma 0.** Mevcut güçlüler: yazar kutusu +
Person/Organization @graph (jobTitle/worksFor/knowsAbout/logo) +
içtihat/kaynakça + künye disiplini. Eksikler sabahki B7 listesinin
kalanı, HEPSİ karar maddesi (uygulanmadı — hukuki/kimlik kapısı):
sameAs profilleri (LinkedIn/GBP/Wikidata) · birinci-elden deneyim
anlatısı [SERDAR-HUKUK] · dış doğrulama bağı (baro kaydı vb.).

### 7.3 Yapılandırılmış veri (geo-schema)
- JSON-LD geçerlilik: **521 blok / geçersiz 0** (site geneli).
- FAQPage-sorgu hizası: §5.4 — hizalı, dokunulmadı.
- **Dataset EKLENDİ (commit bcab06b):** /arsiv/ → DataCatalog + 8
  Dataset (temporalCoverage yalnız 3 sette — diğerlerinin kapsam alanı
  aralık değil); /kapatma-kaydi/ → Dataset (1963/2017, şerh şemada).
  Havza verisi setleri (GRACE, baraj, YAS) katalogda TEMSİL EDİLİYOR;
  25 havza sayfasına ayrı Dataset BASILMADI (sayfalar veri seti değil,
  aşırı işaretleme riski).
- Kapalı kararlar yeniden açılmadı: speakable (çift düğüm kirliliği) ·
  SearchAction (arama kutusu yok) · sameAs (profil yok, kullanıcı).

### 7.4 AI erişimi (geo-crawlers, canlı ölçüm 25.08)
robots.txt: Tier-1 5/5 açık (GPTBot, OAI-SearchBot, ChatGPT-User,
ClaudeBot+Claude-User+Claude-SearchBot, PerplexityBot+Perplexity-User) ·
Tier-2 açık (Google-Extended, Applebot-Extended, GoogleOther, Amazonbot,
FacebookBot) · Bytespider + CCBot gerekçeli kapalı (kayıtlı kullanıcı
kararı 26.07). Matris skill önerisiyle birebir — değişiklik 0.
llms.txt canlı: **519/519 sayfa** (sitemap kümesiyle fark 0; ana sayfa
Kaynak satırında). X-Robots-Tag/noai başlığı yok, meta robots engeli yok.

### 7.5 Öne çıkan sonuç (featured-snippet-optimizer)
Skill'in kendi ön koşulu poz 1-5. Ölçülen tek 1-5 sorgusu: "dsi su
havzaları haritası" → /havzalar/ poz 5,1 — ZATEN sitenin en yüksek
CTR'ı (%22,7, 10 tık). Karar: MÜDAHALE YOK — (i) sayfa KAPI
dokunulmazı; (ii) "haritası" sorgusunda metin snippet'i değil
görsel/harita yüzeyi belirleyici; (iii) SERP'te snippet var mı bu
ortamdan doğrulanamadı (25.08). Poz 5-10 bandındaki soru sorguları
için snippet-uyumlu yapı (soru-H2 + kısa cevap) dünkü havza işiyle
zaten kurulu; sıralama 1-5'e gelince yeniden değerlendirilecek.

### 7.6 Kalan 23 GEO bulgusu (arac/geo-audit.mjs yeniden koşumu — birebir 23)
| Küme | Adet | Akıbet |
|---|---|---|
| /404/, /harita-pilot/, /stil-pilot/ kalemleri | 6 | noindex/yardımcı sayfa — muaf (kayıtlı davranış) |
| Ana sayfa öz-cevap | 1 | KARARLAR §8 muafiyeti (kullanıcı kararı 28.07) |
| öz-cevap-uzun (10 rehber + vaka/meysu) | 11 | elle yazılmış İÇERİK özeti = hukuki metin dokunulmazı → [SERDAR-HUKUK] (C5 №9 ile aynı kalem) |
| soru-baslik-yok (/kuyu-ruhsati/, /rehberler/, /vaka/, /vaka/meysu/) | 4 | hub/vaka sayfasına soru başlığı = yeni içerik cümlesi → içerik kararı (md16 tabanında kayıtlı) |
| stil-pilot öz-cevap-uzun | 1 | noindex pilot — muaf |
**Uygulanabilir mekanik kalem: 0** — sabahki turun sonucu bugünkü
yeniden ölçümle doğrulandı.

### 7.7 AI görünürlük ölçümü (5.7 — yeniden tarama YAPILMADI)
Kaynak: rapor/site-durum-kazi.md C2 (24.08). **Çelişki şerhi (25.08):**
kazıda "Knowatoa 0$ katman (10 soru)" yazılıydı; bugün knowatoa.com'da
görünen akış "Start free trial" (`/onboarding/trial/signup`, "No credit
card · 60 seconds") + Starter 59$/ay (ChatGPT, AI Overviews, AI Mode) ·
Growth 199$/ay (+Claude, Gemini, Meta AI, Perplexity). Kalıcı ücretsiz
katmanın varlığı **doğrulanamadı (25.08)** — deneme süresi/soru sınırı
sayfada yazmıyor.

**Kullanıcı adım listesi (HESAP AÇILMADI, ücretli adım ATILMADI):**
1. knowatoa.com → sağ üst **"Start free trial"** → kayıt (kredi kartı
   istemez; ~60 sn vaadi).
2. Site olarak `suharitasi.com` tanıt; izlenecek soruları Türkçe ve
   ölçülen sorgu ailelerinden seç — önerilen ilk küme: "ergene havzası
   nerede" · "türkiye su havzaları haritası" · "kuyu ruhsatı nasıl
   alınır" · "ruhsatsız kuyu cezası" · "su kanunu taslağı ne durumda".
3. Deneme bitiminde ÜCRETLİ plana GEÇME kararı size aittir — Starter
   59$/ay Claude/Gemini/Perplexity'yi KAPSAMIYOR (Growth 199$/ay
   kapsıyor); Türkçe sorgu desteği testte görülmeden ödeme önerilmez.
4. Alternatif (kazıdaki sıra): test olumsuzsa Otterly.ai Lite 29$/ay
   (fiyat 24.08'de resmî sayfadan doğrulandı) — o da önce panelde
   Türkçe sorgu desteği teyidiyle.

### 7.8 Bing/IndexNow doğrulaması (5.8)
Gönderim tarafı ÖLÇÜLDÜ: log/indexnow.log 25.08 13:26Z — 25 URL
HTTP 200; cron 6×/gün aktif (crontab satırı canlı). Bing tarafında
işlenme: **doğrulanmadı (25.08)** — panel erişimi bu ortamda yok;
kullanıcı adımı: bing.com/webmasters → IndexNow bölümünde "gönderilen
URL" sayacını kontrol et (SIRADAKILER'deki mevcut kalem).

## 8. FAZ 6 — süreklilik
- **Haftalık koşum HAZIR (commit 51199e7, cron'a BAĞLI DEĞİL):**
  `arac/gsc-haftalik.py` — son 7 gün ↔ önceki 7 gün (2 gün veri
  gecikmesi payıyla), sorgu+sayfa tabloları, rapor/gsc-haftalik/<tarih>.md.
  İlk test koşumu kanıtı: rapor/gsc-haftalik/2026-08-22.md (tık 35→41,
  Ergene poz 11,1→10,1). Koşum başına 4 Search Analytics sorgusu.
  **Kurulum satırı (karar kullanıcının):**
  `25 6 * * 1 GOOGLE_SEO_SERVICE_ACCOUNT_FILE=/home/suha/gsc-anahtar.json /home/suha/araclar/google-seo-mcp/venv/bin/python3 /home/suha/projeler/suharitasi/arac/gsc-haftalik.py >> /home/suha/projeler/suharitasi/log/gsc-haftalik.log 2>&1`
- **6.2:** Sağlık bekçisine kalem EKLENMEDİ (brief kuralı; dış servis,
  kota).

## 9. KAPI
{{KAPI_SONUC}}

## 10. BEKLENTİ ŞERHİ
Bu iş bir hipotez testidir, garanti değildir. Sıralama/tıklama etkisi
1-4 haftada GSC'den ölçülür (net gözlem noktaları: Ergene ailesi
~2.350 göst/28g · "malatya kuyu" 23 göst · kizilirmak CTR boşluğu).
Dış bağlantı yokluğu bağlayıcı kısıt olarak DEVAM EDİYOR — "su kanunu"
poz 28,9 ve tarama bütçesi darlığı title işiyle çözülmez (C5 №2-3
kullanıcı kalemleri). Haftalık koşum kurulursa etki ölçümü otomatik
tablolaşır.

## 11. Geri alma
- MCP kaydı: `claude mcp remove google-seo --scope user`
- Kurulum: `rm -rf /home/suha/araclar/google-seo-mcp`
- Kod değişiklikleri: `git revert <commit>` (28a264c title · bcab06b
  Dataset · 51199e7 haftalık script) — her biri bağımsız geri alınır.
- Anahtar dosyasına bu iş DOKUNMADI (okuma amaçlı kullanım, izin 600).

## 12. Kullanıcı kararı bekleyenler
1. Haftalık koşum cron'a bağlansın mı (§8 satırı; kota maliyeti:
   4 sorgu/hafta — ihmal edilebilir; kredi maliyeti yok, script MCP'siz).
2. Knowatoa denemesi açılsın mı (§7.7 adım listesi; ücretsiz katman
   doğrulanamadı şerhiyle).
3. www→apex Redirect Rule (panel, ~2 dk) — GSC'de www satırları bu
   işte de ölçüldü (Gediz ailesi 20 göst www'de).
4. GSC panel işleri (önceki listeden değişmedi): sitemap yeniden
   gönder + ~20 öncelikli sayfaya tekil dizin isteği (C5 №1) — MCP'nin
   yıkıcı-kapalı kurulumu bunları BİLEREK yapamıyor.
5. [SERDAR-HUKUK] içerik kalemleri: 11 uzun öz-cevap + 11 içerik
   title'ı + rehber H2/hub soru başlıkları + E-E-A-T deneyim anlatısı.
6. "su kanunu" görünürlüğü için dış bağlantı/temas kalemleri (C5 №2).
7. Göl/nehir uzun kuyruğu (342 sayfanın 340'ı indeks dışı — ilk kez
   ölçüldü): kategori hub'ları (C5 №6) bu veriyle güçlendi ama AY
   İLKESİ gereği kuyrukta; öne alınıp alınmayacağı kullanıcı kararı.
   Şerh: dış bağlantı gelmeden hub da taranmayabilir; sıra önerisi
   yine C5 №1-2 (GSC panel + temas).
8. /rehberler/kuyu-ruhsati/ "tarandı — eklenmedi" (son tarama 18.07,
   tüm iyileştirmelerden önce): yeniden tarama isteği GSC panelinden
   verilebilir (~1 dk, №4 ile birlikte).
