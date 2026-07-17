import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        nb: {
          main: "#FBF1EC",
          sub: "#F3DCE0",
          accent: "#C58F93",
          text: "#4A3F3F",
          bg: "#FFFAF7",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        soft: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
