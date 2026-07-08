"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { BrokersFrontDoorViz } from "./BrokersFrontDoorViz";

/**
 * BrokersHero — opening beat for /solutions/brokers.
 *
 * Content lifted from the Chronilogix Broker One-Sheet (V1). Headline
 * carries the front-door positioning; the tagline row echoes the doc's
 * "Reduce claims. Improve access. Stay affordable." tri-clause.
 *
 * The right column shows a small "front-door" visual — a member arriving
 * at the moment of engagement, months before they'd otherwise surface in
 * claims. See BrokersFrontDoorViz for the geometry + motion.
 */

// Two-line headline: bright ink first, then a brand-muted resolve.
// The heading names brokers directly and their specific benefit — a
// door opener that survives CFO scrutiny. The eyebrow above already
// carries the "brokers & consultants" audience label; the headline
// pays it off with the value promise instead of repeating the tag.
const HEADLINE_LINES: { text: string; tone: "bright" | "muted" }[] = [
  { text: "A door opener brokers can defend.", tone: "bright" },
  { text: "The one CFOs actually sign.", tone: "muted" },
];

// Tri-clause tagline directly from the one-sheet subhead.
const TAGLINE_CLAUSES = [
  "Reduce claims.",
  "Improve access.",
  "Stay affordable.",
];

const REVEAL_DURATION_MS = 2200;
const REVEAL_WINDOW_RATIO = 4;

export function BrokersHero() {
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
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / REVEAL_DURATION_MS, 1);
      setRevealProgress(t);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const headlineWords = useMemo(
    () =>
      HEADLINE_LINES.flatMap((line, li) =>
        line.text.split(" ").map((word) => ({ word, line: li, tone: line.tone })),
      ),
    [],
  );
  const totalWords = headlineWords.length;
  const stride = 1 / (totalWords - 1 + REVEAL_WINDOW_RATIO);
  const wordWindow = stride * REVEAL_WINDOW_RATIO;
  const easedReveal = easeOutCubic(revealProgress);

  const subTailReveal = clamp01((easedReveal - 0.5) / 0.5);
  const taglineReveal = clamp01((easedReveal - 0.62) / 0.38);
  const ctasReveal = clamp01((easedReveal - 0.78) / 0.22);
  const imageReveal = clamp01((easedReveal - 0.35) / 0.55);

  let wordIdx = 0;
  const renderLine = (lineIndex: number) => {
    const words = headlineWords.filter((w) => w.line === lineIndex);
    return words.map((w, wi) => {
      const idx = wordIdx++;
      const start = idx * stride;
      const end = start + wordWindow;
      const t = clamp01((easedReveal - start) / (end - start));
      const blur = (1 - t) * 3.5;
      const opacity = 0.12 + t * 0.88;
      const color = w.tone === "bright" ? "#0F1419" : "#E45A1C";
      return (
        <Fragment key={`l${lineIndex}-${wi}`}>
          <span
            className="inline-block"
            style={{
              filter: `blur(${blur}px)`,
              opacity,
              color,
              willChange: "filter, opacity",
            }}
          >
            {w.word}
          </span>
          {wi < words.length - 1 && " "}
        </Fragment>
      );
    });
  };

  return (
    <section
      aria-labelledby="brokers-hero-label"
      className="relative overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(120deg, #FFF3E8 0%, #FBF5EE 42%, #F4EEE4 100%)",
      }}
    >
      {/* Warm radial glow — anchors the hero in brand color without a
          hard band. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 12% 8%, rgba(249,144,77,0.22), transparent 70%), radial-gradient(45% 40% at 92% 90%, rgba(228,90,28,0.14), transparent 72%)",
        }}
      />

      <div className="container-page relative pt-32 pb-24 md:pt-40 md:pb-28 lg:pt-48 lg:pb-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <p
              className="eyebrow"
              style={{
                opacity: subTailReveal,
                transform: `translateY(${(1 - subTailReveal) * 6}px)`,
              }}
            >
              For benefits brokers &amp; consultants
            </p>

            <h1
              id="brokers-hero-label"
              className="mt-5 font-serif font-normal text-display"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {HEADLINE_LINES.map((_, li) => (
                <span key={li} className="block">
                  {renderLine(li)}
                </span>
              ))}
            </h1>

            {/* Tri-clause tagline — reads as a hard cadence rather than a
                paragraph. Each clause has a thin brand-dot separator on
                desktop; on mobile they wrap without the dot. */}
            <p
              className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-serif text-xl leading-snug text-ink md:mt-8 md:text-2xl"
              style={{
                opacity: taglineReveal,
                transform: `translateY(${(1 - taglineReveal) * 6}px)`,
                willChange: "opacity, transform",
              }}
            >
              {TAGLINE_CLAUSES.map((clause, i) => (
                <Fragment key={clause}>
                  <span>{clause}</span>
                  {i < TAGLINE_CLAUSES.length - 1 && (
                    <span
                      aria-hidden
                      className="hidden h-[5px] w-[5px] rounded-full bg-brand-accent md:inline-block"
                    />
                  )}
                </Fragment>
              ))}
            </p>

            <p
              className="mt-6 max-w-[52ch] body-prose"
              style={{
                opacity: subTailReveal,
                transform: `translateY(${(1 - subTailReveal) * 8}px)`,
                willChange: "opacity, transform",
              }}
            >
              Chronilogix delivers 24/7 AI chronic and behavioral care
              coaching &mdash; grounded in thirty years of{" "}
              <span className="text-ink">Dr. Ken Resnicow&rsquo;s</span>{" "}
              NIH-funded Motivational Interviewing research &mdash; that
              engages members before minor issues escalate into high-cost
              claims. Measurable cost containment for your self-funded
              book, not another fragmented point solution.
            </p>

            <div
              className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
              style={{
                opacity: ctasReveal,
                transform: `translateY(${(1 - ctasReveal) * 8}px)`,
                willChange: "opacity, transform",
              }}
            >
              <a
                href="/chronilogix-mi-whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group/wp btn-primary"
              >
                Download the Broker One-Sheet
                <Arrow />
              </a>
              {/* TODO: Calendly URL */}
              <a href="#book-a-demo" className="btn-secondary">
                Book a partnership call
              </a>
            </div>

            {/* Micro-callout — the phone number sits here as a
                credibility receipt, mirroring the one-sheet's footer. */}
            <p
              className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 font-serif text-[13px] italic text-ink-muted"
              style={{
                opacity: ctasReveal,
                transform: `translateY(${(1 - ctasReveal) * 8}px)`,
              }}
            >
              <span>Behavioral and chronic care coaching that clicks.</span>
              <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-ink/25" />
              <a
                href="tel:+16465221447"
                className="not-italic font-medium text-ink transition-colors duration-200 ease-out-quart hover:text-brand-700"
              >
                (646) 522-1447
              </a>
            </p>
          </div>

          {/* Right-column signature visual — the "front door" moment. */}
          <div
            className="relative"
            style={{
              opacity: imageReveal,
              transform: `translateY(${(1 - imageReveal) * 14}px)`,
              willChange: "opacity, transform",
            }}
          >
            <BrokersFrontDoorViz />
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/wp:translate-x-1"
    >
      <path
        d="M3 7h6m0 0L6 4m3 3-3 3"
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
