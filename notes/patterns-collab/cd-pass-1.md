# cd-pass-1.md — Creative Director critique of plan-v1

## 1. The concept — verdict

**Accepted, conditionally.** Ink-in-paper is the right metaphor and one of the few defensible ones available here. It earns its place for three reasons the planner should not dilute:

1. **It is a behavioral metaphor, not a data metaphor.** Every other AI shop is showing tokens, graphs, meshes, orbs. Ink absorbing into paper says *something happens between people that takes time*. That is literally what MI is. The metaphor and the product are the same shape.
2. **The physics is the meaning.** Ink doesn't compute, it doesn't predict — it *receives*. Card 2's reflection-as-recurrence (not accumulation) only works because ink has that property. This is the rare metaphor where the constraint is the proof.
3. **It is categorically not SaaS.** This page sits below two loud, saturated AgentStrips. The patterns section needs to read as a clinical plate, a margin in a book, a journal article. Ink delivers that register without us having to manually quiet anything down.

What I'm rejecting inside the concept: the word "Listening" as the framing label. The planner doesn't need to name the concept on-canvas, but if it ever leaks into copy or alt text, kill it. The metaphor is **absorption**, not listening. Listening is what the user does. Absorption is what Chronilogix does with what it hears. That distinction matters for a B2B buyer.

## 2. Per-card critique

### Card 1 — Intake · "The First Drop"

**What's working**
- The single-drop-becomes-a-shape gesture is the strongest beat in the entire plan. Don't change it.
- Naming the bloom *as the silhouette of this specific person* (not a generic blob) — this is the line that makes it not-decorative.
- The hairline outline traced *after* the bloom settles ("absorbed") is genuinely clever. It says: now we know who you are, and it stays.

**What's not working**
- **Five facet labels around the bloom is four too many.** "values · culture · stress · rhythms · goals" is a tag cloud trying to be art. It will read as a radar chart with the chart erased — exactly the spider-chart cliché the plan tells itself it's avoiding. The bloom is already doing the work.
- **The dashed perimeter circle at rest is a tell.** It pre-announces the bloom's final size. That kills the only thing the animation has to offer (the resolve). Cut it.
- **The 4s "breathing" pulse at rest is decoration without meaning.** Ink that has soaked into paper does not breathe. The card should *stop*. Stillness is the resolution.
- **`01 / who` as a serif numeral label is fine; specifying both eyebrow + index-numeral + facet-numerals (`i. ii. iii.`) is three numbering systems in one card.** Pick one.

**What to do instead**
Keep the drop, the fall, the impact ring, the bloom, and the hairline outline. Replace the five labels with **two — at most three — handwritten serif italic phrases** placed at the actual irregularities in the bloom's edge, as if the shape *produced* them. Words like *"raised three kids,"* *"swims at six,"* *"father's diabetes."* Specific, not categorical. They are not facets of a person — they are the person. Drop the dashed perimeter and the breathing. End on stillness.

### Card 2 — Reflection · "The Returning Drop"

**What's working**
- **The 1.6s hold + 800ms gap is the single most important beat in this section.** The plan calls this out; protect it from the next revision's instinct to "make it less slow."
- "Silence is content" — yes. That sentence should be a load-bearing comment in the source.
- Ink-on-orange-wash for the question text (not white-on-orange) is correct. White would have collapsed it into chat-UI.

**What's not working**
- **Four positions cycling in sequence still reads as a slideshow.** Four discrete coordinates with a `setInterval` is a carousel wearing a metaphor. The eye learns the pattern in one loop and then it's a Powerpoint.
- **The "previous bloom remains as a 4% ghost" is the right instinct but the plan undercuts it.** If you also fade the bloom out to a hairline ghost at t=4100 of every cycle, the ghosts compete with each other and the field gets noisy. Pick one ghosting strategy.
- **Continuous looping while inView risks Card 2 stealing the section.** Cards 1 and 3 play once. Card 2 looping forever turns the eye into a moth.
- **Newsreader italic 17–19px inside the bloom may not hold** at the actual card size (aspect 3/4, probably ~280–340px wide on desktop). Test this before locking — italic serif at small sizes on a soft orange wash is a typographic minefield.

**What to do instead**
- **Two questions per inView, not four.** Two drops, two blooms, two long holds, then rest. The audience does not need to see the whole library; they need to feel the rhythm. Then the loop *stops* and the final state is "two ghosts, one fresh bloom, all the questions visible quietly." The card resolves; it doesn't run forever.
- Positions are not pre-coordinates. They're determined by where the *previous* bloom wasn't. Two positions, hand-chosen for composition, not random.
- If italic 17–19px doesn't hold, drop the question text out of the bloom entirely and put it as **a margin note next to the bloom** — connected by a 1px hairline. That is more "clinician's notebook" than text-inside-blob and solves the legibility problem at the same time.

### Card 3 — Continuity · "The Stain That Builds"

**What's working**
- `mix-blend-mode: multiply` for the overlap is exactly right. Genuine craft, no faking colors, single ink.
- The "today" tick getting `text-brand-700` while the older two are muted is a small move with a lot of meaning. Keep.
- The three margin-note phrases are the right voice (*"Sundays are the hardest"*) — concrete, in the patient's words, not bullet-point insights.

**What's not working**
- **Three ticks evenly spaced on a horizontal line is a timeline.** The whole plan complains about timelines and then designs one. Even with ink blooms, eye-spacing-eye-spacing-eye reads as *chronological axis*.
- **The "pulse once" beat on the overlap zone (saturation 100 → 120 → 100) is a tell.** It's the AI-orb gesture in disguise — a flash to tell the user "this part is special." Trust the multiply-blend density to do that for you. If it doesn't, the composition is wrong; pulsing won't fix it.
- **Three drops landing in 1.8 seconds is too tidy.** Continuity is supposed to *feel* like accumulation. Three identical 900ms cycles is a metronome. Three sessions feel the same as three drops in a faucet.
- **"Building on both" as the today-quote is meta-commentary, not the patient.** A coach would never say that in session notes. Replace.

**What to do instead**
- **Drop the horizontal ticks. Stack the three blooms vertically off-center**, or arrange them in a slight downward arc — not a line. The composition itself should say "this is not a sequence, it is a deepening." Think of how a doctor's signature accumulates in a chart over months, not how a Gantt chart looks.
- Vary the drop timing: 0, 900, 2100. The third drop arrives later than the second — like the rhythm of returning. Subverts the metronome.
- Drop the overlap pulse entirely. The blooms land, multiply, the hairline outline of the overlap region traces last, the margin notes appear. Done.
- Rewrite "Building on both insights" to a patient-voice line: *"This week I cooked on Sunday."* Same character count, infinitely more credible.

## 3. Direct answers to the planner's 5 open questions

1. **Ink color — pure brand orange.** Adding Millie plum to Card 2 is a clever idea that dies in three seconds: a CHRO will read it as "inconsistent brand." This section is not about Roni vs. Millie. It is about *how* Chronilogix coaches, both of them.

2. **Flat SVG vs. raster ink texture — SVG with `feGaussianBlur` + `feTurbulence` for the edge irregularity, plus a single shared 8–12KB paper-grain PNG washed over the whole grid at low opacity.** Per-card raster ink PNGs are too precious, will not survive a copy change, and will not redraw on the fly when the question text rotates in Card 2. The clinical-journal feel comes from the *paper*, not the ink. One paper texture across all three cards locks that register; vector ink stays editable.

3. **Question text — serif italic.** The "precious" risk is real, but the alternative (sans) collapses Card 2 into product UI and undoes the entire metaphor. The mitigation is sizing and weight: serif italic at a *confident* size (call it 18–22px depending on card width), not 12–14px coquette. A CHRO reads margin notes in clinical journals every week. They will not flinch.

4. **Timestamps — relative ("six weeks ago · last week · today").** EHR clinical register would be wrong here. This card is about how the *coaching relationship* remembers, not how the *database* records. Relative time is how humans remember. The phrase "six weeks ago" carries more weight than "Mar 4" for a buyer who's never met this patient.

5. **Closing ink drop punctuation — no.** Twee, exactly as the planner suspects. The closing line is the page exhaling; an ink drop in front of it is the page winking. Restraint here is the move that pushes the section from "very good" to "right." Trust the words.

**6. (One the planner didn't ask but should have): Should the three cards share a synchronized inView trigger, or stagger independently?** Stagger independently with the card's own observer. The current `PatternsBlock` shared `inView` means all three cards fire at once on entry — which means Card 2 starts looping before the user has even seen Card 1's bloom resolve. Each card animates when *it* enters, with its own staggered eyebrow/title delay following the visual.

## 4. Three things the planner missed

1. **Continuity with the AgentStrips above it.** The plan treats this section as standalone. It isn't. The two AgentStrips are saturated, soft, color-forward; Roni in warm orange, Millie in plum. Drop straight from those into a near-empty cream field with three ink blooms and the page reads as a *register shift* — loud chord, then considered phrase. That's the right move, but it has to be designed deliberately. **The vertical gap between the second AgentStrip and the patterns h3 should be larger than the current `mt-24/32/36`** — give the eye room to land. The shift only works if the silence is felt. Also: the patterns cards should NOT have the `bg-white` they currently do (`rounded-2xl bg-white`). White is a tonal break that fights the cream paper of the page. Make the cards the same cream as the page and let the hairline ink work — no card chrome at all if we can get away with it.

2. **What an out-of-the-blue visitor reads in three seconds.** A CHRO scrolling past has three seconds before they decide if this section is for them. In three seconds they will see: a serif headline, three cream rectangles with orange shapes in them, and three short titles. The three short titles are doing 80% of the work in those three seconds. The plan does not touch the titles, which is correct, but it also doesn't acknowledge that **the visuals must not compete with the titles for that three-second slot.** The current plan-v1 risks Card 2 (continuous-loop) drawing the eye before the headline lands. This is another reason to make Card 2 finite.

3. **Mobile.** Plan-v1 mentions the thread is `hidden lg:block`. It says nothing about how the cards themselves stack and animate on a phone. On mobile, three vertical aspect-3/4 cards in a row is ~2400px of ink-blooms. The cards must not all animate as the user scrolls — that turns the page into a slot machine. **On mobile, only the card currently in viewport animates; the other two render at final state.** This is also where the `prefers-reduced-motion` story actually gets tested, because mobile users on low battery often have reduced-motion on. The plan's reduced-motion specs are correct per card; what's missing is the orchestration rule for the section as a whole.

Bonus fourth (accessibility beyond reduced-motion): **alt text for these is non-trivial.** Each card's visual is illustrative, not informational — but a screen reader user will still parse the section. The titles + body copy already carry the meaning, so the SVGs should be `aria-hidden`, and the cards should be readable as title-and-body only. The plan should explicitly state this.

## 5. Vision statement for v2

Three cream plates from a clinical journal, each holding a single act of absorption in warm ink. The drop is not a flourish — it is the product, made visible: Chronilogix receives, reflects, and accumulates, the way a person does, not the way a database does. Every motion that isn't *that* needs to be cut.
