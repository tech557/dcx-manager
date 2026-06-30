# Product

## Register

product

## Users

Campaign planners and marketing strategists working inside a structured workflow hierarchy
(Project → Campaign → Version → Phase → Action → Task). They spend long sessions inside the builder
canvas composing and reviewing multi-phase campaign structures. Context: focused desktop work,
often in low-light environments. Primary task: create, arrange, and review campaign phases and
action cards on the builder stage.

## Product Purpose

DCX Manager is a campaign-planning workspace. It replaces the chaos of spreadsheets and
ticket-tracker workarounds with a purpose-built builder canvas. Success means a planner can
compose a full campaign structure — with all its phases, actions, tasks, and readiness states —
without ever leaving the builder. The product earns trust by being precise, responsive, and
never getting in the way.

## Brand Personality

Intelligent, Precise, Immersive.

The UI is calm and authoritative — it knows what it is. Every surface earns its density. The glass
and stage visual language reinforces that the planner is working inside a purposeful environment,
not filling in a form. Motion is deliberate: state changes are noticed, not jarring.

## Anti-references

- **Jira / Asana / ClickUp** — dense enterprise ticket-tracker with busy toolbars, status columns,
  and sprawling sidebar navs. DCX Manager is a builder, not a list manager.
- **Generic SaaS dashboards** — navy sidebar, KPI metric tiles, chart grids, admin-panel grid of
  cards. DCX Manager has no metric tiles and no generic sidebar.
- **Ticket-management tools** — any UI that looks like backlog triage rather than campaign
  composition.
- **Futuristic AI demos** — glowing neon-on-black, particle effects, cyberpunk aesthetic. The glass
  and dark surfaces should feel editorial and crafted, not like a sci-fi HUD.

## Design Principles

1. **The canvas is the product** — the builder stage is primary. UI chrome recedes; content
   advances. Every pixel of chrome should justify itself against canvas space.
2. **Density serves the planner** — information density is a feature, not a problem. But density
   must be structured: clear hierarchy, not clutter.
3. **State is always visible** — readiness, selection, focus, and error states are never hidden.
   A planner should never have to wonder what the builder is doing.
4. **Motion communicates, never decorates** — every animation answers a question ("what just
   changed?"). Reduced-motion is a first-class path, not an afterthought.
5. **One visual language, no exceptions** — glass surfaces, hover-light effects, and the stage
   layout are the product's identity. No ad-hoc deviations.

## Accessibility & Inclusion

- Reduced motion: mandatory. Every animation has a `prefers-reduced-motion` branch (≤100ms fade
  or instant). See `core.md §20`.
- Contrast: body text ≥4.5:1 against background; large text ≥3:1.
- Dark and light themes are both supported and must be tested independently.
- No pure black (`#000000`) or pure white (`#FFFFFF`) tokens (live offenders tracked in plan README).
