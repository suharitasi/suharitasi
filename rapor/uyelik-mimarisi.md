# ÜYELİK MİMARİSİ — KEŞİF (İş C)

Tarih: 2026-07-29 · **RAPOR İŞİDİR: kod değişmedi, hesap açılmadı, karar
yazılmadı.** Brief kapısı: `cikti/brief/2026-07-29-uc-is.md` → TEMİZ.

---

## C0. KAPSAM — ne kapatılabilir, ne kapatılamaz

### KAPATILAMAZ — içerik sayfaları (ölçüldü: **159 sayfa**)

| Grup | Sayfa | Neden açık kalmalı |
|---|---|---|
| İl sayfaları (`/kuyu-ruhsati/*`) | **81** | Arama görünürlüğünün omurgası |
| `/durumum/*` persona | **42** | Uzun kuyruk sorgu yüzeyi |
| Havza sayfaları | **25** | Konu otoritesi |
| Rehberler | **10** | Ana dönüşüm yolu |
| Vaka | **1** | Kanıt |

**Gerekçe (üç satış raporunun ortak uyarısı):** içerik kapatmak indeks
körlüğü yaratır. Bu sitenin bugünkü sorunu zaten görünürlük
(`rapor/dagitim-durumu.md` §3: kendi alan adıyla tam eşleşme aramasında
bile sonuç yok). Görünürlük sorunu olan bir sitede içerik kapatmak,
elindeki tek varlığı kesmektir.

**Ayrıca kayıt:** `robots.txt` GPTBot/ClaudeBot/PerplexityBot'a açık —
AI-arama görünürlüğü bilinçli bir karar. Üyelik duvarı bu kararı da iptal
ederdi.

### KAPATILABİLİR — türetilmiş varlıklar (bugün hiçbiri yok)

| Aday | Bugünkü durum | Not |
|---|---|---|
| **Toplu veri indirme** (CSV/JSON) | `veri/potansiyel/` **11 dosya** git'te, ama **sitede indirme yüzeyi YOK** | En temiz aday: sayfalar açık kalır, *veri setinin tamamı* üyeliğe girer |
| **Bölgesel/havza raporu** (PDF) | üretilmiyor | Türetilmiş çıktı — sayfadaki bilgiden farklı bir paketleme |
| **Parsel değerlendirmesi** | yok | Girdi kullanıcıdan gelir; hizmet, içerik değil |
| **Bülten arşivi** | `README-BULTEN.md` var, yayın yok | Arşiv kapatılabilir, tekil sayılar açık kalabilir |

**Ayrım ilkesi:** *okunan şey* açık kalır, *indirilen/üretilen şey*
kapatılabilir. Bu ayrım sayfa sayısını değiştirmez → indeks riski sıfır.

---

## C1. ÜÇ MİMARİ — kıyas

| | (a) Cloudflare Workers + KV/D1 | (b) Hetzner sunucu | (c) Hazır servis |
|---|---|---|---|
| **Kurulum yükü** | Orta — Worker + oturum + ödeme kancası yazılır | Yüksek — servis, veritabanı, TLS, yedek, güncelleme, izleme | Düşük — panelden kurulum, siteye snippet |
| **Aylık maliyet** | **0 ₺** başlar. Workers ücretsiz: **100.000 istek/gün**; KV ücretsiz: **100.000 okuma/gün**, 1.000 yazma, 1 GB; D1 ücretsiz: **5 GB**, 5M okuma/yazma/ay. Ücretli plan **$5/ay** (10M istek). | **0 ₺ ek** — sunucu zaten var (ama §"gizli maliyet") | **Memberstack** $25/ay (yıllık) + **%4** işlem · **Outseta** $47/ay + **%2** işlem |
| **KVKK / veri konumu** | Kişisel veri Cloudflare'de (yurt dışı). Aydınlatma + açık rıza gerekir. **[SERDAR-HUKUK]** | **Veri Türkiye'de, kendi sunucunda** — KVKK açısından en sade | Veri sağlayıcıda (ABD). Yurt dışına aktarım rejimi **[SERDAR-HUKUK]** |
| **Site bağımsızlığı** | **Korunur** — site statik kalır, üyelik ayrı katman (CLAUDE.md "site statik kalır") | **BOZULUR** — üyelik sunucuya bağlanır | Korunur — site statik, servis dışarıda |
| **Sunucu ölürse** | Site **ve** üyelik ayakta | Site ayakta, **üyelik ölür** | Site ve üyelik ayakta |
| **Geri dönüş** | Orta — kod bizde, veri dışa aktarılabilir | Kolay — her şey bizde | **Zor — kilitlenme.** Üye/abonelik verisi sağlayıcı biçiminde |

### (b)'nin gizli maliyeti — bugünkü dersin doğrudan konusu
23 Temmuz'da sunucu **iki kez** cevapsız kaldı (avail 90 MB, swap 6.047 MB
— `rapor/sunucu-donma.md`). O gün site etkilenmedi, çünkü **site sunucudan
bağımsız**. Üyelik sunucuya konursa o bağımsızlık biter: sunucu donduğunda
**ödeme yapmış üye içeriğe erişemez.** Ayrıca dış izleme hâlâ yok
(`rapor/dis-izleme.md`) — arıza saatlerce fark edilmeyebilir.

**Ölçülü karşı-kanıt:** bugün sunucuda üyelik için hazır hiçbir parça yok
(veritabanı servisi, oturum katmanı, TLS sonlandırma hepsi yeni iş).
"Mevcut altyapı" avantajı **görünür, gerçek değil**.

---

## C2. KİMLİK DOĞRULAMA — hukuk bürosu bağlamı

| Yöntem | Uygunluk | Risk |
|---|---|---|
| **E-posta bağlantısı (passwordless)** | **En uygun.** Parola saklanmaz → sızıntıda parola kaybı yok. Site zaten `mailto:` ile e-posta üzerinden çalışıyor; alışkanlık uyumlu | Bağlantı e-postası gecikirse/spam'e düşerse giriş engellenir. Tek kanal bağımlılığı |
| Parola | Tanıdık | **Parola saklama sorumluluğu** (hash, sızıntı, sıfırlama akışı). Bir hukuk bürosunun taşıması gereksiz bir yük |
| Sosyal giriş (Google/LinkedIn) | Hızlı | **Müvekkil mahremiyeti:** üçüncü tarafa "bu kişi su hukuku sitesine üye" sinyali gider. Hukuk bürosu bağlamında **uygun değil** |

**Öneri sıralaması: passwordless > parola > sosyal giriş.**
Sosyal giriş bu bağlamda elenmelidir.

---

## C3. ÖDEME — Türkiye

| Sağlayıcı | Durum | Komisyon (doğrulama notu) |
|---|---|---|
| **iyzico** | Çalışıyor | Tek çekim **%1,95**'ten başlayan oranlar bildiriliyor; başka kaynak **%4,29 + 0,25 TL**'den başlıyor diyor — **kaynaklar çelişiyor, kesin oran DOĞRULANMADI**, sözleşme teklifiyle teyit gerekir. Şirketsiz satıcı için **iyzico Link** bireysel çözümü var (bildirildi, doğrulanmadı) |
| **PayTR** | Çalışıyor | Oran **doğrulanmadı**. Aktivasyon 3-7 iş günü (bildirildi) |
| **Stripe** | **Türkiye'de açık** — 18 Eylül 2024'te BDDK gözetiminde EPP olarak faaliyete başladığı bildiriliyor; TRY/USD/EUR, TR IBAN'a yerleşim, Troy + 3DS 2.2 | Komisyon **doğrulanmadı**. Kaynaklar çelişiyor (eski kaynaklar "TR desteklenmiyor" diyor) — **açılış öncesi Stripe'ın kendi TR sayfasından teyit şart** |

**Uyarı:** ödeme oranları pazarlık ve ciroya göre değişir; buradaki hiçbir
oran sözleşme değeri taşımaz. Üçü için de **yazılı teklif** alınmalıdır.

**Abonelik yönetimi:** iyzico ve Stripe tekrarlayan ödeme destekliyor;
PayTR için **doğrulanmadı**.

---

## C4. ÜÇ SENARYO

### Senaryo 1 — EN UCUZ
**Cloudflare Workers + KV, passwordless, iyzico Link**
- Sabit maliyet **0 ₺/ay** (ücretsiz katman: 100k istek/gün fazlasıyla yeter)
- Yalnız işlem komisyonu
- **İlk adım:** kapatılacak varlığı tanımla (öneri: toplu veri indirme),
  Worker iskeleti + KV'de üye tablosu, ödeme kancası en son
- **Zayıf yanı:** en çok kod bizde; oturum/e-posta akışı elle yazılır

### Senaryo 2 — EN BAĞIMSIZ
**Cloudflare Workers + D1, passwordless, iyzico**
- Site statik kalır, sunucudan bağımsızlık **korunur**, veri dışa
  aktarılabilir (D1 → SQL dökümü), sağlayıcı kilidi düşük
- Maliyet 0-5 $/ay
- **İlk adım:** KVKK aydınlatma + açık rıza metni **[SERDAR-HUKUK]**;
  veri yurt dışı aktarımı kararı bundan önce gelir
- **Not:** "en bağımsız" = *hem siteden hem sunucudan* bağımsız. Hetzner
  seçeneği bu başlıkta **daha kötüdür**, daha iyi değil

### Senaryo 3 — EN HIZLI
**Outseta (üyelik + CRM + e-posta tek pakette), Stripe ya da iyzico**
- Haftalar değil günler; kod neredeyse yok
- **$47/ay + %2** işlem
- **İlk adım:** ücretsiz denemede tek bir kapalı varlıkla pilot; site
  statik kalır, yalnız bir snippet girer
- **Zayıf yanı:** kilitlenme + veri yurt dışında + sabit maliyet gelir
  olmadan başlar

---

## Öneri sıralaması (karar SİZİN)

1. **Senaryo 2 (Workers + D1)** — projenin en güçlü ilkesiyle ("site
   statik kalır, sunucudan bağımsız") tek uyumlu seçenek; maliyet
   ihmal edilebilir; geri dönüş açık.
2. **Senaryo 3 (Outseta)** — üyeliğin *işe yarayıp yaramadığını* hızla
   ölçmek istiyorsanız. Pilot olarak makul, kalıcı çözüm olarak pahalı.
3. **Senaryo 1** — 2 ile aynı mimari, daha az yetenek. Ayrı seçenek
   sayılmayabilir.
4. **Hetzner (b)** — **önerilmez.** Sunucu bağımsızlığını bozar ve o
   bağımsızlık 23 Temmuz'da fiilen işe yaramış bir korumadır.

## Karardan ÖNCE cevaplanması gerekenler

1. **Hangi varlık kapatılacak?** (öneri: toplu veri indirme — bugün yok,
   önce **üretilmesi** gerekir. Yani üyelikten önce *satılacak şey* yok.)
2. **KVKK:** yurt dışı veri aktarımı + aydınlatma + açık rıza
   **[SERDAR-HUKUK]** — mimariden önce gelir.
3. **Ödeme sağlayıcısından yazılı teklif** (buradaki oranların hiçbiri
   doğrulanmadı).
4. **AY İLKESİ hatırlatması** (CLAUDE.md): bu dönemde yeni ÖZELLİK
   açılmıyor; öncelik dağıtım + dayanıklılık. Üyelik bir özelliktir ve
   **ziyaretçi verisi henüz yeni akmaya başladı** (7 ziyaret). Kime
   satılacağı ölçülmeden üyelik kurmak, ölçmeden inşa etmektir.

**Kaynaklar:**
[Cloudflare Workers KV ücretsiz katman](https://blog.cloudflare.com/workers-kv-free-tier/) ·
[Cloudflare Workers fiyatlandırma](https://toolradar.com/tools/cloudflare-workers/pricing) ·
[iyzico komisyon oranları](https://poskomisyon.com/pos/iyzico-sanal/) ·
[Stripe Türkiye](https://stripe.com/resources/more/payments-in-turkey) ·
[Türkiye ödeme sistemleri 2026](https://www.zunapro.com/turkey/en/blog/payment-systems-ecommerce-turkey) ·
[Memberstack vs Outseta](https://www.memberstack.com/alternative/memberstack-vs-outseta)
