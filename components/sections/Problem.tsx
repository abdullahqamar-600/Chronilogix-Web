"use client";

import { useEffect, useRef, useState } from "react";

type Fact = {
  /** Hero numeral — single dominant figure */
  lead: string;
  /** Optional small unit/suffix shown next to the lead (e.g. "wks") */
  unit?: string;
  /** Supporting sentence — may contain <em> for inline emphasis on secondary numbers */
  body: React.ReactNode;
  /** Source attribution */
  source: string;
};

const FACTS: Fact[] = [
  {
    lead: "38.4M",
    body: (
      <>
        Americans have diabetes.{" "}
        <em className="font-normal not-italic text-ink">
          97.6M more have prediabetes
        </em>
        {" "}— and{" "}
        <em className="font-normal not-italic text-ink">
          70% will progress
        </em>
        {" "}without intervention.
      </>
    ),
    source: "CDC",
  },
  {
    lead: "2–6",
    unit: "wks",
    body: (
      <>
        average wait for in-person mental health care, against a global
        shortfall of{" "}
        <em className="font-normal not-italic text-ink">
          millions of healthcare workers
        </em>
        .
      </>
    ),
    source: "WHO",
  },
  {
    lead: "64%",
    body: (
      <>
        higher diabetes rate among Hispanic men — who make up just{" "}
        <em className="font-normal not-italic text-ink">2%</em> of
        participants in the CDC's national prevention program.
      </>
    ),
    source: "JAMA Network Open",
  },
];

export function Problem() {
  return (
    <section
      id="problem"
      className="relative rounded-[28px] bg-paper"
    >
      <div className="grid lg:grid-cols-2">
        {/* Left — sticky image */}
        <div className="relative p-2 lg:p-2">
          <div className="lg:sticky lg:top-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] lg:aspect-auto lg:h-[calc(100vh-1rem)]">
              <img
                src="/section%203%20iamge.png"
                alt="A person standing alone in a golden field, looking at their phone."
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right — scrolling content */}
        <div className="flex flex-col px-8 py-16 md:px-14 md:py-24 lg:px-16 lg:py-28 xl:px-20">
          {/* Intro */}
          <div>
            <p className="eyebrow">The problem</p>

            <h2 className="mt-6 max-w-xl text-section font-serif font-normal tracking-tight text-ink">
              You're already paying for the gap.
              <br />
              <span className="text-ink-muted">
                You're just not seeing the invoice.
              </span>
            </h2>

            <p className="mt-8 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
              Healthcare runs on appointments. Behavior change doesn't. A
              member sees a coach once a month and a physician twice a year
              — but the moments that decide outcomes happen in between: the
              11 PM stress-eating, the skipped medication, the quiet slide
              back into old habits when no one is watching.
            </p>
          </div>

          {/* Facts — progressive disclosure */}
          <ol className="mt-20 space-y-24 md:mt-28 md:space-y-32">
            {FACTS.map((fact, i) => (
              <FactPanel key={fact.lead} index={i} fact={fact} />
            ))}
          </ol>

          {/* Close */}
          <div className="mt-20 md:mt-28">
            <div className="h-px w-12 bg-ink/20" />
            <p className="mt-6 max-w-md font-serif text-xl leading-snug text-ink md:text-2xl">
              Costs you absorb whether or not you ever see them itemized.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FactPanel({ index, fact }: { index: number; fact: Fact }) {
  const ref = useRef<HTMLLIElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <li
      ref={ref}
      data-revealed={revealed ? "true" : "false"}
      className="group/fact relative"
    >
      {/* Index + thin rule */}
      <div className="reveal-row flex items-center gap-4 [transition-delay:0ms]">
        <span className="font-mono text-xs tracking-widest text-ink-subtle">
          {indexLabel}
        </span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      {/* Hero numeral */}
      <div className="reveal-row reveal-row-blur mt-6 flex items-baseline gap-3 [transition-delay:120ms]">
        <span className="font-serif text-[clamp(4.5rem,11vw,9rem)] font-normal leading-[0.95] tracking-tight text-ink">
          {fact.lead}
        </span>
        {fact.unit ? (
          <span className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-none tracking-tight text-ink-muted">
            {fact.unit}
          </span>
        ) : null}
      </div>

      {/* Body */}
      <p className="reveal-row mt-5 max-w-lg text-base leading-relaxed text-ink-soft [transition-delay:320ms] md:text-lg">
        {fact.body}
      </p>

      {/* Source */}
      <p className="reveal-row mt-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-muted [transition-delay:520ms]">
        <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-brand" />
        Source · {fact.source}
      </p>
    </li>
  );
}
