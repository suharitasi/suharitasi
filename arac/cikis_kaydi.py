# ORTAK ÇIKIŞ KAYDI — PYTHON UYGULAMASI (26.08.2026, kuyruk kapatma Faz B).
#
# SÖZLEŞME arac/cikis-kaydi.sh ile AYNIDIR (paylaşılan şey kod değil sözleşme):
#   <ISO-8601 UTC> <ad>: ÇIKIŞ · exit=<kod> · dosya=<yol> · bayt=<n>
#   Çıktı üretilmemişse dosya/bayt alanları "-"; satır YİNE yazılır.
#   Log tavanı 512 KB · en fazla 5 kayan arşiv · KIRPMA YOK.
#
# BASH'TEN FARK (envanter §4 ölçümü): python `atexit` YIĞILIR — mevcut
# kayıtlar ezilmez. Zincirleme gerekmez.
#
# EXIT KODU YAKALAMA: atexit çıkış kodunu almaz; bu yüzden sys.exit ve
# sys.excepthook sarılır (yalnız KAYIT için — davranış değişmez):
#   - sys.exit(n)          → kod n (None/çağrısız → 0)
#   - yakalanmamış istisna → kod 1
#   - sinyal (HUP/INT/TERM)→ 128+n; YALNIZ o sinyalde özel işleyici YOKSA
#     kurulur (mevcut işleyici ezilmez), sys.exit'e çevrilir ki atexit koşsun.
#
# Kullanım:
#   from cikis_kaydi import kur, dosya_bildir
#   kur("rg-nobetci", "/yol/log")
#   ...
#   dosya_bildir(yol, bayt)   # başarı yolunda, isteğe bağlı
import atexit
import os
import signal
import sys
from datetime import datetime, timezone

# Eşikler env ile ezilebilir — YALNIZ SINAMA İÇİN (üretimde ayarlanmaz).
_TAVAN = int(os.environ.get("CIKIS_KAYDI_TAVAN", 512 * 1024))
_ARSIV = int(os.environ.get("CIKIS_KAYDI_ARSIV", 5))

_ad = None
_log = None
_dosya = "-"
_bayt = "-"
_kod = 0


def _damga():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _logla(mesaj):
    try:
        with open(_log, "a", encoding="utf-8") as f:
            f.write(f"{_damga()} {_ad}: {mesaj}\n")
    except OSError:
        pass  # log yazılamıyorsa süreci düşürme


def _dondur():
    # Kayan arşiv — cikis-kaydi.sh._cikis_kaydi_dondur ile aynı kural.
    if not os.path.isfile(_log):
        return
    b = os.path.getsize(_log)
    if b <= _TAVAN:
        return
    son = f"{_log}.{_ARSIV}"
    if os.path.isfile(son):
        os.remove(son)
    for i in range(_ARSIV - 1, 0, -1):
        if os.path.isfile(f"{_log}.{i}"):
            os.replace(f"{_log}.{i}", f"{_log}.{i + 1}")
    os.replace(_log, f"{_log}.1")
    open(_log, "w").close()
    _logla(f"log döndürüldü ({b} > {_TAVAN} bayt) → {_log}.1 · arşiv tavanı {_ARSIV}")


def _cikista():
    _logla(f"ÇIKIŞ · exit={_kod} · dosya={_dosya} · bayt={_bayt}")


def kur(ad, log_yolu):
    global _ad, _log
    _ad = ad
    _log = log_yolu
    os.makedirs(os.path.dirname(_log) or ".", exist_ok=True)
    _dondur()

    # sys.exit sarmalayıcı: kodu kaydet, davranışı değiştirme.
    _gercek_exit = sys.exit

    def _exit_sarici(kod=None):
        global _kod
        _kod = 0 if kod is None else (kod if isinstance(kod, int) else 1)
        _gercek_exit(kod)

    sys.exit = _exit_sarici

    # Yakalanmamış istisna → exit 1 (python'un kendi davranışıyla aynı kod).
    _gercek_hook = sys.excepthook

    def _hook_sarici(tip, deger, iz):
        global _kod
        _kod = 1
        _gercek_hook(tip, deger, iz)

    sys.excepthook = _hook_sarici

    # Sinyaller: yalnız varsayılan işleyicideyken kurulur (mevcut ezilmez).
    for sig, kod in ((signal.SIGHUP, 129), (signal.SIGINT, 130), (signal.SIGTERM, 143)):
        try:
            if signal.getsignal(sig) in (signal.SIG_DFL, signal.default_int_handler):
                signal.signal(sig, lambda _s, _f, k=kod: sys.exit(k))
        except (OSError, ValueError):
            pass  # kurulamayan sinyal (alt iş parçacığı vb.) — varsayılan kalır

    atexit.register(_cikista)


def dosya_bildir(yol, bayt):
    global _dosya, _bayt
    _dosya = yol
    _bayt = bayt
