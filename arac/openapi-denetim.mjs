#!/usr/bin/env node
/* ============================================================================
   OPENAPI ŞEMA DENETİMİ — ADIM 3 (v6.0), 21.09.2026.
   ----------------------------------------------------------------------------
   NEDEN: public/api/v1/openapi.json STATİK bir dosyadır; uç noktalar
   değişirse sessizce bayatlar. Bu bekçi, şemada bildirilen alan adlarını
   dist'teki GERÇEK uç çıktılarıyla karşılaştırır ve kaymayı kırmızı verir
   (sessiz hata yasağı).
   KONTROL:
     1) Her şema için gerçek çıktıda görülen alan adları, şemada tanımlı mı?
        (additionalProperties:true olan HavzaVerisi hariç — ham koleksiyon.)
     2) Şemadaki `required` alanlar tüm çıktılarda var mı?
   KULLANIM: node arac/openapi-denetim.mjs [dist-dizini]
   ÇIKIŞ: kayma varsa 1, temizse 0.
   ========================================================================== */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const KOK = process.cwd();
const DIST = process.argv[2] || join(KOK, 'dist');

const specYolu = join(KOK, 'public/api/v1/openapi.json');
if (!existsSync(specYolu)) { console.error('[openapi] spec yok:', specYolu); process.exit(2); }
if (!existsSync(DIST)) { console.error('[openapi] dist yok — önce "npm run build".'); process.exit(2); }

const spec = JSON.parse(readFileSync(specYolu, 'utf8'));
const S = spec.components.schemas;
const okuJsonDizini = (d) =>
  existsSync(d)
    ? readdirSync(d).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(d, f), 'utf8')))
    : [];

const sorunlar = [];
const anahtarKumesi = (nesneler) => {
  const s = new Set();
  for (const n of nesneler) for (const k of Object.keys(n || {})) s.add(k);
  return s;
};

// — GÖMÜLÜ şema denetimi (alan adları şemada tanımlı mı) —
function alanDenetle(ad, sablon, nesneler, { additional = false } = {}) {
  if (!sablon) { sorunlar.push(`${ad}: şema tanımı yok`); return; }
  const tanimli = new Set(Object.keys(sablon.properties || {}));
  if (!additional) {
    for (const k of anahtarKumesi(nesneler)) {
      if (!tanimli.has(k)) sorunlar.push(`${ad}: "${k}" gerçek çıktıda var, şemada TANIMSIZ`);
    }
  }
  for (const req of sablon.required || []) {
    if (!tanimli.has(req)) sorunlar.push(`${ad}: required "${req}" properties'te yok`);
    for (const n of nesneler) if (n && !(req in n)) sorunlar.push(`${ad}: required "${req}" bir çıktıda eksik`);
  }
}

// — İL —
const ilDosyalar = okuJsonDizini(join(DIST, 'api/v1/il'));
if (!ilDosyalar.length) sorunlar.push('il: dist/api/v1/il boş');
alanDenetle('IlYaniti', S.IlYaniti, ilDosyalar);
alanDenetle('DsiBolge', S.DsiBolge, ilDosyalar.flatMap((d) => d.dsiBolgeleri || []));
alanDenetle('HavzaOzet', S.HavzaOzet, ilDosyalar.flatMap((d) => d.havzalar || []));
alanDenetle('RgKisitKaydi', S.RgKisitKaydi, ilDosyalar.flatMap((d) => d.rgKisitKayitlari || []));
alanDenetle('MevzuatDayanagi', S.MevzuatDayanagi, ilDosyalar.flatMap((d) => d.mevzuatDayanagi || []));

// — HAVZA —
const havzaDosyalar = okuJsonDizini(join(DIST, 'api/v1/havza'));
if (!havzaDosyalar.length) sorunlar.push('havza: dist/api/v1/havza boş');
alanDenetle('HavzaYaniti', S.HavzaYaniti, havzaDosyalar);
alanDenetle('Kunye', S.Kunye, havzaDosyalar.flatMap((d) => (d.veri && d.veri.kunye) || []));
// HavzaVerisi ham koleksiyon verisi: additionalProperties true → yalnız required denetlenir.
alanDenetle('HavzaVerisi', S.HavzaVerisi, havzaDosyalar.map((d) => d.veri || {}), { additional: true });

const ozet = {
  spec: 'public/api/v1/openapi.json',
  openapi: spec.openapi,
  ilDosya: ilDosyalar.length,
  havzaDosya: havzaDosyalar.length,
  sorunSayisi: sorunlar.length,
  sorunlar,
};
console.log(JSON.stringify(ozet, null, 2));
if (sorunlar.length) {
  console.error(`[openapi] KIRMIZI — şema/çıktı kayması: ${sorunlar.length} bulgu`);
  process.exit(1);
}
console.log(`[openapi] YEŞİL — ${ilDosyalar.length} il + ${havzaDosyalar.length} havza çıktısı şemayla uyumlu`);
