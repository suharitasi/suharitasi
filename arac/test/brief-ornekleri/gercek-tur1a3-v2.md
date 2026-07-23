BRIEF: SU İDARESİ TUR 1A-3 v2 — SERİNİN SON TURU.
(GERÇEK brief; özetten sadık biçimde yeniden kuruldu — bayt-birebir değil,
yanlış-pozitif ölçümü için temsili. Orijinal sohbete yapıştırılmıştı, diske
kaydedilmemişti.)

AMAÇ: Türk su idaresi kurum envanterini son tura taşımak; Ulusal Su Planı
2026-2035 eylem tablolarından kurum + faaliyet çıkarmak, kar topu kuyruğunu
kapatmak, bağımsız denetimle kapanışı ölçmek.

KAPSAM: yalnız keşif + veri. SİTE/KOD DEĞİŞİKLİĞİ YOK. Dokunulmaz: index,
arayüz, mevcut sayfalar. Yalnız data/kamu/ altındaki JSON'lar + rapor.

Bütçe: ≤50 istek.

ADIMLAR:
1. Ulusal Su Planı 2026-2035 eylem tablolarını OKU (100+ eylem); kurumları
   Ç6-USP kanalıyla çıkar, faaliyetleri usp_sorumlu_eylemler[] /
   usp_ilgili_eylemler[] alanlarına yaz (TUR 1B girdisi).
2. Ç3 kar topu kuyruğunu tamamla (36 beklemede). data/kamu/ct3-kuyruk.json
   üzerinden sür.
3. Ç4 bağımsız denetim: ≥2 YENİ bağımsız kaynak (önceki turların
   Sayıştay/yatırım programı/TÜİK/TBMM kaynakları TEKRAR KULLANILMAZ).
4. "HANGİ KAPI" keşfi: önce mevzuattan işlemleri çıkar (su-islemleri.json),
   sonra işlemleri yetkili kuruma eşle (hangi-kapi.json).

UYDURMA YASAĞI: Kurum/madde/görev/eylem-no doğrulanmadan YAZILMAZ.
Başvuru kanalı yalnız mevzuatta ya da resmi sayfada AÇIKÇA varsa yazılır;
yoksa "kanal doğrulanmadı" — tahmin YASAK. Hukuki yorum YOK; yalnız
mevzuata dayalı yetki atfı. Doğrulanamayan = "doğrulanmadı" işaretlenir.

ŞEMA: yeni alanlar opsiyonel, geriye dönük uyumlu, _sema_surumu:2.

SERİ KAPANIŞ KURALI: sonuç ne olursa olsun TUR 1A-4 ÖNERİLMEZ; kalan
boşluklar "BİLİNEN EKSİKLER" başlığı altına yazılır.

ÇIKTI: güncellenmiş data/kamu/*.json + rapor/su-idaresi-tur1a3.md
("GÜNCEL NİHAİ DURUM" başlığıyla).

Git kilidiyle commit + push. DUR.
