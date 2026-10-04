#!/usr/bin/env python3
"""arac/mevzuat-radar.py — MEVZUAT DEĞİŞİKLİK RADARI (13.09.2026).

Takip edilen kanun/tüzük/yönetmeliklerin resmî metnini mevzuat.gov.tr'den çeker,
her maddenin SHA-256 özetini hesaplar ve önceki anlık görüntüyle karşılaştırır.
Değişiklik varsa data/kamu/mevzuat-degisiklik.json'a kayıt düşer.

Bu, statik mevzuat sayfasını "yaşayan" veriye çevirir: madde eklendi/kaldırıldı/
değişti sinyali. UYDURMA YOK: yalnız resmî metnin kendi farkı.

Kullanım:
  python3 arac/mevzuat-radar.py            # çek, karşılaştır, kaydet
  python3 arac/mevzuat-radar.py --kuru     # yalnız raporla, dosya yazma
"""
from __future__ import annotations

import argparse
import hashlib
import html as H
import json
import re
import ssl
import sys
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

IFRAME = "https://www.mevzuat.gov.tr/anasayfa/MevzuatFihristDetayIframe?MevzuatTur={tur}&MevzuatNo={no}&MevzuatTertip={tertip}"
UA = "suharitasi.com mevzuat radar (mailto:iletisim@suharitasi.com)"
TR = timezone(timedelta(hours=3))

MEVZUATLAR = [
    {"kisa": "167", "ad": "167 Sayılı Yeraltı Suları Hakkında Kanun", "tur": "Kanun", "no": "167", "mtur": "1", "tertip": "4"},
    {"kisa": "YAS Tüzüğü", "ad": "Yeraltı Suları Tüzüğü", "tur": "Tüzük", "no": "51465", "mtur": "2", "tertip": "4"},
    {"kisa": "Su Tahsisleri Yön.", "ad": "Su Tahsisleri Hakkında Yönetmelik", "tur": "Yönetmelik", "no": "34021", "mtur": "7", "tertip": "5"},
    {"kisa": "2942", "ad": "2942 Sayılı Kamulaştırma Kanunu", "tur": "Kanun", "no": "2942", "mtur": "1", "tertip": "5"},
    {"kisa": "2886", "ad": "2886 Sayılı Devlet İhale Kanunu", "tur": "Kanun", "no": "2886", "mtur": "1", "tertip": "5"},
    {"kisa": "831", "ad": "831 Sayılı Sular Hakkında Kanun", "tur": "Kanun", "no": "831", "mtur": "1", "tertip": "3"},
    {"kisa": "5686", "ad": "5686 Sayılı Jeotermal Kaynaklar ve Doğal Mineralli Sular Kanunu", "tur": "Kanun", "no": "5686", "mtur": "1", "tertip": "5"},
    {"kisa": "5393", "ad": "5393 Sayılı Belediye Kanunu", "tur": "Kanun", "no": "5393", "mtur": "1", "tertip": "5"},
    {"kisa": "6200", "ad": "6200 Sayılı DSİ Kanunu", "tur": "Kanun", "no": "6200", "mtur": "1", "tertip": "3"},
]

MADDE_PAT = re.compile(r"(?mi)^\s*(Geçici\s+Madde|Ek\s+Madde|Madde)\s+(\d+)\s*[\.\-–—]?\s*")


def _ctx():
    # TLS DOĞRULAMASI AÇIK (04.10.2026 denetimi): eski CERT_NONE MITM'e açıktı;
    # mevzuat.gov.tr zinciri doğrulanmış bağlamla HTTP 200 ölçüldü.
    return ssl.create_default_context()


def cek(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60, context=_ctx()) as r:
        return r.read().decode("utf-8", errors="replace")


def metne(ham):
    t = re.sub(r"<(style|script)[\s\S]*?</\1>", " ", ham, flags=re.I)
    t = re.sub(r"</(p|div|tr|li|h[1-6]|table)>", "\n", t, flags=re.I)
    t = re.sub(r"<br\s*/?>", "\n", t, flags=re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    t = H.unescape(t).replace("\xa0", " ")
    t = re.sub(r"[ \t]+", " ", t)
    return re.sub(r"\n\s*\n+", "\n", t).strip()


def maddeler(metin):
    # yürürlük tablosunu kes
    for d in [r"KANUNA\s+EK\s+VE\s+DEĞİŞİKLİK\s+GETİREN\s+MEVZUATIN\s+YÜRÜRLÜĞE\s+GİRİŞ",
              r"YÜRÜRLÜĞE\s+GİRİŞ\s+TARİHİNİ\s+GÖSTERİR", r"Yürürlükten\s+Kaldırılan\s+Madde"]:
        m = re.search(d, metin, flags=re.I)
        if m and m.start() > len(metin) * 0.5:
            metin = metin[:m.start()]
    esles = list(MADDE_PAT.finditer(metin))
    out = {}
    for i, m in enumerate(esles):
        etiket = "Geçici Madde" if "geçici" in m.group(1).lower() else ("Ek Madde" if "ek" in m.group(1).lower() else "Madde")
        no = m.group(2)
        son = esles[i + 1].start() if i + 1 < len(esles) else len(metin)
        govde = re.sub(r"\s+", " ", metin[m.end():son]).strip()
        out[f"{etiket} {no}"] = hashlib.sha256(govde.encode("utf-8")).hexdigest()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--kuru", action="store_true")
    args = ap.parse_args()
    kok = Path(__file__).resolve().parent.parent
    surum_yolu = kok / "data/kamu/mevzuat-surum.json"
    log_yolu = kok / "data/kamu/mevzuat-degisiklik.json"

    eski = json.loads(surum_yolu.read_text(encoding="utf-8")) if surum_yolu.exists() else {"mevzuatlar": {}}
    simdi = datetime.now(TR).strftime("%Y-%m-%dT%H:%M:%S%z")
    yeni = {"son_kontrol": simdi, "mevzuatlar": {}}
    degisiklikler = []

    for mz in MEVZUATLAR:
        url = IFRAME.format(tur=mz["mtur"], no=mz["no"], tertip=mz["tertip"])
        try:
            md = maddeler(metne(cek(url)))
        except Exception as e:
            print(f"[HATA] {mz['kisa']}: {e}", file=sys.stderr)
            yeni["mevzuatlar"][mz["kisa"]] = eski.get("mevzuatlar", {}).get(mz["kisa"], {})
            continue
        onceki = eski.get("mevzuatlar", {}).get(mz["kisa"], {})
        for etiket, h in md.items():
            if etiket not in onceki:
                if onceki:  # ilk çekimde "eklendi" gürültüsü yok
                    degisiklikler.append({"tarih": simdi, "kanun": mz["kisa"], "tip": "eklendi", "madde": etiket})
            elif onceki[etiket] != h:
                degisiklikler.append({"tarih": simdi, "kanun": mz["kisa"], "tip": "degisti", "madde": etiket})
        for etiket in onceki:
            if etiket not in md:
                degisiklikler.append({"tarih": simdi, "kanun": mz["kisa"], "tip": "kaldirildi", "madde": etiket})
        yeni["mevzuatlar"][mz["kisa"]] = md
        print(f"  ✓ {mz['kisa']}: {len(md)} madde" + (f" · değişiklik var" if any(d['kanun']==mz['kisa'] for d in degisiklikler) else ""))

    if not args.kuru:
        surum_yolu.write_text(json.dumps(yeni, ensure_ascii=False, indent=1), encoding="utf-8")
        log = json.loads(log_yolu.read_text(encoding="utf-8")) if log_yolu.exists() else {"_not": "Mevzuat değişiklik günlüğü. Resmî metnin SHA-256 farkından türetilir; uydurma yok.", "kayitlar": []}
        log["son_kontrol"] = simdi
        log["kayitlar"] = (degisiklikler + log.get("kayitlar", []))[:500]
        log_yolu.write_text(json.dumps(log, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"Anlık görüntü: {surum_yolu}")
        print(f"Değişiklik kaydı: {len(degisiklikler)} yeni")
    else:
        print(f"[kuru] değişiklik: {len(degisiklikler)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
