import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme base colors (WCAG-compliant on #0b0b0c)
        surface: {
          DEFAULT: "#0b0b0c",
          raised: "#121214",
          overlay: "#1a1a1d",
          border: "#2a2a2d",
          "border-hover": "#3a3a3d",
        },
        // Body-part accent colors
        accent: {
          knee: "#6366f1",
          achilles: "#f59e0b",
          shoulder: "#10b981",
          foot: "#ec4899",
        },
        // WCAG-compliant text colors on #0b0b0c
        muted: "#d4d8de",        // ~6.1:1 ratio on #0b0b0c
        "muted-strong": "#9ca3af", // 3.9:1 - large text only
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
