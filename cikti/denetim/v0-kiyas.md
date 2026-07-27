# v0 ↔ MEVCUT KIYAS TABLOSU (A1, 2026-07-27)

Kaynak: ~/water-law-portfolio.zip → /tmp/v0-kaynak (13 dosya okundu).
Tailwind sitede KURULU DEĞİL (package.json/astro.config temiz) — v0'ın
Tailwind utility'leri vanilla CSS'e çevrilerek uygulanır (M5).

## SINIF A — görsel fark yaratır, UYGULANIR (28)

| Bölüm | Öğe | v0 değeri | Mevcut | Sınıf |
|---|---|---|---|---|
| tema | zemin/kart/metin | oklch(0.985 .006 220) bg · oklch(1 0 0) kart · oklch(.24 .04 235) metin · primary oklch(.5 .09 215) · muted-fg oklch(.52 .03 225) · border oklch(.9 .015 220) | #f2f7fa · #fff · #12293a · #0c5a7c · #47617a | A |
| tema | kicker (koyu bölüm) | oklch(.78 .11 200) | #7fd0ef | A |
| üst bar | iç kap | max-w-6xl (72rem) merkez, px-6 py-4 | tam genişlik, clamp padding | A |
| üst bar | kaydi kenarı | border-b white/10 (+bg /85 blur) | yalnız bg+gölge | A |
| üst bar | marka | yalnız "Su Hukuku", text-lg, tracking-tight | +"· suharitasi.com" eki | A |
| üst bar | nav metin | text-sm(0.875rem) white/80→white | 0.88rem white/.88 | A |
| üst bar | randevu | px-5 py-2, metin #0a2438, hover bg-white/90 | .55/1.1rem, #061824 | A |
| hero | rozet | bg-white/10, px-4 py-1.5, text-xs, tracking .25em, mb-5, blur | bg #08202f/45, .68rem, .18em | A |
| hero | H1 | 2.25→4.5rem (7xl), semibold, drop-shadow 0 2px 20px black/50, max-w-4xl | clamp 2–3.4rem, 500, gölgesiz | A |
| hero | alt metin | mt-6, max-w-2xl, 1rem→1.125rem, white/85, drop-shadow-md | .98rem, white/82 | A |
| hero | butonlar | mt-16/20, px-7 py-3, birincil shadow-lg, ikincil bg-white/5 hover /15 border/40 | mt 1.5rem, 1.5/0.75 | A |
| hero | gösterge | bottom-20, h-1(4px) yuvarlak, pasif w-10px/40, aktif w-28px/95, 500ms | 2px, sabit 1.6rem | A |
| hero | aşağı ipucu | ChevronDown SVG + bounce | "↓" metni | A |
| sorular | balon | text-sm, text-center, px-4 py-2.5, gölge 0 8px 28px black/45 | 1.02rem, sola, .7/.95rem | A |
| fışkırma | damla | glow 0 0 6px rgba(210,240,255,.7), dip bottom-2 | gölgesiz, 4.5rem | A |
| fışkırma | köpük | bottom-0, blur-2xl(40px) | 3.2rem, 18px | A |
| hizmetler | başlık bloğu | ortalı, kicker semibold, h2 "Su ile ilgili her hukuki ihtiyaç tek çatı altında" + intro paragraf | sola, h2 farklı, intro yok | A |
| hizmetler | bölüm ritmi | py-24(6rem), mt-14 ızgara, gap-6 | 3.2–6rem clamp, 2rem, 1.1rem | A |
| hizmetler | kart | p-7(1.75rem), hover -translate-y-1 + border-primary/40 + shadow-lg | 1.4/1.3rem, -2px | A |
| hizmetler | ikon kutusu | 12×12(3rem) rounded-xl bg-primary/10, hover: bg-primary + beyaz ikon | çıplak ikon | A |
| hizmetler | ikonlar | FileCheck2·Drill·Waves·Scale·Landmark·ShieldAlert | serbest çizim 6 SVG | A |
| süreç | başlık bloğu | ortalı; h2 "Net, şeffaf ve takip edebileceğiniz bir yol" + intro | sola, "Nasıl çalışıyoruz?" | A |
| süreç | adım | numara 3rem serif white/15 filigran, border yok, gap-8 | .8rem mono, border-top | A |
| hakkında | paragraf | "Su; bir hak, bir kaynak..." tanıtım metni | tek cümle künye | A |
| hakkında | madde ikonu | CheckCircle2, gap-3 | çizgi ::before | A |
| hakkında | stat kartı | p-8, lg tek kolon yatay, değer 2.25→3rem serif primary | dikey ortalı, 2rem | A |
| iletişim | başlık+intro | "Su ile ilgili sorunuzu bize bırakın" + intro | farklı h2, intro yok | A |
| iletişim | sol blok + form | ikon kutulu satırlar (11×11 yuvarlak); form kabı rounded-2xl border-white/10 bg-white/5 blur p-7; alanlar Ad Soyad/Telefon/E-posta/Durumunuz + placeholder; buton "Mesajı Gönder" | kapsız form, 3 alan | A |

## SINIF B — BRIEF KAZANIR, uygulanmadı (12)
Sorular TIKLANABİLİR (v0: pointer-events-none aria-hidden süs) · 6 soru
seti (v0'da 5; "Ruhsatsız kuyu cezası" v0'da yok, brief 6 tanımlar) ·
Mobilde sorular KALIR (v0: lg altı gizli) · "Veriler" menüsü (v0'da yok) ·
Poster kareli FAZ A + tek src'li video + sıralı ön-yükleme (v0: 6 video
preload="auto" autoplay — ağır) · Uydurma değerler (tel 000, suhukuku.av.tr,
Ankara, 15+/500+/%98) ÇIKARILDI + "güçlü sicil" maddesi (doğrulanamayan
sicil iddiası) ALINMADI · 280 öz-cevap hero alt metni (v0'ın pazarlama
cümlesi yerine, K-3) · JSON-LD · noscript · hüküm-yazma kapısı · Sondaj
kartı linksiz · Footer: paylaşılan AltBilgi + gerçek künye/link sütunları
KORUNur (M8; v0'ın tek-satır minimal footer'ı yerine — v0 © satırının
karşılığı imza şeridi zaten var).

## SINIF C — taşınamaz (9)
React state/hooks (useState/useEffect/useMemo) · next/font (Playfair/Inter
— site fontları Cormorant/Manrope, marka kimliği üstün) · next/image ·
lucide-react PAKETİ (ikonlar inline SVG çizilir) · @vercel/analytics ·
shadcn ui/button · Tailwind utility sistemi (değerler vanilla'ya çevrilir) ·
tw-animate-css · dark-mode varyant sistemi.

SAYIM: A=28 · B=12 · C=9
