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
  // SVG path or circle coordinates
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
    <div style={{ flex: 1, minWidth: 120 }}>
      <div style={{
        fontSize: 11,
        color: "#9ca3af",
        textAlign: "center",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}>
        {title}
      </div>
      <svg
        viewBox="0 0 120 160"
        style={{
          width: "100%",
          maxWidth: 140,
          display: "block",
          margin: "0 auto",
        }}
      >
        {/* Knee outline */}
        <ellipse
          cx="60"
          cy="70"
          rx="45"
          ry="60"
          fill="#1a1a1d"
          stroke="#3a3a3d"
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
                fill={isSelected ? "#312e81" : isHovered ? "#222226" : "#0b0b0c"}
                stroke={isSelected ? "#6366f1" : isHovered ? "#5a5a5d" : "#3a3a3d"}
                strokeWidth={isSelected ? 2 : 1.5}
                style={{
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onClick={() => onToggle(zone.id)}
                onMouseEnter={() => setActiveTooltip(zone.id)}
                onMouseLeave={() => setActiveTooltip(null)}
                onTouchStart={() => setActiveTooltip(zone.id)}
              />
              {/* Small label inside if selected */}
              {isSelected && (
                <text
                  x={zone.cx}
                  y={zone.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#c7d2fe"
                  fontSize="8"
                  fontWeight="600"
                  style={{ pointerEvents: "none" }}
                >
                  ✓
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Zone labels below diagram */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        justifyContent: "center",
        marginTop: 8,
        minHeight: 50,
      }}>
        {zones.map((zone) => {
          const isSelected = selectedLocations.includes(zone.id);
          return (
            <button
              key={zone.id}
              onClick={() => onToggle(zone.id)}
              onMouseEnter={() => setActiveTooltip(zone.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              style={{
                fontSize: 10,
                padding: "3px 6px",
                borderRadius: 4,
                border: `1px solid ${isSelected ? "#4f46e5" : "#3a3a3d"}`,
                background: isSelected ? "#312e81" : "transparent",
                color: isSelected ? "#c7d2fe" : "#9ca3af",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
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
        <div style={{
          background: "#1a1a1d",
          border: "1px solid #3a3a3d",
          borderRadius: 8,
          padding: "8px 12px",
          marginBottom: 12,
          fontSize: 13,
          textAlign: "center",
        }}>
          <span style={{ fontWeight: 500 }}>{KNEE_PAIN_LOCATION_LABELS[activeTooltip]}</span>
          {selectedLocations.includes(activeTooltip) && (
            <span style={{ color: "#6366f1", marginLeft: 8 }}>✓ Selected</span>
          )}
        </div>
      )}

      {/* Three views side by side */}
      <div style={{
        display: "flex",
        gap: 8,
        justifyContent: "center",
      }}>
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
        <div style={{
          marginTop: 16,
          padding: 10,
          background: "#1a1a1d",
          borderRadius: 8,
          border: "1px solid #2a2a2d",
        }}>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase" }}>
            Selected ({selectedLocations.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {selectedLocations.map(loc => (
              <span
                key={loc}
                onClick={() => onToggleLocation(loc)}
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 6,
                  background: "#312e81",
                  border: "1px solid #4f46e5",
                  color: "#c7d2fe",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {KNEE_PAIN_LOCATION_LABELS[loc].split(" (")[0]}
                <span style={{ opacity: 0.7 }}>×</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
