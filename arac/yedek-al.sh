#!/usr/bin/env bash
# YEDEK ALICI — gecelik ikinci-konum yedeği (B1.2, 2026-07-28).
#
# NE KORUR: deponun GitHub'a gitmeyen, geri getirilmesi pahalı ya da
# imkânsız varlıkları + tam depo geçmişinin tek dosyalık kopyası.
#
# SINIR — AÇIKÇA: ikinci konum AYNI MAKİNEDEDİR (/home/suha/yedek).
# Bu yedek şunlara karşı korur: yanlışlıkla silme · worktree silinirken
# gitignore'lu veriyi kaybetme (2026-07-27'de NHYP 892 MB böyle gitti) ·
# bozulan dosyayı geri alma · GitHub erişiminin kaybı.
# ŞUNA KARŞI KORUMAZ: makinenin/diskin ölümü, sağlayıcının hesabı
# kapatması. Depo dışı-MAKİNE dışı kopya KULLANICI KARARI bekliyor —
# bkz. rapor/yedek-envanteri.md.
#
# Sessiz hata yasağı (CLAUDE.md): set -euo pipefail · her hata loglanır ·
# başarı ölçütü yazılan dosyanın VARLIĞI + sha256 doğrulaması, komutun
# exit kodu değil · durum dosyası ancak doğrulamadan SONRA yazılır.
set -euo pipefail

# KOK: normalde scriptin bulunduğu depo. YEDEK_KOK yalnız TEST içindir
# (worktree'den ana ağaca karşı koşum); üretimde ayarlanmaz.
KOK="${YEDEK_KOK:-$(cd "$(dirname "$0")/.." && pwd)}"
HEDEF="${YEDEK_HEDEF:-/home/suha/yedek/suharitasi}"
LOG="$KOK/log/yedek.log"
DURUM="$HEDEF/son-yedek.json"
KILIT="/tmp/suharitasi-git.lock"
BASLANGIC=$(date -u +%s)
ZAMAN=$(date -u +%FT%TZ)

mkdir -p "$HEDEF/guncel" "$HEDEF/onceki" "$KOK/log"
logla() { echo "$(date -u +%FT%TZ) yedek: $*" >> "$LOG"; }
# TELEGRAM (2026-08-25, kalanlar paketi 5.3): yedek hattının ölümcül hatası
# yalnız log'da kalmasın — dışarı bildirilir; gönderim hatası çıkışı değiştirmez.
# UYARICI, KOK'tan DEĞİL scriptin kendi dizininden çözülür: YEDEK_KOK test
# kancası KOK'u ezdiğinde uyarı yolu kopmasın (falsifikasyon bulgusu 25.08).
UYARICI="$(cd "$(dirname "$0")" && pwd)/uyari-gonder.sh"
olduc() {
  logla "HATA: $*"; echo "YEDEK HATASI: $*" >&2
  "$UYARICI" "yedek hattı: YEDEK BAŞARISIZ" "$*" || true
  exit 1
}

logla "başlıyor → $HEDEF"

# ── 1. Yedeklenecek varlıklar ────────────────────────────────────────
# Yalnız GitHub'da OLMAYANLAR. GitHub'daki her şey (kaynak/dsi-arsiv,
# data/arsiv/mevzuat, veri/potansiyel, src/, arac/…) git bundle ile
# zaten kapsanıyor — iki kez yedeklenmiyor.
VARLIKLAR=(
  "data/arsiv/grace/ham"          # 507 MB ham NetCDF — GitHub 100MB limiti
  "kaynak/tr-atlas-master.png"    # 24 MB — kaynak/ gitignore'da
  "kaynak-video"                  # 22 MB ham video — YENİDEN ÜRETİLEMEZ (ücretli)
)

# ── 2. Değişiklik tespiti ────────────────────────────────────────────
# Büyük varlıklar her gece yeniden sıkıştırılmaz; içerik imzası
# değişmediyse mevcut yedek KORUNUR (disk + CPU tasarrufu).
IMZA_YENI="$HEDEF/.imza-yeni"
: > "$IMZA_YENI"
for v in "${VARLIKLAR[@]}"; do
  if [ -e "$KOK/$v" ]; then
    # dizin/dosya ayrımı yapmadan: yol + boyut + mtime → ucuz imza
    find "$KOK/$v" -type f -printf '%p %s %T@\n' 2>>"$LOG" | sort >> "$IMZA_YENI"
  else
    echo "YOK $v" >> "$IMZA_YENI"
    logla "UYARI: varlık diskte yok → $v (envanterde kayıtlı, kaybolmuş olabilir)"
  fi
done
IMZA_HASH=$(sha256sum "$IMZA_YENI" | cut -d' ' -f1)
ESKI_HASH=""
[ -f "$HEDEF/guncel/.imza-hash" ] && ESKI_HASH=$(cat "$HEDEF/guncel/.imza-hash")

VARLIK_DURUM="degismedi"
if [ "$IMZA_HASH" != "$ESKI_HASH" ]; then
  VARLIK_DURUM="yenilendi"
  logla "varlık imzası değişti ($ESKI_HASH → $IMZA_HASH) — yeniden paketleniyor"
  # Kuşak döndürme: güncel → önceki (yalnız gerçek yenilemede)
  rm -rf "$HEDEF/onceki"; mkdir -p "$HEDEF/onceki"
  # cp -a: varsa taşı; boş dizinde hata vermesin diye koşullu
  if compgen -G "$HEDEF/guncel/varliklar-*.tar.gz" > /dev/null; then
    mv "$HEDEF"/guncel/varliklar-*.tar.gz "$HEDEF/onceki/" || olduc "kuşak döndürme başarısız"
  fi
  PAKET="$HEDEF/guncel/varliklar-$(date -u +%Y%m%d).tar.gz"
  MEVCUT=()
  for v in "${VARLIKLAR[@]}"; do [ -e "$KOK/$v" ] && MEVCUT+=("$v"); done
  if [ ${#MEVCUT[@]} -eq 0 ]; then
    olduc "yedeklenecek varlık bulunamadı — envanter ile disk uyuşmuyor"
  fi
  # nice+ionice: sunucu paylaşımlı (BIST timer'ları), gece yükü bindirilmez
  nice -n 15 ionice -c3 tar -czf "$PAKET" -C "$KOK" "${MEVCUT[@]}" 2>>"$LOG" \
    || olduc "tar başarısız (paket: $PAKET)"
  [ -s "$PAKET" ] || olduc "paket boş/yok: $PAKET"
  cp "$IMZA_YENI" "$HEDEF/guncel/.imza-liste"
  echo "$IMZA_HASH" > "$HEDEF/guncel/.imza-hash"
else
  logla "varlık imzası aynı — paket korundu"
fi

# ── 3. Depo geçmişi (git bundle) ─────────────────────────────────────
# Tek dosyada TÜM geçmiş + tüm dallar. Geri alma:
#   git clone <bundle> suharitasi
# GitHub kaybolsa bile depo bu dosyadan tam olarak ayağa kalkar.
# Kilit: pipeline'lar aynı anda commit ederse tutarsız bundle çıkabilir.
BUNDLE="$HEDEF/guncel/depo.bundle"
BUNDLE_TMP="$HEDEF/guncel/.depo.bundle.tmp"
[ -f "$BUNDLE" ] && cp -f "$BUNDLE" "$HEDEF/onceki/depo.bundle" 2>>"$LOG"
if flock -w 300 "$KILIT" git -C "$KOK" bundle create "$BUNDLE_TMP" --all 2>>"$LOG"; then
  [ -s "$BUNDLE_TMP" ] || olduc "bundle boş: $BUNDLE_TMP"
  # Doğrulama: bozuk bundle sessizce yazılmasın
  git -C "$KOK" bundle verify "$BUNDLE_TMP" >>"$LOG" 2>&1 || olduc "bundle doğrulaması BAŞARISIZ"
  mv "$BUNDLE_TMP" "$BUNDLE"
else
  olduc "git bundle başarısız (kilit alınamadı ya da git hatası)"
fi

# ── 4. Sırlar — ayrı, dar izinli ─────────────────────────────────────
# .env yedeklenir çünkü kaybı EPİAŞ + deploy hook erişimini koparır.
# Ayrı dosya, 600 izin, tarball'a GİRMEZ (tarball taşınabilir; sır taşınmaz).
if [ -f "$KOK/.env" ]; then
  install -m 600 "$KOK/.env" "$HEDEF/env.kopya" || olduc ".env kopyalanamadı"
  chmod 700 "$HEDEF" || true   # dizin izni: yalnız sahip
fi

# ── 5. sha256 manifest ───────────────────────────────────────────────
MANIFEST="$HEDEF/guncel/manifest.sha256"
( cd "$HEDEF/guncel" && sha256sum ./*.tar.gz ./depo.bundle > manifest.sha256 2>>"$LOG" ) \
  || olduc "manifest üretilemedi"
( cd "$HEDEF/guncel" && sha256sum -c manifest.sha256 >>"$LOG" 2>&1 ) \
  || olduc "manifest DOĞRULAMASI başarısız — yedek bozuk"

# ── 6. Durum dosyası (sağlık kalemi bunu okur) ───────────────────────
# ANCAK doğrulamadan SONRA yazılır: yarım/bozuk yedek "taze" görünmesin.
SURE=$(( $(date -u +%s) - BASLANGIC ))
BOYUT=$(du -sb "$HEDEF/guncel" | cut -f1)
cat > "$DURUM" <<JSON
{
  "zaman": "$ZAMAN",
  "sonuc": "basarili",
  "sureSn": $SURE,
  "boyutBayt": $BOYUT,
  "varlikPaketi": "$VARLIK_DURUM",
  "hedef": "$HEDEF",
  "sinir": "Ikinci konum AYNI MAKINEDE. Makine/disk olumune karsi KORUMAZ.",
  "kapsam": ["data/arsiv/grace/ham", "kaynak/tr-atlas-master.png", "kaynak-video", "git bundle (tum gecmis)", ".env (ayri, 600)"]
}
JSON
rm -f "$IMZA_YENI"
logla "bitti · $SURE sn · $(( BOYUT / 1048576 )) MB · varlık: $VARLIK_DURUM"
echo "YEDEK TAMAM · $SURE sn · $(( BOYUT / 1048576 )) MB · varlık paketi: $VARLIK_DURUM"
