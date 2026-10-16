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
        sans: [
          '"Plus Jakarta Sans"',
          'Mukta',
          '"Noto Sans Devanagari"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
        marathi: [
          'Mukta',
          '"Noto Sans Devanagari"',
          'sans-serif',
        ],
      },
      colors: {
        page: "var(--bg-page, #F1F5F9)",
        gov: {
          primary: "var(--gov-primary, #1B2A4A)",
          "primary-light": "var(--gov-primary-light, #2C3E6B)",
          "primary-dark": "var(--gov-primary-dark, #0F1D35)",
          accent: "var(--gov-accent, #D97706)",
          "accent-light": "var(--gov-accent-light, #F59E0B)",
          "accent-dark": "var(--gov-accent-dark, #B45309)",
          blue: "var(--gov-blue, #1E40AF)",
          "blue-light": "var(--gov-blue-light, #3B82F6)",
          "blue-hover": "var(--gov-blue-hover, #1D4ED8)",
        },
        surface: {
          DEFAULT: "var(--bg-surface, #FFFFFF)",
          secondary: "var(--bg-surface-secondary, #F8FAFC)",
          selected: "var(--bg-selected, #E2E8F0)",
          hover: "var(--bg-hover, #F1F5F9)",
        },
        content: {
          primary: "var(--text-primary, #0F172A)",
          secondary: "var(--text-secondary, #475569)",
          muted: "var(--text-muted, #94A3B8)",
          inverse: "var(--text-inverse, #FFFFFF)",
        },
        borderLine: {
          standard: "var(--border-standard, #CBD5E1)",
          subtle: "var(--border-subtle, #E2E8F0)",
          strong: "var(--border-strong, #1B2A4A)",
        },
        action: {
          primary: "var(--action-primary, #1B2A4A)",
          "primary-hover": "var(--action-primary-hover, #0F1D35)",
          secondary: "var(--action-secondary, #475569)",
          accent: "var(--action-accent, #D97706)",
          "accent-hover": "var(--action-accent-hover, #B45309)",
        },
        status: {
          success: "var(--status-success, #15803D)",
          "success-bg": "var(--status-success-bg, #DCFCE7)",
          warning: "var(--status-warning, #D97706)",
          "warning-bg": "var(--status-warning-bg, #FEF3C7)",
          danger: "var(--status-danger, #DC2626)",
          "danger-bg": "var(--status-danger-bg, #FEE2E2)",
          "danger-dark": "var(--status-danger-dark, #991B1B)",
          info: "var(--status-info, #1E40AF)",
          "info-bg": "var(--status-info-bg, #DBEAFE)",
        },
        alert: {
          bg: "var(--alert-bg, #FEF2F2)",
          border: "var(--alert-border, #FCA5A5)",
          text: "var(--alert-text, #991B1B)",
          pulse: "var(--alert-pulse, #DC2626)",
        },
        chart: {
          1: "var(--chart-1, #1B2A4A)",
          2: "var(--chart-2, #D97706)",
          3: "var(--chart-3, #1E40AF)",
          4: "var(--chart-4, #15803D)",
          5: "var(--chart-5, #94A3B8)",
        },
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        '2xs': '0 1px 1px 0 rgba(0, 0, 0, 0.04)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
