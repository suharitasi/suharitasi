/* KAPSAM KALEMLERİ — denetim boşluklarını kapatan ölçerler (M3-M10).
   (kapsam briefi, 28.07.2026; kaynak: rapor/denetim-kapsami.md)

   TASARIM: hepsi SALT-ÖLÇÜM. Hiçbiri onarım tetiklemez, depoya yazmaz.
   site-saglik.mjs bunları çağırır; taban dosyaları izleme/ altında
   SÜRÜMLÜ YAPILANDIRMADIR (log değil) ve bilinçle commit edilir.

   ORTAK İLKE (md14 dersi): eşik dayatılmaz, ölçülen varyanstan türetilir;
   vekil kriter yasak — ölçülen şey umursanan şey olmalı. */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

// ——————————————————————— M3: DIŞ BAĞLANTI ———————————————————————
/* ÖLÇÜLDÜ (28.07, dist taraması): 1.043 benzersiz dış link —
   MTA 324 · doi.org 322 · Resmî Gazete 141 · DergiPark 97 · handle 61 ·
   tarimorman 45 · mevzuat 22 · diğer. Tamamını her koşuda taramak hem
   nazik değil hem yavaş → örneklem.
   ÖRNEKLEM BOYUTU ÖLÇÜLEN TOPLAMDAN TÜRETİLDİ: 1.043 linkte %5 örneklem
   = 52 link; 1 sn arayla ≈ 1 dakika. Aylık tam tarama ayrı bayrakla.
   GÖRGÜ: HEAD önce (gövde indirmeden), 405/501 dönerse GET'e düşülür;
   istekler arası ≥1 sn; tek konağa ardışık yığılma yok (karıştırılır).
   SINIFLANDIRMA: 404/410 = KIRMIZI (link gerçekten ölmüş);
   zaman aşımı/5xx/429 = SARI (dış sunucu geçici olabilir — bizim
   arızamız değil, ama görünmeli). */
/* HTML VARLIK ÇÖZÜMÜ (26.08.2026, md17 onarımı): Astro 7 href içindeki
   & işaretini DOĞRU biçimde &amp; olarak kaçırıyor (geçerli HTML). Ham
   HTML'den regex ile toplanan href bu kaçışla kalırsa istek
   `...&amp;product_id=` diye atılır ve 404 alınır (yanlış kırmızı —
   ölçüldü: ham & → 200, &amp; → 404). Gerçek URL = varlıkları çözülmüş
   hal; istek atılmadan ÖNCE burada çözülür. Tek geçiş yeterlidir:
   çift-kaçış (&amp;lt;) tek geçişte doğru sonucu (&lt; metni) verir. */
export function htmlVarlikCoz(s) {
  return s.replace(/&(amp|lt|gt|quot|#39|apos|#x[0-9a-f]+|#\d+);/gi, (t, ad) => {
    const duz = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" }[ad.toLowerCase()];
    if (duz !== undefined) return duz;
    const kod = ad[1] === 'x' || ad[1] === 'X'
      ? parseInt(ad.slice(2), 16) : parseInt(ad.slice(1), 10);
    return Number.isFinite(kod) ? String.fromCodePoint(kod) : t;
  });
}

export function disLinkleriTopla(distKok) {
  const linkler = new Map();
  const gez = (d) => {
    for (const g of readdirSync(d, { withFileTypes: true })) {
      const y = join(d, g.name);
      if (g.isDirectory()) gez(y);
      else if (g.name === 'index.html') {
        const h = readFileSync(y, 'utf8').replace(/<script[\s\S]*?<\/script>/gi, '');
        // YALNIZ <a href> — <link rel="preconnect|stylesheet|preload"> bağlantı
        // DEĞİLDİR. Ölçüldü 28.07: ham href taraması fonts.gstatic.com
        // preconnect'ini "ölü link" sanıyordu (yanlış pozitif).
        for (const m of h.matchAll(/<a\b[^>]*\bhref="(https?:\/\/[^"]+)"/gi)) {
          // İstek atılmadan ÖNCE varlık çöz (md17 onarımı, 26.08.2026).
          const u = htmlVarlikCoz(m[1]);
          if (/suharitasi\.com/.test(u)) continue;
          if (!linkler.has(u)) linkler.set(u, y.replace(distKok, '').replace('/index.html', '/'));
        }
      }
    }
  };
  gez(distKok);
  return linkler;
}

/** Deterministik örneklem: tohum verilirse aynı hafta aynı küme çıkar. */
export function orneklemSec(linkler, boyut, tohum) {
  const dizi = [...linkler.keys()].sort();
  if (dizi.length <= boyut) return dizi;
  // Konak çeşitliliği: her konaktan sırayla al (tek konağa yığılma olmasın)
  const konakGruplari = new Map();
  for (const u of dizi) {
    let h; try { h = new URL(u).hostname; } catch { continue; }
    if (!konakGruplari.has(h)) konakGruplari.set(h, []);
    konakGruplari.get(h).push(u);
  }
  // Tohumla döndür (haftalık değişsin, koşu içinde sabit olsun)
  const konaklar = [...konakGruplari.keys()].sort();
  const secilen = [];
  let tur = 0;
  while (secilen.length < boyut) {
    let eklendi = false;
    for (const k of konaklar) {
      const g = konakGruplari.get(k);
      const i = (tohum + tur) % g.length;
      const aday = g[(i + tur) % g.length];
      if (aday && !secilen.includes(aday)) { secilen.push(aday); eklendi = true; }
      if (secilen.length >= boyut) break;
    }
    if (!eklendi) break;
    tur++;
  }
  return secilen;
}

export async function disLinkDenetle(urller, kaynakSayfa, { bekleMs = 1000, zamanAsimi = 15000 } = {}) {
  const olu = [], suphe = [], headReddetti = [];
  const NOBETCI_UA = 'suharitasi-baglanti-nobetcisi/1.0 (+https://suharitasi.com)';
  /* GET-DÜŞÜMÜ (25.08.2026 briefi, C5 №4; KARARLAR §26 Karar 2 dersi):
     bazı kurum siteleri (DergiPark, TBMM) HEAD'e ve/veya bot UA'sına 404
     döner — 25.08 taramasında 3 sağlam bağlantı "ölü" görünmüştü
     (yanlış-pozitif, gerçek ölüyü gölgeliyor). Kural: önce HEAD (nöbetçi
     UA, mevcut görgüyle). HEAD başarısızsa (4xx/5xx/zaman aşımı) AYNI
     adrese tarayıcı UA'sıyla TEK GET denenir; GET geçerse bağlantı SAĞLAM
     sayılır ve "HEAD reddetti, GET geçti" notuyla işaretlenir. Düşüm
     YALNIZ başarısız HEAD'lerde koşar — her bağlantıda iki istek atılmaz. */
  const TARAYICI_UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
  const iste = async (u, method, ua) => {
    const kontrol = new AbortController();
    const zaman = setTimeout(() => kontrol.abort(), zamanAsimi);
    try {
      const c = await fetch(u, { method, redirect: 'follow', signal: kontrol.signal,
        headers: { 'user-agent': ua } });
      // Gövde okunmaz; bağlantı sızıntısı olmasın diye iptal edilir
      // (sonuç kodunu DEĞİŞTİRMEZ — durum satırı çoktan gelmiştir).
      try { await c.body?.cancel(); } catch { /* gövdesiz yanıt */ }
      return { kod: c.status, hata: null };
    } catch (e) {
      return { kod: null, hata: e.name === 'AbortError' ? 'zaman aşımı' : e.message };
    } finally { clearTimeout(zaman); }
  };
  for (const u of urller) {
    let { kod, hata } = await iste(u, 'HEAD', NOBETCI_UA);
    if (kod === null || kod >= 400) {
      const headKod = kod, headHata = hata;
      ({ kod, hata } = await iste(u, 'GET', TARAYICI_UA));
      if (kod !== null && kod < 400) {
        headReddetti.push({ url: u, headKod, headHata, getKod: kod,
          not: 'HEAD reddetti, GET geçti', sayfa: kaynakSayfa.get(u) });
      }
    }
    // Sınıflandırma AYNEN: 404/410 KIRMIZI · zaman aşımı/5xx/429 SARI.
    // (Düşüm geçtiyse kod < 400 olduğundan iki kümeye de düşmez.)
    if (kod === 404 || kod === 410) olu.push({ url: u, kod, sayfa: kaynakSayfa.get(u) });
    else if (kod === null || kod >= 500 || kod === 429) suphe.push({ url: u, kod, hata, sayfa: kaynakSayfa.get(u) });
    await new Promise((r) => setTimeout(r, bekleMs));
  }
  return { olu, suphe, headReddetti, taranan: urller.length };
}

// ——————————————————————— M4: VERİ BÜTÜNLÜĞÜ ———————————————————————
/* md11 deseninin genişletilmişi: veri/potansiyel/* (11 dosya).
   Her dosya için ana kayıt alanı ve sayısı tabandan okunur.
   KIRMIZI: JSON bozuk ya da kayıt sayısı DÜŞTÜ (veri kaybı).
   SARI: yeni üst anahtar/şema değişimi (bilinçli olabilir, görünmeli).
   Artış SESSİZ geçer (veri büyümesi normaldir). */
export function veriBütünlük(kok, taban) {
  const bulgular = [];
  const guncel = {};
  const dizin = join(kok, 'veri/potansiyel');
  for (const d of readdirSync(dizin).filter((x) => x.endsWith('.json'))) {
    let j;
    try { j = JSON.parse(readFileSync(join(dizin, d), 'utf8')); }
    catch (e) { bulgular.push({ tip: 'kirmizi', dosya: d, mesaj: `JSON bozuk: ${e.message}` }); continue; }
    let alan = null, say = 0;
    for (const [k, v] of Object.entries(j)) {
      const n = Array.isArray(v) ? v.length : (v && typeof v === 'object' ? Object.keys(v).length : 0);
      if (n > say) { say = n; alan = k; }
    }
    guncel[d] = { alan, say, ustAnahtar: Object.keys(j).length };
    const t = taban?.dosyalar?.[d];
    if (!t) { bulgular.push({ tip: 'sari', dosya: d, mesaj: `tabanda yok (yeni dosya): ${alan}=${say}` }); continue; }
    if (say < t.say) {
      bulgular.push({ tip: 'kirmizi', dosya: d,
        mesaj: `kayıt sayısı DÜŞTÜ: ${t.alan}=${t.say} → ${say} (veri kaybı)` });
    }
    if (alan !== t.alan) {
      bulgular.push({ tip: 'sari', dosya: d, mesaj: `ana kayıt alanı değişti: ${t.alan} → ${alan}` });
    }
    if (Object.keys(j).length !== t.ustAnahtar) {
      bulgular.push({ tip: 'sari', dosya: d,
        mesaj: `şema değişti: üst anahtar ${t.ustAnahtar} → ${Object.keys(j).length}` });
    }
  }
  return { bulgular, guncel };
}

// ——————————————————— M5: BAŞLIK + OG + CTA ———————————————————
/* (a) 6 güvenlik başlığı — 23.07'de CSP'nin media-src'siz gitmesi tam
       olarak bu boşluktu. Başlığın VARLIĞI ve (CSP/HSTS'te) anahtar
       direktifin korunması ölçülür.
   (b) og:image URL'leri 200 dönüyor mu — sayfa başına FARKLILIK ARANMAZ
       (brief), yalnız kırık görsel yakalanır.
   (c) mailto: CTA varlığı + biçim geçerliliği — md6 iç link taramasında
       mailto YOK (ölçüldü), yani dönüşüm yolu sessizce ölebilirdi. */
export const GUVENLIK_BASLIKLARI = [
  'strict-transport-security', 'content-security-policy', 'permissions-policy',
  'referrer-policy', 'x-content-type-options', 'x-frame-options',
];

/* Cloudflare e-posta gizlemesini çözer: ilk bayt anahtar, kalan her bayt
   anahtarla XOR'lanır. Gizli adres okunabilir hale gelince biçim testi
   canlıda da yereldeki kadar gerçek kalır. */
export function cfEpostaCoz(hex) {
  const anahtar = parseInt(hex.slice(0, 2), 16);
  let s = '';
  for (let i = 2; i < hex.length; i += 2) {
    s += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ anahtar);
  }
  return s.split('?')[0];
}

export async function baslikOgCta(taban, sayfalar, getirFn) {
  const bulgular = [];
  // (a) başlıklar
  const c = await getirFn(taban + '/');
  const eksik = GUVENLIK_BASLIKLARI.filter((h) => !c.headers.get(h));
  if (eksik.length) bulgular.push({ tip: 'kirmizi', mesaj: `güvenlik başlığı eksik: ${eksik.join(', ')}` });
  const csp = c.headers.get('content-security-policy') || '';
  for (const direktif of ['default-src', 'media-src', 'script-src', 'frame-ancestors']) {
    if (!csp.includes(direktif)) bulgular.push({ tip: 'kirmizi', mesaj: `CSP direktifi eksik: ${direktif}` });
  }
  // (b) og:image + (c) mailto (düz + Cloudflare gizlemeli)
  const ogGorseller = new Set();
  let mailtoBulunan = 0;
  const mailtoBozuk = [];
  for (const yol of sayfalar) {
    const s = await getirFn(taban + yol);
    if (!s.ok) { bulgular.push({ tip: 'kirmizi', mesaj: `${yol} HTTP ${s.status}` }); continue; }
    const h = await s.text();
    const og = /property="og:image" content="([^"]+)"/.exec(h);
    if (!og) bulgular.push({ tip: 'sari', mesaj: `${yol}: og:image etiketi yok` });
    else ogGorseller.add(og[1]);
    for (const m of h.matchAll(/href="mailto:([^"]*)"/g)) {
      mailtoBulunan++;
      const adres = decodeURIComponent(m[1]).split('?')[0];
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(adres)) mailtoBozuk.push({ yol, adres });
    }
    // CANLIDA mailto: DİYE BİR ŞEY YOKTUR. Cloudflare e-posta gizlemesi her
    // mailto'yu /cdn-cgi/l/email-protection#HEX'e çevirir (ölçüldü 28.07 —
    // yerel dist'te 17 mailto, canlıda 0; kalem ilk gerçek koşumda yanlış
    // KIRMIZI verdi). Gizli biçim ÇÖZÜLÜR, adres aynı testten geçer:
    // vekil kriter değil, aynı olguyu ölçer. CTA gerçekten silinirse iki
    // biçim de kaybolur ve kalem yine ateşler.
    for (const m of h.matchAll(/href="\/cdn-cgi\/l\/email-protection#([0-9a-f]+)"/gi)) {
      mailtoBulunan++;
      const adres = cfEpostaCoz(m[1]);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(adres)) mailtoBozuk.push({ yol, adres });
    }
  }
  for (const g of ogGorseller) {
    const r = await getirFn(g);
    if (!r.ok) bulgular.push({ tip: 'kirmizi', mesaj: `og:image kırık: ${g} → HTTP ${r.status}` });
  }
  if (mailtoBulunan === 0) bulgular.push({ tip: 'kirmizi', mesaj: 'hiçbir sayfada mailto CTA bulunamadı (dönüşüm yolu kayıp)' });
  for (const b of mailtoBozuk) bulgular.push({ tip: 'kirmizi', mesaj: `${b.yol}: geçersiz mailto adresi "${b.adres}"` });
  return { bulgular, olcum: { ogGorsel: ogGorseller.size, mailto: mailtoBulunan, csp: csp.length } };
}

// ——————————————————— M6: NÖBETÇİ CANLILIĞI ———————————————————
/* Nöbetçiler kendi sessiz ölümlerini göremez (pipeline kendini denetleyemez
   — 20.07 kuralı). Eşik KAYNAĞIN GERÇEK TAKVİMİNE göre, cron periyoduna
   göre DEĞİL: RG haftalık (Sal 04:20) → tolerans 2 hafta; NHYP haftalık
   (Çar 04:40) ama yayın seyrek → 5 hafta; su-izleme günde 2 (05:30/16:00)
   → 3 gün. Aşım SARI, iki katı KIRMIZI.
   DOSYA YOKSA: "henüz koşmadı" SARI — kırmızı değil (yeni kurulum). */
export function nobetciCanliligi(kok, nobetciler) {
  const bulgular = [], olcum = [];
  for (const n of nobetciler) {
    const y = join(kok, n.dosya);
    if (!existsSync(y)) {
      /* VADESİ GELMEDİYSE ALARM YOK (29.07, M13). Yeni kurulan haftalık
         nöbetçinin state dosyası ilk koşuma kadar doğmaz; kurulum o
         haftanın koşum saatini kaçırdıysa dosya günlerce yok olur ve
         kalem boşuna sarı yanar. `ilkKosumBeklenen` = cron takvimine göre
         ilk gerçek koşum tarihi. Ölçülen vaka: rg-nobetci cron'u 28.07
         Salı ~21:00'de kuruldu, koşum saati Salı 04:20 → ilk koşum
         04.08. CLAUDE.md: "Eşikler gerçek cron takvimine göre kalibre
         edilir — yanlış alarm üretme." */
      const vade = n.ilkKosumBeklenen ? Date.parse(n.ilkKosumBeklenen) : null;
      if (vade && Date.now() < vade) {
        olcum.push({ ad: n.ad, saat: null, durum: 'vadesi-gelmedi', ilkKosumBeklenen: n.ilkKosumBeklenen });
        continue;
      }
      bulgular.push({ tip: 'sari', mesaj: `${n.ad}: state dosyası yok — henüz koşmadı (${n.dosya})` });
      olcum.push({ ad: n.ad, saat: null, durum: 'kosmadi' });
      continue;
    }
    const saat = (Date.now() - statSync(y).mtimeMs) / 3600000;
    olcum.push({ ad: n.ad, saat: Math.round(saat), esikSaat: n.toleransSaat });
    if (saat > n.toleransSaat * 2) {
      bulgular.push({ tip: 'kirmizi', mesaj: `${n.ad}: ${Math.round(saat)} saattir güncellenmedi (tolerans ${n.toleransSaat}h, İKİ KATI aşıldı)` });
    } else if (saat > n.toleransSaat) {
      bulgular.push({ tip: 'sari', mesaj: `${n.ad}: ${Math.round(saat)} saattir güncellenmedi (tolerans ${n.toleransSaat}h)` });
    }
  }
  return { bulgular, olcum };
}

// ——————————————————— M7: NPM AUDIT ———————————————————
/* ÖLÇÜLDÜ (28.07): 4 açık (1 düşük, 3 yüksek) — sharp/libvips CVE'leri.
   Bunlar TABANDIR: kalem panoyu kilitlemez, yalnız YENİ açık doğduğunda
   kırmızı verir. Mevcutların giderilmesi ayrı iş (SIRADAKILER).
   Ağ gerektirir; --tam sınıfında. */
export function npmAudit(kok, taban) {
  let ham;
  try {
    ham = execFileSync('npm', ['audit', '--omit=dev', '--json'], { cwd: kok, encoding: 'utf8', timeout: 120000 });
  } catch (e) {
    // npm audit açık bulunca exit≠0 döner — çıktı yine stdout'tadır.
    ham = e.stdout;
    if (!ham) return { bulgular: [{ tip: 'sari', mesaj: `npm audit çalıştırılamadı: ${e.message}` }], olcum: null };
  }
  let j;
  try { j = JSON.parse(ham); } catch (e) { return { bulgular: [{ tip: 'sari', mesaj: 'npm audit çıktısı ayrıştırılamadı' }], olcum: null }; }
  const s = j.metadata?.vulnerabilities || {};
  const guncel = { dusuk: s.low || 0, orta: s.moderate || 0, yuksek: s.high || 0, kritik: s.critical || 0 };
  const bulgular = [];
  if (taban) {
    for (const [ad, n] of Object.entries(guncel)) {
      const t = taban[ad] ?? 0;
      if (n > t) bulgular.push({ tip: ad === 'kritik' || ad === 'yuksek' ? 'kirmizi' : 'sari',
        mesaj: `YENİ ${ad} açık: ${t} → ${n}` });
    }
  }
  return { bulgular, olcum: guncel };
}

// ——————————————————— M8: DOKUNMA HEDEFİ ———————————————————
/* VEKİL KRİTER TUZAĞI (ölçümle yakalandı): ham "<44px = ihlal" kuralı
   /nerede-su-cikar/'da 98 "ihlal" verdi — çoğu paragraf içi metin linki.
   WCAG 2.5.8 satır-içi metin bağlantılarını MUAF tutar. Bu yüzden kalem
   yalnız BAĞIMSIZ denetimleri ölçer: button, [role=tab], ve blok/flex
   düzenli (satır içi olmayan) bağlantılar.
   Taban = mevcut ihlal sayısı; kalem ARTIŞTA SARI verir (regresyon
   dedektörü), mutlak standart dayatmaz. */
export const DOKUNMA_OLC = () => {
  const kucuk = [];
  let toplam = 0;
  for (const el of document.querySelectorAll('a,button,input,select,summary,[role="tab"]')) {
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    // Satır-içi metin bağlantısı MUAF (WCAG 2.5.8): <a> ve display inline*
    // ve bir metin bloğunun (p/li/span) içinde.
    const satirIci = el.tagName === 'A' && st.display.startsWith('inline')
      && el.closest('p, li, figcaption, dd, .pot-kunye, .ar-kapatma-kunye, .sayfa-kunye');
    if (satirIci) continue;
    toplam++;
    if (r.width < 44 || r.height < 44) {
      kucuk.push({
        etiket: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : ''),
        w: Math.round(r.width), h: Math.round(r.height),
        metin: (el.textContent || '').trim().slice(0, 24),
      });
    }
  }
  return { toplam, ihlal: kucuk.length, ornekler: kucuk.slice(0, 6) };
};

// ——————————————————— M9: 404 SAYFASI ———————————————————
/* YALNIZ ÖLÇÜM (brief). Sayfa üretimi kapsam dışı.
   ÖLÇÜLDÜ (28.07): public/404.html VAR ve markalı — kapsam haritasındaki
   "yok" varsayımı YANLIŞTI, düzeltildi. */
export async function dortYuzDort(taban, getirFn, dosyaVarMi = false) {
  const c = await getirFn(taban + '/kesinlikle-olmayan-sayfa-denetim/');
  const bulgular = [];
  const olcum = { kod: c.status, ozel: false, markali: false, donusLinki: false };
  if (c.status !== 404) {
    bulgular.push({ tip: 'kirmizi', mesaj: `olmayan sayfa HTTP ${c.status} döndü (404 bekleniyordu)` });
    return { bulgular, olcum };
  }
  const h = await c.text();
  olcum.ozel = /<title>[^<]*bulunamadı/i.test(h) || /Su Haritası|Su Hukuku/.test(h);
  olcum.markali = /Su Haritası|Su Hukuku/.test(h);
  olcum.donusLinki = /href="\/"/.test(h);
  // YEREL SUNUCU SINIRI ≠ SİTE ARIZASI (ölçüldü 28.07): arac/dist-sun.mjs
  // özel 404.html'i sunmaz, çıplak 404 döner. Depoda dosya VARSA bunu
  // "sayfa yok" diye raporlamak yanlış olur — ayrım açıkça yazılır.
  if (!olcum.ozel) {
    olcum.dosyaVar = dosyaVarMi;
    bulgular.push({ tip: 'sari', mesaj: dosyaVarMi
      ? 'sunucu özel 404 sayfasını sunmadı (depoda public/404.html VAR — yerel sunucu sınırı olabilir, canlıda doğrulanmalı)'
      : 'özel 404 sayfası yok (sunucu varsayılanı)' });
  }
  else if (!olcum.donusLinki) bulgular.push({ tip: 'sari', mesaj: '404 sayfasında ana sayfaya dönüş linki yok' });
  return { bulgular, olcum };
}

// ——————————————— M11: SON YEDEK YAŞI (B1.2, 28.07.2026) ———————————————
/* `arac/yedek-al.sh` gecelik koşar ve doğrulamadan SONRA durum dosyası
   yazar. Bu kalem o dosyanın YAŞINI ölçer — yedek sessizce durursa
   (cron düşer, disk dolar, tar patlar) kimse fark etmezdi.

   EŞİK GERÇEK TAKVİMDEN: yedek 02:10 UTC koşar, sağlık koşuları 06:40 ve
   19:30. En kötü durumda taze bir yedek 19:30 koşumunda 17,3 saatliktir.
   Bu yüzden SARI eşiği 30 saat (bir koşum kaçmış = iki gece), KIRMIZI 54
   saat (iki gece üst üste kaçmış). Takvim-günü değil saat penceresi —
   yanlış alarm üretmemek için (CLAUDE.md sessiz hata yasağı).

   sonuc != "basarili" ise doğrudan KIRMIZI: script yarım kalmışsa durum
   dosyası hiç yazılmaz, ama elle bozulmuş bir dosya da yakalanmalı. */
export function yedekYasi(durumDosyasi, sariSaat = 30, kirmiziSaat = 54) {
  const bulgular = [], olcum = {};
  if (!durumDosyasi) return { bulgular, olcum };
  if (!existsSync(durumDosyasi)) {
    bulgular.push({ tip: 'sari', mesaj: `yedek durum dosyası yok — henüz koşmadı (${durumDosyasi})` });
    return { bulgular, olcum: { durumDosyasi, yasSaat: null } };
  }
  let d;
  try { d = JSON.parse(readFileSync(durumDosyasi, 'utf8')); }
  catch (e) {
    bulgular.push({ tip: 'kirmizi', mesaj: `yedek durum dosyası OKUNAMADI (${e.message})` });
    return { bulgular, olcum: { durumDosyasi, yasSaat: null } };
  }
  const yasSaat = +(((Date.now() - new Date(d.zaman).getTime()) / 3600000)).toFixed(1);
  olcum.yasSaat = yasSaat; olcum.sonuc = d.sonuc; olcum.boyutMB = Math.round((d.boyutBayt || 0) / 1048576);
  olcum.sinir = d.sinir;
  if (d.sonuc !== 'basarili') {
    bulgular.push({ tip: 'kirmizi', mesaj: `son yedek BAŞARISIZ (sonuc=${d.sonuc})` });
  } else if (!Number.isFinite(yasSaat)) {
    bulgular.push({ tip: 'kirmizi', mesaj: 'yedek zaman damgası geçersiz' });
  } else if (yasSaat > kirmiziSaat) {
    bulgular.push({ tip: 'kirmizi', mesaj: `son yedek ${yasSaat} saatlik (kırmızı eşik ${kirmiziSaat}h) — gecelik yedek durmuş` });
  } else if (yasSaat > sariSaat) {
    bulgular.push({ tip: 'sari', mesaj: `son yedek ${yasSaat} saatlik (eşik ${sariSaat}h)` });
  }
  return { bulgular, olcum };
}

// ——————————————————— M10: DEPO DIŞI YEDEK ———————————————————
/* YALNIZ ÖLÇÜM (brief): strateji kullanıcı kararı.
   Geri getirilemez varlıklar: kaynak/dsi-arsiv (DSİ 2021-22 baskıları
   kaynakta ZATEN SİLİNMİŞ), data/arsiv (baraj günlükleri + GRACE ham).
   Yedek "var" sayılması için: depo AĞACININ DIŞINDA, varlıktan yeni
   olmayan bir kopya. Bulunamazsa "yedek yok" (KIRMIZI DEĞİL — sarı). */
export function yedekDurumu(kok, varliklar, adaylar) {
  const olcum = [], bulgular = [];
  const boyut = (y) => {
    if (!existsSync(y)) return null;
    let t = 0;
    const gez = (d) => {
      for (const g of readdirSync(d, { withFileTypes: true })) {
        const p = join(d, g.name);
        if (g.isDirectory()) gez(p); else t += statSync(p).size;
      }
    };
    if (statSync(y).isDirectory()) gez(y); else t = statSync(y).size;
    return t;
  };
  for (const v of varliklar) {
    const kaynakBoyut = boyut(join(kok, v));
    let yedek = null;
    for (const a of adaylar) {
      const aday = join(a, v.split('/').pop());
      const b = boyut(aday);
      if (b && b >= kaynakBoyut * 0.5) { yedek = { yol: aday, boyut: b, tarih: new Date(statSync(aday).mtimeMs).toISOString().slice(0, 10) }; break; }
    }
    /* GİT KAPSAMI (düzeltme 28.07 gece): kalem şimdiye kadar yalnız YEREL
       ikinci kopya arıyordu ve git'te izlenen varlıklar için "yedek
       bulunamadı" diyordu. Bu YANILTICI: depo GitHub'a push'lanıyorsa
       varlığın zaten MAKİNE DIŞI bir kopyası var. Ölçüm eklendi —
       izlenen dosya sayısı + bekleyen (push'lanmamış) commit sayısı.
       Bekleyen commit varsa uzak kopya BAYAT demektir, sarı korunur. */
    let git = null;
    try {
      const izlenen = execFileSync('git', ['ls-files', '--', v], { cwd: kok, encoding: 'utf8' })
        .split('\n').filter(Boolean).length;
      const bekleyen = Number(execFileSync('git', ['rev-list', '--count', '@{u}..HEAD'],
        { cwd: kok, encoding: 'utf8' }).trim()) || 0;
      git = { izlenen, bekleyen };
    } catch { git = null; }   // upstream yoksa/git hatasında ölçüm yapılmaz

    olcum.push({ varlik: v, boyutMB: kaynakBoyut ? Math.round(kaynakBoyut / 1048576) : null, yedek, git });
    const mb = Math.round(kaynakBoyut / 1048576);
    if (kaynakBoyut && !yedek) {
      if (git?.izlenen > 0 && git.bekleyen === 0) {
        // Uzak kopya VAR ve güncel — bulgu değil, ölçüm kaydı.
      } else if (git?.izlenen > 0) {
        bulgular.push({ tip: 'sari', mesaj: `${v} (${mb} MB) — uzak kopya BAYAT: ${git.bekleyen} commit push'lanmamış` });
      } else {
        bulgular.push({ tip: 'sari', mesaj: `${v} (${mb} MB) — ne yerel yedek ne git izlemesi var (rapor/yedek-envanteri.md)` });
      }
    }
  }
  return { bulgular, olcum };
}
