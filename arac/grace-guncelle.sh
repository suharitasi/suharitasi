#!/bin/bash
# HENDEK FAZ 1-B — GRACE haftalık güncelleme kontrolü (Pzt 06:00 UTC).
# GSFC aylık günceller; haftalık Last-Modified kontrolü yeter. Yeni sürüm
# varsa: indir → sha256 → işle → commit+push → deploy hook (çökertmez).
# Dayanıklılık baraj pipeline'ıyla aynı: hata log'lanır, son geçerli veri
# sitede kalır, 3 ardışık hata → UYARI dosyası.
set -u
KOK=/root/projeler/suharitasi
URL="https://earth.gsfc.nasa.gov/sites/default/files/geo/gsfc.glb_.200204_202603_rl06v2.0_obp-ice6gd_halfdegree.nc"
HAM_DIZIN="$KOK/data/arsiv/grace/ham"
DURUM="$KOK/data/arsiv/grace/durum.json"
LOG="$KOK/data/arsiv/grace/log-$(date -u +%Y-%m).log"
cd "$KOK" || exit 1
mkdir -p "$HAM_DIZIN"

logla() { echo "[$(date -u +%FT%TZ)] $1" >> "$LOG"; echo "$1"; }

hata_say() {
  N=$(python3 -c "import json;print(json.load(open('$DURUM')).get('ardisikHata',0))" 2>/dev/null || echo 0)
  N=$((N + 1))
  printf '{"ardisikHata": %d}\n' "$N" > "$DURUM"
  logla "HATA ($1) — ardışık: $N"
  if [ "$N" -ge 3 ]; then
    printf '# GRACE PIPELINE UYARISI\n\n%s\n\nGRACE güncellemesi %d haftadır başarısız: %s\n' \
      "$(date -u)" "$N" "$1" > "$KOK/UYARI-GRACE.md"
    git add UYARI-GRACE.md && git commit -q -m "GRACE uyarısı (otomatik)" && git push -q
  fi
  exit 1
}

# 1) Uzak Last-Modified ile yereli karşılaştır
UZAK=$(curl -s -m 30 -I "$URL" | tr -d '\r' | grep -i '^last-modified:' | cut -d' ' -f2-)
[ -z "$UZAK" ] && hata_say "Last-Modified okunamadı (kaynak erişilemez olabilir)"
YEREL=$(cat "$HAM_DIZIN/.son-degisiklik" 2>/dev/null || echo "")
if [ "$UZAK" = "$YEREL" ]; then
  logla "değişiklik yok (kaynak: $UZAK)"
  printf '{"ardisikHata": 0}\n' > "$DURUM"
  exit 0
fi

# 2) Yeni sürümü indir (geçici ad; doğrulanmadan eskisinin yerine geçmez)
logla "yeni sürüm bulundu ($UZAK) — indiriliyor"
GECICI="$HAM_DIZIN/.indiriliyor.nc"
curl -s -m 900 -o "$GECICI" "$URL" || hata_say "indirme başarısız"
python3 - "$GECICI" << 'PY' || hata_say "indirilen dosya NetCDF olarak açılamadı"
import sys
from osgeo import gdal
gdal.UseExceptions()
ds = gdal.Open(f'NETCDF:"{sys.argv[1]}":lwe_thickness')
assert ds.RasterCount > 200
PY
mv "$GECICI" "$HAM_DIZIN/gsfc.glb_.200204_202603_rl06v2.0_obp-ice6gd_halfdegree.nc"
echo "$UZAK" > "$HAM_DIZIN/.son-degisiklik"
sha256sum "$HAM_DIZIN"/*.nc > "$KOK/data/arsiv/grace/ham-sha256.txt"

# 3) İşle → normalize seriler
python3 "$KOK/arac/grace-isle.py" || hata_say "işleme başarısız"
printf '{"ardisikHata": 0}\n' > "$DURUM"
logla "işleme tamam"

# 4) Commit + push (ham .nc gitignore'da; türetilmiş seriler + künye girer)
git add data/canli/grace-*.json data/arsiv/grace/ham-sha256.txt data/arsiv/grace/durum.json 2>/dev/null
if ! git diff --cached --quiet; then
  git commit -q -m "GRACE arşivi: $(date -u +%Y-%m-%d) güncelleme (otomatik)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
  git push -q || logla "git push BAŞARISIZ"
fi

# 5) Deploy hook — SON adım, asla çökertmez (baraj ile aynı kural)
HOOK=$(grep -E '^CF_DEPLOY_HOOK=.+' .env 2>/dev/null | cut -d= -f2-)
if [ -n "${HOOK:-}" ]; then
  HKOD=$(curl -s -m 30 -o /dev/null -w "%{http_code}" -X POST "$HOOK" 2>/dev/null) || HKOD="AG-HATASI"
  logla "deploy hook: $HKOD"
fi
exit 0
