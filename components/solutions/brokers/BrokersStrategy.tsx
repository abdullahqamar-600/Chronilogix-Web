"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersStrategy — "Chronilogix is a front-door claims mitigation
 * strategy" section. Paper-warm surface so the beat sits softer than the
 * Reality card above.
 *
 * Layout is a two-column resolve: a small anchor block on the left that
 * repeats the positioning as a labeled callout, and a two-paragraph
 * argument on the right explaining the mechanism (24/7 AI + MI + NIH
 * research base + no clinician bottleneck).
 *
 * A small horizontal "engagement earlier" strip below the copy makes the
 * mechanism visible: the muted right end is the traditional care horizon,
 * the brand-orange left band is the Chronilogix engagement window.
 */

const CHIPS = [
  { label: "24/7", note: "Available every hour" },
  { label: "MI-trained", note: "Motivational Interviewing" },
  { label: "30+ yrs", note: "NIH-funded research base" },
  { label: "No clinician bottleneck", note: "Scales without hiring" },
];

export function BrokersStrategy() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="brokers-strategy-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              The Chronilogix approach
            </p>
            <h2
              id="brokers-strategy-label"
              className="reveal-row mt-4 max-w-[18ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              A front-door claims mitigation strategy &mdash;{" "}
              <span className="text-ink-muted italic">
                built into the plan, not bolted on.
              </span>
            </h2>

            {/* Anchor tile — repeats the positioning as a labeled block
                the broker can literally screenshot and hand to a CFO. */}
            <div
              className="reveal-row mt-10 rounded-2xl border border-ink/10 bg-white p-6 shadow-soft md:p-7 [transition-delay:340ms]"
            >
              <p className="eyebrow-muted">In one sentence</p>
              <p className="mt-3 font-serif text-lg italic leading-snug text-ink md:text-xl">
                &ldquo;Engage members before minor issues escalate into
                high-cost claims &mdash; at roughly one-twentieth the cost
                of live coaching.&rdquo;
              </p>
              <p className="mt-4 font-serif text-[13px] italic text-ink-muted">
                Straight from the Chronilogix broker one-sheet.
              </p>
            </div>
          </div>

          <div className="max-w-[62ch] space-y-6 body-prose">
            <p className="reveal-row [transition-delay:280ms]">
              Chronilogix delivers 24/7 AI-driven chronic and behavioral
              health coaching that meets members long before minor issues
              become high-cost claims. Onboarding, daily check-ins, goal
              tracking, and progress reporting all live inside one product
              &mdash; and inside a plan design your CFO can actually
              defend.
            </p>
            <p className="reveal-row [transition-delay:420ms]">
              Our AI coaches are trained in Motivational Interviewing and
              grounded in thirty years of NIH-funded research from Dr. Ken
              Resnicow. Clinically sound behavior change at scale, without
              relying on the same shrinking bench of human clinicians every
              other vendor is trying to hire.
            </p>

            {/* Chip row — the four defensible claims from the positioning,
                each with a small italic footnote so it reads like a card,
                not a marketing pill. */}
            <ul
              className="reveal-row grid grid-cols-2 gap-3 pt-4 md:grid-cols-4 md:gap-4 [transition-delay:560ms]"
            >
              {CHIPS.map((chip) => (
                <li
                  key={chip.label}
                  className="group/chip rounded-xl border border-ink/10 bg-white px-4 py-4 transition-colors duration-300 ease-out-quart motion-reduce:transition-none hover:border-brand-300"
                >
                  <p className="font-serif text-lg leading-none text-brand-700">
                    {chip.label}
                  </p>
                  <p className="mt-2 font-serif text-[12px] italic leading-snug text-ink-muted">
                    {chip.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
