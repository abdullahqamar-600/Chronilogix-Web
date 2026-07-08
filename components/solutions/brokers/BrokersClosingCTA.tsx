"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersClosingCTA — final beat, closing on the one-sheet's tagline
 * ("Behavioral and Chronic Care Coaching that Clicks!"). Carries both
 * primary actions and the phone number from the doc's footer.
 */
export function BrokersClosingCTA() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      id="book-a-demo"
      aria-labelledby="brokers-closing-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, rgba(249,144,77,0.18) 0%, rgba(249,144,77,0.05) 40%, transparent 75%)",
        }}
      />

      {/* Slow-drifting ambient orbs — reuse existing orbRotate keyframes
          so the reduced-motion behavior stays consistent site-wide. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full opacity-40 blur-3xl animate-orb-rotate-a"
        style={{
          background:
            "radial-gradient(circle, rgba(249,144,77,0.55) 0%, rgba(249,144,77,0) 65%)",
          transformOrigin: "60% 60%",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-16 h-80 w-80 rounded-full opacity-30 blur-3xl animate-orb-rotate-b"
        style={{
          background:
            "radial-gradient(circle, rgba(255,116,52,0.45) 0%, rgba(255,116,52,0) 65%)",
          transformOrigin: "40% 40%",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-28 text-center md:py-36 lg:py-44"
      >
        <p className="eyebrow">For your next pitch</p>

        <h2
          id="brokers-closing-label"
          className="reveal-row mx-auto mt-6 max-w-[20ch] font-serif font-normal text-display text-ink [transition-delay:120ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Coaching that
          <br />
          <span className="text-brand-700">clicks.</span>
        </h2>

        <div className="reveal-row mx-auto mt-8 max-w-[58ch] space-y-5 body-prose [transition-delay:280ms]">
          <p>
            Reduce claims. Improve access. Stay affordable. Bring
            Chronilogix into your next self-funded conversation &mdash; a
            behavioral and chronic care coaching layer your clients can
            measure, your CFO peers will defend, and members actually use.
          </p>
        </div>

        <div className="reveal-row mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 [transition-delay:440ms]">
          <a
            href="/chronilogix-mi-whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group/wp btn-primary"
          >
            Download the Broker One-Sheet
            <Arrow />
          </a>
          {/* TODO: Calendly URL */}
          <a href="#book-a-demo" className="btn-secondary">
            Book a partnership call
          </a>
        </div>

        {/* Contact strip — mirrors the doc's footer bar. */}
        <div className="reveal-row mx-auto mt-14 flex flex-col items-center justify-center gap-x-6 gap-y-2 border-t border-ink/10 pt-8 font-serif text-[14px] italic text-ink-muted sm:flex-row [transition-delay:600ms]">
          <span>Behavioral and chronic care coaching that clicks.</span>
          <span aria-hidden className="hidden h-[3px] w-[3px] rounded-full bg-ink/25 sm:inline-block" />
          <a
            href="tel:+16465221447"
            className="not-italic font-medium text-ink transition-colors duration-200 ease-out-quart hover:text-brand-700"
          >
            (646) 522-1447
          </a>
          <span aria-hidden className="hidden h-[3px] w-[3px] rounded-full bg-ink/25 sm:inline-block" />
          <a
            href="https://chronilogix.com"
            className="not-italic font-medium text-ink transition-colors duration-200 ease-out-quart hover:text-brand-700"
          >
            Chronilogix.com
          </a>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/wp:translate-x-1"
    >
      <path
        d="M3 7h6m0 0L6 4m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
