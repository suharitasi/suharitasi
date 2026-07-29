#!/usr/bin/env bash
# NHYP PDF → METİN (29.07.2026)
#
# NEDEN AYRI SCRIPT: `arac/nhyp-cikar.py` `.txt` okur, PDF değil; dönüşüm
# 27.07 koşumunda elle yapılmış ve kayda geçmemişti. Zincirin o halkası
# yeniden üretilemez durumdaydı. Artık depoda:
#   nhyp-manifest-uret.py → nhyp-indir.sh → BU SCRIPT → nhyp-cikar.py
#
# `pdftotext -layout`: sütun düzeni korunur. Çıkarıcının bütün regex'leri
# ("^\s*(TR\d{8})\s+(.+?)\s+(İYİ|ZAYIF)...") sütun hizasına dayanır;
# -layout OLMADAN tablo satırları karışır ve çıkarım 0 kütle döndürür.
#
# Sessiz hata yasağı: set -euo pipefail · dönüştürülemeyen her dosya
# loglanır ve sayılır · hiçbir hata gizlenmez · başarı ölçütü üretilen
# .txt dosyasının VARLIĞI ve boyutu (>0), pdftotext'in exit kodu değil.
set -euo pipefail

KOK="$(cd "$(dirname "$0")/.." && pwd)"
HAM="${NHYP_HAM:-$KOK/veri/ham/nhyp}"
LOG="$HAM/metne-cevirme-log.txt"

command -v pdftotext >/dev/null || { echo "pdftotext YOK (poppler-utils gerekli)" >&2; exit 2; }
[ -d "$HAM" ] || { echo "kaynak dizin yok: $HAM" >&2; exit 2; }
: > "$LOG"

TOPLAM=0; URETILEN=0; ATLANAN=0; HATALI=0
while IFS= read -r -d '' pdf; do
  TOPLAM=$((TOPLAM+1))
  txt="${pdf%.pdf}.txt"
  if [ -s "$txt" ] && [ "$txt" -nt "$pdf" ]; then
    echo "ATLA(güncel): ${txt#$HAM/}" >> "$LOG"; ATLANAN=$((ATLANAN+1)); continue
  fi
  # || bloğu hatayı LOGLAR, gömmez. Tek dosya hatası koşumu öldürmez ama
  # sonuç satırında görünür ve exit kodunu bozar.
  if pdftotext -layout -enc UTF-8 "$pdf" "$txt" 2>>"$LOG" && [ -s "$txt" ]; then
    echo "OK: ${txt#$HAM/} ($(stat -c%s "$txt") B)" >> "$LOG"
    URETILEN=$((URETILEN+1))
  else
    echo "HATA: ${pdf#$HAM/}" | tee -a "$LOG"
    rm -f "$txt"
    HATALI=$((HATALI+1))
  fi
done < <(find "$HAM" -name '*.pdf' -print0 | sort -z)

echo "SONUÇ: pdf=$TOPLAM üretilen=$URETILEN atlanan=$ATLANAN hatalı=$HATALI"
echo "SONUÇ: pdf=$TOPLAM üretilen=$URETILEN atlanan=$ATLANAN hatalı=$HATALI" >> "$LOG"
[ "$HATALI" -eq 0 ] || exit 3
