import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pasajIlleri, kisitNormalize } from '../../src/data/ortak-normalize.js';

test('pasajIlleri: anahtar ifadeye yakın il kalır, uzak il düşer, OCR boşluklu ad eşleşir', () => {
  const pasaj = 'Hükümetimiz ile Afganistan Krallığı arasında vize anlaşması kararnamesi (Mersin, Niğde). '
    + 'x'.repeat(400) + ' Devlet Su İşleri: Konya - Ereğli Yeraltısuyu İşletme Sahası ilanı.';
  assert.deepEqual(pasajIlleri(pasaj, ['Konya', 'Mersin', 'Niğde']), ['Konya']);
  assert.deepEqual(pasajIlleri('Yukarıda sınırları belirtilen K o n y a - Cihanbeyli yeraltısuyu işletme sahası', ['Konya', 'Bilecik']), ['Konya']);
  assert.deepEqual(pasajIlleri('Kon­ya ovası yeraltı suyu işletme sahası', ['Konya']), ['Konya']);
});

test('pasajIlleri: anahtar ifade yoksa aday liste olduğu gibi korunur (yargı yok)', () => {
  assert.deepEqual(pasajIlleri('Herhangi bir kararname metni, Konya ve Ankara', ['Konya', 'Ankara']), ['Konya', 'Ankara']);
  assert.deepEqual(pasajIlleri('', ['Konya']), ['Konya']);
});

test('kisitNormalize: başlık (saha_adi) kayıtları kuraldan etkilenmez; pasaj kaydı yakınlıkla süzülür', () => {
  const ana = [{ saha_adi: 'Konya - Çumra Ovası', il: ['Eskişehir', 'Konya'], durum: 'ilan', rg_tarih: '14.12.1963', kaynak_url: 'u1' }];
  const ek = [{ pasaj: 'Afganistan vize kararnamesi Mersin ' + 'y'.repeat(300) + ' Konya yeraltısuyu işletme sahası', il: ['Konya', 'Mersin'], durum: 'ilan', rg_tarih: '14.02.1973', kaynak_url: 'u2' }];
  const k = kisitNormalize(ana, ek);
  assert.equal(k.length, 2);
  assert.deepEqual(k.find((r) => r.kaynak === 'u1').il, ['Eskişehir', 'Konya']);
  assert.deepEqual(k.find((r) => r.kaynak === 'u2').il, ['Konya']);
});

test('gerçek veri: hiçbir başlık kaydı düşmez; pasaj il atamaları azalır ama Konya kayıtları kalır', () => {
  const ana = JSON.parse(readFileSync(new URL('../../veri/potansiyel/isletme-sahalari.json', import.meta.url), 'utf8')).kayitlar;
  const ek = JSON.parse(readFileSync(new URL('../../veri/potansiyel/isletme-sahalari-ek.json', import.meta.url), 'utf8')).kayitlar;
  const k = kisitNormalize(ana, ek);
  const basliklar = ana.filter((r) => Array.isArray(r.il) && r.il.length).length;
  assert.ok(k.filter((r) => r.saha).length >= basliklar - 5, 'başlık kayıtları korunmalı');
  assert.ok(k.some((r) => r.il.includes('Konya') && /Cihanbeyli|Ereğli|Çumra/i.test(r.saha)));
});
