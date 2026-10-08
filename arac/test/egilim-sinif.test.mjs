import { test } from 'node:test';
import assert from 'node:assert/strict';
import { egilimSinifi, ESIK_YON, ESIK_KRITIK } from '../../src/data/egilim-sinif.js';
import { graceEgilim } from '../../src/data/grace-hesap.js';

test('eşikler tek kuraldan: ≤−1,5 kritik düşüş · ≤−0,5 düşüş · |e|<0,5 dengeli · ≥0,5 yükseliş', () => {
  assert.equal(ESIK_YON, 0.5); assert.equal(ESIK_KRITIK, -1.5);
  assert.deepEqual(egilimSinifi(-2), { kod: 'kritik-dusus', etiket: 'Kritik düşüş', yon: 'azalma', kritik: true });
  assert.deepEqual(egilimSinifi(-1.5), { kod: 'kritik-dusus', etiket: 'Kritik düşüş', yon: 'azalma', kritik: true });
  assert.deepEqual(egilimSinifi(-0.66), { kod: 'dusus', etiket: 'Düşüş', yon: 'azalma', kritik: false });
  assert.deepEqual(egilimSinifi(-0.21), { kod: 'dengeli', etiket: 'Dengeli', yon: 'sabit', kritik: false });
  assert.deepEqual(egilimSinifi(0.7), { kod: 'yukselis', etiket: 'Yükseliş', yon: 'toparlanma', kritik: false });
  assert.equal(egilimSinifi(null), null);
});

test('graceEgilim yönü ve kritik bayrağı aynı kuraldan gelir', () => {
  const seri = {};
  let d = new Date(2021, 3, 1);
  for (let i = 0; i < 60; i++) {
    seri[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = 10 - i * (2 / 12);
    d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  }
  const s = graceEgilim(seri);
  assert.ok(s.egim < -1.5);
  assert.equal(s.yon, 'azalma'); assert.equal(s.kritik, true); assert.equal(s.sinif, 'kritik-dusus'); assert.equal(s.pencereYil, 5);
});
