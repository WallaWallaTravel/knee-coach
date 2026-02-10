"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { safeGet, safeSet } from "@/lib/storage/safe-storage";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "dark",
  setTheme: () => {},
});

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.setAttribute("data-theme", resolved);
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", resolved === "dark" ? "#0b0b0c" : "#ffffff");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  // Read saved theme on mount
  useEffect(() => {
    const savedApp = safeGet<{ theme?: Theme } | null>("bodyCoach.settings.app", null);
    const saved = savedApp?.theme ?? "system";
    setThemeState(saved);

    const resolved = saved === "system" ? getSystemTheme() : saved;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  // Listen for OS preference changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);

    const resolved = newTheme === "system" ? getSystemTheme() : newTheme;
    setResolvedTheme(resolved);
    applyTheme(resolved);

    // Persist — merge with existing app settings
    const existing = safeGet<Record<string, unknown> | null>("bodyCoach.settings.app", null) ?? {};
    safeSet("bodyCoach.settings.app", { ...existing, theme: newTheme });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
