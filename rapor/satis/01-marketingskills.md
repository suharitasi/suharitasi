# 01 — marketingskills (Corey Haines) denetimi

**Kullanılan skill dosyaları:** `~/.claude/skills/cro/SKILL.md` (v2.0.0, ana
çerçeve) · `~/.claude/skills/copywriting/SKILL.md` (v2.0.1, metin ilkeleri +
CTA formülü) · `~/.claude/skills/offers/SKILL.md` (teklif kontrolü) ·
`~/.claude/skills/marketing-psychology/SKILL.md` (ilke atıfları).
**Uygulanan çerçeve:** CRO'nun 7 boyutlu analiz çerçevesi (etki sırasıyla:
Value Proposition Clarity → Headline → CTA → Visual Hierarchy → Trust
Signals → Objection Handling → Friction) + CRO çıktı biçimi (Quick Wins /
High-Impact Changes / Test Ideas / Copy Alternatives).
**Girdi:** 6 canlı sayfanın HTML'i (curl, 2026-07-28) + 12 kare
(`cikti/denetim/satis/`). Skill'in istediği bağlam dosyası
(`.agents/product-marketing.md`) REPODA YOK — skill "yoksa sor" der;
sormak yerine sayfalardan okunan bağlam kullanıldı ve bu sınır not edildi.

---

## Initial Assessment (skill şablonu)

- **Page Type:** homepage + 3 içerik/araç sayfası + 1 rehber + 1 veri sayfası
- **Primary Conversion Goal:** "Randevu Al" / "Ücretsiz Ön Görüşme Alın"
  (mailto tabanlı iletişim) — sitede form/ödeme yok
- **Traffic Context:** ölçüm aracı yok (site sahibinin beyanına göre Search
  Console kurulu; analytics kurulu değil) → skill'in "current conversion
  rate" sorusu CEVAPSIZ. Bu denetim davranış verisi olmadan, sayfa-içi
  kanıtla yapılmıştır.

---

## 1) Ana sayfa — https://suharitasi.com/

### Value Proposition Clarity (Highest Impact)
5 saniye testi: H1 "Suyla İlgili Her Hukuki Mesele Tek Bir Uzmanda" NE
olduğunu (su hukuku uzmanı) söylüyor; NEDEN FARKLI olduğunu alt metin
taşıyor ("Türkiye'nin 25 su havzası tek portalda… 25 havza, 81 il, 42 sektör
profili, 20 su işlemi, 10 rehber"). Skill'in ölçütüyle: benefit var ama
**differentiation H1'de değil, alt metinde** — sitenin gerçek farkı (veriyle
konuşan hukukçu) başlığa çıkmıyor. "Tek Bir Uzmanda" ifadesi kategori dili;
rakip bir hukuk bürosu da aynı cümleyi kullanabilir.

### Headline Effectiveness
"Get [outcome] without [pain]" kalıbına da, specificity kalıbına da girmiyor.
Sayı yok, zaman yok, somut çıktı yok. Uçuşan sorular (6 adet) mükemmel
"customer language" örneği — skill'in istediği dil TAM OLARAK bu sorularda
("Ruhsatsız kuyu cezası aldım, ne yapmalıyım?") ama H1'de değil.

### CTA Placement, Copy, and Hierarchy
Birincil CTA "Ücretsiz Ön Görüşme Alın" — skill'in Strong CTA tanımına uyar
(action verb + what they get + qualifier: ücretsiz). İkincil "Hizmetleri
İnceleyin" hiyerarşisi doğru. "Randevu Al" (menü) + "Ücretsiz Ön Görüşme
Alın" (hero) aynı hedefe iki farklı etiket — skill bunu tutarlılık sorunu
sayar: aynı eylem her yerde aynı adla çağrılmalı.

### Visual Hierarchy and Scannability
Kanıt bandı ("Cevaplar neye dayanıyor?" — 472/419/155) skill'in "case study
snippets with real numbers" tarifine birebir uyan güçlü bir blok. Kusur:
**fold'un çok altında.** Trust signal, claim'in yanında durmalı; şu an hero
"tek uzman" iddiasını yaparken kanıt üç ekran aşağıda.

### Trust Signals and Social Proof
Var olanlar: gerçek veri sayıları (472/419/155), yazar kimliği (Av. Serdar
Arslan), kaynak künyeleri. OLMAYANLAR: müşteri logosu yok, testimonial yok,
vaka sayısı yok. Skill şablonu testimonial ister; bu sitede doğrulanmış
testimonial YOK → skill önerisi uygulanamaz, uydurulamaz. Mevcut en güçlü
ikame: veri sayıları + künye disiplini (zaten kullanılıyor, yeri zayıf).

### Objection Handling
"Bu bana uyar mı?" itirazını 42 sektör profili (/durumum/) cevaplıyor ama
ana sayfadan bu köprü zayıf görünür durumda değil. "Ne kadara mal olur?"
itirazının cevabı sitede hiç yok (fiyat/süreç beklentisi) — hukuk hizmetinde
normal, ama skill çerçevesinde açık kalem.

### Friction Points
mailto tabanlı iletişim = form yok; skill için düşük sürtünme sayılır ama
mobilde mailto istemci davranışı öngörülemez. Ölçüm önerisi var (aşağıda).

---

## 2) /nerede-su-cikar/

- **Value prop:** öz-cevap bloğu skill'in "answer in 5 seconds" şartını
  sayılarla geçiyor (12 plan / 472 kütle / 347 eşleşme / 419 kayıt). Güçlü.
- **CTA:** sayfanın tek dönüşüm yolu il linkleri — bilgi mimarisi olarak
  doğru; ama sayfa hukuk hizmetine HİÇ köprü kurmuyor. Skill'in blog-CRO
  kuralı: "contextual CTA at natural stopping points." 81 il listesinin
  altı doğal durak; orada hizmet köprüsü yok.
- **Trust:** "Cevap nasıl üretiliyor" 4 katman kartı = örnek alınacak
  objection handling. Bu deseni ana sayfaya taşımak (kanıt bandı zaten
  başladı) doğru yön.

## 3) /kuyu-ruhsati/manisa/ (il şablonu)

- Öz-cevap muhatap kurumu ve havzaları veriyor — value prop net.
- **En büyük CRO açığı:** sayfa "Belge süreci nasıl işler?" diye soruyu
  cevaplıyor ama "bu süreci sizin için yürütelim" teklifi sayfada YOK.
  Tek CTA menüdeki "Randevu Al". Skill: CTA'lar karar anlarında tekrar
  edilmeli — il sayfasının "Belge süreci" bloğu tam bir karar anı.
- 81 il × aynı şablon = bu tek değişiklik 81 sayfada çarpan etkisi yapar.

## 4) /rehberler/kuyu-ruhsati/

- Soru-başlıklı H2 yapısı ("hangi üç belge gerekir?") skill'in scannability
  ölçütünü geçiyor. Dayanak/emsal blokları objection handling işlevi görüyor.
- Blog Post CRO kuralı gereği eksik: içerikle eşleşen bağlamsal CTA.
  "Belgesiz açım yasak" cümlesinin geçtiği yerde risk anı doğuyor; oradan
  /durumum/ ya da ön görüşmeye köprü yok.

## 5) /arsiv/

- Amaç dönüşüm değil güven — skill çerçevesinde bu sayfa "trust asset".
  Böyle kalmalı; CTA yığmak yanlış olur. Tek not: sayfaya gelen biri
  "bu veriyi kim derledi?" diye sorar; yazar köprüsü künye şerhinde var,
  yeterli.

## 6) /hangi-kurum/

- Araç net, tablo tam. Skill'in feature-page kuralı: "clear path to
  try/buy" → işlemin muhatabını bulan ziyaretçinin bir SONRAKİ sorusu
  "başvuruyu nasıl yaparım?" — o köprü (ilgili rehbere) tabloda var mı
  kontrol edilmeli; sayfada hizmet köprüsü yok.

---

## Output Format (skill şablonuyla)

### Quick Wins (Implement Now)
1. CTA etiketini tekleştir: "Randevu Al" ve "Ücretsiz Ön Görüşme Alın"
   tek ada insin (öneri: her yerde "Ücretsiz Ön Görüşme").
2. İl sayfası "Belge süreci nasıl işler?" bloğunun sonuna tek satır köprü:
   ör. "Bu süreci vekaletle yürütmek isterseniz: ücretsiz ön görüşme." —
   81 sayfada tek şablon değişikliği.
3. Rehberde "Dikkat" bloğu sonrasına aynı köprü (bağlamsal CTA).

### High-Impact Changes (Prioritize)
1. Kanıt bandını (472/419/155) hero'ya yaklaştır ya da hero alt metnindeki
   sayı yığınını kanıt bandına devredip H1'i farklılaştır.
2. Analytics kur (skill'in ilk sorusu cevapsız kaldı; dönüşüm ölçümü
   olmadan bu önerilerin hiçbiri doğrulanamaz). İlgili skill: analytics.
3. /nerede-su-cikar/ il listesi altına tek bağlamsal köprü.

### Test Ideas
- H1 A/B: mevcut vs veri-öne ("25 havza, 81 il: su hukukunun veriyle
  konuşan adresi" tarzı — sayılar sitede doğrulanmış).
- CTA A/B: "Ücretsiz Ön Görüşme Alın" vs "Durumunuzu Sorun" (mailto
  tıklaması ölçülerek).
- Kanıt bandı konumu: mevcut yer vs hero-sonrası ilk blok.

### Copy Alternatives
H1 için (skill kuralı: 2-3 seçenek + gerekçe; tüm sayılar sitede doğrulanmış):
- A) "Su Hukukunda Cevaplar Veriden: 25 Havza, 81 İl, Tek Uzman" —
  farklılaştırmayı (veri) başlığa taşır; specificity kalıbı.
- B) "Kuyunuz, Ruhsatınız, Cezanız: Su Hukukunun Tek Adresi" — customer
  language (uçuşan soruların dili) başlığa iner; kategori dilinden çıkar.
- C) Mevcut H1 kalır + alt metin ilk cümlesi farklılaştırmayı öne alır —
  en düşük riskli değişiklik.

### Skill'in sorduğu, cevapsız kalan sorular
1. Mevcut dönüşüm oranı ve hedef? (ölçüm yok)
2. Trafik kaynağı dağılımı? (analytics yok)
3. mailto sonrası akış? (e-posta yanıt süreci site dışı)
4. Heatmap/session kaydı? (yok)
5. Daha önce ne denendi? (A/B altyapısı yok)

*Bu rapor yalnız marketingskills çerçevesiyle yazılmıştır; başka denetim
raporlarına bakılmamıştır.*
