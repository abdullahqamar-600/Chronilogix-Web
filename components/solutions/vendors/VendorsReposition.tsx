"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsReposition — "A Better Story for Buyers: Stand Out in a Crowded
 * Market" (Section 7).
 *
 * Buyers aren't just evaluating products — they're choosing partners who
 * can demonstrate measurable impact. Rather than re-listing coaching
 * features (already covered in Introducing / Meet Rooney / Business
 * Impact), this section makes the buyer-facing reframe its own point: a
 * "just another supplier" vs "an outcomes partner" contrast, folding in
 * the two things unique to this beat — outcome reporting and
 * differentiation — and closing on "your product stays the same; its
 * value grows."
 */
// The buyer's reframe as a sunrise transformation: dashed, faded
// commodity-supplier habits (left/past) give way to glowing outcomes-partner
// strengths (right/future). Horizontal offsets scatter the pills so they
// echo the reference's arc rather than sitting in rigid columns.
const PAST_PILLS = [
  "Competing on price",
  "Feature checklists",
  "One-time delivery",
  "Usage drop-off",
  "No outcome data",
];
const PAST_X = [-6, 14, 2, 20, 8];

const FUTURE_PILLS = [
  "Measurable impact",
  "Sustained adherence",
  "24/7 engagement",
  "Outcome reporting",
  "Clear differentiation",
];
const FUTURE_X = [6, 18, 26, 30, 4];

export function VendorsReposition() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-reposition-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 8% 15%, rgba(255,116,52,0.10), transparent 72%), radial-gradient(50% 40% at 95% 88%, rgba(249,144,77,0.16), transparent 70%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="w-full text-center">
          <p className="reveal-row eyebrow [transition-delay:60ms]">
            A better story for buyers
          </p>
          <h2
            id="vendors-reposition-label"
            className="reveal-row mt-4 font-serif font-normal text-section text-ink [transition-delay:160ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Stand out in a{" "}
            <span className="text-brand-700 italic">crowded market.</span>
          </h2>
          <p className="reveal-row mx-auto mt-6 max-w-[52ch] body-prose [transition-delay:260ms]">
            Healthcare buyers aren&rsquo;t simply evaluating products
            anymore. They&rsquo;re choosing partners who can demonstrate
            measurable impact.
          </p>
        </div>

        {/* Supplier → partner contrast, rendered as a sunrise split: faded
            dashed "commodity" habits on the left give way to glowing
            "outcomes partner" strengths on the right. */}
        <div className="reveal-row relative mt-12 md:mt-16 [transition-delay:320ms]">
          <div className="relative">
            <div className="relative grid grid-cols-1 gap-y-12 px-6 py-14 sm:grid-cols-2 sm:gap-x-6 md:px-12 md:py-20">
              {/* Vertical divider between past and future (two-column only). */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-10 left-1/2 hidden w-px -translate-x-1/2 sm:block"
                style={{ backgroundColor: "rgba(15,20,25,0.14)" }}
              />
              {/* From the past — commodity supplier */}
              <div className="flex flex-col items-center gap-4">
                <p className="mb-3 font-serif text-2xl text-ink-muted md:text-3xl">
                  From the past
                </p>
                {PAST_PILLS.map((label, i) => (
                  <div
                    key={label}
                    className="flex w-full justify-center"
                    style={{ transform: `translateX(${PAST_X[i]}px)` }}
                  >
                    <span
                      className="reveal-row inline-block whitespace-nowrap rounded-full border border-dashed border-ink/25 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted md:text-[12.5px]"
                      style={{ transitionDelay: `${380 + i * 90}ms` }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* To the future — outcomes partner */}
              <div className="flex flex-col items-center gap-4">
                <p className="mb-3 font-serif text-2xl text-brand-700 md:text-3xl">
                  To the future
                </p>
                {FUTURE_PILLS.map((label, i) => (
                  <div
                    key={label}
                    className="flex w-full justify-center"
                    style={{ transform: `translateX(${FUTURE_X[i]}px)` }}
                  >
                    <span
                      className="reveal-row inline-block whitespace-nowrap rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white md:text-[12.5px]"
                      style={{
                        backgroundColor: "#F9904D",
                        boxShadow:
                          "0 0 22px rgba(249,144,77,0.45), 0 6px 16px -6px rgba(228,90,28,0.5)",
                        transitionDelay: `${440 + i * 90}ms`,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p
          className="reveal-row mx-auto mt-16 max-w-[46ch] text-center font-serif text-2xl italic leading-snug text-ink md:mt-20 md:text-3xl [transition-delay:620ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Your product stays the same.{" "}
          <span className="text-brand-700">Its value grows.</span>
        </p>
      </div>
    </section>
  );
}
