import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp, getDocs, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6sKECMXSjr9sOD0GfoaKBz3EjujWOG5Q",
  authDomain: "portfolio-bd28a.firebaseapp.com",
  projectId: "portfolio-bd28a",
  storageBucket: "portfolio-bd28a.firebasestorage.app",
  messagingSenderId: "100790699482",
  appId: "1:100790699482:web:a4a08117638057c1552ce3",
  measurementId: "G-Y7F5NWKP0P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SEED_DATA = {
  site_settings: {
    about: {
      bio: "Full-Stack & AI Engineer with hands-on experience building production-grade systems including a full LMS/EdTech platform, cybersecurity services portal, AI-powered tools, and published Chrome extensions used by real users. Skilled in LLM integrations, RAG systems, React frontends, Firebase, and multi-role admin systems.",
      location: "Hyderabad, India",
      phone: "+91 9959041832",
      email: "shivachandra9490@gmail.com",
      education: [
        { title: "B.E. in CSE (2021–2025)", school: "GITAM University", detail: "CGPA: 7.64 / 10.0" },
        { title: "Secondary Education (2019 - 2021)", school: "Narayana Junior College", detail: "Percentage: 92.4%" },
        { title: "High School (2018 - 2019)", school: "FIITJEE", detail: "CGPA: 9.3 / 10.0" }
      ],
      mission: "Currently working as a Multicloud Engineer Associate at Cognizant. Ready for deployment in mission-critical AI and Full-Stack roles.",
      specializations: ["Full-Stack Engineering", "AI/ML & RAG Systems", "Cloud Infrastructure (AWS/Azure/GCP)", "Product Automation"]
    }
  },
  projects: [
    { title: 'Resumit', category: 'Full Stack', image: '/projects/resumit.png', description: 'Full-stack AI platform with intelligent resume analysis (feedback, scoring, suggestions) and template engine. 200+ resumes analyzed.', stack: ['React.js', 'Python', 'OpenAI API', 'Vercel'], github_link: '#', demo_link: 'https://resumit-kappa.vercel.app', display_order: 1 },
    { title: 'Trippy', category: 'Full Stack', image: '/projects/trippy.png', description: 'A full-stack travel itinerary builder with real-time collaboration, drag-and-drop activity planning, and group trip management features.', stack: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase'], github_link: '#', demo_link: 'https://trippy-blond.vercel.app/', display_order: 2 },
    { title: 'Digital Invitation', category: 'Full Stack', image: '/projects/invite.png', description: 'A digital invitation and event management platform with real-time RSVP tracking and personalized guest experiences.', stack: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase'], github_link: '#', demo_link: 'https://invite-client-tan.vercel.app/', display_order: 3 },
    { title: 'Medical Impact Predictor', category: 'Full Stack', image: '/projects/medical.png', description: 'ML system predicting hospital stays/costs using 430K+ MIMIC-IV patient records with XGBoost quantile regression.', stack: ['Python', 'XGBoost', 'Scikit-learn', 'Flask', 'React'], github_link: '#', demo_link: '#', display_order: 4 },
    { title: 'Instant Tab Screenshot', category: 'Web Extension', image: '/projects/screenshot.png', description: 'Published multi-mode screenshot capture tool (visible, area, full-page, scroll) with 5.0 rating on Chrome Web Store.', stack: ['JavaScript', 'Chrome Extension API', 'Manifest V3'], github_link: '#', demo_link: 'https://chromewebstore.google.com/detail/nfjacblekofgmkigcfonfdgabjedkdao', display_order: 5 },
    { title: 'Cinema Aspect Controller', category: 'Web Extension', image: '/projects/cinema.png', description: 'Streaming video aspect-ratio controller with IMAX and custom presets. Processing data fully client-side.', stack: ['JavaScript', 'Chrome API', 'Manifest V3'], github_link: '#', demo_link: '#', display_order: 6 }
  ],
  experience: [
    { company: 'Cognizant', role: 'Multicloud Engineer Associate', period: 'Feb 2026 – Present', description: 'Undergoing structured multicloud training covering AWS, Azure, and GCP as part of the Multicloud Engineer track.', tech: ['AWS', 'Azure', 'GCP', 'Cloud Infrastructure'], display_order: 1 },
    { company: 'Self-Employed', role: 'Freelance Full-Stack Developer', period: 'Dec 2025 - Feb 2026', description: 'Delivered two production-grade platforms: CyberSecurityTrain (LMS with Razorpay) and TheCyberSeal (B2B portal). Managed end-to-end development from requirements to live deployment.', tech: ['React 18', 'Next.js 15', 'Firebase', 'Supabase', 'Razorpay', 'jsPDF'], display_order: 2 },
    { company: 'Callus', role: 'AI / Full-Stack Automation Intern', period: 'Oct 2025 - Dec 2025', description: 'Built an AI-powered SEO research and knowledge base platform. Automated workflows using n8n and re-implemented as a FastAPI/React application.', tech: ['FastAPI', 'Python', 'React.js', 'n8n', 'OpenAI API', 'Pinecone'], display_order: 3 },
    { company: 'Getto', role: 'Technical Intern', period: 'July 2025 - Oct 2025', description: 'Enhanced the Getto Vendor Panel UI and workflows. Optimized database interactions and implemented scalable UI modules in an Agile environment.', tech: ['React.js', 'Express.js', 'Node.js', 'PostgreSQL', 'Docker'], display_order: 4 },
    { company: 'Tuzen Tech Solutions', role: 'Machine Learning Intern', period: 'May 2024 - July 2024', description: 'Developed ML-based counterfeit currency detection for visually impaired users. Achieved 95%+ accuracy using TensorFlow.', tech: ['Python', 'TensorFlow', 'Computer Vision', 'Scikit-learn'], display_order: 5 },
    { company: 'Make A Difference (MAD)', role: 'Academic Support Volunteer', period: 'March 2025 - Present', description: 'Providing academic mentoring and personalized support to underprivileged students to bridge foundational learning gaps.', tech: ['Mentorship', 'Education', 'Social Impact'], display_order: 6 }
  ],
  skills: [
    { category_title: 'PROGRAMMING', skills_list: ['Core Java', 'Python', 'JavaScript', 'TypeScript'], display_order: 1 },
    { category_title: 'AI / ML CORE', skills_list: ['Neural Networks', 'Deep Learning', 'NLP', 'LLMs', 'LangChain', 'RAG', 'TensorFlow', 'PyTorch'], display_order: 2 },
    { category_title: 'FRONTEND', skills_list: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind', 'Framer Motion', 'Vite'], display_order: 3 },
    { category_title: 'BACKEND', skills_list: ['Node.js', 'Express.js', 'Prisma ORM', 'FastAPI'], display_order: 4 },
    { category_title: 'CLOUD & DEVOPS', skills_list: ['AWS', 'Azure', 'GCP', 'Docker', 'Git', 'Firebase', 'Supabase', 'Vercel'], display_order: 5 },
    { category_title: 'TOOLS & ANALYTICS', skills_list: ['Tableau', 'Power BI', 'n8n', 'Chrome Extension API', 'PostgreSQL', 'SQL'], display_order: 6 }
  ],
  blogs: [
    { title: 'AI-Powered Resume Ecosystem', date: '2025-01-10', preview: 'Exploring how LLMs and RAG systems can revolutionize the hiring process through intelligent feedback...', link: '#', display_order: 1 },
    { title: 'Building for the Chrome Web Store', date: '2024-11-20', preview: 'Lessons learned from publishing extensions with zero-data collection policies and public user traction...', link: '#', display_order: 2 }
  ],
  leadership: [
    { role: 'External Affairs Manager', event: 'Shore Fest', description: 'Managed external communications and partnerships, coordinating with vendors and promoting event visibility.', display_order: 1 },
    { role: 'Food Department In-Charge', event: 'Gusto Sports Event', description: 'Oversaw food operations for a three-day inter-university sports event, ensuring health standards and quality.', display_order: 2 }
  ],
  certifications: [
    { title: 'Core Java', issuer: 'Coursera', cert_id: 'CJ-CERT-2024', display_order: 1 },
    { title: 'Google Analytics', issuer: 'Google', cert_id: 'GA-CERT-2024', display_order: 2 },
    { title: 'Data Structures and Algorithms', issuer: 'Coursera', cert_id: 'DSA-ADV-2024', display_order: 3 }
  ],
  freelance_missions: [
    { client_name: 'CyberSecurityTrain', mission_title: 'EdTech LMS Platform', description: 'Built a full cybersecurity LMS with course delivery, Razorpay payments, custom exam engine, and certificate verification.', services: ['React 18', 'Next.js 15', 'Firebase', 'Razorpay', 'jsPDF'], result_metric: 'Handled end-to-end production deployment', link: 'https://cybersecuritytrain.com', display_order: 1 },
    { client_name: 'TheCyberSeal', mission_title: 'B2B Services Portal', description: 'Developed a portal with gated resources, lead capture pipeline, and real-time threat alerts dashboard.', services: ['Vite', 'Supabase', 'Tailwind CSS', 'Framer Motion'], result_metric: 'Integrated real-time threat detection UI', link: 'https://thecyberseal.com', display_order: 2 }
  ]
};

async function seed() {
  console.log("Starting Firebase Seeding...");

  // Site Settings
  await setDoc(doc(db, "site_settings", "about"), SEED_DATA.site_settings.about);
  console.log("✓ Created site_settings/about");

  const collections = [
    'projects', 'experience', 'skills', 'blogs', 'leadership', 'certifications', 'freelance_missions'
  ];

  for (const collName of collections) {
    console.log(`Clearing ${collName}...`);
    const qSnapshot = await getDocs(collection(db, collName));
    for (const d of qSnapshot.docs) {
      await deleteDoc(doc(db, collName, d.id));
    }

    console.log(`Seeding ${collName}...`);
    for (const item of SEED_DATA[collName]) {
      await addDoc(collection(db, collName), {
        ...item,
        created_at: serverTimestamp()
      });
    }
    console.log(`✓ Seeded ${collName}`);
  }

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
