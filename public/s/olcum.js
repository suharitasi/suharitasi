// olcum.js — iletişim tıklamalarını çerezsiz sayar (13.09.2026, ölçüm altyapısı).
//
// TETİKLEYİCİ: [data-olay] taşıyan her bağlantı (telefon/eposta/whatsapp).
// İSTEK: navigator.sendBeacon('/olay?o=<olay>&y=<sayfa>&h=<hedef>') — aynı-köken,
//        POST; gezinmeyi ENGELLEMEZ. Cloudflare Pages Function (functions/olay.js)
//        sayar; KV bağı yoksa sessizce yutulur. Çerez/kişisel veri yok.
// GA4/GTM İLERİDE: window.dataLayer varsa aynı olay oraya da itilir (ölçüm
//        consent kararı verilince GTM etiketi bu olayları dinler).
// HATA SESSİZLİĞİ: bu betik hiçbir koşulda kullanıcı akışını bozmaz.
(function () {
  'use strict';

  function gonder(olay, hedef) {
    if (!olay) return;
    try {
      var yol = location.pathname || '/';
      var qs = 'o=' + encodeURIComponent(olay) +
        '&y=' + encodeURIComponent(yol) +
        (hedef ? '&h=' + encodeURIComponent(String(hedef).slice(0, 180)) : '');
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/olay?' + qs);
      } else {
        // Yedek: keepalive'lı fetch (sendBeacon yoksa).
        fetch('/olay?' + qs, { method: 'POST', keepalive: true }).catch(function () {});
      }
      if (window.dataLayer && typeof window.dataLayer.push === 'function') {
        window.dataLayer.push({ event: 'temas', temas_turu: olay, sayfa: yol });
      }
    } catch (e) { /* ölçüm kaybı kullanıcıyı etkilemez */ }
  }

  document.addEventListener('click', function (ev) {
    var el = ev.target;
    while (el && el !== document.documentElement) {
      if (el.getAttribute && el.getAttribute('data-olay')) {
        gonder(el.getAttribute('data-olay'), el.getAttribute('href') || '');
        return;
      }
      el = el.parentNode;
    }
  }, true);

  // İletişim formu gönderimi (mailto'ya çevrilen form) — varsa sayılır.
  document.addEventListener('submit', function (ev) {
    var f = ev.target;
    if (f && f.matches && f.matches('[data-olay-form]')) {
      gonder(f.getAttribute('data-olay-form') || 'iletisim-form', '');
    }
  }, true);
})();
