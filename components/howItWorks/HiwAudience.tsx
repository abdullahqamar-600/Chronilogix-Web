"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";

type Profile = {
  key: string;
  label: string;
  intro: string;
  headline: [string, string];
  description: string;
  pull?: { lead: string; caption: string };
};

const PROFILES: Profile[] = [
  {
    key: "cant-afford",
    label: "Can't afford care",
    intro: "Cost-barrier members",
    headline: ["Clinical-quality coaching.", "Without the copay."],
    description:
      "High deductibles and out-of-pocket costs turn behavioral health into a luxury. Coaching, accountability support, and the behavioral reinforcement that actually sustains long-term change is rarely covered by insurance. Chronilogix delivers clinical-quality coaching at a fraction of the cost of live care — with no copay and no scheduling barrier.",
  },
  {
    key: "off-hours",
    label: "Off-hours workers",
    intro: "Night shift, first responders, hospitality",
    headline: ["Care at 3 AM.", "Not just 3 PM."],
    description:
      "Night-shift nurses. First responders. Transportation and manufacturing workers. Hospitality staff. These are people who need support at 3 AM — not 3 PM. The traditional system was not built for their schedule. Chronilogix was.",
    pull: { lead: "24/7", caption: "Available when shift work is" },
  },
  {
    key: "wont-talk",
    label: "Won't talk to a clinician",
    intro: "Members who avoid live providers",
    headline: ["Honest where", "live care can't reach."],
    description:
      "Fear of judgment. Cultural stigma. The feeling that a stranger across a desk cannot be trusted with the most honest version of your struggle. These are real barriers that turn millions of people away from care entirely. In a non-judgmental AI environment, many people are more honest than they have ever been with a live provider. That honesty is where change begins.",
  },
  {
    key: "fallen-through",
    label: "Fallen through the cracks",
    intro: "Post-discharge & post-therapy members",
    headline: ["Present long after", "the clinic goes silent."],
    description:
      "After discharge. After the therapy course ends. After the motivation from the diagnosis scare fades. These are the moments when traditional care goes silent. Chronilogix stays present — not as a crisis line, but as the consistent coaching voice that remains long after the clinical intervention has closed.",
  },
  {
    key: "underserved",
    label: "Underserved communities",
    intro: "Members standard programs don't reach",
    headline: ["Standard programs miss.", "Chronilogix adapts."],
    description:
      "Hispanic men face a 64% higher rate of diabetes, yet represent just 2% of participants in the CDC's National Diabetes Prevention Program. Standard coaching fails these members linguistically, culturally, and financially. Chronilogix's MI-based approach is built to adapt to cultural context, dietary norms, literacy levels, and behavioral readiness — not just translate the same program into another language.",
    pull: { lead: "64%", caption: "Higher diabetes rate · Hispanic men" },
  },
];

const STEP_COUNT = PROFILES.length;
// Auto-advance dwell per profile — matches the home page persona section
// (12 s lands between a 250-wpm careful read and a 400-wpm skim).
const DWELL_MS = 12000;

export function HiwAudience() {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // Once the visitor takes manual control of the rail, auto-advance steps
  // back. Their click is the strongest signal that they're reading on
  // their own pace; the timer should not yank focus away again.
  const userTookOverRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Hold the auto-advance until the section is actually being read.
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

  // Auto-advance timer. Stops at the last profile and once user clicks.
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

  const profile = PROFILES[active];
  const autoAdvancing =
    !reducedMotion &&
    inView &&
    !userTookOverRef.current &&
    active < STEP_COUNT - 1;

  return (
    <section
      ref={sectionRef}
      id="audience"
      aria-labelledby="audience-label"
      className="relative bg-paper-warm"
    >
      <h2 id="audience-label" className="sr-only">
        Who Chronilogix reaches
      </h2>

      {/* Top / bottom edge gradients soften the boundary with adjacent
          full-bleed sections — same treatment as the home persona block. */}
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

      <div className="container-page py-24 md:py-28 lg:py-32">
        {/* Section-level header — sits above the tab rail so the section
            still reads as "Who Chronilogix reaches" before the rail
            unpacks the five member archetypes. */}
        <div className="max-w-3xl">
          <h3
            className="mt-4 max-w-[24ch] font-serif text-section font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Built for the people{" "}
            <span className="text-ink-muted">standard programs keep missing.</span>
          </h3>
          <p className="mt-5 max-w-[58ch] body-prose">
            Chronilogix wasn&rsquo;t designed for the already-engaged
            wellness consumer. It was built for the members traditional
            care fails to reach — and for the organizations trying to
            reach them.
          </p>
        </div>

        {/* Tab rail + panel — the home persona pattern. */}
        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-[300px_1fr] lg:gap-16 xl:grid-cols-[340px_1fr] xl:gap-24">
          <ProfileTabs
            active={active}
            onSelect={handleSelect}
            reducedMotion={reducedMotion}
            autoAdvancing={autoAdvancing}
          />
          <div className="min-w-0">
            <ProfilePanel
              profile={profile}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileTabs({
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
  // Progress rail math — each row gets an equal slice of the list
  // height; track spans first-row center → last-row center; fill grows
  // top-down to the active row's center.
  const segment = 100 / STEP_COUNT;
  const trackTop = segment / 2;
  const trackHeight = 100 - segment;
  const fillHeight =
    STEP_COUNT > 1 ? (active / (STEP_COUNT - 1)) * trackHeight : 0;
  const knobTop = trackTop + segment * active;

  const fillRef = useRef<HTMLSpanElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);

  // Drive the fill height and knob position with WAAPI so the visual
  // progress is smooth and linear across the entire dwell.
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
      aria-label="Member profiles"
      className="relative lg:sticky lg:top-28 lg:self-start"
    >
      <ul className="relative">
        {/* Quiet base track */}
        <span
          aria-hidden
          className="absolute left-0 block w-px bg-ink/12"
          style={{
            top: `${trackTop}%`,
            height: `${trackHeight}%`,
          }}
        />
        {/* Progress fill */}
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
        {/* Knob with pulse */}
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
            <span
              className="relative block h-[9px] w-[9px] rounded-full bg-brand-accent"
              style={{
                boxShadow:
                  "0 0 0 3px rgba(255,116,52,0.15), 0 4px 10px -2px rgba(255,116,52,0.45)",
              }}
            />
          </span>
        </span>
        {PROFILES.map((p, i) => {
          const isActive = i === active;
          return (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={isActive ? "true" : undefined}
                className="group relative flex w-full items-center rounded-md py-3.5 pl-6 pr-2 text-left transition-colors duration-200 ease-out motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-warm md:py-4"
              >
                <span
                  className={`text-[15px] font-medium leading-snug md:text-[16px] ${
                    isActive
                      ? "text-ink"
                      : "text-ink/45 group-hover:text-ink/75"
                  }`}
                  style={{
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

function ProfilePanel({
  profile,
  reducedMotion,
}: {
  profile: Profile;
  reducedMotion: boolean;
}) {
  return (
    <div key={profile.key} className="flex flex-col">
      {/* Tiny intro line above the headline — matches the home persona
          pattern's "for [audience]" framing. */}
      <p
        className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-700"
        style={{
          opacity: 0,
          animation: reducedMotion
            ? "none"
            : "wordReveal 500ms cubic-bezier(0.22, 0.61, 0.36, 1) 80ms forwards",
        }}
      >
        {profile.intro}
      </p>

      <ProfileHeadline
        lines={profile.headline}
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
        {profile.description}
      </p>

      {profile.pull ? (
        <PullStat
          pull={profile.pull}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </div>
  );
}

function ProfileHeadline({
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

  const BASE_DELAY = 160;
  const STRIDE = 55;
  let idx = 0;

  return (
    <h3 className="mt-5 font-serif text-display font-normal md:mt-6">
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

function PullStat({
  pull,
  reducedMotion,
}: {
  pull: { lead: string; caption: string };
  reducedMotion: boolean;
}) {
  return (
    <div
      className="mt-12 flex items-baseline gap-5 border-t border-ink/10 pt-7 md:mt-14"
      style={{
        opacity: 0,
        animation: reducedMotion
          ? "none"
          : "wordReveal 600ms cubic-bezier(0.22, 1, 0.36, 1) 880ms forwards",
      }}
    >
      <p className="font-serif text-stat-md font-normal text-ink tabular-nums">
        {pull.lead}
      </p>
      <p className="max-w-[28ch] text-[14.5px] font-medium leading-snug text-ink-soft md:text-[15px]">
        {pull.caption}
      </p>
    </div>
  );
}
