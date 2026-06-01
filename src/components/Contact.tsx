"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ArrowUpRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { TrackLabel } from "@/components/ui/TrackLabel";
import { WaveformDivider } from "@/components/ui/Waveform";

const SOCIALS = [
  {
    label: "Email",
    href: "mailto:shivachandra9490@gmail.com",
    display: "shivachandra9490@gmail.com",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/shiva-chandra-takkelapati-10ba3032b/",
    display: "linkedin.com/in/shiva-chandra",
  },
  {
    label: "GitHub",
    href: "https://github.com/shivtchandra",
    display: "github.com/shivtchandra",
  },
  {
    label: "Medium",
    href: "https://medium.com/@shivachandra9490",
    display: "medium.com/@shivachandra9490",
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/user/5mwiefw3jc4vxqft713g2y0jl?si=80e58328902349bb",
    display: "open.spotify.com · Shivachandra",
  },
];

const inputClass =
  "w-full bg-transparent border-0 border-b border-white/20 text-text text-base px-0 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-text-muted/40";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      await addDoc(collection(db, "transmissions"), {
        name,
        email,
        message,
        timestamp: serverTimestamp(),
      });
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionShell id="contact">
      <FadeIn>
        <TrackLabel num="06" name="Encore" />
        <SectionTitle large className="mb-6 leading-[0.88]">
          Let&apos;s work
          <br />
          together.
        </SectionTitle>
        <p className="text-text-muted text-base md:text-lg max-w-md mb-16">
          Available for AI and full-stack engineering roles. Open to freelance projects.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Socials — hairline list */}
        <FadeIn delay={0.1}>
          <p className="text-[11px] text-text-muted uppercase tracking-[0.2em] mb-2">Elsewhere</p>
          <div className="border-t border-white/10">
            {SOCIALS.map(({ label, href, display }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 border-b border-white/10 py-5"
              >
                <span className="min-w-0">
                  <span className="block text-[11px] text-text-muted uppercase tracking-[0.2em] mb-1">
                    {label}
                  </span>
                  <span className="block text-text text-sm md:text-base truncate transition-transform duration-300 group-hover:translate-x-1">
                    {display}
                  </span>
                </span>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 text-text-muted transition-all duration-300 group-hover:text-text group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            ))}
          </div>
        </FadeIn>

        {/* Form — underline fields */}
        <FadeIn delay={0.2}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-[11px] text-text-muted uppercase tracking-[0.2em] mb-1">
                  Name
                </label>
                <input name="name" required className={inputClass} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-[11px] text-text-muted uppercase tracking-[0.2em] mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-text-muted uppercase tracking-[0.2em] mb-1">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Tell me about your project or role..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-3.5 bg-accent text-bg font-semibold text-sm tracking-wide hover:bg-accent/90 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending…
                </>
              ) : (
                "Send Message"
              )}
            </button>

            {status === "success" && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle2 size={16} />
                Message sent. I&apos;ll get back to you soon.
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle size={16} />
                Something went wrong. Try emailing directly.
              </div>
            )}
          </form>
        </FadeIn>
      </div>

      {/* Outro — fade out */}
      <div className="mt-24 md:mt-32">
        <WaveformDivider />
        <p className="mt-6 text-center text-[10px] tracking-[0.3em] uppercase text-text-muted/60">
          End of Side B · Vol. 2026
        </p>
      </div>
    </SectionShell>
  );
}
