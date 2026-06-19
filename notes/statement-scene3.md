# Statement section — Scene 3 (reasoning cards)

Handoff context for the Statement section's third scene. Read this before changing anything inside it.

## What it does

The Statement section is the second section on the homepage. It runs as one sticky-pinned panel across ~240vh of scroll, with three scenes inside:

1. **Scene 1** — word-by-word reveal of three sentences. Says **what** Chronilogix is.
2. **Scene 2** — iPhone mockup rises. Shows **the surface** the member touches.
3. **Scene 3** — phone stays centered, chat reveals turn-by-turn, three "reasoning cards" orbit it. Shows **what's actually happening inside that conversation, and why.**

Scene 3 is the section's payoff — the answer to the buyer's real question: *how is this different from ChatGPT with a wellness prompt?* The chat shows the human-facing surface (warm, simple). The cards expose the clinical engine (named techniques, captured anchors, behaviorally-grounded pacing).

## Files

- `components/sections/Statement.tsx` — runway, scene-3 progress math, three reasoning cards (`SceneThreeCards`, `FloatingCard`, `ChronilogixGlyph`, `MarcusGlyph`).
- `components/HeroPhoneMockup.tsx` — phone shell + scroll-driven chat. Misleadingly named — only Statement consumes it; Hero's own phone mock is commented out.

## The chat (authoritative copy)

Three turns, one paragraph per bubble. A Motivational Interviewing exchange — the technical heart of the platform made visible without ever naming MI on the surface. Lives in `HeroPhoneMockup.tsx :: CONVERSATION`.

1. **AI:** "What would make this time worth finishing — for you, not anyone else?"
2. **Marcus:** "My son starts Little League next fall. I want to be there on the sideline."
3. **AI:** "That's the thing to hold on to. Let's start small enough that it lasts."

Why this exchange: turn 1 = evocative open question pulling for internal motivation; turn 2 = the anchor surfaces in Marcus's own words; turn 3 = affirmation + bite-sized planning.

Compressed from an earlier five-turn version. Multi-paragraph bubbles eliminated so each turn lands as one self-contained thought — a buyer reads the whole exchange in seconds, and the cards have a clean 1:1 turn pairing.

## The cards (authoritative content)

Each card pairs to one chat turn and answers two questions about it: **what the AI is doing** and **why**. Content lives inline in `SceneThreeCards`.

| Card | Pairs with | Content |
|---|---|---|
| **1 — Evocative open question** (top-center) | Turn 1 | Hero (serif): *"What would make this time worth finishing?"* → Label (sans semibold): "Evocative open question" → Body: "Asks Marcus for his own reason — not ours." |
| **2 — Anchor identified** (mid-left, overlapping phone) | Turn 2 | Label: "Anchor identified" → Hero (serif, larger): *"On the sideline next fall."* → Attribution: `M` avatar + "Marcus · Tuesday 8:41" |
| **3 — Next step** (mid-right, overlapping phone) | Turn 3 | Label: "Next step" → Body: "Week 1: under 10 minutes a day. Small enough to survive a hard week." → Attribution: Chronilogix glyph + "Chronilogix · Tuesday 8:42" |

The ideas each card carries: **internal motivation** (card 1), **the personal anchor** (card 2), **bite-sized sustainability** (card 3). Nothing repeats. Each card pulls weight.

Card 2's hero quote is verbatim from Marcus's chat line (compressed but not invented — earlier draft had "Not in a chair" which he never said; consistency matters because the layout invites the comparison).

## Scroll engine + scene boundaries

Same engine as scene 1's word reveal: `progress = clamp(-rect.top, 0, runway) / runway`, where runway = `el.offsetHeight - viewportHeight`. Section is `h-[240vh]` with a sticky child at `top-2 h-[calc(100svh-1rem)]`.

| `progress` range | Scene |
|---|---|
| 0.00 → 0.45 | Scene 1 — words reveal (per-word scroll-driven blur+opacity) |
| 0.12 → 0.65 | Scene 2 — phone rises (overlaps scene 1's tail) |
| 0.55 → 1.00 | Scene 3 — chat reveals, cards arrive |

`SCENE3_START = 0.55`. Scene 3's own progress: `sceneThreeRaw = clamp01((progress - 0.55) / 0.45)`, eased with `easeInOutCubic` for visual derivatives. Cards and chat use the **raw** value so windowing math stays linear.

During scene 3: scene-1 words fade out (`wordsFade`, clean by ~0.33 of sceneThreeRaw); phone keeps rising (`maxRise = baseRise + sceneThree * sceneThreeRiseBoost`, 52% → 82% visible on desktop) so the chat reads fully; phone does **not** shift or scale; chat turns reveal via `chatProgress = sceneThreeRaw` passed into `HeroPhoneMockup`.

## Timing map

All in `sceneThreeRaw` (0 → 1). Reveal = `clamp01((s3 - start) / length)`.

| Element | Window | Notes |
|---|---|---|
| Chat turn 1 (AI) | 0.06 → 0.22 | "What would make this time worth finishing…" |
| **Card 1** | **0.24 → 0.40** | Drops down (`translateY: -22 → 0`) |
| Chat turn 2 (Marcus) | 0.32 → 0.48 | "My son starts Little League…" |
| **Card 2** | **0.50 → 0.66** | Slides left (`translateX: +22 → 0`) |
| Chat turn 3 (AI) | 0.58 → 0.74 | "That's the thing to hold on to…" |
| **Card 3** | **0.76 → 0.92** | Slides right (`translateX: -22 → 0`) |

Each card trails its paired turn by ~0.02 so it lights up just after the turn lands — reads as reasoning *about* the chat, not predicting it. Cards 2 and 3 slide *outward from the phone*, so they feel born from the conversation, not placed on the wall.

## Layout

Phone stays centered horizontally. Cards anchor with `calc(50% ± Xvw)` so the relationship to the phone holds across viewport widths. Layout forms an asymmetric triangle: top-center / mid-left / mid-right, mirroring the reference image.

| Card | `top` | Horizontal | Z-index | Role in composition |
|---|---|---|---|---|
| 1 | 12% | `left: 50%; transform: translateX(-50%)` | **0** (behind phone) | **Crown.** Centered above phone, bottom edge lightly tucked under the bezel. Apex of the triangle. |
| 2 | 36% | `right: calc(50% + 130px)` | **0** (behind phone) | **Left wing.** Mid-phone height, ~50px right edge tucked behind phone left. Symmetric outward offset with Card 3. |
| 3 | 60% | `left: calc(50% + 130px)` | **20** (in front) | **Right wing, focal.** Pairs with the closing chat turn at the bottom. In front of phone with white bg = visual punch. Mirrors Card 2's 130px outward offset. |

`FloatingCard` composes a `transform` baked into `positionStyle` with the entry-animation transform, so Card 1 can use `translateX(-50%)` for centering without breaking the slide-in animation.

**Layered composition (asymmetric triangle)**: Phone container has `zIndex: 10`. Cards 1 and 2 sit behind it (`zIndex: 0`), Card 3 sits in front (`zIndex: 20`).

The cards form a clean triangle:
- **Apex** = Card 1, top center, slightly tucked behind phone top.
- **Left base** = Card 2, mid-height, slightly tucked behind phone left.
- **Right base** = Card 3, lower than Card 2, in front of phone, white bg.

Cards 2 and 3 use **identical 130px outward offsets** so they mirror each other across the phone's center axis. Vertical rhythm steps evenly (~24% between cards) from apex to right base, giving the triangle a deliberate downward-right diagonal that matches the conversation's chronological flow (turn 1 → turn 2 → turn 3, top → middle → bottom).

The tucked-under effect on Cards 1 and 2 keeps them recessive (phone is visual hero); Card 3's in-front white treatment makes it the focal punch. Visible content area never falls below 230px on the behind-phone cards — readability is preserved.

**Why px-based horizontal offsets, not vw**: phone width caps at 360px (`clamp(260px, 26vw, 360px)`) but viewport width keeps growing. An earlier `vw`-based offset (`calc(50% + 9vw)`) drifted away from the phone as the viewport widened — at 2000px the cards barely touched the phone. Fixed px offsets keep the relationship stable across the entire desktop range (1024-2000px+).

**Card 3 white bg vs Cards 1/2 cream bg**: `FloatingCard` takes a `bgClassName` prop (default `bg-[#FCFBFA]` cream). Card 3 passes `bg-white` so the in-front card visually differentiates from the behind-phone cards.

Overlap is intentional: it gives depth and signals "these thoughts belong to this conversation," not "these are separate panels next to it."

## Creative-direction rules (survived iteration — don't undo without reading)

1. **Phone never shifts or scales in scene 3.** Earlier attempts moved it left + scaled it down to "make room" for cards. Broke the relationship the viewer just built in scene 2.
2. **Cards orbit the phone with tight gravity.** Earlier they sat at section corners (`right: 5vw`) and read as decorative posters. Anchor to phone-relative coords.
3. **No all-caps eyebrows.** Sentence-case sans labels only ("Evocative open question", "Anchor identified", "Next step").
4. **No live-pulse dots, no status indicators.** Read as noise. Removed.
5. **No pills.** Card 3 used to have a "Bite-sized · sustainable" pill. Body carries the idea in prose now.
6. **Serif/sans blend per card.** Cards 1 and 2 use serif for their quoted hero string and sans for everything else. Card 3 is pure sans — it's a Summary-style card, no quoted voice.
7. **Attribution rows on cards 2 and 3 only.** Tiny glyph + name + dot + timestamp. Card 1 has none — it's reasoning *about* the AI's move, not a signed artifact.
8. **No metric chips, no statistics.** Earlier draft had "3–4× better engagement" inside card 1. Pulled — clinical/marketing tone clashes with the chat's warmth.
9. **No icons inside cards.** Only attribution glyphs.
10. **Marcus continuity.** Same persona named elsewhere on the page (hero chat). One member, deeper view. Swap everywhere or not at all.

## Card visual system

Reusable shell: `FloatingCard`. Background `#FCFBFA`, hairline border `border-ink/[0.06]`, very soft long shadow (`0 22px 48px -14px rgba(15,20,25,0.18)`), `rounded-2xl`, `p-5`.

Typography ladder: hero serif `text-[20–22px] leading-snug text-ink` · label sans `text-[12.5–13px] font-semibold text-ink` · body sans `text-[12.5px] leading-relaxed text-ink-soft` · attribution `text-[11px] text-ink-muted`.

Glyph stand-ins (swap when real assets land): `ChronilogixGlyph` (14×14 rounded brand-600 square with a tiny white bar — stand-in for the logo mark), `MarcusGlyph` (16×16 rounded-full neutral fill with "M" initial — stand-in for member avatar).

## Mobile

`SceneThreeCards` is `hidden lg:block`. On `< 1024px`: words and phone still animate, chat still reveals turn-by-turn (uses the same `chatProgress`), but **no reasoning cards**. The composition doesn't physically fit; forcing it crowds the chat. If a future pass wants a mobile version: probably one card that swaps content at scroll thresholds, or stack-and-reveal *below* the phone after the chat fully renders.

## Brand / copy rules relevant here (from CLAUDE.md)

- **Chronilogix is always the subject.** Never "Rooney AI" or "the AI" in customer-facing copy. Card 3's attribution reads "Chronilogix" for this reason.
- **No anonymous quotes.** Card 2 is attributed to Marcus; card 1's quote is implicitly Chronilogix.
- **Dr. Resnicow is not named in scene 3.** He appears elsewhere on the page; here the *method* speaks for itself.
- **No dollar amounts, no SOC 2 / GDPR claims, no Aetna / partner logos** in this scene — those live in their dedicated sections.

## Known issues / gotchas

- **Preview-tool screenshots were flaky during development** — the Next.js dev server kept auto-scrolling the page to ~scrollY 8750 between scroll-set and screenshot calls. Verification was done via DOM-state inspection. Real-browser scroll is reliable.
- **Phone width is `clamp(260px, 26vw, 360px)`.** At very wide viewports (>1600px) the phone caps at 360px but cards keep scaling with `vw`. May want a max-width on cards too if it ever feels imbalanced.
- **Reduced motion:** scroll handler sets `progress = 1` immediately when `prefers-reduced-motion: reduce`. Lands user at scene-3 final state with no animation. Confirm before any next round.
- **`HeroPhoneMockup` is misleadingly named** — only Statement uses it now. Worth renaming in a cleanup pass.
- **`SCENE3_START = 0.55` is tightly coupled to scene 1's `REVEAL_END = 0.45`.** Slowing scene 1 (raising `REVEAL_END`) compresses scene 3 unless `SCENE3_START` moves too.

## If you're picking this up

Read in this order: (1) the chat copy above, (2) the three cards, (3) the timing map, (4) the creative-direction rules — several common "improvements" have already been tried and rejected. Drive the section in a real browser; the cadence only reads with smooth scroll.
