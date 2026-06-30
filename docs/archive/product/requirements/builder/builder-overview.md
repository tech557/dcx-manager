# Builder — Overview and Purpose

**ID prefix:** BLD-OVR

## Purpose ✅

The DCX Builder is the central workspace for planning, viewing, editing and managing a Digital Communication Experience (DCX).

Long-term direction: a DCX control room where administrators can:
- Plan communication experiences
- View and amend existing versions
- Monitor execution
- Review results and analytics
- Control communication channels
- Access project files and team information
- Navigate between different operational views

## V1 Scope ✅

V1 is limited to:
- Planning
- Viewing
- Editing Task details
- Arranging the communication structure
- Assigning communication dates
- Readiness checking

## V2 Deferred Items 🔮

- AI-assisted creation and templates
- Real-time collaboration and presence
- Analytics and monitoring views
- Freeform (Miro-like) view
- Multi-selection presentation mode

## V1 Confirmed Views ✅

- Kanban
- Timeline Weekly
- Timeline Monthly

Architecture must support future views without overengineering V1.

## Planning Directions ✅

### Top-down (Kanban)
Phase → Action → Task → Task details → Communication date

### Bottom-up (Timeline)
Week → Day → Task → assign Phase and Action

Both directions create and update the same shared DCX version.

## Core Principles ✅

- Kanban and Timeline are connected planning views over the same version
- Cards preserve identity across views
- Card states are independent and may coexist
- Stage remains persistent while views and panels change
- Opening tools must not reset the user's context
- Builder behaves as a control room, not a sequence of disconnected forms
