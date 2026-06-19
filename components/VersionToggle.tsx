"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Floating V1 ↔ V2 toggle. Lives top-center, low z-index relative to the
// Roni pill, but high enough to sit above page content. Purely a build-time
// preview affordance — should be removed before production.
const VERSIONS = [
  { label: "V1", href: "/" },
  { label: "V2", href: "/v2" },
  { label: "V3", href: "/v3" },
  { label: "V4", href: "/v4" },
  { label: "V5", href: "/v5" },
] as const;

export function VersionToggle() {
  const pathname = usePathname() ?? "/";
  const activeHref =
    pathname.startsWith("/v5")
      ? "/v5"
      : pathname.startsWith("/v4")
      ? "/v4"
      : pathname.startsWith("/v3")
      ? "/v3"
      : pathname.startsWith("/v2")
      ? "/v2"
      : "/";

  return (
    <div
      className="pointer-events-auto fixed left-1/2 top-3 z-[110] -translate-x-1/2"
      aria-label="Design version toggle"
    >
      <div className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-white/85 p-1 shadow-[0_6px_24px_-8px_rgba(15,20,25,0.25)] backdrop-blur">
        {VERSIONS.map((v) => {
          const active = v.href === activeHref;
          return (
            <Link
              key={v.href}
              href={v.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3.5 py-1 text-[12px] font-medium tracking-[-0.005em] transition-colors ${
                active ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              {v.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
