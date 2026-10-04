// mevzuat-filtre.js — /mevzuat/ indeksi için anahtar kelime süzgeci.
// 13.09.2026; 04.10.2026 denetimi: data-madde (449 KB DOM kopyası) kaldırıldı.
// Tam metin arama KORUNUR: indeks ilk aramada tembel çekilir
// (/veri/mevzuat-arama.json, HTTP önbellekli). İndeks gelene kadar görünür
// metinle (madde + başlık) süzülür; hata/yok durumunda görünür metin kalır.
// Sıra sözleşmesi: indeks[i] ↔ .mv-liste li[i] (sayfa üretimiyle birebir).
(function () {
  'use strict';
  var girdi = document.getElementById('mv-filtre');
  if (!girdi) return;
  var ogeler = Array.prototype.slice.call(document.querySelectorAll('.mv-liste li'));
  var sayac = document.getElementById('mv-sayac');
  var bos = document.getElementById('mv-bos');
  var toplam = ogeler.length;
  var saman = null;      // normalleştirilmiş tam metin dizisi
  var istendi = false;   // istek yalnız BİR kez
  var yukleniyor = false;

  function norm(s) {
    return (s || '').toLowerCase()
      .replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/ş/g, 's')
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
  }

  function suz() {
    var q = norm(girdi.value.trim());
    var gorunen = 0;
    for (var i = 0; i < ogeler.length; i++) {
      var metin = saman ? saman[i] : norm(ogeler[i].textContent);
      var esles = !q || metin.indexOf(q) !== -1;
      ogeler[i].hidden = !esles;
      if (esles) gorunen++;
    }
    if (sayac) {
      if (q && !saman && yukleniyor) {
        sayac.textContent = 'Tam metin indeksi yükleniyor… (' + gorunen + ' görünür eşleşme)';
      } else {
        sayac.textContent = q ? (gorunen + ' / ' + toplam + ' madde') : (toplam + ' madde');
      }
    }
    if (bos) bos.hidden = gorunen !== 0;
  }

  function indeksYukle() {
    if (istendi) return;
    istendi = true;
    yukleniyor = true;
    fetch('/veri/mevzuat-arama.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) {
        // Güvenli geri düşüş: adet/içerik sözleşmeye uymuyorsa görünür
        // metin süzgeci geçerli kalır (yanlış eşleme üretilmez).
        if (d && d.metinler && d.metinler.length === toplam) {
          saman = d.metinler.map(norm);
        }
      })
      .catch(function () { /* indeks yoksa görünür metin süzgeci geçerli */ })
      .then(function () { yukleniyor = false; suz(); });
  }

  girdi.addEventListener('input', function () { suz(); indeksYukle(); });
  girdi.addEventListener('search', function () { suz(); });
})();
