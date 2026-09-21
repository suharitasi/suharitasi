# Açık Veri Kaynakları — Doğrulanmış Envanter

*Son güncelleme: 22.09.2026 · Kapsam: v6.0 emsal matrisi + akifer göstergesi veri boşlukları.*
*Yöntem: her satır CANLI çağrıyla doğrulandı; doğrulanmayan satır "ağ engeli/teyit bekliyor" diye işaretlidir (K7).*

## Toplayıcı — `arac/yargi-cek.mjs`
Adalet Bakanlığı "Karar Arama" ailesini **tek araçla** çeker (kaynak-farkında):
```
node arac/yargi-cek.mjs --kaynak hepsi|danistay|uyap|yargitay \
                        --sayfa 16 --boyut 50 --gecikme 2500 --metin 4
node arac/yargi-cek.mjs --kaynak uyap --sadece-metin --metin 50   # künye yeniden çekilmez
```
Çıktı (YEREL; `veri/ham/` `.gitignore`'da → depoya girmez): `veri/ham/yargi/<kaynak>/kunye.json`, `metin/<id>.txt`.
Nezaket: istekler arası ≥2,5 sn; artan beklemeli 3 deneme (429 + HTML hata sayfasını aşar); reCAPTCHA'da DUR; **ağ engelinde yeniden denemeden atlar**.

**22.09.2026 koşumu:** toplam **2635 benzersiz** karar → Danıştay **793** + UYAP Emsal **1842** + Yargıtay **0 (ağ engeli)**.

## 1. Danıştay Karar Arama — DOĞRULANDI (idari)
`https://karararama.danistay.gov.tr` · resmî, ücretsiz · **416.546 karar**.
- Künye: `POST /aramalist` → `{"data":{"andKelimeler":["\"yeraltı suyu\""],"orKelimeler":[],"notAndKelimeler":[],"notOrKelimeler":[],"pageSize":50,"pageNumber":1}}`
- Alanlar: `id, daireKurul, esasNo, kararNo, kararTarihi` + zarf `recordsTotal/recordsFiltered`.
- Tam metin: `GET /getDokuman?id=&arananKelime=` → HTML.
- Hacim: `"yeraltı suyu"` **756** · `+"167"` **82** · `"su tahsisi"` **47** · `"kuyu ruhsatı"` **3**.
- Künye dağılımı: 4. Daire 265 · 6. Daire 211 · **8. Daire 120** · İDDK 86 · 10. Daire 55 · 13. Daire 42 (yıllar 1986–2026).

## 2. UYAP Emsal Karar Arama — DOĞRULANDI (BAM + mahkemeler)
`https://emsal.uyap.gov.tr` · Adalet Bakanlığı, resmî · **853.687 karar**.
- Künye: `POST /aramalist` → `{"data":{"aranan":"yeraltı suyu","arananKelime":"yeraltı suyu","pageSize":50,"pageNumber":1}}` (+ istenirse `hukuk:"<birim>"`, 198 birim: BAM hukuk daireleri + asliye/ticaret/fikrî mahkemeleri).
- Alanlar: `id, daire, esasNo, kararNo, kararTarihi, durum (KESİNLEŞTİ/KESİNLEŞMEDİ)`.
- Tam metin: `GET /getDokuman?id=&arananKelime=` → JSON `{"data":"<html>…"}` (JSON çözülür, HTML sökülür).
- Ölçüm: `"yeraltı suyu"` → **43.128**; koşumda 3 tohumla **1842 benzersiz** künye (İstanbul ağırlıklı; KESİNLEŞME durumu dâhil).
- **Not:** UYAP Emsal **idari yargıyı (Danıştay/BİM) içermez**; kapsamı BAM + ilk derece hukuk/ticaret mahkemeleridir.

## 3. Yargıtay Karar Arama — AĞ ENGELİ (bu sunucudan)
`https://karararama.yargitay.gov.tr` · resmî · **9.989.207 karar**.
- Teşhis (22.09.2026): host `212.175.130.144`, **port 80 ve 443 TCP bağlantısı zaman aşımı**; AAAA kaydı yok. Aynı kurum ağındaki `www.yargitay.gov.tr` (95.0.202.168) ve `vatandasilam.yargitay.gov.tr` (212.175.130.131) erişilebilir → engel bu host'a özgü (muhtemelen veri merkezi IP'sine karşı sunucu tarafı filtre).
- **Çözüm:** toplayıcı `--kaynak yargitay` ile hazırdır; **izinli bir ağdan** çalıştırıldığında aynı sözleşmeyle künye çeker. Bu sunucudan engel aşılamaz (uzak firewall); iki yol: (a) yerel makineden koşum, (b) DSİ benzeri resmî yolla değil, doğrudan Yargıtay host'una erişim.

## 4. DSİ — yeraltı suyu RASAT açık veri DEĞİL
- Kuyu bazlı seviye serisi yayımlanmıyor; **Yeraltısuları Dairesi**'nin 167 kapsamındaki "envanter" görevi veriyi kurumda tutuyor.
- Kök çözüm: **4982 s. Bilgi Edinme / CİMER** başvurusu → hazır taslak: [`rapor/22-09-dsi-rasat-bilgi-edinme-basvurusu.md`](../rapor/22-09-dsi-rasat-bilgi-edinme-basvurusu.md) (`yeraltisulari@dsi.gov.tr` · 0312 454 44 00).
- Açık olan: yıllık Resmî İstatistikler (Tablo 1.x), Akım Gözlem Yıllıkları (yüzey), Baraj Doluluk. Proxy: GRACE-FO (bizde).

## 5. SYGM — havza / YAS kütle durumu
`tarimorman.gov.tr/SYGM` · USBS, Türkiye Su Atlası, **NHYP** (bir kısmı `veri/ham/nhyp`'de). Havza "kısıtlı işletme" için tek dürüst kaynak NHYP YAS kütle durumları; konsolide resmî sınıflama yok.

## 6. Ticari / alternatif (lisans + teyit gerekir)
`app.apilex.ai` (kullanılıyor) · `emsal.ai` · `fullegal.com` (BAM/BİM) · `yargisalzeka.com` · `karargah.pro`.

## 7. Doğrulanamayanlar
`data.gov.tr` (Kamu Açık Veri Portalı) — iki deneme zaman aşımı. BİM (Bölge İdare) merkezî ücretsiz indeks: belirsiz (Danıştay + UYAP Emsal kapsamı dışı).

## K7 — değişmedi
Toplanan veri **YAYINA GİRMEZ**; anahtar kelime eşleşmesi yanlış-pozitif içerir (ör. "yeraltı suyu" bir mermer ocağı ÇED dosyasında geçebiliyor). Emsal matrisine/şemalarına ancak **[SERDAR-HUKUK] teyidinden** sonra alınır.
