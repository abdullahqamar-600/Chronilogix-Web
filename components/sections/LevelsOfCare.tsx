"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Three Levels of Care
 *
 * Vertical-stack section. Each level is one full-width row split into
 * two columns:
 *   - Left: identity (eyebrow, serif title, supporting line) with an
 *     artifact stacked vertically below.
 *   - Right: lead-in sentence and bullet list.
 *
 * Copy is sourced verbatim from the IP one-sheet (`Chronilogix Docx/IP.pdf`)
 * — same headers, same lead-in sentences, same bullet text, same order.
 *
 * Header structure mirrors the IP.pdf top-of-page:
 *   - Eyebrow: "Three Levels of Care"
 *   - Heading: "Chronilogix meets people where they are, across every
 *     gap in the care continuum."
 *
 * Closing tagline: "One engine. Three levels. Every gap covered." —
 * matches its position at the bottom of the IP one-sheet.
 *
 * Artifacts (one per level) are quiet typographic specimens — small
 * data panels rather than illustrated diagrams. Same panel structure
 * across all three (label → key/value rows → brand-highlighted row),
 * so they read as a coherent family. Each artifact is contextual to
 * its level:
 *   - L01: "Care available today" — every traditional channel
 *     unavailable / waitlisted; only Chronilogix is `Available now`.
 *   - L02: "Pre-session briefing for Dr. Chen" — the actual handoff
 *     document the therapist receives between sessions.
 *   - L03: "Consistency log · last 30 sessions" — the measurable
 *     uniformity only a digital coach can prove (no variance, no bias
 *     flags, cultural adaptation active, lowest cost tier).
 *
 * No italics, no hairline dividers, no card chrome — readability and
 * IP-section register.
 */

type ArtifactRow = {
  label: string;
  value: string;
};

type Artifact = {
  caption: string;
  rows: ArtifactRow[];
  /** Final row, highlighted with a brand dot + brand-700 value. */
  highlight: ArtifactRow;
};

type Level = {
  ordinal: string;
  label: string;
  subhead: string;
  lead: string;
  bullets: string[];
  artifact: Artifact;
  /** Background image used as the blurred backdrop behind the artifact's
   *  framed figure-card. Pulled from existing site assets so the
   *  artifact frames share visual language with SessionWalkthrough. */
  visualBg: string;
};

const LEVELS: Level[] = [
  {
    ordinal: "Level 01",
    label: "First Line of Care",
    subhead: "Where no other coverage exists",
    lead: "For the people who fall through the cracks of traditional care:",
    bullets: [
      "Rural communities with limited provider access",
      "Those who cannot afford deductibles",
      "Patients who have exhausted their covered counseling sessions",
      "Anyone in between scheduled appointments",
      "Available 24/7 when live coaches are not",
      "Bridges the typical 2–6 week wait for a human appointment",
      "Cost-efficient access for almost anyone",
    ],
    artifact: {
      caption: "Care available today",
      rows: [
        { label: "In-clinic appointment", value: "3 weeks out" },
        { label: "Covered sessions", value: "0 of 6 left" },
        { label: "After-hours support", value: "Closed" },
        { label: "Sliding-scale therapist", value: "Waitlist" },
      ],
      highlight: { label: "Chronilogix", value: "Available now" },
    },
    visualBg: "/card-1-bg.jpg",
  },
  {
    ordinal: "Level 02",
    label: "Hybrid Process",
    subhead: "Human + AI, working together",
    lead: "Combines the depth of human coaching with the consistency of AI:",
    bullets: [
      "Extends the value of each appointment by supporting the patient in between sessions",
      "Continuously collects information for the therapist so no progress is lost",
      "Delivers cost efficiency and scalability without sacrificing quality of care",
    ],
    artifact: {
      caption: "Pre-session briefing · Dr. Chen",
      rows: [
        { label: "Last session", value: "Tue, Sep 16" },
        { label: "Check-ins since", value: "4" },
        { label: "Practice maintained", value: "Breathing exercise" },
        { label: "Open questions", value: "Med timing (×2)" },
      ],
      highlight: { label: "Status", value: "Ready for Friday" },
    },
    visualBg: "/pattern.png",
  },
  {
    ordinal: "Level 03",
    label: "Digital Only",
    subhead: "For those who prefer it this way",
    lead: "A growing category of cohorts who get better outcomes with a fully digital coach:",
    bullets: [
      "Certain ethnic and cultural backgrounds where a digital coach reduces barriers",
      "No bias, no judgment — consistent every session",
      "Uniform, reliable treatment regardless of provider variability",
      "The most cost-efficient option available",
    ],
    artifact: {
      caption: "Consistency log · last 30 sessions",
      rows: [
        { label: "Same coach", value: "30 of 30" },
        { label: "Tone variance", value: "None detected" },
        { label: "Provider bias flags", value: "0" },
        { label: "Cultural adaptation", value: "Active" },
      ],
      highlight: { label: "Cost tier", value: "Lowest available" },
    },
    visualBg: "/card-3-bg.jpg",
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

export function LevelsOfCare({
  hideEyebrow = false,
}: { hideEyebrow?: boolean } = {}) {
  return (
    <div>
      {/* Header — eyebrow + heading. The long sentence (was the subhead
          in v2) now sits as the section heading at text-hero scale.
          That's the IP.pdf hierarchy: the eyebrow is the doc title, the
          long sentence is the editorial promise. */}
      <div className="max-w-5xl">
        {hideEyebrow ? null : (
          <p className="eyebrow">Three Levels of Care</p>
        )}
        <h3
          className={`${hideEyebrow ? "" : "mt-4"} max-w-4xl text-hero font-serif font-normal text-ink`.trim()}
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Chronilogix meets people where they are, across every gap in the
          care continuum.
        </h3>
      </div>

      {/* Vertical level stack — one full-width row per level. Generous
          vertical rhythm (gap-16/20/24) does the separating; no hairline
          dividers between rows. */}
      <div className="mt-16 flex flex-col gap-16 md:mt-20 md:gap-20 lg:gap-24">
        {LEVELS.map((level, i) => (
          <LevelRow key={level.ordinal} level={level} index={i} />
        ))}
      </div>

      {/* Closing tagline — the short anchor from the bottom of the IP
          one-sheet. Sits as the section's punctuation, not a separate
          heading. Centered to read as a closing beat. */}
      <div className="mt-20 md:mt-24 lg:mt-28">
        <p
          className="mx-auto max-w-3xl text-center font-serif text-section font-normal text-ink"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          One engine. Three levels. Every gap covered.
        </p>
      </div>
    </div>
  );
}

function LevelRow({ level, index }: { level: Level; index: number }) {
  const { ref, inView } = useInView<HTMLElement>(0.15);

  return (
    <article
      ref={ref}
      className="grid gap-10 md:grid-cols-12 md:gap-10 lg:gap-14"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      {/* LEFT column — identity above, artifact below. The two share
          the same column so they read as one editorial block. */}
      <div className="md:col-span-5">
        {/* Identity */}
        <div>
          <p className="eyebrow">{level.ordinal}</p>
          <h4 className="mt-3 text-section font-serif font-normal text-ink">
            {level.label}
          </h4>
          <p className="mt-4 body-quiet">{level.subhead}</p>
        </div>

        {/* Framed artifact block — same outer treatment as
            SessionWalkthrough's step cards: aspect-locked rounded
            frame, blurred pattern backdrop, paper gradient wash, and a
            centered white figure-card holding the contextual artifact.
            Aspect 4:5 (slightly portrait) sits comfortably inside the
            5-col left column without overshooting the right column's
            content height. */}
        <div className="mt-10 md:mt-12">
          <ArtifactBlock
            artifact={level.artifact}
            bg={level.visualBg}
            active={inView}
          />
        </div>
      </div>

      {/* RIGHT column — lead-in + bullets. Offset by 1 col on md+ for
          breathing room. */}
      <div className="md:col-span-6 md:col-start-7">
        <p className="body-prose text-ink-soft">{level.lead}</p>
        <ul className="mt-6 space-y-4 md:mt-7">
          {level.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex gap-4 body-prose text-ink-soft"
            >
              <span
                aria-hidden
                className="mt-[0.7em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ── Artifact block ─────────────────────────────────────────────────────────
 * Visual treatment lifted from SessionWalkthrough's step cards so the
 * two sections read as a single design language:
 *
 *   1. Outer card: aspect-locked, rounded-2xl, overflow-hidden.
 *   2. Blurred background image (the same warm-cream pattern assets
 *      SessionWalkthrough uses — `card-1-bg.jpg`, `pattern.png`,
 *      `card-3-bg.jpg`) at scale-110 + blur-md.
 *   3. Paper-gradient legibility wash on top.
 *   4. Centered white figure-card with the same warm-brown shadow +
 *      `ring-1 ring-ink/[0.04]` SessionWalkthrough uses.
 *   5. Inside the figure-card: caption + 4 key/value rows + 1
 *      brand-highlighted final row.
 *
 * Brand orange appears only on the highlight row. Rows cascade in with
 * a 60ms stagger after the figure-card fades up — matching
 * SessionWalkthrough's animation grammar.
 * --------------------------------------------------------------------------*/

function ArtifactBlock({
  artifact,
  bg,
  active,
}: {
  artifact: Artifact;
  bg: string;
  active: boolean;
}) {
  const playState = active ? "running" : "paused";

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bg}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/65 via-paper/55 to-paper/70" />

      <div className="relative flex h-full items-center justify-center p-6 md:p-8">
        <figure
          className="relative w-full max-w-[320px] rounded-[18px] bg-white/95 p-5 shadow-[0_18px_40px_-14px_rgba(40,25,15,0.22),0_2px_8px_-2px_rgba(40,25,15,0.08)] ring-1 ring-ink/[0.04]"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <figcaption className="text-[12px] font-medium tracking-tight text-ink-muted">
            {artifact.caption}
          </figcaption>
          <dl className="mt-4 space-y-3 text-[13.5px] leading-normal">
            {artifact.rows.map((row, i) => (
              <ArtifactRow
                key={row.label}
                label={row.label}
                value={row.value}
                playState={playState}
                delayMs={320 + i * 60}
              />
            ))}
            <ArtifactRow
              label={artifact.highlight.label}
              value={artifact.highlight.value}
              highlight
              playState={playState}
              delayMs={320 + artifact.rows.length * 60}
            />
          </dl>
        </figure>
      </div>
    </div>
  );
}

function ArtifactRow({
  label,
  value,
  highlight = false,
  playState,
  delayMs,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  playState: "running" | "paused";
  delayMs: number;
}) {
  return (
    <div
      className="flex items-baseline justify-between gap-4"
      style={{
        animation: `fadeUp 460ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delayMs}ms forwards`,
        animationPlayState: playState,
        opacity: 0,
      }}
    >
      <dt
        className={
          highlight
            ? "flex items-center gap-2 font-medium text-ink"
            : "text-ink-muted"
        }
      >
        {highlight ? (
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-brand"
          />
        ) : null}
        <span>{label}</span>
      </dt>
      <dd
        className={
          highlight
            ? "font-medium text-brand-700"
            : "text-ink-soft tabular-nums"
        }
      >
        {value}
      </dd>
    </div>
  );
}
