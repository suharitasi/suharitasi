// takip.js — mevzuat değişiklik takip formu (13.09.2026).
// /takip Function'ına POST eder; başarısızsa kullanıcıya net durum gösterir.
(function () {
  'use strict';
  var form = document.getElementById('takip-form');
  var durum = document.getElementById('takip-durum');
  if (!form) return;
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    if (durum) { durum.textContent = 'Kaydediliyor…'; durum.className = 'mr-form-durum'; }
    if (btn) btn.disabled = true;
    var veri = {};
    new FormData(form).forEach(function (v, k) { veri[k] = v; });
    fetch('/takip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(veri) })
      .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
      .then(function (j) {
        if (j && j.ok) {
          form.reset();
          if (durum) { durum.textContent = 'Kaydedildi. Değişiklik olduğunda bilgilendirileceksiniz.'; durum.className = 'mr-form-durum'; }
        } else { throw new Error('x'); }
      })
      .catch(function () {
        if (durum) { durum.textContent = 'Şu an kaydedilemedi; lütfen sonra tekrar deneyin.'; }
      })
      .then(function () { if (btn) btn.disabled = false; });
  });
})();
