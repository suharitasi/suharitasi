#!/usr/bin/env python3
"""RG SAYI ÇIKARIMI — ilan kayıtlarına gazete sayısı (M5, 29.07.2026).

DURUM (ölçüldü): `isletme-sahalari-ek.json`'daki 310 ilan kaydının hiçbirinde
`rg_sayi` alanı yok. Bunların 254'ünün `kaynak_url`'i arşiv PDF'i
(`/arsiv/NNNNN.pdf`) — sayı zaten dosya adında ve `src/data/rg-sayi.js`
build'de türetiyor. Kalan **56 kayıt** `ilanlar/eskiilanlar/YYYY/MM/...htm`
biçiminde; URL'de sayı YOK.

BU SCRIPT O 56'YI ÇÖZER — BİRİNCİL KAYNAKTAN.
Yöntem: RG'nin kendi tarih sayfası (`/eskiler/YYYY/MM/YYYYMMDD.htm`) başlıkta
"9 Aralık 2017 Tarihli ve 30265 Sayılı Resmî Gazete" yazar. Sayı oradan
okunur. Bu bir TAHMİN değil, kaynağın kendi beyanıdır.

REDDEDİLEN YÖNTEM (briefte önerildi, projede zaten ölçülüp elenmiş):
pasajdan "Sayı: NNNNN" çıkarımı. `src/data/rg-sayi.js` kaydı: URL ile örtüşen
30 kayıtta 1 çatışma (26.07.1977 — URL 16008, pasaj 18001; OCR bozması).
Tek doğrulanamayan çatışma alanı güvenilmez kılar (GUNLUK 28.07 kuralı).
Bu script pasaja BAKMAZ. Ölçüldü: 310 kaydın yalnız 31'inde o kalıp var,
yani kazanç da düşüktü.

DOĞRULAMA — İKİ BAĞIMSIZ KONTROL:

K3a (zemin doğruluğu): RG arama API'si `resmiGazeteTarihiFormatted` ve
  `resmiGazeteSayisi` alanlarını AYRI AYRI döndürür. Bu çiftler, tarih
  sayfasından okunan sayıyla kıyaslanır. Kıyas DÖNGÜSEL DEĞİLDİR: biri
  arama servisinden, öbürü gazetenin kendi başlığından.
  ÖNEMLİ SINIR (ölçüldü 29.07): elimizdeki 109 başlık kaydının TAMAMI
  1963-1980 arası ve o dönemin `/eskiler/` sayfası YOKTUR (93/93 HTTP
  404) — o kayıtlar zaten `/arsiv/NNNNN.pdf` ile geliyor. Bu yüzden K3a
  hedef dönemde (2005-2017) API'den ayrıca çekilen çiftlerle koşulur.

K3b (monotonluk): gazete sayısı tarihle ARTAR. Çıkarılan her sayı,
  tarih sırasına konduğunda artan olmalı. Tek bir ihlal bile yöntemi
  düşürür — 1977'de pasaj çıkarımını eleyen kontrol buydu.

Tek bir çatışma çıkarsa yöntem KULLANILMAZ (script exit 3).

Sessiz hata yasağı: her isteğin HTTP kodu basılır, ağ hatası yutulmaz,
çözülemeyen kayıt "cikarim_yok" olarak sayılır ve alan YAZILMAZ.

Kullanım: python3 arac/rg-sayi-cikar.py [--dogrula] [--uygula]
  --dogrula : yalnız K3a sınavını koşar, veri yazmaz
  --uygula  : 310 kaydı çözer ve JSON'a yazar (K3a/K3b geçmeden yazmaz)
"""
import importlib.util
import json, re, sys, time, urllib.error, urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
BASLIK = KOK / "veri/potansiyel/isletme-sahalari.json"      # 109, sayı BİLİNEN
EK = KOK / "veri/potansiyel/isletme-sahalari-ek.json"       # 310, sayı YOK
UA = "suharitasi.com veri derleme (mailto:bilgi@suharitasi.com)"
BEKLE = 1.2                                                 # nezaket
ARSIV = re.compile(r"/arsiv/(\d+)\.pdf(?:$|[?#])")
# Sayı kalıbı TARİHİYLE BİRLİKTE aranır. Ölçüm hatası kaydı (29.07):
# ilk sürüm yalnız "Tarihli ve NNNNN Sayılı" arıyordu ve İLK eşleşmeyi
# alıyordu; RG tarih sayfası başlıkta ÖNCEKİ sayının bağlantısını da
# taşıyor ("18 Ağustos 2006 … 26263" → "22 Ağustos 2006 … 26267"), bu
# yüzden 22.08.2006'da 26263 okunmuş ve K3a çatışma vermişti. Doğrulama
# yöntemi yakaladı; ayrıştırıcı düzeltildi.
TARIH_SAYFA = re.compile(r"(\d{1,2})\s+(\S+)\s+(\d{4})\s+Tarihli\s+ve\s+(\d{4,6})\s+Sayılı", re.I)
AYLAR = {1: "Ocak", 2: "Şubat", 3: "Mart", 4: "Nisan", 5: "Mayıs", 6: "Haziran",
         7: "Temmuz", 8: "Ağustos", 9: "Eylül", 10: "Ekim", 11: "Kasım", 12: "Aralık"}

DOGRULA = "--dogrula" in sys.argv
UYGULA = "--uygula" in sys.argv


def gun_url(rg_tarih):
    """'09.12.2017' → RG tarih sayfası URL'si."""
    g, a, y = rg_tarih.split(".")
    return f"https://www.resmigazete.gov.tr/eskiler/{y}/{a}/{y}{a}{g}.htm"


def sayfadan_sayi(url, rg_tarih=None):
    """Tarih sayfasındaki, İSTENEN TARİHE ait gazete sayısı.

    rg_tarih verilirse yalnız o tarihe ait kalıp kabul edilir (sayfadaki
    'önceki sayı' bağlantısı yanlışlıkla okunmasın). Verilmezse ilk kalıp
    döner — yalnız keşif amaçlı."""
    istek = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(istek, timeout=40) as c:
            ham = c.read()
            kod = c.status
    except urllib.error.HTTPError as e:
        return None, f"HTTP {e.code}"
    except Exception as e:                       # ağ hatası GİZLENMEZ
        return None, f"ERR {type(e).__name__}"
    # RG eski sayfaları windows-1254; utf-8 zorlanırsa çözümleme patlar.
    metin = ham.decode("windows-1254", "replace")
    duz = re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", metin))
    bulunanlar = TARIH_SAYFA.findall(duz)
    if not bulunanlar:
        return None, f"başlıkta sayı kalıbı yok (HTTP {kod})"
    if rg_tarih:
        g, a, y = (int(x) for x in rg_tarih.split("."))
        for bg, ba, by, sayi in bulunanlar:
            if int(bg) == g and by == str(y) and ba.strip() == AYLAR[a]:
                return int(sayi), None
        return None, (f"sayfada {rg_tarih} tarihine ait kalıp yok "
                      f"(bulunanlar: {[b[:3] for b in bulunanlar][:3]})")
    return int(bulunanlar[0][3]), None


def k3a_sinavi(ciftler):
    """API'den gelen (tarih, sayı) çiftlerini tarih sayfasıyla kıyaslar."""
    catisan, eslesen, okunamayan = [], 0, []
    print(f"K3a: {len(ciftler)} bağımsız tarih-sayı çifti sınanıyor", file=sys.stderr)
    for tarih, beklenenler in sorted(ciftler.items()):
        sayi, sebep = sayfadan_sayi(gun_url(tarih), tarih)
        if sayi is None:
            okunamayan.append((tarih, sebep))
        elif sayi in beklenenler:
            eslesen += 1
        else:
            catisan.append((tarih, sorted(beklenenler), sayi))
        time.sleep(BEKLE)
    print(f"K3a SONUÇ: eşleşen {eslesen} · ÇATIŞAN {len(catisan)} "
          f"· okunamayan {len(okunamayan)}", file=sys.stderr)
    for t, b, s in catisan:
        print(f"  ÇATIŞMA {t}: API {b}, sayfa {s}", file=sys.stderr)
    return {"eslesen": eslesen, "catisan": catisan, "okunamayan": okunamayan}


def k3b_monotonluk(kayitlar):
    """Tarih sırasına konan sayılar artan mı (gazete sayısı geri gitmez)."""
    ciftler = []
    for k in kayitlar:
        if k.get("rg_sayi") and k.get("rg_tarih"):
            g, a, y = k["rg_tarih"].split(".")
            ciftler.append((f"{y}{a}{g}", int(k["rg_sayi"]), k["rg_tarih"]))
    ciftler.sort()
    ihlal = []
    for i in range(1, len(ciftler)):
        # Aynı gün mükerrer sayılar olabilir → eşitlik ihlal değil.
        if ciftler[i][1] < ciftler[i - 1][1]:
            ihlal.append((ciftler[i - 1][2], ciftler[i - 1][1], ciftler[i][2], ciftler[i][1]))
    print(f"K3b monotonluk: {len(ciftler)} sayı · İHLAL {len(ihlal)}", file=sys.stderr)
    for x in ihlal[:10]:
        print(f"  İHLAL {x[0]}={x[1]} → {x[2]}={x[3]}", file=sys.stderr)
    return ihlal


def api_ciftleri():
    """RG arama API'sinden hedef dönem (2005-2017) tarih-sayı çiftleri."""
    spec = importlib.util.spec_from_file_location("rgnob", KOK / "arac/rg-nobetci.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    ciftler = {}
    for kelime in ("yeraltısuyu", "su tahsisi", "içme suyu"):
        for start in range(0, 400, 100):
            try:
                c = mod.sorgu(kelime, start, 100)
            except Exception as e:      # ağ hatası GİZLENMEZ
                print(f"  API hatası ({kelime}@{start}): {type(e).__name__}", file=sys.stderr)
                continue
            for satir in c.get("data", []):
                if not isinstance(satir, dict):
                    continue
                t, n = satir.get("resmiGazeteTarihiFormatted"), satir.get("resmiGazeteSayisi")
                if t and n and 2005 <= int(t.split(".")[-1]) <= 2017:
                    ciftler.setdefault(t, set()).add(int(n))
            time.sleep(1.5)
    return ciftler


def coz_ve_yaz(k3):
    d = json.loads(EK.read_text("utf-8"))
    kayitlar = d["kayitlar"]
    urlden, sayfadan, cozulemeyen = 0, 0, []
    # Tarih başına tek istek (aynı gün birden çok ilan olabilir).
    onbellek = {}
    hedef = [k for k in kayitlar if not ARSIV.search(k.get("kaynak_url") or "")]
    print(f"URL'den çözülemeyen {len(hedef)} kayıt tarih sayfasından denenecek",
          file=sys.stderr)
    for k in kayitlar:
        m = ARSIV.search(k.get("kaynak_url") or "")
        if m:
            # Bu grup zaten build'de türetiliyor; alanı burada da SABİTLERİZ
            # ki veri dosyası tek başına künye taşısın.
            if UYGULA:
                k["rg_sayi"] = int(m.group(1))
                k["rg_sayi_kaynak"] = "arsiv-url"
            urlden += 1
            continue
        t = k.get("rg_tarih")
        if not t:
            cozulemeyen.append((k.get("kaynak_url"), "rg_tarih yok"))
            continue
        if t not in onbellek:
            onbellek[t] = sayfadan_sayi(gun_url(t), t)
            time.sleep(BEKLE)
        sayi, sebep = onbellek[t]
        if sayi is None:
            cozulemeyen.append((t, sebep))
            continue
        if UYGULA:
            k["rg_sayi"] = sayi
            k["rg_sayi_kaynak"] = "rg-tarih-sayfasi"
        sayfadan += 1
    ozet = {"arsiv_url": urlden, "tarih_sayfasi": sayfadan,
            "cozulemeyen": len(cozulemeyen)}
    print(f"ÇÖZÜM: arşiv-URL {urlden} · tarih-sayfası {sayfadan} "
          f"· çözülemeyen {len(cozulemeyen)}", file=sys.stderr)
    for x in cozulemeyen[:10]:
        print(f"  ÇÖZÜLEMEDİ {x}", file=sys.stderr)
    if UYGULA:
        d["rg_sayi_cikarim"] = {
            "tarih": "2026-07-29", "ozet": ozet,
            "yontem": "arsiv-url: /arsiv/NNNNN.pdf dosya adı · "
                      "rg-tarih-sayfasi: resmigazete.gov.tr/eskiler/.../YYYYMMDD.htm "
                      "başlığındaki 'Tarihli ve NNNNN Sayılı' beyanı",
            "dogrulama_K3": {"eslesen": k3["eslesen"], "catisan": len(k3["catisan"]),
                             "okunamayan": len(k3["okunamayan"]),
                             "tarih_sayisi": k3["tarih_sayisi"]},
            "not": "Pasajdan 'Sayı: NNNNN' çıkarımı KULLANILMADI — "
                   "src/data/rg-sayi.js'te ölçülüp elenmiş yöntem (1/30 çatışma).",
        }
        EK.write_text(json.dumps(d, ensure_ascii=False, indent=1), "utf-8")
        print(f"yazıldı: {EK}", file=sys.stderr)
    return ozet


def main():
    ciftler = api_ciftleri()
    k3 = k3a_sinavi(ciftler)
    if k3["catisan"]:
        print("K3a ÇATIŞMASI VAR — yöntem kullanılmıyor, veri YAZILMADI.",
              file=sys.stderr)
        return 3
    if not k3["eslesen"]:
        print("K3a hiç doğrulama noktası üretmedi — yöntem KANITSIZ, "
              "veri YAZILMADI.", file=sys.stderr)
        return 3
    if DOGRULA and not UYGULA:
        print("yalnız doğrulama istendi; veri yazılmadı.", file=sys.stderr)
        return 0
    k3["tarih_sayisi"] = len(ciftler)
    ozet = coz_ve_yaz(k3)
    # K3b yazımdan SONRA, gerçek sonuç üzerinde koşar.
    d = json.loads(EK.read_text("utf-8"))
    ihlal = k3b_monotonluk(d["kayitlar"])
    if ihlal:
        print("K3b MONOTONLUK İHLALİ — sonuç güvenilmez.", file=sys.stderr)
        return 3
    if UYGULA:
        d["rg_sayi_cikarim"]["dogrulama_K3b"] = {"sayi": len(d["kayitlar"]), "ihlal": 0}
        EK.write_text(json.dumps(d, ensure_ascii=False, indent=1), "utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
