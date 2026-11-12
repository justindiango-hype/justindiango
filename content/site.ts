// ─────────────────────────────────────────────────────────────
// All the words on the site live here. Edit this file to update
// your copy, projects and contact details.
// Wrap a word in *asterisks* to colour it acid yellow.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Justin Diango",
  location: "Dubai, UAE",
  email: "justindiango@gmail.com",
  whatsapp: {
    display: "+971 58 688 7826",
    link: "https://wa.me/971586887826",
  },
  portrait: "/images/justin-hd.webp",
  socials: [
    { name: "Facebook", href: "https://www.facebook.com/jdiango" },
    { name: "Instagram", href: "https://www.instagram.com/justindiango" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/justindiango/" },
  ],
};

export const hero = {
  // One item per line.
  // *word* = acid yellow, electrocuted every 2 seconds.
  headline: ["*Fast* doesn't", "have to look", "cheap."],
  sub: "Need a landing page?",
  primaryCta: { label: "See the work", href: "#work" },
  secondaryCta: { label: "Let's talk", href: "#contact" },
};

export const intro = {
  statement: "A business mind with a designer's eye. Cebu-born, *Dubai-based.*",
  stackLabel: "Built with",
  // Names must match lib/logos.ts (names without a logo show as text).
  stack: [
    "Claude Code",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "GSAP",
    "Node.js",
    "JSON",
    "GitHub",
    "VS Code",
    "Vercel",
  ],
};

export type Project = {
  name: string;
  category: string;
  location: string;
  /** Short line under the name. */
  summary: string;
  /** File name (without extension) in public/work/: a .webp cover and a .mp4 recording. */
  media?: string;
  /** Cover image to use when there's no recording yet. */
  cover?: string;
  /** Live site link, optional. */
  url?: string;
  /** e.g. 10 → "Live in 10 days". Optional. */
  liveInDays?: number;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "Beacon UAE",
    category: "Company Setup & Corporate Services",
    location: "Business Bay, Dubai",
    summary: "Business setup, visas, PRO and tax, told as one clear path from idea to licence.",
    media: "beacon-uae-v2",
    featured: true,
  },
  {
    name: "Christian Lawas",
    category: "Photographer Portfolio",
    location: "Dubai, UAE",
    summary: "Weddings, maternity, portraits, real estate and events.",
    media: "christian-lawas-photographer",
  },
  {
    name: "Beacon PRO Services",
    category: "Monthly PRO & Government Admin",
    location: "Dubai, UAE",
    summary: "Faster approvals, zero paperwork hassle.",
    media: "beacon-pro-services",
  },
  {
    name: "Emirates Business Club",
    category: "Private Founders' Network",
    location: "Global",
    summary: "From every continent, one meeting point.",
    media: "emirates-business-club",
  },
  {
    name: "Golden Visa For You",
    category: "UAE Golden Visa Services",
    location: "Dubai, UAE",
    summary: "Dubai property Golden Visa in 72 hours.",
    media: "golden-visa-for-you",
  },
  {
    name: "Drive Zone Auto Main",
    category: "Chassis Repair & Frame Alignment",
    location: "Sharjah, UAE",
    summary: "Clear services, trust signals and booking in a tap.",
    media: "drive-zone-auto-main",
  },
  {
    name: "Manara Properties",
    category: "Real Estate Brokerage",
    location: "Dubai, UAE",
    summary: "A listings-led page built to capture buyer and investor enquiries.",
    cover: "/work/manara-properties.webp",
  },
  {
    name: "Titan Technologies",
    category: "Technology Company",
    location: "Cebu, Philippines",
    summary: "A sharp, credible page built to present its services and win new business.",
    cover: "/work/titan-technologies.webp",
  },
];

export const work = {
  label: "Selected work",
  sub: "Landing pages for businesses around the world: company setup, real estate, automotive, visas, premium memberships and more.",
  title: "The *work.*",
  year: "2026 projects",
};

export const contact = {
  title: "Let's *talk.*",
  sub: "Tell me what you're launching. I usually reply within a day.",
};
