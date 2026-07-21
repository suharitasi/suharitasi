#!/bin/bash
# BELLEK LOGGER — her 10 dk cron (*/10). Tek satır ölçüm: swap used + mem available.
# saglik-bekcisi.sh bu logu okuyup pencere-tabanlı bellek eşiği denetler.
# Sessiz hata yasağı: set -euo pipefail; alan çıkarımı awk ile kesin kolon.
set -euo pipefail
LOG="$HOME/bellek-log.txt"
# free -m: Mem satırı $7 = available; Swap satırı $3 = used (MB).
SWAP_USED=$(free -m | awk '/^Swap:/{print $3}')
MEM_AVAIL=$(free -m | awk '/^Mem:/{print $7}')
# Beklenen sayısal değer; boşsa yaz ve çık (sessizce yanlış satır üretme).
if ! [[ "$SWAP_USED" =~ ^[0-9]+$ && "$MEM_AVAIL" =~ ^[0-9]+$ ]]; then
  echo "$(date -u +%FT%TZ) HATA: free -m ayrıştırılamadı (swap='$SWAP_USED' avail='$MEM_AVAIL')" >> "$LOG"
  exit 1
fi
echo "$(date -u +%FT%TZ) swap_used_mb=${SWAP_USED} mem_avail_mb=${MEM_AVAIL}" >> "$LOG"
# Log sınırlı kalsın (~2000 satır ≈ 2 hafta): kuyruğu al, atomik değiştir.
if [ "$(wc -l < "$LOG")" -gt 2000 ]; then
  tail -n 2000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi
