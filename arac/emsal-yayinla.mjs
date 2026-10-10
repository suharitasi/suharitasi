#!/usr/bin/env node
/* ============================================================================
   EMSAL İNCELE-YAYINLA — ADIM 5 (v6.0), 22.09.2026.
   ----------------------------------------------------------------------------
   NE YAPAR: `data/emsal-adaylari.json` adaylarının RESMÎ KARAR METNİNİ çeker,
   İÇERİK SÜZGECİNDEN geçirir (yalnız su hukuku ile ilgili olanlar) ve onaylı
   adayları `data/kamu/emsal-kararlar.json`'a YAYINLAR.

   K7 (UYDURMA YASAĞI): `ozet` RESMÎ METİNDEN BİREBİR ALINTIDIR (yorum/özet
   ÜRETİLMEZ); `konu` metinden anahtar kelimeyle belirlenir; `kaynak` doğrudan
   resmî karar bağlantısıdır. İlgisiz aday (ör. mermer ocağı ÇED) YAYINLANMAZ.

   KULLANIM:
     node arac/emsal-yayinla.mjs --kuru          # yalnız süz, rapor et (yazma)
     node arac/emsal-yayinla.mjs --limit 40      # onaylılardan en çok 40'ını yayınla
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const KOK = process.cwd();
const arg = (ad, v) => { const i = process.argv.indexOf(ad); return i >= 0 && process.argv[i + 1] ? Number(process.argv[i + 1]) : v; };
const LIMIT = arg('--limit', 40);
const GECIKME = arg('--gecikme', 2500);
const KURU = process.argv.includes('--kuru');

const HAVUZ = join(KOK, 'data/emsal-adaylari.json');
const YAYIM = join(KOK, 'data/kamu/emsal-kararlar.json');
const CACHE = join(KOK, 'veri/ham/yargi');
const INCELEME = join(CACHE, 'aday-inceleme.json');
const TABAN = { danistay: 'https://karararama.danistay.gov.tr', uyap: 'https://emsal.uyap.gov.tr' };
const UA = 'suharitasi-arastirma/1.0 (+https://suharitasi.com)';
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
const atomikYaz = (y, s) => { const g = y + '.tmp'; writeFileSync(g, s, 'utf8'); renameSync(g, y); };

function htmlToMetin(raw) {
  return String(raw).replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '')
    .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}
function metinCache(kaynak, rawId) {
  const p = join(CACHE, kaynak, 'metin', `${rawId}.txt`);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}
async function metinCek(kaynak, rawId, kelime) {
  const onbellek = metinCache(kaynak, rawId);
  if (onbellek) return onbellek;
  for (let d = 1; d <= 3; d++) {
    try {
      const r = await fetch(`${TABAN[kaynak]}/getDokuman?id=${rawId}&arananKelime=${encodeURIComponent(kelime || '')}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const t = await r.text();
      let html = t;
      if (kaynak === 'uyap') { try { const j = JSON.parse(t); html = typeof j?.data === 'string' ? j.data : ''; } catch { html = ''; } }
      const metin = htmlToMetin(html);
      mkdirSync(join(CACHE, kaynak, 'metin'), { recursive: true });
      atomikYaz(join(CACHE, kaynak, 'metin', `${rawId}.txt`), metin + '\n');
      await bekle(GECIKME); // yalnız GERÇEK istekten sonra bekle (önbellek anında döner)
      return metin;
    } catch (e) { await bekle(GECIKME * d * 2); }
  }
  return null;
}

// — Metinden KONU çıkarımı (anahtar kelime; yorum yok) —
const KONULAR = [
  [/(kuyu (kapatma|kapatılma)|kapatma tedbir)/i, 'Kuyu kapatma', ['kuyu-belgesi-iptal-davalari', 'ruhsatsiz-kuyu-cezalari']],
  [/(yeralt[ıi] ?suyu)/i, 'Yeraltı suyu', ['yeralti-suyu-isletme-sahasi', 'kuyu-ruhsati']],
  [/(kuyu ruhsat|arama belgesi|kullanma belgesi|ıslah.{0,3}tadil)/i, 'Kuyu belgesi/ruhsatı', ['kuyu-ruhsati', 'ruhsatsiz-kuyu-cezalari']],
  [/(su tahsis|tahsisi)/i, 'Su tahsisi', ['su-tahsisi-oncelik-sirasi']],
  [/(kaynak suyu)/i, 'Kaynak suyu', ['kaynak-suyu-kiralama', 'kaynak-hakki-komsu-su']],
  [/(su hakk[ıi]|mecra|irtifak)/i, 'Su hakkı / mecra', ['kaynak-hakki-komsu-su']],
  [/(jeotermal|5686)/i, 'Jeotermal', ['jeotermal-ruhsat']],
  [/(kamula[şs]t[ıi]rma)/i, 'Kamulaştırma', ['baraj-kamulastirmasi']],
];

// — Konu metnini (dava konusu) resmî metinden BİREBİR çıkar —
function konuMetniBul(metin) {
  let m = metin.match(/Dava konusu istem\s*:\s*([\s\S]*?)(?:\n\s*(?:İlk Derece|Bölge İdare|Danıştay|Temyiz|İNCELEME|HUKUK[İI]|KARAR SONUCU|DAVA KONUSU)|$)/i);
  if (!m) m = metin.match(/İSTEM[İI]N KONUSU\s*:\s*([\s\S]*?)\n\s*[A-ZÇĞİÖŞÜ ]{3,}/);
  if (!m) m = metin.match(/GEREKÇE\s*:\s*([\s\S]*?)(?:\n\s*(?:HÜKÜM|KARAR|HUKUK[İI]|TALEP SONUCU)|$)/i);
  if (!m) return '';
  let t = m[1].replace(/\s+/g, ' ').trim();
  // ~300 karakter, cümle sınırında kes
  if (t.length > 300) { const i = t.lastIndexOf('. ', 299); t = i > 80 ? t.slice(0, i + 1) : t.slice(0, 297) + '…'; }
  return t;
}
function konuBul(metin) {
  const s = (metin || '').toLowerCase();
  for (const [re, ad, rehberler] of KONULAR) if (re.test(s)) return { konu: ad, rehberler };
  return null;
}
const slug = (s) => String(s).toLowerCase().replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const yil = (t) => { const m = String(t || '').match(/(19|20)\d{2}/); return m ? Number(m[0]) : null; };

async function main() {
  const havuz = JSON.parse(readFileSync(HAVUZ, 'utf8'));
  const adaylar = havuz.adaylar || [];
  const incelemeler = [];
  let cekimHatasi = 0; // metni HİÇ çekilemeyen adaylar (ağ/kaynak arızası)
  console.log(`[yayinla] ${adaylar.length} aday inceleniyor (kuru=${KURU})`);

  for (const a of adaylar) {
    const kaynak = String(a.id || '').split('-')[0];
    const rawId = String(a.id || '').split('-').slice(1).join('-');
    if (!TABAN[kaynak]) { incelemeler.push({ ...a, _ilgili: false, _not: 'kaynak tanınmadı' }); continue; }
    const metin = await metinCek(kaynak, rawId, a.konu);
    // ÇEKİM HATASI ≠ ALAKASIZ: metin null ise kayıt "reddedildi" sayılmaz
    // (ilgili=null); aksi hâlde kaynak/ağ kesintisi sessizce "0 ilgili" gibi
    // görünür ve aday durumu bozulurdu (sessiz hata yasağı).
    if (metin === null) {
      cekimHatasi++;
      incelemeler.push({ ...a, _ilgili: null, _cekimHata: true, _konu: null, _rehberler: [], _ozet: '' });
      if (adaylar.indexOf(a) % 20 === 0) console.log(`  ... ${adaylar.indexOf(a)}/${adaylar.length}`);
      continue;
    }
    const konuMetni = konuMetniBul(metin);
    const k = konuBul(konuMetni || metin || '');
    const tarihler = [...metin.matchAll(/(\d{2})\/(\d{2})\/(\d{4}) tarihinde[^.]{0,80}karar verildi/g)];
    const kt = tarihler.length ? tarihler[tarihler.length - 1].slice(1, 4).join('.') : null;
    incelemeler.push({ ...a, _ilgili: !!(k && konuMetni), _konu: k?.konu || null, _rehberler: k?.rehberler || [], _ozet: konuMetni.slice(0, 300), _kararTarihi: kt });
    if (adaylar.indexOf(a) % 20 === 0) console.log(`  ... ${adaylar.indexOf(a)}/${adaylar.length}`);
  }

  if (cekimHatasi > 0) {
    console.warn(`[yayinla] UYARI: ${cekimHatasi}/${adaylar.length} adayın metni çekilemedi (ağ/kaynak arızası olabilir)`);
  }
  if (adaylar.length && cekimHatasi === adaylar.length) {
    console.error('[yayinla] HATA: hiçbir adayın metni çekilemedi — yayın YAPILMADI (toplam çekim arızası).');
    process.exit(1);
  }

  const ilgili = incelemeler.filter((x) => x._ilgili);
  console.log(`[yayinla] ilgili: ${ilgili.length} / ${adaylar.length}`);
  atomikYaz(INCELEME, JSON.stringify({ _cekim: new Date().toISOString(), toplam: adaylar.length, ilgili: ilgili.length, kayitlar: incelemeler.map((x) => ({ id: x.id, merci: x.merci, esas: x.esas, karar: x.karar, yil: x.yil, ilgili: x._ilgili, konu: x._konu, rehberler: x._rehberler, ozet: x._ozet })) }, null, 1) + '\n');

  if (KURU) { console.log('[yayinla] --kuru: yayın YAPILMADI. Örnek ilgililer:'); for (const x of ilgili.slice(0, 12)) console.log(`  - ${x.merci} ${x.esas}/${x.karar} · ${x._konu} · ${x._ozet.slice(0, 90)}`); return; }

  // YAYIN: mevcut yayımlı künyeler korunur, ilgililer eklenir (dedupe).
  const yayim = JSON.parse(readFileSync(YAYIM, 'utf8'));
  const varMi = new Set((yayim.kararlar || []).map((k) => `${k.esas}|${k.karar}`));
  let eklenen = 0;
  for (const x of ilgili) {
    if (eklenen >= LIMIT) break;
    if (varMi.has(`${x.esas}|${x.karar}`)) continue;
    yayim.kararlar.push({
      id: `danistay-${slug(x.merci)}-${x.esas.replace('/', '-')}-${x.karar.replace('/', '-')}`,
      merci: x.merci, esas: x.esas, karar: x.karar, yil: x.yil,
      konu: x._konu, ozet: x._ozet, rehberler: x._rehberler,
      kaynak: x.kaynak_url, dogrulama: 'kaynakli',
      // DURAK 1 A-d (10.10.2026): resmî sunucudan çekilen metinde karar tarihi okunduysa "dogrulandi".
      // Karar sayfası alıntısı için ardından: python3 arac/emsal-alinti-uret.py (SECIM'e kayıt eklenir).
      resmi_dogrulama: x._kararTarihi
        ? { durum: 'dogrulandi', tarih: new Date().toISOString().slice(0, 10), sunucu: new URL(TABAN[String(x.id).split('-')[0]]).host,
            url: x.kaynak_url, karar_tarihi: x._kararTarihi, yontem: 'emsal-yayinla.mjs: resmî metin çekildi, karar tarihi metinden okundu' }
        : { durum: 'dogrulanamadi', tarih: new Date().toISOString().slice(0, 10), not: 'resmî metinde karar tarihi okunamadı' },
    });
    varMi.add(`${x.esas}|${x.karar}`); eklenen++;
  }
  yayim.kararlar.sort((a, b) => (b.yil || 0) - (a.yil || 0));
  atomikYaz(YAYIM, JSON.stringify(yayim, null, 1) + '\n');
  console.log(`[yayinla] yayınlandı: +${eklenen} · toplam ${yayim.kararlar.length}`);

  // Aday havuzu durumları güncelle (incelenenler dogrulandi/reddedildi).
  for (const a of havuz.adaylar) {
    const inc = incelemeler.find((x) => x.id === a.id);
    if (inc) a.dogrulama = inc._ilgili ? 'dogrulandi' : 'reddedildi';
  }
  havuz.aday_sayisi = havuz.adaylar.length;
  atomikYaz(HAVUZ, JSON.stringify(havuz, null, 2) + '\n');
  console.log('[yayinla] aday havuzu durumları güncellendi');
}
main().catch((e) => { console.error('[yayinla] HATA:', e?.stack || e); process.exit(1); });
