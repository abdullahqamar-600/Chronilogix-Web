"use client";

import { useEffect, useRef, useState } from "react";

type Person = {
  name: string;
  role: string;
  // Portrait file under /public.
  photo: string;
  // Optional in-page anchor to a deeper section. Used to hand the reader
  // off to a longer treatment of this person's work (e.g. Resnicow → the
  // science slab) without crowding the card with copy.
  more?: { href: string; label: string };
};

const LEADERS: Person[] = [
  { name: "Steven Amiel", role: "CEO and Cofounder", photo: "/team/steven.png" },
  {
    name: "Dr. Kenneth Resnicow",
    role: "Chief Science Officer",
    photo: "/team/ken.png",
    more: { href: "#science", label: "Read the science" },
  },
  { name: "Lou Ramery", role: "Chief Marketing Officer", photo: "/team/lou.png" },
  { name: "Michael Lazor", role: "Fractional CTO", photo: "/team/michael.png" },
];

// Every advisor now has their own portrait — these were previously
// pointing at the leaders' files as stand-ins.
const ADVISORS: Person[] = [
  {
    name: "Nelson Griswold",
    role: "CEO, NextGen Benefits. One of the benefits industry’s most recognized strategic voices.",
    photo: "/team/nelson.png",
  },
  {
    name: "Geoffrey C. Williams, M.D., Ph.D.",
    role: "Global expert in the treatment of behavioral and chronic conditions.",
    photo: "/team/geoffrey.png",
  },
  {
    name: "Julian Lago",
    role: "Entrepreneur and advisor with two healthcare tech exits in the last 24 months.",
    photo: "/team/julian.png",
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

      <div className="container-page relative pt-36 pb-14 md:pt-44 md:pb-16 lg:pt-52 lg:pb-20">
        <h1
          className="max-w-[20ch] font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]"
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

        {/* Leader grid — portraits sit on the section's paper-tint with no
            white container chrome. Name + role live below on the paper.

            Width is capped at 64rem (and the advisory row at 48rem) so
            both grids land on the same ~16rem column. The grid used to
            run the full 1272px container, which was right when each card
            held a full-width 4/5 portrait; with circular avatars the
            columns were more than twice the width of their content and
            the faces floated apart as four isolated islands rather than
            reading as one team. Capping the width pulls them into a
            band, and the shared column keeps the 4-up and 3-up rows in
            the same rhythm. */}
        <ul
          className="mx-auto mt-14 grid max-w-[64rem] grid-cols-2 gap-x-5 gap-y-12 md:mt-16 md:gap-x-6 lg:mt-20 lg:grid-cols-4 lg:gap-x-8"
          style={reveal(280)}
        >
          {LEADERS.map((leader, i) => (
            <PersonCard
              key={leader.name}
              person={leader}
              size="lead"
              style={reveal(280 + i * 80)}
            />
          ))}
        </ul>

        {/* Advisory board — same portrait treatment as the leaders so the
            two rows read as one continuous people-band. Compact 3-up grid
            with shorter copy beneath. */}
        <div className="mt-16 md:mt-20 lg:mt-24" style={reveal(640)}>
          {/* The eyebrow and the grid share one centered block so the
              "Advisory board" label hangs above the left edge of the
              first advisor card rather than floating against the section
              edge while the grid sits indented. */}
          <div className="mx-auto max-w-[48rem]">
            <p className="eyebrow-subtle text-center">Advisory board</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
              {ADVISORS.map((a, i) => (
                <PersonCard
                  key={a.name}
                  person={a}
                  size="advisor"
                  style={reveal(700 + i * 90)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonCard({
  person,
  size,
  style,
}: {
  person: Person;
  size: "lead" | "advisor";
  style: React.CSSProperties;
}) {
  const isLead = size === "lead";
  return (
    <li style={style} className="flex flex-col items-center text-center">
      {/* Circular avatar rather than the former 4/5 portrait crop. The
          supplied headshots are 400px circular cutouts on a transparent
          ground, so a rectangular frame would slice the circle and leave
          transparent corners; a round frame matches the source crop
          exactly. Sized well below the source resolution on purpose —
          144px at the largest step, which is still 1:1 at 2x DPR against
          the 288px assets, so nothing is ever upscaled. */}
      <div
        className={`relative shrink-0 overflow-hidden rounded-full bg-paper ring-1 ring-ink/[0.06] ${
          isLead
            ? "h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36"
            : "h-28 w-28 md:h-32 md:w-32"
        }`}
        style={{
          boxShadow:
            "0 1px 2px rgba(40,25,15,0.05), 0 14px 30px -20px rgba(40,25,15,0.22)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={person.photo}
          alt={`Portrait of ${person.name}`}
          width={288}
          height={288}
          draggable={false}
          className="h-full w-full select-none object-cover"
        />
      </div>

      {/* Labels — sit directly on the section paper, no card chrome. */}
      <div className="flex w-full flex-col items-center px-0.5 pt-5 md:pt-6">
        <h3
          className={
            isLead
              ? "font-serif text-[18px] font-normal leading-tight tracking-[-0.012em] text-ink md:text-[20px]"
              : "text-[14.5px] font-medium tracking-[-0.005em] text-ink md:text-[15px]"
          }
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {person.name}
        </h3>
        <p
          className={
            isLead
              ? "mt-1.5 text-[13px] font-medium tracking-[-0.005em] text-brand-700"
              : "mt-1.5 max-w-[24ch] text-[13px] leading-snug text-ink-muted md:text-[13.5px]"
          }
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {person.role}
        </p>
        {person.more ? (
          <a
            href={person.more.href}
            className="group/more mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted transition-colors duration-200 ease-out hover:text-ink"
          >
            {person.more.label}
            <svg
              width="11"
              height="11"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform duration-200 ease-out motion-reduce:transition-none group-hover/more:translate-x-0.5"
            >
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ) : null}
      </div>
    </li>
  );
}
