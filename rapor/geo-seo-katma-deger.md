# TEMİZLİK + SEO/GEO TAM DENETİMİ + KATMA DEĞER — rapor

Brief: `cikti/brief/2026-08-25T03-29-43Z-geo-seo-katma-deger.md`
(düzeltilmiş: `...-duzeltilmis.md`) · Dal: `geo-seo` (worktree
`suharitasi-geo`) · Başlangıç: 2026-08-25T03:30Z · Model: Fable 5 ·
Sınıf: BÜYÜK İŞ (beyan brief'te).

## 0. Denetim + düşman geçişi + amaç özeti (rejim kapısı)

### 0a. Brief denetçisi
- Orijinal koşum: **2 ENGEL + 3 UYARI** (T5 commit+push anılmamış,
  T7 hukuk kapısı anılmamış; T1×2 referans, T6 canlı-koşul).
- Yalnız-ekleme düzeltmesi (E1-E4) sonrası: **ENGEL 0, 2 UYARI.**
  Kalan uyarılar T1 referans uyarısıdır ve E4'te açıklanmıştır:
  `llms.txt` build ÇIKTISIDIR (dist/ + yayında mevcut, repo kökünde
  aranması beklenmez); `rapor/geo-seo-katma-deger.md` bu işin YENİ
  çıktısıdır. Denetim raporları: `cikti/denetim/brief/2026-08-25T03-30-38Z.md`
  ve `...T03-30-58Z.md`.

### 0b. Amaç özeti
- **Amaç:** (A) ölü kurum kaynaklarının onarımı + /su-hukuku/
  kaldırma; (B) 500+ sayfalık sitenin SEO/GEO hazırlığını tarama
  başlamadan tamamlamak (meta, şema, öz-cevap, iç ağ, AI yüzeyi);
  (C) kullanılmayan değerin karar listesi. GSC gerçeği: 168 sayfa
  "keşfedildi — dizine eklenmedi" — B tek başına sıralama getirmez,
  tarama başladığında etkili olacak hazırlıktır.
- **Dokunulmazlar:** hukuki metinler (E2 — hüküm yazılmaz, B7
  düzeltmeleri uygulanmaz) · veri kaydında karşılığı olmayan ifade
  (B4 sert sınır) · renk/font/desen icadı · sayfa ağırlığı artışı ·
  AY İLKESİ (yeni özellik yok) · e-posta gönderimi (C3 yalnız öneri) ·
  A5'te hukuki vaat taşıyan sayfaya 301 yasak.
- **Bitti-tanımı:** A6 kanıt paketi tam · B fazları kapılardan geçti
  + merge + deploy teyidi + canlı `--tam` koşusu · C sıralı listesi
  KARAR YAZMADAN raporda · bu rapor tam.
- **Kanıtlar:** önce/sonra link tablosu · md17/md13/md14/md21
  ölçümleri · sitemap diff ("diğer fark: 0") · canlı 301 ölçümü ·
  sağlık `--tam` çıktısı · öz-cevap sayı bekçisi bağları.

### 0c. Düşman geçişi (D1-D4)
- **D1 — FAIL yolu:** En kritik risk: site-geneli otomatik meta/link
  düzeltmesinin tabanları geriletmesi (md13 kontrast, md14 G1-G6,
  S1, ağırlık) — karşı şart: her faz sonunda kapı listesi koşar, faz
  bağımsız merge edilir, gerileme = faz geri alınır. İkincil FAIL:
  A2'de 200 dönen ama başka yayına giden "yeni adres" (kayıtlı vaka:
  trdizin /318433) — karşı şart: içerik kontrolü zorunlu, başlık/metin
  eşleşmesi kanıt. Üçüncül: B4'te veriden türetme kisvesi altında
  hukuki/hidrolojik ifade sızması — karşı şart: yalnız veri kaydı
  alanları; yazılamayan sayfa öz-cevapsız kalır ve sayılır.
- **D2 — boş çıkabilecek varsayımlar:** (i) "su-kanunu-taslak-pdf"
  izleyici hedefi olarak repoda var mı — koşumda doğrulanacak;
  (ii) GSC sayıları (168+1) kullanıcı beyanı [VERİ-kullanıcı], bu
  ortamdan GSC'ye erişim yok, yeniden ölçülemez — rapora şerhle;
  (iii) **`seo-audit` skill'i KURULU DEĞİL** (ne proje
  `.agents/skills/` ne oturum envanteri; `skills-lock.json`da yok) —
  föydeki 8 skill'den 7'si koşulabilir, seo-audit satırı raporda
  "kurulu değil" olarak kalır, işlevi md16/md7 bekçi ölçütleri +
  diğer skill'lerle karşılanır; (iv) A5'e "nötr 301 hedefi bulunur"
  varsayımı — bulunamazsa brief'in kendi DUR kapısı işler.
- **D3 — değen maddeler:** (i) B5 "her sayfa tematik komşuya bağlanır"
  ↔ "dokunma hedefi kötüleşmez": çözüm — Manisa 7→12 borcu AYNI turda
  kapatılır, önce/sonra md21 ölçümü kanıttır; (ii) B1 "metin veriden
  türetilir" ↔ B4 sert sınır: B1 türetmeleri de B4'ün veri-alanı
  sınırına tabidir; (iii) A5 sayfa düşüşü ↔ "taban gerileme 0" kapısı:
  brief kendisi çözmüş — A5 düşüşü birebir listeyle istisnadır;
  (iv) kopyalanma direnci (bot koruması) ↔ B6 AI bot erişimi:
  CLAUDE.md istisnası açık — arama/AI botları engellenmez, çelişki yok.
- **D4 — yarıda kesilme:** İş `geo-seo` dalında, fazlar kendi içinde
  merge edilebilir; brief + denetim raporları + bu rapor diskte;
  taban anlık görüntüleri değişiklikten ÖNCE alınır (A4). Kesilirse
  main yayında ve sağlıklı kalır; tamamlanmış fazlar kaybolmaz.

### 0d. Oturum açılışı notu
`izleme/SITE-DURUM.md` okundu: **🔴 var** — md17, 4 ölü SYGM dış
bağlantısı (bu işin A bölümünün konusu). 🟡: md21 dokunma (Manisa
7→12, B5'te kapatılacak borç), md16 SEO/GEO 199→207, md18 yeni veri
dosyaları (SIRADAKILER'de kayıtlı).

---

## A. Temizlik ve kaynak onarımı — YAPILDI

### A1. Envanter [VERİ]
Tam dış-link taraması: **1039 benzersiz `<a href>` dış bağlantısı**
(taze worktree build'i, `disLinkleriTopla` + konak-sıralı tam koşum,
400 ms görgü; ham sonuç `cikti/`e değil oturum çalışma dizinine yazıldı,
özet burada). Sonuç: **801 sağlam · 40 tarayıcı-ölü (404) · 198 şüphe**.

40 "ölü"nün otoriter yeniden sınıflaması (handle API + tarayıcı-UA GET):
| Sınıf | Adet | Ayrıntı |
|---|---|---|
| Gerçek ölü — SYGM | 21 | 20 havza koruma eylem planı + Meriç-Ergene NHYP; kaynak: `data/havza-veri.json` + `src/content/havzalar/*.md` (21'i de her iki yerde) |
| Gerçek ölü — kayıtsız DOI | 12 | handle `responseCode:100` (hiç kayıtlı değil; OpenAlex kalıntısı): mcd.00426/24288/52670 · huyuamd.37951/58427/82329 · sdufbed.69661/70687 · gefd.77285 · tjf.80186 · jffiu.60849 (+52670'in handle.net url'ü 500) |
| Gerçek ölü — hedefi ölü DOI | 4 | mta.376765 (→ dergipark ttt/376765 404) · makufebed.206616 · 10.5152/0010 · 10.5152/1100 (ikisi squarespace PDF 404'üne çözülüyor) |
| **Tarayıcı yanlış-pozitifi** | 3 | mcd.386171 · bmre.74700 · mufbed.79713 — nöbetçi UA + HEAD ile 404, tarayıcı UA + GET ile **200 ve başlık birebir**. Değişiklik geri alındı. |

Şüphe (198) sınıflaması [VERİ]: resmigazete ×141 + mevzuat ×22 →
**eksik ara-sertifika zinciri** (kurum sunucusu; `-k` ile 200 +
application/pdf ölçüldü — ziyaretçi tarayıcıları AIA ile açıyor, RG
arızasının ikizi, bizim onaracağımız şey değil) · hdl.handle.net ×18
(örneklemde bir kısmı kalıcı 500 — C listesine izleme önerisi) ·
avesis ×8 (tekrar ölçümde 200, geçici) · doi 5xx ×9.

### A2-A3. Yeni adresler — hepsi İÇERİK KONTROLLÜ [VERİ]
- **SYGM 21 PDF**: kalıp `/SYGM/Belgeler/…` → `/SYGM/BelgelerArsiv/Belgeler/…`
  (kalıbı SYGM'nin kendi Detay sayfası verdi, SayfaId=6). 21/21 yeni adres
  HEAD ile **200 + application/pdf**. `data/havza-veri.json` (21 URL +
  künye `dogrulamaTarihi` 2026-08-25 + not) ve `src/content/havzalar/*.md`
  (21 URL) güncellendi. NOT: `/SYGM/Belgeler/havza tanıtım …` ailesi
  TAŞINMADI (200 ölçüldü) — il-kurum.json'a dokunulmadı.
- **Su Kanunu Taslağı (izleyici hedefi)**: yeni adres aynı kalıpta;
  içerik kanıtı **birebir**: yeni adresin `Last-Modified: Thu, 31 Oct
  2019 08:20:54 GMT` = `izleme/state/su-kanunu-taslak-pdf.lastmod`
  değeriyle aynı (aynı belge). `izleme/hedefler.conf` güncellendi.
- **12 kayıtsız DOI**: künyenin kendi DergiPark sayfası canlı + başlık
  kapsaması 1.0 ölçüldü → `doi` → `doi_olu` taşındı (silinmedi),
  `kunye_notu` eklendi; bağ artık doğrulanmış DergiPark sayfasına.
- **mta.376765**: Türkçe basım (MTA Dergisi) hiçbir adreste
  doğrulanamadı; aynı çalışmanın İngilizce basımı bulundu ve doğrulandı
  (`bulletinofmre/376767`, citation_title birebir; DOI
  10.19111/bulletinofmre.376767 canlı çözülüyor) — künyeye notla yazıldı.
- **makufebed.206616**: DergiPark sayfası bulundu, citation_title birebir.
- **2 İÜC kitabı** (Peyzaj Sulama Tasarımı · Şehir ve Bölge Planlama):
  DOI'ler kayıtlı ama squarespace 404'üne çözülüyor; yayınevi sayfaları
  da 404 (Playwright ile JS'li ölçüldü). **"Kaynak taşındı, yeni adres
  doğrulanamadı (2026-08-25)"** etiketiyle veri kaydında duruyor
  (`url_olu` + `kunye_notu`); sayfa üretim filtresi (`potansiyel.js:98`,
  bağlantısız kaydı zaten dışlar) gereği bu iki künye il sayfalarının
  "akademik yayınlar" listesinden kendiliğinden düştü — veri SİLİNMEDİ.

### A4. İzleyici tabanı [VERİ]
State değeri yeni adresin Last-Modified'ıyla birebir aynı olduğundan
URL değişimi sahte "yeni belge" olayı üretemez; ayrıca taban dosyasına
dokunulmadı. İzleyicinin kendisi Firefox UA kullandığından TBMM
hedefleri onda sağlıklı (nöbetçi-UA 404'leri yanlış alarmdı, ölçüldü).

### A5. /su-hukuku/ kaldırma — YAPILDI [VERİ]
- `src/pages/su-hukuku.astro` → `arsiv/su-hukuku-rota/` (kopya değil
  taşıma; içerik olduğu gibi duruyor + NOT.md).
- 301 hedefi: `/rehberler/ruhsatsiz-kuyu-cezalari/` — en yakın nötr
  içerik: aynı konu (kuyu cezaları) salt mevzuat anlatımı; hukuki vaat
  ölçümü 0 ("avukat/dava aç/itiraz ed" isabeti 0). `_redirects` +
  `izleme/beklenen-301.json` (md3 canlı kanıtını kalıcılaştırır).
- Gelen iç bağlar ÖLÇÜLDÜ: 1046 bağ, 3 kaynak: menü kalemi
  (`anasayfa-v2.js` VERI_ROTALARI → `/rehberler/` kalemiyle değiştirildi,
  menü geometrisi korundu) · ana sayfa CTA kartı (hedef `/rehberler/`,
  metin hedef sayfanın kendi meta-description'ından) · ilce-sorgu bağı
  (kaldırıldı; JS `setT` güncelleyicisi de).
- Kanıt: yerel dist-sun (CSP+_redirects) ölçümü `/su-hukuku/` → **301 →
  /rehberler/ruhsatsiz-kuyu-cezalari/ → 200** · dist'te kalan iç bağ **0** ·
  sitemap diff **tek satır** (`/su-hukuku/` düştü), **diğer fark: 0** ·
  llms.txt 520→519, tek düşen aynı sayfa. CANLI 301 kanıtı deploy
  sonrası bölümde.

### A6. Kanıt paketi ve B tabanı
- A sonrası sayfa: **sitemap 519 URL** (build 522 sayfa = 519 + /404/ +
  noindex 2 pilot). B'nin tabanı budur.
- Yeni dist dış-link kümesi: 1037 benzersiz; **gerçek-ölü kümeden kalan 0**
  (ölçüldü, aile aile grep + küme kesişimi).
- md17/izleyici canlı teyidi deploy sonrası koşulacak (kapı bölümü).
- Tarayıcı yanlış-pozitif dersi (karar maddesi C'de): md17 HEAD-404'te
  GET'e düşmüyor ve nöbetçi UA'sı DergiPark/TBMM'de 404 yiyebiliyor.

---

## B0. Kaynak ve faz kapısı [VERİ — hepsi bu koşumda ölçüldü]

| Ölçüm | Değer |
|---|---|
| A sonrası sayfa | sitemap **519** URL (build 522 = 519 + /404/ + 2 noindex pilot) |
| Build | 10,7 sn duvar / ~16 sn CPU |
| seo-audit + geo-audit (523 sayfa) | ~5 sn |
| İzole faz kapısı (`--hizli --kok <worktree> --taban yerel dist-sun`) | **75 sn**, bellek tavan altı (boş 6441 MB) |
| `--tam` (kayıtlı ölçüm, kaynak yorumu) | 452 sn / 1917 MB |

Sonuç: iş tek oturumda sığar; **fazlar = ayrı commit'ler** (her biri
kendi içinde merge edilebilir), her faz sonunda izole `--hizli` kapısı +
seo/geo denetçileri; kapanışta merge → deploy teyidi → canlı `--tam`.
Zaman aşımı riski yok (en pahalı adım 75 sn'lik kapı).

Faz kapısı TABAN koşusu (A sonrası, düzeltme öncesi): kırmızı 0 ·
sarı 1 (md21 Manisa 7→12 — bilinen borç, B-iv'te kapanacak) · geçti 10 ·
md14 G1-G6 sapma YOK (menü kalemi değişimi tabanı kırmadı) · yeni
su-hukuku 301'leri dahil 6/6 yönlendirme yerelde çalışıyor.
