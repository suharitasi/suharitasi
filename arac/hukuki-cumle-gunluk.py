#!/usr/bin/env python3
# GÜNLÜK HUKUKİ CÜMLE RAPORU (KARARLAR §73/5, 10.10.2026): o gün canlıya (origin/main, ilk ebeveyn
# zinciri) giren hukuki metin dosyalarında EKLENEN cümleleri sayfa, cümle ve dayanakla çıkarır.
# JSON: yeni metin alanları (kardeş "dayanak" alanıyla); md: eklenen satırlar ve ön bilgi değerleri;
# astro/js: eklenen satırlardaki görünür metin ve metin dizgileri. Resmî metinden birebir alanlar
# ("metin", "hesap_metin", "yeniden_degerleme_metni") "resmî metin" diye işaretlenir.
# Kullanım: python3 arac/hukuki-cumle-gunluk.py [YYYY-AA-GG] [--taban <commit>] → rapor/hukuki-cumleler/YYYY-AA-GG.md
import re, subprocess, sys, datetime, html, json

gun = next((a for a in sys.argv[1:] if re.match(r'\d{4}-\d{2}-\d{2}$', a)), datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=3))).strftime('%Y-%m-%d'))
taban = sys.argv[sys.argv.index('--taban') + 1] if '--taban' in sys.argv else None
dizin = sys.argv[sys.argv.index('--cikti-dizin') + 1] if '--cikti-dizin' in sys.argv else 'rapor/hukuki-cumleler'
git = lambda *a, kontrol=True: subprocess.run(['git', *a], capture_output=True, text=True, check=kontrol).stdout
git('fetch', '-q', 'origin')
commitler = git('log', 'origin/main', '--first-parent', '--format=%H', f'--since={gun}T00:00:00+03:00', f'--until={gun}T23:59:59+03:00').split()
if not commitler and not taban:
    open(f'{dizin}/{gun}.md', 'w').write(f'# {gun} — canlıya giren hukuki cümleler\n\nBu gün ana dala giren commit yok.\n')
    print(f'{gun}: ana dala giren commit yok'); print(f'CUMLE_SAYISI=0 YOL={dizin}/{gun}.md'); sys.exit(0)
eski = taban or (commitler[-1] + '^')
yeni = commitler[0] if commitler else 'origin/main'

HUKUKI = [r'^src/content/(rehberler|su-kanunu)/.+\.md$', r'^data/kamu/(sure-tablosu|ceza-yeniden-degerleme|mevzuat-maddeleri|emsal-kararlar)\.json$',
          r'^src/data/(ceza-tutar|sure-hesap)\.js$', r'^src/pages/(gizlilik|hakkinda|kuyu-karar-motoru|su-hukuku|hizli-danisma|emsal-kararlar)\.astro$',
          r'^src/pages/(hesaplayicilar|rehberler|kuyu-ruhsati|emsal-kararlar|durumum|mevzuat)/.+\.astro$',
          r'^src/components/(IyukSure\w*|OnDegerlendirmeCagri|CezaTutarTablosu|DilekceDenetimMotoru|ParselTalep|HukukSerhi|HukukiKontrol)\.astro$',
          r'^src/components/anasayfa/Iletisim\.astro$', r'^public/s/(karar-motoru|hesap-ceza|danisma)\.js$']
RESMI = {'metin', 'hesap_metin', 'yeniden_degerleme_metni'}
ATLA = {'url', 'kaynak_url', 'id', 'slug', 'kaynak', 'kaynak_onceki', 'tarih', 'son_dogrulama', 'karar_tarihi', 'sunucu', 'yontem_kod'}
def sayfa(d):
    if m := re.match(r'src/content/rehberler/(.+)\.md$', d): return f'/rehberler/{m.group(1)}/'
    if m := re.match(r'src/content/su-kanunu/(.+)\.md$', d): return f'/su-kanunu/{m.group(1)}/'
    if m := re.match(r'src/pages/(.+?)(/index)?\.astro$', d): return '/' + re.sub(r'\[(\w+)\]', r'{\1}', m.group(1)) + '/'
    return {'data/kamu/sure-tablosu.json': 'süre tablosu → sihirbaz, hesaplayıcı, süre sayacı', 'data/kamu/ceza-yeniden-degerleme.json': 'ceza tablosu → hesaplayıcı, sihirbaz, rehber, 167 m.18, su hukuku, API',
            'data/kamu/mevzuat-maddeleri.json': '/mevzuat/{kanun}/{madde}/ (yorum alanları)', 'data/kamu/emsal-kararlar.json': '/emsal-kararlar/ (künye notları)',
            'src/components/anasayfa/Iletisim.astro': '/ (iletişim formu)'}.get(d, d)
DAY = re.compile(r'(\b\d{3,4} (?:sayılı|s\.\s?K\.?)|\b\d{3,4} m\.\s?\d+[\w/.-]*|\b(?:m\.|md\.)\s?\d+[\w/.-]*|\bmadde(?:si)? \d+|İYUK m\.\s?\d+|Danıştay \d+\.\s?D(?:aire)?\.?\s?\d{4}/\d+ E\.|VUK Genel Tebliği|Resmî Gazete|erişim \d{2}\.\d{2}\.\d{4})', re.I)
KISALTMA = re.compile(r'(?:^|[\s(])(?:\d+|[A-ZÇĞİÖŞÜ]{1,2}|m|md|s|vd|Av|Dr|No|RG|bkz|ör|Sıra)\.$')
def cumleler(s):
    s = re.sub(r'\s+', ' ', s).strip()
    parca, bas = [], 0
    for m in re.finditer(r'[.!?]\s+(?=[A-ZÇĞİÖŞÜ"(«])', s):
        if KISALTMA.search(s[max(0, m.start() - 12):m.start() + 1]): continue
        parca.append(s[bas:m.start() + 1]); bas = m.end()
    parca.append(s[bas:])
    return [c.strip() for c in parca if len(c.strip()) >= 20 and re.search(r'[a-zçğıöşü]{3}', c)]
def md_temiz(s):
    s = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s); s = re.sub(r'[*_`>#|]+', ' ', s); s = re.sub(r'^\s*[-+]\s+', '', s)
    s = re.sub(r'^\s*\w+:\s*"?', '', s) if re.match(r'^\s*(soru|cevap|ozCevap|ozet|senaryo|merci|sure|ceza|emsal|baslik|seoBaslik)\s*:', s) else s
    return s.strip(' "')
def kod_metni(satir):
    parca = re.findall(r"'([^'\\]{12,})'|\"([^\"\\]{12,})\"|`([^`\\]{12,})`", satir)
    dizgiler = [x for t in parca for x in t if x and ' ' in x and not re.search(r'[=;{}<>]|^\w+\(|^https?:', x)]
    gorunur = re.sub(r'\{[^{}]*\}', ' ', satir); gorunur = re.sub(r'<[^>]*>', ' ', gorunur)
    if re.search(r'[=;(){}]|=>|\bconst\b|\bfunction\b|^\s*//|^\s*/?\*|class=', gorunur) or not re.search(r'[a-zçğıöşü]{3} [a-zçğıöşü]{2}', gorunur): gorunur = ''
    return [html.unescape(x) for x in dizgiler + ([gorunur] if gorunur.strip() else [])]
def json_yapraklar(v, yol=(), ebeveyn=None):
    if isinstance(v, dict):
        for k, x in v.items(): yield from json_yapraklar(x, yol + (k,), v)
    elif isinstance(v, list):
        for i, x in enumerate(v): yield from json_yapraklar(x, yol + (i,), ebeveyn)
    elif isinstance(v, str): yield yol, v, ebeveyn
kayit = []
dosyalar = [d for d in git('diff', '--name-only', eski, yeni).split() if any(re.search(p, d) for p in HUKUKI)]
for d in dosyalar:
    if d.endswith('.json'):
        try: once = {s for _, s, _ in json_yapraklar(json.loads(git('show', f'{eski}:{d}', kontrol=False) or '{}'))}
        except json.JSONDecodeError: once = set()
        for yol, s, eb in json_yapraklar(json.loads(git('show', f'{yeni}:{d}'))):
            anahtar = next((k for k in reversed(yol) if isinstance(k, str)), '')
            if s in once or anahtar in ATLA or anahtar.startswith('_') or re.match(r'^https?:', s) or len(s.split()) < 4: continue
            if d.endswith('emsal-kararlar.json') and anahtar == 'yontem': continue
            kardes = [x for x in (eb or {}).values() if isinstance(x, str) and x != s] if isinstance(eb, dict) else []
            dy = (eb or {}).get('dayanak') if isinstance(eb, dict) and isinstance((eb or {}).get('dayanak'), str) else next((x for x in kardes if DAY.search(x) and len(x) < 120), None)
            for c in cumleler(s): kayit.append((sayfa(d), c, 'resmî metin (birebir)' if anahtar in RESMI else None, dy))
        continue
    eklenen = [l[1:] for l in git('diff', '-U0', eski, yeni, '--', d).splitlines() if l.startswith('+') and not l.startswith('+++')]
    parcalar = [md_temiz(l) for l in eklenen] if d.endswith('.md') else [x for l in eklenen for x in kod_metni(l)]
    for c in cumleler(' '.join(p for p in parcalar if p)): kayit.append((sayfa(d), c, None, None))
md = f'# {gun} — canlıya giren hukuki cümleler (KARARLAR §73/5)\n\nAralık {eski[:9]}..{yeni[:9]} · {len(dosyalar)} hukuki dosya · {len(kayit)} cümle. Kaynak: o gün ana dala giren commit\'lerde eklenen metin; karar sayfalarındaki resmî karar alıntıları (data/kamu/emsal-alinti.json) ve mevzuat madde metinleri bu listeye girmez.\n\n'
for s in dict.fromkeys(k[0] for k in kayit):
    md += f'## {s}\n'
    gorulen = set()
    for (ss, c, tur, dy) in kayit:
        if ss != s or c in gorulen: continue
        gorulen.add(c)
        bul = ', '.join(dict.fromkeys(m.group(0) for m in DAY.finditer(c)))
        md += f'- {c} — *{tur + "; " if tur else ""}dayanak: {bul or dy or "cümlede yazılı değil"}*\n'
    md += '\n'
yol = f'{dizin}/{gun}.md'
open(yol, 'w', encoding='utf-8').write(md)
print(f'{gun}: {len(kayit)} cümle, {len(dosyalar)} dosya → {yol}')
print(f'CUMLE_SAYISI={sum(1 for l in md.splitlines() if l.startswith("- "))} YOL={yol}')
