# TEMİZLİK + SEO/GEO TAM DENETİMİ + KATMA DEĞER — rapor

Brief: `cikti/brief/2026-08-25T03-29-43Z-geo-seo-katma-deger.md`
(düzeltilmiş: `...-duzeltilmis.md`) · Dal: `geo-seo` (worktree
`suharitasi-geo`) · Başlangıç: 2026-08-25T03:30Z · Model: Fable 5 ·
Sınıf: BÜYÜK İŞ (beyan brief'te).

## 0. Denetim + düşman geçişi + amaç özeti (rejim kapısı)

### 0a. Brief denetçisi
- Orijinal koşum: **2 ENGEL + 3 UYARI** (T5 commit+push anılmamış,
  T7 hukuk kapısı anılmamış; T1×2 referans, T6 canlı-koşul).
- Yalnız-ekleme düzeltmesi (E1-E4) sonrası: **ENGEL 0, 2 UYARI.**
  Kalan uyarılar T1 referans uyarısıdır ve E4'te açıklanmıştır:
  `llms.txt` build ÇIKTISIDIR (dist/ + yayında mevcut, repo kökünde
  aranması beklenmez); `rapor/geo-seo-katma-deger.md` bu işin YENİ
  çıktısıdır. Denetim raporları: `cikti/denetim/brief/2026-08-25T03-30-38Z.md`
  ve `...T03-30-58Z.md`.

### 0b. Amaç özeti
- **Amaç:** (A) ölü kurum kaynaklarının onarımı + /su-hukuku/
  kaldırma; (B) 500+ sayfalık sitenin SEO/GEO hazırlığını tarama
  başlamadan tamamlamak (meta, şema, öz-cevap, iç ağ, AI yüzeyi);
  (C) kullanılmayan değerin karar listesi. GSC gerçeği: 168 sayfa
  "keşfedildi — dizine eklenmedi" — B tek başına sıralama getirmez,
  tarama başladığında etkili olacak hazırlıktır.
- **Dokunulmazlar:** hukuki metinler (E2 — hüküm yazılmaz, B7
  düzeltmeleri uygulanmaz) · veri kaydında karşılığı olmayan ifade
  (B4 sert sınır) · renk/font/desen icadı · sayfa ağırlığı artışı ·
  AY İLKESİ (yeni özellik yok) · e-posta gönderimi (C3 yalnız öneri) ·
  A5'te hukuki vaat taşıyan sayfaya 301 yasak.
- **Bitti-tanımı:** A6 kanıt paketi tam · B fazları kapılardan geçti
  + merge + deploy teyidi + canlı `--tam` koşusu · C sıralı listesi
  KARAR YAZMADAN raporda · bu rapor tam.
- **Kanıtlar:** önce/sonra link tablosu · md17/md13/md14/md21
  ölçümleri · sitemap diff ("diğer fark: 0") · canlı 301 ölçümü ·
  sağlık `--tam` çıktısı · öz-cevap sayı bekçisi bağları.

### 0c. Düşman geçişi (D1-D4)
- **D1 — FAIL yolu:** En kritik risk: site-geneli otomatik meta/link
  düzeltmesinin tabanları geriletmesi (md13 kontrast, md14 G1-G6,
  S1, ağırlık) — karşı şart: her faz sonunda kapı listesi koşar, faz
  bağımsız merge edilir, gerileme = faz geri alınır. İkincil FAIL:
  A2'de 200 dönen ama başka yayına giden "yeni adres" (kayıtlı vaka:
  trdizin /318433) — karşı şart: içerik kontrolü zorunlu, başlık/metin
  eşleşmesi kanıt. Üçüncül: B4'te veriden türetme kisvesi altında
  hukuki/hidrolojik ifade sızması — karşı şart: yalnız veri kaydı
  alanları; yazılamayan sayfa öz-cevapsız kalır ve sayılır.
- **D2 — boş çıkabilecek varsayımlar:** (i) "su-kanunu-taslak-pdf"
  izleyici hedefi olarak repoda var mı — koşumda doğrulanacak;
  (ii) GSC sayıları (168+1) kullanıcı beyanı [VERİ-kullanıcı], bu
  ortamdan GSC'ye erişim yok, yeniden ölçülemez — rapora şerhle;
  (iii) **`seo-audit` skill'i KURULU DEĞİL** (ne proje
  `.agents/skills/` ne oturum envanteri; `skills-lock.json`da yok) —
  föydeki 8 skill'den 7'si koşulabilir, seo-audit satırı raporda
  "kurulu değil" olarak kalır, işlevi md16/md7 bekçi ölçütleri +
  diğer skill'lerle karşılanır; (iv) A5'e "nötr 301 hedefi bulunur"
  varsayımı — bulunamazsa brief'in kendi DUR kapısı işler.
- **D3 — değen maddeler:** (i) B5 "her sayfa tematik komşuya bağlanır"
  ↔ "dokunma hedefi kötüleşmez": çözüm — Manisa 7→12 borcu AYNI turda
  kapatılır, önce/sonra md21 ölçümü kanıttır; (ii) B1 "metin veriden
  türetilir" ↔ B4 sert sınır: B1 türetmeleri de B4'ün veri-alanı
  sınırına tabidir; (iii) A5 sayfa düşüşü ↔ "taban gerileme 0" kapısı:
  brief kendisi çözmüş — A5 düşüşü birebir listeyle istisnadır;
  (iv) kopyalanma direnci (bot koruması) ↔ B6 AI bot erişimi:
  CLAUDE.md istisnası açık — arama/AI botları engellenmez, çelişki yok.
- **D4 — yarıda kesilme:** İş `geo-seo` dalında, fazlar kendi içinde
  merge edilebilir; brief + denetim raporları + bu rapor diskte;
  taban anlık görüntüleri değişiklikten ÖNCE alınır (A4). Kesilirse
  main yayında ve sağlıklı kalır; tamamlanmış fazlar kaybolmaz.

### 0d. Oturum açılışı notu
`izleme/SITE-DURUM.md` okundu: **🔴 var** — md17, 4 ölü SYGM dış
bağlantısı (bu işin A bölümünün konusu). 🟡: md21 dokunma (Manisa
7→12, B5'te kapatılacak borç), md16 SEO/GEO 199→207, md18 yeni veri
dosyaları (SIRADAKILER'de kayıtlı).

---

*(A, B, C bölümleri koşum ilerledikçe doldurulacak.)*
