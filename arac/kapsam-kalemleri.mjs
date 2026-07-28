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
          const u = m[1];
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
  const olu = [], suphe = [];
  for (const u of urller) {
    let kod = null, hata = null;
    for (const yontem of ['HEAD', 'GET']) {
      const kontrol = new AbortController();
      const zaman = setTimeout(() => kontrol.abort(), zamanAsimi);
      try {
        const c = await fetch(u, { method: yontem, redirect: 'follow', signal: kontrol.signal,
          headers: { 'user-agent': 'suharitasi-baglanti-nobetcisi/1.0 (+https://suharitasi.com)' } });
        kod = c.status;
        // HEAD desteklenmiyorsa GET'e düş
        if (yontem === 'HEAD' && [405, 501, 403].includes(kod)) { kod = null; continue; }
        break;
      } catch (e) { hata = e.name === 'AbortError' ? 'zaman aşımı' : e.message; }
      finally { clearTimeout(zaman); }
      break;
    }
    if (kod === 404 || kod === 410) olu.push({ url: u, kod, sayfa: kaynakSayfa.get(u) });
    else if (kod === null || kod >= 500 || kod === 429) suphe.push({ url: u, kod, hata, sayfa: kaynakSayfa.get(u) });
    await new Promise((r) => setTimeout(r, bekleMs));
  }
  return { olu, suphe, taranan: urller.length };
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
  // (b) og:image + (c) mailto
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
    olcum.push({ varlik: v, boyutMB: kaynakBoyut ? Math.round(kaynakBoyut / 1048576) : null, yedek });
    if (kaynakBoyut && !yedek) {
      bulgular.push({ tip: 'sari', mesaj: `${v} (${Math.round(kaynakBoyut / 1048576)} MB) — depo dışı yedek bulunamadı` });
    }
  }
  return { bulgular, olcum };
}
