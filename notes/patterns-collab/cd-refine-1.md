# cd-refine-1.md — Creative Director, refinement pass 1 on live build

Reviewed in browser at 1440×900 desktop and 390×844 mobile. Section reached
via natural scroll; cards observed through at least one full play and a
hover-replay. Screenshots referenced by index below correspond to the
captures taken during this run (D1, D2 = desktop frames; M1, M2, M3 = mobile
frames at Card 1, Card 2 / 3 hand-off, Card 3 close).

---

## Live-build verdict

The bones are right. Three cream plates, brand-orange ink, the surface line
at the same y across all three, the locked copy verbatim, Card 3's drop-3
landing late, the hover-replay re-mounting only the animating subtree —
all there. The gap from north-star is composition: at the actual rendered
size the bloom diameters and the margin-note anchors collide far more than
the spec's viewBox math predicted. Card 2 in particular reads as "two
questions stacked in one orange cluster" rather than "one act of holding,
then a second act." That is the one thing I would not ship as-is.

---

## Per-card live-build notes

### Card 1 — Intake (ref: D1, M1)

- **Outline is reading as a ring AROUND the bloom, not the bloom's silhouette.**
  At rendered size the `feDisplacementMap` scale=6 final state barely deforms
  the circle, so the pre-baked path `d="M 56 168 C 52 150 ..."` looks like an
  inscribed oval offset inward from the soft bloom edge. The reading becomes
  "ink, plus a ring drawn around it" — two objects, not one resolved object.
  Two ways to fix; pick one, don't do both:
  - **Preferred:** raise the final displacement scale from 6 to 8 (keep the
    14 → 8 ramp), so the bloom edge stays organically irregular at settle, and
    leave the outline as is. The outline then re-reads as "tracing the now-
    irregular silhouette."
  - Alternative: scale the outline path outward by ~6%. Move the path's
    control points outward from `(100, 168)`: e.g. `M 52 168 C 48 146 68 124
    96 122 C 124 120 148 140 148 166 C 150 192 124 210 100 210 C 72 212 58
    190 52 168 Z`. Keep displacement at 6.
- **Phrase connector lengths fall short of the bloom edge on mobile** (M1).
  "I cook for my mother." connector terminates ~50px shy of the bloom rim;
  "Mornings are the good hours." likewise. The 32px hard-coded connector
  was fine at desktop card width (~339px) but on mobile the plate is ~720px
  wide and the gap between phrase and bloom is much larger. Either bump
  the connector to `clamp(32px, 7vw, 64px)` on its inline SVG width, or set
  phrase positions to be a closer in absolute %: `left: 18%` instead of
  `8%` for phrase 1; `right: 18%` for phrase 2. The latter is the cleaner
  fix — keep the connector length absolute, tighten the layout.
- **`text-ink` resolves to `rgb(15, 20, 25)`, not `#0F0C0A`.** This is a
  token-level miss (Tailwind config maps `ink` to a cool blue-ink, not the
  warm `#0F0C0A` the spec calls). It affects every card and the closing
  line. Either remap `text-ink` to `#0F0C0A` at the token, or use explicit
  hex on the phrases and titles. The current cool-ink fights the warm cream
  paper and the brand-orange bloom; the type reads slightly cold against
  warm context.

### Card 2 — Reflection (ref: D1 right-of-center, M2)

- **The Q1 ghost text sits INSIDE bloom-B at settle.** "What made that
  possible?" at 30% opacity is currently rendered at `(left: 8%, top: 62%)`,
  which on the rendered plate overlaps bloom-B's filled disc. Visually this
  reads as "a faint inscription written across the new ink stain" — wrong
  metaphor. Q1 should sit on the paper BESIDE its own bloom-A ghost, to the
  left of the plate, well clear of bloom-B. Move Q1's anchor to
  `{ left: 6%, top: 78%-82% }` (below bloom-A's center y=168/240=70%, so the
  muted note lives *under* the ghost of bloom-A, with its connector pointing
  up-right to the ghost's rim). Q2 stays at its current
  `{ right: 8%, top: 44% }`. That gives two distinct visual clusters: ghost
  + muted question on the lower-left, saturated bloom + live question on
  the upper-right.
- **Bloom-A ghost is essentially invisible** at the final state. Spec calls
  for opacity 0.05 + saturate(0.3) — at this rendered size, 5% ink against
  cream-with-grain reads as nothing. Bump the ghost's final opacity from
  0.05 to 0.10 and keep saturate(0.3). The ghost needs *body* (CD pass-2 §3
  Card 2 explicitly said "not 1%, not a hairline; ghost has body") and at
  0.05 it's below the threshold.
- **The 1.6s hold + 800ms gap read correctly in browser.** Not too long.
  Confirms the spec; resist any future suggestion to compress.
- **Q2 text wraps to three lines** at desktop card width (the phrase
  "What does that say about you?" gets broken to "What does that say about /
  you?"). The 3-line stack feels heavier than Q1's tighter 2-line wrap. Bump
  the `maxWidth` on MarginNote from `18ch` to `22ch` for Card 2 only — gives
  Q2 a chance to land at 2 lines and reduces visual weight imbalance between
  the muted Q1 and the live Q2.

### Card 3 — Continuity (ref: D1 right card, M3)

- **The "Today / I cooked on Sunday." note sits INSIDE bloom-3 on mobile**
  (M3) — text appears written across the saturated stain. At desktop the
  note is just clear of the rim, but on mobile/tablet the bloom grows
  proportionally larger and the note's `left: 70%, top: 70%` anchor lands
  inside the disc. Move note 3 to `left: 78%, top: 78%` (further down-right)
  so it sits on cream just below-right of bloom-3 in all viewports. The
  "Today" timestamp in `#B5511A` against orange ink is also unreadable when
  it lands on the bloom — moving it off the disc fixes the contrast issue
  in one shot.
- **Note 1 "Sundays are the hardest." with `side="left"`** means the text
  sits to the RIGHT of its anchor with a connector pointing left-back. But
  the text box at `left: 42%` puts the text's left edge at 42% of plate
  width, which on desktop is at x ≈ 142px — and bloom 1 is centered at
  x=132. So the text starts inside bloom 1. Move note 1's anchor to
  `{ left: 48%, top: 30% }` so the text starts cleanly to the right of
  bloom 1.
- **The arc reads correctly.** Three blooms tracing down-right, not a
  horizontal line; drop 3 lands noticeably later than 1→2 spacing; multiply
  blend deepens the overlap visibly without crushing to brown. The hero
  beat of this card lands.

---

## Connective divider + section composition

- **The divider is rendering INSIDE the eyebrow row, not between rows.**
  Verified in DevTools: `gridTemplateRows: 451.547px 41px 128.625px`, the
  divider has `gridRow: 2`, AND the eyebrow has `gridRow: 2` (via
  `lg:row-start-2`). They collide. Divider span sits at y=732 while the
  eyebrow row spans y=716–748. The hairline literally cuts through the
  icon circle and the eyebrow text. Fix: change the grid to four rows:
  `lg:[grid-template-rows:auto_auto_auto_1fr]`. Re-assign:
  - Plate visual: `lg:row-start-1`
  - Divider: `lg:row-start-2` (its own row)
  - Eyebrow: `lg:row-start-3`
  - Title + body: `lg:row-start-4`
  And drop `lg:my-5` on the divider down to `lg:my-4` since the row now
  owns the vertical breathing.
- **Once the divider is in its own row,** the line reads almost too quiet
  at `bg-ink/10`. Bump to `bg-ink/15` on desktop. It should be a deliberate
  beat connecting the three cards, not a near-invisible accident.
- **Eye flow across the three cards is good.** Cards 1 → 2 → 3 read as
  three acts in the same gestural language. Card 2's middle position lets
  its silence register against the busier Card 1 and Card 3.
- **The closing line "This is what makes it coaching, not chat."** is
  rendering in `font-sans` (Hanken Grotesk) at 16px. Inside a section whose
  voice has been set by serif italic patient phrases and serif titles,
  closing in body sans-serif drops the register at the worst moment. Change
  to: `font-serif text-[19px] md:text-[22px] italic text-ink`. Same right-
  align, same right-side anchor at `lg`. Reads as the page's quiet thesis,
  not a UI body label.
- **Top gap above h3 measures 192px (lg:mt-48)** — correct. Bottom padding
  to next section is functionally fine; the abrupt next-section image
  beneath isn't this section's problem.

---

## Type + color calls

- **Closing line:** change `text-[15px] leading-relaxed text-ink md:text-base`
  to `font-serif italic text-[19px] md:text-[22px] leading-snug text-ink`.
- **Card titles (`h4`):** currently `text-[19px] md:text-[20px]` — feels
  slightly small at desktop against the 36px h3. Bump desktop to
  `lg:text-[22px]`. Mobile stays at 19px.
- **`text-ink` token mismatch:** the spec specifies `#0F0C0A` (warm near-
  black) but Tailwind config resolves `ink` to `#0F1419` (cool blue-black).
  Either:
  - Remap `text-ink` at the token to `#0F0C0A`, or
  - Override on this section only by setting `style={{ color: "#0F0C0A" }}`
    on the h4, phrase, and margin-note text.
  The cool ink reads slightly off against the warm cream/orange context.
  Worth fixing for the whole page; this section is where it shows worst.
- **The `01 / 02 / 03` serif labels** at `text-[12px] text-ink-muted/70` feel
  about right; if anything, drop to `text-ink-muted/60`. Spec said "drop
  another notch if still bright" (§9 risk 7).
- **Eyebrow text** "INTAKE / REFLECTION / CONTINUITY" at `tracking-[0.22em]`
  is a touch tight against the 8px icon circle gap — bump tracking to
  `tracking-[0.24em]`. Trivial.
- **Phrase connectors** at `rgba(15,12,10,0.20)` against cream are right.
  No change.

---

## Performance / motion smoothness

- **No GPU thrash observed.** Bloom expansions are scale-on-`<g>`,
  feDisplacementMap animates once via SMIL, no per-frame stdDeviation.
- **No jitter on scroll-in.** Cards animate as their own observers fire,
  with no fight against the section-wide reveal.
- **Hover-replay re-mount is clean** — verified on Card 1; the inner `<g>`
  re-keys without flickering the filter. Card 2's hover-replay flow path
  was not verifiable via synthetic mouseenter (React intentionally doesn't
  fire mouseenter on non-bubbling synthetic events); needs a real mouse
  hover on touch-capable hardware to confirm. Listed in watch-list.
- **No console errors.** Console clean during section playthrough.
- **Reduced motion final state**: I confirmed via DOM that Card 2 reaches
  stage 2 and Q1 lands at opacity 0.3 — but I could not toggle the OS-level
  `prefers-reduced-motion` from the preview environment. Listed in watch-
  list for verification on a real OS toggle.

---

## Watch-list for refinement-pass-2

- Real OS-level `prefers-reduced-motion` toggle in System Settings, verifying
  Card 2 lands at stage 2 with bloom-A as a 5–10% filled ghost and Q1 muted
  on the initial paint (not after a delay).
- Real hover-replay on Card 2 with a physical mouse: confirm the full 8s
  cycle plays cleanly on a re-trigger and the gap still reads.
- iOS Safari `mix-blend-mode: multiply` on Card 3's overlap region — sample
  on a real device, not just desktop Safari. Per §9 risk 1 the multiply can
  crush to brown under certain stacking contexts.
- Cream-on-cream plate edge on a real low-end LCD or conference-room
  projector — the inset 6% hairline border is at the rendering threshold
  by design; verify before declaring done.

---

## One-line creative direction (refined from cd-signoff)

**Composition is the next mile — at rendered size the bloom diameters and
the margin-note anchors collide in ways the spec's viewBox math could not
predict; move the text off the ink, give the divider its own row, warm the
ink token back to `#0F0C0A`, and let the closing line resolve in serif italic
the way the patient phrases do.** The metaphor of absorption is intact; the
job now is to stop letting the text fall into the stain.
