#!/usr/bin/env python3
# FAZ 3 — Resmî Gazete YAS işletme sahası taraması.
# Yöntem: Faz 0.4'te doğrulanan /Home/Filter DataTables-JSON ucu
# (searchtype=1 başlık). Üç yazım varyantı; sayfalamalı; istekler arası
# ≥1 sn (G5). Ham cevaplar veri/ham/rg/ altına (gitignore), türetilmiş
# kayıtlar veri/potansiyel/isletme-sahalari.json'a.
# G3: il/ilçe/durum başlıktan çıkarılamazsa "belirsiz"/"veri yok" etiketi;
# her kayıtta RG tarih+sayı + fihrist URL (kaynaksız kayıt SIFIR).
import json, re, sys, time, urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HAM = KOK / "veri/ham/rg"
CIKTI = KOK / "veri/potansiyel/isletme-sahalari.json"
UA = "suharitasi.com veri derleme"
UC = "https://www.resmigazete.gov.tr/Home/Filter"
VARYANTLAR = ["yeraltısuyu işletme sahası",
              "yeraltı suyu işletme sahası",
              "YAS işletme sahası"]

ILKURUM = json.loads((KOK / "data/il-kurum.json").read_text())
ILLER = sorted({il for b in ILKURUM["dsiBolgeleri"].values() for il in b["iller"]})
ILCE = json.loads((KOK / "veri/potansiyel/ilce-il-dizini.json").read_text())["ilceler"]

TR_KUCUK = str.maketrans("ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ",
                          "abcçdefgğhıijklmnoöprsştuüvyz")
def norm(s):
    return s.translate(TR_KUCUK).strip()

IL_NORM = {norm(il): il for il in ILLER}
ILCE_NORM = {}
for _ilce, _iller in ILCE.items():
    ILCE_NORM.setdefault(norm(_ilce), (_ilce, _iller))

def sorgu(kelime, start, length=25):
    govde = json.dumps({"draw": 1, "start": start, "length": length,
                        "parameters": {"searchtype": "1",
                                       "genelaranacakkelime": kelime,
                                       "genelbaslangictarihi": "",
                                       "genelbitistarihi": "", "genelsayi": ""}})
    istek = urllib.request.Request(
        UC, data=govde.encode(),
        headers={"User-Agent": UA, "Content-Type": "application/json; charset=utf-8"})
    with urllib.request.urlopen(istek, timeout=60) as c:
        return json.load(c)

def durum_sinifla(baslik):
    # çift boşluk + "Sahaları" çoğulu sınıflamayı düşürüyordu (ölçülen)
    b = re.sub(r"\s+", " ", norm(baslik))
    if "kapalı ova" in b:
        return "kapalı ova"
    if any(k in b for k in ("yasak", "kapatıl", "kapatma", "tahsise kapal",
                            "durdurul")):
        return "tahsise kapatma"
    if "işletme saha" in b and any(k in b for k in
            ("kabul", "ilan", "ilân", "tespit", "karar", "değiştiril",
             "genişletil", "belirlen")):
        return "işletme sahası ilanı/değişikliği"
    return "belirsiz (başlıktan sınıflanamadı)"

def yer_cikar(baslik):
    """Başlıktan il + ilçe adayları — TAM KELİME; ambiguous ilçe adı il
    listesi olarak kalır."""
    kelimeler = re.split(r"[^A-Za-zÇĞİÖŞÜçğıöşü]+", baslik)
    iller, ilceler = set(), {}
    # tek + iki-kelimelik pencereler (Afyon Karahisar vb.)
    adaylar = list(kelimeler) + [" ".join(p) for p in zip(kelimeler, kelimeler[1:])]
    for a in adaylar:
        n = norm(a)
        if n in IL_NORM:
            iller.add(IL_NORM[n])
        elif n in ILCE_NORM:
            ad, hangi_iller = ILCE_NORM[n]
            ilceler[ad] = hangi_iller
    return sorted(iller), ilceler

def main():
    HAM.mkdir(parents=True, exist_ok=True)
    kayitlar = {}
    varyant_sayilari = {}
    for v in VARYANTLAR:
        toplam = None
        start = 0
        alinan = 0
        while True:
            cevap = sorgu(v, start)
            time.sleep(1)
            if toplam is None:
                toplam = cevap.get("recordsTotal", 0)
            veri = cevap.get("data", [])
            if not veri:
                break
            (HAM / f"{norm(v).replace(' ', '-')}-{start}.json").write_text(
                json.dumps(cevap, ensure_ascii=False), encoding="utf-8")
            for r in veri:
                anahtar = (r.get("url") or "") + "|" + (r.get("konu") or "")
                if anahtar in kayitlar:
                    kayitlar[anahtar]["bulan_varyantlar"].append(v)
                    continue
                baslik = (r.get("konu") or "").strip()
                iller, ilceler = yer_cikar(baslik)
                # ilçelerden il çıkarımı: tekil ilçe-illeri il setine eklenir
                ilce_il = {il for ils in ilceler.values() if len(ils) == 1 for il in ils}
                il_seti = sorted(set(iller) | ilce_il)
                kayitlar[anahtar] = {
                    "saha_adi": baslik,  # başlık = resmî tanım; ayrıştırma yapılmaz
                    "il": il_seti if il_seti else "belirsiz (başlıktan çıkarılamadı)",
                    "ilceler": {k: v2 for k, v2 in ilceler.items()},
                    "durum": durum_sinifla(baslik),
                    "rg_tarih": r.get("resmiGazeteTarihiFormatted"),
                    "rg_sayi": r.get("resmiGazeteSayisi"),
                    "mukerrer": r.get("mukerrer") or None,
                    "mevzuat_turu": r.get("mevzuatAdi") or None,
                    "kaynak_url": r.get("url"),
                    "bulan_varyantlar": [v],
                }
            alinan += len(veri)
            start += len(veri)
            if start >= toplam:
                break
        varyant_sayilari[v] = {"beyan_toplam": toplam, "alinan": alinan}
        print(f"varyant '{v}': beyan={toplam} alınan={alinan}")
    def tarih_anahtari(r):
        # "dd.mm.yyyy" → (yyyy, mm, dd); tarihi bozuk kayıt sona
        m = re.match(r"(\d{2})\.(\d{2})\.(\d{4})", r["rg_tarih"] or "")
        return (m.group(3), m.group(2), m.group(1)) if m else ("9999", "", "")
    kayit_listesi = sorted(kayitlar.values(), key=tarih_anahtari)
    kaynaksiz = [r for r in kayit_listesi
                 if not ((r["rg_tarih"] and r["rg_sayi"]) or r["kaynak_url"])]
    # Kapsam ölçümü: içerik (searchtype=4) ve ilan (searchtype=5) aramaları
    # gazete-GÜNÜ işaretçisi döndürür (başlık/saha adı YOK) — kayıt setine
    # dönüştürülmez (G3), yalnız kapsam boşluğu kanıtı olarak sayılır.
    ek_tarama = {}
    for st in ("4", "5"):
        try:
            govde = json.dumps({"draw": 1, "start": 0, "length": 1,
                                "parameters": {"searchtype": st,
                                               "genelaranacakkelime": VARYANTLAR[0],
                                               "genelbaslangictarihi": "",
                                               "genelbitistarihi": "", "genelsayi": ""}})
            istek = urllib.request.Request(UC, data=govde.encode(),
                headers={"User-Agent": UA,
                         "Content-Type": "application/json; charset=utf-8"})
            with urllib.request.urlopen(istek, timeout=60) as c:
                ek_tarama[f"searchtype{st}"] = json.load(c).get("recordsTotal")
            time.sleep(1)
        except Exception as e:
            ek_tarama[f"searchtype{st}"] = f"hata: {e}"
    sonuc = {
        "uretim_tarihi": "2026-07-27",
        "kaynak": "T.C. Resmî Gazete arama (resmigazete.gov.tr /Home/Filter, başlık araması)",
        "varyantlar": varyant_sayilari,
        "ek_tarama_isabetleri": {
            **ek_tarama,
            "not": ("içerik(4)/ilan(5) aramaları gazete-günü işaretçisidir; "
                    "saha adı/il içermediğinden kayda dönüştürülmedi. Başlık "
                    "araması 1963-1980 kararnamelerini kapsıyor; sonraki "
                    "ilanlar için kapsam boşluğu raporda.")},
        "not": ("Kayıtlar RG başlık aramasından; saha_adi = resmî başlık "
                "(ayrıştırılmadı). il/ilçe başlıktan TAM KELİME çıkarımı; "
                "çıkarılamayan 'belirsiz'. Faz 0.6: resmî konsolide "
                "kapalı-saha listesi açık bulunamadığından 3.2 çapraz "
                "doğrulaması yapılamadı (bilgi edinme adayı)."),
        "kayit_sayisi": len(kayit_listesi),
        "kaynaksiz_kayit": len(kaynaksiz),
        "kayitlar": kayit_listesi,
    }
    CIKTI.write_text(json.dumps(sonuc, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"benzersiz kayıt: {len(kayit_listesi)} | kaynaksız: {len(kaynaksiz)}")
    print("yazıldı:", CIKTI)
    return 0 if not kaynaksiz else 3

if __name__ == "__main__":
    sys.exit(main())
