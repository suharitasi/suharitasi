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
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '../..');
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
const rgEk = oku('veri/potansiyel/isletme-sahalari-ek.json').kayitlar;
const rgKaydi = rgBaslik.length + rgEk.length;
const rgSayiliKayit = [...rgBaslik, ...rgEk].filter((k) => k.rg_sayi).length;

const akademik = oku('veri/potansiyel/akademik-kunye.json');
const ilKurum = oku('data/il-kurum.json');

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
  akademikKunye: akademik.toplam_kunye,
  akademikIlKapsami: akademik.il_kapsami,
  dsiBolgesi: Object.keys(ilKurum.dsiBolgeleri).length,
  veriSeti, dsiArsiv, mevzuatArsiv,
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
