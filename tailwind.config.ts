import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FFFDF5",
          100: "#FDF8E8",
          200: "#FBEFC5",
          300: "#F7E198",
          400: "#F0CE62",
          500: "#D4AF37", // Metallic classic gold
          600: "#B8860B", // Dark goldenrod
          700: "#926806",
          800: "#6B4C08",
          900: "#483208",
        },
        noir: {
          800: "#18191D",
          850: "#141518",
          900: "#0F1012",
          950: "#0A0A0C",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Georgia", "serif"],
      },
      boxShadow: {
        lux: "0 10px 30px -10px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        goldGlow: "0 0 25px -5px rgba(212, 175, 55, 0.3)",
      }
    },
  },
  plugins: [],
};
export default config;
