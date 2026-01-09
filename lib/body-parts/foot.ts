/**
 * Foot specific configuration
 * Covers plantar fascia, midfoot, forefoot, toes, and general foot mechanics
 */

import { 
  ROMZone, 
  SensationInfo, 
  MovementPattern, 
  IssueContext,
  BaseCalibrationProfile,
  BaseReadiness,
} from "./types";

// Foot doesn't have traditional ROM zones like knee/shoulder
// Instead we use functional positions and load states
export const FOOT_FUNCTIONAL_ZONES: ROMZone[] = [
  { start: 0, end: 1, label: "First steps (morning/after rest)", description: "Initial loading after being off feet" },
  { start: 1, end: 2, label: "Standing (static)", description: "Weight bearing without movement" },
  { start: 2, end: 3, label: "Walking (heel strike)", description: "Initial contact phase" },
  { start: 3, end: 4, label: "Walking (midstance)", description: "Full weight on foot" },
  { start: 4, end: 5, label: "Walking (toe-off)", description: "Push-off phase" },
  { start: 5, end: 6, label: "Running/jogging", description: "Higher impact loading" },
  { start: 6, end: 7, label: "Sprinting/jumping", description: "Maximum force production" },
  { start: 7, end: 8, label: "Barefoot", description: "Without supportive footwear" },
];

// Foot-specific sensations
export type FootSensation = 
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
  | "stabbing"
  | "electric"
  // Plantar fascia specific
  | "tearing_feeling"
  | "bruised_feeling"
  | "stone_bruise"
  // Nerve-related
  | "tingling"
  | "numbness"
  | "pins_needles"
  | "radiating"
  // Mechanical
  | "clicking"
  | "popping"
  | "grinding"
  | "catching"
  // Swelling/inflammation
  | "swollen"
  | "hot"
  | "puffy"
  // Fatigue
  | "tired"
  | "heavy"
  | "weak"
  | "cramping"
  // Positive
  | "nothing"
  | "good";

export const FOOT_SENSATION_INFO: Record<FootSensation, SensationInfo> = {
  // Stiffness
  stiff: { label: "Stiff", category: "stiffness" },
  tight: { label: "Tight", category: "stiffness" },
  restricted: { label: "Restricted", category: "stiffness" },
  morning_stiffness: { label: "Morning stiffness", category: "stiffness", warning: true },
  // Pain
  achy: { label: "Achy", category: "pain" },
  sharp: { label: "Sharp", category: "pain", warning: true },
  burning: { label: "Burning", category: "pain", warning: true },
  throbbing: { label: "Throbbing", category: "pain" },
  stabbing: { label: "Stabbing", category: "pain", danger: true },
  electric: { label: "Electric/shooting", category: "pain", warning: true },
  // Plantar specific
  tearing_feeling: { label: "Tearing feeling", category: "pain", danger: true },
  bruised_feeling: { label: "Bruised feeling", category: "pain" },
  stone_bruise: { label: "Stone bruise sensation", category: "pain", warning: true },
  // Nerve
  tingling: { label: "Tingling", category: "nerve", warning: true },
  numbness: { label: "Numbness", category: "nerve", danger: true },
  pins_needles: { label: "Pins and needles", category: "nerve", warning: true },
  radiating: { label: "Radiating pain", category: "nerve", warning: true },
  // Mechanical
  clicking: { label: "Clicking", category: "mechanical" },
  popping: { label: "Popping", category: "mechanical" },
  grinding: { label: "Grinding", category: "mechanical", warning: true },
  catching: { label: "Catching", category: "mechanical", warning: true },
  // Swelling
  swollen: { label: "Swollen", category: "pressure" },
  hot: { label: "Hot to touch", category: "temperature", warning: true },
  puffy: { label: "Puffy", category: "pressure" },
  // Fatigue
  tired: { label: "Tired/fatigued", category: "fatigue" },
  heavy: { label: "Heavy feeling", category: "fatigue" },
  weak: { label: "Weak", category: "fatigue" },
  cramping: { label: "Cramping", category: "fatigue", warning: true },
  // Positive
  nothing: { label: "Nothing unusual", category: "positive" },
  good: { label: "Feeling good", category: "positive" },
};

export const FOOT_SENSATION_CATEGORIES = [
  {
    id: "stiffness" as const,
    label: "Stiffness & Tightness",
    sensations: ["stiff", "tight", "restricted", "morning_stiffness"] as FootSensation[],
  },
  {
    id: "pain" as const,
    label: "Pain & Discomfort",
    sensations: ["achy", "sharp", "burning", "throbbing", "stabbing", "electric", "tearing_feeling", "bruised_feeling", "stone_bruise"] as FootSensation[],
  },
  {
    id: "nerve" as const,
    label: "Nerve Sensations",
    sensations: ["tingling", "numbness", "pins_needles", "radiating"] as FootSensation[],
  },
  {
    id: "mechanical" as const,
    label: "Mechanical Sensations",
    sensations: ["clicking", "popping", "grinding", "catching"] as FootSensation[],
  },
  {
    id: "pressure" as const,
    label: "Swelling & Inflammation",
    sensations: ["swollen", "hot", "puffy"] as FootSensation[],
  },
  {
    id: "fatigue" as const,
    label: "Fatigue & Cramping",
    sensations: ["tired", "heavy", "weak", "cramping"] as FootSensation[],
  },
  {
    id: "positive" as const,
    label: "Positive",
    sensations: ["nothing", "good"] as FootSensation[],
  },
];

// Foot pain locations - very specific anatomical areas
export type FootPainLocation = 
  // Plantar (bottom of foot)
  | "plantar_heel"           // Classic plantar fasciitis spot
  | "plantar_arch"           // Along the arch
  | "plantar_midfoot"        // Middle of bottom
  | "plantar_forefoot"       // Ball of foot
  | "plantar_toes"           // Under toes
  // Heel
  | "heel_center"            // Center of heel pad
  | "heel_medial"            // Inside of heel
  | "heel_lateral"           // Outside of heel
  | "heel_posterior"         // Back of heel (Achilles insertion area)
  // Midfoot
  | "midfoot_dorsal"         // Top of midfoot
  | "midfoot_medial"         // Inside arch area
  | "midfoot_lateral"        // Outside midfoot
  // Forefoot
  | "metatarsal_heads"       // Ball of foot bones
  | "first_mtp"              // Big toe joint
  | "lesser_mtp"             // Other toe joints
  // Toes
  | "big_toe"
  | "second_toe"
  | "lesser_toes"
  | "between_toes"
  // Ankle border
  | "medial_ankle"           // Inside ankle bone area
  | "lateral_ankle";         // Outside ankle bone area

export const FOOT_PAIN_LOCATION_LABELS: Record<FootPainLocation, string> = {
  // Plantar
  plantar_heel: "Bottom of heel (plantar)",
  plantar_arch: "Arch (plantar)",
  plantar_midfoot: "Middle of sole",
  plantar_forefoot: "Ball of foot",
  plantar_toes: "Under toes",
  // Heel
  heel_center: "Center of heel pad",
  heel_medial: "Inside of heel",
  heel_lateral: "Outside of heel",
  heel_posterior: "Back of heel",
  // Midfoot
  midfoot_dorsal: "Top of midfoot",
  midfoot_medial: "Inside arch (top)",
  midfoot_lateral: "Outside midfoot",
  // Forefoot
  metatarsal_heads: "Ball of foot (metatarsals)",
  first_mtp: "Big toe joint",
  lesser_mtp: "Lesser toe joints",
  // Toes
  big_toe: "Big toe",
  second_toe: "Second toe",
  lesser_toes: "Other toes (3-5)",
  between_toes: "Between toes",
  // Ankle border
  medial_ankle: "Inside ankle area",
  lateral_ankle: "Outside ankle area",
};

export const FOOT_PAIN_LOCATION_CATEGORIES = [
  {
    label: "Plantar (Bottom)",
    locations: ["plantar_heel", "plantar_arch", "plantar_midfoot", "plantar_forefoot", "plantar_toes"] as FootPainLocation[],
  },
  {
    label: "Heel",
    locations: ["heel_center", "heel_medial", "heel_lateral", "heel_posterior"] as FootPainLocation[],
  },
  {
    label: "Midfoot",
    locations: ["midfoot_dorsal", "midfoot_medial", "midfoot_lateral"] as FootPainLocation[],
  },
  {
    label: "Forefoot & Ball",
    locations: ["metatarsal_heads", "first_mtp", "lesser_mtp"] as FootPainLocation[],
  },
  {
    label: "Toes",
    locations: ["big_toe", "second_toe", "lesser_toes", "between_toes"] as FootPainLocation[],
  },
  {
    label: "Ankle Area",
    locations: ["medial_ankle", "lateral_ankle"] as FootPainLocation[],
  },
];

// Foot movement restrictions
export type FootMovementRestriction = 
  // Basic locomotion
  | "walking_flat"
  | "walking_uphill"
  | "walking_downhill"
  | "walking_uneven"
  | "jogging"
  | "running"
  | "sprinting"
  // Specific phases
  | "heel_strike"
  | "toe_off"
  | "push_off"
  // Standing
  | "standing_still"
  | "standing_long"
  | "single_leg_stand"
  // Stairs
  | "stairs_up"
  | "stairs_down"
  // Barefoot
  | "barefoot_walking"
  | "barefoot_standing"
  // Specific movements
  | "toe_raises"
  | "heel_raises"
  | "toe_curls"
  | "foot_doming"
  // Impact
  | "jumping"
  | "landing"
  | "hopping"
  // Position
  | "first_steps_morning"
  | "after_sitting"
  | "end_of_day"
  // Footwear
  | "flat_shoes"
  | "heeled_shoes"
  | "tight_shoes";

export const FOOT_MOVEMENT_LABELS: Record<FootMovementRestriction, string> = {
  walking_flat: "Walking (flat ground)",
  walking_uphill: "Walking uphill",
  walking_downhill: "Walking downhill",
  walking_uneven: "Walking on uneven surfaces",
  jogging: "Jogging",
  running: "Running",
  sprinting: "Sprinting",
  heel_strike: "Heel strike (initial contact)",
  toe_off: "Toe-off (push phase)",
  push_off: "Pushing off",
  standing_still: "Standing still",
  standing_long: "Standing for long periods",
  single_leg_stand: "Single leg standing",
  stairs_up: "Stairs up",
  stairs_down: "Stairs down",
  barefoot_walking: "Walking barefoot",
  barefoot_standing: "Standing barefoot",
  toe_raises: "Toe raises",
  heel_raises: "Heel raises",
  toe_curls: "Toe curls/gripping",
  foot_doming: "Foot doming (short foot)",
  jumping: "Jumping",
  landing: "Landing",
  hopping: "Hopping",
  first_steps_morning: "First steps in morning",
  after_sitting: "After sitting",
  end_of_day: "End of day",
  flat_shoes: "Wearing flat shoes",
  heeled_shoes: "Wearing heeled shoes",
  tight_shoes: "Wearing tight shoes",
};

export const FOOT_MOVEMENT_CATEGORIES = [
  {
    label: "Walking & Running",
    movements: ["walking_flat", "walking_uphill", "walking_downhill", "walking_uneven", "jogging", "running", "sprinting"] as FootMovementRestriction[],
  },
  {
    label: "Gait Phases",
    movements: ["heel_strike", "toe_off", "push_off"] as FootMovementRestriction[],
  },
  {
    label: "Standing",
    movements: ["standing_still", "standing_long", "single_leg_stand"] as FootMovementRestriction[],
  },
  {
    label: "Stairs",
    movements: ["stairs_up", "stairs_down"] as FootMovementRestriction[],
  },
  {
    label: "Barefoot",
    movements: ["barefoot_walking", "barefoot_standing"] as FootMovementRestriction[],
  },
  {
    label: "Foot Exercises",
    movements: ["toe_raises", "heel_raises", "toe_curls", "foot_doming"] as FootMovementRestriction[],
  },
  {
    label: "Impact",
    movements: ["jumping", "landing", "hopping"] as FootMovementRestriction[],
  },
  {
    label: "Timing & Position",
    movements: ["first_steps_morning", "after_sitting", "end_of_day"] as FootMovementRestriction[],
  },
  {
    label: "Footwear",
    movements: ["flat_shoes", "heeled_shoes", "tight_shoes"] as FootMovementRestriction[],
  },
];

// Foot movement patterns for calibration
export const FOOT_MOVEMENT_PATTERNS: MovementPattern[] = [
  { id: "first_steps", name: "First steps", description: "Getting out of bed/chair" },
  { id: "walking", name: "Walking", description: "Normal gait" },
  { id: "running", name: "Running", description: "Jogging/running" },
  { id: "standing", name: "Standing", description: "Static weight bearing" },
  { id: "stairs", name: "Stairs", description: "Up and down stairs" },
  { id: "barefoot", name: "Barefoot", description: "Without shoes" },
  { id: "push_off", name: "Push-off", description: "Toe-off phase of gait" },
  { id: "landing", name: "Landing", description: "Impact absorption" },
];

// Foot-specific issue contexts
export const FOOT_ISSUE_CONTEXTS: IssueContext[] = [
  "first_steps",
  "after_rest",
  "loading",
  "static",
  "impact",
  "fatigue",
  "end_of_day",
  "cold",
  "always",
];

// Foot calibration profile
export interface FootCalibrationProfile extends BaseCalibrationProfile {
  bodyPart: "foot";
  problemZones: {
    zoneIndex: number;
    issueTypes: string[];
    severity: 1 | 2 | 3;
  }[];
  painLocations: FootPainLocation[];
  movementRestrictions: FootMovementRestriction[];
  affectedSide: "left" | "right" | "both";
  usesOrthotics?: boolean;
  typicalFootwear?: "supportive" | "minimal" | "mixed";
}

// Foot readiness
export interface FootReadiness extends BaseReadiness {
  sensations: FootSensation[];
  movementRestrictions: FootMovementRestriction[];
  painLocations?: FootPainLocation[];
  morningStiffnessToday?: boolean;
  firstStepsPain?: number; // 0-10
}

// Foot drills
export type FootDrillId = 
  | "TOE_YOGA"
  | "FOOT_DOMING"
  | "TOWEL_SCRUNCHES"
  | "MARBLE_PICKUPS"
  | "PLANTAR_STRETCH"
  | "CALF_STRETCH_WALL"
  | "FROZEN_BOTTLE_ROLL"
  | "BALL_ROLL"
  | "TOE_SPREADS"
  | "HEEL_RAISES_BILATERAL"
  | "HEEL_RAISES_SINGLE"
  | "TOE_WALKS"
  | "HEEL_WALKS"
  | "ARCH_LIFTS"
  | "ANKLE_CIRCLES";

export const FOOT_DRILLS: Record<FootDrillId, {
  id: FootDrillId;
  title: string;
  intent: string;
  cues: string[];
  dosage: { type: "time" | "reps"; value: number; sets: number; holdSeconds?: number };
  visualKey: string;
}> = {
  TOE_YOGA: {
    id: "TOE_YOGA",
    title: "Toe Yoga",
    intent: "Improve toe independence and control",
    cues: ["Lift big toe, keep others down", "Then reverse", "Slow and controlled", "Both feet"],
    dosage: { type: "reps", value: 10, sets: 3 },
    visualKey: "toe_yoga",
  },
  FOOT_DOMING: {
    id: "FOOT_DOMING",
    title: "Foot Doming (Short Foot)",
    intent: "Activate intrinsic foot muscles",
    cues: ["Seated or standing", "Draw arch up without curling toes", "Feel arch lift", "Hold 5 seconds"],
    dosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5 },
    visualKey: "foot_doming",
  },
  TOWEL_SCRUNCHES: {
    id: "TOWEL_SCRUNCHES",
    title: "Towel Scrunches",
    intent: "Strengthen toe flexors",
    cues: ["Towel flat on floor", "Scrunch toward you with toes", "Release and repeat", "Full range"],
    dosage: { type: "reps", value: 15, sets: 3 },
    visualKey: "towel_scrunches",
  },
  MARBLE_PICKUPS: {
    id: "MARBLE_PICKUPS",
    title: "Marble Pickups",
    intent: "Fine motor control and grip strength",
    cues: ["Pick up marbles with toes", "Transfer to container", "Use all toes", "Both feet"],
    dosage: { type: "reps", value: 10, sets: 2 },
    visualKey: "marble_pickups",
  },
  PLANTAR_STRETCH: {
    id: "PLANTAR_STRETCH",
    title: "Plantar Fascia Stretch",
    intent: "Lengthen plantar fascia",
    cues: ["Pull toes back toward shin", "Feel stretch along arch", "Gentle pressure", "Hold 30 seconds"],
    dosage: { type: "time", value: 30, sets: 3 },
    visualKey: "plantar_stretch",
  },
  CALF_STRETCH_WALL: {
    id: "CALF_STRETCH_WALL",
    title: "Calf Stretch (Wall)",
    intent: "Lengthen gastrocnemius",
    cues: ["Hands on wall", "Back leg straight, heel down", "Lean forward", "Feel calf stretch"],
    dosage: { type: "time", value: 30, sets: 3 },
    visualKey: "calf_stretch_wall",
  },
  FROZEN_BOTTLE_ROLL: {
    id: "FROZEN_BOTTLE_ROLL",
    title: "Frozen Bottle Roll",
    intent: "Massage and reduce inflammation",
    cues: ["Frozen water bottle under foot", "Roll from heel to ball", "Moderate pressure", "2-3 minutes"],
    dosage: { type: "time", value: 120, sets: 1 },
    visualKey: "frozen_bottle_roll",
  },
  BALL_ROLL: {
    id: "BALL_ROLL",
    title: "Ball Roll (Lacrosse/Golf Ball)",
    intent: "Release plantar fascia tension",
    cues: ["Ball under foot", "Roll along arch", "Pause on tender spots", "Moderate pressure"],
    dosage: { type: "time", value: 60, sets: 2 },
    visualKey: "ball_roll",
  },
  TOE_SPREADS: {
    id: "TOE_SPREADS",
    title: "Toe Spreads",
    intent: "Improve toe mobility and spacing",
    cues: ["Spread toes as wide as possible", "Hold 5 seconds", "Relax and repeat", "Use toe spacers if helpful"],
    dosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5 },
    visualKey: "toe_spreads",
  },
  HEEL_RAISES_BILATERAL: {
    id: "HEEL_RAISES_BILATERAL",
    title: "Heel Raises (Both Feet)",
    intent: "Calf and foot strength",
    cues: ["Rise onto toes", "Full height", "Slow lower", "Both feet together"],
    dosage: { type: "reps", value: 15, sets: 3 },
    visualKey: "heel_raises_bilateral",
  },
  HEEL_RAISES_SINGLE: {
    id: "HEEL_RAISES_SINGLE",
    title: "Single Leg Heel Raise",
    intent: "Unilateral calf/foot strength",
    cues: ["One foot only", "Full range", "Control the lowering", "Hold rail for balance"],
    dosage: { type: "reps", value: 12, sets: 3 },
    visualKey: "heel_raises_single",
  },
  TOE_WALKS: {
    id: "TOE_WALKS",
    title: "Toe Walks",
    intent: "Forefoot strength and balance",
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
  ARCH_LIFTS: {
    id: "ARCH_LIFTS",
    title: "Arch Lifts",
    intent: "Strengthen arch muscles",
    cues: ["Standing, feet flat", "Lift arch without curling toes", "Keep toes relaxed", "Hold 3 seconds"],
    dosage: { type: "reps", value: 10, sets: 3, holdSeconds: 3 },
    visualKey: "arch_lifts",
  },
  ANKLE_CIRCLES: {
    id: "ANKLE_CIRCLES",
    title: "Ankle Circles",
    intent: "Mobility and blood flow",
    cues: ["Seated or lying", "Large circles", "Both directions", "Smooth movement"],
    dosage: { type: "reps", value: 10, sets: 2 },
    visualKey: "ankle_circles",
  },
};

// Default plans by mode
export function getFootDefaultPlan(mode: "RESET" | "TRAINING" | "GAME"): FootDrillId[] {
  if (mode === "RESET") {
    return ["ANKLE_CIRCLES", "PLANTAR_STRETCH", "BALL_ROLL", "TOE_SPREADS", "FOOT_DOMING"];
  }
  if (mode === "GAME") {
    return ["ANKLE_CIRCLES", "PLANTAR_STRETCH", "TOE_WALKS", "HEEL_RAISES_BILATERAL"];
  }
  // TRAINING
  return [
    "ANKLE_CIRCLES",
    "PLANTAR_STRETCH",
    "CALF_STRETCH_WALL",
    "FOOT_DOMING",
    "TOE_YOGA",
    "TOWEL_SCRUNCHES",
    "ARCH_LIFTS",
    "HEEL_RAISES_BILATERAL",
    "HEEL_RAISES_SINGLE",
    "TOE_WALKS",
    "HEEL_WALKS",
  ];
}
