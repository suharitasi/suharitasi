#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""aylik-rapor-uret.py — Otonom aylık hidroloji/kuraklık raporu (Modül 4).

BİLİMSEL İLKE (uydurma yasağı): Rapor DETERMİNİSTİK şablondan üretilir; hiçbir
sayı elle yazılmaz, hiçbir cümle gerçek veride olmayan bir olgu iddia etmez.
LLM kullanılmaz (halüsinasyon riski = 0). Tüm değerler veri dosyalarından
hesaplanır; ölçüm ve TAHMİN metinde ayrı etiketlenir.

Çıktı: src/content/raporlar/<YYYY-MM>.md (frontmatter + markdown)
Kullanım: python3 arac/rapor/aylik-rapor-uret.py [--donem 2026-10] [--kuru]
"""
from __future__ import annotations
import argparse
import json
from datetime import date, datetime, timezone
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent.parent
AYLAR = ["", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz",
         "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]


def oku(rel):
    p = KOK / rel
    if not p.exists():
        raise SystemExit(f"HATA: veri yok: {rel} (sessiz hata yasağı)")
    return json.loads(p.read_text(encoding="utf-8"))


def yuv(x, n=2):
    return round(float(x), n)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--donem", default=None, help="YYYY-MM (varsayılan: bu ay)")
    ap.add_argument("--kuru", action="store_true")
    a = ap.parse_args()
    bugun = datetime.now(timezone.utc).date()
    donem = a.donem or f"{bugun.year}-{bugun.month:02d}"
    yil, ay = map(int, donem.split("-"))

    baraj = oku("data/canli/baraj.json")
    grace = oku("data/canli/grace-havza.json")
    tahmin = oku("data/tahmin/kuraklik-projeksiyonu.json")
    iklim = oku("data/canli/nasa-power.json")

    # — Baraj: ulusal günlük ortalama seri —
    gunluk: dict = {}
    for h in baraj["havzalar"].values():
        for b in h.get("barajlar", {}).values():
            for gun, v in (b.get("seri") or {}).items():
                if v and v.get("doluluk") is not None:
                    gunluk.setdefault(gun, []).append(v["doluluk"])
    gunler = sorted(gunluk)
    ort = {g: sum(v) / len(v) for g, v in gunluk.items()}
    son_gun = gunler[-1]
    son_ort = ort[son_gun]
    onceki_gun = gunler[-31] if len(gunler) > 31 else gunler[0]
    delta = son_ort - ort[onceki_gun]

    # havza bazlı son + 30g fark
    hb = []
    for ad, h in baraj["havzalar"].items():
        ser = {}
        for b in h.get("barajlar", {}).values():
            for gun, v in (b.get("seri") or {}).items():
                if v and v.get("doluluk") is not None:
                    ser.setdefault(gun, []).append(v["doluluk"])
        gs = sorted(ser)
        if not gs:
            continue
        sn = sum(ser[gs[-1]]) / len(ser[gs[-1]])
        g30 = gs[-31] if len(gs) > 31 else gs[0]
        o30 = sum(ser[g30]) / len(ser[g30])
        hb.append({"ad": ad.replace(" Havzası", ""), "son": yuv(sn), "fark": yuv(sn - o30)})
    hb.sort(key=lambda x: x["fark"])
    dusen = hb[:4]
    yukselen = [x for x in reversed(hb) if x["fark"] > 0][:3]

    # — GRACE: anlamlı azalan havzalar (tahmin dosyasındaki MK çıktısından) —
    gra = []
    for ad, v in tahmin["havzalar"].items():
        g = v.get("grace")
        if g:
            gra.append({"ad": ad, "egilim": g["egilim_aylik_cm"], "mk": g["mk_anlamli"],
                        "son": g["son_deger"], "alti": g["projeksiyon"][5]["deger"]})
    gra_az = sorted([x for x in gra if x["egilim"] < 0], key=lambda x: x["egilim"])[:5]

    # — Tahmin: 6 aylık GRACE projeksiyonu (birkaç havza) —
    orn = []
    for ad in ["Konya Kapalı", "Sakarya", "Doğu Karadeniz"]:
        v = tahmin["havzalar"].get(ad, {}).get("grace")
        if v:
            orn.append({"ad": ad, "son": v["son_deger"], "alti": v["projeksiyon"][5]["deger"],
                        "alt": v["projeksiyon"][5]["alt95"], "ust": v["projeksiyon"][5]["ust95"]})

    # — İklim: en kurak/yağışlı (NASA POWER) —
    ik = [(ad.replace(" Havzası", ""), v["yagis_ann_mm_gun"]) for ad, v in iklim["havzalar"].items() if "hata" not in v]
    ik.sort(key=lambda x: x[1])
    en_kurak = ik[:3]
    en_yagisli = ik[-3:][::-1]

    baslik = f"Aylık Türkiye Hidroloji ve Kuraklık Raporu — {AYLAR[ay]} {yil}"
    ozet = (f"{son_gun} itibarıyla izlenen havzalarda ortalama baraj doluluğu %{yuv(son_ort)}, "
            f"son 30 günde {yuv(delta)} puan. Baraj doluluğu en çok {dusen[0]['ad']} havzasında geriledi "
            f"({yuv(dusen[0]['fark'])} puan). GRACE uydu verisinde en hızlı azalan havza "
            f"{gra_az[0]['ad'] if gra_az else '—'}. Tahmin bölümünde ölçüm değil projeksiyon sunulur.")
    if len(ozet) > 400:
        ozet = ozet[:397] + '...'

    L = []
    L.append("Bu rapor, Su Haritası otonom veri hattı tarafından **ölçülen veriden** üretilmiştir. "
             "Tüm değerler kaynak dosyalardan hesaplanır; hiçbir sayı elle girilmemiştir ve "
             "rapor bir dil modeli tarafından yazılmamıştır (uydurma yasağı).")
    L.append("")
    L.append("## Öne çıkanlar")
    L.append("")
    L.append(f"- **Baraj doluluğu** (ulusal ortalama, son ölçüm {son_gun}): **%{yuv(son_ort)}** "
             f"(30 gün önce %{yuv(ort[onceki_gun])}; değişim {yuv(delta)} puan).")
    L.append(f"- **En çok gerileyen havzalar (30 gün):** " +
             ", ".join(f"{x['ad']} ({x['fark']} puan)" for x in dusen) + ".")
    L.append(f"- **En çok yükselen havzalar (30 gün):** " +
             (", ".join(f"{x['ad']} (+{x['fark']} puan)" for x in yukselen) if yukselen
              else "bu dönemde artış gösteren havza yok") + ".")
    if gra_az:
        L.append(f"- **Su depolama (GRACE, mevsimsellik arındırılmış aylık eğilim):** en hızlı azalan " +
                 ", ".join(f"{x['ad']} ({x['egilim']} cm/ay)" for x in gra_az[:3]) + ".")
    L.append("")
    L.append("## Baraj doluluğu (ölçüm)")
    L.append("")
    L.append("| Havza | Son doluluk (%) | 30 günlük değişim (puan) |")
    L.append("|---|---|---|")
    for x in hb:
        L.append(f"| {x['ad']} | {x['son']} | {x['fark']} |")
    L.append("")
    L.append(f"_Kaynak: EPİAŞ Şeffaflık Platformu (günlük). Seri: {gunler[0]} → {son_gun}._")
    L.append("")
    L.append("## Su depolama eğilimi — GRACE uydu verisi (ölçüm)")
    L.append("")
    L.append("Mevsimsellikten arındırılmış aylık eğilim (cm/ay). Mann-Kendall testiyle anlamlılık (p<0,05).")
    L.append("")
    L.append("| Havza | Son değer (cm) | Eğilim (cm/ay) | Anlamlı |")
    L.append("|---|---|---|---|")
    for x in gra_az:
        L.append(f"| {x['ad']} | {x['son']} | {x['egilim']} | {'evet' if x['mk'] else 'hayır'} |")
    L.append("")
    L.append("## Tahminsel analitik (PROJEKSİYON — ölçüm değil)")
    L.append("")
    L.append("Aşağıdaki değerler geçmiş gözlemlere dayanan **istatistiksel tahminlerdir**; "
             "gerçekleşmesi garanti edilmez ve resmî bir uyarı değildir.")
    L.append("")
    L.append("| Havza | Son ölçüm (cm) | 6 ay sonra (tahmin, cm) | 95% aralık |")
    L.append("|---|---|---|---|")
    for x in orn:
        L.append(f"| {x['ad']} | {x['son']} | {x['alti']} | [{x['alt']} … {x['ust']}] |")
    L.append("")
    L.append("## İklim görünümü — NASA POWER (ölçüm/iklim, 1981-2010)")
    L.append("")
    L.append(f"- **En kurak havzalar (yıllık yağış):** " +
             ", ".join(f"{ad} ({round(mm*365)} mm/yıl)" for ad, mm in en_kurak) + ".")
    L.append(f"- **En yağışlı havzalar:** " +
             ", ".join(f"{ad} ({round(mm*365)} mm/yıl)" for ad, mm in en_yagisli) + ".")
    L.append("")
    L.append("## Yöntem ve kaynaklar")
    L.append("")
    L.append("- **Baraj doluluğu:** EPİAŞ (günlük); ulusal/havza ortalamaları bu raporda hesaplanır.")
    L.append("- **Su depolama:** NASA GRACE/GRACE-FO mascon (aylık), havza ölçeğinde.")
    L.append("- **İklim:** NASA POWER 1981-2010 klimatolojisi (yağış, sıcaklık, toprak nemi).")
    L.append("- **Projeksiyon:** mevsimsel ayrıştırma + OLS trend + Mann-Kendall (numpy). "
             "Ayrıntı ve uçlar: [/api-dokumantasyonu/](/api-dokumantasyonu/).")
    L.append("")
    L.append("_Bu rapor bilgilendirme amaçlıdır; hukuki görüş veya resmî tahmin değildir._")

    front = [
        "---",
        f'baslik: "{baslik}"',
        f'ozet: "{ozet}"',
        f"tarih: {date(yil, ay, 1).isoformat()}",
        f'donem: "{donem}"',
        'yazar: "Su Haritası Otonom Sistemi"',
        f'etiketler: ["hidroloji", "kuraklık", "baraj", "GRACE", "tahmin", "{donem}"]',
        f'veriAraligi: "baraj {gunler[0]}..{son_gun} · GRACE 2002-04..2026-03"',
        "---",
        "",
    ]
    icerik = "\n".join(front) + "\n".join(L) + "\n"

    hedef = KOK / "src" / "content" / "raporlar" / f"{donem}.md"
    if a.kuru:
        print(f"[kuru] {donem} raporu ({len(icerik)} bayt), yazılmadı")
        return 0
    hedef.parent.mkdir(parents=True, exist_ok=True)
    hedef.write_text(icerik, encoding="utf-8")
    print(f"yazıldı: {hedef}")


if __name__ == "__main__":
    raise SystemExit(main())
