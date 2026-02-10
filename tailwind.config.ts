import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware surface colors (swap via CSS variables)
        surface: {
          DEFAULT: "var(--color-surface)",
          raised: "var(--color-surface-raised)",
          overlay: "var(--color-surface-overlay)",
          border: "var(--color-surface-border)",
          "border-hover": "var(--color-surface-border-hover)",
        },
        // Body-part accent colors (static — work in both themes)
        accent: {
          knee: "#6366f1",
          achilles: "#f59e0b",
          shoulder: "#10b981",
          foot: "#ec4899",
        },
        // Theme-aware text colors
        muted: "var(--color-text-secondary)",
        "muted-strong": "var(--color-text-muted)",
      },
      borderRadius: {
        card: "14px",
        chip: "999px",
        button: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
