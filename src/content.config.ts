import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const rehberler = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rehberler' }),
  schema: z.object({
    baslik: z.string(),
    ozet: z.string(),
    tarih: z.coerce.date(),
    // true ise sayfa sonuna 81 il / yetkili kurum tablosu eklenir (data/il-kurum.json)
    ilKurumTablosu: z.boolean().optional(),
    // Sayfa sonundaki "İlgili rehberler" bloğu; slug listesi (2-3 önerilir).
    // Slug'lar derleme sırasında doğrulanır: olmayan slug build'i düşürür.
    ilgili: z.array(z.string()).default([]),
    // Rehberin ait olduğu küme; /rehberler/ listesi bu alanla gruplanır.
    kume: z.enum(['surec', 'uyusmazlik']),
  }),
});

const havzalar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/havzalar' }),
  schema: z.object({
    baslik: z.string(),
    ozet: z.string(),
    tarih: z.coerce.date(),
    no: z.string().optional(), // DSİ havza numarası (01–25); listede sıralama
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
  }),
});

export const collections = { rehberler, havzalar, 'su-kanunu': suKanunu };
