/**
 * Data export/import for backup and migration.
 */

import { safeSet } from "./safe-storage";

/**
 * Export all bodyCoach data as a JSON string.
 */
export function exportAllData(): string {
  const data: Record<string, unknown> = {};

  // Raw localStorage iteration required — safeGet reads individual known keys,
  // but export must discover all bodyCoach.* keys dynamically (including
  // user-created body part profiles not enumerated in code).
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("bodyCoach.")) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            data[key] = JSON.parse(raw);
          } catch {
            data[key] = raw;
          }
        }
      }
    }
  } catch {
    // If localStorage is inaccessible, return empty
  }

  return JSON.stringify({
    exportDate: new Date().toISOString(),
    version: 1,
    data,
  }, null, 2);
}

/**
 * Trigger a file download of the exported data.
 */
export function downloadExport(): void {
  const json = exportAllData();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `body-coach-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validate and import data from a JSON string.
 * Returns { success, keysImported, error? }
 */
export function importData(json: string): { success: boolean; keysImported: number; error?: string } {
  try {
    const parsed = JSON.parse(json);

    if (!parsed.data || typeof parsed.data !== "object") {
      return { success: false, keysImported: 0, error: "Invalid backup format: missing 'data' field." };
    }

    // Validate all keys start with bodyCoach
    const keys = Object.keys(parsed.data);
    const invalidKeys = keys.filter(k => !k.startsWith("bodyCoach."));
    if (invalidKeys.length > 0) {
      return { success: false, keysImported: 0, error: `Invalid keys found: ${invalidKeys.slice(0, 3).join(", ")}` };
    }

    // Write all valid keys
    let imported = 0;
    const failedKeys: string[] = [];
    for (const [key, value] of Object.entries(parsed.data)) {
      if (safeSet(key, value)) {
        imported++;
      } else {
        failedKeys.push(key);
      }
    }

    if (failedKeys.length > 0) {
      return {
        success: imported > 0,
        keysImported: imported,
        error: `Failed to import ${failedKeys.length} key(s): ${failedKeys.slice(0, 3).join(", ")}${failedKeys.length > 3 ? "..." : ""}`,
      };
    }

    return { success: true, keysImported: imported };
  } catch {
    return { success: false, keysImported: 0, error: "Invalid JSON file." };
  }
}
