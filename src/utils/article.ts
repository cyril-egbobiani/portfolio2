// src/utils/article.ts — Long-form article behaviour shared by journal entries
// and design case studies. Expects [data-entry], [data-entry-body] and
// an optional [data-read-progress] bar on the page.

export function initArticlePage() {
  const article = document.querySelector<HTMLElement>('[data-entry]');
  const body = article?.querySelector<HTMLElement>('[data-entry-body]');
  if (!article || !body) return;

  const bar = document.querySelector<HTMLElement>('[data-read-progress]');
  const wide = window.matchMedia('(min-width: 1180px)');

  // Lift footnotes into the margin beside the line that references them
  let noteListeners: AbortController | null = null;
  const placeMarginNotes = () => {
    noteListeners?.abort();
    noteListeners = new AbortController();
    const { signal } = noteListeners;
    body.querySelectorAll('.entry-margin-note').forEach((note) => note.remove());
    article.removeAttribute('data-margin-notes');
    if (!wide.matches) return;

    const refs = body.querySelectorAll<HTMLAnchorElement>('a[data-footnote-ref]');
    if (refs.length === 0) return;

    const bodyTop = body.getBoundingClientRect().top;
    let nextFreeTop = 0;

    // Each sheet lands at a slightly different angle, like notes stuck on by hand
    const tilts = [-1.4, 1.1, -0.7, 1.6, -1.9, 0.8];

    refs.forEach((ref, index) => {
      const source = document.getElementById(decodeURIComponent(ref.hash.slice(1)));
      if (!source) return;

      const note = document.createElement('aside');
      note.className = 'entry-margin-note';
      note.innerHTML = source.innerHTML;
      note.querySelectorAll('[data-footnote-backref]').forEach((back) => back.remove());

      const num = document.createElement('span');
      num.className = 'entry-margin-note__num';
      num.textContent = ref.textContent ?? '';
      note.prepend(num);
      note.style.setProperty('--tilt', `${tilts[index % tilts.length]}deg`);

      // Hovering the reference (or the note) straightens and lifts the sheet
      const activate = () => note.classList.add('is-active');
      const deactivate = () => note.classList.remove('is-active');
      [ref, note].forEach((el) => {
        el.addEventListener('pointerenter', activate, { signal });
        el.addEventListener('pointerleave', deactivate, { signal });
      });
      ref.addEventListener('focus', activate, { signal });
      ref.addEventListener('blur', deactivate, { signal });

      body.appendChild(note);
      const top = Math.max(ref.getBoundingClientRect().top - bodyTop - 4, nextFreeTop);
      note.style.top = `${top}px`;
      nextFreeTop = top + note.offsetHeight + 16;
    });

    article.setAttribute('data-margin-notes', '');
  };

  const updateProgress = () => {
    if (!bar) return;
    const rect = article.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress = scrollable <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / scrollable));
    bar.style.transform = `scaleX(${progress})`;
  };

  const onResize = () => {
    placeMarginNotes();
    updateProgress();
  };

  placeMarginNotes();
  updateProgress();
  document.fonts?.ready.then(placeMarginNotes);

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', onResize);
  document.addEventListener(
    'astro:before-swap',
    () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', onResize);
    },
    { once: true }
  );
}
