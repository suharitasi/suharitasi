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
