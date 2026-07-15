"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersReality — "The Reality Brokers Face" (Section 2).
 *
 * Answers the second question in the narrative arc: what's causing the
 * problem? Your clients aren't losing money because of plan design — the
 * biggest cost drivers are chronic conditions, behavioral health, and
 * delayed treatment from high deductibles.
 *
 * Restyled as a full-width heading over a four-card color grid (referenced
 * from a "Drive metrics that matter" stat-card layout: big bold headline
 * top, caption bottom, one flat color per card). The reference's cards
 * carry sourced percentages; the broker one-sheet only names these four
 * conditions without attached numbers, so each card's headline is the
 * condition name itself rather than an invented stat — the caption below
 * carries the same qualitative detail the page already established.
 *
 * Card tones are strictly on-brand: four stops from the Tailwind config's
 * brand orange scale (brand-400 → 500 → 700 → 900), light to dark, rather
 * than the sage/amber/rust data-viz palette used on the hero chart.
 */

type Pressure = {
  title: string;
  detail: string;
  /** On-brand photo (from public/) paired with this card's image cell. */
  image: string;
  /** Alt text describing the photo. */
  alt: string;
};

// The four cost pressures the broker one-sheet names. Each pairs with an
// on-brand photo already in the repo (reused from the site's persona /
// portrait photography), so the grid stays on-brand and fully offline.
const PRESSURES: Pressure[] = [
  {
    title: "Diabetes",
    detail: "One of the most predictable, highest-cost drivers on every renewal.",
    image: "/diabetes-glucose.jpg",
    alt: "A person checking their blood glucose level with a meter.",
  },
  {
    title: "Obesity",
    detail: "Compounds risk across nearly every other chronic condition on the plan.",
    image: "/obesity-reflective.jpg",
    alt: "A woman sitting alone on the edge of a bed in low evening light.",
  },
  {
    title: "Behavioral health",
    detail: "Utilization climbs quietly, alongside the productivity loss beside it.",
    image: "/behavioral-health-sunlit.jpg",
    alt: "Two young women resting close together in warm sunlight through leaves.",
  },
  {
    title: "Delayed care",
    detail: "Employees postpone treatment until small issues become expensive claims.",
    image: "/delayed-care-caregiver.jpg",
    alt: "A caregiver helping an older man with his shoes beside a wheelchair.",
  },
];

// Bento cells in grid-flow order (4 columns): image + text pairs that
// alternate lead per row — image-first on row 1, text-first on row 2 —
// mirroring the reference layout. One text card runs dark for rhythm.
type Cell =
  | { kind: "image"; p: Pressure }
  | { kind: "text"; p: Pressure; dark?: boolean };

const CELLS: Cell[] = [
  { kind: "image", p: PRESSURES[0] },
  { kind: "text", p: PRESSURES[0] },
  { kind: "image", p: PRESSURES[1] },
  { kind: "text", p: PRESSURES[1] },
  { kind: "text", p: PRESSURES[2], dark: true },
  { kind: "image", p: PRESSURES[2] },
  { kind: "text", p: PRESSURES[3] },
  { kind: "image", p: PRESSURES[3] },
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
        <div className="max-w-[58ch]">
          <p className="reveal-row eyebrow [transition-delay:80ms]">
            The reality brokers face
          </p>
          <h2
            id="brokers-reality-label"
            className="reveal-row mt-4 max-w-[20ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Your clients aren&rsquo;t losing money{" "}
            <span className="text-ink-muted italic">
              because of plan design.
            </span>
          </h2>
          <p className="reveal-row mt-6 max-w-[52ch] body-quiet [transition-delay:260ms]">
            When employees postpone care, conditions quietly worsen
            &mdash; and by the time they surface, the claims are already
            expensive. Brokers are left explaining the renewal increase
            after the fact, instead of preventing it.
          </p>
        </div>

        {/* Bento grid — image + text cards, alternating per the reference. */}
        <div className="mt-14 grid auto-rows-[260px] grid-cols-1 gap-3 sm:grid-cols-2 md:mt-16 md:auto-rows-[300px] md:gap-4 lg:grid-cols-4">
          {CELLS.map((cell, i) => {
            const delay = 340 + i * 90;

            if (cell.kind === "image") {
              return (
                <div
                  key={`${cell.p.title}-img`}
                  className="reveal-row min-h-[220px] overflow-hidden rounded-2xl md:min-h-[260px] md:rounded-[20px]"
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cell.p.image}
                    alt={cell.p.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out-quart hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>
              );
            }

            const dark = cell.dark;
            return (
              <div
                key={`${cell.p.title}-text`}
                className={`reveal-row flex min-h-[220px] flex-col justify-between rounded-2xl border p-6 transition-transform duration-400 ease-out-quart motion-reduce:transition-none hover:-translate-y-1 md:min-h-[260px] md:rounded-[20px] md:p-7 ${
                  dark
                    ? "border-transparent bg-ink"
                    : "border-ink/10 bg-paper-warm"
                }`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <h3
                  className={`font-serif text-2xl font-normal leading-[1.1] md:text-[26px] ${
                    dark ? "text-white" : "text-ink"
                  }`}
                  style={{ textWrap: "balance" as React.CSSProperties["textWrap"] }}
                >
                  {cell.p.title}
                </h3>

                <p
                  className={`text-[14px] leading-relaxed md:text-[15px] ${
                    dark ? "text-white/75" : "text-ink-soft"
                  }`}
                >
                  {cell.p.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
