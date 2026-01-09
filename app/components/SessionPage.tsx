"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BodyPart, BODY_PART_INFO } from "@/lib/body-parts";
import { 
  getExercisesByBodyPart, 
  getExercisesForMode,
  Exercise 
} from "@/lib/exercises";

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
  const info = BODY_PART_INFO[bodyPart];

  // Load session state
  useEffect(() => {
    const key = `bodyCoach.${bodyPart}.session`;
    const raw = localStorage.getItem(key);
    
    if (raw) {
      try {
        setState(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to parse session state");
      }
    } else {
      // No session - check for readiness to create one
      const readinessKey = `bodyCoach.${bodyPart}.lastReadiness`;
      const readinessRaw = localStorage.getItem(readinessKey);
      
      if (readinessRaw) {
        try {
          const readiness = JSON.parse(readinessRaw);
          const mode = readiness.mode || "TRAINING";
          
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
          localStorage.setItem(key, JSON.stringify(newState));
        } catch (e) {
          console.error("Failed to create session from readiness");
        }
      }
    }
    
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

  // Save state helper
  const saveState = (newState: SessionState) => {
    setState(newState);
    localStorage.setItem(`bodyCoach.${bodyPart}.session`, JSON.stringify(newState));
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

  // End session
  const endSession = () => {
    localStorage.removeItem(`bodyCoach.${bodyPart}.session`);
    // Could save to outcomes here
  };

  // Loading state
  if (loading) {
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
        <p>Loading session...</p>
      </main>
    );
  }

  // No session state
  if (!state) {
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>{info.icon} Session</h1>
          <Link href={`/${bodyPart}`} className="btn">← Back</Link>
        </div>
        
        <div className="card">
          <h3 style={{ margin: "0 0 12px 0" }}>No Active Session</h3>
          <p className="muted">
            Complete your daily check-in first to start a session.
          </p>
          <Link href={`/${bodyPart}`} className="btn btn-primary" style={{ display: "inline-block", marginTop: 12 }}>
            Go to Check-in
          </Link>
        </div>
      </main>
    );
  }

  // Session complete
  if (!currentExercise) {
    const completedCount = Object.values(state.feedback).filter(f => f.completed).length;
    const avgPain = Object.values(state.feedback).reduce((sum, f) => sum + (f.painDuring || 0), 0) / Math.max(completedCount, 1);
    
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>{info.icon} Session Complete!</h1>
        </div>
        
        <div className="card" style={{ 
          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, #121214 100%)",
          borderColor: "#22c55e"
        }}>
          <div style={{ fontSize: 48, textAlign: "center", marginBottom: 12 }}>🎉</div>
          <h2 style={{ margin: "0 0 16px 0", textAlign: "center" }}>Great Work!</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div className="card" style={{ textAlign: "center", padding: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{completedCount}</div>
              <div className="muted" style={{ fontSize: 12 }}>Exercises</div>
            </div>
            <div className="card" style={{ textAlign: "center", padding: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{avgPain.toFixed(1)}</div>
              <div className="muted" style={{ fontSize: 12 }}>Avg Pain</div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: 8 }}>
            <Link 
              href={`/${bodyPart}`} 
              className="btn btn-primary" 
              style={{ flex: 1, textAlign: "center" }}
              onClick={endSession}
            >
              Done
            </Link>
          </div>
        </div>
        
        <p className="muted" style={{ marginTop: 16, fontSize: 12, textAlign: "center" }}>
          Your session data has been saved. Check back tomorrow for your next check-in!
        </p>
      </main>
    );
  }

  // Active session - show current exercise
  const progress = ((state.currentIndex) / state.exercises.length) * 100;

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      {/* Header */}
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{info.icon} {info.name} Session</h1>
        <span className={`mode-badge ${state.mode.toLowerCase()}`}>{state.mode}</span>
      </div>
      
      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
          Exercise {state.currentIndex + 1} of {state.exercises.length}
        </div>
        <div style={{ height: 4, background: "#2a2a2d", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ 
            height: "100%", 
            width: `${progress}%`, 
            background: info.color,
            transition: "width 0.3s ease"
          }} />
        </div>
      </div>

      {/* Exercise Card */}
      <div className="card">
        <h2 style={{ margin: "0 0 4px 0" }}>{currentExercise.title}</h2>
        <p className="muted" style={{ margin: "0 0 16px 0", fontSize: 14 }}>
          {currentExercise.intent}
        </p>

        {/* Description */}
        <div style={{ 
          padding: 12, 
          background: "#1a1a1d", 
          borderRadius: 8, 
          marginBottom: 16,
          fontSize: 14,
          lineHeight: 1.5
        }}>
          {currentExercise.description}
        </div>

        {/* Cues */}
        <div style={{ marginBottom: 16 }}>
          <div className="section-header">Cues</div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {currentExercise.cues.map((cue, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{cue}</li>
            ))}
          </ul>
        </div>

        {/* Dosage */}
        <div style={{ 
          display: "flex", 
          gap: 16, 
          padding: 12, 
          background: "#1a1a1d", 
          borderRadius: 8,
          marginBottom: 16 
        }}>
          <div>
            <div className="muted" style={{ fontSize: 11, textTransform: "uppercase" }}>Sets</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{currentExercise.defaultDosage.sets}</div>
          </div>
          <div>
            <div className="muted" style={{ fontSize: 11, textTransform: "uppercase" }}>
              {currentExercise.defaultDosage.type === "reps" ? "Reps" : "Seconds"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{currentExercise.defaultDosage.value}</div>
          </div>
          {currentExercise.defaultDosage.holdSeconds && (
            <div>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase" }}>Hold</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{currentExercise.defaultDosage.holdSeconds}s</div>
            </div>
          )}
        </div>

        <hr />

        {/* Feedback */}
        <div style={{ marginTop: 16 }}>
          <label>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>Pain during exercise</span>
              <span style={{ fontWeight: 600 }}>{currentFeedback.painDuring}/10</span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={10} 
              value={currentFeedback.painDuring}
              onChange={(e) => updateFeedback({ painDuring: Number(e.target.value) })}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            <input
              type="checkbox"
              checked={currentFeedback.feltStable}
              onChange={(e) => updateFeedback({ feltStable: e.target.checked })}
            />
            <span>Felt stable throughout</span>
          </label>

          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>How did it feel?</div>
            <div style={{ display: "flex", gap: 8 }}>
              {(["too_easy", "just_right", "too_hard"] as const).map((diff) => (
                <button
                  key={diff}
                  className={`btn ${currentFeedback.difficulty === diff ? "btn-primary" : ""}`}
                  style={{ flex: 1, fontSize: 12, padding: "8px 4px" }}
                  onClick={() => updateFeedback({ difficulty: diff })}
                >
                  {diff === "too_easy" ? "Too Easy" : diff === "just_right" ? "Just Right" : "Too Hard"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button className="btn" onClick={skipExercise} style={{ flex: 1 }}>
            Skip
          </button>
          <button className="btn btn-primary" onClick={completeExercise} style={{ flex: 2 }}>
            Complete ✓
          </button>
        </div>

        {/* Warning for high pain */}
        {currentFeedback.painDuring >= 6 && (
          <div style={{ 
            marginTop: 12, 
            padding: 10, 
            background: "rgba(239, 68, 68, 0.15)", 
            borderRadius: 8,
            border: "1px solid rgba(239, 68, 68, 0.3)",
            fontSize: 13
          }}>
            ⚠️ High pain reported. Consider stopping or modifying the exercise.
          </div>
        )}
      </div>

      {/* Quick exit */}
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Link 
          href={`/${bodyPart}`} 
          className="muted" 
          style={{ fontSize: 13 }}
          onClick={endSession}
        >
          End session early
        </Link>
      </div>
    </main>
  );
}
