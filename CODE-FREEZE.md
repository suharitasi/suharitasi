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
- (yok)

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
