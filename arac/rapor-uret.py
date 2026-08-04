#!/usr/bin/env python3
"""
rapor-uret.py — Havza Su Durum Raporu (PDF, A4).
Her havza icin DSİ + GRACE + baraj + risk verisinden otomatik PDF.

Kullanim:
  python3 arac/rapor-uret.py --havza sakarya
  python3 arac/rapor-uret.py --tumu          # 25 havza birden
  python3 arac/rapor-uret.py --tumu --cikti dist/rapor/
"""
import json, os, sys, argparse
from datetime import datetime, timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                  TableStyle, PageBreak, HRFlowable)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def veri_yukle():
    with open(os.path.join(PROJECT_ROOT, "data/havza-veri.json")) as f:
        hv = json.load(f)
    with open(os.path.join(PROJECT_ROOT, "data/canli/grace-havza.json")) as f:
        gr = json.load(f)
    baraj_yolu = os.path.join(PROJECT_ROOT, "data/canli/baraj.json")
    bj = json.load(open(baraj_yolu)) if os.path.exists(baraj_yolu) else {}
    return hv, gr, bj


def grace_egilim_hesap(seri):
    """GRACE 5-yillik egilim (JS grace-hesap.js esdegeri)"""
    aylar = sorted(seri.keys())
    if len(aylar) < 24:
        return None
    son = aylar[-1]
    sy, sm = int(son[:4]), int(son[5:7])
    esik = f"{sy-5}-{sm:02d}"
    son5 = [a for a in aylar if a > esik]
    if len(son5) < 24:
        return None
    x = [int(a[:4]) + (int(a[5:7]) - 0.5) / 12 for a in son5]
    y = [seri[a] for a in son5]
    n = len(x)
    xo = sum(x) / n
    yo = sum(y) / n
    pay = sum((x[i] - xo) * (y[i] - yo) for i in range(n))
    payda = sum((x[i] - xo) ** 2 for i in range(n))
    if payda == 0:
        return None
    egim = pay / payda
    yon = "azalma" if egim <= -0.5 else ("toparlanma" if egim >= 0.5 else "sabit")
    return {"egim": egim, "yon": yon, "ay_sayisi": len(son5),
            "aralik": f"{son5[0]} – {son}", "son_deger": seri[son]}


def havali_sayi(n, ondalik=1):
    if n is None:
        return "veri yok"
    return f"{n:,.{ondalik}f}".replace(",", ".")


def risk_hesap(vd, g_sonuc, b_havza):
    """Basitlestirilmis risk puani"""
    skor = 50
    if g_sonuc:
        egim = g_sonuc["egim"]
        if egim < -1.5:
            skor += 25
        elif egim < -0.5:
            skor += 10
        elif egim > 0.5:
            skor -= 10
    if b_havza and b_havza.get("barajlar"):
        dol = [b.get("doluluk", 50) for b in b_havza["barajlar"].values() if b.get("doluluk") is not None]
        if dol:
            ort = sum(dol) / len(dol)
            if ort < 30:
                skor += 20
            elif ort < 50:
                skor += 10
    if vd and vd.get("tahsis"):
        t = str(vd["tahsis"]).lower()
        if any(w in t for w in ["kapalı", "kisitli", "yasak"]):
            skor += 15
    return min(100, max(0, skor))


def renk_risk(puan):
    if puan >= 60:
        return colors.HexColor("#C62828")
    if puan >= 35:
        return colors.HexColor("#E65100")
    return colors.HexColor("#2E7D32")


def yildiz(puan):
    if puan >= 60:
        return "★★★ YUKSEK RISK"
    if puan >= 35:
        return "★★☆ ORTA RISK"
    return "★☆☆ DUSUK RISK"


def uret_havza(hv_veri, gr_veri, bj_veri, havza_adi, cikti_dizin="dist/rapor"):
    vd = next((h for h in hv_veri["havzalar"] if h["ad"] == havza_adi), None)
    if not vd:
        print(f"HATA: '{havza_adi}' bulunamadi.")
        return None

    g_seri = gr_veri.get("havzalar", {}).get(havza_adi, {}).get("seri", {})
    g_sonuc = grace_egilim_hesap(g_seri) if g_seri else None

    # EPİAŞ havza adi (Havzası eki olmadan)
    epias_ad = havza_adi.replace(" Havzası", "")
    b_havza = bj_veri.get("havzalar", {}).get(epias_ad)

    risk = risk_hesap(vd, g_sonuc, b_havza)

    os.makedirs(cikti_dizin, exist_ok=True)
    slug = havza_adi.lower().replace(" ", "-").replace("ı", "i").replace("ğ", "g").replace("ü", "u").replace("ş", "s").replace("ö", "o").replace("ç", "c").replace("havzası", "")
    dosya = os.path.join(cikti_dizin, f"suharitasi-{slug}-durum-raporu.pdf")

    doc = SimpleDocTemplate(dosya, pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    story = []

    # Başlık
    h_style = ParagraphStyle("BaslikTR", parent=styles["Heading1"],
                              fontSize=18, spaceAfter=4*mm,
                              textColor=colors.HexColor("#0C3B4E"))
    story.append(Paragraph(f"{havza_adi} — Su Durum Raporu", h_style))

    # Tarih ve risk
    tarih = datetime.now(timezone.utc).strftime("%B %Y")
    alt_style = ParagraphStyle("Alt", parent=styles["Normal"],
                                fontSize=10, textColor=colors.HexColor("#6B7F8A"))
    risk_renk = renk_risk(risk)
    story.append(Paragraph(
        f"<b>{tarih}</b> &nbsp;|&nbsp; "
        f"Risk Puani: <font color='{risk_renk.hexval()}'><b>{risk}/100</b> — {yildiz(risk)}</font>",
        alt_style))
    story.append(Spacer(1, 6*mm))

    # DSİ Veri Künyesi
    story.append(Paragraph("1. DSİ Resmi Su Kaynaklari Verisi (2024)", styles["Heading2"]))
    kunye_veri = [
        ["Yagis Alani", f"{havali_sayi(vd.get('yagisAlani_km2'), 0)} km²"],
        ["Yuzey Suyu Potansiyeli", f"{havali_sayi(vd.get('yuzeysuyuPotansiyeli_km3'), 2)} km³/yil"],
        ["YAS Beslenimi", f"{havali_sayi(vd.get('yasBeslenimi_hm3'), 1)} hm³/yil"],
        ["YAS Isletme Rezervi", f"{havali_sayi(vd.get('yasIsletmeRezervi_hm3'), 1)} hm³/yil"],
        ["Tahsis Durumu", str(vd.get('tahsis', 'veri yok'))],
        ["Eylem Plani", "Mevcut" if vd.get('eylemPlani') else "Veri yok"],
    ]
    t = Table(kunye_veri, colWidths=[5.5*cm, 9*cm])
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E0")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph(
        "<i>Kaynak: DSİ 2024 Yili Resmi Su Kaynaklari Istatistikleri "
        "(dsi.gov.tr/Sayfa/Detay/2186, erisim 14.07.2026). "
        "Tahsis verisi kamuya acik havza kiriliminda yayimlanmamaktadir.</i>",
        ParagraphStyle("KucukItalik", parent=styles["Normal"], fontSize=7,
                       textColor=colors.HexColor("#8899A6"))))
    story.append(Spacer(1, 6*mm))

    # GRACE
    story.append(Paragraph("2. GRACE Uydu Su Depolamasi Egilimi", styles["Heading2"]))
    if g_sonuc:
        grace_veri = [
            ["5 Yillik Egim", f"{g_sonuc['egim']:+.2f} cm/yil"],
            ["Yon", g_sonuc['yon'].capitalize()],
            ["Veri Araligi", g_sonuc['aralik']],
            ["Son Deger", f"{g_sonuc['son_deger']:.1f} cm"],
            ["Ay Sayisi", str(g_sonuc['ay_sayisi'])],
        ]
        t2 = Table(grace_veri, colWidths=[5.5*cm, 9*cm])
        t2.setStyle(TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E0")),
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(t2)
    else:
        story.append(Paragraph("Yetersiz veri (24 aydan az gercek olcum).", styles["Normal"]))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(
        "<i>Kaynak: NASA GSFC GRACE/GRACE-FO mascon RL06 v2.0. "
        "TOPLAM su depolamasi DEGISIMIDIR — mutlak miktar veya yeralti suyu "
        "seviyesi DEGILDIR.</i>",
        ParagraphStyle("KucukItalik2", parent=styles["Normal"], fontSize=7,
                       textColor=colors.HexColor("#8899A6"))))
    story.append(Spacer(1, 6*mm))

    # Baraj doluluk
    story.append(Paragraph("3. Baraj Doluluk Durumu (EPİAS)", styles["Heading2"]))
    if b_havza and b_havza.get("barajlar"):
        baraj_satir = []
        for ad, b in sorted(b_havza["barajlar"].items()):
            dol = b.get("doluluk")
            baraj_satir.append([ad, f"{dol:.1f}%" if dol is not None else "veri yok"])
        if baraj_satir:
            t3 = Table([["Baraj Adi", "Doluluk %"]] + baraj_satir,
                       colWidths=[9*cm, 5.5*cm])
            t3.setStyle(TableStyle([
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E0")),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0C3B4E")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
            ]))
            story.append(t3)
    else:
        story.append(Paragraph("Bu havzada EPİAS kapsaminda enerji baraji bulunmamaktadir.", styles["Normal"]))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(
        "<i>Kaynak: EPİAS Seffaflik Platformu (seffaflik.epias.com.tr). "
        "Yalniz enerji uretimi amacli barajlari kapsar; icme suyu barajlari "
        "dahil olmayabilir. Anlik doluluk yuzdesidir.</i>",
        ParagraphStyle("KucukItalik3", parent=styles["Normal"], fontSize=7,
                       textColor=colors.HexColor("#8899A6"))))
    story.append(Spacer(1, 6*mm))

    # Yetkili Kurumlar
    story.append(Paragraph("4. Yetkili Kurumlar ve Iletisim", styles["Heading2"]))
    il_yolu = os.path.join(PROJECT_ROOT, "data/il-kurum.json")
    if os.path.exists(il_yolu):
        ik = json.load(open(il_yolu))
        havza_no = vd.get("no")
        havza_iller = ik.get("havzaIlleri", {}).get(havza_no, {}).get("iller", [])
        if havza_iller:
            il_bolge = {}
            for b_no, b in ik.get("dsiBolgeleri", {}).items():
                for il in b.get("iller", []):
                    if il in havza_iller:
                        il_bolge[il] = f"DSİ {int(b_no)}. Bolge Mudurlugu ({b.get('merkez', '?')})"
            iletisim_satir = [["Il", "DSİ Bolge Mudurlugu"]]
            for il in sorted(havza_iller):
                iletisim_satir.append([il, il_bolge.get(il, "—")])
            t4 = Table(iletisim_satir, colWidths=[4.5*cm, 10*cm])
            t4.setStyle(TableStyle([
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E0")),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0C3B4E")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
            ]))
            story.append(t4)

    story.append(Spacer(1, 8*mm))

    # Footer — Yasal uyari
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E0")))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph(
        "<b>Onemli Uyari:</b> Bu rapor yalnizca BILGILENDIRME AMACLIDIR; "
        "hukuki gorus, yatirim tavsiyesi veya resmi kurum gorusu niteligi TASIMAZ. "
        "Rapor ici veriler resmi kaynaklardan derlenmistir (DSİ, NASA GRACE, EPİAS). "
        "Su hukuku konularinda karar vermeden once mutlaka bir avukata danisiniz. "
        "Bu rapor suharitasi.com tarafindan otomatik uretilmistir. "
        "Hukuki icerik: Av. Serdar Arslan (Arslan Hukuk Burosu).",
        ParagraphStyle("Yasal", parent=styles["Normal"], fontSize=7,
                       textColor=colors.HexColor("#8899A6"))))

    doc.build(story)
    return dosya


def main():
    p = argparse.ArgumentParser(description="Havza Su Durum Raporu PDF")
    p.add_argument("--havza", help="Havza adi (ornek: 'Sakarya Havzası')")
    p.add_argument("--tumu", action="store_true", help="Tum 25 havza")
    p.add_argument("--cikti", default="dist/rapor", help="Cikti dizini")
    args = p.parse_args()

    hv, gr, bj = veri_yukle()

    if args.tumu:
        for h in hv["havzalar"]:
            yol = uret_havza(hv, gr, bj, h["ad"], args.cikti)
            if yol:
                print(f"  ✓ {h['ad']} → {yol}")
        print(f"\n{len(hv['havzalar'])} rapor uretildi: {args.cikti}/")
    elif args.havza:
        yol = uret_havza(hv, gr, bj, args.havza, args.cikti)
        if yol:
            print(f"✓ {yol}")
    else:
        p.print_help()


if __name__ == "__main__":
    main()
