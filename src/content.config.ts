import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.coerce.date(),
    authors: z.array(z.string()),
    categories: z.array(z.string()),
    series: z.string().optional(),
    part: z.number().optional(),
    cover: z.string().url(),
    description: z.string(),
    locale: z.string().optional(),
    translationKey: z.string().optional(),
  }),
});

export const collections = { posts };
