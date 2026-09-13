#!/usr/bin/env python3
"""arac/mevzuat-cekici.py — Resmî mevzuat aktarım hattı (13.09.2026).

mevzuat.gov.tr'den kanun/tüzük/yönetmelik ham metnini çeker, madde madde
ayrıştırır ve JSON üretir. UYDURMA YOK: yalnız resmî kaynaktan gelen metin.

Kullanım:
  python3 arac/mevzuat-cekici.py                # tanımlı mevzuatları çek
  python3 arac/mevzuat-cekici.py --ozet         # yalnız özet yazdır
  python3 arac/mevzuat-cekici.py --cikti DIR    # çıktı dizini

Not (TLS): mevzuat.gov.tr devlet CA'sı standart pakette olmadığından TLS
doğrulaması yapılamaz; bu betik SALT-OKUMA kamu metni için doğrulamayı kapatır
(verify=False). Üretilen metin yayına alınmadan önce künye/URL ile birlikte
[SERDAR-HUKUK] onayına sunulur.
"""
from __future__ import annotations

import argparse
import html as H
import json
import re
import ssl
import sys
import urllib.request
from pathlib import Path

IFRAME = "https://www.mevzuat.gov.tr/anasayfa/MevzuatFihristDetayIframe?MevzuatTur={tur}&MevzuatNo={no}&MevzuatTertip={tertip}"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

# Çekilecek mevzuatlar (künye mevcut rehber/mevzuat verisiyle uyumlu).
MEVZUATLAR = [
    {"kisa": "167", "ad": "167 Sayılı Yeraltı Suları Hakkında Kanun", "tur": "Kanun",
     "no": "167", "mtur": "1", "tertip": "4"},
    {"kisa": "YAS Tüzüğü", "ad": "Yeraltı Suları Tüzüğü", "tur": "Tüzük",
     "no": "51465", "mtur": "2", "tertip": "4"},
    {"kisa": "Su Tahsisleri Yön.", "ad": "Su Tahsisleri Hakkında Yönetmelik", "tur": "Yönetmelik",
     "no": "34021", "mtur": "7", "tertip": "5"},
]

MADDE_PAT = re.compile(r"(?mi)^\s*(Geçici\s+Madde|Ek\s+Madde|Madde)\s+(\d+)\s*[\.\-–—]?\s*")


def _ctx() -> ssl.SSLContext:
    c = ssl.create_default_context()
    c.check_hostname = False
    c.verify_mode = ssl.CERT_NONE
    return c


def cek(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60, context=_ctx()) as r:
        raw = r.read()
    return raw.decode("utf-8", errors="replace")


def metne_cevir(ham: str) -> str:
    """HTML → düz metin (stil/script atılır, blok etiketleri satıra çevrilir)."""
    t = re.sub(r"<(style|script)[\s\S]*?</\1>", " ", ham, flags=re.I)
    t = re.sub(r"</(p|div|tr|li|h[1-6]|table)>", "\n", t, flags=re.I)
    t = re.sub(r"<br\s*/?>", "\n", t, flags=re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    t = H.unescape(t)
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n\s*\n+", "\n", t)
    return t.strip()


def temizle(govde: str) -> str:
    """Makale gövdesindeki satır kırılmalarını boşluğa çevirir, boşlukları sadeleştirir."""
    t = govde.replace("\xa0", " ")
    t = re.sub(r"\s+", " ", t)
    return t.strip()


def etiket_duzelt(ham: str) -> str:
    h = re.sub(r"\s+", " ", ham).strip().lower()
    if "geçici" in h:
        return "Geçici Madde"
    if "ek" in h:
        return "Ek Madde"
    return "Madde"


def kes_yururluk_tablosu(metin: str) -> str:
    """Metnin sonundaki 'yürürlüğe giriş/değişiklik tablosu'nu keser.

    Resmî metnin sonunda madde numaralarını listeleyen bir değişiklik tablosu
    bulunur; bu tablo madde değildir ve ayrıştırmada yanlış bölünme üretir.
    """
    desenler = [
        r"KANUNA\s+EK\s+VE\s+DEĞİŞİKLİK\s+GETİREN\s+MEVZUATIN\s+YÜRÜRLÜĞE\s+GİRİŞ",
        r"YÜRÜRLÜĞE\s+GİRİŞ\s+TARİHİNİ\s+GÖSTERİR",
        r"Yürürlükten\s+Kaldırılan\s+Madde",
        r"Değişiklik\s+Tablosu",
    ]
    for d in desenler:
        m = re.search(d, metin, flags=re.I)
        if m and m.start() > len(metin) * 0.5:
            return metin[: m.start()]
    return metin


def ayrıstır(metin: str):
    """Metni maddelere böler. Yürürlük tablosu kesilir; ilk-görülen madde tutulur."""
    metin = kes_yururluk_tablosu(metin)
    esles = list(MADDE_PAT.finditer(metin))
    maddeler = []
    gorulen = set()
    for i, m in enumerate(esles):
        etiket = etiket_duzelt(m.group(1))
        numara = m.group(2)
        anahtar = (etiket, numara)
        if anahtar in gorulen:
            continue  # değişiklik tablosu / mükerrer başlık
        gorulen.add(anahtar)
        bas = m.end()
        # bir sonraki GERÇEK madde başlangıcına kadar kes (mükerrerleri de sınır say)
        son = esles[i + 1].start() if i + 1 < len(esles) else len(metin)
        maddeler.append({"etiket": etiket, "numara": numara, "govde": temizle(metin[bas:son])})
    return maddeler


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--ozet", action="store_true", help="yalnız özet yazdır (dosya yazma)")
    ap.add_argument("--cikti", default="data/arsiv/mevzuat/cekilen", help="çıktı dizini")
    args = ap.parse_args()

    kok = Path(__file__).resolve().parent.parent
    cikti_dir = kok / args.cikti
    if not args.ozet:
        cikti_dir.mkdir(parents=True, exist_ok=True)

    ozetler = []
    for mz in MEVZUATLAR:
        url = IFRAME.format(tur=mz["mtur"], no=mz["no"], tertip=mz["tertip"])
        try:
            ham = cek(url)
        except Exception as e:  # ağ/TLS hatası — sessiz düşme yok
            print(f"[HATA] {mz['kisa']}: {e}", file=sys.stderr)
            ozetler.append({"kanun": mz["kisa"], "hata": str(e)})
            continue
        metin = metne_cevir(ham)
        maddeler = ayrıstır(metin)
        # künye/başlık: metnin ilk 3 satırı
        basliklar = [s.strip() for s in metin.split("\n")[:3] if s.strip()]
        kayit = {
            "kanunKisa": mz["kisa"],
            "kanun": mz["ad"],
            "tur": mz["tur"],
            "kaynakUrl": f"https://www.mevzuat.gov.tr/mevzuat?MevzuatNo={mz['no']}&MevzuatTur={mz['mtur']}&MevzuatTertip={mz['tertip']}",
            "cekimUrl": url,
            "baslikSatirlari": basliklar,
            "maddeSayisi": len(maddeler),
            "maddeler": [
                {
                    "id": f"{mz['kisa'].lower().replace(' ', '-').replace('.', '')}-{m['etiket'].lower().replace(' ', '-')}-{m['numara']}",
                    "etiket": m["etiket"],
                    "numara": m["numara"],
                    "metin": m["govde"],
                }
                for m in maddeler
            ],
        }
        if not args.ozet:
            dosya = cikti_dir / f"{mz['kisa'].lower().replace(' ', '-').replace('.', '')}.json"
            dosya.write_text(json.dumps(kayit, ensure_ascii=False, indent=2), encoding="utf-8")
        ozetler.append({"kanun": mz["kisa"], "ad": mz["ad"], "madde": len(maddeler),
                        "ilk": maddeler[0]["etiket"] + " " + maddeler[0]["numara"] if maddeler else None,
                        "son": maddeler[-1]["etiket"] + " " + maddeler[-1]["numara"] if maddeler else None,
                        "ornek_uzunluk": len(maddeler[0]["govde"]) if maddeler else 0})

    print("=== MEVZUAT ÇEKİM ÖZETİ ===")
    for o in ozetler:
        if "hata" in o:
            print(f"  ✗ {o['kanun']}: {o['hata']}")
        else:
            print(f"  ✓ {o['kanun']}: {o['madde']} madde ({o['ilk']} … {o['son']}) · ilk madde {o['ornek_uzunluk']} kr")
    if not args.ozet:
        print(f"Çıktı dizini: {cikti_dir}")
    return 0 if all("hata" not in o for o in ozetler) else 1


if __name__ == "__main__":
    raise SystemExit(main())
