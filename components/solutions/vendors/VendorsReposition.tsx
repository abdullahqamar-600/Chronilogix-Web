"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsReposition — the value-story beat.
 *
 * Directly from the audio: "In a crowded, noisy market, Chronilogix
 * helps you move from commodity supplier to outcomes-enabled partner —
 * with data, differentiation, and a stronger value story buyers can't
 * ignore."
 *
 * Rendered as a left→right transformation strip: three pill labels
 * (commodity, feature parity, price war) becoming three brand labels
 * (outcomes-enabled, data-driven, defensible story), separated by a
 * horizontal arrow.
 */

const BEFORE = ["Commodity supplier", "Feature parity", "Price war"];
const AFTER = ["Outcomes-enabled partner", "Data differentiation", "Value story buyers can't ignore"];

export function VendorsReposition() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-reposition-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 8% 15%, rgba(255,116,52,0.10), transparent 72%), radial-gradient(50% 40% at 95% 88%, rgba(249,144,77,0.16), transparent 70%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="max-w-[56ch]">
          <p className="reveal-row eyebrow [transition-delay:60ms]">
            The value story
          </p>
          <h2
            id="vendors-reposition-label"
            className="reveal-row mt-4 font-serif font-normal text-section text-ink [transition-delay:160ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            From commodity supplier{" "}
            <span className="text-brand-700">to outcomes-enabled partner.</span>
          </h2>
          <p className="reveal-row mt-5 max-w-[54ch] body-prose [transition-delay:260ms]">
            In a crowded, noisy market, Chronilogix gives your team a
            story buyers can&rsquo;t ignore &mdash; data,
            differentiation, and receipts that hold up under CFO
            scrutiny.
          </p>
        </div>

        <div className="mt-14 md:mt-20">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6 lg:gap-10">
            {/* Before column */}
            <ul className="reveal-row flex flex-col gap-3 [transition-delay:400ms]">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                Before Chronilogix
              </p>
              {BEFORE.map((b, i) => (
                <li
                  key={b}
                  className="flex items-center gap-3 rounded-full border border-ink/10 bg-white/60 px-5 py-3 text-[14.5px] text-ink-soft"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-ink/40"
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Arrow */}
            <div className="reveal-row flex items-center justify-center [transition-delay:520ms]">
              <div className="hidden md:block">
                <ArrowRight />
              </div>
              <div className="md:hidden">
                <ArrowDown />
              </div>
            </div>

            {/* After column */}
            <ul className="reveal-row flex flex-col gap-3 [transition-delay:640ms]">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-brand-700">
                After Chronilogix
              </p>
              {AFTER.map((a, i) => (
                <li
                  key={a}
                  className="flex items-center gap-3 rounded-full border border-brand-300 bg-white px-5 py-3 text-[14.5px] font-medium text-ink shadow-[0_1px_2px_rgba(15,20,25,0.04),0_10px_24px_-14px_rgba(228,90,28,0.35)]"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full bg-brand-accent"
                  />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pull-line — closes the section on the audio's outcome
            triplet. */}
        <p
          className="reveal-row mx-auto mt-16 max-w-[46ch] text-center font-serif text-2xl italic leading-snug text-ink md:mt-20 md:text-3xl [transition-delay:820ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          &ldquo;Outcomes. Retention. Relevance.&rdquo;
        </p>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="80" height="24" viewBox="0 0 80 24" fill="none" aria-hidden>
      <path
        d="M2 12h68m0 0-8-7m8 7-8 7"
        stroke="#E45A1C"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg width="24" height="60" viewBox="0 0 24 60" fill="none" aria-hidden>
      <path
        d="M12 2v52m0 0-7-8m7 8 7-8"
        stroke="#E45A1C"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
