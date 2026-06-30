# System Architecture Documentation

Welcome to the Digital Communication Experience (DCX) Campaign Builder architecture reference. This guide outlines the system design, directory structure, data models, state mechanisms, component hierarchy, and complete operational flows.

---

## 1. System Overview

The campaign builder is a desktop-optimized, highly interactive single-page application facilitating rapid design, orchestration, scheduling, and validation of multi-channel outreach components.

### Product Areas (Core Pillars)
1. **Campaign Dashboard (Launchpad):** 
   A high-level operations board helping teams filter, browse, and search active client workspace portfolios, inspect current sequence versions, track milestone statuses, and spawn new sandbox workspaces with auto-incremented sequence codes.
2. **Experience Workspace Sandbox:**
   A dedicated contextual control deck for a specific campaign version where engineers and designers oversee team roles, verify critical dates, manage attachments (e.g., mockups, briefs), and launch the multi-stage visual builder.
3. **Interactive Visual Sequence Builder:**
   A highly visual canvas interface consisting of infinite lanes (Phases) nested with tactical objectives (Actions), content payloads (Tasks), live metadata inspector panels, live-updating SLA recommendations, and fluid viewport adjustments.

### Technical Stack
* **Runtime Framework:** React 18+ (bundled with Vite) utilizing TypeScript for compile-time safety and type enforcement.
* **Styling & Layout:** Tailwind CSS 4.x utility classes representing professional negative space, typography, and fluid desktop constraints.
* **Query & Cache Layer:** `@tanstack/react-query` (v5) providing declarative data fetching, loading-state hooks, automatic retries, and clean cache key invalidation workflows.
* **Component Motion & Animation:** `motion` (by Framer Motion) governing transitions, micro-animation cues, sliding inspector panes, and hover indicator offsets.

---

## 2. Folder Structure

Below is the annotated directory layout of the application showing clear boundaries of responsibility.

```
/
├── docs/                             # Dedicated offline system architecture and module documentation
├── src/
│   ├── components/                   # Universally shared standalone reusable interface assets
│   │   ├── forms/                    # Form widgets, dropdown selects, role allocations, and date inputs
│   │   ├── popup/                    # Modals and sliding popups supporting custom overlay layers
│   │   └── ui/                       # Theme-compliant atomic primitives (GlassCard, StatusBadge)
│   ├── mock/                         # Simulated offline state caches and relational entity matrices
│   ├── pages/                        # Multi-screen application controllers forming the core views
│   │   ├── builder/                  # Infinite timeline grid, phase lanes, action cards, and task modules
│   │   ├── home/                     # Portfolios directory, search filters, metrics, and list elements
│   │   └── version/                  # Sandbox brief console, collaborator avs, and status checklists
│   ├── queries/                      # TanStack React Query custom hooks mapping async actions to mutations
│   ├── services/                     # Mock endpoint interfaces mimicking real REST routes and parameters
│   ├── store/                        # Zustand store maintaining hot-reload active editor settings
│   ├── types/                        # Global system model types
│   │   └── domain.ts                 # Direct type-safety schemas for core timeline elements
│   ├── utils/                        # System-wide helpers (date offset logic, math, classes combiner)
│   ├── App.tsx                       # Master screen selector, theme manager, and root router logic
│   ├── index.css                     # Global stylesheet initializing Tailwind variables and keyframes
│   ├── main.tsx                      # Vite Client bootstrapper mounting the React Virtual DOM root
│   └── types.ts                      # Common portal-level, user-access, and layout state models
```

---

## 3. Data Model

The core timeline utilizes an strictly checked parent-child relational tree to guarantee schedule integrity:

```
[Phase] (Milestone bounds, e.g. "Launch Phase")
  └── [Action] (Tactical objective bounds, e.g. "Email Announcement Day 1")
        └── [Task] (Individual outreach dispatch, e.g. "Slack Alert to Employees")
              └── [TaskDate] (Discriminated schedule union mapping placement style)
```

### Discriminator Detail: `TaskDate`
* **Unset:** Mode `'unset'`. Task lives on the builder desk as raw workspace draft backlog but carries no calendar constraints.
* **Linked:** Mode `'linked'`. Schedules relative to the shared Campaign Anchor Start Date. Offsets are tracked via `weekOffset` (e.g. Week 2) and `dayOffset` (e.g. Wednesday). Resolves dynamically in the client view without corrupting records.
* **Fixed:** Mode `'fixed'`. Anchors directly to an absolute date string (YYYY-MM-DD), unaffected by anchor moves.

---

## 4. State Model

State is segregated using a structured multi-tiered strategy for optimal refresh cycles and developer clarity:

| State Layer | Scope & Purpose | Technologies | Typical Contents |
| :--- | :--- | :--- | :--- |
| **Server Cache State** | Persistent, asynchronous enterprise logs and relational records. | `react-query` + `localStorage` | Active campaigns, nested sequence versions, user registries. |
| **Global Client UI State** | Lightweight hot-swappable layout configurations shared broadly. | `zustand` | Scale indices, dragging node states, active side panel tabs. |
| **Local Component State** | Ephemeral, isolated interactive properties. | React `useState` | Search text inputs, dropdown expanded toggles, active form logs. |

---

## 5. Component Hierarchy

Component relationships flow downwards symmetrically through dedicated abstraction layers:

```
App (Router, Theme & Query Context Provider)
└── Home (Page View)
│   ├── Hero (Campaign launcher button trigger)
│   ├── SearchFilters (SavedView selections)
│   ├── StatsOverview (Active campaign counts)
│   └── VersionsList (Browsing table) -> VersionCard
│
└── VersionPage (Page View)
│   ├── VersionStatusBar (Staging state switcher)
│   ├── VersionSwitchBar (Auto-increment version creator)
│   └── VersionSummary (Brief summary card)
│
└── BuilderPage (Root Infinite Canvas Container)
    ├── BuilderHeader (SLA score indicators, Save Status label)
    ├── ViewHelperIsland (Scale controllers, resize drawers, map guides)
    └── PhaseSwimlanes (Dynamic horizontal timeline columns)
        └── ActionCard (Grouped objectives)
            └── TaskItem (Channel icons, status badges, click edit)
```

---

## 6. Data Flow Diagram

Operation flows follow unidirectional circular paths from user triggers to cache validation:

```
[ User Action ] 
  (e.g., Dragging task or checking off a subtask in the Editor Island)
         │
         ▼
[ Client Store Dispatch / local update ]
  (Zustand stores temporary positions or local form prepares payload)
         │
         ▼
[ Service API Trigger (Mutation) ]
  (useUpdateVersionMutation or patchVersionPhases fires)
         │
         ▼
[ Network Server Request Simulation ]
  (service delay -> updates localStore JSON records -> returns 200 OK)
         │
         ▼
[ Query Invalidation (Side Effect) ]
  (TanStack query cache keys marked stale for 'versions' or 'version')
         │
         ▼
[ Automatic Re-fetch & UI Render ]
  (Connected hook triggers Virtual DOM diff, rendering clean state)
```
