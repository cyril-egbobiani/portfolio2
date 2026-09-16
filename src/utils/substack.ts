// src/utils/substack.ts — Build-time Substack feed reader
// Posts published on Substack show up in the journal automatically on the
// next build. Any network failure resolves to an empty list so builds never break.

const FEED_URL = 'https://cyriljnr.substack.com/feed';

export interface SubstackPost {
  title: string;
  url: string;
  date: Date;
  excerpt: string;
  /** Cover image from the feed, when the post has one */
  image?: string;
}

let cached: Promise<SubstackPost[]> | null = null;

export function getSubstackPosts(): Promise<SubstackPost[]> {
  cached ??= loadFeed();
  return cached;
}

async function loadFeed(): Promise<SubstackPost[]> {
  try {
    const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const xml = await res.text();

    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .map(([, item]) => ({
        title: decode(readTag(item, 'title')),
        url: readTag(item, 'link'),
        date: new Date(readTag(item, 'pubDate')),
        excerpt: decode(readTag(item, 'description')),
        image: item.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image/)?.[1],
      }))
      .filter((post) => post.title && post.url && !Number.isNaN(post.date.valueOf()));
  } catch {
    return [];
  }
}

function readTag(xml: string, name: string): string {
  const match = xml.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`));
  return match ? match[1].trim() : '';
}

function decode(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}
