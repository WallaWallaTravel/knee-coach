import { Mode, DrillId, defaultPlanForMode, DRILLS, MovementRestriction } from "./drills";
import { CalibrationProfile } from "./calibration";

// Sensation options (replaces clinical "swelling")
export type Sensation = 
  // Stiffness/tightness spectrum
  | "stiff"
  | "tight"
  | "locked_up"
  | "restricted"
  // Pain types
  | "achy"
  | "dull"
  | "sharp"
  | "stabbing"
  | "burning"
  | "throbbing"
  | "pinching"
  // Mechanical sensations
  | "grinding"
  | "clicking"
  | "popping"
  | "catching"
  | "locking"
  | "giving_way"
  // Pressure/fullness
  | "pressure"
  | "fullness"
  | "swollen_feeling"
  // Temperature
  | "warm"
  | "hot"
  // Weight/fatigue
  | "heavy"
  | "weak"
  | "fatigued"
  | "unstable"
  // Nerve-related
  | "tingling"
  | "numbness"
  // Positive
  | "nothing"
  | "good";

// Categorize sensations for UI and logic
export type SensationCategory = "stiffness" | "pain" | "mechanical" | "pressure" | "temperature" | "fatigue" | "nerve" | "positive";

export const SENSATION_INFO: Record<Sensation, { label: string; category: SensationCategory; warning?: boolean; danger?: boolean }> = {
  // Stiffness/tightness
  stiff: { label: "Stiff", category: "stiffness" },
  tight: { label: "Tight", category: "stiffness" },
  locked_up: { label: "Locked up", category: "stiffness", warning: true },
  restricted: { label: "Restricted ROM", category: "stiffness" },
  // Pain types
  achy: { label: "Achy", category: "pain" },
  dull: { label: "Dull pain", category: "pain" },
  sharp: { label: "Sharp", category: "pain", warning: true },
  stabbing: { label: "Stabbing", category: "pain", danger: true },
  burning: { label: "Burning", category: "pain", warning: true },
  throbbing: { label: "Throbbing", category: "pain", warning: true },
  pinching: { label: "Pinching", category: "pain", warning: true },
  // Mechanical
  grinding: { label: "Grinding", category: "mechanical", warning: true },
  clicking: { label: "Clicking", category: "mechanical" },
  popping: { label: "Popping", category: "mechanical" },
  catching: { label: "Catching", category: "mechanical", warning: true },
  locking: { label: "Locking", category: "mechanical", danger: true },
  giving_way: { label: "Giving way", category: "mechanical", danger: true },
  // Pressure/fullness
  pressure: { label: "Pressure", category: "pressure" },
  fullness: { label: "Fullness", category: "pressure" },
  swollen_feeling: { label: "Feels swollen", category: "pressure", warning: true },
  // Temperature
  warm: { label: "Warm", category: "temperature" },
  hot: { label: "Hot", category: "temperature", warning: true },
  // Weight/fatigue
  heavy: { label: "Heavy", category: "fatigue" },
  weak: { label: "Weak", category: "fatigue" },
  fatigued: { label: "Fatigued", category: "fatigue" },
  unstable: { label: "Unstable", category: "fatigue", warning: true },
  // Nerve
  tingling: { label: "Tingling", category: "nerve", warning: true },
  numbness: { label: "Numbness", category: "nerve", warning: true },
  // Positive
  nothing: { label: "Nothing unusual", category: "positive" },
  good: { label: "Feeling good", category: "positive" },
};

// Group sensations by category for UI
export const SENSATION_CATEGORIES: { id: SensationCategory; label: string; sensations: Sensation[] }[] = [
  {
    id: "stiffness",
    label: "Stiffness & Tightness",
    sensations: ["stiff", "tight", "locked_up", "restricted"],
  },
  {
    id: "pain",
    label: "Pain & Discomfort",
    sensations: ["achy", "dull", "sharp", "stabbing", "burning", "throbbing", "pinching"],
  },
  {
    id: "mechanical",
    label: "Mechanical Sensations",
    sensations: ["grinding", "clicking", "popping", "catching", "locking", "giving_way"],
  },
  {
    id: "pressure",
    label: "Pressure & Fullness",
    sensations: ["pressure", "fullness", "swollen_feeling"],
  },
  {
    id: "temperature",
    label: "Temperature",
    sensations: ["warm", "hot"],
  },
  {
    id: "fatigue",
    label: "Fatigue & Stability",
    sensations: ["heavy", "weak", "fatigued", "unstable"],
  },
  {
    id: "nerve",
    label: "Nerve Sensations",
    sensations: ["tingling", "numbness"],
  },
  {
    id: "positive",
    label: "Positive",
    sensations: ["nothing", "good"],
  },
];

// Pain location for follow-up - expanded with specific anatomical areas
export type PainLocation = 
  // General knee areas
  | "front" 
  | "back" 
  | "inside" 
  | "outside" 
  | "deep"
  // Kneecap specific
  | "kneecap"
  | "below_kneecap"
  | "above_kneecap"
  // Upper tibia / below joint line
  | "medial_tibial_plateau"      // Just below joint, medial side - bony area
  | "pes_anserinus"              // Medial upper tibia where hamstrings attach
  | "lateral_tibial_plateau"     // Just below joint, lateral side
  | "tibialis_anterior"          // Front-lateral upper shin - the muscle that gets overstressed
  | "it_band_insertion"          // Lateral, where IT band attaches
  | "patellar_tendon"            // Below kneecap, the tendon itself
  // Joint line
  | "medial_joint_line"          // Right at the joint, medial
  | "lateral_joint_line";        // Right at the joint, lateral

export const PAIN_LOCATION_LABELS: Record<PainLocation, string> = {
  // General
  front: "Front of knee (general)",
  back: "Back of knee",
  inside: "Inside (medial, general)",
  outside: "Outside (lateral, general)",
  deep: "Deep inside joint",
  // Kneecap
  kneecap: "Under/around kneecap",
  below_kneecap: "Below kneecap (general)",
  above_kneecap: "Above kneecap (quad tendon)",
  // Upper tibia specific
  medial_tibial_plateau: "Medial upper tibia (bony, below joint)",
  pes_anserinus: "Inner upper shin (pes anserinus)",
  lateral_tibial_plateau: "Lateral upper tibia (bony, below joint)",
  tibialis_anterior: "Front-outer shin muscle (tibialis anterior)",
  it_band_insertion: "Outer knee (IT band area)",
  patellar_tendon: "Patellar tendon (below kneecap)",
  // Joint line
  medial_joint_line: "Medial joint line (meniscus area)",
  lateral_joint_line: "Lateral joint line (meniscus area)",
};

// Group pain locations for better UI
export const PAIN_LOCATION_CATEGORIES: { label: string; locations: PainLocation[] }[] = [
  {
    label: "Kneecap Area",
    locations: ["kneecap", "above_kneecap", "below_kneecap", "patellar_tendon"],
  },
  {
    label: "Medial (Inside)",
    locations: ["inside", "medial_joint_line", "medial_tibial_plateau", "pes_anserinus"],
  },
  {
    label: "Lateral (Outside)",
    locations: ["outside", "lateral_joint_line", "lateral_tibial_plateau", "it_band_insertion"],
  },
  {
    label: "Upper Shin / Below Joint",
    locations: ["tibialis_anterior", "medial_tibial_plateau", "lateral_tibial_plateau"],
  },
  {
    label: "Other",
    locations: ["front", "back", "deep"],
  },
];

// Activity goal for the day
export type ActivityGoal = "rest" | "light" | "training" | "game";

// Expanded Readiness type - performance-focused
export type Readiness = {
  // Core questions (always asked)
  confidence: number;              // 0-10: "How much do you trust your knee right now?"
  movementRestrictions: MovementRestriction[]; // Which movements feel restricted
  sensations: Sensation[];         // What sensations are you noticing
  restingDiscomfort: number;       // 0-10: Any discomfort just sitting

  // Adaptive follow-ups (conditionally shown)
  recentGivingWay?: boolean;       // If confidence < 6
  unsafeMovements?: string[];      // If confidence < 6
  painLocation?: PainLocation[];   // If sharp/grinding selected
  sleepQuality?: number;           // 0-10, if resting discomfort > 3
  yesterdayActivity?: "none" | "light" | "moderate" | "heavy";
  mostLimitingMovement?: MovementRestriction; // If multiple restrictions

  // Context (shown on first use or weekly)
  activityGoal: ActivityGoal;
  yesterdayResponse?: "better" | "same" | "worse"; // How knee responded to yesterday
};

export type DrillFeedback = {
  drillId: DrillId;
  pain: number; // 0-10
  feltStable: boolean;
  notes?: string;
};

export type CoachState = {
  mode: Mode;
  plan: DrillId[];
  painStop: number;     // hard stop threshold
  painRegress: number;  // regress threshold
  reasoning: string;    // Why this mode was chosen
};

// Helper to check for dangerous sensations
function hasDangerousSensations(sensations: Sensation[]): boolean {
  const dangerous: Sensation[] = ["stabbing", "locking", "giving_way"];
  return sensations.some(s => dangerous.includes(s));
}

// Helper to check for warning sensations
function hasWarningSensations(sensations: Sensation[]): boolean {
  const warnings: Sensation[] = ["sharp", "burning", "throbbing", "pinching", "grinding", "catching", "locked_up", "swollen_feeling", "hot", "unstable", "tingling", "numbness"];
  return sensations.some(s => warnings.includes(s));
}

// Helper to check for positive sensations
function hasPositiveSensations(sensations: Sensation[]): boolean {
  return sensations.includes("nothing") || sensations.includes("good");
}

// Mode decision logic - performance focused
export function decideMode(r: Readiness): { mode: Mode; reasoning: string } {
  // RESET triggers - safety first
  if (r.confidence < 4) {
    return { mode: "RESET", reasoning: "Low confidence in knee. Focus on restoring trust." };
  }
  if (r.restingDiscomfort > 5) {
    return { mode: "RESET", reasoning: "Significant resting discomfort. Let's calm things down." };
  }
  if (r.recentGivingWay || r.sensations.includes("giving_way")) {
    return { mode: "RESET", reasoning: "Recent giving-way episode. Rebuild stability first." };
  }
  if (r.sensations.includes("locking")) {
    return { mode: "RESET", reasoning: "Locking sensation reported. Protective day - may need evaluation." };
  }
  if (hasDangerousSensations(r.sensations)) {
    return { mode: "RESET", reasoning: "Concerning sensations reported. Taking it easy today." };
  }
  if ((r.sensations.includes("sharp") || r.sensations.includes("stabbing")) && r.restingDiscomfort > 2) {
    return { mode: "RESET", reasoning: "Sharp sensations at rest. Protective day." };
  }

  // GAME triggers - ready to perform
  if (r.activityGoal === "game") {
    const noWarnings = !hasWarningSensations(r.sensations);
    const feelingGood = hasPositiveSensations(r.sensations) || r.sensations.length === 0;
    
    if (r.confidence >= 7 && noWarnings && r.restingDiscomfort <= 2) {
      return { mode: "GAME", reasoning: "Game day prep. Quick activation, no deep loading." };
    }
    if (r.confidence >= 6 && feelingGood && r.restingDiscomfort <= 1) {
      return { mode: "GAME", reasoning: "Game day - feeling good. Activation protocol." };
    }
    // Wanted game but not ready
    return { mode: "TRAINING", reasoning: "Not quite ready for game intensity. Smart training instead." };
  }

  // REST goal
  if (r.activityGoal === "rest") {
    return { mode: "RESET", reasoning: "Rest day selected. Light movement to maintain mobility." };
  }

  // LIGHT goal
  if (r.activityGoal === "light") {
    return { mode: "RESET", reasoning: "Light movement day. Gentle activation and mobility." };
  }

  // TRAINING (default) - build capacity
  const hasOnlyMildSensations = r.sensations.every(s => 
    ["stiff", "tight", "achy", "dull", "clicking", "popping", "heavy", "nothing", "good"].includes(s)
  );
  
  if (r.confidence >= 7 && hasOnlyMildSensations && r.restingDiscomfort <= 2) {
    return { mode: "TRAINING", reasoning: "Feeling solid. Full training protocol." };
  }

  if (r.confidence >= 5 && !hasWarningSensations(r.sensations)) {
    return { mode: "TRAINING", reasoning: "Moderate confidence. Training with attention to feedback." };
  }

  if (r.confidence >= 5 && hasWarningSensations(r.sensations)) {
    return { mode: "TRAINING", reasoning: "Some sensations to monitor. Modified training - listen to your knee." };
  }

  return { mode: "RESET", reasoning: "Taking it easy today. Build the foundation." };
}

// Filter drills based on movement restrictions
export function filterDrillsByRestrictions(
  drillIds: DrillId[],
  restrictions: MovementRestriction[]
): DrillId[] {
  if (restrictions.length === 0) return drillIds;

  return drillIds.filter((id) => {
    const drill = DRILLS[id];
    if (!drill.movementTags) return true;
    
    // Skip drill if it involves a restricted movement
    const hasConflict = drill.movementTags.some((tag) => restrictions.includes(tag));
    return !hasConflict;
  });
}

export function initCoach(r: Readiness, calibration?: CalibrationProfile | null): CoachState {
  const { mode, reasoning } = decideMode(r);
  let plan = defaultPlanForMode(mode);
  let finalReasoning = reasoning;

  // Filter out drills that involve restricted movements
  if (r.movementRestrictions.length > 0) {
    plan = filterDrillsByRestrictions(plan, r.movementRestrictions);
    // Ensure we have at least some drills
    if (plan.length < 2) {
      plan = defaultPlanForMode("RESET");
    }
  }

  // If we have calibration data, add context to reasoning
  if (calibration && calibration.problemZones.length > 0) {
    const primaryZone = calibration.problemZones.sort((a, b) => b.severity - a.severity)[0];
    const zoneName = primaryZone ? `${primaryZone.zoneIndex * 15}-${(primaryZone.zoneIndex + 1) * 15}°` : "";
    
    if (mode === "TRAINING" && calibration.primaryGoal === "full_performance") {
      finalReasoning = `${reasoning} Working around your ${zoneName} zone.`;
    } else if (mode === "RESET") {
      finalReasoning = `${reasoning} Protecting your problem range.`;
    }
  }

  return {
    mode,
    plan,
    painStop: mode === "GAME" ? 4 : 5,
    painRegress: 3,
    reasoning: finalReasoning,
  };
}

export function adjustPlanInSession(state: CoachState, fb: DrillFeedback): CoachState {
  if (fb.pain >= state.painStop || !fb.feltStable) {
    const mode: Mode = "RESET";
    return {
      mode,
      plan: defaultPlanForMode(mode),
      painStop: 4,
      painRegress: 2,
      reasoning: "Pain or instability during drill. Switching to reset protocol.",
    };
  }

  if (fb.pain >= state.painRegress) {
    const filtered = state.plan.filter((d) => d !== "SPANISH_SQUAT_MICRO" && d !== "STEP_DOWN_SUPPORTED");
    return { 
      ...state, 
      plan: filtered.length ? filtered : defaultPlanForMode("RESET"),
      reasoning: "Moderate pain reported. Removing higher-demand drills.",
    };
  }

  return state;
}

// Helper to get default readiness state
export function getDefaultReadiness(): Readiness {
  return {
    confidence: 7,
    movementRestrictions: [],
    sensations: [],
    restingDiscomfort: 0,
    activityGoal: "training",
  };
}

// Confidence level descriptions
export const CONFIDENCE_LABELS: Record<number, string> = {
  0: "No trust",
  1: "Very low",
  2: "Low",
  3: "Uncertain",
  4: "Cautious",
  5: "Moderate",
  6: "Decent",
  7: "Good",
  8: "Strong",
  9: "Very strong",
  10: "Full trust",
};

// Discomfort level descriptions
export const DISCOMFORT_LABELS: Record<number, string> = {
  0: "None",
  1: "Barely noticeable",
  2: "Mild",
  3: "Noticeable",
  4: "Moderate",
  5: "Distracting",
  6: "Significant",
  7: "Strong",
  8: "Severe",
  9: "Very severe",
  10: "Extreme",
};
