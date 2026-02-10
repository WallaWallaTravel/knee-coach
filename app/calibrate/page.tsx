"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalibrationProfile,
  ROM_ZONES,
  ROMIssue,
  IssueType,
  IssueContext,
  ISSUE_TYPE_LABELS,
  ISSUE_CONTEXT_LABELS,
  MOVEMENT_PATTERNS,
  getDefaultCalibration,
  saveCalibration,
  loadCalibration,
} from "@/lib/calibration";

type Step = "intro" | "problem_zones" | "issue_types" | "contexts" | "movements" | "goals" | "summary";

const STEPS: Step[] = ["intro", "problem_zones", "issue_types", "contexts", "movements", "goals", "summary"];

export default function CalibratePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [profile, setProfile] = useState<CalibrationProfile>(getDefaultCalibration());

  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [zoneSeverities, setZoneSeverities] = useState<Record<number, 1 | 2 | 3>>({});
  const [zoneIssueTypes, setZoneIssueTypes] = useState<Record<number, IssueType[]>>({});

  useEffect(() => {
    const existing = loadCalibration();
    if (existing) {
      setProfile(existing);
      const zones = existing.problemZones.map(p => p.zoneIndex);
      setSelectedZones(zones);
      const severities: Record<number, 1 | 2 | 3> = {};
      const issueTypes: Record<number, IssueType[]> = {};
      existing.problemZones.forEach(p => {
        severities[p.zoneIndex] = p.severity;
        issueTypes[p.zoneIndex] = p.issueTypes;
      });
      setZoneSeverities(severities);
      setZoneIssueTypes(issueTypes);
    }
  }, []);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  function nextStep() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      if (step === "problem_zones" || step === "issue_types") {
        const problemZones: ROMIssue[] = selectedZones.map(zoneIndex => ({
          zoneIndex,
          issueTypes: zoneIssueTypes[zoneIndex] || ["pain"],
          severity: zoneSeverities[zoneIndex] || 2,
        }));
        setProfile(prev => ({ ...prev, problemZones }));
      }
      setStep(STEPS[idx + 1]);
    }
  }

  function prevStep() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) {
      setStep(STEPS[idx - 1]);
    }
  }

  function toggleZone(index: number) {
    setSelectedZones(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
    if (!zoneSeverities[index]) {
      setZoneSeverities(prev => ({ ...prev, [index]: 2 }));
    }
    if (!zoneIssueTypes[index]) {
      setZoneIssueTypes(prev => ({ ...prev, [index]: ["pain"] }));
    }
  }

  function setZoneSeverity(zoneIndex: number, severity: 1 | 2 | 3) {
    setZoneSeverities(prev => ({ ...prev, [zoneIndex]: severity }));
  }

  function toggleZoneIssueType(zoneIndex: number, issueType: IssueType) {
    setZoneIssueTypes(prev => {
      const current = prev[zoneIndex] || [];
      const updated = current.includes(issueType)
        ? current.filter(t => t !== issueType)
        : [...current, issueType];
      return { ...prev, [zoneIndex]: updated };
    });
  }

  function toggleContext(context: IssueContext) {
    setProfile(prev => ({
      ...prev,
      issueContexts: prev.issueContexts.includes(context)
        ? prev.issueContexts.filter(c => c !== context)
        : [...prev.issueContexts, context],
    }));
  }

  function toggleMovement(movementId: string) {
    setProfile(prev => ({
      ...prev,
      affectedMovements: prev.affectedMovements.includes(movementId)
        ? prev.affectedMovements.filter(m => m !== movementId)
        : [...prev.affectedMovements, movementId],
    }));
  }

  function setGoal(goal: CalibrationProfile["primaryGoal"]) {
    setProfile(prev => ({ ...prev, primaryGoal: goal }));
  }

  function finishCalibration() {
    const problemZones: ROMIssue[] = selectedZones.map(zoneIndex => ({
      zoneIndex,
      issueTypes: zoneIssueTypes[zoneIndex] || ["pain"],
      severity: zoneSeverities[zoneIndex] || 2,
    }));

    const safeZones = ROM_ZONES.map((_, i) => i).filter(i => !selectedZones.includes(i));

    const finalProfile: CalibrationProfile = {
      ...profile,
      problemZones,
      safeZones,
    };

    saveCalibration(finalProfile);
    router.push("/");
  }

  return (
    <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="muted text-xs">Calibration</span>
          <span className="muted text-xs">{stepIndex + 1} of {STEPS.length}</span>
        </div>
        <div className="h-1 bg-surface-border rounded-sm">
          <div
            className="h-full bg-indigo-500 rounded-sm transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step: Intro */}
      {step === "intro" && (
        <div className="card">
          <h1 className="mt-0 text-2xl">Let's calibrate your knee profile</h1>
          <p className="muted">
            Every knee issue is different. This calibration helps the app understand exactly
            where in your range of motion you experience problems, so we can tailor exercises
            and recommendations specifically for you.
          </p>
          <hr />
          <h3 className="mb-2">What we'll cover:</h3>
          <ul className="m-0 pl-5">
            <li className="mb-2">Your problem range of motion zones</li>
            <li className="mb-2">What type of issues you experience</li>
            <li className="mb-2">When the issues occur</li>
            <li className="mb-2">Which movements are affected</li>
            <li>Your rehab goals</li>
          </ul>
          <p className="muted mt-4 text-[13px]">
            This takes about 2-3 minutes. You can update it anytime.
          </p>
          <button className="btn btn-primary w-full mt-4" onClick={nextStep}>
            Get Started
          </button>
        </div>
      )}

      {/* Step: Problem Zones */}
      {step === "problem_zones" && (
        <div className="card">
          <h2 className="mt-0">Where's your problem zone?</h2>
          <p className="muted mb-4">
            Think about the range of motion where you feel issues. Tap all zones that apply.
            0° is fully straight, 90° is a right angle.
          </p>

          {/* Visual ROM indicator */}
          <div className="bg-surface-raised rounded-xl p-4 mb-4 border border-surface-border">
            <div className="flex justify-between mb-2">
              <span className="text-xs">Straight (0°)</span>
              <span className="text-xs">Deep bend (135°+)</span>
            </div>
            <div className="flex gap-0.5 h-10">
              {ROM_ZONES.map((zone, i) => (
                <button
                  key={i}
                  onClick={() => toggleZone(i)}
                  className="flex-1 border-none rounded cursor-pointer transition-colors duration-200"
                  style={{
                    background: selectedZones.includes(i)
                      ? zoneSeverities[i] === 3 ? "#dc2626"
                        : zoneSeverities[i] === 2 ? "#f59e0b"
                        : "#6366f1"
                      : "var(--color-surface-border)",
                  }}
                  title={zone.label}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {[0, 45, 90, 135].map(deg => (
                <span key={deg} className="text-[10px] text-muted">{deg}°</span>
              ))}
            </div>
          </div>

          {/* Selected zones with severity */}
          {selectedZones.length > 0 && (
            <div className="mb-4">
              <div className="section-header">Selected problem zones</div>
              {selectedZones.sort((a, b) => a - b).map(zoneIndex => (
                <div
                  key={zoneIndex}
                  className="bg-surface-raised rounded-lg p-3 mt-2 border border-surface-border"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{ROM_ZONES[zoneIndex].label}</span>
                    <button
                      onClick={() => toggleZone(zoneIndex)}
                      className="bg-transparent border-none text-muted cursor-pointer text-lg"
                      aria-label="Remove zone"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-2">
                    <span className="muted text-xs">Severity:</span>
                    <div className="flex gap-2 mt-1">
                      {([1, 2, 3] as const).map(sev => (
                        <button
                          key={sev}
                          onClick={() => setZoneSeverity(zoneIndex, sev)}
                          className={`chip flex-1 ${zoneSeverities[zoneIndex] === sev ?
                            sev === 3 ? "selected-danger" : sev === 2 ? "selected-warning" : "selected"
                            : ""}`}
                        >
                          {sev === 1 ? "Mild" : sev === 2 ? "Moderate" : "Severe"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedZones.length === 0 && (
            <p className="muted text-center p-5">
              Tap the zones above where you experience issues
            </p>
          )}

          <div className="flex gap-2 mt-4">
            <button className="btn flex-1" onClick={prevStep}>Back</button>
            <button
              className="btn btn-primary flex-[2]"
              onClick={nextStep}
              disabled={selectedZones.length === 0}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step: Issue Types */}
      {step === "issue_types" && (
        <div className="card">
          <h2 className="mt-0">What do you experience?</h2>
          <p className="muted mb-4">
            For each problem zone, what type of issues do you feel?
          </p>

          {selectedZones.sort((a, b) => a - b).map(zoneIndex => (
            <div
              key={zoneIndex}
              className="bg-surface-raised rounded-lg p-3 mb-3 border border-surface-border"
            >
              <div className="font-medium mb-2">{ROM_ZONES[zoneIndex].label}</div>
              <div className="chip-group">
                {(Object.keys(ISSUE_TYPE_LABELS) as IssueType[]).map(issueType => (
                  <button
                    key={issueType}
                    className={`chip ${(zoneIssueTypes[zoneIndex] || []).includes(issueType) ? "selected" : ""}`}
                    onClick={() => toggleZoneIssueType(zoneIndex, issueType)}
                  >
                    {ISSUE_TYPE_LABELS[issueType]}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-2 mt-4">
            <button className="btn flex-1" onClick={prevStep}>Back</button>
            <button className="btn btn-primary flex-[2]" onClick={nextStep}>Continue</button>
          </div>
        </div>
      )}

      {/* Step: Contexts */}
      {step === "contexts" && (
        <div className="card">
          <h2 className="mt-0">When does it happen?</h2>
          <p className="muted mb-4">
            Select all the situations when you typically experience issues in your problem zones.
          </p>

          <div className="chip-group flex-col items-stretch">
            {(Object.keys(ISSUE_CONTEXT_LABELS) as IssueContext[]).map(context => (
              <button
                key={context}
                className={`chip text-left justify-start ${profile.issueContexts.includes(context) ? "selected" : ""}`}
                onClick={() => toggleContext(context)}
              >
                {ISSUE_CONTEXT_LABELS[context]}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button className="btn flex-1" onClick={prevStep}>Back</button>
            <button className="btn btn-primary flex-[2]" onClick={nextStep}>Continue</button>
          </div>
        </div>
      )}

      {/* Step: Movements */}
      {step === "movements" && (
        <div className="card">
          <h2 className="mt-0">Which movements are affected?</h2>
          <p className="muted mb-4">
            Select movements where you notice your knee issues.
          </p>

          <div className="flex flex-col gap-2">
            {MOVEMENT_PATTERNS.map(movement => (
              <button
                key={movement.id}
                className={`chip text-left justify-start flex-col items-start py-2.5 px-3.5 ${profile.affectedMovements.includes(movement.id) ? "selected-warning" : ""}`}
                onClick={() => toggleMovement(movement.id)}
              >
                <span className="font-medium">{movement.name}</span>
                <span className="text-xs opacity-70">{movement.description}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button className="btn flex-1" onClick={prevStep}>Back</button>
            <button className="btn btn-primary flex-[2]" onClick={nextStep}>Continue</button>
          </div>
        </div>
      )}

      {/* Step: Goals */}
      {step === "goals" && (
        <div className="card">
          <h2 className="mt-0">What's your primary goal?</h2>
          <p className="muted mb-4">
            This helps us prioritize what matters most to you.
          </p>

          <div className="flex flex-col gap-2">
            {[
              { id: "pain_free" as const, label: "Pain-free daily life", desc: "Move through the day without knee issues" },
              { id: "daily_function" as const, label: "Full daily function", desc: "Stairs, sitting, walking without limitation" },
              { id: "return_to_sport" as const, label: "Return to sport", desc: "Get back to playing at a good level" },
              { id: "full_performance" as const, label: "Full athletic performance", desc: "Perform at or above pre-injury level" },
            ].map(goal => (
              <button
                key={goal.id}
                className={`chip text-left justify-start flex-col items-start py-3 px-3.5 ${profile.primaryGoal === goal.id ? "selected" : ""}`}
                onClick={() => setGoal(goal.id)}
              >
                <span className="font-medium">{goal.label}</span>
                <span className="text-xs opacity-70">{goal.desc}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button className="btn flex-1" onClick={prevStep}>Back</button>
            <button className="btn btn-primary flex-[2]" onClick={nextStep}>Continue</button>
          </div>
        </div>
      )}

      {/* Step: Summary */}
      {step === "summary" && (
        <div className="card">
          <h2 className="mt-0">Your Knee Profile</h2>

          <div className="mb-4">
            <div className="section-header">Problem Zones</div>
            {selectedZones.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {selectedZones.sort((a, b) => a - b).map(i => (
                  <span
                    key={i}
                    className={`badge ${
                      zoneSeverities[i] === 3 ? "selected-danger" :
                      zoneSeverities[i] === 2 ? "selected-warning" : ""
                    }`}
                    style={{
                      background: zoneSeverities[i] === 3 ? "var(--color-chip-danger-bg)" :
                                  zoneSeverities[i] === 2 ? "var(--color-chip-warning-bg)" : "var(--color-chip-selected-bg)",
                      borderColor: zoneSeverities[i] === 3 ? "#ef4444" :
                                   zoneSeverities[i] === 2 ? "#f59e0b" : "#4f46e5",
                    }}
                  >
                    {ROM_ZONES[i].label}
                  </span>
                ))}
              </div>
            ) : (
              <span className="muted">None selected</span>
            )}
          </div>

          <div className="mb-4">
            <div className="section-header">Issue Contexts</div>
            {profile.issueContexts.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {profile.issueContexts.map(c => (
                  <span key={c} className="badge">{ISSUE_CONTEXT_LABELS[c]}</span>
                ))}
              </div>
            ) : (
              <span className="muted">None selected</span>
            )}
          </div>

          <div className="mb-4">
            <div className="section-header">Affected Movements</div>
            {profile.affectedMovements.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {profile.affectedMovements.map(m => {
                  const movement = MOVEMENT_PATTERNS.find(p => p.id === m);
                  return <span key={m} className="badge">{movement?.name || m}</span>;
                })}
              </div>
            ) : (
              <span className="muted">None selected</span>
            )}
          </div>

          <div className="mb-4">
            <div className="section-header">Primary Goal</div>
            <span className="font-medium">
              {profile.primaryGoal === "pain_free" && "Pain-free daily life"}
              {profile.primaryGoal === "daily_function" && "Full daily function"}
              {profile.primaryGoal === "return_to_sport" && "Return to sport"}
              {profile.primaryGoal === "full_performance" && "Full athletic performance"}
            </span>
          </div>

          <hr />

          <p className="muted text-[13px]">
            The app will now tailor exercises and recommendations based on your specific
            problem zones. You can update this profile anytime from settings.
          </p>

          <div className="flex gap-2 mt-4">
            <button className="btn flex-1" onClick={prevStep}>Back</button>
            <button className="btn btn-primary flex-[2]" onClick={finishCalibration}>
              Save & Start Using App
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
