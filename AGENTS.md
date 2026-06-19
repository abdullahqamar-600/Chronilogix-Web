# Chronilogix — Homepage POC

## What this project is

Homepage POC for **Chronilogix**, an AI-native behavioral health and chronic care coaching platform. The page is being built for a major product launch at a healthcare industry conference in **June 2026**. Credibility-first, business-benefit-second narrative.

The platform's AI engine is **Rooney AI**, built on **Dr. Ken Resnicow's** 30 years of Motivational Interviewing (MI) research. Sold B2B (PMPM, university subscriptions, employer benefits, wellness app integrations) — the patient/student/employee is the end user but never the buyer.

## Brand hierarchy — strict, do not blur

1. **Chronilogix** — the platform and the company. Subject of every headline, CTA, and resolution paragraph.
2. **Rooney AI** — the engine *inside* Chronilogix. Introduced once in the hero sub-headline; referenced sparingly elsewhere. Never the lead.
3. **"Questions?" widget** — a visitor help tool powered by Rooney AI but **not** labeled as such on the surface. Lives bottom-right, muted color, scroll-triggered after Section 2, never auto-opens on homepage.

A first-time visitor must not confuse the widget for the product being sold. If they do, the brand has failed.

## Source documents (truth)

Three docs in `~/Downloads/` drive every decision. Re-read the relevant one before answering questions about copy, section structure, persona content, or widget behavior:

- `~/Downloads/chronilogix-business-context.md` — business model, personas, differentiators, compliance posture
- `~/Downloads/chronilogix-homepage-copy-messaging.md` — finalized copy v3 across 9 sections + footer
- `~/Downloads/chronilogix-rooney-widget-ux-spec.md` — widget behavior, trigger logic, visual differentiation rules

## Tech stack

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS
- **Typography:** Neue Montreal (self-hosted in `public/fonts/`)
- **Brand colors:**
  - Primary `#F9904D` (warm orange)
  - Accent `#FF7434` (deeper warm orange)
  - The widget uses muted slate/gray — **never** the brand orange

## Page structure (9 sections + footer + widget)

| # | Section | Purpose |
|---|---|---|
| Nav | Logo · Solutions · How It Works · Who We Serve · Pricing · Resources · **Book a Demo** | |
| 1 | Hero | Animated Chronilogix platform chat (Marcus exchange, looping, "Chronilogix" as sender — not Rooney) |
| 2 | Credibility Bar | Aetna anchor quote ("identified and engaged an additional 25%…") + 3 stats (15M+, 400+, 50–70%) + compliance badges. **Widget trigger fires here.** |
| 3 | Platform in Motion | 3-stage walkthrough — static annotated screenshot frames until real screens land |
| 4 | Who We Serve | 4 persona tabs — **Employers default**, then Universities, Health Plans, App Partners |
| 5 | How It Works | 3 steps + Dr. Resnicow callout (photo omitted) + 3 differentiator badges + technical note |
| 6 | Clinical Proof | 3 cards + Aetna quote (full-width) + Crisis Protocol callout (988 = plain text only) |
| 7 | Trust & Security | "Member data is never used to train our models" + 3 pillars + compliance badges |
| 8 | Pricing | 3 cards, all "Custom pricing" — no dollar amounts anywhere |
| 9 | Final CTA | Mission framing close + Book a Demo + Download Whitepaper |
| Footer | 5 columns + bottom strip | |
| Widget | "Questions?" floating help — bottom-right, scroll-triggered, never auto-open on homepage | |

## Confirmed POC decisions

| Area | Decision |
|---|---|
| Section 3 walkthrough | Static annotated screenshots (3 stages) |
| Hero chat behavior | Continuous loop, pause-on-hover, "Chronilogix" as sender |
| Pricing | All cards "Custom pricing" + CTA — no `$[X]` placeholders |
| Mobile widget | Visible, same scroll trigger as desktop |
| CTAs | `TODO` placeholder anchors (Calendly URL + contact email to be wired later) |
| Missing assets | Omit Dr. Resnicow photo, Aetna logo, partner logos, screenshots until provided |
| Universities tab stat | Use sourced line: "1 counselor per 200-300 students. 1-2 week wait times." (replaces unsourced "1 in 3 students") |
| 988 reference | Plain text only — no `tel:` link, no external URL |
| Reusable components | Aetna quote, compliance badges, primary CTA, named-quote treatment all live as single shared components reused across sections |

## Outstanding items (must resolve before June launch)

Non-blocking for POC build, but required before the conference:

1. Neue Montreal `.woff2` font files (build proceeds with system fallback if delayed)
2. Calendly URL + contact email for all CTA anchors
3. Dr. Resnicow photo
4. Aetna logo (with usage rights) and any partner/customer logos
5. Platform UI screenshots for hero and Section 3
6. Confirmed SOC 2 Type II and GDPR Ready certification status
7. ROI whitepaper title + download URL
8. Clinical approach page URL (Section 6 micro-CTA)

## Non-negotiable rules

- **Every Section 4 resolution paragraph names *Chronilogix* as the subject** — not "AI", not "Rooney". The buyer is purchasing Chronilogix.
- **Dr. Resnicow must appear** in: hero eyebrow, hero sub-headline, Section 3 Stage 2 callout, Section 5 standalone callout block, Section 6 cards. He is the differentiator, not a detail.
- **Aetna quote appears twice** — Section 2 as a hero-scale trust signal, Section 6 surrounded by clinical evidence. Same string, two visual treatments. Source from one constant.
- **Widget must read as utility** — muted color, `?` icon (not chat bubble), header reads "Got a question?" with "Powered by Rooney AI" as a small muted sub-label only. Never uses brand orange.
- **No anonymous quotes anywhere** — they carry zero credibility in healthcare.
- **No dollar amounts in Pricing** until Steven confirms numbers.

## Plan file

Active build plan: `~/.Codex/plans/plan.md`
