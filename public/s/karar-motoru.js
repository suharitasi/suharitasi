// karar-motoru.js — Tebliğ Aldım: Süre ve İtiraz Yolu (13.09.2026; ad DURAK 1 D).
// İl + işlem + tebliğ tarihi → süre takvimi, merci, evrak listesi, dilekçe taslağı.
// DURAK 1 A-b (10.10.2026): süreler tek tablodan (#sure-kurallar ← data/kamu/sure-tablosu.json),
// hesap tek modülden (/s/sure-hesap.js ← src/data/sure-hesap.js). Hukuki onay bekliyor.
import { sonGun, kalanGun } from '/s/sure-hesap.js';
var SURE = null;
try { SURE = JSON.parse(document.getElementById('sure-kurallar').textContent); } catch (e) { SURE = null; }
(function () {
  'use strict';
  var ilEl = document.getElementById('km-il'), isEl = document.getElementById('km-islem'),
      teEl = document.getElementById('km-teblig'), beEl = document.getElementById('km-belge'),
      ktEl = document.getElementById('km-karar-turu'),
      sonuc = document.getElementById('km-sonuc');
  if (!ilEl || !sonuc) return;

  var ilVeri = null;
  fetch('/veri/iller.json', { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : []; })
    .then(function (d) { ilVeri = d; ciz(); }).catch(function () { ilVeri = []; ciz(); });

  // DURAK 1 A-a (10.10.2026): ceza aralıkları sayfadaki #km-ceza'dan (tek kaynak: src/data/ceza-tutar.js).
  var CEZA = { a: '1.000–5.000 TL (kanun metni)', b: '500–2.000 TL (kanun metni)' };
  try { var _c = JSON.parse(document.getElementById('km-ceza').textContent); if (_c && _c.a && _c.b) CEZA = _c; } catch (e) { /* kanun metni kalır */ }

  var DATA = {
    ruhsatsiz: {
      dayanak: '167 s.K. m.18/a', ceza: 'İdari para cezası ' + CEZA.a + ' + kuyu kapatma',
      merci: 'Cezayı mahallî mülkî amir (valilik/kaymakamlık) verir.',
      evrak: ['Tebliğ / ceza tutanağı (tebliğ tarihi görünür)', 'Tapu veya parsel/kroki bilgisi', 'Kuyu/sondaj teknik bilgileri (yer, derinlik, çap)', 'Varsa arama/kullanma belgesi', 'Ölçüm sistemi durumu', 'Kimlik ve iletişim bilgileri'],
    },
    tahsis: {
      dayanak: '167 s.K. m.10-11, m.18/b', ceza: 'İdari para cezası ' + CEZA.b + ' + kuyu kapatma',
      merci: 'DSİ tespiti; cezayı mahallî mülkî amir verir.',
      evrak: ['Kullanma/ıslah-tadil belgesi', 'Ölçüm kayıtları (çekim miktarı)', 'DSİ yazışmaları / tebliğ', 'Tahsis belgesi veya başvuru', 'Kuyu teknik dosyası'],
    },
    kapatma: {
      dayanak: '167 s.K. m.18', ceza: 'Kuyu kapatma kararı ve masrafı',
      merci: 'Kapatma kararı idarece verilir; itiraz idari yargıya taşınabilir.',
      evrak: ['Kapatma kararı/tebliği', 'Kuyu belgeleri (arama/kullanma)', 'Kuyu teknik dosyası', 'Tebliğ belgesi', 'İtiraz dilekçesi'],
    },
    itiraz: {
      dayanak: '167 s.K. m.18 + 5326 s.K. m.27 / İYUK', ceza: 'İtiraz konusu: idari para cezası',
      merci: 'İtiraz yolu tartışmalıdır: sulh ceza hakimliği (5326 m.27) veya idare mahkemesi (İYUK).',
      evrak: ['İdari para cezası tebliği', 'Ceza tutanağı', 'Kimlik', 'Varsa belge/ruhsat', 'İtiraz/dava dilekçesi', 'Deliller'],
    },
  };

  function tr(d) { return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function kacir(s) { return (s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function ilBilgi(il) { if (!ilVeri) return null; return ilVeri.find(function (x) { return x.il === il; }) || null; }

  function ciz() {
    var il = ilEl.value, islem = isEl.value;
    if (!il) {
      sonuc.innerHTML = '';
      document.dispatchEvent(new CustomEvent('km-taslak', { detail: { temizle: true } }));
      return;
    }
    var d = DATA[islem] || DATA.ruhsatsiz;
    var ib = ilBilgi(il);
    var bolge = ib && ib.dsiBolgeleri && ib.dsiBolgeleri.length
      ? ib.dsiBolgeleri.map(function (b) { return b.no + '. Bölge (merkez: ' + b.merkez + ')'; }).join(' · ') : 'DSİ bölge eşlemesi doğrulanmadı';
    var teblig = teEl.value;

    var sureHtml = '';
    var dal = ktEl ? ktEl.value : '';
    if (teblig && SURE) {
      var yollar = dal ? [dal] : ['kabahat', 'idari', 'birlikte'];
      var notlar = [];
      var satirlar = yollar.map(function (id) {
        var y = SURE.yollar[id]; var r = sonGun(teblig, id, SURE); if (!r) return '';
        r.notlar.forEach(function (n) { if (notlar.indexOf(n) < 0) notlar.push(n); });
        var k = kalanGun(r.son);
        return '<li><strong>' + kacir(y.ad) + '</strong> — ' + kacir(y.merci) + ': son gün <strong>' + tr(r.son) + '</strong> (' +
          (k >= 0 ? k + ' gün kaldı' : 'süre geçmiş olabilir') + ') · ' + kacir(y.dayanak) + '</li>';
      }).join('');
      sureHtml =
        '<div class="km-sure"><strong>Zorunlu süreler</strong><ul>' + satirlar + '</ul>' +
        (dal ? '' : '<span class="km-not">Kararda yalnız para cezası, yalnız kapatma/iptal ya da ikisi birlikte olabilir; yukarıdan seçerek tek yolu görebilirsiniz.</span>') +
        '<ul class="km-not">' + notlar.map(function (n) { return '<li>' + kacir(n) + '</li>'; }).join('') + '</ul></div>';
    } else {
      sureHtml = '<div class="km-sure">Tebliğ tarihini girin: para cezasına başvuru (sulh ceza, 15 gün) ve iptal davası (idare mahkemesi, 60 gün) son günleri hesaplanır.</div>';
    }

    var evrak = '<div class="km-blok"><h3>Gerekli evrak listesi</h3><ul>' + d.evrak.map(function (e) { return '<li>' + kacir(e) + '</li>'; }).join('') + '</ul></div>';

    // Dilekçe taslağı + canlı denetim artık DilekceDenetimMotoru bileşenindedir.
    // Süre takvimi/merci/evrak burada kalır; taslak için bağlam (il/işlem/merci/
    // tarih/dayanak) tek yönlü CustomEvent ile aktarılır (ADIM 4, v6.0).
    var tarih = teblig ? tr(new Date(teblig + 'T00:00:00')) : '';
    var merci = islem === 'itiraz'
      ? 'SULH CEZA HAKİMLİĞİNE / İDARE MAHKEMESİNE'
      : (il + ' VALİLİĞİNE / KAYMAKAMLIĞINA');

    sonuc.innerHTML =
      '<div class="km-kart">' +
      '<h2>' + kacir(il) + ' — ' + kacir(islemAdi(islem)) + '</h2>' +
      '<p class="km-merci"><strong>Yetkili merci:</strong> ' + kacir(d.merci) + ' · <strong>DSİ:</strong> ' + kacir(bolge) + '</p>' +
      '<p class="km-ceza"><strong>Dayanak:</strong> ' + kacir(d.dayanak) + ' · <strong>Yaptırım:</strong> ' + kacir(d.ceza) + '</p>' +
      sureHtml + evrak +
      '<div class="km-blok"><button type="button" class="km-yazdir" id="km-yazdir">Bu karneyi yazdır / PDF</button></div>' +
      '</div>';

    var btn = document.getElementById('km-yazdir');
    if (btn) btn.addEventListener('click', function () { window.print(); });

    document.dispatchEvent(new CustomEvent('km-taslak', { detail: {
      il: il, islem: islem, islemAd: islemAdi(islem), merci: merci,
      teblig: teblig || '', tarih: tarih || '', dayanak: d.dayanak,
    } }));
  }

  function islemAdi(id) { return { ruhsatsiz: 'Ruhsatsız kuyu açma', tahsis: 'Tahsis/izin aşımı', kapatma: 'Kuyu kapatma tebliği', itiraz: 'İdari para cezasına itiraz' }[id] || id; }

  [ilEl, isEl, teEl, beEl, ktEl].forEach(function (e) { if (e) e.addEventListener('change', ciz); });
})();
