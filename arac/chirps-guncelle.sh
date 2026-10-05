#!/bin/bash
# CHIRPS AYLIK TAZELEME (P3, 05.10.2026) — cari yıl önbelleğini yeniler,
# veriyi çeker, tazelik kapısından geçirir ve veri dosyasını commit eder.
# Cron: ayın 5'i 04:40 UTC. (K3 kök onarımı: hat 3 aydır zamanlanmamıştı.)
set -euo pipefail
KOK=/home/suha/projeler/suharitasi
cd "$KOK" || exit 1
mkdir -p "$KOK/log"
. "$KOK/arac/cikis-kaydi.sh"
cikis_kaydi_kur "chirps" "$KOK/log/chirps-cron.log"
cikis_kaydi_tek_log
. "$KOK/arac/git-kilit.sh"
uyar() { "$KOK/arac/uyari-gonder.sh" "$1" "${2:-}" || true; }

YIL=$(date -u +%Y)
rm -f "$KOK/data/arsiv/chirps/chirps-v2.0.$YIL.days_p25.nc"
KOD=0
"$KOK/.venv/bin/python" "$KOK/arac/chirps-cek.py" || KOD=$?
if [ "$KOD" -ne 0 ]; then
  uyar "CHIRPS çekimi hata verdi (exit $KOD)" "Log: log/chirps-cron.log"
fi

# Tazelik kapısı: son ay, içinde bulunduğumuz aydan en az 2 ay geride
# OLMAMALI (CHIRPS yayın gecikmesi ~2-3 hafta). Aksi hâlde UYARI + exit≠0.
SON=$("$KOK/.venv/bin/python" -c "import json;d=json.load(open('$KOK/data/canli/chirps.json'));print(sorted(list(d['havzalar'].values())[0]['aylik'])[-1])")
BEKLENEN=$(date -u -d "-2 month" +%Y-%m)
echo "son ay: $SON · beklenen en az: $BEKLENEN"
if [[ "$SON" < "$BEKLENEN" ]]; then
  uyar "CHIRPS verisi bayat: son ay $SON (< $BEKLENEN)" "Kaynak gecikmesi olabilir; log: log/chirps-cron.log"
  exit 1
fi

# Commit yalnız değişiklik varsa (mevzuat-radar deseni; commit teyidi zorunlu).
if git status --porcelain -- data/canli/chirps.json | grep -q .; then
  git add -- data/canli/chirps.json || { echo "git add BAŞARISIZ" >&2; exit 1; }
  if ! git_kilit_al "chirps"; then
    echo "[$(date -u +%FT%TZ)] git kilidi alınamadı — commit ERTELENDİ" >&2
    exit 4
  fi
  ONCE=$(git rev-parse HEAD)
  git commit -q -m "CHIRPS tazeleme: $(date -u +%FT%TZ) aylık yağış verisi (otomatik)" \
    || { echo "git commit BAŞARISIZ" >&2; exit 1; }
  SONRA=$(git rev-parse HEAD)
  [ "$ONCE" = "$SONRA" ] && { echo "commit atlandı: HEAD değişmedi" >&2; exit 1; }
  if git_pull_rebase; then
    git push -q || { echo "git push BAŞARISIZ (commit yerelde)" >&2; git_kilit_birak; uyar "CHIRPS push ARIZASI" "commit yerelde"; exit 1; }
  else
    echo "pull/push ertelendi (rebase/kirli ağaç)" >&2
    git_kilit_birak
    uyar "CHIRPS pull/push ertelendi" "commit yerelde"
    exit 1
  fi
  git_kilit_birak
else
  echo "chirps.json değişmedi — commit yok"
fi
exit "$KOD"
