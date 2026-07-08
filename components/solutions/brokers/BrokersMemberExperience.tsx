"use client";

import { useReveal, useReducedMotion } from "@/components/hooks/useReveal";

/**
 * BrokersMemberExperience — mirrors the "Real Member Experience" panel
 * from the one-sheet. The doc shows two dark phone frames (member <->
 * Rooney chat) and a lighter progress card ("Hi, Christopher").
 *
 * Rebuilt here as a two-column composition: a dark phone-shaped panel
 * on the left carrying the chat opener, and a lighter progress card on
 * the right carrying goals + appointments + overall progress. The
 * paper-warm background lets both surfaces read cleanly.
 */

const CAPABILITY_TAGS = [
  "Onboarding",
  "Daily check-ins",
  "Goal tracking",
  "Progress reporting",
];

export function BrokersMemberExperience() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="brokers-member-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="max-w-[62ch]">
          <p className="reveal-row eyebrow [transition-delay:80ms]">
            Real member experience
          </p>
          <h2
            id="brokers-member-label"
            className="reveal-row mt-4 max-w-[22ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            A coach in every member&rsquo;s pocket.{" "}
            <span className="text-ink-muted italic">
              Powered by Rooney AI.
            </span>
          </h2>
          <p className="reveal-row mt-6 max-w-[58ch] body-prose [transition-delay:280ms]">
            Onboarding, daily check-ins, goal tracking, and progress
            reporting all live inside a single product. The member feels a
            coach. The plan sees the outcomes. The broker gets a story a
            CFO can quote.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-start gap-8 md:mt-20 md:gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Left: dark phone shell showing the coach opener */}
          <div
            className="reveal-row mx-auto w-full max-w-[320px] [transition-delay:340ms]"
          >
            <PhoneShell revealed={inView} reduced={reduced} />
          </div>

          {/* Right: light progress card. Same visual family as the
              one-sheet's "Hi, Christopher" tile. */}
          <div className="reveal-row [transition-delay:520ms]">
            <ProgressCard revealed={inView} reduced={reduced} />

            {/* Capability tags — quiet chip row summarizing what the
                coaching product covers. */}
            <ul className="mt-8 flex flex-wrap gap-2 md:gap-3">
              {CAPABILITY_TAGS.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-soft"
                >
                  <span
                    aria-hidden
                    className="block h-1.5 w-1.5 rounded-full bg-brand-accent"
                  />
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Phone shell ──────────────────────────────────────────────────────── */

function PhoneShell({
  revealed,
  reduced,
}: {
  revealed: boolean;
  reduced: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[36px] border border-white/10 bg-ink text-white shadow-[0_24px_60px_-24px_rgba(15,20,25,0.55)]"
      style={{ aspectRatio: "9 / 17" }}
    >
      {/* Ambient warm glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(255,116,52,0.22), transparent 65%)",
        }}
      />

      {/* Status bar */}
      <div className="relative flex items-center justify-between px-6 pt-5 text-[10px] font-medium tracking-wide text-white/60">
        <span>2:04 AM</span>
        <span className="flex items-center gap-1">
          <span
            aria-hidden
            className="block h-1 w-1 rounded-full bg-brand-accent"
          />
          <span>Rooney</span>
        </span>
      </div>

      {/* Coach header */}
      <div className="relative mt-4 flex flex-col items-center px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/25 ring-1 ring-brand-300/30">
          <span className="font-serif text-lg font-medium text-white">R</span>
        </div>
        <p className="mt-3 text-sm font-medium text-white/90">Rooney</p>
        <p className="mt-1 text-[11px] text-white/50">Chronilogix coach</p>
      </div>

      {/* Chat body */}
      <div className="relative mt-6 flex flex-col gap-3 px-5">
        <ChatBubble
          from="coach"
          delay={reduced ? 0 : 260}
          revealed={revealed}
        >
          Hello! I&rsquo;m Rooney &mdash; ready when you&rsquo;re ready to
          start today&rsquo;s check-in.
        </ChatBubble>
        <ChatBubble
          from="member"
          delay={reduced ? 0 : 640}
          revealed={revealed}
        >
          Yes, we can start. I want to become healthier with your help.
        </ChatBubble>
        <TypingDots delay={reduced ? 0 : 1020} revealed={revealed} />
      </div>
    </div>
  );
}

function ChatBubble({
  from,
  delay,
  revealed,
  children,
}: {
  from: "coach" | "member";
  delay: number;
  revealed: boolean;
  children: React.ReactNode;
}) {
  const isCoach = from === "coach";
  return (
    <div
      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-snug ${
        isCoach
          ? "self-start rounded-bl-md bg-white/8 text-white/85"
          : "self-end rounded-br-md bg-brand-500/20 text-white"
      }`}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(6px)",
        transition: `opacity 500ms cubic-bezier(0.22,0.61,0.36,1) ${delay}ms, transform 500ms cubic-bezier(0.22,0.61,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function TypingDots({
  delay,
  revealed,
}: {
  delay: number;
  revealed: boolean;
}) {
  return (
    <div
      className="flex items-center gap-1.5 pl-1"
      style={{
        opacity: revealed ? 1 : 0,
        transition: `opacity 400ms ease-out ${delay}ms`,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full bg-white/45"
          style={{
            animation: `v5TypingDot 1.2s cubic-bezier(0.4,0,0.6,1) ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Progress card ────────────────────────────────────────────────────── */

function ProgressCard({
  revealed,
  reduced,
}: {
  revealed: boolean;
  reduced: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-ink/10 bg-white p-6 shadow-soft md:p-8">
      {/* Warm corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 45% at 100% 0%, rgba(249,144,77,0.18), transparent 65%)",
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-[13px] italic text-ink-muted">
              Monday, May 27
            </p>
            <p className="mt-1 text-xl font-medium text-ink md:text-2xl">
              Hi, Christopher <span aria-hidden>👋</span>
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <p className="text-[11px] font-medium tracking-wide text-ink-muted">
              Overall progress
            </p>
            <p className="mt-1 font-serif text-3xl leading-none text-brand-700">
              78%
            </p>
          </div>
        </div>

        {/* Pace band */}
        <div className="mt-6 rounded-2xl border border-brand-200/70 bg-brand-50 px-4 py-3">
          <p className="font-serif text-[13px] italic text-brand-700">
            Move at the pace that feels right for you.
          </p>
        </div>

        {/* Appointments */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Appointments</p>
            <span className="text-[11px] font-medium text-ink-muted">
              2 pending
            </span>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {[
              { label: "Diabetes initial", meta: "1 day left" },
              { label: "General check-up", meta: "3 days left" },
            ].map((appt) => (
              <li
                key={appt.label}
                className="flex items-center justify-between rounded-xl border border-ink/8 bg-white px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700"
                  >
                    <span className="font-serif text-[11px]">R</span>
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-ink">Rooney</p>
                    <p className="text-[11px] text-ink-muted">{appt.label}</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-ink-muted">
                  {appt.meta}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Goals */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Goals</p>
            <span className="text-[11px] font-medium text-ink-muted">
              2/4 completed
            </span>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {[
              { label: "30 minute walk", done: false },
              { label: "Evening medication", done: false },
              { label: "Low-carb lunch", done: true },
              { label: "8 glasses of water", done: true },
            ].map((goal, i) => (
              <li
                key={goal.label}
                className="flex items-center justify-between rounded-xl border border-ink/8 bg-white px-3 py-2.5"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(4px)",
                  transition: reduced
                    ? undefined
                    : `opacity 500ms ease-out ${400 + i * 90}ms, transform 500ms cubic-bezier(0.22,0.61,0.36,1) ${400 + i * 90}ms`,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      goal.done
                        ? "bg-brand-accent text-white"
                        : "border border-ink/15 bg-white"
                    }`}
                  >
                    {goal.done && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M2 6.5 4.8 9 10 3.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <p
                    className={`text-[13px] font-medium ${
                      goal.done ? "text-ink-muted line-through" : "text-ink"
                    }`}
                  >
                    {goal.label}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
