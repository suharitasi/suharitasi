// sozluk-filtre.js — /sozluk/ terim dizini için anahtar kelime süzgeci (13.09.2026).
// JS kapalıysa tüm terimler görünür; bu betik yalnız listeleri süzer.
(function () {
  'use strict';
  var girdi = document.getElementById('soz-filtre');
  if (!girdi) return;
  var ogeler = Array.prototype.slice.call(document.querySelectorAll('[data-terim]'));
  var sayac = document.getElementById('soz-sayac');
  var bos = document.getElementById('soz-bos');
  var toplam = ogeler.length;

  function norm(s) {
    return (s || '').toLowerCase()
      .replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/ş/g, 's')
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
  }

  function suz() {
    var q = norm(girdi.value.trim());
    var gorunen = 0;
    for (var i = 0; i < ogeler.length; i++) {
      var el = ogeler[i];
      var esles = !q || norm(el.textContent).indexOf(q) !== -1;
      el.hidden = !esles;
      if (esles) gorunen++;
    }
    if (sayac) sayac.textContent = q ? (gorunen + ' / ' + toplam + ' terim') : (toplam + ' terim');
    if (bos) bos.hidden = gorunen !== 0;
  }

  girdi.addEventListener('input', suz);
  girdi.addEventListener('search', suz);
})();
