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
        className="flex items-center gap-1.5 px-3.5 py-2.5 bg-surface-raised border border-surface-border rounded-[10px] text-muted text-sm cursor-pointer w-full transition-all duration-150 ease-in-out hover:border-surface-border-hover hover:bg-[#222226]"
      >
        <span className="text-base">+</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <div className="bg-surface-raised border border-surface-border rounded-[10px] p-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-surface border border-surface-border rounded-lg p-2.5 text-gray-100 text-sm resize-y min-h-[80px] font-[inherit]"
      />
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="px-3 py-1.5 bg-transparent border border-surface-border-hover rounded-md text-muted text-[13px] cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
