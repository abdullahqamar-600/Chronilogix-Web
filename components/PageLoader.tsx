"use client";

import { useEffect, useState } from "react";

// Images that live above the fold across the first three sections
// (Hero, Statement, Solution) plus the persistent floating agent pill.
// The loader stays mounted until all of these are decoded, with a soft
// minimum display so cached loads don't flicker.
const CRITICAL_IMAGES = [
  "/hero-bg-enhanced.png",
  "/roni-pattern.webp",
  "/roni.png",
  "/millie-pattern.webp",
  "/millie.png",
  "/agent.png",
  "/Logo Packs/Primary Logo/Chronilogix_Logo-FullColor.svg",
  "/Logo Packs/Primary Logo/Chronilogix_Logo-White.svg",
];

const MIN_DISPLAY_MS = 650;
const HARD_TIMEOUT_MS = 6000;

export function PageLoader() {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      window.setTimeout(() => {
        if (!cancelled) setDone(true);
      }, wait);
    };

    let remaining = CRITICAL_IMAGES.length;
    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) finish();
    };

    CRITICAL_IMAGES.forEach((src) => {
      const img = new Image();
      img.onload = tick;
      img.onerror = tick;
      img.src = src;
      // If the browser already has it cached, onload may have fired
      // synchronously before we wired the handler in some engines.
      if (img.complete) tick();
    });

    const hardTimeout = window.setTimeout(finish, HARD_TIMEOUT_MS);

    document.body.style.overflow = "hidden";

    return () => {
      cancelled = true;
      window.clearTimeout(hardTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    document.body.style.overflow = "";
    const t = window.setTimeout(() => setRemoved(true), 500);
    return () => window.clearTimeout(t);
  }, [done]);

  if (removed) return null;

  return (
    <div
      aria-hidden={done}
      role="status"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper-warm transition-opacity duration-500 ease-out ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Logo%20Packs/Primary%20Logo/Chronilogix_Logo-FullColor.svg"
        alt="Chronilogix"
        className="h-8 w-auto md:h-10 animate-[loaderLogoPulse_1.6s_ease-in-out_infinite]"
        draggable={false}
      />
      <div className="mt-7 flex items-center gap-1.5" aria-hidden>
        <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-[loaderDot_1.1s_ease-in-out_infinite] [animation-delay:-0.32s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-[loaderDot_1.1s_ease-in-out_infinite] [animation-delay:-0.16s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-[loaderDot_1.1s_ease-in-out_infinite]" />
      </div>
      <span className="sr-only">Loading Chronilogix</span>
    </div>
  );
}
