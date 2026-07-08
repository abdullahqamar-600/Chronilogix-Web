"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersReality — "The Reality" beat from the one-sheet.
 *
 * Names the four cost pressures employers absorb, then lands the
 * broker-expectation line as a pull-quote at the bottom. The left rail
 * carries the framing headline; the right column carries the numbered
 * pressures with quiet icon glyphs.
 */

type Pressure = {
  title: string;
  detail: string;
  glyph: "chronic" | "behavioral" | "delay" | "clinician";
};

const PRESSURES: Pressure[] = [
  {
    title: "Chronic condition claims",
    detail: "Diabetes, obesity, hypertension — the top drivers of avoidable spend.",
    glyph: "chronic",
  },
  {
    title: "Behavioral health utilization",
    detail: "And the productivity loss that quietly compounds beside it.",
    glyph: "behavioral",
  },
  {
    title: "Delayed care from high deductibles",
    detail: "Members wait until small issues have become expensive ones.",
    glyph: "delay",
  },
  {
    title: "Clinician shortages and long wait times",
    detail: "The bench is short, the queue is long, and the clock keeps running.",
    glyph: "clinician",
  },
];

export function BrokersReality() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="brokers-reality-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              The reality
            </p>
            <h2
              id="brokers-reality-label"
              className="reveal-row mt-4 max-w-[20ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Employers bear the full financial impact.{" "}
              <span className="text-ink-muted italic">
                Brokers carry the pressure to reduce it.
              </span>
            </h2>
            <p className="reveal-row mt-6 max-w-[42ch] body-quiet [transition-delay:260ms]">
              Four cost pressures show up in every self-funded renewal
              conversation. None of them respond to another single-purpose
              point solution.
            </p>
          </div>

          <ol className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
            {PRESSURES.map((pressure, i) => {
              const numeral = ["I", "II", "III", "IV"][i] ?? String(i + 1);
              const delay = 320 + i * 110;
              return (
                <li
                  key={pressure.title}
                  className="reveal-row grid grid-cols-[2rem_44px_1fr] items-start gap-x-4 py-6 md:grid-cols-[2.25rem_52px_1fr]"
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  <span className="mt-1 font-serif text-[13px] italic text-brand-700">
                    {numeral}.
                  </span>
                  <span className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-700 md:h-12 md:w-12">
                    <PressureGlyph kind={pressure.glyph} />
                  </span>
                  <div>
                    <h3 className="text-base font-medium leading-snug text-ink md:text-lg">
                      {pressure.title}
                    </h3>
                    <p className="mt-1.5 max-w-[46ch] body-quiet">
                      {pressure.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Pull-line — the broker-expectation callout that closes The
            Reality on the one-sheet. Serif-italic, ink-soft, so it reads
            as a felt sentence rather than a marketing beat. */}
        <p
          className="reveal-row mx-auto mt-16 max-w-[52ch] text-center font-serif text-2xl italic leading-snug text-ink md:mt-20 md:text-3xl [transition-delay:820ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          &ldquo;Brokers are expected to deliver measurable cost containment
          &mdash; not more fragmented point solutions.&rdquo;
        </p>
      </div>
    </section>
  );
}

function PressureGlyph({ kind }: { kind: Pressure["glyph"] }) {
  const commonProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind === "chronic") {
    // ECG-style line — chronic condition signal.
    return (
      <svg {...commonProps}>
        <path d="M3 12h3l2-5 3 10 3-8 2 5 5 -2" />
      </svg>
    );
  }
  if (kind === "behavioral") {
    // Head silhouette with a spark inside — behavioral / MI.
    return (
      <svg {...commonProps}>
        <path d="M15 4a5 5 0 0 0-5 5v1H8a2 2 0 0 0 0 4h1v3a2 2 0 0 0 2 2h3" />
        <path d="M12 9v3l2 1" />
      </svg>
    );
  }
  if (kind === "delay") {
    // Hourglass — delayed care.
    return (
      <svg {...commonProps}>
        <path d="M7 3h10" />
        <path d="M7 21h10" />
        <path d="M7 3v3.5c0 1.5 5 3 5 5.5s-5 4-5 5.5V21" />
        <path d="M17 3v3.5c0 1.5-5 3-5 5.5s5 4 5 5.5V21" />
      </svg>
    );
  }
  // clinician — a stylized user with a shortage tick.
  return (
    <svg {...commonProps}>
      <circle cx="10" cy="8" r="3" />
      <path d="M4 20c0-3 3-5 6-5s6 2 6 5" />
      <path d="M18 5v4" />
      <path d="M18 12v0.01" />
    </svg>
  );
}
