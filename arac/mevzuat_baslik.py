"""Mevzuat madde metinlerinde sonraki maddeye ait başlık kuyruğunu ayırır.

mevzuat.gov.tr metninde madde başlıkları "Madde N" satırından ÖNCE gelir;
satır tabanlı ayrıştırıcı bu başlığı bir önceki maddenin gövdesine ekliyordu
(ölçüm 07.10.2026: 469 maddenin 282'sinde kuyruk başlık, 447 maddede boş baslik).
Bu modül yalnız depodaki metni yeniden böler; yeni metin ÜRETMEZ.
"""
from __future__ import annotations

import re

_SON_NOKTA = re.compile(r"[.;!?)\]\"”’»]\s*$")
_BASLANGIC = re.compile(r"^(\(?[IVX]+\s*[-–—]\s*)?[A-ZÇĞİÖŞÜ(“\"]")
_MADDE_ITEM = re.compile(r"^\(?\d+\)")
_DEGISIKLIK_REF = re.compile(r"md\.\)|\d{1,2}/\d{1,2}/\d{4}")
_BOLUM = re.compile(r"\b(BÖLÜM|KISIM)\b")
_DIPNOT = re.compile(r"\s*\[\d+\]\s*$")
_SINIRLAR = (". ", ") ", "] ", ".” ", '." ', ".» ")


def _son_cumle_siniri(metin: str) -> int:
    return max(metin.rfind(s) for s in _SINIRLAR)


def _rakam_orani(s: str) -> float:
    harf = [c for c in s if c.isalnum()]
    if not harf:
        return 0.0
    return sum(c.isdigit() for c in harf) / len(harf)


def kuyruk_ayir(metin: str) -> tuple[str, str | None]:
    """(govde, baslik|None): govde = kuyruğu alınmış metin.

    Kuyruk, son cümle sınırından sonra kalan ve başlık gibi görünen kısa
    parçadır: 1-90 karakter, cümle sonu noktalaması yok, büyük harf/roma
    rakamı ile başlar, madde bendi değil, değişiklik künyesi değil, rakam
    ağırlıklı değil. BÖLÜM/KISIM içeren kuyruk (bölüm başlığı + madde başlığı
    birleşik) 160 karaktere kadar gövdeden ayrılır ama başlık olarak
    ATANMAZ — hangi parçanın madde başlığı olduğu metinden çıkarılamaz.
    """
    t = (metin or "").rstrip()
    idx = _son_cumle_siniri(t)
    if idx < 0:
        return t, None
    kuyruk = t[idx + 2:].strip()
    if not kuyruk:
        return t, None
    if re.search(r"[.;!?]$", kuyruk):
        return t, None
    if not _BASLANGIC.match(kuyruk) or _MADDE_ITEM.match(kuyruk):
        return t, None
    if _DEGISIKLIK_REF.search(kuyruk) or _rakam_orani(kuyruk) > 0.4:
        return t, None
    govde = t[: idx + 1].rstrip()
    if _BOLUM.search(kuyruk):
        return (govde, None) if len(kuyruk) <= 160 else (t, None)
    if len(kuyruk) > 90:
        return t, None
    baslik = _DIPNOT.sub("", kuyruk.rstrip(":").strip()).strip()
    return govde, (baslik or None)


def basliklari_duzelt(maddeler: list[dict]) -> dict:
    """Aynı mevzuata ait, kaynak sırasındaki madde listesini yerinde düzeltir.

    Her maddenin kuyruğu gövdeden alınır; başlık, bir SONRAKİ maddenin
    `baslik` alanı boşsa oraya yazılır (dolu küratörlü başlık korunur).
    Döndürülen istatistik rapor içindir.
    """
    ist = {"kuyruk_alinan": 0, "baslik_atanan": 0, "baslik_atanamayan": 0}
    for i, m in enumerate(maddeler):
        govde, baslik = kuyruk_ayir(m.get("metin", ""))
        if govde == (m.get("metin") or "").rstrip() and baslik is None:
            continue
        ist["kuyruk_alinan"] += 1
        m["metin"] = govde
        if baslik is None:
            continue
        if i + 1 < len(maddeler) and not maddeler[i + 1].get("baslik"):
            maddeler[i + 1]["baslik"] = baslik
            ist["baslik_atanan"] += 1
        else:
            ist["baslik_atanamayan"] += 1
    return ist
