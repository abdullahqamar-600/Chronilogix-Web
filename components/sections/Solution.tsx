"use client";

import { useEffect, useRef, useState } from "react";
import { SessionWalkthrough } from "@/components/sections/SessionWalkthrough";

type Agent = {
  name: string;
  condition: string;
  body: string;
  // Small floating tags showing the kinds of moments this coach handles.
  // Rendered as low-contrast chips that orbit the avatar.
  topics: string[];
  // Featured Q&A — the single anchor moment on each card. Q is the kind
  // of thing a member actually says; A is the coach's response, written
  // to demonstrate the agent's voice on a high-stakes statement that
  // shows up in real coaching sessions.
  featuredQ: string;
  featuredA: string;
  featuredContext: string;
  pattern: string;
  image: string;
  // Halo tint behind the avatar, picked to harmonize with each pattern.
  haloColor: string;
};

const AGENTS: Agent[] = [
  {
    name: "Roni AI",
    condition: "Diabetes",
    body: "Daily coaching for the habits that move A1C. Built on motivational interviewing.",
    // Topic pills speak in member-voice moments, not clinical metrics —
    // mirrors how Omada / Livongo / Welldoc actually market between-visit
    // coaching, and the MI literature's emphasis on small wins, barriers,
    // and ambivalence over lab values. "After-dinner walks" anchors the
    // high-glucose window where post-meal coaching actually fires; "Habit
    // stacking" echoes the featured exchange's MI lens; "Spikes and dips"
    // is the member-facing read on glucose variability.
    topics: ["Before meals", "Evening walks", "Habit stacking", "Midnight cravings", "Spikes and dips"],
    // The single most cited high-value diabetes coaching moment in the MI
    // literature (ADA Clinical Diabetes, NIDDK): medication ambivalence.
    // It's the moment where a generic chatbot would lecture and an
    // MI-trained coach reflects, opens, and reframes adherence as
    // fitment, not willpower.
    featuredQ: "I keep skipping my evening dose.",
    featuredA:
      "Sounds like the evening dose isn't fitting your life right now. Tell me what gets in the way: the timing, the way it sits with you, or something else? We can move it before we fight it.",
    featuredContext: "Roni AI · Adherence · MI informed",
    pattern: "/roni-pattern.webp",
    image: "/roni.png",
    haloColor: "#F9904D",
  },
  {
    name: "Millie AI",
    condition: "Mental Health",
    body: "Therapeutic coaching for the moments between appointments. 988 escalation built in.",
    // Same moment-language framing as Roni — the kinds of things a
    // member actually opens the app for between therapy sessions. The
    // five together map the full surface: anticipatory anxiety, rumination,
    // negative self-talk, interpersonal stress, and limit-setting. "Inner
    // critic" is the pop-psych member label for self-criticism that shows
    // up across Wysa / Woebot / Headspace coaching surfaces; "Racing
    // thoughts" pairs with the featured exchange.
    topics: ["Anxiety waves", "Racing thoughts", "Inner critic", "Hard conversations", "Boundaries"],
    // Late-night racing thoughts is the single most common reason members
    // open a mental-health app outside of scheduled sessions. The
    // response uses 3-3-3 grounding — a validated MI-friendly variant of
    // 5-4-3-2-1 sensory grounding.
    featuredQ: "I can't get my mind to slow down.",
    featuredA:
      "Racing thoughts aren't yours to solve at midnight. Try this with me. Name three things you can see, three you can hear, three you can feel. Your body lands first, the mind follows.",
    featuredContext: "Millie AI · Grounding (3 3 3) · MI informed",
    pattern: "/millie-pattern.webp",
    image: "/millie.png",
    haloColor: "#B8617C",
  },
];

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

export function Solution() {
  return (
    <section
      id="solution"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40"
    >
      <div className="container-page">
        <p className="eyebrow">The agents</p>
        <h2 className="mt-4 max-w-3xl text-display font-serif font-normal text-ink">
          Two coaches.
          <br />
          <span className="text-ink-muted">One way of listening.</span>
        </h2>

        <div className="mt-10 grid gap-5 md:mt-14 md:gap-6 lg:grid-cols-2">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>

        {/* Section-level CTA — sits below the agent cards so readers
            can weigh both coaches first, then click through to the
            deeper product page. The cards are exploration; this is
            the action that follows once both have been considered. */}
        <div className="mt-10 flex justify-center md:mt-12">
          <a
            href="/product"
            className="group/cta inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3 text-[14.5px] font-medium text-ink transition-all duration-300 ease-out motion-reduce:transition-none hover:border-brand-accent hover:bg-brand-accent hover:text-white hover:shadow-[0_6px_24px_-8px_rgba(255,116,52,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2"
          >
            Learn more about the product
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/cta:translate-x-1"
            >
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="mt-20 md:mt-28">
          <SessionWalkthrough />
        </div>
      </div>
    </section>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <article
      ref={ref}
      data-revealed={inView}
      className="relative overflow-hidden rounded-2xl border border-ink/5"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      {/* Full-bleed pattern, masked from the bottom up so the color rises
          from the bottom edge and dissolves into white near the top. A
          strong blur dissolves the source dither pattern into a smooth
          color wash so the individual pixels never read at card scale. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={agent.pattern}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover"
        draggable={false}
        style={{
          filter: "blur(32px) saturate(0.4) brightness(1.06)",
          WebkitFilter: "blur(32px) saturate(0.4) brightness(1.06)",
          maskImage:
            "linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
          opacity: inView ? 1 : 0,
          transform: inView ? "scale(1.1)" : "scale(1.15)",
          transition:
            "opacity 900ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 1200ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      />
      {/* Soft milky wash over the (already-masked) pattern — keeps the
          bottom-anchored texture quiet enough that the type stays the
          hero. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.75) 55%, #FFFFFF 100%)",
        }}
      />

      <div className="relative flex flex-col gap-7 p-7 md:gap-9 md:p-9 lg:p-10">
        {/* Header — chip + name + one-line dek. */}
        <div
          className="flex flex-col gap-3"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 120ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 120ms",
          }}
        >
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em]"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "rgba(15, 20, 25, 0.10)",
              color: "#B84614",
              boxShadow:
                "0 1px 2px rgba(15, 20, 25, 0.05), 0 4px 12px -4px rgba(15, 20, 25, 0.08)",
            }}
          >
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: agent.haloColor }}
            />
            {agent.condition} Coach
          </span>
          <h3 className="text-hero font-serif font-normal leading-[1.02] text-ink">
            {agent.name}
          </h3>
          <p className="max-w-[36ch] text-[14.5px] leading-[1.55] text-ink-muted md:text-[15px]">
            {agent.body}
          </p>
        </div>

        {/* Centerpiece — avatar with concentric rings + topic chips that
            sit ON the orbit rings (not just floating arbitrarily). */}
        <AgentOrbit agent={agent} active={inView} />

        {/* Featured Q&A — single high-stakes coaching exchange that shows
            the agent's voice on a common, real member statement. */}
        <FeaturedExchange agent={agent} active={inView} />
      </div>
    </article>
  );
}

function AgentOrbit({ agent, active }: { agent: Agent; active: boolean }) {
  // Five topics: three sit ON the orbit rings (visible, spatially anchored),
  // and the rest live in an SR-only overflow line so the API stays full.
  const visibleTopics = agent.topics.slice(0, 3);
  const overflowTopics = agent.topics.slice(3);

  // Each chip is parked at a polar angle (degrees from 12 o'clock,
  // clockwise) on a given ring radius (percent of the orbit container).
  // The asymmetry is intentional — three angles that don't form a tidy
  // triangle so the orbit reads as motion rather than a fixed pattern.
  const chipPolars: Array<{ angle: number; radius: number }> = [
    { angle: 305, radius: 38 }, // upper-left, outer ring
    { angle: 80, radius: 34 }, // middle-right, middle ring
    { angle: 200, radius: 40 }, // lower-left, outer ring
  ];

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[360px] items-center justify-center">
      {/* Three concentric dashed rings, gently more visible as they
          approach the avatar. Provides true orbital depth. */}
      <span
        aria-hidden
        className="pointer-events-none absolute aspect-square w-full rounded-full border border-dashed border-ink/8"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute aspect-square w-[78%] rounded-full border border-dashed border-ink/12"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute aspect-square w-[56%] rounded-full border border-dashed border-ink/16"
      />

      {/* Avatar at center. */}
      <CoachAvatar agent={agent} active={active} />

      {/* Floating topic chips — parked at polar coords so each one sits
          on (or near) one of the orbit rings. */}
      {visibleTopics.map((topic, i) => {
        const { angle, radius } = chipPolars[i];
        const rad = ((angle - 90) * Math.PI) / 180; // 12 o'clock = -90°
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        return (
          <span
            key={topic}
            className="absolute inline-flex -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap rounded-full border px-3 py-1 text-[12px] font-medium text-ink"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              borderColor: "rgba(15, 20, 25, 0.08)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              boxShadow: "0 1px 2px rgba(15, 20, 25, 0.04), 0 6px 18px -6px rgba(15, 20, 25, 0.10)",
              opacity: active ? 1 : 0,
              transform: active
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.92)",
              transition: `opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1) ${400 + i * 120}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${400 + i * 120}ms`,
            }}
          >
            {topic}
          </span>
        );
      })}

      {/* Overflow topics for screen readers. */}
      {overflowTopics.length > 0 && (
        <span className="sr-only">
          Also handles: {overflowTopics.join(", ")}.
        </span>
      )}
    </div>
  );
}

function FeaturedExchange({ agent, active }: { agent: Agent; active: boolean }) {
  return (
    <div
      className="relative flex flex-col gap-3"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(14px)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 360ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 360ms",
      }}
    >
      {/* Member bubble — right-aligned, italic serif quote. Matches the
          conventional "user" position in messenger UIs (right side, tail
          at bottom-right). Uses surface-glass-inner so the bubble reads
          lighter than the coach reply that follows. */}
      <div className="surface-glass-inner relative max-w-[88%] self-end overflow-hidden rounded-[18px] rounded-br-[6px] px-4 py-3 md:px-5">
        <p className="relative font-serif text-[16px] italic leading-[1.34] tracking-[-0.01em] text-ink md:text-[17.5px]">
          {agent.featuredQ}
        </p>
      </div>

      {/* Coach bubble — left-aligned, primary frosted-glass treatment
          with a softened drop shadow so the pair sits as a conversation,
          not as a stacked pair of heavy cards. The top-edge shine keeps
          it in the same family as the session / capability glass cards. */}
      <div
        className="surface-glass relative max-w-[92%] self-start overflow-hidden rounded-[18px] rounded-bl-[6px] px-4 py-3 md:px-5 md:py-4"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -1px 0 rgba(15,20,25,0.03), 0 1px 2px rgba(15,20,25,0.03), 0 6px 18px -10px rgba(15,20,25,0.10)",
        }}
      >
        <span
          aria-hidden
          className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[18px]"
        />
        <p className="relative text-[14.5px] leading-[1.6] text-ink md:text-[15px]">
          {agent.featuredA}
        </p>
      </div>
    </div>
  );
}

function CoachAvatar({ agent, active }: { agent: Agent; active: boolean }) {
  // 8s pulse cycle (matches the original AgentBlob halo).
  const HALO_DURATION = 8;
  // Envelope is bigger now so the avatar reads as the unambiguous focal
  // point of each card. The outer orbit rings live in AgentOrbit; this
  // component is just the photo + halo + agent-tinted hairline.
  return (
    <div
      className="relative z-10 aspect-square shrink-0 w-[150px] md:w-[170px] lg:w-[180px]"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "scale(1)" : "scale(0.9)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 360ms, transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1) 360ms",
      }}
    >
      {/* Tight hairline ring tinted with the agent color — frames the
          photo without competing with the orbit rings outside. */}
      <span
        aria-hidden
        className="absolute inset-[10%] rounded-full border-2"
        style={{ borderColor: `${agent.haloColor}33` }}
      />

      {/* Pulsing halo behind the avatar. Same 8s cycle as the original
          blob — slow expand + fade, long rest. */}
      <span
        aria-hidden
        className="halo-fill absolute inset-[16%] rounded-full"
        style={{
          backgroundColor: agent.haloColor,
          animation: active ? `haloFill ${HALO_DURATION}s ease-out infinite` : "none",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      {/* The photo itself — sits inside the rings, with a soft drop
          shadow tinted toward the agent's color. */}
      <div className="absolute inset-[16%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={agent.image}
          alt={`${agent.name} avatar`}
          draggable={false}
          className="h-full w-full rounded-full object-cover"
          style={{
            boxShadow: `0 2px 4px rgba(15,20,25,0.08), 0 20px 40px -14px ${agent.haloColor}60`,
          }}
        />
        {/* Always-on indicator — small green dot signals the coach is
            available 24/7 (mirrors the hero "24/7" narrative). */}
        <span
          aria-hidden
          className="absolute rounded-full"
          style={{
            right: "4%",
            bottom: "4%",
            width: "16%",
            aspectRatio: "1 / 1",
            background: "#34C759",
            border: "3px solid #FFFFFF",
            boxShadow: "0 1px 2px rgba(15,20,25,0.10)",
          }}
        />
      </div>
    </div>
  );
}
