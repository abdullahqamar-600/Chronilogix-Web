"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
// Hidden for now — restore by un-commenting the import and the <HeroPhoneMockup /> render below.
// import { HeroPhoneMockup } from "@/components/HeroPhoneMockup";

const HEADLINE_LINE_1 = "Helping chronic care reach every member, 24/7";
const HEADLINE_LINE_2 = "with AI that knows how people change.";
const SUB =
  "Built on Motivational Interviewing — the method clinicians have trusted for forty years to help people change behavior. Now always on.";
const PERSONAS = ["Employers", "Universities", "Health Plans", "App Partners"];

const REVEAL_DURATION_MS = 2400;
const REVEAL_WINDOW_RATIO = 4;

// Hardcoded asset URL is used as the fallback when Sanity is unreachable
// at build time (network blip, missing env vars, etc.) so the homepage never
// renders without a hero video. To swap the video permanently, upload a new
// one in Sanity Studio → Site Settings → Hero Video and publish.
const HERO_VIDEO_FALLBACK =
  "https://cdn.sanity.io/files/q1nckxts/production/aa702253c4350f53d0117201982fbb1d8d68cf4f.mp4";

export function Hero({ videoUrl }: { videoUrl?: string | null } = {}) {
  const resolvedVideoUrl = videoUrl ?? HERO_VIDEO_FALLBACK;
  const runwayRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
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

  // Mount reveal — drives revealProgress 0 → 1 once on load.
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

  // Scroll-driven exit — preserves the graceful handoff into Section 2.
  useEffect(() => {
    if (reducedMotion) {
      setScrollProgress(0);
      return;
    }
    let rafId = 0;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = runwayRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const runway = el.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), runway);
        setScrollProgress(runway > 0 ? scrolled / runway : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  // Bottom cluster fades out from progress 0.35 → 0.80, eased for smooth disappearance
  const bottomFadeRaw = clamp01((scrollProgress - 0.35) / (0.8 - 0.35));
  const bottomFade = 1 - easeInOutCubic(bottomFadeRaw);
  const bottomTranslate = (1 - bottomFade) * 16;

  const headlineLine1Words = useMemo(() => HEADLINE_LINE_1.split(" "), []);
  const headlineLine2Words = useMemo(() => HEADLINE_LINE_2.split(" "), []);
  const subWords = useMemo(() => SUB.split(" "), []);

  const totalWords =
    headlineLine1Words.length + headlineLine2Words.length + subWords.length;
  const stride = 1 / (totalWords - 1 + REVEAL_WINDOW_RATIO);
  const wordWindow = stride * REVEAL_WINDOW_RATIO;
  const easedReveal = easeOutCubic(revealProgress);

  // Tail elements (CTA + personas) join in the final stretch of the reveal.
  const tailReveal = clamp01((easedReveal - 0.78) / 0.22);

  // Shared word-renderer — uses a counter ref so headline + sub share one timeline.
  const counter = { i: 0 };
  const renderWords = (words: string[], keyPrefix: string) =>
    words.map((word, wi) => {
      const idx = counter.i++;
      const start = idx * stride;
      const end = start + wordWindow;
      const t = clamp01((easedReveal - start) / (end - start));
      const blur = (1 - t) * 3.5;
      const opacity = 0.12 + t * 0.88;
      return (
        <Fragment key={`${keyPrefix}-${wi}`}>
          <span
            className="inline-block"
            style={{
              filter: `blur(${blur}px)`,
              opacity,
              willChange: "filter, opacity",
            }}
          >
            {word}
          </span>
          {wi < words.length - 1 && " "}
        </Fragment>
      );
    });

  return (
    <div ref={runwayRef} className="relative h-[130vh]">
      <section
        className="sticky top-2 h-[calc(100svh-1rem)] overflow-hidden rounded-[28px] md:top-3 md:h-[calc(100svh-1.5rem)]"
        style={{ backgroundColor: "#D8C9BC" }}
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={resolvedVideoUrl}
          poster="/hero-landscape.jpeg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />

        {/* Cinematic left-anchored darkening — provides text contrast without reading as a UI scrim. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent"
        />
        {/* Soft bottom darkening so the lower cluster stays legible across any video frame. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
        />

        <div className="relative flex h-full w-full flex-col p-8 sm:p-10 md:p-14 lg:p-16 xl:p-20">
          <div
            className="mt-auto flex w-full flex-col gap-0"
            style={{
              opacity: bottomFade,
              transform: `translateY(${bottomTranslate}px)`,
              willChange: "opacity, transform",
              pointerEvents: bottomFade < 0.05 ? "none" : "auto",
            }}
          >
            <h1 className="max-w-4xl font-serif font-normal leading-[1.08] tracking-[-0.02em] text-white text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem]">
              {renderWords(headlineLine1Words, "h1")}{" "}
              {renderWords(headlineLine2Words, "h2")}
            </h1>

            <div className="flex w-full flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
              {/* TODO: Calendly URL */}
              <a
                href="#book-a-demo"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink shadow-soft transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                style={{
                  opacity: tailReveal,
                  transform: `translateY(${(1 - tailReveal) * 8}px)`,
                  willChange: "opacity, transform",
                }}
              >
                Book a Demo
                <Arrow />
              </a>

              <div className="flex flex-col gap-4 md:items-end md:text-right">
                <p className="max-w-md text-lg leading-relaxed text-white/80 md:text-xl">
                  {renderWords(subWords, "sub")}
                </p>

                <div
                  className="flex flex-wrap items-center gap-x-2.5 gap-y-2 whitespace-nowrap text-[14.5px] font-medium uppercase tracking-[0.16em] text-white/75 md:flex-nowrap md:justify-end"
                  style={{
                    opacity: tailReveal,
                    transform: `translateY(${(1 - tailReveal) * 8}px)`,
                    willChange: "opacity, transform",
                  }}
                >
                  {PERSONAS.map((p, i) => (
                    <Fragment key={p}>
                      <span>{p}</span>
                      {i < PERSONAS.length - 1 && (
                        <span aria-hidden className="text-white/35">
                          ·
                        </span>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <HeroPhoneMockup progress={scrollProgress} /> */}
      </section>
    </div>
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

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
