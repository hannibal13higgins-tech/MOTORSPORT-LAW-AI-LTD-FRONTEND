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
        surface: "#0b0f14",
        panel: "#111827",
        "accent-red": "#e10600",
        "accent-blue": "#00a3ff",
        border: "#1f2937",
      },
    },
  },
  plugins: [],
};

export default config;
