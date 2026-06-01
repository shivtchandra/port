"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { TrackLabel } from "@/components/ui/TrackLabel";

const STATIC_EXPERIENCES = [
  {
    id: "1",
    role: "Multicloud Engineer Associate",
    company: "Cognizant",
    period: "Feb 2026 – Present",
    impact: "Structured multicloud training track across AWS, Azure, and GCP.",
    tech: ["AWS", "Azure", "GCP"],
  },
  {
    id: "2",
    role: "Freelance Full-Stack Developer",
    company: "Self-Employed",
    period: "Dec 2025 – Feb 2026",
    impact: "Delivered two production platforms — a cybersecurity LMS with Razorpay and a B2B portal — from spec to live deployment.",
    tech: ["React 18", "Next.js 15", "Firebase", "Razorpay"],
  },
  {
    id: "3",
    role: "AI / Full-Stack Automation Intern",
    company: "Callus",
    period: "Oct – Dec 2025",
    impact: "Automated SEO research workflows; converted n8n pipelines into a FastAPI/React app with RAG document querying.",
    tech: ["FastAPI", "Python", "React", "OpenAI", "Pinecone"],
  },
  {
    id: "4",
    role: "Technical Intern",
    company: "Getto",
    period: "Jul – Oct 2025",
    impact: "Streamlined vendor panel UI and database interactions in a React/PostgreSQL stack.",
    tech: ["React.js", "Node.js", "PostgreSQL", "Docker"],
  },
];

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  impact?: string;
  description?: string;
  tech: string[];
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperience() {
      try {
        const q = query(collection(db, "experience"), orderBy("display_order", "asc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setExperiences(STATIC_EXPERIENCES);
        } else {
          setExperiences(
            querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Experience))
          );
        }
      } catch {
        setExperiences(STATIC_EXPERIENCES);
      } finally {
        setLoading(false);
      }
    }
    fetchExperience();
  }, []);

  const displayed = experiences.slice(0, 4);

  return (
    <SectionShell id="experience">
      <FadeIn className="mb-12 md:mb-16">
        <TrackLabel num="03" name="Tour History" />
        <SectionTitle><ScrambleText text="Where I've Worked" /></SectionTitle>
      </FadeIn>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-text-muted animate-spin" />
        </div>
      ) : (
        <div>
          {displayed.map((exp, idx) => (
            <FadeIn key={exp.id} delay={idx * 0.06}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 border-t border-white/10 py-9 md:py-11">
                {/* Period — left anchor */}
                <div className="md:col-span-4">
                  <p
                    className="font-display font-semibold text-text leading-tight"
                    style={{ fontSize: "clamp(18px, 2vw, 26px)", letterSpacing: "-0.01em" }}
                  >
                    {exp.period}
                  </p>
                </div>

                {/* Body — right */}
                <div className="md:col-span-8">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                    <h3 className="font-display font-semibold text-text text-lg md:text-xl leading-tight">
                      {exp.role}
                    </h3>
                    <span className="text-text-muted text-sm">— {exp.company}</span>
                  </div>

                  <p className="text-text-muted text-sm md:text-base leading-relaxed mb-4 max-w-2xl">
                    {exp.impact || exp.description}
                  </p>

                  <div className="text-[11px] tracking-[0.16em] uppercase text-text-muted/80">
                    {exp.tech.join("  ·  ")}
                  </div>
                </div>
              </div>

              {/* Editorial pull-quote after 2nd entry */}
              {idx === 1 && (
                <blockquote className="border-l-2 border-white/30 pl-6 md:pl-8 py-6 my-2">
                  <p
                    className="font-display text-text leading-snug italic"
                    style={{ fontSize: "clamp(20px, 2.6vw, 34px)", letterSpacing: "-0.01em" }}
                  >
                    “I prefer owning a problem end-to-end over specializing in one layer —
                    the best work happens when the same person writes the API, the UI,
                    and the deployment config.”
                  </p>
                </blockquote>
              )}
            </FadeIn>
          ))}
          <div className="border-t border-white/10" />
        </div>
      )}
    </SectionShell>
  );
}
