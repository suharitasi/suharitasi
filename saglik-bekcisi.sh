#!/bin/bash
# SAĞLIK BEKÇİSİ — pipeline'dan BAĞIMSIZ gözcü (günlük 07:00 UTC).
# baraj/grace scriptlerini ÇAĞIRMAZ; yalnız git log + dosya mtime okur; pipeline
# kendini denetleyemez, bu yüzden ayrı. Sessiz ölümü yakalar: cron durur / veri
# bayatlarsa UYARI-SAGLIK.md + log/pipeline.log satırı üretir, exit 1 döner.
#
# EŞİK GEREKÇELERİ (gerçek mtime kalibrasyonu, 2026-07-20 — sessiz hata denetimi):
#  - baraj "bugün" DEĞİL "son 26s": çekim 15:00 UTC, bekçi 07:00 UTC → sağlıklı
#    dosya bile ~16s eski; takvim-günü kontrolü her sabah YANLIŞ alarm verirdi.
#  - grace canlılığı grace-havza.json DEĞİL durum.json mtime: havza.json yalnız
#    GSFC yeni sürüm yayınlayınca (~aylık) değişir → 8-gün tazelik aylarca yanlış
#    alarm. durum.json HER haftalık koşuda (başarı/değişiklik-yok/hata) yeniden
#    yazılır → "cron gerçekten koştu mu" doğru sinyali.
set -euo pipefail
KOK=/home/suha/projeler/suharitasi
cd "$KOK" || exit 1
mkdir -p "$KOK/log"
LOGP="$KOK/log/pipeline.log"
UYARI="$KOK/UYARI-SAGLIK.md"
NOW=$(date -u +%s)
SORUN=""
ekle(){ SORUN="${SORUN}- $1"$'\n'; }

# (a) son commit yaşı > 26s → pipeline commit atmıyor olabilir
CTS=$(git log -1 --format=%ct 2>>"$LOGP" || echo 0)
if [ "$CTS" -eq 0 ]; then
  ekle "git log okunamadı (repo erişilemez?)"
else
  CS=$(( (NOW - CTS) / 3600 ))
  [ "$CS" -gt 26 ] && ekle "son commit ${CS} saat önce (>26s) — pipeline commit atmıyor olabilir"
fi

# (b) baraj.json tazeliği (günlük 15:00 UTC; eşik 26s — yukarıdaki gerekçe)
if [ -f data/canli/baraj.json ]; then
  BS=$(( (NOW - $(date -u -r data/canli/baraj.json +%s)) / 3600 ))
  [ "$BS" -gt 26 ] && ekle "baraj.json ${BS} saat güncellenmedi (>26s) — günlük baraj çekimi durmuş olabilir"
else
  ekle "data/canli/baraj.json YOK"
fi

# (c) grace canlılığı: durum.json her koşuda yazılır (haftalık Pzt; eşik 8 gün)
if [ -f data/arsiv/grace/durum.json ]; then
  GS=$(( (NOW - $(date -u -r data/arsiv/grace/durum.json +%s)) / 86400 ))
  [ "$GS" -gt 8 ] && ekle "GRACE cron ${GS} gündür koşmadı (durum.json bayat, >8g)"
else
  ekle "data/arsiv/grace/durum.json YOK"
fi

if [ -n "$SORUN" ]; then
  printf '# SAĞLIK BEKÇİSİ UYARISI\n\n%s\n\n%s' "$(date -u)" "$SORUN" > "$UYARI"
  printf '%s' "$SORUN" | while IFS= read -r s; do
    [ -n "$s" ] && echo "[$(date -u +%FT%TZ)] UYARI(saglik): ${s#- }" >> "$LOGP"
  done
  echo "SAĞLIK UYARISI oluştu → $UYARI"
  exit 1
fi

# sorun yok: eski uyarı dosyası varsa temizle (durum düzelmiş)
[ -f "$UYARI" ] && rm -f "$UYARI"
echo "sağlık OK (commit ${CS:-?}s, baraj ${BS:-?}s, grace ${GS:-?}g)"
exit 0
