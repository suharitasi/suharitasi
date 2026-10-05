#!/bin/bash
# SYS-CHECK — saatlik RAM kontrolü (P1 sözleşmesi, 05.10.2026).
# %85 üstünde Telegram'a uyarı; çıkış kaydı cikis-kaydi.sh sözleşmesinde.
set -euo pipefail
KOK="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$KOK/log/alarm.log"
source "$KOK/arac/cikis-kaydi.sh"
cikis_kaydi_kur "sys-check" "$LOG"
RAM=$(free | awk '/Mem/{printf "%.0f", $3/$2*100}')
if [ "$RAM" -gt 85 ]; then
  "$KOK/arac/uyari-gonder.sh" "RAM kritik: %$RAM" \
    "sys-check: RAM kullanımı %$RAM (>85). free -h çıktısı sunucuda incelenmeli." || true
fi
