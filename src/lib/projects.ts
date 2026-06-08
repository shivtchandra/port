export type ProjectGroup = "freelance" | "personal" | "mobile";

export interface Project {
  title: string;
  category: string;
  description: string;
  impact?: string | null;
  outcome?: string;
  role?: string;
  stack: string[];
  links: { demo?: string };
  github?: string;
  image?: string | null;
  group: ProjectGroup;
  platform?: string;
  screenshots?: string[];
  featured?: boolean;
  year?: string;
}

/** Thumbnail for cards and track rows */
export function projectThumb(project: Project): string | null {
  if (project.image) return project.image;
  if (project.screenshots?.[0]) return project.screenshots[0];
  return null;
}

export function isValidUrl(url?: string): url is string {
  return Boolean(url && url !== "#" && url.startsWith("http"));
}

export const PROJECTS: Project[] = [
  {
    title: "CyberSealTrain",
    category: "Cybersecurity Training Platform",
    description:
      "End-to-end LMS for a cybersecurity coaching brand — courses, trainers, certifications, placements, PDF certificates, and Excel exports.",
    outcome: "Live · cybersecuritytrain.com",
    role: "Full-stack · Client delivery",
    impact: "Live · cybersecuritytrain.com",
    stack: ["React", "Firebase", "React Router", "jsPDF"],
    links: { demo: "https://cybersecuritytrain.com" },
    image: "/projects/cyberseal-train.png",
    group: "freelance",
    featured: true,
    year: "2025",
  },
  {
    title: "CyberSeal",
    category: "Infosec Corporate Website",
    description:
      "Marketing and services site for Cyber Seal Infosec — SOC offerings, resources, and lead capture built for a security consultancy brand.",
    outcome: "Live · client brand site",
    role: "Full-stack · Client delivery",
    impact: "Corporate web presence",
    stack: ["React", "Firebase"],
    links: { demo: "https://cybersecuritytrain.com" },
    image: "/projects/cyberseal.png",
    group: "freelance",
    year: "2025",
  },
  {
    title: "HRMS",
    category: "HR Management System",
    description:
      "Full HRMS for Cyberseal — workforce directory, leave, attendance, payroll hooks, and admin dashboards for super-admin and ops teams.",
    outcome: "Deployed · client HR ops",
    role: "Full-stack · Client delivery",
    stack: ["React", "Firebase"],
    links: {},
    image: "/projects/hrms.png",
    group: "freelance",
    year: "2025",
  },
  {
    title: "Resumit",
    category: "AI / Full Stack",
    description:
      "Owned the full stack: LLM feedback, resume scoring, improvement suggestions, and template recommendations.",
    outcome: "200+ resumes scored",
    role: "Solo · AI product",
    impact: "200+ resumes scored",
    stack: ["React.js", "Python", "OpenAI API", "Vercel"],
    links: { demo: "https://resumit-kappa.vercel.app" },
    image: "/projects/resumit.png",
    group: "personal",
    featured: true,
    year: "2025",
  },
  {
    title: "Trippy",
    category: "Full Stack",
    description:
      "Travel itinerary builder with real-time collaboration, drag-and-drop planning, and group trip management.",
    outcome: "Live demo",
    role: "Solo · Full-stack",
    stack: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    links: { demo: "https://trippy-blond.vercel.app/" },
    image: "/projects/trippy.png",
    group: "personal",
    year: "2025",
  },
  {
    title: "Instant Tab Screenshot",
    category: "Web Extension",
    description:
      "Published Chrome extension — visible, selection, and full-page capture with zero data collection.",
    outcome: "5.0 Chrome rating",
    role: "Solo · Published extension",
    impact: "5.0 Chrome rating",
    stack: ["JavaScript", "Chrome API", "Manifest V3"],
    links: {
      demo: "https://chromewebstore.google.com/detail/nfjacblekofgmkigcfonfdgabjedkdao?utm_source=item-share-cb",
    },
    image: "/projects/screenshot.png",
    group: "personal",
    year: "2026",
  },
  {
    title: "NotifyMe",
    category: "Developer Tool · SaaS",
    description:
      "Drop-in push notifications for any app. Developers connect their own Firebase project once, then broadcast from a dashboard or REST API — multi-tenant, AES-256-GCM encrypted credentials.",
    outcome: "Multi-tenant SaaS",
    role: "Solo · Full-stack",
    stack: ["Fastify", "React", "Firebase", "FCM", "TypeScript"],
    links: {},
    image: "/projects/notifyme.png",
    group: "personal",
    year: "2026",
  },
  {
    title: "Digital Invitation",
    category: "Full Stack",
    description:
      "Event platform with real-time RSVP tracking and personalized guest experiences.",
    outcome: "Live demo",
    role: "Solo · Full-stack",
    stack: ["React", "TypeScript", "Firebase"],
    links: { demo: "https://invite-client-tan.vercel.app/" },
    image: "/projects/invite.png",
    group: "personal",
    year: "2025",
  },
  {
    title: "Golden Hour",
    category: "Film Camera App",
    platform: "Flutter · Android",
    description:
      "Film stocks applied through real color-grading pipelines — 30 cameras, real-time capture, freemium + IAP.",
    outcome: "Shipped · Android",
    role: "Solo · Mobile product",
    impact: "Shipped · Play Store",
    stack: ["Flutter", "Dart", "Firebase"],
    links: { demo: "https://play.google.com/store/apps/details?id=com.goldenhour.filmcamapp&pcampaignid=web_share" },
    screenshots: ["/apps/golden-hour/01.png", "/apps/golden-hour/02.png"],
    group: "mobile",
    featured: true,
    year: "2025",
  },
  {
    title: "Savyit",
    category: "Personal Finance Tracker",
    platform: "Flutter · Android",
    description:
      "On-device parsing of Indian bank & UPI SMS into budgets and insights — privacy-first, optional sign-in.",
    outcome: "Live · Play Store",
    role: "Solo · Mobile product",
    impact: "Live · Play Store",
    stack: ["Flutter", "Dart", "Firebase", "OpenAI"],
    links: {
      demo: "https://play.google.com/store/apps/details?id=com.moneylens.money_lens",
    },
    image: "/apps/savyit/01.png",
    screenshots: ["/apps/savyit/01.png"],
    group: "mobile",
    featured: true,
    year: "2025",
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
