# cd-signoff.md — Creative Director final review of plan-final.md

## Verdict

**APPROVED-WITH-FIXES**

The plan absorbs almost every sign-off condition from cd-pass-2 cleanly and at the right level of specificity. The Card 1 order-of-beats, the Card 2 hold/gap, the Card 3 drop-3 delay, the locked copy, the cream-on-cream plates, the source comments, the per-card observer — all landed. Three small but real misses below.

---

## Sign-off-condition check

| # | Condition from cd-pass-2 §6 | Status | Location |
|---|---|---|---|
| 1 | Cut Card 2's "20s idle auto-replay" — hover-replay only | ✓ applied | §4 Loop behavior; §10 checklist item 5 |
| 2 | Card 1 drop: remove `scale 1→0.85` compress-on-impact | ✓ applied | §3 timeline row 1 (`no scale compress`); §6 `inkDropFall` is translate-only; §3 anti-patterns explicitly forbids it |
| 3 | Card 2 ghost density: 4–6% filled ink silhouette, not 1% hairline | ✓ applied | §4 Color values; §6 `inkAbsorbToGhost` ends at opacity 0.05 + saturate(0.3) |
| 4 | Card 3: restore hairline surface line at same y as Cards 1 and 2 | ✓ applied | §5 Canvas at rest; `<line ... y1="168" y2="168">` matches Cards 1 and 2 |
| 5 | Card 3: drop timestamps on Bloom 1 and 2; keep only *today* on Bloom 3 | ✓ applied | §5 Timestamps paragraph; `timestamp={false}` on notes 1–2, `true` on 3 |
| 6 | Card 3: rewrite to `"I cooked on Sunday."` (drop "This week") | ✓ applied | `CONTINUITY_NOTES[2].text` reads exactly `"I cooked on Sunday."` |
| 7 | Card 1: lock `"I cook for my mother."` + `"Mornings are the good hours."`; reserve `"My dad had the same thing."` | ✓ applied | `INTAKE_PHRASES` constant; ship comments on slots 0/1, reserve on slot 2 |
| 8 | Section top gap: lock at `mt-32 md:mt-40 lg:mt-48` | ✓ applied | §2.1; checklist item 1 |
| 9 | Add load-bearing source comments (Card 2 silence; Card 3 late drop) | ✓ applied | §4, §5, §8 step 4 & 5 |
| 10 | Card 1: phrases attach to still-soft bloom (before feDisplacementMap scale completes); outline traces last | ✓ applied | §3 timeline (phrase 1 at t=2000, edge sharpen completes t=2400, outline t=3000); explicit "Order is sacred" paragraph with required source comment |
| 11 | (cd-pass-2 §3 Card 1) `01` label dropped to `text-ink-muted/70` | ✓ applied | §3 Canvas at rest; §3 Color values |
| 12 | (cd-pass-2 §3 Card 2) intent signal at rest — 1px hairline arc at ink/08, ~30% chord, at canvas-left where surface meets margin | ✓ applied | §4 Canvas at rest; explicit `<path>` markup with required source comment |
| 13 | (cd-pass-2 §5.2) closing line breathing — `mt-16 md:mt-20` above + bottom padding symmetric with new top gap | ⚠ softened | §2.1 keeps `mt-10 md:mt-14` above closing line, and `pb-24 md:pb-32 lg:pb-40` (asymmetric to new `mt-32 md:mt-40 lg:mt-48` top) |
| 14 | (cd-pass-2 §3 Card 3, implicit) identical easing on all three drops; only start time of drop 3 delayed | ✓ applied | §5 Animation timeline ("All three drops use identical `ease-out-expo` 620ms…") |
| 15 | (cd-pass-2 §3 Card 1, implicit) keep the surface line on Card 1 | ✓ applied | §3 SVG includes `<line ... y1="168" y2="168">` |

Two further frictions worth fixing (not in §6 but flagged as bugs in the spec itself):

| # | Issue | Status |
|---|---|---|
| A | `inkConnectorDraw` keyframe defaults `--connector-len` to `32`, but Card 3 connectors are spec'd at 28px. The CSS var must be set per card or the Card 3 connectors will overshoot/undershoot. | ✗ missing |
| B | Card 2 timeline row at t=4080 calls the gap "800ms of literal nothing" — correct — but the next event (`drop-B`) is also t=4880 (4080+800). Spec text says "indistinguishable from a paused tab." During this gap, the intent arc and surface line are still rendered. CD intent: those static page elements are fine. Spec is technically clean but worth a one-line clarification so an engineer doesn't hide them. | ⚠ ambiguous |

---

## Must-fix-before-implementation

- **Closing line breathing + bottom symmetry (§2.1).** Change the closing-line top margin from `mt-10 md:mt-14` to `mt-16 md:mt-20`, and change the section's bottom padding to `pb-32 md:pb-40 lg:pb-48` so the section is symmetrically silent above and below. The current asymmetry leaks the section into whatever follows it.

- **Card 3 connector length CSS var (§6 `inkConnectorDraw` and §5 `MarginNote3`).** The keyframe uses `var(--connector-len, 32)`; Card 3 connectors are 28px. Add an explicit instruction that each `MarginNote` / `MarginNote3` sets `--connector-len: 32` (Cards 1, 2) or `--connector-len: 28` (Card 3) inline on the connector element. Otherwise Card 3's connectors will draw against the wrong dasharray.

- **Card 2 gap clarification (§4 timeline at t=4080).** Add a one-line note: the surface line, intent arc, `02` label, and paper grain remain visible during the 800ms gap — "the canvas is silent, not blank." Prevents an engineer from helpfully hiding everything.

---

## Watch-in-build

Carried forward from cd-pass-2 §7, refined for what the spec now locks:

- **Card 2's 1.6s hold + 800ms gap in real-world scroll context.** Locked in the spec; verify in browser that the silence reads as content, not as a stall. Resist any urge to shorten during refinement — bring it to CD first.
- **`feTurbulence` parity across Safari/Chrome/Firefox** at actual card size, seeds 3/7/11. The bloom edge must read *organic* in all three; if any browser flattens to a fuzzy circle, tune `baseFrequency` per card before changing the seed.
- **Cream-on-cream plate edge** on low-end LCDs / conference-room projectors — the inset hairline at `rgba(15,12,10,0.06)` is intentionally near the rendering threshold; verify on a real TV before declaring it intentional, and do not bump the opacity (§9 risk 6).
- **Multiply blend + paper grain on Card 3 in iOS Safari.** The overlap must visibly deepen without crushing to brown; grain wash is layered above the SVG. Sample iOS Safari first, not last.
- **Margin-note typography at `lg` viewports** (Card 3 phrases at 13/14px) — confirm in browser whether a `lg:15px` bump is needed; do not pre-emptively bump.
- **`01 / 02 / 03` serif labels' weight vs. eyebrow text below the card.** Labels must read quieter than the eyebrow. Spec lands at `text-ink-muted/70`; drop another notch if still bright, never bump.

---

## One-line creative direction to the implementing engineer

**Silence and timing are content, not gaps to optimize away** — when in doubt, hold longer, breathe wider, and trust that the cream plate doing almost nothing is the loudest thing on the page. The brand-orange ink belongs to Chronilogix, not to Roni; do not soften, plum-shift, or "tidy" the uneven rhythms — every drift toward symmetry kills the metaphor.
