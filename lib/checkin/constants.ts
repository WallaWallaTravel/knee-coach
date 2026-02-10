/**
 * Shared UI constants for check-in pages.
 * These were previously duplicated in each body part's page.tsx.
 */

export const CONFIDENCE_LABELS: Record<number, string> = {
  0: "No trust",
  1: "Very low",
  2: "Low",
  3: "Shaky",
  4: "Uncertain",
  5: "Neutral",
  6: "Okay",
  7: "Good",
  8: "Strong",
  9: "Very strong",
  10: "Full trust",
};

export const DISCOMFORT_LABELS: Record<number, string> = {
  0: "None",
  1: "Barely noticeable",
  2: "Slight",
  3: "Mild",
  4: "Moderate",
  5: "Noticeable",
  6: "Uncomfortable",
  7: "Significant",
  8: "Severe",
  9: "Very severe",
  10: "Extreme",
};

export function getConfidenceColor(value: number): string {
  if (value <= 3) return "#ef4444";
  if (value <= 5) return "#f59e0b";
  if (value <= 7) return "#6366f1";
  return "#22c55e";
}

export function getDiscomfortColor(value: number): string {
  if (value <= 2) return "#22c55e";
  if (value <= 4) return "#6366f1";
  if (value <= 6) return "#f59e0b";
  return "#ef4444";
}
