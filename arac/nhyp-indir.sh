#!/usr/bin/env bash
# FAZ 1.1 — NHYP PDF indirici (tek seferlik keşif aracı).
# Manifest: scratchpad/nhyp-manifest.json → veri/ham/nhyp/<havza>/<dosya>
# Kurallar: G1 set -euo pipefail; hata gömme yok — başarısızlar LOG'a ve
# stdout'a yazılır, script devam eder (tek dosya hatası koşuyu öldürmez,
# ama sonuç tablosunda görünür).
set -euo pipefail
UA="suharitasi.com veri derleme"
KOK="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="${1:?kullanım: nhyp-indir.sh <manifest.json>}"
HEDEF="$KOK/veri/ham/nhyp"
LOG="$HEDEF/indirme-log.txt"
mkdir -p "$HEDEF"
: > "$LOG"

# Manifest'i ÖNCE maddileştir: process substitution (<(...)) hatası `set -e`
# altında YAYILMAZ; bozuk/eksik manifest döngüyü hiç çalıştırmaz, TOPLAM=0 ve
# HATALI=0 ile script YEŞİL dönerdi (sessiz hata yasağı ihlali).
LISTE="$(mktemp)"
trap 'rm -f "$LISTE"' EXIT
if ! python3 -c "
import json
for m in json.load(open('$MANIFEST')):
    print(m['havza'], m['dosya'], m['url'], sep='\t')
" > "$LISTE"; then
  echo "HATA: manifest okunamadı/bozuk: $MANIFEST" >&2
  exit 2
fi

TOPLAM=0; BASARILI=0; HATALI=0
while IFS=$'\t' read -r havza dosya url; do
  [ -n "$havza" ] || continue
  TOPLAM=$((TOPLAM+1))
  mkdir -p "$HEDEF/$havza"
  hedef_dosya="$HEDEF/$havza/$dosya"
  if [ -s "$hedef_dosya" ]; then
    echo "ATLA(var): $havza/$dosya" >> "$LOG"; BASARILI=$((BASARILI+1)); continue
  fi
  # -f: HTTP hatasında exit≠0; || bloğu hatayı LOGLAR, gömmez (kural: sessiz hata yasak)
  if curl -sf -A "$UA" -m 300 --retry 2 --retry-delay 3 -o "$hedef_dosya" "$url"; then
    boyut=$(stat -c%s "$hedef_dosya")
    echo "OK: $havza/$dosya ($boyut B)" >> "$LOG"
    BASARILI=$((BASARILI+1))
  else
    echo "HATA: $havza/$dosya <- $url" | tee -a "$LOG"
    rm -f "$hedef_dosya"
    HATALI=$((HATALI+1))
  fi
  sleep 1
done < "$LISTE"

echo "SONUÇ: toplam=$TOPLAM başarılı=$BASARILI hatalı=$HATALI"
echo "SONUÇ: toplam=$TOPLAM başarılı=$BASARILI hatalı=$HATALI" >> "$LOG"
# Boş manifest = sessiz yeşil koşu DEĞİL, açık arıza.
[ "$TOPLAM" -gt 0 ] || { echo "HATA: manifest boş — indirilecek kayıt yok" >&2; exit 2; }
[ "$HATALI" -eq 0 ] || exit 3
