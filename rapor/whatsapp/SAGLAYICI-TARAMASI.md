# SAĞLAYICI TARAMASI — Türkiye WhatsApp AI (keşif, 2026-07-28)

Keşif briefi: `cikti/brief/2026-07-28-whatsapp-kesif.md` (+`-duzeltilmis`).
Salt-okunur araştırma — kayıt/deneme hesabı açılmadı, ücretli adım atılmadı.
**Tüm kaynak erişimleri: 2026-07-28.** Sayfada yazmayan her şey
"doğrulanmadı" — tahmin edilmedi. KARAR YAZILMADI; seçim kullanıcının.

Ön kapı notu: brief denetçisi 3 ENGEL verdi; 2'si ekleme-yalnız düzeltmeyle
kapandı, kalan T1 ENGEL'i aracın kayıtlı sınırından (use/mention ayrımı —
"Çıktı:" satırındaki teslimat dosyasını girdi sandı; kurulum raporundaki
elle-değerlendirme istisnası uygulandı, yanlış pozitif).

---

## FAZ 0 — Platform kısıtları (sağlayıcıdan bağımsız; tabloda tekrarlanmaz)

**P1 · 24 saatlik müşteri hizmeti penceresi.** Kullanıcı işletmeye mesaj
atınca 24 saatlik pencere açılır; pencere içinde serbest biçimli her mesaj
(metin/görsel/belge) gönderilebilir ve şablon-dışı mesajlar Meta tarafında
ücretsizdir. Kullanıcının her yeni mesajı sayacı sıfırlar. Pencere dışında
YALNIZ onaylı şablon gönderilebilir.
Kaynak: developers.facebook.com/docs/whatsapp/pricing/ ·
ycloud.com/blog/whatsapp-24-hour-conversation-window-explained (erişim 2026-07-28).

**P2 · Şablon (template) zorunluluğu ve onayı.** Şablonlar Meta onayından
geçer; resmî belge inceleme süresini "24 saate kadar" verir. Kategoriler:
marketing / utility / authentication — kategori zorunlu, yanlış kategori
reddedilebilir. Sınırlar: saatte en çok 100 şablon oluşturma; doğrulanmamış
işletmede 250, doğrulanmış+onaylı numarada 6.000 şablon.
Kaynak: developers.facebook.com/docs/whatsapp/message-templates/guidelines/.

**P3 · İşletme doğrulaması.** Meta Business Portfolio → Security Center
üzerinden; belge: ticaret sicili/kuruluş belgesi (unvan+adres) + fatura
(telefon doğrulaması). Portföydeki bilgiler belgeyle BİREBİR eşleşmeli;
e-posta doğrulama kodu istenir. Bazı BSP'ler "partner-led verification"
(PLBV) sunar. Kaynak: docs.360dialog.com/docs/resources/meta-business-verification ·
respond.io/help/whatsapp/meta-business-verification.

**P4 · Ücretlendirme modeli.** **1 Temmuz 2025'ten beri MESAJ BAZLI**
(eski konuşma-bazlı model kapandı): yalnız TESLİM EDİLEN ŞABLON mesajı
ücretlidir; tüm şablon-dışı mesajlar ücretsizdir. Utility şablonu açık
pencere İÇİNDE ücretsiz, dışında ücretli; marketing her zaman ücretli.
Kaynak: developers.facebook.com/docs/whatsapp/pricing/.
Türkiye birim fiyatı (sağlayıcı sayfalarından, Meta tarifesi):
utility/authentication ≈ 0,0055 USD, marketing ≈ 0,0109 USD
(wamessage.app/whatsapp-api-fiyatlandirma.php — üçüncü taraf aktarımı;
Meta'nın kendi tarife sayfasından ayrıca teyit edilmedi → "doğrulanmadı"
payıyla okunmalı; Palmate eski konuşma-bazlı rakamlar veriyor: 0,0688 USD
marketing — model değişimi nedeniyle bayat olabilir).

**P5 · AI/otomasyon politikası.** Meta 2026 politikası GENEL AMAÇLI
sohbet botlarını (ChatGPT-tarzı açık uçlu) yasaklar; destek/işlem odaklı,
görev-tanımlı botlara izin verir. Şartlar: insana AÇIK eskalasyon yolu,
eskalasyonun AYNI konuşmada olması, kapsam-dışı soruda sınırı söyleyen
standart yanıt. Kaynak: respond.io/blog/whatsapp-general-purpose-chatbots-ban ·
learn.turn.io/l/en/article/khmn56xu3a · whatsappbusiness.com/policy/.
**Senaryomuz (il+sorun tipi+aciliyet toplayan, hukuki tavsiye vermeyen,
avukata devreden bot) tam da izin verilen sınıfa girer** — açık eskalasyon
zaten tasarımın parçası.

**P6 · Türkiye özel notu.** Türk numaraları için Cloud API business
messaging 15 Mayıs 2024'te açıldı (öncesinde kısıt vardı).
Kaynak: help.zoho.com (Zoho Desk topluluk duyurusu) — ikincil kaynak;
Meta birincil duyurusu bu turda bulunamadı → "doğrulanmadı" payı.

---

## FAZ 1 — Aday listesi

| Aday | Merkez | Meta statüsü (kaynak) | Türkçe destek | TR fatura |
|---|---|---|---|---|
| **Sestek / Knovvu** | İstanbul (TR; kurumsal CAI) | BSP beyanı sitede bu turda doğrulanmadı; WhatsApp kanalı belgeli (docs.knovvu.com) | ✓ (TR şirket; TR dil desteği belgeli) | doğrulanmadı |
| **CBOT** | İstanbul (Avcılar Teknokent; +ABD ofisi) | **"2021'de BSP olarak seçildi ve yetkilendirildi"** — kendi sitesi (cbot.ai/tr/...whatsapp...) | ✓ | doğrulanmadı |
| **Insider (MindBehind)** | İstanbul (TR unicorn; MindBehind'ı 2023'te satın aldı — webrazzi.com 2023-01-10) | doğrulanmadı (kurumsal, teklif usulü) | ✓ | doğrulanmadı |
| **Qpien** | doğrulanmadı (TR pazarına Türkçe site) | doğrulanmadı | ✓ | doğrulanmadı |
| **WaMessage (VatanSoft)** | TR (adres sitede: Kaya Milenium İş Merkezi) | **"Meta Tech Provider"** beyanı + rozet — kendi sitesi (wamessage.app) | ✓ | doğrulanmadı |
| **KobiKom** | TR | "Meta Onaylı BSP Partner" — kendi başlığı; sayfa içeriği bu turda yüklenemedi → doğrulanmadı | ✓ | doğrulanmadı |
| **Palmate AI** | doğrulanmadı (TR sayfaları var) | doğrulanmadı | ✓ | doğrulanmadı |
| **Supsis** | TR (blog kaynağı) | doğrulanmadı; ürün sayfası 404 verdi | ✓ | doğrulanmadı |

**Elenenler:** Dialogtab (site https→http'ye düşüyor, güvenli erişim yok —
canlı ürün şüpheli) · Invekto (incelenen sayfa HTTP 410 Gone) · WebCraft /
ChatRobot / yapayzekachatbot.com (ajans-tipi özel geliştirme; ürünleşmiş
self-servis platform kanıtı yok — istenirse ayrı turda bakılır) · Infobip
ve CM.com (küresel BSP'ler; TR ofis/fatura kanıtı bu turda bulunamadı —
aday olarak İKİNCİ TURA bırakıldı, elenmedi).

**Not:** Meta'nın resmî Partner Directory'si ülke filtresiyle bu oturumda
taranamadı (dizin JS-ağırlıklı, çekilen içerik boş döndü) — BSP iddiaları
sağlayıcı beyanlarına dayanır ve tabloda öyle işaretlendi. İkinci turda
dizinden teyit önerilir.

---

## FAZ 2 — Yetenek tablosu (yalnız sayfada YAZAN; boş = doğrulanmadı)

| Yetenek | Sestek/Knovvu | CBOT | Qpien | WaMessage | Palmate |
|---|---|---|---|---|---|
| AI türü | LLM tabanlı sanal ajan; **LLM sağlayıcı/model YAPILANDIRILABİLİR** (docs.knovvu.com "LLM configurations") | AI chatbot (model belirtilmemiş) | AI-destekli beyan ("mesajların %70'ine anında yanıt") | "Conversational AI + NLP" (model belirtilmemiş) | doğrulanmadı |
| Kendi API anahtarın (Claude/OpenAI) | Dolaylı kanıt: LLM sağlayıcı seçimi belgeli; "kendi anahtarın" ifadesi açıkça YOK → doğrulanmadı | doğrulanmadı | doğrulanmadı | doğrulanmadı | doğrulanmadı |
| Akış tasarımı (soru sırası) | belgeli ürün (Virtual Agent akışları) | doğrulanmadı | **✓ sürükle-bırak akış editörü** (kendi sitesi) | doğrulanmadı | "otomasyon akışları" beyanı |
| Webhook/API çıkışı | doğrulanmadı (docs var, bu turda ayrıntı çekilmedi) | doğrulanmadı | doğrulanmadı | kısmi (API/Postman kılavuzu var) | doğrulanmadı |
| İnsan devralma | Agent Copilot ürünü var (devralma modeli ayrıntısı doğrulanmadı) | doğrulanmadı | doğrulanmadı | ima ("ilgili departmana yönlendirir") | doğrulanmadı |
| Mevcut numara | doğrulanmadı | doğrulanmadı | doğrulanmadı | doğrulanmadı | ✓ taşınır; ŞERH: numara API'ye geçince normal WhatsApp uygulamasında KULLANILAMAZ (kendi sayfası) |
| Şablon yönetimi | doğrulanmadı | doğrulanmadı | ✓ ("mesaj şablonları oluşturun") | doğrulanmadı | ✓ ("panel üzerinden şablon oluşturma") |

**Palmate'in numara şerhi herkes için geçerli platform gerçeğidir** (Meta
kuralı): numarayı API'ye bağlamak kalıcıdır; telefon uygulamasına dönüş
yoktur. Karar öncesi kritik: **büronun mevcut numarası mı, yeni numara mı?**

## FAZ 3 — Veri / hukuk (yalnız beyanlar; uygunluk YORUMU yapılmadı — o
değerlendirme hukukçuya aittir)

| Aday | KVKK beyanı | Veri bölgesi | Saklama süresi/silme | Alt işleyen listesi |
|---|---|---|---|---|
| Sestek/Knovvu | doğrulanmadı (kurumsal müşterileri bankalar; DPA teklif sürecinde beklenir — DOĞRULANMADI) | doğrulanmadı; veri maskeleme/guardrail belgeli (sestek.com/agentic-ai) | doğrulanmadı | doğrulanmadı |
| CBOT | doğrulanmadı | doğrulanmadı | doğrulanmadı | doğrulanmadı |
| Qpien | Gizlilik politikası var; KVKK ayrıntısı doğrulanmadı | doğrulanmadı | doğrulanmadı | doğrulanmadı |
| WaMessage | "KVKK uyumlu, uçtan uca şifreli" beyanı (kendi sitesi) | doğrulanmadı | doğrulanmadı | doğrulanmadı |
| Palmate | doğrulanmadı | doğrulanmadı | doğrulanmadı | doğrulanmadı |

Bu sütunların BOŞLUĞU bulgunun kendisidir: hiçbir adayın kamuya açık
sayfasında saklama süresi/alt işleyen listesi bulunamadı — teklif
aşamasında DPA istenmeli. (Zemin: WhatsApp uçtan uca şifrelidir ama BSP
katmanı konuşmayı İŞLER; KVKK m.9 yurt dışı aktarım sorusu her yabancı
altyapıda doğar — değerlendirme kullanıcıda.)

## FAZ 4 — Maliyet

**Meta katmanı (herkes için aynı, FAZ 0/P4):** şablon-dışı mesajlar 0;
utility şablonu pencere içinde 0, dışında ≈0,0055 USD; marketing ≈0,0109
USD (teyit şerhli).

| Aday | Kurulum | Aylık | Sağlayıcı marjı |
|---|---|---|---|
| Sestek/Knovvu | teklif usulü | teklif usulü | teklif usulü |
| CBOT | teklif usulü (form) | teklif usulü | BSP barındırma ücreti ayrıca — kendi sayfası |
| Insider | teklif usulü | teklif usulü | teklif usulü |
| Qpien | doğrulanmadı (14 gün deneme var) | doğrulanmadı | doğrulanmadı |
| WaMessage | tek seferlik kurulum/lisans (tutar YOK) | platform aboneliği (tutar YOK) | "aracı komisyon yok; Meta ücreti + abonelik" beyanı |
| Palmate | doğrulanmadı | abonelik (tutar YOK) | "Meta ücreti üzerine komisyon koymaz" beyanı |

## FAZ 5 — Sentez (senaryo: il + sorun tipi + aciliyet topla; hukuki
tavsiye YOK; avukata özet ilet; yanıt 24 saati aşabilir → şablon kritik)

Senaryo P5 politikasına tam uyumlu (görev-tanımlı bot + insan eskalasyonu).
24-saat-aşımı için gereken: **utility şablonu** ("başvurunuz alındı,
avukat dönecek" tipi) — pencere içinde ücretsiz, dışında ≈0,0055 USD.

**Dürüst sonuç: bu turda hiçbir aday tam "KARŞILIYOR" alamadı** — kritik
hücrelerin (kendi-anahtar, webhook çıkışı, DPA) hiçbiri kamuya açık
sayfada doğrulanamadı. Sıralama "senaryoya en yakın + en az doğrulanmamış
hücre" ölçütüyledir:

| # | Aday | Durum | Artı | Eksi |
|---|---|---|---|---|
| 1 | **Sestek/Knovvu** | KISMEN | LLM sağlayıcı yapılandırılabilir (belgeli) → Claude bağlama ihtimali en yüksek; kurumsal TR; guardrail/maskeleme belgeli | Fiyat teklif usulü (büro ölçeği için ağır olabilir); DPA/saklama doğrulanmadı; BSP statüsü doğrulanmadı |
| 2 | **CBOT** | KISMEN | BSP statüsü KENDİ beyanıyla belgeli (2021); İstanbul; kurumsal referanslar | AI model/anahtar/webhook hiçbiri sayfada yok; teklif usulü |
| 3 | **Qpien** | KISMEN | Sürükle-bırak akış editörü belgeli (senaryonun a-b-c sırası kurulabilir); şablon yönetimi var; deneme var | AI'nın niteliği belirsiz; webhook/devralma/KVKK doğrulanmadı; BSP değil aracı olabilir |
| — | WaMessage | KISMEN | Tech Provider rozeti; komisyonsuz model beyanı; KVKK beyanı | model/şablon/numara ayrıntısı yok; kurumsal derinlik belirsiz |
| — | Insider, KobiKom, Palmate, Supsis | KISMEN/veri az | — | doğrulanabilir içerik bu turda yetersiz |

**Referans satır — KENDİ KURULUMUN (Meta Cloud API + Claude API + kendi
sunucu):**

| Boyut | Durum |
|---|---|
| Maliyet | Meta erişimi için aracı ücreti YOK (Cloud API doğrudan; yalnız şablon ücretleri, P4) + Claude API kullanımı + mevcut Hetzner sunucu (4C/8GB, ölçülmüş) — aylık sabit sağlayıcı aboneliği sıfır |
| Veri denetimi | Konuşma işleme tümüyle kendi sunucunda; alt işleyen = yalnız Meta + Anthropic; DPA'ları kamuya açık | 
| Yetenek | Soru sırası/akış tamamen serbest; webhook zaten sende; insan devralma = e-posta/panel bildirimi (kendin yazarsın); şablon yönetimi Meta Business Manager'dan |
| Bedel | Geliştirme + bakım YÜKÜ sende: işletme doğrulaması (P3), şablon onayları, oturum durumu yönetimi, hata nöbeti. Site altyapısı statik-kalır ilkesine EK bir servis demektir (CLAUDE.md "ağır sunucu bağımlılığı ekleme" ilkesiyle gerilim — değerlendirme kullanıcıda) |
| Uygunluk | P5 politikasına uyum senin tasarımında; hazır guardrail yok |

**İkinci tur önerisi (karar değil):** ilk üç adaydan DPA + fiyat teklifi +
"kendi Claude anahtarımı bağlayabilir miyim, webhook ile konuşma özetini
kendi sunucuma itebilir miyim" yazılı sorusu; Meta Partner Directory'den
BSP teyidi. Kayıt/deneme bu keşfin kapsamı dışında bırakıldı (brief).

---

### Kaynak listesi (tümü erişim 2026-07-28)
developers.facebook.com/docs/whatsapp/pricing/ ·
developers.facebook.com/docs/whatsapp/message-templates/guidelines/ ·
docs.360dialog.com/docs/resources/meta-business-verification ·
respond.io/help/whatsapp/meta-business-verification ·
respond.io/blog/whatsapp-general-purpose-chatbots-ban ·
learn.turn.io/l/en/article/khmn56xu3a · whatsappbusiness.com/policy/ ·
ycloud.com/blog/whatsapp-24-hour-conversation-window-explained ·
cbot.ai/tr/yapay-zeka-tabanli-whatsapp-business-chatbotlarimiz/ ·
sestek.com/virtual-agent-knovvu · docs.knovvu.com/docs/virtual-agent-version-30 ·
sestek.com/agentic-ai · qpien.com/tr · wamessage.app/whatsapp-ai-chatbot.php ·
wamessage.app/whatsapp-api-fiyatlandirma.php ·
palmate.ai/tr/cozumler/whatsapp-business-api-fiyat-ve-kurulum ·
kobikom.com.tr/whatsapp-business-api · webrazzi.com/2023/01/10/insider-… ·
supsis.com/blogs/en-iyi-whatsapp-bot · help.zoho.com (TR Cloud API duyurusu).
