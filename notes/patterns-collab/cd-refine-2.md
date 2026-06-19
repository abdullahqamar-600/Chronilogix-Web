# cd-refine-2.md — Creative Director, refinement pass 2 on live build

Reviewed at 1440×900 desktop and 390×844 mobile. Animations played
through to settle. DOM/computed-style verification (screenshots
returned blank in this env). References below cite component
line ranges in `components/sections/Solution.tsx` and tokens in
`app/globals.css`.

---

## Verification of refinement-1

| Call | Status | Computed value |
|---|---|---|
| Grid split into 4 rows; divider gets own row 2 | ✓ | `gridTemplateRows: 451.547px 33px 32px 161.625px`; divider `gridRow:"2"`, eyebrow row `"3"`, title row `"4"`. No collision. |
| Divider opacity bumped to `bg-ink/15` | ✓ | Span `backgroundColor: rgba(15,12,10,0.15)`, 1px high, scaled-X to 100%. |
| Closing line → serif italic, 19/22, `text-ink` | ✓ | 22px, italic, `rgb(15,12,10)`, `fontFamily: __Newsreader…`, right-aligned at lg, `mt: 80px`. |
| `text-ink` token remapped to `#0F0C0A` | ✓ | Probe `.text-ink` → `rgb(15,12,10)` site-wide. Section reads warm now. |
| Card 2 Q1 anchor → `{left:6%, top:80%}` ghosted at 0.3 | ✓ | Inline `left:6%; top:80%; opacity:0.3`. |
| Card 2 ghost bloom-A opacity → 0.10 + saturate(0.3) | ✓ | `.bloom-A-fill[data-mute="true"]` settles at `opacity:0.1, filter:saturate(0.3)`. |
| Card 1 phrase positions tightened to 18% | ✓ | `top:44%; left:18%` and `top:82%; right:18%`. |
| Card 1 displacement final scale 6 → 8 | ✓ | `feDisplacementMap` animates `from=14 to=8`. |
| Card 3 note 1 anchor → `{left:48%, top:30%}` | ✓ | Inline matches. Note 1 rect now clears bloom-1. |
| Card 3 note 3 anchor → `{left:78%, top:78%}` | ✓ | Inline matches; rect right (1259.99) sits at plate right rim — see pass-2 call M3. |
| Card 2 MarginNote `maxWidth: 22ch` | ✓ | Q1 wraps to single line (213×26); Q2 to single line (254×26). |
| Card titles `lg:text-[22px]` | ✓ | All three h4s render 22px, 30.25 LH. |
| `01/02/03` labels at `text-ink-muted/60` | ✓ | `rgba(91,100,112,0.6)`. |
| Eyebrow tracking → `0.24em` | ✓ | `letter-spacing: 2.64px` on 11px. |
| Section bottom `pb-32 md:pb-40 lg:pb-48` | ✓ | `padding-bottom: 192px` at desktop; 192px from closing-bottom to section-bottom. |

All 14 calls landed. No regressions detected.

---

## Second-pass calls (the AAA stuff)

### 1. Eyebrow icon row reads as stock template
- **WHERE:** `PatternCard`, lines 457–470 (`<span className="relative inline-flex h-8 w-8 …">` + `Icon`).
- **WHAT IS WRONG:** Three identical 32px cream chips, 1px inset border, 18px brand-orange line icon (wave / chat / clock). It is the single most "generic landing-page" element in the entire section — and it lives directly under the most original element on the page. The chip + line-icon affordance fights the bloom metaphor (geometric vs. organic, brand-orange ink vs. brand-orange utility).
- **WHAT TO DO:** Drop the chip and the icon. Replace with the serif italic plate number `01 / 02 / 03` at `text-[13px] text-ink-muted/70`, followed by a 16px hairline rule (`h-px w-4 bg-ink/15`), then the eyebrow text. So the row reads "*01* — INTAKE" as a single ink-toned line. The plate label moves out of the canvas corner (which is currently doing nothing) and into the typographic system as a clausal mark. The icons return as a single second-order signal on Section 5 if needed, not here.

### 2. Card 1 outline still reads as inscribed, not tracing
- **WHERE:** `IntakeVisual`, line 597 `<path className="card1-outline" d="M 56 168 C 52 150 …">`.
- **WHAT IS WRONG:** Live build: outline rect = 150×133, bloom-G rect = 156×156. The outline is 6px narrower AND 23px shorter than the bloom (its center y is 1.7px above the bloom center). The bloom is now properly displaced organic (scale 8 final), but the outline path was authored against the *circle* (r=46) and so it sits *inside* the displaced silhouette. Reads as "ink, plus an inscribed oval".
- **WHAT TO DO:** Scale the path outward by ~6% from `(100,168)`. Use: `d="M 52 168 C 48 146 68 124 96 122 C 124 120 148 140 148 166 C 150 192 124 210 100 210 C 72 212 58 190 52 168 Z"` — the irregular trace then sits *just outside* the displaced bloom rim, reading as "the dried edge of a stain" rather than a separate ring.

### 3. Card 3 multiply blend crushes drops 2 & 3 visually
- **WHERE:** `MemoryVisual`, lines 967–1043, `<g style={{ mixBlendMode: "multiply" }}>` wrapping all three blooms AND the three drop circles AND the outline path.
- **WHAT IS WRONG:** `mix-blend-mode: multiply` on the *drop circles* (3px solid `#FF7434`) makes them noticeably darker against cream than Card 1 / Card 2 drops, and at the moment a drop overlaps a previous bloom (which happens at drops 2 and 3 by design) the drop turns brown. Drops should read identically across all three cards — the difference is the *timing*, not the color.
- **WHAT TO DO:** Move only the three `<g className="c3-bloom-N">` groups inside the multiply wrapper. Lift the three `<circle className="c3-drop-N">` and the `.c3-overlap-outline` *out* of the multiply wrapper into normal blend. Drops fall in `#FF7434` across all three cards; only the absorbed blooms multiply-blend with each other. The metaphor (memories layering) lives in the blooms; the drop event is identical-color across cards.

### 4. Card 2 silence breaks visual stillness with a desync
- **WHERE:** `SessionVisual` lines 711–725; CSS `.bloom-A-fill[data-mute]` lines 210–213; MarginNote Q1 transition line 869.
- **WHAT IS WRONG:** Q1 ghosting and bloom-A ghosting are both 900ms `var(--ease-out-quart)` — but bloom-A's animation has a 1.9s internal delay (within the `data-mute` `inkAbsorbToGhost` keyframe, which begins at `t=1900ms` *after* the new animation starts when `data-mute` flips). Q1's transition fires *immediately* on mute change. Result: Q1 fades to 0.3 before bloom-A starts desaturating. The "question and bloom dim together" intent is broken.
- **WHAT TO DO:** Delay Q1's mute transition to match bloom-A. On `MarginNote` muted branch (line 866), change `transition: "opacity 900ms var(--ease-out-quart)"` to `transition: "opacity 900ms var(--ease-out-quart) 1900ms"`. Then the question and the stain dim in unison, which is what makes the moment land.

### 5. Card 1 ripple is invisible / superfluous
- **WHERE:** `IntakeVisual` lines 576–586 (`.card1-ripple` circle); CSS lines 184–188.
- **WHAT IS WRONG:** The ripple animates `scale(0.2) → scale(2.6)` over 320ms at stroke-opacity 0.5, then is fully transparent. On the live plate it's not perceptible — it competes with the bloom that starts expanding at exactly the same delay (820ms). It's a "spec instinct" that contributes nothing at rendered size and steals 320ms of energy from the impact moment.
- **WHAT TO DO:** Remove the ripple entirely. The drop hitting + the bloom expanding through `feDisplacementMap` carries the impact. (If you don't want to delete, keep stroke-opacity 0.5 but raise initial radius from 2 to 6 and target scale from 2.6 to 1.6 — but I'd just delete.)

### 6. Closing line "max-w-md" cuts the right-align argument
- **WHERE:** `PatternsBlock` line 232–242, `<p className="… ml-auto max-w-md …">`.
- **WHAT IS WRONG:** The line "This is what makes it coaching, not chat." renders at 22px serif italic with `max-w-md` (448px) — *but the string is only 41 characters and wraps to one line at 363px*. The 448px container is doing nothing; the right-align is essentially anchoring the visible text to plate-3's right edge with extra container slack hidden left of the text. Functionally correct, but on inspection it means a slightly longer copy edit would silently wrap. Lock it.
- **WHAT TO DO:** Change `max-w-md` to `w-fit` so the container hugs the rendered glyphs. Right-alignment is then geometrically true, not a `text-align:right` inside a wider box. Same visual result today, robust to copy iteration.

### 7. Card 2 silence needs a thread of life on the page
- **WHERE:** `SessionVisual`, lines 752–766, the intent arc + surface line.
- **WHAT IS WRONG:** During the 800ms gap (t=4080–4880), the canvas shows: surface line (rgba(15,12,10,0.12)), bloom-A as 10% ghost, Q1 muted at 0.3, `02` label, paper grain, intent arc at rgba(15,12,10,0.08). That arc is a 24×6 px tell on the *far left edge* (x=8 of viewBox 200) — at the gap moment, the eye has nothing to rest on between the ghost on the left and the eventual drop-B on the right. The "silence is content" reading depends on an anchor for the eye.
- **WHAT TO DO:** Extend the intent arc into a short hairline that traces from the surface line up toward where bloom-B will land — `d="M 8 168 a 14 14 0 0 1 14 -3 M 110 168 l 0 -10"` — adding a 10px vertical tick directly under bloom-B's strike point at `(116,153)`. Same `rgba(15,12,10,0.08)`. The tick is the *intention to ask*, present throughout — the gap then reads as "the held breath before the second question" not as "nothing happened".

### 8. Body description font reads as section sub-line, not as a thesis
- **WHERE:** `PatternsBlock` lines 205–216, the `<p>` "Not a chatbot. Not a symptom-checker. …".
- **WHAT IS WRONG:** 16px Hanken Grotesk regular, ink-muted (cool slate), 24px LH. Fine as body, but it follows the section's only serif h3 ("Three patterns. Every session.") and precedes the three serif italic patient phrases in the cards. The voice the section sets is serif. The body description sitting in sans-serif feels like meta-copy "explaining" the section rather than continuing its voice.
- **WHAT TO DO:** Keep sans-serif (don't ladder all section-body text to serif — that's a different gesture), but warm it: `text-ink/75` instead of `text-ink-muted`, and `tracking-tight` (currently default tracking). This drops the cool-slate, raises typographic density, and reads as quiet authority rather than UI body.

### 9. Section top gap above h3 is now larger than the visual demands
- **WHERE:** `PatternsBlock` line 171, `<div className="mt-32 md:mt-40 lg:mt-48">`.
- **WHAT IS WRONG:** 192px gap between the second Agent strip and the h3. The strips end in saturated brand blobs; the h3 is a quiet serif. The 192px is the right *minimum* — it reads as a deliberate caesura. But the divider-in-its-own-row fix added ~25px more visual breathing inside the grid (because the row now exists where before it was inside the eyebrow row). Compound effect: the section now feels slightly *too* aerated.
- **WHAT TO DO:** Drop top gap to `mt-28 md:mt-36 lg:mt-44` (112/144/176px). Still substantial separation from Millie's strip; tightens the section's internal rhythm without losing the caesura.

---

## Mobile (390px) read

Treating mobile as its own design, the section fails three intention checks and one composition check. The plates are 326px wide single-column, but the percentage anchors authored for desktop's 339px plates compound badly when there's no margin column.

### M1. Card 1 phrases overlap bloom-1 — the metaphor literally collides

- **WHERE:** `IntakeVisual` PhraseTag anchors, lines 612 and 621.
- **WHAT IS WRONG:** At 326px plate, bloom-1 spans x=120 → 270 (centered 195, r≈75). Phrase 1 at `left:18%` rect = 91 → 199, so its right edge (199) sits inside bloom-1. Phrase 2 at `right:18%` rect = 167 → 299, so its left edge (167) is well inside the bloom on the opposite side. Both phrases write across the saturated ink.
- **WHAT TO DO:** Mobile-specific anchors via `useIsNarrow()` (already imported). On narrow, render PhraseTag 1 at `{top: "30%", left: "6%"}` and PhraseTag 2 at `{top: "92%", right: "6%"}`. Lifts phrase 1 above bloom and drops phrase 2 below it. The vertical separation reads as "two things the patient said, at different moments" — actually better than desktop's tight pairing.

### M2. Card 2 Q1 sits across the bottom of bloom-A on mobile

- **WHERE:** `SessionVisual`, MarginNote Q1 anchor line 816.
- **WHAT IS WRONG:** At narrow, bloom-A at viewBox(64,168) maps to roughly (105,275)-rim. Q1 at `{left:6%, top:80%}` rect = (52, 373). Q1's text spans x=52→245, so it overlaps bloom-A's lower hemisphere (rim right=198). The ghost question lands *across* the ghost ink — too literal a stack.
- **WHAT TO DO:** On narrow, anchor Q1 at `{left:4%, top:6%}` (above bloom-A) and Q2 at `{right:4%, top:92%}` (below bloom-B). Inverts the desktop "left-low, right-high" pairing, but on a vertical mobile plate the bloom pair is *vertically stacked* (one above the other), and the questions then bookend them top and bottom. That's the correct mobile rhythm.

### M3. Card 3 notes overlap blooms; note 3 touches the plate rim

- **WHERE:** `MemoryVisual` MarginNote3 anchors, lines 1048, 1058, 1068.
- **WHAT IS WRONG:** At 326px plate: bloom-1 (113→205), bloom-2 (149→267), bloom-3 (182→332). Note 1 at `left:48%` rect (188→315) overlaps bloom-1 right edge (205). Note 2 at `left:58%` rect (221→329) overlaps bloom-2 right edge (267). Note 3 at `left:78%` rect (286→358) — right edge equals plate-right (358 = plate.right 358). It's pinned to the rim and at y=409→456 it ends below plate-bottom (plate.bottom 504, but the 2-line note wraps because the timestamp is "Today\nI cooked on Sunday." stacked).
- **WHAT TO DO:** Mobile-specific anchor table via narrow flag. Notes 1/2/3 → `{left:"10%", top:"6%"}`, `{left:"50%", top:"38%"}`, `{left:"6%", top:"86%"}`. This places notes in a *zigzag* down the left and right of the diagonal bloom-trail, not pinned to one side. Each note then sits in cream, with its connector pointing to its bloom. The "Today" timestamp also gets its own visual breathing room.

### M4. Closing line is left-aligned on mobile by default and reads as a body row

- **WHERE:** `PatternsBlock` line 232–242, the closing `<p>`.
- **WHAT IS WRONG:** `text-align: start` on mobile (only `lg:text-right` is set). At mobile, the line sits left-aligned at 19px italic — same alignment and size band as the cards' body copy directly above. Reads as another body row, not as the section's thesis.
- **WHAT TO DO:** Center it on mobile, right-align at desktop. Change class to `… text-center lg:text-right …`. Combined with the `mt-16` above, the centered serif italic at the end of a long stack of left-aligned content reads as the deliberate close it is.

---

## Watch-list for refinement-pass-3

- **Real OS prefers-reduced-motion toggle.** Still un-verifiable in this preview env. Pass-3 should confirm on a real OS toggle that Card 2 paints stage-2 immediately (Q1 muted 0.3, bloom-A at 0.1 + sat 0.3) without any animation delay.
- **iOS Safari multiply blend on Card 3** once #3 above lands (drops out of multiply, blooms only). Sample on a real iPhone — the multiply-only-on-blooms might shift the perceived warmth of the third bloom against the cream paper grain in ways desktop Safari does not show.
- **Hover-replay on Card 2 with real mouse, in scroll context.** The full 8-second cycle on re-trigger, and whether the silence still reads after the user has *seen* it once. Pass-3 with fresher eyes on the second-watch impact.

---

## One-line creative direction (refined for pass-3)

**The composition is now correct; pass-3 is about removing what the section *still* shares with every other landing page — the icon row, the rippling impact, the extra container slack — and tightening the synchrony of the silence in Card 2 so the held beat reads as one breath, not two desynced fades.** Mobile gets its own anchor table; do not reuse desktop percentages.
