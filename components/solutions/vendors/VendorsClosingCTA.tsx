"use client";

/**
 * VendorsClosingCTA — the sign-off (Final CTA).
 *
 * Mirrors the site Footer's closing treatment: a cream rounded card with a
 * full-bleed marquee of soft portrait cards over a centered demo CTA —
 * re-voiced for the vendor page ("Upgrade outcomes without changing your
 * product").
 */

const CAROUSEL = [
  { src: "/card-1-bg.jpg", aspect: "3/4", w: "w-[260px] md:w-[300px]" },
  {
    src: "/generated-images/chronilogix-soft-flower-senior-portrait.png",
    aspect: "3/4",
    w: "w-[260px] md:w-[300px]",
  },
  { src: "/card-3-bg.jpg", aspect: "3/4", w: "w-[260px] md:w-[300px]" },
  {
    src: "/generated-images/chronilogix-soft-flower-family-portrait.png",
    aspect: "3/4",
    w: "w-[260px] md:w-[300px]",
  },
];

export function VendorsClosingCTA() {
  return (
    <section
      id="book-a-demo"
      aria-labelledby="vendors-closing-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40"
    >
      {/* Full-bleed marquee carousel — identical treatment to the footer. */}
      <div className="relative mt-14 overflow-hidden md:mt-16 lg:mt-20" aria-hidden>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper-warm to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper-warm to-transparent md:w-24" />

        <ul
          className="flex w-max items-end gap-6"
          style={{
            animation: "footerMarquee 56s linear infinite",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {[0, 1, 2, 3].flatMap((loopIndex) =>
            CAROUSEL.map((img, i) => {
              const offsets = ["mb-0", "mb-6", "mb-2", "mb-8", "mb-3", "mb-5"];
              const offset = offsets[i % offsets.length];
              return (
                <li key={`${loopIndex}-${i}`} className={`shrink-0 ${img.w} ${offset}`}>
                  <div
                    className="overflow-hidden rounded-[22px] border border-ink/[0.04] bg-paper shadow-[0_10px_28px_-18px_rgba(20,8,2,0.22)]"
                    style={{ aspectRatio: img.aspect }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
                </li>
              );
            }),
          )}
        </ul>
      </div>

      {/* Centered closing CTA. */}
      <div className="container-page mt-24 text-center md:mt-32 lg:mt-40">
        <h2
          id="vendors-closing-label"
          className="mx-auto text-display font-serif font-normal text-ink"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          <span className="md:whitespace-nowrap">Upgrade outcomes.</span>
          <br />
          <span className="text-brand-700">
            Without changing your product.
          </span>
        </h2>
        <p className="mx-auto mt-7 max-w-[52ch] body-quiet">
          Book a 30 minute demo. We&rsquo;ll walk through a live coaching
          session, the clinical method behind it, and how it works alongside
          the product you already ship.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {/* TODO: Calendly URL */}
          <a href="#book-a-demo" className="btn-primary">
            Book a Demo
          </a>
          <a
            href="/chronilogix-mi-whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group/wp btn-secondary"
          >
            Download the Whitepaper
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
          </a>
        </div>
      </div>
    </section>
  );
}
