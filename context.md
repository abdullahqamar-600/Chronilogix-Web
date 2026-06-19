# Chronilogix Redesign — Session Handoff

## What this doc is

Working context for the Chronilogix homepage redesign. The POC is built and in-repo. We are now moving it to a full landing page. This file captures decisions made so far, the scope of the next pass, and the structural understanding of the current site so a new session can pick up without re-deriving it.

**Read alongside:** `CLAUDE.md` (project-level rules — brand hierarchy, source docs, non-negotiables) and `~/.claude/plans/plan.md` (active build plan).

---

## Redesign scope (locked)

We are NOT redesigning everything at once. Phased:

1. **Content** (first)
2. **Layout restructure** (second)
3. **Design tokens — imagery, typography, color** (third)

The current pass is scoped to **imagery + typography + color only**. Tone register (editorial vs. clinical vs. wellness-premium vs. bold-design-forward) is deliberately deferred — the user wants to see where these three pulls take us before committing to a register.

### Decisions captured from the user

| Area | Decision |
|---|---|
| **This pass covers** | Imagery, typography, colors. Layout restructure happens in a separate pass. |
| **Visual anchor** | **Human imagery leads.** "AI working" visuals + USPs take a secondary supporting role. No abstract-generative direction. |
| **Layout posture** | **Restructure + reskin** within the same 9 sections. Internal composition of sections can change; section merges/splits are on the table. The rounded-card chassis stays. |
| **References** | User will share references before we propose any direction. Do **not** propose type/color/imagery moves until refs land. |
| **Tone register** | Explicitly deferred. Do not pick editorial vs. clinical vs. wellness vs. bold-design — wait for refs. |

### Open questions flagged to the user (not yet answered)

1. **Photographic register** for human imagery — which of:
   - Documentary (real members, available light, NYT photo-essay)
   - Editorial portraiture (composed, controlled, Atlantic-cover)
   - Lifestyle / stock-adjacent (warm, optimistic — current `/problem.png` direction)
   - Clinical context (clinicians + members, exam-room context)

   These don't mix on one page. When refs land, identify which register the user's eye is on. Push back if refs mix registers.

2. **"AI working" imagery treatment** — currently the site uses all three of:
   - Product UI screenshots
   - Conceptual diagrams (memory pipeline, methodology)
   - Abstract visualization (`AIOrb`, animated visuals)

   Recommend consolidating to one. Decision deferred until refs.

3. **Type + color are coupled.** Same serif reads "warm editorial" on cream, "clinical prestigious" on cool palette. Wait for refs before proposing either independently.

---

## Current site — structural design language

The user asked for a structural read of the existing build before we touch anything. Summary captured here so the next session doesn't re-explore.

### The chassis: a "tray of cards"

`app/page.tsx` wraps `<main>` in `flex flex-col gap-2 p-2 md:gap-3 md:p-3`. Every section is an **inset card** floating on the page background with 8–12px gutter on all sides + between siblings. Each section carries:

- `rounded-[28px]` (unified, generous)
- `overflow-hidden`
- Own background color (cream / brand-50 / ink / paper-warm / image)

This is the dominant metaphor. Twine / Linear / Apple-marketing energy. No traditional section-with-horizontal-rules rhythm.

### Two viewport contracts

**Full-viewport panels** — Hero (`h-[260vh]` runway + `sticky top-2 h-screen` panel, scroll-driven scrub), Ask Chronilogix (`lg:min-h-[85vh]`), Problem (`lg:min-h-screen` 50/50 split).

**Editorial-padded panels** — `.section` utility = `py-24 md:py-32 lg:py-40`. Used by Solution, WhoWeServe, TrustSignals. USP is the exception (aspect-ratio media card).

### Horizontal system

- `.container-page` = `max-w-page` (**1240px**), `px-6 / md:px-12 / lg:px-20`
- `max-w-readable` (720px) defined but rarely used — per-element `max-w-sm/md/xl/2xl` instead
- Two-column splits only in Problem, WhoWeServe (`240px_1fr` sticky persona rail), Solution's three-card row
- Card grids: tight gaps (`gap-1.5–2`). Content grids: generous (`gap-12–20`).

### Vertical rhythm inside sections (consistent three-beat)

1. **Eyebrow** — `text-xs uppercase tracking-[0.16em] text-ink-muted`
2. **Headline** — `text-section` or `text-display`, **`font-normal`** (never bold), `tracking-tight`
3. **Body** — `text-base md:text-lg text-ink-soft leading-relaxed`, capped `max-w-xl/2xl`

Spacing: `mt-6` eyebrow→head, `mt-6` head→body, `mt-8` body→CTA, `mt-12–16` body→data. Stat rows separated by `border-t border-ink/10 pt-5/6` — **hairlines, not boxes**. No content-grouping shadows.

### Color as section identity (current palette)

| Panel | Background |
|---|---|
| Hero | photographic landscape on `#D8C9BC` |
| Ask Chronilogix | `brand-50` (#FFF5EE) |
| Problem | `paper` (white) |
| Solution | `paper-warm` (#FBF8F4 cream) |
| WhoWeServe | `paper` (white) |
| USP | `ink` (#0F1419 near-black) |
| TrustSignals | `brand-50` |
| Footer | white + bottom-anchored image |

Brand orange (`#F9904D` / `#FF7434`) reserved for: active state, primary buttons, single accent words, data bars, icon chips. **Never as a section surface.** Body CTAs are `bg-ink`, not orange.

### Typography (current)

- `display` — `clamp(2.75rem, 5vw+1rem, 5rem)` — Hero
- `hero` — `clamp(2.25rem, 3.5vw+1rem, 3.75rem)` — defined but unused
- `section` — `clamp(1.875rem, 2.4vw+1rem, 2.75rem)` — most H2s
- Stat values: `text-4xl md:text-5xl font-medium`
- Body: `text-base md:text-lg`
- Eyebrows: `text-xs / text-[11px] uppercase tracking-[0.14–0.20em]`
- Single family: **Neue Montreal** (self-hosted, system fallback). All headlines `font-normal`.

### Motion vocabulary (current — restrained)

- Hero scroll-driven scrub over 260vh (progress 0→1)
- `fadeUp` staggered in-card reveals (Solution intake list)
- Loops: SessionVisual MI questions 3.5s; WhoWeServe persona rotation 12s
- Continuous: `AIOrb` counter-rotating rings
- All gated by `prefers-reduced-motion`

### Nav + footer break the card grammar (deliberately)

Nav is `fixed`, floats over hero at `top-4/6` with no background, snaps to `top-0` + `bg-paper/85 backdrop-blur-md` once scrolled. Footer is full-bleed with bottom-anchored bg image — reads as "page ends" not "another card."

---

## Repo map (for orientation)

```
app/
  page.tsx          # 9-section composition (currently 7 wired)
  layout.tsx
  globals.css       # font-faces, keyframes, .container-page, .section, .btn-*, .eyebrow
components/
  Nav.tsx           # fixed, scroll-aware
  Footer.tsx        # full-bleed bg-image
  AIOrb.tsx         # counter-rotating rings
  ComplianceBadges.tsx
  HeroPhoneMockup.tsx
  NamedQuote.tsx    # shared Aetna-quote component
  sections/
    Hero.tsx              # 260vh runway, sticky scrub
    AskChronilogix.tsx    # textarea + suggestion pills
    Problem.tsx           # 50/50 image+stats
    Solution.tsx          # 3-card listen/ask/remember
    WhoWeServe.tsx        # 4-persona sticky rail
    USP.tsx               # Ken video poster
    TrustSignals.tsx      # Aetna anchor + 3 stats
    Pricing.tsx           # built, not wired in page.tsx
    FinalCTA.tsx          # built, not wired in page.tsx
    SocialProof.tsx       # built, not wired in page.tsx
  widget/
    QuestionsWidget.tsx
    useScrollTrigger.ts
tailwind.config.ts  # brand/ink/paper/slate scales, display/hero/section type
public/
  hero-landscape.jpeg, problem.png, ken-thumbnail.png, footer.png, cronilogix-logo.svg
```

**Note:** `Pricing`, `FinalCTA`, `SocialProof` exist but are not currently rendered in `app/page.tsx`. The wired sections are Hero → AskChronilogix → Problem → Solution → WhoWeServe → USP → TrustSignals.

---

## Non-negotiables (from CLAUDE.md — re-read before any copy/structure change)

- **Brand hierarchy:** Chronilogix is the platform/subject. Rooney AI is the engine (introduced once in hero subhead, sparingly elsewhere). "Questions?" widget is decoupled utility — muted slate/gray, never brand orange, `?` icon not chat bubble, "Got a question?" header with "Powered by Rooney AI" as small muted sub-label.
- **Dr. Resnicow appears** in: hero eyebrow, hero subhead, Section 3 Stage 2 callout, Section 5 standalone block, Section 6 cards.
- **Aetna quote appears twice** (Section 2 anchor-scale + Section 6 supporting). One string constant, two visual treatments.
- **No anonymous quotes anywhere.**
- **No dollar amounts in Pricing** until Steven confirms.
- **Section 4 resolution paragraphs** must name *Chronilogix* as the subject — not "AI", not "Rooney".
- **988 reference** is plain text only — no `tel:` link, no external URL.

## Source documents (truth — re-read before answering content questions)

- `~/Downloads/chronilogix-business-context.md`
- `~/Downloads/chronilogix-homepage-copy-messaging.md` (copy v3)
- `~/Downloads/chronilogix-rooney-widget-ux-spec.md`

---

## What the next session should do

1. **Do not propose imagery / type / color directions yet.** The user is sharing references first. Wait for them.
2. **When refs land:** before proposing anything, narrate back to the user what you think the refs are saying — register, mood, what specifically you're responding to. Calibrate before designing.
3. **Treat the three layers (imagery, type, color) as coupled.** Don't pick one in isolation.
4. **Watch for mixed-register references.** If user shares refs that mix documentary + lifestyle + clinical photography, push back and force a choice.
5. **Layout restructure is a separate pass** that comes after these tokens are decided. Don't roll it into the same proposal.
