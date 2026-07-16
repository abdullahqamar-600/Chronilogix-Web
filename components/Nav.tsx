"use client";

import { useEffect, useState, type ReactNode } from "react";

type MenuItem = {
  href: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  // Non-navigating placeholder for personas whose deep-dive pages are on
  // the roadmap but not shipped for the POC. Renders muted with a "Soon"
  // chip and disables the anchor.
  soon?: boolean;
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

// Icon container — small illustration block, taking direct inspiration
// from the MIExplainer process cards and Solution agent cards: a soft
// warm base (cream / peach) with a diffused radial glow, then a milky
// wash reading it as photographic rather than flat. NOT a solid
// saturated orange tile. Three variants distribute across the nine
// icons so the mega-menu reads like a small gallery of illustrations
// rather than a uniform row of chips.
//
// Icon glyphs are filled brand-800 (deep terracotta) — the same warm
// tone we'd use for a chip label — so they read as chapter marks on the
// illustration rather than as UI chrome.

type IconVariant = "peach" | "coral" | "ember";

// Three warm illustration blocks spanning brand-400 → brand-800. Each
// variant keeps the layered radial + linear technique used by the
// MIExplainer visuals — so they still read as small atmospheric
// illustrations rather than flat tiles — but the base palette shifts
// deep enough that white glyphs pop cleanly on all three.
const ICON_BG: Record<IconVariant, string> = {
  // PEACH — lightest of the three. Brand-400 → brand-accent linear, with
  // a deeper terracotta glow rising from the bottom edge (mirrors the
  // Solution AgentCard's "color rises from below" mask).
  peach:
    "radial-gradient(ellipse 70% 85% at 50% 105%, rgba(184,70,20,0.45) 0%, rgba(184,70,20,0) 68%), linear-gradient(180deg, #FB9C5E 0%, #FF7434 100%)",
  // CORAL — mid tone. Brand-accent → brand-700 linear, with a soft
  // peach highlight descending from the top (reads like light resting
  // on the tile).
  coral:
    "radial-gradient(ellipse 65% 70% at 50% -8%, rgba(253,179,125,0.55) 0%, rgba(253,179,125,0) 60%), linear-gradient(180deg, #FF7434 0%, #E45A1C 100%)",
  // EMBER — deepest. Diagonal brand-400 → brand-800 base with two
  // off-axis atmospheric blobs (peach top-left, deep terracotta
  // bottom-right). Mirrors MIExplainer's "blurred pattern + milky
  // wash" but at richer saturation.
  ember:
    "radial-gradient(circle at 28% 32%, rgba(253,179,125,0.5) 0%, rgba(253,179,125,0) 55%), radial-gradient(circle at 74% 74%, rgba(120,40,10,0.42) 0%, rgba(120,40,10,0) 55%), linear-gradient(135deg, #FB9C5E 0%, #B84614 100%)",
};

const Icon = ({
  children,
  variant = "peach",
}: {
  children: ReactNode;
  variant?: IconVariant;
}) => (
  <span
    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_1px_2px_rgba(15,20,25,0.06),0_12px_24px_-14px_rgba(184,70,20,0.42)] transition-all duration-200 ease-out-quart group-hover/menuitem:shadow-[0_2px_6px_rgba(15,20,25,0.08),0_16px_30px_-14px_rgba(184,70,20,0.52)] motion-reduce:transition-none"
    style={{ backgroundImage: ICON_BG[variant] }}
  >
    {children}
  </span>
);

// Every glyph is a solid fill in `currentColor` (brand-800) so it reads
// like a chapter mark on the illustration block behind it. Internal
// detail — the play triangle inside a screen, the door on a building,
// the valley between two book pages — uses `fillRule="evenodd"` so the
// warm background gradient shows through the cutouts.
//
// Variants are assigned per icon so the mega-menu reads as three
// distinct illustration types alternating down the list (peach → paper
// → meadow), never two of the same variant back-to-back within a menu.
//
// ── Resources ─────────────────────────────────────────────────────────
// Blog — page with a folded top-right corner. The fold reads at reduced
// opacity so it separates from the page plane.
const DocIcon = (
  <Icon variant="peach">
    <svg viewBox="0 0 20 20" className="h-6 w-6">
      <path
        fill="currentColor"
        d="M6.5 3h4.75L15 6.75V16.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5V3z"
      />
      <path
        fill="currentColor"
        fillOpacity="0.42"
        d="M11.25 3v3.25a.5.5 0 0 0 .5.5H15L11.25 3z"
      />
    </svg>
  </Icon>
);

// Webinars + White Paper are hidden for the POC (see RESOURCES_MENU below).
// Their glyphs are preserved here, commented out, so the two menu items can
// be restored in one step when those resources ship.
//
// Webinars — filled screen with a triangle play button cut out (the
// warm background shows through) and a small stand at the bottom.
// const PlayIcon = (
//   <Icon variant="ember">
//     <svg viewBox="0 0 20 20" className="h-6 w-6">
//       <path
//         fill="currentColor"
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M4 4.5A1 1 0 0 1 5 3.5h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8zm4.5 1.5v5l4.25-2.5L8.5 6z"
//       />
//       <rect x="7" y="15.75" width="6" height="1" rx="0.5" fill="currentColor" />
//     </svg>
//   </Icon>
// );

// White paper — open book: two filled pages meeting at a valley in the
// middle. Each page tapers inward at the top so the spine reads.
// const BookIcon = (
//   <Icon variant="coral">
//     <svg viewBox="0 0 20 20" className="h-6 w-6">
//       <path
//         fill="currentColor"
//         d="M4 4.5h5A1.5 1.5 0 0 1 10 6v10a1.5 1.5 0 0 0-1.5-1.5H4V4.5z"
//       />
//       <path
//         fill="currentColor"
//         d="M16 4.5h-5A1.5 1.5 0 0 0 10 6v10a1.5 1.5 0 0 1 1.5-1.5h4.5V4.5z"
//       />
//     </svg>
//   </Icon>
// );

// Case studies — folder with a raised tab on the top-left. All one
// filled path — the tab lifts the whole folder just above the shelf
// line.
const CaseStudyIcon = (
  <Icon variant="peach">
    <svg viewBox="0 0 20 20" className="h-6 w-6">
      <path
        fill="currentColor"
        d="M3.5 6.5A1 1 0 0 1 4.5 5.5h3.75l1.5 1.5h5.75a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-9.5z"
      />
    </svg>
  </Icon>
);

// ── Solutions ─────────────────────────────────────────────────────────
// Benefits brokers — filled briefcase silhouette with the handle
// cutout above (evenodd).
const BriefcaseIcon = (
  <Icon variant="ember">
    <svg viewBox="0 0 20 20" className="h-6 w-6">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 3.25A1.75 1.75 0 0 0 6.25 5v0.75H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2.25V5A1.75 1.75 0 0 0 12 3.25H8zm3.75 2.5V5a.75.75 0 0 0-.75-.75h-2a.75.75 0 0 0-.75.75v0.75h3.5z"
      />
    </svg>
  </Icon>
);

// App partners — filled puzzle piece silhouette.
const PuzzleIcon = (
  <Icon variant="coral">
    <svg viewBox="0 0 20 20" className="h-6 w-6">
      <path
        fill="currentColor"
        d="M4 5h4v1.75a1.75 1.75 0 0 0 3.5 0V5h4v4h-1.75a1.75 1.75 0 0 0 0 3.5H15v4H4V5z"
      />
    </svg>
  </Icon>
);

// Employers — building with a door cutout in the middle (single
// evenodd path). A minimal detail that reads as "the way in."
const BuildingIcon = (
  <Icon variant="coral">
    <svg viewBox="0 0 20 20" className="h-6 w-6">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 3.5h11v13.5h-4V13h-3v4h-4V3.5zm2 2.75h1.75V8H6.5V6.25zm3.5 0h1.75V8h-1.75V6.25zm3.25 0h-1.75V8h1.75V6.25zM6.5 9.75h1.75v1.75H6.5V9.75zm3.5 0h1.75v1.75h-1.75V9.75zm3.25 0h-1.75v1.75h1.75V9.75z"
      />
    </svg>
  </Icon>
);

// Health plans & ACOs — filled shield silhouette.
const ShieldIcon = (
  <Icon variant="peach">
    <svg viewBox="0 0 20 20" className="h-6 w-6">
      <path
        fill="currentColor"
        d="M10 3l6 2v5c0 3.5-2.5 6.2-6 7-3.5-.8-6-3.5-6-7V5l6-2z"
      />
    </svg>
  </Icon>
);

// Underserved & uninsured — filled heart silhouette.
const HeartIcon = (
  <Icon variant="ember">
    <svg viewBox="0 0 20 20" className="h-6 w-6">
      <path
        fill="currentColor"
        d="M10 16.5s-6.5-3.6-6.5-8a3.75 3.75 0 0 1 6.5-2.5A3.75 3.75 0 0 1 16.5 8.5c0 4.4-6.5 8-6.5 8z"
      />
    </svg>
  </Icon>
);

const RESOURCES_MENU: MegaMenu = {
  groups: [
    {
      heading: "Explore",
      items: [
        { href: "/resources/blog", label: "Blog", description: "Insights, ideas, news", icon: DocIcon },
        // Hidden for the POC — restore alongside the PlayIcon/BookIcon glyphs above.
        // { href: "/resources/webinars", label: "Webinars", description: "Events, demos, discussions", icon: PlayIcon },
        // { href: "/chronilogix-mi-whitepaper.pdf", label: "White Paper", description: "Motivational Interviewing in AI coaches", icon: BookIcon },
        // A single case study for now — points straight at the Aetna story.
        { href: "/case-studies/aetna", label: "Case Studies", description: "How Aetna transformed member engagement", icon: CaseStudyIcon },
      ],
    },
  ],
  featured: {
    heading: "Featured Articles",
    articles: [
      {
        href: "/resources/blog/rooney-ai-clinical-coaching",
        title: "Inside Rooney AI: clinical grade coaching at scale",
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

const SOLUTIONS_MENU: MegaMenu = {
  groups: [
    {
      heading: "Who we serve",
      items: [
        {
          href: "/solutions/brokers",
          label: "Benefits Brokers",
          description: "A defensible door-opener for your book",
          icon: BriefcaseIcon,
        },
        {
          href: "/solutions/app-partners",
          label: "App Partners",
          description: "Embed clinical coaching in your app",
          icon: PuzzleIcon,
        },
        {
          href: "/solutions/vendors",
          label: "Vendors",
          description: "The outcomes upgrade for chronic care products",
          icon: BuildingIcon,
        },
        {
          href: "#",
          label: "Employers",
          description: "For HR leaders & benefits owners",
          icon: BuildingIcon,
          soon: true,
        },
        {
          href: "#",
          label: "Health Plans & ACOs",
          description: "Claims mitigation, before the claim",
          icon: ShieldIcon,
          soon: true,
        },
        {
          href: "#",
          label: "Underserved & Uninsured",
          description: "Care without the gate",
          icon: HeartIcon,
          soon: true,
        },
      ],
    },
  ],
  featured: {
    heading: "Start with the proof",
    articles: [
      {
        href: "/chronilogix-mi-whitepaper.pdf",
        title: "The ROI whitepaper. The math your CFO will accept.",
        tag: "Download",
        readTime: "12 pages",
        gradient: "from-[#F9904D] via-[#FF7434] to-[#E45A1C]",
        eyebrow: "Proof",
      },
      {
        href: "/product",
        title: "The Chronilogix platform, top to bottom.",
        tag: "Tour",
        readTime: "4 min read",
        gradient: "from-[#1F2937] via-[#2C3D55] to-[#3F5572]",
        eyebrow: "Product",
      },
    ],
  },
};

const NAV_LINKS: NavLink[] = [
  { href: "/product", label: "Product" },
  { href: "/solutions", label: "Solutions", megaMenu: SOLUTIONS_MENU },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
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
      {/* Wider than the site's default container-page (max-w 1240px) so
          the nav breathes on larger monitors, and a taller row height
          gives the links + CTA more vertical whitespace. */}
      <div className="mx-auto grid h-20 w-full max-w-[1440px] grid-cols-3 items-center px-6 md:h-24 md:px-12 lg:px-16 xl:px-20">
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
                {hasMenu ? (
                  <span
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    className={`group/navlink relative inline-flex cursor-default items-center gap-1 bg-transparent p-0 text-sm transition-colors duration-200 ease-out-quart motion-reduce:transition-none ${
                      solid
                        ? "text-ink-soft hover:text-ink"
                        : "text-white/85 hover:text-white"
                    }`}
                  >
                    {link.label}
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
                    <span
                      aria-hidden
                      className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out-quart group-hover/navlink:scale-x-100 motion-reduce:hidden ${
                        solid ? "bg-ink" : "bg-white"
                      }`}
                    />
                  </span>
                ) : (
                  <a
                    href={link.href}
                    className={`group/navlink relative inline-flex items-center gap-1 text-sm transition-colors duration-200 ease-out-quart motion-reduce:transition-none ${
                      solid
                        ? "text-ink-soft hover:text-ink"
                        : "text-white/85 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out-quart group-hover/navlink:scale-x-100 motion-reduce:hidden ${
                        solid ? "bg-ink" : "bg-white"
                      }`}
                    />
                  </a>
                )}

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
                            <div className="text-[12px] font-medium tracking-tight text-ink-soft/70">
                              {group.heading}
                            </div>
                            {group.items.map((item) =>
                              item.soon ? (
                                <span
                                  key={item.label}
                                  aria-disabled="true"
                                  className="flex items-center gap-2 text-sm text-ink-muted opacity-70"
                                >
                                  {item.label}
                                  <span className="rounded-full border border-ink/10 bg-ink/[0.03] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                                    Soon
                                  </span>
                                </span>
                              ) : (
                                <a
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setOpen(false)}
                                  className="text-sm text-ink-soft transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
                                >
                                  {item.label}
                                </a>
                              ),
                            )}
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
    <div className="w-[860px] rounded-3xl border border-ink/5 bg-paper p-10 shadow-2xl shadow-ink/10">
      <div className="grid grid-cols-[1fr_1.4fr] gap-14">
        {menu.groups.map((group) => (
          <div key={group.heading} className="flex flex-col gap-5">
            <div className="text-[12px] font-medium tracking-tight text-ink-soft/70">
              {group.heading}
            </div>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => {
                // PDFs and other absolute URLs open in a new tab so they
                // don't lose the visitor's spot in the nav.
                const isExternal =
                  item.href.endsWith(".pdf") ||
                  item.href.startsWith("http");
                if (item.soon) {
                  // Non-navigating placeholder — muted, with a Soon chip.
                  return (
                    <li key={item.label}>
                      <span
                        aria-disabled="true"
                        className="group/menuitem flex cursor-default items-start gap-3 rounded-2xl p-2 opacity-60"
                      >
                        {item.icon}
                        <div className="flex flex-col pt-1">
                          <span className="flex items-center gap-2 text-sm font-medium text-ink">
                            {item.label}
                            <span className="rounded-full border border-ink/10 bg-ink/[0.03] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                              Soon
                            </span>
                          </span>
                          {item.description && (
                            <span className="text-xs text-ink-soft">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </span>
                    </li>
                  );
                }
                return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
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
                );
              })}
            </ul>
          </div>
        ))}

        <div className="flex flex-col gap-6">
          <div className="text-[12px] font-medium tracking-tight text-ink-soft/70">
            {menu.featured.heading}
          </div>
          {/* Two-column featured articles. gap-6 between cards gives the
              pair room to breathe; gap-4 inside each card separates the
              image tile from its title metadata; mt-3 lifts the tag row
              off the title for readability. All three tweaks work
              together to lift the right column out of "tight grid" and
              into an editorial-feature register. */}
          <div className="grid grid-cols-2 gap-6">
            {menu.featured.articles.map((article) => (
              <a
                key={article.href}
                href={article.href}
                className="group/article flex flex-col gap-4"
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
                    <div className="absolute left-4 top-4 text-[12px] font-medium tracking-tight text-white/90">
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
                  <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
                    <span>{article.tag}</span>
                    <span aria-hidden className="block h-3 w-px bg-ink-soft/30" />
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
