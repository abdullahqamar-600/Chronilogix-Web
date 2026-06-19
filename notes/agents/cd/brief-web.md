# Brief — Web Designer

Owner: Web Designer. Author: Creative Director. Source of truth:
`notes/agents/01-copy-v2-canonical.md`. Read `cd/master-plan.md` first.

You are responsible for the structural design of seven sections in three
waves. Return a `web/<section>-spec.md` per section, in the order below.

---

## Wave 1 — fix the broken beats

### W1.1 — Statement Scene 3 rewrite *(file: `components/sections/Statement.tsx`)*

The phone-rising mechanic stays. The three orbiting cards
(`ProvenMethodCard`, `ValidatedAICard`, `DecadesOfScienceCard`) **die**.
They duplicate the new §08 Proof-in-numbers.

Scene 3 becomes the live demo from §04 of the canonical copy. Inside the
phone screen, the chat conversation animates in. Around the phone (left
column at desktop), a quiet eyebrow + headline + body block reads:

- Eyebrow: `Watch it work`
- Headline (serif): `A real conversation, not a chatbot script.`
- Body: `Most "AI wellness" tools fire off reminders and canned check-ins.
  Chronilogix holds an actual conversation — it listens, reflects, surfaces
  the barrier behind the behavior, and helps the member find their own
  reason to change.`
- Caption (small, ink-muted): `Onboarding → daily check-ins → goal tracking
  → progress reporting, in one conversation.`

Spec the desktop two-column composition (text-left / phone-right, both
inside the same sticky scene), the mobile stack order, the type ramp, and
how the Scene 1 → Scene 2 → Scene 3 transitions sit on the same scroll
runway without reflowing the page.

**Out of scope:** the conversation script itself (Illustration owns the
chat surface), the timing curves (Motion owns).

### W1.2 — How it works *(replaces "Three patterns" in `Solution.tsx`)*

Below the AgentStrips, the current `<h3>Three patterns. Every session.</h3>`
block + three step cards becomes:

- Eyebrow: `How it works`
- Headline (serif or sans-medium — your call, justify it): `Live in three
  steps.`
- Three-card rail: Connect / Configure / Deploy with the canonical copy.
- CTA below the rail: `See how onboarding works →` *(secondary link only,
  no button shell yet — see CTA decisions doc)*.

Three cards stay vertically aligned with the existing grid system. You
choose whether they remain `aspect-[3/4]` rectangles like the current
Three-patterns cards, or whether they become a horizontal rail
(numbered, connected by hairline rule). Justify the choice. Acceptance
criteria:

1. The structure must not visually compete with the AgentStrips above.
   This section is *quieter* than Two coaches, not louder.
2. The step number `01 / 02 / 03` reads as labeling, not as decoration.
3. Each step has room for one illustration block + one paragraph + one
   small list of three "what happens here" beats. Spec the list pattern.

### W1.3 — Use cases *(replaces personas in `components/sections/WhoWeServe.tsx`)*

Same sticky-scroll mechanic stays (it works). Personas are wrong; copy is
generic. Replace with the canonical five:

1. **Employers** *(default)*
2. **Benefits Brokers**
3. **Health Plans & ACOs**
4. **Wellness Platforms**
5. **Governments & Health Systems**

Use the canonical copy verbatim for each. Spec:

- The tab/accordion treatment for five entries (current code handles four;
  five is the new constraint).
- A per-persona "headline split" — the two-line headline pattern the current
  WhoWeServe uses works well, but only the first two personas have real
  background images today. Spec what fills the other three until images
  arrive (the current `PlaceholderBackdrop` is acceptable as a fallback —
  refine its treatment).
- One per-persona "key benefit chip" that surfaces the strongest stat
  (e.g., Employers chip reads `$300–$700 / engaged member / year`).
- The bottom CTA stays `Book a Demo`, white pill on dark — same as today.

### W1.4 — Proof in numbers *(replaces `ProofPoints.tsx`)*

Replace the existing single-card ledger with a richer composition:

- Eyebrow: `Proof in numbers`
- Headline (sans-medium, matching current ProofPoints register — this is
  one of the "mechanical / proof" sections per master plan): `The
  methodology has the receipts.`
- Stat grid — 8 cards in a 4×2 layout at desktop, 2×4 at tablet, single
  column at mobile. Each card:
  - Big number (serif, ~`text-[3rem]` to `text-[4rem]`)
  - Short label (sans, body weight)
  - Source line (small, ink-muted, *visible*, hairline-separated)
- ROI band closer at the bottom of the section — full-width strip with
  the canonical `1,000 employees → 250 chronic → 50% engaged → $500 avg
  → $62,500 / yr` calculation. This is a *story moment*, not a stat card.

Acceptance criteria:

1. No two cards have the same source — if Aetna feeds two stats, those
   two cards share an attribution line layout but each cites Aetna
   independently.
2. The Dartmouth NEJM AI 2025 stat carries the exact disclaimer "Category
   validation; not Chronilogix's own result."
3. The ROI band's math is visible — the four-step arrow chain must read
   in a single skim.

---

## Wave 2 — add what's missing

### W2.1 — Core capabilities *(new section, slots between Problem and Two coaches)*

Four alternating image+text blocks. Canonical copy lives in §06 of the copy
doc. Spec:

- The alternation pattern (image-left / text-right then text-left /
  image-right, etc).
- The image well per block — pre-asset, what's in it? (Illustration will
  fill).
- The block-internal hierarchy: short eyebrow ("Capability 01" through 04
  or named labels — your call), serif headline, body, one optional
  supporting line.
- Vertical rhythm between blocks. Generous breathing room, not crammed.

### W2.2 — Trust & security *(new section, slots between Proof in numbers and Footer)*

Five-pillar grid. Canonical copy lives in §12 of the copy doc. Spec:

- A grid layout that doesn't feel like a generic feature wall.
- Pillar shape: small icon, short label, supporting line.
- A section-header rail with the headline "Clinically grounded.
  Privacy-first. Built for healthcare." (serif, multiline).
- A bottom row of compliance affordances using the existing
  `<ComplianceBadges />` component if you want, OR a hairline-row pattern
  with "Built for HIPAA · SOC 2 in progress · Data stays with you" — your
  call.

Acceptance criteria:

1. Every pillar's claim is conditionally honest. "Built for HIPAA",
   never "HIPAA compliant". "SOC 2 in progress", never "SOC 2 certified".
2. The 988 / human-in-the-loop pillar carries the exact phrasing in the
   copy doc, no rewrite.

---

## Wave 3 — depth and polish

### W3.1 — Two coaches v2 *(touches `Solution.tsx` top section)*

Light structural pass. Add:

- Eyebrow `Inside Chronilogix` above the headline.
- Connective sub-line below the headline (one sentence, ink-muted):
  *"Both live inside Chronilogix — always on, and handing a member to a
  person the moment they need one."*
- No layout change to the AgentStrip cards themselves — those are owned
  by Illustration in their depth pass.

### W3.2 — Hero copy refresh *(touches `Hero.tsx`)*

Copy-only change.

- New headline: `Care that's there at 2 AM, not just 2 PM.`
- New subhead: `Chronilogix is a 24/7 AI coaching platform for the
  moments scheduled care can't reach — between appointments, after
  discharge, and in the quiet moments behavior change actually happens.
  Built on 30+ years of Motivational Interviewing science, with a human
  in the loop when it matters.`
- Add secondary CTA next to the Book-a-demo pill: `See it work →` link,
  anchors to `#statement` (where the demo now lives).
- The persona-strip line at the bottom (`Employers · Universities ·
  Health Plans · App Partners`) updates to the canonical five
  audiences: `Employers · Brokers · Health Plans · Wellness Platforms ·
  Governments`. *(Universities drops — they're not in the new audience
  priority list. Document this in the section spec.)*

### W3.3 — Problem section resolution add *(touches `Problem.tsx`)*

After the three facts close, add a resolution beat:

- A short paragraph (max 50 words): *"Chronilogix is there in that
  moment — 24/7, judgment-free, and consistent. Members get continuous
  behavioral reinforcement between visits and after treatment, when
  traditional care goes silent."*
- Optional pull-stat band underneath: **58% reduction** — *The US
  Diabetes Prevention Program, on the methodology Chronilogix is built
  on.*
- This add reads inside the existing right column scroll content. No
  new layout shell.

---

## Quality bar reminders

- 1.5-second skim test on every section.
- No three-column wall of identical cards. If you're using cards, make
  them differ structurally or kill them.
- Mobile is specced separately if it diverges from desktop in any
  meaningful way.
- Surface open questions to me in the spec — do not invent answers when
  the brief is silent.
