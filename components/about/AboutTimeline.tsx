"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Milestone = {
  era: string;
  title: string;
  body: string;
};

// Newest first — the visitor lands on the most recent moment and drags
// rightward to discover the lineage. This puts "launch" on the left
// (today, here) and "foundations" on the right (origin, 25 years back).
const MILESTONES: Milestone[] = [
  {
    era: "January 2026",
    title: "Commercial launch",
    body:
      "Roni and the Chronilogix app launch at the NBIP and ASCEND Conference.",
  },
  {
    era: "2023",
    title: "Chronilogix founded",
    body:
      "Initial scripting of the AI coaching architecture begins on top of the MI research lineage.",
  },
  {
    era: "2015 to today",
    title: "Scale",
    body:
      "Expansion to U.S. providers including Kaiser and Active Health. Over 10,000 practitioners and 200 trainers trained globally.",
  },
  {
    era: "2010 to 2015",
    title: "Market entry",
    body:
      "Partnerships with AmeriHealth, Caritas, and the launch of the Global MI program for Aetna.",
  },
  {
    era: "2005 to 2010",
    title: "Deep tailoring",
    body:
      "Academic research expansion, deep tailoring, and the first digital health applications of MI.",
  },
  {
    era: "2000 to 2005",
    title: "Foundations",
    body:
      "Initial development of MI training systems and the first wave of behavioral intervention research.",
  },
];

const DOT_COLOR = "rgba(45,30,20,0.45)";

/**
 * Two intertwined sinusoidal particle streams. Each path is a smooth S-curve
 * that spans exactly one wavelength and lands back on the centre at both
 * boundaries, so the pattern tiles seamlessly when repeated horizontally.
 *
 *   wave A: rises early, dips late  ─ ╭╮╭╮ ─
 *   wave B: dips early, rises late   ─ ╰╯╰╯ ─
 *
 * stroke-dasharray turns each curve into a row of fine particles. Where the
 * two waves cross (every λ/2) the particles overlap and read as denser,
 * producing the woven, flowing texture of the reference.
 */
const WAVE_TILE_WIDTH = 80;
const WAVE_TILE_HEIGHT = 20;
const WAVE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='${WAVE_TILE_WIDTH}' height='${WAVE_TILE_HEIGHT}' viewBox='0 0 ${WAVE_TILE_WIDTH} ${WAVE_TILE_HEIGHT}'><path d='M 0 10 C 20 4 60 16 80 10' stroke='${DOT_COLOR}' stroke-width='1.4' stroke-dasharray='1.2 2.4' stroke-linecap='round' fill='none'/><path d='M 0 10 C 20 16 60 4 80 10' stroke='${DOT_COLOR}' stroke-width='1.4' stroke-dasharray='1.2 2.4' stroke-linecap='round' fill='none'/></svg>`;
const WAVE_BG = `url("data:image/svg+xml;utf8,${encodeURIComponent(WAVE_SVG)}")`;
const MARKER_COLOR = "#2D1E14";

export function AboutTimeline() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Step scroll by one column width. The first child of the track's
  // inner row is the leading continuation segment; the second is the
  // first milestone — measure that to get a stable column width.
  const scrollByColumn = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const row = el.firstElementChild as HTMLDivElement | null;
    const firstColumn = row?.querySelector<HTMLDivElement>(
      "[data-milestone-column]",
    );
    const step = firstColumn?.offsetWidth ?? 320;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  return (
    <section
      id="timeline"
      className="relative overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(180deg, #FBF6F0 0%, #F6E5D2 65%, #F2DCC4 100%)",
      }}
    >
      <div className="container-page pt-24 md:pt-32 lg:pt-40">
        <Intro />
        <DragHint onLeft={() => scrollByColumn(-1)} onRight={() => scrollByColumn(1)} />
      </div>

      <HorizontalTimeline trackRef={trackRef} />

      <div className="h-24 md:h-32 lg:h-40" />
    </section>
  );
}

function Intro() {
  return (
    <div className="max-w-[48rem]">
      <Reveal>
        <p className="eyebrow">Our timeline</p>
      </Reveal>
      <Reveal delay={100}>
        <h2
          className="mt-4 text-hero font-serif font-normal text-ink"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Twenty years in the making.{" "}
          <span className="text-ink-muted">Built for right now.</span>
        </h2>
      </Reveal>
      <Reveal delay={200}>
        <p className="mt-7 max-w-[58ch] body-prose">
          Chronilogix didn&rsquo;t start with a pitch deck. It started with
          research. The intellectual foundation of our platform, Motivational
          Interviewing as a scalable intervention for chronic and behavioral
          health, has been in development for over two decades. What&rsquo;s
          changed is the technology available to deliver it.
        </p>
      </Reveal>
    </div>
  );
}

function DragHint({
  onLeft,
  onRight,
}: {
  onLeft: () => void;
  onRight: () => void;
}) {
  return (
    <Reveal delay={300}>
      <div className="mt-10 flex items-center justify-center gap-5 md:mt-14">
        <ChevButton dir="left" onClick={onLeft} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
          drag
        </span>
        <ChevButton dir="right" onClick={onRight} />
      </div>
    </Reveal>
  );
}

// ─── Horizontal scrolling timeline ──────────────────────────────────────────
// Track is full-bleed (escapes the container-page max-width) so the dotted
// line and milestones can run edge-to-edge. Drag-to-scroll handles mouse,
// pen, and touch via PointerEvents. Native trackpad / touch swipe also works.

function HorizontalTimeline({
  trackRef,
}: {
  trackRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startScroll = 0;
    let capturedId: number | null = null;
    let moved = false;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      capturedId = e.pointerId;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      setIsDragging(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startScroll - dx;
    };

    const release = () => {
      if (!down) return;
      down = false;
      if (capturedId !== null) {
        try {
          el.releasePointerCapture(capturedId);
        } catch {
          /* ignore */
        }
        capturedId = null;
      }
      setIsDragging(false);
    };

    // Block click events that fire after a drag — otherwise an accidental
    // chevron-button click could fire on pointerup at the end of a drag
    // that started over the button.
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
    el.addEventListener("pointerleave", release);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
      el.removeEventListener("pointerleave", release);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [trackRef]);

  return (
    <div
      ref={trackRef}
      className="mt-32 overflow-x-auto [&::-webkit-scrollbar]:hidden md:mt-44 lg:mt-52"
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-x",
        // Soft fade on BOTH edges of the track so the row feels continuous —
        // implies lineage extending past the visible window in both directions.
        maskImage:
          "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
      }}
    >
      <div className="flex select-none">
        {/* Leading dotted continuation — mirrors the trailing segment so the
            line reads as if it stretches in from before "today". */}
        <DottedFiller direction="leading" />

        {MILESTONES.map((m, i) => (
          <MilestoneColumn
            key={m.era}
            milestone={m}
            index={i}
            isLaunch={i === 0}
          />
        ))}

        {/* Trailing dotted continuation — the lineage runs deeper still. */}
        <DottedFiller direction="trailing" />
      </div>
    </div>
  );
}

function DottedFiller({ direction }: { direction: "leading" | "trailing" }) {
  const isLeading = direction === "leading";
  return (
    <div className="shrink-0 w-[clamp(80px,12vw,180px)]">
      <div className="relative h-[40px] md:h-[48px]">
        <div
          className="absolute inset-x-0 top-1/2 h-5 -translate-y-1/2"
          style={{
            backgroundImage: WAVE_BG,
            backgroundSize: `${WAVE_TILE_WIDTH}px ${WAVE_TILE_HEIGHT}px`,
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center",
            maskImage: isLeading
              ? "linear-gradient(to right, transparent 0%, #000 100%)"
              : "linear-gradient(to right, #000 0%, transparent 100%)",
            WebkitMaskImage: isLeading
              ? "linear-gradient(to right, transparent 0%, #000 100%)"
              : "linear-gradient(to right, #000 0%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}

function MilestoneColumn({
  milestone,
  index,
  isLaunch,
}: {
  milestone: Milestone;
  index: number;
  isLaunch: boolean;
}) {
  return (
    <div
      data-milestone-column
      className="shrink-0 w-[320px] pr-12 md:w-[460px] md:pr-16 lg:w-[540px] lg:pr-20"
    >
      {/* Top: dotted line with a square marker anchored at the left edge.
          The line continues across every column so the whole row reads as
          one continuous timeline. */}
      <div className="relative h-[40px] md:h-[48px]">
        <div
          className="absolute inset-x-0 top-1/2 h-5 -translate-y-1/2"
          style={{
            backgroundImage: WAVE_BG,
            backgroundSize: `${WAVE_TILE_WIDTH}px ${WAVE_TILE_HEIGHT}px`,
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center",
          }}
        />
        {/* The "today" marker gets brand-orange + a soft pulse so the eye
            lands on where the company is right now, before reading rightward
            into history. */}
        {isLaunch ? (
          <span
            aria-hidden
            className="absolute left-0 top-1/2 -translate-y-1/2"
            style={{ width: 10, height: 10 }}
          >
            <span
              className="absolute inset-0 rounded-[1px] bg-brand-accent motion-reduce:animate-none"
              style={{ animation: "livePulse 2.4s ease-in-out infinite" }}
            />
            <span
              aria-hidden
              className="absolute -inset-1.5 rounded-[3px] bg-brand-accent/20 motion-reduce:animate-none"
              style={{
                animation: "livePulse 2.4s ease-in-out infinite",
                animationDelay: "1.2s",
              }}
            />
          </span>
        ) : (
          <span
            aria-hidden
            className="absolute left-0 top-1/2 -translate-y-1/2"
            style={{
              width: 9,
              height: 9,
              background: MARKER_COLOR,
            }}
          />
        )}
      </div>

      {/* Content */}
      <Reveal delay={index * 60}>
        <div className="pt-10 md:pt-14">
          <p
            className="font-serif font-normal leading-[0.98] tracking-[-0.02em] text-ink"
            style={{ fontSize: "clamp(34px, 4vw, 56px)" }}
          >
            {milestone.era}
          </p>
          <p className="mt-6 max-w-[34ch] text-[14px] leading-relaxed text-ink-muted md:mt-7 md:text-[15px]">
            {milestone.body}
          </p>
        </div>
      </Reveal>
    </div>
  );
}

function ChevButton({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Scroll timeline left" : "Scroll timeline right"}
      className="group/chev -m-3 inline-flex h-11 w-11 items-center justify-center text-ink-muted transition-colors duration-200 ease-out hover:text-ink focus:outline-none focus-visible:text-ink"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
      >
        <path
          d={dir === "left" ? "M9 3 L4 7 L9 11" : "M5 3 L10 7 L5 11"}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function Reveal({
  delay = 0,
  children,
}: {
  delay?: number;
  children: React.ReactNode;
}) {
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
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
