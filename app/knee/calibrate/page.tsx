"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { safeGet, safeSet } from "@/lib/storage/safe-storage";
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
    const parsed = safeGet<(KneeCalibrationProfile & { notes?: string }) | null>("bodyCoach.knee.calibration", null);
    if (parsed) {
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
    safeSet("bodyCoach.knee.calibration", final);
    router.push("/knee");
  };

  const info = BODY_PART_INFO.knee;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="text-center mb-5">
              <div className="text-5xl">{info.icon}</div>
              <h2 className="mt-3 mb-2">Knee Profile</h2>
              <p className="muted">Quick setup to personalize your rehab.</p>
            </div>
            <div className="bg-surface-raised rounded-[10px] p-3.5 mt-4">
              <div className="text-[13px] text-muted">
                We'll cover:
              </div>
              <div className="flex gap-2 mt-2.5 flex-wrap">
                {["Pain location", "Movements", "Your goal"].map((item, i) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-md bg-surface border border-surface-border text-muted"
                  >
                    {i + 1}. {item}
                  </span>
                ))}
              </div>
            </div>
            <button
              className="btn btn-primary w-full mt-5"
              onClick={() => setStep(1)}
            >
              Get Started
            </button>
            {calibration.createdAt && (
              <button
                className="btn w-full mt-2"
                onClick={() => router.push("/knee")}
              >
                Keep Current Profile
              </button>
            )}
          </>
        );

      case 1:
        return (
          <>
            <h2 className="mt-0 mb-2">Where does it hurt?</h2>
            <p className="muted mb-4">
              Tap the areas on the diagram where you feel symptoms.
            </p>

            <KneeDiagram
              selectedLocations={calibration.painLocations || []}
              onToggleLocation={togglePainLocation}
            />

            {(calibration.painLocations?.length || 0) === 0 && (
              <p className="muted text-center p-4 text-[13px]">
                Tap zones on the diagram or labels below them
              </p>
            )}
          </>
        );

      case 2:
        return (
          <>
            <h2 className="mt-0">Which movements are affected?</h2>
            <p className="muted mb-4">
              Select movements that feel limited or provoke symptoms.
            </p>
            {KNEE_MOVEMENT_CATEGORIES.map(cat => (
              <div key={cat.label} className="mt-4">
                <div className="text-xs text-muted mb-2">{cat.label}</div>
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
            <h2 className="mt-0">What's your main goal?</h2>
            <p className="muted mb-4">
              This helps prioritize the right exercises for you.
            </p>
            <div className="flex flex-col gap-2">
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

      case 4:
        return (
          <>
            <h2 className="mt-0">Profile Ready</h2>
            <p className="muted">Your knee profile has been configured.</p>

            <div className="bg-surface-raised rounded-[10px] p-3.5 mt-4">
              <div className="text-[13px] mb-3">
                <div className="text-muted text-[11px] mb-1">PAIN LOCATIONS</div>
                <div>
                  {calibration.painLocations?.length
                    ? calibration.painLocations.length + " selected"
                    : "None selected"
                  }
                </div>
              </div>

              <div className="text-[13px] mb-3">
                <div className="text-muted text-[11px] mb-1">AFFECTED MOVEMENTS</div>
                <div>
                  {calibration.movementRestrictions?.length
                    ? calibration.movementRestrictions.length + " selected"
                    : "None selected"
                  }
                </div>
              </div>

              <div className="text-[13px]">
                <div className="text-muted text-[11px] mb-1">GOAL</div>
                <div className="font-medium">
                  {REHAB_GOAL_INFO[calibration.primaryGoal || "full_performance"].label}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <ExpandableNotes
                value={notes}
                onChange={setNotes}
                label="Add notes about your injury"
                placeholder="Any additional details about your knee issue, history, or what you've tried..."
              />
            </div>

            <button
              className="btn btn-primary w-full mt-5"
              onClick={saveCalibration}
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
    <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
      {/* Progress indicator */}
      {step > 0 && step < 4 && (
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-xs text-muted">
            <span>Setup</span>
            <span>Step {step} of 3</span>
          </div>
          <div className="h-1 bg-surface-border rounded-sm">
            <div
              className="h-full rounded-sm transition-all duration-300"
              style={{ background: "var(--color-primary-border)", width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="card">
        {renderStep()}
        {step > 0 && step < 4 && (
          <div className="flex items-center justify-between mt-6">
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
            className="btn w-full mt-2"
            onClick={() => setStep(step - 1)}
          >
            Back to Edit
          </button>
        )}
      </div>
    </main>
  );
}
