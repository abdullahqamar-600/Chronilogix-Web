"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";

type Persona = {
  key: string;
  label: string;
  headline: [string, string];
  description: string;
  image: string | null;
  imageAlt: string;
};

const PERSONAS: Persona[] = [
  {
    key: "employers",
    label: "Employers & HR",
    headline: ["Reach every employee.", "Not just the few who ask."],
    description:
      "Chronilogix integrates into your benefits stack. Every employee gets a clinically trained coaching experience, available the moment they need it, culturally tailored to who they are.",
    image: "/for-employees.png",
    imageAlt:
      "A group of coworkers laughing together against a bright sky.",
  },
  {
    key: "universities",
    label: "Universities",
    headline: ["Built for the students", "who never raise their hand."],
    description:
      "Available the moment a student needs it. 3am before exams. After a hard call home. Culturally tailored, completely private, built on Dr. Resnicow's MI methodology.",
    image: "/for-universities.png",
    imageAlt: "A student studying alone in a campus library.",
  },
  {
    key: "health-plans",
    label: "Health Plans & Brokers",
    headline: ["Member coaching that scales", "with your network."],
    description:
      "Every member in your plan gets ongoing, evidence-based coaching at a fraction of the cost of live care. A real coaching relationship, available 24 hours a day.",
    image: null,
    imageAlt: "",
  },
  {
    key: "app-partners",
    label: "App Partners",
    headline: ["30 years of clinical research,", "embedded in your product."],
    description:
      "Chronilogix drops in as the clinical coaching intelligence inside your product. Dr. Resnicow's 30-year methodology, with no development overhead on your side.",
    image: null,
    imageAlt: "",
  },
];

export function WhoWeServe() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(
              (entry.target as HTMLElement).dataset.step,
            );
            setActive((prev) => (prev === idx ? prev : idx));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (i: number) => {
    const step = stepRefs.current[i];
    if (!step) return;
    const y = step.getBoundingClientRect().top + window.scrollY + 8;
    window.scrollTo({
      top: y,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={wrapRef}
      id="who-we-serve"
      aria-labelledby="who-we-serve-label"
      data-nav-tone="dark"
      className="relative"
      style={{ height: `calc(100svh * ${PERSONAS.length})` }}
    >
      {/* Scroll-step markers — IO drives `active` from these */}
      {PERSONAS.map((p, i) => (
        <div
          key={`step-${p.key}`}
          ref={(el) => {
            stepRefs.current[i] = el;
          }}
          data-step={i}
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 h-[100svh]"
          style={{ top: `calc(100svh * ${i})` }}
        />
      ))}

      <div className="sticky top-2 h-[calc(100svh-1rem)] overflow-hidden rounded-[28px] text-white md:top-3 md:h-[calc(100svh-1.5rem)]">
        {/* Background image layers — opacity-only crossfade. Blur was the
            jank source: animating filter:blur on a full-bleed image forces
            expensive repaints every frame. Static scale gives a soft anchor;
            transition is opacity-only on a long, gentle curve. */}
        <div className="absolute inset-0" aria-hidden>
          {PERSONAS.map((p, i) => {
            const isActive = i === active;
            return (
              <div
                key={p.key}
                className="absolute inset-0"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: "translate3d(0,0,0) scale(1.04)",
                  transition: reducedMotion
                    ? "none"
                    : "opacity 1100ms cubic-bezier(0.4, 0, 0.2, 1)",
                  willChange: "opacity",
                }}
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full select-none object-cover"
                    draggable={false}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  <PlaceholderBackdrop label={p.label} />
                )}
              </div>
            );
          })}
          {/* Bottom darkening for legibility, sits above all image layers */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/25 to-transparent"
          />
        </div>

        {/* Content — bottom-anchored. The persona list IS the accordion now;
            headline + description live INSIDE each item and expand only when
            that persona is active. */}
        <div className="relative flex h-full flex-col justify-end p-8 sm:p-10 md:p-14 lg:p-16 xl:p-20">
          <h2 id="who-we-serve-label" className="sr-only">
            Who we serve
          </h2>

          <PersonaAccordion
            active={active}
            onSelect={handleNavClick}
            reducedMotion={reducedMotion}
          />

          <a
            href="#book-a-demo"
            className="mt-8 inline-flex w-fit items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-ink shadow-soft transition hover:bg-paper-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 md:mt-10"
          >
            Book a Demo
          </a>
        </div>
      </div>
    </section>
  );
}

function PersonaAccordion({
  active,
  onSelect,
  reducedMotion,
}: {
  active: number;
  onSelect: (i: number) => void;
  reducedMotion: boolean;
}) {
  return (
    <nav aria-label="Who we serve" className="min-w-0 max-w-3xl">
      <ul className="flex flex-col">
        {PERSONAS.map((p, i) => (
          <PersonaItem
            key={p.key}
            persona={p}
            index={i}
            isActive={i === active}
            onSelect={onSelect}
            reducedMotion={reducedMotion}
          />
        ))}
      </ul>
    </nav>
  );
}

function PersonaItem({
  persona,
  index,
  isActive,
  onSelect,
  reducedMotion,
}: {
  persona: Persona;
  index: number;
  isActive: boolean;
  onSelect: (i: number) => void;
  reducedMotion: boolean;
}) {
  const panelId = `persona-panel-${persona.key}`;
  const buttonId = `persona-button-${persona.key}`;

  return (
    <li className="min-w-0">
      <button
        type="button"
        id={buttonId}
        onClick={() => onSelect(index)}
        aria-expanded={isActive}
        aria-controls={panelId}
        className="group flex w-full items-center gap-4 py-4 text-left md:py-5"
      >
        <span
          aria-hidden
          className="block w-[2px] shrink-0 rounded-full transition-all duration-500 ease-out"
          style={{
            height: isActive ? 28 : 0,
            opacity: isActive ? 1 : 0,
            backgroundColor: "rgba(255,255,255,0.95)",
          }}
        />
        <span
          className="text-base font-medium leading-snug transition-colors duration-500 md:text-lg"
          style={{
            color: isActive
              ? "rgba(255,255,255,0.98)"
              : "rgba(255,255,255,0.55)",
          }}
        >
          {persona.label}
        </span>
      </button>

      {/* Collapsible panel — grid-rows trick gives smooth height animation
          without measuring content. Inner div clips overflow during transit. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid"
        style={{
          gridTemplateRows: isActive ? "1fr" : "0fr",
          transition: reducedMotion
            ? "none"
            : "grid-template-rows 700ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pl-6 pr-2 md:pb-8 md:pl-7">
            <WordReveal
              isActive={isActive}
              reducedMotion={reducedMotion}
              personaKey={persona.key}
              headline={persona.headline}
              description={persona.description}
            />
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * Per-word blur reveal — same visual treatment as the Statement section
 * (Section 2). Words resolve in sequence from blur(3.5px)+opacity(0.12) to
 * blur(0)+opacity(1) with a staggered animation-delay. Headline gets a
 * slightly longer per-word stride for drama; description follows tighter so
 * it doesn't drag. Re-keyed by persona so the animation restarts cleanly on
 * every persona change.
 */
function WordReveal({
  isActive,
  reducedMotion,
  personaKey,
  headline,
  description,
}: {
  isActive: boolean;
  reducedMotion: boolean;
  personaKey: string;
  headline: [string, string];
  description: string;
}) {
  const headlineLines = useMemo(
    () => headline.map((line) => line.split(" ")),
    [headline],
  );
  const descriptionWords = useMemo(
    () => description.split(" "),
    [description],
  );

  const HEADLINE_BASE_DELAY = 120;
  const HEADLINE_STRIDE = 55;
  const DESCRIPTION_STRIDE = 18;
  const DESCRIPTION_GAP = 180;

  // Total time the headline words take to finish reveal, so description can
  // start as headline lands rather than competing for attention.
  const headlineWordCount = headlineLines.reduce(
    (acc, line) => acc + line.length,
    0,
  );
  const descriptionStart =
    HEADLINE_BASE_DELAY + headlineWordCount * HEADLINE_STRIDE + DESCRIPTION_GAP;

  let headlineIdx = 0;

  return (
    <div
      // Re-key so the animation restarts every time a different persona
      // becomes active. Without the key flip, React would reuse spans and
      // CSS animations wouldn't re-run.
      key={`${personaKey}-${isActive ? "on" : "off"}`}
    >
      <h3
        className="font-serif font-normal tracking-[-0.015em] text-white"
        style={{
          fontSize: "clamp(1.625rem, 2.2vw + 0.55rem, 3rem)",
          lineHeight: 1.08,
        }}
      >
        {headlineLines.map((words, li) => (
          <Fragment key={li}>
            {words.map((word, wi) => {
              const delay =
                HEADLINE_BASE_DELAY + headlineIdx * HEADLINE_STRIDE;
              headlineIdx += 1;
              return (
                <Fragment key={wi}>
                  <span
                    className="inline-block"
                    style={
                      reducedMotion || !isActive
                        ? { opacity: isActive ? 1 : 0 }
                        : {
                            opacity: 0.12,
                            filter: "blur(3.5px)",
                            animation: `wordReveal 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms forwards`,
                            willChange: "filter, opacity",
                          }
                    }
                  >
                    {word}
                  </span>
                  {wi < words.length - 1 && " "}
                </Fragment>
              );
            })}
            {li < headlineLines.length - 1 && <br />}
          </Fragment>
        ))}
      </h3>

      <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 md:mt-5 md:text-base">
        {descriptionWords.map((word, wi) => {
          const delay = descriptionStart + wi * DESCRIPTION_STRIDE;
          return (
            <Fragment key={wi}>
              <span
                className="inline-block"
                style={
                  reducedMotion || !isActive
                    ? { opacity: isActive ? 1 : 0 }
                    : {
                        opacity: 0.12,
                        filter: "blur(3.5px)",
                        animation: `wordReveal 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms forwards`,
                        willChange: "filter, opacity",
                      }
                }
              >
                {word}
              </span>
              {wi < descriptionWords.length - 1 && " "}
            </Fragment>
          );
        })}
      </p>
    </div>
  );
}

function PlaceholderBackdrop({ label }: { label: string }) {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(135deg,#3A424D_0%,#2A3038_55%,#1A1F25_100%)]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="absolute bottom-6 right-6 text-[10px] font-medium uppercase tracking-[0.24em] text-white/25">
        Imagery — {label}
      </div>
    </div>
  );
}
