"use client";

import { useReveal } from "@/components/hooks/useReveal";
import { AETNA_QUOTE } from "@/components/NamedQuote";

export function AppPartnersProof() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      data-nav-tone="dark"
      aria-labelledby="ap-proof-label"
      className="relative overflow-hidden rounded-[28px] bg-ink text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(255,116,52,0.18), transparent 65%), radial-gradient(45% 35% at 0% 100%, rgba(249,144,77,0.08), transparent 70%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 text-center md:py-32 lg:py-40"
      >
        <p
          id="ap-proof-label"
          className="reveal-row text-[14px] font-medium tracking-[-0.005em] text-white/70 [transition-delay:80ms]"
        >
          Proof from the underlying platform
        </p>

        <figure className="mt-10">
          <blockquote
            className="reveal-row mx-auto max-w-[22ch] font-serif font-medium tracking-tight text-section text-white [transition-delay:220ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            <span className="text-brand-500">“</span>
            {AETNA_QUOTE.quote}
            <span className="text-brand-500">”</span>
          </blockquote>
          <figcaption className="reveal-row mt-8 text-sm uppercase tracking-[0.18em] text-white/60 [transition-delay:360ms]">
            {AETNA_QUOTE.attribution}
          </figcaption>
        </figure>

        <p className="reveal-row mx-auto mt-10 max-w-[52ch] text-[15px] leading-relaxed text-white/70 [transition-delay:500ms]">
          The same Chronilogix engine your app would embed.
        </p>
      </div>
    </section>
  );
}

