// src/utils/article.ts — Long-form article behaviour shared by journal entries
// and design case studies. Expects [data-entry], [data-entry-body] and
// an optional [data-read-progress] bar on the page.

export function initArticlePage() {
  const article = document.querySelector<HTMLElement>('[data-entry]');
  const body = article?.querySelector<HTMLElement>('[data-entry-body]');
  if (!article || !body) return;

  const bar = document.querySelector<HTMLElement>('[data-read-progress]');
  // Footnotes become handwritten asides tucked under the block that references them
  const placeNotes = () => {
    body.querySelectorAll('.entry-note').forEach((note) => note.remove());

    const refs = body.querySelectorAll<HTMLAnchorElement>('a[data-footnote-ref]');
    if (refs.length === 0) return;

    refs.forEach((ref) => {
      const source = document.getElementById(decodeURIComponent(ref.hash.slice(1)));
      if (!source) return;

      // The top-level block (paragraph, list, quote) the reference sits in
      let block: HTMLElement | null = ref;
      while (block && block.parentElement !== body) block = block.parentElement;
      if (!block) return;

      const note = document.createElement('aside');
      note.className = 'entry-note';
      note.innerHTML = source.innerHTML;
      note.querySelectorAll('[data-footnote-backref]').forEach((back) => back.remove());
      note.insertAdjacentHTML(
        'afterbegin',
        '<svg class="entry-note__hook" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2c-.4 5 .6 9 5 10.6 2 .7 4.3.6 7 .2"/><path d="M12.4 10.2 15.2 12.8 12.2 15"/></svg>'
      );

      // Several notes on one block stack in reading order
      let after: Element = block;
      while (after.nextElementSibling?.classList.contains('entry-note')) after = after.nextElementSibling;
      after.after(note);
    });

    article.setAttribute('data-notes-inline', '');
  };

  const updateProgress = () => {
    if (!bar) return;
    const rect = article.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress = scrollable <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / scrollable));
    bar.style.transform = `scaleX(${progress})`;
  };

  placeNotes();
  updateProgress();

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  document.addEventListener(
    'astro:before-swap',
    () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    },
    { once: true }
  );
}
