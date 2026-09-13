// su-riski.js — /su-riski-endeksi/ interaktif panel (13.09.2026).
// Seçilen il/havza için skor, bileşen çubukları, zaman serisi ve su bütçesi.
(function () {
  'use strict';
  var sec = document.getElementById('sr-sec');
  var detay = document.getElementById('sr-detay');
  var veriEl = document.getElementById('sr-veri');
  if (!sec || !detay || !veriEl) return;
  var V = {};
  try { V = JSON.parse(veriEl.textContent) || {}; } catch (e) { return; }
  if (!V.havzalar) return;

  var havzaByAd = {}; (V.havzalar || []).forEach(function (h) { havzaByAd[h.ad] = h; });
  var ilByAd = {}; (V.iller || []).forEach(function (x) { ilByAd[x.il] = x; });

  // seçenekleri doldur
  var og = document.createElement('optgroup'); og.label = 'Havzalar';
  (V.havzalar || []).forEach(function (h) { var o = document.createElement('option'); o.value = 'h:' + h.ad; o.textContent = h.ad + ' — ' + h.kategori; og.appendChild(o); });
  sec.appendChild(og);
  var og2 = document.createElement('optgroup'); og2.label = 'İller';
  (V.iller || []).forEach(function (x) { var o = document.createElement('option'); o.value = 'i:' + x.il; o.textContent = x.il + ' — ' + x.kategori; og2.appendChild(o); });
  sec.appendChild(og2);

  function kacir(s) { return (s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function katSinif(k) { return { 'Düşük': 'd', 'Orta': 'o', 'Yüksek': 'y', 'Kritik': 'k' }[k] || 'v'; }
  function bar(etiket, deger) {
    var v = deger == null ? 0 : deger;
    var cls = v >= 75 ? 'k' : v >= 50 ? 'y' : '';
    return '<div class="sr-bar"><span>' + kacir(etiket) + '</span><span class="sr-bar-cubuk"><span class="sr-bar-dolgu ' + cls + '" style="width:' + Math.max(0, Math.min(100, v)) + '%"></span></span><span>' + (deger == null ? '—' : deger) + '</span></div>';
  }
  function spark(dizi, renk) {
    if (!dizi || dizi.length < 2) return '<p class="sr-veri-yok">veri yok</p>';
    var w = 320, h = 48, max = Math.max.apply(null, dizi), min = Math.min.apply(null, dizi), aralik = max - min || 1;
    var nokta = dizi.map(function (v, i) {
      var x = (i / (dizi.length - 1)) * w;
      var y = h - ((v - min) / aralik) * (h - 6) - 3;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="zaman serisi"><polyline fill="none" stroke="' + renk + '" stroke-width="2" points="' + nokta + '"/></svg>';
  }

  function ciz() {
    var v = sec.value;
    if (!v) { detay.hidden = true; return; }
    if (v.slice(0, 2) === 'h:') {
      var ad = v.slice(2); var h = havzaByAd[ad];
      if (!h) { detay.hidden = true; return; }
      var b = (V.butce || {})[ad] || {};
      var s = (V.seriler || {})[ad] || {};
      detay.innerHTML =
        '<h3>' + kacir(h.ad) + '</h3>' +
        '<p><span class="sr-skor-buyuk">' + (h.puan ?? '—') + '</span> / 100 · <span class="sr-kat sr-' + katSinif(h.kategori) + '">' + h.kategori + '</span></p>' +
        bar('GRACE (yerçekimi)', h.bilesenler.grace) +
        bar('Baraj doluluk', h.bilesenler.baraj) +
        bar('YAS rezerv/beslenim', h.bilesenler.yas) +
        bar('Tahsis durumu', h.bilesenler.tahsis) +
        bar('Yüzey suyu', h.bilesenler.yuzeysuyu) +
        '<p class="sr-ham">Ham: GRACE eğim ' + (h.ham.graceEgim ?? '—') + ' cm/ay · baraj doluluk %' + (h.ham.barajDoluluk ?? '—') + ' · YAS beslenim ' + (h.ham.yasBeslenim ?? '—') + ' hm³ · rezerv ' + (h.ham.yasRezerv ?? '—') + ' hm³ · yüzey potansiyeli ' + (h.ham.yuzyPotansiyel ?? '—') + ' km³</p>' +
        '<div class="sr-spark"><p class="sr-spark-bas">Baraj doluluk (son 30 gün)</p>' + spark(s.baraj, '#0C5A7C') + '</div>' +
        '<div class="sr-spark"><p class="sr-spark-bas">Aylık yağış (son 36 ay, mm)</p>' + spark(s.chirps, '#2E7EA0') + '</div>' +
        '<p class="sr-butce">Su bütçesi göstergeleri: YAS beslenimi <strong>' + (b.beslenim_hm3 ?? '—') + ' hm³</strong> · işletme rezervi <strong>' + (b.rezerv_hm3 ?? '—') + ' hm³</strong> · yüzey suyu potansiyeli <strong>' + (b.yuzeyPotansiyeli_km3 ?? '—') + ' km³</strong>. (Çekim verisi resmî kaynakta derli yayımlanmadığından bütçe farkı hesaplanmaz.)</p>' +
        '<button type="button" class="sr-yazdir">Su riski raporu oluştur / PDF</button>';
    } else {
      var il = v.slice(2); var x = ilByAd[il];
      if (!x) { detay.hidden = true; return; }
      var satirlar = (x.havzalar || []).map(function (a) { var hh = havzaByAd[a]; return hh ? bar(a + ' (' + hh.kategori + ')', hh.puan) : ''; }).join('');
      detay.innerHTML =
        '<h3>' + kacir(x.il) + '</h3>' +
        '<p><span class="sr-skor-buyuk">' + (x.puan ?? '—') + '</span> / 100 · <span class="sr-kat sr-' + katSinif(x.kategori) + '">' + x.kategori + '</span></p>' +
        '<p class="sr-ham">Kapsadığı havzalar: ' + kacir((x.havzalar || []).join(' · ')) + '</p>' + satirlar +
        '<button type="button" class="sr-yazdir">Su riski raporu oluştur / PDF</button>';
    }
    detay.hidden = false;
    var yb = detay.querySelector('.sr-yazdir');
    if (yb) yb.addEventListener('click', function () { window.print(); });
  }
  sec.addEventListener('change', ciz);
})();
