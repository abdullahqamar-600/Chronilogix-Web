import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found · Chronilogix",
  description:
    "The page you were looking for could not be found. Head back home or explore the Chronilogix platform.",
};

// A few calm wayfinding links so a lost visitor can recover without
// hunting through the nav. Kept short and in the same order the nav uses.
const HELPFUL_LINKS = [
  { href: "/product", label: "Product" },
  { href: "/solutions", label: "Solutions" },
  { href: "/resources", label: "Resources" },
  { href: "/faq", label: "FAQ" },
];

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="bg-paper-warm/40">
        {/* Centered hero — generous vertical space so the page reads as a
            calm resting spot rather than an error screen. The min-height
            accounts for the fixed nav so the content sits optically
            centered in the viewport. */}
        <section className="container-page flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center py-32 text-center">
          <p className="eyebrow">404 — Page not found</p>

          <h1 className="mt-5 max-w-[18ch] text-display font-serif font-normal text-ink">
            This page wandered off between visits.
          </h1>

          <p className="mx-auto mt-6 max-w-[52ch] body-prose">
            The link may be out of date, or the page may have moved. Let&rsquo;s
            get you back to something useful.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a href="/" className="btn-primary">
              Back to home
            </a>
            <a href="/resources/blog" className="btn-ghost">
              Read the blog
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
                className="transition-transform duration-300 ease-out motion-reduce:transition-none"
              >
                <path
                  d="M3 7h6m0 0L6 4m3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Quiet wayfinding row — a short list of the site's main
              destinations for visitors who know where they meant to go. */}
          <div className="mt-16 border-t border-ink/[0.07] pt-8">
            <p className="eyebrow-muted">Or jump to</p>
            <nav aria-label="Helpful links" className="mt-4">
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {HELPFUL_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-soft transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
