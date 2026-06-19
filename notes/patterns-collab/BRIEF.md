# Three Patterns — Collaboration Brief

## What we're working on

The section "Three patterns. Every session." inside `components/sections/Solution.tsx`.
It sits below the two AgentStrip blocks (Roni, Millie) and frames *how Chronilogix coaches*
— not what it does. Three cards: **Intake**, **Reflection**, **Continuity**.

Each card has a square-ish illustration/animation area (currently `aspect-[3/4]`),
then a small icon + eyebrow, then a serif title + supporting paragraph.

The card *bodies* (copy, eyebrow, icon row, layout grid) are FINE. The job is to
re-invent the **illustration/animation inside each of the 3 squares** — and the
shared connective thread between them if it serves the story.

Source file: `components/sections/Solution.tsx`
Current visuals to replace:
  - `IntakeVisual` — brain SVG + reveal list (lines 514–546)
  - `SessionVisual` — rotating MI question cards on a pattern bg (lines 632–670)
  - `MemoryVisual` — node-line-node-line-node pipeline (lines 672–749)

## The story we're telling

Chronilogix coaches the way Dr. Ken Resnicow has taught Motivational Interviewing
for 30 years. Three patterns per session:

1. **Intake** — Before any advice, it learns who you are.
   Values, motivations, stressors, culture, history. Coaching begins from that
   foundation, not from zero.

2. **Reflection** — It asks. It reflects. It never lectures.
   Open questions break overwhelming change into bite-sized goals that stick.

3. **Continuity** — Every session builds on the last.
   Goals evolve. Setbacks are worked through. Progress is named. The relationship
   deepens, and the outcomes with it.

Closing line, right-aligned: "This is what makes it coaching, not chat."

## Brand language (what already lives on this page)

- Palette: warm cream paper (`bg-paper-warm`), ink (near-black), brand orange
  `#F9904D` / `#FF7434`. Roni section uses warm orange gradient. Millie uses
  rose/plum. Whites are bright, never gray.
- Typography: serif (Newsreader) for display + titles; sans for body + eyebrows.
  Eyebrows are uppercase tracking-[0.22em] 11px.
- Motion vocabulary (already in globals.css):
  - Easings: `--ease-out-expo`, `--ease-out-quart`, `--ease-out-soft`
  - Durations: `--dur-quick 180ms`, `--dur-state 320ms`, `--dur-reveal 700ms`,
    `--dur-reveal-long 1100ms`
  - Reveal pattern: blur(3–6px) + opacity 0.12–0.45 → blur(0) + opacity 1
  - No bounce, no elastic, no overshoot. Only ease-out curves.
  - prefers-reduced-motion is respected everywhere.
- Visual restraint: hairline strokes, dashed rings, generous whitespace, low-key
  textures (pattern.png, card-1-bg.jpg, card-3-bg.jpg). It is *not* loud.
  Loudness is wrong for healthcare credibility.
- This is for a June 2026 launch at a healthcare industry conference. Audience =
  CHRO/benefits leaders, health-plan execs, university VPs. Premium, clinical-
  credible, never childish, never tech-gimmicky.

## Non-negotiable constraints

- **Chronilogix is the subject.** Not "AI", not "Rooney", not "the app".
- **No anonymous quotes** anywhere on this page.
- **No dollar amounts**.
- **No 988 link** anywhere on the page — even if a card hints at crisis flow,
  it must be plain text only.
- **Dr. Resnicow** is the credibility anchor for the *page* but does NOT need to
  appear inside these three cards.
- The cards live below two large AgentStrips (Roni warm orange, Millie plum).
  Whatever we design must feel like a quieter, more analytical register —
  the AgentStrips are the loud chord; this is the considered phrase that follows.
- Performance matters. Mostly CSS/SVG. Avoid JS-heavy WebGL unless one card
  really demands it and we can scope it.

## Workflow

Three personas collaborate, files in `notes/patterns-collab/`:

1. **Planner** (`plan-v1.md`, `plan-v2.md`, `plan-final.md`) — translates the
   creative direction into precise build specs (DOM, SVG paths, animation
   timing, easing tokens, fallbacks).
2. **Creative Director** (`cd-pass-1.md`, `cd-pass-2.md`, `cd-signoff.md`,
   `cd-refine-1/2/3.md`) — Awwwards-level taste. Demands originality, narrative
   coherence, restraint. Hates clichés. References Rauno Freiberg, Linear,
   Vercel, Stripe Press, Active Theory, Lusion, Apple product pages.
3. **Web Designer/Developer** — implements + refines based on the above.

Phase 1 — Planning, 3 cycles: planner drafts → CD critiques → planner revises.
Phase 2 — Implementation: web designer ships against plan-final.md.
Phase 3 — Refinement, 3 cycles: CD reviews live → web designer refines.

## Read these before working

- This file (BRIEF.md)
- `CLAUDE.md` (project-level rules)
- `components/sections/Solution.tsx` (the file you're editing/specifying for)
- `app/globals.css` (motion tokens, keyframes already in use)
- `~/Downloads/chronilogix-homepage-copy-messaging.md` — final copy
- `~/Downloads/chronilogix-business-context.md` — buyer/persona context
