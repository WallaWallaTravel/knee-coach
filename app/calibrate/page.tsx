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
  
  // For problem zone selection
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [zoneSeverities, setZoneSeverities] = useState<Record<number, 1 | 2 | 3>>({});
  const [zoneIssueTypes, setZoneIssueTypes] = useState<Record<number, IssueType[]>>({});
  
  // Load existing calibration on mount
  useEffect(() => {
    const existing = loadCalibration();
    if (existing) {
      setProfile(existing);
      // Restore zone selections
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
      // Save intermediate data before moving
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
    // Build final problem zones
    const problemZones: ROMIssue[] = selectedZones.map(zoneIndex => ({
      zoneIndex,
      issueTypes: zoneIssueTypes[zoneIndex] || ["pain"],
      severity: zoneSeverities[zoneIndex] || 2,
    }));
    
    // Calculate safe zones (zones not in problem zones)
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
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span className="muted" style={{ fontSize: 12 }}>Calibration</span>
          <span className="muted" style={{ fontSize: 12 }}>{stepIndex + 1} of {STEPS.length}</span>
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

      {/* Step: Intro */}
      {step === "intro" && (
        <div className="card">
          <h1 style={{ marginTop: 0, fontSize: 24 }}>Let's calibrate your knee profile</h1>
          <p className="muted">
            Every knee issue is different. This calibration helps the app understand exactly 
            where in your range of motion you experience problems, so we can tailor exercises 
            and recommendations specifically for you.
          </p>
          <hr />
          <h3 style={{ marginBottom: 8 }}>What we'll cover:</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>Your problem range of motion zones</li>
            <li style={{ marginBottom: 8 }}>What type of issues you experience</li>
            <li style={{ marginBottom: 8 }}>When the issues occur</li>
            <li style={{ marginBottom: 8 }}>Which movements are affected</li>
            <li>Your rehab goals</li>
          </ul>
          <p className="muted" style={{ marginTop: 16, fontSize: 13 }}>
            This takes about 2-3 minutes. You can update it anytime.
          </p>
          <button className="btn btn-primary" onClick={nextStep} style={{ width: "100%", marginTop: 16 }}>
            Get Started
          </button>
        </div>
      )}

      {/* Step: Problem Zones */}
      {step === "problem_zones" && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Where's your problem zone?</h2>
          <p className="muted" style={{ marginBottom: 16 }}>
            Think about the range of motion where you feel issues. Tap all zones that apply.
            0° is fully straight, 90° is a right angle.
          </p>
          
          {/* Visual ROM indicator */}
          <div style={{ 
            background: "#1a1a1d", 
            borderRadius: 12, 
            padding: 16, 
            marginBottom: 16,
            border: "1px solid #2a2a2d",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12 }}>Straight (0°)</span>
              <span style={{ fontSize: 12 }}>Deep bend (135°+)</span>
            </div>
            <div style={{ display: "flex", gap: 2, height: 40 }}>
              {ROM_ZONES.map((zone, i) => (
                <button
                  key={i}
                  onClick={() => toggleZone(i)}
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    background: selectedZones.includes(i) 
                      ? zoneSeverities[i] === 3 ? "#dc2626" 
                        : zoneSeverities[i] === 2 ? "#f59e0b" 
                        : "#6366f1"
                      : "#2a2a2d",
                    transition: "background 0.2s ease",
                  }}
                  title={zone.label}
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {[0, 45, 90, 135].map(deg => (
                <span key={deg} style={{ fontSize: 10, color: "#6b7280" }}>{deg}°</span>
              ))}
            </div>
          </div>

          {/* Selected zones with severity */}
          {selectedZones.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="section-header">Selected problem zones</div>
              {selectedZones.sort((a, b) => a - b).map(zoneIndex => (
                <div 
                  key={zoneIndex} 
                  style={{ 
                    background: "#1a1a1d", 
                    borderRadius: 8, 
                    padding: 12, 
                    marginTop: 8,
                    border: "1px solid #2a2a2d",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 500 }}>{ROM_ZONES[zoneIndex].label}</span>
                    <button 
                      onClick={() => toggleZone(zoneIndex)}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "#6b7280", 
                        cursor: "pointer",
                        fontSize: 18,
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span className="muted" style={{ fontSize: 12 }}>Severity:</span>
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      {([1, 2, 3] as const).map(sev => (
                        <button
                          key={sev}
                          onClick={() => setZoneSeverity(zoneIndex, sev)}
                          className={`chip ${zoneSeverities[zoneIndex] === sev ? 
                            sev === 3 ? "selected-danger" : sev === 2 ? "selected-warning" : "selected" 
                            : ""}`}
                          style={{ flex: 1 }}
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
            <p className="muted" style={{ textAlign: "center", padding: 20 }}>
              Tap the zones above where you experience issues
            </p>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn" onClick={prevStep} style={{ flex: 1 }}>Back</button>
            <button 
              className="btn btn-primary" 
              onClick={nextStep} 
              style={{ flex: 2 }}
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
          <h2 style={{ marginTop: 0 }}>What do you experience?</h2>
          <p className="muted" style={{ marginBottom: 16 }}>
            For each problem zone, what type of issues do you feel?
          </p>

          {selectedZones.sort((a, b) => a - b).map(zoneIndex => (
            <div 
              key={zoneIndex}
              style={{ 
                background: "#1a1a1d", 
                borderRadius: 8, 
                padding: 12, 
                marginBottom: 12,
                border: "1px solid #2a2a2d",
              }}
            >
              <div style={{ fontWeight: 500, marginBottom: 8 }}>{ROM_ZONES[zoneIndex].label}</div>
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

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn" onClick={prevStep} style={{ flex: 1 }}>Back</button>
            <button className="btn btn-primary" onClick={nextStep} style={{ flex: 2 }}>Continue</button>
          </div>
        </div>
      )}

      {/* Step: Contexts */}
      {step === "contexts" && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>When does it happen?</h2>
          <p className="muted" style={{ marginBottom: 16 }}>
            Select all the situations when you typically experience issues in your problem zones.
          </p>

          <div className="chip-group" style={{ flexDirection: "column", alignItems: "stretch" }}>
            {(Object.keys(ISSUE_CONTEXT_LABELS) as IssueContext[]).map(context => (
              <button
                key={context}
                className={`chip ${profile.issueContexts.includes(context) ? "selected" : ""}`}
                onClick={() => toggleContext(context)}
                style={{ textAlign: "left", justifyContent: "flex-start" }}
              >
                {ISSUE_CONTEXT_LABELS[context]}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn" onClick={prevStep} style={{ flex: 1 }}>Back</button>
            <button className="btn btn-primary" onClick={nextStep} style={{ flex: 2 }}>Continue</button>
          </div>
        </div>
      )}

      {/* Step: Movements */}
      {step === "movements" && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Which movements are affected?</h2>
          <p className="muted" style={{ marginBottom: 16 }}>
            Select movements where you notice your knee issues.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MOVEMENT_PATTERNS.map(movement => (
              <button
                key={movement.id}
                className={`chip ${profile.affectedMovements.includes(movement.id) ? "selected-warning" : ""}`}
                onClick={() => toggleMovement(movement.id)}
                style={{ 
                  textAlign: "left", 
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "10px 14px",
                }}
              >
                <span style={{ fontWeight: 500 }}>{movement.name}</span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>{movement.description}</span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn" onClick={prevStep} style={{ flex: 1 }}>Back</button>
            <button className="btn btn-primary" onClick={nextStep} style={{ flex: 2 }}>Continue</button>
          </div>
        </div>
      )}

      {/* Step: Goals */}
      {step === "goals" && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>What's your primary goal?</h2>
          <p className="muted" style={{ marginBottom: 16 }}>
            This helps us prioritize what matters most to you.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { id: "pain_free" as const, label: "Pain-free daily life", desc: "Move through the day without knee issues" },
              { id: "daily_function" as const, label: "Full daily function", desc: "Stairs, sitting, walking without limitation" },
              { id: "return_to_sport" as const, label: "Return to sport", desc: "Get back to playing at a good level" },
              { id: "full_performance" as const, label: "Full athletic performance", desc: "Perform at or above pre-injury level" },
            ].map(goal => (
              <button
                key={goal.id}
                className={`chip ${profile.primaryGoal === goal.id ? "selected" : ""}`}
                onClick={() => setGoal(goal.id)}
                style={{ 
                  textAlign: "left", 
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "12px 14px",
                }}
              >
                <span style={{ fontWeight: 500 }}>{goal.label}</span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>{goal.desc}</span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn" onClick={prevStep} style={{ flex: 1 }}>Back</button>
            <button className="btn btn-primary" onClick={nextStep} style={{ flex: 2 }}>Continue</button>
          </div>
        </div>
      )}

      {/* Step: Summary */}
      {step === "summary" && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Your Knee Profile</h2>
          
          <div style={{ marginBottom: 16 }}>
            <div className="section-header">Problem Zones</div>
            {selectedZones.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedZones.sort((a, b) => a - b).map(i => (
                  <span 
                    key={i} 
                    className={`badge ${
                      zoneSeverities[i] === 3 ? "selected-danger" : 
                      zoneSeverities[i] === 2 ? "selected-warning" : ""
                    }`}
                    style={{ 
                      background: zoneSeverities[i] === 3 ? "#7f1d1d" : 
                                  zoneSeverities[i] === 2 ? "#78350f" : "#1e1b4b",
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

          <div style={{ marginBottom: 16 }}>
            <div className="section-header">Issue Contexts</div>
            {profile.issueContexts.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {profile.issueContexts.map(c => (
                  <span key={c} className="badge">{ISSUE_CONTEXT_LABELS[c]}</span>
                ))}
              </div>
            ) : (
              <span className="muted">None selected</span>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div className="section-header">Affected Movements</div>
            {profile.affectedMovements.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {profile.affectedMovements.map(m => {
                  const movement = MOVEMENT_PATTERNS.find(p => p.id === m);
                  return <span key={m} className="badge">{movement?.name || m}</span>;
                })}
              </div>
            ) : (
              <span className="muted">None selected</span>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div className="section-header">Primary Goal</div>
            <span style={{ fontWeight: 500 }}>
              {profile.primaryGoal === "pain_free" && "Pain-free daily life"}
              {profile.primaryGoal === "daily_function" && "Full daily function"}
              {profile.primaryGoal === "return_to_sport" && "Return to sport"}
              {profile.primaryGoal === "full_performance" && "Full athletic performance"}
            </span>
          </div>

          <hr />

          <p className="muted" style={{ fontSize: 13 }}>
            The app will now tailor exercises and recommendations based on your specific 
            problem zones. You can update this profile anytime from settings.
          </p>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn" onClick={prevStep} style={{ flex: 1 }}>Back</button>
            <button className="btn btn-primary" onClick={finishCalibration} style={{ flex: 2 }}>
              Save & Start Using App
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
