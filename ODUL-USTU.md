# ÖDÜL-ÜSTÜ PROGRAMI — ÇATI BELGESİ (v1, 21.07.2026)

## Hedef ve ölçüt
Dört eksen (tasarım, yaratıcılık, kullanılabilirlik, içerik) TEK fikirden
beslenir: "Türkiye'nin suyu — gerçek veri, kişisel hikâye, hukuki derinlik."
Farklılaştırıcımız kurgu değil GERÇEK içerik: canlı baraj, GRACE, kurtarılmış
DSİ arşivi, mevzuat izleme, vaka kütüphanesi. Ödül başvurusu HEDEF DEĞİL;
ödül-düzeyi-üstü craft hedeftir.

## Hiyerarşi
VIZYON.md hedef envanteri, bu belge o envanterin ÖDÜL-ÜSTÜ SIRALAMASI ve faz
disiplinidir. Çelişki halinde: DESIGN.md (nasıl) > ODUL-USTU.md (hangi sırayla) >
VIZYON.md (ne). BRIEF.md çatı kuralları her zaman üstündür.

## Korunacaklar (hiçbir faz bunları feda edemez)
- İçerik sayfalarında JS~0; craft yükü yalnız sahne rotalarına (landing,
  /harita/, /deneyim/, Senin Suyun).
- GEO: öz-cevap + JSON-LD JS'siz DOM'da, curl-kanıtlı.
- Lighthouse tabanları (mevcut sayfa tabanının altına düşüş = FAIL).
- Veri dürüstlüğü: düz-çizgi kuralı, "ulusaldır" etiketi, uydurma yasağı.
- TBB dili: bilgilendirme portalı; huni/CTA agresifliği yok.
- SU-DİLİ + Landing İstisnası (DESIGN.md).

## Retler (bilinçli, gerekçeli)
- WebGPU/3D dönüşü: imza etkileşimi gölgeler, istikrar riski. (VIZYON ufkunda
  kalır; bu programda yok.)
- Her sayfaya animasyon: iş sayfası JS~0 bozulur.
- Dil/kapsam genişlemesi (EN sürüm vb.): ayrı stratejik karar.
- Trend efekt kopyası: kimliksizleştirir.

## Fazlar (sıralı; her faz kendi uygulama briefini Fable'dan alır; onay
kapısı geçilmeden sonraki faz AÇILMAZ)

FAZ 1 — SÖZLÜK VE BORÇ: Koreografi/katman CSS tekilleştirme (SIRADAKILER
40-41) + hareket sözlüğünün (--e-suzul ailesi) site geneline tutarlı yayılımı;
sayı-canlanma deseni (baraj yüzdesi vb. görünüme girerken dolar). Görsel mock
gerektirmez (mevcut onaylı desenlerin yayılımı). Bitti: tekil kaynak, görsel
regresyon kıyasları, Lighthouse korunumu.

FAZ 2 — "BUGÜN TÜRKİYE'DE SU" NABIZ ŞERİDİ: Ana sayfada üç canlı değer
(baraj doluluk, GRACE eğim, son mevzuat hareketi) + tarih damgası; build-time
JSON'dan. Bitti: mock onayı → uygulama → curl kanıtı.

FAZ 3 — "SENİN SUYUN" v1 (Kuzey Yıldızı, sade sürüm): İl seçimi → kişisel su
sayfası (havza + canlı baraj + GRACE eğimi + il rejimi hukuku) mevcut veriden.
İmza etkileşim İÇERMEZ (Faz 4'e ayrılmıştır). Bitti: akış mock'u onayı →
uygulama → üç kalıp standardında kanıt seti.

FAZ 4 — SONDAJ ANI (imza etkileşim, TEK): Sondaj-imleç + derinlik kesiti +
damla sıçraması; yalnız sahne rotalarında. Kural 3 TAM işler: referans
görsel/mock onaysız kod yazılmaz; kıyas karesi zorunlu. Bitti: mock onayı →
uygulama → performans bütçesi kanıtı (sahne rotası LCP/CLS korunur).

FAZ 5 — ZAMAN KATMANI: GRACE 2003→2026 zaman kaydırıcısı + kinetik tipografi
dozajı (DESIGN.md sözlüğünden). Bitti: mock onayı → uygulama → veri dürüstlüğü
kanıtı (kaydırıcı hiçbir noktada yanıltıcı ara-değer üretmez).

FAZ 6 — İÇERİK DERİNLİĞİ (paralel akar, faz kapısına tabi değil): soru
havuzu, Su Verimliliği Belgesi rehberi (süreler işliyor — öncelikli), vaka
kütüphanesi büyümesi (KAP taraması adayları), lead segmenti. Kalıplar:
DESIGN.md §17.

## Açık kararlar (kullanıcıda — KARAR BEKLİYOR)
- /deneyim/: menüye bağlanması (öneri: "Senin Suyun"un final sahnesi) / kalkması.
- src/harita-3d/: arşivde kalması / silinmesi.
- Birleşik panorama: /harita/ hero'ya girmesi (raf).
- Upscale: canlı "yumuşak" kararına bağlı.

## İşleyiş
Her faz: Fable uygulama briefi (ön-denetimli, düşman geçişli) → kullanıcı
basar → kanıt seti → kullanıcı onayı → sonraki faz. Görsel fazlarda (2-5)
mock onaysız kod yazılmaz. Bu belge fazlar ilerledikçe güncellenir; güncelleme
de brief'le yapılır.
