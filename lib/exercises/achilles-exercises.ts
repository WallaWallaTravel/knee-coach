/**
 * Achilles Exercise Library
 * 
 * All descriptions are original content written for this application.
 * Exercises follow evidence-based loading principles for tendon rehabilitation.
 */

import { Exercise } from "./types";

export const ACHILLES_EXERCISES: Record<string, Exercise> = {
  // ============================================
  // FOUNDATION LEVEL - Gentle Loading & Mobility
  // ============================================

  ANKLE_PUMPS: {
    id: "ANKLE_PUMPS",
    title: "Ankle Pumps",
    bodyPart: "achilles",
    category: "mobility",
    level: "foundation",
    intent: "Promote blood flow and gentle ankle mobility",
    description: "While seated or lying down, slowly point your toes away from you, then pull them back toward your shin. Move through the full available range smoothly and rhythmically. This simple movement promotes circulation and maintains mobility without loading the tendon.",
    cues: [
      "Point toes away (plantarflexion)",
      "Pull toes toward shin (dorsiflexion)",
      "Move smoothly through full range",
      "Keep movement rhythmic"
    ],
    commonMistakes: [
      "Moving too quickly",
      "Not using full available range",
      "Tensing the whole leg"
    ],
    defaultDosage: { type: "reps", value: 20, sets: 3, restSeconds: 30 },
    equipment: ["none"],
    position: "seated",
    targetMuscles: ["gastrocnemius", "soleus", "tibialis_anterior"],
    visualKey: "ankle_pumps"
  },

  ANKLE_CIRCLES: {
    id: "ANKLE_CIRCLES",
    title: "Ankle Circles",
    bodyPart: "achilles",
    category: "mobility",
    level: "foundation",
    intent: "Improve ankle mobility in all planes",
    description: "With your foot off the ground, draw large circles with your toes by rotating at the ankle. Move slowly and deliberately, making the circles as large as your mobility allows. Perform equal repetitions in both directions.",
    cues: [
      "Draw large circles with toes",
      "Move slowly and controlled",
      "Equal reps clockwise and counter-clockwise",
      "Keep lower leg still"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 2, restSeconds: 15 },
    equipment: ["none"],
    position: "seated",
    targetMuscles: ["ankle_stabilizers"],
    visualKey: "ankle_circles"
  },

  ISOMETRIC_PLANTARFLEX_SEATED: {
    id: "ISOMETRIC_PLANTARFLEX_SEATED",
    title: "Seated Isometric Plantarflexion",
    bodyPart: "achilles",
    category: "activation",
    level: "foundation",
    intent: "Begin loading the Achilles tendon without movement",
    description: "Sitting with your foot flat on the floor, press the ball of your foot into the ground as if trying to point your toes, but don't let your heel lift. Hold this contraction for the prescribed time. This loads the tendon isometrically, which is often the first tolerated loading after injury.",
    cues: [
      "Press ball of foot into floor",
      "Don't let heel lift",
      "Hold steady contraction",
      "Breathe normally"
    ],
    commonMistakes: [
      "Letting heel lift (becomes concentric)",
      "Holding breath",
      "Not enough effort"
    ],
    defaultDosage: { type: "time", value: 45, sets: 5, restSeconds: 60 },
    minDosage: { type: "time", value: 30, sets: 3 },
    maxDosage: { type: "time", value: 60, sets: 6 },
    equipment: ["none"],
    position: "seated",
    progression: {
      nextLevel: "ISOMETRIC_PLANTARFLEX_STANDING",
      progressionTips: "Progress to standing isometrics, then heel raises"
    },
    targetMuscles: ["gastrocnemius", "soleus"],
    targetStructures: ["achilles_tendon"],
    visualKey: "isometric_seated",
    _evidenceNotes: "Isometric loading is often first-line for reactive tendinopathy"
  },

  // ============================================
  // BEGINNER LEVEL - Basic Strength
  // ============================================

  SEATED_HEEL_RAISE: {
    id: "SEATED_HEEL_RAISE",
    title: "Seated Heel Raise",
    bodyPart: "achilles",
    category: "strength",
    level: "beginner",
    intent: "Strengthen the soleus muscle with reduced load",
    description: "Sitting with knees bent at 90 degrees, lift your heels off the ground by pushing through the balls of your feet. Lower slowly with control. The bent knee position emphasizes the soleus muscle and reduces overall load compared to standing.",
    cues: [
      "Knees bent 90 degrees",
      "Lift heels as high as possible",
      "Lower slowly (3 seconds)",
      "Keep weight even across both feet"
    ],
    commonMistakes: [
      "Not lifting high enough",
      "Dropping down too fast",
      "Uneven weight distribution"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 45, tempo: "2-1-3" },
    equipment: ["none"],
    position: "seated",
    modifications: [
      "Add weight on thighs for more resistance",
      "Single leg for progression"
    ],
    progression: {
      prerequisite: "ISOMETRIC_PLANTARFLEX_SEATED",
      nextLevel: "STANDING_HEEL_RAISE_BILATERAL",
      progressionTips: "Add weight, progress to standing"
    },
    targetMuscles: ["soleus"],
    targetStructures: ["achilles_tendon"],
    visualKey: "seated_heel_raise"
  },

  STANDING_HEEL_RAISE_BILATERAL: {
    id: "STANDING_HEEL_RAISE_BILATERAL",
    title: "Standing Heel Raise (Both Legs)",
    bodyPart: "achilles",
    category: "strength",
    level: "beginner",
    intent: "Build calf strength with full body weight",
    description: "Standing with feet hip-width apart, rise up onto your toes as high as possible, then lower slowly. Keep your knees straight to emphasize the gastrocnemius. Use a wall or chair for balance if needed, but don't push off with your hands.",
    cues: [
      "Rise as high as possible",
      "Keep knees straight",
      "Lower slowly (3 seconds)",
      "Use support for balance only"
    ],
    commonMistakes: [
      "Not achieving full height",
      "Bending knees",
      "Dropping down quickly",
      "Pushing off support"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 60, tempo: "2-1-3" },
    equipment: ["wall"],
    position: "standing",
    progression: {
      prerequisite: "SEATED_HEEL_RAISE",
      nextLevel: "HEEL_RAISE_ECCENTRIC",
      progressionTips: "Slow the eccentric, progress to single leg"
    },
    targetMuscles: ["gastrocnemius", "soleus"],
    targetStructures: ["achilles_tendon"],
    visualKey: "standing_heel_raise"
  },

  CALF_STRETCH_GASTROCNEMIUS: {
    id: "CALF_STRETCH_GASTROCNEMIUS",
    title: "Gastrocnemius Stretch (Wall)",
    bodyPart: "achilles",
    category: "flexibility",
    level: "beginner",
    intent: "Lengthen the gastrocnemius muscle",
    description: "Stand facing a wall with one foot back. Keep the back leg straight and heel down as you lean toward the wall. You should feel a stretch in the upper calf of the back leg. Hold without bouncing.",
    cues: [
      "Back leg straight",
      "Heel stays down",
      "Lean forward from ankle",
      "Feel stretch in upper calf"
    ],
    commonMistakes: [
      "Bending back knee",
      "Heel lifting",
      "Bouncing",
      "Overstretching"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 15 },
    equipment: ["wall"],
    position: "standing",
    contraindications: [
      { condition: "Acute Achilles injury", reason: "Stretching may aggravate acute tendon issues" }
    ],
    targetMuscles: ["gastrocnemius"],
    visualKey: "gastroc_stretch"
  },

  CALF_STRETCH_SOLEUS: {
    id: "CALF_STRETCH_SOLEUS",
    title: "Soleus Stretch (Bent Knee)",
    bodyPart: "achilles",
    category: "flexibility",
    level: "beginner",
    intent: "Lengthen the soleus muscle",
    description: "Similar to the gastrocnemius stretch, but with the back knee bent. This targets the deeper soleus muscle. Keep the heel down and lean forward until you feel a stretch lower in the calf, closer to the Achilles.",
    cues: [
      "Back knee bent",
      "Heel stays down",
      "Feel stretch lower in calf",
      "Hold steady"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 15 },
    equipment: ["wall"],
    position: "standing",
    targetMuscles: ["soleus"],
    visualKey: "soleus_stretch"
  },

  // ============================================
  // INTERMEDIATE LEVEL - Progressive Loading
  // ============================================

  HEEL_RAISE_ECCENTRIC: {
    id: "HEEL_RAISE_ECCENTRIC",
    title: "Eccentric Heel Drop",
    bodyPart: "achilles",
    category: "strength",
    level: "intermediate",
    intent: "Load the Achilles tendon eccentrically for tendon remodeling",
    description: "Standing on a step with heels hanging off the edge, rise up on both feet, then shift your weight to the affected leg and lower slowly over 3-5 seconds until your heel drops below the step. Use the other leg to help rise back up. This eccentric loading is key for tendon rehabilitation.",
    cues: [
      "Rise on both legs",
      "Shift to affected leg",
      "Lower slowly (3-5 seconds)",
      "Drop heel below step level"
    ],
    commonMistakes: [
      "Lowering too fast",
      "Not going below step level",
      "Using affected leg to rise",
      "Bouncing at bottom"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 90, tempo: "1-0-5" },
    equipment: ["step"],
    position: "standing",
    redFlags: [
      "Sharp pain during exercise",
      "Pain that increases with each rep"
    ],
    modifications: [
      "Start with both legs if single leg too difficult",
      "Use slower tempo for more challenge"
    ],
    progression: {
      prerequisite: "STANDING_HEEL_RAISE_BILATERAL",
      nextLevel: "HEEL_RAISE_ECCENTRIC_WEIGHTED",
      progressionTips: "Add weight via backpack or weighted vest"
    },
    targetMuscles: ["gastrocnemius", "soleus"],
    targetStructures: ["achilles_tendon"],
    visualKey: "eccentric_heel_drop",
    _evidenceNotes: "Eccentric loading is well-established for Achilles tendinopathy rehabilitation"
  },

  SINGLE_LEG_HEEL_RAISE: {
    id: "SINGLE_LEG_HEEL_RAISE",
    title: "Single Leg Heel Raise",
    bodyPart: "achilles",
    category: "strength",
    level: "intermediate",
    intent: "Build full single-leg calf strength",
    description: "Standing on one leg, rise up onto your toes as high as possible, then lower with control. This is a key milestone in Achilles rehabilitation - being able to perform multiple single leg heel raises indicates good tendon capacity.",
    cues: [
      "Full height on rise",
      "Control the lowering",
      "Keep knee straight",
      "Use wall for balance only"
    ],
    commonMistakes: [
      "Not achieving full height",
      "Rushing the movement",
      "Bending knee",
      "Using hands to push"
    ],
    defaultDosage: { type: "reps", value: 12, sets: 3, restSeconds: 90 },
    equipment: ["wall"],
    position: "single_leg",
    redFlags: [
      "Cannot complete 10 reps",
      "Pain increases during set"
    ],
    progression: {
      prerequisite: "HEEL_RAISE_ECCENTRIC",
      nextLevel: "SINGLE_LEG_HEEL_RAISE_DEFICIT",
      progressionTips: "Add deficit (step), add weight, increase reps"
    },
    targetMuscles: ["gastrocnemius", "soleus"],
    targetStructures: ["achilles_tendon"],
    movementTags: ["single_leg_heel_raise"],
    visualKey: "single_leg_heel_raise"
  },

  BENT_KNEE_HEEL_RAISE: {
    id: "BENT_KNEE_HEEL_RAISE",
    title: "Bent Knee Heel Raise (Standing)",
    bodyPart: "achilles",
    category: "strength",
    level: "intermediate",
    intent: "Isolate the soleus muscle under load",
    description: "Standing with knees bent about 20-30 degrees, rise onto your toes while maintaining the knee bend. This position shifts the load to the soleus muscle. Can be done on both legs or single leg.",
    cues: [
      "Maintain knee bend throughout",
      "Rise as high as possible",
      "Don't let knees straighten",
      "Lower with control"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 60 },
    equipment: ["none"],
    position: "standing",
    progression: {
      nextLevel: "BENT_KNEE_HEEL_RAISE_SINGLE",
      progressionTips: "Progress to single leg, add weight"
    },
    targetMuscles: ["soleus"],
    targetStructures: ["achilles_tendon"],
    visualKey: "bent_knee_heel_raise"
  },

  // ============================================
  // ADVANCED LEVEL - High Load & Speed
  // ============================================

  SINGLE_LEG_HEEL_RAISE_DEFICIT: {
    id: "SINGLE_LEG_HEEL_RAISE_DEFICIT",
    title: "Single Leg Heel Raise (Deficit)",
    bodyPart: "achilles",
    category: "strength",
    level: "advanced",
    intent: "Maximize calf strength through full range of motion",
    description: "Standing on a step with your heel hanging off, perform single leg heel raises through the full range - from heel below step level to maximum height. This increases the range of motion and loading compared to flat ground.",
    cues: [
      "Start with heel below step",
      "Rise to maximum height",
      "Full range each rep",
      "Control throughout"
    ],
    commonMistakes: [
      "Not using full range",
      "Bouncing at bottom",
      "Rushing reps"
    ],
    defaultDosage: { type: "reps", value: 12, sets: 4, restSeconds: 90 },
    equipment: ["step"],
    position: "single_leg",
    progression: {
      prerequisite: "SINGLE_LEG_HEEL_RAISE",
      nextLevel: "SINGLE_LEG_HEEL_RAISE_WEIGHTED",
      progressionTips: "Add weight, increase volume"
    },
    targetMuscles: ["gastrocnemius", "soleus"],
    targetStructures: ["achilles_tendon"],
    visualKey: "single_leg_heel_raise_deficit"
  },

  HEEL_RAISE_HEAVY_SLOW: {
    id: "HEEL_RAISE_HEAVY_SLOW",
    title: "Heavy Slow Resistance Heel Raise",
    bodyPart: "achilles",
    category: "strength",
    level: "advanced",
    intent: "Build tendon capacity through heavy, slow loading",
    description: "Using added weight (dumbbells, barbell, or machine), perform heel raises with a slow tempo: 3 seconds up, 2 second hold, 3 seconds down. The combination of heavy load and slow tempo provides optimal stimulus for tendon adaptation.",
    cues: [
      "3 seconds up",
      "2 second hold at top",
      "3 seconds down",
      "Heavy but controlled"
    ],
    commonMistakes: [
      "Going too fast",
      "Weight too light",
      "Skipping the hold",
      "Incomplete range"
    ],
    defaultDosage: { type: "reps", value: 8, sets: 4, restSeconds: 120, tempo: "3-2-3" },
    equipment: ["weight"],
    position: "standing",
    progression: {
      prerequisite: "SINGLE_LEG_HEEL_RAISE_DEFICIT",
      progressionTips: "Progressively increase weight"
    },
    targetMuscles: ["gastrocnemius", "soleus"],
    targetStructures: ["achilles_tendon"],
    visualKey: "heavy_slow_heel_raise",
    _evidenceNotes: "Heavy slow resistance training shows comparable outcomes to eccentric-only protocols"
  },

  // ============================================
  // ATHLETIC LEVEL - Power & Plyometrics
  // ============================================

  POGOS: {
    id: "POGOS",
    title: "Pogo Hops",
    bodyPart: "achilles",
    category: "power",
    level: "athletic",
    intent: "Develop reactive calf/Achilles stiffness",
    description: "Standing in place, perform small, quick hops using primarily your ankles - like a pogo stick. Keep your knees relatively straight and focus on quick ground contact. This trains the stretch-shortening cycle of the Achilles.",
    cues: [
      "Quick, small hops",
      "Minimal knee bend",
      "Stay on balls of feet",
      "Quick ground contact"
    ],
    commonMistakes: [
      "Too much knee bend",
      "Jumping too high",
      "Slow ground contact",
      "Landing on heels"
    ],
    defaultDosage: { type: "reps", value: 20, sets: 3, restSeconds: 60 },
    equipment: ["none"],
    position: "standing",
    redFlags: [
      "Pain during hopping",
      "Feeling of weakness"
    ],
    progression: {
      prerequisite: "SINGLE_LEG_HEEL_RAISE_DEFICIT",
      nextLevel: "SINGLE_LEG_POGOS",
      progressionTips: "Progress to single leg, add forward/lateral movement"
    },
    targetMuscles: ["gastrocnemius", "soleus"],
    targetStructures: ["achilles_tendon"],
    movementTags: ["hopping"],
    visualKey: "pogos"
  },

  DROP_JUMP_LAND: {
    id: "DROP_JUMP_LAND",
    title: "Drop Jump to Stick",
    bodyPart: "achilles",
    category: "power",
    level: "athletic",
    intent: "Train landing mechanics and force absorption",
    description: "Step off a low box (6-12 inches) and land softly on both feet, absorbing the impact through your ankles and knees. Stick the landing and hold for 2 seconds. Focus on quiet, controlled landings.",
    cues: [
      "Step off, don't jump",
      "Land softly and quietly",
      "Absorb through ankles and knees",
      "Stick and hold"
    ],
    commonMistakes: [
      "Jumping off instead of stepping",
      "Landing stiff-legged",
      "Loud landing",
      "Not sticking the landing"
    ],
    defaultDosage: { type: "reps", value: 8, sets: 3, restSeconds: 90 },
    equipment: ["step"],
    position: "standing",
    progression: {
      nextLevel: "DROP_JUMP_REACTIVE",
      progressionTips: "Increase box height, add reactive jump"
    },
    targetMuscles: ["gastrocnemius", "soleus", "quadriceps"],
    movementTags: ["landing"],
    visualKey: "drop_jump_land"
  },

  SPRINT_ACCELERATION: {
    id: "SPRINT_ACCELERATION",
    title: "Sprint Acceleration Drill",
    bodyPart: "achilles",
    category: "power",
    level: "athletic",
    intent: "Train Achilles under high-speed loading",
    description: "From a standing start, accelerate to about 80% of maximum speed over 20-30 meters, then decelerate gradually. Focus on pushing through the balls of your feet during acceleration. This loads the Achilles in a sport-specific way.",
    cues: [
      "Powerful push-off",
      "Drive through balls of feet",
      "Gradual build to 80%",
      "Smooth deceleration"
    ],
    commonMistakes: [
      "Going to 100% too soon",
      "Heel striking",
      "Sudden stop"
    ],
    defaultDosage: { type: "reps", value: 4, sets: 2, restSeconds: 120 },
    equipment: ["none"],
    position: "standing",
    redFlags: [
      "Pain during acceleration",
      "Feeling of weakness or giving way"
    ],
    progression: {
      prerequisite: "POGOS",
      progressionTips: "Increase speed, add direction changes"
    },
    targetMuscles: ["gastrocnemius", "soleus", "hip_extensors"],
    targetStructures: ["achilles_tendon"],
    movementTags: ["acceleration", "sprinting"],
    visualKey: "sprint_acceleration"
  },

  // ============================================
  // RELEASE & MOBILITY
  // ============================================

  CALF_FOAM_ROLL: {
    id: "CALF_FOAM_ROLL",
    title: "Calf Foam Roll",
    bodyPart: "achilles",
    category: "release",
    level: "beginner",
    intent: "Release tension in calf muscles",
    description: "Sitting with a foam roller under your calf, roll slowly from just above the ankle to below the knee. Rotate your leg to address the inner and outer portions of the calf. Pause on tender spots for 20-30 seconds.",
    cues: [
      "Roll slowly",
      "Rotate leg to hit all areas",
      "Pause on tender spots",
      "Avoid rolling directly on Achilles tendon"
    ],
    commonMistakes: [
      "Rolling too fast",
      "Rolling on the tendon itself",
      "Too much pressure initially"
    ],
    defaultDosage: { type: "time", value: 60, sets: 2, restSeconds: 30 },
    equipment: ["foam_roller"],
    position: "seated",
    contraindications: [
      { condition: "Acute Achilles injury", reason: "Direct pressure may aggravate" }
    ],
    targetMuscles: ["gastrocnemius", "soleus"],
    visualKey: "calf_foam_roll"
  },

  LACROSSE_BALL_CALF: {
    id: "LACROSSE_BALL_CALF",
    title: "Lacrosse Ball Calf Release",
    bodyPart: "achilles",
    category: "release",
    level: "beginner",
    intent: "Targeted release of calf trigger points",
    description: "Sitting with a lacrosse ball under your calf, find tender spots and apply sustained pressure. You can flex and point your foot while maintaining pressure to create a 'pin and stretch' effect.",
    cues: [
      "Find tender spot",
      "Apply sustained pressure",
      "Move ankle while holding",
      "Breathe through discomfort"
    ],
    defaultDosage: { type: "time", value: 60, sets: 2, restSeconds: 30 },
    equipment: ["lacrosse_ball"],
    position: "seated",
    targetMuscles: ["gastrocnemius", "soleus"],
    visualKey: "lacrosse_ball_calf"
  },
};

export const ACHILLES_EXERCISE_COUNT = Object.keys(ACHILLES_EXERCISES).length;
