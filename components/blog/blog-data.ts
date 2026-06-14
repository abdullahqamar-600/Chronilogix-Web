// Placeholder editorial data for the Resources → Blog index. Replace with
// real CMS-driven entries once Sanity or another source is wired up.

export type BlogArticle = {
  slug: string;
  title: string;
  tag: string;
  topic: string;
  readTime: string;
  date: string; // ISO 8601
  formattedDate: string;
  eyebrow?: string;
  gradient: string;
  textTone: "light" | "dark";
};

export const BLOG_TOPICS = [
  "All topics",
  "Behavioral Health",
  "Chronic Care",
  "Clinical Research",
  "Product",
  "Security & Compliance",
] as const;

export const BLOG_SORTS = ["Latest", "Most read", "Oldest"] as const;

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "inside-rooney-ai-clinical-grade-coaching-at-scale",
    title: "Inside Rooney AI: clinical-grade coaching at scale",
    tag: "Product",
    topic: "Product",
    readTime: "5 min read",
    date: "2026-05-14",
    formattedDate: "May 14, 2026",
    eyebrow: "Rooney AI",
    gradient: "from-[#0F1419] via-[#1F2937] to-[#3F5572]",
    textTone: "light",
  },
  {
    slug: "motivational-interviewing-engineered-for-every-member",
    title: "Motivational Interviewing, engineered for every member",
    tag: "Method",
    topic: "Clinical Research",
    readTime: "4 min read",
    date: "2026-04-29",
    formattedDate: "Apr 29, 2026",
    eyebrow: "Method",
    gradient: "from-[#F9904D] via-[#FF7434] to-[#E55A1F]",
    textTone: "light",
  },
  {
    slug: "30-years-of-mi-research",
    title: "What 30 years of MI research taught us about engagement",
    tag: "Clinical Research",
    topic: "Clinical Research",
    readTime: "6 min read",
    date: "2026-04-15",
    formattedDate: "Apr 15, 2026",
    eyebrow: "Research",
    gradient: "from-[#2A3038] via-[#3F5572] to-[#5B6470]",
    textTone: "light",
  },
  {
    slug: "designing-a-crisis-protocol-members-trust",
    title: "Designing a crisis protocol that members trust",
    tag: "Behavioral Health",
    topic: "Behavioral Health",
    readTime: "5 min read",
    date: "2026-03-28",
    formattedDate: "Mar 28, 2026",
    eyebrow: "Behavioral Health",
    gradient: "from-[#FBF8F4] via-[#F4EFE7] to-[#FFE6D4]",
    textTone: "dark",
  },
  {
    slug: "the-engagement-gap-in-behavioral-health",
    title: "Why behavioral health care misses 50–70% of members",
    tag: "Behavioral Health",
    topic: "Behavioral Health",
    readTime: "7 min read",
    date: "2026-03-12",
    formattedDate: "Mar 12, 2026",
    eyebrow: "Field notes",
    gradient: "from-[#FF7434] via-[#F9904D] to-[#FDB37D]",
    textTone: "light",
  },
  {
    slug: "hipaa-ready-ai-without-compromising-warmth",
    title: "Building HIPAA-ready AI without compromising warmth",
    tag: "Security & Compliance",
    topic: "Security & Compliance",
    readTime: "4 min read",
    date: "2026-02-26",
    formattedDate: "Feb 26, 2026",
    eyebrow: "Trust & Security",
    gradient: "from-[#1F2937] via-[#2A3038] to-[#3F5572]",
    textTone: "light",
  },
  {
    slug: "from-identification-to-engagement",
    title: "From identification to engagement: lessons from health plan partners",
    tag: "Chronic Care",
    topic: "Chronic Care",
    readTime: "6 min read",
    date: "2026-02-10",
    formattedDate: "Feb 10, 2026",
    eyebrow: "Partner Insight",
    gradient: "from-[#FFCDA8] via-[#FFE6D4] to-[#FBF8F4]",
    textTone: "dark",
  },
  {
    slug: "member-coaching-at-247-scale",
    title: "Member coaching at 24/7 scale: what it actually takes",
    tag: "Product",
    topic: "Product",
    readTime: "5 min read",
    date: "2026-01-28",
    formattedDate: "Jan 28, 2026",
    eyebrow: "Engineering",
    gradient: "from-[#3F5572] via-[#5B6470] to-[#8A93A0]",
    textTone: "light",
  },
  {
    slug: "the-data-wall",
    title: "Inside the data wall: how Chronilogix protects member conversations",
    tag: "Security & Compliance",
    topic: "Security & Compliance",
    readTime: "4 min read",
    date: "2026-01-12",
    formattedDate: "Jan 12, 2026",
    eyebrow: "Trust & Security",
    gradient: "from-[#0F1419] via-[#2A3038] to-[#3F5572]",
    textTone: "light",
  },
];

export const FEATURED_SLUG = "inside-rooney-ai-clinical-grade-coaching-at-scale";
export const SIDEBAR_SLUGS = [
  "motivational-interviewing-engineered-for-every-member",
  "30-years-of-mi-research",
  "designing-a-crisis-protocol-members-trust",
];
