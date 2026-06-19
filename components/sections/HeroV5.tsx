"use client";

import { useEffect, useMemo, useState } from "react";

// V5 Hero — V2's three-band composition, but the static phone is
// replaced with the animated chat-on-mobile from earlier V5 iterations.
//
// Stacking (back to front):
//   z-0   Phone band (image + animated chat overlay)
//   z-10  White blurred rectangle — "fog" beneath the hand, dissolves
//         the lower portion of the phone into the white background
//   z-20  Text row (eyebrow + headline + CTA on left; Resnicow caption
//         + stats on right) — crisp, floats on the fog

// Maria, 2:04 AM — same MI exchange used in earlier V5: open question
// → reflect → name the feeling → safety check. Member lines stay
// lowercase + casual; Roni's reflections do the careful clinical work.
type ChatTurn = { who: "member" | "roni"; text: string };
const CHAT: ChatTurn[] = [
  { who: "member", text: "cant sleep" },
  { who: "roni", text: "What's going on?" },
  {
    who: "member",
    text: "everything just collapsed this week. i've been holding it together for so long",
  },
  {
    who: "roni",
    text: "That sounds like you, Maria — you carry it quietly until you can't. What does that feel like right now?",
  },
  { who: "member", text: "like i'm standing still but falling at the same time" },
  { who: "roni", text: "Standing still and falling. Are you safe right now?" },
];

const TYPING_MS = 950;
const MEMBER_DWELL_MS = 1350;
const RONI_DWELL_MS = 1850;
const HOLD_MS = 4400;
const EXIT_MS = 600;
const RESET_PAUSE_MS = 520;

const REVEAL_DURATION_MS = 2400;

type ChatPhase = "idle" | "running" | "typing" | "hold" | "exit";

export function HeroV5() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [typingFor, setTypingFor] = useState<number | null>(null);
  const [phase, setPhase] = useState<ChatPhase>("idle");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRevealProgress(1);
      return;
    }
    let rafId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / REVEAL_DURATION_MS, 1);
      setRevealProgress(t);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  // Conversation timeline — each Roni reply is preceded by a typing
  // indicator so the rhythm feels like a real coach composing a reply.
  useEffect(() => {
    if (reducedMotion) {
      setActiveIndex(CHAT.length - 1);
      setPhase("hold");
      return;
    }
    let cancelled = false;
    let timer: number | undefined;

    const advance = (i: number) => {
      if (cancelled) return;
      if (i >= CHAT.length) {
        setPhase("hold");
        timer = window.setTimeout(() => {
          if (cancelled) return;
          setPhase("exit");
          timer = window.setTimeout(() => {
            if (cancelled) return;
            setActiveIndex(-1);
            setTypingFor(null);
            setPhase("idle");
            timer = window.setTimeout(() => advance(0), RESET_PAUSE_MS);
          }, EXIT_MS);
        }, HOLD_MS);
        return;
      }

      const msg = CHAT[i];
      if (msg.who === "roni") {
        setTypingFor(i);
        setPhase("typing");
        timer = window.setTimeout(() => {
          if (cancelled) return;
          setTypingFor(null);
          setActiveIndex(i);
          setPhase("running");
          timer = window.setTimeout(() => advance(i + 1), RONI_DWELL_MS);
        }, TYPING_MS);
      } else {
        setActiveIndex(i);
        setPhase("running");
        timer = window.setTimeout(() => advance(i + 1), MEMBER_DWELL_MS);
      }
    };

    timer = window.setTimeout(() => advance(0), 400);
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [reducedMotion]);

  const eased = easeOutCubic(revealProgress);
  // Fog lays down first; phone reveals through it; text follows. Same
  // pacing relationship as V2 so the hero reads as one composed
  // moment, not three independent fades.
  const fogFade = clamp01(eased / 0.32);
  const phoneFade = clamp01((eased - 0.22) / 0.55);
  const textFade = clamp01((eased - 0.4) / 0.55);

  return (
    <section
      id="hero"
      aria-label="Chronilogix — AI coaching for mental health and chronic care"
      className="relative flex flex-col overflow-hidden rounded-[28px]"
      style={{
        // Locks the hero into the user's viewport. min/max guard against
        // very short or very tall windows so the composition never
        // collapses or stretches past usable proportions.
        height: "min(100svh - 1.5rem, 1000px)",
        minHeight: "660px",
        // Soft creamy ground tone — warmer than white, lets the
        // dissolved hand and the ambient halos read as part of the
        // same warm-paper page. Matches Tailwind's `paper.warm` token
        // so neighbouring sections that use bg-paper-warm sit flush.
        backgroundColor: "#FBF8F4",
      }}
    >
      {/* ── Desktop: 3-column composition ───────────────────────────
          Heading flanks the phone on the left; subtext + CTA + stats
          flank on the right. Phone in the centre claims a wider
          column so it reads as the hero visual rather than a side
          prop. Below `lg` we stack: heading → phone → subtext. */}
      <div className="container-page relative z-20 flex h-full w-full flex-col lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10 lg:py-16 xl:gap-12">

        {/* Left — Heading. Top-aligned at desktop so it shoulders the
            phone; on smaller viewports flows in normal column order. */}
        <div
          className="relative z-20 flex-none pt-20 md:pt-24 lg:pt-0"
          style={{
            opacity: textFade,
            transform: `translateY(${(1 - textFade) * 10}px)`,
            willChange: "opacity, transform",
          }}
        >
          <div className="flex w-full flex-col items-center text-center lg:items-end lg:text-right">
            <h1
              className="max-w-[20ch] font-serif font-normal leading-[1.06] tracking-[-0.022em] text-ink text-[1.875rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[2.5rem] xl:text-[2.875rem]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Filling the gaps in mental health and chronic care{" "}
              <span className="italic text-ink-soft">
                through AI coaching agents.
              </span>{" "}
              <span className="text-brand">24/7</span>
            </h1>
          </div>
        </div>

        {/* Centre — Phone. On desktop the column is wider than the
            sides, so the phone scales up. Sized by HEIGHT so width
            follows the aspect ratio. */}
        <div
          className="relative z-0 flex w-full flex-1 justify-center pt-3 md:pt-4 lg:h-full lg:pt-0"
          style={{ minHeight: 0 }}
        >
          <div
            style={{
              opacity: phoneFade,
              transform: `translateY(${(1 - phoneFade) * 14}px)`,
              willChange: "opacity, transform",
            }}
            className="h-full"
          >
            <div className="h-full" style={{ aspectRatio: "1013 / 986" }}>
              <PhoneFrame
                phase={phase}
                activeIndex={activeIndex}
                typingFor={typingFor}
              />
            </div>
          </div>
        </div>

        {/* Right — Subtext + CTA + stats. Top-aligned at desktop so
            it lines up with the headline opposite. Each child is a
            quiet beat: attribution mark → Resnicow line → CTA →
            stats. */}
        <div
          className="relative z-20 flex-none pb-8 md:pb-10 lg:pb-0"
          style={{
            opacity: textFade,
            transform: `translateY(${(1 - textFade) * 12}px)`,
            willChange: "opacity, transform",
          }}
        >
          <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
            <div
              aria-hidden
              className="mb-2.5 flex items-center gap-2.5 text-[10px] uppercase tracking-[0.24em] text-ink/45 md:mb-3 md:gap-3 md:text-[10.5px]"
            >
              <span className="inline-block h-px w-5 bg-ink/20 md:w-7" />
              Clinical foundation
            </div>

            <p
              className="max-w-[36ch] font-serif font-normal leading-[1.32] tracking-[-0.01em] text-ink text-[0.95rem] md:text-[1.0625rem] lg:text-[1.1875rem]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Built on the life&rsquo;s work of world-renowned{" "}
              <em className="whitespace-nowrap not-italic font-medium">
                Dr. Ken Resnicow
              </em>
              , in Motivational Interviewing.
            </p>

            {/* TODO: Calendly URL */}
            <a
              href="#book-a-demo"
              className="group/herocta btn-primary mt-5 md:mt-6"
            >
              Book A Demo
              <Arrow />
            </a>

            <dl className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-ink-muted md:mt-6 md:gap-x-7 md:text-[12px] lg:justify-start lg:text-[12.5px]">
              <div className="flex items-baseline gap-2">
                <dt className="font-serif text-[1.0625rem] font-medium leading-none text-ink md:text-[1.1875rem]">
                  30+
                </dt>
                <dd>years of MI research</dd>
              </div>
              <span
                aria-hidden
                className="hidden h-3 w-px bg-ink/15 sm:inline-block"
              />
              <div className="flex items-baseline gap-2">
                <dt className="font-serif text-[1.0625rem] font-medium leading-none text-ink md:text-[1.1875rem]">
                  400+
                </dt>
                <dd>peer-reviewed publications</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* ── Fog (ambient halo, supplementary) ───────────────────────
          The hand dissolves into the cream page via the mask on the
          phone <img>; these halos tint that seam slightly warmer so
          the dissolve reads as light pooling on warm paper, not a
          stark fade to white. Cream rgba mirrors `paper.warm`. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-10 hidden h-[16svh] lg:block"
        style={{
          bottom: "8svh",
          background:
            "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(251,248,244,0.75) 0%, rgba(251,248,244,0) 70%)",
          filter: "blur(40px)",
          WebkitFilter: "blur(40px)",
          opacity: fogFade * 0.7,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-10%] z-10 h-[20svh] lg:hidden"
        style={{
          bottom: "12svh",
          background:
            "radial-gradient(ellipse 70% 100% at 50% 50%, rgba(251,248,244,0.88) 0%, rgba(251,248,244,0) 75%)",
          filter: "blur(36px)",
          WebkitFilter: "blur(36px)",
          opacity: fogFade * 0.75,
        }}
      />
    </section>
  );
}

// ─── Phone with overlaid animated chat ──────────────────────────────
// Sampled from new-mobile.svg (835×986). Bezel center at 60.66% of
// the canvas; symmetric outer wrapper 1013/986 places that center at
// 50% of the wrapper. Inner image-box is 82.4% of the outer, left-
// aligned. Image and overlay share the inner box so they translate
// together across viewports.

const SCREEN_RECT = {
  left: "41.9%",
  top: "8.6%",
  width: "36.7%",
  height: "64.7%",
} as const;

function PhoneFrame({
  phase,
  activeIndex,
  typingFor,
}: {
  phase: ChatPhase;
  activeIndex: number;
  typingFor: number | null;
}) {
  const exiting = phase === "exit";
  return (
    <div className="relative w-full">
      <div className="relative" style={{ aspectRatio: "1013 / 986" }}>
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${(835 / 1013) * 100}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new-mobile.svg"
            alt="Chronilogix coaching on a member's phone"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
            style={{
              // Bottom of the phone (the hand + arm) dissolves to
              // transparent so the hand visibly blends into the white
              // background — no hard cut-off. Mask runs across the
              // bottom 50% of the image with a long shallow curve so
              // the dissolve has no visible seam at any point. The
              // chat overlay sits above this layer and stays sharp.
              maskImage:
                "linear-gradient(180deg, #000 0%, #000 48%, rgba(0,0,0,0.95) 58%, rgba(0,0,0,0.78) 68%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.25) 87%, rgba(0,0,0,0.08) 95%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(180deg, #000 0%, #000 48%, rgba(0,0,0,0.95) 58%, rgba(0,0,0,0.78) 68%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.25) 87%, rgba(0,0,0,0.08) 95%, transparent 100%)",
            }}
          />

          <div
            className="absolute overflow-hidden"
            style={{
              ...SCREEN_RECT,
              background: "linear-gradient(180deg, #FCF8F1 0%, #F7F0E4 100%)",
              maskImage: "url('/mobile.svg')",
              WebkitMaskImage: "url('/mobile.svg')",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          >
            {/* Subtle top sheen — glassy highlight. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[18%]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
              }}
            />

            <ScreenChrome />

            <div
              className="absolute inset-x-[6%] bottom-[14%] top-[18%] flex flex-col justify-end gap-[3px] md:top-[19%] md:gap-[5px]"
              style={{
                maskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 8%, #000 22%, #000 100%)",
                WebkitMaskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 8%, #000 22%, #000 100%)",
              }}
            >
              {CHAT.map((turn, i) => (
                <ChatBubble
                  key={i}
                  turn={turn}
                  visible={i <= activeIndex && !exiting}
                  exiting={exiting}
                />
              ))}
              <TypingIndicator visible={typingFor !== null && !exiting} />
            </div>

            <ScreenInputBar />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenChrome() {
  return (
    <div className="absolute inset-x-0 top-0 flex items-center justify-between px-[6%] pt-[4.5%]">
      <svg
        viewBox="0 0 8 14"
        className="h-[8px] w-[5px] text-ink/45 md:h-[10px] md:w-[6px]"
        aria-hidden
        fill="none"
      >
        <path
          d="M6 1 1 7l5 6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex flex-col items-center">
        <div className="text-[7px] font-medium tracking-[-0.005em] text-ink/85 md:text-[9.5px] lg:text-[10.5px]">
          Coaching session
        </div>
        <div className="mt-[1.5px] flex items-center gap-[2.5px] text-[5px] text-ink/50 md:gap-[3px] md:text-[7px] lg:text-[7.5px]">
          <span className="relative inline-flex h-[3.5px] w-[3.5px]">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#22c55e] opacity-60 motion-reduce:animate-none" />
            <span className="relative h-[3.5px] w-[3.5px] rounded-full bg-[#22c55e]" />
          </span>
          listening
        </div>
      </div>
      <div
        aria-hidden
        className="relative inline-flex h-[10px] w-[10px] items-center justify-center rounded-full md:h-[12px] md:w-[12px]"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #FFB178 0%, #F9904D 55%, #DE7530 100%)",
          boxShadow: "0 0 0 0.5px rgba(0,0,0,0.05)",
        }}
      >
        <span
          aria-hidden
          className="absolute -bottom-[0.5px] -right-[0.5px] inline-block h-[4px] w-[4px] rounded-full border border-white bg-[#22c55e] md:h-[5px] md:w-[5px]"
        />
      </div>
    </div>
  );
}

function ScreenInputBar() {
  return (
    <div className="absolute inset-x-[7%] bottom-[3.5%] flex items-center gap-1 rounded-full border border-ink/8 bg-white/95 px-1.5 py-[3px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.10)] md:gap-2 md:px-2.5 md:py-[5.5px]">
      <span className="text-[7px] text-ink/30 md:text-[10px] lg:text-[11px]">
        +
      </span>
      <span className="flex-1 truncate whitespace-nowrap text-[5.5px] text-ink/40 md:text-[8.5px] lg:text-[9.5px]">
        Ask anything
      </span>
      <span
        aria-hidden
        className="inline-flex h-[12px] w-[12px] items-center justify-center rounded-full bg-[#F9904D] md:h-[14px] md:w-[14px] lg:h-[15px] lg:w-[15px]"
        style={{ boxShadow: "0 1px 3px rgba(249,144,77,0.35)" }}
      >
        <svg
          viewBox="0 0 10 10"
          className="h-[6px] w-[6px] md:h-[7px] md:w-[7px]"
          fill="none"
        >
          <path
            d="M1.5 8.5 8.5 1.5M3.5 1.5h5v5"
            stroke="white"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

function TypingIndicator({ visible }: { visible: boolean }) {
  return (
    <div
      className="flex w-full justify-start"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(4px)",
        transition:
          "opacity 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        height: visible ? "auto" : 0,
        overflow: "hidden",
      }}
      aria-hidden
    >
      <div className="flex flex-col items-start gap-[1.5px]">
        <span className="px-[2px] text-[5.5px] font-medium uppercase tracking-[0.08em] text-ink/45 md:text-[6.5px] lg:text-[7px]">
          Roni
        </span>
        <div className="flex items-center gap-[2px] rounded-[7px] rounded-bl-[2px] border border-ink/5 bg-white px-[6.5px] py-[4px] md:rounded-[8px] md:px-[8px] md:py-[5px]">
          <Dot delay={0} />
          <Dot delay={140} />
          <Dot delay={280} />
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-[3.5px] w-[3.5px] rounded-full bg-ink/35"
      style={{
        animation: "v5TypingDot 1.1s ease-in-out infinite",
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

function ChatBubble({
  turn,
  visible,
  exiting,
}: {
  turn: ChatTurn;
  visible: boolean;
  exiting: boolean;
}) {
  const isRoni = turn.who === "roni";

  return (
    <div
      className={`flex w-full ${isRoni ? "justify-start" : "justify-end"}`}
      style={{
        opacity: exiting ? 0 : visible ? 1 : 0,
        transform: exiting
          ? "translateY(-4px)"
          : visible
            ? "translateY(0)"
            : "translateY(6px)",
        transition:
          "opacity 460ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "opacity, transform",
        height: visible ? "auto" : 0,
        overflow: "hidden",
      }}
    >
      <div
        className={`flex flex-col gap-[1.5px] ${isRoni ? "items-start" : "items-end"} max-w-[86%]`}
      >
        <span className="px-[2px] text-[5.5px] font-medium uppercase tracking-[0.08em] text-ink/45 md:text-[6.5px] lg:text-[7px]">
          {isRoni ? "Roni" : "You"}
        </span>
        <div
          className={
            isRoni
              ? "rounded-[7px] rounded-bl-[2px] border border-ink/5 bg-white px-[6.5px] py-[3.5px] text-[6.5px] leading-[1.4] text-ink md:text-[8.5px] md:px-[9px] md:py-[5.5px] md:rounded-[8px] lg:text-[9.5px]"
              : "rounded-[7px] rounded-br-[2px] bg-gradient-to-br from-[#F9904D] to-[#FF7434] px-[6.5px] py-[3.5px] text-[6.5px] leading-[1.4] text-white md:text-[8.5px] md:px-[9px] md:py-[5.5px] md:rounded-[8px] lg:text-[9.5px]"
          }
          style={{
            boxShadow: isRoni
              ? "0 1px 2px rgba(0,0,0,0.03)"
              : "0 2px 6px -2px rgba(249,144,77,0.45)",
          }}
        >
          {turn.text}
        </div>
      </div>
    </div>
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
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/herocta:translate-x-1"
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

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
