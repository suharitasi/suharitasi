/* GÖRSEL/DÜZEN ÖLÇERİ — sağlık kalemleri G1-G6'nın tek ölçüm kaynağı.
   (gorsel-bekci briefi, 28.07.2026)

   NEDEN AYRI DOSYA: site-saglik.mjs hem bu ölçeri hem taban yenileme
   komutunu çağırır; iki yerde kopya mantık = iki yerde sapma (28.07
   md4 dersi). Tek kaynak.

   ——— FAZ 0: ÖLÇÜM DETERMİNİZMİ ———
   Hero'da 6 sahne 5 sn'de bir döner; ölçüm anı sabitlenmeden kalem
   kurulamaz. Determinizm üç ayakla sağlanır:
   1) `reducedMotion: 'reduce'` — Hero motoru `if (!AZALT && ...)` ile
      korunuyor, yani reduced-motion'da HİÇ BAŞLAMAZ: sahne 0'da donar,
      açılış posteri kalır, video yüklenmez. Sabitlenen sahne KAYDA GEÇER.
   2) Enjekte CSS: tüm animation/transition 0s + animation-play-state
      paused — süzülme/geçiş kaynaklı ara-kare ölçümü imkânsız olur.
   3) Sabit viewport + sabit deviceScaleFactor.
   Bu üçü olmadan ölçüm yapılırsa sayı gürültülüdür ve kalem yanlış
   alarm üretir; kalem kurmadan ÖNCE 3 tekrarla doğrulanır (--determinizm).
*/
import { join } from 'node:path';

export const VIEWPORTLAR = [
  { ad: 'md', w: 1440, h: 900, dpr: 1 },
  { ad: 'mobil', w: 375, h: 812, dpr: 2 },
];

// Sabitleme CSS'i — sayfaya ölçümden ÖNCE enjekte edilir.
const DONDUR_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-play-state: paused !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
  html { scroll-behavior: auto !important; }
`;

/* Sayfa bağlamında koşar. Tek bir sayfanın tüm görsel/düzen ölçüleri. */
const OLC = () => {
  const yuvarla = (n) => Math.round(n * 100) / 100;
  const gorunur = (el) => {
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const kutu = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top + scrollY),
             w: Math.round(r.width), h: Math.round(r.height) };
  };
  // İki dikdörtgenin kesişme ALANI (belge koordinatında)
  const kesisim = (a, b) => {
    const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    return w > 0 && h > 0 ? w * h : 0;
  };

  // — G1: metin ↔ görsel kesişmesi —
  // "Görsel": video, img (>=200px genişlik), veya .v2-katman/.v2-videolar
  // gibi medya kapsayıcısı. "Metin": kendi metin düğümü olan blok öğe.
  const gorseller = [...document.querySelectorAll('video, img, .v2-katman, .v2-videolar')]
    .filter((el) => gorunur(el) && el.getBoundingClientRect().width >= 200)
    .map((el) => ({ el, k: kutu(el) }));
  const metinler = [];
  for (const el of document.querySelectorAll('h1, h2, h3, p, a, button, li, span')) {
    if (!gorunur(el)) continue;
    // DÜZELTME (13.09.2026): sabit üst menü (pm-bar) ve atlama bağlantısı,
    // hero medyası üzerine bilinçli binen site şerididir; kendi koyu
    // yarı saydam zemini taşır. G1'in amacı İÇERİK metninin görselle
    // çakışmasını yakalamaktır; site gezinme katmanı bu kapsamda değildir.
    // (Ölçüldü: /harita'da 8.249 px²'nin tamamı pm-bar linkleriydi.)
    if (el.closest('.pm-bar, .pm-mobil-panel, .atla-baglantisi, .adb')) continue;
    const kendi = [...el.childNodes].filter((n) => n.nodeType === 3)
      .map((n) => n.textContent).join('').trim();
    if (kendi.length < 3) continue;
    metinler.push({ el, k: kutu(el), metin: kendi.slice(0, 40) });
  }
  let kesismeAlan = 0;
  const kesisenler = [];
  for (const g of gorseller) {
    for (const m of metinler) {
      // Metin görselin İÇİNDE ise (ata-torun) kesişme sayılmaz — bu
      // figure/caption gibi meşru yerleşimdir; aranan ÜST ÜSTE BİNME.
      if (g.el.contains(m.el) || m.el.contains(g.el)) continue;
      const a = kesisim(g.k, m.k);
      if (a > 0) {
        kesismeAlan += a;
        if (kesisenler.length < 8) {
          kesisenler.push({ metin: m.metin, alan: a,
            gorsel: g.el.tagName.toLowerCase() + (g.el.className && typeof g.el.className === 'string' ? '.' + g.el.className.trim().split(/\s+/)[0] : '') });
        }
      }
    }
  }
  const gorselAlanToplam = gorseller.reduce((t, g) => t + g.k.w * g.k.h, 0);

  // — G2: görsel ölçek oranı (görüntülenen / kaynak) —
  const olcekler = [];
  for (const el of document.querySelectorAll('img, video')) {
    if (!gorunur(el)) continue;
    const r = el.getBoundingClientRect();
    // Kaynak genişliği: img'de naturalWidth, video'da videoWidth; ikisi de
    // yoksa width niteliği (henüz yüklenmemiş medya).
    const kaynakW = el.naturalWidth || el.videoWidth || Number(el.getAttribute('width')) || 0;
    if (!kaynakW || r.width < 200) continue;   // küçük ikon/logo hariç
    olcekler.push({
      etiket: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : ''),
      kaynak: el.getAttribute('src') ? el.getAttribute('src').split('/').pop() : '(yok)',
      kaynakW, gosterimW: Math.round(r.width),
      oran: yuvarla(r.width / kaynakW),
    });
  }

  // — G3: hero tipografi —
  const h1 = document.querySelector('h1');
  const heroAlt = document.querySelector('.v2-alt-metin');
  const tipografi = {
    h1Px: h1 ? yuvarla(parseFloat(getComputedStyle(h1).fontSize)) : null,
    h1SatirYuk: h1 ? yuvarla(parseFloat(getComputedStyle(h1).lineHeight)) : null,
    altPx: heroAlt ? yuvarla(parseFloat(getComputedStyle(heroAlt).fontSize)) : null,
  };

  // — G4: bölüm ritmi (padding dizisi) —
  // DÜZELTME (13.09.2026): 10.09'da Sayfa.astro içeriği <article> ile
  // sarmaladı → `main > section` artık 0 eşleşiyordu ve ölçüm sessizce
  // boşa koşuyordu (tüm içerik sayfalarında "bölüm sayısı 0"). `main section`
  // hem doğrudan hem <article> içindeki bölümleri yakalar.
  const bolumler = [...document.querySelectorAll('.v2-bolum, .il-blok, .ar-liste, main section')]
    .filter(gorunur)
    .map((el) => {
      const st = getComputedStyle(el);
      return {
        etiket: (el.className && typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 2).join('.') : el.tagName.toLowerCase()),
        padUst: yuvarla(parseFloat(st.paddingTop)),
        padAlt: yuvarla(parseFloat(st.paddingBottom)),
      };
    });

  // — G5: ORTALAMA SAPMASI (başlık hizalaması) —
  // İLK TASARIM VEKİL KRİTERDİ: "tüm başlıkların sol kenarı aynı olsun"
  // ölçüldü ve ana sayfada 240px "sapma" verdi — oysa bu ARIZA DEĞİL,
  // v0'ın iki meşru ailesi (ortalı bölümler sol=384, sola dayalı
  // Hakkında/İletişim sol=144). Vekil kriter yasak (CLAUDE.md).
  // GERÇEK DEĞİŞMEZ: `.v2-bolum-bas` CSS'te `margin: 0 auto` ile
  // ORTALANIR. Bugünkü arızada reset bu margin'i eziyordu ve blok sola
  // yapışıyordu. Ölçü: her ortalı bloğun gerçek sol kenarı ile kabına
  // göre BEKLENEN orta konumu arasındaki fark.
  let hizalamaSapma = 0;
  const hizalamaDetay = [];
  for (const el of document.querySelectorAll('.v2-bolum-bas')) {
    if (!gorunur(el)) continue;
    const kap = el.parentElement;
    if (!kap) continue;
    const r = el.getBoundingClientRect();
    const kr = kap.getBoundingClientRect();
    const ks = getComputedStyle(kap);
    const icSol = kr.left + parseFloat(ks.paddingLeft);
    const icGen = kr.width - parseFloat(ks.paddingLeft) - parseFloat(ks.paddingRight);
    const beklenenSol = icSol + (icGen - r.width) / 2;
    const fark = Math.round(Math.abs(r.left - beklenenSol));
    hizalamaDetay.push({ sol: Math.round(r.left), beklenen: Math.round(beklenenSol), fark });
    if (fark > hizalamaSapma) hizalamaSapma = fark;
  }

  // — G6: 375'te dert-sorusunun ilk ekrandaki konumu (S1 nöbeti) —
  const mobilSorular = [...document.querySelectorAll('.v2-mobil-sorular a')]
    .filter(gorunur)
    .map((a) => ({ metin: a.textContent.trim().slice(0, 44),
                   ust: Math.round(a.getBoundingClientRect().top),
                   alt: Math.round(a.getBoundingClientRect().bottom) }))
    .sort((x, y) => x.ust - y.ust);

  // — Determinizm damgası: hangi sahne sabitlendi —
  const aktifSahne = (() => {
    const k = document.querySelector('.v2-serit-kare.aktif');
    if (k) return (k.getAttribute('aria-label') || '').replace('Sahne: ', '');
    const v = document.querySelector('#v2-videolar video.aktif');
    return v ? v.dataset.sahne : '(sahne yok)';
  })();

  return {
    kesisme: { alan: kesismeAlan, gorselAlan: gorselAlanToplam,
               oran: gorselAlanToplam ? yuvarla(kesismeAlan / gorselAlanToplam) : 0,
               ornekler: kesisenler },
    olcekler, tipografi, bolumler, hizalamaSapma, hizalamaDetay,
    mobilIlkSoru: mobilSorular[0] || null,
    aktifSahne,
    belgeYuk: document.documentElement.scrollHeight,
  };
};

/** Tek sayfa + tek viewport ölçümü (deterministik ayarlarla). */
export async function olcSayfa(tarayici, taban, yol, vp) {
  const ctx = await tarayici.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.dpr,
    reducedMotion: 'reduce',   // FAZ 0/1: motor hiç başlamaz → sahne 0'da donar
  });
  const sayfa = await ctx.newPage();
  await sayfa.addStyleTag({ content: DONDUR_CSS }).catch(() => {});
  try {
    const c = await sayfa.goto(taban + yol, { waitUntil: 'load', timeout: 45000 });
    // Yerleşimin oturması için sabit, kısa bekleme (animasyon yok — 250ms yeter)
    await sayfa.waitForTimeout(250);
    await sayfa.addStyleTag({ content: DONDUR_CSS });
    const o = await sayfa.evaluate(OLC);
    return { yol, viewport: vp.ad, http: c.status(), ...o };
  } finally {
    await ctx.close();
  }
}

/** Örneklem × viewport tam ölçümü. */
export async function olcTumu(tarayici, taban, yollar) {
  const cikti = [];
  for (const yol of yollar) {
    for (const vp of VIEWPORTLAR) {
      cikti.push(await olcSayfa(tarayici, taban, yol, vp));
    }
  }
  return cikti;
}

/** İki ölçümün kalem-ilgili alanlarının aynı olup olmadığı (determinizm). */
export function ayniMi(a, b) {
  const oz = (x) => JSON.stringify({
    kesisme: x.kesisme.alan,
    olcekler: x.olcekler.map((o) => [o.etiket, o.kaynakW, o.gosterimW, o.oran]),
    tipografi: x.tipografi,
    bolumler: x.bolumler,
    hizalamaSapma: x.hizalamaSapma,
    mobilIlkSoru: x.mobilIlkSoru,
    aktifSahne: x.aktifSahne,
  });
  return oz(a) === oz(b);
}

/* ——— TABAN KARŞILAŞTIRMA (kalemler G1-G6) ———
   EŞİKLER FAZ 1-b ÖLÇÜMÜNDEN TÜRETİLDİ (13 sayfa × 2 kırılım, 28.07):
     G1 kesişme  — doğal değer TÜM sayfalarda 0 → eşik mutlak 2000 px²
                   (yuvarlama payı); bugünkü arıza 243.919 px² idi (×122).
     G2 ölçek    — doğal en yüksek 1,00 (kadraj native) → eşik 1,05
                   (%5 pay); bugünkü arıza 1,77 idi.
     G3 tipografi— sayfa tipi içinde varyans 0 (il/rehber/araç 48px, ana
                   41,6px) → eşik ±2px (font/clamp yuvarlaması);
                   bugünkü arıza 72 vs 41,6 = 30px idi.
     G4 ritim    — GRUP İÇİNDE DEĞİŞİYOR (rehber 4 sayfada 3 farklı dizi)
                   → taban SAYFA BAŞINA; eşik ±2px ve dizi UZUNLUĞU eşit.
                   Bugünkü arıza 96px→0 idi.
     G5 ortalama — doğal 0 → eşik 2px; bugünkü arıza 240px idi.
     G6 S1       — kadraj sınırı (812px) mutlak; taban 785, pay 27px.
   Her eşik doğal varyansın ÜSTÜNDE, gerçek arızanın ÇOK ALTINDA. */
export const ESIKLER = {
  g1KesismePx2: 2000,
  g2OlcekOran: 1.05,
  g3TipografiPx: 2,
  g4RitimPx: 2,
  g5OrtalamaPx: 2,
  g6KadrajPx: 812,
};

/** Tek ölçümü kendi tabanıyla karşılaştırır; bulguları döner. */
export function karsilastir(olcum, taban, esik = ESIKLER) {
  const bulgular = [];
  const yer = `${olcum.yol}@${olcum.viewport}`;

  // G1 — metin ↔ görsel üst üste binmesi
  if (olcum.kesisme.alan > esik.g1KesismePx2) {
    bulgular.push({ kalem: 'G1', yer, mesaj:
      `metin görselin üstünde: ${olcum.kesisme.alan} px² (eşik ${esik.g1KesismePx2}); ` +
      `örnek: ${(olcum.kesisme.ornekler[0] || {}).metin || '—'}`,
      olculen: olcum.kesisme.alan, esik: esik.g1KesismePx2 });
  }

  // G2 — kaynak üstü büyütme
  for (const o of olcum.olcekler) {
    if (o.oran > esik.g2OlcekOran) {
      bulgular.push({ kalem: 'G2', yer, mesaj:
        `${o.kaynak} kaynağının üstünde büyütülmüş: ${o.kaynakW}px → ${o.gosterimW}px (×${o.oran}, eşik ×${esik.g2OlcekOran})`,
        olculen: o.oran, esik: esik.g2OlcekOran });
    }
  }

  if (!taban) return bulgular;   // taban yoksa yalnız mutlak kalemler

  // G3 — hero tipografi sapması
  for (const alan of ['h1Px', 'altPx']) {
    const t = taban.tipografi[alan], y = olcum.tipografi[alan];
    if (t == null || y == null) continue;
    if (Math.abs(y - t) > esik.g3TipografiPx) {
      bulgular.push({ kalem: 'G3', yer, mesaj:
        `hero ${alan} tabandan saptı: ${t} → ${y} (fark ${Math.round((y - t) * 10) / 10}px, eşik ${esik.g3TipografiPx})`,
        olculen: y, taban: t, esik: esik.g3TipografiPx });
    }
  }

  // G4 — bölüm ritmi
  if (taban.bolumler.length !== olcum.bolumler.length) {
    bulgular.push({ kalem: 'G4', yer, mesaj:
      `bölüm sayısı değişti: ${taban.bolumler.length} → ${olcum.bolumler.length}`,
      olculen: olcum.bolumler.length, taban: taban.bolumler.length });
  } else {
    for (let i = 0; i < taban.bolumler.length; i++) {
      const t = taban.bolumler[i], y = olcum.bolumler[i];
      for (const alan of ['padUst', 'padAlt']) {
        if (Math.abs(y[alan] - t[alan]) > esik.g4RitimPx) {
          bulgular.push({ kalem: 'G4', yer, mesaj:
            `bölüm ritmi bozuldu — ${t.etiket} ${alan}: ${t[alan]} → ${y[alan]} (eşik ${esik.g4RitimPx}px)`,
            olculen: y[alan], taban: t[alan], esik: esik.g4RitimPx });
        }
      }
    }
  }

  // G5 — ortalanmış başlık bloğunun ortadan kayması
  if (olcum.hizalamaSapma > esik.g5OrtalamaPx) {
    bulgular.push({ kalem: 'G5', yer, mesaj:
      `ortalanması gereken başlık bloğu ortadan kaymış: ${olcum.hizalamaSapma}px (eşik ${esik.g5OrtalamaPx})`,
      olculen: olcum.hizalamaSapma, esik: esik.g5OrtalamaPx });
  }

  // G6 — S1 nöbeti (yalnız mobil ana sayfa; tabanda kayıt varsa)
  if (taban.mobilIlkSoru && olcum.mobilIlkSoru) {
    if (olcum.mobilIlkSoru.alt > esik.g6KadrajPx) {
      bulgular.push({ kalem: 'G6', yer, mesaj:
        `ilk ekrandaki dert-sorusu kadrajdan çıktı: alt kenar ${olcum.mobilIlkSoru.alt}px > ${esik.g6KadrajPx}px ("${olcum.mobilIlkSoru.metin}")`,
        olculen: olcum.mobilIlkSoru.alt, esik: esik.g6KadrajPx });
    }
  } else if (taban.mobilIlkSoru && !olcum.mobilIlkSoru) {
    bulgular.push({ kalem: 'G6', yer, mesaj:
      'ilk ekrandaki mobil soru listesi kayboldu (tabanda vardı)', olculen: null });
  }

  return bulgular;
}

/** Ölçümlerden taban dosyası gövdesi üretir. */
export function tabanGovdesi(olcumler, gerekce, esikler = ESIKLER) {
  const sayfalar = {};
  for (const o of olcumler) {
    sayfalar[`${o.yol}@${o.viewport}`] = {
      tipografi: o.tipografi,
      bolumler: o.bolumler,
      hizalamaSapma: o.hizalamaSapma,
      kesismeAlan: o.kesisme.alan,
      enYuksekOlcek: o.olcekler.length ? Math.max(...o.olcekler.map((s) => s.oran)) : null,
      mobilIlkSoru: o.mobilIlkSoru,
      aktifSahne: o.aktifSahne,
    };
  }
  return {
    _not: 'GÖRSEL/DÜZEN TABANI — sürümlü YAPILANDIRMA (log değil). Bilinçli ' +
      'tasarım değişikliğinde `node arac/site-saglik.mjs --gorsel-taban-yenile ' +
      '--gerekce "..."` ile yenilenir; yenilenmeden kalem KIRMIZI kalır. ' +
      'Ölçüm deterministiktir: sabit viewport + DPR + reduced-motion (sahne 0\'da donar).',
    tabanTarihi: new Date().toISOString(),
    gerekce,
    esikler,
    olcumKosullari: { viewportlar: VIEWPORTLAR, reducedMotion: 'reduce', animasyon: 'kapalı' },
    sayfalar,
  };
}
