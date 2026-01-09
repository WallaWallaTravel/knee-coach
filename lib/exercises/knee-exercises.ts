/**
 * Knee Exercise Library
 * 
 * All descriptions are original content written for this application.
 * Exercises are organized by progression level and category.
 */

import { Exercise, Dosage } from "./types";

export const KNEE_EXERCISES: Record<string, Exercise> = {
  // ============================================
  // FOUNDATION LEVEL - Activation & Gentle ROM
  // ============================================
  
  QUAD_SET: {
    id: "QUAD_SET",
    title: "Quad Set",
    bodyPart: "knee",
    category: "activation",
    level: "foundation",
    intent: "Activate the quadriceps muscle without moving the knee joint",
    description: "While seated or lying down with your leg straight, tighten the muscle on top of your thigh by pressing the back of your knee down toward the surface. You should see and feel the muscle contract. This is one of the safest ways to begin strengthening after knee issues.",
    cues: [
      "Press knee down into surface",
      "Feel quad tighten and kneecap lift slightly",
      "Hold for 5 seconds",
      "Fully relax between reps"
    ],
    commonMistakes: [
      "Holding breath",
      "Tensing the whole leg instead of focusing on quad",
      "Not fully relaxing between contractions"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5, restSeconds: 30 },
    minDosage: { type: "reps", value: 5, sets: 2, holdSeconds: 3 },
    maxDosage: { type: "reps", value: 15, sets: 4, holdSeconds: 10 },
    equipment: ["none"],
    position: "supine",
    contraindications: [
      { condition: "Acute patellar dislocation", reason: "Quad contraction may stress healing structures" }
    ],
    progression: {
      nextLevel: "STRAIGHT_LEG_RAISE",
      progressionTips: "Add ankle weight or progress to straight leg raise"
    },
    targetMuscles: ["quadriceps", "VMO"],
    visualKey: "quad_set",
    _evidenceNotes: "Foundational exercise in most post-surgical and conservative knee rehab protocols"
  },

  HEEL_SLIDES: {
    id: "HEEL_SLIDES",
    title: "Heel Slides",
    bodyPart: "knee",
    category: "mobility",
    level: "foundation",
    intent: "Gently restore knee flexion range of motion",
    description: "Lying on your back, slowly slide your heel toward your buttock, bending your knee. Go only as far as comfortable, then slide back to straight. The movement should be smooth and controlled. Use a towel under your heel on a smooth surface if needed.",
    cues: [
      "Slide heel toward buttock",
      "Keep movement slow and controlled",
      "Go to comfortable end range only",
      "Slide back to full extension"
    ],
    commonMistakes: [
      "Moving too quickly",
      "Forcing through pain",
      "Lifting heel off surface"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 2, restSeconds: 30 },
    minDosage: { type: "reps", value: 5, sets: 1 },
    maxDosage: { type: "reps", value: 15, sets: 3 },
    equipment: ["none"],
    position: "supine",
    modifications: [
      "Use towel under heel for easier sliding",
      "Use strap around foot to assist if needed"
    ],
    progression: {
      nextLevel: "WALL_SLIDES_KNEE",
      progressionTips: "Progress to wall slides for gravity assistance"
    },
    targetMuscles: ["hamstrings", "quadriceps"],
    movementTags: ["knee_flexion"],
    visualKey: "heel_slides"
  },

  STRAIGHT_LEG_RAISE: {
    id: "STRAIGHT_LEG_RAISE",
    title: "Straight Leg Raise",
    bodyPart: "knee",
    category: "strength",
    level: "foundation",
    intent: "Strengthen quadriceps without bending the knee",
    description: "Lying on your back with one knee bent and foot flat, keep the other leg straight. Tighten the quad (like a quad set), then lift the straight leg about 12 inches off the ground. Hold briefly, then lower with control.",
    cues: [
      "Lock knee straight first (quad set)",
      "Lift leg about 12 inches",
      "Keep knee locked throughout",
      "Lower slowly with control"
    ],
    commonMistakes: [
      "Knee bending during lift",
      "Lifting too high",
      "Dropping leg down quickly",
      "Arching lower back"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 2, restSeconds: 45 },
    minDosage: { type: "reps", value: 5, sets: 2 },
    maxDosage: { type: "reps", value: 15, sets: 4 },
    equipment: ["none"],
    position: "supine",
    contraindications: [
      { condition: "Hip flexor strain", reason: "Primary hip flexor exercise" }
    ],
    progression: {
      prerequisite: "QUAD_SET",
      nextLevel: "STRAIGHT_LEG_RAISE_WEIGHTED",
      progressionTips: "Add ankle weight in 1-2 lb increments"
    },
    targetMuscles: ["quadriceps", "hip_flexors"],
    visualKey: "straight_leg_raise"
  },

  // ============================================
  // BEGINNER LEVEL - Basic Strength & Control
  // ============================================

  TERMINAL_KNEE_EXTENSION: {
    id: "TERMINAL_KNEE_EXTENSION",
    title: "Terminal Knee Extension",
    bodyPart: "knee",
    category: "strength",
    level: "beginner",
    intent: "Strengthen the quadriceps in the final degrees of knee extension",
    description: "With a rolled towel or foam roller under your knee, press down to straighten your leg fully, lifting your heel off the ground. This targets the last 20-30 degrees of extension where many people are weak.",
    cues: [
      "Place roll under knee",
      "Press knee down into roll",
      "Lift heel off ground",
      "Hold at full extension"
    ],
    commonMistakes: [
      "Roll placed too high or low",
      "Not achieving full extension",
      "Rushing the movement"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, holdSeconds: 3, restSeconds: 30 },
    equipment: ["towel"],
    position: "supine",
    progression: {
      prerequisite: "QUAD_SET",
      nextLevel: "TERMINAL_KNEE_EXTENSION_BAND",
      progressionTips: "Add resistance band around ankle"
    },
    targetMuscles: ["quadriceps", "VMO"],
    movementTags: ["knee_extension"],
    visualKey: "terminal_knee_extension"
  },

  MINI_SQUAT_WALL: {
    id: "MINI_SQUAT_WALL",
    title: "Mini Wall Squat",
    bodyPart: "knee",
    category: "strength",
    level: "beginner",
    intent: "Build quad strength through partial range with back support",
    description: "Stand with your back against a wall, feet about 12 inches from the wall. Slide down the wall to about 30-45 degrees of knee bend, hold briefly, then slide back up. The wall provides support and feedback for proper form.",
    cues: [
      "Back flat against wall",
      "Feet shoulder width, 12 inches from wall",
      "Slide down to 30-45 degrees",
      "Keep weight through heels"
    ],
    commonMistakes: [
      "Going too deep too soon",
      "Knees caving inward",
      "Coming up on toes",
      "Holding breath"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 3, restSeconds: 45 },
    minDosage: { type: "reps", value: 5, sets: 2, holdSeconds: 2 },
    maxDosage: { type: "reps", value: 15, sets: 4, holdSeconds: 5 },
    equipment: ["wall"],
    position: "standing",
    modifications: [
      "Decrease depth if painful",
      "Place ball between knees for alignment cue"
    ],
    progression: {
      nextLevel: "WALL_SIT",
      progressionTips: "Increase depth gradually, progress to wall sit holds"
    },
    targetMuscles: ["quadriceps", "glutes"],
    movementTags: ["partial_squat"],
    visualKey: "mini_squat_wall"
  },

  STEP_UP_LOW: {
    id: "STEP_UP_LOW",
    title: "Low Step Up",
    bodyPart: "knee",
    category: "strength",
    level: "beginner",
    intent: "Build single leg strength with controlled step height",
    description: "Using a low step (4-6 inches), place your entire foot on the step. Press through your heel to step up, bringing the other foot to meet it. Step down with control, leading with the same leg. Focus on using the stepping leg, not pushing off the ground leg.",
    cues: [
      "Whole foot on step",
      "Press through heel",
      "Control the step down",
      "Minimize push from ground leg"
    ],
    commonMistakes: [
      "Pushing off back leg",
      "Knee diving inward",
      "Leaning forward excessively",
      "Step too high too soon"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, restSeconds: 45 },
    equipment: ["step"],
    position: "standing",
    modifications: [
      "Hold rail for balance",
      "Start with 2-4 inch step"
    ],
    progression: {
      nextLevel: "STEP_UP_MEDIUM",
      progressionTips: "Increase step height by 2 inches at a time"
    },
    targetMuscles: ["quadriceps", "glutes", "hip_stabilizers"],
    movementTags: ["stairs_up", "single_leg_loading"],
    visualKey: "step_up_low"
  },

  GLUTE_BRIDGE: {
    id: "GLUTE_BRIDGE",
    title: "Glute Bridge",
    bodyPart: "knee",
    category: "strength",
    level: "beginner",
    intent: "Strengthen glutes and hamstrings to support knee function",
    description: "Lying on your back with knees bent and feet flat, squeeze your glutes and lift your hips toward the ceiling until your body forms a straight line from shoulders to knees. Hold briefly at the top, then lower with control.",
    cues: [
      "Feet hip width apart",
      "Squeeze glutes to lift",
      "Straight line from shoulders to knees",
      "Don't hyperextend lower back"
    ],
    commonMistakes: [
      "Pushing through toes instead of heels",
      "Arching lower back at top",
      "Not squeezing glutes",
      "Lifting too fast"
    ],
    defaultDosage: { type: "reps", value: 12, sets: 3, holdSeconds: 2, restSeconds: 30 },
    equipment: ["none"],
    position: "supine",
    progression: {
      nextLevel: "SINGLE_LEG_BRIDGE",
      progressionTips: "Progress to marching bridge, then single leg"
    },
    targetMuscles: ["glutes", "hamstrings", "core"],
    visualKey: "glute_bridge"
  },

  CLAMSHELL: {
    id: "CLAMSHELL",
    title: "Clamshell",
    bodyPart: "knee",
    category: "strength",
    level: "beginner",
    intent: "Strengthen hip external rotators to improve knee alignment",
    description: "Lying on your side with knees bent about 45 degrees and feet together, keep your feet touching as you lift your top knee toward the ceiling. Your hips should stay stacked - don't roll backward. Lower with control.",
    cues: [
      "Feet stay together",
      "Lift knee toward ceiling",
      "Don't let hips roll back",
      "Control the lowering"
    ],
    commonMistakes: [
      "Rolling hips backward",
      "Moving too fast",
      "Not enough range of motion",
      "Feet separating"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 30 },
    equipment: ["none"],
    position: "sidelying",
    modifications: [
      "Add loop band above knees for resistance"
    ],
    progression: {
      nextLevel: "CLAMSHELL_BAND",
      progressionTips: "Add resistance band, progress to side-lying hip abduction"
    },
    targetMuscles: ["gluteus_medius", "hip_external_rotators"],
    visualKey: "clamshell"
  },

  // ============================================
  // INTERMEDIATE LEVEL - Functional Strength
  // ============================================

  SPANISH_SQUAT: {
    id: "SPANISH_SQUAT",
    title: "Spanish Squat",
    bodyPart: "knee",
    category: "strength",
    level: "intermediate",
    intent: "Load the quadriceps with reduced shear force on the knee",
    description: "With a resistance band anchored behind you at knee height and looped behind your knees, lean back into the band and squat down. The band pulls your tibia back, reducing forward knee stress while allowing deep quad loading. Control the depth based on comfort.",
    cues: [
      "Band behind knees, anchored low",
      "Lean back into band tension",
      "Sit back and down",
      "Keep chest up"
    ],
    commonMistakes: [
      "Band too high",
      "Not enough lean back",
      "Going too deep too soon",
      "Knees caving inward"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 2, restSeconds: 60 },
    minDosage: { type: "reps", value: 6, sets: 2 },
    maxDosage: { type: "reps", value: 15, sets: 4, holdSeconds: 5 },
    equipment: ["resistance_band"],
    position: "standing",
    redFlags: [
      "Sharp pain at any point",
      "Feeling of instability"
    ],
    modifications: [
      "Limit depth to pain-free range",
      "Use lighter band tension"
    ],
    progression: {
      prerequisite: "MINI_SQUAT_WALL",
      nextLevel: "SPANISH_SQUAT_WEIGHTED",
      progressionTips: "Increase depth, add weight, slow tempo"
    },
    targetMuscles: ["quadriceps", "glutes"],
    movementTags: ["partial_squat", "deep_squat"],
    visualKey: "spanish_squat",
    _evidenceNotes: "Reduces patellofemoral joint stress compared to traditional squats"
  },

  STEP_DOWN: {
    id: "STEP_DOWN",
    title: "Forward Step Down",
    bodyPart: "knee",
    category: "strength",
    level: "intermediate",
    intent: "Build eccentric quad control for descending stairs and slopes",
    description: "Standing on a step with one foot near the edge, slowly lower your other foot toward the ground by bending the stance knee. Tap the ground lightly with your heel, then press back up. The key is controlling the lowering phase.",
    cues: [
      "Stance foot near edge of step",
      "Bend stance knee to lower",
      "3 seconds down, tap, press up",
      "Keep hips level"
    ],
    commonMistakes: [
      "Dropping down too fast",
      "Hip dropping on lowering side",
      "Knee diving inward",
      "Using momentum to come up"
    ],
    defaultDosage: { type: "reps", value: 8, sets: 3, restSeconds: 60, tempo: "3-1-1" },
    equipment: ["step"],
    position: "standing",
    modifications: [
      "Hold rail for balance",
      "Use lower step",
      "Decrease depth of lowering"
    ],
    progression: {
      prerequisite: "STEP_UP_LOW",
      nextLevel: "STEP_DOWN_LATERAL",
      progressionTips: "Increase step height, add weight, progress to lateral step down"
    },
    targetMuscles: ["quadriceps", "glutes", "hip_stabilizers"],
    movementTags: ["stairs_down", "eccentric_loading", "single_leg_loading"],
    visualKey: "step_down"
  },

  SINGLE_LEG_BRIDGE: {
    id: "SINGLE_LEG_BRIDGE",
    title: "Single Leg Glute Bridge",
    bodyPart: "knee",
    category: "strength",
    level: "intermediate",
    intent: "Build unilateral glute and hamstring strength",
    description: "From a bridge position, extend one leg straight out. Keeping your hips level, lower and lift using only the planted leg. This challenges single leg strength and hip stability.",
    cues: [
      "Extend one leg straight",
      "Keep hips level throughout",
      "Squeeze glute to lift",
      "Control the lowering"
    ],
    commonMistakes: [
      "Hips rotating or dropping",
      "Extended leg dropping",
      "Using momentum",
      "Lower back arching"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, restSeconds: 45 },
    equipment: ["none"],
    position: "supine",
    progression: {
      prerequisite: "GLUTE_BRIDGE",
      nextLevel: "SINGLE_LEG_BRIDGE_ELEVATED",
      progressionTips: "Elevate foot on step, add weight on hips"
    },
    targetMuscles: ["glutes", "hamstrings", "core"],
    movementTags: ["single_leg_loading"],
    visualKey: "single_leg_bridge"
  },

  SPLIT_SQUAT: {
    id: "SPLIT_SQUAT",
    title: "Split Squat",
    bodyPart: "knee",
    category: "strength",
    level: "intermediate",
    intent: "Build single leg strength in a stable split stance",
    description: "Stand in a staggered stance with one foot forward and one back. Lower straight down by bending both knees until your back knee nearly touches the ground. Press through the front heel to return to standing. Keep your torso upright throughout.",
    cues: [
      "Feet hip width apart, staggered",
      "Lower straight down",
      "Front knee tracks over toes",
      "Press through front heel"
    ],
    commonMistakes: [
      "Leaning forward",
      "Front knee diving inward",
      "Stance too narrow",
      "Rising onto front toes"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, restSeconds: 60 },
    equipment: ["none"],
    position: "split_stance",
    modifications: [
      "Hold wall or chair for balance",
      "Decrease depth"
    ],
    progression: {
      prerequisite: "MINI_SQUAT_WALL",
      nextLevel: "REAR_FOOT_ELEVATED_SPLIT_SQUAT",
      progressionTips: "Add weight, elevate rear foot"
    },
    targetMuscles: ["quadriceps", "glutes", "hip_flexors"],
    movementTags: ["lunging", "single_leg_loading"],
    visualKey: "split_squat"
  },

  LATERAL_BAND_WALK: {
    id: "LATERAL_BAND_WALK",
    title: "Lateral Band Walk",
    bodyPart: "knee",
    category: "strength",
    level: "intermediate",
    intent: "Strengthen hip abductors for knee stability during lateral movement",
    description: "With a loop band around your legs (above knees or around ankles), stand in a quarter squat position. Step sideways, leading with one leg while maintaining tension in the band. Keep your toes pointed forward and don't let your knees cave in.",
    cues: [
      "Stay in quarter squat",
      "Step and follow, don't drag",
      "Keep toes forward",
      "Maintain band tension"
    ],
    commonMistakes: [
      "Standing too tall",
      "Knees caving inward",
      "Toes turning out",
      "Losing band tension"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 45 },
    equipment: ["loop_band"],
    position: "standing",
    progression: {
      prerequisite: "CLAMSHELL",
      nextLevel: "MONSTER_WALK",
      progressionTips: "Use heavier band, add diagonal walking pattern"
    },
    targetMuscles: ["gluteus_medius", "gluteus_minimus", "TFL"],
    movementTags: ["lateral_cuts"],
    visualKey: "lateral_band_walk"
  },

  // ============================================
  // ADVANCED LEVEL - High Demand Movements
  // ============================================

  REAR_FOOT_ELEVATED_SPLIT_SQUAT: {
    id: "REAR_FOOT_ELEVATED_SPLIT_SQUAT",
    title: "Rear Foot Elevated Split Squat (Bulgarian)",
    bodyPart: "knee",
    category: "strength",
    level: "advanced",
    intent: "Develop high-level single leg strength and stability",
    description: "With your rear foot elevated on a bench or step behind you, lower into a deep single leg squat on the front leg. Your front knee should track over your toes as you descend. Press through the front heel to return to standing.",
    cues: [
      "Rear foot on bench, laces down",
      "Front foot far enough forward",
      "Lower until front thigh parallel",
      "Drive through front heel"
    ],
    commonMistakes: [
      "Front foot too close to bench",
      "Excessive forward lean",
      "Knee caving inward",
      "Using back leg too much"
    ],
    defaultDosage: { type: "reps", value: 8, sets: 3, restSeconds: 90 },
    equipment: ["step"],
    position: "split_stance",
    redFlags: [
      "Sharp knee pain",
      "Feeling of instability"
    ],
    progression: {
      prerequisite: "SPLIT_SQUAT",
      nextLevel: "RFESS_WEIGHTED",
      progressionTips: "Add dumbbells, barbell, or deficit"
    },
    targetMuscles: ["quadriceps", "glutes", "hip_flexors"],
    movementTags: ["lunging", "single_leg_loading", "deep_squat"],
    visualKey: "bulgarian_split_squat"
  },

  SINGLE_LEG_SQUAT_BOX: {
    id: "SINGLE_LEG_SQUAT_BOX",
    title: "Single Leg Squat to Box",
    bodyPart: "knee",
    category: "strength",
    level: "advanced",
    intent: "Develop true single leg squat strength with depth control",
    description: "Standing on one leg in front of a box or bench, slowly lower yourself to sit on the box, then stand back up using only the working leg. The box provides a depth target and safety net. Keep your arms forward for counterbalance.",
    cues: [
      "Arms forward for balance",
      "Sit back toward box",
      "Touch box lightly, don't plop",
      "Drive up through heel"
    ],
    commonMistakes: [
      "Plopping onto box",
      "Using momentum to stand",
      "Knee diving inward",
      "Non-working leg touching down"
    ],
    defaultDosage: { type: "reps", value: 6, sets: 3, restSeconds: 90 },
    equipment: ["chair"],
    position: "single_leg",
    modifications: [
      "Use higher box",
      "Hold TRX or doorframe"
    ],
    progression: {
      prerequisite: "STEP_DOWN",
      nextLevel: "PISTOL_SQUAT",
      progressionTips: "Lower box height progressively"
    },
    targetMuscles: ["quadriceps", "glutes", "hip_stabilizers"],
    movementTags: ["single_leg_loading", "deep_squat"],
    visualKey: "single_leg_squat_box"
  },

  NORDIC_CURL_ASSISTED: {
    id: "NORDIC_CURL_ASSISTED",
    title: "Nordic Curl (Assisted)",
    bodyPart: "knee",
    category: "strength",
    level: "advanced",
    intent: "Build eccentric hamstring strength for injury prevention",
    description: "Kneeling with your feet anchored, slowly lower your body forward by extending at the knees while keeping your hips straight. Use your hands to catch yourself and push back up. The goal is to control the lowering as long as possible.",
    cues: [
      "Ankles anchored securely",
      "Keep hips extended (don't bend at waist)",
      "Lower as slowly as possible",
      "Catch with hands, push back up"
    ],
    commonMistakes: [
      "Bending at hips",
      "Falling forward uncontrolled",
      "Not going low enough",
      "Ankles not secure"
    ],
    defaultDosage: { type: "reps", value: 5, sets: 3, restSeconds: 120, tempo: "5-0-1" },
    equipment: ["none"],
    position: "tall_kneeling",
    redFlags: [
      "Hamstring cramping",
      "Sharp pain behind knee"
    ],
    modifications: [
      "Use band for assistance",
      "Decrease range of motion"
    ],
    progression: {
      nextLevel: "NORDIC_CURL_FULL",
      progressionTips: "Reduce assistance, increase range"
    },
    targetMuscles: ["hamstrings"],
    movementTags: ["eccentric_loading"],
    visualKey: "nordic_curl",
    _evidenceNotes: "Strong evidence for hamstring injury prevention in athletes"
  },

  // ============================================
  // ATHLETIC LEVEL - Sport Performance
  // ============================================

  DROP_SQUAT: {
    id: "DROP_SQUAT",
    title: "Drop Squat",
    bodyPart: "knee",
    category: "power",
    level: "athletic",
    intent: "Develop reactive deceleration and landing mechanics",
    description: "From standing, quickly drop into a quarter squat position, absorbing the landing softly. Focus on landing with soft knees, weight through midfoot, and stable knee position. This trains the ability to decelerate quickly.",
    cues: [
      "Start standing tall",
      "Drop quickly into quarter squat",
      "Land soft and quiet",
      "Stick the landing"
    ],
    commonMistakes: [
      "Landing with straight knees",
      "Knees caving inward",
      "Landing too loud (hard)",
      "Not stabilizing at bottom"
    ],
    defaultDosage: { type: "reps", value: 8, sets: 3, restSeconds: 60 },
    equipment: ["none"],
    position: "standing",
    redFlags: [
      "Knee pain on landing",
      "Feeling of instability"
    ],
    progression: {
      prerequisite: "MINI_SQUAT_WALL",
      nextLevel: "DROP_SQUAT_SINGLE_LEG",
      progressionTips: "Increase drop speed, progress to single leg"
    },
    targetMuscles: ["quadriceps", "glutes", "calves"],
    movementTags: ["landing", "deceleration"],
    visualKey: "drop_squat"
  },

  LATERAL_BOUND: {
    id: "LATERAL_BOUND",
    title: "Lateral Bound",
    bodyPart: "knee",
    category: "power",
    level: "athletic",
    intent: "Develop lateral power and single leg landing control",
    description: "Standing on one leg, push off laterally to land on the opposite leg. Stick the landing in a stable position before bounding back. Focus on controlled landings with good knee alignment.",
    cues: [
      "Push off through whole foot",
      "Land softly on opposite leg",
      "Stick landing for 2 seconds",
      "Knee tracks over toes"
    ],
    commonMistakes: [
      "Not sticking landings",
      "Knee caving on landing",
      "Landing too stiff",
      "Rushing between bounds"
    ],
    defaultDosage: { type: "reps", value: 6, sets: 3, restSeconds: 90 },
    equipment: ["none"],
    position: "single_leg",
    redFlags: [
      "Knee pain on landing",
      "Feeling of giving way"
    ],
    progression: {
      prerequisite: "SINGLE_LEG_SQUAT_BOX",
      nextLevel: "LATERAL_BOUND_CONTINUOUS",
      progressionTips: "Increase distance, add continuous bounding"
    },
    targetMuscles: ["glutes", "quadriceps", "hip_stabilizers"],
    movementTags: ["lateral_cuts", "landing", "single_leg_loading"],
    visualKey: "lateral_bound"
  },

  DECELERATION_DRILL: {
    id: "DECELERATION_DRILL",
    title: "Deceleration Drill",
    bodyPart: "knee",
    category: "power",
    level: "athletic",
    intent: "Train controlled stopping from forward movement",
    description: "Jog forward 5-10 yards, then decelerate to a complete stop in 2-3 steps. Focus on lowering your center of gravity, absorbing force through bent knees, and maintaining good alignment. Progress speed as control improves.",
    cues: [
      "Lower hips as you slow",
      "Short, choppy steps to stop",
      "Absorb through bent knees",
      "Chest up, eyes forward"
    ],
    commonMistakes: [
      "Staying too upright",
      "Locking knees to stop",
      "Knees caving inward",
      "Taking too many steps"
    ],
    defaultDosage: { type: "reps", value: 6, sets: 3, restSeconds: 60 },
    equipment: ["none"],
    position: "standing",
    redFlags: [
      "Knee pain during deceleration",
      "Feeling of instability"
    ],
    progression: {
      prerequisite: "DROP_SQUAT",
      nextLevel: "DECELERATION_DIRECTION_CHANGE",
      progressionTips: "Increase approach speed, add direction change"
    },
    targetMuscles: ["quadriceps", "glutes", "calves"],
    movementTags: ["deceleration", "hard_stop"],
    visualKey: "deceleration_drill"
  },

  // ============================================
  // MOBILITY & FLEXIBILITY
  // ============================================

  QUAD_STRETCH_STANDING: {
    id: "QUAD_STRETCH_STANDING",
    title: "Standing Quad Stretch",
    bodyPart: "knee",
    category: "flexibility",
    level: "beginner",
    intent: "Lengthen the quadriceps muscle",
    description: "Standing on one leg (hold something for balance), grab your opposite ankle and pull your heel toward your buttock. Keep your knees together and pelvis tucked under. You should feel a stretch in the front of your thigh.",
    cues: [
      "Keep knees together",
      "Tuck pelvis under",
      "Pull heel toward buttock",
      "Stand tall, don't lean forward"
    ],
    commonMistakes: [
      "Arching lower back",
      "Knee drifting forward",
      "Leaning forward",
      "Holding breath"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 15 },
    equipment: ["none"],
    position: "standing",
    modifications: [
      "Use strap if can't reach ankle",
      "Lie on side for easier balance"
    ],
    targetMuscles: ["quadriceps", "hip_flexors"],
    visualKey: "quad_stretch_standing"
  },

  HAMSTRING_STRETCH_SUPINE: {
    id: "HAMSTRING_STRETCH_SUPINE",
    title: "Supine Hamstring Stretch",
    bodyPart: "knee",
    category: "flexibility",
    level: "beginner",
    intent: "Lengthen the hamstring muscles",
    description: "Lying on your back, lift one leg toward the ceiling while keeping it as straight as possible. Use a strap around your foot or hold behind your thigh to gently pull the leg toward you. Keep your other leg flat on the ground.",
    cues: [
      "Keep lifted leg as straight as possible",
      "Pull gently toward you",
      "Keep opposite leg down",
      "Breathe and relax into stretch"
    ],
    commonMistakes: [
      "Bending the knee too much",
      "Lifting head and shoulders",
      "Opposite leg lifting",
      "Forcing the stretch"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 15 },
    equipment: ["towel"],
    position: "supine",
    targetMuscles: ["hamstrings"],
    visualKey: "hamstring_stretch_supine"
  },

  IT_BAND_FOAM_ROLL: {
    id: "IT_BAND_FOAM_ROLL",
    title: "IT Band Foam Roll",
    bodyPart: "knee",
    category: "release",
    level: "beginner",
    intent: "Release tension in the iliotibial band and lateral thigh",
    description: "Lying on your side with a foam roller under your outer thigh, roll slowly from just above the knee to the hip. Use your arms and opposite leg to control pressure. Pause on tender spots for 20-30 seconds.",
    cues: [
      "Roll from knee to hip",
      "Control pressure with arms/legs",
      "Pause on tender spots",
      "Breathe through discomfort"
    ],
    commonMistakes: [
      "Rolling too fast",
      "Rolling directly on knee",
      "Too much pressure initially",
      "Holding breath"
    ],
    defaultDosage: { type: "time", value: 60, sets: 2, restSeconds: 30 },
    equipment: ["foam_roller"],
    position: "sidelying",
    contraindications: [
      { condition: "Acute IT band syndrome", reason: "May increase inflammation" }
    ],
    targetStructures: ["IT_band"],
    visualKey: "it_band_foam_roll"
  },

  // ============================================
  // PROPRIOCEPTION & BALANCE
  // ============================================

  SINGLE_LEG_STANCE: {
    id: "SINGLE_LEG_STANCE",
    title: "Single Leg Balance",
    bodyPart: "knee",
    category: "proprioception",
    level: "beginner",
    intent: "Develop basic single leg balance and proprioception",
    description: "Stand on one leg with a slight bend in your knee. Focus on keeping your balance without excessive wobbling. Start near a wall or chair for safety. Progress by closing eyes or standing on unstable surface.",
    cues: [
      "Slight knee bend",
      "Focus eyes on fixed point",
      "Engage core",
      "Relax and breathe"
    ],
    commonMistakes: [
      "Locking knee straight",
      "Looking down",
      "Holding breath",
      "Excessive arm waving"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 15 },
    equipment: ["none"],
    position: "single_leg",
    modifications: [
      "Touch wall lightly",
      "Start with 10 seconds"
    ],
    progression: {
      nextLevel: "SINGLE_LEG_STANCE_EYES_CLOSED",
      progressionTips: "Close eyes, add arm movements, stand on pillow"
    },
    targetMuscles: ["hip_stabilizers", "ankle_stabilizers"],
    movementTags: ["single_leg_stance"],
    visualKey: "single_leg_stance"
  },

  SINGLE_LEG_REACH: {
    id: "SINGLE_LEG_REACH",
    title: "Single Leg Reach (Star Pattern)",
    bodyPart: "knee",
    category: "proprioception",
    level: "intermediate",
    intent: "Challenge balance while reaching in multiple directions",
    description: "Standing on one leg, reach the opposite foot forward, to the side, and behind you while maintaining balance. Touch the ground lightly if possible, then return to standing. This challenges balance in all planes.",
    cues: [
      "Maintain slight knee bend",
      "Reach as far as controlled",
      "Light touch only",
      "Return to tall standing"
    ],
    commonMistakes: [
      "Stance knee locking",
      "Losing balance on return",
      "Not reaching far enough",
      "Rushing between reaches"
    ],
    defaultDosage: { type: "reps", value: 5, sets: 3, restSeconds: 45 },
    equipment: ["none"],
    position: "single_leg",
    progression: {
      prerequisite: "SINGLE_LEG_STANCE",
      nextLevel: "Y_BALANCE_TEST",
      progressionTips: "Increase reach distance, add weight"
    },
    targetMuscles: ["hip_stabilizers", "quadriceps", "glutes"],
    movementTags: ["single_leg_stance", "single_leg_loading"],
    visualKey: "single_leg_reach"
  },
};

// Export exercise count for reference
export const KNEE_EXERCISE_COUNT = Object.keys(KNEE_EXERCISES).length;
