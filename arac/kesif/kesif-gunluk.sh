#!/bin/bash
# Kaynak keşif/validasyon günlük hattı — arac/kesif/kesif-motoru.py sarmalayıcısı.
# Denetim (geriye dönük eksik) + keşif (canlılık/biçim/şema/rate-limit yoklaması)
# koşar; yalnız kendi ürünlerini commit eder, pull/push, başarıda deploy hook.
# Sessiz hata yasağı: her aşama izole, exit kodu ve push durumu Telegram'a düşer.
set -euo pipefail
KOK=/home/suha/projeler/suharitasi
cd "$KOK" || exit 1
KESIF="$KOK/izleme/kesif"
LOG="$KESIF/log/kesif.log"
mkdir -p "$KESIF/log" "$KESIF/state"

. "$KOK/arac/cikis-kaydi.sh"
cikis_kaydi_kur "kesif" "$LOG"
cikis_kaydi_tek_log
. "$KOK/arac/git-kilit.sh"

uyar() { "$KOK/arac/uyari-gonder.sh" "$1" "${2:-}" || true; }

PY=$(command -v python3) || { echo "python3 yok — keşif çalışamaz" >&2; exit 1; }

KOD=0
timeout 600 "$PY" "$KOK/arac/kesif/kesif-motoru.py" denetim || KOD=$?
timeout 600 "$PY" "$KOK/arac/kesif/kesif-motoru.py" kos || KOD=$?

if [ "$KOD" -ne 0 ]; then
  uyar "kaynak keşif: koşum hata verdi (exit $KOD)" "Log: izleme/kesif/log/kesif.log · DURUM: izleme/kesif/DURUM.md"
fi

if [ -f "$KESIF/DURUM.md" ]; then
  cikis_kaydi_dosya "$KESIF/DURUM.md" "$(stat -c %s "$KESIF/DURUM.md")"
fi

# CODE-FREEZE uyumu: YALNIZ operasyonel veri/rapor ürünleri commit edilir.
# Motor KAYNAK KODU (arac/kesif/*.py|sh, arac/test/*) bu pencere boyunca
# main'e gönderilmez; diskte çalışır, gecelik yedek (arac/ tarballı) korur.
# Freeze kalkınca SIRADAKILER.md'deki kalemle kod da commit edilir.
for f in \
  "$KESIF/kaynak-kaynagi.json" "$KESIF/aday-kaynaklar.json" \
  "$KESIF/DURUM.md" "$KESIF/OLAYLAR.md" \
  "$KESIF/eksik-denetim.json" "$KESIF/EKSIK-RAPOR.md"; do
  if [ -f "$f" ]; then
    git add -- "$f" || { echo "[$(date -u +%FT%TZ)] git add BAŞARISIZ: $f" >> "$LOG"; exit 1; }
  fi
done

PUSH_HATA=0
if ! git diff --cached --quiet; then
  if ! git_kilit_al "kesif"; then
    echo "[$(date -u +%FT%TZ)] git kilidi alınamadı — commit ERTELENDİ" >> "$LOG"
    uyar "kaynak keşif: git kilidi alınamadı" "Commit ertelendi; çıktılar diskte, sonraki koşuda denenir."
    exit 4
  fi
  ONCE=$(git rev-parse HEAD)
  git commit -q -m "Kaynak keşif: $(date -u +%FT%TZ) (otomatik)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" \
    || { echo "[$(date -u +%FT%TZ)] git commit BAŞARISIZ" >> "$LOG"; exit 1; }
  SONRA=$(git rev-parse HEAD)
  [ "$ONCE" = "$SONRA" ] && { echo "[$(date -u +%FT%TZ)] commit atlandı: HEAD değişmedi" >> "$LOG"; exit 1; }
  if git_pull_rebase; then
    if ! git push -q; then
      echo "[$(date -u +%FT%TZ)] git push BAŞARISIZ (commit yerelde)" >> "$LOG"
      PUSH_HATA=1
    fi
  else
    echo "[$(date -u +%FT%TZ)] pull/push ertelendi: rebase çatışması veya kirli ağaç" >> "$LOG"
    PUSH_HATA=1
  fi
  if git rev-parse --abbrev-ref --symbolic-full-name @{u} > /dev/null 2>&1; then
    BEKLEYEN=$(git rev-list --count @{u}..HEAD)
    [ "$BEKLEYEN" -gt 5 ] && echo "[$(date -u +%FT%TZ)] UYARI: $BEKLEYEN commit push edilmemiş" >> "$LOG"
  fi
  git_kilit_birak

  if [ "$PUSH_HATA" -eq 0 ]; then
    HOOK=""
    [ -f .env ] && HOOK=$(grep -E '^CF_DEPLOY_HOOK=.+' .env | cut -d= -f2- || true)
    if [ -n "${HOOK:-}" ]; then
      HKOD=$(curl -s -m 30 -o /dev/null -w "%{http_code}" -X POST "$HOOK" 2>>"$LOG") || HKOD="AG-HATASI"
      echo "[$(date -u +%FT%TZ)] deploy hook: $HKOD" >> "$LOG"
    fi
  fi
fi

if [ "$PUSH_HATA" -eq 1 ]; then
  uyar "kaynak keşif: pull/push ARIZASI — commit yerelde" "Log: izleme/kesif/log/kesif.log"
  exit 1
fi
exit "$KOD"
