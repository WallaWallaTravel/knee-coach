/**
 * Clinical thresholds used by the coaching engine.
 * Centralised here so they're easy to find and adjust.
 */

// Confidence thresholds
export const CONFIDENCE_LOW = 4;          // Below this → RESET
export const CONFIDENCE_STABILITY = 6;    // Below this → giving-way follow-up shown
export const CONFIDENCE_HIGH = 7;         // Above this + no warnings → GAME/TRAINING ok

// Discomfort thresholds
export const DISCOMFORT_HIGH = 5;         // Above this → RESET
export const DISCOMFORT_LOW = 2;          // At or below → GAME/TRAINING ok

// Pain thresholds (during session)
export const PAIN_STOP_TRAINING = 5;      // Hard stop in TRAINING mode
export const PAIN_STOP_GAME = 4;          // Hard stop in GAME mode
export const PAIN_REGRESS = 3;            // Regress to easier drills

// History-based thresholds
export const PAIN_TRENDING_THRESHOLD = 4; // If recent avg pain > this + trending up → RESET
export const REGRESSIONS_THRESHOLD = 2;   // Number of recent regressions → RESET
export const TREND_WINDOW_DAYS = 7;       // Window for trend analysis
export const PROGRESSIVE_WORSENING_DAYS = 3; // Consecutive days of increasing pain
