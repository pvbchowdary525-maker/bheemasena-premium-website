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
        background: "#ffffff",
        foreground: "#1A0A00",
        primary: {
          DEFAULT: "#E8810A", // Deep saffron / turmeric gold
        },
        secondary: {
          DEFAULT: "#C0392B", // Chili red
        },
        tertiary: {
          DEFAULT: "#2E7D32", // Curry green
        },
        muted: "rgba(30,10,0,0.65)", // Muted warm tone for body text
      },
      fontFamily: {
        sans: ["var(--font-poppins)"],
        serif: ["var(--font-playfair)"],
      },
    },
  },
  plugins: [],
};
export default config;
