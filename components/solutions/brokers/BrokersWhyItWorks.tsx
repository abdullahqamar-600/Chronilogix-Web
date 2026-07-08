"use client";

import { useReveal, useReducedMotion } from "@/components/hooks/useReveal";

/**
 * BrokersWhyItWorks — "Why It Works for Self-Funded Plans".
 *
 * The one-sheet lists five reasons. Two of them are hard numbers ("up to
 * 70%" of routine human coaching replaced; "~1/20th" the cost) — those
 * get lifted into a two-tile stats band across the top. The remaining
 * three claims sit as a numbered list beneath, echoing the pillars
 * pattern used elsewhere on the site.
 */

type ReasonCard = {
  title: string;
  body: string;
};

const REASONS: ReasonCard[] = [
  {
    title: "Targets the top drivers of avoidable spend",
    body: "Diabetes, obesity, metabolic health, anxiety, depression, medication adherence — the conditions carrying the biggest line items in the claims report.",
  },
  {
    title: "Prevents minor issues from becoming major claims",
    body: "Members are engaged during onboarding and re-engaged daily, catching drift while it's still a habit conversation — not a hospitalization.",
  },
  {
    title: "Improves adherence, self-management, and early engagement",
    body: "Motivational Interviewing is designed to move members from ambivalence to action. The result is better follow-through on the interventions the plan already covers.",
  },
];

export function BrokersWhyItWorks() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="brokers-why-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-[42ch]">
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              Why it works for self-funded plans
            </p>
            <h2
              id="brokers-why-label"
              className="reveal-row mt-4 font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              A cost curve you can actually bend.
            </h2>
          </div>
          <p className="reveal-row eyebrow-subtle [transition-delay:260ms]">
            Five reasons &mdash; two you can quote to a CFO.
          </p>
        </div>

        {/* Two-tile stats band — the CFO-defensible numbers, lifted out
            of the reasons list so they carry weight independently. */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-6">
          <StatTile
            revealed={inView}
            reduced={reduced}
            delay={340}
            barGrow={0.7}
            barLabel="Human-coaching workload replaced"
            lead="Up to 70%"
            caption="of routine human coaching, replaced by Chronilogix"
            comparison="Live coaching bench → software-delivered coaching"
          />
          <StatTile
            revealed={inView}
            reduced={reduced}
            delay={460}
            barGrow={0.05}
            barLabel="Cost per member per month"
            lead="~1/20th"
            caption="the cost of live coaching, at comparable outcomes"
            comparison="$60–70 PEPM → $20–30 PEPM"
            afterTone
          />
        </div>

        {/* Three-column reason list — the remaining defensible claims,
            numbered so they read as a set, not a bag. */}
        <ol className="mt-16 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-3 md:gap-6 lg:gap-10">
          {REASONS.map((r, i) => {
            const numeral = ["III", "IV", "V"][i] ?? String(i + 3);
            const delay = 660 + i * 120;
            return (
              <li
                key={r.title}
                className="reveal-row group/reason flex flex-col gap-4 border-t border-ink/12 pt-6 transition-transform duration-400 ease-out-quart motion-reduce:transition-none md:border-t-0 md:border-l md:pl-7 md:pt-1 md:hover:-translate-y-1"
                style={{ transitionDelay: `${delay}ms` }}
              >
                <span className="font-serif text-[13px] italic tracking-[0.04em] text-brand-700">
                  {numeral}.
                </span>
                <h3 className="text-lg font-medium leading-snug text-ink transition-colors duration-400 ease-out-quart motion-reduce:transition-none group-hover/reason:text-brand-700 md:text-xl">
                  {r.title}
                </h3>
                <p className="body-quiet max-w-[38ch]">{r.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function StatTile({
  revealed,
  reduced,
  delay,
  barGrow,
  barLabel,
  lead,
  caption,
  comparison,
  afterTone,
}: {
  revealed: boolean;
  reduced: boolean;
  delay: number;
  barGrow: number;
  barLabel: string;
  lead: string;
  caption: string;
  comparison: string;
  afterTone?: boolean;
}) {
  const numeral = afterTone ? "II" : "I";
  const parts = comparison.split(/\s*→\s*/);
  const hasArrow = parts.length === 2;

  return (
    <div
      className="reveal-row rounded-[24px] border border-ink/10 bg-paper-warm p-7 md:p-9"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className="font-serif text-[12px] italic tracking-[0.04em] text-brand-700/80">
          {numeral}.
        </span>
        <span className="font-serif text-[12px] italic text-ink-muted">
          {barLabel}
        </span>
      </div>

      <p className="mt-6 font-serif text-stat-md font-normal leading-none text-ink">
        {lead}
      </p>

      <p className="mt-5 max-w-[36ch] text-base font-medium leading-snug text-ink md:text-lg">
        {caption}
      </p>

      {hasArrow ? (
        <p className="mt-3 font-serif text-[13px] italic leading-snug">
          <span className="text-ink/45">{parts[0]}</span>
          <span aria-hidden className="mx-1.5 not-italic text-brand-700">
            →
          </span>
          <span className="text-ink-soft">{parts[1]}</span>
        </p>
      ) : (
        <p className="mt-3 font-serif text-[13px] italic text-ink-muted">
          {comparison}
        </p>
      )}

      {/* Small bar viz — quiet illustrated companion to the number.
          Reads as a proportion, not a chart with UI chrome. */}
      <div className="mt-6 h-[6px] w-full rounded-full bg-ink/8">
        <span
          aria-hidden
          className="block h-[6px] origin-left rounded-full"
          style={{
            width: `${Math.round(barGrow * 100)}%`,
            background:
              afterTone
                ? "linear-gradient(90deg, #F9904D 0%, #FF7434 60%, #E45A1C 100%)"
                : "linear-gradient(90deg, #F9904D 0%, #FF7434 60%, #E45A1C 100%)",
            transform: revealed ? "scaleX(1)" : "scaleX(0)",
            transition: reduced
              ? undefined
              : `transform 900ms cubic-bezier(0.22,1,0.36,1) ${delay + 320}ms`,
          }}
        />
      </div>
    </div>
  );
}
