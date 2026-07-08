"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersConditions — the "Conditions Driving Claims" footer band from
 * the one-sheet, rebuilt as a full section.
 *
 * The one-sheet lists eight condition names separated by bullets. Here
 * they're grouped by domain (chronic / behavioral / adherence) so the
 * reader can see the pattern the one-sheet already implies — Chronilogix
 * reaches across the physical/behavioral divide.
 */

type Group = {
  label: string;
  conditions: string[];
};

const GROUPS: Group[] = [
  {
    label: "Chronic & metabolic",
    conditions: ["Diabetes", "Obesity", "Metabolic health"],
  },
  {
    label: "Behavioral health",
    conditions: ["Stress", "Anxiety", "Depression"],
  },
  {
    label: "Adherence & complexity",
    conditions: ["Medication adherence", "Comorbid physical + behavioral"],
  },
];

export function BrokersConditions() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="brokers-conditions-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-[42ch]">
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              Conditions driving claims
            </p>
            <h2
              id="brokers-conditions-label"
              className="reveal-row mt-4 font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Where Chronilogix bends the highest-cost outcomes.
            </h2>
          </div>
          <p className="reveal-row max-w-[38ch] eyebrow-subtle [transition-delay:260ms]">
            Coaching that spans the physical / behavioral line most vendors
            can&rsquo;t.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3 md:gap-6">
          {GROUPS.map((group, gi) => {
            const groupDelay = 340 + gi * 140;
            return (
              <div
                key={group.label}
                className="reveal-row rounded-[24px] border border-ink/10 bg-paper-warm p-7 md:p-8"
                style={{ transitionDelay: `${groupDelay}ms` }}
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="block h-1.5 w-6 rounded-full bg-brand-accent"
                  />
                  <p className="font-serif text-[13px] italic text-brand-700">
                    {group.label}
                  </p>
                </div>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.conditions.map((c, ci) => (
                    <li
                      key={c}
                      className="reveal-row inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink transition-colors duration-300 ease-out-quart motion-reduce:transition-none hover:border-brand-400 hover:text-brand-700"
                      style={{
                        transitionDelay: `${groupDelay + 180 + ci * 90}ms`,
                      }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="reveal-row mx-auto mt-14 max-w-[64ch] text-center body-quiet [transition-delay:820ms]">
          The same Chronilogix product covers every column above &mdash;
          one platform, one member relationship, one line item on your
          renewal deck.
        </p>
      </div>
    </section>
  );
}
