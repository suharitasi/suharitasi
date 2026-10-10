#!/usr/bin/env python3
"""Zenodo için iç belgesiz VERİ arşivi (DURAK 1 E, 10.10.2026).

Kullanım: npm run build sonrası  python3 arac/zenodo-temiz-arsiv.py  →  cikti/zenodo/suharitasi-veri-YYYYMMDD.zip
- YALNIZ izinli listedeki derlenmiş açık veri dosyaları girer (dist/veri/*.json, dist/kisit.json,
  dist/api/v1/**.json). Depo dosyaları (kural, karar, günlük, denetim, rapor, .env örneği, kod) hiç okunmaz.
- Arşivin içine VERI-OKUBENI.md (dosya listesi, kaynaklar, lisans notu) ve SHA256SUMS yazılır.
- Yayımlamaz: Zenodo'ya gönderim sahiptedir.
"""
import os, sys, json, hashlib, zipfile, datetime, subprocess, fnmatch

KOK = os.getcwd()
DIST = os.path.join(KOK, 'dist')
IZINLI = ['veri/*.json', 'kisit.json', 'api/v1/*.json', 'api/v1/havza/*.json', 'api/v1/il/*.json']
YASAK_ADLAR = ('CLAUDE', 'KARARLAR', 'PAZARLAMA', 'GUNLUK', 'DEVIR', 'SIRADAKILER', '.env', 'denetim', 'rapor/')

def dosyalar():
    out = []
    for kok, _, adlar in os.walk(DIST):
        for ad in adlar:
            g = os.path.relpath(os.path.join(kok, ad), DIST)
            if any(fnmatch.fnmatch(g, k) for k in IZINLI): out.append(g)
    return sorted(out)

def main():
    if not os.path.isdir(DIST): sys.exit('dist yok: önce npm run build')
    liste = dosyalar()
    for g in liste:
        if any(y.lower() in g.lower() for y in YASAK_ADLAR): sys.exit(f'yasak dosya listeye girdi: {g}')
    commit = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], capture_output=True, text=True).stdout.strip()
    gun = datetime.date.today().strftime('%Y%m%d')
    hedef_dir = os.path.join(KOK, 'cikti', 'zenodo'); os.makedirs(hedef_dir, exist_ok=True)
    hedef = os.path.join(hedef_dir, f'suharitasi-veri-{gun}.zip')
    ozet = []
    for g in liste:
        b = open(os.path.join(DIST, g), 'rb').read()
        ozet.append((g, len(b), hashlib.sha256(b).hexdigest()))
    okubeni = [
        '# Su Haritası — açık veri arşivi', '',
        f'Üretim: {datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M")} UTC · kaynak sürüm (depo commit): {commit} · dosya sayısı: {len(liste)}', '',
        'İçerik: suharitasi.com sitesinin makine-okunur açık veri katmanının anlık görüntüsü (sitede /veri/, /api/v1/ ve /kisit.json adreslerinde yayımlanan dosyalar).',
        'Her dosyanın içinde kaynak ve tarih alanları bulunur. Veriler kamu kurumlarının yayımladığı kaynaklardan derlenmiştir (DSİ, Tarım ve Orman Bakanlığı SYGM, Resmî Gazete, EPİAŞ, NASA GRACE/GRACE-FO, NASA POWER, CHIRPS, OpenStreetMap ve diğerleri; ayrıntı dosya içi künyelerde).', '',
        'Lisans notu: Üçüncü taraf verileri kendi kaynaklarının kullanım koşullarına tabidir (ör. OpenStreetMap türevi veri ODbL 1.0). Derleyenin kendi katkısı için geçerli lisans Zenodo kaydında belirtilir.', '',
        'İletişim: hukuk@arslanhukuk.tr', '',
        '## Dosyalar', '', '| Dosya | Bayt | SHA-256 |', '|---|---|---|',
    ] + [f'| {g} | {n} | {h} |' for g, n, h in ozet]
    with zipfile.ZipFile(hedef, 'w', zipfile.ZIP_DEFLATED) as z:
        for g in liste: z.write(os.path.join(DIST, g), f'suharitasi-veri/{g}')
        z.writestr('suharitasi-veri/VERI-OKUBENI.md', '\n'.join(okubeni) + '\n')
        z.writestr('suharitasi-veri/SHA256SUMS', ''.join(f'{h}  {g}\n' for g, _, h in ozet))
    h = hashlib.sha256(open(hedef, 'rb').read()).hexdigest()
    print(json.dumps({'arsiv': os.path.relpath(hedef, KOK), 'dosya': len(liste), 'bayt': os.path.getsize(hedef), 'sha256': h, 'commit': commit}, ensure_ascii=False))

if __name__ == '__main__':
    main()
