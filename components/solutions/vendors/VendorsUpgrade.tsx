"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsUpgrade — the positioning turn.
 *
 * Directly renders the audio's central claim: "Chronilogix is the
 * outcomes upgrade your products have been missing." Then previews the
 * three properties that make the layer real — always on, sits on top,
 * measurable in the wild.
 *
 * Left column: the claim, framed as an oversized statement.
 * Right column: a schematic showing Chronilogix as a coaching layer
 * that sits on top of the vendor's existing product (device, RPM,
 * portal, app — whatever they ship).
 */

const PROPERTIES: { title: string; body: string }[] = [
  {
    title: "24/7, not episodic",
    body: "Continuous engagement between prescriptions — the window your product doesn't see.",
  },
  {
    title: "On top of what you ship",
    body: "Chronilogix layers over your device, app, or RPM program. Nothing to rip out.",
  },
  {
    title: "Measured in the real world",
    body: "Sustained utilization, adherence, and outcomes buyers can defend at renewal.",
  },
];

export function VendorsUpgrade() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-upgrade-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 90% 10%, rgba(249,144,77,0.14), transparent 70%), radial-gradient(50% 45% at 10% 95%, rgba(228,90,28,0.10), transparent 75%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20 lg:items-center">
          <div>
            <p className="reveal-row eyebrow [transition-delay:60ms]">
              The turn
            </p>
            <h2
              id="vendors-upgrade-label"
              className="reveal-row mt-4 font-serif font-normal text-section leading-[1.05] text-ink [transition-delay:160ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Chronilogix is the{" "}
              <span className="text-brand-700">outcomes upgrade</span> your
              products have been missing.
            </h2>

            <p className="reveal-row mt-6 max-w-[52ch] body-prose [transition-delay:260ms]">
              24/7 AI-powered chronic care and behavioral health coaching
              that sits <em className="not-italic font-medium text-ink">on top</em>
              {" "}of your existing solutions &mdash; driving sustained
              utilization, adherence, and measurable results in the real
              world. You don&rsquo;t replace your product. You upgrade it.
            </p>

            <ul className="reveal-row mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 [transition-delay:400ms]">
              {PROPERTIES.map((p) => (
                <li
                  key={p.title}
                  className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur-sm"
                >
                  <p className="text-[13px] font-medium tracking-tight text-brand-700">
                    {p.title}
                  </p>
                  <p className="mt-2 text-[13.5px] leading-snug text-ink-soft">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Layer schematic — a small isometric-ish stack showing the
              vendor's product plane with Chronilogix sitting above it.
              Reads as a diagram, not a photograph. */}
          <div className="reveal-row [transition-delay:520ms]">
            <LayerStack />
          </div>
        </div>
      </div>
    </section>
  );
}

function LayerStack() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      {/* Ambient wash */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,116,52,0.22), transparent 65%)",
        }}
      />

      <svg
        viewBox="0 0 400 400"
        className="relative h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="platePaper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#F3EDE3" />
          </linearGradient>
          <linearGradient id="plateBrand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FB9C5E" />
            <stop offset="1" stopColor="#E45A1C" />
          </linearGradient>
          <linearGradient id="plateInk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2A3038" />
            <stop offset="1" stopColor="#0F1419" />
          </linearGradient>
        </defs>

        {/* Bottom plate — the vendor's device / RPM / portal. */}
        <g transform="translate(60 240)">
          <path
            d="M0 40 L140 0 L340 60 L200 100 Z"
            fill="url(#platePaper)"
            stroke="#0F1419"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
          <text
            x="170"
            y="66"
            fontFamily="ui-serif, Georgia"
            fontSize="14"
            fill="#0F1419"
            opacity="0.55"
            textAnchor="middle"
            fontStyle="italic"
          >
            Your product
          </text>
        </g>

        {/* Middle plate — the behavioral data layer (thin, ink). */}
        <g transform="translate(60 180)">
          <path
            d="M0 40 L140 0 L340 60 L200 100 Z"
            fill="url(#plateInk)"
            opacity="0.9"
          />
          <text
            x="170"
            y="66"
            fontFamily="ui-sans-serif, system-ui"
            fontSize="11"
            fill="#FFF"
            opacity="0.7"
            textAnchor="middle"
            letterSpacing="0.08em"
          >
            BEHAVIORAL SIGNAL
          </text>
        </g>

        {/* Top plate — Chronilogix (brand, glow). */}
        <g transform="translate(60 90)">
          <path
            d="M0 40 L140 0 L340 60 L200 100 Z"
            fill="url(#plateBrand)"
            filter="drop-shadow(0 10px 24px rgba(228,90,28,0.35))"
          />
          <text
            x="170"
            y="66"
            fontFamily="ui-sans-serif, system-ui"
            fontSize="16"
            fontWeight="600"
            fill="#FFF"
            textAnchor="middle"
          >
            Chronilogix
          </text>
        </g>

        {/* Coaching signals — small dots rising off the brand plate. */}
        {[
          { x: 130, y: 60, r: 3 },
          { x: 200, y: 40, r: 4 },
          { x: 260, y: 70, r: 3 },
          { x: 320, y: 90, r: 3 },
        ].map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill="#FF7434"
            opacity={0.65}
          />
        ))}

        {/* Labels connecting plates */}
        <g opacity="0.5">
          <line x1="380" y1="130" x2="356" y2="130" stroke="#E45A1C" strokeWidth="1" />
          <text x="384" y="134" fontFamily="ui-sans-serif" fontSize="10" fill="#E45A1C">
            Coaching layer
          </text>
          <line x1="380" y1="220" x2="356" y2="220" stroke="#0F1419" strokeOpacity="0.5" strokeWidth="1" />
          <text x="384" y="224" fontFamily="ui-sans-serif" fontSize="10" fill="#0F1419" fillOpacity="0.7">
            Real-world signal
          </text>
          <line x1="380" y1="290" x2="356" y2="290" stroke="#0F1419" strokeOpacity="0.35" strokeWidth="1" />
          <text x="384" y="294" fontFamily="ui-sans-serif" fontSize="10" fill="#0F1419" fillOpacity="0.55">
            Your product plane
          </text>
        </g>
      </svg>
    </div>
  );
}
