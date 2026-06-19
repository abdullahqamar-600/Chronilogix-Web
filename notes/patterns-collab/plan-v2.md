# plan-v2.md — Three Patterns Animation Spec (post-CD pass 1)

## 0. Changes from v1

**Adopted wholesale from CD pass:**
- Reframe metaphor as **absorption**, not "listening". Kill the v1 label "The Shape of Listening" entirely.
- Intake: cut the 5 facet labels, cut the dashed perimeter ring, cut the 4s breathing pulse. End on stillness.
- Reflection: finite, 2 questions per inView (not infinite 4-card carousel). Card resolves; doesn't run forever.
- Continuity: kill horizontal evenly-spaced ticks (it was a timeline). Restage as off-axis arc. Cut the overlap saturation pulse. Rewrite "Building on both insights" to patient voice.
- Each card gets its own inView observer (independent stagger), not a section-wide trigger.
- Cards: drop `bg-white`. Use cream-on-cream plate with a hairline border.
- Wider top gap between AgentStrips and the `h3`.
- Pure brand-orange ink (no plum). SVG `feGaussianBlur` + `feTurbulence` for bloom edges. One shared low-opacity paper grain across the grid.
- Serif italic question text in Card 2 at a confident 18–22px.
- Relative timestamps in Card 3 (and they are NOT shown as ticks on a line — see Card 3 below).
- No closing ink-drop punctuation before the final line.
- SVGs are `aria-hidden`; title + body carries meaning.

**Adapted (with rationale):**
- CD said "stack the three blooms vertically off-center, or a slight downward arc." I'm specifying a **subtle off-axis arc INSIDE each Card 3 canvas** (three blooms in one square, not three cards). The cards themselves remain a 3-up horizontal grid — that grid is fixed by the section layout. The anti-timeline move happens *inside* Card 3's canvas, where it belongs.
- CD asked for two question positions "hand-chosen for composition, not random." I'm specifying the two coords explicitly (see Card 2) so the engineer doesn't reinvent them.

**Pushing back on (one item, soft):**
- CD called the overlap-zone *outline trace* "done" alongside the pulse cut. I read that as keeping the trace and only cutting the pulse — but flagging in case CD meant to cut both. My recommendation: **keep** the hairline overlap trace; it's the "absorbed/permanent" punctuation that mirrors Card 1's final outline. If CD wants it gone, the card still resolves on the multiply density alone.

---

## 1. Concept (80 words)

**Name: Absorption.**

Chronilogix coaches the way ink absorbs into paper — slowly, on the paper's terms, shaped by what was already there. Three cream plates from a clinical journal, each holding one act of absorption in warm brand-orange ink. Card 1: a single drop becomes a specific person. Card 2: drops arrive, are held in silence, fade into the paper as faint ghosts. Card 3: drops accumulate over time into a single deepened stain. Same ink. Same paper. Three speeds.

---

## 2. Per-Card Specs

### Card 1 — Intake · "The First Drop"

**Visual idea:** One drop of warm ink falls into a cream field and blooms outward, its irregular edge resolving into a shape that *is* this specific person — annotated by two short patient-voice phrases hairline-connected to the irregularities they "produced."

**Canvas at rest:** Cream plate (paper-warm, see §3 for card background). One hairline horizontal at 12% ink across the lower third — the "surface". Tiny serif italic label, top-left: `01`. **No dashed perimeter ring.** No drop visible yet.

**Animation (runs once on card-level inView, ~3.4s, then settles to stillness; replays on hover):**

| t (ms) | beat | what | easing / dur |
|---|---|---|---|
| 0 | drop forms | 6px orange disk fades in 30% above surface line, opacity 0→1 | dur-state / ease-out-soft |
| 280 | drop falls | translateY -28%→0, scale 1→0.85 (compresses on impact) | 540 / ease-out-expo |
| 820 | impact | hairline ring r=2→r=22, opacity 0.5→0 | 320 / ease-out-quart |
| 820 | bloom begins | filtered (gaussian blur) blob scales 0.1→1.0 from impact point, edge displaced by feTurbulence (see §5) | 1100 / ease-out-expo |
| 1700 | edge resolves | feDisplacementMap scale interpolates 14→6 (edge sharpens as ink "sets") | 700 / ease-out-quart |
| 2000 | phrase 1 attaches | First patient-voice phrase fades in at an outer-edge irregularity, hairline-connected by a 1px ink/20 line to its anchor point. blur(4)/opacity 0.12 → blur(0)/opacity 1 | 600 / ease-out-quart |
| 2400 | phrase 2 attaches | Second phrase, different irregularity, mirror gesture | 600 / ease-out-quart |
| 3000 | outline traces | A 1px brand-700/40 hairline traces the bloom's final irregular silhouette via stroke-dashoffset, left side first | 800 / ease-out-expo |
| 3400 | settle | Hold. **No breathing pulse.** Stillness is the resolution. | — |

**Phrases (exactly two, two of three options chosen by copy):**
- *"raised three kids"*
- *"swims at six"*
- *"father's diabetes"*

Spec ships with the first two. Engineer reads these from a constant so copy can swap.

**Loop behavior:** Plays once on card-level inView. Replays on hover via a `replayKey` state bump. Never auto-loops.

**DOM/SVG structure:**
```
<div absolute inset-0 (card cream + grain — see §3)>
  <span: hairline surface line>
  <span: top-left serif italic "01">
  <svg viewBox="0 0 200 240" aria-hidden>
    <defs>
      <radialGradient id="ink-1"> #F9904D core → #FF7434 rim → rgba(249,144,77,0.06) edge </radialGradient>
      <filter id="bleed-1">
        <feGaussianBlur stdDeviation="5"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/>
        <feDisplacementMap in="SourceGraphic" scale="14"/> // animated 14→6
      </filter>
    </defs>
    <circle class="drop"/>
    <circle class="ripple"/>
    <g filter="url(#bleed-1)">
      <circle class="bloom" fill="url(#ink-1)"/>
    </g>
    <path class="bloom-outline" stroke="#B5511A" stroke-width="1" fill="none"/>
  </svg>
  <ul: 2 phrases absolutely positioned, each with a 1px hairline connector span>
</div>
```

The outline path is a pre-baked SVG path (not generated math) sampled to roughly match where the displaced bloom edge lands — see §5.

**Color/texture:** Cream `bg-paper-warm` plate. Ink: `#F9904D` core, `#FF7434` rim, alpha 0.06 outermost. Hairlines `ink/15`. Phrases: `Newsreader italic 13px`, `text-ink`. Top-left `01`: `Newsreader italic 12px`, `text-ink-muted`. **No drop shadow on the bloom.** Shared paper grain (see §3).

**Reduced motion:** Final state immediately — bloom fully formed, outline traced, two phrases visible. No drop fall, no ripple.

**Must NOT become:** Donut. Radar/spider chart. Brain icon. Wireframe head. Tag cloud. Checklist with checkmarks.

---

### Card 2 — Reflection · "The Returning Drop"

**Visual idea:** A drop arrives, blooms, holds a question in silence, fades to a hairline ghost. A second drop arrives in a different position, holds a different question, fades. The card stops — leaving two ghosts and the second question, quiet, in place. Recurrence, then rest.

**Canvas at rest:** Cream plate. Hairline surface line. Top-left serif italic label: `02`. No drop visible. **No pre-existing ghost** — that artifact only exists if Card 2 has played at least once this session.

**Animation (runs once on card-level inView; replays on hover or after a 20s idle):**

The card has **exactly two cycles**, then resolves. Cycle 1 ends with bloom-1 reduced to a hairline ghost. Cycle 2 ends with bloom-2 held in place (orange wash + ink-on-wash text) and bloom-1 still ghosted.

| t (ms) | beat | what |
|---|---|---|
| **Cycle 1 — position A (left 32%, surface line)** | | |
| 0 | drop appears | Drop fades in 30% above surface at x=32% |
| 280 | drop falls | compress-on-impact, 340ms |
| 620 | bloom + Q1 | Bloom expands (700ms ease-out-expo, same filter rig as Card 1). Question text fades in as a **margin note to the right of the bloom**, 1px ink/20 hairline connecting bloom edge to the leftmost capital of the text. blur(3) opacity 0.12 → blur(0) opacity 1, 600ms |
| 1600 | hold | **1.6s silence. Load-bearing.** Source comment: `// Silence is content. Do not shorten.` |
| 3200 | absorb | Bloom desaturates to ~6% alpha over 900ms; question text fades to 30% opacity (joins the paper, doesn't disappear) |
| 4100 | ghost set | Bloom is now a 1% ink hairline silhouette; question text is muted/30 |
| 4900 | gap | 800ms stillness. Not dead air — the room between questions. |
| **Cycle 2 — position B (right 58%, surface line, slightly above A)** | | |
| 5700 | drop appears | Drop fades in 30% above surface at x=58%, y offset 6% higher than A |
| ~6320 | bloom + Q2 | Same gesture, mirrored direction (margin note to the LEFT of the bloom this time) |
| ~7300 | hold | 1.6s silence |
| **~8900 | settle** | Cycle 2 does **NOT** absorb. Bloom-2 stays at full saturation. Q2 stays at full opacity. Bloom-1 stays as ghost. Card resolves here. |

Total runtime: ~8.9s, then static.

**Questions (engineer reads from `SESSION_MESSAGES`; ship cycles 1 & 2 as):**
- Q1: *"What made that possible?"*
- Q2: *"What does that say about you?"*

**Margin-note typography (CD: serif italic, confident size):** `Newsreader italic 19px md:21px`, `text-ink`, max-width 18ch, line-height 1.25. Text sits **beside** the bloom (not inside it). Hairline `1px ink/20` connects bloom edge tangent to the text's first baseline. This solves CD's italic-on-orange-wash legibility concern.

**Loop:** Plays once on card-level inView. Replays on hover. Auto-replays after 20s idle while still in viewport (a single, occasional re-breath — not a carousel). On scroll-out, animation pauses; on scroll-in, resumes from settled state (no re-trigger unless explicitly replayed).

**DOM/SVG structure:** Single SVG with two `<g>` groups (`pos-A`, `pos-B`), each holding its own bloom + outline path. The active group is toggled by a `data-stage` attribute on the SVG (`0` → idle, `1` → A active, `2` → A ghost + B active). Question text is HTML overlay positioned absolutely (one per stage, mounted/unmounted via React state). Easier to manage typography, easier to swap copy.

**Color/texture:** Same brand-orange ink, same paper grain. Margin-note hairline `1px ink/20`. No white anywhere. Drop is plain ink, no halo.

**Reduced motion:** Render the final settled state — both questions visible, bloom-1 ghosted, bloom-2 full, both margin notes shown — no motion.

**Must NOT become:** Chat bubbles. Speech-bubble grid. Floating AI orb. Typewriter effect. Carousel. Slideshow.

---

### Card 3 — Continuity · "The Stain That Builds"

**Visual idea:** Three drops land over weeks, not seconds, in roughly the same region of the page — but along a subtle **downward arc**, not a horizontal axis. They overlap; the multiply blend deepens the overlap region; three patient-voice margin notes attach to each bloom (not to a tick on a line). Time is *off-axis*, not on a line.

**Canvas at rest:** Cream plate. **No surface line.** **No ticks.** **No horizontal axis at all.** Top-left serif italic label: `03`. Three absent bloom positions, marked only by their eventual centroids (which the engineer will not visualize at rest).

**Bloom positions (centroid coords on a 200×240 viewBox):**
- Bloom 1: (78, 92) — upper-left of center
- Bloom 2: (108, 124) — middle, slightly down-right of B1
- Bloom 3: (138, 162) — lower-right, deeper down the arc

The three centroids trace a gentle downward-rightward arc. They are NOT colinear. Sizes: B1=60% radius, B2=78%, B3=100%. Saturation matches: B1=55%, B2=80%, B3=100%.

**Animation (runs once on card-level inView, ~3.6s; replays on hover):**

| t (ms) | beat | what |
|---|---|---|
| 0 | drop 1 | Falls to (78, 92), blooms at 60% radius, 55% saturation, irregular edge via same filter rig | 900 |
| 900 | drop 2 | Falls to (108, 124). Bloom overlaps drop-1's right/lower edge by ~30%. Multiply blend produces visibly deeper tone in the overlap. 78% radius, 80% sat. | 900 |
| **2100** | drop 3 (late) | Falls to (138, 162) — **arrives 300ms later than a metronome would suggest** (gap = 1200ms, not 900). The "returning" rhythm. 100% radius, 100% sat. | 900 |
| 3000 | overlap traces | 1px brand-700/40 hairline traces ONLY the multi-overlap region (where any two blooms intersect), drawn via stroke-dashoffset. **No saturation pulse.** | 700 / ease-out-expo |
| 3000 | margin notes appear | Three serif italic phrases fade in, each anchored beside its bloom (not below a tick): blur(4)→blur(0), opacity 0.12→1. Stagger 220ms in *bloom order* (1, 2, 3). | 600 each |
| 3600 | settle | Hold. **No breathing pulse.** Stillness. |

**Margin-note phrases (rewritten per CD):**
- Beside Bloom 1 (six weeks ago): *"Sundays are the hardest."*
- Beside Bloom 2 (last week): *"Cooking grounds me."*
- Beside Bloom 3 (today): *"This week I cooked on Sunday."*

**Timestamps**: rendered as serif italic 11px above each phrase: *six weeks ago* / *last week* / *today*. The "today" timestamp is `text-brand-700`; the other two are `text-ink-muted`. Crucially: these timestamps **float beside each bloom** alongside its phrase. They are NOT laid out on a horizontal axis. The viewer reads the time off the *position* of the bloom, not off a baseline.

**Loop:** Once on card-level inView. Replays on hover. Does not auto-loop.

**DOM/SVG structure:**
```
<svg viewBox="0 0 200 240" aria-hidden>
  <defs>
    <radialGradient id="ink-3"/>
    <filter id="bleed-3"/> // same rig as Card 1; seed differs
  </defs>
  <g style="mix-blend-mode: multiply">
    <g class="bloom-1" filter="url(#bleed-3)"><circle .../></g>
    <g class="bloom-2" filter="url(#bleed-3)"><circle .../></g>
    <g class="bloom-3" filter="url(#bleed-3)"><circle .../></g>
  </g>
  <path class="overlap-outline" stroke="#B5511A" stroke-width="1" fill="none" stroke-dasharray="..." stroke-dashoffset="..."/>
</svg>
<ul aria-hidden: 3 timestamp+phrase groups, absolutely positioned next to each bloom>
```

**Mix-blend-mode caveat:** the multiply group MUST sit directly on the cream card background (no white wash between it and the cream). See §6.

**Color/texture:** Single brand-orange ink. Multiply creates the deepened overlap. Paper grain shared (§3). Margin notes: `Newsreader italic 12–13px text-ink`. Timestamps: `Newsreader italic 11px`.

**Reduced motion:** Composed final image immediately — three overlapping stains, overlap outline drawn, all three timestamp+phrase pairs visible, no animation.

**Must NOT become:** Timeline of dots-and-lines (the v1 pipeline). Memory graph. Gantt. Progress bar. Tree rings. DNA helix. Calendar.

---

## 3. Section-Level Details

### 3.1 Card background — **not `bg-white`**

Each card uses:
- Background: **`bg-paper-warm`** (same cream as the section).
- A `1px solid` hairline border at `rgba(15,12,10,0.06)` — barely there, defines the plate without fighting the cream.
- A shared **paper grain wash** layered on top: single 8–12KB PNG (or noise-via-SVG `feTurbulence` if we'd rather ship zero raster), `mix-blend-multiply`, opacity 0.04–0.06. One image reused across all three cards.
- No `box-shadow`. No rounded-outer-shadow. The hairline border + the section background do all the work.

This is the "clinical plate" register CD called for. Cream-on-cream, hairline-delimited.

### 3.2 Per-card stagger on inView

Replace the section-wide `PatternsBlock` `useInView` (currently fires all three cards at once) with **per-card** `useInView` on each `PatternCard`. The card's visual + eyebrow + title + body all animate from that card's observer.

- The `h3` headline + intro paragraph keep their existing block-level observer (they should animate together as a unit, before any card enters).
- Each `PatternCard` becomes responsible for its own observer at `threshold: 0.25, rootMargin: "0px 0px -8% 0px"`.
- Stagger of eyebrow/title/body after the card's own visual: visual at 0, icon+eyebrow at +120ms, title at +220ms, body at +320ms. No section-level index stagger anymore.

### 3.3 Connective tissue — replace `<Thread>`

Kill the current `Thread` entirely: the traveling pulse-dot, the right-edge tick marks, the whole component.

**Replacement (desktop ≥lg):** A single hairline horizontal at `ink/10`, drawn across the grid between row 1 (visual) and row 2 (eyebrow), via stroke-dashoffset, 1300ms ease-out-expo, triggered when the *first* card enters view. **No drop markers above it. No pulse-dot. No trailing ticks on the right.** It is just a thin horizontal divider that says "these belong to the same act" without implying flow direction.

Mobile (`< lg`): line is hidden entirely. Cards stack with `gap-y-12` and the section's vertical rhythm carries them.

### 3.4 Mobile orchestration rule

- Each card observes its own viewport entry as on desktop.
- On viewports `< md`, the threshold is raised to `0.45` so the card has to be substantially in view before animating. This prevents the "slot machine" feel CD flagged where scrolling past three vertically-stacked aspect-3/4 cards would trip three animations in quick succession.
- `prefers-reduced-motion: reduce` on mobile → all three cards render at final state; per-card observers still fire (so we don't pay for unused observers), but the animation effectively short-circuits to final state.
- Card 2's "auto-replay after 20s idle" is disabled on `< lg` (a long idle on a phone is more likely "user moved on" than "user is sitting with the rhythm").

### 3.5 Accessibility

- Every SVG in all three cards: `aria-hidden="true"`. The illustrations are decorative; the title + body copy carry meaning for screen readers.
- The phrases inside Card 1, the questions inside Card 2, and the margin notes + timestamps in Card 3 are all inside `aria-hidden` containers as well. They are *illustrative*, not informational — they are stand-ins for a real patient's data. Exposing them in reading order would be confusing.
- The card itself is an `<article>` with an implicit heading via its title `<p>`. We promote the title `<p>` to `<h4>` (since the section already has `h2`/`h3`); the eyebrow stays as a sibling `<span>`. Reading order per card: H4 title → body paragraph. Done.
- Contrast: ink (`#0F0C0A` family) on `bg-paper-warm` (cream `#F8F1E6`-ish) clears WCAG AA at body sizes. Brand-700 on cream clears AA for "today" timestamp at 11px. The orange-on-cream bloom is decorative and not subject to contrast rules.
- Focus order: cards do not receive focus (no interactive elements). Hover-to-replay is hover-only; we do not bind keyboard focus to replay (it would create a confusing focus state).
- The connective `<Thread>` replacement is `aria-hidden`.

### 3.6 First-three-seconds eye flow

A CHRO scrolling past has three seconds. Where the eye lands:

1. **t≈0**: The serif `h3` ("Three patterns. Every session.") — it sits above the grid, type-led entry point.
2. **t≈0.5s**: Card 1's bloom drop begins. The drop is the only thing in motion at this instant; the eye snaps left.
3. **t≈1.5s**: Card 1's bloom resolves. Card 2 is now beginning its first drop. Eye drifts to center.
4. **t≈3s**: Card 1 is settled and quiet. Card 2 is mid-hold (silence beat). Card 3 has just begun its first drop. Eye drifts right.

The orchestration is enforced by the per-card `inView` observers + the fact that the three cards enter viewport in roughly left-to-right order on desktop. On mobile (stacked), the same observer pattern naturally produces top-to-bottom flow.

**Critically:** Card 2 is finite. By t≈9s it has resolved. There is no looping animation drawing attention after the section has been "read."

---

## 4. Outstanding open questions for CD pass 2

1. Card 1 phrases — should they be *2* (as specified) or occasionally *3* on wider viewports? My instinct: 2, always. Stable composition beats responsive cleverness.
2. The overlap-region hairline trace in Card 3 — keep (my recommendation) or cut (possible CD intent)?
3. The Card 2 "20s idle auto-replay" — keep, or strictly play-once-per-page-load? CD said "card resolves; doesn't run forever." A 20s idle re-breath is once per 20s, which is not "running forever" but it is also not "resolves." I lean keep, CD may not.

---

## 5. Implementation Notes (for the engineer)

### 5.1 SVG vs CSS per card

| Card | Approach | Why |
|---|---|---|
| 1 | Mostly SVG. CSS for the falling drop + ripple (cheaper than SMIL). SVG filter for bloom edge. SVG `<path>` for the final outline. | The bloom IS the visual; only SVG filters do diffusion convincingly. |
| 2 | Same as Card 1 per cycle. Stage management in React state (`stage: 0 | 1 | 2`). Two `<g>` groups in one SVG, one active at a time via class. | Need React for the stage state machine + margin-note text mounting. |
| 3 | All SVG, no per-frame React. `mix-blend-mode: multiply` on the group. Each bloom is a `<g>` with its own `style.transform` animated via CSS keyframes. | Multiply blend works inside an SVG `<g>`; no JS per frame. |

### 5.2 Filter usage (shared `bleed` filter, per-card with unique seed)

```svg
<filter id="bleed-N" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="noise"/>
  <feDisplacementMap in="blur" in2="noise" scale="14" result="rough"/>
</filter>
```

Each card uses a different `seed` so the three blooms' edges differ. The Card 1 `scale` animates from 14 → 6 over 700ms (the edge "sharpens" as ink sets). Cards 2 and 3 use a static `scale=10` — they're not selling "resolution," they're selling rhythm and accumulation.

`mix-blend-mode: multiply` is **only** used on Card 3's three-bloom `<g>` — and only relative to the cream card background. See §6.

### 5.3 Bloom edge irregularity — math or pre-baked?

**Hybrid.** The edge irregularity is generated by `feTurbulence + feDisplacementMap` (math, in the filter). The bloom itself is a plain `<circle>`. We do NOT compute a custom bezier path per bloom in JS.

The **final outline** (Card 1's hairline trace, Card 3's overlap trace) IS a pre-baked SVG `<path>`. The engineer hand-tunes one path per card that visually matches where the displaced bloom edge lands; this is faster than trying to extract the displaced edge at runtime (which would require a canvas readback). Acceptable tolerance: outline doesn't need to be pixel-perfect to the bloom, just close enough to read as "the same shape."

### 5.4 Animation tokens

Reuse existing tokens in `globals.css`:
- `--ease-out-expo` for drop falls and bloom expansions
- `--ease-out-quart` for fades, blur-resolves, edge sharpening
- `--ease-out-soft` for the drop's initial fade-in
- `--dur-state` (320ms) for ripples
- `--dur-reveal` (700ms) for phrase/note reveals
- `--dur-reveal-long` (1100ms) for bloom expansions

**New keyframes to add to `globals.css`:**

```css
/* Drop falling onto the surface, with compress-on-impact. */
@keyframes inkDropFall {
  0%   { transform: translateY(-28%) scale(1);    opacity: 0; }
  10%  { opacity: 1; }
  100% { transform: translateY(0)    scale(0.85); opacity: 1; }
}

/* Impact ring expanding outward from the strike point. */
@keyframes inkRipple {
  0%   { transform: scale(0.2); opacity: 0.5; }
  100% { transform: scale(2.6); opacity: 0;   }
}

/* Bloom expansion. Scale-only; the filter does the edge. */
@keyframes inkBloom {
  0%   { transform: scale(0.1); }
  100% { transform: scale(1);   }
}

/* Card 2 cycle 1 absorb — saturation/alpha to ghost. */
@keyframes inkAbsorb {
  0%   { opacity: 1;    filter: saturate(1);    }
  100% { opacity: 0.06; filter: saturate(0.3);  }
}

/* Card 1 / Card 3 outline trace. The path's stroke-dasharray equals its
   computed length; offset animates from length → 0. */
@keyframes inkOutlineTrace {
  from { stroke-dashoffset: var(--path-len, 600); }
  to   { stroke-dashoffset: 0; }
}
```

All five must be guarded by `@media (prefers-reduced-motion: reduce)` to no-ops.

### 5.5 State management

| Card | React state | Why |
|---|---|---|
| 1 | `replayKey: number` | Bump on hover → remount the SVG inner group so keyframes restart. |
| 2 | `stage: 0|1|2`, `replayKey: number`, `idleTimer: ref` | Stage machine for two cycles; idle timer for the 20s re-breath. |
| 3 | `replayKey: number` | Same as Card 1. |

Use the existing `useInView` hook but at the **card** level. Each card calls it independently. The card's animation triggers when its own `inView` flips to true.

### 5.6 Performance budget per card

- **Max DOM nodes inside a single card's visual:** ~25 (one SVG, ~10 SVG children, ~6 HTML phrase/note nodes, ~6 absolute-positioned spans for connectors/labels).
- **Max filters per card:** 1 SVG filter (the `bleed-N`). No CSS `filter: blur()` on large elements at runtime — the SVG filter is GPU-bounded by its filter region and won't paint the whole layer.
- **No `will-change` on the bloom `<g>`** (it changes once per inView, not per frame). `will-change: transform, opacity` only on the falling drop and the ripple, which animate continuously for ~500ms.
- **`animation-play-state: paused`** when the card is not in viewport (use an IntersectionObserver, threshold 0). Especially important for Card 2's idle timer — pause it when off-screen.
- **No `backdrop-filter` anywhere** in this section. (The old `SessionVisual` used `backdrop-blur-xl`; that's gone with the rewrite.)
- Card 3 multiply blend on a 200×240 SVG with 3 blurred circles: cheap. Verified safe on iOS Safari and Firefox.

---

## 6. Risks the engineer might get wrong

1. **`mix-blend-mode: multiply` inside a transformed SVG.** If the engineer wraps the Card 3 `<g multiply>` in a parent that has `transform`, `opacity < 1`, or `filter`, Safari will create a new stacking context and the multiply will blend against transparent black instead of the card cream. Result: blooms go nearly black where they overlap. Fix: keep the multiply group at the SVG root level; do not put any opacity/transform/filter on its ancestor inside the SVG. Animate child `<g>` transforms instead.

2. **`feGaussianBlur` GPU thrash.** Animating `stdDeviation` per frame (rather than keeping it constant and animating scale) will repaint the filter region every frame and burn battery on low-end devices. Spec says scale-only for the bloom expansion; do not animate `stdDeviation` or `feDisplacementMap scale` faster than 16ms steps. The 700ms `scale=14→6` animation on Card 1 is fine because it's a one-shot, but it MUST be `transform: scale()` on the parent `<g>`, NOT a `stdDeviation` animation.

3. **`animation-play-state` getting stuck.** When the card scrolls out, animations should pause. When it scrolls back in, they should NOT auto-replay — they should hold at their settled state. Easy bug: re-using a single `playState` ref that gets flipped back to `running` on re-entry, restarting the keyframes from 0. Fix: once `inView` flips true, do not flip it back. The existing `useInView` hook already does this correctly — preserve that semantic in any per-card refactor.

4. **Hover-replay re-mounting the wrong subtree.** Bumping `replayKey` should re-mount only the inner animating `<g>` (or the drop+ripple+bloom group), NOT the entire SVG (which would re-fetch the filter and cause a flicker on first paint). Use the key on the inner group.

5. **`feTurbulence` seed determinism.** Different browsers compute `feTurbulence` slightly differently; the bloom edge will look subtly different across Chrome / Safari / Firefox. This is acceptable. What is NOT acceptable is the seed re-rolling on every render — the engineer must hard-code seed integers (3, 7, 11 for the three cards) in the markup, not derive them from `Math.random()` at mount.

6. **Cream-on-cream contrast trap.** The card border at `rgba(15,12,10,0.06)` is borderline invisible on some monitors. Don't bump it to fix that — the design wants the cards to barely separate from the section. If QA flags it, fix by making the section background a hair warmer or the card grain a hair stronger; do NOT add a visible border or a shadow.
