#!/usr/bin/env python3
"""arac/font-indir.py — Google Fonts'u kendi sunucumuza alır (13.09.2026).

NEDEN: dış font bağımlılığı (a) KVKK/gizlilik (ziyaretçi IP'si Google'a gider),
(b) CSP'de dış konak zorunluluğu, (c) ek DNS/TLS gecikmesi. Self-host bu üçünü
de kapatır.

Yöntem: Google Fonts CSS'ini modern UA ile çeker, yalnız latin + latin-ext
alt kümelerini indirir, woff2 URL'lerini yerel yollara çevirir ve
public/fonts/fonts.css üretir. İkili dosyalar public/fonts/ altına yazılır.
"""
from __future__ import annotations
import os, re, ssl, sys, urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
URL = ("https://fonts.googleapis.com/css2"
       "?family=Cormorant:ital,wght@0,400;0,500;1,400;1,500"
       "&family=Manrope:wght@400;500;600"
       "&family=IBM+Plex+Mono:wght@400;500&display=swap")


def ctx():
    c = ssl.create_default_context(); c.check_hostname = False; c.verify_mode = ssl.CERT_NONE
    return c


def cek(url: str, binary: bool = False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60, context=ctx()) as r:
        return r.read() if binary else r.read().decode("utf-8", errors="replace")


def main() -> int:
    kok = Path(__file__).resolve().parent.parent
    font_dir = kok / "public/fonts"
    font_dir.mkdir(parents=True, exist_ok=True)
    css = cek(URL)
    # Blokları /* subset */ yorumlarıyla ayır; yalnız latin + latin-ext tut.
    parcalar = re.split(r"/\*\s*([a-z0-9-]+)\s*\*/", css)
    # parcalar: [ön, subset1, blok1, subset2, blok2, ...]
    tutulan = []
    for i in range(1, len(parcalar) - 1, 2):
        subset, blok = parcalar[i], parcalar[i + 1]
        if subset in ("latin", "latin-ext"):
            tutulan.append((subset, blok))
    if not tutulan:
        print("HATA: latin/latin-ext bloğu bulunamadı", file=sys.stderr); return 1

    indirilen = {}
    def yerelle(blok: str) -> str:
        def degis(m):
            u = m.group(0)
            ad = u.split("/")[-1]
            if ad not in indirilen:
                (font_dir / ad).write_bytes(cek(u, binary=True))
                indirilen[ad] = True
            return f"/fonts/{ad}"
        return re.sub(r"https://fonts\.gstatic\.com/[^)]+\.woff2", degis, blok)

    css_yerel = "".join(yerelle(b) for _, b in tutulan)
    (font_dir / "fonts.css").write_text(
        "/* Self-hosted fonts (arac/font-indir.py). Kaynak: Google Fonts (OFL). */\n" + css_yerel,
        encoding="utf-8")
    print(f"tamam: {len(indirilen)} woff2 indirildi · latin+latin-ext · public/fonts/fonts.css")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
