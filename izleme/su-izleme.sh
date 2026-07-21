#!/bin/bash
# SU KANUNU İZLEME — günde 2x (05:30 + 16:00 UTC). 3 modül:
#   M1 RG GÜNLÜK (deterministik, fark motoru YOK) — fihrist + mükerrer yoklama
#   M2 TBMM  (fark motoru) — hedefler.conf K1 satırları
#   M3 BAKANLIK/DSİ (fark motoru) — hedefler.conf K4 satırları
# Her yakalanan değişiklik tarihli arşive girer (first-mover değeri).
#
# DİSİPLİN (sessiz hata yasağı, 2026-07-20 kuralları):
#  - set -euo pipefail; kör set -e ile hata yutma YOK; tolerans tek tek if/|| ile.
#  - 2>/dev/null YOK; gizlenen çıktı log/pipeline.log'a gider.
#  - git add KOŞULLU; başarı = commit teyidi (ONCE/SONRA rev-parse), HTTP değil.
#  - Bir hedefin hatası diğerlerini DURDURMAZ (izole; DURUM.md'ye 🔴).
set -euo pipefail
KOK=/home/suha/projeler/suharitasi
cd "$KOK" || exit 1

IZ="$KOK/izleme"
LOGP="$KOK/log/pipeline.log"
mkdir -p "$KOK/log" "$IZ/arsiv" "$IZ/state" "$IZ/log"
HLOG="$IZ/log/hata.log"          # per-hedef hata detayı
KW="$IZ/anahtar-kelimeler.txt"
CONF="$IZ/hedefler.conf"
MOTOR="$IZ/lib/motor.py"
UA="Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"
RUN_UTC=$(date -u +%Y-%m-%dT%H-%M-%SZ)
BUGUN=$(date -u +%Y-%m-%d)
LAST_EFF=""   # http_get yan etkisi: son etkin URL (yönlendirme tespiti)

# --- toplayıcılar (geçici; DURUM.md render için) ---
STATUSF=$(mktemp) ; EVENTF=$(mktemp)
trap 'rm -f "$STATUSF" "$EVENTF"' EXIT
OLAY_SAYAC=0 ; HATA_SAYAC=0

logla(){ echo "[$(date -u +%FT%TZ)] $1" >> "$LOGP"; }
durum_satir(){ printf '%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$4" >> "$STATUSF"; }  # id kat durum not
olay_ekle(){  # $1 hedef  $2 açıklama
  printf -- '- %s | %s | %s\n' "$RUN_UTC" "$1" "$2" >> "$EVENTF"
  OLAY_SAYAC=$((OLAY_SAYAC+1))
}

# HTTP GET: $1 url $2 outfile -> stdout=http_code; dönüş 0=curl koştu, 1=ağ hatası.
# Yan etki: LAST_EFF = son etkin URL (yönlendirme sonrası) — RG mükerrer/beklemede
# tespiti için (mükerrer yoksa server '/' ana sayfaya yönlendirir).
# İç retry: ağ hatası / 5xx'te bir kez, 5 sn sonra.
http_get(){
  local url="$1" out="$2" res code
  res=$(curl -sSL --compressed --max-time 45 -A "$UA" -o "$out" \
        -w '%{http_code}|%{url_effective}' "$url" 2>>"$LOGP") || res="AG|"
  code="${res%%|*}"; LAST_EFF="${res#*|}"
  if [ "$code" = "AG" ] || [ "${code:0:1}" = "5" ]; then
    sleep 5
    res=$(curl -sSL --compressed --max-time 45 -A "$UA" -o "$out" \
          -w '%{http_code}|%{url_effective}' "$url" 2>>"$LOGP") || res="AG|"
    code="${res%%|*}"; LAST_EFF="${res#*|}"
  fi
  echo "$code"
  [ "$code" = "AG" ] && return 1 || return 0
}

# HTTP HEAD Last-Modified: $1 url -> stdout "code|lastmod"
http_head(){
  local url="$1" hdr code lm
  hdr=$(curl -sSIL --max-time 45 -A "$UA" "$url" 2>>"$LOGP") || { echo "AG|"; return 1; }
  code=$(printf '%s' "$hdr" | grep -iE '^HTTP/' | tail -1 | grep -oE '[0-9]{3}' | head -1)
  lm=$(printf '%s'   "$hdr" | grep -i   '^last-modified:' | tail -1 | cut -d: -f2- | sed 's/^ *//; s/[[:space:]]*$//')
  echo "${code:-BOS}|${lm:-}"
}

sha(){ sha256sum "$1" | cut -d' ' -f1; }

# ============================ M1 — RG GÜNLÜK ============================
m1_rg(){
  local adir="$IZ/arsiv/rg/$BUGUN"
  mkdir -p "$adir"
  local base="https://www.resmigazete.gov.tr/fihrist?tarih=$BUGUN"
  local yayin=0 kanun_ozet="" olay_bu=0

  cek_bir(){  # $1 url  $2 etiket(ana/mukerrer-1..) -> 0=yayınlandı(madde>0) 1=boş/yok 2=hata
    local url="$1" et="$2"
    local ham="$adir/fihrist-$et-ham.html"
    local code madde rgout
    code=$(http_get "$url" "$ham") || true
    if [ "$code" = "AG" ]; then
      logla "M1 RG $et: ağ hatası ($url)"; return 2
    fi
    if [ "$code" = "404" ]; then rm -f "$ham"; return 1; fi
    if [ "$code" != "200" ]; then
      logla "M1 RG $et: beklenm/dık HTTP $code ($url)"; return 2
    fi
    # 200 ama fihrist DEĞİL: mükerrer yoksa / gün henüz yayınlanmadıysa server
    # ana sayfaya ('/') yönlendirir. url_effective 'fihrist' içermiyorsa geçersiz
    # → beklemede/dur (homepage'i fihrist sanıp ayıklamaya SOKMA).
    case "$LAST_EFF" in
      *fihrist*) : ;;
      *) logla "M1 RG $et: fihrist değil, '$LAST_EFF' yönlendirmesi → beklemede/dur"
         rm -f "$ham"; return 1 ;;
    esac
    # 200: madde var mı? motor.py ile analiz + keyword
    rgout=$("$PY" "$MOTOR" rg "$ham" "$KW") || { logla "M1 RG $et: motor hata"; return 2; }
    "$PY" "$MOTOR" normalize "$ham" > "$adir/fihrist-$et-normalize.txt" || true
    madde=$(printf '%s' "$rgout" | sed -n 's/^Toplam madde: //p' | head -1)
    printf '%s\n' "$rgout" > "$adir/fihrist-$et-analiz.txt"
    # sayısal guard: 2>/dev/null yerine regex (sessiz hata yasağı)
    printf '%s' "$madde" | grep -qE '^[0-9]+$' || madde=0
    if [ "$madde" -eq 0 ]; then
      return 1  # 200 ama madde yok = henüz yayınlanmadı
    fi
    # yayınlandı: KANUN özetini ve OLAY'ları işle
    local kn; kn=$(printf '%s' "$rgout" | sed -n 's/^KANUN maddeleri: //p' | head -1)
    kanun_ozet="${kanun_ozet}${et}:${kn:-0}madde "
    while IFS= read -r ol; do
      [ -n "$ol" ] || continue
      olay_ekle "RG-fihrist($et)" "$ol"
      olay_bu=1
    done < <(printf '%s\n' "$rgout" | grep '^OLAY:' || true)
    return 0
  }

  # ana fihrist
  local st; if cek_bir "$base" "ana"; then st=0; else st=$?; fi
  if [ "$st" -eq 0 ]; then
    yayin=1
    # mükerrer yoklama (ardışık; ilk boş/404'te dur; üst sınır 3 → M1 toplam ≤4)
    local m
    for m in 1 2 3; do
      local ms; if cek_bir "${base}&mukerrer=$m" "mukerrer-$m"; then ms=0; else ms=$?; fi
      [ "$ms" -eq 0 ] || break
    done
  fi

  if [ "$yayin" -eq 1 ]; then
    if [ "$olay_bu" -eq 1 ]; then
      durum_satir "RG-gunluk" "M1" "✳ OLAY" "yayınlandı; kelime eşleşti ($kanun_ozet)"
    else
      durum_satir "RG-gunluk" "M1" "🟢 tamam" "yayınlandı, eşleşme yok ($kanun_ozet)"
    fi
  elif [ "$st" -eq 1 ]; then
    # 200-boş veya 404 → beklemede (NORMAL, özellikle sabah koşusu)
    durum_satir "RG-gunluk" "M1" "🟡 beklemede" "günün sayısı henüz yayınlanmadı ($BUGUN)"
  else
    durum_satir "RG-gunluk" "M1" "🔴 hata" "fihrist çekilemedi — log/pipeline.log"
    HATA_SAYAC=$((HATA_SAYAC+1))
  fi
}

# ==================== M2/M3 — FARK MOTORU (html) ====================
izle_html(){  # $1 id $2 kat $3 url
  local id="$1" kat="$2" url="$3"
  local tmp="$IZ/state/.$id.tmp.html" newtxt="$IZ/state/.$id.tmp.txt"
  local shaf="$IZ/state/$id.sha" sonf="$IZ/state/$id.son.txt"
  local code
  code=$(http_get "$url" "$tmp") || true
  if [ "$code" = "AG" ]; then
    durum_satir "$id" "$kat" "🔴 hata" "ağ hatası (retry sonrası)"; HATA_SAYAC=$((HATA_SAYAC+1))
    echo "[$RUN_UTC] $id AĞ HATASI $url" >> "$HLOG"; return 0
  fi
  if [ "$code" != "200" ]; then
    durum_satir "$id" "$kat" "🔴 hata" "HTTP $code"; HATA_SAYAC=$((HATA_SAYAC+1))
    echo "[$RUN_UTC] $id HTTP $code $url" >> "$HLOG"; return 0
  fi
  if ! "$PY" "$MOTOR" normalize "$tmp" > "$newtxt"; then
    durum_satir "$id" "$kat" "🔴 hata" "normalize başarısız"; HATA_SAYAC=$((HATA_SAYAC+1))
    echo "[$RUN_UTC] $id normalize FAIL" >> "$HLOG"; return 0
  fi
  local newh; newh=$(sha "$newtxt")
  if [ ! -f "$shaf" ]; then
    cp "$newtxt" "$sonf"; echo "$newh" > "$shaf"; rm -f "$tmp" "$newtxt"
    durum_satir "$id" "$kat" "🟢 taban" "ilk koşu — taban alındı (değişiklik sayılmaz)"
    return 0
  fi
  local oldh; oldh=$(cat "$shaf")
  if [ "$newh" = "$oldh" ]; then
    rm -f "$tmp" "$newtxt"
    durum_satir "$id" "$kat" "🟢 tamam" "değişiklik yok"
    return 0
  fi
  # DEĞİŞİKLİK → arşive ham+normalize+birleşik diff
  local adir="$IZ/arsiv/$id/$RUN_UTC"
  mkdir -p "$adir"
  cp "$tmp"    "$adir/ham.html"
  cp "$newtxt" "$adir/normalize.txt"
  { diff -u --label "onceki" --label "$RUN_UTC" "$sonf" "$newtxt" || true; } > "$adir/birlesik.diff"
  cp "$newtxt" "$sonf"; echo "$newh" > "$shaf"; rm -f "$tmp" "$newtxt"
  local dl; dl=$(grep -cE '^[+-]' "$adir/birlesik.diff" || true)
  olay_ekle "$id" "içerik değişti (~$dl satır) → arsiv/$id/$RUN_UTC/"
  durum_satir "$id" "$kat" "✳ OLAY" "içerik değişti (~$dl satır)"
}

# ==================== M3 — PDF HEAD (Last-Modified) ====================
izle_pdfhead(){  # $1 id $2 kat $3 url
  local id="$1" kat="$2" url="$3"
  local shaf="$IZ/state/$id.lastmod"
  local res code lm
  res=$(http_head "$url") || true
  code="${res%%|*}"; lm="${res#*|}"
  if [ "$code" = "AG" ] || [ "$code" = "BOS" ]; then
    durum_satir "$id" "$kat" "🔴 hata" "HEAD alınamadı ($code)"; HATA_SAYAC=$((HATA_SAYAC+1))
    echo "[$RUN_UTC] $id HEAD $code $url" >> "$HLOG"; return 0
  fi
  if [ "$code" != "200" ]; then
    durum_satir "$id" "$kat" "🔴 hata" "HTTP $code"; HATA_SAYAC=$((HATA_SAYAC+1)); return 0
  fi
  if [ ! -f "$shaf" ]; then
    printf '%s\n' "$lm" > "$shaf"
    durum_satir "$id" "$kat" "🟢 taban" "taban Last-Modified: ${lm:-yok}"
    return 0
  fi
  local old; old=$(cat "$shaf")
  if [ "$lm" = "$old" ]; then
    durum_satir "$id" "$kat" "🟢 tamam" "Last-Modified değişmedi (${lm:-yok})"
  else
    local adir="$IZ/arsiv/$id/$RUN_UTC"; mkdir -p "$adir"
    printf 'onceki: %s\nyeni  : %s\n' "$old" "$lm" > "$adir/lastmod-degisim.txt"
    printf '%s\n' "$lm" > "$shaf"
    olay_ekle "$id" "BÜYÜK OLAY: Su Kanunu Taslağı PDF güncellendi ($old → $lm)"
    durum_satir "$id" "$kat" "✳ OLAY" "PDF Last-Modified değişti → yeni taslak?"
  fi
}

# ============================ ANA AKIŞ ============================
# python yorumlayıcı
PY=$(command -v python3 || true)
[ -n "$PY" ] || { logla "python3 bulunamadı — izleme çalışamaz"; exit 1; }

logla "SU-İZLEME başladı ($RUN_UTC)"

# M1 (kendi hatasını izole eder)
m1_rg || { logla "M1 RG beklenmeyen çıkış"; durum_satir "RG-gunluk" "M1" "🔴 hata" "modül çöktü"; HATA_SAYAC=$((HATA_SAYAC+1)); }

# baş/son boşluk kırpma (xargs YOK — Türkçe apostrof/tırnak xargs'ı kırıyordu)
trim(){ local s="$1"; s="${s#"${s%%[![:space:]]*}"}"; s="${s%"${s##*[![:space:]]}"}"; printf '%s' "$s"; }

# M2/M3 — hedefler.conf sırayla; her hedef arası nezaket ≥5 sn
FIRST=1
while IFS='|' read -r id kat tip url; do
  id=$(trim "$id")
  case "$id" in ''|\#*) continue;; esac   # boş + yorum satırı atla (split ÖNCESİ trim'li id)
  kat=$(trim "$kat"); tip=$(trim "$tip"); url=$(trim "$url")
  [ "$FIRST" -eq 1 ] && FIRST=0 || sleep 5
  case "$tip" in
    html)    izle_html    "$id" "$kat" "$url" || { durum_satir "$id" "$kat" "🔴 hata" "izle_html çöktü"; HATA_SAYAC=$((HATA_SAYAC+1)); } ;;
    pdfhead) izle_pdfhead "$id" "$kat" "$url" || { durum_satir "$id" "$kat" "🔴 hata" "izle_pdfhead çöktü"; HATA_SAYAC=$((HATA_SAYAC+1)); } ;;
    *) logla "bilinmeyen tip '$tip' ($id)"; durum_satir "$id" "$kat" "🔴 hata" "bilinmeyen tip: $tip";;
  esac
done < "$CONF"

# --- OLAYLAR.md güncelle (yeni olaylar üstte, eski satırlar korunur) ---
if [ "$OLAY_SAYAC" -gt 0 ]; then
  OTMP=$(mktemp)
  { echo "# Su Kanunu İzleme — OLAYLAR (en yeni üstte)"; echo; cat "$EVENTF"; } > "$OTMP"
  [ -f "$IZ/OLAYLAR.md" ] && { grep '^- ' "$IZ/OLAYLAR.md" >> "$OTMP" || true; }
  mv "$OTMP" "$IZ/OLAYLAR.md"
fi
if [ ! -f "$IZ/OLAYLAR.md" ]; then
  { echo "# Su Kanunu İzleme — OLAYLAR (en yeni üstte)"; echo; echo "_(henüz olay yok)_"; } > "$IZ/OLAYLAR.md"
fi

# --- DURUM.md render ---
{
  echo "# Su Kanunu İzleme — DURUM"
  echo
  echo "Son koşu (UTC): **$RUN_UTC**"
  TOP=$(wc -l < "$STATUSF" | xargs)
  echo
  echo "Özet: $TOP hedef · ✳ olay: $OLAY_SAYAC · 🔴 hata: $HATA_SAYAC"
  echo
  echo "## Hedef durumları"
  echo
  echo "| Hedef | Katman | Durum | Not |"
  echo "|---|---|---|---|"
  while IFS=$'\t' read -r id kat st note; do
    echo "| $id | $kat | $st | $note |"
  done < "$STATUSF"
  echo
  echo "## Son 10 olay"
  echo
  if [ -f "$IZ/OLAYLAR.md" ]; then
    grep '^- ' "$IZ/OLAYLAR.md" | head -10 || echo "_(henüz olay yok)_"
  else
    echo "_(henüz olay yok)_"
  fi
  echo
  echo "---"
  echo "_Cron: 05:30 + 16:00 UTC · fark motoru + RG deterministik · kaynak: rapor/su-kanunu-kaynak-kesif.md (700f216)_"
} > "$IZ/DURUM.md"

logla "SU-İZLEME bitti: olay=$OLAY_SAYAC hata=$HATA_SAYAC"

# ============================ COMMIT + PUSH (baraj deseni) ============================
# git add KOŞULLU (var-olmayan yolda exit 128 + sessiz durma olmasın).
[ -d "$IZ" ] && git add "$IZ" || true

if ! git diff --cached --quiet; then
  ONCE=$(git rev-parse HEAD)
  git commit -q -m "Su izleme: $RUN_UTC (olay=$OLAY_SAYAC hata=$HATA_SAYAC) (otomatik)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" \
    || { logla "git commit BAŞARISIZ"; exit 1; }
  SONRA=$(git rev-parse HEAD)
  if [ "$ONCE" = "$SONRA" ]; then
    logla "commit atlandı: HEAD değişmedi"; exit 1
  fi
  if ! git push -q; then
    logla "git push BAŞARISIZ (commit yerelde; sonraki koşuda denenir)"
    # push koptu → sessiz hata yasağı: exit 0 dönme
    [ "$HATA_SAYAC" -gt 0 ] && exit 1 || exit 3
  fi
fi

# hedef hatası varsa exit≠0 (bekçi/log görsün) ama arşiv/DURUM yazıldı.
[ "$HATA_SAYAC" -gt 0 ] && exit 1
exit 0
