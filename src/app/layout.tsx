import type { Metadata } from "next";
import { Unbounded, Inter } from "next/font/google";
import "./globals.css";
import { ListeningNav } from "@/components/listening/ListeningNav";
import "./listening-room.css";
import SmoothScroll from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/next";
import { ListeningBoot } from "@/components/listening/ListeningBoot";


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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
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
        <div className="studio-noise-overlay" aria-hidden="true" />
        <ListeningBoot />
        <ListeningNav />
        <SmoothScroll>
          <div className="relative z-10">{children}</div>
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
