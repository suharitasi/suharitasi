#!/usr/bin/env bash
# UYARI GÖNDERİCİ — sunucudan ÇIKAN tek bildirim yolu (B2.2, 2026-07-28).
#
# SORUN: bugüne kadar her uyarı sunucunun İÇİNDE kalıyordu — depoya
# `UYARI-*.md` dosyası düşüyor ya da `log/pipeline.log`'a satır yazılıyordu.
# Sunucu donarsa, cron ölürse ya da disk dolarsa bu yolların HEPSİ birden
# susar ve kimsenin haberi olmaz. Sessiz ölümün sessiz alarmı işe yaramaz.
#
# BU KÖPRÜ NE YAPAR: uyarıyı Telegram'a gönderir — yani sunucudan ÇIKARIR.
# NE YAPMAZ: sunucunun tamamen kapandığını haber vermez. Kapalı sunucu
# mesaj gönderemez. GERÇEK dış izleme (sunucuyu DIŞARIDAN yoklayan servis)
# hâlâ kullanıcı kararı bekliyor — bkz. rapor/dis-izleme.md.
#
# YAPILANDIRMA (.env, ikisi de gerekli — yoksa script SESSİZCE DEĞİL,
# AÇIKÇA "yapılandırılmadı" der ve 0 döner; çağıran iş bozulmaz):
#   TELEGRAM_BOT_TOKEN=...
#   TELEGRAM_CHAT_ID=...
#
# root bağımlılığı YOK: başka projelerin (BIST, /root altında) bildirim
# altyapısına dokunulmaz, ayrı bot/kanal kullanılır.
#
# KULLANIM: arac/uyari-gonder.sh "<konu>" "<gövde>"
set -euo pipefail

KOK="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$KOK/log/uyari.log"
mkdir -p "$KOK/log"
KONU="${1:?kullanım: uyari-gonder.sh <konu> <govde>}"
GOVDE="${2:-}"
logla() { echo "$(date -u +%FT%TZ) uyari: $*" >> "$LOG"; }

# .env'i kaynak alma (sırlar kabuğa sızmasın): yalnız iki değişken okunur.
oku_env() {
  [ -f "$KOK/.env" ] || return 0
  grep -E "^$1=" "$KOK/.env" 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"'"'"'\r' || true
}
TOKEN="${TELEGRAM_BOT_TOKEN:-$(oku_env TELEGRAM_BOT_TOKEN)}"
CHAT="${TELEGRAM_CHAT_ID:-$(oku_env TELEGRAM_CHAT_ID)}"

if [ -z "${TOKEN:-}" ] || [ -z "${CHAT:-}" ]; then
  # KURULMAMIŞ ≠ BAŞARISIZ. Kanal kurulmadığı için gönderilemiyorsa bu bir
  # arıza değil, eksik yapılandırmadır; çağıran işi düşürmeyiz. Ama sessiz
  # de kalmayız: log'a ve stdout'a yazılır.
  logla "KANAL YAPILANDIRILMADI (.env: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID) — gönderilemedi: $KONU"
  echo "UYARI KANALI YAPILANDIRILMADI — mesaj gönderilemedi. Kurulum: rapor/dis-izleme.md §4"
  exit 0
fi

MESAJ="🔴 suharitasi — ${KONU}

${GOVDE}

$(date -u +%FT%TZ) · $(hostname)"

# --fail: HTTP hatasında exit≠0. Hata YUTULMAZ, loglanır (sessiz hata yasağı).
if curl -sS --fail -m 20 \
     --data-urlencode "chat_id=${CHAT}" \
     --data-urlencode "text=${MESAJ}" \
     "https://api.telegram.org/bot${TOKEN}/sendMessage" >> "$LOG" 2>&1; then
  logla "gönderildi: $KONU"
  echo "uyarı gönderildi"
else
  logla "GÖNDERİM BAŞARISIZ: $KONU (curl exit $?)"
  echo "UYARI GÖNDERİLEMEDİ — ayrıntı: $LOG" >&2
  exit 1
fi
