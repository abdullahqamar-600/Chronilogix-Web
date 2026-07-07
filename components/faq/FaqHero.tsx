"use client";

/**
 * FAQ hero — the first block on /faq.
 *
 * Rhythm matches About & Product page opens: warm-paper card, small
 * eyebrow, serif hero headline, one supporting line, no image. Reads
 * as "this is where the plain-language answers live" without competing
 * with the section that follows.
 */
export function FaqHero() {
  return (
    <section
      id="faq-hero"
      className="relative overflow-hidden rounded-[20px] bg-paper-warm pt-20 pb-12 sm:rounded-[24px] sm:pt-28 sm:pb-16 md:rounded-[28px] md:pt-36 md:pb-20 lg:pt-44 lg:pb-24"
    >
      {/* Same brand-orange radial wash used on AboutScience — keeps the
          gravitational feel without a dark slab. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(249,144,77,0.18) 0%, rgba(249,144,77,0.05) 38%, transparent 68%)",
        }}
      />

      <div className="container-page relative">
        <div className="max-w-3xl">
          <p className="eyebrow">Questions, answered</p>
          <h1
            className="mt-3 text-hero font-serif font-normal text-ink md:mt-4"
            style={
              {
                textWrap: "balance",
                // Suppress the "plain-|language" hyphenation split on
                // narrow viewports — the visual break there hurts more
                // than the extra character-fit gains it.
                hyphens: "none",
                wordBreak: "normal",
              } as React.CSSProperties
            }
          >
            The plain-language answers{" "}
            <span className="text-ink-muted">
              to the questions we hear most.
            </span>
          </h1>
          <p className="mt-5 max-w-[62ch] body-prose md:mt-6">
            What Chronilogix is, how it&rsquo;s different from a chatbot,
            how care stays safe, how deployment works, and what makes the
            science defensible. If your question isn&rsquo;t here,{" "}
            <a
              href="#book-a-demo"
              className="underline decoration-brand-500/40 decoration-1 underline-offset-[3px] transition-colors hover:text-brand-700 hover:decoration-brand-600"
            >
              book a demo
            </a>{" "}
            and we&rsquo;ll answer it directly.
          </p>
        </div>
      </div>
    </section>
  );
}
