#!/usr/bin/env python3
# GÜNLÜK HUKUKİ CÜMLE RAPORU (KARARLAR §73/5, 10.10.2026): o gün canlıya (origin/main) giren hukuki
# metin dosyalarındaki EKLENEN cümleleri sayfa, cümle ve dayanakla çıkarır. Resmî metinden birebir
# alıntılar (mevzuat madde metni, karar alıntısı) "alıntı" diye ayrı sayılır.
# Kullanım: python3 arac/hukuki-cumle-gunluk.py [YYYY-AA-GG] [--taban <commit>]
#   → rapor/hukuki-cumleler/YYYY-AA-GG.md
import re, subprocess, sys, datetime, html, json

gun = next((a for a in sys.argv[1:] if re.match(r'\d{4}-\d{2}-\d{2}$', a)), datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=3))).strftime('%Y-%m-%d'))
taban = sys.argv[sys.argv.index('--taban') + 1] if '--taban' in sys.argv else None
git = lambda *a: subprocess.run(['git', *a], capture_output=True, text=True, check=True).stdout
git('fetch', '-q', 'origin')
bas, son = f'{gun}T00:00:00+03:00', f'{gun}T23:59:59+03:00'
commitler = git('log', 'origin/main', '--first-parent', '--format=%H', f'--since={bas}', f'--until={son}').split()
if not commitler and not taban:
    print(f'{gun}: ana dala giren commit yok'); sys.exit(0)
eski = taban or (commitler[-1] + '^')
yeni = commitler[0] if commitler else 'origin/main'

HUKUKI = [r'^src/content/rehberler/', r'^src/content/su-kanunu/', r'^data/kamu/(sure-tablosu|ceza-yeniden-degerleme|mevzuat-maddeleri)\.json$',
          r'^src/data/(ceza-tutar|sure-hesap|hukuki-kontrol)\.js$', r'^src/pages/(gizlilik|hakkinda|kuyu-karar-motoru|su-hukuku|hizli-danisma)\.astro$',
          r'^src/pages/hesaplayicilar/', r'^src/pages/rehberler/', r'^src/pages/kuyu-ruhsati/', r'^src/pages/emsal-kararlar', r'^src/pages/durumum/',
          r'^src/components/(IyukSure\w*|OnDegerlendirmeCagri|CezaTutarTablosu|DilekceDenetimMotoru|ParselTalep|HukukSerhi|HukukiKontrol)\.astro$',
          r'^src/components/anasayfa/Iletisim\.astro$', r'^public/s/(karar-motoru|hesap-ceza|danisma)\.js$']
def sayfa(dosya):
    if m := re.match(r'src/content/rehberler/(.+)\.md$', dosya): return f'/rehberler/{m.group(1)}/'
    if m := re.match(r'src/content/su-kanunu/(.+)\.md$', dosya): return f'/su-kanunu/{m.group(1)}/'
    if m := re.match(r'src/pages/(.+?)(/index)?\.astro$', dosya): return '/' + re.sub(r'\[(\w+)\]', r'{\1}', m.group(1)) + '/'
    return {'data/kamu/sure-tablosu.json': 'süre hesabı (sihirbaz, hesaplayıcı, süre sayacı)', 'data/kamu/ceza-yeniden-degerleme.json': 'ceza tutarı tablosu (7 yüzey)',
            'data/kamu/mevzuat-maddeleri.json': '/mevzuat/{kanun}/{madde}/', 'src/components/anasayfa/Iletisim.astro': '/ (iletişim formu)'}.get(dosya, dosya)
HUK = re.compile(r'(madde|m\.\s?\d|kanun|yönetmelik|tüzük|gün|süre|ceza|dava|mahkeme|danıştay|yargıtay|kvkk|saklama|idari|belge|ruhsat|tahsis|itiraz|tebliğ|hak|yetki|kira|ihale)', re.I)
DAY = re.compile(r'(\d{3,4} (?:sayılı|s\.\s?K\.)|\b(?:m\.|md\.|madde)\s?\d+[\w/.]*|\bİYUK\b|\bVUK\b|Danıştay \d+\.\s?D(?:aire)?\.?\s?\d{4}/\d+|erişim \d{2}\.\d{2}\.\d{4}|Resmî Gazete|mevzuat\.gov\.tr|karararama\.danistay)', re.I)
def temizle(s):
    s = re.sub(r'\{[^{}]*\}', ' ', s); s = re.sub(r'<[^>]+>', ' ', s); s = html.unescape(s)
    s = re.sub(r'^\s*[-*|>#]+\s*', '', s); s = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s)
    return re.sub(r'\s+', ' ', s).strip(' "\',')
kayit = []
dosyalar = [d for d in git('diff', '--name-only', eski, yeni).split() if any(re.search(p, d) for p in HUKUKI)]
for d in dosyalar:
    eklenen = [l[1:] for l in git('diff', '-U0', eski, yeni, '--', d).splitlines() if l.startswith('+') and not l.startswith('+++')]
    metin = ' '.join(temizle(l) for l in eklenen if not re.match(r'\s*(//|/\*|\*|import |export |const |let |if |for |return |\}|\)|<style|\.)', l))
    for c in re.split(r'(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ0-9"(])', metin):
        c = c.strip()
        if len(c) < 25 or not re.search(r'[a-zçğıöşü]{3}', c) or not HUK.search(c): continue
        alinti = d.endswith('mevzuat-maddeleri.json') and '"metin"' in ' '.join(eklenen)
        kayit.append((sayfa(d), c, ', '.join(dict.fromkeys(m.group(0) for m in DAY.finditer(c))) or 'dayanak cümlede yazılı değil'))
md = f'# {gun} — canlıya giren hukuki cümleler (KARARLAR §73/5)\n\nAralık: {eski[:9]}..{yeni[:9]} · {len(dosyalar)} hukuki dosya · {len(kayit)} cümle (diff\'te eklenen satırlardan; resmî metin alıntıları dahil).\n\n'
for s in dict.fromkeys(k[0] for k in kayit):
    md += f'## {s}\n' + ''.join(f'- {c} — *dayanak: {dy}*\n' for (ss, c, dy) in kayit if ss == s) + '\n'
yol = f'rapor/hukuki-cumleler/{gun}.md'
open(yol, 'w', encoding='utf-8').write(md)
print(f'{gun}: {len(kayit)} cümle, {len(dosyalar)} dosya → {yol}')
