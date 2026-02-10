/**
 * Outcome Tracking System
 * 
 * Tracks user progress over time to:
 * 1. Demonstrate app efficacy
 * 2. Personalize recommendations
 * 3. Identify trends and patterns
 * 4. Provide motivation through visible progress
 */

import { BodyPart } from "../body-parts/types";

// ============================================
// DAILY CHECK-IN DATA
// ============================================

export interface DailyCheckIn {
  id: string;
  date: string;  // ISO date string
  bodyPart: BodyPart;
  timestamp: number;
  
  // Core metrics
  painLevel: number;           // 0-10
  functionLevel: number;       // 0-10 (how well can you do daily activities)
  confidenceLevel: number;     // 0-10 (confidence in the body part)
  
  // Sensations reported
  sensations: string[];
  
  // Context
  sleepQuality?: number;       // 0-10
  stressLevel?: number;        // 0-10
  activityYesterday?: "rest" | "light" | "moderate" | "heavy";
  
  // Mode assigned
  modeAssigned: "RESET" | "TRAINING" | "GAME";
  
  // Optional notes
  notes?: string;
}

// ============================================
// EXERCISE SESSION DATA
// ============================================

export interface ExerciseSession {
  id: string;
  date: string;
  bodyPart: BodyPart;
  timestamp: number;
  
  // What was done
  exercisesCompleted: {
    exerciseId: string;
    sets: number;
    reps?: number;
    duration?: number;  // seconds
    difficulty: "too_easy" | "just_right" | "too_hard";
    painDuring: number;  // 0-10
  }[];
  
  // Session totals
  totalDuration: number;  // minutes
  overallDifficulty: "too_easy" | "just_right" | "too_hard";
  
  // Post-session
  painAfter?: number;     // 0-10
  feelingAfter?: "better" | "same" | "worse";
}

// ============================================
// WEEKLY SUMMARY
// ============================================

export interface WeeklySummary {
  weekStart: string;  // ISO date of Monday
  bodyPart: BodyPart;
  
  // Aggregated metrics
  avgPainLevel: number;
  avgFunctionLevel: number;
  avgConfidenceLevel: number;
  
  // Trends
  painTrend: "improving" | "stable" | "worsening";
  functionTrend: "improving" | "stable" | "worsening";
  
  // Activity
  checkInsCompleted: number;
  sessionsCompleted: number;
  totalExerciseMinutes: number;
  
  // Mode distribution
  modeDistribution: {
    RESET: number;
    TRAINING: number;
    GAME: number;
  };
}

// ============================================
// MILESTONE TRACKING
// ============================================

export type MilestoneType = 
  | "pain_reduction"
  | "function_improvement"
  | "consistency"
  | "exercise_progression"
  | "movement_unlocked";

export interface Milestone {
  id: string;
  type: MilestoneType;
  bodyPart: BodyPart;
  achievedDate: string;
  title: string;
  description: string;
  value?: number;  // e.g., "reduced pain by 3 points"
}

export const MILESTONE_DEFINITIONS: {
  id: string;
  type: MilestoneType;
  title: string;
  description: string;
  condition: (data: OutcomeData) => boolean;
}[] = [
  {
    id: "FIRST_CHECKIN",
    type: "consistency",
    title: "First Check-In",
    description: "Completed your first daily check-in",
    condition: (data) => data.checkIns.length >= 1
  },
  {
    id: "WEEK_STREAK",
    type: "consistency",
    title: "Week Warrior",
    description: "Checked in 7 days in a row",
    condition: (data) => getConsecutiveDays(data.checkIns) >= 7
  },
  {
    id: "MONTH_STREAK",
    type: "consistency",
    title: "Monthly Dedication",
    description: "Checked in 30 days in a row",
    condition: (data) => getConsecutiveDays(data.checkIns) >= 30
  },
  {
    id: "PAIN_DOWN_2",
    type: "pain_reduction",
    title: "Pain Reduction",
    description: "Average pain reduced by 2+ points",
    condition: (data) => getPainReduction(data) >= 2
  },
  {
    id: "PAIN_DOWN_5",
    type: "pain_reduction",
    title: "Major Pain Relief",
    description: "Average pain reduced by 5+ points",
    condition: (data) => getPainReduction(data) >= 5
  },
  {
    id: "FUNCTION_UP_2",
    type: "function_improvement",
    title: "Function Boost",
    description: "Function level improved by 2+ points",
    condition: (data) => getFunctionImprovement(data) >= 2
  },
  {
    id: "FIRST_TRAINING",
    type: "movement_unlocked",
    title: "Ready to Train",
    description: "First day assigned TRAINING mode",
    condition: (data) => data.checkIns.some(c => c.modeAssigned === "TRAINING")
  },
  {
    id: "FIRST_GAME",
    type: "movement_unlocked",
    title: "Game Ready",
    description: "First day assigned GAME mode",
    condition: (data) => data.checkIns.some(c => c.modeAssigned === "GAME")
  },
  {
    id: "TEN_SESSIONS",
    type: "exercise_progression",
    title: "Dedicated Practitioner",
    description: "Completed 10 exercise sessions",
    condition: (data) => data.sessions.length >= 10
  },
  {
    id: "FIFTY_SESSIONS",
    type: "exercise_progression",
    title: "Exercise Expert",
    description: "Completed 50 exercise sessions",
    condition: (data) => data.sessions.length >= 50
  }
];

// ============================================
// OUTCOME DATA STRUCTURE
// ============================================

export interface OutcomeData {
  bodyPart: BodyPart;
  startDate: string;
  checkIns: DailyCheckIn[];
  sessions: ExerciseSession[];
  weeklySummaries: WeeklySummary[];
  milestones: Milestone[];
  
  // Baseline (first week average)
  baseline?: {
    painLevel: number;
    functionLevel: number;
    confidenceLevel: number;
    recordedDate: string;
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getConsecutiveDays(checkIns: DailyCheckIn[]): number {
  if (checkIns.length === 0) return 0;
  
  const sorted = [...checkIns].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastCheckIn = new Date(sorted[0].date);
  lastCheckIn.setHours(0, 0, 0, 0);
  
  // Check if last check-in was today or yesterday
  const daysSinceLastCheckIn = Math.floor(
    (today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceLastCheckIn > 1) return 0;
  
  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i - 1].date);
    const previous = new Date(sorted[i].date);
    
    const dayDiff = Math.floor(
      (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (dayDiff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function getPainReduction(data: OutcomeData): number {
  if (!data.baseline || data.checkIns.length < 7) return 0;
  
  // Get last 7 days average
  const recent = data.checkIns
    .slice(-7)
    .reduce((sum, c) => sum + c.painLevel, 0) / Math.min(7, data.checkIns.length);
  
  return data.baseline.painLevel - recent;
}

function getFunctionImprovement(data: OutcomeData): number {
  if (!data.baseline || data.checkIns.length < 7) return 0;
  
  const recent = data.checkIns
    .slice(-7)
    .reduce((sum, c) => sum + c.functionLevel, 0) / Math.min(7, data.checkIns.length);
  
  return recent - data.baseline.functionLevel;
}

// ============================================
// MAIN TRACKING FUNCTIONS
// ============================================

export function createOutcomeData(bodyPart: BodyPart): OutcomeData {
  return {
    bodyPart,
    startDate: new Date().toISOString(),
    checkIns: [],
    sessions: [],
    weeklySummaries: [],
    milestones: []
  };
}

export function addCheckIn(
  data: OutcomeData,
  checkIn: Omit<DailyCheckIn, "id" | "timestamp">
): OutcomeData {
  const newCheckIn: DailyCheckIn = {
    ...checkIn,
    id: `checkin_${Date.now()}`,
    timestamp: Date.now()
  };
  
  const updated = {
    ...data,
    checkIns: [...data.checkIns, newCheckIn]
  };
  
  // Set baseline after first week
  if (!updated.baseline && updated.checkIns.length >= 7) {
    const firstWeek = updated.checkIns.slice(0, 7);
    updated.baseline = {
      painLevel: firstWeek.reduce((s, c) => s + c.painLevel, 0) / 7,
      functionLevel: firstWeek.reduce((s, c) => s + c.functionLevel, 0) / 7,
      confidenceLevel: firstWeek.reduce((s, c) => s + c.confidenceLevel, 0) / 7,
      recordedDate: new Date().toISOString()
    };
  }
  
  // Check for new milestones
  const newMilestones = checkForNewMilestones(updated);
  if (newMilestones.length > 0) {
    updated.milestones = [...updated.milestones, ...newMilestones];
  }
  
  return updated;
}

export function addSession(
  data: OutcomeData,
  session: Omit<ExerciseSession, "id" | "timestamp">
): OutcomeData {
  const newSession: ExerciseSession = {
    ...session,
    id: `session_${Date.now()}`,
    timestamp: Date.now()
  };
  
  const updated = {
    ...data,
    sessions: [...data.sessions, newSession]
  };
  
  // Check for new milestones
  const newMilestones = checkForNewMilestones(updated);
  if (newMilestones.length > 0) {
    updated.milestones = [...updated.milestones, ...newMilestones];
  }
  
  return updated;
}

function checkForNewMilestones(data: OutcomeData): Milestone[] {
  const existingIds = new Set(data.milestones.map(m => m.id));
  const newMilestones: Milestone[] = [];
  
  for (const def of MILESTONE_DEFINITIONS) {
    if (!existingIds.has(def.id) && def.condition(data)) {
      newMilestones.push({
        id: def.id,
        type: def.type,
        bodyPart: data.bodyPart,
        achievedDate: new Date().toISOString(),
        title: def.title,
        description: def.description
      });
    }
  }
  
  return newMilestones;
}

export function generateWeeklySummary(data: OutcomeData): WeeklySummary | null {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  
  const weekCheckIns = data.checkIns.filter(c => {
    const date = new Date(c.date);
    return date >= weekStart && date < weekEnd;
  });
  
  const weekSessions = data.sessions.filter(s => {
    const date = new Date(s.date);
    return date >= weekStart && date < weekEnd;
  });
  
  if (weekCheckIns.length === 0) return null;
  
  const avgPain = weekCheckIns.reduce((s, c) => s + c.painLevel, 0) / weekCheckIns.length;
  const avgFunction = weekCheckIns.reduce((s, c) => s + c.functionLevel, 0) / weekCheckIns.length;
  const avgConfidence = weekCheckIns.reduce((s, c) => s + c.confidenceLevel, 0) / weekCheckIns.length;
  
  // Calculate trends (compare to previous week)
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  
  const prevWeekCheckIns = data.checkIns.filter(c => {
    const date = new Date(c.date);
    return date >= prevWeekStart && date < weekStart;
  });
  
  let painTrend: "improving" | "stable" | "worsening" = "stable";
  let functionTrend: "improving" | "stable" | "worsening" = "stable";
  
  if (prevWeekCheckIns.length > 0) {
    const prevAvgPain = prevWeekCheckIns.reduce((s, c) => s + c.painLevel, 0) / prevWeekCheckIns.length;
    const prevAvgFunction = prevWeekCheckIns.reduce((s, c) => s + c.functionLevel, 0) / prevWeekCheckIns.length;
    
    if (avgPain < prevAvgPain - 0.5) painTrend = "improving";
    else if (avgPain > prevAvgPain + 0.5) painTrend = "worsening";
    
    if (avgFunction > prevAvgFunction + 0.5) functionTrend = "improving";
    else if (avgFunction < prevAvgFunction - 0.5) functionTrend = "worsening";
  }
  
  const modeDistribution = {
    RESET: weekCheckIns.filter(c => c.modeAssigned === "RESET").length,
    TRAINING: weekCheckIns.filter(c => c.modeAssigned === "TRAINING").length,
    GAME: weekCheckIns.filter(c => c.modeAssigned === "GAME").length
  };
  
  return {
    weekStart: weekStart.toISOString(),
    bodyPart: data.bodyPart,
    avgPainLevel: Math.round(avgPain * 10) / 10,
    avgFunctionLevel: Math.round(avgFunction * 10) / 10,
    avgConfidenceLevel: Math.round(avgConfidence * 10) / 10,
    painTrend,
    functionTrend,
    checkInsCompleted: weekCheckIns.length,
    sessionsCompleted: weekSessions.length,
    totalExerciseMinutes: weekSessions.reduce((s, sess) => s + sess.totalDuration, 0),
    modeDistribution
  };
}

// ============================================
// ANALYTICS & INSIGHTS
// ============================================

export interface ProgressInsight {
  type: "positive" | "neutral" | "attention";
  title: string;
  message: string;
  metric?: string;
  value?: number;
}

export function generateInsights(data: OutcomeData): ProgressInsight[] {
  const insights: ProgressInsight[] = [];
  
  if (data.checkIns.length < 3) {
    insights.push({
      type: "neutral",
      title: "Building Your Baseline",
      message: "Keep checking in daily to establish your baseline and track progress."
    });
    return insights;
  }
  
  // Streak insight
  const streak = getConsecutiveDays(data.checkIns);
  if (streak >= 7) {
    insights.push({
      type: "positive",
      title: "Great Consistency!",
      message: `You've checked in ${streak} days in a row. Consistency is key to progress.`,
      metric: "streak",
      value: streak
    });
  }
  
  // Pain trend
  if (data.baseline) {
    const painReduction = getPainReduction(data);
    if (painReduction >= 2) {
      insights.push({
        type: "positive",
        title: "Pain Improving",
        message: `Your average pain has decreased by ${painReduction.toFixed(1)} points since starting.`,
        metric: "pain_reduction",
        value: painReduction
      });
    } else if (painReduction < -1) {
      insights.push({
        type: "attention",
        title: "Pain Increasing",
        message: "Your pain levels have been higher recently. Consider reducing activity intensity.",
        metric: "pain_increase",
        value: Math.abs(painReduction)
      });
    }
    
    // Function trend
    const functionImprovement = getFunctionImprovement(data);
    if (functionImprovement >= 2) {
      insights.push({
        type: "positive",
        title: "Function Improving",
        message: `Your function level has improved by ${functionImprovement.toFixed(1)} points.`,
        metric: "function_improvement",
        value: functionImprovement
      });
    }
  }
  
  // Mode progression
  const recentCheckIns = data.checkIns.slice(-14);
  const trainingDays = recentCheckIns.filter(c => c.modeAssigned === "TRAINING").length;
  const gameDays = recentCheckIns.filter(c => c.modeAssigned === "GAME").length;
  
  if (gameDays > 0 && gameDays >= trainingDays) {
    insights.push({
      type: "positive",
      title: "High Readiness",
      message: "You've been in GAME mode frequently. Your body is responding well!"
    });
  }
  
  // Exercise consistency
  if (data.sessions.length > 0) {
    const recentSessions = data.sessions.filter(s => {
      const date = new Date(s.date);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return date >= twoWeeksAgo;
    });
    
    if (recentSessions.length >= 10) {
      insights.push({
        type: "positive",
        title: "Active Rehab",
        message: `You've completed ${recentSessions.length} exercise sessions in the last 2 weeks.`
      });
    } else if (recentSessions.length < 3 && data.sessions.length >= 5) {
      insights.push({
        type: "attention",
        title: "Exercise Reminder",
        message: "Your exercise frequency has dropped. Try to maintain consistency for best results."
      });
    }
  }
  
  return insights;
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const STORAGE_KEY_PREFIX = "bodyCoach.outcomes.";

export function saveOutcomeData(data: OutcomeData): boolean {
  const key = `${STORAGE_KEY_PREFIX}${data.bodyPart}`;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    if (err instanceof DOMException && err.name === "QuotaExceededError") {
      // Try to free space by pruning old data inline
      try {
        const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
        data.checkIns = data.checkIns.filter(c => (c.timestamp ?? 0) > cutoff);
        data.sessions = data.sessions.filter(s => (s.timestamp ?? 0) > cutoff);
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export function loadOutcomeData(bodyPart: BodyPart): OutcomeData | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}${bodyPart}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    return JSON.parse(stored) as OutcomeData;
  } catch {
    return null;
  }
}

export function getOrCreateOutcomeData(bodyPart: BodyPart): OutcomeData {
  const existing = loadOutcomeData(bodyPart);
  if (existing) return existing;
  
  const newData = createOutcomeData(bodyPart);
  saveOutcomeData(newData);
  return newData;
}
