"use client";

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Profile = {
  key: string;
  label: string;
  intro: string;
  headline: [string, string];
  description: string;
  extended?: string;
  // Small eyebrow label above the `extended` paragraph so a follow-on
  // block (e.g. Solida Health under Underserved communities) reads as
  // a deliberate sub-section instead of a runaway continuation.
  extendedLabel?: string;
  pull?: { lead: string; caption: string };
};

const PROFILES: Profile[] = [
  {
    key: "cant-afford",
    label: "Can't afford care",
    intro: "Cost barrier members",
    headline: ["Clinical quality coaching.", "Without the copay."],
    description:
      "High deductibles and out of pocket costs turn behavioral health into a luxury. Coaching, accountability support, and the behavioral reinforcement that actually sustains long term change is rarely covered by insurance. Chronilogix delivers clinical quality coaching at a fraction of the cost of live care, with no copay and no scheduling barrier.",
  },
  {
    key: "off-hours",
    label: "Off hours workers",
    intro: "Night shift, first responders, hospitality",
    headline: ["Care at 3 AM.", "Not just 3 PM."],
    description:
      "Night shift nurses. First responders. Transportation and manufacturing workers. Hospitality staff. These are people who need support at 3 AM, not 3 PM. The traditional system was not built for their schedule. Chronilogix was.",
    pull: { lead: "Anytime", caption: "Available when shift work is" },
  },
  {
    key: "wont-talk",
    label: "Won't talk to a clinician",
    intro: "Members who avoid live providers",
    headline: ["Honest where", "live care can't reach."],
    description:
      "Fear of judgment. Cultural stigma. The feeling that a stranger across a desk cannot be trusted with the most honest version of your struggle. These are real barriers that turn millions of people away from care entirely. In a non judgmental AI environment, many people are more honest than they have ever been with a live provider. That honesty is where change begins.",
  },
  {
    key: "fallen-through",
    label: "Fallen through the cracks",
    intro: "Post discharge and post therapy members",
    headline: ["Present long after", "the clinic goes silent."],
    description:
      "After discharge. After the therapy course ends. After the motivation from the diagnosis scare fades. These are the moments when traditional care goes silent. Chronilogix stays present. Not as a crisis line, but as the consistent coaching voice that remains long after the clinical intervention has closed.",
  },
  {
    key: "underserved",
    label: "Underserved communities",
    intro: "Members standard programs don't reach",
    headline: ["Standard programs miss.", "Chronilogix adapts."],
    description:
      "Hispanic men face a 64% higher rate of diabetes, yet represent just 2% of participants in the CDC's National Diabetes Prevention Program. Standard coaching fails these members linguistically, culturally, and financially. Chronilogix's MI based approach is built to adapt to cultural context, dietary norms, literacy levels, and behavioral readiness, not just translate the same program into another language.",
    extendedLabel: "Solida Health",
    extended:
      "That is why Chronilogix created Solida Health, a Hispanic and Latin division that runs as its own operation with the same commitment to the underlying clinical IP. Dr. Renata B, its president and a practicing physician, health coach, and cultural voice, has spent years delivering culturally attuned coaching on weight, body image, food, and movement to thousands of Hispanic men and women.",
    pull: { lead: "64%", caption: "Higher diabetes rate for Hispanic men" },
  },
];

const STEP_COUNT = PROFILES.length;
// Auto-advance dwell per profile — matches the home page persona section
// (12 s lands between a 250-wpm careful read and a 400-wpm skim). Used only
// in the non-pinned (mobile / reduced-motion) fallback.
const DWELL_MS = 12000;
// Scroll distance the pinned section consumes per step. The section pins to
// the viewport and each step gets this much scroll before the next takes
// over, so the visitor can't skip past a step without seeing it.
const STEP_SCROLL_VH = 90;

export function HiwAudience() {
  const [active, setActive] = useState(0);
  // Continuous rail position (0 … STEP_COUNT-1) so the fill + knob glide with
  // the scrollbar; `active` is the rounded step that drives labels + content.
  const [railPos, setRailPos] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // The tall spacer that provides the scroll distance; its offset maps to the
  // active step while the inner content stays pinned.
  const scrollWrapRef = useRef<HTMLDivElement>(null);
  // Once the visitor takes manual control of the rail, auto-advance steps
  // back. Their click is the strongest signal that they're reading on
  // their own pace; the timer should not yank focus away again. (Fallback
  // path only — when pinned, the scrollbar is the control.)
  const userTookOverRef = useRef(false);

  // On desktop we pin the section and scrub steps with the scrollbar. On
  // small screens (single-column) or when the visitor prefers reduced motion,
  // fall back to the tap + auto-advance rail so nothing gets scroll-jacked.
  const pinned = isDesktop && !reducedMotion;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Track the lg breakpoint — the pinned layout only applies where the
  // two-column rail + panel exists.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    // Resize fallback: matchMedia's `change` only fires when the breakpoint
    // is crossed, so a first mount at a transient 0/narrow width could latch
    // the wrong value and never recover. A resize listener re-checks.
    window.addEventListener("resize", apply);
    return () => {
      mq.removeEventListener?.("change", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  // ── Pinned scroll driver ────────────────────────────────────────────
  // Map how far the tall spacer has scrolled past the top of the viewport to
  // a fractional step position. rAF-throttled so it stays smooth.
  useEffect(() => {
    if (!pinned) return;
    const wrap = scrollWrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const total = wrap.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const top = wrap.getBoundingClientRect().top;
      const scrolled = Math.min(Math.max(-top, 0), total);
      const progress = scrolled / total; // 0 … 1 across the whole section
      const pos = progress * (STEP_COUNT - 1);
      setRailPos(pos);
      setActive(Math.round(pos));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned]);

  // ── Fallback path (mobile / reduced motion) ─────────────────────────
  // Hold the auto-advance until the section is actually being read.
  useEffect(() => {
    if (pinned) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pinned]);

  // Auto-advance timer. Stops at the last profile and once user clicks.
  useEffect(() => {
    if (pinned) return;
    if (reducedMotion || !inView) return;
    if (userTookOverRef.current) return;
    if (active >= STEP_COUNT - 1) return;
    const t = setTimeout(() => setActive((a) => a + 1), DWELL_MS);
    return () => clearTimeout(t);
  }, [active, inView, reducedMotion, pinned]);

  const handleSelect = (idx: number) => {
    if (pinned) {
      // Jump the page to the scroll offset that centers this step.
      const wrap = scrollWrapRef.current;
      if (!wrap) return;
      const total = wrap.offsetHeight - window.innerHeight;
      const wrapTop = window.scrollY + wrap.getBoundingClientRect().top;
      window.scrollTo({
        top: wrapTop + (idx / (STEP_COUNT - 1)) * total,
        behavior: reducedMotion ? "auto" : "smooth",
      });
      return;
    }
    userTookOverRef.current = true;
    setActive(idx);
  };

  const profile = PROFILES[active];
  const autoAdvancing =
    !pinned &&
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

      {/* Tall spacer supplies the scroll distance when pinned; the inner
          block sticks to the viewport and swaps steps as it scrolls by. On
          the fallback path this is a plain wrapper in normal flow. */}
      <div
        ref={scrollWrapRef}
        className={pinned ? "relative" : ""}
        style={pinned ? { height: `${STEP_COUNT * STEP_SCROLL_VH}vh` } : undefined}
      >
        <div
          className={
            pinned
              ? "sticky top-0 flex h-screen items-center overflow-hidden"
              : "relative"
          }
        >
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

          <div
            className={`container-page w-full ${
              pinned ? "py-0" : "py-24 md:py-28 lg:py-32"
            }`}
          >
            {/* Tab rail + panel — the home persona pattern. */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[300px_1fr] lg:gap-16 xl:grid-cols-[340px_1fr] xl:gap-24">
              <ProfileTabs
                active={active}
                railPos={railPos}
                pinned={pinned}
                onSelect={handleSelect}
                reducedMotion={reducedMotion}
                autoAdvancing={autoAdvancing}
              />
              {/* Panel animates to the active tab's real content height so the
                  section is exactly as tall as the current step needs. */}
              <AudiencePanel profile={profile} reducedMotion={reducedMotion} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileTabs({
  active,
  railPos,
  pinned,
  onSelect,
  reducedMotion,
  autoAdvancing,
}: {
  active: number;
  railPos: number;
  pinned: boolean;
  onSelect: (i: number) => void;
  reducedMotion: boolean;
  autoAdvancing: boolean;
}) {
  // Progress rail math — each row gets an equal slice of the list
  // height; track spans first-row center → last-row center; fill grows
  // top-down to the active row's center. When pinned, the rail rides the
  // continuous `railPos` so it glides in lockstep with the scrollbar;
  // otherwise it sits on the discrete `active` step.
  const segment = 100 / STEP_COUNT;
  const trackTop = segment / 2;
  const trackHeight = 100 - segment;
  const pos = pinned ? railPos : active;
  const fillHeight =
    STEP_COUNT > 1 ? (pos / (STEP_COUNT - 1)) * trackHeight : 0;
  const knobTop = trackTop + segment * pos;

  const fillRef = useRef<HTMLSpanElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);

  // Drive the fill height and knob position with WAAPI so the visual
  // progress is smooth and linear across the entire dwell. Fallback path
  // only — when pinned, the rail is positioned directly from `railPos`.
  useEffect(() => {
    if (pinned || !autoAdvancing) return;
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
  }, [active, autoAdvancing, pinned, segment, trackHeight, trackTop]);

  return (
    <nav
      aria-label="Member profiles"
      className={
        pinned
          ? "relative lg:self-start"
          : "relative lg:sticky lg:top-28 lg:self-start"
      }
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

// Measures the active panel's natural height and animates the wrapper to
// it, so the section is exactly as tall as the current tab needs. Overflow
// is clipped so a grow (short → tall tab) reads as a clean top-down reveal
// instead of the new content briefly overlapping the section below.
function AudiencePanel({
  profile,
  reducedMotion,
}: {
  profile: Profile;
  reducedMotion: boolean;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  // Measure synchronously on tab change so the height transition runs from
  // the previous value rather than flashing the new content unclipped.
  useIsomorphicLayoutEffect(() => {
    if (innerRef.current) setHeight(innerRef.current.offsetHeight);
  }, [profile.key]);

  // Re-measure on responsive reflow (e.g. the description rewrapping).
  useEffect(() => {
    const el = innerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className="min-w-0 overflow-hidden"
      style={{
        height: height ?? undefined,
        transition: reducedMotion
          ? undefined
          : "height 480ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      <div ref={innerRef}>
        <ProfilePanel profile={profile} reducedMotion={reducedMotion} />
      </div>
    </div>
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
        className="text-[13px] font-medium tracking-tight text-brand-700"
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
        className="mt-5 max-w-2xl body-prose md:mt-6"
        style={{
          opacity: 0,
          animation: reducedMotion
            ? "none"
            : "wordReveal 600ms cubic-bezier(0.22, 0.61, 0.36, 1) 540ms forwards",
        }}
      >
        {profile.description}
      </p>

      {profile.extended ? (
        <div
          className="mt-6 max-w-2xl md:mt-7"
          style={{
            opacity: 0,
            animation: reducedMotion
              ? "none"
              : "wordReveal 600ms cubic-bezier(0.22, 0.61, 0.36, 1) 700ms forwards",
          }}
        >
          {profile.extendedLabel ? (
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-brand-700">
              {profile.extendedLabel}
            </p>
          ) : null}
          <p
            className={`body-prose text-ink-soft ${profile.extendedLabel ? "mt-3" : ""}`}
          >
            {profile.extended}
          </p>
        </div>
      ) : null}

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
      className="mt-10 flex items-baseline gap-5 border-t border-ink/10 pt-6 md:mt-12"
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
