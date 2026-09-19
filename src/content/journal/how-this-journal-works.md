---
title: How this journal works
date: 2026-09-14
excerpt: A template entry — frontmatter options, footnotes that become margin notes, and how Substack posts appear.
tags: [template]
draft: true
---

This is a **draft template**. Drafts show up while running `npm run dev` and are left out of production builds, so you can keep this file as a reference or delete it once your first real entry is live.

## Writing an entry

Create a Markdown file in `src/content/journal/`. The file name becomes the URL — `my-first-note.md` is served at `/journal/my-first-note`.

Every entry starts with frontmatter:

```yaml
title: My first note
date: 2026-09-20
excerpt: One sentence shown in lists and link previews.
tags: [design, engineering]   # optional
draft: false                  # optional, defaults to false
```

## Margin notes

Footnotes are written the usual Markdown way.[^1] On every screen size they are lifted out of the footer and handwritten just under the paragraph they belong to.[^2]

## Posts written elsewhere

Anything published on Substack is pulled from the feed at build time and listed automatically. To list a post from somewhere else (Medium, a guest post), create an entry with `externalUrl` and `source` — it links out instead of opening a page here.

> Quotes, lists, images, and code blocks are all styled to match the rest of the site.

[^1]: Like this one — a short aside that reads better in the margin.
[^2]: Keep margin notes short; a sentence or two works best.
