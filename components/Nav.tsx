"use client";

import { useEffect, useState, type ReactNode } from "react";

type MenuItem = {
  href: string;
  label: string;
  description?: string;
  icon?: ReactNode;
};

type MenuGroup = { heading: string; items: MenuItem[] };

type FeaturedArticle = {
  href: string;
  title: string;
  tag: string;
  readTime: string;
  // Inline gradient stops for the card surface — keeps the component
  // self-contained until real article art is wired up.
  gradient: string;
  eyebrow?: string;
};

type MegaMenu = {
  groups: MenuGroup[];
  featured: { heading: string; articles: FeaturedArticle[] };
};

type NavLink = {
  href: string;
  label: string;
  megaMenu?: MegaMenu;
};

const Icon = ({ children }: { children: ReactNode }) => (
  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 text-ink-soft transition-colors duration-150 ease-out-quart group-hover/menuitem:border-ink/20 group-hover/menuitem:text-ink motion-reduce:transition-none">
    {children}
  </span>
);

const DocIcon = (
  <Icon>
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h7l3 3v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M12 3v3h3" />
      <path d="M7 10h6M7 13h6M7 16h4" />
    </svg>
  </Icon>
);

const PlayIcon = (
  <Icon>
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="14" height="11" rx="1.5" />
      <path d="M9 7.5v4l3.5-2-3.5-2Z" fill="currentColor" stroke="none" />
      <path d="M7 18h6" />
    </svg>
  </Icon>
);

const BookIcon = (
  <Icon>
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h5a2 2 0 0 1 2 2v11a2 2 0 0 0-2-2H4V4Z" />
      <path d="M16 4h-5a2 2 0 0 0-2 2v11a2 2 0 0 1 2-2h5V4Z" />
    </svg>
  </Icon>
);

const CaseStudyIcon = (
  <Icon>
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h12v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7Z" />
      <path d="M8 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
      <path d="M4 11h12" />
    </svg>
  </Icon>
);

const RESOURCES_MENU: MegaMenu = {
  groups: [
    {
      heading: "Explore",
      items: [
        { href: "/resources/blog", label: "Blog", description: "Insights, ideas, news", icon: DocIcon },
        { href: "/resources/webinars", label: "Webinars", description: "Events, demos, discussions", icon: PlayIcon },
        { href: "/resources/whitepapers", label: "White Papers", description: "Research, reports, guides", icon: BookIcon },
        { href: "/resources/case-studies", label: "Case Studies", description: "How partners deploy Chronilogix", icon: CaseStudyIcon },
      ],
    },
  ],
  featured: {
    heading: "Featured Articles",
    articles: [
      {
        href: "/resources/blog/rooney-ai-clinical-coaching",
        title: "Inside Rooney AI: clinical-grade coaching at scale",
        tag: "Insight",
        readTime: "5 min read",
        gradient: "from-[#1F2937] via-[#2C3D55] to-[#3F5572]",
        eyebrow: "Rooney AI",
      },
      {
        href: "/resources/blog/motivational-interviewing-at-scale",
        title: "Motivational Interviewing, engineered for every member",
        tag: "Research",
        readTime: "4 min read",
        gradient: "from-[#F9904D] via-[#FF7434] to-[#E55A1F]",
        eyebrow: "Method",
      },
    ],
  },
};

const NAV_LINKS: NavLink[] = [
  { href: "/product", label: "Product" },
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources", megaMenu: RESOURCES_MENU },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

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

  // Always use dark-ink styles unless we're explicitly over a dark-toned
  // section (e.g. the AetnaCard, FinalCTA). The hero is now a light pastel
  // surface, so the nav reads as solid from the first paint.
  const solid = !overDark;

  return (
    <header
      className={`fixed left-0 right-0 z-40 w-full transition-all duration-400 ease-out-quart motion-reduce:transition-none ${
        scrolled ? "top-0" : "top-4 md:top-6"
      } ${
        solid
          ? scrolled
            ? "border-b border-ink/5 bg-paper/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-page grid h-16 grid-cols-3 items-center md:h-20">
        {/* Left: nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-8 justify-self-start">
          {NAV_LINKS.map((link) => {
            const hasMenu = !!link.megaMenu;
            const isOpen = openMenu === link.label;
            return (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => hasMenu && setOpenMenu(link.label)}
                onMouseLeave={() => hasMenu && setOpenMenu(null)}
              >
                <a
                  href={link.href}
                  aria-haspopup={hasMenu || undefined}
                  aria-expanded={hasMenu ? isOpen : undefined}
                  className={`group/navlink relative inline-flex items-center gap-1 text-sm transition-colors duration-200 ease-out-quart motion-reduce:transition-none ${
                    solid
                      ? "text-ink-soft hover:text-ink"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  {link.label}
                  {hasMenu && (
                    <svg
                      aria-hidden
                      viewBox="0 0 12 12"
                      className={`h-2.5 w-2.5 transition-transform duration-200 ease-out-quart motion-reduce:transition-none ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M2 4.5 6 8.5l4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out-quart group-hover/navlink:scale-x-100 motion-reduce:hidden ${
                      solid ? "bg-ink" : "bg-white"
                    }`}
                  />
                </a>

                {hasMenu && (
                  <div
                    className={`absolute left-0 top-full pt-3 transition-all duration-200 ease-out-quart motion-reduce:transition-none ${
                      isOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0"
                    }`}
                  >
                    <MegaPanel menu={link.megaMenu!} />
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        {/* Left slot placeholder on mobile to preserve 3-col balance */}
        <div className="lg:hidden" />

        {/* Center: logo — clicks back to the home page from any route. */}
        <a
          href="/"
          aria-label="Chronilogix home"
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
            className="hidden btn-primary lg:inline-flex"
          >
            Book a Demo
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200 ease-out-quart motion-reduce:transition-none ${
              solid ? "border-ink/10" : "border-white/40"
            }`}
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span
                className={`block h-px w-5 transition-transform duration-300 ease-out-quart motion-reduce:transition-none ${
                  solid ? "bg-ink" : "bg-white"
                } ${open ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-5 transition-opacity duration-200 ease-out-quart motion-reduce:transition-none ${
                  solid ? "bg-ink" : "bg-white"
                } ${open ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`block h-px w-5 transition-transform duration-300 ease-out-quart motion-reduce:transition-none ${
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
              {NAV_LINKS.map((link) => {
                const hasMenu = !!link.megaMenu;
                const expanded = mobileExpanded === link.label;
                if (!hasMenu) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-base text-ink-soft transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <div key={link.href} className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpanded(expanded ? null : link.label)
                      }
                      aria-expanded={expanded}
                      className="flex items-center justify-between text-left text-base text-ink-soft transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
                    >
                      <span>{link.label}</span>
                      <svg
                        aria-hidden
                        viewBox="0 0 12 12"
                        className={`h-3 w-3 transition-transform duration-200 ease-out-quart motion-reduce:transition-none ${
                          expanded ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M2 4.5 6 8.5l4-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {expanded && (
                      <div className="ml-3 flex flex-col gap-5 border-l border-ink/10 pl-4">
                        {link.megaMenu!.groups.map((group) => (
                          <div key={group.heading} className="flex flex-col gap-2">
                            <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft/70">
                              {group.heading}
                            </div>
                            {group.items.map((item) => (
                              <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="text-sm text-ink-soft transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
                              >
                                {item.label}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <a
                href="#book-a-demo"
                className="btn-primary mt-2 self-start"
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

function MegaPanel({ menu }: { menu: MegaMenu }) {
  return (
    <div className="w-[760px] rounded-3xl border border-ink/5 bg-paper p-8 shadow-2xl shadow-ink/10">
      <div className="grid grid-cols-[1fr_1.4fr] gap-10">
        {menu.groups.map((group) => (
          <div key={group.heading} className="flex flex-col gap-5">
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft/70">
              {group.heading}
            </div>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group/menuitem flex items-start gap-3 rounded-2xl p-2 transition-colors duration-150 ease-out-quart motion-reduce:transition-none hover:bg-ink/[0.04]"
                  >
                    {item.icon}
                    <div className="flex flex-col pt-1">
                      <span className="text-sm font-medium text-ink">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="text-xs text-ink-soft">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col gap-5">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft/70">
            {menu.featured.heading}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {menu.featured.articles.map((article) => (
              <a
                key={article.href}
                href={article.href}
                className="group/article flex flex-col gap-3"
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${article.gradient}`}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 85% 18%, rgba(255,255,255,0.45), transparent 38%)",
                    }}
                  />
                  {article.eyebrow && (
                    <div className="absolute left-4 top-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white/90">
                      {article.eyebrow}
                    </div>
                  )}
                  <div className="absolute inset-x-4 bottom-4 text-sm font-medium leading-snug text-white">
                    {article.title.split(":")[0]}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium leading-snug text-ink line-clamp-2 transition-colors duration-150 ease-out-quart motion-reduce:transition-none group-hover/article:text-ink">
                    {article.title}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-soft">
                    <span>{article.tag}</span>
                    <span className="h-1 w-1 rounded-full bg-ink-soft/40" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
