"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Download, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { TrackLabel } from "@/components/ui/TrackLabel";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const RESUME_URL = "/resume.pdf";

export default function Resume() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <SectionShell id="resume">
      <FadeIn className="mb-10 md:mb-14">
        <TrackLabel num="04" name="Press Kit" />
        <SectionTitle>
          <ScrambleText text="The Full Story" />
        </SectionTitle>
        <p className="mt-4 text-text-muted text-sm md:text-base max-w-xl leading-relaxed">
          Everything in one sheet — experience, projects, and tech, laid flat.
        </p>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <a
            href={RESUME_URL}
            download="Shiva_Chandra_Resume.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg font-semibold text-sm tracking-wide hover:bg-accent/90 transition-colors duration-200"
          >
            <Download size={15} />
            Download PDF
          </a>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-text text-sm font-medium tracking-wide hover:border-white/40 transition-colors duration-200"
          >
            <ExternalLink size={15} />
            Open in new tab
          </a>
        </div>
      </FadeIn>

      <FadeIn delay={0.14}>
        <div className="w-full border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col items-center py-8 px-4">
          <Document
            file={RESUME_URL}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-muted">
                <span className="text-xs tracking-[0.2em] uppercase animate-pulse">Loading…</span>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-text-muted">
                <p className="text-sm">Couldn&apos;t load the PDF.</p>
                <a href={RESUME_URL} download className="text-accent text-sm underline underline-offset-4">
                  Download instead
                </a>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              width={Math.min(typeof window !== "undefined" ? window.innerWidth - 80 : 760, 760)}
              renderTextLayer
              renderAnnotationLayer
            />
          </Document>

          {numPages > 1 && (
            <div className="flex items-center gap-6 mt-6 text-text-muted">
              <button
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
                className="p-1.5 border border-white/15 hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs tracking-[0.2em] uppercase">
                {pageNumber} / {numPages}
              </span>
              <button
                onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                disabled={pageNumber >= numPages}
                className="p-1.5 border border-white/15 hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        <p className="mt-4 text-[11px] tracking-[0.18em] uppercase text-text-muted/50">
          Last updated · June 2026
        </p>
      </FadeIn>
    </SectionShell>
  );
}
