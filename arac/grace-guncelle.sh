#!/bin/bash
# HENDEK FAZ 1-B — GRACE haftalık güncelleme kontrolü (Pzt 06:00 UTC).
# GSFC aylık günceller; haftalık Last-Modified kontrolü yeter. Yeni sürüm
# varsa: indir → sha256 → işle → commit+push → deploy hook (çökertmez).
# Dayanıklılık baraj pipeline'ıyla aynı: hata log'lanır, son geçerli veri
# sitede kalır, 3 ardışık hata → UYARI dosyası.
#
# SESSİZ HATA YASAĞI (2026-07-20): set -euo pipefail; git add ... 2>/dev/null
# (eski bug ikizi) KALDIRILDI; git add koşullu; sayaç sıfırlama commit
# teyidinden SONRA; başarı git log ile ölçülür.
set -euo pipefail
KOK=/home/suha/projeler/suharitasi

# ORTAK GIT KİLİDİ (2026-07-23): 4 otomatik commit'çi aynı depoya yazıyor;
# eşzamanlı commit/push çakışmasın diye tek flock kullanılır (arac/git-kilit.sh).
. "$KOK/arac/git-kilit.sh"
URL="https://earth.gsfc.nasa.gov/sites/default/files/geo/gsfc.glb_.200204_202603_rl06v2.0_obp-ice6gd_halfdegree.nc"
HAM_DIZIN="$KOK/data/arsiv/grace/ham"
DURUM="$KOK/data/arsiv/grace/durum.json"
LOG="$KOK/data/arsiv/grace/log-$(date -u +%Y-%m).log"
LOGP="$KOK/log/pipeline.log"
cd "$KOK" || exit 1
mkdir -p "$HAM_DIZIN" "$KOK/log"

logla() { echo "[$(date -u +%FT%TZ)] $1" >> "$LOG"; echo "$1"; }

hata_say() {
  # durum.json okunamazsa (bozuk/yok) 0'dan say; traceback pipeline.log'a
  # (eskiden 2>/dev/null yutuyordu → bozulma görünmüyordu).
  N=$(python3 -c "import json;print(json.load(open('$DURUM')).get('ardisikHata',0))" 2>>"$LOGP" || echo 0)
  N=$((N + 1))
  printf '{"ardisikHata": %d}\n' "$N" > "$DURUM"
  logla "HATA ($1) — ardışık: $N"
  if [ "$N" -ge 3 ]; then
    printf '# GRACE PIPELINE UYARISI\n\n%s\n\nGRACE güncellemesi %d haftadır başarısız: %s\n' \
      "$(date -u)" "$N" "$1" > "$KOK/UYARI-GRACE.md"
    # uyarı push'u kopsa bile UYARI dosyası yerelde durur; zincir hatası yutulmaz.
    git add UYARI-GRACE.md \
      && git commit -q -m "GRACE uyarısı (otomatik)" \
      && { git push -q || logla "uyarı push BAŞARISIZ (yerelde)"; } \
      || logla "uyarı commit/push zinciri tamamlanamadı"
  fi
  exit 1
}

# 1) Uzak Last-Modified ile yereli karşılaştır.
# || true: pipefail altında grep eşleşmezse (last-modified yok) boru hattı
# scripti DURDURMASIN — boş UZAK bir alt satırda hata_say ile ele alınır.
UZAK=$(curl -s -m 30 -I "$URL" | tr -d '\r' | grep -i '^last-modified:' | cut -d' ' -f2- || true)
[ -z "$UZAK" ] && hata_say "Last-Modified okunamadı (kaynak erişilemez olabilir)"
YEREL=""
[ -f "$HAM_DIZIN/.son-degisiklik" ] && YEREL=$(cat "$HAM_DIZIN/.son-degisiklik")
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
mv "$GECICI" "$HAM_DIZIN/gsfc.glb_.200204_202603_rl06v2.0_obp-ice6gd_halfdegree.nc" \
  || hata_say "mv başarısız (indirilen dosya yerine konamadı)"
echo "$UZAK" > "$HAM_DIZIN/.son-degisiklik" || hata_say ".son-degisiklik yazılamadı"
sha256sum "$HAM_DIZIN"/*.nc > "$KOK/data/arsiv/grace/ham-sha256.txt" \
  || hata_say "sha256 üretilemedi"

# 3) İşle → normalize seriler
python3 "$KOK/arac/grace-isle.py" || hata_say "işleme başarısız"
logla "işleme tamam"

# 4) Commit + push (ham .nc gitignore'da; türetilmiş seriler + künye girer).
# git add KOŞULLU + 2>/dev/null KALDIRILDI (eski bug ikizi). Başarı commit
# teyidiyle ölçülür; sayaç ancak commit doğrulanınca sıfırlanır (aşağıda).
[ -f data/arsiv/grace/ham-sha256.txt ] && git add data/arsiv/grace/ham-sha256.txt
[ -f data/arsiv/grace/durum.json ]     && git add data/arsiv/grace/durum.json
for f in data/canli/grace-turkiye.json data/canli/grace-havza.json; do
  [ -f "$f" ] && git add "$f"
done

if ! git diff --cached --quiet; then
  # ORTAK GIT KİLİDİ (2026-07-23): kilit alınamazsa İŞ ERTELENİR — dosyalar
  # diskte durur, sonraki koşuda commit edilir (sessiz kayıp yasak).
  if ! git_kilit_al "grace"; then
    logla "git kilidi 10 dk'da alınamadı — commit ERTELENDİ"
    exit 4
  fi
  # K1 (2026-07-25, bulgu F4-2): commit pull'DAN ÖNCE. Eski sıra (pull → commit)
  # rebase koptuğunda veriyi commit'siz bırakıyordu; artık veri önce kayda geçer,
  # pull ancak ondan sonra denenir, push yalnız pull başarılıysa yapılır.
  ONCE=$(git rev-parse HEAD)
  git commit -q -m "GRACE arşivi: $(date -u +%Y-%m-%d) güncelleme (otomatik)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" \
    || hata_say "git commit başarısız"
  SONRA=$(git rev-parse HEAD)
  [ "$ONCE" = "$SONRA" ] && hata_say "commit atlandı: HEAD değişmedi"
  if git_pull_rebase; then
    git push -q || logla "git push BAŞARISIZ (commit yerelde, sonraki koşuda denenir)"
  else
    # Ayırt edici log: "kirli ağaç" ile "rebase çatışması" farklı arızalardır.
    if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
      logla "pull ertelendi: çalışma ağacı kirli - commit yerelde, sonraki koşuda denenir"
      logla "kirli dosyalar: $(git status --porcelain --untracked-files=no | head -5 | tr '\n' ' ')"
    else
      logla "pull --rebase çatışması - commit yerelde, sonraki koşuda denenir"
    fi
  fi
  # Bekleyen-commit sayacı: çatışma kronikleşirse commit'ler sessizce birikmesin.
  if git rev-parse --abbrev-ref --symbolic-full-name @{u} > /dev/null; then
    BEKLEYEN=$(git rev-list --count @{u}..HEAD)
    if [ "$BEKLEYEN" -gt 5 ]; then
      logla "UYARI: $BEKLEYEN commit push edilmemiş - sürekli çatışma olabilir"
    fi
  else
    logla "UYARI: upstream tanımlı değil, bekleyen commit sayılamadı"
  fi
  git_kilit_birak
fi

# 5) Sayaç sıfırlama — commit teyidinden SONRA (Faz 0 bulgusu): commit
# koparsa hata_say zaten sayacı artırıp çıkmıştır; buraya ancak arşiv
# doğrulanınca gelinir, o yüzden sıfırlama güvenli.
printf '{"ardisikHata": 0}\n' > "$DURUM"
logla "arşiv doğrulandı, sayaç sıfırlandı"

# 6) Deploy hook — SON adım, asla çökertmez (baraj ile aynı kural)
HOOK=""
if [ -f .env ]; then
  HOOK=$(grep -E '^CF_DEPLOY_HOOK=.+' .env | cut -d= -f2- || true)
fi
if [ -n "${HOOK:-}" ]; then
  HKOD=$(curl -s -m 30 -o /dev/null -w "%{http_code}" -X POST "$HOOK" 2>>"$LOGP") || HKOD="AG-HATASI"
  logla "deploy hook: $HKOD"
fi
exit 0
