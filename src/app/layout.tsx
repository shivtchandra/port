import type { Metadata } from "next";
import { Unbounded, Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import NowPlaying from "@/components/NowPlaying";
import { VinylDisc } from "@/components/ui/VinylDisc";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shiva Chandra | AI & Full-Stack Engineer",
  description: "Building AI systems and production-grade full-stack applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${unbounded.variable} ${inter.variable}`}>
      <body
        className="font-sans bg-bg text-text antialiased overflow-x-hidden"
      >
        <CustomCursor />
        <div className="ambient-bg fixed inset-0 -z-10 pointer-events-none" />
        <VinylDisc />
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('/noise.png')]"></div>
        <SmoothScroll>
          <div className="relative z-10">{children}</div>
        </SmoothScroll>
        <NowPlaying />
      </body>
    </html>
  );
}
