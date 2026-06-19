# Wave 1 Illustration Spec — Chronilogix

**Author:** Illustration + Graphics Designer
**Source docs:** `notes/agents/00-shared-context.md`, `notes/agents/01-copy-v2-canonical.md`, `notes/agents/cd/brief-illustration.md`, `notes/agents/cd/master-plan.md`
**Consumer files affected:** `components/HeroPhoneMockup.tsx`, `components/sections/Solution.tsx` (StepCards replacement), `components/sections/WhoWeServe.tsx`, `components/sections/ProofPoints.tsx`

---

## I1.1 — Product Chat Surface (Statement Scene 3 / §04 "See it work")

### 1. Asset name + where it lives

The visual lives entirely inside `components/HeroPhoneMockup.tsx` within the `ChatScreen` and its sub-components (`AIBubble`, `UserBubble`). No new file is created; this spec amends the existing rendering logic and adds three new sub-elements that do not currently exist: a **StatusChip**, a **SessionHeader** (already partially there), and a **TypingIndicator** component.

The canonical conversation to render (from §04 copy, `notes/agents/01-copy-v2-canonical.md`):

```
Turn 1  Coach (AI):  Hi Christopher 👋 Ready for today's check-in?
Turn 2  Member:      I keep skipping my evening medication.
Turn 3  Coach (AI):  Sounds like evenings get away from you. What's usually
                     going on around that time?
```

The typing-indicator fires between Turn 2 and Turn 3 — it is the pause before the coach's reflective question, the most important moment in the demo.

### 2. Job to be done

Show — in a single glance — that Chronilogix holds a real conversation, not a scripted reminder. The visual must read as a platform session already in progress, not a first-contact screen.

### 3. Style fingerprint

- **Stroke weight:** no strokes on bubbles — shape is implied through background contrast and a single hairline `border: 1px solid rgba(255,255,255,0.55)` on AI bubbles only.
- **Corner radius:** `rounded-2xl` (16px) on bubbles, `rounded-full` on the StatusChip.
- **Background register:** paper-warm cream wash over the existing `/iphone-bg.png`. AI bubble is glass-frost (cream with backdrop-blur); user bubble is solid near-white (`#FFF6E0`).
- **Texture:** the AI bubble carries a micro-pattern overlay (see Layer 4 below). Density: very low (3–4% opacity). Do not pattern the user bubble.
- **Typography:** `15px / 1.4` line-height for bubble text. Session header `12.5px font-semibold`. StatusChip `10px uppercase tracking-[0.18em]`.
- **AI presence dot:** a `6px` filled circle in `#F9904D` positioned top-left inside the AI bubble, `6px` from top-left corner of the bubble's padding box. This is the only branded orange element inside the phone screen.
- **No Material elevation.** The `0 6px 18px -8px rgba(58,36,18,0.18)` shadow already present is the ceiling — do not add more elevation layers.

### 4. Layers + composition (render order, bottom → top)

**Layer 1 — Screen background**
`background-color: #D8DCDA` (existing). Covered almost entirely by Layer 2.

**Layer 2 — Full-bleed photo wash**
`/iphone-bg.png` at `object-cover`. Existing. Unchanged.

**Layer 3 — Cream gradient legibility wash**
Existing `linear-gradient(180deg, rgba(255,251,236,0) 18%, rgba(255,247,225,0.6) 52%, rgba(255,244,216,0.92) 100%)`. Unchanged.

**Layer 4 — Top vignette**
Existing `linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 100%)`. Unchanged.

**Layer 5 — SessionHeader strip**
Currently: `<p className="text-[12.5px] font-semibold">Chronilogix · Tuesday 8:41</p>` at `color: #3A2412`.
**Change:** add a `4px` hairline separator below it (not a `<hr>` — use `border-bottom: 0.5px solid rgba(58,36,18,0.12)` on a wrapper `<div>`). Add `padding-bottom: 8px`. The separator visually encloses the header from the message stream below it. No other change to this element.

```jsx
<div style={{ borderBottom: "0.5px solid rgba(58,36,18,0.12)", paddingBottom: 8 }}>
  <p className="text-[12.5px] font-semibold" style={{ color: "#3A2412" }}>
    Chronilogix · Tuesday 8:41
  </p>
</div>
```

**Layer 6 — StatusChip**
New element. Sits between the SessionHeader and the first bubble, `margin-top: 10px`. This is a read-only pill that signals the session is contextually focused — not a clickable tag.

```jsx
<div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "rgba(249,144,77,0.10)",
    border: "0.75px solid rgba(249,144,77,0.28)",
    borderRadius: 999,
    padding: "3px 9px",
    marginTop: 10,
    marginBottom: 6,
  }}
>
  {/* 5px dot */}
  <span style={{
    width: 5, height: 5,
    borderRadius: "50%",
    background: "#F9904D",
    flexShrink: 0,
  }} />
  <span style={{
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#3A2412",
    opacity: 0.7,
  }}>
    Goal: medication adherence
  </span>
</div>
```

Color values: chip background `rgba(249,144,77,0.10)` (brand-500 at 10% — new opacity mix, existing token `#F9904D`); border `rgba(249,144,77,0.28)`; dot `#F9904D` (`brand-500`). Why not `brand-50` (`#FFF5EE`) as solid fill? The cream wash behind the screen is already warm; a near-transparent tint reads cleaner than a flat swatch.

**Layer 7 — AIBubble (Turn 1 + Turn 3)**
Current implementation preserved, with two additions:

A. **Presence dot**: a `6×6px` circle, `background: #F9904D`, positioned `absolute top-[9px] left-[9px]` inside the bubble. This is not an avatar — it is a minimal signal that the message comes from the AI. No label. No tooltip.

```jsx
<span
  aria-hidden
  style={{
    position: "absolute",
    top: 9,
    left: 9,
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#F9904D",
    opacity: 0.85,
  }}
/>
```

Because the bubble uses `relative`, this dot needs the bubble container to be `position: relative` with `overflow: visible` (it currently is `rounded-2xl` without overflow hidden, so fine).

B. **Micro-pattern overlay**: a `4×4px` SVG dot grid at `3.5% opacity`, tiled as a CSS `background-image` on the AI bubble container. It must not tile visibly at normal viewing distance — the dots should only emerge on close inspection.

```css
background-image: radial-gradient(circle, rgba(58,36,18,0.25) 0.75px, transparent 0.75px);
background-size: 4px 4px;
background-position: top left;
```

Blend into the existing `background: rgba(255,250,235,0.62)` using `::after` pseudo or a nested `<span aria-hidden>` sized to fill the bubble. The overlay opacity must be `0.035` (3.5%) — not higher.

**Layer 8 — UserBubble (Turn 2)**
No structural change. Existing `background: #FFF6E0`, `color: #3A2412`. The user bubble intentionally has no presence dot and no micro-pattern — the contrast between the AI bubble's subtle texture and the user bubble's flat clean white signals the two participants clearly.

**Layer 9 — TypingIndicator (between Turn 2 and Turn 3)**
New component. Three `7×7px` cream dots arranged horizontally with `5px` gap. Background `rgba(255,250,235,0.62)`, same glass-frost treatment as the AI bubble. The dots pulse up in sequence (Motion owns the pulse curve). The indicator has the same presence dot (Layer 7A) as AI bubbles — it is an AI "turn in progress".

```jsx
function TypingIndicator({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div
      className="self-start rounded-2xl px-4 py-3"
      style={{
        background: "rgba(255,250,235,0.62)",
        backdropFilter: "blur(8px) saturate(140%)",
        WebkitBackdropFilter: "blur(8px) saturate(140%)",
        border: "1px solid rgba(255,255,255,0.55)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.55) inset, 0 6px 18px -8px rgba(58,36,18,0.18)",
        position: "relative",
      }}
    >
      {/* Presence dot — same as AIBubble */}
      <span
        aria-hidden
        style={{
          position: "absolute", top: 9, left: 9,
          width: 6, height: 6, borderRadius: "50%",
          background: "#F9904D", opacity: 0.85,
        }}
      />
      {/* Three dots */}
      <div style={{ display: "flex", gap: 5, paddingLeft: 10 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            data-dot-index={i}            // Motion hook: stagger by index
            style={{
              width: 7, height: 7,
              borderRadius: "50%",
              background: "rgba(58,36,18,0.30)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

Dot color `rgba(58,36,18,0.30)` — ink (`#3A2412` = `#0F1419` approximate dark warm brown in the screen palette) at 30%. Why not `ink-muted (#5B6470)`? The screen background is a warm cream derived from `/iphone-bg.png`; the `#3A2412` warm-brown palette used throughout `ChatScreen` (existing) is correct; cool-gray `#5B6470` would clash.

### 5. Sizing + responsive behavior

The chat surface is bounded by `SCREEN` constants in the existing component:
- Occupies `91.2%` of phone width, `96.4%` of phone height.
- Phone itself: `clamp(260px, 26vw, 360px)` wide.
- All internal bubble measurements are `px` values that scale with the phone container — they are written as pixel values that visually scale because the containing `div` uses `%`-based positioning.
- StatusChip: `height: auto`, `max-width: 85%` of bubble column width. On narrow phones (≤260px phone width), chip font-size drops to `9px` — add `fontSize: "max(9px, 2.5vw)"`.
- TypingIndicator: same `maxWidth: 96%` as AI bubble. The three dots are always `7×7px`; they do not scale.

### 6. Color values

| Element | Value | Brand token |
|---|---|---|
| AI bubble background | `rgba(255,250,235,0.62)` | paper-warm derived |
| AI bubble border | `rgba(255,255,255,0.55)` | — |
| User bubble background | `#FFF6E0` | paper-warm + warmth shift |
| Presence dot | `#F9904D` | `brand-500` |
| StatusChip bg | `rgba(249,144,77,0.10)` | `brand-500` at 10% |
| StatusChip border | `rgba(249,144,77,0.28)` | `brand-500` at 28% |
| StatusChip text | `rgba(58,36,18,0.70)` | ink-screen (`#3A2412`) at 70% |
| Typing dots | `rgba(58,36,18,0.30)` | ink-screen at 30% |
| Session header separator | `rgba(58,36,18,0.12)` | ink-screen at 12% |
| Micro-pattern dots | `rgba(58,36,18,0.25)` at 3.5% overlay | — |

New hex introduced: `#3A2412` (warm ink, already present in the existing component at `color: "#3A2412"` — this is not new, it's the existing screen text color). No truly new hex is introduced. All chip and indicator colors are opacity derivations of `brand-500` (`#F9904D`) and the existing screen ink.

### 7. Animation hooks for Motion

Motion Designer reads `data-*` attributes and component names as hook targets.

| Hook label | Element | At rest | End state |
|---|---|---|---|
| `[data-bubble="ai-1"]` | Turn 1 AIBubble | `opacity: 0`, `translateY: 6px` | `opacity: 1`, `translateY: 0` |
| `[data-bubble="user-1"]` | Turn 2 UserBubble | `opacity: 0`, `translateY: 6px` | `opacity: 1`, `translateY: 0` |
| `TypingIndicator` wrapper | Typing dots container | `opacity: 0` | `opacity: 1` then exit before Turn 3 |
| `[data-dot-index="0/1/2"]` | Individual dots | `translateY: 0` | `translateY: -3px` staggered by 120ms per dot, loop 3× then hold |
| `[data-bubble="ai-2"]` | Turn 3 AIBubble | `opacity: 0`, `translateY: 6px` | `opacity: 1`, `translateY: 0` — fires after TypingIndicator fades |
| `[data-presence-dot]` | Orange dot on each AI bubble | `opacity: 0.85` at rest | no animation — this is the "already listening" signal, not a kinetic moment |
| `[data-status-chip]` | StatusChip | `opacity: 0`, `translateY: 4px` | `opacity: 1`, `translateY: 0` — reveals before Turn 1, once on load |

**The kinetic moment:** the TypingIndicator is the pause. Motion should hold it for ~1.4s before fading it out and revealing Turn 3. The dots' vertical bob is the only animation inside the indicator — keep it 160ms per dot, ease-out-soft, no bounce.

### 8. What it must not be

- **Not a generic SaaS chat template.** The AI bubble's glass-frost treatment and micro-pattern are specific to Chronilogix. The bubbles must not look interchangeable with iMessage or any wellness app's "chat interface" stock component.
- **Not the current conversation** ("What would make this time worth finishing for you…"). The spec explicitly replaces the existing `CONVERSATION` array with the §04 canonical three-turn chronic-care exchange (Christopher / medication adherence). The current conversation is mental-health adjacent — the brief forbids it.
- **Not a notification stream.** The session header, StatusChip, and bubble sequence together must read as a session in progress, not a push-notification list.
- **No full-color avatar circle.** The presence dot is `6px` — not an avatar. Do not expand it to `24px` or add initials.

### 9. Implementation notes

- Format: all modifications are inline JSX within `HeroPhoneMockup.tsx`. No new image file.
- Replace `CONVERSATION` array: update the three turns to the §04 canonical exchange.
- Add `StatusChip` as a named function component in the same file.
- Add `TypingIndicator` as a named function component in the same file. Pass `visible` boolean driven by `chatProgress` window (fires when `chatProgress > 0.52 && chatProgress < 0.63` approximately — align with `TURN_WINDOWS[1]` end and `TURN_WINDOWS[2]` start).
- Micro-pattern: implement as a `<span>` absolutely positioned inside `AIBubble`, `inset: 0`, `borderRadius: inherit`, `pointerEvents: none`, with the radial-gradient `background-image` as described. Do not use a PNG texture — CSS is sufficient and keeps file size at zero.
- `data-bubble` and `data-status-chip` attributes: add to respective container `<div>` elements so Motion can target them.

---

## I1.2 — How It Works Step Illustrations (Connect / Configure / Deploy)

### 1. Asset name + where it lives

Three new SVG illustrations, each replacing one of the three `<Visual>` components (`IntakeVisual`, `SessionVisual`, `MemoryVisual`) inside `components/sections/Solution.tsx`. The new components are named `ConnectVisual`, `ConfigureVisual`, `DeployVisual`. They live in-file (inline SVG + CSS) or as separate files if preferred at implementation; spec is format-agnostic.

Container: `aspect-[3/4]` card, `rounded-2xl`, `overflow-hidden`, `bg-white`. The illustration fills this container. On desktop, cards are three-column; on mobile, stacked single-column.

### 2. Job to be done

Each illustration communicates one step in plain, clinic-credible language — no metaphor needed. Connect says "the platform learns you from the first message." Configure says "the buyer sets the rules once." Deploy says "it runs 24/7 including at 2 AM."

### 3. Style fingerprint

All three illustrations share one visual language:

- **Stroke:** hairline, `strokeWidth="1.5"`, `strokeLinecap="round"`, `strokeLinejoin="round"`. No fills except: paper-warm background, one brand-orange accent element per illustration, and soft ink fills at ≤10% opacity for secondary shapes.
- **Background:** paper-warm `#FBF8F4` as the card fill. The existing `/card-1-bg.jpg` and `/pattern.png` blurred-bg approach is retired for these three cards — the new illustrations are the visual, not a blurred photo.
- **Color discipline:** orange accent appears exactly once per illustration, on the single most important element (the resolved intake field check / the lit tiles / the 2 AM marker). Everywhere else is ink-on-paper.
- **Scale:** illustrations use a `120×160px` internal viewBox (`viewBox="0 0 120 160"`) centered within the `aspect-[3/4]` container. They are not full-bleed — leave `14px` of paper margin on all sides.
- **Ink color:** `#3A2412` (the warm screen ink) is used here, not `#0F1419` (the pure digital ink). Rationale: these illustrations sit on paper-warm backgrounds; the warmer near-black reads more analogue and pairs better with the cream.

### 4. Layers + composition

---

#### I1.2-A: Connect

**Concept:** A vertical stack of three pill-shaped intake fields. Each field has a short label stub (hairline rectangle suggesting text). The bottom field has a filled circle `check` icon that resolves in orange — the visual culminates on "it understood".

**SVG sketch:**

```svg
<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg"
     width="120" height="160">

  <!-- Paper background (parent container provides bg; this is redundant but useful
       if SVG is exported standalone) -->
  <rect width="120" height="160" fill="#FBF8F4" />

  <!-- Field 1 — top, idle -->
  <rect x="14" y="32" width="92" height="26" rx="8"
        stroke="#3A2412" stroke-width="1.5" stroke-opacity="0.18"
        fill="rgba(58,36,18,0.04)" />
  <!-- Label stub -->
  <rect x="22" y="43" width="44" height="4" rx="2"
        fill="#3A2412" fill-opacity="0.14" />

  <!-- Field 2 — middle, idle -->
  <rect x="14" y="68" width="92" height="26" rx="8"
        stroke="#3A2412" stroke-width="1.5" stroke-opacity="0.18"
        fill="rgba(58,36,18,0.04)" />
  <rect x="22" y="79" width="36" height="4" rx="2"
        fill="#3A2412" fill-opacity="0.14" />

  <!-- Field 3 — bottom, resolved (orange accent) -->
  <rect x="14" y="104" width="92" height="26" rx="8"
        stroke="#F9904D" stroke-width="1.5"
        fill="rgba(249,144,77,0.07)" />
  <rect x="22" y="115" width="52" height="4" rx="2"
        fill="#3A2412" fill-opacity="0.20" />

  <!-- Check icon — rightmost in Field 3 -->
  <!-- Circle container -->
  <circle cx="93" cy="117" r="7"
          fill="white"
          stroke="#F9904D" stroke-width="1.5" />
  <!-- Check path -->
  <path d="M89.5 117 L92 119.5 L96.5 113.5"
        stroke="#F9904D" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round" />

  <!-- Subtle vertical connector lines between fields -->
  <line x1="60" y1="58" x2="60" y2="68"
        stroke="#3A2412" stroke-opacity="0.10" stroke-width="1" stroke-dasharray="2 2"/>
  <line x1="60" y1="94" x2="60" y2="104"
        stroke="#3A2412" stroke-opacity="0.10" stroke-width="1" stroke-dasharray="2 2"/>

</svg>
```

**Kinetic moment for Motion:** the check circle and path start at `opacity: 0, scale: 0.6` and resolve to `opacity: 1, scale: 1` when the card enters view. Field 3 border changes from ink-opacity to orange on the same trigger.

**Data-hook:** `data-connect-check` on the check `<circle>` + `<path>` group. `data-connect-field-3` on Field 3 `<rect>`.

---

#### I1.2-B: Configure

**Concept:** A `4×3` tile grid (12 tiles total). Three tiles are "lit" — soft orange tint. One lit tile has a hairline branch splitting from its bottom edge, representing an escalation rule. The other tiles are idle ink-on-paper.

```svg
<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg"
     width="120" height="160">

  <rect width="120" height="160" fill="#FBF8F4" />

  <!-- 4 columns × 3 rows = 12 tiles; tile size 22×22, gap 4 -->
  <!-- Origin: x=11, y=26 -->
  <!-- Tile positions (col 0–3, row 0–2) -->
  <!-- All idle tiles -->
  <!-- Row 0 -->
  <rect x="11"  y="26" width="22" height="22" rx="5"
        stroke="#3A2412" stroke-opacity="0.15" stroke-width="1.5"
        fill="rgba(58,36,18,0.03)" />
  <rect x="37"  y="26" width="22" height="22" rx="5"
        stroke="#3A2412" stroke-opacity="0.15" stroke-width="1.5"
        fill="rgba(58,36,18,0.03)" />
  <!-- Lit tile (0,0) col=2 row=0 -->
  <rect x="63"  y="26" width="22" height="22" rx="5"
        stroke="#F9904D" stroke-width="1.5"
        fill="rgba(249,144,77,0.10)"
        data-configure-lit="true" />
  <rect x="89"  y="26" width="22" height="22" rx="5"
        stroke="#3A2412" stroke-opacity="0.15" stroke-width="1.5"
        fill="rgba(58,36,18,0.03)" />

  <!-- Row 1 -->
  <!-- Lit tile (1,0) col=0 row=1 — with escalation branch below -->
  <rect x="11"  y="52" width="22" height="22" rx="5"
        stroke="#F9904D" stroke-width="1.5"
        fill="rgba(249,144,77,0.10)"
        data-configure-lit="true" />
  <rect x="37"  y="52" width="22" height="22" rx="5"
        stroke="#3A2412" stroke-opacity="0.15" stroke-width="1.5"
        fill="rgba(58,36,18,0.03)" />
  <rect x="63"  y="52" width="22" height="22" rx="5"
        stroke="#3A2412" stroke-opacity="0.15" stroke-width="1.5"
        fill="rgba(58,36,18,0.03)" />
  <!-- Lit tile (1,3) col=3 row=1 -->
  <rect x="89"  y="52" width="22" height="22" rx="5"
        stroke="#F9904D" stroke-width="1.5"
        fill="rgba(249,144,77,0.10)"
        data-configure-lit="true" />

  <!-- Row 2 — all idle -->
  <rect x="11"  y="78" width="22" height="22" rx="5"
        stroke="#3A2412" stroke-opacity="0.15" stroke-width="1.5"
        fill="rgba(58,36,18,0.03)" />
  <rect x="37"  y="78" width="22" height="22" rx="5"
        stroke="#3A2412" stroke-opacity="0.15" stroke-width="1.5"
        fill="rgba(58,36,18,0.03)" />
  <rect x="63"  y="78" width="22" height="22" rx="5"
        stroke="#3A2412" stroke-opacity="0.15" stroke-width="1.5"
        fill="rgba(58,36,18,0.03)" />
  <rect x="89"  y="78" width="22" height="22" rx="5"
        stroke="#3A2412" stroke-opacity="0.15" stroke-width="1.5"
        fill="rgba(58,36,18,0.03)" />

  <!-- Escalation branch from lit tile (1,0) — drops from center-bottom -->
  <!-- Stem -->
  <line x1="22" y1="74" x2="22" y2="108"
        stroke="#3A2412" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="3 2" />
  <!-- Branch left: human escalation -->
  <line x1="22" y1="108" x2="10" y2="120"
        stroke="#3A2412" stroke-opacity="0.25" stroke-width="1" />
  <!-- Branch right: continue AI coaching -->
  <line x1="22" y1="108" x2="34" y2="120"
        stroke="#3A2412" stroke-opacity="0.25" stroke-width="1" />
  <!-- Node at fork -->
  <circle cx="22" cy="108" r="3"
          fill="#FBF8F4" stroke="#3A2412" stroke-opacity="0.30" stroke-width="1.5" />
  <!-- Terminal dots -->
  <circle cx="10" cy="122" r="2.5"
          fill="#3A2412" fill-opacity="0.18" />
  <circle cx="34" cy="122" r="2.5"
          fill="#3A2412" fill-opacity="0.18" />

  <!-- Small label stubs under each branch -->
  <rect x="2"  y="126" width="16" height="3" rx="1.5"
        fill="#3A2412" fill-opacity="0.12" />
  <rect x="26" y="126" width="16" height="3" rx="1.5"
        fill="#3A2412" fill-opacity="0.12" />

</svg>
```

**Kinetic moment for Motion:** the three `[data-configure-lit]` tiles transition from idle to lit state on entry — `fill` and `stroke` interpolate from the idle values to the orange values. The escalation branch paths draw from `pathLength: 0` to `pathLength: 1`. `data-escalation-branch` on the stem + branch lines.

---

#### I1.2-C: Deploy

**Concept:** A clock face, 24-hour style (outer ring = 24 segments), with a sweep hand that runs from 0h to 24h. Two markers at `2 AM` and `2 PM` are annotated with small hairline labels. A soft orange pulse circle at the `2 AM` position is the accent moment.

```svg
<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg"
     width="120" height="160">

  <rect width="120" height="160" fill="#FBF8F4" />

  <!-- Clock circle, centered at (60,80), radius 44 -->
  <circle cx="60" cy="80" r="44"
          stroke="#3A2412" stroke-opacity="0.15" stroke-width="1.5" />

  <!-- Inner ring, radius 36 -->
  <circle cx="60" cy="80" r="36"
          stroke="#3A2412" stroke-opacity="0.07" stroke-width="1" stroke-dasharray="2 3" />

  <!-- 24 tick marks — outer ring. Major ticks at 6, 12, 18, 24 are longer.
       Tick positions: angle = (i / 24) * 360 - 90deg (0h = top) -->
  <!-- SVG tick generation described by algorithm; implement in JS via Array.from({length:24}) -->
  <!-- Major tick (at 6h intervals) length = 8px; minor tick = 4px -->
  <!-- Tick stroke: #3A2412 at 0.18 opacity, stroke-width 1.5 -->
  <!-- Implementation note: render in React with a map() over 24 indices. -->

  <!-- 2 AM position: 2/24 * 360 - 90 = -75deg from top
       x = 60 + 44 * cos(-75° in rad) ≈ 60 + 44*0.259 ≈ 71.4, y = 60 + 44*(-0.966) ≈ 80-42.5 ≈ 37.5
       Approximate: cx≈71, cy≈38 -->

  <!-- Orange pulse circle at 2 AM position — the accent -->
  <circle cx="71" cy="38" r="5.5"
          fill="rgba(249,144,77,0.20)"
          stroke="#F9904D" stroke-width="1.5"
          data-deploy-pulse="2am" />
  <circle cx="71" cy="38" r="2.5"
          fill="#F9904D"
          data-deploy-dot="2am" />

  <!-- 2 PM position: 14/24 * 360 - 90 = 120deg
       x = 60 + 44*cos(120°) = 60 + 44*(-0.5) = 38, y = 80 + 44*sin(120°) = 80+38.1 = 118.1
       Approximate: cx≈38, cy≈118 -->

  <!-- Ink dot at 2 PM — secondary, no orange -->
  <circle cx="38" cy="118" r="2.5"
          fill="#3A2412" fill-opacity="0.22" />

  <!-- "2 AM" label -->
  <text x="76" y="41" font-size="7" fill="#3A2412" fill-opacity="0.55"
        font-family="sans-serif" letter-spacing="0.08em">2 AM</text>

  <!-- "2 PM" label -->
  <text x="16" y="121" font-size="7" fill="#3A2412" fill-opacity="0.40"
        font-family="sans-serif" letter-spacing="0.08em">2 PM</text>

  <!-- Center dot -->
  <circle cx="60" cy="80" r="3"
          fill="#3A2412" fill-opacity="0.18" />

  <!-- Sweep hand — points to 2 AM in final state.
       Line from center (60,80) to near-2AM (70.5,38.5) -->
  <line x1="60" y1="80" x2="70.5" y2="39.5"
        stroke="#3A2412" stroke-opacity="0.30" stroke-width="1.5"
        stroke-linecap="round"
        data-deploy-hand />

  <!-- Short sub-hand (minute) — static, angled slightly off the hour hand -->
  <line x1="60" y1="80" x2="74" y2="56"
        stroke="#3A2412" stroke-opacity="0.15" stroke-width="1"
        stroke-linecap="round" />

</svg>
```

**Kinetic moment for Motion:** the sweep hand `[data-deploy-hand]` rotates from `0deg` (12 o'clock) through the full revolution to rest at `2 AM` (−75deg / 285deg). This is a `rotate` transform around `(60,80)`. Duration and curve from Motion Designer; this is a slow, deliberate rotation. The `[data-deploy-pulse]` circle at 2 AM pulses with a `scale(1)` → `scale(1.6)` → `scale(1)` radial breath, once, as the hand arrives.

**Note on SVG text:** the `<text>` elements above use `font-family="sans-serif"` as a fallback. Implementation should replace with the site's `--font-sans` variable via a `<style>` block inside the SVG or by converting to React rendered text.

### 5. Sizing + responsive behavior

- Container: `aspect-[3/4]`, `rounded-2xl`, fills the StepCard's `div`. Cards are `lg:grid-cols-3` (three columns desktop), stacked on mobile.
- SVG `viewBox="0 0 120 160"`, `width="100%"`, `height="100%"`. SVG scales to fill container without cropping.
- All internal pixel values in the SVG are in `viewBox` units — they scale uniformly.
- On mobile (single column), cards are taller relative to their width because the grid stacks. The `aspect-[3/4]` ratio is preserved — mobile cards are simply taller px.

### 6. Color values

| Element | Value | Brand token |
|---|---|---|
| All illustration backgrounds | `#FBF8F4` | `paper-warm` |
| All hairline strokes (idle) | `rgba(58,36,18,0.15–0.25)` | ink-screen at opacity |
| Orange accent stroke | `#F9904D` | `brand-500` |
| Orange accent fill | `rgba(249,144,77,0.07–0.10)` | `brand-500` at opacity |
| Orange pulse fill | `rgba(249,144,77,0.20)` | `brand-500` at 20% |
| Orange solid dot | `#F9904D` | `brand-500` |
| Idle tile fill | `rgba(58,36,18,0.03)` | ink-screen at 3% |
| Ink label stubs | `rgba(58,36,18,0.12–0.20)` | ink-screen at opacity |
| Escalation branch | `rgba(58,36,18,0.25)` | ink-screen at 25% |

No new hex values introduced. `#3A2412` is the screen ink already used in `HeroPhoneMockup.tsx`. It is used here (rather than `ink: #0F1419`) because these illustrations sit on paper-warm backgrounds and the warm-toned near-black is the right analogue register.

### 7. Animation hooks for Motion

| Hook | Element | At rest | End state |
|---|---|---|---|
| `[data-connect-check]` | Check circle + path in Connect | `opacity: 0, scale: 0.6` | `opacity: 1, scale: 1` |
| `[data-connect-field-3]` | Bottom field rect | idle stroke/fill | orange stroke/fill |
| `[data-configure-lit]` | Three lit tiles (3 elements) | idle stroke/fill | orange stroke/fill, staggered 80ms |
| `[data-escalation-branch]` | Stem + branch lines | `stroke-dashoffset: full` | `stroke-dashoffset: 0` |
| `[data-deploy-hand]` | Clock sweep hand | `rotate(0, 60, 80)` | `rotate(285, 60, 80)` |
| `[data-deploy-pulse]` | Orange circle at 2 AM | `scale: 1, opacity: 0.20` | pulse: scale(1.6) → scale(1), one breath |
| `[data-deploy-dot]` | Orange filled dot at 2 AM | `opacity: 0` | `opacity: 1` on hand arrival |

### 8. What it must not be

- **Not the current `IntakeVisual / SessionVisual / MemoryVisual`.** The existing visuals use blurred photo backgrounds, animated text cycling, and a pipeline node component. The new illustrations are static-first (Motion adds the kinetic beat), SVG-based, and sit on clean paper — they communicate the platform mechanism, not an animated demo.
- **Not three independent visual languages.** The trio must use identical stroke weight, identical `#FBF8F4` backgrounds, and the same one-orange-accent-per-illustration rule. A viewer seeing all three side-by-side must read them as one designed set.
- **Not a flowchart or enterprise diagram.** No arrows with labels, no process-box rectangles with thick borders, no "Step 1 → Step 2 → Step 3" explicit sequencing within an illustration. The sequence is implied by position (cards numbered 01/02/03 in `StepCard`), not drawn.
- **Not decorative.** Each illustration carries specific meaning (intake fields = learning you; tiles + branch = buyer configuration; clock + 2 AM = always-on). A viewer without a caption must be able to infer the step's meaning.

### 9. Implementation notes

- Format: inline SVG components (React) within `Solution.tsx`. Three new functions: `ConnectVisual`, `ConfigureVisual`, `DeployVisual`, replacing `IntakeVisual`, `SessionVisual`, `MemoryVisual` in the `STEPS` array.
- The 24 tick marks in `DeployVisual` should be rendered via `Array.from({length: 24}, (_, i) => ...)` computing each tick's start/end `x1/y1/x2/y2` from trigonometry. Do not hard-code all 24 elements.
- Remove `/card-1-bg.jpg`, `/pattern.png`, `/card-3-bg.jpg` imports from `StepCard` visual area. These are no longer needed for these three cards (they may remain if used elsewhere).
- File size budget: each inline SVG contributes <1KB of markup. No PNG/WebP needed.

---

## I1.3 — Use Cases Per-Persona Illustration / Pattern

### 1. Asset name + where it lives

Five persona treatments for the `WhoWeServe` (§08 Use Cases) section in `components/sections/WhoWeServe.tsx`. Each persona panel has a background visual region. Current state: `for-employees.png` works for Employers; `for-universities.png` is retired; the rest use `PlaceholderBackdrop` (dotted grid).

Two personas receive photography; three receive designed pattern alternatives; all five receive a corner fingerprint graphic.

### 2. Job to be done

Each persona panel background must signal the audience in a single glance — not through a photograph's literal content, but through the visual register of that world (the scale and formality of an employer benefits program, the distributed complexity of a health plan network, etc.). The designed panels must feel like a chosen aesthetic, not a placeholder.

### 3. Style fingerprint

- **Photography personas** (Employers): `for-employees.png` retained, with a paper-warm gradient overlay (`from-paper-warm via-paper-warm/65 to-transparent`, same treatment as AgentStrip) for text legibility.
- **Designed personas** (Brokers, Health Plans/ACOs, Wellness Platforms, Governments): paper-warm `#FBF8F4` base, a hairline geometric pattern specific to each persona, ink at low opacity, no fills other than paper-warm.
- **Corner fingerprint:** an `80×80px` area in one corner (top-right on standard orientation) containing a small signature graphic — unique per persona, hairline strokes. It must fit within the existing panel layout without overlapping the headline or body text.
- All five panels: consistent `border: 1px solid rgba(15,20,25,0.06)`, `rounded-2xl`, matching the card system established in `AgentStrip`.

### 4. Layers + composition per persona

---

#### Persona 1: Employers (default tab)

**Background:** `/for-employees.png` — retain. This is workplace photography that reads as benefits/HR.

**Overlay:** `linear-gradient(to right, #FBF8F4 0%, rgba(251,248,244,0.72) 40%, rgba(251,248,244,0.0) 100%)` — matches the AgentStrip gradient treatment. Text column on the left, photo bleeds right.

**Corner fingerprint — "Org chart stem":** Three horizontal hairline rows, each row three `12×12px` rounded squares connected by a `1px` hairline stem. This reads as an org chart without literalizing one. Positioned top-right, `12px` inset from corner. Ink at 12% opacity.

```svg
<!-- Employer fingerprint, 80×80 viewBox -->
<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Row 1: single node (top) -->
  <rect x="34" y="8" width="12" height="12" rx="3"
        stroke="#0F1419" stroke-opacity="0.12" stroke-width="1.5" />
  <!-- Stem from row 1 to row 2 -->
  <line x1="40" y1="20" x2="40" y2="30"
        stroke="#0F1419" stroke-opacity="0.12" stroke-width="1" />
  <line x1="20" y1="30" x2="60" y2="30"
        stroke="#0F1419" stroke-opacity="0.12" stroke-width="1" />
  <!-- Row 2: two nodes -->
  <line x1="20" y1="30" x2="20" y2="34"
        stroke="#0F1419" stroke-opacity="0.12" stroke-width="1" />
  <rect x="14" y="34" width="12" height="12" rx="3"
        stroke="#0F1419" stroke-opacity="0.12" stroke-width="1.5" />
  <line x1="60" y1="30" x2="60" y2="34"
        stroke="#0F1419" stroke-opacity="0.12" stroke-width="1" />
  <rect x="54" y="34" width="12" height="12" rx="3"
        stroke="#0F1419" stroke-opacity="0.12" stroke-width="1.5" />
  <!-- Row 3: four nodes (small) -->
  <line x1="20" y1="46" x2="20" y2="56"
        stroke="#0F1419" stroke-opacity="0.08" stroke-width="1" />
  <rect x="14" y="56" width="12" height="10" rx="2"
        stroke="#0F1419" stroke-opacity="0.08" stroke-width="1" />
  <line x1="60" y1="46" x2="60" y2="56"
        stroke="#0F1419" stroke-opacity="0.08" stroke-width="1" />
  <rect x="54" y="56" width="12" height="10" rx="2"
        stroke="#0F1419" stroke-opacity="0.08" stroke-width="1" />
</svg>
```

---

#### Persona 2: Benefits Brokers

**Background:** No photography available. Designed alternative.

**Pattern:** A hairline **ledger grid** — horizontal ruled lines, `12px` apart, spanning the full panel width, at `8% opacity`. Three of the lines have a small left-margin tick (suggesting columns in a ledger). No vertical lines. The ledger pattern is slightly rotated `−2deg` (transform on the pattern container) to avoid a rigid, spreadsheet feel.

**Implementation:** CSS `repeating-linear-gradient`:

```css
background-image: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 11px,
  rgba(15,20,25,0.07) 11px,
  rgba(15,20,25,0.07) 12px
);
transform: rotate(-2deg) scale(1.05); /* scale(1.05) prevents edge clipping */
```

Applied to a full-bleed `<div aria-hidden>` inside the panel. Over a `#FBF8F4` base.

**Corner fingerprint — "Ledger":**: A small 3-column ledger fragment: three hairline rows, each with three column-division marks. `80×80px`, top-right inset.

```svg
<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Three horizontal rules -->
  <line x1="10" y1="30" x2="70" y2="30" stroke="#0F1419" stroke-opacity="0.18" stroke-width="1" />
  <line x1="10" y1="44" x2="70" y2="44" stroke="#0F1419" stroke-opacity="0.14" stroke-width="1" />
  <line x1="10" y1="58" x2="70" y2="58" stroke="#0F1419" stroke-opacity="0.10" stroke-width="1" />
  <!-- Top rule (bolder) -->
  <line x1="10" y1="22" x2="70" y2="22" stroke="#0F1419" stroke-opacity="0.22" stroke-width="1.5" />
  <!-- Column dividers -->
  <line x1="30" y1="22" x2="30" y2="62" stroke="#0F1419" stroke-opacity="0.12" stroke-width="1" />
  <line x1="54" y1="22" x2="54" y2="62" stroke="#0F1419" stroke-opacity="0.12" stroke-width="1" />
  <!-- Row data stubs -->
  <rect x="12" y="32" width="14" height="3" rx="1.5" fill="#0F1419" fill-opacity="0.10" />
  <rect x="32" y="32" width="18" height="3" rx="1.5" fill="#0F1419" fill-opacity="0.10" />
  <rect x="56" y="32" width="10" height="3" rx="1.5" fill="#0F1419" fill-opacity="0.10" />
  <rect x="12" y="46" width="10" height="3" rx="1.5" fill="#0F1419" fill-opacity="0.08" />
  <rect x="32" y="46" width="16" height="3" rx="1.5" fill="#0F1419" fill-opacity="0.08" />
</svg>
```

---

#### Persona 3: Health Plans & ACOs

**Background:** No photography. Designed alternative.

**Pattern:** A **network-of-dots** — a moderate-density field of small circles (`3px` diameter) connected by hairline lines, suggesting a care network or claims graph. Think sparse constellation, not dense noise. Density: ~18 nodes in the panel area, connected by lines to the 2–3 nearest neighbors. All at `9% opacity`.

**Implementation:** Render as an inline SVG component (`HealthPlanPattern`) using a fixed (seeded) set of node coordinates — not random at runtime. The coordinates are authored to feel organic but not symmetric. Size it to fill the panel at `100% × 100%` with `preserveAspectRatio="xMidYMid slice"`.

Sample node coordinates (normalized 0–1 for a variable container, multiply by container px):

```
Nodes: (0.12, 0.18), (0.34, 0.08), (0.58, 0.22), (0.80, 0.12),
       (0.22, 0.42), (0.48, 0.38), (0.72, 0.44), (0.90, 0.35),
       (0.08, 0.64), (0.30, 0.70), (0.55, 0.60), (0.78, 0.68),
       (0.18, 0.88), (0.44, 0.82), (0.66, 0.90), (0.88, 0.78),
       (0.40, 0.54), (0.62, 0.50)  // two central "hub" nodes
```

Edges: connect each node to its 2 nearest neighbors by Euclidean distance. Hub nodes (0.40, 0.54) and (0.62, 0.50) each connect to 4 neighbors.

Stroke: `rgba(15,20,25,0.09)` / `stroke-width="1"`. Node circles: `fill: rgba(15,20,25,0.14)`, `r="3"`.

**Corner fingerprint — "Network nodes":** A small cluster of 5 nodes and 4 edges, more tightly composed than the full pattern. Top-right, 80×80px.

```svg
<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 5 nodes -->
  <circle cx="40" cy="22" r="3.5" fill="#0F1419" fill-opacity="0.20" />
  <circle cx="20" cy="40" r="3" fill="#0F1419" fill-opacity="0.16" />
  <circle cx="60" cy="40" r="3" fill="#0F1419" fill-opacity="0.16" />
  <circle cx="28" cy="60" r="2.5" fill="#0F1419" fill-opacity="0.12" />
  <circle cx="54" cy="60" r="2.5" fill="#0F1419" fill-opacity="0.12" />
  <!-- Edges -->
  <line x1="40" y1="22" x2="20" y2="40" stroke="#0F1419" stroke-opacity="0.14" stroke-width="1" />
  <line x1="40" y1="22" x2="60" y2="40" stroke="#0F1419" stroke-opacity="0.14" stroke-width="1" />
  <line x1="20" y1="40" x2="28" y2="60" stroke="#0F1419" stroke-opacity="0.10" stroke-width="1" />
  <line x1="60" y1="40" x2="54" y2="60" stroke="#0F1419" stroke-opacity="0.10" stroke-width="1" />
</svg>
```

---

#### Persona 4: Wellness Platforms

**Background:** No photography. Designed alternative.

**Pattern:** A **modular grid of nested rounded squares** — suggesting embeddability and white-label wrapping. A large outer square, a medium square inside it (inset 16px), a small square inside that (inset again). Three such nested sets arranged in a loose 2×2 grid (with one missing, asymmetrically). Hairline strokes, paper-warm fill. Register is: contained, composable, layered.

**Implementation:** CSS is sufficient — a `repeating-conic-gradient` or a simple SVG tiled at 60px intervals. Prefer SVG for precision.

**Corner fingerprint — "Nested squares":**

```svg
<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Three concentric rounded squares -->
  <rect x="10" y="10" width="60" height="60" rx="10"
        stroke="#0F1419" stroke-opacity="0.16" stroke-width="1.5" />
  <rect x="20" y="20" width="40" height="40" rx="7"
        stroke="#0F1419" stroke-opacity="0.12" stroke-width="1.5" />
  <rect x="30" y="30" width="20" height="20" rx="4"
        stroke="#F9904D" stroke-opacity="0.40" stroke-width="1.5" />
  <!-- Orange inner square is the "active embed" — single orange accent per fingerprint -->
</svg>
```

The innermost square uses `#F9904D` at `40% opacity` — the only orange in the fingerprint. It signals the "embedded layer" the Wellness Platform buyer is purchasing: Chronilogix sits inside their product.

---

#### Persona 5: Governments & Health Systems

**Background:** No photography. Designed alternative.

**Pattern:** A **coordinate grid with population density contours** — a sparse orthogonal grid (20px cells) with three elliptical contour rings in one quadrant, suggesting geographic reach or population mapping. No map literal (no country shapes). Register is: population-scale, evidence-based, institutional.

**Grid implementation:**

```css
background-image:
  linear-gradient(rgba(15,20,25,0.06) 1px, transparent 1px),
  linear-gradient(90deg, rgba(15,20,25,0.06) 1px, transparent 1px);
background-size: 20px 20px;
```

**Contour ellipses:** three concentric ellipses, centered in the upper-left quadrant of the panel, each `15%` larger than the last. Stroke `rgba(15,20,25,0.10)`, `stroke-width: 1`, `stroke-dasharray: 4 4`. Rendered as an SVG overlay.

**Corner fingerprint — "Contour rings":**

```svg
<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Three concentric ellipses, centered ~(32,42) -->
  <ellipse cx="32" cy="44" rx="14" ry="10"
           stroke="#0F1419" stroke-opacity="0.20" stroke-width="1.5" />
  <ellipse cx="32" cy="44" rx="24" ry="17"
           stroke="#0F1419" stroke-opacity="0.14" stroke-width="1" stroke-dasharray="3 3" />
  <ellipse cx="32" cy="44" rx="34" ry="24"
           stroke="#0F1419" stroke-opacity="0.09" stroke-width="1" stroke-dasharray="2 4" />
  <!-- Center dot — the focal point -->
  <circle cx="32" cy="44" r="3.5" fill="#0F1419" fill-opacity="0.18" />
</svg>
```

### 5. Sizing + responsive behavior

- Persona panels: the current `WhoWeServe.tsx` uses sticky scroll-driven panels. Panel background area occupies the right ~55% of the panel on desktop. On mobile, background is full-width with a gradient overlay bringing text to the top.
- Corner fingerprint: `80×80px` fixed, positioned `absolute top-4 right-4` (`16px` inset). On mobile (`< md`), reduce to `56×56px` via a Tailwind responsive class or inline style.
- Pattern backgrounds: all CSS-only or inline SVG, zero raster assets. They scale without quality loss.

### 6. Color values

| Element | Value | Brand token |
|---|---|---|
| All panel backgrounds | `#FBF8F4` | `paper-warm` |
| All hairline patterns (ink) | `rgba(15,20,25,0.06–0.22)` | `ink (#0F1419)` at opacity |
| Orange inner square (Wellness) | `rgba(249,144,77,0.40)` | `brand-500` at 40% |
| Fingerprint strokes (general) | `rgba(15,20,25,0.12–0.20)` | `ink` at opacity |
| Photography overlay gradient | `#FBF8F4 → transparent` | `paper-warm` |

No new hex values introduced.

### 7. Animation hooks for Motion

| Hook | Element | At rest | End state |
|---|---|---|---|
| `[data-persona-pattern]` | Pattern background container | `opacity: 0` | `opacity: 1` on tab activate, `dur-state (320ms)` |
| `[data-fingerprint]` | Corner fingerprint SVG | `opacity: 0, scale: 0.88` | `opacity: 1, scale: 1` on tab activate, short delay after pattern |

Tab switching is the kinetic moment. The pattern and fingerprint should dissolve in together when a persona tab activates — not slide or translate.

### 8. What it must not be

- **Not the current `PlaceholderBackdrop` dotted grid.** The explicit brief instruction is "not a dotted PlaceholderBackdrop." Each designed panel must look deliberate.
- **Not stock photography substitutes.** The brief says "reads as a real audience, not an abstract icon." The patterns are chosen for their vocabulary (ledger = brokers, network = health plans) — they must not be generically decorative.
- **Not symmetric or mathematically perfect.** The patterns (especially the network nodes and contour ellipses) must feel authored, not algorithmically generated with obvious regularity.
- **Not full-color or illustrative.** These are texture-level backgrounds — supporting the text overlay. They must not compete with the copy for attention.

### 9. Implementation notes

- Employers panel: update `for-employees.png` usage path if renamed; add org-chart fingerprint SVG as an absolute-positioned `<span aria-hidden>`.
- Remove `for-universities.png` reference entirely — the Universities tab is retired.
- Brokers, Health Plans, Wellness, Governments: replace `PlaceholderBackdrop` with new components (`BrokersPattern`, `HealthPlanPattern`, `WellnessPattern`, `GovPattern`) — each a `<div>` with the CSS pattern + an inline SVG fingerprint.
- All pattern components should accept a `className` prop for responsive sizing.
- Zero external image requests from these panels.

---

## I1.4 — Proof in Numbers: Source Marks + ROI Band

### 1. Asset name + where it lives

Two systems of graphics for the `ProofPoints` section (`components/sections/ProofPoints.tsx`):

A. **Source mark icons** — three glyph variants (`study`, `program`, `trial`), each `16×16px`, used inline before every attribution line on the stat cards.

B. **ROI Band** — a single full-width (max-width: `container-page`, 1240px) horizontal flow graphic showing `1,000 → 250 → 50% → $500 → $62,500`.

### 2. Job to be done

**Source marks:** Give the attribution lines visual weight without visual noise. A first-time viewer sees the glyph and understands "this is a cited source" before reading the text. Three distinct glyphs prevent attribution lines from blurring together.

**ROI Band:** Translate the abstract ROI math into a single, legible visual that a buyer can scan in two seconds. It must be a flow, not a chart — terminal numbers with hairline connectors.

### 3. Style fingerprint

All source marks:
- `16×16px` viewBox
- Single stroke, `strokeWidth="1.5"`, `strokeLinecap="round"`, `strokeLinejoin="round"`
- Color: `ink-muted (#5B6470)` — same visual weight as the attribution text
- No fill, no color variation between the three glyphs
- Match the `WaveIcon / ChatIcon / ClockIcon` family in `Solution.tsx`

ROI Band:
- Hairline connectors, `stroke-width: 1`, ink at `20% opacity`
- Terminal numbers: large sans, `brand-500` (`#F9904D`) or `ink` depending on position (final number `$62,500` in `#F9904D` as the destination color; intermediate values in ink)
- Paper-warm background, no card border
- No chart axes, no grid, no bars, no pie

### 4. Layers + composition

---

#### I1.4-A: Source Mark Icons

**`study` glyph** — a small page/document with two hairline rules on it (representing publication lines):

```svg
<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
     width="16" height="16" aria-hidden>
  <!-- Page outline -->
  <rect x="3" y="1.5" width="10" height="13" rx="1.5" />
  <!-- Two text lines -->
  <line x1="5.5" y1="6" x2="10.5" y2="6" />
  <line x1="5.5" y1="9" x2="9"    y2="9" />
</svg>
```

**`program` glyph** — two small circles connected by a curved arc (representing a program: linked cohorts, a methodology network):

```svg
<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="round"
     width="16" height="16" aria-hidden>
  <!-- Left circle -->
  <circle cx="4.5" cy="8" r="2.5" />
  <!-- Right circle -->
  <circle cx="11.5" cy="8" r="2.5" />
  <!-- Connecting arc — curves upward -->
  <path d="M7 8 Q8 4.5 9 8" />
</svg>
```

**`trial` glyph** — a flask: a narrow neck above a wider body with a liquid fill line:

```svg
<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
     width="16" height="16" aria-hidden>
  <!-- Flask neck top horizontal -->
  <line x1="5.5" y1="2" x2="10.5" y2="2" />
  <!-- Flask body — left neck line down, widens, base -->
  <path d="M6.5 2 L6.5 6.5 L3 13 Q3 14 4 14 L12 14 Q13 14 13 13 L9.5 6.5 L9.5 2" />
  <!-- Liquid fill line inside flask body -->
  <line x1="4" y1="11" x2="12" y2="11" stroke-opacity="0.50" />
</svg>
```

**Usage in JSX:** Each stat card has one attribution line. The appropriate source mark icon precedes it:

```jsx
<span className="flex items-center gap-1.5 text-[12px] text-ink-muted">
  <StudyIcon className="h-4 w-4 shrink-0" />
  <span>Aetna's MI program</span>
</span>
```

Three named exported components: `StudyIcon`, `ProgramIcon`, `TrialIcon`. Add to `Solution.tsx`'s icon family or create a shared `components/icons/SourceMarks.tsx`.

---

#### I1.4-B: ROI Band

The ROI Band is a horizontal four-step connector diagram. Five terminal values:

```
1,000 employees  →  250 with chronic conditions  →  50% engaged  →  $500 avg. savings  →  $62,500/yr
```

Layout logic (fits within `max-w-page` container, `px-6`):

- Five **terminal nodes**: each node is a `<div>` with a number (large) and a label (small, 11px, ink-muted, uppercase, `tracking-[0.22em]`).
- Four **hairline connectors**: `<div>` elements with `border-top: 1px solid rgba(15,20,25,0.18)`, filling the gap between nodes. Each connector has a small arrowhead — a `4×4px` rotated square (CSS `transform: rotate(45deg)`) at the right terminus, ink at `20% opacity`.
- Terminal node sizing: numbers are `clamp(1.5rem, 2vw + 0.5rem, 2.25rem)`, sans-serif, `font-weight: 600`.
- Label sizing: `11px`, `text-ink-muted`, `uppercase`, `letter-spacing: 0.22em`.

**The $62,500 terminal**: this node is visually distinct — number in `#F9904D` (`brand-500`), a hairline `#F9904D` bottom-border under the label, and a subtle `rgba(249,144,77,0.08)` background on the node container. This is the single accent in the band.

**Between-node operators:** between each pair of nodes, alongside the hairline connector, a small `×` or `/` or `→` operator hint sits centered above the line, `10px`, ink-muted at `40% opacity`. These are:
- Between 1,000 and 250: `÷ 4` (25% rate)
- Between 250 and 50%: `×` (engagement rate)
- Between 50% and $500: `×` (savings per member)
- Between $500 and $62,500: `=` (result)

**Responsive behavior:** on mobile (< md), the band stacks vertically — nodes become a single column, connectors become vertical hairlines on the left side. The `→` connectors become `↓`. On desktop, fully horizontal.

**SVG implementation option:** the connectors and arrowheads can be a single `<svg>` spanning the full width, with `<line>` elements drawn between node midpoints. This is more precise than CSS `border-top`. Prefer SVG.

```jsx
// ROIBand component outline (no SVG markup in full — describes structure)
function ROIBand() {
  const steps = [
    { value: "1,000", label: "Employees", op: null },
    { value: "250",   label: "With chronic conditions", op: "÷ 4" },
    { value: "50%",   label: "Engaged", op: "×" },
    { value: "$500",  label: "Avg. savings / member", op: "×" },
    { value: "$62,500", label: "Annual savings", op: "=", accent: true },
  ];
  // Render: flex row on md+, flex col on mobile.
  // Between each step pair: connector SVG line + op label.
  // accent=true: number in brand-500, node bg in brand-500 at 8%.
}
```

**Attribution line below band:** `Source: estimated from program engagement benchmarks and published savings data`. At `11px`, ink-subtle (`#8A93A0`), right-aligned. This is mandatory — the ROI figure needs provenance even if rough.

### 5. Sizing + responsive behavior

**Source marks:** `16×16px` inline, `shrink-0`. Vertically aligned with `items-center` alongside `12px` attribution text.

**ROI Band:** full container width (`max-w-page`, 1240px). Five nodes. On desktop, each node occupies ~20% of the width. On mobile, nodes stack; the band becomes a vertical list with left-aligned hairline connector.

### 6. Color values

| Element | Value | Brand token |
|---|---|---|
| Source mark icons | `#5B6470` (via `currentColor` on ink-muted parent) | `ink-muted` |
| ROI Band connectors | `rgba(15,20,25,0.18)` | `ink` at 18% |
| ROI Band operator labels | `rgba(15,20,25,0.40)` | `ink` at 40% |
| Node numbers (default) | `#0F1419` | `ink` |
| $62,500 node number | `#F9904D` | `brand-500` |
| $62,500 node bg | `rgba(249,144,77,0.08)` | `brand-500` at 8% |
| $62,500 node border | `rgba(249,144,77,0.22)` | `brand-500` at 22% |
| Attribution text | `#8A93A0` | `ink-subtle` |

No new hex values introduced.

### 7. Animation hooks for Motion

**Source marks:** no animation. They are static inline glyphs. Motion should not animate them — the attribution lines are the evidence layer, not the excitement layer.

**ROI Band:**

| Hook | Element | At rest | End state |
|---|---|---|---|
| `[data-roi-step]` (×5) | Each step node | `opacity: 0, translateY: 8px` | `opacity: 1, translateY: 0`, staggered 100ms per step left→right |
| `[data-roi-connector]` (×4) | Each hairline connector `<line>` | `stroke-dashoffset: full` | `stroke-dashoffset: 0` (draws left→right), fires after left-adjacent node arrives |
| `[data-roi-accent]` | $62,500 node | additional pulse: `scale(1)` → `scale(1.04)` → `scale(1)` | one breath on entry, `dur-quick (180ms)` |

**The kinetic moment:** the sequential staggered reveal (step 1 appears → connector draws → step 2 appears → connector draws → …) is the ROI band's narrative. Motion must treat it as a single choreographed left-to-right arrival, not five simultaneous reveals.

### 8. What it must not be

- **Not a bar chart, pie chart, or data visualization.** The ROI band is a **flow diagram** — five terminal values connected by hairlines. No chart chrome (axes, gridlines, bars, legend), no data visualization library.
- **Not a table.** Five values in a horizontal flow read differently from five rows of a table — the flow implies momentum toward the $62,500 figure. Do not render this as a `<table>` or a grid of equal-sized cells.
- **Not animated independently from scroll.** The staggered reveal fires once when the section enters the viewport. It does not loop.
- **Source marks must not be colored.** They are ink-muted, one color. Colorizing them (e.g., green for positive stats, red for negative) would introduce a data-journalism visual code that isn't supported elsewhere on the page.

### 9. Implementation notes

- Source mark icons: export from a new `components/icons/SourceMarks.tsx` file. Three named exports: `StudyIcon`, `ProgramIcon`, `TrialIcon`. All `16×16`, same style API as `WaveIcon` (accept `className?: string`).
- ROI Band: new function component `ROIBand` in `ProofPoints.tsx`. Full-width, below the stat card grid. Responsive as described.
- The ROI Band's connectors: prefer `<svg width="100%" height="32">` with `<line>` elements positioned at the midpoints between node containers. Node midpoints can be computed with `useRef` + `getBoundingClientRect` on mount, or approximated with CSS flex `flex: 1` connectors.
- Attribution required below band — add as a `<p>` with `text-ink-subtle` styling.
- File size budget for all source mark icons: < 200 bytes each (pure SVG path, no external refs).

---

## Shared cross-spec constraints (enforced across all four items)

1. **Millie's plum (`#B8617C` / `#7A3553`) does not appear anywhere in Wave 1 assets.** All four specs use only `brand-500` (`#F9904D`) as the brand accent. Plum is sacred to Millie's section and must not bleed into §04, §07, §08, or §10.

2. **No generic AI orbs.** `AIOrb.tsx` is not imported or referenced in any Wave 1 illustration component. The presence dot in the chat surface (I1.1) is a `6px` circle — not the AIOrb component.

3. **No Figma-default drop shadows.** The only permitted shadow in Wave 1 is the existing `0 6px 18px -8px rgba(58,36,18,0.18)` on AI bubbles in `HeroPhoneMockup.tsx`. No new `box-shadow` properties that weren't present in the starting codebase.

4. **Hairline first.** Every new drawn element uses `stroke-width: 1.5` (SVG) or `border-width: 1px / 1.5px` (CSS). No thick strokes, no filled shapes except the paper background, the one brand accent per illustration, and the source mark glyph stubs.

5. **Caption-free legibility.** Each visual must communicate its purpose without relying on a text label to carry the meaning. The intake fields say "learning you." The lit tiles say "you configure this." The clock at 2 AM says "always running." The ledger pattern says "financial/analytical world." A first-time viewer should get this in under three seconds.
