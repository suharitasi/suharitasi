#!/usr/bin/env python3
# FAZ 4.A — MTA e-ticaret katalog künyeleri (yalnız METAVERİ; rapor satın
# alınmaz, içerik kopyalanmaz — brief 4.A).
# Yöntem: OpenCart araması (route=product/search) anahtar kelimelerle
# taranır; her ürün = katalog künyesi (rapor adı + ürün URL). İl ataması
# rapor ADINDAN tam-kelime (81 il + OSM ilçe dizini; ilçe→tek-il ise il).
# İl çıkarılamayan künye "il çıkarılamadı" listesinde kalır (G3).
# İstekler arası ≥1 sn (G5). Ham sayfalar veri/ham/mta/ (gitignore).
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HAM = KOK / "veri/ham/mta"
CIKTI = KOK / "veri/potansiyel/mta-katalog.json"
UA = "suharitasi.com veri derleme"
KELIMELER = ["hidrojeoloji", "hidrojeolojik", "yeraltısuyu", "yeraltı suyu"]

ILKURUM = json.loads((KOK / "data/il-kurum.json").read_text())
ILLER = sorted({il for b in ILKURUM["dsiBolgeleri"].values() for il in b["iller"]})
ILCE = json.loads((KOK / "veri/potansiyel/ilce-il-dizini.json").read_text())["ilceler"]

TR_KUCUK = str.maketrans("ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ",
                          "abcçdefgğhıijklmnoöprsştuüvyz")
def norm(s):
    return s.translate(TR_KUCUK).strip()

IL_NORM = {norm(il): il for il in ILLER}
# MTA başlıkları eski il/kısa adlar kullanabilir — bilinen resmî ad değişimleri
IL_NORM.update({"afyon": "Afyonkarahisar", "içel": "Mersin", "maraş": "Kahramanmaraş",
                "urfa": "Şanlıurfa", "antep": "Gaziantep", "elazığ": "Elazığ"})
ILCE_NORM = {}
for _ilce, _iller in ILCE.items():
    ILCE_NORM.setdefault(norm(_ilce), (_ilce, _iller))

def getir(url):
    istek = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(istek, timeout=60) as c:
        return c.read().decode("utf-8", errors="replace")

URUN_RE = re.compile(r'route=product/product[^"]*product_id=(\d+)[^"]*"[^>]*>([^<]{5,200})<')
SAYFA_RE = re.compile(r'route=product/search[^"]*page=(\d+)')

def il_ata(baslik):
    kelimeler = re.split(r"[^A-Za-zÇĞİÖŞÜçğıöşü]+", baslik)
    adaylar = list(kelimeler) + [" ".join(p) for p in zip(kelimeler, kelimeler[1:])]
    iller = set()
    for a in adaylar:
        n = norm(a)
        if n in IL_NORM:
            iller.add(IL_NORM[n])
        elif n in ILCE_NORM:
            _, hangi = ILCE_NORM[n]
            if len(hangi) == 1:          # çok-illi ilçe adı belirsizlik üretir, atlanır
                iller.add(hangi[0])
    return sorted(iller)

def main():
    HAM.mkdir(parents=True, exist_ok=True)
    urunler = {}
    kelime_sayilari = {}
    for kelime in KELIMELER:
        gorulen = 0
        sayfa = 1
        while True:
            url = ("https://eticaret.mta.gov.tr/index.php?route=product/search"
                   f"&search={urllib.parse.quote(kelime)}&limit=100&page={sayfa}")
            h = getir(url)
            (HAM / f"{norm(kelime).replace(' ', '-')}-{sayfa}.html").write_text(
                h, encoding="utf-8")
            bulunan = URUN_RE.findall(h)
            # aynı ürün karta 2 kez (resim+ad) çıkabilir — id ile tekille
            yeni = {}
            for pid, ad in bulunan:
                ad = ad.strip()
                if ad and pid not in yeni:
                    yeni[pid] = ad
            for pid, ad in yeni.items():
                if pid not in urunler:
                    urunler[pid] = {
                        "rapor_adi": ad,
                        "url": ("https://eticaret.mta.gov.tr/index.php?"
                                f"route=product/product&product_id={pid}"),
                        "bulan_kelimeler": [kelime],
                    }
                elif kelime not in urunler[pid]["bulan_kelimeler"]:
                    urunler[pid]["bulan_kelimeler"].append(kelime)
            gorulen += len(yeni)
            time.sleep(1)
            son_sayfa = max((int(p) for p in SAYFA_RE.findall(h)), default=1)
            if sayfa >= son_sayfa or not yeni:
                break
            sayfa += 1
        kelime_sayilari[kelime] = gorulen
        print(f"kelime '{kelime}': {gorulen} ürün ({sayfa} sayfa)")
    # il ataması
    il_katalog = {il: [] for il in ILLER}
    atanamayan = []
    for pid, u in sorted(urunler.items(), key=lambda x: x[1]["rapor_adi"]):
        iller = il_ata(u["rapor_adi"])
        kunye = {**u, "product_id": pid, "il_adaylari": iller}
        if iller:
            for il in iller:
                il_katalog[il].append(kunye)
        else:
            atanamayan.append(kunye)
    sonuc = {
        "uretim_tarihi": "2026-07-27",
        "kaynak": "MTA Genel Müdürlüğü e-ticaret kataloğu (eticaret.mta.gov.tr) — yalnız katalog metaverisi",
        "not": ("Rapor satın alınmadı, içerik kopyalanmadı. İl ataması rapor "
                "ADINDAN tam-kelime çıkarımıdır; çok-illi ilçe adları "
                "atlanır; il çıkarılamayanlar ayrı listede."),
        "kelime_sayilari": kelime_sayilari,
        "toplam_kunye": len(urunler),
        "il_atanamayan_sayisi": len(atanamayan),
        "iller": {il: k for il, k in il_katalog.items() if k},
        "il_atanamayan": atanamayan,
    }
    CIKTI.write_text(json.dumps(sonuc, ensure_ascii=False, indent=1),
                     encoding="utf-8")
    kapsanan = sum(1 for k in il_katalog.values() if k)
    print(f"toplam künye: {len(urunler)} | il atanan künye kapsamı: "
          f"{kapsanan}/81 il | atanamayan: {len(atanamayan)}")
    print("yazıldı:", CIKTI)

if __name__ == "__main__":
    sys.exit(main())
