#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""kesif-motoru.py — Sürekli Keşif ve Validasyon Motoru.

AMAÇ
  izleme/kesif/kaynak-kaynagi.json'daki su verisi kaynaklarını periyodik
  yoklar; her kaynağın canlılığını, biçimini (content-type), şemasını (JSON
  üst anahtarları), yayım disiplinini (Last-Modified/rate-limit) önceki
  imzayla karşılaştırır ve değişimi sınıflar. Otoritesi doğrulanamayan
  kaynakları OTOMATİK entegre etmez; insan onay kuyruğuna düşürür.

İLKELER (proje anayasasıyla uyumlu)
  * UYDURMA YASAĞI: hiçbir veri üretilmez; yalnız gözlem ve sınıflama yapılır.
  * SESSİZ HATA YASAĞI: her hedef izole edilir; ağ hatası koşumu düşürmez,
    DURUM.md'ye 🔴 olarak ve Telegram'a (imza tekrarı 24 saat bastırılır) yazılır.
  * OTORİTE FİLTRESİ: otorite='belirsiz' (ticari aracı/agregatör) yalnız
    kuyruğa uyarıyla girer; 'red' (sosyal medya/magazin) hiç kaydedilmez.
  * YALNIZ OKUMA: motor hedef sunucularda hiçbir yazma işlemi yapmaz; yanıt
    gövdesi en fazla 512 KB okunur ve asla çalıştırılmaz.

KOMUTLAR
  kos [--kuru]        Kaynakları yokla, sınıfla, DURUM/OLAYLAR/aday kuyruğu yaz.
  denetim             Geriye dönük eksik-veri denetimi (EKSIK-RAPOR.md) yaz.
  sinifla <url>       Bir URL'nin otorite sınıfını yazdır (test/hata ayıklama).
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import ssl
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

KOK = Path(__file__).resolve().parent.parent.parent
KESIF = KOK / "izleme" / "kesif"
STATE = KESIF / "state"
KAYNAK_DOSYA = KESIF / "kaynak-kaynagi.json"
ADAY_DOSYA = KESIF / "aday-kaynaklar.json"
DURUM_DOSYA = KESIF / "DURUM.md"
OLAY_DOSYA = KESIF / "OLAYLAR.md"
EKSIK_JSON = KESIF / "eksik-denetim.json"
EKSIK_MD = KESIF / "EKSIK-RAPOR.md"
IMZA_DOSYA = STATE / "uyari-imza.json"
UYARI = KOK / "arac" / "uyari-gonder.sh"

UA = "suharitasi.com kaynak-kesif/1.0 (+https://suharitasi.com; mailto:iletisim@suharitasi.com)"
TIMEOUT = 25
MAX_BAYT = 512 * 1024
IMZA_PENCERE = 86400

RED_DOMAINLER = [
    "twitter.com", "x.com", "facebook.com", "instagram.com", "youtube.com",
    "tiktok.com", "reddit.com", "quora.com", "medium.com", "substack.com",
    "wordpress.com", "blogspot.com", "eksisozluk.com", "pinterest.com",
    "linkedin.com", "t.me", "telegram.org",
]
T1_DOMAINLER = [
    "gov.tr", "gov", "europa.eu", "copernicus.eu", "esa.int", "nasa.gov",
    "noaa.gov", "usgs.gov", "un.org", "fao.org", "wmo.int", "worldbank.org",
    "eea.europa.eu", "jrc.ec.europa.eu", "who.int", "unep.org", "bafg.de",
    "tcmb.gov.tr", "tuik.gov.tr",
]
T2_DOMAINLER = [
    "edu.tr", "edu", "ac.uk", "ac.at", "uni-", "univ", "dergipark.org.tr",
    "zenodo.org", "doi.org", "arxiv.org", "wri.org", "hydrosheds.org",
    "globaldamwatch.org", "un-igrac.org", "igrac.org", "csic.es",
    "chc.ucsb.edu", "ucsb.edu", "tuwien.ac.at", "ugent.be", "gleam.eu",
]

SSL_CTX = ssl.create_default_context()


def simdi_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def host_al(url: str) -> str:
    try:
        return (urlparse(url).hostname or "").lower()
    except Exception:
        return ""


def _domain_uyar(host: str, domainler) -> bool:
    return any(host == d or host.endswith("." + d) for d in domainler)


def otorite_sinifla(url: str) -> str:
    host = host_al(url)
    if not host:
        return "red"
    if _domain_uyar(host, RED_DOMAINLER):
        return "red"
    if _domain_uyar(host, T1_DOMAINLER):
        return "resmi"
    if _domain_uyar(host, T2_DOMAINLER):
        akademik_isaret = ("edu", "ac.", "univ", "uni-", "dergipark", "zenodo",
                           "doi.org", "csic", "chc.ucsb", "tuwien", "ugent",
                           "research", "gleam")
        return "akademik" if any(x in host for x in akademik_isaret) else "kurumsal"
    return "belirsiz"


def yaz_atomik(p: Path, icerik: str) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    gecici = p.with_name(p.name + f".tmp{os.getpid()}")
    gecici.write_text(icerik, encoding="utf-8")
    os.replace(gecici, p)


def json_oku(p: Path, varsayilan):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return varsayilan
    except Exception as e:
        # SESSİZ SIFIRLAMA YASAĞI (04.10.2026 denetimi): bozuk durum dosyası
        # sessizce varsayılana düşerse değişiklik/format sinyalleri kaybolur.
        print(f"[kesif] UYARI: {p} okunamadı ({e}) — varsayılan kullanıldı; "
              f"durum sinyali kaybolabilir", file=sys.stderr)
        return varsayilan


def sema_cikar(govde: bytes, content_type: str):
    if "json" not in content_type and not govde.lstrip()[:1] in (b"{", b"["):
        return None
    try:
        veri = json.loads(govde.decode("utf-8", errors="replace"))
    except Exception:
        return ["<çözümlenemedi>"]
    if isinstance(veri, dict):
        return sorted(list(veri.keys()))[:50]
    if isinstance(veri, list):
        return [f"<liste:{len(veri)}>", *sorted({k for o in veri[:5] if isinstance(o, dict) for k in o.keys()})[:20]]
    return [type(veri).__name__]


def _tek_istek(url: str, yontem: str, govde_al: bool) -> dict:
    s = {"durum": "AG", "hata": "", "content_type": "", "last_modified": "",
         "etag": "", "server": "", "rate_limit": "", "sha256": "", "sema": None,
         "boyut": 0}
    istek = urllib.request.Request(url, headers={
        "User-Agent": UA, "Accept": "*/*", "Accept-Language": "tr,en"})
    istek.method = yontem
    with urllib.request.urlopen(istek, timeout=TIMEOUT, context=SSL_CTX) as r:
        h = r.headers
        s["durum"] = r.status
        s["content_type"] = (h.get("Content-Type") or "").split(";")[0].strip().lower()
        s["last_modified"] = (h.get("Last-Modified") or "").strip()
        s["etag"] = (h.get("ETag") or "").strip()
        s["server"] = (h.get("Server") or "").strip()[:60]
        rl = (h.get("X-RateLimit-Limit") or h.get("RateLimit-Limit")
              or h.get("X-Rate-Limit-Limit") or "")
        s["rate_limit"] = rl.strip()[:80]
        if govde_al or yontem == "GET":
            veri = r.read(MAX_BAYT)
            s["boyut"] = len(veri)
            s["sha256"] = hashlib.sha256(veri).hexdigest()
            s["sema"] = sema_cikar(veri, s["content_type"])
    return s


def http_al(url: str, govde_al: bool = True) -> dict:
    try:
        return _tek_istek(url, "GET", True)
    except urllib.error.HTTPError as e:
        return {"durum": e.code, "hata": f"HTTP {e.code}", "content_type": "",
                "last_modified": "", "etag": "", "server": "", "rate_limit": "",
                "sha256": "", "sema": None, "boyut": 0}
    except Exception as e:
        return {"durum": "AG", "hata": type(e).__name__, "content_type": "",
                "last_modified": "", "etag": "", "server": "", "rate_limit": "",
                "sha256": "", "sema": None, "boyut": 0}


def imza_ozet(y: dict) -> dict:
    return {
        "durum": y.get("durum"),
        "content_type": y.get("content_type"),
        "last_modified": y.get("last_modified"),
        "rate_limit": y.get("rate_limit"),
        "sema": y.get("sema"),
        "sha256": y.get("sha256"),
    }


def durum_sinifla(e: dict | None, y: dict, veri_izle: bool = False) -> tuple[str, str]:
    k = y.get("durum")
    if k == "AG":
        return "erisilemiyor", f"ağ hatası: {y.get('hata') or 'bilinmiyor'}"
    if not isinstance(k, int) or k < 200 or k >= 400:
        return "erisilemiyor", f"HTTP {k}"
    if not e:
        return "taban", "ilk kayıt (taban alındı)"
    ec, yc = e.get("content_type") or "", y.get("content_type") or ""
    if ec and yc and ec != yc:
        return "format-degisti", f"content-type {ec} → {yc}"
    es, ys = e.get("sema"), y.get("sema")
    if es is not None and ys is not None and es != ys:
        return "sema-degisti", "JSON üst şema değişti"
    er, yr = e.get("rate_limit") or "", y.get("rate_limit") or ""
    if (er or yr) and er != yr:
        return "rate-limit-degisti", f"rate-limit {er or 'yok'} → {yr or 'yok'}"
    if veri_izle:
        el, yl = e.get("last_modified") or "", y.get("last_modified") or ""
        esh, ysh = e.get("sha256") or "", y.get("sha256") or ""
        if el and yl and el != yl:
            return "yeni-veri", f"Last-Modified {el} → {yl}"
        if not yl and esh and ysh and esh != ysh:
            return "yeni-veri", "içerik özeti değişti (Last-Modified yok)"
        if el and not yl:
            return "baslik-yok", "Last-Modified başlığı artık okunmuyor"
    return "saglikli", "değişiklik yok"


def telegram(konu: str, govde: str, imza: str) -> bool:
    if not UYARI.exists():
        return False
    durum = json_oku(IMZA_DOSYA, {})
    simdi = time.time()
    if simdi - float(durum.get(imza, 0)) < IMZA_PENCERE:
        return False
    try:
        p = subprocess.run([str(UYARI), konu, govde], timeout=45, check=False,
                           capture_output=True, text=True)
        if p.returncode != 0:
            return False
        durum[imza] = simdi
        yaz_atomik(IMZA_DOSYA, json.dumps(durum, ensure_ascii=False))
        return True
    except Exception as e:
        # SESSİZ YUTMA YASAĞI (04.10.2026 denetimi): uyarı kanalı çökerse
        # kritik kaynak sinyali kaybolur; en azından stderr'e düşer.
        print(f"[kesif] UYARI: Telegram gönderilemedi ({e}) — uyarı dışarı ulaşmadı", file=sys.stderr)
        return False


def tekil_id(s: str) -> str:
    return re.sub(r"[^A-Za-z0-9_-]", "-", s)


def kaynak_yokla(k: dict) -> dict:
    temel = {"id": k["id"], "ad": k.get("ad", ""), "url": k["url"],
             "otorite": k.get("otorite", otorite_sinifla(k["url"])),
             "entegre": k.get("entegre", "aday"), "olcum": {}, "boyut": 0}
    if k.get("yoklama") == "muaf":
        return {**temel, "durum": "muaf",
                "aciklama": k.get("muaf_neden", "kamu yoklaması devre dışı (kimlik gerektirir)")}
    y = http_al(k["url"])
    e = json_oku(STATE / (tekil_id(k["id"]) + ".json"), None)
    veri_izle = k.get("tip") in ("download", "pdf") or bool(k.get("veri_izle"))
    durum, aciklama = durum_sinifla(e, y, veri_izle)
    return {"id": k["id"], "ad": k.get("ad", ""), "url": k["url"],
            "otorite": k.get("otorite", otorite_sinifla(k["url"])),
            "entegre": k.get("entegre", "aday"), "durum": durum,
            "aciklama": aciklama, "olcum": imza_ozet(y), "boyut": y.get("boyut", 0),
            "onceki": (e or {}).get("durum_sinif")}


def cmd_kos(kuru: bool = False) -> int:
    reg = json_oku(KAYNAK_DOSYA, None)
    if not reg:
        print("HATA: kaynak-kaynagi.json okunamadı", file=sys.stderr)
        return 2
    hedefler = list(reg.get("kaynaklar", []))
    hedefler += [dict(x, entegre="aday", parametreler=[]) for x in reg.get("aday_kaynaklar", [])]

    satirlar, olaylar = [], []
    kritik, aday_yeni = [], []
    aday_kuyruk = json_oku(ADAY_DOSYA, {"_not": "İnsan onay kuyruğu; motor otomatik entegre ETMEZ.", "adaylar": {}})
    adaylar = aday_kuyruk.setdefault("adaylar", {})
    zaman = simdi_utc()

    for k in hedefler:
        try:
            r = kaynak_yokla(k)
        except Exception as e:
            r = {"id": k.get("id", "?"), "ad": k.get("ad", ""), "url": k.get("url", ""),
                 "otorite": k.get("otorite", "belirsiz"), "entegre": k.get("entegre", "aday"),
                 "durum": "erisilemiyor", "aciklama": f"motor istisnası: {type(e).__name__}",
                 "olcum": {}, "boyut": 0}
        satirlar.append(r)
        if not kuru:
            yaz_atomik(STATE / (tekil_id(r["id"]) + ".json"),
                       json.dumps({"id": r["id"], "url": r["url"], "zaman": zaman,
                                   "durum_sinif": r["durum"], **r["olcum"]},
                                  ensure_ascii=False, indent=1))

        aday = k.get("entegre") == "aday"
        if aday:
            otorite = r["otorite"]
            if otorite == "red":
                continue
            oneri = ("ENTEGRASYON (insan onayı)" if otorite in ("resmi", "akademik", "kurumsal")
                     else "RED (otorite belirsiz)")
            yeni = r["id"] not in adaylar
            if yeni:
                adaylar[r["id"]] = {"ad": r["ad"], "kurum": k.get("kurum", ""), "url": r["url"],
                                    "otorite": otorite, "tip": k.get("tip", ""), "oneri": oneri,
                                    "ilk_gorulme": zaman, "son_durum": r["durum"],
                                    "parametreler": k.get("parametreler", []), "not": k.get("not", "")}
            else:
                adaylar[r["id"]]["son_durum"] = r["durum"]
            if yeni and oneri.startswith("ENTEGRASYON") and r["durum"] in ("taban", "saglikli", "yeni-veri"):
                aday_yeni.append(r)

        HATA_DURUMLARI = ("erisilemiyor", "format-degisti", "sema-degisti", "rate-limit-degisti")
        kritik_mi = (not aday) and r["entegre"] in ("mevcut", "izleme") and r["durum"] in HATA_DURUMLARI
        onceki = r.get("onceki")
        if r["durum"] not in ("saglikli", "taban", "muaf") and onceki != r["durum"]:
            olaylar.append(f"- {zaman} | {r['id']} | {r['durum']} | {r['aciklama']}")
        elif onceki in HATA_DURUMLARI and r["durum"] in ("saglikli", "taban"):
            olaylar.append(f"- {zaman} | {r['id']} | duzeldi | önceki: {onceki}")
        if kritik_mi:
            kritik.append(r)

    if kuru:
        print(json.dumps({"satirlar": satirlar, "olay_sayisi": len(olaylar),
                          "kritik": [r["id"] for r in kritik],
                          "aday_yeni": [r["id"] for r in aday_yeni]},
                         ensure_ascii=False, indent=1))
        return 0

    aday_kuyruk["guncelleme"] = zaman
    yaz_atomik(ADAY_DOSYA, json.dumps(aday_kuyruk, ensure_ascii=False, indent=1))
    rapor_yaz(satirlar, olaylar, zaman)
    bildirim(kritik, aday_yeni)
    return 0


def bildirim(kritik, aday_yeni) -> None:
    if kritik:
        govde = "\n".join(f"• {r['id']} ({r['entegre']}): {r['durum']} — {r['aciklama']}" for r in kritik[:12])
        imza = "kesif-kritik:" + ",".join(sorted(r["id"] + r["durum"] for r in kritik))
        if not telegram(f"kaynak keşif: {len(kritik)} kaynak sorunlu", govde, imza):
            print(f"[kesif] UYARI: {len(kritik)} kritik kaynak uyarısı GÖNDERİLEMEDİ", file=sys.stderr)
    if aday_yeni:
        liste = "\n".join(f"• {r['ad']} ({r['otorite']}) — {r['url']}" for r in aday_yeni[:20])
        govde = ("Keşif motoru aşağıdaki nitelikli açık veri kaynağını/kaynaklarını buldu ve "
                 "İNSAN ONAY KUYRUĞUNA aldı (otomatik entegre/yayın YOK):\n\n" + liste +
                 "\n\nOnay dosyası: izleme/kesif/aday-kaynaklar.json")
        imza = "kesif-aday:" + ",".join(sorted(r["id"] for r in aday_yeni))
        if not telegram(f"kaynak keşif: {len(aday_yeni)} YENİ ADAY", govde, imza):
            print(f"[kesif] UYARI: {len(aday_yeni)} yeni aday bildirimi GÖNDERİLEMEDİ", file=sys.stderr)


def rapor_yaz(satirlar, olaylar, zaman) -> None:
    from collections import Counter
    say = Counter(r["durum"] for r in satirlar)
    ikon = {"saglikli": "🟢", "taban": "🟢", "yeni-veri": "✳", "baslik-yok": "🟡",
            "erisilemiyor": "🔴", "format-degisti": "🔴", "sema-degisti": "🔴",
            "rate-limit-degisti": "🟠", "muaf": "⚪"}
    out = ["# Sürekli Keşif — DURUM", "",
           f"Son koşu (UTC): **{zaman}**", "",
           f"Toplam hedef: {len(satirlar)} · " +
           " · ".join(f"{k}: {v}" for k, v in sorted(say.items())), "",
           "## Kaynak durumları", "", "| Kaynak | Otorite | Entegre | Durum | Not |", "|---|---|---|---|---|"]
    for r in satirlar:
        out.append(f"| {r['id']} | {r['otorite']} | {r['entegre']} | {ikon.get(r['durum'], '')} {r['durum']} | {r['aciklama']} |")
    out += ["", "---", "_arac/kesif/kesif-motoru.py · kaynak: izleme/kesif/kaynak-kaynagi.json_"]
    yaz_atomik(DURUM_DOSYA, "\n".join(out) + "\n")

    eski = []
    if OLAY_DOSYA.exists():
        eski = [l for l in OLAY_DOSYA.read_text(encoding="utf-8").splitlines() if l.startswith("- ")]
    yeni = [l for l in olaylar if l not in eski]
    hepsi = yeni + eski
    govde = ["# Kaynak Keşif — OLAYLAR (en yeni üstte)", "",
             "\n".join(hepsi[:400]) if hepsi else "_(henüz olay yok)_", ""]
    yaz_atomik(OLAY_DOSYA, "\n".join(govde))


def _url_tara() -> set:
    dosyalar = [KOK / "KAYNAKLAR.md", KOK / "KESIF-POTANSIYEL.md", KOK / "izleme" / "hedefler.conf"]
    for d in [KOK / "arac"]:
        if d.is_dir():
            dosyalar += [p for p in d.iterdir() if p.suffix in (".py", ".mjs", ".sh")]
    hostlar = set()
    kalip = re.compile(r"https?://([A-Za-z0-9._-]+)")
    for p in dosyalar:
        try:
            metin = p.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue
        for h in kalip.findall(metin):
            hostlar.add(h.lower())
    return hostlar


def cmd_denetim() -> int:
    reg = json_oku(KAYNAK_DOSYA, None)
    if not reg:
        print("HATA: kaynak-kaynagi.json okunamadı", file=sys.stderr)
        return 2
    kaynaklar = reg.get("kaynaklar", [])
    zaman = simdi_utc()

    kapsanan = [k for k in kaynaklar if k.get("entegre") in ("mevcut", "izleme")]
    eksik_acik = [k for k in kaynaklar if k.get("entegre") == "eksik"]
    veri_yok = [k for k in kaynaklar if k.get("entegre") == "veri-yok"]
    aday = [k for k in kaynaklar if k.get("entegre") == "aday"]

    reg_host = {host_al(k["url"]) for k in kaynaklar}
    kayit_disi = sorted(h for h in _url_tara()
                        if h not in reg_host and otorite_sinifla("https://" + h) in ("resmi", "akademik", "kurumsal"))

    rapor = {
        "_not": "Geriye dönük eksik-veri denetimi. UYDURMA YOK: 'veri-yok' kayıtları açık yayımı doğrulanmamış boşluklardır; değer üretilmez.",
        "guncelleme": zaman,
        "ozet": {"kaynak": len(kaynaklar), "kapsanan": len(kapsanan),
                 "eksik_acik": len(eksik_acik), "veri_yok": len(veri_yok),
                 "aday": len(aday), "kayit_disi_host": len(kayit_disi)},
        "eksik_acik": [{"id": k["id"], "ad": k["ad"], "parametreler": k.get("parametreler", []),
                        "url": k["url"], "not": k.get("not", "")} for k in eksik_acik],
        "veri_yok": [{"id": k["id"], "ad": k["ad"], "parametreler": k.get("parametreler", []),
                      "not": k.get("not", "")} for k in veri_yok],
        "aday": [{"id": k["id"], "ad": k["ad"], "otorite": k.get("otorite", ""),
                  "parametreler": k.get("parametreler", [])} for k in aday],
        "kayit_disi_host": kayit_disi,
    }
    yaz_atomik(EKSIK_JSON, json.dumps(rapor, ensure_ascii=False, indent=1))

    satirlar = ["# Su Verisi — Geriye Dönük Eksik-Denetim Raporu", "",
                f"Üretim (UTC): **{zaman}**", "",
                f"Kaynak kataloğu: **{len(kaynaklar)}** · kapsanan: **{len(kapsanan)}** · "
                f"eksik/açık: **{len(eksik_acik)}** · açık yayımı yok: **{len(veri_yok)}** · "
                f"aday: **{len(aday)}** · kayıt dışı kurumsal host: **{len(kayit_disi)}**", "",
                "## 1. Entegre edilebilir boşluklar (kaynak açık, henüz bağlanmadı)", ""]
    if eksik_acik:
        for k in eksik_acik:
            satirlar.append(f"- **{k['ad']}** — parametre: {', '.join(k.get('parametreler', []))}  \n  {k.get('not','')}")
    else:
        satirlar.append("_(yok)_")
    satirlar += ["", "## 2. Açık yayımı doğrulanmamış boşluklar (UYDURULMAZ; bilgi edinme adayı)", ""]
    for k in veri_yok:
        satirlar.append(f"- **{k['ad']}** — parametre: {', '.join(k.get('parametreler', []))}  \n  {k.get('not','')}")
    satirlar += ["", "## 3. Aday kaynak kuyruğu (insan onayı bekliyor)", ""]
    for k in aday:
        satirlar.append(f"- **{k['ad']}** ({k.get('otorite','')}) — {', '.join(k.get('parametreler', []))}")
    satirlar += ["", "## 4. Kayıt dışı kurumsal URL'ler (taramada bulundu, katalogda yok)", ""]
    satirlar += [f"- `{h}`" for h in kayit_disi] or ["_(yok)_"]
    satirlar += ["", "---", "_arac/kesif/kesif-motoru.py denetim · uydurma yasağı: yalnız gözlem._", ""]
    yaz_atomik(EKSIK_MD, "\n".join(satirlar))
    print(json.dumps(rapor["ozet"], ensure_ascii=False))
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="suharitasi sürekli keşif motoru")
    alt = ap.add_subparsers(dest="komut", required=True)
    p_kos = alt.add_parser("kos")
    p_kos.add_argument("--kuru", action="store_true")
    alt.add_parser("denetim")
    p_s = alt.add_parser("sinifla")
    p_s.add_argument("url")
    a = ap.parse_args()
    STATE.mkdir(parents=True, exist_ok=True)
    if a.komut == "kos":
        return cmd_kos(a.kuru)
    if a.komut == "denetim":
        return cmd_denetim()
    if a.komut == "sinifla":
        print(otorite_sinifla(a.url))
        return 0
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
