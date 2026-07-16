"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsReposition — "A Better Story for Buyers" (Section 7).
 *
 * The buyer-facing reframe, rebuilt as a "reframe ledger". Rather than two
 * scattered pill clouds, each row pairs one belief buyers hold about most
 * vendors (muted, struck through, receding) with how they see a vendor
 * running on Chronilogix (confident, one brand-lit keyword). The
 * transformation is the mechanic: five legible before → after lines the eye
 * walks straight down, closing on the punchline that the product itself
 * never changes.
 */

type Reframe = {
  before: string;
  after: ReactNode;
};

// Each row folds in one beat of the vendor story (impact, results, sustained
// engagement, outcome reporting, differentiation). One accent keyword per
// "after" phrase keeps the orange restrained rather than blanket-glowing.
const REFRAMES: Reframe[] = [
  {
    before: "Judged on a feature list",
    after: (
      <>
        Measured on <span className="text-brand-700">real impact</span>
      </>
    ),
  },
  {
    before: "Competing on price",
    after: (
      <>
        Competing on <span className="text-brand-700">results</span>
      </>
    ),
  },
  {
    before: "Delivery ends the story",
    after: (
      <>
        <span className="text-brand-700">Engagement</span> sustains it
      </>
    ),
  },
  {
    before: "No proof after the sale",
    after: (
      <>
        <span className="text-brand-700">Outcome reporting</span> on demand
      </>
    ),
  },
  {
    before: "One of many options",
    after: (
      <>
        The <span className="text-brand-700">obvious choice</span>
      </>
    ),
  },
];

// Understated arrow — points right on desktop, rotated down when the row
// stacks on mobile. Purely decorative; every row still reads as text.
function CrossoverArrow() {
  return (
    <span
      aria-hidden
      className="mx-auto flex h-8 w-8 rotate-90 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-600 sm:rotate-0"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M4 10h11m0 0-4-4m4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function VendorsReposition() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-reposition-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      {/* Sunrise wash — cool at the top-left (the past), warm rising into the
          bottom-right (the future the ledger resolves toward). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 8% 12%, rgba(90,100,112,0.06), transparent 72%), radial-gradient(60% 50% at 96% 92%, rgba(249,144,77,0.16), transparent 70%)",
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
            From commodity supplier to{" "}
            <span className="text-brand-700 italic">outcomes partner.</span>
          </h2>
          <p className="reveal-row mx-auto mt-6 max-w-[52ch] body-prose [transition-delay:260ms]">
            Healthcare buyers aren&rsquo;t simply evaluating products anymore.
            They&rsquo;re choosing partners who can prove measurable impact.
            Same product, told as a different story.
          </p>
        </div>

        {/* The reframe ledger — one before → after per line. */}
        <div className="reveal-row mx-auto mt-14 max-w-3xl md:mt-16 [transition-delay:320ms]">
          {/* Column identity headers — paired to the two sides, sm+ only. */}
          <div className="hidden grid-cols-[1fr_auto_1fr] items-baseline gap-6 pb-2 sm:grid">
            <p className="text-right text-[13px] font-medium tracking-[-0.005em] text-ink-subtle">
              How buyers see most vendors
            </p>
            <span className="h-8 w-8" aria-hidden />
            <p className="eyebrow text-left text-[13px]">
              How buyers see you on Chronilogix
            </p>
          </div>

          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {REFRAMES.map((r, i) => (
              <li
                key={r.before}
                className="grid grid-cols-1 items-center gap-3 py-6 text-center sm:grid-cols-[1fr_auto_1fr] sm:gap-6 sm:py-7 sm:text-left"
              >
                {/* Before — the old story, crossed out and receding. */}
                <p
                  className="reveal-row text-[15px] leading-snug text-ink-muted sm:text-right md:text-base"
                  style={{ transitionDelay: `${380 + i * 90}ms` }}
                >
                  <span className="line-through decoration-ink/25 decoration-1 underline-offset-2">
                    {r.before}
                  </span>
                </p>

                <div
                  className="reveal-row"
                  style={{ transitionDelay: `${420 + i * 90}ms` }}
                >
                  <CrossoverArrow />
                </div>

                {/* After — the new story, forward and confident. */}
                <p
                  className="reveal-row text-lg font-medium leading-snug text-ink sm:text-left md:text-xl"
                  style={{ transitionDelay: `${460 + i * 90}ms` }}
                >
                  {r.after}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="reveal-row mx-auto mt-16 max-w-[46ch] text-center font-serif text-2xl italic leading-snug text-ink md:mt-20 md:text-3xl [transition-delay:920ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Your product stays the same.{" "}
          <span className="text-brand-700">Its value grows.</span>
        </p>
      </div>
    </section>
  );
}
