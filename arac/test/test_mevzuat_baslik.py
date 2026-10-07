import sys, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from mevzuat_baslik import kuyruk_ayir, basliklari_duzelt


class KuyrukAyir(unittest.TestCase):
    def test_iki_nokta_baslik(self):
        self.assertEqual(kuyruk_ayir("... hükümlerine tabidir. Terimler:"), ("... hükümlerine tabidir.", "Terimler"))

    def test_duz_baslik(self):
        self.assertEqual(kuyruk_ayir("Bu Kanun belediyeleri kapsar. Tanımlar"), ("Bu Kanun belediyeleri kapsar.", "Tanımlar"))

    def test_dipnot_isareti_atilir(self):
        self.assertEqual(kuyruk_ayir("... sayılır. Tüzel kişiliğin sona erdirilmesi [5]"), ("... sayılır.", "Tüzel kişiliğin sona erdirilmesi"))

    def test_bolum_basligi_ayrilir_ama_atanmaz(self):
        g, b = kuyruk_ayir("... eder. İKİNCİ BÖLÜM Belediyenin Kuruluşu ve Sınırları Kuruluş")
        self.assertEqual(g, "... eder.")
        self.assertIsNone(b)

    def test_yururluk_tablosu_dokunulmaz(self):
        t = "... yapılır. 7/6/2007 5747 11 22/3/2008 5766 16"
        self.assertEqual(kuyruk_ayir(t), (t, None))

    def test_degisiklik_kunyesi_dokunulmaz(self):
        t = "Madde metni. (Değişik: 12/6/2019-7257/3 md.)"
        self.assertEqual(kuyruk_ayir(t), (t, None))

    def test_bend_dokunulmaz(self):
        t = "Şunlar sayılır: (1) birinci bent"
        self.assertEqual(kuyruk_ayir(t), (t, None))

    def test_tam_cumle_dokunulmaz(self):
        t = "Bu kanun yayımı tarihinde yürürlüğe girer."
        self.assertEqual(kuyruk_ayir(t), (t, None))


class BasliklariDuzelt(unittest.TestCase):
    def test_sonrakine_atanir_kuratorlu_korunur(self):
        m = [
            {"madde": "Madde 1", "baslik": "", "metin": "Birinci madde. Terimler:"},
            {"madde": "Madde 2", "baslik": "", "metin": "İkinci madde. Kapsam"},
            {"madde": "Madde 3", "baslik": "Küratörlü", "metin": "Üçüncü madde."},
        ]
        ist = basliklari_duzelt(m)
        self.assertEqual(m[0]["metin"], "Birinci madde.")
        self.assertEqual(m[1]["baslik"], "Terimler")
        self.assertEqual(m[1]["metin"], "İkinci madde.")
        self.assertEqual(m[2]["baslik"], "Küratörlü")
        self.assertEqual(ist, {"kuyruk_alinan": 2, "baslik_atanan": 1, "baslik_atanamayan": 1})


if __name__ == "__main__":
    unittest.main()
