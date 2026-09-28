# CODE FREEZE — 1 hafta

**Durum:** AKTİF
**Başlangıç:** 2026-09-28
**Bitiş:** 2026-10-05 (aynı saat)
**Kapsam:** `suharitasi.com` deposu — `main` dalı ve Cloudflare Pages dağıtımı.

## Kural
Bu pencere boyunca `main` dalına **hiçbir kod değişikliği** (özellik, düzeltme,
içerik, stil, yapılandırma, bağımlılık) gönderilmez. Depo salt-okunur kabul
edilir; inceleme/ölçüm serbesttir, yazma yasaktır.

## Gerekçe
"Parsel Bazlı Hidrojeolojik Ön Değerlendirme" bileşeni (form + Cloudflare
Pages Function `/api/talep`) canlıya alındıktan sonra davranışın gerçek
trafikte gözlenmesi ve geri bildirim toplanması için sabit bir taban gerekir.

## İstisna (yalnız acil)
Yalnızca **çalışırlığı veya güvenliği** bozan acil durumlarda (örn. canlı
formun veri kaybetmesi, güvenlik açığı, 5xx fırtınası) tek amaçlı,
minimum yüzeyli bir düzeltme yapılabilir. İstisna kullanılırsa commit
mesajı `[FREEZE-İSTİSNA]` ile işaretlenir ve nedeni buraya yazılır.

### Freeze istisna kaydı
- **2026-09-28 — [FREEZE-İSTİSNA: Marketing B2B API Konumlandırması]**
  Sahip talebiyle, dört kurumsal hizmet (Kurumsal API, LegalTech Karar
  Motoru, Tescilli DOI veri seti, Mevzuat & İstihbarat akışı) için B2B
  konumlandırma bandı eklendi. Yeni JS kütüphanesi / harici CSS yok;
  yalnız mevcut tasarım sistemi (#0F172A slate kart, #38BDF8 bordür)
  kullanıldı. Kapsam: `src/components/anasayfa/KurumsalHizmetler.astro`
  (yeni) + `src/pages/index.astro` (yerleşim). Geri alınabilir (tek revert).
  Not: Bu, klasik "acil" tanımının dışındadır; sahibin açık talimatıyla
  ve geri-alınabilirlik + doğrulama kanıtıyla kayda geçirilmiştir.

## Bitiş
Pencere sonunda bu dosya `KARARLAR.md`'ye kapanış kaydı düşülerek arşivlenir
veya silinir; freeze kaldırılana kadar yeni iş `SIRADAKILER.md`'ye yazılır,
uygulanmaz.

## Bu pencerede donan son iş
- `src/components/ParselTalep.astro` — teknik ön değerlendirme formu
  (/nerede-su-cikar/, /havzalar/)
- `functions/api/talep.js` — POST /api/talep → KV (WA_SAYAC), rate-limit,
  honeypot, origin kontrolü, KVKK onayı zorunlu
- İlgili sayfa bağlantıları ve meta/logo/nav düzeltmeleri
