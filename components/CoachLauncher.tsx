"use client";

// CoachLauncher — bottom-right floating coach. The agent illustration
// doubles as a button: tap it (or fire the `open-coach-chat` window
// event from any CTA on the page) to expand a quiet chat panel above
// the avatar. The panel speaks in Roni's voice but the surface stays
// coach-agnostic so a section CTA can say "Talk to Coach" without
// promising a specific identity.

import { useEffect, useRef, useState } from "react";

const PROMPTS = [
  "What can you actually do?",
  "How do you keep my data private?",
  "Can I see a real session?",
  "How do I book a demo?",
];

export function CoachLauncher() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-coach-chat", onOpen);
    return () => window.removeEventListener("open-coach-chat", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Talk to Coach"
          className="pointer-events-auto w-[calc(100vw-2.5rem)] max-w-[340px] origin-bottom-right overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_24px_60px_-20px_rgba(15,20,25,0.25),0_4px_12px_-4px_rgba(15,20,25,0.08)]"
          style={{
            animation: "fadeUp 280ms cubic-bezier(0.22,1,0.36,1) forwards",
          }}
        >
          <div className="flex items-start justify-between gap-3 border-b border-ink/5 bg-paper-warm/60 px-5 py-4">
            <div>
              <p className="text-[14px] font-medium text-ink">Talk to Coach</p>
              <p className="mt-0.5 text-[11px] text-ink-muted">
                Ask Chronilogix anything. What it does, how it works, what it costs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted transition hover:bg-ink/5 hover:text-ink"
            >
              ×
            </button>
          </div>

          <div className="px-5 pb-5 pt-5">
            <div className="rounded-xl bg-paper-warm/60 px-4 py-3 text-[13px] leading-relaxed text-ink-soft">
              Hi, I&rsquo;m the coach behind Chronilogix. Pick a question
              below, or type your own.
            </div>

            <ul className="mt-4 space-y-2">
              {PROMPTS.map((p) => (
                <li key={p}>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-ink/10 px-3 py-2 text-left text-[12.5px] text-ink-soft transition hover:border-ink/30 hover:text-ink"
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-2">
              <input
                type="text"
                placeholder="Type your question…"
                className="flex-1 bg-transparent text-[12.5px] text-ink placeholder:text-ink-subtle focus:outline-none"
              />
              <button
                type="button"
                aria-label="Send"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-accent text-white transition hover:opacity-90"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M2 6h8M6.5 2.5 10 6l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close coach chat" : "Open coach chat"}
        aria-expanded={open}
        className="pointer-events-auto block select-none rounded-full transition-transform duration-300 ease-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/agent.png"
          alt="Talk to a Chronilogix coach"
          draggable={false}
          className="h-auto w-[110px] drop-shadow-[0_12px_28px_rgba(15,20,25,0.22)] md:w-[200px]"
        />
      </button>
    </div>
  );
}
