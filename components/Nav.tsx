"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#solution", label: "Solution" },
  { href: "#who-we-serve", label: "Who We Serve" },
  { href: "#why-chronilogix", label: "Why Chronilogix" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all ${
        scrolled
          ? "bg-paper/85 backdrop-blur-md border-b border-ink/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <a href="#" className="flex items-center text-ink">
          <img
            src="/cronilogix-logo.svg"
            alt="Chronilogix"
            className="h-7 w-auto md:h-8"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-soft transition hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div
          className={`hidden lg:flex transition-opacity duration-200 ${
            scrolled ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {/* TODO: Calendly URL */}
          <a
            href="#book-a-demo"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2"
          >
            Book a Demo
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-ink/10"
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span
              className={`block h-px w-5 bg-ink transition-transform ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-ink transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-px w-5 bg-ink transition-transform ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
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

