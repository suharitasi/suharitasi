// hesap-ceza.js — 167 m.18 ceza + süre hesaplayıcı (13.09.2026).
// Aralıklar tek kaynaktan (sayfadaki #hc-veri ← src/data/ceza-tutar.js): kanun metni + yılın uygulanan tutarı
// (DURAK 1 A-a, 10.10.2026; hukuki onay bekliyor). İtiraz süreleri iki yol.
(function () {
  'use strict';
  var fiil = document.getElementById('hc-fiil');
  var teblig = document.getElementById('hc-teblig');
  var sonuc = document.getElementById('hc-sonuc');
  var veriEl = document.getElementById('hc-veri');
  if (!fiil || !sonuc) return;

  var FIILLER = [];
  try { FIILLER = JSON.parse(veriEl.textContent); } catch (e) { FIILLER = []; }
  var byId = {};
  FIILLER.forEach(function (f) { byId[f.id] = f; });

  function tr(n) { return n.toLocaleString('tr-TR'); }
  function gunEkle(iso, gun) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return null;
    d.setDate(d.getDate() + gun);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function ciz() {
    var f = byId[fiil.value];
    if (!f) { sonuc.innerHTML = ''; return; }
    var sure = '';
    if (teblig && teblig.value) {
      var s15 = gunEkle(teblig.value, 15);
      var s60 = gunEkle(teblig.value, 60);
      sure = '<div class="hc-sure">' +
        'Tebliğ tarihi <strong>' + new Date(teblig.value + 'T00:00:00').toLocaleDateString('tr-TR') + '</strong> ise:' +
        '<ul>' +
        '<li>Sulh ceza hakimliğine başvuru (5326 s. Kabahatler K. m.27): <strong>' + s15 + '</strong> (15 gün)</li>' +
        '<li>İdare mahkemesinde iptal davası (İYUK): <strong>' + s60 + '</strong> (60 gün)</li>' +
        '</ul>' +
        '<p class="hc-not">Hangi yolun geçerli olduğu somut dosyaya göre değişir; uzman değerlendirmesi gerekir.</p>' +
        '</div>';
    } else {
      sure = '<div class="hc-sure">Tebliğ tarihinizi girin: 15 gün (sulh ceza) ve 60 gün (idare mahkemesi) son tarihleri hesaplanır. İtiraz yolu somut dosyaya göre değişir.</div>';
    }
    sonuc.innerHTML =
      '<div class="hc-kart">' +
      '<h2>' + f.ad + '</h2>' +
      '<dl>' +
      '<div><dt>Kanuni dayanak</dt><dd>' + f.madde + '</dd></div>' +
      '<div><dt>İdari para cezası (' + f.yil + ' yılında uygulanan)</dt><dd class="hc-ceza">' + tr(f.gAlt) + ' – ' + tr(f.gUst) + ' TL</dd></div>' +
      '<div><dt>Kanun metnindeki tutar</dt><dd>' + tr(f.alt) + ' – ' + tr(f.ust) + ' TL · son doğrulama ' + String(f.dogrulama).split('-').reverse().join('.') + '</dd></div>' +
      '<div><dt>Ek sonuç</dt><dd>' + f.ek + '</dd></div>' +
      '<div><dt>Yetkili merci</dt><dd>Mahallî mülkî amir (valilik / kaymakamlık)</dd></div>' +
      '</dl>' +
      sure +
      '</div>';
  }

  fiil.addEventListener('change', ciz);
  if (teblig) teblig.addEventListener('change', ciz);
  ciz();
})();
