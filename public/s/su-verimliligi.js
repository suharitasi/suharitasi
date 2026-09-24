// su-verimliligi.js — /mevzuat/su-verimliligi-sayaci/ istemci davranışı.
// İki iş, ikisi de progressive:
//   - Geri sayım: #sv-sayac[data-son] yoksa atlanır; JS kapalıysa sabit tarih.
//   - Faaliyet süzgeci: #sv-ara yoksa atlanır; JS kapalıysa liste tam görünür.
// Bağımsız, harici kütüphane yok.
(function () {
  'use strict';

  // — Geri sayım —
  var sayac = document.getElementById('sv-sayac');
  if (sayac && sayac.dataset.son) {
    var hedef = new Date(sayac.dataset.son + 'T00:00:00');
    var gun = Math.ceil((hedef.getTime() - Date.now()) / 86400000);
    if (gun > 0) {
      var yil = Math.floor(gun / 365);
      var ay = Math.floor((gun % 365) / 30);
      sayac.textContent = gun.toLocaleString('tr-TR') + ' gün'
        + (yil || ay ? ' (~' + (yil ? yil + ' yıl ' : '') + (ay ? ay + ' ay' : '') + ')' : '');
    } else {
      sayac.textContent = 'Son başvuru tarihi geçti';
    }
    sayac.hidden = false;
  }

  // — Faaliyet süzgeci —
  var kutu = document.getElementById('sv-ara');
  var liste = document.getElementById('sv-liste');
  var durum = document.getElementById('sv-durum');
  if (kutu && liste) {
    var kartlar = [].slice.call(liste.querySelectorAll('.sv-f'));
    var toplam = kartlar.length;
    var tr = function (s) {
      return (s || '').toLocaleLowerCase('tr-TR');
    };
    var suz = function () {
      var q = tr(kutu.value).trim();
      var gorunen = 0;
      for (var i = 0; i < kartlar.length; i++) {
        var esles = !q || (kartlar[i].dataset.ara || '').indexOf(q) !== -1;
        kartlar[i].hidden = !esles;
        if (esles) gorunen++;
      }
      if (durum) {
        durum.textContent = gorunen === toplam
          ? toplam + ' faaliyet listeleniyor.'
          : gorunen + ' / ' + toplam + ' faaliyet eşleşiyor.';
      }
    };
    kutu.addEventListener('input', suz);
  }
})();
