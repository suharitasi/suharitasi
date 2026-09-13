// emsal-filtre.js — /emsal-kararlar/ tablosu için anahtar kelime süzgeci (13.09.2026).
// JS kapalıysa tüm kararlar görünür; bu betik yalnız satırları süzer.
(function () {
  'use strict';
  var girdi = document.getElementById('em-filtre');
  var tablo = document.getElementById('em-tablo');
  if (!girdi || !tablo) return;
  var satirlar = Array.prototype.slice.call(tablo.tBodies[0].rows);
  var sayac = document.getElementById('em-sayac');
  var bos = document.getElementById('em-bos');
  var toplam = satirlar.length;

  function norm(s) {
    return (s || '').toLowerCase()
      .replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/ş/g, 's')
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
  }

  function suz() {
    var q = norm(girdi.value.trim());
    var gorunen = 0;
    for (var i = 0; i < satirlar.length; i++) {
      var esles = !q || norm(satirlar[i].textContent).indexOf(q) !== -1;
      satirlar[i].hidden = !esles;
      if (esles) gorunen++;
    }
    if (sayac) sayac.textContent = q ? (gorunen + ' / ' + toplam + ' karar') : (toplam + ' karar');
    if (bos) bos.hidden = gorunen !== 0;
  }

  girdi.addEventListener('input', suz);
  girdi.addEventListener('search', suz);
})();
