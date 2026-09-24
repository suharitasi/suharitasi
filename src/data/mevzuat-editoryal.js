// MEVZUAT EDİTORYAL KATMANI (24.09.2026, P2 Faz 2, Task 4).
//
// Yalnız YÜKSEK NİYETLİ, ölçülmüş araması olan üç madde için editoryal
// başlık + "pratik karşılık" özeti + bağlamsal bağlar. Metinler, maddenin
// RESMÎ metnine birebir dayanır (parafraz); HİÇBİR su tahsisi/ruhsat iddiası
// UYDURULMAZ — bu üç madde su tahsisi değil, aşağıdaki konuları düzenler.
// Bağlayıcı yorum değildir; resmî metin esastır.
const ONAY_NOTU =
  'Bu özet maddenin resmî metnine dayanır; bağlayıcı hukuki yorum değildir. ' +
  'Uygulamada resmî ve güncel metin esastır.';

export const MEVZUAT_EDITORYAL = {
  '5393|Madde 75': {
    seoBaslik: '5393 m.75: Belediye görev alanında iş üstlenmesi',
    h2: '5393 m.75 ne düzenler: belediyenin görev alanında iş üstlenmesi ve iş birliği',
    ozet:
      'Madde, belediyeye — belediye meclisi kararı ve yapacağı anlaşma uyarınca — ' +
      'mahallî idareler ile diğer kamu kurum ve kuruluşlarına ait yapım, bakım, onarım ' +
      've taşıma işlerini bedelli veya bedelsiz üstlenme, ortak hizmet projeleri ' +
      'gerçekleştirme ve bu amaçla kaynak aktarma imkânı verir. Ayrıca kamu kurumu ' +
      'niteliğindeki meslek kuruluşları, kamu yararına çalışan dernekler ve belirli ' +
      'vakıflarla iş birliği öngörülür. Üstlenilen iş, işi yapan kuruluşun tâbi olduğu ' +
      'mevzuata göre sonuçlandırılır.',
    not: ONAY_NOTU,
    baglar: [
      { ad: 'İşlem → yetkili kurum', yol: '/islem-matrisi/' },
      { ad: 'Su hukuku omurga sayfası', yol: '/su-hukuku/' },
      { ad: 'Sektörel izin rehberleri', yol: '/sektor/' },
    ],
  },
  '2886|Madde 17': {
    seoBaslik: '2886 m.17: İhale ilanı ve asgari süreler',
    h2: '2886 m.17 ne düzenler: ihale ilan usulü ve asgari süreler',
    ozet:
      'Madde, ihale konusu işlerin ilanla duyurulmasının usul ve asgari sürelerini ' +
      'düzenler. İhalenin yapılacağı yerde ilk ilan ile ihale günü arası en az 10 gün, ' +
      'son ilan ile ihale günü arası en az 5 gündür; gazete çıkmayan veya internet ' +
      'haber sitesi bulunmayan yerlerde ilan, bu süreler içinde Basın İlan Kurumu ' +
      'İlan Portalında yayımlanır. Diğer şehirlerde yapılacak ve tahmini bedeli ilgili ' +
      'yıl için belirlenen tutarı aşan işlerde ek ilan koşulları öngörülür.',
    not: ONAY_NOTU,
    baglar: [
      { ad: 'Tüm mevzuat maddeleri', yol: '/mevzuat/' },
      { ad: 'Sektörel izin rehberleri', yol: '/sektor/' },
      { ad: 'Su hukuku rehberleri', yol: '/rehberler/' },
    ],
  },
  '6200|Ek Madde 9': {
    seoBaslik: '6200 ek m.9: Arazi toplulaştırmada uygulayıcı kuruluş',
    h2: '6200 ek m.9 ne düzenler: arazi toplulaştırma ve uygulayıcı kuruluş',
    ozet:
      'Madde, arazilerin bozulmasının ve parçalanmasının önlenmesi ile parçalanmış ' +
      'arazilerin tabii özellikleri, kullanım bütünlüğü ve mülkiyet hakları gözetilerek ' +
      'birleştirilip daha işlevsel yeni parseller oluşturulmasını düzenler; parsellerin ' +
      'kullanım şekilleri arazi özellikleri ve alanı değerlendirilerek belirlenir. Arazi ' +
      'toplulaştırma ve tarla içi geliştirme hizmetlerinde DSİ uygulayıcı kuruluştur; ' +
      'DSİ dışındaki kurum ve kuruluşlar bu hizmetleri DSİ’nin iznine tabi olarak proje ' +
      'idaresi sıfatıyla yürütebilir.',
    not: ONAY_NOTU,
    baglar: [
      { ad: 'Su havzaları', yol: '/havzalar/' },
      { ad: 'Su hukuku rehberleri', yol: '/rehberler/' },
      { ad: 'Tüm mevzuat maddeleri', yol: '/mevzuat/' },
    ],
  },
};
