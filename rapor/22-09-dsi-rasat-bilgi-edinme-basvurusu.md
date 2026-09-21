# DSİ Yeraltı Suyu Rasat Verisi — Bilgi Edinme Başvuru Taslağı

*Hazırlık: 22.09.2026 · Amaç: açık yayımlanmayan kuyu-bazlı seviye (rasat) serisini yasal yoldan edinmek.*
*Bu bir taslaktır; göndermeden önce [SERDAR-HUKUK] gözden geçirir.*

## Neden başvuru?
DSİ web + Resmî İstatistikler taraması (22.09.2026) açık YAS verisinin **yıllık havza potansiyeli/rezervi** (Tablo 1.3) ile sınırlı olduğunu gösterdi; **kuyu bazlı aylık seviye (rasat) serisi açık yayımlanmıyor**. Bu veri ticari sır niteliğinde değildir; 4982 sayılı Bilgi Edinme Hakkı Kanunu kapsamında istenebilir.

## Başvuru yeri
- **CİMER**: `cimer.gov.tr` → "Bilgi Edinme" (DSİ, Tarım ve Orman Bakanlığı).
- Doğrudan birim: **DSİ Genel Müdürlüğü — Yeraltısuları Dairesi Başkanlığı**
  E-posta: `yeraltisulari@dsi.gov.tr` · Tel: 0312 454 44 00.

## Talep edilen veri (net, ölçülebilir)
> 167 sayılı Kanun kapsamında tutulan **yeraltı suyu seviye gözlem (rasat) kuyularına** ait, **son 10 yıla** (2016–2026) ilişkin **aylık yeraltı suyu seviye ölçümleri**.
> Tercihen **kuyu bazında**, şu alanlarla; elektronik ortamda **CSV veya Excel**:
> - kuyu no / istasyon kodu
> - il, ilçe, havza/alt havza
> - enlem-boylam (WGS84)
> - ölçüm tarihi (YYYY-AA)
> - seviye (m) ve birimi (kot mu, derinlik mi — belirtilmesi rica olunur)
> - kuyu statüsü (gözlem/üretim), kuyu derinliği (varsa)

Kapsam daraltılabilecek iller/havzalar (öncelik): Konya Kapalı (16), Gediz (05), Küçük Menderes (06), Akarçay (11), Burdur (10), Ceyhan (20), Asi (19), Fırat-Dicle (21).

## Gerekçe (başvuru metnine gömülecek)
Bu veri; su hukuku alanında **kamuya açık, doğrulanabilir** bilgi üretmek, akifer eğilimlerinin nesnel analizini yapmak ve akademik/sektörel çalışmalara dayanak sağlamak üzere talep edilmektedir. Talebin karşılanması hâlinde veri **kaynağı belirtilerek** kullanılacaktır. 4982 s. Kanun'un 16–28. maddeleri kapsamındaki yasal istisnalar saklı olmak üzere, verinin elektronik ortamda paylaşılması talep olunur.

## Gönderilecek metin (kopyala-yapıştır)
```
Konu: Yeraltı suyu seviye (rasat) gözlem verisi talebi (4982 s. Bilgi Edinme)

Sayın DSİ Genel Müdürlüğü / Yeraltısuları Dairesi Başkanlığı,

167 sayılı Yeraltısuları Hakkında Kanun kapsamında tutulan yeraltı suyu seviye gözlem
(rasat) kuyularına ait, son 10 yıla (2016–2026) ilişkin AYLIK seviye ölçümlerini,
elektronik ortamda (tercihen CSV veya Excel) talep ediyorum.

Tercih edilen alanlar (kuyu bazında):
- kuyu no / istasyon kodu, il, ilçe, havza/alt havza
- enlem-boylam (WGS84), ölçüm tarihi (YYYY-AA)
- seviye değeri ve birimi (kot/derinlik), kuyu statüsü, kuyu derinliği (varsa)

Öncelikli havzalar: Konya Kapalı, Gediz, Küçük Menderes, Akarçay, Burdur, Ceyhan, Asi, Fırat-Dicle.
Havza bazında kısıt varsa, mevcut en geniş kapsamın paylaşılması yeterlidir.

Bu talep; su hukuku alanında kamuya açık, doğrulanabilir bilgi üretmek amacıyla yapılmakta olup,
veri kaynağı belirtilerek kullanılacaktır. 4982 s. Kanun kapsamındaki yasal istisnalar saklıdır.

Bilgilerinize arz ederim.
Ad Soyad / İletişim
```

## Takip
- Başvuru no + tarih buraya işlenir; yanıt geldiğinde `veri/ham/dsi-rasat/` altına konur.
- Yanıt gelince `arac/akifer-egilim-uret.mjs`'teki GRACE proxy'sinin yerine/yanına gerçek rasat serisi bağlanır (K7: uydurma yok).
