// karar-motoru.js — Kuyu Karar Motoru (13.09.2026).
// İl + işlem + tebliğ tarihi → süre takvimi, merci, evrak listesi, dilekçe taslağı.
(function () {
  'use strict';
  var ilEl = document.getElementById('km-il'), isEl = document.getElementById('km-islem'),
      teEl = document.getElementById('km-teblig'), beEl = document.getElementById('km-belge'),
      sonuc = document.getElementById('km-sonuc');
  if (!ilEl || !sonuc) return;

  var ilVeri = null;
  fetch('/veri/iller.json', { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : []; })
    .then(function (d) { ilVeri = d; ciz(); }).catch(function () { ilVeri = []; ciz(); });

  var DATA = {
    ruhsatsiz: {
      dayanak: '167 s.K. m.18/a', ceza: '1.000–5.000 TL idari para cezası + kuyu kapatma',
      merci: 'Cezayı mahallî mülkî amir (valilik/kaymakamlık) verir.',
      evrak: ['Tebliğ / ceza tutanağı (tebliğ tarihi görünür)', 'Tapu veya parsel/kroki bilgisi', 'Kuyu/sondaj teknik bilgileri (yer, derinlik, çap)', 'Varsa arama/kullanma belgesi', 'Ölçüm sistemi durumu', 'Kimlik ve iletişim bilgileri'],
    },
    tahsis: {
      dayanak: '167 s.K. m.10-11, m.18/b', ceza: '500–2.000 TL idari para cezası + kuyu kapatma',
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

  function gunEkle(iso, gun) { var d = new Date(iso + 'T00:00:00'); if (isNaN(d)) return null; d.setDate(d.getDate() + gun); return d; }
  function tr(d) { return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function kalan(d) { var b = new Date(); b.setHours(0, 0, 0, 0); return Math.round((d - b) / 86400000); }
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
    if (teblig) {
      var s15 = gunEkle(teblig, 15), s60 = gunEkle(teblig, 60);
      var k15 = kalan(s15), k60 = kalan(s60);
      sureHtml =
        '<div class="km-sure"><strong>Zorunlu süreler</strong><br>' +
        'Sulh ceza hakimliğine başvuru (5326 s.K. m.27): <strong>' + tr(s15) + '</strong> (' + (k15 >= 0 ? k15 + ' gün kaldı' : 'süre geçmiş olabilir') + ')<br>' +
        'İdare mahkemesinde iptal davası (İYUK): <strong>' + tr(s60) + '</strong> (' + (k60 >= 0 ? k60 + ' gün kaldı' : 'süre geçmiş olabilir') + ')' +
        '<br><span class="km-not">Hangi yolun geçerli olduğu somut dosyaya göre değişir.</span></div>';
    } else {
      sureHtml = '<div class="km-sure">Tebliğ tarihini girin: 15 gün (sulh ceza) ve 60 gün (idare mahkemesi) son tarihleri hesaplanır.</div>';
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

  [ilEl, isEl, teEl, beEl].forEach(function (e) { if (e) e.addEventListener('change', ciz); });
})();
