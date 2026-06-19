# Wave 1 — Web Designer Spec

**Scope:** W1.1 Statement Scene 3 · W1.2 How it works · W1.3 Use cases · W1.4 Proof in numbers  
**Source of truth for copy:** `notes/agents/01-copy-v2-canonical.md` §04, §07, §08, §10  
**Affected files:** `components/sections/Statement.tsx` · `components/sections/Solution.tsx` · `components/sections/WhoWeServe.tsx` · `components/sections/ProofPoints.tsx`

---

## W1.1 — Statement Scene 3 rewrite

### 1. Section ID + neighbors

| Slot | Section |
|---|---|
| Before | Statement Scene 2 — phone-rise mechanic. Phone is ~52–74% visible, chat screen inactive. |
| **This** | Statement Scene 3 — phone becomes the live demo surface. Two-column text+phone composition. |
| After | Two coaches (`Solution.tsx`) — warm `bg-paper-warm`, full-bleed agent strips. |

The scroll runway is `h-[240vh]` on the `runwayRef` div (Statement.tsx line 104). Scene 1 occupies `progress 0–0.45`, Scene 2 `0.45–0.55` (phone rises), Scene 3 starts at `SCENE3_START = 0.55` (line 18). All three scenes share one sticky panel — no reflowing of the page.

### 2. Layout sketch

**Desktop (≥1024px) — two-column inside the sticky panel:**

```
┌─────────────────────────────────────────────────────────────────┐
│  sticky panel  bg-[#F7F6F5]  rounded-[28px]  h-[calc(100svh-1rem)] │
│                                                                   │
│  container-page (max 1240px)                                     │
│  ┌────────────────────────┬──────────────────────────────────┐  │
│  │  LEFT COL              │  RIGHT COL                        │  │
│  │  (text block)          │  (phone, centered horizontally)   │  │
│  │  w ~ 5/12 of container │  w ~ 7/12 of container            │  │
│  │                        │                                   │  │
│  │  [eyebrow]             │   ┌──────────┐  ← phone, already  │  │
│  │  [headline]            │   │ iphone   │    risen from scene2 │ │
│  │  [body]                │   │ chat UI  │                   │  │
│  │  [caption]             │   │          │                   │  │
│  │                        │   └──────────┘                   │  │
│  └────────────────────────┴──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

- Text column is `flex-col justify-center` inside the full sticky height.
- Phone stays absolutely positioned (`absolute inset-x-0 bottom-0 flex justify-center`) — this is the existing `HeroPhoneMockup` mounting point (Statement.tsx lines 151–156). Scene 3 continues to use `maxRisePercent` boosted by `sceneThreeRiseBoost`. The phone does **not** move horizontally; it remains centered.
- Text column fades in over `sceneThreeRaw 0 → 0.35`. The `wordsFade` mechanism (lines 92–93) that fades the Scene 1 sentences is already in place; the text column opacity uses a parallel variable `textPanelOpacity = clamp01((sceneThreeRaw - 0.0) / 0.35)`.

**Tablet (640–1023px):**  
Text block stacks above the phone, centered. `max-w-[52ch]` on the body. Phone remains absolutely bottom-anchored, rising further (currently `baseRise = 62` for `vw >= 640`). Text block fades in first; phone is visible below it.

**Mobile (<640px):**  
Text block centered, `max-w-[40ch]`, sits in the upper 40% of the viewport. Phone rises from bottom into the lower 60%. Caption is hidden on mobile (TERTIARY — dispensable on small screens).

### 3. Hierarchy

| Element | Spec |
|---|---|
| Eyebrow | `text-[11px] uppercase tracking-[0.22em] text-ink-muted font-sans` |
| Headline | `font-serif text-section` (clamp 1.875rem → 2.75rem) `leading-[1.1] tracking-[-0.018em] text-ink` — matches section token |
| Body | `text-[15px] md:text-base leading-relaxed text-ink-soft max-w-[44ch]` |
| Caption | `text-[12px] leading-relaxed text-ink-muted mt-4` with a `→` arrow prefix — small, right after body |

### 4. Copy hierarchy

| Copy string | Priority | Notes |
|---|---|---|
| `Watch it work` | TERTIARY | Eyebrow — orients the visitor |
| `A real conversation, not a chatbot script.` | PRIMARY | First thing eyes hit in the text column |
| `Most "AI wellness" tools fire off reminders…` (body) | SECONDARY | Read on engagement, max 44ch line |
| `Onboarding → daily check-ins → goal tracking → progress reporting, in one conversation.` | TERTIARY | Caption — skimmed last, hidden on mobile |

Headline is ≤ 9 words. Body is 43 words — within the ≤60w story-section ceiling.

### 5. Component decomposition

**Existing — keep:**
- `HeroPhoneMockup` (`components/HeroPhoneMockup.tsx`) — already receives `chatProgress={sceneThreeRaw}`. The phone and chat surface stay as-is; Motion + Illustration own the conversation script and timing.

**Delete from `Statement.tsx`:**
- `SceneThreeCards` function (lines 169–229) — entire function removed.
- `FloatingCard` component (lines 383–427) — no longer needed.
- `ProvenMethodCard` (lines 232–256), `ValidatedAICard` (lines 260–315), `DecadesOfScienceCard` (lines 320–362) — all removed.
- `BarColumn` (lines 288–315) — removed with `ValidatedAICard`.
- `ChronilogixGlyph` (lines 429–438), `MarcusGlyph` (lines 440–449) — remove if unused elsewhere; check first.

**Add to `Statement.tsx`:**
- `<SceneThreePanel />` — a new internal component (not exported). Renders the text column. Props: `{ sceneThree: number }`. Receives `sceneThreeRaw` from the parent. Mounts as an `absolute` layer over the sticky panel, positioned left (desktop) or top-center (tablet/mobile).

**No new cross-cutting components needed.** The phone mockup, the sticky runway, and the scroll listener all remain.

### 6. Responsive behavior

| Breakpoint | Change |
|---|---|
| `<640px` | Text block centered, single column; caption hidden (`hidden`); phone rises to ~74% (existing `baseRise` value). Text `opacity` and `translateY` animate in over `sceneThreeRaw`. |
| `640–1023px` | Text block top-centered, `max-w-[52ch]`; phone below. Two elements co-exist vertically. |
| `≥1024px` | True two-column. Text left (`~42% of container`), phone right (centered in remaining space). Phone bottom-anchored as before. |

The existing `isDesktop` / `isMobile` booleans in Statement.tsx (lines 78–79) cover this split.

### 7. Empty / no-asset state

The phone screen (`HeroPhoneMockup`) already renders a chat UI with the existing `CONVERSATION` array and `iphone-bg.png`. No new assets needed for the text column — it is pure type. If `iphone-bg.png` is missing, the screen falls back to `bg-[#D8DCDA]` (HeroPhoneMockup.tsx line 135). The text column is always renderable.

### 8. Open questions for CD

1. **Phone shift at desktop:** Currently the phone is dead-center horizontally. In the new two-column layout the phone should appear right-of-center. Options: (a) pass `shiftXPercent` prop to `HeroPhoneMockup` during Scene 3 only (prop already exists at HeroPhoneMockup.tsx line 54); (b) wrap the phone in a column div. Option (a) is lower-risk — no markup restructure. CD to confirm which.
2. **Caption link:** The canonical copy says the caption is a navigation moment ("See it work" anchors to §04). Since Scene 3 *is* §04, does the caption just read as static text, or does it anchor elsewhere (e.g., `#how-it-works` / `#solution`)? CD to confirm anchor target.
3. **Conversation script in phone:** The existing `CONVERSATION` array (HeroPhoneMockup.tsx lines 8–27) is a generic MI exchange. The brief (§04) specifies the "I keep skipping my evening medication" exchange. Illustration owns the chat surface, but the component needs the new copy injected. CD to confirm whether that swap is part of this wave or Motion/Illustration's brief.

---

## W1.2 — How it works (`Solution.tsx`)

### 1. Section ID + neighbors

| Slot | Section |
|---|---|
| Before | Agent strips (Roni + Millie) — visually loud, warm orange + rose-plum, `bg-paper-warm`. |
| **This** | "How it works" rail — quieter register, numbered, structured. Lives inside the same `Solution.tsx` below the `AgentStrips`. |
| After | `WhoWeServe` — dark full-bleed sticky section. |

The current divider is `<div className="mt-20 md:mt-28">` at Solution.tsx line 114. This div wraps the entire "Three patterns" block that is being replaced.

### 2. Layout sketch

**Desktop:**

```
┌──────────────────────────────────────────────────────────────────┐
│  bg-paper-warm  (continuation of Solution section)               │
│                                                                   │
│  container-page                                                   │
│                                                                   │
│  [eyebrow: How it works]                                         │
│  [headline: Live in three steps.]                                 │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  hairline rule full-width                                │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │ 01            │  │ 02            │  │ 03            │        │
│  │ ─────────── → │  │ ─────────── → │  │ ───────────   │        │
│  │               │  │               │  │               │        │
│  │ [illus well]  │  │ [illus well]  │  │ [illus well]  │        │
│  │ aspect-[4/3]  │  │ aspect-[4/3]  │  │ aspect-[4/3]  │        │
│  │               │  │               │  │               │        │
│  │ Connect       │  │ Configure     │  │ Deploy        │        │
│  │ [body]        │  │ [body]        │  │ [body]        │        │
│  │ • beat        │  │ • beat        │  │ • beat        │        │
│  │ • beat        │  │ • beat        │  │ • beat        │        │
│  │ • beat        │  │ • beat        │  │ • beat        │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
│                                                                   │
│  [CTA: See how onboarding works →]                               │
└──────────────────────────────────────────────────────────────────┘
```

**Decision — horizontal rail, not `aspect-[3/4]` rectangles:**  
The current StepCard uses `aspect-[3/4]` portrait cards (Solution.tsx line 317). That format dominated the screen and visually competed with the AgentStrips above. The replacement uses `aspect-[4/3]` landscape wells (wider-than-tall), which are visually subordinate to the tall agent strips. Three landscape cards in a row read as an orderly mechanism list, not a hero row. The step numbers (`01 / 02 / 03`) read as labeling because the hairline connecting them is horizontal, matching the reading direction — no decoration.

### 3. Hierarchy

| Element | Spec |
|---|---|
| Eyebrow | `text-[11px] uppercase tracking-[0.22em] text-ink-muted` |
| Headline | `font-sans font-medium` at `text-[1.875rem] md:text-[2.25rem] leading-tight tracking-[-0.015em] text-ink` — **sans-medium, not serif**. Rationale: this section is the "mechanism" beat. Master plan: "Mechanical sans is reserved for §07, §10, §12." This is §07. |
| Step number | `text-[11px] font-medium uppercase tracking-[0.22em] text-ink-muted` — identical to eyebrow pattern; reads as labeling |
| Hairline connector | `h-px bg-ink/10` stretching full width below each step number, `origin-left` for a reveal scaleX animation |
| Card label | `text-base font-medium text-ink` — step title (Connect / Configure / Deploy) |
| Body | `text-[14px] leading-relaxed text-ink-soft max-w-[36ch]` |
| Beat list | `mt-3 space-y-1 text-[13px] text-ink-muted leading-snug` — three bullets per step, no bullet glyph: use `before:content-["–"]` or a `·` character. Max 8 words per beat. |
| CTA link | `text-[14px] font-medium text-brand-700 hover:text-brand-600` with `→` character — no button shell |

### 4. Copy hierarchy

| Element | Priority |
|---|---|
| `How it works` (eyebrow) | TERTIARY |
| `Live in three steps.` (headline) | PRIMARY |
| `Connect` / `Configure` / `Deploy` (step labels) | PRIMARY |
| Step body paragraph | SECONDARY |
| Three "what happens here" beats per step | TERTIARY |
| `See how onboarding works →` | SECONDARY |

**Step beats (three bullets per step) — spec for layout, not final copy:**

| Step | Beat examples (from canonical §07) |
|---|---|
| Connect | Goals, stressors, and circumstances from first message · Direct / employer benefit / embedded app · Short intake questionnaire |
| Configure | Focus areas · Escalation rules to human team · Brand as your own |
| Deploy | Daily check-ins · Goal tracking · Progress reporting from day one |

These are layout placeholders. CD / copy doc owns final wording.

### 5. Component decomposition

**Replace in `Solution.tsx` lines 114–126:**
- Remove `<h3>Three patterns. Every session.</h3>` and the entire `STEPS` array (lines 13–32) plus `StepCard`, `IntakeVisual`, `SessionVisual`, `MemoryVisual`, `BrainProgress`, `IntakeItem`, `PipelineNode` functions — these are only used by the old StepCard.
- Remove icon components `WaveIcon`, `ChatIcon`, `ClockIcon` (lines 342–393) — no longer needed.

**New component: `<HowItWorksRail />`**  
Lives in `components/sections/Solution.tsx` as an internal export, or extracted to `components/sections/HowItWorksRail.tsx` if the file grows unwieldy. Props:

```ts
// No props required; data is co-located as a const array.
const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    label: "Connect",
    body: "Onboard members directly, through an employer benefit, or embedded inside your existing app. A short intake questionnaire helps the platform understand each person's goals, stressors, and circumstances from the very first message.",
    beats: ["Direct / employer benefit / embedded", "Short intake questionnaire", "Goals, stressors, circumstances"],
  },
  {
    number: "02",
    label: "Configure",
    body: "Choose your focus areas, set escalation rules to your human team, and brand the experience as your own.",
    beats: ["Choose focus areas", "Set escalation rules", "White-label the experience"],
  },
  {
    number: "03",
    label: "Deploy",
    body: "Chronilogix goes to work 24/7: daily check-ins, goal tracking, and progress reporting from day one.",
    beats: ["Daily check-ins", "Goal tracking", "Engagement + outcomes data"],
  },
]
```

**Illustration well:** Each card has a `rounded-2xl bg-paper-tint border border-ink/[0.06]` well at `aspect-[4/3]` that Illustration will fill. Pre-asset: label `[Illustration — step N]` in `text-[10px] uppercase tracking-[0.22em] text-ink-subtle` at `bottom-3 left-4`, matching the `PlaceholderBackdrop` pattern in `WhoWeServe.tsx` line 416.

**Reuse:** The existing `useInView` hook (Solution.tsx line 71) drives reveal animation per card. Each card gets a staggered `transition-delay` (0ms, 150ms, 300ms).

### 6. Responsive behavior

| Breakpoint | Change |
|---|---|
| `<768px` | Single column. Steps stack vertically, full-width. The step number + hairline rule spans full width. Illustration well `aspect-[4/3]` becomes `aspect-[3/2]` at mobile for a shorter card. |
| `768–1023px` | Two-column grid (steps 01 and 02 side by side, step 03 full-width below). Or single column is acceptable — brief only specifies "three-card rail". CD to decide if 2+1 layout at tablet is wanted; otherwise single column up through desktop. |
| `≥1024px` | Three-column `lg:grid-cols-3` with `gap-8`. |

The CTA link is full-width on mobile (centered), left-aligned on desktop matching the container edge.

### 7. Empty / no-asset state

Illustration well is `bg-paper-tint rounded-2xl border border-ink/[0.06]` with the `[Illustration — Connect]` label in the bottom-left corner. No icons, no placeholder imagery. The section is fully readable without the illustration wells — the label + body + beats communicate the step completely.

### 8. Open questions for CD

1. **Illustration well aspect:** The brief says "one illustration block" per step but doesn't specify orientation. Spec assumes `aspect-[4/3]` (landscape). If Illustration needs portrait space, `aspect-[3/4]` can be restored — but see the visual-competition concern noted above. CD to confirm.
2. **Beat format:** Spec uses a plain `–` dash list. Current StepCard used icon + label (Solution.tsx lines 330–337). The icon set (WaveIcon/ChatIcon/ClockIcon) is being deleted. Should the new beats use a new small icon per step, or plain dashes? Dashes are lighter and quieter — appropriate given the "quieter than AgentStrips" acceptance criterion.
3. **Tablet layout:** Single column vs. 2+1 at 768–1023px. Both work; 2+1 is slightly more interesting. Need CD call.

---

## W1.3 — Use cases (`WhoWeServe.tsx`)

### 1. Section ID + neighbors

| Slot | Section |
|---|---|
| Before | `Solution.tsx` (How it works + AgentStrips) — `bg-paper-warm`, light. |
| **This** | `WhoWeServe` — dark full-bleed sticky scroll, `text-white`, `data-nav-tone="dark"`. |
| After | `ProofPoints.tsx` — `bg-paper-warm`, light. |

The sticky mechanic drives `active` persona index via IntersectionObserver on per-persona scroll markers (WhoWeServe.tsx lines 69–84). Total height = `100svh × PERSONAS.length` (line 103). This mechanic works; it scales directly from 4 to 5 personas.

### 2. Layout sketch

The existing layout is already correct — bottom-anchored `PersonaAccordion` + background crossfade. The only structural changes are:

1. Total height becomes `100svh × 5` (five personas).
2. The `PERSONAS` array changes from four to five entries.
3. A "key benefit chip" is added inside each expanded persona panel, positioned between the headline and description.

```
┌──────────────────────────────────────────────────────────────────┐
│  sticky panel  rounded-[28px]  h-[calc(100svh-1rem)]  text-white │
│                                                                   │
│  [background image or PlaceholderBackdrop — full bleed]          │
│  [bottom dark gradient overlay]                                   │
│                                                                   │
│  content (absolute, bottom-anchored):                            │
│                                                                   │
│  max-w-3xl  pl-20 pb-20                                          │
│                                                                   │
│  ┌─ Employers ─────────────────── [tab label, inactive: 55% α] ─┐ │
│  ├─ Benefits Brokers ─────────────────────────────────────────── │ │
│  ├─ Health Plans & ACOs ─────────────────────────────────────── │ │
│  ├─ Wellness Platforms ─────────────────────────────────────── │ │
│  └─ Governments & Health Systems ──────────────────────────── │ │
│                                                                   │
│  [Active persona expands:]                                        │
│    [headline line 1]                                              │
│    [headline line 2]                                              │
│    [benefit chip: e.g. "$300–$700 / engaged member / year"]       │
│    [description paragraph]                                        │
│                                                                   │
│  [Book a Demo  ●  white pill CTA]                                 │
└──────────────────────────────────────────────────────────────────┘
```

### 3. Hierarchy

| Element | Spec |
|---|---|
| Tab label (inactive) | `text-base md:text-lg font-medium text-white/55` — existing treatment, unchanged |
| Tab label (active) | `text-white/98` — existing treatment, unchanged |
| Active bar | `w-[2px] h-[28px] bg-white/95` — existing treatment, unchanged |
| Headline (active, expanding) | `font-serif font-normal tracking-[-0.015em] text-white` `clamp(1.625rem, 2.2vw + 0.55rem, 3rem)` `line-height: 1.08` — existing `WordReveal` treatment, unchanged |
| **Benefit chip (new)** | `inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-medium tracking-[0.02em] text-white/85 mt-3 mb-1` — glassmorphic pill, muted, does not compete with headline |
| Description | `text-sm md:text-base leading-relaxed text-white/75 max-w-xl mt-4` — existing treatment, unchanged |

### 4. Copy hierarchy

| Element | Priority | Notes |
|---|---|---|
| Tab labels (all five) | PRIMARY | Visitor reads these first to navigate |
| Active persona headline | PRIMARY | Two-line serif; the "reason this persona cares" |
| Benefit chip | SECONDARY | Single strongest stat; caught on skim |
| Description paragraph | SECONDARY | Read on engagement; max 45 words |
| Book a Demo CTA | PRIMARY | Conversion action; always visible |

**Canonical five personas — headline splits and chips:**

| # | Label | Headline line 1 | Headline line 2 | Chip |
|---|---|---|---|---|
| 1 | Employers | `Reach the ~250 in 1,000` | `before they become claims.` | `$300–$700 saved / engaged member / yr` |
| 2 | Benefits Brokers | `Lead with defensible ROI,` | `not another point solution.` | `Differentiates beyond plan design` |
| 3 | Health Plans & ACOs | `A front-door claims-mitigation` | `strategy that scales.` | `Up to 70% fewer live coaching hours` |
| 4 | Wellness Platforms | `The engagement layer` | `your platform is missing.` | `24/7 coaching, no added headcount` |
| 5 | Governments & Health Systems | `Clinically validated MI coaching,` | `built for population scale.` | `430+ peer-reviewed MI studies` |

Headline line pairs are draft splits — CD approves final wording. The two-line split follows the pattern established by the existing four personas (WhoWeServe.tsx lines 17–51, `headline: [string, string]` type).

### 5. Component decomposition

**`WhoWeServe.tsx` changes:**

1. **`PERSONAS` array (lines 14–52):** Replace entirely with the five-persona array. Same `Persona` type — no type change needed. The `headline: [string, string]` tuple, `image`, `imageAlt`, `key`, `label`, `description` fields all stay.

2. **Section height (line 103):** `style={{ height: \`calc(100svh * ${PERSONAS.length})\` }}` — automatically correct after the array is updated to 5 items.

3. **`PersonaItem` — add chip render (lines 214–292):**  
   Inside the expanded panel `div.pb-6.pl-6.pr-2`, between the `WordReveal` component and the close of the panel div, add a `<BenefitChip>` component that receives `chip: string` from the persona data.

4. **New internal component `<BenefitChip />`:**

```tsx
function BenefitChip({ text, isActive }: { text: string; isActive: boolean }) {
  return (
    <span
      className="mt-3 mb-1 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-medium tracking-[0.02em] text-white/85"
      style={{ opacity: isActive ? 1 : 0, transition: "opacity 400ms var(--ease-out-expo)" }}
    >
      {text}
    </span>
  );
}
```

5. **`PlaceholderBackdrop` (lines 415–432):** Keep as-is. Three of the five personas start without real images (Health Plans & ACOs, Wellness Platforms, Governments & Health Systems). The existing `PlaceholderBackdrop` is acceptable. The bottom-right label text will read `Imagery — [persona label]` — no change needed to the component.

6. **`Persona` type (lines 6–12):** Add `chip: string` field.

**No new cross-cutting components.** `NamedQuote` and `ComplianceBadges` are not needed here.

### 6. Responsive behavior

| Breakpoint | Change |
|---|---|
| `<640px` | Tab labels stack as before. Active headline is smaller (`clamp` is already responsive). Benefit chip wraps if text is long — keep chip copy ≤ 40 chars. Description `max-w-xl` naturally constrains. |
| `640–1023px` | No structural change from mobile. Content padding adjusts (`sm:p-10 md:p-14`). |
| `≥1024px` | Content padding `lg:p-16 xl:p-20` (existing). `max-w-3xl` keeps text legible. |

Five personas vs four: the `PersonaAccordion` stacks vertically in one column — no width issue. Five items at `py-4 md:py-5` each = approximately `220px` of tab height before expansion. On small viewports this could crowd the headline. Monitor on a real device.

**Mobile concern:** Five tab labels + expanded headline + chip + description + CTA may exceed visible height on phones ≤ 667px. Mitigation: the description on mobile can reduce to `text-sm leading-snug` and the headline font-size clamps lower. Open question for CD (see §8).

### 7. Empty / no-asset state

Personas 1 and 2 (Employers, Benefits Brokers) have images (`/for-employees.png`, `/for-universities.png` — **note: the Universities image will need to be re-assigned or replaced for Benefits Brokers**). Personas 3–5 use `PlaceholderBackdrop`. The placeholder is already polished enough for the POC — dark gradient + dot-grid pattern + label text.

**Asset flag:** The `for-universities.png` image is currently assigned to the Universities persona (line 33), which is being removed. That image slot should either be repurposed for Benefits Brokers (if the subject matter is close enough) or set to `null` and `PlaceholderBackdrop` used. CD / Illustration to provide a Benefits Brokers image.

### 8. Open questions for CD

1. **Universities removal documentation:** The brief says to remove Universities from the persona list. This is a meaningful business decision (drops a named audience from the page). Confirm Universities is definitively out, not just deprioritized to Tab 6+.
2. **Benefits Brokers image:** `for-universities.png` is currently slotted for the former Universities tab. Can it be repurposed for Brokers, or is `PlaceholderBackdrop` acceptable for launch?
3. **Mobile overflow:** Five personas + expansion content may crowd viewport height on small phones. Should the description be shortened further on mobile (via a separate `mobileDescription` field in the persona data), or is truncation via CSS `-webkit-line-clamp` acceptable?
4. **Chip copy:** The chip values in the hierarchy table above are sourced from canonical copy but are my splits — especially "Differentiates beyond plan design" for Brokers (not a stat). CD to approve chip strings or provide replacements.

---

## W1.4 — Proof in numbers (`ProofPoints.tsx`)

### 1. Section ID + neighbors

| Slot | Section |
|---|---|
| Before | `WhoWeServe` — dark full-bleed. Exits with a hard edge. |
| **This** | `ProofPoints` — `bg-paper-warm`, light and open. Contrast with the dark section above makes the section header land with visual relief. |
| After | Footer (current plan) or `Trust & Security` (Wave 2). |

### 2. Layout sketch

**Desktop:**

```
┌──────────────────────────────────────────────────────────────────┐
│  bg-paper-warm   section  py-24 md:py-32 lg:py-40                │
│                                                                   │
│  container-page                                                   │
│                                                                   │
│  [eyebrow: Proof in numbers]                                      │
│  [headline: The methodology has the receipts.]                    │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ STAT 1   │  │ STAT 2   │  │ STAT 3   │  │ STAT 4   │        │
│  │ big num  │  │ big num  │  │ big num  │  │ big num  │        │
│  │ label    │  │ label    │  │ label    │  │ label    │        │
│  │ ─────── │  │ ─────── │  │ ─────── │  │ ─────── │        │
│  │ source   │  │ source   │  │ source   │  │ source   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ STAT 5   │  │ STAT 6   │  │ STAT 7   │  │ STAT 8   │        │
│  │ (large)  │  │ big num  │  │ big num  │  │ DART*    │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  ROI BAND — full width                                    │    │
│  │  1,000 employees → 250 chronic → 50% engaged → $62,500/yr │   │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

**Grid:** `grid grid-cols-4 gap-5 md:gap-6 lg:gap-7` at desktop.  
**Tablet:** `grid-cols-2` (4×2 becomes 2×4).  
**Mobile:** `grid-cols-1` single column.

### 3. Hierarchy

| Element | Spec |
|---|---|
| Eyebrow | `text-[11px] uppercase tracking-[0.22em] text-ink-muted` |
| Headline | `font-sans font-medium text-section leading-[1.1] tracking-[-0.018em] text-ink` — **sans-medium** (mechanical/proof register per master plan) |
| Stat card: big number | `font-serif font-normal text-[clamp(2.25rem,3vw+0.5rem,3.5rem)] leading-[0.95] tracking-[-0.025em] text-ink` |
| Stat card: short label | `text-[14px] leading-snug text-ink-soft mt-2` — sans, no weight |
| Stat card: source separator | `border-t border-ink/[0.08] mt-3 pt-3` — hairline |
| Stat card: source line | `text-[11px] uppercase tracking-[0.16em] text-ink-muted leading-relaxed` |
| ROI band: story text | `text-[14px] md:text-base font-medium text-ink leading-relaxed` — each chain step |
| ROI band: arrow connector | `text-brand-600` `→` character between steps |
| ROI band: final figure | `font-serif text-[2rem] md:text-[2.5rem] leading-none text-ink` |

### 4. Copy hierarchy

| Copy | Priority |
|---|---|
| `Proof in numbers` (eyebrow) | TERTIARY |
| `The methodology has the receipts.` (headline) | PRIMARY |
| Eight big stat numbers | PRIMARY — eye goes here first |
| Eight short labels | SECONDARY |
| Source lines | TERTIARY — must be readable, but skimmed |
| ROI band calculation | SECONDARY — story moment; read after stats |

### 5. Component decomposition

**Replace `ProofPoints.tsx` entirely.** The current ledger pattern (single white card, metric right / label left) is the "wall of identical cards" anti-pattern when extended to 8 items.

**New pattern:** Individual floating cards, not a single outer card. Each stat card is its own `rounded-2xl border border-ink/[0.06] bg-paper shadow-soft p-5 md:p-6 flex flex-col`.

**Visual differentiation to prevent wall-of-identical:**

The eight cards should not look the same. Three structural variants:

| Variant | Used for | Distinguisher |
|---|---|---|
| **Standard** | Stats 2, 3, 5, 6, 7 | Big number + label + hairline + source. Default. |
| **Highlighted** | Stat 1 (`+43%`) | `bg-brand-50 border-brand-200` — warm tint. The Aetna lead stat. |
| **Flagged** | Stat 8 (Dartmouth NEJM AI) | Bottom strip `bg-ink/[0.04] rounded-b-2xl px-4 py-2 text-[10px] text-ink-muted italic` reading `"Category validation; not Chronilogix's own result."` — visually distinct, clearly disclaimed. |

**Stat 4 (`$300–$700`):** Big number is a range string. Render at slightly smaller size if the string is too wide (`text-[clamp(1.5rem,2.5vw+0.4rem,2.75rem)]`). Same Standard variant.

**New component: `<StatCard />`**  
Internal to `ProofPoints.tsx`. Props:

```ts
type StatCard = {
  metric: string;       // "+43%", "$300–$700", "≈ 1/20th"
  label: string;        // Short description ≤ 20 words
  source: string;       // Attribution line ≤ 15 words
  variant?: "standard" | "highlighted" | "flagged";
  disclaimer?: string;  // Only for "flagged" variant
}
```

**`<ROIBand />`** — full-width component below the grid. Not a card — a `rounded-2xl bg-paper border border-ink/[0.06] p-8 md:p-10` strip.

Internal layout: horizontal flex on desktop (`flex-wrap gap-x-3 gap-y-2 items-center`), stacks on mobile.

```
1,000 employees  →  250 with chronic conditions  →  50% engaged  →  $500 avg savings  =  $62,500 / yr
```

Each segment: `<span class="font-medium text-ink">[number/label]</span>` + `<span class="text-brand-600 mx-2">→</span>`. Final `=` and `$62,500 / yr` use the larger serif treatment.

**Existing components — none reused here.** `NamedQuote` is not needed (no quote in this section this pass). `ComplianceBadges` is not needed.

### 6. Stat card data — canonical eight

| # | Metric | Label | Source | Variant |
|---|---|---|---|---|
| 1 | `+43%` | Member engagement | Aetna's MI program (53.1% → 76%) | highlighted |
| 2 | `−55%` | Program dropouts | Same Aetna deployment | standard |
| 3 | `0.3%–0.9%` | Lower A1c | MI in diabetes care | standard |
| 4 | `$300–$700` | Saved per engaged member, per year | MI in employer settings | standard |
| 5 | `2–3×` | Engagement vs. legacy wellness | MI vs. standard programs | standard |
| 6 | `Up to 50%` | Fewer live coaching hours, same outcomes | MI deployment benchmarks | standard |
| 7 | `≈ 1/20th` | Cost of routine human coaching | MI platform benchmarks | standard |
| 8 | `On par` | AI coaching rated with human therapists | Dartmouth · NEJM AI · 2025 | flagged |

**Stat 8 disclaimer strip:** `"Category validation; not Chronilogix's own result."` — exact wording from brief.

**Stat attribution rule (acceptance criterion 1):** Cards 1 and 2 both cite Aetna. They use the same layout pattern (Standard for card 2, Highlighted for card 1) but each source line cites Aetna independently: `— Aetna's MI program` on card 1, `— Same Aetna deployment` on card 2. No shared attribution element.

### 7. Responsive behavior

| Breakpoint | Grid | Card |
|---|---|---|
| `<640px` | `grid-cols-1` | Full-width card. Metric `text-[2.5rem]`. ROI band stacks vertically — each step on its own line, arrows become `↓`. |
| `640–1023px` | `grid-cols-2` — 2×4 (tablet) | Standard sizing. |
| `≥1024px` | `grid-cols-4` — 4×2 | Full desktop layout. |

**Reveal:** Cards reveal on scroll via `useInView`. Stagger by column position: delay `(col index × 80ms)`. Row 2 cards start their stagger after row 1 is visible. Feels like a wave, not a pop.

### 8. Empty / no-asset state

This section is entirely typographic — no images, no illustrations. The highlighted card (`bg-brand-50`) and the flagged card's disclaimer strip are the only visual differentiators beyond the grid. Both are pure CSS/type. The section is immediately renderable with no external dependencies.

### 9. Open questions for CD

1. **Stat 3 metric format:** `0.3%–0.9% lower A1c` is a narrow metric string that reads like a range — not a single punchy number. Consider presenting as `~0.6% avg` with a label note, or leading with `$1,000 / yr` (the savings corollary). CD to decide which number leads.
2. **Stat 7 metric format:** `≈ 1/20th` is colloquial and reads small at large display size. Alternative: `~5%` of human coaching cost, or `20× cheaper`. CD to approve display format.
3. **Stat 8 heading text:** "On par" as the big display number is unusual — it reads more like a sentence fragment than a stat. Alternative large-display treatments: `91/100` (trust score approximation, if data supports it) or `Rated equal` in serif. CD to decide.
4. **ROI band — sourcing:** The `1,000 → 250 → 50% → $500 → $62,500` calculation is described in the copy doc as a "sample" ROI illustration. Should it carry a footnote that it is illustrative, or is it presented as a real case figure? Legal / CD to confirm.
5. **Section background:** Current `ProofPoints.tsx` uses `bg-paper-warm` (line 35). The new section sits after the dark `WhoWeServe` section — a `bg-paper-warm` section provides strong contrast relief. This is the right call. No question, just confirming the token stays.

---

## Cross-cutting notes

- All four sections respect `prefers-reduced-motion`. Existing patterns in the codebase (Statement.tsx lines 27–33, WhoWeServe.tsx lines 63–66) are the template.
- All four sections use `container-page` (max 1240px) for the inner content shell.
- No new color tokens are introduced. No colors outside `tailwind.config.ts` are referenced.
- The `eyebrow` class is used in `ProofPoints.tsx` line 50. All other eyebrows in this spec use the explicit `text-[11px] uppercase tracking-[0.22em] text-ink-muted` string. Consider extracting `eyebrow` as a shared utility class in `globals.css` or a `<Eyebrow>` component. Out of scope for Wave 1 — flag for Wave 3.
- Motion curves, easing values, and animation durations are not specified here. The Motion Designer owns those. Where needed, this spec says "feels weighty" (Scene 3 text entry) or "staggered wave" (Proof stat reveal) as directional guidance.
