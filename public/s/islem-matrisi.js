// islem-matrisi.js — /islem-matrisi/ il seçici süzgeci (13.09.2026).
// JS kapalıysa 81 il satırının TAMAMI görünür (crawlable); bu betik yalnız
// seçilen ile göre satırları gizler/gösterir.
(function () {
  'use strict';
  var sec = document.getElementById('im-il-sec');
  var tablo = document.getElementById('im-il-tablo');
  if (!sec || !tablo) return;
  var satirlar = Array.prototype.slice.call(tablo.tBodies[0].rows);
  var bos = document.getElementById('im-bos');

  function uygula() {
    var v = sec.value;
    var gorunen = 0;
    for (var i = 0; i < satirlar.length; i++) {
      var tr = satirlar[i];
      var esles = !v || tr.getAttribute('data-il') === v;
      tr.hidden = !esles;
      if (esles) gorunen++;
    }
    if (bos) {
      if (v) {
        var ad = sec.options[sec.selectedIndex].textContent;
        bos.textContent = ad + ' için kayıt görünür. Tümünü görmek için seçimi temizleyin.';
        bos.hidden = false;
      } else {
        bos.hidden = true;
      }
    }
  }

  sec.addEventListener('change', uygula);
})();
