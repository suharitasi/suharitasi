// SU POTANSİYELİ — il bloğu üreticisi (Faz 6, brief 6.1).
// TEK kaynak: veri/potansiyel/*.json (Faz 1-5 çıktıları). İçerik kuralları:
// - Yalnız kutle-il.json'da durum="eslesti" kütleler basılır (belirsiz /
//   doğrulanamadı BASILMAZ — brief 2.3).
// - Ortalama ALINMAZ: kütle kırılımı olduğu gibi listelenir (brief AMAÇ).
// - Öz-cevap ŞABLON cümlelerden kurulur (serbest metin yok, 6.1a) ve ≤280
//   karakter build-time doğrulanır.
// - Akademik künyede baski_uygun===false basılmaz (kullanıcı şartı
//   2026-07-27: DOI/açık-erişim URL'siz künye yayınlanmaz).
import yasKutleleri from '../../veri/potansiyel/yas-kutleleri.json';
import kutleIl from '../../veri/potansiyel/kutle-il.json';
import isletme from '../../veri/potansiyel/isletme-sahalari.json';
import isletmeEk from '../../veri/potansiyel/isletme-sahalari-ek.json';
import zengin from '../../veri/potansiyel/zenginlestirme.json';
import morfoloji from '../../veri/potansiyel/morfoloji.json';
import { sayiIle } from './rg-sayi.js';
import { akademikBasilir } from './akademik-suzgec.js';
import { pasajIlleri } from './ortak-normalize.js';

// Faz D (08.09.2026): OpenAlex başlıklarında HTML varlık kalıntısı (58 başlıkta
// &amp;#039; / &#039; / &quot; / &lt; …) sayfada harfiyen basılıyordu — çözülür.
// Yeni metin üretilmez; yalnız kaynağın kendi kodlaması geri açılır.
const entityCoz = (s) => String(s ?? '')
  .replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// Site geneli sayım (kapı/vitrin/kullanılanlar sayfaları): toplanan künye
// ile alaka süzgecinden geçen künye AYRI raporlanır — süzgeç sonrası
// "1.979 açık erişim yayın" demek yanlış olurdu.
export const AKADEMIK_SAYIM = (() => {
  let toplanan = 0, kalan = 0, il = 0;
  for (const z of Object.values(zengin.iller)) {
    const ks = Array.isArray(z.akademik_kunyeler) ? z.akademik_kunyeler : [];
    const k = ks.filter(akademikBasilir).length;
    toplanan += ks.length; kalan += k; if (k > 0) il++;
  }
  return { toplanan, kalan, il };
})();

// PİLOT KAPISI KALDIRILDI (6.4, kullanıcı pilot onayı 2026-07-27):
// blok 81 ilde basılır. (Pilot listesi tarihçe için: Manisa, Çanakkale.)

// Durum yazımları kaynak belgelere göre değişir ("İYİ" / "İyi Durum" /
// "İyi durum") — görüntü katmanında normalize edilir, veri dosyası değişmez.
function durumNorm(d) {
  if (d == null) return null;
  const k = d.toLocaleLowerCase('tr');
  if (k.startsWith('iyi') || k.startsWith('İyi'.toLocaleLowerCase('tr'))) return 'İyi';
  if (k.startsWith('zayıf')) return 'Zayıf';
  if (k.startsWith('yetersiz')) return 'Yetersiz veri';
  if (k.startsWith('veri yok')) return 'veri yok';
  return d;
}

const KOD_KUTLE = {};
for (const h of Object.values(yasKutleleri.havzalar)) {
  for (const k of h.kutleler) KOD_KUTLE[k.kutle_kodu] = { ...k, havza_ad: h.resmi_ad };
}

function sayidan(n, kelime) {
  return `${n} ${kelime}`;
}

/** İl bloğunun tüm verisi; şablonlu öz-cevap dahil. */
export function ilPotansiyel(ilAdi) {
  // (b) kütle kırılımı — yalnız eşleşmiş kütleler
  const kutleler = kutleIl.kutleler
    .filter((r) => r.durum === 'eslesti' && r.iller.includes(ilAdi))
    .map((r) => {
      const k = KOD_KUTLE[r.kutle_kodu];
      return {
        kod: k.kutle_kodu,
        ad: k.kutle_adi,
        havza: k.havza_ad,
        alan_km2: k.alan_km2,
        miktar: durumNorm(k.miktar_durumu),
        kimyasal: durumNorm(k.kimyasal_durum),
        cokIlli: r.iller.length > 1 ? r.iller : null,
        durumKaynaginda: k.miktar_durumu !== 'veri yok',
      };
    })
    .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));

  const say = (alan, deger) => kutleler.filter((k) => k[alan] === deger).length;
  const dagilim = {
    toplam: kutleler.length,
    miktarIyi: say('miktar', 'İyi'),
    miktarZayif: say('miktar', 'Zayıf'),
    kimyasalIyi: say('kimyasal', 'İyi'),
    kimyasalZayif: say('kimyasal', 'Zayıf'),
    durumsuz: kutleler.filter((k) => !k.durumKaynaginda).length,
  };

  // (c) işletme/kapalı saha kayıtları (başlık + ek pasaj kayıtları)
  const rgKayitlari = isletme.kayitlar
    .filter((k) => Array.isArray(k.il) && k.il.includes(ilAdi))
    .map((k) => ({
      tur: 'baslik', metin: k.saha_adi, durum: k.durum,
      tarih: k.rg_tarih, url: k.kaynak_url,
      ...sayiIle(k),
    }));
  // İl yakınlık kuralı (EK-2/2): pasajda il adı anahtar ifadeye yakın değilse
  // kayıt bu ilin sayfasına girmez (ortak-normalize.js — kisit-sorgu ile aynı kural).
  const rgEkKayitlari = isletmeEk.kayitlar
    .filter((k) => Array.isArray(k.il) && pasajIlleri(k.pasaj, k.il).includes(ilAdi))
    .map((k) => ({
      tur: 'pasaj', metin: k.pasaj, durum: k.durum,
      tarih: k.rg_tarih, url: k.kaynak_url,
      // Pasaj kayıtları API'den sayı taşımaz; arşiv URL'sinden türetilir
      // (yöntem ve iki bağımsız doğrulaması: src/data/rg-sayi.js).
      ...sayiIle(k),
    }));

  // (d) morfoloji
  const morf = morfoloji.iller[ilAdi] ?? null;

  // (e) künyeler
  const z = zengin.iller[ilAdi] ?? {};
  const mta = Array.isArray(z.mta_kunyeleri) ? z.mta_kunyeleri : null;
  const akademikHam = Array.isArray(z.akademik_kunyeler) ? z.akademik_kunyeler : null;
  // Faz D (08.09.2026, karar §A seçenek 3): baski_uygun + DOI/URL şartına
  // ALAKA SÜZGECİ eklendi (akademik-suzgec.js — başlık/dergi su terimi
  // taşımayan künye basılmaz; ölçüm: 1.979 → 1.118, 777 → 494 yazar adı).
  // Veri dosyası değişmez. Elenen sayısı sayfada açıkça yazılır.
  const akademik = akademikHam
    ? akademikHam.filter(akademikBasilir)
      .map((k) => ({ ...k, baslik: entityCoz(k.baslik), dergi: k.dergi ? entityCoz(k.dergi) : k.dergi }))
    : null;
  const akademikElenen = akademikHam ? akademikHam.length - akademik.length : 0;
  const osm = typeof z.osm_su_noktalari === 'object' ? z.osm_su_noktalari : null;

  // (a) öz-cevap — ŞABLON cümleler (serbest metin yok)
  const cumleler = [];
  if (dagilim.toplam > 0) {
    cumleler.push(
      `${ilAdi} sınırlarına eşlenmiş ${sayidan(dagilim.toplam, 'yeraltı suyu kütlesi')} resmî havza planlarında tanımlıdır.`
    );
    const durumlu = dagilim.toplam - dagilim.durumsuz;
    if (durumlu > 0) {
      const parcalar = [];
      if (dagilim.miktarIyi + dagilim.miktarZayif > 0)
        parcalar.push(`miktar açısından ${dagilim.miktarIyi} iyi, ${dagilim.miktarZayif} zayıf`);
      if (dagilim.kimyasalIyi + dagilim.kimyasalZayif > 0)
        parcalar.push(`kimyasal açıdan ${dagilim.kimyasalIyi} iyi, ${dagilim.kimyasalZayif} zayıf`);
      if (parcalar.length) cumleler.push(`Plan verisinde ${parcalar.join('; ')} durumdadır.`);
    }
    if (dagilim.durumsuz > 0) {
      cumleler.push(
        `${sayidan(dagilim.durumsuz, 'kütlenin')} durum sınıflaması planında yayımlanmamıştır.`
      );
    }
  } else {
    cumleler.push(
      `${ilAdi} için yayımlı nehir havza yönetim planlarında il eşlemesi doğrulanmış yeraltı suyu kütlesi kaydı yoktur.`
    );
  }
  const rgToplam = rgKayitlari.length + rgEkKayitlari.length;
  if (rgToplam > 0) {
    cumleler.push(`Resmî Gazete'de ${sayidan(rgToplam, 'işletme sahası kaydı')} bulunur.`);
  }
  let ozCevap = cumleler.join(' ');
  if (ozCevap.length > 280) {
    // şablon fazlası kırpılır — cümle sınırından (280 kuralı bağlayıcı)
    while (ozCevap.length > 280 && cumleler.length > 1) {
      cumleler.pop();
      ozCevap = cumleler.join(' ');
    }
    ozCevap = ozCevap.slice(0, 280);
  }

  return {
    il: ilAdi, ozCevap, kutleler, dagilim,
    rgKayitlari, rgEkKayitlari, morf, mta, akademik, akademikElenen, osm,
    tuik: 'veri yok',
    // Faz D: süzgeç her künyeyi elerse boş başlık BIRAKILMAZ, sebep yazılır
    // (sessiz kaybolma yok — 3 il: Adıyaman, Karabük, Şırnak).
    akademikEksikNedeni: akademik === null
      ? 'veri yok (OpenAlex kota sınırı — tamamlanması iş kuyruğunda)'
      : akademik.length === 0 && akademikElenen > 0
        ? `su konulu açık erişim yayın bulunamadı (${akademikElenen} künye alaka süzgecinde elendi)`
        : null,
    durustlukEtiketi:
      'Resmî havza ve yeraltı suyu kütlesi ölçeğindeki verilerden derlenmiştir. ' +
      'Parsel düzeyinde tahmin değildir; kesin tespit hidrojeolojik etüt ve ' +
      'jeofizik ölçüm ister.',
  };
}
