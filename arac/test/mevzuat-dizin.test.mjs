import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { maddeDizinKarari, suSozcuguVar, yururlukMaddesi } from '../../src/data/mevzuat-dizin.js';

const M = JSON.parse(readFileSync('data/kamu/mevzuat-maddeleri.json', 'utf8')).maddeler;
const bul = (k, m) => M.find((a) => a.kanunKisa === k && a.madde === m);

test('mevzuat dizini: brifteki örnekler kapalı, su maddeleri açık', () => {
  for (const [k, m] of [['5393', 'Madde 39'], ['5393', 'Madde 81'], ['2886', 'Madde 77'], ['2886', 'Madde 80']]) {
    assert.equal(maddeDizinKarari(bul(k, m)).dizin, false, `${k} ${m}`);
  }
  assert.equal(maddeDizinKarari(bul('167', 'Madde 18')).dizin, true);
  assert.equal(maddeDizinKarari(bul('2886', 'Madde 51')).dizin, true);
});

test('mevzuat dizini: su sözcüğü Türkçe büyük harfle ve ekli biçimde tanınır, benzer sözcük tanınmaz', () => {
  assert.ok(suSozcuguVar('DSİ Genel Müdürlüğü'));
  assert.ok(suSozcuguVar('Barajlardan'));
  assert.ok(suSozcuguVar('içme suyu tesisleri'));
  assert.equal(suSozcuguVar('suç ve süre sureti'), false);
  assert.equal(suSozcuguVar('kaynak tahsisi'), false);
});

test('mevzuat dizini: tek cümlelik yürürlük/yürütme maddesi kapalı', () => {
  assert.ok(yururlukMaddesi({ metin: 'Bu Kanun yayımı tarihinde yürürlüğe girer.' }));
  assert.ok(yururlukMaddesi({ metin: 'Bu Kanun hükümlerini Cumhurbaşkanı yürütür.' }));
  assert.equal(yururlukMaddesi({ metin: 'Yeraltı suları Devletin hüküm ve tasarrufu altındadır. Bu Kanun yürürlüğe girer.' }), false);
});
