"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsAfterDelivery — "The Reality Vendors Face: Delivery Isn't the
 * Finish Line" (Section 2).
 *
 * Layout (referenced from a three-panel band on a full-bleed background):
 * two translucent side panels of pill chips — what patients do (left) and
 * what it costs the vendor (right) — flank an elevated cream center card
 * carrying the narrative and the closing reframe. The whole band sits on
 * the Card 3 background image.
 *
 * TODO(assets): /card-3-bg.jpg is a placeholder stock image — swap for a
 * licensed background before launch.
 */

const BEHAVIORS = [
  "Patients lose motivation",
  "Treatment routines become difficult",
  "Life gets in the way",
  "Engagement slowly disappears",
];

const RESULTS = [
  "Adherence declines",
  "Retention drops",
  "Value gets harder to prove",
];

export function VendorsAfterDelivery() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-after-delivery-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3 lg:items-center">
          {/* Left — what patients do (chips). */}
          <ChipPanel
            label="What patients do"
            sub="After the product ships"
            items={BEHAVIORS}
            trend={false}
            baseDelay={320}
          />

          {/* Center — narrative + reframe, elevated. */}
          <div
            className="reveal-row order-first rounded-[24px] bg-white p-8 shadow-[0_30px_70px_-24px_rgba(15,20,25,0.35)] md:p-10 lg:order-none lg:-my-8 lg:z-10 [transition-delay:200ms]"
          >
            <p className="eyebrow">The reality vendors face</p>
            <h2
              id="vendors-after-delivery-label"
              className="mt-4 font-serif font-normal text-section text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Delivery isn&rsquo;t the{" "}
              <span className="text-ink-muted italic">finish line.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
              Products get prescribed, shipped, and then quietly underused.
              If you&rsquo;re still competing on features, price, or
              distribution, you&rsquo;re already losing.
            </p>
            <div className="mt-7 border-t border-ink/10 pt-6">
              <p
                className="font-serif text-xl font-normal leading-snug text-ink md:text-2xl"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                The product isn&rsquo;t the problem.{" "}
                <span className="text-brand-700">
                  What happens after delivery is.
                </span>
              </p>
            </div>
          </div>

          {/* Right — what it costs you (chips). */}
          <ChipPanel
            label="What it costs you"
            sub="Within the first few months"
            items={RESULTS}
            trend
            baseDelay={380}
          />
        </div>
      </div>
    </section>
  );
}

function ChipPanel({
  label,
  sub,
  items,
  trend,
  baseDelay,
}: {
  label: string;
  sub: string;
  items: string[];
  trend: boolean;
  baseDelay: number;
}) {
  return (
    <div
      className="reveal-row rounded-[24px] border border-ink/10 bg-white p-6 shadow-soft md:p-7"
      style={{ transitionDelay: `${baseDelay}ms` }}
    >
      <p className="font-serif text-xl font-normal leading-snug text-ink md:text-2xl">
        {label}
      </p>
      <p className="mt-1 text-[13px] text-ink-muted">{sub}</p>

      <div className="mt-6 flex flex-col items-start gap-2.5">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper-warm px-3.5 py-2 text-[13.5px] font-medium text-ink"
          >
            <span className="text-brand-700">
              {trend ? <DownTrendGlyph /> : <DotGlyph />}
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function DotGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8.5v4" />
      <circle cx="12" cy="15.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DownTrendGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 7l6 6 4-4 8 8" />
      <path d="M21 12v5h-5" />
    </svg>
  );
}
