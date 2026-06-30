# Codebase Modules Reference

An exhaustive directory guiding developers through the package contracts, interface files, store slices, and utility functions of the DCX Campaign Builder.

---

## 1. Type Models Directory (`src/types/` & `src/types.ts`)

Type definitions are split symmetrically between **system domain models** (structured relational trees) and **portal UI state models** to maintain strict decoupling.

### What `src/types/domain.ts` owns:
* **The Unified Timeline Schema:** `Phase`, `Action`, `Task`, `Subtask`. These core interface models must correspond strictly to database schemas and API serialization structures.
* **The `TaskDate` discriminated union:** Controls date resolution strategies (`unset`, `linked`, `fixed`).
* **Milestone parameters:** Icons (`PhaseIconType`) and nested array attributes.

### What `src/types/domain.ts` does NOT own:
* **Collaborator metadata:** Enforced inside `src/types.ts` as `User` or `AssignedMember`.
* **UI-specific UI layout variables:** Panel visibility states or button event interfaces.
* **Filter indices:** `FilterState` and `SavedView` are defined in standard `src/types.ts`.

---

## 2. API Boundaries (`src/services/`)

Service classes act as the boundary layer abstracting direct asynchronous HTTP operations or memory storage lookups. When migrating to a permanent Express or SQL backend, these service singletons map to specific REST API pathways:

### `projectsService`
* **Real Endpoint:** `GET /api/v1/clients-projects`
* **Contract:** `() => Promise<MockClient[]>`
* **Future Mapping:** Fetches active clients paired with target campaign catalog entries. Integrates with Workspace directory systems.

### `slaService`
* **Real Endpoint:** `GET /api/v1/channels/:channelId/sla`
* **Contract:** `(channelId: string) => Promise<SlaTaskRecommendation[]>`
* **Future Mapping:** Polls the database SLA template lookup table, matching recommended steps and durations for delivery.

### `usersService`
* **Real Endpoint:** `GET /api/v1/users`
* **Contract:** `() => Promise<User[]>`
* **Future Mapping:** Calls the Active Directory or LDAP/Identity provider directory for authorized collaborators.

### `versionsService`
* **Endpoints:**
  * `GET /api/v1/versions` & `GET /api/v1/versions/:id` — fetch sequence metadata.
  * `POST /api/v1/versions` — register new version sequence.
  * `PUT /api/v1/versions/:id` — overwrite version variables.
  * `PATCH /api/v1/versions/:id/phases` — update task blocks (utilizes optimistic UI / local caching during auto-save).
  * `PATCH /api/v1/versions/:id/status` — update validation stage flags.

---

## 3. Query Keys & Cache Management (`src/queries/`)

Managing async state is streamlined by consolidating query hooks underneath dedicated namespaces and query-key trees:

### Query Key Structure
* `["versions"]`: Collection containing all sandbox records. Invalidated when spawning or deleting version sequences.
* `["versions", versionId]`: Single-record key for detailed campaign Brief and visual builder views. Invalidated on task changes, metadata updates, or status toggles.

### Mutation side-effects rules:
* **Optimistic Local Intercept:** In highly interactive screens (the timeline builder), rapid visual changes (like shifting a phase position or checking subtasks) immediately execute an optimistic UI update, avoiding flashing screens while the mock database responds.
* **Cache Invalidation:** On success, the mutation immediately triggers:
  ```json
  queryClient.invalidateQueries({ queryKey: ["versions", versionId] })
  ```
  This guarantees that all adjacent components (such as Header statistics or Sidebar logs) automatically read the verified server truth.

---

## 4. State Management Slices (`src/store/`)

The application implements lightweight clientside stores using Zustand to broadcast live adjustments during timeline dragging or layout tuning:

### Store slices:
* **Active Node State:** Tracks which Phase/Action/Task is currently selected or focused by the editor panel.
* **Canvas Layout Coordinates:** Controls magnification variables (`zoomLevel`) and drag coordinates during horizontal canvas sliding.
* **Interactive Modals:** Manages popup and inspector overlay transitions anonymously without drilling state down.

---

## 5. System Utilities (`src/utils/`)

General utilities provide pure helper functions with strict input/output operations:

### `cn(...inputs: ClassValue[]): string` (found in `src/utils/cn.ts` or similar helpers)
* **Signature:** Takes dynamic arrays of Tailwind classes, merges conditional logic, and resolves conflict priorities utilizing `clsx` and `tailwind-merge`.

### `date.helpers.ts`
* `resolveTaskDate(date: TaskDate, versionStart: string): string`
  * **Signature:** `(date: TaskDate, versionStart: string) => string`
  * **Purpose:** The single source of truth for scheduling. Converts numeric offsets (e.g. Week 1, Day 2) relative to a master start date into a clean ISO date string for standard presentation.
* `getDateForWeekAndDay(start: string, weekOffset: number, dayOffset: number): string`
  * **Signature:** `(start: string, weekOffset: number, dayOffset: number) => string`
  * **Purpose:** Abstract math calculator adding weeks and day indices to an anchor calendar date.
* `formatDateString(isoString: string): string`
  * **Signature:** `(isoString: string) => string`
  * **Purpose:** Transforms machine dates into polished executive strings (e.g., "Jun 18, 2026").

---

## 6. Shared Primaries Props Reference (`src/components/ui/`)

Detailed API checklist for shared UX design blocks:

### `GlassCard`
* **File Path:** `/src/components/ui/GlassCard.tsx`
* **Props interface:**
  ```typescript
  interface GlassCardProps {
    children: React.ReactNode;
    isDark: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    radius?: 'none' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    className?: string;
  }
  ```
* **Usage Context:** Ideal for wrapping control consoles, widgets, sidebars, and grid elements to establish consistent depth gradients.

### `StatusBadge`
* **File Path:** `/src/components/ui/StatusBadge.tsx`
* **Props interface:**
  ```typescript
  interface StatusBadgeProps {
    status: VersionStatus;
    isDark: boolean;
  }
  ```
* **Usage Context:** Standardizing status chips for drafts, warnings, ready metrics, or approved certifications.
