// ara.js — site içi arama (13.09.2026). /arama.json indeksini çeker ve
// istemcide süzer. Bağımlılık yok. Çok terimli aramada TÜM terimler geçmeli.
(function () {
  'use strict';
  var girdi = document.getElementById('ara-girdi');
  var sonuc = document.getElementById('ara-sonuc');
  var durum = document.getElementById('ara-durum');
  if (!girdi || !sonuc) return;

  var indeks = null;
  var yukleniyor = fetch('/arama.json', { cache: 'force-cache' })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (d) { indeks = Array.isArray(d) ? d : []; })
    .catch(function () { indeks = []; });

  function norm(s) {
    return (s || '').toLowerCase()
      .replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/ş/g, 's')
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
  }

  function kacir(s) {
    return (s || '').replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function vurgula(metin, terimler) {
    var out = kacir(metin);
    for (var i = 0; i < terimler.length; i++) {
      if (!terimler[i]) continue;
      try {
        out = out.replace(new RegExp('(' + terimler[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
      } catch (e) { /* yok say */ }
    }
    return out;
  }

  function ara() {
    if (indeks === null) { durum.textContent = 'İndeks yükleniyor…'; return; }
    var q = girdi.value.trim();
    if (q.length < 2) {
      sonuc.innerHTML = '';
      durum.textContent = q ? 'En az iki karakter yazın.' : 'Aramak için yazmaya başlayın.';
      return;
    }
    var terimler = norm(q)
      // "167 m.18" / "m18" / "md.18" → "madde 18" (mevzuat kısaltması)
      .replace(/\bm(d)?\.?\s*(\d+)/g, 'madde $2')
      .split(/\s+/).filter(Boolean);
    var tamIfade = terimler.join(' ');
    var puanli = [];
    for (var i = 0; i < indeks.length; i++) {
      var k = indeks[i];
      var b = norm(k.b), h = norm(k.h), a = norm(k.a), y = norm(k.y), bol = norm(k.k);
      var hepsi = true, puan = 0;
      // Tam ifade başlıkta/başlıkta geçiyorsa güçlü bonus (ör. "madde 8" → madde-8 üste).
      if (b.indexOf(tamIfade) !== -1) puan += 20;
      else if (h.indexOf(tamIfade) !== -1) puan += 12;
      for (var j = 0; j < terimler.length; j++) {
        var t = terimler[j];
        var hit = false;
        if (b.indexOf(t) !== -1) { puan += 5; hit = true; }
        if (h.indexOf(t) !== -1) { puan += 3; hit = true; }
        if (bol.indexOf(t) !== -1) { puan += 2; hit = true; }
        if (a.indexOf(t) !== -1) { puan += 1; hit = true; }
        if (y.indexOf(t) !== -1) { puan += 1; hit = true; }
        if (!hit) { hepsi = false; break; }
      }
      if (hepsi && puan > 0) puanli.push({ k: k, p: puan });
    }
    puanli.sort(function (x, z) { return z.p - x.p || x.k.y.localeCompare(z.k.y); });
    var goster = puanli.slice(0, 40);
    durum.textContent = puanli.length
      ? (puanli.length + ' sonuç' + (puanli.length > goster.length ? ' (ilk ' + goster.length + ')' : ''))
      : 'Sonuç bulunamadı.';
    sonuc.innerHTML = goster.map(function (r) {
      return '<li><span class="a-k">' + kacir(r.k.k) + '</span>' +
        '<a class="a-b" href="' + kacir(r.k.y) + '">' + vurgula(r.k.b, terimler) + '</a>' +
        (r.k.a ? '<p class="a-a">' + vurgula(r.k.a.slice(0, 200), terimler) + '</p>' : '') +
        '</li>';
    }).join('');
  }

  girdi.addEventListener('input', function () { yukleniyor.then(ara); });
  girdi.addEventListener('search', function () { yukleniyor.then(ara); });
  yukleniyor.then(ara);
})();
