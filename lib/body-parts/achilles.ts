/**
 * Achilles tendon specific configuration
 */

import { 
  ROMZone, 
  SensationInfo, 
  MovementPattern, 
  IssueContext,
  BaseCalibrationProfile,
  BaseReadiness,
} from "./types";

// Achilles ROM zones (ankle dorsiflexion/plantarflexion)
// Neutral = 0°, Dorsiflexion = positive, Plantarflexion = negative
export const ACHILLES_ROM_ZONES: ROMZone[] = [
  { start: -50, end: -30, label: "Full plantarflexion (-50 to -30°)", description: "Pointing toes hard" },
  { start: -30, end: -15, label: "Mid plantarflexion (-30 to -15°)", description: "Toe-off position" },
  { start: -15, end: 0, label: "Slight plantarflexion (-15 to 0°)", description: "Standing relaxed" },
  { start: 0, end: 10, label: "Neutral to slight dorsi (0 to 10°)", description: "Flat foot standing" },
  { start: 10, end: 20, label: "Mid dorsiflexion (10 to 20°)", description: "Knee over toes" },
  { start: 20, end: 30, label: "Deep dorsiflexion (20 to 30°)", description: "Deep squat ankle" },
  { start: 30, end: 45, label: "Max dorsiflexion (30°+)", description: "Stretched position" },
];

// Achilles-specific sensations
export type AchillesSensation = 
  // Stiffness
  | "stiff"
  | "tight"
  | "restricted"
  | "morning_stiffness"
  // Pain types
  | "achy"
  | "sharp"
  | "burning"
  | "throbbing"
  | "pinching"
  // Tendon-specific
  | "creaky"
  | "crunchy"
  | "nodule_feeling"
  | "thickened"
  // Calf-related
  | "calf_tightness"
  | "calf_cramping"
  | "calf_fatigue"
  // Positive
  | "nothing"
  | "good";

export const ACHILLES_SENSATION_INFO: Record<AchillesSensation, SensationInfo> = {
  // Stiffness
  stiff: { label: "Stiff", category: "stiffness" },
  tight: { label: "Tight", category: "stiffness" },
  restricted: { label: "Restricted ROM", category: "stiffness" },
  morning_stiffness: { label: "Morning stiffness", category: "stiffness", warning: true },
  // Pain
  achy: { label: "Achy", category: "pain" },
  sharp: { label: "Sharp", category: "pain", warning: true },
  burning: { label: "Burning", category: "pain", warning: true },
  throbbing: { label: "Throbbing", category: "pain", warning: true },
  pinching: { label: "Pinching", category: "pain", warning: true },
  // Tendon-specific
  creaky: { label: "Creaky/crepitus", category: "mechanical" },
  crunchy: { label: "Crunchy feeling", category: "mechanical", warning: true },
  nodule_feeling: { label: "Nodule/bump feeling", category: "mechanical", warning: true },
  thickened: { label: "Feels thickened", category: "mechanical", warning: true },
  // Calf
  calf_tightness: { label: "Calf tightness", category: "fatigue" },
  calf_cramping: { label: "Calf cramping", category: "fatigue", warning: true },
  calf_fatigue: { label: "Calf fatigue", category: "fatigue" },
  // Positive
  nothing: { label: "Nothing unusual", category: "positive" },
  good: { label: "Feeling good", category: "positive" },
};

export const ACHILLES_SENSATION_CATEGORIES = [
  {
    id: "stiffness" as const,
    label: "Stiffness & Tightness",
    sensations: ["stiff", "tight", "restricted", "morning_stiffness"] as AchillesSensation[],
  },
  {
    id: "pain" as const,
    label: "Pain & Discomfort",
    sensations: ["achy", "sharp", "burning", "throbbing", "pinching"] as AchillesSensation[],
  },
  {
    id: "mechanical" as const,
    label: "Tendon Sensations",
    sensations: ["creaky", "crunchy", "nodule_feeling", "thickened"] as AchillesSensation[],
  },
  {
    id: "fatigue" as const,
    label: "Calf & Fatigue",
    sensations: ["calf_tightness", "calf_cramping", "calf_fatigue"] as AchillesSensation[],
  },
  {
    id: "positive" as const,
    label: "Positive",
    sensations: ["nothing", "good"] as AchillesSensation[],
  },
];

// Achilles pain locations
export type AchillesPainLocation = 
  | "insertion"           // Where tendon attaches to heel
  | "mid_tendon"          // Middle of the tendon (2-6cm above heel)
  | "musculotendinous"    // Where calf meets tendon
  | "medial_tendon"       // Inside edge of tendon
  | "lateral_tendon"      // Outside edge of tendon
  | "heel_bone"           // Calcaneus itself
  | "retrocalcaneal"      // Behind the heel, in front of tendon
  | "soleus"              // Deep calf muscle
  | "gastroc_medial"      // Inner calf head
  | "gastroc_lateral";    // Outer calf head

export const ACHILLES_PAIN_LOCATION_LABELS: Record<AchillesPainLocation, string> = {
  insertion: "Tendon insertion (at heel bone)",
  mid_tendon: "Mid-tendon (2-6cm above heel)",
  musculotendinous: "Where calf meets tendon",
  medial_tendon: "Inside edge of tendon",
  lateral_tendon: "Outside edge of tendon",
  heel_bone: "Heel bone itself",
  retrocalcaneal: "Behind heel (bursa area)",
  soleus: "Deep calf (soleus)",
  gastroc_medial: "Inner calf head",
  gastroc_lateral: "Outer calf head",
};

export const ACHILLES_PAIN_LOCATION_CATEGORIES = [
  {
    label: "Tendon",
    locations: ["insertion", "mid_tendon", "musculotendinous", "medial_tendon", "lateral_tendon"] as AchillesPainLocation[],
  },
  {
    label: "Heel & Bursa",
    locations: ["heel_bone", "retrocalcaneal"] as AchillesPainLocation[],
  },
  {
    label: "Calf Muscles",
    locations: ["soleus", "gastroc_medial", "gastroc_lateral"] as AchillesPainLocation[],
  },
];

// Achilles movement restrictions
export type AchillesMovementRestriction = 
  // Walking/running
  | "walking"
  | "walking_uphill"
  | "walking_downhill"
  | "jogging"
  | "running"
  | "sprinting"
  // Jumping
  | "jumping"
  | "landing"
  | "hopping"
  | "bounding"
  // Calf loading
  | "heel_raises"
  | "single_leg_heel_raise"
  | "eccentric_heel_drop"
  | "calf_stretch"
  // Stairs
  | "stairs_up"
  | "stairs_down"
  // Position
  | "prolonged_standing"
  | "first_steps_morning"
  | "after_sitting"
  // Sport specific
  | "cutting"
  | "pivoting"
  | "acceleration"
  | "deceleration";

export const ACHILLES_MOVEMENT_LABELS: Record<AchillesMovementRestriction, string> = {
  walking: "Walking (flat)",
  walking_uphill: "Walking uphill",
  walking_downhill: "Walking downhill",
  jogging: "Jogging",
  running: "Running",
  sprinting: "Sprinting",
  jumping: "Jumping",
  landing: "Landing",
  hopping: "Hopping (single leg)",
  bounding: "Bounding/plyos",
  heel_raises: "Heel raises (both legs)",
  single_leg_heel_raise: "Single leg heel raise",
  eccentric_heel_drop: "Eccentric heel drops",
  calf_stretch: "Calf stretching",
  stairs_up: "Stairs up",
  stairs_down: "Stairs down",
  prolonged_standing: "Prolonged standing",
  first_steps_morning: "First steps in morning",
  after_sitting: "After sitting",
  cutting: "Cutting/direction change",
  pivoting: "Pivoting",
  acceleration: "Acceleration",
  deceleration: "Deceleration",
};

export const ACHILLES_MOVEMENT_CATEGORIES = [
  {
    label: "Walking & Running",
    movements: ["walking", "walking_uphill", "walking_downhill", "jogging", "running", "sprinting"] as AchillesMovementRestriction[],
  },
  {
    label: "Jumping & Plyometrics",
    movements: ["jumping", "landing", "hopping", "bounding"] as AchillesMovementRestriction[],
  },
  {
    label: "Calf Loading",
    movements: ["heel_raises", "single_leg_heel_raise", "eccentric_heel_drop", "calf_stretch"] as AchillesMovementRestriction[],
  },
  {
    label: "Stairs",
    movements: ["stairs_up", "stairs_down"] as AchillesMovementRestriction[],
  },
  {
    label: "Position & Timing",
    movements: ["prolonged_standing", "first_steps_morning", "after_sitting"] as AchillesMovementRestriction[],
  },
  {
    label: "Athletic Movements",
    movements: ["cutting", "pivoting", "acceleration", "deceleration"] as AchillesMovementRestriction[],
  },
];

// Achilles movement patterns for calibration
export const ACHILLES_MOVEMENT_PATTERNS: MovementPattern[] = [
  // Walking/running
  { id: "walking", name: "Walking", description: "Normal gait on flat ground" },
  { id: "walking_uphill", name: "Walking uphill", description: "Incline walking" },
  { id: "jogging", name: "Jogging", description: "Easy running pace" },
  { id: "running", name: "Running", description: "Moderate running" },
  { id: "sprinting", name: "Sprinting", description: "High-speed running" },
  // Calf work
  { id: "heel_raise", name: "Heel raise", description: "Rising onto toes" },
  { id: "single_leg_heel_raise", name: "Single leg heel raise", description: "One leg calf raise" },
  { id: "eccentric_lowering", name: "Eccentric lowering", description: "Slow lowering from toes" },
  // Jumping
  { id: "jumping", name: "Jumping", description: "Two-foot takeoff" },
  { id: "landing", name: "Landing", description: "Absorbing impact" },
  { id: "hopping", name: "Hopping", description: "Single leg jumping" },
  // Direction change
  { id: "acceleration", name: "Acceleration", description: "Speeding up quickly" },
  { id: "deceleration", name: "Deceleration", description: "Slowing down quickly" },
  { id: "cutting", name: "Cutting", description: "Direction changes" },
];

// Achilles-specific issue contexts
export const ACHILLES_ISSUE_CONTEXTS: IssueContext[] = [
  "first_steps",
  "after_rest",
  "loading",
  "eccentric",
  "concentric",
  "impact",
  "fatigue",
  "cold",
  "end_of_day",
  "always",
];

// Achilles calibration profile
export interface AchillesCalibrationProfile extends BaseCalibrationProfile {
  bodyPart: "achilles";
  problemZones: {
    zoneIndex: number;
    issueTypes: string[];
    severity: 1 | 2 | 3;
  }[];
  painLocations: AchillesPainLocation[];
  movementRestrictions: AchillesMovementRestriction[];
  morningStiffnessDuration?: number; // minutes
  warmUpRequired?: boolean;
}

// Achilles readiness
export interface AchillesReadiness extends BaseReadiness {
  sensations: AchillesSensation[];
  movementRestrictions: AchillesMovementRestriction[];
  painLocations?: AchillesPainLocation[];
  morningStiffnessToday?: boolean;
  warmUpComplete?: boolean;
}

// Achilles drills
export type AchillesDrillId = 
  | "ISOMETRIC_HOLD"
  | "SEATED_HEEL_RAISE"
  | "STANDING_HEEL_RAISE"
  | "ECCENTRIC_HEEL_DROP"
  | "SINGLE_LEG_HEEL_RAISE"
  | "SOLEUS_RAISE"
  | "CALF_STRETCH_STRAIGHT"
  | "CALF_STRETCH_BENT"
  | "ANKLE_CIRCLES"
  | "TOE_WALKS"
  | "HEEL_WALKS";

export const ACHILLES_DRILLS: Record<AchillesDrillId, {
  id: AchillesDrillId;
  title: string;
  intent: string;
  cues: string[];
  dosage: { type: "time" | "reps"; value: number; sets: number; holdSeconds?: number };
  visualKey: string;
}> = {
  ISOMETRIC_HOLD: {
    id: "ISOMETRIC_HOLD",
    title: "Isometric Calf Hold",
    intent: "Pain-free tendon loading",
    cues: ["Stand on edge of step", "Rise to mid-range", "Hold steady - no bouncing", "Both legs"],
    dosage: { type: "time", value: 45, sets: 5 },
    visualKey: "isometric_hold",
  },
  SEATED_HEEL_RAISE: {
    id: "SEATED_HEEL_RAISE",
    title: "Seated Heel Raise",
    intent: "Soleus-focused loading",
    cues: ["Sit with knees bent 90°", "Weight on thighs if needed", "Slow and controlled", "Full range"],
    dosage: { type: "reps", value: 15, sets: 3 },
    visualKey: "seated_heel_raise",
  },
  STANDING_HEEL_RAISE: {
    id: "STANDING_HEEL_RAISE",
    title: "Standing Heel Raise (Bilateral)",
    intent: "Gastrocnemius loading",
    cues: ["Straight knees", "Rise as high as possible", "3 seconds up, 3 seconds down", "Both legs"],
    dosage: { type: "reps", value: 15, sets: 3 },
    visualKey: "standing_heel_raise",
  },
  ECCENTRIC_HEEL_DROP: {
    id: "ECCENTRIC_HEEL_DROP",
    title: "Eccentric Heel Drop",
    intent: "Tendon remodeling",
    cues: ["Rise on both legs", "Shift to affected leg", "Lower slowly (3-5 sec)", "Use other leg to rise"],
    dosage: { type: "reps", value: 15, sets: 3 },
    visualKey: "eccentric_heel_drop",
  },
  SINGLE_LEG_HEEL_RAISE: {
    id: "SINGLE_LEG_HEEL_RAISE",
    title: "Single Leg Heel Raise",
    intent: "Full strength loading",
    cues: ["One leg only", "Full range of motion", "Control the lowering", "Hold rail for balance only"],
    dosage: { type: "reps", value: 12, sets: 3 },
    visualKey: "single_leg_heel_raise",
  },
  SOLEUS_RAISE: {
    id: "SOLEUS_RAISE",
    title: "Bent Knee Heel Raise",
    intent: "Soleus isolation",
    cues: ["Knees bent 20-30°", "Rise onto toes", "Keep knees bent throughout", "Slow tempo"],
    dosage: { type: "reps", value: 15, sets: 3 },
    visualKey: "soleus_raise",
  },
  CALF_STRETCH_STRAIGHT: {
    id: "CALF_STRETCH_STRAIGHT",
    title: "Gastrocnemius Stretch",
    intent: "Maintain flexibility",
    cues: ["Back leg straight", "Heel down", "Lean into wall", "Gentle stretch only"],
    dosage: { type: "time", value: 30, sets: 3 },
    visualKey: "calf_stretch_straight",
  },
  CALF_STRETCH_BENT: {
    id: "CALF_STRETCH_BENT",
    title: "Soleus Stretch",
    intent: "Deep calf flexibility",
    cues: ["Back knee bent", "Heel down", "Lean forward", "Feel it lower in calf"],
    dosage: { type: "time", value: 30, sets: 3 },
    visualKey: "calf_stretch_bent",
  },
  ANKLE_CIRCLES: {
    id: "ANKLE_CIRCLES",
    title: "Ankle Circles",
    intent: "Mobility and blood flow",
    cues: ["Seated or standing", "Large circles", "Both directions", "Smooth movement"],
    dosage: { type: "reps", value: 10, sets: 2 },
    visualKey: "ankle_circles",
  },
  TOE_WALKS: {
    id: "TOE_WALKS",
    title: "Toe Walks",
    intent: "Functional calf activation",
    cues: ["Walk on toes", "Stay as high as possible", "Short steps", "20-30 meters"],
    dosage: { type: "time", value: 30, sets: 2 },
    visualKey: "toe_walks",
  },
  HEEL_WALKS: {
    id: "HEEL_WALKS",
    title: "Heel Walks",
    intent: "Anterior tibialis activation",
    cues: ["Walk on heels", "Toes up", "Short steps", "20-30 meters"],
    dosage: { type: "time", value: 30, sets: 2 },
    visualKey: "heel_walks",
  },
};

// Default plans by mode
export function getAchillesDefaultPlan(mode: "RESET" | "TRAINING" | "GAME"): AchillesDrillId[] {
  if (mode === "RESET") {
    return ["ANKLE_CIRCLES", "ISOMETRIC_HOLD", "SEATED_HEEL_RAISE", "CALF_STRETCH_BENT"];
  }
  if (mode === "GAME") {
    return ["ANKLE_CIRCLES", "TOE_WALKS", "STANDING_HEEL_RAISE", "CALF_STRETCH_STRAIGHT"];
  }
  // TRAINING
  return [
    "ANKLE_CIRCLES",
    "STANDING_HEEL_RAISE",
    "SOLEUS_RAISE",
    "ECCENTRIC_HEEL_DROP",
    "SINGLE_LEG_HEEL_RAISE",
    "CALF_STRETCH_STRAIGHT",
    "CALF_STRETCH_BENT",
  ];
}
