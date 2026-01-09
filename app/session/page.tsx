"use client";

import { useEffect, useMemo, useState } from "react";
import { CoachState, adjustPlanInSession } from "@/lib/coach";
import { DRILLS, DrillId } from "@/lib/drills";
import { CalibrationProfile, loadCalibration, ROM_ZONES } from "@/lib/calibration";
import Link from "next/link";

type Feedback = { pain: number; feltStable: boolean; notes?: string };

function getVisualPath(visualKey: string) {
  // Visuals go in /public/visuals/<key>-good.png later (photorealistic)
  return `/visuals/${visualKey}-good.png`;
}

export default function SessionPage() {
  const [state, setState] = useState<CoachState | null>(null);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [calibration, setCalibration] = useState<CalibrationProfile | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("kneeCoach.coachState");
    if (raw) setState(JSON.parse(raw));
    
    // Load calibration for context
    const cal = loadCalibration();
    setCalibration(cal);
  }, []);
  
  // Get problem zone description
  const problemZoneInfo = useMemo(() => {
    if (!calibration || calibration.problemZones.length === 0) return null;
    const primaryZone = calibration.problemZones.sort((a, b) => b.severity - a.severity)[0];
    return {
      label: ROM_ZONES[primaryZone.zoneIndex].label,
      severity: primaryZone.severity,
    };
  }, [calibration]);

  const plan = state?.plan ?? [];
  const currentId = plan[index] as DrillId | undefined;
  const drill = currentId ? DRILLS[currentId] : null;

  const currentFeedback = useMemo(() => {
    if (!currentId) return { pain: 0, feltStable: true };
    return feedback[currentId] ?? { pain: 0, feltStable: true };
  }, [feedback, currentId]);

  function updateCurrent(partial: Partial<Feedback>) {
    if (!currentId) return;
    setFeedback((prev) => ({ ...prev, [currentId]: { ...currentFeedback, ...partial } }));
  }

  function completeDrill() {
    if (!state || !currentId) return;
    const fb = feedback[currentId] ?? { pain: 0, feltStable: true };

    const nextState = adjustPlanInSession(state, {
      drillId: currentId,
      pain: fb.pain,
      feltStable: fb.feltStable,
      notes: fb.notes,
    });

    setState(nextState);
    localStorage.setItem("kneeCoach.coachState", JSON.stringify(nextState));

    // If regressed to RESET, restart the plan from beginning
    if (nextState.mode === "RESET" && state.mode !== "RESET") {
      setIndex(0);
      return;
    }

    setIndex((i) => Math.min(i + 1, nextState.plan.length));
  }

  if (!state) return <main style={{ padding: 16 }}>Loading…</main>;

  if (!drill) {
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 style={{ margin: 0 }}>Session complete</h1>
          <Link href="/" className="badge">Home</Link>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <div className="row">
            <div className="muted">Final mode:</div>
            <div style={{ fontWeight: 800 }}>{state.mode}</div>
          </div>
          <p className="muted">Data is saved locally (MVP). Next step: add next-morning check-in + history.</p>
        </div>
      </main>
    );
  }

  const imgSrc = getVisualPath(drill.visualKey);

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>Session</h1>
        <Link href="/" className="badge">Home</Link>
      </div>

      <div className="muted" style={{ marginTop: 6 }}>
        Mode: <b>{state.mode}</b> • Drill {index + 1} / {plan.length}
      </div>

      <section className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0 }}>{drill.title}</h2>
        <p className="muted" style={{ marginTop: 6 }}>{drill.intent}</p>

        <div style={{ marginTop: 10 }}>
          {/* If image not present yet, browser shows broken image; we'll add photorealistic visuals next. */}
          <img
            src={imgSrc}
            alt={drill.title}
            style={{ width: "100%", borderRadius: 14, border: "1px solid #2a2a2d", background: "#0f0f12" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
            Visual key: {drill.visualKey} (photorealistic images will be added into /public/visuals)
          </div>
        </div>

        <ul style={{ marginTop: 10 }}>
          {drill.cues.map((c) => <li key={c}>{c}</li>)}
        </ul>

        <div className="row" style={{ marginTop: 10 }}>
          <div className="muted">Dosage:</div>
          <div>
            {drill.dosage.sets} ×{" "}
            {drill.dosage.type === "reps" ? `${drill.dosage.value} reps` : `${drill.dosage.value}s`}
            {drill.dosage.holdSeconds ? ` (hold ${drill.dosage.holdSeconds}s)` : ""}
          </div>
        </div>

        <label style={{ marginTop: 12 }}>
          Pain during drill (0–10): <span className="muted">{currentFeedback.pain}</span>
          <input type="range" min={0} max={10} value={currentFeedback.pain} onChange={(e) => updateCurrent({ pain: Number(e.target.value) })} />
        </label>

        <label>
          <input
            type="checkbox"
            checked={currentFeedback.feltStable}
            onChange={(e) => updateCurrent({ feltStable: e.target.checked })}
          />{" "}
          Felt stable through the arc
          {problemZoneInfo && (
            <span className="muted" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
              Especially in your {problemZoneInfo.label} range
            </span>
          )}
        </label>

        <button className="btn" onClick={completeDrill} style={{ marginTop: 12 }}>
          Complete drill
        </button>

        {problemZoneInfo && (
          <div 
            style={{ 
              marginTop: 12, 
              padding: 10, 
              background: "#1a1a1d", 
              borderRadius: 8,
              border: "1px solid #2a2a2d",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
              🎯 Your focus zone: {problemZoneInfo.label}
            </div>
            <div className="muted" style={{ fontSize: 12 }}>
              Pay extra attention to sensations when your knee is in this range.
            </div>
          </div>
        )}

        <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
          If pain spikes or stability fails, the coach auto-regresses you to RESET immediately.
        </p>
      </section>
    </main>
  );
}
