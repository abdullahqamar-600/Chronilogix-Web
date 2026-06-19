# Brief — Illustration + Graphics Designer

Owner: Illustration Designer. Author: Creative Director. Source of truth:
`notes/agents/01-copy-v2-canonical.md`. Read `cd/master-plan.md` first.

Your job in this iteration is to push the **agent presence** past 60%, build
the **product chat surfaces** that anchor the demo, and produce the
**section-internal illustrations** for the new and rewritten sections.
Return a `illustration/<asset>-spec.md` per item, in the order below.

---

## Wave 1 — fix the broken beats

### I1.1 — Statement Scene 3 product chat surface

Lives inside `HeroPhoneMockup.tsx` on the screen plate. The conversation
that animates in is the canonical one from §04 of the copy doc:

```
Coach (AI):  Hi Christopher 👋 Ready for today's check-in?
Member:      I keep skipping my evening medication.
Coach (AI):  Sounds like evenings get away from you. What's usually going
             on around that time?
```

Spec:

- The chat bubble visual treatment — the current treatment (cream-on-cream
  AI bubble, light user bubble) is the starting point. Push depth: a
  micro-pattern in the AI bubble, a tiny presence dot, a hairline
  divider strip at the top showing the session header (`Chronilogix ·
  Tuesday 8:41` — match the current header style).
- A typing-indicator dot triad that precedes the second AI message. This
  is the "pause that says it's listening" beat — illustrate it as three
  cream dots, not a generic SaaS spinner.
- The phone chrome stays as-is (existing `Iphone.svg` + `Notch.png`).
- A subtle status chip above the chat — `Goal: medication adherence` or
  similar — that signals this is a session in progress, not first
  contact. Spec the chip's anatomy.
- Annotate which layers Motion will animate (each bubble's entry, the
  typing-indicator, and any pulse on the AI presence dot).

Hard constraint: this is **chronic-care / diabetes flow**. Do not show
any mental-health language in the visible chat — that's an editorial call
from CD (the canonical copy notes 988 cannot be demonstrated until Millie
is signed off).

### I1.2 — How it works step illustrations

Three small illustrations, one per step (Connect / Configure / Deploy),
sitting inside whatever container Web specs. Currently the section has
three large illustrations (intake / session / memory) — replace those
three assets entirely. The new ones:

- **Connect.** A short intake form rendered as a stack of three quiet
  pill-shaped fields, each receiving a check as the illustration
  resolves. The visual cue is "the platform is listening from the first
  message", not "user fills out a form". Hairline strokes, paper
  texture, one orange-accent check on the final field.
- **Configure.** A tile-grid pattern (4×3 tiles or similar) where 3–4
  tiles light to a soft orange tint, representing the buyer's chosen
  focus areas. Add a small "escalation rule" pattern (a hairline branch
  splitting from one tile) suggesting human-in-the-loop routing.
- **Deploy.** A clock-face / 24-hour gauge that quietly ticks through a
  full revolution, with a soft pulse at 2 AM (cementing the hero
  headline). Annotate the gauge with two small markers: `2 AM` and
  `2 PM`, the hours from the hero headline.

The trio must feel like a single piece — same stroke weight, same warm
cream paper background, same hairline weight, same brand-orange accent
discipline (sparing).

### I1.3 — Use cases per-persona illustration / pattern

Five personas (Employers default, Brokers, Health Plans/ACOs, Wellness
Platforms, Governments). Two have real background images already
(`for-employees.png`, `for-universities.png`). Universities is **leaving**.

For each persona spec:

- A treatment that reads as a real audience, not an abstract icon.
- For personas we have no photography for (Brokers, Health Plans/ACOs,
  Wellness Platforms, Governments), spec a pattern-or-illustration
  alternative that doesn't fall back to the current `PlaceholderBackdrop`
  dotted-grid. The goal is to make the placeholder feel like a chosen
  treatment, not a hole waiting for a photo.
- Each persona gets a small "fingerprint" graphic in the corner of the
  panel — Brokers gets a hairline ledger pattern, Health Plans/ACOs gets
  a network-of-dots fingerprint, etc. This is the differentiator that
  keeps the section from reading as "five tabs of the same image".

### I1.4 — Proof in numbers — section graphics

The new Proof in numbers section needs:

- Card-internal "source mark" — a small hairline icon that precedes
  every attribution line. Three variants: `study` (a small page glyph),
  `program` (a small linked-circles glyph), `trial` (a small flask
  glyph). These differentiate Aetna's program, the DPP / NEJM
  *programs*, and the Dartmouth *trial*.
- A diagrammatic "ROI band" graphic for the closing strip. The math is
  `1,000 → 250 → 50% engaged → $500 → $62,500`. Spec it as a quiet
  four-step horizontal flow with hairline connectors, **not** a
  pie chart, not a bar graph. Lives full-width inside the section
  shell. Annotate the staggered reveal hooks for Motion.

---

## Wave 2 — add what's missing

### I2.1 — Core capabilities illustration set

Four illustrations, one per capability block (Web will provide the
alternating layout):

- **MI digitized.** A quiet hairline graph of "telling vs. asking" — two
  divergent traces, one labeled `Telling`, one labeled `Asking`, where
  the asking line trends up over time and the telling line plateaus.
  Citation tag in the corner: `430+ peer-reviewed studies`.
- **Always on.** A 24-hour rail with three small lit moments (2 AM,
  shift change, after-appointment) — a calmer cousin of the Deploy
  clock-face. Distinct enough to not read as duplicate.
- **Culturally intelligent.** A clustering pattern — multiple small
  cohort circles, each with a different fill texture or paper warmth,
  feeding into a single center "coaching" node. The 64% / 2% stat from
  the copy gets a tiny inline annotation.
- **Hybrid model.** A two-lane diagram: top lane = "Chronilogix coaches",
  bottom lane = "Human clinician steps in", with a hairline escalation
  arrow that fires when a flagged signal appears. The signal can be a
  single warning dot. No chatbots, no flowcharts that look enterprise.

### I2.2 — Trust pillars iconography

Five small icons:

- Built on real science → a microscope-or-tree glyph (clinical heritage)
- Built for HIPAA → a paired-shield glyph
- SOC 2 in progress → a paired-shield glyph with a hairline "in progress"
  arc *(must differ from the HIPAA shield visually)*
- Your data stays yours → a vault glyph; key inside, not outside
- Humans in the loop → two paired dots connected by a curved line; the
  curve is the loop

All five: 24×24, single-color hairline (1.5px), warm-ink stroke,
match the existing `WaveIcon` / `ChatIcon` / `ClockIcon` family
in `Solution.tsx`.

---

## Wave 3 — depth and polish

### I3.1 — Agent depth pass (Roni + Millie)

The current AgentStrip + AgentBlob is good, not great. Push depth without
breaking the working pulse + halo. Spec:

- A **second concentric layer** behind the existing dashed ring — a
  paired thin-arc pattern that traces ~60% of the circle, suggesting an
  audio waveform without literalizing one. Roni gets a warm-orange tint;
  Millie a plum tint.
- A small **identity card** that appears to the side of the blob (or
  inside the existing text column, at the foot) showing the agent's
  one-line capability scope:
  - Roni: `Daily coaching · diabetes · medication adherence`
  - Millie: `Stress · mood · crisis · 988 escalation`
  These read as data, not as marketing — small sans, hairline-rule
  separated, ink-muted.
- A **session-counter affordance** under the agent name inside the blob
  (e.g., `Today · 8:41`) — *very* small, suggests the agent is live, not
  a marketing illustration. Keep extremely understated; this should be
  noticed on a re-look, not first look.
- An optional **subtle ambient particle layer** behind the blob, low
  density, low contrast — Motion will decide whether to animate it. If
  you spec it, spec how it's drawn (SVG `<circle>` cluster vs. a
  noise-pattern PNG) and the density.

Do **not** redesign the blob gradient, the existing pulse, or the layout.
This is a depth pass, not a redo.

### I3.2 — The "Questions?" widget (optional refinement)

If you see a clear, low-risk improvement to the current widget visual,
propose it in a short spec. Constraints:

- Slate / gray only, never brand orange.
- `?` icon, never a chat bubble.
- Header reads `Got a question?`, sub-label `Powered by Rooney AI` is
  muted and small.
- Bottom-right placement; scroll-triggered after §02; never auto-opens
  on homepage.

If there's no clean win, skip this and say so.

---

## What every spec must include

- File path of the consumer (e.g., `components/HeroPhoneMockup.tsx`).
- Exact dimensions / aspect-ratios.
- Every hex value used, mapped to brand tokens where possible.
- Annotations of which layers move and what their *end* state is.
- A "what this must not be" list with at least two antipatterns.
