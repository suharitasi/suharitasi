# DESIGN.md — suharitasi.com

Bu belge bağlayıcıdır. Tasarım kararı bu belgeyle çelişiyorsa belge kazanır.

## Ruh

Ruh: itkan — kusursuz işçilik, cesur sahne. Hedef ödül (Awwwards)
seviyesi: zengin animasyon, sinematik derinlik ve imza etkileşimler
İSTENİR; sadelik amaç değildir. Yasak olan kalabalık değil,
özensizliktir: her öğe bilinçli, her hareket anlamlı.

## Konsept: Derin su

Gece denizinin içinden bakış. Sayfa bir yüzey değil, bir su kütlesinin içi:
yukarısı görece aydınlık, aşağı indikçe koyulaşan ve seyrekleşen katmanlar.
Jeoloji/dağ/harita-konturu hissi veren keskin tepeli biçimler kullanılmaz;
tüm çizgiler yatay, uzun ve yumuşak dalga eğrileridir.

## Palet

| Rol | Hex |
|---|---|
| Zemin (derin deniz) | `#04121F` |
| Yükselti / panel | `#071D2E` |
| Akış çizgileri — sönük | `#0E3247` |
| Akış çizgileri — imleçle canlanan | `#1E5A78` |
| Ana ışıma / vurgu (akuamarin) | `#4FC3D0` |
| İkincil ışıma (deniz köpüğü) | `#A8DDE0` |
| Metin | `#DCE9ED` |
| Soluk metin | `#6C8A96` |
| Bakır | `#C08A4F` — YALNIZCA "yakında" ayracındaki ince çizgilerde. Başka hiçbir yerde kullanılmaz. |

## Tipografi

- Display: **Cormorant** (serif) — başlıklar, ağırlık 400–500, geniş punto; italik vurgular serbest.
- Gövde / utility: **Manrope** — alt metin, etiketler; etiketlerde geniş harf aralığı (letter-spacing ≥ .18em) ve büyük harf.
- Türkçe karakter desteği (latin-ext) zorunlu.

## Hareket

- Dalga katmanları: çok yavaş yatay sürüklenme; fark edilen değil hissedilen.
- Su damarları: sayfanın alt yarısında, akuamarin ışımalı, farklı hız ve
  saydamlıkta akan çizgiler (stroke-dash akışı). Canlı ama sakin.
- İmleç: imlecin çevresinde dalga çizgileri canlanır — sönük `#0E3247`
  çizgiler `#1E5A78`'e döner ve hafif akuamarin ışıma alır. Maske yumuşak
  kenarlı radyal alandır; sert daire kenarı görünmez.
- `prefers-reduced-motion`: tüm akış ve sürüklenme animasyonları kapanır,
  statik kompozisyon tek başına ayakta durur.

## Harita adası

Sayfa koyu kalır, harita alanı aydınlık hipsometrik atlas estetiğidir
(palet: adaçayı #A9C3B4, yeşil #7C9B6E, hardal #C7B27B, kahve
#8A6B47/#6E5238; kart krem #F3EEE2). Zemin atmosferi: derin su degrade +
ince kabarcık/yoğuşma dokusu serbest; ikon-damla ve parlak kurumsal mavi
yasak. Harita, koyu suyun üstünde yüzen aydınlık bir atlas parçası gibi
hafif yükselmiş durur (yumuşak gölge çerçevesi). Akuamarin ışıma sitenin
dilidir, haritanın değil — harita içinde su öğeleri #5E8A87, vurgu
kehribar #D9A05B.

## Kırmızı çizgiler

- Su damlası ikonu yok.
- Klişe "kurumsal su firması mavisi" (parlak royal blue) yok.
- Dağ silüeti, keskin tepeli kontur, topografya-harita klişesi yok.
- Emoji yok. Arayüz dili Türkçe.
- Bakır, "yakında" ayracı dışında hiçbir yerde kullanılmaz.
