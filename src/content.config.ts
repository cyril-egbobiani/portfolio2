// src/content.config.ts — Content collections
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Journal entries live in src/content/journal/*.md.
// Written here → rendered at /journal/<file-name>.
// Written elsewhere → set `externalUrl` (and `source`) and the entry links out.
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    externalUrl: z.url().optional(),
    source: z.enum(['substack', 'medium', 'other']).optional(),
  }),
});

export const collections = { journal };
