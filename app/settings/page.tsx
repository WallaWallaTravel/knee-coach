"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { safeGet, safeSet, safeRemove, getStorageUsage, pruneOldData } from "@/lib/storage/safe-storage";
import { downloadExport, importData } from "@/lib/storage/data-export";
import { useTheme } from "@/lib/theme/theme-provider";

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
  const { theme, setTheme } = useTheme();
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

  // Storage management
  const [storageInfo, setStorageInfo] = useState<{ usedBytes: number; keys: number }>({ usedBytes: 0, keys: 0 });
  const [importStatus, setImportStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [pruneStatus, setPruneStatus] = useState<{ type: "idle" | "success"; message: string }>({ type: "idle", message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshStorageInfo = useCallback(() => {
    setStorageInfo(getStorageUsage());
  }, []);

  // Load settings on mount
  useEffect(() => {
    const savedAI = safeGet<AISettings | null>(STORAGE_KEY_AI, null);
    if (savedAI) {
      setAiSettings(savedAI);
    }

    const savedApp = safeGet<AppSettings | null>(STORAGE_KEY_APP, null);
    if (savedApp) {
      setAppSettings(savedApp);
    }

    refreshStorageInfo();
  }, [refreshStorageInfo]);

  // Save AI settings
  const saveAISettings = () => {
    safeSet(STORAGE_KEY_AI, aiSettings);
    setConnectionStatus("idle");
  };

  // Save app settings
  const saveAppSettings = () => {
    safeSet(STORAGE_KEY_APP, appSettings);
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
        safeSet(STORAGE_KEY_AI, {
          ...aiSettings,
          enableAIFeatures: true
        });
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

  // Handle file import
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      const result = importData(json);
      if (result.success) {
        setImportStatus({ type: "success", message: `Imported ${result.keysImported} items successfully.` });
        refreshStorageInfo();
      } else {
        setImportStatus({ type: "error", message: result.error || "Import failed." });
      }
    };
    reader.onerror = () => {
      setImportStatus({ type: "error", message: "Failed to read file." });
    };
    reader.readAsText(file);

    e.target.value = "";
  };

  // Handle cleanup
  const handleCleanup = () => {
    if (confirm("Remove check-in and session data older than 90 days? Milestones and profiles are preserved.")) {
      const removed = pruneOldData(90);
      setPruneStatus({ type: "success", message: `Removed ${removed} old entries.` });
      refreshStorageInfo();
    }
  };

  // Clear all data
  const clearAllData = () => {
    if (confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
      try {
        // Raw localStorage iteration required — safeGet reads individual known keys,
        // but bulk delete must discover all bodyCoach.* keys dynamically
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith("bodyCoach.")) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => safeRemove(key));
      } catch {
        // Ignore errors during bulk delete
      }
      alert("All data has been cleared.");
      router.push("/select");
    }
  };

  return (
    <main className="max-w-[560px] mx-auto p-4 font-[system-ui]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="m-0">Settings</h1>
        <Link href="/select" className="btn">← Back</Link>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-surface-raised rounded-[10px]">
        {(["general", "ai", "data"] as const).map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2.5 px-3 border-none rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 ${
              activeTab === tab
                ? "bg-surface-border"
                : "bg-transparent text-muted hover:bg-[var(--color-hover-bg)]"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "general" ? "General" : tab === "ai" ? "AI Features" : "Data"}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="card mt-3">
          <h3 className="section-header">App Preferences</h3>

          <div className="flex justify-between items-center py-3.5 border-b border-surface-border">
            <div className="flex flex-col gap-0.5">
              {/* !mt-0 overrides global `label { margin-top: 10px }` which beats Tailwind's @layer */}
              <label htmlFor="theme-select" className="text-[15px] font-medium !mt-0">Theme</label>
              <span className="text-xs text-muted">Choose your preferred color scheme</span>
            </div>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => {
                const newTheme = e.target.value as "dark" | "light" | "system";
                setTheme(newTheme);
                setAppSettings(prev => ({ ...prev, theme: newTheme }));
              }}
              className="px-3 py-2 border border-surface-border-hover rounded-lg bg-surface-raised text-sm"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="flex justify-between items-center py-3.5">
            <div className="flex flex-col gap-0.5">
              <span id="notifications-label" className="text-[15px] font-medium">Notifications</span>
              <span className="text-xs text-muted">Reminder notifications (coming soon)</span>
            </div>
            <label className="settings-toggle">
              <input
                type="checkbox"
                aria-labelledby="notifications-label"
                checked={appSettings.notifications}
                onChange={(e) => setAppSettings(prev => ({ ...prev, notifications: e.target.checked }))}
              />
              <span className="settings-toggle-slider"></span>
            </label>
          </div>

          <button className="btn btn-primary mt-4" onClick={saveAppSettings}>
            Save Preferences
          </button>
        </div>
      )}

      {/* AI Features Tab */}
      {activeTab === "ai" && (
        <div className="card mt-3">
          <h3 className="section-header">AI-Powered Features</h3>

          <p className="muted mb-4">
            Enable AI features for personalized explanations, smart calibration, and progress insights.
            Your API key is stored locally and never sent to our servers.
          </p>

          <div className="flex justify-between items-center py-3.5 border-b border-surface-border">
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-medium">AI Provider</span>
              <span className="text-xs text-muted">Choose your preferred AI service</span>
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
              className="px-3 py-2 border border-surface-border-hover rounded-lg bg-surface-raised text-sm"
            >
              <option value="none">None (Disabled)</option>
              <option value="openai">OpenAI (GPT-4)</option>
              <option value="anthropic">Anthropic (Claude)</option>
            </select>
          </div>

          {aiSettings.provider !== "none" && (
            <>
              <div className="flex flex-col items-stretch py-3.5 border-b border-surface-border">
                <div className="flex flex-col gap-0.5 mb-2">
                  <span className="text-[15px] font-medium">API Key</span>
                  <span className="text-xs text-muted">
                    {aiSettings.provider === "openai"
                      ? "Get your key from platform.openai.com"
                      : "Get your key from console.anthropic.com"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={aiSettings.apiKey}
                    onChange={(e) => {
                      setAiSettings(prev => ({ ...prev, apiKey: e.target.value, enableAIFeatures: false }));
                      setConnectionStatus("idle");
                    }}
                    placeholder={`Enter your ${aiSettings.provider === "openai" ? "OpenAI" : "Anthropic"} API key`}
                    className="flex-1 px-3 py-2.5 border border-surface-border-hover rounded-lg bg-surface-raised text-sm"
                  />
                  <button
                    className="btn px-3 py-2 text-[13px]"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
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
                <div className="flex items-center gap-2 p-3 rounded-lg mt-3 text-sm" style={{
                  background: connectionStatus === "success" ? "var(--color-success-bg)" : "var(--color-error-bg)",
                  color: connectionStatus === "success" ? "var(--color-success-text)" : "var(--color-error-text)",
                }}>
                  <span className="text-lg">
                    {connectionStatus === "success" ? "✓" : "✗"}
                  </span>
                  <span>{connectionMessage}</span>
                </div>
              )}

              {aiSettings.enableAIFeatures && (
                <div className="flex items-center gap-2 p-3 rounded-lg mt-3 text-sm" style={{ background: "var(--color-primary-subtle)", color: "var(--color-primary-text)" }}>
                  <span className="text-lg">✨</span>
                  <span>AI features are enabled</span>
                </div>
              )}
            </>
          )}

          <hr className="my-5" />

          <h4 className="m-0 mb-3">Available AI Features</h4>
          <ul className="list-none p-0 m-0">
            {[
              { icon: "💬", title: "Smart Calibration", desc: "AI-guided conversation to precisely describe your issues" },
              { icon: "📖", title: "Exercise Explanations", desc: "Understand why each exercise helps your specific situation" },
              { icon: "📊", title: "Progress Analysis", desc: "AI insights on your trends and patterns" },
              { icon: "⚠️", title: "Red Flag Guidance", desc: "Clear explanations when symptoms need attention" },
            ].map((feature, i) => (
              <li key={i} className="flex gap-3 py-3 border-b border-surface-border last:border-b-0">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <strong className="block text-sm mb-0.5">{feature.title}</strong>
                  <p className="m-0 text-xs text-muted">{feature.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-3 bg-surface-raised rounded-lg mt-4">
            <strong className="block text-[13px] mb-1">Estimated Cost</strong>
            <p className="m-0 text-xs text-muted">Most interactions cost $0.01-0.05. A typical month of daily use costs $1-5.</p>
          </div>
        </div>
      )}

      {/* Data Tab */}
      {activeTab === "data" && (
        <div className="card mt-3">
          <h3 className="section-header">Your Data</h3>

          <p className="muted mb-4">
            All your data is stored locally on your device. We don&apos;t have access to it.
          </p>

          {/* Storage Usage */}
          <div className="p-4 bg-surface-raised rounded-[10px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[15px] font-medium">Storage Used</span>
              <span className="text-[13px] text-muted">
                {storageInfo.usedBytes < 1024
                  ? `${storageInfo.usedBytes} B`
                  : storageInfo.usedBytes < 1024 * 1024
                  ? `${(storageInfo.usedBytes / 1024).toFixed(1)} KB`
                  : `${(storageInfo.usedBytes / (1024 * 1024)).toFixed(2)} MB`}
                {" "}across {storageInfo.keys} keys
              </span>
            </div>
            <div className="h-2 bg-surface-border rounded overflow-hidden">
              <div
                className="h-full rounded transition-[width] duration-300 ease-in-out min-w-[2px]"
                style={{ background: "var(--color-primary-border)", width: `${Math.min((storageInfo.usedBytes / (5 * 1024 * 1024)) * 100, 100)}%` }}
              />
            </div>
            <span className="text-[11px] text-muted mt-1 block">of ~5 MB localStorage limit</span>
          </div>

          <hr className="my-5" />

          {/* Export */}
          <div className="p-4 bg-surface-raised rounded-[10px]">
            <button className="btn" onClick={downloadExport}>
              Export All Data
            </button>
            <p className="muted text-xs mt-1">
              Download a JSON backup of all your check-ins, progress, and settings
            </p>
          </div>

          <hr className="my-5" />

          {/* Import */}
          <div className="p-4 bg-surface-raised rounded-[10px]">
            <button className="btn" onClick={() => fileInputRef.current?.click()}>
              Import Data
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
            <p className="muted text-xs mt-1">
              Restore data from a previously exported JSON backup
            </p>
            {importStatus.type !== "idle" && (
              <div className="flex items-center gap-2 p-3 rounded-lg mt-2 text-sm" style={{
                background: importStatus.type === "success" ? "var(--color-success-bg)" : "var(--color-error-bg)",
                color: importStatus.type === "success" ? "var(--color-success-text)" : "var(--color-error-text)",
              }}>
                <span className="text-lg">{importStatus.type === "success" ? "✓" : "✗"}</span>
                <span>{importStatus.message}</span>
              </div>
            )}
          </div>

          <hr className="my-5" />

          {/* Cleanup */}
          <div className="p-4 bg-surface-raised rounded-[10px]">
            <button className="btn" onClick={handleCleanup}>
              Clean Up Old Data
            </button>
            <p className="muted text-xs mt-1">
              Remove check-ins and sessions older than 90 days. Profiles and milestones are kept.
            </p>
            {pruneStatus.type === "success" && (
              <div className="flex items-center gap-2 p-3 rounded-lg mt-2 text-sm" style={{ background: "var(--color-success-bg)", color: "var(--color-success-text)" }}>
                <span className="text-lg">✓</span>
                <span>{pruneStatus.message}</span>
              </div>
            )}
          </div>

          <hr className="my-5" />

          <h4 className="m-0 mb-3 text-red-500">Danger Zone</h4>

          <div className="p-4 rounded-[10px]" style={{ background: "var(--color-error-bg)", border: "1px solid var(--color-error-border)" }}>
            <p className="muted m-0 mb-3">
              Permanently delete all your data including profiles, check-ins, and progress history.
              This action cannot be undone.
            </p>
            <button className="btn text-white" style={{ background: "#dc2626", borderColor: "#dc2626" }} onClick={clearAllData}>
              Delete All Data
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
