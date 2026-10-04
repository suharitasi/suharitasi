#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""yaz_atomik.py — atomik JSON/metin yazımı (tek kaynak, 04.10.2026 denetimi).

NEDEN: doğrudan `open(..., 'w')` yazımı ortasında süreç ölürse tüketiciler
(site build, tahmin motoru, alarm tetikleyici) YARIM JSON okur. tmp dosyaya
yaz + os.replace: aynı dosya sisteminde atomiktir (ya eski ya yeni içerik).

Sözleşme: hata durumunda geçici dosya temizlenir; hedef ASLA yarım kalmaz.
"""
from __future__ import annotations

import json
import os
from pathlib import Path


def json_yaz(yol, veri, **dump_kw) -> None:
    p = Path(yol)
    p.parent.mkdir(parents=True, exist_ok=True)
    gecici = p.with_name(f"{p.name}.tmp{os.getpid()}")
    try:
        with gecici.open("w", encoding="utf-8") as f:
            json.dump(veri, f, **dump_kw)
            f.flush()
            os.fsync(f.fileno())
        os.replace(gecici, p)
    finally:
        if gecici.exists():
            try:
                gecici.unlink()
            except OSError:
                pass


def metin_yaz(yol, icerik: str) -> None:
    p = Path(yol)
    p.parent.mkdir(parents=True, exist_ok=True)
    gecici = p.with_name(f"{p.name}.tmp{os.getpid()}")
    try:
        gecici.write_text(icerik, encoding="utf-8")
        os.replace(gecici, p)
    finally:
        if gecici.exists():
            try:
                gecici.unlink()
            except OSError:
                pass
