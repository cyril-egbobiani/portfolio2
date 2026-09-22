// src/utils/case-study.ts — Interactions for case study pages (projects and designs):
// section rail, scroll reveals, count-up stats, option tabs, image zoom, gallery,
// and decision media: videos, before/after sliders, annotated screenshots.
// Everything is progressive: without JavaScript the page reads top to bottom.

type Cleanup = () => void;

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initCaseStudy() {
  const page = document.querySelector<HTMLElement>('[data-cs]');
  if (!page || page.dataset.csReady !== undefined) return;

  const cleanups: Cleanup[] = [];
  initRail(page, cleanups);
  initReveal(page, cleanups);
  initCounts(page, cleanups);
  initOptions(page, cleanups);
  initZoom(page, cleanups);
  initGallery(page, cleanups);
  initSystemMap(page);
  initVideos(page, cleanups);
  initCompare(page);
  initAnnotated(page);
  page.dataset.csReady = '';

  document.addEventListener('astro:before-swap', () => cleanups.forEach((cleanup) => cleanup()), { once: true });
}

// ── Section rail: one entry per section label, a dot that bounces to the active one ──
function initRail(page: HTMLElement, cleanups: Cleanup[]) {
  const rail = document.querySelector<HTMLElement>('[data-cs-rail]');
  const track = rail?.querySelector<HTMLElement>('.cs-rail__track');
  const list = rail?.querySelector<HTMLOListElement>('.cs-rail__list');
  if (!rail || !track || !list) return;

  const intro = page.querySelector<HTMLElement>('[data-cs-intro]');
  const sections = [...page.querySelectorAll<HTMLElement>('[data-cs-section]')];

  const entries: { label: string; target: HTMLElement }[] = [];
  const owners: { el: HTMLElement; entry: number }[] = [];
  const addMember = (el: HTMLElement, label: string) => {
    let index = entries.findIndex((entry) => entry.label === label);
    if (index === -1) index = entries.push({ label, target: el }) - 1;
    owners.push({ el, entry: index });
  };

  if (intro) addMember(intro, 'Intro');
  sections.forEach((section) => addMember(section, section.dataset.csLabel ?? ''));

  if (entries.length < 2) {
    rail.hidden = true;
    return;
  }

  const links = entries.map(({ label, target }) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'cs-rail__link';
    link.href = `#${target.id}`;
    link.textContent = label;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', `#${target.id}`);
    });
    item.append(link);
    return item;
  });
  list.replaceChildren(...links);

  const dot = document.createElement('span');
  dot.className = 'cs-rail__dot';
  dot.setAttribute('aria-hidden', 'true');
  track.append(dot);

  const anchors = links.map((item) => item.firstElementChild as HTMLAnchorElement);
  let active = -1;

  const setActive = (index: number, force = false) => {
    if (index === active && !force) return;
    active = index;
    anchors.forEach((anchor, i) => {
      anchor.classList.toggle('is-active', i === index);
      if (i === index) anchor.setAttribute('aria-current', 'true');
      else anchor.removeAttribute('aria-current');
    });
    const anchor = anchors[index];
    dot.style.opacity = '1';
    dot.style.transform = `translateY(${anchor.offsetTop + anchor.offsetHeight / 2 - 3}px)`;
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.35;
    let current = 0;
    owners.forEach(({ el, entry }) => {
      if (el.getBoundingClientRect().top <= line) current = entry;
    });
    setActive(current);
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  const onResize = () => setActive(active < 0 ? 0 : active, true);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  document.fonts?.ready.then(onResize);
  update();

  cleanups.push(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  });
}

// ── Scroll reveal: soft rise + blur for panels and cards ──
function initReveal(page: HTMLElement, cleanups: Cleanup[]) {
  const items = [...page.querySelectorAll<HTMLElement>('[data-cs-reveal]')];
  if (reduceMotion() || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  // Anything already on screen shows immediately so nothing flashes on load
  const fold = window.innerHeight * 0.92;
  items.forEach((item) => {
    if (item.getBoundingClientRect().top < fold) item.classList.add('is-revealed');
    else observer.observe(item);
  });

  cleanups.push(() => observer.disconnect());
}

// ── Stats: count up the first time they scroll into view ──
function initCounts(page: HTMLElement, cleanups: Cleanup[]) {
  const numbers = [...page.querySelectorAll<HTMLElement>('[data-cs-count]')];
  if (numbers.length === 0 || reduceMotion() || !('IntersectionObserver' in window)) return;

  const format = (value: number, decimals: number) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);

  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.csCount);
    const decimals = Number(el.dataset.csDecimals ?? 0);
    const final = el.dataset.csFinal ?? format(target, decimals);
    const start = performance.now();
    const duration = 1100;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = progress < 1 ? format(target * eased, decimals) : final;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  const fold = window.innerHeight * 0.9;
  numbers.forEach((el) => {
    if (el.getBoundingClientRect().top < fold) return;
    el.dataset.csFinal = el.textContent ?? '';
    el.textContent = format(0, Number(el.dataset.csDecimals ?? 0));
    observer.observe(el);
  });

  cleanups.push(() => observer.disconnect());
}

// ── Options: turn stacked option panels into pill tabs ──
function initOptions(page: HTMLElement, cleanups: Cleanup[]) {
  page.querySelectorAll<HTMLElement>('[data-cs-options]').forEach((group, groupIndex) => {
    const tabs = group.querySelector<HTMLElement>('[data-cs-options-tabs]');
    const panels = [...group.querySelectorAll<HTMLElement>('[data-cs-option]')];
    if (!tabs || panels.length < 2) return;

    const pill = document.createElement('span');
    pill.className = 'cs-options__pill';
    pill.setAttribute('aria-hidden', 'true');
    tabs.append(pill);
    tabs.setAttribute('role', 'tablist');

    const buttons = panels.map((panel, index) => {
      const id = `cs-option-${groupIndex}-${index}`;
      panel.id ||= `${id}-panel`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', id);

      const button = document.createElement('button');
      button.type = 'button';
      button.id = id;
      button.className = 'cs-options__tab';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', panel.id);
      if (panel.dataset.csVerdict === 'chosen') {
        const mark = document.createElement('span');
        mark.className = 'cs-options__chosen';
        mark.setAttribute('aria-hidden', 'true');
        button.append(mark);
      }
      button.append(panel.dataset.csName ?? `Option ${index + 1}`);
      tabs.append(button);
      return button;
    });

    let current = 0;
    const select = (index: number, { focus = false, animate = true } = {}) => {
      current = index;
      buttons.forEach((button, i) => {
        const on = i === index;
        button.setAttribute('aria-selected', String(on));
        button.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });

      const button = buttons[index];
      pill.style.transition = animate ? '' : 'none';
      pill.style.width = `${button.offsetWidth}px`;
      pill.style.transform = `translateX(${button.offsetLeft}px)`;

      if (animate && !reduceMotion()) {
        const panel = panels[index];
        panel.classList.remove('is-entering');
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      }
      if (focus) button.focus();
    };

    buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
    tabs.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      select((current + step + buttons.length) % buttons.length, { focus: true });
    });

    group.classList.add('is-tabbed');
    select(0, { animate: false });

    const realign = () => select(current, { animate: false });
    window.addEventListener('resize', realign);
    document.fonts?.ready.then(realign);
    cleanups.push(() => window.removeEventListener('resize', realign));
  });
}

// ── Image zoom: images spring out of their frame to fill the screen ──
function initZoom(page: HTMLElement, cleanups: Cleanup[]) {
  const images = [...page.querySelectorAll<HTMLImageElement>('.cs-figure img, .cs-phone img, .cs-gallery__item img')];
  if (images.length === 0) return;

  let clone: HTMLImageElement | null = null;
  let source: HTMLImageElement | null = null;
  let backdrop: HTMLElement | null = null;
  let closeButton: HTMLButtonElement | null = null;
  let closing = false;

  const finish = () => {
    clone?.remove();
    backdrop?.remove();
    closeButton?.remove();
    closeButton = null;
    if (source) source.style.visibility = '';
    source?.focus({ preventScroll: true });
    clone = source = backdrop = null;
    closing = false;
    document.documentElement.style.overflow = '';
  };

  const close = () => {
    if (!clone || closing) return;
    closing = true;
    backdrop?.classList.remove('is-active');
    if (reduceMotion()) return finish();

    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      finish();
    };
    clone.style.transition = 'transform 340ms var(--ease-smooth-out)';
    clone.style.transform = 'translate3d(0, 0, 0) scale(1)';
    clone.addEventListener('transitionend', end, { once: true });
    setTimeout(end, 420);
  };

  const open = (img: HTMLImageElement) => {
    if (clone) return;
    const rect = img.getBoundingClientRect();

    backdrop = document.createElement('div');
    backdrop.className = 'cs-zoom-backdrop';
    backdrop.addEventListener('click', close);
    document.body.append(backdrop);

    clone = img.cloneNode() as HTMLImageElement;
    clone.className = 'cs-zoom-clone';
    clone.removeAttribute('role');
    clone.removeAttribute('tabindex');
    clone.removeAttribute('aria-label');
    Object.assign(clone.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
    clone.addEventListener('click', close);
    document.body.append(clone);

    // A visible way out: Escape is not an option on a phone
    closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'cs-zoom-close';
    closeButton.setAttribute('aria-label', 'Close image');
    closeButton.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>';
    closeButton.addEventListener('click', close);
    document.body.append(closeButton);
    closeButton.focus({ preventScroll: true });

    source = img;
    img.style.visibility = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const ratio = rect.width / rect.height;
    let width = Math.min(window.innerWidth * 0.9, 1100);
    let height = width / ratio;
    const maxHeight = window.innerHeight * 0.86;
    if (height > maxHeight) {
      height = maxHeight;
      width = height * ratio;
    }
    const scale = width / rect.width;
    const x = (window.innerWidth - width) / 2 - rect.left;
    const y = (window.innerHeight - height) / 2 - rect.top;

    const target = clone;
    requestAnimationFrame(() => {
      backdrop?.classList.add('is-active');
      target.style.transition = reduceMotion() ? 'none' : 'transform 440ms var(--ease-smooth-out)';
      target.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    });
  };

  images.forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Enlarge image: ${img.alt}`);
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      open(img);
    });
  });

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };
  document.addEventListener('keydown', onKey);

  cleanups.push(() => {
    document.removeEventListener('keydown', onKey);
    finish();
  });
}

// ── Videos: play muted while on screen, pause when not; the viewer can always pause ──
function initVideos(page: HTMLElement, cleanups: Cleanup[]) {
  page.querySelectorAll<HTMLElement>('[data-cs-video]').forEach((figure) => {
    const video = figure.querySelector<HTMLVideoElement>('[data-cs-video-el]');
    const toggle = figure.querySelector<HTMLButtonElement>('[data-cs-video-toggle]');
    const bar = figure.querySelector<HTMLElement>('[data-cs-video-progress]');
    if (!video || !toggle) return;

    // With reduced motion nothing autoplays; the viewer presses play
    let heldByViewer = reduceMotion();

    const sync = () => {
      const playing = !video.paused;
      figure.toggleAttribute('data-playing', playing);
      toggle.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    };
    const onTime = () => {
      if (bar && video.duration) bar.style.transform = `scaleX(${video.currentTime / video.duration})`;
    };

    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('timeupdate', onTime);

    toggle.addEventListener('click', () => {
      if (video.paused) {
        heldByViewer = false;
        video.play().catch(() => {});
      } else {
        heldByViewer = true;
        video.pause();
      }
    });

    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }
        if (!heldByViewer) video.play().catch(() => {});
      },
      { threshold: 0.4 }
    );
    observer.observe(figure);

    cleanups.push(() => {
      observer.disconnect();
      video.pause();
    });
  });
}

// ── Before/after: the range input drives the divider position ──
function initCompare(page: HTMLElement) {
  page.querySelectorAll<HTMLElement>('[data-cs-compare-stage]').forEach((stage) => {
    const range = stage.querySelector<HTMLInputElement>('[data-cs-compare-range]');
    if (!range) return;
    const update = () => stage.style.setProperty('--pos', `${range.value}%`);
    range.addEventListener('input', update);
    update();
  });
}

// ── Annotated screenshot: a point and its legend row highlight together ──
function initAnnotated(page: HTMLElement) {
  page.querySelectorAll<HTMLElement>('[data-cs-annotated]').forEach((group) => {
    const items = [...group.querySelectorAll<HTMLElement>('[data-cs-point]')];
    let pinned: string | null = null;

    const show = (index: string | null) => {
      items.forEach((el) => el.classList.toggle('is-active', index !== null && el.dataset.csPoint === index));
    };

    items.forEach((el) => {
      const index = el.dataset.csPoint ?? null;
      el.addEventListener('pointerenter', () => show(index));
      el.addEventListener('pointerleave', () => show(pinned));
      el.addEventListener('focus', () => show(index));
      el.addEventListener('blur', () => show(pinned));
      // A tap pins the pair so it stays highlighted on touch screens
      el.addEventListener('click', () => {
        pinned = pinned === index ? null : index;
        show(pinned);
      });
    });
  });
}

// ── Gallery: drag to scroll the row of screens (touch and keys work on their own) ──
function initGallery(page: HTMLElement, cleanups: Cleanup[]) {
  const tracks = [...page.querySelectorAll<HTMLElement>('[data-cs-gallery-track]')];
  if (tracks.length === 0) return;

  // The strip runs the full width of the page, so it has to know how much of
  // that width the scrollbar takes, or the page would scroll sideways
  const measureScrollbar = () => {
    const width = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar', `${Math.max(0, width)}px`);
  };
  measureScrollbar();
  window.addEventListener('resize', measureScrollbar);
  cleanups.push(() => window.removeEventListener('resize', measureScrollbar));

  tracks.forEach((track) => {
    // The caption names only the screen in front of you, sliding as you scroll
    const figure = track.closest('.cs-gallery');
    const labels = [...(figure?.querySelectorAll<HTMLElement>('[data-cs-gallery-label]') ?? [])];
    const counter = figure?.querySelector<HTMLElement>('[data-cs-gallery-index]');
    const items = [...track.children] as HTMLElement[];
    const steps = [...(figure?.querySelectorAll<HTMLButtonElement>('[data-cs-gallery-step]') ?? [])];
    const dots = [...(figure?.querySelectorAll<HTMLButtonElement>('[data-cs-gallery-dot]') ?? [])];
    let current = -1;

    const setCurrent = (index: number) => {
      if (index === current || index < 0) return;
      current = index;
      labels.forEach((label, i) => {
        label.classList.toggle('is-current', i === index);
        label.classList.toggle('is-past', i < index);
      });
      if (counter) counter.textContent = String(index + 1);
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-current', i === index);
        dot.setAttribute('aria-current', String(i === index));
      });
      const end = track.scrollWidth - track.clientWidth;
      // When everything already fits, position controls have nothing to say
      figure?.classList.toggle('is-static', end < 40);
      steps.forEach((step) => {
        const back = Number(step.dataset.csGalleryStep) < 0;
        step.disabled = back ? track.scrollLeft < 4 : track.scrollLeft >= end - 4;
      });
    };

    // A dot jumps straight to its screen
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        items[index]?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
      });
    });

    // The arrows move one screen at a time; scrollIntoView respects scroll-padding
    steps.forEach((step) => {
      step.addEventListener('click', () => {
        const next = items[Math.min(items.length - 1, Math.max(0, current + Number(step.dataset.csGalleryStep)))];
        next?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
      });
    });

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        // Whichever screen sits closest to where the strip starts is the one being read
        const startEdge = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft || '0');
        let best = 0;
        let bestDistance = Infinity;
        items.forEach((item, index) => {
          const distance = Math.abs(item.getBoundingClientRect().left - startEdge);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = index;
          }
        });
        setCurrent(best);
      });
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    setCurrent(0);
    // Ends of the strip can only be judged once the images have their size
    const settle = setTimeout(() => {
      current = -1;
      onScroll();
    }, 400);
    cleanups.push(() => {
      track.removeEventListener('scroll', onScroll);
      clearTimeout(settle);
    });

    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      down = true;
      moved = false;
      startX = event.clientX;
      startLeft = track.scrollLeft;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!down) return;
      const dx = event.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        track.classList.add('is-dragging');
        track.setPointerCapture(event.pointerId);
      }
      if (moved) track.scrollLeft = startLeft - dx;
    };

    const onPointerUp = () => {
      down = false;
      track.classList.remove('is-dragging');
    };

    // A drag should not open the image it finished on
    const onClick = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    };

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);
    track.addEventListener('click', onClick, true);

    cleanups.push(() => {
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', onPointerUp);
      track.removeEventListener('pointercancel', onPointerUp);
      track.removeEventListener('click', onClick, true);
    });
  });
}

// ── System map: hovering a box lights up what it talks to ──
function initSystemMap(page: HTMLElement) {
  page.querySelectorAll<HTMLElement>('[data-cs-map]').forEach((map) => {
    const nodes = [...map.querySelectorAll<SVGGElement>('[data-cs-map-node]')];
    const edges = [...map.querySelectorAll<SVGPathElement>('[data-cs-map-edge]')];

    const light = (id: string | null) => {
      edges.forEach((edge) => {
        const [from, to] = (edge.dataset.csMapEdge ?? '').split('|');
        edge.classList.toggle('is-lit', id !== null && (from === id || to === id));
      });
      nodes.forEach((node) => {
        const own = node.dataset.csMapNode;
        const linked =
          id !== null &&
          (own === id ||
            edges.some((edge) => {
              const [from, to] = (edge.dataset.csMapEdge ?? '').split('|');
              return (from === id && to === own) || (to === id && from === own);
            }));
        node.classList.toggle('is-lit', linked);
      });
    };

    nodes.forEach((node) => {
      const id = node.dataset.csMapNode ?? null;
      node.addEventListener('pointerenter', () => light(id));
      node.addEventListener('focus', () => light(id));
      node.addEventListener('pointerleave', () => light(null));
      node.addEventListener('blur', () => light(null));
    });
  });
}
