"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsProgramGap — "Meet Rooney AI, Your AI Health Coach" (Section 4).
 *
 * Rooney AI is available 24/7, grounded in Motivational Interviewing and
 * decades of behavioral science, and — unlike care that checks in
 * occasionally — stays connected every day. Left column: badge, heading,
 * copy, and three attribute pills; right column: a real device shot of a
 * member holding the Chronilogix app (phone-in-hand, with a soft bottom
 * fade so the wrist never reads as clipped).
 *
 * Naming note: the brief calls the coach "Ronnie"; per the brand
 * hierarchy the engine is "Rooney AI", so it's rendered that way here
 * for consistency with the rest of the site.
 */

const REQUIREMENTS = [
  "Available 24/7",
  "Motivational Interviewing",
  "Every day, not occasionally",
];

export function VendorsProgramGap() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-program-gap-label"
      className="relative overflow-hidden rounded-[28px] bg-brand-50"
    >
      {/* Soft orange wash — a little warmth under the whole section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 88% 18%, rgba(249,144,77,0.16), transparent 70%), radial-gradient(55% 45% at 6% 90%, rgba(255,116,52,0.08), transparent 72%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          {/* Left (desktop): the member holding the Chronilogix app, in the
              same surface-glass panel treatment as the homepage / brokers
              member view — rounded card, warm top-left glow, and the mockup
              anchored to the bottom with headroom above. */}
          <div className="reveal-row order-2 flex lg:order-1 [transition-delay:420ms]">
            <div
              className="surface-glass relative mx-auto flex h-[420px] w-full max-w-[280px] items-end justify-center overflow-hidden rounded-[24px] md:h-[520px] md:max-w-[340px]"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255, 255, 255, 0.92), inset 0 -1px 0 rgba(15, 20, 25, 0.04)",
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[24px]"
                style={{
                  background:
                    "radial-gradient(60% 60% at 0% 0%, rgba(249, 144, 77, 0.10) 0%, rgba(249, 144, 77, 0) 70%)",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hand-tilted-mockup.png"
                alt="A member holding their phone, using the Chronilogix app — an upcoming coaching appointment with Roni AI and daily goals with progress toward each."
                className="relative block max-h-[88%] max-w-full select-none object-contain"
                draggable={false}
              />
            </div>
          </div>

          {/* Right (desktop): the copy. */}
          <div className="order-1 lg:order-2">
            <p className="reveal-row eyebrow [transition-delay:60ms]">
              Meet Rooney AI
            </p>

            <h2
              id="vendors-program-gap-label"
              className="reveal-row mt-6 max-w-[18ch] font-serif font-normal text-section text-ink [transition-delay:160ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              An AI health coach that stays connected every day
            </h2>

            <p className="reveal-row mt-5 max-w-[46ch] body-prose [transition-delay:240ms]">
              Rooney AI is available 24/7 to guide, motivate, and support
              patients throughout their healthcare journey.
            </p>
            <p className="reveal-row mt-4 max-w-[46ch] body-prose [transition-delay:320ms]">
              Built on Motivational Interviewing and decades of behavioral
              science, Rooney helps patients overcome the everyday barriers
              that prevent successful treatment &mdash; staying connected
              every day, not just occasionally:
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {REQUIREMENTS.map((req, i) => (
                <span
                  key={req}
                  className="reveal-row rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-white"
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

