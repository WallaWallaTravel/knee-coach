/**
 * Session Analytics Module
 *
 * Analyzes historical OutcomeData to provide trend information
 * that influences coaching decisions.
 */

import { OutcomeData } from "./outcomes";
import { Dosage } from "../exercises/types";

export interface SessionTrends {
  /** Average pain across last N sessions */
  recentAvgPain: number;
  /** Average pain from the session before that */
  previousAvgPain: number;
  /** Whether pain is trending up over recent sessions */
  painTrendingUp: boolean;
  /** Number of consecutive sessions with avg pain < 2 */
  lowPainStreak: number;
  /** Rate of "felt stable" across recent sessions (0-1) */
  recentStabilityRate: number;
  /** Dominant difficulty rating from recent sessions */
  recentDifficultyTrend: "too_easy" | "just_right" | "too_hard" | "insufficient_data";
  /** Number of consecutive "too easy" difficulty ratings */
  tooEasyStreak: number;
  /** Number of sessions completed */
  totalSessions: number;
  /** Number of recent regressions (pain >= 6) */
  recentRegressions: number;
  /** Days since last session */
  daysSinceLastSession: number | null;
}

export interface CheckInTrends {
  /** Average pain level over last 7 check-ins */
  weeklyAvgPain: number;
  /** Previous week's average pain */
  previousWeekAvgPain: number;
  /** Pain trend direction */
  painDirection: "improving" | "stable" | "worsening";
  /** Average confidence over last 7 check-ins */
  weeklyAvgConfidence: number;
  /** Confidence trend direction */
  confidenceDirection: "improving" | "stable" | "declining";
  /** Number of RESET mode assignments in last 7 days */
  recentResetCount: number;
  /** Consecutive days checked in */
  streak: number;
  /** Whether there's a progressive worsening pattern */
  progressiveWorsening: boolean;
}

/**
 * Analyze recent session data to produce trends for coaching decisions
 */
export function analyzeSessionTrends(data: OutcomeData): SessionTrends {
  const sessions = data.sessions;
  const recentCount = Math.min(5, sessions.length);
  const recentSessions = sessions.slice(-recentCount);
  const previousSessions = sessions.slice(-recentCount * 2, -recentCount);

  // Average pain across recent sessions
  const recentAvgPain = recentSessions.length > 0
    ? recentSessions.reduce((sum, s) => {
        const sessionPain = s.exercisesCompleted.length > 0
          ? s.exercisesCompleted.reduce((ps, e) => ps + e.painDuring, 0) / s.exercisesCompleted.length
          : 0;
        return sum + sessionPain;
      }, 0) / recentSessions.length
    : 0;

  const previousAvgPain = previousSessions.length > 0
    ? previousSessions.reduce((sum, s) => {
        const sessionPain = s.exercisesCompleted.length > 0
          ? s.exercisesCompleted.reduce((ps, e) => ps + e.painDuring, 0) / s.exercisesCompleted.length
          : 0;
        return sum + sessionPain;
      }, 0) / previousSessions.length
    : 0;

  // Low pain streak (consecutive sessions with avg pain < 2)
  let lowPainStreak = 0;
  for (let i = sessions.length - 1; i >= 0; i--) {
    const s = sessions[i];
    const avg = s.exercisesCompleted.length > 0
      ? s.exercisesCompleted.reduce((sum, e) => sum + e.painDuring, 0) / s.exercisesCompleted.length
      : 0;
    if (avg < 2) {
      lowPainStreak++;
    } else {
      break;
    }
  }

  // Stability rate
  const recentStabilityRate = recentSessions.length > 0
    ? (() => {
        // We don't have feltStable in ExerciseSession, so we approximate:
        // exercises with painDuring <= 2 are considered "stable"
        let stable = 0;
        let total = 0;
        for (const s of recentSessions) {
          for (const e of s.exercisesCompleted) {
            total++;
            if (e.painDuring <= 2) stable++;
          }
        }
        return total > 0 ? stable / total : 1;
      })()
    : 1;

  // Difficulty trend
  const difficultyVotes = recentSessions.flatMap(s =>
    s.exercisesCompleted.map(e => e.difficulty)
  );
  let recentDifficultyTrend: "too_easy" | "just_right" | "too_hard" | "insufficient_data" = "insufficient_data";
  if (difficultyVotes.length >= 3) {
    const easy = difficultyVotes.filter(d => d === "too_easy").length;
    const hard = difficultyVotes.filter(d => d === "too_hard").length;
    if (easy > difficultyVotes.length / 2) recentDifficultyTrend = "too_easy";
    else if (hard > difficultyVotes.length / 2) recentDifficultyTrend = "too_hard";
    else recentDifficultyTrend = "just_right";
  }

  // Too easy streak
  let tooEasyStreak = 0;
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].overallDifficulty === "too_easy") {
      tooEasyStreak++;
    } else {
      break;
    }
  }

  // Recent regressions (sessions with pain >= 6 on any exercise)
  const recentRegressions = recentSessions.filter(s =>
    s.exercisesCompleted.some(e => e.painDuring >= 6)
  ).length;

  // Days since last session
  const daysSinceLastSession = sessions.length > 0
    ? Math.floor((Date.now() - new Date(sessions[sessions.length - 1].date).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return {
    recentAvgPain,
    previousAvgPain,
    painTrendingUp: recentAvgPain > previousAvgPain + 0.5,
    lowPainStreak,
    recentStabilityRate,
    recentDifficultyTrend,
    tooEasyStreak,
    totalSessions: sessions.length,
    recentRegressions,
    daysSinceLastSession,
  };
}

/**
 * Analyze recent check-in data for trend-based safety alerts
 */
export function analyzeCheckInTrends(data: OutcomeData): CheckInTrends {
  const checkIns = data.checkIns;
  const recentCount = Math.min(7, checkIns.length);
  const recent = checkIns.slice(-recentCount);
  const previous = checkIns.slice(-recentCount * 2, -recentCount);

  const weeklyAvgPain = recent.length > 0
    ? recent.reduce((sum, c) => sum + c.painLevel, 0) / recent.length
    : 0;

  const previousWeekAvgPain = previous.length > 0
    ? previous.reduce((sum, c) => sum + c.painLevel, 0) / previous.length
    : 0;

  const weeklyAvgConfidence = recent.length > 0
    ? recent.reduce((sum, c) => sum + c.confidenceLevel, 0) / recent.length
    : 10;

  const previousWeekAvgConfidence = previous.length > 0
    ? previous.reduce((sum, c) => sum + c.confidenceLevel, 0) / previous.length
    : 10;

  // Pain direction
  let painDirection: "improving" | "stable" | "worsening" = "stable";
  if (recent.length >= 3 && previous.length >= 3) {
    if (weeklyAvgPain < previousWeekAvgPain - 0.5) painDirection = "improving";
    else if (weeklyAvgPain > previousWeekAvgPain + 0.5) painDirection = "worsening";
  }

  // Confidence direction
  let confidenceDirection: "improving" | "stable" | "declining" = "stable";
  if (recent.length >= 3 && previous.length >= 3) {
    if (weeklyAvgConfidence > previousWeekAvgConfidence + 0.5) confidenceDirection = "improving";
    else if (weeklyAvgConfidence < previousWeekAvgConfidence - 0.5) confidenceDirection = "declining";
  }

  // Reset mode frequency
  const recentResetCount = recent.filter(c => c.modeAssigned === "RESET").length;

  // Consecutive check-in streak
  let streak = 0;
  if (checkIns.length > 0) {
    const sorted = [...checkIns].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDate = new Date(sorted[0].date);
    lastDate.setHours(0, 0, 0, 0);

    const daysSinceLast = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLast <= 1) {
      streak = 1;
      for (let i = 1; i < sorted.length; i++) {
        const curr = new Date(sorted[i - 1].date);
        const prev = new Date(sorted[i].date);
        curr.setHours(0, 0, 0, 0);
        prev.setHours(0, 0, 0, 0);
        const diff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) streak++;
        else break;
      }
    }
  }

  // Progressive worsening: 3+ consecutive days of increasing pain
  let progressiveWorsening = false;
  if (checkIns.length >= 3) {
    const last3 = checkIns.slice(-3);
    if (last3[2].painLevel > last3[1].painLevel && last3[1].painLevel > last3[0].painLevel) {
      progressiveWorsening = true;
    }
  }

  return {
    weeklyAvgPain,
    previousWeekAvgPain,
    painDirection,
    weeklyAvgConfidence,
    confidenceDirection,
    recentResetCount,
    streak,
    progressiveWorsening,
  };
}

export type DosageLevel = "min" | "default" | "max";

/**
 * Determine appropriate dosage level for an exercise based on historical feedback.
 *
 * Logic:
 * - 3+ consecutive "too easy" with avg pain < 2 → advance to max
 * - Recent "too hard" or pain > 4 → regress to min
 * - Otherwise → default
 */
export function getAdaptedDosageLevel(
  exerciseId: string,
  data: OutcomeData
): DosageLevel {
  // Get all feedback for this specific exercise, most recent first
  const exerciseFeedback = data.sessions
    .flatMap(s => s.exercisesCompleted.map(e => ({
      ...e,
      sessionDate: s.date,
    })))
    .filter(e => e.exerciseId === exerciseId)
    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());

  if (exerciseFeedback.length === 0) return "default";

  // Check most recent session's feedback
  const lastFeedback = exerciseFeedback[0];
  if (lastFeedback.painDuring > 4 || lastFeedback.difficulty === "too_hard") {
    return "min";
  }

  // Check for "too easy" streak (last 3 sessions)
  const recent3 = exerciseFeedback.slice(0, 3);
  if (recent3.length >= 3) {
    const allTooEasy = recent3.every(f => f.difficulty === "too_easy");
    const allLowPain = recent3.every(f => f.painDuring < 2);
    if (allTooEasy && allLowPain) return "max";
  }

  return "default";
}

/**
 * Select the right dosage object based on exercise data and dosage level.
 */
export function selectDosage(
  defaultDosage: Dosage,
  minDosage: Dosage | undefined,
  maxDosage: Dosage | undefined,
  level: DosageLevel
): { dosage: Dosage; label: string } {
  switch (level) {
    case "min":
      return {
        dosage: minDosage ?? defaultDosage,
        label: minDosage ? "Eased" : "Standard",
      };
    case "max":
      return {
        dosage: maxDosage ?? defaultDosage,
        label: maxDosage ? "Advanced" : "Standard",
      };
    default:
      return { dosage: defaultDosage, label: "Standard" };
  }
}
