#!/usr/bin/env python3
"""RG İŞLETME SAHASI NÖBETÇİSİ — kalıcı periyodik izleme (2026-07-27, Faz E).

NEDEN: `arac/rg-tara.py` tek seferlik keşif aracıydı (Faz 3). Yeni bir
"yeraltısuyu işletme sahası" ilanı Resmî Gazete'de yayımlandığında bunu
kimse yakalamıyor — veri donuyor. Bu nöbetçi haftalık koşup YALNIZ YENİ
kayıtları bulur, mevcut arşive ekler ve olay üretir (SÜREKLİLİK İLKESİ).

MODLAR
  --test    tarama + ayrıştırma kanıtı üretir; HİÇBİR dosyaya yazmaz,
            hiçbir yere gönderim yapmaz, git'e dokunmaz. Varsayılan.
  --kosum   gerçek koşum: yeni kayıtlar isletme-sahalari-yeni.json'a
            eklenir, durum damgası güncellenir.

CRONTAB'A EKLENMEZ — kurulum satırı raporda, kullanıcı onayıyla.

Kanıt kuralı (Faz 3 ile aynı): her kayıt RG tarih + sayı + kaynak URL
taşır; taşımayan kayıt YAZILMAZ, "kaynaksiz" sayacına düşer.
Sessiz hata yasağı: ağ/ayrıştırma hatası yutulmaz — stderr + çıkış kodu.
"""
import argparse, json, os, re, ssl, subprocess, sys, time, urllib.error, urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
ARSIV = [KOK / "veri/potansiyel/isletme-sahalari.json",
         KOK / "veri/potansiyel/isletme-sahalari-ek.json"]
CIKTI = KOK / "veri/potansiyel/isletme-sahalari-yeni.json"
# FALSİFİKASYON KANCALARI (SU_IZLEME_RG_CA emsali, 2026-08-25): "yeni
# kayıt" yolu gerçek veri dosyalarına dokunulmadan uçtan uca sınanabilsin.
# Üretimde ayarlanmaz; cron bu değişkenleri görmez.
if os.environ.get("RG_NOBETCI_ARSIV_EZME"):
    ARSIV = [Path(p) for p in os.environ["RG_NOBETCI_ARSIV_EZME"].split(":")]
if os.environ.get("RG_NOBETCI_CIKTI_EZME"):
    CIKTI = Path(os.environ["RG_NOBETCI_CIKTI_EZME"])
DURUM = KOK / "izleme/state/rg-nobetci-durum.json"
# ORTAK ÇIKIŞ KAYDI (K1, 26.08.2026 Faz B): başarı/hata/sinyalde tek satır.
# Sözleşme arac/cikis-kaydi.sh ile aynı; python uygulaması arac/cikis_kaydi.py
# (atexit YIĞILIR — mevcut davranış ezilmez, envanter §4 ölçümü).
# sys.path güvencesi ZORUNLU: altin-ornek.mjs bu betiği başka çalışma
# dizininden `python3 -c` içinden yükler — sys.path[0] o zaman arac/ değildir
# (26.08 --tam koşumunda md23 kırmızısıyla ÖLÇÜLDÜ, ModuleNotFoundError).
sys.path.insert(0, str(Path(__file__).resolve().parent))
from cikis_kaydi import kur as _cikis_kur, dosya_bildir as _cikis_dosya
_cikis_kur("rg-nobetci", str(KOK / "log/rg-nobetci.log"))
UA = "suharitasi.com veri derleme (mailto:avserdararslan@hotmail.com)"
UC = "https://www.resmigazete.gov.tr/Home/Filter"
VARYANTLAR = ["yeraltısuyu işletme sahası",
              "yeraltı suyu işletme sahası",
              "YAS işletme sahası"]
BEKLE = 1.5          # istekler arası (G5 nezaket kuralı)

# RG ARA SERTİFİKA (2026-08-24, RG onarım brief'i): resmigazete.gov.tr
# zincirde ara sertifikayı göndermiyor (2026-08-06'dan beri) — urllib
# CERTIFICATE_VERIFY_FAILED ile düşüyordu ve nöbetçi KÖRDÜ. Sistem CA
# demeti + depodaki doğrulanmış ara sertifika birleştirilir; doğrulama
# KAPATILMAZ. RG_NOBETCI_CA: falsifikasyon/test kancası (yolu ezer,
# örn. /dev/null ile kasıtlı bozma).
ARA_SERT = KOK / "izleme/lib/rg-ara-sertifika.pem"
DEMET = KOK / "izleme/state/.rg-ca-demeti.pem"
UYARICI = KOK / "arac/uyari-gonder.sh"


def ssl_baglami():
    ezme = os.environ.get("RG_NOBETCI_CA")
    if ezme:
        return ssl.create_default_context(cafile=ezme)
    if not ARA_SERT.exists():
        print(f"UYARI: {ARA_SERT} yok — sistem demetiyle deneniyor", file=sys.stderr)
        return ssl.create_default_context()
    sistem = Path("/etc/ssl/certs/ca-certificates.crt")
    gecici = DEMET.with_suffix(".tmp")
    DEMET.parent.mkdir(parents=True, exist_ok=True)
    gecici.write_bytes(sistem.read_bytes() + b"\n" + ARA_SERT.read_bytes())
    gecici.replace(DEMET)          # atomik: su-izleme ile yazma yarışı olmasın
    try:
        return ssl.create_default_context(cafile=str(DEMET))
    except (ssl.SSLError, OSError) as e:
        # Demet bozuksa ÇÖKME: sistem varsayılanına düş ve uyar — istek
        # yine doğrulama hatası verir, o hata yakalanır ve Telegram'a çıkar.
        # (Falsifikasyon dersi 2026-08-24: modül-düzeyi çökme, uyarı yolunu
        # hiç çalıştırmadan öldürüyordu.)
        print(f"UYARI: CA demeti yüklenemedi ({e}) — sistem demetiyle deneniyor",
              file=sys.stderr)
        return ssl.create_default_context()


CTX = ssl_baglami()


def uyari_gonder(konu, govde):
    """Telegram bildirimi (LLM'siz, uyari-gonder.sh üzerinden). Haftalık
    kadans nedeniyle imza-mükerrer koruması GEREKMEZ (en fazla 1 mesaj/hafta).
    Gönderim hatası koşuyu düşürmez; stderr'e yazılır (sessiz hata yasağı)."""
    try:
        r = subprocess.run([str(UYARICI), konu, govde],
                           capture_output=True, text=True, timeout=30)
        if r.returncode != 0:
            print(f"UYARI: Telegram bildirimi gönderilemedi (exit {r.returncode}): "
                  f"{(r.stderr or r.stdout).strip()[:200]}", file=sys.stderr)
        else:
            print(f"Telegram bildirimi: {(r.stdout or '').strip()[:120]}")
    except (OSError, subprocess.TimeoutExpired) as e:
        print(f"UYARI: Telegram bildirimi çağrılamadı: {e}", file=sys.stderr)


def sorgu(kelime, start, length=25, searchtype="1"):
    govde = json.dumps({"draw": 1, "start": start, "length": length,
                        "parameters": {"searchtype": searchtype,
                                       "genelaranacakkelime": kelime,
                                       "genelbaslangictarihi": "",
                                       "genelbitistarihi": "", "genelsayi": ""}})
    istek = urllib.request.Request(
        UC, data=govde.encode(),
        headers={"User-Agent": UA,
                 "Content-Type": "application/json; charset=utf-8"})
    with urllib.request.urlopen(istek, timeout=60, context=CTX) as c:
        return json.load(c)


def satirlari_coz(cevap):
    """RG /Home/Filter cevabından kayıt sözlükleri.

    Uç DataTables sözleşmesini kullanır ama satırları DİZİ değil SÖZLÜK
    döndürür (27.07 ölçümü — ilk sürüm diziyi varsaydığı için 0 satır
    ayrıştırıyordu; --test kanıt kuralı bunu yakaladı). Alanlar:
    konu · mevzuatAdi · resmiGazeteSayisi · resmiGazeteTarihiFormatted ·
    mukerrer · url · kanunKararNo.
    """
    cikan = []
    for satir in cevap.get("data", []):
        if not isinstance(satir, dict):
            print(f"UYARI: beklenmeyen satır tipi {type(satir)} — atlandı",
                  file=sys.stderr)
            continue
        baslik = re.sub(r"\s+", " ", str(satir.get("konu") or "")).strip()
        cikan.append({
            "rg_tarih": satir.get("resmiGazeteTarihiFormatted"),
            "rg_sayi": satir.get("resmiGazeteSayisi"),
            "baslik": baslik,
            "kaynak_url": satir.get("url"),
            "mevzuat_turu": satir.get("mevzuatAdi"),
            "mukerrer": satir.get("mukerrer"),
        })
    return cikan


def arsiv_anahtarlari():
    """Mevcut arşivdeki kayıtların kimlikleri — 'yeni' tanımı bunlara göre."""
    anahtar = set()
    for yol in ARSIV:
        if not yol.exists():
            print(f"UYARI: arşiv dosyası yok: {yol}", file=sys.stderr)
            continue
        d = json.loads(yol.read_text())
        for k in d.get("kayitlar", []):
            u = k.get("kaynak_url")
            t = k.get("rg_tarih")
            b = (k.get("saha_adi") or k.get("baslik") or "")[:80]
            if u:
                anahtar.add(("url", u))
            if t:
                anahtar.add(("tarih+baslik", t, re.sub(r"\s+", " ", b).strip()))
    return anahtar


def tara(azami_sayfa):
    bulunan, hatalar = [], []
    for kelime in VARYANTLAR:
        start = 0
        for _ in range(azami_sayfa):
            try:
                cevap = sorgu(kelime, start)
            except (urllib.error.URLError, urllib.error.HTTPError, ValueError) as e:
                hatalar.append({"kelime": kelime, "start": start, "hata": str(e)})
                print(f"HATA sorgu '{kelime}' start={start}: {e}", file=sys.stderr)
                break
            satirlar = satirlari_coz(cevap)
            if not satirlar:
                break
            for s in satirlar:
                s["bulan_varyant"] = kelime
            bulunan.extend(satirlar)
            toplam = cevap.get("recordsFiltered") or cevap.get("recordsTotal") or 0
            start += 25
            if start >= int(toplam):
                break
            time.sleep(BEKLE)
        time.sleep(BEKLE)
    return bulunan, hatalar


def main():
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--test", action="store_true", help="yalnız kanıt üret; YAZMA YOK (varsayılan)")
    g.add_argument("--kosum", action="store_true", help="gerçek koşum: yeni kayıtları yaz")
    ap.add_argument("--azami-sayfa", type=int, default=8)
    a = ap.parse_args()
    kosum = a.kosum          # --test verilmese de varsayılan test'tir
    kip = "KOŞUM" if kosum else "TEST"
    print(f"RG NÖBETÇİSİ — kip: {kip}"
          + ("" if kosum else "  (hiçbir dosyaya YAZILMAZ)"))

    mevcut = arsiv_anahtarlari()
    print(f"arşivdeki kimlik sayısı : {len(mevcut)}")

    bulunan, hatalar = tara(a.azami_sayfa)
    print(f"taramada dönen satır    : {len(bulunan)}  (varyant {len(VARYANTLAR)})")

    kaynaksiz = [b for b in bulunan if not b["kaynak_url"] or not b["rg_tarih"]]
    saglam = [b for b in bulunan if b["kaynak_url"] and b["rg_tarih"]]
    yeni, tekrar = [], 0
    gorulen = set()
    for b in saglam:
        kimlik = ("url", b["kaynak_url"])
        kimlik2 = ("tarih+baslik", b["rg_tarih"], b["baslik"][:80])
        if kimlik in mevcut or kimlik2 in mevcut:
            tekrar += 1
            continue
        if b["kaynak_url"] in gorulen:
            continue
        gorulen.add(b["kaynak_url"])
        yeni.append(b)

    print(f"kaynaksız (yazılmaz)    : {len(kaynaksiz)}")
    print(f"arşivde zaten var       : {tekrar}")
    print(f"YENİ KAYIT              : {len(yeni)}")
    for b in yeni[:10]:
        print(f"   + {b['rg_tarih']} | {b['baslik'][:70]} | {b['kaynak_url']}")
    if hatalar:
        print(f"SORGU HATASI            : {len(hatalar)} (yukarıda stderr'de)")

    if not kosum:
        print("\nTEST kipi — hiçbir dosya yazılmadı, gönderim yapılmadı.")
        return 0 if not hatalar else 3

    # KİRLİ AĞAÇ DÜZELTMESİ (2026-08-25, kalanlar paketi): CIKTI'ya YALNIZ
    # yeni kayıt varken yazılır. Eski davranış her koşumda son_kosum damgası
    # basıyordu; dosya izleme/ dışında olduğundan hiçbir otomatik commit'çi
    # almıyor, ağaç kirli kalıyor ve TÜM hatların pull/push'u tıkanıyordu
    # (ölçüldü: 18-24.08 arası 41 commit birikti, cron-hata.log kanıtı).
    # Koşum kalp atışı zaten DURUM'da (izleme/state — su-izleme commit'ler).
    kosum_zamani = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    onceki = json.loads(CIKTI.read_text()) if CIKTI.exists() else {"kayitlar": []}
    onceki_url = {k.get("kaynak_url") for k in onceki.get("kayitlar", [])}
    eklenecek = [b for b in yeni if b["kaynak_url"] not in onceki_url]
    if eklenecek:
        CIKTI.parent.mkdir(parents=True, exist_ok=True)
        onceki["kayitlar"] = onceki.get("kayitlar", []) + eklenecek
        onceki["kaynak"] = "resmigazete.gov.tr /Home/Filter (searchtype=1 başlık)"
        onceki["son_kosum"] = kosum_zamani
        onceki["kayit_sayisi"] = len(onceki["kayitlar"])
        onceki["kaynaksiz_kayit"] = 0
        CIKTI.write_text(json.dumps(onceki, ensure_ascii=False, indent=1) + "\n")
        # Yeni kayıt insan değerlendirmesi bekler (C5 №10) — dışarı bildir;
        # dosyanın kendisi bir sonraki su-izleme koşumunda commit edilir.
        ozet = "\n".join(f"• {b['rg_tarih']} | {b['baslik'][:90]}" for b in eklenecek[:5])
        uyari_gonder(f"rg-nobetci: {len(eklenecek)} YENİ işletme sahası kaydı",
                     ozet + "\nisletme-sahalari-yeni.json güncellendi — değerlendirme bekliyor.")
    DURUM.parent.mkdir(parents=True, exist_ok=True)
    DURUM.write_text(json.dumps({
        "son_kosum": kosum_zamani,
        "taranan_satir": len(bulunan),
        "yeni_kayit": len(eklenecek),
        "sorgu_hatasi": len(hatalar),
    }, ensure_ascii=False, indent=1) + "\n")
    _cikis_dosya(str(DURUM), DURUM.stat().st_size)
    print(f"\nyazıldı: {DURUM}"
          + (f" · {CIKTI} (+{len(eklenecek)})" if eklenecek
             else f" · {CIKTI.name} DOKUNULMADI (yeni kayıt 0 — kirli ağaç bırakılmaz)"))
    # TELEGRAM (yalnız --kosum: --test sözleşmesi "hiçbir yere gönderim
    # yapmaz" der ve bozulMAZ). Sorgu hatası = nöbetçi kör → dışarı bildir.
    if hatalar:
        ozet = "\n".join(f"• '{h['kelime']}' start={h['start']}: {h['hata'][:120]}"
                          for h in hatalar[:5])
        uyari_gonder(f"veri hattı rg-nobetci: {len(hatalar)} sorgu hatası, "
                     f"taranan satır {len(bulunan)}", ozet)
    return 0 if not hatalar else 3


if __name__ == "__main__":
    sys.exit(main())
