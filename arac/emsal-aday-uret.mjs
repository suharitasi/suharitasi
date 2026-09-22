#!/usr/bin/env node
/* ============================================================================
   EMSAL ADAY ÜRETİCİ — ADIM 5 (v6.0), 22.09.2026.
   ----------------------------------------------------------------------------
   NE YAPAR: veri/ham/yargi/<kaynak>/kunye.json içindeki resmî karar künyelerini
   `data/emsal-adaylari.json` aday havuzuna aktarır — YAYIMLANMIŞ 15 künye ile
   ve kendi içinde MÜKERRER ELEME yaparak, `dogrulama:"bekliyor"` durumuyla.

   K7 (UYDURMA YASAĞI): Adaya YALNIZ resmî künye (merci/esas/karar/yıl) ve
   doğrudan karar bağlantısı yazılır. `ozet` BOŞ bırakılır — karar metni
   incelenmeden özet ÜRETİLMEZ; `dogrulama` kullanıcı [SERDAR-HUKUK] onayına
   kadar "bekliyor" kalır. Havuzu site OKUMAZ; yayına giren künye ayrı ve elle
   `data/kamu/emsal-kararlar.json`'a taşınır.

   KULLANIM:  node arac/emsal-aday-uret.mjs [--limit 120]
   ÇIKIŞ: her zaman 0 (bilgi amaçlı); dosya yazılamazsa 1.
   ========================================================================== */
import { readFileSync, writeFileSync, existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const KOK = process.cwd();
const arg = (ad, v) => { const i = process.argv.indexOf(ad); return i >= 0 && process.argv[i + 1] ? Number(process.argv[i + 1]) : v; };
const LIMIT = arg('--limit', 120);
const MERCI_TAVAN = arg('--merci-tavan', 20); // tek daireden en çok kaç aday (çeşitlilik)

const HAVUZ = join(KOK, 'data/emsal-adaylari.json');
const YAYIM = join(KOK, 'data/kamu/emsal-kararlar.json');
const KAYNAK_DIZIN = join(KOK, 'veri/ham/yargi');

const TABANLAR = { danistay: 'https://karararama.danistay.gov.tr', uyap: 'https://emsal.uyap.gov.tr' };

const oku = (yol, vars) => { try { return JSON.parse(readFileSync(yol, 'utf8')); } catch { return vars; } };
const tr = (s) => String(s || '').toLocaleLowerCase('tr');

// Künye anahtarı: esas + karar (merci yazımı kaynaklar arasında değişebiliyor)
const anahtar = (esas, karar) => `${String(esas || '').replace(/[^0-9/]/g, '')}|${String(karar || '').replace(/[^0-9/]/g, '')}`;
const yil = (tarih) => { const m = String(tarih || '').match(/(19|20)\d{2}/); return m ? Number(m[0]) : null; };

const havuz = oku(HAVUZ, null);
if (!havuz) { console.error('[aday] data/emsal-adaylari.json yok/bozuk'); process.exit(1); }
const yayim = oku(YAYIM, { kararlar: [] });

// Yayımlanmış künyeler: (merci+esas+karar) ve (esas+karar) kümeleri
const yayimKunye = new Set();
const yayimEsasKarar = new Set();
for (const k of yayim.kararlar || []) {
  yayimKunye.add(`${tr(k.merci)}|${k.esas}|${k.karar}`);
  yayimEsasKarar.add(anahtar(k.esas, k.karar));
}

// Ham kaynakları oku
const ham = [];
for (const kaynak of Object.keys(TABANLAR)) {
  const d = oku(join(KAYNAK_DIZIN, kaynak, 'kunye.json'), null);
  if (d?.kararlar) for (const r of d.kararlar) ham.push({ ...r, _kaynak: kaynak });
}

// KULLANICI KARARLARI KORUNUR: dogrulama != 'bekliyor' olan adaylar aynen kalır.
const korunacak = (havuz.adaylar || []).filter((a) => a.dogrulama && a.dogrulama !== 'bekliyor');
const mevcut = new Set(korunacak.map((a) => anahtar(a.esas, a.karar)));
const secilen = new Map();
const merciSayac = {};
let atlananYayim = 0, atlananMukerrer = 0, atlananCesitlilik = 0;

// Öncelik: Danıştay (idari) önce; su hukukunda 8. Daire başta; sonra yıl.
const merciPuan = (kurum) => {
  const m = String(kurum || '');
  if (/8\. Daire/.test(m)) return 0;
  if (/6\. Daire/.test(m)) return 1;
  if (/İdare Dava Daireleri/.test(m)) return 2;
  if (/10\. Daire/.test(m)) return 3;
  if (/13\. Daire/.test(m)) return 4;
  if (/Daire|Kurul/.test(m)) return 5;
  return 6; // UYAP (BAM/mahkeme)
};
const siralı = ham.slice().sort((a, b) => {
  const pa = a._kaynak === 'danistay' ? 0 : 1, pb = b._kaynak === 'danistay' ? 0 : 1;
  if (pa !== pb) return pa - pb;
  const ma = merciPuan(a.kurum), mb = merciPuan(b.kurum);
  if (ma !== mb) return ma - mb;
  return (yil(b.kararTarihi) || 0) - (yil(a.kararTarihi) || 0);
});

for (const r of siralı) {
  const key = anahtar(r.esasNo, r.kararNo);
  if (!r.esasNo || !r.kararNo) continue;
  if (yayimEsasKarar.has(key) || yayimKunye.has(`${tr(r.kurum)}|${r.esasNo}|${r.kararNo}`)) { atlananYayim++; continue; }
  if (mevcut.has(key) || secilen.has(key)) { atlananMukerrer++; continue; }
  const mk = r.kurum || '';
  if ((merciSayac[mk] || 0) >= MERCI_TAVAN) { atlananCesitlilik++; continue; }
  merciSayac[mk] = (merciSayac[mk] || 0) + 1;
  secilen.set(key, {
    id: `${r._kaynak}-${r.id}`,
    merci: r.kurum,
    esas: r.esasNo,
    karar: r.kararNo,
    yil: yil(r.kararTarihi),
    konu: r._arananKelime || (r.seedler || []).join(', '),
    ozet: '', // K7: karar metni incelenmeden özet üretilmez
    kaynak_url: `${TABANLAR[r._kaynak]}/getDokuman?id=${r.id}&arananKelime=${encodeURIComponent(r._arananKelime || '')}`,
    kaynak_turu: 'uyap', // Danıştay + UYAP: Adalet Bakanlığı karar-arama ailesi
    dogrulama: 'bekliyor',
    rehberler: [],
    maddeler: [],
    not: `Kaynak: ${r._kaynak} karar-arama (Adalet); içerik özeti henüz çıkarılmadı (K7).${r.durum ? ` Durum: ${r.durum}.` : ''}`,
    _cekim: r.kararTarihi || null,
  });
  if (secilen.size >= LIMIT) break;
}

const yeni = [...secilen.values()];
const adaylar = [...korunacak, ...yeni]; // incelenmiş adaylar korunur, 'bekliyor' havuzu tazelenir

// İDEMPOTENT: aday listesi değişmediyse dosyayı YENİDEN YAZMA (cron'da kirli
// ağaç üretmesin; son_guncelleme yalnız gerçek değişimde tazelenir).
const degisti = JSON.stringify(adaylar) !== JSON.stringify(havuz.adaylar || []);
if (degisti) {
  const cikti = { ...havuz, son_guncelleme: new Date().toISOString().slice(0, 10), aday_sayisi: adaylar.length, adaylar };
  const gecici = HAVUZ + '.tmp';
  writeFileSync(gecici, JSON.stringify(cikti, null, 2) + '\n', 'utf8');
  renameSync(gecici, HAVUZ);
} else {
  console.log('[aday] değişiklik yok — dosya yazılmadı (idempotent)');
}

console.log(JSON.stringify({
  ham: ham.length,
  korunanIncelenmis: korunacak.length,
  bekleyenYeni: yeni.length,
  toplamAday: adaylar.length,
  yayimdaVarAtlanan: atlananYayim,
  mukerrerAtlanan: atlananMukerrer,
  cesitlilikAtlanan: atlananCesitlilik,
  kaynakDagilimi: ham.reduce((a, r) => (a[r._kaynak] = (a[r._kaynak] || 0) + 1, a), {}),
}, null, 2));
console.log(`[aday] yazıldı: data/emsal-adaylari.json — toplam ${adaylar.length} aday (dogrulama: bekliyor)`);
