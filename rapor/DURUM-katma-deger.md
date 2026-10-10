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
- Aşama 1 güven onarımı: SÜRÜYOR 10.10.2026.
- **KARARLAR §73 (10.10.2026 13:52):** önizleme kaldırıldı; tamamlanmış her iş canlıya, "onay bekliyor" olanlar sahibin hukuki onayıyla. Bundan sonra her kalem kendi sınamasından geçip doğrudan canlıya gider. Geçici "kapatılan adresler" site haritası /sitemap-kapatilan.xml — kaldırma tarihi 21.11.2026.

## KALEM KALEM DURUM TABLOSU (tek kaynak; her işten sonra güncellenir — son: 10.10.2026 Opus 5.5)

10.10.2026 14:50 (İstanbul): KARARLAR §73 ile önizleme dalı main'e birleşti (merge d57309e, önceki main e6fb26e; geri alma: `git revert -m 1 d57309e`). "onay bekliyor" satırları sahibin hukuki onayıyla "yapıldı". Canlı doğrulama: 32/32 örnek adres, 7/7 ceza yüzeyi, iki site haritası. Bundan sonra önizleme yok; her kalem sınandıktan sonra doğrudan main'e gider.

Durum: **yapıldı** (kanıtlı) · **sürüyor** · **onay bekliyor** (hukuki ya da DURAK onayı; önizlemede işaretli) · **yapılamadı** (neden) · **başlanmadı**. Ana site: main'e geçti mi (önizleme = yalnız dal).

| Kalem | Durum | Ana site | Not |
|---|---|---|---|
| 0.1 Kural dosyaları + S raporu ek kalemleri | yapıldı | — (rapor) | S ek kalemleri a,f,g,m,n,o,p,q,r tabloda |
| 0.2 Bulgu doğrulama | yapıldı | — (rapor) | RAPOR bulgu doğrulama tablosu |
| 0.3 Sır taraması, Zenodo, README/lisans | yapıldı | — (rapor) | depoya ait sır 0; Zenodo v1.0.0 = 49ccbcd, 225 iç belge |
| 0.4 Wikidata Q141582057 | yapıldı | — (rapor) | kayıt duruyor |
| 0.5 Envanter | yapıldı | — (rapor) | aile bazında sayılar DURUM'da |
| 0.6 Tek kaynak haritası | sürüyor | — | RG sayısı tek kaynakta; baraj/uydu/il sayıları 2.1'de |
| 0.7 HUKUK-SORULARI | yapıldı | — (rapor) | DURAK 1 kararları alındı |
| 0.8 Görsel inceleme | yapıldı | — (rapor) | cikti/denetim/katma-deger-0 |
| 1.1 Tahmin katmanı | yapıldı | EVET (d57309e) | baraj 0–100, eğilim/mevsim ayrı, ölçüm tarihleri, tazelik |
| 1.2 /veri/gundem/ | yapıldı | EVET (d57309e) | yağış ulusal değer + not; en yeni kapatma 2017 |
| 1.3 Risk endeksi veri güveni | yapıldı | EVET (d57309e) | k/5 sütunu + yöntem notu |
| 1.4 İklim örneklemesi + Gediz notu | yapıldı | EVET (d57309e) | NASA POWER çok noktalı; Gediz tablo revizyonu notu |
| 1.5 Formlar ve beyanlar | yapıldı | EVET (d57309e) | tek sunucu formu, gizlilik tablosu, onay kutuları |
| 1.6 Abonelikler | yapıldı | EVET (d57309e) | e-posta formları kapalı, RSS kaldı; KV sayısı sunucudan bakılamadı |
| 1.7 Üretim kalıntıları | yapıldı | EVET (d57309e) | dist'te iç not 0 |
| 1.8 Yazım/biçim | yapıldı | EVET (d57309e) | NACE OCR; emsal "…" notu; 3 bulgu doğrulanmadı |
| 1.9 Sentetik veri | yapıldı | EVET (d57309e) | ilçe ±%15 kaldırıldı |
| 1.10 Vaat ile içerik | yapıldı | EVET (d57309e) | başlık/özet eşitlemeleri |
| 1.11 Hatalı göl/nehir kayıtları | yapıldı | EVET (d57309e) | adsız/yabancı çekildi, Aras birleşti, il ekleri, 301 |
| 1.12 Wikidata ibaresi | uygulanmaz | — | kayıt var |
| 1.13 Takip sayfaları | yapıldı | EVET (d57309e) | Su Kanunu takibi TBMM/Bakanlık belgeleriyle |
| 2.1 Tek kaynak + tutarsızlık denetimi | sürüyor | tamamlanan alt işler EVET (d57309e) | RG ve ceza tutarı tek kaynakta; baraj/uydu/il sırada |
| 2.2 Mevzuat maddeleri dizin ölçütü | sürüyor | tamamlanan alt işler EVET (d57309e) | ölçüt kodda (src/data/mevzuat-dizin.js), liste rapor/olcum/mevzuat-dizin-listesi.md: dizinlenebilir madde 401 → 161; madde sayfasına başlıkta madde adı, önceki/sonraki, anan rehber ve kararlar, resmî metin son kontrol tarihi, metindeki değişiklik işaretleri eklendi; yönlendirme blokları mevzuat/veri ailelerinde 0 (denetlendi); "neden önemli" notları yazılmadı (hukuki, onaya) |
| 2.3 İl aileleri birleştirme | yapıldı | EVET (d57309e) | /yeralti-suyu/{il}/ özgün içeriği (havza özet tablosu, harita/ilçe/tahmin bağları) /kuyu-ruhsati/{il}/#yeralti-suyu'ya taşındı; 81 adres 301 (162 kural, liste rapor/olcum/yonlendirmeler-asama2.md); /kuyu-ruhsati/ dizinine il seçici (betiksiz de çalışır) ve içerik özeti; "60 gün" eksik süre cümlesi taşınmadı (A-b) |
| 2.4 Göl/nehir dizin eşiği | yapıldı | EVET (d57309e) | eşik kodda (gol-nehir.js); göl 243 → 9 açık (EPİAŞ doluluğu ad + havza eşleşmesiyle 9 göl sayfasına eklendi), nehir 91 → 33 açık; liste rapor/olcum/gol-nehir-dizin-listesi.md; Van/Tuz gibi bilinen göller koruma statüsü verisi gelene dek (4.9) kapalı |
| 2.5 Sektör sayfaları → /durumum/ | yapıldı | EVET (d57309e) | 31 NACE sayfası /durumum/ üzerinde çapalı tek tabloda (#nace-KOD); eski adresler satırına 301 (62 kural, liste rapor/olcum/yonlendirmeler-asama2.md); 11 sektör sayfası kaldı (4.9'da doldurulacak); bütün iç bağlar tek yardımcıdan (persona.yol) |
| 2.6 Örtüşen sayfalar | başlanmadı | hayır |  |
| 2.7 Sözlük | başlanmadı | hayır |  |
| 2.8 /en/ | başlanmadı | hayır |  |
| 2.9 Teknik (JSON-LD, site haritası, llms, 404…) | başlanmadı | hayır | /harita/ menü bağlantısı 3.2 ile eklendi |
| 2.10 API ve geliştirici | başlanmadı | hayır |  |
| 2.11 Kaynak ve lisans tablosu | başlanmadı | hayır | lisans beyanı onaya gelecek (A-f) |
| 2.12 Önceki denetimden bekleyenler | başlanmadı | hayır |  |
| 2.13 Havza sayfaları | başlanmadı | hayır |  |
| 3.1 Ana sayfa | başlanmadı | hayır |  |
| 3.2 Menü ≤ 6, araçlara tek ad | yapıldı | EVET (d57309e) | 6 madde, tek satır (ölçüldü) |
| 3.3 Dil | başlanmadı | hayır |  |
| 3.4 Güven işaretleri, /hakkinda/, /gizlilik/ | sürüyor | tamamlanan alt işler EVET (d57309e) | baro/sicil, sayfa tarihi yapıldı; politika metinleri onaya |
| 3.5 Başvuru yolu | sürüyor | tamamlanan alt işler EVET (d57309e) | WhatsApp hazır mesaj, form sonrası ekran yapıldı; dosya yükleme sırada |
| 3.6 İl sayfaları | sürüyor | tamamlanan alt işler EVET (d57309e) | işletme sahası listesi tek kaynaktan (yapıldı); DSİ adres/telefon sırada |
| 3.7 Tarihler | başlanmadı | hayır |  |
| 3.8 Zenodo düzeltme metni | yapıldı | — (gönderim sahipte) | rapor/ZENODO-metinleri.md |
| 4.1–4.3, 4.5–4.10 Yeni değer | başlanmadı | hayır | 4.1/4.2 A-a/A-b tablolarına bağlı |
| 4.4 Emsal karar başına sayfa | yapıldı | EVET (d57309e) | 20 doğrulanan karar için sayfa: künye, karar tarihi, resmî metinden birebir uyuşmazlık·gerekçe·sonuç alıntısı (20/20 birebirlik testi), ilgili madde ve rehber; dizinde arama ve konu süzgeci sınandı |
| A-a Ceza tutarı yeniden değerleme | yapıldı | EVET (d57309e) | 18/18 tebliğ RG'den; 2026: a 30.138–151.192, b 15.029–60.408 TL; 7 yüzey + API tek kaynaktan (ölçüldü); eksik yılda derleme durur |
| A-b Süreler, 5326 m.27, 28 hücre | yapıldı | EVET (d57309e) | süre tablosu + tek hesap modülü (5 yüzey); 28 hücreden 18 resmî metinle dolduruldu, 13 doğrulanamadı (arama sürüyor); sihirbaza m.27/8 dalı; sayaçtaki 60-gün hatası düzeltildi |
| A-c Tahsis sırası | yapıldı | EVET (d57309e) | rehber düzeltildi; m.7 ve Tüzük m.15 sayfaları rehbere bağlandı |
| A-d Emsal | yapıldı | EVET (d57309e) | dizinde ve tüm dış yüzeylerde (veri/emsal.json, MCP, llms-full, uyum dosyası, iptal analizi, ana sayfa bandı) yalnız resmî sunucuda doğrulanan 20; 1 künye çelişkisi + 5 Yargıtay ayrı noindex sayfada; 3 rehber özeti karar metniyle çelişiyor (HUKUK-SORULARI) |
| A-e Avukat ifadeleri listesi | onay bekliyor | — | 17 ifade, güncel sayfa sayısı ve ikişer seçenek HUKUK-SORULARI'nda; hiçbiri değiştirilmedi; sihirbaz ön değerlendirme cümlesinde yargı yolu bulgusu |
| A-f Lisans/form beyanları, sihirbaz KVKK kutusu | sürüyor | tamamlanan alt işler EVET (d57309e) | form beyanları + onay kutusu onaya; lisans beyanı sırada |
| B Kapatma kayıtları il eşlemesi | yapıldı | EVET (d57309e) | Ergene ×3 notla; il sayıları tek kaynak (ölçüldü) |
| C Büro bilgileri | sürüyor | tamamlanan alt işler EVET (d57309e) | baro/sicil, adres yok, e-posta tek; veri sorumlusu metni onaya |
| D Araç adları | yapıldı | EVET (d57309e) | eski ad 0, yeni adlar ~1.100 sayfada |
| E LICENSE/README, Zenodo metinleri, temiz arşiv | sürüyor | — (depo/Zenodo) | LICENSE+README, TR/EN talep metni, arşiv betiği hazır; depo gizlenince dağıtım doğrulaması |
| "İlk görüşme ücretsizdir" kaldır | yapıldı | EVET (e6fb26e, canlıda doğrulandı) |  |
| S-a 68 noindex mevzuat metni | başlanmadı | hayır | 2.2 ile |
| S-f il künye süzgeci | başlanmadı | hayır |  |
| S-g belgelerin güncellenmesi | başlanmadı | — |  |
| S-m eski Türkçe slug göl adresleri | yapıldı | EVET (d57309e) | middleware 301 |
| S-n GRACE kaynak dosyası | sürüyor | — | 2026-04..08 dosyası yok (404) |
| S-o sağlık öz-testi | başlanmadı | — |  |
| S-p 5686 kısa ad | başlanmadı | hayır |  |
| S-q mevzuat düzeltme tarihi politikası | başlanmadı | hayır |  |
| S-r RG il türetimi hataları | yapıldı | EVET (d57309e) | B ile |
| Kabul ölçütleri 1–10 | sürüyor | — | son raporda geçti/geçmedi |

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

