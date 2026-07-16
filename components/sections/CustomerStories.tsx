"use client";

import { useRef, useState } from "react";

// ScienceKen — the Dr. Resnicow "science behind Chronilogix" beat.
// Deliberately mirrors the MIExplainer section's layout/pattern so the
// two adjacent sections read as a matched pair: same rounded container,
// same container-page padding, same 5fr/7fr proportions and items-center
// grid, same contained rounded-card visual treatment. Only the sides are
// mirrored — here the visual (Dr. Resnicow) sits on the LEFT and the copy
// on the RIGHT.
export function ScienceKen() {
  return (
    <section
      id="science"
      aria-label="The science behind Chronilogix"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div className="container-page relative z-10 py-20 md:py-28 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
          {/* Left — Dr. Resnicow video/portrait, framed as a card. */}
          <KenVideo />

          {/* Right — copy. */}
          <div>
            <p className="eyebrow">The science behind Chronilogix</p>
            <h2
              className="mt-4 text-section font-serif font-normal text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Thirty years of clinical evidence,{" "}
              <span className="text-ink-muted">
                built into every conversation.
              </span>
            </h2>
            <p className="mt-6 body-prose md:mt-7">
              Dr. Kenneth Resnicow is our Chief Science Officer and one of
              the world&rsquo;s foremost authorities on Motivational
              Interviewing. We have translated his life&rsquo;s work into
              the AI that powers every Chronilogix conversation.
            </p>
            <div className="mt-8 md:mt-9">
              <a href="/about" className="btn-primary group/link">
                About
                <Arrow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// AetnaProof — the field-proof beat, split out of the old CustomerStories
// so it can sit lower on the page (just above Testimonials). Keeps the
// "customer-stories" id so the SectionGuide "Proof" anchor still resolves.
export function AetnaProof() {
  return (
    <section
      id="customer-stories"
      aria-labelledby="aetna-proof-heading"
      className="relative bg-paper-warm"
    >
      <h2 id="aetna-proof-heading" className="sr-only">
        Proof in the field
      </h2>

      <div className="container-page pt-16 pb-10 md:pt-24 md:pb-12 lg:pt-28 lg:pb-14">
        {/* Centered onto the same axis as the Testimonials carousel
            directly below, so the two cream sections read as one
            continuous "proof → voices" panel instead of flipping from a
            left-aligned two-column block to a centered one. Narrative
            order: source (Aetna) → the number → what it measures → the
            mechanism → the case study. */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="eyebrow">Proof in the field</p>

          {/* Source — establishes credibility before the number lands. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Aetna_Logo.svg"
            alt="Aetna"
            className="mt-6 h-8 w-auto md:h-9"
            draggable={false}
          />

          {/* Hero stat — owns the center the way the quotes do below it. */}
          <p className="mt-8 font-serif text-[64px] font-normal leading-none tracking-tight text-ink tabular-nums md:text-[88px]">
            53%{" "}
            <span className="text-brand-600">&rarr;</span>{" "}
            76%
          </p>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.14em] text-ink-muted">
            Member engagement
          </p>

          <p className="mt-8 max-w-md body-prose">
            Measured after nurse coaches were trained in Dr.
            Resnicow&rsquo;s method. Dropouts fell by{" "}
            <span className="text-ink">more than half</span>.
          </p>

          <a
            href="/case-studies/aetna"
            className="group/link mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-brand-600"
          >
            Read the Aetna case study
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

// CustomerStories — legacy composite (V2–V4 still import this). Renders
// the two split sections back-to-back so those pages are unaffected.
export function CustomerStories() {
  return (
    <>
      <ScienceKen />
      <AetnaProof />
    </>
  );
}

/* ----------------------------------------------------------------------------
 * KenVideo — the 60-second intro from Dr. Resnicow. Shows the portrait as a
 * poster with a play affordance; on play it swaps to native controls and
 * plays the clip. The clip file is pending — drop it at
 * /public/video/ken-resnicow-60s.mp4 and it plays with no further changes.
 * --------------------------------------------------------------------------*/

function KenVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const el = videoRef.current;
    if (!el) return;
    el.play().then(() => setPlaying(true)).catch(() => {
      // Clip not yet supplied (or blocked) — leave the poster in place.
    });
  };

  return (
    <div
      onClick={!playing ? start : undefined}
      className={`relative aspect-[3/2] overflow-hidden rounded-[24px] border border-ink/[0.08] bg-ink shadow-[0_10px_28px_-18px_rgba(20,8,2,0.18)] lg:aspect-auto lg:h-[455px] ${
        !playing ? "cursor-pointer" : ""
      }`}
    >
      {/* Ken sits in the left ~45% of the frame; object-[20%] keeps the
          crop biased toward him so he stays the focus in the taller,
          near-square card that matches the MI dialogue panel's height. */}
      <video
        ref={videoRef}
        poster="/ken-thumbnail.png"
        src="/video/ken-resnicow-60s.mp4"
        playsInline
        preload="none"
        controls={playing}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover object-[20%_center]"
      />

      {!playing && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/10"
          />

          <div className="pointer-events-none absolute bottom-8 left-8 right-8 text-white md:bottom-10 md:left-10 lg:bottom-12 lg:left-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/75">
              Chief Science Officer
            </p>
            <p className="mt-2 font-serif text-xl font-normal text-white md:text-2xl">
              Dr. Kenneth Resnicow
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Small inline arrow used by both CTAs. Lives in this file because nothing
 * else on the page uses this exact treatment.
 * --------------------------------------------------------------------------*/

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform group-hover/link:translate-x-0.5"
    >
      <path d="M3 7h8M7.5 3l3.5 4-3.5 4" />
    </svg>
  );
}
