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
                background: "var(--background)",
                foreground: "var(--foreground)",
                "neon-red": "#E50914",
                "glow-red": "#E50A15",
                "off-white": "#E3E3E3",
                accent: "#E50914",
            },
            fontFamily: {
                sans: ["var(--font-red-hat-display)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
