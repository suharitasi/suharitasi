#!/usr/bin/env bash
# Faz 1 görsel çekim koşucusu: dist'i servis et → faz1-goruntu.mjs → kapat.
# Sessiz hata yasağı: set -euo pipefail; hata-toleransı gereken satır tek tek
# gerekçeli. Kullanım: MOD=taban ./arac/faz1-cek.sh
set -euo pipefail

KOK="/home/suha/projeler/suharitasi"
MOD="${MOD:-taban}"
PORT="${PORT:-5401}"

cd "$KOK"
[ -d dist ] || { echo "dist yok — önce npm run build"; exit 1; }

# Statik servis (dist), arka planda
python3 -m http.server "$PORT" --directory dist --bind 127.0.0.1 >/dev/null &
SRV=$!
# Sunucu ölürse çekim anlamsız; her çıkışta temizle
trap 'kill "$SRV" 2>/dev/null || true' EXIT

# Hazır olana dek bekle (maks ~10sn); kör sleep değil koşullu yoklama
for i in $(seq 1 50); do
  if curl -fsS "http://127.0.0.1:${PORT}/" -o /dev/null; then break; fi
  sleep 0.2
  if [ "$i" -eq 50 ]; then echo "sunucu ayağa kalkmadı"; exit 1; fi
done

MOD="$MOD" PORT="$PORT" node "$KOK/arac/faz1-goruntu.mjs"
