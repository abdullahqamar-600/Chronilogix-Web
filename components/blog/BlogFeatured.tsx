import { BLOG_ARTICLES, FEATURED_SLUG, SIDEBAR_SLUGS } from "./blog-data";
import { BlogCardArt } from "./BlogCardArt";

function ArrowIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 transition-transform duration-200 ease-out-quart motion-reduce:transition-none group-hover/featured:translate-x-0.5 group-hover/featured:-translate-y-0.5"
    >
      <path
        d="M4 12 12 4M6 4h6v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BlogFeatured() {
  const featured = BLOG_ARTICLES.find((a) => a.slug === FEATURED_SLUG);
  const sidebar = SIDEBAR_SLUGS.map((slug) =>
    BLOG_ARTICLES.find((a) => a.slug === slug),
  ).filter((a): a is NonNullable<typeof a> => Boolean(a));

  if (!featured) return null;

  return (
    <section className="pt-12 md:pt-16">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
          {/* Featured — full-bleed editorial card. */}
          <a
            href={`/resources/blog/${featured.slug}`}
            className="group/featured relative flex aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-auto"
          >
            <BlogCardArt article={featured} size="featured" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 bottom-0 flex flex-col gap-3 pb-8 md:inset-x-10 md:pb-10"
            />
            <div className="pointer-events-none absolute inset-x-8 bottom-8 z-10 flex flex-col gap-3 text-white md:inset-x-10 md:bottom-10">
              <div className="text-xs text-white/75">
                {featured.formattedDate}
              </div>
              <div className="inline-flex items-center gap-1.5 text-sm font-medium text-white">
                Read more
                <ArrowIcon />
              </div>
            </div>
          </a>

          {/* Sidebar list — three smaller cards. */}
          <div className="flex flex-col gap-5">
            {sidebar.map((article) => (
              <a
                key={article.slug}
                href={`/resources/blog/${article.slug}`}
                className="group/featured flex gap-4 items-stretch"
              >
                <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-2xl md:w-40">
                  <BlogCardArt article={article} size="thumb" />
                </div>
                <div className="flex min-w-0 flex-col justify-between py-1">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-xs text-ink-muted">
                      {article.formattedDate}
                    </div>
                    <div className="text-sm font-medium leading-snug text-ink md:text-base">
                      {article.title}
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft transition-colors duration-150 ease-out-quart group-hover/featured:text-ink motion-reduce:transition-none">
                    Read more
                    <ArrowIcon />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
