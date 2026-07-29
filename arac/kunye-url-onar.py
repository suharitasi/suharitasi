#!/usr/bin/env python3
"""KÜNYE URL ONARIMI — taşınmış/ölü kaynak bağlantılarının düzeltilmesi (M1).

NEDEN: md17 (dış bağlantı) üç ölü bağlantı bildiriyordu. İkisi alan adı
taşınmasıydı (dergipark.gov.tr → dergipark.org.tr; trdizin.gov.tr →
search.trdizin.gov.tr), biri çözülemeyen DOI'ydı.

DOĞRULAMA ÖLÇÜTÜ — 200 YETMEZ: yeni adres AYNI yayını göstermeli.
Gerçek tarayıcıyla açılıp başlık + yazar metinde arandı (29.07.2026).
Bu kural olmasaydı ciddi bir uydurma olurdu: trdizin'in eski
base64 kimliği (TXpFNE5ETXo=) "318433" gibi çözülüyor ve
search.trdizin.gov.tr/tr/yayin/detay/318433 **HTTP 200 dönüyor** — ama
o sayfa BAŞKA bir yayın ("Use of geosynthetics…", 2018). Doğru kayıt
arama üzerinden bulundu: ID 31843.

DOI'ye dokunma kuralı: çözülemeyen DOI SİLİNMEZ, `doi` alanından
çıkarılıp `doi_olu` alanına ölçüm tarihiyle taşınır. Sebep: site
`k.doi || k.url` ile bağ kuruyor (IlPotansiyel.astro:163) — ölü DOI
yayımlanan bağlantı oluyordu. Kayıt olarak korunur, bağlantı olarak
kullanılmaz.

Kullanım: python3 arac/kunye-url-onar.py [--uygula]
--uygula verilmezse yalnız ne yapacağını basar (kuru koşum).
"""
import json, sys
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
DOSYALAR = [KOK / "veri/potansiyel/akademik-kunye.json",
            KOK / "veri/potansiyel/zenginlestirme.json"]
OLCUM_TARIHI = "2026-07-29"

# (eski, yeni, doğrulama kanıtı) — kanıt raporda ve burada birlikte durur.
URL_ONARIM = [
    ("http://dergipark.gov.tr/pajes/issue/26682/286528",
     "https://dergipark.org.tr/tr/pub/pajes/issue/26682/286528",
     "HTTP 200 · sayfada 'Gölhisar' + 'Davraz' doğrulandı (tarayıcı, 29.07.2026)"),
    ("http://www.trdizin.gov.tr/publication/paper/detail/TXpFNE5ETXo=",
     "https://search.trdizin.gov.tr/tr/yayin/detay/31843/"
     "berke-baraji-osmaniye-rezervuar-alani-ve-cevresinde-gorulen-karstlasma-olaylari",
     "HTTP 200 · sayfada 'Berke' + 'Özcan' doğrulandı (tarayıcı, 29.07.2026). "
     "DİKKAT: base64 kimliğinden türeyen /318433 de 200 döner ama BAŞKA yayındır."),
]

# Çözülemeyen DOI'ler: doi → doi_olu. Kaydın kendi `url` alanı çalışıyor
# olmalı (ölçüldü), yoksa kayıt bağlantısız kalırdı.
DOI_OLU = {
    "https://doi.org/10.17341/gummfd.60377":
        f"doi.org HTTP 404 ({OLCUM_TARIHI}) — DOI çözülmüyor. Yayın sayfası "
        f"çalışıyor: dergipark.org.tr/tr/pub/gazimmfd/article/88735 "
        f"(200, 'JEOLOJİK EŞİK' + 'Tüdeş' doğrulandı).",
}

UYGULA = "--uygula" in sys.argv


def gez(nesne, islev):
    """Sözlük/dizi ağacında her sözlüğü işleve verir (yerinde değişir)."""
    if isinstance(nesne, dict):
        islev(nesne)
        for v in nesne.values():
            gez(v, islev)
    elif isinstance(nesne, list):
        for v in nesne:
            gez(v, islev)


def main():
    sayac = {"url": 0, "doi": 0, "doi_url_yok": 0}

    for yol in DOSYALAR:
        d = json.loads(yol.read_text("utf-8"))

        def duzelt(kayit):
            for alan in ("url", "landing_page_url", "kaynak_url"):
                deger = kayit.get(alan)
                for eski, yeni, _ in URL_ONARIM:
                    if deger == eski:
                        if UYGULA:
                            kayit[alan] = yeni
                        sayac["url"] += 1
            doi = kayit.get("doi")
            if doi in DOI_OLU:
                # url yoksa DOI'yi kaldırmak kaydı bağlantısız bırakır —
                # o durumda DOKUNULMAZ ve sayaca ayrı düşer.
                if not kayit.get("url"):
                    sayac["doi_url_yok"] += 1
                    return
                if UYGULA:
                    kayit["doi"] = None
                    kayit["doi_olu"] = {"deger": doi, "not": DOI_OLU[doi],
                                        "olcum": OLCUM_TARIHI}
                sayac["doi"] += 1

        gez(d, duzelt)
        if UYGULA:
            yol.write_text(json.dumps(d, ensure_ascii=False, indent=1), "utf-8")

    kip = "UYGULANDI" if UYGULA else "KURU KOŞUM (--uygula ile yaz)"
    print(f"{kip}: url onarımı {sayac['url']} · ölü doi {sayac['doi']} "
          f"· url'siz olduğu için dokunulmayan doi {sayac['doi_url_yok']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
