export function calculateEndDate(startDateStr: string, dayOffset: number): string {
  if (!startDateStr) return "";
  try {
    const d = new Date(startDateStr);
    if (isNaN(d.getTime())) return startDateStr;
    // Add offset days
    d.setDate(d.getDate() + Math.max(0, dayOffset));
    return d.toISOString().split("T")[0];
  } catch {
    return startDateStr;
  }
}
