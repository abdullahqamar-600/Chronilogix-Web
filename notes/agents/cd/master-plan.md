# Creative Director — Master Plan v1

## TL;DR

The current homepage tells about a third of the story it needs to tell, in
the wrong order, with two sections that are duplicative and one that has the
wrong personas. We're going to:

1. **Keep the working spine** — Hero, Statement Scene 1, Problem, Two Coaches.
2. **Rebuild Statement Scenes 2 + 3 around the demo.** The phone rising is
   the right gesture but the orbiting "validated AI / decades of science"
   cards are duplicative with what comes below. Replace those cards with
   the **real product conversation** so Scene 3 *becomes* §04 "See it work".
3. **Replace "Three patterns. Every session." with the actual `How it works`
   beat (§07).** "Three patterns" reads generic; "Connect → Configure →
   Deploy" is the platform's real onboarding spine.
4. **Rebuild "Who we serve" as the §08 Use-cases tabs** with the correct
   five audiences and the real benefit framing per audience.
5. **Collapse "A proven method · Validated AI · Decades of science" into
   the new §10 Proof in numbers.** Move it lower in the page, expand the
   stat set, attribute every claim, and lose the duplicative card trio.
6. **Add the missing sections** in priority order:
   - §06 Core Capabilities — the four blocks that explain *what the platform
     actually does well*.
   - §12 Trust & Security — the make-or-break for enterprise procurement.
   - §05 "Care is episodic. Life isn't." resolution paragraph attached
     to the existing Problem section (light add).
7. **Push agent visual depth from 60% → 100%.** Roni and Millie's strips are
   beautiful but visually shallow. Add a second tier of presence.
8. **Punt** §09 Integrations, §11 Customer Stories, §13 Pricing, §14 Final
   CTA, and Nav refactor to a follow-up pass. They're not the blockers; the
   blockers are the in-page beats that read weak or generic today.

---

## The new section map

| New § | Title | Current state | Action |
|---|---|---|---|
| Nav | Logo + Product / Solutions / Research / Pricing + Sign in + Book a demo | Existing Nav.tsx | Light edit (defer dropdown to next pass). Keep current nav skin. |
| 02 Hero | "Care that's there at 2 AM, not just 2 PM." | Hero.tsx — working | **Update copy** to new headline/subhead. Add secondary "See it work" CTA. Keep video, blur reveal, layout. |
| 03 Two coaches | "Inside Chronilogix · Two coaches. One way of listening." | Solution.tsx top — working | **Add eyebrow + connective sub-line.** Push agent visual depth (illustration brief). Keep AgentStrip layout. |
| 02b Statement | "Chronilogix is the AI-native…" three-sentence reveal + phone rise | Statement.tsx Scene 1 + 2 — working | **Keep Scene 1 + Scene 2 phone rise.** Replace Scene 3 (orbit cards) with the real conversation demo. The phone *becomes* the §04 "See it work" beat. |
| 04 See it work | "A real conversation, not a chatbot script" | Lives inside Statement Scene 3 (above) | Resolved by the Statement Scene 3 rewrite. |
| 05 Problem | "Care is episodic. Life isn't." + after-state | Problem.tsx — working for the stats | **Add the resolution paragraph** ("Chronilogix is there in that moment…") + the optional 58% DPP pull-stat band as the section's closing beat. Keep the 38.4M / 2–6 wks / 64% panels as-is. |
| 06 Core capabilities | 4 alternating blocks | **Does not exist** | **New section** — 4 blocks (MI digitized · Always on · Culturally intelligent · Hybrid model). |
| 03b Two coaches v2 | (handled in §03 above) | | |
| 07 How it works | "Live in three steps. Connect · Configure · Deploy." | Solution.tsx "Three patterns. Every session." — **wrong story** | **Replace** "Three patterns" block with the Connect/Configure/Deploy rail. Keep the three-card structure visually; new content + new illustrations. |
| 08 Use cases | Tabbed: Employers · Brokers · Health Plans/ACOs · Wellness · Gov | WhoWeServe.tsx — wrong personas, generic copy | **Replace personas** with the canonical five. Rewrite copy to the canonical lines. Keep the scroll-driven sticky-panel mechanic; tighten the visual presentation per persona. |
| 10 Proof in numbers | Stat cards + ROI band | ProofPoints.tsx — duplicates Scene 3 + thin attributions | **Replace** ProofPoints with the canonical eight stat cards, each with one-line attribution. Add ROI band as a closing strip. |
| 12 Trust & security | 5 pillars + a HIPAA / SOC-2-in-progress framing | **Does not exist** | **New section** — five-pillar grid, clinical-credible register, no overclaim. |

What we are **not** doing this pass:
- Section 09 Integrations (no real partners to show; would be a roadmap
  list, which weakens credibility).
- Section 11 Customer stories (we have one real customer line — Aetna — and
  it already shows up in §10).
- Section 13 Pricing (PEPM numbers need Steven's sign-off; we'd be guessing).
- Section 14 Final CTA + Footer refactor (existing Footer is acceptable).
- Nav refactor (cosmetic — defer).

---

## Section-by-section execution order

The order below is the order we ship in. Each step is gated on the previous
sign-off so we don't paint ourselves into a layout corner.

### Wave 1 — fix the broken beats

1. **§02b Statement Scene 2 + 3 rebuild.** The orbit cards die; the phone
   becomes the real demo. Big motion + illustration + web change.
2. **§07 How it works (replaces "Three patterns").** New copy, new
   illustrations, new motion vocabulary on the rail.
3. **§08 Use cases (replaces WhoWeServe personas).** Tab structure stays;
   personas + copy + per-persona illustration changes.
4. **§10 Proof in numbers (replaces ProofPoints).** New copy, new card
   pattern, ROI band, attributions visible.

### Wave 2 — add what's missing

5. **§06 Core capabilities** — four-block alternating section, slots
   between Problem and Two-coaches.
6. **§12 Trust & security** — five-pillar grid, slots between Proof in
   numbers and Footer.

### Wave 3 — depth and polish

7. **§03 Two coaches** — push the Roni / Millie visual treatment past 60%.
   Add agent-presence layer (illustration brief).
8. **§02 Hero** — copy update only (no layout change).
9. **§05 Problem** — add the resolution paragraph + optional 58% band.

---

## Final section order after Wave 1 + 2 + 3

```
Nav
01 Hero                              (refined copy)
02 Statement                         (Scene 1 + new Scene 2/3 = demo)
03 Two coaches                       (deeper agent visuals + connective line)
04 Problem                           (resolution + 58% band)
05 Core capabilities                 (new)
06 How it works                      (replaces "Three patterns")
07 Use cases                         (replaces WhoWeServe)
08 Proof in numbers                  (replaces ProofPoints)
09 Trust & security                  (new)
Footer
```

The eye, scrolling: **hook → premise → personality → pain → capability →
mechanism → fit → evidence → trust → out.** That is a complete enterprise
B2B page in nine beats.

---

## Cross-cutting decisions (locked unless reopened explicitly)

- **Section spacing** stays at the current `py-24 md:py-32 lg:py-40` for
  flow sections and `rounded-[28px]` for card-shell sections.
- **Eyebrows** are kept tight and consistent: `11px / uppercase /
  tracking-[0.22em] / text-ink-muted`. No exceptions.
- **Headlines** stay serif Newsreader; if a section needs to feel
  "platform / mechanical / proof", we may use sans medium at the section
  headline (matches the current ProofPoints treatment). Mechanical sans is
  reserved for §07, §10, §12. Everywhere else stays serif.
- **Stats** never appear without a visible attribution line. Single-line
  source (`— Aetna's MI program`, `— NEJM AI, 2025`) is required.
- **Aetna** appears once in §10 as the lead stat. We are not adding a
  second Aetna pull-quote on first pass; the deck can do that later.
- **Dr. Resnicow** appears: hero subhead → §03 connective → §05 Core
  capabilities Block 1 → §08 Proof in numbers. Four placements, all
  earned, all platform-anchored.
- **The agent strips' visual depth** gets a single deeper layer — not a
  rebuild — added in Wave 3. We're protecting the working "Two coaches"
  beat, not redesigning it.

---

## The four briefs

Briefs handed to designers live next to this file:

- `cd/brief-web.md` — section structure, hierarchy, layout per section.
- `cd/brief-illustration.md` — agent depth, product chat surfaces, in-section
  illustrations.
- `cd/brief-motion.md` — Statement Scene 3 demo, How-it-works rail motion,
  Use-cases scroll behavior, Proof-in-numbers stat reveal, agent presence
  loop, Trust pillars.

Each designer reads their brief, returns a `*-spec.md` per item, and I sign
off in `cd/signoff-1.md` before implementation begins on that item.

---

## What I'm explicitly accepting in this pass

- The page will not have integrations, customer stories, pricing, or a
  final CTA. We sell the platform on credibility, capability, fit, and
  trust — and route everything to "Book a demo" via the existing Hero CTA.
  This is acceptable for the June 2026 conference launch only because
  Steven is the live closer. If a self-service motion emerges, those
  sections jump back to Wave 1.
- The Nav stays at four links. Real solutions dropdown is a follow-up.
- The "Questions?" widget remains in `components/widget/` as is. The
  Illustration Designer may *propose* a treatment refinement in their
  brief response, but it ships only if it's a clear, low-risk improvement.

---

## Definition of "done" for this iteration

- Wave 1 + Wave 2 sections shipped to `main`, browser-verified, on a real
  device.
- Wave 3 either shipped or itemized as a punch list with screenshots.
- The page tells the complete story in the new order, with no duplicative
  beats, no generic AI copy, no broken or generic personas, no missing
  proof attributions.
