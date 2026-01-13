"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  KNEE_ROM_ZONES,
  KneeCalibrationProfile,
  KneePainLocation,
  KneeMovementRestriction,
  KNEE_MOVEMENT_CATEGORIES,
  KNEE_MOVEMENT_LABELS,
} from "@/lib/body-parts/knee";
import {
  REHAB_GOAL_INFO,
  RehabGoal,
  BODY_PART_INFO,
} from "@/lib/body-parts";
import { KneeDiagram } from "@/app/components/KneeDiagram";
import { ExpandableNotes } from "@/app/components/ExpandableNotes";

const REHAB_GOALS: RehabGoal[] = ["pain_free", "daily_function", "return_to_sport", "full_performance"];

export default function KneeCalibratePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [calibration, setCalibration] = useState<Partial<KneeCalibrationProfile>>({
    bodyPart: "knee",
    problemZones: [],
    painLocations: [],
    movementRestrictions: [],
    issueContexts: [],
    affectedMovements: [],
    primaryGoal: "full_performance",
  });
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("bodyCoach.knee.calibration");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCalibration(parsed);
      setNotes(parsed.notes || "");
    }
  }, []);

  const togglePainLocation = (loc: KneePainLocation) => {
    setCalibration(prev => ({
      ...prev,
      painLocations: prev.painLocations?.includes(loc)
        ? prev.painLocations.filter(l => l !== loc)
        : [...(prev.painLocations || []), loc],
    }));
  };

  const toggleMovement = (m: KneeMovementRestriction) => {
    setCalibration(prev => ({
      ...prev,
      movementRestrictions: prev.movementRestrictions?.includes(m)
        ? prev.movementRestrictions.filter(x => x !== m)
        : [...(prev.movementRestrictions || []), m],
    }));
  };

  const saveCalibration = () => {
    const final: KneeCalibrationProfile & { notes?: string } = {
      bodyPart: "knee",
      createdAt: calibration.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      primaryGoal: calibration.primaryGoal || "full_performance",
      issueContexts: calibration.issueContexts || [],
      affectedMovements: calibration.movementRestrictions || [],
      problemZones: calibration.problemZones || [],
      painLocations: calibration.painLocations || [],
      movementRestrictions: calibration.movementRestrictions || [],
      notes: notes || undefined,
    };
    localStorage.setItem("bodyCoach.knee.calibration", JSON.stringify(final));
    router.push("/knee");
  };

  const info = BODY_PART_INFO.knee;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48 }}>{info.icon}</div>
              <h2 style={{ margin: "12px 0 8px" }}>Knee Profile</h2>
              <p className="muted">Quick setup to personalize your rehab.</p>
            </div>
            <div style={{
              background: "#1a1a1d",
              borderRadius: 10,
              padding: 14,
              marginTop: 16,
            }}>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>
                We'll cover:
              </div>
              <div style={{
                display: "flex",
                gap: 8,
                marginTop: 10,
                flexWrap: "wrap",
              }}>
                {["Pain location", "Movements", "Your goal"].map((item, i) => (
                  <span
                    key={item}
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "#0b0b0c",
                      border: "1px solid #2a2a2d",
                      color: "#b7bcc6",
                    }}
                  >
                    {i + 1}. {item}
                  </span>
                ))}
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setStep(1)}
              style={{ width: "100%", marginTop: 20 }}
            >
              Get Started
            </button>
            {calibration.createdAt && (
              <button
                className="btn"
                onClick={() => router.push("/knee")}
                style={{ width: "100%", marginTop: 8 }}
              >
                Keep Current Profile
              </button>
            )}
          </>
        );

      case 1:
        return (
          <>
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>Where does it hurt?</h2>
            <p className="muted" style={{ marginBottom: 16 }}>
              Tap the areas on the diagram where you feel symptoms.
            </p>

            <KneeDiagram
              selectedLocations={calibration.painLocations || []}
              onToggleLocation={togglePainLocation}
            />

            {(calibration.painLocations?.length || 0) === 0 && (
              <p className="muted" style={{
                textAlign: "center",
                padding: 16,
                fontSize: 13,
              }}>
                Tap zones on the diagram or labels below them
              </p>
            )}
          </>
        );

      case 2:
        return (
          <>
            <h2 style={{ marginTop: 0 }}>Which movements are affected?</h2>
            <p className="muted" style={{ marginBottom: 16 }}>
              Select movements that feel limited or provoke symptoms.
            </p>
            {KNEE_MOVEMENT_CATEGORIES.map(cat => (
              <div key={cat.label} style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{cat.label}</div>
                <div className="chip-group">
                  {cat.movements.map(m => (
                    <button
                      key={m}
                      className={`chip ${calibration.movementRestrictions?.includes(m) ? "selected" : ""}`}
                      onClick={() => toggleMovement(m)}
                    >
                      {KNEE_MOVEMENT_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        );

      case 3:
        return (
          <>
            <h2 style={{ marginTop: 0 }}>What's your main goal?</h2>
            <p className="muted" style={{ marginBottom: 16 }}>
              This helps prioritize the right exercises for you.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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

      case 4:
        return (
          <>
            <h2 style={{ marginTop: 0 }}>Profile Ready</h2>
            <p className="muted">Your knee profile has been configured.</p>

            <div style={{
              background: "#1a1a1d",
              borderRadius: 10,
              padding: 14,
              marginTop: 16,
            }}>
              <div style={{ fontSize: 13, marginBottom: 12 }}>
                <div style={{ color: "#9ca3af", fontSize: 11, marginBottom: 4 }}>PAIN LOCATIONS</div>
                <div>
                  {calibration.painLocations?.length
                    ? calibration.painLocations.length + " selected"
                    : "None selected"
                  }
                </div>
              </div>

              <div style={{ fontSize: 13, marginBottom: 12 }}>
                <div style={{ color: "#9ca3af", fontSize: 11, marginBottom: 4 }}>AFFECTED MOVEMENTS</div>
                <div>
                  {calibration.movementRestrictions?.length
                    ? calibration.movementRestrictions.length + " selected"
                    : "None selected"
                  }
                </div>
              </div>

              <div style={{ fontSize: 13 }}>
                <div style={{ color: "#9ca3af", fontSize: 11, marginBottom: 4 }}>GOAL</div>
                <div style={{ fontWeight: 500 }}>
                  {REHAB_GOAL_INFO[calibration.primaryGoal || "full_performance"].label}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <ExpandableNotes
                value={notes}
                onChange={setNotes}
                label="Add notes about your injury"
                placeholder="Any additional details about your knee issue, history, or what you've tried..."
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={saveCalibration}
              style={{ width: "100%", marginTop: 20 }}
            >
              Save & Continue
            </button>
          </>
        );

      default:
        return null;
    }
  };

  const totalSteps = 5;
  const progress = ((step) / (totalSteps - 1)) * 100;

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      {/* Progress indicator */}
      {step > 0 && step < 4 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
            fontSize: 12,
            color: "#9ca3af",
          }}>
            <span>Setup</span>
            <span>Step {step} of 3</span>
          </div>
          <div style={{ height: 4, background: "#2a2a2d", borderRadius: 2 }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#6366f1",
                borderRadius: 2,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      <div className="card">
        {renderStep()}
        {step > 0 && step < 4 && (
          <div className="row" style={{ justifyContent: "space-between", marginTop: 24 }}>
            <button className="btn" onClick={() => setStep(step - 1)}>Back</button>
            <button
              className="btn btn-primary"
              onClick={() => setStep(step + 1)}
            >
              Continue
            </button>
          </div>
        )}
        {step === 4 && (
          <button
            className="btn"
            onClick={() => setStep(step - 1)}
            style={{ width: "100%", marginTop: 8 }}
          >
            Back to Edit
          </button>
        )}
      </div>
    </main>
  );
}
