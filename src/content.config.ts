// src/content.config.ts — Content collections
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Journal entries live in src/content/journal/*.md.
// Written here → rendered at /journal/<file-name>.
// Written elsewhere → set `externalUrl` (and `source`) and the entry links out.
// `images`: up to three pictures shown fanned beside the entry in the list,
// e.g. screenshots from src/assets (optimised at build time).
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    externalUrl: z.url().optional(),
    source: z.enum(['substack', 'medium', 'other']).optional(),
    images: z.array(image()).max(3).default([]),
  }),
});

// Facts shown in every case study intro (projects and designs)
const caseStudyFacts = {
  title: z.string(),
  summary: z.string(),
  year: z.string(),
  role: z.string(),
  team: z.array(z.string()).default([]),
  status: z.string().optional(),
  links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
  draft: z.boolean().default(false),
};

// Project case studies live in src/content/projects/<slug>.mdx, one per card
// in src/data/projects.ts (the card list sets which appear and in what order).
// `gallery` fills the row of screens under the title. A path starting with "/"
// is served from /public as it is; a relative path (./images/x.png) is resolved
// and optimised at build time.
const projects = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      ...caseStudyFacts,
      stack: z.array(z.string()).default([]),
      gallery: z
        .array(
          z.object({
            src: z.union([z.string().startsWith('/'), image()]),
            alt: z.string(),
            label: z.string(),
          })
        )
        .default([]),
      galleryDevice: z.enum(['phone', 'desktop']).default('phone'),
    }),
});

// Design case studies live in src/content/designs/*.mdx, rendered at
// /designs/<file-name>. `sketch` and `final` build the card thumbnail;
// images sit in src/content/designs/images/ and are optimised at build time.
const designs = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/designs' }),
  schema: ({ image }) =>
    z.object({
      ...caseStudyFacts,
      tools: z.array(z.string()).default([]),
      device: z.enum(['phone', 'desktop']).default('phone'),
      sketch: image(),
      final: image(),
      order: z.number().default(0),
    }),
});

export const collections = { journal, projects, designs };
