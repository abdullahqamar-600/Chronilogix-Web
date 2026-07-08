"use client";

// MIExplainer — Section 3 of the homepage.
//
// Sits directly below StatementV5 (which sets up "MI is how people
// actually change") and unpacks what MI is in one composed beat:
// heading + summary + a four-process strip with arrows between, then a
// single CTA. Designed to fit in roughly a single viewport at desktop
// breakpoints so the section reads as one panel rather than a long
// scroll narrative.

import React, { useEffect, useRef, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

const STEPS = [
  {
    label: "Engage",
    skill: "Open question",
    blurb:
      "Build partnership. Listen first, in the member's own language.",
    Visual: EngageVisual,
    Icon: HandshakeIcon,
  },
  {
    label: "Focus",
    skill: "Member-led agenda",
    blurb:
      "Find what matters now. Short summaries keep the agenda the member's, not ours.",
    Visual: FocusVisual,
    Icon: TargetIcon,
  },
  {
    label: "Evoke",
    skill: "Reflective listening",
    blurb:
      "Draw motivation out. Reflective listening offers back precise change talk.",
    Visual: EvokeVisual,
    Icon: WaveIcon,
  },
  {
    label: "Plan",
    skill: "Chosen, not prescribed",
    blurb:
      "Translate intent into one small next step, chosen by the member.",
    Visual: PlanVisual,
    Icon: CheckCircleIcon,
  },
] as const;

export function MIExplainer() {
  return (
    <section
      id="motivational-interviewing"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
      aria-label="Motivational Interviewing explained"
    >
      <div className="container-page relative z-10 py-14 md:py-20 lg:py-24">
        {/* Heading + summary */}
        <div className="max-w-3xl">
          <h2
            className="text-section font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Motivational Interviewing explained
          </h2>
          <p className="mt-6 max-w-[72ch] body-prose md:mt-7">
            Motivational Interviewing (MI) is a collaborative way of
            speaking that moves through four processes,{" "}
            <span className="text-ink">engage, focus, evoke, plan</span>
            , and four micro skills called{" "}
            <span className="text-ink">OARS</span>: open questions,
            affirmations, reflective listening, summaries.{" "}
            <span className="text-ink">
              Reflective listening is the workhorse.
            </span>
          </p>
        </div>

        {/* Process strip — horizontal snap carousel on mobile (one card
            per swipe with a small peek of the next, native scroll feel),
            four-card grid with arrow connectors on md+. Mobile pattern
            replaces a 4-card vertical stack so the section doesn't
            sprawl over multiple viewports on small screens. */}
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:mt-12 md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-3 md:overflow-visible md:px-0 md:pb-0 md:scroll-px-0 lg:mt-14 lg:gap-4 [&::-webkit-scrollbar]:hidden">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.label}>
              <ProcessCard step={step} index={i} />
              {i < STEPS.length - 1 ? <ProcessArrow /> : null}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile-only swipe hint — matches the cadence used in the
            Problem section so the carousel reads as a known pattern. */}
        <p
          aria-hidden
          className="mt-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-subtle md:hidden"
        >
          <span>Swipe</span>
          <svg
            width="20"
            height="8"
            viewBox="0 0 20 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 4h17M14 1l3 3-3 3" />
          </svg>
        </p>

        <div className="mt-10 md:mt-12">
          <a
            href="/chronilogix-mi-whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group/mi-cta"
          >
            Read the full white paper
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

function ProcessCard({
  step,
  index,
}: {
  step: {
    label: string;
    skill: string;
    blurb: string;
    Visual: React.ComponentType<{ active: boolean }>;
    Icon: React.ComponentType<{ className?: string }>;
  };
  index: number;
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
  const ordinal = String(index + 1).padStart(2, "0");
  const staggerMs = index * 110;
  return (
    <article
      ref={ref}
      className="flex shrink-0 basis-[82%] snap-center flex-col md:basis-auto md:shrink"
    >
      <div
        className="relative aspect-square overflow-hidden rounded-2xl bg-white"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: `opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${staggerMs}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${staggerMs}ms`,
        }}
      >
        <Visual active={inView} />
        {/* Step ordinal — sits as a small editorial marker in the
            corner of each illustration. Reinforces the four-step
            sequence without claiming label space below. */}
        <span className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] font-medium tabular-nums tracking-[0.1em] text-ink-subtle">
          {ordinal}
        </span>
        {/* Skill chip — names the OARS technique the card demonstrates.
            Right-corner counterweight to the ordinal, so the reader
            can pattern-match "which MI move am I seeing here." */}
        <span
          className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/85 px-2 py-[3px] text-[9.5px] font-medium uppercase tracking-[0.08em] text-brand-700 ring-1 ring-brand-600/20 backdrop-blur-sm"
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 500ms cubic-bezier(0.22, 0.61, 0.36, 1) ${staggerMs + 360}ms`,
          }}
        >
          {step.skill}
        </span>
      </div>

      <div
        className="mt-4 md:mt-5"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1) ${staggerMs + 180}ms, transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1) ${staggerMs + 180}ms`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-[18px] w-[18px] text-brand-600 md:h-[20px] md:w-[20px]" />
          <p className="font-serif text-[19px] font-normal leading-none text-ink md:text-[20px]">
            {step.label}
          </p>
        </div>
        <p className="mt-2.5 max-w-[34ch] text-[13.5px] leading-snug text-ink-soft md:text-sm">
          {step.blurb}
        </p>
      </div>
    </article>
  );
}

// Connector between process cards — hairline with a brand-tinted dot
// terminator on md+, hidden on mobile where the strip stacks
// vertically. Reads as quiet directional flow rather than a loud
// chevron stamp.
function ProcessArrow() {
  return (
    <div
      aria-hidden
      className="hidden items-center justify-center md:flex"
      style={{ alignSelf: "start", paddingTop: "min(8vw, 92px)" }}
    >
      <svg
        width="34"
        height="10"
        viewBox="0 0 34 10"
        fill="none"
        className="text-ink/25"
      >
        <line
          x1="0"
          y1="5"
          x2="26"
          y2="5"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="30" cy="5" r="2.5" className="fill-brand-600/70" />
      </svg>
    </div>
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
      <div className="relative flex h-full flex-col justify-center gap-2.5 p-4 md:p-5">
        <div
          className="relative flex max-w-[92%] items-start gap-2 self-start"
          style={{
            animation: "fadeUp 600ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span className="mt-1.5">
            <AIOrb size={14} />
          </span>
          <div className="surface-glass relative overflow-hidden rounded-[14px] rounded-bl-[6px] px-3 py-2 text-[11.5px] leading-snug text-ink">
            <span
              aria-hidden
              className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[14px]"
            />
            <span className="relative">
              Mind if we just talk for a minute?
            </span>
          </div>
        </div>
        <div
          className="surface-glass-inner relative max-w-[78%] self-end overflow-hidden rounded-[14px] rounded-br-[6px] px-3 py-2 font-serif text-[11.5px] italic leading-snug text-ink"
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
      <div className="relative flex h-full items-center justify-center p-4 md:p-5">
        <figure
          className="relative w-full max-w-[200px] rounded-[14px] bg-white/95 p-3 shadow-[0_18px_40px_-14px_rgba(40,25,15,0.22),0_2px_8px_-2px_rgba(40,25,15,0.08)] ring-1 ring-ink/[0.04]"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <p className="text-[8.5px] uppercase tracking-[0.08em] text-ink-muted">
            Maria · today
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-ink">
            What she could bring
          </p>
          <ul className="mt-2 space-y-[5px]">
            {FOCUS_TOPICS.map((t, i) => (
              <li
                key={t.label}
                className={`flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[10.5px] leading-snug ${
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
                  className={`inline-block h-[5px] w-[5px] shrink-0 rounded-full ${
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
      <div className="relative flex h-full flex-col justify-center gap-2.5 p-4 md:p-5">
        <div
          className="surface-glass-inner relative max-w-[78%] self-end overflow-hidden rounded-[14px] rounded-br-[6px] px-3 py-2 font-serif text-[11.5px] italic leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          i feel invisible in it.
        </div>
        <div
          className="relative flex max-w-[92%] items-start gap-2 self-start"
          style={{
            animation: "fadeUp 600ms ease-out 900ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span className="mt-1.5">
            <AIOrb size={14} />
          </span>
          <div className="surface-glass relative overflow-hidden rounded-[14px] rounded-bl-[6px] px-3 py-2 text-[11.5px] leading-snug text-ink">
            <span
              aria-hidden
              className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[14px]"
            />
            <span className="relative">
              Invisible to someone you&rsquo;re still showing up for.
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
      <div className="relative flex h-full items-center justify-center p-4 md:p-5">
        <figure
          className="surface-glass relative w-full max-w-[200px] overflow-hidden rounded-[14px] p-3.5"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span
            aria-hidden
            className="surface-glass-shine absolute inset-x-0 top-0 h-[42%] rounded-t-[14px]"
          />
          <p className="relative text-[8.5px] uppercase tracking-[0.08em] text-ink-muted">
            Maria · tomorrow night
          </p>
          <p className="relative mt-0.5 text-[11px] font-medium text-ink">
            Her next step
          </p>
          <p
            className="relative mt-2 font-serif text-[14px] leading-[1.22] tracking-tight text-ink md:text-[15px]"
            style={{
              animation: "fadeUp 700ms ease-out 480ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            Text Smith one honest line before bed.
          </p>
          <div
            className="relative mt-3 flex items-center gap-1.5 text-[10.5px] text-ink-soft"
            style={{
              animation: "fadeUp 500ms ease-out 1200ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            <span
              aria-hidden
              className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-brand-600/15 text-brand-700"
            >
              <svg
                className="h-[8px] w-[8px]"
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
