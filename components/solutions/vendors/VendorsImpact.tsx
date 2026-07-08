"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsImpact — dark slab, the receipts.
 *
 * The three numbers from the audio:
 *   • Replaces up to 80% of human coaching sessions
 *   • Roughly $5 per session
 *   • Up to 40% higher retention for vendors who bundle it
 *   • No cost to the vendor
 *
 * Structured as three big stat blocks + one "zero-line" footnote
 * (the "no cost to vendor" beat) so the CFO number lives visually
 * separated from the pricing math.
 *
 * Marked `data-nav-tone="dark"` so the site nav flips to its
 * over-dark styling while this section is under it (matches BrokerValue).
 */

const STATS: {
  figure: string;
  unit?: string;
  headline: string;
  detail: string;
}[] = [
  {
    figure: "80",
    unit: "%",
    headline: "of human coaching sessions replaced",
    detail:
      "Chronilogix picks up the calls, check-ins, and follow-throughs your clinical team used to run — without dropping quality.",
  },
  {
    figure: "$5",
    headline: "roughly, per coaching session",
    detail:
      "The cost curve payers, employers, and partners have been asking for. Not a rounding error — a category shift.",
  },
  {
    figure: "40",
    unit: "%",
    headline: "higher retention for vendors who bundle",
    detail:
      "Vendors offering Chronilogix alongside their products see up to forty percent stronger retention with the buyers they serve.",
  },
];

export function VendorsImpact() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      data-nav-tone="dark"
      aria-labelledby="vendors-impact-label"
      className="relative overflow-hidden rounded-[28px] bg-ink text-white"
    >
      {/* Ambient wash — deep brand at the top-right, midnight bloom
          bottom-left. Same technique BrokerValue uses so the two dark
          slabs feel like siblings. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 88% 12%, rgba(255,116,52,0.28), transparent 68%), radial-gradient(45% 40% at 10% 92%, rgba(228,90,28,0.16), transparent 72%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="max-w-[54ch]">
          <p className="reveal-row text-[13px] font-medium uppercase tracking-[0.14em] text-brand-300 [transition-delay:80ms]">
            The math
          </p>
          <h2
            id="vendors-impact-label"
            className="reveal-row mt-4 font-serif font-normal text-section text-white [transition-delay:180ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            The impact is immediate.{" "}
            <span className="text-brand-300 italic">And measurable.</span>
          </h2>
          <p className="reveal-row mt-5 max-w-[52ch] text-[15.5px] leading-relaxed text-white/70 md:text-lg [transition-delay:260ms]">
            Three numbers the buyers on the other side of your renewal
            table already know how to defend. Two of them replace
            spend. One of them lifts your retention curve.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 md:mt-20 md:grid-cols-3 md:gap-x-12">
          {STATS.map((stat, i) => {
            const delay = 400 + i * 140;
            return (
              <div
                key={stat.figure}
                className="reveal-row relative flex flex-col border-t border-white/15 pt-8 md:border-t-0 md:border-l md:pl-8 md:pt-0"
                style={{ transitionDelay: `${delay}ms` }}
              >
                {/* Vertical index — I / II / III */}
                <span className="absolute -top-3 left-0 font-serif text-[12px] italic text-brand-300 md:-left-2 md:top-0">
                  {["I", "II", "III"][i]}
                </span>

                <span className="flex items-baseline gap-1 font-serif text-[clamp(3.75rem,7vw,6.5rem)] font-normal leading-[0.9] tracking-[-0.03em] text-white">
                  {stat.figure}
                  {stat.unit && (
                    <span className="text-brand-300 text-[0.55em]">
                      {stat.unit}
                    </span>
                  )}
                </span>
                <p className="mt-4 max-w-[26ch] text-[15px] font-medium leading-snug text-white md:text-base">
                  {stat.headline}
                </p>
                <p className="mt-3 max-w-[34ch] text-[13.5px] leading-relaxed text-white/60">
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Zero-line — the "no cost to vendor" beat. Lives on its own
            row so it reads as the closing punch, not a bullet. */}
        <div className="reveal-row mt-16 flex flex-col items-start gap-4 rounded-2xl border border-white/12 bg-white/[0.04] p-6 backdrop-blur-sm md:mt-20 md:flex-row md:items-center md:gap-8 md:p-8 [transition-delay:940ms]">
          <span className="font-serif text-[3.75rem] font-normal leading-none text-brand-300 md:text-[4.5rem]">
            $0
          </span>
          <div className="max-w-[52ch]">
            <p className="text-[15px] font-medium text-white md:text-lg">
              No cost to the vendor.
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/65 md:text-[14.5px]">
              Chronilogix bundles alongside your existing product. You
              don&rsquo;t replace what you sell &mdash; you upgrade it,
              and you keep everything you built.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
