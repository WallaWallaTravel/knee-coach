"use client";

// Body part selection components
import { BodyPart, BODY_PART_INFO } from "@/lib/body-parts";

interface BodyPartSelectorProps {
  selected: BodyPart | null;
  onSelect: (part: BodyPart) => void;
  showDescription?: boolean;
}

export function BodyPartSelector({ selected, onSelect, showDescription = true }: BodyPartSelectorProps) {
  const bodyParts: BodyPart[] = ["knee", "achilles", "shoulder", "foot"];
  
  return (
    <div className="body-part-selector" role="radiogroup" aria-label="Select body part">
      <div className="body-part-grid">
        {bodyParts.map((part) => {
          const info = BODY_PART_INFO[part];
          const isSelected = selected === part;

          return (
            <button
              key={part}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${info.name}: ${info.description}`}
              className={`body-part-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(part)}
              style={{
                "--accent-color": info.color,
              } as React.CSSProperties}
            >
              <div className="body-part-icon">{info.icon}</div>
              <div className="body-part-name">{info.name}</div>
              {showDescription && (
                <div className="body-part-description">{info.description}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Compact version for header/nav
export function BodyPartTabs({ 
  selected, 
  onSelect,
  profiles,
}: { 
  selected: BodyPart | null; 
  onSelect: (part: BodyPart) => void;
  profiles?: Record<BodyPart, boolean>; // Which body parts have calibration profiles
}) {
  const bodyParts: BodyPart[] = ["knee", "achilles", "shoulder", "foot"];
  
  return (
    <div className="body-part-tabs" role="tablist" aria-label="Body part selection">
      {bodyParts.map((part) => {
        const info = BODY_PART_INFO[part];
        const isSelected = selected === part;
        const hasProfile = profiles?.[part];

        return (
          <button
            key={part}
            role="tab"
            aria-selected={isSelected}
            aria-label={`${info.name}${hasProfile ? " (profile set up)" : ""}`}
            className={`body-part-tab ${isSelected ? "selected" : ""} ${hasProfile ? "has-profile" : ""}`}
            onClick={() => onSelect(part)}
            style={{
              "--accent-color": info.color,
            } as React.CSSProperties}
          >
            <span className="tab-icon">{info.icon}</span>
            <span className="tab-name">{info.name}</span>
            {hasProfile && <span className="profile-dot" />}
          </button>
        );
      })}
    </div>
  );
}
