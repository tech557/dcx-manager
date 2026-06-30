# API & Service Integrations Guide

This guide details the contract interfaces, synchronous endpoints, telemetry event schemes, and integration protocols for connecting the frontend Campaign Builder app to physical production backends.

---

## 1. Users API

Manages user authentication contexts, portal permissions, and team member profiles.

* **API Endpoints:**
  * `GET /api/v1/users` - Fetches the directory of team members and active accounts.
* **Payload Contract (User Shape):**
  ```typescript
  interface User {
    id: string;        // Unique registry uuid (e.g., "u-1")
    name: string;      // Full display name
    title: string;     // Job description (e.g., "Experience Designer")
    avatarUrl?: string;// Optional path or Google profile picture link
  }
  ```
* **Current Mock Location:** `/src/mock/users.ts` - holds a default static directory of creative staffers.
* **Backend Swap Instructions:**
  1. Substitute the mock endpoint in `/src/services/users.service.ts` with a real `fetch('/api/v1/users')` call.
  2. Implement backend JWT headers validation. Inject standard `Authorization: Bearer <token>` onto outbound requests.

---

## 2. Projects API

Provides the global catalog of clients and their active digital marketing accounts.

* **API Endpoints:**
  * `GET /api/v1/clients-projects` - Hierarchical list.
* **Payload Contract:**
  ```typescript
  interface MockProject {
    id: string;        // Project uuid (e.g., "p-101")
    name: string;      // Internal campaign title (e.g., "Gala Gala Dinner")
  }
  interface MockClient {
    id: string;        // Client corporate uuid
    name: string;      // Corporate Name (e.g., "HSA")
    projects: MockProject[];
  }
  ```
* **Eligibility & Deductions Logic:**
  * To promote modular simplicity, selecting a project can automatically deduce target products (e.g., names including "Activation" map to the *Social Engagement* workflow). On the backed, this calculation should be centralized into a campaign routing schema table.

---

## 3. Versions API

Coordinates active workspace configurations, including baseline descriptions, attachments, and collaborator permissions state.

* **API Endpoints:**
  * `GET /api/v1/versions` - Retrieves metadata of all existing sandboxes.
  * `GET /api/v1/versions/:id` - Fetch comprehensive sandbox configurations.
  * `POST /api/v1/versions` - Registers a new version entry.
  * `PUT /api/v1/versions/:id` - Performs an overwrite edit.
  * `PATCH /api/v1/versions/:id/status` - Changes version stage indicators.
* **Optimistic Update Strategy:**
  * On the version Brief modification screen, clicks on state options immediately update state in the frontend interface. In parallel, a request is fired over the wire. If the request encounters a failures, the mutation callbacks reset the state to its original baseline, displaying an alert toast.

---

## 4. Builder API

The core visual timeline engine. Transfers deeply nested, hierarchical stages (Phases → Actions → Tasks).

* **API Endpoints:**
  * `PATCH /api/v1/versions/:id/phases` - Overwrite tree layout in a bulk transactional request.
* **Debounce & Save Verification Cycle:**
  * To limit API congestion when users are actively drafting messages or tuning duration sliders inside the Builder canvas, a **500ms debounce** has been integrated into the central auto-save routine.
  * **Save Indicator States:**
    * `Idle`: All changes safely synced.
    * `Saving`: Auto-save debouncer has elapsed and patch payload is resolving.
    * `Saved`: Short successes confirmation message.
    * `Error`: Failed network dispatch, workspace is currently dirty.

---

## 5. SLA Recommendations API

Automated task checklists and suggested SLA completion timetables matching each unique outreach channel.

* **API Endpoints:**
  * `GET /api/v1/channels/:channelId/sla`
* **Response Shape Contract:**
  ```typescript
  interface SlaTaskRecommendation {
    label: string;     // Task summary (e.g. "Proofread HTML newsletter code")
    duration: string;  // Normal operational timeframe (e.g., "1.5 hrs")
  }
  ```
* **How to Wire to `IntakeSection.tsx`:**
  * Selecting a channel (e.g. email, slack, push) immediately triggers a query to the SLA service requesting recommended items. If found, a "Recommended Tasks" component lists items alongside checkboxes, allowing designers to apply standard checklists to task backlogs in one click.

---

## 6. Files & Attachments API

Integrates campaign briefs and creative guidelines stored on external storage units, such as Google Drive.

* **Current Drive Link Model:**
  * Drive attachments are stored as simple custom arrays of structures holding resource names and public Google URLs:
  ```json
  [{"title": "Creative Guideline v3", "url": "https://drive.google.com/..."}]
  ```
* **Future Preview Strategy:**
  * For production-grade releases, replace simple URL links with a **Google Picker API** overlay. Picked files can be queried using Google Drive OAuth credentials, and displayed inline using secure Google Docs Viewer iFrames.

---

## 7. Telemetry & Logs API

Tracks operations auditing events inside active workspaces to prevent conflicting edits when team members coordinate on campaigns.

* **Audit Events Registry:**
  * `WORKFLOW_STATUS_CHANGED`: Status adjustments (e.g., "In Progress" -> "Ready for Review").
  * `VERSION_CREATED`: Spawned a sequence.
  * `DRIVE_FILE_ATTACHED`: Link bound to sequence brief.
  * `TEAM_ROLE_REALLOCATED`: Modified collaborator lists.
* **Operational Rules for Telemetry:**
  * Log updates are stored dynamically inside local diagnostic logs container components, mirroring operational terminal systems.

---

## 8. Authentication & Governance

A staging protocol ensuring strict access gating when transitioning from mock environments to live production systems.

```
                  [ API Gateway / JWT Validate ]
                                │
          ┌─────────────────────┴─────────────────────┐
          ▼                                           ▼
 [ Campaign Stakeholder ]                    [ Workspace Member ]
  - Complete read privileges                  - Read-Write access granted
  - Can transition to "Approved"              - Sandbox drafting authorized
  - Can allocate strategic teams              - Limited to designated roles
```

By enforcing JWT permissions on the backend API routers, campaigns can be safely insulated within client-authorized scopes.
