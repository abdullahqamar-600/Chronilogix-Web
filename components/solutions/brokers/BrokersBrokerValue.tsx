"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersBrokerValue — the "Broker Value" beat from the one-sheet.
 *
 * Four broker-specific benefits. Rendered as a dark ink slab so it reads
 * as the resolution moment on the page — the same visual weight the
 * home /solutions pages give to their proof beats.
 *
 * Nav.tsx watches for [data-nav-tone="dark"] and flips its own contrast,
 * so this section sets that attribute.
 */

type Benefit = {
  title: string;
  body: string;
  glyph: "upstream" | "roi" | "differentiate" | "retain";
};

const BENEFITS: Benefit[] = [
  {
    title: "Move upstream in the cost curve",
    body: "Engage members months before they surface in claims data. The cost story starts earlier — and it starts with you.",
    glyph: "upstream",
  },
  {
    title: "Lead defensible ROI conversations",
    body: "Bring numbers grounded in Aetna's engagement study and Chronilogix cost math. Same PMPM comparison your CFO clients already build.",
    glyph: "roi",
  },
  {
    title: "Differentiate beyond plan design",
    body: "A category that isn't burned out. Clinical science on the surface, real cost containment underneath — a genuine door-opener for new logos.",
    glyph: "differentiate",
  },
  {
    title: "Retain self-funded clients long-term",
    body: "A benefit HR is proud of, a report finance can quote, and members actually use. Renewal conversations stop being defensive.",
    glyph: "retain",
  },
];

export function BrokersBrokerValue() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      data-nav-tone="dark"
      aria-labelledby="brokers-value-label"
      className="relative overflow-hidden rounded-[28px] bg-ink text-white"
    >
      {/* Ambient warm glows — anchor the dark slab in brand color. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 40% at 0% 0%, rgba(255,116,52,0.20), transparent 65%), radial-gradient(45% 35% at 100% 100%, rgba(249,144,77,0.10), transparent 70%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-12">
          <div>
            <p className="reveal-row text-[14px] font-medium tracking-[-0.005em] text-brand-300 [transition-delay:80ms]">
              Broker value
            </p>
            <h2
              id="brokers-value-label"
              className="reveal-row mt-4 max-w-[22ch] font-serif font-normal text-section text-white [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              What Chronilogix carries into your book.
            </h2>
          </div>
          <p className="reveal-row max-w-[42ch] text-[15px] leading-relaxed text-white/70 md:text-right [transition-delay:280ms]">
            Chronilogix helps you win the CHRO room, defend the CFO
            spreadsheet, and keep the client on renewal.
          </p>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2 md:gap-8">
          {BENEFITS.map((b, i) => {
            const numeral = ["I", "II", "III", "IV"][i] ?? String(i + 1);
            const delay = 340 + i * 130;
            return (
              <li
                key={b.title}
                className="reveal-row group/benefit relative flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-colors duration-400 ease-out-quart motion-reduce:transition-none hover:border-brand-400/50 md:p-9"
                style={{ transitionDelay: `${delay}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[12px] italic tracking-[0.04em] text-brand-300">
                    {numeral}.
                  </span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/6 text-brand-300 ring-1 ring-white/10 transition-colors duration-400 ease-out-quart motion-reduce:transition-none group-hover/benefit:bg-brand-500/15 group-hover/benefit:text-brand-200">
                    <BenefitGlyph kind={b.glyph} />
                  </span>
                </div>
                <h3 className="mt-2 max-w-[24ch] font-serif text-xl font-normal leading-snug text-white md:text-2xl">
                  {b.title}
                </h3>
                <p className="max-w-[46ch] text-[14.5px] leading-relaxed text-white/70 md:text-[15px]">
                  {b.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function BenefitGlyph({ kind }: { kind: Benefit["glyph"] }) {
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

  if (kind === "upstream") {
    // Arrow moving upstream along a curve
    return (
      <svg {...commonProps}>
        <path d="M4 18c4-4 8-4 12-8" />
        <path d="M11 6h5v5" />
      </svg>
    );
  }
  if (kind === "roi") {
    // Line chart with a highlighted point
    return (
      <svg {...commonProps}>
        <path d="M4 18l4-5 4 3 6-8" />
        <circle cx="14" cy="16" r="1.4" fill="currentColor" />
        <path d="M4 20h16" />
      </svg>
    );
  }
  if (kind === "differentiate") {
    // Spark / distinction mark
    return (
      <svg {...commonProps}>
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="M6 6l2.5 2.5" />
        <path d="M15.5 15.5L18 18" />
      </svg>
    );
  }
  // retain — clasp / linked rings
  return (
    <svg {...commonProps}>
      <circle cx="9" cy="12" r="4" />
      <circle cx="15" cy="12" r="4" />
    </svg>
  );
}
