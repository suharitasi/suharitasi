#!/bin/bash
# HENDEK FAZ 1 — günlük baraj cron sarmalayıcısı (18:00 TR = 15:00 UTC).
# Çekim → değişiklik varsa commit+push (arşiv git'te yedeklenir; Pages
# git'e bağlıysa push build'i tetikler) → deploy hook (doluysa).
# .env ASLA commit edilmez (gitignore); şifre/TGT hiçbir çıktıya yazılmaz.
set -u
KOK=/root/projeler/suharitasi
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

# Deploy hook (opsiyonel — .env'de DEPLOY_HOOK_URL doluysa)
HOOK=$(grep -E '^DEPLOY_HOOK_URL=.+' .env 2>/dev/null | cut -d= -f2-)
if [ -n "${HOOK:-}" ]; then
  curl -s -m 30 -X POST "$HOOK" -o /dev/null -w "[deploy hook HTTP %{http_code}]\n" \
    >> data/arsiv/baraj/log/cron.log 2>&1
fi

exit $CEKIM
