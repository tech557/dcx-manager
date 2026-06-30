# DCX Manager — Backend Integration & Schema Migration Guide

This documentoutlines the schema and data migration steps required to transition the campaign task date model from the legacy unstructured formats to the standardized, backend-ready `TaskDate` discriminated union (Sprint 8).

---

## 1. Context: Legacy vs. Modern Date Model

### The Legacy Model
Previously, the task dates were stored in two inconsistent, unstructured representations:
1. `communicationDate?: string` — containing either ISO strings (e.g. `"2026-06-16"`) or legacy relative strings (e.g. `"Week 2 Day 3"`).
2. Fragile flags direct on the task itself:
   - `isLinked?: boolean`
   - `linkedWeek?: number`
   - `linkedDay?: number`

This caused redundant, fragile, and dispersed translation math across the codebase, resulting in timezone offsets and rendering inconsistencies.

### The Modern Model
All task datetime coordinates are now structured as a discriminated union:

```typescript
export type TaskDateMode = "unset" | "linked" | "fixed";

export type TaskDate =
  | {
      mode: "unset";
    }
  | {
      mode: "linked";
      weekOffset: number;
      dayOffset: number;
      resolvedDate?: string; // computed at runtime relative to campaign anchor
    }
  | {
      mode: "fixed";
      date: string; // ISO date format, e.g. "2026-06-16"
    };
```

---

## 2. Database Schema Representation (PostgreSQL / Firestore)

### A. Firestore Document Style (Recommended)
Firestore handles maps naturally. Tasks should be stored with a nested `date` object:

```json
{
  "id": "task-abc-123",
  "name": "Draft Slack message body",
  "channelId": "ch-1",
  "date": {
    "mode": "linked",
    "weekOffset": 2,
    "dayOffset": 4
  }
}
```

### B. Relational PostgreSQL Schema (Drizzle / Cloud SQL)
For relational schemas, the discriminated union maps to separate columns on the `tasks` table with a check constraint to ensure only valid unions are created.

```sql
CREATE TYPE task_date_mode AS ENUM ('unset', 'linked', 'fixed');

CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) REFERENCES channels(id),
    
    -- Discriminated Union Columns
    date_mode task_date_mode NOT NULL DEFAULT 'unset',
    date_fixed_iso VARCHAR(10), -- e.g., "2026-06-16"
    date_week_offset INT,
    date_day_offset INT,

    -- Union validation integrity checks
    CONSTRAINT chk_task_date_union CHECK (
        (date_mode = 'unset' AND date_fixed_iso IS NULL AND date_week_offset IS NULL AND date_day_offset IS NULL) OR
        (date_mode = 'fixed' AND date_fixed_iso IS NOT NULL AND date_week_offset IS NULL AND date_day_offset IS NULL) OR
        (date_mode = 'linked' AND date_fixed_iso IS NULL AND date_week_offset IS NOT NULL AND date_day_offset IS NOT NULL)
    )
);
```

---

## 3. Data Migration Script (Node.js/JS)

This migration script processes old databases, parses any unstructured fields, and converts them to the standardized structure without record losses.

```javascript
/**
 * Resolves legacy task properties to the new TaskDate structure.
 * 
 * @param {Object} legacyTask 
 * @returns {Object} New TaskDate structure
 */
function migrateTaskDate(legacyTask) {
  // Option A: Active specific linked flags
  if (legacyTask.isLinked && typeof legacyTask.linkedWeek === 'number') {
    return {
      mode: 'linked',
      weekOffset: legacyTask.linkedWeek,
      dayOffset: legacyTask.linkedDay ?? 0
    };
  }

  const rawCommDate = legacyTask.communicationDate;
  if (!rawCommDate) {
    return { mode: 'unset' };
  }

  // Option B: Legacy relative coordinate string
  if (rawCommDate.toLowerCase().includes("week")) {
    const regex = /week\s*(\d+)\s*-\s*day\s*(\d+)/i;
    const match = rawCommDate.match(regex);
    if (match) {
      return {
        mode: 'linked',
        weekOffset: parseInt(match[1], 10),
        dayOffset: parseInt(match[2], 10)
      };
    }
  }

  // Option C: Legacy absolute string (ISO formats)
  const isIsoFormat = /^\d{4}-\d{2}-\d{2}$/.test(rawCommDate);
  if (isIsoFormat) {
    return {
      mode: 'fixed',
      date: rawCommDate
    };
  }

  // Backup fallback
  return { mode: 'unset' };
}
```

---

## 4. API Endpoints Payloads

When transmitting tasks over APIs, keep JSON payloads neat:

### Task Draft (Linked Mode)
```json
{
  "id": "task-abc-123",
  "name": "Social Campaign Post",
  "channelId": "ch-1",
  "date": {
    "mode": "linked",
    "weekOffset": 1,
    "dayOffset": 3
  }
}
```

### Task Draft (Fixed absolute)
```json
{
  "id": "task-def-456",
  "name": "Press Release Dispatch",
  "channelId": "ch-2",
  "date": {
    "mode": "fixed",
    "date": "2026-06-18"
  }
}
```
