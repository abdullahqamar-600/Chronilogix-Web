const NAV_LINKS = [
  { href: "#solution", label: "Solution" },
  { href: "#who-we-serve", label: "Who We Serve" },
  { href: "#why-chronilogix", label: "Why Chronilogix" },
  { href: "#book-a-demo", label: "Book a Demo" },
];

export function Footer() {
  return (
    <footer className="relative">
      <div className="container-page">
        <div className="flex flex-col gap-12 py-16 md:gap-14 md:py-20 lg:py-24">
          {/* Top horizontal row: brand/voice on the left, nav on the right */}
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
            {/* Left column — logo, headline, subtitle */}
            <div className="max-w-2xl">
              <img
                src="/Logo%20Packs/Primary%20Logo/Chronilogix_Logo-FullColor.svg"
                alt="Chronilogix"
                className="h-7 w-auto md:h-8"
              />

              <h2 className="mt-7 font-sans text-3xl font-normal leading-[1.1] tracking-tight text-ink sm:text-4xl md:mt-8 md:text-[44px] md:leading-[1.05] lg:text-5xl">
                Coaching that
                <br />
                <span className="whitespace-nowrap font-serif font-normal text-brand-600">
                  Listens, Asks. Remembers.
                </span>
              </h2>
            </div>

            {/* Right column — sitemap */}
            <nav aria-label="Footer" className="md:pt-2">
              <ul className="flex flex-wrap gap-x-6 gap-y-3 md:flex-col md:items-end md:gap-y-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-ink/80 transition hover:text-brand-600 md:text-base"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Bottom horizontal row: legal strip */}
          <div className="flex flex-col gap-2 text-xs text-ink-muted md:flex-row md:items-center md:justify-between md:gap-6">
            <span>© 2026 Chronilogix · HIPAA Compliant · Made in the USA</span>
            <span>Member data is never used to train our models.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
