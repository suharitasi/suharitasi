# KURTARMA PLANI — Hetzner sunucusu tamamen kaybolursa (B1.4)

Tarih: 2026-07-28 · **PLANDIR, uygulama yapılmadı.** Tatbikat koşulmadı;
süreler adım adım tahmindir ve nereden geldiği yazılmıştır.

---

## 0. Önce iyi haber: SİTE ETKİLENMEZ

`suharitasi.com` **Cloudflare Pages**'te barınır ve statiktir. Sunucu
tamamen yok olsa bile **site çalışmaya devam eder** — 174 sayfa, harita,
arşiv, rehberler, hepsi ayakta kalır. Bu, "site statik kalır" kararının
(KARARLAR.md §11) doğrudan getirisidir.

**Duran şey veri üretimidir:** baraj günlüğü, GRACE, RG/NHYP nöbetçileri,
Su Kanunu izleme ve sağlık koşusu. Site bayatlar ama kırılmaz.

**Ne kadar süre bayatlığa dayanılır (kalem eşiklerinden):**
baraj 48 saat · su-izleme 72 saat · GRACE 8 gün · RG 14 gün · NHYP 35 gün.
Yani sunucu kaybının **ilk 48 saatte** fark edilmesi gerekir — bunu bugün
ancak elle fark edebilirsiniz (dış izleme yok; `rapor/dis-izleme.md`).

---

## 1. Kalıcı olarak KAYBOLAN veri

| Varlık | Durum | Not |
|---|---|---|
| Depo + tüm geçmiş (341 commit) | **KAYBOLMAZ** | GitHub'da |
| `kaynak/dsi-arsiv` (230 dosya, 54,6 MB) | **KAYBOLMAZ** | GitHub'da |
| `data/arsiv/mevzuat`, `baraj`, `dsi-yas` | **KAYBOLMAZ** | GitHub'da |
| `veri/potansiyel` (11 dosya) | **KAYBOLMAZ** | GitHub'da |
| GRACE ham NetCDF (506 MB) | yeniden indirilir | NASA GSFC açık; sha256 git'te |
| `kaynak/tr-atlas-master.png` (24 MB) | **KAYBOLUR** | üretim kaydı bulunamadı — **doğrulanmadı** |
| `kaynak-video/` ham video (22 MB) | **KAYBOLUR** | ücretli üretim, tekrar üretilemez; encode edilmiş sürümler git'te |
| `.env` (EPİAŞ + deploy hook) | **KAYBOLUR** | yeniden alınır (§3) |
| `log/` | kaybolur | değeri düşük |
| Gecelik yedek (`/home/suha/yedek`) | **KAYBOLUR** | aynı makinede — B1.2'nin açıkça yazılı sınırı |

**Sonuç:** makine ölümünde kaybolan tek geri getirilemez varlık
**ham videolar (22 MB)** ve muhtemelen **atlas PNG'si (24 MB)**.
Bu, §6'daki kullanıcı kararının tek gerçek gerekçesidir: 46 MB'lık bir
kayıp riskini kapatmak için makine dışı kopya gerekiyor.

---

## 2. Kurtarma adımları ve süre tahmini

| # | Adım | Süre (tahmin) | Neye dayanıyor |
|---|---|---|---|
| 1 | Yeni sunucu (Hetzner ya da başka) kur, Ubuntu | 15-30 dk | sağlayıcı panelinden standart kurulum |
| 2 | Temel paketler: `git`, `nodejs 20`, `python3`, `python3-gdal`, `numpy`, `curl`, `flock` | 15-25 dk | mevcut kurulumdaki bağımlılık listesi (`pip kurulumu YOK` — hepsi sistem paketi) |
| 3 | `git clone https://github.com/suharitasi/suharitasi.git` | 3-6 dk | depo bundle'ı **174,6 MB** ölçüldü |
| 4 | `npm ci` | 2-5 dk | `package-lock.json` var |
| 5 | **`.env` yeniden kur** — EPİAŞ kullanıcı/şifre + Cloudflare deploy hook | **15 dk – 2 gün** | şifre yöneticisinde kopya VARSA 15 dk; yoksa EPİAŞ hesabı kurtarma süresi **doğrulanmadı** |
| 6 | GRACE ham NetCDF indir (506 MB) + sha256 doğrula | 10-40 dk | dosya boyutu ölçüldü; indirme hızı **doğrulanmadı** |
| 7 | Crontab'ı geri yükle (`izleme/crontab-onceki-*.txt` + `izleme/kaynak-takvimi.md`) | 10 dk | dosyalar depoda |
| 8 | İlk koşumları elle doğrula: `node arac/altin-ornek.mjs` → 22/22 · `node arac/site-saglik.mjs --test` · `./saglik-bekcisi.sh` | 15 dk | altın örnek 0,31 sn ölçüldü |
| 9 | Gecelik yedeği yeniden kur (`arac/yedek-al.sh`) | 5 dk | script depoda |
| **TOPLAM** | **`.env` elde varsa ≈ 1,5-2,5 saat** | | |
| | **`.env` yoksa: EPİAŞ hesabı kurtarılana kadar** (gün olabilir) | | |

**Darboğaz `.env`'dir** — teknik hiçbir adım değil. Bu yüzden §6'daki ilk
karar odur.

---

## 3. Sırların yeniden üretimi

| Sır | Nasıl geri gelir |
|---|---|
| `CF_DEPLOY_HOOK` | Cloudflare panel → Workers & Pages → suharitasi → Settings → **Deploy hooks** → yeni hook üret. **Kayıp değil**, yeniden üretilebilir. |
| `EPIAS_USER` / `EPIAS_PASS` | EPİAŞ Şeffaflık Platformu hesabı. Şifre yöneticisinde yoksa hesap kurtarma süreci gerekir — **süresi doğrulanmadı**. |

Not: baraj pipeline'ı `.env` boşsa **exit 2** ile durur ve hata sayacını
artırmaz (kurulum eksikliğini arıza saymaz) — yani yeni sunucuda `.env`
gelene kadar sessizce bekler, veriyi bozmaz.

---

## 4. Ne veri kaybedilir (zaman penceresi)

| Pipeline | Kayıp |
|---|---|
| Baraj | Sunucu ölümü ile yeni kurulum arasındaki **günler**. EPİAŞ geriye dönük sorgulanabilir mi — **doğrulanmadı**; sorgulanamıyorsa o günler seride kalıcı boşluk olur. |
| GRACE | Kayıp yok — aylık yayın, kaynak arşivi kalıcı. |
| Su Kanunu izleme / RG / NHYP | **Fark motoru penceresi kaybolur.** Bu pipeline'lar "önceki hâl ile bugünkü hâl" karşılaştırır; ara dönemde yayımlanıp sonra değişen bir sayfa yakalanamaz. İlk yakalayan olma değeri (first-mover) o dönem için kaybedilir. |
| Sağlık koşusu | Kayıp yok — durum yeniden ölçülür. |

---

## 5. Tatbikat — YAPILMADI

Bu plan **kâğıt üstündedir.** Gerçek süre ancak temiz bir makinede
denenerek bilinir. Önerilen (kullanıcı kararı): boş bir Hetzner sunucusunda
saatlik ücretle 1-2 saatlik bir tatbikat (adım 1-4 ve 8) — maliyeti birkaç
euro, çıktısı bu tablodaki tahminlerin ÖLÇÜME dönmesi. **Ücretli olduğu
için yapılmadı.**

---

## 6. Kullanıcı kararı bekleyen kalemler

| # | Karar | Neden önemli |
|---|---|---|
| **K1** | **`.env`'in bir kopyası şifre yöneticisine alınsın mı?** | Kurtarma süresinin tek darboğazı. Maliyeti 5 dakika, kazancı "günler → 15 dakika". **En yüksek getirili tek adım.** |
| K2 | Makine dışı yedek konumu seçilsin mi (Cloudflare R2 ücretsiz önerildi) | 46 MB geri getirilemez varlığı kurtarır — `rapor/yedek-envanteri.md` §4 |
| K3 | Kurtarma tatbikatı koşulsun mu (birkaç €) | Tahminler ölçüme dönüşür |
| K4 | EPİAŞ geriye dönük veri sorgusuna izin veriyor mu? | Cevap "hayır" ise baraj serisindeki boşluk kalıcıdır; biliniyorsa KAYNAKLAR.md'ye yazılır |
| K5 | Dış izleme kurulsun mu (`rapor/dis-izleme.md`) | Sunucu ölümünün 48 saat içinde fark edilmesi buna bağlı |
