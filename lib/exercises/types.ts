/**
 * Exercise Database Types
 * 
 * All exercise descriptions are original content written for this application.
 * Dosage recommendations are based on general principles of movement science.
 */

import { BodyPart } from "../body-parts/types";

// Exercise difficulty/progression level
export type ExerciseLevel = "foundation" | "beginner" | "intermediate" | "advanced" | "athletic";

export const EXERCISE_LEVEL_INFO: Record<ExerciseLevel, { label: string; description: string; order: number }> = {
  foundation: { label: "Foundation", description: "Gentle activation, minimal load", order: 1 },
  beginner: { label: "Beginner", description: "Basic movements, bodyweight", order: 2 },
  intermediate: { label: "Intermediate", description: "Moderate challenge, some load", order: 3 },
  advanced: { label: "Advanced", description: "Challenging, requires good control", order: 4 },
  athletic: { label: "Athletic", description: "Sport-specific, high demand", order: 5 },
};

// Exercise category/type
export type ExerciseCategory = 
  | "activation"      // Wake up muscles, low load
  | "mobility"        // Improve range of motion
  | "flexibility"     // Stretching
  | "stability"       // Control and balance
  | "strength"        // Build capacity
  | "power"           // Explosive movements
  | "endurance"       // Sustained loading
  | "proprioception"  // Body awareness
  | "release"         // Soft tissue work
  | "neural";         // Nerve gliding, etc.

export const EXERCISE_CATEGORY_INFO: Record<ExerciseCategory, { label: string; description: string }> = {
  activation: { label: "Activation", description: "Wake up target muscles with minimal load" },
  mobility: { label: "Mobility", description: "Improve active range of motion" },
  flexibility: { label: "Flexibility", description: "Lengthen tissues through stretching" },
  stability: { label: "Stability", description: "Improve control and joint stability" },
  strength: { label: "Strength", description: "Build muscle capacity and resilience" },
  power: { label: "Power", description: "Develop explosive force production" },
  endurance: { label: "Endurance", description: "Build sustained loading capacity" },
  proprioception: { label: "Proprioception", description: "Improve body awareness and balance" },
  release: { label: "Release", description: "Soft tissue mobilization and massage" },
  neural: { label: "Neural", description: "Nerve mobility and neural tension" },
};

// Dosage types
export type DosageType = "reps" | "time" | "distance";

export interface Dosage {
  type: DosageType;
  value: number;           // reps count, seconds, or meters
  sets: number;
  holdSeconds?: number;    // For isometric holds within reps
  restSeconds?: number;    // Rest between sets
  tempo?: string;          // e.g., "3-1-2" (eccentric-pause-concentric)
}

// Equipment needed
export type Equipment = 
  | "none"
  | "resistance_band"
  | "loop_band"
  | "foam_roller"
  | "lacrosse_ball"
  | "tennis_ball"
  | "towel"
  | "step"
  | "wall"
  | "chair"
  | "stick_dowel"
  | "weight"
  | "kettlebell"
  | "cable"
  | "balance_board"
  | "bosu"
  | "slider"
  | "frozen_bottle";

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  none: "No equipment",
  resistance_band: "Resistance band",
  loop_band: "Loop band",
  foam_roller: "Foam roller",
  lacrosse_ball: "Lacrosse ball",
  tennis_ball: "Tennis ball",
  towel: "Towel",
  step: "Step or stair",
  wall: "Wall",
  chair: "Chair",
  stick_dowel: "Stick or dowel",
  weight: "Dumbbell or weight",
  kettlebell: "Kettlebell",
  cable: "Cable machine",
  balance_board: "Balance board",
  bosu: "BOSU ball",
  slider: "Slider or towel on smooth floor",
  frozen_bottle: "Frozen water bottle",
};

// Position/starting position
export type Position = 
  | "standing"
  | "seated"
  | "supine"        // lying on back
  | "prone"         // lying face down
  | "sidelying"
  | "quadruped"     // hands and knees
  | "half_kneeling"
  | "tall_kneeling"
  | "split_stance"
  | "single_leg";

// Contraindications - when NOT to do this exercise
export interface Contraindication {
  condition: string;
  reason: string;
}

// Progression chain
export interface ProgressionInfo {
  prerequisite?: string;   // Exercise ID that should be mastered first
  nextLevel?: string;      // Exercise ID to progress to
  regressionTips?: string; // How to make it easier
  progressionTips?: string; // How to make it harder
}

// Main Exercise type
export interface Exercise {
  id: string;
  title: string;
  bodyPart: BodyPart;
  category: ExerciseCategory;
  level: ExerciseLevel;
  
  // Description - all original content
  intent: string;              // What this exercise accomplishes
  description: string;         // Full description of the movement
  cues: string[];              // Coaching cues (short, actionable)
  commonMistakes?: string[];   // What to avoid
  
  // Dosage
  defaultDosage: Dosage;
  minDosage?: Dosage;          // For sensitive days
  maxDosage?: Dosage;          // For building capacity
  
  // Requirements
  equipment: Equipment[];
  position: Position;
  
  // Safety
  contraindications?: Contraindication[];
  redFlags?: string[];         // Stop immediately if...
  modifications?: string[];    // Ways to adapt
  
  // Progression
  progression?: ProgressionInfo;
  
  // Targeting
  targetMuscles?: string[];
  targetStructures?: string[]; // e.g., "plantar fascia", "patellar tendon"
  movementTags?: string[];     // Links to movement restrictions
  
  // Media (for future)
  visualKey?: string;
  videoUrl?: string;
  
  // Evidence/source notes (internal, not displayed)
  _evidenceNotes?: string;
}

// Exercise library structure
export interface ExerciseLibrary {
  version: string;
  lastUpdated: string;
  exercises: Record<string, Exercise>;
}

// Utility functions
export function getExercisesByBodyPart(library: ExerciseLibrary, bodyPart: BodyPart): Exercise[] {
  return Object.values(library.exercises).filter(e => e.bodyPart === bodyPart);
}

export function getExercisesByCategory(library: ExerciseLibrary, category: ExerciseCategory): Exercise[] {
  return Object.values(library.exercises).filter(e => e.category === category);
}

export function getExercisesByLevel(library: ExerciseLibrary, level: ExerciseLevel): Exercise[] {
  return Object.values(library.exercises).filter(e => e.level === level);
}

export function getProgressionChain(library: ExerciseLibrary, exerciseId: string): Exercise[] {
  const chain: Exercise[] = [];
  let current = library.exercises[exerciseId];
  
  // Go back to find prerequisites
  const prereqs: Exercise[] = [];
  let prereqId = current?.progression?.prerequisite;
  while (prereqId && library.exercises[prereqId]) {
    prereqs.unshift(library.exercises[prereqId]);
    prereqId = library.exercises[prereqId].progression?.prerequisite;
  }
  
  chain.push(...prereqs);
  if (current) chain.push(current);
  
  // Go forward to find progressions
  let nextId = current?.progression?.nextLevel;
  while (nextId && library.exercises[nextId]) {
    chain.push(library.exercises[nextId]);
    nextId = library.exercises[nextId].progression?.nextLevel;
  }
  
  return chain;
}
