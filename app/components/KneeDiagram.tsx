"use client";

import { useState } from "react";
import { KneePainLocation, KNEE_PAIN_LOCATION_LABELS } from "@/lib/body-parts/knee";

interface KneeDiagramProps {
  selectedLocations: KneePainLocation[];
  onToggleLocation: (loc: KneePainLocation) => void;
}

// Zone definitions for each view
type ZoneDefinition = {
  id: KneePainLocation;
  label: string;
  cx?: number;
  cy?: number;
  r?: number;
  path?: string;
};

const FRONT_VIEW_ZONES: ZoneDefinition[] = [
  { id: "above_kneecap", label: "Above kneecap", cx: 60, cy: 25, r: 14 },
  { id: "kneecap", label: "Kneecap", cx: 60, cy: 55, r: 18 },
  { id: "below_kneecap", label: "Below kneecap", cx: 60, cy: 85, r: 12 },
  { id: "patellar_tendon", label: "Patellar tendon", cx: 60, cy: 105, r: 10 },
  { id: "inside", label: "Inside (medial)", cx: 28, cy: 60, r: 14 },
  { id: "outside", label: "Outside (lateral)", cx: 92, cy: 60, r: 14 },
  { id: "front", label: "Front (general)", cx: 60, cy: 140, r: 10 },
];

const BACK_VIEW_ZONES: ZoneDefinition[] = [
  { id: "back", label: "Back of knee", cx: 60, cy: 55, r: 22 },
  { id: "deep", label: "Deep inside", cx: 60, cy: 90, r: 14 },
];

const SIDE_VIEW_ZONES: ZoneDefinition[] = [
  { id: "medial_joint_line", label: "Medial joint line", cx: 35, cy: 55, r: 12 },
  { id: "lateral_joint_line", label: "Lateral joint line", cx: 85, cy: 55, r: 12 },
  { id: "it_band_insertion", label: "IT band", cx: 95, cy: 75, r: 11 },
  { id: "pes_anserinus", label: "Pes anserinus", cx: 25, cy: 95, r: 11 },
  { id: "medial_tibial_plateau", label: "Medial tibial plateau", cx: 35, cy: 75, r: 11 },
  { id: "lateral_tibial_plateau", label: "Lateral tibial plateau", cx: 85, cy: 75, r: 11 },
  { id: "tibialis_anterior", label: "Tibialis anterior", cx: 70, cy: 115, r: 12 },
];

interface ViewProps {
  title: string;
  zones: ZoneDefinition[];
  selectedLocations: KneePainLocation[];
  onToggle: (loc: KneePainLocation) => void;
  activeTooltip: KneePainLocation | null;
  setActiveTooltip: (loc: KneePainLocation | null) => void;
}

function KneeView({ title, zones, selectedLocations, onToggle, activeTooltip, setActiveTooltip }: ViewProps) {
  return (
    <div className="flex-1 min-w-[120px]">
      <div className="text-[11px] text-muted text-center mb-1.5 uppercase tracking-wide">
        {title}
      </div>
      <svg
        viewBox="0 0 120 160"
        className="w-full max-w-[140px] block mx-auto"
      >
        {/* Knee outline */}
        <ellipse
          cx="60"
          cy="70"
          rx="45"
          ry="60"
          fill="var(--color-surface-overlay)"
          stroke="var(--color-surface-border-hover)"
          strokeWidth="1.5"
        />

        {/* Tappable zones */}
        {zones.map((zone) => {
          const isSelected = selectedLocations.includes(zone.id);
          const isHovered = activeTooltip === zone.id;

          return (
            <g key={zone.id}>
              <circle
                cx={zone.cx}
                cy={zone.cy}
                r={zone.r}
                fill={isSelected ? "var(--color-chip-selected-bg)" : isHovered ? "var(--color-hover-bg)" : "var(--color-surface)"}
                stroke={isSelected ? "var(--color-primary-border)" : isHovered ? "var(--color-surface-border-hover)" : "var(--color-surface-border-hover)"}
                strokeWidth={isSelected ? 2 : 1.5}
                className="cursor-pointer transition-all duration-150 ease-in-out"
                tabIndex={0}
                role="button"
                aria-label={zone.label}
                aria-pressed={isSelected}
                onClick={() => onToggle(zone.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggle(zone.id);
                  }
                }}
                onMouseEnter={() => setActiveTooltip(zone.id)}
                onMouseLeave={() => setActiveTooltip(null)}
                onTouchStart={() => setActiveTooltip(zone.id)}
                onFocus={() => setActiveTooltip(zone.id)}
                onBlur={() => setActiveTooltip(null)}
              />
              {isSelected && (
                <text
                  x={zone.cx}
                  y={zone.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--color-chip-selected-text)"
                  fontSize="8"
                  fontWeight="600"
                  className="pointer-events-none"
                >
                  ✓
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Zone labels below diagram */}
      <div className="flex flex-wrap gap-1 justify-center mt-2 min-h-[50px]">
        {zones.map((zone) => {
          const isSelected = selectedLocations.includes(zone.id);
          return (
            <button
              key={zone.id}
              onClick={() => onToggle(zone.id)}
              onMouseEnter={() => setActiveTooltip(zone.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer transition-all duration-150 ease-in-out border ${
                isSelected
                  ? "border-[var(--color-primary-border)] bg-[var(--color-chip-selected-bg)] text-[var(--color-chip-selected-text)]"
                  : "border-surface-border-hover bg-transparent text-muted"
              }`}
            >
              {zone.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function KneeDiagram({ selectedLocations, onToggleLocation }: KneeDiagramProps) {
  const [activeTooltip, setActiveTooltip] = useState<KneePainLocation | null>(null);

  return (
    <div>
      {/* Tooltip display */}
      {activeTooltip && (
        <div className="bg-surface-raised border border-surface-border-hover rounded-lg px-3 py-2 mb-3 text-[13px] text-center">
          <span className="font-medium">{KNEE_PAIN_LOCATION_LABELS[activeTooltip]}</span>
          {selectedLocations.includes(activeTooltip) && (
            <span className="text-[var(--color-primary-border)] ml-2">✓ Selected</span>
          )}
        </div>
      )}

      {/* Three views side by side */}
      <div className="flex gap-2 justify-center">
        <KneeView
          title="Front"
          zones={FRONT_VIEW_ZONES}
          selectedLocations={selectedLocations}
          onToggle={onToggleLocation}
          activeTooltip={activeTooltip}
          setActiveTooltip={setActiveTooltip}
        />
        <KneeView
          title="Back"
          zones={BACK_VIEW_ZONES}
          selectedLocations={selectedLocations}
          onToggle={onToggleLocation}
          activeTooltip={activeTooltip}
          setActiveTooltip={setActiveTooltip}
        />
        <KneeView
          title="Side"
          zones={SIDE_VIEW_ZONES}
          selectedLocations={selectedLocations}
          onToggle={onToggleLocation}
          activeTooltip={activeTooltip}
          setActiveTooltip={setActiveTooltip}
        />
      </div>

      {/* Selection summary */}
      {selectedLocations.length > 0 && (
        <div className="mt-4 p-2.5 bg-surface-raised rounded-lg border border-surface-border">
          <div className="text-[11px] text-muted mb-1.5 uppercase">
            Selected ({selectedLocations.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedLocations.map(loc => (
              <span
                key={loc}
                onClick={() => onToggleLocation(loc)}
                className="text-xs px-2 py-1 rounded-md bg-[var(--color-chip-selected-bg)] border border-[var(--color-primary-border)] text-[var(--color-chip-selected-text)] cursor-pointer flex items-center gap-1"
              >
                {KNEE_PAIN_LOCATION_LABELS[loc].split(" (")[0]}
                <span className="opacity-70">×</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
