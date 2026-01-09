/**
 * Shoulder Exercise Library
 * 
 * All descriptions are original content written for this application.
 * Exercises organized by level and category for progressive rehabilitation.
 */

import { Exercise } from "./types";

export const SHOULDER_EXERCISES: Record<string, Exercise> = {
  // ============================================
  // FOUNDATION LEVEL - Gentle Mobility & Activation
  // ============================================

  PENDULUM_SWINGS: {
    id: "PENDULUM_SWINGS",
    title: "Pendulum Swings",
    bodyPart: "shoulder",
    category: "mobility",
    level: "foundation",
    intent: "Gentle joint mobilization using gravity",
    description: "Lean forward with your unaffected arm on a table for support. Let your affected arm hang straight down, completely relaxed. Gently shift your body weight to create small circular or back-and-forth movements of the hanging arm. The arm should move passively - don't use your shoulder muscles.",
    cues: [
      "Lean forward, arm hanging",
      "Completely relax the shoulder",
      "Shift body weight to create movement",
      "Small circles, both directions"
    ],
    commonMistakes: [
      "Using shoulder muscles to move arm",
      "Circles too large",
      "Not relaxing completely",
      "Standing too upright"
    ],
    defaultDosage: { type: "time", value: 60, sets: 2, restSeconds: 30 },
    equipment: ["chair"],
    position: "standing",
    targetStructures: ["glenohumeral_joint"],
    visualKey: "pendulum_swings"
  },

  SUPINE_PASSIVE_FLEXION: {
    id: "SUPINE_PASSIVE_FLEXION",
    title: "Supine Passive Flexion",
    bodyPart: "shoulder",
    category: "mobility",
    level: "foundation",
    intent: "Restore overhead mobility passively",
    description: "Lying on your back, use your unaffected arm to lift your affected arm overhead toward the floor behind you. Go only as far as comfortable. The affected arm should stay relaxed - all the work is done by the helping arm.",
    cues: [
      "Use good arm to lift affected arm",
      "Keep affected arm relaxed",
      "Go to comfortable end range",
      "Hold and breathe"
    ],
    commonMistakes: [
      "Using affected arm muscles",
      "Forcing through pain",
      "Arching lower back"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5, restSeconds: 30 },
    equipment: ["none"],
    position: "supine",
    progression: {
      nextLevel: "WALL_SLIDE",
      progressionTips: "Progress to active-assisted, then active movement"
    },
    targetMuscles: ["deltoid", "rotator_cuff"],
    visualKey: "supine_passive_flexion"
  },

  SUPINE_PASSIVE_ER: {
    id: "SUPINE_PASSIVE_ER",
    title: "Supine Passive External Rotation",
    bodyPart: "shoulder",
    category: "mobility",
    level: "foundation",
    intent: "Restore external rotation mobility",
    description: "Lying on your back with elbow bent 90 degrees and tucked at your side, use a stick or your other hand to gently rotate your forearm outward (away from your body). Keep your elbow pinned to your side throughout.",
    cues: [
      "Elbow stays at side",
      "Use stick or other hand to assist",
      "Rotate forearm outward",
      "Stop at first resistance"
    ],
    commonMistakes: [
      "Elbow lifting away from body",
      "Forcing the rotation",
      "Shrugging shoulder"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5, restSeconds: 30 },
    equipment: ["stick_dowel"],
    position: "supine",
    targetMuscles: ["infraspinatus", "teres_minor"],
    visualKey: "supine_passive_er"
  },

  SCAPULAR_CLOCK: {
    id: "SCAPULAR_CLOCK",
    title: "Scapular Clock",
    bodyPart: "shoulder",
    category: "activation",
    level: "foundation",
    intent: "Activate scapular stabilizers with minimal arm movement",
    description: "Standing with your arm at your side, imagine your shoulder blade is the center of a clock. Without moving your arm much, try to move your shoulder blade toward 12 o'clock (up), 3 o'clock (back), 6 o'clock (down), and 9 o'clock (forward). These are small, subtle movements.",
    cues: [
      "Small movements of shoulder blade",
      "Arm stays relatively still",
      "Feel the muscles around shoulder blade",
      "Move to each 'hour' position"
    ],
    defaultDosage: { type: "reps", value: 5, sets: 2, restSeconds: 30 },
    equipment: ["none"],
    position: "standing",
    targetMuscles: ["serratus_anterior", "rhomboids", "trapezius"],
    visualKey: "scapular_clock"
  },

  // ============================================
  // BEGINNER LEVEL - Active Movement & Basic Strength
  // ============================================

  WALL_SLIDE: {
    id: "WALL_SLIDE",
    title: "Wall Slide",
    bodyPart: "shoulder",
    category: "mobility",
    level: "beginner",
    intent: "Controlled overhead movement with feedback",
    description: "Stand with your back against a wall, arms in a 'W' position with backs of hands touching the wall. Slowly slide your arms up the wall toward a 'Y' position, keeping contact with the wall. Return to the W position with control.",
    cues: [
      "Back flat against wall",
      "Start in W position",
      "Slide up toward Y",
      "Maintain wall contact"
    ],
    commonMistakes: [
      "Losing wall contact",
      "Arching lower back",
      "Shrugging shoulders",
      "Moving too fast"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, restSeconds: 45 },
    equipment: ["wall"],
    position: "standing",
    progression: {
      prerequisite: "SUPINE_PASSIVE_FLEXION",
      nextLevel: "WALL_ANGEL",
      progressionTips: "Progress to wall angels, then floor slides"
    },
    targetMuscles: ["serratus_anterior", "lower_trapezius", "rotator_cuff"],
    movementTags: ["reaching_overhead"],
    visualKey: "wall_slide"
  },

  SCAPULAR_SQUEEZE: {
    id: "SCAPULAR_SQUEEZE",
    title: "Scapular Squeeze",
    bodyPart: "shoulder",
    category: "activation",
    level: "beginner",
    intent: "Strengthen scapular retractors",
    description: "Standing or sitting tall, squeeze your shoulder blades together as if trying to hold a pencil between them. Hold for the prescribed time, then relax completely. Focus on the muscles between your shoulder blades, not shrugging your shoulders up.",
    cues: [
      "Squeeze shoulder blades together",
      "Don't shrug up",
      "Hold and feel the squeeze",
      "Fully relax between reps"
    ],
    commonMistakes: [
      "Shrugging shoulders up",
      "Not holding long enough",
      "Incomplete relaxation"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 5, restSeconds: 30 },
    equipment: ["none"],
    position: "standing",
    progression: {
      nextLevel: "BAND_PULL_APART",
      progressionTips: "Add resistance band for pull-aparts"
    },
    targetMuscles: ["rhomboids", "middle_trapezius"],
    visualKey: "scapular_squeeze"
  },

  SIDELYING_ER: {
    id: "SIDELYING_ER",
    title: "Sidelying External Rotation",
    bodyPart: "shoulder",
    category: "strength",
    level: "beginner",
    intent: "Strengthen external rotators in a supported position",
    description: "Lie on your unaffected side with a small towel roll under your affected arm's elbow. Keeping your elbow bent 90 degrees and pinned to your side, rotate your forearm toward the ceiling. Lower slowly with control.",
    cues: [
      "Elbow stays at side",
      "Rotate forearm toward ceiling",
      "Control the lowering",
      "Don't roll backward"
    ],
    commonMistakes: [
      "Elbow lifting away",
      "Rolling body backward",
      "Using momentum",
      "Not enough range"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 45 },
    equipment: ["towel"],
    position: "sidelying",
    modifications: [
      "Start without weight",
      "Add light dumbbell (1-3 lbs) as tolerated"
    ],
    progression: {
      nextLevel: "STANDING_ER_BAND",
      progressionTips: "Add weight, progress to standing with band"
    },
    targetMuscles: ["infraspinatus", "teres_minor"],
    movementTags: ["external_rotation"],
    visualKey: "sidelying_er"
  },

  PRONE_I_RAISE: {
    id: "PRONE_I_RAISE",
    title: "Prone I Raise",
    bodyPart: "shoulder",
    category: "strength",
    level: "beginner",
    intent: "Strengthen lower trapezius",
    description: "Lying face down with arms at your sides, lift both arms toward the ceiling while squeezing your shoulder blades together. Your thumbs should point outward. Hold briefly at the top, then lower with control.",
    cues: [
      "Arms at sides, thumbs out",
      "Lift arms toward ceiling",
      "Squeeze shoulder blades",
      "Lower with control"
    ],
    commonMistakes: [
      "Lifting head",
      "Shrugging shoulders",
      "Not squeezing shoulder blades"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 2, restSeconds: 30 },
    equipment: ["none"],
    position: "prone",
    progression: {
      nextLevel: "PRONE_Y_RAISE",
      progressionTips: "Progress to Y and T raises"
    },
    targetMuscles: ["lower_trapezius", "rhomboids"],
    visualKey: "prone_i_raise"
  },

  // ============================================
  // INTERMEDIATE LEVEL - Functional Strength
  // ============================================

  PRONE_Y_RAISE: {
    id: "PRONE_Y_RAISE",
    title: "Prone Y Raise",
    bodyPart: "shoulder",
    category: "strength",
    level: "intermediate",
    intent: "Strengthen lower trapezius in overhead position",
    description: "Lying face down with arms extended overhead in a Y position (about 45 degrees from straight ahead), lift your arms toward the ceiling with thumbs pointing up. Focus on initiating the movement from your shoulder blades.",
    cues: [
      "Arms in Y position",
      "Thumbs point up",
      "Lift from shoulder blades",
      "Keep neck neutral"
    ],
    commonMistakes: [
      "Arms too wide or narrow",
      "Lifting head/neck",
      "Using momentum"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 2, restSeconds: 45 },
    equipment: ["none"],
    position: "prone",
    progression: {
      prerequisite: "PRONE_I_RAISE",
      nextLevel: "PRONE_Y_WEIGHTED",
      progressionTips: "Add light weights, progress to incline bench"
    },
    targetMuscles: ["lower_trapezius", "serratus_anterior"],
    movementTags: ["reaching_overhead"],
    visualKey: "prone_y_raise"
  },

  PRONE_T_RAISE: {
    id: "PRONE_T_RAISE",
    title: "Prone T Raise",
    bodyPart: "shoulder",
    category: "strength",
    level: "intermediate",
    intent: "Strengthen middle trapezius and posterior deltoid",
    description: "Lying face down with arms out to the sides in a T position, lift your arms toward the ceiling with thumbs pointing up. Squeeze your shoulder blades together at the top.",
    cues: [
      "Arms straight out to sides",
      "Thumbs up",
      "Squeeze shoulder blades at top",
      "Control the lowering"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 2, restSeconds: 45 },
    equipment: ["none"],
    position: "prone",
    targetMuscles: ["middle_trapezius", "rhomboids", "posterior_deltoid"],
    visualKey: "prone_t_raise"
  },

  PRONE_W_RAISE: {
    id: "PRONE_W_RAISE",
    title: "Prone W Raise",
    bodyPart: "shoulder",
    category: "strength",
    level: "intermediate",
    intent: "Strengthen rotator cuff with scapular retraction",
    description: "Lying face down with elbows bent and arms in a W position, lift your arms while externally rotating (thumbs toward ceiling) and squeezing shoulder blades together. This combines scapular and rotator cuff work.",
    cues: [
      "Elbows bent, arms in W",
      "Lift and rotate thumbs up",
      "Squeeze shoulder blades",
      "Hold at top"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, holdSeconds: 2, restSeconds: 45 },
    equipment: ["none"],
    position: "prone",
    targetMuscles: ["rotator_cuff", "middle_trapezius", "rhomboids"],
    movementTags: ["external_rotation"],
    visualKey: "prone_w_raise"
  },

  BAND_PULL_APART: {
    id: "BAND_PULL_APART",
    title: "Band Pull Apart",
    bodyPart: "shoulder",
    category: "strength",
    level: "intermediate",
    intent: "Strengthen posterior shoulder and scapular muscles",
    description: "Hold a resistance band with both hands at shoulder width, arms straight in front of you at shoulder height. Pull the band apart by squeezing your shoulder blades together until the band touches your chest. Return with control.",
    cues: [
      "Arms straight, shoulder height",
      "Pull apart to chest",
      "Squeeze shoulder blades",
      "Control the return"
    ],
    commonMistakes: [
      "Bending elbows",
      "Shrugging shoulders",
      "Not enough range",
      "Snapping back"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 45 },
    equipment: ["resistance_band"],
    position: "standing",
    progression: {
      prerequisite: "SCAPULAR_SQUEEZE",
      nextLevel: "FACE_PULL",
      progressionTips: "Use heavier band, progress to face pulls"
    },
    targetMuscles: ["posterior_deltoid", "rhomboids", "middle_trapezius"],
    visualKey: "band_pull_apart"
  },

  STANDING_ER_BAND: {
    id: "STANDING_ER_BAND",
    title: "Standing External Rotation (Band)",
    bodyPart: "shoulder",
    category: "strength",
    level: "intermediate",
    intent: "Strengthen external rotators in functional position",
    description: "Stand with a resistance band anchored at elbow height. Hold the band with your elbow bent 90 degrees and tucked at your side. Rotate your forearm outward against the band resistance, then return with control.",
    cues: [
      "Elbow stays at side",
      "Rotate outward against band",
      "Control the return",
      "Don't lean away"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 45 },
    equipment: ["resistance_band"],
    position: "standing",
    progression: {
      prerequisite: "SIDELYING_ER",
      nextLevel: "ER_90_90",
      progressionTips: "Progress to 90/90 position"
    },
    targetMuscles: ["infraspinatus", "teres_minor"],
    movementTags: ["external_rotation"],
    visualKey: "standing_er_band"
  },

  FACE_PULL: {
    id: "FACE_PULL",
    title: "Face Pull",
    bodyPart: "shoulder",
    category: "strength",
    level: "intermediate",
    intent: "Strengthen posterior shoulder with external rotation",
    description: "Using a band or cable at face height, pull toward your face while separating your hands and externally rotating. End position should have elbows high, hands by ears, and shoulder blades squeezed together.",
    cues: [
      "Pull to face level",
      "Elbows high",
      "Rotate hands back",
      "Squeeze shoulder blades"
    ],
    commonMistakes: [
      "Pulling too low",
      "Not externally rotating",
      "Leaning back",
      "Elbows dropping"
    ],
    defaultDosage: { type: "reps", value: 15, sets: 3, restSeconds: 45 },
    equipment: ["resistance_band"],
    position: "standing",
    progression: {
      prerequisite: "BAND_PULL_APART",
      progressionTips: "Increase resistance, add pause at end"
    },
    targetMuscles: ["posterior_deltoid", "rotator_cuff", "middle_trapezius"],
    movementTags: ["external_rotation", "pulling"],
    visualKey: "face_pull"
  },

  // ============================================
  // ADVANCED LEVEL - High Demand Movements
  // ============================================

  ER_90_90: {
    id: "ER_90_90",
    title: "External Rotation at 90/90",
    bodyPart: "shoulder",
    category: "strength",
    level: "advanced",
    intent: "Strengthen external rotators in throwing position",
    description: "With your arm abducted 90 degrees (out to the side) and elbow bent 90 degrees, rotate your forearm from pointing down to pointing up. This position mimics the late cocking phase of throwing and is important for overhead athletes.",
    cues: [
      "Arm out to side at 90 degrees",
      "Elbow bent 90 degrees",
      "Rotate forearm up",
      "Control throughout"
    ],
    commonMistakes: [
      "Arm not at 90 degrees",
      "Elbow dropping",
      "Using body momentum",
      "Incomplete range"
    ],
    defaultDosage: { type: "reps", value: 12, sets: 3, restSeconds: 60 },
    equipment: ["resistance_band"],
    position: "standing",
    progression: {
      prerequisite: "STANDING_ER_BAND",
      progressionTips: "Increase resistance, add rhythmic stabilization"
    },
    targetMuscles: ["infraspinatus", "teres_minor"],
    movementTags: ["external_rotation", "throwing_motion"],
    visualKey: "er_90_90"
  },

  PUSH_UP_PLUS: {
    id: "PUSH_UP_PLUS",
    title: "Push-Up Plus",
    bodyPart: "shoulder",
    category: "strength",
    level: "advanced",
    intent: "Strengthen serratus anterior in functional position",
    description: "From a push-up position (or modified on knees), perform a push-up, then at the top, push further by protracting your shoulder blades - rounding your upper back slightly. This 'plus' at the top targets the serratus anterior.",
    cues: [
      "Complete push-up first",
      "At top, push further",
      "Round upper back slightly",
      "Feel shoulder blades spread apart"
    ],
    commonMistakes: [
      "Skipping the plus",
      "Sagging hips",
      "Not enough protraction"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, restSeconds: 60 },
    equipment: ["none"],
    position: "prone",
    modifications: [
      "Start on knees",
      "Do against wall for easier version"
    ],
    progression: {
      nextLevel: "PUSH_UP_PLUS_UNSTABLE",
      progressionTips: "Progress to unstable surface, add weight"
    },
    targetMuscles: ["serratus_anterior", "pectorals", "triceps"],
    movementTags: ["pushing"],
    visualKey: "push_up_plus"
  },

  TURKISH_GET_UP_PARTIAL: {
    id: "TURKISH_GET_UP_PARTIAL",
    title: "Turkish Get-Up (Partial)",
    bodyPart: "shoulder",
    category: "stability",
    level: "advanced",
    intent: "Build shoulder stability through multiple positions",
    description: "Lying on your back holding a weight straight up, roll to your elbow, then to your hand, keeping the weight pointed at the ceiling throughout. This challenges shoulder stability in multiple positions. Start with just the first few positions.",
    cues: [
      "Weight stays pointed at ceiling",
      "Eyes on the weight",
      "Move slowly and controlled",
      "Stable shoulder throughout"
    ],
    commonMistakes: [
      "Weight drifting",
      "Moving too fast",
      "Losing shoulder position",
      "Not watching the weight"
    ],
    defaultDosage: { type: "reps", value: 3, sets: 3, restSeconds: 90 },
    equipment: ["weight"],
    position: "supine",
    redFlags: [
      "Shoulder pain",
      "Feeling of instability"
    ],
    targetMuscles: ["rotator_cuff", "deltoid", "core"],
    visualKey: "turkish_get_up"
  },

  // ============================================
  // FLEXIBILITY & STRETCHING
  // ============================================

  SLEEPER_STRETCH: {
    id: "SLEEPER_STRETCH",
    title: "Sleeper Stretch",
    bodyPart: "shoulder",
    category: "flexibility",
    level: "intermediate",
    intent: "Improve internal rotation mobility",
    description: "Lie on your affected side with that arm straight out in front of you, elbow bent 90 degrees. Use your other hand to gently push your forearm toward the floor, creating internal rotation. Stop at the first sign of stretch - don't force.",
    cues: [
      "Lie on affected side",
      "Elbow bent 90 degrees",
      "Gently push forearm down",
      "Stop at first stretch"
    ],
    commonMistakes: [
      "Forcing the stretch",
      "Rolling backward",
      "Shoulder hiking up"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 15 },
    equipment: ["none"],
    position: "sidelying",
    contraindications: [
      { condition: "Anterior shoulder instability", reason: "May stress anterior structures" }
    ],
    targetMuscles: ["posterior_capsule", "infraspinatus"],
    movementTags: ["internal_rotation"],
    visualKey: "sleeper_stretch"
  },

  CROSS_BODY_STRETCH: {
    id: "CROSS_BODY_STRETCH",
    title: "Cross Body Stretch",
    bodyPart: "shoulder",
    category: "flexibility",
    level: "beginner",
    intent: "Stretch posterior shoulder",
    description: "Bring your affected arm across your body at shoulder height. Use your other hand to gently pull the arm closer to your chest, feeling a stretch in the back of the shoulder. Keep the shoulder down - don't let it hike up.",
    cues: [
      "Arm across body at shoulder height",
      "Pull with other hand above elbow",
      "Keep shoulder down",
      "Feel stretch in back of shoulder"
    ],
    commonMistakes: [
      "Shoulder hiking up",
      "Pulling too hard",
      "Arm too high or low"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 15 },
    equipment: ["none"],
    position: "standing",
    targetMuscles: ["posterior_deltoid", "posterior_capsule"],
    movementTags: ["reaching_across_body"],
    visualKey: "cross_body_stretch"
  },

  DOORWAY_PEC_STRETCH: {
    id: "DOORWAY_PEC_STRETCH",
    title: "Doorway Pec Stretch",
    bodyPart: "shoulder",
    category: "flexibility",
    level: "beginner",
    intent: "Stretch pectorals and anterior shoulder",
    description: "Stand in a doorway with your forearm on the door frame, elbow at shoulder height. Step through the doorway with the same-side foot until you feel a stretch in your chest and front of shoulder. Try different arm heights to target different areas.",
    cues: [
      "Forearm on door frame",
      "Step through doorway",
      "Feel stretch in chest",
      "Try different arm heights"
    ],
    commonMistakes: [
      "Arm too high causing impingement",
      "Forcing too far",
      "Twisting body"
    ],
    defaultDosage: { type: "time", value: 30, sets: 3, restSeconds: 15 },
    equipment: ["none"],
    position: "standing",
    contraindications: [
      { condition: "Anterior instability", reason: "May stress anterior structures" }
    ],
    targetMuscles: ["pectoralis_major", "anterior_deltoid"],
    visualKey: "doorway_pec_stretch"
  },

  WALL_ANGEL: {
    id: "WALL_ANGEL",
    title: "Wall Angel",
    bodyPart: "shoulder",
    category: "mobility",
    level: "intermediate",
    intent: "Improve overhead mobility with postural feedback",
    description: "Stand with your back flat against a wall, arms in a 'goal post' position with backs of hands touching the wall. Slowly slide your arms up and down the wall like making a snow angel, keeping contact with the wall throughout.",
    cues: [
      "Back flat against wall",
      "Arms in goal post position",
      "Slide up and down",
      "Maintain wall contact"
    ],
    commonMistakes: [
      "Losing wall contact",
      "Arching lower back",
      "Shrugging shoulders"
    ],
    defaultDosage: { type: "reps", value: 10, sets: 3, restSeconds: 45 },
    equipment: ["wall"],
    position: "standing",
    progression: {
      prerequisite: "WALL_SLIDE",
      progressionTips: "Progress to floor angels for more challenge"
    },
    targetMuscles: ["rotator_cuff", "serratus_anterior", "lower_trapezius"],
    movementTags: ["reaching_overhead"],
    visualKey: "wall_angel"
  },
};

export const SHOULDER_EXERCISE_COUNT = Object.keys(SHOULDER_EXERCISES).length;
