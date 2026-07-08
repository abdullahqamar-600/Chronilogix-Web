"use client";

// ProblemV3 — V4's condensed Problem section.
//
// V1 renders six numeric facts inline, five viewports tall. V4 pushes
// the entire deep-dive into a bottom-anchored pop-up: the on-page
// story is headline → curated summary → resolution thesis; the pop-up
// carries the V1 numbered-facts UI (observations + six facts) so the
// visitor can go deeper when they want to.
//
// Layout:
//   - Section is one viewport tall (lg:h-screen), no in-section scroll.
//   - Left column: portrait, full viewport height.
//   - Right column: heading + two paragraphs + resolution line.
//   - Peek card is anchored to the section bottom edge (absolute,
//     bottom-0) so it visibly rises OUT of the section's bottom, not
//     partway up inside the right column.
//
// Motion:
//   - Scroll-linked progress (0..1) drives the peek card up as the
//     section enters the viewport, and eases the tilt from -3° → -1°.
//   - Respects prefers-reduced-motion (rests at final state).

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Fact = {
  /** Hero numeral — single dominant figure */
  lead: string;
  /** Optional small unit shown next to the lead (e.g. "wks") */
  unit?: string;
  /** Supporting sentence — may contain <em> for inline emphasis */
  body: React.ReactNode;
  /** Source attribution */
  source: string;
  /** Optional downstream cascade */
  waterfall?: string[];
};

// Six facts lifted from V1's Problem section verbatim. Retained even
// when a headline number is echoed in the V4 summary paragraph above,
// because each fact carries mechanism detail (11M undiagnosed, 300×
// suicide-risk multiplier, the ambivalence waterfall) that isn't in
// the summary. The pop-up is the deep-dive, so the deep-dive stays
// complete.
const FACTS: Fact[] = [
  {
    lead: "15M+",
    body: (
      <>
        global shortage of behavioral health and chronic care coaches.{" "}
        <em className="font-normal not-italic text-ink">
          The world cannot hire its way out of the gap.
        </em>
      </>
    ),
    source: "WHO Mental Health Atlas",
  },
  {
    lead: "40M",
    body: (
      <>
        Americans live with diabetes, including{" "}
        <em className="font-normal not-italic text-ink">
          11M undiagnosed
        </em>
        . Another{" "}
        <em className="font-normal not-italic text-ink">
          115M have prediabetes
        </em>
        , at risk of progressing without intervention.
      </>
    ),
    source: "CDC",
  },
  {
    lead: "61M+",
    body: (
      <>
        American adults live with mental illness,{" "}
        <em className="font-normal not-italic text-ink">1 in 5</em>, every
        year.{" "}
        <em className="font-normal not-italic text-ink">Nearly half</em>{" "}
        will meet diagnostic criteria in their lifetime.
      </>
    ),
    source: "SAMHSA · National Survey on Drug Use and Health",
  },
  {
    lead: "70%",
    body: (
      <>
        of patients discharged from the ER after a suicide attempt{" "}
        <em className="font-normal not-italic text-ink">
          never begin outpatient mental health treatment
        </em>
        . Suicide risk runs{" "}
        <em className="font-normal not-italic text-ink">300× higher</em> in
        the first week and{" "}
        <em className="font-normal not-italic text-ink">200× higher</em>{" "}
        across the first month for those left without follow-up.
      </>
    ),
    source: "JAMA Psychiatry · post-discharge cohort studies",
  },
  {
    lead: "$300B",
    body: (
      <>
        in U.S. prescriptions go unfilled every year, most because of{" "}
        <em className="font-normal not-italic text-ink">ambivalence</em>,
        not forgetting. The intervention that resolves ambivalence is
        conversation, not reminders.
      </>
    ),
    source: "Annals of Internal Medicine · WHO",
    waterfall: [
      "Prescription unfilled. Ambivalence wins quietly",
      "Follow up appointment skipped or rescheduled out",
      "Symptoms drift, the gap widens between visits",
      "Help arrives only after escalation, often in the ER",
    ],
  },
  {
    lead: "2 to 6",
    unit: "wks",
    body: (
      <>
        is the average wait for in person mental health care. Meanwhile,{" "}
        <em className="font-normal not-italic text-ink">
          human coaches stay scarce and expensive
        </em>
        .
      </>
    ),
    source: "WHO",
  },
];

const OBSERVATIONS = [
  "The costliest claims almost always begin as small, unaddressed risks between visits.",
  "The moments that matter most arrive off hours: shift workers and first responders need support at 2 AM, not 2 PM.",
  "Coaching and behavioral support rarely get reimbursed, so people wait until things worsen and the bill arrives as an ER visit, not an appointment.",
  "Diabetes hits Hispanic men 64% harder than average, yet they make up just 2% of the people the CDC's national prevention program reaches.",
  "Human care fluctuates with burnout, caseloads, and turnover.",
];

export function ProblemV3() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = () => setPrefersReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      setProgress(1);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Progress runs 0 → 1 as the section moves from "just entering"
      // (top at bottom of viewport) to "fully in view" (top at 0).
      const p = 1 - rect.top / vh;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [prefersReduced]);

  // The peek card is anchored to the SECTION bottom edge. translateY
  // is expressed as a percentage of the card's own height. At rest
  // (progress 0) the card is pushed 70% below section-bottom so only
  // its top ~30% (eyebrow + hero numeral) shows above the fold. At
  // in-view (progress 1) it eases up to 30% below — the bulk of the
  // card is now visible with the CTA sitting inside the section.
  const translateY = prefersReduced ? 30 : 70 - progress * 40; // 70% → 30%
  const rotate = prefersReduced ? -1 : -3 + progress * 2; // -3deg → -1deg

  return (
    <section
      ref={sectionRef}
      id="problem"
      className="relative overflow-hidden border-y border-ink/10 bg-paper-warm lg:h-screen"
      aria-labelledby="problem-heading-v3"
    >
      <div className="grid h-full lg:grid-cols-2">
        {/* Left — portrait. Frames the human consequence the numbers describe. */}
        <div className="relative p-2 lg:p-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] lg:aspect-auto lg:h-[calc(100vh-1rem)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/problem-portrait.png"
              alt="A man sits cross-legged on a bed in afternoon light, alone, mid-thought."
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"
            />
          </div>
        </div>

        {/* Right — narrative. Tightened vertical rhythm so headline +
            two paragraphs + resolution all fit inside one viewport. */}
        <div className="relative flex h-full flex-col justify-center px-6 py-10 md:px-14 md:py-14 lg:px-16 lg:py-16 xl:px-20">
          <h2
            id="problem-heading-v3"
            className="max-w-2xl text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            The most expensive moments{" "}
            <span className="text-ink-muted">
              happen between appointments.
            </span>
          </h2>

          <p className="mt-6 max-w-xl body-prose md:mt-8">
            The world is short more than{" "}
            <span className="text-ink">15 million</span> behavioral and
            chronic care coaches, and live coaching runs $60 to $70 per
            member per month &mdash; out of reach at population scale. Even
            for those who can access it, the wait for an appointment is two
            to six weeks.
          </p>

          <p className="mt-4 max-w-xl body-prose">
            So the cost compounds between visits:{" "}
            <span className="text-ink">$300 billion</span> in prescriptions
            unfilled from ambivalence rather than forgetting,{" "}
            <span className="text-ink">seven in ten</span> ER patients who
            never return, and the 11 PM stress eating, the skipped
            medication, the quiet slide back into old habits &mdash; the
            moments that decide outcomes happen where no one is watching.
          </p>

          <div className="mt-10 max-w-xl md:mt-12">
            <span aria-hidden className="block h-px w-12 bg-ink/20" />
            <p className="mt-5 font-serif text-row font-normal leading-[1.15] text-ink md:mt-6">
              AI coaches fill all of these gaps.
            </p>
          </div>
        </div>
      </div>

      {/* Peek card — anchored to the SECTION bottom edge so it rises
          out of the section's actual bottom, not partway up the right
          column. On desktop it centers within the right column via a
          two-column grid; on mobile it spans full width. Rounded top
          only; the bottom sits below the section fold (clipped by
          overflow-hidden). */}
      <div
        aria-hidden="false"
        className="pointer-events-none absolute inset-x-0 bottom-0 lg:grid lg:grid-cols-2"
      >
        <div className="hidden lg:block" aria-hidden />
        <div className="flex justify-center px-6 md:px-14 lg:px-16 xl:px-20">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-label="See where care breaks down between visits"
            className="peek-card pointer-events-auto group relative block w-full max-w-[540px] rounded-t-[28px] bg-paper text-left transition-transform duration-500 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 md:hover:[transform:translateY(20%)_rotate(-0.6deg)] motion-reduce:transition-none"
            style={{
              transform: `translateY(${translateY}%) rotate(${rotate}deg)`,
              boxShadow:
                "0 -44px 88px -28px rgba(72,40,20,0.28), 0 -16px 36px -16px rgba(72,40,20,0.14), 0 -1px 2px rgba(15,20,25,0.04)",
              transformOrigin: "50% 100%",
            }}
          >
            {/* Card interior — mirrors the top of the pop-up so the
                visitor recognises what will open. */}
            <div className="px-7 pt-9 pb-8 md:px-11 md:pt-12 md:pb-10">
              <p className="eyebrow">The problem, in detail</p>

              <div className="mt-5 flex items-baseline gap-5 md:mt-6 md:gap-6">
                <p className="font-serif text-stat-md font-normal leading-none text-ink">
                  6
                </p>
                <p className="max-w-[22ch] font-serif text-[13.5px] italic leading-[1.4] text-ink-muted md:text-[14.5px]">
                  places where the system quietly fails
                </p>
              </div>

              <p
                className="mt-8 max-w-[26ch] font-serif text-[22px] font-normal leading-[1.2] text-ink md:mt-9 md:text-[26px]"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                Where care breaks down between visits.
              </p>

              <p className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium tracking-[-0.005em] text-brand-700 transition-colors group-hover:text-brand-accent md:mt-8 md:text-[15px]">
                <span className="underline decoration-brand-700/25 underline-offset-[6px] transition-[text-decoration-color] duration-300 group-hover:decoration-brand-accent/60">
                  See the full breakdown
                </span>
              <svg
                aria-hidden
                width="16"
                height="16"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform duration-300 ease-out-quart group-hover:translate-x-1 motion-reduce:transition-none"
              >
                <path
                  d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </p>
          </div>
        </button>
        </div>
      </div>

      <ProblemDetailPopup open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

// V1-styled deep-dive rendered inside a portal-mounted pop-up. Carries
// the observations block + six numbered facts; excludes the heading
// and intro paragraph, which already live on the section itself.
function ProblemDetailPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      previousActive.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => {
        closeBtnRef.current?.focus();
      });
    } else if (previousActive.current) {
      previousActive.current.focus?.();
      previousActive.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-[100] bg-ink/45 backdrop-blur-md"
        style={{ animation: "fadeIn 240ms ease-out both" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="problem-detail-heading"
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex w-full max-w-[820px] max-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[28px] bg-paper-warm shadow-[0_40px_80px_-24px_rgba(15,20,25,0.35)] md:max-h-[calc(100svh-4rem)]"
          style={{ animation: "modalIn 320ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 md:right-7 md:top-7"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="overflow-y-auto px-7 py-12 md:px-14 md:py-16">
            <p className="eyebrow">The problem, in detail</p>
            <h2
              id="problem-detail-heading"
              className="mt-5 max-w-2xl font-serif text-[26px] font-normal leading-[1.15] text-ink md:mt-6 md:text-[32px] lg:text-[36px]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Six places where care breaks down between visits.
            </h2>

            {/* Observations — qualitative patterns that frame the
                numbered facts below. Same treatment as V1. */}
            <ul className="mt-10 space-y-6 md:mt-12 md:space-y-7">
              {OBSERVATIONS.map((line) => (
                <li
                  key={line}
                  className="flex max-w-xl gap-4 text-base leading-relaxed text-ink-soft md:text-lg"
                >
                  <span
                    aria-hidden
                    className="mt-[0.7em] inline-block h-2 w-2 shrink-0 rounded-full bg-brand"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {/* Numbered facts — V1's vertical stack, verbatim. */}
            <ol className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-20">
              {FACTS.map((fact, i) => (
                <FactPanel key={fact.lead} index={i} fact={fact} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

function FactPanel({ index, fact }: { index: number; fact: Fact }) {
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <li className="relative">
      {/* Index marker */}
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium tabular-nums text-ink-subtle">
          {indexLabel}.
        </span>
        <span aria-hidden className="block h-px w-8 bg-ink/10" />
      </div>

      {/* Hero numeral */}
      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-serif text-stat-lg font-normal text-ink">
          {fact.lead}
        </span>
        {fact.unit ? (
          <span className="font-serif text-row font-normal leading-none text-ink-muted">
            {fact.unit}
          </span>
        ) : null}
      </div>

      <p className="mt-5 max-w-lg body-prose">{fact.body}</p>

      {fact.waterfall ? (
        <ol className="relative mt-6 max-w-lg space-y-3">
          <span
            aria-hidden
            className="pointer-events-none absolute left-[7px] top-[12px] bottom-[12px] w-px bg-ink/12"
          />
          {fact.waterfall.map((step, i) => (
            <li
              key={step}
              className="relative flex gap-3 text-[15px] leading-snug text-ink-soft md:text-base"
            >
              <span className="relative z-10 w-5 shrink-0 pt-[2px] font-mono text-[11px] font-medium tabular-nums text-ink-subtle">
                <span className="inline-block bg-paper-warm px-px">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="flex-1">{step}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <p className="source-line mt-5">
        <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-brand" />
        Source · {fact.source}
      </p>
    </li>
  );
}
