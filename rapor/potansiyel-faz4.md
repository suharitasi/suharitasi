# FAZ 4 RAPORU — zenginleştirme (dört bağımsız alt iş)

Tarih: 2026-07-27 · Çıktı: `veri/potansiyel/zenginlestirme.json` (+ alt iş
dosyaları: mta-katalog.json, akademik-kunye.json, osm-su-noktalari.json)

## Kayıt sayıları (bitti-tanımı gereği)

| Alt iş | Sonuç | Kapsam |
|---|---|---|
| 4.A MTA katalog | **356 künye** (4 anahtar kelime, sayfalamalı) | 64/81 il; 32 künyeye il atanamadı (ayrı listede) |
| 4.B akademik künye | **1.226 künye** (açık erişim filtresi) | **49/81 il** — kalan 32 il OpenAlex 429 kotası (aşağıda) |
| 4.C TÜİK YAS payı | **veri yok — kalem kapandı** | 0/81 (gerekçe aşağıda) |
| 4.D OSM su noktaları | **1.239 kaynak (spring) + 487 kuyu (water_well)** | 81/81 il satırı (0 değeri dahil) |

"4 kalemi de veri yok olan il": **0** — her il en az OSM sayacı taşıyor.

## Alt iş notları

**4.A MTA** (`arac/mta-katalog.py`): OpenCart araması; hidrojeoloji 339 +
hidrojeolojik 78 + yeraltısuyu 11 + "yeraltı suyu" 28 ürün → 356 tekil.
Yalnız katalog metaverisi (rapor adı + ürün URL); rapor satın alınmadı,
içerik kopyalanmadı. İl ataması rapor ADINDAN tam-kelime (eski il adları
Afyon/İçel/Maraş/Urfa/Antep eşlendi); çok-illi ilçe adları atlanır.

**4.B akademik** (`arac/akademik-kunye.py`) — **İKAME, ONAY BEKLİYOR**:
Brief DergiPark aramasını öngörüyordu; arayüz **Cloudflare Turnstile
korumalı** (ölçüldü — aşılmadı, aşılmamalı). İkame: **OpenAlex API**
(metadata CC0; BRIEF.md Aşama 1'de anılan kaynak). Sorgular brief'teki
gibi il başına iki adet; is_oa:true; künye = başlık/yazarlar/yıl/DOI/dergi
(özet kopyalanmadı). Kısıt: OpenAlex ~100 istek sonrası kalıcı 429'a
geçti; 30/75/150 sn geri çekilme + mailto parametresi de aşamadı → koşu
durduruldu. **Eksik 32 il "veri yok" değil "eksik-429" durumunda** —
tamamlama SIRADAKILER'de (birkaç saat sonra tek koşu yeter; script
artımlı, dolu iller atlanıyor).

**4.C TÜİK** — kalem "veri yok" KAPANDI (brief 4.C kuralı). Kanıt:
(1) veriportali bülten sayfası headless tarayıcıda "Bu haber bülteni şu
anda görüntülenememektedir" veriyor; (2) MEDAS'a headless girildi
(ZK/AU olayları çözülerek), "Belediye Su İstatistikleri" konusunun TÜM
gösterge listesi okundu: **15 göstergenin hiçbirinde kaynak-türü
(kuyu/baraj/kaynak) kırılımı yok** — "belediye suyunda yeraltı suyu payı"
il düzeyinde bu kaynaktan üretilemez. Ulusal kırılım (kuyu %29,8 - 2024)
var ama il kalemi yok.

**4.D OSM** (`arac/osm-su-noktalari.py`): TR-geneli tek sorgu 504/502
yedi → 20 bbox-karosu + node-id tekilleştirme + ayna/geri çekilme.
Noktalar repodaki il poligonlarıyla (tr-iller.json; "Afyon"→
"Afyonkarahisar" düzeltmesi) ışın-testiyle atandı. Karo taşması komşu
ülke noktaları poligon dışı kaldı (spring 2.057, well 526 — sayılmadı).
Zorunlu etiket her il satırında: **"topluluk verisi, resmî doğrulanmadı"**;
ODbL atfı Faz 6.5'te KAYNAKLAR.md'ye.

## Açık kalemler
1. OpenAlex eksik 32 il — SIRADAKILER maddesi (artımlı koşu).
2. 4.B ikamesi (DergiPark→OpenAlex) kullanıcı onayı.
3. TÜİK bülten xls'lerinin TR-IP'den elle kontrolü (opsiyonel —
   il kırılımlı tablo çıkarsa 4.C yeniden açılır).
