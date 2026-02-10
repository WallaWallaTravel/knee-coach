"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BodyPart, BODY_PART_INFO } from "@/lib/body-parts";
import { safeGet, safeSet, safeRemove } from "@/lib/storage/safe-storage";
import {
  getExercisesByBodyPart,
  getExercisesForMode,
  getExercise,
  Exercise
} from "@/lib/exercises";
import {
  getOrCreateOutcomeData,
  addSession,
  saveOutcomeData,
  type ExerciseSession,
  type Milestone,
  type OutcomeData,
} from "@/lib/tracking/outcomes";
import {
  getAdaptedDosageLevel,
  selectDosage,
} from "@/lib/tracking/analytics";

interface SessionState {
  mode: "RESET" | "TRAINING" | "GAME";
  exercises: string[]; // exercise IDs
  currentIndex: number;
  feedback: Record<string, ExerciseFeedback>;
  startedAt: string;
}

interface ExerciseFeedback {
  painDuring: number;
  feltStable: boolean;
  difficulty: "too_easy" | "just_right" | "too_hard";
  completed: boolean;
}

interface SessionPageProps {
  bodyPart: BodyPart;
}

export function SessionPageComponent({ bodyPart }: SessionPageProps) {
  const [state, setState] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMilestones, setNewMilestones] = useState<Milestone[]>([]);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [historyData, setHistoryData] = useState<OutcomeData | null>(null);
  const info = BODY_PART_INFO[bodyPart];

  // Load session state
  useEffect(() => {
    const key = `bodyCoach.${bodyPart}.session`;
    const saved = safeGet<SessionState | null>(key, null);

    if (saved) {
      setState(saved);
    } else {
      // No session - check for coachState to create one
      const coachState = safeGet<{ mode?: string } | null>(`bodyCoach.${bodyPart}.coachState`, null);

      if (coachState) {
        const mode = (coachState.mode || "TRAINING") as "RESET" | "TRAINING" | "GAME";

        // Get exercises for this mode
        const exercises = getExercisesForMode(bodyPart, mode);
        const exerciseIds = exercises.slice(0, 6).map(e => e.id); // Limit to 6 exercises

        const newState: SessionState = {
          mode,
          exercises: exerciseIds,
          currentIndex: 0,
          feedback: {},
          startedAt: new Date().toISOString(),
        };

        setState(newState);
        safeSet(key, newState);
      }
    }

    // Load historical data for dosage adaptation
    setHistoryData(getOrCreateOutcomeData(bodyPart));

    setLoading(false);
  }, [bodyPart]);

  // Get current exercise
  const currentExercise = useMemo(() => {
    if (!state || state.currentIndex >= state.exercises.length) return null;
    const exercises = getExercisesByBodyPart(bodyPart);
    return exercises.find(e => e.id === state.exercises[state.currentIndex]) || null;
  }, [state, bodyPart]);

  const currentFeedback = useMemo(() => {
    if (!state || !currentExercise) return { painDuring: 0, feltStable: true, difficulty: "just_right" as const, completed: false };
    return state.feedback[currentExercise.id] || { painDuring: 0, feltStable: true, difficulty: "just_right" as const, completed: false };
  }, [state, currentExercise]);

  // Adapted dosage based on historical feedback
  const adaptedDosage = useMemo(() => {
    if (!currentExercise) return null;
    const level = historyData
      ? getAdaptedDosageLevel(currentExercise.id, historyData)
      : "default";
    return selectDosage(
      currentExercise.defaultDosage,
      currentExercise.minDosage,
      currentExercise.maxDosage,
      level
    );
  }, [currentExercise, historyData]);

  // Save state helper
  const saveState = (newState: SessionState) => {
    setState(newState);
    safeSet(`bodyCoach.${bodyPart}.session`, newState);
  };

  // Update feedback for current exercise
  const updateFeedback = (partial: Partial<ExerciseFeedback>) => {
    if (!state || !currentExercise) return;

    const newFeedback = {
      ...state.feedback,
      [currentExercise.id]: { ...currentFeedback, ...partial }
    };

    saveState({ ...state, feedback: newFeedback });
  };

  // Complete current exercise and move to next
  const completeExercise = () => {
    if (!state || !currentExercise) return;

    // Mark as completed
    const newFeedback = {
      ...state.feedback,
      [currentExercise.id]: { ...currentFeedback, completed: true }
    };

    // Check if pain is high - might need to regress
    if (currentFeedback.painDuring >= 6) {
      // High pain - consider stopping or regressing
      const shouldRegress = currentFeedback.painDuring >= 8 || !currentFeedback.feltStable;

      if (shouldRegress && state.mode !== "RESET") {
        // Regress to RESET mode
        const resetExercises = getExercisesForMode(bodyPart, "RESET");
        const resetIds = resetExercises.slice(0, 4).map(e => e.id);

        saveState({
          ...state,
          mode: "RESET",
          exercises: resetIds,
          currentIndex: 0,
          feedback: newFeedback,
        });
        return;
      }
    }

    // Move to next exercise
    saveState({
      ...state,
      currentIndex: state.currentIndex + 1,
      feedback: newFeedback,
    });
  };

  // Skip exercise
  const skipExercise = () => {
    if (!state) return;
    saveState({
      ...state,
      currentIndex: state.currentIndex + 1,
    });
  };

  // Determine if session is complete (all exercises done)
  const isSessionComplete = !!state && state.currentIndex >= state.exercises.length;

  // Save session outcome data when session completes
  useEffect(() => {
    if (!isSessionComplete || sessionSaved || !state) return;

    const exercisesCompleted = Object.entries(state.feedback)
      .filter(([, fb]) => fb.completed)
      .map(([exerciseId, fb]) => {
        const exercise = getExercise(exerciseId);
        const dosage = exercise?.defaultDosage;
        return {
          exerciseId,
          sets: dosage?.sets ?? 0,
          reps: dosage?.type === "reps" ? dosage.value : undefined,
          duration: dosage?.type === "time" ? dosage.value : undefined,
          difficulty: fb.difficulty,
          painDuring: fb.painDuring,
        };
      });

    const allFeedback = Object.values(state.feedback).filter(f => f.completed);
    const avgDifficulty = allFeedback.length > 0
      ? (allFeedback.filter(f => f.difficulty === "too_hard").length > allFeedback.length / 2
        ? "too_hard" as const
        : allFeedback.filter(f => f.difficulty === "too_easy").length > allFeedback.length / 2
          ? "too_easy" as const
          : "just_right" as const)
      : "just_right" as const;

    const startTime = new Date(state.startedAt).getTime();
    const durationMinutes = Math.round((Date.now() - startTime) / 60000);

    const sessionData: Omit<ExerciseSession, "id" | "timestamp"> = {
      date: new Date().toISOString(),
      bodyPart,
      exercisesCompleted,
      totalDuration: durationMinutes,
      overallDifficulty: avgDifficulty,
    };

    const outcomeData = getOrCreateOutcomeData(bodyPart);
    const previousMilestoneCount = outcomeData.milestones.length;
    const updated = addSession(outcomeData, sessionData);
    saveOutcomeData(updated);

    if (updated.milestones.length > previousMilestoneCount) {
      setNewMilestones(updated.milestones.slice(previousMilestoneCount));
    }

    setSessionSaved(true);
  }, [isSessionComplete, sessionSaved, state, bodyPart]);

  // Clean up session from localStorage (called when user clicks Done)
  const endSession = () => {
    // Save outcomes if not already saved (e.g. ending early)
    if (state && !sessionSaved) {
      const exercisesCompleted = Object.entries(state.feedback)
        .filter(([, fb]) => fb.completed)
        .map(([exerciseId, fb]) => {
          const exercise = getExercise(exerciseId);
          const dosage = exercise?.defaultDosage;
          return {
            exerciseId,
            sets: dosage?.sets ?? 0,
            reps: dosage?.type === "reps" ? dosage.value : undefined,
            duration: dosage?.type === "time" ? dosage.value : undefined,
            difficulty: fb.difficulty,
            painDuring: fb.painDuring,
          };
        });

      if (exercisesCompleted.length > 0) {
        const allFeedback = Object.values(state.feedback).filter(f => f.completed);
        const avgDifficulty = allFeedback.length > 0
          ? (allFeedback.filter(f => f.difficulty === "too_hard").length > allFeedback.length / 2
            ? "too_hard" as const
            : allFeedback.filter(f => f.difficulty === "too_easy").length > allFeedback.length / 2
              ? "too_easy" as const
              : "just_right" as const)
          : "just_right" as const;

        const startTime = new Date(state.startedAt).getTime();
        const durationMinutes = Math.round((Date.now() - startTime) / 60000);

        const sessionData: Omit<ExerciseSession, "id" | "timestamp"> = {
          date: new Date().toISOString(),
          bodyPart,
          exercisesCompleted,
          totalDuration: durationMinutes,
          overallDifficulty: avgDifficulty,
        };

        const outcomeData = getOrCreateOutcomeData(bodyPart);
        const updated = addSession(outcomeData, sessionData);
        saveOutcomeData(updated);
      }
    }

    safeRemove(`bodyCoach.${bodyPart}.session`);
  };

  // Loading state
  if (loading) {
    return (
      <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
        <p>Loading session...</p>
      </main>
    );
  }

  // No session state
  if (!state) {
    return (
      <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="m-0">{info.icon} Session</h1>
          <Link href={`/${bodyPart}`} className="btn">← Back</Link>
        </div>

        <div className="card">
          <h3 className="m-0 mb-3">No Active Session</h3>
          <p className="muted">
            Complete your daily check-in first to start a session.
          </p>
          <Link href={`/${bodyPart}`} className="btn btn-primary inline-block mt-3">
            Go to Check-in
          </Link>
        </div>
      </main>
    );
  }

  // Session complete
  if (isSessionComplete) {
    const completedCount = Object.values(state.feedback).filter(f => f.completed).length;
    const avgPain = Object.values(state.feedback).reduce((sum, f) => sum + (f.painDuring || 0), 0) / Math.max(completedCount, 1);
    const stableCount = Object.values(state.feedback).filter(f => f.completed && f.feltStable).length;
    const stabilityRate = completedCount > 0 ? Math.round((stableCount / completedCount) * 100) : 0;

    return (
      <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="m-0">{info.icon} Session Complete!</h1>
        </div>

        <div className="card border-green-500" style={{
          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, var(--color-surface-raised) 100%)",
        }}>
          <div className="text-5xl text-center mb-3">🎉</div>
          <h2 className="m-0 mb-4 text-center">Great Work!</h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="card text-center p-3">
              <div className="text-2xl font-bold">{completedCount}</div>
              <div className="muted text-xs">Exercises</div>
            </div>
            <div className="card text-center p-3">
              <div className="text-2xl font-bold">{avgPain.toFixed(1)}</div>
              <div className="muted text-xs">Avg Pain</div>
            </div>
            <div className="card text-center p-3">
              <div className="text-2xl font-bold">{stabilityRate}%</div>
              <div className="muted text-xs">Stability</div>
            </div>
          </div>

          {/* New milestone celebrations */}
          {newMilestones.length > 0 && (
            <div className="mb-4">
              {newMilestones.map((m) => (
                <div key={m.id} className="p-3 bg-indigo-500/15 rounded-lg border border-indigo-500/30 mb-2 text-center">
                  <div className="text-xl mb-1">🏆</div>
                  <div className="font-bold text-sm">{m.title}</div>
                  <div className="muted text-xs">{m.description}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Link
              href={`/${bodyPart}`}
              className="btn btn-primary flex-1 text-center"
              onClick={endSession}
            >
              Done
            </Link>
          </div>
        </div>

        <p className="muted mt-4 text-xs text-center">
          Session saved to your progress history. Check back tomorrow!
        </p>
      </main>
    );
  }

  // Active session - show current exercise
  // currentExercise is guaranteed non-null here since isSessionComplete was false
  if (!currentExercise) return null;
  const progress = ((state.currentIndex) / state.exercises.length) * 100;

  return (
    <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="m-0 text-xl">{info.icon} {info.name} Session</h1>
        <span className={`mode-badge ${state.mode.toLowerCase()}`}>{state.mode}</span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="muted text-xs mb-1">
          Exercise {state.currentIndex + 1} of {state.exercises.length}
        </div>
        <div className="h-1 bg-surface-border rounded-sm overflow-hidden">
          <div
            className="h-full transition-[width] duration-300 ease-in-out rounded-sm"
            style={{ width: `${progress}%`, background: info.color }}
          />
        </div>
      </div>

      {/* Exercise Card */}
      <div className="card">
        <h2 className="m-0 mb-1">{currentExercise.title}</h2>
        <p className="muted m-0 mb-4 text-sm">
          {currentExercise.intent}
        </p>

        {/* Description */}
        <div className="p-3 bg-surface-raised rounded-lg mb-4 text-sm leading-relaxed">
          {currentExercise.description}
        </div>

        {/* Cues */}
        <div className="mb-4">
          <div className="section-header">Cues</div>
          <ul className="m-0 pl-5">
            {currentExercise.cues.map((cue, i) => (
              <li key={i} className="mb-1">{cue}</li>
            ))}
          </ul>
        </div>

        {/* Dosage (adapted based on history) */}
        {adaptedDosage && (
          <div className="p-3 bg-surface-raised rounded-lg mb-4">
            {adaptedDosage.label !== "Standard" && (
              <div className={`text-[11px] uppercase mb-2 font-semibold ${
                adaptedDosage.label === "Advanced" ? "text-green-500" : "text-amber-500"
              }`}>
                {adaptedDosage.label === "Advanced" ? "Progressed dosage" : "Eased dosage"} -- based on your recent sessions
              </div>
            )}
            <div className="flex gap-4">
              <div>
                <div className="muted text-[11px] uppercase">Sets</div>
                <div className="text-xl font-bold">{adaptedDosage.dosage.sets}</div>
              </div>
              <div>
                <div className="muted text-[11px] uppercase">
                  {adaptedDosage.dosage.type === "reps" ? "Reps" : "Seconds"}
                </div>
                <div className="text-xl font-bold">{adaptedDosage.dosage.value}</div>
              </div>
              {adaptedDosage.dosage.holdSeconds && (
                <div>
                  <div className="muted text-[11px] uppercase">Hold</div>
                  <div className="text-xl font-bold">{adaptedDosage.dosage.holdSeconds}s</div>
                </div>
              )}
            </div>
          </div>
        )}

        <hr />

        {/* Feedback */}
        <div className="mt-4">
          <label>
            <div className="flex justify-between mb-1">
              <span>Pain during exercise</span>
              <span className="font-semibold">{currentFeedback.painDuring}/10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={currentFeedback.painDuring}
              onChange={(e) => updateFeedback({ painDuring: Number(e.target.value) })}
            />
          </label>

          <label className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              checked={currentFeedback.feltStable}
              onChange={(e) => updateFeedback({ feltStable: e.target.checked })}
            />
            <span>Felt stable throughout</span>
          </label>

          <div className="mt-3">
            <div className="muted text-xs mb-1.5">How did it feel?</div>
            <div className="flex gap-2">
              {(["too_easy", "just_right", "too_hard"] as const).map((diff) => (
                <button
                  key={diff}
                  className={`btn flex-1 text-xs py-2 px-1 ${currentFeedback.difficulty === diff ? "btn-primary" : ""}`}
                  onClick={() => updateFeedback({ difficulty: diff })}
                >
                  {diff === "too_easy" ? "Too Easy" : diff === "just_right" ? "Just Right" : "Too Hard"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-5">
          <button className="btn flex-1" onClick={skipExercise}>
            Skip
          </button>
          <button className="btn btn-primary flex-[2]" onClick={completeExercise}>
            Complete ✓
          </button>
        </div>

        {/* Warning for high pain */}
        {currentFeedback.painDuring >= 6 && (
          <div className="mt-3 p-2.5 bg-red-500/15 rounded-lg border border-red-500/30 text-[13px]">
            ⚠️ High pain reported. Consider stopping or modifying the exercise.
          </div>
        )}
      </div>

      {/* Quick exit */}
      <div className="mt-4 text-center">
        <Link
          href={`/${bodyPart}`}
          className="muted text-[13px]"
          onClick={endSession}
        >
          End session early
        </Link>
      </div>
    </main>
  );
}
