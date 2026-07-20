#!/bin/bash
# HENDEK FAZ 1 — günlük baraj cron sarmalayıcısı (18:00 TR = 15:00 UTC).
# Çekim → değişiklik varsa commit+push (arşiv git'te yedeklenir; Pages
# git'e bağlıysa push build'i tetikler) → deploy hook (doluysa).
# .env ASLA commit edilmez (gitignore); şifre/TGT hiçbir çıktıya yazılmaz.
#
# SESSİZ HATA YASAĞI (2026-07-20): set -euo pipefail; hata-toleransı gereken
# satırlar tek tek || true / koşullu ile ayrıldı; git add koşullu; başarı
# git log commit teyidiyle ölçülür (deploy HTTP kodu başarı sayılmaz).
set -euo pipefail
KOK=/home/suha/projeler/suharitasi
cd "$KOK" || exit 1
mkdir -p "$KOK/log"
LOGP="$KOK/log/pipeline.log"
HATALOG="$KOK/data/arsiv/baraj/log/cron-hata.log"

# node başarısızlıkta da (exit 1) gün kaydı/log arşivlenmeli; çıkış kodu
# 'if' ile yakalanır — set -e scripti burada DURDURMAMALI (bilinçli tolerans).
if node arac/baraj-cek.mjs; then CEKIM=0; else CEKIM=$?; fi
# 2 = .env doldurulmamış (kurulum eksik): commit'lik bir şey yok, sessiz çık.
[ "$CEKIM" -eq 2 ] && exit 2

# Başarıda da başarısızlıkta da gün kaydı/log değişti — arşivle.
# git add KOŞULLU: var-olmayabilir dosyada exit 128 + set -e ile sessiz durma
# olmasın (eski bug ailesi: koşulsuz git add).
[ -e data/arsiv/baraj ]      && git add data/arsiv/baraj
[ -f data/canli/baraj.json ] && git add data/canli/baraj.json
[ -f UYARI-BARAJ.md ]        && git add UYARI-BARAJ.md

if ! git diff --cached --quiet; then
  ONCE=$(git rev-parse HEAD)
  # commit teyidi: commit atılmazsa veri arşivlenmemiştir → gerçek hata (exit 1).
  git commit -q -m "Baraj arşivi: $(date -u +%Y-%m-%d) günlük çekim (otomatik)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" \
    || { echo "[$(date -u +%FT%TZ)] git commit BAŞARISIZ" >> "$LOGP"; exit 1; }
  SONRA=$(git rev-parse HEAD)
  if [ "$ONCE" = "$SONRA" ]; then
    echo "[$(date -u +%FT%TZ)] commit atlandı: HEAD değişmedi (staged değişiklik commit'lenmedi)" >> "$LOGP"
    exit 1
  fi
  # push başarısızlığı sessizce yutulmaz: log'a düşer, exit 0 DÖNÜLMEZ.
  if ! git push -q; then
    echo "[$(date -u +%FT%TZ)] git push BAŞARISIZ (commit yerelde, sonraki koşuda denenir)" >> "$HATALOG"
    PUSH_HATA=1
  fi
fi

# Cloudflare deploy hook — SON adım. YALNIZ başarılı çekimde (CEKIM=0):
# veri alınamayan günde boşuna deploy yok. Pipeline'ı ASLA çökertmez:
# ağ/HTTP hatası yalnız log'lanır; asıl değer arşivdir, o zaten yazıldı.
if [ "$CEKIM" -eq 0 ]; then
  HOOK=""
  if [ -f .env ]; then
    HOOK=$(grep -E '^CF_DEPLOY_HOOK=.+' .env | cut -d= -f2- || true)
  fi
  if [ -n "${HOOK:-}" ]; then
    HKOD=$(curl -s -m 30 -o /dev/null -w "%{http_code}" -X POST "$HOOK" 2>>"$LOGP") || HKOD="AG-HATASI"
    if [ "$HKOD" = "200" ]; then
      echo "[$(date -u +%FT%TZ)] deploy hook tetiklendi (HTTP 200)" >> data/arsiv/baraj/log/cron.log
    else
      echo "[$(date -u +%FT%TZ)] deploy hook BAŞARISIZ ($HKOD) — arşiv yazıldı, pipeline başarılı sayılır; gerekirse manuel deploy" >> data/arsiv/baraj/log/cron.log
    fi
  fi
fi

# push koptuysa exit 0 dönme (sessiz hata yasağı); değilse çekim kodunu döndür.
[ "${PUSH_HATA:-0}" -eq 1 ] && exit 1
exit "$CEKIM"
