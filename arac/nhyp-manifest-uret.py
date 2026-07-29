#!/usr/bin/env python3
"""NHYP MANİFEST ÜRETİCİ — kaybolan indirme manifestini yeniden derler.

NEDEN: 27.07'de 38 PDF indiren manifest `scratchpad/` altındaydı ve oturum
bitince gitti; PDF'ler de worktree silinirken kayboldu
(rapor/yedek-envanteri.md §2.1). Bu script manifesti DEPODAKİ kayıtlardan
yeniden türetir — bir daha kaybolmasın diye çıktısı `arac/test/` altında
sürümlenir.

TÜRETME SIRASI (hepsi depo içi kayıt; uydurma yok):
  (a) arac/nhyp-yayin-nobetci.py BILINEN — 12 havzanın 27.07'de HTTP 200
      ölçülmüş PDF yolu. Buradan havza→DİZİN eşlemesi çıkar.
  (b) veri/potansiyel/yas-kutleleri.json — çıkarımın GERÇEKTEN okuduğu
      dosya adları (`beyan.dosya` ve `kutleler[].dosya`, .txt → .pdf).
      Bu dosyalar (a)'daki dizinlerin içindedir.
  (c) SYGM sayfası canlı taranır — (a)+(b) dışında kalan NHYP PDF'leri.

Her aday HEAD ile yoklanır; 200 dönmeyen manifeste YAZILMAZ ve
"bulunamadi" listesine düşer (uydurma yasağı: erişilemeyen dosya "var"
sayılmaz).

Sessiz hata yasağı: ağ hatası yutulmaz, her adayın HTTP kodu basılır.
Çıktı: JSON listesi [{havza,dosya,url}] stdout'a; özet stderr'e.
Biçim `arac/nhyp-indir.sh`'in sözleşmesidir (o json.load ile okur) —
TSV denenip düşüldü (29.07 ölçümü: indirici 0 satır işledi).
"""
import json, re, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
SYGM = "https://www.tarimorman.gov.tr/SYGM"
SAYFA = SYGM + "/Sayfalar/Detay.aspx?SayfaId=49"   # NHYP liste sayfası
BELGE_KOK = SYGM + "/Belgeler"
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0 Safari/537.36 suharitasi.com-veri-derleme")
BEKLE = 1.0          # istekler arası nezaket (nhyp-indir.sh G5 ile aynı ilke)

# (a) Nöbetçinin doğrulanmış yolları — TEK KAYNAK, kopyalanmaz, import edilir.
sys.path.insert(0, str(KOK / "arac"))
import importlib.util
_spec = importlib.util.spec_from_file_location("nob", KOK / "arac/nhyp-yayin-nobetci.py")
_nob = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_nob)
BILINEN = _nob.BILINEN

# Çıkarıcı "konya" der, nöbetçi "konya-kapali" — havza anahtarları eşlenir.
ESLEME = {"konya": "konya-kapali"}


# Çıkarıcının kullandığı 12 kanonik havza anahtarı. Klasör adları
# tutarsız ("AKARÇAY HAVZASI NHYP 28.12.2022", "sakarya havzası",
# "kuzey ege aylin"); tanınmayan klasör UYDURULMAZ, "diger"e düşer.
KANONIK = ["akarcay", "bati-akdeniz", "burdur", "buyuk-menderes", "gediz",
           "konya", "kucuk-menderes", "kuzey-ege", "meric-ergene",
           "sakarya", "susurluk", "yesilirmak"]


def havza_coz(klasor):
    """Klasör adı → kanonik havza anahtarı; tanınmazsa 'diger'.

    Ölçüm hatası kaydı (29.07): önce `slug()` doğrudan kullanılmıştı ama
    o yalnız "Havzası" (baş harfi büyük) siliyor; klasörler "HAVZASI"
    yazıyor → "akarcay-havzasi" gibi sahte anahtarlar doğdu. Burada
    tarih/NHYP/HAVZASI gürültüsü temizlenip kanonik listeye eşlenir."""
    t = re.sub(r"\d{1,2}[.\-]\d{1,2}[.\-]\d{4}", " ", klasor)
    t = re.sub(r"\bNHYP\b|\bHAVZA(SI)?\b|\bY[ÖO]NET[İI]M\b|\bPLAN(I|LARI)?\b|\bNEH[İI]R\b",
               " ", t, flags=re.I)
    s2 = _nob.slug(t)
    for k in KANONIK:
        if s2.startswith(k) or k.startswith(s2) and s2:
            return k
    return "diger"


def head(url, zaman=30):
    q = urllib.parse.quote(url, safe=":/?&=%#")
    istek = urllib.request.Request(q, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(istek, timeout=zaman) as c:
            return c.status, int(c.headers.get("Content-Length") or 0)
    except urllib.error.HTTPError as e:
        return e.code, 0
    except Exception as e:                      # ağ hatası GİZLENMEZ
        return f"ERR:{type(e).__name__}", 0


def cikarimin_dosyalari():
    """(b) — çıkarımın gerçekten okuduğu dosya adları, havza bazında."""
    d = json.loads((KOK / "veri/potansiyel/yas-kutleleri.json").read_text("utf-8"))
    out = {}
    for havza, v in d["havzalar"].items():
        adlar = set()
        if v.get("beyan", {}).get("dosya"):
            adlar.add(v["beyan"]["dosya"])
        for k in v.get("kutleler", []):
            if k.get("dosya"):
                adlar.add(k["dosya"])
        out[havza] = {a[:-4] + ".pdf" if a.endswith(".txt") else a for a in adlar}
    return out


def main():
    cikarim = cikarimin_dosyalari()
    satirlar, bulunamadi, olcum, elenen = [], [], [], []

    # Havza → dizin (nöbetçinin doğrulanmış yolundan)
    dizin = {}
    for h, yol in BILINEN.items():
        dizin[h] = yol.rsplit("/", 1)[0]

    adaylar = []          # (havza, dosya, url, kaynak)
    for havza, dosyalar in sorted(cikarim.items()):
        nob_anahtar = ESLEME.get(havza, havza)
        d = dizin.get(nob_anahtar)
        if not d:
            bulunamadi.append((havza, "—", "dizin bilinmiyor (nöbetçi BILINEN'de yok)", "-"))
            continue
        for dosya in sorted(dosyalar):
            adaylar.append((havza, dosya, f"{BELGE_KOK}/{d}/{dosya}", "b:cikarim"))

    # (c) SYGM sayfası canlı taranır — kalan NHYP belgeleri.
    # ELEME KURALI (orijinal manifestle aynı, rapor/potansiyel-faz1.md:8
    # "yerüstü-yalnız belgeler elendi"): dosya adında YERÜSTÜ geçen ve
    # YERALTI geçmeyen belge alınmaz — bu iş yeraltı suyu kütlelerini
    # çıkarmak için; yerüstü tedbir programı ilgisiz ve büyük.
    try:
        istek = urllib.request.Request(SAYFA, headers={"User-Agent": UA})
        with urllib.request.urlopen(istek, timeout=60) as c:
            sayfa_html = c.read().decode("utf-8", "replace")
    except Exception as e:                      # ağ hatası GİZLENMEZ
        print(f"UYARI: SYGM sayfası taranamadı ({type(e).__name__}: {e}) — "
              f"manifest yalnız (a)+(b) ile üretiliyor", file=sys.stderr)
        sayfa_html = ""

    for yol in sorted(set(re.findall(r'href="(/SYGM/Belgeler/[^"]*\.pdf)"',
                                     sayfa_html, re.I))):
        coz = urllib.parse.unquote(yol)
        ad = coz.rsplit("/", 1)[1]
        # YÜS = yerüstü suyu kısaltması; YAS = yeraltı suyu. Ölçüm kaydı
        # (29.07): ilk sürüm yalnız açık yazımı ("YERÜSTÜ") eliyordu, bu
        # yüzden 87 MB'lık "Ek-7 KMN YÜS Künyeleri.pdf" gereksiz indi.
        if (re.search(r"yer[üu]st[üu]|\bY[ÜU]S\b", ad, re.I)
                and not re.search(r"yeralt|\bYAS\b", ad, re.I)):
            elenen.append((ad, "yerüstü-yalnız"))
            continue
        # havza: DOSYANIN HEMEN ÜSTÜNDEKİ klasörden slug'la.
        # Ölçüm hatası kaydı (29.07): sabit indis (split[3]) kullanılmıştı
        # ama yolların derinliği aynı değil — 25 dosya "nehir-havza-yonetim-
        # planlari-28-12-2022" adlı sahte bir havzaya düşmüştü. Dosyanın
        # üstündeki klasör her yol derinliğinde doğru havzayı verir.
        parcalar = coz.split("/")
        klasor = parcalar[-2] if len(parcalar) > 2 else ""
        havza = havza_coz(klasor)
        url = "https://www.tarimorman.gov.tr" + urllib.parse.quote(coz, safe=":/?&=%#")
        if not any(urllib.parse.unquote(a[2]) == "https://www.tarimorman.gov.tr" + coz
                   for a in adaylar):
            adaylar.append((havza, ad, "https://www.tarimorman.gov.tr" + coz, "c:sygm"))

    # (a) Nöbetçinin kendi dosyaları da manifeste girer (çıkarımda
    # kullanılmasa bile 27.07'de indirilmiş olan küme bunlar).
    for h, yol in sorted(BILINEN.items()):
        havza = next((k for k, v in ESLEME.items() if v == h), h)
        dosya = yol.rsplit("/", 1)[1]
        url = f"{BELGE_KOK}/{yol}"
        if not any(a[2] == url for a in adaylar):
            adaylar.append((havza, dosya, url, "a:nobetci"))

    print(f"aday: {len(adaylar)} · HEAD yoklaması başlıyor", file=sys.stderr)
    for havza, dosya, url, kaynak in adaylar:
        kod, boyut = head(url)
        olcum.append({"havza": havza, "dosya": dosya, "http": kod,
                      "boyut": boyut, "kaynak": kaynak})
        isaret = "OK " if kod == 200 else "YOK"
        print(f"  {isaret} {kod:>6} {boyut/1048576:7.1f} MB  {havza}/{dosya}", file=sys.stderr)
        if kod == 200:
            # URL YÜZDE-KODLANMIŞ yazılır. Ölçüm hatası kaydı (29.07):
            # ham URL (boşluk + Türkçe karakter) yazıldığında HEAD 200
            # dönüyordu (head() kendi içinde kodluyor) ama nhyp-indir.sh
            # aynı dizeyi curl'e olduğu gibi veriyor → 41/41 HATA.
            # Manifest artık indiricinin doğrudan kullanabileceği hâli
            # taşır; iki taraf ayrışmasın.
            satirlar.append({"havza": havza, "dosya": dosya,
                             "url": urllib.parse.quote(url, safe=":/?&=%#")})
        else:
            bulunamadi.append((havza, dosya, url, kod))
        time.sleep(BEKLE)

    print(json.dumps(satirlar, ensure_ascii=False, indent=1))

    print(f"\nSONUÇ: {len(satirlar)} erişilebilir · {len(bulunamadi)} bulunamadı "
          f"· {len(elenen)} elendi (yerüstü-yalnız)", file=sys.stderr)
    (KOK / "cikti/denetim/nhyp").mkdir(parents=True, exist_ok=True)
    (KOK / "cikti/denetim/nhyp/manifest-olcum.json").write_text(
        json.dumps({"olcum": olcum,
                    "bulunamadi": [list(map(str, b)) for b in bulunamadi],
                    "elenen": [list(e) for e in elenen]},
                   ensure_ascii=False, indent=1), "utf-8")
    return 0 if satirlar else 3


if __name__ == "__main__":
    sys.exit(main())
