/**
 * Knee specific configuration
 * Migrated from the original lib/coach.ts and lib/drills.ts
 */

import { 
  ROMZone, 
  SensationInfo, 
  MovementPattern, 
  IssueContext,
  BaseCalibrationProfile,
  BaseReadiness,
} from "./types";

// Knee ROM zones (flexion angle)
export const KNEE_ROM_ZONES: ROMZone[] = [
  { start: 0, end: 15, label: "Near full extension (0-15°)", description: "Almost straight" },
  { start: 15, end: 30, label: "Early bend (15-30°)", description: "Slight bend" },
  { start: 30, end: 45, label: "Athletic stance start (30-45°)", description: "Ready position" },
  { start: 45, end: 60, label: "Mid athletic stance (45-60°)", description: "Athletic crouch" },
  { start: 60, end: 75, label: "Athletic stance deep (60-75°)", description: "Deep athletic position" },
  { start: 75, end: 90, label: "Right angle (75-90°)", description: "Seated position" },
  { start: 90, end: 110, label: "Past 90° (90-110°)", description: "Deep seated" },
  { start: 110, end: 135, label: "Deep bend (110-135°)", description: "Deep squat" },
  { start: 135, end: 160, label: "Full depth (135°+)", description: "Full squat/kneeling" },
];

// Knee-specific sensations
export type KneeSensation = 
  // Stiffness
  | "stiff"
  | "tight"
  | "restricted"
  // Pain types
  | "achy"
  | "dull"
  | "sharp"
  | "stabbing"
  | "burning"
  | "throbbing"
  | "pinching"
  // Mechanical
  | "grinding"
  | "clicking"
  | "popping"
  | "catching"
  | "locking"
  | "giving_way"
  // Pressure
  | "pressure"
  | "fullness"
  | "feels_swollen"
  // Temperature
  | "warm"
  | "hot"
  // Fatigue/stability
  | "heavy"
  | "weak"
  | "fatigued"
  | "unstable"
  // Nerve
  | "tingling"
  | "numbness"
  // Positive
  | "nothing"
  | "good";

export const KNEE_SENSATION_INFO: Record<KneeSensation, SensationInfo> = {
  // Stiffness
  stiff: { label: "Stiff", category: "stiffness" },
  tight: { label: "Tight", category: "stiffness" },
  restricted: { label: "Restricted", category: "stiffness" },
  // Pain
  achy: { label: "Achy", category: "pain" },
  dull: { label: "Dull pain", category: "pain" },
  sharp: { label: "Sharp", category: "pain", warning: true },
  stabbing: { label: "Stabbing", category: "pain", danger: true },
  burning: { label: "Burning", category: "pain", warning: true },
  throbbing: { label: "Throbbing", category: "pain" },
  pinching: { label: "Pinching", category: "pain", warning: true },
  // Mechanical
  grinding: { label: "Grinding", category: "mechanical", warning: true },
  clicking: { label: "Clicking", category: "mechanical" },
  popping: { label: "Popping", category: "mechanical" },
  catching: { label: "Catching", category: "mechanical", warning: true },
  locking: { label: "Locking", category: "mechanical", danger: true },
  giving_way: { label: "Giving way", category: "mechanical", danger: true },
  // Pressure
  pressure: { label: "Pressure", category: "pressure" },
  fullness: { label: "Fullness", category: "pressure" },
  feels_swollen: { label: "Feels swollen", category: "pressure" },
  // Temperature
  warm: { label: "Warm", category: "temperature" },
  hot: { label: "Hot", category: "temperature", warning: true },
  // Fatigue
  heavy: { label: "Heavy", category: "fatigue" },
  weak: { label: "Weak", category: "fatigue" },
  fatigued: { label: "Fatigued", category: "fatigue" },
  unstable: { label: "Unstable", category: "fatigue", warning: true },
  // Nerve
  tingling: { label: "Tingling", category: "nerve", warning: true },
  numbness: { label: "Numbness", category: "nerve", danger: true },
  // Positive
  nothing: { label: "Nothing unusual", category: "positive" },
  good: { label: "Feeling good", category: "positive" },
};

export const KNEE_SENSATION_CATEGORIES = [
  {
    id: "stiffness" as const,
    label: "Stiffness & Tightness",
    sensations: ["stiff", "tight", "restricted"] as KneeSensation[],
  },
  {
    id: "pain" as const,
    label: "Pain & Discomfort",
    sensations: ["achy", "dull", "sharp", "stabbing", "burning", "throbbing", "pinching"] as KneeSensation[],
  },
  {
    id: "mechanical" as const,
    label: "Mechanical Sensations",
    sensations: ["grinding", "clicking", "popping", "catching", "locking", "giving_way"] as KneeSensation[],
  },
  {
    id: "pressure" as const,
    label: "Pressure & Fullness",
    sensations: ["pressure", "fullness", "feels_swollen"] as KneeSensation[],
  },
  {
    id: "temperature" as const,
    label: "Temperature",
    sensations: ["warm", "hot"] as KneeSensation[],
  },
  {
    id: "fatigue" as const,
    label: "Fatigue & Stability",
    sensations: ["heavy", "weak", "fatigued", "unstable"] as KneeSensation[],
  },
  {
    id: "nerve" as const,
    label: "Nerve Sensations",
    sensations: ["tingling", "numbness"] as KneeSensation[],
  },
  {
    id: "positive" as const,
    label: "Positive",
    sensations: ["nothing", "good"] as KneeSensation[],
  },
];

// Knee pain locations
export type KneePainLocation = 
  // General
  | "front"
  | "back"
  | "inside"
  | "outside"
  | "deep"
  // Kneecap
  | "kneecap"
  | "below_kneecap"
  | "above_kneecap"
  // Upper tibia specific
  | "medial_tibial_plateau"
  | "pes_anserinus"
  | "lateral_tibial_plateau"
  | "tibialis_anterior"
  | "it_band_insertion"
  | "patellar_tendon"
  // Joint line
  | "medial_joint_line"
  | "lateral_joint_line";

export const KNEE_PAIN_LOCATION_LABELS: Record<KneePainLocation, string> = {
  front: "Front of knee (general)",
  back: "Back of knee",
  inside: "Inside (medial, general)",
  outside: "Outside (lateral, general)",
  deep: "Deep inside joint",
  kneecap: "Under/around kneecap",
  below_kneecap: "Below kneecap (general)",
  above_kneecap: "Above kneecap (quad tendon)",
  medial_tibial_plateau: "Medial upper tibia (bony, below joint)",
  pes_anserinus: "Inner upper shin (pes anserinus)",
  lateral_tibial_plateau: "Lateral upper tibia (bony, below joint)",
  tibialis_anterior: "Front-outer shin muscle (tibialis anterior)",
  it_band_insertion: "Outer knee (IT band area)",
  patellar_tendon: "Patellar tendon (below kneecap)",
  medial_joint_line: "Medial joint line (meniscus area)",
  lateral_joint_line: "Lateral joint line (meniscus area)",
};

export const KNEE_PAIN_LOCATION_CATEGORIES = [
  {
    label: "Kneecap Area",
    locations: ["kneecap", "above_kneecap", "below_kneecap", "patellar_tendon"] as KneePainLocation[],
  },
  {
    label: "Medial (Inside)",
    locations: ["inside", "medial_joint_line", "medial_tibial_plateau", "pes_anserinus"] as KneePainLocation[],
  },
  {
    label: "Lateral (Outside)",
    locations: ["outside", "lateral_joint_line", "lateral_tibial_plateau", "it_band_insertion"] as KneePainLocation[],
  },
  {
    label: "Upper Shin / Below Joint",
    locations: ["tibialis_anterior", "medial_tibial_plateau", "lateral_tibial_plateau"] as KneePainLocation[],
  },
  {
    label: "Other",
    locations: ["front", "back", "deep"] as KneePainLocation[],
  },
];

// Knee movement restrictions
export type KneeMovementRestriction = 
  // Squat/bend patterns
  | "deep_squat"
  | "partial_squat"
  | "reverse_direction"
  | "eccentric_loading"
  | "kneeling"
  // Stairs & steps
  | "stairs_down"
  | "stairs_up"
  | "step_over"
  // Deceleration & direction change
  | "deceleration"
  | "hard_stop"
  | "direction_reversal"
  | "reactive_cuts"
  // Dynamic/athletic
  | "jumping"
  | "landing"
  | "running"
  | "sprinting"
  | "lateral_cuts"
  | "pivoting"
  | "backpedaling"
  // Single leg
  | "single_leg_stance"
  | "single_leg_loading"
  | "lunging"
  // Sitting/standing
  | "sit_to_stand"
  | "prolonged_sitting"
  | "prolonged_standing"
  | "prolonged_bent";

export const KNEE_MOVEMENT_LABELS: Record<KneeMovementRestriction, string> = {
  deep_squat: "Deep squat",
  partial_squat: "Partial squat (45-90°)",
  reverse_direction: "Reversing mid-bend",
  eccentric_loading: "Lowering under load (eccentric)",
  kneeling: "Kneeling",
  stairs_down: "Stairs down",
  stairs_up: "Stairs up",
  step_over: "Stepping over things",
  deceleration: "Slowing down",
  hard_stop: "Hard stop from speed",
  direction_reversal: "Reversing direction dynamically",
  reactive_cuts: "Reactive/unplanned cuts",
  jumping: "Jumping",
  landing: "Landing",
  running: "Running",
  sprinting: "Sprinting",
  lateral_cuts: "Lateral cuts (planned)",
  pivoting: "Pivoting/turning",
  backpedaling: "Backpedaling",
  single_leg_stance: "Single leg balance",
  single_leg_loading: "Single leg under load",
  lunging: "Lunging",
  sit_to_stand: "Sit to stand",
  prolonged_sitting: "Sitting too long",
  prolonged_standing: "Standing too long",
  prolonged_bent: "Staying bent (e.g., athletic stance)",
};

export const KNEE_MOVEMENT_CATEGORIES = [
  {
    label: "Bending & Squatting",
    movements: ["deep_squat", "partial_squat", "reverse_direction", "eccentric_loading", "kneeling", "sit_to_stand"] as KneeMovementRestriction[],
  },
  {
    label: "Stairs & Steps",
    movements: ["stairs_down", "stairs_up", "step_over"] as KneeMovementRestriction[],
  },
  {
    label: "Deceleration & Direction Change",
    movements: ["deceleration", "hard_stop", "direction_reversal", "reactive_cuts"] as KneeMovementRestriction[],
  },
  {
    label: "Dynamic & Athletic",
    movements: ["jumping", "landing", "running", "sprinting", "lateral_cuts", "pivoting", "backpedaling"] as KneeMovementRestriction[],
  },
  {
    label: "Single Leg & Balance",
    movements: ["single_leg_stance", "single_leg_loading", "lunging"] as KneeMovementRestriction[],
  },
  {
    label: "Prolonged Positions",
    movements: ["prolonged_sitting", "prolonged_standing", "prolonged_bent"] as KneeMovementRestriction[],
  },
];

// Knee movement patterns for calibration
export const KNEE_MOVEMENT_PATTERNS: MovementPattern[] = [
  { id: "walking", name: "Walking", description: "Normal gait on flat ground", typicalROMRange: [0, 30] },
  { id: "running", name: "Running", description: "Jogging/running gait", typicalROMRange: [10, 45] },
  { id: "sprinting", name: "Sprinting", description: "High-speed running", typicalROMRange: [15, 60] },
  { id: "stairs_up", name: "Stairs up", description: "Climbing stairs", typicalROMRange: [30, 75] },
  { id: "stairs_down", name: "Stairs down", description: "Descending stairs (eccentric)", typicalROMRange: [15, 60] },
  { id: "sitting_down", name: "Sitting down", description: "Lowering to a chair", typicalROMRange: [45, 100] },
  { id: "standing_up", name: "Standing up", description: "Rising from seated", typicalROMRange: [90, 30] },
  { id: "athletic_stance", name: "Athletic stance", description: "Ready position for sports", typicalROMRange: [30, 60] },
  { id: "squatting", name: "Squatting", description: "Full squat pattern", typicalROMRange: [0, 135] },
  { id: "lunging", name: "Lunging", description: "Split stance loading", typicalROMRange: [30, 100] },
  { id: "deceleration", name: "Deceleration", description: "Slowing down from speed", typicalROMRange: [20, 70] },
  { id: "hard_stop", name: "Hard stop", description: "Stopping suddenly from speed", typicalROMRange: [30, 70] },
  { id: "direction_reversal", name: "Direction reversal", description: "Dynamically reversing direction", typicalROMRange: [30, 60] },
  { id: "eccentric_to_concentric", name: "Eccentric-to-concentric transition", description: "Reversing from lowering to pushing up", typicalROMRange: [30, 60] },
  { id: "reactive_movement", name: "Reactive movement", description: "Unplanned direction changes", typicalROMRange: [20, 60] },
  { id: "cutting", name: "Cutting/pivoting", description: "Lateral direction changes", typicalROMRange: [20, 50] },
  { id: "crossover_cut", name: "Crossover cut", description: "Cutting across the body", typicalROMRange: [25, 55] },
  { id: "jumping", name: "Jumping", description: "Takeoff phase", typicalROMRange: [30, 70] },
  { id: "landing", name: "Landing", description: "Absorbing impact", typicalROMRange: [15, 90] },
  { id: "landing_to_jump", name: "Landing to immediate jump", description: "Reactive jumping", typicalROMRange: [20, 70] },
];

// Knee-specific issue contexts
export const KNEE_ISSUE_CONTEXTS: IssueContext[] = [
  "static",
  "loading",
  "unloading",
  "concentric",
  "eccentric",
  "transition",
  "impact",
  "fatigue",
  "cold",
  "always",
];

// Knee calibration profile
export interface KneeCalibrationProfile extends BaseCalibrationProfile {
  bodyPart: "knee";
  problemZones: {
    zoneIndex: number;
    issueTypes: string[];
    severity: 1 | 2 | 3;
  }[];
  painLocations: KneePainLocation[];
  movementRestrictions: KneeMovementRestriction[];
  recentGivingWay?: boolean;
}

// Knee readiness
export interface KneeReadiness extends BaseReadiness {
  sensations: KneeSensation[];
  movementRestrictions: KneeMovementRestriction[];
  painLocations?: KneePainLocation[];
  recentGivingWay?: boolean;
}

// Knee drills
export type KneeDrillId = 
  | "QUAD_SET"
  | "HEEL_SLIDES"
  | "FOOT_TRIPOD"
  | "GLUTE_BRIDGE_HEEL_DRAG"
  | "HAM_QUAD_COCONTRACT"
  | "WALL_BOW"
  | "SPANISH_SQUAT_MICRO"
  | "STEP_DOWN_SUPPORTED";

export const KNEE_DRILLS: Record<KneeDrillId, {
  id: KneeDrillId;
  title: string;
  intent: string;
  cues: string[];
  dosage: { type: "time" | "reps"; value: number; sets: number; holdSeconds?: number };
  visualKey: string;
  movementTags?: KneeMovementRestriction[];
}> = {
  QUAD_SET: {
    id: "QUAD_SET",
    title: "Quad Set",
    intent: "Wake up VMO without load",
    cues: ["Seated or supine", "Press knee down", "Hold 5s, feel quad tighten"],
    dosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5 },
    visualKey: "quad_set",
  },
  HEEL_SLIDES: {
    id: "HEEL_SLIDES",
    title: "Heel Slides",
    intent: "Gentle ROM without load",
    cues: ["Supine", "Slide heel toward glute", "Control the motion"],
    dosage: { type: "reps", value: 10, sets: 2 },
    visualKey: "heel_slides",
  },
  FOOT_TRIPOD: {
    id: "FOOT_TRIPOD",
    title: "Foot Tripod Activation",
    intent: "Establish stable base",
    cues: ["Stand on one leg", "Feel big toe, little toe, heel", "Slight knee bend"],
    dosage: { type: "time", value: 30, sets: 3 },
    visualKey: "foot_tripod",
  },
  GLUTE_BRIDGE_HEEL_DRAG: {
    id: "GLUTE_BRIDGE_HEEL_DRAG",
    title: "Glute Bridge + Heel Drag",
    intent: "Posterior chain activation",
    cues: ["Bridge up", "Drag heel toward glute", "Keep hips level"],
    dosage: { type: "reps", value: 8, sets: 2 },
    visualKey: "glute_bridge_heel_drag",
  },
  HAM_QUAD_COCONTRACT: {
    id: "HAM_QUAD_COCONTRACT",
    title: "Ham-Quad Co-contraction",
    intent: "Joint stability through co-activation",
    cues: ["Seated, foot on floor", "Push down AND pull back", "Feel both muscle groups"],
    dosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5 },
    visualKey: "ham_quad_cocontract",
  },
  WALL_BOW: {
    id: "WALL_BOW",
    title: "Wall Bow",
    intent: "Controlled partial squat",
    cues: ["Back against wall", "Slide down to 30-45°", "Hold, then return"],
    dosage: { type: "reps", value: 8, sets: 3, holdSeconds: 5 },
    visualKey: "wall_bow",
    movementTags: ["partial_squat"],
  },
  SPANISH_SQUAT_MICRO: {
    id: "SPANISH_SQUAT_MICRO",
    title: "Spanish Squat (Micro 35-45°)",
    intent: "Load mid-arc without shear",
    cues: ["Band behind knees", "Only 35-45° range", "Slow; no sharp tibial pain"],
    dosage: { type: "reps", value: 8, sets: 3 },
    visualKey: "spanish_squat_micro",
    movementTags: ["deep_squat", "partial_squat"],
  },
  STEP_DOWN_SUPPORTED: {
    id: "STEP_DOWN_SUPPORTED",
    title: "Supported Step-Down (Shallow)",
    intent: "Eccentric control without collapse",
    cues: ["Hold rail/stick", "3s down; brief pause", "Keep heel-drag tension"],
    dosage: { type: "reps", value: 6, sets: 2 },
    visualKey: "stepdown_supported",
    movementTags: ["stairs_down", "landing", "partial_squat"],
  },
};

// Default plans by mode
export function getKneeDefaultPlan(mode: "RESET" | "TRAINING" | "GAME"): KneeDrillId[] {
  if (mode === "RESET") {
    return ["QUAD_SET", "HEEL_SLIDES", "FOOT_TRIPOD", "GLUTE_BRIDGE_HEEL_DRAG"];
  }
  if (mode === "GAME") {
    return ["FOOT_TRIPOD", "GLUTE_BRIDGE_HEEL_DRAG", "HAM_QUAD_COCONTRACT", "WALL_BOW"];
  }
  // TRAINING
  return [
    "FOOT_TRIPOD",
    "GLUTE_BRIDGE_HEEL_DRAG",
    "HAM_QUAD_COCONTRACT",
    "WALL_BOW",
    "SPANISH_SQUAT_MICRO",
    "STEP_DOWN_SUPPORTED",
  ];
}
