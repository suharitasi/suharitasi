#!/usr/bin/env bash
# GSC HAFTALIK KOŞUM SARMALAYICISI (25.08.2026, 7. seans)
#
# NE YAPAR: arac/gsc-haftalik.py'yi haftada bir cron'dan koşturur; hatayı
# SESSİZ BIRAKMAZ — Telegram'a düşürür (mevcut arac/uyari-gonder.sh ile,
# yeni bir bildirim yolu YAZILMADI).
#
# ÇIKTI KADERİ (3e kararı): çıktı depo DIŞINA, /home/suha/gsc-cikti/
# altına yazılır. Gerekçe: bu rapor sitede yayımlanmaz, yalnız teşhis/
# izleme içindir. Böylece git ağacı hiç kirlenmez — 18-24.08 arasında 41
# commit'i tıkayan "depo içine yaz, ne yok say ne commit et" tuzağı
# tekrarlanamaz. Depoya HİÇBİR ŞEY yazılmaz, commit ATILMAZ.
#
# Sessiz hata yasağı (CLAUDE.md):
#  - set -euo pipefail
#  - 2>/dev/null YOK (tek bir tane bile); tüm stderr log'a gider
#  - tüm yollar MUTLAK
#  - flock ile tek-örnek kilidi (üst üste binme yasak)
#  - log mutlak yola, boyut sınırıyla döndürülür
#  - başarı ölçütü = ÇIKTI DOSYASININ VARLIĞI, komutun exit kodu değil
set -euo pipefail

KOK="/home/suha/projeler/suharitasi"
BETIK="$KOK/arac/gsc-haftalik.py"
UYARICI="$KOK/arac/uyari-gonder.sh"
PY="/home/suha/araclar/google-seo-mcp/venv/bin/python3"
ANAHTAR="/home/suha/gsc-anahtar.json"
CIKTI_DIZIN="/home/suha/gsc-cikti"
LOG="/home/suha/projeler/suharitasi/log/gsc-haftalik.log"
KILIT="/tmp/suharitasi-gsc-haftalik.lock"
LOG_TAVAN=$((512 * 1024))   # 512 KB

mkdir -p "$(dirname "$LOG")" "$CIKTI_DIZIN"
logla() { echo "$(date -u +%FT%TZ) gsc-haftalik: $*" >> "$LOG"; }

# Log döndürme: tavanı aşarsa son yarısı korunur (atomik değiştirme).
if [ -f "$LOG" ] && [ "$(stat -c %s "$LOG")" -gt "$LOG_TAVAN" ]; then
  tail -c $((LOG_TAVAN / 2)) "$LOG" > "$LOG.tmp"
  mv "$LOG.tmp" "$LOG"
  logla "log döndürüldü (>$LOG_TAVAN bayt)"
fi

olduc() {
  logla "HATA: $*"
  echo "GSC HAFTALIK HATASI: $*" >&2
  # Gönderim hatası çıkışı değiştirmez (uyarıcı ölse bile exit 1 kalır).
  "$UYARICI" "GSC haftalık koşumu BAŞARISIZ" "$*" || logla "UYARICI ÇAĞRISI DA BAŞARISIZ"
  exit 1
}

# ── Tek örnek kilidi ─────────────────────────────────────────────────
# -n: bekleme YOK. İkinci koşum sessizce beklemez, "atlandı" diye loglar
# ve TEMİZ çıkar (exit 0) — üst üste binme kota israfıdır, arıza değildir.
exec {KFD}>"$KILIT"
if ! flock -n "$KFD"; then
  logla "başka bir koşum sürüyor (flock) — bu koşum ATLANDI"
  echo "ATLANDI: başka koşum sürüyor"
  exit 0
fi

logla "başlıyor → $CIKTI_DIZIN"

# ── Ön kapılar (koşmadan önce ölç) ───────────────────────────────────
[ -x "$PY" ]      || olduc "python yorumlayıcısı yok/çalıştırılamaz: $PY"
[ -f "$BETIK" ]   || olduc "betik yok: $BETIK"
[ -r "$ANAHTAR" ] || olduc "GSC servis hesabı anahtarı yok/okunamıyor: $ANAHTAR"

# ── Koşum ────────────────────────────────────────────────────────────
# Çıktı ve stderr TAMAMEN log'a; hiçbir şey /dev/null'a gitmez.
CIKTI_SATIR=""
if CIKTI_SATIR=$(GOOGLE_SEO_SERVICE_ACCOUNT_FILE="$ANAHTAR" \
                 GSC_CIKTI_DIZIN="$CIKTI_DIZIN" \
                 "$PY" "$BETIK" 2>>"$LOG"); then
  logla "python çıktısı: $CIKTI_SATIR"
else
  olduc "python koşumu exit≠0 (ayrıntı yukarıdaki log satırlarında)"
fi

# ── Başarı ölçütü: DOSYA VAR MI (exit kodu yetmez) ───────────────────
DOSYA="${CIKTI_SATIR#yazıldı: }"
[ -n "$DOSYA" ] && [ "$DOSYA" != "$CIKTI_SATIR" ] \
  || olduc "beklenen 'yazıldı: <yol>' satırı gelmedi (gelen: '$CIKTI_SATIR')"
[ -f "$DOSYA" ] || olduc "çıktı dosyası diskte YOK: $DOSYA"
[ -s "$DOSYA" ] || olduc "çıktı dosyası BOŞ: $DOSYA"

BOYUT=$(stat -c %s "$DOSYA")
logla "bitti · $DOSYA · $BOYUT bayt"
echo "GSC HAFTALIK TAMAM · $DOSYA · $BOYUT bayt"
