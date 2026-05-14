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
        background: "#FFFAF0",
        cream: "#FFF8ED",
        foreground: "#1A0A00",
        primary: {
          DEFAULT: "#E8810A", // Deep saffron
        },
        secondary: {
          DEFAULT: "#C0392B", // Chili red
        },
        tertiary: {
          DEFAULT: "#2E7D32", // Curry green
        },
        muted: "rgba(26,10,0,0.55)",
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
