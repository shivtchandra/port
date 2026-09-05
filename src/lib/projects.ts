export type ProjectGroup = "freelance" | "personal" | "mobile";

export interface PlaybackPresentation {
  color: string;
  edition: string;
  tracks: [
    { title: "The problem"; body: string; image: string },
    { title: "What I built"; body: string; image: string },
    { title: "Inside the interface"; body: string; image: string },
  ];
}

export interface Project {
  title: string;
  slug?: string;
  playback?: PlaybackPresentation;
  caseStudy?: { intro: string; ownership: string; decisions: { title: string; body: string }[]; evidence: string };
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
    slug: "cybersealtrain",
    playback: {"color":"#c1cde2","edition":"02 / CONNECTION","tracks":[{"title":"The problem","body":"A training business needs more than a course catalogue. Courses, trainers, certifications, and placements need to work together.","image":"/projects/cyberseal-train.png"},{"title":"What I built","body":"I delivered the React and Firebase platform from requirements through deployment, including PDF certificates and Excel exports.","image":"/projects/cyberseal-train.png"},{"title":"Inside the interface","body":"Select a numbered detail to connect the interface to the thinking behind it.","image":"/projects/cyberseal-train.png"}]},
    caseStudy: {
      intro: "A cybersecurity learning platform that connects courses, trainers, certifications, and placements.",
      ownership: "Full-stack client delivery, from requirements through deployment. Built with React, Firebase, React Router, and jsPDF.",
      decisions: [{ title: "Support the whole learning journey", body: "Course, trainer, certification, and placement features belong to the same platform, connecting the learning experience to its surrounding operations." }, { title: "Make outputs portable", body: "PDF certificates and Excel exports let people take important records outside the application." }],
      evidence: "The public learning platform is live at cybersecuritytrain.com. The portfolio project includes courses, trainers, certificates, placements, and exports.",
    },
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
    title: "CyberSEAL ERP",
    category: "Enterprise Resource Platform",
    description:
      "End-to-end ERP for a cybersecurity MSP — customers, service delivery, tickets, GRC & risk, assets, finance, approvals, and audit logs in one operations console.",
    outcome: "Deployed · client ops platform",
    role: "Full-stack · Client delivery",
    impact: "Unified MSP operations",
    stack: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    links: {},
    image: "/projects/cyberseal-erp.png",
    group: "freelance",
    featured: true,
    year: "2026",
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
    title: "DriveScope",
    category: "Car Decision Engine",
    description:
      "India's intelligent car decision platform — compare vehicles on every axis, simulate 5-year ownership costs, and explore models in interactive 3D. A decision engine, not a classifieds site.",
    outcome: "Live demo",
    role: "Solo · Full-stack",
    impact: "138 vehicles · 509 specs",
    stack: ["Next.js", "React", "Three.js", "Framer Motion", "Firebase"],
    links: { demo: "https://carsim-lovat.vercel.app/" },
    image: "/projects/drivescope.png",
    group: "personal",
    featured: true,
    year: "2026",
  },
  {
    title: "Resumit",
    slug: "resumit",
    playback: {"color":"#dbe5a3","edition":"01 / INTELLIGENCE","tracks":[{"title":"The problem","body":"A resume score is only useful if you know what to change next. Resumit brings assessment, improvement suggestions, and template recommendations into one workflow.","image":"/projects/resumit.png"},{"title":"What I built","body":"I built the React interface, Python processing, and OpenAI integration as a solo product, and deployed it on Vercel.","image":"/projects/resumit.png"},{"title":"Inside the interface","body":"Select a numbered detail to connect the interface to the thinking behind it.","image":"/projects/resumit.png"}]},
    caseStudy: {
      intro: "A resume should be easier to improve than to second-guess. Resumit brings scoring, feedback, and next steps into one product.",
      ownership: "Solo AI product: React interface, Python processing, OpenAI integration, and deployment on Vercel.",
      decisions: [{ title: "Make feedback actionable", body: "The product combines resume scoring with improvement suggestions, so the output includes a next step alongside the assessment." }, { title: "Connect assessment to presentation", body: "Template recommendations complement the feedback, bringing content and presentation into the same workflow." }],
      evidence: "The shipped demo includes resume scoring, LLM feedback, improvement suggestions, and template recommendations. Explore it using the live link.",
    },
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
    slug: "golden-hour",
    playback: {"color":"#e5b181","edition":"03 / FEELING","tracks":[{"title":"The problem","body":"Choosing a film look should be part of taking the photograph. Golden Hour brings film character into real-time mobile capture.","image":"/apps/golden-hour/01.png"},{"title":"What I built","body":"I built and shipped the Flutter, Dart, and Firebase Android app, including 30 cameras, freemium access, and in-app purchases.","image":"/apps/golden-hour/02.png"},{"title":"Inside the interface","body":"Select a numbered detail to connect the interface to the thinking behind it.","image":"/apps/golden-hour/01.png"}]},
    caseStudy: {
      intro: "A pocket film camera for everyday moments, with real-time capture and a collection of film looks.",
      ownership: "Solo mobile product built with Flutter, Dart, and Firebase; shipped on Android with freemium access and in-app purchases.",
      decisions: [{ title: "See the look while shooting", body: "Real-time capture makes the film treatment part of composing a photograph." }, { title: "Take the result with you", body: "This portfolio includes a separate browser preview with sample, upload, camera, and image export. Its CSS filters illustrate the experience; they are not the app’s color-grading pipeline." }],
      evidence: "Available on the Google Play Store. Try the clearly labeled web preview below, or open the Android app listing.",
    },
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
