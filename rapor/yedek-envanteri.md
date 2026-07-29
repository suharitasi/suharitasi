# YEDEK ENVANTERİ — geri getirilemez varlıklar (B1.1)

Tarih: 2026-07-28 · Ölçüm: `du -sb`, `git ls-files`, `find -printf` ·
Ölçülen ağaç: `/home/suha/projeler/suharitasi` (main = `689a418`)

**Bu rapor SATIN ALMA YAPMAZ.** Ücretli seçenekler yalnız kıyas tablosunda
gösterilir; karar kullanıcınındır (§4).

---

## 1. Ölçümün ilk bulgusu: durum sanıldığından İYİ, ama bir delik gerçek

Sağlık kalemi md20 aylardır şunu diyordu:

> `kaynak/dsi-arsiv` (55 MB) — depo dışı yedek bulunamadı ·
> `data/arsiv` (529 MB) — depo dışı yedek bulunamadı

Bu mesaj **yanıltıcıydı.** Kalem yalnız *yerel diskte ikinci bir kopya* arıyor;
**GitHub'ı hesaba katmıyor.** Ölçüldü:

| Varlık | Dosya | Boyut | Git'te izleniyor mu? |
|---|---|---|---|
| `kaynak/dsi-arsiv` | 230 | 54,6 MB | **EVET — 230/230** |
| `data/arsiv/mevzuat` | 5 | 22,1 MB | **EVET** |
| `data/arsiv/baraj` | — | 0,46 MB | **EVET** |
| `data/arsiv/dsi-yas` | — | 0,41 MB | **EVET** |
| `veri/potansiyel` | 11 | 3,0 MB | **EVET — 11/11** |
| `data/canli` | 4 | 0,27 MB | **EVET** |
| `data/havzalar` | — | 2,6 MB | EVET |

`git rev-list --count origin/main..main` = **0** → yerelde bekleyen commit
yok, hepsi GitHub'da. Yani **DSİ 230 belgesi ve mevzuat arşivi zaten makine
dışında bir kopyaya sahiptir.** md20'nin mesajı bu revizyonda düzeltilmiyor
(kalem kendi tanımına göre doğru çalışıyor: *yerel* ikinci kopya arıyor),
ama yorumu bu rapora bağlanıyor.

---

## 2. GERÇEK DELİK — GitHub'a gitmeyenler

| # | Varlık | Boyut | Neden git'te değil | Yeniden üretilebilir mi? |
|---|---|---|---|---|
| A | `data/arsiv/grace/ham/…rl06v2.0…halfdegree.nc` | **506,3 MB** (1 dosya) | GitHub 100 MB dosya limiti (gitignore'da; sha256 kaydı git'te) | **Evet** — NASA GSFC açık dağıtım. Maliyet: indirme süresi. |
| B | `kaynak/tr-atlas-master.png` | **23,8 MB** | `kaynak/` gitignore'da (yalnız `dsi-arsiv` istisna) | **Belirsiz** — üretim kaydı bulunamadı, **doğrulanmadı** |
| C | `kaynak-video/` (6 dosya) | **21,8 MB** | Ham Midjourney videoları, gitignore'da | **HAYIR** — ücretli üretim, aynı çıktı tekrar üretilemez. Encode edilmiş sürümler `public/deneyim/video/` altında ve git'tedir. |
| D | `.env` | 173 B | Kasten (sır) | Kısmen — EPİAŞ hesabı yeniden alınır, Cloudflare deploy hook yeniden üretilir. Gecikme doğurur. |
| E | `log/` | ~MB | Kasten (2026-07-25 kararı) | Hayır, ama değeri düşük |

### 2.1 KAYIP TESPİTİ — NHYP ham PDF'leri (892 MB) **DİSKTE YOK**

`rapor/potansiyel-faz1.md` şunu kaydediyor:

> 38/38 başarılı, 0 hata · Boyut: **892 MB (PDF)** + metinlerle 970 MB ·
> `veri/ham/` `.gitignore`'a eklendi (G6) — yalnız türetilmiş JSON + rapor
> commit.

Bugün ölçüldü: **`veri/ham/` dizini diskte YOKTUR** (`ls veri/` → yalnız
`potansiyel`). 38 NHYP PDF'i kaybolmuş.

**Neden:** iş `suharitasi-potansiyel` worktree'sinde yapıldı; `veri/ham/`
gitignore'lu olduğu için main'e hiç girmedi ve **worktree silinince onunla
birlikte gitti.** Bu, GUNLUK.md:75-80'de zaten bir kez kaydedilmiş hatanın
ikizi ("worktree silinmeden önce kanıt arşivlenir").

**Etkisi ölçülü:** türetilmiş çıktı (`veri/potansiyel/yas-kutleleri.json`,
12/12 kalite kapısı yeşil) git'tedir ve site onu kullanır — **site
etkilenmemiştir.** Kaybolan, kaynağa geri dönme imkânıdır: bir kütle
sayısı sorgulanırsa PDF sayfa numarası JSON'da var ama PDF elde yok.

**[KAPANDI 29.07.2026 — GERİ GETİRİLDİ]** Kullanıcı kararı (KARARLAR.md
§20) üzerine yeniden indirildi: **41/41 dosya, 1,1 GB, 0 hata**. Manifest
depo-içi kayıtlardan yeniden türetildi ve artık **git'te**
(`arac/test/nhyp-manifest.json` + üreteci `arac/nhyp-manifest-uret.py`);
kayıp PDF→metin adımı da scriptleşti (`arac/nhyp-metne-cevir.sh`).
**Uçtan uca tekrar koşuldu: 12/12 YEŞİL, 472 kütle, çıktı depodakiyle
BİT-EŞİT.** Ayrıntı: `rapor/nhyp-geri-getirme.md`.
Süreklilik: altın örnek artık kaynak varlığını da ölçüyor — kısmen
silinirse sonraki sağlık koşusunda kırmızı verir (falsifikasyon ölçüldü).

**Kural sonucu:** `arac/yedek-al.sh` artık envanterdeki bir varlık diskte
yoksa log'a **UYARI** yazıyor — aynı kayıp sessizce tekrarlanamaz.

---

## 3. NE YAPILDI (ücretsiz kısım — B1.2, uygulandı)

`arac/yedek-al.sh` — gecelik, ikinci konum `/home/suha/yedek/suharitasi`.

| Ne | Nasıl | Ölçüldü |
|---|---|---|
| A + B + C varlıkları | `tar -czf`, **içerik imzası değişmezse yeniden paketlenmez** | 293,9 MB (sıkıştırılmış; kaynak 552 MB → %53) |
| Tüm depo geçmişi | `git bundle create --all` + `git bundle verify` | 174,6 MB · 341 commit |
| `.env` | ayrı dosya, `chmod 600`, tarball'a girmez | 173 B |
| Bütünlük | `sha256sum` manifest + `sha256sum -c` doğrulaması | ✓ |
| Kuşak | `guncel/` + `onceki/` (yalnız gerçek değişimde döner) | ✓ |
| Kilit | `flock /tmp/suharitasi-git.lock` (bundle adımı) | ✓ |

**Ölçülen koşum:** ilk koşu **27 sn / 446 MB**; ikinci koşu **11 sn**
("varlık paketi: degismedi" — imza aynı, yalnız bundle yenilendi).

**Geri alma KANITLANDI (sanılmadı, ölçüldü):**
```
git clone /home/suha/yedek/suharitasi/guncel/depo.bundle geri-test
→ 341 commit · HEAD 689a418 · kaynak/dsi-arsiv geri geldi
```

**Sağlık kalemi:** md20 içinde **M11 "son yedek yaşı"**. Eşikler gerçek cron
takviminden türetildi (yedek 02:10 UTC, sağlık koşuları 06:40 + 19:30 →
en kötü taze yaş 17,3 saat): **SARI 30 saat · KIRMIZI 54 saat.**
Falsifikasyon 6/6 ölçüldü: taze→yeşil · 31h→sarı · 60h→kırmızı ·
`sonuc!=basarili`→kırmızı · dosya yok→sarı · bozuk JSON→kırmızı.

### 3.1 SINIR — açıkça

> **İkinci konum AYNI MAKİNEDEDİR.** Bu yedek şunlara karşı korur:
> yanlışlıkla silme · worktree silinirken gitignore'lu veriyi kaybetme
> (§2.1'deki kaybın tekrarı) · dosya bozulması · GitHub erişiminin kaybı.
> **ŞUNA KARŞI KORUMAZ:** diskin/makinenin ölümü, sağlayıcının hesabı
> kapatması, fidye yazılımı.

Bu cümle `son-yedek.json` içinde `"sinir"` alanı olarak da duruyor; sağlık
raporunu okuyan kişi sınırı yedeğin kendi çıktısında görür.

---

## 4. MAKİNE DIŞI SEÇENEKLER — kıyas (KARAR KULLANICININ)

Yedeklenecek hacim: **446 MB** (bugün ölçülen; GRACE yeni sürümüyle yılda
birkaç yüz MB büyüyebilir). Bu rakam kritik: **1 GB'ın altında olduğu için
birçok ÜCRETSİZ katman yeterlidir.**

| # | Seçenek | Aylık maliyet | Kapasite | Kurulum | Not |
|---|---|---|---|---|---|
| **S1** | **Cloudflare R2** | **0 ₺** (10 GB ücretsiz katman, egress $0) | 10 GB ücretsiz | Panel: R2 bucket + API token → `rclone`/`aws s3 cp` | **Site zaten Cloudflare'de** — yeni sağlayıcı yok, yeni fatura ilişkisi yok. 446 MB, 10 GB'ın %4,5'i. |
| S2 | GitHub — ikinci özel depo (Git LFS'siz, ayrık dosyalar) | 0 ₺ | dosya başı 100 MB sınırı | Mevcut hesap | GRACE `.nc` (506 MB) **sığmaz**; parçalama gerekir. Zarif değil. |
| S3 | Google Drive / OneDrive ücretsiz | 0 ₺ | 15 GB / 5 GB | `rclone` yapılandırması | Çalışır ama kişisel hesap; kurumsal süreklilik zayıf. |
| S4 | **Hetzner Storage Box BX11** | **≈ 3,20-3,92 €/ay** (kaynağa göre değişiyor — **fiyat doğrulanmadı**, panelden teyit gerekir) | 1 TB, sınırsız trafik | Aynı sağlayıcı, SSH/rsync/BorgBackup | Aynı sağlayıcı = sağlayıcı riski ORTAK; ama farklı makine/veri merkezi. Büyümeye en rahat cevap. |
| S5 | Backblaze B2 | ≈ **$6,95/TB/ay** → 446 MB için **< $0,01/ay** (asgari fatura tutarı **doğrulanmadı**) | sınırsız | `rclone` | Egress ücretsiz (depolananın 3 katına kadar). Fiyat/GB en düşüklerden. |
| S6 | Fiziksel — harici disk / ikinci ev makinesi | tek seferlik donanım | — | elle veya `rsync` | Otomatikleşmezse insana bağlı; kaydedilen desen (§2.1) bunun neden riskli olduğunu gösteriyor. |

**Tavsiye (uygulanmadı, karar sizin): S1 — Cloudflare R2.** Gerekçe: ücretsiz
katman hacmi 22 kat aşıyor, egress ücretsiz, site zaten aynı hesapta, yeni
sağlayıcı ilişkisi doğmuyor. Zayıf yanı: sağlayıcı yoğunlaşması — Cloudflare
hesabı kapanırsa hem site hem yedek gider. Bunu istemiyorsanız **S5
(Backblaze B2)** sağlayıcı çeşitliliği sağlar ve aylık maliyeti ihmal
edilebilir.

### 4.1 S1 için panel adımları (AÇILMADI — sizin yapmanız gereken sıra)
1. Cloudflare panel → **R2** → *Create bucket* → ad: `suharitasi-yedek`,
   konum: otomatik (veya EU).
2. **R2 → Manage API Tokens → Create API Token** → izin: *Object Read &
   Write*, kapsam: yalnız bu bucket.
3. Üretilen `Access Key ID`, `Secret Access Key` ve `Account ID`'yi sunucuda
   `.env` içine ekleyin (adlar önerisi: `R2_ACCESS_KEY`, `R2_SECRET_KEY`,
   `R2_ACCOUNT_ID`, `R2_BUCKET`).
4. Bana "R2 hazır" deyin — `arac/yedek-al.sh`'ye tek bir yükleme adımı
   eklenir (`rclone` ya da `aws s3 cp --endpoint-url`), sağlık kalemine
   "uzak yedek yaşı" ölçümü eklenir.
5. İlk yüklemeden sonra **geri alma testi ölçülür** (uzaktan indir → sha256
   karşılaştır → bundle'dan clone). Test ölçülmeden yedek "var" sayılmaz.

**Not (Y3 varsayımı doğrulandı):** Hetzner *snapshot*'ı ücretlidir ve bu
revizyonda satın alınmamıştır.

---

## 5. Kullanıcı kararı bekleyen kalemler (özet)

| Karar | Seçenekler | Maliyet |
|---|---|---|
| Makine dışı yedek konumu | S1 R2 · S5 B2 · S4 Storage Box · S3 Drive · yok | 0 ₺ · <$0,01 · ≈3,2-3,9 € · 0 ₺ · 0 ₺ |
| ~~NHYP PDF yeniden indirilsin mi~~ | **KARAR VERİLDİ 29.07 — indirildi (41/41)** | 0 ₺ + 1,1 GB disk |
| `kaynak/tr-atlas-master.png` üretim kaydı | kaynağı hatırlıyorsanız KAYNAKLAR.md'ye yazılır | — |

**Sources:**
- [Hetzner Storage Box BX11](https://www.hetzner.com/storage/storage-box/bx11/)
- [Backblaze B2 pricing](https://www.backblaze.com/cloud-storage/pricing)
- [Cloudflare R2 free tier](https://cloudcredits.io/providers/cloudflare/programs/cloudflare-r2-storage-free-tier)
