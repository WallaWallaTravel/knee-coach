"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BodyPart, BODY_PART_INFO } from "@/lib/body-parts";
import { BodyPartSelector } from "@/app/components/BodyPartSelector";

// Body Coach - Multi-region rehabilitation app

export default function SelectBodyPartPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<BodyPart | null>(null);
  const [profiles, setProfiles] = useState<Record<BodyPart, boolean>>({
    knee: false,
    achilles: false,
    shoulder: false,
    foot: false,
  });
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    // Check which body parts have calibration profiles
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

    // Check for last used body part
    const lastUsed = localStorage.getItem("bodyCoach.lastBodyPart") as BodyPart | null;
    if (lastUsed && ["knee", "achilles", "shoulder", "foot"].includes(lastUsed)) {
      setSelected(lastUsed);
    }

    // Check if AI is enabled
    const aiSettings = localStorage.getItem("bodyCoach.settings.ai");
    if (aiSettings) {
      try {
        const settings = JSON.parse(aiSettings);
        setAiEnabled(settings.enableAIFeatures);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  function handleContinue() {
    if (!selected) return;
    
    localStorage.setItem("bodyCoach.lastBodyPart", selected);
    
    // Check if this body part has a calibration profile
    const hasProfile = profiles[selected];
    
    if (hasProfile) {
      router.push(`/${selected}`);
    } else {
      router.push(`/${selected}/calibrate`);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      {/* Header with settings */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <Link href="/settings" className="btn" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>⚙️</span>
          <span>Settings</span>
          {aiEnabled && <span style={{ color: "#22c55e" }}>✨</span>}
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: 24, marginTop: 24 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Body Coach</h1>
        <p className="muted">Your personal rehabilitation companion</p>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="section-header">What are we working on today?</div>
        <BodyPartSelector 
          selected={selected} 
          onSelect={setSelected}
          showDescription={true}
        />
      </div>

      {selected && (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 40 }}>{BODY_PART_INFO[selected].icon}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>{BODY_PART_INFO[selected].name}</div>
              <div className="muted" style={{ fontSize: 13 }}>
                {profiles[selected] 
                  ? "Profile saved • Ready for daily check-in" 
                  : "No profile yet • Let's calibrate"}
              </div>
            </div>
          </div>
          
          <button 
            className="btn btn-primary" 
            onClick={handleContinue}
            style={{ width: "100%", marginTop: 16 }}
          >
            {profiles[selected] ? "Start Daily Check-in" : "Set Up Profile"}
          </button>
        </div>
      )}

      {/* Quick access to existing profiles */}
      {Object.entries(profiles).some(([_, has]) => has) && (
        <div style={{ marginTop: 24 }}>
          <div className="section-header">Your Profiles</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(Object.entries(profiles) as [BodyPart, boolean][])
              .filter(([_, has]) => has)
              .map(([part]) => (
                <button
                  key={part}
                  className="btn"
                  onClick={() => {
                    localStorage.setItem("bodyCoach.lastBodyPart", part);
                    router.push(`/${part}`);
                  }}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 6,
                    borderColor: BODY_PART_INFO[part].color,
                  }}
                >
                  <span>{BODY_PART_INFO[part].icon}</span>
                  <span>{BODY_PART_INFO[part].name}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      <p className="muted" style={{ marginTop: 32, fontSize: 12, textAlign: "center" }}>
        Each body part has its own calibration profile and exercise library tailored to that region.
      </p>
    </main>
  );
}
