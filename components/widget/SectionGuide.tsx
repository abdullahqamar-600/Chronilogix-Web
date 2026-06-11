"use client";

// SectionGuide — compact bottom-left companion for the homepage.
//
// Two halves, no headings:
//   1) A vertical-rail TOC of homepage sections. Same rail treatment as
//      the Who-We-Serve persona tabs (track + brand-gradient fill +
//      pulsing knob), but scaled thin so it lives quietly in the
//      corner. Click to scroll; scroll-spy moves the knob.
//   2) A single line of copy that names a buyer pain and how
//      Chronilogix meets it. Cross-fades (no slider) on a slow timer,
//      with a hanging roman numeral anchoring each line.
//
// Material: paper-warm panel that matches the cream homepage, lifted by
// a layered shadow (cool sharp + warm brand-tinted underlay), with a
// hairline of cast light along the top edge. The dwell-progress
// hairline at the bottom of the panel ticks across each rotation,
// pausing on hover.
//
// Positioning: fixed bottom-left, z-40. Mounts only after the visitor
// scrolls past the hero — same "fires once, stays" rule as the Rooney
// help widget. Hidden below md so mobile is uncluttered.

import { useEffect, useMemo, useState } from "react";

type TocItem = {
  // null id means "scroll to top" — the hero has no DOM id of its own.
  id: string | null;
  label: string;
};

// TOC labels are conventional + clear — what a healthcare buyer
// expects to see in a nav, not the homepage's internal arc names
// ("Statement", "Outcome"). Each ≤ 12 chars so the compact rail keeps
// its single-column rhythm.
const TOC: TocItem[] = [
  { id: null, label: "Overview" },
  { id: "statement", label: "Mission" },
  { id: "solution", label: "Platform" },
  { id: "problem", label: "The gap" },
  { id: "outcome", label: "Outcomes" },
  { id: "who-we-serve", label: "Who it's for" },
  { id: "customer-stories", label: "Proof" },
];
const STEP_COUNT = TOC.length;

// Rotating one-liners — buyer-first voice. Each line follows the same
// shape: a concrete buyer pain, then Chronilogix as the subject doing
// one concrete verb, anchored to a real claim from the homepage copy
// doc (Aetna 25%, 200:1 counselor ratio, Dr. Resnicow / MI, 50–70%
// cost reduction, the data-policy line). Five lines cover the four
// buyer personas + the IT/compliance reviewer.
const LINES: string[] = [
  // Employer / HR — engagement gap, Aetna proof.
  "Most EAPs reach single digits. Chronilogix engaged an additional 25% of employees at Aetna.",
  // University — counselor ratio, immediate availability.
  "200 students per counselor; two-week waits. Chronilogix answers the moment a student reaches out.",
  // The differentiator — Dr. Resnicow + MI. Echoes the homepage's
  // verbatim "reflect, not lecture" line.
  "Generic AI lectures. Chronilogix reflects, built on Dr. Resnicow's 30 years of MI research.",
  // Health plans — cost story.
  "Live coaching doesn't scale. Chronilogix delivers the outcomes at 50–70% lower cost.",
  // IT / compliance / legal — verbatim from Section 7.
  "Member data is never used to train our models. Not now. Not ever.",
];
const ROTATION_MS = 6000;
const ROMAN = ["I", "II", "III", "IV", "V"];

// Match the site's primary motion curve (out-quart) so this widget's
// transitions read as part of the same system.
const RAIL_EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
// Slightly stronger deceleration for the first-mount widget reveal —
// matches Tailwind's `ease-out-expo` token.
const REVEAL_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function SectionGuide() {
  const [open, setOpen] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lineIdx, setLineIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Gate: the widget stays hidden over the hero so it doesn't compete
  // with the opening moment. It mounts only once the next section
  // (#statement) crosses into view, then stays for the rest of the
  // session — same "fires once, stays visible" pattern documented in
  // the Rooney widget UX spec.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Reveal trigger. Watch the first post-hero section; fire once.
  // Fallback: if for any reason that section is missing, reveal as
  // soon as the user has scrolled past one viewport height — the
  // widget should never be unreachable.
  useEffect(() => {
    if (revealed) return;
    const target = document.getElementById("statement");
    if (target) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
          }
        },
        { threshold: 0.1 },
      );
      obs.observe(target);
      return () => obs.disconnect();
    }
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        setRevealed(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealed]);

  // Scroll-spy. Picks whichever observed section has the largest
  // intersection ratio above a small threshold; falls back to "Top"
  // when nothing meaningful is in view (i.e. user is at the hero).
  useEffect(() => {
    const ids = TOC.map((t) => t.id).filter((id): id is string => Boolean(id));
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let best: { id: string; r: number } | null = null;
        for (const [id, r] of ratios) {
          if (r > 0.15 && (!best || r > best.r)) best = { id, r };
        }
        setActiveId(best?.id ?? null);
      },
      { threshold: [0.15, 0.3, 0.5, 0.75] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  // Line rotation. Pause on hover so the visitor can finish reading.
  useEffect(() => {
    if (paused || reducedMotion) return;
    const t = window.setInterval(() => {
      setLineIdx((i) => (i + 1) % LINES.length);
    }, ROTATION_MS);
    return () => window.clearInterval(t);
  }, [paused, reducedMotion]);

  // Map the active section id to an index on the rail. Top === 0.
  const activeIndex = useMemo(() => {
    if (activeId === null) return 0;
    const i = TOC.findIndex((t) => t.id === activeId);
    return i === -1 ? 0 : i;
  }, [activeId]);

  // Rail geometry — same math as Who-We-Serve's PersonaTabs, just at a
  // smaller scale once the rows render.
  const segment = 100 / STEP_COUNT;
  const trackTop = segment / 2;
  const trackHeight = 100 - segment;
  const fillHeight =
    STEP_COUNT > 1 ? (activeIndex / (STEP_COUNT - 1)) * trackHeight : 0;
  const knobTop = trackTop + segment * activeIndex;

  const scrollTo = (id: string | null) => {
    if (id === null) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Hold the widget off-screen until the visitor has scrolled past
  // the hero. Returning null keeps it out of the tab order entirely
  // and ensures the entry animation plays fresh on first mount.
  if (!revealed) return null;

  // Surface material — kept in one place so the expanded panel and the
  // collapsed pill stay in lockstep. The shadow stack is two layers: a
  // cool, sharp close-shadow for physical lift, and a warm brand-tinted
  // bloom for atmosphere against the cream homepage.
  const PANEL_BG = "#FBF8F4"; // paper.warm
  const PANEL_SHADOW = [
    "0 1px 0 rgba(255,255,255,0.65) inset",
    "0 -0.5px 0 rgba(15,20,25,0.04) inset",
    "0 1px 2px rgba(15,20,25,0.04)",
    "0 10px 28px -6px rgba(15,20,25,0.16)",
    "0 22px 40px -16px rgba(228,90,28,0.18)",
  ].join(", ");
  const PANEL_BORDER = "1px solid rgba(15,20,25,0.08)";

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-40 hidden md:block md:bottom-6 md:left-6"
      aria-label="Page guide"
    >
      {open ? (
        <div
          role="complementary"
          aria-label="Page guide"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="pointer-events-auto relative w-[244px] origin-bottom-left overflow-hidden rounded-[14px]"
          style={{
            background: PANEL_BG,
            border: PANEL_BORDER,
            boxShadow: PANEL_SHADOW,
            opacity: 0,
            animation: reducedMotion
              ? "none"
              : `guideReveal 720ms ${REVEAL_EASE} forwards`,
          }}
        >
          {/* Cast-light highlight — a soft warm gradient pinned to the
              top edge inside the border, reading as light catching the
              top bevel. ~24% height keeps it as atmosphere, not stripe. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,180,136,0.10) 0%, rgba(255,180,136,0) 100%)",
            }}
          />

          {/* Collapse — sits absolute so it doesn't take a header row,
              keeping the widget as compact as possible. */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Collapse page guide"
            className="absolute right-2 top-2 z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full text-ink-subtle transition-colors duration-200 hover:bg-ink/[0.06] hover:text-ink"
          >
            <svg width="9" height="2" viewBox="0 0 9 2" aria-hidden>
              <path
                d="M0.75 1h7.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Part 1 — compact vertical rail (track + fill + knob), same
              treatment as the Who-We-Serve persona rail. */}
          <nav className="px-3.5 pb-3 pt-3" aria-label="Homepage sections">
            <ul className="relative">
              {/* Track — 1px hairline aligned to row centers. */}
              <span
                aria-hidden
                className="absolute left-0 block w-px bg-ink/12"
                style={{
                  top: `${trackTop}%`,
                  height: `${trackHeight}%`,
                }}
              />
              {/* Fill — 2px brand-gradient growing top-down to the active
                  row. Slim version of the persona rail's 4px fill. */}
              <span
                aria-hidden
                className="absolute left-[-0.5px] block w-[2px] rounded-full"
                style={{
                  top: `${trackTop}%`,
                  height: `${fillHeight}%`,
                  background:
                    "linear-gradient(180deg, #FFB088 0%, #FF7434 55%, #E45A1C 100%)",
                  boxShadow:
                    "0 0 0 1px rgba(255,116,52,0.06), 0 4px 12px -4px rgba(255,116,52,0.45)",
                  transition: reducedMotion
                    ? "none"
                    : `top 400ms ${RAIL_EASE}, height 400ms ${RAIL_EASE}`,
                }}
              />
              {/* Knob — 7px brand-accent dot with a soft pulse ring,
                  scaled down from the persona section's 9px knob. */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-[0.5px]"
                style={{
                  top: `${knobTop}%`,
                  transform: "translate(-50%, -50%)",
                  transition: reducedMotion
                    ? "none"
                    : `top 400ms ${RAIL_EASE}`,
                }}
              >
                <span className="relative block">
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 block h-[7px] w-[7px] rounded-full"
                    style={{
                      backgroundColor: "#FF7434",
                      transform: "translate(-50%, -50%)",
                      animation: reducedMotion
                        ? "none"
                        : "knobPulse 2400ms cubic-bezier(0.22, 0.61, 0.36, 1) infinite",
                    }}
                  />
                  <span
                    className="relative block h-[7px] w-[7px] rounded-full bg-brand-accent"
                    style={{
                      boxShadow:
                        "0 0 0 2px rgba(255,116,52,0.15), 0 3px 8px -2px rgba(255,116,52,0.4)",
                    }}
                  />
                </span>
              </span>

              {TOC.map((item, i) => {
                const isActive = i === activeIndex;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className="group relative flex w-full items-center rounded-md py-[5px] pl-4 pr-1.5 text-left transition-colors duration-200 hover:bg-ink/[0.025]"
                    >
                      <span
                        className="text-[12px] leading-snug"
                        style={{
                          color: isActive
                            ? "rgba(15,20,25,0.95)"
                            : "rgba(15,20,25,0.48)",
                          transition: reducedMotion
                            ? "none"
                            : "color 300ms ease-out",
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Seam — a hairline divider warmed slightly toward the brand
              so it reads as the same material, not a foreign rule. */}
          <span
            aria-hidden
            className="block h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(15,20,25,0) 0%, rgba(15,20,25,0.08) 16%, rgba(15,20,25,0.08) 84%, rgba(15,20,25,0) 100%)",
            }}
          />

          {/* Part 2 — single line + roman numeral marker. Two stacked
              layers swap opacity so the transition is a true crossfade,
              never a slide. The slot pins to a stable height so the
              widget doesn't reflow as lines change length. */}
          <div
            className="relative px-3.5 pb-4 pt-3"
            aria-live="polite"
          >
            <div className="relative grid grid-cols-[14px_1fr] gap-x-2">
              {/* Roman numeral column — same italic-serif marker the
                  Who-We-Serve section uses for its argument rows. Acts as
                  a quiet anchor so the rotating line has a typographic
                  hand-hold instead of floating in space. */}
              <div className="relative h-[68px]">
                {LINES.map((_, i) => {
                  const isActive = i === lineIdx;
                  return (
                    <span
                      key={i}
                      className="absolute inset-x-0 top-0 select-none font-serif text-[11px] italic leading-[1.45] text-brand-700/80"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transition: reducedMotion
                          ? "none"
                          : `opacity 700ms ${RAIL_EASE}`,
                      }}
                    >
                      {ROMAN[i] ?? String(i + 1)}.
                    </span>
                  );
                })}
              </div>

              {/* Line column. */}
              <div className="relative h-[68px]">
                {LINES.map((text, i) => {
                  const isActive = i === lineIdx;
                  return (
                    <p
                      key={i}
                      className="absolute inset-0 text-[12px] leading-[1.45] text-ink-soft"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? "translateY(0)"
                          : "translateY(2px)",
                        transition: reducedMotion
                          ? "none"
                          : `opacity 700ms ${RAIL_EASE}, transform 700ms ${RAIL_EASE}`,
                      }}
                    >
                      {text}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dwell progress hairline — pinned to the bottom of the
              panel. 1px brand gradient that sweeps left to right across
              each ROTATION_MS dwell, pausing when the visitor hovers
              and restarting cleanly on each new line. The key remount
              guarantees the animation begins from scaleX(0) every
              rotation, matching the line transition. */}
          {!reducedMotion && (
            <span
              aria-hidden
              key={lineIdx}
              className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,176,136,0) 0%, #FF7434 55%, #E45A1C 100%)",
                transform: "scaleX(0)",
                animation: `guideDwell ${ROTATION_MS}ms linear forwards`,
                animationPlayState: paused ? "paused" : "running",
              }}
            />
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Expand page guide"
          className="pointer-events-auto group flex h-9 items-center gap-2 rounded-full px-3.5 text-[12px] font-medium text-ink-soft transition-colors duration-200 hover:text-ink"
          style={{
            background: PANEL_BG,
            border: PANEL_BORDER,
            boxShadow: PANEL_SHADOW,
          }}
        >
          {/* Compact rail glyph — three stacked hairlines with the
              brand-accent in the active slot. Reads as "you are
              somewhere on this page" rather than a generic dot. */}
          <span aria-hidden className="flex h-3 w-[7px] flex-col justify-between">
            <span className="block h-px w-full bg-ink/25" />
            <span className="block h-[2px] w-full rounded-full bg-brand-accent" />
            <span className="block h-px w-full bg-ink/25" />
          </span>
          On this page
        </button>
      )}
    </div>
  );
}
