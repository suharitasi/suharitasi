// RESMÎ GAZETE ZAMAN MAKİNESİ — ARŞİV VERİ KATMANI (Adım 2, 24.09.2026).
// TEK KAYNAK: veri/potansiyel/isletme-sahalari.json (109 başlık) +
// isletme-sahalari-ek.json (310 ilan pasajı) = 419 kayıt.
// KURAL: sayılar build anında sayılır ve assert edilir; uydurma yok.
// Gazete sayısı rg-sayi.js'in DOĞRULANMIŞ URL→sayı çıkarımıyla türetilir.
// Bu katman yalnız ARŞİV GÖRÜNÜMÜ üretir; "açık/kapalı" sınıflaması
// ÜRETMEZ (bkz. src/data/kisit-sorgu.js aynı ilke).
import { RG_BASLIK, RG_ILAN, RG_HAM, RG_SAYIM, RG_GRUPLAR } from './rg-kaynak.js';
import { sayiIle } from './rg-sayi.js';

// 10.10.2026: kaynak rg-kaynak.js (başlık + yeniden ayrıştırılmış ilan kayıtları).
const HAM = RG_HAM;

function yilCikar(tarih) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(tarih || '');
  return m ? Number(m[3]) : null;
}

function duz(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

export const KAYITLAR = HAM.map((k) => {
  const il = (Array.isArray(k.il) ? k.il : k.il ? [k.il] : []).filter(
    (x) => x && !/belirsiz/i.test(x)
  );
  const ilce = k.ilceler && typeof k.ilceler === 'object' ? Object.keys(k.ilceler) : [];
  const sayi = sayiIle(k);
  return {
    tarih: k.rg_tarih || '',
    yil: yilCikar(k.rg_tarih),
    saha: duz(k.saha_adi).slice(0, 200),
    il,
    ilce,
    durum: k.durum || 'belirsiz',
    ilNotu: k.il_notu || '',
    tur: duz(k.mevzuat_turu),
    sayi: sayi.sayi,
    kaynak: k.kaynak_url || '',
    baslikKaydi: !!(k.saha_adi && k.saha_adi.trim()),
  };
}).sort((a, b) => {
  const ka = String(a.tarih).split('.').reverse().join('');
  const kb = String(b.tarih).split('.').reverse().join('');
  return kb.localeCompare(ka);
});

// — Özetler (hepsi veriden) —
export const TOPLAM = KAYITLAR.length;
const yilli = KAYITLAR.filter((k) => k.yil).map((k) => k.yil).sort((a, b) => a - b);
export const YIL_ILK = yilli[0];
export const YIL_SON = yilli[yilli.length - 1];

const yilHaritasi = new Map();
for (const k of KAYITLAR) {
  if (!k.yil) continue;
  yilHaritasi.set(k.yil, (yilHaritasi.get(k.yil) || 0) + 1);
}
export const YIL_DAGILIM = [...yilHaritasi.entries()]
  .map(([yil, sayi]) => ({ yil, sayi }))
  .sort((a, b) => a.yil - b.yil);
export const YIL_MAKS = Math.max(...YIL_DAGILIM.map((y) => y.sayi));

// İl dağılımı TEKİL İLANDAN sayılır (10.10.2026, sahip kararı B): il sayfaları, istihbarat ve kısıt
// sorgusu ile aynı sayı. Ham kayıt listesi aşağıda ayrıca durur.
const ilHaritasi = new Map();
for (const g of RG_GRUPLAR) {
  for (const il of g.il) ilHaritasi.set(il, (ilHaritasi.get(il) || 0) + 1);
}
export const IL_DAGILIM = [...ilHaritasi.entries()]
  .map(([il, sayi]) => ({ il, sayi }))
  .sort((a, b) => b.sayi - a.sayi || a.il.localeCompare(b.il, 'tr'));

export const IL_SAYISI = IL_DAGILIM.length;
export const ILCE_SAYISI = new Set(KAYITLAR.flatMap((k) => k.ilce)).size;
export const ILLI_TOPLAM = KAYITLAR.filter((k) => k.il.length).length;
export const ILLI_DEGIL = TOPLAM - ILLI_TOPLAM;
export const SAYILI_TOPLAM = KAYITLAR.filter((k) => k.sayi != null).length;
// Mükerrersizleştirme (aynı normalizasyon /kisit.json ile ortak) — künyede
// "419 ham kayıt, N tekil ilan" notu için. Çelişki değil, ölçüm.
export const TEKIL_ILAN = RG_SAYIM.tekil;
export const TEKIL_ILSIZ = RG_SAYIM.tekilIlsiz;

// — Build-time assert (sessiz hata yasağı) —
{
  // Sabit sayı yerine kaynak dosyanın kendi künyesiyle tutarlılık (10.10.2026, brif 2.1).
  if (TOPLAM !== RG_SAYIM.toplam) throw new Error(`rg-zaman: ${RG_SAYIM.toplam} kayıt beklenirken ${TOPLAM} bulundu.`);
  if (YIL_ILK !== 1963 || YIL_SON < 2017) {
    throw new Error(`rg-zaman: yıl aralığı 1963'ten en az 2017'ye uzanmalı; ${YIL_ILK}–${YIL_SON} bulundu.`);
  }
  if (!IL_SAYISI) throw new Error('rg-zaman: hiçbir kayıt il taşımıyor.');
  const kaynaksiz = KAYITLAR.filter((k) => !k.kaynak).length;
  if (kaynaksiz) throw new Error(`rg-zaman: ${kaynaksiz} kaydın resmî kaynak URL'si yok.`);
}
