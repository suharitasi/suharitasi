#!/usr/bin/env python3
"""FAZ F — TWI ÖLÇÜM KAPISI (gece paketi, 2026-07-27).

Amaç: "8 GB yeter mi?" sorusuna VARSAYIMLA değil ÖLÇÜMLE cevap vermek.
Faz 5'te TWI "4GB yetmez" bayat varsayımıyla atlanmıştı; sunucu gerçekte
4 çekirdek / 8 GB (ölçüldü). Bu script tek bir GLO-90 karosunda gerçek
TWI zincirini (çukur doldurma → D8 yön → akış birikimi → TWI) koşar,
süre ve tepe belleği ölçer, Türkiye mozaiğine ekstrapole eder.

Yazım: yalnız stdout + --json <dosya>. Hiçbir veri dosyası değiştirilmez.
Ham DEM SALT-OKUNUR açılır.
"""
import argparse, heapq, json, os, resource, sys, time
import numpy as np
from osgeo import gdal

gdal.UseExceptions()

# Mozaik gerçeği (ölçüldü): 121 karo, N35–N42 / E25–E44 → 24000 × 9600 px
MOZAIK_PX = 24000 * 9600


def tepe_bellek_mb():
    return resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024


def oku(yol):
    ds = gdal.Open(yol, gdal.GA_ReadOnly)
    a = ds.GetRasterBand(1).ReadAsArray().astype(np.float32)
    ds = None
    return a


def cukur_doldur(z):
    """Priority-flood (Barnes 2014) — kenardan içeri doğru su basma.
    Çıktı: her hücre, kendisine kadarki en düşük eşik kadar yükseltilmiş."""
    h, w = z.shape
    dolu = np.full_like(z, np.inf)
    islendi = np.zeros(z.shape, dtype=bool)
    yigin = []
    # kenar hücreleri tohum
    for i in (0, h - 1):
        for j in range(w):
            heapq.heappush(yigin, (float(z[i, j]), i, j)); islendi[i, j] = True
    for j in (0, w - 1):
        for i in range(1, h - 1):
            heapq.heappush(yigin, (float(z[i, j]), i, j)); islendi[i, j] = True
    komsu = ((-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1))
    while yigin:
        e, i, j = heapq.heappop(yigin)
        dolu[i, j] = e
        for di, dj in komsu:
            ni, nj = i + di, j + dj
            if 0 <= ni < h and 0 <= nj < w and not islendi[ni, nj]:
                islendi[ni, nj] = True
                heapq.heappush(yigin, (max(float(z[ni, nj]), e), ni, nj))
    return dolu


def d8_ve_birikim(z, dx, dy):
    """D8 yön + akış birikimi (yükseklik-sıralı tek geçiş) + eğim."""
    h, w = z.shape
    komsu = ((-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1))
    mesafe = np.array([np.hypot(dx, dy), dy, np.hypot(dx, dy),
                       dx, dx,
                       np.hypot(dx, dy), dy, np.hypot(dx, dy)], dtype=np.float32)
    # en dik iniş komşusu (vektörel)
    en_iyi = np.full((h, w), -1, dtype=np.int8)
    en_egim = np.zeros((h, w), dtype=np.float32)
    for k, (di, dj) in enumerate(komsu):
        kaydir = np.full_like(z, np.inf)
        i0, i1 = max(0, di), h + min(0, di)
        j0, j1 = max(0, dj), w + min(0, dj)
        kaydir[i0:i1, j0:j1] = z[i0 - di:i1 - di, j0 - dj:j1 - dj]
        egim = (z - kaydir) / mesafe[k]
        daha_iyi = egim > en_egim
        en_egim[daha_iyi] = egim[daha_iyi]
        en_iyi[daha_iyi] = k
    # akış birikimi: yüksekten alçağa tek geçiş
    birikim = np.ones((h, w), dtype=np.float32)
    sira = np.argsort(z, axis=None)[::-1]
    ii, jj = np.unravel_index(sira, z.shape)
    ei = en_iyi.ravel()[sira]
    for n in range(sira.size):
        k = ei[n]
        if k < 0:
            continue
        i, j = ii[n], jj[n]
        di, dj = komsu[k]
        ni, nj = i + di, j + dj
        if 0 <= ni < h and 0 <= nj < w:
            birikim[ni, nj] += birikim[i, j]
    return birikim, en_egim


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--karo", required=True, help="tek GLO-90 karosu (.tif)")
    ap.add_argument("--json", default=None)
    ap.add_argument("--ram-esik-mb", type=float, default=None,
                    help="kullanilabilir RAM (varsayilan: /proc/meminfo MemAvailable)")
    a = ap.parse_args()

    if a.ram_esik_mb is None:
        with open("/proc/meminfo") as f:
            mi = f.read()
        a.ram_esik_mb = int([s for s in mi.split("\n") if s.startswith("MemAvailable")][0].split()[1]) / 1024

    print(f"kullanilabilir RAM (olculdu) : {a.ram_esik_mb:.0f} MB")
    st = os.statvfs(".")
    print(f"bos disk (olculdu)           : {st.f_bavail * st.f_frsize / 1e9:.1f} GB")

    t0 = time.time()
    z = oku(a.karo)
    t_oku = time.time() - t0
    px = z.size
    print(f"karo: {a.karo.split('/')[-1]}  {z.shape}  {px/1e6:.2f} M px  (okuma {t_oku:.1f} s)")

    t0 = time.time(); dolu = cukur_doldur(z); t_dol = time.time() - t0
    print(f"  cukur doldurma (priority-flood) : {t_dol:7.1f} s")
    t0 = time.time(); birikim, egim = d8_ve_birikim(dolu, 92.66, 92.66); t_d8 = time.time() - t0
    print(f"  D8 yon + akis birikimi          : {t_d8:7.1f} s")
    t0 = time.time()
    tanb = np.maximum(egim, 1e-4)
    twi = np.log(np.maximum(birikim, 1.0) * 92.66 / tanb)
    t_twi = time.time() - t0
    print(f"  TWI                              : {t_twi:7.1f} s")

    toplam = t_dol + t_d8 + t_twi
    kat = MOZAIK_PX / px
    tahmin_s = toplam * kat
    tepe = tepe_bellek_mb()
    # mozaik icin gereken diziler: dolu(f32) + birikim(f32) + egim(f32)
    #  + argsort indeksi(int64) + yon(int8) + gecici kaydirma(f32)
    dizi_mb = MOZAIK_PX * (4 + 4 + 4 + 8 + 1 + 4) / 1e6
    print()
    print(f"tek karo toplam suresi     : {toplam:.1f} s")
    print(f"mozaik/karo oran           : {kat:.1f}x")
    print(f"MOZAIK SURE TAHMINI        : {tahmin_s/3600:.2f} saat")
    print(f"tek karo tepe bellek        : {tepe:.0f} MB")
    print(f"MOZAIK ZORUNLU DIZI BELLEGI : {dizi_mb/1000:.2f} GB  (dolu+birikim+egim+argsort+yon+gecici)")
    print(f"  → RAM kapisi : {'GECER' if dizi_mb < a.ram_esik_mb else 'GECMEZ'} "
          f"({dizi_mb:.0f} MB gerekli / {a.ram_esik_mb:.0f} MB var)")
    print(f"  → SURE kapisi: {'GECER' if tahmin_s < 6*3600 else 'GECMEZ'} "
          f"({tahmin_s/3600:.2f} saat / 6 saat gece butcesi)")

    sonuc = {
        "tarih": "2026-07-27", "karo": a.karo, "karo_px": int(px),
        "sure_s": {"cukur_doldurma": round(t_dol,1), "d8_birikim": round(t_d8,1),
                    "twi": round(t_twi,1), "toplam": round(toplam,1)},
        "tepe_bellek_mb": round(tepe),
        "mozaik_px": MOZAIK_PX, "olcek_kat": round(kat,1),
        "mozaik_sure_saat_tahmini": round(tahmin_s/3600, 2),
        "mozaik_dizi_bellegi_mb": round(dizi_mb),
        "kullanilabilir_ram_mb": round(a.ram_esik_mb),
        "ram_kapisi": "GECER" if dizi_mb < a.ram_esik_mb else "GECMEZ",
        "sure_kapisi": "GECER" if tahmin_s < 6*3600 else "GECMEZ",
    }
    if a.json:
        with open(a.json, "w") as f:
            json.dump(sonuc, f, ensure_ascii=False, indent=1)
        print("yazildi:", a.json)
    return 0


if __name__ == "__main__":
    sys.exit(main())
