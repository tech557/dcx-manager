/**
 * Generates a collision-safe ID. Matches typical UUID format, falling back
 * to a clean random characters generator if crypto.randomUUID is unavailable
 * within browser/iframe sandboxes.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback in case of sandboxing permission restrictions
    }
  }

  // Robust cryptographic-like fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const randomVal = (Math.random() * 16) | 0;
    const value = char === "x" ? randomVal : (randomVal & 0x3) | 0x8;
    return value.toString(16);
  });
}
