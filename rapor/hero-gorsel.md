# Hero görsel düzeltme — "Saha kadrajı" (28.07.2026)

Brief: cikti/brief/2026-07-28-hero-gorsel.md (denetçi: 1 ENGEL → ekleme ile
TEMİZ). Skill: frontend-design (karar çerçevesi) — "hero bir tezdir; imza
öğesi tek olsun" ilkesi kadrajı imza yaptı, metni sahnenin üstünden indirdi.
Kanıt: cikti/denetim/hero/ (önce/ 6 kare · sonra/ 17 kare + geçiş dizisi).

## Teşhis (ölçüm, canlı ÖNCE)
- H1 72px, 832×158; başlık bloğu sahnenin **%19'unu merkezden örtüyor** (Ş1-Ş2)
- video 1469×918 render = 832×464'ün **×1,77 upscale'i** (K2 ihlali — netlik kaybı)
- uçuşan sorular 14px, görüntü üstünde
- **Ş3 kökü:** `.v2-sayfa * {margin:0;padding:0}` reseti 0-2-0 özgüllükle tüm
  tekil-sınıf kurallarını eziyordu — v0'ın 6rem bölüm padding'i ve
  `.v2-bolum-bas` ortalaması HİÇ uygulanmamıştı (ölçüm: tüm pad/margin 0)
- ağ (load+13sn, canlı): 10.530 KB / 27 istek (9 mp4 range parçası + 6 jpg)

## Kararlar (gerekçeli)
1. **Metin sahneden iner** — üst bant düz v0-koyu zeminde; H1 clamp 1.9-2.6rem
   (72→41,6px ölçüldü). Ş1 çözümü; metin-kadraj kesişmesi **0px** (ölçüldü).
2. **Birleşik hal = 6 posterlik film şeridi** (K1: poster; K2: downscale
   keskin). Şerit karesi tıklanır → sahneye atlar (role=tablist).
3. **Kadraj native 832×464** (upscale ×1,00 ölçüldü) → işçiler net (Ş2;
   kare: sonra/dizi-t4-sahne1.png).
4. **Sorular kadrajın yanına** (6'sı da daima görünür+tıklanır, 1440);
   aktif sahnenin sorusu vurgulu — senkron ölçüldü: t4 Sondaj→"Sondaj ile
   alakalı…", t9 Akifer→"nerelerde çıkabilir", t14 Baraj→"nerede su var".
   Mobilde liste MobilSorular bölümünde (S1).
5. **Ş3 kök düzeltmesi:** reset `:where()`e alındı (özgüllük 0) — v0 ritmi
   (96px bölüm padding, 384px'te ortalanmış başlıklar) İLK KEZ devrede;
   ölçümle doğrulandı. Alt bölümlerde içerik/metin değişmedi (K3).
6. Soru↔sahne eşlemesi sunum kararı; build-time birebir doğrulanır.
7. Fıskiye kadraj dibine taşındı (CTA bölgesine taşıyordu — mobil karede
   ölçüldü); K-1 süre/formülleri değişmedi.

## Korunanlar (ölçüldü)
- S1: dert-soru 375'te **736-785, kadraj içinde** (üç sıkma turu; ilk ölçümde
  reset dönüşü 830'a itmişti — boşluklar S1 yöntemiyle ayarlandı)
- H1 + alt satır metinleri AYNEN (yalnız boyut/yerleşim)
- kanıt bandı içeriği; uçuşan 6 sorunun tıklanabilirliği (1440 yan liste +
  mobil MobilSorular); kontrast ihlal 0 (14+152 düğüm); konsol 0; taşma 0
- motor K-1 süreleri (5000/1400/3800); tek video (K1)
- **Ağırlık (K1):** çekilen varlık kümesi BİREBİR aynı (aynı 3 mp4 + 6 jpg;
  dosyalara dokunulmadı — sahne1 1.364.740 B, sahne2 2.081.207 B, sahne3
  1.033.756 B). Tam-ekran katman kalktığı için render yükü azaldı; yerel
  sunucu content-length vermediğinden bayt kıyası istek-kümesi eşitliğiyle
  kanıtlandı (küme aynı ⇒ ağırlık artmadı).
- gerileme 0/174 · sitemap/llms değişmedi

## Bilinen dar pay
S1 payı 27px (785→812) — brief şartı sağlandı; canlı fontlarda ±birkaç px
oynayabilir, canlı ölçüm deploy sonrası tekrarlanacak.
