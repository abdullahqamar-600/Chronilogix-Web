"use client";

// MIExplainer — Section 3 of the homepage.
//
// Sits directly below StatementV5 ("MI is how people actually change")
// and pays it off in one composed beat.
//
// Layout:
//   Header row — heading left, the plain-language MI summary + white-paper
//     CTA right. Separated from the body by space, not a rule.
//   Body row — two open compositions on the warm ground (no framed cards):
//     Left  (narrower) — "Anatomy of the reply": what the MI reply avoids,
//       what it does instead, and the earned-planning close. Quiet and
//       typographic: flat marks, sentence case, no rules or pills.
//     Right (wider) — "MI in action": one member message, then a branch
//       into two divergent reply panels. A cool, flat, recessive "typical
//       chatbot" reply and a warm, raised "Chronilogix" reply, so it reads
//       as one message answered two ways, not a single chat thread.

import React, { useEffect, useRef, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

function useInView<T extends HTMLElement>(threshold = 0.15) {
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

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

// Staggered rise on the section's ease-out curve. Motion-reduced visitors
// get everything statically; if the observer never fires, JS still resolves
// inView so content is not trapped at opacity 0.
function makeReveal(inView: boolean, reduced: boolean) {
  return (delay: number): React.CSSProperties =>
    reduced
      ? {}
      : {
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(10px)",
          transition: `opacity 620ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
        };
}

// Matched frame for both blocks — bordered paper on the warm ground with
// a soft elevation. The good "block design"; restored after an over-eager
// flatten. A warm brand light in the upper-left is the shared signature.
const FRAME =
  "relative overflow-hidden rounded-[24px] border border-ink/[0.08] bg-paper";

function FrameWash() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(70% 55% at 0% 0%, rgba(249, 144, 77, 0.09) 0%, rgba(249, 144, 77, 0) 68%)",
      }}
    />
  );
}

export function MIExplainer() {
  return (
    <section
      id="motivational-interviewing"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
      aria-label="Motivational Interviewing explained"
    >
      <div className="container-page relative z-10 py-20 md:py-28 lg:py-36">
        {/* Header — heading + CTA left, summary right, tops aligned. */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-start lg:gap-16">
          <div>
            <h2
              className="text-section font-serif font-normal text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Motivational Interviewing explained
            </h2>
            <a
              href="/chronilogix-mi-whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group/mi-cta mt-7 md:mt-8"
            >
              Read the full white paper
              <Arrow />
            </a>
          </div>
          <p className="body-prose max-w-[54ch]">
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

        {/* Body — anatomy (narrow) + the branched comparison (wide). */}
        <div className="mt-14 grid gap-6 md:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch lg:gap-7 xl:gap-8">
          <AnatomyColumn />
          <ComparisonColumn />
        </div>
      </div>
    </section>
  );
}

/* ── Left — anatomy of the MI-aligned reply ──────────────────────────────── */

// Copy kept short and plain, so it reads clearly for non-native speakers:
// common words, no idioms ("piling on", "jumping to"), one idea per line.
const AVOIDS = [
  "Treating the setback as unimportant",
  "Adding blame or pressure",
  "Rushing into a new plan",
];

const MOVES: { text: React.ReactNode }[] = [
  { text: "Names what happened, without judging" },
  {
    text: (
      <>
        Notices that he came back,{" "}
        <span className="text-brand-800">an early sign of change</span>
      </>
    ),
  },
  { text: "Asks what first motivated him" },
];

function AnatomyColumn() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const reduced = usePrefersReducedMotion();
  const reveal = makeReveal(inView, reduced);

  return (
    <div ref={ref} className="flex flex-col">
      <p className="text-[13px] font-medium text-ink-muted">
        How the reply works
      </p>

      <div className={`${FRAME} mt-4 flex flex-1 flex-col p-6 md:p-8`}>
        <FrameWash />
        <div className="relative flex flex-1 flex-col justify-center">
          {/* Quiet register — what the reply deliberately holds back. Set
              small and muted so it recedes beneath the focal group below. */}
          <div style={reveal(0)}>
            <GroupLabel tone="mute">What it avoids</GroupLabel>
            <ul className="mt-2.5 space-y-1.5">
              {AVOIDS.map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[13.5px] leading-snug text-ink-muted"
                  style={reveal(70 + i * 70)}
                >
                  <Mark kind="x" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Focal register — what the reply actually does. Larger, airier,
              full-ink, so the eye settles here. */}
          <div className="mt-8" style={reveal(300)}>
            <GroupLabel tone="brand">What it does instead</GroupLabel>
            <ul className="mt-4 space-y-4">
              {MOVES.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[15.5px] leading-relaxed text-ink"
                  style={reveal(370 + i * 70)}
                >
                  <Mark kind="check" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Earned-planning close — set in serif to land as the block's
              resolving thought, distinct from the sans body above. */}
          <p
            className="mt-9 font-serif text-[17px] leading-snug text-ink-soft"
            style={reveal(640)}
          >
            Planning comes next, when he is{" "}
            <span className="text-brand-800">ready</span>, not before.
          </p>
        </div>
      </div>
    </div>
  );
}

function GroupLabel({
  tone,
  children,
}: {
  tone: "mute" | "brand";
  children: React.ReactNode;
}) {
  return (
    <span
      className={`block font-semibold ${
        tone === "brand"
          ? "text-[13px] text-brand-800"
          : "text-[12px] text-ink-muted"
      }`}
    >
      {children}
    </span>
  );
}

/* ── Right — the conversation, animated so the contrast is felt ──────────────
   Plays once in view: greeting, the member's message, then the generic
   assistant reply. A beat later Chronilogix's reply slides up onto the top
   of the stack and the generic reply dulls behind it, so the visitor sees
   Chronilogix decline to answer the way a generic chatbot would. ─────────── */

function ComparisonColumn() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const reduced = usePrefersReducedMotion();

  // Play steps: 1 greeting · 2 member · 3 generic reply · 4 Chronilogix reply
  // slides in on top + generic reply recedes.
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setStep(5);
      return;
    }
    const timers = [
      setTimeout(() => setStep(1), 250),
      setTimeout(() => setStep(2), 1050),
      setTimeout(() => setStep(3), 1950),
      setTimeout(() => setStep(4), 3100),
      setTimeout(() => setStep(5), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced]);

  const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

  const rise = (n: number): React.CSSProperties =>
    reduced
      ? {}
      : {
          opacity: step >= n ? 1 : 0,
          transform: step >= n ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 520ms ${EASE}, transform 520ms ${EASE}`,
        };

  // Generic reply: lands at step 3, then recedes behind Chronilogix's reply
  // at step 4. Dulled but still legible (0.55 + desaturated, nudged up and
  // back), so it reads as deliberately set aside, not broken.
  const genericStyle: React.CSSProperties = reduced
    ? { opacity: 0.55, filter: "grayscale(0.5)", transform: "scale(0.965)" }
    : {
        opacity: step < 3 ? 0 : step >= 4 ? 0.55 : 1,
        filter: step >= 4 ? "grayscale(0.5)" : "grayscale(0)",
        transform:
          step < 3
            ? "translateY(12px)"
            : step >= 4
              ? "translateY(-8px) scale(0.965)"
              : "translateY(0)",
        transformOrigin: "left top",
        transition: `opacity 560ms ${EASE}, transform 560ms ${EASE}, filter 560ms ${EASE}`,
      };

  // Chronilogix reply: rises onto the top of the stack at step 4.
  const chronoStyle: React.CSSProperties = reduced
    ? {}
    : {
        opacity: step >= 4 ? 1 : 0,
        transform: step >= 4 ? "translateY(0)" : "translateY(26px)",
        transition: `opacity 620ms ${EASE}, transform 620ms ${EASE}`,
      };

  return (
    <div ref={ref} className="flex flex-col">
      <p className="text-[13px] font-medium text-ink-muted">MI in action</p>

      <div
        role="group"
        aria-label="A coaching conversation: after the member describes a two-week lapse, a generic assistant reply is replaced by how Chronilogix actually replies"
        className={`${FRAME} mt-4 flex flex-1 flex-col justify-center p-6 md:p-8 lg:min-h-[540px] lg:p-10`}
      >
        {/* Dulled background texture, kept well behind the text. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/card-3-bg.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
        />
        <div aria-hidden className="absolute inset-0 bg-paper/[0.86]" />

        <div className="relative">
          {/* Setup exchange. */}
          <div className="space-y-4 md:space-y-5">
            <div style={rise(1)}>
              <ChatBubble side="coach">
                Hi James &mdash; it&rsquo;s been about ten days since we last
                talked. Welcome back. What&rsquo;s been on your mind about the
                eating plan?
              </ChatBubble>
            </div>
            <div style={rise(2)}>
              <ChatBubble side="member">
                I fell off it for two weeks. Work blew up and I just gave up.
              </ChatBubble>
            </div>
          </div>

          {/* The reply — the generic answer lands first, then Chronilogix's
              reply rises on top of it (after a short typing beat) while the
              generic answer dulls and recedes behind. */}
          <div className="mt-5 md:mt-6">
            <div className="relative z-[5]" style={genericStyle}>
              <GenericReply dismissed={step >= 4} />
            </div>
            <div
              className="relative z-10 -mt-10 md:-mt-12"
              style={chronoStyle}
            >
              <ChronilogixReply typing={step < 5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Setup bubbles, same chat design as before: the coach sits left behind the
// AI orb, the member sits right in a filled ink bubble. No drop shadow.
function ChatBubble({
  side,
  children,
}: {
  side: "coach" | "member";
  children: React.ReactNode;
}) {
  if (side === "coach") {
    return (
      <div className="flex items-start gap-3">
        <span className="mt-1 shrink-0">
          <AIOrb size={22} />
        </span>
        <p className="max-w-[32rem] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[14.5px] leading-relaxed text-ink ring-1 ring-ink/[0.06]">
          {children}
        </p>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <p className="max-w-[30rem] rounded-2xl rounded-tr-md bg-ink px-4 py-3 text-[14.5px] leading-relaxed text-white/95">
        {children}
      </p>
    </div>
  );
}

// The generic assistant's reply — neutral grey mark, muted body. When
// Chronilogix's reply lands on top, this is dismissed: a short caption states
// in plain text that a generic bot stops here, so the point survives even
// with motion off (it is not carried by the fade alone).
function GenericReply({ dismissed }: { dismissed: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 shrink-0">
        <GenericAvatar />
      </span>
      <div className="min-w-0 max-w-[34rem]">
        <p className="text-[12px] font-medium text-ink-muted">
          A generic assistant
        </p>
        {dismissed ? (
          <p className="mt-0.5 text-[11.5px] italic text-ink-muted">
            Where a generic bot stops.
          </p>
        ) : null}
        <p className="mt-1.5 rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[14px] leading-relaxed text-ink-muted ring-1 ring-ink/[0.07]">
          No worries! Let&rsquo;s get you back on track. Try logging three
          meals today.
        </p>
      </div>
    </div>
  );
}

// Chronilogix's reply. Rises onto the top of the stack. It first shows a
// short typing beat — a generic bot fires instantly, Chronilogix takes a
// considered moment — then resolves into the MI-aligned reply. Elevation is
// carried by a firmer ring and a bright inner top edge, never a drop shadow.
function ChronilogixReply({ typing }: { typing: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 shrink-0">
        <AIOrb size={22} />
      </span>
      <div className="min-w-0 max-w-[34rem]">
        <p className="mb-1.5 text-[12px] font-medium text-ink">Chronilogix</p>
        <div className="rounded-2xl rounded-tl-md bg-brand-50 px-4 py-3 text-[14.5px] leading-relaxed text-ink ring-1 ring-brand-600/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          {typing ? (
            <TypingDots />
          ) : (
            <>
              Two stressful weeks where the plan got pushed aside &mdash;
              that&rsquo;s pretty common when work goes sideways. You came back
              to this conversation, which suggests it still matters to you.
              When you think about why you started this back in February, what
              comes up?
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Three-dot typing indicator — the considered beat before Chronilogix's
// reply. Uses the shared loaderDot keyframe.
function TypingDots() {
  return (
    <span
      role="status"
      aria-label="Chronilogix is typing"
      className="inline-flex items-center gap-1 py-0.5"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-brand-600/70"
          style={{
            animation: `loaderDot 1000ms ease-in-out ${i * 160}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}

// Neutral sender mark for the generic assistant, deliberately not the orb.
function GenericAvatar() {
  return (
    <span
      aria-hidden
      className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-ink/[0.08] ring-1 ring-ink/[0.06]"
    >
      <span className="h-2 w-2 rounded-full bg-ink/30" />
    </span>
  );
}

/* ── Shared flat marks — shape cue for the not/yes contrast, no pills ─────── */

function Mark({ kind }: { kind: "x" | "check" }) {
  if (kind === "check") {
    return (
      <svg
        aria-hidden
        className="mt-[5px] h-4 w-4 shrink-0 text-brand-700"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3.5 8.5 6.5 11.5 12.5 4.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden
      className="mt-[3px] h-[15px] w-[15px] shrink-0 text-ink-muted"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4.5 4.5 11.5 11.5 M11.5 4.5 4.5 11.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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
