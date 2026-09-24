// rg-zaman.js — /arsiv/resmi-gazete/ arşiv süzgeci.
// Kayıtlar sunucuda render edilir (SEO/no-JS); bu script yalnız görünürlüğü
// yönetir. Süzgeçler: yıl çipi + il çipi + durum seçimi + metin araması.
// Paylaşılabilir URL: ?yil=&il=&durum=&ara= adres çubuğuna yazılır.
// Harici kütüphane yok.
(function () {
  'use strict';
  var liste = document.getElementById('rz-liste');
  if (!liste) return;

  var kayitlar = [].slice.call(liste.querySelectorAll('.rz-k'));
  var yilDugmeleri = [].slice.call(document.querySelectorAll('#rz-cetvel .rz-yil'));
  var ilDugmeleri = [].slice.call(document.querySelectorAll('#rz-iller .rz-il'));
  var durumSec = document.getElementById('rz-durum');
  var araKutu = document.getElementById('rz-ara');
  var sifirla = document.getElementById('rz-sifirla');
  var sonuc = document.getElementById('rz-sonuc');
  var bos = document.getElementById('rz-bos');

  var toplam = kayitlar.length;
  var durum = { yil: '', il: '', secilenDurum: '', q: '' };

  function tr(s) {
    return (s || '').toLocaleLowerCase('tr-TR');
  }

  // Arama samanlığı: HTML'de tekrar EDİLMEZ (sayfa ağırlığı); görünür metinden
  // bir kez türetilip data-ara'ya yazılır. Sunucu HTML'i küçük kalır.
  for (var z = 0; z < kayitlar.length; z++) {
    if (!kayitlar[z].dataset.ara) kayitlar[z].dataset.ara = tr(kayitlar[z].textContent || '');
  }

  function uygula(kaydet) {
    var q = tr(durum.q).trim();
    var gorunen = 0;
    for (var i = 0; i < kayitlar.length; i++) {
      var k = kayitlar[i];
      var uygun = true;
      if (durum.yil && k.dataset.y !== durum.yil) uygun = false;
      if (uygun && durum.il && (k.dataset.il || '').split(' ').indexOf(durum.il) === -1) uygun = false;
      if (uygun && durum.secilenDurum && k.dataset.d !== durum.secilenDurum) uygun = false;
      if (uygun && q && (k.dataset.ara || '').indexOf(q) === -1) uygun = false;
      k.hidden = !uygun;
      if (uygun) gorunen++;
    }
    if (sonuc) {
      sonuc.textContent = gorunen === toplam
        ? toplam + ' kayıt listeleniyor.'
        : gorunen + ' / ' + toplam + ' kayıt eşleşiyor.';
    }
    if (bos) bos.hidden = gorunen !== 0;
    for (var y = 0; y < yilDugmeleri.length; y++) {
      yilDugmeleri[y].setAttribute('aria-pressed', String(yilDugmeleri[y].dataset.yil === durum.yil));
    }
    for (var m = 0; m < ilDugmeleri.length; m++) {
      ilDugmeleri[m].setAttribute('aria-pressed', String(ilDugmeleri[m].dataset.il === durum.il));
    }
    if (kaydet !== false) yazUrl();
  }

  function yazUrl() {
    var p = new URLSearchParams();
    if (durum.yil) p.set('yil', durum.yil);
    if (durum.il) p.set('il', durum.il);
    if (durum.secilenDurum) p.set('durum', durum.secilenDurum);
    if (durum.q) p.set('ara', durum.q);
    var qs = p.toString();
    var yeni = location.pathname + (qs ? '?' + qs : '');
    try { history.replaceState(null, '', yeni); } catch (e) { /* yoksay */ }
  }

  // Başlangıç: URL parametreleri
  try {
    var p = new URLSearchParams(location.search);
    durum.yil = p.get('yil') || '';
    durum.il = p.get('il') || '';
    durum.secilenDurum = p.get('durum') || '';
    durum.q = p.get('ara') || '';
    if (araKutu) araKutu.value = durum.q;
    if (durumSec) durumSec.value = durum.secilenDurum;
  } catch (e) { /* yoksay */ }

  for (var y = 0; y < yilDugmeleri.length; y++) {
    yilDugmeleri[y].addEventListener('click', function () {
      var v = this.dataset.yil;
      durum.yil = durum.yil === v ? '' : v;
      uygula();
    });
  }
  for (var m = 0; m < ilDugmeleri.length; m++) {
    ilDugmeleri[m].addEventListener('click', function () {
      var v = this.dataset.il;
      durum.il = durum.il === v ? '' : v;
      uygula();
    });
  }
  if (durumSec) durumSec.addEventListener('change', function () { durum.secilenDurum = durumSec.value; uygula(); });
  if (araKutu) araKutu.addEventListener('input', function () { durum.q = araKutu.value; uygula(); });
  if (sifirla) sifirla.addEventListener('click', function () {
    durum = { yil: '', il: '', secilenDurum: '', q: '' };
    if (araKutu) araKutu.value = '';
    if (durumSec) durumSec.value = '';
    uygula();
  });

  uygula(false);
})();
