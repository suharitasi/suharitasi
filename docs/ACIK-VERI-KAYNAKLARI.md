# Açık Veri Kaynakları — Doğrulanmış Envanter

*Son güncelleme: 22.09.2026 · Kapsam: v6.0 emsal matrisi + akifer göstergesi veri boşlukları.*
*Yöntem: her satır CANLI çağrıyla doğrulandı; doğrulanmayan satır "doğrulanacak" diye işaretlidir (K7).*

## 1. Danıştay Karar Arama — DOĞRULANDI (programatik, captcha'sız)
`https://karararama.danistay.gov.tr` · resmî, ücretsiz · **416.546 karar** (22.09.2026).

Sözleşme (canlı ölçüldü):

| İşlem | Uç | Gövde / Parametre | Yanıt |
|---|---|---|---|
| Kelime araması (şablon) | `POST /arama` | `{"data":{"andKelimeler":["\"yeraltı suyu\""],"orKelimeler":[],"notAndKelimeler":[],"notOrKelimeler":[]}}` | HTML kabuk |
| Kelime araması (veri) | `POST /aramalist` | aynı + `"pageSize":50,"pageNumber":1` | JSON `data.data[]` |
| Detaylı arama | `POST /detayliArama` · `POST /aramadetaylist` | `andKelime`(metin), `daire`, esas/karar yılı-sırası, tarih, mevzuat no | JSON |
| **Karar tam metni** | `GET /getDokuman?id=<id>&arananKelime=<kelime>` | — | HTML (karar metni) |

Satır alanları: `id, daireKurul, esasNo, kararNo, kararTarihi, arananKelime, index`; zarf: `recordsTotal, recordsFiltered`.

Ölçülen hacimler (ifade araması, tırnaklı):
`"yeraltı suyu"` → **756** · `"yeraltı suyu"+"167"` → **82** · `"su tahsisi"` → **47** · `"kuyu ruhsatı"` → **3**.

**Nezaket/limit (ölçüldü):** hızlı ardışık isteklerde sunucu bazen HTML hata sayfası veya **HTTP 429** döndürüyor; çok istek sonrası **reCAPTCHA** devreye girebiliyor. Bu yüzden:
- istekler arası ≥2,5 sn, artan beklemeli 3 deneme,
- reCAPTCHA algılanınca o sorgu DURDURULUR (zorlanmaz).

**Toplayıcı:** `arac/danistay-cek.mjs`
```
node arac/danistay-cek.mjs [--sayfa 20] [--boyut 50] [--gecikme 2500] [--metin N]
node arac/danistay-cek.mjs --sadece-metin --metin 50   # künyeyi yeniden çekmeden metin
```
Çıktı (YEREL; `.gitignore` gereği `veri/ham/` depoya girmez):
`veri/ham/danistay/kunye.json`, `metin/<id>.txt`, `metin-indeks.json`.

İlk koşum (22.09.2026): **795 benzersiz künye** (4. Daire 267 · 6. Daire 211 · **8. Daire 120** · İDDK 86 · 10. Daire 55 · 13. Daire 42 …; yıllar 1986–2026) + 12 tam metin.

**K7:** toplanan veri YAYINA GİRMEZ; emsal matrisine ancak **[SERDAR-HUKUK] teyidinden** sonra alınır. Anahtar kelime eşleşmesi yanlış-pozitif içerir (ör. "yeraltı suyu" bir mermer ocağı ÇED dosyasında geçebiliyor) → hukuki süzgeç şart.

## 2. Yargıtay Karar Arama — resmî, erişim doğrulanacak
`https://karararama.yargitay.gov.tr` · resmî, ücretsiz · **9.989.207 karar** (arama sonucu).
Bu sunucudan yapılan iki deneme **zaman aşımına** düştü; uç sözleşmesi HENÜZ çıkarılmadı. Danıştay ile aynı "Adalet" altyapısı ailesinden olma ihtimali yüksek → öncelikli hedef.

## 3. UYAP Emsal Karar Arama (Adalet Bakanlığı) — erişilebilir, uç doğrulanacak
`https://emsal.uyap.gov.tr` · resmî · **853.687 karar** · birim listesinde **Bölge Adliye (BAM) + hukuk mahkemeleri** seçilebiliyor.
`https://kyb.uyap.gov.tr` · resmî · 1.341 karar.
**BİM (Bölge İdare) kapsamı ve arama ucu henüz doğrulanmadı** — bir sonraki tur.

## 4. DSİ — yeraltı suyu RASAT açık veri DEĞİL
- Kuyu bazlı seviye (rasat) serisi yayımlanmıyor. **Yeraltısuları Dairesi Başkanlığı** bünyesindeki **"İzleme ve Değerlendirme Şube Müdürlüğü"** ve 167 kapsamındaki *"yeraltısuyu kaynakları envanterini tutmak"* görevi veriyi kurumda tutuyor.
- Yasal erişim yolu: **4982 s. Bilgi Edinme → CİMER** (`cimer.gov.tr`). İletişim: `yeraltısulari@dsi.gov.tr` / 0312 454 44 00.
- Açık olan: **Resmî İstatistikler** (yıllık Excel, Tablo 1.x — kullandığımız `dsi.gov.tr/Sayfa/Detay/2186`), **Akım Gözlem Yıllıkları** (yüzey suyu), **Baraj Doluluk** (`yagisbarajdoluluk.dsi.gov.tr`).
- Elimizdeki açık proxy: **NASA/DLR GRACE-FO** mascon TWS anomalisi (`data/canli/grace-havza.json`) + DSİ yıllık YAS potansiyeli.

## 5. SYGM — havza / YAS kütle durumu
`tarimorman.gov.tr/SYGM` · **Ulusal Su Bilgi Sistemi (USBS)**, **Türkiye Su Atlası**, **Nehir Havza Yönetim Planları (NHYP)** (bir kısmı `veri/ham/nhyp`'de). Havza "kısıtlı işletme" için tek dürüst kaynak NHYP YAS kütle durumlarıdır; konsolide resmî sınıflama yoktur.

## 6. Ticari / alternatif (lisans + teyit gerekir)
`app.apilex.ai` (halihazırda kullanılıyor) · `emsal.ai` · `fullegal.com` (BAM/BİM) · `yargisalzeka.com` · `karargah.pro`. Ticari lisansları bize ait değil; künye kaynağı olarak alıntılanabilir, veri tabanı olarak çoğaltılamaz.

## 7. Doğrulanamayanlar (bu ortamdan)
`data.gov.tr` (Kamu Açık Veri Portalı) — iki deneme zaman aşımı; ayrıca teyit edilecek. Yargıtay (bkz. §2). BİM merkezî ücretsiz indeks: belirsiz.

---
### Öncelik sırası (öneri)
1. **Danıştay** → hukuki süzgeç + [SERDAR-HUKUK] teyidi ile emsal matrisi adayları (toplayıcı hazır).
2. **Yargıtay** uç sözleşmesini çıkar (aynı Adalet altyapısı).
3. **emsal.uyap.gov.tr** → BİM/BAM kapsamı + uç.
4. **DSİ rasat** → CİMER başvurusu (yasal, tek yol).
