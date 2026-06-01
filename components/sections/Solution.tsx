"use client";

import { Fragment, useEffect, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

const SESSION_MESSAGES = [
  "What made that possible?",
  "What does that say about you?",
  "Where else in your life might that be true?",
  "What would feel different next week?",
];

const STEPS = [
  {
    label: "Listening",
    title: "Before any advice, it learns who you really are.",
    Visual: IntakeVisual,
  },
  {
    label: "Asking",
    title: "Open questions that help insight find you.",
    Visual: SessionVisual,
  },
  {
    label: "Remembering",
    title: "Every session builds on the last.",
    Visual: MemoryVisual,
  },
] as const;

export function Solution() {
  return (
    <section
      id="solution"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm pt-24 md:pt-32 lg:pt-40"
    >
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">How AI coaching helps</p>
          <h2 className="mt-6 text-display font-normal tracking-tight text-ink">
            Coaching that listens.
            <br />
            Asks. Remembers.
          </h2>
          <a
            href="#book-a-demo"
            className="mt-8 inline-flex items-center gap-2 text-base font-medium text-brand-700 transition hover:text-brand-800"
          >
            See how it works
            <Arrow />
          </a>
        </div>
      </div>

      <div className="mt-14 px-1.5 pb-1.5 md:mt-20 md:px-2 md:pb-2">
        <div className="grid gap-1.5 md:gap-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <StepCard key={s.label} step={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
}: {
  step: { label: string; title: string; Visual: React.ComponentType };
}) {
  const { Visual } = step;
  return (
    <article className="group overflow-hidden rounded-2xl bg-white">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Visual />
      </div>
      <div className="p-6 md:p-8 lg:p-10">
        <p className="text-sm font-medium text-brand-700">{step.label}</p>
        <h3 className="mt-3 max-w-sm text-xl font-normal leading-snug text-ink md:text-2xl">
          {step.title}
        </h3>
      </div>
    </article>
  );
}

function IntakeVisual() {
  const items = [
    "Values & motivation",
    "Cultural context",
    "Stress patterns",
    "Daily rhythms",
    "Goals & barriers",
  ];
  return (
    <div className="absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-br from-paper via-paper to-brand-50/60 p-8 md:p-10">
      <div className="flex items-center gap-3">
        <BrainIcon />
        <h4 className="text-lg font-medium text-ink md:text-xl">Listening</h4>
      </div>

      <ul className="mt-7 space-y-4 md:mt-9 md:space-y-5">
        {items.map((label, i) => (
          <li
            key={label}
            className="flex items-center gap-4 text-[15px] leading-snug text-ink md:text-base"
            style={{
              animation: `fadeUp 500ms ease-out ${i * 450 + 500}ms forwards`,
              opacity: 0,
            }}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600/15 text-brand-700">
              <svg width="11" height="11" viewBox="0 0 9 9" fill="none" aria-hidden>
                <path
                  d="M1.5 4.5 3.5 6.5 7.5 2.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BrainIcon() {
  // Filling brain — outline + clipped fill that grows from bottom up
  return (
    <span
      className="relative inline-flex h-7 w-8 shrink-0"
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full text-ink-soft"
        viewBox="0 0 28 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      >
        <ellipse cx="9" cy="12" rx="6" ry="9" />
        <ellipse cx="19" cy="12" rx="6" ry="9" />
      </svg>
      <svg
        className="absolute inset-0 h-full w-full text-brand-600"
        viewBox="0 0 28 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.4"
        style={{
          clipPath: "inset(100% 0 0 0)",
          animation: "brainFill 2400ms ease-out 500ms forwards",
        }}
      >
        <ellipse cx="9" cy="12" rx="6" ry="9" />
        <ellipse cx="19" cy="12" rx="6" ry="9" />
      </svg>
    </span>
  );
}

function SessionVisual() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % SESSION_MESSAGES.length),
      3500,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="absolute inset-0 flex flex-col items-start justify-center gap-4 p-8 md:p-10"
      style={{
        background:
          "linear-gradient(135deg, #FFF5EE 0%, #FFE6D4 55%, #FFCDA8 100%)",
      }}
    >
      <div
        key={idx}
        className="w-full rounded-[28px] bg-white/85 px-6 py-5 text-base leading-snug text-ink shadow-sm backdrop-blur-sm md:px-7 md:py-6 md:text-lg"
        style={{
          animation: "fadeUp 600ms ease-out forwards",
          opacity: 0,
        }}
      >
        {SESSION_MESSAGES[idx]}
      </div>
      <AIOrb size={36} />
    </div>
  );
}

function MemoryVisual() {
  const memories = [
    { when: "Two weeks ago", text: "Sundays are the hardest." },
    { when: "Last session", text: "Cooking grounds me." },
    {
      when: "Today",
      text: "Building on both insights.",
      current: true,
    },
  ];

  const STEP_MS = 1100; // time per pipeline beat
  const LINE_MS = 700;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-paper via-paper to-brand-50/40 p-7 md:p-10">
      <div className="w-full max-w-[320px]">
        {/* Horizontal pipeline */}
        <div className="flex items-center">
          {memories.map((m, i) => (
            <Fragment key={i}>
              <PipelineNode current={m.current} delay={i * STEP_MS} />
              {i < memories.length - 1 && (
                <div className="mx-1.5 h-px flex-1 bg-brand-600/15">
                  <span
                    className="block h-full origin-left bg-brand-600"
                    style={{
                      animation: `scaleXFromLeft ${LINE_MS}ms ease-out ${i * STEP_MS + 500}ms forwards`,
                      transform: "scaleX(0)",
                    }}
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Labels below each node */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {memories.map((m, i) => (
            <div
              key={i}
              className="text-center"
              style={{
                animation: `fadeUp 500ms ease-out ${i * STEP_MS + 250}ms forwards`,
                opacity: 0,
              }}
            >
              <p
                className={`text-[11px] font-medium leading-tight ${
                  m.current ? "text-brand-700" : "text-ink-muted"
                }`}
              >
                {m.when}
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-ink">
                “{m.text}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PipelineNode({
  current,
  delay,
}: {
  current?: boolean;
  delay: number;
}) {
  if (current) {
    return (
      <span
        className="shrink-0"
        style={{
          animation: `circlePop 700ms cubic-bezier(0.34, 1.6, 0.64, 1) ${delay}ms forwards`,
          opacity: 0,
        }}
      >
        <AIOrb size={22} />
      </span>
    );
  }
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 ring-4 ring-brand-50"
      style={{
        animation: `circlePop 700ms cubic-bezier(0.34, 1.6, 0.64, 1) ${delay}ms forwards`,
        opacity: 0,
      }}
    >
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
        <path
          d="M1.5 4.5 3.5 6.5 7.5 2.5"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
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
