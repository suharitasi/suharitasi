# SU KANUNU GÜNÜ PAKETİ — hazırlık (B4.5)

**YAYIN YOK.** Bu dosya, Su Kanunu resmen kamuya açıldığı gün saatler
içinde yayına hazır olmak için beklemede duran iskelet ve taslaklardır.
Tetiklenmeden hiçbiri yayımlanmaz.

Tarih: 2026-07-28 · Durum: **BEKLEMEDE**

---

## 0. Neden bu paket var

`izleme/su-izleme.sh` üç kanaldan Su Kanunu hareketini izliyor (TBMM
kanun teklifleri, komisyon gündemleri, Bakanlık/DSİ duyuruları) ve
`su-kanunu-taslak-2026` nöbetçisi Nisan 2026 taslağının bulunduğu PDF'i
`pdfhead` ile izliyor. Bir hareket yakalandığında **saatler** önemli
olacak: ilk doğru ve künyeli açıklamayı yayımlayan kaynak atıf toplar.
İskeleti o gün yazmaya başlamak, o pencereyi kaçırmak demektir.

## 1. TETİK — ne olursa paket açılır

| Kanal | Tetik | Bugünkü durum |
|---|---|---|
| `su-kanunu-taslak-2026` | PDF `Last-Modified` değişimi | izleniyor (taban 28.07) |
| `tbmm-kanun-teklifleri` | listeye "su" içeren yeni teklif | izleniyor |
| `tbmm-komisyon-gundemleri` | gündemde su kanunu maddesi | izleniyor |
| `tarimorman-sygm` / `dsi-duyuru-listesi` | resmî duyuru | izleniyor |
| Resmî Gazete | **kanunun yayımı** | `izleme/su-izleme.sh` M1 modülü |

**Bildirim yolu:** nöbetçi değişiklik yakalayınca `izleme/arsiv/` altına
tarihli kayıt düşer ve `izleme/OLAYLAR.md`'ye satır yazar. Oturum
açılışında görülür. **Ek olarak (B2.2):** Telegram köprüsü kurulursa
uyarı telefona da gider — `rapor/dis-izleme.md` §4.A.

## 2. KISIT — bugünkü taslak yayımlanamaz

`rapor/gece-faz-j-su-kanunu-taslak.md`: Nisan 2026 taslağının bulunduğu
TOBB üst yazısı **kamuya açık mecralarda yayımlanmamasını açıkça talep
ediyor.** Bu yüzden:

- Taslak metninden **alıntı yapılmaz**, madde metni yayımlanmaz.
- Bu paketteki iskelet, **kanun resmen açıldığında** doldurulmak üzere
  yazılmıştır; bugünkü taslağın içeriğini taşımaz.
- Karar [SERDAR-HUKUK] etiketlidir ve bu revizyonun kapsamı dışındadır.

## 3. REHBER İSKELETİ — `/rehberler/su-kanunu/` (BOŞ, doldurulacak)

> Aşağıdaki başlıklar **yapıdır**, içerik değildir. Her başlığın altına
> yalnız kanunun kendi metninden ve resmî gerekçesinden doğrulanabilir
> cümle yazılır. **Hukuki yorum bu pakette YOKTUR** ve otomatik
> yazılmaz — [SERDAR-HUKUK].

```
H1  Su Kanunu ne getiriyor?

    ÖZ CEVAP (≤280 karakter, meta-description + AI alıntı kaynağı)
    → [kanun yayımlandığında yazılır; taslaktan yazılmaz]

H2  Kanun ne zaman yürürlüğe girdi?
    - Resmî Gazete tarih + sayı  [künye zorunlu]
    - Yürürlük maddesi
    - Geçiş hükümleri varsa

H2  Kimleri ilgilendiriyor?
    - Kuyu sahibi çiftçi / işletme
    - Sanayi tesisi (su verimliliği belgesi olanlar)
    - Belediye / su idaresi
    - Maden ve jeotermal ruhsat sahibi
    → her kalem mevcut rehberlere iç link

H2  Mevcut ruhsatlar ne olacak?
    - Kazanılmış hak / geçiş hükmü [kanun metninden]
    - Yeniden başvuru gerekiyor mu

H2  Su tahsisi yetkisi kimde?
    - İlgili madde  [künyeli]
    - /hangi-kurum/ sayfasıyla çelişki var mı → varsa O SAYFA GÜNCELLENİR

H2  Yaptırımlar değişti mi?
    - İdari para cezası kalemleri
    - /rehberler/ ceza sayfasıyla karşılaştırma

H2  Hangi mevzuat yürürlükten kalktı?
    - 167 sayılı Yeraltı Suları Kanunu'nun durumu  [KRİTİK: sitedeki
      tüm rehberler bu kanuna atıf yapıyor — kalkarsa TOPLU GÜNCELLEME]
    - Etkilenen sayfa listesi (aşağıda §5)

H2  Sık sorulanlar   [FAQPage şeması]
    - 5-8 soru; cevaplar mevcut rehberlerden BİREBİR alınır, yeni
      hukuki iddia üretilmez (kapı sayfası deseni: kapi-sss.js)
```

**Yayın kontrol listesi (rehber yazıldığında):** öz-cevap ≤280 · JSON-LD
Article + FAQPage · canonical · OG · iç link (en az 3 mevcut rehbere) ·
`izleme/cekirdek-sayfalar.json`'a eklenir · llms.txt + sitemap otomatik ·
`--hizli` sağlık koşusu yeşil.

## 4. BASIN / AKADEMİ E-POSTA TASLAĞI (GÖNDERİLMEDİ)

> Gönderim kullanıcı kararıdır. Adresler `rapor/temas-listesi.md`'de.
> **Kişisel veri toplanmadı** — yalnız kurumsal, kamuya açık kanallar.

**Konu:** Su Kanunu — havza ve il ölçeğinde veri seti (suharitasi.com)

```
Sayın [Ad / Kurum],

Su Kanunu'nun [Resmî Gazete tarih/sayı] ile yayımlanması üzerine,
haberinizde ya da çalışmanızda kullanabileceğiniz kamuya açık bir veri
setini paylaşmak istiyorum.

suharitasi.com, Türkiye'nin su verisini tek yerde derliyor:
- 12 yayımlı nehir havzası yönetim planından 472 yeraltı suyu kütlesi
  (miktar ve kimyasal durum sınıflaması, plan verisinden aktarıldığı gibi),
- Resmî Gazete'de 1963-2017 arasında ilan edilmiş 419 yeraltı suyu
  işletme sahası kaydı (her biri tarih + sayı + arşiv bağlantısı künyeli),
- 81 il için ayrı veri sayfası ve 25 havza künyesi.

Verinin tamamı resmî kaynaklardan derlendi; her sayı yayında veriden
yeniden hesaplanıyor ve kaynak künyeleri açık:
https://suharitasi.com/arsiv/

Kanunun etkilediği alanlarla ilgili rehber sayfaları:
https://suharitasi.com/rehberler/

Veriyi atıfla kullanabilirsiniz. Belirli bir kırılım (il, havza, dönem)
gerekirse hazırlayıp iletebilirim.

Saygılarımla,
Av. Serdar Arslan
Arslan Hukuk Bürosu · arslanhukuk.tr
bilgi@suharitasi.com
```

**Taslağın kuralları:**
- Rakamlar `src/data/vitrin.js`'ten gelir; **gönderim günü yeniden
  ölçülür** (sayı bekçisi sitede çalışıyor ama e-postada çalışmaz —
  elle doğrulanır).
- Hukuki yorum YOK, kanun hakkında görüş YOK — yalnız veri sunumu.
- TBB reklam yasağı: hizmet vaadi ve çağrı cümlesi kurulmaz.
- Tek gönderim; takip mesajı **kullanıcı kararıdır**.

### 4.1 Akademi varyantı (fark)
Giriş paragrafı yerine: *"Havza ve kütle ölçeğinde derlenmiş veri
setinin ham JSON dosyaları ve künyeleri açık; çalışmalarınızda atıfla
kullanabilirsiniz."* + `KAYNAKLAR.md` bağlantısı ve lisans notu
(OSM/ODbL, Copernicus atıf).

## 5. KANUN YAYIMLANIRSA ETKİLENECEK SAYFALAR (önden çıkarıldı)

167 sayılı Kanun'a atıf yapan sayfalar toplu güncelleme gerektirebilir.
**Bu liste tetik günü `grep` ile YENİDEN üretilir** (bugünkü hâli
bayatlayabilir):

```
grep -rln "167 sayılı" src/content/ src/pages/ src/data/
```

Etkilenirse sıra: (1) rehberler, (2) `/hangi-kurum/`, (3) `/durumum/`,
(4) il sayfası şablonu, (5) SSS havuzları.

## 6. BU PAKET AÇILDIĞINDA — sıra

1. Tetik doğrulanır (Resmî Gazete künyesi; ikinci kaynak).
2. §5 grep'i koşulur, etkilenen sayfa listesi çıkarılır.
3. Rehber iskeleti doldurulur — **yalnız kanun metninden**.
4. Çelişen mevcut sayfalar güncellenir (eskisi bırakılmaz).
5. `--hizli` sağlık koşusu + gerileme denetimi.
6. Yayın.
7. E-posta gönderimi **kullanıcı onayıyla** (§4).
