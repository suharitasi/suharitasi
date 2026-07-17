#!/bin/bash
# HENDEK FAZ 1 — günlük baraj cron sarmalayıcısı (18:00 TR = 15:00 UTC).
# Çekim → değişiklik varsa commit+push (arşiv git'te yedeklenir; Pages
# git'e bağlıysa push build'i tetikler) → deploy hook (doluysa).
# .env ASLA commit edilmez (gitignore); şifre/TGT hiçbir çıktıya yazılmaz.
set -u
KOK=/home/suha/projeler/suharitasi
cd "$KOK" || exit 1

node arac/baraj-cek.mjs
CEKIM=$?
# 2 = .env doldurulmamış (kurulum eksik): commit'lik bir şey yok, sessiz çık.
[ $CEKIM -eq 2 ] && exit 2

# Başarıda da başarısızlıkta da gün kaydı/log değişti — arşivle.
git add data/arsiv/baraj data/canli/baraj.json UYARI-BARAJ.md 2>/dev/null
if ! git diff --cached --quiet; then
  git commit -q -m "Baraj arşivi: $(date -u +%Y-%m-%d) günlük çekim (otomatik)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
  git push -q || echo "[$(date -u +%FT%TZ)] git push BAŞARISIZ" >> data/arsiv/baraj/log/cron-hata.log
fi

# Cloudflare deploy hook — SON adım. Kurallar:
#  - YALNIZ başarılı çekimde (CEKIM=0) tetiklenir: veri alınamayan günde
#    boşuna deploy yok.
#  - Pipeline'ı ASLA çökertmez: ağ/HTTP hatası yalnız log'lanır; asıl değer
#    arşivdir ve o bu noktada zaten yazılmıştır — çıkış kodu değişmez.
#  - URL .env'de (CF_DEPLOY_HOOK) — tek kaynaktan yönetim.
if [ "$CEKIM" -eq 0 ]; then
  HOOK=$(grep -E '^CF_DEPLOY_HOOK=.+' .env 2>/dev/null | cut -d= -f2-)
  if [ -n "${HOOK:-}" ]; then
    HKOD=$(curl -s -m 30 -o /dev/null -w "%{http_code}" -X POST "$HOOK" 2>/dev/null) || HKOD="AG-HATASI"
    if [ "$HKOD" = "200" ]; then
      echo "[$(date -u +%FT%TZ)] deploy hook tetiklendi (HTTP 200)" >> data/arsiv/baraj/log/cron.log
    else
      echo "[$(date -u +%FT%TZ)] deploy hook BAŞARISIZ ($HKOD) — arşiv yazıldı, pipeline başarılı sayılır; gerekirse manuel deploy" >> data/arsiv/baraj/log/cron.log
    fi
  fi
fi

exit $CEKIM
