# CD Sign-off — Wave 1

**Verdict:** APPROVED-WITH-FIXES (locked decisions to designer open questions below).

The three specs land cleanly. One new motion token approved. Designer open questions resolved below; implementation follows these answers literally.

---

## New motion token — approved

`--dur-settle: 1200ms` — end-of-scene hold band (used in M1.1 Scene 3 hold and M1.4 ROI band). Add to `app/globals.css` alongside the other duration tokens.

---

## Locked answers to designer open questions

### Web W1.1 — Statement Scene 3

| # | Question | Answer |
|---|---|---|
| 1 | Phone horizontal shift mechanism | Use existing `shiftXPercent` prop on `HeroPhoneMockup` during Scene 3. Lower risk, no markup restructure. At desktop, shift to `+22%` (phone sits right-of-center). On tablet/mobile, `0%`. |
| 2 | Caption anchor target | Caption is **static text**, no anchor. Scene 3 IS §04 in the rewrite, so there is nowhere to link to. |
| 3 | Conversation script swap | **Yes, part of this wave.** Update `CONVERSATION` array in `HeroPhoneMockup.tsx` to the §04 canonical three-turn exchange. Illustration owns the visual treatment of the bubbles; Web owns the data substitution. |

### Web W1.2 — How it works

| # | Question | Answer |
|---|---|---|
| 1 | Illustration well aspect | `aspect-[4/3]` landscape, locked. Quieter than AgentStrips above. |
| 2 | Beat format | Plain `–` dash list. Icon-per-step pattern is killed with the old `WaveIcon/ChatIcon/ClockIcon` family. |
| 3 | Tablet layout | Single column up through desktop. `lg:grid-cols-3` at ≥1024px, stacked below. Tablet 2+1 split is unnecessary complexity. |

### Web W1.3 — Use cases

| # | Question | Answer |
|---|---|---|
| 1 | Universities removal | Confirmed, definitively out. Not deprioritized — removed. |
| 2 | Brokers image / `for-universities.png` | **Do not repurpose `for-universities.png` for Brokers** — subject matter is wrong. Set Brokers image to `null` and use the new `BrokersPattern` from Illustration's I1.3 spec. Same for Health Plans, Wellness, Governments. |
| 3 | Mobile overflow | Accept CSS `-webkit-line-clamp: 3` on the description only (never on the headline). Add a `clamp` to body on mobile so a long persona description doesn't push the CTA off-screen. |
| 4 | Chip copy | Approved. Use the chip strings from W1.3 §4 hierarchy table verbatim. |

### Web W1.4 — Proof in numbers

| # | Question | Answer |
|---|---|---|
| 1 | Stat 3 (`0.3%–0.9%`) | Keep as authored. Two-ticker range per Motion spec. Display reads as a precision range, not a single number — that's the right tone for an A1c claim. |
| 2 | Stat 7 (`≈ 1/20th`) | Keep as authored. It's distinctive and correctly colloquial. Glyph-fade reveal per Motion (no tick). |
| 3 | Stat 8 (Dartmouth) | Big-display reads `On par` (sans, smaller than the numeric stats — `text-[2rem]`). Label reads `AI coaching rated with human therapists`. Disclaimer strip says exactly `"Category validation; not Chronilogix's own result."` Glyph-fade reveal, no tick. |
| 4 | ROI band sourcing | Add an `Illustrative — based on program benchmarks` footnote below the band, right-aligned, `text-ink-subtle text-[11px]`. |
| 5 | Section background | `bg-paper-warm` confirmed. |

---

## Implementation contract

The specs and these answers together are the implementation contract. Engineering implements the union of:

1. `notes/agents/web/wave1-spec.md`
2. `notes/agents/illustration/wave1-spec.md`
3. `notes/agents/motion/wave1-spec.md`
4. This sign-off's locked answers

Where the specs conflict, this sign-off wins. Where this sign-off is silent, the specs win.

---

## Watch-in-build (things I want to see verified during implementation)

- Scene 3 left-column copy must not start its reveal until the Scene-1 sentence words are fully faded out — the existing `wordsFade` band (`(sceneThreeRaw - 0.05) / 0.28`) finishes around `sceneThreeRaw ≈ 0.33`. The new left-column reveal starts at progress `0.55` which maps to `sceneThreeRaw ≈ 0.0` (Scene 3 hasn't started yet) — confirm the timing math: Scene 1 sentences should be invisible by the time the left-column eyebrow begins.
- The 5-persona `WhoWeServe` accordion must not let the active persona's expanded panel push the CTA off the visible viewport on a 667px-tall phone. If it does, the description gets a `line-clamp-3` mobile-only.
- The ROI band on mobile must stack to a single column with `↓` connectors, not horizontally clipped or scrolled.
- New chat conversation in `HeroPhoneMockup.tsx` is chronic-care/diabetes (medication adherence) only. No mental-health language.
