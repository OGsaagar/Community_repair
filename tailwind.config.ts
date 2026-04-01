import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        cream: {
          DEFAULT: "#F6F3EE",
          2: "#EDE8DF",
          3: "#E3DDD2",
        },
        green: {
          DEFAULT: "#1D4B20",
          mid: "#2A6430",
          soft: "#3F8447",
          light: "#E6EFE7",
          border: "#B8D4BA",
        },
        amber: {
          DEFAULT: "#B35A1E",
          mid: "#D06D28",
          light: "#F4E8DC",
          border: "#E0B899",
        },
        blue: {
          DEFAULT: "#1A4568",
          light: "#E2EDF6",
          border: "#A8C5DC",
        },
        ink: {
          DEFAULT: "#1A1916",
          60: "#585650",
          40: "#8F8D87",
          20: "#C9C7C1",
        },
        card: "#FDFCF9",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(26,25,22,.06), 0 1px 2px rgba(26,25,22,.04)",
        md: "0 4px 12px rgba(26,25,22,.08), 0 2px 4px rgba(26,25,22,.04)",
        lg: "0 12px 32px rgba(26,25,22,.10), 0 4px 8px rgba(26,25,22,.04)",
      },
    },
  },
  plugins: [],
};
export default config;
