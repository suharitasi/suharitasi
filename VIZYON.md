# VIZYON.md

## Kuzey Yıldızı

Sitenin nihai deneyimi teknoloji gösterisi değil, kişisel hikâye:
**"Senin Suyun"** — ziyaretçinin konumundan, içtiği suyun gerçek
yolculuğunu (yağış→havza→baraj→musluk, canlı doluluk ve gün verisiyle)
10 saniyelik sinematik kamera uçuşuyla anlatan açılış. Tüm teknik
maddeler (3, 5, kamera, post-processing) bu deneyimin tuğlalarıdır.
Ölçüt: ziyaretçi siteyi kapatırken bir şey öğrenmiş değil, bir şey
HİSSETMİŞ olmalı — ve birine göstermek istemeli.

## Harita nihai deneyim hedefi: "Sondaj Anı"

1. **Gayzer fışkırması ekranın camına taşar:** tepe noktasında ekrana
   damla sıçraması, cam üzerinde ağır süzülen yoğuşma damlaları, ışık
   kırılması.
2. **Derinlik kesiti:** su noktasına tıklayınca kamera dalar, arazi
   dilimlenir, yeraltı katmanları ve ışıyan akifer görünür — "su yerin
   altında konuşur" deneyimi.
3. **İmleç sonda ucuna dönüşür**, su potansiyeli olan alanda ışır.
4. **Derin su ambiyans sesi** (varsayılan kapalı, fışkırmada yükselir).

Bu hedefe fazlar halinde, her fazda kullanıcı onayıyla yürünür.

Durum:
- [x] Madde 1 — prototip (ekrana damla sıçraması; Faz 3A sonunda eklendi)
- [ ] Madde 2 — derinlik kesiti
- [ ] Madde 3 — sonda imleci
- [ ] Madde 4 — ambiyans sesi

## İleri teknikler (ödül seviyesi ve üstü)

1. **Post-processing katmanı:** bloom (gayzer/su ışımaları gerçek parlama),
   depth of field (kamera dalışında odak), hafif film greni — sinematik render.
2. **Caustics:** göl/deniz tabanında oynaşan kırılan ışık ağları — su
   sitesinin imza detayı.
3. **Volumetrik ışık:** güneşten araziye süzülen görünür ışık kolonları,
   sabah sisi.
4. **Scrollytelling:** landing + harita tek akış — scroll ile kamera
   koreografisi (başlıktan araziye süzülme, Toroslar üzerinden uçuş, göle
   dalış). SAYFA MİMARİSİNİ DEĞİŞTİRİR: uygulanmadan önce ayrı mimari
   kararı + kullanıcı onayı gerekir.
5. **Lenis smooth scroll + magnetic cursor:** akışkan kaydırma, etkileşimli
   öğelere mıknatıs imleç.
6. **Kinetik tipografi:** "Su, yerin altında konuşur" başlığı imleç
   yaklaşınca su yüzeyi gibi dalgalanır (shader distortion).
7. **WebGPU (ufuk):** gerçek akışkan simülasyonu, yüksek partikül —
   tarayıcı desteği olgunlaşınca, faz 5+.
8. **İl adları katmanı (harita etkileşim fazına ek):** zoom/spot'a bağlı
   katman — uzaktan temiz sahne, yaklaşınca/spot gezince o bölgenin il
   adları zarif tipografiyle belirir (81 etiket aynı anda ASLA).

Not: Bu liste hedef envanteri; sıralama ve dozaj faz faz, her fazda
kullanıcı onayıyla.

## Uygulama sırası

1. [x] Faz 3A — giriş/mobil/performans (tamamlandı, 9aa7dc1)
2. [x] Faz 3B — kamera + ekrana damla sıçraması (tamamlandı: dalış/dönüş
   koreografisi + cam sıçraması)
3. Konum tabanlı kişisel açılış — ziyaretçinin ilinden başlayan kamera +
   "senin suyun" mesajı
4. Post-processing (bloom/DOF/gren) + caustics + kinetik başlık
5. Canlı veri nabzı — DSİ/MGM verisi sahneye işler (Aşama 2 pipeline ile);
   örnek: baraj hover kartı: ad + güncel doluluk % + trend
6. Derinlik kesiti + sesle gezinti + su ambiyansı
7. Zaman yolculuğu kaydırıcısı (1990 -> bugün -> 2050 projeksiyonu)
8. GPU akışkan simülasyonu / WebGPU (ufuk)

Her madde ayrı faz, her fazda kullanıcı onayı.
