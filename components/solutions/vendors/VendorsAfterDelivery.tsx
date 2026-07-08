"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsAfterDelivery — the pressure beat.
 *
 * Names the four post-delivery pressures every chronic care vendor is
 * absorbing. Directly derived from the audio: "prescribed, shipped, and
 * then quietly underused"; "adherence drops after the first 30 to 90
 * days"; "retention suffers"; "payers, employers, and partners are no
 * longer impressed by logistics alone — they want outcomes."
 *
 * Structural mirror of BrokersReality so /solutions/vendors and
 * /solutions/brokers stay in the same visual family.
 */

type Pressure = {
  title: string;
  detail: string;
  glyph: "underused" | "adherence" | "retention" | "outcomes";
};

const PRESSURES: Pressure[] = [
  {
    title: "Prescribed, shipped, then quietly underused",
    detail:
      "The device leaves the warehouse and the box gets opened. What happens next rarely shows up in your dashboard.",
    glyph: "underused",
  },
  {
    title: "Adherence drops after the first 30 to 90 days",
    detail:
      "The honeymoon window closes fast. By month three, most of your users have stopped engaging with the product they were prescribed.",
    glyph: "adherence",
  },
  {
    title: "Retention suffers where it hurts the most",
    detail:
      "Renewal conversations get harder every quarter, because the story you're telling still leads with logistics.",
    glyph: "retention",
  },
  {
    title: "Payers, employers, and partners want outcomes",
    detail:
      "They're no longer impressed by logistics alone. The bar has moved from \"you shipped it\" to \"did it work.\"",
    glyph: "outcomes",
  },
];

export function VendorsAfterDelivery() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-after-delivery-label"
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
              The pressure
            </p>
            <h2
              id="vendors-after-delivery-label"
              className="reveal-row mt-4 max-w-[22ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Chronic care vendors are under pressure from every direction.{" "}
              <span className="text-ink-muted italic">
                Not on the shelf. After delivery.
              </span>
            </h2>
            <p className="reveal-row mt-6 max-w-[44ch] body-quiet [transition-delay:260ms]">
              You&rsquo;re not losing the deal on features. You&rsquo;re
              losing it in the ninety days between prescription and
              real-world use &mdash; the exact window your product
              can&rsquo;t see.
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
                    <p className="mt-1.5 max-w-[48ch] body-quiet">
                      {pressure.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Pull-line — closes the pressure section on the audio's
            hardest sentence. Serif-italic, ink-soft, so it reads as a
            felt sentence rather than a marketing beat. */}
        <p
          className="reveal-row mx-auto mt-16 max-w-[54ch] text-center font-serif text-2xl italic leading-snug text-ink md:mt-20 md:text-3xl [transition-delay:820ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          &ldquo;In today&rsquo;s market, the product isn&rsquo;t the problem.
          What happens after delivery is.&rdquo;
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
  if (kind === "underused") {
    // A shipped box with a dashed lid — implied "unopened / underused."
    return (
      <svg {...commonProps}>
        <path d="M4 8l8-4 8 4v10l-8 4-8-4V8z" />
        <path d="M4 8l8 4 8-4" />
        <path d="M12 12v10" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (kind === "adherence") {
    // Downward-sloping trend — adherence decay curve.
    return (
      <svg {...commonProps}>
        <path d="M3 6l5 4 4-2 5 6 4-3" />
        <path d="M3 20h18" />
      </svg>
    );
  }
  if (kind === "retention") {
    // A cracking retention loop — arrow bending open at the seam.
    return (
      <svg {...commonProps}>
        <path d="M6 12a6 6 0 0 1 10-4.5" />
        <path d="M17 4v4h-4" />
        <path d="M18 14a6 6 0 0 1-9 4.5" strokeDasharray="3 2" />
        <path d="M8 20v-4h4" />
      </svg>
    );
  }
  // outcomes — a target with a checked bullseye ring.
  return (
    <svg {...commonProps}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
