// su-verimliligi.js — /mevzuat/su-verimliligi-sayaci/ istemci davranışı.
// İki iş, ikisi de progressive:
//   - Geri sayım: #sv-sayac[data-son] yoksa atlanır; JS kapalıysa sabit tarih.
//   - Faaliyet süzgeci: #sv-ara yoksa atlanır; JS kapalıysa liste tam görünür.
// Bağımsız, harici kütüphane yok.
(function () {
  'use strict';

  // — Geri sayım —
  var sayac = document.getElementById('sv-sayac');
  var AZALT = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (sayac && sayac.dataset.son) {
    var hedef = new Date(sayac.dataset.son + 'T00:00:00');
    var gun = Math.ceil((hedef.getTime() - Date.now()) / 86400000);
    if (gun > 0) {
      var yil = Math.floor(gun / 365);
      var ay = Math.floor((gun % 365) / 30);
      var ek = yil || ay
        ? ' (~' + (yil ? yil + ' yıl ' : '') + (ay ? ay + ' ay' : '') + ')'
        : '';
      if (AZALT) {
        // Azaltılmış hareket: animasyon yok, son değer doğrudan.
        sayac.textContent = gun.toLocaleString('tr-TR') + ' gün' + ek;
      } else {
        // find-animation-opportunities (27.09.2026): geri sayım rakamı ilk
        // görünümde CanliSayiMotor ile AYNI sözleşmeyle sayılır — 900 ms
        // ease-out kübik, yalnız sayı (sonuç metni sabit). Veri bozuksa
        // animasyonsuz son değer basılır (motor kuralı).
        sayac.textContent = '';
        var no = document.createElement('span');
        no.className = 'sv-geri-sayi';
        sayac.appendChild(no);
        sayac.appendChild(document.createTextNode(' gün' + ek));
        var bicim = new Intl.NumberFormat('tr-TR');
        var bas = performance.now(), SURE = 900;
        (function adim(t) {
          var o = Math.min(1, (t - bas) / SURE);
          var e = 1 - Math.pow(1 - o, 3);
          no.textContent = bicim.format(Math.round(gun * e));
          if (o < 1) requestAnimationFrame(adim);
          else no.textContent = bicim.format(gun);
        })(performance.now());
      }
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
