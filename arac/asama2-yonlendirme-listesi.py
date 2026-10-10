#!/usr/bin/env python3
# DURAK 2: Aşama 2'de eklenen yönlendirmelerin listesi (public/_redirects, Aşama 2 öncesi sürüme göre fark).
# Kullanım: python3 arac/asama2-yonlendirme-listesi.py [taban_commit]  → rapor/olcum/yonlendirmeler-asama2.md
import subprocess, sys
TABAN = sys.argv[1] if len(sys.argv) > 1 else 'e3bdabe'
kural = lambda s: [l.split() for l in s.splitlines() if l.strip() and not l.lstrip().startswith('#') and len(l.split()) >= 2]
once = {tuple(k[:2]) for k in kural(subprocess.run(['git', 'show', f'{TABAN}:public/_redirects'], capture_output=True, text=True, check=True).stdout)}
simdi = kural(open('public/_redirects', encoding='utf-8').read())
yeni = [k for k in simdi if tuple(k[:2]) not in once]
md = f'# Aşama 2 yönlendirmeleri (public/_redirects; taban {TABAN})\n\nToplam {len(yeni)} kural.\n\n| Eski adres | Yeni adres | Kod |\n|---|---|---|\n'
md += ''.join(f'| {k[0]} | {k[1]} | {k[2] if len(k) > 2 else "302"} |\n' for k in yeni)
open('rapor/olcum/yonlendirmeler-asama2.md', 'w', encoding='utf-8').write(md)
print(f'{len(yeni)} yeni yönlendirme → rapor/olcum/yonlendirmeler-asama2.md')
