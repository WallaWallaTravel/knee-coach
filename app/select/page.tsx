"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BodyPart, BODY_PART_INFO } from "@/lib/body-parts";
import { BodyPartSelector } from "@/app/components/BodyPartSelector";
import { safeGet, safeSet } from "@/lib/storage/safe-storage";

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
    setProfiles({
      knee: safeGet("bodyCoach.knee.calibration", null) !== null,
      achilles: safeGet("bodyCoach.achilles.calibration", null) !== null,
      shoulder: safeGet("bodyCoach.shoulder.calibration", null) !== null,
      foot: safeGet("bodyCoach.foot.calibration", null) !== null,
    });

    const lastUsed = safeGet<string | null>("bodyCoach.lastBodyPart", null) as BodyPart | null;
    if (lastUsed && ["knee", "achilles", "shoulder", "foot"].includes(lastUsed)) {
      setSelected(lastUsed);
    }

    const aiSettings = safeGet<{ enableAIFeatures?: boolean } | null>("bodyCoach.settings.ai", null);
    if (aiSettings) {
      setAiEnabled(!!aiSettings.enableAIFeatures);
    }
  }, []);

  function handleContinue() {
    if (!selected) return;

    safeSet("bodyCoach.lastBodyPart", selected);

    if (profiles[selected]) {
      router.push(`/${selected}`);
    } else {
      router.push(`/${selected}/calibrate`);
    }
  }

  return (
    <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
      {/* Header with settings */}
      <div className="flex justify-end mb-2">
        <Link href="/settings" className="btn flex items-center gap-1.5">
          <span>⚙️</span>
          <span>Settings</span>
          {aiEnabled && <span className="text-green-500">✨</span>}
        </Link>
      </div>

      <div className="text-center mb-6 mt-6">
        <h1 className="text-3xl mb-2">Body Coach</h1>
        <p className="muted">Your personal rehabilitation companion</p>
      </div>

      <div className="card mt-6">
        <div className="section-header">What are we working on today?</div>
        <BodyPartSelector
          selected={selected}
          onSelect={setSelected}
          showDescription={true}
        />
      </div>

      {selected && (
        <div className="card mt-4">
          <div className="flex items-center gap-3">
            <span className="text-[40px]">{BODY_PART_INFO[selected].icon}</span>
            <div>
              <div className="text-xl font-semibold">{BODY_PART_INFO[selected].name}</div>
              <div className="muted text-[13px]">
                {profiles[selected]
                  ? "Profile saved \u2022 Ready for daily check-in"
                  : "No profile yet \u2022 Let's calibrate"}
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary w-full mt-4"
            onClick={handleContinue}
          >
            {profiles[selected] ? "Start Daily Check-in" : "Set Up Profile"}
          </button>
        </div>
      )}

      {/* Quick access to existing profiles */}
      {Object.entries(profiles).some(([_, has]) => has) && (
        <div className="mt-6">
          <div className="section-header">Your Profiles</div>
          <div className="flex gap-2 flex-wrap">
            {(Object.entries(profiles) as [BodyPart, boolean][])
              .filter(([_, has]) => has)
              .map(([part]) => (
                <button
                  key={part}
                  className="btn flex items-center gap-1.5"
                  onClick={() => {
                    safeSet("bodyCoach.lastBodyPart", part);
                    router.push(`/${part}`);
                  }}
                  style={{ borderColor: BODY_PART_INFO[part].color }}
                >
                  <span>{BODY_PART_INFO[part].icon}</span>
                  <span>{BODY_PART_INFO[part].name}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      <p className="muted mt-8 text-xs text-center">
        Each body part has its own calibration profile and exercise library tailored to that region.
      </p>
    </main>
  );
}
