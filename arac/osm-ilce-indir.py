#!/usr/bin/env python3
# FAZ 2 (karar A, 2026-07-27) — OSM'den ilçe→il dizini.
# Kaynak: OpenStreetMap (ODbL) — Overpass API.
# YÖNTEM (v2): il-başına 81 sorgu 429/504 yedi (ölçülen) → İKİ toplu sorgu:
#   S1: TR'deki admin_level=4 (il) relation'ları ÜYELERİYLE (subarea rolleri
#       ilçe relation id'lerini verir).
#   S2: TR'deki admin_level=6 (ilçe) relation'larının id→ad etiketleri.
# Eşleme: il.subarea_ref → ilçe adı. Subarea üyesi olmayan il kalırsa
# raporlanır (sessiz boşluk yok).
# Çıktı: veri/potansiyel/ilce-il-dizini.json (türetilmiş — commit edilir).
import json, sys, time, urllib.parse, urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
ILKURUM = json.loads((KOK / "data/il-kurum.json").read_text())
ILLER = sorted({il for b in ILKURUM["dsiBolgeleri"].values() for il in b["iller"]})
assert len(ILLER) == 81
CIKTI = KOK / "veri/potansiyel/ilce-il-dizini.json"
UA = "suharitasi.com veri derleme"
UC = "https://overpass-api.de/api/interpreter"

S1 = """
[out:json][timeout:180];
area["ISO3166-1"="TR"]["admin_level"="2"]->.tr;
rel["admin_level"="4"]["boundary"="administrative"](area.tr);
out body;
"""
S2 = """
[out:json][timeout:180];
area["ISO3166-1"="TR"]["admin_level"="2"]->.tr;
rel["admin_level"="6"]["boundary"="administrative"](area.tr);
out tags;
"""

AYNALAR = [UC, "https://overpass.kumi.systems/api/interpreter"]

def kos(q):
    """3 deneme × 2 uç; 504/429'da artan bekleme. Sessiz hata yok —
    denemeler stderr'e loglanır, hepsi düşerse istisna yükselir."""
    son_hata = None
    for tur in range(3):
        for uc in AYNALAR:
            veri = urllib.parse.urlencode({"data": q}).encode()
            istek = urllib.request.Request(uc, data=veri, headers={"User-Agent": UA})
            try:
                with urllib.request.urlopen(istek, timeout=200) as c:
                    return json.load(c)
            except Exception as e:
                son_hata = e
                print(f"deneme tur={tur+1} uc={uc}: {e}", file=sys.stderr)
                time.sleep(20 * (tur + 1))
    raise son_hata

def main():
    iller_cevap = kos(S1)
    time.sleep(2)
    ilceler_cevap = kos(S2)

    # OSM iki ilde şapkalı yazım kullanıyor (ölçülen: Elâzığ, Hakkâri)
    sapka = str.maketrans("âîû", "aiu")
    def il_std(ad):
        return ad.translate(sapka) if ad else ad
    hedef = set(ILLER)
    il_rel = []
    for e in iller_cevap["elements"]:
        ad = il_std(e.get("tags", {}).get("name"))
        if ad in hedef:
            e["tags"]["name"] = ad
            il_rel.append(e)
    print(f"S1: il relation {len(il_rel)}/81")
    ilce_ad = {e["id"]: e["tags"]["name"]
               for e in ilceler_cevap["elements"] if e.get("tags", {}).get("name")}
    print(f"S2: ilçe relation {len(ilce_ad)}")

    dizin = {}
    subareasiz = []
    for il in il_rel:
        il_adi = il["tags"]["name"]
        refs = [m["ref"] for m in il.get("members", [])
                if m.get("role") == "subarea" and m.get("type") == "relation"]
        bulunan = [ilce_ad[r] for r in refs if r in ilce_ad]
        if not bulunan:
            subareasiz.append(il_adi)
        for ilce in bulunan:
            dizin.setdefault(ilce, set()).add(il_adi)

    sonuc = {
        "kaynak": "OpenStreetMap (Overpass API) — admin_level=4 subarea üyeliği → admin_level=6 ilçe",
        "lisans": "ODbL 1.0 — © OpenStreetMap katkıcıları",
        "erisim_tarihi": "2026-07-27",
        "not": ("Topluluk verisi; resmî idari bölünüş listesiyle çapraz doğrulama "
                "SIRADAKILER'de açık maddedir (kullanıcı kararı A, 2026-07-27)."),
        "il_sayisi": len(il_rel),
        "subarea_uyesiz_iller": subareasiz,
        "toplam_ilce_relation": len(ilce_ad),
        "ilceler": {k: sorted(v) for k, v in sorted(dizin.items())},
    }
    CIKTI.write_text(json.dumps(sonuc, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"benzersiz ilçe adı: {len(dizin)} | subarea'sız il: {subareasiz}")
    print("yazıldı:", CIKTI)
    return 0 if (len(il_rel) == 81 and not subareasiz) else 3

if __name__ == "__main__":
    sys.exit(main())
