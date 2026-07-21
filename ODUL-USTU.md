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

FAZ NUMARALARI SABİTTİR. Uygulama sırası (2026-07-21 kullanıcı kararı, FAZ 8
eklendi): **1 → 7 → 8 → 2 → 3 → 4 → 5** (Faz 6 içerik derinliği paralel akar,
kapıya tabi değil). Faz 1 ve Faz 7 TAMAM (2026-07-21). Sıradaki uygulama: Faz 8.

DİL NOTU (2026-07-21 kullanıcı kararı, tüm fazlar için bağlayıcı): "TBB-çekingen
dil kaldırıldı — profesyonel, sonuç-odaklı, iletişime çağıran dil serbest ve
isteniyor; bayağılık yok." Önceki "bilgilendirme portalı / huni yok" kısıtı
gevşetildi: iletişime çağrı (tel/e-posta), B2B rapor teklifi, sektör kapıları
serbest. TBB reklam yasağına aykırı vaat/abartı yine YASAK; ölçü: profesyonel,
kanıta dayalı, sonuç-odaklı.

FAZ 1 — SÖZLÜK VE BORÇ: Koreografi/katman CSS tekilleştirme (SIRADAKILER
40-41) + hareket sözlüğünün (--e-suzul ailesi) site geneline tutarlı yayılımı;
sayı-canlanma deseni (baraj yüzdesi vb. görünüme girerken dolar). Görsel mock
gerektirmez (mevcut onaylı desenlerin yayılımı). Bitti: tekil kaynak, görsel
regresyon kıyasları, Lighthouse korunumu. **DURUM: TAMAM (2026-07-21).**

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

FAZ 7 — SONUÇ ZİNCİRİ VE PAZARLAMA (sıralamada Faz 1'den hemen sonra):
ziyaretçiyi okurdan müvekkile taşıyan zincir + pazarlama altyapısı. İçerik
JS~0 ve GEO/curl korunur (Korunacaklar geçerli); dil serbestisi yukarıdaki
DİL NOTU'na tabidir.

- ZİNCİR (üç halka): (1) **İlgilendirme** — sektör kapısı/persona sayfası
  ziyaretçiyi "bu beni ilgilendiriyor" noktasına getirir. (2) **Ciddileştirme**
  — risk bloğu + ceza/yaptırım içeriği + SABİT son-tarih ("Son başvuru:
  27 Aralık 2029" gibi) aciliyet verir. (3) **Yol gösterme** — "ilk adımlar" +
  rehber/vaka çapraz bağları + iletişim bloğu (tel/e-posta; form ayrı karar).
- SEKTÖR KAPILARI: persona kart ızgaralı giriş sayfası (rota adı kullanıcı
  onaylı: /kim/, /durumum/, /yukumluluk/ havuzu) + persona sonuç kalıbı.
  Kaynak: data/lead/persona.json (Ek-1/Ek-2 NACE + genel personalar).
- RİSK BLOKLARI + CEZA İÇERİĞİ: hükümler [APILEX] — Claude Code hukuki hüküm
  yazmaz; iskelet + veri-tarafı öz-cevaplar üretir, hukuki metin Serdar'ın kalemi.
- "KUYU ÇIKAR MI" — AYRI FAZ olarak tanımlıdır (jeolojik/hidrojeolojik tahmin
  aracı); bu fazın kapsamında değil, ileride ayrı brief.
- PAZARLAMA KANALLARI: bülten (izleme OLAYLAR'dan, ayda ~2), çeyreklik
  "Türkiye Su Raporu" basın servisi, B2B rapor teaser'ı, GBP/yerel SEO
  ("su hukuku avukatı"), GEO nabzı, LinkedIn vaka kartları, webinar programı.
  Her kanal: altyapı/şablon burada; hesap açılışı + ritim kararı kullanıcıda.
Bitti: persona sistemi + sektör kapıları canlı, pazarlama altyapısı (şablon/
iskelet) hazır, GEO/curl/JS~0 kanıtlı; uygulama AŞAMA 1 mock onayı sonrası.

FAZ 8 — PALET YENİLEME (sıralamada Faz 7'den hemen sonra, Faz 2'den önce):
kullanıcı kararı 21.07 — mevcut SU-DİLİ adaçayı-petrol ailesi "yeşilimsi"
bulundu; hedef "canlı ve suya uyumlu" ana palet. **Kapsam: SU-DİLİ ANA
paletin yenilenmesi.** Landing İstisnası (koyu "gece denizi" derin-su)
KORUNUR — paletten muaf, değişmez. Referans-önce: seçim kelime tarifiyle
değil KIYAS KARESİYLE yapılır.
- AŞAMA 0 — KIYAS TURU: TAMAM (2026-07-21). 3 aday (A doygun turkuaz+okyanus /
  B petrol+cyan enjeksiyonu evrimsel / C açık mavi zemin+lacivert devrimsel),
  tam değişken setleri + WCAG AA kontrast tabloları (hepsi geçer) + 4'lü kıyas
  kareleri: `cikti/denetim/faz8-palet/` (RAPOR.md + kareler/ + ham/). Kaynağa
  dokunulmadı; kıyas dist kopyalarında hex remap ile üretildi.
- AŞAMA 1 — SEÇİM (kullanıcıda, KARAR BEKLİYOR): A / B / C / melez. Hiçbir aday
  "önerilen" işaretlenmedi (artı-eksi verildi, seçim kullanıcıda).
- AŞAMA 2 — UYGULAMA (seçim sonrası ayrı iş): DESIGN.md §2 güncellemesi +
  kaynak `:root` uygulaması + tam öz-denetim + Lighthouse korunumu. Landing
  paleti ELLENMEZ.
Bitti: seçilen palet kaynağa uygulanır, DESIGN.md güncellenir, öz-denetim
kanıtlı, Lighthouse tabanları korunur, GEO/JS~0 bozulmaz.

## Açık kararlar (kullanıcıda — KARAR BEKLİYOR)
- /deneyim/: menüye bağlandı (2026-07-21 kullanıcı kararı — KAPANDI).
- src/harita-3d/: arşivde kalır (2026-07-21 kullanıcı kararı — KAPANDI).
- Birleşik panorama: /harita/ hero'ya girmesi (raf).
- Upscale: canlı "yumuşak" kararına bağlı.
- Faz 7 rota adı (/kim/ · /durumum/ · /yukumluluk/) + risk-bloğu dili: AŞAMA 1 mock onayında.

## İşleyiş
Her faz: Fable uygulama briefi (ön-denetimli, düşman geçişli) → kullanıcı
basar → kanıt seti → kullanıcı onayı → sonraki faz. Görsel fazlarda (2-5)
mock onaysız kod yazılmaz. Bu belge fazlar ilerledikçe güncellenir; güncelleme
de brief'le yapılır.
