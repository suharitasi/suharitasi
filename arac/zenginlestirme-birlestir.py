#!/usr/bin/env python3
# FAZ 4 birleştirici — dört alt işin çıktısını tek dosyada toplar:
#   4.A veri/potansiyel/mta-katalog.json
#   4.B veri/potansiyel/akademik-kunye.json (OpenAlex ikamesi)
#   4.C TÜİK: "veri yok" (MEDAS kanıtıyla — rapor)
#   4.D veri/potansiyel/osm-su-noktalari.json
# Çıktı: veri/potansiyel/zenginlestirme.json — il başına dört kalem;
# kapsanamayan kalem "veri yok" (brief bitti-tanımı).
import json, sys
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
P = KOK / "veri/potansiyel"
mta = json.loads((P / "mta-katalog.json").read_text())
aka = json.loads((P / "akademik-kunye.json").read_text())
osm = json.loads((P / "osm-su-noktalari.json").read_text())
ILKURUM = json.loads((KOK / "data/il-kurum.json").read_text())
ILLER = sorted({il for b in ILKURUM["dsiBolgeleri"].values() for il in b["iller"]})

VERI_YOK = "veri yok"
iller = {}
for il in ILLER:
    mta_k = mta["iller"].get(il)
    aka_k = aka["iller"].get(il)
    osm_k = osm["iller"].get(il)
    iller[il] = {
        "mta_kunyeleri": ([{"rapor_adi": k["rapor_adi"], "url": k["url"],
                            "product_id": k["product_id"]} for k in mta_k]
                          if mta_k else VERI_YOK),
        "akademik_kunyeler": (aka_k if aka_k else VERI_YOK),
        "tuik_yas_payi": VERI_YOK,  # 4.C kanıtı: rapor/potansiyel-faz4.md
        "osm_su_noktalari": ({"kaynak_spring": osm_k["kaynak_spring"],
                              "kuyu_water_well": osm_k["kuyu_water_well"],
                              "etiket": "topluluk verisi, resmî doğrulanmadı"}
                             if osm_k else VERI_YOK),
    }

sonuc = {
    "uretim_tarihi": "2026-07-27",
    "kaynaklar": {
        "mta": mta["kaynak"], "akademik": aka["kaynak"],
        "tuik": ("Su ve Atıksu İstatistikleri — il düzeyinde kaynak-türü "
                 "kırılımı YOK (TÜİK MEDAS gösterge listesi, 2026-07-27 "
                 "headless incelemesi) → kalem kapalı: veri yok"),
        "osm": osm["kaynak"] + " — " + osm["lisans"],
    },
    "ikame_notu": aka.get("ikame_notu"),
    "ozet": {
        "mta_kunye_toplam": mta["toplam_kunye"],
        "mta_il_kapsami": len(mta["iller"]),
        "mta_il_atanamayan": mta["il_atanamayan_sayisi"],
        "akademik_kunye_toplam": aka["toplam_kunye"],
        "akademik_il_kapsami": aka["il_kapsami"],
        "osm_spring_toplam": osm["toplamlar"]["spring"] - osm["toplamlar"]["spring_poligon_disi"],
        "osm_well_toplam": osm["toplamlar"]["water_well"] - osm["toplamlar"]["water_well_poligon_disi"],
        "tuik": VERI_YOK,
    },
    "iller": iller,
}
(P / "zenginlestirme.json").write_text(
    json.dumps(sonuc, ensure_ascii=False, indent=1), encoding="utf-8")
print("özet:", json.dumps(sonuc["ozet"], ensure_ascii=False))
eksik = {il: [k for k, v in kalemler.items() if v == VERI_YOK]
         for il, kalemler in iller.items()}
tam_bos = [il for il, e in eksik.items() if len(e) == 4]
print(f"4 kalemi de 'veri yok' olan il: {len(tam_bos)} {tam_bos}")
print("yazıldı:", P / "zenginlestirme.json")
