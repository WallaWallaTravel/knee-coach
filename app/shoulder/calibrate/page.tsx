"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { safeGet, safeSet } from "@/lib/storage/safe-storage";
import {
  SHOULDER_ROM_ZONES,
  ShoulderCalibrationProfile,
  ShoulderPainLocation,
  ShoulderMovementRestriction,
  SHOULDER_PAIN_LOCATION_CATEGORIES,
  SHOULDER_PAIN_LOCATION_LABELS,
  SHOULDER_MOVEMENT_CATEGORIES,
  SHOULDER_MOVEMENT_LABELS,
} from "@/lib/body-parts/shoulder";
import {
  ISSUE_CONTEXT_LABELS,
  IssueContext,
  REHAB_GOAL_INFO,
  RehabGoal,
  BODY_PART_INFO,
} from "@/lib/body-parts";

const ISSUE_CONTEXTS: IssueContext[] = ["static", "loading", "unloading", "concentric", "eccentric", "transition", "fatigue", "cold", "after_rest", "always"];
const REHAB_GOALS: RehabGoal[] = ["pain_free", "daily_function", "return_to_sport", "full_performance"];

export default function ShoulderCalibratePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [calibration, setCalibration] = useState<Partial<ShoulderCalibrationProfile>>({
    bodyPart: "shoulder",
    problemZones: [],
    painLocations: [],
    movementRestrictions: [],
    issueContexts: [],
    affectedMovements: [],
    primaryGoal: "full_performance",
    affectedSide: "right",
  });

  useEffect(() => {
    const saved = safeGet<Partial<ShoulderCalibrationProfile> | null>("bodyCoach.shoulder.calibration", null);
    if (saved) {
      setCalibration(saved);
    }
  }, []);

  const toggleProblemZone = (zoneIndex: number) => {
    const existing = calibration.problemZones?.find(pz => pz.zoneIndex === zoneIndex);
    if (existing) {
      setCalibration(prev => ({
        ...prev,
        problemZones: prev.problemZones?.filter(pz => pz.zoneIndex !== zoneIndex),
      }));
    } else {
      setCalibration(prev => ({
        ...prev,
        problemZones: [...(prev.problemZones || []), { zoneIndex, issueTypes: [], severity: 2 as const }],
      }));
    }
  };

  const setZoneSeverity = (zoneIndex: number, severity: 1 | 2 | 3) => {
    setCalibration(prev => ({
      ...prev,
      problemZones: prev.problemZones?.map(pz =>
        pz.zoneIndex === zoneIndex ? { ...pz, severity } : pz
      ),
    }));
  };

  const togglePainLocation = (loc: ShoulderPainLocation) => {
    setCalibration(prev => ({
      ...prev,
      painLocations: prev.painLocations?.includes(loc)
        ? prev.painLocations.filter(l => l !== loc)
        : [...(prev.painLocations || []), loc],
    }));
  };

  const toggleMovement = (m: ShoulderMovementRestriction) => {
    setCalibration(prev => ({
      ...prev,
      movementRestrictions: prev.movementRestrictions?.includes(m)
        ? prev.movementRestrictions.filter(x => x !== m)
        : [...(prev.movementRestrictions || []), m],
    }));
  };

  const toggleIssueContext = (ctx: IssueContext) => {
    setCalibration(prev => ({
      ...prev,
      issueContexts: prev.issueContexts?.includes(ctx)
        ? prev.issueContexts.filter(c => c !== ctx)
        : [...(prev.issueContexts || []), ctx],
    }));
  };

  const saveCalibration = () => {
    const final: ShoulderCalibrationProfile = {
      bodyPart: "shoulder",
      createdAt: calibration.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      primaryGoal: calibration.primaryGoal || "full_performance",
      issueContexts: calibration.issueContexts || [],
      affectedMovements: calibration.movementRestrictions || [],
      problemZones: calibration.problemZones || [],
      painLocations: calibration.painLocations || [],
      movementRestrictions: calibration.movementRestrictions || [],
      affectedSide: calibration.affectedSide || "right",
    };
    safeSet("bodyCoach.shoulder.calibration", final);
    router.push("/shoulder");
  };

  const info = BODY_PART_INFO.shoulder;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="text-center mb-5">
              <div className="text-5xl">{info.icon}</div>
              <h2 className="mt-3 mb-2">Shoulder Profile Setup</h2>
              <p className="muted">Let's understand your shoulder so we can personalize your rehab.</p>
            </div>
            <div className="mt-5">
              <h3>What we'll cover:</h3>
              <ul className="text-muted leading-relaxed">
                <li>Which side is affected</li>
                <li>Your problem range of motion</li>
                <li>Where you feel symptoms</li>
                <li>Which movements are affected</li>
                <li>Your rehab goal</li>
              </ul>
            </div>
            <button className="btn btn-primary w-full mt-5" onClick={() => setStep(1)}>
              Get Started
            </button>
          </>
        );

      case 1:
        return (
          <>
            <h2>Which shoulder is affected?</h2>
            <p className="muted">Select the side with issues.</p>
            <div className="chip-group mt-4">
              {(["left", "right", "both"] as const).map(side => (
                <button
                  key={side}
                  className={`chip flex-1 py-4 ${calibration.affectedSide === side ? "selected" : ""}`}
                  onClick={() => setCalibration(prev => ({ ...prev, affectedSide: side }))}
                >
                  {side === "left" ? "Left" : side === "right" ? "Right" : "Both"}
                </button>
              ))}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2>Where's your problem zone?</h2>
            <p className="muted">Tap the arm positions where you experience issues. 0° is arm at side, 180° is straight overhead.</p>
            <div className="flex flex-col gap-2 mt-4">
              {SHOULDER_ROM_ZONES.map((zone, idx) => {
                const selected = calibration.problemZones?.find(pz => pz.zoneIndex === idx);
                return (
                  <div key={idx}>
                    <button
                      className={`chip w-full text-left py-3 px-4 ${selected ? "selected" : ""}`}
                      onClick={() => toggleProblemZone(idx)}
                    >
                      <div className="font-medium">{zone.label}</div>
                      <div className="text-xs opacity-70">{zone.description}</div>
                    </button>
                    {selected && (
                      <div className="chip-group mt-2 ml-4">
                        {([1, 2, 3] as const).map(sev => (
                          <button
                            key={sev}
                            className={`chip ${selected.severity === sev ? "selected" : ""}`}
                            onClick={() => setZoneSeverity(idx, sev)}
                          >
                            {sev === 1 ? "Mild" : sev === 2 ? "Moderate" : "Severe"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h2>Where do you feel symptoms?</h2>
            <p className="muted">Select all areas where you notice issues.</p>
            {SHOULDER_PAIN_LOCATION_CATEGORIES.map(cat => (
              <div key={cat.label} className="mt-4">
                <div className="text-xs text-muted mb-2">{cat.label}</div>
                <div className="chip-group">
                  {cat.locations.map(loc => (
                    <button
                      key={loc}
                      className={`chip ${calibration.painLocations?.includes(loc) ? "selected" : ""}`}
                      onClick={() => togglePainLocation(loc)}
                    >
                      {SHOULDER_PAIN_LOCATION_LABELS[loc]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        );

      case 4:
        return (
          <>
            <h2>Which movements are affected?</h2>
            <p className="muted">Select movements that feel limited or provoke symptoms.</p>
            {SHOULDER_MOVEMENT_CATEGORIES.map(cat => (
              <div key={cat.label} className="mt-4">
                <div className="text-xs text-muted mb-2">{cat.label}</div>
                <div className="chip-group">
                  {cat.movements.map(m => (
                    <button
                      key={m}
                      className={`chip ${calibration.movementRestrictions?.includes(m) ? "selected" : ""}`}
                      onClick={() => toggleMovement(m)}
                    >
                      {SHOULDER_MOVEMENT_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        );

      case 5:
        return (
          <>
            <h2>When do issues typically occur?</h2>
            <p className="muted">Select all that apply.</p>
            <div className="chip-group mt-4">
              {ISSUE_CONTEXTS.map(ctx => (
                <button
                  key={ctx}
                  className={`chip ${calibration.issueContexts?.includes(ctx) ? "selected" : ""}`}
                  onClick={() => toggleIssueContext(ctx)}
                >
                  {ISSUE_CONTEXT_LABELS[ctx]}
                </button>
              ))}
            </div>
          </>
        );

      case 6:
        return (
          <>
            <h2>What's your main goal?</h2>
            <p className="muted">This helps us prioritize the right exercises.</p>
            <div className="flex flex-col gap-2 mt-4">
              {REHAB_GOALS.map(goal => (
                <button
                  key={goal}
                  className={`chip w-full text-left py-3 px-4 ${calibration.primaryGoal === goal ? "selected" : ""}`}
                  onClick={() => setCalibration(prev => ({ ...prev, primaryGoal: goal }))}
                >
                  <div className="font-medium">{REHAB_GOAL_INFO[goal].label}</div>
                  <div className="text-xs opacity-70">{REHAB_GOAL_INFO[goal].description}</div>
                </button>
              ))}
            </div>
          </>
        );

      case 7:
        return (
          <>
            <h2>Profile Complete! ✓</h2>
            <p className="muted">Your shoulder profile has been saved.</p>
            <div className="card mt-4">
              <div className="text-[13px]">
                <p><strong>Affected Side:</strong> {calibration.affectedSide}</p>
                <p><strong>Problem Zones:</strong> {calibration.problemZones?.map(pz => SHOULDER_ROM_ZONES[pz.zoneIndex]?.label).join(", ") || "None"}</p>
                <p><strong>Pain Locations:</strong> {calibration.painLocations?.map(l => SHOULDER_PAIN_LOCATION_LABELS[l]).join(", ") || "None"}</p>
                <p><strong>Affected Movements:</strong> {calibration.movementRestrictions?.length || 0} selected</p>
                <p><strong>Goal:</strong> {REHAB_GOAL_INFO[calibration.primaryGoal || "full_performance"].label}</p>
              </div>
            </div>
            <button className="btn btn-primary w-full mt-5" onClick={saveCalibration}>
              Go to Daily Check-in
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
      <div className="card">
        {renderStep()}
        {step > 0 && step < 7 && (
          <div className="flex items-center justify-between mt-6">
            <button className="btn" onClick={() => setStep(step - 1)}>Back</button>
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Continue</button>
          </div>
        )}
      </div>
    </main>
  );
}
