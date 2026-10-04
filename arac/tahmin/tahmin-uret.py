#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""tahmin-uret.py — Hafif zaman serisi projeksiyon motoru (Modül 1).

BİLİMSEL İLKE: Bu çıktı ÖLÇÜM DEĞİL, İSTATİSTİKSEL PROJEKSİYONDUR. Schema.org'da
`measurementTechnique` = "statistical forecast" olarak işaretlenir; ölçülen
verilerle ASLA karıştırılmaz (ayrı dosya/alan: data/tahmin/, tur="tahmin").

YÖNTEM (VPS dostu — yalnız numpy; pandas/statsmodels/prophet YOK):
  · GRACE (aylık, 2002→): mevsimsel ayrıştırma (takvim-ayı ortalaması) →
    mevsimsellikten arındırılmış seride en-küçük-kareler doğrusal trend →
    6 aylık projeksiyon (trend + yeniden eklenen mevsimsel bileşen). Aralık,
    arıtılmış seri artıklarının std'sinden (zamanla büyür).
  · Baraj (günlük, ~3 ay): kısa vadeli doğrusal momentum → 7/30/60 gün.
    Uzun ufuk İDDİA EDİLMEZ (örneklem küçük; güven açıkça etiketlenir).
  · Mann-Kendall (non-parametrik) eğilim testi → z, p, anlamlılık.

Çıktı: data/tahmin/kuraklik-projeksiyonu.json
Kullanım: python3 arac/tahmin/tahmin-uret.py [--kuru]
"""
from __future__ import annotations
import argparse
import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

KOK = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(KOK / "arac"))
from yaz_atomik import json_yaz  # noqa: E402 — atomik yazım (04.10.2026 denetimi)
OUT = KOK / "data" / "tahmin" / "kuraklik-projeksiyonu.json"
UFUK_AY = 6


def _aylar(anahtarlar: list[str]) -> np.ndarray:
    return np.array([int(k.split("-")[1]) for k in anahtarlar])


def mevsim_ayikla(x: np.ndarray, aylar: np.ndarray):
    """Takvim-ayı ortalamasını düş; (mevsimsel_sozluk, arindirilmis_seri)."""
    mevsim = {}
    for m in range(1, 13):
        v = x[aylar == m]
        mevsim[m] = float(np.mean(v)) if len(v) else 0.0
    arindirilmis = np.array([x[i] - mevsim[int(aylar[i])] for i in range(len(x))])
    return mevsim, arindirilmis


def ols(x: np.ndarray):
    """Doğrusal en-küçük-kareler → (intercept, slope, artık_std)."""
    n = len(x)
    if n < 3:
        return float(x[-1]) if n else float("nan"), 0.0, 0.0
    t = np.arange(n, dtype=float)
    b, a = np.polyfit(t, x, 1)  # slope, intercept
    resid = x - (a + b * t)
    sd = float(np.std(resid, ddof=2)) if n > 2 else 0.0
    return float(a), float(b), sd


def mann_kendall(x: np.ndarray) -> tuple[float, float]:
    """Mann-Kendall eğilim testi → (z, p). p < 0.05 anlamlı."""
    n = len(x)
    if n < 4:
        return 0.0, 1.0
    s = 0
    for i in range(n - 1):
        s += int(np.sign(x[i + 1:] - x[i]).sum())
    var = n * (n - 1) * (2 * n + 5) / 18.0
    if var <= 0:
        return 0.0, 1.0
    z = (s - np.sign(s)) / math.sqrt(var)
    return float(z), float(math.erfc(abs(z) / math.sqrt(2)))


def ay_ekle(ym: str, k: int) -> str:
    y, m = map(int, ym.split("-"))
    t = y * 12 + (m - 1) + k
    return f"{t // 12:04d}-{t % 12 + 1:02d}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--kuru", action="store_true")
    a = ap.parse_args()

    grace = json.loads((KOK / "data/canli/grace-havza.json").read_text(encoding="utf-8"))
    baraj = json.loads((KOK / "data/canli/baraj.json").read_text(encoding="utf-8"))
    havzalar: dict = {}

    for gad, g in grace.get("havzalar", {}).items():
        ad = gad.replace(" Havzası", "").strip()
        seri = g.get("seri", {})
        ay = sorted(seri)
        if len(ay) < 24:
            continue
        x = np.array([seri[k] for k in ay], dtype=float)
        aylar = _aylar(ay)
        mevsim, arindirilmis = mevsim_ayikla(x, aylar)
        icpt, slope, sd = ols(arindirilmis)
        z, p = mann_kendall(arindirilmis)
        n = len(x)
        proj = []
        for i in range(1, UFUK_AY + 1):
            hedef_ay = int(ay_ekle(ay[-1], i).split("-")[1])
            d = icpt + slope * (n - 1 + i) + mevsim[hedef_ay]
            k = math.sqrt(i)
            proj.append({
                "ay": ay_ekle(ay[-1], i), "deger": round(d, 2),
                "alt80": round(d - 1.2816 * sd * k, 2), "ust80": round(d + 1.2816 * sd * k, 2),
                "alt95": round(d - 1.96 * sd * k, 2), "ust95": round(d + 1.96 * sd * k, 2),
            })
        havzalar.setdefault(ad, {})["grace"] = {
            "birim": "cm eşdeğer su (karasal su depolama anomalisi)",
            "son_gozlem": ay[-1], "son_deger": round(float(x[-1]), 2), "seri_uzunluk": n,
            "egilim_aylik_cm": round(slope, 3),
            "mk_z": round(z, 2), "mk_p": round(p, 4), "mk_anlamli": bool(p < 0.05),
            "projeksiyon": proj,
        }

    for bad, h in baraj.get("havzalar", {}).items():
        ad = bad.replace(" Havzası", "").strip()
        gunluk: dict = {}
        for b in h.get("barajlar", {}).values():
            for gun, v in (b.get("seri") or {}).items():
                if v and v.get("doluluk") is not None:
                    gunluk.setdefault(gun, []).append(v["doluluk"])
        gunler = sorted(gunluk)
        if len(gunler) < 30:
            continue
        tam = np.array([float(np.mean(gunluk[g])) for g in gunler], dtype=float)
        pencere = tam[-90:] if len(tam) > 90 else tam
        icpt, slope, sd = ols(pencere)
        z, p = mann_kendall(pencere)
        n = len(pencere)
        havzalar.setdefault(ad, {})["baraj"] = {
            "birim": "% ortalama doluluk",
            "son_gozlem": gunler[-1], "son_deger": round(float(tam[-1]), 2), "seri_uzunluk": len(tam),
            "egilim_gunluk_puan": round(slope, 3),
            "mk_z": round(z, 2), "mk_p": round(p, 4), "mk_anlamli": bool(p < 0.05),
            "ufuk_gun": 60, "guven": f"kısa vadeli (örneklem ~{len(tam)} gün)",
            "projeksiyon": [
                {"gun": d, "deger": round(icpt + slope * (n - 1 + d), 2),
                 "alt80": round(icpt + slope * (n - 1 + d) - 1.2816 * sd * math.sqrt(d), 2),
                 "ust80": round(icpt + slope * (n - 1 + d) + 1.2816 * sd * math.sqrt(d), 2)}
                for d in (7, 30, 60)
            ],
        }

    cikti = {
        "_not": "İSTATİSTİKSEL TAHMİN/PROJEKSİYON — ÖLÇÜM DEĞİLDİR. Kaynak: GRACE (NASA, aylık) + EPİAŞ baraj doluluğu (günlük). Yöntem: mevsimsel ayrıştırma + OLS trend + Mann-Kendall. Ölçülen verilerle karıştırılmaz.",
        "tur": "tahmin",
        "yontem": {"ad": "Mevsimsel ayrıştırma + en-küçük-kareler trend + Mann-Kendall",
                   "kutuphane": "numpy (saf; ağır bağımlılık yok)", "surum": 2},
        "ufuk_ay": UFUK_AY,
        "uretim": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "havza_sayisi": len(havzalar),
        "havzalar": havzalar,
    }
    if a.kuru:
        print(f"[kuru] {len(havzalar)} havza, yazılmadı")
        return 0
    OUT.parent.mkdir(parents=True, exist_ok=True)
    json_yaz(OUT, cikti, ensure_ascii=False, indent=1)
    print(f"yazıldı: {OUT} · {len(havzalar)} havza")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
