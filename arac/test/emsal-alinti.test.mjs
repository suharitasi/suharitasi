import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  EMSAL_TUM, EMSAL_DOGRULANAN, EMSAL_YAYIN, emsalAlinti, emsalSlug, alintiMetni, dogrulandiMi,
} from '../../src/data/emsal.js';

const alinti = JSON.parse(readFileSync('data/kamu/emsal-alinti.json', 'utf8'));
const norm = (s) => s.replace(/\s+/g, ' ').trim();

test('emsal: her doğrulanan künyenin üç parçalı alıntısı var; doğrulanmayanın yok', () => {
  for (const k of EMSAL_DOGRULANAN) {
    const a = emsalAlinti(k);
    assert.ok(a, `${k.id}: alıntı yok`);
    for (const alan of ['uyusmazlik', 'gerekce', 'sonuc']) assert.ok(a[alan].length > 0, `${k.id}: ${alan} boş`);
  }
  for (const id of Object.keys(alinti.kararlar)) {
    assert.ok(dogrulandiMi(EMSAL_TUM.find((k) => k.id === id)), `${id}: doğrulanmamış künyeye alıntı`);
  }
});

test('emsal: alıntı parçaları resmî karar metninde birebir geçer (ham metin varsa)', () => {
  let sinanan = 0;
  const sinanmayan = [];
  for (const [id, a] of Object.entries(alinti.kararlar)) {
    const yol = `cikti/emsal-resmi/${id}.txt`;
    if (!existsSync(yol)) { sinanmayan.push(id); continue; }
    const ham = norm(readFileSync(yol, 'utf8'));
    for (const alan of ['uyusmazlik', 'gerekce', 'sonuc']) {
      for (const p of a[alan]) assert.ok(ham.includes(norm(p.metin)), `${id}/${alan}: metinde yok: ${p.metin.slice(0, 60)}`);
    }
    sinanan++;
  }
  if (sinanmayan.length) console.log(`# emsal-alinti: ${sinanmayan.length} kararın ham metni yok, birebirlik sınanmadı (${sinanmayan.join(', ')})`);
  console.log(`# emsal-alinti: ${sinanan} kararın alıntısı resmî metinle karşılaştırıldı`);
});

test('emsal: dışa verilen kayıtlar yalnız doğrulanmış, resmî bağlantılı ve tekil adresli', () => {
  const y = EMSAL_YAYIN('https://suharitasi.com');
  assert.equal(y.length, EMSAL_DOGRULANAN.length);
  for (const k of y) {
    assert.match(k.kaynak, /^https:\/\/(karararama\.danistay\.gov\.tr|emsal\.uyap\.gov\.tr)\//);
    assert.match(k.karar_tarihi, /^\d{2}\.\d{2}\.\d{4}$/);
    assert.ok(k.ozet.length > 20, `${k.id}: dava konusu alıntısı boş`);
  }
  const s = EMSAL_DOGRULANAN.map(emsalSlug);
  assert.equal(new Set(s).size, s.length);
});

test('emsal: alıntı metni atlanan kısmı […] ile gösterir', () => {
  assert.equal(alintiMetni([{ metin: 'a,', bas_kesik: true, son_kesik: false }, { metin: 'b', bas_kesik: false, son_kesik: true }]), '[…] a, b […]');
});
