// danisma.js — /hizli-danisma/ formunu /danisma Function'ına gönderir (13.09.2026).
// Başarısız olursa kullanıcıyı mailto'ya yönlendirir; sessiz başarısızlık yok.
(function () {
  'use strict';
  var form = document.getElementById('danisma-form');
  var durum = document.getElementById('danisma-durum');
  if (!form) return;

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (durum) { durum.textContent = 'Gönderiliyor…'; durum.className = 'hd-durum'; }
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    var veri = {};
    new FormData(form).forEach(function (v, k) { veri[k] = v; });

    // Basit doğrulama (sunucu da doğrular).
    if (!veri.ad || !veri.telefon || !veri.mesaj || !veri.onay) {
      if (durum) { durum.textContent = 'Lütfen zorunlu alanları doldurun.'; durum.className = 'hd-durum hata'; }
      if (btn) btn.disabled = false;
      return;
    }
    if (veri.website) { // honeypot dolu → bot
      if (durum) { durum.textContent = 'Teşekkürler.'; durum.className = 'hd-durum ok'; }
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
          if (durum) {
            durum.innerHTML = 'Talebiniz alındı. En kısa sürede dönüş yapılacaktır. ' +
              'Acilse <a href="/whatsapp/">WhatsApp</a> veya telefonla ulaşabilirsiniz.';
            durum.className = 'hd-durum ok';
          }
        } else {
          throw new Error((j && j.hata) || 'gönderilemedi');
        }
      })
      .catch(function () {
        if (durum) {
          durum.innerHTML = 'Form şu an gönderilemedi. Lütfen ' +
            '<a href="/whatsapp/">WhatsApp</a> veya e-posta ile ulaşın.';
          durum.className = 'hd-durum hata';
        }
      })
      .then(function () { if (btn) btn.disabled = false; });
  });
})();
