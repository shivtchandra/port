import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "#0A0A0A",
                surface: "#111111",
                "surface-raised": "#161616",
                border: "rgba(255,255,255,0.10)",
                text: "#FAFAFA",
                "text-muted": "#7A7A7A",
                accent: "#FAFAFA",
                "accent-glow": "rgba(255,255,255,0.08)",
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
            },
            fontFamily: {
                display: ["var(--font-unbounded)", "sans-serif"],
                sans: ["var(--font-inter)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
