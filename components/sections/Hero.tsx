"use client";

import { useEffect, useRef, useState } from "react";
import { HeroPhoneMockup } from "@/components/HeroPhoneMockup";

export function Hero() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
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
      setProgress(1);
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
        setProgress(runway > 0 ? scrolled / runway : 0);
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
  const bottomFadeRaw = clamp01((progress - 0.35) / (0.8 - 0.35));
  const bottomFade = 1 - easeInOutCubic(bottomFadeRaw);
  const bottomTranslate = (1 - bottomFade) * 16; // up to 16px down

  return (
    <div ref={runwayRef} className="relative h-[260vh]">
      <section
        className="sticky top-2 h-screen overflow-hidden rounded-[28px] md:top-3"
        style={{
          backgroundColor: "#D8C9BC",
          backgroundImage: "url('/hero-landscape.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-paper-warm/55 via-paper-warm/20 to-transparent"
        />

        <div className="container-page relative flex h-full flex-col items-center text-center">
          <div className="pt-24 md:pt-32">
            <h1 className="max-w-5xl text-display font-normal tracking-tight text-ink">
              Clinical-grade coaching.
              <br className="hidden md:block" />
              For every member you serve.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft md:mt-6 md:text-lg">
              For employers, universities, health plans, and app partners.
            </p>
          </div>

          <div
            className="mt-auto flex max-w-2xl flex-col items-center gap-6 pb-14 md:pb-20"
            style={{
              opacity: bottomFade,
              transform: `translateY(${bottomTranslate}px)`,
              willChange: "opacity, transform",
              pointerEvents: bottomFade < 0.05 ? "none" : "auto",
            }}
          >
            <p className="text-base leading-relaxed text-ink md:text-lg">
              Chronilogix is the AI-native behavioral health and chronic care
              coaching platform built on Dr. Ken Resnicow’s life’s work in
              Motivational Interviewing — clinical-grade outcomes at a
              fraction of the cost of live care.
            </p>

            {/* TODO: Calendly URL */}
            <a
              href="#book-a-demo"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-white shadow-soft transition hover:bg-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              Book a Demo
              <Arrow />
            </a>

            <GlassPill />
          </div>
        </div>

        <HeroPhoneMockup progress={progress} />
      </section>
    </div>
  );
}

function GlassPill() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/25 px-4 py-2 shadow-soft backdrop-blur-md">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M7 1.4v2.8M7 9.8v2.8M3.1 3.1l2 2M8.9 8.9l2 2M1.4 7h2.8M9.8 7h2.8M3.1 10.9l2-2M8.9 5.1l2-2"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-xs font-medium text-ink md:text-sm">
        Built on 30 years of clinical research in Motivational Interviewing
      </span>
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
