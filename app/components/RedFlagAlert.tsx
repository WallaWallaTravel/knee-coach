"use client";

import { useState } from "react";
import {
  RedFlag,
  RedFlagSeverity,
  RED_FLAG_SEVERITY_INFO,
  checkSensationsForRedFlags,
  getHighestSeverity,
  getRedFlagsByBodyPart,
} from "@/lib/safety/red-flags";
import { BodyPart } from "@/lib/body-parts/types";

interface RedFlagAlertProps {
  redFlags: RedFlag[];
  onDismiss?: () => void;
  onSeekCare?: () => void;
}

export function RedFlagAlert({ redFlags, onDismiss, onSeekCare }: RedFlagAlertProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  
  if (redFlags.length === 0) return null;
  
  const highestSeverity = getHighestSeverity(redFlags);
  const severityInfo = highestSeverity ? RED_FLAG_SEVERITY_INFO[highestSeverity] : null;
  
  return (
    <div className={`red-flag-alert severity-${highestSeverity}`}>
      <div className="alert-header">
        <span className="alert-icon">{severityInfo?.icon}</span>
        <div className="alert-title">
          <strong>{severityInfo?.label}</strong>
          <span className="alert-count">
            {redFlags.length} concern{redFlags.length > 1 ? "s" : ""} detected
          </span>
        </div>
      </div>
      
      <div className="alert-body">
        {redFlags.map((flag) => (
          <div 
            key={flag.id} 
            className={`flag-item ${expanded === flag.id ? "expanded" : ""}`}
          >
            <button 
              className="flag-header"
              onClick={() => setExpanded(expanded === flag.id ? null : flag.id)}
            >
              <span className="flag-severity-dot" style={{ backgroundColor: RED_FLAG_SEVERITY_INFO[flag.severity].color }} />
              <span className="flag-title">{flag.title}</span>
              <span className="flag-expand">{expanded === flag.id ? "−" : "+"}</span>
            </button>
            
            {expanded === flag.id && (
              <div className="flag-details">
                <p className="flag-description">{flag.description}</p>
                
                <div className="flag-section">
                  <strong>Symptoms to watch for:</strong>
                  <ul>
                    {flag.symptoms.map((symptom, i) => (
                      <li key={i}>{symptom}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flag-section">
                  <strong>What to do:</strong>
                  <p>{flag.action}</p>
                </div>
                
                <div className="flag-section warning">
                  <strong>Seek care if:</strong>
                  <p>{flag.seekCareIf}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="alert-actions">
        {highestSeverity === "stop_immediately" && (
          <button className="btn btn-danger" onClick={onSeekCare}>
            Find Care Now
          </button>
        )}
        <button className="btn btn-secondary" onClick={onDismiss}>
          I Understand
        </button>
      </div>
    </div>
  );
}

// Inline checker component for use in forms
interface RedFlagCheckerProps {
  bodyPart: BodyPart;
  sensations: string[];
  painLevel?: number;
  additionalContext?: {
    suddenOnset?: boolean;
    afterInjury?: boolean;
    swelling?: boolean;
  };
}

export function RedFlagChecker({ 
  bodyPart, 
  sensations, 
  painLevel,
  additionalContext 
}: RedFlagCheckerProps) {
  const triggeredFlags = checkSensationsForRedFlags(
    bodyPart,
    sensations,
    {
      painLevel,
      ...additionalContext
    }
  );
  
  if (triggeredFlags.length === 0) return null;
  
  const highestSeverity = getHighestSeverity(triggeredFlags);
  const severityInfo = highestSeverity ? RED_FLAG_SEVERITY_INFO[highestSeverity] : null;
  
  return (
    <div className={`red-flag-inline severity-${highestSeverity}`}>
      <span className="inline-icon">{severityInfo?.icon}</span>
      <span className="inline-message">
        {highestSeverity === "stop_immediately" 
          ? "These symptoms may need immediate attention"
          : highestSeverity === "stop_and_monitor"
          ? "Consider stopping activity and monitoring"
          : "Some symptoms to be aware of"}
      </span>
    </div>
  );
}

// Red flag education modal
interface RedFlagEducationProps {
  bodyPart: BodyPart;
  isOpen: boolean;
  onClose: () => void;
}

export function RedFlagEducation({ bodyPart, isOpen, onClose }: RedFlagEducationProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<RedFlagSeverity | "all">("all");
  
  if (!isOpen) return null;
  
  const allFlags = getRedFlagsByBodyPart(bodyPart);
  const filteredFlags = selectedSeverity === "all" 
    ? allFlags 
    : allFlags.filter(f => f.severity === selectedSeverity);
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content red-flag-education" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>When to Seek Care</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p className="education-intro">
            While most discomfort during rehabilitation is normal, some symptoms 
            require professional evaluation. Here's what to watch for:
          </p>
          
          {/* Severity Filter */}
          <div className="severity-filter">
            <button 
              className={`filter-btn ${selectedSeverity === "all" ? "active" : ""}`}
              onClick={() => setSelectedSeverity("all")}
            >
              All
            </button>
            {(Object.keys(RED_FLAG_SEVERITY_INFO) as RedFlagSeverity[]).map(severity => (
              <button
                key={severity}
                className={`filter-btn ${selectedSeverity === severity ? "active" : ""}`}
                onClick={() => setSelectedSeverity(severity)}
                style={{ 
                  borderColor: selectedSeverity === severity ? RED_FLAG_SEVERITY_INFO[severity].color : undefined 
                }}
              >
                {RED_FLAG_SEVERITY_INFO[severity].icon} {RED_FLAG_SEVERITY_INFO[severity].label}
              </button>
            ))}
          </div>
          
          {/* Flags List */}
          <div className="education-flags">
            {filteredFlags.map(flag => (
              <div key={flag.id} className="education-flag">
                <div className="flag-header-edu">
                  <span 
                    className="severity-badge"
                    style={{ backgroundColor: RED_FLAG_SEVERITY_INFO[flag.severity].color }}
                  >
                    {RED_FLAG_SEVERITY_INFO[flag.severity].icon}
                  </span>
                  <h3>{flag.title}</h3>
                </div>
                <p className="flag-desc">{flag.description}</p>
                <div className="flag-action">
                  <strong>Action:</strong> {flag.action}
                </div>
              </div>
            ))}
          </div>
          
          <div className="education-disclaimer">
            <strong>Important:</strong> This information is for educational purposes only 
            and does not replace professional medical advice. When in doubt, consult a 
            healthcare provider.
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick reference card for common red flags
export function RedFlagQuickReference({ bodyPart }: { bodyPart: BodyPart }) {
  const [showEducation, setShowEducation] = useState(false);
  
  const criticalFlags = getRedFlagsByBodyPart(bodyPart)
    .filter(f => f.severity === "stop_immediately")
    .slice(0, 3);
  
  return (
    <>
      <div className="red-flag-quick-ref">
        <div className="quick-ref-header">
          <span className="quick-ref-icon">🚨</span>
          <span className="quick-ref-title">Know When to Stop</span>
        </div>
        <ul className="quick-ref-list">
          {criticalFlags.map(flag => (
            <li key={flag.id}>{flag.title}</li>
          ))}
        </ul>
        <button 
          className="quick-ref-link"
          onClick={() => setShowEducation(true)}
        >
          Learn more about warning signs →
        </button>
      </div>
      
      <RedFlagEducation 
        bodyPart={bodyPart}
        isOpen={showEducation}
        onClose={() => setShowEducation(false)}
      />
    </>
  );
}
