"use client";

import { Fragment, useEffect, useRef, useState } from "react";
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
    Icon: WaveIcon,
  },
  {
    label: "Asking",
    title: "Open questions that help insight find you.",
    Visual: SessionVisual,
    Icon: ChatIcon,
  },
  {
    label: "Remembering",
    title: "Every session builds on the last.",
    Visual: MemoryVisual,
    Icon: ClockIcon,
  },
] as const;

type Agent = {
  name: string;
  heading: string;
  body: string;
  pattern: string;
  blobGradient: string;
  blobShadow: string;
  haloColor: string;
  reverse?: boolean;
};

const AGENTS: Agent[] = [
  {
    name: "Roni",
    heading: "Daily coaching for diabetes.",
    body: "Adapts to each member's food, activity, and medication — built on motivational interviewing.",
    pattern: "/roni-pattern.webp",
    blobGradient:
      "radial-gradient(circle at 32% 28%, #FCB58A 0%, #F9904D 38%, #E45A1C 100%)",
    blobShadow:
      "0 24px 44px -14px rgba(228, 90, 28, 0.55), 0 4px 12px -4px rgba(228, 90, 28, 0.35)",
    haloColor: "#F9904D",
  },
  {
    name: "Millie",
    heading: "Therapeutic coaching for mental health.",
    body: "Supports stress, mood, and crisis — with 988 escalation built in.",
    pattern: "/millie-pattern.webp",
    blobGradient:
      "radial-gradient(circle at 32% 28%, #E89AAE 0%, #B8617C 38%, #7A3553 100%)",
    blobShadow:
      "0 24px 44px -14px rgba(122, 53, 83, 0.55), 0 4px 12px -4px rgba(122, 53, 83, 0.35)",
    haloColor: "#B8617C",
    reverse: true,
  },
];

function useInView<T extends HTMLElement>(threshold = 0.2) {
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

export function Solution() {
  return (
    <section
      id="solution"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40"
    >
      <div className="container-page">
        <h2 className="max-w-3xl text-display font-serif font-normal tracking-tight text-ink">
          Two coaches.
          <br />
          One way of listening.
        </h2>

        <div className="mt-8 space-y-5 md:mt-12 md:space-y-6">
          {AGENTS.map((agent) => (
            <AgentStrip key={agent.name} agent={agent} />
          ))}
        </div>

        <div className="mt-20 md:mt-28">
          <h3 className="max-w-2xl font-serif text-2xl font-normal leading-tight tracking-tight text-ink md:text-3xl lg:text-[2.25rem]">
            Three patterns. Every session.
          </h3>
          <div className="mt-8 grid gap-6 md:mt-12 md:gap-7 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((s, i) => (
              <StepCard key={s.label} step={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentStrip({ agent }: { agent: Agent }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  const textOrder = agent.reverse ? "md:order-2" : "md:order-1";
  const blobOrder = agent.reverse ? "md:order-1" : "md:order-2";

  return (
    <article
      ref={ref}
      data-revealed={inView}
      className="relative overflow-hidden rounded-2xl border border-ink/5"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 800ms ease-out, transform 800ms ease-out",
      }}
    >
      {/* Full-bleed pattern */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={agent.pattern}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "scale(1)" : "scale(1.04)",
          transition:
            "opacity 900ms ease-out, transform 1400ms ease-out",
        }}
      />
      {/* Soft cream wash on the text side so body copy stays legible against
          the saturated pattern; pattern bleeds full-strength behind the blob. */}
      <div
        aria-hidden
        className={`absolute inset-0 ${
          agent.reverse
            ? "bg-gradient-to-l from-paper-warm via-paper-warm/65 to-transparent"
            : "bg-gradient-to-r from-paper-warm via-paper-warm/65 to-transparent"
        }`}
      />

      <div className="relative grid grid-cols-1 gap-6 md:min-h-[380px] md:grid-cols-[1.1fr_1fr] md:gap-0 lg:min-h-[420px]">
        {/* Text */}
        <div
          className={`flex flex-col justify-center gap-3 p-7 md:gap-4 md:p-10 lg:p-14 ${textOrder}`}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateX(0)"
              : agent.reverse
                ? "translateX(24px)"
                : "translateX(-24px)",
            transition:
              "opacity 700ms ease-out 180ms, transform 800ms ease-out 180ms",
          }}
        >
          <h3 className="text-[28px] font-serif font-normal leading-[1.05] tracking-tight text-ink md:text-[36px] lg:text-[42px]">
            {agent.heading}
          </h3>
          <p className="max-w-[44ch] text-[15px] leading-relaxed text-ink-muted md:text-base">
            {agent.body}
          </p>
        </div>

        {/* Blob */}
        <div
          className={`flex items-center justify-center py-8 md:py-0 ${blobOrder}`}
        >
          <AgentBlob
            name={agent.name}
            active={inView}
            gradient={agent.blobGradient}
            shadow={agent.blobShadow}
            haloColor={agent.haloColor}
          />
        </div>
      </div>
    </article>
  );
}

function AgentBlob({
  name,
  active,
  gradient,
  shadow,
  haloColor,
}: {
  name: string;
  active: boolean;
  gradient: string;
  shadow: string;
  haloColor: string;
}) {
  // 8s cycle: ~3.6s of slow expand-and-fade, then ~4.4s of rest before the
  // next pulse begins. The "rest" is encoded in the keyframe (45% → 100%
  // sits at opacity 0), so a standard CSS animation gives a natural pause.
  const HALO_DURATION = 8;

  return (
    <div
      className="relative aspect-square w-[78%] max-w-[300px]"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "scale(1)" : "scale(0.88)",
        transition:
          "opacity 700ms ease-out 320ms, transform 900ms cubic-bezier(0.34, 1.4, 0.64, 1) 320ms",
      }}
    >
      {/* Outer hairline ring — static identity, tinted with the agent color. */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: `${haloColor}40` }}
      />

      {/* Middle dashed ring — static, neutral ink so it reads the same on
          both agent patterns. */}
      <span
        aria-hidden
        className="absolute inset-[14%] rounded-full border border-dashed border-ink/25"
      />

      {/* Filled halo, rendered behind the solid blob. Starts at the blob's
          exact size so the blob occludes it at scale=1; becomes visible only
          as it scales past 1, fades out, then rests. */}
      <span
        aria-hidden
        className="halo-fill absolute inset-[30%] rounded-full"
        style={{
          backgroundColor: haloColor,
          animation: active
            ? `haloFill ${HALO_DURATION}s ease-out infinite`
            : "none",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      <span
        className="absolute inset-[30%] flex items-center justify-center rounded-full text-white"
        style={{ background: gradient, boxShadow: shadow }}
      >
        <span className="font-serif text-[clamp(20px,3vw,28px)] font-normal leading-none tracking-tight">
          {name}
        </span>
      </span>
    </div>
  );
}

function StepCard({
  step,
  index,
}: {
  step: {
    label: string;
    title: string;
    Visual: React.ComponentType<{ active: boolean }>;
    Icon: React.ComponentType<{ className?: string }>;
  };
  index: number;
}) {
  const { Visual, Icon } = step;
  const num = String(index + 1).padStart(2, "0");
  const { ref, inView } = useInView<HTMLElement>(0.2);

  return (
    <article ref={ref}>
      <div className="mb-5 flex items-baseline gap-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-muted">
          {num}
        </span>
        <span
          className="h-px flex-1 origin-left bg-ink/10"
          style={{
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 700ms ease-out",
          }}
        />
      </div>
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 700ms ease-out, transform 800ms ease-out",
        }}
      >
        <Visual active={inView} />
      </div>
      <div
        className="mt-6 md:mt-7"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(10px)",
          transition:
            "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-[18px] w-[18px] text-brand-600" />
          <p className="text-base font-medium text-ink">{step.label}</p>
        </div>
        <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-muted">
          {step.title}
        </p>
      </div>
    </article>
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
      aria-hidden
    >
      <path d="M2 9h1M5.5 6v6M9 3.5v11M12.5 6v6M16 9h-1" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
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
      <path d="M3 7a2.5 2.5 0 0 1 2.5-2.5h7A2.5 2.5 0 0 1 15 7v3.5a2.5 2.5 0 0 1-2.5 2.5H8l-3 2.5v-2.5h-.5A2.5 2.5 0 0 1 2 10.5V7z" />
      <circle cx="9" cy="8.75" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
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
      <path d="M9 5.5V9l2.25 1.5" />
    </svg>
  );
}

const INTAKE_ITEMS = [
  "Values & motivation",
  "Cultural context",
  "Stress patterns",
  "Daily rhythms",
  "Goals & barriers",
];
const REVEAL_BASE = 500;
const REVEAL_GAP = 650;
const REVEAL_DUR = 700;

function IntakeVisual({ active }: { active: boolean }) {
  const lastReveal =
    REVEAL_BASE + (INTAKE_ITEMS.length - 1) * REVEAL_GAP + REVEAL_DUR;
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/55" />
      <div className="relative flex h-full flex-col items-start justify-center p-6 md:p-8">
        <BrainProgress
          duration={lastReveal - REVEAL_BASE}
          playState={playState}
        />
        <ul className="mt-6 space-y-3 md:mt-7 md:space-y-4">
          {INTAKE_ITEMS.map((label, i) => (
            <IntakeItem
              key={label}
              label={label}
              delay={REVEAL_BASE + i * REVEAL_GAP}
              playState={playState}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function BrainProgress({
  duration,
  playState,
}: {
  duration: number;
  playState: "running" | "paused";
}) {
  return (
    <span
      className="relative inline-block h-9 w-9 shrink-0 md:h-10 md:w-10"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brain-empty.svg"
        alt=""
        className="absolute inset-0 h-full w-full"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brain-loading.svg"
        alt=""
        className="absolute inset-0 h-full w-full"
        style={{
          clipPath: "inset(100% 0 0 0)",
          animation: `brainFill ${duration}ms linear ${REVEAL_BASE}ms forwards`,
          animationPlayState: playState,
        }}
      />
    </span>
  );
}

function IntakeItem({
  label,
  delay,
  playState,
}: {
  label: string;
  delay: number;
  playState: "running" | "paused";
}) {
  return (
    <li
      className="flex items-center gap-3 text-[15px] leading-snug text-ink md:text-base"
      style={{
        animation: `revealItem ${REVEAL_DUR}ms ease-out ${delay}ms forwards`,
        animationPlayState: playState,
        filter: "blur(5px)",
        opacity: 0.45,
      }}
    >
      <span className="relative h-5 w-5 shrink-0 md:h-[22px] md:w-[22px]">
        <span className="absolute inset-0 rounded-full border border-ink/15 bg-white/45" />
        <span
          className="absolute inset-0 flex items-center justify-center rounded-full bg-white ring-[1.5px] ring-brand-600"
          style={{
            animation: `fadeIn 500ms ease-out ${delay + 180}ms forwards`,
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 9 9"
            fill="none"
            aria-hidden
          >
            <path
              d="M1.5 4.5 3.5 6.5 7.5 2.5"
              stroke="#F9904D"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      <span>{label}</span>
    </li>
  );
}

function SessionVisual({ active }: { active: boolean }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % SESSION_MESSAGES.length),
      3500,
    );
    return () => clearInterval(t);
  }, [active]);

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pattern.png"
        alt=""
        className="absolute left-0 top-0 h-full w-auto max-w-none select-none"
        draggable={false}
      />
      <div aria-hidden className="absolute inset-0 bg-paper-warm/35" />
      <div className="relative flex h-full flex-col items-start justify-center gap-5 p-8 md:gap-6 md:p-10">
        <div
          key={idx}
          className="w-full rounded-[28px] border border-white/15 bg-[#2a0e05]/40 px-7 py-6 text-lg font-medium leading-snug text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_14px_36px_-10px_rgba(20,8,2,0.55)] backdrop-blur-xl backdrop-saturate-150 md:px-8 md:py-7 md:text-xl"
          style={{
            animation: "fadeUp 600ms ease-out forwards",
            animationPlayState: active ? "running" : "paused",
            opacity: 0,
          }}
        >
          {SESSION_MESSAGES[idx]}
        </div>
        <AIOrb size={44} />
      </div>
    </div>
  );
}

function MemoryVisual({ active }: { active: boolean }) {
  const memories = [
    { when: "Two weeks ago", text: "Sundays are the hardest." },
    { when: "Last session", text: "Cooking grounds me." },
    {
      when: "Today",
      text: "Building on both insights.",
      current: true,
    },
  ];

  const STEP_MS = 1100;
  const LINE_MS = 700;
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      <img
        src="/card-3-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/55" />
      <div className="relative flex h-full items-center justify-center p-7 md:p-10">
        <div className="w-full max-w-[380px]">
          <div className="flex items-center">
            {memories.map((m, i) => (
              <Fragment key={i}>
                <PipelineNode
                  current={m.current}
                  delay={i * STEP_MS}
                  playState={playState}
                />
                {i < memories.length - 1 && (
                  <div className="mx-1.5 h-px flex-1 bg-brand-600/15">
                    <span
                      className="block h-full origin-left bg-brand-600"
                      style={{
                        animation: `scaleXFromLeft ${LINE_MS}ms ease-out ${i * STEP_MS + 500}ms forwards`,
                        animationPlayState: playState,
                        transform: "scaleX(0)",
                      }}
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 md:mt-8">
            {memories.map((m, i) => (
              <div
                key={i}
                className="text-center"
                style={{
                  animation: `fadeUp 500ms ease-out ${i * STEP_MS + 250}ms forwards`,
                  animationPlayState: playState,
                  opacity: 0,
                }}
              >
                <p
                  className={`text-[12px] font-medium leading-tight ${
                    m.current ? "text-brand-700" : "text-ink-muted"
                  }`}
                >
                  {m.when}
                </p>
                <p className="mt-2 text-[13px] leading-snug text-ink">
                  “{m.text}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineNode({
  current,
  delay,
  playState,
}: {
  current?: boolean;
  delay: number;
  playState: "running" | "paused";
}) {
  if (current) {
    return (
      <span
        className="shrink-0"
        style={{
          animation: `circlePop 700ms cubic-bezier(0.34, 1.6, 0.64, 1) ${delay}ms forwards`,
          animationPlayState: playState,
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
        animationPlayState: playState,
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
