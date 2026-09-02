---
name: lisse-smooth-corners
description: Figma-grade organic squircle corner smoothing using @lisse/core and @lisse/react. Use when applying corner smoothing to any rounded container, card, image frame, mockups, or UI surface that is not fully rounded (non-capsule). Triggers on "squircle", "smooth corners", "lisse", "corner smoothing", "figma radius", "superellipse", "smooth rounded borders".
---

# Lisse Smooth Corners (Squircle Geometry)

Standard CSS `border-radius` creates circular arcs that introduce abrupt curvature changes (tangent G0/G1 discontinuity) where straight edges meet curves. 
**Lisse** computes Figma and iOS-grade squircle curves (cubic shoulder + central arc + cubic shoulder) with continuous G2/G1 transitions, producing organic, tactile UI surfaces.

---

## When to Apply Lisse

| Element Type | Target Radius | Smoothing | Curve | Attribute / Prop |
| :--- | :--- | :--- | :--- | :--- |
| **Product Shot Cards** (`.shot`) | `12px` | `0.65` | `squircle` | `data-lisse="12"` |
| **Device & Phone Frames** (`.shot__phone-frame`) | `14px` | `0.65` | `squircle` | `data-lisse="14"` |
| **Masonry & Gallery Tiles** (`.design-tile`) | `10px` | `0.65` | `squircle` | `data-lisse="10"` |
| **Content Cards & Modals** | `12px`–`16px` | `0.65` | `squircle` | `data-lisse="16"` |
| **Micro Surfaces / Compact Boxes** | `6px`–`8px` | `0.60` | `squircle` | `data-lisse="8"` |
| **Pills & Capsule Badges (`rounded-full`)** | `9999px` | *N/A* | *Skip* | Standard `border-radius: 9999px` |

> [!IMPORTANT]
> **Pill Exclusion Rule**: Never apply Lisse to capsule badges, sliding tab pills, or 9999px buttons. Lisse is specifically designed for rectangular containers, cards, and framed surfaces that have distinct corners.

---

## Implementation Patterns

### 1. Astro & HTML Components (`src/utils/lisse.ts`)
Add `data-lisse="<radius>"` or `data-lisse='{"radius": 14, "smoothing": 0.65}'` to any container:

```astro
---
// In your Astro component
---
<div class="shot" data-lisse="12">
  <img src={image} alt={title} class="shot__img" />
</div>

<script>
  import { initLisse } from '../utils/lisse';
  initLisse();
  document.addEventListener('astro:page-load', initLisse);
</script>
```

### 2. React Components (`@lisse/react`)
Use `<SmoothCorners>` or `useSmoothCorners`:

```tsx
import { SmoothCorners, useSmoothCorners } from '@lisse/react';

// Drop-in component
export function ProjectCard({ children }) {
  return (
    <SmoothCorners
      as="div"
      corners={{ radius: 12, smoothing: 0.65 }}
      className="shot"
    >
      {children}
    </SmoothCorners>
  );
}

// Or via ref hook
export function CustomFrame() {
  const frameRef = useRef<HTMLDivElement>(null);
  useSmoothCorners(frameRef, { radius: 14, smoothing: 0.65 });
  return <div ref={frameRef} className="shot__phone-frame" />;
}
```

---

## Technical Details & Best Practices
1. **Fallback Radius**: Always keep standard CSS `border-radius` on the class in stylesheets as an SSR / no-JS fallback.
2. **Resize Observer**: `@lisse/core` automatically recomputes clip-paths on responsive breakpoint changes and tab switches.
3. **Overflow Handling**: Ensure clipped containers have `overflow: hidden` so nested child elements conform to the squircle perimeter.
