"use client";

import { useReveal } from "@/components/hooks/useReveal";

export function AppPartnersClosingCTA() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <section
      id="book-a-demo"
      aria-labelledby="ap-closing-label"
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

      {/* Ambient orbs — same treatment as the Brokers closing so both
          deep-dive pages share the "living surface" signature. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full opacity-40 blur-3xl animate-orb-rotate-a"
        style={{
          background:
            "radial-gradient(circle, rgba(249,144,77,0.55) 0%, rgba(249,144,77,0) 65%)",
          transformOrigin: "60% 60%",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-16 h-80 w-80 rounded-full opacity-30 blur-3xl animate-orb-rotate-b"
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
        <p className="eyebrow">One integration, thirty years of science.</p>

        <h2
          id="ap-closing-label"
          className="reveal-row mx-auto mt-6 max-w-[20ch] font-serif font-normal text-display text-ink [transition-delay:120ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Ship the coaching
          <br />
          <span className="text-brand-700">your users deserve.</span>
        </h2>

        <div className="reveal-row mx-auto mt-10 max-w-[58ch] space-y-5 body-prose [transition-delay:280ms]">
          <p>
            Chronilogix is the clinical intelligence layer built to live
            inside other products. Bring Dr. Resnicow&rsquo;s methodology
            to your users &mdash; without waiting a decade to build it
            yourself.
          </p>
        </div>

        <div className="reveal-row mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 [transition-delay:440ms]">
          {/* TODO: Calendly URL */}
          <a href="#book-a-demo" className="group/pc btn-primary">
            Explore the partnership
            <Arrow />
          </a>
          <a
            href="/chronilogix-mi-whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Download the whitepaper
          </a>
        </div>

        <p className="reveal-row mx-auto mt-10 max-w-[54ch] body-quiet [transition-delay:600ms]">
          Grounded in 30 years of Motivational Interviewing research. Built
          for embedding. Available 24/7 to your users.
        </p>
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
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/pc:translate-x-1"
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

