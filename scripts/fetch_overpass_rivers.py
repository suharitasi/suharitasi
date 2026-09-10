#!/usr/bin/env python3
"""
fetch_overpass_rivers.py — tam çözünürlüklü OSM düğüm topolojisi ile akarsu
ağı zenginleştirme (V7).

SORUN: tr-nehirler.json geometrileri sadeleştirilmiş (SIMPLIFY_DEG≈0.008) ve
OSM akarsuları AYRI `way`'lere bölünmüş durumda — bu yüzden "Gökırmak" ile
"Kızılırmak" geometrik olarak bağlanamıyor (Kızılırmak'ın alt çığırı ayrı bir
way'dir ve isim birleştirmede 'en uzun' seçimiyle düşüyordu).

ÇÖZÜM: Geometri yerine OSM'nin KESİN düğüm (node) topolojisini kullan. Bir
akarsuyun ağız düğümü (way'in son düğümü — OSM `way`'leri kaynak→ağız yönünde
çizilir) başka bir akarsuyun İÇ düğümüyle (way'in ilk/son düğümü DEĞİL) AYNI
ise, o akarsu diğerinin KOLU'dur. Aynı düğüm = <100 m hassasiyetin ötesinde
BİREBİR çakışma (uydurma yasağı: yalnız kesin paylaşılan düğüm yazılır).

HALLÜSİNASYON KORUMASI:
  * Yalnız İÇ düğüm paylaşımı yazılır (uç düğüm = devam/ikiz → yazılmaz).
  * `dokuldugu_yer` = kol (ana akarsu) — V7 brief: Gökırmak için ikisi de
    'Kızılırmak'.
  * Göl terminali burada türetilmez (V6'da sadeleştirilmiş veriden yapıldı);
    mevcut değerler KORUNUR (yalnız null alanlar doldurulur).

Kullanım:
    python3 scripts/fetch_overpass_rivers.py
"""
import json
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
NEHIR_YOL = KOK / "src" / "data" / "tr-nehirler.json"

BBOX = (35.7, 25.6, 42.3, 45.1)  # S, W, N, E
SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]
# Önbellek (geçici, git DIŞI); `--nocache` ile zorlanır.
CACHE_YOL = Path("/tmp/opencode/fullres-ways.json")


def overpass_query(query: str, timeout: int = 600, retries: int = 4) -> dict:
    for attempt in range(retries):
        url = SERVERS[attempt % len(SERVERS)]
        if attempt > 0:
            print(f"  Bekleniyor {5 * 2 ** attempt}s...", flush=True)
            time.sleep(5 * 2 ** attempt)
        try:
            req = urllib.request.Request(
                url, data=query.encode("utf-8"),
                headers={"User-Agent": "suharitasi.com/hydro-fetch"})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = int(e.headers.get("Retry-After", 60))
                print(f"  429 — {wait}s bekleniyor...", flush=True)
                time.sleep(wait)
                continue
            if e.code in (504, 502) and attempt < retries - 1:
                continue
            raise SystemExit(f"Overpass HTTP {e.code}: {e.read()[:200]!r}")
        except Exception as ex:
            if attempt < retries - 1:
                print(f"  Hata: {ex} (deneme {attempt + 1})", flush=True)
                continue
            raise
    raise SystemExit("Overpass: tüm denemeler başarısız")


def fetch_ways() -> list:
    """Tüm waterway=river way'lerini (düğüm refs + tags) çeker."""
    query = f"""
    [out:json][timeout:600];
    (
      way["waterway"="river"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
    );
    out body;
    """
    print("→ Overpass: waterway=river (düğüm topolojisi)...", flush=True)
    data = overpass_query(query)
    ways = data.get("elements", [])
    print(f"  Ham: {len(ways)} way", flush=True)
    return ways


def main():
    nehirler = json.loads(NEHIR_YOL.read_text(encoding="utf-8"))
    hedef_adlar = {f["properties"].get("ad", "") for f in nehirler["features"]}

    if CACHE_YOL.exists() and "--nocache" not in sys.argv:
        ways = json.loads(CACHE_YOL.read_text(encoding="utf-8"))
        print(f"Önbellekten yüklendi: {len(ways)} way", flush=True)
    else:
        ways = fetch_ways()
        CACHE_YOL.parent.mkdir(parents=True, exist_ok=True)
        CACHE_YOL.write_text(json.dumps(ways, ensure_ascii=False),
                             encoding="utf-8")
        print(f"Önbelleğe yazıldı: {CACHE_YOL}", flush=True)

    # 1) name → way düğüm listeleri.
    nehir_yollari = {}
    for w in ways:
        name = (w.get("tags", {}).get("name")
                or w.get("tags", {}).get("name:tr") or "")
        if not name:
            continue
        refs = w.get("nodes", [])
        if len(refs) < 2:
            continue
        nehir_yollari.setdefault(name, []).append(refs)

    # 2) düğüm → iç/uc haritası (bir düğümden GEÇEN vs UCUNDAKİ akarsular).
    icinde = {}
    ucunda = {}
    for name, yollar in nehir_yollari.items():
        for refs in yollar:
            ucunda.setdefault(refs[0], set()).add(name)
            ucunda.setdefault(refs[-1], set()).add(name)
            for r in refs[1:-1]:
                icinde.setdefault(r, set()).add(name)

    # Ana akarsu seçimi: aynı düğümde birden çok aday varsa en uzun (toplam
    # düğüm sayısı en büyük) olan seçilir.
    uzunluk = {n: sum(len(r) for r in y) for n, y in nehir_yollari.items()}

    # 3) KOL: A'nın ağız düğümü (her way'in SON düğümü) B'nin İÇ düğümü ise.
    sonuc = {}
    for name_a, yollar in nehir_yollari.items():
        if name_a not in hedef_adlar:
            continue
        aday = None
        for refs in yollar:
            agiz = refs[-1]
            b_adaylari = icinde.get(agiz, set()) - {name_a}
            for b in b_adaylari:
                if aday is None or uzunluk.get(b, 0) > uzunluk.get(aday, 0):
                    aday = b
        if aday:
            sonuc[name_a] = aday

    # 4) Yalnız TAMAMEN null akarsuları doldur (V7: kolu + dokuldugu = ana
    #    akarsu). İlişkisi zaten kurulu (V6) akarsulara DOKUNULMAZ — OSM isim
    #    çakışması (birden çok "Karacay" vb.) yanlış hedef üretebilir; mevcut
    #    doğrulanmış değer korunur (uydurma yasağı).
    doldurulan = []
    for f in nehirler["features"]:
        ad = f["properties"].get("ad", "")
        hedef = sonuc.get(ad)
        if not hedef:
            continue
        if f["properties"].get("kolu_oldugu_akarsu") or f["properties"].get("dokuldugu_yer"):
            continue
        f["properties"]["kolu_oldugu_akarsu"] = hedef
        f["properties"]["dokuldugu_yer"] = hedef
        doldurulan.append((ad, hedef))

    NEHIR_YOL.write_text(
        json.dumps(nehirler, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    print(f"\nDoldurulan (tamamen null) akarsu: {len(doldurulan)}")
    for ad, hedef in doldurulan:
        print(f"  {ad[:30]:32s} -> {hedef} (kolu + dokuldugu)")


if __name__ == "__main__":
    main()
