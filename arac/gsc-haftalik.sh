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
#
# K1/K2 ONARIMI (26.08.2026, 8. seans — 26.08 doğrulama raporundaki
# kusurlar):
#  K1 — Çıkış satırı ARTIK SON SATIRDAKİ echo DEĞİL. Kök neden: son
#       satırdaki echo, set -euo pipefail altında betik erken düşerse
#       HİÇ ÇALIŞMAZ; o yüzden "koştu mu, hangi çıkışla?" sorusu log'dan
#       cevaplanamıyordu. Çözüm: `trap cikis_kaydi EXIT` — başarı, hata
#       ve sinyal (TERM/INT/HUP → exit çağrısı → EXIT trap) üç durumda da
#       tek satır YAZILMASI GARANTİ. Biçim:
#         <ISO-8601 UTC> gsc-haftalik ÇIKIŞ · exit=<kod> · dosya=<yol> · bayt=<n>
#       Dosya üretilmemişse dosya/bayt alanları "-" olur, satır yine yazılır.
#  K2 — TEK log dosyası kaldı. Cron satırındaki `>>` KALDIRILDI ve
#       gsc-haftalik-cron.log SİLİNDİ (iki satırı bu log'a taşındı).
#       Cron'da (TTY yok) stdout+stderr bu log'a yönlendirilir — bash'in
#       kendi hata mesajları dahil hiçbir şey kaybolmaz, cron mail'i
#       üretilmez. Döndürme ARTIK ARŞİVLİ: eski veri `tail -c` ile
#       KIRPILIP ATILMIYOR, .1...5 arşivine taşınıyor; en fazla 5 arşiv,
#       6.'sı silinir (sınırsız arşiv = K2'nin bir seviye yukarısı).
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
ARSIV_TAVAN=5               # en fazla 5 arşiv (.1...5); 6.'sı SİLİNİR

mkdir -p "$(dirname "$LOG")" "$CIKTI_DIZIN"
logla() { echo "$(date -u +%FT%TZ) gsc-haftalik: $*" >> "$LOG"; }

# ── Log döndürme: ARŞİVLİ, SINIRLI ──────────────────────────────────
# Tavanı aşarsa log .1'e taşınır, eski arşivler bir numara kayar,
# ARSIV_TAVAN'ı aşan en eski arşiv SİLİNİR. ÖLÇÜLDÜ (5d, 26.08.2026):
# arşiv, döndürme ANINDAKİ boyutu dondurur — yani tavanı AŞABİLİR (bir
# koşum tavanı geçtikten sonra ne yazdıysa o da arşive girer). Sınamada
# arşivler 726 KB oldu. Üst sınır bu yüzden "6 × 512 KB" değil,
# "6 × (512 KB + bir koşumun yazdığı miktar)"tır; haftalık koşum ~250
# bayt yazdığı için pratikte ~3 MB, ama garanti edilen tek şey SAYININ
# sınırlı olmasıdır (1 log + en fazla 5 arşiv).
# Eski `tail -c` yaklaşımı verinin ilk yarısını KALICI ATIYORDU — bu
# döndürme hiçbir satırı atmaz, yalnız en eski arşivi düşürür.
# exec yönlendirmesinden ÖNCE koşar: sonra koşsaydı mv, exec'in açtığı
# fd'yi eski inode'a bağlı bırakır ve o koşumun satırları kaybolurdu.
if [ -f "$LOG" ] && [ "$(stat -c %s "$LOG")" -gt "$LOG_TAVAN" ]; then
  ESKI_BOYUT=$(stat -c %s "$LOG")
  if [ -f "$LOG.$ARSIV_TAVAN" ]; then rm -f "$LOG.$ARSIV_TAVAN"; fi
  i=$((ARSIV_TAVAN - 1))
  while [ "$i" -ge 1 ]; do
    if [ -f "$LOG.$i" ]; then mv "$LOG.$i" "$LOG.$((i + 1))"; fi
    i=$((i - 1))
  done
  mv "$LOG" "$LOG.1"
  : > "$LOG"
  logla "log döndürüldü ($ESKI_BOYUT > $LOG_TAVAN bayt) → $LOG.1 · arşiv tavanı $ARSIV_TAVAN"
fi

# ── Cron'da çıktı kaderi: TEK LOG ───────────────────────────────────
# TTY yoksa (= cron) stdout+stderr bu log'a gider. Böylece crontab'da
# `>>` yönlendirmesine gerek kalmaz (ikinci, tavansız log dosyası
# doğmaz) ve cron mail'i üretilmez. TTY varsa (elle koşum) terminale
# yazar — hiçbir şey /dev/null'a gitmez.
if [ ! -t 1 ]; then exec >> "$LOG" 2>&1; fi

# ── K1: çıkış kaydı (trap) ──────────────────────────────────────────
# Betik NEREDE düşerse düşsün bu satır yazılır. CIKAN_* değerleri
# başarı yolunda doldurulur; doldurulmadan düşülürse "-" kalır.
CIKAN_DOSYA="-"
CIKAN_BOYUT="-"
cikis_kaydi() {
  local kod=$?
  logla "ÇIKIŞ · exit=$kod · dosya=$CIKAN_DOSYA · bayt=$CIKAN_BOYUT"
}
trap cikis_kaydi EXIT
# Sinyalde EXIT trap'inin koşması GARANTİ değildir; sinyali exit'e
# çevirerek garantiye alıyoruz (128+sinyal no).
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

olduc() {
  logla "HATA: $*"
  # Ekrana yalnız elle koşumda (TTY) basılır: cron'da bu satır log'a
  # ZAMAN DAMGASIZ düşerdi ve tek-log biçimini kirletirdi. Kayıt zaten
  # yukarıdaki logla + trap'in ÇIKIŞ satırıyla garanti altında.
  if [ -t 2 ]; then echo "GSC HAFTALIK HATASI: $*" >&2; fi
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
  if [ -t 1 ]; then echo "ATLANDI: başka koşum sürüyor"; fi
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
CIKAN_DOSYA="$DOSYA"
CIKAN_BOYUT="$BOYUT"
logla "bitti · $DOSYA · $BOYUT bayt"
# Aynı gerekçe: ekran çıktısı yalnız TTY'de.
if [ -t 1 ]; then echo "GSC HAFTALIK TAMAM · $DOSYA · $BOYUT bayt"; fi
