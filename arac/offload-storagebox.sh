#!/bin/bash
# OFFLOAD-STORAGEBOX — "taşı ve sil" otomasyonu (05.10.2026, sahip talimatı).
#
# KURAL (bağlayıcı): taşıma `rsync -avc --remove-source-files` ile yapılır
# (arşiv + sağlama). Aktarım sonrası her dosyanın UZAK sha256'sı, aktarım
# ÖNCESİ alınan yerel sha256 manifestiyle karşılaştırılır; %100 eşleşme yoksa
# Telegram KRİTİK uyarısı + exit≠0. rsync kaynağı yalnız alıcı onayından
# sonra siler; ek sha256 kapısı bozuk-taşıma riskini kapatır.
#
# Yetki: root systemd servisi (offload-storagebox.service/.timer).
# Kapsam (v1; veri güvenliği için tutucu):
#   (1) /var/log/**/*.gz      — 14 günden eski sistem log arşivleri
#   (2) $KOK/log/*.log.[1-9]  — 30 günden eski depo log döndürme arşivleri
#   (3) $KOK/cikti/**         — 30 günden eski VE git'te İZLENMEYEN çıktılar
# Kapsam DIŞI (bilinçli): data/, veri/, izleme/, .git, yedek/ (restic kapsamı).
# Uzak ağaç: /home/offload/arslan-server/<mutlak-yol>  (rsync -R ile).
# Kuru koşum: --kuru (yalnız listeler; hiçbir şey taşımaz/silmez).
set -euo pipefail

KOK=/home/suha/projeler/suharitasi
UZAK_HOST="u649379@u649379.your-storagebox.de"
UZAK_KOK="/home/offload/arslan-server"
SSH_OPTS=(-p 23 -i /root/.ssh/storagebox_ed25519 -o BatchMode=yes -o ConnectTimeout=20)
SSH_K="ssh -n ${SSH_OPTS[*]}"
# NOT: rsync kanalında `-n` YASAK (stdin protokol taşır; rc=12 ile kırılır —
# 05.10 ölçümü). -n yalnız döngü içi tek-komut ssh çağrılarında kullanılır
# (ssh'ın while-read stdin'ini yemesini engeller: 05.10 doğrulama bug'ı).
JOURNAL=/var/lib/offload-storagebox/kayit.jsonl
LOG=/var/log/offload-storagebox.log
KILIT=/var/lock/offload-storagebox.lock
KURU=0
[ "${1:-}" = "--kuru" ] && KURU=1

logla() { echo "$(date -u +%FT%TZ) $*" | tee -a "$LOG"; }
uyar() { sudo -u suha "$KOK/arac/uyari-gonder.sh" "$1" "${2:-}" || true; }

exec 9>"$KILIT"
if ! flock -n 9; then logla "başka koşum sürüyor — atlandı"; exit 0; fi
mkdir -p "$(dirname "$JOURNAL")"

LISTE=$(mktemp /tmp/offload-liste.XXXXXX)      # mutlak yollar (NUL ayrık)
RS_LISTE=$(mktemp /tmp/offload-rs.XXXXXX)      # rsync için göreli yollar
MANIFEST=$(mktemp /tmp/offload-manifest.XXXXXX)
trap 'rm -f "$LISTE" "$RS_LISTE" "$MANIFEST"' EXIT

# ——— 1) Aday toplama ———
topla() { find "$@" -print0 >> "$LISTE" 2>/dev/null || true; }
topla /var/log -type f -name "*.gz" -mtime +14
if [ -d "$KOK/log" ]; then
  find "$KOK/log" -maxdepth 1 -type f -regextype posix-extended \
    -regex '.*\.log\.[0-9]+$' -mtime +30 -print0 >> "$LISTE" 2>/dev/null || true
fi
if [ -d "$KOK/cikti" ]; then
  while IFS= read -r -d '' f; do
    if ! git -C "$KOK" check-ignore -q -- "$f"; then continue; fi
    printf '%s\0' "$f" >> "$LISTE"
  done < <(find "$KOK/cikti" -type f -mtime +30 -print0 2>/dev/null || true)
fi

ADET=$(tr -cd '\0' < "$LISTE" | wc -c)
TOPLAM=$(du -cb --files0-from="$LISTE" 2>/dev/null | tail -1 | cut -f1 || echo 0)
logla "aday: $ADET dosya · $(numfmt --to=iec "${TOPLAM:-0}")"

if [ "$ADET" -eq 0 ]; then logla "taşınacak dosya yok"; exit 0; fi
if [ "$KURU" -eq 1 ]; then
  head -c 20000 "$LISTE" | tr '\0' '\n' | head -20
  logla "[kuru] hiçbir dosya taşınmadı"; exit 0
fi

# ——— 2) Manifest (yerel sha256; NUL ayrık) + rsync göreli liste ———
while IFS= read -r -d '' f; do
  sha256sum -z -- "$f" >> "$MANIFEST"
  printf '%s\0' "${f#/}" >> "$RS_LISTE"
done < "$LISTE"

# ——— 3) Taşı (rsync -avc --remove-source-files; --files-from -R'yi getirir) ———
$SSH_K "$UZAK_HOST" "mkdir -p $UZAK_KOK" >/dev/null 2>&1 || true
RSYNC_HATA=0
rsync -avc --remove-source-files --from0 --files-from="$RS_LISTE" \
  --timeout=600 --stats -e "ssh ${SSH_OPTS[*]}" / "$UZAK_HOST:$UZAK_KOK/" \
  >>"$LOG" 2>&1 || RSYNC_HATA=$?
if [ "$RSYNC_HATA" -ne 0 ]; then
  logla "rsync HATA (rc=$RSYNC_HATA) — taşıma kısmi olabilir"
fi

# ——— 4) Uzak sha256 doğrulaması (asıl kapı) ———
UYUSMAZ=0; DOGRU=0
while IFS= read -r -d '' satir; do
  h="${satir:0:64}"; y="${satir:66}"
  uzak_yol="$UZAK_KOK$y"
  uzak_h=$($SSH_K "$UZAK_HOST" sha256sum "$uzak_yol" 2>/dev/null | awk '{print $1}')
  if [ "$uzak_h" = "$h" ]; then
    DOGRU=$((DOGRU + 1))
    printf '{"t":"%s","yol":"%s","sha256":"%s","sonuc":"dogrulandi"}\n' \
      "$(date -u +%FT%TZ)" "$y" "$h" >> "$JOURNAL"
  else
    UYUSMAZ=$((UYUSMAZ + 1))
    logla "KANIT UYUŞMADI: $y (yerel=${h:0:12} uzak=${uzak_h:0:12})"
    printf '{"t":"%s","yol":"%s","sha256_yerel":"%s","sha256_uzak":"%s","sonuc":"uyusmadi"}\n' \
      "$(date -u +%FT%TZ)" "$y" "$h" "$uzak_h" >> "$JOURNAL"
  fi
done < "$MANIFEST"

logla "doğrulanan: $DOGRU · uyuşmayan: $UYUSMAZ · rsync_rc=$RSYNC_HATA"
if [ "$UYUSMAZ" -gt 0 ] || [ "$RSYNC_HATA" -ne 0 ]; then
  uyar "Offload doğrulama SORUNU: $UYUSMAZ uyuşmayan / rsync rc=$RSYNC_HATA" "Log: $LOG · kayıt: $JOURNAL"
  exit 1
fi
logla "offload tamam — $DOGRU dosya taşındı ve sha256 ile doğrulandı"
exit 0
