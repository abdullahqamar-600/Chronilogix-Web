"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersMemberExperience — "Meet Rooney AI, Your Members' AI Health
 * Coach" (Section 4).
 *
 * Rooney AI delivers personalized 24/7 coaching, uses Motivational
 * Interviewing backed by thirty-plus years of behavioral science
 * research, and is available without depending on clinician
 * availability.
 *
 * Device-left / copy-right composition: a real "member holding the
 * Chronilogix app" photo (same phone-in-hand treatment family as the
 * homepage) carries the experience, and the copy sits beside it. The
 * device shot already shows the member's greeting, upcoming coaching
 * appointments, and goals, so it stands on its own — no separate
 * progress card needed.
 */

const CAPABILITY_TAGS = [
  "Onboarding",
  "Daily check-ins",
  "Goal tracking",
  "Progress reporting",
];

export function BrokersMemberExperience() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      id="how-it-works"
      aria-labelledby="brokers-member-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 items-center gap-12 md:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* Left (desktop): the member holding the Chronilogix app, in the
              same surface-glass panel treatment as the homepage member
              view — rounded card, warm top-left glow, and the mockup
              anchored to the bottom so a strip of headroom sits above it
              and the hand reads as held within the frame. */}
          <div className="reveal-row order-2 flex lg:order-1 [transition-delay:320ms]">
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
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              Meet Rooney AI
            </p>
            <h2
              id="brokers-member-label"
              className="reveal-row mt-4 max-w-[22ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Your members&rsquo; AI health coach.
            </h2>
            <p className="reveal-row mt-6 max-w-[52ch] body-prose [transition-delay:280ms]">
              Rooney AI delivers personalized 24/7 coaching, using
              Motivational Interviewing backed by thirty-plus years of
              behavioral science research &mdash; available every hour,
              without depending on clinician availability.
            </p>

            {/* Capability tags — quiet chip row summarizing what the
                coaching product covers. */}
            <ul className="reveal-row mt-8 flex flex-wrap gap-2 md:gap-3 [transition-delay:380ms]">
              {CAPABILITY_TAGS.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-xs font-medium text-white"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
