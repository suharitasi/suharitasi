// karar-filtre.js — /su-hukuku/ master karar tablosu için anahtar kelime süzgeci.
// (13.09.2026). JS kapalıysa tablo TAM görünür (progressive enhancement):
// bu betik yalnız satırları gizler/gösterir, içerik zaten DOM'dadır.
(function () {
  'use strict';
  var girdi = document.getElementById('karar-filtre');
  var tablo = document.getElementById('karar-tablo');
  if (!girdi || !tablo) return;
  var satirlar = Array.prototype.slice.call(tablo.tBodies[0].rows);
  var sayac = document.getElementById('karar-sayac');
  var bos = document.getElementById('karar-bos');
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
      var tr = satirlar[i];
      var esles = !q || norm(tr.textContent).indexOf(q) !== -1;
      tr.hidden = !esles;
      if (esles) gorunen++;
    }
    if (sayac) sayac.textContent = q ? (gorunen + ' / ' + toplam + ' karar satırı') : (toplam + ' karar satırı');
    if (bos) bos.hidden = gorunen !== 0;
  }

  girdi.addEventListener('input', suz);
  girdi.addEventListener('search', suz);
})();
