// basin.js — /basin/ gömülü widget üreteci.
// İl seçilince iframe kodunu üretir ve canlı önizlemeyi (göreli yol) yükler.
// Harici kütüphane yok; JS kapalıysa seçenek listesi görünür, kod üretilmez.
(function () {
  'use strict';
  var sec = document.getElementById('bs-il');
  var kod = document.getElementById('bs-kod');
  var onizleme = document.getElementById('bs-onizleme');
  if (!sec || !kod) return;
  var TABAN = 'https://suharitasi.com';

  function guncelle() {
    var slug = sec.value;
    // 04.10.2026 onarımı (md5 konsol): varsayılan/boş il seçiminde önizleme
    // '/gomulu//' → kök sayfaya düşüyor, frame-ancestors 'none' onu çerçevelemeyi
    // engelliyor ve konsola hata basıyordu. Boş slug'da önizleme YÜKLENMEZ.
    if (!slug) {
      if (kod) kod.value = '';
      if (onizleme) onizleme.removeAttribute('src');
      return;
    }
    kod.value =
      '<iframe src="' + TABAN + '/gomulu/' + slug + '/" width="360" height="220" ' +
      'style="border:1px solid #cccccc" title="İlinizin su durumu — Su Haritası" ' +
      'loading="lazy"></iframe>';
    if (onizleme) onizleme.src = '/gomulu/' + slug + '/';
  }

  sec.addEventListener('change', guncelle);
  guncelle();
})();
