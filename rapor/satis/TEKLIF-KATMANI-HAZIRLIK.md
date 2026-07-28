# TEKLİF KATMANI — MİNİMAL HAZIRLIK (B4.6)

**UYGULANMADI. Yayına alınmadı.** Bu belge, kullanıcının *"WhatsApp'ı
bekletiyorum"* kararı geçerliyken bile çalışabilecek hâli — mevcut
`mailto:` altyapısıyla — **metin ve yerleşim olarak** hazırlar.
Karar geldiğinde geriye **tek merge'lük iş** kalır.

Tarih: 2026-07-28 · Kaynak: `rapor/satis/BIRLESIK-SATIS-RAPORU.md` ·
Bekleyen paket tanımı: `SIRADAKILER.md` "BEKLETİLEN PAKET"

---

## 0. Neden WhatsApp'sız hâli hazırlanıyor

Bekletilen 6 kalemin **hiçbiri aslında WhatsApp'a bağımlı değil.** Hepsi
"görüşmeye köprü" kalemi; köprünün ucunda WhatsApp da olabilir, mevcut
`mailto:` de. Ölçüldü: canlı ana sayfada **3**, kuyu-ruhsatı rehberinde
**2** `mailto:` bağlantısı zaten çalışıyor (site geneli 17 — md19).

Yani paket WhatsApp'ı bekliyordu ama **beklemesi gerekmiyordu.** Bu
belge o farkı kapatır: karar WhatsApp yönünde çıkarsa `href` değişir,
metin aynı kalır.

**Uyarı (dürüstlük):** dönüşüm ölçümü hâlâ YOK (B4.2: canlıda analitik
beacon'ı yok — 22 istekte 0 analitik). Bu kalemlerin işe yarayıp
yaramadığı **ölçülemeyecek.** Önce analitik, sonra bu paket — sıralama
önerisi budur.

---

## 1. K1 — CTA ETİKETİNİ TEKLEŞTİR (R1-QW1)

**Bugünkü çelişki (ölçüldü):**

| Yer | Bugünkü metin | Dosya |
|---|---|---|
| Menü (üst, masaüstü) | "Randevu Al" | `PaylasilanMenu.astro:99` |
| Menü (açılır liste) | "Randevu Al" | `PaylasilanMenu.astro:134` |
| Hero birincil düğme | "Ücretsiz Ön Görüşme Alın" | `anasayfa/Hero.astro:79` |

Aynı eylem için iki ad. Ziyaretçi bunu iki ayrı şey sanır.

**Hazırlanan hâl — tek etiket: "Ücretsiz Ön Görüşme"**

| Yer | Yeni metin | Gerekçe |
|---|---|---|
| Menü üst | `Ücretsiz Ön Görüşme` | "Randevu" bir yükümlülük çağrıştırır; "ön görüşme" eşiği düşürür ve ücretsiz olduğunu söyler |
| Menü liste | `Ücretsiz Ön Görüşme` | aynı |
| Hero düğme | `Ücretsiz Ön Görüşme` | "Alın" emir kipi düşer; etiket her yerde birebir aynı olur |

**Dokunulacak:** 2 dosya, 3 satır. `href` DEĞİŞMEZ.
**Risk:** menü düğmesi genişler → `--hizli` md14 G1-G6 ve md21 dokunma
kalemleri yeniden ölçülmeli (etiket 10 → 20 karakter).
**TBB kontrolü:** "ücretsiz" ifadesi hizmet vaadi değil, ücret bilgisidir;
mevcut hero'da ZATEN kullanılıyor — yeni iddia doğmuyor.

---

## 2. K2 — İL SAYFASI GÖRÜŞME KÖPRÜSÜ (R1-QW2 · R2-Sayfa3 · R3-Line3)

**Yer:** il sayfasındaki "Belge süreci nasıl işler?" bloğunun **sonu**
(81 sayfa, tek şablon).

**Metin (hazır):**

> Bu süreci vekâletle yürütmek isterseniz durumunuzu yazın:
> **ücretsiz ön görüşme**.

`ücretsiz ön görüşme` → mevcut `mailto:` (WhatsApp gelirse `href` değişir).

**Neden buraya:** ziyaretçi süreci okuyup "bunu ben mi yapacağım?"
sorusunu tam o noktada sorar. Blok başına konursa okumayı keser.

**Dokunulacak:** il sayfası şablonu, 1 blok.
**Kanıt yükümlülüğü:** 81 sayfada gerileme 0 · S1 korunur · md19 mailto
sayısı 17 → 98 (artış beklenen, kalem "en az 1" arıyor).

---

## 3. K3 — REHBER GÖRÜŞME KÖPRÜSÜ (R1-QW3)

**Yer:** rehberlerdeki "Dikkat" bloğunun **hemen ardı** (10 rehber).

**Metin (hazır):**

> Kendi durumunuz bu tarife uymuyorsa yazın: **ücretsiz ön görüşme**.

**Neden buraya:** "Dikkat" bloğu istisnayı anlatır; okuyucunun "ya benimki
istisnaysa?" endişesi tam orada doğar. Köprü endişenin doğduğu yerde durur.

**Çakışma kontrolü (ölçüldü):** rehberlerde zaten `RehberKapanis` ve
`SonrakiAdim` var (bilinçli /durumum/ tekrarı — SIRADAKILER). Bu üçüncü
köprü **aynı sayfada üç CTA** demek. **KARAR GEREKİR:** ya bu kalem
düşer, ya `SonrakiAdim` sadeleşir. Ölçüm olmadan tahmin yürütülmemeli
(analitik önce).

---

## 4. K4 — FRICTION-REDUCER SATIRI (R3-Line6)

**Metin (hazır, "2 dakikada" parçası ÇIKARILDI — [DOĞRULANMAMIŞ]):**

> Durumunuzu birkaç cümleyle yazmanız yeterli; belge göndermenize gerek yok.

**Yer:** her `mailto:` CTA'sının **altında**, tek satır, küçük punto.

**Neden:** en büyük sürtünme "ne yazacağım / neyi hazırlamam gerek"
belirsizliğidir. Bu cümle onu kapatır.

**Çıkarılan iddia:** "2 dakikada" — süre ölçülmedi, uydurma yasağı.

---

## 5. K5 — RİSK-REVERSAL MİKRO METNİ (R2) · **[SERDAR-HUKUK] TEYİDİ ŞART**

**Önerilen metin:**

> Ön görüşme ücretsizdir; ödeme bilgisi istenmez.

**DURUM: BEKLEMEDE.** "ödeme bilgisi istenmez" cümlesi bir **taahhüttür.**
Uygulanabilmesi için kullanıcının bunu fiilen taahhüt ettiğini teyit
etmesi gerekir. **Claude Code bu cümleyi kendiliğinden yayımlamaz.**

Teyit gelirse yerleşim K4 ile aynı satırda birleştirilir:
> Ön görüşme ücretsizdir, ödeme bilgisi istenmez; durumunuzu birkaç
> cümleyle yazmanız yeterli.

---

## 6. K6 — TEKLİF KAPSAMI TANIMI (R3-Verdict2)

**Bugünkü boşluk (rapor bulgusu):** ziyaretçi "ön görüşmede ne olacak,
sonra ne olur, ne kadar tutar?" sorusunun cevabını sitede **hiç**
bulamıyor.

**Hazırlanan blok — `/iletisim/` sayfasına, formdan/CTA'dan ÖNCE:**

> ### Ön görüşmede ne oluyor?
> 1. Durumunuzu yazıyorsunuz — belge göndermeniz gerekmiyor.
> 2. Konunun hangi mevzuata girdiğini ve hangi kuruma başvurulduğunu
>    yazılı olarak alıyorsunuz.
> 3. İş vekâlet gerektiriyorsa kapsam ve ücret ayrıca konuşuluyor.
>
> Ön görüşme ücretsizdir ve sizi bağlamaz.

**[SERDAR-HUKUK] KONTROLÜ ŞART:** 2. maddedeki "yazılı olarak alıyorsunuz"
bir **hizmet taahhüdüdür** ve TBB reklam yasağı açısından
değerlendirilmelidir. Claude Code bu bloğu onaysız yayımlamaz.

---

## 7. UYGULAMA SIRASI (karar gelirse)

| Sıra | Kalem | Bağımlılık | Dokunulan |
|---|---|---|---|
| 1 | **B4.2 analitik** | panel | — (önce bu; yoksa ölçüm yok) |
| 2 | K1 CTA tekleştirme | yok | 2 dosya / 3 satır |
| 3 | K4 friction-reducer | yok | CTA bileşeni |
| 4 | K2 il köprüsü | yok | il şablonu |
| 5 | K3 rehber köprüsü | **K3 çakışma kararı** | rehber şablonu |
| 6 | K5 risk-reversal | **[SERDAR-HUKUK]** | CTA bileşeni |
| 7 | K6 kapsam bloğu | **[SERDAR-HUKUK]** | /iletisim/ |

**Toplam tahmin:** K1+K4 yarım gün · K2+K3 yarım gün · K5+K6 onay sonrası
yarım gün.

## 8. KAPSAM DIŞI (kalıcı)

- **Ceza tutarı niceleme (R3-Line4):** APILEX teyidi ister; sayısal ceza
  iddiası doğrulanmadan yazılmaz.
- **A/B testleri (R1 Test Ideas):** altyapı yok ve analitik yok; test
  kurmak ölçemeyeceğiniz bir şeyi kurmaktır.
- **H1 alternatifleri (A/B/C):** mevcut H1 kullanıcı onaylı satış
  metnidir (U1-U4, merge edildi). Değiştirmek yeni bir karar gerektirir.
