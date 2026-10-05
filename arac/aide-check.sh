#!/bin/bash
# AIDE-CHECK — Pazar 05:00 dosya bütünlük taraması (P1, 05.10.2026).
# Çıkış kodu 0 = fark yok. 1-14 = fark (bit maskesi: yeni/silinen/değişen).
# >=15 = çalışma hatası. İkisi de Telegram'a düşer.
set -euo pipefail
KOK="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$KOK/log/alarm.log"
source "$KOK/arac/cikis-kaydi.sh"
cikis_kaydi_kur "aide-check" "$LOG"
rc=0
sudo -n aide --check --config /etc/aide/aide.conf >>"$LOG" 2>&1 || rc=$?
if [ "$rc" -ge 15 ]; then
  "$KOK/arac/uyari-gonder.sh" "AIDE çalıştırılamadı" \
    "aide-check: rc=$rc (>=15 çalışma hatası) — $LOG" || true
  exit 1
elif [ "$rc" -ne 0 ]; then
  "$KOK/arac/uyari-gonder.sh" "AIDE fark buldu" \
    "aide-check: rc=$rc (dosya bütünlüğü farkı) — $LOG" || true
fi
