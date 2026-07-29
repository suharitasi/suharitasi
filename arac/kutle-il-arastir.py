#!/usr/bin/env python3
"""BELİRSİZ KÜTLELERİN İL BAĞLAMI — NHYP metninde arama (M8, 29.07.2026).

DURUM: `veri/potansiyel/kutle-il.json`'da 5 kütle "belirsiz" — ad-dizin
eşlemesi iki il adayı verdi ve havza kesişimi tekilleştirmedi.

BU SCRIPT KARAR VERMEZ, KANIT TOPLAR. Kütle adının NHYP metninde geçtiği
her yeri bulur ve o paragraftaki il adlarını çıkarır. Çıktı, insanın (ya da
sonraki adımın) okuyabileceği bir kanıt dosyasıdır.

TAHMİN ATAMASI SIFIR (brief M8): metin ilin adını AÇIKÇA yazmıyorsa kütle
"il eşlemesi doğrulanamadı" olarak kalır. "Çivril Denizli'dedir" gibi dış
bilgi KULLANILMAZ — bu tam olarak KARARLAR.md §5'te durdurulmuş olan
çıkarımdır (il eşlemesi tahminle yapılmaz).

Kaynak: veri/ham/nhyp/<havza>/*.txt (29.07'de geri getirildi).
Çıktı  : cikti/denetim/kutle-il/M8-kanit.json
"""
import json, re, sys, unicodedata
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HAM = KOK / "veri/ham/nhyp"
KUTLE_IL = KOK / "veri/potansiyel/kutle-il.json"
CIKTI = KOK / "cikti/denetim/kutle-il/M8-kanit.json"
ILKURUM = json.loads((KOK / "data/il-kurum.json").read_text("utf-8"))
ILLER = sorted({il for b in ILKURUM["dsiBolgeleri"].values() for il in b["iller"]})
PENCERE = 700          # kütle adının çevresinde taranacak karakter


def normalize(s):
    """Türkçe-duyarlı küçültme + aksan katlama (arama için)."""
    t = s.replace("İ", "i").replace("I", "ı").lower()
    for a, b in (("ç", "c"), ("ğ", "g"), ("ı", "i"), ("ö", "o"), ("ş", "s"), ("ü", "u")):
        t = t.replace(a, b)
    return unicodedata.normalize("NFKD", t)


IL_NORM = {normalize(il): il for il in ILLER}


def metinler(havza):
    d = HAM / havza
    if not d.exists():
        return []
    return sorted(d.glob("*.txt"))


def main():
    d = json.loads(KUTLE_IL.read_text("utf-8"))
    belirsiz = [k for k in d["kutleler"] if k.get("durum") == "belirsiz"]
    print(f"belirsiz kütle: {len(belirsiz)}", file=sys.stderr)
    sonuc = []

    for k in belirsiz:
        ad = k["kutle_adi"]
        # "Çivril -Dinar" gibi adlarda parçaları ayrı ayrı da ararız.
        parcalar = [p.strip() for p in re.split(r"[-–/]", ad) if len(p.strip()) >= 4]
        aranacak = [ad] + [p for p in parcalar if p != ad]
        kayit = {"kutle_kodu": k["kutle_kodu"], "kutle_adi": ad, "havza": k["havza"],
                 "adaylar": k["kanit"]["adaylar"], "gecisler": [], "bulunan_iller": {}}

        for yol in metinler(k["havza"]):
            ham = yol.read_text("utf-8", errors="replace")
            ham_n = normalize(ham)
            for terim in aranacak:
                t_n = normalize(terim)
                for m in re.finditer(re.escape(t_n), ham_n):
                    bas, son = max(0, m.start() - PENCERE), m.end() + PENCERE
                    pencere = ham[bas:son]
                    pencere_n = ham_n[bas:son]
                    iller = sorted({IL_NORM[i] for i in IL_NORM if
                                    re.search(rf"(?<![a-z]){re.escape(i)}(?![a-z])", pencere_n)})
                    if not iller:
                        continue
                    kayit["gecisler"].append({
                        "dosya": yol.name, "terim": terim, "konum": m.start(),
                        "iller": iller,
                        "alinti": re.sub(r"\s+", " ", pencere)[:300],
                    })
                    for il in iller:
                        kayit["bulunan_iller"][il] = kayit["bulunan_iller"].get(il, 0) + 1

        # KARAR KURALI (tahmin yok): yalnız ADAY illerden metinde geçenler sayılır.
        adaylarda = {il: n for il, n in kayit["bulunan_iller"].items() if il in kayit["adaylar"]}
        kayit["adaylardan_metinde_gecen"] = adaylarda
        if len(adaylarda) == 1:
            kayit["oneri"] = {"durum": "tek aday metinde", "iller": list(adaylarda)}
        elif len(adaylarda) == 2:
            kayit["oneri"] = {"durum": "iki aday da metinde — kütle iki ile YAYILIYOR olabilir",
                              "iller": sorted(adaylarda)}
        else:
            kayit["oneri"] = {"durum": "metinde aday il geçmiyor — doğrulanamadı", "iller": []}
        sonuc.append(kayit)
        print(f"  {k['kutle_kodu']:<14} {ad:<24} geçiş {len(kayit['gecisler']):>3} "
              f"· adaylardan metinde: {adaylarda or '—'} → {kayit['oneri']['durum']}",
              file=sys.stderr)

    CIKTI.parent.mkdir(parents=True, exist_ok=True)
    CIKTI.write_text(json.dumps({"tarih": "2026-07-29", "kutleler": sonuc},
                                ensure_ascii=False, indent=1), "utf-8")
    print(f"yazıldı: {CIKTI}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
