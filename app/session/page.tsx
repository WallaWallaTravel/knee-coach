"use client";

import { useEffect, useMemo, useState } from "react";
import { CoachState, adjustPlanInSession } from "@/lib/coach";
import { DRILLS, DrillId } from "@/lib/drills";
import { CalibrationProfile, loadCalibration, ROM_ZONES } from "@/lib/calibration";
import Link from "next/link";
import { safeGet, safeSet } from "@/lib/storage/safe-storage";

type Feedback = { pain: number; feltStable: boolean; notes?: string };

function getVisualPath(visualKey: string) {
  return `/visuals/${visualKey}-good.png`;
}

export default function SessionPage() {
  const [state, setState] = useState<CoachState | null>(null);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [calibration, setCalibration] = useState<CalibrationProfile | null>(null);

  useEffect(() => {
    const raw = safeGet<CoachState | null>("kneeCoach.coachState", null);
    if (raw) setState(raw);

    const cal = loadCalibration();
    setCalibration(cal);
  }, []);

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
    safeSet("kneeCoach.coachState", nextState);

    if (nextState.mode === "RESET" && state.mode !== "RESET") {
      setIndex(0);
      return;
    }

    setIndex((i) => Math.min(i + 1, nextState.plan.length));
  }

  if (!state) return <main className="p-4">Loading…</main>;

  if (!drill) {
    return (
      <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
        <div className="flex items-center justify-between">
          <h1 className="m-0">Session complete</h1>
          <Link href="/" className="badge">Home</Link>
        </div>
        <div className="card mt-3">
          <div className="flex items-center gap-2">
            <div className="muted">Final mode:</div>
            <div className="font-extrabold">{state.mode}</div>
          </div>
          <p className="muted">Data is saved locally (MVP). Next step: add next-morning check-in + history.</p>
        </div>
      </main>
    );
  }

  const imgSrc = getVisualPath(drill.visualKey);

  return (
    <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
      <div className="flex items-center justify-between">
        <h1 className="m-0">Session</h1>
        <Link href="/" className="badge">Home</Link>
      </div>

      <div className="muted mt-1.5">
        Mode: <b>{state.mode}</b> • Drill {index + 1} / {plan.length}
      </div>

      <section className="card mt-3">
        <h2 className="mt-0">{drill.title}</h2>
        <p className="muted mt-1.5">{drill.intent}</p>

        <div className="mt-2.5">
          <img
            src={imgSrc}
            alt={drill.title}
            className="w-full rounded-[14px] border border-surface-border bg-surface"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <div className="muted text-xs mt-1.5">
            Visual key: {drill.visualKey} (photorealistic images will be added into /public/visuals)
          </div>
        </div>

        <ul className="mt-2.5">
          {drill.cues.map((c) => <li key={c}>{c}</li>)}
        </ul>

        <div className="flex items-center gap-2 mt-2.5">
          <div className="muted">Dosage:</div>
          <div>
            {drill.dosage.sets} ×{" "}
            {drill.dosage.type === "reps" ? `${drill.dosage.value} reps` : `${drill.dosage.value}s`}
            {drill.dosage.holdSeconds ? ` (hold ${drill.dosage.holdSeconds}s)` : ""}
          </div>
        </div>

        <label className="mt-3 block">
          Pain during drill (0–10): <span className="muted">{currentFeedback.pain}</span>
          <input type="range" min={0} max={10} value={currentFeedback.pain} onChange={(e) => updateCurrent({ pain: Number(e.target.value) })} />
        </label>

        <label className="block">
          <input
            type="checkbox"
            checked={currentFeedback.feltStable}
            onChange={(e) => updateCurrent({ feltStable: e.target.checked })}
          />{" "}
          Felt stable through the arc
          {problemZoneInfo && (
            <span className="muted text-xs block mt-1">
              Especially in your {problemZoneInfo.label} range
            </span>
          )}
        </label>

        <button className="btn mt-3" onClick={completeDrill}>
          Complete drill
        </button>

        {problemZoneInfo && (
          <div className="mt-3 p-2.5 bg-surface-raised rounded-lg border border-surface-border">
            <div className="text-xs font-medium mb-1">
              🎯 Your focus zone: {problemZoneInfo.label}
            </div>
            <div className="muted text-xs">
              Pay extra attention to sensations when your knee is in this range.
            </div>
          </div>
        )}

        <p className="muted mt-2.5 text-xs">
          If pain spikes or stability fails, the coach auto-regresses you to RESET immediately.
        </p>
      </section>
    </main>
  );
}
