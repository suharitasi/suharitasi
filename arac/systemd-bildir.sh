#!/bin/bash
# SYSTEMD-BILDIR — başarısız bir systemd birimini Telegram'a taşır (P1, 05.10.2026).
# Kullanım: systemd-bildir.sh <birim>  (telegram-bildir@.service ExecStart'ı çağırır)
set -euo pipefail
BIRIM="${1:?kullanım: systemd-bildir.sh <birim>}"
KOK="$(cd "$(dirname "$0")/.." && pwd)"
exec "$KOK/arac/uyari-gonder.sh" "systemd birimi BAŞARISIZ: $BIRIM" \
  "journalctl -u $BIRIM ile inceleyin. Köprü: telegram-bildir@.service (P1 dayanıklılık)."
