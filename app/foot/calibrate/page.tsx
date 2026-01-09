"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FOOT_FUNCTIONAL_ZONES,
  FootCalibrationProfile,
  FootPainLocation,
  FootMovementRestriction,
  FOOT_PAIN_LOCATION_CATEGORIES,
  FOOT_PAIN_LOCATION_LABELS,
  FOOT_MOVEMENT_CATEGORIES,
  FOOT_MOVEMENT_LABELS,
} from "@/lib/body-parts/foot";
import { 
  ISSUE_CONTEXT_LABELS, 
  IssueContext,
  REHAB_GOAL_INFO,
  RehabGoal,
  BODY_PART_INFO,
} from "@/lib/body-parts";

const ISSUE_CONTEXTS: IssueContext[] = ["first_steps", "after_rest", "loading", "static", "impact", "fatigue", "end_of_day", "cold", "always"];
const REHAB_GOALS: RehabGoal[] = ["pain_free", "daily_function", "return_to_sport", "full_performance"];

export default function FootCalibratePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [calibration, setCalibration] = useState<Partial<FootCalibrationProfile>>({
    bodyPart: "foot",
    problemZones: [],
    painLocations: [],
    movementRestrictions: [],
    issueContexts: [],
    affectedMovements: [],
    primaryGoal: "full_performance",
    affectedSide: "both",
  });

  useEffect(() => {
    const saved = localStorage.getItem("bodyCoach.foot.calibration");
    if (saved) {
      setCalibration(JSON.parse(saved));
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

  const togglePainLocation = (loc: FootPainLocation) => {
    setCalibration(prev => ({
      ...prev,
      painLocations: prev.painLocations?.includes(loc)
        ? prev.painLocations.filter(l => l !== loc)
        : [...(prev.painLocations || []), loc],
    }));
  };

  const toggleMovement = (m: FootMovementRestriction) => {
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
    const final: FootCalibrationProfile = {
      bodyPart: "foot",
      createdAt: calibration.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      primaryGoal: calibration.primaryGoal || "full_performance",
      issueContexts: calibration.issueContexts || [],
      affectedMovements: calibration.movementRestrictions || [],
      problemZones: calibration.problemZones || [],
      painLocations: calibration.painLocations || [],
      movementRestrictions: calibration.movementRestrictions || [],
      affectedSide: calibration.affectedSide || "both",
    };
    localStorage.setItem("bodyCoach.foot.calibration", JSON.stringify(final));
    router.push("/foot");
  };

  const info = BODY_PART_INFO.foot;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48 }}>{info.icon}</div>
              <h2 style={{ margin: "12px 0 8px" }}>Foot Profile Setup</h2>
              <p className="muted">Let's understand your foot so we can personalize your rehab.</p>
            </div>
            <div style={{ marginTop: 20 }}>
              <h3>What we'll cover:</h3>
              <ul style={{ color: "#9ca3af", lineHeight: 1.8 }}>
                <li>Which foot is affected</li>
                <li>When symptoms occur (first steps, standing, etc.)</li>
                <li>Where you feel symptoms</li>
                <li>Which activities are affected</li>
                <li>Your rehab goal</li>
              </ul>
            </div>
            <button className="btn btn-primary" onClick={() => setStep(1)} style={{ width: "100%", marginTop: 20 }}>
              Get Started
            </button>
          </>
        );

      case 1:
        return (
          <>
            <h2>Which foot is affected?</h2>
            <p className="muted">Select the side with issues.</p>
            <div className="chip-group" style={{ marginTop: 16 }}>
              {(["left", "right", "both"] as const).map(side => (
                <button
                  key={side}
                  className={`chip ${calibration.affectedSide === side ? "selected" : ""}`}
                  onClick={() => setCalibration(prev => ({ ...prev, affectedSide: side }))}
                  style={{ flex: 1, padding: "16px" }}
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
            <h2>When do you experience issues?</h2>
            <p className="muted">Tap all situations where symptoms occur. This is especially important for foot issues.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
              {FOOT_FUNCTIONAL_ZONES.map((zone, idx) => {
                const selected = calibration.problemZones?.find(pz => pz.zoneIndex === idx);
                return (
                  <div key={idx}>
                    <button
                      className={`chip ${selected ? "selected" : ""}`}
                      onClick={() => toggleProblemZone(idx)}
                      style={{ width: "100%", textAlign: "left", padding: "12px 16px" }}
                    >
                      <div style={{ fontWeight: 500 }}>{zone.label}</div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>{zone.description}</div>
                    </button>
                    {selected && (
                      <div className="chip-group" style={{ marginTop: 8, marginLeft: 16 }}>
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
            <p className="muted">Select all areas where you notice issues. Be as specific as possible.</p>
            {FOOT_PAIN_LOCATION_CATEGORIES.map(cat => (
              <div key={cat.label} style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{cat.label}</div>
                <div className="chip-group">
                  {cat.locations.map(loc => (
                    <button
                      key={loc}
                      className={`chip ${calibration.painLocations?.includes(loc) ? "selected" : ""}`}
                      onClick={() => togglePainLocation(loc)}
                    >
                      {FOOT_PAIN_LOCATION_LABELS[loc]}
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
            <h2>Which activities are affected?</h2>
            <p className="muted">Select activities that feel limited or provoke symptoms.</p>
            {FOOT_MOVEMENT_CATEGORIES.map(cat => (
              <div key={cat.label} style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{cat.label}</div>
                <div className="chip-group">
                  {cat.movements.map(m => (
                    <button
                      key={m}
                      className={`chip ${calibration.movementRestrictions?.includes(m) ? "selected" : ""}`}
                      onClick={() => toggleMovement(m)}
                    >
                      {FOOT_MOVEMENT_LABELS[m]}
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
            <div className="chip-group" style={{ marginTop: 16 }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
              {REHAB_GOALS.map(goal => (
                <button
                  key={goal}
                  className={`chip ${calibration.primaryGoal === goal ? "selected" : ""}`}
                  onClick={() => setCalibration(prev => ({ ...prev, primaryGoal: goal }))}
                  style={{ width: "100%", textAlign: "left", padding: "12px 16px" }}
                >
                  <div style={{ fontWeight: 500 }}>{REHAB_GOAL_INFO[goal].label}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{REHAB_GOAL_INFO[goal].description}</div>
                </button>
              ))}
            </div>
          </>
        );

      case 7:
        return (
          <>
            <h2>Profile Complete! ✓</h2>
            <p className="muted">Your foot profile has been saved.</p>
            <div className="card" style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13 }}>
                <p><strong>Affected Side:</strong> {calibration.affectedSide}</p>
                <p><strong>Problem Situations:</strong> {calibration.problemZones?.map(pz => FOOT_FUNCTIONAL_ZONES[pz.zoneIndex]?.label).join(", ") || "None"}</p>
                <p><strong>Pain Locations:</strong> {calibration.painLocations?.map(l => FOOT_PAIN_LOCATION_LABELS[l]).join(", ") || "None"}</p>
                <p><strong>Affected Activities:</strong> {calibration.movementRestrictions?.length || 0} selected</p>
                <p><strong>Goal:</strong> {REHAB_GOAL_INFO[calibration.primaryGoal || "full_performance"].label}</p>
              </div>
            </div>
            <button className="btn btn-primary" onClick={saveCalibration} style={{ width: "100%", marginTop: 20 }}>
              Go to Daily Check-in
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <div className="card">
        {renderStep()}
        {step > 0 && step < 7 && (
          <div className="row" style={{ justifyContent: "space-between", marginTop: 24 }}>
            <button className="btn" onClick={() => setStep(step - 1)}>Back</button>
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Continue</button>
          </div>
        )}
      </div>
    </main>
  );
}
