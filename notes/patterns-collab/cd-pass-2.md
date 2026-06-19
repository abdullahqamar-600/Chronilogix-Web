# cd-pass-2.md — Creative Director second pass on plan-v2

## 1. Adoption check

The planner absorbed pass-1 cleanly on the structural calls. Specifically: "absorption" as the metaphor name lands (label "Listening" is dead); Card 1's five facet labels, dashed perimeter, and breathing pulse are all cut and the card resolves to stillness; Card 2 is finite (two cycles, hard stop) with margin-note typography moved beside the bloom — the right escape from italic-on-orange-wash; Card 3's horizontal-ticks-on-a-line is replaced with an off-axis arc, the saturation pulse is dead, and the "today" line is rewritten in patient voice; per-card observers replace the section-wide trigger; `bg-white` is gone in favor of cream-on-cream plates; the section-top breathing room is acknowledged; the `<Thread>` is correctly demoted to a quiet hairline divider.

Where they softened or worked around me:
- **The arc moved into Card 3's canvas, not across the three cards.** I asked for "stack the three blooms vertically off-center, or a slight downward arc." The planner correctly read that as a Card-3-internal composition (the three-card grid is a layout fact, not creative real estate). Accepted.
- **Card 2's "20s idle auto-replay" is a soft hedge against my "resolves; doesn't run forever."** Flagged below — I'll rule on it.
- **The overlap-outline trace on Card 3 was kept, with the pulse cut.** That was my intent. Acknowledged.
- **The Card 1 outline path is "pre-baked" rather than derived from the displaced edge.** Sensible engineering call; I'd have made the same one. No taste objection.

Misses (small): the planner didn't promote any of the four "patient phrase" candidates to canon — they're still placeholders. That's my job and I do it in §4. Also: no explicit call on whether the section's surrounding vertical rhythm changes the wrapping `mt-24 md:mt-32 lg:mt-36` value the planner inherited. I address that in §5.

## 2. Rulings on the planner's pushback

1. **Card 1 phrases — 2 always, never 3.** Planner is right. Lock at two. Three crowds the bloom and re-introduces the tag-cloud failure mode.
2. **Card 3 overlap hairline trace — keep.** Planner is right and read me correctly: pulse out, trace stays. The trace is the "absorbed/permanent" beat that mirrors Card 1's settling outline. It's what makes the card *resolve* rather than just stop.
3. **Card 2 "20s idle auto-replay" — kill it.** Cut. "Card resolves; doesn't run forever" is exactly what it says. One re-breath per 20s is a metronome with a longer interval — same animal. Replay on hover only. If the CHRO wants to feel the rhythm again, they hover. If they don't, the page is quiet.

## 3. Per-card second pass

### Card 1 — Intake

- **Too restrained now:** Nothing material. The card was overbuilt in v1; v2 sits at the right weight. If anything, the `01` serif label top-left can come down 1px or drop to `text-ink-muted/70` — at the current spec it's the brightest non-bloom element on the plate, which is wrong.
- **Still doing work it shouldn't:** The "compress-on-impact" on the falling drop (`scale 1 → 0.85`) is borderline cartoon physics. Ink doesn't squash on a flat surface — it scatters. Recommend the drop fades through opacity into the impact moment rather than visibly squashing. Same `inkDropFall` keyframe, but `scale 1 → 1` and let the ripple + bloom sell the impact. Keep the translateY.
- **The single beat to nail:** The handoff from `bloom expansion finishing` (t≈1900) to `phrase 1 attaching` (t=2000) to `outline traces` (t=3000). This is where the card earns its meaning — the bloom is no longer a generic stain, it has become *this person*. The phrases must arrive *into the still-soft bloom*, not after it has hardened. Specifically: the `feDisplacementMap scale 14→6` (edge sharpening) must NOT have completed when phrase 1 attaches. The edge is still settling when the first phrase lands; the outline trace catches up last. If the engineer accidentally re-orders this so the outline traces *before* the phrases attach, the card reads "we drew a shape, then labeled it" — diagram logic, not absorption logic. Order is sacred: bloom soft → phrases land in soft bloom → outline traces over the now-attached phrases. Easing on the outline trace stays `ease-out-expo` at 800ms; this is the slowest beat on the card, and that's correct — it's the longest in real life, too.

### Card 2 — Reflection

- **Too restrained now:** The "no pre-existing ghost at rest" rule is correct but it means the card looks empty for a beat longer than it should before Cycle 1 fires. Add a single intent signal at rest: a 1px hairline arc, ~30% chord, sitting where the surface line meets the canvas left margin, at ink/08. Not the surface line itself — a small mark of "this page has been touched once before." Less than a tell, more than nothing.
- **Still doing work it shouldn't:** The bloom-1 ghost at 1% ink hairline silhouette risks becoming invisible at 1%. At 1% on cream we're below most display gamuts' rendering threshold; on a cheap conference-room projector it disappears entirely. Bump to **4–6% ink filled silhouette, no outline.** The CD pass-1 word was "ghost," not "trace." A ghost has body.
- **The single beat to nail:** **The 1.6s hold and the 800ms gap between cycles.** This is THE beat of the entire section. If the engineer trims either out of nervousness, the metaphor collapses into "two animations in a row." Specifically: the 1.6s hold begins the moment the bloom finishes expanding (not when it starts) and the question text has finished fading in. Both elements still — no breathing, no pulse, no shimmer. The Q text holds at full opacity, the bloom holds at full saturation. Then the 900ms absorb begins. Then 800ms of literal nothing on the canvas. The gap is not a transition — it is a silence. Frame-by-frame in dev tools, the gap should be visually indistinguishable from a paused tab. If a designer or PM later asks for "a little something in the gap," the answer is no. Comment in source: `// Silence is content. Do not shorten. Do not fill.`

### Card 3 — Continuity

- **Too restrained now:** Dropping the surface line entirely may have over-cut. Card 1 and Card 2 share that hairline at the lower third; Card 3 having no surface line is a register break in a section that is trying very hard to read as a triptych. **Restore the hairline surface line in Card 3 at the same y-position as Cards 1 and 2, at the same ink/12.** The blooms can still trace their off-axis arc above/around it; in fact, having Bloom 3 cross the surface line — landing partly below it — sells "this one is more recent and goes deeper" without any extra gesture.
- **Still doing work it shouldn't:** Three explicit timestamps (*six weeks ago / last week / today*) plus three phrases plus the overlap trace plus three blooms is starting to crowd a 200×240 viewBox. Drop the timestamp labels on Bloom 1 and Bloom 2; keep only *today* on Bloom 3 (`text-brand-700`). The viewer infers the chronology from bloom size and saturation (which v2 already specifies: 55% → 80% → 100%); the explicit time labels are belt-and-suspenders. Phrases stay on all three.
- **The single beat to nail:** **The late arrival of drop 3 at t=2100 (1200ms gap, not 900).** This is the rhythmic move that makes Card 3 not a metronome. If the engineer "tidies" this to even spacing during refinement — and they will be tempted, because uneven timing looks like a bug in code review — the card is dead. The 300ms delay is the difference between "three drops fell" and "the third one came back later." Source comment: `// Drop 3 arrives late. The 300ms gap is the rhythm of returning. Do not normalize.` Easing on all three drops stays identical (`ease-out-expo`, 900ms duration) — only the *start time* of drop 3 is delayed. Identical easing is what keeps the three drops reading as the same gesture happening three times; the spacing is what tells the story.

## 4. Patient-voice phrases — approved lines

Rules I'm setting and then following:
- First person, present-or-recent-past tense. No clinical register. No diagnosis words. Specific noun > abstract noun. ≤6 words. Sayable in a clinic waiting room without lowering your voice. Must work whether the reader is thinking about a chronic-care member (Roni's audience) or a mental-health member (Millie's audience).

### Card 1 — Intake (ship these two; third is held in reserve in the constant for copy to swap)

- *"I cook for my mother."*
- *"Mornings are the good hours."*
- (reserve) *"My dad had the same thing."*

Rationale: the v2 placeholders (*"raised three kids," "swims at six," "father's diabetes"*) were directionally right but two of three skewed mental — "swims at six" is a wellness-app caption and "father's diabetes" names a condition (it doesn't name the *patient's* condition, but it's still a disease word in a section that should be condition-agnostic). The approved lines are role, rhythm, and (in reserve) inheritance — all without naming a condition or sounding curated.

### Card 2 — Reflection (the two questions Chronilogix asks, not the patient's words)

These are the coach's open questions, per the brief. The v2 picks are correct as-is:
- Q1: *"What made that possible?"*
- Q2: *"What does that say about you?"*

Lock these. They are pure MI register, condition-agnostic, and they ladder: Q1 looks back at a moment; Q2 generalizes from it. Do NOT add an exclamation, a softener ("Hm,"), or a name tag. The questions stand alone.

### Card 3 — Continuity (three patient-voice margin notes, in order)

- Six weeks ago: *"Sundays are the hardest."*
- Last week: *"Cooking grounds me."*
- Today: *"I cooked on Sunday."*

This is the v2 set with one trim: "*This week* I cooked on Sunday" → "*I cooked on Sunday*." The "this week" is the kind of word a writer adds and a person doesn't say. The line is stronger without it, and it deliberately closes the loop with "Sundays" from six weeks ago — same noun, transformed meaning. That's the entire card in five words.

If copy ever wants to swap Card 3 for a Millie-flavored read, the approved alternate set is:
- *"Evenings drag."* / *"Walks help."* / *"I walked on Wednesday."*

Do not mix the two sets — pick one per build.

## 5. Continuity and rhythm with the rest of the page

Sitting under Roni (warm orange gradient, saturated blob, halo) and Millie (rose/plum, same), this section reads correctly as a register shift — loud chord, then considered phrase. That's the right move and v2's cream-on-cream cards plus quiet ink make it.

Two adjustments to land it:

1. **The vertical gap above the `h3` is currently `mt-24 md:mt-32 lg:mt-36`.** Plan-v2 says "wider top gap" but doesn't specify. Lock at **`mt-32 md:mt-40 lg:mt-48`**. The shift from saturated agent strip to clinical plate needs a beat of paper before the eye lands on type. Anything tighter and the section reads as a continuation of Millie's plum block, not as its own register.

2. **The closing line `"This is what makes it coaching, not chat."` needs a similar beat below the grid before the next section starts.** Whatever comes after this in the page (currently nothing in scope, but the page will keep going), the closing line should sit with at least `mt-16 md:mt-20` of breathing above it, and the section's bottom padding should match the top gap I just specified. Symmetric silence around the section is what gives the cards space to be quiet.

The register is right, not too quiet. The risk in the other direction — too contrasty — is real and is what the planner correctly headed off by killing `bg-white` and switching to cream-on-cream plates. White cards under a plum strip would have looked like a different website. Don't reintroduce them.

One thing to watch in build: the brand-orange ink on cream, surrounded by a plum strip above, will pull color from Roni more than from Millie — the warm-orange echo. That is correct: this section is *both* agents' method, and the warm orange is Chronilogix's primary brand, not Roni's exclusive. If anyone in review says "the ink looks like Roni," the answer is yes, because Chronilogix is warm orange, and Roni and this section are both expressions of the same brand. Do not introduce plum into the ink.

## 6. Sign-off conditions

Plan-v2 is close. Required changes before plan-final:

- [ ] **Cut Card 2's "20s idle auto-replay."** Hover-replay only. Update §2-Card-2 Loop and §3.4.
- [ ] **Card 1 drop: remove the `scale 1→0.85` compress-on-impact.** Translate-only fall. Update the `inkDropFall` keyframe in §5.4.
- [ ] **Card 2 ghost density: 4–6% filled ink silhouette, not 1% hairline.** Update §2-Card-2 the "ghost set" beat and the absorb keyframe target.
- [ ] **Card 3: restore the hairline surface line at the same y-position as Cards 1 and 2.** Update the "Canvas at rest" line.
- [ ] **Card 3: drop the timestamps on Bloom 1 and Bloom 2; keep only *today* on Bloom 3.** Update the Timestamps spec.
- [ ] **Card 3: rewrite "This week I cooked on Sunday." → "I cooked on Sunday."** Update the margin-note phrases.
- [ ] **Card 1: lock the two phrases as *"I cook for my mother."* and *"Mornings are the good hours."*** with *"My dad had the same thing."* held in the constant as a third option for copy to swap. Replace v2's three placeholder strings.
- [ ] **Section top gap: lock at `mt-32 md:mt-40 lg:mt-48`.** Update §3 (or wherever section spacing lives).
- [ ] **Add the load-bearing source comments**: `// Silence is content. Do not shorten. Do not fill.` on Card 2's hold/gap. `// Drop 3 arrives late. The 300ms gap is the rhythm of returning. Do not normalize.` on Card 3's drop 3. Spec these explicitly so they aren't lost in implementation.
- [ ] **Order-of-beats rule on Card 1**: phrases must attach to the still-soft bloom (before `feDisplacementMap scale` has finished interpolating to 6). Outline traces last. Document the dependency explicitly.

If those land, signed off.

## 7. To watch in Phase 3 (refinement in browser)

- The `1.6s hold + 800ms gap` on Card 2 in actual perceived time, on a real-world scroll — this can feel correct in isolation and too long when the eye is also tracking Cards 1 and 3 nearby.
- `feTurbulence` rendering parity across Safari/Chrome/Firefox at the actual card size — the bloom edge should read as *organic* in all three; if any browser flattens it to "circle with fuzzy edge," the seed or `baseFrequency` needs a per-card tweak.
- The cream-on-cream plate edge — on low-end LCDs it may genuinely vanish; verify on a real conference-room TV before declaring it intentional.
- Multiply blend on Card 3 on iOS Safari with the cream paper grain layered above the SVG — the overlap region must visibly deepen but not crush to brown. Sample in Safari iOS first, not last.
- Phrase typography at responsive breakpoints — Newsreader italic 12–13px on Card 3 may need a one-step bump on `lg` viewports where the canvas is largest; check that the phrase doesn't float off the bloom.
- The `01 / 02 / 03` serif labels' weight against the eyebrow text below the card — they should read as quieter than the eyebrow, not louder. Verify in browser; the spec is silent on their final color but `ink-muted/70` is where I'd land.
