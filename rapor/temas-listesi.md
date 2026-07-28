# TEMAS LİSTESİ — kamuya açık kurumsal kanallar (B4.7)

Tarih: 2026-07-28 · **HİÇBİR E-POSTA GÖNDERİLMEDİ.** Bu bir hazırlıktır.

## Kurallar (bu listeye ne girer, ne girmez)

- **Yalnız kurumsal, kamuya açık kanallar.** Kişisel e-posta, telefon,
  özel hesap **toplanmadı ve yazılmadı** — KVKK riski ve nezaket.
- Her satırda **kaynak URL** vardır ve URL'in **HTTP durumu ölçüldü**
  (28.07.2026, `curl -L`).
- Erişilemeyen ya da doğrulanamayan kayıt **"doğrulanmadı"** işaretlidir;
  varsayımla doldurulmadı.
- Liste **kime yazılacağını** değil, **nereden ulaşılacağını** verir.
  Gönderim kararı ve muhatap seçimi kullanıcınındır.
- Bu liste bir "kitle listesi" değildir. Toplu gönderim önerilmiyor;
  her temas tekil ve konuya özel olmalı (bkz. §5).

---

## 1. MESLEK ÖRGÜTÜ — jeoloji / su

| Kurum | Kanal | HTTP | Not |
|---|---|---|---|
| **TMMOB Jeoloji Mühendisleri Odası** | https://www.jmo.org.tr/iletisim.php | **200** | Odanın kendi ana sayfasından bağlanan resmî iletişim sayfası (ana sayfada 3 yerde bu URL'e link ölçüldü). Hidrojeoloji komisyonu bu oda bünyesindedir. |
| JMO şubeler dizini | https://www.jmo.org.tr/subeler/ | **200** | Bölge şubeleri — il ölçeğinde muhatap gerekirse. |
| TMMOB (çatı) | https://www.tmmob.org.tr/ | **200** | `/icerik/iletisim` **404 ölçüldü** — iletişim yolu ana sayfadan bulunmalı, **doğrulanmadı**. |

**Neden bu kanal:** sitenin verisi (472 YAS kütlesi, 419 RG işletme
sahası kaydı, GLO-90 morfoloji) doğrudan hidrojeoloji mesleğinin çalışma
alanı. Odanın yayınlarında atıf, hem otorite hem düzeltme geri bildirimi
sağlar.

---

## 2. AKADEMİ — hidrojeoloji / su yönetimi

Bu revizyonda **tek tek akademisyen listesi çıkarılmadı** — kişisel veri
toplama sınırı (§Kurallar). Bunun yerine kurumsal kapılar:

| Kanal | URL | HTTP | Not |
|---|---|---|---|
| **Hidropolitik Akademi** | https://www.hidropolitikakademi.org/tr/iletisim | **200** | Su politikası odaklı; yayın ve etkinlik kanalı var. |
| DergiPark (akademik dergi platformu) | https://dergipark.org.tr | — (sitede zaten kaynak olarak kullanılıyor) | Konuyla ilgili dergilerin editör kanalları buradan bulunur. |
| Site kendi kaynak kaydı | `KAYNAKLAR.md` + `veri/potansiyel/akademik-kunye.json` | — | **1.979 akademik künye, 81 il** zaten derlenmiş. Muhatap seçimi bu künyelerden yapılabilir — **ama kişisel iletişim bilgisi bu dosyada YOK ve toplanmadı.** |

**Öneri (kullanıcı kararı):** akademiyle temas için en düşük sürtünmeli
yol, tek tek e-posta değil, **verinin atıflanabilir hâlde ve açık
lisansla durduğunu duyurmaktır** (`/arsiv/` + `KAYNAKLAR.md`). Akademisyen
veriyi kendisi bulur; soğuk e-posta gerektirmez.

---

## 3. VERİ GAZETECİLİĞİ / ÇEVRE HABERCİLİĞİ

| Yayın | İletişim | HTTP | Not |
|---|---|---|---|
| **Journo** | https://journo.com.tr/iletisim | **200** | Gazetecilik odaklı; veri gazeteciliği kaynak derlemeleri yayımlıyor. |
| **İklim Haber** | https://www.iklimhaber.org/iletisim/ | **200** | İklim/su konusunda düzenli yayın. |
| **Yeşil Gazete** | https://yesilgazete.org/iletisim/ | **200** | Ekoloji haberciliği. |
| **dokuz8HABER** | https://dokuz8haber.net/ | **200** | İletişim alt sayfası **doğrulanmadı** — ana sayfadan bulunmalı. |
| **Dağ Medya** | https://www.dagmedya.net/ | **200** | Veri gazeteciliği eğitimi/atölye; iletişim alt sayfası **doğrulanmadı**. |
| verigazeteciligi.com | https://www.verigazeteciligi.com/ | **000 (erişilemedi)** | **doğrulanmadı** — site yanıt vermedi (28.07 ölçümü). Kaynaklarda anılıyor ama bugün ulaşılamadı. |

**Neden bu kanal:** veri gazetecisinin aradığı şey tam olarak elimizdeki
şey — künyeli, indirilebilir, kamu kaynağına dayalı bir veri seti.
Sitenin en yüksek getirili dağıtım kanalı büyük olasılıkla budur
(bir haberde atıf = kalıcı bağlantı + otorite).

---

## 4. SEKTÖR — sondaj / arıtma firmaları

**Bu listeye firma adı YAZILMADI.** Gerekçe iki katlı:

1. **Ölçüm:** sitenin kendi konusunda arama sonuçları taranınca
   (`kuyu ruhsatı` sorgusu, 28.07) ilk sayfada **yedi sondaj/ruhsat
   firması** çıktı, suharitasi.com **çıkmadı**
   (`rapor/dagitim-durumu.md` §3). Bu firmalar aynı sorguda **rakip**
   konumda; onlara veri duyurusu yapmak rekabet avantajını karşı tarafa
   vermek olur.
2. **Nitelik:** bu firmalar ziyaretçi değil, **potansiyel yönlendirme
   ortağı** olabilir (ruhsat işi hukukçuya, sondaj işi firmaya). Ama bu
   bir **iş ortaklığı kararıdır**, temas listesi işi değil — ve TBB
   reklam/iş getirme kuralları açısından ayrı değerlendirme gerektirir.
   **[SERDAR-HUKUK]**

**Kullanıcı isterse:** "hangi firmalar" değil, "hangi kanal" olarak
JMO şubeleri (§1) ve Sondajcılar Derneği türü meslek örgütleri
araştırılabilir — bu revizyonda **yapılmadı**.

---

## 5. GÖNDERİM İLKELERİ (temas kararı verilirse)

1. **Toplu gönderim yok.** Her mesaj tek muhataba, konuya özel.
2. **Hukuki hizmet vaadi yok, çağrı cümlesi yok** — TBB reklam yasağı.
   Mesaj *veriyi* tanıtır, *büroyu* değil.
3. **Her sayı gönderim günü yeniden ölçülür.** Sitedeki sayı bekçisi
   e-postayı korumaz; bayat sayı ilk temasta güveni bitirir.
4. **Bir kez gönderilir.** Takip mesajı ayrı bir karardır.
5. Taslak metin: `icerik-taslak/su-kanunu-gunu-paketi.md` §4
   (basın varyantı) ve §4.1 (akademi varyantı).
6. Gönderim yapılırsa **kaydı tutulur** (kime, ne zaman, hangi metin) —
   ikinci kez aynı kişiye yazılmasın.

---

## 6. ÖLÇÜM KAYDI

`curl -s -o /dev/null -w "%{http_code}" -m 12 -L -A "Mozilla/5.0 (compatible)"`
ile 28.07.2026 22:4x UTC'de ölçüldü. Ölçüm **erişilebilirliği** gösterir,
**kanalın uygunluğunu göstermez** — hangi kurumun muhatap olacağı
kullanıcı kararıdır.

Ayrıca ölçüldü ve listeye **alınmadı**: `www.tmmob.org.tr/icerik/iletisim`
(404), `www.jmo.org.tr/iletisim/` (404 — doğru yol `.php` uzantılı),
`www.sukanunu.gov.tr` (000 — böyle bir alan adı yanıt vermiyor),
`www.wwf.org.tr` (403 — bot engeli; kanal var olabilir, **doğrulanmadı**).
