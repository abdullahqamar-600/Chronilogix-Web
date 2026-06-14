import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogFeatured } from "@/components/blog/BlogFeatured";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { BlogNewsletter } from "@/components/blog/BlogNewsletter";

export const metadata: Metadata = {
  title: "In Practice · Chronilogix Blog",
  description:
    "Where behavioral science meets clinical-grade AI. Research, product notes, and field reports from the Chronilogix team.",
};

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper-warm/40">
        <BlogHero />
        <BlogFeatured />
        <BlogIndex />
        <BlogNewsletter />
      </main>
      <Footer />
    </>
  );
}
