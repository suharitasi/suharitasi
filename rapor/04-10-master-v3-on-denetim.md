# RAPOR — MASTER BRİF v3 (Ulusal Dönüşüm) Ön Denetim + Uygulama · 04.10.2026

- **Sınıf:** BÜYÜK İŞ (çok dosya + görsel kimlik + hukuki metin + dönüşüm).
- **Sahip talimatı:** "Karar gerektiren bir şey yok; emirlerimi uygula, soru
  sorma" → AY İLKESİ kuyruk kapısı bu kapsam için sahip onayıyla aşıldı;
  brief denetimi + düşman geçişi + kanıt rejimi KORUNDU.

## 1. Brief denetimi (ön kapı)
- Orijinal brief: `cikti/brief/2026-10-04T1904-master-v3.md` →
  `brief-denetci`: **3 ENGEL + 1 UYARI** (T5 DUR, T5 commit+push, T7 uydurma
  kapısı, T8 geri dönüş).
- Düzeltilmiş (yalnız ekleme + netleştirme):
  `cikti/brief/2026-10-04T1904-master-v3-duzeltilmis.md` → **2 UYARI**
  (T1: `surum.json` + bu rapor dosyası). İkisi de kapatıldı: `surum.json`
  build çıktısı olarak notlandı; bu rapor yazıldı.

## 2. Düşman geçişi (D1-D4)
- **D1:** "Dönüşüm artacak/tescillenecek" ölçülemez iddialar brief'ten
  çıkarılmadı ama taahhüt edilmedi; ölçüm planı: 2-4 hafta sonra GSC/GA4
  (GA4 Admin API kapalıysa NEUTRAL yazılır).
- **D2:** "0 jargon" mutlak denmez; tarama kapsamı görünür metindir, teknik
  adlar kapalı `<details>` ve JSON-LD'de bilinçli istisnadır (ölçüm §5).
- **D3:** 1190 sayfa + sitemap 1104 + şema bekçileri korundu; sessiz
  bayatlama yok (build + site-saglik).
- **D4:** Tüm bitti-tanımları grep/sayım/canlı çıktıya bağlandı (§5).

## 3. 3b — Amaç / Dokunulmazlar / Kanıt
- **Amaç:** görünür yüzeylerde jargonu kaldırmak; ana sayfaya 3 sorgu CTA'sı;
  81 ili "Yerel Su ve Kuyu Rehberi"ne çevirmek; hukuki dönüşüm kanallarını
  güçlendirmek; SEO/şema/güvenlik bütünlüğünü korumak.
- **Dokunulmazlar:** uydurma yasağı; yeni hukuki iddia yok; S1/.v2-ust-akis;
  Hero sahnesi + H1; mevcut şema alanları; `aggregateRating` yok; TBB sınırı.
- **Kanıt:** build logu; grep/sayım; tarayıcı öz-denetimi; `surum.json`;
  `site-saglik --hizli`; görsel taban gerekçesi.

## 4. Uygulanan iş paketleri
- **P1 — Ana sayfa (index.astro + anasayfa-v2.css):** 2 CTA kartı → 3 kart;
  tam metinler: "Arsamda / Tarlamda Su Çıkar mı?" → `/ilce-sorgu/`,
  "Bu Bölgede Kuyu Açmak / Sondaj Yaptırmak Yasak mı?" → `/kuyu-kisit-sorgu/`,
  "Arazimin Su Seviyesi Azalıyor mu?" → `/tahmin/`. Hero (Sondaj sahnesi +
  H1), S1 sırası, LCP preload ve Kuraklık Alarmı bandı korundu.
  **Sapma (dürüstlük):** brief "hero'da dağınık harita önizlemeleri" varsayıyor;
  mevcut tasarımda harita önizlemesi YOK (hero = video sahne akışı + H1).
  Bu yüzden hero sökülmedi; 3 kart hero-sonrası hızlı erişim katmanına
  yerleştirildi (S1 dokunulmazı ve sahne akışı korunur).
- **P2 — /tahmin/:** üst sözlük bölümü tamamen kaldırıldı; başlıklar
  "Aylık Su Seviyesi Değişimi" ve "Güvenilir Trend mi? (Tesadüf Değil)";
  h2 "6 Aylık Su Projeksiyonu — suyu en hızlı azalan 6 havza"; teknik adlar
  (GRACE, OLS, Mann-Kendall, p<0,05) sayfa sonunda KAPALI
  `<details>` "Akademik ve Teknik Yöntem Detayları" içine alındı.
- **P3 — 81 il sayfası:** OzCevap altına "X Yerel Su ve Kuyu Rehberi" 4 soru
  bloğu: (1) DSİ bölge müdürlüğü — doğrulanmış eşleme; (2) Resmî Gazete
  kayıtları — doğrulanmış kayıt sayısı + en güncel tarih/durum, kayıt yoksa
  "kayıt bulunmaması kısıt olmadığının kanıtı değildir"; (3) yerel su idaresi
  — açık kayıt yoksa dürüst "teyit alınmalıdır"; (4) işlem süresi —
  doğrulanmış sabit süre YOK → "DSİ'den teyit + İYUK m.7 60 gün dava süresi".
  Tabloda "GRACE eğilimi" → "Uydu ölçümü" (kaynak adı dipnotta korunur).
- **P4 — Hukuki dönüşüm:** `HukukDanismanlik` bileşenine "Hızlı danışma"
  (`/hizli-danisma/`) kanalı eklendi → 5 sayfada (su-hukuku, rehberler,
  islem-matrisi, nerede-su-cikar, kuyu-tasima) WhatsApp/telefon/e-posta
  yanında form kanalı. TBB sınırı korundu (hizmet vaadi dili yok);
  `/kuyu-karar-motoru/` CtaBlok'u zaten mevcuttu.
- **P5 — /api-dokumantasyonu/:** değişiklik gerekmedi; dört uç canlıda 200
  (`/api/v1/havzalar`, `/api/v1/kuraklik`, `/api/v1/il/{il}.json`,
  `/api/v1/havza/{havza}.json`); dokümantasyon uçlarla uyumlu.

## 5. Ölçümler (taze kanıt)
- **Build:** `npm run build` EXIT 0 · **1190 sayfa** · sitemap 1104.
- **Görünür metin /tahmin/:** üst sözlük 0; jargon (GRACE 3, Mann-Kendall 2,
  OLS 1, p<0,05 1) tamamı KAPALI `<details>` içinde; açık akışta 0.
- **Ana sayfa:** 3 kart tam metinle; `v2-cta-uclu` 1, eski `v2-cta-ikili` 0.
- **Örnek il (/yeralti-suyu/ankara/):** "Yerel Su ve Kuyu Rehberi" + 4 soru
  yayında; "GRACE eğilimi" 0; "Uydu ölçümü" 2.
- **Hukuk kanalı:** `/su-hukuku/` HTML'inde `/hizli-danisma/` 3 bağlantı.
- **Tarayıcı öz-denetimi (4 sayfa):** konsol hata/uyarı 0; 88 iç link 0 kırık;
  ekran görüntüleri `cikti/denetim/{tahmin,landing,yeralti-suyu-ankara,su-hukuku}.png`.
- **Canlı:** `surum.json` = `ba8ade7`; CTA kartları + tahmin detay akordeonu +
  il rehberi + hızlı danışma canlıda doğrulandı.
- **Görsel taban:** bilinçli tasarım değişikliği gerekçesiyle yenilendi
  (2026-10-04T19:10Z, 22 ölçüm / 11 sayfa).
- **site-saglik --hizli:** **GENEL YEŞİL 0/0/13** (21/21 sayfa 200, mobil
  taşma 0, konsol 0, deploy yaşı 0).

## 6. Kalan DUR
- **Canlı görsel/içerik onayı** kullanıcıda (İş kapanış kuralı).
- GA4 Admin API kapalı olduğundan dönüşüm etkisi ölçülemez; GSC CTR etkisi
  2-4 hafta sonra yeniden ölçülür (mevcut İZLEME kalemi).
