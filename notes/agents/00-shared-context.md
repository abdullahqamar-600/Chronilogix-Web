# Shared context — Chronilogix homepage v2

This document is the **canonical brief** for every agent on this engagement
(Creative Director, Web Designer, Illustration/Graphics Designer, Motion
Designer). Read it before any other doc in `notes/agents/`. Everything in
here is non-negotiable unless the Creative Director explicitly overrides it
in a pass document.

---

## 1. The product, in one breath

**Chronilogix** is a 24/7 AI coaching platform for chronic care and behavioral
health, built on 30+ years of Motivational Interviewing science by Dr. Ken
Resnicow. Sold B2B (employers, brokers, health plans, wellness platforms,
ACOs, governments). Two agents live inside it — **Roni** (chronic care /
diabetes) and **Millie** (mental health) — but the website sells the
**platform**, not the agents. Agents are named exactly once: in section 03.

Tagline: **Chronic Coaching That Clicks™**
Voice: warm, clinically credible, plain-spoken. "Care that listens first."

## 2. Audience priority

1. Employers / HR / benefits leaders
2. Benefits brokers
3. Health plans + ACOs
4. Wellness platform partners (white-label)
5. Governments + large health systems

Conversion action: **Book a demo.** Everything else is in service of that.

## 3. The brand hierarchy (do not blur it)

| Layer | What it is | How to refer to it |
|---|---|---|
| **Chronilogix** | The platform + the company. The thing being sold. | Subject of every headline, CTA, resolution paragraph. |
| **Roni / Millie** | Two agents inside Chronilogix. | Named **once**, in section 03. Lightly in section 04 (demo) if needed. Absent elsewhere. |
| **"Questions?" widget** | Visitor-help tool, powered by Rooney AI under the hood. | Muted slate, `?` icon, bottom-right. Reads as utility. **Never** brand orange, never auto-opens. |

A first-time visitor must not confuse Roni/Millie/widget for the product being
sold. If they do, the brand has failed.

## 4. Tech + design system (already in repo)

- **Stack:** Next.js (App Router) + React + TypeScript + Tailwind.
- **Type:** Newsreader serif for display + titles; sans for body + eyebrows.
- **Eyebrows:** uppercase, `tracking-[0.22em]`, 11px, `text-ink-muted`.
- **Brand palette:** `#F9904D` (warm orange, primary), `#FF7434` (deeper
  accent), `#E45A1C` (700), paper-warm cream `#FBF8F4`, ink `#0F1419`. Roni
  uses warm orange. Millie uses rose/plum (`#B8617C` / `#7A3553`).
- **Motion tokens** (in `app/globals.css`):
  - Easings: `--ease-out-expo`, `--ease-out-quart`, `--ease-out-soft`.
  - Durations: `--dur-quick 180ms`, `--dur-state 320ms`,
    `--dur-reveal 700ms`, `--dur-reveal-long 1100ms`.
  - Reveal pattern: blur(3–6px) + opacity 0.12–0.45 → blur(0) + opacity 1.
  - **No bounce, no elastic, no overshoot.** Only ease-out curves.
  - `prefers-reduced-motion` is respected everywhere.
- **Layout:** sections sit inside `container-page` (max 1240px). Most sections
  are rounded `rounded-[28px]` with subtle paper-warm or paper backgrounds.
  Sticky scroll-driven sections use `h-[Xvh]` runways with a `sticky` inner.

## 5. The current site, honestly

Working:
- Hero (video + word-blur reveal + bottom cluster).
- Section 2 Scene 1 (the three serif sentences reveal).
- "Two coaches. One way of listening." (Roni + Millie strips, 8s halo loop).
- Spacing, fonts, color, rounded-card layout system, blur-bg imagery.

Working at ~60% — needs more depth:
- The agent visuals (Roni/Millie blobs). Idea is right; execution is shallow.

Not working:
- Section 2 Scenes 2 + 3 (phone rises + orbit cards). Generic; doesn't tell
  the right story. The orbit cards repeat content that already lives below.
- "Three patterns. Every session." Reads like generic AI capability copy.
- "Who we serve" — personas are wrong, content is generic, mix is wrong.
- "A proven method. Validated AI. Decades of science." Largely duplicative
  with scene 3 cards; candidate for major rework or removal.

Empty (the whole story is not told):
- No real product demo (a "see it work" beat).
- No core capabilities block (MI digitized, 24/7, culturally intelligent,
  hybrid model).
- No integrations block (where it sits in the care stack).
- No customer stories beat (Aetna, DPP, equity gap).
- No trust + security block (HIPAA-built-for, SOC 2 in progress, data policy).
- No pricing block.
- No final CTA section.

## 6. The new copy (single source of truth)

The full new copy v2 lives in `notes/agents/01-copy-v2-canonical.md`. That is
the only place copy is allowed to live. If you need to deviate, ask the
Creative Director — do not edit the canonical doc unilaterally.

## 7. Non-negotiable rules (carry across every section)

- **Chronilogix is the subject** of every section that isn't section 03.
- **Roni and Millie** named **once** (section 03). Mentioned at most one more
  time (section 04 demo caption) if the conversation flow benefits.
- **Dr. Ken Resnicow** is the credibility anchor. He appears in: hero subhead,
  Two-coaches section connective line, Core capabilities block 1
  (MI digitized), Proof-in-numbers section (30+ years), Customer stories.
- **Aetna line** is permitted **twice** with different visual weights — once
  as a hero-scale trust signal, once inside Customer Stories.
- **988** is plain text only. No `tel:` link, no external URL. The line "988
  escalation built in" is a *safety claim*; treat it as such.
- **No anonymous quotes anywhere.** Healthcare doesn't tolerate them.
- **No dollar amounts** in the Pricing block. PEPM is "talk to sales".
- **HIPAA / SOC 2:** "Built for HIPAA," "SOC 2 in progress." Never claim a
  certification we don't hold.
- **First-party vs methodology stats:** every Aetna / DPP / Dartmouth number
  gets a visible attribution. Never imply Dartmouth's Therabot result is
  Millie's data.
- **Performance first:** CSS/SVG where possible. WebGL only if a single hero
  beat genuinely demands it.
- **Reduced motion:** every animation needs a graceful fallback.

## 8. The four agents on this engagement

| Agent | Lives in | Owns |
|---|---|---|
| Creative Director | `notes/agents/cd/` | Master plan, per-section briefs, sign-off, conflict resolution. |
| Web Designer | `notes/agents/web/` | Section structure, hierarchy, layout, type sizes, copy treatment, responsive behavior. |
| Illustration + Graphics Designer | `notes/agents/illustration/` | Agent visuals (Roni/Millie), product chat UI, in-section illustrations, widgets, supporting graphics, icons. |
| Motion Designer | `notes/agents/motion/` | Scroll-driven scenes, reveal sequences, in-section micro-animations, easings, durations, reduced-motion behavior. |

The CD orchestrates. Designers do not collaborate directly across roles —
they go through the CD via their `*-spec.md` deliverables.

## 9. Output discipline

- Every deliverable is a markdown file in the agent's folder, named clearly.
- Specs reference *which file in `components/sections/` they affect*.
- Specs include real values: line numbers, pixel sizes, durations, easings,
  copy strings, attributions.
- No mood boards, no AI buzzwords, no "synergize." Show, don't gesture.
