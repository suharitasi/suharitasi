#!/bin/bash
# Ekosistem günlük hattı (Faz 4): tahmin üret + alarm tetikle (+ ayın 1'i rapor).
# Günlük 16:45 UTC (baraj 15:05 sonrası). Yalnız kendi ürünlerini commit eder.
set -euo pipefail
KOK=/home/suha/projeler/suharitasi
cd "$KOK" || exit 1
mkdir -p "$KOK/log"
LOG="$KOK/log/ekosistem.log"
. "$KOK/arac/cikis-kaydi.sh"
cikis_kaydi_kur "ekosistem" "$LOG"
cikis_kaydi_tek_log
. "$KOK/arac/git-kilit.sh"
uyar() { "$KOK/arac/uyari-gonder.sh" "$1" "${2:-}" || true; }

PY=$(command -v python3) || exit 1
KOD=0

timeout 300 "$PY" "$KOK/arac/tahmin/tahmin-uret.py" || KOD=$?
timeout 300 "$PY" "$KOK/arac/alarm-tetikle.py" || KOD=$?

# Rapor yalnız ayın 1'inde üretilir (idempotent; aynı gün içinde tekrar yazsa das aynı içerik).
if [ "$(date -u +%d)" = "01" ]; then
  timeout 300 "$PY" "$KOK/arac/rapor/aylik-rapor-uret.py" || KOD=$?
fi

[ "$KOD" -ne 0 ] && uyar "ekosistem hattı: koşum hata verdi (exit $KOD)" "Log: log/ekosistem.log"

[ -f "$KOK/data/tahmin/kuraklik-projeksiyonu.json" ] && git add -- data/tahmin || true
[ -d "$KOK/src/content/raporlar" ] && git add -- src/content/raporlar || true

PUSH_HATA=0
if ! git diff --cached --quiet; then
  if ! git_kilit_al "ekosistem"; then
    echo "[$(date -u +%FT%TZ)] git kilidi alınamadı — commit ERTELENDİ" >&2
    exit 4
  fi
  git commit -q -m "Ekosistem: tahmin/alarm/rapor güncellemesi $(date -u +%FT%TZ) (otomatik)" \
    || { echo "[$(date -u +%FT%TZ)] git commit BAŞARISIZ" >&2; exit 1; }
  if git_pull_rebase; then
    git push -q || { echo "[$(date -u +%FT%TZ)] git push BAŞARISIZ (commit yerelde)" >&2; PUSH_HATA=1; }
  else
    echo "[$(date -u +%FT%TZ)] pull/push ertelendi (rebase/kirli ağaç)" >&2
    PUSH_HATA=1
  fi
  git_kilit_birak
  if [ "$PUSH_HATA" -eq 0 ]; then
    HOOK=""
    [ -f .env ] && HOOK=$(grep -E '^CF_DEPLOY_HOOK=.+' .env | cut -d= -f2- || true)
    if [ -n "${HOOK:-}" ]; then
      HKOD=$(curl -s -m 30 -o /dev/null -w "%{http_code}" -X POST "$HOOK" 2>>"$LOG") || HKOD="AG"
      echo "[$(date -u +%FT%TZ)] deploy hook: $HKOD" >> "$LOG"
    fi
  fi
fi

[ "$PUSH_HATA" -eq 1 ] && { uyar "ekosistem: pull/push ARIZASI — commit yerelde" "Log: log/ekosistem.log"; exit 1; }
exit "$KOD"
