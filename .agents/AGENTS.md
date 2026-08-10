# Portfolio2 — Agent Rules

## Skill Routing

When working on this portfolio project, use the following skills in these contexts:

### `emil-design-eng` (Emil Kowalski)
Use when **reviewing or critiquing** UI components. This is the design taste layer.
- Invoke for: "review this component", "critique the UI", "does this feel right?", "apply design engineering principles"
- Output format: **Before/After/Why markdown table** (required by the skill)
- Key rules: never animate from scale(0), never use `transition: all`, gate hover behind `@media (hover: hover)`, add `:active` press feedback on all pressable elements

### `transitions-dev`
Use when **adding new transitions or animations** to components that don't have them yet.
- Invoke for: "add a transition", "animate this", "make the modal slide", "add a hover effect", "stagger these items"
- This is the *creation* skill — use it to implement motion from scratch

### `transitions-polish`
Use when **refining existing motion** that already works but feels off.
- Invoke for: "polish the timing", "the animation feels janky", "tune the easing", "tighten the stagger", "align to motion tokens"
- This is the *tuning* skill — use it to adjust what already animates

### `grill-me` (Matt Pocock)
This skill is **slash-command only** (`disable-model-invocation: true`).
- The user must type `/grill-me` in chat to activate it
- Do NOT attempt to invoke this skill programmatically

## Skill Composition
When the user asks to "polish" or "improve" a component holistically:
1. **First** run `emil-design-eng` to produce a Before/After/Why critique table
2. **Then** apply fixes using `transitions-polish` for motion and direct CSS edits for visual identity
3. Never use `transitions-dev` if the component already has animations — use `transitions-polish` instead

## Design Identity
This portfolio uses the **benji.org + ana.sh editorial hybrid skin**:
- Canvas: `#0D0D0D` (pure neutral matte black)
- Headings: `#FFFFFF`, `letter-spacing: -0.05em`, `font-weight: 600`
- Body: `#999999` (neutral silver)
- Borders: `rgba(255, 255, 255, 0.06)` hair-line
- Max border-radius: `6px` (4px for inner elements)
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` (Emil's strong ease-out)
- No drop shadows, no gradients, no blurs on surfaces
- No `transition: all` — always specify exact properties
