"use client";

import { useEffect, useRef, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

type Block = {
  eyebrow: string;
  heading: string;
  body: React.ReactNode;
  Visual: React.ComponentType<{ active: boolean }>;
};

/* Shared puffy-card classes — keeps the language consistent across the
   four visuals. Soft inner highlight comes from the gradient; the
   subtle outer shadow gives the floating "product-element" feel. */
const PUFFY_CARD = "surface-glass rounded-2xl";

/* Render at the top of a glass card to add the secondary "shine" highlight
   (the brighter top half visible in every reference card). Pass the matching
   top-corner radius so the shine inherits the card's curvature. */
function GlassShine({ radius = "rounded-t-2xl" }: { radius?: string }) {
  return (
    <span
      aria-hidden
      className={`surface-glass-shine pointer-events-none absolute inset-x-0 top-0 h-1/2 ${radius}`}
    />
  );
}

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

export function CoreCapabilities() {
  return (
    <section
      id="capabilities"
      className="relative overflow-hidden rounded-[28px] bg-white pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40"
    >
      <div className="container-page">
        {/* Header */}
        <div className="max-w-5xl">
          <h2
            className="mt-4 text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            What coaching demands,{" "}
            <span className="text-brand-700">built in.</span>
          </h2>
          <p className="mt-5 max-w-[58ch] body-quiet">
            The capabilities behind every Chronilogix session.
          </p>
        </div>

        {/* Anchor rows — six full-bleed capability rows with bespoke
            visuals. Each alternates the content column, with the
            illustration always centered. */}
        <div className="mt-20 space-y-24 md:mt-28 md:space-y-32 lg:space-y-40">
          {BLOCKS.map((block, i) => (
            <CapabilityRow key={block.heading} block={block} index={i} />
          ))}
        </div>

        {/* Privacy by design — the closing beat. Inverted treatment so
            the trust posture lands as a section of its own, not as
            another card in the grid. */}
        <PrivacyByDesign />
      </div>
    </section>
  );
}

function CapabilityRow({ block, index }: { block: Block; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const reverse = index % 2 === 1;
  const { Visual } = block;

  const contentSide = reverse ? "lg:col-start-3" : "lg:col-start-1";

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-3 lg:gap-12"
    >
      {/* Content */}
      <div
        className={`order-2 lg:order-none lg:row-start-1 ${contentSide} flex flex-col justify-center`}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(18px)",
          transition:
            "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 240ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 240ms",
        }}
      >
        <p className="eyebrow-muted">{block.eyebrow}</p>
        <h3 className="mt-3 max-w-[22ch] text-row font-serif font-normal text-ink">
          {block.heading}
        </h3>
        <p className="mt-5 max-w-[42ch] body-quiet">
          {block.body}
        </p>
      </div>

      {/* Illustration — always centered column on desktop */}
      <div
        className="order-1 lg:order-none lg:col-start-2 lg:row-start-1"
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

/* ── Privacy by design — the inverted closing block ─────────────────────
   Visually distinct from the pillars so the trust posture reads as a
   commitment, not a feature. Dark ink ground, light type, single big
   claim, supporting line, and a row of compliance pills. */

function PrivacyByDesign() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <div
      ref={ref}
      className="mt-24 md:mt-32"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition:
          "opacity 800ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      <div
        className="relative overflow-hidden rounded-[24px] px-8 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20"
        style={{
          background:
            "linear-gradient(140deg, #14181D 0%, #1B2129 55%, #14181D 100%)",
        }}
      >
        {/* Soft warm glow in the upper-left so the dark ground reads as
            "lit" rather than flat. Echoes the brand orange without
            tinting the type. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 10% 15%, rgba(249,144,77,0.16), transparent 70%)",
          }}
        />

        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          {/* Claim — large and stark. */}
          <div className="lg:col-span-8">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-brand-400/90">
              Privacy by design
            </p>
            <h3
              className="mt-5 max-w-[22ch] font-serif text-[34px] font-normal leading-[1.08] text-white md:text-[44px] lg:text-[52px]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Member data is never used{" "}
              <span className="text-brand-400">to train our models.</span>
            </h3>
            <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-white/70 md:text-[16px]">
              Conversations stay private. Sponsors see aggregate
              engagement and behavioral trends; individual member data
              never leaves the platform. Encryption in transit and at
              rest, role-based access, and clinical-grade audit trails
              by default.
            </p>
          </div>

          {/* HIPAA pill — a single emphasised badge. */}
          <div className="lg:col-span-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
              Compliance posture
            </p>
            <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 backdrop-blur-sm">
              <span
                aria-hidden
                className="block h-1.5 w-1.5 rounded-full bg-brand-400"
              />
              <span className="text-[14px] font-medium text-white">
                HIPAA
              </span>
              <span className="text-[12.5px] text-white/55">
                Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Capability visuals — one clear idea each, no decorative pills or dots.   */
/* Typography + whitespace do the work.                                     */

/* ── 01 — MI Engine ─────────────────────────────────────────────────────
   The big challenge breaks down to a small, concrete step — anchored to an
   internal why. Read top-to-bottom as a single vertical thought. */

function MethodVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/60" />

      <div className="relative flex h-full flex-col items-stretch justify-center gap-5 p-8 md:p-10">
        {/* The big, abstract challenge */}
        <figure
          className={`${PUFFY_CARD} relative w-full self-start overflow-hidden px-5 py-4`}
          style={{
            animation: "fadeUp 600ms ease-out 100ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <GlassShine />
          <p className="relative text-[13px] font-medium text-ink-soft">
            The challenge
          </p>
          <p className="relative mt-2 font-serif text-[22px] leading-tight tracking-tight text-ink md:text-[26px]">
            &ldquo;Reverse my diabetes.&rdquo;
          </p>
        </figure>

        {/* A single thin connector that "draws down" */}
        <div className="relative mx-auto h-9 w-px">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-brand-600/60 to-brand-600/10"
            style={{
              bottom: 0,
              animation: "scaleYFromTop 700ms ease-out 800ms forwards",
              animationPlayState: playState,
              transform: "scaleY(0)",
            }}
          />
        </div>

        {/* The small, achievable goal */}
        <figure
          className={`${PUFFY_CARD} relative w-full self-stretch overflow-hidden px-5 py-4`}
          style={{
            animation: "fadeUp 600ms ease-out 1300ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <GlassShine />
          <p className="relative text-[13px] font-medium text-brand-700">
            This week
          </p>
          <p className="relative mt-2 font-serif text-[19px] leading-tight tracking-tight text-ink md:text-[21px]">
            Walk fifteen minutes, after dinner.
          </p>
        </figure>

        {/* The why — a quiet caption with an em dash, no card, no pill */}
        <p
          className="relative mt-2 max-w-[36ch] self-center text-center text-[14.5px] font-medium leading-snug text-ink-soft md:text-[15.5px]"
          style={{
            animation: "fadeUp 600ms ease-out 2000ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          Because she wants to be there for her granddaughter&rsquo;s wedding.
        </p>
      </div>
    </div>
  );
}

/* ── 02 — Access ────────────────────────────────────────────────────────
   Two messages, side-by-side roles, language shift does the work.
   No panel chrome, no "Direct message" header, no confidentiality pill,
   no language pill, no MI tag. The conversation itself is the proof. */

function AccessVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pattern.png"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/62" />

      <div className="relative flex h-full flex-col justify-center gap-3 p-8 md:p-10">
        {/* Member, in English — the honest thing */}
        <div
          className="surface-glass-inner relative max-w-[82%] self-end overflow-hidden rounded-[18px] rounded-br-[6px] px-4 py-3 text-[14px] leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          Honestly… I haven&rsquo;t taken my pills in three weeks. I never
          told my doctor.
        </div>

        {/* Chronilogix, in Spanish — the language shift is the story */}
        <div
          className="surface-glass relative max-w-[86%] self-start overflow-hidden rounded-[18px] rounded-bl-[6px] px-4 py-3 text-[14px] leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 1100ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span aria-hidden className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[18px]" />
          <div className="relative flex items-start gap-2.5">
            <span className="mt-1 shrink-0"><AIOrb size={18} /></span>
            <p>
              Gracias por contarme eso. Eso requirió valor. ¿Qué hacía que
              tomarlas se sintiera difícil?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 03 — Oversight ─────────────────────────────────────────────────────
   Six sessions on a quiet horizon. Five small, one elevated and named.
   A thin diagonal carries the flagged one to a clinician's signature —
   the handoff IS the visual. No chart card, no toast swap, no pulse halo. */

function OversightVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  // 6 sessions; the 5th is flagged
  const sessions = [
    { ok: true, h: 14 },
    { ok: true, h: 12 },
    { ok: true, h: 16 },
    { ok: true, h: 13 },
    { ok: false, h: 34 }, // flagged — elevated tally
    { ok: true, h: 14 },
  ];

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/60" />

      <div className="relative flex h-full flex-col items-center justify-center gap-10 p-8 md:p-10">
        <div className="w-full max-w-[300px]">
          <p
            className="text-[14px] font-medium leading-snug text-ink-soft"
            style={{
              animation: "fadeUp 500ms ease-out 100ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            Six sessions, one flagged.
          </p>

          {/* Horizon row of tally marks */}
          <div className="relative mt-7">
            {/* Baseline */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-[10px] h-px bg-ink/12"
            />

            <div className="relative flex items-end justify-between px-2">
              {sessions.map((s, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  {!s.ok && (
                    <span
                      aria-hidden
                      className="mb-1 font-mono text-[10px] text-brand-700"
                      style={{
                        animation: `fadeUp 400ms ease-out ${600 + i * 160}ms forwards`,
                        animationPlayState: playState,
                        opacity: 0,
                      }}
                    >
                      ·
                    </span>
                  )}
                  <span
                    className={`block w-[3px] origin-bottom rounded-full ${
                      s.ok ? "bg-ink/35" : "bg-brand-700"
                    }`}
                    style={{
                      height: s.h,
                      animation: `tallyRise 420ms cubic-bezier(0.34, 1.4, 0.64, 1) ${400 + i * 160}ms forwards`,
                      animationPlayState: playState,
                      transform: "scaleY(0)",
                      marginBottom: 10,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Session labels */}
            <div className="mt-3 flex justify-between px-2 font-mono text-[11px] font-medium tracking-tight text-ink-muted">
              {["s1", "s2", "s3", "s4", "s5", "s6"].map((s, i) => (
                <span
                  key={s}
                  className={i === 4 ? "text-brand-700" : ""}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* The handoff — a single line, no card, no toast */}
          <div
            className="mt-8 flex items-baseline gap-3"
            style={{
              animation: "fadeUp 600ms ease-out 1700ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            <span className="text-[12.5px] font-medium text-ink-soft">
              Handoff
            </span>
            <span aria-hidden className="h-px flex-1 self-center bg-ink/15" />
            <span className="font-serif text-[16px] leading-none tracking-tight text-ink">
              Dr. Patel
            </span>
          </div>
          <p
            className="mt-2 text-right text-[13px] leading-snug text-ink-soft"
            style={{
              animation: "fadeUp 600ms ease-out 2100ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            Reviewing within two hours.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* 04 — Multilingual                                                        */
/* The same coach question rendered in three languages, stacked. The point  */
/* is the native voice, not a translation toggle.                           */
/* ──────────────────────────────────────────────────────────────────────── */

function MultilingualVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";
  const greetings = [
    { code: "EN", text: "What made today feel that way?" },
    { code: "ES", text: "¿Qué hizo que hoy se sintiera así?" },
    { code: "VI", text: "Điều gì khiến hôm nay cảm thấy như vậy?" },
  ];

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/60" />

      <div className="relative flex h-full flex-col justify-center gap-3.5 p-8 md:p-10">
        <p
          className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink-muted"
          style={{
            animation: "fadeUp 500ms ease-out 100ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          The same question · in the member&rsquo;s language
        </p>
        {greetings.map((g, i) => (
          <div
            key={g.code}
            className={`${PUFFY_CARD} relative max-w-[94%] self-start overflow-hidden rounded-[16px] rounded-bl-[6px] px-4 py-3`}
            style={{
              animation: `fadeUp 600ms ease-out ${300 + i * 380}ms forwards`,
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            <GlassShine radius="rounded-t-[16px]" />
            <div className="relative flex items-baseline gap-3">
              <span className="font-mono text-[10.5px] font-medium tracking-[0.08em] text-brand-700/85">
                {g.code}
              </span>
              <span className="text-[14px] leading-snug text-ink md:text-[14.5px]">
                {g.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* 05 — Emotion-aware                                                       */
/* Two member quotes side-by-side. Same coach, different reads, different   */
/* responses. The differential is the proof.                                */
/* ──────────────────────────────────────────────────────────────────────── */

type EmotionExchange = {
  member: string;
  reads: string;
  coach: string;
};

const EMOTION_EXCHANGES: EmotionExchange[] = [
  {
    member: "I just feel off today.",
    reads: "ambivalence",
    coach: "What&rsquo;s been on your mind?",
  },
  {
    member: "I crushed my goal today.",
    reads: "momentum",
    coach: "What helped you stay with it?",
  },
];

function EmotionAwareVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pattern.png"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/62" />

      <div className="relative flex h-full flex-col justify-center gap-6 p-8 md:p-10">
        {EMOTION_EXCHANGES.map((ex, i) => (
          <div
            key={ex.member}
            className={`flex flex-col gap-2 ${i > 0 ? "border-t border-ink/10 pt-6" : ""}`}
            style={{
              animation: `fadeUp 600ms ease-out ${200 + i * 900}ms forwards`,
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            {/* Member quote */}
            <div className="surface-glass-inner self-end max-w-[82%] overflow-hidden rounded-[14px] rounded-br-[6px] px-3.5 py-2.5 text-[13.5px] leading-snug text-ink">
              {ex.member}
            </div>

            {/* Detected state — labelled chip, mid-row, with a hairline
                glyph to imply the read happens between input and reply. */}
            <div className="flex items-center gap-2 self-center">
              <span
                aria-hidden
                className="block h-px w-6 bg-ink/20"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                reads
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600/12 px-2.5 py-0.5 text-[11px] font-medium text-brand-700">
                <span aria-hidden className="block h-1 w-1 rounded-full bg-brand-700" />
                {ex.reads}
              </span>
              <span
                aria-hidden
                className="block h-px w-6 bg-ink/20"
              />
            </div>

            {/* Coach reply */}
            <div
              className="surface-glass relative max-w-[88%] self-start overflow-hidden rounded-[14px] rounded-bl-[6px] px-3.5 py-2.5 text-[13.5px] leading-snug text-ink"
              dangerouslySetInnerHTML={{ __html: `<span aria-hidden class="surface-glass-shine pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[14px]"></span><span class="relative">${ex.coach}</span>` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* 06 — Crisis-safe                                                         */
/* A short three-beat sequence: concerning member message → distress signal */
/* detected → 988 connect badge. The escalation IS the visual.              */
/* ──────────────────────────────────────────────────────────────────────── */

function CrisisSafeVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-3-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/60" />

      <div className="relative flex h-full flex-col justify-center gap-4 p-8 md:p-10">
        {/* Member message — concerning language */}
        <div
          className="surface-glass-inner self-end max-w-[84%] overflow-hidden rounded-[14px] rounded-br-[6px] px-4 py-3 text-[14px] leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          I don&rsquo;t think I can keep doing this.
        </div>

        {/* Detection beat — small flag with pulsing dot */}
        <div
          className="flex items-center gap-2.5 self-center rounded-full border border-brand-700/20 bg-white/85 px-3.5 py-1.5 backdrop-blur-sm"
          style={{
            animation: "fadeUp 500ms ease-out 900ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span
            aria-hidden
            className="block h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "#E45A1C",
              animation: "knobPulse 1800ms cubic-bezier(0.22, 0.61, 0.36, 1) infinite",
              animationPlayState: playState,
            }}
          />
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-brand-700">
            Distress signal · auto-escalating
          </span>
        </div>

        {/* 988 connect card */}
        <div
          className={`${PUFFY_CARD} relative self-stretch overflow-hidden px-4 py-3.5`}
          style={{
            animation: "fadeUp 600ms ease-out 1500ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <GlassShine />
          <div className="relative flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(228,90,28,0.18) 0%, rgba(228,90,28,0.08) 100%)",
              }}
            >
              <svg
                className="h-5.5 w-5.5 text-brand-700"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                width="22"
                height="22"
              >
                <path d="M10 2.5 4 4.7v4.4c0 3.4 2.4 6.5 6 8.4 3.6-1.9 6-5 6-8.4V4.7L10 2.5Z" />
                <path d="M7.7 10.2 9.3 11.8l3-3.3" />
              </svg>
            </span>
            <div className="flex flex-col">
              <p className="font-serif text-[18px] leading-none tracking-tight text-ink">
                988
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">
                Suicide &amp; Crisis Lifeline
              </p>
            </div>
            <span
              aria-hidden
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-white"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Data ──────────────────────────────────────────────────────────────── */

const BLOCKS: Block[] = [
  {
    eyebrow: "01. MI Engine",
    heading: "Therapeutically informed, not a chatbot.",
    body: (
      <>
        Every Chronilogix conversation runs on the{" "}
        <span className="text-ink">MI Engine</span> — Dr. Ken
        Resnicow&rsquo;s Motivational Interviewing framework, encoded
        into the coaching loop. It doesn&rsquo;t lecture. It listens,
        reflects, and helps members find their own reasons to change.
        A structured intake makes the first session already informed;
        from there, big challenges break into small, achievable steps
        anchored to an internal <em>why</em>.
      </>
    ),
    Visual: MethodVisual,
  },
  {
    eyebrow: "02. Access",
    heading: "An emotionally safe entry point.",
    body: (
      <>
        Stigma, fear of judgment, and confidentiality worries keep many
        people from ever opening up to a live coach. Chronilogix lets
        them speak honestly first, then adapts to each member&rsquo;s
        culture, language, literacy, and readiness — reaching
        populations traditional programs overlook. Hispanic men face a{" "}
        <span className="text-ink">64% higher diabetes rate</span> yet
        make up just{" "}
        <span className="text-ink">2% of national prevention enrollment</span>.
      </>
    ),
    Visual: AccessVisual,
  },
  {
    eyebrow: "03. Oversight",
    heading: "Consistent, with humans in the loop.",
    body: (
      <>
        AI coaching doesn&rsquo;t vary with fatigue, caseload, or
        turnover — it delivers the same evidence-based engagement every
        time. Chronilogix handles{" "}
        <span className="text-ink">70–80% of coaching interactions</span>;
        human clinicians take the{" "}
        <span className="text-ink">20–30%</span> that genuinely need
        them, escalated automatically when the moment calls for it. The
        reach and economics of AI, paired with clinical oversight.
      </>
    ),
    Visual: OversightVisual,
  },
  {
    eyebrow: "04. Multilingual",
    heading: "Coaching in the member's own language.",
    body: (
      <>
        Conversations adapt to the language each member chooses,
        reaching populations English-only platforms cannot serve. Not
        subtitle translation — the full coaching voice, native in each
        language Chronilogix supports.
      </>
    ),
    Visual: MultilingualVisual,
  },
  {
    eyebrow: "05. Emotion-aware",
    heading: "Reads what the words are doing.",
    body: (
      <>
        Calibrated to recognize distress, disengagement, frustration,
        and ambivalence as distinct states inside plain text.{" "}
        <span className="text-ink">&ldquo;I just feel off&rdquo;</span>{" "}
        gets a different response pattern than{" "}
        <span className="text-ink">&ldquo;I crushed it today.&rdquo;</span>{" "}
        Tone, pacing, and question type adjust automatically.
      </>
    ),
    Visual: EmotionAwareVisual,
  },
  {
    eyebrow: "06. Crisis-safe",
    heading: "988 escalation, built in.",
    body: (
      <>
        Millie is designed to recognize crisis-level distress signals
        that exceed coaching scope and route to 988 immediately — without
        the member having to ask. Safety is part of the conversation
        architecture, not a fallback.
      </>
    ),
    Visual: CrisisSafeVisual,
  },
];

