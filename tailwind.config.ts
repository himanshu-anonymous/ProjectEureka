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
        page: "var(--bg-page)",
        surface: {
          DEFAULT: "var(--bg-surface)",
          secondary: "var(--bg-surface-secondary)",
          selected: "var(--bg-selected)",
          hover: "var(--bg-hover)",
        },
        content: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
        },
        borderLine: {
          standard: "var(--border-standard)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        action: {
          primary: "var(--action-primary)",
          "primary-hover": "var(--action-primary-hover)",
          secondary: "var(--action-secondary)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
      },
      borderRadius: {
        DEFAULT: "4px",
        md: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
