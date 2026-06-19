# plan-v1.md — Three Patterns Animation Spec

## 1. Concept — "The Shape of Listening"

**Unifying metaphor: ink + water.** Motivational Interviewing is a discipline of slowing down — letting what a person says land before responding. The illustrations treat speech as a substance that disperses through paper: a single drop of brand-orange ink dropping into a still pool of cream paper, blooming outward in soft, unhurried diffusion. Every card uses the same physical "ink-in-paper" vocabulary but applied to a different temporal stage.

Why this honors MI: MI's three movements are *receiving*, *reflecting*, and *accruing*. Ink does all three — it absorbs into fibers (receive), spreads in a shape determined by what's already there (reflect, not impose), and stains permanently, building density over time (accrue). It is the opposite of a "chatbot reply": no flash, no token-by-token typing, no answers. Slow blooms, patient absorption.

It is also categorically *not* dashboard UI, not neural-net mesh, not orbs, not vault icons. It's a craft object — closer to Stripe Press or a clinical journal plate than to SaaS.

**Through-line:** Card 1 = one drop dispersing into a blank field. Card 2 = the field gently moving so a new drop blooms in a different place each cycle. Card 3 = many drops over time, overlapping into a single accumulated mark with depth. Same ink. Same paper. Three speeds of listening.

---

## 2. Per-Card Specs

### Card 1 — Intake · "The First Drop"

**Visual idea (one sentence):** A single drop of warm ink falls into a cream field and slowly blooms outward, its edge resolving into a soft, hand-drawn shape that *is* the silhouette of this specific person.

**Canvas at rest (pre-inView):** A near-empty cream square (paper-warm). One hairline horizontal — the "surface" — across the lower third, at 12% ink. Tiny serif label top-left: `01 / who`. A faint dashed circle at center (the ink's eventual outer radius) at 8% ink. No drop yet.

**Animation (runs once on inView, ~3.6s, then rests; replays on hover):**

| t (ms) | beat | what happens | easing / dur |
|---|---|---|---|
| 0 | drop forms | Small 6px orange disk fades in 40% above center; opacity 0 → 1 | dur-state / ease-out-soft |
| 280 | drop falls | The disk translateY from -28% to 0, scale 1 → 0.85 (compresses on impact) | 540ms / ease-out-expo |
| 820 | impact | A flat ring (SVG circle, no fill, brand-600 at 50% alpha) snaps out from r=2 → r=22, opacity 0.5 → 0 | 320ms / ease-out-quart |
| 820 | bloom begins | A radial-gradient `<feGaussianBlur stdDeviation="6"/>` blob (brand-600 inner, brand-300 outer) scales 0.1 → 1.0 from impact point | 1100ms / ease-out-expo |
| 1100 | bloom edge irregularizes | The blob's clip-path morphs from circle to an organic blob path (5-point bezier with low-amplitude noise — pre-computed, two keyframes, NOT live randomness) | 900ms / ease-out-quart |
| 1700 | facets resolve | Five tiny serif labels fade in one by one around the bloom — *values, culture, stress, rhythms, goals.* Each is hairline-connected to a point on the bloom edge with a 1px ink/20 line. Stagger 140ms. Each label: blur(4) opacity 0.12 → blur(0) opacity 1, 600ms ease-out-quart | reuse `revealItem`-style |
| 2400 | settle | The bloom's saturation drops 15% (it "absorbs"); a faint hairline outline traces the final shape, drawn left-to-right via stroke-dashoffset | 800ms / ease-out-expo |
| 3200 | rest | Holds. Soft 4s breathing (scale 1 → 1.012 → 1) on the bloom only, indefinitely | 4s ease-in-out infinite |

**Loop behavior:** Plays once on inView. Replays on card hover (re-trigger via key bump). Does NOT auto-loop — the *first* time matters most; auto-loop would cheapen it.

**DOM/SVG structure:**
```
<div absolute inset-0 (paper-warm bg)>
  <span: hairline surface line>
  <span: top-left serif "01 / who">
  <span: dashed perimeter circle, 8% ink>
  <svg viewBox="0 0 200 200">
    <defs>
      <radialGradient id="ink"> orange→deep-orange </radialGradient>
      <filter id="bleed"><feGaussianBlur stdDeviation="6"/></filter>
      <clipPath id="bloomShape"><path d="M…organic…"/></clipPath>
    </defs>
    <circle class="drop" .../>      // the falling drop
    <circle class="ripple" .../>    // impact ring
    <g clip-path="url(#bloomShape)" filter="url(#bleed)">
      <circle class="bloom" fill="url(#ink)" .../>
    </g>
    <path class="bloom-outline" stroke .../>  // hairline trace, drawn last
  </svg>
  <ul: 5 facet labels, absolute positioned around bloom, with connector spans>
</div>
```

**Color/texture:** Cream `bg-paper-warm`. Ink: `#F9904D` core → `#FF7434` rim → fades to `rgba(249,144,77,0.08)` at edge. Hairlines `ink/15`. Labels `text-ink` 12px serif italic for the words themselves (`Newsreader italic 12px`), `text-ink-muted` 10px sans uppercase tracking-[0.18em] for the index numbers `i.` `ii.` etc. Subtle paper grain: a 4% opacity `card-1-bg.jpg` washed over the whole thing at `mix-blend-multiply`. No drop shadow on the bloom — it's *in* the paper, not on it.

**Reduced motion:** Final state shown immediately: bloom fully formed, outline traced, all five labels visible. No drop fall, no ripple, no breathing.

**Must NOT become:** A dashboard. A donut chart. A radar/spider chart of "personality dimensions." A brain icon (we're explicitly retiring `brain-empty.svg`/`brain-loading.svg`). A checklist with checkmarks. A profile silhouette. An MRI/scan. A wireframe head.

---

### Card 2 — Reflection · "The Returning Drop"

**Visual idea (one sentence):** A drop falls, blooms into a question, dissolves; another drop falls in a different position, blooms into a different question — the field never fills, because reflection is not accumulation, it is recurrence.

**Canvas at rest:** Same cream field, same hairline surface line, top-left label `02 / how`. A *very* faint trace of the previous bloom remains as 4% ink ghost — proof of the rhythm.

**Animation (continuous loop, ~5.2s per cycle, 4 questions total = ~21s, then restarts):**

Each cycle (one question):
| t (ms) | beat | what happens |
|---|---|---|
| 0 | drop appears | Drop fades in at a *new* position along the surface line (positions stored as 4 preset coords — left-30%, right-65%, left-45%, right-55%) |
| 280 | drop falls | Same compress-on-impact as Card 1 but shorter (340ms) |
| 620 | bloom + question text | Bloom expands (700ms ease-out-expo). The question text fades in *inside* the bloom, blurred → sharp (blur(3) → blur(0), opacity 0.12 → 1, 600ms ease-out-quart). Text is `Newsreader italic 17–19px text-ink`, NOT white-on-orange. The orange is a wash *behind* the words at ~28% alpha. |
| 1600 | hold | 1.6s pause. The question sits. This is the most important beat in the whole section — silence is content. |
| 3200 | absorb | Bloom desaturates to 8% alpha over 900ms; question text fades to 25% opacity (it doesn't disappear — it joins the paper) |
| 4100 | trace leaves | A hairline outline of the bloom remains (1% ink) as a permanent ghost; the orange wash is gone |
| 4400 | gap | 800ms of stillness. THIS IS NOT DEAD AIR. It's the room between questions. |
| 5200 | next cycle | Next drop, next position |

**Questions (rotate):** The four from `SESSION_MESSAGES`:
- *What made that possible?*
- *What does that say about you?*
- *Where else in your life might that be true?*
- *What would feel different next week?*

**Loop:** Continuous while inView. Paused when card is off-screen (animation-play-state).

**DOM/SVG structure:** Single SVG, four pre-rendered bloom positions as `<g>` groups with their own clip-paths. JS `setInterval` cycles which group is "active" via a class. Question text is HTML overlay positioned absolutely over the active bloom's centroid (not inside the SVG — easier for typography and i18n later).

**Color/texture:** Same palette as Card 1. The question text MUST be ink-on-orange-wash, NOT white. White would feel digital. We want it to feel like reading a margin note in a book where ink has bled slightly into the paper around the words.

**Reduced motion:** All four questions visible at once, in their four positions, at low opacity (~0.5) with their bloom outlines, no animation. A "score" of the section's rhythm shown all at once.

**Must NOT become:** Floating chat bubbles. A speech-bubble grid. The current rotating dark glass card with the AIOrb (which reads as "AI dashboard"). Word clouds. A typewriter effect. A "thinking" indicator. Quotation marks.

---

### Card 3 — Continuity · "The Stain That Builds"

**Visual idea (one sentence):** Many drops land over time in roughly the same place, overlapping into a single dense, layered stain whose deepest center is the current session — proof that relationship is what accumulates, not data.

**Canvas at rest:** Cream field, surface line, top-left label `03 / over time`. Three faint vertical hairline ticks below the surface line, labeled (serif italic 11px): *six weeks ago · last week · today.*

**Animation (runs once on inView, ~4.4s; replays on hover):**

| t (ms) | beat | what happens |
|---|---|---|
| 0 | first drop | A drop falls onto the *leftmost* tick (six weeks ago) and blooms. Bloom at ~60% size, ~50% saturation — it's old, partly absorbed. | 900ms total |
| 900 | second drop | Drop falls onto the *middle* tick, overlapping the first bloom's right edge by ~30%. Bloom at ~75% size, ~70% saturation. Where the two overlap, a multiply blend makes the color visibly deeper. | 900ms |
| 1800 | third drop | Drop falls onto the *right* tick (today), overlapping the second by ~35%. Bloom at full size, 100% saturation. | 900ms |
| 2700 | the dense center reveals | The overlap region — where all three blooms intersect — pulses once (saturation 100 → 120 → 100, 700ms). A 2px brand-600 hairline outline traces just the overlap zone (the "deepened relationship"). | 700ms ease-out-expo |
| 3400 | margin notes | Three small serif italic phrases fade in beside their respective ticks, blur → sharp: *"Sundays are the hardest." · "Cooking grounds me." · "Building on both."* Stagger 200ms. | 600ms each |
| 4400 | settle | Hold. A very slow breathing pulse on the deepened overlap only — 6s cycle, scale 1 → 1.008 → 1. | infinite |

**Loop:** Once on inView; replays on hover. Does not auto-loop — accumulation should feel *earned*, not GIF-y.

**DOM/SVG structure:**
```
<svg viewBox="0 0 240 200">
  <surface line>
  <three ticks with serif labels below>
  <filter id="bleed"/>
  <g style="mix-blend-mode: multiply"> 
    <g class="bloom-1"><circle filter="bleed" .../></g>
    <g class="bloom-2"><circle filter="bleed" .../></g>
    <g class="bloom-3"><circle filter="bleed" .../></g>
  </g>
  <path class="overlap-outline" stroke .../>
</svg>
<ul: 3 margin notes positioned next to ticks>
```
`mix-blend-mode: multiply` is the load-bearing trick — it gives the natural ink-overlap deepening without us having to hand-paint a third color.

**Color/texture:** Same `#F9904D` ink throughout. Multiply blend creates the deeper tones at intersections (no new palette colors). Margin notes in `Newsreader italic 12–13px text-ink`. The "today" tick label is `text-brand-700`; the older two are `text-ink-muted`.

**Reduced motion:** Final composed image — three overlapping stains, full saturation, outline traced, all three margin notes visible — shown immediately.

**Must NOT become:** A timeline of dots connected by a line (← the current `MemoryVisual` exactly). A "memory graph." Pipeline UI. A progress bar. Stacked chat bubbles. Calendar squares. A literal journal page. Tree rings (too literal). DNA helix.

---

## 3. Connective Tissue — The Thread

**Verdict: evolve, don't keep, don't fully replace.**

The current horizontal `<Thread>` between cards (a pulse-dot traveling left-to-right along a hairline) is generic dashboard syntax. It implies a pipeline. The whole point of the new metaphor is that these are NOT three stages of a pipeline — they are three speeds of the same act.

**Replacement:** Replace the traveling pulse with a single **horizontal hairline at 12% ink** that doesn't move. Drawn left-to-right once on inView (stroke-dashoffset, 1300ms ease-out-expo) — same restraint, no pulse-dot.

Above the line, near each card's centroid, a tiny **drop marker** (3px brand-600 disk) fades in at staggered delays (240ms, 420ms, 600ms after the line completes). These visually echo the "drop" motif inside each card and tie the three illustrations together as variations of the same gesture. No movement after fade-in.

Below the line, retain the existing right-aligned three small tick-marks (`w-3, w-2, w-1.5`) — they read as a faint trailing-off, which suits the "this is where the page exhales" moment before the closing line.

Mobile: hide the line and dots entirely (already hidden via `hidden lg:block`), since the cards stack and a vertical pipeline would be wrong for the metaphor.

---

## 4. Open Questions for the Creative Director

1. **Ink color discipline.** Should all three cards use ONLY `#F9904D` / `#FF7434` (the brand range), or do we let Card 2 borrow a *trace* of the Millie plum (`#B8617C`) to subtly nod that Reflection is the move that crosses Roni and Millie's disciplines? My instinct: pure orange — adding plum dilutes the metaphor. But it's a taste call.

2. **The "ink" itself — flat vs. textured.** Pure SVG with `feGaussianBlur` gives a clean, Linear-y diffusion. A raster paper texture (`mix-blend-multiply` over a hand-scanned ink blot PNG) would feel more clinical-journal, more Stripe-Press. The latter is heavier (1 PNG per card, ~30–60KB each) but radically more distinctive. Which side of the craft/perf line?

3. **Question text in Card 2 — serif italic or sans?** Serif italic (`Newsreader italic`) leans literary, marginalia, like a clinician's notebook. Sans leans modern product. The literary direction is more distinctive and pairs with the ink metaphor — but it risks feeling "precious" for a CHRO audience. CD call.

4. **Card 3's three timestamps — should they be specific ("Mar 4 · Mar 18 · Today") or relative ("six weeks ago · last week · today")?** Specific feels clinical, like an EHR. Relative feels human, like the way a coach actually remembers. I've speced relative; flagging in case CD wants the clinical register instead.

5. **Closing line treatment.** "This is what makes it coaching, not chat." currently sits right-aligned in body copy. With the new ink metaphor, should we draw a final tiny ink drop just before the line as a closing punctuation? It would tie the page off but risks being twee. I lean against, but it's exactly the kind of detail that pushes Awwwards-level when restrained.
