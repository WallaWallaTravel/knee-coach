/**
 * Exercise Library Index
 * 
 * All exercises are original content with evidence-based dosing.
 */

export * from "./types";
export * from "./knee-exercises";
export * from "./achilles-exercises";
export * from "./shoulder-exercises";
export * from "./foot-exercises";

import { Exercise, ExerciseLibrary, ExerciseLevel, ExerciseCategory } from "./types";
import { KNEE_EXERCISES, KNEE_EXERCISE_COUNT } from "./knee-exercises";
import { ACHILLES_EXERCISES, ACHILLES_EXERCISE_COUNT } from "./achilles-exercises";
import { SHOULDER_EXERCISES, SHOULDER_EXERCISE_COUNT } from "./shoulder-exercises";
import { FOOT_EXERCISES, FOOT_EXERCISE_COUNT } from "./foot-exercises";
import { BodyPart } from "../body-parts/types";

// Combined library
export const EXERCISE_LIBRARY: ExerciseLibrary = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  exercises: {
    ...KNEE_EXERCISES,
    ...ACHILLES_EXERCISES,
    ...SHOULDER_EXERCISES,
    ...FOOT_EXERCISES,
  }
};

// Exercise counts by body part
export const EXERCISE_COUNTS: Record<BodyPart, number> = {
  knee: KNEE_EXERCISE_COUNT,
  achilles: ACHILLES_EXERCISE_COUNT,
  shoulder: SHOULDER_EXERCISE_COUNT,
  foot: FOOT_EXERCISE_COUNT,
};

// Total exercise count
export const TOTAL_EXERCISE_COUNT = 
  KNEE_EXERCISE_COUNT + 
  ACHILLES_EXERCISE_COUNT + 
  SHOULDER_EXERCISE_COUNT + 
  FOOT_EXERCISE_COUNT;

// Utility to get all exercises as array
export function getAllExercises(): Exercise[] {
  return Object.values(EXERCISE_LIBRARY.exercises);
}

// Get exercise by ID
export function getExercise(id: string): Exercise | undefined {
  return EXERCISE_LIBRARY.exercises[id];
}

// Get exercises by body part
export function getExercisesByBodyPart(bodyPart: BodyPart): Exercise[] {
  return Object.values(EXERCISE_LIBRARY.exercises).filter(e => e.bodyPart === bodyPart);
}

// Get exercises by category
export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return Object.values(EXERCISE_LIBRARY.exercises).filter(e => e.category === category);
}

// Get exercises by level
export function getExercisesByLevel(level: ExerciseLevel): Exercise[] {
  return Object.values(EXERCISE_LIBRARY.exercises).filter(e => e.level === level);
}

// Get exercises by body part and level
export function getExercisesByBodyPartAndLevel(bodyPart: BodyPart, level: ExerciseLevel): Exercise[] {
  return Object.values(EXERCISE_LIBRARY.exercises).filter(
    e => e.bodyPart === bodyPart && e.level === level
  );
}

// Get exercises by body part and category
export function getExercisesByBodyPartAndCategory(bodyPart: BodyPart, category: ExerciseCategory): Exercise[] {
  return Object.values(EXERCISE_LIBRARY.exercises).filter(
    e => e.bodyPart === bodyPart && e.category === category
  );
}

// Get progression chain for an exercise
export function getProgressionChain(exerciseId: string): Exercise[] {
  const chain: Exercise[] = [];
  const library = EXERCISE_LIBRARY;
  let current = library.exercises[exerciseId];
  
  if (!current) return chain;
  
  // Go back to find prerequisites
  const prereqs: Exercise[] = [];
  let prereqId = current.progression?.prerequisite;
  while (prereqId && library.exercises[prereqId]) {
    prereqs.unshift(library.exercises[prereqId]);
    prereqId = library.exercises[prereqId].progression?.prerequisite;
  }
  
  chain.push(...prereqs);
  chain.push(current);
  
  // Go forward to find progressions
  let nextId = current.progression?.nextLevel;
  while (nextId && library.exercises[nextId]) {
    chain.push(library.exercises[nextId]);
    nextId = library.exercises[nextId].progression?.nextLevel;
  }
  
  return chain;
}

// Search exercises by keyword
export function searchExercises(query: string, bodyPart?: BodyPart): Exercise[] {
  const lowerQuery = query.toLowerCase();
  let exercises = getAllExercises();
  
  if (bodyPart) {
    exercises = exercises.filter(e => e.bodyPart === bodyPart);
  }
  
  return exercises.filter(e => 
    e.title.toLowerCase().includes(lowerQuery) ||
    e.intent.toLowerCase().includes(lowerQuery) ||
    e.description.toLowerCase().includes(lowerQuery) ||
    e.targetMuscles?.some(m => m.toLowerCase().includes(lowerQuery)) ||
    e.targetStructures?.some(s => s.toLowerCase().includes(lowerQuery))
  );
}

// Get recommended exercises based on readiness mode
export function getExercisesForMode(
  bodyPart: BodyPart, 
  mode: "RESET" | "TRAINING" | "GAME"
): Exercise[] {
  const exercises = getExercisesByBodyPart(bodyPart);
  
  switch (mode) {
    case "RESET":
      // Foundation and beginner, focus on activation and mobility
      return exercises.filter(e => 
        (e.level === "foundation" || e.level === "beginner") &&
        (e.category === "activation" || e.category === "mobility" || e.category === "flexibility" || e.category === "release")
      );
    
    case "TRAINING":
      // Beginner through advanced, all categories
      return exercises.filter(e => 
        e.level !== "athletic" // Exclude athletic level
      );
    
    case "GAME":
      // Intermediate through athletic, focus on activation and power
      return exercises.filter(e => 
        (e.level === "intermediate" || e.level === "advanced" || e.level === "athletic") &&
        (e.category === "activation" || e.category === "power" || e.category === "proprioception")
      );
    
    default:
      return exercises;
  }
}
