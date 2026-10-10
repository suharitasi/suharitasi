import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pasajIlleri, kisitNormalize, rgGruplari } from '../../src/data/ortak-normalize.js';

test('pasajIlleri: anahtar ifadeye yakın il kalır, uzak il düşer, OCR boşluklu ad eşleşir', () => {
  const pasaj = 'Hükümetimiz ile Afganistan Krallığı arasında vize anlaşması kararnamesi (Mersin, Niğde). '
    + 'x'.repeat(400) + ' Devlet Su İşleri: Konya - Ereğli Yeraltısuyu İşletme Sahası ilanı.';
  assert.deepEqual(pasajIlleri(pasaj, ['Konya', 'Mersin', 'Niğde']), ['Konya']);
  assert.deepEqual(pasajIlleri('Yukarıda sınırları belirtilen K o n y a - Cihanbeyli yeraltısuyu işletme sahası', ['Konya', 'Bilecik']), ['Konya']);
  assert.deepEqual(pasajIlleri('Kon­ya ovası yeraltı suyu işletme sahası', ['Konya']), ['Konya']);
});

test('pasajIlleri: ilçe adı yakınsa il kalır; hiçbir il/ilçe yakın değilse aday liste korunur (yargı yok)', () => {
  assert.deepEqual(pasajIlleri('… ALANYA OVALARI YERALTISUYU İŞLETME SAHASI İLANI …', ['Antalya'], { Alanya: ['Antalya'] }), ['Antalya']);
  assert.deepEqual(pasajIlleri('x'.repeat(500) + ' yeraltısuyu işletme sahaları ilanı ' + 'y'.repeat(500) + ' Afyonkarahisar', ['Afyonkarahisar']), ['Afyonkarahisar']);
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

test('gerçek veri: "İŞLETME SAHASI İLANI" içeren hiçbir pasaj kaydı il\'siz kalmaz; il eşlemeli kayıt sayısı değişmez; başlık kayıtları düşmez', () => {
  const ek = JSON.parse(readFileSync(new URL('../../veri/potansiyel/isletme-sahalari-ek.json', import.meta.url), 'utf8')).kayitlar;
  const sik = (s) => String(s ?? '').toLocaleLowerCase('tr-TR').replace(/[\s\u00AD\-–—.,;:()«»"'’]+/g, '');
  let ilOnce = 0, ilSonra = 0;
  for (const k of ek) {
    const il = (Array.isArray(k.il) ? k.il : []).filter((x) => x && !/belirsiz/i.test(x));
    const y = pasajIlleri(k.pasaj, il, k.ilceler);
    if (il.length) ilOnce++;
    if (y.length) ilSonra++;
    if (il.length && /işletmesaha/.test(sik(k.pasaj))) assert.ok(y.length > 0, `ilan kaydı il'siz kaldı: ${k.rg_tarih} ${il.join('/')}`);
    for (const i of y) assert.ok(il.includes(i), 'kural il eklemez, yalnız süzer');
  }
  assert.equal(ilSonra, ilOnce, 'il eşlemeli pasaj kaydı sayısı korunur (liste boşalmaz)');
});

test('gerçek veri (eski): başlık kayıtları düşmez; Konya kayıtları kalır', () => {
  const ana = JSON.parse(readFileSync(new URL('../../veri/potansiyel/isletme-sahalari.json', import.meta.url), 'utf8')).kayitlar;
  const ek = JSON.parse(readFileSync(new URL('../../veri/potansiyel/isletme-sahalari-ek.json', import.meta.url), 'utf8')).kayitlar;
  const k = kisitNormalize(ana, ek);
  const basliklar = ana.filter((r) => Array.isArray(r.il) && r.il.length).length;
  assert.ok(k.filter((r) => r.saha).length >= basliklar - 5, 'başlık kayıtları korunmalı');
  assert.ok(k.some((r) => r.il.includes('Konya') && /Cihanbeyli|Ereğli|Çumra/i.test(r.saha)));
});

test('rgGruplari: aynı gazete sayısı + aynı durum tek tekil ilandır; iller birleşir; il\'siz grup notunu taşır (10.10.2026)', () => {
  const baslik = [{ saha_adi: 'Niğde ve Afyonda Bazı Yerlerin …', il: ['Niğde'], il_kaynagi: 'RG fihrist başlığı', durum: 'işletme sahası ilanı/değişikliği', rg_tarih: '26.09.1968', kaynak_url: 'u1' }];
  const ilan = [
    { pasaj: 'Niğde - Gölcük ovası, Afyon - Büyük Sincanlı Ovası …', il: ['Afyonkarahisar', 'Niğde'], il_kaynagi: 'ilan metni', durum: 'işletme sahası ilanı/değişikliği', rg_tarih: '26.09.1968', kaynak_url: 'u1' },
    { pasaj: 'Ergene Havzası …', il: [], il_kaynagi: 'doğrulanamadı', il_notu: 'Ergene havzası — il belirtilmemiş; sınır kararnamenin ekli haritasında', durum: 'işletme sahası ilanı/değişikliği', rg_tarih: '08.05.1974', kaynak_url: 'u2' },
    { pasaj: '… kuyu açılması yasaklanmıştır', il: ['Niğde'], il_kaynagi: 'ilan metni', durum: 'tahsise kapatma/kısıt', rg_tarih: '26.09.1968', kaynak_url: 'u1' },
  ];
  const g = rgGruplari(baslik, ilan);
  assert.equal(g.length, 3, 'u1 işletme + u1 kısıt + u2');
  const u1 = g.find((x) => x.kaynak === 'u1' && /işletme/.test(x.durum));
  assert.deepEqual(u1.il, ['Afyonkarahisar', 'Niğde']);
  assert.equal(u1.kayit, 2);
  assert.equal(u1.saha, 'Niğde ve Afyonda Bazı Yerlerin …');
  const u2 = g.find((x) => x.kaynak === 'u2');
  assert.deepEqual(u2.il, []);
  assert.match(u2.ilNotu, /Ergene havzası — il belirtilmemiş/);
  assert.equal(kisitNormalize(baslik, ilan).length, 2, 'kisit.json il\'siz grubu içermez');
});
