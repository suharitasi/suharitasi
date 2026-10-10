// hesap-ceza.js — 167 m.18 ceza + süre hesaplayıcı (13.09.2026).
// Aralıklar tek kaynaktan (sayfadaki #hc-veri ← src/data/ceza-tutar.js): kanun metni + yılın uygulanan tutarı
// (DURAK 1 A-a, 10.10.2026; hukuki onay bekliyor). İtiraz süreleri iki yol.
import { sonGun, kalanGun } from '/s/sure-hesap.js';
var SURE = null;
try { SURE = JSON.parse(document.getElementById('sure-kurallar').textContent); } catch (e) { SURE = null; }
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

  function ciz() {
    var f = byId[fiil.value];
    if (!f) { sonuc.innerHTML = ''; return; }
    var sure = '';
    if (teblig && teblig.value && SURE) {
      var notlar = [];
      var satir = function (id) {
        var y = SURE.yollar[id]; var r = sonGun(teblig.value, id, SURE); if (!r) return '';
        r.notlar.forEach(function (n) { if (notlar.indexOf(n) < 0) notlar.push(n); });
        var k = kalanGun(r.son);
        return '<li><strong>' + y.ad + '</strong> — ' + y.merci + ': <strong>' +
          r.son.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) + '</strong> (' +
          (k >= 0 ? k + ' gün kaldı' : 'süre geçmiş olabilir') + ') · ' + y.dayanak + '</li>';
      };
      sure = '<div class="hc-sure">' +
        'Tebliğ tarihi <strong>' + new Date(teblig.value + 'T00:00:00').toLocaleDateString('tr-TR') + '</strong> ise:' +
        '<ul>' + satir('kabahat') + satir('idari') + satir('birlikte') + '</ul>' +
        '<ul class="hc-not">' + notlar.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>' +
        '</div>';
    } else {
      sure = '<div class="hc-sure">Tebliğ tarihinizi girin: para cezasına başvuru (sulh ceza, 15 gün) ve iptal davası (idare mahkemesi, 60 gün) son günleri ayrı ayrı hesaplanır.</div>';
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
