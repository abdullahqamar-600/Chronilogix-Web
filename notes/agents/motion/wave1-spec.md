# Motion Spec — Wave 1
**Author:** Motion Designer
**CD brief source:** `notes/agents/cd/brief-motion.md` (Wave 1 only)
**Date:** 2026-06-05

New token proposed in this document:
- `--dur-settle: 1200ms` — end-of-scene hold before section exits. Used in M1.1 and M1.4. Name chosen because it encodes a deliberate pause after resolution, not a reveal or a state change.

---

## M1.1 — Statement Scene 3: demo conversation

**Scene ID + section file:** `components/sections/Statement.tsx` + `components/HeroPhoneMockup.tsx`
Lines affected: Statement.tsx `SCENE3_START` constant, `SceneThreeCards` component (replaced), `ChatScreen` + turn-window constants in HeroPhoneMockup.tsx.

**One-sentence promise:** The phone fills up with a real conversation while the left column names exactly what Chronilogix is, so the viewer reads the story and sees it happen at the same time.

---

### Trigger

Scroll-driven. Section runway is `h-[240vh]`. Progress is `scrolled / (runway - viewportHeight)`. All progress bands below are in normalized `[0, 1]` scroll progress.

```
Scene 1 + 2 (existing, preserve)  0.00 → 0.55
Scene 3 begins                    0.55
Left-column copy reveal           0.55 → 0.62
Conversation plays                0.62 → 0.92
Hold (settle)                     0.92 → 1.00
```

The phone's additional rise continues from the existing `maxRisePercent` formula through Scene 3. No new phone motion is introduced at Scene 3 start — it is already in position by 0.55.

---

### Timeline

#### Left-column copy reveal (progress 0.55 → 0.62)

The copy block is left-aligned on desktop, centered below the phone on mobile. Eyebrow → headline → body → caption each animate as word-by-word blur+opacity reveals identical in vocabulary to Statement Scene 1 (blur 3.5px → 0, opacity 0.12 → 1, `wordReveal` keyframe, `--ease-out-expo`).

Total words to reveal: approximately 38 words across the four copy elements.

Per-word stride: 88ms (midpoint of brief's 80–95ms range). Window ratio: 4 words in parallel (matches existing Scene 1 pattern).

```
Progress band   Element              From → To
0.550           eyebrow word 0       blur(3.5px) op(0.12) → blur(0) op(1)
0.553           eyebrow word 1       same
...stride 88ms per word in progress units...
0.572 approx    headline word 0      blur(3.5px) op(0.12) → blur(0) op(1)
...
0.590 approx    body word 0          blur(3.5px) op(0.12) → blur(0) op(1)
...
0.612 approx    caption word 0       blur(3.5px) op(0.12) → blur(0) op(1)
0.620           all copy settled
```

Progress-unit stride calculation: `(0.62 - 0.55) / (38 - 1 + 4) ≈ 0.00171` per word. Easing applied to `clamp01((progress - start) / wordWindow)` as in the existing implementation — no code-level change to the reveal engine.

Duration token: `--dur-reveal 700ms` per word (existing `wordReveal` keyframe duration).

#### Scene-1 sentence fade-out (existing, confirm band)

Words fade from opacity 1 → 0 over progress 0.55 → 0.63 via `wordsFade = 1 - clamp01((sceneThreeRaw - 0.05) / 0.28)`. This is already coded. No change.

#### In-phone conversation (progress 0.62 → 0.92)

The conversation window is `sceneThreeRaw` mapped to `[0.62, 0.92]` in section progress. Inside HeroPhoneMockup, `chatProgress` runs 0 → 1 across this band.

Three messages + one typing indicator triad. `TURN_WINDOWS` (currently `[0.06, 0.22]`, `[0.32, 0.48]`, `[0.58, 0.74]`) must be replaced with the bands below.

```
chatProgress    Element                 From → To                          Duration/Easing
0.00 → 0.14     Coach msg 1             blur(4px) op(0) → blur(0) op(1)   600ms, --ease-out-expo
                "Hi Christopher 👋 Ready for today's check-in?"
                Enter from top: translateY(-8px) → translateY(0)
                (AIBubble enters from above rather than below, to read as "arriving")

0.14 → 0.26     [hold — Coach msg 1 visible, screen quiet]                 —

0.26 → 0.38     Member reply            op(0) → op(1)                      500ms, --ease-out-quart
                "I keep skipping my evening medication."
                Enter from right: translateX(12px) → translateX(0)
                (UserBubble enters from right, existing pattern)

0.38 → 0.46     [hold — Member reply visible, pause ~700ms of scroll time]  —

0.46 → 0.51     Typing indicator enters  op(0) → op(1)                      180ms, --ease-out-soft
                Three cream dots, translateY(4px) → translateY(0)

0.46 → 0.78     Typing indicator LOOPS   scale pulse 1.0 → 1.1 → 1.0       600ms cycle (see loop spec)

0.78 → 0.80     Typing indicator exits   op(1) → op(0)                      180ms, --ease-out-soft

0.78 → 0.92     Coach msg 2 enters       blur(4px) op(0) → blur(0) op(1)   700ms, --ease-out-expo
                "Sounds like evenings get away from you. What's usually going on around that time?"
                Enter from top: translateY(-8px) → translateY(0)

0.92 → 1.00     Hold (--dur-settle band, ~1200ms equivalent scroll time)    all elements static
```

#### Typing indicator triad detail

Three dots in a horizontal row, 6px diameter each, 5px gap, cream fill (`rgba(255,250,235,0.85)`), rendered inside the phone's chat surface as a self-contained component.

```
Dot 0   scale pulse: delay 0ms,   1.0 → 1.1 → 1.0, 600ms --ease-out-soft, infinite
Dot 1   scale pulse: delay 200ms, 1.0 → 1.1 → 1.0, 600ms --ease-out-soft, infinite
Dot 2   scale pulse: delay 400ms, 1.0 → 1.1 → 1.0, 600ms --ease-out-soft, infinite
```

The 600ms cycle puts each dot's peak 200ms apart, creating a rolling wave reading left-to-right. The dots pulse, they do not jump — `scale 1.0 → 1.1` is the full range. No Y translation on the pulse.

The typing indicator as a unit (all three dots + their wrapping bubble) enters and exits with opacity + translateY as specified in the timeline table above.

#### Hold at end of Scene 3

Progress band `0.92 → 1.00`. All elements are in final settled state. No new animation. The viewer can read Coach msg 2 fully. This corresponds to approximately 1200ms of scroll time at typical scroll speed — this is the `--dur-settle` token in scroll-time terms, not wall-clock. It is a runway reservation, not a CSS animation duration.

---

### Easing + duration

| Token | Used for |
|---|---|
| `--ease-out-expo` | Coach msg 1, Coach msg 2, word reveals |
| `--ease-out-quart` | Member reply |
| `--ease-out-soft` | Typing indicator enter/exit, dot pulse |
| `--dur-reveal 700ms` | Per-word reveal, Coach msg 2 |
| `600ms` explicit | Coach msg 1 (brief spec), typing dot cycle |
| `500ms` explicit | Member reply |
| `--dur-quick 180ms` | Typing indicator fade in/out |

No new easing tokens required. `--ease-out-soft` is already defined in `app/globals.css` (used in WhoWeServe active-indicator transitions).

---

### Stagger

Word reveals stagger at 88ms per word (progress-unit stagger ~0.00171). Typing dots stagger at 200ms between each dot.

---

### Reduced-motion fallback

When `prefers-reduced-motion: reduce`:
- `progress` is immediately set to `1` (existing behavior in `Statement.tsx`).
- All three message bubbles are visible at `opacity: 1`, `filter: none`, `transform: none` — no reveal sequence.
- Typing indicator does not render at all (it is only meaningful in the scroll-driven context).
- The left-column copy renders at full opacity on mount.
- The phone is visible at its settled position.
- Implementation: wrap the typing-indicator component in a check against the `reducedMotion` state that already flows from `Statement.tsx`.

---

### Loop / idle behavior

Typing indicator loops while visible (`chatProgress 0.46 → 0.78`). It is driven by CSS `animation: infinite`. The component unmounts (or `display: none`) when `chatProgress < 0.46` or `chatProgress > 0.80`, so the loop does not run outside the visible window.

Coach message 1, member reply, and Coach message 2 do not loop. They are scroll-progress-driven opacity/transform values — they resolve and hold.

---

### Performance budget

All animated properties: `opacity`, `filter: blur()`, `transform: translateY/X`, `transform: scale`. No `height`, `width`, `background`, `box-shadow`, or layout property is animated.

`will-change: opacity, transform` on each bubble element (matches existing AIBubble/UserBubble implementation).
`will-change: transform` on each typing dot.
No `will-change` on the left-column word spans — they are already on the compositor path via `filter` (existing pattern from Hero and Statement Scene 1).

Typing indicator: 3 DOM nodes doing scale pulse. This is the lowest-cost animation on the page.

---

### What this must NOT do

1. **No fade-out of the existing orbit cards.** `SceneThreeCards` is removed from the component tree — it does not fade to black or slide away. Scene 3 starts from the demo conversation, period. The orbit card elements simply do not exist in the new code.
2. **No phone snap or re-position at progress 0.55.** The phone's Y transform is a single continuous expression from Scene 2 through Scene 3. The "Scene 3 start" is a threshold in the copy and conversation reveal logic only.
3. **No typing-indicator bounce.** The dots pulse `scale(1.0) → scale(1.1) → scale(1.0)`. If any implementation introduces a cubic that overshoots 1.1, it is wrong. Use `--ease-out-soft` for the pulse, not `cubic-bezier(0.34, 1.6, 0.64, 1)`.
4. **No competing opacity transitions between the left copy and conversation.** The copy resolves first (`0.55 → 0.62`) and the conversation starts at `0.62`. There is a clean handoff, not an overlap.

**Illustration dependency:** HeroPhoneMockup's ChatScreen background and bubble surface assets. Requires `AIBubble` and `UserBubble` components with the updated conversation strings from `01-copy-v2-canonical.md` §04. The typing indicator triad is a new component: `TypingIndicator` rendered inside `ChatScreen`.

---

---

## M1.2 — How it works rail (Connect / Configure / Deploy)

**Scene ID + section file:** Replaces the "Three patterns. Every session." block inside `components/sections/Solution.tsx` (line 114 onward — the `<div className="mt-20 md:mt-28">` block). New section will be `components/sections/HowItWorks.tsx` per the master plan, or the existing `StepCard` pattern in Solution.tsx can be repurposed for the three new cards.

**One-sentence promise:** Each step card arrives and then its illustration comes alive, so the viewer understands Connect → Configure → Deploy as a sequence with real mechanical weight behind it.

---

### Trigger

IntersectionObserver, threshold 0.25. Each card has its own observer instance. The three cards observe as a group with per-card stagger applied at the JS level (not CSS `animation-delay` alone, so re-key on re-entry works cleanly).

On scroll-out (card leaves viewport below `threshold 0.25`) the illustration resets to its idle state. On re-entry, the card settle + illustration kinetic moment replay once. Cards do not loop — they replay once per viewport entry.

---

### Timeline (per card)

Reference zero `t=0` is the moment the card's IntersectionObserver fires.

```
t (ms)      Element                        From → To                           Token/Easing
0           Number label (01/02/03)        op(0) → op(1)                       180ms --ease-out-quart
0           Hairline rule                  scaleX(0) → scaleX(1), origin left  700ms --ease-out-expo
0           Card container                 op(0), translateY(20px) → op(1), Y(0)  700ms --ease-out-expo
250         [card settled — illustration kinetic moment begins]
250         Illustration kinetic start     (see per-card below)
~1100       [all settled, illustration resolved]
```

Stagger between card 1, card 2, card 3: **90ms**. Card 2 observer fires 90ms after Card 1's, Card 3 fires 180ms after Card 1's. Stagger is implemented by delaying the IntersectionObserver callback response per card index (a `setTimeout(callback, index * 90)` wrapper), not by `animation-delay`, so that re-key on re-entry works identically.

The number label and hairline rule appear at `t=0` — they establish the structure before the card body arrives, matching the existing `StepCard` pattern in Solution.tsx (lines 298–311).

---

### Per-card illustration kinetic moments

The Illustration Designer is responsible for the asset layers. Each illustration must expose the following addressable layers for animation:

**Card 1 — Connect (field-checks)**
The intake form checks completing. 5 items, revealed sequentially.

```
t (ms from kinetic start)   Element         From → To
250                          Check item 0   op(0.45) blur(5px) → op(1) blur(0)   500ms --ease-out-expo
250+140                      Check item 1   same
250+280                      Check item 2   same
250+420                      Check item 3   same
250+560                      Check item 4   same
```

Reuses the `IntakeItem` animation pattern from Solution.tsx (`revealItem` keyframe), stride 140ms.
Total kinetic duration: 250 + 560 + 500 = ~1310ms, but visual resolution reads complete by ~900ms. Card total from observer fire: ~1310ms.

**Card 2 — Configure (tile-lights)**
A grid of configuration tiles lighting up in sequence. Illustration provides the tile layer.

```
t (ms from kinetic start)
250     Tile row 0 lights   op(0) → op(1)   320ms --ease-out-quart
370     Tile row 1 lights   op(0) → op(1)   320ms --ease-out-quart
490     Tile row 2 lights   op(0) → op(1)   320ms --ease-out-quart
```

Each tile in a row staggers at 45ms. Row lighting is a simple opacity transition — no scale, no blur — keeping it mechanical and purposeful.
Total kinetic duration: ~810ms. Card total: ~1060ms.

**Card 3 — Deploy (clock-tick)**
A single clock hand sweeps from 12 o'clock to approximately 4 o'clock (120° arc), symbolizing "24/7 in motion".

```
t (ms from kinetic start)
250     Clock hand    rotate(0deg) → rotate(120deg)   800ms --ease-out-expo
        transform-origin: center
```

The clock face is static (drawn). Only the hand rotates. A single smooth sweep, not a tick animation.
Total kinetic duration: 250 + 800 = 1050ms. Card total: ~1050ms — exactly on the 1100ms target.

---

### Idle behavior after kinetic moment

After the kinetic moment resolves, all three cards are in their settled state. No looping idle. The illustration holds at its resolved position. On scroll-out (threshold drops below 0.25) the card's `inView` state flips to false and the illustration's `active` prop goes false. The next scroll-in replays the full sequence (card enter → kinetic moment).

---

### Easing + duration

| Token | Used for |
|---|---|
| `--ease-out-expo` | Card container enter, hairline rule, intake check items, clock sweep |
| `--ease-out-quart` | Number label, Configure tile rows |
| `--dur-quick 180ms` | Number label |
| `--dur-reveal 700ms` | Card container, hairline rule |
| `500ms` explicit | Connect check items |
| `320ms` explicit | Configure tile rows (--dur-state) |
| `800ms` explicit | Deploy clock hand |

---

### Stagger

90ms between cards (applied at observer-callback level). 140ms between Connect check items. 45ms between tiles within a Configure row. 120ms between Configure rows.

---

### Reduced-motion fallback

When `prefers-reduced-motion: reduce`:
- `inView` flips immediately on observer fire (existing behavior in Solution.tsx `useInView` hook).
- Card enters at `opacity: 1`, `transform: none` — no translate, no blur.
- Hairline rule is `scaleX(1)` on load (no animation).
- Number label is `opacity: 1`.
- Illustration renders in its resolved final state immediately — `active: true` but no CSS animation runs.
- Implementation: each illustration component checks `prefers-reduced-motion` and renders final-state props when true.

---

### Performance budget

Card container: `opacity` + `transform` only. Composite path.
Hairline rule: `transform: scaleX`. Composite path.
Check items: `filter: blur` + `opacity`. Compositor path (filter triggers compositing layer).
Configure tiles: `opacity` only. Composite.
Clock hand: `transform: rotate`. Composite.
No `height`, `top`, `left`, `width`, or `background` properties animated.

`will-change: opacity, transform` on card containers and illustration sub-elements during their active animation window. Clear `will-change` after animation ends (use `animationend` event or set to `auto` in the resolved state).

---

### What this must NOT do

1. **No bounce or overshoot on the clock hand.** Ease-out-expo reaches 120° and stops. Any cubic that overshoots the endpoint is wrong.
2. **No stagger at mobile that pushes the third card off-screen.** The 90ms stagger is imperceptible at the card-level timescale. If the rail stacks vertically on mobile (single column), the stagger remains but each card observes independently — they do not all fire simultaneously because they enter the viewport at different scroll depths.
3. **No blur on the Configure tile rows.** The tiles light up — they do not materialize. Opacity only; no `filter: blur` on the tile transition.
4. **No re-trigger while the card is still animating.** The IntersectionObserver is set to `{ threshold: 0.25 }` and the callback ignores new `isIntersecting: true` events if the card's animation is already running. Implement with a `hasPlayed` flag that resets only on scroll-out.

**Illustration dependency:** M1.2 requires the three step illustrations from the Illustration Designer's brief — Connect intake form, Configure tile grid, Deploy clock face. Each must expose a controlled `active: boolean` prop.

---

---

## M1.3 — Use cases scroll mechanic (WhoWeServe.tsx)

**Scene ID + section file:** `components/sections/WhoWeServe.tsx`
This is a light-touch spec. The sticky-scroll mechanic, the persona crossfade, and the grid-rows height animation are preserved unchanged. Three targeted fixes below.

**One-sentence promise:** The persona reveal breathes at the right pace, the active indicator doesn't jolt, and the CTA pill waits for the headline to own the moment.

---

### Trigger

Same as existing: IntersectionObserver with `rootMargin: "-50% 0px -50% 0px"` drives `active` state (which persona is visible). No change to the observer logic.

The CTA pill uses a one-time IntersectionObserver on the section itself (`threshold: 0.10`) for its fade-up — fires once, never resets.

---

### Fix 1 — Per-word stride length (desktop)

**Current value:** `HEADLINE_STRIDE = 55` (WhoWeServe.tsx line 325)
**New value:** `HEADLINE_STRIDE = 70` — desktop only.

Implementation: read `window.innerWidth` (or use the existing `reducedMotion`-pattern approach with a media-query listener) and apply `HEADLINE_STRIDE = window.innerWidth >= 1024 ? 70 : 55` at the top of `WordReveal`.

The `DESCRIPTION_STRIDE` (currently `18ms`) is not changed. The description follows the headline and its tight pacing is correct — it reads as supporting detail, not competition.

`HEADLINE_BASE_DELAY` (currently `120ms`) is not changed. The description's `DESCRIPTION_GAP` (currently `180ms`) is not changed — the extra 15ms per headline word will naturally push the description start time slightly later, which is correct behavior.

Duration token: `--dur-reveal 700ms` per headline word (existing `wordReveal` animation, unchanged).

---

### Fix 2 — Active persona indicator (the 2px white tick)

**Current implementation:** WhoWeServe.tsx lines 242–249.

```jsx
// current
style={{
  height: isActive ? 28 : 0,
  opacity: isActive ? 1 : 0,
  backgroundColor: "rgba(255,255,255,0.95)",
  transition: "height 600ms var(--ease-out-expo), opacity 500ms var(--ease-out-quart)",
}}
```

The `height` transition on an inline element causes layout recalculation every frame. This is the jolt source — height animating forces the button's text to shift.

**Fix:** Replace with `transform: scaleY` from the bottom. The element keeps its `height: 28px` at all times; the perceived height-grow is simulated via scale from the bottom edge.

```jsx
// new
style={{
  height: 28,           // always 28px — never animates
  opacity: isActive ? 1 : 0,
  transform: isActive ? "scaleY(1)" : "scaleY(0)",
  transformOrigin: "bottom center",
  backgroundColor: "rgba(255,255,255,0.95)",
  transition: `
    transform 600ms var(--ease-out-expo),
    opacity 500ms var(--ease-out-quart)
  `,
  willChange: "transform, opacity",
}}
```

This keeps the transition at 600ms ease-out-expo for the scale and 500ms ease-out-quart for opacity — matching the brief. No change to the `color` transition on the button text label.

The button's `py-4 md:py-5` padding accommodates the indicator at full 28px height without any layout shift, since the element is now always 28px and the visual grow is achieved through scale.

---

### Fix 3 — Book a Demo CTA pill entrance

**Current state:** The CTA pill (WhoWeServe.tsx line 175–183) has no entrance animation — it appears at full opacity on mount.

**New behavior:** Fade-up on first viewport entry, 220ms delay after the IntersectionObserver fires on the section.

```
t=0ms    Section enters viewport (IO fires)
t=220ms  Pill begin: op(0), translateY(8px) → op(1), translateY(0)
t=220ms  Duration: --dur-reveal 700ms, --ease-out-expo
t=920ms  Pill fully visible
```

The 220ms delay lets the headline word-reveal start before the CTA draws attention downward. The CTA enters as a resolution to the headline, not a competing element.

Implementation: add a `ctaVisible` state to `WhoWeServe`, toggled by a one-time IntersectionObserver on `wrapRef` at threshold 0.10. The observer disconnects after first fire. The CTA pill receives `style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'none' : 'translateY(8px)', transition: 'opacity 700ms var(--ease-out-expo) 220ms, transform 700ms var(--ease-out-expo) 220ms' }}`.

---

### No changes

- Per-persona background crossfade: `opacity var(--dur-reveal-long) var(--ease-out-expo)` — no change.
- Grid-rows height animation on the collapsible panel: `700ms var(--ease-out-expo)` — no change.
- Button text color transition: `500ms var(--ease-out-quart)` — no change.
- `PlaceholderBackdrop` for personas without images — no change. Illustration brief handles the pattern alternative.

---

### Timeline (Fix 2 detail)

```
t (ms)    Element             From → To                         Token
0         Tick (scale)        scaleY(0) origin:bottom → scaleY(1)  600ms --ease-out-expo
0         Tick (opacity)      0 → 1                                 500ms --ease-out-quart
0         Label color         white/55 → white/98                   500ms --ease-out-quart (existing)
```

On deactivation, the same transitions run in reverse (to `scaleY(0)`, `op(0)`, `color: white/55`). Duration is symmetrical.

---

### Easing + duration

| Token | Used for |
|---|---|
| `--ease-out-expo` | Tick scaleY, CTA pill, panel grid-rows |
| `--ease-out-quart` | Tick opacity, label color |
| `--dur-reveal 700ms` | CTA pill, headline word-reveal |
| `600ms` explicit | Tick scaleY |
| `500ms` explicit | Tick opacity, label color |
| `220ms` explicit | CTA pill delay (not a duration token — this is a `transition-delay`) |

---

### Stagger

No stagger changes to this section. Word reveal stagger is addressed by the HEADLINE_STRIDE change.

---

### Reduced-motion fallback

When `prefers-reduced-motion: reduce` (existing `reducedMotion` state in component):
- Word reveals: words render at `opacity: 1` when `isActive`, `opacity: 0` when not (existing implementation).
- Tick indicator: `transition: none`. Renders at full opacity/scale instantly on activate. No `transform: scaleY` transition.
- CTA pill: `transition: none`. Pill renders at `opacity: 1` on mount.
- Background crossfade: `transition: none` (existing).

---

### Performance budget

Tick: `transform: scaleY` + `opacity`. Composite.
CTA pill: `opacity` + `transform`. Composite.
Word reveals: `filter: blur` + `opacity`. Compositor path.
No layout-shifting properties.
`will-change` on the tick element and CTA pill (set during active transition, cleared after).

---

### What this must NOT do

1. **No height animation on the active tick.** Height forces layout recalculation. The fix in this spec (scaleY from bottom) eliminates this. If any implementation re-introduces `height` as a CSS transition target, it is incorrect.
2. **No CTA pill visible before the section enters viewport.** The `ctaVisible` flag must start `false` on mount, regardless of scroll position at mount time. If the section is already in view at page load, the delay still applies.

---

---

## M1.4 — Proof in numbers stat reveal (replaces ProofPoints.tsx)

**Scene ID + section file:** Replaces `components/sections/ProofPoints.tsx`. New section file: `components/sections/ProofInNumbers.tsx`.

**One-sentence promise:** The numbers arrive in a wave that reads left-to-right and top-to-bottom, and then each number ticks to its value — so the methodology's receipts feel earned, not listed.

---

### Trigger

IntersectionObserver on the card grid container, threshold 0.20. Fires once. On fire, all 8 cards begin their staggered reveal. No re-key on scroll-out — the numbers have counted up; they stay.

ROI band: separate IntersectionObserver on the band container itself, threshold 0.30. Fires once when the band scrolls into view.

---

### Card grid layout

4 columns × 2 rows on desktop (`lg:grid-cols-4`), 2 columns × 4 rows on tablet, 1 column × 8 rows on mobile. The wave stagger is computed against the `(col, row)` position. Diagonal sweep = stagger by `col + row`, top-left first.

```
Card index and (col, row) at 4-col desktop layout:
Index 0  (0,0)  stagger: 0 × 65ms  =   0ms
Index 1  (1,0)  stagger: 1 × 65ms  =  65ms
Index 2  (2,0)  stagger: 2 × 65ms  = 130ms
Index 3  (3,0)  stagger: 3 × 65ms  = 195ms
Index 4  (0,1)  stagger: 1 × 65ms  =  65ms
Index 5  (1,1)  stagger: 2 × 65ms  = 130ms
Index 6  (2,1)  stagger: 3 × 65ms  = 195ms
Index 7  (3,1)  stagger: 4 × 65ms  = 260ms
```

Diagonal stagger formula: `staggerMs = (col + row) * 65`. This gives the wave from top-left to bottom-right. The maximum stagger is `260ms`. On tablet (2-col) and mobile (1-col), col/row are recalculated accordingly — the stagger formula is the same, just applied to the responsive grid positions.

---

### Timeline per card

Reference zero `t=0` is the IntersectionObserver fire time plus the card's stagger delay.

```
t (ms)      Element               From → To                             Token
0           Card container        op(0), translateY(16px) → op(1), Y(0)  700ms --ease-out-expo
0           Source attribution    op(0) — does not yet appear
450         Big number tick-up begins (see number-type rules below)
450+800     Big number resolved
450+800+180 Source attribution    op(0) → op(1)                           320ms --ease-out-soft
```

Card total from stagger-adjusted t=0 to all elements settled: ~1430ms for the last card (stagger 260ms + 700ms card + 450ms delay + 800ms tick + 180ms + 320ms attribution). The card itself is visually readable by ~700ms. The tick-up is the reward.

---

### Number tick-up rules by stat type

| Stat | Type | Behavior |
|---|---|---|
| `+43%` | Signed integer | Tick 0 → 43, prefix `+` and suffix `%` static throughout. `0 → 43`, 800ms, --ease-out-expo. |
| `−55%` | Signed integer | Tick 0 → 55, prefix `−` and suffix `%` static throughout. `0 → 55`, 800ms, --ease-out-expo. |
| `0.3%–0.9%` | Range (two floats) | Two tickers in parallel: lower `0.0 → 0.3`, upper `0.0 → 0.9`, both 800ms --ease-out-expo. The `%–` separator is static. One decimal place throughout tick. |
| `$300–$700` | Range (two integers) | Two tickers in parallel: `0 → 300`, `0 → 700`, both 800ms --ease-out-expo. `$` prefix static. `–` separator static. |
| `2–3×` | Range (two integers) | Two tickers in parallel: `0 → 2`, `0 → 3`, both 800ms --ease-out-expo. `×` suffix static. |
| `Up to 50%` | Integer | Tick `0 → 50`, 800ms --ease-out-expo. "Up to " prefix and `%` suffix static. |
| `≈ 1/20th` | Glyph (non-numeric) | No tick. The full string `≈ 1/20th` fades in as a single unit: op(0) blur(3px) → op(1) blur(0), 700ms --ease-out-expo, at the same 450ms delay. |
| `AI coaching on par with human therapists` (Dartmouth stat) | Text label (not a number) | Same glyph treatment as `1/20th`: single-unit blur+opacity fade, 700ms, at 450ms delay. |

For ticks: use `Math.round` for integers, one decimal place for floats. The tick function is `easeOutExpo(t) * finalValue` — the same pattern used in the existing `ProvenMethodCard` in Statement.tsx.

---

### Source attribution fade

Each card has a one-line attribution in the same style as `ProofPoints.tsx` (`text-[11px] uppercase tracking-[0.16em] text-ink-muted`). It fades in at `450 + 800 + 180 = 1430ms` after the card's stagger-adjusted t=0. Duration: `--dur-state 320ms`, `--ease-out-soft`. This is a single `opacity: 0 → 1` transition — no blur, no translate.

---

### ROI band

The ROI band is a horizontal chain: `1,000 employees → 250 with chronic conditions → 50% engaged → avg. $500 savings → $62,500/yr`.

Four connectors linking five terminal nodes.

```
ROI band IntersectionObserver fires (threshold 0.30)
t=0        Band container fades in: op(0) → op(1), 300ms, --ease-out-soft
t=0        Node 0 value ("1,000"): tick 0 → 1000, 500ms, --ease-out-expo
t=100      Connector 0 draws: scaleX(0) → scaleX(1), origin left, 225ms, --ease-out-expo
t=325      Node 1 value ("250"): tick 0 → 250, 500ms, --ease-out-expo
t=325      Connector 1 draws: scaleX(0) → scaleX(1), origin left, 225ms, --ease-out-expo
t=550      Node 2 value ("50%"): tick 0 → 50, suffix "%" static, 500ms, --ease-out-expo
t=550      Connector 2 draws: scaleX(0) → scaleX(1), origin left, 225ms, --ease-out-expo
t=775      Node 3 value ("$500"): tick 0 → 500, prefix "$" static, 500ms, --ease-out-expo
t=775      Connector 3 draws: scaleX(0) → scaleX(1), origin left, 225ms, --ease-out-expo
t=1000     Node 4 value ("$62,500"): tick 0 → 62500, prefix "$" static, 500ms, --ease-out-expo
t=1500     [entire ROI band settled]
```

Total ROI band duration: 1500ms. This is within budget.

Each node's tick starts at the same moment as the connector leading into it. The connector and tick run in parallel — the connector draws to reach the node while the node's number counts up. By the time the connector fully draws (225ms), the tick has been running for 225ms of its 500ms duration, so it is approximately halfway through. This creates the read: "the chain arrives → the number finalizes."

Node labels (text below the number: "employees", "with chronic conditions", "engaged", "avg. savings/member/yr", "annual savings") fade in with their node at `opacity: 0 → 1`, 300ms, --ease-out-soft, at the same `t` value as their node's tick start.

The connector's `scaleX-from-left` uses `transform-origin: left center`. The underlying connector track (the faint line showing the full length) is static at full width — only the animated fill draws over it.

---

### Easing + duration

| Token | Used for |
|---|---|
| `--ease-out-expo` | Card enter, number tick-ups, connector draw, ROI node ticks |
| `--ease-out-soft` | Attribution fade, ROI band enter, ROI node labels |
| `--dur-reveal 700ms` | Card container enter, glyph reveals |
| `--dur-state 320ms` | Attribution fade |
| `800ms` explicit | Stat tick-up (grid cards) |
| `500ms` explicit | ROI node tick-up |
| `225ms` explicit | ROI connector draw |
| `450ms` explicit | Tick-up delay after card settle |
| `180ms` explicit | Attribution delay after tick resolves |

---

### Stagger

65ms per diagonal step (col + row). Max stagger: 260ms (last card, desktop 4-col). On single-column mobile, stagger is `row * 65ms` (identical formula with col=0 for all cards).

---

### Reduced-motion fallback

When `prefers-reduced-motion: reduce`:
- Card containers: `opacity: 1`, `transform: none` on mount. No stagger. All 8 cards visible immediately when section scrolls into view.
- Number tick-ups do not run. The final value renders as static text immediately.
- Source attributions are visible at `opacity: 1` on mount.
- ROI band: visible at `opacity: 1` on mount. Connectors render at `scaleX(1)` (full width) immediately. Node values render as static text.
- Implementation: check `prefers-reduced-motion` in the component and render all final states immediately when `inView` becomes true.

---

### Performance budget

Card containers: `opacity` + `transform: translateY`. Composite.
Number tick-ups: React state-driven rAF loop updating text content — no CSS animation. DOM text node updates do not trigger layout if the element has a fixed width (use `min-width` or `tabular-nums` to prevent reflow as digits change width).
Glyph reveals: `opacity` + `filter: blur`. Compositor.
Connector draws: `transform: scaleX`. Composite.
Attribution: `opacity`. Composite.
ROI band container: `opacity`. Composite.

`will-change: opacity, transform` on card containers during entry animation. Remove after entry animation ends.
`tabular-nums` on all tick-up number elements to prevent layout reflow as digits change.

No layout-shifting properties. No `height`, `width`, `margin`, or `padding` animated.

---

### What this must NOT do

1. **No tick-up that overshoots the final value.** The tick function is `easeOutExpo(t) * finalValue`, clamped at finalValue. If any implementation uses an overshoot cubic, the number will briefly show a value higher than the stated stat, which is factually wrong in a healthcare context.
2. **No connector that draws right-to-left or from center.** The chain reads left-to-right because the ROI story is linear: employees → condition prevalence → engagement → savings. `transform-origin: left center` is non-negotiable.
3. **No simultaneous reveal of all 8 cards.** The wave stagger is the whole point of the grid. If stagger is removed (e.g., a single `inView` class on the grid container), the diagonal sweep is lost.
4. **No attribution visible before the tick resolves.** The attribution's `180ms` delay after tick resolution is a deliberate sequencing choice — the number lands first, the source confirms it second. Do not reduce the delay to zero.
