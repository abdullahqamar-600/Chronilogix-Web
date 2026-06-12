"use client";

export function CustomerStories() {
  return (
    <section
      id="customer-stories"
      aria-labelledby="customer-stories-heading"
      className="relative bg-paper-warm"
    >
      <h2 id="customer-stories-heading" className="sr-only">
        The science behind Chronilogix
      </h2>

      <div className="grid lg:grid-cols-2">
        {/* Left — two compact blocks. Block 1 routes deeper into Dr.
            Resnicow's story on the About page; block 2 routes into the
            Aetna case study (page to follow). The page itself stays a
            short, scannable summary. */}
        <div className="flex flex-col lg:grid lg:grid-rows-2 lg:min-h-[calc(100vh-1rem)]">
          {/* 1 — About Dr. Resnicow (cream). flex-col + justify-center so
              content sits in the middle of the row when the row stretches
              to match the Aetna block. */}
          <div className="flex flex-col justify-center bg-paper-warm px-8 py-14 md:px-14 md:py-16 lg:px-16 lg:py-20 xl:px-20">
            <p className="eyebrow">The science behind Chronilogix</p>

            <h2
              className="mt-4 max-w-2xl text-hero font-serif font-normal text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Thirty years of clinical evidence,{" "}
              <span className="text-ink-muted">
                built into every conversation.
              </span>
            </h2>

            <p className="mt-8 max-w-md body-prose">
              Dr. Kenneth Resnicow is our Chief Science Officer and one of
              the world&rsquo;s foremost authorities on Motivational
              Interviewing. We have translated his life&rsquo;s work into
              the AI that powers every Chronilogix conversation.
            </p>

            <a
              href="/about"
              className="group/link mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-ink transition-colors hover:text-brand-600"
            >
              About
              <Arrow />
            </a>
          </div>

          {/* 2 — Aetna case study (white). Same flex-col + justify-center
              treatment so the two blocks render at equal heights on lg+. */}
          <div className="flex flex-col justify-center bg-white px-8 py-14 md:px-14 md:py-16 lg:px-16 lg:py-20 xl:px-20">
            <p className="eyebrow">Proof in the field</p>

            <div className="mt-6 max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Aetna_Logo.svg"
                alt="Aetna"
                className="h-7 w-auto md:h-8"
                draggable={false}
              />

              <p className="mt-6 font-serif text-5xl font-normal leading-none tracking-tight text-ink tabular-nums md:text-6xl">
                53%{" "}
                <span className="text-brand-600">&rarr;</span>{" "}
                76%
              </p>
              <p className="mt-3 text-[15px] font-medium text-ink-soft md:text-base">
                Member engagement, after nurse coaches were trained in Dr.
                Resnicow&rsquo;s method. Dropouts fell by{" "}
                <span className="text-ink">more than half</span>.
              </p>

              <a
                href="/case-studies/aetna"
                className="group/link mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-ink transition-colors hover:text-brand-600"
              >
                Read the Aetna case study
                <Arrow />
              </a>
            </div>
          </div>
        </div>

        {/* Right — sticky image */}
        <div className="relative order-first p-2 lg:order-last lg:p-2">
          <div className="lg:sticky lg:top-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] lg:aspect-auto lg:h-[calc(100vh-1rem)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ken-thumbnail.png"
                alt="Dr. Kenneth Resnicow, Chief Science Officer of Chronilogix, seated in conversation."
                className="absolute inset-0 h-full w-full object-cover object-left"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
              />

              <div className="absolute bottom-8 left-8 right-8 text-white md:bottom-10 md:left-10 lg:bottom-12 lg:left-12">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/75">
                  Chief Science Officer
                </p>
                <p className="mt-2 font-serif text-xl font-normal text-white md:text-2xl">
                  Dr. Kenneth Resnicow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Small inline arrow used by both CTAs. Lives in this file because nothing
 * else on the page uses this exact treatment.
 * --------------------------------------------------------------------------*/

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform group-hover/link:translate-x-0.5"
    >
      <path d="M3 7h8M7.5 3l3.5 4-3.5 4" />
    </svg>
  );
}
