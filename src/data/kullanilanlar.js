/* /kullanilanlar/ SAYFASININ SAYI KAYNAĞI — hepsi BUILD'DE SAYILIR.
 *
 * KURAL (CLAUDE.md sayı disiplini): bu dosyada elle yazılmış rakam
 * YOKTUR. Her sayı gerçek dosyadan/dizinden okunur; veri büyüyünce
 * sayfa kendiliğinden güncellenir, sessiz bayatlama imkânsızdır.
 *
 * SAYILAMAYAN YAZILMAZ: bir kalem güvenilir biçimde sayılamıyorsa
 * buraya `null` döner ve sayfa o rakamı BASMAZ (uydurma yasağı).
 *
 * GÜVENLİK: bu modül yalnız SAYI üretir — yol, ad, konum, saat, eşik
 * değeri döndürmez. Sayfa da bunları basmaz (brief güvenlik kapısı).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tumGoller, tumNehirler, elenenGoller, elenenNehirler } from './gol-nehir.js';
import { AKADEMIK_SAYIM } from './potansiyel.js';

// KOK = process.cwd(): bundle derinliği Astro sürümüyle değiştiği için
// import.meta.url güvenilmez (vitrin.js'teki notla aynı ölçüm).
const KOK = process.cwd();
const oku = (y) => JSON.parse(readFileSync(join(KOK, y), 'utf8'));

/** Bir dizindeki dosyaları (alt dizinler dahil) sayar; yoksa null. */
function dosyaSay(gorece, uzanti = null) {
  const kok = join(KOK, gorece);
  if (!existsSync(kok)) return null;
  let n = 0;
  const gez = (d) => {
    for (const g of readdirSync(d, { withFileTypes: true })) {
      const y = join(d, g.name);
      if (g.isDirectory()) gez(y);
      else if (!uzanti || g.name.endsWith(uzanti)) n++;
    }
  };
  gez(kok);
  return n;
}

// ——— Veri hacmi ———
const kutleler = oku('veri/potansiyel/yas-kutleleri.json');
const yasKutlesi = Object.values(kutleler.havzalar)
  .reduce((t, h) => t + (h.kutleler?.length ?? 0), 0);
const havzaPlani = Object.keys(kutleler.havzalar).length;

const rgBaslik = oku('veri/potansiyel/isletme-sahalari.json').kayitlar;
const rgEk = oku('veri/potansiyel/isletme-sahalari-v2.json').kayitlar; // 10.10.2026: yeniden ayrıştırılmış ilan kayıtları
const rgKaydi = rgBaslik.length + rgEk.length;
const rgSayiliKayit = [...rgBaslik, ...rgEk].filter((k) => k.rg_sayi).length;

const akademik = oku('veri/potansiyel/akademik-kunye.json');
const ilKurum = oku('data/il-kurum.json');

/* Hidrografya (24.08 M7.4): 04.08 dalgası bu kaynağı kayda hiç geçirmemişti.
   Sayılar üretici modülün kendisinden gelir; Türkiye kapsamı dışında kalan
   öznitelikler (uydurma denetimi 24.08: sınır ötesi göller/nehirler)
   sayıma GİRMEZ, elenen sayısı ayrı basılır. */
const golSayisi = tumGoller().length;
const nehirSayisi = tumNehirler().length;
const hidroElenen = elenenGoller().length + elenenNehirler().length;
// Faz E (08.09.2026): ada-kalmaz — tür düzeltmesi ve kaynak çelişkisi şerhi sayıları.
const golTipDuzeltme = tumGoller().filter((g) => g.tip_duzeltme).length;
const golTipCeliski = tumGoller().filter((g) => g.tip_celiski && !g.tip_duzeltme).length;

// ——— Denetim ve araç ———
/* Sağlık kalemi sayısı: ölçerin KENDİ kaynağından sayılır (kaydet('N-ad')
   çağrıları), elle listelenmez — kalem eklendiğinde sayfa kendiliğinden
   güncellenir. */
const saglikKaynak = readFileSync(join(KOK, 'arac/site-saglik.mjs'), 'utf8');
const saglikKalemi = new Set(
  [...saglikKaynak.matchAll(/kaydet\('(\d+-[a-z-]+)'/g)].map((m) => m[1]),
).size;

const gorselKaynak = readFileSync(join(KOK, 'arac/gorsel-olc.mjs'), 'utf8');
const gorselKalemi = new Set(
  [...gorselKaynak.matchAll(/kalem: '(G\d)'/g)].map((m) => m[1]),
).size;

const briefKurali = oku('arac/brief-kurallari.json').kurallar.length;

const aracDosyasi = ['.mjs', '.py', '.sh']
  .reduce((t, u) => t + readdirSync(join(KOK, 'arac')).filter((f) => f.endsWith(u)).length, 0);

const kararSayisi = (readFileSync(join(KOK, 'KARARLAR.md'), 'utf8')
  .match(/^### \d+\./gm) || []).length;

// ——— Arşiv ———
const dsiArsiv = dosyaSay('kaynak/dsi-arsiv');
const mevzuatArsiv = dosyaSay('data/arsiv/mevzuat');
const veriSeti = readdirSync(join(KOK, 'veri/potansiyel')).filter((f) => f.endsWith('.json')).length;

/* Skill sayısı: kurulum kullanıcı düzeyindedir ve depoda değildir.
   Depodan güvenilir biçimde SAYILAMAZ → null döner, sayfa basmaz. */
const skillSayisi = null;

export const OLCEK = {
  yasKutlesi, havzaPlani, rgKaydi, rgSayiliKayit,
  // Faz D (08.09.2026): basılan = alaka süzgecinden geçen; toplanan ayrı.
  akademikKunye: AKADEMIK_SAYIM.kalan,
  akademikToplanan: akademik.toplam_kunye,
  akademikIlKapsami: AKADEMIK_SAYIM.il,
  dsiBolgesi: Object.keys(ilKurum.dsiBolgeleri).length,
  veriSeti, dsiArsiv, mevzuatArsiv,
  golSayisi, nehirSayisi, hidroElenen, golTipDuzeltme, golTipCeliski,
  saglikKalemi, gorselKalemi, briefKurali, aracDosyasi, kararSayisi,
  skillSayisi,
};

/* SAYI BEKÇİSİ: sayfada geçen her rakamın kaynağı burasıdır. Bir kalem
   beklenmedik biçimde 0/null olursa build DÜŞER — sayfa sessizce
   "0 kütle" gibi bir şey yayımlayamaz. `skillSayisi` bilinçli null
   olduğu için muaf. */
for (const [ad, deger] of Object.entries(OLCEK)) {
  if (ad === 'skillSayisi') continue;
  if (!Number.isFinite(deger) || deger <= 0) {
    throw new Error(`kullanilanlar: "${ad}" sayılamadı (${deger}) — veri kaynağı bozuk.`);
  }
}
