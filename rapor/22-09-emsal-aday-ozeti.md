# Emsal Aday Havuzu — İnceleme Kuyruğu Özeti

*22.09.2026 · Kaynak: `data/emsal-adaylari.json` (120 aday, `dogrulama:"bekliyor"`)*

## Ne var?
Resmî **Adalet Bakanlığı karar-arama** uçlarından çekilen künyeler, yayımlanmış
15 künye ve kendi içinde mükerrer elenerek aday havuzuna aktarıldı. **Hiçbiri
yayına girmedi** — hepsi `bekliyor`.

Daire dağılımı (idari önceliği):
**8. Daire 20 · 6. Daire 20 · İdare Dava Daireleri Kurulu 20 · 10. Daire 20 ·
13. Daire 20 · 4. Daire 19** (+ 1 yazım farklı 10. Daire).
Örnek 8. Daire künyeleri: `2025/5198-2025/10204`, `2022/3548-2025/9043`,
`2023/4737-2025/8512`.

## Aday nasıl doldurulur (K7)
`data/emsal-adaylari.json` alanları:
- Dolu gelen (resmî kaynaktan): `merci, esas, karar, yil, konu(=arama kelimesi), kaynak_url, kaynak_turu, dogrulama`.
- **Boş bırakılan (bilinçli):** `ozet` — karar metni incelenmeden özet ÜRETİLMEZ.
- İnceleme sırasında doldurulacak: `ozet` (kaynak metinden, yorum katmadan),
  `konu` (kısa etiket), `rehberler[]`, `maddeler[]` (ör. `167-m18`).

## İnceleme akışı
1. `adaylar[i].kaynak_url` → resmî karar metni açılır (Danıştay/UYAP).
2. İlgili görülürse `ozet` + `konu` + `rehberler` + `maddeler` doldurulur,
   `dogrulama:"dogrulandi"` yapılır. İlgisizse `dogrulama:"reddedildi"`.
3. Onaylanan künye **elle** `data/kamu/emsal-kararlar.json`'a taşınır (yayın);
   site `/emsal-kararlar/` bu dosyadan beslenir.

`arac/emsal-aday-uret.mjs` yeniden koşulduğunda **`bekliyor` havuzu tazelenir,
incelenmiş adaylar (`dogrulandi`/`reddedildi`) KORUNUR**.

## Kapsam / nasıl çoğaltılır
- Ham künye kaynağı: `veri/ham/yargi/{danistay,uyap}/kunye.json` (yerel; 793 + 1842).
- Daha fazla/başka daire: `node arac/yargi-cek.mjs --kaynak danistay --sayfa 40`
  ile ham havuz büyütülür, `node arac/emsal-aday-uret.mjs --limit 300 --merci-tavan 30`
  ile aday havuzu genişletilir.
- Aylık otomatik tazeleme: cron (03. gün 01:30) → `log/yargi-cek-cron.log`.

## Sınırlar (dürüst)
- UYAP Emsal **idari yargıyı içermez**; BİM/BAM ayrımı için ayrı kaynak gerekir.
- Yargıtay hostu bu sunucuya kapalı (ağ engeli); izinli ağdan koşulmalı.
- Anahtar kelime eşleşmesi yanlış-pozitif içerir → insan süzgeci zorunlu (bu kuyruk tam da o adım).
