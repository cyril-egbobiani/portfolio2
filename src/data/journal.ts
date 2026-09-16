// src/data/journal.ts — Journal data layer
// Merges entries written on this site with posts pulled from Substack
// into one date-sorted list.
import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { getSubstackPosts } from '../utils/substack';

export type JournalSource = 'here' | 'substack' | 'medium' | 'other';

export interface JournalEntry {
  id: string;
  title: string;
  date: Date;
  excerpt: string;
  href: string;
  external: boolean;
  source: JournalSource;
  tags: string[];
  draft: boolean;
  readingMinutes?: number;
  /** Up to three pictures: optimised assets, or remote URLs from Substack */
  images: (ImageMetadata | string)[];
}

const SOURCE_LABELS: Record<JournalSource, string> = {
  here: 'Journal',
  substack: 'Substack',
  medium: 'Medium',
  other: 'Elsewhere',
};

export function sourceLabel(source: JournalSource): string {
  return SOURCE_LABELS[source];
}

export function readingMinutes(body = ''): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatJournalDate(date: Date, withYear = true): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  });
}

export function formatJournalDay(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  // Drafts are visible while developing, never in production builds.
  const showDrafts = import.meta.env.DEV;
  const local = await getCollection('journal', ({ data }) => showDrafts || !data.draft);

  const entries: JournalEntry[] = local.map((entry) => {
    const { externalUrl, source } = entry.data;
    return {
      id: entry.id,
      title: entry.data.title,
      date: entry.data.date,
      excerpt: entry.data.excerpt,
      href: externalUrl ?? `/journal/${entry.id}`,
      external: Boolean(externalUrl),
      source: externalUrl ? (source ?? 'other') : 'here',
      tags: entry.data.tags,
      draft: entry.data.draft,
      readingMinutes: externalUrl ? undefined : readingMinutes(entry.body),
      images: entry.data.images,
    };
  });

  // A post cross-listed by hand wins over the feed copy.
  const listed = new Set(entries.map((entry) => entry.href));
  const substack: JournalEntry[] = (await getSubstackPosts())
    .filter((post) => !listed.has(post.url))
    .map((post) => ({
      id: `substack-${post.url}`,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      href: post.url,
      external: true,
      source: 'substack',
      tags: [],
      draft: false,
      images: post.image ? [post.image] : [],
    }));

  return [...entries, ...substack].sort((a, b) => b.date.valueOf() - a.date.valueOf());
}
