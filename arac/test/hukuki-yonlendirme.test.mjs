import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hukukiYonlendirme, hukukiYonlendirmeGoster, KALDIR, KALSIN } from '../../src/data/hukuki-yonlendirme.js';

test('KALDIR aileleri bloğu gizler', () => {
  for (const y of ['/mevzuat/', '/mevzuat/167/madde-1/', '/veri/', '/veri/raporlar/2026-10/', '/acik-veri/', '/api-dokumantasyonu/',
    '/ajan-erisimi/', '/havzalar/sakarya/', '/nehirler/esen-cayi/', '/goller/tuz-golu/', '/tahmin/', '/sozluk/', '/arsiv/resmi-gazete/', '/en/']) {
    assert.equal(hukukiYonlendirme(y), 'kaldir', y);
    assert.equal(hukukiYonlendirmeGoster(y), false, y);
  }
});

test('KALSIN aileleri bloğu gösterir', () => {
  for (const y of ['/', '/rehberler/kuyu-ruhsati/', '/kuyu-ruhsati/konya/', '/hizmetler/su-uyum-dosyasi/', '/hizli-danisma/', '/whatsapp/']) {
    assert.equal(hukukiYonlendirme(y), 'kalsin', y);
    assert.equal(hukukiYonlendirmeGoster(y), true, y);
  }
});

test('liste dışı aileler mevcut davranışı korur (degistirme → gösterilir)', () => {
  for (const y of ['/harita/', '/yeralti-suyu/ankara/', '/durumum/otel/', '/su-kanunu/taslak-takibi/', '/islem-matrisi/', '/nerede-su-cikar/', '/hakkinda/']) {
    assert.equal(hukukiYonlendirme(y), 'degistirme', y);
    assert.equal(hukukiYonlendirmeGoster(y), true, y);
  }
});

test('eğik çizgisiz ve sorgulu yollar aynı sonucu verir; önek çakışması yok', () => {
  assert.equal(hukukiYonlendirme('/mevzuat'), 'kaldir');
  assert.equal(hukukiYonlendirme('/mevzuat/?x=1'), 'kaldir');
  assert.equal(hukukiYonlendirme('/havza-riski/'), 'degistirme');
  assert.equal(hukukiYonlendirme('/verim/'), 'degistirme');
  assert.ok(KALDIR.every((k) => k.startsWith('/') && k.endsWith('/')));
  assert.ok(KALSIN.every((k) => k.startsWith('/') && k.endsWith('/')));
});
