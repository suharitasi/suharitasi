#!/usr/bin/env node
// BRIEF DENETÇİSİ — kural tabanlı mekanik ön denetim (T1-T8).
// Kullanım: node arac/brief-denetci.mjs <brief-dosyasi.md>
// Çıktı: konsol + cikti/denetim/brief/<zaman>.md
// Sonuç: "TEMİZ" | "N UYARI" | "N ENGEL". Çıkış kodu: 0 temiz, 1 uyarı, 2 engel.
//
// SINIR (rapora da yazılır): Bu araç KURAL İHLALİ arar; brief'in stratejik
// doğruluğunu / iş önceliğini / mimari isabetini DENETLEMEZ. Düşman geçişi
// (D1-D4) ve amaç özeti (3b) MUHAKEME gerektirir — script değil Claude Code
// yapar. "TEMİZ" = "brief doğru" DEĞİL.

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function trk(s) { return String(s).toLocaleLowerCase('tr'); }

// repo dosya envanteri (tracked + untracked) — T1 basename geri-dönüşü için
let REPO_BASENAMES = new Set();
try {
  const out = execFileSync('git', ['-C', KOK, 'ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 });
  for (const l of out.split('\n')) { if (l) REPO_BASENAMES.add(l.split('/').pop()); }
} catch { /* git yoksa boş kalır, existsSync yeterli */ }

function briefOku(yol) {
  const ham = readFileSync(yol, 'utf-8');
  const satirlar = ham.split(/\r?\n/);
  return { ham, satirlar, kucuk: trk(ham), kucukSatirlar: satirlar.map(trk) };
}

// kelime-başı sınırı: harfle başlayan ifade, harf-olmayan sınırda başlamalı
// (substring yanlış-pozitiflerini eler: "temsili" içindeki "sil" gibi).
// Noktalama ile başlayan ifade (".mjs yaz", "≤", "'dan") düz includes ile aranır.
const HARF = /[a-zçğıöşü0-9]/;
function gecerBoundary(metin, ifadeKucuk) {
  if (!ifadeKucuk) return false;
  if (!HARF.test(ifadeKucuk[0])) return metin.includes(ifadeKucuk);
  let idx = 0;
  while ((idx = metin.indexOf(ifadeKucuk, idx)) !== -1) {
    if (idx === 0 || !HARF.test(metin[idx - 1])) return true;
    idx += 1;
  }
  return false;
}

// bir ifade metinde ilk hangi satırda geçiyor (1-indeksli, kelime-başı sınırlı); yoksa 0
function ilkSatir(brief, ifadeKucuk) {
  const alt = trk(ifadeKucuk);
  for (let i = 0; i < brief.kucukSatirlar.length; i++) {
    if (gecerBoundary(brief.kucukSatirlar[i], alt)) return i + 1;
  }
  return 0;
}
function gecerMi(brief, ifade) { return gecerBoundary(brief.kucuk, trk(ifade)); }
function herhangiGecer(brief, ifadeler) { return ifadeler.some(i => gecerMi(brief, i)); }

// ---- T1: referans varlığı -------------------------------------------------
function commitVarMi(hash) {
  try {
    execFileSync('git', ['-C', KOK, 'cat-file', '-e', hash + '^{commit}'], { stdio: 'ignore' });
    return true;
  } catch { return false; }
}
function denetle_referans_varligi(brief, kural) {
  const bulgular = [];
  const uretim = kural.params.uretim_fiilleri.map(trk);
  const referans = kural.params.referans_fiilleri.map(trk);
  // uzantı: çok-karakterli olanlar ÖNCE (json, js'ten önce) — truncation önlenir
  const UZANTI = 'geojson|astro|json|html|webp|jpeg|mjs|css|md|js|py|sh|txt|svg|png|jpg|mp4|pdf';
  // bilinen kök dizinler — büyük harf gürültüsünü (SİTE/KOD, TÜİK/TBMM) eler
  const KOKDIZIN = 'data|arac|src|cikti|rapor|izleme|public|kaynak|arsiv|dist|test|log|icerik-taslak|node_modules|scratchpad';
  const yolReUzanti = new RegExp(`[\\w./@-]*[\\w-]\\.(?:${UZANTI})(?![\\w])`, 'g');
  const yolReDizin = new RegExp(`\\b(?:${KOKDIZIN})\\/[\\w./@-]+`, 'g');
  const hashRe = /\b[0-9a-f]{7,40}\b/g;
  const gorulen = new Set();
  for (let i = 0; i < brief.satirlar.length; i++) {
    // <placeholder> metavariable'ları (ör. <brief-dosyasi.md>, <zaman>) yol sayılmaz
    const satir = brief.satirlar[i].replace(/<[^>]*>/g, ' ');
    const kucuk = brief.kucukSatirlar[i];
    const uretimBaglam = uretim.some(f => kucuk.includes(f));
    const referansBaglam = referans.some(f => kucuk.includes(f));
    // yollar (iki desen: uzantılı + bilinen-kök-dizinli)
    const adaylar = [...satir.matchAll(yolReUzanti), ...satir.matchAll(yolReDizin)].map(m => m[0]);
    for (let yol of adaylar) {
      yol = yol.replace(/[.,;:)]+$/, '');
      if (gorulen.has(yol)) continue;
      gorulen.add(yol);
      if (/[<>]/.test(yol)) continue; // <zaman> gibi şablon — atla
      const tam = resolve(KOK, yol);
      const basename = yol.replace(/\/$/, '').split('/').pop();
      const tamVar = existsSync(tam) || existsSync(tam.replace(/\/$/, ''));
      if (tamVar) { bulgular.push({ sonuc: 'GECTI', gerekce: `${yol} — var`, satir: i + 1, siddet: 'ENGEL' }); continue; }
      // basename geri-dönüşü: dosya repoda başka yolda mevcut (ör. bare 'x.json' → data/kamu/x.json)
      if (REPO_BASENAMES.has(basename)) { bulgular.push({ sonuc: 'GECTI', gerekce: `${yol} — repoda mevcut (basename eşleşti: ${basename})`, satir: i + 1, siddet: 'ENGEL' }); continue; }
      if (uretimBaglam) { bulgular.push({ sonuc: 'UYGULANMAZ', gerekce: `${yol} — üretim hedefi (var-olma beklenmez)`, satir: i + 1, siddet: 'ENGEL' }); continue; }
      if (referansBaglam) { bulgular.push({ sonuc: 'KALDI', gerekce: `${yol} — girdi olarak anılıyor ama repoda YOK`, satir: i + 1, siddet: 'ENGEL' }); continue; }
      bulgular.push({ sonuc: 'KALDI', gerekce: `${yol} — repoda yok, bağlam belirsiz (üretim mi girdi mi?)`, satir: i + 1, siddet: 'UYARI' });
    }
    // commit hash'leri
    for (const m of kucuk.matchAll(hashRe)) {
      const h = m[0];
      if (gorulen.has(h)) continue;
      gorulen.add(h);
      // salt sayı (renk/ölçü) elenmesin diye: en az bir harf içermeli VEYA 'commit' bağlamı olmalı
      const harfli = /[a-f]/.test(h);
      const commitBaglam = kucuk.includes('commit') || kucuk.includes('sha') || kucuk.includes('hash');
      if (!harfli && !commitBaglam) continue;
      if (uretimBaglam) continue;
      if (commitVarMi(h)) bulgular.push({ sonuc: 'GECTI', gerekce: `commit ${h} — var`, satir: i + 1, siddet: 'ENGEL' });
      else if (commitBaglam || harfli) bulgular.push({ sonuc: 'KALDI', gerekce: `commit ${h} — repoda bulunamadı`, satir: i + 1, siddet: 'ENGEL' });
    }
  }
  if (bulgular.length === 0) return [{ sonuc: 'UYGULANMAZ', gerekce: 'Brief\'te denetlenecek dosya/yol/commit referansı yok', satir: 0, siddet: kural.siddet }];
  return bulgular;
}

// ---- T2a: yasak (ölçülemez) ifade ----------------------------------------
function denetle_yasak_ifade(brief, kural) {
  const bulgular = [];
  for (const ifade of kural.params.ifadeler) {
    if (gecerMi(brief, ifade)) bulgular.push({ sonuc: 'KALDI', gerekce: `ölçülemez ifade: "${ifade}"`, satir: ilkSatir(brief, trk(ifade)), siddet: kural.siddet });
  }
  if (bulgular.length === 0) return [{ sonuc: 'GECTI', gerekce: 'Ölçülemez ifade bulunmadı', satir: 0, siddet: kural.siddet }];
  return bulgular;
}

// ---- T2b: görüntü kanıt değildir -----------------------------------------
function denetle_kanit_gorseli(brief, kural) {
  const medya = herhangiGecer(brief, kural.params.medya_iddiasi);
  const gorsel = herhangiGecer(brief, kural.params.gorsel_kanit);
  const olcum = herhangiGecer(brief, kural.params.olcum_ifadeleri);
  if (!medya || !gorsel) return [{ sonuc: 'UYGULANMAZ', gerekce: 'Medya iddiası + görsel-kanıt eşleşmesi yok', satir: 0, siddet: kural.siddet }];
  if (medya && gorsel && !olcum) {
    const s = ilkSatir(brief, trk(kural.params.gorsel_kanit.find(g => gecerMi(brief, g))));
    return [{ sonuc: 'KALDI', gerekce: 'Medya/animasyon iddiası var, kanıt olarak görsel isteniyor, ÖLÇÜM (readyState/currentTime/istek) yok', satir: s, siddet: kural.siddet }];
  }
  return [{ sonuc: 'GECTI', gerekce: 'Medya iddiası ölçümle destekleniyor', satir: 0, siddet: kural.siddet }];
}

// ---- T3: çelişki (kod değişmez vs kod değiştir) --------------------------
function denetle_celiski_kod(brief, kural) {
  const iddiaEsl = kural.params.degismez_iddiasi.filter(i => gecerMi(brief, i));
  const kodEsl = kural.params.kod_degistiren.filter(i => gecerMi(brief, i));
  if (iddiaEsl.length && kodEsl.length) {
    return [{ sonuc: 'KALDI', gerekce: `Çelişki: "${iddiaEsl[0]}" iddiası + site/arayüz değiştiren "${kodEsl[0]}" birlikte`, satir: ilkSatir(brief, trk(iddiaEsl[0])), siddet: kural.siddet }];
  }
  return [{ sonuc: 'GECTI', gerekce: 'Kod-değişmezliği çelişkisi bulunmadı', satir: 0, siddet: kural.siddet }];
}

// ---- T4: bütçe aritmetiği -------------------------------------------------
function denetle_butce_tutarlilik(brief, kural) {
  let butce = null, butceSatir = 0;
  for (const desen of kural.params.butce_desenleri) {
    const re = new RegExp(desen, 'i');
    const m = brief.kucuk.match(re);
    if (m) { butce = parseInt(m[1], 10); butceSatir = ilkSatir(brief, m[0]); break; }
  }
  // iş kalemi sayımı: numaralı madde satırları + Ç-kanalları
  let kalem = 0;
  for (const s of brief.satirlar) {
    if (/^\s*\d+[.)]\s/.test(s)) kalem++;
    if (/(^|\s)Ç\d/.test(s)) kalem++;
  }
  if (butce === null) return [{ sonuc: 'UYGULANMAZ', gerekce: 'Sayısal bütçe (istek/tur) beyanı yok', satir: 0, siddet: kural.siddet }];
  const oran = kalem > 0 ? (kalem / butce) : 0;
  if (kalem > butce) {
    return [{ sonuc: 'KALDI', gerekce: `Bütçe ${butce}, sayılan iş kalemi ${kalem} (>bütçe) — aritmetik gergin`, satir: butceSatir, siddet: kural.siddet }];
  }
  return [{ sonuc: 'GECTI', gerekce: `Bütçe ${butce}, iş kalemi ~${kalem} — tutarlı görünüyor`, satir: butceSatir, siddet: kural.siddet }];
}

// ---- T5: kapsam mührü -----------------------------------------------------
function denetle_kapsam_muhru(brief, kural) {
  const bulgular = [];
  for (const g of kural.params.gerekli) {
    const eslesen = g.ifadeler.find(i => gecerMi(brief, i));
    if (eslesen) bulgular.push({ sonuc: 'GECTI', gerekce: `${g.ad} — var ("${eslesen}")`, satir: ilkSatir(brief, trk(eslesen)), siddet: kural.siddet });
    else bulgular.push({ sonuc: 'KALDI', gerekce: `${g.ad} — brief'te anılmamış`, satir: 0, siddet: kural.siddet });
  }
  return bulgular;
}

// ---- T6 / T7: koşullu sistem teması / uydurma kapısı ----------------------
function denetle_kosullu(brief, kural) {
  const bulgular = [];
  for (const k of kural.params.kosullar) {
    const tetikEsl = k.tetik.find(t => gecerMi(brief, t));
    if (!tetikEsl) { bulgular.push({ sonuc: 'UYGULANMAZ', gerekce: `${k.ad} — tetik yok (ilgisiz)`, satir: 0, siddet: kural.siddet }); continue; }
    const gerekEsl = k.gerekli.find(g => gecerMi(brief, g));
    if (gerekEsl) bulgular.push({ sonuc: 'GECTI', gerekce: `${k.ad} — tetik "${tetikEsl}", kapı "${gerekEsl}" var`, satir: ilkSatir(brief, trk(gerekEsl)), siddet: kural.siddet });
    else bulgular.push({ sonuc: 'KALDI', gerekce: `${k.ad} — tetik "${tetikEsl}" var ama gerekli kapı (${k.gerekli.slice(0, 3).join(' / ')}...) anılmamış`, satir: ilkSatir(brief, trk(tetikEsl)), siddet: kural.siddet });
  }
  return bulgular;
}

// ---- T8: geri dönüş -------------------------------------------------------
function denetle_geri_donus(brief, kural) {
  const tetikEsl = kural.params.tetik.find(t => gecerMi(brief, t));
  if (!tetikEsl) return [{ sonuc: 'UYGULANMAZ', gerekce: 'Silme/taşıma/değiştirme tetiği yok', satir: 0, siddet: kural.siddet }];
  const gerekEsl = kural.params.gerekli.find(g => gecerMi(brief, g));
  if (gerekEsl) return [{ sonuc: 'GECTI', gerekce: `Değiştirme var ("${tetikEsl}"), geri dönüş yolu "${gerekEsl}" tanımlı`, satir: ilkSatir(brief, trk(gerekEsl)), siddet: kural.siddet }];
  return [{ sonuc: 'KALDI', gerekce: `Değiştirme/taşıma var ("${tetikEsl}") ama geri dönüş yolu (revert/arşiv/stash) tanımsız`, satir: ilkSatir(brief, trk(tetikEsl)), siddet: kural.siddet }];
}

const YONTEMLER = {
  referans_varligi: denetle_referans_varligi,
  yasak_ifade: denetle_yasak_ifade,
  kanit_gorseli: denetle_kanit_gorseli,
  celiski_kod: denetle_celiski_kod,
  butce_tutarlilik: denetle_butce_tutarlilik,
  kapsam_muhru: denetle_kapsam_muhru,
  sistem_temasi: denetle_kosullu,
  uydurma_kapisi: denetle_kosullu,
  geri_donus: denetle_geri_donus,
};

function calistir(briefYolu) {
  const kurallarDosya = JSON.parse(readFileSync(resolve(KOK, 'arac/brief-kurallari.json'), 'utf-8'));
  const brief = briefOku(briefYolu);
  const rapor = [];
  let engel = 0, uyari = 0;
  for (const kural of kurallarDosya.kurallar) {
    const yontem = YONTEMLER[kural.yontem];
    if (!yontem) { rapor.push({ kural, bulgular: [{ sonuc: 'HATA', gerekce: `bilinmeyen yöntem: ${kural.yontem}`, satir: 0, siddet: kural.siddet }] }); continue; }
    const bulgular = yontem(brief, kural);
    for (const b of bulgular) {
      if (b.sonuc === 'KALDI') { if (b.siddet === 'ENGEL') engel++; else uyari++; }
    }
    rapor.push({ kural, bulgular });
  }
  return { brief, rapor, engel, uyari, kurallarDosya };
}

function sonucEtiketi(engel, uyari) {
  if (engel > 0) return `${engel} ENGEL` + (uyari ? ` + ${uyari} UYARI` : '');
  if (uyari > 0) return `${uyari} UYARI`;
  return 'TEMİZ';
}

function raporMetni(briefYolu, sonuc, zamanDamga) {
  const { rapor, engel, uyari } = sonuc;
  const L = [];
  L.push(`# BRIEF DENETİM RAPORU`);
  L.push(``);
  L.push(`- Brief: \`${briefYolu}\``);
  L.push(`- Zaman: ${zamanDamga}`);
  L.push(`- **Sonuç: ${sonucEtiketi(engel, uyari)}**`);
  L.push(``);
  L.push(`> SINIR: Bu araç kural ihlali arar; brief'in stratejik doğruluğunu / iş önceliğini / mimari isabetini denetlemez. Düşman geçişi (D1-D4) ve amaç özeti (3b) MUHAKEME gerektirir ve Claude Code tarafından ayrıca yapılır. "TEMİZ" = "brief doğru" değildir.`);
  L.push(``);
  L.push(`## Kural bazında`);
  L.push(``);
  for (const { kural, bulgular } of rapor) {
    const kaldi = bulgular.filter(b => b.sonuc === 'KALDI');
    const durum = kaldi.length ? (kaldi.some(b => b.siddet === 'ENGEL') ? 'KALDI/ENGEL' : 'KALDI/UYARI')
      : (bulgular.every(b => b.sonuc === 'UYGULANMAZ') ? 'UYGULANMAZ' : 'GEÇTİ');
    L.push(`### [${kural.tip}] ${kural.ad} — ${durum} (${kural.siddet})`);
    L.push(`- Kural: ${kural.metin}`);
    L.push(`- Kaynak: ${(Array.isArray(kural.kaynak) ? kural.kaynak : [kural.kaynak]).join(', ')}`);
    if (kural._temel_notu) L.push(`- Temel notu: ${kural._temel_notu}`);
    for (const b of bulgular) {
      const yer = b.satir ? ` (satır ${b.satir})` : '';
      L.push(`  - ${b.sonuc}: ${b.gerekce}${yer}`);
    }
    L.push(``);
  }
  return L.join('\n');
}

function konsol(briefYolu, sonuc) {
  const { rapor, engel, uyari } = sonuc;
  console.log(`\nBRIEF DENETÇİSİ — ${briefYolu}`);
  console.log('─'.repeat(60));
  for (const { kural, bulgular } of rapor) {
    for (const b of bulgular) {
      if (b.sonuc === 'GECTI' || b.sonuc === 'UYGULANMAZ') continue;
      const yer = b.satir ? ` [s.${b.satir}]` : '';
      console.log(`  ${b.sonuc}/${b.siddet}  [${kural.tip}] ${b.gerekce}${yer}`);
    }
  }
  console.log('─'.repeat(60));
  console.log(`SONUÇ: ${sonucEtiketi(engel, uyari)}\n`);
}

// ---- ana ------------------------------------------------------------------
const briefYolu = process.argv[2];
if (!briefYolu) { console.error('Kullanım: node arac/brief-denetci.mjs <brief-dosyasi.md>'); process.exit(3); }
if (!existsSync(briefYolu)) { console.error(`Brief dosyası bulunamadı: ${briefYolu}`); process.exit(3); }

const sonuc = calistir(briefYolu);
konsol(briefYolu, sonuc);

// zaman damgası argümandan alınabilir (--zaman=...) yoksa çalışma anı
let zamanDamga = process.env.DENETIM_ZAMAN || '';
if (!zamanDamga) { zamanDamga = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + 'Z'; }
const raporYolu = resolve(KOK, `cikti/denetim/brief/${zamanDamga}.md`);
import('node:fs').then(fs => {
  fs.mkdirSync(dirname(raporYolu), { recursive: true });
  fs.writeFileSync(raporYolu, raporMetni(briefYolu, sonuc, zamanDamga));
  console.log(`Rapor: ${raporYolu}`);
  process.exit(sonuc.engel > 0 ? 2 : (sonuc.uyari > 0 ? 1 : 0));
});
