// su-uyum.js — /hizmetler/su-uyum-dosyasi/ üreteci (Adım 4, 24.09.2026).
// İl + faaliyet seçimine göre kaynağı gösterilmiş uyum dosyasını kurar ve
// tarayıcı yazdırma penceresini açar (harici kütüphane YOK, sunucu YOK).
// Kurallar: K1-b (ceza tutarı yazılmaz), K2 (ilgili işlem + tüm 20 ek),
// K3 (ilgili emsal + tüm 26 ek), K4 (il ölçümü yerine havza LİNKİ),
// K5 (kapsam doğrulanamazsa "doğrulanamadı → uzman incelemesi"),
// K6 (ONAYLANDI=false ise belge TASLAK damgalı).
(function () {
  'use strict';
  var ilSec = document.getElementById('su-il');
  var faalSec = document.getElementById('su-faaliyet');
  var dugme = document.getElementById('su-olustur');
  var durum = document.getElementById('su-durum');
  if (!ilSec || !faalSec || !dugme) return;

  var veri = null;
  var yukleniyor = fetch('/veri/su-uyum.json', { cache: 'force-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) { veri = d; })
    .catch(function () { veri = null; });

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function tarihTR() {
    try { return new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch (e) { return ''; }
  }

  function kapsamCumlesi(f) {
    if (!f) return 'Faaliyetiniz Ek-2 listesinde doğrulanamadı; kapsam uzman incelemesi gerektirir.';
    if (f.kapsam === 'dogrulandi' && f.sonTarihMetin)
      return 'Faaliyetiniz Su Verimliliği Yönetmeliği Ek-2 kapsamında; yeşil su verimliliği belgesi son başvurusu ' + f.sonTarihMetin + '.';
    return 'Bu faaliyet için Ek-2 kapsamı doğrulanamadı (sabit yasal son tarih yok); kapsam uzman incelemesiyle netleştirilmelidir.';
  }

  function belgeKur(il, faaliyetSlug) {
    var iv = veri.ILLER[il] || { dsi: [], havzalar: [], suIdaresi: null, rg: [] };
    var f = faaliyetSlug === 'yok' ? null : veri.FAALIYETLER.filter(function (x) { return x.slug === faaliyetSlug; })[0] || null;
    var rehberler = f ? f.ilgiliIcerik.map(function (y) {
      return y.replace(/^\/rehberler\//, '').replace(/\/$/, '');
    }) : [];

    var ilgiliIslem = veri.ISLEMLER.filter(function (i) {
      return veri.CEKIRDEK_ISLEM.indexOf(i.id) !== -1 || (i.rehber && rehberler.indexOf(i.rehber) !== -1);
    });
    var ilgiliEmsal = f ? veri.EMSALLER.filter(function (e) {
      return (e.rehberler || []).some(function (r) { return rehberler.indexOf(r) !== -1; });
    }) : [];

    var taslak = veri.ONAYLANDI ? '' : '<p class="taslak"><strong>TASLAK</strong> — Bu belge hukuki denetim onayı beklemektedir; resmî başvuru öncesi avukat incelemesi gerekir.</p>';

    // Bölüm 4 — idari çerçeve
    var dsi = iv.dsi.length ? iv.dsi.map(function (b) { return b.no + '. Bölge (merkez: ' + b.merkez + ')'; }).join(' · ') : 'kayıt yok';
    var havzalar = iv.havzalar.length ? iv.havzalar.map(function (h) {
      return h.link ? '<a href="https://suharitasi.com' + h.link + '">' + esc(h.ad) + '</a>' : esc(h.ad);
    }).join(' · ') : 'kayıt yok';

    // Bölüm 5 — yükümlülük
    var yukumlulukBlok = f
      ? '<p>' + esc(f.yukumluluk) + '</p>' + (f.dayanak.length
          ? '<ul>' + f.dayanak.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>'
          : '')
      : '<p>Bu faaliyet için doğrulanmış yükümlülük kaydı bulunmuyor. Aşağıdaki genel işlem envanteri (Bölüm 7) yol gösterir; kapsam uzman incelemesi gerektirir.</p>';

    // Bölüm 6 — takvim
    var takvim = '<tr><td>Yeşil su verimliliği belgesi</td><td>Su Verimliliği Yön. md.3 + Ek-2</td><td>' +
      (f && f.sonTarihMetin ? esc(f.sonTarihMetin) : 'doğrulanamadı — uzman incelemesi') + '</td></tr>' +
      '<tr><td>Kullanma belgesi (kuyu varsa)</td><td>167 s.K. m.10</td><td>Su bulunca 1 ay içinde müracaat</td></tr>' +
      '<tr><td>Arama belgesi</td><td>167 s.K. m.8</td><td>süreç-bağlı</td></tr>';

    // Bölüm 7 — işlem tablosu
    function islemSatir(i) {
      return '<tr><td>' + esc(i.ad) + '</td><td>' + esc(i.dayanak || '—') + '</td><td>' +
        esc((i.yetkili || []).join(', ') || '—') + '</td><td>' + esc(i.kanal || '—') + '</td></tr>';
    }
    var islemIlgili = ilgiliIslem.map(islemSatir).join('');
    var islemEk = veri.ISLEMLER.map(islemSatir).join('');

    // Bölüm 8 — il RG kayıtları
    var rgBlok = iv.rg.length
      ? '<table><thead><tr><th>Tarih</th><th>Durum</th><th>Saha</th><th>Resmî Gazete</th></tr></thead><tbody>' +
        iv.rg.map(function (r) {
          var ad = r.saha || ('İlan pasajı' + (r.ilce && r.ilce.length ? ' (' + r.ilce.join(', ') + ')' : ''));
          return '<tr><td>' + esc(r.tarih) + '</td><td>' + esc(r.durum) + '</td><td>' + esc(ad) + '</td><td>' +
            (r.kaynak ? '<a href="' + esc(r.kaynak) + '">Resmî Gazete</a>' : '—') + '</td></tr>';
        }).join('') + '</tbody></table>'
      : '<p>İl eşlemeli Resmî Gazete kaydı bulunamadı. <strong>Kayıt bulunmaması kısıt olmadığının kanıtı değildir</strong>; güncel durum DSİ\'den teyit edilmelidir (YAS Tüzüğü m.2 ilan rejimi).</p>';

    // Bölüm 11 — emsal
    function emsalSatir(e) {
      return '<li><strong>' + esc((e.merci || '') + ', E.' + e.esas + ', K.' + e.karar) + '</strong> — ' +
        esc(e.konu) + '. <span class="soluk">Dava konusu (karar metninden): ' + esc(e.ozet) + '</span>' +
        (e.sayfa ? ' <a href="' + esc(e.sayfa) + '">karar sayfası</a>' : '') +
        (e.kaynak ? ' · <a href="' + esc(e.kaynak) + '">resmî karar metni</a>' : '') + '</li>';
    }
    var emsalIlgili = ilgiliEmsal.length ? '<ul>' + ilgiliEmsal.map(emsalSatir).join('') + '</ul>'
      : '<p>Seçilen faaliyetle doğrudan eşleşen emsal bulunamadı; aşağıdaki ek listede tüm kararlar yer alır.</p>';
    var emsalEk = '<ul>' + veri.EMSALLER.map(emsalSatir).join('') + '</ul>';

    // Bölüm 12 — çerçeve kaynakça
    var cerceveListe = veri.CERCEVE.map(function (c) {
      return '<li><strong>' + esc(c.kanunKisa + ' ' + c.madde) + '</strong>' +
        (c.baslik ? ' — ' + esc(c.baslik) : '') +
        (c.merci ? ' <span class="soluk">(merci: ' + esc(c.merci) + ')</span>' : '') +
        (c.kaynakUrl ? ' <a href="' + esc(c.kaynakUrl) + '">resmî metin</a>' : '') + '</li>';
    }).join('');

    return '<!doctype html><html lang="tr"><head><meta charset="utf-8">' +
      '<title>Su Uyum Dosyası — ' + esc(il) + (f ? ' · ' + esc(f.ad) : '') + '</title>' +
      '<style>' + stil() + '</style></head><body>' +
      taslak +
      '<h1>İşletmeye Özel Su Hukuku Uyum Dosyası</h1>' +
      '<p class="kunye"><strong>' + esc(il) + '</strong>' + (f ? ' · ' + esc(f.ad) + (f.nace ? ' (NACE ' + esc(f.nace) + ')' : '') : ' · faaliyet doğrulanamadı') + '</p>' +
      '<p class="kunye soluk">Hazırlayan: Su Haritası (suharitasi.com) · Hukuki denetim: Av. Serdar Arslan, Arslan Hukuk Bürosu · Belge tarihi: ' + tarihTR() + '</p>' +

      '<h2>1. Yönetici Özeti</h2>' +
      '<p>' + esc(il) + ' ilinde ' + (f ? esc(f.ad) : 'seçilen faaliyet') + ' için uygulanabilir su yükümlülükleri: ' + esc(kapsamCumlesi(f)) + '</p>' +
      '<p>İdari çerçeve: DSİ ' + esc(dsi) + '; havza(lar): ' + havzalar + '; su idaresi: ' + esc(iv.suIdaresi || 'açık kayıt yok') + '.</p>' +

      '<h2>2. İşletme ve Kapsam Kimliği</h2>' +
      '<table><tbody>' +
      '<tr><th>İl</th><td>' + esc(il) + '</td></tr>' +
      '<tr><th>Faaliyet</th><td>' + (f ? esc(f.ad) + ' (NACE ' + esc(f.nace || '—') + ')' : 'listede bulunamadı') + '</td></tr>' +
      '<tr><th>Ek-2 kapsamı</th><td>' + (f && f.kapsam === 'dogrulandi' ? 'kapsamda (doğrulandı)' : 'doğrulanamadı — uzman incelemesi') + '</td></tr>' +
      '<tr><th>Son başvuru</th><td>' + (f && f.sonTarihMetin ? esc(f.sonTarihMetin) : 'sabit tarih doğrulanmadı') + '</td></tr>' +
      '</tbody></table>' +

      '<h2>3. İlde Uygulanacak İdari Çerçeve</h2>' +
      '<p>DSİ bölge müdürlüğü: <strong>' + esc(dsi) + '</strong>. Havza(lar): ' + havzalar + '. Su ve kanalizasyon idaresi: <strong>' + esc(iv.suIdaresi || 'açık kayıt yok') + '</strong>. İl ölçümleri (baraj doluluk, uydu su ölçümü, yeraltı suyu kütlesi) için ilgili havza sayfasına bakınız.</p>' +

      '<h2>4. Uygulanabilir Yasal Yükümlülükler</h2>' + yukumlulukBlok +

      '<h2>5. Uyum Takvimi</h2>' +
      '<table><thead><tr><th>Yükümlülük</th><th>Dayanak</th><th>Son tarih</th></tr></thead><tbody>' + takvim + '</tbody></table>' +

      '<h2>6. Başvuru Envanteri (ilgili)</h2>' +
      '<table><thead><tr><th>İşlem</th><th>Dayanak</th><th>Yetkili kurum</th><th>Başvuru kanalı</th></tr></thead><tbody>' + islemIlgili + '</tbody></table>' +

      '<h2>7. İldeki Yeraltı Suyu Kısıtları</h2>' + rgBlok +

      '<h2>8. Yaptırım Çerçevesi</h2>' +
      '<p>167 s.K. m.18 uyarınca belgesiz iş yapanlar (a fıkrası) ile m.10/m.11 hükümlerine aykırı davrananlar (b fıkrası) hakkında <strong>idari para cezası</strong> uygulanır; ayrıca <strong>kuyu kapatılır ve masrafı açtırandan alınır</strong>. İdari para cezaları mahallî mülkî amir tarafından verilir. Ceza tutarları için resmî metin esastır; bu dosya tutar bildirmez.</p>' +

      '<h2>9. Yargı Yolu ve Süreler</h2>' +
      '<p>DSİ\'nin belge başvurusunu reddi veya mevcut belgeyi iptali bir idari işlemdir ve iptal davasına konu olabilir. İdari dava açma süresi İYUK m.7 uyarınca <strong>60 gün</strong>dür. Danıştay içtihadında işlemin sebebi somut kurulmalı; kazanılmış hak yok sayılamaz; işlem yetkili idarece tesis edilmeli ve teknik değerlendirme yapılmalıdır (167 s.K. m.13 ve m.18).</p>' +

      '<h2>10. İlgili Emsal Kararlar</h2>' + emsalIlgili +

      '<h2>11. Kontrol Listesi</h2>' +
      '<ul>' +
      '<li>Faaliyet kodunuz Su Verimliliği Yönetmeliği Ek-2 listesinde mi? (Ek-2)</li>' +
      '<li>Yeşil su verimliliği belgesi başvurusu — son: ' + (f && f.sonTarihMetin ? esc(f.sonTarihMetin) : 'doğrulanamadı') + ' (md.3)</li>' +
      '<li>Kuyu/sondaj varsa arama belgesi (167 s.K. m.8) ve sonrasında kullanma belgesi; ölçüm sistemi zorunlu (m.10)</li>' +
      '<li>Mevcut kuyuya müdahale edilecekse ıslah-tadil belgesi (m.11)</li>' +
      '<li>Su tahsisi gerekiyorsa DSİ\'ye tahsis talebi (Su Tahsisleri Yön. m.8-9)</li>' +
      '<li>İlinizde işletme sahası ilanı var mı? (Bölüm 7)</li>' +
      '</ul>' +

      '<h2>12. Kaynakça</h2><ul>' + cerceveListe + '</ul>' +
      '<p class="soluk">Veri künyeleri: Sitemde yayımlı kaynaklar (NHYP, Resmî Gazete, il-kurum eşlemesi). Her RG kaydının bağlantısı Bölüm 7\'dedir.</p>' +

      '<h2>13. Hukuki Şerh ve İletişim</h2>' +
      '<p>Bu dosya bilgilendirme amaçlıdır; somut bir uyuşmazlığa dair hukuki görüş veya tavsiye niteliği taşımaz. Resmî başvuru öncesi Av. Serdar Arslan (Arslan Hukuk Bürosu) incelemesi tavsiye edilir. · hukuk@arslanhukuk.tr</p>' +

      '<h2>Ek A — Tüm Başvuru İşlemleri (20)</h2>' +
      '<table><thead><tr><th>İşlem</th><th>Dayanak</th><th>Yetkili kurum</th><th>Başvuru kanalı</th></tr></thead><tbody>' + islemEk + '</tbody></table>' +
      '<h2>Ek B — Tüm Emsal Kararlar (' + veri.EMSALLER.length + ')</h2>' + emsalEk +
      '<p class="soluk dipnot">Belge, Su Haritası açık veri tabanından üretilmiştir. Kaynak sürümü belge tarihindeki yayınla eşleşir.</p>' +
      '</body></html>';
  }

  function stil() {
    return 'body{font:12pt/1.5 Georgia,"Times New Roman",serif;color:#132A3F;margin:1.6cm 1.5cm;max-width:19cm}' +
      'h1{font-size:20pt;margin:0 0 .2rem}h2{font-size:13pt;margin:1.4rem 0 .4rem;border-bottom:1px solid #9bb;padding-bottom:.15rem}' +
      '.kunye{margin:.1rem 0}.soluk{color:#48627A}.taslak{border:1px solid #875518;background:#faf6ef;padding:.6rem .8rem;font-size:10.5pt}' +
      'table{width:100%;border-collapse:collapse;font-size:10.5pt;margin:.3rem 0}' +
      'th,td{text-align:left;vertical-align:top;border:1px solid #bbb;padding:.3rem .4rem}' +
      'th{background:#eef3f6}ul{margin:.3rem 0;padding-left:1.1rem}li{margin:.15rem 0}' +
      'a{color:#0C5A7C}@page{margin:1.4cm}' +
      // Filigran (04.10.2026 §55): belge her zaman yazdırma amaçlıdır.
      'body::before{content:"suharitasi.com Tarafından Üretilmiştir";position:fixed;top:50%;left:50%;' +
      'transform:translate(-50%,-50%) rotate(-32deg);font:600 1.7rem/1 ui-monospace,monospace;' +
      'color:rgba(19,42,63,.10);letter-spacing:.06em;white-space:nowrap;pointer-events:none;z-index:9999;' +
      '-webkit-print-color-adjust:exact;print-color-adjust:exact}';
  }

  dugme.addEventListener('click', function () {
    var il = ilSec.value;
    var slug = faalSec.value;
    var bekle = function () {
      if (!veri) {
        if (durum) durum.textContent = 'Veri yüklenemedi; lütfen sayfayı yenileyip tekrar deneyin.';
        return;
      }
      var html = belgeKur(il, slug);
      var w = window.open('', '_blank');
      if (!w) {
        if (durum) durum.textContent = 'Açılır pencere engellendi. Tarayıcı izinlerinden bu site için açılır pencereye izin verin.';
        return;
      }
      w.document.open();
      w.document.write(html);
      w.document.close();
      setTimeout(function () { try { w.focus(); w.print(); } catch (e) { /* yazdırma engellendi */ } }, 350);
      if (durum) durum.textContent = 'Belge oluşturuldu. Yazdırma penceresinde "PDF olarak kaydet" seçin.';
    };
    if (veri) bekle(); else yukleniyor.then(bekle);
  });
})();
