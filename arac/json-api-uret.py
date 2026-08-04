#!/usr/bin/env python3
"""
json-api-uret.py — Havza ve il verilerini makine-okunur JSON olarak disari aktarir.
Her build'de dist/veri/ altina yazar.

Kullanim:
  python3 arac/json-api-uret.py --cikti dist/veri/
"""
import json, os, sys, argparse

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def havza_json_uret(cikti_dizin):
    """Her havza icin birlestirilmis JSON"""
    hv_yolu = os.path.join(PROJECT_ROOT, "data/havza-veri.json")
    gr_yolu = os.path.join(PROJECT_ROOT, "data/canli/grace-havza.json")
    bj_yolu = os.path.join(PROJECT_ROOT, "data/canli/baraj.json")
    il_yolu = os.path.join(PROJECT_ROOT, "data/il-kurum.json")

    hv = json.load(open(hv_yolu))
    gr = json.load(open(gr_yolu)) if os.path.exists(gr_yolu) else {}
    bj = json.load(open(bj_yolu)) if os.path.exists(bj_yolu) else {}
    ik = json.load(open(il_yolu)) if os.path.exists(il_yolu) else {}

    havza_dizin = os.path.join(cikti_dizin, "havza")
    os.makedirs(havza_dizin, exist_ok=True)

    for vd in hv["havzalar"]:
        slug = vd["ad"].lower().replace(" ", "-").replace("ı", "i").replace("ğ", "g").replace("ü", "u").replace("ş", "s").replace("ö", "o").replace("ç", "c").replace("havzası", "")
        epias_ad = vd["ad"].replace(" Havzası", "")
        g_seri = gr.get("havzalar", {}).get(vd["ad"], {}).get("seri", {})
        b_h = bj.get("havzalar", {}).get(epias_ad, {})

        # Aylik GRACE serisini duzgun formata cevir
        grace_aylik = [{"ay": k, "cm": v} for k, v in sorted(g_seri.items())]

        # Baraj listesi
        baraj_liste = []
        for ad, b in b_h.get("barajlar", {}).items():
            baraj_liste.append({
                "ad": ad, "doluluk": b.get("doluluk"),
                "son_gun": max(b.get("seri", {}).keys()) if b.get("seri") else None
            })

        # Havza illeri
        havza_iller = ik.get("havzaIlleri", {}).get(vd.get("no"), {}).get("iller", [])

        cikti = {
            "ad": vd["ad"],
            "no": vd.get("no"),
            "yagis_alani_km2": vd.get("yagisAlani_km2"),
            "yuzey_suyu_potansiyeli_km3": vd.get("yuzeysuyuPotansiyeli_km3"),
            "yas_beslenimi_hm3": vd.get("yasBeslenimi_hm3"),
            "yas_isletme_rezervi_hm3": vd.get("yasIsletmeRezervi_hm3"),
            "tahsis": vd.get("tahsis"),
            "eylem_plani": vd.get("eylemPlani"),
            "iller": havza_iller,
            "barajlar": baraj_liste,
            "grace_aylik_seri": grace_aylik,
            "kunye": {
                "kaynaklar": hv.get("kaynaklar", {}),
                "uretim_tarihi": "build-time",
                "lisans_notu": "Veriler resmi kaynaklardan derlenmistir. Ticari kullanim icin kaynak kuruluslara danisiniz.",
            }
        }

        yol = os.path.join(havza_dizin, f"{slug}.json")
        with open(yol, "w") as f:
            json.dump(cikti, f, ensure_ascii=False, indent=2)
        print(f"  {slug}.json")

    print(f"  {len(hv['havzalar'])} havza JSON → {havza_dizin}/")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--cikti", default="dist/veri")
    args = p.parse_args()
    havza_json_uret(args.cikti)
    print("\nTamamlandi.")


if __name__ == "__main__":
    main()
