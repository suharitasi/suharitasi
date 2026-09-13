#!/usr/bin/env bash
# WhatsApp tıklama sayacı — tek komutla okuma (karar-kapatma Faz B3, 08.09.2026).
# Kaynak: Cloudflare Pages Function functions/whatsapp.js (KV: WA_SAYAC).
# Anahtar: .env → WA_SAYAC_ANAHTAR (panelde SAYAC_ANAHTAR secret'ı ile AYNI değer
# olmalı; karar dosyası §D7 adımları). Anahtar eşleşmezse ya da KV bağlı
# değilse Function 302 döner — bu betik onu "sayaç henüz kurulmadı" diye bildirir.
# Kullanım: arac/whatsapp-sayac.sh            → JSON {gunler, toplam, okuma}
#           arac/whatsapp-sayac.sh --ozet     → tek satır (bugün / toplam)
set -euo pipefail
KOK="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE="${WA_SAYAC_SITE:-https://suharitasi.com}"
ANAHTAR="${WA_SAYAC_ANAHTAR:-}"
if [ -z "$ANAHTAR" ] && [ -f "$KOK/.env" ]; then
  ANAHTAR=$(grep -E '^WA_SAYAC_ANAHTAR=' "$KOK/.env" | tail -1 | cut -d= -f2- | tr -d '"' || true)
fi
[ -n "$ANAHTAR" ] || { echo "HATA: WA_SAYAC_ANAHTAR yok (.env ya da ortam)"; exit 2; }

YANIT=$(mktemp); trap 'rm -f "$YANIT"' EXIT
KOD=$(curl -sS -m 30 -o "$YANIT" -w '%{http_code}' "$SITE/whatsapp/?sayac=$ANAHTAR")
case "$KOD" in
  200)
    if [ "${1:-}" = "--ozet" ]; then
      python3 -c "
import json,datetime
d=json.load(open('$YANIT'))
bugun=(datetime.datetime.now(datetime.timezone.utc)+datetime.timedelta(hours=3)).strftime('%Y-%m-%d')
print('WhatsApp tıklama: bugün', d.get('gunler',{}).get(bugun,0), '· toplam', d.get('toplam',0), '· okuma', d.get('okuma','?'))
"
    else
      cat "$YANIT"; echo
    fi ;;
  302)
    echo "SAYAÇ HENÜZ KURULMADI: Function 302 döndü — KV bağlaması (WA_SAYAC) ya da SAYAC_ANAHTAR secret'ı panelde eksik/uyuşmuyor (karar dosyası §D7)."; exit 3 ;;
  *)
    echo "HATA: HTTP $KOD — $(head -c 300 "$YANIT")"; exit 1 ;;
esac
