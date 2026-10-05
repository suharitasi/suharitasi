#!/bin/bash
# PG-MAINTENANCE — Pazar 03:00 PostgreSQL vacuum+analyze (P1, 05.10.2026).
set -euo pipefail
KOK="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$KOK/log/alarm.log"
source "$KOK/arac/cikis-kaydi.sh"
cikis_kaydi_kur "pg-maintenance" "$LOG"
if ! sudo -n -u postgres vacuumdb --all --analyze-in-stages --quiet >>"$LOG" 2>&1; then
  "$KOK/arac/uyari-gonder.sh" "PostgreSQL bakımı BAŞARISIZ" \
    "pg-maintenance: vacuumdb rc≠0 — $LOG" || true
  exit 1
fi
