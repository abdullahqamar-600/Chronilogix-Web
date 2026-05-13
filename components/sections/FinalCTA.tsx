const FOOTER_COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "Platform",
    links: ["How It Works", "The Methodology", "Integrations", "Changelog"],
  },
  {
    title: "Solutions",
    links: ["Employers", "Universities", "Health Plans", "App Partners"],
  },
  {
    title: "Company",
    links: ["About", "Dr. Ken Resnicow", "Careers", "Blog", "Responsible AI"],
  },
  {
    title: "Resources",
    links: ["Case Studies", "Trust & Security", "Clinical Approach"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "HIPAA Notice"],
  },
];

export function FinalCTA() {
  return (
    <section
      id="book-a-demo"
      className="relative overflow-hidden rounded-[28px] bg-ink text-white"
    >
      <Glow />

      {/* CTA area */}
      <div className="container-page relative pt-24 md:pt-32 lg:pt-40">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <h2 className="max-w-xl text-2xl font-normal leading-snug text-white md:text-3xl">
              <span className="text-white">Book a 30-minute demo.</span>{" "}
              <span className="text-white/65">
                We’ll show you Chronilogix in a live session, walk through the
                clinical methodology, and model the impact for your specific
                population.
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            {/* TODO: Calendly URL */}
            <a href="#book-a-demo" className="btn-primary">
              Book a Demo
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Footer column grid */}
      <div className="container-page relative mt-20 border-t border-white/10 pt-12 md:mt-28 md:pt-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-white/50">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/80 transition hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom strip */}
      <div className="relative mt-16 border-t border-white/10 md:mt-20">
        <div className="container-page flex flex-col items-start gap-3 py-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Chronilogix · HIPAA Compliant · Made in the USA</p>
          <p className="text-white/40">
            Member data is never used to train our models.
          </p>
        </div>
      </div>
    </section>
  );
}

function Glow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-32 -right-20 h-[420px] w-[420px] rounded-full bg-brand-600/35 blur-3xl" />
      <div className="absolute top-1/3 -left-32 h-[360px] w-[360px] rounded-full bg-brand-700/25 blur-3xl" />
    </div>
  );
}

function ArrowIcon() {
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
