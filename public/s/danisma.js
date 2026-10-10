// danisma.js — danışma formlarını /danisma Function'ına gönderir (13.09.2026).
// 10.10.2026 (brif 1.5): ana sayfa iletişim formu da aynı uca bağlandı; betik
// artık #danisma-form ya da [data-danisma-form] taşıyan her formu kurar, durum
// satırı form içindeki [data-danisma-durum] ya da #danisma-durum'dur ve
// gönderildiği sayfa yolu `sayfa` alanıyla gider.
// Başarısız olursa kullanıcıyı mailto'ya yönlendirir; sessiz başarısızlık yok.
(function () {
  'use strict';
  var formlar = document.querySelectorAll('#danisma-form, form[data-danisma-form]');
  if (!formlar.length) return;
  Array.prototype.forEach.call(formlar, kur);

  function kur(form) {
    var durum = form.querySelector('[data-danisma-durum]') || document.getElementById('danisma-durum');
    function yaz(html, sinif) {
      if (!durum) return;
      durum.innerHTML = html;
      durum.classList.remove('ok', 'hata');
      if (sinif) durum.classList.add(sinif);
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      yaz('Gönderiliyor…', '');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      var veri = {};
      new FormData(form).forEach(function (v, k) { veri[k] = v; });
      veri.sayfa = location.pathname;

      // Basit doğrulama (sunucu da doğrular).
      if (!veri.ad || !veri.telefon || !veri.mesaj || !veri.onay) {
        yaz('Lütfen zorunlu alanları doldurun.', 'hata');
        if (btn) btn.disabled = false;
        return;
      }
      if (veri.website) { // honeypot dolu → bot
        // Tarayıcı/şifre yöneticisi "website" alanını doldurabilir: gerçek
        // kullanıcıyı kilitlememek için düğme yeniden etkinleştirilir.
        yaz('Teşekkürler.', 'ok');
        if (btn) btn.disabled = false;
        return;
      }

      fetch('/danisma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veri),
      })
        .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
        .then(function (j) {
          if (j && j.ok) {
            form.reset();
            yaz('Talebiniz alındı. En kısa sürede dönüş yapılacaktır. ' +
              'Acilse <a href="/whatsapp/">WhatsApp</a> veya telefonla ulaşabilirsiniz.', 'ok');
          } else {
            throw new Error((j && j.hata) || 'gönderilemedi');
          }
        })
        .catch(function () {
          yaz('Form şu an gönderilemedi. Lütfen ' +
            '<a href="/whatsapp/">WhatsApp</a> veya e-posta ile ulaşın.', 'hata');
        })
        .then(function () { if (btn) btn.disabled = false; });
    });
  }
})();
