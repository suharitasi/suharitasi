#!/bin/bash
# RESTIC-VERIFY — Pazar 04:00 yerel repo veri bütünlüğü örneği (P1, 05.10.2026).
# Root deposuna erişim sudo -n ile; parola dosyası yalnız root okur (sır yazılmaz).
set -euo pipefail
KOK="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$KOK/log/alarm.log"
source "$KOK/arac/cikis-kaydi.sh"
cikis_kaydi_kur "restic-verify" "$LOG"
if sudo -n bash -c 'RESTIC_PASSWORD_FILE=/root/site-tools/.restic-pass /root/site-tools/restic -r /root/restic-repo check --read-data-subset=1%' >>"$LOG" 2>&1; then
  :
else
  "$KOK/arac/uyari-gonder.sh" "Restic doğrulama BAŞARISIZ" \
    "restic-verify: check rc≠0 — $LOG son satırlarına bakın." || true
  exit 1
fi
