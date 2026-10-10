// 167 s. KANUN m.18 İDARİ PARA CEZASI — TEK KAYNAK (DURAK 1 A-a, 10.10.2026; son hukuki kontrol 10.10.2026, KARARLAR §73).
// Veri: data/kamu/ceza-yeniden-degerleme.json (2008–2025 VUK yeniden değerleme tebliğleri, Resmî Gazete'den
// tek tek okundu). Hesaplayıcı, rehber, madde sayfası, su hukuku tablosu, sihirbaz ve API buradan beslenir.
// cwd tabanlı okuma: hem Astro sayfalarında hem astro.config.mjs kancasında çalışır.
import { readFileSync } from 'node:fs';

const veri = JSON.parse(readFileSync('data/kamu/ceza-yeniden-degerleme.json', 'utf8'));

// — Build-time assert (sahip kararı A-a): bir yılın tebliği eksikse güncel tutar YAYIMLANMAZ —
{
  const y = veri.yillar;
  if (y[0].uygulama_yili !== 2008) throw new Error('ceza-tutar: başlangıç yılı 2008 olmalı (5728, RG 08.02.2008).');
  for (let i = 1; i < y.length; i++) {
    const s = y[i];
    if (s.uygulama_yili !== y[i - 1].uygulama_yili + 1) throw new Error(`ceza-tutar: ${y[i - 1].uygulama_yili + 1} yılı eksik — güncel tutar yayımlanamaz.`);
    if (!s.teblig_sira_no || !s.rg_tarih || !s.rg_sayi || !s.oran || !s.kaynak) throw new Error(`ceza-tutar: ${s.uygulama_yili} satırında tebliğ künyesi eksik — güncel tutar yayımlanamaz.`);
  }
}

const son = veri.yillar[veri.yillar.length - 1];
export const CEZA_KANUN = { a: veri.kanun_metnindeki.a, b: veri.kanun_metnindeki.b };
export const CEZA_YIL = son.uygulama_yili;
export const CEZA_GUNCEL = { a: [son.tutarlar.a_alt, son.tutarlar.a_ust], b: [son.tutarlar.b_alt, son.tutarlar.b_ust] };
export const CEZA_SON_DOGRULAMA = veri.son_dogrulama;
export const CEZA_YILLAR = veri.yillar;
export const CEZA_DAYANAK = veri.dayanak;
export const CEZA_YONTEM = veri.yontem;

const tl = (n) => Number(n).toLocaleString('tr-TR');
const aralik = ([a, b]) => `${tl(a)}–${tl(b)} TL`;
/** "1.000–5.000 TL (kanun metni); 2026 yılında uygulanan 30.138–151.192 TL" */
export function cezaAraligi(bent) {
  return `${aralik(CEZA_KANUN[bent])} (kanun metni); ${CEZA_YIL} yılında uygulanan ${aralik(CEZA_GUNCEL[bent])}`;
}

/** Metin içindeki yer tutucuları doldurur (rehber ön-bilgisi, madde yorumu, API). */
export function cezaYerlestir(s) {
  if (typeof s !== 'string') return s;
  return s
    .replaceAll('{{CEZA_18A}}', cezaAraligi('a'))
    .replaceAll('{{CEZA_18B}}', cezaAraligi('b'))
    .replaceAll('{{CEZA_18A_GUNCEL}}', aralik(CEZA_GUNCEL.a))
    .replaceAll('{{CEZA_18B_GUNCEL}}', aralik(CEZA_GUNCEL.b))
    .replaceAll('{{CEZA_YIL}}', String(CEZA_YIL))
    .replaceAll('{{CEZA_SON_DOGRULAMA}}', CEZA_SON_DOGRULAMA.split('-').reverse().join('.'));
}
