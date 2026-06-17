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
  // Lead with the structural shortage — this is the new framing the client
  // asked for: human care cannot scale, so AI is the only viable answer.
  {
    lead: "15M+",
    body: (
      <>
        global shortage of behavioral health and chronic-care coaches.{" "}
        <em className="font-normal not-italic text-ink">
          The world cannot hire its way out of the gap.
        </em>
      </>
    ),
    source: "WHO Mental Health Atlas",
  },
  // Diabetes — numbers updated to Steven's latest pull. The 11M
  // undiagnosed line is the wedge: even when care exists, the people who
  // most need it haven't been reached.
  {
    lead: "40M",
    body: (
      <>
        Americans live with diabetes —{" "}
        <em className="font-normal not-italic text-ink">
          11M of them undiagnosed
        </em>
        . Another{" "}
        <em className="font-normal not-italic text-ink">
          115M have prediabetes
        </em>
        , at risk of progressing without intervention.
      </>
    ),
    source: "CDC",
  },
  {
    lead: "2–6",
    unit: "wks",
    body: (
      <>
        is the average wait for in-person mental health care. Meanwhile,{" "}
        <em className="font-normal not-italic text-ink">
          human coaches stay scarce and expensive
        </em>
        .
      </>
    ),
    source: "WHO",
  },
];

const OBSERVATIONS = [
  "The costliest claims almost always begin as small, unaddressed risks between visits.",
  // 9-to-5 / 2 AM — names the off-hours window that human care can't
  // reliably cover. Shift workers + first responders make the abstract
  // failure concrete for a healthcare buyer.
  "The moments that matter most arrive off-hours: shift workers and first responders need support at 2 AM, not 2 PM.",
  // Cost / reimbursement gap — names the structural reason people delay
  // care. The "bill arrives as an ER visit" close ties the gap back to
  // the section's headline cost framing.
  "Coaching and behavioral support rarely get reimbursed, so people wait until things worsen and the bill arrives as an ER visit, not an appointment.",
  // Equity wedge — the Hispanic-men stat was previously its own fact tile;
  // moved into observations because the shortage framing now leads the
  // numerical section. Same JAMA / CDC source.
  "Diabetes hits Hispanic men 64% harder than average — yet they make up just 2% of the people the CDC's national prevention program reaches.",
  "Human care fluctuates with burnout, caseloads, and turnover.",
];

export function Problem() {
  return (
    <section
      id="problem"
      className="relative border-y border-ink/10 bg-paper-warm"
    >
      <div className="grid lg:grid-cols-2">
        {/* Left — sticky image */}
        <div className="relative p-2 lg:p-2">
          <div className="lg:sticky lg:top-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] lg:aspect-auto lg:h-[calc(100vh-1rem)]">
              <img
                src="/section-3.png"
                alt="A woman stands still and in focus while a blurred crowd rushes past around her."
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
        <div className="flex flex-col px-8 py-14 md:px-14 md:py-16 lg:px-16 lg:py-20 xl:px-20">
          {/* Intro — leads with the structural shortage (the new "AI is
              the only viable alternative" framing from the June 16 client
              feedback), then folds the original "moments between
              appointments" thread underneath it as the human consequence. */}
          <div>
            <h2
              className="max-w-2xl text-hero font-serif font-normal text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Human care cannot scale{" "}
              <span className="text-ink-muted">
                to the moments that matter most.
              </span>
            </h2>

            <p className="mt-8 max-w-md body-prose">
              The world is short more than{" "}
              <span className="text-ink">15 million</span> behavioral and
              chronic-care coaches. Wait times stretch into weeks. Costs put
              live coverage out of reach. And the moments that decide
              outcomes — the 11 PM stress eating, the skipped medication,
              the quiet slide back into old habits when no one is watching —
              don&rsquo;t wait for the next appointment.
            </p>

            <p className="mt-5 max-w-md body-prose">
              At population scale, only one intervention can be there at the
              moment it&rsquo;s needed. Chronilogix is built to fill that
              gap — at clinical fidelity, at a fraction of the cost of live
              care.
            </p>
          </div>

          {/* Observations — qualitative patterns that frame the numbers
              below. Bumped one step above body-prose so they read as the
              section's lead-in argument, not a tail-end aside. */}
          <div className="mt-14 md:mt-20">
            <p className="eyebrow-subtle">Between the numbers</p>
            <ul className="mt-7 space-y-6 md:mt-8 md:space-y-7">
              {OBSERVATIONS.map((line) => (
                <li
                  key={line}
                  className="flex max-w-xl gap-4 text-lg leading-relaxed text-ink-soft md:text-xl"
                >
                  <span
                    aria-hidden
                    className="mt-[0.7em] inline-block h-2 w-2 shrink-0 rounded-full bg-brand"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Facts — numeric evidence following the qualitative pattern
              above. Progressive disclosure on scroll. */}
          <ol className="mt-14 space-y-16 md:mt-20 md:space-y-20">
            {FACTS.map((fact, i) => (
              <FactPanel key={fact.lead} index={i} fact={fact} />
            ))}
          </ol>
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
      {/* Index marker, sits above the fact like a chapter number.
          A short hairline rests beneath the number as a quiet separator. */}
      <div className="reveal-row flex flex-col gap-2 [transition-delay:0ms]">
        <span className="text-[13px] font-medium tabular-nums text-ink-subtle">
          {indexLabel}.
        </span>
        <span aria-hidden className="block h-px w-8 bg-ink/10" />
      </div>

      {/* Hero numeral */}
      <div className="reveal-row reveal-row-blur mt-5 flex items-baseline gap-3 [transition-delay:120ms]">
        <span className="font-serif text-stat-lg font-normal text-ink">
          {fact.lead}
        </span>
        {fact.unit ? (
          <span className="font-serif text-row font-normal leading-none text-ink-muted">
            {fact.unit}
          </span>
        ) : null}
      </div>

      {/* Body */}
      <p className="reveal-row mt-5 max-w-lg body-prose [transition-delay:320ms]">
        {fact.body}
      </p>

      {/* Source */}
      <p className="reveal-row source-line mt-5 [transition-delay:520ms]">
        <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-brand" />
        Source · {fact.source}
      </p>
    </li>
  );
}
