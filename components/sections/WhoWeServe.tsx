"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";

type Metric = {
  lead: string;
  caption: string;
  comparison: string;
};

type Signal = {
  label: string;
  body: string;
};

type Persona = {
  key: string;
  label: string;
  intro: string;
  headline: [string, string];
  description: string;
  metrics?: Metric[];
  signals?: Signal[];
};

const PERSONAS: Persona[] = [
  {
    key: "employers",
    label: "Employers",
    intro: "For HR leaders & benefits owners",
    headline: ["Reach every employee.", "Not just the few who ask."],
    description:
      "Reach the roughly 250 in 1,000 employees living with chronic conditions before they become high-cost claims. Chronilogix lowers PEPM costs, improves adherence, and reduces sick days, saving an estimated $300 to $700 per engaged member, per year.",
    metrics: [
      {
        lead: "8×",
        caption: "Engagement vs. typical EAPs",
        comparison: "3% utilization → 25% engaged",
      },
      {
        lead: "~50%",
        caption: "Lower cost than live coaching",
        comparison: "$60–70 PMPM → $20–30 PMPM",
      },
      {
        lead: "24/7",
        caption: "Available the moment it's needed",
        comparison: "Business hours → every hour",
      },
    ],
  },
  {
    key: "brokers",
    label: "Benefits Brokers",
    intro: "For benefits consultants & brokers",
    headline: ["Defensible ROI.", "Not another point solution."],
    description:
      "Chronilogix gives brokers a story that ends in measurable cost-curve impact, not a fragmented add-on. AI health coaching moves clients upstream on the spend curve, differentiates beyond plan design, and retains self-funded accounts through proactive, continuous member engagement.",
    signals: [
      {
        label: "Defensible ROI in renewal conversations",
        body: "Not a feature to demo. A measurable shift in the cost curve clients can put in front of their CFO.",
      },
      {
        label: "Upstream on the spend curve",
        body: "Members engaged weeks before they show up in claims data, replacing reactive triage with proactive outreach.",
      },
      {
        label: "Stickier self-funded accounts",
        body: "Value-led retention beyond plan design: the book of business that doesn't compete on premium alone.",
      },
    ],
  },
  {
    key: "health-plans",
    label: "Health Plans & ACOs",
    intro: "For health plans & accountable care organizations",
    headline: ["Claims mitigation,", "before the claim."],
    description:
      "A first-line claims-mitigation strategy. Chronilogix engages members before issues escalate, replacing up to 70% of routine human coaching at roughly one-twentieth the cost, while improving access and member experience.",
    metrics: [
      {
        lead: "70%",
        caption: "Of routine coaching, replaceable",
        comparison: "Human coach required → Chronilogix covers",
      },
      {
        lead: "1/20",
        caption: "Of live-coaching cost",
        comparison: "Baseline → ~5% of baseline",
      },
      {
        lead: "Pre-",
        caption: "Engagement, before escalation",
        comparison: "Reactive triage → proactive outreach",
      },
    ],
  },
  {
    key: "wellness-platforms",
    label: "Wellness Platforms",
    intro: "For consumer & enterprise wellness apps",
    headline: ["The engagement layer", "your platform is missing."],
    description:
      "Embed Chronilogix as a white-labeled coach to drive longer sessions, deeper retention, and more upgrade moments, without expanding staff or building clinical IP in-house.",
    signals: [
      {
        label: "Longer sessions, deeper retention",
        body: "An engagement layer designed for return visits: more upgrade moments without re-acquiring users.",
      },
      {
        label: "White-labeled by design",
        body: "Your brand stays the surface; Chronilogix runs the coaching loop quietly underneath.",
      },
      {
        label: "No new staff, no clinical IP to build",
        body: "Skip the years of methodology work and the headcount that comes with it. Plug in, ship.",
      },
    ],
  },
  {
    key: "underserved",
    label: "Underserved & Uninsured",
    intro: "For public-health & community-care programs",
    headline: ["Care without the gate.", "Reachable at population scale."],
    description:
      "For people who often have no support alternative at all (the uninsured, underserved communities, and those who cannot afford repeated sessions), Chronilogix is an accessible, judgment-free entry point to behavioral support at population scale.",
    signals: [
      {
        label: "An entry point where there isn't one",
        body: "For the uninsured and underserved, often the only behavioral support available at all.",
      },
      {
        label: "Judgment-free, no scheduling, no cost barrier",
        body: "Help that arrives in the moment, on a phone, without the friction that turns people away.",
      },
      {
        label: "Population-scale reach",
        body: "Picks up where staffed community programs cap out. Every member, every hour, every language.",
      },
    ],
  },
];

const STEP_COUNT = PERSONAS.length;
// Auto-advance dwell per persona. ~80 words of readable content per panel
// (header bar, headline, description, three argument rows). 12 s lands
// between a 250-wpm careful read and a 400-wpm skim, so the rail acts as
// a pacing aid without overtaking the reader.
const DWELL_MS = 12000;

export function WhoWeServe() {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // Once the visitor takes manual control of the rail, auto-advance steps
  // back. Their click is the strongest signal that they're reading on
  // their own pace; the timer should not yank focus away again.
  const userTookOverRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Hold the auto-advance until the section is actually being read.
  // Visitors who land mid-page should not sprint past personas before
  // they've seen them.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-advance timer. Restarts whenever `active` or `inView` changes.
  // Stops at the last persona — auto-rotation is a guided tour, not an
  // endless carousel. Also stops once the user has clicked a tab.
  useEffect(() => {
    if (reducedMotion || !inView) return;
    if (userTookOverRef.current) return;
    if (active >= STEP_COUNT - 1) return;
    const t = setTimeout(() => setActive((a) => a + 1), DWELL_MS);
    return () => clearTimeout(t);
  }, [active, inView, reducedMotion]);

  const handleSelect = (idx: number) => {
    userTookOverRef.current = true;
    setActive(idx);
  };

  const persona = PERSONAS[active];
  const autoAdvancing =
    !reducedMotion &&
    inView &&
    !userTookOverRef.current &&
    active < STEP_COUNT - 1;

  return (
    <section
      ref={sectionRef}
      id="who-we-serve"
      aria-labelledby="who-we-serve-label"
      className="relative bg-paper-warm"
    >
      <h2 id="who-we-serve-label" className="sr-only">
        Who we serve
      </h2>

      {/* Lighter-cream gradient at the top edge — softens the boundary
          with the Outcome section above. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20"
        style={{
          height: "min(180px, 18vh)",
          background:
            "linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Lighter-cream gradient at the bottom edge — softens the boundary
          with the next section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
        style={{
          height: "min(180px, 18vh)",
          background:
            "linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)",
        }}
      />

      <div className="container-page py-24 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[300px_1fr] lg:gap-16 xl:grid-cols-[340px_1fr] xl:gap-24">
          <PersonaTabs
            active={active}
            onSelect={handleSelect}
            reducedMotion={reducedMotion}
            autoAdvancing={autoAdvancing}
          />
          <div className="min-w-0">
            <PersonaPanel
              persona={persona}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonaTabs({
  active,
  onSelect,
  reducedMotion,
  autoAdvancing,
}: {
  active: number;
  onSelect: (i: number) => void;
  reducedMotion: boolean;
  autoAdvancing: boolean;
}) {
  // Progress rail math. Each row occupies an equal slice of the list
  // height; the rail track spans from the center of the first row to the
  // center of the last row, and the gradient fill grows top-down to the
  // center of the currently active row.
  const segment = 100 / STEP_COUNT;
  const trackTop = segment / 2;
  const trackHeight = 100 - segment;
  const fillHeight =
    STEP_COUNT > 1 ? (active / (STEP_COUNT - 1)) * trackHeight : 0;
  const knobTop = trackTop + segment * active;

  const fillRef = useRef<HTMLSpanElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);

  // When the rail is auto-advancing, drive the fill height and knob
  // position with the Web Animations API so the visual progress is
  // smooth and linear across the entire dwell, not a discrete jump on
  // each step. Cancel cleanly on tab change so user clicks snap and a
  // fresh dwell animation starts from the new resting position.
  useEffect(() => {
    if (!autoAdvancing) return;
    const fillEl = fillRef.current;
    const knobEl = knobRef.current;
    if (!fillEl || !knobEl) return;

    const startFill = (active / (STEP_COUNT - 1)) * trackHeight;
    const endFill = ((active + 1) / (STEP_COUNT - 1)) * trackHeight;
    const startKnob = trackTop + segment * active;
    const endKnob = trackTop + segment * (active + 1);

    const fillAnim = fillEl.animate(
      [{ height: `${startFill}%` }, { height: `${endFill}%` }],
      { duration: DWELL_MS, easing: "linear", fill: "forwards" },
    );
    const knobAnim = knobEl.animate(
      [{ top: `${startKnob}%` }, { top: `${endKnob}%` }],
      { duration: DWELL_MS, easing: "linear", fill: "forwards" },
    );

    return () => {
      fillAnim.cancel();
      knobAnim.cancel();
    };
  }, [active, autoAdvancing, segment, trackHeight, trackTop]);

  return (
    <nav
      aria-label="Who we serve"
      className="relative lg:sticky lg:top-28 lg:self-start"
    >
      <ul className="relative">
        {/* Track — quiet base line aligned to the text centers, top to
            bottom of the list. Lives one pixel left of the labels so it
            reads as a margin marker, not a column edge. */}
        <span
          aria-hidden
          className="absolute left-0 block w-px bg-ink/12"
          style={{
            top: `${trackTop}%`,
            height: `${trackHeight}%`,
          }}
        />
        {/* Fill — the progress indicator itself. Sits centered on the
            track, wider, with a vertical gradient and a soft brand glow.
            Height is driven by the dwell animation when auto-advancing;
            otherwise the inline value (the static resting height for the
            current persona) takes over. */}
        <span
          ref={fillRef}
          aria-hidden
          className="absolute left-[-1.5px] block w-[4px] rounded-full"
          style={{
            top: `${trackTop}%`,
            height: `${fillHeight}%`,
            background:
              "linear-gradient(180deg, #FFB088 0%, #FF7434 55%, #E45A1C 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,116,52,0.08), 0 6px 18px -6px rgba(255,116,52,0.5)",
          }}
        />
        {/* Knob — a brighter dot resting at the active row's center so
            even at active=0, when the fill has no height, the rail still
            anchors a visible marker. A soft brand-orange ring pulses out
            from the knob continuously, drawing the eye to "you are here"
            without nagging. Position moves linearly with the dwell. */}
        <span
          ref={knobRef}
          aria-hidden
          className="pointer-events-none absolute left-[1px]"
          style={{
            top: `${knobTop}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="relative block">
            {/* The pulse ring — rendered behind the solid knob. */}
            <span
              aria-hidden
              className="knob-pulse absolute left-1/2 top-1/2 block h-[9px] w-[9px] rounded-full"
              style={{
                backgroundColor: "#FF7434",
                animation: reducedMotion
                  ? "none"
                  : "knobPulse 2400ms cubic-bezier(0.22, 0.61, 0.36, 1) infinite",
              }}
            />
            {/* The solid knob. */}
            <span
              className="relative block h-[9px] w-[9px] rounded-full bg-brand-accent"
              style={{
                boxShadow:
                  "0 0 0 3px rgba(255,116,52,0.15), 0 4px 10px -2px rgba(255,116,52,0.45)",
              }}
            />
          </span>
        </span>
        {PERSONAS.map((p, i) => {
          const isActive = i === active;
          return (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={isActive ? "true" : undefined}
                className="group relative flex w-full items-center py-3.5 pl-6 pr-2 text-left md:py-4"
              >
                <span
                  className="text-[15px] font-medium leading-snug md:text-[16px]"
                  style={{
                    color: isActive
                      ? "rgba(15,20,25,0.95)"
                      : "rgba(15,20,25,0.48)",
                    transition: reducedMotion
                      ? "none"
                      : "color 300ms ease-out",
                  }}
                >
                  {p.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function PersonaPanel({
  persona,
  reducedMotion,
}: {
  persona: Persona;
  reducedMotion: boolean;
}) {
  return (
    <div key={persona.key} className="flex flex-col">
      <PersonaHeadline
        lines={persona.headline}
        reducedMotion={reducedMotion}
      />

      <p
        className="mt-6 max-w-2xl body-prose md:mt-8"
        style={{
          opacity: 0,
          animation: reducedMotion
            ? "none"
            : "wordReveal 600ms cubic-bezier(0.22, 0.61, 0.36, 1) 540ms forwards",
        }}
      >
        {persona.description}
      </p>

      {persona.metrics?.length ? (
        <MetricsStrip
          metrics={persona.metrics}
          reducedMotion={reducedMotion}
        />
      ) : null}

      {persona.signals?.length ? (
        <SignalsList
          signals={persona.signals}
          reducedMotion={reducedMotion}
        />
      ) : null}

      <a
        href="#book-a-demo"
        className="group/cta btn-primary mt-12 w-fit md:mt-14"
        style={{
          opacity: 0,
          animation: reducedMotion
            ? "none"
            : "wordReveal 500ms cubic-bezier(0.22, 1, 0.36, 1) 980ms forwards",
        }}
      >
        Talk to our team
        <span
          aria-hidden
          className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
        >
          <ArrowRight />
        </span>
      </a>
    </div>
  );
}

function PersonaHeadline({
  lines,
  reducedMotion,
}: {
  lines: [string, string];
  reducedMotion: boolean;
}) {
  const wordsByLine = useMemo(
    () => lines.map((line) => line.split(" ")),
    [lines],
  );

  const BASE_DELAY = 120;
  const STRIDE = 55;
  let idx = 0;

  return (
    <h3 className="text-display font-serif font-normal">
      {wordsByLine.map((words, li) => (
        <Fragment key={li}>
          {words.map((word, wi) => {
            const delay = BASE_DELAY + idx * STRIDE;
            idx += 1;
            const lineColor = li === 0 ? "#0F1419" : "#5B6470";
            return (
              <Fragment key={wi}>
                <span
                  className="inline-block"
                  style={
                    reducedMotion
                      ? { color: lineColor, opacity: 1 }
                      : {
                          color: lineColor,
                          opacity: 0.12,
                          filter: "blur(3.5px)",
                          animation: `wordReveal 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms forwards`,
                          willChange: "filter, opacity",
                        }
                  }
                >
                  {word}
                </span>
                {wi < words.length - 1 && " "}
              </Fragment>
            );
          })}
          {li < wordsByLine.length - 1 && <br />}
        </Fragment>
      ))}
    </h3>
  );
}

const ROMAN = ["I", "II", "III", "IV", "V"];

function MetricsStrip({
  metrics,
  reducedMotion,
}: {
  metrics: Metric[];
  reducedMotion: boolean;
}) {
  const range =
    metrics.length === 1
      ? ROMAN[0]
      : `${ROMAN[0]} — ${ROMAN[metrics.length - 1]}`;
  return (
    <div className="mt-14 md:mt-16">
      <SectionLabel
        eyebrow="By the numbers"
        meta={range}
        reducedMotion={reducedMotion}
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 sm:gap-x-7">
        {metrics.map((m, i) => (
          <MetricColumn
            key={`${m.lead}-${i}`}
            metric={m}
            index={i}
            total={metrics.length}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}

function MetricColumn({
  metric,
  index,
  total,
  reducedMotion,
}: {
  metric: Metric;
  index: number;
  total: number;
  reducedMotion: boolean;
}) {
  const enterDelay = 720 + index * 120;
  const underlineDelay = enterDelay + 220;
  const isFirst = index === 0;
  const numeral = ROMAN[index] ?? String(index + 1);

  // Split the comparison into before / after so the argument shape reads
  // typographically: muted before-state → brand arrow → resolved after-state.
  // Falls back to the raw string if no arrow is present.
  const parts = metric.comparison.split(/\s*→\s*/);
  const hasArrow = parts.length === 2;

  return (
    <div
      className={`flex flex-col gap-5 py-6 sm:py-2 ${
        index > 0 ? "border-t border-ink/10 sm:border-t-0" : ""
      } ${!isFirst ? "sm:border-l sm:border-ink/12 sm:pl-7" : ""}`}
      style={{
        opacity: 0,
        animation: reducedMotion
          ? "none"
          : `wordReveal 600ms cubic-bezier(0.22, 1, 0.36, 1) ${enterDelay}ms forwards`,
      }}
    >
      <div className="flex flex-col gap-3">
        <span className="font-serif text-[12px] italic tracking-[0.04em] text-brand-700/80">
          {numeral}.
        </span>
        <div className="relative w-fit pb-3">
          <p className="font-serif text-stat-md font-normal text-ink">
            {metric.lead}
          </p>
          {/* Brand-orange underline that draws in beneath the lead number,
              giving each stat a tactile finish without competing with the
              hairlines between columns. */}
          <span
            aria-hidden
            className="absolute bottom-0 left-0 block h-[2px] origin-left rounded-full"
            style={{
              width: "44%",
              background:
                "linear-gradient(90deg, #FF7434 0%, #FFB088 100%)",
              transform: "scaleX(0)",
              animation: reducedMotion
                ? "none"
                : `barGrow 600ms cubic-bezier(0.22, 1, 0.36, 1) ${underlineDelay}ms forwards`,
            }}
          />
        </div>
      </div>

      <div>
        <p className="text-[15px] font-medium leading-snug text-ink md:text-base">
          {metric.caption}
        </p>
        {hasArrow ? (
          <p className="mt-2 font-serif text-[13px] italic leading-snug">
            <span className="text-ink/45">{parts[0]}</span>
            <span aria-hidden className="mx-1.5 not-italic text-brand-700">
              →
            </span>
            <span className="text-ink-soft">{parts[1]}</span>
          </p>
        ) : (
          <p className="mt-2 font-serif text-[13px] italic text-ink-muted">
            {metric.comparison}
          </p>
        )}
      </div>
    </div>
  );
}

function SignalsList({
  signals,
  reducedMotion,
}: {
  signals: Signal[];
  reducedMotion: boolean;
}) {
  const range =
    signals.length === 1
      ? ROMAN[0]
      : `${ROMAN[0]} — ${ROMAN[signals.length - 1]}`;
  return (
    <div className="mt-14 md:mt-16">
      <SectionLabel
        eyebrow="What changes"
        meta={range}
        reducedMotion={reducedMotion}
      />
      <ol className="mt-8 flex flex-col">
        {signals.map((s, i) => (
          <SignalRow
            key={`${s.label}-${i}`}
            signal={s}
            index={i}
            total={signals.length}
            reducedMotion={reducedMotion}
          />
        ))}
      </ol>
    </div>
  );
}

function SignalRow({
  signal,
  index,
  total,
  reducedMotion,
}: {
  signal: Signal;
  index: number;
  total: number;
  reducedMotion: boolean;
}) {
  const enterDelay = 720 + index * 140;
  const numeral = ROMAN[index] ?? String(index + 1);
  const isLast = index === total - 1;

  return (
    <li
      className={`grid grid-cols-[2.25rem_1fr] gap-x-5 gap-y-2 py-5 md:py-6 ${
        !isLast ? "border-b border-ink/10" : ""
      }`}
      style={{
        opacity: 0,
        animation: reducedMotion
          ? "none"
          : `wordReveal 600ms cubic-bezier(0.22, 1, 0.36, 1) ${enterDelay}ms forwards`,
      }}
    >
      <span className="font-serif text-[15px] italic leading-[1.55] text-brand-700">
        {numeral}.
      </span>
      <p className="text-[17px] font-medium leading-snug text-ink md:text-[18px]">
        {signal.label}
      </p>
      <span aria-hidden />
      <p className="max-w-xl body-quiet">
        {signal.body}
      </p>
    </li>
  );
}

function SectionLabel({
  eyebrow,
  meta,
  reducedMotion,
}: {
  eyebrow: string;
  meta: string;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 border-t border-ink/15 pt-5"
      style={{
        opacity: 0,
        animation: reducedMotion
          ? "none"
          : "wordReveal 500ms cubic-bezier(0.22, 1, 0.36, 1) 640ms forwards",
      }}
    >
      <p className="eyebrow-muted">{eyebrow}</p>
      <p className="font-serif text-[13px] italic text-ink/45">
        {meta}
      </p>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
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
