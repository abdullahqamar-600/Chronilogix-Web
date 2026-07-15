"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsBehaviorGap — "The Behaviour Gap" (Section 5).
 *
 * The biggest barriers to better outcomes aren't medical — they're human.
 * Five everyday barriers that quietly erode adherence after delivery,
 * each one something Chronilogix continuously supports patients through.
 *
 * Layout (referenced from a "process" split): a tall sticky image on the
 * left with a glass caption overlay, and the heading over a vertical stack
 * of barrier cards on the right, closing on the Chronilogix resolution
 * card. The reference's left overlay is a named client testimonial; we
 * carry only the section's own framing line there (no attribution), since
 * the project forbids anonymous/fabricated quotes.
 */

type Barrier = {
  title: string;
  body: string;
};

const BARRIERS: Barrier[] = [
  {
    title: "Fear & anxiety",
    body: "Patients often feel overwhelmed after diagnosis.",
  },
  {
    title: "Fatigue & burnout",
    body: "Motivation naturally decreases over time.",
  },
  {
    title: "Financial stress",
    body: "Cost concerns affect treatment consistency.",
  },
  {
    title: "Low health literacy",
    body: "Patients may not fully understand their care plan.",
  },
  {
    title: "Lack of ongoing support",
    body: "Without encouragement, many patients stop engaging.",
  },
];

export function VendorsBehaviorGap() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-gap-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-14 md:py-16 lg:py-20"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-8">
          {/* Left — tall image with a glass caption. Sticks while the
              barrier list scrolls on large screens. */}
          <div className="reveal-row [transition-delay:120ms]">
            <div className="relative min-h-[420px] overflow-hidden rounded-[24px] md:h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/behavior-gap-supplements.jpg"
                alt="A person taking daily supplement capsules alongside breakfast."
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {/* Frosted-glass caption — same surface-glass treatment as the
                  MI Explainer's EngageVisual (bright inset top edge + shine
                  band), with dark ink text for legibility on the light glass. */}
              <div className="surface-glass absolute inset-x-4 bottom-4 overflow-hidden rounded-2xl p-5 md:inset-x-5 md:bottom-5 md:p-6">
                <span
                  aria-hidden
                  className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-2xl"
                />
                <p className="relative font-serif text-lg font-normal leading-snug text-ink md:text-xl">
                  The biggest barriers to better outcomes aren&rsquo;t always
                  medical. They&rsquo;re human.
                </p>
              </div>
            </div>
          </div>

          {/* Right — heading over a plain divided list of barriers. */}
          <div>
            <p className="reveal-row eyebrow [transition-delay:60ms]">
              The behaviour gap
            </p>
            <h2
              id="vendors-gap-label"
              className="reveal-row mt-5 max-w-[22ch] font-serif font-normal text-section text-ink [transition-delay:160ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              We close the gap between{" "}
              <span className="text-brand-700 italic">
                prescription and progress.
              </span>
            </h2>

            <ul className="mt-8 grid grid-cols-1 gap-x-10 sm:grid-cols-2 md:mt-10">
              {BARRIERS.map((b, i) => (
                <li
                  key={b.title}
                  className={`reveal-row py-5 ${
                    i < BARRIERS.length - 1 ? "border-b border-ink/10" : ""
                  }`}
                  style={{ transitionDelay: `${300 + i * 80}ms` }}
                >
                  <h3 className="font-serif text-xl leading-tight text-ink md:text-2xl">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-[14.5px] leading-snug text-ink-soft">
                    {b.body}
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
