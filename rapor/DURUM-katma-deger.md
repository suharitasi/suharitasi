# DURUM — katma değer brifi (10.10.2026)

Brif: `rapor/BRIF-katma-deger.md`. Dal: `katma-deger-20261010`, worktree `~/projeler/suharitasi-katma-deger` (ana ağaç `~/projeler/suharitasi` main'de kalır; otomatik işler oraya yazar). Kilit: `arac/git-kilit.sh`.

## Okunan kural dosyaları (10.10.2026)
CLAUDE.md · BRIEF.md · DESIGN.md · KARARLAR.md · CODE-FREEZE.md · ODUL-USTU.md ("Korunacaklar") · VIZYON.md · .claude/commands/{geo-audit,seo-audit,site-tarama}.md · docs/{ACIK-VERI-KAYNAKLARI,GSC-FAZ1-2-BASELINE,NEHIRLER-SERP-TESHISI}.md · SIRADAKILER.md · izleme/SITE-DURUM.md · ~/denetim/suharitasi/S_rapor.md. Alt dizin CLAUDE.md yok (.venv içindeki üçüncü taraf hariç). Global ~/.claude/CLAUDE.md yok.

## Kural çelişkileri ve sahibin kararları (10.10.2026)
1. Ön onay yok / merge=yayın ↔ DURAK düzeni → **A: brif geçerli** (main'e geçiş DURAK onayıyla).
2. AY İLKESİ ↔ K-1 → **A**; kapanış notu KARARLAR'a yazılır.
3. KARARLAR §9 /harita/ H1 yok ↔ 2.9 → **A**: ana başlık eklenir; §9 değişikliği KARARLAR'a not.
4. KARARLAR §5 il eşlemesi durduruldu ↔ 2.6/3.6 → **A tam**: kapatma kayıtları ve ilanlar illerle eşlenir; il adı metinde geçmeyen kayıtlar tahminle değil resmî kaynaktan doğrulanarak eşlenir; doğrulanamayanların listesi sahibe getirilir. §5 değişikliği KARARLAR'a not.
5. §10 mailto / §11 statik ↔ formlar, yükleme, abonelik → **A** (R2 vb. hesap ayarı gerekirse sorulur).
6. §4 ortalama yok ↔ 1.4 iklim alan ortalaması → **A** (yöntem sayfada yazılır).
7. ODUL-USTU EN reddi ↔ 2.8 → **A**.
8. §14 model ayrımı ↔ tek ajan → **A** (bağımsız inceleme ayrı alt ajanla).

## Aşama durumu
- Aşama 0 keşif: BİTTİ 10.10.2026 (bulgular aşağıda).
- Aşama 1 güven onarımı: SÜRÜYOR 10.10.2026 (DURAK 1 yanıtı beklenirken hukuki onay gerektirmeyen işler; hukuki metinler önizlemede "AVUKAT ONAYI BEKLİYOR" işaretiyle).

## KALEM KALEM DURUM TABLOSU (tek kaynak; her işten sonra güncellenir — son: 10.10.2026 Opus 5.5)

Durum: **yapıldı** (kanıtlı) · **kısmen** · **sürüyor** · **sırada** · **onay bekliyor** (hukuki onay; önizlemede "AVUKAT ONAYI BEKLİYOR") · **sahipte** (karar/işlem sahibin) · **yapılamadı** (neden).

| Kalem | Durum | Kanıt / not |
|---|---|---|
| 0.1 Kural dosyaları + S raporu ek kalemleri | yapıldı | DURUM "Okunan kural dosyaları"; S ek kalemleri a,f,g,m,n,o,p,q,r bu tabloda |
| 0.2 Bulgu doğrulama (doğru/yanlış/kısmen) | yapıldı | RAPOR "bulgu doğrulama tablosu" |
| 0.3 Sır taraması, Zenodo, README/lisans önerisi | yapıldı | gitleaks: depoya ait sır 0; Zenodo v1.0.0 = 49ccbcd, 225 iç belge; README/LICENSE → E kararı |
| 0.4 Wikidata Q141582057 | yapıldı | API 200, kayıt duruyor |
| 0.5 Envanter | yapıldı | DURUM Aşama 0 bulguları |
| 0.6 Tek kaynak haritası | kısmen | ilk tur yapıldı; RG sayısı tek kaynağa indi (rg-kaynak.js); baraj/uydu/il kayıt sayıları 2.1'de |
| 0.7 HUKUK-SORULARI | yapıldı | rapor/HUKUK-SORULARI.md; DURAK 1 kararları alındı |
| 0.8 Görsel inceleme | yapıldı | cikti/denetim/katma-deger-0 (7 sayfa × masaüstü/telefon) |
| 1.1 Tahmin katmanı | yapıldı | baraj 0–100 kırpma, eğilim/mevsim ayrı, "son ölçüm" etiketleri, GRACE tazelik as-of veri ayı, pencere aralıkları |
| 1.2 /veri/gundem/ | yapıldı | yağış kırılımı yoksa ulusal değer + not; en yeni kapatma kaydı 2017 (yeniden ayrıştırma) |
| 1.3 Risk endeksi veri güveni | yapıldı | k/5 sütunu + yöntem notu |
| 1.4 İklim örneklemesi + Gediz | yapıldı | NASA POWER çok noktalı; Gediz tek adımlı tablo revizyonu notu (HavzaYasBandi) |
| 1.5 Formlar ve beyanlar | onay bekliyor | tek sunucu formu yapıldı; gizlilik/form metinleri onaya |
| 1.6 Abonelikler | yapıldı | e-posta formları kapalı, RSS kaldı; KV adres sayısı sunucudan bakılamadı (sahip panelden) |
| 1.7 Üretim kalıntıları | yapıldı | dist'te Apilex/iç not 0 (arama kalıpları RAPOR'da) |
| 1.8 Yazım/biçim | yapıldı | NACE OCR karşılaştırması; "…" emsal anonimleştirme notu; Hakkari'da/QR/Aşi doğrulanmadı |
| 1.9 Sentetik veri | yapıldı | ilçe ±%15 kaldırıldı; tarama: başka sentetik değer yok (Hero damla animasyonu süs) |
| 1.10 Vaat ile içerik | yapıldı | başlık/özet eşitlemeleri (kısıt sorgu, vaka, ilimde kim yetkili, nerede su çıkar, nehir, alarm, ajan bandı) |
| 1.11 Hatalı göl/nehir kayıtları | yapıldı | adsız/yabancı/jenerik çekildi, Aras birleşti, Göksu/Gölcük il eki, geçtiği iller, Türkçe slug 301 |
| 1.12 Wikidata ibaresi | uygulanmaz | kayıt var |
| 1.13 Takip sayfaları | onay bekliyor | taslak-takibi TBMM/Bakanlık belgeleriyle; radar çalışıyor (log) |
| 2.1 Tek kaynak + tutarsızlık denetimi | sürüyor | RG yapıldı (tekil ilan); baraj ortalaması, uydu eğilimi, il kayıt sayıları, izleme denetimi sırada |
| 2.2 Mevzuat maddeleri dizin ölçütü | sırada | aday liste var (265+3); DURAK 2'de |
| 2.3 İl aileleri birleştirme (yeralti-suyu → kuyu-ruhsati) | sırada | |
| 2.4 Göl/nehir dizin eşiği | sırada | |
| 2.5 Sektör (31 NACE → /durumum/) | sırada | |
| 2.6 Örtüşen sayfalar | sırada | |
| 2.7 Sözlük | sırada | |
| 2.8 /en/ | sırada | |
| 2.9 Teknik (JSON-LD, site haritası, llms, 404, manifest, /harita/ H1) | sırada | |
| 2.10 API ve geliştirici | sırada | |
| 2.11 Kaynak ve lisans tablosu | sırada | lisans beyanı metni onaya (A-f) |
| 2.12 Önceki denetimden bekleyenler | sırada | |
| 2.13 Havza sayfaları | sırada | |
| 3.1 Ana sayfa | sırada | |
| 3.2 Menü ≤ 6, araçlara tek ad | yapıldı (DURAK 3 onayına) | 6 madde (Tebliğ Aldım · Tarlamda Su Çıkar mı? · Su Hukuku · Harita · Veri · İletişim); src/data/arac-adlari.js tek kaynak; 1280/1440 px tek satır, taşma 0 (ölçüldü) |
| 3.3 Dil | sırada | |
| 3.4 Güven işaretleri, /hakkinda/, /gizlilik/ kimlik | kısmen | baro/sicil /hakkinda/ + Person JSON-LD (memberOf, identifier); adres sitede ve yapılandırılmış veride yok (tarandı); sayfa tarihi; düzeltme politikası + araç kullanımı taslağı (onay bekliyor); CERN/DOI/Wikidata vurgusu sırada |
| 3.5 Başvuru yolu | kısmen | WhatsApp zaten doğrudan sohbet (wa.me, canlı ölçüldü); il/konu hazır mesajı eklendi (functions/whatsapp.js + test); form sonrası ekran yalnız "Talebiniz alındı. İletişim: hukuk@arslanhukuk.tr"; belge/fotoğraf yükleme sırada |
| 3.6 İl sayfaları | sırada | işletme sahası listesi tek kaynaktan (yapıldı) |
| 3.7 Tarihler | sırada | |
| 3.8 Zenodo düzeltme metni | yapıldı (gönderim sahipte) | rapor/ZENODO-metinleri.md §1; /veri/zenodo.json eski DOI ve hukuki tarih notu çıkarıldı |
| 4.1–4.10 Yeni değer | sırada | 4.1/4.2 A-a/A-b tablolarına bağlı |
| A-a Ceza tutarı yeniden değerleme tablosu | sırada | 2009–2025 tebliğleri resmî kaynaktan |
| A-b Süreler, 5326 m.27, 28 hücre | sırada | |
| A-c Tahsis sırası | onay bekliyor | rehber düzeltildi; madde sayfaları ↔ rehber bağı sırada |
| A-d Emsal (11 dizinde) | sırada | |
| A-e Avukat ifadeleri listesi | sırada | sonraki durakta |
| A-f Lisans/form beyanları, sihirbaz KVKK kutusu | kısmen | form beyanları + onay kutusu yapıldı (onay bekliyor); lisans beyanı sırada |
| B Kapatma kayıtları il eşlemesi | yapıldı | rapor/rg-il-eslemesi-20261010.md; Ergene ×3 notla; il sayıları tek kaynak (ölçüldü) |
| C Büro bilgileri | kısmen | baro/sicil yayında (önizleme); adres yok (tarandı); e-posta: sitedeki 3.815 adresin tamamı hukuk@arslanhukuk.tr, /basin/ farkı Cloudflare e-posta gizlemesi (çözüldü: aynı adres); form sonrası ekran; veri sorumlusu metni (onay bekliyor); düzeltme/araç beyanı taslağı (onay bekliyor); Zenodo metni hazır |
| D Araç adları | yapıldı | dist'te eski ad 0 (12 kalıp), yeni adlar ~1.100 sayfada; adresler değişmedi (yönlendirme gerekmedi); menü "Su Nerede Çıkar?" /ilce-sorgu/ yerine /nerede-su-cikar/ |
| E LICENSE/README, Zenodo talep metni, temiz arşiv | kısmen | LICENSE (tüm hakları saklı, TR/EN) + README; Zenodo TR/EN talep metni; arac/zenodo-temiz-arsiv.py (izinli liste, iç belge 0 — ölçüldü); son arşiv emsal düzeltmesinden sonra üretilecek; depo gizlendikten sonraki ilk dağıtım doğrulaması bekliyor |
| "İlk görüşme ücretsizdir" kaldır | yapıldı | main e6fb26e, canlı 09:05:42Z doğrulandı |
| S-a 68 noindex mevzuat metni | sırada | 2.2 ile |
| S-f il künye süzgeci | sırada | |
| S-g belgelerin güncellenmesi | sırada | |
| S-m eski Türkçe slug göl adresleri | yapıldı | middleware 301 |
| S-n GRACE kaynak dosya adı | kısmen | 2026-04..08 GSFC dosyası yok (404); keşif sürecek |
| S-o sağlık öz-testi | sırada | |
| S-p 5686 kısa ad | sırada | |
| S-q mevzuat düzeltme tarihi politikası | sırada | |
| S-r RG il türetimi hataları | yapıldı | B ile birlikte |
| Kabul 1–10 | sürüyor | son raporda geçti/geçmedi |

## Aşama 0 — keşif bulguları (10.10.2026 07:00–07:30Z; kanıtlar rapor/olcum, cikti/denetim/katma-deger-0)
- Brif denetçisi: ilk tur 3 ENGEL + 2 UYARI (T1: depo dışı/üretim yolları; T6 canlı koşul anılmamış) → netleştirme eki (silme yok) → `cikti/brief/20261010T070746Z-katma-deger-duzeltilmis.md` **TEMİZ**. Düşman geçişi ve amaç özeti RAPOR'un ilk bölümünde.
- Site sağlığı: 🟡 (kırmızı 0; sarı: 12 dış bağlantı zaman aşımı). Yerel öz denetim (worktree build 1190 sayfa, dist-sun 5198): 7 sayfa konsol hata 0, iç link 181 tekil / 0 kırık; masaüstü + telefon (390px) görüntüler: taşma 0; ana sayfa telefonda 22,8 ekran uzunluğunda (brif 3.1 doğrulandı: 12 H2), il sayfası 19,3 ekran, rehber 13,9, /harita/ H1 yok (KARARLAR §9), /hizli-danisma/ H2 yok.
- 0.3 Sır taraması (gitleaks 8.30, 902 commit, 82 MB): 90 bulgu, hepsi `izleme/arsiv/**` ve `izleme/state/` altındaki **üçüncü taraf ham HTML kayıtları** (Resmî Gazete ve DSİ sitelerinden indirilen sayfalarda gömülü Google/GCP API anahtarı kalıpları — bize ait değil, kamuya açık sayfaların içeriği). Depoya ait sır bulgusu 0; `.env` hiç izlenmedi (yalnız `.env.example`); geçmişte WA_SAYAC/Telegram değerleri yok. Değiştirilmesi gereken anahtar: yok (SIRADAKILER'deki "KV SAYAC_ANAHTAR sohbette paylaşıldı" notu ayrı ve eski).
- 0.3 Zenodo: v1.0.0 = commit `49ccbcd` (27.09.2026 21:02Z); arşiv zip 171 MB; etiket ağacında CLAUDE.md, KARARLAR.md, PAZARLAMA-KAZI.md, SIRADAKILER.md, GUNLUK.md, DEVIR.md, .env.example ve denetim/+rapor/ altında 225 dosya VAR (iç belgeler Zenodo'da kamuya açık). Zenodo kaydı: tür "Software" (brif: veri seti olmalı), yazar "suharitasi" (ORCID yok), lisans CC BY 4.0, açıklama tek cümle, related: github tree/v1.0.0. Depo gizlenince: Zenodo zip erişilebilir kalır (Zenodo kopyayı saklar), "isSupplementTo" GitHub bağı kırılır; Cloudflare Pages GitHub entegrasyonu özel depolarla çalışır (uygulama izni gerekir — panel görülemedi, DOĞRULANAMADI); sitede depo bağlantısı 0 sayfa.
- 0.3 README/lisans yok → öneri: README (ne, veri kaynakları, lisans ayrımı), LICENSE (kod: sahibin kararı — öneri MIT ya da "tüm hakları saklı"; veri: kaynak lisanslarına tabi, CC BY 4.0 yalnız kendi türetimler) — sahibe DURAK 1.
- 0.4 Wikidata Q141582057: VAR (API 200, etiket "Su Haritası", son değişiklik 27.09.2026). 1.12 uygulanmaz.
- 0.5 Envanter (dist 1190 sayfa; sitemap 1104): mevzuat 471 (5393:102, 2886:101, 6200:92, 2942:67, 5686:26, 167:25, Su Tahsisleri Yön.:20, YAS Tüzüğü:18, 831:18 + degisiklikler + sayaç) · göller 247 · nehirler 95 · yeralti-suyu/il 81 · kuyu-ruhsati/il 81 · durumum 42 · havzalar 25 · rehberler 10 · veri 5 · su-kanunu 2 · vaka 1 · arsiv 1 · tekil 129 (86 noindex, 43 sitemap'te). Canonical farklı 0, canonical yok 1. Sitemap ↔ dist farkı 0.
- 0.6 Tek kaynak haritası (ilk tur): sayılar build'de veriden hesaplanıyor (kaynakta sabit yok): RG 419 kayıt `src/data/rg-zaman.js` (sabit kontrol: 419), 276 tekil ilan ve 521 `rg-sayi.js`/`vitrin.js`; baraj ortalaması `havza-risk.js` (havza bazında en son tarihli ortalama) + `tahmin.astro` + `BarajDoluluk.astro` + `DegerTeklifi.astro` + `basin.astro` + `zenodo.json.ts` (ayrı hesaplar — tek tanım yok); uydu eğilimi `grace-hesap.js`/`egilim-sinif.js` (yıllık eşik −1,5 cm) ile `tahmin` (aylık OLS); ülke değeri −5,43 cm `KuraklikAlarmi.astro` ← `data/canli/grace-turkiye.json` (2026-03) — kaynak VAR; OpenAPI iki dosya (`/api/v1/openapi.json` 3.0.3, 2 yol, lisans → /acik-veri/; `/veri/openapi.json` 3.1.0, 13 yol, lisans → /gizlilik/); e-posta tek adres (5 yerde), /basin/ dahil doğru.
- 0.8/1.1 Tahmin (worktree dist, 09.10 verisi): uydu tablosu "6 ay sonra" = trend + mevsim bileşeni (Asi: son −15,52, aylık −0,133, 6 ay sonra −32,18 — fark −16,7, trend payı −0,8): brif doğru. Baraj: Marmara 16,61, günlük −0,862, 30 gün −21,25 (16,61 − 25,86 = −9,25 olmalı → hesap hatası doğrulandı), Kuzey Ege −22,79, bantlar eksi; 0–100 sınırı yok. "Son 60 gün" ifadesi var; etiket ("Kritik düşüş") yıllık eğilimden gelir, son aylık değişimden değil → brif "kısmen" (etiket veriyle çelişmiyor, açıklaması eksik). Tazelik eşiği: `guncellik.js` (incelenecek).
- 1.5 Formlar (gerçek hedefler): /hizli-danisma → POST /danisma → KV (WA_SAYAC) 180 gün, KV yoksa mailto'ya düşer; ParselTalep → /api/talep → KV **365 gün** (metin "talep kapanınca silinir"); /istihbarat ve /mevzuat/degisiklikler takip formu → /takip → KV 'a:' **730 gün** (gönderim servisi yok); /alarm → /api/alarm → KV 'al:' 730 gün (e-posta gönderimi `arac/alarm-tetikle.py` SMTP+Telegram — SMTP ayarı?); ana sayfa İletişim formu → data-olay-form "iletisim-form" → /olay sayaç (400 gün) + mailto (sunucuya veri göndermez beyanı KISMEN doğru: olay sayacı gidiyor); Bulten.astro → `action={eylem}` (Buttondown, ertelendi). Gizlilik metni yalnız "~180 gün" diyor → brif doğru.
- 1.6 Toplanan abone adresi sayısı: Cloudflare KV'ye bu sunucudan erişim yok (wrangler kimliği yok, API jetonu yok) → **bakılamadı**; panelden okunur (sahip).
- 1.7 Kalıntılar (dist sayfa): "Apilex" 10, "APILEX" 1, "tam metin veri setinde yok" 1, "veri tabanında bulunmamaktadır" 2, "(brief)" 2, "data/lead/" 33, "nace-ek2.json" 33, "doğrulama sürecindedir" 11, "XXX" 2, "teyit ediliyor" 1, "placeholder" 21 (HTML niteliği olabilir — ayıklanacak); "sutohum" 0.
- 1.8 Yazım: "inceletın" 1, "Elekirikli" 1, "talan. 1" 2, "…</" 4, "Havzası Havzası" 95 (nehir şablonu, Hidrojeoloji Raporu bağlantısı), "Yöntem ve kaynak politikası" 1106 sayfada (hedef denetlenecek); "Hakkari'da" 0, "QR kodhttps" 0, "Aşi" 0 (worktree build) → brifin bu üçü **doğrulanmadı**.
- 1.11 Göl/nehir: dist'te `gol-1`, `golet`, `baraj-golu`, `kirkgoz-springs`, `golcuk` + `golcuk-golu`, `kumkoy-goleti`, `tuz-golu`, `acigol`; nehirler `nehir-1`, `nehir-2`, `aras`, `aras-2`, `aras-nehri`, `goksu`, `goksu-cayi`, `goksu-nehri`. Kaynak: OSM/Natural Earth adları ("Baraj Gölü", "Gölet", "Kirkgöz Springs", "Aras / Արաքս"); il ataması geometri örnek noktasının ilk düştüğü il (`gol-nehir-cografya.js cografyaEsle`: tek il) → "Fırat tek il" doğru. Yabancı alfabeli 15 göl + 26 nehir kaynak veride; build filtresi çoğunu düşürüyor, `gol-1`/`nehir-1/2` kalıyor.
- 2.2 Ölçüt taslağı (anahtar sözcük yok + yürürlük/yürütme maddesi): aday 265 madde (5393: 76, 2886: 87, 6200: 61, 2942: 22, 5686: 8, 831: 6, 167: 3, YAS: 2) + yürürlük/yürütme 3. Liste DURAK 2'de elden geçirilecek (6200 DSİ Kanunu maddeleri su ile bağlı sayılmalı — anahtar listesi genişletilecek).
- K-2 SERP tabanı: `rapor/olcum/serp-onceki-20261010.json` (gsc_ctr_opportunities + gsc_quick_wins, 28 gün) alındı; SIRADAKILER notu DURAK 1 sonrası düşülecek.
- S raporu B sınıfı kalemlerden brifte geçmeyenler (bu işe eklendi): a) 68 noindex mevzuat sayfasının eksik metni · f) il sayfası akademik künye il süzgeci · g) belgelerin güncellenmesi (DEVIR/CLAUDE/BRIEF/KAYNAKLAR) · m) eski Türkçe-slug göl adresleri yönlendirme · n) GRACE kaynak dosya adı keşfi · o) sağlık öz-testi/bekçi canlı HTML · p) 5686 kısa ad · q) mevzuat düzeltme tarihi politikası · r) RG il türetimi hataları (brif 4-A ile birleşir).

## Aşama 1 — yapılanlar (10.10.2026; dal katma-deger-20261010)
- 1.1 Tahmin: baraj projeksiyonu son gözleme bağlandı, 0–100 kırpması ve "sınıra dayandı" notu; uydu tablosunda eğilim/mevsim payı ayrı sütun, "Son ölçüm Mart 2026" etiketi; GRACE tazelik as-of'u işleme günü yerine verinin son ayı (2026-03) → `veri-tazelik.mjs` artık **GECİKMİŞ 223 gün** diyor (dürüst durum; kaynak NASA GSFC 2026-04..08 dosyası yok, 404). Pencere etiketleri: 5 yıllık pencere artık ölçülen aralığıyla yazılır (örn. "2021-04 – 2026-03") — yeralti-suyu/[il] tablo başlığı, kuyu-ruhsati/[il] cümleleri, /harita/ öz-cevap ve şema "(son ölçüm 2026-03)"; 120 aylık gösterge zaten aralığını basıyordu; arşiv notu "254 ay, 2002-04 – 2026-03".
- 1.2 Kapatma başlığı düzeltildi (RG kayıtları). CHIRPS havza kırılımı yok → gündem sayfası ulusal değer + sınırlılık notu; havza hesabı netCDF4 kurulumu gerektirir (ertelendi, ücretsiz; sahibe soru değil, sıradaki).
- 1.3 Risk endeksi: "Veri güveni k/5" sütunu + ağırlıkların editoryal olduğu notu.
- 1.5 Formlar: ana sayfa iletişim formu mailto'dan çıkarıldı → aynı `/danisma` sunucu işlevine (KV, 180 gün), KVKK onay kutusu + tuzak alan; `danisma.js` çok-form; sunucu `eposta` isteğe bağlı alan aldı. /hizli-danisma "talep kapanınca silinir" → "en geç 180 gün"; /gizlilik form envanteri (danışma, ön analiz 365 g, mevzuat aboneliği 730 g, alarm 730 g, olay sayacı 400 g, erişim günlüğü 30 g) tablo + onay bölümü; "Ön Değerlendirme Talebi Gönder" düğmesine onay kutusu (işaretlenmeden yönlendirme yok). /istihbarat ve /mevzuat/degisiklikler e-posta formları kaldırıldı (RSS kaldı; "gönderim servisi bağlandığında" vaadi silindi). **Hepsi önizlemede AVUKAT ONAYI BEKLİYOR**: /, /gizlilik/, /hizli-danisma/, /kuyu-karar-motoru/ (ön değerlendirme kutusu).
- 1.7 Kalıntılar: dist'te Apilex 0 (vitrin.js kaynak etiketi dahil), "doğrulama sürecindedir" 0, "tam metin veri setinde yok" 0, "(brief)" 0, "talan. 1" 0, "Gönderim servisi bağlandığında" 0; "XXX" 2 (telefon yer tutucusu 05XX, kabul).
- 1.8 Yazım/NACE: Ek-2 OCR satır satır karşılaştırma; `su-verimliligi.js` doğrulama sayacı 'ocr-tamamlandi' değerini doğrulanmış sayar (84/90; 6 doğrulanmadı); "ve i saklanması" artığı düzeltildi.
- 1.9 ilçe sorgu: sentetik ±%15 kaldırıldı, gerçek il verisi.
- 1.10 Vaat-içerik eşitlemeleri (nerede-su-cikar meta, nehir "nereye dökülür" koşullu, "tek ekranda" ×3, HavzaPaneli etiketi, alarm kapsamı, AjanBandi, iklim örnekleme notu).
- 1.11 Göl/nehir: adsız/yabancı alfabe/jenerik kayıtlar yayından çekildi (göl 247→244, nehir 95→94), aynı adlar "(İl)" ile ayrıştı, geçtiği iller listesi (örneklem notuyla). Kalan: Aras ×3 birleştirme, eski Türkçe-slug yönlendirme (S-m).
- 1.13 Su Kanunu: taslak-takibi **resmî belgelerle yeniden yazıldı** — TBMM 2/3671 Su Kanunu Teklifi (A. T. Özkan, havale 05.05.2026, esas komisyon Tarım-Orman-Köyişleri), 2/3307 (D. Bekin, 06.10.2025), yazılı soru önergesi 14.04.2026 (S. Çorabatır: "Su Kanunu neden hâlâ yasalaşmamıştır?"), Bakanlık Haber 6900 (25.12.2025); basın kaynağı "268 kurum / 19 madde" **doğrulanamadı** diye işaretli; "Son kontrol: 10 Ekim 2026" görünür; Apilex dayanağı kaldırıldı (tahsis belgesi paragrafı veri seti sayımına indirildi: 469 maddede "tahsis belgesi" 0). /su-kanunu/ gövdesine 3 başlık. Mevzuat radarı **çalışıyor**: cron Çar 05:20 UTC, son koşu 07.10.2026 exit 0, 9 mevzuat 469 madde, 0 değişiklik (`log/mevzuat-radar.log`). Not: ana depodaki `izleme/su-izleme.sh` sabah koşuları 09.10 ve 10.10'da exit 1 — "RG-gunluk: fihrist çekilemedi" (sunucu DNS'i resmigazete.gov.tr'yi çözemiyor, 0.x bulgusu ile aynı kök); dokunulmadı, sahibe bilgi.
- Hukuki düzeltmeler (onay bekliyor): kuyu-tasima yeniden değerleme paragrafı (5326 m.17/7, Tebliğ 585); su-tahsisi rehberi "bağlayıcı sıra yoktur" cümlesi Yönetmelik m.7 ile düzeltildi (m.7 + Tüzük m.15 iki sıra tablo). Rehber koleksiyonuna `onayBekliyor/onayKaynak` alanı eklendi.
- Kanıt: build 1184 sayfa; `npm test` 12/12 + 13 node testi OK; Playwright öz denetim 9 sayfa konsol 0 / kırık iç bağlantı 0 (`cikti/denetim/katma-deger-2/`).
- 1.4 Gediz +%249,6: DSİ Tablo 1.3 serisinde potansiyel 555 (2013–2014) → 1.155,9 (2015'ten itibaren sabit), rezerv 248 → 866,9 aynı yıl: tek adımlı tablo revizyonu, ölçüm artışı değil. `HavzaYasBandi` artık her havzada aritmetik sıçrama tespiti yapar (toplam değişimin ≥ %80'i tek yılda) ve "DSİ tablosunda gerekçe yayımlanmamıştır (doğrulanamadı)" notu basar. Gerekçe için DSİ'de kaynak aranmadı (kayıt dışı yorum yapılmaz).
- 1.10 ek: /kuyu-kisit-sorgu/ başlığı "Kısıt var mı?" → "İlinizdeki kısıt ve işletme sahası ilanları" + "açık/kapalı hükmü vermez" cümlesi; /vaka/ özeti "şu an tek inceleme" diyor; ceza hesaplayıcı başlığındaki "Süreler" sayfanın gerçekten verdiği 15/60 gün adımıyla uyumlu (brif bulgusu **doğrulanmadı**; süre değerleri HUKUK-SORULARI b'de).
- 1.11 ek: Aras'ın üç OSM parçası ("Aras Nehri" 41,3–41,9°D, "Aras" 41,9–42,7°D, "Aras / Արաքս" 43,7–44,4°D; bitişik kutular) tek kayda birleşti (`gol-nehir.js` BIRLESTIR, MultiLineString; eski /nehirler/aras/ ve /aras-2/ → 301). Göksu üçü **ayrı nehir** (Bursa–Sakarya kolu, Adana, Mersin) → başlığa il eklendi; Gölcük ikisi ayrı göl (Isparta 30,49°D / İzmir 28,02°D) → "(Isparta)" "(İzmir)". Birincil il artık geometrinin ağırlık merkezinden seçilir (Gölcük Gölü "Burdur" hatası düzeldi). Eski Türkçe harfli göl/nehir adresleri `functions/_middleware.js` ile ASCII slug'a 301 (yalnız /goller/ ve /nehirler/). Build 1182 sayfa (nehir 92).
- Kanıt (ikinci parti): build 1182; `npm test` 12/12 + 13 OK; öz denetim 9 sayfa konsol 0 / kırık 0; önizleme https://katma-deger-20261010.suharitasi.pages.dev/ ilk partiyi aldı (gizlilik'te onay şeridi, taslak-takibi'nde "Son kontrol: 10 Ekim 2026" doğrulandı 08:14Z).

