# Su Haritası — Ana Plan: Türkiye'de daha iyisi olmaması programı

**Tarih:** 13.09.2026 · **Kapsam:** içerik · SEO · GEO/AI · kod mimarisi · ticari omurga ·
para kazandırma · marka/duyulma · ölçüm · riskler.
**İlke:** ölçülen şey iyileştirilir; uydurma yok; TBB ve KVKK sınırı korunur.

---

## 0. Tek cümlelik konumlandırma

> Su Haritası, Türkiye'de **su verisini (havza/il/göl/nehir) su hukukuyla (izin, ruhsat,
> ceza, dava) tek çatıda birleştiren tek portaldır** — ve bu birleşimi yapabilecek
> üç şeye aynı anda sahiptir: doğrulanmış kamu verisi arşivi, Av. Serdar Arslan'ın
> hukuki imzası ve çalışan bir yayın/ölçüm altyapısı.

Rakipler bu üçünü birden kuramaz: haber siteleri hukuku bilmez, avukat siteleri veriyi
bilmez, devlet siteleri kullanıcı diliyle yazmaz.

---

## 1. Varlık envanteri (hendek)

| Varlık | Ölçek | Neden kopyalanamaz |
|---|---|---|
| Havza sayfaları | 25 + veri (yağış alanı, potansiyel, GRACE, baraj) | DSİ/SYGM derlemesi + künye disiplini |
| Kuyu ruhsatı il sayfaları | 81 il | İl→DSİ bölge/havza/SUKİ eşlemesi (resmî belge) |
| İşlem matrisi | 20 işlem × yetkili kurum (155 kurum verisi) | mevzuat atfı → kurum eşlemesi |
| Hukuk rehberleri | 10 rehber, karar matrisli, FAQ, madde metni | avukat imzalı + birebir mevzuat |
| Emsal kararlar | 15 künye | Danıştay/Yargıtay + kaynak bağı |
| Mevzuat kütüphanesi + sözlük | 11 mevzuat + 126 terim | kaynak künyeli |
| Hidrografya | 247 göl + 95 nehir | OSM + tip düzeltme |
| Canlı veri | baraj doluluk (EPİAŞ), GRACE | günlük pipeline + bekçi |
| RG kapatma kaydı | tahsise kapatma/kısıt ilanları | RG taraması |
| Sektör profilleri | 43 persona | NACE + yükümlülük eşlemesi |
| Yazar otoritesi | Av. Serdar Arslan | gerçek avukat, gerçek büro |

**Hendek = veri arşivi + avukat yetkisi + zaman.** Kod kopyalanabilir; bu üçü kopyalanamaz.

---

## 2. Boşluk analizi (dürüst)

1. **Ölçüm yok denecek kadar az.** GA4 yok (KVKK); WhatsApp ve `/olay` sayaçları yeni
   kuruldu ama henüz okunmadı. Dönüşüm kör uçuş.
2. **Lead/CRM yok.** Telefon/WhatsApp/e-posta var; gelen talep bir yere düşmüyor,
   takip edilmiyor.
3. **İçerik hızı düşük.** Rehber başına derinlik var; ama mevzuat madde sayfaları,
   il×işlem sayfaları, emsal genişlemesi yarım.
4. **İçerik içi link grafiği zayıf.** Coğrafya→hukuk köprüsü yeni kuruldu; il→işlem,
   emsal→rehber, mevzuat→rehber çift yönlü değil.
5. **Marka/duyulma sıfıra yakın.** `sameAs` profilleri boş; Wikidata yok; backlink
   profili zayıf; PR yok.
6. **Ticari ürün yok.** Danışmanlık dışında satılabilir bir paket (rapor, abonelik,
   API) tanımlı değil.
7. **Ölçeklenebilir içerik üretim hattı yok.** Her içerik elle + avukat onaylı;
   darboğaz onay.

---

## 3. Altı sütun

### A. İçerik üstünlüğü (asıl iş)

Hedef: **her su hukuku sorusunun tek sayfada, kaynaklı, karar verilebilir cevabı.**

1. **Mevzuat madde sayfaları** — 167, 5686, 2942, 2886, 831, 5393, 6200, YAS Tüzüğü,
   Su Tahsisleri Yönetmeliği: madde bazlı, her maddeye "hangi rehberde kullanılıyor"
   bağı. (Altyapı: `su-kanunu` koleksiyonu genişletilir.)
2. **İl × işlem sayfaları** — 81 il × 20 işlem. Ortak şablon + il-özel kurum bloğu
   (matris altyapısı hazır). Öncelik: kuyu ruhsatı, tahsis, ceza, işletme sahası.
3. **Emsal genişlemesi** — her rehberin emsal bölümünü tam künye + tam metin/özet +
   "hangi durumda işe yarar" satırıyla zenginleştir; veritabanını 15'ten 60+'a çıkar.
4. **Vaka/örnek dosya** — anonimleştirilmiş gerçek dosya akışları (avukat onaylı).
   "X ili Y ilçesinde kaçak kuyu cezası nasıl iptal edildi" tipi — en yüksek dönüşüm.
5. **Araçlar** — "Durumunu seç → hangi belge, hangi kurum, hangi süre" karar aracı
   (matristen türetilir); "kaçak kuyu ceza hesaplayıcı" (kanuni aralıkla, uyarıyla);
   "havza su riski skoru".
6. **Sözlük/mevzuat/SSS hub'ları** — mevcut; düzenli genişletme.
7. **İçerik üretim hattı** — şablon + damıtma + avukat onayı 10 dk'lık onay kuyruğu
   (brief-denetci benzeri). Hız için: veri-güdümlü şablonlar (il, göl, nehir, emsal).

### B. SEO teknik & GEO/AI görünürlük

1. **Entity inşası:** `Organization`/`LegalService`/`Person` var. Eksik: `sameAs`
   profilleri (LinkedIn şirket + yazar, Google Business Profile — TBB sınırı içinde),
   Wikidata kaydı, tutarlı varlık kimliği (isim/logo/email/telefon her yerde aynı).
2. **Konu otoritesi (topical authority):** hukuk rehberleri + mevzuat + emsal +
   il×işlem + vaka = kapalı bir "su hukuku" kümesi; hub (`/su-hukuku/`) merkez.
   İç linkler: coğrafya↔hukuk, il↔işlem↔kurum, mevzuat↔rehber↔emsal (çift yönlü).
3. **AI alıntı optimizasyonu:** her sayfada tanım callout'u, tablo, kaynak künyesi,
   FAQ; `llms.txt` (var); "cevap önce" (var). Sonraki: alıntılanabilir tek cümle
   tanımlar + sayısal tablolar.
4. **Teknik hijyen:** title/description 60/160 (var), canonical/OG (var), sitemap
   (var), IndexNow (var), CWV/Lighthouse ≥90, kırık link 0.
5. **Yerel SEO:** "kuyu ruhsatı {il}", "{il} su hukuku" — il sayfaları zaten var;
   içerik derinliği + kurum bloğu (yeni) ile güçlendir.
6. **Çok dilli (faz 2):** İngilizce özet katmanı — yatırımcı/AI için; Türkçe birincil.

### C. Kod mimarisi & ölçeklenebilirlik

1. **Statik Astro + Cloudflare** doğru seçim; korunur. Dinamik gerek yok.
2. **Veri katmanı tek kaynak:** `data/` + `src/data/*.js` türevleri (mevcut disiplin).
   Yeni: `emsal-kararlar.json`, `islem-matrisi.js`, `mevzuat.js`.
3. **Site içi arama** — 500+ sayfada arama yok. Statik indeks (JSON) + istemci arama
   (Pagefind benzeri, bağımlılıksız) — yüksek kullanıcı değeri.
4. **İçerik hattı:** koleksiyonlar + build bekçileri (mevcut) + şablon üreticiler
   (il×işlem, emsal, mevzuat madde).
5. **Dayanıklılık:** yedek/altın örnek/bekçi (var); API/JSON dışa aktarım (kısmen).
6. **Performans:** JS minimum, medya optimize, CSP (var).

### D. Ticari omurga & para kazandırma (TBB + KVKK uyumlu)

**Kısıt:** avukatlık reklam yasağı — hizmet vaadi, fiyat ilanı, "hemen ara" dili yok.
Bu yüzden para **otorite + bilgi ürünü + veri** üzerinden gelir, reklam üzerinden değil.

1. **Inbound hukuki danışmanlık (birincil):** site otoritesi → WhatsApp/telefon/e-posta
   → Arslan Hukuk Bürosu. Ölçüm: `/olay` + `/whatsapp` sayaçları. (TBB uyumlu, nötr kanal.)
2. **B2B su riski raporları (ikincil, yüksek marj):** "havza/il yatırım su riski raporu"
   — veri ürünü, hukuki görüş değil. Alıcı: sanayi/OSB, HES/JES yatırımcısı, sondaj
   firmaları, bankalar, belediyeler. PDF + veri paketi.
3. **Veri/API lisansı:** havza/il/işlem verisi JSON/CSV; kurumsal lisans.
4. **Bülten sponsorluğu:** sondaj/arıtma/su teknolojisi firmalarına açık, açıkça
   etiketli sponsorluk (TBB sınırı dışında kalan veri katmanı).
5. **Eğitim/webinar:** "su hukuku ve izin süreçleri" eğitimleri (bilgilendirici).
6. **Danışmanlık paketleri:** belge hazırlık takibi, uyum denetimi (avukatlık
   kapsamında, TBB kurallarıyla).
7. **YOK:** display reklam, agresif popup, hizmet vaadi — otoriteyi bozar.

**Dönüşüm hunisi:** içerik → araç (durumunu seç) → iletişim kanalı → büro → müvekkil.
Her aşama `/olay` ile ölçülür.

### E. Marka & duyulma

1. **Veri gazeteciliği:** "Türkiye'de baraj doluluk 2026", "en çok kapatılan havzalar"
   — alıntılanabilir, PR'ı kendiliğinden çeken veri hikâyeleri.
2. **Sektör medyası + ekonomi basını:** tarım/su/çevre bültenleri, yerel basın.
3. **LinkedIn otoritesi:** Av. Serdar Arslan + kurumsal sayfa; düzenli veri/hukuk postu.
4. **Kurum iş birlikleri:** üniversite su araştırma merkezleri, ziraat odaları,
   sondaj dernekleri, barolar (bilgilendirme).
5. **Wikidata/Wikipedia:** varlık kaydı + (uygunsa) madde kaynağı.
6. **Konferans/panel:** su, tarım, enerji etkinlikleri.
7. **Atıf/backlink:** raporlar, veri setleri, üniversite kaynakçaları.

### F. Ölçüm & optimizasyon döngüsü

1. **Ölçüm katmanı:** `/olay` (telefon/e-posta/WhatsApp/form) + `/whatsapp` sayaçları
   (var); GA4 (KVKK onayıyla, faz 2); Search Console (var).
2. **Haftalık:** GSC (tık/gösterim/pozisyon/CTR) + tema tıklamaları.
3. **Aylık:** içerik kazanan/kaybeden, dönüşüm hunisi, lead sayısı.
4. **Çeyreklik:** konu otoritesi, backlink, AI alıntı testleri (Perplexity/ChatGPT/
   Gemini'de marka+soru testleri).

---

## 4. Yol haritası

### 0–30 gün (ölçüm + hızlı içerik)
- [ ] `/olay` ve `/whatsapp` sayaçlarını okumaya başla (`arac/temas-sayac.sh`); KV
      bağlaması + `SAYAC_ANAHTAR` teyidi.
- [ ] GA4 kararı + KVKK çerez onayı metni (faz 2 planı).
- [ ] Mevzuat madde sayfaları: 167 ve YAS Tüzüğü ile başla.
- [ ] İl×işlem: kuyu ruhsatı + tahsis + ceza için il sayfalarına derinleştirme.
- [ ] Emsal DB 15 → 30.
- [ ] Site içi arama (statik indeks).
- [ ] `sameAs` profilleri (LinkedIn) + Wikidata kaydı.

### 30–90 gün (derinlik + dönüşüm)
- [ ] Tüm 20 işlem için il×işlem sayfa şablonu yayına.
- [ ] Karar aracı ("durumunu seç") — matristen.
- [ ] Vaka/örnek dosya şablonu + ilk 5 vaka (avukat onaylı).
- [ ] B2B su riski raporu v1 (pilot: 3 havza) + satış sayfası (TBB dışı veri ürünü).
- [ ] Bülten (var) + sponsorluk medya kiti.
- [ ] Veri gazeteciliği ilk 3 hikâye + PR dağıtımı.

### 90–180 gün (otorite + para)
- [ ] Emsal DB 60+; mevzuat kütüphanesi tam.
- [ ] B2B rapor satışı + ilk 3 kurumsal müşteri.
- [ ] Veri/API lisans pilotu.
- [ ] İngilizce özet katmanı (yatırımcı/AI).
- [ ] Konferans/panel + kurum iş birlikleri.
- [ ] AI görünürlük ölçümü (marka+soru testleri).

### 180–365 gün (savunma + ölçek)
- [ ] İçerik üretim hattı (şablon + onay kuyruğu) ile hız 3–5×.
- [ ] Abonelik/premium veri katmanı.
- [ ] Sektör raporları serisi (yıllık "Türkiye Su Riski").
- [ ] Marka bilinirliği: sektörde ilk akla gelen kaynak.

---

## 5. KPI'lar (ölçülebilir)

| Alan | Bugün (13.09) | 90 gün | 365 gün |
|---|---|---|---|
| Organik tık (28g) | 197 | 600 | 3.000 |
| Hukuki sorgu tıkları (28g) | ~0 | 50 | 400 |
| Hukuk sayfası tıkları (28g) | 37 | 150 | 800 |
| Tema tıklaması (telefon/e-posta/WhatsApp, aylık) | ölçülüyor | 30 | 200 |
| Lead (danışmanlık talebi, aylık) | ? | 10 | 60 |
| B2B rapor satışı | 0 | pilot | 10+ |
| Backlink alan adı | düşük | +20 | +100 |
| AI alıntı (marka+soru testi) | 0 | 3/20 | 12/20 |
| Sayfa sayısı | 526 | 700 | 1.200 |

---

## 6. Riskler ve sınırlar

- **TBB reklam yasağı:** agresif satış yasak → otorite + bilgi ürünü modeli.
- **KVKK:** GA4 çerez onayı gerektirir; çerezsiz sayaç (var) birincil.
- **Uydurma yasağı:** her hukuki cümle doğrulanmış kaynaktan; onay darboğazı.
- **Kaynak:** 4 çekirdek/8 GB; statik mimari bunu kaldırır; dinamik ürün (API/CRM)
  dış servis (Cloudflare KV/D1, e-posta) ile.
- **Tek kişiye bağımlılık (avukat onayı):** şablon + damıtma + onay kuyruğu ile azalt.
- **Rakip taklidi:** hendek veri + avukat; yine de sürekli veri tazeleme gerekir.

---

## 7. İlk 7 gün (hemen)

1. Sayaçları okumaya başla; KV/secret teyidi (`arac/temas-sayac.sh`).
2. 167 + YAS Tüzüğü madde sayfalarını üret (mevzuat omurgası).
3. Emsal DB'yi 30'a çıkar (rehberlerde bekleyen künyeler).
4. Site içi arama indeksini kur.
5. `sameAs` + Wikidata kaydı.
6. B2B rapor v1 iskeletini yaz (3 havza pilot).
7. İlk veri gazeteciliği hikâyesini yayımla + PR listesi.

---

_Not: Bu plan yaşayan bir belgedir; her çeyrek ölçümle güncellenir. Uygulama
sırası "ölç → üret → bağla → duyur → para" döngüsüdür._
