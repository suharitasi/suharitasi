# Basıma hazır brief taslakları — PAZARLAMA-KAZI.md eki (2026-07-28)

Kaynak: PAZARLAMA-KAZI.md FAZ E. Hiçbiri onaysız uygulanmaz; her taslak
uygulamadan önce brief-denetçisi kapısından geçirilir. Ölçülebilir olmayan
şart yazılmamıştır (brief ön-denetim listesi m.2).

---

## TASLAK-1 — pazarlama bağlam dosyası (E1, hemen/ücretsiz)

═══ BRIEF: PAZARLAMA-BAGLAM.MD — TEK BAĞLAM DOSYASI ═══
Salt-yazı işi; site koduna dokunulmaz. Çıktı: `pazarlama-baglam.md` (depo
kökü). İçerik — dört bölüm, hepsi MEVCUT ölçüm/belgelerden derlenir, yeni
iddia üretilmez:
(a) Konum (Fletch 4-sütun): kategori "Türkiye su verisi + su hukuku portalı";
    kitle 4 persona (PAZARLAMA-KAZI FAZ B); rakip alternatif "avukata sormak /
    DSİ'yi aramak / dağınık Google araması"; farklılaşma "künyeli resmî veri
    + hukuk tek yerde" — her sütun tek cümle.
(b) Kanıtlı sayı havuzu: FAZ C tablosundaki 7 satır + build'de sayılan
    değerler (kaynak dosya yolu ile) — metin yazan herkes (insan/model)
    sayıyı BURADAN alır, akıldan yazmaz.
(c) Ton: "bilgilendirme portalı" + dürüstlük etiketi ilkeleri (uydurma yasağı,
    veri-yok beyanı).
(d) Sen/siz kararı: mevcut site dili ölçülür (örneklem 10 sayfa), bulunan
    kullanım yazılır.
BİTTİ: dosya var; (b)'deki her sayının yanında kaynak yolu; brief-denetçi
UYARI 0. Commit+push.
═══

## TASLAK-2 — "Neden bu site?" otorite bölümü (E2)

═══ BRIEF: NEDEN-BU-SITE BÖLÜMÜ ═══
Hedef: FAZ C'nin 7 kanıtlı iddiasını TOPLU anlatan tek yüzey. İki seçenek
(karar kullanıcıda, uygulama tek birini alır):
(i) /hakkinda/ sayfasına "Bu sitede başka yerde olmayan ne var?" H2 bölümü;
(ii) ayrı sayfa /neden-bu-site/ (sitemap+llms otomatik).
Kurallar: her iddia cümlesi FAZ C tablosundaki ölçülen sayıyı taşır ve sayı
build anında veriden SAYILIR (kapi.js deseni; sabit sayı yazılmaz — baraj
arşivi gibi büyüyen sayılar bayatlamaz). Baraj arşivi satırı 90 günden önce
"başka yerde yok" İDDİASI taşımaz, yalnız mevcut gün sayısını söyler.
Tasarım: mevcut içerik dili; yeni desen yok. Öz-cevap + soru-H2 zorunlu.
BİTTİ: build temiz · iddia cümlesi = veri alanı eşlemesi tablo halinde
raporda · sayfa/bölüm canlıda · taban-gerileme 0. Görsel iş → İş kapanış
kuralı: KULLANICI ONAYI BEKLİYOR etiketiyle kapanır.
═══

## TASLAK-3 — B2B kurumsal rapor kapısı (K4)

═══ BRIEF: /kurumsal-rapor/ SAYFASI — TEKLİF KAPISI (PAYWALL DEĞİL) ═══
ÖN KOŞUL (kullanıcıdan): (1) örnek rapor kapsam kararı — hangi il/havza,
hangi katmanlar; (2) fiyat/iletişim modeli (sayfaya fiyat yazılıp
yazılmayacağı dahil); (3) [SERDAR-HUKUK] içerik onayı.
Sayfa: soru-H1 ("Bölgeniz için su raporu mu lazım?") · öz-cevap · neyi
içerdiği (FAZ C varlıklarından, künyeli) · örnek rapor görseli/özeti ·
talep kanalı (mevcut mailto deseni; form altyapısı ayrı karar) · dürüstlük
şerhi (rapor = veri derlemesi + hukuki çerçeve; hukuki görüş şartları).
Hiçbir mevcut sayfa kapanmaz (1. öncelik korunur).
BİTTİ: sayfa canlı · menü "Veriler"e tek kayıt · iç link kırık 0 ·
taban-gerileme 0. DUR: yayın önü kullanıcı onayı.
═══

## TASLAK-4 — bülten açılışı (K5; ön koşul kullanıcıda)

═══ BRIEF: SU BÜLTENİ AÇILIŞI ═══
ÖN KOŞUL: Buttondown hesabı (kullanıcı; SIRADAKILER m.22 — form kodu HAZIR,
src/data/bulten.ts'ye kullanıcı adı yazılınca açılır).
İş: (1) bulten.ts doldur; (2) form yüzeyleri: rehber sonları + /nerede-su-
cikar/ + il sayfaları (karar: hangi yüzeyler — kullanıcı seçer); (3) KVKK
aydınlatma metni [SERDAR-HUKUK onayı]; (4) ilk sayı iskeleti: "bu ay suda ne
değişti" = RG yeni kayıtlar (rg-nobetci çıktısı) + baraj özeti + kanun
takibi — TAMAMI mevcut veriden.
BİTTİ: form canlıda çalışır (test aboneliği ölçülür) · JS'siz fallback ·
konsol 0 · taban-gerileme 0.
═══

## TASLAK-5 — ham veri indirme (K3; hendek kararı ÖNCE)

═══ BRIEF: VERİ İNDİRME KATMANI — KARAR OTURUMU GEREKLİ ═══
UYGULAMA BRIEFI DEĞİL, KARAR ÇERÇEVESİ (altyapıda hızlı/iddiada yavaş değil
ama hendek kararı stratejik — kullanıcı oturumu ister):
Soru: 472 kütle / RG 419 / GRACE serisi CSV+JSON olarak indirilebilir olsun mu?
LEHTE: otorite+backlink (M4F Free-Tool bulgusu) · Persona-4 kopma noktası ·
atıf artışı → 1. gelir ayağı. ALEYHTE: toplu kopyayı kolaylaştırır —
kopyalanma direnci m.3'le gerilim; ANCAK ilke metni "asıl direnç veri arşivi
+ otorite" der, kod gizleme ikincildir; indirme = CC-BY benzeri atıf şartlı
lisansla verilebilir. ARA YOL: örneklem açık (tek il/tek havza CSV), tam set
e-posta kapılı (taslak-4 ile birleşir) veya B2B (taslak-3).
KARAR KULLANICIDA. Karar çıkarsa uygulama briefi ayrıca yazılır.
═══

## TASLAK-6 v2 — /arac/il-rejimi/ → /ilimde-kim-yetkili/ (K2) — BASIMA HAZIR

(v1'in "envanter ölçülür" şartı kapandı; ölçüm 28.07, dist @ 9b826ad —
ayrıntı: rapor/hazirlik-mobil-ve-slug.md §2.)

═══ BRIEF: URL TAŞIMA — TEK ROTA ═══
Ölçülen envanter [VERİ]: link 174/175 sayfada, 522 geçiş; kaynak 4 dosya
(anasayfa-v2.js:122 VERI_ROTALARI · AltBilgi.astro:25 · kuyu-ruhsati/
index.astro:23 · IlKurumTablosu.astro:48) + 2 yorum (Sayfa.astro:45,
il-profil.js:2) + rota dosyası src/pages/arac/il-rejimi.astro.
FAZ 1 (worktree): (a) rota dosyası src/pages/ilimde-kim-yetkili.astro'ya
taşınır — yeni slug KÖKTE, /arac/ bölümü (tek üyeydi) tümden boşalır;
H1 soru biçimine döner ("İlimde su işinden kim yetkili?"), sayfa TEK soruya
cevap verir; (b) 4 dosyadaki link + 2 yorum güncellenir; (c) public/
_redirects'e İKİ satır (tam-yol deseni, /deneyim emsali):
  /arac/il-rejimi   /ilimde-kim-yetkili/   301
  /arac/il-rejimi/  /ilimde-kim-yetkili/   301
(d) izleme/beklenen-301.json'a çift eklenir (md3 sürekli doğrular —
SÜREKLİLİK); (e) Sayfa.astro bolumAdlari'ndaki ölü 'arac' girişi temizlenir.
Kurallar: /nerede-su-cikar/ otoritesi bölünmez (kapıdan yeni link EKLENMEZ);
sitemap/llms otomatik; çekirdek-set değişikliği GEREKMEZ (ölçüldü: rota
sette yok).
BİTTİ (hepsi ölçülebilir): build 0 · iç link kırık 0 (175 sayfa taraması) ·
canlıda /arac/il-rejimi/ → 301 → /ilimde-kim-yetkili/ → 200 zinciri ·
site-saglik md3 yeni çifti YEŞİL doğrular · taban-gerileme: sitemap'te
kayıp yalnız eski rota, yeni rota eklenmiş · GSC: eski URL'nin "sayfa
yönlendirme içeriyor" durumu HATA SAYILMAZ; 4-6 hafta sonra Performans
raporu kontrol notu SIRADAKILER'e yazılır. Kullanıcı hızlandırıcısı
(isteğe bağlı, panel): URL Denetimi → yeni URL için indeksleme iste.
═══

## TASLAK-7 — mobil ana sayfada derdi-adlandıran soru (E4; görsel iş)

═══ BRIEF: MOBİL İLK EKRAN — TEK SORU KANCASI ═══
Bulgu [VERİ]: 375'te ilk ekranda uçuşan soru yok; ilk tıklanabilir hedef
534px'te CTA. Persona-1'in en güçlü kancası ("Ruhsatsız kuyu cezası aldım,
ne yapmalıyım?") kaydırma altında.
İş: mobil kırılımda hero'ya TEK soru satırı (mevcut SORULAR_V2'den, yeni
metin yok) ilk ekrana alınır — tasarım kararı DESIGN.md'ye bağlı, v0/emil
düzeni bozulmaz; hangi sorunun seçileceği + yerleşim MOCK ile sunulur.
SIRA: mock → kullanıcı onayı → uygulama (İş kapanış kuralı; ana sayfa görsel
işi = pilot kanıt + canlı onay). Ölçü: 375 ilk ekranda tıklanabilir soru ≥1 ·
CLS/LH mobil gerilemez (3 tur medyan) · taşma 0.
═══
