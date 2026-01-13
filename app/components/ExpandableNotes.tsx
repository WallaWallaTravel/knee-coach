"use client";

import { useState } from "react";

interface ExpandableNotesProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function ExpandableNotes({
  value,
  onChange,
  placeholder = "Add any additional details...",
  label = "Add details",
}: ExpandableNotesProps) {
  const [isExpanded, setIsExpanded] = useState(value.length > 0);

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 14px",
          background: "#1a1a1d",
          border: "1px solid #2a2a2d",
          borderRadius: 10,
          color: "#9ca3af",
          fontSize: 14,
          cursor: "pointer",
          width: "100%",
          transition: "all 0.15s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = "#3a3a3d";
          e.currentTarget.style.background = "#222226";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = "#2a2a2d";
          e.currentTarget.style.background = "#1a1a1d";
        }}
      >
        <span style={{ fontSize: 16 }}>+</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <div
      style={{
        background: "#1a1a1d",
        border: "1px solid #2a2a2d",
        borderRadius: 10,
        padding: 12,
      }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{
          width: "100%",
          background: "#0b0b0c",
          border: "1px solid #2a2a2d",
          borderRadius: 8,
          padding: 10,
          color: "#f3f4f6",
          fontSize: 14,
          resize: "vertical",
          minHeight: 80,
          fontFamily: "inherit",
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          style={{
            padding: "6px 12px",
            background: "transparent",
            border: "1px solid #3a3a3d",
            borderRadius: 6,
            color: "#9ca3af",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
