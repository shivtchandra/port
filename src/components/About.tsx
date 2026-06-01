"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { TrackLabel } from "@/components/ui/TrackLabel";
import { EndOfSideA } from "@/components/ui/SideMarker";

const STATIC_SETTINGS = {
  bio: "Full-Stack & AI engineer currently at Cognizant as a Multicloud Associate. I've shipped production LMS platforms, RAG-based automation tools, a Chrome extension with a 5.0 rating, and AI products used by real people — end to end, from architecture to deployment.",
  location: "Hyderabad, India",
  email: "shivachandra9490@gmail.com",
  education: [
    { title: "B.E. in CSE", school: "GITAM University", detail: "CGPA 7.64 / 10" },
  ],
  specializations: ["Front-End", "AI / LLMs", "Full-Stack", "Cloud"],
  mission: "Looking for AI or full-stack engineering roles where I can own the product end-to-end — from architecture to deployment.",
};

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-text font-medium">{children}</span>
);

export default function About() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [photoErrored, setPhotoErrored] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, "site_settings", "about");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch {
        // use static fallback
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <section id="about" className="relative z-10 flex items-center justify-center py-32 scroll-mt-20">
        <Loader2 className="w-6 h-6 text-text-muted animate-spin" />
      </section>
    );
  }

  const location = settings.location || STATIC_SETTINGS.location;
  const education = settings.education || STATIC_SETTINGS.education;
  const specializations = settings.specializations || STATIC_SETTINGS.specializations;
  const mission = settings.mission || STATIC_SETTINGS.mission;

  const glance: { label: string; value: string }[] = [
    { label: "Location", value: location },
    { label: "Education", value: `${education[0].school} — ${education[0].detail}` },
    { label: "Focus", value: specializations.join(", ") },
    { label: "Email", value: STATIC_SETTINGS.email },
  ];

  return (
    <SectionShell id="about">
      <FadeIn>
        <TrackLabel num="04" name="Liner Notes" />
        <SectionTitle className="mb-12 md:mb-16 max-w-4xl">
          I build things that ship.
        </SectionTitle>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
        {/* Left — narrative */}
        <div className="lg:col-span-3">
          <FadeIn delay={0.1}>
            <p className="text-text-muted leading-relaxed text-base md:text-lg mb-6">
              Full-Stack & AI engineer at{" "}
              <Highlight>Cognizant</Highlight> as a Multicloud Associate. I care about owning
              problems end-to-end — clear APIs, thoughtful UI, and deployments that stay up.
            </p>
            <p className="text-text-muted leading-relaxed text-base md:text-lg mb-8">
              Day to day:{" "}
              <Highlight>React / Next.js</Highlight>,{" "}
              <Highlight>FastAPI / Node.js</Highlight>,{" "}
              <Highlight>OpenAI / LangChain</Highlight>, and{" "}
              <Highlight>AWS, Azure, GCP</Highlight>. {mission}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-text-muted text-sm leading-relaxed border-l border-white/15 pl-4">
              Beyond engineering, I&apos;ve led operations at Shore Fest (university events)
              and volunteer as an academic mentor with Make A Difference, working
              with underprivileged students.
            </p>
          </FadeIn>
        </div>

        {/* Right — photo or hairline at-a-glance list */}
        <div className="lg:col-span-2">
          <FadeIn delay={0.15}>
            {!photoErrored ? (
              <div className="relative overflow-hidden aspect-[4/5] transition-all duration-700">
                <img
                  src="/photos/about.jpg"
                  alt="Shiva Chandra"
                  onError={() => setPhotoErrored(true)}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-bg via-bg/80 to-transparent">
                  <p className="text-text-muted text-[11px] tracking-widest uppercase mb-0.5">Location</p>
                  <p className="text-text text-sm">{location}</p>
                </div>
              </div>
            ) : (
              <div className="border-t border-white/10">
                {glance.map((row) => (
                  <div key={row.label} className="border-b border-white/10 py-5">
                    <p className="text-[11px] text-text-muted uppercase tracking-[0.2em] mb-1.5">
                      {row.label}
                    </p>
                    <p className="text-text text-sm leading-snug">{row.value}</p>
                  </div>
                ))}
                <a
                  href={`mailto:${STATIC_SETTINGS.email}`}
                  className="inline-block mt-6 text-text text-sm font-medium border-b border-white/30 hover:border-white transition-colors"
                >
                  Get in touch →
                </a>
              </div>
            )}
          </FadeIn>
        </div>
      </div>

      <EndOfSideA />
    </SectionShell>
  );
}
