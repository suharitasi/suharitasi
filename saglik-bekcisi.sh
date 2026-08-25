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
# KOK: üretimde sabit. SAGLIK_KOK yalnız TEST içindir (worktree'den koşum).
KOK="${SAGLIK_KOK:-/home/suha/projeler/suharitasi}"
cd "$KOK" || exit 1
mkdir -p "$KOK/log"
# Test/izolasyon kancaları (BELLEK_LOG deseniyle aynı, 2026-07-27): bekçi
# ANA AĞACI okurken çıktısı başka bir köke yönlendirilebilsin — worktree'de
# gerçek veriye karşı ölçüm alınırken canlı UYARI/log dosyaları KİRLENMESİN.
# Varsayılanlar değişmediği için cron davranışı AYNI.
LOGP="${SAGLIK_LOG:-$KOK/log/pipeline.log}"
UYARI="${SAGLIK_UYARI:-$KOK/UYARI-SAGLIK.md}"
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

# (d) su-izleme canlılığı: DURUM.md HER koşuda yeniden yazılır (05:30+16:00 UTC).
#     eşik 14s gerekçe: 16:00→05:30 arası en uzun boşluk 13.5s; 05:30 koşusu
#     kaçarsa 07:00 bekçisinde DURUM.md ~15s eski görünür → alarm. Sağlıklı
#     işleyişte 07:00'de DURUM ~1.5s taze. (grace durum.json deseniyle aynı
#     mantık: "cron gerçekten koştu mu" sinyali.)
if [ -f izleme/DURUM.md ]; then
  IS=$(( (NOW - $(date -u -r izleme/DURUM.md +%s)) / 3600 ))
  [ "$IS" -gt 14 ] && ekle "su-izleme ${IS} saat koşmadı (DURUM.md bayat, >14s) — Su Kanunu izleme cron'u durmuş olabilir"
else
  ekle "izleme/DURUM.md YOK — su-izleme hiç koşmamış olabilir"
fi

# (d2) HAFTALIK NÖBETÇİLER — rg-nobetci + nhyp-nobetci (M13, 29.07.2026).
#      NEDEN BEKÇİDE: bu ikisi md20 (kapsam kalemleri) içinde de ölçülüyor,
#      ama md20 SAĞLIK SİSTEMİNİN İÇİNDE koşar. Sağlık koşusu durursa md20
#      da susar — nöbetçinin ölümünü kimse görmez. Bekçi pipeline'dan
#      BAĞIMSIZ olduğu için ikinci ve gerçek tanıktır.
#      EŞİK GERÇEK TAKVİMDEN: rg haftalık (Sal 04:20) → 2 hafta = 336s;
#      nhyp haftalık (Çar 04:40) ama NHYP yayını çok seyrek → 5 hafta = 840s.
#      İKİ KATI aşılırsa zaten md20 kırmızı verir; bekçi tek eşikle yetinir.
#      VADESİ GELMEYEN NÖBETÇİ ALARM ÜRETMEZ: yeni kurulan haftalık cron'un
#      state dosyası ilk koşuma kadar doğmaz (ölçülen vaka: rg-nobetci
#      28.07 Salı 21:00'de kuruldu, ilk koşum 04.08). Tarih karşılaştırması
#      izleme/kapsam-taban.json'daki ilkKosumBeklenen ile yapılır — eşik
#      script'e SABİT YAZILMAZ, tek kaynaktan okunur.
nobetci_bak() {
  ad="$1"; dosya="$2"; esik="$3"
  vade=$(python3 -c "
import json,sys,datetime
d=json.load(open('$KOK/izleme/kapsam-taban.json'))
n=[x for x in d.get('nobetciler',[]) if x['ad']=='$ad']
print(n[0].get('ilkKosumBeklenen') or '' if n else '')
" 2>>"$LOGP") || vade=""
  if [ -f "$dosya" ]; then
    YAS=$(( (NOW - $(date -u -r "$dosya" +%s)) / 3600 ))
    # `[ ... ] && ekle` DEĞİL, açık `if`: `set -e` altında yanlış çıkan test
    # fonksiyonun SON komutuysa fonksiyon 1 döner ve script sessizce durur
    # (ölçüldü 29.07 — bekçi nhyp kontrolünden sonra hiç çıktı vermeden
    # exit 1 verdi). CLAUDE.md: kör set -e yeni sessiz-durma yaratır.
    if [ "$YAS" -gt "$esik" ]; then
      ekle "$ad ${YAS} saattir güncellenmedi (tolerans ${esik}s) — haftalık cron durmuş olabilir"
    fi
  elif [ -n "$vade" ]; then
    VADE_TS=$(date -u -d "$vade" +%s 2>>"$LOGP") || VADE_TS=0
    if [ "$VADE_TS" -gt 0 ] && [ "$NOW" -lt "$VADE_TS" ]; then
      : # vadesi gelmedi — alarm YOK
    else
      ekle "$ad state dosyası YOK ve ilk koşum vadesi ($vade) geçti — cron hiç koşmamış"
    fi
  else
    ekle "$ad state dosyası YOK ve ilkKosumBeklenen tanımsız — yapılandırma eksik"
  fi
}
nobetci_bak "rg-nobetci"   "izleme/state/rg-nobetci-durum.json"  336
nobetci_bak "nhyp-nobetci" "izleme/state/nhyp-yayin-durum.json"  840

# (d2) IndexNow bildirim tazeliği (indeks-bildirimi briefi, 2026-08-25).
# İki ayrı soru: (1) betik KOŞUYOR mu — cron 6×/gün, 26 saat koşum yoksa cron
# ölmüş demektir (eşik commit/baraj kalemleriyle aynı mantık); (2) BİLDİRİM
# çıkıyor mu — baraj verisi her gün güncellenip havza sayfalarının lastmod'unu
# oynattığı için normalde her gün en az bir bildirim doğar; 96 saat (4 gün)
# bildirimsizlik ya sitemap üretiminin ya fark hesabının bozulduğunu gösterir
# (baraj kaynağının kendi kesintisi zaten ayrı kalemde yakalanıyor; eşik bu
# yüzden 24s değil 96s — yanlış alarm üretme ilkesi). Env INDEXNOW_DURUM ile
# test kopyası verilebilir (falsifikasyon gerçek state'e dokunmadan koşar).
INDX="${INDEXNOW_DURUM:-$KOK/izleme/state/indexnow-durum.json}"
if [ -f "$INDX" ]; then
  INDX_OKU() { python3 -c "
import json,datetime,sys
d=json.load(open('$INDX'))
t=d.get('$1')
if not t: print(-1); sys.exit()
dt=datetime.datetime.fromisoformat(t.replace('Z','+00:00'))
print(int((datetime.datetime.now(datetime.timezone.utc)-dt).total_seconds()//3600))
" 2>>"$LOGP" || echo -2; }
  KOSUM_YAS=$(INDX_OKU sonKosum)
  BILDIRIM_YAS=$(INDX_OKU sonBasariliBildirim)
  if [ "$KOSUM_YAS" -lt 0 ]; then
    ekle "indexnow state okunamadı/sonKosum boş ($INDX)"
  elif [ "$KOSUM_YAS" -gt 26 ]; then
    ekle "indexnow bildiricisi ${KOSUM_YAS} saattir koşmamış (>26s) — cron durmuş olabilir"
  fi
  if [ "$BILDIRIM_YAS" -ge 0 ] && [ "$BILDIRIM_YAS" -gt 96 ]; then
    ekle "indexnow son başarılı bildirim ${BILDIRIM_YAS} saat önce (>96s) — sitemap farkı ya da gönderim bozulmuş olabilir"
  fi
else
  ekle "indexnow state dosyası YOK ($INDX) — bildirici hiç koşmamış ya da state silinmiş"
fi

# (e) bellek eşiği (bellek-log.txt; her 10 dk). PENCERE-tabanlı: tek ölçüm ASLA
#     alarm üretmez. Eşik: SON 6 ÖLÇÜMÜN TAMAMINDA swap used > 2048MB VEYA
#     SON 3 ÖLÇÜMÜN TAMAMINDA available < 500MB. Pencere dolmamışsa (soğuk
#     başlangıç) alarm YOK — yanlış alarm üretme. Env BELLEK_LOG ile test
#     kopyası verilebilir (gerçek loga dokunmadan sentetik eşik testi).
BLOG="${BELLEK_LOG:-$HOME/bellek-log.txt}"
if [ -f "$BLOG" ]; then
  mapfile -t SW < <(grep -o 'swap_used_mb=[0-9]*' "$BLOG" | tail -6 | grep -o '[0-9]*$' || true)
  mapfile -t AV < <(grep -o 'mem_avail_mb=[0-9]*' "$BLOG" | tail -3 | grep -o '[0-9]*$' || true)
  if [ "${#SW[@]}" -eq 6 ]; then
    HEP=1; for v in "${SW[@]}"; do [ "$v" -gt 2048 ] || HEP=0; done
    if [ "$HEP" -eq 1 ]; then ekle "🔴 bellek eşiği — sunucu yükseltme değerlendirilmeli (son 6 ölçümde swap used >2048MB)"; fi
  fi
  if [ "${#AV[@]}" -eq 3 ]; then
    HEP=1; for v in "${AV[@]}"; do [ "$v" -lt 500 ] || HEP=0; done
    if [ "$HEP" -eq 1 ]; then ekle "🔴 bellek eşiği — sunucu yükseltme değerlendirilmeli (son 3 ölçümde available <500MB)"; fi
  fi

  # (e2) ANİ TEPE — YAPISAL AÇIK (2026-07-28, sunucu donma teşhisi).
  # Yukarıdaki iki kural ARDIŞIK pencere ister (6 / 3 ölçüm). 23 Tem'de sunucu
  # iki kez RAM+swap tükenip cevapsız kaldı (14:20 avail=90MB swap=6047MB;
  # 16:10 avail=173MB; 16:21 swap=5213MB) — her olay 1-2 ÖRNEK sürdü, çünkü
  # olay süreçler ölünce kendi kendine "çözülüyor". Pencere kuralı bu biçimi
  # YAPISAL OLARAK göremez: donma 5 gün fark edilmedi. Bu kalem TEK ölçümde
  # ateşler ve son 24 saate (144 ölçüm) bakar.
  # EŞİK KALİBRASYONU (uydurma değil): 1003 ölçümlük gerçek log taranarak
  # avail<500 VEYA swap>2000 kuralı denendi → 3/1003 ateşledi, üçü de 23 Tem
  # donma örnekleri. Yanlış pozitif 0.
  # Pencere SATIR SAYISIYLA değil ZAMAN DAMGASIYLA kesilir: logger duraksarsa
  # "son 144 satır" 24 saatten eski olur ve mesaj yalan söylerdi.
  ESIK_ZAMAN=$(date -u -d '24 hours ago' +%FT%TZ)
  TEPE_SAYI=0; TEPE_SATIR=""
  while read -r satir; do
    zaman=$(printf '%s\n' "$satir" | awk '{print $1}')
    [[ "$zaman" > "$ESIK_ZAMAN" ]] || continue
    sw=$(printf '%s\n' "$satir" | grep -o 'swap_used_mb=[0-9]*' | grep -o '[0-9]*$' || true)
    av=$(printf '%s\n' "$satir" | grep -o 'mem_avail_mb=[0-9]*' | grep -o '[0-9]*$' || true)
    # HATA satırları (free ayrıştırılamadı) sayısal alan taşımaz — atlanır.
    [ -n "$sw" ] && [ -n "$av" ] || continue
    if [ "$av" -lt 500 ] || [ "$sw" -gt 2000 ]; then
      TEPE_SAYI=$((TEPE_SAYI + 1))
      TEPE_SATIR="${zaman} (avail=${av}MB swap=${sw}MB)"
    fi
  done < <(tail -300 "$BLOG" || true)
  if [ "$TEPE_SAYI" -gt 0 ]; then
    ekle "🔴 bellek tükenmesi olayı — son 24 saatte ${TEPE_SAYI} ölçümde available<500MB veya swap>2000MB; en sonu ${TEPE_SATIR}. Sunucu bu anlarda cevapsız kalmış olabilir (takas yığılması)."
  fi
fi

# (f) BEKÇİNİN BEKÇİSİ (2026-07-23): site sağlık sistemi kendisi koşuyor mu?
# site-saglik.mjs siteyi denetler ama KENDİ durmasını denetleyemez — bu satır
# onun gözcüsüdür. Eşik 14 saat: cron 07:30 + 19:30 UTC (12 saat arayla), tek
# koşu kaçırılınca değil, İKİ koşu arası pencere aşılınca alarm verir.
# 2026-07-27 (B2): bu kalem CANLILIK ölçer, sağlık DEĞİL. sonBasariliKosu artık
# "koşum tamamlandı" damgasıdır; kırmızı bir kontrol damgayı DONDURMAZ. Eski
# anlamıyla tek bir 🔴 (27.07'de md4 yanlış alarmı) burada ikinci bir yanlış
# alarm doğuruyordu: "sağlık sistemi koşmuyor" — oysa 12 saatte bir koşuyordu.
# Arızayı site-saglik'in kendi kırmızısı + e-postası bildirir.
SAGLIK_DURUM="$KOK/izleme/state/site-saglik-durum.json"
if [ -f "$SAGLIK_DURUM" ]; then
  # Bozuk JSON sessizce "boş" sayılmasın: python hatası LOGP'ye düşer, SON_KOSU
  # boş kalır ve aşağıdaki dal 🔴 verir.
  SON_KOSU=$(python3 -c "
import json
d=json.load(open('$SAGLIK_DURUM'))
print(d.get('sonBasariliKosu') or '')
" 2>>"$LOGP") || SON_KOSU=""
  if [ -z "$SON_KOSU" ]; then
    ekle "🔴 sağlık sistemi hiç koşmamış (site-saglik-durum.json'da sonBasariliKosu yok)"
  else
    KOSU_TS=$(date -u -d "$SON_KOSU" +%s) || KOSU_TS=0
    if [ "$KOSU_TS" -eq 0 ]; then
      ekle "🔴 sağlık sisteminin son koşu damgası okunamadı ($SON_KOSU)"
    else
      KS=$(( (NOW - KOSU_TS) / 3600 ))
      [ "$KS" -gt 14 ] && ekle "🔴 sağlık sistemi koşmuyor — son koşu ${KS} saat önce (>14s)"
    fi
  fi
else
  ekle "🔴 sağlık sistemi koşmuyor — $SAGLIK_DURUM YOK (hiç koşmamış)"
fi

if [ -n "$SORUN" ]; then
  printf '# SAĞLIK BEKÇİSİ UYARISI\n\n%s\n\n%s' "$(date -u)" "$SORUN" > "$UYARI"
  printf '%s' "$SORUN" | while IFS= read -r s; do
    [ -n "$s" ] && echo "[$(date -u +%FT%TZ)] UYARI(saglik): ${s#- }" >> "$LOGP"
  done
  echo "SAĞLIK UYARISI oluştu → $UYARI"
  # DIŞ KÖPRÜ (B2.2, 28.07.2026): uyarıyı sunucudan ÇIKAR. Depoya düşen
  # UYARI dosyası ve log satırı sunucu içinde kalır — sunucu susarsa onlar
  # da susar. Gönderim başarısız olursa bekçi YİNE DE exit 1 döner: köprü
  # bekçinin yerine geçmez, yanına eklenir.
  "$KOK/arac/uyari-gonder.sh" "sağlık bekçisi uyarısı" "$SORUN" || true
  exit 1
fi

# sorun yok: eski uyarı dosyası varsa temizle (durum düzelmiş)
[ -f "$UYARI" ] && rm -f "$UYARI"
echo "sağlık OK (commit ${CS:-?}s, baraj ${BS:-?}s, grace ${GS:-?}g, su-izleme ${IS:-?}s)"
exit 0
