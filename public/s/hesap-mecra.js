// hesap-mecra.js — mecra irtifakı süreç simülatörü (13.09.2026).
// Yalnız süreç aşamalarını gösterir; bilirkişi/bedel kriteri ÜRETİLMEZ.
(function () {
  'use strict';
  var ihtiyac = document.getElementById('hm-ihtiyac');
  var komsu = document.getElementById('hm-komsu');
  var sonuc = document.getElementById('hm-sonuc');
  var veriEl = document.getElementById('hm-veri');
  if (!sonuc) return;
  var ASAMALAR = [];
  try { ASAMALAR = JSON.parse(veriEl.textContent); } catch (e) { ASAMALAR = []; }

  var notlar = {
    evsel: 'Evsel içme-kullanma ihtiyacı öncelik sıralamasında üsttedir (Yeraltı Suları Tüzüğü m.15).',
    tarimsal: 'Tarımsal sulama, içme ve hayvan sulamasından sonra gelir (Yeraltı Suları Tüzüğü m.15).',
    sanayi: 'Sanayi suyu öncelik sıralamasında zirai sulamadan sonra gelir (Yeraltı Suları Tüzüğü m.15).',
  };
  var komsuNot = {
    kaynak: 'Yerüstü kaynağı için TMK m.756 (kaynak hakkı) ve mecra irtifakı hükümleri gündeme gelir.',
    yeralti: 'Yeraltı suyu kamu suyudur; komşu parselden yararlanma Yeraltı Suları Tüzüğü m.16 koşullarına bağlıdır.',
    belirsiz: 'Komşu parselde kaynağın niteliği (yerüstü/yeraltı) süreç yolunu etkiler; tespit gerekir.',
  };

  function ciz() {
    sonuc.innerHTML =
      '<ol>' + ASAMALAR.map(function (a) {
        return '<li><span class="hm-no">' + a.no + '</span><span><span class="hm-ad">' + a.ad + '</span><span class="hm-aciklama">' + a.aciklama + '</span></span></li>';
      }).join('') + '</ol>' +
      '<div class="hm-vurgu">' + (notlar[ihtiyac.value] || '') + ' ' + (komsuNot[komsu.value] || '') + '</div>';
  }

  ihtiyac.addEventListener('change', ciz);
  komsu.addEventListener('change', ciz);
  ciz();
})();
