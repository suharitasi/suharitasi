#!/usr/bin/env python3
# FAZ 4.B — il başına akademik künyeler.
# İKAME NOTU (Faz 4 raporunda onaya sunulur): Brief DergiPark arama arayüzünü
# öngörüyordu; arayüz Cloudflare Turnstile korumalı (ölçüldü, aşılmadı).
# İkame: OpenAlex API (metadata CC0; BRIEF.md Aşama 1'de anılan kaynak).
# Yalnız KÜNYE alınır (başlık, yazarlar, yıl, DOI/URL, dergi) — özet metni
# kopyalanmaz (brief 4.B). Açık erişim filtresi: is_oa=true.
# Sorgular (brief): "<il> yeraltı suyu potansiyel" + "<il> hidrojeoloji".
import json, sys, time, urllib.parse, urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
CIKTI = KOK / "veri/potansiyel/akademik-kunye.json"
UA = "suharitasi.com veri derleme (mailto:avserdararslan@hotmail.com)"
ILKURUM = json.loads((KOK / "data/il-kurum.json").read_text())
ILLER = sorted({il for b in ILKURUM["dsiBolgeleri"].values() for il in b["iller"]})

def getir(url):
    # 429'da uzun geri çekilme (ölçülen: 90 sn soğuma yetmedi) + polite-pool
    # mailto parametresi
    url += ("&" if "?" in url else "?") + "mailto=avserdararslan@hotmail.com"
    son = None
    # 2026-07-27 (gece paketi D) — TEŞHİS DÜZELTMESİ.
    # Eski sabit merdiven (30/75/150 sn, sonra 60/150/300) YAPISAL OLARAK
    # yetersizdi. Ölçülen gerçek 429 cevabı:
    #   x-ratelimit-limit: 1000 · x-ratelimit-remaining: 0 · retry-after: 4215
    #   x-ratelimit-credits-required: 10  (istek başına 10 kredi)
    # Yani OpenAlex artık KREDİ tabanlı kota uyguluyor ve pencere ~70 dakikada
    # sıfırlanıyor. Saniyelik merdiven ne kadar uzatılsa da bu pencereyi
    # aşamaz — sunucunun SÖYLEDİĞİ süre beklenmelidir.
    # Doğru davranış: Retry-After başlığını OKU ve ona uy (üst sınırla).
    RETRY_TAVAN = 5400          # 90 dk — sonsuz bekleme olmasın
    for deneme in range(4):
        istek = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(istek, timeout=60) as c:
                return json.load(c)
        except urllib.error.HTTPError as e:
            son = e
            if e.code != 429:
                raise
            ra = e.headers.get("Retry-After")
            kalan = e.headers.get("x-ratelimit-remaining")
            try:
                bekle = min(int(ra), RETRY_TAVAN) if ra else 300
            except ValueError:
                bekle = 300     # Retry-After tarih biçimindeyse: sabit geri çekilme
            print(f"429 (kalan kredi={kalan}) — sunucu {ra}s istedi, "
                  f"{bekle}s bekleniyor, deneme {deneme+1}/4", file=sys.stderr, flush=True)
            if deneme < 3:
                time.sleep(bekle + 5)
    raise son

def kunye(w, sorgu):
    loc = (w.get("primary_location") or {})
    src = (loc.get("source") or {})
    doi = w.get("doi")
    url = loc.get("landing_page_url") or doi
    return {
        # baski_uygun (kullanıcı şartı 4.B): DOI ya da açık URL taşımayan
        # künye SİTEDE BASILMAZ. Basım katmanı (src/data/potansiyel.js)
        # zaten süzüyor; etiket veride de açık dursun ki denetlenebilsin.
        "baski_uygun": bool(doi or url),
        "baslik": w.get("display_name"),
        "yazarlar": [a.get("author", {}).get("display_name")
                     for a in (w.get("authorships") or [])[:6]],
        "yil": w.get("publication_year"),
        "doi": w.get("doi"),
        "url": loc.get("landing_page_url") or w.get("doi"),
        "dergi": src.get("display_name"),
        "openalex_id": w.get("id"),
        "bulan_sorgu": [sorgu],
    }

def main():
    # ARTIMLI KOŞU: önceki çıktı varsa dolu iller atlanır (429 dersi —
    # ilk koşu M harfinden sonra hız sınırına takıldı; tempo 1→2 sn).
    sonuc_iller = {}
    if CIKTI.exists():
        onceki = json.loads(CIKTI.read_text())
        sonuc_iller = onceki.get("iller", {})
        # kısmi-başarılı iller (bir sorgusu 429 yemiş) tam yeniden koşulur
        for h in onceki.get("hatalar", []):
            sonuc_iller.pop(h.get("il"), None)
        print(f"önceki koşudan {len(sonuc_iller)} il yüklendi (atlanacak)")
    hata = []
    for n, il in enumerate(ILLER, 1):
        if il in sonuc_iller:
            continue
        kayitlar = {}
        for sorgu in (f"{il} yeraltı suyu potansiyel", f"{il} hidrojeoloji"):
            url = ("https://api.openalex.org/works?search="
                   + urllib.parse.quote(sorgu)
                   + "&filter=is_oa:true&per-page=25")
            try:
                cevap = getir(url)
            except Exception as e:
                hata.append({"il": il, "sorgu": sorgu, "hata": str(e)})
                print(f"HATA {il} '{sorgu}': {e}", file=sys.stderr)
                time.sleep(2)
                continue
            for w in cevap.get("results", []):
                kid = w.get("id")
                if kid in kayitlar:
                    if sorgu not in kayitlar[kid]["bulan_sorgu"]:
                        kayitlar[kid]["bulan_sorgu"].append(sorgu)
                else:
                    kayitlar[kid] = kunye(w, sorgu)
            time.sleep(2)
        if kayitlar:
            sonuc_iller[il] = sorted(kayitlar.values(),
                                     key=lambda k: -(k["yil"] or 0))
        print(f"{n:2d}/81 {il}: {len(kayitlar)} künye")
    sonuc = {
        "uretim_tarihi": "2026-07-27",
        "kaynak": "OpenAlex API (api.openalex.org) — metadata CC0",
        "ikame_notu": ("DergiPark arama arayüzü Cloudflare Turnstile korumalı "
                       "(2026-07-27 ölçümü) — brief 4.B'nin DergiPark araması "
                       "OpenAlex ile ikame edildi; kullanıcı onayına sunuldu. "
                       "Yalnız künye; özet metni kopyalanmadı."),
        "filtre": "is_oa:true (açık erişim), sorgu başına ilk 25 (alaka sıralı)",
        "il_kapsami": len(sonuc_iller),
        "toplam_kunye": sum(len(v) for v in sonuc_iller.values()),
        "hatalar": hata,
        "iller": sonuc_iller,
    }
    CIKTI.write_text(json.dumps(sonuc, ensure_ascii=False, indent=1),
                     encoding="utf-8")
    print(f"il kapsamı: {len(sonuc_iller)}/81 | toplam künye: "
          f"{sonuc['toplam_kunye']} | hata: {len(hata)}")
    print("yazıldı:", CIKTI)
    return 0 if not hata else 3

if __name__ == "__main__":
    sys.exit(main())
