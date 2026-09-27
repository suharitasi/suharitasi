// takip.js — mevzuat değişiklik takip formu (13.09.2026).
// /takip Function'ına POST eder; başarısızsa kullanıcıya net durum gösterir.
// 27.09.2026 (transitions-dev): başarıda t-check (çizilen tik), hatada
// t-shake (form sarsıntısı) — hepsi prefers-reduced-motion'da CSS'te kapalı.
(function () {
  'use strict';
  var form = document.getElementById('takip-form');
  var durum = document.getElementById('takip-durum');
  if (!form) return;

  // Durum satırı sayfa AÇILIŞINDA boş olmalı; "Kaydedildi…" gibi başarı
  // bildirimi yalnız GERÇEK bir gönderimden sonra çıkar. bfcache'ten geri
  // dönüşte (pageshow) ve çift çağrıda da sıfırlanır (03.10.2026).
  function durumSifirla() {
    if (durum && !form.dataset.gonderildi) {
      durum.textContent = '';
      durum.className = 'ih-form-durum';
    }
  }
  durumSifirla();
  addEventListener('pageshow', durumSifirla);

  var CHECK =
    '<svg class="ih-check" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 12.5l5 5L20 6.5"/></svg>';

  function salla() {
    form.classList.remove('ih-salla');
    // Reflow ile animasyonun yeniden tetiklenmesini sağla.
    void form.offsetWidth;
    form.classList.add('ih-salla');
  }
  form.addEventListener('animationend', function (e) {
    if (e.animationName === 'ih-salla') form.classList.remove('ih-salla');
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    form.dataset.gonderildi = '1';
    var btn = form.querySelector('button[type="submit"]');
    if (durum) { durum.className = 'ih-form-durum'; durum.textContent = 'Kaydediliyor…'; }
    if (btn) btn.disabled = true;
    var veri = {};
    new FormData(form).forEach(function (v, k) { veri[k] = v; });
    fetch('/takip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(veri) })
      .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
      .then(function (j) {
        if (j && j.ok) {
          form.reset();
          if (durum) {
            durum.className = 'ih-form-durum ih-ok';
            durum.innerHTML = CHECK + 'Kaydedildi. Değişiklik olduğunda bilgilendirileceksiniz.';
          }
        } else { throw new Error('x'); }
      })
      .catch(function () {
        if (durum) {
          durum.className = 'ih-form-durum ih-hata';
          durum.textContent = 'Şu an kaydedilemedi; lütfen sonra tekrar deneyin.';
        }
        salla();
      })
      .then(function () { if (btn) btn.disabled = false; });
  });
})();
