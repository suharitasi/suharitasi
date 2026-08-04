#!/usr/bin/env python3
"""
fetch_hydro.py — Turkiye hidrografya verisi (goller, akarsular) OSM Overpass API'den.
Lisans: OSM verisi ODbL 1.0 — (c) OpenStreetMap katkilicilari.

Kullanim:
  python3 arac/fetch_hydro.py lakes   # src/data/tr-goller.json
  python3 arac/fetch_hydro.py rivers  # src/data/tr-nehirler.json
  python3 arac/fetch_hydro.py all     # ikisi birden
"""

import json, sys, time, os, urllib.request, urllib.error, gzip
from io import BytesIO

BBOX = (35.7, 25.6, 42.3, 45.1)  # S, W, N, E
SIMPLIFY_TOLERANCE_DEG = 0.005
MIN_LAKE_AREA_KM2 = 0.5
MIN_RIVER_POINTS = 12          # kisa akarsulari atla
MAX_RIVERS = 150               # en uzun N nehri tut
RIVER_SIMPLIFY_DEG = 0.008     # nehirler icin daha agresif

OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]


def overpass_query(query: str, timeout: int = 180, retries: int = 4) -> dict:
    """Overpass API'ye QL sorgusu gonder."""
    for attempt in range(retries):
        url = OVERPASS_SERVERS[attempt % len(OVERPASS_SERVERS)]
        backoff = 5 * (2 ** min(attempt, 3))
        if attempt > 0:
            print(f"  Bekleniyor {backoff}s...", flush=True)
            time.sleep(backoff)
        try:
            req = urllib.request.Request(
                url, data=query.encode("utf-8"),
                headers={"User-Agent": "suharitasi.com/hydro-fetch"}
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                raw = resp.read()
                return json.loads(raw)
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")
            if e.code == 429:
                wait = int(e.headers.get("Retry-After", 60))
                print(f"  429 — {wait}s bekleniyor...", flush=True)
                time.sleep(wait)
                continue
            if e.code == 504:
                print(f"  504 Timeout (deneme {attempt+1}/{retries})", flush=True)
                continue
            if attempt < retries - 1:
                continue
            raise SystemExit(f"Overpass HTTP {e.code}: {body[:300]}")
        except Exception as ex:
            if attempt < retries - 1:
                print(f"  Hata: {ex} (deneme {attempt+1}/{retries})")
                continue
            raise
    raise SystemExit("Overpass: tum denemeler basarisiz")


def overpass_to_coords(geom_elements):
    """Overpass out=geom ciktisini [lon, lat] listesine cevirir."""
    if not geom_elements:
        return []
    if isinstance(geom_elements, dict):
        if "coordinates" in geom_elements:
            geom_elements = geom_elements["coordinates"]
        else:
            return []
    if not isinstance(geom_elements, list) or not geom_elements:
        return []
    first = geom_elements[0]
    if isinstance(first, dict):
        if "lat" in first and "lon" in first:
            return [[p["lon"], p["lat"]] for p in geom_elements]
        return []
    if isinstance(first, list):
        if not first:
            return []
        if isinstance(first[0], (int, float)):
            return [[p[0], p[1]] for p in geom_elements]
        if isinstance(first[0], list):
            all_coords = []
            for ring in geom_elements:
                rc = overpass_to_coords(ring)
                if rc:
                    all_coords.append(rc)
            if len(all_coords) == 1:
                return all_coords[0]
            if len(all_coords) > 1:
                return max(all_coords, key=lambda r: area_km2(r))
            return []
    return []


def area_km2(coords):
    """Kapali poligonun yaklasik alani (km2, WGS84)."""
    import math
    R = 6371
    n = len(coords)
    if n < 3:
        return 0
    area = 0
    for i in range(n):
        j = (i + 1) % n
        lat1 = math.radians(coords[i][1])
        lat2 = math.radians(coords[j][1])
        lon1 = math.radians(coords[i][0])
        lon2 = math.radians(coords[j][0])
        area += (lon2 - lon1) * (2 + math.sin(lat1) + math.sin(lat2))
    return abs(area * R * R / 2.0)


def simplify_ring(ring, tol_deg):
    """Douglas-Peucker basitlestirme."""
    try:
        from shapely.geometry import LineString
        ls = LineString(ring)
        simp = ls.simplify(tol_deg, preserve_topology=True)
        return list(simp.coords)
    except Exception:
        return ring


def is_in_turkey(lon, lat, margin=0.2):
    """Kabaca Turkiye sinirlari icinde mi? (kapsayici kutu + kenar payi)"""
    return (25.6 - margin) <= lon <= (45.1 + margin) and (35.7 - margin) <= lat <= (42.3 + margin)


def fetch_lakes():
    """OSM way'ler + Natural Earth mega-goller."""
    print("→ Goller (OSM Overpass)...", flush=True)

    query = f"""
    [out:json][timeout:300];
    (
      way["natural"="water"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
    );
    out geom;
    """
    data = overpass_query(query, timeout=300)
    elements = data.get("elements", [])
    print(f"  Ham: {len(elements)} way")

    features = []
    seen_names = set()

    for el in elements:
        geom = el.get("geometry")
        if not geom:
            continue
        coords = overpass_to_coords(geom)
        if len(coords) < 3:
            continue

        tags = el.get("tags", {})
        name = tags.get("name", tags.get("name:tr", ""))
        water_type = tags.get("water", "")

        if water_type == "river":
            continue

        # Merkez noktasi kabaca Turkiye'de mi?
        cx = sum(p[0] for p in coords) / len(coords)
        cy = sum(p[1] for p in coords) / len(coords)
        if not is_in_turkey(cx, cy):
            continue

        area = area_km2(coords)
        if area < MIN_LAKE_AREA_KM2:
            continue

        simp = simplify_ring(coords, SIMPLIFY_TOLERANCE_DEG)
        if len(simp) < 4:
            continue

        if not name:
            continue  # sadece isimli goller

        name_key = name.lower()
        if name_key in seen_names:
            continue
        seen_names.add(name_key)

        xs = [p[0] for p in simp]
        ys = [p[1] for p in simp]

        features.append({
            "type": "Feature",
            "properties": {
                "ad": name,
                "tip": water_type or "lake",
                "alan_km2": round(area, 2),
                "kaynak": "OpenStreetMap"
            },
            "bbox": [min(xs), min(ys), max(xs), max(ys)],
            "geometry": {"type": "Polygon", "coordinates": [simp]}
        })

    print(f"  OSM: {len(features)} isimli gol")

    # Natural Earth mega-goller (yedekten)
    ne_features = _load_ne_lakes()
    added_ne = 0
    replaced = 0
    for ne_f in ne_features:
        ne_name = ne_f["properties"]["ad"]
        ne_key = ne_name.lower()
        ne_area = ne_f["properties"].get("alan_km2", 0)

        # OSM'de ayni isimli gol var mi?
        existing_idx = None
        for i, ex in enumerate(features):
            if ex["properties"]["ad"].lower() == ne_key:
                existing_idx = i
                break

        if existing_idx is not None:
            # OSM'deki NE'den cok kucukse (parca), NE ile degistir
            ex_area = features[existing_idx]["properties"].get("alan_km2", 0)
            if ne_area > ex_area * 3:
                features[existing_idx] = ne_f
                replaced += 1
                continue
            # Yakinsa, daha buyuk olani koru
            elif ne_area > ex_area:
                features[existing_idx] = ne_f
                replaced += 1
                continue
            else:
                continue  # OSM daha iyi, degistirme

        if _similar_lake_exists(ne_f, features):
            continue
        seen_names.add(ne_key)
        features.append(ne_f)
        added_ne += 1

    if added_ne or replaced:
        print(f"  Natural Earth: {added_ne} eklendi, {replaced} degistirildi")
        for f in features:
            if f["properties"].get("kaynak") == "Natural Earth (10m)":
                print(f"    {f['properties']['ad']}: {f['properties']['alan_km2']:.1f} km²")

    features.sort(key=lambda f: f["properties"]["alan_km2"], reverse=True)
    print(f"  Toplam: {len(features)} gol")
    for f in features[:20]:
        nm = f["properties"]["ad"]
        print(f"    {nm}: {f['properties']['alan_km2']:.1f} km²")

    return features


def _load_ne_lakes():
    """Natural Earth mega-golleri yedekten yukle."""
    paths = [
        "/tmp/suharitasi-backup/src-data/tr-goller.json",
    ]
    for p in paths:
        if os.path.exists(p):
            with open(p, encoding="utf-8") as f:
                data = json.load(f)
            ne = [feat for feat in data.get("features", [])
                  if feat.get("properties", {}).get("ad")]
            if ne:
                # Alan hesapla
                for feat in ne:
                    coords = feat["geometry"]["coordinates"][0]
                    feat["properties"]["alan_km2"] = round(area_km2(coords), 1)
                    feat["properties"]["kaynak"] = "Natural Earth (10m)"
                return ne
    return []


def _similar_lake_exists(feature, existing):
    """Ayni gol zaten var mi?"""
    name = feature["properties"]["ad"].lower()
    bbox = feature.get("bbox", [0, 0, 0, 0])
    cx = (bbox[0] + bbox[2]) / 2 if bbox else 0
    cy = (bbox[1] + bbox[3]) / 2 if bbox else 0
    for ex in existing[-80:]:
        if ex["properties"]["ad"].lower() == name:
            return True
        ex_bbox = ex.get("bbox", [0, 0, 0, 0])
        ex_cx = (ex_bbox[0] + ex_bbox[2]) / 2 if ex_bbox else 0
        ex_cy = (ex_bbox[1] + ex_bbox[3]) / 2 if ex_bbox else 0
        dist = ((cx - ex_cx) ** 2 + (cy - ex_cy) ** 2) ** 0.5
        a1 = feature["properties"].get("alan_km2", 0)
        a2 = ex["properties"].get("alan_km2", 0)
        if dist < 0.3 and a1 and a2 and abs(a1 - a2) / max(a1, a2) < 0.5:
            return True
    return False


def fetch_rivers():
    """OSM waterway=river."""
    print("→ Akarsular (OSM Overpass)...", flush=True)

    query = f"""
    [out:json][timeout:300];
    (
      way["waterway"="river"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
    );
    out geom;
    """
    data = overpass_query(query, timeout=300)
    elements = data.get("elements", [])
    print(f"  Ham: {len(elements)} nehir parcasi")

    from shapely.geometry import LineString, MultiLineString
    from shapely.ops import linemerge

    river_segments = {}
    for el in elements:
        geom = el.get("geometry")
        if not geom:
            continue
        coords = overpass_to_coords(geom)
        if len(coords) < MIN_RIVER_POINTS:
            continue

        tags = el.get("tags", {})
        name = tags.get("name", tags.get("name:tr", ""))

        if name:
            river_segments.setdefault(name, []).append(coords)

    features = []
    for name, segs in sorted(river_segments.items()):
        try:
            lines = [LineString(s) for s in segs]
            merged = linemerge(MultiLineString(lines))
            if isinstance(merged, MultiLineString):
                lines_list = list(merged.geoms)
            else:
                lines_list = [merged]
            longest = max(lines_list, key=lambda l: l.length)
            simp = longest.simplify(RIVER_SIMPLIFY_DEG, preserve_topology=True)
            coords = list(simp.coords)
            if len(coords) < MIN_RIVER_POINTS:
                continue

            xs = [p[0] for p in coords]
            ys = [p[1] for p in coords]
            features.append({
                "type": "Feature",
                "properties": {"ad": name, "kaynak": "OpenStreetMap"},
                "bbox": [min(xs), min(ys), max(xs), max(ys)],
                "geometry": {"type": "LineString", "coordinates": coords}
            })
        except Exception as e:
            print(f"    '{name}' hata: {e}")
            continue

    features.sort(key=lambda f: len(f["geometry"]["coordinates"]), reverse=True)
    if len(features) > MAX_RIVERS:
        features = features[:MAX_RIVERS]
    print(f"  Isimli: {len(features)} akarsu (max {MAX_RIVERS})")
    for f in features[:15]:
        print(f"    {f['properties']['ad']}: {len(f['geometry']['coordinates'])} nokta")
    return features


def write_geojson(features, path):
    fc = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:EPSG::4326"}
        },
        "features": features
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(fc, f, ensure_ascii=False, separators=(",", ":"))
    size_kb = os.path.getsize(path) / 1024
    print(f"  -> {path} ({len(features)} ozellik, {size_kb:.1f} KB)")


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    if mode not in ("lakes", "rivers", "all"):
        print(__doc__)
        sys.exit(1)

    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    if mode in ("lakes", "all"):
        lakes = fetch_lakes()
        out = os.path.join(project_root, "src", "data", "tr-goller.json")
        write_geojson(lakes, out)

    if mode in ("rivers", "all"):
        rivers = fetch_rivers()
        out = os.path.join(project_root, "src", "data", "tr-nehirler.json")
        write_geojson(rivers, out)

    print("\nTamamlandi.")


if __name__ == "__main__":
    main()
