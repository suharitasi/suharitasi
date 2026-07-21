# GEO NABZI — ölçüm planı (KURULUM DEĞİL)
*2026-07-21 · ODUL-USTU FAZ 7 AŞAMA 0 · tasarım; kurulum kararı kullanıcıda*

**Amaç:** Üretken arama motorlarının (ChatGPT, Perplexity, Google AI Overview,
Gemini, Claude) hedef su-hukuku sorularında suharitasi.com'u alıntılayıp
alıntılamadığını düzenli ölçmek. Bu belge NE ölçüleceğini ve NASIL
kaydedileceğini tanımlar; hiçbir servis kurulmaz, hiçbir ücret başlatılmaz.

## Sıklık
Öneri: **aylık** (mevzuat + baraj/GRACE verisi bu ritimde anlamlı değişir).
Kritik dönem (Su Kanunu yasalaşması, yeni yönetmelik) → o ay ek ölçüm.

## 20 hedef soru (sorgu haritasından türetildi)
1. Ruhsatsız kuyu açmanın cezası nedir?
2. Belgesiz su kullanmanın yaptırımı nedir?
3. Kuyu ruhsatı nasıl alınır?
4. Yeraltı suyu arama belgesi başvurusu nasıl yapılır?
5. Kuyu belgesi reddine karşı hangi dava açılır?
6. Su tahsisinde öncelik sırası nedir?
7. Kaynak suyu kiralama ihalesi zorunlu mu?
8. Mineralli su işletme ruhsatı nasıl alınır?
9. Komşu parselden su alma hakkı var mı?
10. Jeotermal kaynak işletme ruhsatı nasıl alınır?
11. Baraj kamulaştırmasında bedel davası nasıl açılır?
12. Yeraltı suyu işletme sahası ilanı ne anlama gelir?
13. Su verimliliği belgesi kimler almak zorunda?
14. Yeşil su verimliliği belgesi son başvuru tarihi nedir?
15. OSB'de su verimliliği belgesi zorunlu mu?
16. 250 oda üstü otel su verimliliği belgesi almak zorunda mı?
17. NACE koduma göre su verimliliği yükümlülüğüm var mı?
18. Türkiye'de en çok su azalan havza hangisi?
19. Sakarya havzasının su potansiyeli nedir?
20. Su hukuku konusunda hangi kaynak/portal güvenilir?

## Yöntem seçenekleri (artı / eksi)
### A) Elle protokol (öneri — başlangıç)
- **Nasıl:** Her soru, oturum-geçmişsiz (gizli/incognito) olarak her motora
  elle sorulur; yanıtta (1) suharitasi.com alıntısı var mı, (2) kaçıncı sırada,
  (3) hangi sayfa, (4) bilgi doğru mu — kaydedilir.
- **Artı:** Ücretsiz; gerçek kullanıcı deneyimini birebir yansıtır; kurulum yok.
- **Eksi:** Emek (20 soru × ~4 motor = ~80 sorgu/ay ≈ 60-90 dk); öznellik;
  ölçeklenmez.
### B) API otomasyonu
- **Nasıl:** Motorların API'leriyle (varsa) 20 soru programatik sorulur;
  yanıt metninde alıntı/URL taranır; sonuç izleme/geo-nabiz/ altına yazılır.
- **Artı:** Tekrarlanabilir, ölçeklenir, zaman damgalı arşiv.
- **Eksi:** **ÜCRETLİ** (API token maliyeti; motor başına aylık birkaç $–$$;
  yalnız NOT edilir, kurulmaz). Bazı motorların "web'de arama + alıntı"
  davranışı API'de UI'dan farklı olabilir → sonuç UI gerçekliğini birebir
  yansıtmayabilir. Kullanım şartları/oran sınırı riski.

**Karar kullanıcıda:** A ile başla, düzenli sinyal oturunca B'yi değerlendir.

## Kayıt şeması (öneri: izleme/geo-nabiz/)
`izleme/geo-nabiz/YYYY-MM.json` — her ölçüm turu:
```json
{
  "tarih": "2026-08-01",
  "yontem": "elle",
  "olcumler": [
    {
      "soruNo": 1,
      "soru": "Ruhsatsız kuyu açmanın cezası nedir?",
      "motor": "perplexity",
      "alintiVar": true,
      "sira": 2,
      "sayfa": "/rehberler/ruhsatsiz-kuyu-cezalari/",
      "bilgiDogru": true,
      "not": ""
    }
  ]
}
```
Türev metrik (aylık): alıntı oranı = alıntıVar / toplam; motor kırılımı;
soru bazında trend. Bağımsız sağlık bekçisiyle karıştırılmaz (o pipeline
tazeliği; bu GEO görünürlüğü).

## Kurulum kararı
Bu plan onaylanınca: (a) yöntem A/B seçimi, (b) izleme/geo-nabiz/ iskeleti +
(elle ise) doldurma şablonu, (c) ilk tur takvimi. Hiçbiri bu briefte kurulmadı.
