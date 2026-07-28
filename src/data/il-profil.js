// HENDEK FAZ 2 — il profili üreticisi: TEK kaynak, İKİ tüketici
// (ilimde-kim-yetkili aracı + kuyu-ruhsati/[il] statik sayfaları).
// Çift bakım noktası YASAK: il verisiyle ilgili her kural BURADA yaşar.
//
// Veri kaynakları (yeni veri girişi YOK — mevcut doğrulanmış JSON'lardan
// türetme): il-kurum.json + havza-veri.json + grace-havza.json + baraj.json.
//
// İNCE İÇERİK KURALI (brief'in çekirdeği): bir il YALNIZCA aşağıdaki beş
// il-özgü unsurdan EN AZ ÜÇÜ gerçekten doluysa statik sayfa alır:
//   1. DSİ bölge müdürlüğü  2. havza + veri künyesi  3. GRACE eğilimi
//   4. baraj doluluk durumu 5. açık su idaresi kaydı (jenerik fallback
//   SAYILMAZ). Eşiği geçemeyen il: araçta görünür, sayfası ÜRETİLMEZ
//   ("veri hazırlanıyor" placeholder da yasak).
import ilKurum from '../../data/il-kurum.json';
import havzaVeri from '../../data/havza-veri.json';
import graceHavza from '../../data/canli/grace-havza.json';
import baraj from '../../data/canli/baraj.json';
import { graceEgilim } from './grace-hesap.js';

const TR_ASCII = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
                   Ç: 'c', Ğ: 'g', I: 'i', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u' };

export function ilSlug(ad) {
  return ad
    .split('')
    .map((c) => TR_ASCII[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function barajOzeti(havzaBaslik) {
  // EPİAŞ havza adı çıplaktır ("Sakarya"); site başlığı "Sakarya Havzası".
  const ad = havzaBaslik.replace(/\s*Havzası\s*$/, '');
  const h = baraj.havzalar?.[ad];
  if (!h) return null;
  let son = null;
  const degerler = [];
  for (const b of Object.values(h.barajlar)) {
    const gunler = Object.keys(b.seri).sort();
    if (!gunler.length) continue;
    const g = gunler[gunler.length - 1];
    if (!son || g > son) son = g;
    if (b.seri[g].doluluk != null) degerler.push(b.seri[g].doluluk);
  }
  if (!degerler.length) return null;
  return {
    barajSayisi: degerler.length,
    ortalamaDoluluk: degerler.reduce((t, v) => t + v, 0) / degerler.length,
    tarih: son,
  };
}

/** 81 ilin tam profili (araç bunların HEPSİNİ gösterir). */
export function tumIlProfilleri() {
  // il → DSİ bölgeleri
  const ilBolge = {};
  for (const [no, b] of Object.entries(ilKurum.dsiBolgeleri)) {
    for (const il of b.iller) {
      (ilBolge[il] ??= []).push({ no: Number(no), merkez: b.merkez });
    }
  }
  // il → havza no listesi
  const ilHavza = {};
  for (const [no, h] of Object.entries(ilKurum.havzaIlleri)) {
    for (const il of h.iller) (ilHavza[il] ??= []).push(no);
  }
  const hvNo = Object.fromEntries(havzaVeri.havzalar.map((h) => [h.no, h]));

  const iller = [...new Set([...Object.keys(ilBolge), ...Object.keys(ilHavza)])]
    .sort((a, b) => a.localeCompare(b, 'tr'));

  return iller.map((il) => {
    const havzalar = (ilHavza[il] ?? [])
      .map((no) => {
        const v = hvNo[no];
        if (!v) return null;
        const egilim = graceHavza.havzalar?.[v.ad]
          ? graceEgilim(graceHavza.havzalar[v.ad].seri)
          : null;
        return {
          no,
          ad: v.ad,
          slug: ilSlug(v.ad.replace(/\s*Havzası\s*$/, '')),
          yagisAlani_km2: v.yagisAlani_km2 ?? null,
          yuzeysuyuPotansiyeli_km3: v.yuzeysuyuPotansiyeli_km3 ?? null,
          veriYili: v.yuzeysuyuYili ?? null,
          egilim,
          baraj: barajOzeti(v.ad),
        };
      })
      .filter(Boolean);

    // Beş unsur — jenerik fallback SAYILMAZ
    const unsurlar = {
      dsiBolge: (ilBolge[il] ?? []).length > 0,
      havzaKunye: havzalar.some((h) => h.yagisAlani_km2 || h.yuzeysuyuPotansiyeli_km3),
      graceEgilim: havzalar.some((h) => h.egilim),
      barajDurumu: havzalar.some((h) => h.baraj),
      suIdaresi: il in ilKurum.suIdareleri,
    };
    const doluUnsur = Object.values(unsurlar).filter(Boolean).length;

    return {
      il,
      slug: ilSlug(il),
      dsiBolgeleri: ilBolge[il] ?? [],
      havzalar,
      suIdaresi: ilKurum.suIdareleri[il] ?? null, // null = açık kayıt yok
      unsurlar,
      doluUnsur,
      sayfaVar: doluUnsur >= 3,
      veriKunyesi: {
        ilKurumDerleme: ilKurum.derlemeTarihi,
        havzaVeriKaynak: 'DSİ 2024 Resmî Su Kaynakları İstatistikleri',
        graceKaynak: 'NASA GRACE/GRACE-FO (GSFC mascon)',
        barajKaynak: 'EPİAŞ Şeffaflık Platformu',
      },
    };
  });
}

/** Yalnız ince-içerik eşiğini geçen iller — getStaticPaths bunu kullanır. */
export function yayinlananIller() {
  return tumIlProfilleri().filter((p) => p.sayfaVar);
}
