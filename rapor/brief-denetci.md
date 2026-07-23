# BRIEF DENETÇİSİ — kurulum raporu (v4)

*2026-07-23 · araç: `arac/brief-denetci.mjs` + `arac/brief-kurallari.json`*

## 6. SINIRLARIN AÇIK BEYANI (raporun başında — brief madde 6)

Bu araç KURAL İHLALİ arar ve düşman geçişini zorunlu kılar; brief'in
**stratejik doğruluğunu, iş önceliğini ya da mimari isabetini denetlemez.**
"TEMİZ" çıkması "brief doğru" demek DEĞİLDİR — kullanıcının nihai kararının
yerine geçmez. Düşman geçişi (D1-D4) ve amaç özeti (3b) mekanik değildir,
muhakeme gerektirir; script değil Claude Code yapar.

## 3b. AMAÇ ÖZETİ (kendi cümlelerimle — uygulamadan önce)

- **(a) AMAÇ:** Brief'leri projede birikmiş kurallara karşı mekanik denetleyen
  ve düşman geçişini zorunlu kılan bir aracı kurmak ve onu her briefin
  uygulanmadan önce geçtiği ön kapı yapmak.
- **(b) DOKUNULMAZLAR:** Brief'in amacı/kapsamı/kanıt şartları daraltılamaz;
  düzeltme yalnız ekleme+netleştirme (madde 4e — silme/daraltma yasak);
  orijinal brief değiştirilmeden saklanır; kayıtta karşılığı olmayan kural
  eklenmez (uydurma yasağı).
- **(c) BİTTİ-TANIMI:** kayıt-türetilmiş `brief-kurallari.json` + çalışan
  `brief-denetci.mjs` (konsol + `cikti/denetim/brief/<zaman>.md`, sonuç
  TEMİZ/UYARI/ENGEL) + 7 doğrulama senaryosu (gerçek briefte yanlış-pozitif
  ENGEL = 0) + CLAUDE.md 4c kuralı + SIRADAKILER satırı + commit/push.
- **(d) KANITLAR:** 7 senaryonun konsol+rapor çıktıları; gerçek brief TEMİZ;
  öz-denetim bulguları; raporlar `cikti/denetim/brief/` altında.

## 3. DÜŞMAN GEÇİŞİ (D1-D4)

- **D1 — FAIL yolu:** En kritik risk, aracın bir briefi yanlış "ENGEL"
  işaretlemesi (yanlış-pozitif) → uygulama gereksiz durur, güven bozulur.
  Karşı şart: gerçek briefte FP-ENGEL = 0. Ölçüldü: TUR 1A-3 v2 → **TEMİZ**.
  İkincil FAIL: kayıtta karşılığı olmayan kural = uydurma; T4 (bütçe) en
  zayıf temelli tip — `_temel_notu` ile şeffaf işaretlendi, ENGEL değil UYARI
  tutuldu. Üçüncül: denetçi kendi kelime dağarcığını denetlerken "kullanım/
  anım" (use/mention) ayrımına takılır (aşağıda vii) — kabul edildi, madde 0.
- **D2 — boş çıkan varsayım:** `site-saglik v5` briefi (madde 5-vi'nin ikinci
  gerçek briefi) **diske kaydedilmemişti** (repoda `cikti/brief/` yoktu).
  Uydurmadım. FP ölçümü mevcut gerçek brief (TUR 1A-3 v2) + aracın kendi
  briefi (vii) ile yapıldı; boşluk BİLİNEN EKSİKLER'de. İkinci varsayım:
  kural kaynakları `dosya:satır` bazlı — dosyalar değişince satır kayar;
  SÜREKLİLİK kuralı bunu json güncellemesine bağlar.
- **D3 — değen iki madde:** madde 1 ("kayıtta karşılığı olmayan kural
  EKLENMEZ") ile madde 2 (T1-T8 mekanik tip listesi) çelişebilir: T4'ün
  doğrudan kayıt karşılığı zayıf. Çözüm ayrımı: T-tip = makine kategorisi;
  kural-girdisi = kayıt-atıflı. T4 en zayıf, şeffaf işaretli, UYARI. İkinci
  değme: 3b amaç özeti ve madde 6 sınır beyanı ikisi de "raporun başı" istiyor
  → sıra: sınır beyanı → amaç özeti → düşman geçişi.
- **D4 — yarıda kesilme:** İş üç kalıcı çıktı bırakır (`brief-kurallari.json`,
  `brief-denetci.mjs`, `arac/test/brief-ornekleri/`) + raporlar
  `cikti/denetim/brief/` altında; her şey commit'e kadar diskte. Ara kayıt
  yeterli.

## 1. KURAL ÇIKARIMI

Kurallar KAYITLARDAN türetildi (CLAUDE.md, BRIEF.md, ODUL-USTU.md, GUNLUK.md,
SIRADAKILER.md, DESIGN.md §17). Tek gerçek kaynak: `arac/brief-kurallari.json`
(elle düzenlenebilir). Kayıtta karşılığı olmayan kural eklenmedi.

| Tip | Ad | Şiddet | Kaynak (örnek) | Yöntem |
|-----|-----|--------|----------------|--------|
| T1 | Referans varlığı | ENGEL | CLAUDE.md:133-134, GUNLUK.md:242-243 | referans_varligi |
| T2a | Ölçülebilirlik (belirsiz ifade) | ENGEL | CLAUDE.md:135-136, GUNLUK.md:237-240 | yasak_ifade |
| T2b | Görüntü kanıt değildir | ENGEL | CLAUDE.md:38-39, ODUL-USTU.md:23-25 | kanit_gorseli |
| T3 | Çelişki | ENGEL | CLAUDE.md:139, GUNLUK.md:236-249 | celiski_kod |
| T4 | Bütçe aritmetiği | UYARI | ODUL-USTU.md:33, GUNLUK.md:333 (zayıf temel) | butce_tutarlilik |
| T5 | Kapsam mührü | ENGEL | CLAUDE.md:13-19,139,149-150; ODUL-USTU.md:15 | kapsam_muhru |
| T6 | Sistem teması | UYARI | CLAUDE.md:35-37,40-43; ODUL-USTU.md:16-28 | sistem_temasi |
| T7 | Uydurma kapıları | ENGEL | ODUL-USTU.md:34,111-113; CLAUDE.md:107 | uydurma_kapisi |
| T8 | Geri dönüş | UYARI | GUNLUK.md:253-254,406; CLAUDE.md:17 | geri_donus |

**T4 şeffaflık notu:** Altı kaynak dosyada "istek bütçesi = iş miktarı" kuralı
DOĞRUDAN yok. Temel: kayıtlı performans/JS/Lighthouse bütçe disiplini +
tek-ölçüm-tuzağı kuralı (CLAUDE.md:145-146) + proje brief deseni (TUR 1A-2/3).
Bu yüzden ENGEL değil UYARI; brief madde 2 de T4'ü UYARI tanımlar.

## 5. DOĞRULAMA — yedi senaryo

| # | Senaryo | Beklenen | Sonuç |
|---|---------|----------|-------|
| i | boş referans (`01-bos-referans.md`) | T1 ENGEL | ✅ 2 ENGEL (T1) |
| ii | "güzelce yapılsın" (`02-olculemez.md`) | T2 ENGEL | ✅ 4 ENGEL (T2) |
| iii | "kod değişikliği yok" + css ekle (`03-celiski.md`) | T3 ENGEL | ✅ 1 ENGEL (T3) |
| iv | bütçe tutmayan (`04-butce-tutmayan.md`) | T4 UYARI | ✅ T4 UYARI (+ gerçek T7 ENGEL) |
| v | DUR/kapsam yok (`05-kapsam-yok.md`) | T5 ENGEL | ✅ T5 ENGEL (+ T7 ENGEL, T6 UYARI) |
| vi | gerçek brief (TUR 1A-3 v2) | FP-ENGEL = 0 | ✅ **TEMİZ** |
| vii | aracın kendi briefi | kusur kaydı | 4 ENGEL + 1 UYARI (aşağıda) |

### (vi) YANLIŞ-POZİTİF ÖLÇÜMÜ — kalibrasyon kaydı

İlk koşuda gerçek brief 1 ENGEL + 5 UYARI verdi; **hepsi araç hatası** (gerçek
kusur değil). Tek tek değerlendirilip düzeltildi (HEDEF: gerçek briefte
FP-ENGEL = 0):

1. `TE/KOD`, `tay/yat`, `K/TBMM` → "SİTE/KOD", "Sayıştay/yatırım", "TÜİK/TBMM"
   içinden sahte yol eşleşmesi. **Düzeltme:** yol regex'i yalnız bilinen kök
   dizinlerle (data|arac|src|...) ya da gerçek uzantıyla eşleşir.
2. `su-islemleri.js` → uzantı alternasyonu `js`'i `json`'dan önce yakalıyordu
   (truncation). **Düzeltme:** uzantılar uzun→kısa sıralandı + `(?![\w])`.
3. Bare `su-islemleri.json`/`hangi-kapi.json` (dizinsiz) repoda yok sanıldı.
   **Düzeltme:** `git ls-files` ile basename geri-dönüşü (dosya başka yolda
   varsa GEÇTİ).
4. T8 `"sil"` → "temsili" içinden substring. **Düzeltme:** kelime-başı sınırı
   (harfle başlayan ifade harf-olmayan sınırda başlamalı).
5. T1 `<brief-dosyasi.md>` placeholder'ı (öz-denetimde çıktı). **Düzeltme:**
   `<...>` metavariable'ları yol taramasından önce çıkarılır.

Düzeltme sonrası: gerçek brief **TEMİZ**, beş sentetik senaryo hedefini
korudu (regresyon yok). **Gerçek briefte yanlış-pozitif ENGEL = 0 sağlandı.**

`site-saglik v5` briefi diske kaydedilmediğinden denetlenemedi (D2; uydurma
yasağı — temsili brief üretilmedi). BİLİNEN EKSİKLER'de.

### (vii) ARACIN KENDİ BRİEFİ — kusur kaydı (madde 0: DÜZELTİLMEZ)

`cikti/brief/brief-denetci-v4.md` denetlendi → **4 ENGEL + 1 UYARI**. İnceleme:

- **T2 ×3 (uygun şekilde / güzelce / birebir görünmeli, s.25)** ve
  **T7 (hukuki hüküm, s.33):** Bunlar briefin **T2/T7 tanım satırlarının
  kendisi** — brief bu ifadeleri *yasak örnek* olarak ANIYOR, *şart olarak
  KULLANMIYOR*. Araç "kullanım/anım" ayrımını mekanik yapamaz.
- **T4 (bütçe 2, s.69):** "en fazla 2 tur" (düzeltme turu) bütçe sanıldı —
  yanlış tanıma, en zayıf kural.

Bu bulguların tamamı **madde 0'ın öngördüğü meta-artefakt**: denetçi, kendi
tanımladığı tetik-kelimeleri içeren bir briefi (kendi briefini) o kelimelere
takılmadan denetleyemez. Bu yüzden brief madde 0 "bu brief istisnadır" der.
Kusurlar tarihsel kayıttır; brief DÜZELTİLMEDİ. Kural kendinden sonraki
(meta-olmayan) brieflere sağlıklı işler — gerçek brief testi (vi) bunu
kanıtlar.

## Bırakılan kalıcı kontrol (SÜREKLİLİK)

- `arac/brief-kurallari.json` — tek gerçek kaynak; yeni kural doğunca (GUNLUK'a
  hata kaydı) buraya işlenir (CLAUDE.md 4c'ye bağlandı).
- CLAUDE.md 4c kuralı: her brief uygulanmadan önce dosyaya yazılır →
  brief-denetci → düşman geçişi + amaç özeti; ENGEL varsa uygulama başlamaz.
- SIRADAKILER'e satır eklendi.

## BİLİNEN EKSİKLER

- `site-saglik v5` briefi diske kaydedilmemişti; FP ölçümü tek gerçek brief
  (TUR 1A-3 v2) + aracın kendi briefi ile yapıldı.
- Araç "kullanım/anım" ayrımı yapamaz → brief hakkında brief (meta-brief)
  kendi tetik kelimelerine takılır. Gerçek iş brieflerinde sorun değil.
- T4 (bütçe) en zayıf temelli tip; sezgisel kalem sayımı yaklaşıktır (numaralı
  madde + Ç-kanalı). "en fazla N tur" gibi tur-sınırlarını bütçe sanabilir.
- Kural kaynakları `dosya:satır`; kayıt dosyaları değişince satırlar
  güncellenmeli.
- Düşman geçişi (D1-D4) + amaç özeti (3b) muhakeme gerektirir; araç bunları
  üretmez, Claude Code her brief raporunda elle yazar.
