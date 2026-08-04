#!/usr/bin/env python3
"""
ilce-morfoloji-uret.py — Il duzeyindeki morfoloji verisinden ilce bazli
deterministik varyasyonlar turetir.

Calisma prensibi:
- Her ilce adi hash'lenerek deterministik bir tohum (seed) uretilir
- Il duzeyindeki duz_oran, vadi_oran, ort_egim degerleri bu tohuma gore
  ±%15 araliginda varyasyon gosterir
- Ayni ilce her zaman ayni degeri alir (tekrar uretilebilir)
- Varyasyon sinirlidir; ilce verisi IL VERiSiNDEN TÜRETiLMiSTiR (gercek
  ilce bazli olcum DEGiLDiR)

Cikti: veri/potansiyel/ilce-morfoloji.json
"""
import json, os, hashlib, sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def hash_to_seed(name):
    """Isimden deterministik 0-1 arasi seed."""
    h = hashlib.md5(name.encode()).hexdigest()
    return int(h[:8], 16) / 0xFFFFFFFF

def vary(deger, seed, pct=0.15):
    """Degeri seed'e gore ±pct araliginda degistir."""
    if deger is None:
        return None
    offset = (seed - 0.5) * 2 * pct  # -pct ile +pct arasi
    return round(deger * (1 + offset), 6)

def main():
    # Il morfoloji verisini yukle
    morf_path = os.path.join(PROJECT_ROOT, "veri", "potansiyel", "morfoloji.json")
    with open(morf_path) as f:
        morf = json.load(f)

    # Ilce → il dizini
    ilce_path = os.path.join(PROJECT_ROOT, "veri", "potansiyel", "ilce-il-dizini.json")
    with open(ilce_path) as f:
        ilce_dizin = json.load(f)

    ilceler = ilce_dizin.get("ilceler", {})
    il_morf = morf.get("iller", {})

    uretilen = 0
    eksik_il = 0
    ilce_morf = {}

    for ilce_ad, iller in ilceler.items():
        il = iller[0] if iller else None
        if not il or il not in il_morf:
            eksik_il += 1
            continue

        base = il_morf[il]
        # Ilce adi + il adi ile benzersiz seed
        seed = hash_to_seed(f"{ilce_ad}|{il}")
        # Ilce yuzolcumu yerine isim uzunlugu/konumdan turetilen ek carpan
        # (gercek ilce yuzolcumu verisi olmadigi icin)
        alan_carpani = 0.7 + seed * 0.6  # 0.7 - 1.3 arasi

        ilce_morf[ilce_ad] = {
            "il": il,
            "duz_oran": vary(base.get("dusuk_egim_orani_yuzde"), seed, 0.15),
            "vadi_oran": vary(base.get("vadi_tabani_orani_yuzde"), hash_to_seed(f"vadi|{ilce_ad}"), 0.15),
            "ort_egim": vary(base.get("ortalama_egim_derece"), hash_to_seed(f"egim|{ilce_ad}"), 0.10),
            "kaynak": "il duzeyindeki Copernicus GLO-90 DEM verisinden ilce adi bazli deterministik varyasyonla TÜRETiLMiSTiR — gercek ilce olcumu DEGiLDiR",
        }
        uretilen += 1

    out = {
        "kunye": {
            "uretim": "ilce-morfoloji-uret.py",
            "yontem": "il morfoloji verisinden deterministik varyasyon (±%15)",
            "uretim_tarihi": "2026-08-04",
            "not": "Bu veri GERCEK ilce olcumu DEGiLDiR. Il duzeyindeki Copernicus GLO-90 DEM verisinden ilce ismiyle tohuma bagli varyasyonla turetIlMiStiR.",
        },
        "ilce_sayisi": uretilen,
        "eksik_il_sayisi": eksik_il,
        "ilceler": ilce_morf,
    }

    out_path = os.path.join(PROJECT_ROOT, "veri", "potansiyel", "ilce-morfoloji.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f"→ {out_path}")
    print(f"  {uretilen} ilce uretildi, {eksik_il} eksik il")
    # Ornek cikti
    for ad in ["Kadıköy", "Çankaya", "Çeşme", "Bozkurt", "Ortahisar"]:
        if ad in ilce_morf:
            d = ilce_morf[ad]
            print(f"  {ad} ({d['il']}): duz={d['duz_oran']:.1f}%, vadi={d['vadi_oran']:.1f}%, egim={d.get('ort_egim','?')}°")


if __name__ == "__main__":
    main()
