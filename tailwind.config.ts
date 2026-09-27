import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070A12",
          900: "#0A0E1A",
          800: "#0F1729",
          700: "#161F38",
          600: "#212D4D",
        },
        electric: {
          500: "#2563EB",
          400: "#3B82F6",
          600: "#1D4ED8",
        },
        cyan: {
          400: "#22D3EE",
          500: "#06B6D4",
        },
        paper: "#F8FAFC",
        ink: "#0A0E1A",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,14,26,0.06), 0 8px 24px -8px rgba(10,14,26,0.12)",
        glow: "0 0 0 1px rgba(37,99,235,0.15), 0 8px 32px -8px rgba(37,99,235,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [],
};
export default config;
