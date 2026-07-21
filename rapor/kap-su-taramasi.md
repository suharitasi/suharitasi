# KAP Su Taraması — HAM ADAY (BÖLÜM E2)

**Tarih:** 2026-07-21 · **Sunucu:** Hetzner/DE (TR-IP değil) · **Kapsam:** son 90 gün
(2026-04-22 → 2026-07-21) · **Bütçe:** ~10 istek (≤20), ≥5 sn ara.

## SONUÇ: ERİŞİLEMEDİ — KAP API taşınmış (Next.js)

Bu taramada KAP JSON API'sine **erişilemedi.** Tespit: KAP sitesi **Next.js**
uygulamasına geçmiş; kuyu-veri-kesif.md'de (700f216, 20.07.2026) çalıştığı
doğrulanan `POST /tr/api/disclosure/members/byCriteria` ucu artık kullanılamıyor.

Kanıt (bu sunucudan, 2026-07-21):
- `POST /tr/api/disclosure/members/byCriteria` → **HTTP 500** `{"success":false,"errorMessage":"HTTP 500 - "}`
  (çeşitli payload/tarih formatı/başlık denemelerinde ısrarla 500).
- `GET /tr/api/disclosure/todayDisclosures` → **404**, Next.js hata sayfası (`__next_error__`, `/_next/...`).
- `POST /api/disclosure/members/byCriteria` (/tr'siz) → **404** Next.js.
- `POST /tr/api/disclosures/byCriteria` → **timeout (28)**.
- `GET /tr/bildirim-sorgu` → 200 ama 1.16 MB Next.js SPA; API uçları JS-bundle
  içinde, HTML'de `byCriteria`/`api` izi YOK.

**Değişim:** KAP frontend/API'si 20.07 → 21.07 arasında Next.js'e taşınmış görünüyor;
eski Angular-dönemi disclosure uçları bu sunucudan yanıt vermiyor. Bu, TR-IP engeli
DEĞİL (Next.js hata sayfaları/500 dönüyor, red değil) — API yolu/şeması değişmiş.

## Uydurma yasağı
Erişilemediği için **hiçbir bildirim/aday listelenmedi.** "Erişilemedi" bir hüküm
değil tespittir; sahte KAP kaydı üretilmedi (brief kuralı).

## Kullanılacaktı (kayıt)
Anahtar kelimeler (harf duyarsız, `summary`/`subject` üzerinde): **"su verimliliği",
"atıksu", "arıtma", "sondaj", "sulama", "baraj"** — tek başına "su" KULLANILMAYACAKTI
(taşkın/yanlış eşleşme). Çıktı biçimi: şirket | tarih | tek satır özet | KAP linki;
üst sınır 200 satır (aşarsa ilk 200 + "kesildi (toplam N)"). Sonuç HAM ADAY olacaktı;
vaka/lead seçimi kullanıcı + Fable'da.

## Öneri (kullanıcıya devir)
1. Yeni KAP API ucu tarayıcı DevTools ağ sekmesinden yakalanabilir (bildirim-sorgu'da
   bir sorgu çalıştır → XHR/fetch isteğini kopyala). Yeni uç + payload elde edilince
   bu tarama scripti güncellenir.
2. kuyu-veri-kesif.md'deki KAP pipeline notu (byCriteria) **güncellenmeli** — KAP
   migrasyonu eski deseni geçersiz kıldı. (Bu rapor o bulguyu da belgeliyor.)
3. Alternatif: KAP'ın varsa yeni resmî/açık veri ucu ya da RSS'i araştırılır.
