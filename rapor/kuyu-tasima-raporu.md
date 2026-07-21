# Kuyu Taşıma Rehberi — Yerleştirme Raporu (GECE PAKETİ v2 — Bölüm B)

*2026-07-21*

## Rota ve mimari
- Yayın yolu: **/rehberler/kuyu-tasima/**.
- Kaynak: `icerik-taslak/kuyu-tasima-kaynak.md` (Av. Serdar Arslan — Apilex metni).
  Claude Code **hüküm eklemedi**; yalnız yerleştirdi/yeniden biçimledi.
- kuyu-ruhsati kalıp-2 emsalinin görsel dili kullanıldı ama sayfa **ayrı**
  render edilir (`src/pages/rehberler/kuyu-tasima.astro`): kuyu-tasima'nın yapısı
  (5-durum karar akışı, 7-adım, katmanlı karşılaştırma/evrak) kalıp-2'nin sabit
  8-bölüm + 4-satır iskeletine oturmaz; zorlamak build'i düşürürdü.
- Koleksiyon üyeliği için `src/content/rehberler/kuyu-tasima.md` (frontmatter)
  eklendi → /rehberler/ indeksinde çıkar, çapraz-bağlar çözülür. `[slug].astro`
  getStaticPaths'ten kuyu-tasima **hariç tutuldu** (tek satır filter) → rota
  çakışması yok, diğer rehberlerin render'ı **bit-değişmedi**.

## Tasarım skill kaydı (CLAUDE.md gereği)
- **ui-ux-pro-max** (birincil): progressive-disclosure için native `<details>`
  (Katman), klavye/tab sırasının görsel sırayla eşleşmesi, görünür focus-ring,
  çok-adımlı süreçte adım göstergesi, dokunma hedefi ≥44px kuralları teyit
  edildi. Uygulanan: 5-durum → **karar kartları**, 7-adım → **numaralı dikey
  adım rayı**, karşılaştırma/evrak → **katmanlı (Katman) tablo** varsayılan
  kapalı, DOM'da tam.
- **dataviz**: 5-durum ve karşılaştırma **sayısal değil kategorik karar
  içeriği** (≤5 satır) → dataviz'in kendi kuralıyla bu bir GRAFİK DEĞİL,
  kart/tablodur; zorunlu grafik-tetiği oluşmadı (grafik üretilmedi).
- **frontend-design / transitions-dev**: yeni görsel yön veya animasyon
  gerekmedi; mevcut `.gk` giriş koreografisi (hareket.css) ve Katman panel-reveal
  (--e-suzul, reduced-motion korumalı) yeniden kullanıldı.

## İçerik korunması (B17) — hücre sayımı birebir
| Kaynak tablo | Kaynak hücre | Sayfadaki karşılık | DOM sayımı |
|---|---|---|---|
| §III 5-durum (5×5) | 5 durum + 25 alan | 5 karar kartı × (durum + 4 alan) | karar-durum 5, `<dd>` 20 ✓ |
| §V 7-adım (5×7) | Aşama(no)+İşlem+Dayanak+Belge+Çıktı | 7 adım kartı (no + başlık + 3 alan) | adim 7, adim-c 21 ✓ |
| §VI karşılaştırma (6×3) | 6 başlık + 18 veri | katmanlı tablo | th 6 + `<td>` 18 ✓ |
| §VII evrak sistematik (4×11) | 4 başlık + 44 veri | katmanlı tablo | th 4 + `<td>` 44 ✓ |
| §VIII tam akış (4×8) | 4 başlık + 32 veri | katmanlı tablo | th 4 + `<td>` 32 ✓ |
| §VII A/B evrak listesi | 8 hukuki + 10 teknik | katman içi tanım listesi | `<dt>`/`<dd>` 18 ✓ |

DOM toplam: `<td>` **94** (18+44+32), `<th>` **14**, `<dt>`/`<dd>` **38**
(20 karar + 18 evrak), `<tr>` **25**. Ayrıca §I madde metinleri (167 m.8,10,11,
12,13,18 + Tüzük m.2,4,11,13,15,16) birebir katmanda; §II dört hâl sebep
listeleri, §IX dikkat (10 madde), §X sonuç (6 madde) tam. **Hiçbir metin
kısaltılmadı.**

## Brief şart karşılıkları
- **B1** 3-saniye ilk ekran öz-cevabı iki çıpadan: "aynı ruhsat otomatik
  taşınmaz" + m.12 "harca/damga resmine tabi değil" — curl ile JS'siz DOM'da
  doğrulandı.
- **B3** FAQPage JSON-LD: 4 soru YALNIZ kaynak bölüm başlıklarından
  ("Hangi hâlde hangi hukuki yol?", §II.4 taşınma, ıslah-tadil ayrımı, §V
  başvuru şeması); cevaplar kaynak metinden özet. Ek olarak Article JSON-LD
  (E-E-A-T). JS'siz DOM'da doğrulandı (`"@type":"FAQPage"` + 4 Question).
- **B4** m.18 ceza: 2008 tabanı açıkça (1.000–5.000 TL / 500–2.000 TL,
  23/1/2008-5728) yazıldı; güncel tutar VERİLMEDİ, **[APILEX teyit]** boşluğu
  bırakıldı (DOM'da doğrulandı).
- **B5** Risk + iletişim: /durumum/ onaylı dil tonuyla (davetsiz, yaptırım
  için mevzuat esas).
- **B6** İç bağlar: kuyu-tasima → kuyu-ruhsati + ruhsatsiz-kuyu-cezalari
  (IlgiliRehberler) VE kuyu-ruhsati → kuyu-tasima (ters çapraz, kuyu-ruhsati.md
  ilgili dizisine eklendi — bu kuyu-ruhsati'de tek değişiklik: bir ilgili kart
  daha) + /durumum/ personaları (sondaj-aritma-firmasi, gayrimenkul-gelistirici).

## Kanıt (headless ön eleme)
- Build: 174 sayfa, hata 0. Konsol: **0 hata/uyarı**.
- Kırık iç link: **0** (23 benzersiz iç link tarandı).
- 375px yatay taşma: **0** — katmanlar açıkken bile (tablolar kendi
  `.tablo-kap` kabında kayar).
- Görüntüler: `cikti/denetim/faz-b/kuyu-tasima-1440.png` + `-375.png`.
- **Lighthouse 3-tur medyan** (aynı kutu/oturum, göreli karşılaştırma):
  | Sayfa | Perf | A11y | Best | SEO |
  |---|---|---|---|---|
  | kuyu-ruhsati (REFERANS) | 94 | 100 | 100 | 100 |
  | kuyu-tasima (YENİ) | 93 | 100 | 100 | 100 |
  A11y/Best/SEO referansla **eşit (100)**. Perf 93 vs 94: ham turlar örtüşüyor
  (kuyu-tasima 95/87/93 — bir tur referans medyanının ÜSTÜNDE); 1 puan
  localhost gürültüsü (CLAUDE.md: tek fark eşik ihlali sayılmaz). Maddi
  regresyon yok.
- Denetimde yakalanıp düzeltilen a11y: `<article role="listitem">` geçersiz
  ARIA kaldırıldı; iletişim not/ayraç rengi #9FB3AD→#C8D2CE (su-700 üstünde
  3.44→4.89, AA). Düzeltme sonrası a11y 96→100.

## Şerh (kullanıcı kararına)
- Aynı iletişim-notu kontrast hatası **/durumum/[persona].astro'da da vardır**
  (#9FB3AD, su-700). Bu brief kapsamı dışı; ayrı işte düzeltilebilir (kayıt
  burada).
- Nihai görsel yargı ve hukuki metin onayı kullanıcının canlı testindedir
  (İş kapanış kuralı). Headless kanıt = ön eleme.
