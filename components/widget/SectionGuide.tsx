"use client";

// SectionGuide — bottom-left companion for the homepage.
//
// Two INDEPENDENT pieces share the bottom-left corner but never share
// chrome, because they serve different needs:
//
//   • PageNav ("On this page") — utilitarian wayfinding. A collapsed
//     pill that expands into the page-structure rail (scroll-spy TOC
//     with a brand-gradient fill + pulsing knob). Sits on top.
//
//   • DemoCard — a promotional product-demo teaser. A poster-framed
//     card that opens a focused modal lightbox on click. Sits below,
//     owning the corner. Can minimize to a "Watch demo" pill.
//
// They stack vertically with a gap so they read as two distinct
// elements, each opening / collapsing on its own. The parent only
// orchestrates the shared concerns: the reveal gate, reduced-motion,
// and the single scroll-spy observer that drives the nav's active row.
//
// Positioning + reveal: fixed bottom-left, z-40, mounts once the visitor
// scrolls past the hero (same "fires once, stays" rule as the Rooney
// help widget), hidden below md so mobile stays uncluttered.

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type TocItem = {
  // null id means "scroll to top". The hero has no DOM id of its own.
  id: string | null;
  label: string;
};

// TOC labels trace the homepage's actual argument as a buyer scans it:
// Overview → the premise (why chatbots fail, why MI works) → the method
// (MI) → the coaches (the two agents) → the gap (between appointments) →
// outcomes → who it's for → proof (science + Aetna) → voices
// (testimonials). Clear over clever, and each ≤ 12 chars so the compact
// rail keeps its single-column rhythm.
const TOC: TocItem[] = [
  { id: null, label: "Overview" },
  { id: "statement", label: "The premise" },
  { id: "motivational-interviewing", label: "Method" },
  { id: "solution", label: "The coaches" },
  { id: "problem", label: "The gap" },
  { id: "outcome", label: "Outcomes" },
  { id: "who-we-serve", label: "Who it's for" },
  { id: "customer-stories", label: "Proof" },
  { id: "testimonials", label: "Voices" },
];
const STEP_COUNT = TOC.length;

// Demo asset. Copied into public/video/ so Next serves it statically.
// The poster is a warm, human frame pulled from the walkthrough; the
// runtime label mirrors the file's ~4:06 duration.
const DEMO_SRC = "/video/zenn-demo.mp4";
const DEMO_POSTER = "/video/zenn-demo-poster.jpg";
const DEMO_RUNTIME = "4:06";

// White-label framing. Zenn is a partner-branded product running the
// Chronilogix platform, so the copy keeps Chronilogix the subject and
// casts Zenn as the surface you're watching it through. Without this, a
// first-time visitor could mistake Zenn for the product being sold.
const DEMO_EYEBROW = "Live demo";
const DEMO_TITLE = "See Chronilogix, white-labeled as Zenn";
const DEMO_BLURB =
  "Our platform in action, running inside a partner's own app.";

// Match the site's primary motion curve (out-quart) so this widget's
// transitions read as part of the same system.
const RAIL_EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
// Slightly stronger deceleration for the first-mount widget reveal —
// matches Tailwind's `ease-out-expo` token.
const REVEAL_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// Shared surface material so the two pieces read as the same design
// system: paper-warm fill lifted by a two-layer shadow — a cool sharp
// close-shadow for physical lift, and a warm brand-tinted bloom for
// atmosphere against the cream homepage.
const PANEL_BG = "#FBF8F4"; // paper.warm
const PANEL_SHADOW = [
  "0 1px 0 rgba(255,255,255,0.65) inset",
  "0 -0.5px 0 rgba(15,20,25,0.04) inset",
  "0 1px 2px rgba(15,20,25,0.04)",
  "0 10px 28px -6px rgba(15,20,25,0.16)",
  "0 22px 40px -16px rgba(228,90,28,0.18)",
].join(", ");
const PANEL_BORDER = "1px solid rgba(15,20,25,0.08)";
// Consistent width so the stacked pieces align into a tidy column when
// both are expanded.
const CARD_WIDTH = 264;

export function SectionGuide() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Gate: the widget stays hidden over the hero so it doesn't compete
  // with the opening moment. Mounts once #statement crosses into view,
  // then stays for the rest of the session.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Reveal trigger. Watch the first post-hero section; fire once.
  // Fallback: if that section is missing, reveal once the user has
  // scrolled past ~60% of a viewport so the widget is never unreachable.
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
  // intersection ratio above a small threshold; falls back to "Overview"
  // (index 0) when nothing meaningful is in view.
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

  const activeIndex = useMemo(() => {
    if (activeId === null) return 0;
    const i = TOC.findIndex((t) => t.id === activeId);
    return i === -1 ? 0 : i;
  }, [activeId]);

  // Hold both pieces off-screen until the visitor has scrolled past the
  // hero. Returning null keeps them out of the tab order and lets the
  // entry animation play fresh on first mount.
  if (!revealed) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-40 hidden flex-col items-start gap-2.5 md:flex md:bottom-6 md:left-6"
      aria-label="Homepage companion"
    >
      <PageNav
        activeIndex={activeIndex}
        reducedMotion={reducedMotion}
      />
      <DemoCard reducedMotion={reducedMotion} />
    </div>
  );
}

// ─── PageNav ─────────────────────────────────────────────────────────
// Wayfinding utility. Collapsed pill ⇄ expanded rail card, independent
// of the demo. Scroll-spy (driven by the parent) moves the fill + knob;
// a progress hairline on the collapsed pill preserves orientation even
// while the rail is closed.
function PageNav({
  activeIndex,
  reducedMotion,
}: {
  activeIndex: number;
  reducedMotion: boolean;
}) {
  const [open, setOpen] = useState(false);

  // Rail geometry — same math as Who-We-Serve's PersonaTabs, at a
  // smaller scale once the rows render.
  const segment = 100 / STEP_COUNT;
  const trackTop = segment / 2;
  const trackHeight = 100 - segment;
  const fillHeight =
    STEP_COUNT > 1 ? (activeIndex / (STEP_COUNT - 1)) * trackHeight : 0;
  const knobTop = trackTop + segment * activeIndex;
  const progressPct =
    STEP_COUNT > 1 ? (activeIndex / (STEP_COUNT - 1)) * 100 : 0;

  const scrollTo = (id: string | null) => {
    if (id === null) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const RailGlyph = (
    <span
      aria-hidden
      className="flex h-3 w-[7px] shrink-0 flex-col justify-between"
    >
      <span className="block h-px w-full bg-ink/25" />
      <span className="block h-[2px] w-full rounded-full bg-brand-accent" />
      <span className="block h-px w-full bg-ink/25" />
    </span>
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the page guide"
        aria-expanded={false}
        className="pointer-events-auto group relative flex h-9 items-center gap-2 overflow-hidden rounded-full pl-3 pr-3.5 text-[12px] font-medium text-ink-soft transition-colors duration-200 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF8F4]"
        style={{
          background: PANEL_BG,
          border: PANEL_BORDER,
          boxShadow: PANEL_SHADOW,
        }}
      >
        {RailGlyph}
        On this page
        {/* Position hairline pinned to the pill's bottom edge — the
            visitor keeps a sense of place without opening the rail. */}
        <span
          aria-hidden
          className="absolute inset-x-3 bottom-[3px] block h-[2px] overflow-hidden rounded-full bg-ink/[0.06]"
        >
          <span
            className="block h-full rounded-full"
            style={{
              width: `${progressPct}%`,
              background:
                "linear-gradient(90deg, #FFB088 0%, #FF7434 60%, #E45A1C 100%)",
              transition: reducedMotion
                ? "none"
                : `width 400ms ${RAIL_EASE}`,
            }}
          />
        </span>
      </button>
    );
  }

  return (
    <div
      role="complementary"
      aria-label="Page guide"
      className="pointer-events-auto relative origin-bottom-left overflow-hidden rounded-[14px]"
      style={{
        width: CARD_WIDTH,
        background: PANEL_BG,
        border: PANEL_BORDER,
        boxShadow: PANEL_SHADOW,
        opacity: 0,
        animation: reducedMotion
          ? "none"
          : `guideReveal 420ms ${REVEAL_EASE} forwards`,
      }}
    >
      {/* Header row — same label as the pill; clicking collapses. */}
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-expanded
        aria-controls="page-guide-rail"
        className="group flex w-full items-center gap-2 px-3.5 py-2.5 text-left transition-colors duration-200 hover:bg-ink/[0.025] focus:outline-none focus-visible:bg-ink/[0.04]"
      >
        {RailGlyph}
        <span className="text-[12px] font-medium text-ink-soft transition-colors duration-200 group-hover:text-ink">
          On this page
        </span>
        {/* Step count — a quiet numeric echo of the rail's fill so the
            reader keeps a sense of progress even at a glance. */}
        <span
          aria-hidden
          className="ml-auto text-[11px] font-medium tabular-nums text-ink-subtle"
        >
          {activeIndex + 1}
          <span className="text-ink/25"> / {STEP_COUNT}</span>
        </span>
        <span aria-hidden className="text-ink-subtle">
          <svg width="11" height="7" viewBox="0 0 11 7" aria-hidden>
            <path
              d="M1 5.5 5.5 1.5 10 5.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
      </button>

      {/* Seam. */}
      <span
        aria-hidden
        className="block h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(15,20,25,0) 0%, rgba(15,20,25,0.08) 16%, rgba(15,20,25,0.08) 84%, rgba(15,20,25,0) 100%)",
        }}
      />

      <nav id="page-guide-rail" className="px-3.5 pb-3.5 pt-2.5" aria-label="Homepage sections">
        <ul className="relative">
          {/* Track — 1px hairline aligned to row centers. */}
          <span
            aria-hidden
            className="absolute left-0 block w-px bg-ink/12"
            style={{ top: `${trackTop}%`, height: `${trackHeight}%` }}
          />
          {/* Fill — 2px brand-gradient growing top-down to the active row. */}
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
          {/* Knob — 7px brand-accent dot with a soft pulse ring. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[0.5px]"
            style={{
              top: `${knobTop}%`,
              transform: "translate(-50%, -50%)",
              transition: reducedMotion ? "none" : `top 400ms ${RAIL_EASE}`,
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
            const isVisited = i < activeIndex;
            // Three-tier reading gradient: passed rows stay legible (you
            // read them), the active row is full-strength, upcoming rows
            // recede. Gives the rail a sense of travel the fill alone can't.
            const color = isActive
              ? "rgba(15,20,25,0.95)"
              : isVisited
                ? "rgba(15,20,25,0.62)"
                : "rgba(15,20,25,0.4)";
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="group relative flex w-full items-center rounded-md py-[5px] pl-4 pr-1.5 text-left transition-colors duration-200 hover:bg-ink/[0.025] focus:outline-none focus-visible:bg-ink/[0.04]"
                  style={{
                    background: isActive
                      ? "rgba(255,116,52,0.06)"
                      : "transparent",
                    transition: reducedMotion
                      ? "none"
                      : "background-color 300ms ease-out",
                  }}
                >
                  <span
                    className="text-[12px] leading-snug"
                    style={{
                      color,
                      fontWeight: isActive ? 500 : 400,
                      transition: reducedMotion ? "none" : "color 300ms ease-out",
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
    </div>
  );
}

// ─── DemoCard ────────────────────────────────────────────────────────
// Promotional teaser. Poster-framed card ⇄ "Watch demo" pill; clicking
// the poster (or the pill) opens the modal lightbox. Independent of the
// nav above it.
function DemoCard({ reducedMotion }: { reducedMotion: boolean }) {
  const [open, setOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {open ? (
        <div
          className="pointer-events-auto relative origin-bottom-left overflow-hidden rounded-[14px]"
          style={{
            width: CARD_WIDTH,
            background: PANEL_BG,
            border: PANEL_BORDER,
            boxShadow: PANEL_SHADOW,
            opacity: 0,
            animation: reducedMotion
              ? "none"
              : `guideReveal 480ms ${REVEAL_EASE} 80ms forwards`,
          }}
        >
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-label="Play the demo: Chronilogix white-labeled as Zenn"
            aria-haspopup="dialog"
            className="group relative block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60"
          >
            <span className="relative block aspect-video w-full bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DEMO_POSTER}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04]"
                style={{
                  transition: reducedMotion
                    ? "none"
                    : `transform 600ms ${RAIL_EASE}`,
                }}
              />
              {/* Scrim — deepens toward the corners so the eyebrow,
                  runtime, and play glyph stay legible over any frame. */}
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(15,20,25,0.42) 0%, rgba(15,20,25,0) 34%, rgba(15,20,25,0) 62%, rgba(15,20,25,0.46) 100%)",
                }}
              />
              <span className="absolute left-3 top-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
                {DEMO_EYEBROW}
              </span>
              <span className="absolute bottom-2.5 right-3 rounded-full bg-ink/55 px-1.5 py-0.5 text-[10.5px] font-medium tabular-nums text-white/90 backdrop-blur-sm">
                {DEMO_RUNTIME}
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-accent text-white shadow-[0_6px_18px_-4px_rgba(228,90,28,0.6)] group-hover:scale-110"
                  style={{
                    transition: reducedMotion
                      ? "none"
                      : `transform 300ms ${RAIL_EASE}`,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                    aria-hidden
                    className="ml-0.5"
                  >
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                </span>
              </span>
            </span>
          </button>

          {/* Caption — the white-label story. Chronilogix stays the
              subject; Zenn is named as the partner brand the demo runs
              under, so the visitor understands they're seeing our
              technology, not a separate product. */}
          <div className="px-3.5 pb-3 pt-2.5">
            <p className="text-[12.5px] font-medium leading-snug text-ink">
              {DEMO_TITLE}
            </p>
            <p className="mt-1 text-[11.5px] leading-snug text-ink-soft">
              {DEMO_BLURB}
            </p>
          </div>

          {/* Minimize — floats over the top-right corner of the poster.
              Sibling of the demo button so its clicks never open the
              modal. */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Minimize the demo"
            className="absolute right-2 top-2 z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-ink/45 text-white/85 backdrop-blur-sm transition-colors duration-200 hover:bg-ink/65 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
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
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Show the product demo"
          className="pointer-events-auto group flex h-9 items-center gap-2 rounded-full pl-2.5 pr-3.5 text-[12px] font-medium text-ink-soft transition-colors duration-200 hover:text-ink"
          style={{
            background: PANEL_BG,
            border: PANEL_BORDER,
            boxShadow: PANEL_SHADOW,
          }}
        >
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-accent text-white">
            <svg
              viewBox="0 0 24 24"
              width="11"
              height="11"
              fill="currentColor"
              aria-hidden
              className="ml-0.5"
            >
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
          Watch demo
        </button>
      )}

      {modalOpen ? (
        <DemoModal
          onClose={() => setModalOpen(false)}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </>
  );
}

// Focused lightbox for the product demo. Dim + blur backdrop, centered
// 16:9 player with native controls and audio, rendered through a portal
// so it escapes any parent stacking context. Reuses the site's fadeIn /
// modalIn keyframes. Closes on ESC, backdrop click, or the × button;
// locks body scroll and restores focus to the trigger on close.
function DemoModal({
  onClose,
  reducedMotion,
}: {
  onClose: () => void;
  reducedMotion: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Focus the close button on open; restore focus to the trigger (the
  // demo poster / pill) on close.
  useEffect(() => {
    previousActive.current = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      previousActive.current?.focus?.();
    };
  }, []);

  // ESC closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop — dim + blur. */}
      <div
        aria-hidden
        className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-md"
        style={{
          animation: reducedMotion ? "none" : "fadeIn 240ms ease-out both",
        }}
      />

      {/* Container — click outside the player closes. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Demo: Chronilogix white-labeled as Zenn"
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[1200px] overflow-hidden rounded-[18px] bg-ink shadow-[0_40px_80px_-24px_rgba(15,20,25,0.55)]"
          style={{
            animation: reducedMotion
              ? "none"
              : "modalIn 320ms cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close demo"
            className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink/55 text-white/90 backdrop-blur-sm transition-colors hover:bg-ink/75 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Header — carries the white-label framing into the player so
              the context holds while the demo runs, not just on the launch
              card. pr reserves room for the close button. */}
          <div className="flex flex-col gap-1 px-5 pb-3.5 pr-14 pt-4 md:px-7 md:pb-4 md:pr-16 md:pt-5">
            <p className="text-[15px] font-medium leading-snug text-white md:text-[17px]">
              {DEMO_TITLE}
            </p>
            <p className="text-[12.5px] leading-snug text-white">
              {DEMO_BLURB}
            </p>
          </div>

          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            className="block aspect-video w-full bg-ink"
            src={DEMO_SRC}
            poster={DEMO_POSTER}
            controls
            autoPlay
            playsInline
            preload="metadata"
          />
        </div>
      </div>
    </>,
    document.body,
  );
}
