/**
 * Shared types for all body parts
 */

export type BodyPart = "knee" | "achilles" | "shoulder" | "foot";

export const BODY_PART_INFO: Record<BodyPart, { 
  name: string; 
  icon: string; 
  description: string;
  color: string;
}> = {
  knee: {
    name: "Knee",
    icon: "🦵",
    description: "Knee joint, patella, and surrounding structures",
    color: "#6366f1",
  },
  achilles: {
    name: "Achilles",
    icon: "🦶",
    description: "Achilles tendon and calf complex",
    color: "#f59e0b",
  },
  shoulder: {
    name: "Shoulder",
    icon: "💪",
    description: "Shoulder joint, rotator cuff, and surrounding structures",
    color: "#10b981",
  },
  foot: {
    name: "Foot",
    icon: "👣",
    description: "Plantar fascia, arch, forefoot, and toes",
    color: "#ec4899",
  },
};

// Generic ROM zone that can be customized per body part
export type ROMZone = {
  start: number;
  end: number;
  label: string;
  description?: string;
};

// Generic issue types (shared across body parts)
export type IssueType = 
  | "pain"
  | "instability"
  | "catching"
  | "grinding"
  | "weakness"
  | "stiffness"
  | "giving_way"
  | "clicking"
  | "popping"
  | "tightness"
  | "fatigue";

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  pain: "Pain",
  instability: "Instability/wobble",
  catching: "Catching",
  grinding: "Grinding sensation",
  weakness: "Weakness",
  stiffness: "Stiffness/resistance",
  giving_way: "Giving way/buckling",
  clicking: "Clicking",
  popping: "Popping",
  tightness: "Tightness",
  fatigue: "Fatigue/tiredness",
};

// Generic issue context (when does it happen)
export type IssueContext = 
  | "static"
  | "loading"
  | "unloading"
  | "concentric"
  | "eccentric"
  | "transition"
  | "impact"
  | "fatigue"
  | "cold"
  | "always"
  | "first_steps"
  | "after_rest"
  | "end_of_day";

export const ISSUE_CONTEXT_LABELS: Record<IssueContext, string> = {
  static: "Just holding the position",
  loading: "When putting weight/force on it",
  unloading: "When taking weight/force off",
  concentric: "When contracting/shortening",
  eccentric: "When lengthening under load",
  transition: "When changing direction",
  impact: "On impact/landing",
  fatigue: "Only when fatigued",
  cold: "Before warming up",
  always: "Any time",
  first_steps: "First steps after rest",
  after_rest: "After sitting/lying down",
  end_of_day: "End of day/after activity",
};

// Sensation categories (shared structure, specific sensations per body part)
export type SensationCategory = "stiffness" | "pain" | "mechanical" | "pressure" | "temperature" | "fatigue" | "nerve" | "positive";

export type SensationInfo = {
  label: string;
  category: SensationCategory;
  warning?: boolean;
  danger?: boolean;
};

// Movement pattern for calibration
export type MovementPattern = {
  id: string;
  name: string;
  description: string;
  typicalROMRange?: [number, number];
};

// Activity goal (shared)
export type ActivityGoal = "rest" | "light" | "training" | "game";

export const ACTIVITY_GOAL_INFO: Record<ActivityGoal, { label: string; icon: string; description: string }> = {
  rest: { label: "Rest day", icon: "🛋️", description: "Recovery focus" },
  light: { label: "Light movement", icon: "🚶", description: "Easy activity" },
  training: { label: "Training", icon: "💪", description: "Full workout" },
  game: { label: "Game / Competition", icon: "🏀", description: "Performance day" },
};

// Rehab goals (shared)
export type RehabGoal = "pain_free" | "daily_function" | "return_to_sport" | "full_performance";

export const REHAB_GOAL_INFO: Record<RehabGoal, { label: string; description: string }> = {
  pain_free: { label: "Pain-free daily life", description: "Move through the day without issues" },
  daily_function: { label: "Full daily function", description: "All daily activities without limitation" },
  return_to_sport: { label: "Return to sport", description: "Get back to playing at a good level" },
  full_performance: { label: "Full athletic performance", description: "Perform at or above pre-injury level" },
};

// Generic calibration profile structure
export type BaseCalibrationProfile = {
  bodyPart: BodyPart;
  createdAt: string;
  updatedAt: string;
  primaryGoal: RehabGoal;
  issueContexts: IssueContext[];
  affectedMovements: string[];
  notes?: string;
};

// Generic readiness structure
export type BaseReadiness = {
  confidence: number;
  restingDiscomfort: number;
  activityGoal: ActivityGoal;
  sensations: string[];
  problemZoneStatus?: "better" | "same" | "worse";
};

// Mode (shared)
export type Mode = "RESET" | "TRAINING" | "GAME";

// Coach state (shared structure)
export type BaseCoachState = {
  mode: Mode;
  plan: string[];
  painStop: number;
  painRegress: number;
  reasoning: string;
};
