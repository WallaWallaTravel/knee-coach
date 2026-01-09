export type Mode = "RESET" | "TRAINING" | "GAME";

// Movement restrictions that users can report
export type MovementRestriction =
  // Squat/bend patterns
  | "deep_squat"
  | "partial_squat"
  | "reverse_direction"        // changing direction mid-bend (concentric to eccentric)
  | "eccentric_loading"        // lowering under load
  | "kneeling"
  // Stairs & steps
  | "stairs_down"
  | "stairs_up"
  | "step_over"
  // Dynamic/athletic - deceleration & direction change
  | "deceleration"             // slowing down quickly
  | "hard_stop"                // stopping from speed
  | "direction_reversal"       // changing direction dynamically
  | "reactive_cuts"            // unplanned direction changes
  // Dynamic/athletic - other
  | "jumping"
  | "landing"
  | "running"
  | "sprinting"
  | "lateral_cuts"
  | "pivoting"
  | "backpedaling"
  // Single leg
  | "single_leg_stance"
  | "single_leg_loading"       // weight on one leg under load
  | "lunging"
  // Sitting/standing
  | "sit_to_stand"
  | "prolonged_sitting"
  | "prolonged_standing"
  | "prolonged_bent";          // staying in bent position

export const MOVEMENT_RESTRICTION_LABELS: Record<MovementRestriction, string> = {
  // Squat/bend patterns
  deep_squat: "Deep squat",
  partial_squat: "Partial squat (45-90°)",
  reverse_direction: "Reversing mid-bend",
  eccentric_loading: "Lowering under load (eccentric)",
  kneeling: "Kneeling",
  // Stairs & steps
  stairs_down: "Stairs down",
  stairs_up: "Stairs up",
  step_over: "Stepping over things",
  // Deceleration & direction change
  deceleration: "Slowing down",
  hard_stop: "Hard stop from speed",
  direction_reversal: "Reversing direction dynamically",
  reactive_cuts: "Reactive/unplanned cuts",
  // Dynamic/athletic - other
  jumping: "Jumping",
  landing: "Landing",
  running: "Running",
  sprinting: "Sprinting",
  lateral_cuts: "Lateral cuts (planned)",
  pivoting: "Pivoting/turning",
  backpedaling: "Backpedaling",
  // Single leg
  single_leg_stance: "Single leg balance",
  single_leg_loading: "Single leg under load",
  lunging: "Lunging",
  // Sitting/standing
  sit_to_stand: "Sit to stand",
  prolonged_sitting: "Sitting too long",
  prolonged_standing: "Standing too long",
  prolonged_bent: "Staying bent (e.g., athletic stance)",
};

// Group movements by category for UI
export const MOVEMENT_CATEGORIES: { label: string; movements: MovementRestriction[] }[] = [
  {
    label: "Bending & Squatting",
    movements: ["deep_squat", "partial_squat", "reverse_direction", "eccentric_loading", "kneeling", "sit_to_stand"],
  },
  {
    label: "Stairs & Steps",
    movements: ["stairs_down", "stairs_up", "step_over"],
  },
  {
    label: "Deceleration & Direction Change",
    movements: ["deceleration", "hard_stop", "direction_reversal", "reactive_cuts"],
  },
  {
    label: "Dynamic & Athletic",
    movements: ["jumping", "landing", "running", "sprinting", "lateral_cuts", "pivoting", "backpedaling"],
  },
  {
    label: "Single Leg & Balance",
    movements: ["single_leg_stance", "single_leg_loading", "lunging"],
  },
  {
    label: "Prolonged Positions",
    movements: ["prolonged_sitting", "prolonged_standing", "prolonged_bent"],
  },
];

export type DrillId =
  | "FOOT_TRIPOD"
  | "GLUTE_BRIDGE_HEEL_DRAG"
  | "HAM_QUAD_COCONTRACT"
  | "WALL_BOW"
  | "SPANISH_SQUAT_MICRO"
  | "STEP_DOWN_SUPPORTED"
  | "QUAD_SET"
  | "HEEL_SLIDES";

export type Drill = {
  id: DrillId;
  title: string;
  intent: string;
  cues: string[];
  dosage: { type: "time" | "reps"; value: number; sets: number; holdSeconds?: number };
  regressions?: DrillId[];
  progressions?: DrillId[];
  visualKey: string;
  // Movement tags - drills will be skipped if user reports these as restricted
  movementTags?: MovementRestriction[];
};

export const DRILLS: Record<DrillId, Drill> = {
  FOOT_TRIPOD: {
    id: "FOOT_TRIPOD",
    title: "Foot Tripod",
    intent: "Lock arch + reduce tibial IR",
    cues: ["Big toe + pinky + heel heavy", "Lift arch without curling toes", "Knee tracks over 2nd toe"],
    dosage: { type: "time", value: 60, sets: 2 },
    visualKey: "foot_tripod",
    // No movement tags - safe for all restrictions
  },
  GLUTE_BRIDGE_HEEL_DRAG: {
    id: "GLUTE_BRIDGE_HEEL_DRAG",
    title: "Glute Bridge + Heel Drag",
    intent: "Ham/glute co-activation to check tibial glide",
    cues: ["Heels heavy", "Try to drag heels toward butt (no movement)", "Hips up; ribs down"],
    dosage: { type: "reps", value: 8, sets: 2, holdSeconds: 5 },
    visualKey: "bridge_heeldrag",
    // No movement tags - safe for all restrictions
  },
  HAM_QUAD_COCONTRACT: {
    id: "HAM_QUAD_COCONTRACT",
    title: "Ham–Quad Co-Contraction (35–45°)",
    intent: "Stabilize the danger arc",
    cues: ["Knee ~40°", "Front heel down + pull back", "Kneecap up & in (VMO)"],
    dosage: { type: "time", value: 10, sets: 5 },
    visualKey: "cocontract_40deg",
    // No movement tags - controlled position
  },
  WALL_BOW: {
    id: "WALL_BOW",
    title: "Wall Bow (Front Leg Heel Drag)",
    intent: "Tibial control under closed-chain tension",
    cues: ["Front heel down + pull back", "Small knee bend", "Rear leg = balance only"],
    dosage: { type: "time", value: 40, sets: 3 },
    visualKey: "wall_bow",
    // No movement tags - controlled position
  },
  SPANISH_SQUAT_MICRO: {
    id: "SPANISH_SQUAT_MICRO",
    title: "Spanish Squat (Micro 35–45°)",
    intent: "Load mid-arc without shear",
    cues: ["Band behind knees", "Only 35–45° range", "Slow; no sharp tibial pain"],
    dosage: { type: "reps", value: 8, sets: 3 },
    regressions: ["HAM_QUAD_COCONTRACT", "WALL_BOW"],
    visualKey: "spanish_micro",
    movementTags: ["deep_squat", "partial_squat"], // Skip if squatting is restricted
  },
  STEP_DOWN_SUPPORTED: {
    id: "STEP_DOWN_SUPPORTED",
    title: "Supported Step-Down (Shallow)",
    intent: "Eccentric control without collapse",
    cues: ["Hold rail/stick", "3s down; brief pause", "Keep heel-drag tension"],
    dosage: { type: "reps", value: 6, sets: 2 },
    regressions: ["WALL_BOW"],
    visualKey: "stepdown_supported",
    movementTags: ["stairs_down", "landing", "single_leg_stance"], // Skip if these are restricted
  },
  QUAD_SET: {
    id: "QUAD_SET",
    title: "Quad Set (20–30°)",
    intent: "Wake VMO + reduce inhibition",
    cues: ["Knee slightly bent", "Tighten quad 5s", "No pain spike"],
    dosage: { type: "reps", value: 10, sets: 2, holdSeconds: 5 },
    visualKey: "quad_set",
    // No movement tags - safe for all restrictions
  },
  HEEL_SLIDES: {
    id: "HEEL_SLIDES",
    title: "Heel Slides (Easy Range)",
    intent: "Move fluid without provoking shear",
    cues: ["Smooth and easy", "Stop before pressure/catch", "No forcing depth"],
    dosage: { type: "reps", value: 15, sets: 1 },
    visualKey: "heel_slides",
    // No movement tags - safe for all restrictions
  },
};

export function defaultPlanForMode(mode: Mode): DrillId[] {
  if (mode === "RESET") {
    return ["QUAD_SET", "HEEL_SLIDES", "FOOT_TRIPOD", "GLUTE_BRIDGE_HEEL_DRAG"];
  }
  if (mode === "GAME") {
    return ["FOOT_TRIPOD", "GLUTE_BRIDGE_HEEL_DRAG", "HAM_QUAD_COCONTRACT", "WALL_BOW"];
  }
  return [
    "FOOT_TRIPOD",
    "GLUTE_BRIDGE_HEEL_DRAG",
    "HAM_QUAD_COCONTRACT",
    "WALL_BOW",
    "SPANISH_SQUAT_MICRO",
    "STEP_DOWN_SUPPORTED",
  ];
}
