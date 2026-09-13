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
  if (!sec || !bilgi || !tablo || !tbody) return;

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
    var kapatmaSayi = ilk.filter(function (r) { return kapatma(r.durum); }).length;
    durum.textContent = ilk.length
      ? (il + ': ' + ilk.length + ' resmî kayıt' + (kapatmaSayi ? ' · ' + kapatmaSayi + ' tahsise kapatma/kısıt' : '') + '.')
      : (il + ' için il eşlemesi doğrulanmış Resmî Gazete kaydı bulunamadı (yokluk kanıt değildir).');
  }

  sec.addEventListener('change', function () { yukleniyor.then(ciz); });
  yukleniyor.then(ciz);
})();
