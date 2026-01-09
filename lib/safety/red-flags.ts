/**
 * Red Flags Safety System
 * 
 * This module identifies symptoms and situations that require
 * immediate medical attention or should stop exercise.
 * 
 * IMPORTANT: This is not medical advice. These are general guidelines
 * to help users recognize when professional evaluation is needed.
 */

import { BodyPart } from "../body-parts/types";

// Severity levels for red flags
export type RedFlagSeverity = 
  | "stop_immediately"    // Stop all activity, seek care today
  | "stop_and_monitor"    // Stop activity, seek care if persists
  | "caution"             // Modify activity, monitor closely
  | "awareness";          // Be aware, may need attention

export interface RedFlag {
  id: string;
  bodyPart: BodyPart | "general";
  severity: RedFlagSeverity;
  title: string;
  description: string;
  symptoms: string[];
  action: string;
  seekCareIf: string;
  possibleCauses?: string[];  // Educational, not diagnostic
}

export const RED_FLAG_SEVERITY_INFO: Record<RedFlagSeverity, {
  label: string;
  color: string;
  icon: string;
  description: string;
}> = {
  stop_immediately: {
    label: "Stop Immediately",
    color: "#dc2626",
    icon: "🚨",
    description: "Stop all activity and seek medical care today"
  },
  stop_and_monitor: {
    label: "Stop & Monitor",
    color: "#ea580c",
    icon: "⚠️",
    description: "Stop activity and seek care if symptoms persist"
  },
  caution: {
    label: "Caution",
    color: "#ca8a04",
    icon: "⚡",
    description: "Modify activity and monitor closely"
  },
  awareness: {
    label: "Awareness",
    color: "#2563eb",
    icon: "ℹ️",
    description: "Be aware and consider professional evaluation"
  }
};

// ============================================
// GENERAL RED FLAGS (All Body Parts)
// ============================================

export const GENERAL_RED_FLAGS: RedFlag[] = [
  {
    id: "GEN_SEVERE_PAIN",
    bodyPart: "general",
    severity: "stop_immediately",
    title: "Severe Pain",
    description: "Pain rated 8-10/10 that doesn't improve with rest",
    symptoms: [
      "Pain so severe you cannot continue activity",
      "Pain that makes you feel nauseous or lightheaded",
      "Pain that wakes you from sleep repeatedly"
    ],
    action: "Stop all activity immediately. Rest and apply ice if appropriate.",
    seekCareIf: "Pain remains severe after 15-20 minutes of rest, or if accompanied by other symptoms"
  },
  {
    id: "GEN_SUDDEN_INABILITY",
    bodyPart: "general",
    severity: "stop_immediately",
    title: "Sudden Loss of Function",
    description: "Sudden inability to bear weight or use the affected area",
    symptoms: [
      "Cannot put weight on the leg",
      "Cannot lift or move the arm",
      "Complete loss of strength suddenly"
    ],
    action: "Stop immediately. Do not try to 'walk it off' or push through.",
    seekCareIf: "You cannot bear weight or use the limb normally",
    possibleCauses: ["Fracture", "Complete tendon rupture", "Severe ligament injury"]
  },
  {
    id: "GEN_DEFORMITY",
    bodyPart: "general",
    severity: "stop_immediately",
    title: "Visible Deformity",
    description: "Obvious change in shape or alignment of a joint or limb",
    symptoms: [
      "Joint looks 'out of place'",
      "Limb at an unusual angle",
      "Visible bump or depression that wasn't there before"
    ],
    action: "Do not try to move or straighten the area. Immobilize and seek emergency care.",
    seekCareIf: "Any visible deformity after injury",
    possibleCauses: ["Dislocation", "Fracture"]
  },
  {
    id: "GEN_NUMBNESS_WEAKNESS",
    bodyPart: "general",
    severity: "stop_immediately",
    title: "Numbness or Weakness",
    description: "Sudden numbness, tingling, or weakness in a limb",
    symptoms: [
      "Foot or hand feels 'dead' or numb",
      "Sudden weakness in muscles",
      "Tingling that doesn't resolve quickly"
    ],
    action: "Stop activity. Note which areas are affected.",
    seekCareIf: "Numbness or weakness persists more than a few minutes, or is accompanied by severe pain"
  },
  {
    id: "GEN_RAPID_SWELLING",
    bodyPart: "general",
    severity: "stop_and_monitor",
    title: "Rapid Swelling",
    description: "Significant swelling that develops within minutes to hours",
    symptoms: [
      "Joint swells noticeably within 2 hours of injury",
      "Swelling that makes the joint feel 'tight'",
      "Swelling with warmth and redness"
    ],
    action: "Apply ice, compress, elevate. Rest the area.",
    seekCareIf: "Swelling is severe, doesn't improve with RICE, or is accompanied by significant pain",
    possibleCauses: ["Ligament injury", "Fracture", "Significant soft tissue damage"]
  },
  {
    id: "GEN_LOCKING",
    bodyPart: "general",
    severity: "stop_and_monitor",
    title: "Joint Locking",
    description: "Joint gets stuck and cannot move through full range",
    symptoms: [
      "Joint suddenly 'locks' and won't bend or straighten",
      "Have to wiggle or manipulate to 'unlock'",
      "Catching sensation followed by inability to move"
    ],
    action: "Gently try to restore motion. Do not force.",
    seekCareIf: "Locking happens repeatedly or joint remains locked",
    possibleCauses: ["Loose body in joint", "Meniscus tear", "Cartilage damage"]
  },
  {
    id: "GEN_INFECTION_SIGNS",
    bodyPart: "general",
    severity: "stop_immediately",
    title: "Signs of Infection",
    description: "Symptoms suggesting infection in or around a joint",
    symptoms: [
      "Increasing redness spreading from the area",
      "Warmth with fever or chills",
      "Red streaks extending from the area",
      "Pus or unusual discharge"
    ],
    action: "Do not exercise the area. Seek medical care promptly.",
    seekCareIf: "Any signs of infection, especially with fever"
  },
  {
    id: "GEN_NIGHT_PAIN",
    bodyPart: "general",
    severity: "awareness",
    title: "Constant Night Pain",
    description: "Pain that wakes you from sleep or is constant regardless of position",
    symptoms: [
      "Pain that wakes you multiple nights",
      "Pain that doesn't change with position",
      "Pain that is constant, not just with movement"
    ],
    action: "Note the pattern. Avoid aggravating activities.",
    seekCareIf: "Night pain persists for more than 1-2 weeks",
    possibleCauses: ["Inflammatory condition", "Stress fracture", "Other conditions requiring evaluation"]
  }
];

// ============================================
// KNEE-SPECIFIC RED FLAGS
// ============================================

export const KNEE_RED_FLAGS: RedFlag[] = [
  {
    id: "KNEE_GIVING_WAY",
    bodyPart: "knee",
    severity: "stop_and_monitor",
    title: "Knee Giving Way",
    description: "Knee buckles or gives out unexpectedly",
    symptoms: [
      "Knee suddenly buckles when walking or turning",
      "Feeling that knee will 'give out'",
      "Knee collapses during activity"
    ],
    action: "Stop activity. Use support (cane, crutch) if needed to walk safely.",
    seekCareIf: "Giving way happens more than once, or is accompanied by swelling or pain",
    possibleCauses: ["Ligament insufficiency", "Muscle weakness", "Meniscus issue"]
  },
  {
    id: "KNEE_POP_INJURY",
    bodyPart: "knee",
    severity: "stop_immediately",
    title: "Pop with Injury",
    description: "Audible or felt 'pop' at time of injury",
    symptoms: [
      "Heard or felt a 'pop' during activity",
      "Immediate pain following the pop",
      "Swelling developing after the pop"
    ],
    action: "Stop immediately. Apply ice, compress, elevate. Do not try to 'test' the knee.",
    seekCareIf: "Any pop with injury, especially if followed by swelling or instability",
    possibleCauses: ["ACL tear", "Meniscus tear", "Other ligament injury"]
  },
  {
    id: "KNEE_CANT_STRAIGHTEN",
    bodyPart: "knee",
    severity: "stop_and_monitor",
    title: "Cannot Fully Straighten",
    description: "Knee is stuck in a bent position and won't straighten",
    symptoms: [
      "Knee won't fully extend",
      "Painful block to straightening",
      "Feeling of something 'in the way'"
    ],
    action: "Do not force extension. Rest and ice.",
    seekCareIf: "Cannot achieve full extension, especially after injury",
    possibleCauses: ["Locked meniscus", "Loose body", "Significant swelling"]
  },
  {
    id: "KNEE_BACK_SWELLING",
    bodyPart: "knee",
    severity: "caution",
    title: "Swelling Behind Knee",
    description: "Noticeable swelling or fullness in the back of the knee",
    symptoms: [
      "Visible bulge behind knee",
      "Tightness when bending knee fully",
      "Aching behind knee"
    ],
    action: "Avoid deep knee bending. Monitor for changes.",
    seekCareIf: "Swelling increases, becomes painful, or affects calf",
    possibleCauses: ["Baker's cyst", "Other conditions"]
  },
  {
    id: "KNEE_CALF_PAIN_SWELLING",
    bodyPart: "knee",
    severity: "stop_immediately",
    title: "Calf Pain with Swelling",
    description: "Pain and swelling in the calf, especially after injury or immobility",
    symptoms: [
      "Calf pain that worsens with walking",
      "Calf swelling, especially one-sided",
      "Warmth in the calf",
      "Pain when flexing foot upward"
    ],
    action: "Stop activity. Do not massage the area. Seek medical evaluation promptly.",
    seekCareIf: "Any combination of calf pain, swelling, and warmth - this requires urgent evaluation",
    possibleCauses: ["This combination of symptoms requires medical evaluation to rule out serious conditions"]
  }
];

// ============================================
// ACHILLES-SPECIFIC RED FLAGS
// ============================================

export const ACHILLES_RED_FLAGS: RedFlag[] = [
  {
    id: "ACHILLES_POP_SNAP",
    bodyPart: "achilles",
    severity: "stop_immediately",
    title: "Pop or Snap Sensation",
    description: "Sudden pop or snap felt in the Achilles area",
    symptoms: [
      "Felt or heard a 'pop' or 'snap'",
      "Sensation of being kicked in the back of the leg",
      "Sudden inability to push off or rise on toes"
    ],
    action: "Stop immediately. Do not try to walk normally. Seek emergency evaluation.",
    seekCareIf: "Any pop/snap sensation in the Achilles area",
    possibleCauses: ["Achilles tendon rupture"]
  },
  {
    id: "ACHILLES_SUDDEN_WEAKNESS",
    bodyPart: "achilles",
    severity: "stop_immediately",
    title: "Sudden Calf Weakness",
    description: "Sudden inability to rise on toes or push off",
    symptoms: [
      "Cannot do a single leg heel raise",
      "Foot 'slaps' when walking",
      "Significant weakness pushing off"
    ],
    action: "Stop activity. Seek evaluation promptly.",
    seekCareIf: "Sudden onset of weakness in pushing off or rising on toes"
  },
  {
    id: "ACHILLES_GAP",
    bodyPart: "achilles",
    severity: "stop_immediately",
    title: "Gap in Tendon",
    description: "Palpable gap or depression in the Achilles tendon",
    symptoms: [
      "Can feel a 'dip' or gap in the tendon",
      "Tendon feels discontinuous",
      "Significant bruising developing"
    ],
    action: "Do not walk on it. Seek emergency evaluation.",
    seekCareIf: "Any palpable gap in the Achilles tendon"
  },
  {
    id: "ACHILLES_SEVERE_MORNING",
    bodyPart: "achilles",
    severity: "caution",
    title: "Severe Morning Stiffness",
    description: "Significant pain and stiffness with first steps that doesn't improve",
    symptoms: [
      "Severe pain with first steps lasting >30 minutes",
      "Morning stiffness getting progressively worse",
      "Pain that doesn't warm up with activity"
    ],
    action: "Reduce activity load. Consider relative rest.",
    seekCareIf: "Morning symptoms are severe or worsening despite rest"
  }
];

// ============================================
// SHOULDER-SPECIFIC RED FLAGS
// ============================================

export const SHOULDER_RED_FLAGS: RedFlag[] = [
  {
    id: "SHOULDER_DISLOCATION",
    bodyPart: "shoulder",
    severity: "stop_immediately",
    title: "Shoulder Dislocation",
    description: "Shoulder appears out of place or arm is held in unusual position",
    symptoms: [
      "Shoulder looks 'squared off' or abnormal",
      "Arm held away from body, cannot bring to side",
      "Severe pain with any movement attempt"
    ],
    action: "Do not try to move or relocate. Immobilize and seek emergency care.",
    seekCareIf: "Any suspected dislocation"
  },
  {
    id: "SHOULDER_SUDDEN_WEAKNESS",
    bodyPart: "shoulder",
    severity: "stop_and_monitor",
    title: "Sudden Arm Weakness",
    description: "Sudden inability to lift or rotate the arm",
    symptoms: [
      "Cannot lift arm away from body",
      "Sudden weakness after injury",
      "Arm feels 'dead'"
    ],
    action: "Stop activity. Support the arm.",
    seekCareIf: "Sudden onset weakness, especially after injury",
    possibleCauses: ["Rotator cuff tear", "Nerve injury"]
  },
  {
    id: "SHOULDER_RADIATING_NECK",
    bodyPart: "shoulder",
    severity: "caution",
    title: "Pain Radiating from Neck",
    description: "Shoulder/arm pain that originates from or is accompanied by neck pain",
    symptoms: [
      "Pain that travels from neck down arm",
      "Numbness or tingling in arm/hand",
      "Symptoms change with neck position"
    ],
    action: "Avoid aggravating positions. Note what changes symptoms.",
    seekCareIf: "Radiating symptoms persist or are accompanied by weakness",
    possibleCauses: ["Cervical spine issue", "Nerve involvement"]
  },
  {
    id: "SHOULDER_CHEST_PAIN",
    bodyPart: "shoulder",
    severity: "stop_immediately",
    title: "Shoulder Pain with Chest Symptoms",
    description: "Left shoulder pain accompanied by chest discomfort",
    symptoms: [
      "Left shoulder pain with chest pressure",
      "Shortness of breath with shoulder pain",
      "Shoulder pain with jaw or arm pain"
    ],
    action: "Stop all activity. This requires immediate medical evaluation.",
    seekCareIf: "Any combination of shoulder pain with chest symptoms - call emergency services"
  }
];

// ============================================
// FOOT-SPECIFIC RED FLAGS
// ============================================

export const FOOT_RED_FLAGS: RedFlag[] = [
  {
    id: "FOOT_SUDDEN_ARCH_COLLAPSE",
    bodyPart: "foot",
    severity: "stop_immediately",
    title: "Sudden Arch Collapse",
    description: "Sudden flattening of the arch with pain",
    symptoms: [
      "Arch suddenly 'drops'",
      "Immediate pain in arch/ankle area",
      "Cannot push off normally"
    ],
    action: "Stop weight bearing. Seek evaluation.",
    seekCareIf: "Sudden change in arch height with pain",
    possibleCauses: ["Posterior tibial tendon injury"]
  },
  {
    id: "FOOT_SEVERE_HEEL_PAIN",
    bodyPart: "foot",
    severity: "caution",
    title: "Severe First-Step Pain",
    description: "Intense pain with first steps that is worsening",
    symptoms: [
      "Severe pain (7+/10) with first steps",
      "Pain getting worse over days/weeks",
      "Pain that doesn't improve with typical measures"
    ],
    action: "Reduce activity. Use supportive footwear.",
    seekCareIf: "Severe heel pain that is worsening despite rest"
  },
  {
    id: "FOOT_STRESS_FRACTURE_SIGNS",
    bodyPart: "foot",
    severity: "stop_and_monitor",
    title: "Possible Stress Fracture",
    description: "Localized bone pain that worsens with activity",
    symptoms: [
      "Point tenderness on a bone",
      "Pain that increases with activity, decreases with rest",
      "Swelling over a specific bone",
      "Pain that has gradually worsened over weeks"
    ],
    action: "Stop impact activities. Rest the foot.",
    seekCareIf: "Localized bone pain that persists or worsens"
  },
  {
    id: "FOOT_CIRCULATION_SIGNS",
    bodyPart: "foot",
    severity: "stop_immediately",
    title: "Circulation Problems",
    description: "Signs of poor blood flow to the foot",
    symptoms: [
      "Foot is cold and pale or blue",
      "Numbness that doesn't resolve",
      "Foot pain at rest that improves with dangling",
      "Wounds that won't heal"
    ],
    action: "Seek medical evaluation promptly.",
    seekCareIf: "Any signs of circulation problems"
  }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getAllRedFlags(): RedFlag[] {
  return [
    ...GENERAL_RED_FLAGS,
    ...KNEE_RED_FLAGS,
    ...ACHILLES_RED_FLAGS,
    ...SHOULDER_RED_FLAGS,
    ...FOOT_RED_FLAGS
  ];
}

export function getRedFlagsByBodyPart(bodyPart: BodyPart): RedFlag[] {
  const specific = getAllRedFlags().filter(rf => rf.bodyPart === bodyPart);
  const general = GENERAL_RED_FLAGS;
  return [...specific, ...general];
}

export function getRedFlagsBySeverity(severity: RedFlagSeverity): RedFlag[] {
  return getAllRedFlags().filter(rf => rf.severity === severity);
}

// Check if any sensations match red flags
export function checkSensationsForRedFlags(
  bodyPart: BodyPart,
  sensations: string[],
  additionalContext?: {
    painLevel?: number;
    suddenOnset?: boolean;
    afterInjury?: boolean;
    swelling?: boolean;
  }
): RedFlag[] {
  const triggered: RedFlag[] = [];
  const flags = getRedFlagsByBodyPart(bodyPart);
  
  // Check for dangerous sensations
  const dangerousSensations = [
    "numbness", "giving_way", "locking", "slipping", 
    "tearing_feeling", "stabbing", "radiating"
  ];
  
  const hasDangerous = sensations.some(s => dangerousSensations.includes(s));
  
  if (hasDangerous) {
    // Find matching flags
    if (sensations.includes("numbness")) {
      const flag = flags.find(f => f.id === "GEN_NUMBNESS_WEAKNESS");
      if (flag) triggered.push(flag);
    }
    if (sensations.includes("giving_way") && bodyPart === "knee") {
      const flag = flags.find(f => f.id === "KNEE_GIVING_WAY");
      if (flag) triggered.push(flag);
    }
    if (sensations.includes("locking")) {
      const flag = flags.find(f => f.id === "GEN_LOCKING");
      if (flag) triggered.push(flag);
    }
  }
  
  // Check additional context
  if (additionalContext) {
    if (additionalContext.painLevel && additionalContext.painLevel >= 8) {
      const flag = flags.find(f => f.id === "GEN_SEVERE_PAIN");
      if (flag) triggered.push(flag);
    }
    
    if (additionalContext.suddenOnset && additionalContext.afterInjury) {
      if (bodyPart === "knee") {
        const flag = flags.find(f => f.id === "KNEE_POP_INJURY");
        if (flag) triggered.push(flag);
      }
      if (bodyPart === "achilles") {
        const flag = flags.find(f => f.id === "ACHILLES_POP_SNAP");
        if (flag) triggered.push(flag);
      }
    }
    
    if (additionalContext.swelling && additionalContext.suddenOnset) {
      const flag = flags.find(f => f.id === "GEN_RAPID_SWELLING");
      if (flag) triggered.push(flag);
    }
  }
  
  return triggered;
}

// Get the highest severity from a list of flags
export function getHighestSeverity(flags: RedFlag[]): RedFlagSeverity | null {
  if (flags.length === 0) return null;
  
  const severityOrder: RedFlagSeverity[] = [
    "stop_immediately",
    "stop_and_monitor", 
    "caution",
    "awareness"
  ];
  
  for (const severity of severityOrder) {
    if (flags.some(f => f.severity === severity)) {
      return severity;
    }
  }
  
  return null;
}
