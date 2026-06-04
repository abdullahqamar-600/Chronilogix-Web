/**
 * Sanity client for the Next.js app.
 *
 * Reads project/dataset from environment variables so the same client works in
 * local dev, preview, and production. Server-side rendering uses the CDN by
 * default; pages that need fresh data can pass `{ cache: 'no-store' }` to fetch.
 */
import { createClient, type ClientConfig } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

if (!projectId || !dataset) {
  // Don't crash at import time during build steps that don't actually touch
  // Sanity — just warn so the dev knows env vars are missing.
  // eslint-disable-next-line no-console
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is missing — Sanity client will fail any real request.",
  );
}

const config: ClientConfig = {
  projectId: projectId ?? "missing-project-id",
  dataset: dataset ?? "production",
  apiVersion,
  useCdn: true,
  perspective: "published",
};

export const sanityClient = createClient(config);

/**
 * Resolve a Sanity file asset reference (e.g. `file-abc123-mp4`) to a public
 * CDN URL. Sanity asset IDs encode the file extension at the end, so we can
 * derive the URL deterministically without an extra round trip.
 */
export function fileUrlFromRef(ref: string | null | undefined): string | null {
  if (!ref) return null;
  // Format: file-{assetId}-{extension}
  const match = ref.match(/^file-([a-f0-9]+)-(\w+)$/);
  if (!match) return null;
  const [, assetId, ext] = match;
  return `https://cdn.sanity.io/files/${config.projectId}/${config.dataset}/${assetId}.${ext}`;
}

/**
 * Fetch the singleton siteSettings document. Returns null if it doesn't exist
 * yet — callers should fall back gracefully so the homepage doesn't crash
 * during initial CMS setup.
 */
export type SiteSettings = {
  heroVideoUrl: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const result = await sanityClient.fetch<{
      heroVideo?: { asset?: { _ref?: string } };
    } | null>(
      // groq: pull the siteSettings singleton + its heroVideo asset reference.
      `*[_type == "siteSettings"][0]{ heroVideo }`,
    );
    return {
      heroVideoUrl: fileUrlFromRef(result?.heroVideo?.asset?._ref),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[sanity] getSiteSettings failed:", err);
    return { heroVideoUrl: null };
  }
}
