"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation preserves cross-document artwork transitions and anchor history. */
import { usePathname } from "next/navigation";
export function ListeningNav() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return <header className="room-nav">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <a className="room-wordmark" href="/" aria-label="Shiva Chandra home">sc<span className="wordmark-dot">.</span></a>
    <span className="nav-caption">Engineer. Maker. Heavy listener.</span>
    <nav aria-label="Main navigation">
      <a href="/#selected-work">Work</a><a href="/#about">About</a><a href="/#contact">Contact</a>
      <a className="nav-resume" href="/resume.pdf">Resume <span aria-hidden>↗</span></a>
    </nav>
  </header>;
}

