import { generateClipPath, FIGMA_SMOOTHING, APPLE_SMOOTHING } from '@lisse/core';

export interface LisseOptions {
  radius: number;
  radiusMobile?: number;
  smoothing?: number;
  curve?: 'squircle' | 'superellipse' | 'clothoid' | 'arc';
  preserveSmoothing?: boolean;
}

const observedElements = new WeakSet<HTMLElement>();
let globalResizeObserver: ResizeObserver | null = null;
const elementOptionsMap = new WeakMap<HTMLElement, LisseOptions>();

function updateElementClipPath(el: HTMLElement) {
  const options = elementOptionsMap.get(el);
  if (!options) return;

  const width = el.offsetWidth;
  const height = el.offsetHeight;
  if (width <= 0 || height <= 0) return;

  // Responsive mobile radius handling
  let targetRadius = options.radius;
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 640 || width < 180);

  if (isMobile && options.radiusMobile) {
    targetRadius = options.radiusMobile;
  } else if (targetRadius > 12 && width < 260) {
    // Dynamically scale down large radii on narrow mobile containers (~10.5% of width)
    targetRadius = Math.min(targetRadius, Math.max(8, Math.round(width * 0.105)));
  }

  try {
    const clipPath = generateClipPath(width, height, {
      radius: targetRadius,
      smoothing: options.smoothing ?? 0.65,
      curve: options.curve ?? 'squircle',
      preserveSmoothing: options.preserveSmoothing ?? true,
    });
    // Clear CSS border-radius so the browser does not intersect/truncate the squircle shoulders
    el.style.borderRadius = '0px';
    el.style.clipPath = clipPath;
  } catch (e) {
    console.warn('[Lisse] Failed to generate clip path:', e);
  }
}

export function applyLisseToElement(el: HTMLElement, options: LisseOptions) {
  elementOptionsMap.set(el, options);
  updateElementClipPath(el);

  if (!globalResizeObserver && typeof ResizeObserver !== 'undefined') {
    globalResizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target instanceof HTMLElement) {
          updateElementClipPath(entry.target);
        }
      }
    });
  }

  if (globalResizeObserver && !observedElements.has(el)) {
    globalResizeObserver.observe(el);
    observedElements.add(el);
  }
}

/**
 * Scans the DOM for all elements tagged with `data-lisse` and applies
 * Figma-grade squircle continuous corner smoothing via @lisse/core.
 */
export function initLisse() {
  if (typeof window === 'undefined') return;

  const elements = document.querySelectorAll<HTMLElement>('[data-lisse]');
  elements.forEach((el) => {
    const raw = el.getAttribute('data-lisse');
    let opts: LisseOptions = { radius: 12, smoothing: APPLE_SMOOTHING };

    if (raw) {
      if (!isNaN(Number(raw))) {
        opts = { radius: Number(raw), smoothing: APPLE_SMOOTHING };
      } else {
        try {
          opts = JSON.parse(raw);
        } catch {
          opts = { radius: 12, smoothing: APPLE_SMOOTHING };
        }
      }
    }
    applyLisseToElement(el, opts);
  });
}
