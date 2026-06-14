"use client";

import { useEffect, useRef, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

type Leader = {
  name: string;
  role: string;
};

type Advisor = {
  name: string;
  role: string;
};

const LEADERS: Leader[] = [
  { name: "Steven Amiel", role: "CEO and Cofounder" },
  { name: "Dr. Kenneth Resnicow", role: "Chief Science Officer" },
  { name: "Lou Ramery", role: "Chief Marketing Officer" },
  { name: "Michael Lazor", role: "Fractional CTO" },
];

const ADVISORS: Advisor[] = [
  {
    name: "Nelson Griswold",
    role: "CEO, NextGen Benefits. One of the benefits industry’s most recognized strategic voices.",
  },
  {
    name: "Geoffrey C. Williams, M.D., Ph.D.",
    role: "Global expert in the treatment of behavioral and chronic conditions.",
  },
  {
    name: "Julian Lago",
    role: "Entrepreneur and advisor with two healthcare tech exits in the last 24 months.",
  },
];

export function AboutTeam() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
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
      id="team"
      ref={ref}
      className="relative overflow-hidden rounded-[28px] bg-paper-tint"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 100% 0%, rgba(249,144,77,0.22) 0%, rgba(249,144,77,0.06) 35%, transparent 65%)",
        }}
      />

      <div className="container-page relative pt-36 pb-10 md:pt-44 md:pb-12 lg:pt-52 lg:pb-14">
        <div className="flex items-center gap-3" style={reveal(0)}>
          <AIOrb size={18} />
          <p className="eyebrow">
            Our team
            <span aria-hidden className="mx-2 text-ink/25">
              ·
            </span>
            <span className="font-serif italic text-ink-muted">
              {LEADERS.length} leaders. One conviction.
            </span>
          </p>
        </div>

        <h1
          className="mt-8 max-w-[20ch] font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]"
          style={
            {
              textWrap: "balance",
              ...reveal(80),
            } as React.CSSProperties
          }
        >
          The people who&rsquo;ve seen what broken looks like.{" "}
          <span className="text-ink-muted">
            And know what better can be.
          </span>
        </h1>

        <p
          className="mt-10 max-w-[58ch] text-lg leading-relaxed text-ink-soft md:text-xl md:leading-[1.55]"
          style={reveal(180)}
        >
          Chronilogix was founded and led by a team that brings together
          clinical science, healthcare strategy, technology, and the
          conviction that the people most in need of behavioral support
          are the least served by the systems designed to help them.
        </p>
      </div>

      {/* Portrait band — touching tiles, no card chrome, no gap between
          portraits. Label sits inside the same grid cell as its portrait so
          name/role align column-by-column with the photo above. */}
      <ul
        className="grid grid-cols-2 lg:grid-cols-4"
        style={reveal(280)}
      >
        {LEADERS.map((leader, i) => (
          <li
            key={leader.name}
            className="flex flex-col"
            style={reveal(280 + i * 70)}
          >
            <PhotoPlaceholder index={i} />
            <div className="px-5 pb-2 pt-6 md:px-7 md:pt-7">
              <h3 className="font-serif text-[20px] font-normal leading-tight tracking-[-0.012em] text-ink md:text-[22px]">
                {leader.name}
              </h3>
              <p className="mt-1.5 text-[13.5px] font-medium tracking-[-0.005em] text-brand-700">
                {leader.role}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="container-page mt-20 pb-24 md:mt-24 md:pb-32 lg:mt-28 lg:pb-40">
        <div style={reveal(700)}>
          <p className="eyebrow-subtle">Advisory board</p>
          <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 border-t border-ink/[0.08] pt-7 md:grid-cols-3">
            {ADVISORS.map((a) => (
              <li
                key={a.name}
                className="grid grid-cols-[6px_1fr] items-baseline gap-3"
              >
                <span
                  aria-hidden
                  className="mt-[0.6em] inline-block h-1.5 w-1.5 rounded-full bg-brand"
                />
                <div>
                  <p className="text-[14.5px] font-medium tracking-[-0.005em] text-ink md:text-[15px]">
                    {a.name}
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-ink-muted md:text-[13.5px]">
                    {a.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * Editorial portrait placeholder. 4:5 aspect, flush edges (no rounding)
 * so the four tiles read as one continuous band when laid side-by-side
 * with zero gap. Subtle column-to-column shade variation prevents the
 * row from reading as a single flat block.
 */
function PhotoPlaceholder({ index }: { index: number }) {
  const shades = [
    "linear-gradient(180deg, #E9E3D8 0%, #D9D2C5 100%)",
    "linear-gradient(180deg, #DCD5C8 0%, #C8C1B3 100%)",
    "linear-gradient(180deg, #E2DCCF 0%, #CFC8BA 100%)",
    "linear-gradient(180deg, #D5CEC0 0%, #C2BBAC 100%)",
  ];
  return (
    <div
      aria-hidden
      className="relative aspect-[4/5] w-full overflow-hidden"
      style={{ background: shades[index % shades.length] }}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)",
        }}
      />
      <svg
        className="absolute left-1/2 top-1/2 h-[42%] w-auto -translate-x-1/2 -translate-y-1/2 text-ink/[0.10]"
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
