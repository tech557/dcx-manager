# Builder — Stage Behaviour

**ID prefix:** BLD-STG

## Persistent stage ✅

The stage is the main workspace. Switching views replaces the visible card system inside the same workspace — not a different page. The stage uses a fixed-height working area. Vertical stage scrolling is not required. Horizontal navigation is allowed when cards exceed available width.

## Stage and island relationship ✅

Opening or closing an island must not reset:
- Card states
- Selection
- Focus
- Horizontal position
- Active week or month
- Current view
- Open editor sessions

## Island layout contracts ✅

| Island | Contract |
|---|---|
| Editor Island | Reserves workspace space (stage narrows). Cards remain accessible. |
| View Context | Overlays stage. Higher visual layer. Does not move or resize cards. |
| Focus Island | Filters visibility. Does not move cards. |
| File preview sessions | Sticky popup overlay. Does not affect stage geometry. |

## Card reveal and centring ✅

| Object | Centring rule |
|---|---|
| Phase | Centred as top-level card |
| Action | Centred within its parent Phase context |
| Task | Centred within its parent Action and Phase context |

## Stage density target ✅

Default on 14-inch MacBook at 100%: three expanded Phase cards, two to three expanded Actions per Phase, two to three collapsed Tasks per Action — without horizontal scrolling.

## View switching ✅

Clean transition when switching views (cards animate out/in). Selection, focus, expanded states, and active week preserved.
