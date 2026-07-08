"use client";

import { useReveal, useReducedMotion } from "@/components/hooks/useReveal";

/**
 * BrokersFrontDoorViz — hero right-column signature.
 *
 * Encodes the one-sheet's core positioning ("front-door claims mitigation
 * strategy") as a small diagram. A muted "reactive" horizon on the right
 * represents the moment a member surfaces in claims; a brand-orange
 * upstream marker on the left represents the moment Chronilogix engages
 * them. A curved arrow connects the two, "drawing in" on reveal.
 *
 * Below the arrow sits a compact "member card" mock — the one-sheet's
 * coaching preview, pared down to the minimum readable slice.
 */
export function BrokersFrontDoorViz() {
  const { ref, inView } = useReveal<HTMLDivElement>({ threshold: 0.3 });
  const reduced = useReducedMotion();
  const active = inView || reduced;

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[440px]">
      {/* Timeline — from "Chronilogix engages" (left) to "traditional
          benefits notice" (right). */}
      <div className="relative">
        <svg
          viewBox="0 0 440 220"
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient
              id="brokers-front-door-arrow"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="#F9904D" />
              <stop offset="60%" stopColor="#FF7434" />
              <stop offset="100%" stopColor="#E45A1C" />
            </linearGradient>
          </defs>

          {/* Reactive horizon — dashed muted line where "claims surface". */}
          <line
            x1="0"
            y1="150"
            x2="440"
            y2="150"
            stroke="#5B6470"
            strokeOpacity="0.3"
            strokeWidth="1"
            strokeDasharray="4 6"
            style={{
              opacity: active ? 1 : 0,
              transition: "opacity 700ms ease-out 150ms",
            }}
          />

          {/* Left node — Chronilogix engages (day one). */}
          <g
            style={{
              opacity: active ? 1 : 0,
              transition: "opacity 500ms ease-out 400ms",
            }}
          >
            <circle cx="70" cy="60" r="18" fill="#FFE6D4" />
            <circle cx="70" cy="60" r="10" fill="#FF7434" />
            <circle
              cx="70"
              cy="60"
              r="10"
              fill="#FF7434"
              opacity="0.35"
              style={{
                transformOrigin: "70px 60px",
                animation: reduced
                  ? undefined
                  : "livePulse 2400ms cubic-bezier(0.22,0.61,0.36,1) infinite",
              }}
            />
            <text
              x="70"
              y="30"
              textAnchor="middle"
              className="fill-brand-700 font-serif"
              style={{ fontSize: 12, fontStyle: "italic" }}
            >
              Day one
            </text>
          </g>

          {/* Right node — the moment claims would otherwise surface. */}
          <g
            style={{
              opacity: active ? 1 : 0,
              transition: "opacity 500ms ease-out 550ms",
            }}
          >
            <circle
              cx="370"
              cy="150"
              r="10"
              fill="#FFFFFF"
              stroke="#5B6470"
              strokeOpacity="0.45"
              strokeWidth="1.4"
            />
            <text
              x="370"
              y="180"
              textAnchor="middle"
              className="fill-ink-muted font-serif"
              style={{ fontSize: 12, fontStyle: "italic" }}
            >
              High-cost claim
            </text>
          </g>

          {/* Curved connector — arcs from the Chronilogix node down to
              the claims horizon. Draws in via stroke-dashoffset. */}
          <path
            d="M 88 60 C 200 60, 240 150, 355 150"
            fill="none"
            stroke="url(#brokers-front-door-arrow)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: 340,
              strokeDashoffset: active ? 0 : 340,
              transition: reduced
                ? undefined
                : "stroke-dashoffset 1500ms cubic-bezier(0.22,0.61,0.36,1) 600ms",
            }}
          />

          {/* Arrowhead near the right node — pops in after the line lands. */}
          <g
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translate(0, 0)" : "translate(-6px, 0)",
              transition: reduced
                ? undefined
                : "opacity 400ms ease-out 1950ms, transform 400ms cubic-bezier(0.22,0.61,0.36,1) 1950ms",
            }}
          >
            <path
              d="M 350 143 L 360 150 L 350 157"
              fill="none"
              stroke="#E45A1C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Intermediate ticks — small week markers below the arc,
              suggesting "weeks and months of engagement" between the
              two events. */}
          {[130, 170, 210, 250, 290].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={150}
              r="1.5"
              fill="#5B6470"
              opacity={0.4}
              style={{
                opacity: active ? 0.4 : 0,
                transition: `opacity 400ms ease-out ${1200 + i * 90}ms`,
              }}
            />
          ))}

          {/* Corner annotation — the weeks-of-lead-time label. */}
          <text
            x="220"
            y="110"
            textAnchor="middle"
            className="fill-ink font-serif"
            style={{
              fontSize: 13,
              fontStyle: "italic",
              opacity: active ? 1 : 0,
              transition: "opacity 600ms ease-out 1700ms",
            }}
          >
            weeks &amp; months of engagement
          </text>
        </svg>
      </div>

      {/* Source line — brief, matches the italic-serif footnote family
          used elsewhere on the page. */}
      <p className="eyebrow-subtle mt-4 max-w-[36ch] text-center mx-auto">
        Chronilogix engages members long before they surface in claims data.
      </p>
    </div>
  );
}
