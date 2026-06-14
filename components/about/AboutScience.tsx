"use client";

import { useEffect, useRef, useState } from "react";

type Metric = {
  value: string;
  label: string;
  sub: string;
};

const METRICS: Metric[] = [
  {
    value: "430+",
    label: "Peer reviewed studies",
    sub: "Supporting Motivational Interviewing",
  },
  {
    value: "$110M",
    label: "In research funding",
    sub: "Across NIH backed programs",
  },
  {
    value: "70",
    label: "Global clinical studies",
    sub: "Across diverse populations",
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
      data-nav-tone="dark"
      ref={ref}
      className="relative overflow-hidden bg-ink py-24 md:py-32 lg:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 0% 0%, rgba(255,116,52,0.18) 0%, transparent 55%), radial-gradient(70% 60% at 100% 100%, rgba(228,90,28,0.10) 0%, transparent 55%)",
        }}
      />

      <div className="container-page relative">
        <div className="max-w-[52rem]">
          <p
            className="text-[14px] font-medium tracking-[-0.005em] text-brand-300"
            style={reveal(0)}
          >
            Our foundation
          </p>
          <h2
            className="mt-4 text-hero font-serif font-normal text-white"
            style={
              {
                textWrap: "balance",
                ...reveal(100),
              } as React.CSSProperties
            }
          >
            Thirty years of research.
            <br />
            <span className="text-white/55">One breakthrough platform.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-16 lg:items-stretch">
          {/* Portrait + name plaque */}
          <figure className="flex flex-col" style={reveal(180)}>
            <DrPortraitPlaceholder />
            <figcaption className="mt-6 flex items-baseline justify-between gap-6 border-t border-white/10 pt-5">
              <div>
                <p className="font-serif text-[22px] font-normal leading-tight tracking-[-0.012em] text-white md:text-[24px]">
                  Dr. Kenneth Resnicow
                </p>
                <p className="mt-1.5 text-[13.5px] font-medium tracking-[-0.005em] text-brand-300">
                  Chief Science Officer
                </p>
              </div>
              <p className="text-right font-serif text-[13px] italic text-white/55">
                Irwin M. Rosenstock<br />
                Collegiate Professor, U-M
              </p>
            </figcaption>
          </figure>

          {/* Credibility column — prose, metrics, deployments */}
          <div className="flex flex-col">
            <p
              className="text-base leading-relaxed text-white/75 md:text-lg"
              style={reveal(220)}
            >
              Most AI wellness products are built on good intentions and
              generic language models. Chronilogix is built on{" "}
              <span className="text-white">
                three decades of peer reviewed clinical science in Motivational
                Interviewing
              </span>
              : the most rigorously validated behavioral change methodology in
              the world.
            </p>
            <p
              className="mt-5 font-serif text-[18px] italic leading-[1.45] text-white/80 md:text-[20px]"
              style={reveal(300)}
            >
              When Aetna integrated his MI framework into their disease
              management programs, member engagement rose by 43% and dropout
              rates fell by more than half.
            </p>

            <dl
              className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-white/10 pt-9"
              style={reveal(380)}
            >
              {METRICS.map((m) => (
                <div key={m.label} className="flex flex-col">
                  <dt className="font-serif text-[32px] font-normal leading-none tracking-[-0.018em] text-white md:text-[38px]">
                    {m.value}
                  </dt>
                  <dd className="mt-3">
                    <p className="text-[13.5px] font-medium leading-snug text-white md:text-[14px]">
                      {m.label}
                    </p>
                    <p className="mt-1 font-serif text-[12.5px] italic text-white/55">
                      {m.sub}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>

            <div
              className="mt-10 border-t border-white/10 pt-7"
              style={reveal(480)}
            >
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/45">
                Deployed across
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
                {DEPLOYMENTS.map((d) => (
                  <li
                    key={d}
                    className="font-serif text-[18px] font-normal tracking-[-0.005em] text-white md:text-[20px]"
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
 * Soft dark portrait placeholder for Dr. Resnicow's photo. Stays on the
 * dark slab register: cool slate gradient with a softer silhouette mark
 * so the card reads as "image pending" without competing with the
 * surrounding type. Swap for an <Image /> once portraiture lands.
 */
function DrPortraitPlaceholder() {
  return (
    <div
      aria-hidden
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px]"
      style={{
        background:
          "linear-gradient(180deg, #2A2F36 0%, #1A1F24 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.4), 0 22px 56px -24px rgba(0,0,0,0.6)",
      }}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 25%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 60%), radial-gradient(70% 60% at 0% 0%, rgba(255,116,52,0.10) 0%, transparent 55%)",
        }}
      />
      <svg
        className="absolute left-1/2 top-1/2 h-[44%] w-auto -translate-x-1/2 -translate-y-1/2 text-white/[0.08]"
        viewBox="0 0 64 64"
        fill="currentColor"
        aria-hidden
      >
        <circle cx="32" cy="22" r="11" />
        <path d="M8 60 C 8 44, 20 38, 32 38 C 44 38, 56 44, 56 60 L 56 64 L 8 64 Z" />
      </svg>
    </div>
  );
}
