#!/usr/bin/env python3
# EK İŞ (kullanıcı onayı 2026-07-27) — DSİ duyuru/haber arşivi taraması.
# Liste sayfaları gezilir (duyuru + haber arşivi), başlığı YAS/işletme
# sahası/kapalı ova/kuyu ile eşleşen kayıtların DETAY sayfasından tarih +
# pasaj alınır. Kanıt kuralı: her kayıtta başlık + detay URL (+ varsa
# tarih + pasaj); pasajsız kayıt yalnız başlık+URL ile girer (o da resmî
# kaynak künyesidir). Çıktı: veri/potansiyel/dsi-duyurular.json
import json, re, sys, time, urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
CIKTI = KOK / "veri/potansiyel/dsi-duyurular.json"
UA = "suharitasi.com veri derleme"
KOKURL = "https://www.dsi.gov.tr"
FILTRE = re.compile(r"yeraltı ?su|yas [is]|işletme saha|kapalı ova|kuyu|sondaj", re.I)

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

def getir(url):
    istek = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(istek, timeout=60) as c:
        return c.read().decode("utf-8", errors="replace")

def entity_coz(s):
    import html
    return html.unescape(s)

def yer_cikar(metin):
    kelimeler = re.split(r"[^A-Za-zÇĞİÖŞÜçğıöşü]+", metin)
    adaylar = list(kelimeler) + [" ".join(p) for p in zip(kelimeler, kelimeler[1:])]
    iller = set()
    for a in adaylar:
        n = norm(a)
        if n in IL_NORM:
            iller.add(IL_NORM[n])
        elif n in ILCE_NORM and len(ILCE_NORM[n][1]) == 1:
            iller.add(ILCE_NORM[n][1][0])
    return sorted(iller)

def liste_tara(yol_kalibi, tur):
    bulunan = {}
    sayfa = 1
    bos_ust_uste = 0
    onceki_idler = set()
    while sayfa <= 60 and bos_ust_uste < 2:
        url = yol_kalibi.format(sayfa=sayfa)
        try:
            h = getir(url)
        except Exception as e:
            print(f"{tur} sayfa {sayfa} indirilemedi: {e}", file=sys.stderr)
            break
        bloklar = re.findall(r'href="(/(?:Duyuru|Haber)/Detay/\d+)"(.{0,600}?)</a>',
                             h, re.S)
        idler = {u for u, _ in bloklar}
        if not bloklar or idler <= onceki_idler:
            bos_ust_uste += 1
        else:
            bos_ust_uste = 0
        onceki_idler |= idler
        for u, b in bloklar:
            baslik = entity_coz(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", b))).strip(" >")
            if u not in bulunan and baslik:
                bulunan[u] = {"baslik": baslik, "url": KOKURL + u, "tur": tur}
        sayfa += 1
        time.sleep(1)
    return bulunan

def main():
    tum = {}
    tum.update(liste_tara(KOKURL + "/duyuru/duyuruListe?sayfa={sayfa}", "duyuru"))
    tum.update(liste_tara(KOKURL + "/Haber/Arsiv?sayfa={sayfa}", "haber"))
    print(f"listelenen toplam: {len(tum)}")
    ilgili = {u: v for u, v in tum.items() if FILTRE.search(v["baslik"])}
    print(f"filtreyle eşleşen: {len(ilgili)}")
    kayitlar = []
    for i, (u, v) in enumerate(sorted(ilgili.items()), 1):
        kayit = {**v, "tarih": None, "pasaj": None, "il": []}
        try:
            h = getir(v["url"])
            metin = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", h))
            m = re.search(r"(\d{1,2})[./](\d{1,2})[./](\d{4})", metin)
            if m:
                kayit["tarih"] = m.group(0)
            pm = re.search(r".{0,300}(yeraltı ?su|işletme saha|kapalı ova).{0,400}",
                           metin, re.I)
            if pm:
                kayit["pasaj"] = entity_coz(pm.group(0).strip())[:700]
        except Exception as e:
            kayit["detay_hatasi"] = str(e)
        kaynak_metin = (kayit["pasaj"] or "") + " " + v["baslik"]
        kayit["il"] = yer_cikar(kaynak_metin) or "belirsiz"
        kayitlar.append(kayit)
        time.sleep(1)
        if i % 10 == 0:
            print(f"  detay {i}/{len(ilgili)}")
    sonuc = {
        "uretim_tarihi": "2026-07-27",
        "kaynak": "DSİ Genel Müdürlüğü duyuru + haber arşivi (dsi.gov.tr)",
        "not": ("Kullanıcı onaylı ek tarama. Her kayıt: resmî başlık + detay "
                "URL (+ tarih/pasaj çıkarılabildiyse). Bunlar RG künyesi "
                "DEĞİLDİR; 'resmî belge URL' sınıfı kanıttır (brief 3.1)."),
        "listelenen": len(tum),
        "kayit_sayisi": len(kayitlar),
        "kayitlar": kayitlar,
    }
    CIKTI.write_text(json.dumps(sonuc, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"kayıt: {len(kayitlar)} | yazıldı: {CIKTI}")

if __name__ == "__main__":
    sys.exit(main())
