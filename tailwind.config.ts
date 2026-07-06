import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        nb: {
          main: "#F7EDE8",
          sub: "#EFD7D7",
          accent: "#C98D8D",
          text: "#444444",
          bg: "#FFFDFB",
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
