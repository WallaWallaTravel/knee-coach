/**
 * Foot Exercise Library
 * 
 * All descriptions are original content written for this application.
 * Covers plantar fascia, intrinsic foot muscles, and ankle mobility.
 */

import { Exercise } from "./types";

export const FOOT_EXERCISES: Record<string, Exercise> = {
  // ============================================
  // FOUNDATION LEVEL - Gentle Mobility & Activation
  // ============================================

  TOE_SPREADS: {
    id: "TOE_SPREADS",
    title: "Toe Spreads",
    bodyPart: "foot",
    category: "activation",
    level: "foundation",
    intent: "Activate intrinsic foot muscles and improve toe mobility",
    description: "While seated or standing, spread your toes apart as wide as possible, as if trying to create space between each toe. Hold the spread position, then relax. This activates the small muscles within the foot that help control toe position.",
    cues: [
      "Spread toes as wide as possible",
      "Hold the spread",
      "Relax completely between reps",
      "Try to move each toe independently"
    ],
    commonMistakes: [
      "Not spreading wide enough",
      "Curling toes instead of spreading",
      "Rushing the movement"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5, restSeconds: 30 },
    equipment: ["none"],
    position: "seated",
    modifications: [
      "Use toe spacers to assist",
      "Manually spread toes first to feel the position"
    ],
    targetMuscles: ["interossei", "lumbricals"],
    visualKey: "toe_spreads"
  },

  TOE_YOGA: {
    id: "TOE_YOGA",
    title: "Toe Yoga",
    bodyPart: "foot",
    category: "activation",
    level: "foundation",
    intent: "Develop independent toe control",
    description: "While seated with foot flat on floor, lift only your big toe while keeping the other four toes down. Then reverse - press the big toe down while lifting the other four. This develops the neural control needed for proper foot function.",
    cues: [
      "Lift big toe, others stay down",
      "Then reverse the pattern",
      "Move slowly and deliberately",
      "Keep foot otherwise still"
    ],
    commonMistakes: [
      "Moving too fast",
      "All toes moving together",
      "Foot rolling to side"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, restSeconds: 30 },
    equipment: ["none"],
    position: "seated",
    progression: {
      nextLevel: "FOOT_DOMING",
      progressionTips: "Progress to foot doming once control improves"
    },
    targetMuscles: ["flexor_hallucis", "extensor_hallucis", "intrinsic_foot_muscles"],
    visualKey: "toe_yoga"
  },

  ANKLE_ALPHABET: {
    id: "ANKLE_ALPHABET",
    title: "Ankle Alphabet",
    bodyPart: "foot",
    category: "mobility",
    level: "foundation",
    intent: "Improve ankle mobility in all directions",
    description: "With your foot off the ground, use your ankle to 'write' the letters of the alphabet in the air with your big toe. This moves the ankle through its full range of motion in all planes. Go slowly and make the letters as large as possible.",
    cues: [
      "Write letters with big toe",
      "Make letters as large as possible",
      "Move from the ankle",
      "Keep lower leg still"
    ],
    defaultDosage: { type: "reps", value: 1, sets: 2, restSeconds: 30 },
    equipment: ["none"],
    position: "seated",
    targetMuscles: ["ankle_mobilizers"],
    visualKey: "ankle_alphabet"
  },

  PLANTAR_FASCIA_STRETCH: {
    id: "PLANTAR_FASCIA_STRETCH",
    title: "Plantar Fascia Stretch",
    bodyPart: "foot",
    category: "flexibility",
    level: "foundation",
    intent: "Lengthen the plantar fascia",
    description: "Sitting with one ankle crossed over the opposite knee, use your hand to pull your toes back toward your shin. You should feel a stretch along the arch of your foot. This is especially helpful first thing in the morning before standing.",
    cues: [
      "Pull toes back toward shin",
      "Feel stretch along arch",
      "Hold steady, don't bounce",
      "Gentle pressure only"
    ],
    commonMistakes: [
      "Pulling too hard",
      "Bouncing",
      "Not holding long enough"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 15 },
    equipment: ["none"],
    position: "seated",
    targetStructures: ["plantar_fascia"],
    visualKey: "plantar_fascia_stretch",
    _evidenceNotes: "Plantar fascia stretching is a first-line treatment for plantar fasciitis"
  },

  // ============================================
  // BEGINNER LEVEL - Basic Strength & Control
  // ============================================

  FOOT_DOMING: {
    id: "FOOT_DOMING",
    title: "Foot Doming (Short Foot)",
    bodyPart: "foot",
    category: "activation",
    level: "beginner",
    intent: "Activate the intrinsic foot muscles to support the arch",
    description: "Standing or seated with foot flat on floor, try to raise your arch by drawing the ball of your foot toward your heel without curling your toes. Imagine shortening your foot. Your toes should stay relaxed and in contact with the ground.",
    cues: [
      "Draw ball of foot toward heel",
      "Lift the arch",
      "Keep toes relaxed and flat",
      "Don't curl or grip with toes"
    ],
    commonMistakes: [
      "Curling toes",
      "Toes lifting off ground",
      "Not enough arch lift",
      "Holding breath"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5, restSeconds: 30 },
    equipment: ["none"],
    position: "seated",
    modifications: [
      "Start seated before progressing to standing",
      "Use mirror for visual feedback"
    ],
    progression: {
      prerequisite: "TOE_YOGA",
      nextLevel: "FOOT_DOMING_STANDING",
      progressionTips: "Progress to standing, then single leg"
    },
    targetMuscles: ["intrinsic_foot_muscles", "tibialis_posterior"],
    targetStructures: ["arch"],
    visualKey: "foot_doming",
    _evidenceNotes: "Short foot exercise activates intrinsic muscles and supports arch"
  },

  TOWEL_SCRUNCHES: {
    id: "TOWEL_SCRUNCHES",
    title: "Towel Scrunches",
    bodyPart: "foot",
    category: "strength",
    level: "beginner",
    intent: "Strengthen toe flexors",
    description: "Place a towel flat on the floor. Using only your toes, scrunch the towel toward you by gripping and pulling. Spread the towel back out and repeat. This strengthens the muscles that flex your toes.",
    cues: [
      "Grip towel with toes",
      "Pull toward you",
      "Use all toes",
      "Full grip and release"
    ],
    commonMistakes: [
      "Using only big toe",
      "Not gripping fully",
      "Moving foot instead of toes"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 45 },
    equipment: ["towel"],
    position: "seated",
    progression: {
      nextLevel: "MARBLE_PICKUPS",
      progressionTips: "Progress to marble pickups for more precision"
    },
    targetMuscles: ["flexor_digitorum", "flexor_hallucis"],
    visualKey: "towel_scrunches"
  },

  MARBLE_PICKUPS: {
    id: "MARBLE_PICKUPS",
    title: "Marble Pickups",
    bodyPart: "foot",
    category: "strength",
    level: "beginner",
    intent: "Develop fine motor control and grip strength",
    description: "Place several marbles on the floor. Using your toes, pick up one marble at a time and place it in a cup or bowl. This requires more precision than towel scrunches and develops fine motor control.",
    cues: [
      "Pick up one marble at a time",
      "Use different toes",
      "Place in container",
      "Both feet"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 2, restSeconds: 45 },
    equipment: ["none"],
    position: "seated",
    progression: {
      prerequisite: "TOWEL_SCRUNCHES",
      progressionTips: "Use smaller objects, try standing"
    },
    targetMuscles: ["toe_flexors", "intrinsic_foot_muscles"],
    visualKey: "marble_pickups"
  },

  CALF_STRETCH_WALL: {
    id: "CALF_STRETCH_WALL",
    title: "Calf Stretch (Wall)",
    bodyPart: "foot",
    category: "flexibility",
    level: "beginner",
    intent: "Improve ankle dorsiflexion by lengthening calf muscles",
    description: "Stand facing a wall with one foot back. Keep the back leg straight and heel down as you lean toward the wall. You should feel a stretch in the calf. Good ankle mobility is essential for proper foot function.",
    cues: [
      "Back leg straight",
      "Heel stays down",
      "Lean into wall",
      "Feel stretch in calf"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 15 },
    equipment: ["wall"],
    position: "standing",
    targetMuscles: ["gastrocnemius", "soleus"],
    visualKey: "calf_stretch_wall"
  },

  HEEL_RAISES_BILATERAL: {
    id: "HEEL_RAISES_BILATERAL",
    title: "Heel Raises (Both Feet)",
    bodyPart: "foot",
    category: "strength",
    level: "beginner",
    intent: "Strengthen calf muscles and practice toe-off mechanics",
    description: "Standing with feet hip-width apart, rise up onto your toes as high as possible, then lower slowly. Focus on pushing through the big toe side of your foot and maintaining good arch position throughout.",
    cues: [
      "Rise as high as possible",
      "Push through big toe",
      "Lower slowly",
      "Maintain arch position"
    ],
    commonMistakes: [
      "Rolling to outside of foot",
      "Not achieving full height",
      "Dropping down quickly"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 45 },
    equipment: ["none"],
    position: "standing",
    progression: {
      nextLevel: "HEEL_RAISES_SINGLE",
      progressionTips: "Progress to single leg"
    },
    targetMuscles: ["gastrocnemius", "soleus"],
    movementTags: ["heel_raises"],
    visualKey: "heel_raises_bilateral"
  },

  // ============================================
  // INTERMEDIATE LEVEL - Functional Strength
  // ============================================

  HEEL_RAISES_SINGLE: {
    id: "HEEL_RAISES_SINGLE",
    title: "Single Leg Heel Raise",
    bodyPart: "foot",
    category: "strength",
    level: "intermediate",
    intent: "Build unilateral calf and foot strength",
    description: "Standing on one leg, rise up onto your toes as high as possible, then lower with control. Use a wall for balance if needed, but don't push off with your hand. This is a key functional strength exercise for the foot and ankle.",
    cues: [
      "Full height on rise",
      "Control the lowering",
      "Push through big toe",
      "Use wall for balance only"
    ],
    commonMistakes: [
      "Not achieving full height",
      "Rushing",
      "Pushing off wall",
      "Rolling to outside"
    ],
    defaultDosage: { type: "reps", value: 12, sets: 3, restSeconds: 60 },
    equipment: ["wall"],
    position: "single_leg",
    progression: {
      prerequisite: "HEEL_RAISES_BILATERAL",
      nextLevel: "HEEL_RAISES_DEFICIT",
      progressionTips: "Add deficit (step), add weight"
    },
    targetMuscles: ["gastrocnemius", "soleus", "intrinsic_foot_muscles"],
    movementTags: ["heel_raises", "single_leg_stand"],
    visualKey: "heel_raises_single"
  },

  TOE_WALKS: {
    id: "TOE_WALKS",
    title: "Toe Walks",
    bodyPart: "foot",
    category: "strength",
    level: "intermediate",
    intent: "Strengthen forefoot and calf in functional pattern",
    description: "Walk forward on your toes, staying as high as possible on the balls of your feet. Take short steps and maintain good posture. This strengthens the calf and forefoot muscles in a functional walking pattern.",
    cues: [
      "Stay as high as possible",
      "Short steps",
      "Good posture",
      "20-30 meters"
    ],
    commonMistakes: [
      "Dropping heels",
      "Steps too long",
      "Leaning forward"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 45 },
    equipment: ["none"],
    position: "standing",
    targetMuscles: ["gastrocnemius", "soleus", "toe_flexors"],
    movementTags: ["toe_raises"],
    visualKey: "toe_walks"
  },

  HEEL_WALKS: {
    id: "HEEL_WALKS",
    title: "Heel Walks",
    bodyPart: "foot",
    category: "strength",
    level: "intermediate",
    intent: "Strengthen anterior tibialis and dorsiflexors",
    description: "Walk forward on your heels with toes pointed up toward the ceiling. Take short steps and maintain balance. This strengthens the muscles on the front of your shin that lift your toes.",
    cues: [
      "Toes up toward ceiling",
      "Walk on heels only",
      "Short steps",
      "20-30 meters"
    ],
    commonMistakes: [
      "Toes dropping",
      "Steps too long",
      "Poor balance"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 45 },
    equipment: ["none"],
    position: "standing",
    targetMuscles: ["tibialis_anterior", "toe_extensors"],
    visualKey: "heel_walks"
  },

  BALL_ROLL_PLANTAR: {
    id: "BALL_ROLL_PLANTAR",
    title: "Ball Roll (Plantar)",
    bodyPart: "foot",
    category: "release",
    level: "intermediate",
    intent: "Release tension in plantar fascia and foot muscles",
    description: "Standing or seated, place a lacrosse ball, golf ball, or tennis ball under your foot. Roll slowly from heel to ball of foot, pausing on any tender spots. Apply moderate pressure - it should feel like a 'good hurt.'",
    cues: [
      "Roll from heel to ball of foot",
      "Pause on tender spots",
      "Moderate pressure",
      "Breathe through discomfort"
    ],
    commonMistakes: [
      "Rolling too fast",
      "Too much pressure",
      "Avoiding tender spots"
    ],
    defaultDosage: { type: "time", value: 60, sets: 2, restSeconds: 30 },
    equipment: ["lacrosse_ball"],
    position: "standing",
    modifications: [
      "Use softer ball (tennis) if too intense",
      "Sit to reduce pressure"
    ],
    targetStructures: ["plantar_fascia", "intrinsic_foot_muscles"],
    visualKey: "ball_roll_plantar"
  },

  FROZEN_BOTTLE_ROLL: {
    id: "FROZEN_BOTTLE_ROLL",
    title: "Frozen Bottle Roll",
    bodyPart: "foot",
    category: "release",
    level: "intermediate",
    intent: "Combine massage with cold therapy for plantar fascia",
    description: "Freeze a water bottle and roll it under your foot from heel to ball. The cold helps reduce inflammation while the rolling provides massage. Especially helpful for plantar fasciitis.",
    cues: [
      "Roll frozen bottle under foot",
      "Heel to ball of foot",
      "2-3 minutes per foot",
      "Moderate pressure"
    ],
    defaultDosage: { type: "time", value: 120, sets: 1, restSeconds: 0 },
    equipment: ["frozen_bottle"],
    position: "seated",
    targetStructures: ["plantar_fascia"],
    visualKey: "frozen_bottle_roll"
  },

  ARCH_LIFTS: {
    id: "ARCH_LIFTS",
    title: "Arch Lifts",
    bodyPart: "foot",
    category: "strength",
    level: "intermediate",
    intent: "Strengthen arch support muscles",
    description: "Standing with feet flat, lift your arches while keeping your toes and heels on the ground. This is similar to foot doming but in a standing, weight-bearing position. Hold the lifted position, then relax.",
    cues: [
      "Lift arch off ground",
      "Toes and heel stay down",
      "Hold the lift",
      "Relax completely"
    ],
    commonMistakes: [
      "Toes curling",
      "Heel lifting",
      "Not enough arch lift"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5, restSeconds: 30 },
    equipment: ["none"],
    position: "standing",
    progression: {
      prerequisite: "FOOT_DOMING",
      nextLevel: "ARCH_LIFTS_SINGLE_LEG",
      progressionTips: "Progress to single leg"
    },
    targetMuscles: ["tibialis_posterior", "intrinsic_foot_muscles"],
    targetStructures: ["arch"],
    visualKey: "arch_lifts"
  },

  // ============================================
  // ADVANCED LEVEL - High Demand & Balance
  // ============================================

  SINGLE_LEG_BALANCE_EYES_CLOSED: {
    id: "SINGLE_LEG_BALANCE_EYES_CLOSED",
    title: "Single Leg Balance (Eyes Closed)",
    bodyPart: "foot",
    category: "proprioception",
    level: "advanced",
    intent: "Challenge foot proprioception without visual input",
    description: "Stand on one leg with eyes closed. This removes visual feedback and forces your foot and ankle to work harder to maintain balance. Stay near a wall for safety. Start with short durations and build up.",
    cues: [
      "Close eyes",
      "Maintain balance",
      "Feel foot making adjustments",
      "Stay near wall for safety"
    ],
    commonMistakes: [
      "Opening eyes",
      "Not staying near support",
      "Holding breath"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 30 },
    equipment: ["wall"],
    position: "single_leg",
    redFlags: [
      "Repeated falls",
      "Ankle pain"
    ],
    progression: {
      nextLevel: "SINGLE_LEG_BALANCE_UNSTABLE",
      progressionTips: "Progress to unstable surface"
    },
    targetMuscles: ["ankle_stabilizers", "intrinsic_foot_muscles"],
    movementTags: ["single_leg_stand"],
    visualKey: "single_leg_balance_eyes_closed"
  },

  SINGLE_LEG_BALANCE_UNSTABLE: {
    id: "SINGLE_LEG_BALANCE_UNSTABLE",
    title: "Single Leg Balance (Unstable Surface)",
    bodyPart: "foot",
    category: "proprioception",
    level: "advanced",
    intent: "Challenge foot and ankle stability on unstable surface",
    description: "Stand on one leg on an unstable surface like a pillow, foam pad, or balance board. The unstable surface increases the demand on your foot and ankle stabilizers. Progress gradually from firmer to softer surfaces.",
    cues: [
      "Stand on unstable surface",
      "Maintain balance",
      "Allow small corrections",
      "Stay near support"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 45 },
    equipment: ["balance_board"],
    position: "single_leg",
    modifications: [
      "Start with pillow (easier)",
      "Progress to foam pad, then balance board"
    ],
    progression: {
      prerequisite: "SINGLE_LEG_BALANCE_EYES_CLOSED",
      progressionTips: "Add eyes closed on unstable surface"
    },
    targetMuscles: ["ankle_stabilizers", "intrinsic_foot_muscles"],
    movementTags: ["single_leg_stand"],
    visualKey: "single_leg_balance_unstable"
  },

  HEEL_RAISES_DEFICIT: {
    id: "HEEL_RAISES_DEFICIT",
    title: "Heel Raises (Deficit)",
    bodyPart: "foot",
    category: "strength",
    level: "advanced",
    intent: "Maximize calf and foot strength through full range",
    description: "Standing on a step with heels hanging off, lower your heels below the step level, then rise as high as possible. This increases the range of motion compared to flat ground and provides greater strength gains.",
    cues: [
      "Heels drop below step",
      "Rise to maximum height",
      "Full range each rep",
      "Control throughout"
    ],
    commonMistakes: [
      "Not using full range",
      "Bouncing at bottom",
      "Rushing"
    ],
    defaultDosage: { type: "reps", value: 12, sets: 3, restSeconds: 60 },
    equipment: ["step"],
    position: "standing",
    progression: {
      prerequisite: "HEEL_RAISES_SINGLE",
      nextLevel: "HEEL_RAISES_DEFICIT_SINGLE",
      progressionTips: "Progress to single leg deficit"
    },
    targetMuscles: ["gastrocnemius", "soleus"],
    movementTags: ["heel_raises"],
    visualKey: "heel_raises_deficit"
  },

  // ============================================
  // ATHLETIC LEVEL - Power & Sport-Specific
  // ============================================

  JUMP_ROPE_BASICS: {
    id: "JUMP_ROPE_BASICS",
    title: "Jump Rope (Basic)",
    bodyPart: "foot",
    category: "power",
    level: "athletic",
    intent: "Develop foot and ankle reactive strength",
    description: "Basic jump rope with both feet, staying on the balls of your feet. Focus on quick, light ground contact and using your ankles rather than jumping from your knees. This trains the stretch-shortening cycle of the foot and ankle.",
    cues: [
      "Stay on balls of feet",
      "Quick, light contacts",
      "Use ankles, not knees",
      "Relaxed shoulders"
    ],
    commonMistakes: [
      "Jumping too high",
      "Landing on heels",
      "Too much knee bend",
      "Tense upper body"
    ],
    defaultDosage: { type: "time", value: 60, sets: 3, restSeconds: 60 },
    equipment: ["none"],
    position: "standing",
    redFlags: [
      "Foot pain during jumping",
      "Ankle instability"
    ],
    progression: {
      nextLevel: "JUMP_ROPE_SINGLE_LEG",
      progressionTips: "Progress to single leg, alternating feet"
    },
    targetMuscles: ["gastrocnemius", "soleus", "intrinsic_foot_muscles"],
    movementTags: ["jumping", "hopping"],
    visualKey: "jump_rope_basics"
  },

  LATERAL_HOPS: {
    id: "LATERAL_HOPS",
    title: "Lateral Hops",
    bodyPart: "foot",
    category: "power",
    level: "athletic",
    intent: "Develop lateral foot and ankle stability and power",
    description: "Standing on one leg, hop sideways over a line or small obstacle, landing on the same foot. Stick each landing before hopping back. This challenges lateral ankle stability and develops power in the frontal plane.",
    cues: [
      "Hop sideways",
      "Land softly",
      "Stick the landing",
      "Control before next hop"
    ],
    commonMistakes: [
      "Not sticking landings",
      "Landing too stiff",
      "Rushing between hops"
    ],
    defaultDosage: { type: "reps", value: 8, sets: 3, restSeconds: 60 },
    equipment: ["none"],
    position: "single_leg",
    redFlags: [
      "Ankle pain",
      "Feeling of giving way"
    ],
    progression: {
      prerequisite: "SINGLE_LEG_BALANCE_UNSTABLE",
      progressionTips: "Increase distance, add continuous hopping"
    },
    targetMuscles: ["peroneals", "ankle_stabilizers", "intrinsic_foot_muscles"],
    movementTags: ["hopping", "landing"],
    visualKey: "lateral_hops"
  },

  BAREFOOT_WALKING: {
    id: "BAREFOOT_WALKING",
    title: "Barefoot Walking (Varied Surfaces)",
    bodyPart: "foot",
    category: "proprioception",
    level: "athletic",
    intent: "Develop foot sensitivity and natural movement patterns",
    description: "Walk barefoot on various safe surfaces - grass, sand, smooth gravel. This stimulates the sensory receptors in your feet and encourages natural foot mechanics. Start with short durations and soft surfaces.",
    cues: [
      "Walk naturally",
      "Feel the surface",
      "Allow foot to adapt",
      "Start with soft surfaces"
    ],
    commonMistakes: [
      "Unsafe surfaces",
      "Too much too soon",
      "Ignoring discomfort"
    ],
    defaultDosage: { type: "time", value: 300, sets: 1, restSeconds: 0 },
    equipment: ["none"],
    position: "standing",
    modifications: [
      "Start on carpet or grass",
      "Progress to varied textures gradually"
    ],
    redFlags: [
      "Sharp pain",
      "Cuts or injuries"
    ],
    targetMuscles: ["intrinsic_foot_muscles"],
    movementTags: ["barefoot_walking"],
    visualKey: "barefoot_walking"
  },
};

export const FOOT_EXERCISE_COUNT = Object.keys(FOOT_EXERCISES).length;
