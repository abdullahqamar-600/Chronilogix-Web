"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates an integer from 0 to `target` with an ease-out-quart curve when
 * `active` flips true. Respects prefers-reduced-motion (snaps to final).
 * Used by the proof figure so the 58% lands as a beat, not a value.
 */
function CountUpInt({
  target,
  active,
  durationMs = 1400,
  delayMs = 0,
}: {
  target: number;
  active: boolean;
  durationMs?: number;
  delayMs?: number;
}) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setValue(target);
      return;
    }

    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t + delayMs;
      const elapsed = t - start;
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, target, durationMs, delayMs]);

  return <>{value}</>;
}

export function Outcome() {
  return (
    <section
      id="outcome"
      className="relative border-y border-ink/10 bg-paper-warm"
    >
      {/* Soft brand wash — sets a different visual key from the dense Problem section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(249,144,77,0.16) 0%, rgba(249,144,77,0.05) 35%, transparent 65%)",
        }}
      />

      <OutcomeIntro />
      <OutcomeGallery />
    </section>
  );
}

function OutcomeIntro() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
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
  }, []);

  const enter = reducedMotion;

  return (
    <div
      ref={ref}
      className="container-page relative py-24 md:py-32 lg:py-40"
    >
      {/* Promise — the headline reframes the problem from the inverse angle. */}
      <div
        className="max-w-4xl"
        style={{
          opacity: enter || inView ? 1 : 0,
          transform: enter || inView ? "translateY(0)" : "translateY(20px)",
          transition: enter
            ? "none"
            : "opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <p className="eyebrow">With Chronilogix</p>

        <h2 className="mt-4 text-hero font-serif font-normal text-ink">
          There in the moment.
          <br />
          <span className="text-ink-muted">
            24/7. No waitlist. Judgment-free. Consistent.
          </span>
        </h2>

        <p className="mt-7 max-w-[58ch] body-prose">
          Continuous coaching between visits, when traditional care goes
          quiet. Engagement rises, adherence improves, and avoidable
          utilization drops.
        </p>
      </div>

      {/* Proof band — the 58% is the climax of the section, but the
          previous treatment let the figure dominate at gigantic scale
          while the statement floated small beside it. The pair now reads
          as a single statement: the figure sits one notch above the
          supporting sentence in size, baseline-aligned, so the eye moves
          smoothly from number to claim instead of bouncing between two
          unrelated scales. */}
      <figure
        className="mt-20 max-w-4xl border-t border-ink/10 pt-12 md:mt-24 md:pt-14"
        style={{
          opacity: enter || inView ? 1 : 0,
          transform: enter || inView ? "translateY(0)" : "translateY(20px)",
          transition: enter
            ? "none"
            : "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 180ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 180ms",
        }}
      >
        {/* Frame this as a study citation, not a platform metric. The
            study name lives inside the sentence, the formal source
            attribution sits directly under the figure, and the closing
            bridge line separates the research finding from what
            Chronilogix actually does. */}
        <blockquote>
          <p className="font-serif text-section font-normal leading-[1.18] text-ink">
            <span
              aria-label="58 percent"
              className="mr-3 font-normal text-brand-700 text-[1.7em] leading-[0.9] align-[-0.08em] tabular-nums"
            >
              <CountUpInt target={58} active={inView} delayMs={220} />
              %
            </span>
            reduction in new Type 2 diabetes cases,{" "}
            <span className="text-ink-muted">
              demonstrated by the US Diabetes Prevention Program when
              lifestyle change is supported between appointments.
            </span>
          </p>
        </blockquote>

        <figcaption className="source-line mt-7 md:mt-8">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-brand"
          />
          Source · US Diabetes Prevention Program · CDC and NIH
        </figcaption>

        <p className="mt-6 max-w-[58ch] body-quiet md:mt-7">
          The kind of continuous, between-visit support Chronilogix scales.
        </p>
      </figure>
    </div>
  );
}

/**
 * Horizontal scroll-jacked gallery.
 *
 * Layout:
 *   [─── Image 1 (80vw) ───][─── Image 2 (80vw) ───]
 *   |                       |~~ overflow (60vw) ~~|
 *   ^ initially visible      ^ peeks (20vw) at start
 *
 * Mechanic: wrapper height = 100vh + horizontal travel. Inner viewport is
 * sticky h-screen. We translate the track from 0 → -travelPx as the user
 * scrolls past the wrapper top. Once the wrapper's bottom reaches the
 * viewport bottom, normal vertical scroll resumes.
 */
function OutcomeGallery() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect reduced-motion — skip the scroll-jacked horizontal travel and
    // leave the gallery in its initial state. Users still get the imagery.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let raf = 0;
    let ticking = false;

    const compute = () => {
      ticking = false;
      const wrap = wrapperRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const totalTravelPx = vw * 0.8;
      const rect = wrap.getBoundingClientRect();
      const scrollable = wrap.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      const progress = scrollable > 0 ? scrolled / scrollable : 0;
      const travel = progress * totalTravelPx;
      track.style.transform = `translate3d(${-travel}px, 0, 0)`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: "calc(100vh + 80vw)" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-paper-warm">
        {/* Vertically-centered image track.
            Top padding clears the nav (which lives at top:24 with h=81 →
            occupies viewport y=[24, 105]). items-center keeps the
            track sitting in the middle of the remaining canvas. */}
        <div className="flex h-full items-center justify-start overflow-hidden pt-24 md:pt-28">
          <div
            ref={trackRef}
            className="flex h-[86vh] items-stretch will-change-transform"
            style={{
              transform: "translate3d(0, 0, 0)",
              gap: "min(2vw, 24px)",
              paddingLeft: "min(3vw, 32px)",
            }}
          >
            <GalleryFrame
              src="/for-employees.png"
              alt="Member moments — coaching between appointments."
            />
            <GalleryFrame
              src="/for-universities.png"
              alt="Quiet moments where support is needed most."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryFrame({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <figure className="relative h-full w-[80vw] shrink-0 overflow-hidden rounded-[24px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        draggable={false}
      />
    </figure>
  );
}
