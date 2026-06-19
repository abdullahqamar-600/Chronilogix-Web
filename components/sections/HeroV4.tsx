"use client";

import { useEffect, useState } from "react";

// V4 Hero — centered headline at top, isometric phone-in-hand mockup
// anchored beneath it, and three editorial value cards orbiting the phone
// on the same tilted plane. The whole composition reads as a single
// floating product moment, not three separate UI parts.
//
// Layout intent:
//   Row 1 — Centered serif headline + eyebrow.
//   Row 2 — Phone mockup as the visual anchor; three cards sit absolutely
//           around it on desktop (top-right, mid-left, mid-right/bottom),
//           each tilted toward the phone's plane so the scene feels iso.
//   Row 3 — Short Resnicow line + CTA, beneath the composition.
//
// On small screens the 3D conceit breaks more than it helps, so the
// cards collapse into a clean stacked column under the phone with the
// tilt removed.

const REVEAL_DURATION_MS = 2400;

// Isometric tilt shared by phone + cards. Tuned to match the V4 mockup:
// the phone leans slightly right (rotateZ) and away from the camera on
// its right edge (rotateY), with a soft rotateX so the top edge falls
// back. Cards reuse the same Y/Z so they share the phone's plane.
const ISO_PERSPECTIVE = "1600px";
const PHONE_TILT = "rotateX(4deg) rotateY(-10deg) rotateZ(-4deg)";
const CARD_TILT_BASE = "rotateX(4deg) rotateY(-10deg) rotateZ(-4deg)";

type CardDef = {
  eyebrow: string;
  title: string;
  body: string;
};

const CARDS: CardDef[] = [
  {
    eyebrow: "Clinically grounded",
    title: "30+ years of Motivational Interviewing.",
    body:
      "Every reply is shaped by the method Dr. Ken Resnicow has spent his career proving works.",
  },
  {
    eyebrow: "Whole-person aware",
    title: "Knows what matters outside the chart.",
    body:
      "Tracks family, goals, culture, and daily life: the context that makes change actually stick.",
  },
  {
    eyebrow: "Always supportive",
    title: "Never judges. Never preaches.",
    body:
      "Reads emotion in plain text and meets people where they are — especially on the hard days.",
  },
];

export function HeroV4() {
  const [revealProgress, setRevealProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRevealProgress(1);
      return;
    }
    let rafId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / REVEAL_DURATION_MS, 1);
      setRevealProgress(t);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const eased = easeOutCubic(revealProgress);
  const headlineFade = clamp01(eased / 0.5);
  const phoneFade = clamp01((eased - 0.18) / 0.55);
  const card1Fade = clamp01((eased - 0.32) / 0.5);
  const card2Fade = clamp01((eased - 0.42) / 0.5);
  const card3Fade = clamp01((eased - 0.52) / 0.5);
  const footFade = clamp01((eased - 0.55) / 0.5);

  return (
    <section
      id="hero"
      className="relative overflow-hidden rounded-[28px] bg-[#F6F2EC]"
    >
      <div className="container-page relative pb-12 pt-16 sm:pb-16 sm:pt-20 md:pb-16 md:pt-20 lg:pb-20 lg:pt-24">
        {/* ── Top: eyebrow + centered headline ────────────────────── */}
        <div
          className="mx-auto max-w-[900px] text-center"
          style={{
            opacity: headlineFade,
            transform: `translateY(${(1 - headlineFade) * 14}px)`,
            willChange: "opacity, transform",
          }}
        >
          <p className="eyebrow-muted mb-4 md:mb-5">
            Chronilogix &mdash; built with Dr. Ken Resnicow
          </p>
          <h1 className="mx-auto max-w-[18ch] font-serif font-normal text-ink leading-[1.04] tracking-[-0.025em] text-[34px] sm:text-[42px] md:text-[54px] lg:text-[64px] xl:text-[72px]">
            A coach that listens, knows, and shows up.
          </h1>
          <p className="body-prose mx-auto mt-5 max-w-[46ch] md:mt-6">
            Clinical-grade AI coaching for behavioral health and chronic care,
            available the moment a member needs it.
          </p>
        </div>

        {/* ── Composition: phone + orbiting cards ──────────────────
            Desktop: cards float absolutely around the phone with a shared
            iso-tilt. Mobile: cards stack under the phone, untilted. */}
        <div
          className="relative mx-auto mt-10 sm:mt-12 md:mt-12 lg:mt-14"
          style={{ perspective: ISO_PERSPECTIVE }}
        >
          {/* Composition frame — sized to fit the phone with cards
              orbiting around it on md+. Mobile lays out as a column. */}
          <div className="relative mx-auto flex w-full max-w-[1180px] flex-col items-center md:block md:h-[560px] lg:h-[600px] xl:h-[640px]">
            {/* Phone (in flow on mobile; absolutely centered on md+) */}
            <div
              className="relative z-20 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
              style={{
                transformStyle: "preserve-3d",
                opacity: phoneFade,
                willChange: "opacity, transform",
              }}
            >
              <div
                className="relative"
                style={{
                  transform: `${PHONE_TILT} translateY(${(1 - phoneFade) * 18}px)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Soft floor shadow under the phone — sells the iso plane */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-full -z-10 h-[60px] w-[68%] -translate-x-1/2 -translate-y-[24%] rounded-[50%] bg-black/25 blur-2xl"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/v4-mobile.png"
                  alt="Chronilogix coaching app on a member's phone, held in hand"
                  className="block h-auto w-[72vw] max-w-[280px] select-none drop-shadow-[0_50px_90px_rgba(15,20,25,0.28)] sm:max-w-[300px] md:w-[28vw] md:max-w-[300px] lg:w-[24vw] lg:max-w-[340px] xl:max-w-[360px]"
                  draggable={false}
                />
              </div>
            </div>

            {/* Card 1 — Clinically grounded. Top-right of the phone. */}
            <IsoCard
              card={CARDS[0]}
              fade={card1Fade}
              positionClass="md:absolute md:right-[3%] md:top-[4%] lg:right-[5%] lg:top-[6%] md:w-[280px] lg:w-[320px] xl:w-[340px]"
              tiltExtra="translateZ(40px)"
              mobileOrder="order-2"
            />

            {/* Card 2 — Whole-person aware. Mid-left of the phone. */}
            <IsoCard
              card={CARDS[1]}
              fade={card2Fade}
              positionClass="md:absolute md:left-[2%] md:top-[34%] lg:left-[4%] lg:top-[36%] md:w-[280px] lg:w-[320px] xl:w-[340px]"
              tiltExtra="translateZ(30px)"
              mobileOrder="order-3"
            />

            {/* Card 3 — Always supportive. Bottom-right of the phone. */}
            <IsoCard
              card={CARDS[2]}
              fade={card3Fade}
              positionClass="md:absolute md:right-[4%] md:bottom-[6%] lg:right-[6%] lg:bottom-[8%] md:w-[300px] lg:w-[340px] xl:w-[360px]"
              tiltExtra="translateZ(50px)"
              mobileOrder="order-4"
            />
          </div>
        </div>

        {/* ── Foot: short reinforce + CTA ─────────────────────────── */}
        <div
          className="mx-auto mt-10 flex max-w-[60ch] flex-col items-center gap-5 text-center md:mt-12"
          style={{
            opacity: footFade,
            transform: `translateY(${(1 - footFade) * 14}px)`,
            willChange: "opacity, transform",
          }}
        >
          <p className="font-serif font-normal text-ink leading-[1.2] tracking-[-0.015em] text-[20px] sm:text-[22px] md:text-[24px]">
            Built on the life&rsquo;s work of world-renowned{" "}
            <span className="whitespace-nowrap">Dr. Ken Resnicow</span>,
            in Motivational Interviewing.
          </p>
          <a href="#book-a-demo" className="btn-primary group/herocta">
            Book a Demo
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

function IsoCard({
  card,
  fade,
  positionClass,
  tiltExtra,
  mobileOrder,
}: {
  card: CardDef;
  fade: number;
  positionClass: string;
  tiltExtra: string;
  mobileOrder: string;
}) {
  return (
    <div
      className={`${positionClass} ${mobileOrder} z-30 mt-6 w-full max-w-[420px] md:mt-0`}
      style={{
        opacity: fade,
        willChange: "opacity, transform",
      }}
    >
      <div
        className="rounded-[20px] bg-white px-6 py-6 shadow-[0_28px_60px_-24px_rgba(15,20,25,0.30),0_8px_18px_-10px_rgba(15,20,25,0.18)] md:px-7 md:py-7"
        style={{
          // Mobile keeps cards flat; md+ tilts them to share the phone's plane.
          transform: `translateY(${(1 - fade) * 18}px)`,
        }}
      >
        <div
          className="hidden md:block"
          style={{
            transform: `${CARD_TILT_BASE} ${tiltExtra}`,
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
        >
          <CardBody card={card} />
        </div>
        <div className="md:hidden">
          <CardBody card={card} />
        </div>
      </div>
    </div>
  );
}

function CardBody({ card }: { card: CardDef }) {
  return (
    <>
      <p className="eyebrow">{card.eyebrow}</p>
      <h3 className="mt-3 font-serif text-[22px] font-normal leading-[1.15] tracking-[-0.015em] text-ink md:text-[24px] lg:text-[26px]">
        {card.title}
      </h3>
      <p className="mt-3 text-[15px] leading-[1.55] text-ink-muted md:text-[15.5px]">
        {card.body}
      </p>
    </>
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
