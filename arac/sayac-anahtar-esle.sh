#!/bin/bash
# sayac-anahtar-esle.sh — .env WA_SAYAC_ANAHTAR ↔ Cloudflare SAYAC_ANAHTAR eşleştirme.
#
# NEDEN (04.10.2026): canlı ölçümde .env değeriyle /api/loglar 401, /whatsapp/
# okuma 302 dönüyordu → panel secret'ı ile .env değeri FARKLI. Bu betik:
#   --kontrol : mevcut değeri canlı uçlarda sınar; DEĞERİ ASLA YAZDIRMAZ,
#               yalnız uzunluk + HTTP kodları + yol haritası basar.
#   --ayarla  : paneldeki değeri gizli (read -s) okur, .env'i atomik günceller,
#               ardından canlı doğrular. Eski değer yorumda saklanmaz.
#
# KULLANIM:
#   arac/sayac-anahtar-esle.sh            # teşhis
#   arac/sayac-anahtar-esle.sh --ayarla   # panel değerini yaz ve doğrula
set -euo pipefail
KOK="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE="${WA_SAYAC_SITE:-https://suharitasi.com}"
ENV="$KOK/.env"

oku_env() {
  [ -f "$ENV" ] || { echo "HATA: .env yok"; exit 2; }
  grep -E '^WA_SAYAC_ANAHTAR=' "$ENV" | tail -1 | cut -d= -f2- | tr -d '"' | tr -d '\r'
}

sinar() {
  local anahtar="$1"
  [ -n "$anahtar" ] || { echo "  anahtar BOŞ → okuma uçları yetkisiz döner"; return; }
  local kod
  kod=$(curl -s -m 20 -o /tmp/.sayac-sinar.json -w '%{http_code}' \
    -H "Authorization: Bearer $anahtar" "$SITE/api/loglar" || echo 000)
  echo "  /api/loglar        HTTP $kod  (beklenen: 200)"
  case "$kod" in
    200) echo "  → EŞLEŞME TAM: panel verisi okunabilir." ;;
    401) echo "  → UYUŞMAZLIK: değer paneldeki SAYAC_ANAHTAR ile FARKLI." ;;
    503) echo "  → DEPO EKSİK: WA_SAYAC bağlaması ya da SAYAC_ANAHTAR tanımsız." ;;
    405) echo "  → ROTA YOK/ESKİ DAĞITIM: /api/loglar beklenen sürümde değil." ;;
    *)   echo "  → Beklenmeyen yanıt; bağlantıyı kontrol edin." ;;
  esac
  local w
  w=$(curl -s -m 20 -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $anahtar" "$SITE/whatsapp/" || echo 000)
  echo "  /whatsapp/ okuma   HTTP $w  (200 = eşleşti, 302 = uyuşmadı)"
}

case "${1:-}" in
  --ayarla)
    echo "Paneldeki SAYAC_ANAHTAR değerini girin (girdi görünmez, .env'e yazılır)."
    read -rsp "SAYAC_ANAHTAR: " YENI; echo
    [ -n "$YENI" ] || { echo "HATA: boş değer yazılmadı."; exit 2; }
    GECICI=$(mktemp); trap 'rm -f "$GECICI"' EXIT
    grep -vE '^WA_SAYAC_ANAHTAR=' "$ENV" > "$GECICI"
    printf 'WA_SAYAC_ANAHTAR=%s\n' "$YENI" >> "$GECICI"
    chmod 600 "$GECICI"
    mv "$GECICI" "$ENV"
    trap - EXIT
    echo "… .env güncellendi; canlı sınanıyor:"
    sinar "$YENI"
    ;;
  --kontrol|"")
    A=$(oku_env || true)
    echo "kaynak: $ENV · anahtar uzunluğu: ${#A}"
    sinar "$A"
    cat <<'NOT'

ONARIM YOLU (tek adım, kullanıcı):
  1) Cloudflare → Pages → suharitasi → Settings → Environment variables
     → SAYAC_ANAHTAR (Production) değerini görün/kopyalayın.
  2) arac/sayac-anahtar-esle.sh --ayarla   → değeri gizli girin.
  3) Betik canlı 200 doğrularsa panel ( /yonetim/api-loglari/ ) veri gösterir.
  NOT: Env değişkeni değişikliği Pages'te YENİ DAĞITIM ister; betik 401/405
  derse son dağıtımı bekleyin ya da bir push ile yeniden dağıtın.
NOT
    ;;
  *) echo "kullanım: $0 [--kontrol|--ayarla]"; exit 2 ;;
esac
