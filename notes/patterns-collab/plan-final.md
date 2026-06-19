# plan-final.md — Three Patterns Animation Spec (Implementation-ready)

Single source of truth. The engineer should not need to open plan-v1, plan-v2, or
either CD pass to ship this. All sign-off conditions from `cd-pass-2.md` are
applied. Copy is locked verbatim. Timings, easings, and color values are absolute.

Target file: `components/sections/Solution.tsx` (the `PatternsBlock`, `Thread`,
`PatternCard`, `IntakeVisual`, `SessionVisual`, `MemoryVisual` regions — replaced
in their entirety). Companion CSS: `app/globals.css` (additive keyframes only;
existing tokens reused).

---

## 1. Concept

The metaphor is **Absorption**. Chronilogix coaches the way ink absorbs into
paper — slowly, on the paper's terms, shaped by what was already there. Three
cream plates in a clinical journal, each showing one act of absorption in warm
brand-orange ink: a first drop that becomes a specific person; drops that arrive,
are held in silence, fade to ghosts; drops that accumulate over time into a
single deepened stain.

---

## 2. Section-level spec

### 2.1 Container spacing

Replace the existing wrapper class on `PatternsBlock`'s outer `<div>`:

```tsx
// from: <div ref={ref} className="mt-24 md:mt-32 lg:mt-36">
//   to:
<div className="mt-32 md:mt-40 lg:mt-48">
```

The closing line `"This is what makes it coaching, not chat."` takes `mt-16 md:mt-20`
above it, and the parent `<section>` bottom padding is updated to
`pb-32 md:pb-40 lg:pb-48` so the section is symmetrically silent above and below
(matching the new `mt-32 md:mt-40 lg:mt-48` top gap). The current asymmetry
would leak this section into whatever follows it; the new values close that leak.

The section-level `useInView` on `PatternsBlock` is removed entirely (see 2.3).
The `h3` and intro paragraph get their own observer at the block level
(`threshold: 0.2, rootMargin: "0px 0px -10% 0px"`). Each `PatternCard` gets its
own observer.

### 2.2 Card plate — cream-on-cream, hairline

Replace the existing `bg-white` on the card visual container:

```tsx
// container of the SVG canvas inside PatternCard
<div
  className={`${col} relative aspect-[3/4] overflow-hidden rounded-2xl bg-paper-warm lg:row-start-1`}
  style={{
    boxShadow: "inset 0 0 0 1px rgba(15, 12, 10, 0.06)",
  }}
>
```

Rules:
- Background: `bg-paper-warm` (same cream as the surrounding section).
- Border: `inset 0 0 0 1px rgba(15, 12, 10, 0.06)` via `box-shadow` (renders as a
  true hairline, no anti-alias artifacts at the radius).
- **No outer `box-shadow`**, no `drop-shadow`, no rounded glow.
- A shared **paper grain wash** layered as the topmost child of each card (above
  the SVG, below the absolutely-positioned text). Use a single inline SVG
  `feTurbulence` (no raster image; keeps the build asset-free):

```tsx
<svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply opacity-[0.05]">
  <filter id="paperGrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" stitchTiles="stitch"/></filter>
  <rect width="100%" height="100%" filter="url(#paperGrain)"/>
</svg>
```

This one filter id (`paperGrain`) lives once at the section level inside a single
hidden `<svg>` near the top of `PatternsBlock`, and each card re-uses it via
`filter="url(#paperGrain)"`. See §7.

### 2.3 Per-card stagger

Kill the section-wide `inView` that currently fires all three cards. Each
`PatternCard` calls `useInView<HTMLElement>(0.25)` on its outermost `<article>`,
with `rootMargin: "0px 0px -8% 0px"` on desktop, `0.45` threshold on viewports
`< md`.

Within a card, after the card's own `inView` flips true:
- Visual canvas reveals at t=0 (its internal animation begins; see per-card timelines).
- Icon + eyebrow row reveals at t=+120ms (blur 3 → 0, opacity 0 → 1, 600ms ease-out-quart).
- Title at t=+220ms (translateY 16 → 0, 900ms ease-out-expo + opacity 700ms ease-out-quart).
- Body at t=+320ms (same easing as title).

The `h3` headline + intro paragraph use the block-level observer and animate
once, before any card visual enters.

### 2.4 Connective tissue — replace `<Thread>`

Kill the existing `Thread` component (the traveling pulse-dot, the right-edge
tick marks, the rocket trail). Replace with a single hairline horizontal divider
that lives between row 1 (visual) and row 2 (eyebrow) of the desktop grid:

```tsx
function PatternsDivider({ inView }: { inView: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none hidden lg:col-start-1 lg:col-end-4 lg:row-start-2 lg:my-5 lg:block lg:self-center"
    >
      <span
        className="block h-px w-full origin-left bg-ink/10"
        style={{
          transform: `scaleX(${inView ? 1 : 0})`,
          transition: "transform 1300ms var(--ease-out-expo) 280ms",
        }}
      />
    </div>
  );
}
```

- `inView` here is bound to the **first card's** observer (so the line draws when
  the act starts, not when the page loads).
- Mobile (`< lg`): the line is hidden entirely. Cards stack with the existing
  `gap-y-10 md:gap-y-12` rhythm.
- No drop markers, no pulse-dot, no trailing right-edge ticks. Drop the
  `PULSE_DELAY_S`, `PULSE_CYCLE_S`, `ICON_PULSE_DELAYS_S` constants. Drop the
  `iconPulseRing` animation usage on the eyebrow icons — the icons stay static.

### 2.5 Mobile orchestration

- Threshold raised to `0.45` for `< md` viewports (each card must be substantially
  in view before animating; prevents slot-machine triple-fire on a fast scroll).
- Card 2's hold/gap timings (1.6s + 800ms) are **unchanged** on mobile — they are
  the defining beat of the section. The card is still finite (2 cycles), still
  hover-replay only. Hover doesn't exist on touch; mobile readers get one shot
  per page load. That is intentional.
- The `PatternsDivider` is hidden below `lg`.

### 2.6 Reduced motion — explicit per card

Wrap every animation declaration in a `prefersReducedMotion()` check. Each card
exposes a `prefersReducedMotion` boolean (read from
`window.matchMedia('(prefers-reduced-motion: reduce)').matches`, hydrated in a
`useEffect`). When true:

- **Card 1**: bloom rendered fully formed at final scale; outline path stroked at
  `stroke-dashoffset: 0`; both phrases visible at opacity 1; drop and ripple not
  rendered.
- **Card 2**: both stages composited at once — bloom A as ghost (5% ink filled
  silhouette), bloom B at full saturation, Q1 muted (30% opacity), Q2 at full
  opacity. No drop, no ripple, no cycle.
- **Card 3**: three blooms rendered at their final positions/sizes/saturations,
  multiply blend applied, overlap outline stroked at 0, all three phrases visible,
  the *today* timestamp visible on bloom 3 only. No drop animations.

The shared `@media (prefers-reduced-motion: reduce)` block in `globals.css`
(see §6) also disables every new keyframe defensively.

### 2.7 Accessibility

- Every SVG in all three cards: `aria-hidden="true"`. The illustrations are
  decorative.
- Patient-voice phrases, MI questions, and margin notes live inside `aria-hidden`
  containers as well — they are illustrative placeholders, not informational.
  Exposing them in reading order would mislead a screen-reader user into thinking
  they were quotes from a named patient.
- The card outer container becomes `<article aria-labelledby={titleId}>`. The
  card title (currently a `<p>`) is promoted to `<h4 id={titleId}>` with class
  matching the existing `<p>` styles (so visual output is unchanged). Reading
  order per card: H4 title → body paragraph. Eyebrow stays a sibling `<span>`
  outside the labelled-by relationship.
- No interactive elements in the cards. Hover-to-replay is hover-only; do **not**
  bind keyboard focus to replay (the visual would never reach a non-mouse user
  in a meaningful way and a focus-driven replay would surprise them).
- Contrast: ink (`#0F0C0A`) on `bg-paper-warm` clears WCAG AA at body sizes.
  `text-brand-700` on cream clears AA at 11px for the *today* timestamp on Card 3.
- The `PatternsDivider` is `aria-hidden`.

---

## 3. Card 1 — Intake — final spec

**One-line headline of what this card is:**
*One drop of ink lands on the page and resolves into a specific person — the
first thing Chronilogix learns about you, before any advice.*

**Locked patient-voice phrases (from cd-pass-2 §4):**

```ts
const INTAKE_PHRASES = [
  "I cook for my mother.",          // ships
  "Mornings are the good hours.",   // ships
  "My dad had the same thing.",     // held in reserve; copy may swap either slot
] as const;
```

Ship slots 0 and 1. Slot 2 is exported in the constant so copy can swap a slot
without code churn.

### Canvas at rest

Cream `bg-paper-warm` plate (already specified in §2.2). One hairline horizontal
at `rgba(15, 12, 10, 0.12)` ("ink/12") spanning the canvas at `y = 70%` of the
viewBox — the "paper surface" line. Top-left, inside the canvas at `(14, 22)`:
serif italic label `01` in `text-ink-muted/70` (`#6B655F` at ~70%), `Newsreader
italic 12px`. No drop visible. No dashed perimeter ring. No outline.

### DOM / SVG sketch

```tsx
<div className="absolute inset-0">
  <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid meet" aria-hidden className="absolute inset-0 h-full w-full">
    <defs>
      <radialGradient id="ink-1" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#F9904D" stopOpacity="1"/>
        <stop offset="55%"  stopColor="#FF7434" stopOpacity="0.92"/>
        <stop offset="100%" stopColor="#F9904D" stopOpacity="0.06"/>
      </radialGradient>
      <filter id="bleed-1" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="noise"/>
        <feDisplacementMap in="blur" in2="noise" scale="14" result="rough">
          <animate attributeName="scale" from="14" to="6" dur="700ms" begin="1700ms" fill="freeze"/>
        </feDisplacementMap>
      </filter>
    </defs>

    {/* surface line */}
    <line x1="0" y1="168" x2="200" y2="168" stroke="rgba(15,12,10,0.12)" strokeWidth="1"/>

    {/* falling drop (CSS animated) */}
    <circle className="card1-drop" cx="100" cy="168" r="3.5" fill="#FF7434"/>

    {/* impact ring */}
    <circle className="card1-ripple" cx="100" cy="168" r="2" fill="none" stroke="#F9904D" strokeWidth="1" strokeOpacity="0.5"/>

    {/* bloom — scale animated via CSS on the <g>, filter does the edge */}
    <g className="card1-bloom" style={{ transformOrigin: "100px 168px" }} filter="url(#bleed-1)">
      <circle cx="100" cy="168" r="46" fill="url(#ink-1)"/>
    </g>

    {/* pre-baked outline path — hand-tuned to roughly trace the displaced edge */}
    <path
      className="card1-outline"
      d="M 56 168 C 52 150 70 130 96 128 C 122 126 144 142 144 164 C 146 188 124 206 100 206 C 74 208 60 188 56 168 Z"
      stroke="#B5511A" strokeOpacity="0.45" strokeWidth="1" fill="none"
      pathLength="600" strokeDasharray="600" strokeDashoffset="600"
    />
  </svg>

  {/* serif label 01 */}
  <span className="absolute left-[7%] top-[9%] font-serif italic text-[12px] text-ink-muted/70">01</span>

  {/* paper grain wash */}
  <PaperGrain/>

  {/* two phrases, absolutely positioned, with hairline connectors */}
  <PhraseTag style={{ top: "44%", left: "8%"  }} text={INTAKE_PHRASES[0]} connectorTo="right"/>
  <PhraseTag style={{ top: "82%", right: "8%" }} text={INTAKE_PHRASES[1]} connectorTo="left" />
</div>
```

`PhraseTag` is `Newsreader italic 13px text-ink`, max-width `18ch`,
line-height 1.25, with a 1px `rgba(15,12,10,0.20)` connector line that runs
from the tag's nearest edge to a point on the bloom rim. Connector length is
fixed at 32px (no math at runtime; the tag positions are hand-picked so the
connector visually lands on the bloom edge).

### Animation timeline

| t (ms) | element       | what changes                                              | duration | easing            |
|-------:|---------------|-----------------------------------------------------------|---------:|-------------------|
|      0 | drop          | translateY −36 → 0, opacity 0 → 1 (no scale compress)     |     820  | ease-out-expo     |
|    820 | drop          | opacity 1 → 0 (drop absorbed)                             |     180  | ease-out-quart    |
|    820 | ripple        | r=2 → r=22, opacity 0.5 → 0                               |     320  | ease-out-quart    |
|    820 | bloom         | transform: scale(0.1) → scale(1)                          |    1100  | ease-out-expo     |
|   1700 | bloom edge    | feDisplacementMap scale 14 → 6 (edge sharpens)            |     700  | linear (SMIL)     |
|   2000 | phrase 1      | blur(4) opacity 0.12 → blur(0) opacity 1; connector draws |     600  | ease-out-quart    |
|   2400 | phrase 2      | same as phrase 1, mirrored                                |     600  | ease-out-quart    |
|   3000 | outline path  | stroke-dashoffset 600 → 0                                 |     800  | ease-out-expo     |
|   3400 | (settle)      | hold; no breathing, no pulse                              |        — | —                 |

**Order is sacred (CD pass-2 §3 Card 1):** phrases attach to the still-soft
bloom — phrase 1 lands at t=2000 while the edge is still mid-interpolation from
14 → 6 (which completes at t=2400). The outline traces *after* both phrases
have landed, not before. If the outline ever animates before t≥3000 the card
reads "we drew a shape, then labeled it" instead of "ink became a person." Source
comment required at the outline element:
`// Outline traces LAST. Phrases attach while bloom is still soft. Do not reorder.`

### Loop behavior

Plays exactly once per page load on the card's own `inView`. Replays on hover
via a `replayKey: number` state that bumps and is applied as `key` on the inner
animating `<g>` (NOT the whole SVG — re-mounting the `<defs>` flickers the
filter). Never auto-loops, never time-based.

### Color values (hex)

- Ink core: `#F9904D` (brand-600)
- Ink rim: `#FF7434` (brand-700)
- Ink edge alpha: `rgba(249, 144, 77, 0.06)`
- Outline stroke: `#B5511A` at 45% opacity
- Surface line: `rgba(15, 12, 10, 0.12)`
- Phrase text: `#0F0C0A` (text-ink)
- Connector: `rgba(15, 12, 10, 0.20)`
- `01` label: `text-ink-muted` at 70% (`#6B655F` @ 0.7)

### Reduced-motion final state

Bloom rendered at scale 1 with `feDisplacementMap scale="6"` baked in (no
animate element). Outline path `stroke-dashoffset="0"`. Both phrases and their
connectors at opacity 1. No drop, no ripple in the DOM (render conditionally).

### Anti-patterns (forbidden)

- Donut / radar / spider chart / brain icon / wireframe head.
- Tag cloud (more than two phrases at any time).
- Checkbox checkmarks.
- Dashed perimeter ring.
- Breathing pulse after settle.
- Drop scale-compress on impact (1 → 0.85). Translate-only fall.

---

## 4. Card 2 — Reflection — final spec

**One-line headline:**
*A question arrives, is held in silence, fades to a ghost. A second question
arrives and stays. The card resolves; it does not run forever.*

**Locked questions (cd-pass-2 §4):**

```ts
const REFLECTION_QUESTIONS = [
  "What made that possible?",
  "What does that say about you?",
] as const;
```

Render only these two. They are the coach's open questions, not the patient's
words. No exclamation, no softener, no name.

### Canvas at rest

Cream plate, `bg-paper-warm`. Hairline surface line at `y=168` (same y as Cards
1 and 3) at ink/12. Top-left `02` label, same styling as Card 1. **Intent
signal:** a 1px hairline arc at ink/08 — a 30%-chord arc 14px wide, sitting at
`(16, 168)` (where the surface line meets the canvas left margin). It says "this
page has been touched once before" without being a tell. Source comment:
`// Intent signal at rest. Less than a tell, more than nothing.`

```tsx
<path d="M 8 168 a 14 14 0 0 1 14 -3" stroke="rgba(15,12,10,0.08)" strokeWidth="1" fill="none"/>
```

No pre-existing ghost. No drop visible. Stage = 0.

### DOM / SVG sketch

```tsx
<svg viewBox="0 0 200 240" aria-hidden data-stage={stage} className="absolute inset-0 h-full w-full">
  <defs>
    <radialGradient id="ink-2">{/* same stops as ink-1 */}</radialGradient>
    <filter id="bleed-2"><!-- same rig as bleed-1, seed=7, scale=10 (static) --></filter>
  </defs>

  <line x1="0" y1="168" x2="200" y2="168" stroke="rgba(15,12,10,0.12)" strokeWidth="1"/>
  <path className="intent-arc" d="M 8 168 a 14 14 0 0 1 14 -3" stroke="rgba(15,12,10,0.08)" strokeWidth="1" fill="none"/>

  {/* Position A — left 32%, surface */}
  <g className="bloom-A" data-active={stage >= 1} style={{ transformOrigin: "64px 168px" }}>
    <circle className="drop-A" cx="64" cy="168" r="3.5" fill="#FF7434"/>
    <g className="bloom-A-fill" filter="url(#bleed-2)">
      <circle cx="64" cy="168" r="38" fill="url(#ink-2)"/>
    </g>
  </g>

  {/* Position B — right 58%, 6% above A → y=153 */}
  <g className="bloom-B" data-active={stage >= 2} style={{ transformOrigin: "116px 153px" }}>
    <circle className="drop-B" cx="116" cy="153" r="3.5" fill="#FF7434"/>
    <g className="bloom-B-fill" filter="url(#bleed-2)">
      <circle cx="116" cy="153" r="38" fill="url(#ink-2)"/>
    </g>
  </g>
</svg>

{/* Margin notes — HTML overlay, mounted per stage */}
{stage >= 1 && <MarginNote side="right" anchor={{x:"32%",y:"70%"}} text={REFLECTION_QUESTIONS[0]} muted={stage===2}/>}
{stage === 2 && <MarginNote side="left"  anchor={{x:"58%",y:"64%"}} text={REFLECTION_QUESTIONS[1]} muted={false}/>}
```

Margin notes: `Newsreader italic 19px md:21px text-ink`, max-width `18ch`,
line-height 1.25. Sits **beside** the bloom (not inside it). A 1px ink/20
hairline (32px long) connects the bloom edge tangent to the text's first
baseline. When `muted` is true, the note opacity drops to 30% — joining the
paper, not disappearing.

### Animation timeline

| t (ms)  | element            | what                                                                | duration | easing          |
|--------:|--------------------|---------------------------------------------------------------------|---------:|-----------------|
|       0 | drop-A             | translateY −36 → 0, opacity 0 → 1                                   |     280  | ease-out-soft   |
|     280 | bloom-A-fill       | scale 0.1 → 1                                                       |     700  | ease-out-expo   |
|     620 | drop-A             | opacity 1 → 0                                                       |     180  | ease-out-quart  |
|     980 | margin-note Q1     | blur(3) opacity 0.12 → blur(0) opacity 1; connector draws           |     600  | ease-out-quart  |
|  **1580** | **hold (full sat)** | **bloom-A at full saturation, Q1 at opacity 1. No motion.**         | **1600** | —               |
|    3180 | bloom-A-fill       | opacity 1 → 0.05, filter saturate(1) → saturate(0.3)                |     900  | ease-out-quart  |
|    3180 | margin-note Q1     | opacity 1 → 0.30                                                    |     900  | ease-out-quart  |
|    4080 | (ghost set)        | bloom-A is now a 5% ink filled silhouette; Q1 at 30% opacity        |        — | —               |
|  **4080** | **gap (silence)**  | **800ms of literal nothing on the canvas. Indistinguishable from a paused tab.** | **800** | —          |
|    4880 | drop-B             | translateY −36 → 0, opacity 0 → 1                                   |     280  | ease-out-soft   |
|    5160 | bloom-B-fill       | scale 0.1 → 1                                                       |     700  | ease-out-expo   |
|    5500 | drop-B             | opacity 1 → 0                                                       |     180  | ease-out-quart  |
|    5860 | margin-note Q2     | blur(3) opacity 0.12 → blur(0) opacity 1; connector draws           |     600  | ease-out-quart  |
|  **6460** | **hold (final)**   | **bloom-B at full saturation, Q2 at opacity 1. Bloom-A stays ghost. Card resolves here.** | **1600** (visual hold; no timer expires) | — |
|    8060 | (settle)           | Static final state. No further animation.                            |        — | —               |

Total runtime ≈ 8.06s.

**The 1.6s hold and the 800ms gap are load-bearing.** Source comments required
at the hold and the gap:
`// Silence is content. Do not shorten. Do not fill.`

**During the 800ms gap, the canvas is silent, not blank.** The surface line,
the intent arc, the `02` label, the paper grain, and the ghost of bloom-A
(5% ink filled silhouette) and muted Q1 (30% opacity) all remain rendered.
What stops is *new motion* — no drop, no bloom, no fade. An engineer reading
"800ms of literal nothing" must not helpfully hide the static page elements;
those static elements are what makes the silence read as a held page rather
than an empty viewport.

### Loop behavior

Plays once on card-level `inView`. Replays on hover via `replayKey` bump.
**No 20s idle auto-replay** (cd-pass-2 §2.3 — killed). On scroll-out the
animation pauses (`animation-play-state: paused` via IntersectionObserver
threshold 0). On scroll-in, it holds at its settled state — does not re-trigger.

### Color values

- Ink, surface line, label, connector: same as Card 1.
- Margin note text: `#0F0C0A` (text-ink), muted state: `rgba(15, 12, 10, 0.30)`.
- Ghost silhouette: bloom rendered at opacity 0.05, filter saturate(0.3) — this
  produces a 4–6% ink filled silhouette on cream, no outline (CD pass-2: not
  1%, not a hairline; ghost has body).
- Intent arc: `rgba(15, 12, 10, 0.08)`.

### Reduced-motion final state

Render stage 2 directly: bloom-A as ghost (opacity 0.05, saturate 0.3), Q1 at
30% opacity, bloom-B at full saturation, Q2 at full opacity, surface line, intent
arc, both connectors visible. No drop, no ripple, no idle arc transition.

### Anti-patterns

- Chat bubbles, speech-bubble grid.
- Floating AI orb.
- Typewriter effect on the question text.
- Carousel / slideshow / `setInterval` cycling.
- Pulse / breathing / shimmer during the 1.6s hold or the 800ms gap.
- Q1 fully disappearing during the absorb (it goes muted, not gone).
- More than two cycles per `inView`.
- Backdrop blur, glassmorphism.

---

## 5. Card 3 — Continuity — final spec

**One-line headline:**
*Three drops accumulate over weeks — not seconds — into a single deepened stain.
Time is read off position, not off a baseline.*

**Locked margin-note phrases (cd-pass-2 §4):**

```ts
const CONTINUITY_NOTES = [
  { when: "Six weeks ago", text: "Sundays are the hardest." }, // bloom 1
  { when: "Last week",     text: "Cooking grounds me."       }, // bloom 2
  { when: "Today",         text: "I cooked on Sunday."       }, // bloom 3
] as const;
```

Alternate "Millie-flavored" set is `Evenings drag.` / `Walks help.` /
`I walked on Wednesday.` — held in a sibling constant for copy to swap entire
set if desired. Do not mix the two sets.

### Canvas at rest

Cream plate. Hairline surface line at `y=168` (restored per cd-pass-2 §3 Card 3
— matches Cards 1 and 2). Top-left `03` label, same styling. No ticks, no
horizontal time-axis. No visible bloom positions.

### Bloom positions (200×240 viewBox)

- Bloom 1 (six weeks ago): centroid `(78, 92)` — upper-left of center, **above
  the surface line**. Radius `28`. Final saturation 55%.
- Bloom 2 (last week): centroid `(108, 132)` — middle, slightly down-right.
  Radius `36`. Final saturation 80%.
- Bloom 3 (today): centroid `(138, 172)` — lower-right, **crossing the surface
  line by ~4px below it** (the most recent goes deeper into the paper). Radius
  `46`. Final saturation 100%.

The three centroids trace a gentle downward-rightward arc. They are NOT colinear.

### DOM / SVG sketch

```tsx
<svg viewBox="0 0 200 240" aria-hidden className="absolute inset-0 h-full w-full">
  <defs>
    <radialGradient id="ink-3">{/* same stops as ink-1 */}</radialGradient>
    <filter id="bleed-3"><!-- same rig as bleed-1, seed=11, scale=10 (static) --></filter>
  </defs>

  <line x1="0" y1="168" x2="200" y2="168" stroke="rgba(15,12,10,0.12)" strokeWidth="1"/>

  <g style={{ mixBlendMode: "multiply" }}>
    <g className="c3-bloom-1" style={{ transformOrigin: "78px 92px" }} filter="url(#bleed-3)">
      <circle cx="78" cy="92"  r="28" fill="url(#ink-3)" opacity="0.55"/>
    </g>
    <g className="c3-bloom-2" style={{ transformOrigin: "108px 132px" }} filter="url(#bleed-3)">
      <circle cx="108" cy="132" r="36" fill="url(#ink-3)" opacity="0.80"/>
    </g>
    <g className="c3-bloom-3" style={{ transformOrigin: "138px 172px" }} filter="url(#bleed-3)">
      <circle cx="138" cy="172" r="46" fill="url(#ink-3)" opacity="1.00"/>
    </g>
  </g>

  {/* overlap outline — hand-traced over the visible overlap regions */}
  <path
    className="c3-overlap-outline"
    d="M 92 110 C 96 124 102 134 116 130 C 124 144 130 158 142 156 C 152 170 150 184 134 188 C 120 192 108 178 104 162 C 96 148 88 134 92 110 Z"
    stroke="#B5511A" strokeOpacity="0.45" strokeWidth="1" fill="none"
    pathLength="600" strokeDasharray="600" strokeDashoffset="600"
  />
</svg>

{/* Three margin notes, absolutely positioned beside their blooms */}
<MarginNote3 anchor={{x:"39%", y:"38%" }} side="left"  note={CONTINUITY_NOTES[0]} timestamp={false}/>
<MarginNote3 anchor={{x:"54%", y:"55%" }} side="right" note={CONTINUITY_NOTES[1]} timestamp={false}/>
<MarginNote3 anchor={{x:"69%", y:"72%" }} side="right" note={CONTINUITY_NOTES[2]} timestamp={true}/>
```

`MarginNote3`: phrase is `Newsreader italic 13px text-ink md:text-[14px]`,
max-width `16ch`, line-height 1.25. Connector is 28px, 1px `rgba(15,12,10,0.20)`.

**Per-card `--connector-len` (load-bearing).** The `inkConnectorDraw` keyframe
in §6 reads `var(--connector-len, 32)`. Cards 1 and 2 use 32px connectors and
inherit the default; **Card 3's `MarginNote3` must set `style={{ "--connector-len": "28" }}`
inline on the connector `<line>` / `<path>` element** so the dasharray matches
the actual 28px stroke length. Without this override, Card 3 connectors will
draw against the wrong dasharray and overshoot or undershoot the bloom edge.
For symmetry, `MarginNote` (Cards 1 and 2) should explicitly set
`style={{ "--connector-len": "32" }}` even though it matches the default — it
makes the per-card contract explicit at the call site.

**Timestamps (cd-pass-2 §3 Card 3):** ONLY the *today* timestamp renders, on
bloom 3, as `Newsreader italic 11px text-brand-700`, positioned above the phrase.
The other two notes show phrase only — chronology is inferred from bloom size
and saturation. (Do not crowd the canvas with three timestamps.)

### Animation timeline

| t (ms) | element              | what                                                            | duration | easing          |
|-------:|----------------------|-----------------------------------------------------------------|---------:|-----------------|
|      0 | drop 1               | translateY −24 → 0 into (78, 92), opacity 0 → 1                 |     280  | ease-out-soft   |
|    280 | c3-bloom-1           | scale 0.1 → 1                                                   |     620  | ease-out-expo   |
|    900 | drop 2               | translateY −24 → 0 into (108, 132), opacity 0 → 1               |     280  | ease-out-soft   |
|   1180 | c3-bloom-2           | scale 0.1 → 1                                                   |     620  | ease-out-expo   |
| **2100** | **drop 3 (LATE)**  | **300ms later than a metronome would suggest (gap = 1200, not 900). translateY −24 → 0 into (138, 172).** | 280 | ease-out-soft |
|   2380 | c3-bloom-3           | scale 0.1 → 1                                                   |     620  | ease-out-expo   |
|   3000 | overlap-outline      | stroke-dashoffset 600 → 0 (multi-overlap region only)           |     700  | ease-out-expo   |
|   3000 | margin note 1        | blur(4) opacity 0.12 → blur(0) opacity 1                        |     600  | ease-out-quart  |
|   3220 | margin note 2        | same                                                            |     600  | ease-out-quart  |
|   3440 | margin note 3 (+ts)  | same; timestamp fades in alongside phrase                        |     600  | ease-out-quart  |
|   4040 | (settle)             | hold; no breathing pulse                                         |        — | —               |

Total runtime ≈ 4.04s.

**The late arrival of drop 3 is sacred (cd-pass-2 §3 Card 3).** Source comment
required at the drop-3 delay:
`// Drop 3 arrives late. The 300ms gap is the rhythm of returning. Do not normalize.`

All three drops use identical `ease-out-expo` 620ms bloom expansions and 280ms
falls — only the **start time** of drop 3 is delayed. Identical easing keeps
the three reading as the same gesture happening three times; spacing tells the
story.

### Color values

- Same ink palette as Cards 1 and 2.
- Multiply blend deepens the overlap region naturally — no explicit color
  shift, no saturation pulse.
- Overlap outline: `#B5511A` @ 45% opacity, 1px.
- *Today* timestamp: `text-brand-700` (`#B5511A`).
- Surface line: `rgba(15, 12, 10, 0.12)`.

### Reduced-motion final state

All three blooms at final scale 1 with their final opacities (0.55 / 0.80 /
1.00), multiply blend applied, overlap outline at `stroke-dashoffset: 0`, all
three margin notes at opacity 1, *today* timestamp visible. No drops, no ripples.

### Anti-patterns

- Horizontal timeline with dots-and-lines (the v1 `PipelineNode` pattern).
- Three timestamps shown (only *today* shows).
- Memory graph / Gantt / progress bar / tree rings / DNA helix / calendar.
- Even spacing (900/900/900) on the three drops — **must be 0 / 900 / 2100**.
- Saturation pulse on the overlap region (killed; the trace alone resolves it).
- Multiply group wrapped in any parent with `transform`, `opacity < 1`, or
  `filter` — breaks the blend on Safari (see §9 risk 1).

---

## 6. Animations — keyframes inventory

Add to `app/globals.css` (additive — do not modify existing tokens or
keyframes). Each new keyframe is also no-op'd inside the
`@media (prefers-reduced-motion: reduce)` block.

```css
/* Drop falling onto the surface. Translate-only — no scale compress. */
@keyframes inkDropFall {
  0%   { transform: translateY(-36%); opacity: 0; }
  12%  { opacity: 1; }
  100% { transform: translateY(0);    opacity: 1; }
}

/* Drop fading after impact (the absorption into the bloom). */
@keyframes inkDropAbsorb {
  from { opacity: 1; }
  to   { opacity: 0; }
}

/* Impact ring expanding outward from the strike point. */
@keyframes inkRipple {
  0%   { transform: scale(0.2); opacity: 0.5; }
  100% { transform: scale(2.6); opacity: 0;   }
}

/* Bloom expansion. Scale-only on the parent <g>; the SVG filter
   handles the irregular edge. Never animate stdDeviation per frame. */
@keyframes inkBloom {
  0%   { transform: scale(0.1); }
  100% { transform: scale(1);   }
}

/* Card 2 cycle-1 absorb: bloom desaturates and dims to a 4–6% filled ghost.
   Applied to the bloom <g>; the underlying opacity stays in markup. */
@keyframes inkAbsorbToGhost {
  0%   { opacity: 1;    filter: saturate(1);   }
  100% { opacity: 0.05; filter: saturate(0.3); }
}

/* Card 2 cycle-1 question fade to muted (joins the paper, doesn't disappear). */
@keyframes inkQuestionMute {
  from { opacity: 1;    }
  to   { opacity: 0.30; }
}

/* Outline trace for Card 1 (full bloom silhouette) and Card 3 (overlap region).
   The path's stroke-dasharray = its computed length; dashoffset animates to 0. */
@keyframes inkOutlineTrace {
  from { stroke-dashoffset: 600; }
  to   { stroke-dashoffset: 0;   }
}

/* Margin-note / phrase reveal: blur-out + opacity. */
@keyframes inkPhraseReveal {
  from { filter: blur(4px); opacity: 0.12; }
  to   { filter: blur(0);   opacity: 1;    }
}

/* Hairline connector draw (from bloom edge to phrase). 1px stroke,
   length pre-baked at 32px (Cards 1, 2) or 28px (Card 3). */
@keyframes inkConnectorDraw {
  from { stroke-dashoffset: var(--connector-len, 32); }
  to   { stroke-dashoffset: 0; }
}
```

Reduced-motion guard (additive to the existing block):

```css
@media (prefers-reduced-motion: reduce) {
  .card1-drop, .card1-ripple, .card1-bloom, .card1-outline,
  .bloom-A, .bloom-B, .drop-A, .drop-B,
  .c3-bloom-1, .c3-bloom-2, .c3-bloom-3, .c3-overlap-outline {
    animation: none !important;
    transition: none !important;
  }
}
```

Easings used (all already in `:root`):
- `--ease-out-expo` — drop falls, bloom expansions, outline traces.
- `--ease-out-quart` — phrase reveals, absorb/mute transitions, drop absorb fade.
- `--ease-out-soft` — short drop fade-ins (Cards 2 and 3).

Duration tokens already in `:root`:
- `--dur-quick` (180ms) — drop absorb fade.
- `--dur-state` (320ms) — ripple.
- `--dur-reveal` (700ms) — bloom expansion (Card 1: 1100), outline trace.
- `--dur-reveal-long` (1100ms) — Card 1 bloom expansion.

The 1600ms hold and 800ms gap in Card 2 are intentionally hard-coded as raw
millisecond values (`1600ms`, `800ms`) — they are load-bearing semantic durations,
not part of the token vocabulary. Comment in source: `// Not a token. The
silence is the point.`

---

## 7. SVG / filter inventory

### 7.1 Section-level shared defs

One hidden `<svg>` placed at the top of `PatternsBlock`, height 0, containing
defs reused across all three cards:

```tsx
<svg aria-hidden width="0" height="0" className="absolute" style={{ position: "absolute" }}>
  <defs>
    <filter id="paperGrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" stitchTiles="stitch"/>
    </filter>
  </defs>
</svg>
```

### 7.2 Per-card defs

Each card's SVG has its own `<defs>` for the bloom gradient and bleed filter
(filters need to be local-ish to avoid Safari's cross-SVG reference quirks):

| Card | Defs                                                                  |
|------|-----------------------------------------------------------------------|
| 1    | `<radialGradient id="ink-1">`, `<filter id="bleed-1">` (seed=3, animated scale 14→6) |
| 2    | `<radialGradient id="ink-2">`, `<filter id="bleed-2">` (seed=7, static scale=10)     |
| 3    | `<radialGradient id="ink-3">`, `<filter id="bleed-3">` (seed=11, static scale=10)    |

All three radial gradients have identical stops (same color story). The seed
integer is hard-coded — never `Math.random()`.

### 7.3 Pre-baked SVG paths

- Card 1 bloom outline (`d="M 56 168 C 52 150 ..."`) — one path, pathLength=600.
- Card 3 overlap outline (`d="M 92 110 C 96 124 ..."`) — one path, pathLength=600.

These are hand-tuned in the spec; the engineer can fine-tune coordinates by
±2px to align with the visually-displaced bloom edges in their browser, but
**must not** derive them at runtime from canvas readback.

No `<clipPath>` is required.

---

## 8. Implementation order for the engineer

Build in this order. The page should render and pass tests at the end of each
step.

1. **Strip out the old visuals.** Delete `IntakeVisual`, `SessionVisual`,
   `MemoryVisual`, `BrainProgress`, `IntakeItem`, `PipelineNode`. Delete the
   `INTAKE_ITEMS`, `REVEAL_BASE`, `REVEAL_GAP`, `REVEAL_DUR`,
   `PULSE_DELAY_S`, `PULSE_CYCLE_S`, `ICON_PULSE_DELAYS_S` constants. Delete
   the `Thread` component. The page will be broken; that's expected.

2. **Build the shared `Plate` primitive** — a cream-on-cream `<div>` with the
   inset hairline `box-shadow`, the shared `PaperGrain` SVG wash overlay, and
   the serif italic `01 / 02 / 03` label slot at top-left. Mount three
   `Plate` instances inside `PatternsBlock`'s grid with their final
   static state placeholder (a `<circle cx="100" cy="168" r="46"
   fill="url(#ink-N)" filter="url(#bleed-N)"/>` so you can verify the bloom
   renders correctly in all three browsers before adding motion).

3. **Build Card 1 static, then animate.** Surface line, label, pre-baked
   outline path drawn at `dashoffset=0`, both phrases visible with their
   connectors. Verify the bloom outline visually traces the displaced bloom
   edge (±2px adjustments OK). Then layer in the animation timeline from §3:
   drop → ripple → bloom scale → edge sharpen → phrase 1 → phrase 2 → outline.
   Add the `// Outline traces LAST.` comment.

4. **Build Card 2 static, then animate.** Stage 2 final state first (bloom-A
   ghost + Q1 muted + bloom-B full + Q2 full). Then build the stage machine
   (`useState<0|1|2>`) and step through Cycle 1 → absorb → gap → Cycle 2 → settle.
   Add `// Silence is content. Do not shorten. Do not fill.` comment at the
   1600ms hold and at the 800ms gap.

5. **Build Card 3 static, then animate.** Three blooms at their final
   opacities/positions, multiply group, surface line, overlap outline at 0,
   three margin notes, *today* timestamp on bloom 3. Then layer the three
   drops with the 0 / 900 / 2100 timing. Add `// Drop 3 arrives late. The
   300ms gap is the rhythm of returning. Do not normalize.` at the drop-3
   delay.

6. **Replace the `Thread`.** Drop in `PatternsDivider` from §2.4, bound to
   Card 1's `inView` so it draws when the act begins.

7. **Section-level pass.** Apply the `mt-32 md:mt-40 lg:mt-48` container
   spacing. Promote each card title `<p>` to `<h4>` with matching classes.
   Verify all SVGs are `aria-hidden`. Hydrate the `prefersReducedMotion` flag
   on each card and short-circuit to final state when true. Cross-browser
   smoke test (Safari macOS, Safari iOS, Chrome, Firefox) for the multiply
   blend on Card 3 and the `feDisplacementMap` parity across browsers.

---

## 9. Risks the engineer must navigate

1. **`mix-blend-mode: multiply` inside a transformed SVG.** If the Card 3
   `<g style={{mixBlendMode:"multiply"}}>` is wrapped in any ancestor with
   `transform`, `opacity<1`, or `filter`, Safari creates a new stacking context
   and the multiply blends against transparent black — blooms crush to brown
   on overlap. Fix: keep the multiply group at the SVG root; animate the
   child `<g>` transforms, not the parent. Verify in iOS Safari first.

2. **`feGaussianBlur` GPU thrash.** Animating `stdDeviation` per frame burns
   battery. Card 1's edge-sharpen `scale 14 → 6` uses a single 700ms SMIL
   `<animate>` on the `feDisplacementMap` `scale` attribute — one-shot, not
   per-frame keyframes. The bloom expansion itself is `transform: scale()` on
   the parent `<g>`, NOT a stdDeviation animation.

3. **`animation-play-state` getting stuck.** When a card scrolls out,
   animations should pause but the settled state must persist. Easy bug:
   re-using a `playState` ref that gets flipped back to `running` on re-entry,
   restarting from 0. Fix: once a card's `inView` flips true, it never flips
   back — preserve the one-shot semantic of the existing `useInView` hook
   in any refactor. The pause-on-scroll-out is a separate `IntersectionObserver`
   that toggles `animation-play-state` without resetting the timeline.

4. **Hover-replay re-mounting the wrong subtree.** Bumping `replayKey` should
   re-mount only the inner animating `<g>` (drop + ripple + bloom), NOT the
   entire `<svg>` (which re-fetches the filter and flickers on first paint).
   Use the key on the inner group, never on the SVG root.

5. **`feTurbulence` cross-browser determinism.** Chrome / Safari / Firefox
   produce slightly different turbulence patterns at the same seed. Accept
   the variation — the bloom edge should read *organic* in all three.
   Unacceptable: re-rolling the seed on every render. Seeds are hard-coded
   integers (3, 7, 11 for Cards 1, 2, 3 respectively) in markup.

6. **Cream-on-cream contrast trap.** The 6% hairline border may genuinely
   vanish on a low-end LCD or conference-room projector. Do NOT increase the
   border opacity to fix this — the design wants the cards to barely separate.
   If QA flags, the fix is to make the section background a hair warmer or
   the grain a hair stronger; do NOT add a visible border or shadow.

7. **`01 / 02 / 03` label weight.** Watch the labels' visual weight against
   the eyebrow text below the card — labels should read *quieter* than the
   eyebrow, not louder. The spec lands them at `text-ink-muted/70`; if they
   still feel bright in browser, drop another notch — but do not bump them.

8. **Margin-note typography at `lg` viewports.** Card 3's phrases at
   `Newsreader italic 13px md:14px` may need a `lg:15px` one-step bump at the
   largest canvas size. Check in browser; do not pre-emptively bump.

9. **The 1.6s hold + 800ms gap in real-world scroll context.** What feels
   correct in isolation can feel too long when the eye is also tracking
   Cards 1 and 3. This is a CD pass-3 refinement question — do not
   pre-adjust. Ship the locked durations and let the refinement phase decide.

10. **Multiply blend + cream paper grain stacking on Card 3.** The paper grain
    wash sits *above* the SVG (so it textures both the cream and the ink).
    Verify the overlap region still visibly deepens. If the grain crushes the
    multiply, drop grain opacity to 0.03 on Card 3 only.

---

## 10. Acceptance checklist

The engineer self-grades before declaring done. All ten verifiable in the
browser; no dev tools required for the first six.

- [ ] 1. Top gap above the `h3` measures `mt-32 / md:mt-40 / lg:mt-48` (~128/160/192px). The section reads as its own register, not a continuation of the Millie strip.
- [ ] 2. All three card visual containers render `bg-paper-warm` (cream) with a barely-visible hairline border. No `bg-white` anywhere in this block. No outer shadow.
- [ ] 3. On a desktop scroll, the three cards animate at the moment each one is substantially in view — not all at once. The `h3` and intro paragraph animate as a unit before Card 1 enters.
- [ ] 4. Card 1 resolves to stillness: bloom formed, outline traced, both phrases (`"I cook for my mother."` and `"Mornings are the good hours."`) attached with hairline connectors. No breathing pulse after settle.
- [ ] 5. Card 2 plays exactly two cycles (Q1 = `"What made that possible?"`, Q2 = `"What does that say about you?"`) and stops. Final state: bloom-A is a ghost (visible filled silhouette, ~5% ink — not a hairline), Q1 muted, bloom-B at full saturation, Q2 at full opacity. The 1.6s hold and 800ms gap are visually present and feel like silence. No 20s replay, no auto-loop.
- [ ] 6. Card 3 shows the hairline surface line at the same y-position as Cards 1 and 2. Three blooms land on a downward-rightward arc, not a horizontal line. Drop 3 lands noticeably later than a metronome would suggest. Only the *today* timestamp shows (on bloom 3, in `text-brand-700`); blooms 1 and 2 show phrase only. The closing phrase is `"I cooked on Sunday."` (no "This week").
- [ ] 7. Hover on any card replays its animation cleanly; no SVG filter flicker on replay; no other card replays as a side effect.
- [ ] 8. The `Thread` pulse-dot and right-edge ticks are gone. A single hairline divider draws across the grid between visual row and eyebrow row at desktop only.
- [ ] 9. `prefers-reduced-motion: reduce` (toggle in OS settings) renders all three cards at their final composed state with zero animation — and the layout is identical to the post-animation final state.
- [ ] 10. Cross-browser smoke check: Chrome desktop, Safari macOS, Safari iOS. The multiply blend on Card 3 produces a visibly deeper tone in the overlap (not crushed to brown). The bloom edges look organic (turbulence reads), not perfectly circular, in all three browsers.

---

*End of plan-final.md. This document supersedes plan-v1.md and plan-v2.md.*
