"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersStrategy — "Introducing Chronilogix: The Front Door to Smarter
 * Claims Prevention" (Section 4).
 *
 * Answers the fourth question in the narrative arc: how does Chronilogix
 * solve it? Continuous AI coaching instead of waiting for intensive care,
 * resulting in earlier intervention, stronger engagement, and lower
 * long-term costs.
 *
 * Layout (referenced from a "What it's like working with …" bento): chip
 * eyebrow + serif heading over a three-column grid —
 *   • Left  : the positioning statement as a large serif block, with the
 *             Dr. Ken Resnicow / MI grounding as a footer tag. (No client
 *             testimonial: Chronilogix has no approved broker quote, and
 *             the project forbids anonymous/fabricated quotes.)
 *   • Middle: an on-brand photo (reused from public/ as a stand-in until a
 *             final asset lands).
 *   • Right : two stat cards (24/7, 30+ yrs) stacked over a dark-ink
 *             "Book a Demo" CTA card.
 *
 * Tones translated to Chronilogix's brand: light brand-orange tint cards
 * (brand-50) with ink text, one dark-ink CTA card. The reference's green
 * palette and its real accreditation badges are not carried over.
 */

const STATS = [
  {
    value: "24/7",
    caption: "Coaching available every hour — no waiting for a clinician's calendar.",
  },
  {
    value: "30+ yrs",
    caption: "Of NIH-funded Motivational Interviewing research behind every conversation.",
  },
];

// Same background treatment as the Roni AI agent card: a blurred warm pattern
// masked so the color rises from the bottom edge, under a milky white overlay
// that dissolves it into white near the top. The wash floor is lifted (0.35)
// so the warmth reads on these smaller cards the same way the tall agent card
// shows it. Renders as an absolute layer inside a relative/overflow-hidden card.
const CARD_PATTERN = "/roni-pattern.webp";
const CARD_MASK =
  "linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 55%, transparent 100%)";
const CARD_WASH =
  "linear-gradient(to top, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.7) 55%, #FFFFFF 100%)";

function CardBackdrop() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CARD_PATTERN}
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover"
        style={{
          filter: "blur(32px) saturate(0.4) brightness(1.06)",
          WebkitFilter: "blur(32px) saturate(0.4) brightness(1.06)",
          maskImage: CARD_MASK,
          WebkitMaskImage: CARD_MASK,
        }}
      />
      <div aria-hidden className="absolute inset-0" style={{ background: CARD_WASH }} />
    </>
  );
}

export function BrokersStrategy() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="brokers-strategy-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <p className="reveal-row eyebrow [transition-delay:80ms]">
          Introducing Chronilogix
        </p>
        {/* Heading + description share one row on desktop: heading left,
            supporting copy right. Stacks on mobile. */}
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 md:items-start">
          <h2
            id="brokers-strategy-label"
            className="reveal-row max-w-[22ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            The front door to smarter claims prevention.
          </h2>
          <p className="reveal-row max-w-[56ch] body-quiet md:pt-2 [transition-delay:260ms]">
            Chronilogix puts an AI coach in front of every member, engaging
            them between visits &mdash; long before a quiet risk becomes an
            expensive claim. One product, working continuously across your
            book of business.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 md:mt-14 md:gap-4 lg:grid-cols-3">
          {/* Left — positioning statement. */}
          <div
            className="reveal-row relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-brand-50 p-8 md:p-10 [transition-delay:340ms]"
          >
            <CardBackdrop />
            <p className="relative font-serif text-xl font-normal leading-[1.32] text-ink md:text-2xl">
              24/7 AI coaching that meets members between visits &mdash;
              onboarding, daily check-ins, goal tracking, and progress
              reporting, all inside one product.
            </p>
            <div className="relative mt-10 border-t border-ink/10 pt-5">
              <p className="text-[13px] font-medium text-ink">
                Grounded in Motivational Interviewing
              </p>
              <p className="mt-0.5 text-[13px] text-ink-muted">
                30 years of Dr. Ken Resnicow&rsquo;s NIH-funded research
              </p>
            </div>
          </div>

          {/* Middle — photo (stand-in from public/). Capped height when the
              grid stacks; stretches to match the row on the 3-col desktop grid. */}
          <div className="reveal-row h-[60px] overflow-hidden rounded-[24px] md:h-[76px] lg:h-auto lg:min-h-[300px] [transition-delay:440ms]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/strategy-lake-misty-dock.jpg"
              alt="A quiet lake and dock in the morning mist at sunrise."
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right — stat cards over the CTA. */}
          <div className="reveal-row flex flex-col gap-3 md:gap-4 [transition-delay:540ms]">
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-[24px] bg-brand-50 p-7 md:p-8"
              >
                <CardBackdrop />
                <p className="relative font-serif text-3xl font-normal leading-none text-ink md:text-4xl">
                  {stat.value}
                </p>
                <p className="relative mt-3 max-w-[30ch] text-[14px] leading-snug text-ink-soft">
                  {stat.caption}
                </p>
              </div>
            ))}

            <a
              href="#book-a-demo" /* TODO: wire to Calendly URL */
              className="group flex items-center justify-between rounded-[24px] bg-ink px-7 py-6 text-white transition-colors duration-300 ease-out-quart hover:bg-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 motion-reduce:transition-none md:px-8"
            >
              <span className="font-serif text-xl font-normal md:text-2xl">
                Book a Demo
              </span>
              <svg
                aria-hidden
                width="22"
                height="22"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform duration-300 ease-out-quart group-hover:translate-x-1 motion-reduce:transition-none"
              >
                <path
                  d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
