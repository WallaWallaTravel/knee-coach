/**
 * Body Parts Module - Multi-region rehabilitation support
 */

// Shared types
export * from "./types";

// Body part specific modules
export * from "./knee";
export * from "./achilles";
export * from "./shoulder";
export * from "./foot";

import { BodyPart, Mode, BaseCoachState } from "./types";
import { 
  KneeReadiness, 
  KneeSensation, 
  KNEE_SENSATION_INFO,
  getKneeDefaultPlan,
  KneeDrillId,
} from "./knee";
import { 
  AchillesReadiness, 
  AchillesSensation, 
  ACHILLES_SENSATION_INFO,
  getAchillesDefaultPlan,
  AchillesDrillId,
} from "./achilles";
import { 
  ShoulderReadiness, 
  ShoulderSensation, 
  SHOULDER_SENSATION_INFO,
  getShoulderDefaultPlan,
  ShoulderDrillId,
} from "./shoulder";
import { 
  FootReadiness, 
  FootSensation, 
  FOOT_SENSATION_INFO,
  getFootDefaultPlan,
  FootDrillId,
} from "./foot";

// Union types for all body parts
export type AnyReadiness = KneeReadiness | AchillesReadiness | ShoulderReadiness | FootReadiness;
export type AnySensation = KneeSensation | AchillesSensation | ShoulderSensation | FootSensation;
export type AnyDrillId = KneeDrillId | AchillesDrillId | ShoulderDrillId | FootDrillId;

// Helper to check for dangerous sensations across any body part
export function hasDangerousSensations(bodyPart: BodyPart, sensations: string[]): boolean {
  const infoMap = {
    knee: KNEE_SENSATION_INFO,
    achilles: ACHILLES_SENSATION_INFO,
    shoulder: SHOULDER_SENSATION_INFO,
    foot: FOOT_SENSATION_INFO,
  }[bodyPart];
  
  return sensations.some(s => (infoMap as Record<string, { danger?: boolean }>)[s]?.danger);
}

// Helper to check for warning sensations across any body part
export function hasWarningSensations(bodyPart: BodyPart, sensations: string[]): boolean {
  const infoMap = {
    knee: KNEE_SENSATION_INFO,
    achilles: ACHILLES_SENSATION_INFO,
    shoulder: SHOULDER_SENSATION_INFO,
    foot: FOOT_SENSATION_INFO,
  }[bodyPart];
  
  return sensations.some(s => (infoMap as Record<string, { warning?: boolean }>)[s]?.warning);
}

// Generic mode decision logic
export function decideMode(
  bodyPart: BodyPart,
  readiness: AnyReadiness
): { mode: Mode; reasoning: string } {
  const { confidence, restingDiscomfort, activityGoal, sensations } = readiness;
  
  // RESET triggers - safety first (shared across all body parts)
  if (confidence < 4) {
    return { mode: "RESET", reasoning: "Low confidence. Focus on restoring trust." };
  }
  if (restingDiscomfort > 5) {
    return { mode: "RESET", reasoning: "Significant resting discomfort. Let's calm things down." };
  }
  if (hasDangerousSensations(bodyPart, sensations)) {
    return { mode: "RESET", reasoning: "Concerning sensations reported. Taking it easy today." };
  }
  
  // GAME triggers - ready to perform
  if (activityGoal === "game") {
    if (confidence >= 7 && !hasWarningSensations(bodyPart, sensations) && restingDiscomfort <= 2) {
      return { mode: "GAME", reasoning: "Game day prep. Quick activation, no deep loading." };
    }
    return { mode: "TRAINING", reasoning: "Not quite ready for game intensity. Smart training instead." };
  }
  
  // REST goal
  if (activityGoal === "rest") {
    return { mode: "RESET", reasoning: "Rest day selected. Light movement to maintain mobility." };
  }
  
  // TRAINING (default) - build capacity
  if (confidence >= 7 && !hasWarningSensations(bodyPart, sensations) && restingDiscomfort <= 2) {
    return { mode: "TRAINING", reasoning: "Feeling solid. Full training protocol." };
  }
  
  if (confidence >= 5 && !hasWarningSensations(bodyPart, sensations)) {
    return { mode: "TRAINING", reasoning: "Moderate confidence. Training with attention to feedback." };
  }
  
  if (confidence >= 5 && hasWarningSensations(bodyPart, sensations)) {
    return { mode: "TRAINING", reasoning: "Some sensations to monitor. Modified training." };
  }
  
  return { mode: "RESET", reasoning: "Taking it easy today. Build the foundation." };
}

// Get default plan for any body part
export function getDefaultPlan(bodyPart: BodyPart, mode: Mode): string[] {
  switch (bodyPart) {
    case "knee":
      return getKneeDefaultPlan(mode);
    case "achilles":
      return getAchillesDefaultPlan(mode);
    case "shoulder":
      return getShoulderDefaultPlan(mode);
    case "foot":
      return getFootDefaultPlan(mode);
    default:
      return [];
  }
}

// Initialize coach state for any body part
export function initCoachState(
  bodyPart: BodyPart,
  readiness: AnyReadiness
): BaseCoachState {
  const { mode, reasoning } = decideMode(bodyPart, readiness);
  const plan = getDefaultPlan(bodyPart, mode);
  
  return {
    mode,
    plan,
    painStop: mode === "GAME" ? 4 : 5,
    painRegress: 3,
    reasoning,
  };
}
