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

# ORTAK GIT KİLİDİ (2026-07-23): 4 otomatik commit'çi aynı depoya yazıyor;
# eşzamanlı commit/push çakışmasın diye tek flock kullanılır (arac/git-kilit.sh).
. "$KOK/arac/git-kilit.sh"

IZ="$KOK/izleme"
LOGP="$KOK/log/pipeline.log"
mkdir -p "$KOK/log" "$IZ/arsiv" "$IZ/state" "$IZ/log"
HLOG="$IZ/log/hata.log"          # per-hedef hata detayı

# RG ARA SERTİFİKA DEMETİ (2026-08-24): resmigazete.gov.tr 2026-08-06'dan
# beri TLS zincirinde ara sertifikayı göndermiyor (openssl: zincir=1) —
# doğrulama düşüyordu. Çözüm: sistem CA demeti + depodaki doğrulanmış ara
# sertifika (izleme/lib/rg-ara-sertifika.pem, zincir kanıtı dosya başında)
# her koşumda birleştirilir; yalnız M1/RG çekimleri bu demeti kullanır.
# Doğrulama KAPATILMAZ (-k YASAK). SU_IZLEME_RG_CA: falsifikasyon/test
# kancası — demet yolunu ezer (örn. /dev/null ile kasıtlı bozma).
RG_ARA="$IZ/lib/rg-ara-sertifika.pem"
RG_CA="${SU_IZLEME_RG_CA:-$IZ/state/.rg-ca-demeti.pem}"
if [ -z "${SU_IZLEME_RG_CA:-}" ]; then
  if [ -s "$RG_ARA" ]; then
    cat /etc/ssl/certs/ca-certificates.crt "$RG_ARA" > "$RG_CA.tmp" && mv "$RG_CA.tmp" "$RG_CA"
  else
    echo "UYARI: $RG_ARA yok — RG çekimi sistem demetiyle denenecek" >&2
    RG_CA=/etc/ssl/certs/ca-certificates.crt
  fi
fi
KW="$IZ/anahtar-kelimeler.txt"
CONF="$IZ/hedefler.conf"
MOTOR="$IZ/lib/motor.py"
UA="Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"
RUN_UTC=$(date -u +%Y-%m-%dT%H-%M-%SZ)
BUGUN=$(date -u +%Y-%m-%d)

# --rg-tarih YYYY-MM-DD (2026-08-24, RG onarım brief'i): TELAFİ KİPİ —
# yalnız M1'i verilen tarihle koşar; M2/M3 ve DURUM.md render ATLANIR
# (DURUM "son koşu"yu temsil eder, telafi etmez). OLAYLAR + arşiv + commit
# akışı çalışır. Mükerrer koruması ana akışta: o tarihin analizi zaten
# varsa hiç dokunmadan çıkılır.
RG_TARIH_KIPI=""
if [ "${1:-}" = "--rg-tarih" ]; then
  RG_TARIH_KIPI="${2:?kullanım: su-izleme.sh --rg-tarih YYYY-MM-DD}"
  printf '%s' "$RG_TARIH_KIPI" | grep -qE '^20[0-9]{2}-[0-9]{2}-[0-9]{2}$' \
    || { echo "geçersiz tarih: $RG_TARIH_KIPI" >&2; exit 2; }
  BUGUN="$RG_TARIH_KIPI"
fi

# --- toplayıcılar (geçici; DURUM.md render için) ---
STATUSF=$(mktemp) ; EVENTF=$(mktemp)
trap 'rm -f "$STATUSF" "$EVENTF"' EXIT
# ORTAK ÇIKIŞ KAYDI (K1, 26.08.2026 Faz B): bilinçli olarak yukarıdaki
# trap'ten SONRA bağlanır — yardımcı mevcut EXIT trap'ini `trap -p EXIT`
# ile okuyup ZİNCİRLER (ezmez): önce geçici dosya temizliği, sonra çıkış
# satırı koşar. Körlemesine trap eklemek temizliği kaybettirirdi
# (envanter §4 ölçümü, su-izleme bu desenin ölçüldüğü betik).
. "$KOK/arac/cikis-kaydi.sh"
cikis_kaydi_kur "su-izleme" "$IZ/log/cron.log"
OLAY_SAYAC=0 ; HATA_SAYAC=0

logla(){ echo "[$(date -u +%FT%TZ)] $1" >> "$LOGP"; }
durum_satir(){ printf '%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$4" >> "$STATUSF"; }  # id kat durum not
olay_ekle(){  # $1 hedef  $2 açıklama
  printf -- '- %s | %s | %s\n' "$RUN_UTC" "$1" "$2" >> "$EVENTF"
  OLAY_SAYAC=$((OLAY_SAYAC+1))
}

# HTTP GET (-L: yönlendirmeleri izler) — M2/M3 içerik çekimi.
# $1 url $2 outfile -> stdout=http_code; dönüş 0=curl koştu, 1=ağ hatası.
# İç retry: ağ hatası / 5xx'te bir kez, 5 sn sonra.
http_get(){
  local url="$1" out="$2" code
  code=$(curl -sSL --compressed --max-time 45 -A "$UA" -o "$out" \
         -w '%{http_code}' "$url" 2>>"$LOGP") || code="AG"
  if [ "$code" = "AG" ] || [ "${code:0:1}" = "5" ]; then
    sleep 5
    code=$(curl -sSL --compressed --max-time 45 -A "$UA" -o "$out" \
           -w '%{http_code}' "$url" 2>>"$LOGP") || code="AG"
  fi
  echo "$code"
  [ "$code" = "AG" ] && return 1 || return 0
}

# HTTP GET (-L YOK: yönlendirmeyi İZLEMEZ) — yalnız M1/RG.
# RG mantığı: geçerli fihrist doğrudan 200; mükerrer-yok/henüz-yayınlanmadı ise
# server 302 ile '/' ana sayfaya yönlendirir. 3xx'i homepage sanıp ayıklamamak
# için -L kullanılmaz; 302 = 'yok/beklemede' net sinyali. (url_effective glitch'i
# güvenilmez çıktı — 2026-07-21 T2'de boş döndü; ham status koduna geçildi.)
http_get_noredir(){
  local url="$1" out="$2" code
  code=$(curl -sS --compressed --max-time 45 -A "$UA" --cacert "$RG_CA" -o "$out" \
         -w '%{http_code}' "$url" 2>>"$LOGP") || code="AG"
  if [ "$code" = "AG" ] || [ "${code:0:1}" = "5" ]; then
    sleep 5
    code=$(curl -sS --compressed --max-time 45 -A "$UA" --cacert "$RG_CA" -o "$out" \
           -w '%{http_code}' "$url" 2>>"$LOGP") || code="AG"
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
    code=$(http_get_noredir "$url" "$ham") || true
    if [ "$code" = "AG" ]; then
      logla "M1 RG $et: ağ hatası ($url)"; return 2
    fi
    case "$code" in
      200) : ;;   # geçerli fihrist → ayıklamaya devam
      3??) rm -f "$ham"; return 1 ;;   # 302→homepage: mükerrer yok / henüz yayınlanmadı
      404) rm -f "$ham"; return 1 ;;
      *)   logla "M1 RG $et: beklenmedik HTTP $code ($url)"; return 2 ;;
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
    kanun_ozet="${kanun_ozet}${et}:${kn:-0} kanun-maddesi; "
    while IFS= read -r ol; do
      [ -n "$ol" ] || continue
      olay_ekle "RG-fihrist($et${RG_TARIH_KIPI:+ $BUGUN})" "$ol"
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
  # F4-3 (2026-07-27): HTTP 200 ama Last-Modified başlığı YOK.
  # Eski davranış iki yönlü bozuktu:
  #  (a) taban varken lm="" → "$lm" != "$old" → BÜYÜK OLAY yanlış alarmı
  #      ("Su Kanunu Taslağı güncellendi") üstelik taban "" ile EZİLİYORDU;
  #      sonraki koşuda başlık geri gelince İKİNCİ yanlış alarm, ve arada
  #      gerçek bir değişiklik olsa taban kaybolduğu için GÖRÜLMEZ olurdu.
  #  (b) taban yokken "" tabanı yazılıyor, aynı zincir baştan kuruluyordu.
  # Başlığın yokluğu sunucu/CDN yapılandırmasıdır, belgenin değişmesi DEĞİL.
  # Doğru davranış: tabana DOKUNMA, olay üretme, hata sayma — yalnız logla.
  if [ -z "$lm" ]; then
    durum_satir "$id" "$kat" "🟡 başlık yok" "HTTP 200 ama Last-Modified başlığı okunamadı — taban korundu"
    echo "[$RUN_UTC] $id LASTMOD-BOS 200 (taban korundu) $url" >> "$HLOG"
    logla "$id: HTTP 200 ama Last-Modified başlığı yok — taban korundu, olay üretilmedi"
    return 0
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

logla "SU-İZLEME başladı ($RUN_UTC)${RG_TARIH_KIPI:+ [RG TELAFİ $BUGUN]}"

# TELAFİ MÜKERRER KORUMASI: o tarih zaten başarıyla analiz edildiyse
# (fihrist-ana-analiz.txt dolu) hiçbir şeye dokunmadan çık — çift OLAY
# üretimi makine kontrolüyle imkânsız.
if [ -n "$RG_TARIH_KIPI" ] && [ -s "$IZ/arsiv/rg/$BUGUN/fihrist-ana-analiz.txt" ]; then
  logla "RG telafi $BUGUN: zaten taranmış (analiz mevcut) — atlandı"
  echo "zaten taranmış: $BUGUN"
  exit 0
fi

# M1 (kendi hatasını izole eder)
m1_rg || { logla "M1 RG beklenmeyen çıkış"; durum_satir "RG-gunluk" "M1" "🔴 hata" "modül çöktü"; HATA_SAYAC=$((HATA_SAYAC+1)); }

# baş/son boşluk kırpma (xargs YOK — Türkçe apostrof/tırnak xargs'ı kırıyordu)
trim(){ local s="$1"; s="${s#"${s%%[![:space:]]*}"}"; s="${s%"${s##*[![:space:]]}"}"; printf '%s' "$s"; }

# M2/M3 — hedefler.conf sırayla; her hedef arası nezaket ≥5 sn
# (RG telafi kipinde ATLANIR — yalnız M1)
[ -n "$RG_TARIH_KIPI" ] || {
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
}

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

# --- DURUM.md render --- (RG telafi kipinde ATLANIR: DURUM son koşuyu temsil eder)
[ -n "$RG_TARIH_KIPI" ] || {

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

# ==================== TELEGRAM UYARISI (2026-08-24, RG onarım brief'i) ====================
# Veri hattının kırmızısı SMTP'ye bağlı kalmasın: HATA_SAYAC>0 ise uyarı
# arac/uyari-gonder.sh ile Telegram'a ÇIKAR (LLM'siz, doğrudan Bot API).
# ALARM YORGUNLUĞU KORUMASI: 🔴 hedef kimliklerinden imza üretilir; AYNI
# imza 24 saat içinde tekrar gönderilmez (izleme/state/uyari-imza-su-izleme.txt),
# imza değişirse hemen gönderilir. Gönderim hatası koşuyu DÜŞÜRMEZ ama
# loglanır (sessiz hata yasağı). Not: uyari-gonder.sh "kanal yapılandırılmadı"
# durumunda 0 döner — bu durumda da imza yazılır; kanal kuruluyken bu ayrım
# pratikte önemsizdir ve log/uyari.log iki hâli ayrı kaydeder.
uyari_bildir(){
  local imzaf="$IZ/state/uyari-imza-su-izleme.txt"
  local kirmizi govde simdi_e eski_imza eski_zaman
  kirmizi=$(grep -F '🔴' "$STATUSF" | cut -f1 | sort | paste -sd, -) || true
  [ -n "$kirmizi" ] || return 0
  simdi_e=$(date -u +%s)
  if [ -f "$imzaf" ]; then
    IFS=$'\t' read -r eski_imza eski_zaman < "$imzaf" || true
    if [ "${eski_imza:-}" = "$kirmizi" ] && [ $((simdi_e - ${eski_zaman:-0})) -lt 86400 ]; then
      logla "Telegram uyarısı atlandı: aynı imza <24 saat ($kirmizi)"
      return 0
    fi
  fi
  govde=$( { grep -F '🔴' "$STATUSF" || true; } | awk -F'\t' '{print "• " $1 " (" $2 "): " $4}')
  if "$KOK/arac/uyari-gonder.sh" "veri hattı su-izleme${RG_TARIH_KIPI:+ (RG telafi $BUGUN)}: $HATA_SAYAC hata" "$govde"; then
    printf '%s\t%s\n' "$kirmizi" "$simdi_e" > "$imzaf"
    logla "Telegram uyarısı gönderildi (imza: $kirmizi)"
  else
    logla "TELEGRAM UYARISI GÖNDERİLEMEDİ (uyari-gonder exit $?) — bkz. log/uyari.log"
  fi
  return 0
}
if [ "$HATA_SAYAC" -gt 0 ]; then uyari_bildir; fi

# Çıkış satırının dosya alanı: koşumun ürünü DURUM.md (telafi kipinde
# render atlanır — o zaman alan "-" kalır, satır yine yazılır).
if [ -z "$RG_TARIH_KIPI" ] && [ -f "$IZ/DURUM.md" ]; then
  cikis_kaydi_dosya "$IZ/DURUM.md" "$(stat -c %s "$IZ/DURUM.md")"
fi

# ============================ COMMIT + PUSH (baraj deseni) ============================
# git add KOŞULLU (var-olmayan yolda exit 128 + sessiz durma olmasın).
# A2 (08.09.2026): `git add "$IZ"` (izleme/ dizininin TAMAMI) kullanıcı
# dosyalarını süpürüyordu — ölçülen vakalar: izleme/su-izleme.sh 6 otomatik
# commit'te (dac501c, 7a268ef, 4171891…), kapsam-taban.json b9b3472,
# rg-ara-sertifika.pem 7a268ef, geçici .dsi-duyuru-listesi.tmp.html 948dcbc.
# Artık YALNIZ bu hattın ürettiği dosyalar, AÇIK LİSTEYLE (kendi çıktısı
# atlanmaz, başkasının değişikliği alınmaz):
#   DURUM.md · OLAYLAR.md · arsiv/ (yalnız bu betik yazar) ·
#   state/<id>.sha|.son.txt|.lastmod · uyari-imza-su-izleme.txt ·
#   rg-nobetci-durum.json + nhyp-yayin-durum.json (nöbetçiler yazar, taşıyıcı bu hat).
for f in "$IZ/DURUM.md" "$IZ/OLAYLAR.md" \
         "$IZ"/state/*.sha "$IZ"/state/*.son.txt "$IZ"/state/*.lastmod \
         "$IZ/state/uyari-imza-su-izleme.txt" \
         "$IZ/state/rg-nobetci-durum.json" "$IZ/state/nhyp-yayin-durum.json"; do
  [ -f "$f" ] && git add -- "$f" || true
done
[ -d "$IZ/arsiv" ] && git add -- "$IZ/arsiv" || true
# RG hattının nöbetçi çıktısı (2026-08-25 kirli-ağaç düzeltmesi): rg-nobetci
# izleme/ DIŞINA yazar ve kendisi git'e dokunmaz; yeni kayıt yazıldığında bu
# dosyayı da BU hattın commit'i taşır — yoksa ağaç kirli kalır ve tüm
# hatların pull/push'u tıkanır (ölçülen vaka: 18-24.08, 41 bekleyen commit).
[ -f "$KOK/veri/potansiyel/isletme-sahalari-yeni.json" ] \
  && git add "$KOK/veri/potansiyel/isletme-sahalari-yeni.json" || true

if ! git diff --cached --quiet; then
  # ORTAK GIT KİLİDİ (2026-07-23): kilit alınamazsa İŞ ERTELENİR — arşiv ve
  # DURUM.md diskte yazılı kalır, sonraki koşuda commit edilir.
  if ! git_kilit_al "su-izleme"; then
    logla "git kilidi 10 dk'da alınamadı — commit ERTELENDİ"
    exit 4
  fi
  # K1 (2026-07-25, bulgu F4-2): commit pull'DAN ÖNCE. Eski sıra (pull → commit)
  # rebase koptuğunda veriyi commit'siz bırakıyordu; artık veri önce kayda geçer,
  # pull ancak ondan sonra denenir, push yalnız pull başarılıysa yapılır.
  ONCE=$(git rev-parse HEAD)
  git commit -q -m "Su izleme${RG_TARIH_KIPI:+ RG telafi $BUGUN}: $RUN_UTC (olay=$OLAY_SAYAC hata=$HATA_SAYAC) (otomatik)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" \
    || { logla "git commit BAŞARISIZ"; exit 1; }
  SONRA=$(git rev-parse HEAD)
  if [ "$ONCE" = "$SONRA" ]; then
    logla "commit atlandı: HEAD değişmedi"; exit 1
  fi
  PUSH_ERTELENDI=0
  if git_pull_rebase; then
    if ! git push -q; then
      logla "git push BAŞARISIZ (commit yerelde; sonraki koşuda denenir)"
      PUSH_ERTELENDI=1
    fi
  else
    # Ayırt edici log: "kirli ağaç" ile "rebase çatışması" farklı arızalardır.
    if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
      logla "pull ertelendi: çalışma ağacı kirli - commit yerelde, sonraki koşuda denenir"
      logla "kirli dosyalar: $(git status --porcelain --untracked-files=no | head -5 | tr '\n' ' ')"
    else
      logla "pull --rebase çatışması - commit yerelde, sonraki koşuda denenir"
    fi
    PUSH_ERTELENDI=1
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
  # push yapılmadıysa (koptu veya pull nedeniyle ertelendi) → sessiz hata yasağı: exit 0 dönme
  if [ "$PUSH_ERTELENDI" -eq 1 ]; then
    [ "$HATA_SAYAC" -gt 0 ] && exit 1 || exit 3
  fi
fi

# hedef hatası varsa exit≠0 (bekçi/log görsün) ama arşiv/DURUM yazıldı.
[ "$HATA_SAYAC" -gt 0 ] && exit 1
exit 0
