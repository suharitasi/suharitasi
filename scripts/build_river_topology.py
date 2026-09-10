#!/usr/bin/env python3
"""
build_river_topology.py — OSM akarsu ağı topolojisi çıkarımı (V6).

tr-nehirler.json'daki her akarsuyun AĞZINI (son koordinat — OSM `way`'leri
kaynak→ağız yönünde çizilir; bu sıra korunmuştur) diğer akarsu hatlarına ve
göl çokgenlerine uzamsal eşleştirir:

  - `kolu_oldugu_akarsu`: ağız, başka bir akarsu hattının İÇ noktasına
    (uç noktalarından uzak bir segmente) ≤ KOL_ESIK_M yaklaşırsa o akarsuyun
    KOLU sayılır.
  - `dokuldugu_yer`: ağız bir göl çokgeninin İÇİNDEYSE ya da sınırına
    ≤ GOL_ESIK_M yakınsa o gölün adı yazılır.

HALLÜSİNASYON KORUMASI (uydurma yasağı):
  * Yalnız yüksek güvenli İÇ-NOKTA eşleşmesi yazılır.
  * Uç-nokta eşleşmesi (aynı akarsuyun devamı/ikiz adı: "aras" ↔ "aras nehri")
    ve belirsiz durum NULL bırakılır.
  * Deniz eşlemesi YAPILMAZ: güvenilir kıyı çizgisi/deniz sınıfı kaynağı yok;
    deniz adı uydurulmaz (tr-sinir.json halkaları kıyı/kara sınırını ayırmaz).

Betik İDEMPOTENT'tir: önceki `kolu_oldugu_akarsu`/`dokuldugu_yer` alanlarını
temizler, yeniden türetir, sonucu tr-nehirler.json'a kompakt biçimde yazar
(diff yalnız değişen properties'tir).

Kullanım:
    python3 scripts/build_river_topology.py
"""
import json
import math
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
NEHIR_YOL = KOK / "src" / "data" / "tr-nehirler.json"
GOL_YOL = KOK / "src" / "data" / "tr-goller.json"

# Eşikler (metre). Kaynak veri SIMPLIFY_DEG≈0.008 (~900 m) ile sadeleştirildi;
# 500 m eşiği gerçek kavşakları yakalar, sadeleştirme gürültüsünü eler.
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


def cakisma_orani(hat_a, hat_b):
    """A'nın noktalarının B hattına ≤ KOL_ESIK_M yakınlıktaki oranı.

    AYNI AKARSUYUN FARKLI ADLI KESİTİ (ör. 'Mustafakemalpaşa Çayı' aslında
    'Simav Çayı'nın aşağı çığırıdır) ana hat BOYUNCA uzanır → oran yüksek.
    Gerçek bir kol ana hatta YALNIZ ağzında dokunur → oran düşük. Eşik bu
    ikisini ayırır (uydurma yasağı: aynı akarsuyu 'kol' diye yazma).
    """
    if not hat_a or len(hat_b) < 2:
        return 0.0
    yakin = sum(1 for p in hat_a if hat_mesafe(p, hat_b) <= KOL_ESIK_M)
    return yakin / len(hat_a)


def rezervuar_mi(ad):
    """Baraj gölü/gölet — bir akarsuyun DÖKÜLDÜĞÜ yer değil, İÇİNDEN geçtiği
    yerdir. 'dokuldugu_yer' yalnız doğal terminal gölleri (Van Gölü, Tuz Gölü…)
    için türetilir; baraj gölü eşleşmesi sadeleştirme kesintisi yanılgısı
    üretir (Fırat, Atatürk Baraj Gölü'ne dökülmez, içinden geçer)."""
    a = (ad or "").lower()
    return "baraj" in a or "gölet" in a


# OSM'de adlandırması standart coğrafyayla ÇELİŞEN akarsular (elle GIS
# incelemesi, 10.09.2026). 'Mustafakemalpaşa Çayı' aslında Susurluk/Simav ana
# ırmağının aşağı çığır adıdır; OSM onu ana hattan AYRI, paralel bir kesit
# olarak tutar. Geometri "ağzı Simav'a dokunuyor" gibi görünse de bu bir ad
# değişimidir, kol DEĞİLDİR → kol olarak YAZILMAZ (uydurma yasağı).
KOL_DISLAMA = {"Mustafakemalpaşa Çayı"}


def main():
    nehirler = json.loads(NEHIR_YOL.read_text(encoding="utf-8"))
    goller = json.loads(GOL_YOL.read_text(encoding="utf-8"))

    # 1) Önceki türetmeyi temizle (idempotent).
    for f in nehirler["features"]:
        f["properties"].pop("kolu_oldugu_akarsu", None)
        f["properties"].pop("dokuldugu_yer", None)

    # 2) Geometrileri izdüşümle (yalnız okuma için).
    nehir_hat = []  # (ad, [proj noktalar], ilk, son)
    for f in nehirler["features"]:
        noktalar = hat_noktalari(f["geometry"])
        if len(noktalar) < 2:
            nehir_hat.append((f["properties"].get("ad", ""), [], None, None))
            continue
        proj_noktalar = [proj(p) for p in noktalar]
        nehir_hat.append((
            f["properties"].get("ad", ""),
            proj_noktalar,
            proj_noktalar[0],
            proj_noktalar[-1],
        ))

    gol_ring = []
    for g in goller["features"]:
        if g["geometry"]["type"] != "Polygon":
            continue
        ring = [proj(p) for p in g["geometry"]["coordinates"][0]]
        gol_ring.append((g["properties"].get("ad", ""), ring))

    # 3) Topoloji çıkarımı.
    sonuclar = []
    atlanan = []  # koruma devreye girenler (rapor için)
    for i, (ad_a, hat_a, _, agiz_a) in enumerate(nehir_hat):
        if not hat_a:
            continue

        # 3a) KOL: ağız → başka bir akarsu hattının İÇ noktası.
        en_yakin_ad = None
        en_yakin_mesafe = float("inf")
        for j, (ad_b, hat_b, bas_b, son_b) in enumerate(nehir_hat):
            if j == i or not hat_b:
                continue
            d = hat_mesafe(agiz_a, hat_b)
            if d > KOL_ESIK_M:
                continue
            # İç nokta mı? (hedefin iki ucundan da uzak olmalı)
            d_bas = math.hypot(agiz_a[0] - bas_b[0], agiz_a[1] - bas_b[1])
            d_son = math.hypot(agiz_a[0] - son_b[0], agiz_a[1] - son_b[1])
            if min(d_bas, d_son) <= UC_ESIK_M:
                continue  # uç eşleşmesi: devam/ikiz kayıt → yazılmaz
            if d < en_yakin_mesafe:
                en_yakin_mesafe = d
                en_yakin_ad = ad_b

        kolu = en_yakin_ad if (en_yakin_ad and not ad_esit(ad_a, en_yakin_ad)) else None
        # Elle dışlanan (ad değişimi) akarsu: kol ilişkisi yazılmaz.
        if ad_a in KOL_DISLAMA or (kolu in KOL_DISLAMA):
            if kolu:
                atlanan.append((ad_a, kolu, "ad değişimi (elle dışlama)"))
            kolu = None
        # Aynı akarsuyun farklı adlı kesiti mi? (çakışma oranı yüksekse kol değil)
        if kolu is not None:
            j = next((k for k, (ad_b, hat_b, _, _) in enumerate(nehir_hat)
                      if ad_b == kolu), None)
            if j is not None and cakisma_orani(hat_a, nehir_hat[j][1]) > 0.35:
                atlanan.append((ad_a, kolu, "aynı akarsu kesiti (çakışma)"))
                kolu = None

        # 3b) DÖKÜLDÜĞÜ YER (yalnız DOĞAL göl — baraj gölü hariç).
        dokuldugu = None
        if kolu is None:
            for ad_g, ring_g in gol_ring:
                if rezervuar_mi(ad_g):
                    continue
                if nokta_ring_icinde(agiz_a, ring_g) or ring_mesafe(agiz_a, ring_g) <= GOL_ESIK_M:
                    dokuldugu = ad_g
                    break

        # 3c) Yaz.
        if kolu:
            nehirler["features"][i]["properties"]["kolu_oldugu_akarsu"] = kolu
            sonuclar.append((ad_a, "kolu", kolu, round(en_yakin_mesafe)))
        if dokuldugu:
            nehirler["features"][i]["properties"]["dokuldugu_yer"] = dokuldugu
            sonuclar.append((ad_a, "dokuldugu", dokuldugu, None))

    # 4) Kompakt yaz (kaynakla aynı biçim; diff yalnız properties farkı).
    NEHIR_YOL.write_text(
        json.dumps(nehirler, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    # 5) Rapor.
    print(f"İşlendi: {len(nehirler['features'])} akarsu, {len(gol_ring)} göl")
    print(f"Türetilen ilişki: {len(sonuclar)}")
    for ad, tur, hedef, m in sonuclar:
        km = f" ({m / 1000:.2f} km)" if m is not None else ""
        print(f"  {tur:9s} {ad[:28]:30s} -> {hedef}{km}")
    if atlanan:
        print(f"\nKoruma (yazılmayan): {len(atlanan)}")
        for ad, hedef, neden in atlanan:
            print(f"  {ad[:28]:30s} -> {hedef} [{neden}]")


if __name__ == "__main__":
    main()
