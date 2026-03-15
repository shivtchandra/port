import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";

const redHat = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-red-hat-display",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "ST | TACTICAL_REPORT",
  description: "Front-End Craft • AI Engineering • Creative Technologist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redHat.variable} font-sans bg-black text-off-white antialiased overflow-x-hidden selection:bg-accent selection:text-black`}
      >
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('/noise.png')]"></div>
        {children}
      </body>
    </html>
  );
}
