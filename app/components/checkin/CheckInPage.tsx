"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BodyPartTabs } from "@/app/components/BodyPartSelector";
import { ExpandableNotes } from "@/app/components/ExpandableNotes";
import {
  BodyPart,
  BODY_PART_INFO,
  ACTIVITY_GOAL_INFO,
  ActivityGoal,
  initCoachState,
  type AnyReadiness,
} from "@/lib/body-parts";
import {
  getOrCreateOutcomeData,
  addCheckIn,
  saveOutcomeData,
  generateInsights,
  type OutcomeData,
  type ProgressInsight,
} from "@/lib/tracking/outcomes";
import {
  analyzeCheckInTrends,
  type CheckInTrends,
} from "@/lib/tracking/analytics";
import { CONFIDENCE_LABELS, DISCOMFORT_LABELS, getConfidenceColor, getDiscomfortColor } from "@/lib/checkin/constants";
import { CONFIDENCE_STABILITY } from "@/lib/coach/thresholds";
import { safeGet, safeSet } from "@/lib/storage/safe-storage";
import { BODY_PART_CHECK_IN_CONFIG, type AnyCalibrationProfile, type BodyPartCheckInConfig } from "./body-part-config";
import type { KneeCalibrationProfile } from "@/lib/body-parts/knee";

function KneeProfileSummary({
  calibration,
  primaryZone,
  config,
}: {
  calibration: KneeCalibrationProfile;
  primaryZone: { zoneIndex: number; severity: number };
  config: BodyPartCheckInConfig;
}) {
  return (
    <div className="card mt-3 bg-surface-raised">
      <div className="flex justify-between items-start">
        <div>
          <div className="muted text-[11px] uppercase mb-1">
            Your Profile
          </div>
          <div className="text-sm mb-1">
            <strong>Problem zone:</strong> {config.romZones[primaryZone.zoneIndex]?.label}
          </div>
          {calibration.painLocations?.length > 0 && (
            <div className="muted text-xs">
              {calibration.painLocations.slice(0, 2).map((loc) => config.painLocationLabels[loc]).join(", ")}
              {calibration.painLocations.length > 2 && ` +${calibration.painLocations.length - 2} more`}
            </div>
          )}
        </div>
        <Link href="/knee/calibrate" className="muted text-xs">Edit →</Link>
      </div>
    </div>
  );
}

interface CheckInPageProps {
  bodyPart: BodyPart;
}

export function CheckInPage({ bodyPart }: CheckInPageProps) {
  const router = useRouter();
  const info = BODY_PART_INFO[bodyPart];
  const config = BODY_PART_CHECK_IN_CONFIG[bodyPart];

  // Calibration
  const [calibration, setCalibration] = useState<AnyCalibrationProfile | null>(null);
  const [problemZoneStatus, setProblemZoneStatus] = useState<"better" | "same" | "worse">("same");

  // Outcome tracking
  const [outcomeData, setOutcomeData] = useState<OutcomeData | null>(null);
  const [insights, setInsights] = useState<ProgressInsight[]>([]);
  const [trends, setTrends] = useState<CheckInTrends | null>(null);

  // Profiles for tabs
  const [profiles, setProfiles] = useState<Record<BodyPart, boolean>>({
    knee: false, achilles: false, shoulder: false, foot: false,
  });

  useEffect(() => {
    const parts: BodyPart[] = ["knee", "achilles", "shoulder", "foot"];
    const profileState = {} as Record<BodyPart, boolean>;
    for (const p of parts) {
      profileState[p] = safeGet(`bodyCoach.${p}.calibration`, null) !== null;
    }
    setProfiles(profileState);

    const stored = safeGet<AnyCalibrationProfile | null>(`bodyCoach.${bodyPart}.calibration`, null);
    if (stored) {
      setCalibration(stored);
    } else {
      router.push(`/${bodyPart}/calibrate`);
    }

    const outcomes = getOrCreateOutcomeData(bodyPart);
    setOutcomeData(outcomes);
    setInsights(generateInsights(outcomes));
    if (outcomes.checkIns.length >= 3) {
      setTrends(analyzeCheckInTrends(outcomes));
    }
  }, [router, bodyPart]);

  // Shared form state
  const [confidence, setConfidence] = useState(7);
  const [sensations, setSensations] = useState<string[]>([]);
  const [restingDiscomfort, setRestingDiscomfort] = useState(0);
  const [activityGoal, setActivityGoal] = useState<ActivityGoal>("training");
  const [dailyNotes, setDailyNotes] = useState("");

  // Body-part-specific state
  const [movementRestrictions, setMovementRestrictions] = useState<string[]>([]);
  const [painLocation, setPainLocation] = useState<string[]>([]);
  const [recentGivingWay, setRecentGivingWay] = useState(false);
  const [morningStiffnessToday, setMorningStiffnessToday] = useState(false);
  const [sleptOnShoulder, setSleptOnShoulder] = useState(false);
  const [firstStepsPain, setFirstStepsPain] = useState(0);

  // UI state
  const [expandedSensationCategories, setExpandedSensationCategories] = useState<string[]>(
    config.defaultExpandedSensationCategories
  );
  const [expandedMovementCategories, setExpandedMovementCategories] = useState<string[]>(
    config.defaultExpandedMovementCategories
  );

  const showGivingWaySection = config.specialChecks.includes("givingWay") && confidence < CONFIDENCE_STABILITY;

  const needsPainLocation = config.hasPainLocationInput && sensations.some(s => {
    const sInfo = config.sensationInfo[s];
    return sInfo?.category === "pain" || sInfo?.warning || sInfo?.danger;
  });

  const hasWarningSensations = sensations.some(s => {
    if (config.sensationMode === "flat" && config.flatSensationOptions) {
      const opt = config.flatSensationOptions.find(o => o.id === s);
      return opt?.warning || opt?.danger;
    }
    const sInfo = config.sensationInfo[s];
    return sInfo?.warning || sInfo?.danger;
  });

  // Build readiness object
  const readiness: AnyReadiness = useMemo(() => {
    const base = {
      confidence,
      restingDiscomfort,
      activityGoal,
      sensations: sensations.length > 0 ? sensations : (config.sensationMode === "flat" ? ["good"] : ["nothing"]),
      problemZoneStatus,
    };

    if (bodyPart === "knee") {
      const kneeCalibration = calibration as KneeCalibrationProfile | null;
      return {
        ...base,
        movementRestrictions: kneeCalibration?.movementRestrictions || [],
        painLocations: kneeCalibration?.painLocations || [],
        recentGivingWay: showGivingWaySection ? recentGivingWay : undefined,
        dailyNotes: dailyNotes || undefined,
      } as AnyReadiness;
    }

    return {
      ...base,
      movementRestrictions,
      painLocations: needsPainLocation ? painLocation : undefined,
      ...(config.specialChecks.includes("morningStiffness") && { morningStiffnessToday }),
      ...(config.specialChecks.includes("sleptOnShoulder") && { sleptOnShoulder }),
      ...(config.specialChecks.includes("firstStepsPain") && morningStiffnessToday && { firstStepsPain }),
    } as AnyReadiness;
  }, [
    confidence, sensations, restingDiscomfort, activityGoal, problemZoneStatus,
    movementRestrictions, painLocation, recentGivingWay, showGivingWaySection,
    morningStiffnessToday, sleptOnShoulder, firstStepsPain, calibration,
    dailyNotes, bodyPart, needsPainLocation, config,
  ]);

  const coach = useMemo(
    () => initCoachState(bodyPart, readiness, outcomeData ?? undefined),
    [bodyPart, readiness, outcomeData]
  );

  // Toggle helpers
  function toggleSensation(s: string) {
    const positives = ["good", "nothing"];
    if (positives.includes(s)) {
      setSensations(sensations.includes(s) ? [] : [s]);
    } else {
      setSensations((prev) => {
        const filtered = prev.filter(x => !positives.includes(x));
        return filtered.includes(s) ? filtered.filter(x => x !== s) : [...filtered, s];
      });
    }
  }

  function toggleMovement(m: string) {
    setMovementRestrictions(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  }

  function togglePainLocation(loc: string) {
    setPainLocation(prev => prev.includes(loc) ? prev.filter(x => x !== loc) : [...prev, loc]);
  }

  function handleBodyPartChange(part: BodyPart) {
    safeSet("bodyCoach.lastBodyPart", part);
    router.push(`/${part}`);
  }

  function startSession() {
    safeSet(`bodyCoach.${bodyPart}.readiness`, readiness);
    safeSet(`bodyCoach.${bodyPart}.coachState`, coach);

    const currentOutcomes = getOrCreateOutcomeData(bodyPart);
    const updated = addCheckIn(currentOutcomes, {
      date: new Date().toISOString(),
      bodyPart,
      painLevel: restingDiscomfort,
      functionLevel: confidence,
      confidenceLevel: confidence,
      sensations: sensations.length > 0 ? sensations : (config.sensationMode === "flat" ? ["good"] : ["nothing"]),
      modeAssigned: coach.mode,
      notes: dailyNotes || undefined,
    });
    saveOutcomeData(updated);

    router.push(`/${bodyPart}/session`);
  }

  const modeClass = coach.mode.toLowerCase();

  if (!calibration) {
    return <main className="p-4">Loading calibration...</main>;
  }

  const primaryZone = calibration.problemZones?.length > 0
    ? [...calibration.problemZones].sort((a, b) => b.severity - a.severity)[0]
    : null;

  return (
    <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
      {/* Body Part Tabs */}
      <BodyPartTabs selected={bodyPart} onSelect={handleBodyPartChange} profiles={profiles} />

      {/* Header */}
      <div className="app-header">
        <div className="app-title">
          <h1>Daily Check-in</h1>
          <span className="body-part-badge" style={{ "--accent-color": info.color } as React.CSSProperties}>
            {info.icon} {info.name}
          </span>
        </div>
        <Link href={`/${bodyPart}/calibrate`} className="btn text-[13px]">
          ⚙️ Profile
        </Link>
      </div>

      {/* Quick Profile Summary (knee only) */}
      {bodyPart === "knee" && primaryZone && (
        <KneeProfileSummary
          calibration={calibration as KneeCalibrationProfile}
          primaryZone={primaryZone}
          config={config}
        />
      )}

      {/* Trend-Based Safety Alerts */}
      {trends && (trends.progressiveWorsening || trends.painDirection === "worsening" || trends.recentResetCount >= 5) && (
        <div className="card mt-3" style={{ background: "var(--color-error-bg)", borderColor: "var(--color-error-border)" }}>
          <div className="font-bold mb-2 text-sm">Trends to Watch</div>
          {trends.progressiveWorsening && (
            <div className="text-[13px] mb-1.5">
              Your pain has increased 3 days in a row. Consider taking an easier day or consulting your physio.
            </div>
          )}
          {trends.painDirection === "worsening" && !trends.progressiveWorsening && (
            <div className="text-[13px] mb-1.5">
              Your average pain this week ({trends.weeklyAvgPain.toFixed(1)}) is higher than last week ({trends.previousWeekAvgPain.toFixed(1)}). The coach will adjust accordingly.
            </div>
          )}
          {trends.recentResetCount >= 5 && (
            <div className="text-[13px] mb-1.5">
              You&apos;ve been in RESET mode {trends.recentResetCount} of the last 7 days. If this doesn&apos;t improve, consider seeing a physiotherapist.
            </div>
          )}
        </div>
      )}

      {/* Special Checks */}
      {config.specialChecks.includes("morningStiffness") && (
        <div className="card mt-3">
          <div className="section-header">Morning check</div>
          <label className="mt-0">
            <input
              type="checkbox"
              checked={morningStiffnessToday}
              onChange={(e) => setMorningStiffnessToday(e.target.checked)}
            />{" "}
            {bodyPart === "foot"
              ? "Stiffness or pain with first steps this morning?"
              : "Noticeable stiffness when you first got up today?"}
          </label>
          {config.specialChecks.includes("firstStepsPain") && morningStiffnessToday && (
            <div className="mt-3">
              <div className="text-[13px] text-muted mb-1.5">
                How bad were those first steps? (0-10)
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0} max={10}
                  value={firstStepsPain}
                  onChange={(e) => setFirstStepsPain(Number(e.target.value))}
                  aria-label="First steps pain level"
                  aria-valuenow={firstStepsPain}
                  aria-valuetext={`${firstStepsPain} out of 10`}
                  className="flex-1"
                />
                <span className="font-semibold min-w-[24px]">{firstStepsPain}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {config.specialChecks.includes("sleptOnShoulder") && (
        <div className="card mt-3">
          <div className="section-header">Sleep check</div>
          <label className="mt-0">
            <input
              type="checkbox"
              checked={sleptOnShoulder}
              onChange={(e) => setSleptOnShoulder(e.target.checked)}
            />{" "}
            Slept on the affected shoulder last night?
          </label>
        </div>
      )}

      {/* Problem Zone Status */}
      {primaryZone && (
        <div className="card mt-3">
          <div className="section-header">
            {bodyPart === "knee" ? "How's your problem zone today?" : bodyPart === "foot" ? "Your problem areas today" : "Your problem zone today"}
          </div>
          <p className="muted my-1 mb-3 text-[13px]">
            {bodyPart === "foot"
              ? calibration.problemZones.map(pz => config.romZones[pz.zoneIndex]?.label).join(", ")
              : config.romZones[primaryZone.zoneIndex]?.label}
          </p>
          <div className="chip-group">
            {(["better", "same", "worse"] as const).map(status => (
              <button
                key={status}
                className={`chip ${problemZoneStatus === status ? (status === "worse" ? "selected selected-warning" : "selected") : ""}`}
                onClick={() => setProblemZoneStatus(status)}
              >
                {bodyPart === "knee" && status === "better" && "😊 "}
                {bodyPart === "knee" && status === "same" && "😐 "}
                {bodyPart === "knee" && status === "worse" && "😟 "}
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {bodyPart === "knee" && status === "same" && " as usual"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Activity Goal */}
      <div className="card mt-3">
        <div className="section-header">What&apos;s the goal today?</div>
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
      <div className="card mt-3">
        <div className="section-header">{config.confidenceQuestion}</div>
        <div className="slider-container">
          <div className="flex items-baseline">
            <span className="slider-value">{confidence}</span>
            <span className="slider-label">{CONFIDENCE_LABELS[confidence]}</span>
          </div>
          <input
            type="range"
            min={0} max={10}
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            aria-label="Confidence level"
            aria-valuenow={confidence}
            aria-valuetext={`${confidence}: ${CONFIDENCE_LABELS[confidence]}`}
          />
          <div className="confidence-meter">
            <div
              className="confidence-fill"
              style={{ width: `${confidence * 10}%`, background: getConfidenceColor(confidence) }}
            />
          </div>
        </div>

        {/* Giving way follow-up (knee only) */}
        {config.specialChecks.includes("givingWay") && (
          <div className={`adaptive-section ${showGivingWaySection ? "visible" : ""}`}>
            <hr />
            <label className="mt-0">
              <input
                type="checkbox"
                checked={recentGivingWay}
                onChange={(e) => setRecentGivingWay(e.target.checked)}
              />{" "}
              Any giving-way or buckling in the last 48 hours?
            </label>
          </div>
        )}
      </div>

      {/* Sensations */}
      <div className="card mt-3">
        <div className="section-header">
          {config.sensationMode === "flat" ? "How does it feel right now?" : "What sensations are you noticing?"}
        </div>
        <p className="muted my-1 mb-3 text-[13px]">
          {config.sensationMode === "flat" ? "Quick check - select what applies today" : "Tap categories to expand."}
        </p>

        {config.sensationMode === "flat" && config.flatSensationOptions ? (
          <div className="chip-group">
            {config.flatSensationOptions.map((opt) => (
              <button
                key={opt.id}
                className={`chip ${
                  sensations.includes(opt.id)
                    ? opt.danger ? "selected-danger" : opt.warning ? "selected-warning" : "selected"
                    : ""
                }`}
                onClick={() => toggleSensation(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          config.sensationCategories.map((category) => {
            const selectedCount = category.sensations.filter(s => sensations.includes(s)).length;
            const isExpanded = expandedSensationCategories.includes(category.id);

            return (
              <div key={category.id} className="mb-2">
                <button
                  className="category-toggle"
                  onClick={() => setExpandedSensationCategories(prev =>
                    prev.includes(category.id) ? prev.filter(x => x !== category.id) : [...prev, category.id]
                  )}
                  aria-expanded={isExpanded}
                  aria-controls={`sensation-${category.id}`}
                >
                  <span>{category.label}</span>
                  <span className="flex items-center gap-2">
                    {selectedCount > 0 && <span className="selected-count">{selectedCount}</span>}
                    <span>{isExpanded ? "▼" : "▶"}</span>
                  </span>
                </button>
                {isExpanded && (
                  <div id={`sensation-${category.id}`} className="chip-group mt-2 pl-2">
                    {category.sensations.map((s) => {
                      const sInfo = config.sensationInfo[s];
                      return (
                        <button
                          key={s}
                          className={`chip ${sensations.includes(s) ? (sInfo?.danger ? "selected-danger" : sInfo?.warning ? "selected-warning" : "selected") : ""}`}
                          onClick={() => toggleSensation(s)}
                        >
                          {sInfo?.label || s}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Warning for concerning sensations */}
        {hasWarningSensations && (
          <div className="mt-3 p-2.5 rounded-lg text-[13px]" style={{ background: "var(--color-error-bg)", border: "1px solid var(--color-error-border)" }}>
            ⚠️ These sensations suggest caution. The coach will adjust your plan accordingly.
          </div>
        )}

        {/* Pain location follow-up */}
        {config.hasPainLocationInput && (
          <div className={`adaptive-section ${needsPainLocation ? "visible" : ""}`}>
            <hr />
            <div className="section-header">Where do you feel it?</div>
            {config.painLocationCategories.map((category) => (
              <div key={category.label} className="mb-2">
                <div className="text-xs text-muted mb-1.5">{category.label}</div>
                <div className="chip-group">
                  {category.locations.map((loc) => (
                    <button
                      key={loc}
                      className={`chip text-xs ${painLocation.includes(loc) ? "selected" : ""}`}
                      onClick={() => togglePainLocation(loc)}
                    >
                      {config.painLocationLabels[loc]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Movement Restrictions (non-knee body parts) */}
      {config.hasMovementInput && (
        <div className="card mt-3">
          <div className="section-header">
            {bodyPart === "foot" ? "Which movements/activities feel restricted?" : "Which movements feel restricted or off?"}
          </div>
          <p className="muted my-1 mb-3 text-[13px]">Tap categories to expand.</p>

          {config.movementCategories.map((category) => {
            const selectedCount = category.movements.filter(m => movementRestrictions.includes(m)).length;
            const isExpanded = expandedMovementCategories.includes(category.label);

            return (
              <div key={category.label} className="mb-2">
                <button
                  className="category-toggle"
                  onClick={() => setExpandedMovementCategories(prev =>
                    prev.includes(category.label) ? prev.filter(x => x !== category.label) : [...prev, category.label]
                  )}
                  aria-expanded={isExpanded}
                  aria-controls={`movement-${category.label.replace(/\s+/g, "-")}`}
                >
                  <span>{category.label}</span>
                  <span className="flex items-center gap-2">
                    {selectedCount > 0 && <span className="selected-count">{selectedCount}</span>}
                    <span>{isExpanded ? "▼" : "▶"}</span>
                  </span>
                </button>
                {isExpanded && (
                  <div id={`movement-${category.label.replace(/\s+/g, "-")}`} className="chip-group mt-2 pl-2">
                    {category.movements.map((m) => (
                      <button
                        key={m}
                        className={`chip ${movementRestrictions.includes(m) ? "selected-warning" : ""}`}
                        onClick={() => toggleMovement(m)}
                      >
                        {config.movementLabels[m]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            className={`chip mt-2 ${movementRestrictions.length === 0 ? "selected" : ""}`}
            onClick={() => setMovementRestrictions([])}
          >
            None - all movements feel good
          </button>
        </div>
      )}

      {/* Resting Discomfort */}
      <div className="card mt-3">
        <div className="section-header">{config.discomfortQuestion}</div>
        <div className="slider-container">
          <div className="flex items-baseline">
            <span className="slider-value">{restingDiscomfort}</span>
            <span className="slider-label">{DISCOMFORT_LABELS[restingDiscomfort]}</span>
          </div>
          <input
            type="range"
            min={0} max={10}
            value={restingDiscomfort}
            onChange={(e) => setRestingDiscomfort(Number(e.target.value))}
            aria-label="Resting discomfort level"
            aria-valuenow={restingDiscomfort}
            aria-valuetext={`${restingDiscomfort}: ${DISCOMFORT_LABELS[restingDiscomfort]}`}
          />
          <div className="confidence-meter">
            <div
              className="confidence-fill"
              style={{ width: `${restingDiscomfort * 10}%`, background: getDiscomfortColor(restingDiscomfort) }}
            />
          </div>
        </div>
      </div>

      {/* Progress Insights */}
      {insights.length > 0 && (
        <div className="card mt-3">
          <div className="section-header">Your Progress</div>
          {outcomeData && outcomeData.sessions.length > 0 && (
            <div className="flex gap-3 mb-3 text-[13px]">
              <div className="text-center flex-1">
                <div className="text-xl font-bold">{outcomeData.sessions.length}</div>
                <div className="muted text-[11px]">Sessions</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl font-bold">{outcomeData.checkIns.length}</div>
                <div className="muted text-[11px]">Check-ins</div>
              </div>
              {outcomeData.milestones.length > 0 && (
                <div className="text-center flex-1">
                  <div className="text-xl font-bold">{outcomeData.milestones.length}</div>
                  <div className="muted text-[11px]">Milestones</div>
                </div>
              )}
            </div>
          )}
          {insights.map((insight, i) => (
            <div key={i} className={`p-2.5 rounded-lg text-[13px] ${
              i < insights.length - 1 ? "mb-2" : ""
            } ${
              insight.type === "positive" ? "bg-[var(--color-success-bg)]"
                : insight.type === "attention" ? "bg-[var(--color-error-bg)]"
                : "bg-[var(--color-primary-subtle)]"
            }`}>
              <div className="font-semibold mb-0.5">
                {insight.type === "positive" ? "+" : insight.type === "attention" ? "!" : "i"} {insight.title}
              </div>
              <div className="muted text-xs">{insight.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      <div className="mt-3">
        <ExpandableNotes
          value={dailyNotes}
          onChange={setDailyNotes}
          label="Add notes about today"
          placeholder={`Anything else about how your ${info.name.toLowerCase()} feels today? Recent activities, sleep, stress...`}
        />
      </div>

      {/* Recommendation */}
      <div className={`card recommendation ${modeClass} mt-3`}>
        <div className="flex justify-between items-start">
          <div>
            <div className="section-header mb-1">Today&apos;s Plan</div>
            <div className="text-[28px] font-extrabold mb-1">{coach.mode}</div>
          </div>
          <span className={`mode-badge ${modeClass}`}>{coach.plan.length} {config.exerciseTerm}</span>
        </div>
        <p className="muted mt-2 mb-0 text-sm">{coach.reasoning}</p>
        <hr />
        <div className="flex items-center gap-2.5 flex-wrap text-[13px]">
          <div className="muted">Pain threshold:</div>
          <div>{coach.painStop}/10</div>
          <div className="muted ml-2">Regress at:</div>
          <div>{coach.painRegress}/10</div>
        </div>
        <button
          className="btn btn-primary mt-3.5 w-full"
          onClick={startSession}
        >
          Start Session
        </button>
      </div>

      <p className="muted mt-3 text-xs text-center">
        The coach adapts in real-time. If pain spikes during {bodyPart === "knee" ? "an exercise" : "a drill"},
        you&apos;ll automatically switch to a reset protocol.
      </p>
    </main>
  );
}
