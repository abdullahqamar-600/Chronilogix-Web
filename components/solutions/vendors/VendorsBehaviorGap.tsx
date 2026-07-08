"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsBehaviorGap — how Chronilogix closes the behavior gap.
 *
 * From the audio: "Chronilogix engages patients continuously, not
 * episodically. It addresses the emotional, behavioral, and
 * socio-economic barriers that cause that drop-off — fear, fatigue,
 * cost-stress, and low health literacy. Chronilogix closes that
 * behavior gap between prescription and real-world use without relying
 * on expensive, hard-to-scale clinical teams."
 *
 * Powered by Rooney AI, trained in Motivational Interviewing, backed by
 * 30+ years of Dr. Ken Resnicow's research.
 *
 * Layout: named-quote-scale headline on the left; four barrier chips
 * arranged in a 2×2 on the right; Rooney/Resnicow provenance strip
 * across the bottom.
 */

const BARRIERS = [
  {
    title: "Fear",
    body: "Patients disengage when the plan feels bigger than what they can carry. Coaching listens first.",
  },
  {
    title: "Fatigue",
    body: "The 30-to-90-day drop-off is emotional exhaustion, not defiance. MI meets it directly.",
  },
  {
    title: "Cost-stress",
    body: "Money worry is a chronic-care variable. Chronilogix surfaces it before it becomes a churn signal.",
  },
  {
    title: "Low health literacy",
    body: "Clinical language stops working past the discharge door. Chronilogix speaks the way the member does.",
  },
];

export function VendorsBehaviorGap() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-gap-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="reveal-row eyebrow [transition-delay:60ms]">
              The gap
            </p>
            <h2
              id="vendors-gap-label"
              className="reveal-row mt-4 max-w-[22ch] font-serif font-normal text-section text-ink [transition-delay:160ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Continuously.{" "}
              <span className="text-ink-muted italic">Not episodically.</span>
            </h2>
            <p className="reveal-row mt-6 max-w-[48ch] body-prose [transition-delay:260ms]">
              Chronilogix closes the behavior gap between prescription
              and real-world use &mdash; addressing the emotional,
              behavioral, and socio-economic barriers that cause the
              drop-off. All without relying on expensive, hard-to-scale
              clinical teams.
            </p>

            {/* Provenance strip — Rooney + Resnicow, the credibility
                the audio names in its second minute. */}
            <div className="reveal-row mt-10 rounded-2xl border border-brand-200 bg-brand-50/60 p-5 md:p-6 [transition-delay:400ms]">
              <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-brand-700">
                Powered by Rooney AI
              </p>
              <p className="mt-2 font-serif text-lg italic leading-snug text-ink md:text-xl">
                Trained in Motivational Interviewing. Backed by more than
                thirty years of Dr. Ken Resnicow&rsquo;s evidence-based
                behavioral change science.
              </p>
              <p className="mt-4 text-[13px] text-ink-muted">
                MI is the same technique clinicians use to move ambivalent
                patients toward action &mdash; now available every hour of
                every day, at the scale a vendor product needs.
              </p>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-3 self-center sm:grid-cols-2 md:gap-4">
            {BARRIERS.map((b, i) => (
              <li
                key={b.title}
                className="reveal-row group/barrier relative overflow-hidden rounded-2xl border border-ink/10 bg-paper-warm p-6 transition-colors duration-300 ease-out-quart motion-reduce:transition-none hover:border-brand-300"
                style={{ transitionDelay: `${520 + i * 90}ms` }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover/barrier:opacity-70"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(249,144,77,0.55) 0%, rgba(249,144,77,0) 70%)",
                  }}
                />
                <span className="relative font-serif text-[11px] uppercase tracking-[0.14em] text-brand-700">
                  Barrier · {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="relative mt-2 font-serif text-2xl leading-tight text-ink">
                  {b.title}
                </h3>
                <p className="relative mt-3 text-[14px] leading-snug text-ink-soft">
                  {b.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
