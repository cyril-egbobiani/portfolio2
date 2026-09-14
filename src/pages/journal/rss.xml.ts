// src/pages/journal/rss.xml.ts — RSS feed for entries written on this site
// (Substack posts already have their own feed.)
import type { APIRoute } from 'astro';
import { getJournalEntries } from '../../data/journal';

const escapeXml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? '';
  const entries = (await getJournalEntries()).filter((entry) => !entry.external && !entry.draft);

  const items = entries
    .map(
      (entry) => `
    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${base}${entry.href}</link>
      <guid>${base}${entry.href}</guid>
      <pubDate>${entry.date.toUTCString()}</pubDate>
      <description>${escapeXml(entry.excerpt)}</description>
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Cyril Egbobiani — Journal</title>
    <link>${base}/journal</link>
    <description>Journal entries by Cyril Egbobiani.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
