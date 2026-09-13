#!/usr/bin/env python3
"""arac/mevzuat-birlestir.py — çekilen resmî metinleri küratörlü veriyle birleştirir.

- data/arsiv/mevzuat/cekilen/*.json : resmî madde metinleri (arac/mevzuat-cekici.py)
- data/kamu/mevzuat-maddeleri.json : mevcut (merci/sure/yorum/rehber/emsal taşır)
Çıktı: data/kamu/mevzuat-maddeleri.json (metin resmîden; zenginleştirme korunur).
"""
from __future__ import annotations
import glob, json, re
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent


def slug(s: str) -> str:
    s = s.lower()
    for a, b in zip("ıİşğüöç", "iisguoc"):
        s = s.replace(a, b)
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", s))


def main() -> int:
    cekilen = []
    for f in glob.glob(str(KOK / "data/arsiv/mevzuat/cekilen/*.json")):
        d = json.load(open(f, encoding="utf-8"))
        for m in d["maddeler"]:
            madde = f"{m['etiket']} {m['numara']}"
            cekilen.append({
                "id": f"{slug(d['kanunKisa'])}-{slug(m['etiket'])}-{m['numara']}",
                "kanunKisa": d["kanunKisa"], "kanun": d["kanun"], "tur": d["tur"],
                "madde": madde, "baslik": "", "metin": m["metin"], "kaynakUrl": d["kaynakUrl"],
                "merci": None, "sure": None, "yorum": None, "rehberler": [], "emsaller": [],
            })

    mevcut = json.load(open(KOK / "data/kamu/mevzuat-maddeleri.json", encoding="utf-8"))["maddeler"]
    by_key = {(m["kanunKisa"], m["madde"]): m for m in mevcut}
    for c in cekilen:
        s = by_key.get((c["kanunKisa"], c["madde"]))
        if s:
            for alan in ("baslik", "merci", "sure", "yorum", "rehberler", "emsaller"):
                if s.get(alan):
                    c[alan] = s[alan]

    # çekilmeyen ama küratörlü olanlar (varsa) korunur
    cekilen_keys = {(c["kanunKisa"], c["madde"]) for c in cekilen}
    kalan = [m for m in mevcut if (m["kanunKisa"], m["madde"]) not in cekilen_keys]
    hepsi = cekilen + kalan

    kanun_sira = {}
    for c in cekilen:
        kanun_sira.setdefault(c["kanunKisa"], len(kanun_sira))

    def anahtar(m):
        etiket = "Geçici" if m["madde"].startswith("Geçici") else ("Ek" if m["madde"].startswith("Ek") else "Madde")
        no = int(re.search(r"(\d+)", m["madde"]).group(1))
        return (kanun_sira.get(m["kanunKisa"], 99), {"Madde": 0, "Ek": 1, "Geçici": 2}[etiket], no)

    hepsi.sort(key=anahtar)
    out = {
        "_not": "Mevzuat maddeleri motoru. metin mevzuat.gov.tr resmî kaynağından BİREBİR "
                "(arac/mevzuat-cekici.py); uydurulmaz. merci/sure/yorum yalnız doğrulanmış rehber bilgisinden.",
        "surum": 3, "olusturma": "2026-09-13", "kaynak": "mevzuat.gov.tr",
        "maddeSayisi": len(hepsi), "maddeler": hepsi,
    }
    json.dump(out, open(KOK / "data/kamu/mevzuat-maddeleri.json", "w"), ensure_ascii=False, indent=2)
    from collections import Counter
    print("toplam madde:", len(hepsi))
    print("kanun dağılımı:", dict(Counter(m["kanunKisa"] for m in hepsi)))
    print("zengin (merci):", sum(1 for m in hepsi if m.get("merci")), "| emsal bağlı:", sum(1 for m in hepsi if m.get("emsaller")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
