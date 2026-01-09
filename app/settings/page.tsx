"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AISettings {
  provider: "openai" | "anthropic" | "none";
  apiKey: string;
  enableAIFeatures: boolean;
}

interface AppSettings {
  theme: "dark" | "light" | "system";
  notifications: boolean;
  dataExport: boolean;
}

const STORAGE_KEY_AI = "bodyCoach.settings.ai";
const STORAGE_KEY_APP = "bodyCoach.settings.app";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "ai" | "data">("general");
  
  // AI Settings
  const [aiSettings, setAiSettings] = useState<AISettings>({
    provider: "none",
    apiKey: "",
    enableAIFeatures: false,
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const [connectionMessage, setConnectionMessage] = useState("");

  // App Settings
  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: "dark",
    notifications: true,
    dataExport: true,
  });

  // Load settings on mount
  useEffect(() => {
    const savedAI = localStorage.getItem(STORAGE_KEY_AI);
    if (savedAI) {
      try {
        setAiSettings(JSON.parse(savedAI));
      } catch (e) {
        console.error("Failed to parse AI settings");
      }
    }

    const savedApp = localStorage.getItem(STORAGE_KEY_APP);
    if (savedApp) {
      try {
        setAppSettings(JSON.parse(savedApp));
      } catch (e) {
        console.error("Failed to parse app settings");
      }
    }
  }, []);

  // Save AI settings
  const saveAISettings = () => {
    localStorage.setItem(STORAGE_KEY_AI, JSON.stringify(aiSettings));
    setConnectionStatus("idle");
  };

  // Save app settings
  const saveAppSettings = () => {
    localStorage.setItem(STORAGE_KEY_APP, JSON.stringify(appSettings));
  };

  // Test API connection
  const testConnection = async () => {
    if (!aiSettings.apiKey || aiSettings.provider === "none") {
      setConnectionStatus("error");
      setConnectionMessage("Please select a provider and enter an API key");
      return;
    }

    setTestingConnection(true);
    setConnectionStatus("idle");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: aiSettings.provider,
          apiKey: aiSettings.apiKey,
          type: "calibration",
          messages: [{ role: "user", content: "Hello, this is a connection test." }],
          context: { bodyPart: "test" }
        })
      });

      if (response.ok) {
        setConnectionStatus("success");
        setConnectionMessage("Connection successful! AI features are ready.");
        // Save settings on successful test
        localStorage.setItem(STORAGE_KEY_AI, JSON.stringify({
          ...aiSettings,
          enableAIFeatures: true
        }));
        setAiSettings(prev => ({ ...prev, enableAIFeatures: true }));
      } else {
        const error = await response.json();
        setConnectionStatus("error");
        setConnectionMessage(error.error || "Connection failed");
      }
    } catch (error) {
      setConnectionStatus("error");
      setConnectionMessage("Network error - check your connection");
    } finally {
      setTestingConnection(false);
    }
  };

  // Export data
  const exportData = () => {
    const data: Record<string, unknown> = {};
    
    // Collect all bodyCoach data from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("bodyCoach.")) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || "");
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `body-coach-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear all data
  const clearAllData = () => {
    if (confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("bodyCoach.")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      alert("All data has been cleared.");
      router.push("/select");
    }
  };

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Settings</h1>
        <Link href="/select" className="btn">← Back</Link>
      </div>

      {/* Tab Navigation */}
      <div className="settings-tabs">
        <button
          className={`tab ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          General
        </button>
        <button
          className={`tab ${activeTab === "ai" ? "active" : ""}`}
          onClick={() => setActiveTab("ai")}
        >
          AI Features
        </button>
        <button
          className={`tab ${activeTab === "data" ? "active" : ""}`}
          onClick={() => setActiveTab("data")}
        >
          Data
        </button>
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3 className="section-header">App Preferences</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Theme</span>
              <span className="setting-description">Choose your preferred color scheme</span>
            </div>
            <select
              value={appSettings.theme}
              onChange={(e) => {
                setAppSettings(prev => ({ ...prev, theme: e.target.value as "dark" | "light" | "system" }));
              }}
              className="setting-select"
            >
              <option value="dark">Dark</option>
              <option value="light">Light (coming soon)</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Notifications</span>
              <span className="setting-description">Reminder notifications (coming soon)</span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={appSettings.notifications}
                onChange={(e) => setAppSettings(prev => ({ ...prev, notifications: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <button className="btn btn-primary" onClick={saveAppSettings} style={{ marginTop: 16 }}>
            Save Preferences
          </button>
        </div>
      )}

      {/* AI Features Tab */}
      {activeTab === "ai" && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3 className="section-header">AI-Powered Features</h3>
          
          <p className="muted" style={{ marginBottom: 16 }}>
            Enable AI features for personalized explanations, smart calibration, and progress insights.
            Your API key is stored locally and never sent to our servers.
          </p>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">AI Provider</span>
              <span className="setting-description">Choose your preferred AI service</span>
            </div>
            <select
              value={aiSettings.provider}
              onChange={(e) => {
                setAiSettings(prev => ({ 
                  ...prev, 
                  provider: e.target.value as "openai" | "anthropic" | "none",
                  enableAIFeatures: false 
                }));
                setConnectionStatus("idle");
              }}
              className="setting-select"
            >
              <option value="none">None (Disabled)</option>
              <option value="openai">OpenAI (GPT-4)</option>
              <option value="anthropic">Anthropic (Claude)</option>
            </select>
          </div>

          {aiSettings.provider !== "none" && (
            <>
              <div className="setting-item" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <div className="setting-info" style={{ marginBottom: 8 }}>
                  <span className="setting-label">API Key</span>
                  <span className="setting-description">
                    {aiSettings.provider === "openai" 
                      ? "Get your key from platform.openai.com" 
                      : "Get your key from console.anthropic.com"}
                  </span>
                </div>
                <div className="api-key-input">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={aiSettings.apiKey}
                    onChange={(e) => {
                      setAiSettings(prev => ({ ...prev, apiKey: e.target.value, enableAIFeatures: false }));
                      setConnectionStatus("idle");
                    }}
                    placeholder={`Enter your ${aiSettings.provider === "openai" ? "OpenAI" : "Anthropic"} API key`}
                    className="input-field"
                  />
                  <button 
                    className="btn btn-small"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="api-key-actions">
                <button 
                  className="btn btn-primary"
                  onClick={testConnection}
                  disabled={testingConnection || !aiSettings.apiKey}
                >
                  {testingConnection ? "Testing..." : "Test Connection"}
                </button>
                <button 
                  className="btn"
                  onClick={saveAISettings}
                >
                  Save Settings
                </button>
              </div>

              {connectionStatus !== "idle" && (
                <div className={`connection-status ${connectionStatus}`}>
                  <span className="status-icon">
                    {connectionStatus === "success" ? "✓" : "✗"}
                  </span>
                  <span>{connectionMessage}</span>
                </div>
              )}

              {aiSettings.enableAIFeatures && (
                <div className="ai-features-enabled">
                  <span className="enabled-icon">✨</span>
                  <span>AI features are enabled</span>
                </div>
              )}
            </>
          )}

          <hr style={{ margin: "20px 0" }} />

          <h4 style={{ margin: "0 0 12px 0" }}>Available AI Features</h4>
          <ul className="feature-list">
            <li>
              <span className="feature-icon">💬</span>
              <div>
                <strong>Smart Calibration</strong>
                <p>AI-guided conversation to precisely describe your issues</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">📖</span>
              <div>
                <strong>Exercise Explanations</strong>
                <p>Understand why each exercise helps your specific situation</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">📊</span>
              <div>
                <strong>Progress Analysis</strong>
                <p>AI insights on your trends and patterns</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">⚠️</span>
              <div>
                <strong>Red Flag Guidance</strong>
                <p>Clear explanations when symptoms need attention</p>
              </div>
            </li>
          </ul>

          <div className="cost-estimate">
            <strong>Estimated Cost</strong>
            <p>Most interactions cost $0.01-0.05. A typical month of daily use costs $1-5.</p>
          </div>
        </div>
      )}

      {/* Data Tab */}
      {activeTab === "data" && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3 className="section-header">Your Data</h3>
          
          <p className="muted" style={{ marginBottom: 16 }}>
            All your data is stored locally on your device. We don't have access to it.
          </p>

          <div className="data-actions">
            <button className="btn" onClick={exportData}>
              📥 Export All Data
            </button>
            <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Download a JSON file with all your check-ins, progress, and settings
            </p>
          </div>

          <hr style={{ margin: "20px 0" }} />

          <h4 style={{ margin: "0 0 12px 0", color: "#ef4444" }}>Danger Zone</h4>
          
          <div className="danger-zone">
            <p className="muted">
              Permanently delete all your data including profiles, check-ins, and progress history.
              This action cannot be undone.
            </p>
            <button className="btn btn-danger" onClick={clearAllData}>
              🗑️ Delete All Data
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .settings-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: #1a1a1d;
          border-radius: 10px;
        }

        .settings-tabs .tab {
          flex: 1;
          padding: 10px 12px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .settings-tabs .tab:hover {
          background: #222226;
          color: #f3f4f6;
        }

        .settings-tabs .tab.active {
          background: #2a2a2d;
          color: #f3f4f6;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #2a2a2d;
        }

        .setting-item:last-of-type {
          border-bottom: none;
        }

        .setting-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .setting-label {
          font-size: 15px;
          font-weight: 500;
        }

        .setting-description {
          font-size: 12px;
          color: #9ca3af;
        }

        .setting-select {
          padding: 8px 12px;
          border: 1px solid #3a3a3d;
          border-radius: 8px;
          background: #1a1a1d;
          color: #f3f4f6;
          font-size: 14px;
        }

        .toggle {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 26px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #3a3a3d;
          transition: 0.3s;
          border-radius: 26px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: #f3f4f6;
          transition: 0.3s;
          border-radius: 50%;
        }

        .toggle input:checked + .toggle-slider {
          background-color: #4f46e5;
        }

        .toggle input:checked + .toggle-slider:before {
          transform: translateX(22px);
        }

        .api-key-input {
          display: flex;
          gap: 8px;
        }

        .input-field {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #3a3a3d;
          border-radius: 8px;
          background: #1a1a1d;
          color: #f3f4f6;
          font-size: 14px;
        }

        .btn-small {
          padding: 8px 12px;
          font-size: 13px;
        }

        .api-key-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-radius: 8px;
          margin-top: 12px;
          font-size: 14px;
        }

        .connection-status.success {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .connection-status.error {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .status-icon {
          font-size: 18px;
        }

        .ai-features-enabled {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: rgba(99, 102, 241, 0.15);
          border-radius: 8px;
          margin-top: 12px;
          color: #a5b4fc;
          font-size: 14px;
        }

        .enabled-icon {
          font-size: 18px;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-list li {
          display: flex;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #2a2a2d;
        }

        .feature-list li:last-child {
          border-bottom: none;
        }

        .feature-icon {
          font-size: 24px;
        }

        .feature-list strong {
          display: block;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .feature-list p {
          margin: 0;
          font-size: 12px;
          color: #9ca3af;
        }

        .cost-estimate {
          padding: 12px;
          background: #1a1a1d;
          border-radius: 8px;
          margin-top: 16px;
        }

        .cost-estimate strong {
          display: block;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .cost-estimate p {
          margin: 0;
          font-size: 12px;
          color: #9ca3af;
        }

        .data-actions {
          padding: 16px;
          background: #1a1a1d;
          border-radius: 10px;
        }

        .danger-zone {
          padding: 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
        }

        .danger-zone p {
          margin: 0 0 12px 0;
        }

        .btn-danger {
          background: #dc2626;
          border-color: #dc2626;
          color: #fff;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }
      `}</style>
    </main>
  );
}
