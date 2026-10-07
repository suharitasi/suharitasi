// ORTAK NORMALİZASYON (13.09.2026) — build-time kancaları ile src/data
// modülleri arasındaki tekrarı kaldırır. Saf fonksiyonlar; JSON importu YOK
// (astro.config.mjs'ten de import edilebilir).
const BELIRSIZ = /belirsiz/i;

/** Kısıt sorgu kayıtlarını normalize et (il/ilçe/durum/tarih/kaynak).
 *  ana + ek JSON dosyalarının `kayitlar` dizilerini alır.
 *
 *  MÜKERRER KİMLİĞİ (22.09.2026 onarımı): eski anahtar
 *  `kaynak_url | rg_tarih | saha_adi.slice(0,60)` idi. `ek` kayıtlarında
 *  `saha_adi` HİÇ YOKTUR (310/310 boş), bu yüzden anahtar `URL|tarih`e
 *  düşüyor ve aynı Resmî Gazete sayısındaki FARKLI ilanlar birleşiyordu:
 *  362 geçerli kayıt → 204'e iniyor, Ardahan/Kars/Gümüşhane/Aksaray
 *  tamamen kayboluyor, tahsise kapatma 20 → 7'ye düşüyordu (ölçüm).
 *
 *  Yeni kimlik YALNIZ YAPISAL alanlardan kurulur: url · tarih · durum ·
 *  SIRALI il kümesi. Böylece farklı il/durum taşıyan ilanlar ayrı kalır,
 *  aynısı mükerrer sayılır. `pasaj` BİLEREK dışarıda — 6e58fd7'de
 *  "pasaj çıkarımı ölçülüp elendi" kararı gereği OCR metni kimlik taşımaz. */
const ilKimlik = (iller) => [...iller].sort((a, b) => a.localeCompare(b, 'tr')).join('~');

/** PASAJ KAYITLARINDA İL YAKINLIK KURALI (07.10.2026 denetimi, sahip kararı EK-2/2).
 *  OCR pasajı (ek kayıt) aynı RG sayfasındaki komşu kararnameleri de taşır; il
 *  alanı pasajda geçen HER il adıyla doldurulmuştu (ör. Afganistan vize
 *  kararnamesi pasajı Konya/Mersin/Niğde'ye yazılmıştı). Kural: il adı, anahtar
 *  ifadenin (yeraltı suyu / işletme sahası / tahsise kapatma / kısıt) ±PENCERE
 *  karakter yakınında geçiyorsa kalır; anahtar ifade pasajda hiç yoksa aday
 *  liste olduğu gibi korunur (yargı yok); hiçbir il yakın değilse liste boşalır
 *  ve kayıt il eşlemesinden düşer (sayfaya girmez; raporda listelenir).
 *  Veri dosyasına dokunulmaz; yalnız okuma mantığı. */
export const PASAJ_ANAHTAR = /yeralt[ıi]su|işletmesahas|isletmesahas|tahsisekapat|k[ıi]s[ıi]t/giu;
const PENCERE = 130;
// OCR pasajlarında harfler boşlukla ayrılmış ("K o n y a") ya da satır sonu
// tiresiyle bölünmüş ("Kon­ya") gelir; rg-icerik-tara.py'nin norm() kuralıyla
// aynı biçimde boşluk/tire/yumuşak tire atılıp küçük harfe indirilir.
const sikistir = (s) => String(s ?? '').toLocaleLowerCase('tr-TR').replace(/[\s\u00AD\-–—.,;:()«»"'’]+/g, '');
export function pasajIlleri(pasaj, adayIller, pencere = PENCERE) {
  const metin = sikistir(pasaj);
  const iller = (adayIller ?? []).filter(Boolean);
  if (!metin || !iller.length) return iller;
  const anahtarlar = [...metin.matchAll(PASAJ_ANAHTAR)].map((m) => m.index);
  if (!anahtarlar.length) return iller;
  return iller.filter((il) => {
    const ad = sikistir(il);
    let i = metin.indexOf(ad);
    while (i >= 0) {
      if (anahtarlar.some((a) => Math.abs(a - i) <= pencere)) return true;
      i = metin.indexOf(ad, i + 1);
    }
    return false;
  });
}

export function kisitNormalize(anaKayitlar = [], ekKayitlar = []) {
  const gorulen = new Set();
  const out = [];
  for (const k of [...anaKayitlar, ...ekKayitlar]) {
    const ilHam = k.il;
    let iller = (Array.isArray(ilHam) ? ilHam : (ilHam ? [ilHam] : [])).filter((x) => x && !BELIRSIZ.test(x));
    // Pasaj (saha adı taşımayan OCR) kaydında il listesi yakınlık kuralından geçer.
    if (!k.saha_adi && k.pasaj) iller = pasajIlleri(k.pasaj, iller);
    if (!iller.length) continue;
    const saha = (k.saha_adi || '').replace(/\s+/g, ' ').trim().slice(0, 200);
    const anahtar = `${k.kaynak_url || ''}|${k.rg_tarih || ''}|${k.durum || ''}|${ilKimlik(iller)}`;
    if (gorulen.has(anahtar)) continue;
    gorulen.add(anahtar);
    out.push({
      il: iller,
      ilce: k.ilceler && typeof k.ilceler === 'object' ? Object.keys(k.ilceler) : [],
      durum: k.durum || 'belirsiz',
      tarih: k.rg_tarih || '',
      kaynak: k.kaynak_url || '',
      saha,
    });
  }
  // tarih "DD.MM.YYYY" — sözlük sırası gün'e göre bozar; YYYYMMDD'ye çevir.
  const tarihAnahtar = (t) => String(t || '').split('.').reverse().join('');
  out.sort((a, b) => tarihAnahtar(b.tarih).localeCompare(tarihAnahtar(a.tarih)));
  return out;
}

/** Su işlemlerini yetkili kurum + dayanak + kanalla birleştir. */
export function islemJoin(suIslemleri = [], hangiKapi = [], suBirimleri = []) {
  const kb = Object.fromEntries(suBirimleri.map((k) => [k.id, k]));
  const hb = Object.fromEntries(hangiKapi.map((s) => [s.islem_id, s]));
  return suIslemleri.map((i) => {
    const s = hb[i.id] || {};
    return {
      id: i.id, ad: i.islem_adi, dayanak: i.dayanak, kaynak: i.kaynak,
      yetkiliKurumlar: (s.yetkili_kurum_id || []).map((id) => ({ id, ad: (kb[id] || {}).ad_resmi || id, kisaltma: (kb[id] || {}).kisaltma || null })),
      kurumlar: (s.yetkili_kurum_id || []).map((id) => ({ id, ad: (kb[id] || {}).ad_resmi || id, kisaltma: (kb[id] || {}).kisaltma || null })),
      mevzuatDayanagi: s.mevzuat_dayanagi || null,
      basvuruKanali: s.basvuru_kanali || null,
      durum: s.durum || null,
      ilgiliRehber: s.ilgili_rehber || null,
    };
  });
}
