# Hazırlık raporu — mobil ilk-ekran seçenek analizi + il-rejimi taşıma briefi
2026-07-28 · UYGULAMA YOK, kod değişmedi · Ölçüm tabanı: canlı site
(https://suharitasi.com, 375×812, headless; kare üretilmedi — brief şartı).
Bağlam: PAZARLAMA-KAZI.md FAZ B Persona-1 bulgusu + FAZ E K2.

---

## 1. Mobil 375px ilk ekran — kim hangi yüksekliği yiyor [VERİ]

Belge toplamı 5.883px; kadraj 812px. Satır satır envanter (canlı ölçüm):

| Bölge (px) | Öğe | Yükseklik | Not |
|---|---|---|---|
| 0–77 | menü şeridi (marka + hamburger) | 77 | |
| 77–254 | boşluk — sahne nefes alanı | **177** | sahne videosu tam-ekran arkada |
| 254–277 | rozet "Su Hukuku · Danışmanlık · Su Hakları" | 23 | |
| 277–299 | boşluk | 22 | |
| 299–378 | H1 (2 satır) | 79 | |
| 378–534 | alt metin paragrafı (`.v2-alt-metin`, 6 satır) | **156** | ilk ekranın en büyük metin yiyicisi |
| 534–562 | 2 CTA butonu (yan yana) | 28 | |
| 562–734 | boşluk | **172** | ikinci büyük boşluk bandı |
| 734–788 | sahne nokta göstergesi + aşağı oku | 54 | |
| **812** | — KADRAJ SINIRI — | | |
| 812–832 | h2 "Sık sorulan sorular" | 20 | tam sınırda, fiilen görünmez |
| 846–1141 | 6 soru linki (her biri 49px, dikey liste) | 295 | |

**Kritik mesafeler [VERİ]:** ilk soru kadrajın **34px altında**; dert-adlandıran
soru ("Ruhsatsız kuyu cezası aldım, ne yapmalıyım?" — listede 3.) 945px'te,
kadrajın **133px altında**. Toplam sıkıştırılabilir boşluk: 177+172 = 349px
(tamamı sıkıştırılamaz — sahne nefesi tasarım öğesi).

**Ucuz kaldıraç [VERİ]:** `SORULAR_V2` kayıtlarında masaüstü konumlar kayıt
başına sabit (`ust/sol`) — dizide sıra değişikliği masaüstü uçuşan yerleşimi
DEĞİŞTİRMEZ, yalnız mobil dikey listenin sırasını değiştirir. "Cezası aldım"
sorusunu dizide öne almak sıfır görsel maliyetle mobil listenin başına taşır
(yine de kadraj DIŞINDA kalır; tek başına yetmez, aşağıdaki seçeneklerle
birleşir).

### Seçenek tablosu (UYGULAMA YOK — karar kullanıcıda)

| # | Yol | Ne değişir | Kazanç (hesap) | v0'a dokunma | Risk |
|---|---|---|---|---|---|
| S1 | **Boşluk sıkıştırma (yalnız mobil)**: 562–734 bandı ~100px daraltılır; soru bölümü yukarı çeker | Yalnız mobil medya sorgusunda spacing | h2 → ~712, ilk soru → ~746: **ilk soru + sıra değişikliğiyle dert-adlandıran soru kadraj İÇİNDE** | **En düşük** — metin/kompozisyon aynen, tek spacing | Sahne noktaları (734–788) ile soru bölümü sıkışır; sahne izleme hissi mobilde daralır [VARSAYIM]. LH/CLS 3-tur medyanla doğrulanmalı |
| S2 | **Mobil alt-metin kısaltma + hafif sıkıştırma**: 156px'lik 6 satırlık paragrafa mobil-özel kısa varyant (MEVCUT cümlelerden kırpma — yeni metin yok; emsal: FAZ 3 a45e786 mobil etiket kısaltması) + 562–734 bandından ~60px | Mobil metin varyantı + spacing | alt metin ~156→~80: CTA ~486'ya, soru bölümü ~736'ya — ilk 2 soru kadraj içinde | **Orta** — hero metin uzunluğu v0 spesifikasyonunun parçası | Alt metin ZATEN gözden-geçirme kuyruğunda (SIRADAKILER "Hero alt metni... pazarlama metni olarak gözden geçirilmeli") — fırsat birleşimi; ama metin kırpma kullanıcı onayı ister (içerik kararı) |
| S3 | **Hero'ya tek soru kancası**: 562–734 boşluğuna, CTA'ların altına TEK dert-adlandıran soru linki (SORULAR_V2[2] metniyle, yeni metin yok) | Hero kompozisyonuna yeni öğe (yalnız mobil) | Kanca kadraj içinde ~590px'te; soru bölümü yerinde kalır | **En yüksek** — v0/emil onaylı hero düzenine ekleme | Onaylı tasarıma müdahale = mock + kullanıcı canlı onayı şart (İş kapanış kuralı); sahne noktaları/aşağı oku ile görsel yarış [VARSAYIM]; soru iki kez görünür (kanca + liste) — tekrar hissi |

**Sıralama önerisi [VARSAYIM]:** S1 + sıra değişikliği (sıfır metin kararı,
en az dokunuş) önce; S2 alt-metin gözden geçirmesiyle birleşik ikinci aday;
S3 yalnız ilk ikisi yetmezse. Hepsi görsel iş → mock → onay → uygulama sırası
(taslak-7 çerçevesi geçerli; bu tablo taslak-7'nin seçenek ekidir).

---

## 2. /arac/il-rejimi/ taşıma briefi — ölçümler + basıma hazır hal

### Ölçülen iç link envanteri [VERİ] (dist @ 9b826ad, script/style hariç)

- Linki içeren sayfa: **174/175** · toplam geçiş: **522**
- Kaynak konumları (değiştirilecek yerlerin TAMAMI):

| # | Dosya | Rol | Sayfa başına geçiş |
|---|---|---|---|
| 1 | `src/data/anasayfa-v2.js:122` (`VERI_ROTALARI`) | menü — masaüstü panel + mobil liste | 2 × 174 sayfa |
| 2 | `src/components/AltBilgi.astro:25` | footer "Ne yapmam gerekiyor" listesi | 1 × 174 sayfa |
| 3 | `src/pages/kuyu-ruhsati/index.astro:23` | il indeksi tanıtım paragrafı | +1 (o sayfada 4.) |
| 4 | `src/components/IlKurumTablosu.astro:48` | rehber içi il tablosu notu | +1 (kuyu-ruhsati rehberinde 4.) |
| 5 | `src/pages/arac/il-rejimi.astro` | rota dosyasının kendisi — taşınacak | — |
| 6-7 | `src/layouts/Sayfa.astro:45` · `src/data/il-profil.js:2` | YORUM satırları (link değil) — taşımada güncellenir | — |

Sağlık yapılandırması etkisi [VERİ]: `izleme/cekirdek-sayfalar.json` çekirdek
setinde /arac/il-rejimi/ YOK → md2/md5 yapılandırma değişikliği gerekmez;
sitemap/llms otomatik (dist taraması).

### 301 kuralının yeri [VERİ]

`public/_redirects` (Cloudflare Pages). Mevcut desen tam-yol eşleşmesidir ve
eğik-çizgisiz varyant AYRI satır ister (/deneyim emsali):

```
/arac/il-rejimi   /ilimde-kim-yetkili/   301
/arac/il-rejimi/  /ilimde-kim-yetkili/   301
```

Ek olarak `izleme/beklenen-301.json`'a bu çift eklenir (md3 yönlendirme
kontrolü kuralı sürekli doğrulasın — SÜREKLİLİK İLKESİ).

### Search Console etkisi [YÖNTEM — GSC belgelenmiş davranışı]

- 301 sinyal aktarımı: eski URL'nin birikimi yeni URL'de birleşir; geçiş
  döneminde (tipik 2-6 hafta) eski URL "Sayfa yönlendirme içeriyor" durumuna
  düşer — bu HATA DEĞİL, beklenen durum.
- Sitemap yeni URL'yi otomatik içerir, eski otomatik düşer (dist taraması) —
  GSC'ye ayrıca bildirim gerekmez; istenirse URL Denetimi'nden yeni URL için
  "indeksleme iste" hızlandırır [kullanıcı paneli, tek tık].
- İzleme notu: 4-6 hafta sonra Performans raporunda eski/yeni URL tıklama
  devri kontrol edilir; eski URL'ye tıklama sıfırlanmadan kural kaldırılmaz
  (kural zaten kalıcı durur).
- Risk düşüğü: sayfa iç-site aracıdır, dış backlink profili zayıftır
  [VARSAYIM — backlink verisi ölçülmedi; GSC Bağlantılar raporundan kullanıcı
  teyit edebilir]. Kayıp riski düşük.

### Basıma hazır brief (taslak-6 v2 — rapor/pazarlama-brief-taslaklari.md'de güncellendi)

Taslağın v2'si aşağıdaki değişikliklerle basıma hazırdır:
- "iç link envanteri ölçülür" şartı KAPANDI — envanter yukarıda, brief artık
  somut 4 dosya + 2 yorum + 1 rota dosyasını sayıyor (bulunur-varsayımı yok).
- 301 satırları ve `beklenen-301.json` kalemi eklendi.
- Breadcrumb şartı netleşti: yeni slug KÖKTE (`/ilimde-kim-yetkili/`) —
  /arac/ bölümü tek üyeliydi, tümden boşalır; `Sayfa.astro` kırıntı zinciri
  dosya-türetimli olduğundan kırılmaz, build sonrası kırık link 0 ölçülür;
  `bolumAdlari`daki ölü `arac` girişi temizlik notu olarak briefe girdi.
- GSC bölümü ölçülebilir bitti-tanımına bağlandı (canlıda 301→200 zinciri +
  4-6 hafta izleme notu).

**DUR — iki hazırlık da rapor halinde; uygulama kullanıcı onayı bekliyor.**
