#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Çevrimdışı birim testleri — keşif motorunun güvenlik değişmezleri.

Ağ YOK: yalnız saf fonksiyonlar ve kaynak kataloğunun bütünlüğü sınanır.
Çalıştır: python3 arac/test/test_kesif_motoru.py
"""
import importlib.util
import json
import sys
import unittest
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent.parent
MOTOR = KOK / "arac" / "kesif" / "kesif-motoru.py"
KATALOG = KOK / "izleme" / "kesif" / "kaynak-kaynagi.json"


def yukle():
    spec = importlib.util.spec_from_file_location("kesif_motoru", MOTOR)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


km = yukle()


class TestOtoriteFiltresi(unittest.TestCase):
    def test_resmi(self):
        for u in ["https://www.tarimorman.gov.tr/SYGM", "https://power.larc.nasa.gov/",
                  "https://cds.climate.copernicus.eu", "https://www.fao.org/aquastat"]:
            self.assertEqual(km.otorite_sinifla(u), "resmi", u)

    def test_akademik(self):
        for u in ["https://spei.csic.es", "https://data.chc.ucsb.edu/x",
                  "https://dergipark.org.tr/y", "https://www.gleam.eu"]:
            self.assertEqual(km.otorite_sinifla(u), "akademik", u)

    def test_kurumsal(self):
        self.assertEqual(km.otorite_sinifla("https://www.wri.org/aqueduct"), "kurumsal")

    def test_belirsiz_agregator(self):
        self.assertEqual(km.otorite_sinifla("https://open-meteo.com"), "belirsiz")

    def test_red_sosyal(self):
        for u in ["https://twitter.com/x", "https://t.me/kanal",
                  "https://medium.com/p", "https://eksisozluk.com/baslik"]:
            self.assertEqual(km.otorite_sinifla(u), "red", u)

    def test_bilinmeyen_belirsiz(self):
        self.assertEqual(km.otorite_sinifla("https://rastgele-bilinmeyen.example"), "belirsiz")


class TestDurumSiniflandirma(unittest.TestCase):
    TEMEL = {"content_type": "application/json", "sema": ["a", "b"],
             "rate_limit": "100", "last_modified": "Mon, 01 Jan 2026 00:00:00 GMT"}

    def test_taban(self):
        self.assertEqual(km.durum_sinifla(None, {"durum": 200})[0], "taban")

    def test_ag_hatasi(self):
        self.assertEqual(km.durum_sinifla(self.TEMEL, {"durum": "AG"})[0], "erisilemiyor")

    def test_http_404(self):
        self.assertEqual(km.durum_sinifla(self.TEMEL, {"durum": 404})[0], "erisilemiyor")

    def test_http_202_kabul(self):
        self.assertNotEqual(km.durum_sinifla(None, {"durum": 202})[0], "erisilemiyor")

    def test_format_degisti(self):
        y = dict(self.TEMEL, durum=200, content_type="text/html")
        self.assertEqual(km.durum_sinifla(self.TEMEL, y)[0], "format-degisti")

    def test_sema_degisti(self):
        y = dict(self.TEMEL, durum=200, sema=["a", "c"])
        self.assertEqual(km.durum_sinifla(self.TEMEL, y)[0], "sema-degisti")

    def test_rate_limit_degisti(self):
        y = dict(self.TEMEL, durum=200, rate_limit="10")
        self.assertEqual(km.durum_sinifla(self.TEMEL, y)[0], "rate-limit-degisti")

    def test_yeni_veri_indirme(self):
        y = dict(self.TEMEL, durum=200, last_modified="Tue, 02 Jan 2026 00:00:00 GMT")
        self.assertEqual(km.durum_sinifla(self.TEMEL, y, veri_izle=True)[0], "yeni-veri")

    def test_dinamik_lastmod_yok_sayilir(self):
        y = dict(self.TEMEL, durum=200, last_modified="Tue, 02 Jan 2026 00:00:00 GMT")
        self.assertEqual(km.durum_sinifla(self.TEMEL, y, veri_izle=False)[0], "saglikli")

    def test_indirme_basliksiz_ozet(self):
        e = {"content_type": "application/pdf", "sema": None, "rate_limit": "",
             "last_modified": "", "sha256": "aaa"}
        y = dict(e, durum=200, sha256="bbb")
        self.assertEqual(km.durum_sinifla(e, y, veri_izle=True)[0], "yeni-veri")

    def test_saglikli(self):
        self.assertEqual(km.durum_sinifla(self.TEMEL, dict(self.TEMEL, durum=200))[0], "saglikli")


class TestSemaCikar(unittest.TestCase):
    def test_dict(self):
        self.assertEqual(km.sema_cikar(b'{"b":1,"a":2}', "application/json"), ["a", "b"])

    def test_html_none(self):
        self.assertIsNone(km.sema_cikar(b"<html></html>", "text/html"))

    def test_bozuk_json(self):
        self.assertEqual(km.sema_cikar(b"{bozuk", "application/json"), ["<çözümlenemedi>"])


class TestKatalogButunlugu(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.d = json.loads(KATALOG.read_text(encoding="utf-8"))
        cls.ks = cls.d["kaynaklar"]

    def test_id_tekil(self):
        ids = [k["id"] for k in self.ks]
        self.assertEqual(len(ids), len(set(ids)), "yinelenen id var")

    def test_zorunlu_alanlar(self):
        for k in self.ks:
            for alan in ("id", "ad", "kurum", "url", "katman", "otorite", "lisans",
                         "periyot", "tip", "erisim", "entegre", "kanit"):
                self.assertIn(alan, k, f"{k.get('id')}: {alan} eksik")
            self.assertTrue(k["kanit"].strip(), f"{k['id']}: kanıt boş (uydurma yasağı)")
            self.assertTrue(k["url"].startswith("http"), f"{k['id']}: url geçersiz")

    def test_otorite_gecerli(self):
        gecerli = {"resmi", "akademik", "kurumsal", "belirsiz", "red"}
        for k in self.ks:
            self.assertIn(k["otorite"], gecerli, k["id"])

    def test_entegre_gecerli(self):
        gecerli = {"mevcut", "izleme", "eksik", "veri-yok", "aday"}
        for k in self.ks:
            self.assertIn(k["entegre"], gecerli, k["id"])

    def test_aday_kaynaklar(self):
        for c in self.d["aday_kaynaklar"]:
            self.assertTrue(c["url"].startswith("http"), c.get("id"))
            self.assertTrue(c.get("otorite"), c.get("id"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
