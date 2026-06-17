# Chronilogix Homepage — Iteration Changelog

Running log of all changes made in response to client feedback from the
June 16, 2026 meeting with Steven Amiel. Each pass is dated and grouped
by the section/component touched. Use this as context when returning to
the project after a break, or when answering "why did we change X?".

---

## Pass 2-A — June 17, 2026

**Scope:** Sections 1 (Hero) and 2 (Statement) — first round of client
feedback on the live POC.

### Hero (`components/sections/Hero.tsx`)
- **Headline rewritten** per Steven's transcript wording.
  - Was: `Filling the gaps in chronic care / through AI health coaching agents. 24/7`
  - Now: `Filling the gaps in mental health and chronic care / through AI coaching agents. 24/7`
  - Initial pass dropped "24/7" to match Steven's quoted text verbatim,
    then restored on direct user request (Pass 2-C, in-canvas edit) —
    the 24/7 promise is core enough that it earns the headline back.
- Mobile chat-ticker rework explicitly **deferred** at user request
  ("ignore the mobile phone feedback").

### HeroPhoneMockup (`components/HeroPhoneMockup.tsx`)
- Added two new optional props — `riseStart` and `riseEnd` — so the
  Statement section can hold the phone tucked beneath the runway until
  the headline reveal completes. Defaults (`0.12 → 0.65`) preserve the
  original choreography for any other caller.

### Statement (`components/sections/Statement.tsx`)
- **Sentence 2 reworded** to align with Steven's transcript:
  - Was: `Built on Dr. Ken Resnicow's life's work in Motivational Interviewing.`
  - Now: `Built on world-renowned expert Dr. Ken Resnicow's life work and Motivational Interviewing.`
  - (Further refined in Pass 2-B — see below.)
- **Sentence 3 replaced** with an MI one-liner per Steven's "define MI on
  the page" ask:
  - Was: `Clinical-grade outcomes at a fraction of the cost of live care.`
  - Now: `Motivational Interviewing — the gold standard for mental health and chronic care coaching.`
  - (Further refined in Pass 2-B.)
- **Choreography reordered to sequential.** Phone rise window moved
  from `0.12 → 0.65` to `0.48 → 0.72`; `SCENE3_START` pushed from `0.55`
  to `0.72`. Result: text reveals → MI button beat → phone rises →
  orbiting cards land. The phone never visually competes with words
  still in motion. Implements Steven's "mobile [phone] doesn't come up
  until the text is visible" note.
- **New: "Learn more about MI" CTA pill.** Reveals as the final beat
  after the last word clears its blur. Opens a modal (see below).
- **New: `MiModal` component.** Self-contained dialog scaffold —
  esc-to-close, click-backdrop-to-close, body-scroll lock, focus-visible
  close button. Initial content was a placeholder pending Steven's MI
  doc (rewritten in Pass 2-B).
- **Cards made responsive across breakpoints.**
  - Was: `<SceneThreeCards>` rendered only at `lg+` (1024+).
  - Now: renders at `sm+` (640+) with `clamp()`-based positions so the
    orbit hugs the phone consistently across tablet and laptop.
  - Added `MobilePillStack` for `<sm` viewports — three compact pills
    ("Clinically grounded · Whole-person aware · Always supportive")
    at the top of the section so phones never lose the three pillars
    entirely.
- Section padding, text spacing, button padding, and card padding all
  given progressive `sm:` / `md:` / `lg:` ramps.

---

## Pass 2-B — June 17, 2026

**Scope:** Statement copy refinement using the MI white paper, Problem
section rewrite, and the new Three Levels of Care section.

**New source docs read:**
- `Chronilogix Docx/MI.docx` — full Motivational Interviewing white paper.
- `Chronilogix Docx/IP.pdf` — Three Levels of Care one-sheet.

### Statement (`components/sections/Statement.tsx`)
- **Sentences rewritten** using language from the MI white paper:
  1. `Chronilogix is the AI-native behavioral health and chronic care coaching platform.` *(unchanged)*
  2. `Built on world renowned expert Dr. Ken Resnicow's life work in Motivational Interviewing, the gold standard for lasting behavior change.`
     *(Pass 2-C in-canvas edit — "world renowned expert" restored before
     "Dr." per user request. Hyphen intentionally omitted to match
     Steven's transcript style.)*
  3. `Proven across two hundred randomized trials. Engineered into every Chronilogix conversation.`
  - Sentence 2 now names the method and defines its purpose in one
    breath. Sentence 3 became a proof beat. "world-renowned" descriptor
    moved into the modal (where it lives alongside Resnicow's full
    credentials) so the headline stays tight.
- **MI modal expanded** from a 3-paragraph stub into a substantive
  briefing with six mini-sections — *What it is · How it works · The
  evidence · Why it fits AI · Dr. Ken Resnicow · Inside Chronilogix*.
  All copy paraphrased from the MI white paper; no direct quotes that
  could conflict with the published version. Modal now scrolls
  internally on short viewports and has a footer with a stubbed "Read
  the full white paper" link (awaiting destination URL).
- **MI modal typography re-aligned to site tokens** (Pass 2-C, in-canvas
  edit). The earlier version used a bespoke uppercase eyebrow
  (`text-[11px] uppercase tracking-[0.1em]`) — the exact drift the
  `.eyebrow` utility in `globals.css` was written to prevent ("no
  horizontal bar, no all-caps, no wide tracking"). All modal text now
  uses the shared utilities: top label uses `.eyebrow` (sentence-case,
  brand orange), sub-section labels use `.eyebrow-muted`, the modal
  title is a serif `text-section` heading, and body copy uses
  `.body-quiet`. Modal now sounds in the same voice as every other
  section on the page.
- **Footer simplified.** "Got it" close button removed; "Read the full
  white paper" promoted to `.btn-primary` and centered as the modal's
  single, prominent action. Esc / backdrop-click still close the
  dialog.

### Problem (`components/sections/Problem.tsx`)
- **Headline rewritten** to lead with the "human care cannot scale"
  framing the client asked for in section 6 of the feedback doc:
  - Was: `The most expensive mental health and chronic care moments / happen between appointments.`
  - Now: `Human care cannot scale / to the moments that matter most.`
- **Intro paragraph expanded** to fold in the 15M-coach shortage stat,
  the wait-time/cost context, and an explicit resolution line naming
  Chronilogix as the only scalable answer.
- **Facts panel updated:**
  - **New lead fact:** `15M+` global shortage of behavioral/chronic-care
    coaches (WHO Mental Health Atlas).
  - **Diabetes fact updated** to Steven's new pull: `40M` Americans
    with diabetes (11M undiagnosed) and `115M` with prediabetes (CDC),
    replacing the prior `38.4M / 97.6M / 70% progression` framing.
  - **Wait-time fact retained** (`2–6 wks`, WHO).
  - **Hispanic-men equity fact** demoted from facts panel to the
    observations list so the three-fact rhythm stays clean; same JAMA /
    CDC source carried forward.

### LevelsOfCare (`components/sections/LevelsOfCare.tsx`) — NEW
- Brand-new section sourced directly from the IP one-sheet.
- **Anchor headline:** `One engine. Three levels. Every gap covered.`
- Three level cards — *First Line of Care*, *Hybrid Process*, *Digital
  Only* — each with a 3:4 framed visual on top and label + tagline +
  body + 3-item "fits" list underneath.
- **Initial visual treatment** (Pass 2-B, replaced in Pass 2-C below):
  abstract geometric diagrams — 24-hour clock arc, two overlapping
  circles, phone with chat bubbles. They worked but violated the
  illustration brief: brand orange as a fill rather than an accent, and
  they didn't sit visually with the SessionWalkthrough siblings.

### LevelsOfCare — contextual artifacts + layout swap (Pass 2-E, in-canvas)
**Trigger:** the v2 illustrations (geometric diagrams) and v3 UI-fragment
proposals (wait-time card, session timeline, tally grid) didn't read as
specimens of each level's actual scenario — they were generic enough to
sit on any homepage. User asked to rethink artifacts in the context of
each level, and to restructure the row so identity sits *above* its
artifact in the left column, with content on the right.

- **Row layout restructured.** Each level row is still `md:grid-cols-12`,
  but now:
  - Left column (`md:col-span-5`): identity block on top
    (eyebrow + serif title + supporting line) and the artifact panel
    stacked vertically below it. They share the same column so they
    read as one editorial block.
  - Right column (`md:col-span-6 md:col-start-7`): lead-in sentence
    and bullet list.
- **Artifacts replaced** with quiet typographic specimens — one per
  level, each contextual to the level's IP doc scenario rather than
  a generic product UI fragment:
  - **Level 01:** `Care available today` — every traditional channel
    is unavailable / waitlisted / out of budget; only Chronilogix is
    `Available now`. Makes the doc's premise ("for the people who
    fall through the cracks of traditional care") literal.
  - **Level 02:** `Pre-session briefing · Dr. Chen` — the actual
    handoff document the therapist sees on Friday after Tuesday's
    session, with the AI's between-visit summary. Directly maps to
    the doc bullet "continuously collects information for the
    therapist so no progress is lost."
  - **Level 03:** `Consistency log · last 30 sessions` — same coach
    30/30, no tone variance, zero bias flags, cultural adaptation
    active, lowest cost tier. Each row maps to one of the Digital
    Only bullets.
- **Shared `ArtifactPanel` component.** All three artifacts use the
  same structure (caption + key/value rows + brand-highlighted final
  row) so they read as a coherent family. No card chrome, no border,
  no shadow. Tonal contrast and weight do the structuring; brand
  orange appears only on the highlighted row.
- Rows fade up with a 60ms stagger per row, anchored to the level row
  coming into view.

### LevelsOfCare — vertical-stack restructure (Pass 2-D, in-canvas)
**Trigger:** user feedback on the horizontal 3-card layout — text barely
readable at thirds, lines and italic eyebrows breaking the IP-section
register, illustrations still not aiding the message.

- **Layout flipped from 3-up grid to one-row-per-level vertical stack.**
  Each row is a md:grid-cols-12 split: identity on the left ~4/12
  (eyebrow + serif level title + sentence-case supporting line),
  content on the right ~7/12 with a 1-col offset (lead-in sentence +
  bullet list). Whitespace alone separates rows (gap-16/20/24) — no
  hairline dividers between rows.
- **Header hierarchy re-aligned to IP.pdf:**
  - Eyebrow → `Three Levels of Care` (was the doc title, demoted to
    eyebrow per the one-sheet's layout).
  - Heading (was the subhead) → `Chronilogix meets people where they
    are, across every gap in the care continuum.` at text-hero serif.
    Per user direction: "the subheading should be the heading."
  - Anchor `One engine. Three levels. Every gap covered.` moved to a
    closing tagline below the rows — matches its position at the
    bottom of the IP one-sheet.
- **All italics removed.** Level subhead lines previously rendered as
  italic text-[13.5px] are now sentence-case `.body-quiet`.
- **All hairline rules removed** from the row layout — both the
  ordinal/label rule and the in-visual dividers from the previous
  pass.
- **Type sizes bumped for readability:** lead-in and bullets now
  `.body-prose` (16/18px) instead of 15px; bullet spacing increased
  from space-y-2 to space-y-4; bullet dots upsized from 4px to 6px.
- **Visuals removed entirely** pending an illustration plan (see
  separate proposal in the response message). Each row is now a
  text-only block. Visual slot will be re-introduced once the
  illustration approach is approved.
- **Ordinal label changed** from raw `01 / 02 / 03` to `Level 01 / 02
  / 03` so it reads as content, not chrome.

### Solution (`components/sections/Solution.tsx`) — Pass 2-D
- `<SessionWalkthrough />` render commented out while LevelsOfCare is
  being iterated. Import preserved so re-enabling is a one-line
  uncomment. Restore once levels section is signed off.

### LevelsOfCare — full rework (Pass 2-C, in-canvas)
**Trigger:** user feedback — section needs more thought in both copy and
design; visuals need to be more visually descriptive *and* visually
balanced; align to the typography + design patterns the rest of the
site uses; reference design-context docs if they exist.

**Reference docs consulted:**
- `notes/agents/illustration/ROLE.md` (illustration role + quality bar)
- `notes/agents/illustration/wave1-spec.md` (existing wave-1 specs)
- `components/sections/SessionWalkthrough.tsx` (sibling visual pattern)
- `app/globals.css` (typography utilities)
- `Chronilogix Docx/IP.pdf` (re-read for verbatim copy)

**Copy — now verbatim from the IP one-sheet:**
- Eyebrow → `Three Levels of Care` (matches doc title exactly)
- Anchor heading → `One engine. Three levels. Every gap covered.`
  (unchanged — was already verbatim)
- Lead paragraph → `Chronilogix meets people where they are, across
  every gap in the care continuum.` (the doc's exact subhead — replaces
  my earlier paraphrase)
- Each level card replaces my paraphrase with the doc's exact wording:
  - Tagline lines: *Where no other coverage exists* · *Human + AI,
    working together* · *For those who prefer it this way*
  - Lead-in sentences: *For the people who fall through the cracks of
    traditional care:* · *Combines the depth of human coaching with
    the consistency of AI:* · *A growing category of cohorts who get
    better outcomes with a fully digital coach:*
  - Bullet lists: every bullet from the one-sheet, in original order.
    Level 1 expanded from 3 paraphrased bullets to all 7 source
    bullets; Level 2 kept at 3 (matches source); Level 3 expanded
    from 3 to 4.

**Visuals — redesigned to match SessionWalkthrough's pattern exactly:**
- Outer frame structure now follows SessionWalkthrough's step cards
  byte-for-byte: blurred background image (`card-1-bg.jpg` /
  `pattern.png` / `card-3-bg.jpg`) → `bg-gradient-to-b from-paper/65`
  legibility wash → centered white "figure" card with the warm-brown
  soft shadow (`shadow-[0_18px_40px_-14px_rgba(40,25,15,0.22),...]`)
  and `ring-1 ring-ink/[0.04]`.
- Each visual is now a **UI artifact** the visitor could plausibly see
  inside the product (per the illustration brief: "if the same
  illustration could appear on any AI startup's homepage, it's wrong"):
  - **Level 1:** a "Next in-clinic appointment" card showing a date
    weeks out (faded serif, ink-subtle) above a hairline divider and a
    pulsing brand chip "Chronilogix · Available now". Visualizes the
    wait the level bridges.
  - **Level 2:** a one-week care timeline. Two therapist anchors
    (initial capsule + tall hairline) bracket five small brand dots
    for AI check-ins. Legend below ("Dr. Chen / Chronilogix") and a
    footnote ("Tuesday's notes ready for Dr. Chen"). Visualizes the
    "continuously collects information for the therapist" bullet.
  - **Level 3:** a session-quality panel. Serif "Same coach. / Every
    session." headline above five uniform brand tally marks (same
    height, same color — the visual proof of uniformity) and a
    footnote: "Last 30 sessions · No variance".
- All three visuals now share: same outer frame, same figure-card
  width (~252–260px), same hairline divider as the central beat,
  same `fadeUp` / `tallyRise` / `scaleXFromLeft` animation primitives
  used by SessionWalkthrough.
- Brand orange now appears only as accents (≤6px dots, the chip ring,
  the brand-tinted chip background at 8% opacity, tally marks),
  matching the illustration brief's "brand orange is an accent, not a
  fill" rule.

### Solution (`components/sections/Solution.tsx`)
- `LevelsOfCare` imported and rendered between the agent cards and the
  existing `SessionWalkthrough`. Resulting Solution arc:
  1. Two coaches (Roni + Millie)
  2. **Three levels of care (new)**
  3. How a Chronilogix session works
- `SessionWalkthrough` kept in place per user instruction.

---

## Deferred / pending — June 17, 2026 (not yet addressed)

These items from the feedback doc are explicitly waiting on inputs or
on user direction:

- **Section 4 — Interactive chatbot reintegration** — user said "ignore
  for now, we will target it later." `AskChronilogix` component remains
  commented out in `app/page.tsx`.
- **Section 6 — Aetna placement** — user said Aetna does not need to be
  mentioned in the Moments/Problem section; "maybe a link to Aetna's
  case study" — not yet wired. The existing Aetna stat tile in
  `CustomerStories.tsx` (a separate cluster about "the science behind
  Chronilogix") is untouched and stays for now.
- **Section 6 — Horizontal scroll for the Outcome gallery** — user
  said "it's going to change, I will find a better layout for this as a
  reference." No edit made; awaiting reference.
- **Section 7 — Eliminate horizontal scrolling globally** — superseded
  by the section-6 hold above; revisit when the new gallery layout
  arrives.
- **Section 8 — B2B landing pages** — content pending from Steven.
- **MI white paper URL** — the "Read the full white paper" link in the
  MI modal is currently a stubbed `href="#"`. Wire when the destination
  is decided.
- **Pilot statistics (150-person test)** — Steven to send numbers for a
  Solution-section stat row.
