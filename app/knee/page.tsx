"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BodyPartTabs } from "@/app/components/BodyPartSelector";
import {
  BodyPart,
  BODY_PART_INFO,
  ACTIVITY_GOAL_INFO,
  ActivityGoal,
  initCoachState,
} from "@/lib/body-parts";
import {
  KneeReadiness,
  KneeSensation,
  KneeCalibrationProfile,
  KNEE_SENSATION_INFO,
  KNEE_ROM_ZONES,
  KNEE_PAIN_LOCATION_LABELS,
  KNEE_MOVEMENT_LABELS,
} from "@/lib/body-parts/knee";

const CONFIDENCE_LABELS: Record<number, string> = {
  0: "No trust",
  1: "Very low",
  2: "Low",
  3: "Shaky",
  4: "Uncertain",
  5: "Neutral",
  6: "Okay",
  7: "Good",
  8: "Strong",
  9: "Very strong",
  10: "Full trust",
};

const DISCOMFORT_LABELS: Record<number, string> = {
  0: "None",
  1: "Barely noticeable",
  2: "Slight",
  3: "Mild",
  4: "Moderate",
  5: "Noticeable",
  6: "Uncomfortable",
  7: "Significant",
  8: "Severe",
  9: "Very severe",
  10: "Extreme",
};

// Simplified daily sensations - just the key ones to check
const DAILY_SENSATION_OPTIONS: { id: KneeSensation; label: string; warning?: boolean; danger?: boolean }[] = [
  { id: "good", label: "Feeling good ✓" },
  { id: "stiff", label: "Stiff" },
  { id: "achy", label: "Achy" },
  { id: "sharp", label: "Sharp pain", warning: true },
  { id: "unstable", label: "Unstable", warning: true },
  { id: "giving_way", label: "Giving way", danger: true },
  { id: "catching", label: "Catching", warning: true },
  { id: "locking", label: "Locking", danger: true },
];

function getConfidenceColor(value: number): string {
  if (value <= 3) return "#ef4444";
  if (value <= 5) return "#f59e0b";
  if (value <= 7) return "#6366f1";
  return "#22c55e";
}

function getDiscomfortColor(value: number): string {
  if (value <= 2) return "#22c55e";
  if (value <= 4) return "#6366f1";
  if (value <= 6) return "#f59e0b";
  return "#ef4444";
}

export default function KneePage() {
  const router = useRouter();
  const bodyPart: BodyPart = "knee";
  const info = BODY_PART_INFO[bodyPart];

  // Calibration state
  const [calibration, setCalibration] = useState<KneeCalibrationProfile | null>(null);
  const [problemZoneStatus, setProblemZoneStatus] = useState<"better" | "same" | "worse">("same");

  // Check for existing profiles
  const [profiles, setProfiles] = useState<Record<BodyPart, boolean>>({
    knee: false,
    achilles: false,
    shoulder: false,
    foot: false,
  });

  useEffect(() => {
    const kneeProfile = localStorage.getItem("bodyCoach.knee.calibration");
    const achillesProfile = localStorage.getItem("bodyCoach.achilles.calibration");
    const shoulderProfile = localStorage.getItem("bodyCoach.shoulder.calibration");
    const footProfile = localStorage.getItem("bodyCoach.foot.calibration");
    
    setProfiles({
      knee: !!kneeProfile,
      achilles: !!achillesProfile,
      shoulder: !!shoulderProfile,
      foot: !!footProfile,
    });

    if (kneeProfile) {
      setCalibration(JSON.parse(kneeProfile));
    } else {
      router.push("/knee/calibrate");
    }
  }, [router]);

  // Simplified daily questions
  const [confidence, setConfidence] = useState(7);
  const [todaySensations, setTodaySensations] = useState<KneeSensation[]>([]);
  const [restingDiscomfort, setRestingDiscomfort] = useState(0);
  const [activityGoal, setActivityGoal] = useState<ActivityGoal>("training");
  const [recentGivingWay, setRecentGivingWay] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // Determine if we need follow-up
  const showGivingWaySection = confidence < 6;
  const hasWarningSensations = todaySensations.some(s => {
    const opt = DAILY_SENSATION_OPTIONS.find(o => o.id === s);
    return opt?.warning || opt?.danger;
  });

  const readiness: KneeReadiness = useMemo(() => ({
    confidence,
    // Use calibration data for baseline, modified by today's status
    movementRestrictions: calibration?.movementRestrictions || [],
    sensations: todaySensations.length > 0 ? todaySensations : ["good"],
    restingDiscomfort,
    activityGoal,
    recentGivingWay: showGivingWaySection ? recentGivingWay : undefined,
    painLocations: calibration?.painLocations || [],
    problemZoneStatus,
  }), [
    confidence, todaySensations, restingDiscomfort, activityGoal,
    recentGivingWay, showGivingWaySection, problemZoneStatus, calibration,
  ]);

  const coach = useMemo(() => initCoachState(bodyPart, readiness), [readiness]);

  function toggleSensation(s: KneeSensation) {
    if (s === "good") {
      // "Feeling good" clears other selections
      setTodaySensations(todaySensations.includes(s) ? [] : [s]);
    } else {
      setTodaySensations((prev) => {
        const filtered = prev.filter((x) => x !== "good");
        return filtered.includes(s)
          ? filtered.filter((x) => x !== s)
          : [...filtered, s];
      });
    }
  }

  function handleBodyPartChange(part: BodyPart) {
    localStorage.setItem("bodyCoach.lastBodyPart", part);
    router.push(`/${part}`);
  }

  function startSession() {
    localStorage.setItem("bodyCoach.knee.readiness", JSON.stringify(readiness));
    localStorage.setItem("bodyCoach.knee.coachState", JSON.stringify(coach));
    router.push("/knee/session");
  }

  const modeClass = coach.mode.toLowerCase();

  if (!calibration) {
    return <main style={{ padding: 16 }}>Loading calibration...</main>;
  }

  // Get primary problem zone info
  const primaryZone = calibration.problemZones.length > 0 
    ? calibration.problemZones.sort((a, b) => b.severity - a.severity)[0]
    : null;

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      {/* Body Part Tabs */}
      <BodyPartTabs 
        selected={bodyPart} 
        onSelect={handleBodyPartChange}
        profiles={profiles}
      />

      {/* Header */}
      <div className="app-header">
        <div className="app-title">
          <h1>Daily Check-in</h1>
          <span 
            className="body-part-badge"
            style={{ "--accent-color": info.color } as React.CSSProperties}
          >
            {info.icon} {info.name}
          </span>
        </div>
        <Link href="/knee/calibrate" className="btn" style={{ fontSize: 13 }}>
          ⚙️ Profile
        </Link>
      </div>

      {/* Quick Profile Summary */}
      <div className="card" style={{ marginTop: 12, background: "#1a1a1d" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>
              Your Profile
            </div>
            {primaryZone && (
              <div style={{ fontSize: 14, marginBottom: 4 }}>
                <strong>Problem zone:</strong> {KNEE_ROM_ZONES[primaryZone.zoneIndex]?.label}
              </div>
            )}
            {calibration.painLocations.length > 0 && (
              <div className="muted" style={{ fontSize: 12 }}>
                {calibration.painLocations.slice(0, 2).map(loc => KNEE_PAIN_LOCATION_LABELS[loc]).join(", ")}
                {calibration.painLocations.length > 2 && ` +${calibration.painLocations.length - 2} more`}
              </div>
            )}
          </div>
          <Link href="/knee/calibrate" className="muted" style={{ fontSize: 12 }}>
            Edit →
          </Link>
        </div>
      </div>

      {/* Problem Zone Status - Only if they have one */}
      {primaryZone && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="section-header">How's your problem zone today?</div>
          <p className="muted" style={{ margin: "4px 0 12px 0", fontSize: 13 }}>
            {KNEE_ROM_ZONES[primaryZone.zoneIndex]?.label}
          </p>
          <div className="chip-group">
            <button
              className={`chip ${problemZoneStatus === "better" ? "selected" : ""}`}
              onClick={() => setProblemZoneStatus("better")}
            >
              😊 Better
            </button>
            <button
              className={`chip ${problemZoneStatus === "same" ? "selected" : ""}`}
              onClick={() => setProblemZoneStatus("same")}
            >
              😐 Same as usual
            </button>
            <button
              className={`chip ${problemZoneStatus === "worse" ? "selected selected-warning" : ""}`}
              onClick={() => setProblemZoneStatus("worse")}
            >
              😟 Worse
            </button>
          </div>
        </div>
      )}

      {/* Activity Goal */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="section-header">What's the goal today?</div>
        <div className="goal-group">
          {(Object.entries(ACTIVITY_GOAL_INFO) as [ActivityGoal, typeof ACTIVITY_GOAL_INFO[ActivityGoal]][]).map(([id, goal]) => (
            <button
              key={id}
              className={`goal-btn ${activityGoal === id ? "selected" : ""}`}
              onClick={() => setActivityGoal(id)}
            >
              <div className="goal-icon">{goal.icon}</div>
              <div className="goal-label">{goal.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Confidence */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="section-header">How much do you trust your knee right now?</div>
        <div className="slider-container">
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span className="slider-value">{confidence}</span>
            <span className="slider-label">{CONFIDENCE_LABELS[confidence]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
          />
          <div className="confidence-meter">
            <div
              className="confidence-fill"
              style={{
                width: `${confidence * 10}%`,
                background: getConfidenceColor(confidence),
              }}
            />
          </div>
        </div>

        {/* Adaptive: Giving way follow-up */}
        <div className={`adaptive-section ${showGivingWaySection ? "visible" : ""}`}>
          <hr />
          <label style={{ marginTop: 0 }}>
            <input
              type="checkbox"
              checked={recentGivingWay}
              onChange={(e) => setRecentGivingWay(e.target.checked)}
            />{" "}
            Any giving-way or buckling in the last 48 hours?
          </label>
        </div>
      </div>

      {/* Simplified Sensations - Quick Check */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="section-header">How does it feel right now?</div>
        <p className="muted" style={{ margin: "4px 0 12px 0", fontSize: 13 }}>
          Quick check - select what applies today
        </p>
        
        <div className="chip-group">
          {DAILY_SENSATION_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={`chip ${
                todaySensations.includes(opt.id)
                  ? opt.danger
                    ? "selected-danger"
                    : opt.warning
                      ? "selected-warning"
                      : "selected"
                  : ""
              }`}
              onClick={() => toggleSensation(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Warning for concerning sensations */}
        {hasWarningSensations && (
          <div style={{ 
            marginTop: 12, 
            padding: 10, 
            background: "rgba(239, 68, 68, 0.15)", 
            borderRadius: 8,
            border: "1px solid rgba(239, 68, 68, 0.3)",
            fontSize: 13
          }}>
            ⚠️ These sensations suggest caution. The coach will adjust your plan accordingly.
          </div>
        )}
      </div>

      {/* Resting Discomfort */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="section-header">Any discomfort right now, just sitting?</div>
        <div className="slider-container">
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span className="slider-value">{restingDiscomfort}</span>
            <span className="slider-label">{DISCOMFORT_LABELS[restingDiscomfort]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            value={restingDiscomfort}
            onChange={(e) => setRestingDiscomfort(Number(e.target.value))}
          />
          <div className="confidence-meter">
            <div
              className="confidence-fill"
              style={{
                width: `${restingDiscomfort * 10}%`,
                background: getDiscomfortColor(restingDiscomfort),
              }}
            />
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`card recommendation ${modeClass}`} style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="section-header" style={{ marginBottom: 4 }}>Today's Plan</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
              {coach.mode}
            </div>
          </div>
          <span className={`mode-badge ${modeClass}`}>{coach.plan.length} exercises</span>
        </div>

        <p className="muted" style={{ margin: "8px 0 0 0", fontSize: 14 }}>
          {coach.reasoning}
        </p>

        <hr />

        <div className="row" style={{ fontSize: 13 }}>
          <div className="muted">Pain threshold:</div>
          <div>{coach.painStop}/10</div>
          <div className="muted" style={{ marginLeft: 8 }}>Regress at:</div>
          <div>{coach.painRegress}/10</div>
        </div>

        <button
          className="btn btn-primary"
          onClick={startSession}
          style={{ marginTop: 14, width: "100%" }}
        >
          Start Session
        </button>
      </div>

      <p className="muted" style={{ marginTop: 12, fontSize: 12, textAlign: "center" }}>
        The coach adapts in real-time. If pain spikes or stability fails during an exercise,
        you'll automatically switch to a reset protocol.
      </p>
    </main>
  );
}
