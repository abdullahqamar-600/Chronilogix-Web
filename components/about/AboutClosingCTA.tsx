"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Closing CTA section for the About page. Dark ink slab, warm wash, two
 * CTAs (Get in Touch / See How It Works), and a small contact line for
 * direct outreach to Steven.
 */
export function AboutClosingCTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
  });

  return (
    <section
      id="get-in-touch"
      data-nav-tone="dark"
      ref={ref}
      className="relative overflow-hidden rounded-[28px] bg-ink py-24 md:py-32 lg:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 0%, rgba(255,116,52,0.22) 0%, transparent 60%)",
        }}
      />

      <div className="container-page relative text-center">
        <h2
          className="mx-auto max-w-[20ch] text-display font-serif font-normal text-white"
          style={reveal(0)}
        >
          Let&rsquo;s create a future where{" "}
          <span className="text-brand-accent italic">care listens first.</span>
        </h2>

        <p
          className="mx-auto mt-7 max-w-[52ch] text-[18px] leading-relaxed text-white/70 md:text-[20px]"
          style={reveal(140)}
        >
          Whether you&rsquo;re an employer, a health plan, a benefits broker,
          or someone looking for a better kind of support, we&rsquo;d like to
          talk.
        </p>

        <div
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          style={reveal(260)}
        >
          <a
            href="mailto:steven@chronilogix.com"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink shadow-soft transition-all duration-300 ease-out motion-reduce:transition-none hover:bg-brand-accent hover:text-white hover:shadow-[0_6px_24px_-8px_rgba(255,116,52,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Get in Touch
            <Arrow />
          </a>
          <a
            href="/product"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 ease-out motion-reduce:transition-none hover:border-brand-accent hover:bg-brand-accent hover:shadow-[0_6px_24px_-8px_rgba(255,116,52,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            See How It Works
            <Arrow />
          </a>
        </div>

        <div
          className="mx-auto mt-16 max-w-[56ch]"
          style={reveal(380)}
        >
          <p className="font-serif text-[13.5px] italic text-white/55">
            Or reach Steven directly
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/80 md:text-[16px]">
            <span className="text-white">Steven Amiel</span>, CEO
            <span aria-hidden className="mx-3 text-white/30">
              &middot;
            </span>
            <a
              className="text-white/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-brand-accent hover:decoration-brand-accent"
              href="mailto:steven@chronilogix.com"
            >
              steven@chronilogix.com
            </a>
            <span aria-hidden className="mx-3 text-white/30">
              &middot;
            </span>
            <a
              className="text-white/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-brand-accent hover:decoration-brand-accent"
              href="tel:+16465221447"
            >
              (646) 522 1447
            </a>
          </p>
        </div>

        {/* Bottom legal strip — folded into the CTA so this section acts
            as the page footer (the global Footer has been removed from
            /about). Calm, low-contrast, keeps the dark slab balanced. */}
        <div
          className="relative mt-20 border-t border-white/[0.08] pt-7 md:mt-24"
          style={reveal(500)}
        >
          <div className="flex flex-col items-center justify-between gap-4 text-left md:flex-row md:gap-6">
            <p className="text-[12.5px] text-white/45">
              &copy; {new Date().getFullYear()} Chronilogix, Inc. All rights reserved.
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                { href: "#terms", label: "Terms" },
                { href: "#privacy", label: "Privacy" },
                { href: "#hipaa", label: "HIPAA" },
                { href: "#security", label: "Security" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[12.5px] font-medium text-white/55 transition-colors duration-200 ease-out hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
