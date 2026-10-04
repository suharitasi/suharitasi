#!/bin/bash
# Mevzuat radarı sarmalayıcısı. SORUN (2026-10-04 bulgusu): cron doğrudan
# arac/mevzuat-radar.py'yi çağırıyordu; betik data/kamu/mevzuat-*.json'u
# yazıyor ama HİÇBİR hat commit etmiyordu (hatlar yalnız kendi açık dosya
# listesini add eder). Sonuç: madde değişiklikleri 30.09'dan beri disk'te
# yazılı ama origin'e/siteye gitmiyordu — gözden kaçan veri. Bu sarmalayıcı
# yalnız bu iki veri dosyasını commit eder (baraj/su-izleme deseni).
set -euo pipefail
KOK=/home/suha/projeler/suharitasi
cd "$KOK" || exit 1
mkdir -p "$KOK/log"
. "$KOK/arac/cikis-kaydi.sh"
cikis_kaydi_kur "mevzuat-radar" "$KOK/log/mevzuat-radar.log"
cikis_kaydi_tek_log
. "$KOK/arac/git-kilit.sh"
uyar() { "$KOK/arac/uyari-gonder.sh" "$1" "${2:-}" || true; }

KOD=0
python3 "$KOK/arac/mevzuat-radar.py" || KOD=$?
[ "$KOD" -ne 0 ] && uyar "mevzuat radarı: koşum hata verdi (exit $KOD)" "Log: log/mevzuat-radar.log"

for f in data/kamu/mevzuat-surum.json data/kamu/mevzuat-degisiklik.json; do
  [ -f "$f" ] && git add -- "$f" || true
done

PUSH_HATA=0
if ! git diff --cached --quiet; then
  if ! git_kilit_al "mevzuat-radar"; then
    echo "[$(date -u +%FT%TZ)] git kilidi alınamadı — commit ERTELENDİ" >&2
    exit 4
  fi
  git commit -q -m "Mevzuat radarı: $(date -u +%FT%TZ) günlük madde farkı (otomatik)" \
    || { echo "[$(date -u +%FT%TZ)] git commit BAŞARISIZ" >&2; exit 1; }
  if git_pull_rebase; then
    git push -q || { echo "[$(date -u +%FT%TZ)] git push BAŞARISIZ (commit yerelde)" >&2; PUSH_HATA=1; }
  else
    echo "[$(date -u +%FT%TZ)] pull/push ertelendi (rebase/kirli ağaç)" >&2
    PUSH_HATA=1
  fi
  git_kilit_birak
fi

[ "$PUSH_HATA" -eq 1 ] && { uyar "mevzuat radarı: pull/push ARIZASI — commit yerelde" "Log: log/mevzuat-radar.log"; exit 1; }
exit "$KOD"
