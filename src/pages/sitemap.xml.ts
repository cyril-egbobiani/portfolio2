// src/pages/sitemap.xml.ts — Sitemap built from the real pages at build time,
// using `site` from astro.config.mjs, so it never goes stale.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { projects as projectCards } from '../data/projects';

interface SitemapPage {
  path: string;
  priority: string;
  lastmod?: Date;
}

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? 'https://cyril-jnr.vercel.app';
  const published = ({ data }: { data: { draft: boolean } }) => !data.draft;

  const [projects, designs, journal] = await Promise.all([
    getCollection('projects', published),
    getCollection('designs', published),
    getCollection('journal', published),
  ]);
  const projectSlugs = new Set(projects.map((entry) => entry.id));

  const pages: SitemapPage[] = [
    { path: '/', priority: '1.0' },
    { path: '/about', priority: '0.8' },
    { path: '/journal', priority: '0.7' },
    ...projectCards
      .filter((card) => projectSlugs.has(card.slug))
      .map((card) => ({ path: `/projects/${card.slug}`, priority: '0.8' })),
    ...designs.map((entry) => ({ path: `/designs/${entry.id}`, priority: '0.7' })),
    ...journal
      .filter((entry) => !entry.data.externalUrl)
      .map((entry) => ({ path: `/journal/${entry.id}`, priority: '0.6', lastmod: entry.data.date })),
  ];

  const urls = pages.map(({ path, priority, lastmod }) =>
    [
      '  <url>',
      `    <loc>${origin}${path}</loc>`,
      lastmod ? `    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : null,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n')
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
