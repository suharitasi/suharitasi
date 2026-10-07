import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  kelimeSinirindaKes, metinDurumu, maddeIndekslenir, maddeTarayiciBaslik,
  maddeAciklama, maddeOzCevap, TITLE_SINIR, OZ_CEVAP_SINIR,
} from '../../src/data/mevzuat-metin.js';

const ornek = {
  kanunKisa: '167', kanun: '167 Sayılı Yeraltı Suları Hakkında Kanun', madde: 'Madde 1', baslik: '',
  metin: 'Yeraltı suları umumi sular meyanında olup Devletin hüküm ve tasarrufu altındadır.Bu suların her türlü araştırılması, kullanılması, korunması ve tescili bu kanun hükümlerine tabidir.',
};

test('kelimeSinirindaKes kelime ortasında kesmez ve sınırı aşmaz', () => {
  const t = 'a'.repeat(50) + ' ' + 'b'.repeat(50) + ' ' + 'c'.repeat(50);
  const k = kelimeSinirindaKes(t, 120);
  assert.ok(k.length <= 120);
  assert.ok(k.endsWith('…'));
  assert.equal(k, 'a'.repeat(50) + ' ' + 'b'.repeat(50) + '…');
  assert.equal(kelimeSinirindaKes('kısa metin', 100), 'kısa metin');
});

test('metinDurumu: boş, yalnız mülga, kesik ve kirli ayrımı', () => {
  assert.deepEqual(metinDurumu(''), { bos: true, mulgaYalniz: false, kesik: false, kirli: false });
  assert.equal(metinDurumu('(Mülga: 2/7/2018 – KHK-703/69 md.)').mulgaYalniz, true);
  assert.equal(metinDurumu('(Ek: 29/3/2011-6215/8 md.; Mülga: 2/7/2018 – KHK-703/69 md.)').mulgaYalniz, true);
  assert.equal(metinDurumu('Bu kanun yayımı tarihinde yürürlüğe girer. Yürütme').kesik, true);
  assert.equal(metinDurumu('… yapılır. 7/6/2007 5747 11 22/3/2008 5766 16').kirli, true);
  assert.equal(metinDurumu('Bakanlar Kurulu yürütür. 167 SAYILI').kirli, true);
  assert.deepEqual(metinDurumu(ornek.metin), { bos: false, mulgaYalniz: false, kesik: false, kirli: false });
});

test('maddeIndekslenir: gövdeli tam metin açık, yer tutucu/kesik kapalı', () => {
  assert.equal(maddeIndekslenir(ornek), true);
  assert.equal(maddeIndekslenir({ ...ornek, metin: '(Mülga: 2/7/2018 – KHK-703/69 md.)' }), false);
  assert.equal(maddeIndekslenir({ ...ornek, metin: 'Kesik kalan bir cümle' }), false);
  assert.equal(maddeIndekslenir({ ...ornek, metin: '' }), false);
});

test('maddeTarayiciBaslik: kanun adını içerir, 60 karakteri aşmaz, başlık varsa ekler', () => {
  const t1 = maddeTarayiciBaslik(ornek);
  assert.equal(t1, '167 Sayılı Yeraltı Suları Hakkında Kanun Madde 1');
  const t2 = maddeTarayiciBaslik({ ...ornek, madde: 'Madde 2', baslik: 'Terimler' });
  assert.equal(t2, '167 Sayılı Yeraltı Suları Hakkında Kanun Madde 2: Terimler');
  const uzun = maddeTarayiciBaslik({ ...ornek, kanunKisa: '5686', kanun: '5686 Sayılı Jeotermal Kaynaklar ve Doğal Mineralli Sular Kanunu', madde: 'Madde 22', baslik: 'Ruhsat sahibinin yükümlülükleri ve idari para cezaları' });
  assert.ok(uzun.length <= TITLE_SINIR, uzun);
  assert.match(uzun, /Jeotermal/);
  assert.equal(maddeTarayiciBaslik(ornek, { seoBaslik: '167 m.1: Yeraltı sularının hukuki niteliği' }), '167 m.1: Yeraltı sularının hukuki niteliği');
});

test('maddeOzCevap ≤280 ve kelime ortasında kesilmez', () => {
  const uzunMetin = { ...ornek, metin: ('Yeraltı suyu ile ilgili uzun bir madde metni. ').repeat(20) };
  const oz = maddeOzCevap(uzunMetin);
  assert.ok(oz.length <= OZ_CEVAP_SINIR);
  assert.ok(oz.endsWith('…'));
  assert.ok(!/\s…$/.test(oz), 'kırpım boşlukla bitmez');
  const tam = maddeAciklama(uzunMetin);
  const govde = oz.slice(0, -1);
  assert.ok(tam.startsWith(govde), 'öz-cevap tam metnin önekidir');
  assert.ok(/[\s,;:(–—-]/.test(tam.charAt(govde.length)), 'kesim kelime sınırında (sonraki karakter ayraç)');
  assert.ok(maddeAciklama(ornek).startsWith('167 Sayılı Yeraltı Suları Hakkında Kanun Madde 1: Yeraltı'));
});

test('gerçek veri: hiçbir title 60 karakteri aşmaz, hepsi kanun adı taşır', () => {
  const m = JSON.parse(readFileSync(new URL('../../data/kamu/mevzuat-maddeleri.json', import.meta.url), 'utf8')).maddeler;
  for (const a of m) {
    const t = maddeTarayiciBaslik(a);
    assert.ok(t.length <= TITLE_SINIR, `${a.kanunKisa} ${a.madde}: ${t.length}`);
    assert.ok(!/^\d+ (Madde|Ek Madde|Geçici Madde)/.test(t), `çıplak başlık: ${t}`);
    assert.ok(maddeOzCevap(a).length <= OZ_CEVAP_SINIR);
  }
  const noindex = m.filter((a) => !maddeIndekslenir(a)).length;
  assert.ok(noindex < m.length / 4, `noindex oranı beklenmedik: ${noindex}/${m.length}`);
});
