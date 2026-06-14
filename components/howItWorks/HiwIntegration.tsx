"use client";

import { useEffect, useRef, useState } from "react";

type Path = {
  index: string;
  label: string;
  body: React.ReactNode;
  Icon: React.ComponentType<{ className?: string }>;
};

/**
 * Integration section — dedicated treatment for capability #15.
 *
 * Where HiwPlatform's compact pillars cover white-label and coverage in
 * one line each, the integration capability is content-heavy: four
 * commercial deployment paths plus the underlying infrastructure
 * posture. This section unpacks it as a 2×2 grid of paths so each one
 * can carry its own context, with a Stripe + HIPAA infrastructure note
 * closing the block.
 */

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}

export function HiwIntegration() {
  const { ref, inView } = useInView<HTMLUListElement>(0.16);
  return (
    <section
      id="integration"
      className="relative overflow-hidden rounded-[28px] bg-white pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40"
    >
      <div className="container-page">
        {/* Header */}
        <div className="max-w-3xl">
          <h2
            className="mt-4 text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Plugs into how{" "}
            <span className="text-ink-muted">you already deliver care.</span>
          </h2>
          <p className="mt-5 max-w-[62ch] body-quiet">
            Four ways Chronilogix lands inside an existing care delivery
            model — on infrastructure that meets you where compliance
            demands it.
          </p>
        </div>

        {/* 2×2 grid of integration paths */}
        <ul
          ref={ref}
          className="mt-16 grid grid-cols-1 gap-x-12 gap-y-12 md:mt-20 md:grid-cols-2 md:gap-y-14"
        >
          {PATHS.map((path, i) => {
            const Icon = path.Icon;
            return (
              <li
                key={path.label}
                className="flex flex-col"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${160 + i * 110}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${160 + i * 110}ms`,
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/10 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-serif text-[13px] font-medium tabular-nums text-brand-700">
                    {path.index}
                  </span>
                </div>
                <p className="mt-5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink-muted">
                  {path.label}
                </p>
                <h3
                  className="mt-3 max-w-[22ch] font-serif text-[22px] font-normal leading-[1.18] text-ink md:text-[24px]"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  {path.heading}
                </h3>
                <p className="mt-4 max-w-[40ch] text-[14.5px] leading-relaxed text-ink-soft md:text-[15px]">
                  {path.body}
                </p>
              </li>
            );
          })}
        </ul>

        {/* Infrastructure note — single muted line under the paths,
            separated by a hairline so the technical posture reads as
            ground-floor rather than another path. */}
        <div className="mt-16 border-t border-ink/10 pt-7 md:mt-20">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
              Infrastructure
            </span>
            <span className="text-[14.5px] leading-relaxed text-ink-soft md:text-[15px]">
              Stripe-powered consumer-direct billing.
              <span className="mx-2 text-ink/25">·</span>
              HIPAA-compliant by default.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Integration path icons ────────────────────────────────────────────── */

function RecurringIcon({ className }: { className?: string }) {
  // Two opposing arrows curving around — a subscription / recurring motion.
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3.5 10a6.5 6.5 0 0 1 11.6-4" />
      <path d="M16.5 10a6.5 6.5 0 0 1-11.6 4" />
      <path d="M15 3v3h-3" />
      <path d="M5 17v-3h3" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="6.5" width="14" height="9.5" rx="1.6" />
      <path d="M7.2 6.5V5.2a1.2 1.2 0 0 1 1.2-1.2h3.2a1.2 1.2 0 0 1 1.2 1.2v1.3" />
      <path d="M3 10.5h14" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  // Two interlocked rings — affiliate / partner embed.
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8.4 6.6 6.6 4.8a3.3 3.3 0 0 0-4.6 4.6l2.6 2.6a3.3 3.3 0 0 0 4.6 0" />
      <path d="M11.6 13.4l1.8 1.8a3.3 3.3 0 0 0 4.6-4.6l-2.6-2.6a3.3 3.3 0 0 0-4.6 0" />
      <path d="M8 12l4-4" />
    </svg>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 3 3 6v8l7 3 7-3V6l-7-3Z" />
      <path d="M3 6l7 3 7-3" />
      <path d="M10 9v8" />
    </svg>
  );
}

/* ── Path data ─────────────────────────────────────────────────────────── */

const PATHS: (Path & { heading: string })[] = [
  {
    index: "01",
    label: "Subscription access",
    heading: "Direct PMPM contracts with health plans.",
    body: (
      <>
        Member-month pricing inside an existing plan footprint — without
        the plan having to build clinical IP from scratch.
      </>
    ),
    Icon: RecurringIcon,
  },
  {
    index: "02",
    label: "Employer benefit bundles",
    heading: "Inside existing employer wellness benefits.",
    body: (
      <>
        Drops into a benefits portfolio alongside EAP, telehealth, and
        wellness vendors — reachable by every covered employee without
        a separate enrollment flow.
      </>
    ),
    Icon: BriefcaseIcon,
  },
  {
    index: "03",
    label: "Affiliate software",
    heading: "Embedded in partner wellness or fitness apps.",
    body: (
      <>
        Lives as a coaching layer inside a partner&rsquo;s existing app
        experience — same surface the member already opens, with
        Chronilogix doing the clinical work underneath.
      </>
    ),
    Icon: LinkIcon,
  },
  {
    index: "04",
    label: "Chronic care vendors",
    heading: "Co-deployed with supplies and devices.",
    body: (
      <>
        Pairs with diabetes supply programs, glucose monitors, and other
        chronic-care vendors so the behavioral layer ships in the same
        box as the clinical hardware.
      </>
    ),
    Icon: PackageIcon,
  },
];
