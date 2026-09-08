// GÖL TÜRÜ YEREL DÜZELTME LİSTESİ (karar-kapatma Faz E, 08.09.2026; karar §B).
// Kaynak JSON (src/data/tr-goller.json) DEĞİŞMEZ; bu liste basım katmanında
// gol-nehir.js insaEt() içinde uygulanır. Yalnız DEPO İÇİ kaynakla DOĞRULANAN
// kayıtlar: DSİ 2024 4.1 (yapımı tamamlanan barajlar) / 4.6 (göletler)
// tablolarında İL + ÖZ-AD birebir eşleşen satır (ilçe adı çakışması SAYILMAZ),
// ya da EPİAŞ Şeffaflık baraj listesi (data/canli/baraj.json). İl farklı /
// yalnız ilçe adı çakışan / hiç isabet olmayan kayıtlar LİSTEYE ALINMAZ —
// sayfada 'kaynak çelişkisi, doğrulanmadı (08.09.2026)' şerhi basılır
// (gol-nehir.js tipCeliskisi). Tür kuralı: DSİ 4.1 → reservoir (baraj gölü) ·
// DSİ 4.6 → pond (gölet) · EPİAŞ → reservoir. Not: OSM'de water=* etiketi
// olmayan yollar arac/fetch_hydro.py:196 ile 'lake' yazılmıştır; 'osm' alanı
// kaynaktaki ham değerdir (null = Natural Earth, tip alanı yok).
// Doğrulama çıktısı: cikti/e-dogrulama.json · rapor/08-09-karar-kapatma.md §E.
export const TIP_DUZELTME = {
  'aladerecam-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "EPİAŞ Şeffaflık baraj listesi (data/canli/baraj.json) — \"ALADERECAM\"" }, // Aladereçam Baraj Gölü
  'altinoluk-baraj-golu': { tip: 'pond', osm: "lake", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Sivas-Yıldızeli Altınoluk Göleti\"" }, // Altınoluk Baraj Gölü
  'arac-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Kastamonu-Araç Barajı\"" }, // Araç Baraj Gölü
  'asagi-tulgali-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Van-Özalp Aşağı Tulgalı Göleti\"" }, // Aşağı Tulgalı Göleti
  'ataturk-baraj-golu': { tip: 'reservoir', osm: null, kaynak: "DSİ 2024 4.1 baraj tablosu — \"Şanlıurfa-Atatürk Barajı\"" }, // Atatürk Baraj Gölü
  'biyikali-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Tekirdağ-Merkez Bıyıkali Göleti\"" }, // Bıyıkali Göleti
  'bozarmut-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Sivas-Kangal Bozarmut Göleti\"" }, // Bozarmut Göleti
  'camurlu-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Şanlıurfa-Siverek Çamurlu Göleti\"" }, // Çamurlu Göleti
  'cogun-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Kırşehir-Çoğun Barajı\"" }, // Çoğun Baraj Gölü
  'degirmenci-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Edirne-Uzunköprü Değirmenci Göleti\"" }, // Değirmenci Göleti
  'esen-1-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "EPİAŞ Şeffaflık baraj listesi (data/canli/baraj.json) — \"ESEN-1\"" }, // Eşen-1 Baraj Gölü
  'fehimli-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Yozgat-Boğazlayan Fehimli Göleti\"" }, // Fehimli Göleti
  'gokce-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Yalova-Gökçe Barajı\"" }, // Gökçe Baraj Gölü
  'golkoy-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Bolu-Gölköy Barajı\"" }, // Gölköy Baraj Gölü
  'hakkibeyli-goleti': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Adana-Sarıçam Hakkıbeyli Barajı\"" }, // Hakkıbeyli Göleti
  'kale-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Bingöl-Karlıova Kale Göleti\"" }, // Kale Göleti
  'keban-baraj-golu': { tip: 'reservoir', osm: null, kaynak: "DSİ 2024 4.1 baraj tablosu — \"Elazığ-Keban Barajı\"" }, // Keban Baraj Gölü
  'kocadere-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Edirne-Keşan Kocadere Göleti\"" }, // Kocadere Göleti
  'kurtbey-goleti': { tip: 'pond', osm: "lake", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Edirne-Uzunköprü Kurtbey Göleti\"" }, // Kurtbey Göleti
  'kuzayca-goleti': { tip: 'pond', osm: "lake", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Yozgat-Şefaatli Kuzayca Göleti\"" }, // Kuzayca Göleti
  'mercan-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Edirne-Keşan Mercan Göleti\"" }, // Mercan Göleti
  'nergizlik-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Adana-Nergizlik Barajı\"" }, // Nergizlik Baraj Gölü
  'samli-goleti': { tip: 'pond', osm: "lake", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Balıkesir-Merkez Şamlı Göleti\"" }, // Şamlı Göleti
  'sarayozu-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Amasya-Sarayözü Barajı\"" }, // Sarayözü Baraj Gölü
  'saribugday-baraj-golu': { tip: 'pond', osm: "lake", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Amasya-Merzifon Sarıbuğday Göleti\"" }, // Sarıbuğday Baraj Gölü
  'sulakyurt-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Kırıkkale-Sulakyurt Barajı\"" }, // Sulakyurt Baraj Gölü
  'yalintas-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Nevşehir-Gülşehir Yalıntaş Göleti\"" }, // Yalıntaş Göleti
  'yapialtin-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Sivas-Yapıaltın Barajı\"" }, // Yapıaltın Baraj Gölü
  'yildizeli-caglayan-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Sivas-Yıldızeli Çağlayan Göleti\"" }, // Yıldızeli Çağlayan Göleti
  // Aşağıdaki 10 kayıt: cikti/e-dogrulama.txt dize çıkarımı kaçırdı, aynı oturumda ham bayt
  // (UTF-16LE SST) aramasıyla il+ad satırı görüldü (rapor §E).
  'ayranci-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Karaman-Ayrancı Barajı\"" }, // Ayrancı Baraj Gölü
  'balkusan-baraji-golu': { tip: 'reservoir', osm: "lake", kaynak: "EPİAŞ Şeffaflık baraj listesi (data/canli/baraj.json) — \"BALKUSAN\"" }, // Balkusan Barajı Gölü
  'camkoy-goleti': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Balıkesir-Çamköy Barajı\"" }, // Çamköy Göleti
  'dirsekli-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Şırnak-İdil Dirsekli Göleti\"" }, // Dirsekli Göleti
  'halilan-goleti': { tip: 'pond', osm: "reservoir", kaynak: "DSİ 2024 4.6 gölet tablosu — \"Diyarbakır-Çermik Halilan Göleti\"" }, // Halilan Göleti
  'karamanli-baraji': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Burdur-Karamanlı Barajı\"" }, // Karamanlı Barajı
  'osmankalfalar-goleti': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Antalya-Korkuteli Osmankalfalar Barajı\"" }, // Osmankalfalar Göleti
  'polat-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Malatya-Polat Barajı\"" }, // Polat Baraj Gölü
  'saribeyler-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Balıkesir-Sarıbeyler Barajı\"" }, // Sarıbeyler Baraj Gölü
  'yahyasaray-baraj-golu': { tip: 'reservoir', osm: "lake", kaynak: "DSİ 2024 4.1 baraj tablosu — \"Yozgat-Yahyasaray Barajı\"" }, // Yahyasaray Baraj Gölü
};
