"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsClosingCTA — the sign-off.
 *
 * Verbatim from the audio's closing lines: "If you're ready to upgrade
 * outcomes, retention, and relevance, visit chronilogix.com.
 * Chronilogix — chronic coaching care that clicks."
 */
export function VendorsClosingCTA() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      id="book-a-demo"
      aria-labelledby="vendors-closing-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, rgba(249,144,77,0.20) 0%, rgba(249,144,77,0.06) 40%, transparent 75%)",
        }}
      />

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
        <p className="eyebrow">Chronic coaching care that clicks</p>

        <h2
          id="vendors-closing-label"
          className="reveal-row mx-auto mt-6 max-w-[20ch] font-serif font-normal text-display text-ink [transition-delay:120ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Ready to upgrade
          <br />
          <span className="text-brand-700">outcomes?</span>
        </h2>

        <div className="reveal-row mx-auto mt-8 max-w-[58ch] space-y-5 body-prose [transition-delay:280ms]">
          <p>
            If you&rsquo;re ready to upgrade outcomes, retention, and
            relevance, bring Chronilogix into your next partnership
            conversation. Same product. Stronger story. Numbers your
            buyers already know how to defend.
          </p>
        </div>

        <div className="reveal-row mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 [transition-delay:440ms]">
          {/* TODO: Calendly URL */}
          <a href="#book-a-demo" className="btn-primary group/cta">
            Book a partnership call
            <Arrow />
          </a>
          <a
            href="/chronilogix-mi-whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Download the vendor brief
          </a>
        </div>

        <div className="reveal-row mx-auto mt-14 flex flex-col items-center justify-center gap-x-6 gap-y-2 border-t border-ink/10 pt-8 font-serif text-[14px] italic text-ink-muted sm:flex-row [transition-delay:600ms]">
          <span>Chronic coaching care that clicks.</span>
          <span aria-hidden className="hidden h-[3px] w-[3px] rounded-full bg-ink/25 sm:inline-block" />
          <a
            href="https://chronilogix.com"
            className="not-italic font-medium text-ink transition-colors duration-200 ease-out-quart hover:text-brand-700"
          >
            chronilogix.com
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
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/cta:translate-x-1"
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
