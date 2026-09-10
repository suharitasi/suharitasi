#!/usr/bin/env python3
"""
build_river_topology.py — OSM akarsu ağı topolojisi çıkarımı (V6, V7'de
yeniden kullanılabilir çekirdek `topoloji_turet`'e ayrıldı).

tr-nehirler.json'daki her akarsuyun AĞZINI (son koordinat — OSM `way`'leri
kaynak→ağız yönünde çizilir; bu sıra korunmuştur) diğer akarsu hatlarına ve
göl çokgenlerine uzamsal eşleştirir:

  - `kolu_oldugu_akarsu`: ağız, başka bir akarsu hattının İÇ noktasına
    (uç noktalarından uzak bir segmente) ≤ eşik yaklaşırsa o akarsuyun KOLU.
  - `dokuldugu_yer`: ağız bir DOĞAL göl çokgeninin içinde/kenarında ise göl adı.

HALLÜSİNASYON KORUMASI (uydurma yasağı): yalnız yüksek güvenli iç-nokta
eşleşmesi yazılır; uç-nokta (devam/ikiz) ve ad-değişimi (KOL_DISLAMA) NULL
bırakılır. Deniz eşlemesi YAPILMAZ (kıyı çizgisi/deniz sınıfı kaynağı yok).

Bu betik SADECE sadeleştirilmiş geometriden türetir; `fetch_overpass_rivers.py`
tam çözünürlüklü geometriyle türetip aynı alanları (yalnız null olanları)
doldurur. İkisi BİRLEŞİR: burada türetilemeyen bir alan, önceden (full-res)
yazılmışsa korunur — boşaltılmaz.

Kullanım:
    python3 scripts/build_river_topology.py
"""
import json
import math
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
NEHIR_YOL = KOK / "src" / "data" / "tr-nehirler.json"
GOL_YOL = KOK / "src" / "data" / "tr-goller.json"

# Eşikler (metre). Sadeleştirilmiş kaynak (SIMPLIFY_DEG≈0.008 ~900 m) için
# 500 m kavşakları yakalar, gürültüyü eler. Tam çözünürlüklü veride
# fetch_overpass_rivers.py daha sıkı eşik (100 m) kullanır.
KOL_ESIK_M = 500.0   # ağız → hedef hat (kol ilişkisi)
UC_ESIK_M = 300.0    # "iç nokta" sayılması için hedef uç noktalarından asgari uzaklık
GOL_ESIK_M = 500.0   # ağız → göl çokgeni (döküldüğü yer)

# Eşit dikdörtgensel izdüşüm (Türkiye orta enlemi) — alt-km mesafeler için yeterli.
LAT_REF = 39.0
M_PER_DEG_LAT = 110540.0
M_PER_DEG_LON = 111320.0 * math.cos(math.radians(LAT_REF))


def proj(p):
    """[lon, lat] -> (x, y) metre."""
    return (p[0] * M_PER_DEG_LON, p[1] * M_PER_DEG_LAT)


def hat_noktalari(geom):
    t = geom.get("type")
    if t == "LineString":
        return geom["coordinates"]
    if t == "MultiLineString":
        return [p for s in geom["coordinates"] for p in s]
    return []


def segman_mesafe(p, s, e):
    """(x,y) noktasının [s,e] doğru parçasına uzaklığı."""
    px, py = p
    sx, sy = s
    ex, ey = e
    dx, dy = ex - sx, ey - sy
    if dx == 0 and dy == 0:
        return math.hypot(px - sx, py - sy)
    t = ((px - sx) * dx + (py - sy) * dy) / (dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    return math.hypot(px - (sx + t * dx), py - (sy + t * dy))


def hat_mesafe(p, hat_proj):
    """(x,y) noktasının projeksiyonlu hat listesine en yakın uzaklığı."""
    if len(hat_proj) < 2:
        return math.hypot(p[0] - hat_proj[0][0], p[1] - hat_proj[0][1])
    return min(segman_mesafe(p, hat_proj[i], hat_proj[i + 1])
               for i in range(len(hat_proj) - 1))


def nokta_ring_icinde(p, ring_proj):
    """Düzlem ışın sayımı — nokta çokgen (halka) içinde mi."""
    x, y = p
    ic = False
    for i in range(len(ring_proj)):
        j = (i + 1) % len(ring_proj)
        xi, yi = ring_proj[i]
        xj, yj = ring_proj[j]
        if (yi > y) != (yj > y):
            xkes = (xj - xi) * (y - yi) / (yj - yi) + xi
            if x < xkes:
                ic = not ic
    return ic


def ring_mesafe(p, ring_proj):
    """(x,y) noktasının çokgen halkasına en yakın sınır uzaklığı."""
    return min(segman_mesafe(p, ring_proj[i], ring_proj[(i + 1) % len(ring_proj)])
               for i in range(len(ring_proj)))


def ad_esit(a, b):
    """İkiz kayıt koruması: 'aras nehri' ile 'aras' aynı akarsu sayılır."""
    sa = a.split()
    sb = b.split()
    return sa == sb or (len(sa) == 1 and sa[0] in b.split()) or \
        (len(sb) == 1 and sb[0] in a.split())


def cakisma_orani(hat_a, hat_b, esik=KOL_ESIK_M):
    """A'nın noktalarının B hattına ≤ esik yakınlıktaki oranı.

    AYNI AKARSUYUN FARKLI ADLI KESİTİ ana hat BOYUNCA uzanır → oran yüksek;
    gerçek bir kol ana hatta YALNIZ ağzında dokunur → oran düşük.
    """
    if not hat_a or len(hat_b) < 2:
        return 0.0
    yakin = sum(1 for p in hat_a if hat_mesafe(p, hat_b) <= esik)
    return yakin / len(hat_a)


def rezervuar_mi(ad):
    """Baraj gölü/gölet — akarsuyun döküldüğü yer değil, İÇİNDEN geçtiği
    yerdir. 'dokuldugu_yer' yalnız doğal terminal gölleri için türetilir."""
    a = (ad or "").lower()
    return "baraj" in a or "gölet" in a


# OSM'de adlandırması standart coğrafyayla ÇELİŞEN akarsular (elle GIS
# incelemesi, 10.09.2026). 'Mustafakemalpaşa Çayı' aslında Susurluk/Simav ana
# ırmağının aşağı çığır adıdır; OSM onu ana hattan AYRI, paralel bir kesit
# olarak tutar → kol DEĞİLDİR (uydurma yasağı).
KOL_DISLAMA = {"Mustafakemalpaşa Çayı"}


def topoloji_turet(features, gol_features, kol_esik=KOL_ESIK_M,
                   uc_esik=UC_ESIK_M, gol_esik=GOL_ESIK_M, hedef_adlar=None):
    """Öznitelik listelerinden {ad: {"kolu":..., "dokuldugu":...}} çıkarır.

    features: [ { "properties": {"ad":...}, "geometry": LineString|MultiLineString } ]
    gol_features: [ { "properties": {"ad":...}, "geometry": Polygon } ]
    Tam çözünürlüklü veride `kol_esik`/`uc_esik` 100 m'ye çekilir (V7).

    `hedef_adlar` verilirse YALNIZ o adlar için türetir (diğerleri aday olarak
    kalır) — tam çözünürlüklü binlerce akarsuda O(n²)'yi önlemek için. Aday
    eşlemesi bbox ön-filtresiyle hızlandırılır.
    """
    nehir_hat = []
    for i, f in enumerate(features):
        noktalar = hat_noktalari(f["geometry"])
        ad = f["properties"].get("ad", "")
        if len(noktalar) < 2:
            nehir_hat.append((ad, [], None, None, None))
            continue
        pn = [proj(p) for p in noktalar]
        xs = [p[0] for p in pn]
        ys = [p[1] for p in pn]
        bbox = (min(xs), min(ys), max(xs), max(ys))
        nehir_hat.append((ad, pn, pn[0], pn[-1], bbox))

    gol_ring = []
    for g in gol_features:
        if g["geometry"]["type"] != "Polygon":
            continue
        gol_ring.append((g["properties"].get("ad", ""),
                         [proj(p) for p in g["geometry"]["coordinates"][0]]))

    sonuc = {}
    for ad_a, hat_a, _, agiz_a, _ in nehir_hat:
        if not hat_a:
            sonuc[ad_a] = {"kolu": None, "dokuldugu": None}
            continue
        if hedef_adlar is not None and ad_a not in hedef_adlar:
            continue  # bu akarsu için türetilmiyor (yalnız aday)

        # KOL: ağız → başka akarsu hattının İÇ noktası (bbox ön-filtre).
        en_yakin_ad = None
        en_yakin_mesafe = float("inf")
        for ad_b, hat_b, bas_b, son_b, bbox_b in nehir_hat:
            if ad_b == ad_a or not hat_b:
                continue
            if not (bbox_b[0] - kol_esik <= agiz_a[0] <= bbox_b[2] + kol_esik and
                    bbox_b[1] - kol_esik <= agiz_a[1] <= bbox_b[3] + kol_esik):
                continue  # ağız bu hat yakınında değil
            d = hat_mesafe(agiz_a, hat_b)
            if d > kol_esik:
                continue
            d_bas = math.hypot(agiz_a[0] - bas_b[0], agiz_a[1] - bas_b[1])
            d_son = math.hypot(agiz_a[0] - son_b[0], agiz_a[1] - son_b[1])
            if min(d_bas, d_son) <= uc_esik:
                continue  # uç eşleşmesi: devam/ikiz → yazılmaz
            if d < en_yakin_mesafe:
                en_yakin_mesafe = d
                en_yakin_ad = ad_b

        kolu = en_yakin_ad if (en_yakin_ad and not ad_esit(ad_a, en_yakin_ad)) else None
        if ad_a in KOL_DISLAMA or kolu in KOL_DISLAMA:
            kolu = None
        if kolu is not None:
            j = next((k for k, (ad_b, hat_b, _, _, _) in enumerate(nehir_hat)
                      if ad_b == kolu), None)
            if j is not None and cakisma_orani(hat_a, nehir_hat[j][1], kol_esik) > 0.35:
                kolu = None

        dokuldugu = None
        if kolu is not None:
            # V7: bir kolun döküldüğü yer, ana akarsuyun KENDİSİDİR.
            dokuldugu = kolu
        else:
            for ad_g, ring_g in gol_ring:
                if rezervuar_mi(ad_g):
                    continue
                if nokta_ring_icinde(agiz_a, ring_g) or ring_mesafe(agiz_a, ring_g) <= gol_esik:
                    dokuldugu = ad_g
                    break

        sonuc[ad_a] = {"kolu": kolu, "dokuldugu": dokuldugu}
    return sonuc


def main():
    nehirler = json.loads(NEHIR_YOL.read_text(encoding="utf-8"))
    goller = json.loads(GOL_YOL.read_text(encoding="utf-8"))

    # 0) Mevcut değerler (fetch_overpass_rivers.py tam-çözünürlüklü türetmiş
    #    olabilir) — sadeleştirilmiş türetim null bıraktığında KORUNUR.
    onceki = {f["properties"].get("ad"): dict(f["properties"])
              for f in nehirler["features"]}

    # 1) Temizle.
    for f in nehirler["features"]:
        f["properties"].pop("kolu_oldugu_akarsu", None)
        f["properties"].pop("dokuldugu_yer", None)

    # 2) Sadeleştirilmiş geometriden türet.
    sonuc = topoloji_turet(nehirler["features"], goller["features"])

    # 3) Birleştir: türetilen + (türetilemediyse) önceki full-res değeri.
    sonuclar = []
    korunan = []
    for f in nehirler["features"]:
        ad = f["properties"].get("ad", "")
        r = sonuc.get(ad, {"kolu": None, "dokuldugu": None})
        eski = onceki.get(ad, {})
        kolu = r["kolu"] or eski.get("kolu_oldugu_akarsu")
        dokuldugu = r["dokuldugu"] or eski.get("dokuldugu_yer")
        # Normalizasyon: kol ise döküldüğü yer = ana akarsu (V7); bu, fetch'in
        # isim çakışmasından doğabilecek tutarsız dokuldugu'yu da düzeltir.
        if kolu:
            dokuldugu = kolu
        if kolu:
            f["properties"]["kolu_oldugu_akarsu"] = kolu
            sonuclar.append((ad, "kolu", kolu, r["kolu"] is None))
        if dokuldugu:
            f["properties"]["dokuldugu_yer"] = dokuldugu
            sonuclar.append((ad, "dokuldugu", dokuldugu, r["dokuldugu"] is None))
        if (r["kolu"] is None and eski.get("kolu_oldugu_akarsu")) or \
           (r["dokuldugu"] is None and eski.get("dokuldugu_yer")):
            korunan.append(ad)

    # 4) Kompakt yaz (kaynakla aynı biçim; diff yalnız properties farkı).
    NEHIR_YOL.write_text(
        json.dumps(nehirler, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    # 5) Rapor.
    print(f"İşlendi: {len(nehirler['features'])} akarsu, {len(goller['features'])} göl")
    print(f"Toplam ilişki: {len(sonuclar)}")
    for ad, tur, hedef, fullres in sonuclar:
        kaynak = "full-res (korundu)" if fullres else "sadeleştirilmiş"
        print(f"  {tur:9s} {ad[:26]:28s} -> {hedef}  [{kaynak}]")
    if korunan:
        print(f"Full-res'ten korunan (sadeleştirilmiş türetemedi): {len(korunan)}")
        for ad in korunan:
            print(f"  {ad}")


if __name__ == "__main__":
    main()
