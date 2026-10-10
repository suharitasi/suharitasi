// MADDE SAYFASI BAĞLARI — brif 2.2 (10.10.2026): önceki/sonraki madde, maddeyi anan rehberler,
// resmî metnin son kontrolü (mevzuat radarı) ve metindeki değişiklik işaretleri. Yorum üretmez;
// her şey veri dosyalarından ya da resmî metnin kendisinden okunur.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const kok = process.cwd();
const oku = (y) => JSON.parse(readFileSync(join(kok, y), 'utf8'));
const mevzuat = oku('data/kamu/mevzuat-maddeleri.json');
const surum = oku('data/kamu/mevzuat-surum.json');
const degisiklik = oku('data/kamu/mevzuat-degisiklik.json');

export const slugla = (s) =>
  String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const maddeYolu = (m) => `/mevzuat/${slugla(m.kanunKisa)}/${slugla(m.madde)}/`;

const TUR_SIRA = (madde) => (/^Geçici/.test(madde) ? 2 : /^Ek/.test(madde) ? 1 : 0);
const NO = (madde) => Number((madde.match(/(\d+)/) ?? [0, 0])[1]);
const SIRALI = {};
for (const m of mevzuat.maddeler) (SIRALI[m.kanunKisa] ??= []).push(m);
for (const l of Object.values(SIRALI)) l.sort((a, b) => TUR_SIRA(a.madde) - TUR_SIRA(b.madde) || NO(a.madde) - NO(b.madde));

export function komsuMaddeler(m) {
  const l = SIRALI[m.kanunKisa] ?? [];
  const i = l.findIndex((x) => x.id === m.id);
  return { onceki: i > 0 ? l[i - 1] : null, sonraki: i >= 0 && i < l.length - 1 ? l[i + 1] : null };
}

// Rehber gövdelerinde /mevzuat/<kanun>/<madde>/ bağlantısı veren rehberler.
const REHBER_BAG = {};
for (const f of readdirSync(join(kok, 'src/content/rehberler'))) {
  if (!f.endsWith('.md')) continue;
  const t = readFileSync(join(kok, 'src/content/rehberler', f), 'utf8');
  for (const x of t.matchAll(/\/mevzuat\/([a-z0-9-]+)\/((?:ek-|gecici-)?madde-[0-9a-z-]+)\//g)) {
    const a = (REHBER_BAG[`/mevzuat/${x[1]}/${x[2]}/`] ??= new Set());
    a.add(f.replace(/\.md$/, ''));
  }
}
export const maddeyiAnanRehberler = (m) => [...(REHBER_BAG[maddeYolu(m)] ?? [])];

// Resmî metin kontrolü: haftalık mevzuat radarı (data/kamu/mevzuat-surum.json → son_kontrol) resmî
// metni madde madde okur; değişiklik bulunursa data/kamu/mevzuat-degisiklik.json'a kayıt düşer.
export function resmiKontrol(m) {
  const kapsamda = Boolean(surum.mevzuatlar?.[m.kanunKisa]?.[m.madde]);
  const tarih = String(surum.son_kontrol ?? '').slice(0, 10);
  const kayitlar = (degisiklik.kayitlar ?? []).filter((k) => k.kanunKisa === m.kanunKisa && k.madde === m.madde);
  return { kapsamda, tarih: tarih ? tarih.split('-').reverse().join('.') : null, kayitlar };
}

// Resmî metnin kendi içindeki değişiklik işaretleri: "(Değişik: …)", "(Ek fıkra: …)", "(Mülga: …)".
const ISARET_RE = /\((?:Değişik|Ek|Mülga|İptal)[^()]{0,160}\)/g;
export const degisiklikIsaretleri = (metin) => [...new Set(String(metin ?? '').match(ISARET_RE) ?? [])];
