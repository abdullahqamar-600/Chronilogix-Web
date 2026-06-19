"use client";

// StatementV5 — scroll-driven, two-scene narrative.
//
// Beat 1 (entering the section):
//   Background = bg-image-low saturation (muted, ambient).
//   Only the first half of the heading is visible:
//     "Most chatbots ask, answer, sell, dispense.
//      People don't change like that"
//   The line sits large and centered — the reader has to dwell on
//   the indictment before the answer arrives.
//
// Beat 2 (further scroll):
//   Background cross-fades to the full-saturation BG Image.
//   The second half of the heading reveals:
//     "— Motivational Interviewing is how they do."
//   The four MI process cards (Engage / Focus / Evoke / Plan) +
//   proof line cascade in below.
//
// All of this is one continuous scroll — the section is taller than
// the viewport, and an inner sticky panel orchestrates the reveal
// based on the section's scroll-progress.

import { useEffect, useRef, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

const STEPS = [
  {
    label: "Engage",
    title:
      "Build partnership. Chronilogix earns the right to coach by listening first — open questions and small affirmations in the member's own language, before any agenda. Skip this and everything after feels brittle.",
    Visual: EngageVisual,
    Icon: HandshakeIcon,
  },
  {
    label: "Focus",
    title:
      "Find what matters now. Short summaries keep the conversation honest — the change the member wants, not the one we wish they wanted.",
    Visual: FocusVisual,
    Icon: TargetIcon,
  },
  {
    label: "Evoke",
    title:
      "Draw the motivation out. Reflective listening — MI's workhorse — offers back a precise, sometimes deepened version of what the member just said, so they hear their own thinking out loud. The more change talk, the more change.",
    Visual: EvokeVisual,
    Icon: WaveIcon,
  },
  {
    label: "Plan",
    title:
      "Translate intent into a next step — small, specific, chosen by the member, never prescribed. Planning is earned, not forced.",
    Visual: PlanVisual,
    Icon: CheckCircleIcon,
  },
] as const;

// Trigger-then-play. The cross-fade runs on its own timeline once the
// sticky scene comes into view — no scroll-scrubbing. Beat-1 holds
// briefly, then the bg swap and line-2 reveal play over the rest of
// the runway. Total play duration is wall-clock, not scroll-tied.
const PLAY_DURATION_MS = 1800;
const T_LINE2_START = 0.3;
const T_LINE2_END = 0.9;


export function StatementV5() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [reveal, setReveal] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // One-shot trigger: a single scroll listener watches for the sticky
  // scene to cross the trigger threshold (top edge above 60% of the
  // viewport). On first crossing it locks the trigger, detaches, and
  // kicks off a rAF-driven animation that runs 0 → 1 over
  // PLAY_DURATION_MS. Scrolling past doesn't reverse the animation;
  // scrolling back doesn't restart it.
  useEffect(() => {
    if (reducedMotion) {
      setReveal(1);
      return;
    }
    const el = stickyRef.current;
    if (!el) return;
    let cancelled = false;
    let rafId = 0;
    let started = false;

    const startAnimation = () => {
      if (started) return;
      started = true;
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      const startT = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min((now - startT) / PLAY_DURATION_MS, 1);
        setReveal(t);
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const check = () => {
      if (started) return;
      const rect = el.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.6;
      // Top of the sticky scene has scrolled above the trigger line —
      // fire once.
      if (rect.top < triggerY) startAnimation();
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  // Eased reveal so the cross-fade has a natural in-out shape rather
  // than a linear ramp — feels like a single composed beat instead of
  // a timer winding.
  const eased = easeInOutCubic(reveal);
  const crossFade = clamp01(
    (eased - T_LINE2_START) / (T_LINE2_END - T_LINE2_START),
  );
  const line2Fade = crossFade;

  return (
    <section
      id="statement"
      className="relative"
      style={{ backgroundColor: "#FBF8F4" }}
      aria-label="What is Motivational Interviewing"
    >
      {/* ── Stage 1: Sticky scene (bg cross-fade + heading reveal) ──
          A short runway pins the visual long enough for the user to
          see the trigger-then-play animation, but doesn't force a
          long scroll. Once it enters view, the cross-fade runs on
          its own time (see PLAY_DURATION_MS) and locks. */}
      <div ref={sectionRef} className="relative" style={{ height: "130vh" }}>
        <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden rounded-b-[28px]">
          {/* Background plates cross-fade. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/statement-bg.png"
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
            style={{ opacity: crossFade }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/statement-bg-low.png"
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
            style={{ opacity: 1 - crossFade }}
          />

          {/* Top scrim — dissolves the top of the image into the
              white page above. Starts at solid white at the very
              edge, then fades out quickly so the image is fully
              visible by ~25% down the panel. Headline reads cleanly
              over the soft veil. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[30%]"
            style={{
              background:
                "linear-gradient(180deg, #FBF8F4 0%, rgba(251,248,244,0.7) 25%, rgba(251,248,244,0.3) 60%, rgba(251,248,244,0) 100%)",
            }}
          />

<div className="relative z-10 flex h-full flex-col">
            <div className="container-page flex h-full w-full flex-col justify-start pt-28 md:pt-32 lg:pt-40 xl:pt-48">
              <div className="max-w-5xl">
                {/* Heading — two halves. The first is visible from
                    the start; the second blur-fades in during the
                    cross-fade. */}
                <h2
                  className="max-w-4xl text-section font-serif font-normal text-ink"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  <span className="inline">
                    Most healthcare chatbots ask, answer, sell or
                    dispense. People don&rsquo;t change like this.
                  </span>
                  <span
                    className="mt-3 block md:mt-4"
                    style={{
                      opacity: line2Fade,
                      filter: `blur(${(1 - line2Fade) * 6}px)`,
                      transition: "filter 80ms linear",
                    }}
                  >
                    Motivational Interviewing is designed to change
                    people&rsquo;s behaviours.
                  </span>
                </h2>

                {/* CTA — appears alongside Beat 2 so the action rides
                    the same reveal as the answer it earns. */}
                <a
                  href="#motivational-interviewing-paper"
                  className="btn-primary group/mi-cta mt-8 md:mt-9"
                  style={{
                    opacity: line2Fade,
                    transform: `translateY(${(1 - line2Fade) * 10}px)`,
                    pointerEvents: line2Fade > 0.6 ? "auto" : "none",
                  }}
                >
                  Read the full white paper
                  <Arrow />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stage 2: Subtext → Cards → Proof (natural flow) ─────────
          Once the sticky runway ends, the body paragraph introduces
          the MI vocabulary, then the 4 process cards reveal on
          intersection in their original portrait aspect. */}
      <div className="container-page relative z-10 pb-16 pt-10 md:pb-28 md:pt-20 lg:pb-32 lg:pt-24">
        {/* Subtext — sits directly above the 4 blocks. Names the four
            processes + OARS so the cards below land as recognised
            terms rather than fresh ones. */}
        <p className="max-w-[78ch] body-quiet">
          Developed by Miller and Rollnick in the early 1980s, MI is a
          collaborative way of speaking that{" "}
          <span className="text-ink">draws motivation out</span> — never
          installs it. It moves through four processes —{" "}
          <span className="text-ink">engage, focus, evoke, plan</span> — and
          four micro skills called{" "}
          <span className="text-ink">OARS</span>: open questions,
          affirmations, reflective listening, summaries. Reflective listening
          is the workhorse. The density of a member&rsquo;s own{" "}
          <span className="text-ink">change talk</span> is the strongest
          predictor of whether behavior actually shifts.
        </p>

        <div className="mt-14 grid gap-7 md:mt-16 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((s) => (
            <CardOnScroll key={s.label} step={s} />
          ))}
        </div>

      </div>
    </section>
  );
}

// Stage-2 card uses an IntersectionObserver instead of scroll progress
// so each card reveals as it enters the viewport — keeps each card's
// own micro-animation (chat replay, list reveal, etc.) on its natural
// trigger rather than scrubbing through it.
function CardOnScroll({
  step,
}: {
  step: {
    label: string;
    title: string;
    Visual: React.ComponentType<{ active: boolean }>;
    Icon: React.ComponentType<{ className?: string }>;
  };
}) {
  const ref = useRef<HTMLElement | null>(null);
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
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  const { Visual, Icon } = step;
  return (
    <article ref={ref}>
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition:
            "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <Visual active={inView} />
      </div>
      <div
        className="mt-5 md:mt-6"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(10px)",
          transition:
            "opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1) 200ms, transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1) 200ms",
        }}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-[22px] w-[22px] text-brand-600 md:h-[24px] md:w-[24px]" />
          <p className="text-row font-serif font-normal leading-none text-ink">
            {step.label}
          </p>
        </div>
        <p className="mt-3 max-w-[36ch] body-quiet">
          {step.title}
        </p>
      </div>
    </article>
  );
}

/* ── Step 1 — Engage ────────────────────────────────────────────────────── */

function EngageVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";
  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/65 via-paper/55 to-paper/70" />
      <div className="relative flex h-full flex-col justify-center gap-3 p-5 md:p-6">
        <div
          className="relative flex max-w-[88%] items-start gap-2 self-start"
          style={{
            animation: "fadeUp 600ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span className="mt-1.5">
            <AIOrb size={18} />
          </span>
          <div className="surface-glass relative overflow-hidden rounded-[16px] rounded-bl-[6px] px-4 py-3 text-[13.5px] leading-snug text-ink">
            <span
              aria-hidden
              className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[16px]"
            />
            <span className="relative">
              Mind if we just talk for a minute? Whatever&rsquo;s on your mind.
            </span>
          </div>
        </div>
        <div
          className="surface-glass-inner relative max-w-[78%] self-end overflow-hidden rounded-[16px] rounded-br-[6px] px-4 py-3 font-serif text-[13.5px] italic leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 900ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          just had a long week.
        </div>
      </div>
    </div>
  );
}

/* ── Step 2 — Focus ─────────────────────────────────────────────────────── */

const FOCUS_TOPICS = [
  { label: "Sleep", chosen: false },
  { label: "Energy at work", chosen: false },
  { label: "Relationship with Smith", chosen: true },
  { label: "Eating habits", chosen: false },
  { label: "Medication routine", chosen: false },
];

function FocusVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";
  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pattern.png"
        alt=""
        className="absolute left-0 top-0 h-full w-auto max-w-none scale-110 select-none blur-md"
        draggable={false}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-paper-warm/70 via-paper-warm/60 to-paper-warm/75"
      />
      <div className="relative flex h-full items-center justify-center p-5 md:p-6">
        <figure
          className="relative w-full max-w-[252px] rounded-[18px] bg-white/95 p-4 shadow-[0_18px_40px_-14px_rgba(40,25,15,0.22),0_2px_8px_-2px_rgba(40,25,15,0.08)] ring-1 ring-ink/[0.04]"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.08em] text-ink-muted">
            Maria · today
          </p>
          <p className="mt-1 text-[12.5px] font-medium text-ink">
            What she could bring
          </p>
          <ul className="mt-3 space-y-[7px]">
            {FOCUS_TOPICS.map((t, i) => (
              <li
                key={t.label}
                className={`flex items-center gap-2 rounded-md px-2 py-1 text-[12.5px] leading-snug ${
                  t.chosen ? "bg-brand-50 text-ink" : "text-ink-muted"
                }`}
                style={{
                  animation: `fadeUp 360ms ease-out ${360 + i * 110}ms forwards`,
                  animationPlayState: playState,
                  opacity: 0,
                }}
              >
                <span
                  aria-hidden
                  className={`inline-block h-[6px] w-[6px] shrink-0 rounded-full ${
                    t.chosen ? "bg-brand-600" : "bg-ink/20"
                  }`}
                />
                <span className={t.chosen ? "font-medium" : ""}>{t.label}</span>
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </div>
  );
}

/* ── Step 3 — Evoke ─────────────────────────────────────────────────────── */

function EvokeVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";
  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-3-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/65 via-paper/55 to-paper/70" />
      <div className="relative flex h-full flex-col justify-center gap-3 p-5 md:p-6">
        <div
          className="surface-glass-inner relative max-w-[82%] self-end overflow-hidden rounded-[16px] rounded-br-[6px] px-4 py-3 font-serif text-[13.5px] italic leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          i feel invisible in it.
        </div>
        <div
          className="relative flex max-w-[88%] items-start gap-2 self-start"
          style={{
            animation: "fadeUp 600ms ease-out 900ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span className="mt-1.5">
            <AIOrb size={18} />
          </span>
          <div className="surface-glass relative overflow-hidden rounded-[16px] rounded-bl-[6px] px-4 py-3 text-[13.5px] leading-snug text-ink">
            <span
              aria-hidden
              className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[16px]"
            />
            <span className="relative">
              Invisible to someone you&rsquo;re still showing up for —
              that&rsquo;s its own kind of lonely.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 4 — Plan ──────────────────────────────────────────────────────── */

function PlanVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";
  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/65 via-paper/55 to-paper/70" />
      <div className="relative flex h-full items-center justify-center p-5 md:p-6">
        <figure
          className="surface-glass relative w-full max-w-[252px] overflow-hidden rounded-[18px] p-5"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span
            aria-hidden
            className="surface-glass-shine absolute inset-x-0 top-0 h-[42%] rounded-t-[18px]"
          />
          <p className="relative text-[10px] uppercase tracking-[0.08em] text-ink-muted">
            Maria · tomorrow night
          </p>
          <p className="relative mt-1 text-[12.5px] font-medium text-ink">
            Her next step
          </p>
          <p
            className="relative mt-3 font-serif text-[19px] leading-[1.22] tracking-tight text-ink md:text-[20px]"
            style={{
              animation: "fadeUp 700ms ease-out 480ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            Text Smith one honest line before bed.
          </p>
          <div
            className="relative mt-5 flex items-center gap-2 text-[12.5px] text-ink-soft"
            style={{
              animation: "fadeUp 500ms ease-out 1200ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            <span
              aria-hidden
              className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-brand-600/15 text-brand-700"
            >
              <svg
                className="h-[9px] w-[9px]"
                viewBox="0 0 8 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1.6 4.2 L3.4 5.8 L6.6 2.4" />
              </svg>
            </span>
            <span>Chosen by Maria, not prescribed.</span>
          </div>
        </figure>
      </div>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 10.5 6 7l2 1.5 2-2 3.5 3.5" />
      <path d="M5.5 13.5 9 10l3 3" />
      <path d="M15.5 7.5 12 11" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="9" r="6.5" />
      <circle cx="9" cy="9" r="3.2" />
      <circle cx="9" cy="9" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WaveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 9c1.5-2.5 3-2.5 4.5 0S9.5 11.5 11 9s3-2.5 4.5 0" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="9" r="6.5" />
      <path d="M5.8 9.2 8 11.4 12.4 6.8" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/mi-cta:translate-x-1"
    >
      <path
        d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
