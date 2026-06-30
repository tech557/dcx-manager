# Structure Refactor — Documented Assumptions

These are decisions that would normally require PO input. The plan proceeds with these
as stated. If any assumption is wrong, note it here and the relevant sprint must be revised
before execution.

---

## A1 — Backend field naming convention: camelCase

**Assumption**: The real backend API will use camelCase field names (same as current mock data).

**Why assumed**: The current mock data uses camelCase, all domain types use camelCase, and the mappers
were written for camelCase input. Changing to snake_case would require rewriting all 14 mappers.

**Impact if wrong**: If the real API uses snake_case, P4 must add a `camelizeKeys()` utility
(~30 lines, see BE-R3 Scenario B). The mappers are the correct place to absorb this. The UI is
unaffected regardless.

---

## A2 — Responsive contract: two separate targets by route

**Assumption**: The responsive contract is NOT desktop-only. It is split by route:

**Builder routes** (`/builder/*`):
- Target: 1440px → 4K+ (desktop + large TV, 75" and above)
- Below 1024px: not supported. Show a "use desktop" message + shareable version link.
- Atoms created in P2 for use inside the builder do NOT need mobile breakpoints.
- Must not break at very wide viewports (2560px, 3840px). Layouts must max-width or
  use fluid scaling so the builder canvas does not become unusably wide on 4K screens.

**All other routes** (login, version share page, home, version viewer, access screens):
- Target: mobile-first. These pages must work at 375px and above.
- All new atoms used in non-builder pages must include mobile-first Tailwind classes.

**Impact on P1-P2**: Typography tokens and spacing tokens must use rem (already planned).
New atoms must accept a `className` prop so the consumer can add breakpoint classes.
Builder-specific atoms (Chip, Badge used inside islands) need no mobile breakpoints.
Form atoms (Input, Select) used in non-builder pages must be tested at 375px.

**Impact on P3**: dep-cruiser layer rules must distinguish builder routes from public routes.
`src/pages/` (non-builder) must not import from `src/builder/`.

**Why assumed (partial)**: User confirmed: "the builder doesnt open in smaller screen and gives
you a shareable link for the version to use in desktop." Other pages are mobile-only.

---

## A3 — CSS modules: not adopted

**Assumption**: This project stays Tailwind-first with global CSS for truly shared classes.
CSS modules are not introduced.

**Why assumed**: Tailwind v4 with `@theme {}` directive is already the token mechanism.
CSS modules add build overhead and import boilerplate for minimal benefit in this context.

**Impact if wrong**: P2 would need to add `*.module.css` files alongside each component file.
This is an additive change that doesn't break anything already done.

---

## A4 — ai.service.ts and clickup.service.ts are future scope, not dead code

**Assumption**: These 2 service stubs are placeholders for features that will be built later.
They are left in place but documented clearly as stubs.

**Why assumed**: Both files are short (16 lines each), well-named, and follow the service
pattern correctly. They are not imported widely. No strong signal they are abandoned.

**Impact if wrong**: If they are dead code, delete both files and update any imports. Zero risk.

---

## A5 — attachVersionFile feature: fix to write mock data in P4

**Assumption**: The `attachVersionFile` function should actually persist file data to the mock
store (currently it's a no-op that returns its input). P4 fixes this.

**Why assumed**: The function signature and naming imply it should write. BE-R2 confirmed it
is a stub. The MetadataFilesPopup component calls it, implying the feature is meant to work.

**Impact if wrong**: If file attachment is intentionally read-only, P4 skip this fix.

---

## A6 — accent color canonical opacity scale: 6 levels

**Assumption**: The canonical accent color opacity scale is: 0.08 (subtle/border), 0.12 (soft bg),
0.15 (selected glow), 0.2 (bg), 0.3 (medium glow), 0.5 (strong glow). Any usage outside this
scale is considered drift and is mapped to the nearest canonical level during P1.

**Why assumed**: UX-R3 analysis showed 4 levels account for >80% of usage count.
The 1-off opacities (0.034, 0.065, 0.28, 0.34, 0.4, 0.45) each appear once and are drift.
Adding an `alpha()` utility covers any remaining one-off needs without adding tokens.

**Impact if wrong**: If a specific opacity level is intentional design, add it to the scale.

---

## A7 — Border radius canonical value for "card": 2.2rem

**Assumption**: `radiusTokens.card` (2.2rem) is the canonical "card" radius.
`PhaseCard.tsx`'s use of `rounded-2xl` (1rem) is a bug / drift, not intentional design.

**Why assumed**: 2.2rem is defined in radiusTokens.card. The dead CSS `.card-shell` also uses
2.2rem. The 1rem usage in PhaseCard appears to be a shortcut that was never aligned to the token.

**Impact if wrong**: If PhaseCard's 1rem radius is intentional (e.g., inner card vs outer surface),
then P2 needs to add a `radiusTokens.innerCard` = rounded-2xl and apply it to PhaseCard only.

---

## A8 — Split selection state: StageContext is source of truth

**Assumption**: `builderStore.selection` (selectedNodeIds, focusedNodeId) is stale/deprecated.
StageContext is the live source of truth. The store fields will be removed in P4.

**Why assumed**: FE-R2 found that all consumers of selection state read from `useStageContext()`,
not from the builderStore. The store's selection fields are written by an unused `setSelection`
action.

**Impact if wrong**: If something reads builderStore.selection directly (possibly for persistence),
removing it would break that flow. Run a grep for `builderStore.selection` or `setSelection`
before executing this P4 step.

---

---

## Codex + Gemini Review — Points Reviewed 2026-06-26

The following decisions were updated after reading the Codex and Gemini review logs:

| Decision | Changed? | Outcome |
|---|---|---|
| P2: Badge as single mega-component | YES — changed | Badge is now a visual primitive + semantic wrappers |
| P2: Move all src/components/ to src/ui/ | YES — changed | Generic inputs → src/ui/forms/; builder buttons/feedback → src/builder/ui/ |
| P2: Merge all 3 editor hooks | YES — changed | Only useActiveNode merged into useEditorDraft; panel/draft/guard stay separate |
| P3: LightRays fix "pick one after reading" | YES — changed | Option A (prop injection) made explicit |
| P4: domain types extend api types | YES — changed | Domain types stay independent (no extends); mapper is the only boundary |
| P4: per-service try/catch | YES — changed | Centralized `withServiceErrorHandler()` wrapper instead |
| CSS modules | NO — held | Tailwind-first; no build overhead for modules |
| StageContext split deferred | NO — held | Too many consumers; post-v1 scope |
| Contract tests in P4 | NO — not added | No test infrastructure exists in project; post-v1 scope |
| source-structure.csv | NO — not added | Valid idea but additive scope; separate future sprint |
| build-log-index.sh bug | NOT in this plan | Real bug identified by both reviewers; separate fix outside this plan |

---

## A9 — No real API in P4, only mock-readiness

**Assumption**: P4 does NOT wire a real fetch call. The goal is that a developer could connect
a real API by swapping 8 service files and nothing else. The app runs identically with mock data.

**Why assumed**: User explicitly said "make sure we dont integrate backend right now it should
be ready with mockdata to represent every endpoint now."

**Impact**: P4 produces a clean seam but no network calls.
