"use client";

import { useEffect, useRef, useState } from "react";

type Metric = {
  value: string;
  label: string;
  sub: string;
};

// Numbers are kept aligned with the home hero's stats pill (30+ years,
// 70+ clinical studies, 400+ peer-reviewed publications) so the about
// page never undercuts or contradicts the front door. $110M funding and
// 10,000+ clinicians extend that base — they don't replace it.
const METRICS: Metric[] = [
  {
    value: "400+",
    label: "Peer reviewed publications",
    sub: "On Motivational Interviewing",
  },
  {
    value: "70+",
    label: "Global clinical studies",
    sub: "Across diverse populations",
  },
  {
    value: "$110M",
    label: "In research funding",
    sub: "Across NIH backed programs",
  },
  {
    value: "10,000+",
    label: "Clinicians trained",
    sub: "Worldwide, across health systems",
  },
];

const DEPLOYMENTS = ["Aetna", "Kaiser Permanente", "University of Michigan", "NIH"];

export function AboutScience() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
  });

  return (
    <section
      id="science"
      ref={ref}
      className="relative overflow-hidden rounded-[28px] bg-paper-warm py-24 md:py-32 lg:py-40"
    >
      {/* Brand-orange radial wash from the top-right — same idiom as the
          home page's Outcome section. Carries the "gravitational pull"
          this section needs without resorting to a dark slab. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(249,144,77,0.18) 0%, rgba(249,144,77,0.05) 38%, transparent 68%)",
        }}
      />

      <div className="container-page relative">
        <div className="max-w-[52rem]">
          <p className="eyebrow" style={reveal(0)}>
            Our foundation
          </p>
          <h2
            className="mt-4 text-hero font-serif font-normal text-ink"
            style={
              {
                textWrap: "balance",
                ...reveal(100),
              } as React.CSSProperties
            }
          >
            Thirty years of research.
            <br />
            <span className="text-ink-muted">One breakthrough platform.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-16 lg:items-stretch">
          {/* Portrait + name plaque */}
          <figure className="flex flex-col" style={reveal(180)}>
            <DrPortrait />
            <figcaption className="mt-6 flex items-baseline justify-between gap-6 border-t border-ink/10 pt-5">
              <div>
                <p className="font-serif text-[22px] font-normal leading-tight tracking-[-0.012em] text-ink md:text-[24px]">
                  Dr. Kenneth Resnicow
                </p>
                <p className="mt-1.5 text-[13.5px] font-medium tracking-[-0.005em] text-brand-700">
                  Chief Science Officer
                </p>
              </div>
              <p className="text-right font-serif text-[13px] italic text-ink-muted">
                Irwin M. Rosenstock<br />
                Collegiate Professor, U-M
              </p>
            </figcaption>
          </figure>

          {/* Credibility column — prose, metrics, deployments */}
          <div className="flex flex-col">
            <p
              className="body-prose"
              style={reveal(220)}
            >
              Most AI wellness products are built on good intentions and
              generic language models. Chronilogix is built on{" "}
              <span className="text-ink">
                three decades of peer reviewed clinical science in Motivational
                Interviewing
              </span>
              : the most rigorously validated behavioral change methodology in
              the world.
            </p>
            <p
              className="mt-5 font-serif text-[18px] italic leading-[1.45] text-ink-soft md:text-[20px]"
              style={reveal(300)}
            >
              When Aetna integrated his MI framework into their disease
              management programs, member engagement rose by 43% and dropout
              rates fell by more than half.
            </p>

            <dl
              className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-ink/10 pt-9"
              style={reveal(380)}
            >
              {METRICS.map((m) => (
                <div key={m.label} className="flex flex-col">
                  <dt className="font-serif text-[32px] font-normal leading-none tracking-[-0.018em] text-ink md:text-[38px]">
                    {m.value}
                  </dt>
                  <dd className="mt-3">
                    <p className="text-[13.5px] font-medium leading-snug text-ink md:text-[14px]">
                      {m.label}
                    </p>
                    <p className="mt-1 font-serif text-[12.5px] italic text-ink-muted">
                      {m.sub}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>

            <div
              className="mt-10 border-t border-ink/10 pt-7"
              style={reveal(480)}
            >
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-subtle">
                Deployed across
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
                {DEPLOYMENTS.map((d) => (
                  <li
                    key={d}
                    className="font-serif text-[18px] font-normal tracking-[-0.005em] text-ink md:text-[20px]"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Editorial portrait of Dr. Resnicow on the warm-paper register. 4:5 aspect
 * to match the leader band on AboutTeam. Object-position biases left+up so
 * the face stays in the visual centre of the crop (source is landscape).
 * Subtle drop shadow + cream backdrop keep the photo sitting on paper, not
 * floating as a stark rectangle.
 */
function DrPortrait() {
  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px] bg-ink/5"
      style={{
        boxShadow:
          "0 1px 2px rgba(40,25,15,0.06), 0 22px 56px -24px rgba(40,25,15,0.22)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/ken-thumbnail.png"
        alt="Portrait of Dr. Kenneth Resnicow"
        draggable={false}
        className="h-full w-full select-none object-cover"
        style={{ objectPosition: "30% 22%" }}
      />
    </div>
  );
}
