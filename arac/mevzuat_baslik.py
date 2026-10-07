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
_ROMA = re.compile(r"^\(?[IVX]+\s*[-–—]\s*")
_MADDE_ITEM = re.compile(r"^\(?\d+\)")
_DEGISIKLIK_REF = re.compile(r"md\.\)|\d{1,2}/\d{1,2}/\d{4}")
_BOLUM = re.compile(r"\b(BÖLÜM|K[Iİ]S[Iİl]M|USULÜ|HÜKÜMLER)\b")
_BUYUK_HARFLI = re.compile(r"^[A-ZÇĞİÖŞÜ]{2,}\s+[A-ZÇĞİÖŞÜlI]{2,}")
_DIPNOT = re.compile(r"\s*\[\d+\]\s*$")
_SINIRLAR = (". ", ") ", "] ", ".” ", '." ', ".» ")


def _son_cumle_siniri(metin: str) -> int:
    return max(metin.rfind(s) for s in _SINIRLAR)


def _rakam_orani(s: str) -> float:
    harf = [c for c in s if c.isalnum()]
    if not harf:
        return 0.0
    return sum(c.isdigit() for c in harf) / len(harf)


def _tek_tur(metin: str) -> tuple[str, str | None, bool]:
    """Bir tur kuyruk ayırma. Dönüş: (govde, baslik|None, degisti)."""
    t = (metin or "").rstrip()
    idx = _son_cumle_siniri(t)
    if idx < 0:
        return t, None, False
    kuyruk = t[idx + 2:].strip()
    if not kuyruk or re.search(r"[.;!?]$", kuyruk):
        return t, None, False
    if not _BASLANGIC.match(kuyruk) or _MADDE_ITEM.match(kuyruk):
        return t, None, False
    if _DEGISIKLIK_REF.search(kuyruk) or _rakam_orani(kuyruk) > 0.4:
        return t, None, False
    govde = t[: idx + 1].rstrip()
    # Bölüm/kısım başlığı ya da roma rakamlı üst başlık ya da BÜYÜK HARFLİ bölüm
    # artığı: gövdeden ayrılır ama madde başlığı olarak ATANMAZ (hangi parçanın
    # madde başlığı olduğu metinden güvenle çıkarılamaz).
    if _BOLUM.search(kuyruk) or _ROMA.match(kuyruk) or _BUYUK_HARFLI.match(kuyruk):
        return (govde, None, True) if len(kuyruk) <= 160 else (t, None, False)
    if len(kuyruk) > 90:
        return t, None, False
    baslik = _DIPNOT.sub("", kuyruk).strip().rstrip(":").strip()
    return govde, (baslik or None), True


def kuyruk_ayir(metin: str) -> tuple[str, str | None]:
    """(govde, baslik|None): govde = kuyruğu alınmış metin.

    Kuyruk, son cümle sınırından sonra kalan ve başlık gibi görünen kısa
    parçadır: 1-90 karakter, cümle sonu noktalaması yok, büyük harfle başlar,
    madde bendi değil, değişiklik künyesi değil, rakam ağırlıklı değil.
    Ayırma en çok üç tur yinelenir: madde başlığının önünde bölüm/kısım
    başlığı da yapışıksa ikisi de gövdeden düşer; başlık yalnız ilk (en
    dıştaki) turdan, o da madde başlığı ise atanır.
    """
    govde, baslik, degisti = _tek_tur(metin)
    tur = 0
    while degisti and tur < 2:
        yeni_govde, _, degisti = _tek_tur(govde)
        if not degisti:
            break
        govde = yeni_govde
        tur += 1
    return govde, baslik


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
