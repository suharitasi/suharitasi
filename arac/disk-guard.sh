#!/bin/bash
# DISK-GUARD — saatlik disk kontrolü (P1 sözleşmesi, 05.10.2026).
# %80 üstünde: Telegram uyarısı + journal 50M budama + apt cache temizliği.
# sudo -n ZORUNLU: yetki yoksa sessizce geçilmez; stderr'e ve çıkış kaydına düşer.
set -euo pipefail
KOK="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$KOK/log/alarm.log"
source "$KOK/arac/cikis-kaydi.sh"
cikis_kaydi_kur "disk-guard" "$LOG"
DOLULUK=$(df / | awk 'NR==2{gsub(/%/,""); print $5}')
if [ "$DOLULUK" -gt 80 ]; then
  "$KOK/arac/uyari-gonder.sh" "Disk kritik: %$DOLULUK" \
    "disk-guard: / doluluk %$DOLULUK (>80). journalctl 50M'a budanıyor + apt cache temizleniyor. df -h /: $(df -h / | awk 'NR==2{print $3" / "$2" ("$5")"}')" || true
  sudo -n journalctl --vacuum-size=50M || echo "UYARI: journalctl budama BAŞARISIZ (sudo -n yetkisi?)" >&2
  sudo -n apt-get clean || echo "UYARI: apt-get clean BAŞARISIZ (sudo -n yetkisi?)" >&2
fi
