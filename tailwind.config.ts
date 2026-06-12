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
        primary: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#baddfd",
          300: "#7cc1fc",
          400: "#36a2f9",
          500: "#0a84ff",
          600: "#0066d4",
          700: "#0055b3",
          800: "#004a9e",
          900: "#003a7a",
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease-out forwards",
        "slide-up": "slideUp 0.35s ease-out forwards",
        "bounce-dot": "bounceDot 1.4s infinite ease-in-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-12vh)" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
