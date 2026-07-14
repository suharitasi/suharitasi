import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const rehberler = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rehberler' }),
  schema: z.object({
    baslik: z.string(),
    ozet: z.string(),
    tarih: z.coerce.date(),
  }),
});

const havzalar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/havzalar' }),
  schema: z.object({
    baslik: z.string(),
    ozet: z.string(),
    tarih: z.coerce.date(),
    // Künye alanları; dolduruluncaya dek "veri yükleniyor" gösterilir.
    kunye: z
      .object({
        yillikPotansiyel: z.string().optional(),
        yasRezervi: z.string().optional(),
        tahsis: z.string().optional(),
        eylemPlani: z.string().optional(),
      })
      .default({}),
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
