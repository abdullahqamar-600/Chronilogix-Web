"use client";

import { useEffect, useRef, useState } from "react";

type Row = {
  eyebrow: string;
  heading: string;
  body: React.ReactNode;
  Visual: React.ComponentType<{ active: boolean }>;
};

/**
 * Platform section — two anchored claims, each with its own bespoke
 * visual that *shows* the concept rather than describing it.
 *
 *   01 · White-label   The same coaching, under any brand. Visualised as
 *                      a partner-app card whose brand chrome cycles
 *                      while the Chronilogix coaching content underneath
 *                      stays identical.
 *   02 · Coverage      Two active coaches plus four chronic-care modules
 *                      in development. Visualised as a 2+4 module grid
 *                      where the active tiles read solid and the in-dev
 *                      tiles read as dashed outlines with a quiet pulse.
 */

function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);
  return { ref, inView };
}

export function HiwPlatform() {
  return (
    <section
      id="platform"
      className="relative overflow-hidden rounded-[28px] bg-white pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40"
    >
      <div className="container-page">
        {/* Header */}
        <div className="max-w-3xl">
          <h2
            className="mt-4 text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Built to fit.{" "}
            <span className="text-ink-muted">Built to grow.</span>
          </h2>
          <p className="mt-5 max-w-[58ch] body-quiet">
            Deployed under your brand today. Built to expand with you.
          </p>
        </div>

        {/* Two anchored rows, alternating sides. */}
        <div className="mt-20 space-y-24 md:mt-28 md:space-y-32 lg:space-y-40">
          {ROWS.map((row, i) => (
            <PlatformRow key={row.heading} row={row} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformRow({ row }: { row: Row; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const { Visual } = row;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20"
    >
      {/* Content — always left on desktop, matching the home credibility
          section's consistent text-left / visual-right rhythm. */}
      <div
        className="order-2 lg:order-none flex flex-col justify-center"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(18px)",
          transition:
            "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 240ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 240ms",
        }}
      >
        <p className="eyebrow-muted">{row.eyebrow}</p>
        <h3 className="mt-3 max-w-[22ch] text-row font-serif font-normal text-ink">
          {row.heading}
        </h3>
        <p className="mt-5 max-w-[44ch] body-quiet">{row.body}</p>
      </div>

      {/* Bespoke visual — always right on desktop. */}
      <div
        className="order-1 lg:order-none"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "scale(1)" : "scale(0.97)",
          transition:
            "opacity 800ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-ink/[0.08] bg-paper shadow-[0_10px_28px_-18px_rgba(20,8,2,0.18)] md:aspect-[5/6]">
          <Visual active={inView} />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* 01 — White-label visual                                                  */
/*                                                                          */
/* A partner-app card whose chrome cycles through three partner brands      */
/* while the Chronilogix coaching content underneath stays identical.       */
/* The cycle is what carries the claim: same coach, any brand.              */
/* ──────────────────────────────────────────────────────────────────────── */

type PartnerBrand = {
  name: string;
  // A small SVG mark that sits next to the brand name. Kept abstract so
  // the visual reads as "any partner brand" rather than a real customer.
  mark: React.ComponentType<{ className?: string }>;
  // The brand's accent color used for the mark + a hairline above the
  // chat content. Chosen to imply variety across partner types.
  tint: string;
};

const PARTNER_BRANDS: PartnerBrand[] = [
  {
    name: "BlueCircle Health",
    mark: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden
      >
        <circle cx="8" cy="8" r="6" fillOpacity="0.18" />
        <circle cx="8" cy="8" r="3" />
      </svg>
    ),
    tint: "#3A6FB5",
  },
  {
    name: "Wellspring Co.",
    mark: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden
      >
        <path d="M8 2c2 3 2 5 0 7-2-2-2-4 0-7Z" />
        <path d="M3 9c3 1 5 1 7 0-1 3-3 5-7 0Z" fillOpacity="0.5" />
        <path d="M13 9c-3 1-5 1-7 0 1 3 3 5 7 0Z" fillOpacity="0.5" />
      </svg>
    ),
    tint: "#3F8C66",
  },
  {
    name: "Your brand here",
    mark: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="2.5" y="2.5" width="11" height="11" rx="2.5" strokeDasharray="2 1.5" />
        <path d="M8 5.5v5M5.5 8h5" />
      </svg>
    ),
    tint: "#E45A1C",
  },
];

const BRAND_CYCLE_MS = 3200;

function WhiteLabelVisual({ active }: { active: boolean }) {
  const [brandIdx, setBrandIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = setInterval(
      () => setBrandIdx((i) => (i + 1) % PARTNER_BRANDS.length),
      BRAND_CYCLE_MS,
    );
    return () => clearInterval(t);
  }, [active]);

  const brand = PARTNER_BRANDS[brandIdx];
  const Mark = brand.mark;
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* Soft warm wash behind the device card. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/60" />

      <div className="relative flex h-full items-center justify-center p-7 md:p-9">
        {/* Device card */}
        <figure
          className="relative w-full max-w-[300px] overflow-hidden rounded-[22px] bg-white ring-1 ring-ink/[0.06]"
          style={{
            animation: "fadeUp 600ms ease-out 100ms forwards",
            animationPlayState: playState,
            opacity: 0,
            boxShadow:
              "0 22px 50px -22px rgba(40,25,15,0.28), 0 4px 12px -4px rgba(40,25,15,0.10)",
          }}
        >
          {/* Brand chrome — this is the part that swaps. The chat below
              stays put. */}
          <div
            className="relative flex items-center justify-between border-b border-ink/[0.06] px-5 py-3.5"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
            }}
          >
            <div
              key={brand.name}
              className="flex items-center gap-2"
              style={{
                animation:
                  "fadeUp 360ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards",
                opacity: 0,
              }}
            >
              <span style={{ color: brand.tint }}>
                <Mark className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[13.5px] font-semibold tracking-tight text-ink">
                {brand.name}
              </span>
            </div>
            {/* The little tab dots — three quiet circles to imply nav.   */}
            <span aria-hidden className="flex items-center gap-1.5">
              <span className="block h-1.5 w-1.5 rounded-full bg-ink/15" />
              <span className="block h-1.5 w-1.5 rounded-full bg-ink/15" />
              <span className="block h-1.5 w-1.5 rounded-full bg-ink/15" />
            </span>
          </div>

          {/* Coaching content — identical across every brand. */}
          <div className="relative space-y-3 px-5 py-6">
            {/* Member message */}
            <div
              className="ml-auto max-w-[78%] rounded-[14px] rounded-br-[6px] px-3.5 py-2.5 text-[13px] leading-snug text-ink"
              style={{
                background: "rgba(252, 230, 205, 0.72)",
                border: "1px solid rgba(232, 188, 142, 0.55)",
                animation: "fadeUp 500ms ease-out 360ms forwards",
                animationPlayState: playState,
                opacity: 0,
              }}
            >
              Honestly, today felt impossible.
            </div>

            {/* Coach reply */}
            <div
              className="flex items-start gap-2"
              style={{
                animation: "fadeUp 500ms ease-out 760ms forwards",
                animationPlayState: playState,
                opacity: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/roni.png"
                alt=""
                className="mt-0.5 h-6 w-6 shrink-0 rounded-full object-cover ring-2 ring-white"
                draggable={false}
              />
              <div
                className="max-w-[88%] rounded-[14px] rounded-bl-[6px] border border-white/70 bg-white/95 px-3.5 py-2.5 text-[13px] leading-snug text-ink"
                style={{
                  boxShadow:
                    "0 1px 2px rgba(15,20,25,0.04), 0 6px 18px -10px rgba(15,20,25,0.10)",
                }}
              >
                What made today feel that way?
              </div>
            </div>
          </div>

          {/* Footer attribution — the only place Chronilogix is named.
              Reads quiet, the way a "powered by" line should. */}
          <div className="relative flex items-center justify-between border-t border-ink/[0.06] px-5 py-2.5">
            <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-ink-muted">
              Powered by
            </span>
            <span className="font-serif text-[13px] tracking-tight text-ink">
              Chronilogix
            </span>
          </div>
        </figure>
      </div>

      {/* Tiny caption below the card — names what the eye is watching. */}
      <p
        className="pointer-events-none absolute inset-x-0 bottom-5 mx-auto max-w-[28ch] text-center font-serif text-[12px] italic leading-snug text-ink-muted md:bottom-6"
        style={{
          animation: "fadeUp 600ms ease-out 1400ms forwards",
          animationPlayState: playState,
          opacity: 0,
        }}
      >
        Same coach. Any brand.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* 02 — Coverage visual                                                     */
/*                                                                          */
/* A 2+4 module grid. Two active coaches read solid; four in-development    */
/* modules read as dashed outlines with a quiet "in development" pulse.     */
/* ──────────────────────────────────────────────────────────────────────── */

type Module = {
  name: string;
  domain: string;
  state: "active" | "dev";
  Icon: React.ComponentType<{ className?: string }>;
};

const MODULES: Module[] = [
  {
    name: "Roni",
    domain: "Diabetes & chronic care",
    state: "active",
    Icon: LeafIcon,
  },
  {
    name: "Millie",
    domain: "Mental health & mood",
    state: "active",
    Icon: WaveIcon,
  },
  {
    name: "Cardiac",
    domain: "Heart & blood pressure",
    state: "dev",
    Icon: HeartIcon,
  },
  {
    name: "Retinopathy",
    domain: "Diabetic eye screening",
    state: "dev",
    Icon: EyeIcon,
  },
  {
    name: "Sleep",
    domain: "Sleep & circadian rhythm",
    state: "dev",
    Icon: MoonIcon,
  },
  {
    name: "Metabolic",
    domain: "Weight & metabolism",
    state: "dev",
    Icon: ScaleIcon,
  },
];

function CoverageVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-3-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/65" />

      <div className="relative flex h-full flex-col justify-center gap-5 p-7 md:p-9">
        {/* Active row label */}
        <div
          className="flex items-baseline justify-between"
          style={{
            animation: "fadeUp 500ms ease-out 100ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <p className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-brand-700">
            Active · 02
          </p>
          <span aria-hidden className="h-px flex-1 ml-3 self-center bg-ink/12" />
        </div>

        {/* Active modules — 2 cards in a row */}
        <ul className="grid grid-cols-2 gap-3">
          {MODULES.filter((m) => m.state === "active").map((m, i) => (
            <ModuleTile
              key={m.name}
              module={m}
              delayMs={260 + i * 140}
              playState={playState}
            />
          ))}
        </ul>

        {/* In-dev row label */}
        <div
          className="mt-2 flex items-baseline justify-between"
          style={{
            animation: "fadeUp 500ms ease-out 800ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <p className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink-muted">
            In development · 04
          </p>
          <span aria-hidden className="h-px flex-1 ml-3 self-center bg-ink/12" />
        </div>

        {/* In-dev modules — 2x2 grid of dashed tiles */}
        <ul className="grid grid-cols-2 gap-3">
          {MODULES.filter((m) => m.state === "dev").map((m, i) => (
            <ModuleTile
              key={m.name}
              module={m}
              delayMs={980 + i * 140}
              playState={playState}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function ModuleTile({
  module,
  delayMs,
  playState,
}: {
  module: Module;
  delayMs: number;
  playState: "running" | "paused";
}) {
  const Icon = module.Icon;
  const isActive = module.state === "active";

  return (
    <li
      className={`relative overflow-hidden rounded-[14px] px-3.5 py-3 ${
        isActive
          ? "border border-ink/[0.08] bg-white shadow-[0_8px_22px_-14px_rgba(20,8,2,0.22)]"
          : "border border-dashed border-ink/25 bg-white/55"
      }`}
      style={{
        animation: `fadeUp 500ms ease-out ${delayMs}ms forwards`,
        animationPlayState: playState,
        opacity: 0,
      }}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            isActive
              ? "bg-brand-600/12 text-brand-700"
              : "bg-ink/[0.06] text-ink-muted"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p
            className={`font-serif text-[14px] leading-tight tracking-tight ${
              isActive ? "text-ink" : "text-ink-soft"
            } md:text-[15px]`}
          >
            {module.name}
          </p>
          <p
            className={`mt-1 text-[11px] leading-snug ${
              isActive ? "text-ink-muted" : "text-ink-muted/85"
            }`}
          >
            {module.domain}
          </p>
        </div>
        {isActive ? (
          <span
            aria-hidden
            className="ml-auto mt-1 block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              backgroundColor: "#34C759",
              boxShadow: "0 0 0 2px rgba(52, 199, 89, 0.18)",
            }}
          />
        ) : (
          <span
            aria-hidden
            className="ml-auto mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-ink-muted/40"
            style={{
              animation: "knobPulse 2400ms cubic-bezier(0.22, 0.61, 0.36, 1) infinite",
              animationPlayState: playState,
            }}
          />
        )}
      </div>
    </li>
  );
}

/* ── Module icons ──────────────────────────────────────────────────────── */

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 4c-7 0-12 4-12 10 0 1.3.3 2.4.9 3.2" />
      <path d="M16 4c0 7-4 12-10 12" />
      <path d="M10 10c2 0 4 1 6 3" />
    </svg>
  );
}

function WaveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 12c1.5 0 1.5-4 3-4s1.5 4 3 4 1.5-6 3-6 1.5 6 3 6 1.5-2 3-2" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 16.5S3 12.2 3 7.6A3.6 3.6 0 0 1 10 5.8 3.6 3.6 0 0 1 17 7.6c0 4.6-7 8.9-7 8.9Z" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z" />
      <circle cx="10" cy="10" r="2.4" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15.5 12.4A6.5 6.5 0 0 1 7.6 4.5a6.5 6.5 0 1 0 7.9 7.9Z" />
    </svg>
  );
}

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="6" width="14" height="10" rx="1.6" />
      <path d="M7 10.5c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5" />
    </svg>
  );
}

/* ── Row data ──────────────────────────────────────────────────────────── */

const ROWS: Row[] = [
  {
    eyebrow: "01. White-label",
    heading: "Same coach. Any brand.",
    body: (
      <>
        Chronilogix ships as a branded experience inside a partner&rsquo;s
        app, employer benefit, or wellness platform. Your chrome on top;
        the same MI-trained coach underneath. The coaching layer without
        building clinical IP from scratch.
      </>
    ),
    Visual: WhiteLabelVisual,
  },
  {
    eyebrow: "02. Coverage",
    heading: "Two coaches today. Four chronic modules in development.",
    body: (
      <>
        Roni covers diabetes and chronic care. Millie covers anxiety,
        stress, and mood. Four additional modules are in development —
        including a diabetic retinopathy screener — and ship into the
        same coaching surface members already use.
      </>
    ),
    Visual: CoverageVisual,
  },
];
