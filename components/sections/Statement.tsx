"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { HeroPhoneMockup } from "@/components/HeroPhoneMockup";

const SENTENCES = [
  "Chronilogix is the AI-native behavioral health and chronic care coaching platform.",
  "Built on Dr. Ken Resnicow's life's work in Motivational Interviewing.",
  "Clinical-grade outcomes at a fraction of the cost of live care.",
];

const REVEAL_START = 0.05;
const REVEAL_END = 0.45;
const WINDOW_RATIO = 4;
const MOBILE_TEXT_DRIFT_PX = 220;

// Scene 3 begins after the words have settled and the phone has risen.
const SCENE3_START = 0.55;

export function Statement() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [vw, setVw] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }
    let rafId = 0;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = runwayRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const runway = el.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), runway);
        setProgress(runway > 0 ? scrolled / runway : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  const { wordsBySentence, stride, wordWindow } = useMemo(() => {
    const wordsBySentence = SENTENCES.map((s) => s.split(" "));
    const totalWords = wordsBySentence.reduce((a, ws) => a + ws.length, 0);
    const stride =
      (REVEAL_END - REVEAL_START) / (totalWords - 1 + WINDOW_RATIO);
    return { wordsBySentence, stride, wordWindow: stride * WINDOW_RATIO };
  }, []);

  let globalIdx = 0;

  const isDesktop = vw === 0 || vw >= 1024;
  const isMobile = vw > 0 && vw < 1024;

  // Scene 3 progress: how far we are *into* the third scene (0 → 1).
  const sceneThreeRaw = clamp01((progress - SCENE3_START) / (1 - SCENE3_START));
  const sceneThree = easeInOutCubic(sceneThreeRaw);

  // Phone peeks in scene 2, then continues rising in scene 3 so the chat
  // is fully readable by the time all reasoning cards have arrived.
  const baseRise = isDesktop ? 52 : vw >= 640 ? 62 : 74;
  const sceneThreeRiseBoost = isDesktop ? 30 : 22;
  const maxRise = baseRise + sceneThree * sceneThreeRiseBoost;

  // Scene-1 words fade out as scene 3 takes over.
  const wordsFade = 1 - clamp01((sceneThreeRaw - 0.05) / 0.28);

  // Mobile-only: text drifts upward as scroll progresses so the rising phone
  // takes the visual lead in the lower portion of the section.
  const textShiftPx = isMobile
    ? -clamp01((progress - 0.2) / 0.55) * MOBILE_TEXT_DRIFT_PX
    : 0;

  // Phone stays centered through scene 3 — the rise is its only motion.
  // Cards orbit *around* it; the phone itself is the anchor, not a mover.

  return (
    <div ref={runwayRef} className="relative h-[240vh]">
      <section
        id="statement"
        className="sticky top-2 h-[calc(100svh-1rem)] overflow-hidden rounded-[28px] bg-[#F7F6F5] md:top-3 md:h-[calc(100svh-1.5rem)]"
      >
        <div className="container-page relative flex h-full flex-col justify-center py-16 md:py-20 lg:py-24">
          <div
            className="mx-auto max-w-3xl space-y-5 text-center md:space-y-7 lg:space-y-8"
            style={{
              transform: `translate3d(0, ${textShiftPx}px, 0)`,
              opacity: wordsFade,
              willChange: "transform, opacity",
            }}
          >
            {wordsBySentence.map((words, si) => (
              <p
                key={si}
                className="text-[1.625rem] font-serif font-normal leading-snug text-ink md:text-3xl lg:text-[2.5rem]"
              >
                {words.map((word, wi) => {
                  const idx = globalIdx++;
                  const start = REVEAL_START + idx * stride;
                  const end = start + wordWindow;
                  const t = clamp01((progress - start) / (end - start));
                  const blur = (1 - t) * 3.5;
                  const opacity = 0.12 + t * 0.88;
                  return (
                    <Fragment key={wi}>
                      <span
                        className="inline-block"
                        style={{
                          filter: `blur(${blur}px)`,
                          opacity,
                          willChange: "filter, opacity",
                        }}
                      >
                        {word}
                      </span>
                      {wi < words.length - 1 && " "}
                    </Fragment>
                  );
                })}
              </p>
            ))}
          </div>
        </div>

        <HeroPhoneMockup
          progress={progress}
          maxRisePercent={maxRise}
          chatProgress={sceneThreeRaw}
        />

        <SceneThreeCards sceneThree={sceneThreeRaw} />
      </section>
    </div>
  );
}

// ─── Scene 3: reasoning cards ───────────────────────────────────────────────
// Three cards in an asymmetric triangle around the phone: one above,
// one mid-left overlapping the phone, one mid-right overlapping the phone.
// Each card has its own typographic personality driven by what it shows.

function SceneThreeCards({ sceneThree }: { sceneThree: number }) {
  const r1 = clamp01((sceneThree - 0.24) / 0.16);
  const r2 = clamp01((sceneThree - 0.50) / 0.16);
  const r3 = clamp01((sceneThree - 0.76) / 0.16);

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* Card 1 — crown. Top center, behind phone, bottom edge tucked
          lightly under the phone's notch. Quotes the AI's question and
          names the technique. Anchors the triangle's apex. */}
      <FloatingCard
        positionStyle={{
          top: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 0,
        }}
        widthStyle="min(280px, 22vw)"
        reveal={r1}
        enter="down"
      >
        <p className="font-serif text-[20px] leading-snug text-ink">
          &ldquo;What would make this time worth finishing?&rdquo;
        </p>
        <p className="mt-3 text-[13px] font-semibold text-ink">
          Evocative open question
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
          Asks Marcus for his own reason — not ours.
        </p>
      </FloatingCard>

      {/* Card 2 — left wing. Mid-phone height, behind phone, slight
          right-edge tuck behind phone's left side. Symmetric outward
          offset with Card 3. Anchor moment, Marcus's own words. */}
      <FloatingCard
        positionStyle={{
          top: "36%",
          right: "calc(50% + 130px)",
          zIndex: 0,
        }}
        widthStyle="min(280px, 22vw)"
        reveal={r2}
        enter="left"
      >
        <p className="text-[12.5px] font-semibold text-ink">
          Anchor identified
        </p>
        <p className="mt-3 font-serif text-[22px] leading-[1.2] text-ink">
          &ldquo;On the sideline next fall.&rdquo;
        </p>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-ink-muted">
          <MarcusGlyph />
          <span>Marcus · Tuesday 8:41</span>
        </div>
      </FloatingCard>

      {/* Card 3 — right wing, focal. Lower than Card 2 (pairs with the
          closing chat turn at the bottom of the conversation). IN FRONT
          of phone (zIndex 20), pure white bg makes it the visual punch.
          Pushed outward at 130px to mirror Card 2's offset — sits beside
          the phone, never over the chat. */}
      <FloatingCard
        positionStyle={{
          top: "60%",
          left: "calc(50% + 130px)",
          zIndex: 20,
        }}
        widthStyle="min(280px, 22vw)"
        reveal={r3}
        enter="right"
        bgClassName="bg-white"
      >
        <p className="text-[13px] font-semibold text-ink">Next step</p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
          Week 1: under 10 minutes a day. Small enough to survive a hard
          week.
        </p>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-ink-muted">
          <ChronilogixGlyph />
          <span>Chronilogix · Tuesday 8:42</span>
        </div>
      </FloatingCard>
    </div>
  );
}

type Enter = "left" | "right" | "down";

function entryTransform(reveal: number, enter: Enter) {
  const offset = (1 - reveal) * 22;
  if (enter === "left") return `translateX(${offset}px)`;
  if (enter === "right") return `translateX(${-offset}px)`;
  return `translateY(${-offset}px)`;
}

function FloatingCard({
  positionStyle,
  widthStyle,
  reveal,
  enter,
  children,
  bgClassName = "bg-[#FCFBFA]",
}: {
  positionStyle: React.CSSProperties & { transform?: string };
  widthStyle: string;
  reveal: number;
  enter: Enter;
  children: React.ReactNode;
  bgClassName?: string;
}) {
  const { transform: baseTransform, ...position } = positionStyle;
  const composedTransform = baseTransform
    ? `${baseTransform} ${entryTransform(reveal, enter)}`
    : entryTransform(reveal, enter);
  return (
    <div
      className="absolute"
      style={{
        ...position,
        width: widthStyle,
        opacity: reveal,
        transform: composedTransform,
        willChange: "opacity, transform",
      }}
    >
      <div
        className={`rounded-2xl border border-ink/[0.06] ${bgClassName} p-5`}
        style={{
          boxShadow:
            "0 1px 2px rgba(15,20,25,0.04), 0 22px 48px -14px rgba(15,20,25,0.18)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ChronilogixGlyph() {
  return (
    <span
      aria-hidden
      className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] bg-brand-600"
    >
      <span className="block h-1.5 w-[2px] rounded-full bg-white" />
    </span>
  );
}

function MarcusGlyph() {
  return (
    <span
      aria-hidden
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ink/[0.08] text-[8.5px] font-semibold text-ink"
    >
      M
    </span>
  );
}

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
