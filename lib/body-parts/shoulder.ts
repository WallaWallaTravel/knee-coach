/**
 * Shoulder specific configuration
 */

import { 
  ROMZone, 
  SensationInfo, 
  MovementPattern, 
  IssueContext,
  BaseCalibrationProfile,
  BaseReadiness,
} from "./types";

// Shoulder ROM zones (multiple planes of motion)
// We'll use flexion as the primary reference (arm raising forward/overhead)
export const SHOULDER_ROM_ZONES: ROMZone[] = [
  { start: 0, end: 30, label: "Arm at side (0-30°)", description: "Resting position" },
  { start: 30, end: 60, label: "Low raise (30-60°)", description: "Reaching forward low" },
  { start: 60, end: 90, label: "Shoulder height (60-90°)", description: "Arm parallel to ground" },
  { start: 90, end: 120, label: "Above shoulder (90-120°)", description: "Reaching up" },
  { start: 120, end: 150, label: "High overhead (120-150°)", description: "Reaching high" },
  { start: 150, end: 180, label: "Full overhead (150-180°)", description: "Arm straight up" },
];

// Additional shoulder movement planes
export type ShoulderMovementPlane = 
  | "flexion"           // Arm forward/up
  | "extension"         // Arm backward
  | "abduction"         // Arm out to side
  | "adduction"         // Arm across body
  | "internal_rotation" // Rotating arm inward
  | "external_rotation" // Rotating arm outward
  | "horizontal_adduction" // Arm across chest
  | "horizontal_abduction"; // Arm back at shoulder height

export const SHOULDER_PLANE_LABELS: Record<ShoulderMovementPlane, string> = {
  flexion: "Flexion (arm forward/up)",
  extension: "Extension (arm backward)",
  abduction: "Abduction (arm out to side)",
  adduction: "Adduction (arm across body)",
  internal_rotation: "Internal rotation (hand behind back)",
  external_rotation: "External rotation (hand away from body)",
  horizontal_adduction: "Horizontal adduction (arm across chest)",
  horizontal_abduction: "Horizontal abduction (arm back)",
};

// Shoulder-specific sensations
export type ShoulderSensation = 
  // Stiffness
  | "stiff"
  | "tight"
  | "restricted"
  | "frozen_feeling"
  // Pain types
  | "achy"
  | "sharp"
  | "burning"
  | "throbbing"
  | "pinching"
  | "catching_pain"
  // Mechanical
  | "clicking"
  | "popping"
  | "grinding"
  | "catching"
  | "clunking"
  // Instability
  | "loose"
  | "slipping"
  | "apprehension"
  // Fatigue/weakness
  | "weak"
  | "fatigued"
  | "heavy"
  // Nerve
  | "tingling"
  | "numbness"
  | "radiating"
  // Positive
  | "nothing"
  | "good";

export const SHOULDER_SENSATION_INFO: Record<ShoulderSensation, SensationInfo> = {
  // Stiffness
  stiff: { label: "Stiff", category: "stiffness" },
  tight: { label: "Tight", category: "stiffness" },
  restricted: { label: "Restricted ROM", category: "stiffness" },
  frozen_feeling: { label: "Frozen feeling", category: "stiffness", warning: true },
  // Pain
  achy: { label: "Achy", category: "pain" },
  sharp: { label: "Sharp", category: "pain", warning: true },
  burning: { label: "Burning", category: "pain", warning: true },
  throbbing: { label: "Throbbing", category: "pain" },
  pinching: { label: "Pinching", category: "pain", warning: true },
  catching_pain: { label: "Catching pain", category: "pain", warning: true },
  // Mechanical
  clicking: { label: "Clicking", category: "mechanical" },
  popping: { label: "Popping", category: "mechanical" },
  grinding: { label: "Grinding", category: "mechanical", warning: true },
  catching: { label: "Catching (mechanical)", category: "mechanical", warning: true },
  clunking: { label: "Clunking", category: "mechanical", warning: true },
  // Instability
  loose: { label: "Feels loose", category: "fatigue", warning: true },
  slipping: { label: "Slipping sensation", category: "fatigue", danger: true },
  apprehension: { label: "Apprehension/fear", category: "fatigue", warning: true },
  // Fatigue
  weak: { label: "Weak", category: "fatigue" },
  fatigued: { label: "Fatigued", category: "fatigue" },
  heavy: { label: "Heavy arm", category: "fatigue" },
  // Nerve
  tingling: { label: "Tingling", category: "nerve", warning: true },
  numbness: { label: "Numbness", category: "nerve", danger: true },
  radiating: { label: "Radiating down arm", category: "nerve", danger: true },
  // Positive
  nothing: { label: "Nothing unusual", category: "positive" },
  good: { label: "Feeling good", category: "positive" },
};

export const SHOULDER_SENSATION_CATEGORIES = [
  {
    id: "stiffness" as const,
    label: "Stiffness & Tightness",
    sensations: ["stiff", "tight", "restricted", "frozen_feeling"] as ShoulderSensation[],
  },
  {
    id: "pain" as const,
    label: "Pain & Discomfort",
    sensations: ["achy", "sharp", "burning", "throbbing", "pinching", "catching_pain"] as ShoulderSensation[],
  },
  {
    id: "mechanical" as const,
    label: "Mechanical Sensations",
    sensations: ["clicking", "popping", "grinding", "catching", "clunking"] as ShoulderSensation[],
  },
  {
    id: "fatigue" as const,
    label: "Stability & Fatigue",
    sensations: ["loose", "slipping", "apprehension", "weak", "fatigued", "heavy"] as ShoulderSensation[],
  },
  {
    id: "nerve" as const,
    label: "Nerve Sensations",
    sensations: ["tingling", "numbness", "radiating"] as ShoulderSensation[],
  },
  {
    id: "positive" as const,
    label: "Positive",
    sensations: ["nothing", "good"] as ShoulderSensation[],
  },
];

// Shoulder pain locations
export type ShoulderPainLocation = 
  // Anterior
  | "front_shoulder"
  | "bicep_tendon"
  | "pec_insertion"
  // Lateral
  | "lateral_deltoid"
  | "subacromial"
  | "ac_joint"
  // Posterior
  | "back_shoulder"
  | "infraspinatus"
  | "posterior_deltoid"
  // Superior
  | "top_shoulder"
  | "trap_upper"
  // Deep/internal
  | "deep_joint"
  | "labrum_area"
  // Radiating
  | "down_arm"
  | "into_neck"
  | "into_scapula";

export const SHOULDER_PAIN_LOCATION_LABELS: Record<ShoulderPainLocation, string> = {
  front_shoulder: "Front of shoulder",
  bicep_tendon: "Bicep tendon (front groove)",
  pec_insertion: "Pec insertion (front/chest)",
  lateral_deltoid: "Side of shoulder (deltoid)",
  subacromial: "Under the bone (subacromial)",
  ac_joint: "Top of shoulder (AC joint)",
  back_shoulder: "Back of shoulder",
  infraspinatus: "Back of shoulder blade",
  posterior_deltoid: "Rear deltoid",
  top_shoulder: "Top of shoulder",
  trap_upper: "Upper trap/neck area",
  deep_joint: "Deep inside joint",
  labrum_area: "Deep, hard to pinpoint",
  down_arm: "Radiating down arm",
  into_neck: "Radiating into neck",
  into_scapula: "Into shoulder blade",
};

export const SHOULDER_PAIN_LOCATION_CATEGORIES = [
  {
    label: "Front (Anterior)",
    locations: ["front_shoulder", "bicep_tendon", "pec_insertion"] as ShoulderPainLocation[],
  },
  {
    label: "Side (Lateral)",
    locations: ["lateral_deltoid", "subacromial", "ac_joint"] as ShoulderPainLocation[],
  },
  {
    label: "Back (Posterior)",
    locations: ["back_shoulder", "infraspinatus", "posterior_deltoid"] as ShoulderPainLocation[],
  },
  {
    label: "Top & Neck",
    locations: ["top_shoulder", "trap_upper"] as ShoulderPainLocation[],
  },
  {
    label: "Deep & Radiating",
    locations: ["deep_joint", "labrum_area", "down_arm", "into_neck", "into_scapula"] as ShoulderPainLocation[],
  },
];

// Shoulder movement restrictions
export type ShoulderMovementRestriction = 
  // Reaching
  | "reaching_overhead"
  | "reaching_behind_back"
  | "reaching_across_body"
  | "reaching_out_to_side"
  | "reaching_forward"
  // Rotation
  | "internal_rotation"
  | "external_rotation"
  | "throwing_motion"
  // Pushing/pulling
  | "pushing"
  | "pulling"
  | "pressing_overhead"
  | "bench_press"
  | "rows"
  // Daily activities
  | "putting_on_shirt"
  | "washing_hair"
  | "sleeping_on_side"
  | "carrying"
  | "lifting"
  // Sport specific
  | "throwing"
  | "swimming"
  | "serving"
  | "swinging";

export const SHOULDER_MOVEMENT_LABELS: Record<ShoulderMovementRestriction, string> = {
  reaching_overhead: "Reaching overhead",
  reaching_behind_back: "Reaching behind back",
  reaching_across_body: "Reaching across body",
  reaching_out_to_side: "Reaching out to side",
  reaching_forward: "Reaching forward",
  internal_rotation: "Internal rotation",
  external_rotation: "External rotation",
  throwing_motion: "Throwing motion",
  pushing: "Pushing",
  pulling: "Pulling",
  pressing_overhead: "Pressing overhead",
  bench_press: "Bench press motion",
  rows: "Rowing motion",
  putting_on_shirt: "Putting on shirt/jacket",
  washing_hair: "Washing hair",
  sleeping_on_side: "Sleeping on that side",
  carrying: "Carrying things",
  lifting: "Lifting objects",
  throwing: "Throwing",
  swimming: "Swimming",
  serving: "Serving (tennis/volleyball)",
  swinging: "Swinging (golf/bat)",
};

export const SHOULDER_MOVEMENT_CATEGORIES = [
  {
    label: "Reaching",
    movements: ["reaching_overhead", "reaching_behind_back", "reaching_across_body", "reaching_out_to_side", "reaching_forward"] as ShoulderMovementRestriction[],
  },
  {
    label: "Rotation",
    movements: ["internal_rotation", "external_rotation", "throwing_motion"] as ShoulderMovementRestriction[],
  },
  {
    label: "Pushing & Pulling",
    movements: ["pushing", "pulling", "pressing_overhead", "bench_press", "rows"] as ShoulderMovementRestriction[],
  },
  {
    label: "Daily Activities",
    movements: ["putting_on_shirt", "washing_hair", "sleeping_on_side", "carrying", "lifting"] as ShoulderMovementRestriction[],
  },
  {
    label: "Sport Specific",
    movements: ["throwing", "swimming", "serving", "swinging"] as ShoulderMovementRestriction[],
  },
];

// Shoulder movement patterns for calibration
export const SHOULDER_MOVEMENT_PATTERNS: MovementPattern[] = [
  // Reaching
  { id: "reaching_overhead", name: "Reaching overhead", description: "Arm straight up" },
  { id: "reaching_behind", name: "Reaching behind back", description: "Hand behind back" },
  { id: "reaching_across", name: "Reaching across body", description: "Arm across chest" },
  // Rotation
  { id: "external_rotation", name: "External rotation", description: "Rotating arm outward" },
  { id: "internal_rotation", name: "Internal rotation", description: "Rotating arm inward" },
  { id: "throwing", name: "Throwing motion", description: "Cocking and throwing" },
  // Pushing/pulling
  { id: "pushing", name: "Pushing", description: "Push-up or pressing motion" },
  { id: "pulling", name: "Pulling", description: "Rowing or pulling motion" },
  { id: "overhead_press", name: "Overhead press", description: "Pressing weight overhead" },
  // Daily
  { id: "dressing", name: "Dressing", description: "Putting on clothes" },
  { id: "washing", name: "Washing hair", description: "Arms overhead in shower" },
  { id: "carrying", name: "Carrying", description: "Holding weight at side" },
];

// Shoulder-specific issue contexts
export const SHOULDER_ISSUE_CONTEXTS: IssueContext[] = [
  "static",
  "loading",
  "unloading",
  "concentric",
  "eccentric",
  "transition",
  "fatigue",
  "cold",
  "after_rest",
  "always",
];

// Shoulder calibration profile
export interface ShoulderCalibrationProfile extends BaseCalibrationProfile {
  bodyPart: "shoulder";
  problemZones: {
    zoneIndex: number;
    plane?: ShoulderMovementPlane;
    issueTypes: string[];
    severity: 1 | 2 | 3;
  }[];
  painLocations: ShoulderPainLocation[];
  movementRestrictions: ShoulderMovementRestriction[];
  dominantSide?: "left" | "right";
  affectedSide: "left" | "right" | "both";
}

// Shoulder readiness
export interface ShoulderReadiness extends BaseReadiness {
  sensations: ShoulderSensation[];
  movementRestrictions: ShoulderMovementRestriction[];
  painLocations?: ShoulderPainLocation[];
  sleptOnShoulder?: boolean;
}

// Shoulder drills
export type ShoulderDrillId = 
  | "PENDULUMS"
  | "PASSIVE_FLEXION"
  | "PASSIVE_ER"
  | "WALL_SLIDES"
  | "SCAPULAR_SQUEEZE"
  | "PRONE_Y"
  | "PRONE_T"
  | "PRONE_W"
  | "SIDELYING_ER"
  | "BAND_PULL_APART"
  | "FACE_PULL"
  | "WALL_ANGELS"
  | "SLEEPER_STRETCH"
  | "CROSS_BODY_STRETCH"
  | "DOORWAY_STRETCH";

export const SHOULDER_DRILLS: Record<ShoulderDrillId, {
  id: ShoulderDrillId;
  title: string;
  intent: string;
  cues: string[];
  dosage: { type: "time" | "reps"; value: number; sets: number; holdSeconds?: number };
  visualKey: string;
}> = {
  PENDULUMS: {
    id: "PENDULUMS",
    title: "Pendulum Swings",
    intent: "Gentle joint mobilization",
    cues: ["Lean forward, arm hanging", "Small circles", "Let gravity do the work", "Relax the shoulder"],
    dosage: { type: "time", value: 60, sets: 2 },
    visualKey: "pendulums",
  },
  PASSIVE_FLEXION: {
    id: "PASSIVE_FLEXION",
    title: "Passive Flexion (Supine)",
    intent: "Restore overhead mobility",
    cues: ["Lie on back", "Use other arm to lift", "Go to comfortable end range", "Relax and breathe"],
    dosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5 },
    visualKey: "passive_flexion",
  },
  PASSIVE_ER: {
    id: "PASSIVE_ER",
    title: "Passive External Rotation",
    intent: "Restore rotation mobility",
    cues: ["Elbow at side, bent 90°", "Use stick or other arm", "Rotate outward gently", "Don't force"],
    dosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5 },
    visualKey: "passive_er",
  },
  WALL_SLIDES: {
    id: "WALL_SLIDES",
    title: "Wall Slides",
    intent: "Controlled overhead movement",
    cues: ["Back against wall", "Arms in 'W' position", "Slide up to 'Y'", "Keep contact with wall"],
    dosage: { type: "reps", value: 10, sets: 3 },
    visualKey: "wall_slides",
  },
  SCAPULAR_SQUEEZE: {
    id: "SCAPULAR_SQUEEZE",
    title: "Scapular Squeeze",
    intent: "Scapular stability",
    cues: ["Squeeze shoulder blades together", "Hold 5 seconds", "Don't shrug", "Chest up"],
    dosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5 },
    visualKey: "scapular_squeeze",
  },
  PRONE_Y: {
    id: "PRONE_Y",
    title: "Prone Y Raise",
    intent: "Lower trap activation",
    cues: ["Lie face down", "Arms in Y position", "Lift thumbs to ceiling", "Squeeze shoulder blades"],
    dosage: { type: "reps", value: 10, sets: 3, holdSeconds: 3 },
    visualKey: "prone_y",
  },
  PRONE_T: {
    id: "PRONE_T",
    title: "Prone T Raise",
    intent: "Mid trap activation",
    cues: ["Lie face down", "Arms out to sides (T)", "Lift thumbs to ceiling", "Squeeze shoulder blades"],
    dosage: { type: "reps", value: 10, sets: 3, holdSeconds: 3 },
    visualKey: "prone_t",
  },
  PRONE_W: {
    id: "PRONE_W",
    title: "Prone W Raise",
    intent: "Rotator cuff activation",
    cues: ["Lie face down", "Elbows bent, arms in W", "Lift and rotate thumbs up", "External rotation focus"],
    dosage: { type: "reps", value: 10, sets: 3, holdSeconds: 3 },
    visualKey: "prone_w",
  },
  SIDELYING_ER: {
    id: "SIDELYING_ER",
    title: "Sidelying External Rotation",
    intent: "Rotator cuff strengthening",
    cues: ["Lie on unaffected side", "Elbow at side, bent 90°", "Rotate forearm up", "Control the lowering"],
    dosage: { type: "reps", value: 15, sets: 3 },
    visualKey: "sidelying_er",
  },
  BAND_PULL_APART: {
    id: "BAND_PULL_APART",
    title: "Band Pull Apart",
    intent: "Posterior shoulder strength",
    cues: ["Hold band at shoulder width", "Arms straight in front", "Pull apart to chest", "Squeeze shoulder blades"],
    dosage: { type: "reps", value: 15, sets: 3 },
    visualKey: "band_pull_apart",
  },
  FACE_PULL: {
    id: "FACE_PULL",
    title: "Face Pull",
    intent: "External rotator and trap strength",
    cues: ["Pull band to face", "Elbows high", "Rotate hands back", "Squeeze at end"],
    dosage: { type: "reps", value: 15, sets: 3 },
    visualKey: "face_pull",
  },
  WALL_ANGELS: {
    id: "WALL_ANGELS",
    title: "Wall Angels",
    intent: "Overhead mobility with control",
    cues: ["Back flat against wall", "Arms in 'goal post' position", "Slide up and down", "Keep contact with wall"],
    dosage: { type: "reps", value: 10, sets: 3 },
    visualKey: "wall_angels",
  },
  SLEEPER_STRETCH: {
    id: "SLEEPER_STRETCH",
    title: "Sleeper Stretch",
    intent: "Internal rotation mobility",
    cues: ["Lie on affected side", "Elbow at 90°, arm forward", "Gently push hand down", "Stop at first resistance"],
    dosage: { type: "time", value: 30, sets: 3 },
    visualKey: "sleeper_stretch",
  },
  CROSS_BODY_STRETCH: {
    id: "CROSS_BODY_STRETCH",
    title: "Cross Body Stretch",
    intent: "Posterior capsule stretch",
    cues: ["Pull arm across body", "Use other hand above elbow", "Keep shoulder down", "Gentle stretch"],
    dosage: { type: "time", value: 30, sets: 3 },
    visualKey: "cross_body_stretch",
  },
  DOORWAY_STRETCH: {
    id: "DOORWAY_STRETCH",
    title: "Doorway Pec Stretch",
    intent: "Anterior shoulder/pec flexibility",
    cues: ["Forearm on door frame", "Step through gently", "Feel stretch in chest/front shoulder", "Try different arm heights"],
    dosage: { type: "time", value: 30, sets: 3 },
    visualKey: "doorway_stretch",
  },
};

// Default plans by mode
export function getShoulderDefaultPlan(mode: "RESET" | "TRAINING" | "GAME"): ShoulderDrillId[] {
  if (mode === "RESET") {
    return ["PENDULUMS", "PASSIVE_FLEXION", "PASSIVE_ER", "SCAPULAR_SQUEEZE", "CROSS_BODY_STRETCH"];
  }
  if (mode === "GAME") {
    return ["PENDULUMS", "WALL_SLIDES", "BAND_PULL_APART", "DOORWAY_STRETCH"];
  }
  // TRAINING
  return [
    "WALL_SLIDES",
    "SCAPULAR_SQUEEZE",
    "PRONE_Y",
    "PRONE_T",
    "PRONE_W",
    "SIDELYING_ER",
    "BAND_PULL_APART",
    "FACE_PULL",
    "SLEEPER_STRETCH",
    "CROSS_BODY_STRETCH",
  ];
}
