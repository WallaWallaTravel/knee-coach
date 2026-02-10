/**
 * Calibration data captures the user's specific knee issue profile.
 * This is collected during onboarding and can be updated over time.
 */

import { safeGet, safeSet } from "./storage/safe-storage";

// Range of motion zones (in degrees of knee flexion)
// 0° = fully extended, 90° = right angle, 135°+ = deep squat
export type ROMZone = {
  start: number;  // Starting angle (degrees)
  end: number;    // Ending angle (degrees)
  label: string;  // Human-readable label
};

export const ROM_ZONES: ROMZone[] = [
  { start: 0, end: 15, label: "Near full extension (0-15°)" },
  { start: 15, end: 30, label: "Early bend (15-30°)" },
  { start: 30, end: 45, label: "Athletic stance start (30-45°)" },
  { start: 45, end: 60, label: "Mid athletic stance (45-60°)" },
  { start: 60, end: 75, label: "Athletic stance deep (60-75°)" },
  { start: 75, end: 90, label: "Right angle (75-90°)" },
  { start: 90, end: 110, label: "Past 90° (90-110°)" },
  { start: 110, end: 135, label: "Deep bend (110-135°)" },
  { start: 135, end: 180, label: "Full depth (135°+)" },
];

// Issue types that can occur in a ROM zone
export type IssueType = 
  | "pain"
  | "instability"
  | "catching"
  | "grinding"
  | "weakness"
  | "stiffness"
  | "giving_way";

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  pain: "Pain",
  instability: "Instability/wobble",
  catching: "Catching/clicking",
  grinding: "Grinding sensation",
  weakness: "Weakness/giving out",
  stiffness: "Stiffness/resistance",
  giving_way: "Giving way/buckling",
};

// A specific issue in a specific ROM zone
export type ROMIssue = {
  zoneIndex: number;      // Index into ROM_ZONES
  issueTypes: IssueType[];
  severity: 1 | 2 | 3;    // 1=mild, 2=moderate, 3=severe
  notes?: string;
};

// Movement patterns and when they typically engage the problem zone
export type MovementPattern = {
  id: string;
  name: string;
  description: string;
  typicalROMRange: [number, number]; // [start, end] degrees
};

export const MOVEMENT_PATTERNS: MovementPattern[] = [
  // Basic locomotion
  { id: "walking", name: "Walking", description: "Normal gait on flat ground", typicalROMRange: [0, 30] },
  { id: "running", name: "Running", description: "Jogging/running gait", typicalROMRange: [10, 45] },
  { id: "sprinting", name: "Sprinting", description: "High-speed running", typicalROMRange: [15, 60] },
  
  // Stairs & steps
  { id: "stairs_up", name: "Stairs up", description: "Climbing stairs", typicalROMRange: [30, 75] },
  { id: "stairs_down", name: "Stairs down", description: "Descending stairs (eccentric)", typicalROMRange: [15, 60] },
  
  // Sit/stand
  { id: "sitting_down", name: "Sitting down", description: "Lowering to a chair", typicalROMRange: [45, 100] },
  { id: "standing_up", name: "Standing up", description: "Rising from seated", typicalROMRange: [90, 30] },
  
  // Athletic positions
  { id: "athletic_stance", name: "Athletic stance", description: "Ready position for sports", typicalROMRange: [30, 60] },
  { id: "squatting", name: "Squatting", description: "Full squat pattern", typicalROMRange: [0, 135] },
  { id: "lunging", name: "Lunging", description: "Split stance loading", typicalROMRange: [30, 100] },
  
  // Deceleration & direction change (key athletic movements)
  { id: "deceleration", name: "Deceleration", description: "Slowing down from speed", typicalROMRange: [20, 70] },
  { id: "hard_stop", name: "Hard stop", description: "Stopping suddenly from speed", typicalROMRange: [30, 70] },
  { id: "direction_reversal", name: "Direction reversal", description: "Dynamically reversing direction", typicalROMRange: [30, 60] },
  { id: "eccentric_to_concentric", name: "Eccentric-to-concentric transition", description: "Reversing from lowering to pushing up", typicalROMRange: [30, 60] },
  { id: "reactive_movement", name: "Reactive movement", description: "Unplanned direction changes", typicalROMRange: [20, 60] },
  
  // Cutting & pivoting
  { id: "cutting", name: "Cutting/pivoting", description: "Lateral direction changes", typicalROMRange: [20, 50] },
  { id: "crossover_cut", name: "Crossover cut", description: "Cutting across the body", typicalROMRange: [25, 55] },
  
  // Jumping & landing
  { id: "jumping", name: "Jumping", description: "Takeoff phase", typicalROMRange: [30, 70] },
  { id: "landing", name: "Landing", description: "Absorbing impact", typicalROMRange: [15, 90] },
  { id: "landing_to_jump", name: "Landing to immediate jump", description: "Reactive jumping", typicalROMRange: [20, 70] },
];

// When the issue typically occurs
export type IssueContext = 
  | "static"           // Just holding the position
  | "loading"          // When weight/force is applied
  | "unloading"        // When releasing weight/force
  | "concentric"       // Muscle shortening (standing up)
  | "eccentric"        // Muscle lengthening (sitting down)
  | "transition"       // Changing direction
  | "impact"           // Landing/sudden force
  | "fatigue"          // Only when tired
  | "cold"             // Before warming up
  | "always";          // Any time in that range

export const ISSUE_CONTEXT_LABELS: Record<IssueContext, string> = {
  static: "Just holding the position",
  loading: "When putting weight on it",
  unloading: "When taking weight off",
  concentric: "When straightening (pushing up)",
  eccentric: "When bending (lowering down)",
  transition: "When changing direction",
  impact: "On impact/landing",
  fatigue: "Only when fatigued",
  cold: "Before warming up",
  always: "Any time in that range",
};

// Full calibration profile
export type CalibrationProfile = {
  // When was this calibration done
  createdAt: string;
  updatedAt: string;
  
  // Primary problem zones
  problemZones: ROMIssue[];
  
  // Safe zones (where movement feels good)
  safeZones: number[];  // Indices into ROM_ZONES
  
  // Context when issues occur
  issueContexts: IssueContext[];
  
  // Affected movements
  affectedMovements: string[];  // IDs from MOVEMENT_PATTERNS
  
  // What makes it worse
  aggravators: string[];
  
  // What helps
  relievers: string[];
  
  // Goals
  primaryGoal: "pain_free" | "return_to_sport" | "daily_function" | "full_performance";
  targetActivities: string[];
  
  // History
  injuryType?: string;
  injuryDate?: string;
  hadSurgery?: boolean;
  surgeryType?: string;
  surgeryDate?: string;
  
  // Notes
  notes?: string;
};

// Default empty profile
export function getDefaultCalibration(): CalibrationProfile {
  return {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    problemZones: [],
    safeZones: [],
    issueContexts: [],
    affectedMovements: [],
    aggravators: [],
    relievers: [],
    primaryGoal: "return_to_sport",
    targetActivities: [],
  };
}

// Check if a movement pattern overlaps with problem zones
export function movementOverlapsProblemZone(
  movement: MovementPattern,
  profile: CalibrationProfile
): { overlaps: boolean; severity: number; zones: ROMZone[] } {
  const [moveStart, moveEnd] = movement.typicalROMRange;
  const overlappingZones: ROMZone[] = [];
  let maxSeverity = 0;

  for (const issue of profile.problemZones) {
    const zone = ROM_ZONES[issue.zoneIndex];
    // Check if ranges overlap
    if (moveStart <= zone.end && moveEnd >= zone.start) {
      overlappingZones.push(zone);
      maxSeverity = Math.max(maxSeverity, issue.severity);
    }
  }

  return {
    overlaps: overlappingZones.length > 0,
    severity: maxSeverity,
    zones: overlappingZones,
  };
}

// Get movements that are likely safe based on profile
export function getSafeMovements(profile: CalibrationProfile): MovementPattern[] {
  return MOVEMENT_PATTERNS.filter((m) => {
    const { overlaps } = movementOverlapsProblemZone(m, profile);
    return !overlaps;
  });
}

// Get movements that need caution based on profile
export function getCautionMovements(profile: CalibrationProfile): MovementPattern[] {
  return MOVEMENT_PATTERNS.filter((m) => {
    const { overlaps, severity } = movementOverlapsProblemZone(m, profile);
    return overlaps && severity <= 2;
  });
}

// Get movements to avoid based on profile
export function getAvoidMovements(profile: CalibrationProfile): MovementPattern[] {
  return MOVEMENT_PATTERNS.filter((m) => {
    const { overlaps, severity } = movementOverlapsProblemZone(m, profile);
    return overlaps && severity === 3;
  });
}

// Storage helpers
const CALIBRATION_KEY = "kneeCoach.calibration";

export function saveCalibration(profile: CalibrationProfile): void {
  profile.updatedAt = new Date().toISOString();
  safeSet(CALIBRATION_KEY, profile);
}

export function loadCalibration(): CalibrationProfile | null {
  return safeGet<CalibrationProfile | null>(CALIBRATION_KEY, null);
}

export function hasCalibration(): boolean {
  return safeGet<CalibrationProfile | null>(CALIBRATION_KEY, null) !== null;
}
