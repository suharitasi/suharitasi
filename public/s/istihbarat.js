// istihbarat.js — /istihbarat/ RSS kopyalama + il bazlı e-posta takip akışı.
// Progressive: JS yoksa RSS bağlantıları ve form yine görünür/çalışır
// (form /takip Function'ına POST eder; bu script yalnız kolaylık sağlar).
(function () {
  'use strict';

  function kopyala(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(t).then(function () { return true; }).catch(function () { return yedek(t); });
    }
    return Promise.resolve(yedek(t));
  }
  function yedek(t) {
    try {
      var ta = document.createElement('textarea');
      ta.value = t; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  // — RSS bağlantısını kopyala —
  document.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('[data-rss-kopyala]') : null;
    if (!b) return;
    var url = b.getAttribute('data-url');
    if (!url) return;
    if (b.dataset.ilk === undefined) b.dataset.ilk = b.textContent;
    kopyala(url).then(function (ok) {
      b.textContent = ok ? 'Kopyalandı' : 'Kopyalanamadı';
      setTimeout(function () { b.textContent = b.dataset.ilk; }, 1600);
    });
  });

  // — E-posta ile takip: il seçimini forma taşı —
  document.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('[data-takip-il]') : null;
    if (!b) return;
    var slug = b.getAttribute('data-takip-il');
    var form = document.getElementById('takip-form');
    if (!form) return;
    var sec = form.querySelector('select[name="konu"]');
    if (sec) sec.value = slug;
    var eposta = form.querySelector('input[name="eposta"]');
    var durum = document.getElementById('takip-durum');
    if (durum) durum.textContent = 'İl seçildi: ' + (b.getAttribute('data-il') || '') + '. E-postanızı yazıp onaylayın.';
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (eposta) setTimeout(function () { try { eposta.focus(); } catch (e) { /* yoksay */ } }, 400);
  });
})();
