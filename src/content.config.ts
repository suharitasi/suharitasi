import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const rehberler = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rehberler' }),
  schema: z.object({
    baslik: z.string(),
    ozet: z.string(),
    tarih: z.coerce.date(),
    // Görünür güncellik damgası (kalanlar paketi 25.08.2026, eeat-audit №1):
    // son GERÇEK içerik/künye değişikliğinin günü. İlk değerler git
    // geçmişinden ölçüldü; bundan sonra içerik değişen dosyada bu alan da
    // güncellenir (KARARLAR kaydı). Yoksa damga tarih'ten basılır,
    // dateModified = guncelleme ?? tarih.
    guncelleme: z.coerce.date().optional(),
    // true ise sayfa sonuna 81 il / yetkili kurum tablosu eklenir (data/il-kurum.json)
    ilKurumTablosu: z.boolean().optional(),
    // Sayfa sonundaki "İlgili rehberler" bloğu; slug listesi (2-3 önerilir).
    // Slug'lar derleme sırasında doğrulanır: olmayan slug build'i düşürür.
    ilgili: z.array(z.string()).default([]),
    // Rehberin ait olduğu küme; /rehberler/ listesi bu alanla gruplanır.
    kume: z.enum(['surec', 'uyusmazlik']),
    // Sayfa mimarisi kalıbı (DESIGN.md §17). 2 = reform kalıbı (ilk ekran
    // öz-cevap + "ne çözer" + içindekiler kartları; referans blokları
    // katmanda). Yalnız pilotlarda açılır; alan yoksa eski kalıp aynen
    // render edilir — pilot dışı sayfa değişmez.
    kalip: z.literal(2).optional(),
    // Kalıp 2 ilk ekranı: "bu rehber ne çözer" maddeleri. YALNIZ doğrulanmış
    // gövde metninden damıtılır; yeni hukuki iddia/künye üretilmez.
    cozer: z.array(z.string().min(20).max(160)).min(2).max(4).optional(),
    // "Cevap önce, dayanak sonra" (CLAUDE.md): başlıktan hemen sonra çıkan
    // ~280 karakterlik damıtılmış öz cevap. YALNIZ bu sayfanın doğrulanmış
    // içeriğinden damıtılır; yeni iddia/künye eklenmez. Meta description'ın
    // da kaynağıdır. Uzunluk build'de sınırlanır (aşırıysa hata).
    ozCevap: z.string().min(120).max(340),
    // Arama niyetine göre <title> metni (marka eki eklenmez; ≤60 karakter).
    // Verilmezse baslik kullanılır. YALNIZ mevcut başlığın niyet-odaklı
    // yeniden ifadesidir; yeni hukuki iddia içermez (uydurma yasağı).
    seoBaslik: z.string().max(60).optional(),
    // Görünür "Sık sorulan sorular" bloğu + FAQPage JSON-LD'nin TEK kaynağı.
    // Her madde YALNIZ sayfanın kendi doğrulanmış gövdesinden/öz-cevabından
    // damıtılır; görünür bölüm olmadan şema yayınlanmaz (Google kuralı).
    sss: z
      .array(z.object({ soru: z.string().min(8), cevap: z.string().min(20) }))
      .min(2)
      .max(6)
      .optional(),
    // KARAR MATRİSİ (13.09.2026): her satır somut bir senaryoyu 5 eksende
    // çözer. Hücreler YALNIZ sayfanın doğrulanmış gövdesinden/mevzuat
    // metninden damıtılır; veri yoksa "Doğrulanmış süre yok" gibi dürüst
    // ifade yazılır (uydurma yasağı). Yeni hukuki iddia üretilmez.
    karar: z
      .array(
        z.object({
          senaryo: z.string().min(10).max(180),
          merci: z.string().min(2).max(140),
          sure: z.string().min(2).max(140),
          // "—" (doğrudan mali yükümlülük yok) meşru bir hücre değeridir.
          ceza: z.string().min(1).max(180),
          emsal: z.string().min(2).max(240),
        }),
      )
      .min(2)
      .max(8)
      .optional(),
  }),
});

const havzalar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/havzalar' }),
  schema: z.object({
    baslik: z.string(),
    ozet: z.string(),
    tarih: z.coerce.date(),
    // Görünür güncellik damgası (kalanlar paketi 25.08.2026, eeat-audit №1):
    // son GERÇEK içerik/künye değişikliğinin günü. İlk değerler git
    // geçmişinden ölçüldü; bundan sonra içerik değişen dosyada bu alan da
    // güncellenir (KARARLAR kaydı). Yoksa damga tarih'ten basılır,
    // dateModified = guncelleme ?? tarih.
    guncelleme: z.coerce.date().optional(),
    no: z.string().optional(), // DSİ havza numarası (01–25); listede sıralama
    // Sayfa mimarisi kalıbı (DESIGN.md §17). 2 = reform kalıbı (kahraman
    // veri bandı + katmanlı sunum). Yalnız pilotlarda açılır; alan yoksa
    // eski kalıp aynen render edilir — pilot dışı sayfa değişmez.
    kalip: z.literal(2).optional(),
    // Künye alanları; dolduruluncaya dek "veri yükleniyor" gösterilir.
    kunye: z
      .object({
        yillikPotansiyel: z.string().optional(),
        yasRezervi: z.string().optional(),
        tahsis: z.string().optional(),
        eylemPlani: z.string().optional(),
      })
      .default({}),
    // "Bu havzada hukuki durum" bloğu (BRIEF: veriyle hukuku aynı ekranda
    // evlendiren katman). Yoksa blok hiç render edilmez — boş başlık çıkmaz.
    // cerceve: her havzada geçerli rejim, kaynak atıflı HTML.
    // kisitlar: havzaya ÖZGÜ kısıt; doğrulanmadıysa alan boş bırakılır ve
    //           şablon "doğrulanmadı" satırını kendisi yazar (uydurma yasağı).
    hukuk: z
      .object({
        cerceve: z.string(),
        kisitlar: z.string().optional(),
        rehberler: z.array(z.string()).default([]),
      })
      .optional(),
  }),
});

const suKanunu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/su-kanunu' }),
  schema: z.object({
    baslik: z.string(),
    ozet: z.string(),
    tarih: z.coerce.date(),
    // Görünür güncellik damgası (kalanlar paketi 25.08.2026, eeat-audit №1):
    // son GERÇEK içerik/künye değişikliğinin günü. İlk değerler git
    // geçmişinden ölçüldü; bundan sonra içerik değişen dosyada bu alan da
    // güncellenir (KARARLAR kaydı). Yoksa damga tarih'ten basılır,
    // dateModified = guncelleme ?? tarih.
    guncelleme: z.coerce.date().optional(),
  }),
});

const vakalar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/vakalar' }),
  schema: z.object({
    baslik: z.string(),
    ozet: z.string(),
    tarih: z.coerce.date(),
    // Görünür güncellik damgası (kalanlar paketi 25.08.2026, eeat-audit №1):
    // son GERÇEK içerik/künye değişikliğinin günü. İlk değerler git
    // geçmişinden ölçüldü; bundan sonra içerik değişen dosyada bu alan da
    // güncellenir (KARARLAR kaydı). Yoksa damga tarih'ten basılır,
    // dateModified = guncelleme ?? tarih.
    guncelleme: z.coerce.date().optional(),
    // Şirket adı (KAP kayıtlı unvan).
    sirket: z.string(),
    // Sayfa mimarisi kalıbı (DESIGN.md §17). 2 = reform kalıbı (kahraman
    // stat kartları + zaman çizgisi sahnesi). Yalnız pilotlarda açılır;
    // alan yoksa eski kalıp aynen render edilir.
    kalip: z.literal(2).optional(),
    // Kalıp 2 ilk ekranı: kahraman stat kartları. YALNIZ bu sayfanın
    // doğrulanmış olgularından (olaylar/KAP); künyesiz sayı yayınlanmaz
    // (DESIGN.md §5) — kaynak alanı zorunlu.
    kahraman: z
      .array(
        z.object({
          deger: z.string(),
          birim: z.string().optional(),
          etiket: z.string(),
          kaynak: z.string(),
          // Sayı-canlanma opt-in'i: YALNIZ gerçek büyüklüklerde true; yıl/
          // küçük sayım işaretlenmez (ödül-üstü Faz 1, kullanıcı kararı).
          canlan: z.boolean().optional(),
        }),
      )
      .min(2)
      .max(3)
      .optional(),
    // "Cevap önce" öz cevap — YALNIZ doğrulanmış olgudan; iddia/yorum yok.
    ozCevap: z.string().min(120).max(340),
    // Arama niyetine göre <title> (marka eki eklenmez; ≤60 kr).
    seoBaslik: z.string().max(60).optional(),
    // Olay akışı — her olay bir KAP bildirimine bağlı (künye zorunlu, url).
    olaylar: z
      .array(
        z.object({
          tarih: z.string(),
          olay: z.string(),
          tur: z.string().optional(),
          bildirim: z.string().optional(), // KAP bildirim no
          url: z.string().url(),
        }),
      )
      .default([]),
    // Sayfa sonu kaynak künyesi.
    kaynaklar: z
      .array(z.object({ ad: z.string(), url: z.string().url() }))
      .default([]),
    erisimTarihi: z.string(),
    // "Bu yol nasıl işler" hukuki bölüm: 'taslak' → canlıda RENDER EDİLMEZ
    // (iskelet .md yorum satırlarında bekler); 'yayin' → bölüm açılır.
    // Kullanıcı onayıyla değişir. Yarım bölüm asla görünmez.
    hukukiYol: z.enum(['taslak', 'yayin']).default('taslak'),
    // hukukiYol='yayin' olunca render edilecek HTML gövde (onay öncesi boş).
    hukukiYolGovde: z.string().optional(),
  }),
});

// OTONOM RAPORLAR (Modül 4, 04.10.2026): aylık hidroloji/kuraklık raporları
// arac/rapor/aylik-rapor-uret.py tarafından ÜRETİLİR (deterministik; LLM
// yok — uydurma yasağı). Yazar: "Su Haritası Otonom Sistemi".
const raporlar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/raporlar' }),
  schema: z.object({
    baslik: z.string(),
    ozet: z.string().max(400),
    tarih: z.coerce.date(),
    donem: z.string(),
    yazar: z.string().default('Su Haritası Otonom Sistemi'),
    etiketler: z.array(z.string()).default([]),
    // Üretildiği veri kaynaklarının son gözlem tarihleri (şeffaflık).
    veriAraligi: z.string().optional(),
  }),
});

export const collections = { rehberler, havzalar, 'su-kanunu': suKanunu, vakalar, raporlar };
