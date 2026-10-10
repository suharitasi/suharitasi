#!/usr/bin/env python3
"""Resmî Gazete ilan/arşiv sayfalarını yerel önbelleğe indirir (10.10.2026, brif 1.2 / 2.6 / 4-A).

Kullanım: python3 arac/rg-ilan-indir.py URL_LISTESI HEDEF_DIZIN
- Her URL bir kez indirilir (dosya varsa atlanır); istekler arası 1,5 s.
- Sunucu DNS'i resmigazete.gov.tr'yi çözemiyor: adres 1.1.1.1'den alınıp curl --resolve ile verilir.
- RG WAF'ı tarayıcı dışı User-Agent'a gövde döndürmüyor (10.10.2026 ölçüldü): tarayıcı UA kullanılır.
- Yalnız okuma; depoya yazmaz (hedef dizin cikti/ altında, gitignore).
"""
import subprocess, sys, time, os, hashlib
liste, hedef = sys.argv[1], sys.argv[2]
os.makedirs(hedef, exist_ok=True)
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
ip = subprocess.run(['dig', '+short', '@1.1.1.1', 'www.resmigazete.gov.tr'], capture_output=True, text=True).stdout.split()
ip = next((x for x in ip if x.replace('.', '').isdigit()), None)
if not ip: sys.exit('IP çözülemedi')
urls = [u.strip() for u in open(liste) if u.strip()]
ok = atl = hata = 0
for i, u in enumerate(urls, 1):
    ad = u.rsplit('/', 1)[-1]
    yol = os.path.join(hedef, f"{hashlib.sha1(u.encode()).hexdigest()[:8]}-{ad}")
    if os.path.exists(yol) and os.path.getsize(yol) > 0:
        atl += 1; continue
    host = u.split('/')[2]
    r = subprocess.run(['curl', '-sS', '-m', '120', '--resolve', f'{host}:443:{ip}', '-A', UA, '-o', yol, '-w', '%{http_code} %{size_download}', u], capture_output=True, text=True)
    kod = r.stdout.split()[0] if r.stdout else '000'
    if kod == '200' and os.path.getsize(yol) > 0:
        ok += 1
    else:
        hata += 1
        if os.path.exists(yol): os.remove(yol)
        print(f'HATA {kod} {u} {r.stderr.strip()[:80]}', flush=True)
    print(f'{i}/{len(urls)} {kod} {ad}', flush=True)
    time.sleep(1.5)
print(f'BİTTİ indirilen={ok} atlanan={atl} hata={hata}')
