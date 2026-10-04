# 04.10.2026 — TAM KAPSAMLI DENETİM VE ONARIM RAPORU

**Sınıf:** BÜYÜK İŞ · **Brief:** `cikti/brief/2026-10-04T1630-tam-denetim.md`
(brief-denetci: TEMİZ) · **Kaynak:** sahip talimatı (sıfır toleranslı denetim).
**Yöntem:** üç bağımsız salt-okunur denetim (Python motorları · ön yüz/Astro ·
shell/cron/altyapı) + `functions/` elle güvenlik denetimi + canlı/yerel ölçüm.
Her bulgu önce doğrulandı; doğrulanamayanlar "doğrulanmadı" olarak ayrıldı.

---

## 1. KRİTİK / ACİL ONARIMLAR

### 1.1 Cron betikleri çalıştırılamıyordu (CANLI ARIZA, 24 dk kala kesildi)
`arac/ekosistem-gunluk.sh`, `arac/kesif/kesif-gunluk.sh`,
`arac/mevzuat-radar.sh` modu `100644` idi; cron 16:45/21:00 UTC'de `nice` ile
exec edecek, "Permission denied" ile ilk koşum düşecekti. Ölçüm:
`ls -l` çıktısı + crontab satırları. Düzeltme: `chmod +x` (+ git mode commit
`78df474`). Doğrulama: cron koşumu (bkz. §5).

### 1.2 KV önek çakışması — WhatsApp sayacı form gönderimleriyle şişiyordu
`functions/whatsapp.js:96` ve `functions/api/talep.js:85` ikisi de
`t:<gün>:<zaman>-<rastgele>` anahtarı yazıyordu; `whatsapp sayacOku` (satır
49-62) `t:` önekini topluca saydığından parsel talepleri tıklama sayısına
karışıyordu. Ayrıca talep için **okuma yolu yoktu** (talep.js yorumu var
olmayan `arac/danisma-oku.sh`'a atıf yapıyordu). Düzeltme:
- `api/talep.js` → `p:` öneki.
- `whatsapp.js` → boş değerli `t:` kayıtlarını sayar; JSON değerli eski
  parsel kaydını atlar (yeni falsifikasyon testi 7b).
- `functions/olay.js` → `parselleriOku()` (yeni `p:` + geriye dönük 200
  anahtarlık `t:` taraması, `parselKesildi` açık bildirimi).
- `arac/temas-sayac.sh --parsel` okuma modu.
Kanıt: `arac/test/whatsapp-fn.test.mjs` 15/15.

### 1.3 Sorgu dizesinden okuma anahtarı sızıntısı
`functions/_auth.js` `?sayac=` taşımasını kabul ediyordu; sorgu dizesi
Cloudflare günlüklerine düz metin düşer ve üç uçtaki tüm lead/PII + abone
listesini açar. Taşıma kaldırıldı (yalnız `Authorization: Bearer` /
`X-Sayac-Anahtar`). Depodaki tüm çağıranlar zaten başlık kullanıyordu
(`whatsapp-sayac.sh`, `temas-sayac.sh`, `alarm-tetikle.py`); test güncellendi
ve "sorgu dizesi artık çalışmaz" senaryosu eklendi.

### 1.4 E-posta gönderilemese de alarm "gönderildi" sayılıyordu
`arac/alarm-tetikle.py:179` `durum[...] = simdi` satırı `ok` değerinden
bağımsız çalışıyordu; 12 saatlik yorgunluk penceresi başarısız gönderimi
bastırıyor, kullanıcı eşik aşımını hiç öğrenemeyebiliyordu. Düzeltme: durum
yalnız `ok` ise güncellenir; SMTP_PORT parse'ı ValueError'a karşı korundu.

### 1.5 TLS doğrulaması kapalı dış veri çekimi
`arac/mevzuat-cekici.py:56-60` ve `arac/mevzuat-radar.py:47-49`
`check_hostname=False + CERT_NONE` (MITM'e açık; kanun metni bütünlüğü bu
kaynağa dayanıyor). Canlı ölçüm: mevzuat.gov.tr doğrulanmış bağlamla HTTP 200
→ strict bağlam açıldı. `arac/font-indir.py` aynı sınıf, düzeltildi.

---

## 2. VERİ BÜTÜNLÜĞÜ VE SESSİZ HATA ONARIMLARI

### 2.1 Atomik JSON yazımı (ortak tek kaynak)
Yeni `arac/yaz_atomik.py` (tmp + `os.replace` + fsync). Taşınan yazımlar:
`grace-isle.py` (2), `tahmin/tahmin-uret.py`, `rapor/aylik-rapor-uret.py`,
`rg-nobetci.py` (2), `mevzuat-radar.py` (2). Süreç yazım ortasında ölürse
tüketiciler (site build, alarm) yarım JSON okuyamaz. Kanıt: py_compile +
izole birim sınaması (yaz/oku + kalıntı 0) + `tahmin --kuru` ve
`aylik-rapor --kuru` koşumları.

### 2.2 Push/commit teyidi ve git add yutmaları
- `arac/grace-guncelle.sh`: push/pull arızasında `exit 0` dönüyordu
  (CLAUDE.md açık ihlali). `PUSH_HATA` + exit 1 + Telegram; deploy hook
  yalnız push başarılıysa.
- `arac/mevzuat-radar.sh` + `arac/ekosistem-gunluk.sh`: `git rev-parse HEAD`
  önce/sonra commit teyidi eklendi.
- `git add ... || true` yutmaları açık hata yoluna çevrildi; ekosistem'de
  dizin süpürme (`data/tahmin`, `src/content/raporlar`) yalnız ayın 1'inde ve
  kendi ürünüyle sınırlandı (A2 kuralı).

### 2.3 Aylık yargı/emsal hattı (B8)
Cron satırı iki `.mjs`'i `&&` ile zinceliyor, exit kodu yazmıyor, log
tavansız büyüyordu. Yeni `arac/yargi-aylik.sh`: sıralı koşum + çıkış kodu +
512 KB/5 arşiv log sözleşmesi. Crontab tek satıra indirildi (yedek:
`izleme/crontab-onceki-20261004-163655.txt`). **Bilinçli sınır:** aday havuzu
insan onay kapısıdır; hat git commit ATMaz.

### 2.4 Keşif motoru sessiz yutmaları
`arac/kesif/kesif-motoru.py`: (a) bozuk durum dosyası artık sessizce
varsayılana düşmez (stderr uyarısı), (b) Telegram gönderim hatası yutulmaz —
`bildirim()` dönüşü denetlenir, ulaşmayan kritik/aday uyarısı stderr'e düşer.

---

## 3. API / DaaS SERTLEŞTİRME

Yeni `functions/_util.js` (tek kaynak):
- `jsonOku(request, enCokBayt)`: Content-Length + gerçek bayt denetimi;
  talep 10 KB, danışma 12 KB, takip/alarm 2 KB, MCP 50 KB. Aşımda 413.
- `temizKirp(s, n)`: C0/C1 + DEL (ANSI/terminal kaçışları) arındırma; tüm
  lead/talep/abone metinleri buradan geçer (terminal görüntüleyiciye kaçış
  sızamaz).

`functions/_limit.js`: hash üretilemezse ortak `'yok'` kovasına düşüp TÜM
kullanıcıları kilitlemesi yerine fail-open. IP kaynağı cf-connecting-ip
(yedek yalnız x-forwarded-for; üretimde CF başlığı kazanır).

`functions/mcp.js`: toplu istek sınırı 20, gövde 50 KB, ölü `kisalt()`
silindi, `nosniff` eklendi.

**Bilinçli/kabul edilenler:** (1) KV sayaç yarışı — eventually-consistent
tasarım gereği kaba abuse freni; kesin kota değil (koddaki şerh korunur).
(2) DaaS `Access-Control-Allow-Origin: *` — public veri API'si olduğu için
kasıtlı; yazma uçları CORS başlığı taşımaz. (3) Origin başlığı yoksa POST
kabul edilir (botlar için honeypot + rate-limit asıl savunma).

---

## 4. ÖN YÜZ

- **Çift öz-cevap (YÜKSEK):** 31 sayfa `SayfaBasi ozCevap` + ayrı `<OzCevap>`
  bileşenini birlikte basıyordu (iki `role="doc-abstract"`). `ozCevap`
  bayrakları kaldırıldı; build sonrası dist'te çift `doc-abstract` **0**
  (ölçüm: tüm HTML taraması).
- **`/en/` dil hatası:** `<html lang="tr">` ile yayımlanıyordu. `Sayfa.astro`
  `dil` prop'u + `lang={dil}` + `og:locale` eşlemesi; `/en/` artık `lang="en"`,
  `og:locale=en_US`.
- **Mobil taşma:** 4-5 kolonlu markdown ve `/tahmin/` tabloları sarımsızdı;
  yatay kaydırma kabı eklendi. Kanıt: site-saglik `8-mobil` taşma 0.
- **Üretim `console.log` temizliği:** `src/pages/ilce-sorgu.astro` (3 hata
  ayıklama logu). Hata yollarındaki `console.error/warn` bilinçli korundu.
- **Ölü kod (doğrulanmış, 0 atıf ölçümüyle):** `WhatsAppDugme.astro`,
  `scrub-engine.js` (29,7 KB), `menu.ts`, `kurumCoz`/`kurumById`,
  `kisitKayitlari`, kullanılmayan `KararMatrisi` import'u,
  `anasayfa-v2.css`'te 22 doğrulanmış ölü sınıf (~5,4 KB; `v2-su` Hero'da
  KULLANILDIĞI için korundu), `.pm-mobil-*` ve `.vaka-not` blokları.
  Kanıt: yerel `dist-sun` + `site-saglik --hizli` → G1-G6 sapma 0, kırmızı 0.
- `KanitBandi` API bağlantısına `rel="noopener"`.

---

## 5. DOĞRULAMA KANITLARI

| Ölçüm | Sonuç |
|---|---|
| `npm run build` | 1108 sayfa · EXIT 0 (17,7 sn / 20,1 sn iki koşum) |
| `node arac/test/whatsapp-fn.test.mjs` | 15/15 (önek ayrımı falsifikasyonu dahil) |
| `node arac/test/mcp-fn.test.mjs` | 12/12 |
| `site-saglik --hizli` (yerel, dist-sun 5211) | kırmızı 0 · sarı 1 (yerelde Function rotası yok — beklenen) · G1-G6 sapma 0 · 8-mobil 0 px |
| dist çift `doc-abstract` | 0 |
| `dist/en/index.html` | `lang="en"` |
| dist `console.log` | 0 |
| crontab | yargı hattı tek satır + sarmalayıcı; tüm suharitasi satırları exec edilebilir |
| crontab yedekleri | `izleme/crontab-onceki-20261004-163655.txt` |

**Düzeltilen yanlış-pozitifler (denetim disiplini kaydı):** shell denetimi
B2/B3 ("KOD eziliyor") yanlıştı — `cmd || KOD=$?` başarılı komutta sağ tarafı
çalıştırmadığından önceki hata kodu korunur; kaynak okunarak çürütüldü ve
değişiklik yapılmadı.

---

## 6. DUR / OPERATÖR KALEMLERİ (onay gerektirenler)

1. **Palet/kontrast (D2):** risk renkleri 0,62rem metinde `#E65100`/`#DFE9F0`
   ≈3,08:1 (AA altı). Görsel kimlik kararı — DESIGN.md §18.2 hedefi ≥7:1
   kapsamında ayrı iş.
2. **Cloudflare panel:** `SAYAC_ANAHTAR` secret'ı `.env` ile eşleşmiyor →
   KV okuma köprüsü ve sayaçlar canlıda devre dışı (ölçüm: `/whatsapp/`
   okuma 302 döndü). Kod tarafı hazır; panel adımı kullanıcıda.
3. **`/mevzuat/` 649 KB gövde:** `data-madde` ikinci metin kopyası
   kaldırılırsa filtre davranışı değişir; ölçüm sonrası ayrı UX kararı.
4. **Bülten + CSP uykuda çelişkisi:** `Bulten.astro` dış alan adına POST
   ediyor; `form-action 'self'` bu form etkinleştirilirse sessizce engeller
   (`BUTTONDOWN_KULLANICI` boş olduğundan bugün etkisiz). Hesap bağlanırken
   CSP kararı gerekir.
5. **KV eski kayıtları / log arşivleri silme** — geri alınamaz işlem,
   kullanıcı onayı ister.

## 7. KALAN İŞLER (ikinci dalga, öncelik sırasıyla)

- Atomik yazıcının yaygınlaştırılması: `nhyp-cikar.py`, `rg-sayi-cikar.py`,
  `zenginlestirme-birlestir.py`.
- `rg-nobetci.py` giriş JSON okumalarına şema denetimi (bozuk dosya tüm
  haftalık koşuyu düşürüyor); `rg-sayi-cikar.py:163` tarih parse koruması.
- Log tavanı olmayan ortak loglar: `log/pipeline.log`, `log/uyari.log`,
  `izleme/log/hata.log`; `bellek-log.sh` fd bölünmesi.
- Ölü/tek seferlik Python betikleri + `/tmp/claude-*` girdi yolları
  (`morfoloji-hesap.py`, `dsi-bolge-tara.py`, `havza-il-tara.py`) — arşiv
  kararı; `atlas/indir.py` assert'leri `-O` altında kalkıyor.
- `json-api-uret.py` ölü `replace` + slug tutarsızlığı; `ilce-morfoloji-uret.py`
  kullanım durumu doğrulanamadı.
- Tarayıcı: `/_middleware.js` HEAD yanıtı ve yarış koşulları izlemeye değer
  (mevcut fail-open davranışı korundu).

---

*Üreten: 04.10.2026 tam denetim oturumu. Bu rapor karar kaydı §52 ve
SIRADAKILER güncellemesiyle birlikte commit edilmiştir.*
