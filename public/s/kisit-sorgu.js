// kisit-sorgu.js — /kuyu-kisit-sorgu/ paneli (13.09.2026).
// İl seçilince: DSİ bölge/havza/su idaresi + o ile ait RG kayıtları.
// Kayıtlar /kisit.json'dan (build-time) çekilir; sınıflama üretilmez.
(function () {
  'use strict';
  var sec = document.getElementById('ks-il');
  var bilgi = document.getElementById('ks-bilgi');
  var durum = document.getElementById('ks-durum');
  var tablo = document.getElementById('ks-tablo');
  var tbody = tablo ? tablo.querySelector('tbody') : null;
  var illerEl = document.getElementById('ks-iller');
  var belgeBtn = document.getElementById('ks-belge');
  if (!sec || !bilgi || !tablo || !tbody) return;

  // B2B durum belgesi (v7.0 · spec 4.2): son seçili il ve kayıtları saklanır.
  var sonIl = '';
  var sonKayitlar = [];

  var ilBilgi = {};
  try { ilBilgi = JSON.parse(illerEl.textContent); } catch (e) { ilBilgi = {}; }

  var kayitlar = null;
  var yukleniyor = fetch('/kisit.json', { cache: 'force-cache' })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (d) { kayitlar = Array.isArray(d) ? d : []; })
    .catch(function () { kayitlar = []; });

  function kacir(s) {
    return (s || '').replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function kapatma(d) { return /kapatma|kısıt|kisit/i.test(d || ''); }

  function ciz() {
    var il = sec.value;
    if (!il) {
      bilgi.hidden = true; tablo.hidden = true;
      if (belgeBtn) belgeBtn.hidden = true;
      durum.textContent = 'Bir il seçin; o ile ait resmî kayıtlar burada listelenir.';
      return;
    }
    var b = ilBilgi[il] || {};
    var bolge = (b.bolgeler || []).map(function (x) { return x.no + '. Bölge (merkez: ' + x.merkez + ')'; }).join(' · ') || 'veri yok';
    var havza = (b.havzalar || []).map(function (x) { return x.ad; }).join(' · ') || 'veri yok';
    bilgi.innerHTML =
      '<dl>' +
      '<div><dt>DSİ bölge müdürlüğü</dt><dd>' + kacir(bolge) + '</dd></div>' +
      '<div><dt>Havza</dt><dd>' + kacir(havza) + '</dd></div>' +
      '<div><dt>Su ve kanalizasyon idaresi</dt><dd>' + kacir(b.suIdaresi || 'açık kayıt yok') + '</dd></div>' +
      '</dl>';
    bilgi.hidden = false;

    var ilk = (kayitlar || []).filter(function (r) { return (r.il || []).indexOf(il) !== -1; });
    tbody.innerHTML = ilk.map(function (r) {
      var d = kapatma(r.durum) ? '<span class="ks-kapatma">' + kacir(r.durum) + '</span>' : kacir(r.durum);
      var link = r.kaynak ? '<a href="' + kacir(r.kaynak) + '" target="_blank" rel="noopener">Resmî Gazete</a>' : '—';
      return '<tr><td>' + d + '</td><td>' + kacir(r.tarih) + '</td><td>' + kacir(r.saha) + '</td><td>' + link + '</td></tr>';
    }).join('');
    tablo.hidden = ilk.length === 0;
    sonIl = il; sonKayitlar = ilk;
    if (belgeBtn) belgeBtn.hidden = ilk.length === 0;
    var kapatmaSayi = ilk.filter(function (r) { return kapatma(r.durum); }).length;
    durum.textContent = ilk.length
      ? (il + ': ' + ilk.length + ' resmî kayıt' + (kapatmaSayi ? ' · ' + kapatmaSayi + ' tahsise kapatma/kısıt' : '') + '.')
      : (il + ' için il eşlemesi doğrulanmış Resmî Gazete kaydı bulunamadı (yokluk kanıt değildir).');
  }

  // — B2B parsel bazlı akifer ve hukuki kısıt durum belgesi (yazdır/PDF) —
  // Yalnız yayımlı RG kayıtları + il künyesi; resmî sınıflama URETILMEZ.
  function belgeOlustur() {
    if (!sonIl) return;
    var b = ilBilgi[sonIl] || {};
    var bolge = (b.bolgeler || []).map(function (x) { return x.no + '. Bölge (merkez: ' + x.merkez + ')'; }).join(' · ') || 'veri yok';
    var havza = (b.havzalar || []).map(function (x) { return x.ad; }).join(' · ') || 'veri yok';
    var satirlar = sonKayitlar.map(function (r) {
      var d = kapatma(r.durum) ? '<strong>' + kacir(r.durum) + '</strong>' : kacir(r.durum);
      var link = r.kaynak ? '<a href="' + kacir(r.kaynak) + '">Resmî Gazete</a>' : '—';
      return '<tr><td>' + d + '</td><td>' + kacir(r.tarih) + '</td><td>' + kacir(r.saha) + '</td><td>' + link + '</td></tr>';
    }).join('');
    var tarih = new Date().toLocaleDateString('tr-TR');
    var html = '<!doctype html><html lang="tr"><head><meta charset="utf-8">'
      + '<title>Akifer ve hukuki kısıt durum belgesi — ' + kacir(sonIl) + '</title>'
      + '<style>body{font:14px/1.5 system-ui,sans-serif;color:#1a1a1a;margin:2.2rem;max-width:52rem}'
      // Filigran (04.10.2026 §55): PDF/yazdırma çıktısında marka.
      + 'body::before{content:"suharitasi.com Tarafından Üretilmiştir";position:fixed;top:50%;left:50%;'
      + 'transform:translate(-50%,-50%) rotate(-32deg);font:600 1.6rem/1 ui-monospace,monospace;'
      + 'color:rgba(26,26,26,.10);letter-spacing:.06em;white-space:nowrap;pointer-events:none;z-index:9999;'
      + '-webkit-print-color-adjust:exact;print-color-adjust:exact}'
      + 'h1{font-size:1.5rem;margin:0 0 .3rem}h2{font-size:1rem;margin:1.4rem 0 .4rem}'
      + 'table{width:100%;border-collapse:collapse;font-size:.85rem;margin-top:.4rem}'
      + 'th,td{text-align:left;vertical-align:top;padding:.4rem .5rem;border-bottom:1px solid #ccc}'
      + 'th{border-bottom:2px solid #333}dt{font-weight:600}'
      + '.kaynak{margin-top:1.6rem;font-size:.8rem;color:#555}'
      + '.uyari{margin-top:1rem;padding:.6rem .8rem;border-left:3px solid #b8860b;font-size:.85rem}'
      + '.kurumsal-imza{margin-top:1.4rem;padding-top:.7rem;border-top:1px solid #999;font-size:.82rem;color:#333}'
      + '@media print{@page{margin:1.4cm}}</style></head><body>'
      + '<h1>Parsel Bazlı Akifer ve Hukuki Kısıt Durum Belgesi</h1>'
      + '<p>İl: <strong>' + kacir(sonIl) + '</strong> · Belge tarihi: ' + tarih + '</p>'
      + '<h2>İdari çerçeve</h2><dl>'
      + '<div><dt>DSİ bölge müdürlüğü</dt><dd>' + kacir(bolge) + '</dd></div>'
      + '<div><dt>Havza</dt><dd>' + kacir(havza) + '</dd></div>'
      + '<div><dt>Su ve kanalizasyon idaresi</dt><dd>' + kacir(b.suIdaresi || 'açık kayıt yok') + '</dd></div>'
      + '<div><dt>Akifer eğilimi</dt><dd>Uydu (NASA GRACE-FO) yeraltı su depolaması anomalisi ilgili havza sayfasında yayımlıdır; bu belge resmî sınıflama ÜRETMEZ.</dd></div></dl>'
      + '<h2>Resmî Gazete işletme sahası / tahsise kapatma kayıtları (' + sonKayitlar.length + ')</h2>'
      + '<table><thead><tr><th>Durum</th><th>Tarih</th><th>Saha</th><th>Resmî kaynak</th></tr></thead><tbody>' + satirlar + '</tbody></table>'
      + '<p class="uyari">Bu belge, DSİ’nin Resmî Gazete’de yayımladığı kayıtları il bazında derler; "açık/kapalı/kısıtlı/yasak" biçiminde resmî bir sınıflama ÜRETMEZ. Kayıt bulunmaması kısıt olmadığının kanıtı değildir. Hukuki değerlendirme uzman incelemesi gerektirir.</p>'
      + '<p class="kaynak">Kaynak: Su Haritası Açık Hidroloji ve Hukuk Standardı (suharitasi.com) · ' + tarih + '</p>'
      + '<p class="kurumsal-imza">İşbu rapor; kamuya açık hidrojeolojik veriler, uydu spektral taramaları ve 167 sayılı Kanun hükümleri doğrultusunda algoritmik olarak üretilmiştir. Tesisinizin yerinde hukuki denetimi, mühürleme ve idari para cezalarına karşı Yürütmenin Durdurulması (YD) talepli iptal davaları için yetkili hukuk masası: Arslan Hukuk Bürosu (arslanhukuk.tr).</p>'
      + '</body></html>';
    var w = window.open('', '_blank');
    if (!w) return;
    w.document.open(); w.document.write(html); w.document.close();
    setTimeout(function () { try { w.focus(); w.print(); } catch (e) { /* yazdırma engellendi */ } }, 250);
  }
  belgeBtn && belgeBtn.addEventListener('click', belgeOlustur);

  sec.addEventListener('change', function () { yukleniyor.then(ciz); });
  yukleniyor.then(ciz);
})();
