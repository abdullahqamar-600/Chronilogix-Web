"use client";

// WhoWeServe — "Who we serve" section, redesigned.
//
// The prior version was a one-at-a-time, auto-advancing left-rail
// carousel: only one persona was visible, so a visitor whose category
// sat at position 5 (Health Plans, Underserved, …) could scan the whole
// section and never realise their tab existed. This redesign borrows a
// two-column pattern — an anchored editorial left column beside a
// vertical list on the right — so EVERY persona is on screen at once.
//
// Interaction model (locked with the client):
//   • Brokers & Vendors have live deep-dive pages AND narrated audio
//     tracks. Their rows carry an inline audio player plus a direct link
//     to the sub-page. Audio is a taste; the link is the deep-dive.
//   • The other four (Employers, Health Plans, Wellness Platforms,
//     Underserved) have no sub-page, so their rows open a popup carrying
//     the persona's full detail (headline, description, metrics/signals).
//
// Two left-column visuals, chosen per page via the `variant` prop:
//   • "portrait"  (V1) — a warm human portrait, the person behind the buyer.
//   • "abstract"  (V4) — a designed warm motif: one core, every audience
//                        rippling outward from it.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

// ── Types ────────────────────────────────────────────────────────────

type Metric = {
  lead: string;
  caption: string;
  comparison: string;
};

type Signal = {
  label: string;
  body: string;
};

type PersonaCommon = {
  key: string;
  label: string;
  intro: string;
  /** One-line hook shown in the row, under the label. */
  hook: string;
  /** Which filled glyph + warm-tile variant to render — mirrors Nav. */
  glyph: GlyphKey;
  iconVariant: IconVariant;
};

// Personas with a live sub-page + narrated track: link out, play inline.
type LinkPersona = PersonaCommon & {
  kind: "link";
  href: string;
  linkLabel: string;
  audio: { src: string; title: string; durationHint: number };
};

// Personas with no sub-page: the row opens a popup carrying the detail.
type PopupPersona = PersonaCommon & {
  kind: "popup";
  headline: [string, string];
  description: string | ReactNode;
  metrics?: Metric[];
  signals?: Signal[];
};

type Persona = LinkPersona | PopupPersona;

// ── Icons — warm gradient tiles with filled glyphs, matching the Nav ──
//
// This mirrors the Nav's Solutions mega-menu icon system exactly: a soft
// warm base with a diffused radial glow and a white glyph reading as a
// chapter mark on the tile. Three variants (peach / coral / ember) span
// brand-400 → brand-800 so the row reads like a small gallery rather
// than a uniform column. Keep these values in sync with Nav.tsx.

type IconVariant = "peach" | "coral" | "ember";
type GlyphKey =
  | "briefcase"
  | "box"
  | "building"
  | "shield"
  | "device"
  | "heart";

const ICON_BG: Record<IconVariant, string> = {
  peach:
    "radial-gradient(ellipse 70% 85% at 50% 105%, rgba(184,70,20,0.45) 0%, rgba(184,70,20,0) 68%), linear-gradient(180deg, #FB9C5E 0%, #FF7434 100%)",
  coral:
    "radial-gradient(ellipse 65% 70% at 50% -8%, rgba(253,179,125,0.55) 0%, rgba(253,179,125,0) 60%), linear-gradient(180deg, #FF7434 0%, #E45A1C 100%)",
  ember:
    "radial-gradient(circle at 28% 32%, rgba(253,179,125,0.5) 0%, rgba(253,179,125,0) 55%), radial-gradient(circle at 74% 74%, rgba(120,40,10,0.42) 0%, rgba(120,40,10,0) 55%), linear-gradient(135deg, #FB9C5E 0%, #B84614 100%)",
};

// Filled 20×20 glyphs. The four that exist in the Nav (briefcase,
// building, shield, heart) are copied verbatim; `box` (Product Vendors)
// and `device` (Wellness Platforms) are drawn in the same filled style
// for personas the Nav doesn't carry.
const GLYPHS: Record<GlyphKey, ReactNode> = {
  briefcase: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 3.25A1.75 1.75 0 0 0 6.25 5v0.75H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2.25V5A1.75 1.75 0 0 0 12 3.25H8zm3.75 2.5V5a.75.75 0 0 0-.75-.75h-2a.75.75 0 0 0-.75.75v0.75h3.5z"
    />
  ),
  box: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2.4l6.5 3.35v8.5L10 17.6 3.5 14.25v-8.5L10 2.4zm0 2.15L6.6 6.3 10 8.05 13.4 6.3 10 4.55zM5 7.95v5.35l4.15 2.15v-5.3L5 7.95zm5.85 7.5L15 13.3V7.95l-4.15 2.2v5.3z"
    />
  ),
  building: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 3.5h11v13.5h-4V13h-3v4h-4V3.5zm2 2.75h1.75V8H6.5V6.25zm3.5 0h1.75V8h-1.75V6.25zm3.25 0h-1.75V8h1.75V6.25zM6.5 9.75h1.75v1.75H6.5V9.75zm3.5 0h1.75v1.75h-1.75V9.75zm3.25 0h-1.75v1.75h1.75V9.75z"
    />
  ),
  shield: (
    <path
      fill="currentColor"
      d="M10 3l6 2v5c0 3.5-2.5 6.2-6 7-3.5-.8-6-3.5-6-7V5l6-2z"
    />
  ),
  device: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.75 2.75h6.5A1.75 1.75 0 0 1 15 4.5v11a1.75 1.75 0 0 1-1.75 1.75h-6.5A1.75 1.75 0 0 1 5 15.5v-11A1.75 1.75 0 0 1 6.75 2.75zM10 7.05c-.6-.78-2-.62-2 .45 0 .86 1.2 1.63 2 2.15.8-.52 2-1.29 2-2.15 0-1.07-1.4-1.23-2-.45z"
    />
  ),
  heart: (
    <path
      fill="currentColor"
      d="M10 16.5s-6.5-3.6-6.5-8a3.75 3.75 0 0 1 6.5-2.5A3.75 3.75 0 0 1 16.5 8.5c0 4.4-6.5 8-6.5 8z"
    />
  ),
};

function GlyphTile({
  glyph,
  variant,
}: {
  glyph: GlyphKey;
  variant: IconVariant;
}) {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_1px_2px_rgba(15,20,25,0.06),0_12px_24px_-14px_rgba(184,70,20,0.42)] transition-all duration-200 ease-out-quart group-hover:shadow-[0_2px_6px_rgba(15,20,25,0.08),0_16px_30px_-14px_rgba(184,70,20,0.52)] motion-reduce:transition-none"
      style={{ backgroundImage: ICON_BG[variant] }}
    >
      <svg viewBox="0 0 20 20" className="h-6 w-6" aria-hidden>
        {GLYPHS[glyph]}
      </svg>
    </span>
  );
}

// ── Persona data ─────────────────────────────────────────────────────

const PERSONAS: Persona[] = [
  {
    kind: "popup",
    key: "employers",
    label: "Employers",
    intro: "For HR leaders & benefits owners",
    hook: "Reach an additional 25% of employees who never raise their hand — before they surface in claims.",
    glyph: "building",
    iconVariant: "coral",
    headline: ["Reach every employee.", "Not just the few who ask."],
    description: (
      <>
        <p className="body-prose">
          Chronilogix engages an additional 25% of your employees who
          were not previously receiving care &mdash; the benchmark Aetna
          reported from the{" "}
          <a
            href="/case-studies/aetna"
            className="underline decoration-brand-500/40 decoration-1 underline-offset-[3px] transition-colors hover:text-brand-700 hover:decoration-brand-600"
          >
            Aetna case study
          </a>
          .
        </p>
        <p className="mt-4 body-prose">
          At $60&ndash;70 per member per month, live coaching is too
          expensive to offer at real scale. Chronilogix delivers the same
          evidence-based coaching to your whole population, 24/7, at a
          fraction of the cost.
        </p>
      </>
    ),
    metrics: [
      {
        lead: "+25%",
        caption: "Additional employees engaged",
        comparison: "Not previously receiving care → reached, per Aetna",
      },
      {
        lead: "50%",
        caption: "Of live coaching, replaceable",
        comparison: "Live coaching calls → up to half replaced, no measurable decline",
      },
      {
        lead: "24/7",
        caption: "Available the moment it's needed",
        comparison: "Business hours → every hour",
      },
    ],
  },
  {
    kind: "link",
    key: "brokers",
    label: "Benefits Brokers",
    intro: "For benefits consultants & brokers",
    hook: "A defensible, CFO-ready ROI story — not another point solution.",
    glyph: "briefcase",
    iconVariant: "ember",
    href: "/solutions/brokers",
    linkLabel: "Read the full Brokers story",
    audio: {
      src: "/audio/chronilogix-broker-track.mp3",
      title: "A message to benefits brokers",
      durationHint: 122,
    },
  },
  {
    kind: "popup",
    key: "health-plans",
    label: "Health Plans & ACOs",
    intro: "For health plans & accountable care organizations",
    hook: "First-line claims mitigation — engage members before the claim.",
    glyph: "shield",
    iconVariant: "peach",
    headline: ["Claims mitigation,", "before the claim."],
    description:
      "A first line claims mitigation strategy. Chronilogix engages members before issues escalate, replacing up to 70% of routine human coaching at roughly one twentieth the cost, while improving access and member experience.",
    metrics: [
      {
        lead: "70%",
        caption: "Of routine coaching, replaceable",
        comparison: "Human coach required → Chronilogix covers",
      },
      {
        lead: "1/20",
        caption: "Of live coaching cost",
        comparison: "Baseline → ~5% of baseline",
      },
      {
        lead: "Pre",
        caption: "Engagement, before escalation",
        comparison: "Reactive triage → proactive outreach",
      },
    ],
  },
  {
    kind: "link",
    key: "vendors",
    label: "Product Vendors",
    intro: "For chronic care product & device vendors",
    hook: "Your product isn't the problem. What happens after delivery is.",
    glyph: "box",
    iconVariant: "peach",
    href: "/solutions/vendors",
    linkLabel: "Read the full Vendors story",
    audio: {
      src: "/audio/chronilogix-vendor-track.m4a",
      title: "A message to chronic care product vendors",
      durationHint: 139,
    },
  },
  {
    kind: "popup",
    key: "wellness-platforms",
    label: "Wellness Platforms",
    intro: "For consumer & enterprise wellness apps",
    hook: "The engagement layer your platform is missing.",
    glyph: "device",
    iconVariant: "coral",
    headline: ["The engagement layer", "your platform is missing."],
    description:
      "Embed Chronilogix as a white labeled coach to drive longer sessions, deeper retention, and more upgrade moments, without expanding staff or building clinical IP in house.",
    signals: [
      {
        label: "Longer sessions, deeper retention",
        body: "An engagement layer designed for return visits: more upgrade moments without reacquiring users.",
      },
      {
        label: "White labeled by design",
        body: "Your brand stays the surface; Chronilogix runs the coaching loop quietly underneath.",
      },
      {
        label: "No new staff, no clinical IP to build",
        body: "Skip the years of methodology work and the headcount that comes with it. Plug in, ship.",
      },
    ],
  },
  {
    kind: "popup",
    key: "underserved",
    label: "Underserved & Uninsured",
    intro: "For public health & community care programs",
    hook: "Judgment-free behavioral support, reachable at population scale.",
    glyph: "heart",
    iconVariant: "ember",
    headline: ["Care without the gate.", "Reachable at population scale."],
    description:
      "For people who often have no support alternative at all (the uninsured, underserved communities, and those who cannot afford repeated sessions), Chronilogix is an accessible, judgment free entry point to behavioral support at population scale.",
    signals: [
      {
        label: "An entry point where there isn't one",
        body: "For the uninsured and underserved, often the only behavioral support available at all.",
      },
      {
        label: "Judgment free, no scheduling, no cost barrier",
        body: "Help that arrives in the moment, on a phone, without the friction that turns people away.",
      },
      {
        label: "Population scale reach",
        body: "Picks up where staffed community programs cap out. Every member, every hour, every language.",
      },
    ],
  },
];

// ── Section ──────────────────────────────────────────────────────────

export function WhoWeServe({
  variant = "portrait",
}: {
  variant?: "portrait" | "abstract";
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openPersona = PERSONAS.find(
    (p) => p.key === openKey && p.kind === "popup",
  ) as PopupPersona | undefined;

  // Audio personas (Brokers, Vendors) lead the list — they carry the
  // narrated tracks and the two live deep-dive pages. Popup personas
  // follow. Order is derived here so the data array can stay grouped by
  // definition without dictating display order.
  const orderedPersonas: Persona[] = [
    ...PERSONAS.filter((p) => p.kind === "link"),
    ...PERSONAS.filter((p) => p.kind === "popup"),
  ];

  return (
    <section
      id="who-we-serve"
      aria-labelledby="who-we-serve-label"
      className="relative bg-paper-warm lg:h-screen lg:overflow-hidden"
    >
      <h2 id="who-we-serve-label" className="sr-only">
        The Markets We Serve
      </h2>

      {/* Soft cream gradients top & bottom — blend with neighbours. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20"
        style={{
          height: "min(180px, 18vh)",
          background:
            "linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
        style={{
          height: "min(180px, 18vh)",
          background:
            "linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)",
        }}
      />

      <div className="container-page flex flex-col justify-center py-16 md:py-24 lg:h-full lg:py-0">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-14 xl:gap-20">
          {/* Left — anchored editorial column. Fills the column height on
              desktop so the visual grows to meet the persona list. */}
          <div className="flex flex-col lg:h-full">
            <p className="eyebrow">The Markets We Serve</p>
            <h3 className="mt-4 font-serif text-4xl font-normal leading-[1.05] text-ink md:text-5xl">
              One platform.{" "}
              <span className="text-ink-muted">
                Every side of the system.
              </span>
            </h3>
            <p className="mt-4 max-w-md body-prose">
              Employers, brokers, health plans, product vendors, and
              wellness platforms each get a different return from the same
              engine &mdash; and the people who&rsquo;d otherwise go
              unreached get a way in.
            </p>

            <a
              href="#book-a-demo"
              className="group/cta btn-primary mt-6 w-fit"
            >
              Talk to our team
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
              >
                <ArrowRight />
              </span>
            </a>

            <div className="mt-7 lg:min-h-0 lg:flex-1">
              {variant === "abstract" ? (
                <AbstractVisual />
              ) : (
                <PortraitVisual />
              )}
            </div>
          </div>

          {/* Right — the full persona list, all visible at once. */}
          <ul className="min-w-0 divide-y divide-ink/10 border-t border-ink/10">
            {orderedPersonas.map((persona) =>
              persona.kind === "link" ? (
                <LinkAudioRow key={persona.key} persona={persona} />
              ) : (
                <PopupRow
                  key={persona.key}
                  persona={persona}
                  onOpen={() => setOpenKey(persona.key)}
                />
              ),
            )}
          </ul>
        </div>
      </div>

      <PersonaDetailPopup
        persona={openPersona ?? null}
        onClose={() => setOpenKey(null)}
      />
    </section>
  );
}

// ── Left visuals ─────────────────────────────────────────────────────

function PortraitVisual() {
  return (
    <div className="relative h-full overflow-hidden rounded-[24px] ring-1 ring-ink/8">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[320px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/who-we-serve.png"
          alt="Two people in unhurried conversation in a warm, light-filled space."
          className="absolute inset-0 h-full w-full object-cover object-[50%_45%]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"
        />
      </div>
    </div>
  );
}

// Abstract warm motif — one core, every audience rippling outward. Six
// soft nodes (the personas) sit on two concentric rings around a bright
// brand core, threaded by hairline spokes. Reads as "one engine, every
// side of the system" without a single stock illustration.
function AbstractVisual() {
  const nodes = [
    { x: 200, y: 60 },
    { x: 320, y: 150 },
    { x: 300, y: 300 },
    { x: 150, y: 330 },
    { x: 70, y: 220 },
    { x: 110, y: 110 },
  ];
  return (
    <div className="relative h-full overflow-hidden rounded-[24px] bg-paper-tint ring-1 ring-ink/8">
      <div className="relative aspect-[5/6] w-full lg:aspect-auto lg:h-full lg:min-h-[280px]">
        <svg
          viewBox="0 0 400 480"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <radialGradient id="wws-glow" cx="50%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#FFCDA8" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#F9904D" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#F9904D" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wws-core" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFB088" />
              <stop offset="55%" stopColor="#FF7434" />
              <stop offset="100%" stopColor="#E45A1C" />
            </linearGradient>
          </defs>

          <rect width="400" height="480" fill="url(#wws-glow)" />

          {/* Concentric ripples emanating from the core. */}
          {[70, 120, 175, 230].map((r) => (
            <circle
              key={r}
              cx="200"
              cy="204"
              r={r}
              fill="none"
              stroke="#E45A1C"
              strokeOpacity={0.13 - r * 0.0003}
              strokeWidth="1"
            />
          ))}

          {/* Spokes from core to each node. */}
          {nodes.map((n, i) => (
            <line
              key={`s-${i}`}
              x1="200"
              y1="204"
              x2={n.x}
              y2={n.y + 84}
              stroke="#E45A1C"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
          ))}

          {/* Persona nodes. */}
          {nodes.map((n, i) => (
            <circle
              key={`n-${i}`}
              cx={n.x}
              cy={n.y + 84}
              r="7"
              fill="#FFFFFF"
              stroke="#FF7434"
              strokeWidth="1.6"
            />
          ))}

          {/* Bright brand core. */}
          <circle cx="200" cy="204" r="15" fill="url(#wws-core)" />
          <circle
            cx="200"
            cy="204"
            r="15"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}

// ── Right-column rows ────────────────────────────────────────────────

function PopupRow({
  persona,
  onOpen,
}: {
  persona: PopupPersona;
  onOpen: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`See details: ${persona.label}`}
        className="group grid w-full grid-cols-[auto_1fr_auto] items-start gap-x-4 py-4 text-left md:py-[1.15rem]"
      >
        <GlyphTile glyph={persona.glyph} variant={persona.iconVariant} />
        <span className="min-w-0">
          <span className="block text-lg font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-brand-700 md:text-xl">
            {persona.label}
          </span>
          <span className="mt-1.5 block max-w-xl body-quiet">
            {persona.hook}
          </span>
        </span>
        <span
          aria-hidden
          className="mt-1.5 text-ink-subtle transition-all duration-200 group-hover:scale-110 group-hover:text-brand-600"
        >
          <Plus />
        </span>
      </button>
    </li>
  );
}

function LinkAudioRow({ persona }: { persona: LinkPersona }) {
  return (
    <li className="group grid grid-cols-[auto_1fr_auto] items-start gap-x-4 py-4 md:py-[1.15rem]">
      <GlyphTile glyph={persona.glyph} variant={persona.iconVariant} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <a
            href={persona.href}
            className="text-lg font-medium leading-snug text-ink transition-colors duration-200 hover:text-brand-700 md:text-xl"
          >
            {persona.label}
          </a>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-brand-700 ring-1 ring-brand-200/60">
            Listen
          </span>
        </div>
        <p className="mt-1.5 max-w-xl body-quiet">{persona.hook}</p>

        <div className="mt-3 max-w-sm">
          <InlineAudioPlayer
            src={persona.audio.src}
            title={persona.audio.title}
            durationHint={persona.audio.durationHint}
          />
        </div>
      </div>
      {/* Single affordance, top-right — the link to the deep-dive page. */}
      <a
        href={persona.href}
        aria-label={persona.linkLabel}
        className="mt-1.5 text-ink-subtle transition-all duration-200 hover:translate-x-0.5 hover:text-brand-600"
      >
        <ArrowRight />
      </a>
    </li>
  );
}

// ── Inline audio player ──────────────────────────────────────────────

// Only one track should play at a time across the section. Each mounted
// player registers its <audio> here; when one starts, it pauses the rest.
const audioRegistry = new Set<HTMLAudioElement>();

function InlineAudioPlayer({
  src,
  title,
  durationHint,
}: {
  src: string;
  title: string;
  durationHint: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    audioRegistry.add(el);
    const onTime = () => setCurrentTime(el.currentTime);
    const onDur = () => setDuration(el.duration || 0);
    const onPlay = () => {
      // Pause every other registered track.
      audioRegistry.forEach((a) => {
        if (a !== el) a.pause();
      });
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onDur);
    el.addEventListener("durationchange", onDur);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    return () => {
      audioRegistry.delete(el);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onDur);
      el.removeEventListener("durationchange", onDur);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }, []);

  const seek = useCallback(
    (clientX: number) => {
      const el = audioRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const dur = el.duration || durationHint;
      el.currentTime = ratio * dur;
      setCurrentTime(ratio * dur);
    },
    [durationHint],
  );

  const durSafe = duration || durationHint;
  const progress = Math.min(1, currentTime / durSafe);

  return (
    <div className="flex items-center gap-2.5">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? `Pause: ${title}` : `Play: ${title}`}
        className="group/play relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors duration-300 hover:bg-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2"
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-full ring-2 ring-brand-accent/40 transition-opacity duration-300 ${
            isPlaying ? "animate-ping opacity-60" : "opacity-0"
          }`}
        />
        {isPlaying ? <PauseGlyph /> : <PlayGlyph />}
      </button>

      <div
        ref={trackRef}
        role="slider"
        aria-label={`Seek: ${title}`}
        aria-valuemin={0}
        aria-valuemax={Math.round(durSafe)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={0}
        onClick={(e) => seek(e.clientX)}
        onKeyDown={(e) => {
          const el = audioRef.current;
          if (!el) return;
          if (e.key === "ArrowRight") el.currentTime = Math.min(durSafe, el.currentTime + 5);
          if (e.key === "ArrowLeft") el.currentTime = Math.max(0, el.currentTime - 5);
        }}
        className="group/scrub relative h-1.5 min-w-0 flex-1 cursor-pointer overflow-hidden rounded-full bg-ink/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-brand-600"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
        {formatTime(currentTime)} / {formatTime(durSafe)}
      </span>
    </div>
  );
}

// ── Popup ────────────────────────────────────────────────────────────

function PersonaDetailPopup({
  persona,
  onClose,
}: {
  persona: PopupPersona | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActive = useRef<HTMLElement | null>(null);
  const open = persona !== null;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      previousActive.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    } else if (previousActive.current) {
      previousActive.current.focus?.();
      previousActive.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !persona) return null;

  return createPortal(
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-[100] bg-ink/45 backdrop-blur-md"
        style={{ animation: "fadeIn 240ms ease-out both" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="persona-detail-heading"
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex w-full max-w-[760px] max-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[28px] bg-paper-warm shadow-[0_40px_80px_-24px_rgba(15,20,25,0.35)] md:max-h-[calc(100svh-4rem)]"
          style={{ animation: "modalIn 320ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 md:right-7 md:top-7"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="overflow-y-auto px-7 py-12 md:px-14 md:py-14">
            <p className="eyebrow">{persona.intro}</p>
            <h2
              id="persona-detail-heading"
              className="mt-4 max-w-2xl font-serif text-[26px] font-normal leading-[1.12] text-ink md:mt-5 md:text-[32px]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {persona.headline[0]}{" "}
              <span className="text-ink-muted">{persona.headline[1]}</span>
            </h2>

            <div className="mt-6 max-w-2xl md:mt-7">
              {typeof persona.description === "string" ? (
                <p className="body-prose">{persona.description}</p>
              ) : (
                persona.description
              )}
            </div>

            {persona.metrics?.length ? (
              <MetricsGrid metrics={persona.metrics} />
            ) : null}
            {persona.signals?.length ? (
              <SignalsList signals={persona.signals} />
            ) : null}

            <div className="mt-10 md:mt-12">
              <a href="#book-a-demo" className="group/cta btn-primary w-fit">
                Talk to our team
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
                >
                  <ArrowRight />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

const ROMAN = ["I", "II", "III", "IV", "V"];

function MetricsGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="mt-10 border-t border-ink/15 pt-6 md:mt-12">
      <p className="eyebrow-muted">By the numbers</p>
      <div className="mt-6 grid grid-cols-1 gap-x-7 gap-y-6 sm:grid-cols-3">
        {metrics.map((m, i) => {
          const parts = m.comparison.split(/\s*→\s*/);
          const hasArrow = parts.length === 2;
          return (
            <div
              key={`${m.lead}-${i}`}
              className={
                i > 0 ? "border-t border-ink/10 pt-5 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0" : ""
              }
            >
              <p className="font-serif text-stat-md font-normal text-ink">
                {m.lead}
              </p>
              <p className="mt-2 text-sm font-medium leading-snug text-ink md:text-base">
                {m.caption}
              </p>
              {hasArrow ? (
                <p className="mt-1.5 font-serif text-[13px] italic leading-snug">
                  <span className="text-ink/45">{parts[0]}</span>
                  <span aria-hidden className="mx-1.5 not-italic text-brand-700">
                    →
                  </span>
                  <span className="text-ink-soft">{parts[1]}</span>
                </p>
              ) : (
                <p className="mt-1.5 font-serif text-[13px] italic text-ink-muted">
                  {m.comparison}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SignalsList({ signals }: { signals: Signal[] }) {
  return (
    <div className="mt-10 border-t border-ink/15 pt-6 md:mt-12">
      <p className="eyebrow-muted">What changes</p>
      <ol className="mt-4 flex flex-col">
        {signals.map((s, i) => {
          const isLast = i === signals.length - 1;
          return (
            <li
              key={`${s.label}-${i}`}
              className={`grid grid-cols-[2rem_1fr] gap-x-4 gap-y-1.5 py-5 ${
                !isLast ? "border-b border-ink/10" : ""
              }`}
            >
              <span className="font-serif text-[15px] italic leading-[1.55] text-brand-700">
                {ROMAN[i] ?? String(i + 1)}.
              </span>
              <p className="text-base font-medium leading-snug text-ink md:text-lg">
                {s.label}
              </p>
              <span aria-hidden />
              <p className="max-w-xl body-quiet">{s.body}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ── Glyphs & helpers ─────────────────────────────────────────────────

function PlayGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden style={{ marginLeft: 1 }}>
      <path d="M6 4l10 6-10 6V4z" fill="currentColor" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden>
      <rect x="5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
      <rect x="11.5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 7h9M8 3.5 11.5 7 8 10.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Popup personas (no subpage) use a plus — it reads as "expand for more"
// rather than "navigate away," which the arrow implies on the link rows.
function Plus() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 2.5v9M2.5 7h9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
