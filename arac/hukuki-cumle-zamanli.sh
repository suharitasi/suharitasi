#!/usr/bin/env bash
# GÜNLÜK HUKUKİ CÜMLE BİLDİRİMİ (KARARLAR §73/5; sahip talimatı 10.10.2026): systemd zamanlayıcısı
# suharitasi-hukuki-cumle.timer her gün 22:00 (Europe/Istanbul) çalıştırır. O gün ana dala giren
# hukuki cümlelerin dosyasını ~/denetim/suharitasi/hukuki-cumleler/ altına yazar; cümle varsa
# Telegram'a tek satır bildirim gönderir, yoksa göndermez. --kuru: dosyayı üretir, göndermez.
set -euo pipefail
KOK=/home/suha/projeler/suharitasi-katma-deger
ENV=/home/suha/projeler/suharitasi/.env
CIKTI=/home/suha/denetim/suharitasi/hukuki-cumleler
cd "$KOK"
mkdir -p "$CIKTI"
cikti=$(python3 arac/hukuki-cumle-gunluk.py --cikti-dizin "$CIKTI")
echo "$cikti"
n=$(sed -n 's/^CUMLE_SAYISI=\([0-9]*\) .*/\1/p' <<<"$cikti" | tail -1)
yol=$(sed -n 's/^CUMLE_SAYISI=[0-9]* YOL=//p' <<<"$cikti" | tail -1)
if [ "${n:-0}" -eq 0 ]; then echo "hukuki cümle yok; bildirim gönderilmedi"; exit 0; fi
if [ "${1:-}" = "--kuru" ]; then echo "kuru: bildirim metni = Bugün ${n} hukuki cümle canlıya girdi, dosya: ${yol}"; exit 0; fi
oku() { grep -E "^$1=" "$ENV" | head -1 | cut -d= -f2- | tr -d '"'"'"'\r'; }
TOKEN=$(oku TELEGRAM_BOT_TOKEN); CHAT=$(oku TELEGRAM_CHAT_ID)
if [ -z "$TOKEN" ] || [ -z "$CHAT" ]; then echo "Telegram yapılandırması bulunamadı ($ENV)" >&2; exit 1; fi
curl -sS --fail --max-time 20 -o /dev/null "https://api.telegram.org/bot${TOKEN}/sendMessage" \
  --data-urlencode "chat_id=${CHAT}" --data-urlencode "text=Bugün ${n} hukuki cümle canlıya girdi, dosya: ${yol}"
echo "bildirim gönderildi: ${n} cümle"
