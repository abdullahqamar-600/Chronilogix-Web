# Brief — Motion Designer

Owner: Motion Designer. Author: Creative Director. Source of truth:
`notes/agents/01-copy-v2-canonical.md`. Read `cd/master-plan.md` first.

You own the motion vocabulary across seven sections. Return a
`motion/<scene>-spec.md` per scene, in the order below.

The core rules (locked):

- Only ease-out curves. The existing tokens are `--ease-out-expo`,
  `--ease-out-quart`, `--ease-out-soft`. Custom cubic is allowed only if
  none of those fit and you can justify why.
- Durations: `--dur-quick 180ms`, `--dur-state 320ms`,
  `--dur-reveal 700ms`, `--dur-reveal-long 1100ms`. Add a new token only
  if necessary; name it.
- Reveal vocabulary is the blur+opacity word reveal from `Hero` and
  `Statement` Scene 1. New reveals layer onto that grammar.
- `prefers-reduced-motion` is real. Every scene needs a fallback.
- Performance: transform/opacity/filter only. No layout-shifting
  animation.

---

## Wave 1 — fix the broken beats

### M1.1 — Statement Scene 3: the demo *(replaces orbit cards)*

The phone keeps rising as it does today. Scene 3 now plays the
conversation **inside the phone screen** (Illustration provides the chat
surface and bubble assets). Around the phone:

- The Scene-1 sentences fade out as they do today.
- A new **left-column copy reveal** kicks in: eyebrow → headline → body
  → caption, all blur+opacity word reveal. Pacing should feel
  considered, not fast. Stride per word ~80–95ms.
- The chat conversation animates inside the phone with these beats:
  1. `Hi Christopher 👋 Ready for today's check-in?` enters from the
     top, blur+opacity, ~600ms.
  2. Member reply enters from the right, settles. Pause ~700ms.
  3. **Typing indicator** appears (three cream dots, staggered scale
     pulse, 1.0 → 1.1 → 1.0, looping at ~600ms cycle) for ~1.4s.
  4. Coach's second message enters, blur+opacity.
- Scene 3 must resolve fully before scroll runway ends — viewer should
  not have to scroll past the conversation to read it.
- After the third bubble lands, hold for ~1200ms before the section
  exits, so the reader can absorb the beat.

Spec scroll progress bands precisely (`0.55 → 0.62` for left copy,
`0.62 → 0.92` for conversation, `0.92 → 1.0` rest).

Antipatterns:
- No "fade out the orbit cards then fade in the demo". The cards die in
  code, not in motion. Scene 3 starts from the demo.
- No typing-indicator bounce. The three dots pulse, they do not jump.
- No phone "snap" to a new position when the demo starts.

### M1.2 — How it works rail motion *(Connect / Configure / Deploy)*

Three step cards in a rail. Motion behavior:

- Each card enters on intersection observer at threshold 0.25, with a
  90ms stagger between the three.
- Inside each card, the illustration has a "kinetic moment" — the field
  checks (Connect), the tile-lights (Configure), the clock-tick (Deploy).
  These play **after** the card itself has settled, with a ~250ms
  beat between card settle and illustration start.
- All three illustrations idle after their kinetic moment. On scroll-out
  and re-entry, the illustrations replay once (re-key on intersection).
- The number labels (`01`, `02`, `03`) appear *before* the
  illustration kinetic moment, with the existing hairline-rule
  scaleX-from-left reveal pattern that the current Three-patterns section
  uses.

Pacing target: total time from "card enters viewport" to "illustration
resolved" should sit at ~1100ms per card.

### M1.3 — Use cases scroll mechanic *(touches WhoWeServe.tsx)*

The current sticky-section mechanic works — the per-persona crossfade
is correct. The motion brief here is mostly **light touch + fix**:

- The current per-word blur reveal for each persona's headline +
  description stays. Lengthen the per-word stride from 55ms to 70ms on
  desktop — current pacing feels rushed against the long headlines.
- The persona-list active indicator (the 2px white tick) currently
  pops in / pops out. Soften: fade in + height-grow ease-out-expo at
  600ms. No change to the active-button color transition.
- For the four personas without a real background image
  (Brokers, Health Plans/ACOs, Wellness Platforms, Governments), the
  Illustration spec will provide a pattern alternative. Spec the
  cross-fade between persona backgrounds at the existing
  `--dur-reveal-long` token. No change there.
- When the section enters viewport (scroll-in), give the bottom
  `Book a Demo` pill a 220ms delayed fade-up so it does not compete
  with the headline reveal.

### M1.4 — Proof in numbers stat reveal *(replaces ProofPoints)*

Eight stat cards plus an ROI band. Motion:

- Card grid enters on intersection observer at 0.20. Cards reveal with
  a wave stagger — top-left first, sweeping diagonally to bottom-right.
  Per-card stagger 65ms.
- Inside each card, the **big number tick-up** runs after the card
  settles (450ms delay). For numbers like `+43%` or `−55%`, the tick
  goes 0 → final value, easing out-expo, 800ms. For `0.3–0.9%`, animate
  the range as two tickers in parallel. For `1/20th`, no tick — fade
  the entire glyph in.
- Source attribution line fades in after the number resolves, +180ms.
- The ROI band reveals as a **single sweep**: the four-step chain
  (1,000 → 250 → 50% → $500 → $62,500) draws its connectors
  left-to-right, scaleX-from-left, 900ms total, with each terminal
  number tick-up timed to the moment the connector reaches it.

### M1.5 — Statement Scene 1 + 2 — preserve

No changes to Scene 1 word reveal or Scene 2 phone rise. They work.
Touch only what Scene 3 needs.

---

## Wave 2 — add what's missing

### M2.1 — Core capabilities reveal *(four alternating blocks)*

Each block enters on intersection at 0.25. Image well and text column
animate as a **pair**, with the image arriving 90ms behind the headline
reveal so the eye lands on the headline first.

Inside each image well, the illustration's kinetic moment (Illustration
spec'd) plays once on entry, with a re-key on re-entry. Pacing target:
~1300ms total per block from "in view" to "settled".

### M2.2 — Trust & security pillars *(five-icon grid)*

Pillars reveal in a single sweep, left-to-right at desktop, top-to-bottom
at mobile. Stagger 80ms. Each pillar's icon has a tiny **draw-in** —
SVG stroke-dasharray, 600ms ease-out-expo, after the pillar's text has
settled. The icon is the reward for reading the pillar.

The HIPAA-shield-with-"in-progress-arc" specifically: the arc draws *after*
the shield is fully drawn, telling the temporal story (built then
in-progress). Spec the order.

---

## Wave 3 — depth and polish

### M3.1 — Agent depth: animate the second layer

Illustration is adding a paired thin-arc waveform behind the dashed ring
on each AgentStrip. Spec:

- The arc has a **breathing rotation** — extremely slow, ~30s per
  revolution, alternating direction between Roni and Millie so they
  don't read as twins.
- The arc's stroke opacity oscillates in a 12s cycle, 0.4 → 0.7 → 0.4.
- The new "today · 8:41" session affordance pulses very subtly with the
  existing halo cycle — 8s, opacity tied to the existing keyframe phase.
- Optional ambient particle layer (if Illustration shipped one):
  drift in a slow vertical scroll, ~40s per pass, low density,
  low opacity. Kill on `prefers-reduced-motion`.

Nothing here can compete with the existing halo pulse. This adds presence;
it does not add commotion.

### M3.2 — Hero copy refresh — keep current motion

No new motion required. The existing word-blur reveal works for the new
headline. The new secondary `See it work →` link inherits the existing
tail-reveal at progress 0.78.

### M3.3 — Problem section resolution — single new beat

The new resolution paragraph after the three facts: single blur+opacity
fade-up on intersection. Standard pattern.

If the 58% pull-stat band ships, give the band a number tick-up (0 → 58)
at intersection, 900ms ease-out-expo, with the unit `%` fading in at
the 70% mark of the tick.

---

## Cross-cutting

- A new token may be useful: a "settle hold" duration for end-of-scene
  pauses (~1100–1200ms). If you spec one, name it `--dur-settle` and
  document where it's used.
- Document the reduced-motion fallback **per scene**, not as a global
  paragraph. Each spec says exactly what each animation collapses to.

## Hand-off

Each spec lands as `motion/<scene>-spec.md`. Include the timeline table,
the scroll progress bands, the easings, the per-element stagger values,
and the reduced-motion fallback. If you depend on an illustration
deliverable, name it.
