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
  KneeMovementRestriction,
  KneePainLocation,
  KneeCalibrationProfile,
  KNEE_SENSATION_INFO,
  KNEE_SENSATION_CATEGORIES,
  KNEE_MOVEMENT_CATEGORIES,
  KNEE_MOVEMENT_LABELS,
  KNEE_PAIN_LOCATION_CATEGORIES,
  KNEE_PAIN_LOCATION_LABELS,
  KNEE_ROM_ZONES,
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

  // Core questions
  const [confidence, setConfidence] = useState(7);
  const [movementRestrictions, setMovementRestrictions] = useState<KneeMovementRestriction[]>([]);
  const [sensations, setSensations] = useState<KneeSensation[]>([]);
  const [restingDiscomfort, setRestingDiscomfort] = useState(0);
  const [activityGoal, setActivityGoal] = useState<ActivityGoal>("training");

  // Adaptive follow-ups
  const [recentGivingWay, setRecentGivingWay] = useState(false);
  const [painLocation, setPainLocation] = useState<KneePainLocation[]>([]);

  // UI state
  const [expandedSensationCategories, setExpandedSensationCategories] = useState<string[]>(["pain", "mechanical"]);
  const [expandedMovementCategories, setExpandedMovementCategories] = useState<string[]>(["Deceleration & Direction Change"]);

  // Determine which adaptive sections to show
  const showGivingWaySection = confidence < 6;
  const needsPainLocation = sensations.some(s => {
    const info = KNEE_SENSATION_INFO[s];
    return info?.category === "pain" || info?.warning || info?.danger;
  });

  const readiness: KneeReadiness = useMemo(() => ({
    confidence,
    movementRestrictions,
    sensations,
    restingDiscomfort,
    activityGoal,
    recentGivingWay: showGivingWaySection ? recentGivingWay : undefined,
    painLocations: needsPainLocation ? painLocation : undefined,
    problemZoneStatus,
  }), [
    confidence, movementRestrictions, sensations, restingDiscomfort, activityGoal,
    recentGivingWay, painLocation, showGivingWaySection, needsPainLocation, problemZoneStatus,
  ]);

  const coach = useMemo(() => initCoachState(bodyPart, readiness), [readiness]);

  function toggleSensation(s: KneeSensation) {
    if (s === "nothing" || s === "good") {
      setSensations(sensations.includes(s) ? [] : [s]);
    } else {
      setSensations((prev) => {
        const filtered = prev.filter((x) => x !== "nothing" && x !== "good");
        return filtered.includes(s)
          ? filtered.filter((x) => x !== s)
          : [...filtered, s];
      });
    }
  }

  function toggleMovement(m: KneeMovementRestriction) {
    setMovementRestrictions((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  }

  function togglePainLocation(loc: KneePainLocation) {
    setPainLocation((prev) =>
      prev.includes(loc) ? prev.filter((x) => x !== loc) : [...prev, loc]
    );
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

      {/* Problem Zone Status */}
      {calibration.problemZones.length > 0 && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="section-header">Your problem zone today</div>
          <p className="muted" style={{ margin: "4px 0 12px 0", fontSize: 13 }}>
            {calibration.problemZones.map(pz => KNEE_ROM_ZONES[pz.zoneIndex]?.label).join(", ")}
          </p>
          <div className="chip-group">
            <button
              className={`chip ${problemZoneStatus === "better" ? "selected" : ""}`}
              onClick={() => setProblemZoneStatus("better")}
            >
              Better
            </button>
            <button
              className={`chip ${problemZoneStatus === "same" ? "selected" : ""}`}
              onClick={() => setProblemZoneStatus("same")}
            >
              Same
            </button>
            <button
              className={`chip ${problemZoneStatus === "worse" ? "selected selected-warning" : ""}`}
              onClick={() => setProblemZoneStatus("worse")}
            >
              Worse
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

      {/* Sensations */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="section-header">What sensations are you noticing?</div>
        <p className="muted" style={{ margin: "4px 0 12px 0", fontSize: 13 }}>
          Tap categories to expand. Select all that apply.
        </p>

        {KNEE_SENSATION_CATEGORIES.map((category) => {
          const selectedCount = category.sensations.filter(s => sensations.includes(s)).length;
          const isExpanded = expandedSensationCategories.includes(category.id);
          
          return (
            <div key={category.id} style={{ marginBottom: 8 }}>
              <button
                className="category-toggle"
                onClick={() => setExpandedSensationCategories(prev =>
                  prev.includes(category.id)
                    ? prev.filter(x => x !== category.id)
                    : [...prev, category.id]
                )}
              >
                <span>{category.label}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {selectedCount > 0 && (
                    <span className="selected-count">{selectedCount}</span>
                  )}
                  <span>{isExpanded ? "▼" : "▶"}</span>
                </span>
              </button>
              {isExpanded && (
                <div className="chip-group" style={{ marginTop: 8, paddingLeft: 8 }}>
                  {category.sensations.map((s) => {
                    const info = KNEE_SENSATION_INFO[s];
                    return (
                      <button
                        key={s}
                        className={`chip ${
                          sensations.includes(s)
                            ? info?.danger
                              ? "selected-danger"
                              : info?.warning
                                ? "selected-warning"
                                : "selected"
                            : ""
                        }`}
                        onClick={() => toggleSensation(s)}
                      >
                        {info?.label || s}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Adaptive: Pain location follow-up */}
        <div className={`adaptive-section ${needsPainLocation ? "visible" : ""}`}>
          <hr />
          <div className="section-header">Where do you feel it?</div>
          {KNEE_PAIN_LOCATION_CATEGORIES.map((category) => (
            <div key={category.label} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>
                {category.label}
              </div>
              <div className="chip-group">
                {category.locations.map((loc) => (
                  <button
                    key={loc}
                    className={`chip ${painLocation.includes(loc) ? "selected" : ""}`}
                    onClick={() => togglePainLocation(loc)}
                    style={{ fontSize: 12 }}
                  >
                    {KNEE_PAIN_LOCATION_LABELS[loc]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Movement Restrictions */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="section-header">Which movements feel restricted or off?</div>
        <p className="muted" style={{ margin: "4px 0 12px 0", fontSize: 13 }}>
          Tap categories to expand. Select any that feel limited.
        </p>

        {KNEE_MOVEMENT_CATEGORIES.map((category) => {
          const selectedCount = category.movements.filter(m => movementRestrictions.includes(m)).length;
          const isExpanded = expandedMovementCategories.includes(category.label);
          
          return (
            <div key={category.label} style={{ marginBottom: 8 }}>
              <button
                className="category-toggle"
                onClick={() => setExpandedMovementCategories(prev =>
                  prev.includes(category.label)
                    ? prev.filter(x => x !== category.label)
                    : [...prev, category.label]
                )}
              >
                <span>{category.label}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {selectedCount > 0 && (
                    <span className="selected-count">{selectedCount}</span>
                  )}
                  <span>{isExpanded ? "▼" : "▶"}</span>
                </span>
              </button>
              {isExpanded && (
                <div className="chip-group" style={{ marginTop: 8, paddingLeft: 8 }}>
                  {category.movements.map((m) => (
                    <button
                      key={m}
                      className={`chip ${movementRestrictions.includes(m) ? "selected-warning" : ""}`}
                      onClick={() => toggleMovement(m)}
                    >
                      {KNEE_MOVEMENT_LABELS[m]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <button
          className={`chip ${movementRestrictions.length === 0 ? "selected" : ""}`}
          onClick={() => setMovementRestrictions([])}
          style={{ marginTop: 8 }}
        >
          None - all movements feel good
        </button>
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
          <span className={`mode-badge ${modeClass}`}>{coach.plan.length} drills</span>
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
        The coach adapts in real-time. If pain spikes or stability fails during a drill,
        you'll automatically switch to a reset protocol.
      </p>
    </main>
  );
}
