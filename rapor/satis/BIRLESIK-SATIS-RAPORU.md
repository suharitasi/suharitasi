# BIRLESIK-SATIS-RAPORU.md — indirme paketi

Üç denetim, içerik DEĞİŞTİRİLMEDEN ayraçla birleştirildi (satis briefi
FAZ 3). Raporlar birbirinden bağımsızdır; çelişkiler bilinçli olarak
uzlaştırılmamıştır. UYGULAMA YOK — tüm öneriler karar bekler.

═══════════════════════════════════════════════════════════════════
═══ 1 / 3 — marketingskills ═══════════════════════════════════════
═══════════════════════════════════════════════════════════════════

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

═══════════════════════════════════════════════════════════════════
═══ 2 / 3 — copy-that-sells ═══════════════════════════════════════
═══════════════════════════════════════════════════════════════════

# 02 — copy-that-sells (avectats7) denetimi

**Kullanılan skill dosyaları:** `~/.claude/skills/copy-that-sells/SKILL.md`
(v2.0.3) · `references/frameworks.md` (4 U's, Schwartz farkındalık
düzeyleri, Bly'ın 8 başlık kategorisi) · `references/diagnostics.md`
(mevcut metin yapıştırıldığında zorunlu prosedür) · `references/self-edit.md`
+ `scripts/validate.py` (otomatik kontrol).
**Uygulanan çerçeve:** DIAGNOSTIC MODE — skill'in kendi kuralı: "kullanıcı
tek cümle bile mevcut metin verdiyse önce taze yazma; teşhis et." Girdi
mevcut canlı metin olduğundan tüm sayfalar tanı biçiminde işlendi:
**Diagnosis → Severity and recommendation → The fix → What this teaches.**
Şip edilebilir metin skill kuralı gereği blockquote (`>`) içindedir.
**Skill'in istediği ama eksik girdiler (brief'in 8 maddesinden):** dönüşüm
sayıları yok (madde: "get the numbers") · ses rehberi yok → skill kuralına
göre seçim beyan edilir: **Voice 1 (dry confident)** esas alındı, sitenin
mevcut ölçülü-nesnel tonuyla uyumlu olduğu için.

---

## Sayfa 1 — Ana sayfa hero'su

Okur farkındalık düzeyi: karışık trafik; kuyu/ceza derdiyle gelen **Level 2
(problem-aware)** çoğunlukta varsayıldı [VARSAYIM — ölçüm yok].

### Diagnosis
> Mevcut H1: "Suyla İlgili Her Hukuki Mesele Tek Bir Uzmanda"

4 U's puanı: Useful ✓ (zar zor — fayda ima ediliyor) · Urgent ✗ · Unique ✗
(**rakip imza testi: herhangi bir hukuk bürosu bu başlığın altına kendi
logosunu koyabilir**) · Ultra-specific ✗ (sayı yok, isim yok, sonuç yok).
Skor: **1/4.** Billboard testi: tek başına bir panoda "hangi mesele? kimin
uzmanı?" sorusunu cevaplamaz. Fikir katmanında sorun: başlık bir FİKİR değil
konum beyanı; okurun yürüyüp gideceği bir inanç bırakmıyor.
Alt metin ise 4 U's'un Ultra-specific şartını fazlasıyla karşılıyor
(25 havza, 81 il, 42 sektör, 20 işlem, 10 rehber) — **kanıt başlıkta değil,
gövdede saklanmış.** Schwartz eşlemesi: problem-aware okura Question ya da
Direct başlık gerekir; mevcut başlık kimlik beyanı (kategori: hiçbiri).

### Severity and recommendation
Orta-yüksek. Karar: **Restructure** (burn-down değil — gövde ve sorular
sağlam, başlık katmanı zayıf).

### The fix
Bly kategorilerinden en az iki farklıdan alternatif (skill kuralı; tüm
sayılar sitede doğrulanmış):

Question (problem-aware'e doğal):
> Kuyunuz için ruhsat mı lazım, ceza mı geldi?

Direct + Ultra-specific:
> Türkiye'nin su verisi ve su hukuku tek yerde: 25 havza, 81 il, tek uzman.

Reason-why türevi:
> 472 yeraltı suyu kütlesini il il bilen bir avukatla konuşun.

Uçuşan altı soru DOKUNULMASIN — bu sayfanın en iyi metni onlar; okurun
kafasındaki cümleyle açılıyorlar (voice-of-customer madenciliğinin sitede
kendiliğinden yapılmış hali).

CTA çifti için mirror testi: başlık "mesele/uzman" vaat ediyor, düğme
"Ücretsiz Ön Görüşme Alın" diyor — uyum makul; ama mikro-metin eksik.
Skill'in düğme-altı kalıbından (risk reversal):
> Ödeme bilgisi istenmez; ilk değerlendirme ücretsizdir.
[Şerh: "ödeme bilgisi istenmez" sitede yazılı bir taahhüt olarak
doğrulanmadıysa YAYIMLANMADAN önce site sahibi teyit etmeli —
[DOĞRULANMAMIŞ — kullanılamaz] etiketiyle bırakılmıştır.]

### What this teaches
Kanıtın yeri başlıktır. Site kanıt zengini, başlık kanıt fakiri; ters
çevrilirse rakip-imza testi kendiliğinden geçilir.

---

## Sayfa 2 — /nerede-su-cikar/

### Diagnosis
> H1: "Nerede su çıkar?"

Question kategorisi, okurun aradığı sorgunun kendisi — **4 U's: Useful ✓,
Unique ✓ (cevabı veriyle veren tek yer iddiası sayfada kanıtlanıyor),
Ultra-specific başlıkta ✗ ama hemen altındaki öz-cevapta ✓✓.** Billboard
testi: başlık + il seçici tek ekranda işi anlatıyor. Skill gözüyle bu sayfa
**doğru kurulmuş bir how-to/soru sayfası**; teşhis edilecek büyük kusur yok.

### Severity and recommendation
Düşük. Karar: **Edit** (Layer 1 — küçük rötuşlar).

### The fix
Öz-cevap cümlesi uzun tek nefes; sesli okuma testinde bir nefeste bitmiyor
(skill kuralı: bitmiyorsa böl). Mevcut sayılarla bölünmüş hâli:
> Nerede su çıkar? Cevap il il, resmî veriyle: 12 havza planından 472
> yeraltı suyu kütlesi, 347'si il sınırına eşlendi. 1963'ten bu yana 419
> Resmî Gazete kaydı tarandı. İlinizi seçin.

### What this teaches
Soru-başlık + veri-öz-cevap kalıbı, farkındalığı düşük okuru tek ekranda
Level 4'e taşıyor; sitenin diğer sayfalarına da örnek desen.

---

## Sayfa 3 — /kuyu-ruhsati/manisa/

### Diagnosis
Başlık "Kuyu ruhsatı — Manisa": Direct, arama diliyle birebir; işini
yapıyor. Gövde soru-H2'lerle akıyor ("slippery slope" bozulmamış). Kusur
satış katmanında: sayfa okuru "Belge süreci nasıl işler?" cevabına kadar
taşıyıp orada bırakıyor — **teklif geçidi yok** (Offer Pass: "brief'te
tekliften eser yoksa bunu söyle"). Sayfada teklif, garanti, sonraki adım
cümlesi yok; tek CTA menüde.

### Severity and recommendation
Orta. Karar: **Edit** — tek paragraf eklemesi, yapı bozulmadan.

### The fix
Süreç bloğu sonuna, ölçülü seste tek satır (komut kategorisi, yumuşak):
> Bu süreci kendiniz yürütebilirsiniz; vekaletle yürütülmesini isterseniz
> ilk görüşme ücretsizdir.
Dürüst aciliyet YOK ve UYDURULMAMALI (skill: "invented urgency burns the
brand") — bu sayfada aciliyet cümlesi önerilmiyor.

### What this teaches
Bilgi sayfası satış sayfası değildir ama satışa kapı açan TEK cümleyi hak
eder; kapı yoksa okur bilgiyle gider, ilişki başlamaz.

---

## Sayfa 4 — /rehberler/kuyu-ruhsati/

### Diagnosis
> Öz-cevap: "Su temini için kuyu açmadan önce DSİ'den belge şart (167 s.K.
> m.8). Üç belge: arama, kullanma, ıslah-tadil…"

Bu, skill'in aradığı "specificity is the proof" cümlesi — madde numarası,
belge adları, süre, muafiyet tek nefeste. **Sitedeki en iyi satış metni bir
rehber özetinde duruyor.** H2'ler soru formunda, Reason-why düzeninde.
Kusur: uzun metin mimarisinde kapanış yok — Bly'ın yedi adımlı mektubunun
son adımı ("tell them what to do") rehberde eksik.

### Severity and recommendation
Düşük-orta. Karar: **Edit.**

### The fix
Rehber sonuna, içerik diliyle uyumlu kapanış:
> Durumunuz bu rehberdeki hangi adıma denk geliyor bilmiyorsanız, sektörünüzü
> seçin: 42 sektör profili içinden durumunuza en yakın sayfayı görün.

### What this teaches
İyi uzun metin satışı yarıda bırakmaz; son cümle her zaman yön gösterir.

---

## Sayfa 5 — /arsiv/

### Diagnosis
Bu sayfa manifesto malzemesi taşıyor ama görevi liste; satış metni değil.
Skill'in "What This Skill Is Not For" sınırı gereği bu sayfaya satış
rötuşu ÖNERİLMEZ. Tek gözlem: öz-cevap ("Sitedeki sayıların dayandığı 8
veri seti…") 4 U's'tan üçünü taşıyor; olduğu gibi kalmalı.

### Severity and recommendation
Yok. Karar: dokunma.

---

## Sayfa 6 — /hangi-kurum/

### Diagnosis
> H1: "Su işimde hangi kuruma gideceğim?"

Question kategorisi, okurun kelimeleriyle. Tablo = kanıt. Kusur ana
sayfayla aynı ailede: aracı kullanan okurun bir sonraki cümlesi yazılmamış.

### Severity and recommendation
Düşük. Karar: **Edit** — Manisa'daki tek-satır kapı deseni buraya da.

---

## Notes (skill'in zorunlu bölümü)

- Farkındalık düzeyi: sayfa başına Level 2-4 arası; ana sayfa karışık
  trafiğe yazılıyor, en riskli katman orası.
- İş yapan çerçeveler: 4 U's + rakip-imza testi (ana sayfa bulgusunun
  kaynağı), Offer Pass (il/rehber bulguları), sesli okuma testi (öz-cevap).
- Ses: Voice 1 (dry confident); site tonu bunu zaten konuşuyor, öneriler
  aynı seste yazıldı.
- Ölçülen uzunluklar: önerilen ana sayfa başlıkları 43 / 71 / 58 karakter;
  Manisa kapı cümlesi 104 karakter (ölçüldü, tahmin değil).
- Doğrulanması istenen iddialar: düğme-altı "ödeme bilgisi istenmez"
  satırı [DOĞRULANMAMIŞ — kullanılamaz] etiketiyle bekliyor. Önerilen tüm
  sayılar (25/81/42/472/347/419/12/1963) sitede yayımlı, doğrulanmış.
- Yasaklı-kelime kontrolü: temiz (skill kuralı gereği liste verilmez).
- `scripts/validate.py` koşuldu (yalnız yerel dosya okur; ağ erişimi yok —
  güvenlik kapısından geçti). Ölçülen sonuçlar: "Nerede su çıkar?" →
  Anti-AI 9/10, uzunluk PASS (3 kelime), specificity FAIL (sayı yok — bu
  başlıkta bilinçli: sayılar öz-cevapta). Önerilen Direct başlık → 9/10,
  specificity PASS, uzunluk FAIL (14 kelime > 12 tavanı; bilinçli tercih —
  billboard değil hero başlığı). Question önerisi → 9/10, uzunluk PASS.
  Şerh: kalıp listesi İngilizce/İspanyolca; Türkçe satırlarda yasaklı-kalıp
  isabeti beklenmez, skor uzunluk/özgüllük sinyali olarak okundu.

*Bu rapor yalnız copy-that-sells çerçevesiyle yazılmıştır; başka denetim
raporlarına bakılmamıştır.*

═══════════════════════════════════════════════════════════════════
═══ 3 / 3 — direct-response ═══════════════════════════════════════
═══════════════════════════════════════════════════════════════════

# 03 — claude-code-copywriting-skills (Rob Palmer) denetimi

**Kullanılan skill dosyaları:** `~/.claude/skills/copychief/SKILL.md`
(inceleme prosedürü ve çıktı biçimi — bu raporun iskeleti) ·
`~/.claude/skills/direct-response-copy/SKILL.md` (594 satır; başlık
formülleri, So-What zinciri, acı niceleme, CTA tablosu, Schwartz/Hopkins/
Ogilvy/Halbert/Caples/Sugarman/Collier çerçeveleri) ·
`~/.claude/skills/landing-page-copy/SKILL.md` (üç-paragraf çerçevesi,
mekanizma) · `~/.claude/skills/compliance-checker/SKILL.md` (9 maddelik
uyum farkındalığı).
**Uygulanan çerçeve:** copychief'in dört adımı — Piece Classification →
Big Picture Assessment (6 öğe) → Line-Level Review (Location → Issue →
Fix → Principle) → The Verdict (skor + ilk 3 değişiklik + işleyenler +
kill list).
**Girdi:** 6 canlı sayfanın HTML'i + 12 kare (`cikti/denetim/satis/`).

---

## Piece Classification

- **Type:** İçerik ağırlıklı otorite sitesi; ana sayfa = hizmet landing'i,
  gerisi bilgi/araç sayfaları. VSL yok, e-posta dizisi yok, funnel tek
  adım: sayfa → mailto.
- **Funnel position:** Cold-to-warm organik trafik; retargeting/upsell
  katmanı yok.
- **Target market:** Kuyu/ruhsat/ceza derdi olan işletme ve arazi
  sahipleri + kurumsal veri arayanlar. Farkındalık: çoğunluk Level 2-3
  (problem/solution-aware) — sorunla arama motorundan geliyorlar.
- **Mechanism:** "Resmî veriyi il il işleyip hukukla birleştiren tek
  portal" — mekanizma GERÇEK ve kanıtlı (472 kütle, 419 RG kaydı, 155
  kurum) ama hiçbir sayfada mekanizma OLARAK adlandırılmıyor.

## Big Picture Assessment

1. **Big Idea / Hook:** Ana sayfa H1 kimlik cümlesi; bar-stool testi
   (Carlton) — barda anlatınca "eee?" dedirtir: "her hukuki mesele tek
   uzmanda" bir hikâye değil. Oysa sitenin elinde bar-stool-ready malzeme
   VAR: "1963'ten beri Resmî Gazete'de çıkmış her kuyu sahası ilanını
   taradık." Bu cümle hook'tur; sitede başlık olarak hiç kullanılmamış.
2. **Lead:** Uçuşan sorular pattern-interrupt olarak İYİ çalışıyor —
   Halbert'in "okurun kafasındaki konuşmaya gir" kuralının doğru
   uygulaması. Mobilde ilk soru kadraja girmiş; devamı listede.
3. **Mechanism:** Var ama isimsiz (yukarıda). İsimsiz mekanizma
   inandırıcılık kaldıracı olarak çalışmaz.
4. **Offer Stack:** En zayıf katman. Teklif "ücretsiz ön görüşme" —
   doğru ama çıplak: ne süre, ne kapsam, ne sonraki adım tanımlı.
   "Stupid deal" hissi yok; risk reversal cümlesi yok. (Uyum notu:
   hukuk hizmetinde garanti VAADİ zaten verilemez — compliance-checker
   §medical/finansal benzeri kısıtların hukuk karşılığı; burada doğru
   hamle garanti değil, görüşmenin kapsamını somutlamak.)
5. **Close / CTA:** Tek kapanış var (hero); sayfa sonlarında ikinci
   kapanış yok. Sugarman'ın kaydırağı il/rehber sayfalarında bilgiyle
   sonlanıyor, satışa dönmüyor.
6. **Emotional Throughline:** Sayfalar rasyonel hatta akıyor (veri →
   kurum → süreç). Duygusal an tek yerde: uçuşan sorular. Sonrası hiç
   duyguya dönmüyor — orta bölüm sarkmıyor ama düzleşiyor.

## Line-Level Review

**1. Location:** Ana sayfa H1 — "Suyla İlgili Her Hukuki Mesele Tek Bir
Uzmanda"
**Issue:** İddia genel, kanıtsız ve herkesin kullanabileceği türden;
19,5× kuralının (aynı ürün, farklı başlık) kaybedilen tarafında duruyor.
**Fix (master formula: eylem + somut sonuç + kontrast):**
> "Kuyunuzun ilindeki 472 kütleden hangisinde olduğunu bilen avukatla
> konuşun — tahminle değil, resmî veriyle."
(Tüm sayılar sitede doğrulanmış; rakam uydurulmamıştır.)
**Principle:** Ogilvy/Rolls-Royce — sıfat değil olgu; specificity headline.

**2. Location:** Ana sayfa alt metin — "Portalda 25 havza, 81 il, 42
sektör profili, 20 su işlemi, 10 rehber var."
**Issue:** Beş sayı tek nefeste = envanter listesi; So-What zinciri ilk
katmanda duruyor (sayı → ne işine yarar → ne hissettirir katmanları yok).
**Fix:**
> "İliniz, sektörünüz, işleminiz: üçü için de cevap burada. 81 il, 42
> sektör, 20 işlem — aramaya son."
**Principle:** So-What chain — sayı değil sonuç satar; Sugarman ritim
kuralı (kısa cümle, sonra nefes alan cümle).

**3. Location:** /kuyu-ruhsati/manisa/ — "Belge süreci nasıl işler?"
bloğunun sonu.
**Issue:** Momentum killer: bilgi bitiyor, yönlendirme yok; okur kaydıraktan
inip gidiyor.
**Fix:**
> "Bu üç belgeyi kendiniz de yürütebilirsiniz. Vekaletle yürütülsün
> isterseniz ilk görüşme ücretsiz."
**Principle:** Collier'ın 6. şartı (her mektup bir sonraki adımı söyler) +
multiple closes.

**4. Location:** /rehberler/kuyu-ruhsati/ — "Dikkat" bloğu.
**Issue:** Acı var ama nicelenmemiş; "belgesiz açım yasak" soyut risk.
Skill'in acı-niceleme tekniği kullanılabilirdi AMA ceza tutarı sitede
doğrulanmış değil (SIRADAKILER'de "[APILEX teyit]" bekliyor).
**Fix:** [DOĞRULANMAMIŞ — kullanılamaz] — ceza tutarı teyit edilmeden
niceleme yazılamaz. Teyit gelirse kalıp hazır: "Belgesiz kuyunun bedeli:
[tutar]. Belgenin bedeli: bir başvuru."
**Principle:** Hopkins — kanıtsız iddia yazılmaz; niceleme ancak gerçek
sayıyla yapılır.

**5. Location:** /nerede-su-cikar/ öz-cevap.
**Issue:** Yok denecek kadar az — bu blok skill'in "specific result
opening" tarifine zaten uyuyor. Tek rötuş: kapanışta yönlendirme cümlesi
komut kipinde güçlenir.
**Fix:**
> "İlinizi seçin; kütleleri, kayıtları ve muhatap kurumu tek sayfada görün."
**Principle:** Command CTA; benefit-descriptive düğme dili.

**6. Location:** Site geneli — düğme altı boşluk.
**Issue:** Friction-reducer kalıbı ([risk] + [sosyal kanıt] + [hız])
hiçbir CTA'da yok. Sosyal kanıt sayısı (müvekkil/görüşme adedi) sitede
doğrulanmış değil → o parça kullanılamaz.
**Fix (yalnız doğrulanmış parçalarla):**
> "İlk görüşme ücretsiz · e-postayla, 2 dakikada"
[Şerh: "2 dakikada" ölçülmüş bir vaat değil — [DOĞRULANMAMIŞ —
kullanılamaz]; kalan iki parça kullanılabilir.]
**Principle:** CTA-altı sürtünme düşürücü; uydurulamayan parça atlanır.

**7. Location:** /hangi-kurum/ H1 "Su işimde hangi kuruma gideceğim?"
**Issue:** Yok — question headline, hedef kitle diliyle; skill bunun
korunmasını söyler.
**Fix:** Dokunma.
**Principle:** "Would ONLY that person stop and read?" testi geçiyor.

## The Verdict

- **Conversion Readiness: 6/10.** Kanıt ve mekanizma malzemesi 9/10;
  teklif katmanı ve kapanışlar 3/10. Ortalamayı bilgi kalitesi taşıyor.
- **Top 3 High-Impact Changes:**
  1. Mekanizmaya isim ver ve ana sayfada başlık katmanına çıkar
     (eldeki gerçek veriyle; yeni iddia gerekmez).
  2. İl + rehber şablonlarına tek-cümle kapanış (multiple closes) —
     82 sayfada çarpan etkisi.
  3. CTA-altı friction-reducer satırı (yalnız doğrulanmış parçalarla).
- **What's Already Working:** Uçuşan sorular (Halbert'in kuralının ders
  kitabı uygulaması) · öz-cevap blokları (specific-result açılışı) ·
  soru-H2 mimarisi (open loop zinciri) · künye disiplini (Hopkins'in
  "reason-why" kanıtı) · dürüstlük etiketleri (disqualification —
  güven inşa eden kendini-sınırlama).
- **Kill List:** Bu sitede kesilecek şişkinlik neredeyse yok; tek aday
  ana sayfa alt metnindeki beş-sayılı envanter cümlesinin mevcut hâli
  (yeniden yazılmalı, silinmemeli). "Copy that sounds like copy" örneği
  yok — sitenin sesi zaten insan.

**Uyum farkındalığı (compliance-checker §9-maddeden ilgili olanlar):**
Kişisel nitelik hedeflemesi yok ✓ · sansasyonel dil yok ✓ · gelir/sonuç
vaadi yok ✓ — hukuk reklam kısıtları bağlamında mevcut ölçülü dil
korunmalı; yukarıdaki tüm öneriler bu tonda yazıldı.

*Bu rapor yalnız claude-code-copywriting-skills çerçevesiyle yazılmıştır;
başka denetim raporlarına bakılmamıştır.*

/home/suha/projeler/suharitasi-satis/rapor/satis/BIRLESIK-SATIS-RAPORU.md · toplam 539 satır
