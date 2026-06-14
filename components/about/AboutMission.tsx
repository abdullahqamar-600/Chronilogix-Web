"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Value = {
  label: string;
  body: string;
  icon: ReactNode;
};

const VALUES: Value[] = [
  {
    label: "Clinical integrity",
    body:
      "Every conversation Chronilogix has is grounded in clinical behavioral science, not wellness marketing. Our methodology is peer reviewed, our claims are evidence backed, and our coaching architecture is built on Motivational Interviewing: the most rigorously validated behavior change framework in the world.",
    icon: <PulseIcon />,
  },
  {
    label: "Human dignity",
    body:
      "Our platform is designed to feel like a conversation, not a transaction. People are met where they are, with the language they use, on the schedule they keep. Not managed toward where someone else wants them to be. No scripts. No nudges. No surveillance.",
    icon: <HeartIcon />,
  },
  {
    label: "Radical accessibility",
    body:
      "If we’re not reaching the people who fall through the cracks of traditional care, we’re not doing our job. That means meeting the night-shift nurse at 3 AM, the underinsured worker who hasn’t seen a clinician in two years, and the person whose community makes therapy feel impossible.",
    icon: <GlobeIcon />,
  },
];

export function AboutMission() {
  const [openIdx, setOpenIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);
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
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
  });

  return (
    <section
      id="values"
      ref={sectionRef}
      className="relative overflow-hidden rounded-[28px] bg-white py-20 md:py-24 lg:py-28"
    >
      <div className="container-page relative">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <h2
            className="max-w-[22ch] font-serif text-[32px] font-normal leading-[1.1] tracking-[-0.012em] text-ink md:text-[40px] lg:text-[44px]"
            style={
              {
                textWrap: "balance",
                ...reveal(0),
              } as React.CSSProperties
            }
          >
            Three things Chronilogix{" "}
            <span className="text-ink-muted italic">won&rsquo;t compromise on.</span>
          </h2>
          <p
            className="max-w-[44ch] self-end text-[15px] leading-relaxed text-ink-muted md:text-base"
            style={reveal(120)}
          >
            By partnering with healthcare leaders, employers, and clinicians,
            Chronilogix is rebuilding behavioral and chronic care from the
            ground up. Pushing the boundaries of applied AI while holding the
            line on what makes care worth having in the first place.
          </p>
        </div>

        <ul
          className="mt-12 flex flex-col gap-3 md:mt-16"
          style={reveal(220)}
        >
          {VALUES.map((v, i) => (
            <AccordionRow
              key={v.label}
              value={v}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function AccordionRow({
  value,
  open,
  onToggle,
}: {
  value: Value;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      className={`relative overflow-hidden rounded-[18px] transition-colors duration-400 ease-out-quart motion-reduce:transition-none ${
        open ? "bg-ink" : "bg-paper-tint"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand md:px-7 md:py-6"
      >
        <span className="flex items-center gap-4">
          <span
            aria-hidden
            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center transition-colors duration-400 ease-out-quart ${
              open ? "text-brand" : "text-ink"
            }`}
          >
            {value.icon}
          </span>
          <span
            className={`text-[16px] font-medium tracking-[-0.005em] transition-colors duration-400 ease-out-quart md:text-[17px] ${
              open ? "text-white" : "text-ink"
            }`}
          >
            {value.label}
          </span>
        </span>
        <Chevron open={open} />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-400 ease-out-quart motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p
            className="pb-6 pt-1 pr-6 text-[15px] leading-relaxed text-white/75 md:pb-7 md:pr-7 md:text-[16px]"
            style={{ paddingLeft: "calc(1.5rem + 24px + 1rem)" }}
          >
            {value.body}
          </p>
        </div>
      </div>
    </li>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={`shrink-0 transition-transform duration-400 ease-out-quart ${
        open ? "text-white/70" : "text-ink/50"
      }`}
      style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
    >
      <path
        d="M4 7 L9 12 L14 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M1.5 9 H4.5 L6 5 L9 13 L11.5 9 H16.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 15.25 C 9 15.25, 2.25 11.5, 2.25 6.75 C 2.25 4.7, 3.85 3.1, 5.9 3.1 C 7.15 3.1, 8.3 3.75, 9 4.75 C 9.7 3.75, 10.85 3.1, 12.1 3.1 C 14.15 3.1, 15.75 4.7, 15.75 6.75 C 15.75 11.5, 9 15.25, 9 15.25 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.5 9 H 15.5 M9 2.5 C 11.5 4.5, 11.5 13.5, 9 15.5 M9 2.5 C 6.5 4.5, 6.5 13.5, 9 15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
