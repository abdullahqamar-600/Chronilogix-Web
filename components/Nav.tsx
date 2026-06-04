"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#solution", label: "Solution" },
  { href: "#who-we-serve", label: "Who We Serve" },
  { href: "#why-chronilogix", label: "Why Chronilogix" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const dark = document.querySelector<HTMLElement>("[data-nav-tone='dark']");
      if (dark) {
        const r = dark.getBoundingClientRect();
        setOverDark(r.top <= 80 && r.bottom > 80);
      } else {
        setOverDark(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const solid = scrolled && !overDark;

  return (
    <header
      className={`fixed left-0 right-0 z-40 w-full transition-all ${
        scrolled ? "top-0" : "top-4 md:top-6"
      } ${
        solid
          ? "bg-paper/85 backdrop-blur-md border-b border-ink/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-page grid h-16 grid-cols-3 items-center md:h-20">
        {/* Left: nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-8 justify-self-start">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm transition ${
                solid
                  ? "text-ink-soft hover:text-ink"
                  : "text-white/85 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        {/* Left slot placeholder on mobile to preserve 3-col balance */}
        <div className="lg:hidden" />

        {/* Center: logo */}
        <a
          href="#"
          className="flex items-center justify-self-center text-ink"
        >
          <img
            src={
              solid
                ? "/Logo%20Packs/Primary%20Logo/Chronilogix_Logo-FullColor.svg"
                : "/Logo%20Packs/Primary%20Logo/Chronilogix_Logo-White.svg"
            }
            alt="Chronilogix"
            className="h-7 w-auto md:h-8"
          />
        </a>

        {/* Right: CTA (desktop) + hamburger (mobile) */}
        <div className="flex items-center justify-self-end gap-3">
          {/* TODO: Calendly URL */}
          <a
            href="#book-a-demo"
            className={`hidden lg:inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              solid
                ? "bg-ink text-white hover:bg-ink-soft focus-visible:ring-ink/30"
                : "bg-white text-ink hover:bg-white/90 focus-visible:ring-white/50 focus-visible:ring-offset-black/40"
            }`}
          >
            Book a Demo
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden flex h-10 w-10 items-center justify-center rounded-full border transition ${
              solid ? "border-ink/10" : "border-white/40"
            }`}
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span
                className={`block h-px w-5 transition-transform ${
                  solid ? "bg-ink" : "bg-white"
                } ${open ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-5 transition-opacity ${
                  solid ? "bg-ink" : "bg-white"
                } ${open ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`block h-px w-5 transition-transform ${
                  solid ? "bg-ink" : "bg-white"
                } ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-ink/5 bg-paper">
          <div className="container-page py-6">
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base text-ink-soft transition hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#book-a-demo"
                className="mt-2 inline-flex items-center justify-center gap-2 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-ink-soft"
              >
                Book a Demo
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

