#!/usr/bin/env python3
"""data/havza-veri.json'dan havza içerik sayfalarını (Markdown) üretir.

- Var olan dosyanın üzerine YAZMAZ (elle yazılmış sayfalar korunur;
  örn. sakarya.md).
- Gövde metni yalnızca DSİ kaynaklı olgular içerir; coğrafi anlatı
  uydurulmaz. Veri olmayan alan "veri yok (tarih)" işaretlenir.
"""
import json
import os
import unicodedata

VERI = 'data/havza-veri.json'
HEDEF = 'src/content/havzalar'
TARIH = '14.07.2026'
DSI_URL = 'https://www.dsi.gov.tr/Sayfa/Detay/2186'
VERI_YOK = f'<span class="veri-yok">veri yok ({TARIH})</span>'


def slugla(ad):
    s = ad.replace(' Havzası', '').strip().lower()
    cevir = str.maketrans('çğıöşü', 'cgiosu')
    s = s.translate(cevir)
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return s.replace(' ', '-')


def tr_sayi(x, ondalik=None):
    """1545.2 -> '1.545,2' ; 6.006 -> '6,01' (ondalik=2)"""
    if x is None:
        return None
    if ondalik is not None:
        x = round(float(x), ondalik)
    s = f'{x:,.{ondalik if ondalik is not None else (1 if isinstance(x, float) else 0)}f}'
    return s.replace(',', '_').replace('.', ',').replace('_', '.')


d = json.load(open(VERI, encoding='utf-8'))
uretilen, atlanan = [], []

for h in d['havzalar']:
    slug = slugla(h['ad'])
    yol = os.path.join(HEDEF, f'{slug}.md')
    if os.path.exists(yol):
        atlanan.append(slug)
        continue

    potansiyel = h.get('yuzeysuyuPotansiyeli_km3')
    alan = h.get('yagisAlani_km2')
    beslenim = h.get('yasBeslenimi_hm3')
    rezerv = h.get('yasIsletmeRezervi_hm3')
    plan = h.get('eylemPlani')
    nhyp = h.get('nehirHavzasiYonetimPlani')

    if potansiyel is not None:
        k_potansiyel = (f'{tr_sayi(potansiyel, 2)} km³/yıl — '
                        f'<a href="{DSI_URL}" target="_blank" rel="noopener">DSİ 2024 Resmî Su Kaynakları İstatistikleri, Tablo 1.2</a>')
    else:
        k_potansiyel = VERI_YOK

    if beslenim is not None and rezerv is not None:
        k_yas = (f'Beslenim {tr_sayi(beslenim, 1)} hm³/yıl · işletme rezervi {tr_sayi(rezerv, 1)} hm³/yıl — '
                 f'<a href="{DSI_URL}" target="_blank" rel="noopener">DSİ 2024, Tablo 1.3</a>')
    else:
        k_yas = VERI_YOK

    k_tahsis = f'{VERI_YOK} — havza bazlı açık tahsis verisi kamuya yayımlanmıyor'

    if plan:
        k_plan = f'<a href="{plan}" target="_blank" rel="noopener">{h["ad"]} Koruma Eylem Planı (SYGM, PDF)</a>'
    elif nhyp:
        k_plan = (f'<a href="{nhyp}" target="_blank" rel="noopener">{h["ad"].replace(" Havzası", "")} '
                  f'Nehir Havzası Yönetim Planı (SYGM, PDF)</a> — koruma eylem planı bulunamadı ({TARIH})')
    else:
        k_plan = f'{VERI_YOK} — SYGM sayfasında bu havzaya ait eylem planı dosyası bulunamadı'

    ozet_parcalar = []
    if alan:
        ozet_parcalar.append(f'Yağış alanı {tr_sayi(int(alan), 0)} km²')
    if potansiyel is not None:
        ozet_parcalar.append(f'yıllık ortalama yüzey suyu potansiyeli {tr_sayi(potansiyel, 2)} km³')
    ozet = '; '.join(ozet_parcalar) + ' (DSİ 2024).' if ozet_parcalar else f'Havza veri künyesi — veri yok ({TARIH}).'

    govde = [f'{h["ad"]}, DSİ 2024 resmî istatistiklerine göre '
             f'**{tr_sayi(int(alan), 0)} km²** yağış alanına sahiptir.' if alan else
             f'{h["ad"]} için yağış alanı verisi bulunamadı ({TARIH}).']

    su = []
    if potansiyel is not None:
        su.append(f'- Yıllık ortalama yüzey suyu potansiyeli **{tr_sayi(potansiyel, 2)} km³** (DSİ 2024, Tablo 1.2).')
    if beslenim is not None:
        su.append(f'- Yeraltı suyu beslenimi **{tr_sayi(beslenim, 1)} hm³/yıl**, '
                  f'işletme rezervi **{tr_sayi(rezerv, 1)} hm³/yıl** (DSİ 2024, Tablo 1.3).')

    plan_bolum = ''
    if plan:
        plan_bolum = (f'\n## Planlama ve koruma\n\n'
                      f'Havzanın kirlilik ve koruma tedbirleri\n'
                      f'[{h["ad"]} Koruma Eylem Planı\'nda]({plan})\n(SYGM) tanımlanmıştır.\n')
    elif nhyp:
        plan_bolum = (f'\n## Planlama ve koruma\n\n'
                      f'Havza için [Nehir Havzası Yönetim Planı]({nhyp}) (SYGM)\n'
                      f'yayımlanmıştır; ayrı bir koruma eylem planı PDF\'i bulunamadı ({TARIH}).\n')

    icerik = f'''---
baslik: "{h['ad']}"
ozet: "{ozet}"
tarih: 2026-07-14
no: "{h['no']}"
kunye:
  yillikPotansiyel: '{k_potansiyel}'
  yasRezervi: '{k_yas}'
  tahsis: '{k_tahsis}'
  eylemPlani: '{k_plan}'
---

{govde[0]}

## Su varlığı

{chr(10).join(su) if su else f'*Su varlığı verisi bulunamadı ({TARIH}).*'}
{plan_bolum}
## Veri notu

Bu sayfadaki tüm sayısal değerler DSİ'nin 2024 yılı resmî su kaynakları
istatistik tablolarından alınmıştır; kaynak dosyalar
[dsi.gov.tr]({DSI_URL}) üzerinde yayımlanmaktadır. Bulunamayan alanlar
"veri yok" olarak işaretlenir; bu portal doğrulanamayan veriyi
doğrulanmış gibi göstermez.
'''
    open(yol, 'w', encoding='utf-8').write(icerik)
    uretilen.append(slug)

print(f'üretilen: {len(uretilen)} | atlanan (mevcut): {atlanan}')
for s in uretilen:
    print(' ', s)
