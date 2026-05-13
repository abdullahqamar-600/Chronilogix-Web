"use client";

import { useEffect, useState } from "react";

type Stat = {
  big: string;
  label: string;
  rows: { side: string; val: string; barWidth: number; primary?: boolean }[];
};

type Persona = {
  key: string;
  label: string;
  headlineStart: string;
  headlineAccent: string;
  body: string;
  ctaLabel: string;
  stats: Stat[];
};

const PERSONAS: Persona[] = [
  {
    key: "employers",
    label: "Employers & HR",
    headlineStart: "Reach every employee.",
    headlineAccent: "Not just the few who ask.",
    body: "Mental health and chronic conditions drive the largest unmanaged cost lines in your population. Chronilogix slots into your benefits stack and meets the people your EAP never does.",
    ctaLabel: "Talk to our team",
    stats: [
      {
        big: "8x",
        label: "Higher engagement than typical EAPs",
        rows: [
          { side: "Typical EAP", val: "3% utilization", barWidth: 12 },
          { side: "Chronilogix", val: "25% engaged", barWidth: 100, primary: true },
        ],
      },
      {
        big: "~50%",
        label: "Lower cost vs. live coaching",
        rows: [
          { side: "Live coaching", val: "$60–70 PMPM", barWidth: 100 },
          { side: "Chronilogix", val: "$20–30 PMPM", barWidth: 42, primary: true },
        ],
      },
      {
        big: "24/7",
        label: "Available the moment it’s needed",
        rows: [
          { side: "EAP hotline", val: "Business hours", barWidth: 34 },
          { side: "Chronilogix", val: "Every hour", barWidth: 100, primary: true },
        ],
      },
    ],
  },
  {
    key: "universities",
    label: "Universities",
    headlineStart: "Built for the",
    headlineAccent: "60% who never raise their hand.",
    body: "Counseling centers are overwhelmed and the students who need help most rarely ask. Chronilogix is private, immediate, and culturally tailored. Available the moment a student needs it.",
    ctaLabel: "See the university program",
    stats: [
      {
        big: "100%",
        label: "Of students supported, with no new hires",
        rows: [
          { side: "Counseling staff", val: "Capped by FTEs", barWidth: 12 },
          { side: "Chronilogix", val: "Every student", barWidth: 100, primary: true },
        ],
      },
      {
        big: "<1 min",
        label: "To first conversation, vs. 1.6 weeks",
        rows: [
          { side: "Counseling center", val: "1.6 weeks avg", barWidth: 100 },
          { side: "Chronilogix", val: "Instant access", barWidth: 4, primary: true },
        ],
      },
      {
        big: "60%",
        label: "Of students who never seek help, reached privately",
        rows: [
          { side: "Counseling office", val: "Out of reach", barWidth: 4 },
          { side: "Chronilogix", val: "Met where they are", barWidth: 100, primary: true },
        ],
      },
    ],
  },
  {
    key: "health-plans",
    label: "Health Plans & Brokers",
    headlineStart: "Member coaching that",
    headlineAccent: "scales with your network.",
    body: "Behavioral health is your fastest-growing claim category. Chronilogix delivers ongoing, evidence-based coaching at a fraction of the cost of live care, at member-volume scale.",
    ctaLabel: "Get a custom quote",
    stats: [
      {
        big: "+25%",
        label: "Additional members engaged in care (Aetna)",
        rows: [
          { side: "Without Chronilogix", val: "Baseline", barWidth: 60 },
          { side: "With Chronilogix", val: "+25% reached", barWidth: 100, primary: true },
        ],
      },
      {
        big: "2–3x",
        label: "Lower per-member cost",
        rows: [
          { side: "Live coaching", val: "$60–70 PMPM", barWidth: 100 },
          { side: "Chronilogix", val: "$20–30 PMPM", barWidth: 42, primary: true },
        ],
      },
      {
        big: "0",
        label: "Wait time for member access",
        rows: [
          { side: "Live coaching", val: "Weeks–months", barWidth: 100 },
          { side: "Chronilogix", val: "Immediate", barWidth: 4, primary: true },
        ],
      },
    ],
  },
  {
    key: "app-partners",
    label: "App Partners",
    headlineStart: "30 years of clinical research,",
    headlineAccent: "embedded in your product.",
    body: "Building genuinely clinical AI takes years and millions in R&D. Chronilogix drops the methodology, validation layer, and crisis protocols straight into your app.",
    ctaLabel: "Explore the partnership",
    stats: [
      {
        big: "400+",
        label: "Clinical studies behind the methodology",
        rows: [
          { side: "Generic AI", val: "0 studies", barWidth: 4 },
          { side: "Chronilogix", val: "400+ peer-reviewed", barWidth: 100, primary: true },
        ],
      },
      {
        big: "30 yrs",
        label: "Of Motivational Interviewing pre-trained",
        rows: [
          { side: "Build in-house", val: "Years of R&D", barWidth: 100 },
          { side: "Chronilogix", val: "Day-one ready", barWidth: 18, primary: true },
        ],
      },
      {
        big: "$0",
        label: "Development overhead to integrate",
        rows: [
          { side: "Build in-house", val: "$5M+ to ship", barWidth: 100 },
          { side: "Chronilogix", val: "Drop-in API", barWidth: 6, primary: true },
        ],
      },
    ],
  },
];

const ROTATION_MS = 7000;

export function WhoWeServe() {
  const [active, setActive] = useState(0);
  const [intervalKey, setIntervalKey] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActive((a) => (a + 1) % PERSONAS.length),
      ROTATION_MS,
    );
    return () => clearInterval(t);
  }, [intervalKey]);

  const handleSelect = (i: number) => {
    setActive(i);
    setIntervalKey((k) => k + 1);
  };

  const persona = PERSONAS[active];

  return (
    <section id="who-we-serve" className="section bg-paper">
      <div className="container-page">
        <p className="eyebrow mb-12 md:mb-16">Who we serve</p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_1fr] lg:gap-20">
          <PersonaNav
            personas={PERSONAS}
            active={active}
            onSelect={handleSelect}
          />

          <div
            key={persona.key}
            className="min-w-0"
            style={{
              animation: "fadeIn 450ms ease-out forwards",
              opacity: 0,
            }}
          >
            <h2 className="text-section font-normal tracking-tight text-ink md:text-display">
              {persona.headlineStart}{" "}
              <span className="text-brand-700">{persona.headlineAccent}</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
              {persona.body}
            </p>

            <a
              href="#book-a-demo"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white shadow-soft transition hover:bg-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2"
            >
              {persona.ctaLabel}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M3 6h6M6 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <div className="mt-14 space-y-10 md:mt-16 md:space-y-12">
              {persona.stats.map((s) => (
                <StatRow key={s.big + s.label} stat={s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonaNav({
  personas,
  active,
  onSelect,
}: {
  personas: Persona[];
  active: number;
  onSelect: (i: number) => void;
}) {
  const fillPct = ((active + 1) / personas.length) * 100;

  return (
    <nav className="relative lg:sticky lg:top-24">
      {/* Single vertical progress bar — desktop only */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 top-0 hidden w-px bg-ink/10 lg:block"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 top-0 hidden w-px origin-top bg-ink lg:block"
        style={{
          transform: `scaleY(${fillPct / 100})`,
          transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      <ul className="flex flex-row flex-wrap gap-x-5 gap-y-3 lg:flex-col lg:gap-5 lg:pl-6">
        {personas.map((p, i) => {
          const isActive = i === active;
          return (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                className={`text-left text-base font-medium leading-snug transition ${
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink-soft"
                }`}
              >
                {p.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function StatRow({ stat }: { stat: Stat }) {
  return (
    <div className="grid items-start gap-5 border-t border-ink/10 pt-6 md:grid-cols-[200px_1fr] md:gap-12">
      <div>
        <p className="text-4xl font-normal tracking-tight text-ink md:text-5xl">
          {stat.big}
        </p>
        <p className="mt-2 text-sm leading-snug text-ink-muted">{stat.label}</p>
      </div>

      <div className="space-y-3">
        {stat.rows.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-[110px_1fr_120px] items-center gap-4 text-xs md:grid-cols-[140px_1fr_140px]"
          >
            <span className="font-medium uppercase tracking-[0.14em] text-ink-muted">
              {r.side}
            </span>
            <div className="h-1.5 overflow-hidden rounded-full bg-ink/5">
              <div
                className={`h-full origin-left rounded-full ${
                  r.primary ? "bg-brand-600" : "bg-ink/25"
                }`}
                style={{
                  transform: `scaleX(${r.barWidth / 100})`,
                  transformOrigin: "left",
                  width: "100%",
                }}
              />
            </div>
            <span className="text-right text-ink-soft">{r.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
