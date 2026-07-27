# FAZ 2 RAPORU — kütle→il eşlemesi (KISMİ — G4 çelişkisi var)

Tarih: 2026-07-27 · Araç: `arac/kutle-il-esle.py` · Çıktı: `veri/potansiyel/kutle-il.json`

## G4 ÇELİŞKİSİ — ilçe→il dizini edinilemedi

Brief 2.1 "repoda varsa mevcut olan; yoksa TÜİK idari bölünüş listesi
indirilir" diyor. Repoda ilçe dizini YOK; resmî liste indirme denemeleri
(ölçülen):

| Kaynak | Sonuç |
|---|---|
| TÜİK veriportali | SPA + OIDC (keycloak) — statik indirme ucu yok |
| TÜİK MEDAS | UI 200, API ucu keşfedilemedi (404) |
| e-icisleri.gov.tr MulkiIdariBolumleri | 000 — bağlantı yok (TR-IP engeli olası) |
| illeridaresi.gov.tr | 000 — bağlantı yok |
| PTT postakodu | 302 zinciri, son adım gövde vermiyor |
| data.gov.tr CKAN API | 000 — bağlantı yok |

**Bu yüzden tur-1'in ilçe-adı ayağı KOŞULAMADI**; eşleme yalnız
PDF-içi kanıtlarla ve il-adı eşleşmesiyle yapıldı. Karar seçenekleri
DUR bölümünde.

## Yöntem katmanları (her kayıtta yontem + kanit alanı)

| Katman | Kanıt sınıfı | Eşlenen |
|---|---|---|
| kapsadigi-iller | Sakarya ana planındaki resmî "YSK_Kodu / YSK_Adı / **Kapsadığı İller**" tablosu (s.~845+) | 71 (Sakarya 71/71 TAM) |
| il-adi-tam | kütle adındaki yer adı bir İL adıyla tam kelime eşleşiyor | 18 |
| metin-baglami | il adı, kütlenin KENDİ kodunun VE adının geçtiği satırda (izleme noktası/tedbir tabloları "TR080502xx Muğla,Arsaköy" biçiminde il yazıyor) | 94 |
| — | eşleşmedi | belirsiz 3 / doğrulanamadı 286 |

**Özet: 183 eşleşti · 3 belirsiz · 286 doğrulanamadı (toplam 472).**
Doğrulanamadı = "il eşlemesi doğrulanamadı" etiketi → il sayfasına BASILMAZ
(brief 2.3). Tahmin ataması SIFIR; `oneri_havza_illeri` alanı yalnız analiz
içindir, eşleme olarak kullanılmamıştır.

Havza kırılımı: sakarya 71/0/0 · bati-akdeniz 64/0/3 · burdur 15/1/11 ·
kuzey-ege 12/2/17 · buyuk-menderes 6/0/32 · kucuk-menderes 6/0/36 ·
yesilirmak 3/0/51 · susurluk 2/0/20 · konya 2/0/16 · gediz 1/0/75 ·
meric-ergene 1/0/11 · akarcay 0/0/14 (eşleşti/belirsiz/doğrulanamadı).

## Denetimde yakalanan ve düzeltilen yanlış-pozitif vakaları (kanıtlı)

1. ±2 satır bağlam kuralı yanlış eşledi: Yatağan Devoniyen→"Aydın" (komşu
   satır başka kütlenin), Gümelönü→"Çorum" (başka kütlenin adı). → Kural
   "kendi kod satırı + başka kod yok" olarak sıkılaştırıldı.
2. "SAKARYA HAVZASI" üstbilgisi il sanıldı → "X Havzası" kalıbı elendi.
3. Havza/durum sütunu gürültüsü ("TR12050005 Sakarya Orta ...") → ad-parçası
   şartı eklendi.
4. Kapsadığı İller sütununun ALT satıra sarması (TR12050003 Eskişehir) →
   çapraz kontrol yakaladı, iki yönlü sarma tarandı.

Ad-eşleşmesinin neden tek başına tehlikeli olduğunun resmî kanıtı:
"Osmaniye Alüvyonu" kütlesi Kapsadığı İller tablosunda **Eskişehir** (il
Osmaniye değil, köy adı).

## Çapraz-kaynak çelişkisi (1 adet — çözülmedi, notuyla saklandı)

TR12050009 Porsuk-Ankara Havzaları Alüvyonları: Kapsadığı İller tablosu
"Bilecik, Eskişehir"; künye tedbir sayfalarındaki İl alanları "Ankara" da
içeriyor. JSON'da `capraz_kontrol` notuyla ikisi de duruyor; yayında tablo
esas alındı (tam-kırılım beyanı).

## BELİRSİZ LİSTESİ — kullanıcı kararı bekliyor (brief 2.4)

| Kütle | Havza | Adaylar (ikisi de metinde kanıtlı) |
|---|---|---|
| TR04050216 Altınova | Kuzey Ege | İzmir / Balıkesir |
| TR04050218 Aliağa | Kuzey Ege | İzmir / Aydın |
| TR10050327 Başmakçı YSK | Burdur | Denizli / Afyonkarahisar |

## BİTTİ-TANIMI kontrolü

Her kütle ya ≥1 ile eşli (183) ya etiketli (belirsiz 3 + doğrulanamadı 286);
tahmin ataması SIFIR. ✓ (doğrulanamadı oranı yüksek — ilçe dizini kararına
bağlı, aşağıda.)

## KULLANICI KARARLARI

1. **İlçe dizini (G4):**
   - **(A) önerilen:** OSM Overpass'tan ilçe→il dizini (admin_level=6;
     ODbL atfı — brief 4.D/5.2 OSM'yi zaten kullanıyor; erişim ÇALIŞIYOR).
     286 doğrulanamadının büyük kısmını çözmesi beklenir; her eşleşme yine
     TAM KELİME kuralı + belirsizlik etiketiyle işlenir.
   - (B) Kullanıcı TR-IP'den resmî listeyi indirir — İNDİRME MANİFESTİ:
     https://www.e-icisleri.gov.tr/Anasayfa/MulkiIdariBolumleri.aspx
     (veya TÜİK ADNKS il-ilçe tablosu) → hedef: `veri/ham/idari/il-ilce.csv`
     (UTF-8, `il;ilce` başlıklı). En sağlam yol; A ile çapraz doğrulanabilir.
   - (C) Kısmi eşlemeyle devam: 286 kütle il sayfasına basılmaz.
2. **3 belirsiz kütle**: aday illerden seçim ya da "belirsiz kalsın" kararı.
3. TR12050009 çelişkisi: tablo esas (mevcut) / künye dahil (3 il) tercihi.

---

## GÜNCELLEME — kullanıcı kararları uygulandı (2026-07-27, ikinci koşu)

Kararlar: (1) A — OSM ilçe→il dizini; resmî çapraz doğrulama SIRADAKILER'e
yazıldı. (2) Belirsizler havza-il kesişimiyle çözülür; çözülmeyen kalır.
(3) TR12050009 tablo esas; künye Ankara'sı dahil edilmedi, çelişki notu
veride (`capraz_kontrol`).

### İlçe dizini (OSM, ODbL)
`arac/osm-ilce-indir.py` — il-başına 81 sorgu 429/504 yedi; İKİ toplu
sorguya (admin_level=4 subarea üyeliği → admin_level=6) + ayna
(kumi.systems) + geri çekilmeye geçildi. OSM'nin şapkalı yazımı (Elâzığ,
Hakkâri) normalize edildi. Ölçülen: **81/81 il, 975 ilçe relation, 948
benzersiz ilçe adı** → `veri/potansiyel/ilce-il-dizini.json`.

### Nihai eşleme
| Durum | Sayı | Yöntem kırılımı |
|---|---|---|
| eşleşti | **314** | kapsadigi-iller 71 · ad-dizin 185 · metin-bağlamı 58 (8'i +havza-kesişim kararıyla) |
| belirsiz | **5** | Kemer (Antalya/Burdur ×2 kütle), Altınova (Balıkesir/İzmir), Çivril-Dinar (Afyonkarahisar/Denizli), Orhaneli-Çavdarhisar (Bursa/Kütahya) — kesişim tekilleştirmedi, kaldı |
| doğrulanamadı | **153** | il sayfasına basılmaz |

Çok-illi kütle: 25 (kırılım korunuyor, ortalama yok).

### Bu koşuda yakalanan ve düzeltilen 2 yeni tuzak (kanıtlı)
1. **Köy↔ilçe ad çakışması**: 17 vaka (Çavdarlı→"Kars", KAYAPINAR→
   "Diyarbakır", Hatay semti→"Hatay" ili...) → HAVZA-TUTARLILIK FİLTRESİ:
   havza illeri dışındaki adaylar elenir; filtre sonrası havza-dışı
   eşleşme **0** (ölçüldü).
2. **Kütle adı il sanılması**: "Osmaniye Alüvyonu" kapsam tablosunda
   'Osmaniye' ili üretmişti → kütlenin kendi adı satırdan çıkarılıp
   tokenlanıyor; TR12050006 → yalnız Eskişehir.

### BİTTİ-TANIMI (nihai)
Her kütle ≥1 ile eşli (314) ya da etiketli (belirsiz 5 + doğrulanamadı 153);
tahmin ataması SIFIR; havza-kesişim çözümleri kullanıcı kararına dayalı ve
`kanit.karar` alanıyla işaretli. ✓
