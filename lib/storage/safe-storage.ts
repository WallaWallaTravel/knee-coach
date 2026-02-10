/**
 * Safe localStorage wrapper with error handling.
 * Prevents crashes from QuotaExceededError, corrupt JSON, or missing localStorage.
 */

/**
 * Safely get and parse a value from localStorage.
 * Returns defaultValue on any failure (missing key, corrupt JSON, no localStorage).
 */
export function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Safely set a value in localStorage.
 * On QuotaExceededError, attempts to prune old data and retry once.
 * Returns true on success, false on failure.
 */
export function safeSet(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    if (err instanceof DOMException && err.name === "QuotaExceededError") {
      // Try to free space by pruning old data
      pruneOldData(60);
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

/**
 * Safely remove a key from localStorage.
 */
export function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore errors
  }
}

/**
 * Get estimated storage usage for bodyCoach keys.
 * Returns { used, total } in bytes (total is an estimate).
 */
export function getStorageUsage(): { usedBytes: number; keys: number } {
  let usedBytes = 0;
  let keys = 0;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("bodyCoach.")) {
        const value = localStorage.getItem(key);
        if (value) {
          // Each character is ~2 bytes in UTF-16
          usedBytes += (key.length + value.length) * 2;
          keys++;
        }
      }
    }
  } catch {
    // Ignore errors
  }

  return { usedBytes, keys };
}

/**
 * Remove check-in and session data older than the specified number of days.
 * Preserves milestones, baselines, and calibration profiles.
 */
export function pruneOldData(daysToKeep: number = 90): number {
  const cutoff = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
  let removedItems = 0;

  try {
    const bodyParts = ["knee", "achilles", "shoulder", "foot"];
    for (const part of bodyParts) {
      const key = `bodyCoach.outcomes.${part}`;
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const data = JSON.parse(raw);
        const origCheckIns = data.checkIns?.length ?? 0;
        const origSessions = data.sessions?.length ?? 0;

        if (data.checkIns) {
          data.checkIns = data.checkIns.filter(
            (c: { timestamp?: number }) => (c.timestamp ?? 0) > cutoff
          );
        }
        if (data.sessions) {
          data.sessions = data.sessions.filter(
            (s: { timestamp?: number }) => (s.timestamp ?? 0) > cutoff
          );
        }

        const removed = (origCheckIns - (data.checkIns?.length ?? 0)) +
                        (origSessions - (data.sessions?.length ?? 0));
        if (removed > 0) {
          localStorage.setItem(key, JSON.stringify(data));
          removedItems += removed;
        }
      } catch {
        // Skip corrupt data
      }
    }
  } catch {
    // Ignore errors
  }

  return removedItems;
}
