/**
 * Configuration that drives per-body-part differences in the unified CheckInPage.
 */
import { BodyPart, SensationInfo } from "@/lib/body-parts/types";
import {
  KneeSensation,
  KNEE_SENSATION_INFO,
  KNEE_SENSATION_CATEGORIES,
  KNEE_ROM_ZONES,
  KNEE_PAIN_LOCATION_LABELS,
  KNEE_PAIN_LOCATION_CATEGORIES,
  KNEE_MOVEMENT_LABELS,
  KNEE_MOVEMENT_CATEGORIES,
  type KneeCalibrationProfile,
} from "@/lib/body-parts/knee";
import {
  ACHILLES_SENSATION_INFO,
  ACHILLES_SENSATION_CATEGORIES,
  ACHILLES_ROM_ZONES,
  ACHILLES_PAIN_LOCATION_LABELS,
  ACHILLES_PAIN_LOCATION_CATEGORIES,
  ACHILLES_MOVEMENT_LABELS,
  ACHILLES_MOVEMENT_CATEGORIES,
  type AchillesCalibrationProfile,
} from "@/lib/body-parts/achilles";
import {
  SHOULDER_SENSATION_INFO,
  SHOULDER_SENSATION_CATEGORIES,
  SHOULDER_ROM_ZONES,
  SHOULDER_PAIN_LOCATION_LABELS,
  SHOULDER_PAIN_LOCATION_CATEGORIES,
  SHOULDER_MOVEMENT_LABELS,
  SHOULDER_MOVEMENT_CATEGORIES,
  type ShoulderCalibrationProfile,
} from "@/lib/body-parts/shoulder";
import {
  FOOT_SENSATION_INFO,
  FOOT_SENSATION_CATEGORIES,
  FOOT_FUNCTIONAL_ZONES,
  FOOT_PAIN_LOCATION_LABELS,
  FOOT_PAIN_LOCATION_CATEGORIES,
  FOOT_MOVEMENT_LABELS,
  FOOT_MOVEMENT_CATEGORIES,
  type FootCalibrationProfile,
} from "@/lib/body-parts/foot";

export type SensationMode = "flat" | "categorized";

export type SpecialCheck = "givingWay" | "morningStiffness" | "sleptOnShoulder" | "firstStepsPain";

// Flat sensation option (for knee's simplified check-in)
export interface FlatSensationOption {
  id: string;
  label: string;
  warning?: boolean;
  danger?: boolean;
}

export interface BodyPartCheckInConfig {
  sensationMode: SensationMode;
  hasMovementInput: boolean;
  hasPainLocationInput: boolean;
  specialChecks: SpecialCheck[];
  exerciseTerm: string;
  confidenceQuestion: string;
  discomfortQuestion: string;
  // Data accessors
  sensationInfo: Record<string, SensationInfo>;
  sensationCategories: { id: string; label: string; sensations: string[] }[];
  romZones: { start: number; end: number; label: string; description?: string }[];
  painLocationLabels: Record<string, string>;
  painLocationCategories: { label: string; locations: string[] }[];
  movementLabels: Record<string, string>;
  movementCategories: { label: string; movements: string[] }[];
  // Flat sensation options (only for knee)
  flatSensationOptions?: FlatSensationOption[];
  // Default expanded categories
  defaultExpandedSensationCategories: string[];
  defaultExpandedMovementCategories: string[];
}

export type AnyCalibrationProfile =
  | KneeCalibrationProfile
  | AchillesCalibrationProfile
  | ShoulderCalibrationProfile
  | FootCalibrationProfile;

const KNEE_FLAT_SENSATIONS: FlatSensationOption[] = [
  { id: "good", label: "Feeling good" },
  { id: "stiff", label: "Stiff" },
  { id: "achy", label: "Achy" },
  { id: "sharp", label: "Sharp pain", warning: true },
  { id: "unstable", label: "Unstable", warning: true },
  { id: "giving_way", label: "Giving way", danger: true },
  { id: "catching", label: "Catching", warning: true },
  { id: "locking", label: "Locking", danger: true },
];

export const BODY_PART_CHECK_IN_CONFIG: Record<BodyPart, BodyPartCheckInConfig> = {
  knee: {
    sensationMode: "flat",
    hasMovementInput: false,
    hasPainLocationInput: false,
    specialChecks: ["givingWay"],
    exerciseTerm: "exercises",
    confidenceQuestion: "How much do you trust your knee right now?",
    discomfortQuestion: "Any discomfort right now, just sitting?",
    sensationInfo: KNEE_SENSATION_INFO,
    sensationCategories: KNEE_SENSATION_CATEGORIES as { id: string; label: string; sensations: string[] }[],
    romZones: KNEE_ROM_ZONES,
    painLocationLabels: KNEE_PAIN_LOCATION_LABELS,
    painLocationCategories: KNEE_PAIN_LOCATION_CATEGORIES as { label: string; locations: string[] }[],
    movementLabels: KNEE_MOVEMENT_LABELS,
    movementCategories: KNEE_MOVEMENT_CATEGORIES as { label: string; movements: string[] }[],
    flatSensationOptions: KNEE_FLAT_SENSATIONS,
    defaultExpandedSensationCategories: ["pain", "mechanical"],
    defaultExpandedMovementCategories: [],
  },
  achilles: {
    sensationMode: "categorized",
    hasMovementInput: true,
    hasPainLocationInput: true,
    specialChecks: ["morningStiffness"],
    exerciseTerm: "exercises",
    confidenceQuestion: "How much do you trust your Achilles right now?",
    discomfortQuestion: "Any discomfort right now, just sitting?",
    sensationInfo: ACHILLES_SENSATION_INFO,
    sensationCategories: ACHILLES_SENSATION_CATEGORIES as { id: string; label: string; sensations: string[] }[],
    romZones: ACHILLES_ROM_ZONES,
    painLocationLabels: ACHILLES_PAIN_LOCATION_LABELS,
    painLocationCategories: ACHILLES_PAIN_LOCATION_CATEGORIES as { label: string; locations: string[] }[],
    movementLabels: ACHILLES_MOVEMENT_LABELS,
    movementCategories: ACHILLES_MOVEMENT_CATEGORIES as { label: string; movements: string[] }[],
    defaultExpandedSensationCategories: ["pain", "mechanical"],
    defaultExpandedMovementCategories: ["Calf Loading"],
  },
  shoulder: {
    sensationMode: "categorized",
    hasMovementInput: true,
    hasPainLocationInput: true,
    specialChecks: ["sleptOnShoulder"],
    exerciseTerm: "exercises",
    confidenceQuestion: "How much do you trust your shoulder right now?",
    discomfortQuestion: "Any discomfort right now, arm at rest?",
    sensationInfo: SHOULDER_SENSATION_INFO,
    sensationCategories: SHOULDER_SENSATION_CATEGORIES as { id: string; label: string; sensations: string[] }[],
    romZones: SHOULDER_ROM_ZONES,
    painLocationLabels: SHOULDER_PAIN_LOCATION_LABELS,
    painLocationCategories: SHOULDER_PAIN_LOCATION_CATEGORIES as { label: string; locations: string[] }[],
    movementLabels: SHOULDER_MOVEMENT_LABELS,
    movementCategories: SHOULDER_MOVEMENT_CATEGORIES as { label: string; movements: string[] }[],
    defaultExpandedSensationCategories: ["pain", "mechanical"],
    defaultExpandedMovementCategories: ["Reaching"],
  },
  foot: {
    sensationMode: "categorized",
    hasMovementInput: true,
    hasPainLocationInput: true,
    specialChecks: ["morningStiffness", "firstStepsPain"],
    exerciseTerm: "exercises",
    confidenceQuestion: "How much do you trust your foot right now?",
    discomfortQuestion: "Any discomfort right now, feet up?",
    sensationInfo: FOOT_SENSATION_INFO,
    sensationCategories: FOOT_SENSATION_CATEGORIES as { id: string; label: string; sensations: string[] }[],
    romZones: FOOT_FUNCTIONAL_ZONES,
    painLocationLabels: FOOT_PAIN_LOCATION_LABELS,
    painLocationCategories: FOOT_PAIN_LOCATION_CATEGORIES as { label: string; locations: string[] }[],
    movementLabels: FOOT_MOVEMENT_LABELS,
    movementCategories: FOOT_MOVEMENT_CATEGORIES as { label: string; movements: string[] }[],
    defaultExpandedSensationCategories: ["pain", "stiffness"],
    defaultExpandedMovementCategories: ["Walking & Running", "Timing & Position"],
  },
};
