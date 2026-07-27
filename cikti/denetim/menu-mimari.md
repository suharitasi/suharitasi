# MENÜ BİRLEŞTİRME — MİMARİ (FAZ 2, 2026-07-27)

Yöntem: site-architecture skill — IA hedefi: tek gezinme modeli, orphan
yasağı (kaybolan bağlantı 0), 2 seviye derinlik (bar → açılır liste).

## Yeni paylaşılan bileşen
`src/components/PaylasilanMenu.astro` — ana sayfa v2 üst barı temel;
stiller BİLEŞEN İÇİNDE (Astro scoped) — anasayfa-v2.css'e bağımlılık yok.
Menüde h1–h6 YOK; bölüm başlıkları <p> + section aria-label.

## Koşullu href (2.2)
`const anaSayfa = Astro.url.pathname === '/'`
çapa linkleri: anaSayfa ? '#hizmetler' : '/#hizmetler' (4 çapa: hizmetler,
surec, hakkinda, iletisim + Randevu Al → iletisim).

## Zemin uyarlaması
Ana sayfa: fixed + şeffaf başlar, scroll>40 koyu (mevcut davranış).
İçerik sayfaları: sticky + HEP koyu zemin (krem zemin üstünde şeffaf bar
okunmaz; sticky = içerik altta kalmaz, spacer gerekmez).

## "Veriler" listesi (2.3) — tüm sayfalarda AYNI, 10 rota
9 mevcut rota + `/hakkinda/` (eski menüden gelen SAYFA linki; yeni barın
"Hakkında"sı ana sayfa bölümüne gittiği için sayfa linki Veriler'e taşındı
— kayıp 0 kuralı).

## 0.5 VİTRİN KARARI: KORUNUR — menü paneli içinde
Eski TamEkranMenu vitrini (Son 3 rehber · Su Kanunu son durum · Öne çıkan
havza; build-time, elle metin yok) yeni menüde masaüstü açılır listenin
altında + mobil panelde "Öne çıkan" bölümü olarak taşınır. Gerekçe: 173
sayfadan taze içeriğe çıkış (iç bağlantı grafiği) korunmalı; footer'a
itmek keşfedilebilirliği düşürürdü. Kaynaklar TamEkranMenu ile aynı
(rehber koleksiyonu tarih sırası + izleme kaydı + havza-veri).

## Eski → yeni eşleme (2.4)
| Eski (UstMenu/TamEkranMenu) | Yeni |
|---|---|
| marka → / | marka → / |
| Harita → /harita/ | Veriler ▸ Harita — Su Atlası |
| Havzalar → /havzalar/ | Veriler ▸ Havzalar (25) |
| Rehberler → /rehberler/ | Veriler ▸ Rehberler |
| Su Kanunu → /su-kanunu/ | Veriler ▸ Su Kanunu takibi |
| Durumum → /durumum/ | Veriler ▸ Durumum — sektör kapısı |
| Hangi Kurum → /hangi-kurum/ | Veriler ▸ Hangi kurum? |
| Vakalar → /vaka/ | Veriler ▸ Vakalar |
| Hakkında → /hakkinda/ | Veriler ▸ Hakkında — künye (YENİ satır) |
| vitrin: son 3 rehber | Öne çıkan ▸ aynı 3 (dinamik) |
| vitrin: kanun son durum | Öne çıkan ▸ aynı (dinamik) |
| vitrin: öne çıkan havza | Öne çıkan ▸ aynı (dinamik) |
| (yeni barda ek) | Kuyu Ruhsatı—81 il · İl rejimi aracı |
KAYBOLAN: 0.

## Mobil (2.5)
Hamburger → panel: 5 ana link + Veriler listesi AÇIK + Öne çıkan + Randevu.
JS kapalı: noscript stiliyle panel açık liste; masaüstü dropdown
hover/focus-within CSS.

## Uygulama sırası (3.4)
ADIM 1 bileşen (kullanılmadan) · ADIM 2 tek sayfa (hakkinda.astro,
Sayfa.astro'ya geçici yeniMenu prop'u) · ADIM 3 yayılım (Sayfa.astro
varsayılan + harita.astro + harita-pilot + stil kalıntıları) · ADIM 4 ana
sayfa paylaşılana geçer. Eski UstMenu/TamEkranMenu DOSYALARI KALIR (M10).
